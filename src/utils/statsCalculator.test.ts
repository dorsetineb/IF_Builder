import { describe, it, expect } from 'vitest';
import { calculateEditorStats } from './statsCalculator';
import { GameData, Scene } from '../types';
import { initialGameData } from '../lib/gameDefaults';

describe('statsCalculator', () => {
    it('calculates stats for initialGameData with reasonable defaults', () => {
        const stats = calculateEditorStats(initialGameData);
        expect(stats.totalScenes).toBeGreaterThan(0);
        expect(stats.estimatedZipSizeMB).toBeGreaterThanOrEqual(0);
        expect(stats.estimatedHtmlSizeMB).toBeGreaterThanOrEqual(0);
        expect(stats.estimatedHtmlSizeMB).toBeGreaterThanOrEqual(stats.estimatedZipSizeMB);
    });

    it('accurately calculates size and word counts for hypercard_stack scenarios with multiple vistas', () => {
        // Create a 1MB base64 dummy image
        const dummyBase64 = 'data:image/png;base64,' + 'A'.repeat(1024 * 1024);

        const customData: GameData = {
            ...initialGameData,
            scenes: {
                scenario_1: {
                    id: 'scenario_1',
                    name: 'Cenário Quarto',
                    description: 'Um quarto misterioso com múltiplos ângulos.',
                    sceneType: 'hypercard_stack',
                    stackCards: [
                        {
                            id: 'card_1',
                            name: 'Vista da Cama',
                            image: dummyBase64,
                            description: 'A cama está desarrumada.',
                            hotspots: [
                                {
                                    id: 'h1',
                                    title: 'Examinar Travesseiro',
                                    shape: 'rect',
                                    x: 10,
                                    y: 10,
                                    width: 20,
                                    height: 20,
                                    highlightStyle: 'glow',
                                    actionType: 'examine',
                                    examineTitle: 'Travesseiro',
                                    examineText: 'Você encontra uma chave sob o travesseiro.',
                                    addsToInventory: 'obj_key',
                                }
                            ]
                        },
                        {
                            id: 'card_2',
                            name: 'Vista do Espelho',
                            image: dummyBase64,
                            description: 'O espelho reflete uma silhueta estranha.',
                            hotspots: []
                        },
                        {
                            id: 'card_3',
                            name: 'Vista da Janela',
                            image: dummyBase64,
                            description: 'A janela mostra uma tempestade lá fora.',
                            hotspots: []
                        },
                        {
                            id: 'card_4',
                            name: 'Vista da Porta',
                            image: dummyBase64,
                            description: 'A porta está trancada por uma fechadura pesada.',
                            hotspots: []
                        }
                    ]
                } as unknown as Scene
            },
            globalObjects: {
                obj_key: {
                    id: 'obj_key',
                    name: 'Chave de Ferro',
                    examineDescription: 'Uma chave enferrujada.',
                    isTakable: true
                }
            }
        };

        const stats = calculateEditorStats(customData);

        // 4 cards * 1MB base64 = 4MB base64
        // Binary size in ZIP ≈ 4MB * 0.75 = 3MB + overhead
        expect(stats.estimatedZipSizeMB).toBeGreaterThan(2.5);
        expect(stats.estimatedZipSizeMB).toBeLessThan(4.5);

        // In HTML, 4MB base64 is in editorJson AND engineJson (total ~8MB+), so htmlMB > zipMB
        expect(stats.estimatedHtmlSizeMB).toBeGreaterThan(stats.estimatedZipSizeMB);

        // Scene should NOT be flagged as missing image since card_1 has image
        expect(stats.accessibility.scenesMissingImages).toBe(0);

        // Words in card names and descriptions should be counted
        expect(stats.totalWords).toBeGreaterThan(20);

        // Object 'obj_key' linked through hotspot addsToInventory should be counted as used
        expect(stats.usedObjectsCount).toBe(1);

        // Heavy image performance alert should be generated for each card > 500KB
        expect(stats.performanceAlerts.filter(a => a.reason === 'heavy_image').length).toBe(4);
    });
});
