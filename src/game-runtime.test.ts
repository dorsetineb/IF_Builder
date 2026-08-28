import { describe, it, expect } from 'vitest';
import { initialGameData } from './lib/gameDefaults';
import { prepareGameDataForEngine } from './components/game-engine';
import { gameJS } from './components/gameJS';

describe('Game Runtime evaluation in JSDOM', () => {
    it('executes gameJS without throwing errors and displays the opening vignette', () => {
        const engineData = prepareGameDataForEngine(initialGameData);
        (window as any).embeddedGameData = engineData;
        (window as any).isPreview = true;
        (window as any).isSceneTest = false;

        document.body.innerHTML = `
            <div id="game-container" class="game-container hidden">
                <div class="image-panel">
                    <div id="image-container" class="image-container">
                        <img id="scene-image" src="" alt="Cena atual" class="scene-image">
                        <img id="scene-image-back" src="" alt="Cena seguinte" class="scene-image hidden">
                        <div id="scene-overlay" class="scene-overlay"></div>
                        <div id="scene-name-overlay" class="scene-name-overlay"></div>
                    </div>
                </div>
                <div class="text-panel">
                    <div id="scene-description" class="scene-description"></div>
                    <div id="chances-container" class="chances-container"></div>
                    <div class="action-bar" id="standard-action-bar">
                        <div id="action-popup" class="action-popup hidden"></div>
                        <div class="action-buttons"></div>
                        <div class="input-area">
                            <div id="verb-input" contenteditable="true"></div>
                            <button id="submit-verb">Ação</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="diary-modal" class="hidden"><div id="diary-log"></div><button id="export-pdf-button"></button></div>
            <div id="notes-modal" class="hidden"><textarea id="notes-textarea"></textarea></div>
            <div id="trackers-modal" class="hidden"><div id="trackers-content"></div></div>
            <div id="item-modal" class="hidden"><div class="modal-content"><div id="item-modal-name"></div><div id="item-modal-description"></div><div id="item-modal-image-container"><img id="item-modal-image" /></div></div></div>
            <div id="acquisition-modal" class="hidden"><div id="acquisition-modal-title"></div><div id="acquisition-modal-description"></div><div id="acquisition-modal-image-container"><img id="acquisition-modal-image" /></div></div>
            <div id="system-modal" class="hidden"></div>
            <div id="start-screen" class="hidden"></div>
        `;

        expect(() => {
            const scriptFn = new Function(gameJS);
            scriptFn();
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }).not.toThrow();

        // Initial scene in default project is 'SCN_OPENING' (opening vignette)
        const vignetteScreen = document.getElementById('vignette-screen');
        expect(vignetteScreen?.classList.contains('hidden')).toBe(false);
        const titleEl = document.getElementById('vignette-title');
        expect(titleEl?.textContent).toBe('Abertura');
    });

    it('loads a standard narrative branch scene directly when not a vignette', () => {
        const customData = {
            ...initialGameData,
            startScene: 'cena1',
            scenes: {
                ...initialGameData.scenes,
                'cena1': {
                    id: 'cena1',
                    name: 'Primeira Sala',
                    description: 'Você está em uma sala vazia.',
                    image: '',
                    interactions: [],
                    exits: []
                }
            }
        };
        const engineData = prepareGameDataForEngine(customData as any);
        (window as any).embeddedGameData = engineData;
        (window as any).isPreview = true;
        (window as any).isSceneTest = false;

        document.body.innerHTML = `
            <div id="game-container" class="game-container hidden">
                <div class="image-panel">
                    <div id="image-container" class="image-container">
                        <img id="scene-image" src="" alt="Cena atual" class="scene-image">
                        <img id="scene-image-back" src="" alt="Cena seguinte" class="scene-image hidden">
                        <div id="scene-overlay" class="scene-overlay"></div>
                        <div id="scene-name-overlay" class="scene-name-overlay"></div>
                    </div>
                </div>
                <div class="text-panel">
                    <div id="scene-description" class="scene-description"></div>
                    <div id="chances-container" class="chances-container"></div>
                    <div class="action-bar" id="standard-action-bar">
                        <div id="action-popup" class="action-popup hidden"></div>
                        <div class="action-buttons"></div>
                        <div class="input-area">
                            <div id="verb-input" contenteditable="true"></div>
                            <button id="submit-verb">Ação</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="diary-modal" class="hidden"><div id="diary-log"></div><button id="export-pdf-button"></button></div>
            <div id="notes-modal" class="hidden"><textarea id="notes-textarea"></textarea></div>
            <div id="trackers-modal" class="hidden"><div id="trackers-content"></div></div>
            <div id="item-modal" class="hidden"><div class="modal-content"><div id="item-modal-name"></div><div id="item-modal-description"></div><div id="item-modal-image-container"><img id="item-modal-image" /></div></div></div>
            <div id="acquisition-modal" class="hidden"><div id="acquisition-modal-title"></div><div id="acquisition-modal-description"></div><div id="acquisition-modal-image-container"><img id="acquisition-modal-image" /></div></div>
            <div id="system-modal" class="hidden"></div>
            <div id="start-screen" class="hidden"></div>
        `;

        expect(() => {
            const scriptFn = new Function(gameJS);
            scriptFn();
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }).not.toThrow();

        const gameContainer = document.getElementById('game-container');
        expect(gameContainer?.classList.contains('hidden')).toBe(false);
    });

    it('loads a hypercard scenario scene directly and handles chances container', () => {
        const customData = {
            ...initialGameData,
            startScene: 'scenario-1',
            enableChances: true,
            scenes: {
                ...initialGameData.scenes,
                'scenario-1': {
                    id: 'scenario-1',
                    name: 'Cenário Teste',
                    sceneType: 'hypercard_stack',
                    image: '',
                    description: 'Descrição do cenário',
                    exits: [],
                    interactions: [],
                    stackCards: [
                        {
                            id: 'card-1',
                            name: 'Vista Principal',
                            image: 'https://example.com/img.jpg',
                            description: 'Vista inicial',
                            hotspots: []
                        }
                    ]
                }
            }
        };
        const engineData = prepareGameDataForEngine(customData as any);
        (window as any).embeddedGameData = engineData;
        (window as any).isPreview = true;
        (window as any).isSceneTest = false;

        document.body.innerHTML = `
            <div id="game-container" class="game-container hidden">
                <div class="image-panel">
                    <div id="image-container" class="image-container">
                        <img id="scene-image" src="" alt="Cena atual" class="scene-image">
                        <img id="scene-image-back" src="" alt="Cena seguinte" class="scene-image hidden">
                        <div id="scene-overlay" class="scene-overlay"></div>
                        <div id="scene-name-overlay" class="scene-name-overlay"></div>
                    </div>
                </div>
                <div class="text-panel">
                    <div id="scene-description" class="scene-description"></div>
                    <div id="chances-container" class="chances-container"></div>
                    <div class="action-bar" id="standard-action-bar">
                        <div id="action-popup" class="action-popup hidden"></div>
                        <div class="action-buttons"></div>
                        <div class="input-area">
                            <div id="verb-input" contenteditable="true"></div>
                            <button id="submit-verb">Ação</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="diary-modal" class="hidden"><div id="diary-log"></div><button id="export-pdf-button"></button></div>
            <div id="notes-modal" class="hidden"><textarea id="notes-textarea"></textarea></div>
            <div id="trackers-modal" class="hidden"><div id="trackers-content"></div></div>
            <div id="item-modal" class="hidden"><div class="modal-content"><div id="item-modal-name"></div><div id="item-modal-description"></div><div id="item-modal-image-container"><img id="item-modal-image" /></div></div></div>
            <div id="acquisition-modal" class="hidden"><div id="acquisition-modal-title"></div><div id="acquisition-modal-description"></div><div id="acquisition-modal-image-container"><img id="acquisition-modal-image" /></div></div>
            <div id="system-modal" class="hidden"></div>
            <div id="start-screen" class="hidden"></div>
        `;

        expect(() => {
            const scriptFn = new Function(gameJS);
            scriptFn();
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }).not.toThrow();

        const gameContainer = document.getElementById('game-container');
        expect(gameContainer?.classList.contains('hypercard-fullscreen')).toBe(true);
        const centerBar = document.getElementById('hypercard-center-bar');
        expect(centerBar).not.toBeNull();
        const actionButtons = centerBar?.querySelector('.action-buttons');
        expect(actionButtons).not.toBeNull();
        const chancesContainer = document.getElementById('chances-container');
        expect(chancesContainer).not.toBeNull();
    });

    it('initializes rain effect and handles start button click without errors or crashes', () => {
        const customData = {
            ...initialGameData,
            startScene: 'VNT_OPENING',
            scenes: {
                'VNT_OPENING': {
                    id: 'VNT_OPENING',
                    name: 'Fuja da Masmorra',
                    description: 'Você acorda em uma cela.',
                    image: '',
                    vignetteType: 'opening',
                    vignetteButtonText: 'COMEÇAR',
                    vignetteNextSceneId: 'scn_1',
                    overlayEffect: 'rain',
                    interactions: [],
                    exits: []
                },
                'scn_1': {
                    id: 'scn_1',
                    name: 'CELA',
                    description: 'Uma cela escura.',
                    image: '',
                    overlayEffect: 'grain',
                    interactions: [],
                    exits: []
                }
            }
        };

        const engineData = prepareGameDataForEngine(customData as any);
        (window as any).embeddedGameData = engineData;
        (window as any).isPreview = true;
        (window as any).isSceneTest = false;

        document.body.innerHTML = `
            <div id="game-container" class="game-container hidden">
                <div class="image-panel">
                    <div id="image-container" class="image-container">
                        <img id="scene-image" src="" alt="Cena atual" class="scene-image">
                        <img id="scene-image-back" src="" alt="Cena seguinte" class="scene-image hidden">
                        <div id="scene-overlay" class="scene-overlay"></div>
                        <div id="scene-name-overlay" class="scene-name-overlay"></div>
                    </div>
                </div>
                <div class="text-panel">
                    <div id="scene-description" class="scene-description"></div>
                    <div id="chances-container" class="chances-container"></div>
                    <div class="action-bar" id="standard-action-bar">
                        <div id="action-popup" class="action-popup hidden"></div>
                        <div class="action-buttons"></div>
                        <div class="input-area">
                            <div id="verb-input" contenteditable="true"></div>
                            <button id="submit-verb">Ação</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="diary-modal" class="hidden"><div id="diary-log"></div><button id="export-pdf-button"></button></div>
            <div id="notes-modal" class="hidden"><textarea id="notes-textarea"></textarea></div>
            <div id="trackers-modal" class="hidden"><div id="trackers-content"></div></div>
            <div id="item-modal" class="hidden"><div class="modal-content"><div id="item-modal-name"></div><div id="item-modal-description"></div><div id="item-modal-image-container"><img id="item-modal-image" /></div></div></div>
            <div id="acquisition-modal" class="hidden"><div id="acquisition-modal-title"></div><div id="acquisition-modal-description"></div><div id="acquisition-modal-image-container"><img id="acquisition-modal-image" /></div></div>
            <div id="system-modal" class="hidden"></div>
            <div id="start-screen" class="hidden"></div>
        `;

        expect(() => {
            const scriptFn = new Function(gameJS);
            scriptFn();
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }).not.toThrow();

        const vignetteButton = document.getElementById('vignette-continue-button');
        expect(vignetteButton).not.toBeNull();
        expect(vignetteButton?.textContent).toBe('COMEÇAR');

        // Trigger start click
        expect(() => {
            vignetteButton?.click();
        }).not.toThrow();

        const gameContainer = document.getElementById('game-container');
        expect(gameContainer?.classList.contains('hidden')).toBe(false);
    });
});
