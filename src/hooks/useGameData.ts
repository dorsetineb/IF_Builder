
import { useState, useCallback, useMemo } from 'react';
import { GameData, Scene, GameObject, Interaction, ConsequenceTracker, FixedVerb, Vignette } from '../types';
import { initialGameData } from '../lib/gameDefaults';
import DOMPurify from 'dompurify';

export const useGameData = () => {
    const [gameData, setGameData] = useState<GameData>(initialGameData);
    const [isDirty, setIsDirty] = useState(false);

    // --- State Accessors (Memoized) ---
    const scenesList = useMemo(() => {
        return gameData.sceneOrder.map(id => gameData.scenes[id]).filter(Boolean);
    }, [gameData.scenes, gameData.sceneOrder]);

    const fixedVerbs = useMemo(() => gameData.fixedVerbs || [], [gameData.fixedVerbs]);
    const consequenceTrackers = useMemo(() => gameData.consequenceTrackers || [], [gameData.consequenceTrackers]);

    // --- Core Update Logic ---
    const handleUpdateGameData = useCallback((field: keyof GameData | Partial<GameData>, value?: any, skipDirty?: boolean) => {
        if (typeof field === 'object' && field !== null) {
            const updates = field as Partial<GameData>;

            // Sanitize HTML if present
            if (updates.gameHTML) {
                updates.gameHTML = DOMPurify.sanitize(updates.gameHTML);
            }

            setGameData(prev => ({ ...prev, ...updates }));

            // Auto-detect systems if enabling check
            if (updates.gameSystemEnabled) {
                // Logic could be here if needed, but usually handled by UI inputs
            }
        } else {
            // Sanitize if updating gameHTML directly
            if (field === 'gameHTML' && typeof value === 'string') {
                value = DOMPurify.sanitize(value);
            }

            setGameData(prev => ({ ...prev, [field as keyof GameData]: value }));
        }
        if (!skipDirty) setIsDirty(true);
    }, []);

    // --- Global Objects Management ---
    const handleUpdateGlobalObject = useCallback((objectId: string, updatedData: Partial<GameObject>) => {
        setGameData(prev => ({
            ...prev,
            globalObjects: {
                ...prev.globalObjects,
                [objectId]: { ...prev.globalObjects[objectId], ...updatedData }
            }
        }));
        setIsDirty(true);
    }, []);

    const handleCreateGlobalObject = useCallback((obj: GameObject) => {
        setGameData(prev => ({
            ...prev,
            globalObjects: { ...prev.globalObjects, [obj.id]: obj }
        }));
        setIsDirty(true);
    }, []);

    const handleDeleteGlobalObject = useCallback((objectId: string) => {
        setGameData(prev => {
            const newObjects = { ...prev.globalObjects };
            delete newObjects[objectId];

            // Remove references from scenes
            const newScenes = { ...prev.scenes };
            Object.keys(newScenes).forEach(sceneId => {
                const scene = newScenes[sceneId];
                if (scene.objectIds.includes(objectId)) {
                    newScenes[sceneId] = {
                        ...scene,
                        objectIds: scene.objectIds.filter(id => id !== objectId)
                    };
                }
            });

            return { ...prev, globalObjects: newObjects, scenes: newScenes };
        });
        setIsDirty(true);
    }, []);

    // --- Trackers Management ---
    const handleUpdateTrackers = useCallback((updatedTrackers: ConsequenceTracker[]) => {
        setGameData(prev => ({
            ...prev,
            consequenceTrackers: updatedTrackers
        }));
        setIsDirty(true);
    }, []);

    // Also used for creating new ones (appending to list)
    const handleCreateTracker = useCallback((newTracker: ConsequenceTracker) => {
        setGameData(prev => ({
            ...prev,
            consequenceTrackers: [...(prev.consequenceTrackers || []), newTracker]
        }));
        setIsDirty(true);
    }, []);

    // --- Auto-Detection ---
    const detectedActiveSystems = useMemo(() => {
        let hasInventoryUsage = false;
        let hasChancesUsage = false;
        const hasTrackers = (gameData as any).trackers && (gameData as any).trackers.length > 0;

        if (gameData.scenes) {
            Object.values(gameData.scenes).forEach((scene: any) => {
                if (scene.removesChanceOnEntry || scene.restoresChanceOnEntry) hasChancesUsage = true;
                if (scene.interactions) {
                    scene.interactions.forEach((interaction: any) => {
                        if (interaction.addsToInventory || interaction.requiresInInventory) hasInventoryUsage = true;
                    });
                }
            });
        }
        return { inventory: hasInventoryUsage, chances: hasChancesUsage, trackers: hasTrackers };
    }, [gameData.scenes, (gameData as any).trackers]);

    // --- Scene Helper Methods ---
    const handleLinkObjectToScene = useCallback((sceneId: string, objectId: string) => {
        setGameData(prev => {
            const scene = prev.scenes[sceneId];
            if (scene.objectIds.includes(objectId)) return prev;
            return {
                ...prev,
                scenes: {
                    ...prev.scenes,
                    [sceneId]: { ...scene, objectIds: [...scene.objectIds, objectId] }
                }
            };
        });
        setIsDirty(true);
    }, []);

    const handleUnlinkObjectFromScene = useCallback((sceneId: string, objectId: string) => {
        setGameData(prev => {
            const scene = prev.scenes[sceneId];
            return {
                ...prev,
                scenes: {
                    ...prev.scenes,
                    [sceneId]: { ...scene, objectIds: scene.objectIds.filter(id => id !== objectId) }
                }
            };
        });
        setIsDirty(true);
    }, []);

    const handleUpdateScenePosition = useCallback((sceneId: string, x: number, y: number) => {
        setGameData(prev => ({
            ...prev,
            scenes: {
                ...prev.scenes,
                [sceneId]: { ...prev.scenes[sceneId], mapX: x, mapY: y }
            }
        }));
        setIsDirty(true);
    }, []);

    const handleUpdateVignettePosition = useCallback((vignetteId: string, x: number, y: number) => {
        setGameData(prev => ({
            ...prev,
            vignettes: (prev.vignettes || []).map(v => v.id === vignetteId ? { ...v, mapX: x, mapY: y } : v)
        }));
        setIsDirty(true);
    }, []);

    const handleReorganizeScenes = useCallback(() => {
        setGameData(prev => {
            const updatedScenes = { ...prev.scenes };
            Object.keys(updatedScenes).forEach(id => {
                updatedScenes[id] = { ...updatedScenes[id], mapX: undefined, mapY: undefined };
            });
            const updatedVignettes = (prev.vignettes || []).map(v => ({ ...v, mapX: undefined, mapY: undefined }));
            return { ...prev, scenes: updatedScenes, vignettes: updatedVignettes };
        });
        setIsDirty(true);
    }, []);

    // --- Global Commands Management ---
    const handleUpdateGlobalCommands = useCallback((field: 'fixedVerbs', value: FixedVerb[]) => {
        setGameData(prev => ({
            ...prev,
            [field]: value
        }));
        setIsDirty(true);
    }, []);

    return {
        gameData,
        setGameData,
        isDirty,
        setIsDirty,
        scenesList,
        fixedVerbs,
        consequenceTrackers,
        detectedActiveSystems,
        handleUpdateGameData,
        handleUpdateGlobalObject,
        handleCreateGlobalObject,
        handleDeleteGlobalObject,
        handleUpdateTrackers,
        handleCreateTracker,
        handleUpdateGlobalCommands,
        handleLinkObjectToScene,
        handleUnlinkObjectFromScene,
        handleUpdateScenePosition,
        handleUpdateVignettePosition,
        handleReorganizeScenes
    };
};
