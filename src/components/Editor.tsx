
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from './UserContext';
import { Auth } from './Auth';
import { useToast } from './ToastContext';
import { GameData, Scene, GameObject, Interaction, View, ConsequenceTracker, FixedVerb } from '../types';
import Sidebar from './Sidebar';
import SceneEditor from './SceneEditor';
import Header from './Header';
import { WelcomePlaceholder } from './WelcomePlaceholder';
import { GuideView } from './GuideView';
import { UIEditor } from './UIEditor';
import Preview from './Preview';
import SceneMap from './SceneMap';
import GlobalObjectsEditor from './GlobalObjectsEditor';
import TrackersEditor from './TrackersEditor';
import { ConfirmationModal } from './ConfirmationModal';
import { TransitionScreen } from './TransitionScreen';
import UserManualModal from './UserManualModal';
import { gameJS, prepareGameDataForEngine } from './game-engine';
import { Info, Settings as SettingsIcon, CircleHelp } from 'lucide-react';
import Settings from '../pages/Settings';
import AboutProject from '../pages/AboutProject';

declare var JSZip: any;

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

const getMimeTypeFromFileName = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'svg': return 'image/svg+xml';
        case 'webp': return 'image/webp';
        case 'mp3':
        case 'mpeg': return 'audio/mpeg';
        case 'ogg': return 'audio/ogg';
        case 'wav': return 'audio/wav';
        case 'm4a':
        case 'mp4': return 'audio/mp4';
        default: return 'application/octet-stream';
    }
}

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
<body class="__THEME_CLASS__ __FRAME_CLASS__ __FONT_ADJUST_CLASS__ __MOBILE_BEHAVIOR_CLASS__">
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
                __CHANCES_CONTAINER__
                <div class="action-bar" id="standard-action-bar">
                    <div id="action-popup" class="action-popup hidden"></div>
                    <div class="action-buttons">
                        <button id="suggestions-button">__SUGGESTIONS_BUTTON_TEXT__</button>
                        __INVENTORY_BUTTON__
                        __DIARY_BUTTON__
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
body.dark-theme { --bg-color: #0d1117; --panel-bg: #161b22; --border-color: #30363d; --text-color: __GAME_TEXT_COLOR__; --text-dim-color: #8b949e; --accent-color: __GAME_TITLE_COLOR__; --danger-color: #f85149; --danger-hover-bg: #da3633; --highlight-color: __GAME_FOCUS_COLOR__; --input-bg: #010409; --button-bg: #21262d; --button-hover-bg: #30363d; }
body.light-theme { --bg-color: #ffffff; --panel-bg: #f6f8fa; --border-color: #d0d7de; --text-color: __GAME_TEXT_COLOR_LIGHT__; --text-dim-color: #57606a; --accent-color: __GAME_TITLE_COLOR_LIGHT__; --danger-color: #cf222e; --danger-hover-bg: #a40e26; --highlight-color: __GAME_FOCUS_COLOR_LIGHT__; --input-bg: #ffffff; --button-bg: #f6f8fa; --button-hover-bg: #e5e7eb; }
:root { --font-family: __FONT_FAMILY__; --font-size: __GAME_FONT_SIZE__; --splash-button-bg: __SPLASH_BUTTON_COLOR__; --splash-button-hover-bg: __SPLASH_BUTTON_HOVER_COLOR__; --splash-button-text-color: __SPLASH_BUTTON_TEXT_COLOR__; --action-button-bg: __ACTION_BUTTON_COLOR__; --action-button-text-color: __ACTION_BUTTON_TEXT_COLOR__; --splash-align-items: flex-end; --splash-justify-content: flex-end; --splash-text-align: right; --splash-content-align-items: flex-end; --scene-name-overlay-bg: __SCENE_NAME_OVERLAY_BG__; --scene-name-overlay-text-color: __SCENE_NAME_OVERLAY_TEXT_COLOR__; --tracker-bar-fill-color: var(--accent-color); --tracker-bar-bg-color: var(--input-bg); --continue-indicator-color: __CONTINUE_INDICATOR_COLOR__; --text-anim-speed: 0.05s; --image-anim-speed: 0.5s; }
* { box-sizing: border-box; }
body { font-family: var(--font-family); font-size: var(--font-size); background-color: var(--bg-color); color: var(--text-color); margin: 0; height: 100vh; overflow: hidden; }
select { background-color: var(--button-bg); color: var(--text-color); border: 1px solid var(--border-color); }
option { background-color: var(--bg-color); color: var(--text-color); }
.main-wrapper { height: 100%; display: flex; flex-direction: column; overflow: hidden; position: relative; max-width: 1280px; margin: 0 auto; }
body.with-spacing .main-wrapper { height: 100%; }
.splash-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--bg-color); background-size: cover; background-position: center; z-index: 2000; padding: 0; display: flex; align-items: var(--splash-align-items); justify-content: var(--splash-justify-content); transition: opacity 1s ease-in-out; }
.splash-screen.fade-out { opacity: 0; pointer-events: none; }
.splash-screen.align-left { --splash-justify-content: flex-start; --splash-align-items: flex-start; --splash-text-align: left; --splash-content-align-items: flex-start; }
.splash-content { text-align: var(--splash-text-align); display: flex; flex-direction: column; align-items: var(--splash-content-align-items); gap: 20px; width: 100%; padding: 5vw 225px; }
.splash-logo { max-height: 150px; width: auto; margin-bottom: 20px; }
.splash-text h1 { font-size: 2em; color: var(--accent-color); margin: 0; text-shadow: none; }
.splash-text p { font-size: 0.95em; margin-top: 10px; color: var(--text-color); max-width: 60ch; white-space: pre-wrap; }
.splash-buttons { display: flex; flex-direction: column; gap: 15px; width: 100%; align-items: var(--splash-content-align-items); }
#splash-start-button, .ending-restart-button, #continue-button { font-family: var(--font-family); padding: 12px 24px; font-size: 1.1em; font-weight: bold; border: none; cursor: pointer; color: var(--splash-button-text-color); transition: all 0.2s ease-in-out; width: 100%; max-width: 350px; }
#splash-start-button, .ending-restart-button { background-color: var(--splash-button-bg); }
#continue-button { background-color: #1d4ed8; }
#splash-start-button:hover, .ending-restart-button:hover, #continue-button:hover { transform: translateY(-3px); box-shadow: 0 3px 0px rgba(0, 0, 0, 0.4); }
#splash-start-button:hover, .ending-restart-button:hover { background-color: var(--splash-button-hover-bg); }
#continue-button:hover { background-color: #2563eb; }
.chances-container { display: flex; align-items: center; gap: 8px; justify-content: flex-end; margin-bottom: 15px; }
.chance-icon { width: 24px; height: 24px; transition: all 0.3s ease; }
.chance-icon.lost { opacity: 0.5; }
.game-container { display: flex; flex-grow: 1; overflow: hidden; transition: opacity 1s ease-in-out; position: relative; z-index: 10; }
.game-container.fade-out { opacity: 0; }
.image-panel { flex: 0 0 45%; max-width: 650px; border-right: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; background-color: var(--input-bg); position: relative; transition: padding 0.3s ease-in-out, background-color 0.3s ease-in-out; padding: 0; }
.image-container { width: 100%; height: 100%; position: relative; overflow: hidden; background-size: cover; background-position: center; transition: border 0.3s ease-in-out, outline 0.3s ease-in-out, box-shadow 0.3s ease-in-out; }
.scene-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
#scene-image-back { z-index: 1; }
#scene-image { z-index: 2; }
.scene-name-overlay { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: var(--scene-name-overlay-bg); color: var(--scene-name-overlay-text-color); border: 2px solid var(--border-color); border-radius: 0; font-size: 1em; font-weight: bold; z-index: 10; opacity: 1; transition: opacity 0.5s ease-in-out; pointer-events: none; text-align: center; padding: 6px 12px; box-sizing: border-box; }
.text-panel { flex: 1; display: flex; flex-direction: column; padding: 30px; position: relative; }
.game-container.layout-horizontal { flex-direction: column; }
.game-container.layout-horizontal .image-panel { flex-basis: 45%; max-width: none; width: 100%; border-right: none; border-bottom: 2px solid var(--border-color); }
.game-container.layout-horizontal .text-panel { min-height: 0; }
.game-container.layout-image-last { flex-direction: row-reverse; }
.game-container.layout-image-last .image-panel { border-right: none; border-left: 2px solid var(--border-color); }
.game-container.layout-horizontal.layout-image-last { flex-direction: column-reverse; }
.game-container.layout-horizontal.layout-image-last .image-panel { border-left: none; border-bottom: none; border-top: 2px solid var(--border-color); }
.scene-description { flex-grow: 1; overflow-y: auto; white-space: pre-wrap; line-height: 1.6; padding-bottom: 20px; }
.scene-description.typewriting-active .highlight-word { cursor: default; }
.scene-description.typewriting-active .highlight-word:hover { filter: none; text-decoration: none; }
.verb-echo { color: var(--text-dim-color); font-style: italic; }
.highlight-item { font-weight: bold; color: var(--highlight-color); }
.highlight-word { font-weight: bold; color: var(--accent-color); cursor: pointer; transition: color 0.2s; }
.highlight-word:hover { filter: brightness(1.2); text-decoration: underline; }

/* Desktop Action Bar with Popup Inside - Removido fundo cinza do popup */
.action-bar { border-top: 2px solid var(--border-color); padding-top: 15px; margin-top: auto; flex-shrink: 0; display: flex; flex-direction: column; }
.action-popup { margin-bottom: 12px; background-color: transparent; border: none; padding: 0; }
.action-popup.hidden { display: none !important; }
.action-popup-container { display: flex; flex-direction: column; gap: 10px; }
.action-popup-row { display: flex; flex-wrap: wrap; gap: 6px; }
.action-popup-list button, .action-popup-row button, .action-popup-list p { display: inline-block; padding: 6px 10px; margin: 0; text-align: left; background-color: var(--button-bg); border: 1px solid var(--border-color); color: var(--highlight-color); font-family: var(--font-family); font-size: 1em; font-weight: bold; }
.action-popup-list button, .action-popup-row button { cursor: pointer; }
.action-popup-list button:hover, .action-popup-row button:hover { background-color: var(--border-color); }
.action-popup-list p { cursor: default; color: var(--text-dim-color); }

.action-buttons { display: flex; gap: 8px; margin-bottom: 12px; }
.action-buttons button { font-family: var(--font-family); padding: 8px 12px; border: 2px solid var(--border-color); background-color: var(--panel-bg); color: var(--text-color); cursor: pointer; transition: background-color 0.2s, border-color 0.2s; font-size: 1em; }
.action-buttons button:hover { background-color: var(--border-color); border-color: var(--text-dim-color); }
.input-area { display: flex; gap: 8px; }
#verb-input { flex-grow: 1; padding: 12px 10px; border: 2px solid var(--border-color); background-color: var(--input-bg); color: var(--text-color); font-family: var(--font-family); font-size: 1em; }
#verb-input:focus { outline: none; border-color: var(--border-color); }
#verb-input:disabled { background-color: var(--button-bg); cursor: not-allowed; }
#submit-verb { padding: 8px 16px; border: 2px solid var(--border-color); background-color: var(--action-button-bg); color: var(--action-button-text-color); font-family: var(--font-family); cursor: pointer; font-weight: bold; transition: background-color 0.2s; font-size: 1em; }
#submit-verb:hover { filter: brightness(0.9); }
#submit-verb:disabled { background-color: var(--button-hover-bg); color: var(--text-dim-color); cursor: not-allowed; }
#submit-verb:disabled:hover { background-color: var(--button-hover-bg); }
.view-ending-button { width: 100%; padding: 12px; font-size: 1.1em; font-weight: bold; border: 2px solid var(--border-color); background-color: var(--action-button-bg); color: var(--action-button-text-color); font-family: var(--font-family); cursor: pointer; transition: all 0.2s; }
.view-ending-button:hover { filter: brightness(0.9); transform: translateY(-2px); }
.hidden { display: none !important; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background-color: var(--panel-bg); padding: 25px; border: 2px solid var(--border-color); position: relative; max-width: 600px; width: 90%; }
.modal-content h2 { margin-top: 0; font-size: 1.3em; color: var(--accent-color); font-family: var(--font-family); }
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
.diary-input { color: var(--text-dim-color); font-style: italic; font-size: 0.9em; margin: 0; padding: 0; border: none; }
.diary-output { color: var(--text-color); margin: 0; padding: 0; border: none; line-height: 1.6; font-size: 0.95em; }

.item-modal-content { max-width: 80vw; width: 90%; }
.item-modal-body { display: flex; flex-direction: row; gap: 30px; align-items: flex-start; }
@media (max-width: 768px) { .item-modal-body { flex-direction: column; align-items: center; } }
.item-modal-image-container { width: 300px; min-width: 300px; height: 300px; overflow: hidden; border: 2px solid var(--border-color); border-radius: 8px; background-color: var(--input-bg); }
@media (max-width: 768px) { .item-modal-image-container { width: 100%; min-width: 0; max-width: 300px; height: auto; aspect-ratio: 1; } }
.item-modal-image-container img { width: 100%; height: 100%; object-fit: cover; display: block; }
.item-modal-text-container { flex: 1; display: flex; flex-direction: column; gap: 12px; text-align: left; }
.item-modal-name { margin: 0; font-size: 1.3em; color: var(--accent-color); border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
#item-modal-description { color: var(--text-color); line-height: 1.6; font-size: 0.95em; }

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

/* Mobile Immersive Layout Definitivo - CORREÇÃO DE FUNDOS E TRANSPARÊNCIAS */
@media (max-width: 768px) {
    body.behavior-immersive {
        padding: 0 !important;
        margin: 0 !important;
        overflow-x: hidden !important;
    }
    body.behavior-immersive .main-wrapper { 
        height: 100vh;
        overflow: hidden;
        display: block;
        padding: 0 !important;
        margin: 0 !important;
        max-width: none !important;
    }
    body.behavior-immersive .splash-content {
        padding: 40px 15px !important; 
        height: 100%;
        justify-content: flex-end;
    }
    body.behavior-immersive .game-container {
        display: block;
        height: 100vh;
        padding: 0 !important;
        margin: 0 !important;
        width: 100vw !important;
        left: 0 !important;
    }
    body.behavior-immersive .image-panel {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: 1;
        max-width: none;
        border: none !important;
        padding: 0 !important;
        background: black;
    }
    body.behavior-immersive .image-container, 
    body.behavior-immersive .scene-image {
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
    }
    body.behavior-immersive .text-panel {
        position: absolute;
        bottom: 0; left: 0;
        width: 100vw !important;
        z-index: 2;
        background: none;
        padding: 0 !important;
        margin: 0 !important;
        flex: none;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 100vh;
        pointer-events: none;
    }
    body.behavior-immersive .scene-description {
        background: linear-gradient(to top, rgba(0,0,0,0.98) 60%, transparent 100%) !important;
        padding: 45px 15px 5px 15px !important; 
        max-height: 45vh !important; 
        min-height: 25vh !important; 
        width: 100vw !important;
        flex-grow: 0;
        border-radius: 0;
        pointer-events: auto;
        box-sizing: border-box !important;
        left: 0 !important;
        margin: 0 !important;
        font-size: 0.85em !important;
    }
    body.behavior-immersive .action-bar {
        background: rgba(0,0,0,0.98) !important; 
        border-top: none !important;
        padding: 2px 15px 15px 15px !important; 
        margin-top: 0 !important;
        pointer-events: auto;
        width: 100vw !important;
        box-sizing: border-box !important;
        left: 0 !important;
        margin: 0 !important;
    }
    
    body.behavior-immersive .action-popup:not(.hidden) {
        background: rgba(0,0,0,0.98) !important; 
        border: none !important;
        margin: 0 !important; 
        padding: 10px 15px !important; 
        width: 100vw !important; 
        box-sizing: border-box !important;
        pointer-events: auto !important;
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: wrap !important;
        gap: 6px !important; 
        justify-content: flex-start !important;
    }
    
    body.behavior-immersive .action-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 8px;
        width: 100%;
    }
    body.behavior-immersive .action-buttons button {
        flex: 1 1 calc(33.33% - 6px);
        min-width: 0;
        padding: 10px 4px;
        background: rgba(0,0,0,0.98) !important; 
        border: 1px solid rgba(255,255,255,0.25);
        backdrop-filter: none !important;
    }
    
    body.behavior-immersive .action-popup-container,
    body.behavior-immersive .action-popup-list,
    body.behavior-immersive .action-popup-row {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
        width: 100% !important;
        background: none !important;
        border: none !important;
        padding: 0 !important;
    }
    body.behavior-immersive .action-popup button {
        background: rgba(0,0,0,0.98) !important; 
        border: 1px solid rgba(255,255,255,0.3) !important;
        backdrop-filter: none !important;
        width: auto !important;
        flex: 0 1 auto !important;
        display: inline-block !important;
        padding: 6px 12px !important; 
        border-radius: 6px;
        pointer-events: auto !important;
        font-size: 0.85em !important;
        margin-bottom: 2px !important;
        line-height: 1.2 !important;
        color: var(--highlight-color) !important;
    }
    body.behavior-immersive .action-popup-list p {
        background: rgba(0,0,0,0.98) !important; 
        color: var(--text-dim-color) !important;
        padding: 12px !important;
        border-radius: 6px;
        font-size: 0.85em !important;
        width: 100% !important;
    }
    body.behavior-immersive .input-area {
        gap: 6px;
        width: 100%;
    }
    body.behavior-immersive #verb-input {
        padding: 12px;
        background: rgba(0,0,0,0.98) !important; 
        border: 1px solid rgba(255,255,255,0.35);
        box-sizing: border-box !important;
        backdrop-filter: none !important;
    }
    body.behavior-immersive #submit-verb {
        padding: 8px 12px !important;
        background-color: var(--action-button-bg) !important;
        color: var(--action-button-text-color) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
        white-space: nowrap !important;
    }
    body.behavior-immersive .chances-container {
        position: fixed;
        top: 15px;
        right: 15px;
        z-index: 100;
        margin: 0;
        pointer-events: none;
    }
    body.behavior-immersive .scene-name-overlay {
        top: 15px;
        bottom: auto;
        left: 15px;
        transform: none;
        margin: 0;
        background-color: var(--scene-name-overlay-bg) !important;
        color: var(--scene-name-overlay-text-color) !important;
        border: 1px solid rgba(255,255,255,0.4) !important;
        padding: 5px 12px;
        opacity: 1 !important;
        display: block !important;
        pointer-events: none;
        z-index: 100;
    }

    /* ADAPTAÇÃO DIÁRIO E INVENTÁRIO MOBILE */
    body.behavior-immersive .modal-content {
        padding: 12px !important; 
    }
    body.behavior-immersive .diary-entry {
        flex-direction: column;
        padding: 10px 0 !important; 
        gap: 12px !important;
    }
    body.behavior-immersive .diary-entry img {
        width: 100% !important;
        height: auto !important;
        max-height: 220px;
        aspect-ratio: 16/9;
        margin: 0 !important;
    }
    body.behavior-immersive .diary-entry .text-container {
        width: 100% !important;
        gap: 6px !important;
    }
    body.behavior-immersive .diary-entry .scene-name {
        margin-bottom: 4px !important;
        padding-bottom: 4px !important;
    }
    body.behavior-immersive .item-modal-body {
        flex-direction: column !important;
        align-items: center !important;
        gap: 15px !important;
    }
    body.behavior-immersive .item-modal-image-container {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 250px !important;
        height: auto !important;
        aspect-ratio: 1 !important;
    }

    /* UNIFICAÇÃO DE FONTES EM 0.85em */
    body.behavior-immersive .action-bar button,
    body.behavior-immersive .action-bar input,
    body.behavior-immersive .action-popup button,
    body.behavior-immersive .action-popup p,
    body.behavior-immersive .scene-name-overlay,
    body.behavior-immersive .diary-entry p,
    body.behavior-immersive .diary-entry .scene-name,
    body.behavior-immersive .item-modal-name,
    body.behavior-immersive #item-modal-description,
    body.behavior-immersive .slot-title,
    body.behavior-immersive .slot-meta {
        font-size: 0.85em !important;
    }
}

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
body.frame-rounded-top .game-container .image-panel { padding: 5px; background: __FRAME_ROUNDED_TOP_COLOR__; border: none; border-radius: 40px 40px 4px 4px; box-shadow: none; }
body.frame-rounded-top .game-container .image-container { border-radius: 35px 35px 0 0; }
body.frame-book-cover .game-container .image-panel { padding: 5px; background: __FRAME_BOOK_COLOR__; border: none; }
body.frame-book-cover .game-container .image-container { box-shadow: none; border-radius: 0 !important; }
body.frame-book-cover #scene-image, body.frame-book-cover #scene-image-back { border-radius: 0 !important; }
body.frame-trading-card .image-panel { padding: 4px; background: __FRAME_TRADING_CARD_COLOR__; border-radius: 12px; }
body.frame-trading-card .game-container:not(.layout-image-last) .image-panel { border-right-color: transparent; }
body.frame-trading-card .game-container.layout-image-last .image-panel { border-left-color: transparent; }
body.frame-trading-card .image-container { border: none; border-radius: 8px; }
#scene-image { border-radius: 0px; }
#scene-image-back { border-radius: 0px; }
body.font-adjust-gothic { font-size: 1.1em; }
.scene-description::-webkit-scrollbar, .diary-log::-webkit-scrollbar, #trackers-content::-webkit-scrollbar { width: 10px; }
.scene-description::-webkit-scrollbar-track, .diary-log::-webkit-scrollbar-track, #trackers-content::-webkit-scrollbar-track { background: var(--panel-bg); }
.scene-description::-webkit-scrollbar-thumb, .diary-log::-webkit-scrollbar-thumb, #trackers-content::-webkit-scrollbar-thumb { background-color: var(--text-dim-color); border-radius: 6px; border: 3px solid var(--panel-bg); }
.scene-description::-webkit-scrollbar-thumb:hover, .diary-log::-webkit-scrollbar-thumb:hover, #trackers-content::-webkit-scrollbar-thumb:hover { background-color: var(--text-color); }
.tracker-item { margin-bottom: 15px; }
.tracker-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.tracker-item-name { font-size: 0.85em; color: var(--text-dim-color); }
.tracker-item-values { font-size: 0.85em; font-family: monospace; color: var(--text-color); }
.tracker-bar-container { width: 100%; height: 20px; background-color: var(--tracker-bar-bg-color); border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; }
.tracker-bar { height: 100%; background-color: var(--tracker-bar-fill-color); transition: width 0.3s ease-in-out; }
.empty-inventory-msg { font-size: 0.85em; color: var(--text-dim-color); font-style: italic; }
.continue-indicator { text-align: left; cursor: pointer; padding: 0; color: var(--continue-indicator-color); animation: bounce 1s infinite; font-size: 1.3em; user-select: none; width: 100%; margin-top: -10px; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
.scene-paragraph { margin: 0 0 10px 0; opacity: 0; animation: fadeIn var(--text-anim-speed) forwards; }
.typewriter-cursor::after { content: '|'; animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
@keyframes fadeIn { to { opacity: 1; } }

/* Implementação de Layout Full-Bleed (Sem Borda) Desktop */
@media (min-width: 769px) {
    body.frame-none.with-spacing {
        padding: 0 !important;
    }
    body.frame-none .main-wrapper {
        max-width: none !important;
        margin: 0 !important;
        height: 100vh !important;
    }
    body.frame-none .game-container {
        height: 100vh !important;
    }
    body.frame-none .image-panel {
        height: 100vh !important;
        border-right: none !important;
        padding: 0 !important;
    }
    /* Manteve borda apenas se layout for Horizontal */
    body.frame-none .game-container.layout-horizontal .image-panel {
        width: 100% !important;
        flex-basis: auto !important;
        height: 45vh !important; /* Ajuste para horizontal */
    }
    /* Ajuste para Image-Last (Imagem na direita) */
    body.frame-none .game-container.layout-image-last .image-panel {
        border-left: none !important;
    }
}



/* LIFE SYSTEM POSITIONING */
/* Desktop: Flow-based (Between Description and Action Bar) */
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

/* Mobile: Fixed Top Right */
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
    enableTrackers: false,
    enableInventory: true,
    enableDiary: true,
    enableFixedVerbs: false,
    enableChances: false,
    gameTextReadingFlow: 'paused',
    gameInteractionType: 'parser',

    // Inventory Defaults
    inventoryCapacity: 10,
    inventoryMaxWeight: 0,

    // Diary Defaults
    diaryAutoScroll: true,
    diaryAllowExport: false,
    diaryMaxMessages: 100,

    gameMaxChances: 3,
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
    gameFontSize: '12',
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

import { useTheme } from './ThemeProvider';

// ... (existing imports)

const Editor: React.FC = () => {
    const { toast } = useToast();
    const { user, profile, loading: authLoading } = useUser();
    const { theme: appTheme } = useTheme();
    const navigate = useNavigate();

    const [isTransitioning, setIsTransitioning] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.title = "IF Builder / Ficções Interativas";
        return () => {
            document.title = "IF Builder / Ficções Interativas";
        };
    }, []);

    const [importKey, setImportKey] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 2000); // 2s duration
        return () => clearTimeout(timer);
    }, []);

    const handleNavigate = (path: string) => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(path);
        }, 2000); // 2s duration
    };

    const handleExit = () => handleNavigate('/dashboard');

    // Session loading handled by UserContext now.
    // If we need to block rendering until auth is ready:
    const loadingSession = authLoading;



    const handleLogout = async () => {
        try {
            // Perform actual logout
            await supabase.auth.signOut({ scope: 'global' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            // App.tsx will handle the redirect to Auth
        }
    };

    const [gameData, setGameData] = useState<GameData>(initialGameData);

    // --- Auto-Detection Logic for Legacy Saves ---
    const detectedActiveSystems = useMemo(() => {
        let hasInventoryUsage = false;
        let hasChancesUsage = false;
        // Cast to any to avoid strict type error if property missing in old types
        const hasTrackers = (gameData as any).trackers && (gameData as any).trackers.length > 0;

        // Scan all scenes for usage
        if (gameData.scenes) {
            Object.values(gameData.scenes).forEach((scene: any) => {
                if (scene.removesChanceOnEntry || scene.restoresChanceOnEntry) {
                    hasChancesUsage = true;
                }
                if (scene.interactions) {
                    scene.interactions.forEach((interaction: any) => {
                        if (interaction.addsToInventory || interaction.requiresInInventory) {
                            hasInventoryUsage = true;
                        }
                    });
                }
            });
        }

        return {
            inventory: hasInventoryUsage,
            chances: hasChancesUsage,
            trackers: hasTrackers
        };
    }, [gameData.scenes, (gameData as any).trackers]);

    const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
    const [previewSceneId, setPreviewSceneId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>('scenes');
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { },
        isDanger: false
    });

    const closeConfirmationModal = () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    };

    const [isManualOpen, setIsManualOpen] = useState(false);

    const handleExport = async () => {
        if (typeof JSZip === 'undefined') {
            alert('A biblioteca JSZip não foi carregada. Não é possível exportar.');
            return;
        }
        const zip = new JSZip();
        const assetsFolder = zip.folder("assets");
        if (!assetsFolder) return;

        const exportData = JSON.parse(JSON.stringify(gameData));
        const assetMap = new Map<string, string>();

        const processAsset = (base64String: string | undefined, baseName: string): string | undefined => {
            if (!base64String || !base64String.startsWith('data:')) return base64String;
            if (assetMap.has(base64String)) return assetMap.get(base64String);

            const commaIndex = base64String.indexOf(',');
            if (commaIndex === -1) return base64String;

            const header = base64String.substring(0, commaIndex);
            const data = base64String.substring(commaIndex + 1);

            const mimeMatch = header.match(/data:([^;]+)/);
            if (!mimeMatch || !mimeMatch[1]) return base64String;

            const mimeType = mimeMatch[1];
            let extension = mimeType.split('/')[1]?.split('+')[0] || 'bin';

            const filename = `assets/${baseName}.${extension}`;
            assetsFolder.file(`${baseName}.${extension}`, data, { base64: true });
            assetMap.set(base64String, filename);
            return filename;
        };

        exportData.gameLogo = processAsset(exportData.gameLogo, 'logo');
        exportData.gameSplashImage = processAsset(exportData.gameSplashImage, 'splash_image');
        exportData.gameBackgroundMusic = processAsset(exportData.gameBackgroundMusic, 'global_bgm');
        exportData.positiveEndingImage = processAsset(exportData.positiveEndingImage, 'positive_ending');
        exportData.negativeEndingImage = processAsset(exportData.negativeEndingImage, 'negative_ending');

        for (const sceneId in exportData.scenes) {
            const scene = exportData.scenes[sceneId];
            scene.image = processAsset(scene.image, `scene_image_${sceneId}`);
            scene.backgroundMusic = processAsset(scene.backgroundMusic, `scene_bgm_${sceneId}`);
            if (scene.interactions) {
                scene.interactions.forEach((inter: any, index: number) => {
                    inter.soundEffect = processAsset(inter.soundEffect, `sfx_${sceneId}_${index}`);
                });
            }
        }

        for (const objId in exportData.globalObjects) {
            const obj = exportData.globalObjects[objId];
            obj.image = processAsset(obj.image, `obj_image_${objId}`);
        }

        // Add Metadata
        const exportDate = new Date();
        const userName = profile?.username?.replace(/[^a-zA-Z0-9 _-]/g, '') || 'IF Builder User';

        exportData.metadata = {
            exportedBy: userName,
            exportDate: exportDate.toISOString(),
            platform: 'IF Builder',
            version: '1.0'
        };

        const readmeContent = `
================================================================
                    GAME INFORMATION
================================================================

TITLE:       ${exportData.gameTitle || 'Untitled Game'}
PLATFORM:    IF Builder
EXPORTED BY: ${userName}
DATE:        ${exportDate.toLocaleString()}

================================================================
        THANK YOU FOR CREATING WITH IF BUILDER
================================================================
`.trim();

        zip.file("README.txt", readmeContent);
        zip.file("editor_data.json", JSON.stringify(exportData));
        const fontFamily = exportData.gameFontFamily || "'Silkscreen', sans-serif";
        const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
        let fontStylesheet = '';
        let finalCss = exportData.gameCSS;

        if (fontName) {
            const googleFontName = fontName.replace(/ /g, '+');
            const fontCssUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;700&display=swap`;
            try {
                const cssResponse = await fetch(fontCssUrl);
                if (cssResponse.ok) {
                    let fontCssText = await cssResponse.text();
                    const fontUrlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
                    const fontFolder = zip.folder("fonts");
                    const fontUrlsToDownload = new Set<string>();
                    let match;
                    while ((match = fontUrlRegex.exec(fontCssText)) !== null) fontUrlsToDownload.add(match[1]);

                    for (const originalUrl of fontUrlsToDownload) {
                        const fontFileName = originalUrl.substring(originalUrl.lastIndexOf('/') + 1);
                        fontCssText = fontCssText.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `fonts/${fontFileName}`);
                        const fontRes = await fetch(originalUrl);
                        if (fontRes.ok) fontFolder.file(fontFileName, await fontRes.blob());
                    }
                    finalCss = fontCssText + '\n\n' + finalCss;
                } else {
                    const fontUrl = getFontUrl(fontFamily);
                    fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
                }
            } catch (e) {
                const fontUrl = getFontUrl(fontFamily);
                fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
            }
        }

        const engineData = prepareGameDataForEngine(exportData);
        const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');
        const finalGameScript = `window.embeddedGameData = ${safeJson};\n\n${gameJS}`;

        const trackersButtonHTML = (exportData.gameSystemEnabled === 'trackers' && (exportData.gameShowTrackersUI ?? true)) ? '<button id="trackers-button">__TRACKERS_BUTTON_TEXT__</button>' : '';
        const systemButtonHTML = (exportData.gameShowSystemButton ?? true) ? '<button id="system-button">__SYSTEM_BUTTON_TEXT__</button>' : '';

        const inventoryButtonHTML = (exportData.enableInventory ?? true)
            ? `<button id="inventory-button">${exportData.gameInventoryButtonText || 'Inventário'}</button>`
            : '';

        const diaryButtonHTML = (exportData.enableDiary ?? true)
            ? `<button id="diary-button">${exportData.gameDiaryButtonText || 'Diário'}</button>`
            : '';

        let htmlContent = gameData.gameHTML
            .replace('__GAME_TITLE__', exportData.gameTitle || 'IF Builder Game')
            .replace('__THEME_CLASS__', `${exportData.gameTheme || 'dark'}-theme with-spacing`)
            .replace('__LAYOUT_ORIENTATION_CLASS__', exportData.gameLayoutOrientation === 'horizontal' ? 'layout-horizontal' : '')
            .replace('__LAYOUT_ORDER_CLASS__', exportData.gameLayoutOrder === 'image-last' ? 'layout-image-last' : '')
            .replace('__FRAME_CLASS__', getFrameClass(exportData.gameImageFrame))
            .replace('__MOBILE_BEHAVIOR_CLASS__', 'behavior-immersive') // FIXO: COMPORTAMENTO IMERSIVO
            .replace('__FONT_STYLESHEET__', fontStylesheet)
            .replace('__CHANCES_CONTAINER__', (exportData.enableChances || exportData.gameSystemEnabled === 'chances') ? '<div id="chances-container" class="chances-container"></div>' : '')
            .replace('__TRACKERS_BUTTON__', trackersButtonHTML)
            .replace('__SYSTEM_BUTTON__', systemButtonHTML)
            .replace('__INVENTORY_BUTTON__', inventoryButtonHTML)
            .replace('__DIARY_BUTTON__', diaryButtonHTML)
            .replace(/__INVENTORY_BUTTON_TEXT__/g, exportData.gameInventoryButtonText || 'Inventário')
            .replace(/__SUGGESTIONS_BUTTON_TEXT__/g, exportData.gameSuggestionsButtonText || 'Sugestões')
            .replace(/__TRACKERS_BUTTON_TEXT__/g, exportData.gameTrackersButtonText || 'Rastreadores')
            .replace(/__SYSTEM_BUTTON_TEXT__/g, exportData.gameSystemButtonText || 'Sistema')
            .replace('__SAVE_MENU_TITLE__', exportData.gameSaveMenuTitle || 'Salvar Jogo')
            .replace('__LOAD_MENU_TITLE__', exportData.gameLoadMenuTitle || 'Carregar Jogo')
            .replace('__MAIN_MENU_BUTTON_TEXT__', exportData.gameMainMenuButtonText || 'Menu Principal')
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
            .replace('__VIEW_ENDING_BUTTON_TEXT__', exportData.gameViewEndingButtonText || 'Ver Final')
            .replace('__POSITIVE_ENDING_BG_STYLE__', exportData.positiveEndingImage ? `style="background-image: url('${exportData.positiveEndingImage}')"` : '')
            .replace('__POSITIVE_ENDING_ALIGN_CLASS__', exportData.positiveEndingContentAlignment === 'left' ? 'align-left' : '')
            .replace('__POSITIVE_ENDING_DESCRIPTION__', exportData.positiveEndingDescription || '')
            .replace('__NEGATIVE_ENDING_BG_STYLE__', exportData.negativeEndingImage ? `style="background-image: url('${exportData.negativeEndingImage}')"` : '')
            .replace('__NEGATIVE_ENDING_ALIGN_CLASS__', exportData.negativeEndingContentAlignment === 'left' ? 'align-left' : '')
            .replace('__NEGATIVE_ENDING_DESCRIPTION__', exportData.negativeEndingDescription || '');

        htmlContent = htmlContent.replace('</body>', '<script src="game.js"></script></body>');

        const css = finalCss
            .replace(/__FONT_FAMILY__/g, fontFamily)
            .replace(/__GAME_FONT_SIZE__/g, exportData.gameFontSize || '1em')
            .replace(/__GAME_TEXT_COLOR__/g, exportData.gameTextColor || '#c9d1d9')
            .replace(/__GAME_TITLE_COLOR__/g, exportData.gameTitleColor || '#58a6ff')
            .replace(/__GAME_FOCUS_COLOR__/g, exportData.gameFocusColor || '#58a6ff')
            .replace(/__GAME_TEXT_COLOR_LIGHT__/g, exportData.textColorLight || '#24292f')
            .replace(/__GAME_TITLE_COLOR_LIGHT__/g, exportData.titleColorLight || '#0969da')
            .replace(/__GAME_FOCUS_COLOR_LIGHT__/g, exportData.focusColorLight || '#0969da')
            .replace(/__SPLASH_BUTTON_COLOR__/g, exportData.gameSplashButtonColor || '#2ea043')
            .replace(/__SPLASH_BUTTON_HOVER_COLOR__/g, exportData.gameSplashButtonHoverColor || '#238636')
            .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
            .replace(/__ACTION_BUTTON_COLOR__/g, exportData.gameActionButtonColor || '#ffffff')
            .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
            .replace(/__ACTION_BUTTON_TEXT_COLOR__/g, exportData.gameActionButtonTextColor || '#0d1117')
            .replace(/__FRAME_BOOK_COLOR__/g, exportData.frameBookColor || '#FFFFFF')
            .replace(/__FRAME_TRADING_CARD_COLOR__/g, exportData.frameTradingCardColor || '#1c1917')
            .replace(/__FRAME_ROUNDED_TOP_COLOR__/g, exportData.frameRoundedTopColor || '#facc15')
            .replace(/__SCENE_NAME_OVERLAY_BG__/g, exportData.gameSceneNameOverlayBg || '#0d1117')
            .replace(/__SCENE_NAME_OVERLAY_TEXT_COLOR__/g, exportData.gameSceneNameOverlayTextColor || '#c9d1d9')
            .replace(/__CONTINUE_INDICATOR_COLOR__/g, exportData.gameContinueIndicatorColor || exportData.gameTitleColor || '#58a6ff');

        zip.file("index.html", htmlContent);
        zip.file("style.css", css);
        zip.file("game.js", finalGameScript);

        // Explicitly set MIME type to avoid browser security warnings
        const zipContent = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        const finalBlob = new Blob([zipContent], { type: "application/zip" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(finalBlob);
        link.download = `${exportData.gameTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'game'}.zip`;
        document.body.appendChild(link);
        link.click();

        // Delay cleanup to ensure browser captures the download
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }, 100);
    };

    const handleImportFile = async (file: File) => {
        if (typeof JSZip === 'undefined') {
            alert('A biblioteca JSZip não foi carregada. Não é possível importar.');
            return;
        }

        const reader = new FileReader();
        if (file.name.endsWith('.zip')) {
            reader.onload = async (ev) => {
                try {
                    const zip = await JSZip.loadAsync(ev.target?.result);
                    const editorDataStr = await zip.file('editor_data.json')?.async('string');
                    if (!editorDataStr) throw new Error("editor_data.json não encontrado no pacote ZIP.");

                    const data = JSON.parse(editorDataStr);

                    const restoreAsset = async (path: string | undefined): Promise<string | undefined> => {
                        if (!path || !path.startsWith('assets/')) return path;
                        const zipFile = zip.file(path);
                        if (!zipFile) return path;

                        const mimeType = getMimeTypeFromFileName(path);
                        const buffer = await zipFile.async('arraybuffer');
                        const blob = new Blob([buffer], { type: mimeType });

                        return new Promise((resolve) => {
                            const readerAsset = new FileReader();
                            readerAsset.onloadend = () => resolve(readerAsset.result as string);
                            readerAsset.readAsDataURL(blob);
                        });
                    };

                    data.gameLogo = await restoreAsset(data.gameLogo);
                    data.gameSplashImage = await restoreAsset(data.gameSplashImage);
                    data.gameBackgroundMusic = await restoreAsset(data.gameBackgroundMusic);
                    data.positiveEndingImage = await restoreAsset(data.positiveEndingImage);
                    data.negativeEndingImage = await restoreAsset(data.negativeEndingImage);

                    if (data.scenes) {
                        for (const sId in data.scenes) {
                            const scene = data.scenes[sId];
                            scene.image = await restoreAsset(scene.image);
                            scene.backgroundMusic = await restoreAsset(scene.backgroundMusic);
                            if (scene.interactions) {
                                for (const inter of scene.interactions) {
                                    inter.soundEffect = await restoreAsset(inter.soundEffect);
                                }
                            }
                        }
                    }

                    if (data.globalObjects) {
                        for (const oId in data.globalObjects) {
                            const obj = data.globalObjects[oId];
                            obj.image = await restoreAsset(obj.image);
                        }
                    }

                    handleImportGame(data);
                } catch (err) {
                    alert("Erro ao importar ZIP: " + (err as Error).message);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = (ev) => handleImportGame(JSON.parse(ev.target?.result as string));
            reader.readAsText(file);
        }
    };

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
            gameMobileLayoutBehavior: 'immersive', // FORÇA O COMPORTAMENTO IMERSIVO NA IMPORTAÇÃO
            fixedVerbs: data.fixedVerbs || [],
            enableFixedVerbs: !!data.enableFixedVerbs || (Array.isArray(data.fixedVerbs) && data.fixedVerbs.length > 0),
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
        setImportKey(prev => prev + 1);
    }, []);

    const handleUpdateGameData = (field: keyof GameData, value: any, skipDirty?: boolean) => {
        setGameData(prev => {
            if (field === 'gameSystemEnabled' && value === 'trackers') {
                return { ...prev, [field]: value, gameShowTrackersUI: true };
            }
            return { ...prev, [field]: value };
        });
        if (!skipDirty) {
            setIsDirty(true);
        }
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
            const updatedOrder = [...prev.sceneOrder, newId];
            const isFirst = updatedOrder.length === 1;
            return {
                ...prev,
                scenes: newScenes,
                sceneOrder: updatedOrder,
                startScene: isFirst ? newId : prev.startScene
            };
        });
        setSelectedSceneId(newId);
        setIsDirty(true);
    };

    const handleDownloadExample = () => {
        const element = document.createElement("a");
        element.href = "/fuja_da_masmorra.zip";
        element.download = "fuja_da_masmorra.zip";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleDeleteScene = (id: string) => {
        if (id === gameData.startScene && Object.keys(gameData.scenes).length > 1) {
            toast("Ação não permitida", "Você não pode deletar a cena inicial. Defina outra cena como inicial antes de excluir esta.", "error");
            return;
        }

        const proceedWithDelete = () => {
            setGameData(prev => {
                const newScenes = { ...prev.scenes };
                delete newScenes[id];
                const updatedOrder = prev.sceneOrder.filter(sid => sid !== id);
                let newStart = prev.startScene;
                if (newStart === id) {
                    newStart = updatedOrder.length > 0 ? updatedOrder[0] : '';
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

                return {
                    ...prev,
                    scenes: newScenes,
                    sceneOrder: updatedOrder,
                    startScene: newStart
                };
            });

            if (id === selectedSceneId) {
                const newSceneId = gameData.sceneOrder.find(sid => sid !== id) || '';
                setSelectedSceneId(newSceneId);
            }
            setIsDirty(true);
            toast("Cena deletada", "A cena foi removida com sucesso.", "success");
            closeConfirmationModal();
        };

        setConfirmationModal({
            isOpen: true,
            title: "Deletar Cena",
            message: "Tem certeza que deseja deletar esta cena? Esta ação não pode ser desfeita e removerá todas as referências a ela.",
            isDanger: true,
            onConfirm: proceedWithDelete,
            onCancel: closeConfirmationModal
        });



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
            const orderWithNew = [...prev.sceneOrder, newId];
            return { ...prev, scenes: newScenes, sceneOrder: orderWithNew };
        });
        setSelectedSceneId(newId);
        setIsDirty(true);
    };

    const handleReorderScenes = (newSceneIds: string[]) => {
        setGameData(prev => ({ ...prev, sceneOrder: newSceneIds }));
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
            setConfirmationModal({
                isOpen: true,
                title: "Novo Jogo",
                message: "Existem alterações não salvas. Deseja iniciar um novo jogo e perder as alterações atuais?",
                isDanger: true,
                onConfirm: () => {
                    closeConfirmationModal();
                    setGameData(initialGameData);
                    setSelectedSceneId(null);
                    setCurrentView('interface'); // Redirect to Interface
                    setIsDirty(false);
                },
                onCancel: closeConfirmationModal
            });
            return;
        }
        setGameData(initialGameData);

        setIsDirty(false);
        setImportKey(prev => prev + 1);
    };

    const handleStartCreating = () => {
        handleAddScene();
        setCurrentView('interface');
    };

    const handleCreateGlobalObject = (obj: GameObject, linkToSceneId?: string) => {
        setGameData(prev => {
            const newObjects = { ...prev.globalObjects, [obj.id]: obj };
            let updatedScenes = prev.scenes;

            if (linkToSceneId && prev.scenes[linkToSceneId]) {
                const scene = prev.scenes[linkToSceneId];
                updatedScenes = {
                    ...prev.scenes,
                    [linkToSceneId]: {
                        ...scene,
                        objectIds: [...(scene.objectIds || []), obj.id]
                    }
                };
            }

            return { ...prev, globalObjects: newObjects, scenes: updatedScenes };
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

            const updatedScenes = { ...prev.scenes };
            Object.keys(updatedScenes).forEach(id => {
                const scene = updatedScenes[id];
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
                    updatedScenes[id] = { ...scene, objectIds: newObjectIds, interactions: newInteractions };
                }
            });

            return { ...prev, globalObjects: newObjects, scenes: updatedScenes };
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


    const handleGoToForum = async () => {
        setIsSaving(true);
        // Clean save simulation if needed, or trigger actual save if implemented
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
        navigate('/community');
    };

    if (loadingSession) {
        return <TransitionScreen isVisible={true} />;
    }

    if (!user) {
        return <Auth />;
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
            <TransitionScreen isVisible={isTransitioning} />
            {isPreviewing ? (
                <div className="flex flex-col w-full h-full">
                    <Header
                        gameData={gameData}
                        isPreviewing={isPreviewing}
                        onTogglePreview={() => setIsPreviewing(false)}
                        onNewGame={handleNewGame}
                        onLogout={handleLogout}
                        onHome={() => {
                            setCurrentView('scenes');
                            setSelectedSceneId(null);
                        }}
                    />
                    <Preview gameData={gameData} testSceneId={previewSceneId} />
                </div>
            ) : (
                <div className="flex flex-col h-full w-full">

                    <Header
                        gameData={gameData}
                        isPreviewing={isPreviewing}
                        onTogglePreview={() => {
                            setPreviewSceneId(null);
                            setIsPreviewing(true);
                        }}
                        onNewGame={handleNewGame}
                        onLogout={handleLogout}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                        onExport={handleExport}
                        onImport={handleImportFile}
                        onHome={() => {
                            setCurrentView('scenes');
                            setSelectedSceneId(null);
                        }}
                        currentView={currentView}
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
                            onSetView={(view) => {
                                setCurrentView(view);
                                setIsDirty(false);
                            }}
                            onExit={handleExit}
                            onNavigate={handleNavigate}
                            onImportGame={handleImportGame}
                            onTogglePreview={() => {
                                setPreviewSceneId(null);
                                setIsPreviewing(true);
                            }}
                            isCollapsed={sidebarCollapsed}
                            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                            isDirty={isDirty}
                            onOpenManual={() => setIsManualOpen(true)}
                            theme={appTheme}
                        />
                        <main className={`flex-1 overflow-y-auto relative bg-background ${currentView === 'scenes' && !selectedScene ? 'p-0' : 'p-6'}`}>
                            {currentView === 'interface' && (
                                <UIEditor
                                    key={importKey}
                                    {...gameData}
                                    enableInventory={gameData.enableInventory ?? detectedActiveSystems.inventory}
                                    enableChances={(gameData.enableChances ?? detectedActiveSystems.chances) || gameData.gameSystemEnabled === 'chances'}
                                    enableTrackers={(gameData.enableTrackers ?? detectedActiveSystems.trackers) || gameData.gameSystemEnabled === 'trackers'}
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
                                    gameInteractionType={gameData.gameInteractionType || 'parser'}
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
                                    gameFontSize={gameData.gameFontSize || '0.75em'}
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
                                    diaryShowSceneImage={gameData.diaryShowSceneImage}
                                    diaryShowPlayerAction={gameData.diaryShowPlayerAction}
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
                                    gameInteractionType={gameData.gameInteractionType || 'parser'}
                                />
                            ) : currentView === 'scenes' ? (
                                <WelcomePlaceholder
                                    onCreateScene={handleStartCreating}
                                    onDownloadExample={handleDownloadExample}
                                    onMeetProject={() => setCurrentView('about')}
                                    theme={appTheme}
                                />
                            ) : currentView === 'guide' ? (
                                <GuideView />
                            ) : null}

                            {currentView === 'map' && (
                                <SceneMap
                                    allScenesMap={gameData.scenes}
                                    globalObjects={gameData.globalObjects}
                                    startSceneId={gameData.startScene}
                                    onSelectScene={handleSelectScene}
                                    onUpdateScenePosition={handleUpdateScenePosition}
                                    onAddScene={handleAddScene}
                                    gameInteractionType={gameData.gameInteractionType || 'parser'}
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

                            {currentView === 'settings' && <Settings hideHeader />}
                            {currentView === 'about' && <AboutProject hideHeader />}
                        </main>
                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                title={confirmationModal.title}
                message={confirmationModal.message}
                onConfirm={confirmationModal.onConfirm}
                onCancel={confirmationModal.onCancel}
                isDanger={confirmationModal.isDanger}
            />
            <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
        </div>
    );
};

export default Editor;
