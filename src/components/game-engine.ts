import { GameData, Scene, Vignette, Interaction } from '../types';

export const migrateLegacyProject = (data: GameData): GameData => {
    let cleanedScenes = { ...data.scenes };
    let newStartSceneId = data.startScene;
    const newSceneOrder = [...(data.sceneOrder || Object.keys(cleanedScenes))];
    let vignettes = data.vignettes || [];

    // MIGRATION: Auto-convert Legacy Vignettes to Scenes
    if (vignettes.length > 0) {
        console.log("Migrating legacy vignettes...", vignettes);
        vignettes.forEach((v: any) => {
            // Determine type
            let type: 'opening' | 'transition' | 'conclusion' | 'none' = 'transition';
            if (v.isConclusion) type = 'conclusion';
            else if (v.id.toUpperCase().includes('OPENING') || v.id.toUpperCase().includes('INTRO')) type = 'opening';

            // Check if scene already exists (idempotency)
            if (cleanedScenes[v.id]) return;

            // Create new Scene from Vignette
            const newScene: Scene = {
                id: v.id,
                name: v.name || v.title || 'Vinheta',
                description: v.description || '', // Map description to scene text
                image: v.image,
                backgroundMusic: v.backgroundMusic,
                vignetteType: type,
                vignetteButtonText: v.buttonText,
                // Default properties for a scene
                interactions: [],
                objectIds: [],
                mapX: 0, // Will be arranged later
                mapY: 0
            };

            // Link Opening Vignette to the original Start Scene
            if (type === 'opening') {
                if (data.startScene) {
                    newScene.vignetteNextSceneId = data.startScene;
                }
                newStartSceneId = v.id; // Set this as the new entry point
            }

            // Add to scenes
            cleanedScenes[v.id] = newScene;
            if (!newSceneOrder.includes(v.id)) {
                // Prepend opening, append others
                if (type === 'opening') newSceneOrder.unshift(v.id);
                else newSceneOrder.push(v.id);
            }
        });

        // Update Interactions to point to new scenes instead of vignettes
        Object.values(cleanedScenes).forEach(scene => {
            if (scene.interactions) {
                scene.interactions = scene.interactions.map(interaction => {
                    // Check if this interaction was pointing to a vignette
                    // Legacy data might have 'goToVignette' property or specific logic
                    if ((interaction as any).goToVignette) {
                        const targetVignetteId = (interaction as any).goToVignette;
                        // Check if this ID exists in our new scenes (was migrated)
                        if (cleanedScenes[targetVignetteId]) {
                            return {
                                ...interaction,
                                type: 'scene', // Change type to scene
                                goToScene: targetVignetteId,
                                goToVignette: undefined // Remove legacy prop
                            } as Interaction;
                        }
                    }
                    return interaction;
                });
            }
        });

        // Clear vignettes array after successful migration
        vignettes = [];
    }

    // Ensure all scenes have required fields
    Object.keys(cleanedScenes).forEach(id => {
        cleanedScenes[id] = {
            ...cleanedScenes[id],
            objectIds: cleanedScenes[id].objectIds || [],
            interactions: cleanedScenes[id].interactions || [],
            // We don't reset mapX/Y here to preserve if they exist, but Editor handles auto-layout if missing
            // Clean legacy props
            isEndingScene: undefined,
            conclusionVignetteId: undefined
        };
    });

    return {
        ...data,
        scenes: cleanedScenes,
        sceneOrder: newSceneOrder,
        startScene: newStartSceneId,
        vignettes: vignettes
    };
};

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
                backgroundMusic: scene.backgroundMusic,
                interactions: scene.interactions,
                exits: scene.exits,
                isEndingScene: scene.isEndingScene,
                removesChanceOnEntry: scene.removesChanceOnEntry,
                restoresChanceOnEntry: scene.restoresChanceOnEntry,
                objectIds: scene.objectIds || [],
                choices: scene.choices || [],
                vignetteType: scene.vignetteType,
                vignetteNextSceneId: scene.vignetteNextSceneId,
                vignetteButtonText: scene.vignetteButtonText
            };
        }
    }
    return {
        cena_inicial: data.startScene,
        cenas: translatedCenas,
        globalObjects: data.globalObjects,
        mensagem_falha_padrao: data.defaultFailureMessage,
        nome_jogador_diario: data.gameDiaryPlayerName,
        gameSystemEnabled: data.gameSystemEnabled,
        gameMaxChances: data.gameMaxChances,
        gameChanceIcon: data.gameChanceIcon,
        gameChanceIconColor: data.gameChanceIconColor,
        gameChanceReturnButtonText: data.gameChanceReturnButtonText,
        gameTheme: data.gameTheme,
        gameTextColorLight: data.textColorLight,
        gameTitleColorLight: data.titleColorLight,
        gameFocusColorLight: data.focusColorLight,
        gameTextReadingFlow: data.gameTextReadingFlow,
        gameBackgroundMusic: data.gameBackgroundMusic,
        positiveEndingImage: data.positiveEndingImage,
        positiveEndingContentAlignment: data.positiveEndingContentAlignment,
        positiveEndingDescription: data.positiveEndingDescription,
        positiveEndingMusic: data.positiveEndingMusic,
        negativeEndingImage: data.negativeEndingImage,
        negativeEndingContentAlignment: data.negativeEndingContentAlignment,
        negativeEndingDescription: data.negativeEndingDescription,
        negativeEndingMusic: data.negativeEndingMusic,
        gameRestartButtonText: data.gameRestartButtonText,
        gameContinueButtonText: data.gameContinueButtonText,
        gameSystemButtonText: data.gameSystemButtonText,
        gameSaveMenuTitle: data.gameSaveMenuTitle,
        gameLoadMenuTitle: data.gameLoadMenuTitle,
        gameMainMenuButtonText: data.gameMainMenuButtonText,
        gameViewEndingButtonText: data.gameViewEndingButtonText,
        fixedVerbs: data.fixedVerbs || [],
        consequenceTrackers: data.consequenceTrackers || [],
        gameShowTrackersUI: data.gameShowTrackersUI,
        gameShowSystemButton: data.gameShowSystemButton,
        gameTextAnimationType: data.gameTextAnimationType,
        gameTextSpeed: data.gameTextSpeed,
        gameImageTransitionType: data.gameImageTransitionType,
        gameImageSpeed: data.gameImageSpeed,
        enableInventory: data.enableInventory,
        enableChances: data.enableChances === true || (data.gameSystemEnabled === 'chances') || Object.values(data.scenes).some((s: any) => s.removesChanceOnEntry || s.restoresChanceOnEntry),
        enableTrackers: data.enableTrackers ?? (data.gameSystemEnabled === 'trackers'),
        enableDiary: data.enableDiary,
        enableFixedVerbs: data.enableFixedVerbs,
        enableImages: data.enableImages,
        enableTextControl: data.enableTextControl,
        gameInteractionType: data.gameInteractionType,
    };
};

export const gameJS = `
document.addEventListener('DOMContentLoaded', () => {
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
        cross: '<svg stroke="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>',
        square: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>',
        diamond: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z"/></svg>'
    };

    const gameData = window.embeddedGameData;
    let currentSceneId = gameData.cena_inicial;
    let inventory = [];
    let visitedScenes = []; 
    let actionLog = []; 
    let chances = gameData.gameMaxChances || 3;
    let isGameEnded = false;
    let trackers = {};
    let removedObjectsFromScenes = {}; 
    let currentBgmSrc = "";
    let isPrinting = false;
    let activePopupType = null;

    const textSpeedVal = gameData.gameTextSpeed || 3; 
    const imgSpeedVal = gameData.gameImageSpeed || 3;
    const typeSpeedBase = Math.max(5, 80 - (textSpeedVal * 15)); 
    const textAnimDuration = Math.max(0.1, 3.0 - (textSpeedVal * 0.5)) + 's';
    const imageAnimDuration = Math.max(0.3, 5.0 - (imgSpeedVal * 0.9)) + 's';
    
    document.documentElement.style.setProperty('--text-anim-speed', textAnimDuration);
    document.documentElement.style.setProperty('--image-anim-speed', imageAnimDuration);

    (gameData.consequenceTrackers || []).forEach(t => { trackers[t.id] = t.initialValue; });

    const splashScreen = document.getElementById('splash-screen');
    const positiveEndingScreen = document.getElementById('positive-ending-screen');
    const negativeEndingScreen = document.getElementById('negative-ending-screen');
    const splashStartButton = document.getElementById('splash-start-button');
    const continueButton = document.getElementById('continue-button');
    const endingRestartButtons = document.querySelectorAll('.ending-restart-button');
    
    const gameContainer = document.getElementById('game-container');
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
    
    const standardActionBar = document.getElementById('standard-action-bar');
    const endingActionBar = document.getElementById('ending-action-bar');
    const viewEndingButton = document.getElementById('view-ending-button');
    
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

    const playSound = (src) => { if (src && soundEffectAudio) { soundEffectAudio.src = src; soundEffectAudio.play().catch(e => {}); } };

    let bgmFadeInterval = null;
    const playBgm = (src) => {
        if (!bgmAudio) return;
        if (src === currentBgmSrc) {
            if (bgmAudio.paused && src) {
                bgmAudio.play().catch(e => {});
            }
            return;
        }
        
        const fadeOut = (callback) => {
            if (bgmFadeInterval) clearInterval(bgmFadeInterval);
            let vol = bgmAudio.volume;
            bgmFadeInterval = setInterval(() => {
                vol -= 0.1;
                if (vol <= 0) {
                    clearInterval(bgmFadeInterval);
                    bgmAudio.pause();
                    bgmAudio.volume = 0;
                    callback();
                } else {
                    bgmAudio.volume = Math.max(0, vol);
                }
            }, 50);
        };

        const fadeIn = () => {
            if (bgmFadeInterval) clearInterval(bgmFadeInterval);
            bgmAudio.volume = 0;
            bgmAudio.play().catch(e => {});
            let vol = 0;
            bgmFadeInterval = setInterval(() => {
                vol += 0.1;
                if (vol >= 1) {
                    clearInterval(bgmFadeInterval);
                    bgmAudio.volume = 1;
                } else {
                    bgmAudio.volume = Math.min(1, vol);
                }
            }, 50);
        };

        if (bgmAudio.src && !bgmAudio.paused) {
            fadeOut(() => {
                if (!src) { currentBgmSrc = ""; return; }
                bgmAudio.src = src;
                currentBgmSrc = src;
                fadeIn();
            });
        } else {
            if (!src) { currentBgmSrc = ""; return; }
            bgmAudio.src = src;
            currentBgmSrc = src;
            fadeIn();
        }
    };

    const init = () => {
        if (gameData.gameInteractionType === 'choice') {
            if (suggestionsButton) suggestionsButton.classList.add('hidden');
            if (inventoryButton) inventoryButton.classList.add('hidden');
        }

        if (gameData.gameBackgroundMusic) {
            playBgm(gameData.gameBackgroundMusic);
        }

        const startAudioOnInteraction = () => {
            if (gameData.gameBackgroundMusic && bgmAudio.paused && !isGameEnded) {
                playBgm(gameData.gameBackgroundMusic);
            }
            document.removeEventListener('mousedown', startAudioOnInteraction);
            document.removeEventListener('keydown', startAudioOnInteraction);
        };
        document.addEventListener('mousedown', startAudioOnInteraction);
        document.addEventListener('keydown', startAudioOnInteraction);

        const hasAutoSave = localStorage.getItem('if_builder_autosave_' + document.title);
        if (hasAutoSave && !window.isPreview) continueButton.classList.remove('hidden');
        splashStartButton.addEventListener('click', startGame);
        continueButton.addEventListener('click', () => loadGameFromData(hasAutoSave));
        endingRestartButtons.forEach(btn => btn.addEventListener('click', () => {
             positiveEndingScreen.classList.add('hidden'); 
             negativeEndingScreen.classList.add('hidden'); 
             gameContainer.classList.remove('fade-out');
             startGame();
        }));
        submitVerb.addEventListener('click', handleInput);
        verbInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleInput(); });
        suggestionsButton.addEventListener('click', () => togglePopup('suggestions'));
        inventoryButton.addEventListener('click', () => togglePopup('inventory'));
        diaryButton.addEventListener('click', showDiary);
        if (trackersButton) trackersButton.addEventListener('click', showTrackers);
        if (systemButton) systemButton.addEventListener('click', toggleSystemMenu);
        closeButtons.forEach(btn => btn.addEventListener('click', (e) => { e.target.closest('.modal-overlay').classList.add('hidden'); }));
        btnSaveMenu.addEventListener('click', () => renderSlots('save'));
        btnLoadMenu.addEventListener('click', () => renderSlots('load'));
        btnBackSystem.addEventListener('click', () => { systemSlotsContainer.classList.add('hidden'); systemMenuMain.classList.remove('hidden'); systemModalTitle.textContent = gameData.gameSystemButtonText || 'Sistema'; });
        
        viewEndingButton.addEventListener('click', () => {
             const isWin = isGameEnded === 'win';
             const endScreen = isWin ? positiveEndingScreen : negativeEndingScreen;
             const endMusic = isWin ? gameData.positiveEndingMusic : gameData.negativeEndingMusic;
             if (endMusic) playBgm(endMusic); else playBgm("");
             endScreen.style.zIndex = '0';
             endScreen.classList.remove('hidden');
             gameContainer.classList.add('fade-out');
             setTimeout(() => {
                gameContainer.classList.add('hidden');
                endScreen.style.zIndex = ''; 
             }, 1000);
        });
        
        btnMainMenu.onclick = (e) => {
            systemModal.classList.add('hidden');
            splashScreen.classList.remove('fade-out');
            splashScreen.classList.remove('hidden');
            isGameEnded = false; 
            if (gameData.gameBackgroundMusic) playBgm(gameData.gameBackgroundMusic);
            else playBgm("");
        };
        if (window.isSceneTest) startGame();
    };

    const startGame = () => {
        if (!window.isPreview) localStorage.removeItem('if_builder_autosave_' + document.title);
        currentSceneId = gameData.cena_inicial; 
        inventory = []; 
        visitedScenes = []; 
        actionLog = []; 
        chances = gameData.gameMaxChances || 3; 
        trackers = {}; 
        removedObjectsFromScenes = {};
        isGameEnded = false;
        (gameData.consequenceTrackers || []).forEach(t => { trackers[t.id] = t.initialValue; });
        loadScene(currentSceneId, false); 
        standardActionBar.classList.remove('hidden');
        endingActionBar.classList.add('hidden');
        splashScreen.classList.remove('hidden');
        splashScreen.classList.add('fade-out');
        setTimeout(() => { splashScreen.classList.add('hidden'); splashScreen.classList.remove('fade-out'); }, 1000);
    };

    const loadGameFromData = (jsonString) => {
        try {
            const save = JSON.parse(jsonString);
            if (save) {
                currentSceneId = save.currentSceneId; 
                inventory = save.inventory; 
                visitedScenes = save.visitedScenes || []; 
                actionLog = save.actionLog || []; 
                chances = save.chances; 
                trackers = save.trackers || {}; 
                removedObjectsFromScenes = save.removedObjectsFromScenes || {};
                isGameEnded = false;
                standardActionBar.classList.remove('hidden');
                endingActionBar.classList.add('hidden');
                systemModal.classList.add('hidden');
                loadScene(currentSceneId, false);
                splashScreen.classList.add('fade-out');
                setTimeout(() => { splashScreen.classList.add('hidden'); splashScreen.classList.remove('fade-out'); }, 1000);
            }
        } catch (e) { startGame(); }
    };

    const autoSaveGame = () => {
        if (window.isPreview) return; 
        if (isGameEnded) return;
        const save = { currentSceneId, inventory, visitedScenes, actionLog, chances, trackers, removedObjectsFromScenes, timestamp: new Date().toLocaleString() };
        localStorage.setItem('if_builder_autosave_' + document.title, JSON.stringify(save));
    };

    const toggleSystemMenu = () => {
        if (systemModal.classList.contains('hidden')) {
            systemModal.classList.remove('hidden'); systemMenuMain.classList.remove('hidden'); systemSlotsContainer.classList.add('hidden');
            systemModalTitle.textContent = gameData.gameSystemButtonText || 'Sistema';
        } else systemModal.classList.add('hidden');
    };

    const renderSlots = (mode) => {
        systemMenuMain.classList.add('hidden'); systemSlotsContainer.classList.remove('hidden'); slotsList.innerHTML = '';
        systemModalTitle.textContent = mode === 'save' ? (gameData.gameSaveMenuTitle || 'Salvar Jogo') : (gameData.gameLoadMenuTitle || 'Carregar Jogo');
        for (let i = 1; i <= 3; i++) {
            const slotKey = 'if_builder_slot_' + i + '_' + document.title;
            const savedData = localStorage.getItem(slotKey);
            const slotDiv = document.createElement('div'); slotDiv.className = 'slot-item';
            let contentHtml = '';
            if (savedData) {
                const data = JSON.parse(savedData); const sceneName = gameData.cenas[data.currentSceneId]?.name || 'Desconhecido';
                contentHtml = '<div class="slot-info"><span class="slot-title">Slot ' + i + ' - ' + sceneName + '</span><span class="slot-meta">' + data.timestamp + '</span></div>';
                if (mode === 'save') contentHtml += '<div class="slot-actions"><span class="highlight-word">Sobrescrever</span></div>';
                else contentHtml += '<div class="slot-actions"><button class="slot-delete-btn" data-slot="' + i + '">×</button></div>';
            } else {
                contentHtml = '<div class="slot-info"><span class="slot-title">Slot ' + i + '</span><span class="slot-empty">Vazio</span></div>';
                if (mode === 'save') contentHtml += '<div class="slot-actions"><span class="highlight-word">Salvar</span></div>';
            }
            slotDiv.innerHTML = contentHtml;
            slotDiv.addEventListener('click', (e) => { if (e.target.classList.contains('slot-delete-btn')) return; if (mode === 'save') performSave(i); else if (mode === 'load' && savedData) loadGameFromData(savedData); });
            slotsList.appendChild(slotDiv);
        }
    };

    const performSave = (slotIndex) => {
        const slotKey = 'if_builder_slot_' + slotIndex + '_' + document.title;
        const save = { currentSceneId, inventory, visitedScenes, actionLog, chances, trackers, removedObjectsFromScenes, timestamp: new Date().toLocaleString() };
        localStorage.setItem(slotKey, JSON.stringify(save)); renderSlots('save');
    };

    const getObjectsForScene = (sceneId) => {
        const scene = gameData.cenas[sceneId]; 
        if (!scene) return [];
        let objects = (scene.objectIds || []).map(id => gameData.globalObjects[id]).filter(Boolean).map(o => JSON.parse(JSON.stringify(o)));
        const removedIds = removedObjectsFromScenes[sceneId] || [];
        objects = objects.filter(o => !removedIds.includes(o.id));
        return objects;
    };
    
    const flagObjectAsRemoved = (sceneId, objectId) => {
        if (!removedObjectsFromScenes[sceneId]) removedObjectsFromScenes[sceneId] = [];
        if (!removedObjectsFromScenes[sceneId].includes(objectId)) {
            removedObjectsFromScenes[sceneId].push(objectId);
        }
    };

    const updateTrackers = (effects) => {
        if (!effects) return;
        effects.forEach(effect => { if (trackers.hasOwnProperty(effect.trackerId)) trackers[effect.trackerId] += effect.valueChange; });
        checkTrackers();
    };

    const checkTrackers = () => {
        const definitions = gameData.consequenceTrackers || [];
        for (const def of definitions) { if (trackers[def.id] >= def.maxValue && def.consequenceSceneId) { setTimeout(() => { loadScene(def.consequenceSceneId, true, 'fade'); }, 500); return; } }
    };

    // VIGNETTE RENDERER: Creates a fullscreen splash overlay for opening/transition/conclusion vignettes
    const renderVignette = (scene) => {
        // Get or create vignette overlay
        let vignetteOverlay = document.getElementById('vignette-overlay');
        if (!vignetteOverlay) {
            vignetteOverlay = document.createElement('div');
            vignetteOverlay.id = 'vignette-overlay';
            vignetteOverlay.className = 'splash-screen';
            vignetteOverlay.innerHTML = '<div class="splash-content"><p class="splash-description"></p><button class="splash-start-button vignette-advance-btn"></button></div>';
            document.body.appendChild(vignetteOverlay);
        }
        
        // Configure overlay
        if (scene.image) {
            vignetteOverlay.style.backgroundImage = 'url(' + scene.image + ')';
            vignetteOverlay.style.backgroundSize = 'cover';
            vignetteOverlay.style.backgroundPosition = 'center';
        } else {
            vignetteOverlay.style.backgroundImage = 'none';
        }
        
        const descEl = vignetteOverlay.querySelector('.splash-description');
        const btnEl = vignetteOverlay.querySelector('.vignette-advance-btn');
        
        if (descEl) descEl.textContent = scene.description || '';
        if (btnEl) {
            btnEl.textContent = scene.vignetteButtonText || 'Continuar';
            // Remove old listeners by cloning
            const newBtn = btnEl.cloneNode(true);
            btnEl.parentNode.replaceChild(newBtn, btnEl);
            newBtn.addEventListener('click', () => {
                vignetteOverlay.classList.add('fade-out');
                setTimeout(() => {
                    vignetteOverlay.classList.add('hidden');
                    vignetteOverlay.classList.remove('fade-out');
                    // Transition to next scene
                    if (scene.vignetteNextSceneId) {
                        currentSceneId = scene.vignetteNextSceneId;
                        loadScene(scene.vignetteNextSceneId, true);
                    }
                }, 1000);
            });
        }
        
        // Play BGM if defined
        if (scene.backgroundMusic) playBgm(scene.backgroundMusic);
        
        // Show the overlay
        vignetteOverlay.classList.remove('hidden');
        vignetteOverlay.classList.remove('fade-out');
        
        // Hide the game container while showing vignette
        if (gameContainer) gameContainer.classList.add('hidden');
    };

    const loadScene = (sceneId, transition = true, transitionType = 'none', transitionSpeed = null, successPrefix = null) => {
        const scene = gameData.cenas[sceneId]; if (!scene) return;
        
        // VIGNETTE HANDLING: All vignette types render as fullscreen splash with button
        if (scene.vignetteType && scene.vignetteType !== 'none' && scene.vignetteNextSceneId) {
            renderVignette(scene);
            return;
        }
        
        // Ensure game container is visible when loading a regular scene
        if (gameContainer) gameContainer.classList.remove('hidden');
        
        if (scene.backgroundMusic) playBgm(scene.backgroundMusic);
        if (scene.removesChanceOnEntry && gameData.enableChances) chances--; 
        if (scene.restoresChanceOnEntry && gameData.enableChances) chances = Math.min(chances + 1, gameData.gameMaxChances);
        currentSceneId = sceneId;
        if (!visitedScenes.includes(sceneId)) visitedScenes.push(sceneId);
        actionLog.push({ type: 'scene', name: scene.name, timestamp: new Date().toLocaleTimeString(), description: scene.description, image: scene.image });
        let effectiveTransition = !transitionType || transitionType === 'none' ? (gameData.gameImageTransitionType || 'fade') : transitionType;
        if (effectiveTransition === 'none') transition = false;
        if (transitionSpeed !== null) {
            const dynamicDuration = Math.max(0.3, 5.0 - (transitionSpeed * 0.9)) + 's';
            document.documentElement.style.setProperty('--image-anim-speed', dynamicDuration);
        } else {
            const defaultDuration = Math.max(0.3, 5.0 - ((gameData.gameImageSpeed || 3) * 0.9)) + 's';
            document.documentElement.style.setProperty('--image-anim-speed', defaultDuration);
        }
        if (transition && sceneImage && sceneImageBack && gameData.enableImages !== false) {
             sceneImageBack.src = scene.image || ''; sceneImageBack.classList.toggle('hidden', !scene.image);
             if (sceneImage.src) {
                 sceneImage.classList.remove('hidden'); const animClass = 'trans-' + effectiveTransition + '-out'; sceneImage.classList.add(animClass);
                 const durationMs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--image-anim-speed')) * 1000;
                 setTimeout(() => { renderScene(scene, successPrefix); sceneImage.classList.remove(animClass); sceneImageBack.src = ''; sceneImageBack.classList.add('hidden'); }, durationMs + 50);
             } else renderScene(scene, successPrefix);
        } else { renderScene(scene, successPrefix); }
        autoSaveGame();
    };

    const formatText = (text) => text.replace(/<([^>]+)>/g, '<span class="highlight-word" data-word="$1">$1</span>');

    const setupHighlights = (element) => {
        element.querySelectorAll('.highlight-word').forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isPrinting) return; 
                const word = span.dataset.word;
                const currentVal = verbInput.value.trim();
                verbInput.value = currentVal ? (currentVal + ' ' + word) : word;
                verbInput.focus();
            });
        });
    };

    const renderScene = (scene, successPrefix = null) => {
        if (scene.image && gameData.enableImages !== false) { sceneImage.src = scene.image; sceneImage.classList.remove('hidden'); imageContainer.classList.remove('no-image'); }
        else { sceneImage.src = ''; sceneImage.classList.add('hidden'); imageContainer.classList.add('no-image'); }
        if (sceneNameOverlay) { sceneNameOverlay.textContent = scene.name; sceneNameOverlay.style.opacity = '1'; }
        sceneDescription.innerHTML = '';
        
        let fullDescription = scene.description;
        if (successPrefix) fullDescription = successPrefix + "\\n\\n" + fullDescription;

        const paragraphs = fullDescription.split('\\n').filter(p => p.trim().length > 0);
        let pIndex = 0; const textAnimType = (gameData.enableTextControl !== false) ? (gameData.gameTextAnimationType || 'fade') : 'none';
        const isImmersive = document.body.classList.contains('behavior-immersive') && window.innerWidth <= 768;

        isPrinting = true;
        sceneDescription.classList.add('typewriting-active');

        const renderNextParagraph = () => {
            if (pIndex >= paragraphs.length) { 
                isPrinting = false;
                sceneDescription.classList.remove('typewriting-active');
                if (chances <= 0) gameOver(); else if (scene.isEndingScene) activateEndingUI('win');
                return; 
            }

            const p = document.createElement('p'); const formattedHTML = formatText(paragraphs[pIndex]);
            if (textAnimType === 'typewriter') {
                p.className = 'scene-paragraph typewriter-cursor'; p.style.opacity = '1'; p.innerHTML = formattedHTML; sceneDescription.appendChild(p);
                const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
                let node; const textNodes = []; while(node = walker.nextNode()) textNodes.push(node);
                const fullTexts = textNodes.map(n => n.nodeValue); textNodes.forEach(n => n.nodeValue = '');
                let nodeIdx = 0; let charIdx = 0;
                const type = () => {
                    if (nodeIdx >= textNodes.length) { p.classList.remove('typewriter-cursor'); setupHighlights(p); finishParagraph(); return; }
                    const currentNode = textNodes[nodeIdx]; const fullText = fullTexts[nodeIdx];
                    if (charIdx < fullText.length) { currentNode.nodeValue += fullText[charIdx]; charIdx++; if (sceneDescription) sceneDescription.scrollTop = sceneDescription.scrollHeight; setTimeout(type, typeSpeedBase); }
                    else { nodeIdx++; charIdx = 0; type(); }
                };
                type();
            } else { p.innerHTML = formattedHTML; p.className = 'scene-paragraph'; sceneDescription.appendChild(p); setupHighlights(p); finishParagraph(); }
        };

        const finishParagraph = () => {
            pIndex++;
            if (pIndex < paragraphs.length) {
                if (gameData.gameTextReadingFlow === 'continuous') {
                    // Bypass pause for continuous flow
                    setTimeout(renderNextParagraph, 30);
                    return;
                }
                const continueBtn = document.createElement('div'); continueBtn.className = 'continue-indicator'; continueBtn.innerHTML = '<span>▼</span>';
                const continueHandler = (e) => { 
                    if (e) { if (e.type === 'keydown' && e.key !== 'Enter') return; e.stopPropagation(); if (e.type === 'keydown') e.preventDefault(); }
                    
                    // NO MODO IMERSIVO MOBILE: Limpa tudo ANTES de renderizar o próximo parágrafo
                    if (isImmersive) {
                        sceneDescription.innerHTML = '';
                    } else {
                        continueBtn.remove();
                    }
                    
                    sceneDescription.removeEventListener('click', continueHandler); 
                    window.removeEventListener('keydown', continueHandler);
                    renderNextParagraph(); 
                };
                continueBtn.addEventListener('click', continueHandler); 
                sceneDescription.addEventListener('click', continueHandler);
                window.addEventListener('keydown', continueHandler);
                sceneDescription.appendChild(continueBtn); sceneDescription.scrollTop = sceneDescription.scrollHeight;
            } else { 
                isPrinting = false;
                sceneDescription.classList.remove('typewriting-active');
                sceneDescription.scrollTop = sceneDescription.scrollHeight; 
                if (chances <= 0) gameOver(); else { verbInput.focus(); if (scene.isEndingScene) activateEndingUI('win'); }
            }
        };
        renderNextParagraph();
        
        const chancesContainer = document.getElementById('chances-container');
        if (chancesContainer) {
            chancesContainer.innerHTML = '';
            const iconSvg = ICONS[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
            const iconOutlineSvg = ICONS_OUTLINE[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
            for (let i = 0; i < (gameData.gameMaxChances || 3); i++) {
                const icon = document.createElement('div'); icon.className = 'chance-icon ' + (i < chances ? '' : 'lost');
                icon.innerHTML = i < chances ? iconSvg : iconOutlineSvg; chancesContainer.appendChild(icon);
            }
        }
        
        // CHOICE MODE HANDLING
        if (gameData.gameInteractionType === 'choice') {
            document.querySelector('.input-area').classList.add('hidden');
            
            // Remove previous choices container if exists
            const existingChoices = standardActionBar.querySelector('.choices-container');
            if (existingChoices) existingChoices.remove();

            const choicesContainer = document.createElement('div');
            choicesContainer.className = 'choices-container';
            choicesContainer.style.marginTop = '10px';
            choicesContainer.style.display = 'flex';
            choicesContainer.style.flexDirection = 'column';
            choicesContainer.style.gap = '8px';
            choicesContainer.style.width = '100%';
            
            if (scene.choices && scene.choices.length > 0) {
                scene.choices.forEach(choice => {
                    const btn = document.createElement('button');
                    btn.textContent = choice.label;
                    btn.className = 'choice-button';
                    
                    // Match System Button Styles
                    btn.style.fontFamily = 'var(--font-family)';
                    btn.style.padding = '12px 16px'; // Slightly larger for tap targets but matching style
                    btn.style.textAlign = 'left';
                    btn.style.backgroundColor = 'var(--panel-bg)'; // Match standard button bg
                    btn.style.border = '2px solid var(--border-color)'; // Match standard button border
                    btn.style.color = 'var(--text-color)'; // Match standard button text
                    btn.style.cursor = 'pointer';
                    btn.style.transition = 'background-color 0.2s, border-color 0.2s';
                    btn.style.fontSize = '1em';
                    btn.style.fontWeight = 'normal';
                    btn.style.width = '100%';
                    btn.style.marginBottom = '0'; // Controlled by gap

                    // Hover Effects
                    btn.onmouseover = () => { 
                         btn.style.backgroundColor = 'var(--border-color)'; 
                         btn.style.borderColor = 'var(--text-dim-color)';
                    };
                    btn.onmouseout = () => { 
                         btn.style.backgroundColor = 'var(--panel-bg)'; 
                         btn.style.borderColor = 'var(--border-color)'; 
                    };

                    btn.onclick = () => {
                        actionLog.push({ type: 'choice', text: '> ' + choice.label });
                        loadScene(choice.targetSceneId, true);
                    };
                    choicesContainer.appendChild(btn);
                });
            }
            // Append to Action Bar (Footer) instead of Description
            standardActionBar.insertBefore(choicesContainer, standardActionBar.firstChild);
            // Move action buttons (System/Diary) to bottom if needed, or keep at top?
            // User request: "Estar ABAIXO dos botões Sugestões, Inventário, Diário e Sistema"
            // standardActionBar structure:
            // 1. .action-popup (hidden)
            // 2. .action-buttons (System, Diary, etc)
            // 3. .input-area (Hidden in Choice mode)
            
            // So if we just append to standardActionBar, it will be at the end, which is AFTER action-buttons.
            // Let's do appendChild.
            standardActionBar.appendChild(choicesContainer);
            
        } else {
            document.querySelector('.input-area').classList.remove('hidden');
            const existingChoices = standardActionBar.querySelector('.choices-container');
            if (existingChoices) existingChoices.remove();
        }

        actionPopup.classList.add('hidden'); verbInput.value = ''; activePopupType = null;
    };

    const activateEndingUI = (type) => {
        isGameEnded = type;
        standardActionBar.classList.add('hidden');
        endingActionBar.classList.remove('hidden');
        if (!window.isPreview) localStorage.removeItem('if_builder_autosave_' + document.title);
    };

    const gameOver = () => { activateEndingUI('lose'); };
    const handleInput = () => { if (isPrinting) return; const input = verbInput.value.trim(); if (input) { processCommand(input); verbInput.value = ''; } };
    const hasWord = (word, text) => {
        if (!word || !text) return false;
        const normalizedWord = word.toLowerCase().trim();
        const normalizedText = text.toLowerCase();
        let index = normalizedText.indexOf(normalizedWord);
        while (index !== -1) {
            const charBefore = index > 0 ? normalizedText[index - 1] : ' ';
            const charAfter = index + normalizedWord.length < normalizedText.length ? normalizedText[index + normalizedWord.length] : ' ';
            const isBoundary = (char) => /[^a-zA-Z0-9áéíóúàèìòùâêîôûãõç]/.test(char);
            if (isBoundary(charBefore) && isBoundary(charAfter)) return true;
            index = normalizedText.indexOf(normalizedWord, index + 1);
        }
        return false;
    };

    const processCommand = (input) => {
        const inputLower = input.toLowerCase().trim();
        const echo = document.createElement('p'); echo.className = 'verb-echo'; echo.textContent = '> ' + input; sceneDescription.appendChild(echo);
        sceneDescription.scrollTop = sceneDescription.scrollHeight; actionLog.push({ type: 'input', text: '> ' + input });
        const scene = gameData.cenas[currentSceneId]; 
        const sceneObjects = getObjectsForScene(currentSceneId); 
        for (const fv of (gameData.fixedVerbs || [])) { if (fv.verbs.some(v => hasWord(v, inputLower))) { printOutput(fv.description); return; } }
        let foundInteraction = scene.interactions.find(i => {
            if (!i.verbs.some(v => hasWord(v, inputLower))) return false;
            if (i.requiresInInventory && !inventory.some(o => o.id === i.requiresInInventory)) return false;
            if (i.target) {
                const obj = sceneObjects.find(o => i.target === o.id) || inventory.find(o => i.target === o.id);
                if (!obj) return false;
                return hasWord(obj.name.toLowerCase(), inputLower);
            }
            const anyObjectMentioned = [...sceneObjects, ...inventory].some(o => hasWord(o.name.toLowerCase(), inputLower));
            return !anyObjectMentioned;
        });
        if (!foundInteraction) {
            foundInteraction = scene.interactions.find(i => {
                if (!i.verbs.some(v => hasWord(v, inputLower))) return false;
                if (i.requiresInInventory && !inventory.some(o => o.id === i.requiresInInventory)) return false;
                if (i.target) return false;
                return true;
            });
        }
        if (foundInteraction) { executeInteraction(foundInteraction); return; }
        if (hasWord('inventario', inputLower) || hasWord('i', inputLower)) { 
            if (gameData.enableInventory) { actionPopup.classList.add('hidden'); activePopupType = null; togglePopup('inventory'); }
            else { printOutput("O sistema de inventário está desativado."); }
            return; 
        }
        const lookVerbs = ['olhar', 'examinar', 'ver', 'ler'];
        if (lookVerbs.some(v => hasWord(v, inputLower))) {
             const obj = sceneObjects.find(o => hasWord(o.name.toLowerCase(), inputLower)) || inventory.find(o => hasWord(o.name.toLowerCase(), inputLower));
             if (obj) { printOutput(obj.examineDescription); return; }
             printOutput(scene.description); return;
        }
        printOutput(gameData.mensagem_falha_padrao || "Não aconteceu nada.");
    };

    const executeInteraction = (interaction) => {
        if (interaction.consumesItem && interaction.requiresInInventory) { removeFromInventory(interaction.requiresInInventory); }
        if (interaction.trackerEffects) updateTrackers(interaction.trackerEffects);
        if (interaction.addsToInventory && interaction.target) {
            const objInScene = getObjectsForScene(currentSceneId).find(o => o.id === interaction.target);
            if (objInScene) { addToInventory(objInScene); flagObjectAsRemoved(currentSceneId, objInScene.id); }
        } else if (interaction.removesTargetFromScene && interaction.target) flagObjectAsRemoved(currentSceneId, interaction.target);
        if (interaction.soundEffect) playSound(interaction.soundEffect);
        if (interaction.goToScene) loadScene(interaction.goToScene, true, interaction.transitionType, interaction.transitionSpeed, interaction.successMessage);
        else {
            const scene = gameData.cenas[currentSceneId];
            if (interaction.newSceneDescription) { 
                if (interaction.successMessage) scene.description = interaction.successMessage + "\\n\\n" + interaction.newSceneDescription;
                else scene.description = interaction.newSceneDescription;
                renderScene(scene); 
            } else if (interaction.successMessage) printOutput(interaction.successMessage);
        }
    };

    const printOutput = (text) => {
        const textAnimType = gameData.gameTextAnimationType || 'fade';
        const p = document.createElement('p'); 
        const formattedHTML = formatText(text);
        actionLog.push({ type: 'output', text: text });
        if (textAnimType === 'typewriter') {
            isPrinting = true;
            sceneDescription.classList.add('typewriting-active');
            p.className = 'scene-paragraph typewriter-cursor'; 
            p.style.opacity = '1'; 
            p.innerHTML = formattedHTML; 
            sceneDescription.appendChild(p);
            const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
            let node; const textNodes = []; while(node = walker.nextNode()) textNodes.push(node);
            const fullTexts = textNodes.map(n => n.nodeValue); textNodes.forEach(n => n.nodeValue = '');
            let nodeIdx = 0; let charIdx = 0;
            const type = () => {
                if (nodeIdx >= textNodes.length) { 
                    p.classList.remove('typewriter-cursor'); setupHighlights(p); isPrinting = false;
                    sceneDescription.classList.remove('typewriting-active');
                    sceneDescription.scrollTop = sceneDescription.scrollHeight; verbInput.focus();
                    return; 
                }
                const currentNode = textNodes[nodeIdx]; const fullText = fullTexts[nodeIdx];
                if (charIdx < fullText.length) { currentNode.nodeValue += fullText[charIdx]; charIdx++; if (sceneDescription) sceneDescription.scrollTop = sceneDescription.scrollHeight; setTimeout(type, typeSpeedBase); }
                else { nodeIdx++; charIdx = 0; type(); }
            };
            type();
        } else {
            p.innerHTML = formattedHTML; p.className = 'scene-paragraph'; sceneDescription.appendChild(p); setupHighlights(p); sceneDescription.scrollTop = sceneDescription.scrollHeight;
        }
    };

    const findItemInInventoryById = (id) => inventory.find(o => o.id === id) || null;
    const findItemName = (id) => (findItemInInventoryById(id) || gameData.globalObjects[id])?.name || 'item';
    const addToInventory = (obj) => { if (!inventory.some(o => o.id === obj.id)) inventory.push(obj); };
    const removeFromInventory = (id) => { inventory = inventory.filter(i => i.id !== id); };
    
    const togglePopup = (type) => { 
        if (!actionPopup.classList.contains('hidden') && activePopupType === type) { 
            actionPopup.classList.add('hidden'); 
            activePopupType = null;
        } else { 
            if (type === 'suggestions') showSuggestions(); 
            if (type === 'inventory') showInventory(); 
            activePopupType = type;
        } 
    };

    const showSuggestions = () => {
        actionPopup.classList.remove('hidden'); actionPopup.innerHTML = '';
        const sceneObjects = getObjectsForScene(currentSceneId); const container = document.createElement('div'); container.className = 'action-popup-container';
        const row1 = document.createElement('div'); row1.className = 'action-popup-row';
        sceneObjects.forEach(obj => { const btn = document.createElement('button'); btn.textContent = obj.name; btn.addEventListener('click', () => { 
            verbInput.value = 'examinar ' + obj.name; 
            actionPopup.classList.add('hidden'); 
            activePopupType = null; 
            handleInput(); 
        }); row1.appendChild(btn); });
        container.appendChild(row1);
        const row2 = document.createElement('div'); row2.className = 'action-popup-row';
        ['Examinar', 'Pegar', 'Usar', 'Falar', 'Abrir'].forEach(v => { const btn = document.createElement('button'); btn.textContent = v; btn.addEventListener('click', () => { 
            verbInput.value = v.toLowerCase() + ' '; 
            verbInput.focus(); 
            actionPopup.classList.add('hidden'); 
            activePopupType = null; 
        }); row2.appendChild(btn); });
        container.appendChild(row2); actionPopup.appendChild(container);
    };
    const showInventory = () => {
        actionPopup.classList.remove('hidden'); actionPopup.innerHTML = ''; const list = document.createElement('div'); list.className = 'action-popup-list';
        if (inventory.length === 0) { const msg = document.createElement('p'); msg.textContent = 'Seu inventário está vazio.'; list.appendChild(msg); }
        else { inventory.forEach(item => { const btn = document.createElement('button'); btn.textContent = item.name; btn.addEventListener('click', () => { 
            openItemModal(item); 
            actionPopup.classList.add('hidden'); 
            activePopupType = null; 
        }); list.appendChild(btn); }); }
        actionPopup.appendChild(list);
    };
    const openItemModal = (item) => {
        itemModalName.textContent = item.name; itemModalDescription.innerHTML = formatText(item.examineDescription);
        setupHighlights(itemModalDescription);
        if (item.image) { itemModalImage.src = item.image; itemModalImageContainer.classList.remove('hidden'); }
        else itemModalImageContainer.classList.add('hidden');
        itemModal.classList.remove('hidden');
    };
    const showDiary = () => {
        diaryLog.innerHTML = ''; let currentInterContainer = null;
        actionLog.forEach(entry => {
            if (entry.type === 'scene') {
                const div = document.createElement('div'); div.className = 'diary-entry';
                if (entry.image) { const img = document.createElement('img'); img.src = entry.image; div.appendChild(img); }
                const txt = document.createElement('div'); txt.className = 'text-container'; 
                txt.innerHTML = '<span class="scene-name">' + entry.name + '</span><p>' + formatText(entry.description) + '</p>';
                div.appendChild(txt); diaryLog.appendChild(div);
                setupHighlights(txt);
                currentInterContainer = document.createElement('div'); currentInterContainer.className = 'diary-interactions-container'; txt.appendChild(currentInterContainer);
            } else {
                if (currentInterContainer) {
                    const p = document.createElement('p'); p.className = 'diary-' + entry.type; 
                    if (entry.type === 'output') { p.innerHTML = formatText(entry.text); setupHighlights(p); } else p.textContent = entry.text;
                    currentInterContainer.appendChild(p);
                }
            }
        });
        diaryModal.classList.remove('hidden'); setTimeout(() => { diaryLog.scrollTop = diaryLog.scrollHeight; }, 10);
    };
    init();
});
`;
