
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
                backgroundMusic: scene.backgroundMusic,
                interactions: scene.interactions,
                exits: scene.exits,
                isEndingScene: scene.isEndingScene,
                removesChanceOnEntry: scene.removesChanceOnEntry,
                restoresChanceOnEntry: scene.restoresChanceOnEntry,
                objectIds: scene.objectIds || [],
                choices: scene.choices || [],
                vignetteType: scene.vignetteType,
                vignetteButtonText: scene.vignetteButtonText,
                vignetteNextSceneId: scene.vignetteNextSceneId,
                overlayEffect: scene.overlayEffect,
                isDefeatOutcome: scene.isDefeatOutcome
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
    // DEBUG: Unconditional marker to verify gameJS execution
    const _dbgMarker = document.createElement('div');
    _dbgMarker.id = 'engine-debug-marker';
    _dbgMarker.style.cssText = 'position:fixed;bottom:10px;left:10px;background:lime;color:black;z-index:2147483647;padding:10px;font-family:monospace;font-size:14px;font-weight:bold;border:3px solid black;pointer-events:none;';
    _dbgMarker.textContent = 'ENGINE JS LOADED - isSceneTest=' + (window.isSceneTest ? 'TRUE' : 'FALSE');
    document.body.appendChild(_dbgMarker);

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
    let renderSessionId = 0; // Prevent race conditions in rendering

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
    vDiv.innerHTML = '<div id="vignette-overlay" class="scene-overlay"></div><div class="splash-content" style="z-index: 10;"><div class="splash-text"><h1 id="vignette-title"></h1><p id="vignette-description"></p></div><div class="splash-buttons"><button id="vignette-continue-button" class="ending-restart-button" style="' + btnStyle + '">Continuar</button></div></div>';
    document.body.appendChild(vDiv);
    vignetteScreen = vDiv;

    const vignetteTitle = document.getElementById('vignette-title');
    const vignetteDescription = document.getElementById('vignette-description');
    const vignetteContinueButton = document.getElementById('vignette-continue-button');

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
            if (gameData.gameBackgroundMusic && bgmAudio.paused && !isGameEnded) {
                playBgm(gameData.gameBackgroundMusic);
            }
            document.removeEventListener('mousedown', startAudioOnInteraction);
            document.removeEventListener('keydown', startAudioOnInteraction);
        };
        document.addEventListener('mousedown', startAudioOnInteraction);
        document.addEventListener('keydown', startAudioOnInteraction);

        const hasAutoSave = localStorage.getItem('if_builder_autosave_' + document.title);
        // Auto-start game, bypassing splash screen
        startGame();
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
        
        // Fix Audio Persistence: If the starting scene has no specific music.
        // If it is a SCENE TEST, we do NOT fallback to global music (keep it silent/clean).
        const startScene = gameData.cenas[currentSceneId];
        if (startScene) {
            if (!startScene.backgroundMusic) {
                // If NOT in test mode, play global BGM. If in test mode, play nothing (or stop previous).
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
        
        // Handle Splash Screen visibility
        if (window.isSceneTest) {
            // DEBUG: Alert to force visibility
            // alert('Engine Running! Test Mode: ' + window.isSceneTest + '\\nScene ID: ' + currentSceneId); // Removed to avoid annoying user in future steps, but kept principle.
            
            // DEBUG: Inject debug overlay (Updated Z-Index)
            const dbg = document.createElement('div');
            dbg.style.cssText = 'position:fixed;top:10px;right:10px;background:red;color:white;z-index:2147483647;padding:15px;font-family:monospace;pointer-events:none;font-size:20px;border: 2px solid white;';
            const startSceneCheck = gameData.cenas[currentSceneId];
            dbg.innerHTML = 'ENGINE ACTIVE<br>ID: ' + currentSceneId + '<br>Type: ' + (startSceneCheck ? (startSceneCheck.vignetteType || 'scene') : 'undefined');
            document.body.appendChild(dbg);
            
            // Force hide splash screen with extreme prejudice
            const hideSplash = () => {
                const s = document.getElementById('splash-screen');
                if (s) {
                    s.style.display = 'none !important';
                    s.style.opacity = '0';
                    s.style.zIndex = '-1';
                    s.classList.add('hidden');
                }
                const g = document.getElementById('game-container');
                if (g) g.classList.remove('hidden');
            };
            hideSplash();
            // Retry a few times just in case of race conditions
            setTimeout(hideSplash, 50);
            setTimeout(hideSplash, 100);
            setTimeout(hideSplash, 500);

            splashScreen.classList.add('hidden');
            splashScreen.style.display = 'none'; // FORCE HIDE
            splashScreen.classList.remove('fade-out');
            gameContainer.classList.remove('hidden');
        } else {
            // Restore smooth transition for normal play
            splashScreen.style.display = ''; // Reset
            splashScreen.classList.remove('hidden');
            splashScreen.classList.add('fade-out');
            setTimeout(() => { splashScreen.classList.add('hidden'); splashScreen.classList.remove('fade-out'); }, 1000);
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

    const showVignetteScreen = (scene) => {
        // Hide game container and show vignette screen
        gameContainer.classList.add('hidden');
        
        // Set vignette content
        if (vignetteTitle) vignetteTitle.textContent = scene.name || '';
        if (vignetteDescription) vignetteDescription.textContent = scene.description || '';
        
        // Set button text
        const buttonText = scene.vignetteButtonText || (scene.vignetteType === 'conclusion' ? 'Reiniciar' : 'Continuar');
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
            vignetteContinueButton.removeEventListener('click', handleVignetteClick);
            if (typeof rainEffect !== 'undefined') rainEffect.stop();
            
            if (scene.vignetteType === 'conclusion') {
                // Restart game: Reset music FIRST, hide vignette, show splash
                playBgm(gameData.gameBackgroundMusic || "");
                vignetteScreen.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                startGame();

            } else if (scene.vignetteNextSceneId) {
                // Go to next scene: Load it FIRST (behind the vignette), then fade out
                gameContainer.classList.remove('hidden');
                loadScene(scene.vignetteNextSceneId, false);
                
                vignetteScreen.classList.add('fade-out');
                setTimeout(() => {
                    vignetteScreen.classList.add('hidden');
                    vignetteScreen.classList.remove('fade-out');
                }, 1000);
            } else {
                // No next scene defined, just hide vignette and show game
                vignetteScreen.classList.add('hidden');
                gameContainer.classList.remove('hidden');
            }
        };
        
        vignetteContinueButton.addEventListener('click', handleVignetteClick);
        
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
                    svg.innerHTML = \`
                        <defs>
                            <filter id="glitch-distortion-filter" x="-10%" y="-10%" width="120%" height="120%">
                                <feOffset in="SourceGraphic" dx="0" dy="0" result="r_offset">
                                    <animate attributeName="dx" values="0;0;0;0;-4;0;0;0;0;-3;0;0" dur="3s" repeatCount="indefinite"/>
                                </feOffset>
                                <feOffset in="SourceGraphic" dx="0" dy="0" result="b_offset">
                                    <animate attributeName="dx" values="0;0;0;0;4;0;0;0;0;3;0;0" dur="3s" repeatCount="indefinite"/>
                                </feOffset>
                                <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />
                                <feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
                                <feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
                                <feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
                                <feBlend in="red" in2="green" mode="screen" result="rg"/>
                                <feBlend in="rg" in2="blue" mode="screen" result="rgb"/>
                                <feTurbulence type="fractalNoise" baseFrequency="0.001 0.5" numOctaves="1" result="noise" seed="5">
                                    <animate attributeName="seed" values="5;5;5;5;8;5;5;5;5;3;5;5" dur="4s" repeatCount="indefinite"/>
                                </feTurbulence>
                                <feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                            </filter>
                        </defs>
                    \`;
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
        if (scene.removesChanceOnEntry && gameData.enableChances) chances--; 
        if (scene.restoresChanceOnEntry && gameData.enableChances) chances = Math.min(chances + 1, gameData.gameMaxChances);
        currentSceneId = sceneId;
        if (!visitedScenes.includes(sceneId)) visitedScenes.push(sceneId);
        actionLog.push({ type: 'scene', name: scene.name, timestamp: new Date().toLocaleTimeString(), description: scene.description, image: scene.image });
        
        // Check if this is a vignette scene
        if (scene.vignetteType && scene.vignetteType !== 'none') {
            showVignetteScreen(scene);
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
                    svg.innerHTML = \`
                        <defs>
                            <filter id="glitch-distortion-filter" x="-10%" y="-10%" width="120%" height="120%">
                                <feOffset in="SourceGraphic" dx="0" dy="0" result="r_offset">
                                    <animate attributeName="dx" values="0;0;0;0;-4;0;0;0;0;-3;0;0" dur="3s" repeatCount="indefinite"/>
                                </feOffset>
                                <feOffset in="SourceGraphic" dx="0" dy="0" result="b_offset">
                                    <animate attributeName="dx" values="0;0;0;0;4;0;0;0;0;3;0;0" dur="3s" repeatCount="indefinite"/>
                                </feOffset>
                                <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />
                                <feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
                                <feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
                                <feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
                                <feBlend in="red" in2="green" mode="screen" result="rg"/>
                                <feBlend in="rg" in2="blue" mode="screen" result="rgb"/>
                                <feTurbulence type="fractalNoise" baseFrequency="0.001 0.5" numOctaves="1" result="noise" seed="5">
                                    <animate attributeName="seed" values="5;5;5;5;8;5;5;5;5;3;5;5" dur="4s" repeatCount="indefinite"/>
                                </feTurbulence>
                                <feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                            </filter>
                        </defs>
                    \`;
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
        } else {
             sceneOverlay.classList.remove('overlay-fog');
             const existing = sceneOverlay.querySelector('.fog-container');
             if (existing) existing.remove();
        }

        sceneDescription.innerHTML = '';
        
        let fullDescription = scene.description;
        if (successPrefix) fullDescription = successPrefix + "\\n\\n" + fullDescription;

        const paragraphs = fullDescription.split('\\n').filter(p => p.trim().length > 0);
        let pIndex = 0; const textAnimType = (gameData.enableTextControl !== false) ? (gameData.gameTextAnimationType || 'fade') : 'none';
        const isImmersive = document.body.classList.contains('behavior-immersive') && window.innerWidth <= 768;

        isPrinting = true;
        sceneDescription.classList.add('typewriting-active');
        
        // Loop protection
        renderSessionId++;
        const mySessionId = renderSessionId;

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
                    if (mySessionId !== renderSessionId) return; // Stop if new render started
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
                sceneDescription.classList.remove('typewriting-active');
                sceneDescription.scrollTop = sceneDescription.scrollHeight; 
                if (chances <= 0) gameOver(); else { verbInput.focus(); if (scene.isEndingScene) activateEndingUI('win'); }
            }
        };
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
                const icon = document.createElement('div'); icon.className = 'chance-icon ' + (i < chances ? '' : 'lost');
                icon.innerHTML = i < chances ? iconSvg : iconOutlineSvg; chancesContainer.appendChild(icon);
            }
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

        actionPopup.classList.add('hidden'); verbInput.value = ''; activePopupType = null;
    };

    const activateEndingUI = (type) => {
        isGameEnded = type;
        standardActionBar.classList.add('hidden');
        endingActionBar.classList.remove('hidden');
        if (!window.isPreview) localStorage.removeItem('if_builder_autosave_' + document.title);
    };

    const gameOver = () => { 
        const defeatSceneId = Object.keys(gameData.cenas).find(id => gameData.cenas[id].isDefeatOutcome);
        if (defeatSceneId) {
            loadScene(defeatSceneId, true);
        } else {
            activateEndingUI('lose'); 
        }
    };
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
