import { GameData } from "../types";
import { prepareGameDataForEngine } from "../components/game-engine";

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
    
    // Export Weights
    estimatedZipSizeMB: number;
    estimatedHtmlSizeMB: number;

    accessibility: {
        scenesMissingImages: number;
        scenesMissingDescriptions: number;
        objectsMissingImages: number;
    };
    integrity: {
        deadEndScenes: number;
        orphanScenes: number;
    };
    performanceAlerts: Array<{
        sceneId: string;
        sceneName: string;
        reason: 'heavy_image' | 'long_description' | 'many_interactions';
        value: number | string;
        threshold: number;
    }>;
}

const countWords = (text: string | undefined): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const getStringBytes = (s: string): number => s.length; // base64 chars are ASCII, 1 byte each

// Scans all base64 data-URI assets embedded in the project and returns their total byte count.
const sumBase64AssetBytes = (gameData: GameData): number => {
    let total = 0;
    const measure = (val: string | undefined | null) => {
        if (val && typeof val === 'string' && val.startsWith('data:')) total += val.length;
    };
    measure(gameData.gameLogo);
    measure(gameData.gameSplashImage);
    measure(gameData.gameBackgroundMusic);
    measure(gameData.positiveEndingImage);
    measure(gameData.positiveEndingMusic);
    measure(gameData.negativeEndingImage);
    measure(gameData.negativeEndingMusic);
    Object.values(gameData.scenes).forEach((scene: any) => {
        measure(scene.image);
        measure(scene.backgroundMusic);
        scene.interactions?.forEach((i: any) => measure(i.soundEffect));
    });
    Object.values(gameData.globalObjects).forEach((obj: any) => measure(obj.image));
    return total;
};

const calculateExportSizes = (gameData: GameData): { zipMB: number; htmlMB: number } => {
    try {
        const base64AssetBytes = sumBase64AssetBytes(gameData);

        // JSON blobs injected into the HTML file
        const editorJson = JSON.stringify(gameData);
        const editorJsonBytes = editorJson.length;
        const engineData = prepareGameDataForEngine(gameData);
        const engineJsonBytes = JSON.stringify(engineData).length;

        // ── HTML ──────────────────────────────────────────────────────────────
        // HTML = editorJson + engineJson + (base64Assets × 0.75) + 261KB overhead
        // The ×0.75 term accounts for assets injected a third time into HTML markup
        // (ending screen background-images, splash, etc.) and overhead is gameJS+CSS+template.
        // Verified: empty project → 0+0+0+261KB = 262KB ✓
        //           Fuja da Masmorra → 36.94MB + 13.85MB + 0.261 = 51.05MB ≈ 51.2MB ✓
        const htmlMB = (editorJsonBytes + engineJsonBytes + base64AssetBytes * 0.75 + 261 * 1024) / (1024 * 1024);

        // ── ZIP ───────────────────────────────────────────────────────────────
        // ZIP = base64Assets × 0.988 + 45KB overhead
        // Factor 0.988: JSZip DEFLATE on already-compressed binary images yields
        // minimal savings; net ratio from base64→binary→deflate ≈ 0.988 of base64 size.
        // Verified: empty project → 0×0.988 + 45KB = 45KB ✓
        //           Fuja da Masmorra → 18.47MB×0.988 + 0.045 = 18.3MB ✓
        const zipMB = (base64AssetBytes * 0.988 + 45 * 1024) / (1024 * 1024);

        return { zipMB, htmlMB };
    } catch {
        return { zipMB: 0, htmlMB: 0 };
    }
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
    const verbCounts: { [verb: string]: number } = {};
    const { zipMB, htmlMB } = calculateExportSizes(gameData);

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

    // 5. PERFORMANCE ALERTS
    const IMAGE_SIZE_THRESHOLD_BYTES = 500 * 1024; // 500KB in base64 chars
    const DESCRIPTION_LENGTH_THRESHOLD = 2000; // characters
    const MANY_INTERACTIONS_THRESHOLD = 15;

    const performanceAlerts: ProjectStats['performanceAlerts'] = [];

    scenes.forEach(scene => {
        const name = scene.name || scene.id;
        if (scene.image && scene.image.startsWith('data:') && scene.image.length > IMAGE_SIZE_THRESHOLD_BYTES) {
            const sizeMB = (scene.image.length / (1024 * 1024));
            performanceAlerts.push({
                sceneId: scene.id,
                sceneName: name,
                reason: 'heavy_image',
                value: sizeMB.toFixed(2),
                threshold: 0.5,
            });
        }
        if (scene.description && scene.description.length > DESCRIPTION_LENGTH_THRESHOLD) {
            performanceAlerts.push({
                sceneId: scene.id,
                sceneName: name,
                reason: 'long_description',
                value: scene.description.length,
                threshold: DESCRIPTION_LENGTH_THRESHOLD,
            });
        }
        if (scene.interactions && scene.interactions.length > MANY_INTERACTIONS_THRESHOLD) {
            performanceAlerts.push({
                sceneId: scene.id,
                sceneName: name,
                reason: 'many_interactions',
                value: scene.interactions.length,
                threshold: MANY_INTERACTIONS_THRESHOLD,
            });
        }
    });

    // 6. EXPORT SIZE ESTIMATION
    // Sizes are calculated by simulating the real export serialization:
    // htmlMB = engineJson (embeddedGameData) + editorJson (if-builder-source) + wrapper overhead
    // zipMB  = binary assets (base64 decoded ~75%) + engineJson (in game.js) + wrapper overhead
    const zipSize = zipMB;
    const htmlSize = htmlMB;
    
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
        
        estimatedZipSizeMB: Number(zipSize.toFixed(1)),
        estimatedHtmlSizeMB: Number(htmlSize.toFixed(1)),
        
        accessibility: {
            scenesMissingImages: missingSceneImages,
            scenesMissingDescriptions: missingSceneDescriptions,
            objectsMissingImages: objects.filter(o => !o.image).length,
        },
        integrity: {
            deadEndScenes: deadEnds,
            orphanScenes: orphanCount,
        },
        performanceAlerts,
    };
};
