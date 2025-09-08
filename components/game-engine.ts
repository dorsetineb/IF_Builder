
import { GameData } from '../types';

export const prepareGameDataForEngine = (data: GameData): object => {
    return {
        cena_inicial: data.startScene,
        cenas: data.scenes,
        gameEnableChances: data.gameEnableChances,
        gameMaxChances: data.gameMaxChances,
        gameChanceIcon: data.gameChanceIcon,
        gameChanceIconColor: data.gameChanceIconColor,
        gameTheme: data.gameTheme,
        gameTextColorLight: data.gameTextColorLight,
        gameTitleColorLight: data.gameTitleColorLight,
        gameFocusColorLight: data.gameFocusColorLight,
        gameChanceLossMessage: data.gameChanceLossMessage,
        gameChanceReturnButtonText: data.gameChanceReturnButtonText,
        // Pass ending screen data to the engine
        positiveEnding: {
            description: data.gamePositiveEndingDescription,
        },
        negativeEnding: {
            description: data.gameNegativeEndingDescription,
        }
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
    const sceneSoundEffectElement = document.getElementById('scene-sound-effect');
    const transitionOverlay = document.getElementById('transition-overlay');
    const splashScreen = document.getElementById('splash-screen');
    const startButton = document.getElementById('splash-start-button');
    const choicesContainer = document.getElementById('choices-container');
    const positiveEndingScreen = document.getElementById('positive-ending-screen');
    const positiveEndingButton = document.getElementById('positive-ending-button');
    const negativeEndingScreen = document.getElementById('negative-ending-screen');
    const negativeEndingButton = document.getElementById('negative-ending-button');


    // --- State Variables ---
    let gameData = null;
    let currentSceneParagraphs = [];
    let currentParagraphIndex = 0;
    const SAVE_KEY = 'choiceAdventureSaveData_preview';
    let currentState = {
        currentSceneId: null,
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

    function restartGame() {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
    
    function showEndingScreen(type) {
        let screen, button;
        if (type === 'positive') {
            screen = positiveEndingScreen;
            button = positiveEndingButton;
        } else { // negative
            screen = negativeEndingScreen;
            button = negativeEndingButton;
        }

        if (screen) {
            screen.style.display = 'flex';
            button.onclick = restartGame;
        }
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

    function handleChoiceClick(choice) {
        if (gameData.gameEnableChances && choice.costsChance) {
            currentState.chances--;
            renderChances();
            saveState();
            if (currentState.chances <= 0) {
                showEndingScreen('negative');
                return;
            }
        }

        if(choice.refillsChances && gameData.gameEnableChances) {
            currentState.chances = gameData.gameMaxChances;
            renderChances();
        }
        performSceneChange(choice.goToScene, choice.soundEffect);
    }

    function renderChoices() {
        if (!choicesContainer) return;
        choicesContainer.innerHTML = '';
        const scene = currentState.scenesState[currentState.currentSceneId];
        if (!scene || scene.isEndingScene) return;

        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.onclick = () => handleChoiceClick(choice);
            choicesContainer.appendChild(button);
        });
    }

    function renderNextParagraph() {
        const scene = currentState.scenesState[currentState.currentSceneId];
        if (scene.isEndingScene) {
            showEndingScreen('positive');
            return;
        }

        if (!sceneDescriptionElement || currentParagraphIndex >= currentSceneParagraphs.length) {
            renderChoices();
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

        currentState.currentSceneId = sceneId;
        const rawDescription = scene.description ? String(scene.description).trim() : '';
        currentSceneParagraphs = rawDescription.split('\\n').filter(p => p.trim() !== '');
        currentParagraphIndex = 0;
        
        if (sceneImageElement && scene.image) {
            sceneImageElement.src = scene.image;
        } else if (sceneImageElement) {
            sceneImageElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAIAAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // transparent pixel
        }
        
        if (sceneDescriptionElement) {
            sceneDescriptionElement.innerHTML = '';
        }
        if (choicesContainer) {
            choicesContainer.innerHTML = '';
        }

        renderNextParagraph();

        if (!isStateLoad) {
            saveState();
        }
    }

    function performSceneChange(sceneId, soundEffectUrl) {
        if (!transitionOverlay) {
            if (soundEffectUrl && sceneSoundEffectElement) {
                sceneSoundEffectElement.src = soundEffectUrl;
                sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
            }
            changeScene(sceneId);
            return;
        }

        if (soundEffectUrl && sceneSoundEffectElement) {
            sceneSoundEffectElement.src = soundEffectUrl;
            sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
        }
        
        transitionOverlay.classList.add('active');

        const transitionHandler = () => {
            transitionOverlay.removeEventListener('transitionend', transitionHandler);
            changeScene(sceneId);
            requestAnimationFrame(() => {
                transitionOverlay.classList.remove('active');
            });
        };
        transitionOverlay.addEventListener('transitionend', transitionHandler, { once: true });
    }

    // --- Initialization ---
    function initGame(fromRestart = false) {
        let isPreview = false;
        try {
            if (window.embeddedGameData) {
                isPreview = true;
                gameData = window.embeddedGameData;
            } else {
                throw new Error("Game data not found.");
            }
            
            if (!fromRestart && !isPreview && loadState()) {
                console.log("Game state loaded from save.");
                changeScene(currentState.currentSceneId, true);
            } else {
                console.log("Starting new game.");
                currentState.currentSceneId = gameData.cena_inicial;
                currentState.scenesState = JSON.parse(JSON.stringify(gameData.cenas));
                if (gameData.gameEnableChances) {
                    currentState.chances = gameData.gameMaxChances;
                }
                changeScene(currentState.currentSceneId); 
            }
            renderChances();

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
        // If there's no splash screen, start immediately.
        initGame();
    }
});
`