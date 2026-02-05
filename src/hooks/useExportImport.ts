
import React, { useCallback, useState } from 'react';
import { GameData, Scene, View } from '../types';
import { getFontUrl, getFrameClass, getMimeTypeFromFileName } from '../utils/helpers';
import { prepareGameDataForEngine, gameJS } from '../components/game-engine';
import { gameHTML, gameCSS, initialGameData } from '../lib/gameDefaults';
import DOMPurify from 'dompurify';

declare var JSZip: any;

interface UseExportImportProps {
    gameData: GameData;
    setGameData: React.Dispatch<React.SetStateAction<GameData>>;
    setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
    setImportKey: React.Dispatch<React.SetStateAction<number>>;
    setCurrentView: (view: View) => void;
    toast: (title: string, description: string, variant?: "default" | "destructive" | "success" | "error") => void;
    profile: any; // User profile
}

export const useExportImport = ({
    gameData,
    setGameData,
    setIsDirty,
    setImportKey,
    setCurrentView,
    toast,
    profile
}: UseExportImportProps) => {

    const [isImporting, setIsImporting] = useState(false);

    const handleExport = async () => {
        if (typeof JSZip === 'undefined') {
            alert('A biblioteca JSZip não foi carregada. Não é possível exportar.');
            return;
        }

        const zip = new JSZip();
        // Check if we are using cloud assets or local base64?
        // IF Builder stores everything in JSON as base64 or URL.
        // We need to bundle assets.

        const exportData = JSON.parse(JSON.stringify(gameData));
        const assetsFolder = zip.folder("assets");
        const assetMap = new Map<string, string>(); // base64 -> filename

        const processAsset = (base64String: string | undefined, baseName: string): string | undefined => {
            if (!base64String || !base64String.startsWith('data:')) return base64String;
            if (assetMap.has(base64String)) return assetMap.get(base64String);

            const commaIndex = base64String.indexOf(',');
            if (commaIndex === -1) return base64String;

            const header = base64String.substring(0, commaIndex);
            const data = base64String.substring(commaIndex + 1);

            const mimeMatch = header.match(/data:([^;]+)/);
            if (!mimeMatch || !mimeMatch[1]) return base64String;

            const mimeType = mimeMatch[1];
            let extension = mimeType.split('/')[1]?.split('+')[0] || 'bin';

            const filename = `assets/${baseName}.${extension}`;
            assetsFolder.file(`${baseName}.${extension}`, data, { base64: true });
            assetMap.set(base64String, filename);
            return filename;
        };

        exportData.gameLogo = processAsset(exportData.gameLogo, 'logo');
        exportData.gameSplashImage = processAsset(exportData.gameSplashImage, 'splash_image');
        exportData.gameBackgroundMusic = processAsset(exportData.gameBackgroundMusic, 'global_bgm');
        exportData.positiveEndingImage = processAsset(exportData.positiveEndingImage, 'positive_ending');
        exportData.negativeEndingImage = processAsset(exportData.negativeEndingImage, 'negative_ending');

        for (const sceneId in exportData.scenes) {
            const scene = exportData.scenes[sceneId];
            scene.image = processAsset(scene.image, `scene_image_${sceneId}`);
            scene.backgroundMusic = processAsset(scene.backgroundMusic, `scene_bgm_${sceneId}`);
            if (scene.interactions) {
                scene.interactions.forEach((inter: any, index: number) => {
                    inter.soundEffect = processAsset(inter.soundEffect, `sfx_${sceneId}_${index}`);
                });
            }
        }

        for (const objId in exportData.globalObjects) {
            const obj = exportData.globalObjects[objId];
            obj.image = processAsset(obj.image, `obj_image_${objId}`);
        }

        // Add Metadata
        const exportDate = new Date();
        const userName = profile?.username?.replace(/[^a-zA-Z0-9 _-]/g, '') || 'IF Builder User';

        exportData.metadata = {
            exportedBy: userName,
            exportDate: exportDate.toISOString(),
            platform: 'IF Builder',
            version: '1.0'
        };

        const readmeContent = `
================================================================
                    GAME INFORMATION
================================================================

TITLE:       ${exportData.gameTitle || 'Untitled Game'}
PLATFORM:    IF Builder
EXPORTED BY: ${userName}
DATE:        ${exportDate.toLocaleString()}

================================================================
        THANK YOU FOR CREATING WITH IF BUILDER
================================================================
`.trim();

        zip.file("README.txt", readmeContent);
        zip.file("editor_data.json", JSON.stringify(exportData));
        const fontFamily = exportData.gameFontFamily || "'Silkscreen', sans-serif";
        const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
        let fontStylesheet = '';
        let finalCss = exportData.gameCSS;

        if (fontName) {
            const googleFontName = fontName.replace(/ /g, '+');
            const fontCssUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;700&display=swap`;
            try {
                const cssResponse = await fetch(fontCssUrl);
                if (cssResponse.ok) {
                    let fontCssText = await cssResponse.text();
                    const fontUrlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
                    const fontFolder = zip.folder("fonts");
                    const fontUrlsToDownload = new Set<string>();
                    let match;
                    while ((match = fontUrlRegex.exec(fontCssText)) !== null) fontUrlsToDownload.add(match[1]);

                    for (const originalUrl of fontUrlsToDownload) {
                        const fontFileName = originalUrl.substring(originalUrl.lastIndexOf('/') + 1);
                        fontCssText = fontCssText.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `fonts/${fontFileName}`);
                        const fontRes = await fetch(originalUrl);
                        if (fontRes.ok) fontFolder.file(fontFileName, await fontRes.blob());
                    }
                    finalCss = fontCssText + '\n\n' + finalCss;
                } else {
                    const fontUrl = getFontUrl(fontFamily);
                    fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
                }
            } catch (e) {
                const fontUrl = getFontUrl(fontFamily);
                fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
            }
        }

        const engineData = prepareGameDataForEngine(exportData);
        const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');
        const finalGameScript = `window.embeddedGameData = ${safeJson};\n\n${gameJS}`;

        const trackersButtonHTML = (exportData.gameSystemEnabled === 'trackers' && (exportData.gameShowTrackersUI ?? true)) ? '<button id="trackers-button">__TRACKERS_BUTTON_TEXT__</button>' : '';
        const systemButtonHTML = (exportData.gameShowSystemButton ?? true) ? '<button id="system-button">__SYSTEM_BUTTON_TEXT__</button>' : '';

        const inventoryButtonHTML = (exportData.enableInventory ?? true)
            ? `<button id="inventory-button">${exportData.gameInventoryButtonText || 'Inventário'}</button>`
            : '';

        const diaryButtonHTML = (exportData.enableDiary ?? true)
            ? `<button id="diary-button">${exportData.gameDiaryButtonText || 'Diário'}</button>`
            : '';

        let htmlContent = gameData.gameHTML
            .replace('__GAME_TITLE__', exportData.gameTitle || 'IF Builder Game')
            .replace('__THEME_CLASS__', `${exportData.gameTheme || 'dark'}-theme with-spacing`)
            .replace('__LAYOUT_ORIENTATION_CLASS__', exportData.gameLayoutOrientation === 'horizontal' ? 'layout-horizontal' : '')
            .replace('__LAYOUT_ORDER_CLASS__', exportData.gameLayoutOrder === 'image-last' ? 'layout-image-last' : '')
            .replace('__FRAME_CLASS__', getFrameClass(exportData.gameImageFrame))
            .replace('__MOBILE_BEHAVIOR_CLASS__', 'behavior-immersive')
            .replace('__FONT_STYLESHEET__', fontStylesheet)
            .replace('__CHANCES_CONTAINER__', (exportData.enableChances || exportData.gameSystemEnabled === 'chances') ? '<div id="chances-container" class="chances-container"></div>' : '')
            .replace('__TRACKERS_BUTTON__', trackersButtonHTML)
            .replace('__SYSTEM_BUTTON__', systemButtonHTML)
            .replace('__INVENTORY_BUTTON__', inventoryButtonHTML)
            .replace('__DIARY_BUTTON__', diaryButtonHTML)
            .replace(/__INVENTORY_BUTTON_TEXT__/g, exportData.gameInventoryButtonText || 'Inventário')
            .replace(/__SUGGESTIONS_BUTTON_TEXT__/g, exportData.gameSuggestionsButtonText || 'Sugestões')
            .replace(/__TRACKERS_BUTTON_TEXT__/g, exportData.gameTrackersButtonText || 'Rastreadores')
            .replace(/__SYSTEM_BUTTON_TEXT__/g, exportData.gameSystemButtonText || 'Sistema')
            .replace('__SAVE_MENU_TITLE__', exportData.gameSaveMenuTitle || 'Salvar Jogo')
            .replace('__LOAD_MENU_TITLE__', exportData.gameLoadMenuTitle || 'Carregar Jogo')
            .replace('__MAIN_MENU_BUTTON_TEXT__', exportData.gameMainMenuButtonText || 'Menu Principal')
            .replace('__SPLASH_BG_STYLE__', exportData.gameSplashImage ? `style="background-image: url('${exportData.gameSplashImage}')"` : '')
            .replace('__SPLASH_ALIGN_CLASS__', exportData.gameSplashContentAlignment === 'left' ? 'align-left' : '')
            .replace('__SPLASH_LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="splash-logo">` : '')
            .replace('__SPLASH_TITLE_H1_TAG__', !exportData.gameOmitSplashTitle ? `<h1>${exportData.gameTitle}</h1>` : '')
            .replace('__SPLASH_DESCRIPTION__', exportData.gameSplashDescription || '')
            .replace('__SPLASH_BUTTON_TEXT__', exportData.gameSplashButtonText || 'Start')
            .replace('__CONTINUE_BUTTON_TEXT__', exportData.gameContinueButtonText || 'Continue')
            .replace(/__RESTART_BUTTON_TEXT__/g, exportData.gameRestartButtonText || 'Reiniciar Aventura')
            .replace('__ACTION_BUTTON_TEXT__', exportData.gameActionButtonText || 'Action')
            .replace('__VERB_INPUT_PLACEHOLDER__', exportData.gameVerbInputPlaceholder || 'What do you do?')
            .replace('__VIEW_ENDING_BUTTON_TEXT__', exportData.gameViewEndingButtonText || 'Ver Final')
            .replace('__POSITIVE_ENDING_BG_STYLE__', exportData.positiveEndingImage ? `style="background-image: url('${exportData.positiveEndingImage}')"` : '')
            .replace('__POSITIVE_ENDING_ALIGN_CLASS__', exportData.positiveEndingContentAlignment === 'left' ? 'align-left' : '')
            .replace('__POSITIVE_ENDING_DESCRIPTION__', exportData.positiveEndingDescription || '')
            .replace('__NEGATIVE_ENDING_BG_STYLE__', exportData.negativeEndingImage ? `style="background-image: url('${exportData.negativeEndingImage}')"` : '')
            .replace('__NEGATIVE_ENDING_ALIGN_CLASS__', exportData.negativeEndingContentAlignment === 'left' ? 'align-left' : '')
            .replace('__NEGATIVE_ENDING_DESCRIPTION__', exportData.negativeEndingDescription || '');

        htmlContent = htmlContent.replace('</body>', '<script src="game.js"></script></body>');

        const css = finalCss
            .replace(/__FONT_FAMILY__/g, fontFamily)
            .replace(/__GAME_FONT_SIZE__/g, exportData.gameFontSize || '1em')
            .replace(/__GAME_TEXT_COLOR__/g, exportData.gameTextColor || '#c9d1d9')
            .replace(/__GAME_TITLE_COLOR__/g, exportData.gameTitleColor || '#58a6ff')
            .replace(/__GAME_FOCUS_COLOR__/g, exportData.gameFocusColor || '#58a6ff')
            .replace(/__GAME_TEXT_COLOR_LIGHT__/g, exportData.textColorLight || '#24292f')
            .replace(/__GAME_TITLE_COLOR_LIGHT__/g, exportData.titleColorLight || '#0969da')
            .replace(/__GAME_FOCUS_COLOR_LIGHT__/g, exportData.focusColorLight || '#0969da')
            .replace(/__SPLASH_BUTTON_COLOR__/g, exportData.gameSplashButtonColor || '#2ea043')
            .replace(/__SPLASH_BUTTON_HOVER_COLOR__/g, exportData.gameSplashButtonHoverColor || '#238636')
            .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
            .replace(/__ACTION_BUTTON_COLOR__/g, exportData.gameActionButtonColor || '#ffffff')
            .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
            .replace(/__ACTION_BUTTON_TEXT_COLOR__/g, exportData.gameActionButtonTextColor || '#0d1117')
            .replace(/__FRAME_BOOK_COLOR__/g, exportData.gameFrameColor || '#FFFFFF')
            .replace(/__FRAME_TRADING_CARD_COLOR__/g, exportData.gameFrameColor || '#FFFFFF')
            .replace(/__FRAME_ROUNDED_TOP_COLOR__/g, exportData.gameFrameColor || '#FFFFFF')
            .replace(/__SCENE_NAME_OVERLAY_BG__/g, exportData.gameSceneNameOverlayBg || '#0d1117')
            .replace(/__SCENE_NAME_OVERLAY_TEXT_COLOR__/g, exportData.gameSceneNameOverlayTextColor || '#c9d1d9')
            .replace(/__CONTINUE_INDICATOR_COLOR__/g, exportData.gameContinueIndicatorColor || exportData.gameTitleColor || '#58a6ff');

        zip.file("index.html", htmlContent);
        zip.file("style.css", css);
        zip.file("game.js", finalGameScript);

        const zipContent = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        const finalBlob = new Blob([zipContent], { type: "application/zip" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(finalBlob);
        link.download = `${exportData.gameTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'game'}.zip`;
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }, 100);
    };

    const handleImportGame = useCallback((data: GameData) => {
        let cleanedScenes = { ...data.scenes };
        let newStartSceneId = data.startScene;
        const newSceneOrder = [...(data.sceneOrder || Object.keys(cleanedScenes))];

        if (data.vignettes && data.vignettes.length > 0) {
            console.log("Migrating legacy vignettes...", data.vignettes);
            data.vignettes.forEach((v: any) => {
                let type: 'opening' | 'transition' | 'conclusion' | 'none' = 'transition';
                if (v.isConclusion) type = 'conclusion';
                else if (v.id.toUpperCase().includes('OPENING') || v.id.toUpperCase().includes('INTRO')) type = 'opening';
                else if (v.id === 'VNT_DEFEAT') type = 'conclusion'; // Defeat is now a conclusion layout

                const newScene: Scene = {
                    id: v.id,
                    name: v.name || v.title || 'Vinheta',
                    description: v.description || '',
                    image: v.image,
                    backgroundMusic: v.backgroundMusic,
                    vignetteType: type,
                    vignetteButtonText: v.buttonText,
                    interactions: [],
                    objectIds: [],
                    mapX: 0,
                    mapY: 0,
                    isDefeatOutcome: v.id === 'VNT_DEFEAT' ? true : undefined
                };

                if (type === 'opening' && data.startScene) {
                    newScene.vignetteNextSceneId = data.startScene;
                    newStartSceneId = v.id;
                }

                cleanedScenes[v.id] = newScene;
                if (!newSceneOrder.includes(v.id)) {
                    if (type === 'opening') newSceneOrder.unshift(v.id);
                    else newSceneOrder.push(v.id);
                }
            });

            Object.values(cleanedScenes).forEach(scene => {
                if (scene.interactions) {
                    scene.interactions = scene.interactions.map(interaction => {
                        if ((interaction as any).goToVignette) {
                            const targetVignetteId = (interaction as any).goToVignette;
                            if (cleanedScenes[targetVignetteId]) {
                                return {
                                    ...interaction,
                                    type: 'scene',
                                    goToScene: targetVignetteId,
                                    goToVignette: undefined
                                };
                            }
                        }
                        return interaction;
                    });
                }
            });
        }

        Object.keys(cleanedScenes).forEach(id => {
            cleanedScenes[id] = {
                ...cleanedScenes[id],
                objectIds: cleanedScenes[id].objectIds || [],
                interactions: cleanedScenes[id].interactions || [],
                mapX: undefined,
                mapY: undefined,
                isEndingScene: undefined,
                conclusionVignetteId: undefined
            };
        });

        if (newStartSceneId && cleanedScenes[newStartSceneId]) {
            const startScene = cleanedScenes[newStartSceneId];
            const isGenericName = startScene.name === 'Abertura' || startScene.name === 'Vinheta';

            if (isGenericName && data.gameTitle && data.gameTitle.trim() !== '') {
                cleanedScenes[newStartSceneId] = {
                    ...startScene,
                    name: data.gameTitle
                };
            }
        }

        setGameData(prev => ({
            ...prev,
            ...data,
            scenes: cleanedScenes,
            sceneOrder: newSceneOrder,
            startScene: newStartSceneId,
            gameHTML: gameHTML,
            gameCSS: gameCSS,
            gameMobileLayoutBehavior: 'immersive',
            fixedVerbs: data.fixedVerbs || [],
            enableFixedVerbs: !!data.enableFixedVerbs || (Array.isArray(data.fixedVerbs) && data.fixedVerbs.length > 0),
            consequenceTrackers: data.consequenceTrackers || [],
            gameTextAnimationType: data.gameTextAnimationType || 'fade',
            gameTextSpeed: data.gameTextSpeed || 5,
            gameImageTransitionType: data.gameImageTransitionType || 'fade',
            gameImageSpeed: data.gameImageSpeed || 5,
            gameShowTrackersUI: data.gameShowTrackersUI ?? true,
            gameShowSystemButton: data.gameShowSystemButton ?? true,
            gameViewEndingButtonText: data.gameViewEndingButtonText || 'Ver Final',
            positiveEndingMusic: data.positiveEndingMusic || '',
            negativeEndingMusic: data.negativeEndingMusic || '',
            vignettes: []
        }));

        setIsDirty(false);
        setImportKey(prev => prev + 1);
        toast("Projeto Importado", "Projeto carregado e migrado com sucesso.", "success");
        setCurrentView('scenes');
    }, [gameData.scenes, gameData.sceneOrder, setGameData, setIsDirty, setImportKey, setCurrentView, toast]);

    const handleImportFile = async (file: File) => {
        if (typeof JSZip === 'undefined') {
            alert('A biblioteca JSZip não foi carregada. Não é possível importar.');
            return;
        }

        setIsImporting(true);

        const reader = new FileReader();
        if (file.name.endsWith('.zip')) {
            reader.onload = async (ev) => {
                try {
                    const zip = await JSZip.loadAsync(ev.target?.result);
                    const editorDataStr = await zip.file('editor_data.json')?.async('string');
                    if (!editorDataStr) throw new Error("editor_data.json não encontrado no pacote ZIP.");
                    const data = JSON.parse(editorDataStr);

                    const restoreAsset = async (path: string | undefined): Promise<string | undefined> => {
                        if (!path) return path;
                        let entryPath = path;
                        if (path.startsWith('assets /')) entryPath = path.replace('assets / ', 'assets/');
                        else if (!path.startsWith('assets/')) return path;

                        const zipFile = zip.file(entryPath);
                        if (!zipFile) return path;

                        const mimeType = getMimeTypeFromFileName(path);
                        const buffer = await zipFile.async('arraybuffer');
                        const blob = new Blob([buffer], { type: mimeType });

                        return new Promise((resolve) => {
                            const readerAsset = new FileReader();
                            readerAsset.onloadend = () => resolve(readerAsset.result as string);
                            readerAsset.readAsDataURL(blob);
                        });
                    };

                    data.gameLogo = await restoreAsset(data.gameLogo);
                    data.gameSplashImage = await restoreAsset(data.gameSplashImage);
                    data.gameBackgroundMusic = await restoreAsset(data.gameBackgroundMusic);
                    data.positiveEndingImage = await restoreAsset(data.positiveEndingImage);
                    data.negativeEndingImage = await restoreAsset(data.negativeEndingImage);

                    if (data.scenes) {
                        for (const sId in data.scenes) {
                            const scene = data.scenes[sId];
                            scene.image = await restoreAsset(scene.image);
                            scene.backgroundMusic = await restoreAsset(scene.backgroundMusic);
                            if (scene.interactions) {
                                for (const inter of scene.interactions) {
                                    inter.soundEffect = await restoreAsset(inter.soundEffect);
                                }
                            }
                        }
                    }

                    if (data.vignettes && Array.isArray(data.vignettes)) {
                        for (const vignette of data.vignettes) {
                            vignette.image = await restoreAsset(vignette.image);
                            vignette.backgroundMusic = await restoreAsset(vignette.backgroundMusic);
                        }
                    }

                    if (data.globalObjects) {
                        for (const oId in data.globalObjects) {
                            const obj = data.globalObjects[oId];
                            obj.image = await restoreAsset(obj.image);
                        }
                    }

                    handleImportGame(data);
                } catch (err) {
                    alert("Erro ao importar ZIP: " + (err as Error).message);
                } finally {
                    setIsImporting(false);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = (ev) => {
                try {
                    const content = ev.target?.result as string;
                    const parsed = JSON.parse(content);
                    if (!parsed || typeof parsed !== 'object') throw new Error("Arquivo inválido");
                    handleImportGame(parsed);
                } catch (error) {
                    console.error("Erro ao importar:", error);
                    toast("Erro na Importação", "O arquivo selecionado não é um JSON válido ou está corrompido.", "error");
                } finally {
                    setIsImporting(false);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleDownloadExample = () => {
        const element = document.createElement("a");
        element.href = "/fuja_da_masmorra.zip";
        element.download = "fuja_da_masmorra.zip";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return {
        handleExport,
        handleImportFile,
        handleImportGame,
        handleDownloadExample,
        isImporting
    };
};
