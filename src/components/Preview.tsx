
import React, { useMemo, useState, useEffect } from 'react';
import { GameData } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { gameHTML, gameCSS, initialGameData, OVERLAY_CSS } from '../lib/gameDefaults';
import { gameJS, prepareGameDataForEngine } from './game-engine';
import { useTranslation } from 'react-i18next';
import { FONTS } from '../constants';

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

const Preview: React.FC<{ gameData: GameData, testSceneId?: string | null, basePath?: string }> = ({ gameData, testSceneId, basePath }) => {
    const { t } = useTranslation();
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    const fullHtml = useMemo(() => {
        const enableChances = gameData.enableChances || gameData.gameSystemEnabled === 'chances';
        const enableTrackers = gameData.enableTrackers || gameData.gameSystemEnabled === 'trackers';

        const chancesContainerHTML = enableChances ? '<div id="chances-container" class="chances-container"></div>' : '';

        const trackersButtonHTML = (enableTrackers && (gameData.gameShowTrackersUI ?? true))
            ? '<button id="trackers-button">__TRACKERS_BUTTON_TEXT__</button>'
            : '';

        const systemButtonHTML = (gameData.gameShowSystemButton ?? true)
            ? '<button id="system-button">__SYSTEM_BUTTON_TEXT__</button>'
            : '';

        const suggestionsButtonHTML = (gameData.enableSuggestions ?? true)
            ? `<button id="suggestions-button">${gameData.gameSuggestionsButtonText || t('UIEditor.textos.suggestionsPlaceholder', 'Suggestions')}</button>`
            : '';

        const fontFamily = gameData.gameFontFamily || "'Silkscreen', sans-serif";
        const fontUrl = getFontUrl(fontFamily);
        const fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';

        const inventoryButtonHTML = (gameData.enableInventory ?? true)
            ? `<button id="inventory-button">${gameData.gameInventoryButtonText || t('UIEditor.textos.inventoryPlaceholder', 'Inventory')}</button>`
            : '';

        const diaryButtonHTML = (gameData.enableDiary ?? true)
            ? `<button id="diary-button">${gameData.gameDiaryButtonText || t('UIEditor.textos.diaryPlaceholder', 'Logbook')}</button>`
            : '';

        const rawHtml = gameHTML;
        // Force migration of legacy input to contenteditable div for all projects
        const migratedHtml = rawHtml.replace(/<input type="text" id="verb-input"[^>]*>/, '<div id="verb-input" contenteditable="true" role="textbox" aria-multiline="false"></div>');

        const finalHtml = migratedHtml
            .replace(/__GAME_TITLE__/g, gameData.gameTitle || 'IF Builder Game')
            .replace('__LAYOUT_ORIENTATION_CLASS__', gameData.gameLayoutOrientation === 'horizontal' ? 'layout-horizontal' : '')
            .replace('__LAYOUT_ORDER_CLASS__', gameData.gameLayoutOrder === 'image-last' ? 'layout-image-last' : '')
            .replace('__FRAME_CLASS__', getFrameClass(gameData.gameImageFrame))
            .replace('__MOBILE_BEHAVIOR_CLASS__', 'behavior-immersive with-spacing') // FIXO: COMPORTAMENTO IMERSIVO
            .replace('__FONT_STYLESHEET__', fontStylesheet)
            .replace('__CHANCES_CONTAINER__', chancesContainerHTML)
            .replace('__TRACKERS_BUTTON__', trackersButtonHTML)
            .replace('__SYSTEM_BUTTON__', systemButtonHTML)
            .replace('__SUGGESTIONS_BUTTON__', suggestionsButtonHTML)
            .replace('__INVENTORY_BUTTON__', inventoryButtonHTML)
            .replace('__DIARY_BUTTON__', diaryButtonHTML)
            .replace(/__INVENTORY_BUTTON_TEXT__/g, gameData.gameInventoryButtonText || t('UIEditor.textos.inventoryPlaceholder'))
            .replace(/__SUGGESTIONS_BUTTON_TEXT__/g, gameData.gameSuggestionsButtonText || t('UIEditor.textos.suggestionsPlaceholder'))
            .replace(/__TRACKERS_BUTTON_TEXT__/g, gameData.gameTrackersButtonText || t('UIEditor.textos.trackersPlaceholder'))
            .replace(/__SYSTEM_BUTTON_TEXT__/g, gameData.gameSystemButtonText || t('UIEditor.textos.systemPlaceholder'))
            .replace(/__DIARY_BUTTON_TEXT__/g, gameData.gameDiaryButtonText || t('UIEditor.textos.diaryPlaceholder'))
            .replace('__SAVE_MENU_TITLE__', gameData.gameSaveMenuTitle || t('UIEditor.textos.saveMenuPlaceholder', 'Save Game'))
            .replace('__LOAD_MENU_TITLE__', gameData.gameLoadMenuTitle || t('UIEditor.textos.loadMenuPlaceholder', 'Load Game'))
            .replace('__MAIN_MENU_BUTTON_TEXT__', gameData.gameMainMenuButtonText || t('UIEditor.textos.mainMenuPlaceholder'))
            .replace('__VIEW_ENDING_BUTTON_TEXT__', gameData.gameViewEndingButtonText || t('UIEditor.textos.viewEndingPlaceholder'))
            .replace(/(<button(?:(?!\bid="vignette-continue-button")[^>])*class="[^"]*ending-restart-button[^"]*"[^>]*>)(.*?)(<\/button>)/g, `$1${gameData.gameRestartButtonText || t('UIEditor.textos.restartButtonPlaceholder')}$3`)
            .replace(/<button id="continue-button"([^>]*)>.*?<\/button>/g, `<button id="continue-button"$1>${gameData.gameContinueButtonText || t('UIEditor.textos.continueButtonPlaceholder')}</button>`)
            .replace(/<button id="system-button"([^>]*)>.*?<\/button>/g, `<button id="system-button"$1>${gameData.gameSystemButtonText || t('UIEditor.textos.systemPlaceholder')}</button>`)
            .replace('__CONTINUE_BUTTON_TEXT__', gameData.gameContinueButtonText || t('UIEditor.textos.continueButtonPlaceholder'))
            .replace(/__RESTART_BUTTON_TEXT__/g, gameData.gameRestartButtonText || t('UIEditor.textos.restartButtonPlaceholder'))
            .replace('__ACTION_BUTTON_TEXT__', gameData.gameActionButtonText || t('UIEditor.textos.actionButtonPlaceholder'))
            .replace('__VERB_INPUT_PLACEHOLDER__', gameData.gameVerbInputPlaceholder || t('UIEditor.textos.commandInputValue')) // Legacy safety
            .replace('id="verb-input"', `id="verb-input" data-placeholder="${gameData.gameVerbInputPlaceholder || t('UIEditor.textos.commandInputValue')}"`)
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
            .chance-icon svg { width: 24px; height: 24px; display: block; transition: all 0.3s ease; }
            .chance-icon.lost svg { opacity: 0.8; }

            /* Chance Animations */
            @keyframes chanceLost {
                0% { transform: scale(1); }
                30% { transform: scale(0.6); filter: brightness(1.5); }
                100% { transform: scale(1); }
            }

            @keyframes chanceRestored {
                0% { transform: scale(1); }
                40% { transform: scale(1.6); filter: brightness(1.5); }
                100% { transform: scale(1); }
            }

            .animate-chance-lost { animation: chanceLost 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; z-index: 10; }
            .animate-chance-restored { animation: chanceRestored 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; z-index: 10; }

            /* Final structural fix for Silkscreen clipping using contenteditable div */
            #verb-input {
                flex: 1;
                min-width: 0;
                height: 46px !important;
                background: rgba(0,0,0,0.3);
                border: 2px solid rgba(255,255,255,0.2);
                color: var(--text-color, white);
                padding: 0 12px !important;
                font-family: var(--font-family);
                font-size: 1em;
                box-sizing: border-box !important;
                outline: none;
                transition: all 0.2s;
                display: block !important; /* Block mode with line-height is better for caret centering */
                line-height: 42px !important; /* Calculated: 46px height - 4px (2px+2px borders) */
                white-space: nowrap !important;
                overflow: visible !important; 
                cursor: text;
                user-select: text;
            }
            #verb-input:focus {
                border-color: var(--action-button-bg, #4fd1c5);
                background: rgba(0,0,0,0.4);
            }
            #verb-input:empty::before {
                content: attr(data-placeholder);
                color: rgba(255,255,255,0.4);
                pointer-events: none;
                display: block;
                line-height: 42px !important; /* Ensures placeholder is also centered with the same logic */
            }
            
            #submit-verb {
                height: 46px !important;
                padding: 8px 16px !important;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none !important; 
                border-radius: 0 !important;
                margin: 0 !important; /* Prevent gaps or misalignment */
            }
            
            body.behavior-immersive #verb-input,
            body.behavior-immersive #submit-verb {
                height: 46px !important;
            }
            body.behavior-immersive #verb-input {
                 padding: 0 12px !important;
            }

            /* Mobile Responsive Fix */
            @media (max-width: 768px) {
                #scene-description { padding: 15px !important; }
                .scene-paragraph { margin-bottom: 12px; }
                
                .splash-content,
                #positive-ending-screen .content,
                #negative-ending-screen .content {
                    padding: 20px !important;
                }
            }

            /* 3. Text Scale Dynamic Injection */
            ${(() => {
                const vignettes = gameData.vignettes || [];
                const vignetteScaleClass = `vignette-scale-${gameData.vignetteScaling || 'md'}`;
                const opening = vignettes.find(v => v.id === 'VNT_OPENING') || vignettes[0];
                const victory = vignettes.find(v => v.isConclusion && v.id.includes('VICTORY')) || vignettes.find(v => v.isConclusion);
                const defeat = vignettes.find(v => v.isConclusion && v.id.includes('DEFEAT'));

                const getAnimationCss = (vignette: typeof opening, selector: string) => {
                    if (!vignette) return '';
                    const speed = vignette.textSpeed || 3;
                    const duration = Math.max(0.1, 3.0 - (speed * 0.5)) + 's';
                    const animType = vignette.textAnimationType || 'fade';

                    if (animType === 'typewriter') {
                        return `
                            ${selector} h1, ${selector} p, ${selector} .description {
                                animation: none !important;
                                opacity: 1 !important;
                            }
                        `;
                    }
                    return `
                        ${selector} h1, ${selector} p, ${selector} .description {
                            animation: fadeIn ${duration} forwards !important;
                        }
                    `;
                };

                return `
                    ${opening ? getAnimationCss(opening, '#splash-screen .splash-content') : ''}
                    ${opening ? getAnimationCss(opening, '#vignette-screen .splash-content') : ''}
                    ${victory ? getAnimationCss(victory, '#positive-ending-screen .content') : ''}
                    ${defeat ? getAnimationCss(defeat, '#negative-ending-screen .content') : ''}
                `;
            })()}


            ${OVERLAY_CSS}
        `;

        const finalCss = (gameCSS + cssOverrides)
            // Hotfix for legacy typo
            .replace('__FRAME_ROUND_TOP_COLOR__', '__FRAME_ROUNDED_TOP_COLOR__')
            .replace(/__FONT_FAMILY__/g, fontFamily)
            .replace(/__GAME_FONT_SIZE__/g, (() => {
                const size = gameData.gameFontSize || '12';
                return /^\d+$/.test(size) ? `${size}px` : size;
            })())
            .replace(/__FONT_SIZE_ADJUST__/g, (() => {
                const fontInfo = FONTS.find(f => f.family === fontFamily);
                return (fontInfo?.sizeAdjust || 1.0).toString();
            })())
            .replace(/__GAME_BACKGROUND_COLOR__/g, gameData.gameBackgroundColor || '#000000')
            .replace(/__GAME_TEXT_COLOR__/g, gameData.gameTextColor || '#c9d1d9')
            .replace(/__GAME_TITLE_COLOR__/g, gameData.gameTitleColor || '#58a6ff')
            .replace(/__GAME_FOCUS_COLOR__/g, gameData.gameFocusColor || '#58a6ff')
            .replace(/__SPLASH_BUTTON_COLOR__/g, gameData.gameSplashButtonColor || '#2ea043')
            .replace(/__SPLASH_BUTTON_HOVER_COLOR__/g, gameData.gameSplashButtonHoverColor || '#238636')
            .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, gameData.gameSplashButtonTextColor || '#ffffff')
            .replace(/__ACTION_BUTTON_COLOR__/g, gameData.gameActionButtonColor || '#ffffff')
            .replace(/__ACTION_BUTTON_TEXT_COLOR__/g, gameData.gameActionButtonTextColor || '#0d1117')
            .replace(/__ACTION_BUTTON_HOVER_COLOR__/g, gameData.gameActionButtonHoverColor || '#f0f0f0')
            .replace(/__SYSTEM_BUTTON_COLOR__/g, gameData.gameSystemButtonColor || 'transparent')
            .replace(/__SYSTEM_BUTTON_TEXT_COLOR__/g, gameData.gameSystemButtonTextColor || gameData.gameTextColor || '#c9d1d9')
            .replace(/__SYSTEM_BUTTON_BORDER_COLOR__/g, gameData.gameSystemButtonBorderColor || (gameData.gameTextColor ? (gameData.gameTextColor + '40') : '#c9d1d940'))
            .replace(/__SYSTEM_BUTTON_HOVER_COLOR__/g, gameData.gameSystemButtonHoverColor || gameData.gameFocusColor || '#58a6ff')
            .replace(/__SYSTEM_BUTTON_HOVER_TEXT_COLOR__/g, gameData.gameSystemButtonHoverTextColor || gameData.gameSystemButtonTextColor || gameData.gameTextColor || '#c9d1d9')
            .replace(/__FRAME_BOOK_COLOR__/g, gameData.frameBookColor || gameData.gameFrameColor || '#FFFFFF')
            .replace(/__FRAME_TRADING_CARD_COLOR__/g, gameData.frameTradingCardColor || gameData.gameFrameColor || '#FFFFFF')
            .replace(/__FRAME_ROUNDED_TOP_COLOR__/g, gameData.frameRoundedTopColor || gameData.gameFrameColor || '#FFFFFF')
            .replace(/__SCENE_NAME_OVERLAY_BG__/g, gameData.gameSceneNameOverlayBg || '#0d1117')
            .replace(/__SCENE_NAME_OVERLAY_TEXT_COLOR__/g, gameData.gameSceneNameOverlayTextColor || '#c9d1d9');

        const engineData = prepareGameDataForEngine({
            ...gameData,
            gameSplashButtonText: gameData.gameSplashButtonText || t('UIEditor.textos.splashButtonPlaceholder'),
            gameContinueButtonText: gameData.gameContinueButtonText || t('UIEditor.textos.continueButtonPlaceholder'),
            gameRestartButtonText: gameData.gameRestartButtonText || t('UIEditor.textos.restartButtonPlaceholder'),
            gameActionButtonText: gameData.gameActionButtonText || t('UIEditor.textos.actionButtonPlaceholder'),
            gameVerbInputPlaceholder: gameData.gameVerbInputPlaceholder || t('UIEditor.textos.commandInputValue'),
            gameSuggestionsEmptyFeedback: gameData.gameSuggestionsEmptyFeedback || t('UIEditor.textos.suggestionsEmptyFeedbackDefault'),
            gameInventoryEmptyFeedback: gameData.gameInventoryEmptyFeedback || t('UIEditor.textos.inventoryEmptyFeedbackDefault'),
            gameTranslations: {
                view_diary_btn: gameData.gameRetrospectiveButtonText || t('game.diary.view_diary_btn'),
                stats_visited: t('game.diary.stats_visited'),
                stats_time: t('game.diary.stats_time'),
                total_words_read: t('game.diary.total_words_read'),
                of_scenes: t('game.diary.of_scenes')
            }
        });
        if (testSceneId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (engineData as any).cena_inicial = testSceneId;
        }

        const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');

        const dataScript = `<script>
            window.embeddedGameData = ${safeJson}; 
            window.isPreview = true;
            window.isSceneTest = ${!!testSceneId};
        </script>`;
        const testSceneCss = testSceneId ? `<style>html,body{background-color:#000!important}#splash-screen{display:none!important;opacity:0!important;pointer-events:none!important}#game-container{opacity:0;transition:opacity 0.3s ease-in-out}#game-container.ready{opacity:1!important}</style>` : '';
        const baseTag = basePath ? `<base href="${window.location.origin}${basePath}/">` : '';
        const styleTag = `<style>${finalCss}</style>`;
        const gameScriptTag = `<script>${gameJS}</script>`;
        const vignetteScaleClass = `vignette-scale-${gameData.vignetteScaling || 'md'}`;

        return finalHtml
            .replace('<div id="splash-screen" class="splash-screen"', `<div id="splash-screen" class="splash-screen ${vignetteScaleClass}"`)
            .replace('<div id="positive-ending-screen" class="splash-screen"', `<div id="positive-ending-screen" class="splash-screen ${vignetteScaleClass}"`)
            .replace('<div id="negative-ending-screen" class="splash-screen"', `<div id="negative-ending-screen" class="splash-screen ${vignetteScaleClass}"`)
            .replace('<div id="vignette-screen" class="splash-screen"', `<div id="vignette-screen" class="splash-screen ${vignetteScaleClass}"`)
            .replace('</head>', `${baseTag}${testSceneCss}${styleTag}</head>`)
            .replace('</body>', `${dataScript}${gameScriptTag}</body>`);

    }, [gameData, testSceneId, t, basePath]);

    useEffect(() => {
        if (!fullHtml) {
            setBlobUrl(null);
            return;
        }

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [fullHtml]);

    return (
        <div className="w-full h-full bg-brand-bg relative">
            <iframe
                src={blobUrl || 'about:blank'}
                title="Pré-visualização do Jogo"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
};

export default Preview;
