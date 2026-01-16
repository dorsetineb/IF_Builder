
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

const getFrameClass = (frame?: GameData['gameImageFrame']): string => {
    switch (frame) {
        case 'rounded-top': return 'frame-rounded-top';
        case 'book-cover': return 'frame-book-cover';
        case 'trading-card': return 'frame-trading-card';
        default: return 'frame-none';
    }
}

const Preview: React.FC<{ gameData: GameData, testSceneId?: string | null }> = ({ gameData, testSceneId }) => {
    const srcDoc = useMemo(() => {
        const enableChances = gameData.enableChances || gameData.gameSystemEnabled === 'chances';
        const enableTrackers = gameData.enableTrackers || gameData.gameSystemEnabled === 'trackers';

        const chancesContainerHTML = enableChances ? '<div id="chances-container" class="chances-container"></div>' : '';

        const trackersButtonHTML = (enableTrackers && (gameData.gameShowTrackersUI ?? true))
            ? '<button id="trackers-button">__TRACKERS_BUTTON_TEXT__</button>'
            : '';

        const systemButtonHTML = (gameData.gameShowSystemButton ?? true)
            ? '<button id="system-button">__SYSTEM_BUTTON_TEXT__</button>'
            : '';

        const fontFamily = gameData.gameFontFamily || "'Silkscreen', sans-serif";
        const fontUrl = getFontUrl(fontFamily);
        const fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';

        const inventoryButtonHTML = (gameData.enableInventory ?? true)
            ? `<button id="inventory-button">${gameData.gameInventoryButtonText || 'Inventário'}</button>`
            : '';

        const diaryButtonHTML = (gameData.enableDiary ?? true)
            ? `<button id="diary-button">${gameData.gameDiaryButtonText || 'Diário'}</button>`
            : '';

        let finalHtml = gameData.gameHTML
            .replace(/__GAME_TITLE__/g, gameData.gameTitle || 'IF Builder Game')
            .replace('__THEME_CLASS__', `${gameData.gameTheme || 'dark'}-theme with-spacing`)
            .replace('__LAYOUT_ORIENTATION_CLASS__', gameData.gameLayoutOrientation === 'horizontal' ? 'layout-horizontal' : '')
            .replace('__LAYOUT_ORDER_CLASS__', gameData.gameLayoutOrder === 'image-last' ? 'layout-image-last' : '')
            .replace('__FRAME_CLASS__', getFrameClass(gameData.gameImageFrame))
            .replace('__MOBILE_BEHAVIOR_CLASS__', 'behavior-immersive') // FIXO: COMPORTAMENTO IMERSIVO
            .replace('__FONT_STYLESHEET__', fontStylesheet)
            .replace('__CHANCES_CONTAINER__', chancesContainerHTML)
            .replace('__TRACKERS_BUTTON__', trackersButtonHTML)
            .replace('__SYSTEM_BUTTON__', systemButtonHTML)
            .replace('__INVENTORY_BUTTON__', inventoryButtonHTML)
            .replace('__DIARY_BUTTON__', diaryButtonHTML)
            .replace(/__INVENTORY_BUTTON_TEXT__/g, gameData.gameInventoryButtonText || 'Inventário')
            .replace(/__SUGGESTIONS_BUTTON_TEXT__/g, gameData.gameSuggestionsButtonText || 'Sugestões')
            .replace(/__TRACKERS_BUTTON_TEXT__/g, gameData.gameTrackersButtonText || 'Rastreadores')
            .replace(/__SYSTEM_BUTTON_TEXT__/g, gameData.gameSystemButtonText || 'Sistema')
            .replace('__SAVE_MENU_TITLE__', gameData.gameSaveMenuTitle || 'Salvar Jogo')
            .replace('__LOAD_MENU_TITLE__', gameData.gameLoadMenuTitle || 'Carregar Jogo')
            .replace('__MAIN_MENU_BUTTON_TEXT__', gameData.gameMainMenuButtonText || 'Menu Principal')
            .replace('__VIEW_ENDING_BUTTON_TEXT__', gameData.gameViewEndingButtonText || 'Ver Final')
            .replace('__SPLASH_BG_STYLE__', gameData.gameSplashImage ? `style="background-image: url('${gameData.gameSplashImage}')"` : '')
            .replace('__SPLASH_ALIGN_CLASS__', gameData.gameSplashContentAlignment === 'left' ? 'align-left' : '')
            .replace('__SPLASH_LOGO_IMG_TAG__', gameData.gameLogo ? `<img src="${gameData.gameLogo}" alt="Logo" class="splash-logo">` : '')
            .replace('__SPLASH_TITLE_H1_TAG__', !gameData.gameOmitSplashTitle ? `<h1>${gameData.gameTitle}</h1>` : '')
            .replace('__SPLASH_DESCRIPTION__', gameData.gameSplashDescription || '')
            .replace('__SPLASH_BUTTON_TEXT__', gameData.gameSplashButtonText || 'Start')
            .replace('__CONTINUE_BUTTON_TEXT__', gameData.gameContinueButtonText || 'Continue')
            .replace(/__RESTART_BUTTON_TEXT__/g, gameData.gameRestartButtonText || 'Reiniciar Aventura')
            .replace('__ACTION_BUTTON_TEXT__', gameData.gameActionButtonText || 'Action')
            .replace('__VERB_INPUT_PLACEHOLDER__', gameData.gameVerbInputPlaceholder || 'What do you do?')
            .replace('__POSITIVE_ENDING_BG_STYLE__', gameData.positiveEndingImage ? `style="background-image: url('${gameData.positiveEndingImage}')"` : '')
            .replace('__POSITIVE_ENDING_ALIGN_CLASS__', gameData.positiveEndingContentAlignment === 'left' ? 'align-left' : '')
            .replace('__POSITIVE_ENDING_DESCRIPTION__', gameData.positiveEndingDescription || '')
            .replace('__NEGATIVE_ENDING_BG_STYLE__', gameData.negativeEndingImage ? `style="background-image: url('${gameData.negativeEndingImage}')"` : '')
            .replace('__NEGATIVE_ENDING_ALIGN_CLASS__', gameData.negativeEndingContentAlignment === 'left' ? 'align-left' : '')
            .replace('__NEGATIVE_ENDING_DESCRIPTION__', gameData.negativeEndingDescription || '');


        // CSS Overrides to fix legacy/stale gameCSS state
        const cssOverrides = `
            body.frame-rounded-top .game-container .image-panel { padding: 5px; background: __FRAME_ROUNDED_TOP_COLOR__; border: none; border-radius: 40px 40px 4px 4px; box-shadow: none; }
            body.frame-rounded-top .game-container .image-container { border-radius: 35px 35px 0 0; }
            body.frame-trading-card .image-panel { padding: 4px; background: __FRAME_TRADING_CARD_COLOR__; border-radius: 12px; }
            body.frame-trading-card .image-container { border: none; border-radius: 8px; }
            body.frame-book-cover .game-container .image-panel { padding: 5px; }
            #scene-image { border-radius: 0px; }
            #scene-image-back { border-radius: 0px; }
            
            #scene-image { border-radius: 0px; }
            #scene-image-back { border-radius: 0px; }
            
            /* Life System Fixes */
            @media (min-width: 769px) {
                .chances-container {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    width: 100%;
                    gap: 8px;
                    padding-bottom: 10px; /* Space above separator */
                    position: relative;
                    z-index: 5;
                }
            }
            @media (max-width: 768px) {
                 .chances-container {
                    position: fixed;
                    top: 15px;
                    right: 15px;
                    margin: 0;
                    padding: 0;
                    z-index: 2000;
                    display: flex;
                    gap: 6px;
                }
            }
            /* Common Icon Style */
            .chance-icon svg { width: 24px; height: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6)); display: block; }
            .chance-icon.lost svg { opacity: 0.3; }
        `;

        let finalCss = (gameData.gameCSS + cssOverrides)
            // Hotfix for legacy typo
            .replace('__FRAME_ROUND_TOP_COLOR__', '__FRAME_ROUNDED_TOP_COLOR__')
            .replace(/__FONT_FAMILY__/g, fontFamily)
            .replace(/__GAME_FONT_SIZE__/g, (() => {
                const size = gameData.gameFontSize || '12';
                return /^\d+$/.test(size) ? `${size}px` : size;
            })())
            .replace(/__GAME_TEXT_COLOR__/g, gameData.gameTextColor || '#c9d1d9')
            .replace(/__GAME_TITLE_COLOR__/g, gameData.gameTitleColor || '#58a6ff')
            .replace(/__GAME_FOCUS_COLOR__/g, gameData.gameFocusColor || '#58a6ff')
            .replace(/__GAME_TEXT_COLOR_LIGHT__/g, gameData.textColorLight || '#24292f')
            .replace(/__GAME_TITLE_COLOR_LIGHT__/g, gameData.titleColorLight || '#0969da')
            .replace(/__GAME_FOCUS_COLOR_LIGHT__/g, gameData.focusColorLight || '#0969da')
            .replace(/__SPLASH_BUTTON_COLOR__/g, gameData.gameSplashButtonColor || '#2ea043')
            .replace(/__SPLASH_BUTTON_HOVER_COLOR__/g, gameData.gameSplashButtonHoverColor || '#238636')
            .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, gameData.gameSplashButtonTextColor || '#ffffff')
            .replace(/__ACTION_BUTTON_COLOR__/g, gameData.gameActionButtonColor || '#ffffff')
            .replace(/__ACTION_BUTTON_TEXT_COLOR__/g, gameData.gameActionButtonTextColor || '#0d1117')
            .replace(/__FRAME_BOOK_COLOR__/g, gameData.frameBookColor || '#2d2d2d')
            .replace(/__FRAME_TRADING_CARD_COLOR__/g, gameData.frameTradingCardColor || '#1c1917')
            .replace(/__FRAME_ROUNDED_TOP_COLOR__/g, gameData.frameRoundedTopColor || '#facc15')
            .replace(/__SCENE_NAME_OVERLAY_BG__/g, gameData.gameSceneNameOverlayBg || '#0d1117')
            .replace(/__SCENE_NAME_OVERLAY_TEXT_COLOR__/g, gameData.gameSceneNameOverlayTextColor || '#c9d1d9')
            .replace(/__CONTINUE_INDICATOR_COLOR__/g, gameData.gameContinueIndicatorColor || gameData.gameTitleColor || '#58a6ff');

        const engineData = prepareGameDataForEngine(gameData);
        if (testSceneId) {
            (engineData as any).cena_inicial = testSceneId;
        }

        const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');

        const dataScript = `<script>
            window.embeddedGameData = ${safeJson}; 
            window.isPreview = true;
            window.isSceneTest = ${!!testSceneId};
        </script>`;
        const styleTag = `<style>${finalCss}</style>`;
        const gameScriptTag = `<script>${gameJS}</script>`;

        return finalHtml
            .replace('</head>', `${styleTag}</head>`)
            .replace('</body>', `${dataScript}${gameScriptTag}</body>`);

    }, [gameData, testSceneId]);

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
