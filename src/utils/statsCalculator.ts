import { GameData } from "../types";

export interface ProjectStats {
    totalScenes: number;
    scenesByType: {
        opening: number;
        scenes: number;
        transition: number;
        victory: number;
        defeat: number;
    };
    totalVignettes: number;
    totalGlobalObjects: number;
    usedObjectsCount: number;
    usedTakableObjectsCount: number;
    totalTakableObjects: number;
    totalInteractions: number;
    
    // Literary Density
    totalWords: number;
    avgWordsPerScene: number;
    totalReadingTimeMinutes: number;
    avgReadingTimePerSceneMinutes: number;
    sceneWithMostWords: { id: string; name: string; count: number } | null;
    sceneWithLeastWords: { id: string; name: string; count: number } | null;
    sceneWithMostInteractions: { id: string; name: string; count: number } | null;

    // Flow
    avgObjectsPerScene: number;
    avgInteractionsPerScene: number;
    verbDistribution: { [verb: string]: number };

    // QA
    uselessObjectsCount: number;
    uselessObjectsNames: string[];
    interactionsWithoutEffectCount: number;
    
    // Asset Weight
    estimatedAssetSizeMB: number;
    maxAssetSizeMB: number;
    avgAssetSizeMBPerScene: number;

    accessibility: {
        scenesMissingImages: number;
        scenesMissingDescriptions: number;
        objectsMissingImages: number;
    };
    integrity: {
        deadEndScenes: number;
        orphanScenes: number;
    };
}

const countWords = (text: string | undefined): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const getBase64Size = (base64String: string | undefined): number => {
    if (!base64String || !base64String.includes(',')) return 0;
    const stringLength = base64String.split(',')[1].length;
    return stringLength * (3 / 4); // Roughly convert base64 chars to bytes
};

export const calculateEditorStats = (gameData: GameData): ProjectStats => {
    const scenes = Object.values(gameData.scenes);
    const objects = Object.values(gameData.globalObjects);
    const vignettes = gameData.vignettes || [];

    let totalWords = 0;
    let totalInteractions = 0;
    let missingSceneImages = 0;
    let missingSceneDescriptions = 0;
    let deadEnds = 0;
    let totalObjectsLinked = 0;

    let sceneMostWords = { id: '', name: '', count: -1 };
    let sceneLeastWords = { id: '', name: '', count: Infinity };
    let sceneMostInteractions = { id: '', name: '', count: -1 };

    // Scene Type Counters
    const scenesByType = {
        opening: 0,
        scenes: 0,
        transition: 0,
        victory: 0,
        defeat: 0
    };

    // QA variables
    const usedObjectIds = new Set<string>();
    let interactionsWithoutEffect = 0;
    let totalAssetBytes = 0;
    let maxAssetBytes = 0;
    const verbCounts: { [verb: string]: number } = {};

    const processAssetSize = (size: number) => {
        totalAssetBytes += size;
        if (size > maxAssetBytes) maxAssetBytes = size;
    };

    // Calculate Asset Size from Global settings
    processAssetSize(getBase64Size(gameData.gameLogo));
    processAssetSize(getBase64Size(gameData.gameSplashImage));
    processAssetSize(getBase64Size(gameData.gameBackgroundMusic));
    processAssetSize(getBase64Size(gameData.positiveEndingImage));
    processAssetSize(getBase64Size(gameData.positiveEndingMusic));
    processAssetSize(getBase64Size(gameData.negativeEndingImage));
    processAssetSize(getBase64Size(gameData.negativeEndingMusic));

    scenes.forEach(scene => {
        // Collect used objects
        if (scene.objectIds) {
            scene.objectIds.forEach(id => usedObjectIds.add(id));
            totalObjectsLinked += scene.objectIds.length;
        }

        // Assets
        processAssetSize(getBase64Size(scene.image));
        processAssetSize(getBase64Size(scene.backgroundMusic));

        // Word count
        let sceneWords = countWords(scene.description) + countWords(scene.name);
        
        let sceneInteractionCount = 0;
        scene.interactions?.forEach(inter => {
            sceneWords += countWords(inter.successMessage);
            totalInteractions++;
            sceneInteractionCount++;
            
            // Collect used objects in interactions
            if (inter.target) usedObjectIds.add(inter.target);
            if (inter.requiresInInventory) usedObjectIds.add(inter.requiresInInventory);

            // Verbs
            inter.verbs?.forEach(v => {
                const mainVerb = v.trim().toLowerCase();
                if (mainVerb) verbCounts[mainVerb] = (verbCounts[mainVerb] || 0) + 1;
            });

            // QA: No effect check
            const hasEffect = inter.goToScene || inter.vignetteId || inter.addsToInventory || 
                              inter.removesTargetFromScene || (inter.trackerEffects && inter.trackerEffects.length > 0) ||
                              inter.newSceneDescription;
            if (!hasEffect) interactionsWithoutEffect++;
        });

        if (sceneWords > sceneMostWords.count) {
            sceneMostWords = { id: scene.id, name: scene.name || 'Untitled', count: sceneWords };
        }
        if (sceneWords < sceneLeastWords.count) {
            sceneLeastWords = { id: scene.id, name: scene.name || 'Untitled', count: sceneWords };
        }
        if (sceneInteractionCount > sceneMostInteractions.count) {
            sceneMostInteractions = { id: scene.id, name: scene.name || 'Untitled', count: sceneInteractionCount };
        }

        totalWords += sceneWords;
        
        // Accessibility
        if (!scene.image || scene.image.trim() === '') missingSceneImages++;
        if (!scene.description || scene.description.trim() === '') missingSceneDescriptions++;

        // Scene Categorization
        const isVignette = scene.vignetteType && scene.vignetteType !== 'none';
        const isOpening = scene.id === 'VNT_OPENING' || scene.id === gameData.startScene || scene.vignetteType === 'opening';
        const isDefeat = !!scene.isDefeatOutcome || scene.vignetteType === 'defeat';
        const isVictory = (scene.isEndingScene || scene.vignetteType === 'conclusion') && !scene.isDefeatOutcome;

        if (isOpening) {
            scenesByType.opening++;
        } else if (isDefeat) {
            scenesByType.defeat++;
        } else if (isVictory) {
            scenesByType.victory++;
        } else if (isVignette) {
            scenesByType.transition++;
        } else {
            scenesByType.scenes++;
        }

        // Contagem de deadEnds
        const hasExits = (scene.exits && Object.values(scene.exits).some(e => e)) || 
                         (scene.choices && scene.choices.length > 0) ||
                         (scene.interactions && scene.interactions.some(i => i.goToScene || i.vignetteId));
        if (!hasExits && !isVictory && !isDefeat && !isOpening) {
            deadEnds++;
        }
    });

    // New Orphan Logic: Nodes with zero incoming AND outgoing connections
    // This matches SceneMap's definition of "Órfãs"
    const orphanCount = scenes.filter(s => {
        // Skip special/system scenes or start scene
        if (s.id === 'VNT_OPENING' || s.id === 'VNT_VICTORY' || s.id === 'VNT_DEFEAT' || 
            s.id === gameData.startScene || s.isDefeatOutcome || s.isEndingScene || s.vignetteType === 'opening') {
            return false;
        }

        // 1. Check Outgoing
        const hasOutgoing = (s.exits && Object.values(s.exits).some(e => e)) || 
                           (s.choices && s.choices.some(c => c.targetSceneId)) ||
                           (s.interactions && s.interactions.some(i => i.goToScene || i.vignetteId));
        
        if (hasOutgoing) return false;

        // 2. Check Incoming from other scenes
        const hasIncoming = scenes.some(other => {
            if (other.id === s.id) return false;
            const oExits = other.exits && Object.values(other.exits).some(e => e === s.id);
            const oChoices = other.choices && other.choices.some(c => c.targetSceneId === s.id);
            const oInteractions = other.interactions && other.interactions.some(i => i.goToScene === s.id || i.vignetteId === s.id);
            return oExits || oChoices || oInteractions;
        }) || (vignettes || []).some(v => v.nextSceneId === s.id);

        return !hasIncoming;
    }).length;

    // Global Objects
    let objectsMissingImages = 0;
    let takableCount = 0;
    objects.forEach(obj => {
        totalWords += countWords(obj.name);
        totalWords += countWords(obj.examineDescription);
        if (obj.isTakable) takableCount++;
        if (!obj.image || obj.image.trim() === '') objectsMissingImages++;
        processAssetSize(getBase64Size(obj.image));
    });

    const uselessObjects = objects.filter(obj => !usedObjectIds.has(obj.id)).map(obj => obj.name);

    // Vignettes - Only for calculating words and assets, categorization is handled in the map (scenes)
    vignettes.forEach(vig => {
        totalWords += countWords(vig.title);
        totalWords += countWords(vig.description);
        processAssetSize(getBase64Size(vig.image));
        processAssetSize(getBase64Size(vig.backgroundMusic));
        
        // Note: scenesByType is now handled primarily in the scenes loop above 
        // to match what is actually on the narrative map.
    });

    const totalAssetSizeMB = totalAssetBytes / (1024 * 1024);
    const ENGINE_OVERHEAD_MB = 1.75; // Estimate for base HTML/JS/CSS envelope
    
    return {
        totalScenes: scenes.length,
        scenesByType,
        totalVignettes: vignettes.length,
        totalGlobalObjects: objects.length,
        usedObjectsCount: usedObjectIds.size,
        usedTakableObjectsCount: Array.from(usedObjectIds).filter(id => {
            const obj = gameData.globalObjects[id];
            return obj && (obj as any).isTakable;
        }).length,
        totalTakableObjects: takableCount,
        totalInteractions,
        totalWords,
        avgWordsPerScene: scenes.length > 0 ? Math.round(totalWords / scenes.length) : 0,
        totalReadingTimeMinutes: Math.ceil(totalWords / 200),
        avgReadingTimePerSceneMinutes: scenes.length > 0 ? Number(((totalWords / scenes.length) / 200).toFixed(2)) : 0,
        sceneWithMostWords: sceneMostWords.count >= 0 ? sceneMostWords : null,
        sceneWithLeastWords: sceneLeastWords.count !== Infinity ? sceneLeastWords : null,
        sceneWithMostInteractions: sceneMostInteractions.count >= 0 ? sceneMostInteractions : null,
        
        avgObjectsPerScene: scenes.length > 0 ? Number((totalObjectsLinked / scenes.length).toFixed(1)) : 0,
        avgInteractionsPerScene: scenes.length > 0 ? Number((totalInteractions / scenes.length).toFixed(1)) : 0,
        verbDistribution: verbCounts,
        
        uselessObjectsCount: uselessObjects.length,
        uselessObjectsNames: uselessObjects,
        interactionsWithoutEffectCount: interactionsWithoutEffect,
        
        estimatedAssetSizeMB: Number((totalAssetSizeMB + ENGINE_OVERHEAD_MB).toFixed(2)),
        maxAssetSizeMB: Number((maxAssetBytes / (1024 * 1024)).toFixed(2)),
        avgAssetSizeMBPerScene: scenes.length > 0 ? Number(((totalAssetBytes / scenes.length) / (1024 * 1024)).toFixed(2)) : 0,
        
        accessibility: {
            scenesMissingImages: missingSceneImages,
            scenesMissingDescriptions: missingSceneDescriptions,
            objectsMissingImages,
        },
        integrity: {
            deadEndScenes: deadEnds,
            orphanScenes: orphanCount,
        }
    };
};
