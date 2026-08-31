import React, { useState, useMemo, useEffect } from 'react';
import { GameData, Scene } from '../types';
import { initialGameData } from '../lib/gameDefaults';
import { FONTS } from '../constants';
import { useTranslation } from 'react-i18next';

interface UseNewProjectFormProps {
    onCreate: (data: Partial<GameData>) => void;
}

export type Tab = 'info' | 'appearance' | 'system';

export const useNewProjectForm = ({ onCreate }: UseNewProjectFormProps) => {
    const { t } = useTranslation();

    const [tab, setTab] = useState<Tab>('info');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isColorsExpanded, setIsColorsExpanded] = useState(false);
    const [previewType, setPreviewType] = useState<'scene' | 'vignette'>('vignette');

    // Info State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startButtonText, setStartButtonText] = useState('');
    const [splashImage, setSplashImage] = useState('');

    // System State
    const [interactionType, setInteractionType] = useState<'parser' | 'choice'>('parser');
    const [enableInventory, setEnableInventory] = useState(true);
    const [enableDiary, setEnableDiary] = useState(true);
    const [enableNotes, setEnableNotes] = useState(false);
    const [enableChances, setEnableChances] = useState(false);
    const [enableTrackers, setEnableTrackers] = useState(true);

    const [enableTextControl, setEnableTextControl] = useState(true);
    const [textReadingFlow, setTextReadingFlow] = useState<'continuous' | 'paused'>('paused');
    const [textAnimationType, setTextAnimationType] = useState<'fade' | 'typewriter'>('typewriter');
    const [textSpeed, setTextSpeed] = useState<number>(3);

    const [enableImages, setEnableImages] = useState(true);
    const [imageTransitionType, setImageTransitionType] = useState<GameData['gameImageTransitionType']>('fade');
    const [imageSpeed, setImageSpeed] = useState<number>(3);

    const [enableSystemMenu, setEnableSystemMenu] = useState(true);
    const [startScreenTitle, setStartScreenTitle] = useState('');
    const [showStartScreenTitle, setShowStartScreenTitle] = useState(true);
    const [startScreenBgImage, setStartScreenBgImage] = useState('');
    const [menuTransitionType, setMenuTransitionType] = useState<'fade' | 'slide' | 'none'>('fade');
    const [menuTransitionSpeed, setMenuTransitionSpeed] = useState<number>(500);
    const menuTransitionSound: string | undefined = undefined;

    const [maxChances, setMaxChances] = useState<number>(3);
    const [chanceIcon, setChanceIcon] = useState<'circle' | 'cross' | 'heart' | 'square' | 'diamond'>('heart');
    const [chanceIconColor, setChanceIconColor] = useState<string>('#ff4d4d');

    const [diaryShowPlayerAction, setDiaryShowPlayerAction] = useState(true);
    const [diaryAllowExport, setDiaryAllowExport] = useState(false);

    const [enableRetrospective, setEnableRetrospective] = useState(true);
    const [enableSuggestions, setEnableSuggestions] = useState(true);
    
    // Vignette Layout State
    const [splashContentAlignment, setSplashContentAlignment] = useState<'left' | 'right'>('right');
    const [omitSplashTitle, setOmitSplashTitle] = useState(false);
    const [omitSplashDescription, setOmitSplashDescription] = useState(false);

    // Effect to disable inventory and suggestions if Interaction Type is Choice (IF)
    useEffect(() => {
        if (interactionType === 'choice') {
            setEnableInventory(false);
            setEnableSuggestions(false);
        } else {
            setEnableInventory(true); // Build default expectation, parser usually has inventory
            setEnableSuggestions(true);
        }
    }, [interactionType]);
    
    // Auto-switch preview type based on tab
    useEffect(() => {
        if (tab === 'info') setPreviewType('vignette');
        else setPreviewType('scene');
    }, [tab]);


    // Appearance State - Structure
    const [layoutOrientation, setLayoutOrientation] = useState<'vertical' | 'horizontal'>('vertical');
    const [layoutOrder, setLayoutOrder] = useState<'image-first' | 'image-last'>('image-first');
    const [imageFrame, setImageFrame] = useState<'none' | 'rounded-top' | 'trading-card' | 'book-cover'>('none');

    // Appearance State - Theme & Colors
    const [gameBackgroundColor, setGameBackgroundColor] = useState('#000000');
    const [colors, setColors] = useState({
        textColor: '#e4e4e7', titleColor: '#58a6ff', focusColor: '#58a6ff',
        splashButtonColor: '#2ea043', splashButtonHoverColor: '#238636', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#ffffff', actionButtonTextColor: '#0d1117',
        actionButtonHoverColor: '#f4f4f5',
        systemButtonColor: 'transparent',
        systemButtonTextColor: '#e4e4e7',
        systemButtonBorderColor: 'rgba(228, 228, 231, 0.25)', // textColor + '40' approx
        systemButtonHoverColor: '#58a6ff',
        chanceIconColor: '#ff4d4d',
        frameBookColor: '#FFFFFF',
        frameTradingCardColor: '#FFFFFF',
        frameRoundedTopColor: '#facc15',
        gameSceneNameOverlayBg: '#0d1117',
        gameSceneNameOverlayTextColor: '#c9d1d9',
        gameContinueIndicatorColor: '#58a6ff'
    });

    // Appearance State - Fonts & Text
    const [fontFamily, setFontFamily] = useState(FONTS[0].family);
    const [fontSize, setFontSize] = useState('12');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [actionButtonText, setActionButtonText] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [verbInputPlaceholder, setVerbInputPlaceholder] = useState('');

    const getScaledFontSize = (factor = 1.0) => {
        const baseSize = /^\d+$/.test(fontSize) ? parseInt(fontSize) : 14;
        const fontInfo = FONTS.find(f => f.family === fontFamily);
        const multiplier = fontInfo?.sizeAdjust || 1.0;
        return `${baseSize * multiplier * factor}px`;
    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            import('../utils/imageOptimizer').then(({ compressImageToWebP }) => {
                compressImageToWebP(file)
                    .then((optimizedBase64) => {
                        setSplashImage(optimizedBase64);
                    })
                    .catch((err) => {
                        console.error('Failed to compress image:', err);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            if (event.target && typeof event.target.result === 'string') {
                                setSplashImage(event.target.result);
                            }
                        };
                        reader.readAsDataURL(file);
                    });
            });
        }
        if (e.target) e.target.value = '';
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleApplyTheme = (preset: any) => {
        setGameBackgroundColor(preset.gameBackgroundColor || '#000000');
        setColors(prev => ({
            ...prev,
            textColor: preset.textColor,
            titleColor: preset.titleColor,
            focusColor: preset.focusColor,
            splashButtonColor: preset.splashButtonColor,
            splashButtonHoverColor: preset.splashButtonHoverColor,
            splashButtonTextColor: preset.splashButtonTextColor,
            actionButtonColor: preset.actionButtonColor,
            actionButtonTextColor: preset.actionButtonTextColor,
            actionButtonHoverColor: preset.actionButtonHoverColor || preset.actionButtonColor,
            systemButtonColor: preset.systemButtonColor || 'transparent',
            systemButtonTextColor: preset.systemButtonTextColor || preset.textColor,
            systemButtonBorderColor: preset.systemButtonBorderColor || (preset.textColor + '40'),
            systemButtonHoverColor: preset.systemButtonHoverColor || preset.focusColor,
            chanceIconColor: preset.chanceIconColor,
            gameContinueIndicatorColor: preset.focusColor
        }));

        const newFrameColor = '#FFFFFF';
        setColors(prev => ({
            ...prev,
            frameBookColor: newFrameColor,
            frameTradingCardColor: newFrameColor,
            frameRoundedTopColor: newFrameColor
        }));
    };

    // Helper for preview scene (Standard Scene)
    const previewStandardScene: Scene = useMemo(() => ({
        id: 'preview_scene',
        name: t('newProject.previewOverlay.sceneName', 'Nome da Ramificação'),
        image: splashImage || '', // Use splash image if available for context
        description: t('newProject.previewOverlay.exampleDesc', 'This is an example description for the scene. The text flows according to the') + ' ' + t('newProject.previewOverlay.exampleDescBold', 'SETTINGS') + ' ' + t('newProject.previewOverlay.exampleDesc2', 'chosen.'),
        interactions: [],
        choices: [
            { id: 'c1', label: t('newProject.previewOverlay.option1', 'Example Option 1'), targetSceneId: 'preview_scene' },
            { id: 'c2', label: t('newProject.previewOverlay.option2', 'Example Option 2'), targetSceneId: 'preview_scene' }
        ],
        objectIds: [],
        exits: {}
    }), [splashImage, t]);

    // Helper for preview vignette (Splash Screen)
    const previewVignetteScene: Scene = useMemo(() => ({
        id: 'VNT_OPENING',
        name: title || t('newProject.info.defaultTitle', 'My New Adventure'), // Map title here
        image: splashImage || '',
        description: description,
        interactions: [],
        objectIds: [],
        // Explicitly set vignetteType for the engine to render it as a vignette
        vignetteType: 'opening',
        vignetteButtonText: startButtonText || t('editor.defaultStartButton', 'COMEÇAR'),
        vignetteNextSceneId: 'preview_scene',
        // Layout settings
        vignetteAlignment: splashContentAlignment,
        vignetteShowTitle: !omitSplashTitle,
        vignetteShowDescription: !omitSplashDescription
    }), [splashImage, description, startButtonText, title, t, splashContentAlignment, omitSplashTitle, omitSplashDescription]);

    const previewGameData: GameData = useMemo(() => ({
        ...initialGameData,
        gameTitle: title,
        gameSplashDescription: description,
        gameSplashButtonText: startButtonText,
        gameSplashImage: splashImage,
        gameInteractionType: interactionType,

        // System Settings
        enableInventory,
        enableDiary,
        enableNotes,
        gameNotesButtonText: '',
        gameNotesPlaceholderText: '',
        enableChances,
        enableTrackers,
        enableSystemMenu: false, // Always false for previewing actual scenes
        startScreenBgImage,
        showStartScreenTitle,
        startScreenTitle,
        startScreenButtonAlignment: 'center',
        gameMenuTransitionType: menuTransitionType,
        gameMenuTransitionSpeed: menuTransitionSpeed,
        gameMenuTransitionSound: menuTransitionSound,
        gameMaxChances: maxChances,
        gameChanceIcon: chanceIcon,
        gameChanceIconColor: chanceIconColor,
        diaryShowPlayerAction,
        diaryAllowExport,
        enableRetrospective,
        enableSuggestions,
        enableTextControl,
        gameTextReadingFlow: textReadingFlow,
        gameTextAnimationType: textAnimationType,
        gameTextSpeed: textSpeed,
        enableImages,
        gameImageTransitionType: imageTransitionType as GameData['gameImageTransitionType'],
        gameImageSpeed: imageSpeed,
        // Since we are toggling them, we also need to make sure the UI reflect it
        gameShowSystemButton: false, // User requested REMOVAL of system button
        gameShowTrackersUI: true, // Always show trackers UI if enabled

        // Appearance
        gameLayoutOrientation: layoutOrientation,
        gameLayoutOrder: layoutOrder,
        gameImageFrame: imageFrame,
        gameBackgroundColor: gameBackgroundColor,
        gameFontFamily: fontFamily,
        gameFontSize: fontSize,
        gameActionButtonText: actionButtonText,
        gameVerbInputPlaceholder: verbInputPlaceholder,

        // Vignette Layout
        gameSplashContentAlignment: splashContentAlignment,
        gameOmitSplashTitle: omitSplashTitle,
        gameOmitSplashDescription: omitSplashDescription,

        // Map Colors properly
        gameTextColor: colors.textColor,
        gameTitleColor: colors.titleColor,
        gameFocusColor: colors.focusColor,
        gameSplashButtonColor: colors.splashButtonColor,
        gameSplashButtonHoverColor: colors.splashButtonHoverColor,
        gameSplashButtonTextColor: colors.splashButtonTextColor,
        gameActionButtonColor: colors.actionButtonColor,
        gameActionButtonTextColor: colors.actionButtonTextColor,
        frameBookColor: colors.frameBookColor,
        frameTradingCardColor: colors.frameTradingCardColor,
        frameRoundedTopColor: colors.frameRoundedTopColor,
        gameSceneNameOverlayBg: colors.gameSceneNameOverlayBg,
        gameSceneNameOverlayTextColor: colors.gameSceneNameOverlayTextColor,
        gameContinueIndicatorColor: colors.gameContinueIndicatorColor,

        // Inject Preview Scene
        scenes: {
            ...initialGameData.scenes,
            [previewStandardScene.id]: previewStandardScene,
            [previewVignetteScene.id]: previewVignetteScene
        },
        // Force start scene to be the vignette if we want to preview the splash
        startScene: tab === 'info' ? previewVignetteScene.id : previewStandardScene.id,

        vignettes: [{
            id: 'VNT_OPENING',
            name: t('editor.newOpeningVignetteName', 'Abertura'),
            title: title || t('editor.newOpeningVignetteName', 'Abertura'),
            description: description || t('editor.newVignetteDescription', 'Descrição do novo capítulo.'),
            buttonText: startButtonText,
            showTitle: !omitSplashTitle,
            showDescription: !omitSplashDescription,
            alignment: splashContentAlignment,
            textAnimationType: 'fade',
            textSpeed: 3
        }]
    }), [title, description, startButtonText, splashImage, interactionType, layoutOrientation, layoutOrder, imageFrame, gameBackgroundColor, fontFamily, fontSize, actionButtonText, verbInputPlaceholder, colors, previewStandardScene, previewVignetteScene, tab, enableInventory, enableDiary, enableNotes, enableChances, enableTrackers, splashContentAlignment, omitSplashTitle, omitSplashDescription, startScreenBgImage, showStartScreenTitle, startScreenTitle, menuTransitionType, menuTransitionSpeed, menuTransitionSound, maxChances, chanceIcon, chanceIconColor, diaryShowPlayerAction, diaryAllowExport, enableRetrospective, enableSuggestions, enableTextControl, textReadingFlow, textAnimationType, textSpeed, enableImages, imageTransitionType, imageSpeed, t]);

    const handleCreate = () => {
        const startSceneId = 'SCN_OPENING';

        const defaultTitle = t('editor.newOpeningVignetteName', 'Abertura');
        const defaultDescription = t('editor.newVignetteDescription', 'Descrição do novo capítulo.');
        const finalTitle = title || defaultTitle;
        const finalDescription = description || defaultDescription;

        // Create the Opening Vignette as a Scene
        const openingScene: Scene = {
            id: startSceneId,
            name: finalTitle,
            description: finalDescription,
            image: splashImage, // Use the splash image for the scene background if desired, or keep generic/empty
            interactions: [],
            objectIds: [],
            vignetteType: 'opening',
            vignetteButtonText: startButtonText || t('editor.defaultStartButton', 'COMEÇAR'),
            vignetteAlignment: splashContentAlignment,
            vignetteShowTitle: !omitSplashTitle,
            vignetteShowDescription: !omitSplashDescription,
            mapX: 0,
            mapY: 0
        };

        const newGameData: Partial<GameData> = {
            ...previewGameData,
            gameTitle: finalTitle, // Ensure title is synced
            gameSplashDescription: finalDescription,
            gameSplashButtonText: startButtonText,
            gameSplashImage: splashImage,
            startScene: startSceneId,
            scenes: {
                [startSceneId]: openingScene
            },
            sceneOrder: [startSceneId],
            vignettes: [] // Clear legacy vignettes to prevent confusion
        };

        onCreate(newGameData);
    };

    return {
        tab, setTab,
        isInputFocused, setIsInputFocused,
        isColorsExpanded, setIsColorsExpanded,
        previewType, setPreviewType,
        title, setTitle,
        description, setDescription,
        startButtonText, setStartButtonText,
        splashImage, setSplashImage,
        interactionType, setInteractionType,
        enableInventory, setEnableInventory,
        enableDiary, setEnableDiary,
        enableNotes, setEnableNotes,
        enableChances, setEnableChances,
        enableTrackers, setEnableTrackers,
        enableTextControl, setEnableTextControl,
        textReadingFlow, setTextReadingFlow,
        textAnimationType, setTextAnimationType,
        textSpeed, setTextSpeed,
        enableImages, setEnableImages,
        imageTransitionType, setImageTransitionType,
        imageSpeed, setImageSpeed,
        enableSystemMenu, setEnableSystemMenu,
        startScreenTitle, setStartScreenTitle,
        showStartScreenTitle, setShowStartScreenTitle,
        startScreenBgImage, setStartScreenBgImage,
        menuTransitionType, setMenuTransitionType,
        menuTransitionSpeed, setMenuTransitionSpeed,
        maxChances, setMaxChances,
        chanceIcon, setChanceIcon,
        chanceIconColor, setChanceIconColor,
        diaryShowPlayerAction, setDiaryShowPlayerAction,
        diaryAllowExport, setDiaryAllowExport,
        enableRetrospective, setEnableRetrospective,
        enableSuggestions, setEnableSuggestions,
        splashContentAlignment, setSplashContentAlignment,
        omitSplashTitle, setOmitSplashTitle,
        omitSplashDescription, setOmitSplashDescription,
        layoutOrientation, setLayoutOrientation,
        layoutOrder, setLayoutOrder,
        imageFrame, setImageFrame,
        gameBackgroundColor, setGameBackgroundColor,
        colors, setColors,
        fontFamily, setFontFamily,
        fontSize, setFontSize,
        actionButtonText, setActionButtonText,
        verbInputPlaceholder, setVerbInputPlaceholder,
        getScaledFontSize,
        handleImageUpload,
        handleApplyTheme,
        previewStandardScene,
        previewGameData,
        handleCreate,
        handleNext: () => {
            if (tab === 'info') setTab('appearance');
            else if (tab === 'appearance') setTab('system');
        }
    };
};
