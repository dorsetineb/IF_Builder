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

const getFrameClass = (frame?: 'none' | 'classic' | 'art-deco' | 'rounded-top'): string => {
    switch (frame) {
        case 'classic': return 'frame-classic';
        case 'art-deco': return 'frame-art-deco';
        case 'rounded-top': return 'frame-rounded-top';
        default: return '';
    }
}

const Preview: React.FC<{ gameData: GameData }> = ({ gameData }) => {
    const srcDoc = useMemo(() => {
        const chancesContainerHTML = gameData.gameEnableChances ? '<div id="chances-container" class="chances-container"></div>' : '';

        const fontFamily = gameData.gameFontFamily || "'Silkscreen', sans-serif";
        const fontUrl = getFontUrl(fontFamily);
        const fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';

        let finalHtml = gameData.gameHTML
            .replace('__GAME_TITLE__', gameData.gameTitle || 'TXT Builder Game')
            .replace('__THEME_CLASS__', `${gameData.gameTheme || 'dark'}-theme`)
            .replace('__FRAME_CLASS__', getFrameClass(gameData.gameImageFrame))
            .replace('__FONT_STYLESHEET__', fontStylesheet)
            .replace('__LOGO_IMG_TAG__', gameData.gameLogo ? `<img src="${gameData.gameLogo}" alt="Logo" class="game-logo">` : '')
            .replace('__CHANCES_CONTAINER__', chancesContainerHTML)
            .replace('__SPLASH_BG_STYLE__', gameData.gameSplashImage ? `style="background-image: url('${gameData.gameSplashImage}')"` : '')
            .replace('__SPLASH_ALIGN_CLASS__', gameData.gameSplashContentAlignment === 'left' ? 'align-left' : '')
            .replace('__SPLASH_LOGO_IMG_TAG__', gameData.gameLogo ? `<img src="${gameData.gameLogo}" alt="Logo" class="splash-logo">` : '')
            .replace('__SPLASH_TITLE_H1_TAG__', !gameData.gameOmitSplashTitle ? `<h1>${gameData.gameTitle}</h1>` : '')
            .replace('__SPLASH_DESCRIPTION__', gameData.gameSplashDescription || '')
            .replace('__SPLASH_BUTTON_TEXT__', gameData.gameSplashButtonText || 'Start')
            .replace('__CONTINUE_BUTTON_TEXT__', gameData.gameContinueButtonText || 'Continue')
            .replace('__RESTART_BUTTON_TEXT__', gameData.gameRestartButtonText || 'Reiniciar Aventura')
            .replace('__ACTION_BUTTON_TEXT__', gameData.gameActionButtonText || 'Action')
            .replace('__COMMAND_INPUT_PLACEHOLDER__', gameData.gameCommandInputPlaceholder || 'What do you do?')
            .replace('__POSITIVE_ENDING_BG_STYLE__', gameData.positiveEndingImage ? `style="background-image: url('${gameData.positiveEndingImage}')"` : '')
            .replace('__POSITIVE_ENDING_ALIGN_CLASS__', gameData.positiveEndingContentAlignment === 'left' ? 'align-left' : '')
            .replace('__POSITIVE_ENDING_DESCRIPTION__', gameData.positiveEndingDescription || '')
            .replace('__NEGATIVE_ENDING_BG_STYLE__', gameData.negativeEndingImage ? `style="background-image: url('${gameData.negativeEndingImage}')"` : '')
            .replace('__NEGATIVE_ENDING_ALIGN_CLASS__', gameData.negativeEndingContentAlignment === 'left' ? 'align-left' : '')
            .replace('__NEGATIVE_ENDING_DESCRIPTION__', gameData.negativeEndingDescription || '');
            
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
            .replace('__SPLASH_BUTTON_TEXT_COLOR__', gameData.gameSplashButtonTextColor || '#ffffff')
            .replace('__ACTION_BUTTON_COLOR__', gameData.gameActionButtonColor || '#ffffff')
            .replace('__ACTION_BUTTON_TEXT_COLOR__', gameData.gameActionButtonTextColor || '#0d1117');
            
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