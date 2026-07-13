import { GameData } from '../types';
import DOMPurify from 'dompurify';


export const gameHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    __DOMPURIFY_SCRIPT__
    <title>__GAME_TITLE__</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    __FONT_STYLESHEET__
    <link rel="stylesheet" href="style.css">
</head>
<body class="__FRAME_CLASS__ __FONT_ADJUST_CLASS__ __MOBILE_BEHAVIOR_CLASS__ with-spacing">
    <audio id="scene-sound-effect" preload="auto"></audio>
    <audio id="bgm-audio" preload="auto" loop></audio>
    <div class="main-wrapper" id="main-wrapper">

        <!-- Gear System Option Button -->
        <button id="gear-system-button" class="gear-system-btn hidden" title="Menu Principal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>

        <!-- Menu Principal Screen -->
        <div id="start-screen" class="splash-screen hidden __START_SCREEN_ALIGN_CLASS__ __START_SCREEN_VALIGN_CLASS__" __START_SCREEN_BG_STYLE__>
             <div class="start-screen-overlay"></div>
             <div class="splash-content" style="z-index: 10;">
                 <div class="splash-text">
                     <h1 id="start-screen-title" class="__START_SCREEN_TITLE_HIDDEN_CLASS__">__START_SCREEN_TITLE__</h1>
                 </div>
                 <div class="splash-buttons start-screen-buttons">
                     <button id="start-continue-btn" class="ending-restart-button hidden">Continuar</button>
                     <button id="start-new-game-btn" class="ending-restart-button">Começar de novo</button>
                     <button id="start-saves-btn" class="ending-restart-button">Caminhos salvos</button>
                     <button id="start-options-btn" class="ending-restart-button">Opções</button>
                 </div>
                 <!-- Embedded Saves/Slots Container -->
                 <div id="start-screen-saves-container" class="splash-buttons start-screen-saves-container hidden" style="width: 100%; max-width: 350px; display: flex; flex-direction: column; gap: 15px; align-items: var(--splash-content-align-items);">
                     <button id="start-screen-saves-back-btn" class="ending-restart-button" style="margin-bottom: 5px; width: 100%;">&lt; Voltar</button>
                     <div id="start-screen-slots-list" class="slots-list start-screen-slots" style="display: flex; flex-direction: column; gap: 12px; width: 100%; align-items: var(--splash-content-align-items);"></div>
                 </div>
                 <!-- Embedded Options Container -->
                 <div id="start-screen-options-container" class="splash-buttons start-screen-options-container hidden" style="width: 100%; max-width: 350px; display: flex; flex-direction: column; gap: 15px; align-items: var(--splash-content-align-items);">
                      <button id="start-screen-options-back-btn" class="ending-restart-button" style="margin-bottom: 5px; width: 100%;">&lt; Voltar</button>
                      <div class="start-screen-options-list" style="display: flex; flex-direction: column; gap: 18px; width: 100%; padding: 10px 0; box-sizing: border-box; align-items: var(--splash-content-align-items);">
                           <div class="option-slider-wrapper" style="display: flex; flex-direction: column; gap: 6px; width: 100%; text-align: var(--splash-text-align);">
                               <span style="font-family: var(--font-family); font-size: 1.1em; font-weight: bold; color: var(--text-color); text-align: var(--splash-text-align); width: 100%; display: block;">Volume da Música</span>
                               <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                                   <input type="range" id="start-square-volume" min="0" max="100" value="100" class="start-square-slider" style="flex: 1;">
                                   <span id="start-square-volume-val" style="font-family: var(--font-family); font-size: 1.1em; font-weight: bold; min-width: 120px; display: inline-block; text-align: right; color: var(--text-color);">100%</span>
                               </div>
                           </div>
                           <div class="option-slider-wrapper" style="display: flex; flex-direction: column; gap: 6px; width: 100%; text-align: var(--splash-text-align);">
                               <span style="font-family: var(--font-family); font-size: 1.1em; font-weight: bold; color: var(--text-color); text-align: var(--splash-text-align); width: 100%; display: block;">Velocidade do Texto</span>
                               <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                                   <input type="range" id="start-square-text-speed" min="1" max="4" value="3" class="start-square-slider" style="flex: 1;">
                                   <span id="start-square-text-speed-val" style="font-family: var(--font-family); font-size: 1.1em; font-weight: bold; min-width: 120px; display: inline-block; text-align: right; color: var(--text-color);">Normal</span>
                               </div>
                           </div>
                           <div class="option-slider-wrapper" style="display: flex; flex-direction: column; gap: 6px; width: 100%; text-align: var(--splash-text-align);">
                               <span style="font-family: var(--font-family); font-size: 1.1em; font-weight: bold; color: var(--text-color); text-align: var(--splash-text-align); width: 100%; display: block;">Velocidade da Imagem</span>
                               <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                                   <input type="range" id="start-square-image-speed" min="1" max="4" value="3" class="start-square-slider" style="flex: 1;">
                                   <span id="start-square-image-speed-val" style="font-family: var(--font-family); font-size: 1.1em; font-weight: bold; min-width: 120px; display: inline-block; text-align: right; color: var(--text-color);">Normal</span>
                               </div>
                           </div>
                      </div>
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

        <div class="game-container __LAYOUT_ORIENTATION_CLASS__ __LAYOUT_ORDER_CLASS__ hidden" id="game-container">
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
                        __SUGGESTIONS_BUTTON__
                        __INVENTORY_BUTTON__
                        __DIARY_BUTTON__
                        __TRACKERS_BUTTON__
                        __SYSTEM_BUTTON__
                    </div>
                    <div class="input-area">
                        <div id="verb-input" contenteditable="true" role="textbox" aria-multiline="false"></div>
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
            <div class="diary-footer">
                <button id="export-pdf-button" class="diary-export-button">Exportar</button>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js" onload="console.log('✅ html2pdf.js carregado')" onerror="console.error('❌ Falha ao carregar html2pdf.js do CDN')"></script>
    
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

    <!-- Settings Modal -->
    <div id="settings-modal" class="modal-overlay hidden">
        <div class="modal-content system-modal-content">
            <button class="modal-close-button">&times;</button>
            <h2 style="margin-top: 0; font-size: 1.3em; color: var(--accent-color); font-family: var(--font-family);">Opções</h2>
            
            <div class="settings-body" style="text-align: left; margin-top: 20px; display: flex; flex-direction: column; gap: 16px;">
                <div class="setting-item" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 0.9em; font-weight: bold; text-transform: uppercase; tracking-widest; color: var(--text-color); margin-bottom: 8px; font-family: var(--font-family); opacity: 0.8;">Volume da Música/Efeitos</label>
                    <input type="range" id="settings-volume-slider" min="0" max="100" value="50" style="width: 100%; accent-color: var(--primary-color); cursor: pointer;" />
                </div>
                
                <div class="setting-item" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 0.9em; font-weight: bold; text-transform: uppercase; tracking-widest; color: var(--text-color); margin-bottom: 8px; font-family: var(--font-family); opacity: 0.8;">Velocidade de Exibição do Texto</label>
                    <input type="range" id="settings-speed-slider" min="1" max="10" value="3" style="width: 100%; accent-color: var(--primary-color); cursor: pointer;" />
                </div>
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
    
    <!-- Acquisition Modal -->
    <div id="acquisition-modal" class="modal-overlay hidden">
        <div class="modal-content acquisition-modal-content">
            <button class="modal-close-button">&times;</button>
            <h2 id="acquisition-modal-title"></h2>
            <div class="acquisition-modal-body">
                <div id="acquisition-modal-image-container" class="acquisition-modal-image-container hidden">
                    <img id="acquisition-modal-image" src="" alt="Item Image">
                </div>
                <div id="acquisition-modal-text-container" class="acquisition-modal-text-container text-center">
                    <p id="acquisition-modal-description"></p>
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
:root { --bg-color: __GAME_BACKGROUND_COLOR__; --text-color: __GAME_TEXT_COLOR__; --panel-bg: color-mix(in srgb, var(--bg-color) 90%, var(--text-color) 10%); --input-bg: color-mix(in srgb, var(--bg-color) 80%, var(--text-color) 20%); --button-bg: color-mix(in srgb, var(--bg-color) 85%, var(--text-color) 15%); --button-hover-bg: color-mix(in srgb, var(--bg-color) 70%, var(--text-color) 30%); --border-color: color-mix(in srgb, var(--bg-color) 80%, var(--text-color) 20%); --text-dim-color: color-mix(in srgb, var(--text-color) 70%, transparent); --accent-color: __GAME_TITLE_COLOR__; --highlight-color: __GAME_FOCUS_COLOR__; --danger-color: #f85149; --danger-hover-bg: #da3633; --font-family: __FONT_FAMILY__; --font-size-base: __GAME_FONT_SIZE__; --font-size-adjust: __FONT_SIZE_ADJUST__; --scale-factor: 1; --font-size: calc(var(--font-size-base) * var(--font-size-adjust) * var(--scale-factor)); --splash-button-bg: __SPLASH_BUTTON_COLOR__; --splash-button-hover-bg: __SPLASH_BUTTON_HOVER_COLOR__; --splash-button-text-color: __SPLASH_BUTTON_TEXT_COLOR__; --action-button-bg: __ACTION_BUTTON_COLOR__; --action-button-text-color: __ACTION_BUTTON_TEXT_COLOR__; --action-button-hover-bg: __ACTION_BUTTON_HOVER_COLOR__; --system-button-bg: __SYSTEM_BUTTON_COLOR__; --system-button-text: __SYSTEM_BUTTON_TEXT_COLOR__; --system-button-border: __SYSTEM_BUTTON_BORDER_COLOR__; --system-button-hover-bg: __SYSTEM_BUTTON_HOVER_COLOR__; --system-button-hover-text: __SYSTEM_BUTTON_HOVER_TEXT_COLOR__; --splash-align-items: flex-end; --splash-justify-content: flex-end; --splash-text-align: right; --splash-content-align-items: flex-end; --scene-name-overlay-bg: __SCENE_NAME_OVERLAY_BG__; --scene-name-overlay-text-color: __SCENE_NAME_OVERLAY_TEXT_COLOR__; --tracker-bar-fill-color: var(--accent-color); --tracker-bar-bg-color: var(--input-bg); --continue-indicator-color: var(--highlight-color); --text-anim-speed: 0.05s; --image-anim-speed: 0.5s; }
body.is-demo { --scale-factor: 0.7; }
body.is-demo .splash-content { gap: calc(20px * var(--scale-factor)); }
body.is-demo .splash-logo { max-height: calc(150px * var(--scale-factor)); }
body.is-demo #splash-start-button, body.is-demo .ending-restart-button, body.is-demo #continue-button, body.is-demo #vignette-continue-button { padding: calc(8px * var(--scale-factor)) calc(16px * var(--scale-factor)); max-width: calc(350px * var(--scale-factor)); }
body.is-demo .action-buttons button { padding: calc(6px * var(--scale-factor)) calc(10px * var(--scale-factor)); }
body.is-demo .text-panel { padding: calc(30px * var(--scale-factor)); }
body.is-demo .diary-entry { padding: calc(20px * var(--scale-factor)); gap: calc(20px * var(--scale-factor)); }
body.is-demo .diary-entry img { width: calc(200px * var(--scale-factor)); height: calc(200px * var(--scale-factor)); }
body.is-demo .item-modal-image-container { width: calc(300px * var(--scale-factor)); min-width: calc(300px * var(--scale-factor)); height: calc(300px * var(--scale-factor)); }
* { box-sizing: border-box; }
button, input, select, textarea, .action-popup button, .action-popup-list button, .action-popup-row button, .action-popup-list p { border-radius: 0 !important; }
body { font-family: var(--font-family); font-size: var(--font-size); background-color: var(--bg-color); color: var(--text-color); margin: 0; height: 100vh; overflow: hidden; }
select { background-color: var(--button-bg); color: var(--text-color); border: 1px solid var(--border-color); }
option { background-color: var(--bg-color); color: var(--text-color); }
.main-wrapper { height: 100%; display: flex; flex-direction: column; overflow: hidden; position: relative; max-width: 1280px; margin: 0 auto; }
body.with-spacing .main-wrapper { height: 100%; }
.splash-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--bg-color); background-size: cover; background-position: center; z-index: 2000; padding: 0; display: flex; align-items: var(--splash-align-items); justify-content: var(--splash-justify-content); transition: opacity 1s ease-in-out; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; }
.splash-screen.fade-out { opacity: 0; pointer-events: none; }
.splash-screen.align-left { --splash-justify-content: flex-start; --splash-align-items: flex-start; --splash-text-align: left; --splash-content-align-items: flex-start; }
.splash-screen.align-center { --splash-justify-content: center; --splash-align-items: center; --splash-text-align: center; --splash-content-align-items: center; }
.splash-screen.align-right { --splash-justify-content: flex-end; --splash-align-items: flex-end; --splash-text-align: right; --splash-content-align-items: flex-end; }
.splash-content { text-align: var(--splash-text-align); display: flex; flex-direction: column; align-items: var(--splash-content-align-items); gap: 20px; width: 100%; padding: 5vh max(40px, 6vw); position: relative; }
.splash-logo { max-height: 150px; width: auto; margin-bottom: 20px; }
.splash-text h1 { font-size: 2.2em; color: var(--accent-color); margin: 0; text-shadow: none; line-height: 1.1; }
.splash-text p, .splash-text .description { font-size: 1em; margin-top: 10px; color: var(--text-color); max-width: 60ch; white-space: pre-wrap; line-height: 1.6; }

/* Vignette Scaling Classes (Relative to Base Font Size) */
.vignette-scale-sm h1 { font-size: 1.6em !important; }
.vignette-scale-sm p, .vignette-scale-sm .description { font-size: 0.85em !important; }
.vignette-scale-md h1 { font-size: 2.2em !important; }
.vignette-scale-md p, .vignette-scale-md .description { font-size: 1em !important; }
.vignette-scale-lg h1 { font-size: 3.2em !important; }
.vignette-scale-lg p, .vignette-scale-lg .description { font-size: 1.25em !important; }
.splash-buttons { display: flex; flex-direction: column; gap: 15px; width: 100%; align-items: var(--splash-content-align-items); }
#splash-start-button, .ending-restart-button, #continue-button, #vignette-continue-button { font-family: var(--font-family); height: 48px; display: flex; align-items: center; justify-content: center; padding: 0 24px; font-size: 1.1em; font-weight: bold; border: none; cursor: pointer; color: var(--splash-button-text-color); transition: all 0.2s ease-in-out; width: 100%; max-width: 350px; box-sizing: border-box; }
#splash-start-button, .ending-restart-button, #vignette-continue-button { background-color: var(--splash-button-bg); }
#continue-button { background-color: #1d4ed8; }
#splash-start-button:hover, .ending-restart-button:hover, #continue-button:hover { transform: translateY(-3px); box-shadow: 0 3px 0px rgba(0, 0, 0, 0.4); }
#splash-start-button:hover, .ending-restart-button:hover { background-color: var(--splash-button-hover-bg); }
#continue-button:hover { background-color: #2563eb; }
/* Vignette Credits */
.vignette-credits { position: absolute; top: 0; bottom: 0; width: 48%; padding: 5vh max(40px, 4vw); display: flex; align-items: flex-end; overflow: hidden; z-index: 50; pointer-events: none; }
.vignette-credits.credits-left { left: 0; }
.vignette-credits.credits-right { right: 0; }
.vignette-credits-text { font-size: 1em; color: var(--text-color); opacity: 1; white-space: pre-wrap; line-height: 1.6; width: 100%; }
.vignette-credits.credits-scroll { align-items: flex-end; }
.vignette-credits.credits-scroll .vignette-credits-text { animation: creditsScroll 30s linear forwards; }
@keyframes creditsScroll { 0% { transform: translateY(100%); } 100% { transform: translateY(-100%); } }
@media (max-width: 768px) {
  .splash-screen { flex-direction: column; justify-content: flex-start !important; align-items: flex-start !important; }
  .vignette-credits { position: relative; width: 100%; max-width: none; padding: 20px 20px 0 20px; top: auto; bottom: auto; left: auto; right: auto; align-items: flex-start; overflow: visible; flex-shrink: 0; }
  .vignette-credits.credits-left, .vignette-credits.credits-right { left: auto; right: auto; }
  .vignette-credits.credits-scroll .vignette-credits-text { animation: none; }
  .vignette-credits-text { font-size: 0.95em; max-height: 30vh; overflow-y: auto; text-align: left; }
  .splash-content { height: auto !important; flex-grow: 1; justify-content: flex-end; }
}
.chances-container { display: flex; align-items: center; gap: 8px; justify-content: flex-end; margin-bottom: 15px; }
.chance-icon { width: 24px; height: 24px; transition: all 0.3s ease; }
.chance-icon.lost { opacity: 0.5; }
.game-container { display: flex; flex-grow: 1; overflow: hidden; transition: opacity 1s ease-in-out; position: relative; z-index: 10; padding: 30px; }
.game-container.fade-out { opacity: 0; }
.image-panel { flex: 0 0 45%; max-width: 650px; border-right: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; background-color: var(--input-bg); position: relative; transition: padding 0.3s ease-in-out, background-color 0.3s ease-in-out; padding: 0; }
.image-container { width: 100%; height: 100%; position: relative; overflow: hidden; background-size: cover; background-position: center; transition: border 0.3s ease-in-out, outline 0.3s ease-in-out, box-shadow 0.3s ease-in-out; }
.scene-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
#scene-image-back { z-index: 1; }
#scene-image { z-index: 2; }
.scene-name-overlay { position: absolute; top: 20px; left: 20px; background-color: var(--scene-name-overlay-bg); color: var(--scene-name-overlay-text-color); border: 2px solid var(--border-color); border-radius: 0; font-size: 1em; font-weight: bold; z-index: 10; opacity: 1; transition: opacity 0.5s ease-in-out; pointer-events: none; text-align: left; padding: 6px 12px; box-sizing: border-box; }
.text-panel { flex: 1; display: flex; flex-direction: column; padding: 0 0 0 30px; position: relative; }
.game-container.layout-horizontal { flex-direction: column; }
.game-container.layout-horizontal .image-panel { flex-basis: 45%; max-width: none; width: 100%; border-right: none; border-bottom: 2px solid var(--border-color); }
.game-container.layout-horizontal .text-panel { padding: 30px 0 0 0; min-height: 0; }
.game-container.layout-image-last { flex-direction: row-reverse; }
.game-container.layout-image-last .image-panel { border-right: none; border-left: 2px solid var(--border-color); }
.game-container.layout-image-last .text-panel { padding: 0 30px 0 0; }
.game-container.layout-horizontal.layout-image-last { flex-direction: column-reverse; }
.game-container.layout-horizontal.layout-image-last .image-panel { border-left: none; border-bottom: none; border-top: 2px solid var(--border-color); }
.game-container.layout-horizontal.layout-image-last .text-panel { padding: 0 0 30px 0; }
.scene-description { flex-grow: 1; overflow-y: auto; white-space: pre-wrap; line-height: 1.6; padding-bottom: 20px; }
.scene-description.typewriting-active .highlight-word { cursor: default; }
.scene-description.typewriting-active .highlight-word:hover { filter: none; text-decoration: none; }
.verb-echo { color: var(--text-dim-color); font-style: italic; }
.highlight-item { color: var(--highlight-color); }
.highlight-word { color: var(--accent-color); cursor: pointer; transition: color 0.2s; }
.highlight-word:hover { filter: brightness(1.2); text-decoration: underline; }

/* Desktop Action Bar with Popup Inside - Removido fundo cinza do popup */
.action-bar { border-top: none; padding-top: 15px; margin-top: auto; flex-shrink: 0; display: flex; flex-direction: column; }
.action-popup { margin-bottom: 12px; background-color: transparent; border: none; padding: 0; }
.action-popup.hidden { display: none !important; }
.action-popup-container { display: flex; flex-direction: column; gap: 10px; }
.action-popup-row { display: flex; flex-wrap: wrap; gap: 6px; }
.action-popup-list button, .action-popup-row button, .action-popup-list p { display: inline-block; padding: 6px 10px; margin: 0; text-align: left; background-color: var(--button-bg); border: 1px solid var(--border-color); color: var(--highlight-color); font-family: var(--font-family); font-size: 1em; font-weight: bold; }
.action-popup-list button, .action-popup-row button { cursor: pointer; }
.action-popup-list button:hover, .action-popup-row button:hover { background-color: var(--border-color); }
.action-popup-list p { cursor: default; color: var(--text-dim-color); }

.action-buttons { display: flex; gap: 8px; margin-bottom: 12px; }
.action-buttons button { font-family: var(--font-family); padding: 8px 12px; border: 2px solid var(--system-button-border); background-color: var(--system-button-bg); color: var(--system-button-text); cursor: pointer; transition: all 0.2s; font-size: 1em; }
.action-buttons button:hover { background-color: var(--system-button-hover-bg); color: var(--system-button-hover-text, var(--system-button-text)); transform: translateY(-2px); }
.input-area { display: flex; gap: 8px; }
#verb-input { flex-grow: 1; padding: 12px 10px; border: 2px solid var(--border-color); background-color: var(--input-bg); color: var(--text-color); font-family: var(--font-family); font-size: 1em; }
#verb-input:focus { outline: none; border-color: var(--action-button-bg); }
#verb-input:disabled { background-color: var(--button-bg); cursor: not-allowed; }
#submit-verb { padding: 8px 16px; border: 2px solid var(--border-color); background-color: var(--action-button-bg); color: var(--action-button-text-color); font-family: var(--font-family); cursor: pointer; font-weight: bold; transition: background-color 0.2s; font-size: 1em; }
#submit-verb:hover { background-color: var(--action-button-hover-bg); filter: none; }
#submit-verb:disabled { background-color: var(--button-hover-bg); color: var(--text-dim-color); cursor: not-allowed; }
#submit-verb:disabled:hover { background-color: var(--button-hover-bg); }
.view-ending-button { width: 100%; padding: 12px; font-size: 1.1em; font-weight: bold; border: 2px solid var(--border-color); background-color: var(--action-button-bg); color: var(--action-button-text-color); font-family: var(--font-family); cursor: pointer; transition: all 0.2s; }
.view-ending-button:hover { filter: brightness(0.9); transform: translateY(-2px); }
.hidden { display: none !important; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 3000; }
.modal-content { background-color: var(--panel-bg); padding: 25px; border: 2px solid var(--border-color); position: relative; max-width: 600px; width: 90%; }
.modal-content h2 { margin-top: 0; font-size: 1.3em; color: var(--accent-color); font-family: var(--font-family); }
.modal-close-button { position: absolute; top: 10px; right: 15px; background: none; border: none; color: var(--text-dim-color); font-size: 2em; cursor: pointer; line-height: 1; }

.trackers-modal-content { max-height: 80vh; display: flex; flex-direction: column; }
#trackers-content { flex-grow: 1; overflow-y: auto; padding-right: 15px; margin-right: -15px; }
.diary-modal-content { max-width: 60vw; height: 80vh; display: flex; flex-direction: column; }
.diary-log { flex-grow: 1; overflow-y: auto; text-align: left; mask-image: linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent); -webkit-mask-image: linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent); }
.diary-entry { display: flex; gap: 40px; align-items: flex-start; padding: 24px 40px; border-bottom: 2px solid var(--border-color); }
.diary-entry:last-child { border-bottom: none; }
.diary-entry img { width: 300px; height: 300px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border-color); box-shadow: none; }
.diary-entry .text-container { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.diary-entry .scene-name { font-weight: bold; color: var(--accent-color); margin-bottom: 4px; display: block; font-size: 1.4em; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
.diary-entry p { margin: 0; white-space: pre-wrap; }
.diary-interactions-container { margin-top: 12px; display: flex; flex-direction: column; gap: 14px; }
.diary-input { color: var(--text-dim-color); font-style: italic; font-size: 0.9em; margin: 0; padding: 0 0 0 30px; border: none; }
.diary-output { color: var(--text-color); margin: 0; padding: 0; border: none; line-height: 1.6; font-size: 0.95em; }
.diary-footer { display: flex; justify-content: flex-end; padding: 15px 0 0 0; flex-shrink: 0; }
.diary-export-button { padding: 8px 16px; background-color: var(--system-button-bg); color: var(--system-button-text); border: 2px solid var(--system-button-border); cursor: pointer; font-family: var(--font-family); font-size: 0.9em; font-weight: bold; transition: all 0.2s; }
.diary-export-button:hover { background-color: var(--system-button-hover-bg); border-color: var(--accent-color); }
.diary-export-button:disabled { opacity: 0.6; cursor: not-allowed; }

/* Diary Stats Header */
.diary-stats-container { display: flex; gap: 40px; padding: 20px 40px; border-bottom: none; justify-content: center; }
.diary-stat-box { flex: 1; padding: 0; background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
.diary-stat-label { font-size: 1em; color: var(--text-color); }
.diary-stat-value { font-size: 1.4em; font-weight: bold; color: var(--accent-color); }
@media (max-width: 768px) { 
  .diary-modal-content { max-width: 85vw; }
  .diary-stats-container { padding: 15px; gap: 15px; flex-direction: column; } 
  .diary-stat-value { font-size: 1.25em; } 
}

.item-modal-content { max-width: 80vw; width: 90%; }
.item-modal-body { display: flex; flex-direction: row; gap: 30px; align-items: flex-start; }
@media (max-width: 768px) { .item-modal-body { flex-direction: column; align-items: center; } }
.item-modal-image-container { width: 300px; min-width: 300px; height: 300px; overflow: hidden; border: 2px solid var(--border-color); border-radius: 8px; background-color: var(--input-bg); }
@media (max-width: 768px) { .item-modal-image-container { width: 100%; min-width: 0; max-width: 300px; height: auto; aspect-ratio: 1; } }
.item-modal-image-container img { width: 100%; height: 100%; object-fit: cover; display: block; }
.item-modal-text-container { flex: 1; display: flex; flex-direction: column; gap: 12px; text-align: left; }
.item-modal-name { margin: 0; font-size: 1.3em; color: var(--accent-color); border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
#item-modal-description { color: var(--text-color); line-height: 1.6; font-size: 1em; }
.acquisition-modal-content { max-width: 600px; text-align: center; }
.acquisition-modal-body { display: flex; flex-direction: column; align-items: center; gap: 20px; width: 100%; }
.acquisition-modal-image-container { width: 500px; height: 500px; overflow: hidden; border: 2px solid var(--border-color); background-color: var(--input-bg); flex-shrink: 0; }
.acquisition-modal-image-container img { width: 100%; height: 100%; object-fit: cover; }
.acquisition-modal-text-container { width: 100%; padding-bottom: 10px; }
#acquisition-modal-description { color: var(--text-color); line-height: 1.6; font-size: 1em; margin: 0; }
.text-center { text-align: center; }

.system-modal-content { max-width: 400px; text-align: center; }
.system-menu { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
.system-menu button { width: 100%; padding: 15px; font-size: 1.1em; background-color: var(--system-button-bg); border: 2px solid var(--system-button-border); color: var(--system-button-text); cursor: pointer; transition: all 0.2s; font-family: var(--font-family); }
.system-menu button:hover { background-color: var(--system-button-hover-bg); border-color: var(--accent-color); transform: translateY(-2px); }
.system-menu button.danger-button { color: var(--danger-color); border-color: var(--danger-color); background-color: transparent; }
.system-menu button.danger-button:hover { background-color: var(--danger-hover-bg); color: #fff; border-color: var(--danger-hover-bg); }
.system-slots { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; text-align: left; }
.slot-item { font-family: var(--font-family); font-size: 1.1em; font-weight: bold; border: none; cursor: pointer; color: var(--splash-button-text-color) !important; background-color: var(--splash-button-bg) !important; transition: all 0.2s ease-in-out; width: 100%; max-width: 350px; height: 48px; display: flex; align-items: center; position: relative; padding: 0; margin: 0 auto; box-sizing: border-box; overflow: hidden; box-shadow: none; }
.slot-item:hover { transform: translateY(-3px); box-shadow: 0 3px 0px rgba(0, 0, 0, 0.4); background-color: var(--splash-button-hover-bg) !important; }
.slot-item.dashed-slot { border: 2px dashed var(--splash-button-bg) !important; background: transparent !important; color: var(--splash-button-text-color) !important; opacity: 0.75; }
.slot-item.dashed-slot:hover { border-style: dashed !important; border-color: var(--splash-button-hover-bg) !important; background-color: rgba(255, 255, 255, 0.05) !important; }
.slot-item.dashed-slot.disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
.slot-info { display: flex; flex-direction: column; justify-content: center; height: 100%; width: 100%; box-sizing: border-box; pointer-events: none; padding: 0 24px; }
.slot-title { font-size: 1em; font-weight: bold; color: inherit; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }
.slot-meta { font-size: 0.75em; font-weight: normal; color: inherit; opacity: 0.7; margin-top: 2px; }
.slot-empty { font-size: 1em; font-weight: normal; color: inherit; opacity: 0.5; }
.slot-actions { display: flex; gap: 10px; align-items: center; }
.slot-delete-btn { position: absolute; right: 0; top: 0; bottom: 0; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background-color: #f85149 !important; border: none; border-radius: 0 !important; color: #fff !important; cursor: pointer; z-index: 10; transform: translateX(101%); transition: transform 0.2s ease-in-out, background-color 0.2s; padding: 0; pointer-events: auto; }
.slot-item:hover .slot-delete-btn { transform: translateX(0); }
.slot-delete-btn:hover { background-color: #da3633 !important; }

/* Custom Square Slider track & thumb styling */
.start-square-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; background: color-mix(in srgb, var(--text-color) 45%, transparent); outline: none; margin: 12px 0; padding: 0; box-sizing: border-box; border-radius: 0 !important; cursor: pointer; }
.start-square-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: var(--highlight-color, var(--splash-button-hover-bg)); cursor: pointer; border: none; border-radius: 0 !important; margin-top: -6px; transition: background 0.2s, opacity 0.2s; }
.start-square-slider::-webkit-slider-thumb:hover { opacity: 0.85; }
.start-square-slider::-moz-range-thumb { width: 16px; height: 16px; background: var(--highlight-color, var(--splash-button-hover-bg)); cursor: pointer; border: none; border-radius: 0 !important; transition: background 0.2s, opacity 0.2s; }
.start-square-slider::-moz-range-thumb:hover { opacity: 0.85; }
.start-square-slider::-moz-range-track { background: color-mix(in srgb, var(--text-color) 45%, transparent); height: 4px; border: none; border-radius: 0 !important; }
#btn-back-system { width: auto; padding: 10px 20px; align-self: center; margin-top: 10px; background-color: var(--system-button-bg); border: 2px solid var(--system-button-border); color: var(--system-button-text); cursor: pointer; font-family: var(--font-family); font-size: 0.9em; transition: all 0.2s; }
#btn-back-system:hover { background-color: var(--system-button-hover-bg); transform: translateY(-2px); }

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
        width: 100vw; height: 55vh;
        z-index: 1;
        max-width: none;
        border: none !important;
        padding: 0 !important;
        background: black;
        overflow: hidden;
        mask-image: linear-gradient(to bottom, black 60%, transparent 100%) !important;
        -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%) !important;
    }
    body.behavior-immersive .image-container, 
    body.behavior-immersive .scene-image {
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: center center !important;
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
        background: linear-gradient(to top, rgba(0,0,0,0.98) 75%, transparent 100%) !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-end !important;
        padding: 100px 15px 10px 15px !important; 
        max-height: 50vh !important; 
        min-height: 30vh !important; 
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
        padding: 10px 0 !important; 
        width: 100% !important; 
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
        background-color: var(--system-button-bg) !important; 
        border: 2px solid var(--system-button-border) !important;
        color: var(--system-button-text) !important;
        backdrop-filter: none !important;
        border-radius: 0 !important;
        transition: all 0.2s !important;
    }
    body.behavior-immersive .action-buttons button:hover,
    body.behavior-immersive .action-buttons button:active {
        background-color: var(--system-button-hover-bg) !important;
        color: var(--system-button-hover-text, var(--system-button-text)) !important;
        border-color: var(--system-button-hover-bg) !important;
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
        justify-content: flex-start !important;
        align-items: flex-start !important;
        text-align: left !important;
    }
    body.behavior-immersive .action-popup button {
        background-color: var(--button-bg) !important; 
        border: 1px solid var(--border-color) !important;
        backdrop-filter: none !important;
        width: auto !important;
        flex: 0 1 auto !important;
        display: inline-block !important;
        padding: 6px 10px !important; 
        border-radius: 0 !important;
        pointer-events: auto !important;
        font-size: 0.85em !important;
        font-weight: bold !important;
        margin-bottom: 2px !important;
        line-height: 1.2 !important;
        color: var(--highlight-color) !important;
        transition: all 0.2s !important;
    }
    body.behavior-immersive .action-popup button:hover,
    body.behavior-immersive .action-popup button:active {
        background-color: var(--border-color) !important;
        color: var(--highlight-color) !important;
        border-color: var(--border-color) !important;
    }
    body.behavior-immersive .action-popup-list p {
        background: rgba(0,0,0,0.98) !important; 
        color: var(--text-dim-color) !important;
        padding: 12px !important;
        border-radius: 0 !important;
        font-size: 0.85em !important;
        width: 100% !important;
        text-align: left !important;
    }
    body.behavior-immersive .empty-inventory-msg {
        background: transparent !important;
        border: none !important;
        padding: 10px 0 !important;
        margin: 0 !important;
        width: 100% !important;
        text-align: left !important;
        color: var(--text-dim-color) !important;
        font-style: italic !important;
    }
    body.behavior-immersive .input-area {
        gap: 6px;
        width: 100%;
    }
    body.behavior-immersive #verb-input {
        display: block !important;
        padding: 0 12px !important;
        height: 40px !important;
        line-height: 36px !important;
        background: rgba(0,0,0,0.3) !important;
        border: 2px solid rgba(255,255,255,0.2) !important;
        color: var(--text-color, white) !important;
        box-sizing: border-box !important;
        backdrop-filter: none !important;
        transition: all 0.2s !important;
    }
    body.behavior-immersive #verb-input:empty::before {
        line-height: 36px !important;
    }
    body.behavior-immersive #verb-input:focus,
    body.behavior-immersive #verb-input:active {
        outline: none !important;
        border-color: var(--action-button-bg, #4fd1c5) !important;
        background: rgba(0,0,0,0.4) !important;
    }
    body.behavior-immersive #submit-verb {
        padding: 0 12px !important;
        height: 40px !important;
        line-height: 36px !important;
        background-color: var(--action-button-bg) !important;
        color: var(--action-button-text-color) !important;
        border: 2px solid var(--border-color) !important;
        white-space: nowrap !important;
        transition: all 0.2s !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    body.behavior-immersive #submit-verb:hover,
    body.behavior-immersive #submit-verb:active,
    body.behavior-immersive #submit-verb:focus {
        background-color: var(--action-button-hover-bg) !important;
        border-color: var(--border-color) !important;
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
    body.behavior-immersive #diary-modal {
        background-color: var(--bg-color) !important;
    }
    body.behavior-immersive #diary-modal .diary-modal-content {
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
        border: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
        padding: 15px 15px 15px 15px !important;
        background-color: var(--bg-color) !important;
        display: flex !important;
        flex-direction: column !important;
        box-shadow: none !important;
    }
    body.behavior-immersive #diary-modal h2 {
        margin: 0 !important;
        height: 2.2em !important;
        display: flex !important;
        align-items: center !important;
    }
    body.behavior-immersive #diary-modal .modal-close-button {
        top: 15px !important;
        right: 15px !important;
        font-size: 2.2em !important;
        z-index: 1000 !important;
        color: var(--text-color) !important;
    }
    body.behavior-immersive #diary-modal .diary-log {
        padding-bottom: 60px !important;
        mask-image: linear-gradient(to bottom, transparent, black 15px, black calc(100% - 40px), transparent) !important;
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 15px, black calc(100% - 40px), transparent) !important;
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
    body.behavior-immersive #verb-input,
    body.behavior-immersive .action-popup button,
    body.behavior-immersive .action-popup p,
    body.behavior-immersive .empty-inventory-msg,
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
.trans-slide-out { animation: slideLeftOut var(--image-anim-speed) forwards; }
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
.tracker-item-name { font-size: 1em; color: var(--text-dim-color); }
.tracker-item-values { font-size: 1em; font-family: monospace; color: var(--text-color); }
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
        padding: 0 !important;
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
    /* No padding horizontal separator for full-bleed */
    body.frame-none .text-panel {
        padding: 30px !important;
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
.chance-icon svg { width: 24px; height: 24px; display: block; }
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
  width: 1000%;
  z-index: 2;
  top: 0;
  left: 0;
}
.fog-img-first {
  background: url("https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-1.png");
  background-repeat: repeat-x;
  background-size: var(--fog-width-1, cover) var(--fog-height-1, auto);
  background-position: center;
  filter: brightness(2.5) contrast(1.2);
  opacity: 1;
  animation: marquee-first 13.3s linear infinite;
}
.fog-img-second {
  background: url("https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-2.png");
  background-repeat: repeat-x;
  background-size: var(--fog-width-2, cover) var(--fog-height-2, auto);
  background-position: center;
  filter: brightness(2.5) contrast(1.2);
  opacity: 1;
  animation: marquee-second 6.65s linear infinite;
}
@keyframes marquee-first {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(calc(-1 * var(--fog-width-1, 100%)), 0, 0); }
}
@keyframes marquee-second {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(calc(-1 * var(--fog-width-2, 100%)), 0, 0); }
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

/* SYSTEM MENU & GEAR BUTTON */
.gear-system-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--system-button-border);
    background-color: var(--system-button-bg);
    color: var(--system-button-text);
    cursor: pointer;
    z-index: 1500;
    transition: all 0.2s ease-in-out;
    outline: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.gear-system-btn svg {
    transition: transform 0.3s ease;
}
.gear-system-btn:hover {
    background-color: var(--system-button-hover-bg);
    color: var(--system-button-hover-text, var(--system-button-text));
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
}
.gear-system-btn:hover svg {
    transform: rotate(45deg);
}
.gear-system-btn:active {
    transform: translateY(0);
}

/* Transições do Menu Principal e Painel de Jogo */
.menu-trans-fade-in {
    animation: menuFadeIn var(--menu-anim-speed, 0.3s) cubic-bezier(0.4, 0, 0.2, 1) both;
}
.menu-trans-fade-out {
    animation: menuFadeOut var(--menu-anim-speed, 0.3s) cubic-bezier(0.4, 0, 0.2, 1) both;
}
.menu-trans-slide-in {
    animation: menuSlideIn var(--menu-anim-speed, 0.3s) cubic-bezier(0.4, 0, 0.2, 1) both;
}
.menu-trans-slide-out {
    animation: menuSlideOut var(--menu-anim-speed, 0.3s) cubic-bezier(0.4, 0, 0.2, 1) both;
}

.game-trans-slide-in {
    animation: gameSlideIn var(--menu-anim-speed, 0.3s) cubic-bezier(0.4, 0, 0.2, 1) both;
}
.game-trans-slide-out {
    animation: gameSlideOut var(--menu-anim-speed, 0.3s) cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes menuFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes menuFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}
@keyframes menuSlideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}
@keyframes menuSlideOut {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
}
@keyframes gameSlideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}
@keyframes gameSlideOut {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
}

.start-screen-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%);
    z-index: 1;
}

.start-screen-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 220px;
    z-index: 10;
}

.start-screen-buttons button, #start-screen-saves-back-btn, #start-screen-options-back-btn {
    font-family: var(--font-family);
    padding: 12px 24px;
    border: 2px solid var(--system-button-border) !important;
    background-color: var(--system-button-bg) !important;
    color: var(--system-button-text) !important;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-size: 1em;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    outline: none;
}

.start-screen-buttons button:hover, #start-screen-saves-back-btn:hover, #start-screen-options-back-btn:hover {
    background-color: var(--system-button-hover-bg) !important;
    color: var(--system-button-hover-text, var(--system-button-text)) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.start-screen-buttons button:active, #start-screen-saves-back-btn:active, #start-screen-options-back-btn:active {
    transform: translateY(0);
}

/* Adjustments for immersive mobile behavior and top-right positioning */
@media (max-width: 768px) {
    .gear-system-btn {
        top: 10px;
        right: 10px;
        width: 38px;
        height: 38px;
    }
}

/* Ensure Main Menu start screen is always stacked on top of other splash screens for correct visual transitions */
#start-screen {
    z-index: 9999 !important;
}

/* Vertical Alignment for Splash Screens */
.splash-screen.align-v-center {
    align-items: center !important;
}
.splash-screen.align-v-center .splash-content {
    justify-content: center !important;
}

.splash-screen.align-v-bottom {
    align-items: flex-end !important;
}
.splash-screen.align-v-bottom .splash-content {
    justify-content: flex-end !important;
}
`;

export const initialGameData: GameData = {
    startScene: 'SCN_OPENING',
    scenes: {
        'SCN_OPENING': {
            id: 'SCN_OPENING',
            name: 'Abertura',
            description: 'Descrição da nova vinheta.',
            image: '',
            interactions: [],
            objectIds: [],
            vignetteType: 'opening',
            vignetteButtonText: 'COMEÇAR',
            mapX: 0,
            mapY: 0
        }
    },
    globalObjects: {},
    sceneOrder: ['SCN_OPENING'],
    defaultFailureMessage: '',
    gameHTML: gameHTML,
    gameCSS: gameCSS + OVERLAY_CSS,
    gameTitle: 'Minha Aventura de Texto',
    gameSystemEnabled: 'none',
    enableTrackers: false,
    enableInventory: true,
    enableSuggestions: true,
    enableDiary: true,
    enableFixedVerbs: false,
    enableChances: false,
    gameTextReadingFlow: 'paused',
    gameInteractionType: 'parser',
    gameBackgroundColor: '#0d1117',
    gameTextColor: '#c9d1d9',
    gameTitleColor: '#58a6ff',
    gameFocusColor: '#58a6ff',
    gameFrameColor: '#ffffff',

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
    gameImageSpeed: 0.5,
    gameFontSize: '12',
    gameShowTrackersUI: true,
    gameShowSystemButton: true,
    enableSystemMenu: false,
    startScreenBgImage: '',
    showStartScreenTitle: true,
    startScreenTitle: '',
    startScreenButtonAlignment: 'center',
    startScreenVerticalAlignment: 'center',
    gameMenuTransitionType: 'fade',
    gameMenuTransitionSpeed: 500,
    gameMenuTransitionSound: '',
    fixedVerbs: [],
    consequenceTrackers: [],
    positiveEndingMusic: '',
    negativeEndingMusic: '',
    vignettes: [],
    gameSuggestionsEmptyFeedback: '',
    gameInventoryEmptyFeedback: '',
};



/**
 * Sanitizes all user-authored HTML text fields in an imported GameData object.
 * Runs DOMPurify on scene descriptions, interaction messages, and other rich-text
 * fields to prevent XSS payloads from entering the editor state via shared files.
 * Preserves all legitimate formatting (spans, bold, colors, etc.).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sanitizeGameDataContent = (data: any): any => {
    if (!data || typeof DOMPurify === 'undefined') return data;

    const purifyConfig = {
        ADD_ATTR: ['class', 'style', 'data-word'],
        ADD_TAGS: ['span'],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clean = (s: any): string => {
        if (typeof s !== 'string') return s;
        return DOMPurify.sanitize(s, purifyConfig);
    };

    const result = { ...data };

    // Sanitize top-level narrative text fields
    const topLevelFields = [
        'positiveEndingDescription', 'negativeEndingDescription',
        'gameSplashDescription', 'gameSplashTitle',
    ];
    topLevelFields.forEach(field => {
        if (result[field]) result[field] = clean(result[field]);
    });

    // Sanitize scenes
    if (result.scenes && typeof result.scenes === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cleanedScenes: any = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.entries(result.scenes).forEach(([id, scene]: [string, any]) => {
            const cleanedScene = { ...scene };
            cleanedScene.description = clean(scene.description);
            cleanedScene.name = clean(scene.name);
            if (cleanedScene.interactions) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cleanedScene.interactions = cleanedScene.interactions.map((inter: any) => ({
                    ...inter,
                    successMessage: clean(inter.successMessage),
                    failureMessage: clean(inter.failureMessage),
                    newSceneDescription: clean(inter.newSceneDescription),
                }));
            }
            cleanedScenes[id] = cleanedScene;
        });
        result.scenes = cleanedScenes;
    }

    // Sanitize global objects
    if (result.globalObjects && typeof result.globalObjects === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cleanedObjects: any = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.entries(result.globalObjects).forEach(([id, obj]: [string, any]) => {
            cleanedObjects[id] = {
                ...obj,
                name: clean(obj.name),
                examineDescription: clean(obj.examineDescription),
            };
        });
        result.globalObjects = cleanedObjects;
    }

    return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sanitizeLegacyI18n = (data: any): any => {
    if (!data) return data;
    const d = { ...data };

    // Exact text strings that were hardcoded into Portuguese in legacy Projects
    const legacyMap: Record<string, string[]> = {
        gameSplashButtonText: ['COMEÇAR', 'INICIAR'],
        gameRestartButtonText: ['Reiniciar Aventura', 'Reiniciar'],
        gameContinueButtonText: ['Continuar', 'CONTINUAR'],
        gameSystemButtonText: ['Sistema', 'SISTEMA'],
        gameActionButtonText: ['Ação', 'Açao', 'AÇÃO', 'Action'],
        gameVerbInputPlaceholder: ['O que você faz?', 'o que voce faz?'],
        gameDiaryPlayerName: ['Jogador'],
        gameMainMenuButtonText: ['Menu Principal'],
        gameViewEndingButtonText: ['Ver Final'],
        gameSaveMenuTitle: ['Salvar Jogo'],
        gameLoadMenuTitle: ['Carregar Jogo'],
        suggestionsButtonText: ['Sugestões', 'Sugestoes'],
        inventoryButtonText: ['Inventário', 'Inventario'],
        diaryButtonText: ['Diário', 'Diario'],
        trackersButtonText: ['Trackers', 'Rastreadores'],
        gameSuggestionsEmptyFeedback: ['Sem sugestões disponíveis.'],
        gameInventoryEmptyFeedback: ['Seu inventário está vazio.'],
    };


    Object.keys(legacyMap).forEach((key) => {
        const val = d[key];
        if (typeof val === 'string') {
            if (legacyMap[key].includes(val.trim())) {
                d[key] = ''; // clear it to allow i18n fallback to trigger
            }
        }
    });

    return d;
};
