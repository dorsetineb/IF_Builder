
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from './UserContext';
import { Auth } from './Auth';
import { useToast } from './ToastContext';
import { GameData, Scene, GameObject, Interaction, View, ConsequenceTracker, FixedVerb, Vignette } from '../types';
import Sidebar from './Sidebar';
import SceneEditor from './SceneEditor';
import Header from './Header';
import { WelcomePlaceholder } from './WelcomePlaceholder';
import { GuideView } from './GuideView';
import { UIEditor } from './UIEditor';
// import VignettesEditor from './VignettesEditor'; // Removed as integrated into SceneEditor
import Preview from './Preview';
import SceneMap from './SceneMap';
import GlobalObjectsEditor from './GlobalObjectsEditor';
import TrackersEditor from './TrackersEditor';
import GlobalCommandsEditor from './GlobalCommandsEditor';
import { ConfirmationModal } from './ConfirmationModal';
import { NewProjectModal } from './NewProjectModal';
import { TransitionScreen } from './TransitionScreen';
import UserManualModal from './UserManualModal';
import { gameJS, prepareGameDataForEngine } from './game-engine';
import { gameHTML, gameCSS, initialGameData } from '../lib/gameDefaults';
import { Info, Settings as SettingsIcon, CircleHelp } from 'lucide-react';
import Settings from '../pages/Settings';
import AboutProject from '../pages/AboutProject';

declare var JSZip: any;

const getFontUrl = (fontFamily: string) => {
    const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
    if (!fontName) return '';
    const googleFontName = fontName.replace(/ /g, '+');
    return `https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap`;
};

const getFrameClass = (frame?: GameData['gameImageFrame']): string => {
    switch (frame) {
        case 'rounded-top': return 'frame-rounded-top';
        case 'book-cover': return 'frame-book-cover';
        case 'trading-card': return 'frame-trading-card';
        default: return 'frame-none';
    }
}

const getMimeTypeFromFileName = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'svg': return 'image/svg+xml';
        case 'webp': return 'image/webp';
        case 'mp3':
        case 'mpeg': return 'audio/mpeg';
        case 'ogg': return 'audio/ogg';
        case 'wav': return 'audio/wav';
        case 'm4a':
        case 'mp4': return 'audio/mp4';
        default: return 'application/octet-stream';
    }
}





const generateUniqueId = (prefix: 'scn' | 'obj' | 'inter' | 'trk' | 'verb', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 9)} `;
    } while (existingIds.includes(id));
    return id;
};



import { useTheme } from './ThemeProvider';

// ... (existing imports)

const Editor: React.FC = () => {
    const { toast } = useToast();
    const { user, profile, loading: authLoading } = useUser();
    const { theme: appTheme } = useTheme();
    const navigate = useNavigate();

    const [isTransitioning, setIsTransitioning] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.title = "IF Builder / Ficções Interativas";
        return () => {
            document.title = "IF Builder / Ficções Interativas";
        };
    }, []);

    const [importKey, setImportKey] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 2000); // 2s duration
        return () => clearTimeout(timer);
    }, []);

    const handleNavigate = (path: string) => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(path);
        }, 2000); // 2s duration
    };

    const handleExit = () => handleNavigate('/dashboard');

    // Session loading handled by UserContext now.
    // If we need to block rendering until auth is ready:
    const loadingSession = authLoading;



    const handleLogout = async () => {
        try {
            // Perform actual logout
            await supabase.auth.signOut({ scope: 'global' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            // App.tsx will handle the redirect to Auth
        }
    };

    const [gameData, setGameData] = useState<GameData>(initialGameData);

    // --- Auto-Detection Logic for Legacy Saves ---
    const detectedActiveSystems = useMemo(() => {
        let hasInventoryUsage = false;
        let hasChancesUsage = false;
        // Cast to any to avoid strict type error if property missing in old types
        const hasTrackers = (gameData as any).trackers && (gameData as any).trackers.length > 0;

        // Scan all scenes for usage
        if (gameData.scenes) {
            Object.values(gameData.scenes).forEach((scene: any) => {
                if (scene.removesChanceOnEntry || scene.restoresChanceOnEntry) {
                    hasChancesUsage = true;
                }
                if (scene.interactions) {
                    scene.interactions.forEach((interaction: any) => {
                        if (interaction.addsToInventory || interaction.requiresInInventory) {
                            hasInventoryUsage = true;
                        }
                    });
                }
            });
        }

        return {
            inventory: hasInventoryUsage,
            chances: hasChancesUsage,
            trackers: hasTrackers
        };
    }, [gameData.scenes, (gameData as any).trackers]);

    const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
    const [previewSceneId, setPreviewSceneId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>('scenes');
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { },
        isDanger: false
    });
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

    const closeConfirmationModal = () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    };

    const [isManualOpen, setIsManualOpen] = useState(false);

    const handleExport = async () => {
        if (typeof JSZip === 'undefined') {
            alert('A biblioteca JSZip não foi carregada. Não é possível exportar.');
            return;
        }
        const zip = new JSZip();
        const assetsFolder = zip.folder("assets");
        if (!assetsFolder) return;

        const exportData = JSON.parse(JSON.stringify(gameData));
        const assetMap = new Map<string, string>();

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

            const filename = `assets / ${baseName}.${extension} `;
            assetsFolder.file(`${baseName}.${extension} `, data, { base64: true });
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
            scene.image = processAsset(scene.image, `scene_image_${sceneId} `);
            scene.backgroundMusic = processAsset(scene.backgroundMusic, `scene_bgm_${sceneId} `);
            if (scene.interactions) {
                scene.interactions.forEach((inter: any, index: number) => {
                    inter.soundEffect = processAsset(inter.soundEffect, `sfx_${sceneId}_${index} `);
                });
            }
        }

        for (const objId in exportData.globalObjects) {
            const obj = exportData.globalObjects[objId];
            obj.image = processAsset(obj.image, `obj_image_${objId} `);
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
            .replace('__MOBILE_BEHAVIOR_CLASS__', 'behavior-immersive') // FIXO: COMPORTAMENTO IMERSIVO
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
            .replace(/__FRAME_BOOK_COLOR__/g, exportData.frameBookColor || '#FFFFFF')
            .replace(/__FRAME_TRADING_CARD_COLOR__/g, exportData.frameTradingCardColor || '#1c1917')
            .replace(/__FRAME_ROUNDED_TOP_COLOR__/g, exportData.frameRoundedTopColor || '#facc15')
            .replace(/__SCENE_NAME_OVERLAY_BG__/g, exportData.gameSceneNameOverlayBg || '#0d1117')
            .replace(/__SCENE_NAME_OVERLAY_TEXT_COLOR__/g, exportData.gameSceneNameOverlayTextColor || '#c9d1d9')
            .replace(/__CONTINUE_INDICATOR_COLOR__/g, exportData.gameContinueIndicatorColor || exportData.gameTitleColor || '#58a6ff');

        zip.file("index.html", htmlContent);
        zip.file("style.css", css);
        zip.file("game.js", finalGameScript);

        // Explicitly set MIME type to avoid browser security warnings
        const zipContent = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        const finalBlob = new Blob([zipContent], { type: "application/zip" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(finalBlob);
        link.download = `${exportData.gameTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'game'}.zip`;
        document.body.appendChild(link);
        link.click();

        // Delay cleanup to ensure browser captures the download
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }, 100);
    };

    const handleImportFile = async (file: File) => {
        if (typeof JSZip === 'undefined') {
            alert('A biblioteca JSZip não foi carregada. Não é possível importar.');
            return;
        }

        const reader = new FileReader();
        if (file.name.endsWith('.zip')) {
            reader.onload = async (ev) => {
                try {
                    const zip = await JSZip.loadAsync(ev.target?.result);
                    const editorDataStr = await zip.file('editor_data.json')?.async('string');
                    if (!editorDataStr) throw new Error("editor_data.json não encontrado no pacote ZIP.");

                    const data = JSON.parse(editorDataStr);

                    const restoreAsset = async (path: string | undefined): Promise<string | undefined> => {
                        if (!path || !path.startsWith('assets/')) return path;
                        const zipFile = zip.file(path);
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

                    if (data.globalObjects) {
                        for (const oId in data.globalObjects) {
                            const obj = data.globalObjects[oId];
                            obj.image = await restoreAsset(obj.image);
                        }
                    }

                    handleImportGame(data);
                } catch (err) {
                    alert("Erro ao importar ZIP: " + (err as Error).message);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = (ev) => handleImportGame(JSON.parse(ev.target?.result as string));
            reader.readAsText(file);
        }
    };

    const scenesList = useMemo(() => {
        return gameData.sceneOrder.map(id => gameData.scenes[id]).filter(Boolean);
    }, [gameData.scenes, gameData.sceneOrder]);

    const selectedScene = selectedSceneId ? gameData.scenes[selectedSceneId] : null;

    const fixedVerbs = useMemo(() => gameData.fixedVerbs || [], [gameData.fixedVerbs]);
    const consequenceTrackers = useMemo(() => gameData.consequenceTrackers || [], [gameData.consequenceTrackers]);

    const handleImportGame = useCallback((data: GameData) => {
        let cleanedScenes = { ...data.scenes };
        let newStartSceneId = data.startScene;
        const newSceneOrder = [...(data.sceneOrder || Object.keys(cleanedScenes))];

        // MIGRATION: Auto-convert Legacy Vignettes to Scenes
        if (data.vignettes && data.vignettes.length > 0) {
            console.log("Migrating legacy vignettes...", data.vignettes);
            data.vignettes.forEach((v: any) => {
                // Determine type
                let type: 'opening' | 'transition' | 'conclusion' | 'none' = 'transition';
                if (v.isConclusion) type = 'conclusion';
                else if (v.id.toUpperCase().includes('OPENING') || v.id.toUpperCase().includes('INTRO')) type = 'opening';

                // Create new Scene from Vignette
                const newScene: Scene = {
                    id: v.id,
                    name: v.name || v.title || 'Vinheta',
                    description: v.description || '', // Map description to scene text
                    image: v.image,
                    backgroundMusic: v.backgroundMusic,
                    vignetteType: type,
                    vignetteButtonText: v.buttonText,
                    // Default properties for a scene
                    interactions: [],
                    objectIds: [],
                    mapX: 0, // Will be arranged later
                    mapY: 0
                };

                // Link Opening Vignette to the original Start Scene
                if (type === 'opening' && data.startScene) {
                    newScene.vignetteNextSceneId = data.startScene;
                    newStartSceneId = v.id; // Set this as the new entry point
                }

                // Add to scenes
                cleanedScenes[v.id] = newScene;
                if (!newSceneOrder.includes(v.id)) {
                    // Prepend opening, append others
                    if (type === 'opening') newSceneOrder.unshift(v.id);
                    else newSceneOrder.push(v.id);
                }
            });

            // Update Interactions to point to new scenes instead of vignettes
            Object.values(cleanedScenes).forEach(scene => {
                if (scene.interactions) {
                    scene.interactions = scene.interactions.map(interaction => {
                        // Check if this interaction was pointing to a vignette
                        // Legacy data might have 'goToVignette' property or specific logic
                        if ((interaction as any).goToVignette) {
                            const targetVignetteId = (interaction as any).goToVignette;
                            // Check if this ID exists in our new scenes (was migrated)
                            if (cleanedScenes[targetVignetteId]) {
                                return {
                                    ...interaction,
                                    type: 'scene', // Change type to scene
                                    goToScene: targetVignetteId,
                                    goToVignette: undefined // Remove legacy prop
                                };
                            }
                        }
                        return interaction;
                    });
                }

                // Also check 'conclusionVignetteId' legacy prop on scene
                if ((scene as any).conclusionVignetteId && (scene as any).isEndingScene) {
                    const targetVId = (scene as any).conclusionVignetteId;
                    if (cleanedScenes[targetVId]) {
                        // We can't easily transform "Ending Scene" to "Go To Scene" without an interaction.
                        // But if it's an ending scene, it usually just showed the vignette.
                        // We might need to keep it as an ending scene but maybe change how it works?
                        // For now, let's assume the user will fix minor logic or we map it if we can.
                        // Actually, the new system uses 'vignetteType' on the scene itself.
                        // So a scene that WAS an ending scene pointing to a vignette...
                        // effectively just transitions to that vignette scene now.

                        // Let's create an auto-interaction for it?
                        // Or just let it be. The user said "Import legacy... it has opening and two conclusions".
                    }
                }
            });
        }

        Object.keys(cleanedScenes).forEach(id => {
            cleanedScenes[id] = {
                ...cleanedScenes[id],
                objectIds: cleanedScenes[id].objectIds || [],
                interactions: cleanedScenes[id].interactions || [],
                // Reset layout coordinates to force auto-arrangement
                mapX: undefined,
                mapY: undefined,
                // Clean legacy props
                isEndingScene: undefined, // remove legacy ending flag
                conclusionVignetteId: undefined
            };
        });

        setGameData(prev => ({
            ...prev,
            ...data,
            scenes: cleanedScenes,
            sceneOrder: newSceneOrder,
            startScene: newStartSceneId,
            gameHTML: gameHTML,
            gameCSS: gameCSS,
            // Ensure immersive behavior for imported games
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
            vignettes: [] // Always clear legacy vignettes array
        }));

        setIsDirty(false);
        setImportKey(prev => prev + 1);
        toast("Projeto Importado", "Projeto carregado e migrado com sucesso.", "success");
        setCurrentView('scenes');
    }, [gameHTML, gameCSS, toast]);

    const handleUpdateGameData = (field: keyof GameData | Partial<GameData>, value?: any, skipDirty?: boolean) => {
        if (typeof field === 'object' && field !== null) {
            const updates = field as Partial<GameData>;
            setGameData(prev => ({ ...prev, ...updates }));
            // If called with just one argument (updates object), mark as dirty unless specified (though skipDirty arg position varies)
            // In VignettesEditor call: onUpdate(updates). So value is undefined.
            setIsDirty(true);
            return;
        }

        const key = field as keyof GameData;
        setGameData(prev => {
            if (key === 'gameSystemEnabled' && value === 'trackers') {
                return { ...prev, [key]: value, gameShowTrackersUI: true };
            }
            return { ...prev, [key]: value };
        });
        if (!skipDirty) {
            setIsDirty(true);
        }
    };

    const handleAddScene = () => {
        const newId = generateUniqueId('scn', Object.keys(gameData.scenes));
        const newScene: Scene = {
            id: newId,
            name: 'Nova Cena',
            image: '',
            description: 'Descrição da nova cena.',
            objectIds: [],
            interactions: [],
            vignetteType: 'none'
        };

        setGameData(prev => {
            const newScenes = { ...prev.scenes, [newId]: newScene };
            const updatedOrder = [...prev.sceneOrder, newId];
            const isFirst = updatedOrder.length === 1;
            return {
                ...prev,
                scenes: newScenes,
                sceneOrder: updatedOrder,
                startScene: isFirst ? newId : prev.startScene
            };
        });
        setCurrentView('scenes');
        setSelectedSceneId(newId);
        setIsDirty(true);
    };

    const handleDownloadExample = () => {
        const element = document.createElement("a");
        element.href = "/fuja_da_masmorra.zip";
        element.download = "fuja_da_masmorra.zip";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleDeleteScene = (id: string) => {
        if (id === gameData.startScene && Object.keys(gameData.scenes).length > 1) {
            toast("Ação não permitida", "Você não pode deletar a cena inicial. Defina outra cena como inicial antes de excluir esta.", "error");
            return;
        }

        const proceedWithDelete = () => {
            setGameData(prev => {
                const newScenes = { ...prev.scenes };
                delete newScenes[id];
                const updatedOrder = prev.sceneOrder.filter(sid => sid !== id);
                let newStart = prev.startScene;
                if (newStart === id) {
                    newStart = updatedOrder.length > 0 ? updatedOrder[0] : '';
                }

                Object.values(newScenes).forEach((scene: Scene) => {
                    if (scene.interactions) {
                        scene.interactions = scene.interactions.filter(i => i.goToScene !== id);
                    }
                    if (scene.exits) {
                        const exits = scene.exits as any;
                        Object.keys(exits).forEach(key => {
                            if (exits[key] === id) delete exits[key];
                        });
                    }
                });

                return {
                    ...prev,
                    scenes: newScenes,
                    sceneOrder: updatedOrder,
                    startScene: newStart
                };
            });

            if (id === selectedSceneId) {
                const newSceneId = gameData.sceneOrder.find(sid => sid !== id) || '';
                setSelectedSceneId(newSceneId);
            }
            setIsDirty(true);
            toast("Cena deletada", "A cena foi removida com sucesso.", "success");
            closeConfirmationModal();
        };

        setConfirmationModal({
            isOpen: true,
            title: "Deletar Cena",
            message: "Tem certeza que deseja deletar esta cena? Esta ação não pode ser desfeita e removerá todas as referências a ela.",
            isDanger: true,
            onConfirm: proceedWithDelete,
            onCancel: closeConfirmationModal
        });



    };

    const handleUpdateScene = (updatedScene: Scene) => {
        setGameData(prev => ({
            ...prev,
            scenes: { ...prev.scenes, [updatedScene.id]: updatedScene }
        }));
        setIsDirty(true);
    };

    const handleCopyScene = (sceneToCopy: Scene) => {
        const newId = generateUniqueId('scn', Object.keys(gameData.scenes));
        const newScene: Scene = {
            ...JSON.parse(JSON.stringify(sceneToCopy)),
            id: newId,
            name: `${sceneToCopy.name} (Cópia)`,
        };

        setGameData(prev => {
            const newScenes = { ...prev.scenes, [newId]: newScene };
            const orderWithNew = [...prev.sceneOrder, newId];
            return {
                ...prev,
                scenes: newScenes,
                sceneOrder: orderWithNew
            };
        });
        setCurrentView('scenes');
        setSelectedSceneId(newId);
        setIsDirty(true);
    };

    const handleAddVignette = useCallback(() => {
        const newId = `VNT_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const newVignette: Vignette = {
            id: newId,
            name: 'Nova Vinheta',
            title: '',
            description: '',
            contentAlignment: 'left',
            verticalAlignment: 'bottom'
        };
        setGameData(prev => ({
            ...prev,
            vignettes: [...(prev.vignettes || []), newVignette]
        }));
        setIsDirty(true);
        // Optional: switch to vignettes view?
        // setCurrentView('vignettes');
        // But user is in Scene Map, better stay there.
        toast("Vinheta Criada", "Nova vinheta criada com sucesso.", "success");
    }, []);


    const handleReorderScenes = (newSceneIds: string[]) => {
        setGameData(prev => ({ ...prev, sceneOrder: newSceneIds }));
        setIsDirty(true);
    };

    const handleSelectScene = (id: string) => {
        setCurrentView('scenes');
        setSelectedSceneId(id);
    };

    const handleSetView = (view: View) => {
        setCurrentView(view);
        if (view === 'scenes' && !selectedSceneId && scenesList.length > 0) {
            setSelectedSceneId(scenesList[0].id);
        }
    };

    const handleNewGame = () => {
        const hasScenes = Object.keys(gameData.scenes).length > 0;

        if (hasScenes) {
            setConfirmationModal({
                isOpen: true,
                title: "Novo Jogo",
                message: "Existem cenas criadas neste projeto. Ao criar uma nova ficção, todas as alterações não salvas serão perdidas. Deseja continuar?",
                isDanger: true,
                onConfirm: () => {
                    closeConfirmationModal();
                    setIsNewProjectModalOpen(true);
                },
                onCancel: closeConfirmationModal
            });
        } else {
            setIsNewProjectModalOpen(true);
        }
    };

    const handleProjectCreated = (newGameData: Partial<GameData>) => {
        setIsNewProjectModalOpen(false);
        setGameData({
            ...initialGameData,
            ...newGameData
        });
        setIsDirty(false);
        setImportKey(prev => prev + 1);
        setCurrentView('scenes'); // Or 'interface' if you prefer to land on settings
        toast("Nova Ficção Criada", "Projeto iniciado com sucesso!", "success");
    };

    const handleStartCreating = () => {
        handleAddScene();
        setCurrentView('interface');
    };

    const handleCreateNewProject = (overrideData?: Partial<GameData>) => {
        const hasScenes = Object.keys(gameData.scenes).length > 0;

        const createProject = () => {
            setGameData({
                ...initialGameData,
                ...overrideData,
                // Ensure unique ID for start scene if not provided (though initialData serves base)
                // But we usually want fresh state.
            });
            setIsDirty(false);
            setImportKey(prev => prev + 1);
            // If vignettes are created, switch to vignettes view? Or just interface?
            // User said: "generate at least one opening vignette".
            // So if vignettes exist, maybe show them? Or show Interface (UIEditor) as requested "decisions... reflected there".
            // Interface view allows configuring Appearance.
            setCurrentView('interface');
        };

        if (hasScenes) {
            setConfirmationModal({
                isOpen: true,
                title: "Novo Projeto",
                message: "Deseja iniciar um novo projeto? O projeto atual (não exportado) será perdido.",
                isDanger: true,
                onConfirm: () => {
                    closeConfirmationModal();
                    createProject();
                },
                onCancel: closeConfirmationModal
            });
        } else {
            createProject();
        }
    };

    const handleCreateGlobalObject = (obj: GameObject, linkToSceneId?: string) => {
        setGameData(prev => {
            const newObjects = { ...prev.globalObjects, [obj.id]: obj };
            let updatedScenes = prev.scenes;

            if (linkToSceneId && prev.scenes[linkToSceneId]) {
                const scene = prev.scenes[linkToSceneId];
                updatedScenes = {
                    ...prev.scenes,
                    [linkToSceneId]: {
                        ...scene,
                        objectIds: [...(scene.objectIds || []), obj.id]
                    }
                };
            }

            return { ...prev, globalObjects: newObjects, scenes: updatedScenes };
        });
        setIsDirty(true);
    };

    const handleUpdateGlobalObject = (objectId: string, updatedData: Partial<GameObject>) => {
        setGameData(prev => ({
            ...prev,
            globalObjects: {
                ...prev.globalObjects,
                [objectId]: { ...prev.globalObjects[objectId], ...updatedData }
            }
        }));
        setIsDirty(true);
    };

    const handleDeleteGlobalObject = (objectId: string) => {
        const obj = gameData.globalObjects[objectId];
        if (!obj) return;

        const scenesUsingObject = Object.values(gameData.scenes).filter((s: Scene) => s.objectIds?.includes(objectId));

        if (scenesUsingObject.length > 0) {
            const sceneNames = scenesUsingObject.map((s: Scene) => s.name).join(', ');
            if (!window.confirm(`Este objeto está vinculado às seguintes cenas: ${sceneNames}. Tem certeza que deseja excluí-lo do jogo completamente?`)) {
                return;
            }
        }

        setGameData(prev => {
            const newObjects = { ...prev.globalObjects };
            delete newObjects[objectId];

            const updatedScenes = { ...prev.scenes };
            Object.keys(updatedScenes).forEach(id => {
                const scene = updatedScenes[id];
                let sceneChanged = false;
                let newObjectIds = scene.objectIds || [];
                let newInteractions = scene.interactions || [];

                if (newObjectIds.includes(objectId)) {
                    newObjectIds = newObjectIds.filter(oid => oid !== objectId);
                    sceneChanged = true;
                }

                if (newInteractions.some(inter => inter.target === objectId || inter.requiresInInventory === objectId)) {
                    newInteractions = newInteractions.map(inter => {
                        if (inter.target === objectId || inter.requiresInInventory === objectId) {
                            return {
                                ...inter,
                                target: inter.target === objectId ? '' : inter.target,
                                requiresInInventory: inter.requiresInInventory === objectId ? undefined : inter.requiresInInventory
                            };
                        }
                        return inter;
                    });
                    sceneChanged = true;
                }

                if (sceneChanged) {
                    updatedScenes[id] = { ...scene, objectIds: newObjectIds, interactions: newInteractions };
                }
            });

            return { ...prev, globalObjects: newObjects, scenes: updatedScenes };
        });
        setIsDirty(true);
    };

    const handleLinkObjectToScene = (sceneId: string, objectId: string) => {
        setGameData(prev => {
            const scene = prev.scenes[sceneId];
            if (scene.objectIds.includes(objectId)) return prev;

            return {
                ...prev,
                scenes: {
                    ...prev.scenes,
                    [sceneId]: {
                        ...scene,
                        objectIds: [...scene.objectIds, objectId]
                    }
                }
            };
        });
        setIsDirty(true);
    };

    const handleUnlinkObjectFromScene = (sceneId: string, objectId: string) => {
        setGameData(prev => {
            const scene = prev.scenes[sceneId];
            return {
                ...prev,
                scenes: {
                    ...prev.scenes,
                    [sceneId]: {
                        ...scene,
                        objectIds: scene.objectIds.filter(id => id !== objectId)
                    }
                }
            };
        });
        setIsDirty(true);
    };

    const handleUpdateTrackers = (trackers: ConsequenceTracker[]) => {
        setGameData(prev => ({ ...prev, consequenceTrackers: trackers }));
        setIsDirty(true);
    };

    const handleUpdateScenePosition = (sceneId: string, x: number, y: number) => {
        setGameData(prev => ({
            ...prev,
            scenes: {
                ...prev.scenes,
                [sceneId]: { ...prev.scenes[sceneId], mapX: x, mapY: y }
            }
        }));
        setIsDirty(true);
    };


    const handleGoToForum = async () => {
        setIsSaving(true);
        // Clean save simulation if needed, or trigger actual save if implemented
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
        navigate('/community');
    };

    if (loadingSession) {
        return <TransitionScreen isVisible={true} />;
    }

    if (!user) {
        return <Auth />;
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
            <TransitionScreen isVisible={isTransitioning} />
            {isPreviewing ? (
                <div className="flex flex-col w-full h-full">
                    <Header
                        gameData={gameData}
                        isPreviewing={isPreviewing}
                        onTogglePreview={() => setIsPreviewing(false)}
                        onNewGame={handleNewGame}
                        onLogout={handleLogout}
                        onHome={() => {
                            setCurrentView('scenes');
                            setSelectedSceneId(null);
                        }}
                    />
                    <Preview gameData={gameData} testSceneId={previewSceneId} />
                </div>
            ) : (
                <div className="flex flex-col h-full w-full">

                    <Header
                        gameData={gameData}
                        isPreviewing={isPreviewing}
                        onTogglePreview={() => {
                            setPreviewSceneId(null);
                            setIsPreviewing(true);
                        }}
                        onNewGame={handleNewGame}
                        onLogout={handleLogout}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                        onExport={handleExport}
                        onImport={handleImportFile}
                        onHome={() => {
                            setCurrentView('scenes');
                            setSelectedSceneId(null);
                        }}
                        currentView={currentView}
                    />
                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar
                            scenes={scenesList}
                            startSceneId={gameData.startScene}
                            selectedSceneId={selectedSceneId}
                            currentView={currentView}
                            gameData={gameData}
                            onSelectScene={handleSelectScene}
                            onAddScene={handleAddScene}
                            onDeleteScene={handleDeleteScene}
                            onReorderScenes={handleReorderScenes}
                            onSetView={handleSetView}
                            onExit={handleExit}
                            onNavigate={handleNavigate}
                            onImportGame={handleImportGame}
                            onTogglePreview={() => {
                                setPreviewSceneId(null);
                                setIsPreviewing(true);
                            }}
                            isCollapsed={sidebarCollapsed}
                            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                            isDirty={isDirty}
                            onOpenManual={() => setIsManualOpen(true)}
                            theme={appTheme}
                        />
                        <main className={`flex-1 overflow-y-auto relative bg-background ${currentView === 'scenes' && !selectedScene ? 'p-0' : 'p-6'}`}>
                            {/* currentView === 'vignettes' block removed */}
                            {currentView === 'interface' && (
                                <UIEditor
                                    key={importKey}
                                    {...gameData}
                                    enableInventory={gameData.enableInventory ?? detectedActiveSystems.inventory}
                                    enableChances={(gameData.enableChances ?? detectedActiveSystems.chances) || gameData.gameSystemEnabled === 'chances'}
                                    enableTrackers={(gameData.enableTrackers ?? detectedActiveSystems.trackers) || gameData.gameSystemEnabled === 'trackers'}
                                    html={gameData.gameHTML}
                                    css={gameData.gameCSS}
                                    onUpdate={handleUpdateGameData}
                                    isDirty={isDirty}
                                    onSetDirty={setIsDirty}
                                    title={gameData.gameTitle || ''}
                                    logo={gameData.gameLogo || ''}
                                    omitSplashTitle={!!gameData.gameOmitSplashTitle}
                                    splashImage={gameData.gameSplashImage || ''}
                                    splashContentAlignment={gameData.gameSplashContentAlignment || 'right'}
                                    splashDescription={gameData.gameSplashDescription || ''}
                                    backgroundMusic={gameData.gameBackgroundMusic || ''}
                                    positiveEndingImage={gameData.positiveEndingImage || ''}
                                    positiveEndingContentAlignment={gameData.positiveEndingContentAlignment || 'right'}
                                    positiveEndingDescription={gameData.positiveEndingDescription || ''}
                                    positiveEndingMusic={gameData.positiveEndingMusic || ''}
                                    negativeEndingImage={gameData.negativeEndingImage || ''}
                                    negativeEndingContentAlignment={gameData.negativeEndingContentAlignment || 'right'}
                                    negativeEndingDescription={gameData.negativeEndingDescription || ''}
                                    negativeEndingMusic={gameData.negativeEndingMusic || ''}
                                    fixedVerbs={fixedVerbs}
                                    actionButtonText={gameData.gameActionButtonText || 'Ação'}
                                    verbInputPlaceholder={gameData.gameVerbInputPlaceholder || 'O que você faz?'}
                                    diaryPlayerName={gameData.gameDiaryPlayerName || 'Jogador'}
                                    splashButtonText={gameData.gameSplashButtonText || 'INICIAR'}
                                    continueButtonText={gameData.gameContinueButtonText || 'Continuar'}
                                    restartButtonText={gameData.gameRestartButtonText || 'Reiniciar'}
                                    gameInteractionType={gameData.gameInteractionType || 'parser'}
                                    gameSystemEnabled={gameData.gameSystemEnabled || 'none'}
                                    maxChances={gameData.gameMaxChances || 3}
                                    textColor={gameData.gameTextColor || '#c9d1d9'}
                                    titleColor={gameData.gameTitleColor || '#58a6ff'}
                                    splashButtonColor={gameData.gameSplashButtonColor || '#2ea043'}
                                    splashButtonHoverColor={gameData.gameSplashButtonHoverColor || '#238636'}
                                    splashButtonTextColor={gameData.gameSplashButtonTextColor || '#ffffff'}
                                    actionButtonColor={gameData.gameActionButtonColor || '#ffffff'}
                                    actionButtonTextColor={gameData.gameActionButtonTextColor || '#0d1117'}
                                    focusColor={gameData.gameFocusColor || '#58a6ff'}
                                    chanceIconColor={gameData.gameChanceIconColor || '#ff4d4d'}
                                    gameFontFamily={gameData.gameFontFamily || "'Silkscreen', sans-serif"}
                                    gameFontSize={gameData.gameFontSize || '0.75em'}
                                    chanceIcon={gameData.gameChanceIcon || 'heart'}
                                    chanceReturnButtonText={gameData.gameChanceReturnButtonText || 'Tentar Novamente'}
                                    gameTheme={gameData.gameTheme || 'dark'}
                                    textColorLight={gameData.textColorLight || '#24292f'}
                                    titleColorLight={gameData.titleColorLight || '#0969da'}
                                    focusColorLight={gameData.focusColorLight || '#0969da'}
                                    frameBookColor={gameData.frameBookColor || '#FFFFFF'}
                                    frameTradingCardColor={gameData.frameTradingCardColor || '#1c1917'}
                                    frameRoundedTopColor={gameData.frameRoundedTopColor || '#facc15'}
                                    gameSceneNameOverlayBg={gameData.gameSceneNameOverlayBg || '#0d1117'}
                                    gameSceneNameOverlayTextColor={gameData.gameSceneNameOverlayTextColor || '#c9d1d9'}
                                    gameShowTrackersUI={gameData.gameShowTrackersUI ?? true}
                                    gameShowSystemButton={gameData.gameShowSystemButton ?? true}
                                    imageFrame={gameData.gameImageFrame || 'none'}
                                    layoutOrder={gameData.gameLayoutOrder || 'image-first'}
                                    layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                                    suggestionsButtonText={gameData.gameSuggestionsButtonText}
                                    inventoryButtonText={gameData.gameInventoryButtonText}
                                    diaryButtonText={gameData.gameDiaryButtonText}
                                    diaryShowSceneImage={gameData.diaryShowSceneImage}
                                    diaryShowPlayerAction={gameData.diaryShowPlayerAction}
                                    trackersButtonText={gameData.gameTrackersButtonText}
                                    gameSystemButtonText={gameData.gameSystemButtonText}
                                    gameSaveMenuTitle={gameData.gameSaveMenuTitle}
                                    gameLoadMenuTitle={gameData.gameLoadMenuTitle}
                                    gameMainMenuButtonText={gameData.gameMainMenuButtonText}
                                    gameContinueIndicatorColor={gameData.gameContinueIndicatorColor || '#58a6ff'}
                                    gameViewEndingButtonText={gameData.gameViewEndingButtonText || 'Ver Final'}
                                    textAnimationType={gameData.gameTextAnimationType || 'fade'}
                                    textSpeed={gameData.gameTextSpeed || 5}
                                    imageTransitionType={gameData.gameImageTransitionType || 'fade'}
                                    imageSpeed={gameData.gameImageSpeed || 5}
                                    onNavigateToTrackers={() => handleSetView('trackers')}
                                />
                            )}
                            {currentView === 'scenes' && selectedScene ? (
                                <SceneEditor
                                    scene={selectedScene}
                                    allScenes={scenesList}
                                    globalObjects={gameData.globalObjects}
                                    onUpdateScene={handleUpdateScene}
                                    onCopyScene={handleCopyScene}
                                    onCreateGlobalObject={handleCreateGlobalObject}
                                    onLinkObjectToScene={handleLinkObjectToScene}
                                    onUnlinkObjectFromScene={handleUnlinkObjectFromScene}
                                    onUpdateGlobalObject={handleUpdateGlobalObject}
                                    enableChances={(gameData.enableChances ?? detectedActiveSystems.chances) || gameData.gameSystemEnabled === 'chances'}
                                    gameSystemEnabled={gameData.gameSystemEnabled}
                                    onPreviewScene={(scene) => {
                                        setPreviewSceneId(scene.id);
                                        setIsPreviewing(true);
                                    }}
                                    onSelectScene={handleSelectScene}
                                    isDirty={isDirty}
                                    onSetDirty={setIsDirty}
                                    layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                                    consequenceTrackers={consequenceTrackers}
                                    isStartScene={selectedScene.id === gameData.startScene}
                                    gameInteractionType={gameData.gameInteractionType || 'parser'}
                                    vignettes={gameData.vignettes || []}
                                    onViewMap={() => handleSetView('map')}
                                />
                            ) : currentView === 'scenes' ? (
                                <WelcomePlaceholder
                                    onCreateScene={handleCreateNewProject}
                                    onDownloadExample={handleDownloadExample}
                                    onMeetProject={() => setCurrentView('about')}
                                    theme={appTheme}
                                />
                            ) : currentView === 'guide' ? (
                                <GuideView />
                            ) : null}

                            {currentView === 'map' && (
                                <SceneMap
                                    allScenesMap={gameData.scenes}
                                    globalObjects={gameData.globalObjects}
                                    startSceneId={gameData.startScene}
                                    vignettes={gameData.vignettes || []}
                                    onSelectScene={handleSelectScene}
                                    onUpdateScenePosition={handleUpdateScenePosition}
                                    onUpdateVignettePosition={(vignetteId, x, y) => {
                                        setGameData(prev => ({
                                            ...prev,
                                            vignettes: (prev.vignettes || []).map(v =>
                                                v.id === vignetteId ? { ...v, mapX: x, mapY: y } : v
                                            )
                                        }));
                                        setIsDirty(true);
                                    }}
                                    onReorganizeScenes={() => {
                                        // Reset all scene AND vignette map positions to force auto-layout
                                        setGameData(prev => {
                                            const updatedScenes = { ...prev.scenes };
                                            Object.keys(updatedScenes).forEach(id => {
                                                updatedScenes[id] = {
                                                    ...updatedScenes[id],
                                                    mapX: undefined,
                                                    mapY: undefined
                                                };
                                            });
                                            const updatedVignettes = (prev.vignettes || []).map(v => ({
                                                ...v,
                                                mapX: undefined,
                                                mapY: undefined
                                            }));
                                            return { ...prev, scenes: updatedScenes, vignettes: updatedVignettes };
                                        });
                                        setIsDirty(true);
                                    }}
                                    gameInteractionType={gameData.gameInteractionType || 'parser'}
                                />
                            )}

                            {currentView === 'global_objects' && (
                                <GlobalObjectsEditor
                                    scenes={gameData.scenes}
                                    globalObjects={gameData.globalObjects}
                                    onUpdateObject={handleUpdateGlobalObject}
                                    onDeleteObject={handleDeleteGlobalObject}
                                    onCreateObject={handleCreateGlobalObject}
                                    onSelectScene={handleSelectScene}
                                    isDirty={isDirty}
                                    onSetDirty={setIsDirty}
                                />
                            )}

                            {currentView === 'trackers' && (
                                <TrackersEditor
                                    trackers={consequenceTrackers}
                                    onUpdateTrackers={handleUpdateTrackers}
                                    allScenes={scenesList}
                                    allTrackerIds={(gameData.consequenceTrackers || []).map(t => t.id)}
                                    isDirty={isDirty}
                                    onSetDirty={setIsDirty}
                                    onSelectScene={handleSelectScene}
                                />
                            )}

                            {currentView === 'global_commands' && (
                                <GlobalCommandsEditor
                                    fixedVerbs={gameData.fixedVerbs || []}
                                    onUpdate={handleUpdateGameData}
                                    isDirty={isDirty}
                                    onSetDirty={setIsDirty}
                                />
                            )}

                            {currentView === 'settings' && <Settings hideHeader />}
                            {currentView === 'about' && <AboutProject hideHeader />}
                        </main>
                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                title={confirmationModal.title}
                message={confirmationModal.message}
                onConfirm={confirmationModal.onConfirm}
                onCancel={confirmationModal.onCancel}
                isDanger={confirmationModal.isDanger}
            />
            <NewProjectModal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
                onCreate={handleProjectCreated}
            />
            <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
        </div>
    );
};

export default Editor;
