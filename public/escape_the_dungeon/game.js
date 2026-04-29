window.embeddedGameData = {"gameTitle":"Fuja da Masmorra","cena_inicial":"VNT_OPENING","cenas":{"scn_bh0":{"id":"scn_bh0","name":"DARK CELL","image":"assets/scene_image_scn_bh0.jpeg","description":"You awake in a damp, cramped <cell>. \nA locked <door> blocks the exit. \nIn the corner, a rusty <bucket>.\nA <brick> catches your attention on the wall.","backgroundMusic":"assets/scene_bgm_scn_bh0.mpeg","interactions":[{"id":"inter_hsq","verbs":["pull","push","move","remove","take out","fiddle","touch","press","slide","poke","grope"],"target":"obj_seh","successMessage":"","goToScene":"scn_hja","removesTargetFromScene":true,"transitionType":"zoom","transitionSpeed":4,"soundEffect":"assets/sfx_scn_bh0_0.mpeg","icon":"star","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_ggc","verbs":["kick","hit","break open","smash","punch"],"target":"obj_abe","successMessage":"","goToScene":"scn_3br","transitionType":"blur","transitionSpeed":4,"soundEffect":"assets/sfx_scn_bh0_1.mpeg","icon":"skull","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_yui","verbs":["fiddle","rummage","kick","pick up","lift","move","ransack","search","poke around","grab","drag","flip"],"target":"obj_5fj","successMessage":"","goToScene":"scn_1o5","transitionType":"zoom","transitionSpeed":4,"soundEffect":"assets/sfx_scn_bh0_2.mpeg","icon":"skull","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_x1p","verbs":["use","open","unlock","insert","shove in"],"target":"obj_abe","requiresInInventory":"obj_f2n","consumesItem":true,"goToScene":"VNT_VICTORY","soundEffect":"assets/sfx_scn_bh0_3.mpeg","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_ajm","verbs":["shout","yell","call out","speak","roar"],"target":"","successMessage":"Você grita por ajuda, mas o silêncio permanece absoluto. Ninguém te ouve do lado de fora da cela..","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_4i9","verbs":["open","push","unlock","force"],"target":"","successMessage":"A porta está trancada. Você precisa de uma <chave> para abri-la.","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]}],"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":["obj_5fj","obj_abe","obj_seh"],"choices":[],"overlayEffect":"grain","isDefeatOutcome":false,"suggestions":["Examine","Open","Kick","Yell"]},"scn_hja":{"id":"scn_hja","name":"BEHIND THE BRICK","image":"assets/scene_image_scn_hja.jpeg","description":"You force the brick and discover an empty space behind it. \nSomething glints there. You find a rusty <key>!\nYou can <go back> to the <cell> at any time.","interactions":[{"id":"inter_svi","verbs":["get","grab","pick up","take","store"],"target":"obj_f2n","removesTargetFromScene":true,"addsToInventory":true,"soundEffect":"assets/sfx_scn_hja_0.mpeg","successMessage":"You picked up the key and added it to your inventory.","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]},{"id":"inter_9r4","verbs":["go back","go","return","cell"],"target":"","goToScene":"scn_bh0","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]}],"isEndingScene":false,"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":["obj_f2n","obj_abe"],"choices":[],"overlayEffect":"grain","isDefeatOutcome":false,"suggestions":["Take","Key","Return"]},"scn_3br":{"id":"scn_3br","name":"HURT BY THE DOOR!","image":"assets/scene_image_scn_3br.jpeg","description":"You hit the door with force.\nCLANK! \nIt creaks, but something snaps inside your foot. \nThe pain is unbearable.","interactions":[{"id":"inter_445","verbs":["go back","go","return","cell"],"target":"","goToScene":"scn_bh0","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]}],"removesChanceOnEntry":true,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"overlayEffect":"grain","isDefeatOutcome":false,"suggestions":["Return","Cell"]},"scn_1o5":{"id":"scn_1o5","name":"A RAT ATTACKS!","image":"assets/scene_image_scn_1o5.jpeg","description":"With disgust, you stir the bucket. \nSomething moves inside.\nSQUEAK! \nA rat attacks and sinks its teeth into your hand.","interactions":[{"id":"inter_b7l","verbs":["go back","go","return","cell"],"target":"","goToScene":"scn_bh0","trackerEffects":[{"trackerId":"trk_9mt","valueChange":25}]}],"removesChanceOnEntry":true,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"overlayEffect":"grain","isDefeatOutcome":false,"suggestions":["Return","Cell"]},"VNT_OPENING":{"id":"VNT_OPENING","name":"Escape the Dungeon","image":"assets/splash_image.png","description":"You wake up in a dark cell.\nWrite to escape the dungeon!\n\n(type HELP to access the tutorial)","interactions":[],"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"vignetteType":"opening","vignetteButtonText":"COMEÇAR","vignetteNextSceneId":"scn_bh0","overlayEffect":"rain","isDefeatOutcome":false,"suggestions":[]},"VNT_VICTORY":{"id":"VNT_VICTORY","name":"You escaped","image":"assets/splash_image.png","description":"The door creaks as you turn the key in the lock.\nYou step out of the cell and feel the fresh night wind.","backgroundMusic":"assets/scene_bgm_VNT_VICTORY.mpeg","interactions":[],"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"vignetteType":"conclusion","vignetteButtonText":"RESTART","overlayEffect":"grain","isDefeatOutcome":false,"suggestions":[]},"VNT_DEFEAT":{"id":"VNT_DEFEAT","name":"You died in the dungeon","image":"assets/splash_image.png","description":"From hunger? Illness? No one will ever know...","backgroundMusic":"assets/scene_bgm_VNT_DEFEAT.mpeg","interactions":[],"removesChanceOnEntry":false,"restoresChanceOnEntry":false,"objectIds":[],"choices":[],"vignetteType":"conclusion","vignetteButtonText":"RESTART","overlayEffect":"rain","isDefeatOutcome":true,"suggestions":[]}},"globalObjects":{"obj_5fj":{"id":"obj_5fj","name":"bucket","examineDescription":"A rusty bucket lying on the floor. Could there be something inside?","isTakable":false},"obj_abe":{"id":"obj_abe","name":"door","examineDescription":"The large iron door of the cell. It is locked.","isTakable":false,"icon":"star"},"obj_seh":{"id":"obj_seh","name":"brick","examineDescription":"A brick seems loose in the wall. Can I move it?","isTakable":false,"icon":"star"},"obj_f2n":{"id":"obj_f2n","name":"key","examineDescription":"A rusty key! It looks like it fits the lock of the cell door.","isTakable":true,"image":"assets/obj_image_obj_f2n.jpeg","icon":"star"}},"mensagem_falha_padrao":"Isso não parece ter nenhum efeito.","nome_jogador_diario":"Player","gameSystemEnabled":"none","gameMaxChances":2,"gameChanceIcon":"heart","gameChanceIconColor":"#d4af37","gameChanceReturnButtonText":"Tentar Novamente","gameTextColor":"#a1a1aa","gameTitleColor":"#d4af37","gameFocusColor":"#fbbf24","gameTextReadingFlow":"continuous","positiveEndingImage":"assets/splash_image.png","positiveEndingContentAlignment":"right","positiveEndingDescription":"Você conseguiu fugir da masmorra!","positiveEndingMusic":"assets/positive_ending_bgm.mpeg","negativeEndingImage":"assets/splash_image.png","negativeEndingContentAlignment":"right","negativeEndingDescription":"Você morreu...","gameRestartButtonText":"RESTART","gameContinueButtonText":"CONTINUE","gameSystemButtonText":"Save / Load","gameSaveMenuTitle":"Save","gameLoadMenuTitle":"Load","gameMainMenuButtonText":"Main Menu","gameViewEndingButtonText":"View Ending","fixedVerbs":[{"id":"verb_help_1","verbs":["help"],"description":"How to Interact with the World:\nEverything is based on the text field, and most commands follow a simple format:\n\nDirect actions: To interact with something in the scene, use VERB + TARGET.\nFor example: get key or look door.\n\nUsing inventory items: To use an item you have collected on something in the scene, the format is VERB + ITEM + TARGET.\nFor example: use key on door.\nRemember: the item (like the key) must be in your inventory for the action to work.\nKeep an eye on highlighted words in the scene description, like <this>. They indicate important points of interest!\n\nSome verbs are universal and very useful:\n\nLOOK or EXAMINE: Use to discover more details about your surroundings. You can use it on a specific object (look brick) or the environment in general (look around).\n\nGET or TAKE: Some objects can be collected and kept in your inventory for later use. If something looks useful and loose, try to get it!\n\nINVENTORY: To see all the items you are carrying, click the Inventory button.\n\nGO BACK: If you want to return to the scene you just came from, this command may work.\n\nStuck? Now what?\nBe creative! Try different verbs for the same object. push, pull, kick, use... experimentation is key!\nSuggestions Button: If you are out of ideas, the Suggestions button is your best friend. It can shed light on the most obvious actions in the current scene.\nJournal: Forgot what happened or an important detail? The Journal keeps a record of all the scenes you’ve visited and your actions. Use it to recall clues."}],"consequenceTrackers":[{"id":"trk_9mt","name":"Hunger","initialValue":0,"maxValue":150,"consequenceSceneId":"VNT_DEFEAT","icon":"skull","barColor":"#dd5f5f","invertBar":false,"hideValue":true}],"gameShowTrackersUI":true,"gameShowSystemButton":false,"gameTextAnimationType":"typewriter","gameTextSpeed":4,"gameImageTransitionType":"fade","gameImageSpeed":5,"enableInventory":true,"enableSuggestions":true,"enableChances":true,"enableTrackers":true,"enableDiary":true,"enableFixedVerbs":true,"enableImages":true,"enableTextControl":true,"enableRetrospective":true,"gameInteractionType":"parser","gameSuggestionsEmptyFeedback":"no suggestions available","gameInventoryEmptyFeedback":"there are no items in inventory","gameTranslations":{"view_diary_btn":"Ver Diário","stats_visited":"Você visitou","stats_time":"Tempo decorrido","of_scenes":"cenas"}};


document.addEventListener('DOMContentLoaded', () => {

    const ICONS = {
        heart: '<svg fill="%COLOR%" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="%COLOR%" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: '<svg stroke="%COLOR%" stroke-width="4" stroke-linecap="round" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>',
        square: '<svg fill="%COLOR%" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>',
        diamond: '<svg fill="%COLOR%" viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z"/></svg>'
    };
    
    const ICONS_OUTLINE = {
        heart: '<svg fill="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: '<svg stroke="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>',
        square: '<svg fill="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>',
        diamond: '<svg fill="none" stroke="%COLOR%" stroke-width="3.5" viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z"/></svg>'
    };

    const gameData = window.embeddedGameData;
    let currentSceneId = gameData.cena_inicial;
    let inventory = [];
    let visitedScenes = []; 
    let actionLog = []; 
    let chances = gameData.gameMaxChances || 3;
    let lastChanceChange = null; 
    let isGameEnded = false;
    let gameStartTime = null;
    let gameEndTime = null;
    let trackers = {};
    let removedObjectsFromScenes = {}; 
    let currentBgmSrc = "";
    let isPrinting = false;
    let activePopupType = null;
    let renderSessionId = 0; // Prevent race conditions in rendering

    const textSpeedVal = gameData.gameTextSpeed || 3; 
    const imgSpeedVal = gameData.gameImageSpeed || 3;
    const typeSpeedBase = Math.max(5, 80 - (textSpeedVal * 15)); 
    const textAnimDuration = Math.max(0.1, 3.0 - (textSpeedVal * 0.5)) + 's';
    const imageAnimDuration = Math.max(0.3, 5.0 - (imgSpeedVal * 0.9)) + 's';
    
    document.documentElement.style.setProperty('--text-anim-speed', textAnimDuration);
    document.documentElement.style.setProperty('--image-anim-speed', imageAnimDuration);

    const updateFogSizes = (fogContainer) => {
        if (!fogContainer) return;
        const img1 = new Image();
        const img2 = new Image();
        img1.src = "https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-1.png";
        img2.src = "https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-2.png";

        const update = () => {
            const rect = fogContainer.getBoundingClientRect();
            const W = rect.width;
            const H = rect.height;
            if (W === 0 || H === 0) return;

            if (img1.complete && img1.naturalWidth) {
                const R1 = img1.naturalWidth / img1.naturalHeight;
                const vw = W / H > R1 ? W : H * R1;
                const vh = W / H > R1 ? W / R1 : H;
                fogContainer.style.setProperty('--fog-width-1', vw + 'px');
                fogContainer.style.setProperty('--fog-height-1', vh + 'px');
            }
            if (img2.complete && img2.naturalWidth) {
                const R2 = img2.naturalWidth / img2.naturalHeight;
                const vw = W / H > R2 ? W : H * R2;
                const vh = W / H > R2 ? W / R2 : H;
                fogContainer.style.setProperty('--fog-width-2', vw + 'px');
                fogContainer.style.setProperty('--fog-height-2', vh + 'px');
            }
        };

        img1.onload = update;
        img2.onload = update;
        
        window.addEventListener('resize', update);
        update(); 
    };

    (gameData.consequenceTrackers || []).forEach(t => { trackers[t.id] = t.initialValue; });

    const positiveEndingScreen = document.getElementById('positive-ending-screen');
    const negativeEndingScreen = document.getElementById('negative-ending-screen');
    const endingRestartButtons = document.querySelectorAll('.ending-restart-button:not(#vignette-continue-button)');
    
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
    // Overlay Injection if not present
    let sceneOverlay = document.getElementById('scene-overlay');
    if (!sceneOverlay && imageContainer) {
        sceneOverlay = document.createElement('div');
        sceneOverlay.id = 'scene-overlay';
        sceneOverlay.className = 'scene-overlay'; // Base class
        imageContainer.appendChild(sceneOverlay);
    }

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
    
    const acquisitionModal = document.getElementById('acquisition-modal');
    const acquisitionModalTitle = document.getElementById('acquisition-modal-title');
    const acquisitionModalImageContainer = document.getElementById('acquisition-modal-image-container');
    const acquisitionModalImage = document.getElementById('acquisition-modal-image');
    const acquisitionModalDescription = document.getElementById('acquisition-modal-description');
    
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

    // Vignette screen elements detection and injection
    let vignetteScreen = document.getElementById('vignette-screen');
    // Force remove existing element to ensure updates are applied (fixing stale DOM issues)
    if (vignetteScreen) vignetteScreen.remove();

    console.log('Injecting Vignette screen...');
    const vDiv = document.createElement('div');
    vDiv.id = 'vignette-screen';
    vDiv.className = 'splash-screen hidden';
    // Use inline styles as a fallback to guarantee the look matches splash button even if CSS is missing
    const btnStyle = 'font-family: var(--font-family); padding: 12px 24px; font-size: 1.1em; font-weight: bold; border: none; cursor: pointer; color: var(--splash-button-text-color); transition: all 0.2s ease-in-out; width: 100%; max-width: 350px; background-color: var(--splash-button-bg);';
    vDiv.innerHTML = '<div id="vignette-overlay" class="scene-overlay"></div><div class="splash-content" style="z-index: 10;"><div class="splash-text"><h1 id="vignette-title"></h1><p id="vignette-description"></p></div><div class="splash-buttons"><button id="vignette-continue-button" class="ending-restart-button" style="' + btnStyle + '"></button></div></div>';
    document.body.appendChild(vDiv);
    vignetteScreen = vDiv;

    const vignetteTitle = document.getElementById('vignette-title');
    const vignetteDescription = document.getElementById('vignette-description');
    const vignetteContinueButton = document.getElementById('vignette-continue-button');

    // View Diary button in vignettes
    const vignetteDiaryButton = document.createElement('button');
    vignetteDiaryButton.id = 'vignette-diary-button';
    vignetteDiaryButton.className = 'ending-restart-button hidden';
    vignetteDiaryButton.style.cssText = btnStyle + ' margin-top: 10px;';
    vignetteDiaryButton.textContent = gameData.gameTranslations.view_diary_btn;
    vignetteContinueButton.parentElement.appendChild(vignetteDiaryButton);
    vignetteDiaryButton.addEventListener('click', () => showDiary(true));

    // Also add to standard ending screens
    [positiveEndingScreen, negativeEndingScreen].forEach(screen => {
        if (!screen) return;
        const btnContainer = screen.querySelector('.splash-buttons') || screen.querySelector('.splash-content');
        if (btnContainer) {
            const endDiaryBtn = document.createElement('button');
            endDiaryBtn.className = 'ending-restart-button';
            endDiaryBtn.style.cssText = btnStyle + ' margin-top: 10px;';
            endDiaryBtn.textContent = gameData.gameTranslations.view_diary_btn;
            btnContainer.appendChild(endDiaryBtn);
            endDiaryBtn.addEventListener('click', () => showDiary(true));
        }
    });

    const playSound = (src) => { if (src && soundEffectAudio) { soundEffectAudio.src = src; soundEffectAudio.play().catch(() => {}); } };

    let bgmFadeInterval = null;
    const playBgm = (src) => {
        if (!bgmAudio) return;
        if (src === currentBgmSrc) {
            if (bgmAudio.paused && src) {
                bgmAudio.play().catch(() => {});
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
            bgmAudio.play().catch(() => {});
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

    class RainEffect {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.drops = [];
            this.animationFrameId = null;
            this.overlay = null;
            // Config
            this.fall_speed = 0.7;
            this.wind_speed = 5;
            this.rain_weight = 0.11;
            this.rain_color = '255,255,255';
            this.started = false;
        }

        init(targetId) {
            this.overlay = document.getElementById(targetId);
            if (!this.overlay) return;
            
            // Check if canvas already exists
            let canvas = this.overlay.querySelector('.rain-canvas');
            if (!canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.className = 'rain-canvas';
                this.overlay.appendChild(this.canvas);
                
                // Add Lightning Layer
                const lightning = document.createElement('div');
                lightning.className = 'lightning-layer';
                this.overlay.appendChild(lightning);
            } else {
                this.canvas = canvas;
            }
            this.ctx = this.canvas.getContext('2d');
            
            // Resize immediately
            this.resizer();
            window.addEventListener('resize', () => this.resizer());
        }

        start(targetId = 'scene-overlay') {
            if (this.started && this.currentTargetId === targetId) return;
            if (this.started) this.stop();
            this.currentTargetId = targetId;
            this.init(targetId);
            if (!this.ctx) return;
            this.started = true;
            this.loop();
        }

        stop() {
            this.started = false;
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        randomFrom(min, max) {
            return (Math.random() * (max - min) + min);
        }

        resizer() {
            if (!this.canvas || !this.overlay) return;
            const width = this.overlay.clientWidth;
            const height = this.overlay.clientHeight;
            this.canvas.width = width;
            this.canvas.height = height;
            
            const drop_count = Math.floor(width * this.rain_weight * 1.5);
            this.drops = [];
            for (let i = 0; i < drop_count; i++) {
                this.drops[i] = new Drop(this);
            }
        }

        loop() {
            if (!this.started || !this.ctx || !this.canvas) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.drops.length; i++) {
                this.drops[i].fall();
                this.drops[i].draw();
            }
            this.animationFrameId = requestAnimationFrame(() => this.loop());
        }
    }

    class Drop {
        constructor(effect) {
            this.effect = effect;
            this.reset();
        }
        
        reset() {
            const canvas = this.effect.canvas;
            this.r = this.effect.randomFrom(0.8, 1.6);
            this.l = (this.r * 250);
            this.x = this.effect.randomFrom((canvas.width * -0.25), (canvas.width * 1.125));
            this.y = this.effect.randomFrom((canvas.height * -0.25), (canvas.height * -1));
            this.dx = this.effect.randomFrom((this.effect.wind_speed - 3), (this.effect.wind_speed + 3));
            this.dy = (this.r * (100 * this.effect.fall_speed));
            this.offset = (this.l * (this.dx / this.dy));
            this.opacity = (this.r * this.effect.randomFrom(0.2, 0.6));
            this.drip = this.render();
        }

        render() {
            const canv = document.createElement('canvas');
            const ctx = canv.getContext('2d');
            const width = Math.abs(this.offset) + this.r;
            if (width <= 0 || this.l <= 0) return null;
            canv.setAttribute('width', width);
            canv.setAttribute('height', this.l);
            
            ctx.beginPath();
            const drip = ctx.createLinearGradient(0, 0, 0, this.l);
            drip.addColorStop(0, 'rgba(' + this.effect.rain_color + ', 0)');
            drip.addColorStop(1, 'rgba(' + this.effect.rain_color + ', ' + this.opacity + ')');
            ctx.fillStyle = drip;
            
            const startX = (this.offset >= 0) ? 0 : Math.abs(this.offset);
            ctx.moveTo(startX, 0);
            ctx.lineTo(startX + this.r, 0);
            ctx.lineTo(startX + this.r + this.offset, this.l);
            ctx.lineTo(startX + this.offset, this.l);
            ctx.closePath();
            ctx.fill();
            return canv;
        }

        draw() {
            if (this.drip && this.effect.ctx) {
                this.effect.ctx.drawImage(this.drip, this.x, this.y);
            }
        }

        fall() {
            this.x += this.dx;
            this.y += this.dy;
            if (this.y > (this.effect.canvas.height * 1.25)) {
                this.reset();
            }
        }
    }

    const rainEffect = new RainEffect();

    // Confetti Effect Classes
    class Vector2 {
        constructor(x, y) { this.x = x; this.y = y; }
        Length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
        Add(v) { this.x += v.x; this.y += v.y; }
        Sub(v) { this.x -= v.x; this.y -= v.y; }
        Div(f) { this.x /= f; this.y /= f; }
        Mul(f) { this.x *= f; this.y *= f; }
        Normalize() {
            const len = this.Length();
            if (len !== 0) { this.x /= len; this.y /= len; }
        }
        static Sub(v0, v1) { return new Vector2(v0.x - v1.x, v0.y - v1.y); }
    }

    class EulerMass {
        constructor(x, y, mass, drag) {
            this.position = new Vector2(x, y);
            this.mass = mass; this.drag = drag;
            this.force = new Vector2(0, 0);
            this.velocity = new Vector2(0, 0);
        }
        AddForce(f) { this.force.Add(f); }
        Integrate(dt) {
            const acc = new Vector2(this.force.x, this.force.y);
            const speed = this.velocity.Length();
            const dragVel = new Vector2(this.velocity.x, this.velocity.y);
            dragVel.Mul(this.drag * this.mass * speed);
            acc.Sub(dragVel);
            acc.Div(this.mass);
            const posDelta = new Vector2(this.velocity.x, this.velocity.y);
            posDelta.Mul(dt);
            this.position.Add(posDelta);
            acc.Mul(dt);
            this.velocity.Add(acc);
            this.force = new Vector2(0, 0);
        }
    }

    class ConfettiPaper {
        constructor(x, y, effect) {
            this.effect = effect;
            this.pos = new Vector2(x, y);
            this.rotationSpeed = Math.random() * 600 + 800;
            this.angle = (Math.PI / 180) * Math.random() * 360;
            this.rotation = (Math.PI / 180) * Math.random() * 360;
            this.cosA = 1.0;
            this.size = 5.0;
            this.oscillationSpeed = Math.random() * 1.5 + 0.5;
            this.xSpeed = 40.0;
            this.ySpeed = Math.random() * 60 + 50.0;
            this.corners = [];
            this.time = Math.random();
            const colors = [["#df0049","#660671"],["#00e857","#005291"],["#2bebbc","#05798a"],["#ffd200","#b06c00"]];
            const ci = Math.round(Math.random() * (colors.length - 1));
            this.frontColor = colors[ci][0];
            this.backColor = colors[ci][1];
            for (let i = 0; i < 4; i++) {
                this.corners[i] = new Vector2(
                    Math.cos(this.angle + (Math.PI / 180) * (i * 90 + 45)),
                    Math.sin(this.angle + (Math.PI / 180) * (i * 90 + 45))
                );
            }
        }
        Update(dt) {
            this.time += dt;
            this.rotation += this.rotationSpeed * dt;
            this.cosA = Math.cos((Math.PI / 180) * this.rotation);
            this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * dt;
            this.pos.y += this.ySpeed * dt;
            if (this.pos.y > this.effect.canvasHeight) {
                this.pos.x = Math.random() * this.effect.canvasWidth;
                this.pos.y = 0;
            }
        }
        Draw(g) {
            const retina = window.devicePixelRatio || 1;
            g.fillStyle = this.cosA > 0 ? this.frontColor : this.backColor;
            g.beginPath();
            g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
            for (let i = 1; i < 4; i++) {
                g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
            }
            g.closePath();
            g.fill();
        }
    }

    class ConfettiRibbon {
        constructor(x, y, count, dist, thickness, angle, mass, drag, effect) {
            this.effect = effect;
            this.particleDist = dist; this.particleCount = count;
            this.particleMass = mass; this.particleDrag = drag;
            this.particles = [];
            const colors = [["#df0049","#660671"],["#00e857","#005291"],["#2bebbc","#05798a"],["#ffd200","#b06c00"]];
            const ci = Math.round(Math.random() * (colors.length - 1));
            this.frontColor = colors[ci][0]; this.backColor = colors[ci][1];
            this.xOff = Math.cos((Math.PI / 180) * angle) * thickness;
            this.yOff = Math.sin((Math.PI / 180) * angle) * thickness;
            this.position = new Vector2(x, y);
            this.prevPosition = new Vector2(x, y);
            this.velocityInherit = Math.random() * 2 + 4;
            this.time = Math.random() * 100;
            this.oscillationSpeed = Math.random() * 2 + 2;
            this.oscillationDistance = Math.random() * 40 + 40;
            this.ySpeed = Math.random() * 40 + 80;
            for (let i = 0; i < this.particleCount; i++) {
                this.particles[i] = new EulerMass(x, y - i * this.particleDist, this.particleMass, this.particleDrag);
            }
        }
        Update(dt) {
            this.time += dt * this.oscillationSpeed;
            this.position.y += this.ySpeed * dt;
            this.position.x += Math.cos(this.time) * this.oscillationDistance * dt;
            this.particles[0].position = this.position;
            const dX = this.prevPosition.x - this.position.x;
            const dY = this.prevPosition.y - this.position.y;
            const delta = Math.sqrt(dX * dX + dY * dY);
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            for (let i = 1; i < this.particleCount; i++) {
                const dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
                dirP.Normalize();
                dirP.Mul((delta / dt) * this.velocityInherit);
                this.particles[i].AddForce(dirP);
            }
            for (let i = 1; i < this.particleCount; i++) {
                this.particles[i].Integrate(dt);
            }
            for (let i = 1; i < this.particleCount; i++) {
                const rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
                rp2.Sub(this.particles[i - 1].position);
                rp2.Normalize();
                rp2.Mul(this.particleDist);
                rp2.Add(this.particles[i - 1].position);
                this.particles[i].position = rp2;
            }
            if (this.position.y > this.effect.canvasHeight + this.particleDist * this.particleCount) {
                this.Reset();
            }
        }
        Reset() {
            this.position.y = -Math.random() * this.effect.canvasHeight;
            this.position.x = Math.random() * this.effect.canvasWidth;
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            this.velocityInherit = Math.random() * 2 + 4;
            this.time = Math.random() * 100;
            this.oscillationSpeed = Math.random() * 2.0 + 1.5;
            this.oscillationDistance = Math.random() * 40 + 40;
            this.ySpeed = Math.random() * 40 + 80;
            const colors = [["#df0049","#660671"],["#00e857","#005291"],["#2bebbc","#05798a"],["#ffd200","#b06c00"]];
            const ci = Math.round(Math.random() * (colors.length - 1));
            this.frontColor = colors[ci][0]; this.backColor = colors[ci][1];
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
            }
        }
        Side(x1, y1, x2, y2, x3, y3) { return (x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2); }
        Draw(g) {
            const retina = window.devicePixelRatio || 1;
            for (let i = 0; i < this.particleCount - 1; i++) {
                const p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
                const p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
                g.fillStyle = this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0 ? this.frontColor : this.backColor;
                g.strokeStyle = g.fillStyle;
                g.beginPath();
                g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
                g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
                g.lineTo(p1.x * retina, p1.y * retina);
                g.lineTo(p0.x * retina, p0.y * retina);
                g.closePath();
                g.stroke();
                g.fill();
            }
        }
    }

    class ConfettiEffect {
        constructor() {
            this.canvas = null; this.ctx = null;
            this.papers = []; this.ribbons = [];
            this.animationFrameId = null;
            this.overlay = null;
            this.canvasWidth = 0; this.canvasHeight = 0;
            this.started = false;
            this.duration = 1.0 / 50;
        }
        init(targetId) {
            this.overlay = document.getElementById(targetId);
            if (!this.overlay) return;
            let canvas = this.overlay.querySelector('.confetti-canvas');
            if (!canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.className = 'confetti-canvas';
                this.overlay.appendChild(this.canvas);
            } else {
                this.canvas = canvas;
            }
            this.ctx = this.canvas.getContext('2d');
            this.resizer();
            window.addEventListener('resize', () => this.resizer());
        }
        start(targetId = 'scene-overlay') {
            if (this.started && this.currentTargetId === targetId) return;
            if (this.started) this.stop();
            this.currentTargetId = targetId;
            this.init(targetId);
            if (!this.ctx) return;
            this.started = true;
            this.loop();
        }
        stop() {
            this.started = false;
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        resizer() {
            if (!this.canvas || !this.overlay) return;
            const retina = window.devicePixelRatio || 1;
            this.canvasWidth = this.overlay.clientWidth;
            this.canvasHeight = this.overlay.clientHeight;
            this.canvas.width = this.canvasWidth * retina;
            this.canvas.height = this.canvasHeight * retina;
            this.papers = [];
            for (let i = 0; i < 95; i++) {
                this.papers.push(new ConfettiPaper(Math.random() * this.canvasWidth, Math.random() * this.canvasHeight, this));
            }
            this.ribbons = [];
            for (let i = 0; i < 11; i++) {
                this.ribbons.push(new ConfettiRibbon(Math.random() * this.canvasWidth, -Math.random() * this.canvasHeight * 2, 30, 8.0, 8.0, 45, 1, 0.05, this));
            }
        }
        loop() {
            if (!this.started || !this.ctx || !this.canvas) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.papers.length; i++) {
                this.papers[i].Update(this.duration);
                this.papers[i].Draw(this.ctx);
            }
            for (let i = 0; i < this.ribbons.length; i++) {
                this.ribbons[i].Update(this.duration);
                this.ribbons[i].Draw(this.ctx);
            }
            this.animationFrameId = requestAnimationFrame(() => this.loop());
        }
    }

    const confettiEffect = new ConfettiEffect();

    class GlitchEffect {
        constructor() {
            this.canvas = null; this.ctx = null;
            this.animationFrameId = null;
            this.overlay = null;
            this.started = false;
            this.width = 0; this.height = 0;
        }

        init(targetId) {
            this.overlay = document.getElementById(targetId);
            if (!this.overlay) return;
            
            let canvas = this.overlay.querySelector('.glitch-canvas');
            if (!canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.className = 'glitch-canvas';
                this.overlay.appendChild(this.canvas);
            } else {
                this.canvas = canvas;
            }
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            if (!this.canvas || !this.overlay) return;
            this.width = this.canvas.width = this.overlay.clientWidth;
            this.height = this.canvas.height = this.overlay.clientHeight;
        }

        start(targetId = 'scene-overlay') {
            if (this.started && this.currentTargetId === targetId) return;
            if (this.started) this.stop();
            this.currentTargetId = targetId;
            this.init(targetId);
            if (!this.ctx || !this.overlay) return;
            
            this.overlay.classList.add('overlay-glitch');
            this.started = true;
            this.loop();
        }

        stop() {
            this.started = false;
            if (this.overlay) this.overlay.classList.remove('overlay-glitch');
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.width, this.height);
        }

        loop() {
            if (!this.started || !this.ctx) return;
            
            this.ctx.clearRect(0, 0, this.width, this.height);

            // 1. Random horizontal slice displacements
            if (Math.random() > 0.9) {
                const sliceHeight = Math.random() * 50 + 5;
                const sliceY = Math.random() * this.height;
                
                this.ctx.fillStyle = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + (Math.random() * 0.5) + ')';
                this.ctx.fillRect(0, sliceY, this.width, sliceHeight);

                if (Math.random() > 0.5) {
                   this.ctx.clearRect(0, Math.random() * this.height, this.width, Math.random() * 10);
                }
            }

            // 2. RGB Shift / Blocks
            if (Math.random() > 0.8) {
                const blockW = Math.random() * 200 + 50;
                const blockH = Math.random() * 50 + 10;
                const blockX = Math.random() * this.width;
                const blockY = Math.random() * this.height;

                this.ctx.globalCompositeOperation = 'color-dodge';
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(blockX - 5, blockY, blockW, blockH);
                this.ctx.fillStyle = '#0000ff';
                this.ctx.fillRect(blockX + 5, blockY, blockW, blockH);
                this.ctx.globalCompositeOperation = 'source-over';
            }

            // 3. Scanline jitter
            if (Math.random() > 0.95) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.fillRect(0, 0, this.width, this.height);
            }

            this.animationFrameId = requestAnimationFrame(() => this.loop());
        }
    }

    const glitchEffect = new GlitchEffect();

    const init = () => {
        if (gameData.gameBackgroundMusic) {
            playBgm(gameData.gameBackgroundMusic);
        }

        const startAudioOnInteraction = () => {
            if (bgmAudio.paused && !isGameEnded && bgmAudio.src && bgmAudio.src !== window.location.href && bgmAudio.src !== "") {
                bgmAudio.play().catch(() => {});
            } else if (gameData.gameBackgroundMusic && bgmAudio.paused && !isGameEnded) {
                playBgm(gameData.gameBackgroundMusic);
            }
            document.removeEventListener('mousedown', startAudioOnInteraction);
            document.removeEventListener('keydown', startAudioOnInteraction);
        };
        document.addEventListener('mousedown', startAudioOnInteraction);
        document.addEventListener('keydown', startAudioOnInteraction);

        // Auto-start game, bypassing splash screen
        startGame();
        endingRestartButtons.forEach(btn => btn.addEventListener('click', () => {
             // Prepare the game behind the ending screen
             startGame();
             gameContainer.classList.remove('hidden');
             gameContainer.classList.remove('fade-out');

             positiveEndingScreen.classList.add('fade-out');
             negativeEndingScreen.classList.add('fade-out');
             setTimeout(() => {
                 positiveEndingScreen.classList.add('hidden'); 
                 negativeEndingScreen.classList.add('hidden');
                 positiveEndingScreen.classList.remove('fade-out');
                 negativeEndingScreen.classList.remove('fade-out');
             }, 1000);
        }));
        submitVerb.addEventListener('click', handleInput);
        verbInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleInput(); });
        if (suggestionsButton) suggestionsButton.addEventListener('click', () => togglePopup('suggestions'));
        if (inventoryButton) inventoryButton.addEventListener('click', () => togglePopup('inventory'));
        if (diaryButton) diaryButton.addEventListener('click', () => showDiary(false));
        if (trackersButton) trackersButton.addEventListener('click', showTrackers);
        if (systemButton) systemButton.addEventListener('click', toggleSystemMenu);
        closeButtons.forEach(btn => btn.addEventListener('click', (e) => { e.target.closest('.modal-overlay').classList.add('hidden'); }));
        btnSaveMenu.addEventListener('click', () => renderSlots('save'));
        btnLoadMenu.addEventListener('click', () => renderSlots('load'));
        btnBackSystem.addEventListener('click', () => { systemSlotsContainer.classList.add('hidden'); systemMenuMain.classList.remove('hidden'); systemModalTitle.textContent = gameData.gameSystemButtonText || 'Sistema'; });
        
        viewEndingButton.addEventListener('click', () => {
             const isWin = isGameEnded === 'win';
             // For defeat: check if there's a defeat scene/vignette to navigate to
             if (!isWin) {
                 const defeatSceneId = Object.keys(gameData.cenas).find(id => gameData.cenas[id].isDefeatOutcome);
                 if (defeatSceneId) {
                     // Reset UI back to standard action bar for the defeat vignette
                     standardActionBar.classList.remove('hidden');
                     endingActionBar.classList.add('hidden');
                     isGameEnded = false;
                     loadScene(defeatSceneId, true);
                     return;
                 }
             }
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
            isGameEnded = false; 
            startGame();
        };
        if (window.isSceneTest) startGame();
    };

    const startGame = () => {
        if (!window.isPreview) localStorage.removeItem('if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas'));
        currentSceneId = gameData.cena_inicial; 
        inventory = []; 
        visitedScenes = []; 
        actionLog = []; 
        chances = gameData.gameMaxChances || 3; 
        trackers = {}; 
        removedObjectsFromScenes = {};
        isGameEnded = false;
        gameStartTime = Date.now();
        gameEndTime = null;

        // Hide retrospective button on restart
        if (vignetteDiaryButton) vignetteDiaryButton.classList.add('hidden');
        (gameData.consequenceTrackers || []).forEach(t => { trackers[t.id] = t.initialValue; });
        
        // Fix Audio Persistence: If the starting scene has no specific music.
        // If it is a SCENE TEST, we do NOT fallback to global music (keep it silent/clean).
        const startScene = gameData.cenas[currentSceneId];
        if (startScene) {
            if (!startScene.backgroundMusic) {
                if (!window.isSceneTest) {
                    playBgm(gameData.gameBackgroundMusic || "");
                } else {
                    playBgm(""); 
                }
            }
            loadScene(currentSceneId, false);
        } else {
             console.error("Start scene not found:", currentSceneId);
        }

        standardActionBar.classList.remove('hidden');
        endingActionBar.classList.add('hidden');
        
        const isVignette = startScene && startScene.vignetteType && startScene.vignetteType !== 'none';
        
        if (!isVignette) {
            gameContainer.classList.remove('hidden');
            if (window.isSceneTest) {
                const hasImage = startScene && startScene.image && gameData.enableImages !== false;
                
                const showGame = () => {
                     gameContainer.classList.add('ready');
                };

                if (hasImage) {
                     const img = document.getElementById('scene-image');
                     if (img && img instanceof HTMLImageElement) {
                         if (img.complete && img.naturalHeight !== 0) {
                             showGame();
                         } else {
                             img.onload = showGame;
                             img.onerror = showGame;
                             // Safety timeout
                             setTimeout(showGame, 2000);
                         }
                     } else {
                         showGame();
                     }
                } else {
                     // Small delay to ensure layout frames are ready
                     setTimeout(showGame, 50);
                }

            } else {
                // Unhide game container instantly in standard play
                gameContainer.classList.add('ready');
            }
        }
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
                gameContainer.classList.remove('hidden');
                gameContainer.classList.add('ready');
            }
        } catch (e) { startGame(); }
    };

    const autoSaveGame = () => {
        if (window.isPreview) return; 
        if (isGameEnded) return;
        const save = { currentSceneId, inventory, visitedScenes, actionLog, chances, trackers, removedObjectsFromScenes, timestamp: new Date().toLocaleString() };
        localStorage.setItem('if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas'), JSON.stringify(save));
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
            const slotKey = 'if_builder_slot_' + i + '_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
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
        const slotKey = 'if_builder_slot_' + slotIndex + '_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas');
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
        effects.forEach(effect => { if (Object.prototype.hasOwnProperty.call(trackers, effect.trackerId)) trackers[effect.trackerId] += effect.valueChange; });
        checkTrackers();
    };

    const checkTrackers = () => {
        const definitions = gameData.consequenceTrackers || [];
        for (const def of definitions) { if (trackers[def.id] >= def.maxValue && def.consequenceSceneId) { setTimeout(() => { loadScene(def.consequenceSceneId, true, 'fade'); }, 500); return; } }
    };

    const showVignetteScreen = (scene) => {
        // Hide retrospective button by default, only show for conclusions
        if (vignetteDiaryButton) vignetteDiaryButton.classList.add('hidden');

        // If it's a conclusion vignette, set the end state flags manually
        // We avoid calling activateEndingUI here because that would swap action bars 
        // in the game container, causing buttons to "pop in" during the cross-fade.
        if (scene.vignetteType === 'conclusion') {
             isGameEnded = 'win';
             gameEndTime = Date.now();
             
             // Show the diary button on the vignette screen if enabled
             if (vignetteDiaryButton && gameData.enableRetrospective !== false) {
                 vignetteDiaryButton.classList.remove('hidden');
             }
        }
        
        // Set vignette content
        if (vignetteTitle) {
            vignetteTitle.textContent = scene.name || '';
            vignetteTitle.classList.toggle('hidden', !!scene.omitSplashTitle);
        }
        if (vignetteDescription) {
            vignetteDescription.textContent = scene.description || '';
            vignetteDescription.classList.toggle('hidden', !!scene.omitSplashDescription);
        }
        
        // Set button text
        const buttonText = scene.vignetteButtonText || (scene.vignetteType === 'conclusion' ? (gameData.gameRestartButtonText || 'Restart') : (gameData.gameContinueButtonText || 'Continue'));
        if (vignetteContinueButton) vignetteContinueButton.textContent = buttonText;
        
        // Set background image
        if (scene.image) {
            vignetteScreen.style.backgroundImage = 'url(' + scene.image + ')';
        } else {
            vignetteScreen.style.backgroundImage = 'none';
        }

        // Overlay Effect for Vignette
        const vOverlay = document.getElementById('vignette-overlay');
        if (vOverlay) {
            vOverlay.className = 'scene-overlay'; 
            if (scene.overlayEffect) {
                vOverlay.classList.add('overlay-' + scene.overlayEffect);
            }

        }
        
        // Play background music for this vignette scene
        if (scene.backgroundMusic) {
            playBgm(scene.backgroundMusic);
        }
        
        // Handle button click
        const handleVignetteClick = () => {
            if (typeof rainEffect !== 'undefined') rainEffect.stop();
            
            if (scene.vignetteType === 'conclusion') {
                // Restart game
                playBgm(gameData.gameBackgroundMusic || "");
                startGame();
                
                // CRITICAL FIX: If the game starts with a vignette (opening), 
                // we must NOT fade out the vignette screen, or it will be skipped.
                const nextScene = gameData.cenas[currentSceneId];
                const isNextVignette = nextScene && nextScene.vignetteType && nextScene.vignetteType !== 'none';
                
                if (!isNextVignette) {
                    // Only reveal game container if we are transitioning to a narrative scene
                    gameContainer.classList.remove('hidden');
                    gameContainer.classList.remove('fade-out');

                    vignetteScreen.classList.add('fade-out');
                    setTimeout(() => {
                        vignetteScreen.classList.add('hidden');
                        vignetteScreen.classList.remove('fade-out');
                    }, 1000);
                }
                return;

            } else if (scene.vignetteNextSceneId) {
                const nextSceneId = scene.vignetteNextSceneId;
                const nextScene = gameData.cenas[nextSceneId];
                
                if (nextScene) {
                    const isNextVignette = nextScene.vignetteType && nextScene.vignetteType !== 'none';
                    
                    if (isNextVignette) {
                        // Vignette to Vignette: Just load the next one instantly
                        // The showVignetteScreen call inside loadScene will update the content
                        loadScene(nextSceneId, false);
                    } else {
                        // Vignette to Narrative: Load narrative behind, then fade out vignette
                        loadScene(nextSceneId, false);
                        gameContainer.classList.remove('hidden');
                        gameContainer.classList.remove('fade-out');
                        
                        vignetteScreen.classList.add('fade-out');
                        setTimeout(() => {
                            vignetteScreen.classList.add('hidden');
                            vignetteScreen.classList.remove('fade-out');
                        }, 1000);
                    }
                } else {
                    console.warn('Vignette target scene not found:', nextSceneId);
                    vignetteScreen.classList.add('fade-out');
                    setTimeout(() => {
                        vignetteScreen.classList.add('hidden');
                        vignetteScreen.classList.remove('fade-out');
                        gameContainer.classList.remove('hidden');
                        gameContainer.classList.remove('fade-out');
                    }, 1000);
                }
            } else {
                // No next scene defined: Fade out vignette to show current game container
                gameContainer.classList.remove('hidden');
                gameContainer.classList.remove('fade-out');
                vignetteScreen.classList.add('fade-out');
                setTimeout(() => {
                    vignetteScreen.classList.add('hidden');
                    vignetteScreen.classList.remove('fade-out');
                }, 1000);
            }
        };
        
        vignetteContinueButton.onclick = handleVignetteClick;

        // Credits rendering for conclusion vignettes
        const existingCredits = vignetteScreen.querySelector('.vignette-credits');
        if (existingCredits) existingCredits.remove();

        if (scene.creditsText && scene.creditsText.trim()) {
            const creditsDiv = document.createElement('div');
            creditsDiv.className = 'vignette-credits';
            if (scene.creditsScrollEnabled) {
                creditsDiv.classList.add('credits-scroll');
            }

            // Determine which side the content is on to put credits on the opposite
            // Content defaults to right (flex-end), but align-left class moves it to left
            const isContentLeft = vignetteScreen.classList.contains('align-left');
            if (isContentLeft) {
                creditsDiv.classList.add('credits-right');
            } else {
                creditsDiv.classList.add('credits-left');
            }

            const creditsInner = document.createElement('div');
            creditsInner.className = 'vignette-credits-text';
            creditsInner.textContent = scene.creditsText;
            creditsDiv.appendChild(creditsInner);
            vignetteScreen.appendChild(creditsDiv);
        }
        
        // Show the vignette screen FIRST, then start rain effect after it's visible
        vignetteScreen.classList.remove('hidden');
        
        // Rain Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'rain') {
            requestAnimationFrame(() => {
                if (typeof rainEffect !== 'undefined') rainEffect.start('vignette-overlay');
            });
        } else {
            if (typeof rainEffect !== 'undefined') rainEffect.stop();
        }

        // Blur Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'blur') {
            requestAnimationFrame(() => {
                const vOverlay = document.getElementById('vignette-overlay');
                if (vOverlay) {
                    // Clear any existing blur container first
                    const existing = vOverlay.querySelector('.blur-overlay-container');
                    if (existing) existing.remove();
                    
                    const blurContainer = document.createElement('div');
                    blurContainer.className = 'blur-overlay-container';
                    blurContainer.innerHTML = '<div class="blur-rumble-layer"></div><div class="blur-flicker-layer"></div><div class="blur-grain-layer"></div><div class="blur-vignette-layer"></div>';
                    vOverlay.appendChild(blurContainer);
                }
            });
        }

        // Chromatic Aberration Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'chromatic') {
            requestAnimationFrame(() => {
                const vOverlay = document.getElementById('vignette-overlay');
                if (vOverlay) {
                    // Clear any existing chromatic container first
                    const existing = vOverlay.querySelector('.chromatic-overlay-container');
                    if (existing) existing.remove();
                    
                    const chromaticContainer = document.createElement('div');
                    chromaticContainer.className = 'chromatic-overlay-container';
                    chromaticContainer.innerHTML = '<div class="chromatic-jerk-wrapper"><div class="chromatic-layer chromatic-red"></div><div class="chromatic-layer chromatic-green"></div><div class="chromatic-layer chromatic-blue"></div><div class="chromatic-flicker"></div></div><div class="chromatic-scanlines"></div>';
                    vOverlay.appendChild(chromaticContainer);
                }
            });
        }

        // TV Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'tv') {
            requestAnimationFrame(() => {
                const vOverlay = document.getElementById('vignette-overlay');
                if (vOverlay) {
                    // Use CSS class - filter is applied via ::before pseudo-element to only affect background
                    vignetteScreen.classList.add('tv-active');

                    // Clear any existing TV container first
                    const existing = vOverlay.querySelector('.tv-overlay-container');
                    if (existing) existing.remove();
                    
                    const tvContainer = document.createElement('div');
                    tvContainer.className = 'tv-overlay-container';
                    tvContainer.innerHTML = '<div class="tv-screen-wrapper"><div class="tv-rgb-grid"></div><div class="tv-scanlines"></div><div class="tv-vignette"></div><div class="tv-glow"></div><div class="tv-flicker"></div><div class="tv-interference"></div></div>';
                    vOverlay.appendChild(tvContainer);
                }
            });
        } else {
            // Remove CSS class
            vignetteScreen.classList.remove('tv-active');
            const vOverlay = document.getElementById('vignette-overlay');
            if (vOverlay) {
                vOverlay.parentElement?.classList.remove('tv-distortion-active-lg');
            }
        }

        // Confetti Effect Logic for Vignette (deferred to ensure element has dimensions)
        if (scene.overlayEffect === 'confetti') {
            requestAnimationFrame(() => {
                if (typeof confettiEffect !== 'undefined') confettiEffect.start('vignette-overlay');
            });
        } else {
            if (typeof confettiEffect !== 'undefined') confettiEffect.stop();
        }

        // Glitch Effect Logic for Vignette - Inject SVG filter and apply to background
        if (scene.overlayEffect === 'glitch') {
            requestAnimationFrame(() => {
                // Ensure SVG filter exists
                if (!document.getElementById('glitch-distortion-filter')) {
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('style', 'position:absolute;width:0;height:0;');
                    svg.innerHTML = '<defs><filter id="glitch-distortion-filter" x="-10%" y="-10%" width="120%" height="120%"><feOffset in="SourceGraphic" dx="0" dy="0" result="r_offset"><animate attributeName="dx" values="0;0;0;0;-4;0;0;0;0;-3;0;0" dur="3s" repeatCount="indefinite"/></feOffset><feOffset in="SourceGraphic" dx="0" dy="0" result="b_offset"><animate attributeName="dx" values="0;0;0;0;4;0;0;0;0;3;0;0" dur="3s" repeatCount="indefinite"/></feOffset><feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" /><feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/><feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/><feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/><feBlend in="red" in2="green" mode="screen" result="rg"/><feBlend in="rg" in2="blue" mode="screen" result="rgb"/><feTurbulence type="fractalNoise" baseFrequency="0.001 0.5" numOctaves="1" result="noise" seed="5"><animate attributeName="seed" values="5;5;5;5;8;5;5;5;5;3;5;5" dur="4s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
                    document.body.appendChild(svg);
                }
                // Use CSS class - filter is applied via ::before pseudo-element
                vignetteScreen.classList.add('glitch-active');
                if (typeof glitchEffect !== 'undefined') glitchEffect.start('vignette-overlay');
            });
        } else {
            // Remove CSS class
            vignetteScreen.classList.remove('glitch-active');
            if (typeof glitchEffect !== 'undefined') glitchEffect.stop();
        }

        // Nosferatu Effect Logic for Vignette
        if (scene.overlayEffect === 'nosferatu') {
            requestAnimationFrame(() => {
                const vOverlay = document.getElementById('vignette-overlay');
                if (vOverlay) {
                    // Clear any existing nosferatu container first
                    const existing = vOverlay.querySelector('.nosferatu-container');
                    if (existing) existing.remove();
                    
                    const nosferatuContainer = document.createElement('div');
                    nosferatuContainer.className = 'nosferatu-container';
                    nosferatuContainer.innerHTML = '<div class="nosferatu-cinema"></div><div class="nosferatu-scratch"></div><div class="nosferatu-effect-scratch"></div><div class="nosferatu-grain"></div><div class="nosferatu-vignette"></div>';
                    vOverlay.appendChild(nosferatuContainer);
                }
                // CSS class handles the background filter via ::before pseudo-element
                vignetteScreen.classList.add('nosferatu-active');
            });
        } else {
            // Remove nosferatu filter if not active and not other filter effect
            if (scene.overlayEffect !== 'tv' && scene.overlayEffect !== 'glitch') {
                vignetteScreen.style.filter = '';
            }
            vignetteScreen.classList.remove('nosferatu-active');
            if (vOverlay) {
                const existing = vOverlay.querySelector('.nosferatu-container');
                if (existing) existing.remove();
            }
        }

        // Wiggle Effect Logic for Vignette
        if (scene.overlayEffect === 'wiggle') {
            requestAnimationFrame(() => {
                // CSS class handles the background animation via ::before pseudo-element
                vignetteScreen.classList.add('wiggle-active');
            });
        } else {
            vignetteScreen.classList.remove('wiggle-active');
        }

        // Fog Effect Logic for Vignette
        if (scene.overlayEffect === 'fog') {
            requestAnimationFrame(() => {
                const vOverlay = document.getElementById('vignette-overlay');
                if (vOverlay) {
                    const existing = vOverlay.querySelector('.fog-container');
                    if (existing) existing.remove();
                    
                    const fogContainer = document.createElement('div');
                    fogContainer.className = 'fog-container';
                    fogContainer.innerHTML = '<div class="fog-img fog-img-first"></div><div class="fog-img fog-img-second"></div>';
                    vOverlay.appendChild(fogContainer);
                    vOverlay.classList.add('overlay-fog');
                    
                    updateFogSizes(fogContainer);
                }
            });
        } else {
            const vOverlay = document.getElementById('vignette-overlay');
            if (vOverlay) {
                vOverlay.classList.remove('overlay-fog');
                const existing = vOverlay.querySelector('.fog-container');
                if (existing) existing.remove();
            }
        }
    };

    const loadScene = (sceneId, transition = true, transitionType = 'none', transitionSpeed = null, successPrefix = null) => {
        const scene = gameData.cenas[sceneId]; if (!scene) return;
        if (scene.backgroundMusic) playBgm(scene.backgroundMusic);
        const oldChances = chances;
        if (scene.removesChanceOnEntry && gameData.enableChances) chances--; 
        if (scene.restoresChanceOnEntry && gameData.enableChances) chances = Math.min(chances + 1, gameData.gameMaxChances);
        
        if (chances !== oldChances) {
            lastChanceChange = {
                type: chances < oldChances ? 'lost' : 'restored',
                index: chances < oldChances ? chances : (chances - 1)
            };
        }
        currentSceneId = sceneId;
        if (!visitedScenes.includes(sceneId)) visitedScenes.push(sceneId);
        actionLog.push({ type: 'scene', name: scene.name, timestamp: new Date().toLocaleTimeString(), description: scene.description, image: scene.image });
        
        // Check if this is a vignette scene
        if (scene.vignetteType && scene.vignetteType !== 'none') {
            if (transition) {
                // Prepare vignette screen with fade-out before making it visible
                vignetteScreen.classList.add('fade-out');
                showVignetteScreen(scene);
                
                // Cross-fade: fade out game and fade in vignette
                gameContainer.classList.add('fade-out');
                
                // Trigger fade-in for vignette
                requestAnimationFrame(() => {
                    vignetteScreen.classList.remove('fade-out');
                });

                setTimeout(() => {
                    gameContainer.classList.add('hidden');
                    gameContainer.classList.remove('fade-out');
                }, 1000);
            } else {
                showVignetteScreen(scene);
                // If no transition, hide game container immediately
                gameContainer.classList.add('hidden');
            }
            autoSaveGame();
            return;
        }
        
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
                const currentVal = verbInput.textContent.trim();
                verbInput.textContent = currentVal ? (currentVal + ' ' + word) : word;
                verbInput.focus();
                
                // Move cursor to end for contenteditable
                if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
                    const range = document.createRange();
                    range.selectNodeContents(verbInput);
                    range.collapse(false);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
        });
    };

    const renderScene = (scene, successPrefix = null) => {
        if (scene.image) { sceneImage.src = scene.image; sceneImage.classList.remove('hidden'); imageContainer.classList.remove('no-image'); }
        else { sceneImage.src = ''; sceneImage.classList.add('hidden'); imageContainer.classList.add('no-image'); }
        if (sceneNameOverlay) { sceneNameOverlay.textContent = scene.name; sceneNameOverlay.style.opacity = '1'; }
        
        // Handle Overlay Effect
        if (sceneOverlay) {
            sceneOverlay.className = 'scene-overlay'; // Reset
            // Clear previous effect DOM
            const existingBlur = sceneOverlay.querySelector('.blur-overlay-container');
            if (existingBlur) existingBlur.remove();
            const existingChromatic = sceneOverlay.querySelector('.chromatic-overlay-container');
            if (existingChromatic) existingChromatic.remove();
            const existingTV = sceneOverlay.querySelector('.tv-overlay-container');
            if (existingTV) existingTV.remove();
            const existingConfetti = sceneOverlay.querySelector('.confetti-overlay-container');
            if (existingConfetti) existingConfetti.remove();
            const existingGlitch = sceneOverlay.querySelector('.glitch-canvas');
            if (existingGlitch) existingGlitch.remove();
            
            if (scene.overlayEffect) {
                sceneOverlay.classList.add('overlay-' + scene.overlayEffect);
            }

            // Rain Effect Logic
            if (scene.overlayEffect === 'rain') {
                if (typeof rainEffect !== 'undefined') rainEffect.start('scene-overlay');
            } else {
                if (typeof rainEffect !== 'undefined') rainEffect.stop();
            }

            // Blur Effect Logic - Inject DOM structure
            if (scene.overlayEffect === 'blur') {
                const blurContainer = document.createElement('div');
                blurContainer.className = 'blur-overlay-container';
                blurContainer.innerHTML = '<div class="blur-rumble-layer"></div><div class="blur-flicker-layer"></div><div class="blur-grain-layer"></div><div class="blur-vignette-layer"></div>';
                sceneOverlay.appendChild(blurContainer);
            }

            // Chromatic Aberration Effect Logic - Inject DOM structure
            if (scene.overlayEffect === 'chromatic') {
                const chromaticContainer = document.createElement('div');
                chromaticContainer.className = 'chromatic-overlay-container';
                chromaticContainer.innerHTML = '<div class="chromatic-jerk-wrapper"><div class="chromatic-layer chromatic-red"></div><div class="chromatic-layer chromatic-green"></div><div class="chromatic-layer chromatic-blue"></div><div class="chromatic-flicker"></div></div><div class="chromatic-scanlines"></div>';
                sceneOverlay.appendChild(chromaticContainer);
            }

            // TV Effect Logic - Inject DOM structure
            if (scene.overlayEffect === 'tv') {
                sceneOverlay.parentElement?.classList.add('tv-distortion-active');
                
                const tvContainer = document.createElement('div');
                tvContainer.className = 'tv-overlay-container';
                tvContainer.innerHTML = '<div class="tv-screen-wrapper"><div class="tv-rgb-grid"></div><div class="tv-scanlines"></div><div class="tv-vignette"></div><div class="tv-glow"></div><div class="tv-flicker"></div><div class="tv-interference"></div></div>';
                sceneOverlay.appendChild(tvContainer);
            } else {
                sceneOverlay.parentElement?.classList.remove('tv-distortion-active');
            }

            // Confetti Effect Logic - Inject canvas and start animation
            if (scene.overlayEffect === 'confetti') {
                if (typeof confettiEffect !== 'undefined') confettiEffect.start('scene-overlay');
            } else {
                if (typeof confettiEffect !== 'undefined') confettiEffect.stop();
            }

            // Glitch Effect Logic - Inject SVG filter and apply to image
            if (scene.overlayEffect === 'glitch') {
                // Ensure SVG filter exists
                if (!document.getElementById('glitch-distortion-filter')) {
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('style', 'position:absolute;width:0;height:0;');
                    svg.innerHTML = '<defs><filter id="glitch-distortion-filter" x="-10%" y="-10%" width="120%" height="120%"><feOffset in="SourceGraphic" dx="0" dy="0" result="r_offset"><animate attributeName="dx" values="0;0;0;0;-4;0;0;0;0;-3;0;0" dur="3s" repeatCount="indefinite"/></feOffset><feOffset in="SourceGraphic" dx="0" dy="0" result="b_offset"><animate attributeName="dx" values="0;0;0;0;4;0;0;0;0;3;0;0" dur="3s" repeatCount="indefinite"/></feOffset><feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" /><feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/><feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/><feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/><feBlend in="red" in2="green" mode="screen" result="rg"/><feBlend in="rg" in2="blue" mode="screen" result="rgb"/><feTurbulence type="fractalNoise" baseFrequency="0.001 0.5" numOctaves="1" result="noise" seed="5"><animate attributeName="seed" values="5;5;5;5;8;5;5;5;5;3;5;5" dur="4s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
                    document.body.appendChild(svg);
                }
                // Apply filter directly to images
                if (sceneImage) sceneImage.style.filter = 'url(#glitch-distortion-filter)';
                if (sceneImageBack) sceneImageBack.style.filter = 'url(#glitch-distortion-filter)';
                sceneOverlay.parentElement?.classList.add('glitch-distortion-active');
                if (typeof glitchEffect !== 'undefined') glitchEffect.start('scene-overlay');
            } else {
                // Remove filter from images
                if (sceneImage) sceneImage.style.filter = '';
                if (sceneImageBack) sceneImageBack.style.filter = '';
                sceneOverlay.parentElement?.classList.remove('glitch-distortion-active');
                if (typeof glitchEffect !== 'undefined') glitchEffect.stop();
            }
        }

        // Nosferatu Effect Logic for Scene
        if (scene.overlayEffect === 'nosferatu') {
            // Clear any existing nosferatu container first
            const existing = sceneOverlay.querySelector('.nosferatu-container');
            if (existing) existing.remove();
            
            const nosferatuContainer = document.createElement('div');
            nosferatuContainer.className = 'nosferatu-container';
            nosferatuContainer.innerHTML = '<div class="nosferatu-cinema"></div><div class="nosferatu-scratch"></div><div class="nosferatu-effect-scratch"></div><div class="nosferatu-grain"></div><div class="nosferatu-vignette"></div>';
            sceneOverlay.appendChild(nosferatuContainer);
            
            if (sceneImage) sceneImage.style.filter = 'sepia(0.8) contrast(1.1) brightness(0.9)';
            if (sceneImageBack) sceneImageBack.style.filter = 'sepia(0.8) contrast(1.1) brightness(0.9)';
            sceneOverlay.parentElement?.classList.add('nosferatu-active');
        } else {
            // Remove nosferatu effects if not active
            const existing = sceneOverlay.querySelector('.nosferatu-container');
            if (existing) existing.remove();
            sceneOverlay.parentElement?.classList.remove('nosferatu-active');
            // Only clear filter if not another filter effect
            if (scene.overlayEffect !== 'glitch' && scene.overlayEffect !== 'tv') {
                if (sceneImage) sceneImage.style.filter = '';
                if (sceneImageBack) sceneImageBack.style.filter = '';
            }
        }

        // Wiggle Effect Logic for Scene
        if (scene.overlayEffect === 'wiggle') {
            sceneOverlay.parentElement?.classList.add('wiggle-active');
        } else {
            sceneOverlay.parentElement?.classList.remove('wiggle-active');
        }

        // Fog Effect Logic for Scene
        if (scene.overlayEffect === 'fog') {
             const existing = sceneOverlay.querySelector('.fog-container');
             if (existing) existing.remove();

             const fogContainer = document.createElement('div');
             fogContainer.className = 'fog-container';
             fogContainer.innerHTML = '<div class="fog-img fog-img-first"></div><div class="fog-img fog-img-second"></div>';
             sceneOverlay.appendChild(fogContainer);
             sceneOverlay.classList.add('overlay-fog');
             
             updateFogSizes(fogContainer);
        } else {
             sceneOverlay.classList.remove('overlay-fog');
             const existing = sceneOverlay.querySelector('.fog-container');
             if (existing) existing.remove();
        }

        sceneDescription.innerHTML = '';
        
        let fullDescription = scene.description || '';
        if (successPrefix) fullDescription = successPrefix + "\\n\\n" + fullDescription;

        const paragraphs = fullDescription.split(/\\n|\\\\n/).filter(p => p.trim().length > 0);
        let pIndex = 0; const textAnimType = (gameData.enableTextControl !== false) ? (gameData.gameTextAnimationType || 'fade') : 'none';
        const isImmersive = document.body.classList.contains('behavior-immersive') && window.innerWidth <= 768;

        isPrinting = true;
        sceneDescription.classList.add('typewriting-active');
        
        // Loop protection
        renderSessionId++;
        const mySessionId = renderSessionId;

        let skipParagraph = false;
        const globalEnterSkip = (e) => {
            if (e.key === 'Enter' && isPrinting) {
                skipParagraph = true;
            }
        };
        window.addEventListener('keydown', globalEnterSkip);

        const renderNextParagraph = () => {
            skipParagraph = false;
            if (pIndex >= paragraphs.length) { 
                isPrinting = false;
                sceneDescription.classList.remove('typewriting-active');
                if (chances <= 0) gameOver(); else if (scene.isEndingScene) activateEndingUI('win');
                return; 
            }

            const p = document.createElement('p'); const formattedHTML = formatText(paragraphs[pIndex]);
            if (textAnimType === 'typewriter') {
                p.className = 'scene-paragraph typewriter-cursor'; p.style.opacity = '1'; 
                p.innerHTML = (typeof DOMPurify !== 'undefined') ? DOMPurify.sanitize(formattedHTML, { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] }) : formattedHTML;
                sceneDescription.appendChild(p);
                const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
                let node; const textNodes = []; while((node = walker.nextNode())) textNodes.push(node);
                const fullTexts = textNodes.map(n => n.nodeValue); textNodes.forEach(n => n.nodeValue = '');
                let nodeIdx = 0; let charIdx = 0;
                const type = () => {
                    if (mySessionId !== renderSessionId) {
                        window.removeEventListener('keydown', globalEnterSkip);
                        return;
                    }
                    if (skipParagraph || nodeIdx >= textNodes.length) {
                        // Complete all remaining text nodes immediately
                        for (let i = nodeIdx; i < textNodes.length; i++) {
                            textNodes[i].nodeValue = fullTexts[i];
                        }
                        p.classList.remove('typewriter-cursor');
                        setupHighlights(p);
                        finishParagraph();
                        return;
                    }
                    const currentNode = textNodes[nodeIdx]; const fullText = fullTexts[nodeIdx];
                    if (charIdx < fullText.length) { currentNode.nodeValue += fullText[charIdx]; charIdx++; if (sceneDescription) sceneDescription.scrollTop = sceneDescription.scrollHeight; setTimeout(type, typeSpeedBase); }
                    else { nodeIdx++; charIdx = 0; type(); }
                };
                type();
            } else { 
                p.innerHTML = (typeof DOMPurify !== 'undefined') ? DOMPurify.sanitize(formattedHTML, { ADD_TAGS: ['span'], ADD_ATTR: ['data-word'] }) : formattedHTML;
                p.className = 'scene-paragraph'; sceneDescription.appendChild(p); setupHighlights(p); finishParagraph(); 
            }
        };

        const finishParagraph = () => {
            pIndex++;
            if (pIndex < paragraphs.length) {
                if (gameData.gameTextReadingFlow === 'continuous') {
                    // Bypass pause for continuous flow
                    setTimeout(() => {
                        if (mySessionId === renderSessionId) renderNextParagraph();
                    }, 30);
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
                    if (mySessionId === renderSessionId) renderNextParagraph(); 
                };
                continueBtn.addEventListener('click', continueHandler); 
                sceneDescription.addEventListener('click', continueHandler);
                window.addEventListener('keydown', continueHandler);
                sceneDescription.appendChild(continueBtn); sceneDescription.scrollTop = sceneDescription.scrollHeight;
            } else { 
                isPrinting = false;
                window.removeEventListener('keydown', globalEnterSkip);
                sceneDescription.classList.remove('typewriting-active');
                sceneDescription.scrollTop = sceneDescription.scrollHeight; 
                if (chances <= 0) gameOver(); else { verbInput.focus(); if (scene.isEndingScene) activateEndingUI('win'); }
            }
        };
        // Small delay to ensure any previous clear/setup settles? No, direct call is fine but verify ID.
        // renderNextParagraph called immediately
        if (mySessionId === renderSessionId) renderNextParagraph();
        
        const chancesContainer = document.getElementById('chances-container');
        if (chancesContainer) {
            chancesContainer.innerHTML = '';
            const iconSvg = ICONS[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
            const iconOutlineSvg = ICONS_OUTLINE[gameData.gameChanceIcon || 'heart'].replace('%COLOR%', gameData.gameChanceIconColor || '#ff4d4d');
            for (let i = 0; i < (gameData.gameMaxChances || 3); i++) {
                const icon = document.createElement('div');
                const isLost = i >= chances;
                icon.className = 'chance-icon ' + (isLost ? 'lost' : '');
                
                // Aplicar animação se este ícone foi o afetado agora
                if (lastChanceChange && lastChanceChange.index === i) {
                    icon.classList.add('animate-chance-' + lastChanceChange.type);
                }
                
                icon.innerHTML = isLost ? iconOutlineSvg : iconSvg;
                chancesContainer.appendChild(icon);
            }
            lastChanceChange = null;
        }
        
        // CHOICE MODE HANDLING
        if (gameData.gameInteractionType === 'choice') {
            const inputArea = document.querySelector('.input-area');
            if (inputArea) inputArea.classList.add('hidden');
            // Hide Suggestions and Inventory in IF/Choice mode
            if (suggestionsButton) suggestionsButton.classList.add('hidden');
            if (inventoryButton) inventoryButton.classList.add('hidden');
            
            // Create choices container and append to action-bar (same location as input-area)
            const choicesContainer = document.createElement('div');
            choicesContainer.className = 'choices-container';
            choicesContainer.id = 'choices-container'; // For easy removal on scene change
            choicesContainer.style.width = '100%';
            choicesContainer.style.display = 'flex';
            choicesContainer.style.flexDirection = 'column';
            choicesContainer.style.gap = '10px';
            choicesContainer.style.marginTop = '10px';
            
            if (scene.choices && scene.choices.length > 0) {
                scene.choices.forEach(choice => {
                    const btn = document.createElement('button');
                    btn.textContent = choice.label;
                    btn.className = 'choice-button';
                    // Inline styles for basic look, can be moved to CSS later or use existing classes
                    // Updated styling to match Action Button
                    btn.style.padding = '12px 16px';
                    btn.style.textAlign = 'center'; // Center text like action button
                    btn.style.backgroundColor = 'var(--action-button-bg, #ffffff)';
                    btn.style.color = 'var(--action-button-text-color, #0d1117)';
                    btn.style.border = '2px solid var(--border-color, rgba(255,255,255,0.2))';
                    btn.style.borderRadius = '0px'; // Square as requested
                    // Actually action button usually inherits standard border radius.
                    btn.style.fontFamily = 'var(--font-family)';
                    btn.style.fontSize = '1em';
                    btn.style.fontWeight = 'bold';
                    btn.style.cursor = 'pointer';
                    btn.style.transition = 'all 0.2s';
                    btn.style.width = '100%';
                    btn.style.textTransform = 'uppercase';

                    btn.onmouseover = () => {
                         btn.style.filter = 'brightness(0.9)';
                         btn.style.transform = 'translateY(-2px)';
                    };
                    btn.onmouseout = () => { 
                         btn.style.borderColor = 'var(--border-color, rgba(255,255,255,0.2))'; 
                         btn.style.transform = 'none'; 
                    };

                    btn.onclick = () => {
                        actionLog.push({ type: 'choice', text: '> ' + choice.label });
                        loadScene(choice.targetSceneId, true);
                    };
                    choicesContainer.appendChild(btn);
                });
            }
            // Insert choices container into standard-action-bar after action-buttons div
            const actionBar = document.getElementById('standard-action-bar');
            if (actionBar) {
                // Remove old choices if present
                const oldChoices = actionBar.querySelector('#choices-container');
                if (oldChoices) oldChoices.remove();
                // Append new choices
                actionBar.appendChild(choicesContainer);
            }
        } else {
            const inputArea = document.querySelector('.input-area');
            if (inputArea) inputArea.classList.remove('hidden');
            // Remove any leftover choices container
            const oldChoices = document.getElementById('choices-container');
            if (oldChoices) oldChoices.remove();
        }

        actionPopup.classList.add('hidden'); verbInput.textContent = ''; activePopupType = null;
    };

    const activateEndingUI = (type) => {
        isGameEnded = type;
        gameEndTime = Date.now();
        standardActionBar.classList.add('hidden');
        endingActionBar.classList.remove('hidden');

        // Show View Diary button only for victory/defeat if enabled
        const showRetrospective = gameData.enableRetrospective !== false;
        if ((type === 'win' || type === 'lose') && showRetrospective) {
            if (vignetteDiaryButton) vignetteDiaryButton.classList.remove('hidden');
        } else {
            if (vignetteDiaryButton) vignetteDiaryButton.classList.add('hidden');
        }

        if (!window.isPreview) localStorage.removeItem('if_builder_autosave_' + (gameData.gameTitle || 'IF Builder / Ficções Interativas'));
    };

    const gameOver = () => { 
        activateEndingUI('lose'); 
    };
    const handleInput = () => { if (isPrinting) return; const input = verbInput.textContent.trim(); if (input) { processCommand(input); verbInput.textContent = ''; } };
    
    // Prevent Enter from creating new lines in contenteditable and trigger handleInput instead
    verbInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInput();
        }
    });
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
        printOutput(scene.negativeFeedback || gameData.mensagem_falha_padrao || "Não aconteceu nada.");
    };

    const executeInteraction = (interaction) => {
        if (interaction.consumesItem && interaction.requiresInInventory) { removeFromInventory(interaction.requiresInInventory); }
        if (interaction.trackerEffects) updateTrackers(interaction.trackerEffects);
        if (interaction.addsToInventory && interaction.target) {
            const objInScene = getObjectsForScene(currentSceneId).find(o => o.id === interaction.target);
            if (objInScene) { 
                addToInventory(objInScene); 
                flagObjectAsRemoved(currentSceneId, objInScene.id); 
                // NEW: Trigger centered object image popup
                if (interaction.showObjectImage) {
                    openAcquisitionModal(objInScene, interaction.successMessage);
                }
            }
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
            let node; const textNodes = []; while((node = walker.nextNode())) textNodes.push(node);
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
            type();
        } else {
            // Also respecting session ID for safety though printOutput is usually atomic-ish or one-off
            if (textAnimType === 'typewriter') {
                 // Already handled by if block above
            } else {
                p.innerHTML = formattedHTML; p.className = 'scene-paragraph'; sceneDescription.appendChild(p); setupHighlights(p); sceneDescription.scrollTop = sceneDescription.scrollHeight;
            }
        }
    };

    const findItemInInventoryById = (id) => inventory.find(o => o.id === id) || null;
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
        const currentSceneData = gameData.cenas[currentSceneId];
        const sceneSuggestions = currentSceneData.suggestions || [];
        
        const container = document.createElement('div'); container.className = 'action-popup-container';
        
        if (sceneSuggestions.length === 0) {
            const row1 = document.createElement('div'); row1.className = 'action-popup-row mb-2 text-center text-sm font-medium text-zinc-400 p-4';
            row1.textContent = gameData.gameSuggestionsEmptyFeedback || 'não há sugestões';
            container.appendChild(row1);
        } else {

            const row1 = document.createElement('div'); row1.className = 'action-popup-row max-w-full flex-wrap justify-center';
            sceneSuggestions.forEach(v => { 
                const btn = document.createElement('button'); btn.textContent = v; 
                btn.addEventListener('click', () => { 
                    verbInput.textContent = v.toLowerCase() + ' '; 
                    verbInput.focus(); 
                    // Move cursor to end of contenteditable
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(verbInput);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    actionPopup.classList.add('hidden'); 
                    activePopupType = null; 
                }); 
                row1.appendChild(btn); 
            });
            container.appendChild(row1); 
        }
        actionPopup.appendChild(container);
    };
    const showInventory = () => {
        actionPopup.classList.remove('hidden'); actionPopup.innerHTML = ''; 
        const container = document.createElement('div'); container.className = 'action-popup-container';
        if (inventory.length === 0) { 
            const msg = document.createElement('div'); 
            msg.className = 'action-popup-row mb-2 text-center text-sm font-medium text-zinc-400 p-4';
            msg.textContent = gameData.gameInventoryEmptyFeedback || 'não há itens no inventário'; 
            container.appendChild(msg); 
        }
        else { 
            const list = document.createElement('div');
            list.className = 'action-popup-list';
            inventory.forEach(item => { 
                const btn = document.createElement('button'); 
                btn.textContent = item.name; 
                btn.addEventListener('click', () => { 
                    openItemModal(item); 
                    actionPopup.classList.add('hidden'); 
                    activePopupType = null; 
                }); 
                list.appendChild(btn); 
            }); 
            container.appendChild(list);
        }
        actionPopup.appendChild(container);
    };



    const showTrackers = () => {
        trackersContent.innerHTML = '';
        const definitions = gameData.consequenceTrackers || [];
        if (definitions.length === 0) {
            const msg = document.createElement('p');
            msg.className = 'text-center text-zinc-400 p-4';
            msg.textContent = 'Não há rastreadores ativos';
            trackersContent.appendChild(msg);
        } else {
            definitions.forEach(def => {
                const currentVal = trackers[def.id] || 0;
                const percentage = Math.min(100, Math.max(0, (currentVal / def.maxValue) * 100));
                const barColor = def.barColor || '#ffffff';
                const item = document.createElement('div');
                item.className = 'tracker-item';
                
                item.innerHTML = 
                    '<div class="tracker-item-header">' +
                        '<span class="tracker-item-name">' + def.name + '</span>' +
                        (!def.hideValue ? '<span class="tracker-item-values">' + currentVal + ' / ' + def.maxValue + '</span>' : '') +
                    '</div>' +
                    '<div class="tracker-bar-container">' +
                        '<div class="tracker-bar" style="width: ' + percentage + '%; background-color: ' + barColor + '; margin-left: ' + (def.invertBar ? 'auto' : '0') + '"></div>' +
                    '</div>';
                trackersContent.appendChild(item);
            });
        }
        trackersModal.classList.remove('hidden');
    };

    const openItemModal = (item) => {
        itemModalName.textContent = item.name; itemModalDescription.innerHTML = formatText(item.examineDescription);
        setupHighlights(itemModalDescription);
        if (item.image) { itemModalImage.src = item.image; itemModalImageContainer.classList.remove('hidden'); }
        else itemModalImageContainer.classList.add('hidden');
        itemModal.classList.remove('hidden');
    };
    const openAcquisitionModal = (item, customDescription) => {
        if (!acquisitionModal) return;
        acquisitionModalTitle.textContent = item.name;
        acquisitionModalDescription.innerHTML = formatText(customDescription || item.examineDescription);
        setupHighlights(acquisitionModalDescription);
        if (item.image) { acquisitionModalImage.src = item.image; acquisitionModalImageContainer.classList.remove('hidden'); }
        else acquisitionModalImageContainer.classList.add('hidden');
        acquisitionModal.classList.remove('hidden');
    };
    const showDiary = (isConclusion = false) => {
        diaryLog.innerHTML = ''; let currentInterContainer = null;
        
        const diaryTitle = document.getElementById('diary-modal-title');
        if (diaryTitle) {
            diaryTitle.style.display = isConclusion ? 'none' : 'block';
        }

        // Show Stats if triggered from conclusion
        if (isConclusion) {
            const statsContainer = document.createElement('div');
            statsContainer.className = 'diary-stats-container';
            
            const totalScenesCount = Object.keys(gameData.cenas).length;
            const visitedCount = visitedScenes.length;
            
            let timeStr = "0s";
            if (gameStartTime && gameEndTime) {
                const totalSeconds = Math.floor((gameEndTime - gameStartTime) / 1000);
                const hrs = Math.floor(totalSeconds / 3600);
                const mins = Math.floor((totalSeconds % 3600) / 60);
                const secs = totalSeconds % 60;
                
                if (hrs > 0) timeStr = hrs + "h " + mins + "m " + secs + "s";
                else if (mins > 0) timeStr = mins + "m " + secs + "s";
                else timeStr = secs + "s";
            }

            let totalWords = 0;
            actionLog.forEach(entry => {
                if (entry.type === 'scene' && entry.description) {
                    totalWords += entry.description.split(/\\s+/).filter(Boolean).length;
                } else if (entry.type === 'output' && entry.text) {
                    totalWords += entry.text.split(/\\s+/).filter(Boolean).length;
                }
            });

            statsContainer.innerHTML = 
                '<div class="diary-stat-box">' +
                    '<span class="diary-stat-label">' + gameData.gameTranslations.stats_visited + '</span>' +
                    '<span class="diary-stat-value">' + visitedCount + ' / ' + totalScenesCount + ' ' + gameData.gameTranslations.of_scenes + '</span>' +
                '</div>' +
                '<div class="diary-stat-box">' +
                    '<span class="diary-stat-label">' + gameData.gameTranslations.stats_time + '</span>' +
                    '<span class="diary-stat-value">' + timeStr + '</span>' +
                '</div>' +
                '<div class="diary-stat-box">' +
                    '<span class="diary-stat-label">' + gameData.gameTranslations.total_words_read + '</span>' +
                    '<span class="diary-stat-value">' + totalWords + '</span>' +
                '</div>';
            diaryLog.appendChild(statsContainer);
        }

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
        diaryModal.classList.remove('hidden'); 
        setTimeout(() => { 
            diaryLog.scrollTop = isConclusion ? 0 : diaryLog.scrollHeight; 
        }, 10);
    };
    init();
});
