import React, { useState, useRef } from 'react';
import { GameData } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { EyeIcon } from './icons/EyeIcon';
import { DocumentArrowUpIcon } from './icons/DocumentArrowUpIcon';

const gameJS = `
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const sceneDescriptionElement = document.getElementById('scene-description');
    const sceneImageElement = document.getElementById('scene-image');
    const commandInputElement = document.getElementById('command-input');
    const sceneSoundEffectElement = document.getElementById('scene-sound-effect');
    const splashScreen = document.getElementById('splash-screen');
    const startButton = document.getElementById('splash-start-button');
    const restartButton = document.getElementById('restart-button');
    const submitCommandButton = document.getElementById('submit-command');

    // --- State Variables ---
    let gameData = null;
    let originalScenes = null;
    const SAVE_KEY = 'textAdventureSaveData';
    let currentState = {
        currentSceneId: null,
        inventory: [],
        diaryLog: [],
        scenesState: {},
    };

    // --- Game Logic (Preview Implementation) ---
    function saveState() {
        // In a full game, this would save progress. Not implemented for preview.
        // try {
        //     localStorage.setItem(SAVE_KEY, JSON.stringify(currentState));
        // } catch (e) {
        //     console.warn("Could not save game state.", e);
        // }
    }

    function loadState() {
        // In a full game, this would load progress. Not implemented for preview.
        // try {
        //     const savedState = localStorage.getItem(SAVE_KEY);
        //     if (savedState) {
        //         const parsedState = JSON.parse(savedState);
        //         // Basic validation
        //         if (parsedState.currentSceneId && parsedState.scenesState) {
        //             currentState = parsedState;
        //             return true;
        //         }
        //     }
        //     return false;
        // } catch (e) {
        //     console.warn("Could not load game state.", e);
        //     return false;
        // }
        return false;
    }

    function changeScene(sceneId, command = null) {
        const scene = currentState.scenesState[sceneId];
        if (!scene) {
            console.error(\`Error: Scene with ID "\${sceneId}" not found.\`);
            if (sceneDescriptionElement) {
                sceneDescriptionElement.textContent = \`Error: Scene "\${sceneId}" not found.\`;
            }
            return;
        }

        currentState.currentSceneId = sceneId;

        if (sceneImageElement && scene.image) {
            sceneImageElement.src = scene.image;
        } else if (sceneImageElement) {
            sceneImageElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // transparent pixel
        }
        
        if (sceneDescriptionElement) {
            // ULTIMATE FIX: Make description handling completely robust to prevent fatal TypeErrors.
            // Explicitly convert to string to handle any data type (null, undefined, number, etc.).
            const descText = String(scene.description || '');

            const descriptionHtml = descText
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\\n/g, '<br>'); // Correctly replace newline characters
                
            let html = \`<p>\${descriptionHtml}</p>\`;
            if (command) {
                // Sanitize command echo
                const sanitizedCommand = command.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                html = \`<p class="command-echo">&gt; \${sanitizedCommand}</p>\` + html;
            }
            sceneDescriptionElement.innerHTML = html;
        }

        if (sceneSoundEffectElement && scene.soundEffect) {
            sceneSoundEffectElement.src = scene.soundEffect;
            sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
        }

        saveState();
    }
    
    function processCommand() {
        if(!commandInputElement) return;
        const commandText = commandInputElement.value.trim().toLowerCase();
        if (!commandText) return;

        // Command processing is not implemented in this preview stub.
        alert(\`Command processing is not implemented in the preview. You typed: "\${commandText}"\`);
        commandInputElement.value = '';
    }

    // --- Initialization ---
    async function initGame(fromRestart = false) {
        try {
            if (window.embeddedGameData) {
                gameData = window.embeddedGameData;
            } else {
                const response = await fetch('data.json');
                if (!response.ok) throw new Error('Could not load game data file (data.json).');
                gameData = await response.json();
            }
            
            originalScenes = JSON.parse(JSON.stringify(gameData.cenas));
            
            if (!fromRestart && loadState()) {
                console.log("Game state loaded from save.");
                changeScene(currentState.currentSceneId); // Render loaded scene
            } else {
                console.log("Starting new game.");
                currentState.currentSceneId = gameData.cena_inicial;
                currentState.inventory = [];
                currentState.diaryLog = [];
                currentState.scenesState = JSON.parse(JSON.stringify(originalScenes));
                changeScene(currentState.currentSceneId); // Render initial scene
            }
            saveState();

        } catch (error) {
            console.error('Error initializing game:', error);
            if(sceneDescriptionElement) sceneDescriptionElement.innerHTML = '<p style="color:red;">Error loading game data. Check console for details.</p>';
        }
    }

    // --- Event Listeners & Startup ---
    const startGame = () => {
        if (splashScreen) {
            splashScreen.style.display = 'none';
        }
        initGame();
    };

    if (splashScreen && startButton) {
        startButton.addEventListener('click', startGame);
    } else {
        startGame(); // Start immediately if no splash screen
    }

    if(restartButton) {
        restartButton.addEventListener('click', () => {
            if (confirm('Tem certeza que quer reiniciar a aventura? Todo o progresso será perdido.')) {
                localStorage.removeItem(SAVE_KEY);
                initGame(true);
            }
        });
    }

    if(submitCommandButton) {
        submitCommandButton.addEventListener('click', processCommand);
    }

    if(commandInputElement) {
        commandInputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processCommand();
            }
        });
    }
});
`;

interface HeaderProps {
  gameData: GameData;
  onImportGame: (gameData: GameData) => void;
}

const getProcessedHtmlAndCss = (data: GameData) => {
    let html = data.gameHTML;
    let css = data.gameCSS;

    // --- Replace HTML Placeholders ---
    html = html.replace(/__GAME_TITLE__/g, data.gameTitle || 'Aventura de Texto');
    
    const splashBgStyle = data.gameSplashImage ? \`style="background-image: url('\${data.gameSplashImage}')"\` : '';
    const splashTextStyle = \`style="max-width: \${data.gameSplashTextWidth || '600px'}; height: \${data.gameSplashTextHeight || 'auto'};"\`;
    const splashLogoTag = data.gameLogo ? \`<img src="\${data.gameLogo}" alt="Logo" class="splash-logo">\` : '';
    const splashTitleTag = data.gameOmitSplashTitle ? '' : \`<h1>\${data.gameTitle || ''}</h1>\`;
    
    html = html.replace('__SPLASH_BG_STYLE__', splashBgStyle);
    html = html.replace('__SPLASH_TEXT_STYLE__', splashTextStyle);
    html = html.replace('__SPLASH_LOGO_IMG_TAG__', splashLogoTag);
    html = html.replace('__SPLASH_TITLE_H1_TAG__', splashTitleTag);
    html = html.replace('__SPLASH_DESCRIPTION__', data.gameSplashDescription || '');
    html = html.replace('__SPLASH_BUTTON_TEXT__', data.gameSplashButtonText || 'Iniciar Aventura');

    const headerLogoTag = data.gameLogo ? \`<img src="\${data.gameLogo}" alt="Logo" class="game-logo">\` : '';
    const headerTitleTag = data.gameHideTitle ? '' : \`<h1>\${data.gameTitle || ''}</h1>\`;
    html = html.replace('__LOGO_IMG_TAG__', headerLogoTag);
    html = html.replace('__HEADER_TITLE_H1_TAG__', headerTitleTag);

    // --- Replace CSS Variables ---
    if (data.gameTextColor) css = css.replace(/--text-color: .*;/, \`--text-color: \${data.gameTextColor};\`);
    if (data.gameTitleColor) css = css.replace(/--accent-color: .*;/, \`--accent-color: \${data.gameTitleColor};\`);
    if (data.gameSplashContentAlignment) {
        const hAlign = data.gameSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end';
        const textAlign = data.gameSplashContentAlignment === 'left' ? 'left' : 'right';
        css = css.replace(/--splash-justify-content: .*;/, \`--splash-justify-content: \${hAlign};\`);
        css = css.replace(/--splash-text-align: .*;/, \`--splash-text-align: \${textAlign};\`);
        css = css.replace(/--splash-content-align-items: .*;/, \`--splash-content-align-items: \${hAlign};\`);
    }
    if (data.gameSplashButtonColor) css = css.replace(/--splash-button-bg: .*;/, \`--splash-button-bg: \${data.gameSplashButtonColor};\`);
    if (data.gameSplashButtonHoverColor) css = css.replace(/--splash-button-hover-bg: .*;/, \`--splash-button-hover-bg: \${data.gameSplashButtonHoverColor};\`);

    return { html, css };
};


// FIX: Changed to a named export to resolve module resolution error.
export const Header: React.FC<HeaderProps> = ({ gameData, onImportGame }) => {
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const prepareGameDataForExport = (data: GameData) => {
    // The data model is now consistent, so we just select the fields the game engine needs.
    return {
        cena_inicial: data.cena_inicial,
        cenas: data.cenas,
        mensagem_falha_padrao: data.mensagem_falha_padrao,
    };
  };

  const handleExport = async () => {
    // @ts-ignore
    const JSZip = window.JSZip;
    setIsExporting(true);
    try {
      if (!JSZip) {
          alert('JSZip library is not loaded. Cannot export.');
          setIsExporting(false);
          return;
      }
      const zip = new JSZip();

      const { html: processedHtml, css: processedCss } = getProcessedHtmlAndCss(gameData);
      const exportHtml = processedHtml.replace('</body>', '    <script src="game.js"></script>\\n</body>');

      // HTML, CSS, and JS
      zip.file("index.html", exportHtml);
      zip.file("style.css", processedCss);
      zip.file("game.js", gameJS);

      // Game Data
      const exportData = prepareGameDataForExport(gameData);
      zip.file("data.json", JSON.stringify(exportData, null, 2));

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = \`\${gameData.gameTitle?.replace(/\s+/g, '_')?.toLowerCase() || 'text-adventure'}.zip\`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting game:", error);
      alert("An error occurred while exporting the game.");
    } finally {
      setIsExporting(false);
    }
  };
  
  const handlePreview = () => {
    try {
        const exportData = prepareGameDataForExport(gameData);
        const { html: processedHtml, css: processedCss } = getProcessedHtmlAndCss(gameData);

        const finalHtml = processedHtml
            .replace('</head>', \`<style>\${processedCss}</style></head>\`)
            .replace('</body>', \`<script>window.embeddedGameData = \${JSON.stringify(exportData)};</script><script>\${gameJS.replace(/<\/script>/g,'<\\/script>')}</script></body>\`);


        const previewWindow = window.open();
        if (previewWindow) {
            previewWindow.document.write(finalHtml);
            previewWindow.document.close();
        } else {
            alert("Could not open preview window. Please check your pop-up blocker.");
        }
    } catch (error) {
        console.error("Error creating preview:", error);
        alert("An error occurred while creating the preview.");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const importedData = JSON.parse(result);
            // Basic validation for new and old formats
            if ((importedData.cenas && importedData.cena_inicial) || (importedData.scenes && importedData.startScene)) {
              onImportGame(importedData);
            } else {
              alert("Invalid game data file. Missing scene data.");
            }
          }
        } catch (error) {
          console.error("Error importing game:", error);
          alert("Could not parse the game data file. Make sure it's a valid JSON file.");
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if(event.target) event.target.value = '';
  };

  return (
    <header className="flex-shrink-0 bg-brand-surface border-b border-brand-border flex items-center justify-between p-3">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-brand-text">IF Builder</h1>
      </div>
      <div className="flex items-center gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json,application/json" className="hidden" />
        <button
          onClick={handleImportClick}
          className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200"
        >
          <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
          Importar (.json)
        </button>
        <button
          onClick={handlePreview}
          className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200"
        >
          <EyeIcon className="w-5 h-5 mr-2" />
          Visualizar
        </button>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors duration-200 disabled:opacity-50"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          {isExporting ? 'Exportando...' : 'Exportar Jogo (.zip)'}
        </button>
      </div>
    </header>
  );
};