import React, { useState, useRef } from 'react';
import { GameData, Scene } from '../types';
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
    const inventoryButton = document.getElementById('inventory-button');
    const actionPopup = document.getElementById('action-popup');

    // --- State Variables ---
    let gameData = null;
    let originalScenes = null;
    let allTakableObjects = {};
    let currentSceneParagraphs = [];
    let currentParagraphIndex = 0;
    const SAVE_KEY = 'textAdventureSaveData_preview';
    let currentState = {
        currentSceneId: null,
        inventory: [], // stores item IDs
        diaryLog: [],
        scenesState: {},
    };

    // --- Game Logic ---
    function saveState() {
        // In a full game, this would save progress. Not implemented for preview.
    }

    function loadState() {
        // In a full game, this would load progress. Not implemented for preview.
        return false;
    }

    function renderNextParagraph() {
        if (!sceneDescriptionElement || currentParagraphIndex >= currentSceneParagraphs.length) {
            // All paragraphs shown, enable input
            if (commandInputElement) commandInputElement.disabled = false;
            if (submitCommandButton) submitCommandButton.disabled = false;
            if (commandInputElement) commandInputElement.focus();
            return;
        }

        const paragraphText = currentSceneParagraphs[currentParagraphIndex];
        const p = document.createElement('p');
        p.textContent = paragraphText;
        sceneDescriptionElement.appendChild(p);
        sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;

        currentParagraphIndex++;

        if (currentParagraphIndex < currentSceneParagraphs.length) {
            const continueElem = document.createElement('p');
            continueElem.className = 'click-to-continue';
            continueElem.textContent = '[Clique para continuar]';
            sceneDescriptionElement.appendChild(continueElem);
            sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;

            const clickHandler = () => {
                continueElem.remove();
                renderNextParagraph();
            };

            continueElem.addEventListener('click', clickHandler, { once: true });
        } else {
            // This was the last paragraph, enable input
            if (commandInputElement) commandInputElement.disabled = false;
            if (submitCommandButton) submitCommandButton.disabled = false;
            if (commandInputElement) commandInputElement.focus();
        }
    }

    function changeScene(sceneId, command = null, transitionMessage = null) {
        const scene = currentState.scenesState[sceneId];
        if (!scene) {
            console.error('Error: Scene with ID "' + sceneId + '" not found.');
            if (sceneDescriptionElement) {
                sceneDescriptionElement.textContent = 'Error: Scene "' + sceneId + '" not found.';
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
            sceneDescriptionElement.innerHTML = ''; // Clear previous content

            if (command) {
                const echoP = document.createElement('p');
                echoP.className = 'command-echo';
                echoP.textContent = '> ' + command;
                sceneDescriptionElement.appendChild(echoP);
            }

            if (transitionMessage) {
                const transitionP = document.createElement('p');
                transitionP.textContent = transitionMessage;
                sceneDescriptionElement.appendChild(transitionP);
                sceneDescriptionElement.appendChild(document.createElement('br'));
            }
            
            const rawDescription = scene.description ? String(scene.description).trim() : '';
            currentSceneParagraphs = rawDescription.split('\\n').filter(p => p.trim() !== '');
            currentParagraphIndex = 0;
            
            // Disable input until description is fully displayed
            if (commandInputElement) commandInputElement.disabled = true;
            if (submitCommandButton) submitCommandButton.disabled = true;

            renderNextParagraph();
        }

        if (sceneSoundEffectElement && scene.soundEffect) {
            sceneSoundEffectElement.src = scene.soundEffect;
            sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
        }

        saveState();
    }
    
    function processCommand() {
        if (!commandInputElement || commandInputElement.disabled) return;
        const commandText = commandInputElement.value.trim();
        if (!commandText) return;
        const lowerCaseCommandText = commandText.toLowerCase();

        commandInputElement.value = '';

        const currentScene = currentState.scenesState[currentState.currentSceneId];
        if (!currentScene) return;

        // Echo the command
        const echoP = document.createElement('p');
        echoP.className = 'command-echo';
        echoP.textContent = '> ' + commandText;
        sceneDescriptionElement.appendChild(echoP);

        // Basic parser: verb + target
        const commandParts = lowerCaseCommandText.split(/\\s+/);
        const verb = commandParts[0];
        const target = commandParts.slice(1).join(' ');

        let interactionFound = false;

        // 1. Look for matching custom interactions
        if (currentScene.interactions) {
            for (const interaction of currentScene.interactions) {
                const verbMatch = interaction.verbs.includes(verb);
                const targetMatch = target.includes(interaction.target);

                if (verbMatch && targetMatch) {
                    let hasRequiredItem = true;
                    if (interaction.requiresInInventory) {
                        hasRequiredItem = currentState.inventory.includes(interaction.requiresInInventory);
                    }

                    if (hasRequiredItem) {
                        interactionFound = true;

                        // Process state changes first
                        if (interaction.consumesItem && interaction.requiresInInventory) {
                            currentState.inventory = currentState.inventory.filter(itemId => itemId !== interaction.requiresInInventory);
                        }
                        if (interaction.removesTargetFromScene) {
                            const sceneState = currentState.scenesState[currentState.currentSceneId];
                            if (sceneState.objetos) {
                                sceneState.objetos = sceneState.objetos.filter(obj => obj.name.toLowerCase() !== interaction.target);
                            }
                        }
                        if (interaction.newSceneDescription) {
                            currentState.scenesState[currentState.currentSceneId].description = interaction.newSceneDescription;
                        }
                        saveState();

                        // Then process navigation/display changes
                        if (interaction.goToScene) {
                            changeScene(interaction.goToScene, commandText, interaction.successMessage);
                            return; // Exit
                        }
                        if (interaction.newSceneDescription) {
                            changeScene(currentState.currentSceneId, commandText, interaction.successMessage);
                            return; // Exit
                        }
                        if (interaction.successMessage) {
                            const successP = document.createElement('p');
                            successP.textContent = interaction.successMessage;
                            sceneDescriptionElement.appendChild(successP);
                        }
                        break; // Stop after finding the first matching interaction
                    }
                }
            }
        }

        // 2. Built-in commands if no custom interaction found
        if (!interactionFound) {
            if (verb === 'olhar' || verb === 'examinar') {
                let itemFound = false;
                if (target) {
                    const object = currentScene.objetos.find(obj => target.includes(obj.name.toLowerCase()));
                    if (object) {
                        const examineP = document.createElement('p');
                        examineP.textContent = object.examineDescription;
                        sceneDescriptionElement.appendChild(examineP);
                        itemFound = true;
                    }
                }
                if (!itemFound && !target) {
                    changeScene(currentState.currentSceneId, commandText);
                    return;
                }
                interactionFound = itemFound;
            } else if (verb === 'pegar' || verb === 'apanhar' || verb === 'levar') {
                const object = currentScene.objetos.find(obj => target.includes(obj.name.toLowerCase()));
                if (object) {
                    interactionFound = true;
                    if (object.isTakable) {
                        currentState.inventory.push(object.id);
                        const sceneState = currentState.scenesState[currentState.currentSceneId];
                        sceneState.objetos = sceneState.objetos.filter(obj => obj.id !== object.id);
                        
                        const takeP = document.createElement('p');
                        takeP.textContent = \`Você pegou: \${object.name}.\`;
                        sceneDescriptionElement.appendChild(takeP);
                        saveState();
                    } else {
                        const cantTakeP = document.createElement('p');
                        cantTakeP.textContent = 'Você não pode pegar isso.';
                        sceneDescriptionElement.appendChild(cantTakeP);
                    }
                }
            }
        }

        // 3. If still no interaction found, show default failure message
        if (!interactionFound) {
            const failureP = document.createElement('p');
            failureP.textContent = gameData.mensagem_falha_padrao || "Isso não parece ter nenhum efeito.";
            sceneDescriptionElement.appendChild(failureP);
        }
        
        sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;
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
            
            allTakableObjects = {};
            Object.values(gameData.cenas).forEach(scene => {
                if (scene.objetos) {
                    scene.objetos.forEach(obj => {
                        if (obj.isTakable) {
                            allTakableObjects[obj.id] = obj;
                        }
                    });
                }
            });

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
                // localStorage.removeItem(SAVE_KEY); // Saving is disabled for preview
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

    if (inventoryButton) {
        inventoryButton.addEventListener('click', () => {
            if (actionPopup.classList.contains('hidden') || !actionPopup.dataset.content || actionPopup.dataset.content !== 'inventory') {
                actionPopup.innerHTML = '';
                actionPopup.dataset.content = 'inventory';

                const list = document.createElement('div');
                list.className = 'action-popup-list';

                if (currentState.inventory.length === 0) {
                    const p = document.createElement('p');
                    p.textContent = 'Seu inventário está vazio.';
                    list.appendChild(p);
                } else {
                    currentState.inventory.forEach(itemId => {
                        const item = allTakableObjects[itemId];
                        if (item) {
                            const p = document.createElement('p');
                            p.textContent = item.name;
                            list.appendChild(p);
                        }
                    });
                }
                actionPopup.appendChild(list);
                actionPopup.classList.remove('hidden');
            } else {
                actionPopup.classList.add('hidden');
                actionPopup.dataset.content = '';
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
    
    const splashBgStyle = data.gameSplashImage ? `style="background-image: url('${data.gameSplashImage}')"` : '';
    const splashTextStyle = `style="max-width: ${data.gameSplashTextWidth || '600px'}; height: ${data.gameSplashTextHeight || 'auto'};"`;
    const splashLogoTag = data.gameLogo ? `<img src="${data.gameLogo}" alt="Logo" class="splash-logo">` : '';
    const splashTitleTag = data.gameOmitSplashTitle ? '' : `<h1>${data.gameTitle || ''}</h1>`;
    
    html = html.replace('__SPLASH_BG_STYLE__', splashBgStyle);
    html = html.replace('__SPLASH_TEXT_STYLE__', splashTextStyle);
    html = html.replace('__SPLASH_LOGO_IMG_TAG__', splashLogoTag);
    html = html.replace('__SPLASH_TITLE_H1_TAG__', splashTitleTag);
    html = html.replace('__SPLASH_DESCRIPTION__', data.gameSplashDescription || '');
    html = html.replace('__SPLASH_BUTTON_TEXT__', data.gameSplashButtonText || 'Iniciar Aventura');

    const headerLogoTag = data.gameLogo ? `<img src="${data.gameLogo}" alt="Logo" class="game-logo">` : '';
    const headerTitleTag = data.gameHideTitle ? '' : `<h1>${data.gameTitle || ''}</h1>`;
    html = html.replace('__LOGO_IMG_TAG__', headerLogoTag);
    html = html.replace('__HEADER_TITLE_H1_TAG__', headerTitleTag);

    // --- Replace CSS Variables ---
    if (data.gameTextColor) css = css.replace(/--text-color: .*;/, `--text-color: ${data.gameTextColor};`);
    if (data.gameTitleColor) css = css.replace(/--accent-color: .*;/, `--accent-color: ${data.gameTitleColor};`);
    if (data.gameSplashContentAlignment) {
        const hAlign = data.gameSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end';
        const textAlign = data.gameSplashContentAlignment === 'left' ? 'left' : 'right';
        css = css.replace(/--splash-justify-content: .*;/, `--splash-justify-content: ${hAlign};`);
        css = css.replace(/--splash-text-align: .*;/, `--splash-text-align: ${textAlign};`);
        css = css.replace(/--splash-content-align-items: .*;/, `--splash-content-align-items: ${hAlign};`);
    }
    if (data.gameSplashButtonColor) css = css.replace(/--splash-button-bg: .*;/, `--splash-button-bg: ${data.gameSplashButtonColor};`);
    if (data.gameSplashButtonHoverColor) css = css.replace(/--splash-button-hover-bg: .*;/, `--splash-button-hover-bg: ${data.gameSplashButtonHoverColor};`);

    return { html, css };
};


const Header: React.FC<HeaderProps> = ({ gameData, onImportGame }) => {
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const prepareGameDataForExport = (data: GameData) => {
    // This is the "translation layer". It converts the editor's internal
    // English-keyed data model into the Portuguese-keyed format expected
    // by the game engine (game.js and data.json).
    const translatedScenes: { [id: string]: any } = {};
    for (const sceneId in data.scenes) {
        const scene = data.scenes[sceneId];
        translatedScenes[sceneId] = {
            ...scene,
            objetos: scene.objects // Rename 'objects' to 'objetos'
        };
        // @ts-ignore
        delete translatedScenes[sceneId].objects;
    }

    return {
        cena_inicial: data.startScene,
        cenas: translatedScenes,
        mensagem_falha_padrao: data.defaultFailureMessage,
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
      link.download = `${gameData.gameTitle?.replace(/\s+/g, '_')?.toLowerCase() || 'text-adventure'}.zip`;
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
            .replace('</head>', `<style>${processedCss}</style></head>`)
            .replace('</body>', `<script>window.embeddedGameData = ${JSON.stringify(exportData)};</script><script>${gameJS.replace(/<\/script>/g,'<\\/script>')}</script></body>`);


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
            // Basic validation for new (English) and old (Portuguese) formats
            if ((importedData.scenes && importedData.startScene) || (importedData.cenas && importedData.cena_inicial)) {
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

export default Header;