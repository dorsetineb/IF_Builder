
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameData, FixedVerb } from '../types';
import { Upload, Trash2, Plus, TriangleAlert, SlidersHorizontal, Heart, Circle, X, Square, Diamond, Check, Image as ImageIcon, RotateCcw, Save, LayoutTemplate, Palette, Type, ChevronDown, ChevronUp, Smartphone, Monitor, Book, Package, Trophy, Command, Skull, Ghost, Grid, List, TerminalSquare, MousePointerClick } from 'lucide-react';

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

    title: string;
    logo: string;
    omitSplashTitle: boolean;
    splashImage: string;
    splashContentAlignment: 'left' | 'right';
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

    onAnnotate?: (annotation: any) => void;
    // New System Props
    enableTrackers?: boolean;
    enableInventory?: boolean;
    enableDiary?: boolean;
    enableFixedVerbs?: boolean;
    enableChances?: boolean;
    enableImages?: boolean;
    enableTextControl?: boolean;
    inventoryCapacity?: number;
    inventoryMaxWeight?: number;
    diaryAutoScroll?: boolean;
    diaryAllowExport?: boolean;
    diaryMaxMessages?: number;
    diaryShowSceneImage?: boolean;
    diaryShowPlayerAction?: boolean;

    onNavigateToTrackers?: () => void;
}

import { FONTS, PREDEFINED_THEMES } from '../constants';




const ColorInput: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}> = ({ label, id, value, onChange, placeholder }) => {
    const { t } = useTranslation();
    return (
        <div>
            <label htmlFor={id} className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</label>
            <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-muted-foreground/50 rounded-lg focus-within:border-primary/50 transition-all">
                <input
                    type="color"
                    id={`${id}-picker`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                    aria-label={t('uiEditor.labels.colorPickerLabel', { label })}
                />
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-foreground focus:outline-none focus:ring-0 uppercase"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

const FixedVerbItem: React.FC<{
    verb: FixedVerb;
    onUpdate: (id: string, field: 'verbs' | 'description', value: any) => void;
    onRemove: (id: string) => void;
}> = ({ verb, onUpdate, onRemove }) => {
    const { t } = useTranslation();
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
                title={t('uiEditor.labels.removeVerb')}
            >
                <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label htmlFor={inputId} className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('uiEditor.labels.verbsComma')}</label>
                    <input
                        id={inputId}
                        type="text"
                        value={localVerbs}
                        onChange={e => setLocalVerbs(e.target.value)}
                        onBlur={handleVerbsBlur}
                        placeholder={t('uiEditor.placeholders.exHelp')}
                        className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 transition-all"
                    />
                </div>
                <div className="flex flex-col h-full">
                    <label htmlFor={`verb-desc-${verb.id}`} className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('uiEditor.labels.verbDescription')}</label>
                    <textarea
                        id={`verb-desc-${verb.id}`}
                        value={verb.description}
                        onChange={e => onUpdate(verb.id, 'description', e.target.value)}
                        placeholder={t('uiEditor.placeholders.textForPlayer')}
                        rows={3}
                        className="w-full flex-grow bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 transition-all resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

export const UIEditor: React.FC<UIEditorProps> = (props) => {
    const {
        layoutOrientation, layoutOrder, imageFrame, splashButtonText, continueButtonText,
        actionButtonText, verbInputPlaceholder, diaryPlayerName, restartButtonText,
        gameSystemEnabled, maxChances, onUpdate, isDirty, onSetDirty,
        textColor, titleColor, splashButtonColor, splashButtonHoverColor,
        splashButtonTextColor, actionButtonColor, actionButtonTextColor,
        focusColor, chanceIconColor, gameFontFamily, gameFontSize, chanceIcon,
        chanceReturnButtonText,
        gameChanceLossMessage: chanceLossMessage,
        gameChanceRestoreMessage: chanceRestoreMessage,
        gameTheme, textColorLight, titleColorLight, focusColorLight,
        frameBookColor, frameTradingCardColor,
        frameRoundedTopColor,
        gameSceneNameOverlayBg,
        gameSceneNameOverlayTextColor,
        gameShowTrackersUI, gameShowSystemButton, suggestionsButtonText, inventoryButtonText, diaryButtonText, trackersButtonText,
        gameSystemButtonText, gameSaveMenuTitle, gameLoadMenuTitle, gameMainMenuButtonText,
        gameContinueIndicatorColor, gameViewEndingButtonText,

        title, logo, omitSplashTitle,
        splashImage, splashContentAlignment, splashDescription,
        backgroundMusic,
        positiveEndingImage, positiveEndingContentAlignment, positiveEndingDescription,
        positiveEndingMusic,
        negativeEndingImage, negativeEndingContentAlignment, negativeEndingDescription,
        negativeEndingMusic,
        fixedVerbs,
        textAnimationType, textSpeed, textReadingFlow, imageTransitionType, imageSpeed,
        onNavigateToTrackers,
        gameSplashContentVerticalAlignment: splashContentVerticalAlignment,
        // New System Props
        enableTrackers, enableInventory, enableDiary, enableFixedVerbs, enableChances,
        enableImages, enableTextControl,
        inventoryCapacity, inventoryMaxWeight,
        diaryAutoScroll, diaryAllowExport, diaryMaxMessages, diaryShowSceneImage, diaryShowPlayerAction,
        gameInteractionType
    } = props;

    const { t } = useTranslation();


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
    const [activeTab, setActiveTab] = useState('aparencia');

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
    const [localGameFontSize, setLocalGameFontSize] = useState(gameFontSize === '0.85em' ? '12' : gameFontSize);
    const [localChanceIcon, setLocalChanceIcon] = useState(chanceIcon);
    const [localChanceLossMessage, setLocalChanceLossMessage] = useState(chanceLossMessage || '');
    const [localChanceRestoreMessage, setLocalChanceRestoreMessage] = useState(chanceRestoreMessage || '');
    const [localChanceReturnButtonText, setLocalChanceReturnButtonText] = useState(chanceReturnButtonText);
    const [localGameTheme, setLocalGameTheme] = useState(gameTheme);
    const [localTextColorLight, setLocalTextColorLight] = useState(textColorLight);
    const [localTitleColorLight, setLocalTitleColorLight] = useState(titleColorLight);
    const [localFocusColorLight, setLocalFocusColorLight] = useState(focusColorLight);
    const [localFrameBookColor, setLocalFrameBookColor] = useState(frameBookColor);
    const [localFrameTradingCardColor, setLocalFrameTradingCardColor] = useState(frameTradingCardColor);
    const [localFrameRoundedTopColor, setLocalFrameRoundedTopColor] = useState(frameRoundedTopColor);
    const [localGameSceneNameOverlayBg, setLocalGameSceneNameOverlayBg] = useState(gameSceneNameOverlayBg);
    const [localGameSceneNameOverlayTextColor, setLocalGameSceneNameOverlayTextColor] = useState(gameSceneNameOverlayTextColor);
    const [localGameContinueIndicatorColor, setLocalGameContinueIndicatorColor] = useState(gameContinueIndicatorColor);
    const [focusPreview, setFocusPreview] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);

    const [localTitle, setLocalTitle] = useState(title);
    const [localLogo, setLocalLogo] = useState(logo);
    const [localOmitSplashTitle, setLocalOmitSplashTitle] = useState(omitSplashTitle);
    const [localSplashImage, setLocalSplashImage] = useState(splashImage);
    const [localSplashContentAlignment, setLocalSplashContentAlignment] = useState(splashContentAlignment);
    const [localSplashContentVerticalAlignment, setLocalSplashContentVerticalAlignment] = useState(splashContentVerticalAlignment || 'bottom');
    const [localSplashDescription, setLocalSplashDescription] = useState(splashDescription);
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

    const [localTextAnimationType, setLocalTextAnimationType] = useState<'fade' | 'typewriter'>(textAnimationType || 'typewriter');
    const [localTextSpeed, setLocalTextSpeed] = useState<number>(textSpeed || 3);
    const [localTextReadingFlow, setLocalTextReadingFlow] = useState<'continuous' | 'paused'>(textReadingFlow || 'paused');
    const [localImageTransitionType, setLocalImageTransitionType] = useState<GameData['gameImageTransitionType']>(imageTransitionType || 'fade');
    const [localImageSpeed, setLocalImageSpeed] = useState(imageSpeed);

    const TABS = [
        { id: 'aparencia', label: t('uiEditor.tabs.appearance'), icon: LayoutTemplate },
        { id: 'sistemas', label: t('uiEditor.tabs.systems'), icon: Package },
        { id: 'textos', label: t('uiEditor.tabs.texts'), icon: Type },
    ];

    const [activeSections, setActiveSections] = useState({
        estrutura: true,
        estilo: true,
        texto: true,
        cores: false
    });

    const toggleSection = (section: keyof typeof activeSections) => {
        setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleFixedVerbChange = (id: string, field: 'verbs' | 'description', value: any) => {
        setLocalFixedVerbs(prev => prev.map(verb =>
            verb.id === id ? { ...verb, [field]: value } : verb
        ));
    };

    const handleRemoveFixedVerb = (id: string) => {
        setLocalFixedVerbs(prev => prev.filter(verb => verb.id !== id));
    };

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
    const [localEnableDiary, setLocalEnableDiary] = useState(enableDiary ?? true);
    const [localEnableFixedVerbs, setLocalEnableFixedVerbs] = useState(enableFixedVerbs ?? (fixedVerbs && fixedVerbs.length > 0));
    const [localEnableChances, setLocalEnableChances] = useState(enableChances ?? (gameSystemEnabled === 'chances'));
    const [localEnableImages, setLocalEnableImages] = useState(enableImages ?? true);
    const [localEnableTextControl, setLocalEnableTextControl] = useState(enableTextControl ?? true);

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
    useEffect(() => { setLocalViewEndingButtonText(gameViewEndingButtonText || t('uiEditor.placeholders.viewEnding')); }, [gameViewEndingButtonText, t]);
    useEffect(() => { setLocalSaveMenuTitle(gameSaveMenuTitle); }, [gameSaveMenuTitle]);
    useEffect(() => { setLocalLoadMenuTitle(gameLoadMenuTitle); }, [gameLoadMenuTitle]);
    useEffect(() => { setLocalChanceReturnButtonText(chanceReturnButtonText); }, [chanceReturnButtonText]);

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
    useEffect(() => { setLocalFrameBookColor(frameBookColor); }, [frameBookColor]);
    useEffect(() => { setLocalFrameTradingCardColor(frameTradingCardColor); }, [frameTradingCardColor]);
    useEffect(() => { setLocalFrameRoundedTopColor(frameRoundedTopColor); }, [frameRoundedTopColor]);
    useEffect(() => { setLocalGameSceneNameOverlayBg(gameSceneNameOverlayBg); }, [gameSceneNameOverlayBg]);
    useEffect(() => { setLocalGameSceneNameOverlayTextColor(gameSceneNameOverlayTextColor); }, [gameSceneNameOverlayTextColor]);
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
    useEffect(() => { setLocalEnableDiary(enableDiary ?? true); }, [enableDiary]);
    useEffect(() => { setLocalEnableFixedVerbs(enableFixedVerbs ?? (fixedVerbs && fixedVerbs.length > 0)); }, [enableFixedVerbs, fixedVerbs]);
    useEffect(() => { setLocalEnableChances(enableChances ?? (gameSystemEnabled === 'chances')); }, [enableChances, gameSystemEnabled]);
    useEffect(() => { setLocalEnableImages(enableImages ?? true); }, [enableImages]);
    useEffect(() => { setLocalEnableTextControl(enableTextControl ?? true); }, [enableTextControl]);

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
        localSaveMenuTitle, localLoadMenuTitle, localMainMenuButtonText, localViewEndingButtonText,
        localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor,
        localSplashButtonTextColor, localActionButtonColor, localActionButtonTextColor, localFocusColor,
        localChanceIconColor, localFontFamily, localGameFontSize, localChanceIcon, localChanceLossMessage,
        localChanceRestoreMessage, localChanceReturnButtonText, localGameTheme, localTextColorLight,
        localTitleColorLight, localFocusColorLight, localFrameBookColor, localFrameTradingCardColor,
        localFrameRoundedTopColor, localGameSceneNameOverlayBg, localGameSceneNameOverlayTextColor,
        localGameContinueIndicatorColor, localTitle, localLogo, localOmitSplashTitle, localSplashImage,
        localSplashContentAlignment, localSplashContentVerticalAlignment, localSplashDescription,
        localBackgroundMusic, localPositiveEndingImage, localPositiveEndingContentAlignment,
        localPositiveEndingDescription, localPositiveEndingMusic, localNegativeEndingImage,
        localNegativeEndingContentAlignment, localNegativeEndingDescription, localNegativeEndingMusic,
        localFixedVerbs, localTextAnimationType, localTextSpeed, localTextReadingFlow,
        localImageTransitionType, localImageSpeed,
        // New Systems
        localEnableTrackers, localEnableInventory, localEnableDiary, localEnableFixedVerbs,
        localEnableChances, localEnableImages, localEnableTextControl, localInventoryCapacity,
        localInventoryMaxWeight, localDiaryAutoScroll, localDiaryAllowExport, localDiaryMaxMessages,
        localDiaryShowSceneImage, localDiaryShowPlayerAction
    });

    // Store the initial state on mount
    const initialStateRef = React.useRef<ReturnType<typeof getCurrentState> | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Initialize snapshot on mount
    useEffect(() => {
        initialStateRef.current = getCurrentState();
        setHasUnsavedChanges(false);
    }, []); // Run ONCE on mount

    // Check dirty status against the SNAPSHOT
    useEffect(() => {
        if (!initialStateRef.current) return;

        const currentState = getCurrentState();
        const initialState = initialStateRef.current;

        const isStateDirty =
            JSON.stringify(currentState) !== JSON.stringify(initialState);

        if (isStateDirty !== hasUnsavedChanges) {
            setHasUnsavedChanges(isStateDirty);
        }
    }, [
        localLayoutOrientation, localLayoutOrder, localImageFrame, localSplashButtonText,
        localContinueButtonText, localRestartButtonText, localActionButtonText, localVerbInputPlaceholder,
        localDiaryPlayerName, localGameSystemEnabled, localMaxChances, localGameShowTrackersUI,
        localGameShowSystemButton, localGameInteractionType, localSuggestionsButtonText,
        localInventoryButtonText, localDiaryButtonText, localTrackersButtonText, localSystemButtonText,
        localSaveMenuTitle, localLoadMenuTitle, localMainMenuButtonText, localViewEndingButtonText,
        localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor,
        localSplashButtonTextColor, localActionButtonColor, localActionButtonTextColor, localFocusColor,
        localChanceIconColor, localFontFamily, localGameFontSize, localChanceIcon, localChanceLossMessage,
        localChanceRestoreMessage, localChanceReturnButtonText, localGameTheme, localTextColorLight,
        localTitleColorLight, localFocusColorLight, localFrameBookColor, localFrameTradingCardColor,
        localFrameRoundedTopColor, localGameSceneNameOverlayBg, localGameSceneNameOverlayTextColor,
        localGameContinueIndicatorColor, localTitle, localLogo, localOmitSplashTitle, localSplashImage,
        localSplashContentAlignment, localSplashContentVerticalAlignment, localSplashDescription,
        localBackgroundMusic, localPositiveEndingImage, localPositiveEndingContentAlignment,
        localPositiveEndingDescription, localPositiveEndingMusic, localNegativeEndingImage,
        localNegativeEndingContentAlignment, localNegativeEndingDescription, localNegativeEndingMusic,
        localFixedVerbs, localTextAnimationType, localTextSpeed, localTextReadingFlow,
        localImageTransitionType, localImageSpeed,
        localEnableTrackers, localEnableInventory, localEnableDiary, localEnableFixedVerbs,
        localEnableChances, localEnableImages, localEnableTextControl, localInventoryCapacity,
        localInventoryMaxWeight, localDiaryAutoScroll, localDiaryAllowExport, localDiaryMaxMessages,
        localDiaryShowSceneImage, localDiaryShowPlayerAction, hasUnsavedChanges
    ]);


    const updateGameData = (updates: Partial<GameData>) => {
        Object.entries(updates).forEach(([key, value]) => {
            onUpdate(key as keyof GameData, value);
        });
    };

    const handleSave = () => {
        const updatedGameData: Partial<GameData> = {};

        if (localLayoutOrientation !== layoutOrientation) updatedGameData.gameLayoutOrientation = localLayoutOrientation;
        if (localLayoutOrder !== layoutOrder) updatedGameData.gameLayoutOrder = localLayoutOrder;
        if (localImageFrame !== imageFrame) updatedGameData.gameImageFrame = localImageFrame;
        if (localSplashButtonText !== splashButtonText) updatedGameData.gameSplashButtonText = localSplashButtonText;
        if (localContinueButtonText !== continueButtonText) updatedGameData.gameContinueButtonText = localContinueButtonText;
        if (localRestartButtonText !== restartButtonText) updatedGameData.gameRestartButtonText = localRestartButtonText;
        if (localActionButtonText !== actionButtonText) updatedGameData.gameActionButtonText = localActionButtonText;
        if (localVerbInputPlaceholder !== verbInputPlaceholder) updatedGameData.gameVerbInputPlaceholder = localVerbInputPlaceholder;
        if (localDiaryPlayerName !== diaryPlayerName) updatedGameData.gameDiaryPlayerName = localDiaryPlayerName;
        if (localGameSystemEnabled !== gameSystemEnabled) updatedGameData.gameSystemEnabled = localGameSystemEnabled;
        if (localMaxChances !== maxChances) updatedGameData.gameMaxChances = localMaxChances;
        if (localGameShowTrackersUI !== gameShowTrackersUI) updatedGameData.gameShowTrackersUI = localGameShowTrackersUI;
        if (localGameShowSystemButton !== gameShowSystemButton) updatedGameData.gameShowSystemButton = localGameShowSystemButton;
        if (localSuggestionsButtonText !== suggestionsButtonText) updatedGameData.gameSuggestionsButtonText = localSuggestionsButtonText;
        if (localInventoryButtonText !== inventoryButtonText) updatedGameData.gameInventoryButtonText = localInventoryButtonText;
        if (localDiaryButtonText !== diaryButtonText) updatedGameData.gameDiaryButtonText = localDiaryButtonText;
        if (localTrackersButtonText !== trackersButtonText) updatedGameData.gameTrackersButtonText = localTrackersButtonText;
        if (localSystemButtonText !== gameSystemButtonText) updatedGameData.gameSystemButtonText = localSystemButtonText;
        if (localSaveMenuTitle !== gameSaveMenuTitle) updatedGameData.gameSaveMenuTitle = localSaveMenuTitle;
        if (localLoadMenuTitle !== gameLoadMenuTitle) updatedGameData.gameLoadMenuTitle = localLoadMenuTitle;
        if (localMainMenuButtonText !== gameMainMenuButtonText) updatedGameData.gameMainMenuButtonText = localMainMenuButtonText;
        if (localViewEndingButtonText !== gameViewEndingButtonText) updatedGameData.gameViewEndingButtonText = localViewEndingButtonText;
        if (localTextColor !== textColor) updatedGameData.gameTextColor = localTextColor;
        if (localTitleColor !== titleColor) updatedGameData.gameTitleColor = localTitleColor;
        if (localSplashButtonColor !== splashButtonColor) updatedGameData.gameSplashButtonColor = localSplashButtonColor;
        if (localSplashButtonHoverColor !== splashButtonHoverColor) updatedGameData.gameSplashButtonHoverColor = localSplashButtonHoverColor;
        if (localSplashButtonTextColor !== splashButtonTextColor) updatedGameData.gameSplashButtonTextColor = localSplashButtonTextColor;
        if (localActionButtonColor !== actionButtonColor) updatedGameData.gameActionButtonColor = localActionButtonColor;
        if (localActionButtonTextColor !== actionButtonTextColor) updatedGameData.gameActionButtonTextColor = localActionButtonTextColor;
        if (localFocusColor !== focusColor) updatedGameData.gameFocusColor = localFocusColor;
        if (localChanceIconColor !== chanceIconColor) updatedGameData.gameChanceIconColor = localChanceIconColor;
        if (localFontFamily !== gameFontFamily) updatedGameData.gameFontFamily = localFontFamily;
        if (localGameFontSize !== gameFontSize) updatedGameData.gameFontSize = localGameFontSize;
        if (localChanceIcon !== chanceIcon) updatedGameData.gameChanceIcon = localChanceIcon;
        if (localChanceLossMessage !== chanceLossMessage) updatedGameData.gameChanceLossMessage = localChanceLossMessage;
        if (localChanceRestoreMessage !== chanceRestoreMessage) updatedGameData.gameChanceRestoreMessage = localChanceRestoreMessage;
        if (localChanceReturnButtonText !== chanceReturnButtonText) updatedGameData.gameChanceReturnButtonText = localChanceReturnButtonText;
        if (localGameTheme !== gameTheme) updatedGameData.gameTheme = localGameTheme;
        if (localTextColorLight !== textColorLight) updatedGameData.textColorLight = localTextColorLight;
        if (localTitleColorLight !== titleColorLight) updatedGameData.titleColorLight = localTitleColorLight;
        if (localFocusColorLight !== focusColorLight) updatedGameData.focusColorLight = localFocusColorLight;
        if (localFrameBookColor !== frameBookColor) updatedGameData.frameBookColor = localFrameBookColor;
        if (localFrameTradingCardColor !== frameTradingCardColor) updatedGameData.frameTradingCardColor = localFrameTradingCardColor;
        if (localFrameRoundedTopColor !== frameRoundedTopColor) updatedGameData.frameRoundedTopColor = localFrameRoundedTopColor;
        if (localGameSceneNameOverlayBg !== gameSceneNameOverlayBg) updatedGameData.gameSceneNameOverlayBg = localGameSceneNameOverlayBg;
        if (localGameSceneNameOverlayTextColor !== gameSceneNameOverlayTextColor) updatedGameData.gameSceneNameOverlayTextColor = localGameSceneNameOverlayTextColor;
        if (localGameContinueIndicatorColor !== gameContinueIndicatorColor) updatedGameData.gameContinueIndicatorColor = localGameContinueIndicatorColor;
        if (localTitle !== title) updatedGameData.gameTitle = localTitle;
        if (localLogo !== logo) updatedGameData.gameLogo = localLogo;
        if (localOmitSplashTitle !== omitSplashTitle) updatedGameData.gameOmitSplashTitle = localOmitSplashTitle;
        if (localSplashImage !== splashImage) updatedGameData.gameSplashImage = localSplashImage;
        if (localSplashContentAlignment !== splashContentAlignment) updatedGameData.gameSplashContentAlignment = localSplashContentAlignment;
        if (localSplashContentVerticalAlignment !== splashContentVerticalAlignment) updatedGameData.gameSplashContentVerticalAlignment = localSplashContentVerticalAlignment;
        if (localSplashDescription !== splashDescription) updatedGameData.gameSplashDescription = localSplashDescription;
        if (localBackgroundMusic !== backgroundMusic) updatedGameData.gameBackgroundMusic = localBackgroundMusic;
        if (localPositiveEndingImage !== positiveEndingImage) updatedGameData.positiveEndingImage = localPositiveEndingImage;
        if (localPositiveEndingContentAlignment !== positiveEndingContentAlignment) updatedGameData.positiveEndingContentAlignment = localPositiveEndingContentAlignment;
        if (localPositiveEndingDescription !== positiveEndingDescription) updatedGameData.positiveEndingDescription = localPositiveEndingDescription;
        if (localPositiveEndingMusic !== positiveEndingMusic) updatedGameData.positiveEndingMusic = localPositiveEndingMusic;
        if (localNegativeEndingImage !== negativeEndingImage) updatedGameData.negativeEndingImage = localNegativeEndingImage;
        if (localNegativeEndingContentAlignment !== negativeEndingContentAlignment) updatedGameData.negativeEndingContentAlignment = localNegativeEndingContentAlignment;
        if (localNegativeEndingDescription !== negativeEndingDescription) updatedGameData.negativeEndingDescription = localNegativeEndingDescription;
        if (localNegativeEndingMusic !== negativeEndingMusic) updatedGameData.negativeEndingMusic = localNegativeEndingMusic;
        if (JSON.stringify(localFixedVerbs) !== JSON.stringify(fixedVerbs)) updatedGameData.fixedVerbs = localFixedVerbs;
        if (localTextAnimationType !== textAnimationType) updatedGameData.gameTextAnimationType = localTextAnimationType;
        if (localTextSpeed !== textSpeed) updatedGameData.gameTextSpeed = localTextSpeed;
        if (localImageTransitionType !== imageTransitionType) updatedGameData.gameImageTransitionType = localImageTransitionType;
        if (localImageSpeed !== imageSpeed) updatedGameData.gameImageSpeed = localImageSpeed;
        if (localEnableImages !== (enableImages ?? true)) updatedGameData.enableImages = localEnableImages;
        if (localEnableTextControl !== (enableTextControl ?? true)) updatedGameData.enableTextControl = localEnableTextControl;
        if (localTextReadingFlow !== (textReadingFlow || 'paused')) updatedGameData.gameTextReadingFlow = localTextReadingFlow;
        if (localGameInteractionType !== (gameInteractionType || 'parser')) updatedGameData.gameInteractionType = localGameInteractionType;

        // Sync new systems
        if (localEnableTrackers !== (enableTrackers ?? (gameSystemEnabled === 'trackers'))) updatedGameData.enableTrackers = localEnableTrackers;
        if (localEnableInventory !== (enableInventory ?? true)) updatedGameData.enableInventory = localEnableInventory;
        if (localEnableDiary !== (enableDiary ?? true)) updatedGameData.enableDiary = localEnableDiary;
        if (localEnableFixedVerbs !== (enableFixedVerbs ?? (fixedVerbs && fixedVerbs.length > 0))) updatedGameData.enableFixedVerbs = localEnableFixedVerbs;
        if (localEnableChances !== (enableChances ?? (gameSystemEnabled === 'chances'))) updatedGameData.enableChances = localEnableChances;

        if (localInventoryCapacity !== (inventoryCapacity ?? 10)) updatedGameData.inventoryCapacity = localInventoryCapacity;
        if (localInventoryMaxWeight !== (inventoryMaxWeight ?? 0)) updatedGameData.inventoryMaxWeight = localInventoryMaxWeight;
        if (localDiaryAutoScroll !== (diaryAutoScroll ?? true)) updatedGameData.diaryAutoScroll = localDiaryAutoScroll;
        if (localDiaryAllowExport !== (diaryAllowExport ?? false)) updatedGameData.diaryAllowExport = localDiaryAllowExport;
        if (localDiaryMaxMessages !== (diaryMaxMessages ?? 100)) updatedGameData.diaryMaxMessages = localDiaryMaxMessages;
        if (localDiaryShowSceneImage !== (diaryShowSceneImage ?? false)) updatedGameData.diaryShowSceneImage = localDiaryShowSceneImage;
        if (localDiaryShowPlayerAction !== (diaryShowPlayerAction ?? true)) updatedGameData.diaryShowPlayerAction = localDiaryShowPlayerAction;

        updateGameData(updatedGameData);

        // Update snapshot to current state to prevent dirty flag from persisting
        initialStateRef.current = getCurrentState();
        setHasUnsavedChanges(false);
    };



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
        setLocalViewEndingButtonText(gameViewEndingButtonText || t('uiEditor.placeholders.viewEnding'));
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
        setLocalFrameBookColor(frameBookColor);
        setLocalFrameTradingCardColor(frameTradingCardColor);
        setLocalFrameRoundedTopColor(frameRoundedTopColor);
        setLocalGameSceneNameOverlayBg(gameSceneNameOverlayBg);
        setLocalGameSceneNameOverlayTextColor(gameSceneNameOverlayTextColor);
        setLocalGameContinueIndicatorColor(gameContinueIndicatorColor);
        setLocalTitle(title);
        setLocalLogo(logo);
        setLocalOmitSplashTitle(omitSplashTitle);
        setLocalSplashImage(splashImage);
        setLocalSplashContentAlignment(splashContentAlignment);
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

        initialStateRef.current = getCurrentState();
        setHasUnsavedChanges(false);
    };

    const handleThemeChange = (theme: 'dark' | 'light') => {
        setLocalGameTheme(theme);
        const newFrameColor = theme === 'dark' ? '#FFFFFF' : '#1a202c';
        setLocalFrameBookColor(newFrameColor);
        setLocalFrameTradingCardColor(newFrameColor);
        setLocalFrameRoundedTopColor(newFrameColor);
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

        const newFrameColor = localGameTheme === 'dark' ? '#FFFFFF' : '#1a202c';
        setLocalFrameBookColor(newFrameColor);
        setLocalFrameTradingCardColor(newFrameColor);
        setLocalFrameRoundedTopColor(newFrameColor);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setter(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        if (e.target) {
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setter(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        if (e.target) {
            (e.target as HTMLInputElement).value = '';
        }
    };

    const ChanceIcon: React.FC<{ type: any, color: string, className?: string }> = ({ type, color, className }) => {
        switch (type) {
            case 'heart': return <Heart fill={color} stroke="none" className={className} />;
            case 'circle': return <Circle fill={color} stroke="none" className={className} />;
            case 'cross': return <svg stroke={color} strokeWidth="4" strokeLinecap="round" viewBox="0 0 24 24" className={className} fill="none"><path d="M12 5 V19 M5 12 H19" /></svg>;
            case 'square': return <Square fill={color} stroke="none" className={className} />;
            case 'diamond': return <Diamond fill={color} stroke="none" className={className} />;
            default: return <Heart fill={color} stroke="none" className={className} />;
        }
    };

    const getFramePreviewStyles = (frame: GameData['gameImageFrame']) => {
        const panelStyles: React.CSSProperties = { boxSizing: 'border-box', overflow: 'hidden' };
        const containerStyles: React.CSSProperties = {
            backgroundColor: localGameTheme === 'dark' ? '#1a202c' : '#e2e8f0',
            color: localGameTheme === 'dark' ? '#a0aec0' : '#4a5568',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden'
        };
        let panelClass = '';
        let containerClass = '';

        switch (frame) {
            case 'rounded-top':
                panelStyles.padding = '5px';
                panelStyles.backgroundColor = localFrameRoundedTopColor || '#FFFFFF';
                panelStyles.border = 'none';
                panelStyles.borderRadius = '40px 40px 4px 4px';
                containerStyles.borderRadius = '35px 35px 0 0';
                panelClass = 'frame-preview-portal';
                containerClass = 'frame-preview-portal-container';
                break;
            case 'book-cover':
                panelStyles.padding = '5px';
                panelStyles.backgroundColor = localFrameBookColor || '#FFFFFF';
                panelStyles.border = 'none';
                panelClass = 'frame-preview-book';
                break;
            case 'trading-card':
                panelStyles.backgroundColor = localFrameTradingCardColor || '#FFFFFF';
                panelStyles.borderRadius = '12px';
                panelStyles.padding = '4px';
                containerStyles.border = 'none';
                containerStyles.borderRadius = '8px';
                panelClass = 'frame-preview-trading';
                containerClass = 'frame-preview-trading-container';
                break;
            default:
                panelStyles.border = 'none';
                panelStyles.padding = '0';
        }
        return { panelStyles, containerStyles, panelClass, containerClass };
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header with Save/Undo actions */}
            <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-muted-foreground/10">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-foreground tracking-tight">UI Editor</h2>
                    <p className="text-xs text-muted-foreground">{t('uiEditor.messages.personalizeInterface')}</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasUnsavedChanges && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-1">
                                <TriangleAlert className="w-3 h-3" /> {t('uiEditor.messages.unsavedChanges')}
                            </span>
                            <button
                                onClick={handleUndo}
                                className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
                                title={t('uiEditor.messages.undo')}
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!hasUnsavedChanges}
                        className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm
                        ${hasUnsavedChanges
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:scale-105'
                                : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'}
                    `}
                    >
                        <Save className="w-3.5 h-3.5" />
                        {t('uiEditor.messages.saveChanges')}
                    </button>
                </div>
            </div>
            <div>
                <div className="border-b border-muted-foreground/50 flex items-center justify-between pr-4">
                    <div className="flex space-x-1 overflow-x-auto">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-4 flex items-center gap-2 ${activeTab === tab.id
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" /> {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={`bg-muted/10 -mt-px py-8 grid grid-cols-1 ${activeTab === 'cores' ? 'xl:grid-cols-[1fr_450px]' : ''} gap-8 items-start px-6`}>
                    {activeTab === 'aparencia' && (
                        <div className="space-y-6">
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                                    <div className="space-y-8 col-span-1">
                                        <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">{t('uiEditor.sections.splashScreen')}</h3>
                                        <div className="space-y-8">
                                            <div>
                                                <label htmlFor="splashContentAlignment" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.contentAlignment')}</label>
                                                <select
                                                    id="splashContentAlignment"
                                                    value={localSplashContentAlignment}
                                                    onChange={(e) => setLocalSplashContentAlignment(e.target.value as 'left' | 'right')}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all [&>option]:bg-zinc-950 shadow-lg"
                                                >
                                                    <option value="right">{t('uiEditor.options.right')}</option>
                                                    <option value="left">{t('uiEditor.options.left')}</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center group cursor-pointer" onClick={() => setLocalOmitSplashTitle(!localOmitSplashTitle)}>
                                                <input
                                                    type="checkbox"
                                                    id="omitSplashTitle"
                                                    checked={localOmitSplashTitle}
                                                    onChange={(e) => setLocalOmitSplashTitle(e.target.checked)}
                                                    className="custom-checkbox"
                                                />
                                                <label htmlFor="omitSplashTitle" className="ml-2 text-[11px] text-muted-foreground group-hover:text-foreground cursor-pointer select-none transition-colors">{t('uiEditor.labels.omitTitleDescription')}</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 col-span-1 md:mt-0">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">{t('uiEditor.labels.preview')}</p>
                                        <div className="bg-card border border-muted-foreground/50 rounded-2xl p-4 flex items-center justify-center shadow-inner h-fit aspect-video">
                                            <div
                                                className="relative w-full max-w-full aspect-video bg-muted border border-muted-foreground/50 rounded-xl flex shadow-2xl overflow-hidden"
                                                style={{
                                                    justifyContent: localSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end',
                                                    alignItems: 'flex-end'
                                                }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center -translate-y-4">
                                                    <div className="text-secondary-foreground font-black text-[8px] uppercase tracking-[0.2em] border-2 border-secondary-foreground/20 px-3 py-1 rounded">{t('uiEditor.labels.backgroundImage')}</div>
                                                </div>
                                                {!localOmitSplashTitle && (
                                                    <div
                                                        className="w-2/3 h-1/3 m-6 bg-primary/5 backdrop-blur-sm border border-primary/20 rounded-lg flex items-center justify-center text-center text-[8px] p-2 text-primary font-bold uppercase tracking-widest shadow-xl"
                                                    >
                                                        {t('uiEditor.labels.titleDescription')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-800/50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                                    <div className="space-y-8 col-span-1">
                                        <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">{t('uiEditor.sections.gameLayout')}</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="orientation-select" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.orientation')}</label>
                                                <select
                                                    id="orientation-select"
                                                    value={localLayoutOrientation}
                                                    onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all [&>option]:bg-zinc-950"
                                                >
                                                    <option value="vertical">{t('uiEditor.options.vertical')}</option>
                                                    <option value="horizontal">{t('uiEditor.options.horizontal')}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="order-select" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.imagePosition')}</label>
                                                <select
                                                    id="order-select"
                                                    value={localLayoutOrder}
                                                    onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all [&>option]:bg-zinc-950"
                                                >
                                                    <option value="image-first">{localLayoutOrientation === 'vertical' ? t('uiEditor.options.left') : t('uiEditor.options.above')}</option>
                                                    <option value="image-last">{localLayoutOrientation === 'vertical' ? t('uiEditor.options.right') : t('uiEditor.options.below')}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="frame-select" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.frameType')}</label>
                                                <select
                                                    id="frame-select"
                                                    value={localImageFrame}
                                                    onChange={(e) => setLocalImageFrame(e.target.value as GameData['gameImageFrame'])}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all [&>option]:bg-zinc-950"
                                                >
                                                    <option value="none">{t('uiEditor.options.noFrame')}</option>
                                                    <option value="rounded-top">{t('uiEditor.options.portal')}</option>
                                                    <option value="book-cover">{t('uiEditor.options.square')}</option>
                                                    <option value="trading-card">{t('uiEditor.options.rounded')}</option>
                                                </select>
                                            </div>
                                            <div>
                                                {localImageFrame === 'rounded-top' && (
                                                    <ColorInput label={t('uiEditor.labels.frameColor')} id="frameRoundedTopColor" value={localFrameRoundedTopColor} onChange={setLocalFrameRoundedTopColor} placeholder="#FFFFFF" />
                                                )}
                                                {localImageFrame === 'book-cover' && (
                                                    <ColorInput label={t('uiEditor.labels.frameColor')} id="frameBookColor" value={localFrameBookColor} onChange={setLocalFrameBookColor} placeholder="#FFFFFF" />
                                                )}
                                                {localImageFrame === 'trading-card' && (
                                                    <ColorInput label={t('uiEditor.labels.frameColor')} id="frameTradingCardColor" value={localFrameTradingCardColor} onChange={setLocalFrameTradingCardColor} placeholder="#FFFFFF" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col col-span-1 md:mt-0">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">{t('uiEditor.labels.layoutPreview')}</p>
                                        <div className="bg-card border border-muted-foreground/50 rounded-2xl p-4 flex items-center justify-center h-fit aspect-video shadow-inner">
                                            <div
                                                className="w-full max-w-[400px] aspect-video border border-muted-foreground/50 bg-muted rounded-xl flex p-3 gap-3 transition-all shadow-2xl overflow-hidden"
                                                style={{ flexDirection: localLayoutOrientation === 'horizontal' ? 'column' : 'row' }}
                                            >
                                                <div
                                                    className={`flex items-center justify-center ${localLayoutOrder === 'image-first' ? 'order-1' : 'order-2'} transition-all duration-300 ${localLayoutOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full'}`}
                                                    style={getFramePreviewStyles(localImageFrame).panelStyles}
                                                >
                                                    <div
                                                        className={`flex-1 w-full h-full rounded-lg flex items-center justify-center text-center text-[7px] p-2 font-black uppercase tracking-[0.2em] text-muted-foreground border border-muted-foreground/50 bg-card shadow-inner`}
                                                        style={{
                                                            ...getFramePreviewStyles(localImageFrame).containerStyles,
                                                            backgroundColor: undefined
                                                        }}
                                                    >
                                                        {t('uiEditor.labels.photo')}
                                                    </div>
                                                </div>
                                                <div className={`flex-1 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-center text-center text-[7px] p-2 text-primary font-black uppercase tracking-[0.2em] shadow-lg ${localLayoutOrder === 'image-first' ? 'order-2' : 'order-1'} ${localLayoutOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full'}`}>
                                                    {t('uiEditor.labels.text')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sistemas' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
                                    <Grid className="w-4 h-4 text-muted-foreground" /> {t('uiEditor.sections.activeSystems')}
                                </h3>
                                <p className="text-xs text-muted-foreground mb-6 max-w-2xl">
                                    {t('uiEditor.messages.enableConfigureSystems')}
                                </p>

                                {/* --- BENTO BOX LAYOUT: FULL WIDTH HEADER + 2 INDEPENDENT COLUMNS + FOOTER --- */}
                                <div className="space-y-6">

                                    {/* --- ROW 1: GAME STYLE (Full Width) --- */}
                                    <div className={`w-full p-6 bg-card border ${localGameInteractionType ? 'border-primary/30 ring-1 ring-primary/10' : 'border-muted-foreground/50'} rounded-2xl transition-all hover:shadow-lg group shadow-sm flex flex-col`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-xl transition-colors bg-primary text-primary-foreground shadow-md`}>
                                                    <LayoutTemplate className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="space-y-4">
                                                        <div className="space-y-3">
                                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('uiEditor.labels.gameStyle')}</label>
                                                            <p className="text-[10px] text-muted-foreground mb-3">{t('uiEditor.labels.gameStyleDesc')}</p>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                <button
                                                                    onClick={() => setLocalGameInteractionType('parser')}
                                                                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${localGameInteractionType === 'parser' ? 'bg-primary/10 border-primary ring-1 ring-primary/20' : 'bg-muted/30 border-muted-foreground/30 hover:bg-muted/50'}`}
                                                                >
                                                                    <TerminalSquare className={`w-5 h-5 mt-0.5 ${localGameInteractionType === 'parser' ? 'text-primary' : 'text-muted-foreground'}`} />
                                                                    <div>
                                                                        <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${localGameInteractionType === 'parser' ? 'text-primary' : 'text-foreground'}`}>{t('uiEditor.labels.parser')}</span>
                                                                        <span className="text-[10px] text-muted-foreground leading-relaxed">{t('uiEditor.labels.parserDesc')}</span>
                                                                    </div>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setLocalGameInteractionType('choice');
                                                                        setLocalEnableInventory(false);
                                                                    }}
                                                                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${localGameInteractionType === 'choice' ? 'bg-primary/10 border-primary ring-1 ring-primary/20' : 'bg-muted/30 border-muted-foreground/30 hover:bg-muted/50'}`}
                                                                >
                                                                    <MousePointerClick className={`w-5 h-5 mt-0.5 ${localGameInteractionType === 'choice' ? 'text-primary' : 'text-muted-foreground'}`} />
                                                                    <div>
                                                                        <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${localGameInteractionType === 'choice' ? 'text-primary' : 'text-foreground'}`}>{t('uiEditor.labels.choice')}</span>
                                                                        <span className="text-[10px] text-muted-foreground leading-relaxed">{t('uiEditor.labels.choiceDesc')}</span>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        onClick={() => setLocalGameInteractionType('parser')}
                                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${localGameInteractionType === 'parser' ? 'border-primary bg-primary/5 text-primary' : 'border-muted-foreground/20 bg-zinc-900 text-muted-foreground hover:border-primary/30'}`}
                                                    >
                                                        <div className={`p-3 rounded-lg ${localGameInteractionType === 'parser' ? 'bg-primary/20' : 'bg-black/40'}`}>
                                                            <Type className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold uppercase block">{t('uiEditor.options.parserDescribeCommands')}</span>
                                                            <span className="text-[10px] opacity-70 mt-0.5">{t('uiEditor.messages.playerTypesActions')}</span>
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setLocalGameInteractionType('choice');
                                                            setLocalEnableInventory(false);
                                                        }}
                                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${localGameInteractionType === 'choice' ? 'border-primary bg-primary/5 text-primary' : 'border-muted-foreground/20 bg-zinc-900 text-muted-foreground hover:border-primary/30'}`}
                                                    >
                                                        <div className={`p-3 rounded-lg ${localGameInteractionType === 'choice' ? 'bg-primary/20' : 'bg-black/40'}`}>
                                                            <List className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold uppercase block">{t('uiEditor.options.ifChooseOption')}</span>
                                                            <span className="text-[10px] opacity-70 mt-0.5">{t('uiEditor.messages.playerChoosesOptions')}</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                                {/* --- LEFT COLUMN --- */}
                                                <div className="flex-1 w-full space-y-6">
                                                    {/* INVENTORY */}
                                                    <div className="w-full">
                                                        <div className={`w-full p-6 bg-card border ${localEnableInventory ? 'border-primary/30 ring-1 ring-primary/10' : 'border-muted-foreground/50'} rounded-2xl transition-all hover:shadow-lg group shadow-sm flex flex-col`}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2.5 rounded-xl transition-colors ${localEnableInventory ? 'bg-primary text-primary-foreground shadow-md' : 'bg-zinc-900 text-muted-foreground'}`}>
                                                                        <Package className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`text-sm font-bold uppercase tracking-wide transition-colors ${localEnableInventory ? 'text-foreground' : 'text-muted-foreground'}`}>{t('uiEditor.labels.inventory')}</h4>
                                                                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('uiEditor.messages.itemManagement')}</p>
                                                                    </div>
                                                                </div>
                                                                <label className={`relative inline-flex items-center ${localGameInteractionType === 'choice' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={localEnableInventory}
                                                                        onChange={(e) => setLocalEnableInventory(e.target.checked)}
                                                                        disabled={localGameInteractionType === 'choice'}
                                                                        className="sr-only peer"
                                                                    />
                                                                    <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                                                        <div className="absolute top-1 left-1 bg-foreground w-3 h-3 rounded-[2px] shadow-sm transition-all peer-checked:bg-white" style={{ transform: localEnableInventory ? 'translateX(16px)' : 'translateX(0)' }}></div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* TEXT CONTROL */}
                                                    <div className="w-full">
                                                        <div className={`w-full p-6 bg-card border ${localEnableTextControl ? 'border-primary/30 ring-1 ring-primary/10' : 'border-muted-foreground/50'} rounded-2xl transition-all hover:shadow-lg group shadow-sm flex flex-col gap-6`}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2.5 rounded-xl transition-colors ${localEnableTextControl ? 'bg-primary text-primary-foreground shadow-md' : 'bg-zinc-900 text-muted-foreground'}`}>
                                                                        <Type className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`text-sm font-bold uppercase tracking-wide transition-colors ${localEnableTextControl ? 'text-foreground' : 'text-muted-foreground'}`}>{t('uiEditor.labels.textControl')}</h4>
                                                                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('uiEditor.messages.animationSceneDescription')}</p>
                                                                    </div>
                                                                </div>
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input type="checkbox" checked={localEnableTextControl} onChange={(e) => setLocalEnableTextControl(e.target.checked)} className="sr-only peer" />
                                                                    <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                                                        <div className="absolute top-1 left-1 bg-foreground w-3 h-3 rounded-[2px] shadow-sm transition-all peer-checked:bg-white" style={{ transform: localEnableTextControl ? 'translateX(16px)' : 'translateX(0)' }}></div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            {localEnableTextControl && (
                                                                <div className="space-y-4 pt-4 border-t border-muted-foreground/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <label htmlFor="textAnimationType" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.animationStyle')}</label>
                                                                            <select
                                                                                id="textAnimationType"
                                                                                value={localTextAnimationType}
                                                                                onChange={(e) => setLocalTextAnimationType(e.target.value as 'fade' | 'typewriter')}
                                                                                className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                                            >
                                                                                <option value="fade">{t('uiEditor.options.fadeIn')}</option>
                                                                                <option value="typewriter">{t('uiEditor.options.typewriter')}</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <label htmlFor="textReadingFlow" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.readingFlow')}</label>
                                                                            <select
                                                                                id="textReadingFlow"
                                                                                value={localTextReadingFlow}
                                                                                onChange={(e) => setLocalTextReadingFlow(e.target.value as 'continuous' | 'paused')}
                                                                                className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                                            >
                                                                                <option value="paused">{t('uiEditor.options.pausedByParagraph')}</option>
                                                                                <option value="continuous">{t('uiEditor.options.continuousFullText')}</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.speed')}</label>
                                                                        <div className="flex items-center gap-4">
                                                                            <input
                                                                                type="range"
                                                                                min="1"
                                                                                max="5"
                                                                                value={localTextSpeed}
                                                                                onChange={(e) => setLocalTextSpeed(parseInt(e.target.value, 10))}
                                                                                className="flex-grow h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-primary"
                                                                            />
                                                                            <span className="text-xl font-mono font-bold w-6 text-center">{localTextSpeed}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* LIFE SYSTEM */}
                                                    <div className="w-full">
                                                        <div className={`w-full p-6 bg-card border ${localEnableChances ? 'border-primary/30 ring-1 ring-primary/10' : 'border-muted-foreground/50'} rounded-2xl transition-all hover:shadow-lg group shadow-sm flex flex-col gap-4`}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2.5 rounded-xl transition-colors ${localEnableChances ? 'bg-primary text-primary-foreground shadow-md' : 'bg-zinc-900 text-muted-foreground'}`}>
                                                                        <Heart className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`text-sm font-bold uppercase tracking-wide transition-colors ${localEnableChances ? 'text-foreground' : 'text-muted-foreground'}`}>{t('uiEditor.sections.lifeSystem')}</h4>
                                                                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('uiEditor.sections.lifeSystemDesc')}</p>
                                                                    </div>
                                                                </div>
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input type="checkbox" checked={localEnableChances} onChange={(e) => setLocalEnableChances(e.target.checked)} className="sr-only peer" />
                                                                    <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                                                        <div className="absolute top-1 left-1 bg-foreground w-3 h-3 rounded-[2px] shadow-sm transition-all peer-checked:bg-white" style={{ transform: localEnableChances ? 'translateX(16px)' : 'translateX(0)' }}></div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            {localEnableChances && (
                                                                <div className="space-y-4 pt-4 border-t border-muted-foreground/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                    <div className="flex items-end gap-3 w-full">
                                                                        <div className="space-y-1 flex-1 min-w-0">
                                                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('uiEditor.labels.icon')}</label>
                                                                            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-muted-foreground/50 h-9 w-full">
                                                                                {['heart', 'circle', 'diamond', 'cross'].map((icon) => (
                                                                                    <button
                                                                                        key={icon}
                                                                                        onClick={() => setLocalChanceIcon(icon as any)}
                                                                                        className={`flex-1 h-full flex items-center justify-center rounded-md transition-all ${localChanceIcon === icon ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                                                                        title={icon}
                                                                                    >
                                                                                        <ChanceIcon type={icon as any} color={localChanceIcon === icon ? '#ffffff' : 'currentColor'} className="w-4 h-4" />
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1 flex-1 min-w-0">
                                                                            <label htmlFor="chanceColor" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('uiEditor.labels.color')}</label>
                                                                            <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-muted-foreground/50 rounded-lg focus-within:border-primary/50 transition-all h-9 w-full">
                                                                                <input
                                                                                    type="color"
                                                                                    id="chanceColor-picker"
                                                                                    value={localChanceIconColor}
                                                                                    onChange={(e) => setLocalChanceIconColor(e.target.value)}
                                                                                    className="w-8 h-full p-0 border-none rounded cursor-pointer bg-transparent shrink-0"
                                                                                    aria-label="Seletor de cor"
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    id="chanceColor"
                                                                                    value={localChanceIconColor}
                                                                                    onChange={(e) => setLocalChanceIconColor(e.target.value)}
                                                                                    className="w-full bg-transparent font-mono text-xs text-foreground focus:outline-none focus:ring-0 uppercase truncate"
                                                                                    placeholder="#FF0000"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1 w-20 shrink-0">
                                                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('uiEditor.labels.lives')}</label>
                                                                            <input
                                                                                type="number"
                                                                                value={localMaxChances}
                                                                                onChange={(e) => setLocalMaxChances(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                                                                                min="1"
                                                                                max="10"
                                                                                className="w-full h-9 bg-zinc-950 border border-muted-foreground/50 rounded-lg px-2 text-sm font-bold text-center text-zinc-300 focus:ring-1 focus:ring-primary/50 transition-all"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* --- RIGHT COLUMN --- */}
                                                <div className="flex-1 w-full space-y-6">
                                                    {/* DIARY */}
                                                    <div className="w-full">
                                                        <div className={`w-full p-6 bg-card border ${localEnableDiary ? 'border-primary/30 ring-1 ring-primary/10' : 'border-muted-foreground/50'} rounded-2xl transition-all hover:shadow-lg group shadow-sm flex flex-col gap-6`}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2.5 rounded-xl transition-colors ${localEnableDiary ? 'bg-primary text-primary-foreground shadow-md' : 'bg-zinc-900 text-muted-foreground'}`}>
                                                                        <Book className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`text-sm font-bold uppercase tracking-wide transition-colors ${localEnableDiary ? 'text-foreground' : 'text-muted-foreground'}`}>{t('uiEditor.sections.diary')}</h4>
                                                                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('uiEditor.sections.diaryDesc')}</p>
                                                                    </div>
                                                                </div>
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input type="checkbox" checked={localEnableDiary} onChange={(e) => setLocalEnableDiary(e.target.checked)} className="sr-only peer" />
                                                                    <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                                                        <div className="absolute top-1 left-1 bg-foreground w-3 h-3 rounded-[2px] shadow-sm transition-all peer-checked:bg-white" style={{ transform: localEnableDiary ? 'translateX(16px)' : 'translateX(0)' }}></div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            {localEnableDiary && (
                                                                <div className="space-y-4 pt-4 border-t border-muted-foreground/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-muted-foreground/50">
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[11px] text-muted-foreground font-medium">{t('uiEditor.labels.hideTitleDesc')}</span>
                                                                            </div>
                                                                            <input type="checkbox" checked={localDiaryShowSceneImage} onChange={(e) => setLocalDiaryShowSceneImage(e.target.checked)} className="custom-checkbox" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-muted-foreground/50">
                                                                        <span className="text-[11px] text-muted-foreground">{t('uiEditor.labels.showPlayerAction')}</span>
                                                                        <input type="checkbox" checked={localDiaryShowPlayerAction} onChange={(e) => setLocalDiaryShowPlayerAction(e.target.checked)} className="custom-checkbox" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* IMAGES */}
                                                    <div className="w-full">
                                                        <div className={`w-full p-6 bg-card border ${localEnableImages ? 'border-primary/30 ring-1 ring-primary/10' : 'border-muted-foreground/50'} rounded-2xl transition-all hover:shadow-lg group shadow-sm flex flex-col gap-6`}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2.5 rounded-xl transition-colors ${localEnableImages ? 'bg-primary text-primary-foreground shadow-md' : 'bg-zinc-900 text-muted-foreground'}`}>
                                                                        <ImageIcon className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`text-sm font-bold uppercase tracking-wide transition-colors ${localEnableImages ? 'text-foreground' : 'text-muted-foreground'}`}>{t('uiEditor.sections.sceneImages')}</h4>
                                                                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('uiEditor.sections.sceneImagesDesc')}</p>
                                                                    </div>
                                                                </div>
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input type="checkbox" checked={localEnableImages} onChange={(e) => setLocalEnableImages(e.target.checked)} className="sr-only peer" />
                                                                    <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                                                        <div className="absolute top-1 left-1 bg-foreground w-3 h-3 rounded-[2px] shadow-sm transition-all peer-checked:bg-white" style={{ transform: localEnableImages ? 'translateX(16px)' : 'translateX(0)' }}></div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            {localEnableImages && (
                                                                <div className="space-y-4 pt-4 border-t border-muted-foreground/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                    <div className="space-y-2">
                                                                        <label htmlFor="imageTransitionType" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.imageTransition')}</label>
                                                                        <select
                                                                            id="imageTransitionType"
                                                                            value={localImageTransitionType}
                                                                            onChange={(e) => setLocalImageTransitionType(e.target.value as any)}
                                                                            className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                                        >
                                                                            <option value="fade">{t('uiEditor.options.fade')}</option>
                                                                            <option value="slide">{t('uiEditor.options.slide')}</option>
                                                                            <option value="none">{t('uiEditor.options.none')}</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.speed')}</label>
                                                                        <div className="flex items-center gap-4">
                                                                            <input
                                                                                type="range"
                                                                                min="0.1"
                                                                                max="3"
                                                                                step="0.1"
                                                                                value={localImageSpeed}
                                                                                onChange={(e) => setLocalImageSpeed(parseFloat(e.target.value))}
                                                                                className="flex-grow h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-primary"
                                                                            />
                                                                            <span className="text-xl font-mono font-bold w-6 text-center">{localImageSpeed}s</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* TRACKERS */}
                                                    <div className="w-full">
                                                        <div className={`w-full p-6 bg-card border ${localEnableTrackers ? 'border-primary/30 ring-1 ring-primary/10' : 'border-muted-foreground/50'} rounded-2xl transition-all hover:shadow-lg group shadow-sm flex flex-col gap-4`}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2.5 rounded-xl transition-colors ${localEnableTrackers ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}`}>
                                                                        <SlidersHorizontal className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`text-sm font-bold uppercase tracking-wide transition-colors ${localEnableTrackers ? 'text-foreground' : 'text-muted-foreground'}`}>{t('uiEditor.sections.trackers')}</h4>
                                                                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('uiEditor.sections.trackersDesc')}</p>
                                                                    </div>
                                                                </div>
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input type="checkbox" checked={localEnableTrackers} onChange={(e) => setLocalEnableTrackers(e.target.checked)} className="sr-only peer" />
                                                                    <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                                                        <div className="absolute top-1 left-1 bg-foreground w-3 h-3 rounded-[2px] shadow-sm transition-all peer-checked:bg-white" style={{ transform: localEnableTrackers ? 'translateX(16px)' : 'translateX(0)' }}></div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            {localEnableTrackers && (
                                                                <div className="space-y-4 pt-4 border-t border-muted-foreground/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                                        {t('uiEditor.messages.trackersExplanation')}
                                                                    </p>
                                                                    <button
                                                                        onClick={() => props.onNavigateToTrackers?.()}
                                                                        className="w-full py-3 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 flex items-center justify-center gap-2"
                                                                    >
                                                                        <SlidersHorizontal className="w-4 h-4" /> {t('uiEditor.labels.configureTrackers')}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}



                    {false /* abertura moved to Vignettes, activeTab === 'abertura' */ && (
                        <div className="space-y-4"><div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* LEFT COLUMN: Texts & Audio */}
                            <div className="flex flex-col h-full gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="gameTitle" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Título do Jogo</label>
                                    <input
                                        type="text"
                                        id="gameTitle"
                                        value={localTitle}
                                        onChange={(e) => setLocalTitle(e.target.value)}
                                        className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 focus:border-primary/50 transition-all font-bold placeholder:text-muted-foreground"
                                        placeholder="Ex: A Masmorra Esquecida"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 flex-1 h-full">
                                    <label htmlFor="splashDescription" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Descrição do Jogo</label>
                                    <textarea
                                        id="splashDescription"
                                        value={localSplashDescription}
                                        onChange={(e) => setLocalSplashDescription(e.target.value)}
                                        className="w-full flex-1 bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 focus:border-primary/50 transition-all resize-none leading-relaxed placeholder:text-muted-foreground h-full"
                                        placeholder="Uma breve descrição da sua aventura..."
                                    />
                                </div>
                            </div>




                            {/* RIGHT COLUMN: Preview & Image Settings */}
                            <div className="flex flex-col h-full gap-2">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Imagem de Fundo</label>
                                <div className="relative w-full aspect-video bg-black/50 border border-muted-foreground/50 rounded-xl overflow-hidden shadow-2xl group flex-shrink-0">
                                    {/* Background Image Layer */}
                                    {localSplashImage ? (
                                        <div className="absolute inset-0 w-full h-full">
                                            <img src={localSplashImage} alt="Fundo" className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-start justify-start p-4 bg-muted/10">
                                            <ImageIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-bold">Sem imagem de fundo</p>
                                        </div>
                                    )}

                                    {/* Upload Overlay (Hover) */}
                                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all gap-3 backdrop-blur-sm">
                                        <label className="p-3 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-all shadow-xl active:scale-95 transform hover:-translate-y-1">
                                            <Upload className="w-5 h-5" />
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalSplashImage)} className="hidden" />
                                        </label>
                                        {localSplashImage && (
                                            <button onClick={() => setLocalSplashImage('')} className="p-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95 transform hover:-translate-y-1">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Content Preview Overlay */}
                                    {!localOmitSplashTitle && (
                                        <div
                                            className={`absolute inset-0 z-20 p-8 flex flex-col pointer-events-none transition-all duration-300
                                                ${localSplashContentVerticalAlignment === 'top' ? 'justify-start' : 'justify-end'}
                                                ${localSplashContentAlignment === 'right' ? 'items-end text-right' : 'items-start text-left'}
                                            `}
                                            style={{ fontFamily: localFontFamily }}
                                        >
                                            <div className={`max-w-[70%] space-y-3 flex flex-col ${localSplashContentAlignment === 'right' ? 'items-end' : 'items-start'}`}>
                                                <h1 className="text-lg font-black uppercase tracking-tight drop-shadow-lg" style={{ color: localTitleColor }}>
                                                    {localTitle || "Título do Jogo"}
                                                </h1>
                                                <p className="text-[9px] text-white/90 leading-relaxed line-clamp-3 drop-shadow-md font-medium">
                                                    {localSplashDescription || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                                                </p>
                                                <div className="pt-2">
                                                    <span className="px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded shadow-lg block hover:scale-105 transition-transform" style={{ backgroundColor: localSplashButtonColor, color: localSplashButtonTextColor }}>
                                                        {localSplashButtonText || "COMEÇAR"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1 pt-2 w-full flex flex-col items-center text-center">
                                    <p className="text-[10px] text-muted-foreground font-medium italic">Recomendado: Full HD (1920x1080), proporção 16:9.</p>

                                </div>
                            </div>
                        </div>
                            {/* LOWER SECTION: Soundtrack & Controls */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-0">
                                {/* Left: Soundtrack */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trilha Sonora Inicial</h4>
                                    <div className="flex items-center gap-3">
                                        <label className="flex-grow flex items-center justify-center px-4 py-3 bg-muted border border-muted-foreground/50 text-foreground font-bold rounded-lg hover:bg-muted/80 hover:text-foreground transition-all cursor-pointer text-[10px] uppercase tracking-widest shadow-lg group">
                                            <Upload className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" /> {localBackgroundMusic ? 'Alterar Música' : 'Carregar Música (.mp3)'}
                                            <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={(e) => handleAudioUpload(e, setLocalBackgroundMusic)} className="hidden" />
                                        </label>
                                        {localBackgroundMusic && (
                                            <button
                                                onClick={() => setLocalBackgroundMusic('')}
                                                className="p-3 bg-red-500/5 text-muted-foreground rounded-lg border border-muted-foreground/50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-lg"
                                                title="Remover Música"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium italic">Esta trilha começará a tocar assim que a tela de início for carregada.</p>
                                </div>

                                {/* Right: Controls */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="splashContentAlignment" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Posicionamento do Conteúdo</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <select
                                                id="splashContentAlignment"
                                                value={localSplashContentAlignment}
                                                onChange={(e) => setLocalSplashContentAlignment(e.target.value as 'left' | 'right')}
                                                className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all [&>option]:bg-zinc-950 shadow-lg"
                                            >
                                                <option value="right">Direita</option>
                                                <option value="left">Esquerda</option>
                                            </select>
                                            <select
                                                id="splashContentVerticalAlignment"
                                                value={localSplashContentVerticalAlignment}
                                                onChange={(e) => setLocalSplashContentVerticalAlignment(e.target.value as 'top' | 'bottom')}
                                                className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all [&>option]:bg-zinc-950 shadow-lg"
                                            >
                                                <option value="bottom">Inferior</option>
                                                <option value="top">Superior</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                                            <input
                                                type="checkbox"
                                                checked={localOmitSplashTitle}
                                                onChange={() => setLocalOmitSplashTitle(!localOmitSplashTitle)}
                                                className="custom-checkbox"
                                            />
                                            <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">Ocultar título e descrição</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    )}


                    {
                        activeTab === 'textos' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">{t('uiEditor.sections.interfaceTexts')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="actionButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.actionButtonText')}</label>
                                            <input type="text" id="actionButtonText" value={localActionButtonText} onChange={(e) => setLocalActionButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="verbInputPlaceholder" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.commandFieldText')}</label>
                                            <input type="text" id="verbInputPlaceholder" value={localVerbInputPlaceholder} onChange={(e) => setLocalVerbInputPlaceholder(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="viewEndingButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.viewEndingButtonText')}</label>
                                            <input type="text" id="viewEndingButtonText" value={localViewEndingButtonText} onChange={(e) => setLocalViewEndingButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg placeholder:text-muted-foreground" placeholder={t('uiEditor.placeholders.viewEnding')} />
                                            <p className="text-[10px] text-muted-foreground mt-2 italic">{t('uiEditor.messages.viewEndingTextHelp')}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="diaryPlayerName" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.diaryPlayerName')}</label>
                                            <input type="text" id="diaryPlayerName" value={localDiaryPlayerName} onChange={(e) => setLocalDiaryPlayerName(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="splashButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.startButtonText')}</label>
                                            <input type="text" id="splashButtonText" value={localSplashButtonText} onChange={(e) => setLocalSplashButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder={t('uiEditor.placeholders.start')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="continueButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.continueButtonText')}</label>
                                            <input type="text" id="continueButtonText" value={localContinueButtonText} onChange={(e) => setLocalContinueButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder={t('uiEditor.placeholders.continueAdventure')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="restartButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.restartButtonText')}</label>
                                            <input type="text" id="restartButtonText" value={localRestartButtonText} onChange={(e) => setLocalRestartButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder={t('uiEditor.placeholders.restartAdventure')} />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-muted-foreground/50">
                                    <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">{t('uiEditor.sections.navButtons')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="suggestionsButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.suggestionsButton')}</label>
                                            <input type="text" id="suggestionsButtonText" value={localSuggestionsButtonText} onChange={e => setLocalSuggestionsButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="inventoryButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.inventoryButton')}</label>
                                            <input type="text" id="inventoryButtonText" value={localInventoryButtonText} onChange={e => setLocalInventoryButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="diaryButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.diaryButton')}</label>
                                            <input type="text" id="diaryButtonText" value={localDiaryButtonText} onChange={e => setLocalDiaryButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="trackersButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.trackersButton')}</label>
                                            <input type="text" id="trackersButtonText" value={localTrackersButtonText} onChange={e => setLocalTrackersButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('uiEditor.placeholders.trackers')} disabled={localGameSystemEnabled !== 'trackers'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="systemButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.systemMenuButton')}</label>
                                            <input type="text" id="systemButtonText" value={localSystemButtonText} onChange={e => setLocalSystemButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder={t('uiEditor.placeholders.system')} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="mainMenuButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('uiEditor.labels.mainMenuButton')}</label>
                                            <input type="text" id="mainMenuButtonText" value={localMainMenuButtonText} onChange={e => setLocalMainMenuButtonText(e.target.value)} className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 transition-all shadow-lg" placeholder={t('uiEditor.placeholders.mainMenu')} />
                                        </div>
                                    </div>
                                </div>


                            </div>
                        )
                    }

                    {
                        activeTab === 'aparencia' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                                {/* Left Column: Settings (Reduced width) */}
                                <div className="col-span-1 lg:col-span-5 space-y-8 pr-2 custom-scrollbar pb-20">

                                    {/* SECTION: ESTRUTURA */}
                                    <div className="bg-card border border-muted-foreground/20 rounded-xl p-6 shadow-sm">
                                        <button
                                            onClick={() => toggleSection('estrutura')}
                                            className="flex items-center justify-between w-full text-left group hover:opacity-80 transition-opacity"
                                        >
                                            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                                <LayoutTemplate className="w-4 h-4 text-muted-foreground" /> {t('uiEditor.sections.structure')}
                                            </h3>
                                            {activeSections.estrutura ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                        </button>

                                        {activeSections.estrutura && (
                                            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('uiEditor.labels.orientation')}</label>
                                                    <div className="relative">
                                                        <select
                                                            value={localLayoutOrientation}
                                                            onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="vertical">{t('uiEditor.options.vertical')}</option>
                                                            <option value="horizontal">{t('uiEditor.options.horizontal')}</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('uiEditor.labels.imagePosition')}</label>
                                                    <div className="relative">
                                                        <select
                                                            value={localLayoutOrder}
                                                            onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                                        >
                                                            {localLayoutOrientation === 'vertical' ? (
                                                                <>
                                                                    <option value="image-first">{t('uiEditor.options.left')}</option>
                                                                    <option value="image-last">{t('uiEditor.options.right')}</option>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <option value="image-first">{t('uiEditor.options.above')}</option>
                                                                    <option value="image-last">{t('uiEditor.options.below')}</option>
                                                                </>
                                                            )}
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('uiEditor.labels.frameType')}</label>
                                                    <div className="relative">
                                                        <select
                                                            value={localImageFrame}
                                                            onChange={(e) => setLocalImageFrame(e.target.value as any)}
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="none">{t('uiEditor.options.noFrame')}</option>
                                                            <option value="rounded-top">{t('uiEditor.options.portal')}</option>
                                                            <option value="book-cover">{t('uiEditor.options.square')}</option>
                                                            <option value="trading-card">{t('uiEditor.options.rounded')}</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                    {/* SECTION: ESTILO & TEMA */}
                                    <div className="bg-card border border-muted-foreground/20 rounded-xl p-6 shadow-sm">
                                        <button
                                            onClick={() => toggleSection('estilo')}
                                            className="flex items-center justify-between w-full text-left group hover:opacity-80 transition-opacity"
                                        >
                                            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Palette className="w-4 h-4 text-muted-foreground" /> {t('uiEditor.sections.styleTheme')}
                                            </h3>
                                            {activeSections.estilo ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                        </button>

                                        {activeSections.estilo && (
                                            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('uiEditor.labels.interfaceColor')}</label>
                                                    <div className="flex bg-input rounded-lg p-1 border border-input">
                                                        <button
                                                            onClick={() => handleThemeChange('dark')}
                                                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${localGameTheme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                                        >
                                                            {t('uiEditor.options.dark')}
                                                        </button>
                                                        <button
                                                            onClick={() => handleThemeChange('light')}
                                                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${localGameTheme === 'light' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                                        >
                                                            {t('uiEditor.options.light')}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('uiEditor.labels.contentPosition')}</label>
                                                    <div className="flex bg-zinc-950 p-1 rounded-lg border border-muted-foreground/30">
                                                        {(['left', 'right'] as const).map(align => (
                                                            <button
                                                                key={align}
                                                                onClick={() => setLocalSplashContentAlignment(align)}
                                                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${localSplashContentAlignment === align ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-zinc-300'}`}
                                                            >
                                                                {align === 'left' ? t('uiEditor.options.left') : t('uiEditor.options.right')}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('uiEditor.labels.predefinedThemes')}</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {PREDEFINED_THEMES.map((theme) => (
                                                            <button
                                                                key={theme.name}
                                                                onClick={() => applyTheme(theme)}
                                                                className="flex flex-col items-center justify-center p-3 rounded-lg border border-muted-foreground/50 bg-input hover:border-primary/50 hover:bg-input/80 transition-all gap-2 group"
                                                            >
                                                                <div className="flex -space-x-1">
                                                                    <div className="w-3 h-3 rounded-full border border-muted-foreground/50" style={{ backgroundColor: theme.textColorLight }}></div>
                                                                    <div className="w-3 h-3 rounded-full border border-muted-foreground/50" style={{ backgroundColor: theme.titleColor }}></div>
                                                                </div>
                                                                <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground">{theme.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <button
                                                        onClick={() => toggleSection('cores')}
                                                        className="flex items-center justify-between w-full text-left bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-all"
                                                    >
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('uiEditor.sections.colorCustomization')}</span>
                                                        {activeSections.cores ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                                                    </button>
                                                    {activeSections.cores && (
                                                        <div className="mt-3 space-y-6 animate-in fade-in slide-in-from-top-1 px-1">
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-bold text-foreground border-b border-muted-foreground/50 pb-1">{t('uiEditor.sections.sceneDescription')}</h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                                    <ColorInput label={t('uiEditor.labels.defaultText')} id="textColor" value={localTextColor} onChange={setLocalTextColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label={t('uiEditor.labels.titleHighlight')} id="titleColor" value={localTitleColor} onChange={setLocalTitleColor} placeholder="#58A6FF" />
                                                                    <ColorInput label={t('uiEditor.labels.highlightFocus')} id="focusColor" value={localFocusColor} onChange={setLocalFocusColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label={t('uiEditor.labels.indicatorArrow')} id="gameContinueIndicatorColor" value={localGameContinueIndicatorColor} onChange={setLocalGameContinueIndicatorColor} placeholder="#FFFFFF" />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-bold text-foreground border-b border-muted-foreground/50 pb-1">{t('uiEditor.sections.interfaceButtons')}</h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                                    <ColorInput label={t('uiEditor.labels.startButton')} id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label={t('uiEditor.labels.startButtonTextLabel')} id="splashButtonTextColor" value={localSplashButtonTextColor} onChange={setLocalSplashButtonTextColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label={t('uiEditor.labels.startButtonHover')} id="splashButtonHoverColor" value={localSplashButtonHoverColor} onChange={setLocalSplashButtonHoverColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label={t('uiEditor.labels.actionButton')} id="actionButtonColor" value={localActionButtonColor} onChange={setLocalActionButtonColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label={t('uiEditor.labels.actionButtonTextLabel')} id="actionButtonTextColor" value={localActionButtonTextColor} onChange={setLocalActionButtonTextColor} placeholder="#FFFFFF" />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-bold text-foreground border-b border-muted-foreground/50 pb-1">{t('uiEditor.sections.others')}</h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                                    <ColorInput label={t('uiEditor.labels.sceneNameBox')} id="scenaNameBg" value={localGameSceneNameOverlayBg} onChange={setLocalGameSceneNameOverlayBg} placeholder="#000000" />
                                                                    <ColorInput label={t('uiEditor.labels.backgroundColor')} id="frameRoundedTopColor" value={localFrameRoundedTopColor} onChange={setLocalFrameRoundedTopColor} placeholder="#000000" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                    {/* SECTION: UI TEXT */}
                                    <div className="bg-card border border-muted-foreground/20 rounded-xl p-6 shadow-sm">
                                        <button
                                            onClick={() => toggleSection('texto')}
                                            className="flex items-center justify-between w-full text-left group hover:opacity-80 transition-opacity"
                                        >
                                            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Type className="w-4 h-4 text-muted-foreground" /> {t('uiEditor.sections.fontsText')}
                                            </h3>
                                            {activeSections.texto ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                        </button>
                                        {activeSections.texto && (
                                            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('uiEditor.labels.actionButton')}</label>
                                                    <input
                                                        type="text"
                                                        value={localActionButtonText}
                                                        onChange={(e) => setLocalActionButtonText(e.target.value)}
                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('uiEditor.placeholders.playerInput')}</label>
                                                    <input
                                                        type="text"
                                                        value={localVerbInputPlaceholder}
                                                        onChange={(e) => setLocalVerbInputPlaceholder(e.target.value)}
                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="fontFamily" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t('uiEditor.labels.font')}</label>
                                                    <select
                                                        id="fontFamily"
                                                        value={localFontFamily}
                                                        onChange={(e) => setLocalFontFamily(e.target.value)}
                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all"
                                                    >
                                                        <option value="Inter, sans-serif">Inter ({t('uiEditor.options.default')})</option>
                                                        <option value="Merriweather, serif">Merriweather (Serif)</option>
                                                        <option value="Roboto Mono, monospace">Roboto Mono (Code)</option>
                                                        <option value="Comic Sans MS, cursive">Comic Sans (Comic)</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label htmlFor="baseFontSize" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t('uiEditor.labels.size')}</label>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setLocalGameFontSize('14px')} className={`flex-1 py-1.5 rounded border text-xs font-bold ${localGameFontSize === '14px' ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/30 border-muted-foreground/30 text-muted-foreground'}`}>{t('uiEditor.options.small')}</button>
                                                        <button onClick={() => setLocalGameFontSize('16px')} className={`flex-1 py-1.5 rounded border text-xs font-bold ${localGameFontSize === '16px' ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/30 border-muted-foreground/30 text-muted-foreground'}`}>{t('uiEditor.options.medium')}</button>
                                                        <button onClick={() => setLocalGameFontSize('18px')} className={`flex-1 py-1.5 rounded border text-xs font-bold ${localGameFontSize === '18px' ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/30 border-muted-foreground/30 text-muted-foreground'}`}>{t('uiEditor.options.large')}</button>

                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="col-span-1 lg:col-span-7 relative">
                                    <div className="sticky top-4 space-y-2 h-[calc(100vh-100px)] flex flex-col">


                                        <div
                                            className={`
                                                rounded-xl border shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300 flex-1 w-full
                                                ${localGameTheme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'}
                                                ${localLayoutOrientation === 'horizontal' ? 'aspect-[9/16]' : 'aspect-video'}
                                            `}
                                            style={{ fontFamily: localFontFamily, maxHeight: '500px' }}
                                        >


                                            {/* Preview Content Area - Dynamic Flex Direction (INVERTED LOGIC) */}
                                            <div className={`flex-1 p-6 flex gap-6 overflow-hidden relative ${localLayoutOrientation === 'vertical' ? 'flex-row' : 'flex-col'}`}>

                                                {/* Image Area - Dynamic Order & Frame */}
                                                {/* Image Area - Dynamic Order & Frame using getFramePreviewStyles Logic */}


                                                <div className={`flex flex-col h-full ${localLayoutOrder === 'image-first' ? 'flex-col' : 'flex-col-reverse'}`}>
                                                    <div
                                                        className={`
                                                        relative flex items-center justify-center flex-shrink-0 transition-all duration-300
                                                        ${localLayoutOrientation === 'vertical' ? 'w-1/2 h-full' : 'w-full h-1/2 min-h-[50%]'}
                                                        ${localLayoutOrder === 'image-first' ? 'order-first' : 'order-last'}
                                                    `}
                                                    >
                                                        {(() => {
                                                            const { panelStyles, containerStyles, panelClass, containerClass } = getFramePreviewStyles(localImageFrame as any);

                                                            // Ensure the panel takes full size of the flex item
                                                            const adaptedPanelStyles = {
                                                                ...panelStyles,
                                                                width: '100%',
                                                                height: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            };

                                                            return (
                                                                <div
                                                                    ref={el => {
                                                                        if (el) {
                                                                            if (panelStyles.borderRadius) el.style.setProperty('border-radius', panelStyles.borderRadius as string, 'important');
                                                                            if (panelStyles.overflow) el.style.setProperty('overflow', panelStyles.overflow as string, 'important');
                                                                        }
                                                                    }}
                                                                    style={adaptedPanelStyles}
                                                                    className={panelClass}
                                                                >
                                                                    <div
                                                                        ref={el => {
                                                                            if (el) {
                                                                                if (containerStyles.borderRadius) el.style.setProperty('border-radius', containerStyles.borderRadius as string, 'important');
                                                                                if (containerStyles.overflow) el.style.setProperty('overflow', containerStyles.overflow as string, 'important');
                                                                            }
                                                                        }}
                                                                        style={{ ...containerStyles, width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
                                                                        className={containerClass}
                                                                    >
                                                                        <ImageIcon className="w-12 h-12 text-zinc-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50" />
                                                                        {/* Scene Name Overlay inside the inner container */}
                                                                        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                                                                            <div
                                                                                className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest"
                                                                                style={{ backgroundColor: localGameSceneNameOverlayBg, color: localGameSceneNameOverlayTextColor }}
                                                                            >
                                                                                Nome da Cena
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>


                                                    {/* Text Area */}
                                                    <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                                                        <p className="leading-relaxed" style={{ color: localTextColor, fontSize: /^\d+$/.test(localGameFontSize) ? `${localGameFontSize}px` : localGameFontSize }}>
                                                            Esta é uma descrição de exemplo para a cena. O texto flui conforme as <span style={{ color: localTitleColor, fontWeight: 'bold' }}>CONFIGURAÇÕES</span> escolhidas.
                                                        </p>
                                                        <p className="mt-4 opacity-70" style={{ color: localTextColor, fontFamily: localFontFamily, fontSize: '0.85em' }}>
                                                            {'>'} COMANDO DE EXEMPLO
                                                        </p>
                                                    </div>
                                                </div>


                                                {/* Preview Footer (Input) */}
                                                <div className={`p-3 border-t backdrop-blur-sm flex-shrink-0 space-y-2 ${localGameTheme === 'dark' ? 'border-zinc-900 bg-zinc-950/80' : 'border-zinc-200 bg-white/80'}`}>
                                                    <div className="flex gap-2">
                                                        <div className={`flex-1 rounded-md h-8 flex items-center px-2 border ${localGameTheme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                                                            <span className="font-mono truncate" style={{ fontSize: /^\d+$/.test(localGameFontSize) ? `${localGameFontSize}px` : localGameFontSize, fontFamily: localFontFamily, color: localGameTheme === 'dark' ? '#52525b' : '#a1a1aa' }}>{localVerbInputPlaceholder}</span>
                                                        </div>
                                                        <button
                                                            className="px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate"
                                                            style={{ backgroundColor: localActionButtonColor, color: localActionButtonTextColor, fontSize: /^\d+$/.test(localGameFontSize) ? `${localGameFontSize}px` : localGameFontSize, fontFamily: localFontFamily }}
                                                        >
                                                            {localActionButtonText || 'AÇÃO'}
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="w-full h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center transition-colors hover:opacity-90 truncate"
                                                        style={{ backgroundColor: localSplashButtonColor, color: localSplashButtonTextColor, fontSize: /^\d+$/.test(localGameFontSize) ? `${localGameFontSize}px` : localGameFontSize, fontFamily: localFontFamily }}
                                                    >
                                                        {localSplashButtonText || 'BOTÃO DE INÍCIO'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Footer text removed as per request */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                </div >
            </div >

            {/* Footer buttons removed */}
        </div >
    );
};

export default UIEditor;

