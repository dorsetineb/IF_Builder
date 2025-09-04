

import React, { useMemo } from 'react';
import { GameData } from '../types';
import { gameJS, prepareGameDataForEngine } from './game-engine';

const Preview: React.FC<{ gameData: GameData }> = ({ gameData }) => {
    const srcDoc = useMemo(() => {
        let headerContent;
        if (gameData.gameEnableChances) {
            headerContent = '<div id="chances-container" class="chances-container"></div>';
        } else {
            headerContent = '<button id="restart-button" class="btn-danger">Reiniciar Aventura</button>';
        }

        let finalHtml = gameData.gameHTML
            .replace('__GAME_TITLE__', gameData.gameTitle || 'IF Builder Game')
            .replace('__LOGO_IMG_TAG__', gameData.gameLogo ? `<img src="${gameData.gameLogo}" alt="Logo" class="game-logo">` : '')
            .replace('__HEADER_TITLE_H1_TAG__', !gameData.gameHideTitle ? `<h1>${gameData.gameTitle}</h1>` : '')
            .replace('<button id="restart-button" class="btn-danger">Reiniciar Aventura</button>', headerContent)
            .replace('__SPLASH_BG_STYLE__', gameData.gameSplashImage ? `style="background-image: url('${gameData.gameSplashImage}')"` : '')
            .replace('__SPLASH_LOGO_IMG_TAG__', gameData.gameLogo ? `<img src="${gameData.gameLogo}" alt="Logo" class="splash-logo">` : '')
            .replace('__SPLASH_TITLE_H1_TAG__', !gameData.gameOmitSplashTitle ? `<h1>${gameData.gameTitle}</h1>` : '')
            .replace('__SPLASH_DESCRIPTION__', gameData.gameSplashDescription || '')
            .replace('__SPLASH_BUTTON_TEXT__', gameData.gameSplashButtonText || 'Start')
            .replace('__ACTION_BUTTON_TEXT__', gameData.gameActionButtonText || 'Action')
            .replace('__COMMAND_INPUT_PLACEHOLDER__', gameData.gameCommandInputPlaceholder || 'What do you do?');
            
        const chancesCSS = `
        .chances-container { display: flex; align-items: center; gap: 8px; }
        .chance-icon { width: 28px; height: 28px; transition: all 0.3s ease; }
        .chance-icon.lost { opacity: 0.5; }
        `;

        let finalCss = gameData.gameCSS
            .replace(/:root {/, 
                `:root {\n    --text-color: ${gameData.gameTextColor || '#c9d1d9'};` +
                `\n    --accent-color: ${gameData.gameTitleColor || '#58a6ff'};` +
                `\n    --splash-button-bg: ${gameData.gameSplashButtonColor || '#2ea043'};` +
                `\n    --splash-button-hover-bg: ${gameData.gameSplashButtonHoverColor || '#238636'};`+
                `\n    --focus-color: ${gameData.gameFocusColor || '#58a6ff'};`
            ) + (gameData.gameEnableChances ? chancesCSS : '');

        if (gameData.gameSplashContentAlignment === 'left') {
            finalCss = finalCss
                .replace(/--splash-align-items: flex-end;/g, '--splash-align-items: flex-start;')
                .replace(/--splash-justify-content: flex-end;/g, '--splash-justify-content: flex-start;')
                .replace(/--splash-text-align: right;/g, '--splash-text-align: left;')
                .replace(/--splash-content-align-items: flex-end;/g, '--splash-content-align-items: flex-start;');
        }
            
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