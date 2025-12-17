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
                backgroundMusic: scene.backgroundMusic, // Track specific BGM
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
        gameBackgroundMusic: data.gameBackgroundMusic, // Initial music
        positiveEndingImage: data.positiveEndingImage,
        positiveEndingContentAlignment: data.positiveEndingContentAlignment,
        positiveEndingDescription: data.positiveEndingDescription,
        negativeEndingImage: data.negativeEndingImage,
        negativeEndingContentAlignment: data.negativeEndingContentAlignment,
        negativeEndingDescription: data.negativeEndingDescription,
        gameRestartButtonText: data.gameRestartButtonText,
        gameContinueButtonText: data.gameContinueButtonText,
        // System Menu Texts
        gameSystemButtonText: data.gameSystemButtonText,
        gameSaveMenuTitle: data.gameSaveMenuTitle,
        gameLoadMenuTitle: data.gameLoadMenuTitle,
        gameMainMenuButtonText: data.gameMainMenuButtonText,
        
        fixedVerbs: data.fixedVerbs || [],
        consequenceTrackers: data.consequenceTrackers || [],
        gameShowTrackersUI: data.gameShowTrackersUI,
        // Transitions
        gameTextAnimationType: data.gameTextAnimationType,
        gameTextSpeed: data.gameTextSpeed,
        gameImageTransitionType: data.gameImageTransitionType,
        gameImageSpeed: data.gameImageSpeed,
    };
};

export const gameJS = `
document.addEventListener('DOMContentLoaded', () => {
    // --- Icon SVGs ---
    const ICONS = {
        heart: '<svg fill="%COLOR%" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="%COLOR%" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: '<svg stroke="%COLOR%" stroke-width="4" stroke-linecap="round" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>',
        square: '<svg fill="%COLOR%" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>',
        diamond: '<svg fill="%COLOR%" viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z"/></svg>'
    };
    
    const ICONS_OUTLINE = {
        heart: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: '<svg stroke="%COLOR%" stroke-width="4" stroke-linecap="round" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>',
        square: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>',
        diamond: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z"/></svg>'
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
    let sceneObjectsState = {}; 
    let currentBgmSrc = "";

    const textSpeedVal = gameData.gameTextSpeed || 3; 
    const imgSpeedVal = gameData.gameImageSpeed || 3;
    const typeSpeedBase = Math.max(5, 80 - (textSpeedVal * 15)); 
    const textAnimDuration = Math.max(0.1, 3.0 - (textSpeedVal * 0.5)) + 's';
    const imageAnimDuration = Math.max(0.3, 5.0 - (imgSpeedVal * 1.0)) + 's';
    
    document.documentElement.style.setProperty('--text-anim-speed', textAnimDuration);
    document.documentElement.style.setProperty('--image-anim-speed', imageAnimDuration);

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
    const sceneImageBack = document.getElementById('scene-image-back');
    const sceneDescription = document.getElementById('scene-description');
    const verbInput = document.getElementById('verb-input');
    const submitVerb = document.getElementById('submit-verb');
    const actionPopup = document.getElementById('action-popup');
    const suggestionsButton = document.getElementById('suggestions-button');
    const inventoryButton = document.getElementById('inventory-button');
    const diaryButton = document.getElementById('diary-button');
    const trackersButton = document.getElementById('trackers-button');
    const systemButton = document.getElementById('system-button');
    const sceneNameOverlay = document.getElementById('scene-name-overlay');
    const soundEffectAudio = document.getElementById('scene-sound-effect');
    const bgmAudio = document.getElementById('bgm-audio');
    
    const diaryModal = document.getElementById('diary-modal');
    const diaryLog = document.getElementById('diary-log');
    const trackersModal = document.getElementById('trackers-modal');
    const trackersContent = document.getElementById('trackers-content');
    const itemModal = document.getElementById('item-modal');
    const itemModalName = document.getElementById('item-modal-name');
    const itemModalImageContainer = document.getElementById('item-modal-image-container');
    const itemModalImage = document.getElementById('item-modal-image');
    const itemModalDescription = document.getElementById('item-modal-description');
    
    const systemModal = document.getElementById('system-modal');
    const systemModalTitle = document.getElementById('system-modal-title');
    const systemMenuMain = document.getElementById('system-menu-main');
    const systemSlotsContainer = document.getElementById('system-slots-container');
    const slotsList = document.getElementById('slots-list');
    const btnSaveMenu = document.getElementById('btn-save-menu');
    const btnLoadMenu = document.getElementById('btn-load-menu');
    const btnMainMenu = document.getElementById('btn-main-menu');
    const btnBackSystem = document.getElementById('btn-back-system');
    
    const closeButtons = document.querySelectorAll('.modal-close-button');

    // --- Audio Helpers ---
    const playSound = (src) => {
        if (!src || !soundEffectAudio) return;
        soundEffectAudio.src = src;
        soundEffectAudio.play().catch(e => console.log('Audio play failed', e));
    };

    const playBgm = (src) => {
        if (!bgmAudio) return;
        if (!src) {
            bgmAudio.pause();
            currentBgmSrc = "";
            return;
        }
        if (src === currentBgmSrc) return;
        
        bgmAudio.src = src;
        currentBgmSrc = src;
        bgmAudio.play().catch(e => console.log('BGM play failed. Needs user interaction.', e));
    };

    // --- Initialization ---
    const init = () => {
        const hasAutoSave = localStorage.getItem('if_builder_autosave_' + document.title);
        if (hasAutoSave) {
            continueButton.classList.remove('hidden');
        }

        splashStartButton.addEventListener('click', startGame);
        continueButton.addEventListener('click', () => loadGameFromData(hasAutoSave));
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
        if (systemButton) systemButton.addEventListener('click', toggleSystemMenu);
        
        closeButtons.forEach(btn => btn.addEventListener('click', (e) => {
            e.target.closest('.modal-overlay').classList.add('hidden');
        }));
        
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if(e.target === modal) modal.classList.add('hidden');
            });
        });

        btnSaveMenu.addEventListener('click', () => renderSlots('save'));
        btnLoadMenu.addEventListener('click', () => renderSlots('load'));
        btnBackSystem.addEventListener('click', () => {
            systemSlotsContainer.classList.add('hidden');
            systemMenuMain.classList.remove('hidden');
            systemModalTitle.textContent = gameData.gameSystemButtonText || 'Sistema';
        });
        btnMainMenu.addEventListener('click', () => {
            if (confirm("Voltar ao menu principal? Progresso não salvo manualmente será perdido.")) {
                systemModal.classList.add('hidden');
                splashScreen.classList.remove('hidden');
                playBgm(""); 
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!itemModal.classList.contains('hidden')) {
                    itemModal.classList.add('hidden');
                } else if (!diaryModal.classList.contains('hidden')) {
                    diaryModal.classList.add('hidden');
                } else if (!trackersModal.classList.contains('hidden')) {
                    trackersModal.classList.add('hidden');
                } else if (!systemModal.classList.contains('hidden')) {
                    systemModal.classList.add('hidden');
                } else if (!splashScreen.classList.contains('hidden')) {
                    // Do nothing
                } else {
                    toggleSystemMenu();
                }
            }
        });

        document.addEventListener('click', (e) => {
             if (e.target && e.target.id === 'btn-return-chance') {
                 loadScene(currentSceneId, false);
             }
        });
    };

    const startGame = () => {
        localStorage.removeItem('if_builder_autosave_' + document.title);
        currentSceneId = gameData.cena_inicial;
        inventory = [];
        visitedScenes = [];
        actionLog = [];
        chances = gameData.gameMaxChances || 3;
        isGameEnded = false;
        trackers = {};
        sceneObjectsState = {}; 
        (gameData.consequenceTrackers || []).forEach(t => {
            trackers[t.id] = t.initialValue;
        });
        
        splashScreen.classList.add('hidden');
        
        // Inicia BGM global se definida
        if (gameData.gameBackgroundMusic) {
            playBgm(gameData.gameBackgroundMusic);
        }

        loadScene(currentSceneId, false); 
    };

    const loadGameFromData = (jsonString) => {
        try {
            if (jsonString) {
                const save = JSON.parse(jsonString);
                if (save) {
                    currentSceneId = save.currentSceneId;
                    inventory = save.inventory;
                    visitedScenes = save.visitedScenes || [];
                    actionLog = save.actionLog || [];
                    chances = save.chances;
                    trackers = save.trackers || {};
                    sceneObjectsState = save.sceneObjectsState || {};

                    splashScreen.classList.add('hidden');
                    systemModal.classList.add('hidden');
                    
                    // Resume BGM logic
                    const startScene = gameData.cenas[currentSceneId];
                    if (startScene && startScene.backgroundMusic) {
                        playBgm(startScene.backgroundMusic);
                    } else if (gameData.gameBackgroundMusic) {
                        playBgm(gameData.gameBackgroundMusic);
                    }

                    loadScene(currentSceneId, false);
                } else {
                    startGame();
                }
            }
        } catch (e) {
            console.error("Failed to load save:", e);
            startGame();
        }
    };

    const autoSaveGame = () => {
        if (window.isPreview) return; 
        const save = {
            currentSceneId,
            inventory,
            visitedScenes,
            actionLog,
            chances,
            trackers,
            sceneObjectsState,
            timestamp: new Date().toLocaleString()
        };
        localStorage.setItem('if_builder_autosave_' + document.title, JSON.stringify(save));
    };

    const toggleSystemMenu = () => {
        if (systemModal.classList.contains('hidden')) {
            systemModal.classList.remove('hidden');
            systemMenuMain.classList.remove('hidden');
            systemSlotsContainer.classList.add('hidden');
            systemModalTitle.textContent = gameData.gameSystemButtonText || 'Sistema';
        } else {
            systemModal.classList.add('hidden');
        }
    };

    const renderSlots = (mode) => {
        systemMenuMain.classList.add('hidden');
        systemSlotsContainer.classList.remove('hidden');
        slotsList.innerHTML = '';
        
        systemModalTitle.textContent = mode === 'save' 
            ? (gameData.gameSaveMenuTitle || 'Salvar Jogo') 
            : (gameData.gameLoadMenuTitle || 'Carregar Jogo');

        for (let i = 1; i <= 3; i++) {
            const slotKey = 'if_builder_slot_' + i + '_' + document.title;
            const savedData = localStorage.getItem(slotKey);
            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot-item';
            
            let contentHtml = '';
            if (savedData) {
                const data = JSON.parse(savedData);
                const sceneName = gameData.cenas[data.currentSceneId] ? gameData.cenas[data.currentSceneId].name : 'Desconhecido';
                contentHtml = '<div class="slot-info">' +
                    '<span class="slot-title">Slot ' + i + ' - ' + sceneName + '</span>' +
                    '<span class="slot-meta">' + data.timestamp + '</span>' +
                    '</div>';
                if (mode === 'save') {
                    contentHtml += '<div class="slot-actions"><span class="highlight-word">Sobrescrever</span></div>';
                } else {
                    contentHtml += '<div class="slot-actions">' +
                        '<button class="slot-delete-btn" data-slot="' + i + '">×</button>' +
                        '</div>';
                }
            } else {
                contentHtml = '<div class="slot-info">' +
                    '<span class="slot-title">Slot ' + i + '</span>' +
                    '<span class="slot-empty">Vazio</span>' +
                    '</div>';
                if (mode === 'save') {
                    contentHtml += '<div class="slot-actions"><span class="highlight-word">Salvar</span></div>';
                }
            }
            
            slotDiv.innerHTML = contentHtml;
            slotDiv.addEventListener('click', (e) => {
                if (e.target.classList.contains('slot-delete-btn')) return;
                if (mode === 'save') {
                    performSave(i);
                } else if (mode === 'load' && savedData) {
                    loadGameFromData(savedData);
                }
            });

            const deleteBtn = slotDiv.querySelector('.slot-delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Apagar este save?')) {
                        localStorage.removeItem(slotKey);
                        renderSlots(mode);
                    }
                });
            }
            slotsList.appendChild(slotDiv);
        }
    };

    const performSave = (slotIndex) => {
        const slotKey = 'if_builder_slot_' + slotIndex + '_' + document.title;
        const save = {
            currentSceneId,
            inventory,
            visitedScenes,
            actionLog,
            chances,
            trackers,
            sceneObjectsState,
            timestamp: new Date().toLocaleString()
        };
        localStorage.setItem(slotKey, JSON.stringify(save));
        alert('Jogo salvo no Slot ' + slotIndex);
        renderSlots('save');
    };

    const getObjectsForScene = (sceneId) => {
        if (sceneObjectsState[sceneId]) {
            return sceneObjectsState[sceneId];
        }
        const scene = gameData.cenas[sceneId];
        if (!scene) return [];
        const objects = (scene.objectIds || []).map(id => {
            const globalObj = gameData.globalObjects[id];
            return globalObj ? JSON.parse(JSON.stringify(globalObj)) : null;
        }).filter(obj => obj !== null);
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
        if (!scene) return;
        
        // BGM Change logic: If scene defines a BGM, switch to it.
        if (scene.backgroundMusic) {
            playBgm(scene.backgroundMusic);
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
        if (!visitedScenes.includes(sceneId)) visitedScenes.push(sceneId);
        actionLog.push({ type: 'scene', name: scene.name, timestamp: new Date().toLocaleTimeString(), description: scene.description, image: scene.image });
        let effectiveTransition = transitionType === 'none' || !transitionType ? (gameData.gameImageTransitionType || 'fade') : transitionType;
        if (effectiveTransition === 'none') transition = false;
        if (transition && sceneImage && sceneImageBack) {
             sceneImageBack.src = scene.image || '';
             sceneImageBack.classList.toggle('hidden', !scene.image);
             if (sceneImage.src) {
                 sceneImage.classList.remove('hidden');
                 const animClass = 'trans-' + effectiveTransition + '-out';
                 sceneImage.classList.add(animClass);
                 const durationMs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--image-anim-speed')) * 1000;
                 setTimeout(() => {
                     renderScene(scene);
                     sceneImage.classList.remove(animClass);
                     sceneImageBack.src = '';
                     sceneImageBack.classList.add('hidden');
                 }, durationMs + 50);
             } else {
                 renderScene(scene);
             }
        } else {
            if (sceneImageBack) {
                sceneImageBack.src = ''; 
                sceneImageBack.classList.add('hidden');
            }
            renderScene(scene);
        }
        autoSaveGame();
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
            setTimeout(() => { sceneNameOverlay.style.opacity = '0'; }, 3000);
        }
        sceneDescription.innerHTML = '';
        const rawDesc = scene.description;
        const paragraphs = rawDesc.split('\\n').filter(p => p.trim().length > 0);
        let pIndex = 0;
        const textAnimType = gameData.gameTextAnimationType || 'fade';

        const setupHighlights = (element) => {
            element.querySelectorAll('.highlight-word').forEach(span => {
                span.addEventListener('click', (e) => {
                    e.stopPropagation();
                    verbInput.value = span.dataset.word;
                    verbInput.focus();
                });
            });
        };

        const renderNextParagraph = () => {
            if (pIndex >= paragraphs.length) {
                if (scene.isEndingScene) setTimeout(gameWin, 2000);
                return;
            }
            const pText = paragraphs[pIndex];
            const p = document.createElement('p');
            const formatText = (text) => text.replace(/<([^>]+)>/g, '<span class="highlight-word" data-word="$1">$1</span>');
            const formattedHTML = formatText(pText);
            
            if (textAnimType === 'typewriter') {
                p.className = 'scene-paragraph typewriter-cursor';
                p.style.opacity = '1'; 
                p.innerHTML = formattedHTML; // Set full HTML structure first
                sceneDescription.appendChild(p);

                const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
                let node;
                const textNodes = [];
                while(node = walker.nextNode()) textNodes.push(node);
                
                const fullTexts = textNodes.map(n => n.nodeValue);
                textNodes.forEach(n => n.nodeValue = ''); // Hide content
                
                let nodeIdx = 0;
                let charIdx = 0;
                
                const type = () => {
                    if (nodeIdx >= textNodes.length) {
                        p.classList.remove('typewriter-cursor');
                        setupHighlights(p);
                        finishParagraph();
                        return;
                    }
                    
                    const currentNode = textNodes[nodeIdx];
                    const fullText = fullTexts[nodeIdx];
                    
                    if (charIdx < fullText.length) {
                        currentNode.nodeValue += fullText[charIdx];
                        charIdx++;
                        if (sceneDescription) sceneDescription.scrollTop = sceneDescription.scrollHeight;
                        setTimeout(type, typeSpeedBase);
                    } else {
                        nodeIdx++;
                        charIdx = 0;
                        type();
                    }
                };
                type();
            } else {
                p.innerHTML = formattedHTML;
                p.className = 'scene-paragraph';
                sceneDescription.appendChild(p);
                setupHighlights(p);
                finishParagraph();
            }
        };

        const finishParagraph = () => {
            pIndex++;
            if (pIndex < paragraphs.length) {
                const continueBtn = document.createElement('div');
                continueBtn.className = 'continue-indicator';
                continueBtn.innerHTML = '<span>▼</span>';
                const continueHandler = (e) => {
                    if(e) e.stopPropagation();
                    continueBtn.remove();
                    sceneDescription.removeEventListener('click', continueHandler);
                    renderNextParagraph();
                };
                continueBtn.addEventListener('click', continueHandler);
                sceneDescription.addEventListener('click', continueHandler);
                sceneDescription.appendChild(continueBtn);
                sceneDescription.scrollTop = sceneDescription.scrollHeight;
            } else {
                sceneDescription.scrollTop = sceneDescription.scrollHeight;
                verbInput.focus();
                if (scene.isEndingScene) setTimeout(gameWin, 2000);
            }
        };
        renderNextParagraph();
        const chancesContainer = document.getElementById('chances-container');
        if (chancesContainer && gameData.gameSystemEnabled === 'chances') {
            chancesContainer.innerHTML = '';
            const iconSvg = ICONS[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
            const iconOutlineSvg = ICONS_OUTLINE[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
            for (let i = 0; i < (gameData.gameMaxChances || 3); i++) {
                const icon = document.createElement('div');
                icon.className = 'chance-icon ' + (i < chances ? '' : 'lost');
                icon.innerHTML = i < chances ? iconSvg : iconOutlineSvg;
                chancesContainer.appendChild(icon);
            }
        }
        closeActionPopup();
        verbInput.value = '';
    };

    const gameOver = () => {
        isGameEnded = true;
        negativeEndingScreen.classList.remove('hidden');
        localStorage.removeItem('if_builder_autosave_' + document.title);
        playBgm(""); // Stop music on game over
    };

    const gameWin = () => {
        isGameEnded = true;
        positiveEndingScreen.classList.remove('hidden');
        localStorage.removeItem('if_builder_autosave_' + document.title);
        // Maybe keep music for victory?
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
        const sceneObjects = getObjectsForScene(currentSceneId); 
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
                } else return false;
            }
            if (i.requiresInInventory && !inventory.some(o => o.id === i.requiresInInventory)) return false;
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
             if (sceneObj) { printOutput(sceneObj.examineDescription); return; }
             const invObj = inventory.find(item => hasWord(item.name.toLowerCase(), inputLower));
             if (invObj) { printOutput(invObj.examineDescription); return; }
             printOutput(scene.description.replace(/<|>/g, ''));
             return;
        }
        const takeVerbs = ['pegar', 'coletar', 'apanhar', 'levar'];
        if (takeVerbs.some(v => hasWord(v, inputLower))) {
             const sceneObj = sceneObjects.find(o => hasWord(o.name.toLowerCase(), inputLower));
             if (sceneObj) {
                 if (sceneObj.isTakable) {
                     addToInventory(sceneObj);
                     const newObjects = sceneObjects.filter(o => o.id !== sceneObj.id);
                     updateSceneObjects(currentSceneId, newObjects);
                     printOutput('Você pegou ' + sceneObj.name + '.');
                     return;
                 } else { printOutput("Você não pode pegar isso."); return; }
             }
        }
        if (hasWord('ajuda', inputLower) || hasWord('help', inputLower) || inputLower === '?') {
             printOutput("Descubra o que fazer interagindo com o cenário. Tente combinar ações e objetos, como 'examinar mesa', 'usar chave', 'empurrar porta'.");
             return;
        }
        printOutput(gameData.mensagem_falha_padrao || "Não aconteceu nada.");
    };

    const executeInteraction = (interaction) => {
        if (interaction.consumesItem && interaction.requiresInInventory) {
            removeFromInventory(interaction.requiresInInventory);
            printOutput("(Item perdido: " + findItemName(interaction.requiresInInventory) + ")");
        }
        if (interaction.trackerEffects) updateTrackers(interaction.trackerEffects);
        if (interaction.removesTargetFromScene) {
             const sceneObjects = getObjectsForScene(currentSceneId);
             const newObjects = sceneObjects.filter(o => o.id !== interaction.target);
             updateSceneObjects(currentSceneId, newObjects);
        }
        if (interaction.soundEffect) playSound(interaction.soundEffect);
        if (interaction.goToScene) loadScene(interaction.goToScene, true, interaction.transitionType);
        else {
            if (interaction.newSceneDescription) {
                 gameData.cenas[currentSceneId].description = interaction.newSceneDescription;
                 renderScene(gameData.cenas[currentSceneId]);
            }
            if (interaction.successMessage) printOutput(interaction.successMessage);
        }
    };

    const printOutput = (text) => {
        const p = document.createElement('p');
        p.textContent = text;
        p.className = 'scene-paragraph';
        sceneDescription.appendChild(p);
        sceneDescription.scrollTop = sceneDescription.scrollHeight;
        actionLog.push({ type: 'output', text: text });
    };

    const findItemInInventoryById = (id) => inventory.find(o => o.id === id) || null;
    const findItemName = (id) => { const item = findItemInInventoryById(id) || gameData.globalObjects[id]; return item ? item.name : 'item'; };
    const addToInventory = (obj) => { if (!inventory.some(o => o.id === obj.id)) inventory.push(obj); };
    const removeFromInventory = (id) => { inventory = inventory.filter(i => i.id !== id); };
    const togglePopup = (type) => { if (!actionPopup.classList.contains('hidden') && activePopupSource === type) closeActionPopup(); else { if (type === 'suggestions') showSuggestions(); if (type === 'inventory') showInventory(); activePopupSource = type; } };
    const closeActionPopup = () => { actionPopup.classList.add('hidden'); activePopupSource = null; };
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
                btn.addEventListener('click', () => { verbInput.value = 'examinar ' + obj.name; closeActionPopup(); handleInput(); });
                row1.appendChild(btn);
            });
            container.appendChild(row1);
        }
        const row2 = document.createElement('div');
        row2.className = 'action-popup-row';
        const verbs = ['Examinar', 'Empurrar', 'Puxar', 'Chutar', 'Falar'];
        verbs.forEach(verb => {
             const btn = document.createElement('button');
             btn.textContent = verb;
             btn.addEventListener('click', () => { verbInput.value = verb.toLowerCase() + ' '; verbInput.focus(); closeActionPopup(); });
             row2.appendChild(btn);
        });
        ['Olhar ao redor', 'Ajuda'].forEach(action => {
             const btn = document.createElement('button');
             btn.textContent = action;
             btn.addEventListener('click', () => { if (action === 'Olhar ao redor') verbInput.value = 'olhar'; if (action === 'Ajuda') verbInput.value = 'ajuda'; closeActionPopup(); handleInput(); });
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
                    btn.addEventListener('click', (e) => { e.stopPropagation(); openItemModal(item); closeActionPopup(); });
                    list.appendChild(btn);
                }
            });
        }
        actionPopup.appendChild(list);
    };
    const openItemModal = (item) => {
        itemModalName.textContent = item.name;
        itemModalDescription.textContent = item.examineDescription;
        if (item.image) { itemModalImage.src = item.image; itemModalImageContainer.classList.remove('hidden'); }
        else { itemModalImage.src = ''; itemModalImageContainer.classList.add('hidden'); }
        itemModal.classList.remove('hidden');
    };
    const showDiary = () => {
        diaryLog.innerHTML = '';
        actionLog.forEach(entry => {
            if (entry.type === 'scene') {
                const div = document.createElement('div');
                div.className = 'diary-entry';
                if (entry.image) { const imgContainer = document.createElement('div'); imgContainer.className = 'image-container'; const img = document.createElement('img'); img.src = entry.image; imgContainer.appendChild(img); div.appendChild(imgContainer); }
                const textContainer = document.createElement('div'); textContainer.className = 'text-container'; const title = document.createElement('span'); title.className = 'scene-name'; title.textContent = entry.name; const desc = document.createElement('p'); desc.textContent = entry.description ? entry.description.replace(/<|>/g, '') : ''; textContainer.appendChild(title); textContainer.appendChild(desc); div.appendChild(textContainer); diaryLog.appendChild(div);
            } else if (entry.type === 'input') {
                const p = document.createElement('p'); p.className = 'diary-input'; p.textContent = entry.text; diaryLog.appendChild(p);
            } else if (entry.type === 'output') {
                const p = document.createElement('p'); p.className = 'diary-output'; p.textContent = entry.text; diaryLog.appendChild(p);
            }
        });
        diaryModal.classList.remove('hidden');
        setTimeout(() => { diaryLog.scrollTop = diaryLog.scrollHeight; }, 10);
    };
    const showTrackers = () => {
        trackersContent.innerHTML = '';
        const defs = gameData.consequenceTrackers || [];
        if (defs.length === 0) trackersContent.textContent = 'Nenhum rastreador ativo.';
        else {
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
                if (!def.hideValue) { const valSpan = document.createElement('span'); valSpan.className = 'tracker-item-values'; valSpan.textContent = val + ' / ' + def.maxValue; header.appendChild(valSpan); }
                item.appendChild(header);
                const barContainer = document.createElement('div');
                barContainer.className = 'tracker-bar-container';
                const bar = document.createElement('div');
                bar.className = 'tracker-bar';
                let width = def.invertBar ? (100 - percentage) : percentage;
                bar.style.width = width + '%';
                if (def.barColor) bar.style.backgroundColor = def.barColor;
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