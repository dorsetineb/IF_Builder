import React, { useState, useEffect, memo, useMemo } from 'react';
import { useTheme } from './ThemeProvider';
import { useToast } from './ToastContext';
import { FONTS, PREDEFINED_THEMES, MAX_IMAGE_SIZE, MAX_AUDIO_SIZE } from '../constants';


import { GameData, FixedVerb } from '../types';
import { useTranslation } from 'react-i18next';
import { DitherShader } from '@/components/ui/dither-shader';
import { SystemsTab } from './UIEditor/SystemsTab';
import { AppearanceTab } from './UIEditor/AppearanceTab';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Upload, Trash2, Plus, TriangleAlert, SlidersHorizontal, Heart, Circle, X, Square, Diamond, Check, Image as ImageIcon, RotateCcw, Save, LayoutTemplate, Palette, Type, ChevronDown, ChevronUp, Smartphone, Monitor, Book, Package, Trophy, Command, Skull, Ghost, Grid, List, Sun, Moon, Coffee, Terminal, Globe, Split, ArrowRight, Wrench, Lightbulb, Hand, History as HistoryIcon } from 'lucide-react';

interface UIEditorProps {
    html: string;
    css: string;
    layoutOrientation: 'vertical' | 'horizontal';
    layoutOrder: 'image-first' | 'image-last';
    imageFrame: GameData['gameImageFrame'];
    actionButtonText: string;
    verbInputPlaceholder: string;
    diaryPlayerName: string;
    splashButtonText: string;
    continueButtonText: string;
    restartButtonText: string;
    gameSystemEnabled: 'none' | 'chances' | 'trackers';
    maxChances: number;
    textColor: string;
    titleColor: string;
    splashButtonColor: string;
    splashButtonHoverColor: string;
    splashButtonTextColor: string;
    actionButtonColor: string;
    actionButtonTextColor: string;
    focusColor: string;
    chanceIconColor: string;
    gameFontFamily: string;
    gameFontSize: string;
    chanceIcon: 'circle' | 'cross' | 'heart' | 'square' | 'diamond';
    chanceReturnButtonText: string;
    gameChanceLossMessage?: string;
    gameChanceRestoreMessage?: string;
    gameTheme: 'dark' | 'light';
    textColorLight: string;
    titleColorLight: string;
    focusColorLight: string;
    frameBookColor: string;
    frameTradingCardColor: string;
    frameRoundedTopColor: string;

    gameSceneNameOverlayBg: string;
    gameSceneNameOverlayTextColor: string;
    gameFrameColor: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (field: keyof GameData, value: any, skipDirty?: boolean) => void;
    isDirty: boolean;
    onSetDirty: (isDirty: boolean) => void;
    gameShowTrackersUI?: boolean;
    gameShowSystemButton?: boolean;
    gameInteractionType?: 'parser' | 'choice';
    suggestionsButtonText?: string;
    inventoryButtonText?: string;
    diaryButtonText?: string;
    trackersButtonText?: string;
    gameSystemButtonText?: string;
    gameSaveMenuTitle?: string;
    gameLoadMenuTitle?: string;
    gameMainMenuButtonText?: string;
    gameContinueIndicatorColor: string;
    gameViewEndingButtonText?: string;
    gameRetrospectiveButtonText?: string;

    title: string;
    logo: string;
    omitSplashTitle: boolean;
    omitSplashDescription: boolean;
    splashImage: string;
    splashContentAlignment: 'left' | 'right';
    gameSplashContentVerticalAlignment?: 'top' | 'center' | 'bottom';

    splashDescription: string;
    backgroundMusic: string;
    positiveEndingImage: string;
    positiveEndingContentAlignment: 'left' | 'right';
    positiveEndingDescription: string;
    positiveEndingMusic: string;
    negativeEndingImage: string;
    negativeEndingContentAlignment: 'left' | 'right';
    negativeEndingDescription: string;
    negativeEndingMusic: string;
    fixedVerbs: FixedVerb[];

    textAnimationType: 'fade' | 'typewriter';
    textSpeed: number;
    textReadingFlow?: 'continuous' | 'paused';
    imageTransitionType: GameData['gameImageTransitionType'];
    imageSpeed: number;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAnnotate?: (annotation: any) => void;
    // New System Props
    enableTrackers?: boolean;
    enableInventory?: boolean;
    enableSuggestions?: boolean;
    enableDiary?: boolean;
    enableFixedVerbs?: boolean;
    enableChances?: boolean;
    enableImages?: boolean;
    enableTextControl?: boolean;
    enableRetrospective?: boolean;
    inventoryCapacity?: number;
    inventoryMaxWeight?: number;
    diaryAutoScroll?: boolean;
    diaryAllowExport?: boolean;
    diaryMaxMessages?: number;
    diaryShowSceneImage?: boolean;
    diaryShowPlayerAction?: boolean;
    gameSuggestionsEmptyFeedback?: string;
    gameInventoryEmptyFeedback?: string;
    onNavigateToTrackers?: () => void;
}

// Define App Theme Primary Colors based on index.css
// APP_THEME_COLORS moved to constant or kept here if specific to UIEditor
const APP_THEME_COLORS = {
    dark: '#9D4EDD',      // Vibrant Purple
    light: '#18181b',     // Zinc-950 (Dark Grey/Black for Light theme as per :root --primary)
    cream: '#5c4033',     // Approx for warm brown oklch(0.40 0.08 30)
    terminal: '#4AF626',   // Terminal Green
    windows: '#008080',    // Teal (W95 theme accent)
    system: '#9D4EDD'     // Default fallback
};

const FixedVerbItem: React.FC<{
    verb: FixedVerb;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (id: string, field: 'verbs' | 'description', value: any) => void;
    onRemove: (id: string) => void;
}> = memo(({ verb, onUpdate, onRemove }) => {
    const [localVerbs, setLocalVerbs] = useState(verb.verbs.join(', '));
    const inputId = `verb-words-${verb.id}`;

    useEffect(() => {
        if (document.activeElement?.id !== inputId) {
            setLocalVerbs(verb.verbs.join(', '));
        }
    }, [verb.verbs, inputId]);

    const handleVerbsBlur = () => {
        const cleanedVerbs = localVerbs.split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
        if (JSON.stringify(cleanedVerbs) !== JSON.stringify(verb.verbs)) {
            onUpdate(verb.id, 'verbs', cleanedVerbs);
        }
    };

    return (
        <div className="relative p-6 bg-muted/30 rounded-xl border border-muted-foreground/50 hover:border-primary/30 transition-all group">
            <button
                onClick={() => onRemove(verb.id)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                title="Remover verbo"
            >
                <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label htmlFor={inputId} className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Verbos (separados por vírgula)</label>
                    <input
                        id={inputId}
                        type="text"
                        value={localVerbs}
                        onChange={e => setLocalVerbs(e.target.value)}
                        onBlur={handleVerbsBlur}
                        placeholder="ex: ajuda, help, ?"
                        className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-0 transition-all"
                    />
                </div>
                <div className="flex flex-col h-full">
                    <label htmlFor={`verb-desc-${verb.id}`} className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Descrição / Resposta</label>
                    <textarea
                        id={`verb-desc-${verb.id}`}
                        value={verb.description}
                        onChange={e => onUpdate(verb.id, 'description', e.target.value)}
                        placeholder="Texto que será exibido para o jogador."
                        rows={3}
                        className="w-full flex-grow bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-0 transition-all resize-none"
                    />
                </div>
            </div>
        </div>
    );
});
FixedVerbItem.displayName = 'FixedVerbItem';

export const UIEditor: React.FC<UIEditorProps> = (props) => {
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme(); // Get app theme
    const currentSliderColor = APP_THEME_COLORS[theme as keyof typeof APP_THEME_COLORS] || APP_THEME_COLORS.dark;

    const ditherColors = useMemo(() => {
        switch (theme) {
            case 'terminal':
                return { primary: '#0d1117', secondary: '#4af626' };
            case 'windows':
                return { primary: '#0f0f0f', secondary: '#008080' };
            default: // dark
                return { primary: '#000000', secondary: currentSliderColor };
        }
    }, [theme, currentSliderColor]);

    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        html, css, layoutOrientation, layoutOrder, imageFrame, actionButtonText, verbInputPlaceholder, diaryPlayerName,
        splashButtonText, continueButtonText, restartButtonText, gameSystemEnabled, maxChances,
        textColor, titleColor, splashButtonColor, splashButtonHoverColor, splashButtonTextColor,
        actionButtonColor, actionButtonTextColor, focusColor, chanceIconColor, gameFontFamily,
        gameFontSize, chanceIcon, chanceReturnButtonText,
        gameChanceLossMessage: chanceLossMessage,
        gameChanceRestoreMessage: chanceRestoreMessage,
        gameTheme, textColorLight, titleColorLight, focusColorLight,
        gameSceneNameOverlayBg, gameSceneNameOverlayTextColor, gameFrameColor, onUpdate, isDirty, onSetDirty,
        gameShowTrackersUI, gameShowSystemButton, gameInteractionType, suggestionsButtonText, inventoryButtonText,
        diaryButtonText, trackersButtonText, gameSystemButtonText, gameSaveMenuTitle, gameLoadMenuTitle,
        gameMainMenuButtonText, gameContinueIndicatorColor, gameViewEndingButtonText, gameRetrospectiveButtonText, title, logo, omitSplashTitle, omitSplashDescription,
        splashImage, splashContentAlignment, splashDescription, backgroundMusic,
        positiveEndingImage, positiveEndingContentAlignment, positiveEndingDescription, positiveEndingMusic,
        negativeEndingImage, negativeEndingContentAlignment, negativeEndingDescription, negativeEndingMusic,
        fixedVerbs, textAnimationType, textSpeed, textReadingFlow, imageTransitionType, imageSpeed,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onAnnotate, enableTrackers, enableInventory, enableSuggestions, enableDiary, enableFixedVerbs, enableChances,
        enableImages, enableTextControl, inventoryCapacity, inventoryMaxWeight, diaryAutoScroll,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        diaryAllowExport, diaryMaxMessages, diaryShowSceneImage, diaryShowPlayerAction, onNavigateToTrackers,
        gameSplashContentVerticalAlignment: splashContentVerticalAlignment
    } = props;






    const [localLayoutOrientation, setLocalLayoutOrientation] = useState(layoutOrientation);
    const [localLayoutOrder, setLocalLayoutOrder] = useState(layoutOrder);
    const [localImageFrame, setLocalImageFrame] = useState(imageFrame);
    const [localActionButtonText, setLocalActionButtonText] = useState(actionButtonText);
    const [localVerbInputPlaceholder, setLocalVerbInputPlaceholder] = useState(verbInputPlaceholder);
    const [localDiaryPlayerName, setLocalDiaryPlayerName] = useState(diaryPlayerName);
    const [localSplashButtonText, setLocalSplashButtonText] = useState(splashButtonText);
    const [localContinueButtonText, setLocalContinueButtonText] = useState(continueButtonText);
    const [localRestartButtonText, setLocalRestartButtonText] = useState(restartButtonText);
    const [localGameSystemEnabled, setLocalGameSystemEnabled] = useState(gameSystemEnabled);
    const [localMaxChances, setLocalMaxChances] = useState(maxChances);
    const [localGameShowTrackersUI, setLocalGameShowTrackersUI] = useState(gameShowTrackersUI);
    const [localGameShowSystemButton, setLocalGameShowSystemButton] = useState(gameShowSystemButton);
    const [localGameInteractionType, setLocalGameInteractionType] = useState<'parser' | 'choice'>(gameInteractionType || 'parser');
    const [localSuggestionsButtonText, setLocalSuggestionsButtonText] = useState(suggestionsButtonText);
    const [localInventoryButtonText, setLocalInventoryButtonText] = useState(inventoryButtonText);
    const [localDiaryButtonText, setLocalDiaryButtonText] = useState(diaryButtonText);
    const [localTrackersButtonText, setLocalTrackersButtonText] = useState(trackersButtonText);
    const [localSystemButtonText, setLocalSystemButtonText] = useState(gameSystemButtonText);
    const [localSaveMenuTitle, setLocalSaveMenuTitle] = useState(gameSaveMenuTitle);
    const [localLoadMenuTitle, setLocalLoadMenuTitle] = useState(gameLoadMenuTitle);
    const [localMainMenuButtonText, setLocalMainMenuButtonText] = useState(gameMainMenuButtonText);
    const [localViewEndingButtonText, setLocalViewEndingButtonText] = useState(gameViewEndingButtonText);
    const [localRetrospectiveButtonText, setLocalRetrospectiveButtonText] = useState(gameRetrospectiveButtonText);
    const [activeTab, setActiveTab] = useState<'sistemas' | 'aparencia' | 'textos' | 'config'>('aparencia');
    const [originalTheme, setOriginalTheme] = useState(theme);
    const [localLanguage, setLocalLanguage] = useState(i18n.language || 'pt');
    const handleAppThemeChange = (newTheme: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (setTheme) setTheme(newTheme as any);
    };

    const [localTextColor, setLocalTextColor] = useState(textColor);
    const [localTitleColor, setLocalTitleColor] = useState(titleColor);
    const [localSplashButtonColor, setLocalSplashButtonColor] = useState(splashButtonColor);
    const [localSplashButtonHoverColor, setLocalSplashButtonHoverColor] = useState(splashButtonHoverColor);
    const [localSplashButtonTextColor, setLocalSplashButtonTextColor] = useState(splashButtonTextColor);
    const [localActionButtonColor, setLocalActionButtonColor] = useState(actionButtonColor);
    const [localActionButtonTextColor, setLocalActionButtonTextColor] = useState(actionButtonTextColor);
    const [localFocusColor, setLocalFocusColor] = useState(focusColor);
    const [localChanceIconColor, setLocalChanceIconColor] = useState(chanceIconColor);
    const [localFontFamily, setLocalFontFamily] = useState(gameFontFamily);
        const [localGameFontSize, setLocalGameFontSize] = useState(gameFontSize === '0.85em' ? '12' : (gameFontSize || '14'));
    const [localChanceIcon, setLocalChanceIcon] = useState(chanceIcon);
    const [localChanceLossMessage, setLocalChanceLossMessage] = useState(chanceLossMessage || '');
    const [localChanceRestoreMessage, setLocalChanceRestoreMessage] = useState(chanceRestoreMessage || '');
    const [localChanceReturnButtonText, setLocalChanceReturnButtonText] = useState(chanceReturnButtonText);
    const [localGameTheme, setLocalGameTheme] = useState(gameTheme);
    const [localTextColorLight, setLocalTextColorLight] = useState(textColorLight);
    const [localTitleColorLight, setLocalTitleColorLight] = useState(titleColorLight);
    const [localFocusColorLight, setLocalFocusColorLight] = useState(focusColorLight);

    const [localGameSceneNameOverlayBg, setLocalGameSceneNameOverlayBg] = useState(gameSceneNameOverlayBg);
    const [localGameSceneNameOverlayTextColor, setLocalGameSceneNameOverlayTextColor] = useState(gameSceneNameOverlayTextColor);
    const [localGameFrameColor, setLocalGameFrameColor] = useState(gameFrameColor);
    const [localGameContinueIndicatorColor, setLocalGameContinueIndicatorColor] = useState(gameContinueIndicatorColor);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [focusPreview, setFocusPreview] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isCustomizing, setIsCustomizing] = useState(false);

    const [localTitle, setLocalTitle] = useState(title);
    const [localLogo, setLocalLogo] = useState(logo);
    const [localOmitSplashTitle, setLocalOmitSplashTitle] = useState(omitSplashTitle);
    const [localOmitSplashDescription, setLocalOmitSplashDescription] = useState(omitSplashDescription);
    const [localSplashImage, setLocalSplashImage] = useState(splashImage);
    const [localSplashContentAlignment, setLocalSplashContentAlignment] = useState(splashContentAlignment);
    const [localSplashContentVerticalAlignment, setLocalSplashContentVerticalAlignment] = useState(splashContentVerticalAlignment || 'bottom');
    const [localSplashDescription, setLocalSplashDescription] = useState(splashDescription);
    const [previewType, setPreviewType] = useState<'scene' | 'vignette'>('scene');
    const [isColorsExpanded, setIsColorsExpanded] = useState(false);
    const [localBackgroundMusic, setLocalBackgroundMusic] = useState(backgroundMusic);
    const [localPositiveEndingImage, setLocalPositiveEndingImage] = useState(positiveEndingImage);
    const [localPositiveEndingContentAlignment, setLocalPositiveEndingContentAlignment] = useState(positiveEndingContentAlignment);
    const [localPositiveEndingDescription, setLocalPositiveEndingDescription] = useState(positiveEndingDescription);
    const [localPositiveEndingMusic, setLocalPositiveEndingMusic] = useState(positiveEndingMusic);
    const [localNegativeEndingImage, setLocalNegativeEndingImage] = useState(negativeEndingImage);
    const [localNegativeEndingContentAlignment, setLocalNegativeEndingContentAlignment] = useState(negativeEndingContentAlignment);
    const [localNegativeEndingDescription, setLocalNegativeEndingDescription] = useState(negativeEndingDescription);
    const [localNegativeEndingMusic, setLocalNegativeEndingMusic] = useState(negativeEndingMusic);

    const [localFixedVerbs, setLocalFixedVerbs] = useState(fixedVerbs);
    const [localSuggestionsEmptyFeedback, setLocalSuggestionsEmptyFeedback] = useState(props.gameSuggestionsEmptyFeedback || '');
    const [localInventoryEmptyFeedback, setLocalInventoryEmptyFeedback] = useState(props.gameInventoryEmptyFeedback || '');

    const [localTextAnimationType, setLocalTextAnimationType] = useState<'fade' | 'typewriter'>(props.textAnimationType || 'typewriter');
    const [localTextSpeed, setLocalTextSpeed] = useState<number>(props.textSpeed || 3);
    const [localTextReadingFlow, setLocalTextReadingFlow] = useState<'continuous' | 'paused'>(textReadingFlow || 'paused');
    const [localImageTransitionType, setLocalImageTransitionType] = useState<GameData['gameImageTransitionType']>(props.imageTransitionType || 'fade');
    const [localImageSpeed, setLocalImageSpeed] = useState(imageSpeed);

    const TABS = {
        aparencia: t('UIEditor.tabs.aparencia'),
        sistemas: t('UIEditor.tabs.sistemas'),
        textos: t('UIEditor.tabs.textos'),
        config: t('UIEditor.tabs.config', 'Área de trabalho'),
    };


    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const handleFixedVerbChange = (id: string, field: 'verbs' | 'description', value: any) => {
        setLocalFixedVerbs(prev => prev.map(verb =>
            verb.id === id ? { ...verb, [field]: value } : verb
        ));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleRemoveFixedVerb = (id: string) => {
        setLocalFixedVerbs(prev => prev.filter(verb => verb.id !== id));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAddFixedVerb = () => {
        const newId = `verb_${Math.random().toString(36).substring(2, 9)}`;
        const newVerb: FixedVerb = {
            id: newId,
            verbs: [],
            description: ''
        };
        setLocalFixedVerbs(prev => [...prev, newVerb]);
    };

    // New System States
    // New System States
    const [localEnableTrackers, setLocalEnableTrackers] = useState(enableTrackers ?? (gameSystemEnabled === 'trackers'));
    const [localEnableInventory, setLocalEnableInventory] = useState(enableInventory ?? true);
    const [localEnableSuggestions, setLocalEnableSuggestions] = useState(enableSuggestions ?? true);
    const [localEnableDiary, setLocalEnableDiary] = useState(enableDiary ?? true);
    const [localEnableFixedVerbs, setLocalEnableFixedVerbs] = useState(enableFixedVerbs ?? (fixedVerbs && fixedVerbs.length > 0));
    const [localEnableChances, setLocalEnableChances] = useState(enableChances ?? (gameSystemEnabled === 'chances'));
    const [localEnableImages, setLocalEnableImages] = useState(enableImages ?? true);
    const [localEnableTextControl, setLocalEnableTextControl] = useState(enableTextControl ?? true);
    const [localEnableRetrospective, setLocalEnableRetrospective] = useState(props.enableRetrospective ?? true);

    const [localInventoryCapacity, setLocalInventoryCapacity] = useState(inventoryCapacity ?? 10);
    const [localInventoryMaxWeight, setLocalInventoryMaxWeight] = useState(inventoryMaxWeight ?? 0);

    const [localDiaryAutoScroll, setLocalDiaryAutoScroll] = useState(diaryAutoScroll ?? true);
    const [localDiaryAllowExport, setLocalDiaryAllowExport] = useState(diaryAllowExport ?? false);
    const [localDiaryMaxMessages, setLocalDiaryMaxMessages] = useState(diaryMaxMessages ?? 100);
    const [localDiaryShowSceneImage, setLocalDiaryShowSceneImage] = useState(diaryShowSceneImage ?? false);
    const [localDiaryShowPlayerAction, setLocalDiaryShowPlayerAction] = useState(diaryShowPlayerAction ?? true);

    // --- Granular State Check Effects ---
    // Splitting the monolithic useEffect avoids resetting ALL fields when ONE prop changes.

    // 1. Layout & Appearance
    useEffect(() => { setLocalLayoutOrientation(layoutOrientation); }, [layoutOrientation]);
    useEffect(() => { setLocalLayoutOrder(layoutOrder); }, [layoutOrder]);
    useEffect(() => { setLocalImageFrame(imageFrame); }, [imageFrame]);
    useEffect(() => { setLocalGameTheme(gameTheme); }, [gameTheme]);

    // 2. Buttons & Text
    useEffect(() => { setLocalSplashButtonText(splashButtonText); }, [splashButtonText]);
    useEffect(() => { setLocalContinueButtonText(continueButtonText); }, [continueButtonText]);
    useEffect(() => { setLocalRestartButtonText(restartButtonText); }, [restartButtonText]);
    useEffect(() => { setLocalActionButtonText(actionButtonText); }, [actionButtonText]);
    useEffect(() => { setLocalVerbInputPlaceholder(verbInputPlaceholder); }, [verbInputPlaceholder]);
    useEffect(() => { setLocalSuggestionsButtonText(suggestionsButtonText); }, [suggestionsButtonText]);
    useEffect(() => { setLocalInventoryButtonText(inventoryButtonText); }, [inventoryButtonText]);
    useEffect(() => { setLocalDiaryButtonText(diaryButtonText); }, [diaryButtonText]);
    useEffect(() => { setLocalTrackersButtonText(trackersButtonText); }, [trackersButtonText]);
    useEffect(() => { setLocalSystemButtonText(gameSystemButtonText); }, [gameSystemButtonText]);
    useEffect(() => { setLocalMainMenuButtonText(gameMainMenuButtonText); }, [gameMainMenuButtonText]);
    useEffect(() => { setLocalViewEndingButtonText(gameViewEndingButtonText); }, [gameViewEndingButtonText]);
    useEffect(() => { setLocalSaveMenuTitle(gameSaveMenuTitle); }, [gameSaveMenuTitle]);
    useEffect(() => { setLocalLoadMenuTitle(gameLoadMenuTitle); }, [gameLoadMenuTitle]);
    useEffect(() => { setLocalChanceReturnButtonText(chanceReturnButtonText); }, [chanceReturnButtonText]);
    useEffect(() => { setLocalSuggestionsEmptyFeedback(props.gameSuggestionsEmptyFeedback || ''); }, [props.gameSuggestionsEmptyFeedback]);
    useEffect(() => { setLocalInventoryEmptyFeedback(props.gameInventoryEmptyFeedback || ''); }, [props.gameInventoryEmptyFeedback]);

    // 3. Colors
    useEffect(() => { setLocalTextColor(textColor); }, [textColor]);
    useEffect(() => { setLocalTitleColor(titleColor); }, [titleColor]);
    useEffect(() => { setLocalSplashButtonColor(splashButtonColor); }, [splashButtonColor]);
    useEffect(() => { setLocalSplashButtonHoverColor(splashButtonHoverColor); }, [splashButtonHoverColor]);
    useEffect(() => { setLocalSplashButtonTextColor(splashButtonTextColor); }, [splashButtonTextColor]);
    useEffect(() => { setLocalActionButtonColor(actionButtonColor); }, [actionButtonColor]);
    useEffect(() => { setLocalActionButtonTextColor(actionButtonTextColor); }, [actionButtonTextColor]);
    useEffect(() => { setLocalFocusColor(focusColor); }, [focusColor]);
    useEffect(() => { setLocalChanceIconColor(chanceIconColor); }, [chanceIconColor]);
    useEffect(() => { setLocalTextColorLight(textColorLight); }, [textColorLight]);
    useEffect(() => { setLocalTitleColorLight(titleColorLight); }, [titleColorLight]);
    useEffect(() => { setLocalFocusColorLight(focusColorLight); }, [focusColorLight]);

    useEffect(() => { setLocalGameSceneNameOverlayBg(gameSceneNameOverlayBg); }, [gameSceneNameOverlayBg]);
    useEffect(() => { setLocalGameSceneNameOverlayTextColor(gameSceneNameOverlayTextColor); }, [gameSceneNameOverlayTextColor]);
    useEffect(() => { setLocalGameFrameColor(gameFrameColor); }, [gameFrameColor]);
    useEffect(() => { setLocalGameContinueIndicatorColor(gameContinueIndicatorColor); }, [gameContinueIndicatorColor]);

    // 4. Game Params (Fonts, Title, etc.)
    useEffect(() => { setLocalFontFamily(gameFontFamily); }, [gameFontFamily]);
    useEffect(() => {
        setLocalGameFontSize(gameFontSize === '0.85em' ? '12' : gameFontSize);
    }, [gameFontSize]);

    useEffect(() => { setLocalTitle(title); }, [title]);
    useEffect(() => { setLocalLogo(logo); }, [logo]);
    useEffect(() => { setLocalOmitSplashTitle(omitSplashTitle); }, [omitSplashTitle]);
    useEffect(() => { setLocalSplashImage(splashImage); }, [splashImage]);
    useEffect(() => { setLocalSplashContentAlignment(splashContentAlignment); }, [splashContentAlignment]);
    useEffect(() => { setLocalSplashContentVerticalAlignment(splashContentVerticalAlignment || 'bottom'); }, [splashContentVerticalAlignment]);
    useEffect(() => { setLocalSplashDescription(splashDescription); }, [splashDescription]);
    useEffect(() => { setLocalBackgroundMusic(backgroundMusic); }, [backgroundMusic]);

    // 5. Endings
    useEffect(() => { setLocalPositiveEndingImage(positiveEndingImage); }, [positiveEndingImage]);
    useEffect(() => { setLocalPositiveEndingContentAlignment(positiveEndingContentAlignment); }, [positiveEndingContentAlignment]);
    useEffect(() => { setLocalPositiveEndingDescription(positiveEndingDescription); }, [positiveEndingDescription]);
    useEffect(() => { setLocalPositiveEndingMusic(positiveEndingMusic); }, [positiveEndingMusic]);
    useEffect(() => { setLocalNegativeEndingImage(negativeEndingImage); }, [negativeEndingImage]);
    useEffect(() => { setLocalNegativeEndingContentAlignment(negativeEndingContentAlignment); }, [negativeEndingContentAlignment]);
    useEffect(() => { setLocalNegativeEndingDescription(negativeEndingDescription); }, [negativeEndingDescription]);
    useEffect(() => { setLocalNegativeEndingMusic(negativeEndingMusic); }, [negativeEndingMusic]);

    // 6. Systems & Configs
    useEffect(() => { setLocalGameSystemEnabled(gameSystemEnabled); }, [gameSystemEnabled]);
    useEffect(() => { setLocalMaxChances(maxChances); }, [maxChances]);
    useEffect(() => { setLocalGameShowTrackersUI(gameShowTrackersUI ?? true); }, [gameShowTrackersUI]);
    useEffect(() => { setLocalGameShowSystemButton(gameShowSystemButton ?? true); }, [gameShowSystemButton]);
    useEffect(() => { setLocalDiaryPlayerName(diaryPlayerName); }, [diaryPlayerName]);
    useEffect(() => { setLocalRetrospectiveButtonText(gameRetrospectiveButtonText); }, [gameRetrospectiveButtonText]);
    useEffect(() => { setLocalChanceIcon(chanceIcon); }, [chanceIcon]);
    useEffect(() => { setLocalChanceLossMessage(chanceLossMessage || ''); }, [chanceLossMessage]);
    useEffect(() => { setLocalChanceRestoreMessage(chanceRestoreMessage || ''); }, [chanceRestoreMessage]);
    useEffect(() => { setLocalFixedVerbs(fixedVerbs); }, [fixedVerbs]);
    useEffect(() => { setLocalTextAnimationType(textAnimationType); }, [textAnimationType]);
    useEffect(() => { setLocalTextSpeed(textSpeed); }, [textSpeed]);
    useEffect(() => { setLocalTextReadingFlow(textReadingFlow || 'paused'); }, [textReadingFlow]);
    useEffect(() => { setLocalGameInteractionType(gameInteractionType || 'parser'); }, [gameInteractionType]);
    useEffect(() => { setLocalImageTransitionType(imageTransitionType); }, [imageTransitionType]);
    useEffect(() => { setLocalImageSpeed(imageSpeed); }, [imageSpeed]);

    // 7. Feature Flags (Enablers)
    useEffect(() => { setLocalEnableTrackers(enableTrackers ?? (gameSystemEnabled === 'trackers')); }, [enableTrackers, gameSystemEnabled]);
    useEffect(() => { setLocalEnableInventory(enableInventory ?? true); }, [enableInventory]);
    useEffect(() => { setLocalEnableSuggestions(enableSuggestions ?? true); }, [enableSuggestions]);
    useEffect(() => { setLocalEnableDiary(enableDiary ?? true); }, [enableDiary]);
    useEffect(() => { setLocalEnableFixedVerbs(enableFixedVerbs ?? (fixedVerbs && fixedVerbs.length > 0)); }, [enableFixedVerbs, fixedVerbs]);
    useEffect(() => { setLocalEnableChances(enableChances ?? (gameSystemEnabled === 'chances')); }, [enableChances, gameSystemEnabled]);
    useEffect(() => { setLocalEnableImages(enableImages ?? true); }, [enableImages]);
    useEffect(() => { setLocalEnableTextControl(enableTextControl ?? true); }, [enableTextControl]);
    useEffect(() => { setLocalEnableRetrospective(props.enableRetrospective ?? true); }, [props.enableRetrospective]);

    // 8. Specific System Settings
    useEffect(() => { setLocalInventoryCapacity(inventoryCapacity ?? 10); }, [inventoryCapacity]);
    useEffect(() => { setLocalInventoryMaxWeight(inventoryMaxWeight ?? 0); }, [inventoryMaxWeight]);
    useEffect(() => { setLocalDiaryAutoScroll(diaryAutoScroll ?? true); }, [diaryAutoScroll]);
    useEffect(() => { setLocalDiaryAllowExport(diaryAllowExport ?? false); }, [diaryAllowExport]);
    useEffect(() => { setLocalDiaryMaxMessages(diaryMaxMessages ?? 100); }, [diaryMaxMessages]);
    useEffect(() => { setLocalDiaryShowSceneImage(diaryShowSceneImage ?? false); }, [diaryShowSceneImage]);
    useEffect(() => { setLocalDiaryShowPlayerAction(diaryShowPlayerAction ?? true); }, [diaryShowPlayerAction]);

    // --- SNAPSHOT DIRTY STRATEGY ---
    // Instead of comparing against potentially unstable props, we capture
    // the initial state on mount and compare against that.

    const getCurrentState = () => ({
        localLayoutOrientation, localLayoutOrder, localImageFrame, localSplashButtonText,
        localContinueButtonText, localRestartButtonText, localActionButtonText, localVerbInputPlaceholder,
        localDiaryPlayerName, localGameSystemEnabled, localMaxChances, localGameShowTrackersUI,
        localGameShowSystemButton, localGameInteractionType, localSuggestionsButtonText,
        localInventoryButtonText, localDiaryButtonText, localTrackersButtonText, localSystemButtonText,
        localSaveMenuTitle, localLoadMenuTitle, localMainMenuButtonText, localViewEndingButtonText, localRetrospectiveButtonText,
        localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor,
        localSplashButtonTextColor, localActionButtonColor, localActionButtonTextColor, localFocusColor,
        localChanceIconColor, localFontFamily, localGameFontSize, localChanceIcon, localChanceLossMessage,
        localChanceRestoreMessage, localChanceReturnButtonText, localGameTheme, localTextColorLight,
        localTitleColorLight, localFocusColorLight, localGameFrameColor, localGameSceneNameOverlayBg, localGameSceneNameOverlayTextColor,
        localGameContinueIndicatorColor, localTitle, localLogo, localOmitSplashTitle, localSplashImage,
        localSplashContentAlignment, localSplashContentVerticalAlignment, localSplashDescription,
        localBackgroundMusic, localPositiveEndingImage, localPositiveEndingContentAlignment,
        localPositiveEndingDescription, localPositiveEndingMusic, localNegativeEndingImage,
        localNegativeEndingContentAlignment, localNegativeEndingDescription, localNegativeEndingMusic,
        localFixedVerbs, localTextAnimationType, localTextSpeed, localTextReadingFlow,
        localImageTransitionType, localImageSpeed,
        // New Systems
        localEnableTrackers, localEnableInventory, localEnableSuggestions, localEnableDiary, localEnableFixedVerbs,
        localEnableChances, localEnableImages, localEnableTextControl, localEnableRetrospective, localInventoryCapacity,
        localInventoryMaxWeight, localDiaryAutoScroll, localDiaryAllowExport, localDiaryMaxMessages,
        localDiaryShowSceneImage, localDiaryShowPlayerAction,
        localSuggestionsEmptyFeedback, localInventoryEmptyFeedback
    });


    // Store the initial state on mount
    const initialStateRef = React.useRef<ReturnType<typeof getCurrentState> | null>(null);

    // Initialize snapshot on mount
    useEffect(() => {
        initialStateRef.current = getCurrentState();
        onSetDirty(false);
    }, []); // Run ONCE on mount

    // Check dirty status against the SNAPSHOT
    useEffect(() => {
        if (!initialStateRef.current) return;

        const currentState = getCurrentState();
        const initialState = initialStateRef.current;

        const isStateDirty =
            JSON.stringify(currentState) !== JSON.stringify(initialState);

        if (isStateDirty !== isDirty) {
            onSetDirty(isStateDirty);
        }
    }, [
        localLayoutOrientation, localLayoutOrder, localImageFrame, localSplashButtonText,
        localContinueButtonText, localRestartButtonText, localActionButtonText, localVerbInputPlaceholder,
        localDiaryPlayerName, localGameSystemEnabled, localMaxChances, localGameShowTrackersUI,
        localGameShowSystemButton, localGameInteractionType, localSuggestionsButtonText,
        localInventoryButtonText, localDiaryButtonText, localTrackersButtonText, localSystemButtonText,
        localSaveMenuTitle, localLoadMenuTitle, localMainMenuButtonText, localViewEndingButtonText, localRetrospectiveButtonText,
        localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor,
        localSplashButtonTextColor, localActionButtonColor, localActionButtonTextColor, localFocusColor,
        localChanceIconColor, localFontFamily, localGameFontSize, localChanceIcon, localChanceLossMessage,
        localChanceRestoreMessage, localChanceReturnButtonText, localGameTheme, localTextColorLight,
        localTitleColorLight, localFocusColorLight, localGameFrameColor, localGameSceneNameOverlayBg, localGameSceneNameOverlayTextColor,
        localGameContinueIndicatorColor, localTitle, localLogo, localOmitSplashTitle, localSplashImage,
        localSplashContentAlignment, localSplashContentVerticalAlignment, localSplashDescription,
        localBackgroundMusic, localPositiveEndingImage, localPositiveEndingContentAlignment,
        localPositiveEndingDescription, localPositiveEndingMusic, localNegativeEndingImage,
        localNegativeEndingContentAlignment, localNegativeEndingDescription, localNegativeEndingMusic,
        localFixedVerbs, localTextAnimationType, localTextSpeed, localTextReadingFlow,
        localImageTransitionType, localImageSpeed,
        localEnableTrackers, localEnableInventory, localEnableSuggestions, localEnableDiary, localEnableFixedVerbs,
        localEnableChances, localEnableImages, localEnableTextControl, localEnableRetrospective, localInventoryCapacity,
        localInventoryMaxWeight, localDiaryAutoScroll, localDiaryAllowExport, localDiaryMaxMessages,
        localDiaryShowSceneImage, localDiaryShowPlayerAction,
        localSuggestionsEmptyFeedback, localInventoryEmptyFeedback
    ]);



    const handleSave = () => {
        if (localLayoutOrientation !== layoutOrientation) onUpdate('gameLayoutOrientation', localLayoutOrientation, true);
        if (localLayoutOrder !== layoutOrder) onUpdate('gameLayoutOrder', localLayoutOrder, true);
        if (localImageFrame !== imageFrame) onUpdate('gameImageFrame', localImageFrame, true);
        if (localSplashButtonText !== splashButtonText) onUpdate('gameSplashButtonText', localSplashButtonText, true);
        if (localContinueButtonText !== continueButtonText) onUpdate('gameContinueButtonText', localContinueButtonText, true);
        if (localRestartButtonText !== restartButtonText) onUpdate('gameRestartButtonText', localRestartButtonText, true);
        if (localActionButtonText !== actionButtonText) onUpdate('gameActionButtonText', localActionButtonText, true);
        if (localVerbInputPlaceholder !== verbInputPlaceholder) onUpdate('gameVerbInputPlaceholder', localVerbInputPlaceholder, true);
        if (localDiaryPlayerName !== diaryPlayerName) onUpdate('gameDiaryPlayerName', localDiaryPlayerName, true);
        if (localGameSystemEnabled !== gameSystemEnabled) onUpdate('gameSystemEnabled', localGameSystemEnabled, true);
        if (localMaxChances !== maxChances) onUpdate('gameMaxChances', localMaxChances, true);
        if (localGameShowTrackersUI !== gameShowTrackersUI) onUpdate('gameShowTrackersUI', localGameShowTrackersUI, true);
        if (localGameShowSystemButton !== gameShowSystemButton) onUpdate('gameShowSystemButton', localGameShowSystemButton, true);
        if (localSuggestionsButtonText !== suggestionsButtonText) onUpdate('gameSuggestionsButtonText', localSuggestionsButtonText, true);
        if (localInventoryButtonText !== inventoryButtonText) onUpdate('gameInventoryButtonText', localInventoryButtonText, true);
        if (localDiaryButtonText !== diaryButtonText) onUpdate('gameDiaryButtonText', localDiaryButtonText, true);
        if (localTrackersButtonText !== trackersButtonText) onUpdate('gameTrackersButtonText', localTrackersButtonText, true);
        if (localSystemButtonText !== gameSystemButtonText) onUpdate('gameSystemButtonText', localSystemButtonText, true);
        if (localSaveMenuTitle !== gameSaveMenuTitle) onUpdate('gameSaveMenuTitle', localSaveMenuTitle, true);
        if (localLoadMenuTitle !== gameLoadMenuTitle) onUpdate('gameLoadMenuTitle', localLoadMenuTitle, true);
        if (localMainMenuButtonText !== gameMainMenuButtonText) onUpdate('gameMainMenuButtonText', localMainMenuButtonText, true);
        if (localViewEndingButtonText !== gameViewEndingButtonText) onUpdate('gameViewEndingButtonText', localViewEndingButtonText, true);
        if (localRetrospectiveButtonText !== gameRetrospectiveButtonText) onUpdate('gameRetrospectiveButtonText', localRetrospectiveButtonText, true);
        if (localTextColor !== textColor) onUpdate('gameTextColor', localTextColor, true);
        if (localTitleColor !== titleColor) onUpdate('gameTitleColor', localTitleColor, true);
        if (localSplashButtonColor !== splashButtonColor) onUpdate('gameSplashButtonColor', localSplashButtonColor, true);
        if (localSplashButtonHoverColor !== splashButtonHoverColor) onUpdate('gameSplashButtonHoverColor', localSplashButtonHoverColor, true);
        if (localSplashButtonTextColor !== splashButtonTextColor) onUpdate('gameSplashButtonTextColor', localSplashButtonTextColor, true);
        if (localActionButtonColor !== actionButtonColor) onUpdate('gameActionButtonColor', localActionButtonColor, true);
        if (localActionButtonTextColor !== actionButtonTextColor) onUpdate('gameActionButtonTextColor', localActionButtonTextColor, true);
        if (localFocusColor !== focusColor) onUpdate('gameFocusColor', localFocusColor, true);
        if (localChanceIconColor !== chanceIconColor) onUpdate('gameChanceIconColor', localChanceIconColor, true);
        if (localFontFamily !== gameFontFamily) onUpdate('gameFontFamily', localFontFamily, true);
        if (localGameFontSize !== gameFontSize) onUpdate('gameFontSize', localGameFontSize, true);
        if (localChanceIcon !== chanceIcon) onUpdate('gameChanceIcon', localChanceIcon, true);
        if (localChanceLossMessage !== chanceLossMessage) onUpdate('gameChanceLossMessage', localChanceLossMessage, true);
        if (localChanceRestoreMessage !== chanceRestoreMessage) onUpdate('gameChanceRestoreMessage', localChanceRestoreMessage, true);
        if (localChanceReturnButtonText !== chanceReturnButtonText) onUpdate('gameChanceReturnButtonText', localChanceReturnButtonText, true);
        if (localGameTheme !== gameTheme) onUpdate('gameTheme', localGameTheme, true);
        if (localTextColorLight !== textColorLight) onUpdate('textColorLight', localTextColorLight, true);
        if (localTitleColorLight !== titleColorLight) onUpdate('titleColorLight', localTitleColorLight, true);
        if (localFocusColorLight !== focusColorLight) onUpdate('focusColorLight', localFocusColorLight, true);

        if (localGameSceneNameOverlayBg !== gameSceneNameOverlayBg) onUpdate('gameSceneNameOverlayBg', localGameSceneNameOverlayBg, true);
        if (localGameSceneNameOverlayTextColor !== gameSceneNameOverlayTextColor) onUpdate('gameSceneNameOverlayTextColor', localGameSceneNameOverlayTextColor, true);
        if (localGameFrameColor !== gameFrameColor) {
            onUpdate('gameFrameColor', localGameFrameColor, false);
            onUpdate('frameBookColor', localGameFrameColor, false);
            onUpdate('frameTradingCardColor', localGameFrameColor, false);
            onUpdate('frameRoundedTopColor', localGameFrameColor, true);
        }
        if (localGameContinueIndicatorColor !== gameContinueIndicatorColor) onUpdate('gameContinueIndicatorColor', localGameContinueIndicatorColor, true);
        if (localSplashImage !== splashImage) onUpdate('gameSplashImage', localSplashImage, true);
        if (localOmitSplashTitle !== omitSplashTitle) onUpdate('gameOmitSplashTitle', localOmitSplashTitle, true);
        if (localOmitSplashDescription !== omitSplashDescription) onUpdate('gameOmitSplashDescription', localOmitSplashDescription, true);
        if (localSplashContentAlignment !== splashContentAlignment) onUpdate('gameSplashContentAlignment', localSplashContentAlignment, true);
        if (localSplashContentVerticalAlignment !== splashContentVerticalAlignment) onUpdate('gameSplashContentVerticalAlignment', localSplashContentVerticalAlignment, true);
        if (localSplashDescription !== splashDescription) onUpdate('gameSplashDescription', localSplashDescription, true);
        if (localBackgroundMusic !== backgroundMusic) onUpdate('gameBackgroundMusic', localBackgroundMusic, true);
        if (localPositiveEndingImage !== positiveEndingImage) onUpdate('positiveEndingImage', localPositiveEndingImage, true);
        if (localPositiveEndingContentAlignment !== positiveEndingContentAlignment) onUpdate('positiveEndingContentAlignment', localPositiveEndingContentAlignment, true);
        if (localPositiveEndingDescription !== positiveEndingDescription) onUpdate('positiveEndingDescription', localPositiveEndingDescription, true);
        if (localPositiveEndingMusic !== positiveEndingMusic) onUpdate('positiveEndingMusic', localPositiveEndingMusic, true);
        if (localNegativeEndingImage !== negativeEndingImage) onUpdate('negativeEndingImage', localNegativeEndingImage, true);
        if (localNegativeEndingContentAlignment !== negativeEndingContentAlignment) onUpdate('negativeEndingContentAlignment', localNegativeEndingContentAlignment, true);
        if (localNegativeEndingDescription !== negativeEndingDescription) onUpdate('negativeEndingDescription', localNegativeEndingDescription, true);
        if (localNegativeEndingMusic !== negativeEndingMusic) onUpdate('negativeEndingMusic', localNegativeEndingMusic, true);
        if (JSON.stringify(localFixedVerbs) !== JSON.stringify(fixedVerbs)) onUpdate('fixedVerbs', localFixedVerbs, true);
        if (localTextAnimationType !== textAnimationType) onUpdate('gameTextAnimationType', localTextAnimationType, true);
        if (localTextSpeed !== textSpeed) onUpdate('gameTextSpeed', localTextSpeed, true);
        if (localImageTransitionType !== imageTransitionType) onUpdate('gameImageTransitionType', localImageTransitionType, true);
        if (localImageSpeed !== imageSpeed) onUpdate('gameImageSpeed', localImageSpeed, true);
        if (localEnableImages !== (enableImages ?? true)) onUpdate('enableImages', localEnableImages, true);
        if (localEnableTextControl !== (enableTextControl ?? true)) onUpdate('enableTextControl', localEnableTextControl, true);
        if (localTextReadingFlow !== (textReadingFlow || 'paused')) onUpdate('gameTextReadingFlow', localTextReadingFlow, true);
        if (localGameInteractionType !== (gameInteractionType || 'parser')) onUpdate('gameInteractionType', localGameInteractionType, true);

        // Sync new systems
        if (localEnableTrackers !== (enableTrackers ?? (gameSystemEnabled === 'trackers'))) onUpdate('enableTrackers', localEnableTrackers, true);
        if (localEnableInventory !== (enableInventory ?? true)) onUpdate('enableInventory', localEnableInventory, true);
        if (localEnableSuggestions !== (enableSuggestions ?? true)) onUpdate('enableSuggestions', localEnableSuggestions, true);
        if (localEnableDiary !== (enableDiary ?? true)) onUpdate('enableDiary', localEnableDiary, true);
        if (localEnableFixedVerbs !== (enableFixedVerbs ?? (fixedVerbs && fixedVerbs.length > 0))) onUpdate('enableFixedVerbs', localEnableFixedVerbs, true);
        if (localEnableChances !== (enableChances ?? (gameSystemEnabled === 'chances'))) onUpdate('enableChances', localEnableChances, true);
        if (localEnableRetrospective !== (props.enableRetrospective ?? true)) onUpdate('enableRetrospective', localEnableRetrospective, true);

        if (localSuggestionsEmptyFeedback !== (props.gameSuggestionsEmptyFeedback || '')) onUpdate('gameSuggestionsEmptyFeedback', localSuggestionsEmptyFeedback, true);
        if (localInventoryEmptyFeedback !== (props.gameInventoryEmptyFeedback || '')) onUpdate('gameInventoryEmptyFeedback', localInventoryEmptyFeedback, true);

        if (localLanguage !== (i18n.language || 'pt')) {
            i18n.changeLanguage(localLanguage);
        }
        setOriginalTheme(theme);

        // Update snapshot to current state to prevent dirty flag from persisting
        initialStateRef.current = getCurrentState();
        onSetDirty(false);
    };

    // Custom dirty effect for Configurações
    useEffect(() => {
        const isAppStyleDirty = theme !== originalTheme || localLanguage !== (i18n.language || 'pt');
        if (isAppStyleDirty) {
            props.onSetDirty(true);
        }
    }, [theme, localLanguage, originalTheme, i18n.language, props]);



    const handleUndo = () => {
        setLocalLayoutOrientation(layoutOrientation);
        setLocalLayoutOrder(layoutOrder);
        setLocalImageFrame(imageFrame);
        setLocalSplashButtonText(splashButtonText);
        setLocalContinueButtonText(continueButtonText);
        setLocalRestartButtonText(restartButtonText);
        setLocalActionButtonText(actionButtonText);
        setLocalVerbInputPlaceholder(verbInputPlaceholder);
        setLocalDiaryPlayerName(diaryPlayerName);
        setLocalGameSystemEnabled(gameSystemEnabled);
        setLocalMaxChances(maxChances);
        setLocalGameShowTrackersUI(gameShowTrackersUI);
        setLocalGameShowSystemButton(gameShowSystemButton);
        setLocalGameInteractionType(gameInteractionType || 'parser');
        setLocalSuggestionsButtonText(suggestionsButtonText);
        setLocalInventoryButtonText(inventoryButtonText);
        setLocalDiaryButtonText(diaryButtonText);
        setLocalTrackersButtonText(trackersButtonText);
        setLocalSystemButtonText(gameSystemButtonText);
        setLocalSaveMenuTitle(gameSaveMenuTitle);
        setLocalLoadMenuTitle(gameLoadMenuTitle);
        setLocalMainMenuButtonText(gameMainMenuButtonText);
        setLocalViewEndingButtonText(gameViewEndingButtonText);
        setLocalTextColor(textColor);
        setLocalTitleColor(titleColor);
        setLocalSplashButtonColor(splashButtonColor);
        setLocalSplashButtonHoverColor(splashButtonHoverColor);
        setLocalSplashButtonTextColor(splashButtonTextColor);
        setLocalActionButtonColor(actionButtonColor);
        setLocalActionButtonTextColor(actionButtonTextColor);
        setLocalFocusColor(focusColor);
        setLocalChanceIconColor(chanceIconColor);
        setLocalFontFamily(gameFontFamily);
        setLocalGameFontSize(gameFontSize === '0.85em' ? '12' : gameFontSize);
        setLocalChanceIcon(chanceIcon);
        setLocalChanceLossMessage(chanceLossMessage || '');
        setLocalChanceRestoreMessage(chanceRestoreMessage || '');
        setLocalChanceReturnButtonText(chanceReturnButtonText);
        setLocalGameTheme(gameTheme);
        setLocalTextColorLight(textColorLight);
        setLocalTitleColorLight(titleColorLight);
        setLocalFocusColorLight(focusColorLight);

        setLocalGameSceneNameOverlayBg(gameSceneNameOverlayBg);
        setLocalGameSceneNameOverlayTextColor(gameSceneNameOverlayTextColor);
        setLocalGameFrameColor(gameFrameColor);
        setLocalGameContinueIndicatorColor(gameContinueIndicatorColor);
        setLocalTitle(title);
        setLocalLogo(logo);
        setLocalOmitSplashTitle(omitSplashTitle);
        setLocalOmitSplashDescription(omitSplashDescription);
        setLocalSplashImage(splashImage);
        setLocalSplashContentAlignment(splashContentAlignment);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLocalSplashContentVerticalAlignment((splashContentVerticalAlignment || 'bottom') as any);
        setLocalSplashDescription(splashDescription);
        setLocalBackgroundMusic(backgroundMusic);
        setLocalPositiveEndingImage(positiveEndingImage);
        setLocalPositiveEndingContentAlignment(positiveEndingContentAlignment);
        setLocalPositiveEndingDescription(positiveEndingDescription);
        setLocalPositiveEndingMusic(positiveEndingMusic);
        setLocalNegativeEndingImage(negativeEndingImage);
        setLocalNegativeEndingContentAlignment(negativeEndingContentAlignment);
        setLocalNegativeEndingDescription(negativeEndingDescription);
        setLocalNegativeEndingMusic(negativeEndingMusic);
        setLocalFixedVerbs(fixedVerbs);
        setLocalTextAnimationType(textAnimationType);
        setLocalTextSpeed(textSpeed);
        setLocalTextReadingFlow(textReadingFlow || 'paused');
        setLocalImageTransitionType(imageTransitionType);
        setLocalImageSpeed(imageSpeed);

        // Reset New Systems
        setLocalEnableTrackers(enableTrackers ?? (gameSystemEnabled === 'trackers'));
        setLocalEnableInventory(enableInventory ?? true);
        setLocalEnableSuggestions(enableSuggestions ?? true);
        setLocalEnableDiary(enableDiary ?? true);
        setLocalEnableFixedVerbs(enableFixedVerbs ?? (fixedVerbs && fixedVerbs.length > 0));
        setLocalEnableChances(enableChances ?? (gameSystemEnabled === 'chances'));
        setLocalEnableImages(enableImages ?? true);
        setLocalEnableTextControl(enableTextControl ?? true);

        setLocalInventoryCapacity(inventoryCapacity ?? 10);
        setLocalInventoryMaxWeight(inventoryMaxWeight ?? 0);
        setLocalDiaryAutoScroll(diaryAutoScroll ?? true);
        setLocalDiaryAllowExport(diaryAllowExport ?? false);
        setLocalDiaryMaxMessages(diaryMaxMessages ?? 100);
        setLocalDiaryShowSceneImage(diaryShowSceneImage ?? false);
        setLocalDiaryShowPlayerAction(diaryShowPlayerAction ?? true);

        setLocalSuggestionsEmptyFeedback(props.gameSuggestionsEmptyFeedback || '');
        setLocalInventoryEmptyFeedback(props.gameInventoryEmptyFeedback || '');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (setTheme) setTheme(originalTheme as any);
        setLocalLanguage(i18n.language || 'pt');
    };

    const handleThemeChange = (theme: 'dark' | 'light') => {
        setLocalGameTheme(theme);
        const newFrameColor = '#FFFFFF';

        setLocalGameFrameColor(newFrameColor);
    };

    const applyTheme = (theme: typeof PREDEFINED_THEMES[0]) => {
        setLocalTextColor(theme.textColor);
        setLocalTitleColor(theme.titleColor);
        setLocalFocusColor(theme.focusColor);
        setLocalTextColorLight(theme.textColorLight);
        setLocalTitleColorLight(theme.titleColorLight);
        setLocalFocusColorLight(theme.focusColorLight);
        setLocalSplashButtonColor(theme.splashButtonColor);
        setLocalSplashButtonHoverColor(theme.splashButtonHoverColor);
        setLocalSplashButtonTextColor(theme.splashButtonTextColor);
        setLocalActionButtonColor(theme.actionButtonColor);
        setLocalActionButtonTextColor(theme.actionButtonTextColor);
        setLocalChanceIconColor(theme.chanceIconColor);
        setLocalGameContinueIndicatorColor(theme.focusColor);
        // Default overlay colors for themes
        setLocalGameSceneNameOverlayBg('#000000');
        setLocalGameSceneNameOverlayTextColor('#FFFFFF');



        const newFrameColor = '#FFFFFF';



        setLocalGameFrameColor(newFrameColor);
    };

    const { toast } = useToast();

    // ... (rest of the code)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > MAX_IMAGE_SIZE) {
                toast(t('UIEditor.errors.uploadError'), t('SceneEditor.imageLimitExceeded', { size: MAX_IMAGE_SIZE / 1024 / 1024 }), "error");
                if (e.target) (e.target as HTMLInputElement).value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setter(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
        if (e.target) {
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > MAX_AUDIO_SIZE) {
                toast(t('UIEditor.errors.uploadError'), t('UIEditor.errors.audioLimitExceeded', { size: MAX_AUDIO_SIZE / 1024 / 1024 }), "error");
                if (e.target) (e.target as HTMLInputElement).value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setter(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
        if (e.target) {
            (e.target as HTMLInputElement).value = '';
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ChanceIcon: React.FC<{ type: any, color: string, className?: string }> = ({ type, color, className }) => {
        switch (type) {
            case 'heart': return <Heart fill={color} stroke="none" className={className} />;
            case 'circle': return <Circle fill={color} stroke="none" className={className} />;
            case 'cross': return <svg stroke={color} strokeWidth="4" strokeLinecap="round" viewBox="0 0 24 24" className={className} fill="none"><path d="M12 5 V19 M5 12 H19" /></svg>;
            case 'square': return <Square fill={color} stroke="none" className={className} />;
            case 'diamond': return <Diamond fill={color} stroke="none" className={className} />;
            default: return <Heart fill={color} stroke="none" className={className} />;
        }
       // getFramePreviewStyles moved to src/utils/frameStyles.ts
    };

    return (
        <div className="px-4 pb-8 h-full">
            <div className="sticky top-0 z-40 bg-background flex flex-col pt-4 pb-4 gap-3 -mx-4 px-4 shadow-sm border-b border-muted-foreground/50">
                {/* Solid background shield to perfectly hide scrolled content */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-background pointer-events-none" />
                {/* Soft gradient transition */}
                <div className="absolute left-0 right-0 -bottom-2 h-2 bg-gradient-to-b from-background to-transparent pointer-events-none" />
                {/* Header with Save/Undo actions */}
                <div className="flex justify-between items-center p-4 rounded-xl border border-muted-foreground/50 bg-card shadow-sm relative z-10">
                    <p className="text-muted-foreground text-xs font-medium">
                        {t('UIEditor.header.description')}
                    </p>
                    <div className="flex items-center gap-3">
                        {isDirty && (
                            <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mr-2">
                                {t('UIEditor.header.unsavedChanges')}
                            </div>
                        )}
                        <button
                            onClick={handleUndo}
                            disabled={!isDirty}
                            className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                        >
                            {t('UIEditor.header.undo')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!isDirty}
                            className="px-4 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                        >
                            {t('UIEditor.header.save')}
                        </button>
                    </div>
                </div>
                <div className="border-b border-muted-foreground/50 flex items-center justify-between relative">
                    <div className="flex space-x-1 overflow-x-auto">
                        {Object.entries(TABS).map(([key, name]) => {
                            return (
                                <button
                                    key={key}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onClick={() => setActiveTab(key as any)}
                                    className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-4 ${activeTab === key
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                        }`}
                                >
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="bg-background">


                    {activeTab === 'sistemas' && (
                        <SystemsTab
                            localGameInteractionType={localGameInteractionType}
                            setLocalGameInteractionType={setLocalGameInteractionType}
                            localEnableImages={localEnableImages}
                            setLocalEnableImages={setLocalEnableImages}
                            localImageTransitionType={localImageTransitionType}
                            setLocalImageTransitionType={setLocalImageTransitionType}
                            localImageSpeed={localImageSpeed}
                            setLocalImageSpeed={setLocalImageSpeed}
                            currentSliderColor={currentSliderColor}
                            localEnableTextControl={localEnableTextControl}
                            setLocalEnableTextControl={setLocalEnableTextControl}
                            localTextAnimationType={localTextAnimationType}
                            setLocalTextAnimationType={setLocalTextAnimationType}
                            localTextReadingFlow={localTextReadingFlow}
                            setLocalTextReadingFlow={setLocalTextReadingFlow}
                            localTextSpeed={localTextSpeed}
                            setLocalTextSpeed={setLocalTextSpeed}
                            localEnableChances={localEnableChances}
                            setLocalEnableChances={setLocalEnableChances}
                            localChanceIcon={localChanceIcon}
                            setLocalChanceIcon={setLocalChanceIcon}
                            localChanceIconColor={localChanceIconColor}
                            setLocalChanceIconColor={setLocalChanceIconColor}
                            localMaxChances={localMaxChances}
                            setLocalMaxChances={setLocalMaxChances}
                            localEnableSuggestions={localEnableSuggestions}
                            setLocalEnableSuggestions={setLocalEnableSuggestions}
                            localEnableInventory={localEnableInventory}
                            setLocalEnableInventory={setLocalEnableInventory}
                            localEnableDiary={localEnableDiary}
                            setLocalEnableDiary={setLocalEnableDiary}
                            localDiaryShowSceneImage={localDiaryShowSceneImage}
                            setLocalDiaryShowSceneImage={setLocalDiaryShowSceneImage}
                            localDiaryShowPlayerAction={localDiaryShowPlayerAction}
                            setLocalDiaryShowPlayerAction={setLocalDiaryShowPlayerAction}
                            localEnableTrackers={localEnableTrackers}
                            setLocalEnableTrackers={setLocalEnableTrackers}
                            localEnableRetrospective={localEnableRetrospective}
                            setLocalEnableRetrospective={setLocalEnableRetrospective}
                            onNavigateToTrackers={props.onNavigateToTrackers}
                        />
                    )}

                    {
                        activeTab === 'aparencia' && (
                            <AppearanceTab
                                localLayoutOrientation={localLayoutOrientation}
                                setLocalLayoutOrientation={setLocalLayoutOrientation}
                                localLayoutOrder={localLayoutOrder}
                                setLocalLayoutOrder={setLocalLayoutOrder}
                                localImageFrame={localImageFrame}
                                setLocalImageFrame={setLocalImageFrame}
                                localGameTheme={localGameTheme}
                                localGameFrameColor={localGameFrameColor}
                                setLocalGameFrameColor={setLocalGameFrameColor}
                                localTextColor={localTextColor}
                                setLocalTextColor={setLocalTextColor}
                                localTextColorLight={localTextColorLight}
                                setLocalTextColorLight={setLocalTextColorLight}
                                localTitleColor={localTitleColor}
                                setLocalTitleColor={setLocalTitleColor}
                                localTitleColorLight={localTitleColorLight}
                                setLocalTitleColorLight={setLocalTitleColorLight}
                                localFocusColor={localFocusColor}
                                setLocalFocusColor={setLocalFocusColor}
                                localFocusColorLight={localFocusColorLight}
                                setLocalFocusColorLight={setLocalFocusColorLight}
                                localGameContinueIndicatorColor={localGameContinueIndicatorColor}
                                setLocalGameContinueIndicatorColor={setLocalGameContinueIndicatorColor}
                                localSplashButtonColor={localSplashButtonColor}
                                setLocalSplashButtonColor={setLocalSplashButtonColor}
                                localSplashButtonTextColor={localSplashButtonTextColor}
                                setLocalSplashButtonTextColor={setLocalSplashButtonTextColor}
                                localSplashButtonHoverColor={localSplashButtonHoverColor}
                                setLocalSplashButtonHoverColor={setLocalSplashButtonHoverColor}
                                localActionButtonColor={localActionButtonColor}
                                setLocalActionButtonColor={setLocalActionButtonColor}
                                localActionButtonTextColor={localActionButtonTextColor}
                                setLocalActionButtonTextColor={setLocalActionButtonTextColor}
                                localGameSceneNameOverlayBg={localGameSceneNameOverlayBg}
                                setLocalGameSceneNameOverlayBg={setLocalGameSceneNameOverlayBg}
                                localGameSceneNameOverlayTextColor={localGameSceneNameOverlayTextColor}
                                setLocalGameSceneNameOverlayTextColor={setLocalGameSceneNameOverlayTextColor}
                                localFontFamily={localFontFamily}
                                setLocalFontFamily={setLocalFontFamily}
                                localGameFontSize={localGameFontSize}
                                setLocalGameFontSize={setLocalGameFontSize}
                                localSplashContentAlignment={localSplashContentAlignment}
                                setLocalSplashContentAlignment={setLocalSplashContentAlignment}
                                localOmitSplashTitle={localOmitSplashTitle}
                                setLocalOmitSplashTitle={setLocalOmitSplashTitle}
                                localOmitSplashDescription={localOmitSplashDescription}
                                setLocalOmitSplashDescription={setLocalOmitSplashDescription}
                                localSplashButtonText={localSplashButtonText}
                                localEnableInventory={localEnableInventory}
                                localEnableDiary={localEnableDiary}
                                localEnableTrackers={localEnableTrackers}
                                localGameShowSystemButton={localGameShowSystemButton}
                                handleThemeChange={handleThemeChange}
                                applyTheme={applyTheme}
                                previewType={previewType}
                                setPreviewType={setPreviewType}
                                isColorsExpanded={isColorsExpanded}
                                setIsColorsExpanded={setIsColorsExpanded}
                                ditherColors={ditherColors}
                            />
                        )
                    }

                    {
                        activeTab === 'textos' && (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 content-start">
                                {/* SECTION: AÇÕES & INTERAÇÃO */}
                                <div className="break-inside-avoid p-6 bg-card border border-muted-foreground/50 rounded-2xl transition-all hover:shadow-lg shadow-sm flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
                                    <div className="flex items-center gap-3">
                                        <Hand className="w-5 h-5" />
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.actions')}</h4>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="actionButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.actionButtonText')}</label>
                                            <input type="text" id="actionButtonText" value={localActionButtonText || ''} onChange={(e) => setLocalActionButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.actionButtonPlaceholder')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="verbInputPlaceholder" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.commandInputPlaceholder')}</label>
                                            <input type="text" id="verbInputPlaceholder" value={localVerbInputPlaceholder || ''} onChange={(e) => setLocalVerbInputPlaceholder(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.commandInputValue')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="continueButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.continueButtonText')}</label>
                                            <input type="text" id="continueButtonText" value={localContinueButtonText || ''} onChange={(e) => setLocalContinueButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.continueButtonPlaceholder')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="restartButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.restartButtonText')}</label>
                                            <input type="text" id="restartButtonText" value={localRestartButtonText || ''} onChange={(e) => setLocalRestartButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.restartButtonPlaceholder')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="retrospectiveButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.retrospectiveButton')}</label>
                                            <input type="text" id="retrospectiveButtonText" value={localRetrospectiveButtonText || ''} onChange={(e) => setLocalRetrospectiveButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.retrospectivePlaceholder')} />
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: SUGESTÕES */}
                                <div className="break-inside-avoid p-6 bg-card border border-muted-foreground/50 rounded-2xl transition-all hover:shadow-lg shadow-sm flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                                    <div className="flex items-center gap-3">
                                        <Lightbulb className="w-5 h-5" />
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.suggestions')}</h4>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="suggestionsButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.suggestionsButton')}</label>
                                            <input type="text" id="suggestionsButtonText" value={localSuggestionsButtonText || ''} onChange={e => setLocalSuggestionsButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.suggestionsPlaceholder')} disabled={!localEnableSuggestions} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="suggestionsEmptyFeedback" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.suggestionsEmptyFeedbackLabel')}</label>
                                            <input
                                                type="text"
                                                id="suggestionsEmptyFeedback"
                                                value={localSuggestionsEmptyFeedback || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setLocalSuggestionsEmptyFeedback(val);
                                                    onUpdate('gameSuggestionsEmptyFeedback', val);
                                                }}
                                                className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                placeholder={t('UIEditor.textos.suggestionsEmptyFeedbackPlaceholder')}
                                                disabled={!localEnableSuggestions}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: INVENTÁRIO */}
                                <div className="break-inside-avoid p-6 bg-card border border-muted-foreground/50 rounded-2xl transition-all hover:shadow-lg shadow-sm flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5" />
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.inventory')}</h4>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="inventoryButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.inventoryButton')}</label>
                                            <input type="text" id="inventoryButtonText" value={localInventoryButtonText || ''} onChange={e => setLocalInventoryButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.inventoryPlaceholder')} disabled={!localEnableInventory} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="inventoryEmptyFeedback" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.inventoryEmptyFeedbackLabel')}</label>
                                            <input
                                                type="text"
                                                id="inventoryEmptyFeedback"
                                                value={localInventoryEmptyFeedback || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setLocalInventoryEmptyFeedback(val);
                                                    onUpdate('gameInventoryEmptyFeedback', val);
                                                }}
                                                className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                placeholder={t('UIEditor.textos.inventoryEmptyFeedbackPlaceholder')}
                                                disabled={!localEnableInventory}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: DIÁRIO & NARRATIVA */}
                                <div className="break-inside-avoid p-6 bg-card border border-muted-foreground/50 rounded-2xl transition-all hover:shadow-lg shadow-sm flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '300ms' }}>
                                    <div className="flex items-center gap-3">
                                        <Book className="w-5 h-5" />
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.diary')}</h4>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="diaryButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.diaryButton')}</label>
                                            <input type="text" id="diaryButtonText" value={localDiaryButtonText || ''} onChange={e => setLocalDiaryButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.diaryPlaceholder')} disabled={!localEnableDiary} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="diaryPlayerName" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.diaryPlayerName')}</label>
                                            <input type="text" id="diaryPlayerName" value={localDiaryPlayerName || ''} onChange={(e) => setLocalDiaryPlayerName(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.diaryPlayerNamePlaceholder')} disabled={!localEnableDiary} />
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: INTERFACE & SISTEMA */}
                                <div className="break-inside-avoid p-6 bg-card border border-muted-foreground/50 rounded-2xl transition-all hover:shadow-lg shadow-sm flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '400ms' }}>
                                    <div className="flex items-center gap-3">
                                        <Wrench className="w-5 h-5" />
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.system')}</h4>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="systemButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.systemButton')}</label>
                                            <input type="text" id="systemButtonText" value={localSystemButtonText || ''} onChange={e => setLocalSystemButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.systemPlaceholder')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="trackersButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.trackersButton')}</label>
                                            <input type="text" id="trackersButtonText" value={localTrackersButtonText || ''} onChange={e => setLocalTrackersButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.trackersPlaceholder')} disabled={!localEnableTrackers} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="mainMenuButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.mainMenuButton')}</label>
                                            <input type="text" id="mainMenuButtonText" value={localMainMenuButtonText || ''} onChange={e => setLocalMainMenuButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.mainMenuPlaceholder')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="viewEndingButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.viewEndingButton')}</label>
                                            <input type="text" id="viewEndingButtonText" value={localViewEndingButtonText || ''} onChange={e => setLocalViewEndingButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.viewEndingPlaceholder')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="saveMenuTitle" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.saveMenuTitle')}</label>
                                            <input type="text" id="saveMenuTitle" value={localSaveMenuTitle || ''} onChange={e => setLocalSaveMenuTitle(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.saveMenuPlaceholder')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="loadMenuTitle" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.loadMenuTitle')}</label>
                                            <input type="text" id="loadMenuTitle" value={localLoadMenuTitle || ''} onChange={e => setLocalLoadMenuTitle(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all" placeholder={t('UIEditor.textos.loadMenuPlaceholder')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === 'config' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Idioma Section */}
                                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm transition-all duration-300 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        {t('settings.language.label', 'Idioma')}
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <select
                                                value={localLanguage}
                                                onChange={(e) => setLocalLanguage(e.target.value)}
                                                className="w-full bg-input border border-muted-foreground/50 rounded-lg px-3 py-2.5 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                                            >
                                                <option value="pt">{t('common.languages.pt', 'Português')}</option>
                                                <option value="en">{t('common.languages.en', 'English')}</option>
                                                <option value="es">{t('common.languages.es', 'Español')}</option>
                                            </select>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                                            {t('settings.language.description', 'Altere o idioma para que a interface do editor seja traduzida conforme sua preferência.')}
                                        </p>
                                    </div>
                                </div>

                                {/* Aparência Section */}
                                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm transition-all duration-300 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                                        <Palette className="w-4 h-4" />
                                        {t('settings.appearance', 'Aparência')}
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-3">
                                            <button
                                                onClick={() => handleAppThemeChange('dark')}
                                                className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 bg-card hover:bg-muted'} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '0ms' }}
                                            >
                                                <Moon size={16} className="text-muted-foreground" />
                                                <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.dark', 'Noite')}</span>
                                            </button>
                                            <button
                                                onClick={() => handleAppThemeChange('windows')}
                                                className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'windows' ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 bg-card hover:bg-muted'} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '100ms' }}
                                            >
                                                <Monitor size={16} className="text-muted-foreground" />
                                                <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'windows' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.windows', 'W95')}</span>
                                            </button>
                                            <button
                                                onClick={() => handleAppThemeChange('terminal')}
                                                className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'terminal' ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 bg-card hover:bg-muted'} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '200ms' }}
                                            >
                                                <Terminal size={16} className="text-muted-foreground" />
                                                <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'terminal' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.terminal', 'Terminal')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default UIEditor;
