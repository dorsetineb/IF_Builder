
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

    const assetPromises: Promise<void>[] = [];
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
    
    let fontAdjustClass = '';
    if (fontFamily.includes('DotGothic16')) {
        fontAdjustClass = 'font-adjust-gothic';
    }

    const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
    let fontStylesheet = '';
    let finalCss = exportData.gameCSS;

    if (fontName) {
        const googleFontName = fontName.replace(/ /g, '+');
        const fontCssUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;700&display=swap`;

        try {
            const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36';
            const cssResponse = await fetch(fontCssUrl, { headers: { 'User-Agent': userAgent } });
            
            if (!cssResponse.ok) throw new Error(`Failed to fetch font CSS: ${cssResponse.statusText}`);
            
            let fontCssText = await cssResponse.text();
            
            const fontUrlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
            const fontPromises: Promise<void>[] = [];
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
            finalCss = fontCssText;
            fontStylesheet = '';
        } catch (error) {
            console.error("Failed to embed fonts, falling back to online version:", error);
            const fontUrl = getFontUrl(fontFamily);
            fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
        }
    }

    const engineData = prepareGameDataForEngine(exportData);
    const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');
    const finalGameScript = `window.embeddedGameData = ${safeJson};\n\n${gameJS}`;

    let html = exportData.gameHTML
        .replace('__GAME_TITLE__', exportData.gameTitle || 'IF Builder Game')
        .replace('__THEME_CLASS__', `${exportData.gameTheme || 'dark'}-theme`)
        .replace('__LAYOUT_ORIENTATION_CLASS__', exportData.gameLayoutOrientation === 'horizontal' ? 'layout-horizontal' : '')
        .replace('__LAYOUT_ORDER_CLASS__', exportData.gameLayoutOrder === 'image-last' ? 'layout-image-last' : '')
        .replace('__FRAME_CLASS__', getFrameClass(exportData.gameImageFrame))
        .replace('__FONT_STYLESHEET__', fontStylesheet)
        .replace('__FONT_ADJUST_CLASS__', fontAdjustClass)
        .replace('__CHANCES_CONTAINER__', chancesContainerHTML)
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
        .replace('__POSITIVE_ENDING_BG_STYLE__', exportData.positiveEndingImage ? `style="background-image: url('${exportData.positiveEndingImage}')"` : '')
        .replace('__POSITIVE_ENDING_ALIGN_CLASS__', exportData.positiveEndingContentAlignment === 'left' ? 'align-left' : '')
        .replace('__POSITIVE_ENDING_DESCRIPTION__', exportData.positiveEndingDescription || '')
        .replace('__NEGATIVE_ENDING_BG_STYLE__', exportData.negativeEndingImage ? `style="background-image: url('${exportData.negativeEndingImage}')"` : '')
        .replace('__NEGATIVE_ENDING_ALIGN_CLASS__', exportData.negativeEndingContentAlignment === 'left' ? 'align-left' : '')
        .replace('__NEGATIVE_ENDING_DESCRIPTION__', exportData.negativeEndingDescription || '');

    html = html.replace('</body>', '<script src="game.js"></script></body>');

    const css = finalCss
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
        .replace(/__FRAME_BOOK_COLOR__/g, exportData.frameBookColor || '#FFFFFF')
        .replace(/__FRAME_TRADING_CARD_COLOR__/g, exportData.frameTradingCardColor || '#1c1917')
        .replace(/__FRAME_CHAMFERED_COLOR__/g, exportData.frameChamferedColor || '#FFFFFF')
        .replace(/__FRAME_ROUNDED_TOP_COLOR__/g, exportData.frameRoundedTopColor || '#facc15')
        .replace(/__SCENE_NAME_OVERLAY_BG__/g, exportData.gameSceneNameOverlayBg || '#0d1117')
        .replace(/__SCENE_NAME_OVERLAY_TEXT_COLOR__/g, exportData.gameSceneNameOverlayTextColor || '#c9d1d9');
    
    zip.file("index.html", html);
    zip.file("style.css", css);
    zip.file("game.js", finalGameScript);

    zip.generateAsync({ type: "blob" })
      .then(function(content: Blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        const safeTitle = exportData.gameTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'if_builder_game';
        link.download = `${safeTitle}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const data = JSON.parse(result);
            onImportGame(data);
          }
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Erro ao importar o arquivo. Verifique se é um arquivo JSON válido.");
        }
      };
      reader.readAsText(file);
    }
    if (event.target) {
        event.target.value = '';
    }
  };

  return (
    <header className="flex-shrink-0 bg-brand-sidebar p-4 flex justify-between items-center border-b border-brand-border">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">IF Builder</h1>
        <code
            className="bg-brand-bg px-2 py-1 rounded text-brand-primary-hover text-base align-middle"
            title={gameData.gameTitle}
        >
            {gameData.gameTitle}
        </code>
      </div>
      <div className="flex items-center gap-4">
        <input
            type="file"
            ref={importInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileImport}
        />
        <button 
            onClick={handleImportClick}
            className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors"
        >
          <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
          Importar
        </button>
        <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Exportar Jogo
        </button>
        <button 
            onClick={onTogglePreview}
            className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors"
        >
          <EyeIcon className="w-5 h-5 mr-2" />
          {isPreviewing ? 'Fechar Pré-visualização' : 'Pré-visualizar Jogo'}
        </button>
      </div>
    </header>
  );
};
    
export default Header;
