import { GameData } from '../types';

export const prepareGameDataForEngine = (data: GameData): object => {
    const translatedCenas: { [id: string]: any } = {};
    for (const sceneId in data.scenes) {
        // Ensure we are iterating over own properties
        if (Object.prototype.hasOwnProperty.call(data.scenes, sceneId)) {
            const scene = data.scenes[sceneId];
            // Explicitly copy properties to avoid issues with rest/spread,
            // ensuring the 'image' property is preserved for the diary.
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
                // Rename 'objects' to 'objetos' for the game engine.
                objetos: scene.objects || []
            };
        }
    }

    return {
        cena_inicial: data.startScene,
        cenas: translatedCenas,
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
        cross: ICONS.cross // Cross is already an outline
    };

    // --- DOM Elements ---
    const sceneDescriptionElement = document.getElementById('scene-description');
    const sceneImageElement = document.getElementById('scene-image');
    const verbInputElement = document.getElementById('verb-input');
    const sceneSoundEffectElement = document.getElementById('scene-sound-effect');
    const transitionOverlay = document.getElementById('transition-overlay');
    const splashScreen = document.getElementById('splash-screen');
    const startButton = document.getElementById('splash-start-button');
    const continueButton = document.getElementById('continue-button');
    const restartButton = document.getElementById('restart-button');
    const submitVerbButton = document.getElementById('submit-verb');
    const inventoryButton = document.getElementById('inventory-button');
    const suggestionsButton = document.getElementById('suggestions-button');
    const diaryButton = document.getElementById('diary-button');
    const trackersButton = document.getElementById('trackers-button');
    const actionPopup = document.getElementById('action-popup');
    const trackersPopup = document.getElementById('trackers-popup');
    const diaryModal = document.getElementById('diary-modal');
    const diaryLogElement = document.getElementById('diary-log');
    const diaryModalCloseButton = diaryModal ? diaryModal.querySelector('.modal-close-button') : null;
    const positiveEndingScreen = document.getElementById('positive-ending-screen');
    const negativeEndingScreen = document.getElementById('negative-ending-screen');
    const endingRestartButtons = document.querySelectorAll('.ending-restart-button');
    const gameHeader = document.querySelector('.game-header');
    const gameContainer = document.querySelector('.game-container');
    const sceneNameOverlayElement = document.getElementById('scene-name-overlay');
    const actionBar = document.querySelector('.action-bar');


    // --- State Variables ---
    let gameData = null;
    let originalScenes = null;
    let allTakableObjects = {};
    let currentSceneParagraphs = [];
    let currentParagraphIndex = 0;
    const SAVE_KEY = 'textAdventureSaveData_v1';
    let currentState = {
        currentSceneId: null,
        previousSceneId: null,
        inventory: [], // stores item IDs
        diaryLog: [], // Array of {type: 'scene_load' | 'action', data: {...}}
        scenesState: {},
        chances: null,
        trackerValues: {},
    };
    let onRenderCompleteCallback = null;

    // --- Game Logic ---
    function saveState() {
        if (window.isPreview) return;
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(currentState));
        } catch (e) {
            console.warn("Could not save game state to localStorage:", e);
        }
    }

    function loadState() {
        if (window.isPreview) return false;
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
        if (gameData.gameSystemEnabled !== 'chances') return;
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

    function renderTrackersUI() {
        if (!trackersPopup || !gameData.consequenceTrackers || gameData.consequenceTrackers.length === 0) return;
        let content = '';
        gameData.consequenceTrackers.forEach(tracker => {
            if (!tracker || !tracker.id) return;
            const currentValue = currentState.trackerValues[tracker.id] || 0;
            const maxValue = tracker.maxValue || 100;
            const percentage = Math.max(0, Math.min(100, (currentValue / maxValue) * 100));
            content += \`
                <div class="tracker-item">
                    <span class="tracker-item-name">\${tracker.name}</span>
                    <div class="tracker-bar-container">
                        <div class="tracker-bar" style="width: \${percentage}%;">\${Math.round(currentValue)} / \${maxValue}</div>
                    </div>
                </div>
            \`;
        });
        trackersPopup.innerHTML = content;
    }


    function showEnding(type) {
        let screenToShow;
        if (type === 'positive' && positiveEndingScreen) {
            screenToShow = positiveEndingScreen;
            if (!currentState.diaryLog.find(e => e.type === 'action' && e.data.response === '[FIM DE JOGO - POSITIVO]')) {
                currentState.diaryLog.push({ type: 'action', data: { command: '', response: '[FIM DE JOGO - POSITIVO]', sceneId: currentState.currentSceneId } });
            }
        } else if (type === 'negative' && negativeEndingScreen) {
            screenToShow = negativeEndingScreen;
            if (!currentState.diaryLog.find(e => e.type === 'action' && e.data.response === '[FIM DE JOGO - NEGATÍVO]')) {
                 currentState.diaryLog.push({ type: 'action', data: { command: '', response: '[FIM DE JOGO - NEGATÍVO]', sceneId: currentState.currentSceneId } });
            }
        }

        if (screenToShow) {
            if(gameHeader) gameHeader.classList.add('hidden');
            if(gameContainer) gameContainer.classList.add('hidden');
            screenToShow.classList.remove('hidden');
            saveState();
        }
    }


    function renderNextParagraph() {
        if (!sceneDescriptionElement || currentParagraphIndex >= currentSceneParagraphs.length) {
            if (onRenderCompleteCallback) {
                onRenderCompleteCallback();
                onRenderCompleteCallback = null; // Use only once
            } else {
                if (verbInputElement) verbInputElement.disabled = false;
                if (submitVerbButton) submitVerbButton.disabled = false;
                if (verbInputElement) verbInputElement.focus();
            }
            return;
        }

        const paragraphText = currentSceneParagraphs[currentParagraphIndex];
        const p = document.createElement('p');
        
        // Process highlights: **bold** and <clickable>
        let processedText = paragraphText.replace(/\\*\\*(.*?}\\*\\*/g, '<span class="highlight-item">$1</span>');
        processedText = processedText.replace(/<(.*?)>/g, '<span class="highlight-word" data-word="$1">$1</span>');
        p.innerHTML = processedText;

        sceneDescriptionElement.appendChild(p);
        
        // Add click listeners for the new spans
        p.querySelectorAll('.highlight-word').forEach(span => {
            span.addEventListener('click', () => {
                if (verbInputElement) {
                    const word = span.dataset.word;
                    const currentValue = verbInputElement.value.trim();
                    verbInputElement.value = (currentValue ? currentValue + ' ' + word : word) + ' ';
                    verbInputElement.focus();
                    if (actionPopup) {
                        actionPopup.classList.add('hidden');
                    }
                }
            });
        });
        
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
        
        onRenderCompleteCallback = null;
        if(actionBar) actionBar.classList.remove('hidden');

        // Instant game over if chances are disabled and scene is deadly
        if (!isStateLoad && gameData.gameSystemEnabled !== 'chances' && scene.removesChanceOnEntry) {
            if (sceneDescriptionElement) sceneDescriptionElement.innerHTML = '';
            showEnding('negative');
            return; // Stop processing
        }
        
        const createEndButton = (text, onClick) => {
            if (actionBar) actionBar.classList.add('hidden');
            const button = document.createElement('button');
            button.textContent = text;
            button.style.width = '100%';
            button.style.padding = '15px 20px';
            button.style.border = '2px solid var(--border-color)';
            button.style.backgroundColor = 'var(--action-button-bg)';
            button.style.color = 'var(--action-button-text-color)';
            button.style.fontFamily = 'var(--font-family)';
            button.style.cursor = 'pointer';
            button.style.fontWeight = 'bold';
            button.style.fontSize = '1.1em';
            button.style.marginTop = '20px';
            button.onclick = onClick;
            sceneDescriptionElement.appendChild(button);
            sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;
        };

        // --- Handle scene entry effects before rendering description ---
        if (!isStateLoad) {
            if (scene.isEndingScene) {
                onRenderCompleteCallback = () => {
                    createEndButton('Fim de Jogo', () => showEnding('positive'));
                };
            } else if (gameData.gameSystemEnabled === 'chances') {
                if (scene.removesChanceOnEntry) {
                    currentState.chances--;
                    renderChances();
                    if (currentState.chances <= 0) {
                        onRenderCompleteCallback = () => {
                           createEndButton('Fim de Jogo', () => showEnding('negative'));
                        };
                    } else {
                        onRenderCompleteCallback = () => {
                            createEndButton(gameData.gameChanceReturnButtonText || 'Tentar Novamente', () => {
                                if (actionBar) actionBar.classList.remove('hidden');
                                performSceneChange(currentState.previousSceneId);
                            });
                        };
                    }
                } else if (scene.restoresChanceOnEntry) {
                    if (currentState.chances < gameData.gameMaxChances) {
                        currentState.chances++;
                        renderChances();
                    }
                }
            }
        }
        // --- End of scene entry effects ---


        if (!isStateLoad && currentState.currentSceneId !== sceneId) {
            currentState.previousSceneId = currentState.currentSceneId;
        }

        currentState.currentSceneId = sceneId;
        const rawDescription = scene.description ? ('' + scene.description).trim() : '';
        currentSceneParagraphs = rawDescription.split('\\n').filter(p => p.trim() !== '');
        currentParagraphIndex = 0;

        if (!isStateLoad) {
            const lastLogEntry = currentState.diaryLog[currentState.diaryLog.length - 1];
            // Prevent duplicate scene logs when returning to a scene after losing a chance
            if (!lastLogEntry || lastLogEntry.type !== 'scene_load' || lastLogEntry.data.id !== scene.id) {
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
        }
        
        if (sceneImageElement && scene.image) {
            sceneImageElement.src = scene.image;
        } else if (sceneImageElement) {
            sceneImageElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // transparent pixel
        }
        
        if (sceneNameOverlayElement) {
            sceneNameOverlayElement.textContent = scene.name;
        }

        if (sceneDescriptionElement) {
            sceneDescriptionElement.innerHTML = ''; // Clear previous content
            
            if (verbInputElement) verbInputElement.disabled = true;
            if (submitVerbButton) submitVerbButton.disabled = true;

            renderNextParagraph();
        }

        if (!isStateLoad) {
            saveState();
        }
    }

    function performSceneChange(sceneId, soundEffectUrl, transitionType = 'none') {
        if (!transitionOverlay) {
            changeScene(sceneId);
            return;
        }
    
        const newScene = currentState.scenesState[sceneId];
        if (!newScene) {
            console.error('New scene not found for transition:', sceneId);
            changeScene(sceneId);
            return;
        }
    
        if (soundEffectUrl && sceneSoundEffectElement) {
            sceneSoundEffectElement.src = soundEffectUrl;
            sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
        }
    
        if (sceneNameOverlayElement) {
            sceneNameOverlayElement.style.opacity = '0';
        }
    
        // Handle 'none' as the default, no-animation transition
        if (transitionType === 'none' || !transitionType) {
            changeScene(sceneId);
            if (sceneNameOverlayElement) {
                setTimeout(() => { sceneNameOverlayElement.style.opacity = '1'; }, 50);
            }
            return;
        }
    
        // Handle all visual transitions that require the overlay
        const onTransitionEnd = () => {
            transitionOverlay.removeEventListener('transitionend', onTransitionEnd);
            changeScene(sceneId);
    
            // Immediately hide overlay after the new scene is rendered underneath.
            transitionOverlay.className = 'transition-overlay';
            transitionOverlay.style.cssText = ''; 
            
            if (sceneNameOverlayElement) {
                setTimeout(() => { sceneNameOverlayElement.style.opacity = '1'; }, 50);
            }
        };
        
        transitionOverlay.addEventListener('transitionend', onTransitionEnd, { once: true });
    
        // Set the overlay's background to the new scene's image for a seamless effect
        transitionOverlay.style.backgroundImage = \`url('\${newScene.image || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}')\`;
        
        let startClass = '';
        let transClass = '';
    
        switch (transitionType) {
            case 'fade':
                // The CSS for .transition-overlay handles the opacity transition.
                // No special classes needed, just adding 'active' later.
                break;
            case 'wipe-down':
                startClass = 'wipe-down-start';
                transClass = 'is-wiping';
                break;
            case 'wipe-up':
                startClass = 'wipe-up-start';
                transClass = 'is-wiping';
                break;
            case 'wipe-left':
                startClass = 'wipe-left-start';
                transClass = 'is-wiping';
                break;
            case 'wipe-right':
                startClass = 'wipe-right-start';
                transClass = 'is-wiping';
                break;
            default:
                // Fallback for unknown transition types to no transition
                transitionOverlay.removeEventListener('transitionend', onTransitionEnd);
                changeScene(sceneId);
                return;
        }
    
        transitionOverlay.className = 'transition-overlay'; // Reset classes
        if (startClass) transitionOverlay.classList.add(startClass);
        if (transClass) transitionOverlay.classList.add(transClass);
    
        // Double requestAnimationFrame to ensure CSS classes are applied before transition starts
        requestAnimationFrame(() => {
             requestAnimationFrame(() => {
                transitionOverlay.classList.add('active');
             });
        });
    }
    
    function processVerb() {
        if (!verbInputElement || verbInputElement.disabled) return;
        const verbText = verbInputElement.value.trim();
        if (!verbText) return;

        if (verbText.toLowerCase() === 'salvar jogo') {
            saveState();
            const saveP = document.createElement('p');
            saveP.textContent = 'Jogo salvo.';
            sceneDescriptionElement.appendChild(saveP);
            sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;
            verbInputElement.value = '';
            return;
        }
        
        const lowerCaseVerbText = verbText.toLowerCase();

        verbInputElement.value = '';

        const currentScene = currentState.scenesState[currentState.currentSceneId];
        if (!currentScene) return;

        // Echo the verb
        const echoP = document.createElement('p');
        echoP.className = 'verb-echo';
        echoP.textContent = '> ' + verbText;
        sceneDescriptionElement.appendChild(echoP);

        let verbProcessed = false;
        let responseText = '';
        
        // 0. Check for fixed verbs
        if (gameData.fixedVerbs && gameData.fixedVerbs.length > 0) {
            for (const fixedVerb of gameData.fixedVerbs) {
                const verbMatch = fixedVerb.verbs.find(verb => verb.toLowerCase() === lowerCaseVerbText);
                if (verbMatch) {
                    responseText = fixedVerb.description;
                    const fixedVerbP = document.createElement('p');
                    fixedVerbP.innerHTML = responseText.replace(/\\n/g, '<br>');
                    sceneDescriptionElement.appendChild(fixedVerbP);
                    verbProcessed = true;
                    break;
                }
            }
        }
        
        if (verbProcessed) {
             currentState.diaryLog.push({ type: 'action', data: { command: verbText, response: responseText, sceneId: currentState.currentSceneId } });
             sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;
             return;
        }

        // 1. Look for matching custom interactions (flexible parsing)
        let bestMatch = null;

        if (currentScene.interactions) {
            const interactionsWithItems = currentScene.interactions.filter(i => i.requiresInInventory);
            const interactionsWithoutItems = currentScene.interactions.filter(i => !i.requiresInInventory);

            // Prioritize interactions with inventory items to resolve ambiguity
            for (const interaction of interactionsWithItems) {
                const verbMatch = interaction.verbs.some(v => lowerCaseVerbText.includes(v));
                if (!verbMatch) continue;
                
                const targetObject = currentScene.objetos.find(o => o.id === interaction.target);
                if (!targetObject || !lowerCaseVerbText.includes(targetObject.name.toLowerCase())) continue;
                
                const requiredItem = allTakableObjects[interaction.requiresInInventory];
                if (!requiredItem || !lowerCaseVerbText.includes(requiredItem.name.toLowerCase())) continue;

                if (currentState.inventory.includes(interaction.requiresInInventory)) {
                    bestMatch = interaction;
                    break; 
                }
            }

            if (!bestMatch) {
                for (const interaction of interactionsWithoutItems) {
                    const verbMatch = interaction.verbs.some(v => lowerCaseVerbText.includes(v));
                    if (!verbMatch) continue;

                    const targetObject = currentScene.objetos.find(o => o.id === interaction.target);
                    if (!targetObject || !lowerCaseVerbText.includes(targetObject.name.toLowerCase())) continue;
                    
                    bestMatch = interaction;
                    break;
                }
            }
        }

        if (bestMatch) {
            verbProcessed = true;
            const interaction = bestMatch;

            if (interaction.addsToInventory) {
                const objectToTake = currentScene.objetos.find(o => o.id === interaction.target);
                if (objectToTake && !currentState.inventory.includes(objectToTake.id)) {
                    currentState.inventory.push(objectToTake.id);
                }
            }
            if (interaction.consumesItem && interaction.requiresInInventory) {
                currentState.inventory = currentState.inventory.filter(itemId => itemId !== interaction.requiresInInventory);
            }
            if (interaction.removesTargetFromScene) {
                const sceneState = currentState.scenesState[currentState.currentSceneId];
                if (sceneState.objetos) {
                    sceneState.objetos = sceneState.objetos.filter(obj => obj.id !== interaction.target);
                }
            }

            let consequenceTriggered = false;

            if (gameData.gameSystemEnabled === 'trackers' && interaction.trackerEffects && Array.isArray(interaction.trackerEffects)) {
                interaction.trackerEffects.forEach(effect => {
                    if (effect && effect.trackerId && currentState.trackerValues.hasOwnProperty(effect.trackerId)) {
                        currentState.trackerValues[effect.trackerId] += (effect.valueChange || 0);
                    }
                });

                if (gameData.consequenceTrackers && Array.isArray(gameData.consequenceTrackers)) {
                    for (const tracker of gameData.consequenceTrackers) {
                        if (tracker && tracker.id && tracker.consequenceSceneId && currentState.trackerValues[tracker.id] >= tracker.maxValue) {
                            performSceneChange(tracker.consequenceSceneId);
                            consequenceTriggered = true;
                            currentState.diaryLog.push({ type: 'action', data: { command: verbText, response: \`[CONSEQUÊNCIA ATIVADA: \${tracker.name}]\`, sceneId: currentState.currentSceneId } });
                            break;
                        }
                    }
                }
            }
            
            if (!consequenceTriggered) {
                if (interaction.newSceneDescription) {
                    currentState.scenesState[currentState.currentSceneId].description = interaction.newSceneDescription;
                }
                if (interaction.goToScene) {
                    currentState.diaryLog.push({ type: 'action', data: { command: verbText, response: '', sceneId: currentState.currentSceneId } });
                    performSceneChange(interaction.goToScene, interaction.soundEffect, interaction.transitionType);
                } else {
                    if (interaction.newSceneDescription) {
                        responseText = interaction.newSceneDescription;
                        if (sceneDescriptionElement) sceneDescriptionElement.innerHTML = '';
                        currentSceneParagraphs = responseText.split('\\n').filter(p => p.trim() !== '');
                        currentParagraphIndex = 0;
                        renderNextParagraph();
                    }
                     if (interaction.soundEffect && sceneSoundEffectElement) {
                        sceneSoundEffectElement.src = interaction.soundEffect;
                        sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
                    }
                }
            }
        }
        
        if (verbProcessed) {
            if (responseText) {
                currentState.diaryLog.push({ type: 'action', data: { command: verbText, response: responseText, sceneId: currentState.currentSceneId } });
            }
            if (sceneDescriptionElement) sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;
            saveState();
            return;
        }

        // 2. Built-in command processing
        const verbParts = lowerCaseVerbText.split(/\\s+/);
        const verb = verbParts[0];
        const allSceneObjects = [...(currentScene.objetos || []), ...currentState.inventory.map(id => allTakableObjects[id])];
        const targetForBuiltIn = verbParts.slice(1).join(' ');
        
        switch (verb) {
            case 'olhar':
            case 'examinar':
            case 'ver':
                let foundObject = false;
                for (const obj of allSceneObjects) {
                    if (obj && targetForBuiltIn.includes(obj.name.toLowerCase())) {
                        responseText = obj.examineDescription;
                        foundObject = true;
                        break;
                    }
                }
                if (!foundObject) {
                    if (targetForBuiltIn === '' || targetForBuiltIn === 'cena' || targetForBuiltIn === 'ao redor' || targetForBuiltIn === 'lugar') {
                        if (sceneDescriptionElement) sceneDescriptionElement.innerHTML = '';
                         currentSceneParagraphs = currentScene.description.split('\\n').filter(p => p.trim() !== '');
                         currentParagraphIndex = 0;
                         renderNextParagraph();
                         verbProcessed = true;
                    } else {
                        responseText = "Não vejo nenhum(a) " + targetForBuiltIn + " aqui.";
                    }
                }
                break;
            case 'pegar':
            case 'apanhar':
                let objectToTake = null;
                let objectIndex = -1;
                if (currentScene.objetos) {
                    for (let i = 0; i < currentScene.objetos.length; i++) {
                        const obj = currentScene.objetos[i];
                        if (targetForBuiltIn.includes(obj.name.toLowerCase())) {
                            objectToTake = obj;
                            objectIndex = i;
                            break;
                        }
                    }
                }
                if (objectToTake) {
                    if (objectToTake.isTakable) {
                        if (!currentState.inventory.includes(objectToTake.id)) {
                             currentState.inventory.push(objectToTake.id);
                             currentScene.objetos.splice(objectIndex, 1);
                             responseText = objectToTake.name + " adicionado(a) ao inventário.";
                        } else {
                            responseText = "Você já tem isso.";
                        }
                    } else {
                        responseText = "Não consigo pegar " + objectToTake.name + ".";
                    }
                } else {
                     responseText = "Não vejo nenhum(a) " + targetForBuiltIn + " para pegar.";
                }
                break;
            case 'voltar':
                 if (currentState.previousSceneId && currentState.previousSceneId !== currentState.currentSceneId) {
                    const sceneToReturn = currentState.previousSceneId;
                    responseText = '';
                    verbProcessed = true;
                    performSceneChange(sceneToReturn);
                 } else {
                    responseText = "Não há para onde voltar.";
                 }
                 break;
            default:
                if (!verbProcessed) { // Only show default failure if no interaction was matched
                    responseText = gameData.mensagem_falha_padrao;
                }
        }

        if (responseText) {
            const responseP = document.createElement('p');
            responseP.innerHTML = responseText;
            sceneDescriptionElement.appendChild(responseP);
            currentState.diaryLog.push({ type: 'action', data: { command: verbText, response: responseText, sceneId: currentState.currentSceneId } });
        }
        
        if (sceneDescriptionElement) sceneDescriptionElement.scrollTop = sceneDescriptionElement.scrollHeight;
    }

    // --- UI Logic ---
    function populateAndShowPopup(type) {
        if (!actionPopup) return;
        
        // Hide other popups
        if (trackersPopup) trackersPopup.classList.add('hidden');

        actionPopup.innerHTML = '';
        let content = '<div class="action-popup-list">';

        if (type === 'inventory') {
            if (currentState.inventory.length === 0) {
                content += '<p>O inventário está vazio.</p>';
            } else {
                currentState.inventory.forEach(itemId => {
                    const item = allTakableObjects[itemId];
                    if (item) {
                        content += \`<button data-item-name="\${item.name}" title="\${item.examineDescription}">\${item.name}</button>\`;
                    }
                });
            }
        } else if (type === 'suggestions') {
            const currentScene = currentState.scenesState[currentState.currentSceneId];
            const suggestedVerbs = new Set();

            const capitalize = (s) => {
                if (typeof s !== 'string' || !s) return '';
                return s.charAt(0).toUpperCase() + s.slice(1);
            };

            // Add verbs from all interactions in the scene
            if (currentScene.interactions) {
                currentScene.interactions.forEach(interaction => {
                    interaction.verbs.forEach(verb => suggestedVerbs.add(capitalize(verb)));
                });
            }

            // Add verbs based on objects present
            if (currentScene.objetos && currentScene.objetos.length > 0) {
                suggestedVerbs.add('Olhar');
                suggestedVerbs.add('Examinar');
                if (currentScene.objetos.some(obj => obj.isTakable)) {
                    suggestedVerbs.add('Pegar');
                }
            } else {
                // Can still look at the scene itself
                suggestedVerbs.add('Olhar');
                suggestedVerbs.add('Examinar');
            }
            
            // Add 'Voltar' if applicable
            if (currentState.previousSceneId) {
                suggestedVerbs.add('Voltar');
            }
            
            // Add fixed verbs
            if (gameData.fixedVerbs && gameData.fixedVerbs.length > 0) {
                gameData.fixedVerbs.forEach(fixed => {
                    if (fixed.verbs && fixed.verbs.length > 0) {
                        suggestedVerbs.add(capitalize(fixed.verbs[0]));
                    }
                });
            }

            if (suggestedVerbs.size === 0) {
                content += '<p>Nenhuma sugestão óbvia no momento.</p>';
            } else {
                const sortedVerbs = Array.from(suggestedVerbs).sort();
                sortedVerbs.forEach(verb => {
                    content += \`<button data-verb="\${verb}">\${verb}</button>\`;
                });
            }
        }

        content += '</div>';
        actionPopup.innerHTML = content;
        actionPopup.classList.remove('hidden');

        if (type === 'suggestions') {
            actionPopup.querySelectorAll('button[data-verb]').forEach(button => {
                button.addEventListener('click', () => {
                    if(verbInputElement) {
                        const verb = button.getAttribute('data-verb');
                        const currentValue = verbInputElement.value.trim();
                        verbInputElement.value = (verb + ' ' + currentValue).trim() + ' ';
                        verbInputElement.focus();
                        actionPopup.classList.add('hidden');
                    }
                });
            });
        }
        if (type === 'inventory') {
            actionPopup.querySelectorAll('button[data-item-name]').forEach(button => {
                button.addEventListener('click', () => {
                    if (verbInputElement) {
                        const itemName = button.getAttribute('data-item-name');
                        const currentValue = verbInputElement.value.trim();
                        verbInputElement.value = (currentValue ? currentValue + ' ' + itemName : itemName) + ' ';
                        verbInputElement.focus();
                        actionPopup.classList.add('hidden');
                    }
                });
            });
        }
    }
    
    function renderDiary() {
        if (!diaryLogElement) return;
        diaryLogElement.innerHTML = '';

        // Group actions by scene
        const scenesVisited = {};
        currentState.diaryLog.forEach(entry => {
            if (entry.type === 'scene_load') {
                scenesVisited[entry.data.id] = {
                    ...entry.data,
                    actions: []
                };
            } else if (entry.type === 'action' && entry.data.sceneId && scenesVisited[entry.data.sceneId]) {
                scenesVisited[entry.data.sceneId].actions.push(entry.data);
            }
        });

        Object.values(scenesVisited).forEach(scene => {
            const div = document.createElement('div');
            div.className = 'diary-entry';
            
            // Process highlights for the diary entry, making them visible but not interactive.
            const processedDescription = scene.description
                .replace(/\\*\\*(.*?)\\*\\*/g, '<span class="highlight-item">$1</span>') // Preserves bolding
                .replace(/<(.*?)>/g, '<span class="highlight-word">$1</span>'); // Handles clickable words

            let textContainerHTML = \`
                <span class="scene-name">\${scene.name}</span>
                <p>\${processedDescription.replace(/\\n/g, '<br>')}</p>
            \`;

            if (scene.actions.length > 0) {
                scene.actions.forEach(action => {
                    let actionHTML = '';
                     if (action.command) {
                        actionHTML += \`<strong>\${gameData.nome_jogador_diario || 'VOCÊ'}:</strong> "\${action.command}"\`;
                    }
                    if (action.response) {
                        if (action.command) {
                            actionHTML += '<br>';
                        }
                        actionHTML += \`<em>\${action.response.replace(/\\n/g, '<br>')}</em>\`;
                    }
                    if (actionHTML.trim()) {
                        textContainerHTML += \`<p class="verb-echo">\${actionHTML}</p>\`;
                    }
                });
            }

            div.innerHTML = \`
                <div class="image-container">
                    <img src="\${scene.image || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}" alt="\${scene.name}">
                </div>
                <div class="text-container">
                    \${textContainerHTML}
                </div>
            \`;
            diaryLogElement.appendChild(div);
        });

        diaryLogElement.scrollTop = diaryLogElement.scrollHeight;
    }


    // --- Initialization ---
    function initializeGame(startFresh = false) {
        if (startFresh) {
            try {
                localStorage.removeItem(SAVE_KEY);
            } catch (e) {
                console.warn("Could not remove saved game state from localStorage:", e);
            }
        }

        gameData = window.embeddedGameData;
        if (!gameData) {
            console.error('Game data not found!');
            if (sceneDescriptionElement) sceneDescriptionElement.textContent = 'Error: Game data is missing.';
            return;
        }
        
        originalScenes = JSON.parse(JSON.stringify(gameData.cenas));
        allTakableObjects = {};
         Object.values(gameData.cenas).forEach(scene => {
            if(scene.objetos) {
                scene.objetos.forEach(obj => {
                    if (obj.isTakable) {
                        allTakableObjects[obj.id] = obj;
                    }
                });
            }
        });

        const hasSave = loadState();

        if (startFresh || !hasSave) {
            currentState.currentSceneId = gameData.cena_inicial;
            currentState.previousSceneId = null;
            currentState.inventory = [];
            currentState.diaryLog = [];
            currentState.scenesState = JSON.parse(JSON.stringify(originalScenes));
            currentState.chances = gameData.gameSystemEnabled === 'chances' ? gameData.gameMaxChances : null;
            
            currentState.trackerValues = {};
            if (gameData.consequenceTrackers && Array.isArray(gameData.consequenceTrackers)) {
                gameData.consequenceTrackers.forEach(tracker => {
                    if (tracker && tracker.id) {
                        currentState.trackerValues[tracker.id] = tracker.initialValue || 0;
                    }
                });
            }
        } else {
            // Reconcile trackers for loaded save games
            const currentTrackers = gameData.consequenceTrackers || [];
            const savedTrackerValues = currentState.trackerValues || {};
            const newTrackerValues = {};
            currentTrackers.forEach(tracker => {
                if (tracker && tracker.id) {
                    if (savedTrackerValues.hasOwnProperty(tracker.id)) {
                        newTrackerValues[tracker.id] = savedTrackerValues[tracker.id];
                    } else {
                        newTrackerValues[tracker.id] = tracker.initialValue || 0;
                    }
                }
            });
            currentState.trackerValues = newTrackerValues;
        }
        
        changeScene(currentState.currentSceneId, hasSave && !startFresh);
        if(gameData.gameSystemEnabled === 'chances') renderChances();
    }
    
    // --- Event Listeners ---
    if (verbInputElement) {
        verbInputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                processVerb();
            }
        });
    }

    if (submitVerbButton) {
        submitVerbButton.addEventListener('click', processVerb);
    }
    
    if (inventoryButton) {
        inventoryButton.addEventListener('click', () => {
             if (actionPopup && !actionPopup.classList.contains('hidden') && actionPopup.querySelector('button[data-item-name]')) {
                actionPopup.classList.add('hidden');
            } else {
                populateAndShowPopup('inventory');
            }
        });
    }

    if (suggestionsButton) {
        suggestionsButton.addEventListener('click', () => {
            if (actionPopup && !actionPopup.classList.contains('hidden') && actionPopup.querySelector('button[data-verb]')) {
                actionPopup.classList.add('hidden');
            } else {
                populateAndShowPopup('suggestions');
            }
        });
    }
    
    if (trackersButton) {
        trackersButton.addEventListener('click', () => {
            if (trackersPopup) {
                if (trackersPopup.classList.contains('hidden')) {
                    renderTrackersUI(); // Update content before showing
                }
                trackersPopup.classList.toggle('hidden');
                // Hide other popups if we are opening this one
                if (!trackersPopup.classList.contains('hidden')) {
                    if (actionPopup) actionPopup.classList.add('hidden');
                }
            }
        });
    }
    
    if (diaryButton) {
        diaryButton.addEventListener('click', () => {
            renderDiary();
            if (diaryModal) diaryModal.classList.remove('hidden');
        });
    }

    if (diaryModalCloseButton) {
        diaryModalCloseButton.addEventListener('click', () => {
            if (diaryModal) diaryModal.classList.add('hidden');
        });
    }
    
    if (startButton) {
        startButton.addEventListener('click', () => {
            initializeGame(true); // Force a fresh start
            if (splashScreen) splashScreen.classList.add('hidden');
            if(sceneNameOverlayElement) {
                setTimeout(() => sceneNameOverlayElement.style.opacity = '1', 500);
            }
        });
    }
    
    endingRestartButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (positiveEndingScreen) positiveEndingScreen.classList.add('hidden');
            if (negativeEndingScreen) negativeEndingScreen.classList.add('hidden');
            if (splashScreen) splashScreen.classList.add('hidden');
            if (gameContainer) gameContainer.classList.remove('hidden');
            
            initializeGame(true); // true to force a fresh start
        });
    });

    if (continueButton) {
        if (!window.isPreview && localStorage.getItem(SAVE_KEY)) {
            continueButton.classList.remove('hidden');
            continueButton.addEventListener('click', () => {
                 if (splashScreen) splashScreen.classList.add('hidden');
                 if(sceneNameOverlayElement) {
                    setTimeout(() => sceneNameOverlayElement.style.opacity = '1', 500);
                }
            });
        }
    }

    // --- Game Start ---
    initializeGame();
});
`