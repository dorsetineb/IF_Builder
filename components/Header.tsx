

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

const Header: React.FC<{ 
  gameData: GameData; 
  onImportGame: (data: GameData) => void;
  isPreviewing: boolean;
  onTogglePreview: () => void;
}> = ({ gameData, onImportGame, isPreviewing, onTogglePreview }) => {
  const importInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = async () => {
    if (typeof JSZip === 'undefined') {
        alert('A biblioteca JSZip não foi carregada. Não é possível exportar.');
        return;
    }
    const zip = new JSZip();
    const assetsFolder = zip.folder("assets");

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
    exportData.gamePositiveEndingImage = processAsset(exportData.gamePositiveEndingImage, 'positive_ending_image');
    exportData.gameNegativeEndingImage = processAsset(exportData.gameNegativeEndingImage, 'negative_ending_image');

    for (const sceneId in exportData.scenes) {
        const scene = exportData.scenes[sceneId];
        scene.image = processAsset(scene.image, `scene_image_${sceneId}`);
        if (scene.choices) {
            scene.choices.forEach((choice: any, index: number) => {
                choice.soundEffect = processAsset(choice.soundEffect, `sfx_${sceneId}_${index}`);
            });
        }
    }

    await Promise.all(assetPromises);

    const headerButtons = `
      ${exportData.gameEnableChances ? '<div id="chances-container" class="chances-container"></div>' : ''}
    `;
    
    const fontFamily = exportData.gameFontFamily || "'Silkscreen', sans-serif";
    const fontUrl = getFontUrl(fontFamily);
    const fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';

    const finalHtml = exportData.gameHTML
        // General
        .replace('__GAME_TITLE__', exportData.gameTitle || 'Game')
        .replace('__THEME_CLASS__', `${exportData.gameTheme || 'dark'}-theme`)
        .replace('__FONT_STYLESHEET__', fontStylesheet)
        // Header
        .replace('__LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="game-logo">` : '')
        .replace('__HEADER_TITLE_H1_TAG__', !exportData.gameHideTitle ? `<h1>${exportData.gameTitle}</h1>` : '')
        .replace('__HEADER_BUTTONS__', headerButtons)
        // Splash Screen
        .replace('__SPLASH_BG_STYLE__', exportData.gameSplashImage ? `style="background-image: url('${exportData.gameSplashImage}')"` : '')
        .replace('__SPLASH_LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="splash-logo">` : '')
        .replace('__SPLASH_TITLE_H1_TAG__', !exportData.gameOmitSplashTitle ? `<h1>${exportData.gameTitle}</h1>` : '')
        .replace('__SPLASH_DESCRIPTION__', exportData.gameSplashDescription || '')
        .replace('__SPLASH_BUTTON_TEXT__', exportData.gameSplashButtonText || 'Start')
        // Positive Ending
        .replace('__POSITIVE_ENDING_BG_STYLE__', exportData.gamePositiveEndingImage ? `style="background-image: url('${exportData.gamePositiveEndingImage}')"` : '')
        .replace('__POSITIVE_ENDING_LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="ending-logo">` : '')
        .replace('__POSITIVE_ENDING_TITLE_H1_TAG__', !exportData.gamePositiveEndingOmitTitle ? `<h1>${exportData.gameTitle}</h1>` : '')
        .replace('__POSITIVE_ENDING_DESCRIPTION__', exportData.gamePositiveEndingDescription || '')
        .replace('__POSITIVE_ENDING_BUTTON_TEXT__', exportData.gamePositiveEndingButtonText || 'Play Again')
        // Negative Ending
        .replace('__NEGATIVE_ENDING_BG_STYLE__', exportData.gameNegativeEndingImage ? `style="background-image: url('${exportData.gameNegativeEndingImage}')"` : '')
        .replace('__NEGATIVE_ENDING_LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="ending-logo">` : '')
        .replace('__NEGATIVE_ENDING_TITLE_H1_TAG__', !exportData.gameNegativeEndingOmitTitle ? `<h1>${exportData.gameTitle}</h1>` : '')
        .replace('__NEGATIVE_ENDING_DESCRIPTION__', exportData.gameNegativeEndingDescription || '')
        .replace('__NEGATIVE_ENDING_BUTTON_TEXT__', exportData.gameNegativeEndingButtonText || 'Try Again')
        // Script
        .replace('</body>', `<script src="game.js"></script>\n</body>`);

    const chancesCSS = `\n.chances-container { display: flex; align-items: center; gap: 8px; }\n.chance-icon { width: 28px; height: 28px; transition: all 0.3s ease; }\n.chance-icon.lost { opacity: 0.5; }`;
    
    let finalCss = exportData.gameCSS
        .replace('__FONT_FAMILY__', fontFamily)
        .replace('__GAME_TEXT_COLOR__', exportData.gameTextColor || '#c9d1d9')
        .replace('__GAME_TITLE_COLOR__', exportData.gameTitleColor || '#58a6ff')
        .replace('__GAME_FOCUS_COLOR__', exportData.gameFocusColor || '#58a6ff')
        .replace('__GAME_TEXT_COLOR_LIGHT__', exportData.gameTextColorLight || '#24292f')
        .replace('__GAME_TITLE_COLOR_LIGHT__', exportData.gameTitleColorLight || '#0969da')
        .replace('__GAME_FOCUS_COLOR_LIGHT__', exportData.gameFocusColorLight || '#0969da')
        .replace('__SPLASH_BUTTON_COLOR__', exportData.gameSplashButtonColor || '#2ea043')
        .replace('__SPLASH_BUTTON_HOVER_COLOR__', exportData.gameSplashButtonHoverColor || '#238636')
        .replace('__SPLASH_BUTTON_TEXT_COLOR__', exportData.gameSplashButtonTextColor || '#ffffff');

    if (exportData.gameSplashContentAlignment === 'left') {
        finalCss = finalCss
            .replace(/--splash-justify-content: flex-end;/g, '--splash-justify-content: flex-start;')
            .replace(/--splash-align-items: flex-end;/g, '--splash-align-items: flex-start;')
            .replace(/--splash-text-align: right;/g, '--splash-text-align: left;')
            .replace(/--splash-content-align-items: flex-end;/g, '--splash-content-align-items: flex-start;');
    }
    
    if (exportData.gameEnableChances) {
        finalCss += chancesCSS;
    }

    let layoutCSS = '';
    const orientation = exportData.gameLayoutOrientation || 'vertical';
    const order = exportData.gameLayoutOrder || 'image-first';

    if (orientation === 'horizontal') {
        layoutCSS += `
            .game-container { flex-direction: column; }
            .image-panel { flex: 0 0 40%; max-width: 100%; border-right: none; border-left: none; }
            .text-panel { flex: 1; }
        `;
        if (order === 'image-last') {
            layoutCSS += `
                .image-panel { order: 2; border-bottom: none; border-top: 2px solid var(--border-color); }
                .text-panel { order: 1; }
            `;
        } else {
            layoutCSS += `
                .image-panel { order: 1; border-top: none; border-bottom: 2px solid var(--border-color); }
                .text-panel { order: 2; }
            `;
        }
    } else { // 'vertical'
        layoutCSS += `
            .game-container { flex-direction: row; }
            .image-panel { flex: 0 0 45%; max-width: 650px; border-bottom: none; border-top: none; }
            .text-panel { flex: 1; }
        `;
        if (order === 'image-last') {
            layoutCSS += `
                .image-panel { order: 2; border-right: none; border-left: 2px solid var(--border-color); }
                .text-panel { order: 1; }
            `;
        } else {
            layoutCSS += `
                .image-panel { order: 1; border-left: none; border-right: 2px solid var(--border-color); }
                .text-panel { order: 2; }
            `;
        }
    }
    finalCss += layoutCSS;

    // Data for the game engine to run
    const engineData = prepareGameDataForEngine(exportData);
    const finalDataScript = `document.addEventListener('DOMContentLoaded', () => { window.embeddedGameData = ${JSON.stringify(engineData)}; });`;
    
    // Data for the editor to re-import (the full game data)
    zip.file("gamedata.json", JSON.stringify(exportData));

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
        
        const gameDataFile = zip.file("gamedata.json");
        if (!gameDataFile) {
            throw new Error("Arquivo .zip inválido. Faltando o arquivo 'gamedata.json'. Este pode ser um formato de exportação antigo e incompatível.");
        }
        
        const gameDataContent = await gameDataFile.async("string");
        const importedGameData: GameData = JSON.parse(gameDataContent);
        
        const processAssetPath = async (path: string | undefined): Promise<string | undefined> => {
            if (!path || !path.startsWith('assets/')) return path;
            const assetFile = zip.file(path);
            if (!assetFile) return path; // Return original path if file not found in zip
            const blob = await assetFile.async("blob");
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        };

        const promises = [];
        const reconstructedData = { ...importedGameData };

        if (reconstructedData.gameLogo) {
            promises.push(processAssetPath(reconstructedData.gameLogo).then(b64 => { reconstructedData.gameLogo = b64; }));
        }
        if (reconstructedData.gameSplashImage) {
            promises.push(processAssetPath(reconstructedData.gameSplashImage).then(b64 => { reconstructedData.gameSplashImage = b64; }));
        }
        if (reconstructedData.gamePositiveEndingImage) {
            promises.push(processAssetPath(reconstructedData.gamePositiveEndingImage).then(b64 => { reconstructedData.gamePositiveEndingImage = b64; }));
        }
        if (reconstructedData.gameNegativeEndingImage) {
            promises.push(processAssetPath(reconstructedData.gameNegativeEndingImage).then(b64 => { reconstructedData.gameNegativeEndingImage = b64; }));
        }

        for (const sceneId in reconstructedData.scenes) {
            const scene = reconstructedData.scenes[sceneId];
            if (scene.image) {
                 promises.push(processAssetPath(scene.image).then(b64 => { scene.image = b64 as string; }));
            }
            if (scene.choices) {
                scene.choices.forEach((choice: any) => {
                    if (choice.soundEffect) {
                         promises.push(processAssetPath(choice.soundEffect).then(b64 => { choice.soundEffect = b64 as string; }));
                    }
                });
            }
        }
        
        await Promise.all(promises);
        
        const htmlFile = zip.file("index.html");
        if (htmlFile) {
            reconstructedData.gameHTML = await htmlFile.async("string");
        }
        const cssFile = zip.file("style.css");
        if (cssFile) {
            reconstructedData.gameCSS = await cssFile.async("string");
        }
        
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
        <h1 className="text-xl font-bold text-brand-text whitespace-nowrap">IF Builder</h1>
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