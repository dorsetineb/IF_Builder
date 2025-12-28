
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
    <audio id="bgm-audio" preload="auto" loop></audio>
    <div class="main-wrapper" id="main-wrapper">
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

        <div class="game-container __LAYOUT_ORIENTATION_CLASS__ __LAYOUT_ORDER_CLASS__" id="game-container">
            <div class="image-panel">
                <div id="image-container" class="image-container">
                  <!-- Back image: The Next Scene (loads behind) -->
                  <img id="scene-image-back" src="" alt="Cena seguinte" class="scene-image hidden">
                  <!-- Front image: The Current Scene (animates out) -->
                  <img id="scene-image" src="" alt="Cena atual" class="scene-image">
                  <div id="scene-name-overlay" class="scene-name-overlay"></div>
                </div>
            </div>
            <div class="text-panel">
                <div id="scene-description" class="scene-description"></div>
                <div id="action-popup" class="action-popup hidden"></div>
                __CHANCES_CONTAINER__
                <div class="action-bar" id="standard-action-bar">
                    <div class="action-buttons">
                        <button id="suggestions-button">__SUGGESTIONS_BUTTON_TEXT__</button>
                        <button id="inventory-button">__INVENTORY_BUTTON_TEXT__</button>
                        <button id="diary-button">__DIARY_BUTTON_TEXT__</button>
                        __TRACKERS_BUTTON__
                        __SYSTEM_BUTTON__
                    </div>
                    <div class="input-area">
                        <input type="text" id="verb-input" placeholder="__VERB_INPUT_PLACEHOLDER__">
                        <button id="submit-verb">__ACTION_BUTTON_TEXT__</button>
                    </div>
                </div>
                <div class="action-bar hidden" id="ending-action-bar">
                    <button id="view-ending-button" class="view-ending-button">__VIEW_ENDING_BUTTON_TEXT__</button>
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
            <h2 id="diary-modal-title">__DIARY_BUTTON_TEXT__</h2>
            <div id="diary-log" class="diary-log"></div>
        </div>
    </div>
    
    <!-- System Modal -->
    <div id="system-modal" class="modal-overlay hidden">
        <div class="modal-content system-modal-content">
            <button class="modal-close-button">&times;</button>
            <h2 id="system-modal-title">__SYSTEM_BUTTON_TEXT__</h2>
            
            <!-- Main System Menu -->
            <div id="system-menu-main" class="system-menu">
                <button id="btn-save-menu">__SAVE_MENU_TITLE__</button>
                <button id="btn-load-menu">__LOAD_MENU_TITLE__</button>
                <button id="btn-main-menu" class="danger-button">__MAIN_MENU_BUTTON_TEXT__</button>
            </div>

            <!-- Slots Container -->
            <div id="system-slots-container" class="system-slots hidden">
                <div id="slots-list">
                    <!-- Slots will be injected here -->
                </div>
                <button id="btn-back-system" class="mt-4">Voltar</button>
            </div>
        </div>
    </div>
    
    <!-- Item Modal -->
    <div id="item-modal" class="modal-overlay hidden">
        <div class="modal-content item-modal-content">
            <button class="modal-close-button">&times;</button>
            <h2 id="item-modal-title">__INVENTORY_BUTTON_TEXT__</h2>
            <div class="item-modal-body">
                <div id="item-modal-image-container" class="item-modal-image-container hidden">
                    <img id="item-modal-image" src="" alt="Item Image">
                </div>
                <div id="item-modal-text-container" class="item-modal-text-container">
                    <h3 id="item-modal-name" class="item-modal-name"></h3>
                    <p id="item-modal-description"></p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

const gameCSS = `
body { padding: 0; }
body.with-spacing { padding: 30px; }
body.dark-theme { --bg-color: #0d1117; --panel-bg: #161b22; --border-color: #30363d; --text-color: __GAME_TEXT_COLOR__; --text-dim-color: #8b949e; --accent-color: __GAME_TITLE_COLOR__; --danger-color: #f85149; --danger-hover-bg: #da3633; --highlight-color: #eab308; --input-bg: #010409; --button-bg: #21262d; --button-hover-bg: #30363d; }
body.light-theme { --bg-color: #ffffff; --panel-bg: #f6f8fa; --border-color: #d0d7de; --text-color: __GAME_TEXT_COLOR_LIGHT__; --text-dim-color: #57606a; --accent-color: __GAME_TITLE_COLOR_LIGHT__; --danger-color: #cf222e; --danger-hover-bg: #a40e26; --highlight-color: #9a6700; --input-bg: #ffffff; --button-bg: #f6f8fa; --button-hover-bg: #e5e7eb; }
:root { --font-family: __FONT_FAMILY__; --font-size: __GAME_FONT_SIZE__; --splash-button-bg: __SPLASH_BUTTON_COLOR__; --splash-button-hover-bg: __SPLASH_BUTTON_HOVER_COLOR__; --splash-button-text-color: __SPLASH_BUTTON_TEXT_COLOR__; --action-button-bg: __ACTION_BUTTON_COLOR__; --action-button-text-color: __ACTION_BUTTON_TEXT_COLOR__; --splash-align-items: flex-end; --splash-justify-content: flex-end; --splash-text-align: right; --splash-content-align-items: flex-end; --scene-name-overlay-bg: __SCENE_NAME_OVERLAY_BG__; --scene-name-overlay-text-color: __SCENE_NAME_OVERLAY_TEXT_COLOR__; --tracker-bar-fill-color: var(--accent-color); --tracker-bar-bg-color: var(--input-bg); --continue-indicator-color: __CONTINUE_INDICATOR_COLOR__; --text-anim-speed: 0.05s; --image-anim-speed: 0.5s; }
* { box-sizing: border-box; }
body { font-family: var(--font-family); font-size: var(--font-size); background-color: var(--bg-color); color: var(--text-color); margin: 0; height: 100vh; overflow: hidden; }
/* Melhora legibilidade de campos select em ambos os temas */
select { background-color: var(--button-bg); color: var(--text-color); border: 1px solid var(--border-color); }
option { background-color: var(--bg-color); color: var(--text-color); }
.main-wrapper { height: 100%; display: flex; flex-direction: column; overflow: hidden; position: relative; max-width: 1280px; margin: 0 auto; }
body.with-spacing .main-wrapper { height: 100%; }
.splash-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--bg-color); background-size: cover; background-position: center; z-index: 2000; padding: 0; display: flex; align-items: var(--splash-align-items); justify-content: var(--splash-justify-content); transition: opacity 1s ease-in-out; }
.splash-screen.fade-out { opacity: 0; pointer-events: none; }
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
.game-container { display: flex; flex-grow: 1; overflow: hidden; transition: opacity 1s ease-in-out; position: relative; z-index: 10; }
.game-container.fade-out { opacity: 0; }
.image-panel { flex: 0 0 45%; max-width: 650px; border-right: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; background-color: var(--input-bg); position: relative; transition: padding 0.3s ease-in-out, background-color 0.3s ease-in-out; padding: 0; }
.image-container { width: 100%; height: 100%; position: relative; overflow: hidden; background-size: cover; background-position: center; transition: border 0.3s ease-in-out, outline 0.3s ease-in-out, box-shadow 0.3s ease-in-out; }
.scene-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
#scene-image-back { z-index: 1; }
#scene-image { z-index: 2; }
.scene-name-overlay { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: var(--scene-name-overlay-bg); color: var(--scene-name-overlay-text-color); border: 2px solid var(--border-color); border-radius: 0; font-size: 0.9em; font-weight: bold; z-index: 10; opacity: 1; transition: opacity 0.5s ease-in-out; pointer-events: none; text-align: center; padding: 8px 16px; box-sizing: border-box; }
.text-panel { flex: 1; display: flex; flex-direction: column; padding: 30px; position: relative; }
.game-container.layout-horizontal { flex-direction: column; }
.game-container.layout-horizontal .image-panel { flex-basis: 45%; max-width: none; width: 100%; border-right: none; border-bottom: 2px solid var(--border-color); }
.game-container.layout-horizontal .text-panel { min-height: 0; }
.game-container.layout-image-last { flex-direction: row-reverse; }
.game-container.layout-image-last .image-panel { border-right: none; border-left: 2px solid var(--border-color); }
.game-container.layout-horizontal.layout-image-last { flex-direction: column-reverse; }
.game-container.layout-horizontal.layout-image-last .image-panel { border-left: none; border-bottom: none; border-top: 2px solid var(--border-color); }
.scene-description { flex-grow: 1; overflow-y: auto; white-space: pre-wrap; line-height: 1.8; padding-bottom: 20px; }
.scene-description.typewriting-active .highlight-word { cursor: default; }
.scene-description.typewriting-active .highlight-word:hover { filter: none; text-decoration: none; }
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
.view-ending-button { width: 100%; padding: 15px; font-size: 1.2em; font-weight: bold; border: 2px solid var(--border-color); background-color: var(--action-button-bg); color: var(--action-button-text-color); font-family: var(--font-family); cursor: pointer; transition: all 0.2s; }
.view-ending-button:hover { filter: brightness(0.9); transform: translateY(-2px); }
.hidden { display: none !important; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background-color: var(--panel-bg); padding: 30px; border: 2px solid var(--border-color); position: relative; max-width: 600px; width: 90%; }
.modal-content h2 { margin-top: 0; font-size: 1.5em; color: var(--accent-color); font-family: var(--font-family); }
.modal-close-button { position: absolute; top: 10px; right: 15px; background: none; border: none; color: var(--text-dim-color); font-size: 2em; cursor: pointer; line-height: 1; }
.trackers-modal-content { max-height: 80vh; display: flex; flex-direction: column; }
#trackers-content { flex-grow: 1; overflow-y: auto; padding-right: 15px; margin-right: -15px; }
.diary-modal-content { max-width: 80vw; height: 80vh; display: flex; flex-direction: column; }
.diary-log { flex-grow: 1; overflow-y: auto; text-align: left; }
.diary-entry { display: flex; gap: 40px; align-items: flex-start; padding: 40px; border-bottom: 2px solid var(--border-color); }
.diary-entry:last-child { border-bottom: none; }
.diary-entry img { width: 300px; height: 300px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border-color); box-shadow: none; }
.diary-entry .text-container { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.diary-entry .scene-name { font-weight: bold; color: var(--accent-color); margin-bottom: 8px; display: block; font-size: 1.4em; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
.diary-entry p { margin: 0; white-space: pre-wrap; }
.diary-interactions-container { margin-top: 18px; border-left: 3px solid var(--accent-color); padding-left: 22px; display: flex; flex-direction: column; gap: 14px; }
.diary-input { color: var(--text-dim-color); font-style: italic; font-size: 0.95em; margin: 0; padding: 0; border: none; }
.diary-output { color: var(--text-color); margin: 0; padding: 0; border: none; line-height: 1.6; }
.item-modal-content { max-width: 80vw; width: 90%; }
.item-modal-body { display: flex; flex-direction: row; gap: 30px; align-items: flex-start; }
@media (max-width: 768px) { .item-modal-body { flex-direction: column; align-items: center; } }
.item-modal-image-container { width: 400px; min-width: 400px; height: 400px; overflow: hidden; border: 2px solid var(--border-color); border-radius: 8px; background-color: var(--input-bg); }
@media (max-width: 768px) { .item-modal-image-container { width: 100%; min-width: 0; max-width: 400px; height: auto; aspect-ratio: 1; } }
.item-modal-image-container img { width: 100%; height: 100%; object-fit: cover; display: block; }
.item-modal-text-container { flex: 1; display: flex; flex-direction: column; gap: 15px; text-align: left; }
.item-modal-name { margin: 0; font-size: 1.5em; color: var(--accent-color); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
#item-modal-description { color: var(--text-color); line-height: 1.6; }

/* System Modal Styles */
.system-modal-content { max-width: 400px; text-align: center; }
.system-menu { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
.system-menu button { width: 100%; padding: 15px; font-size: 1.1em; background-color: var(--button-bg); border: 2px solid var(--border-color); color: var(--text-color); cursor: pointer; transition: all 0.2s; font-family: var(--font-family); }
.system-menu button:hover { background-color: var(--button-hover-bg); border-color: var(--accent-color); }
.system-menu button.danger-button { color: var(--danger-color); border-color: var(--danger-color); }
.system-menu button.danger-button:hover { background-color: var(--danger-hover-bg); color: #fff; }
.system-slots { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; text-align: left; }
.slot-item { background-color: var(--input-bg); border: 2px solid var(--border-color); padding: 15px; cursor: pointer; transition: border-color 0.2s; display: flex; justify-content: space-between; align-items: center; }
.slot-item:hover { border-color: var(--accent-color); }
.slot-info { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 0; }
.slot-title { font-weight: bold; color: var(--accent-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.slot-meta { font-size: 0.8em; color: var(--text-dim-color); }
.slot-empty { font-style: italic; color: var(--text-dim-color); }
.slot-actions { display: flex; gap: 10px; align-items: center; }
.slot-delete-btn { background: none; border: none; color: var(--danger-color); cursor: pointer; font-size: 1.5em; padding: 0 10px; line-height: 1; }
.slot-delete-btn:hover { color: #fff; background-color: var(--danger-color); border-radius: 4px; }
#btn-back-system { width: auto; padding: 10px 20px; align-self: center; margin-top: 10px; background-color: var(--button-bg); border: 1px solid var(--border-color); color: var(--text-color); cursor: pointer; font-family: var(--font-family); font-size: 0.9em; }

/* Animações de Imagem */
.trans-fade-out { animation: fadeOut var(--image-anim-speed) forwards; }
.trans-slide-left-out { animation: slideLeftOut var(--image-anim-speed) forwards; }
.trans-slide-right-out { animation: slideRightOut var(--image-anim-speed) forwards; }
.trans-slide-up-out { animation: slideUpOut var(--image-anim-speed) forwards; }
.trans-slide-down-out { animation: slideDownOut var(--image-anim-speed) forwards; }
.trans-zoom-out { animation: zoomOut var(--image-anim-speed) ease-in forwards; }
.trans-blur-out { animation: blurOut var(--image-anim-speed) ease-in forwards; }

@keyframes fadeOut { to { opacity: 0; } }
@keyframes slideLeftOut { to { transform: translateX(-100%); } }
@keyframes slideRightOut { to { transform: translateX(100%); } }
@keyframes slideUpOut { to { transform: translateY(-100%); } }
@keyframes slideDownOut { to { transform: translateY(100%); } }
@keyframes zoomOut { from { transform: scale(1); opacity: 1; } to { transform: scale(1.3); opacity: 0; } }
@keyframes blurOut { from { filter: blur(0); opacity: 1; } to { filter: blur(20px); opacity: 0; } }

body.frame-none .image-panel { border: none; }
body.frame-rounded-top .game-container .image-panel { padding: 10px; background: __FRAME_ROUNDED_TOP_COLOR__; border: none; border-radius: 150px 150px 6px 6px; box-shadow: none; }
body.frame-rounded-top .game-container .image-container { border-radius: 140px 140px 0 0; }
body.frame-book-cover .game-container .image-panel { padding: 10px; background: __FRAME_BOOK_COLOR__; border: none; }
body.frame-book-cover .game-container .image-container { box-shadow: none; border-radius: 0 !important; }
body.frame-book-cover #scene-image, body.frame-book-cover #scene-image-back { border-radius: 0 !important; }
body.frame-trading-card .image-panel { padding: 8px; background: __FRAME_TRADING_CARD_COLOR__; border-radius: 20px; }
body.frame-trading-card .game-container:not(.layout-image-last) .image-panel { border-right-color: transparent; }
body.frame-trading-card .game-container.layout-image-last .image-panel { border-left-color: transparent; }
body.frame-trading-card .image-container { border: none; border-radius: 12px; }
#scene-image { border-radius: 10px; }
#scene-image-back { border-radius: 10px; }
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
.continue-indicator { text-align: left; cursor: pointer; padding: 0; color: var(--continue-indicator-color); animation: bounce 1s infinite; font-size: 1.5em; user-select: none; width: 100%; margin-top: -12px; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
.scene-paragraph { margin: 0 0 10px 0; opacity: 0; animation: fadeIn var(--text-anim-speed) forwards; }
.typewriter-cursor::after { content: '|'; animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
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
    textColorLight: '#24292f',
    titleColorLight: '#0969da',
    focusColorLight: '#0969da',
    gameSplashButtonColor: '#2ea043',
    gameSplashButtonHoverColor: '#238636',
    gameSplashButtonTextColor: '#ffffff',
    gameActionButtonColor: '#ffffff',
    gameActionButtonTextColor: '#0d1117',
    gameChanceIcon: 'heart',
    gameChanceIconColor: '#ff4d4d',
    frameBookColor: '#FFFFFF',
    frameTradingCardColor: '#1c1917',
    frameRoundedTopColor: '#facc15',
    gameSceneNameOverlayBg: '#0d1117',
    gameSceneNameOverlayTextColor: '#c9d1d9',
    gameContinueIndicatorColor: '#58a6ff',
    gameTextAnimationType: 'fade',
    gameTextSpeed: 5,
    gameImageTransitionType: 'fade',
    gameImageSpeed: 5,
    gameFontSize: '0.85em', 
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
    gameSystemButtonText: 'Sistema',
    gameSaveMenuTitle: 'Salvar Jogo',
    gameLoadMenuTitle: 'Carregar Jogo',
    gameMainMenuButtonText: 'Menu Principal',
    gameChanceReturnButtonText: 'Tentar Novamente',
    gameViewEndingButtonText: 'Ver Final',
    gameShowTrackersUI: true, 
    gameShowSystemButton: true, 
    fixedVerbs: [],
    consequenceTrackers: [],
    positiveEndingMusic: '',
    negativeEndingMusic: '',
};

const App: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>(initialGameData);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  // FIX: Fixed self-referencing initialization for previewSceneId by changing initial value from previewSceneId to null.
  const [previewSceneId, setPreviewSceneId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('scenes');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const scenesList = useMemo(() => {
    return gameData.sceneOrder.map(id => gameData.scenes[id]).filter(Boolean);
  }, [gameData.scenes, gameData.sceneOrder]);

  const selectedScene = selectedSceneId ? gameData.scenes[selectedSceneId] : null;

  const fixedVerbs = useMemo(() => gameData.fixedVerbs || [], [gameData.fixedVerbs]);
  const consequenceTrackers = useMemo(() => gameData.consequenceTrackers || [], [gameData.consequenceTrackers]);

  const handleImportGame = useCallback((data: GameData) => {
    const cleanedScenes = { ...data.scenes };
    Object.keys(cleanedScenes).forEach(id => {
        cleanedScenes[id] = {
            ...cleanedScenes[id],
            objectIds: cleanedScenes[id].objectIds || [],
            interactions: cleanedScenes[id].interactions || []
        };
    });

    setGameData(prev => ({
        ...prev,
        ...data,
        scenes: cleanedScenes,
        gameHTML: gameHTML, 
        gameCSS: gameCSS,
        fixedVerbs: data.fixedVerbs || [], 
        consequenceTrackers: data.consequenceTrackers || [], 
        gameTextAnimationType: data.gameTextAnimationType || 'fade',
        gameTextSpeed: data.gameTextSpeed || 5,
        gameImageTransitionType: data.gameImageTransitionType || 'fade',
        gameImageSpeed: data.gameImageSpeed || 5,
        gameShowTrackersUI: data.gameShowTrackersUI ?? true,
        gameShowSystemButton: data.gameShowSystemButton ?? true,
        gameViewEndingButtonText: data.gameViewEndingButtonText || 'Ver Final',
        positiveEndingMusic: data.positiveEndingMusic || '',
        negativeEndingMusic: data.negativeEndingMusic || '',
    }));
    if (data.startScene) {
        setSelectedSceneId(data.startScene);
    } else if (data.sceneOrder.length > 0) {
        setSelectedSceneId(data.sceneOrder[0]);
    }
    setIsDirty(false);
  }, []);

  const handleUpdateGameData = (field: keyof GameData, value: any) => {
    setGameData(prev => {
        if (field === 'gameSystemEnabled' && value === 'trackers') {
            return { ...prev, [field]: value, gameShowTrackersUI: true };
        }
        return { ...prev, [field]: value };
    });
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
      setCurrentView('scenes');
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
      const obj = gameData.globalObjects[objectId];
      if (!obj) return;

      const scenesUsingObject = Object.values(gameData.scenes).filter((s: Scene) => s.objectIds?.includes(objectId));
      
      if (scenesUsingObject.length > 0) {
          const sceneNames = scenesUsingObject.map((s: Scene) => s.name).join(', ');
          if (!window.confirm(`Este objeto está vinculado às seguintes cenas: ${sceneNames}. Tem certeza que deseja excluí-lo do jogo completamente?`)) {
              return;
          }
      }

      setGameData(prev => {
          const newObjects = { ...prev.globalObjects };
          delete newObjects[objectId];
          
          const newScenes = { ...prev.scenes };
          Object.keys(newScenes).forEach(id => {
              const scene = newScenes[id];
              let sceneChanged = false;
              let newObjectIds = scene.objectIds || [];
              let newInteractions = scene.interactions || [];

              if (newObjectIds.includes(objectId)) {
                  newObjectIds = newObjectIds.filter(oid => oid !== objectId);
                  sceneChanged = true;
              }

              if (newInteractions.some(inter => inter.target === objectId || inter.requiresInInventory === objectId)) {
                  newInteractions = newInteractions.map(inter => {
                      if (inter.target === objectId || inter.requiresInInventory === objectId) {
                          return {
                              ...inter,
                              target: inter.target === objectId ? '' : inter.target,
                              requiresInInventory: inter.requiresInInventory === objectId ? undefined : inter.requiresInInventory
                          };
                      }
                      return inter;
                  });
                  sceneChanged = true;
              }

              if (sceneChanged) {
                  newScenes[id] = { ...scene, objectIds: newObjectIds, interactions: newInteractions };
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
                    isPreviewing={isPreviewing} 
                    onTogglePreview={() => setIsPreviewing(false)} 
                    onNewGame={handleNewGame}
                />
                <Preview gameData={gameData} testSceneId={previewSceneId} />
             </div>
        ) : (
            <>
                <Header 
                    gameData={gameData} 
                    isPreviewing={isPreviewing} 
                    onTogglePreview={() => {
                        setPreviewSceneId(null); 
                        setIsPreviewing(true);
                    }} 
                    onNewGame={handleNewGame}
                />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar 
                        scenes={scenesList}
                        startSceneId={gameData.startScene}
                        selectedSceneId={selectedSceneId}
                        currentView={currentView}
                        gameData={gameData}
                        onSelectScene={handleSelectScene}
                        onAddScene={handleAddScene}
                        onDeleteScene={handleDeleteScene}
                        onReorderScenes={handleReorderScenes}
                        onSetView={handleSetView}
                        onImportGame={handleImportGame}
                        onTogglePreview={() => {
                            setPreviewSceneId(null);
                            setIsPreviewing(true);
                        }}
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
                                backgroundMusic={gameData.gameBackgroundMusic || ''}
                                positiveEndingImage={gameData.positiveEndingImage || ''}
                                positiveEndingContentAlignment={gameData.positiveEndingContentAlignment || 'right'}
                                positiveEndingDescription={gameData.positiveEndingDescription || ''}
                                positiveEndingMusic={gameData.positiveEndingMusic || ''}
                                negativeEndingImage={gameData.negativeEndingImage || ''}
                                negativeEndingContentAlignment={gameData.negativeEndingContentAlignment || 'right'}
                                negativeEndingDescription={gameData.negativeEndingDescription || ''}
                                negativeEndingMusic={gameData.negativeEndingMusic || ''}
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
                                gameFontSize={gameData.gameFontSize || '0.85em'}
                                chanceIcon={gameData.gameChanceIcon || 'heart'}
                                chanceReturnButtonText={gameData.gameChanceReturnButtonText || 'Tentar Novamente'}
                                gameTheme={gameData.gameTheme || 'dark'}
                                textColorLight={gameData.textColorLight || '#24292f'}
                                titleColorLight={gameData.titleColorLight || '#0969da'}
                                focusColorLight={gameData.focusColorLight || '#0969da'}
                                frameBookColor={gameData.frameBookColor || '#FFFFFF'}
                                frameTradingCardColor={gameData.frameTradingCardColor || '#1c1917'}
                                frameRoundedTopColor={gameData.frameRoundedTopColor || '#facc15'}
                                gameSceneNameOverlayBg={gameData.gameSceneNameOverlayBg || '#0d1117'}
                                gameSceneNameOverlayTextColor={gameData.gameSceneNameOverlayTextColor || '#c9d1d9'}
                                gameShowTrackersUI={gameData.gameShowTrackersUI ?? true}
                                gameShowSystemButton={gameData.gameShowSystemButton ?? true}
                                imageFrame={gameData.gameImageFrame || 'none'}
                                layoutOrder={gameData.gameLayoutOrder || 'image-first'}
                                layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                                suggestionsButtonText={gameData.gameSuggestionsButtonText}
                                inventoryButtonText={gameData.gameInventoryButtonText}
                                diaryButtonText={gameData.gameDiaryButtonText}
                                trackersButtonText={gameData.gameTrackersButtonText}
                                gameSystemButtonText={gameData.gameSystemButtonText}
                                gameSaveMenuTitle={gameData.gameSaveMenuTitle}
                                gameLoadMenuTitle={gameData.gameLoadMenuTitle}
                                gameMainMenuButtonText={gameData.gameMainMenuButtonText}
                                gameContinueIndicatorColor={gameData.gameContinueIndicatorColor || '#58a6ff'}
                                gameViewEndingButtonText={gameData.gameViewEndingButtonText || 'Ver Final'}
                                textAnimationType={gameData.gameTextAnimationType || 'fade'}
                                textSpeed={gameData.gameTextSpeed || 5}
                                imageTransitionType={gameData.gameImageTransitionType || 'fade'}
                                imageSpeed={gameData.gameImageSpeed || 5}
                                onNavigateToTrackers={() => handleSetView('trackers')}
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
                                    setPreviewSceneId(scene.id);
                                    setIsPreviewing(true);
                                }}
                                onSelectScene={handleSelectScene}
                                isDirty={isDirty}
                                onSetDirty={setIsDirty}
                                layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                                consequenceTrackers={consequenceTrackers}
                                isStartScene={selectedScene.id === gameData.startScene}
                            />
                        ) : currentView === 'scenes' ? (
                            <WelcomePlaceholder />
                        ) : null}
                        
                        {currentView === 'map' && (
                            <SceneMap 
                                allScenesMap={gameData.scenes}
                                globalObjects={gameData.globalObjects}
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
