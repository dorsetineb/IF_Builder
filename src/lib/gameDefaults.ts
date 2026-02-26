
import { GameData } from '../types';

export const gameHTML = `
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

        <div id="vignette-screen" class="splash-screen hidden">
            <div id="vignette-overlay" class="scene-overlay" style="z-index: 1;"></div>
            <div class="splash-content" style="z-index: 10;">
                <div class="splash-text">
                    <h1 id="vignette-title"></h1>
                    <p id="vignette-description"></p>
                </div>
                <div class="splash-buttons">
                    <button id="vignette-continue-button" class="ending-restart-button">Continuar</button>
                </div>
            </div>
        </div>

        <div class="game-container __LAYOUT_ORIENTATION_CLASS__ __LAYOUT_ORDER_CLASS__" id="game-container">
            <div class="image-panel">
                <div id="image-container" class="image-container">
                  <!-- Back image: The Next Scene (loads behind) -->
                  <img id="scene-image-back" src="" alt="Cena seguinte" class="scene-image hidden">
                  <!-- Front image: The Current Scene (animates out) -->
                  <img id="scene-image" src="" alt="Cena atual" class="scene-image">
                  <div id="scene-overlay" class="scene-overlay"></div>
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
  <svg style="display: none;">
    <defs>
      <filter id="tv-distortion-filter" x="-20%" y="-20%" width="140%" height="140%">
        <!-- 1. Chromatic Aberration (RGB Shift) -->
        <feOffset in="SourceGraphic" dx="-4" dy="0" result="r_offset">
          <animate attributeName="dx" values="-4;-3;-5;-4" dur="0.2s" repeatCount="indefinite"/>
        </feOffset>
        <feOffset in="SourceGraphic" dx="4" dy="0" result="b_offset">
          <animate attributeName="dx" values="4;3;5;4" dur="0.3s" repeatCount="indefinite"/>
        </feOffset>
        <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />
        
        <!-- Split channels & merge with Screen blend mode (Fixes Blue Tint) -->
        <feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
        <feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
        <feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
        
        <feBlend in="red" in2="green" mode="screen" result="rg"/>
        <feBlend in="rg" in2="blue" mode="screen" result="rgb"/>
        
        <!-- 2. Horizontal Glitch/Jitter Distortion -->
        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.75" numOctaves="1" result="noise" seed="0">
          <animate attributeName="baseFrequency" values="0.001 0.75; 0.001 0.76; 0.001 0.75" dur="0.15s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="rgb" in2="noise" scale="0.3" xChannelSelector="R" yChannelSelector="R" result="distorted"/>
      </filter>
      
      <filter id="tv-distortion-filter-lg" x="-20%" y="-20%" width="140%" height="140%">
        <!-- 1. Chromatic Aberration (RGB Shift) -->
        <feOffset in="SourceGraphic" dx="-4" dy="0" result="r_offset">
          <animate attributeName="dx" values="-4;-3;-5;-4" dur="0.2s" repeatCount="indefinite"/>
        </feOffset>
        <feOffset in="SourceGraphic" dx="4" dy="0" result="b_offset">
          <animate attributeName="dx" values="4;3;5;4" dur="0.3s" repeatCount="indefinite"/>
        </feOffset>
        <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />
        
        <!-- Split channels & merge with Screen blend mode (Fixes Blue Tint) -->
        <feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
        <feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
        <feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
        
        <feBlend in="red" in2="green" mode="screen" result="rg"/>
        <feBlend in="rg" in2="blue" mode="screen" result="rgb"/>
        
        <!-- 2. Horizontal Glitch/Jitter Distortion (Stronger for Large Screens) -->
        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.75" numOctaves="1" result="noise" seed="0">
          <animate attributeName="baseFrequency" values="0.001 0.75; 0.001 0.76; 0.001 0.75" dur="0.15s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="rgb" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="R" result="distorted"/>
      </filter>
      
      <!-- Glitch Distortion Filter -->
      <filter id="glitch-distortion-filter" x="-10%" y="-10%" width="120%" height="120%">
        <!-- Sporadic Chromatic Aberration (RGB Shift) - Normal when static -->
        <feOffset in="SourceGraphic" dx="0" dy="0" result="r_offset">
          <animate attributeName="dx" values="0;0;0;0;-4;0;0;0;0;-3;0;0" dur="3s" repeatCount="indefinite"/>
        </feOffset>
        <feOffset in="SourceGraphic" dx="0" dy="0" result="b_offset">
          <animate attributeName="dx" values="0;0;0;0;4;0;0;0;0;3;0;0" dur="3s" repeatCount="indefinite"/>
        </feOffset>
        <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />
        
        <!-- Split channels & merge with Screen blend mode -->
        <feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
        <feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
        <feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
        
        <feBlend in="red" in2="green" mode="screen" result="rg"/>
        <feBlend in="rg" in2="blue" mode="screen" result="rgb"/>
        
        <!-- Sporadic Horizontal Slice Displacement -->
        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.5" numOctaves="1" result="noise" seed="5">
          <animate attributeName="seed" values="5;5;5;5;8;5;5;5;5;3;5;5" dur="4s" repeatCount="indefinite"/>
        </feTurbulence>
        <feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="distorted"/>
      </filter>

      <!-- Wiggle (Squiggly) Filters for Squigglevision -->
      <filter id="squiggly-0">
        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="0"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
      <filter id="squiggly-1">
        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="1"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
      <filter id="squiggly-2">
        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="2"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
      <filter id="squiggly-3">
        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="3"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
      <filter id="squiggly-4">
        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="4"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
    </defs>
  </svg>
</body>
</html>
`;

export const gameCSS = `
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
.splash-content { text-align: var(--splash-text-align); display: flex; flex-direction: column; align-items: var(--splash-content-align-items); gap: 20px; width: 100%; padding: 5vw 225px; position: relative; }
.splash-logo { max-height: 150px; width: auto; margin-bottom: 20px; }
.splash-text h1 { font-size: 2em; color: var(--accent-color); margin: 0; text-shadow: none; }
.splash-text p { font-size: 0.95em; margin-top: 10px; color: var(--text-color); max-width: 60ch; white-space: pre-wrap; }
.splash-buttons { display: flex; flex-direction: column; gap: 15px; width: 100%; align-items: var(--splash-content-align-items); }
#splash-start-button, .ending-restart-button, #continue-button, #vignette-continue-button { font-family: var(--font-family); padding: 12px 24px; font-size: 1.1em; font-weight: bold; border: none; cursor: pointer; color: var(--splash-button-text-color); transition: all 0.2s ease-in-out; width: 100%; max-width: 350px; }
#splash-start-button, .ending-restart-button, #vignette-continue-button { background-color: var(--splash-button-bg); }
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
.scene-name-overlay { position: absolute; top: 20px; left: 20px; background-color: var(--scene-name-overlay-bg); color: var(--scene-name-overlay-text-color); border: 2px solid var(--border-color); border-radius: 0; font-size: 1em; font-weight: bold; z-index: 10; opacity: 1; transition: opacity 0.5s ease-in-out; pointer-events: none; text-align: left; padding: 6px 12px; box-sizing: border-box; }
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

body.frame-rounded-top.game-container.image-panel { padding: 5px; background: __FRAME_ROUNDED_TOP_COLOR__; border: none; border-radius: 40px 40px 4px 4px; box-shadow: none; }
body.frame-rounded-top.game-container.image-container { border-radius: 35px 35px 0 0; }
body.frame-book-cover.game-container.image-panel { padding: 5px; background: __FRAME_BOOK_COLOR__; border: none; }
body.frame-book-cover.game-container.image-container { box-shadow: none; border-radius: 0 !important; }
body.frame-book-cover #scene-image, body.frame-book-cover #scene-image-back { border-radius: 0 !important; }
body.frame-trading-card.image-panel { padding: 4px; background: __FRAME_TRADING_CARD_COLOR__; border-radius: 12px; }
body.frame-trading-card.game-container:not(.layout-image-last).image-panel { border-right-color: transparent; }
body.frame-trading-card.game-container.layout-image-last.image-panel { border-left-color: transparent; }
body.frame-trading-card.image-container { border: none; border-radius: 8px; }
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
    body.frame-none.main-wrapper {
        max-width: none !important;
        margin: 0 !important;
        height: 100vh !important;
    }
    body.frame-none.game-container {
        height: 100vh !important;
    }
    body.frame-none.image-panel {
        height: 100vh !important;
        border-right: none !important;
        padding: 0 !important;
    }
    /* Manteve borda apenas se layout for Horizontal */
    body.frame-none.game-container.layout-horizontal.image-panel {
        width: 100% !important;
        flex-basis: auto !important;
        height: 45vh !important; /* Ajuste para horizontal */
    }
    /* Ajuste para Image-Last (Imagem na direita) */
    body.frame-none.game-container.layout-image-last.image-panel {
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
.chance-icon svg { width: 24px; height: 24px; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6)); display: block; }
.chance-icon.lost svg { opacity: 0.3; }
`;

export const OVERLAY_CSS = `
/* OVERLAY EFFECTS */
.scene-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 3;
    display: none;
    overflow: hidden;
}

/* FOG EFFECT */
.scene-overlay.overlay-fog {
    display: block;
}
.fog-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}
.fog-img {
  position: absolute;
  height: 100%;
  width: 300%;
  z-index: 2;
  top: 0;
  left: 0;
}
.fog-img-first {
  background: url("https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-1.png");
  background-repeat: repeat-x;
  background-size: contain;
  background-position: center;
  animation: marquee 60s linear infinite;
  filter: brightness(2.5) contrast(1.2);
  opacity: 1;
}
.fog-img-second {
  background: url("https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-2.png");
  background-repeat: repeat-x;
  background-size: contain;
  background-position: center;
  animation: marquee 30s linear infinite;
  filter: brightness(2.5) contrast(1.2);
  opacity: 1;
}
@keyframes marquee {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-200%, 0, 0); }
}

.scene-overlay.overlay-grain {
    display: block;
}
.scene-overlay.overlay-grain:after {
    content: "";
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png");
    height: 300%;
    width: 300%;
    position: absolute;
    top: -100%;
    left: -100%;
    opacity: 0.15;
    animation: animateGrain 8s steps(10) infinite;
}
@keyframes animateGrain{
    0%, 100% { transform:translate(0, 0) }
    10%{ transform:translate(-5%,-10%) }
    20%{ transform:translate(-15%,-20%) }
    30%{ transform:translate(-5%,-10%) }
    40%{ transform:translate(-15%,-20%) }
    50%{ transform:translate(-5%,-10%) }
    60%{ transform:translate(-15%,-20%) }
    70%{ transform:translate(-5%,-10%) }
    80%{ transform:translate(-15%,-20%) }
    90%{ transform:translate(-5%,-10%) }
    100%{ transform:translate(-15%,-20%) }
}

/* Rain Effect */
.scene-overlay.overlay-rain {
    display: block;
}
.rain-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
}
.lightning-layer {
    position: absolute;
    inset: 0;
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
}
.scene-overlay.overlay-rain .lightning-layer {
    animation: lightning-flash 11s infinite linear alternate;
}
@keyframes lightning-flash {
    0%, 90%, 100% { opacity: 0; }
    92%, 96% { opacity: 0.8; background-color: white; } 
    94%, 98% { opacity: 0.2; }
}

/* Blur/Vintage Film Effect */
.scene-overlay.overlay-blur {
    display: block;
    overflow: hidden;
}
.scene-overlay.overlay-blur .blur-overlay-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 1;
}
.scene-overlay.overlay-blur .blur-flicker-layer {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.25);
    z-index: 2;
    animation: blurIntroOverlay 5s infinite;
    pointer-events: none;
}
.scene-overlay.overlay-blur .blur-grain-layer {
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: url(https://cl.ly/image/2m2R0A3m1b3x/noise.png);
    z-index: 3;
    animation: blurGrainOverlay 5s steps(10) infinite;
    pointer-events: none;
    opacity: 0.4;
}
.scene-overlay.overlay-blur .blur-rumble-layer {
    position: absolute;
    inset: 0;
    z-index: 1;
    animation: blurRumble 5s steps(3) infinite;
    pointer-events: none;
}
.scene-overlay.overlay-blur .blur-vignette-layer {
    position: absolute;
    inset: 0;
    z-index: 4;
    background: radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);
    pointer-events: none;
}
@keyframes blurIntroOverlay {
    0% { opacity: 1; }
    7% { opacity: .7; }
    9% { opacity: .9; }
    15% { opacity: .7; }
    19% { opacity: .8; }
    25% { opacity: .6; }
    30% { opacity: .5; }
    35% { opacity: .9; }
    38% { opacity: 1; }
    43% { opacity: .5; }
    50% { opacity: .8; }
    55% { opacity: .5; }
    59% { opacity: .9; }
    60% { opacity: .6; }
    66% { opacity: .7; }
    75% { opacity: .9; }
    80% { opacity: 1; }
    85% { opacity: .5; }
    90% { opacity: .8; }
    95% { opacity: .7; }
    98% { opacity: .5; }
    100% { opacity: .9; }
}
@keyframes blurGrainOverlay {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -10%); }
    20% { transform: translate(-15%, 5%); }
    30% { transform: translate(7%, -25%); }
    40% { transform: translate(-5%, 25%); }
    50% { transform: translate(-15%, 10%); }
    60% { transform: translate(15%, 0%); }
    70% { transform: translate(0%, 15%); }
    80% { transform: translate(3%, 35%); }
    90% { transform: translate(-10%, 10%); }
}
@keyframes blurRumble {
    0%, 100% { transform: translate(0, 0); opacity: .9; }
    10% { transform: translate(-3px, -5px); opacity: .7; }
    20% { transform: translate(-2px, 6px); opacity: 1; }
    30% { transform: translate(-3px, -2px); opacity: .9; }
    40% { transform: translate(-4px, 0px); }
    50% { transform: translate(-7px, 4px); }
    60% { transform: translate(-5px, 2px); }
    70% { transform: translate(-1px, 3px); }
    80% { transform: translate(3px, 6px); }
    90% { transform: translate(0px, 7px); }
}

/* Scanline/Chromatic Effect */
.scene-overlay.overlay-chromatic {
    display: block;
    overflow: hidden;
}
.scene-overlay.overlay-chromatic .chromatic-overlay-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 1;
}
.scene-overlay.overlay-chromatic .chromatic-layer {
    position: absolute;
    inset: 0;
    mix-blend-mode: screen;
    pointer-events: none;
}
.scene-overlay.overlay-chromatic .chromatic-red {
    background: rgba(255, 0, 0, 0.12);
    animation: chromaticJerkRed 1s infinite;
}
.scene-overlay.overlay-chromatic .chromatic-green {
    background: rgba(0, 255, 0, 0.12);
    animation: chromaticJerkGreen 1s infinite;
}
.scene-overlay.overlay-chromatic .chromatic-blue {
    background: rgba(0, 100, 255, 0.12);
    animation: chromaticJerkBlue 1s infinite;
}
.scene-overlay.overlay-chromatic .chromatic-flicker {
    position: absolute;
    inset: 0;
    background: transparent;
    animation: chromaticFlicker 30ms infinite;
    pointer-events: none;
}
.scene-overlay.overlay-chromatic .chromatic-scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 2px, transparent 2px, transparent 4px);
    pointer-events: none;
    z-index: 5;
}
.scene-overlay.overlay-chromatic .chromatic-jerk-wrapper {
    position: absolute;
    inset: 0;
    animation: chromaticJerkWhole 3s infinite;
}
@keyframes chromaticJerkRed {
    0%, 30%, 32%, 98% { transform: translateX(0); }
    31% { transform: translateX(-4px); }
    100% { transform: translateX(-4px); }
}
@keyframes chromaticJerkGreen {
    0%, 30%, 32%, 98% { transform: translateX(0); }
    31% { transform: translateX(4px); }
    100% { transform: translateX(4px); }
}
@keyframes chromaticJerkBlue {
    0%, 30%, 32%, 98% { transform: translateY(0); }
    31% { transform: translateY(3px); }
    100% { transform: translateY(3px); }
}
@keyframes chromaticFlicker {
    0% { opacity: 0.92; }
    50% { opacity: 1; }
    100% { opacity: 0.92; }
}
@keyframes chromaticJerkWhole {
    0%, 39%, 44%, 100% { transform: translate(0, 0) scale(1) skew(0deg, 0deg); opacity: 1; }
    40% { transform: translate(-3px, 0) scale(1, 1.02) skew(2deg, 0deg); opacity: 0.9; }
    41% { transform: translate(3px, 0) scale(1, 1.02) skew(-2deg, 0deg); opacity: 0.9; }
    42% { transform: translate(-2px, 0) scale(1, 1.01) skew(1deg, 0deg); opacity: 0.95; }
    43% { transform: translate(0, 0) scale(1) skew(0deg, 0deg); opacity: 1; }
}

/* TV/CRT Effect */
.scene-overlay.overlay-tv {
    display: block;
    overflow: hidden;
}

/* TV Overlay Effect Container */
.tv-distortion-active {
    /* Force hardware acceleration */
    transform: translateZ(0); 
}
.tv-distortion-active-lg {
    /* Force hardware acceleration */
    transform: translateZ(0); 
}
.tv-distortion-active img, 
.tv-distortion-active .scene-image {
    filter: url(#tv-distortion-filter) !important;
    transform: scale(1.02);
}
.tv-distortion-active-lg img, 
.tv-distortion-active-lg .scene-image,
.tv-distortion-active-lg video {
    filter: url(#tv-distortion-filter-lg) !important;
    transform: scale(1.02);
}

.scene-overlay.overlay-tv .tv-overlay-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 10;
    /* Responsive curvature */
    border-radius: clamp(10px, 2vmin, 20px); 
    /* Deep inset shadow relative to viewport size for consistent look */
    box-shadow: inset 0 0 10vmin rgba(0,0,0,0.7); 
}

.scene-overlay.overlay-tv .tv-screen-wrapper {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: clamp(10px, 2vmin, 20px);
    /* Inner shadow to simulate curved glass edges */
    box-shadow: inset 0 0 5vmin rgba(0,0,0,0.8), inset 0 0 1vmin rgba(0,0,0,0.8);
    z-index: 20;
}

.scene-overlay.overlay-tv .tv-scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.2) 0px,
        rgba(0, 0, 0, 0.2) 1px,
        transparent 1px,
        transparent 3px
    );
    pointer-events: none;
    z-index: 3;
    opacity: 0.6;
}

.scene-overlay.overlay-tv .tv-rgb-grid {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.06) 0px,
        rgba(255, 0, 0, 0.06) 1px,
        rgba(0, 255, 0, 0.06) 1px,
        rgba(0, 255, 0, 0.06) 2px,
        rgba(0, 0, 255, 0.06) 2px,
        rgba(0, 0, 255, 0.06) 3px
    );
    pointer-events: none;
    z-index: 2;
    opacity: 0.5;
    mix-blend-mode: overlay;
}

.scene-overlay.overlay-tv .tv-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at center,
        transparent 55%,
        rgba(0, 0, 0, 0.3) 80%,
        rgba(0, 0, 0, 0.95) 100%
    );
    pointer-events: none;
    z-index: 4;
}

.scene-overlay.overlay-tv .tv-glow {
    position: absolute;
    top: -50%; left: -50%; right: -50%; bottom: -50%;
    background: radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 60%
    );
    pointer-events: none;
    z-index: 5;
    animation: tvGlowPulse 5s ease-in-out infinite alternate;
    opacity: 0.5;
}

.scene-overlay.overlay-tv .tv-flicker {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.02);
    mix-blend-mode: overlay;
    animation: tvFlicker 0.1s infinite;
    pointer-events: none;
    z-index: 6;
}

.scene-overlay.overlay-tv .tv-interference {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.15);
    pointer-events: none;
    z-index: 7;
    animation: tvInterference 6s linear infinite;
    opacity: 0;
    box-shadow: 0 0 10px rgba(255,255,255,0.5);
}

@keyframes tvFlicker {
    0% { opacity: 0.9; }
    50% { opacity: 1.0; }
    100% { opacity: 0.9; }
}
@keyframes tvGlowPulse {
    0% { transform: scale(1); opacity: 0.4; }
    100% { transform: scale(1.05); opacity: 0.5; }
}
@keyframes tvInterference {
    0% { top: -10%; opacity: 0; }
    10% { opacity: 0.5; }
    11% { opacity: 0; }
    50% { top: 110%; opacity: 0; }
    100% { top: 110%; opacity: 0; }
}

/* Confetti Effect */
.scene-overlay.overlay-confetti {
    display: block;
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
}
.confetti-canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

/* Glitch Effect */
.scene-overlay.overlay-glitch {
    display: block;
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
}
.glitch-canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    mix-blend-mode: hard-light;
    opacity: 0.6;
}

/* Apply SVG filter to image when glitch is active */
.glitch-distortion-active #scene-image,
.glitch-distortion-active #scene-image-back {
    filter: url(#glitch-distortion-filter);
}

/* Scanline overlay for glitch */
.scene-overlay.overlay-glitch::before {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.05) 0px,
        rgba(0, 0, 0, 0.05) 1px,
        transparent 1px,
        transparent 3px
    );
    pointer-events: none;
    z-index: 1;
}

@keyframes glitchScanlines {
    0% { opacity: 0.8; }
    50% { opacity: 0.6; }
    100% { opacity: 0.8; }
}

/* Nosferatu Effect - Vintage Silent Film */
.scene-overlay.overlay-nosferatu,
#vignette-overlay.overlay-nosferatu {
    display: block;
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
}

/* Apply sepia filter to image when nosferatu is active */
.nosferatu-active #scene-image,
.nosferatu-active #scene-image-back {
    filter: sepia(0.8) contrast(1.1) brightness(0.9);
}

/* For vignette screen - use pseudo-element to filter only the background, not content */
#vignette-screen.nosferatu-active {
    background-color: transparent;
}
#vignette-screen.nosferatu-active::before {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    background-size: cover;
    background-position: center;
    filter: sepia(0.8) contrast(1.1) brightness(0.9);
    z-index: 0;
}

/* For vignette screen with glitch - use pseudo-element to filter only the background */
#vignette-screen.glitch-active::before {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    background-size: cover;
    background-position: center;
    filter: url(#glitch-distortion-filter);
    z-index: 0;
    transform: translateZ(0);
}

/* For vignette screen with TV effect - use pseudo-element to filter only the background */
#vignette-screen.tv-active::before {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    background-size: cover;
    background-position: center;
    filter: url(#tv-distortion-filter-lg);
    z-index: 0;
    transform: translateZ(0);
}

/* Cinema effect layer */
.nosferatu-cinema {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.1);
    filter: blur(0.45px);
    z-index: 1;
}

/* Scratch lines */
.nosferatu-scratch {
    position: absolute;
    width: 120%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.4;
    background: repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 2px, transparent 120px);
    animation: nosferatuScratch 0.45s steps(1) infinite;
    z-index: 2;
}

/* Effect scratch */
.nosferatu-effect-scratch {
    position: absolute;
    width: 120%;
    height: 100%;
    top: 0;
    left: 30%;
    opacity: 0.3;
    background: repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 2px, transparent 80px);
    animation: nosferatuEffectScratch 2s infinite;
    z-index: 3;
}

/* Film grain */
.nosferatu-grain {
    position: absolute;
    width: 110%;
    height: 110%;
    top: -5%;
    left: -5%;
    opacity: 0.2;
    background-image: 
        repeating-conic-gradient(rgba(255,255,255,0.5) 0%, transparent 0.0003%, transparent 0.0075%, transparent 0.0085%),
        repeating-conic-gradient(#FFF 0%, transparent 0.0005%, transparent 0.0015%, transparent 0.065%);
    animation: nosferatuGrain 0.5s steps(1) infinite;
    z-index: 4;
}

/* Vignette */
.nosferatu-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
    z-index: 5;
}

@keyframes nosferatuScratch {
    0%, 100% { transform: translateX(0); opacity: 0.4; }
    10% { transform: translateX(-1%); }
    20% { transform: translateX(1%); }
    30% { transform: translateX(-2%); opacity: 0.6; }
    40% { transform: translateX(3%); }
    50% { transform: translateX(-3%); opacity: 0.4; }
    60% { transform: translateX(8%); }
    70% { transform: translateX(-3%); }
    80% { transform: translateX(10%); opacity: 0.2; }
    90% { transform: translateX(-2%); }
}

@keyframes nosferatuEffectScratch {
    0% { transform: translateX(0); opacity: 0.5; }
    10% { transform: translateX(-1%); }
    20% { transform: translateX(1%); }
    30% { transform: translateX(-2%); }
    40% { transform: translateX(3%); }
    50% { transform: translateX(-3%); opacity: 0.35; }
    60% { transform: translateX(8%); }
    70% { transform: translateX(-3%); }
    80% { transform: translateX(10%); opacity: 0.2; }
    90% { transform: translateX(20%); }
    100% { transform: translateX(30%); opacity: 0; }
}

@keyframes nosferatuGrain {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-1%, -1%); }
    20% { transform: translate(1%, 1%); }
    30% { transform: translate(-2%, -2%); }
    40% { transform: translate(3%, 3%); }
    50% { transform: translate(-3%, -3%); }
    60% { transform: translate(4%, 4%); }
    70% { transform: translate(-4%, -4%); }
    80% { transform: translate(2%, 2%); }
    90% { transform: translate(-3%, -3%); }
}

/* Wiggle (Squigglevision) Effect */
@keyframes squigglevision {
  0% { filter: url("#squiggly-0"); }
  25% { filter: url("#squiggly-1"); }
  50% { filter: url("#squiggly-2"); }
  75% { filter: url("#squiggly-3"); }
  100% { filter: url("#squiggly-4"); }
}

.scene-overlay.overlay-wiggle {
    display: block;
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
}

/* Apply animation to images when wiggle is active */
.wiggle-active #scene-image,
.wiggle-active #scene-image-back,
#vignette-screen.wiggle-active::before {
    animation: squigglevision 0.3s infinite alternate;
}

/* For vignette screen - use pseudo-element to filter only the background */
#vignette-screen.wiggle-active::before {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    background-size: cover;
    background-position: center;
    z-index: 0;
    transform: translateZ(0); /* Hardware accel */
}
`;

export const initialGameData: GameData = {
    startScene: '',
    scenes: {},
    globalObjects: {},
    sceneOrder: [],
    defaultFailureMessage: '',
    gameHTML: gameHTML,
    gameCSS: gameCSS + OVERLAY_CSS,
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
    gameShowTrackersUI: true,
    gameShowSystemButton: true,
    fixedVerbs: [],
    consequenceTrackers: [],
    positiveEndingMusic: '',
    negativeEndingMusic: '',
    vignettes: []
};
