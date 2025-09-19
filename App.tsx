

import React, { useState, useCallback, useMemo } from 'react';
// FIX: Added 'View' to the import from './types' to resolve the 'Cannot find name 'View'' error.
import { GameData, Scene, GameObject, Interaction, View } from './types';
import Sidebar from './components/Sidebar';
import SceneEditor from './components/SceneEditor';
import Header from './components/Header';
import { WelcomePlaceholder } from './components/WelcomePlaceholder';
import UIEditor from './components/UIEditor';
import GameInfoEditor from './components/GameInfoEditor';
import Preview from './components/Preview';

const gameHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__GAME_TITLE__</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    __FONT_STYLESHEET__
    <link rel="stylesheet" href="style.css">
</head>
<body class="__THEME_CLASS__ __FRAME_CLASS__">
    <audio id="scene-sound-effect" preload="auto"></audio>
    <div class="main-wrapper">
        <div id="splash-screen" class="splash-screen __SPLASH_ALIGN_CLASS__" __SPLASH_BG_STYLE__>
          <div class="splash-content" __SPLASH_TEXT_STYLE__>
            <div class="splash-text">
                __SPLASH_LOGO_IMG_TAG__
                __SPLASH_TITLE_H1_TAG__
                <p>__SPLASH_DESCRIPTION__</p>
            </div>
            <div class="splash-buttons">
                <button id="continue-button" class="hidden">__CONTINUE_BUTTON_TEXT__</button>
                <button id="splash-start-button">__SPLASH_BUTTON_TEXT__</button>
            </div>
          </div>
        </div>

        <div id="positive-ending-screen" class="splash-screen hidden __POSITIVE_ENDING_ALIGN_CLASS__" __POSITIVE_ENDING_BG_STYLE__>
            <div class="splash-content">
                <div class="splash-text">
                    <p>__POSITIVE_ENDING_DESCRIPTION__</p>
                </div>
                <button class="ending-restart-button">__RESTART_BUTTON_TEXT__</button>
            </div>
        </div>
        <div id="negative-ending-screen" class="splash-screen hidden __NEGATIVE_ENDING_ALIGN_CLASS__" __NEGATIVE_ENDING_BG_STYLE__>
            <div class="splash-content">
                <div class="splash-text">
                    <p>__NEGATIVE_ENDING_DESCRIPTION__</p>
                </div>
                <button class="ending-restart-button">__RESTART_BUTTON_TEXT__</button>
            </div>
        </div>

        <div class="game-container">
            <div class="image-panel">
                <div id="transition-overlay" class="transition-overlay"></div>
                <div id="image-container" class="image-container">
                  <img id="scene-image" src="" alt="Ilustração da cena">
                </div>
            </div>
            <div class="text-panel">
                <div id="scene-description" class="scene-description"></div>
                <div id="action-popup" class="action-popup hidden"></div>
                __CHANCES_CONTAINER__
                <div class="action-bar">
                    <div class="action-buttons">
                        <button id="suggestions-button">Sugestões</button>
                        <button id="inventory-button">Inventário</button>
                        <button id="diary-button">Diário</button>
                    </div>
                    <div class="input-area">
                        <input type="text" id="command-input" placeholder="__COMMAND_INPUT_PLACEHOLDER__">
                        <button id="submit-command">__ACTION_BUTTON_TEXT__</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Diary Modal -->
    <div id="diary-modal" class="modal-overlay hidden">
        <div class="modal-content diary-modal-content">
            <button class="modal-close-button">&times;</button>
            <h2>Diário</h2>
            <div id="diary-log" class="diary-log"></div>
        </div>
    </div>
</body>
</html>
`;

const gameCSS = `
body.dark-theme {
    --bg-color: #0d1117;
    --panel-bg: #161b22;
    --border-color: #30363d;
    --text-color: __GAME_TEXT_COLOR__;
    --text-dim-color: #8b949e;
    --accent-color: __GAME_TITLE_COLOR__;
    --danger-color: #f85149;
    --danger-hover-bg: #da3633;
    --highlight-color: #eab308;
    --input-bg: #010409;
    --button-bg: #21262d;
    --button-hover-bg: #30363d;
    --frame-wood-dark: #3a2d2d;
    --frame-wood-light: #5a3d3d;
    --frame-gold: #c0a080;
}

body.light-theme {
    --bg-color: #ffffff;
    --panel-bg: #f6f8fa;
    --border-color: #d0d7de;
    --text-color: __GAME_TEXT_COLOR_LIGHT__;
    --text-dim-color: #57606a;
    --accent-color: __GAME_TITLE_COLOR_LIGHT__;
    --danger-color: #cf222e;
    --danger-hover-bg: #a40e26;
    --highlight-color: #9a6700;
    --input-bg: #ffffff;
    --button-bg: #f6f8fa;
    --button-hover-bg: #e5e7eb;
    --frame-wood-dark: #6d5f5f;
    --frame-wood-light: #8b7979;
    --frame-gold: #a18060;
}

:root {
    --font-family: __FONT_FAMILY__;
    --splash-button-bg: __SPLASH_BUTTON_COLOR__;
    --splash-button-hover-bg: __SPLASH_BUTTON_HOVER_COLOR__;
    --splash-button-text-color: __SPLASH_BUTTON_TEXT_COLOR__;
    --action-button-bg: __ACTION_BUTTON_COLOR__;
    --action-button-text-color: __ACTION_BUTTON_TEXT_COLOR__;
    --splash-align-items: flex-end;
    --splash-justify-content: flex-end;
    --splash-text-align: right;
    --splash-content-align-items: flex-end;
}

/* Reset and base styles */
* { box-sizing: border-box; }
body {
    font-family: var(--font-family);
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
}

.main-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 30px rgba(0,0,0,0.7);
    overflow: hidden;
    position: relative;
}


/* Splash Screen */
.splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    background-size: cover;
    background-position: center;
    z-index: 2000;
    padding: 5vw;
    display: flex;
    align-items: var(--splash-align-items);
    justify-content: var(--splash-justify-content);
}
.splash-screen.align-left {
    --splash-justify-content: flex-start;
    --splash-align-items: flex-start;
    --splash-text-align: left;
    --splash-content-align-items: flex-start;
}
.splash-content {
    text-align: var(--splash-text-align);
    display: flex;
    flex-direction: column;
    align-items: var(--splash-content-align-items);
    gap: 20px;
}
.splash-logo {
    max-height: 150px;
    width: auto;
    margin-bottom: 20px;
}
.splash-text h1 {
    font-size: 2.5em;
    color: var(--accent-color);
    margin: 0;
    text-shadow: none;
}
.splash-text p {
    font-size: 1.1em;
    margin-top: 10px;
    color: var(--text-color);
    max-width: 60ch;
}
.splash-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    align-items: var(--splash-content-align-items);
}
#splash-start-button, .ending-restart-button, #continue-button {
    font-family: var(--font-family);
    padding: 12px 24px;
    font-size: 1.2em;
    font-weight: bold;
    border: none;
    cursor: pointer;
    color: var(--splash-button-text-color);
    transition: all 0.2s ease-in-out;
    width: 100%;
    max-width: 350px;
}
#splash-start-button, .ending-restart-button {
    background-color: var(--splash-button-bg);
}
#continue-button {
    background-color: #1d4ed8; /* Blue-700 */
}
#splash-start-button:hover, .ending-restart-button:hover, #continue-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 0px rgba(0, 0, 0, 0.4);
}
#splash-start-button:hover, .ending-restart-button:hover {
    background-color: var(--splash-button-hover-bg);
}
#continue-button:hover {
    background-color: #2563eb; /* Blue-600 */
}


/* Chances Container */
.chances-container {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
    margin-bottom: 15px;
}
.chance-icon {
    width: 28px;
    height: 28px;
    transition: all 0.3s ease;
}
.chance-icon.lost {
    opacity: 0.5;
}

/* Main Layout */
.game-container {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
}
.image-panel {
    flex: 0 0 45%;
    max-width: 650px;
    border-right: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--input-bg);
    position: relative;
    transition: padding 0.3s ease-in-out, background-color 0.3s ease-in-out;
}
.image-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    transition: border 0.3s ease-in-out, outline 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}
#scene-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.text-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 30px;
    position: relative;
}
.scene-description {
    flex-grow: 1;
    overflow-y: auto;
    white-space: pre-wrap;
    line-height: 1.8;
    padding-bottom: 20px;
}
.command-echo { color: var(--text-dim-color); font-style: italic; }
.highlight-item {
    font-weight: bold;
    color: var(--highlight-color);
}

.click-to-continue {
    font-weight: bold;
    color: var(--accent-color);
    cursor: pointer;
    margin-top: 15px;
    display: inline-block;
}
.click-to-continue:hover {
    text-decoration: underline;
}

.btn-return-chance {
    font-family: var(--font-family);
    padding: 10px 15px;
    border: 2px solid var(--border-color);
    background-color: var(--panel-bg);
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.9em;
    margin-top: 20px;
    display: inline-block;
    border-radius: 4px;
}
.btn-return-chance:hover {
    background-color: var(--border-color);
}

/* Action Bar & Popups */
.action-bar {
    border-top: 2px solid var(--border-color);
    padding-top: 20px;
    margin-top: auto;
    flex-shrink: 0;
}
.action-popup {
    margin-bottom: 20px;
    background-color: var(--panel-bg);
    border: 1px solid var(--border-color);
    padding: 15px;
}
.action-popup.hidden { display: none; }
.action-popup-list button, .action-popup-list p {
    display: inline-block;
    padding: 8px 12px;
    margin: 0 8px 8px 0;
    text-align: left;
    background-color: var(--button-bg);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    font-family: var(--font-family);
    font-size: 0.9em;
}
.action-popup-list button {
    cursor: pointer;
}
.action-popup-list button:hover {
    background-color: var(--border-color);
}
.action-popup-list p {
    cursor: default;
    color: var(--text-dim-color);
}
.action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}
.action-buttons button {
    font-family: var(--font-family);
    padding: 10px 15px;
    border: 2px solid var(--border-color);
    background-color: var(--panel-bg);
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
    font-size: 0.9em;
}
.action-buttons button:hover {
    background-color: var(--border-color);
    border-color: var(--text-dim-color);
}
.input-area { 
    display: flex;
    gap: 10px;
}
#command-input {
    flex-grow: 1;
    padding: 15px 12px;
    border: 2px solid var(--border-color);
    background-color: var(--input-bg);
    color: var(--text-color);
    font-family: var(--font-family);
    font-size: 1em;
}
#command-input:focus {
    outline: none;
    border-color: var(--border-color);
}
#command-input:disabled {
    background-color: var(--button-bg);
    cursor: not-allowed;
}
#submit-command {
    padding: 10px 20px;
    border: 2px solid var(--border-color);
    background-color: var(--action-button-bg);
    color: var(--action-button-text-color);
    font-family: var(--font-family);
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
}
#submit-command:hover { background-color: #e0e0e0; }

#submit-command:disabled {
    background-color: var(--button-hover-bg);
    color: var(--text-dim-color);
    cursor: not-allowed;
}
#submit-command:disabled:hover {
    background-color: var(--button-hover-bg);
}

/* Diary Modal */
.hidden { display: none !important; }
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    background-color: var(--panel-bg);
    padding: 30px;
    border: 2px solid var(--border-color);
    position: relative;
    max-width: 600px;
    width: 90%;
}
.modal-content h2 {
    margin-top: 0;
    font-size: 1.5em;
    color: var(--accent-color);
}
.modal-close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    color: var(--text-dim-color);
    font-size: 2em;
    cursor: pointer;
    line-height: 1;
}
.diary-modal-content {
    max-width: 80vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
}
.diary-log { flex-grow: 1; overflow-y: auto; text-align: left; }
.diary-entry {
    display: flex;
    gap: 15px;
    align-items: flex-start;
    padding: 15px;
    border-bottom: 1px solid var(--border-color);
}
.diary-entry:last-child { border-bottom: none; }
.diary-entry .image-container {
    flex: 0 0 150px;
}
.diary-entry .image-container img {
    max-width: 150px;
    width: 100%;
    border: 1px solid var(--border-color);
}
.diary-entry .text-container {
    flex: 1;
}
.diary-entry .scene-name {
    font-weight: bold;
    color: var(--accent-color);
    margin-bottom: 8px;
    display: block;
}
.diary-entry .text-container p {
    margin: 0;
    white-space: pre-wrap;
}
.diary-entry .text-container .command-echo {
    display: block;
    margin-top: 10px;
    color: var(--text-dim-color);
    font-style: italic;
}

/* Transition Overlay */
.transition-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease-in-out;
    z-index: 500;
}
.transition-overlay.active {
    opacity: 1;
    pointer-events: auto;
}

/* Image Frame Styles */
.frame-classic .image-panel {
    padding: 20px;
    background: var(--frame-wood-dark);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
    border-right-color: var(--frame-wood-dark);
}
.frame-classic .image-container {
    border: 4px solid var(--frame-gold);
    outline: 10px solid var(--frame-wood-light);
    box-shadow: 0 0 15px rgba(0,0,0,0.7);
}

.frame-art-deco .image-panel {
    padding: 25px;
    background: #1c1c1c;
    position: relative;
    border-right-color: #1c1c1c;
    box-shadow: inset 0 0 10px black;
}
.frame-art-deco .image-container {
    border: 2px solid var(--frame-gold);
    position: relative;
}
.frame-art-deco .image-panel::before { /* top-left */
    content: ''; position: absolute; top: 8px; left: 8px;
    width: 45px; height: 45px;
    border-style: solid; border-color: var(--frame-gold);
    border-width: 2px 0 0 2px;
    box-shadow: inset 2px 2px 0 0 var(--frame-gold);
}
.frame-art-deco .image-panel::after { /* bottom-right */
    content: ''; position: absolute; bottom: 8px; right: 8px;
    width: 45px; height: 45px;
    border-style: solid; border-color: var(--frame-gold);
    border-width: 0 2px 2px 0;
    box-shadow: inset -2px -2px 0 0 var(--frame-gold);
}
.frame-art-deco .image-container::before { /* top-right */
    content: ''; position: absolute; top: -17px; right: -17px;
    width: 45px; height: 45px;
    border-style: solid; border-color: var(--frame-gold);
    border-width: 2px 2px 0 0;
    box-shadow: inset -2px 2px 0 0 var(--frame-gold);
}
.frame-art-deco .image-container::after { /* bottom-left */
    content: ''; position: absolute; bottom: -17px; left: -17px;
    width: 45px; height: 45px;
    border-style: solid; border-color: var(--frame-gold);
    border-width: 0 0 2px 2px;
    box-shadow: inset 2px -2px 0 0 var(--frame-gold);
}

.frame-rounded-top .image-panel {
    padding: 15px;
    background: #000;
    border: 10px solid #facc15; /* yellow-400 */
    border-radius: 80px 80px 6px 6px;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.6);
}
.frame-rounded-top .image-container {
    border-radius: 65px 65px 0 0;
}
`;

const initialScenes: { [id: string]: Scene } = {
    "scn_cela_inicial": {
      id: "scn_cela_inicial",
      name: "Cela Inicial",
      image: "",
      description: "Sua cabeça dói. Você não sabe seu nome, nem onde está.\nVocê está em uma cela pequena e escura. O chão é de pedra fria e úmida. Há uma porta de madeira reforçada na sua frente.",
      objects: [
        { id: "obj_chave_de_ferro", name: "chave de ferro", examineDescription: "Uma chave de ferro pesada e enferrujada. Parece antiga.", isTakable: true },
        { id: "obj_pedra_solta", name: "pedra", examineDescription: "Uma das pedras da parede parece estar solta. Talvez você consiga movê-la.", isTakable: false },
        { id: "obj_porta_da_cela", name: "porta", examineDescription: "Uma porta de madeira reforçada com ferro. Parece trancada.", isTakable: false }
      ],
      interactions: [
          {
              id: 'inter_1',
              verbs: ['mover', 'forçar', 'empurrar'],
              target: 'pedra',
              successMessage: 'Com um rangido, você move a pedra, revelando uma passagem escura.',
              removesTargetFromScene: true,
              goToScene: 'scn_corredor'
          },
          {
              id: 'inter_door_key',
              verbs: ['usar', 'abrir', 'destrancar'],
              target: 'porta',
              requiresInInventory: 'obj_chave_de_ferro',
              successMessage: 'Você usa a chave de ferro na fechadura. Com um clique alto, a porta se destranca e se abre, revelando um corredor escuro.',
              removesTargetFromScene: true,
              goToScene: 'scn_corredor'
          }
      ]
    },
    "scn_corredor": {
      id: "scn_corredor",
      name: "Corredor",
      image: "",
      description: "Você está em um corredor escuro e úmido. A única luz vem da cela atrás de você.",
      objects: [],
      interactions: [
          {
              id: 'inter_2',
              verbs: ['ir', 'voltar', 'mover'],
              target: 'cela',
              successMessage: 'Você volta para a cela.',
              goToScene: 'scn_cela_inicial'
          }
      ]
    }
};

const generateUniqueId = (prefix: 'scn' | 'obj' | 'inter', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`;
    } while (existingIds.includes(id));
    return id;
};

const initializeGameData = (): GameData => {
    const sceneIdMap: { [oldId: string]: string } = {};
    const objIdMap: { [oldId: string]: string } = {};
    
    const newScenes: { [id: string]: Scene } = {};
    const existingScnIds: string[] = [];
    const existingObjIds: string[] = [];

    const initialSceneOrder = Object.keys(initialScenes);

    // First pass: generate new IDs for scenes and objects and create a map.
    initialSceneOrder.forEach(oldSceneId => {
        const newSceneId = generateUniqueId('scn', existingScnIds);
        existingScnIds.push(newSceneId);
        sceneIdMap[oldSceneId] = newSceneId;

        const scene = initialScenes[oldSceneId];
        scene.objects.forEach(obj => {
            const newObjId = generateUniqueId('obj', existingObjIds);
            existingObjIds.push(newObjId);
            objIdMap[obj.id] = newObjId;
        });
    });
    
    // Second pass: build the new scenes object using the new IDs and updating all references.
    initialSceneOrder.forEach(oldSceneId => {
        const oldScene = initialScenes[oldSceneId];
        const newSceneId = sceneIdMap[oldSceneId];

        const newObjects: GameObject[] = oldScene.objects.map(obj => ({
            ...obj,
            id: objIdMap[obj.id],
        }));

        const newInteractions: Interaction[] = oldScene.interactions.map(inter => ({
            ...inter,
            id: generateUniqueId('inter', []), // Interaction IDs are local to the scene, no need for a global check
            goToScene: inter.goToScene ? sceneIdMap[inter.goToScene] : undefined,
            requiresInInventory: inter.requiresInInventory ? objIdMap[inter.requiresInInventory] : undefined,
        }));

        newScenes[newSceneId] = {
            ...oldScene,
            id: newSceneId,
            objects: newObjects,
            interactions: newInteractions,
        };
    });

    const newSceneOrder = initialSceneOrder.map(oldId => sceneIdMap[oldId]);
    const oldStartScene = "scn_cela_inicial";
    const newStartScene = sceneIdMap[oldStartScene];
    
    return {
        startScene: newStartScene,
        scenes: newScenes,
        sceneOrder: newSceneOrder,
        defaultFailureMessage: "Isso não parece ter nenhum efeito.",
        gameHTML: gameHTML,
        gameCSS: gameCSS,
        gameTitle: "Fuja da Masmorra",
        gameFontFamily: "'Silkscreen', sans-serif",
        gameLogo: "", // base64 string
        gameSplashImage: "", // base64 string
        gameSplashContentAlignment: 'right',
        gameSplashDescription: "Uma breve descrição da sua aventura começa aqui. O que o jogador deve saber antes de iniciar?",
        gameTextColor: "#c9d1d9",
        gameTitleColor: "#58a6ff",
        gameOmitSplashTitle: false,
        gameSplashButtonText: "INICIAR AVENTURA",
        gameContinueButtonText: "Continuar Aventura",
        gameRestartButtonText: "Reiniciar Aventura",
        gameSplashButtonColor: "#2ea043",
        gameSplashButtonHoverColor: "#238636",
        gameSplashButtonTextColor: "#ffffff",
        gameLayoutOrientation: 'vertical',
        gameLayoutOrder: 'image-first',
        gameImageFrame: 'none',
        gameActionButtonColor: '#ffffff',
        gameActionButtonTextColor: '#0d1117',
        gameActionButtonText: 'AÇÃO',
        gameCommandInputPlaceholder: 'O QUE VOCÊ FAZ?',
        gameDiaryPlayerName: 'VOCÊ',
        gameFocusColor: '#58a6ff',
        gameEnableChances: false,
        gameMaxChances: 3,
        gameChanceIcon: 'heart',
        gameChanceIconColor: '#ff4d4d',
        gameChanceLossMessage: "Você cometeu um erro e perdeu uma chance. Restam {chances} chance(s).",
        gameChanceRestoreMessage: "Você se sente revigorado e recupera uma chance.",
        gameChanceReturnButtonText: "Tentar Novamente",
        gameTheme: 'dark',
        gameTextColorLight: '#24292f',
        gameTitleColorLight: '#0969da',
        gameFocusColorLight: '#0969da',
        positiveEndingImage: "",
        positiveEndingContentAlignment: 'right',
        positiveEndingDescription: "Parabéns! Você concluiu a aventura com sucesso.",
        negativeEndingImage: "",
        negativeEndingContentAlignment: 'right',
        negativeEndingDescription: "Fim de jogo. Suas chances acabaram. Tente novamente!",
    };
};


const App: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>(() => initializeGameData());
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(gameData.startScene);
  const [currentView, setCurrentView] = useState<View>('scenes');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [gameDataForPreview, setGameDataForPreview] = useState<GameData | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const confirmNavigation = useCallback((callback: () => void) => {
    // The confirmation prompt has been removed as per user request.
    // Navigation proceeds immediately, discarding any unsaved changes.
    if (isDirty) {
      setIsDirty(false);
    }
    callback();
  }, [isDirty]);

  const handleTogglePreview = useCallback(() => {
    confirmNavigation(() => {
        setIsPreviewMode(prev => {
            const isOpening = !prev;
            if (isOpening) {
                setGameDataForPreview(null);
            }
            return isOpening;
        });
    });
  }, [confirmNavigation]);
  
  const handlePreviewSingleScene = useCallback((sceneWithUnsavedChanges: Scene) => {
    const tempGameData = JSON.parse(JSON.stringify(gameData));
    tempGameData.scenes[sceneWithUnsavedChanges.id] = sceneWithUnsavedChanges;
    tempGameData.startScene = sceneWithUnsavedChanges.id;
    
    setGameDataForPreview(tempGameData);
    setIsPreviewMode(true);
  }, [gameData]);

  const handleSelectSceneAndSwitchView = useCallback((id: string) => {
    confirmNavigation(() => {
        setSelectedSceneId(id);
        setCurrentView('scenes');
        setIsPreviewMode(false);
    });
  }, [confirmNavigation]);

  const handleSetView = useCallback((view: View) => {
    confirmNavigation(() => {
        setCurrentView(view);
    });
  }, [confirmNavigation]);

  const handleImportGame = useCallback((dataToImport: any) => {
    confirmNavigation(() => {
        const importedData = { ...dataToImport };

        if (importedData.cenas && !importedData.scenes) {
          importedData.scenes = importedData.cenas;
          delete importedData.cenas;
        }
        if (importedData.cena_inicial && !importedData.startScene) {
            importedData.startScene = importedData.cena_inicial;
            delete importedData.cena_inicial;
        }
        if (importedData.mensagem_falha_padrao && !importedData.defaultFailureMessage) {
            importedData.defaultFailureMessage = importedData.mensagem_falha_padrao;
            delete importedData.mensagem_falha_padrao;
        }
        if (importedData.scenes) {
            Object.values(importedData.scenes).forEach((scene: any) => {
                if (scene.objetos && !scene.objects) {
                    scene.objects = scene.objetos;
                    delete scene.objetos;
                }
            });
        }

        setGameData(prev => ({...prev, ...importedData}));
        setSelectedSceneId(importedData.startScene || Object.keys(importedData.scenes)[0]);
        setCurrentView('scenes');
        setIsPreviewMode(false);
    });
  }, [confirmNavigation]);

  const handleAddScene = useCallback(() => {
    confirmNavigation(() => {
        const newSceneId = generateUniqueId('scn', Object.keys(gameData.scenes));
        const newScene: Scene = {
          id: newSceneId,
          name: "Nova Cena",
          description: "Descreva esta nova cena...",
          image: "",
          objects: [],
          interactions: []
        };
        setGameData(prev => ({
          ...prev,
          scenes: { ...prev.scenes, [newSceneId]: newScene },
          sceneOrder: [...prev.sceneOrder, newSceneId],
        }));
        setSelectedSceneId(newSceneId);
        setCurrentView('scenes');
    });
  }, [gameData.scenes, confirmNavigation]);

  const handleUpdateScene = useCallback((updatedScene: Scene) => {
    setGameData(prev => {
      const newScenes = { 
          ...prev.scenes,
          [updatedScene.id]: updatedScene 
      };
      
      return {
        ...prev,
        scenes: newScenes,
      };
    });
    setIsDirty(false);
  }, []);

  const handleDeleteScene = useCallback((idToDelete: string) => {
    if (idToDelete === gameData.startScene) {
        // This is a safeguard, the UI should prevent this.
        alert("A cena inicial não pode ser deletada.");
        return;
    }

    setGameData(prev => {
        const newScenes = { ...prev.scenes };
        delete newScenes[idToDelete];

        // Clean up interactions in other scenes that point to the deleted scene
        const cleanedScenes = Object.keys(newScenes).reduce((acc, sceneId) => {
            const scene = newScenes[sceneId];
            const needsCleaning = scene.interactions.some(inter => inter.goToScene === idToDelete);

            if (needsCleaning) {
                const cleanedInteractions = scene.interactions.map(inter => {
                    if (inter.goToScene === idToDelete) {
                        const { goToScene, ...restOfInteraction } = inter;
                        return restOfInteraction;
                    }
                    return inter;
                });
                acc[sceneId] = { ...scene, interactions: cleanedInteractions };
            } else {
                acc[sceneId] = scene;
            }
            return acc;
        }, {} as { [id: string]: Scene });

        const newSceneOrder = prev.sceneOrder.filter(id => id !== idToDelete);
        
        // If the currently selected scene is the one being deleted,
        // select the start scene instead.
        if (selectedSceneId === idToDelete) {
            setSelectedSceneId(prev.startScene);
        }
        
        return {
            ...prev,
            scenes: cleanedScenes,
            sceneOrder: newSceneOrder,
        };
    });

    setIsDirty(false);
  }, [gameData.startScene, selectedSceneId]);
  
  const handleReorderScenes = useCallback((newOrder: string[]) => {
      setGameData(prev => {
        // Garante que a cena inicial seja sempre a primeira na ordem.
        const filteredOrder = newOrder.filter(id => id !== prev.startScene);
        const finalOrder = [prev.startScene, ...filteredOrder];
        return { ...prev, sceneOrder: finalOrder };
      });
  }, []);
  
  const handleUpdateGameData = useCallback((field: keyof GameData, value: any) => {
    setGameData(prev => ({ ...prev, [field]: value }));
    setIsDirty(false);
  }, []);

  const scenesInOrder = gameData.sceneOrder.map(id => gameData.scenes[id]).filter(Boolean);
  const selectedScene = selectedSceneId ? gameData.scenes[selectedSceneId] : null;

  const allObjectIds = useMemo(() => {
    return Object.values(gameData.scenes).flatMap(s => s.objects.map(o => o.id));
  }, [gameData.scenes]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'scenes':
        return selectedScene ? (
          <SceneEditor
            key={selectedScene.id}
            scene={selectedScene}
            allScenes={scenesInOrder}
            onUpdateScene={handleUpdateScene}
            allObjectIds={allObjectIds}
            onPreviewScene={handlePreviewSingleScene}
            sceneOrder={gameData.sceneOrder}
            onSelectScene={handleSelectSceneAndSwitchView}
            isDirty={isDirty}
            onSetDirty={setIsDirty}
            layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
          />
        ) : (
          <WelcomePlaceholder />
        );
      case 'interface':
        return (
          <UIEditor
            html={gameData.gameHTML}
            css={gameData.gameCSS}
            layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
            layoutOrder={gameData.gameLayoutOrder || 'image-first'}
            imageFrame={gameData.gameImageFrame || 'none'}
            actionButtonText={gameData.gameActionButtonText || 'AÇÃO'}
            commandInputPlaceholder={gameData.gameCommandInputPlaceholder || 'O QUE VOCÊ FAZ?'}
            diaryPlayerName={gameData.gameDiaryPlayerName || 'VOCÊ'}
            splashButtonText={gameData.gameSplashButtonText || 'INICIAR AVENTURA'}
            continueButtonText={gameData.gameContinueButtonText || 'Continuar Aventura'}
            restartButtonText={gameData.gameRestartButtonText || 'Reiniciar Aventura'}
            enableChances={gameData.gameEnableChances || false}
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
            chanceIcon={gameData.gameChanceIcon || 'heart'}
            chanceLossMessage={gameData.gameChanceLossMessage || ''}
            chanceRestoreMessage={gameData.gameChanceRestoreMessage || ''}
            chanceReturnButtonText={gameData.gameChanceReturnButtonText || ''}
            gameTheme={gameData.gameTheme || 'dark'}
            textColorLight={gameData.gameTextColorLight || '#24292f'}
            titleColorLight={gameData.gameTitleColorLight || '#0969da'}
            focusColorLight={gameData.gameFocusColorLight || '#0969da'}
            onUpdate={handleUpdateGameData}
            isDirty={isDirty}
            onSetDirty={setIsDirty}
          />
        );
      case 'game_info':
        return (
          <GameInfoEditor
            title={gameData.gameTitle || 'Fuja da Masmorra'}
            logo={gameData.gameLogo || ''}
            omitSplashTitle={gameData.gameOmitSplashTitle || false}
            splashImage={gameData.gameSplashImage || ''}
            splashContentAlignment={gameData.gameSplashContentAlignment || 'right'}
            splashDescription={gameData.gameSplashDescription || ''}
            positiveEndingImage={gameData.positiveEndingImage || ''}
            positiveEndingContentAlignment={gameData.positiveEndingContentAlignment || 'right'}
            positiveEndingDescription={gameData.positiveEndingDescription || ''}
            negativeEndingImage={gameData.negativeEndingImage || ''}
            negativeEndingContentAlignment={gameData.negativeEndingContentAlignment || 'right'}
            negativeEndingDescription={gameData.negativeEndingDescription || ''}
            onUpdate={handleUpdateGameData}
            isDirty={isDirty}
            onSetDirty={setIsDirty}
          />
        );
      default:
        return <WelcomePlaceholder />;
    }
  };

  // FIX: Added the main return statement for the App component to render the layout.
  return (
    <div className="flex flex-col h-screen bg-brand-bg text-brand-text font-sans">
      <Header
        gameData={gameData}
        onImportGame={handleImportGame}
        isPreviewing={isPreviewMode}
        onTogglePreview={handleTogglePreview}
      />
      {isPreviewMode ? (
        <Preview gameData={gameDataForPreview || gameData} />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            scenes={scenesInOrder}
            startSceneId={gameData.startScene}
            selectedSceneId={selectedSceneId}
            currentView={currentView}
            onSelectScene={handleSelectSceneAndSwitchView}
            onAddScene={handleAddScene}
            onDeleteScene={handleDeleteScene}
            onReorderScenes={handleReorderScenes}
            onSetView={handleSetView}
          />
          <main className="flex-1 p-6 overflow-y-auto">
            {renderCurrentView()}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;