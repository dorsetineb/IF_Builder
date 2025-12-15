import React, { useState, useCallback, useMemo } from 'react';
import { GameData, Scene, GameObject, Interaction, View, ConsequenceTracker, FixedVerb } from './types';
import Sidebar from './components/Sidebar';
import SceneEditor from './components/SceneEditor';
import Header from './components/Header';
import { WelcomePlaceholder } from './components/WelcomePlaceholder';
import { UIEditor } from './components/UIEditor';
import Preview from './components/Preview';
import SceneMap from './components/SceneMap';
import GlobalObjectsEditor from './components/GlobalObjectsEditor';
import TrackersEditor from './components/TrackersEditor';

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
<body class="__THEME_CLASS__ __FRAME_CLASS__ __FONT_ADJUST_CLASS__">
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

        <div class="game-container __LAYOUT_ORIENTATION_CLASS__ __LAYOUT_ORDER_CLASS__">
            <div class="image-panel">
                <div id="transition-overlay" class="transition-overlay"></div>
                <div id="image-container" class="image-container">
                  <img id="scene-image" src="" alt="Ilustração da cena">
                  <div id="scene-name-overlay" class="scene-name-overlay"></div>
                </div>
            </div>
            <div class="text-panel">
                <div id="scene-description" class="scene-description"></div>
                <div id="action-popup" class="action-popup hidden"></div>
                __CHANCES_CONTAINER__
                <div class="action-bar">
                    <div class="action-buttons">
                        <button id="suggestions-button">__SUGGESTIONS_BUTTON_TEXT__</button>
                        <button id="inventory-button">__INVENTORY_BUTTON_TEXT__</button>
                        <button id="diary-button">__DIARY_BUTTON_TEXT__</button>
                        __TRACKERS_BUTTON__
                    </div>
                    <div class="input-area">
                        <input type="text" id="verb-input" placeholder="__VERB_INPUT_PLACEHOLDER__">
                        <button id="submit-verb">__ACTION_BUTTON_TEXT__</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Trackers Modal -->
    <div id="trackers-modal" class="modal-overlay hidden">
        <div class="modal-content trackers-modal-content">
            <button class="modal-close-button">&times;</button>
            <h2>__TRACKERS_BUTTON_TEXT__</h2>
            <div id="trackers-content"></div>
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
    
    <!-- Item Modal -->
    <div id="item-modal" class="modal-overlay hidden">
        <div class="modal-content item-modal-content">
            <button class="modal-close-button">&times;</button>
            <h2 id="item-modal-name"></h2>
            <div class="item-modal-body">
                <div id="item-modal-image-container" class="item-modal-image-container hidden">
                    <img id="item-modal-image" src="" alt="Item Image">
                </div>
                <p id="item-modal-description"></p>
            </div>
        </div>
    </div>
</body>
</html>
`;

const gameCSS = `
body { padding: 0; }
body.with-spacing { padding: 2rem; }
body.dark-theme { --bg-color: #0d1117; --panel-bg: #161b22; --border-color: #30363d; --text-color: __GAME_TEXT_COLOR__; --text-dim-color: #8b949e; --accent-color: __GAME_TITLE_COLOR__; --danger-color: #f85149; --danger-hover-bg: #da3633; --highlight-color: #eab308; --input-bg: #010409; --button-bg: #21262d; --button-hover-bg: #30363d; }
body.light-theme { --bg-color: #ffffff; --panel-bg: #f6f8fa; --border-color: #d0d7de; --text-color: __GAME_TEXT_COLOR_LIGHT__; --text-dim-color: #57606a; --accent-color: __GAME_TITLE_COLOR_LIGHT__; --danger-color: #cf222e; --danger-hover-bg: #a40e26; --highlight-color: #9a6700; --input-bg: #ffffff; --button-bg: #f6f8fa; --button-hover-bg: #e5e7eb; }
:root { --font-family: __FONT_FAMILY__; --font-size: __GAME_FONT_SIZE__; --splash-button-bg: __SPLASH_BUTTON_COLOR__; --splash-button-hover-bg: __SPLASH_BUTTON_HOVER_COLOR__; --splash-button-text-color: __SPLASH_BUTTON_TEXT_COLOR__; --action-button-bg: __ACTION_BUTTON_COLOR__; --action-button-text-color: __ACTION_BUTTON_TEXT_COLOR__; --splash-align-items: flex-end; --splash-justify-content: flex-end; --splash-text-align: right; --splash-content-align-items: flex-end; --scene-name-overlay-bg: __SCENE_NAME_OVERLAY_BG__; --scene-name-overlay-text-color: __SCENE_NAME_OVERLAY_TEXT_COLOR__; --tracker-bar-fill-color: var(--accent-color); --tracker-bar-bg-color: var(--input-bg); --continue-indicator-color: __CONTINUE_INDICATOR_COLOR__; }
* { box-sizing: border-box; }
body { font-family: var(--font-family); font-size: var(--font-size); background-color: var(--bg-color); color: var(--text-color); margin: 0; height: 100vh; overflow: hidden; }
.main-wrapper { height: 100%; display: flex; flex-direction: column; overflow: hidden; position: relative; max-width: 1280px; margin: 0 auto; }
body.with-spacing .main-wrapper { height: 100%; }
.splash-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--bg-color); background-size: cover; background-position: center; z-index: 2000; padding: 0; display: flex; align-items: var(--splash-align-items); justify-content: var(--splash-justify-content); }
.splash-screen.align-left { --splash-justify-content: flex-start; --splash-align-items: flex-start; --splash-text-align: left; --splash-content-align-items: flex-start; }
.splash-content { text-align: var(--splash-text-align); display: flex; flex-direction: column; align-items: var(--splash-content-align-items); gap: 20px; width: 100%; padding: 5vw 225px; }
.splash-logo { max-height: 150px; width: auto; margin-bottom: 20px; }
.splash-text h1 { font-size: 2.5em; color: var(--accent-color); margin: 0; text-shadow: none; }
.splash-text p { font-size: 1.1em; margin-top: 10px; color: var(--text-color); max-width: 60ch; white-space: pre-wrap; }
.splash-buttons { display: flex; flex-direction: column; gap: 15px; width: 100%; align-items: var(--splash-content-align-items); }
#splash-start-button, .ending-restart-button, #continue-button { font-family: var(--font-family); padding: 12px 24px; font-size: 1.2em; font-weight: bold; border: none; cursor: pointer; color: var(--splash-button-text-color); transition: all 0.2s ease-in-out; width: 100%; max-width: 350px; }
#splash-start-button, .ending-restart-button { background-color: var(--splash-button-bg); }
#continue-button { background-color: #1d4ed8; }
#splash-start-button:hover, .ending-restart-button:hover, #continue-button:hover { transform: translateY(-3px); box-shadow: 0 3px 0px rgba(0, 0, 0, 0.4); }
#splash-start-button:hover, .ending-restart-button:hover { background-color: var(--splash-button-hover-bg); }
#continue-button:hover { background-color: #2563eb; }
.chances-container { display: flex; align-items: center; gap: 8px; justify-content: flex-end; margin-bottom: 15px; }
.chance-icon { width: 28px; height: 28px; transition: all 0.3s ease; }
.chance-icon.lost { opacity: 0.5; }
.game-container { display: flex; flex-grow: 1; overflow: hidden; }
.image-panel { flex: 0 0 45%; max-width: 650px; border-right: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; background-color: var(--input-bg); position: relative; transition: padding 0.3s ease-in-out, background-color 0.3s ease-in-out; }
.image-container { width: 100%; height: 100%; position: relative; overflow: hidden; background-size: cover; background-position: center; transition: border 0.3s ease-in-out, outline 0.3s ease-in-out, box-shadow 0.3s ease-in-out; }
#scene-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
.scene-name-overlay { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: var(--scene-name-overlay-bg); color: var(--scene-name-overlay-text-color); border: 2px solid var(--border-color); border-radius: 0; font-size: 0.9em; font-weight: bold; z-index: 10; opacity: 0; transition: opacity 0.5s ease-in-out; pointer-events: none; text-align: center; padding: 8px 16px; box-sizing: border-box; }
.text-panel { flex: 1; display: flex; flex-direction: column; padding: 30px; position: relative; }
.game-container.layout-horizontal { flex-direction: column; }
.game-container.layout-horizontal .image-panel { flex-basis: 45%; max-width: none; width: 100%; border-right: none; border-bottom: 2px solid var(--border-color); }
.game-container.layout-horizontal .text-panel { min-height: 0; }
.game-container.layout-image-last { flex-direction: row-reverse; }
.game-container.layout-image-last .image-panel { border-right: none; border-left: 2px solid var(--border-color); }
.game-container.layout-horizontal.layout-image-last { flex-direction: column-reverse; }
.game-container.layout-horizontal.layout-image-last .image-panel { border-left: none; border-bottom: none; border-top: 2px solid var(--border-color); }
.scene-description { flex-grow: 1; overflow-y: auto; white-space: pre-wrap; line-height: 1.8; padding-bottom: 20px; }
.verb-echo { color: var(--text-dim-color); font-style: italic; }
.highlight-item { font-weight: bold; color: var(--highlight-color); }
.highlight-word { font-weight: bold; color: var(--accent-color); cursor: pointer; transition: color 0.2s; }
.highlight-word:hover { filter: brightness(1.2); text-decoration: underline; }
.action-bar { border-top: 2px solid var(--border-color); padding-top: 20px; margin-top: auto; flex-shrink: 0; }
.action-popup { margin-bottom: 20px; background-color: var(--panel-bg); border: 1px solid var(--border-color); padding: 15px; }
.action-popup.hidden { display: none; }
.action-popup-container { display: flex; flex-direction: column; gap: 12px; }
.action-popup-row { display: flex; flex-wrap: wrap; gap: 8px; }
.action-popup-list button, .action-popup-row button, .action-popup-list p { display: inline-block; padding: 8px 12px; margin: 0; text-align: left; background-color: var(--button-bg); border: 1px solid var(--border-color); color: var(--text-color); font-family: var(--font-family); font-size: 0.9em; }
.action-popup-list button, .action-popup-row button { cursor: pointer; }
.action-popup-list button:hover, .action-popup-row button:hover { background-color: var(--border-color); }
.action-popup-list p { cursor: default; color: var(--text-dim-color); }
.action-buttons { display: flex; gap: 10px; margin-bottom: 15px; }
.action-buttons button { font-family: var(--font-family); padding: 10px 15px; border: 2px solid var(--border-color); background-color: var(--panel-bg); color: var(--text-color); cursor: pointer; transition: background-color 0.2s, border-color 0.2s; font-size: 0.9em; }
.action-buttons button:hover { background-color: var(--border-color); border-color: var(--text-dim-color); }
.input-area { display: flex; gap: 10px; }
#verb-input { flex-grow: 1; padding: 15px 12px; border: 2px solid var(--border-color); background-color: var(--input-bg); color: var(--text-color); font-family: var(--font-family); font-size: 1em; }
#verb-input:focus { outline: none; border-color: var(--border-color); }
#verb-input:disabled { background-color: var(--button-bg); cursor: not-allowed; }
#submit-verb { padding: 10px 20px; border: 2px solid var(--border-color); background-color: var(--action-button-bg); color: var(--action-button-text-color); font-family: var(--font-family); cursor: pointer; font-weight: bold; transition: background-color 0.2s; }
#submit-verb:hover { background-color: #e0e0e0; }
#submit-verb:disabled { background-color: var(--button-hover-bg); color: var(--text-dim-color); cursor: not-allowed; }
#submit-verb:disabled:hover { background-color: var(--button-hover-bg); }
.hidden { display: none !important; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background-color: var(--panel-bg); padding: 30px; border: 2px solid var(--border-color); position: relative; max-width: 600px; width: 90%; }
.modal-content h2 { margin-top: 0; font-size: 1.5em; color: var(--accent-color); }
.modal-close-button { position: absolute; top: 10px; right: 15px; background: none; border: none; color: var(--text-dim-color); font-size: 2em; cursor: pointer; line-height: 1; }
.trackers-modal-content { max-height: 80vh; display: flex; flex-direction: column; }
#trackers-content { flex-grow: 1; overflow-y: auto; padding-right: 15px; margin-right: -15px; }
.diary-modal-content { max-width: 80vw; height: 80vh; display: flex; flex-direction: column; }
.diary-log { flex-grow: 1; overflow-y: auto; text-align: left; }
.diary-entry { display: flex; gap: 15px; align-items: flex-start; padding: 15px; border-bottom: 1px solid var(--border-color); }
.diary-entry:last-child { border-bottom: none; }
.diary-entry .image-container { flex: 0 0 150px; }
.diary-entry .image-container img { max-width: 150px; width: 100%; border: 1px solid var(--border-color); }
.diary-entry .text-container { flex: 1; }
.diary-entry .scene-name { font-weight: bold; color: var(--accent-color); margin-bottom: 8px; display: block; }
.diary-entry .text-container p { margin: 0; white-space: pre-wrap; }
.diary-entry .text-container .verb-echo { display: block; margin-top: 10px; color: var(--text-dim-color); font-style: italic; }
.diary-entry .highlight-word { cursor: default; }
.diary-entry .highlight-word:hover { filter: none; text-decoration: none; }
.diary-input { color: var(--text-dim-color); font-style: italic; margin-top: 8px; font-size: 0.9em; }
.diary-output { color: var(--text-color); margin-bottom: 8px; margin-left: 10px; border-left: 2px solid var(--border-color); padding-left: 8px; }
.item-modal-content { max-width: 650px; width: 90%; text-align: center; }
.item-modal-body { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.item-modal-image-container { width: 500px; height: 500px; overflow: hidden; border: 2px solid var(--border-color); border-radius: 8px; background-color: var(--input-bg); }
.item-modal-image-container img { width: 100%; height: 100%; object-fit: contain; display: block; }
#item-modal-description { color: var(--text-color); }
.transition-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: transparent; opacity: 0; pointer-events: none; transition: opacity 0.5s ease-in-out; z-index: 500; background-size: cover; background-position: center; }
.transition-overlay.active { opacity: 1; pointer-events: auto; }
.transition-overlay.is-wiping { opacity: 1; transition: clip-path 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
.transition-overlay.wipe-down-start { clip-path: inset(0 0 100% 0); }
.transition-overlay.wipe-up-start { clip-path: inset(100% 0 0 0); }
.transition-overlay.wipe-left-start { clip-path: inset(0 0 0 100%); }
.transition-overlay.wipe-right-start { clip-path: inset(0 100% 0 0); }
.transition-overlay.wipe-down-start.active, .transition-overlay.wipe-up-start.active, .transition-overlay.wipe-left-start.active, .transition-overlay.wipe-right-start.active { clip-path: inset(0 0 0 0); }
body.frame-none .image-panel { border: none; }
body.frame-rounded-top .game-container .image-panel { padding: 10px; background: __FRAME_ROUNDED_TOP_COLOR__; border: none; border-radius: 150px 150px 6px 6px; box-shadow: none; }
body.frame-rounded-top .game-container .image-container { border-radius: 140px 140px 0 0; }
body.frame-book-cover .game-container .image-panel { padding: 15px; background: var(--bg-color); border: 10px solid __FRAME_BOOK_COLOR__; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); }
body.frame-book-cover .game-container .image-container { box-shadow: 0 0 15px rgba(0,0,0,0.7); }
body.frame-book-cover .game-container.layout-image-last .image-panel { border-left: 10px solid __FRAME_BOOK_COLOR__; border-right: 10px solid __FRAME_BOOK_COLOR__; }
body.frame-trading-card .image-panel { padding: 8px; background: __FRAME_TRADING_CARD_COLOR__; border-radius: 20px; }
body.frame-trading-card .game-container:not(.layout-image-last) .image-panel { border-right-color: transparent; }
body.frame-trading-card .game-container.layout-image-last .image-panel { border-left-color: transparent; }
body.frame-trading-card .image-container { border: none; border-radius: 12px; }
#scene-image { border-radius: 10px; }
body.frame-chamfered .game-container .image-panel { padding: 10px; background: __FRAME_CHAMFERED_COLOR__; border: none; clip-path: polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px); }
body.frame-chamfered .game-container .image-container { width: 100%; height: 100%; border: none; background-color: transparent; clip-path: polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px); }
body.font-adjust-gothic { font-size: 1.15em; }
.scene-description::-webkit-scrollbar, .diary-log::-webkit-scrollbar, #trackers-content::-webkit-scrollbar { width: 12px; }
.scene-description::-webkit-scrollbar-track, .diary-log::-webkit-scrollbar-track, #trackers-content::-webkit-scrollbar-track { background: var(--panel-bg); }
.scene-description::-webkit-scrollbar-thumb, .diary-log::-webkit-scrollbar-thumb, #trackers-content::-webkit-scrollbar-thumb { background-color: var(--text-dim-color); border-radius: 6px; border: 3px solid var(--panel-bg); }
.scene-description::-webkit-scrollbar-thumb:hover, .diary-log::-webkit-scrollbar-thumb:hover, #trackers-content::-webkit-scrollbar-thumb:hover { background-color: var(--text-color); }
.tracker-item { margin-bottom: 15px; }
.tracker-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.tracker-item-name { font-size: 0.9em; color: var(--text-dim-color); }
.tracker-item-values { font-size: 0.9em; font-family: monospace; color: var(--text-color); }
.tracker-bar-container { width: 100%; height: 22px; background-color: var(--tracker-bar-bg-color); border: 2px solid var(--border-color); border-radius: 4px; overflow: hidden; }
.tracker-bar { height: 100%; background-color: var(--tracker-bar-fill-color); transition: width 0.3s ease-in-out; }
.empty-inventory-msg { font-size: 0.9em; color: var(--text-dim-color); font-style: italic; }
.continue-indicator { text-align: left; cursor: pointer; padding: 10px 0; color: var(--continue-indicator-color); animation: bounce 1s infinite; font-size: 1.5em; user-select: none; width: 100%; margin-top: 10px; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
.scene-paragraph { margin: 0 0 10px 0; opacity: 0; animation: fadeIn 0.5s forwards; }
@keyframes fadeIn { to { opacity: 1; } }
`;

const generateUniqueId = (prefix: 'scn' | 'obj' | 'inter' | 'trk' | 'verb', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
    } while (existingIds.includes(id));
    return id;
};

const initialGameData: GameData = {
    startScene: '',
    scenes: {},
    globalObjects: {},
    sceneOrder: [],
    defaultFailureMessage: 'Não aconteceu nada.',
    gameHTML: gameHTML,
    gameCSS: gameCSS,
    gameTitle: 'Minha Aventura de Texto',
    gameSystemEnabled: 'none',
    gameMaxChances: 3,
    gameTheme: 'dark',
    gameImageFrame: 'none',
    gameLayoutOrientation: 'vertical',
    gameLayoutOrder: 'image-first',
    gameTextColor: '#c9d1d9',
    gameTitleColor: '#58a6ff',
    gameFocusColor: '#58a6ff',
    gameTextColorLight: '#24292f',
    gameTitleColorLight: '#0969da',
    gameFocusColorLight: '#0969da',
    gameSplashButtonColor: '#2ea043',
    gameSplashButtonHoverColor: '#238636',
    gameSplashButtonTextColor: '#ffffff',
    gameActionButtonColor: '#ffffff',
    gameActionButtonTextColor: '#0d1117',
    gameChanceIcon: 'heart',
    gameChanceIconColor: '#ff4d4d',
    frameBookColor: '#FFFFFF',
    frameTradingCardColor: '#1c1917',
    frameChamferedColor: '#FFFFFF',
    frameRoundedTopColor: '#facc15',
    gameSceneNameOverlayBg: '#0d1117',
    gameSceneNameOverlayTextColor: '#c9d1d9',
    gameContinueIndicatorColor: '#58a6ff',
    
    // Explicit Portuguese Defaults
    gameActionButtonText: 'Ação',
    gameSplashButtonText: 'INICIAR',
    gameContinueButtonText: 'Continuar Aventura',
    gameRestartButtonText: 'Reiniciar Aventura',
    gameVerbInputPlaceholder: 'O que você faz?',
    gameDiaryPlayerName: 'Jogador',
    gameSuggestionsButtonText: 'Sugestões',
    gameInventoryButtonText: 'Inventário',
    gameDiaryButtonText: 'Diário',
    gameTrackersButtonText: 'Rastreadores',
    gameChanceReturnButtonText: 'Tentar Novamente',
    fixedVerbs: [],
    consequenceTrackers: [],
};

const App: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>(initialGameData);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('scenes');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Derived state for scene list
  const scenesList = useMemo(() => {
    return gameData.sceneOrder.map(id => gameData.scenes[id]).filter(Boolean);
  }, [gameData.scenes, gameData.sceneOrder]);

  const selectedScene = selectedSceneId ? gameData.scenes[selectedSceneId] : null;

  // Memoize arrays to ensure referential stability and prevent UIEditor field reset loops
  const fixedVerbs = useMemo(() => gameData.fixedVerbs || [], [gameData.fixedVerbs]);
  const consequenceTrackers = useMemo(() => gameData.consequenceTrackers || [], [gameData.consequenceTrackers]);

  const handleImportGame = useCallback((data: GameData) => {
    setGameData(prev => ({
        ...prev,
        ...data,
        gameHTML: gameHTML, // Ensure templates are preserved/updated
        gameCSS: gameCSS,
        fixedVerbs: data.fixedVerbs || [], // Ensure array
        consequenceTrackers: data.consequenceTrackers || [], // Ensure array
    }));
    if (data.startScene) {
        setSelectedSceneId(data.startScene);
    } else if (data.sceneOrder.length > 0) {
        setSelectedSceneId(data.sceneOrder[0]);
    }
    setIsDirty(false);
  }, []);

  const handleUpdateGameData = (field: keyof GameData, value: any) => {
    setGameData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAddScene = () => {
    const newId = generateUniqueId('scn', Object.keys(gameData.scenes));
    const newScene: Scene = {
        id: newId,
        name: 'Nova Cena',
        image: '',
        description: 'Descrição da nova cena.',
        objectIds: [],
        interactions: []
    };
    
    setGameData(prev => {
        const newScenes = { ...prev.scenes, [newId]: newScene };
        const newOrder = [...prev.sceneOrder, newId];
        const isFirst = newOrder.length === 1;
        return { 
            ...prev, 
            scenes: newScenes, 
            sceneOrder: newOrder,
            startScene: isFirst ? newId : prev.startScene 
        };
    });
    setSelectedSceneId(newId);
    setIsDirty(true);
  };

  const handleDeleteScene = (id: string) => {
      if (id === gameData.startScene && Object.keys(gameData.scenes).length > 1) {
          alert("Você não pode deletar a cena inicial. Defina outra cena como inicial antes de excluir esta.");
          return;
      }
      
      const confirmDelete = window.confirm("Tem certeza que deseja deletar esta cena?");
      if (!confirmDelete) return;

      setGameData(prev => {
          const newScenes = { ...prev.scenes };
          delete newScenes[id];
          const newOrder = prev.sceneOrder.filter(sid => sid !== id);
          let newStart = prev.startScene;
          if (newStart === id) {
              newStart = newOrder.length > 0 ? newOrder[0] : '';
          }

          // Remove interactions pointing to this scene
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

          return { ...prev, scenes: newScenes, sceneOrder: newOrder, startScene: newStart };
      });
      
      if (selectedSceneId === id) setSelectedSceneId(null);
      setIsDirty(true);
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
          const newOrder = [...prev.sceneOrder, newId];
          return { ...prev, scenes: newScenes, sceneOrder: newOrder };
      });
      setSelectedSceneId(newId);
      setIsDirty(true);
  };

  const handleReorderScenes = (newOrder: string[]) => {
      setGameData(prev => ({ ...prev, sceneOrder: newOrder }));
      setIsDirty(true);
  };

  const handleSelectScene = (id: string) => {
      if (currentView === 'global_objects' || currentView === 'trackers') {
        setCurrentView('scenes');
      }
      setSelectedSceneId(id);
  };

  const handleSetView = (view: View) => {
      setCurrentView(view);
      if (view === 'scenes' && !selectedSceneId && scenesList.length > 0) {
          setSelectedSceneId(scenesList[0].id);
      }
  };

  const handleNewGame = () => {
      if (isDirty) {
          if (!window.confirm("Existem alterações não salvas. Deseja iniciar um novo jogo e perder as alterações atuais?")) {
              return;
          }
      }
      setGameData(initialGameData);
      setSelectedSceneId(null);
      setIsDirty(false);
  };
  
  // Object management
  const handleCreateGlobalObject = (obj: GameObject, linkToSceneId?: string) => {
      setGameData(prev => {
          const newObjects = { ...prev.globalObjects, [obj.id]: obj };
          let newScenes = prev.scenes;
          
          if (linkToSceneId && prev.scenes[linkToSceneId]) {
              const scene = prev.scenes[linkToSceneId];
              newScenes = {
                  ...prev.scenes,
                  [linkToSceneId]: {
                      ...scene,
                      objectIds: [...(scene.objectIds || []), obj.id]
                  }
              };
          }
          
          return { ...prev, globalObjects: newObjects, scenes: newScenes };
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
      if (!window.confirm("Tem certeza que deseja excluir este objeto? Ele será removido de todas as cenas.")) return;
      
      setGameData(prev => {
          const newObjects = { ...prev.globalObjects };
          delete newObjects[objectId];
          
          const newScenes = { ...prev.scenes };
          Object.values(newScenes).forEach((scene: Scene) => {
              if (scene.objectIds) {
                  scene.objectIds = scene.objectIds.filter(id => id !== objectId);
              }
              if (scene.interactions) {
                  scene.interactions.forEach(inter => {
                      if (inter.target === objectId) inter.target = '';
                      if (inter.requiresInInventory === objectId) inter.requiresInInventory = '';
                  });
              }
          });
          
          return { ...prev, globalObjects: newObjects, scenes: newScenes };
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


  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-brand-bg text-brand-text">
        {isPreviewing ? (
             <div className="flex flex-col w-full h-full">
                <Header 
                    gameData={gameData} 
                    onImportGame={handleImportGame} 
                    isPreviewing={isPreviewing} 
                    onTogglePreview={() => setIsPreviewing(false)} 
                />
                <Preview gameData={gameData} />
             </div>
        ) : (
            <>
                <Header 
                    gameData={gameData} 
                    onImportGame={handleImportGame} 
                    isPreviewing={isPreviewing} 
                    onTogglePreview={() => setIsPreviewing(true)} 
                />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar 
                        scenes={scenesList}
                        startSceneId={gameData.startScene}
                        selectedSceneId={selectedSceneId}
                        currentView={currentView}
                        onSelectScene={handleSelectScene}
                        onAddScene={handleAddScene}
                        onDeleteScene={handleDeleteScene}
                        onReorderScenes={handleReorderScenes}
                        onSetView={handleSetView}
                        onNewGame={handleNewGame}
                    />
                    <main className="flex-1 overflow-y-auto p-6 relative bg-brand-bg">
                        {currentView === 'interface' && (
                            <UIEditor
                                {...gameData}
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
                                positiveEndingImage={gameData.positiveEndingImage || ''}
                                positiveEndingContentAlignment={gameData.positiveEndingContentAlignment || 'right'}
                                positiveEndingDescription={gameData.positiveEndingDescription || ''}
                                negativeEndingImage={gameData.negativeEndingImage || ''}
                                negativeEndingContentAlignment={gameData.negativeEndingContentAlignment || 'right'}
                                negativeEndingDescription={gameData.negativeEndingDescription || ''}
                                fixedVerbs={fixedVerbs}
                                actionButtonText={gameData.gameActionButtonText || 'Ação'}
                                verbInputPlaceholder={gameData.gameVerbInputPlaceholder || 'O que você faz?'}
                                diaryPlayerName={gameData.gameDiaryPlayerName || 'Jogador'}
                                splashButtonText={gameData.gameSplashButtonText || 'INICIAR'}
                                continueButtonText={gameData.gameContinueButtonText || 'Continuar'}
                                restartButtonText={gameData.gameRestartButtonText || 'Reiniciar'}
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
                                gameFontSize={gameData.gameFontSize || '1em'}
                                chanceIcon={gameData.gameChanceIcon || 'heart'}
                                chanceReturnButtonText={gameData.gameChanceReturnButtonText || 'Tentar Novamente'}
                                gameTheme={gameData.gameTheme || 'dark'}
                                textColorLight={gameData.gameTextColorLight || '#24292f'}
                                titleColorLight={gameData.gameTitleColorLight || '#0969da'}
                                focusColorLight={gameData.gameFocusColorLight || '#0969da'}
                                frameBookColor={gameData.frameBookColor || '#FFFFFF'}
                                frameTradingCardColor={gameData.frameTradingCardColor || '#1c1917'}
                                frameChamferedColor={gameData.frameChamferedColor || '#FFFFFF'}
                                frameRoundedTopColor={gameData.frameRoundedTopColor || '#facc15'}
                                gameSceneNameOverlayBg={gameData.gameSceneNameOverlayBg || '#0d1117'}
                                gameSceneNameOverlayTextColor={gameData.gameSceneNameOverlayTextColor || '#c9d1d9'}
                                gameShowTrackersUI={!!gameData.gameShowTrackersUI}
                                imageFrame={gameData.gameImageFrame || 'none'}
                                layoutOrder={gameData.gameLayoutOrder || 'image-first'}
                                layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                                suggestionsButtonText={gameData.gameSuggestionsButtonText}
                                inventoryButtonText={gameData.gameInventoryButtonText}
                                diaryButtonText={gameData.gameDiaryButtonText}
                                trackersButtonText={gameData.gameTrackersButtonText}
                                gameContinueIndicatorColor={gameData.gameContinueIndicatorColor || '#58a6ff'}
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
                                onPreviewScene={(scene) => {
                                    // Hacky preview scene: Create a temp gameData with this scene as start
                                    const previewData = { ...gameData, startScene: scene.id };
                                    handleImportGame(previewData);
                                    setIsPreviewing(true);
                                }}
                                onSelectScene={handleSelectScene}
                                isDirty={isDirty}
                                onSetDirty={setIsDirty}
                                layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                                consequenceTrackers={consequenceTrackers}
                            />
                        ) : currentView === 'scenes' ? (
                            <WelcomePlaceholder />
                        ) : null}
                        
                        {currentView === 'map' && (
                            <SceneMap 
                                allScenesMap={gameData.scenes}
                                startSceneId={gameData.startScene}
                                onSelectScene={handleSelectScene}
                                onUpdateScenePosition={handleUpdateScenePosition}
                                onAddScene={handleAddScene}
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
                    </main>
                </div>
            </>
        )}
    </div>
  );
};

export default App;