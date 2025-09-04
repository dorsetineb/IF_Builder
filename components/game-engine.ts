import { GameData } from '../types';

export const prepareGameDataForEngine = (data: GameData): object => {
    // This robustly translates the editor's data format (using 'objects')
    // to the game engine's format (using 'objetos').
    const translatedCenas = Object.entries(data.scenes).reduce((acc, [sceneId, scene]) => {
        const { objects, ...restOfScene } = scene;
        acc[sceneId] = {
            ...restOfScene,
            objetos: objects || []
        };
        return acc;
    }, {} as { [id: string]: any });

    return {
        cena_inicial: data.startScene,
        cenas: translatedCenas,
        mensagem_falha_padrao: data.defaultFailureMessage,
        nome_jogador_diario: data.gameDiaryPlayerName,
        gameEnableChances: data.gameEnableChances,
        gameMaxChances: data.gameMaxChances,
        gameChanceIcon: data.gameChanceIcon,
        gameChanceIconColor: data.gameChanceIconColor,
    };
};

export const gameJS = `
document.addEventListener('DOMContentLoaded', () => {
    // --- Icon SVGs ---
    const ICONS = {
        heart: '<svg fill="%COLOR%" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="%COLOR%" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: '<svg stroke="%COLOR%" stroke-width="3" stroke-linecap="round" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>'
    };
    
    const ICONS_OUTLINE = {
        heart: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: ICONS.cross // Cross is already an outline
    };

    // --- DOM Elements ---
    const sceneDescriptionElement = document.getElementById('scene-description');
    const sceneImageElement = document.getElementById('scene-image');
    const commandInputElement = document.getElementById('command-input');
    const sceneSoundEffectElement = document.getElementById('scene-sound-effect');
    const transitionOverlay = document.getElementById('transition-overlay');
    const splashScreen = document.getElementById('splash-screen');
    const startButton = document.getElementById('splash-start-button');
    const restartButton = document.getElementById('restart-button');
    const submitCommandButton = document.getElementById('submit-command');
    const inventoryButton = document.getElementById('inventory-button');
    const suggestionsButton = document.getElementById('suggestions-button');
    const diaryButton = document.getElementById('diary-button');
    const actionPopup = document.getElementById('action-popup');
    const diaryModal = document.getElementById('diary-modal');
    const diaryLogElement = document.getElementById('diary-log');
    const diaryModalCloseButton = diaryModal ? diaryModal.querySelector('.modal-close-button') : null;


    // --- State Variables ---
    let gameData = null;
    let originalScenes = null;
    let allTakableObjects = {};
    let currentSceneParagraphs = [];
    let currentParagraphIndex = 0;
    const SAVE_KEY = 'textAdventureSaveData_preview';
    let currentState = {
        currentSceneId: null,
        previousSceneId: null,
        inventory: [], // stores item IDs
        diaryLog: [], // Array of {type: 'scene_load' | 'action', data: {...}}
        scenesState: {},
        chances: null,
    };

    // --- Game Logic ---
    function saveState() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(currentState));
        } catch (e) {
            console.warn("Could not save game state to localStorage:", e);
        }
    }

    function loadState() {
        try {
            const savedData = localStorage.getItem(SAVE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // Basic validation to ensure it's not totally broken
                if (parsedData.currentSceneId && parsedData.scenesState) {
                    currentState = parsedData;
                    return true;
                }
            }
        } catch (e) {
            console.warn("Could not load game state from localStorage:", e);
            localStorage.removeItem(SAVE_KEY);
        }
        return false;
    }
    
    function renderChances() {
        if (!gameData.gameEnableChances) return;
        const container = document.getElementById('chances-container');
        if (!container) return;
        container.innerHTML = '';
        
        const iconType = gameData.gameChanceIcon || 'heart';
        const activeColor = gameData.gameChanceIconColor || '#ff4d4d';
        const lostColor = '#4a5568';

        for (let i = 1; i <= gameData.gameMaxChances; i++) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'chance-icon';
            const isLost = i > currentState.chances;
            
            let iconSvg;
            let color;

            if (isLost) {
                iconWrapper.classList.add('lost');
                iconSvg = ICONS_OUTLINE[iconType] || ICONS_OUTLINE.heart;
                color = lostColor;
            } else {
                iconSvg = ICONS[iconType] || ICONS.heart;
                color = activeColor;
            }
            
            iconWrapper.innerHTML = iconSvg.replace(/%COLOR%/g, color);
            container.appendChild(iconWrapper);
        }
    }

    function renderNextParagraph() {
        const scene = currentState.scenesState[currentState.currentSceneId];

        if (!sceneDescriptionElement || currentParagraphIndex >= currentSceneParagraphs.length) {
            if (scene.isEndingScene) {
                const gameOverP = document.createElement('p');
                gameOverP.style.fontWeight = 'bold';
                gameOverP.style.marginTop = '20px';
                gameOverP.style.color = 'var(--accent-color, #58a6ff)';
                gameOverP.textContent = 'FIM DE JOGO';
                sceneDescriptionElement.appendChild(gameOverP);
                sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;

                if (commandInputElement) commandInputElement.disabled = true;
                if (submitCommandButton) submitCommandButton.disabled = true;
                
                const actionButtons = document.querySelector('.action-buttons');
                const inputArea = document.querySelector('.input-area');
                if (actionButtons) actionButtons.style.display = 'none';
                if (inputArea) inputArea.style.display = 'none';
                if(actionPopup) actionPopup.classList.add('hidden');

                if (!currentState.diaryLog.find(e => e.type === 'action' && e.data.response === '[FIM DE JOGO]')) {
                    currentState.diaryLog.push({ type: 'action', data: { command: '', response: '[FIM DE JOGO]', sceneId: currentState.currentSceneId } });
                    saveState();
                }

            } else {
                if (commandInputElement) commandInputElement.disabled = false;
                if (submitCommandButton) submitCommandButton.disabled = false;
                if (commandInputElement) commandInputElement.focus();
            }
            return;
        }

        const paragraphText = currentSceneParagraphs[currentParagraphIndex];
        const p = document.createElement('p');
        p.innerHTML = paragraphText.replace(/\\*\\*(.*?)\\*\\*/g, '<span class="highlight-item">$1</span>');
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
            renderNextParagraph();
        }
    }

    function changeScene(sceneId, isStateLoad = false) {
        const scene = currentState.scenesState[sceneId];
        if (!scene) {
            console.error('Error: Scene with ID "' + sceneId + '" not found.');
            if (sceneDescriptionElement) {
                sceneDescriptionElement.textContent = 'Error: Scene "' + sceneId + '" not found.';
            }
            return;
        }

        if (!isStateLoad && currentState.currentSceneId !== sceneId) {
            currentState.previousSceneId = currentState.currentSceneId;
        }

        currentState.currentSceneId = sceneId;
        const rawDescription = scene.description ? String(scene.description).trim() : '';
        currentSceneParagraphs = rawDescription.split('\\n').filter(p => p.trim() !== '');
        currentParagraphIndex = 0;

        if (!isStateLoad) {
            currentState.diaryLog.push({
                type: 'scene_load',
                data: {
                    id: scene.id,
                    name: scene.name,
                    image: scene.image,
                    description: rawDescription,
                }
            });
        }
        
        if (sceneImageElement && scene.image) {
            sceneImageElement.src = scene.image;
        } else if (sceneImageElement) {
            sceneImageElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // transparent pixel
        }
        
        if (sceneDescriptionElement) {
            sceneDescriptionElement.innerHTML = ''; // Clear previous content
            
            if (commandInputElement) commandInputElement.disabled = true;
            if (submitCommandButton) submitCommandButton.disabled = true;

            renderNextParagraph();
        }

        if (!isStateLoad) {
            saveState();
        }
    }

    function performSceneChange(sceneId, soundEffectUrl) {
        if (!transitionOverlay) {
            // Fallback for older HTML or if element is missing
            if (soundEffectUrl && sceneSoundEffectElement) {
                sceneSoundEffectElement.src = soundEffectUrl;
                sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
            }
            changeScene(sceneId);
            return;
        }

        // Play sound as fade-out starts
        if (soundEffectUrl && sceneSoundEffectElement) {
            sceneSoundEffectElement.src = soundEffectUrl;
            sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
        }
        
        transitionOverlay.classList.add('active');

        const transitionHandler = () => {
            transitionOverlay.removeEventListener('transitionend', transitionHandler);
            
            changeScene(sceneId);
            
            // Use requestAnimationFrame to ensure DOM has updated before fading back in
            requestAnimationFrame(() => {
                transitionOverlay.classList.remove('active');
            });
        };
        transitionOverlay.addEventListener('transitionend', transitionHandler, { once: true });
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
        let responseText = '';

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
                        if (interaction.refillsChances && gameData.gameEnableChances) {
                            currentState.chances = gameData.gameMaxChances;
                            renderChances(); // Update the UI
                        }
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
                        
                        // Then process navigation/display changes
                        if (interaction.goToScene) {
                            const targetScene = currentState.scenesState[interaction.goToScene];
                            
                            if (gameData.gameEnableChances && targetScene && targetScene.isEndingScene && currentState.chances > 0) {
                                currentState.chances--;
                                renderChances();
                                
                                if (currentState.chances > 0) {
                                    const message = \`Você cometeu um erro e perdeu uma chance. Você foi enviado de volta. Restam \${currentState.chances} chance(s).\`;
                                    const messageP = document.createElement('p');
                                    messageP.textContent = message;
                                    sceneDescriptionElement.appendChild(messageP);
                                    sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;
                                    
                                    currentState.diaryLog.push({ type: 'action', data: { command: commandText, response: message, sceneId: currentState.currentSceneId } });
                                    saveState();
                                    
                                    performSceneChange(currentState.previousSceneId, interaction.soundEffect);
                                    return;
                                }
                            }

                            // The success message is NOT displayed. The new scene's description is the feedback.
                            // We log the action, but with an empty response.
                            currentState.diaryLog.push({ type: 'action', data: { command: commandText, response: '', sceneId: currentState.currentSceneId } });
                            saveState(); // Save state before initiating the change
                            performSceneChange(interaction.goToScene, interaction.soundEffect);
                            return; // Exit
                        }

                        // Play sound for non-scene-changing interactions
                        if (interaction.soundEffect && sceneSoundEffectElement) {
                            sceneSoundEffectElement.src = interaction.soundEffect;
                            sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
                        }
                        
                        saveState();

                        if (interaction.newSceneDescription) {
                            responseText = interaction.successMessage || 'A cena mudou.';
                            currentState.diaryLog.push({ type: 'action', data: { command: commandText, response: responseText, sceneId: currentState.currentSceneId } });
                            
                            // To display the message, we append it before re-rendering the scene
                            const messageP = document.createElement('p');
                            messageP.textContent = responseText;
                            sceneDescriptionElement.appendChild(messageP);
                            sceneDescriptionElement.appendChild(document.createElement('br'));

                            changeScene(currentState.currentSceneId);
                            return; // Exit
                        }
                        if (interaction.successMessage) {
                            responseText = interaction.successMessage;
                            const successP = document.createElement('p');
                            successP.textContent = responseText;
                            sceneDescriptionElement.appendChild(successP);
                        }
                        break; // Stop after finding the first matching interaction
                    }
                }
            }
        }

        // 2. Built-in commands if no custom interaction found
        if (!interactionFound) {
            if (['olhar', 'examinar'].includes(verb)) {
                let itemFound = false;
                if (target) {
                    const object = currentScene.objetos.find(obj => target.includes(obj.name.toLowerCase()));
                    if (object) {
                        responseText = object.examineDescription;
                        const examineP = document.createElement('p');
                        examineP.textContent = responseText;
                        sceneDescriptionElement.appendChild(examineP);
                        itemFound = true;
                    }
                }
                if (!itemFound && !target) {
                    responseText = ''; // Re-describing the scene, no specific response text
                    currentState.diaryLog.push({ type: 'action', data: { command: commandText, response: responseText, sceneId: currentState.currentSceneId } });
                    changeScene(currentState.currentSceneId);
                    return;
                }
                interactionFound = itemFound;
            } else if (['pegar', 'apanhar', 'levar'].includes(verb)) {
                const object = currentScene.objetos.find(obj => target.includes(obj.name.toLowerCase()));
                if (object) {
                    interactionFound = true;
                    if (object.isTakable) {
                        currentState.inventory.push(object.id);
                        const sceneState = currentState.scenesState[currentState.currentSceneId];
                        sceneState.objetos = sceneState.objetos.filter(obj => obj.id !== object.id);
                        
                        responseText = \`Você pegou: \${object.name}.\`;
                        const takeP = document.createElement('p');
                        takeP.textContent = responseText;
                        sceneDescriptionElement.appendChild(takeP);
                        saveState();
                    } else {
                        responseText = 'Você não pode pegar isso.';
                        const cantTakeP = document.createElement('p');
                        cantTakeP.textContent = responseText;
                        sceneDescriptionElement.appendChild(cantTakeP);
                    }
                }
            }
        }

        // 3. If still no interaction found, show default failure message
        if (!interactionFound) {
            responseText = gameData.mensagem_falha_padrao || "Isso não parece ter nenhum efeito.";
            const failureP = document.createElement('p');
            failureP.textContent = responseText;
            sceneDescriptionElement.appendChild(failureP);
        }
        
        currentState.diaryLog.push({ type: 'action', data: { command: commandText, response: responseText, sceneId: currentState.currentSceneId } });
        saveState();
        sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;
    }

    function resetUI() {
        const actionButtons = document.querySelector('.action-buttons');
        const inputArea = document.querySelector('.input-area');
        if (actionButtons) actionButtons.style.display = 'flex';
        if (inputArea) inputArea.style.display = 'flex';
        if (commandInputElement) commandInputElement.disabled = false;
        if (submitCommandButton) submitCommandButton.disabled = false;
    }

    // --- Initialization ---
    async function initGame(fromRestart = false) {
        resetUI(); // Reset UI state on every game start/restart.
        let isPreview = false;
        try {
            if (window.embeddedGameData) {
                isPreview = true;
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

            if (!fromRestart && !isPreview && loadState()) {
                console.log("Game state loaded from save.");
                // Render scene without adding a new diary entry
                changeScene(currentState.currentSceneId, true);
            } else {
                console.log("Starting new game.");
                currentState.currentSceneId = gameData.cena_inicial;
                currentState.inventory = [];
                currentState.diaryLog = [];
                currentState.scenesState = JSON.parse(JSON.stringify(originalScenes));
                if (gameData.gameEnableChances) {
                    currentState.chances = gameData.gameMaxChances;
                    currentState.previousSceneId = gameData.cena_inicial;
                }
                // Render initial scene and create the first diary entry
                changeScene(currentState.currentSceneId); 
            }
            renderChances();

        } catch (error) {
            console.error('Error initializing game:', error);
            if(sceneDescriptionElement) sceneDescriptionElement.innerHTML = '<p style="color:red;">Error loading game data. Check console for details.</p>';
        }
    }
    
    function renderDiary() {
        if (!diaryLogElement) return;
        diaryLogElement.innerHTML = '';
        if (currentState.diaryLog.length === 0) {
            diaryLogElement.innerHTML = '<p>O diário está vazio.</p>';
            return;
        }

        let currentSceneBlock = null;

        currentState.diaryLog.forEach(entry => {
            if (entry.type === 'scene_load') {
                // A new scene starts. Create a new block.
                currentSceneBlock = document.createElement('div');
                currentSceneBlock.className = 'diary-entry';

                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                const img = document.createElement('img');
                img.src = entry.data.image || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                imageContainer.appendChild(img);
                currentSceneBlock.appendChild(imageContainer);

                const textContainer = document.createElement('div');
                textContainer.className = 'text-container';
                
                const sceneNameSpan = document.createElement('span');
                sceneNameSpan.className = 'scene-name';
                sceneNameSpan.textContent = entry.data.name;
                textContainer.appendChild(sceneNameSpan);
                
                const descriptionP = document.createElement('p');
                descriptionP.textContent = entry.data.description;
                textContainer.appendChild(descriptionP);
                
                currentSceneBlock.appendChild(textContainer);
                diaryLogElement.appendChild(currentSceneBlock);

            } else if (entry.type === 'action') {
                if (!currentSceneBlock) {
                    // Fallback if an action is logged before a scene (should not happen)
                    currentSceneBlock = document.createElement('div');
                    currentSceneBlock.className = 'diary-entry';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'image-container';
                    currentSceneBlock.appendChild(placeholder);
                    const textContainer = document.createElement('div');
                    textContainer.className = 'text-container';
                    currentSceneBlock.appendChild(textContainer);
                    diaryLogElement.appendChild(currentSceneBlock);
                }

                // Find the text container of the current scene block and append to it
                const textContainer = currentSceneBlock.querySelector('.text-container');
                if (textContainer) {
                    if (entry.data.command) {
                        const commandEcho = document.createElement('p');
                        commandEcho.className = 'command-echo';
                        commandEcho.textContent = (gameData.nome_jogador_diario || 'VOCÊ') + ': ' + entry.data.command;
                        textContainer.appendChild(commandEcho);
                    }
                    if (entry.data.response) {
                        const responseP = document.createElement('p');
                        responseP.textContent = entry.data.response;
                        textContainer.appendChild(responseP);
                    }
                }
            }
        });
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

    if (inventoryButton) {
        inventoryButton.addEventListener('click', () => {
            if (actionPopup.classList.contains('hidden') || actionPopup.dataset.content !== 'inventory') {
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
    
    if (suggestionsButton) {
        suggestionsButton.addEventListener('click', () => {
            if (actionPopup.classList.contains('hidden') || actionPopup.dataset.content !== 'suggestions') {
                actionPopup.innerHTML = '';
                actionPopup.dataset.content = 'suggestions';
                
                const list = document.createElement('div');
                list.className = 'action-popup-list';

                const commonVerbs = ['Olhar', 'Usar', 'Pegar', 'Abrir', 'Fechar', 'Empurrar', 'Puxar', 'Falar', 'Examinar', 'Ir'];
                
                commonVerbs.forEach(verb => {
                    const button = document.createElement('button');
                    button.textContent = verb;
                    button.onclick = () => {
                        if (commandInputElement) {
                            commandInputElement.value = verb.toLowerCase() + ' ';
                            commandInputElement.focus();
                            actionPopup.classList.add('hidden');
                            actionPopup.dataset.content = '';
                        }
                    };
                    list.appendChild(button);
                });

                actionPopup.appendChild(list);
                actionPopup.classList.remove('hidden');
            } else {
                actionPopup.classList.add('hidden');
                actionPopup.dataset.content = '';
            }
        });
    }
    
    if (diaryButton && diaryModal && diaryModalCloseButton) {
        const toggleDiary = () => {
            if(diaryModal.classList.contains('hidden')) {
                renderDiary();
                diaryModal.classList.remove('hidden');
            } else {
                diaryModal.classList.add('hidden');
            }
        };
        diaryButton.addEventListener('click', toggleDiary);
        diaryModalCloseButton.addEventListener('click', toggleDiary);
        diaryModal.addEventListener('click', (e) => {
            if (e.target === diaryModal) {
                toggleDiary();
            }
        });
    }
});
`;
