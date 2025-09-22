

// FIX: Corrected React import to properly include 'useRef'. The previous syntax 'import React, a from ...' was invalid.
import React, { useRef } from 'react';
import { GameData } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { EyeIcon } from './icons/EyeIcon';
import { DocumentArrowUpIcon } from './icons/DocumentArrowUpIcon';
import { gameJS, prepareGameDataForEngine } from './game-engine';

// Fix: Declare JSZip to inform TypeScript about the global variable.
declare var JSZip: any;

// Helper to generate the correct Google Fonts URL from a font-family string.
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
        case 'chamfered': return 'frame-chamfered';
        default: return '';
    }
}

const Header: React.FC<{ 
  gameData: GameData; 
  onImportGame: (data: GameData) => void;
  isPreviewing: boolean;
  onTogglePreview: () => void;
}> = ({ gameData, onImportGame, isPreviewing, onTogglePreview }) => {
  // FIX: Changed 'a.useRef' to 'useRef' to match the corrected import.
  const importInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = async () => {
    if (typeof JSZip === 'undefined') {
        alert('A biblioteca JSZip não foi carregada. Não é possível exportar.');
        return;
    }
    const zip = new JSZip();
    const assetsFolder = zip.folder("assets");
    if (!assetsFolder) {
        alert('Falha ao criar a pasta de assets no arquivo .zip.');
        return;
    }

    const exportData = JSON.parse(JSON.stringify(gameData));

    const assetPromises = [];
    const assetMap = new Map<string, string>();

    const processAsset = (base64String: string | undefined, baseName: string): string | undefined => {
        if (!base64String || !base64String.startsWith('data:')) {
            return base64String;
        }
        if (assetMap.has(base64String)) {
            return assetMap.get(base64String);
        }
        const match = base64String.match(/^data:(.+);base64,(.+)$/);
        if (!match) return base64String;
        
        const mimeType = match[1];
        const data = match[2];
        const extension = mimeType.split('/')[1] || 'bin';
        const filename = `assets/${baseName}.${extension}`;
        assetMap.set(base64String, filename);
        
        const promise = fetch(base64String).then(res => res.blob()).then(blob => {
             assetsFolder.file(`${baseName}.${extension}`, blob);
        });
        assetPromises.push(promise);
        
        return filename;
    };

    exportData.gameLogo = processAsset(exportData.gameLogo, 'logo');
    exportData.gameSplashImage = processAsset(exportData.gameSplashImage, 'splash_image');
    exportData.positiveEndingImage = processAsset(exportData.positiveEndingImage, 'positive_ending');
    exportData.negativeEndingImage = processAsset(exportData.negativeEndingImage, 'negative_ending');

    for (const sceneId in exportData.scenes) {
        const scene = exportData.scenes[sceneId];
        scene.image = processAsset(scene.image, `scene_image_${sceneId}`);
        if (scene.interactions) {
            scene.interactions.forEach((inter: any, index: number) => {
                inter.soundEffect = processAsset(inter.soundEffect, `sfx_${sceneId}_${index}`);
            });
        }
    }

    await Promise.all(assetPromises);

    const chancesContainerHTML = exportData.gameEnableChances 
        ? '<div id="chances-container" class="chances-container"></div>' 
        : '';
    
    const fontFamily = exportData.gameFontFamily || "'Silkscreen', sans-serif";
    const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
    let fontStylesheet = ''; // This will be the <link> tag on failure.
    let finalCss = exportData.gameCSS; // This will be modified with @font-face rules on success.

    // --- Font Embedding Logic ---
    if (fontName) {
        const googleFontName = fontName.replace(/ /g, '+');
        const fontCssUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;700&display=swap`;

        try {
            const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36';
            const cssResponse = await fetch(fontCssUrl, { headers: { 'User-Agent': userAgent } });
            
            if (!cssResponse.ok) throw new Error(`Failed to fetch font CSS: ${cssResponse.statusText}`);
            
            let fontCssText = await cssResponse.text();
            
            const fontUrlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
            const fontPromises = [];
            const fontFolder = zip.folder("fonts");
            if (!fontFolder) throw new Error("Could not create 'fonts' folder in zip.");

            const fontUrlsToDownload = new Set<string>();
            let match;
            while ((match = fontUrlRegex.exec(fontCssText)) !== null) {
                fontUrlsToDownload.add(match[1]);
            }

            for (const originalUrl of fontUrlsToDownload) {
                const fontFileName = originalUrl.substring(originalUrl.lastIndexOf('/') + 1);
                const localUrl = `fonts/${fontFileName}`;
                fontCssText = fontCssText.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localUrl);
                
                fontPromises.push(
                    fetch(originalUrl)
                        .then(res => {
                            if (!res.ok) throw new Error(`Failed to download font file: ${originalUrl}`);
                            return res.blob();
                        })
                        .then(blob => {
                            fontFolder.file(fontFileName, blob);
                        })
                );
            }

            await Promise.all(fontPromises);
            
            finalCss = fontCssText + '\n' + finalCss;
            fontStylesheet = ''; // Success, no need for <link> tag.
        } catch (error) {
            console.warn("Could not download and embed font. Falling back to online version.", error);
            const fallbackFontUrl = getFontUrl(fontFamily);
            fontStylesheet = fallbackFontUrl ? `<link href="${fallbackFontUrl}" rel="stylesheet">` : '';
        }
    } else {
        fontStylesheet = '';
    }
    // --- End of Font Embedding Logic ---

    const finalHtml = exportData.gameHTML
        .replace('__GAME_TITLE__', exportData.gameTitle || 'Game')
        .replace('__THEME_CLASS__', `${exportData.gameTheme || 'dark'}-theme with-spacing`)
        .replace('__FRAME_CLASS__', getFrameClass(exportData.gameImageFrame))
        .replace('__FONT_STYLESHEET__', fontStylesheet)
        .replace('__LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="game-logo">` : '')
        .replace('__CHANCES_CONTAINER__', chancesContainerHTML)
        .replace('__SPLASH_BG_STYLE__', exportData.gameSplashImage ? `style="background-image: url('${exportData.gameSplashImage}')"` : '')
        .replace('__SPLASH_ALIGN_CLASS__', exportData.gameSplashContentAlignment === 'left' ? 'align-left' : '')
        .replace('__SPLASH_LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="splash-logo">` : '')
        .replace('__SPLASH_TITLE_H1_TAG__', !exportData.gameOmitSplashTitle ? `<h1>${exportData.gameTitle}</h1>` : '')
        .replace('__SPLASH_DESCRIPTION__', exportData.gameSplashDescription || '')
        .replace('__SPLASH_BUTTON_TEXT__', exportData.gameSplashButtonText || 'Start')
        .replace('__CONTINUE_BUTTON_TEXT__', exportData.gameContinueButtonText || 'Continue')
        .replace('__RESTART_BUTTON_TEXT__', exportData.gameRestartButtonText || 'Reiniciar Aventura')
        .replace('__ACTION_BUTTON_TEXT__', exportData.gameActionButtonText || 'Action')
        .replace('__VERB_INPUT_PLACEHOLDER__', exportData.gameVerbInputPlaceholder || 'What do you do?')
        .replace('__POSITIVE_ENDING_BG_STYLE__', exportData.positiveEndingImage ? `style="background-image: url('${exportData.positiveEndingImage}')"` : '')
        .replace('__POSITIVE_ENDING_ALIGN_CLASS__', exportData.positiveEndingContentAlignment === 'left' ? 'align-left' : '')
        .replace('__POSITIVE_ENDING_DESCRIPTION__', exportData.positiveEndingDescription || '')
        .replace('__NEGATIVE_ENDING_BG_STYLE__', exportData.negativeEndingImage ? `style="background-image: url('${exportData.negativeEndingImage}')"` : '')
        .replace('__NEGATIVE_ENDING_ALIGN_CLASS__', exportData.negativeEndingContentAlignment === 'left' ? 'align-left' : '')
        .replace('__NEGATIVE_ENDING_DESCRIPTION__', exportData.negativeEndingDescription || '')
        .replace('</body>', `<script src="game.js"></script>\n</body>`);

    finalCss = finalCss
        .replace(/__FONT_FAMILY__/g, fontFamily)
        .replace(/__GAME_TEXT_COLOR__/g, exportData.gameTextColor || '#c9d1d9')
        .replace(/__GAME_TITLE_COLOR__/g, exportData.gameTitleColor || '#58a6ff')
        .replace(/__GAME_FOCUS_COLOR__/g, exportData.gameFocusColor || '#58a6ff')
        .replace(/__GAME_TEXT_COLOR_LIGHT__/g, exportData.gameTextColorLight || '#24292f')
        .replace(/__GAME_TITLE_COLOR_LIGHT__/g, exportData.gameTitleColorLight || '#0969da')
        .replace(/__GAME_FOCUS_COLOR_LIGHT__/g, exportData.gameFocusColorLight || '#0969da')
        .replace(/__SPLASH_BUTTON_COLOR__/g, exportData.gameSplashButtonColor || '#2ea043')
        .replace(/__SPLASH_BUTTON_HOVER_COLOR__/g, exportData.gameSplashButtonHoverColor || '#238636')
        .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
        .replace(/__ACTION_BUTTON_COLOR__/g, exportData.gameActionButtonColor || '#ffffff')
        .replace(/__ACTION_BUTTON_TEXT_COLOR__/g, exportData.gameActionButtonTextColor || '#0d1117')
        .replace(/__FRAME_BOOK_COLOR__/g, exportData.frameBookColor || '#2d2d2d')
        .replace(/__FRAME_CARD_OUTER_COLOR__/g, exportData.frameCardOuterColor || '#1c1917')
        .replace(/__FRAME_CARD_INNER_COLOR__/g, exportData.frameCardInnerColor || '#d97706')
        .replace(/__FRAME_CHAMFERED_COLOR__/g, exportData.frameChamferedColor || '#4a5568')
        .replace(/__FRAME_ROUNDED_TOP_BG_COLOR__/g, exportData.frameRoundedTopBackgroundColor || '#000000')
        .replace(/__FRAME_ROUNDED_TOP_BORDER_COLOR__/g, exportData.frameRoundedTopBorderColor || '#facc15');
    
    const engineData = prepareGameDataForEngine(exportData);
    const finalDataScript = `document.addEventListener('DOMContentLoaded', () => { window.embeddedGameData = ${JSON.stringify(engineData)}; });`;

    zip.file("index.html", finalHtml);
    zip.file("style.css", finalCss);
    zip.file("game.js", `\n${finalDataScript}\n\n${gameJS}\n`);
    
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${(gameData.gameTitle || 'meu-jogo').toLowerCase().replace(/\s+/g, '-')}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const zip = await JSZip.loadAsync(file);

        const dataScriptFile = zip.file("game.js");
        const htmlFile = zip.file("index.html");
        const cssFile = zip.file("style.css");

        if (!dataScriptFile || !htmlFile || !cssFile) {
            throw new Error("Arquivo .zip inválido. Faltam game.js, index.html ou style.css.");
        }

        const dataScriptContent = await dataScriptFile.async("string");
        const match = dataScriptContent.match(/window\.embeddedGameData\s*=\s*(\{.*?\});/);
        if (!match) throw new Error("Não foi possível encontrar os dados do jogo dentro de game.js");
        
        const importedEngineData = JSON.parse(match[1]);
        let reconstructedData: Partial<GameData> = { ...gameData };

        reconstructedData.gameHTML = await htmlFile.async("string");
        reconstructedData.gameCSS = await cssFile.async("string");
        reconstructedData.startScene = importedEngineData.cena_inicial;
        reconstructedData.defaultFailureMessage = importedEngineData.mensagem_falha_padrao;
        reconstructedData.gameDiaryPlayerName = importedEngineData.nome_jogador_diario;
        reconstructedData.gameEnableChances = importedEngineData.gameEnableChances;
        reconstructedData.gameMaxChances = importedEngineData.gameMaxChances;
        reconstructedData.gameChanceIcon = importedEngineData.gameChanceIcon;
        reconstructedData.gameChanceIconColor = importedEngineData.gameChanceIconColor;
        reconstructedData.gameTheme = importedEngineData.gameTheme;
        reconstructedData.gameTextColorLight = importedEngineData.gameTextColorLight;
        reconstructedData.gameTitleColorLight = importedEngineData.gameTitleColorLight;
        reconstructedData.gameFocusColorLight = importedEngineData.gameFocusColorLight;

        const editorScenes: { [id: string]: any } = {};
        if (importedEngineData.cenas) {
            for (const sceneId in importedEngineData.cenas) {
                const scene = importedEngineData.cenas[sceneId];
                editorScenes[sceneId] = {
                    ...scene,
                    objects: scene.objetos || [],
                };
                delete editorScenes[sceneId].objetos;
            }
        }
        reconstructedData.scenes = editorScenes;

        const processAssetPath = async (path: string | undefined): Promise<string | undefined> => {
            if (!path || !path.startsWith('assets/')) return path;
            const assetFile = zip.file(path);
            if (!assetFile) return undefined;
            const blob = await assetFile.async("blob");
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        };

        const promises = [];
        if (reconstructedData.gameLogo && typeof reconstructedData.gameLogo === 'string') {
            promises.push(processAssetPath(reconstructedData.gameLogo).then(b64 => reconstructedData.gameLogo = b64));
        }
        if (reconstructedData.gameSplashImage && typeof reconstructedData.gameSplashImage === 'string') {
            promises.push(processAssetPath(reconstructedData.gameSplashImage).then(b64 => reconstructedData.gameSplashImage = b64));
        }
        for (const sceneId in reconstructedData.scenes) {
            const scene = reconstructedData.scenes[sceneId];
            if (scene.image && typeof scene.image === 'string') {
                 promises.push(processAssetPath(scene.image).then(b64 => { scene.image = b64 as string; }));
            }
            if (scene.interactions) {
                scene.interactions.forEach((inter: any) => {
                    if (inter.soundEffect && typeof inter.soundEffect === 'string') {
                         promises.push(processAssetPath(inter.soundEffect).then(b64 => { inter.soundEffect = b64 as string; }));
                    }
                });
            }
        }
        
        await Promise.all(promises);
        
        onImportGame(reconstructedData as GameData);
        alert('Jogo importado com sucesso!');

    } catch (error) {
        console.error("Erro ao importar .zip:", error);
        alert(`Erro ao importar o arquivo .zip: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  };

  return (
    <header className="flex items-center justify-between p-3 bg-brand-surface border-b border-brand-border flex-shrink-0 z-20">
      <div className="flex flex-col items-start min-w-0">
        <h1 className="text-xl font-bold text-brand-text whitespace-nowrap">TXT Builder</h1>
        {gameData.gameTitle && (
            <code
                className="mt-1 bg-brand-bg px-2 py-1 rounded text-brand-primary-hover text-sm truncate max-w-full"
                title={gameData.gameTitle}
            >
                {gameData.gameTitle}
            </code>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input type="file" ref={importInputRef} onChange={handleFileImport} className="hidden" accept=".zip" />
        <button onClick={handleImportClick} className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors">
          <DocumentArrowUpIcon className="w-5 h-5 mr-2" /> Importar Jogo (.zip)
        </button>
        <button onClick={handleExport} className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors">
          <DownloadIcon className="w-5 h-5 mr-2" /> Exportar Jogo (.zip)
        </button>
        <button onClick={onTogglePreview} className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors">
          <EyeIcon className="w-5 h-5 mr-2" />
          {isPreviewing ? 'Fechar Pré-visualização' : 'Pré-visualizar Jogo'}
        </button>
      </div>
    </header>
  );
};

export default Header;