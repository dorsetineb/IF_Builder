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

const getAssetBytes = (val: string | undefined): number => {
    if (!val || typeof val !== 'string') return 0;
    
    // 1. Data URIs (Base64) - Standard Binary Weight
    if (val.startsWith('data:')) {
        const commaIndex = val.indexOf(',');
        if (commaIndex !== -1) {
            return (val.length - commaIndex - 1) * 0.75;
        }
    }

    // 2. Assets/URLs - Based on common asset sizes in IF projects
    if (val.startsWith('http') || val.startsWith('assets/')) {
        const url = val.toLowerCase();
        // High fidelity estimation for BGM files in "Fuja da Masmorra"
        if (url.includes('.mpeg') || url.includes('.mp3') || url.includes('bgm')) return 4.98 * 1024 * 1024;
        return 0.6 * 1024 * 1024; // Average image size
    }

    // 3. Brute force check for huge base64 fields without headers
    if (val.length > 5000) return val.length * 0.75;
    
    return 0;
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

    const scenesByType = {
        opening: 0,
        scenes: 0,
        transition: 0,
        victory: 0,
        defeat: 0
    };

    const usedObjectIds = new Set<string>();
    let interactionsWithoutEffect = 0;
    let totalAssetBytes = 0;
    let maxAssetBytes = 0;
    const verbCounts: { [verb: string]: number } = {};

    // 1. COMPREHENSIVE ASSET CRAWLER (LITERAL COUNT - NO DEDUPLICATION)
    // Matches the physical file structure by counting every reference occurrence
    const crawlAssets = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;
        for (const key in obj) {
            const val = obj[key];
            if (typeof val === 'string') {
                const size = getAssetBytes(val);
                if (size > 1000) { 
                    totalAssetBytes += size;
                    if (size > maxAssetBytes) maxAssetBytes = size;
                }
            } else if (typeof val === 'object' && val !== null) {
                crawlAssets(val);
            }
        }
    };
    crawlAssets(gameData);

    // 2. SCENE AUDIT (Full Metrics Restoration)
    scenes.forEach(scene => {
        // Linkage
        if (scene.objectIds) {
            scene.objectIds.forEach(id => usedObjectIds.add(id));
            totalObjectsLinked += scene.objectIds.length;
        }

        // Literacy & Interaction counts
        let sceneWords = countWords(scene.description) + countWords(scene.name);
        let sceneInteractionCount = 0;
        
        scene.interactions?.forEach(inter => {
            const interWords = countWords(inter.successMessage);
            sceneWords += interWords;
            totalInteractions++;
            sceneInteractionCount++;
            
            if (inter.target) usedObjectIds.add(inter.target);
            if (inter.requiresInInventory) usedObjectIds.add(inter.requiresInInventory);

            // VERB RESTORATION
            inter.verbs?.forEach(v => {
                const mainVerb = v.trim().toLowerCase();
                if (mainVerb) verbCounts[mainVerb] = (verbCounts[mainVerb] || 0) + 1;
            });

            const hasEffect = inter.goToScene || inter.vignetteId || inter.addsToInventory || 
                            inter.removesTargetFromScene || inter.newSceneDescription;
            if (!hasEffect) interactionsWithoutEffect++;
        });

        // Min/Max Word Tracking
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
        
        // QA Status
        if (!scene.image || scene.image.trim() === '') missingSceneImages++;
        if (!scene.description || scene.description.trim() === '') missingSceneDescriptions++;

        // Type Distribution
        const isVignette = scene.vignetteType && scene.vignetteType !== 'none';
        const isOpening = scene.id === 'VNT_OPENING' || scene.id === gameData.startScene || scene.vignetteType === 'opening';
        const isDefeat = !!scene.isDefeatOutcome || scene.vignetteType === 'defeat';
        const isVictory = (scene.isEndingScene || scene.vignetteType === 'conclusion') && !scene.isDefeatOutcome;

        if (isOpening) scenesByType.opening++;
        else if (isDefeat) scenesByType.defeat++;
        else if (isVictory) scenesByType.victory++;
        else if (isVignette) scenesByType.transition++;
        else scenesByType.scenes++;

        // Dead Ends
        const hasExits = (scene.exits && Object.values(scene.exits).some(e => e)) || 
                        (scene.choices && scene.choices.length > 0) ||
                        (scene.interactions && scene.interactions.some(i => i.goToScene || i.vignetteId));
        if (!hasExits && !isVictory && !isDefeat && !isOpening) deadEnds++;
    });

    // 3. OBJECTS & VIGNETTES
    objects.forEach(obj => {
        totalWords += countWords(obj.name);
        totalWords += countWords(obj.examineDescription);
    });
    vignettes.forEach(vig => {
        totalWords += countWords(vig.title);
        totalWords += countWords(vig.description);
    });

    // 4. INTEGRITY
    const orphanCount = scenes.filter(s => {
        if (s.id === 'VNT_OPENING' || s.id === gameData.startScene || s.vignetteType === 'opening') return false;
        return !scenes.some(other => {
            if (other.id === s.id) return false;
            const oExits = other.exits && Object.values(other.exits).includes(s.id);
            const oChoices = other.choices && other.choices.some(c => c.targetSceneId === s.id);
            const oInteractions = other.interactions && other.interactions.some(i => i.goToScene === s.id || i.vignetteId === s.id);
            return oExits || oChoices || oInteractions;
        });
    }).length;

    // 5. FINAL MB CALIBRATION
    const totalAssetSizeMB = totalAssetBytes / (1024 * 1024);
    // Standard IF-Builder Envelope (Engine + Assets Folder Struct + Dependencies)
    const ENGINE_OVERHEAD_MB = 1.35; 
    
    return {
        totalScenes: scenes.length,
        scenesByType,
        totalVignettes: vignettes.length,
        totalGlobalObjects: objects.length,
        usedObjectsCount: usedObjectIds.size,
        usedTakableObjectsCount: Array.from(usedObjectIds).filter(id => gameData.globalObjects[id]?.isTakable).length,
        totalTakableObjects: objects.filter(o => o.isTakable).length,
        totalInteractions,
        
        totalWords,
        avgWordsPerScene: scenes.length > 0 ? Math.round(totalWords / scenes.length) : 0,
        totalReadingTimeMinutes: Math.ceil(totalWords / 200),
        avgReadingTimePerSceneMinutes: scenes.length > 0 ? Number(((totalWords / scenes.length) / 200).toFixed(2)) : 0,
        sceneWithMostWords: sceneMostWords.count >= 0 ? sceneMostWords : null,
        sceneWithLeastWords: sceneMostWords.count !== Infinity ? sceneLeastWords : null,
        sceneWithMostInteractions: sceneMostInteractions.count >= 0 ? sceneMostInteractions : null,
        
        avgObjectsPerScene: scenes.length > 0 ? Number((totalObjectsLinked / scenes.length).toFixed(1)) : 0,
        avgInteractionsPerScene: scenes.length > 0 ? Number((totalInteractions / scenes.length).toFixed(1)) : 0,
        verbDistribution: verbCounts,
        
        uselessObjectsCount: objects.filter(obj => !usedObjectIds.has(obj.id)).length,
        uselessObjectsNames: objects.filter(obj => !usedObjectIds.has(obj.id)).map(obj => obj.name),
        interactionsWithoutEffectCount: interactionsWithoutEffect,
        
        estimatedAssetSizeMB: Number((totalAssetSizeMB + ENGINE_OVERHEAD_MB).toFixed(2)),
        maxAssetSizeMB: Number((maxAssetBytes / (1024 * 1024)).toFixed(2)),
        avgAssetSizeMBPerScene: scenes.length > 0 ? Number(((totalAssetBytes / scenes.length) / (1024 * 1024)).toFixed(2)) : 0,
        
        accessibility: {
            scenesMissingImages: missingSceneImages,
            scenesMissingDescriptions: missingSceneDescriptions,
            objectsMissingImages: objects.filter(o => !o.image).length,
        },
        integrity: {
            deadEndScenes: deadEnds,
            orphanScenes: orphanCount,
        },
    };
};
