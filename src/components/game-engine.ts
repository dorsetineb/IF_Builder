import { GameData } from '../types';

export const prepareGameDataForEngine = (data: GameData): object => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translatedCenas: { [id: string]: any } = {};
    for (const sceneId in data.scenes) {
        if (Object.prototype.hasOwnProperty.call(data.scenes, sceneId)) {
            const scene = data.scenes[sceneId];

            // Cleanse "ghost" strings that stuck to legacy scenes from old defaults
            let finalVignetteButtonText = scene.vignetteButtonText;
            if (scene.vignetteType === 'opening' && ['COMEÇAR', 'INICIAR'].includes(finalVignetteButtonText || '')) {
                finalVignetteButtonText = data.gameSplashButtonText || finalVignetteButtonText;
            } else if ((scene.vignetteType === 'conclusion' || scene.isDefeatOutcome) && ['REINICIAR'].includes(finalVignetteButtonText || '')) {
                finalVignetteButtonText = data.gameRestartButtonText || finalVignetteButtonText;
            } else if (scene.vignetteType === 'transition' && ['CONTINUAR'].includes(finalVignetteButtonText || '')) {
                finalVignetteButtonText = data.gameContinueButtonText || finalVignetteButtonText;
            }

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
                vignetteButtonText: finalVignetteButtonText,
                vignetteNextSceneId: scene.vignetteNextSceneId,
                overlayEffect: scene.overlayEffect,
                isDefeatOutcome: scene.isDefeatOutcome,
                omitSplashTitle: scene.omitSplashTitle,
                omitSplashDescription: scene.omitSplashDescription,
                suggestions: scene.suggestions || [],
                negativeFeedback: scene.negativeFeedback,
                creditsText: scene.creditsText,
                creditsScrollEnabled: scene.creditsScrollEnabled
            };
        }
    }
    return {
        gameTitle: data.gameTitle,
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
        gameTextColor: data.gameTextColor,
        gameTitleColor: data.gameTitleColor,
        gameFocusColor: data.gameFocusColor,
        gameTextReadingFlow: data.gameTextReadingFlow,
        gameBackgroundMusic: data.gameBackgroundMusic,
        positiveEndingImage: data.positiveEndingImage,
        gameSplashContentVerticalAlignment: data.gameSplashContentVerticalAlignment,
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
        enableInventory: data.enableInventory ?? true,
        enableSuggestions: data.enableSuggestions ?? true,
        enableChances: typeof data.enableChances === 'boolean'
            ? data.enableChances
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            : (data.gameSystemEnabled === 'chances' || Object.values(data.scenes).some((s: any) => s.removesChanceOnEntry || s.restoresChanceOnEntry)),
        enableTrackers: typeof data.enableTrackers === 'boolean'
            ? data.enableTrackers
            : (data.gameSystemEnabled === 'trackers'),
        enableDiary: data.enableDiary ?? true,
        enableFixedVerbs: data.enableFixedVerbs,
        enableImages: data.enableImages ?? true,
        enableTextControl: data.enableTextControl ?? true,
        enableRetrospective: data.enableRetrospective ?? true,
        diaryAllowExport: data.diaryAllowExport ?? true,
        gameInteractionType: data.gameInteractionType || 'parser',
        gameSuggestionsEmptyFeedback: data.gameSuggestionsEmptyFeedback,
        gameInventoryEmptyFeedback: data.gameInventoryEmptyFeedback,
        // Main Menu / System Menu
        enableSystemMenu: data.enableSystemMenu,
        startScreenBgImage: data.startScreenBgImage,
        showStartScreenTitle: data.showStartScreenTitle,
        startScreenTitle: data.startScreenTitle,
        startScreenButtonAlignment: data.startScreenButtonAlignment,
        startScreenVerticalAlignment: data.startScreenVerticalAlignment,
        gameMenuTransitionType: data.gameMenuTransitionType,
        gameMenuTransitionSpeed: data.gameMenuTransitionSpeed,
        gameMenuTransitionSound: data.gameMenuTransitionSound,
        gameTranslations: data.gameTranslations || {
            view_diary_btn: "Ver Diário",
            stats_visited: "Você visitou",
            stats_time: "Tempo decorrido",
            of_scenes: "cenas"
        }
    };
};

import { gameJS } from './gameJS';

export { gameJS };
