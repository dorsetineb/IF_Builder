import { GameData } from '../types';

export const prepareGameDataForEngine = (data: GameData): object => {
    const translatedCenas: { [id: string]: any } = {};
    for (const sceneId in data.scenes) {
        if (Object.prototype.hasOwnProperty.call(data.scenes, sceneId)) {
            const scene = data.scenes[sceneId];
            
            translatedCenas[sceneId] = {
                id: scene.id,
                name: scene.name,
                image: scene.image,
                description: scene.description,
                interactions: scene.interactions,
                exits: scene.exits,
                isEndingScene: scene.isEndingScene,
                removesChanceOnEntry: scene.removesChanceOnEntry,
                restoresChanceOnEntry: scene.restoresChanceOnEntry,
                // Pass IDs only to the engine. The engine will look up full objects from global library.
                objectIds: scene.objectIds || []
            };
        }
    }

    return {
        cena_inicial: data.startScene,
        cenas: translatedCenas,
        globalObjects: data.globalObjects, // Pass the library
        mensagem_falha_padrao: data.defaultFailureMessage,
        nome_jogador_diario: data.gameDiaryPlayerName,
        gameSystemEnabled: data.gameSystemEnabled,
        gameMaxChances: data.gameMaxChances,
        gameChanceIcon: data.gameChanceIcon,
        gameChanceIconColor: data.gameChanceIconColor,
        gameChanceReturnButtonText: data.gameChanceReturnButtonText,
        gameTheme: data.gameTheme,
        gameTextColorLight: data.gameTextColorLight,
        gameTitleColorLight: data.gameTitleColorLight,
        gameFocusColorLight: data.gameFocusColorLight,
        positiveEndingImage: data.positiveEndingImage,
        positiveEndingContentAlignment: data.positiveEndingContentAlignment,
        positiveEndingDescription: data.positiveEndingDescription,
        negativeEndingImage: data.negativeEndingImage,
        negativeEndingContentAlignment: data.negativeEndingContentAlignment,
        negativeEndingDescription: data.negativeEndingDescription,
        gameRestartButtonText: data.gameRestartButtonText,
        gameContinueButtonText: data.gameContinueButtonText,
        fixedVerbs: data.fixedVerbs || [],
        consequenceTrackers: data.consequenceTrackers || [],
        gameShowTrackersUI: data.gameShowTrackersUI,
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
        cross: '<svg stroke="%COLOR%" stroke-width="3" stroke-linecap="round" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>'
    };

    // --- Game State ---
    const gameData = window.embeddedGameData;
    let currentSceneId = gameData.cena_inicial;
    let inventory = []; // Array of Objects
    let visitedScenes = []; 
    let actionLog = []; 
    let chances = gameData.gameMaxChances || 3;
    let isGameEnded = false;
    let trackers = {};
    let activePopupSource = null;
    
    // Runtime scene object cache (to simulate state like 'removed from scene')
    // Map<SceneID, GameObject[]>
    let sceneObjectsState = {}; 

    // Initialize trackers
    (gameData.consequenceTrackers || []).forEach(t => {
        trackers[t.id] = t.initialValue;
    });

    // --- DOM Elements ---
    const splashScreen = document.getElementById('splash-screen');
    const positiveEndingScreen = document.getElementById('positive-ending-screen');
    const negativeEndingScreen = document.getElementById('negative-ending-screen');
    const splashStartButton = document.getElementById('splash-start-button');
    const continueButton = document.getElementById('continue-button');
    const endingRestartButtons = document.querySelectorAll('.ending-restart-button');
    
    const imageContainer = document.getElementById('image-container');
    const sceneImage = document.getElementById('scene-image');
    const sceneDescription = document.getElementById('scene-description');
    const verbInput = document.getElementById('verb-input');
    const submitVerb = document.getElementById('submit-verb');
    const actionPopup = document.getElementById('action-popup');
    const suggestionsButton = document.getElementById('suggestions-button');
    const inventoryButton = document.getElementById('inventory-button');
    const diaryButton = document.getElementById('diary-button');
    const trackersButton = document.getElementById('trackers-button');
    const sceneNameOverlay = document.getElementById('scene-name-overlay');
    const transitionOverlay = document.getElementById('transition-overlay');
    const soundEffectAudio = document.getElementById('scene-sound-effect');
    
    const diaryModal = document.getElementById('diary-modal');
    const diaryLog = document.getElementById('diary-log');
    const trackersModal = document.getElementById('trackers-modal');
    const trackersContent = document.getElementById('trackers-content');
    const itemModal = document.getElementById('item-modal');
    const itemModalName = document.getElementById('item-modal-name');
    const itemModalImageContainer = document.getElementById('item-modal-image-container');
    const itemModalImage = document.getElementById('item-modal-image');
    const itemModalDescription = document.getElementById('item-modal-description');
    
    const closeButtons = document.querySelectorAll('.modal-close-button');

    // --- Audio Helper ---
    const playSound = (src) => {
        if (!src || !soundEffectAudio) return;
        soundEffectAudio.src = src;
        soundEffectAudio.play().catch(e => console.log('Audio play failed', e));
    };

    // --- Initialization ---
    const init = () => {
        const hasSave = localStorage.getItem('if_builder_save_' + document.title);
        if (hasSave) {
            continueButton.classList.remove('hidden');
        }

        splashStartButton.addEventListener('click', startGame);
        continueButton.addEventListener('click', loadGame);
        endingRestartButtons.forEach(btn => btn.addEventListener('click', () => {
             positiveEndingScreen.classList.add('hidden');
             negativeEndingScreen.classList.add('hidden');
             startGame();
        }));

        submitVerb.addEventListener('click', handleInput);
        verbInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleInput();
        });

        suggestionsButton.addEventListener('click', () => togglePopup('suggestions'));
        inventoryButton.addEventListener('click', () => togglePopup('inventory'));
        diaryButton.addEventListener('click', showDiary);
        if (trackersButton) trackersButton.addEventListener('click', showTrackers);
        
        closeButtons.forEach(btn => btn.addEventListener('click', (e) => {
            e.target.closest('.modal-overlay').classList.add('hidden');
        }));
        
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if(e.target === modal) modal.classList.add('hidden');
            });
        });

        document.addEventListener('click', (e) => {
             if (e.target && e.target.id === 'btn-return-chance') {
                 // Force re-render of current scene
                 loadScene(currentSceneId, false);
             }
        });
    };

    const startGame = () => {
        localStorage.removeItem('if_builder_save_' + document.title);
        currentSceneId = gameData.cena_inicial;
        inventory = [];
        visitedScenes = [];
        actionLog = [];
        chances = gameData.gameMaxChances || 3;
        isGameEnded = false;
        trackers = {};
        sceneObjectsState = {}; // Reset object state
        (gameData.consequenceTrackers || []).forEach(t => {
            trackers[t.id] = t.initialValue;
        });
        
        splashScreen.classList.add('hidden');
        loadScene(currentSceneId);
    };

    const loadGame = () => {
        try {
            const savedData = localStorage.getItem('if_builder_save_' + document.title);
            if (savedData) {
                const save = JSON.parse(savedData);
                if (save) {
                    currentSceneId = save.currentSceneId;
                    inventory = save.inventory;
                    visitedScenes = save.visitedScenes || [];
                    actionLog = save.actionLog || [];
                    chances = save.chances;
                    trackers = save.trackers || {};
                    
                    // Restore scene object states
                    sceneObjectsState = save.sceneObjectsState || {};

                    splashScreen.classList.add('hidden');
                    loadScene(currentSceneId, false);
                } else {
                    startGame();
                }
            } else {
                startGame();
            }
        } catch (e) {
            console.error("Failed to load save:", e);
            startGame();
        }
    };

    const saveGame = () => {
        if (window.isPreview) return; 
        const save = {
            currentSceneId,
            inventory,
            visitedScenes,
            actionLog,
            chances,
            trackers,
            sceneObjectsState // Persist which objects are still in scenes
        };
        localStorage.setItem('if_builder_save_' + document.title, JSON.stringify(save));
    };

    // Helper to get objects for a scene (handling initial vs modified state)
    const getObjectsForScene = (sceneId) => {
        // If we have a modified state for this scene, use it
        if (sceneObjectsState[sceneId]) {
            return sceneObjectsState[sceneId];
        }
        
        // Otherwise, construct from global library using objectIds
        const scene = gameData.cenas[sceneId];
        if (!scene) return [];
        
        const objects = (scene.objectIds || []).map(id => {
            const globalObj = gameData.globalObjects[id];
            // We create a copy so runtime modifications (if any) don't affect the global library structure in memory
            return globalObj ? JSON.parse(JSON.stringify(globalObj)) : null;
        }).filter(obj => obj !== null);
        
        // Initialize state for this scene
        sceneObjectsState[sceneId] = objects;
        return objects;
    };
    
    const updateSceneObjects = (sceneId, newObjects) => {
        sceneObjectsState[sceneId] = newObjects;
    };

    const updateTrackers = (effects) => {
        if (!effects) return;
        let changed = false;
        effects.forEach(effect => {
            if (trackers.hasOwnProperty(effect.trackerId)) {
                trackers[effect.trackerId] += effect.valueChange;
                changed = true;
            }
        });
        if (changed) checkTrackers();
    };

    const checkTrackers = () => {
        const definitions = gameData.consequenceTrackers || [];
        for (const def of definitions) {
            if (trackers[def.id] >= def.maxValue && def.consequenceSceneId) {
                setTimeout(() => {
                    loadScene(def.consequenceSceneId, true, 'fade');
                }, 500);
                return;
            }
        }
    };

    const loadScene = (sceneId, transition = true, transitionType = 'none') => {
        if (isGameEnded) return;

        const scene = gameData.cenas[sceneId];
        if (!scene) {
            console.error('Cena não encontrada:', sceneId);
            return;
        }

        if (scene.removesChanceOnEntry) {
            chances--;
            if (chances <= 0) {
                gameOver();
                return;
            }
        }
        if (scene.restoresChanceOnEntry) {
            if (gameData.gameSystemEnabled === 'chances') {
                chances = Math.min(chances + 1, gameData.gameMaxChances);
            }
        }
        
        currentSceneId = sceneId;
        
        if (!visitedScenes.includes(sceneId)) {
            visitedScenes.push(sceneId);
        }
        
        actionLog.push({
            type: 'scene',
            name: scene.name,
            timestamp: new Date().toLocaleTimeString(),
            description: scene.description,
            image: scene.image
        });

        if (transition && transitionType !== 'none' && transitionOverlay) {
             transitionOverlay.className = 'transition-overlay ' + transitionType + '-start active';
             requestAnimationFrame(() => {
                 requestAnimationFrame(() => {
                      transitionOverlay.className = 'transition-overlay active is-wiping ' + transitionType + '-start';
                      setTimeout(() => {
                          renderScene(scene);
                          setTimeout(() => {
                              transitionOverlay.className = 'transition-overlay';
                          }, 500);
                      }, 700);
                 });
             });
        } else {
            renderScene(scene);
        }

        saveGame();
    };

    const renderScene = (scene) => {
        if (scene.image) {
            sceneImage.src = scene.image;
            sceneImage.classList.remove('hidden');
            imageContainer.classList.remove('no-image');
        } else {
            sceneImage.src = '';
            sceneImage.classList.add('hidden');
            imageContainer.classList.add('no-image');
        }

        if (sceneNameOverlay) {
            sceneNameOverlay.textContent = scene.name;
            sceneNameOverlay.style.opacity = '1';
            setTimeout(() => {
                sceneNameOverlay.style.opacity = '0';
            }, 3000);
        }

        let desc = scene.description;
        desc = desc.replace(/<([^>]+)>/g, '<span class="highlight-word" data-word="$1">$1</span>');
        sceneDescription.innerHTML = desc;

        sceneDescription.querySelectorAll('.highlight-word').forEach(span => {
            span.addEventListener('click', () => {
                const word = span.dataset.word;
                verbInput.value = \`olhar \${word}\`;
                handleInput();
            });
        });

        const chancesContainer = document.getElementById('chances-container');
        if (chancesContainer && gameData.gameSystemEnabled === 'chances') {
            chancesContainer.innerHTML = '';
            const iconSvg = ICONS[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
            const iconOutlineSvg = ICONS_OUTLINE[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
            
            for (let i = 0; i < (gameData.gameMaxChances || 3); i++) {
                const icon = document.createElement('div');
                icon.className = \`chance-icon \${i < chances ? '' : 'lost'}\`;
                icon.innerHTML = i < chances ? iconSvg : iconOutlineSvg;
                chancesContainer.appendChild(icon);
            }
        }

        closeActionPopup();
        verbInput.value = '';
        verbInput.focus();

        if (scene.isEndingScene) {
            setTimeout(() => {
                gameWin();
            }, 2000);
        }
    };

    const gameOver = () => {
        isGameEnded = true;
        negativeEndingScreen.classList.remove('hidden');
        localStorage.removeItem('if_builder_save_' + document.title);
    };

    const gameWin = () => {
        isGameEnded = true;
        positiveEndingScreen.classList.remove('hidden');
        localStorage.removeItem('if_builder_save_' + document.title);
    };

    const handleInput = () => {
        const rawInput = verbInput.value.trim();
        if (!rawInput) return;

        processCommand(rawInput);
        verbInput.value = '';
    };

    const processCommand = (input) => {
        const inputLower = input.toLowerCase().trim();
        
        const echo = document.createElement('p');
        echo.className = 'verb-echo';
        echo.textContent = '> ' + input;
        sceneDescription.appendChild(echo);
        sceneDescription.scrollTop = sceneDescription.scrollHeight;

        actionLog.push({ type: 'input', text: '> ' + input });

        const scene = gameData.cenas[currentSceneId];
        const sceneObjects = getObjectsForScene(currentSceneId); // Get active objects
        
        const hasWord = (word, text) => {
             const safe = word.replace(/[.*+?^$\{}()|[\\]\\\\]/g, '\\\\$&');
             return new RegExp('\\\\b' + safe + '\\\\b', 'i').test(text);
        };

        for (const fv of (gameData.fixedVerbs || [])) {
            if (fv.verbs.some(v => hasWord(v, inputLower))) {
                printOutput(fv.description);
                return;
            }
        }

        const interaction = scene.interactions.find(i => {
            const verbMatch = i.verbs.some(v => hasWord(v, inputLower));
            if (!verbMatch) return false;
            
            if (i.target) {
                const targetObj = sceneObjects.find(o => o.id === i.target);
                const invObj = findItemInInventoryById(i.target);
                const obj = targetObj || invObj;
                
                if (obj) {
                    if (!hasWord(obj.name.toLowerCase(), inputLower)) return false;
                } else {
                    return false;
                }
            }
            
            if (i.requiresInInventory) {
                if (!inventory.some(o => o.id === i.requiresInInventory)) return false;
            }

            return true;
        });

        if (interaction) {
            executeInteraction(interaction);
            return;
        }

        if (hasWord('inventario', inputLower) || hasWord('i', inputLower) || hasWord('items', inputLower) || (hasWord('ver', inputLower) && hasWord('inventario', inputLower))) {
            closeActionPopup();
            togglePopup('inventory');
            return;
        }

        const lookVerbs = ['olhar', 'examinar', 'l', 'x', 'ver', 'ler'];
        if (lookVerbs.some(v => hasWord(v, inputLower))) {
             const sceneObj = sceneObjects.find(o => hasWord(o.name.toLowerCase(), inputLower));
             if (sceneObj) {
                 printOutput(sceneObj.examineDescription);
                 return;
             }
             
             const invObj = inventory.find(item => hasWord(item.name.toLowerCase(), inputLower));
             if (invObj) {
                 printOutput(invObj.examineDescription);
                 return;
             }
             
             printOutput(scene.description.replace(/<|>/g, ''));
             return;
        }

        const takeVerbs = ['pegar', 'coletar', 'apanhar', 'levar'];
        if (takeVerbs.some(v => hasWord(v, inputLower))) {
             const sceneObj = sceneObjects.find(o => hasWord(o.name.toLowerCase(), inputLower));
             if (sceneObj) {
                 if (sceneObj.isTakable) {
                     addToInventory(sceneObj);
                     // Remove from scene state
                     const newObjects = sceneObjects.filter(o => o.id !== sceneObj.id);
                     updateSceneObjects(currentSceneId, newObjects);
                     
                     printOutput(\`Você pegou \${sceneObj.name}.\`);
                     saveGame();
                     return;
                 } else {
                     printOutput("Você não pode pegar isso.");
                     return;
                 }
             }
        }
        
        if (hasWord('ajuda', inputLower) || hasWord('help', inputLower) || inputLower === '?') {
             printOutput("Tente usar verbos como 'olhar', 'pegar', 'usar', 'mover'.");
             return;
        }

        printOutput(gameData.mensagem_falha_padrao || "Não aconteceu nada.");
    };

    const executeInteraction = (interaction) => {
        if (interaction.consumesItem && interaction.requiresInInventory) {
            removeFromInventory(interaction.requiresInInventory);
            printOutput("(Item perdido: " + findItemName(interaction.requiresInInventory) + ")");
        }

        if (interaction.trackerEffects) {
            updateTrackers(interaction.trackerEffects);
        }

        if (interaction.removesTargetFromScene) {
             const sceneObjects = getObjectsForScene(currentSceneId);
             const newObjects = sceneObjects.filter(o => o.id !== interaction.target);
             updateSceneObjects(currentSceneId, newObjects);
        }

        if (interaction.soundEffect) {
            playSound(interaction.soundEffect);
        }

        if (interaction.goToScene) {
             loadScene(interaction.goToScene, true, interaction.transitionType);
        } else {
            if (interaction.newSceneDescription) {
                 gameData.cenas[currentSceneId].description = interaction.newSceneDescription;
                 const desc = interaction.newSceneDescription.replace(/<([^>]+)>/g, '<span class="highlight-word" data-word="$1">$1</span>');
                 sceneDescription.innerHTML = desc;
                 sceneDescription.querySelectorAll('.highlight-word').forEach(span => {
                    span.addEventListener('click', () => {
                        const word = span.dataset.word;
                        verbInput.value = \`olhar \${word}\`;
                        handleInput();
                    });
                });
            }
            if (interaction.successMessage) {
                printOutput(interaction.successMessage);
            }
        }
    };

    const printOutput = (text) => {
        const p = document.createElement('p');
        p.textContent = text;
        sceneDescription.appendChild(p);
        sceneDescription.scrollTop = sceneDescription.scrollHeight;
        
        actionLog.push({ type: 'output', text: text });
        saveGame();
    };

    const findItemInInventoryById = (id) => {
        return inventory.find(o => o.id === id) || null;
    };

    const findItemName = (id) => {
        const item = findItemInInventoryById(id) || gameData.globalObjects[id];
        return item ? item.name : 'item';
    };

    const addToInventory = (obj) => {
        if (!inventory.some(o => o.id === obj.id)) {
            inventory.push(obj);
        }
    };

    const removeFromInventory = (id) => {
        inventory = inventory.filter(i => i.id !== id);
    };

    const togglePopup = (type) => {
        if (!actionPopup.classList.contains('hidden') && activePopupSource === type) {
            closeActionPopup();
        } else {
            if (type === 'suggestions') showSuggestions();
            if (type === 'inventory') showInventory();
            activePopupSource = type;
        }
    };

    const closeActionPopup = () => {
        actionPopup.classList.add('hidden');
        activePopupSource = null;
    };

    const showSuggestions = () => {
        actionPopup.classList.remove('hidden');
        actionPopup.innerHTML = '';
        
        const sceneObjects = getObjectsForScene(currentSceneId);
        const container = document.createElement('div');
        container.className = 'action-popup-container';

        if (sceneObjects.length > 0) {
            const row1 = document.createElement('div');
            row1.className = 'action-popup-row';
            
            sceneObjects.forEach(obj => {
                const btn = document.createElement('button');
                btn.textContent = obj.name;
                btn.addEventListener('click', () => {
                    verbInput.value = \`examinar \${obj.name}\`;
                    closeActionPopup();
                    handleInput();
                });
                row1.appendChild(btn);
            });
            container.appendChild(row1);
        }
        
        const row2 = document.createElement('div');
        row2.className = 'action-popup-row';
        ['Olhar ao redor', 'Inventário', 'Ajuda'].forEach(action => {
             const btn = document.createElement('button');
             btn.textContent = action;
             btn.addEventListener('click', () => {
                 if (action === 'Olhar ao redor') verbInput.value = 'olhar';
                 if (action === 'Inventário') verbInput.value = 'inventario';
                 if (action === 'Ajuda') verbInput.value = 'ajuda';
                 closeActionPopup();
                 handleInput();
             });
             row2.appendChild(btn);
        });
        container.appendChild(row2);

        actionPopup.appendChild(container);
    };

    const showInventory = () => {
        actionPopup.classList.remove('hidden');
        actionPopup.innerHTML = '';
        
        const list = document.createElement('div');
        list.className = 'action-popup-list';
        
        if (inventory.length === 0) {
            const msg = document.createElement('div');
            msg.className = 'empty-inventory-msg';
            msg.textContent = 'Seu inventário está vazio.';
            list.appendChild(msg);
        } else {
            inventory.forEach(item => {
                if (item) {
                    const btn = document.createElement('button');
                    btn.textContent = item.name;
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openItemModal(item);
                        closeActionPopup();
                    });
                    list.appendChild(btn);
                }
            });
        }
        actionPopup.appendChild(list);
    };

    const openItemModal = (item) => {
        itemModalName.textContent = item.name;
        itemModalDescription.textContent = item.examineDescription;
        
        if (item.image) {
            itemModalImage.src = item.image;
            itemModalImageContainer.classList.remove('hidden');
        } else {
            itemModalImage.src = '';
            itemModalImageContainer.classList.add('hidden');
        }
        
        itemModal.classList.remove('hidden');
    };

    const showDiary = () => {
        diaryLog.innerHTML = '';
        
        actionLog.forEach(entry => {
            if (entry.type === 'scene') {
                const div = document.createElement('div');
                div.className = 'diary-entry';
                
                if (entry.image) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'image-container';
                    const img = document.createElement('img');
                    img.src = entry.image;
                    imgContainer.appendChild(img);
                    div.appendChild(imgContainer);
                }
                
                const textContainer = document.createElement('div');
                textContainer.className = 'text-container';
                const title = document.createElement('span');
                title.className = 'scene-name';
                title.textContent = entry.name;
                const desc = document.createElement('p');
                desc.textContent = entry.description ? entry.description.replace(/<|>/g, '') : '';
                
                textContainer.appendChild(title);
                textContainer.appendChild(desc);
                div.appendChild(textContainer);
                diaryLog.appendChild(div);
            } else if (entry.type === 'input') {
                const p = document.createElement('p');
                p.className = 'diary-input';
                p.textContent = entry.text;
                diaryLog.appendChild(p);
            } else if (entry.type === 'output') {
                const p = document.createElement('p');
                p.className = 'diary-output';
                p.textContent = entry.text;
                diaryLog.appendChild(p);
            }
        });
        
        diaryModal.classList.remove('hidden');
        setTimeout(() => {
             diaryLog.scrollTop = diaryLog.scrollHeight;
        }, 10);
    };
    
    const showTrackers = () => {
        trackersContent.innerHTML = '';
        const defs = gameData.consequenceTrackers || [];
        
        if (defs.length === 0) {
            trackersContent.textContent = 'Nenhum rastreador ativo.';
        } else {
            defs.forEach(def => {
                const val = trackers[def.id] || 0;
                const percentage = Math.min(100, Math.max(0, (val / def.maxValue) * 100));
                
                const item = document.createElement('div');
                item.className = 'tracker-item';
                
                const header = document.createElement('div');
                header.className = 'tracker-item-header';
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'tracker-item-name';
                nameSpan.textContent = def.name;
                
                header.appendChild(nameSpan);
                
                if (!def.hideValue) {
                    const valSpan = document.createElement('span');
                    valSpan.className = 'tracker-item-values';
                    valSpan.textContent = \`\${val} / \${def.maxValue}\`;
                    header.appendChild(valSpan);
                }
                
                item.appendChild(header);
                
                const barContainer = document.createElement('div');
                barContainer.className = 'tracker-bar-container';
                
                const bar = document.createElement('div');
                bar.className = 'tracker-bar';
                
                let width = percentage;
                if (def.invertBar) {
                    width = 100 - percentage;
                }
                
                bar.style.width = \`\${width}%\`;
                if (def.barColor) {
                    bar.style.backgroundColor = def.barColor;
                }
                
                barContainer.appendChild(bar);
                item.appendChild(barContainer);
                
                trackersContent.appendChild(item);
            });
        }
        
        trackersModal.classList.remove('hidden');
    };

    init();
});
`;
