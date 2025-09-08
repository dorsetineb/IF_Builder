

import React, { useMemo } from 'react';
import { GameData } from '../types';
import { gameJS, prepareGameDataForEngine } from './game-engine';

// Helper to generate the correct Google Fonts URL from a font-family string.
const getFontUrl = (fontFamily: string) => {
    const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
    if (!fontName) return '';
    const googleFontName = fontName.replace(/ /g, '+');
    return `https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap`;
};

const Preview: React.FC<{ gameData: GameData }> = ({ gameData }) => {
    const srcDoc = useMemo(() => {
        const headerButtons = `
          ${gameData.gameEnableChances ? '<div id="chances-container" class="chances-container"></div>' : ''}
        `;

        const fontFamily = gameData.gameFontFamily || "'Silkscreen', sans-serif";
        const fontUrl = getFontUrl(fontFamily);
        const fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';

        let finalHtml = gameData.gameHTML
            // General
            .replace('__GAME_TITLE__', gameData.gameTitle || 'IF Builder Game')
            .replace('__THEME_CLASS__', `${gameData.gameTheme || 'dark'}-theme`)
            .replace('__FONT_STYLESHEET__', fontStylesheet)
            // Header
            .replace('__LOGO_IMG_TAG__', gameData.gameLogo ? `<img src="${gameData.gameLogo}" alt="Logo" class="game-logo">` : '')
            .replace('__HEADER_TITLE_H1_TAG__', !gameData.gameHideTitle ? `<h1>${gameData.gameTitle}</h1>` : '')
            .replace('__HEADER_BUTTONS__', headerButtons)
            // Splash Screen
            .replace('__SPLASH_BG_STYLE__', gameData.gameSplashImage ? `style="background-image: url('${gameData.gameSplashImage}')"` : '')
            .replace('__SPLASH_LOGO_IMG_TAG__', gameData.gameLogo ? `<img src="${gameData.gameLogo}" alt="Logo" class="splash-logo">` : '')
            .replace('__SPLASH_TITLE_H1_TAG__', !gameData.gameOmitSplashTitle ? `<h1>${gameData.gameTitle}</h1>` : '')
            .replace('__SPLASH_DESCRIPTION__', gameData.gameSplashDescription || '')
            .replace('__SPLASH_BUTTON_TEXT__', gameData.gameSplashButtonText || 'Start')
            // Positive Ending
            .replace('__POSITIVE_ENDING_BG_STYLE__', gameData.gamePositiveEndingImage ? `style="background-image: url('${gameData.gamePositiveEndingImage}')"` : '')
            .replace('__POSITIVE_ENDING_LOGO_IMG_TAG__', gameData.gameLogo ? `<img src="${gameData.gameLogo}" alt="Logo" class="ending-logo">` : '')
            .replace('__POSITIVE_ENDING_TITLE_H1_TAG__', !gameData.gamePositiveEndingOmitTitle ? `<h1>${gameData.gameTitle}</h1>` : '')
            .replace('__POSITIVE_ENDING_DESCRIPTION__', gameData.gamePositiveEndingDescription || '')
            .replace('__POSITIVE_ENDING_BUTTON_TEXT__', gameData.gamePositiveEndingButtonText || 'Play Again')
            // Negative Ending
            .replace('__NEGATIVE_ENDING_BG_STYLE__', gameData.gameNegativeEndingImage ? `style="background-image: url('${gameData.gameNegativeEndingImage}')"` : '')
            .replace('__NEGATIVE_ENDING_LOGO_IMG_TAG__', gameData.gameLogo ? `<img src="${gameData.gameLogo}" alt="Logo" class="ending-logo">` : '')
            .replace('__NEGATIVE_ENDING_TITLE_H1_TAG__', !gameData.gameNegativeEndingOmitTitle ? `<h1>${gameData.gameTitle}</h1>` : '')
            .replace('__NEGATIVE_ENDING_DESCRIPTION__', gameData.gameNegativeEndingDescription || '')
            .replace('__NEGATIVE_ENDING_BUTTON_TEXT__', gameData.gameNegativeEndingButtonText || 'Try Again');
            
        const chancesCSS = `
        .chances-container { display: flex; align-items: center; gap: 8px; }
        .chance-icon { width: 28px; height: 28px; transition: all 0.3s ease; }
        .chance-icon.lost { opacity: 0.5; }
        `;

        let finalCss = gameData.gameCSS
            .replace('__FONT_FAMILY__', fontFamily)
            .replace('__GAME_TEXT_COLOR__', gameData.gameTextColor || '#c9d1d9')
            .replace('__GAME_TITLE_COLOR__', gameData.gameTitleColor || '#58a6ff')
            .replace('__GAME_FOCUS_COLOR__', gameData.gameFocusColor || '#58a6ff')
            .replace('__GAME_TEXT_COLOR_LIGHT__', gameData.gameTextColorLight || '#24292f')
            .replace('__GAME_TITLE_COLOR_LIGHT__', gameData.gameTitleColorLight || '#0969da')
            .replace('__GAME_FOCUS_COLOR_LIGHT__', gameData.gameFocusColorLight || '#0969da')
            .replace('__SPLASH_BUTTON_COLOR__', gameData.gameSplashButtonColor || '#2ea043')
            .replace('__SPLASH_BUTTON_HOVER_COLOR__', gameData.gameSplashButtonHoverColor || '#238636')
            .replace('__SPLASH_BUTTON_TEXT_COLOR__', gameData.gameSplashButtonTextColor || '#ffffff');

        if (gameData.gameEnableChances) {
            finalCss += chancesCSS;
        }

        if (gameData.gameSplashContentAlignment === 'left') {
            finalCss = finalCss
                .replace(/--splash-justify-content: flex-end;/g, '--splash-justify-content: flex-start;')
                .replace(/--splash-align-items: flex-end;/g, '--splash-align-items: flex-start;')
                .replace(/--splash-text-align: right;/g, '--splash-text-align: left;')
                .replace(/--splash-content-align-items: flex-end;/g, '--splash-content-align-items: flex-start;');
        }
            
        let layoutCSS = '';
        const orientation = gameData.gameLayoutOrientation || 'vertical';
        const order = gameData.gameLayoutOrder || 'image-first';

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
        
        const engineData = prepareGameDataForEngine(gameData);
        // Safely stringify JSON to prevent issues with '</script>' tags in user content.
        const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');

        const dataScript = `<script>window.embeddedGameData = ${safeJson};</script>`;
        const styleTag = `<style>${finalCss}</style>`;
        const gameScriptTag = `<script>${gameJS}</script>`;

        return finalHtml
          .replace('</head>', `${styleTag}</head>`)
          .replace('</body>', `${dataScript}${gameScriptTag}</body>`);

    }, [gameData]);

    return (
        <div className="w-full h-full bg-brand-bg">
            <iframe
                srcDoc={srcDoc}
                title="Pré-visualização do Jogo"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
};

export default Preview;