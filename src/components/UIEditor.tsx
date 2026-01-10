
import React, { useState, useEffect } from 'react';
import { GameData, FixedVerb } from '../types';
import { Upload, Trash2, Plus, TriangleAlert, SlidersHorizontal, Heart, Circle, X, Square, Diamond, Check, Image as ImageIcon, RotateCcw, Save, LayoutTemplate, Palette, Type, ChevronDown, ChevronUp, Smartphone, Monitor } from 'lucide-react';

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
    onUpdate: (field: keyof GameData, value: any) => void;
    isDirty: boolean;
    onSetDirty: (isDirty: boolean) => void;
    gameShowTrackersUI?: boolean;
    gameShowSystemButton?: boolean;
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
    imageTransitionType: GameData['gameImageTransitionType'];
    imageSpeed: number;

    onNavigateToTrackers?: () => void;
}

const FONTS = [
    { name: 'Silkscreen', family: "'Silkscreen', sans-serif" },
    { name: 'DotGothic16', family: "'DotGothic16', sans-serif" },
    { name: 'Cutive Mono', family: "'Cutive Mono', monospace" },
    { name: 'Space Mono', family: "'Space Mono', monospace" },
    { name: 'Inconsolata', family: "'Inconsolata', monospace" },
    { name: 'IBM Plex Mono', family: "'IBM Plex Mono', monospace" },
    { name: 'Chakra Petch', family: "'Chakra Petch', sans-serif" },
    { name: 'Crimson Text', family: "'Crimson Text', serif" },
];

const PREDEFINED_THEMES = [
    {
        name: 'Meia-Noite',
        textColor: '#c9d1d9', titleColor: '#58a6ff', focusColor: '#58a6ff',
        textColorLight: '#24292f', titleColorLight: '#0969da', focusColorLight: '#0969da',
        splashButtonColor: '#2ea043', splashButtonHoverColor: '#238636', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#ffffff', actionButtonTextColor: '#0d1117',
        chanceIconColor: '#ff4d4d',
    },
    {
        name: 'Floresta',
        textColor: '#d4d4d2', titleColor: '#a3e635', focusColor: '#a3e635',
        textColorLight: '#1c1917', titleColorLight: '#166534', focusColorLight: '#166534',
        splashButtonColor: '#4d7c0f', splashButtonHoverColor: '#365314', splashButtonTextColor: '#f0fdf4',
        actionButtonColor: '#22c55e', actionButtonTextColor: '#ffffff',
        chanceIconColor: '#dc2626',
    },
    {
        name: 'Sépia',
        textColor: '#e7e5e4', titleColor: '#f59e0b', focusColor: '#f59e0b',
        textColorLight: '#292524', titleColorLight: '#78350f', focusColorLight: '#78350f',
        splashButtonColor: '#a16207', splashButtonHoverColor: '#713f12', splashButtonTextColor: '#fefce8',
        actionButtonColor: '#ca8a04', actionButtonTextColor: '#ffffff',
        chanceIconColor: '#b91c1c',
    },
    {
        name: 'Terminal',
        textColor: '#34d399', titleColor: '#6ee7b7', focusColor: '#a7f3d0',
        textColorLight: '#064e3b', titleColorLight: '#047857', focusColorLight: '#059669',
        splashButtonColor: '#10b981', splashButtonHoverColor: '#059669', splashButtonTextColor: '#000000',
        actionButtonColor: '#34d399', actionButtonTextColor: '#000000',
        chanceIconColor: '#6ee7b7',
    },
    {
        name: 'Oceano',
        textColor: '#cbd5e1', titleColor: '#60a5fa', focusColor: '#93c5fd',
        textColorLight: '#1e293b', titleColorLight: '#2563eb', focusColorLight: '#3b82f6',
        splashButtonColor: '#3b82f6', splashButtonHoverColor: '#2563eb', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#60a5fa', actionButtonTextColor: '#0f172a',
        chanceIconColor: '#3b82f6',
    },
    {
        name: 'Vampiro',
        textColor: '#fecaca', titleColor: '#fca5a5', focusColor: '#f87171',
        textColorLight: '#450a0a', titleColorLight: '#991b1b', focusColorLight: '#b91c1c',
        splashButtonColor: '#dc2626', splashButtonHoverColor: '#b91c1c', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#ef4444', actionButtonTextColor: '#ffffff',
        chanceIconColor: '#fca5a5',
    },
];

const ColorInput: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}> = ({ label, id, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</label>
        <div className="flex items-center gap-2 p-1 bg-input border border-input rounded-lg focus-within:border-purple-500/50 transition-all">
            <input
                type="color"
                id={`${id}-picker`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                aria-label={`Seletor de cor para ${label}`}
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

const FixedVerbItem: React.FC<{
    verb: FixedVerb;
    onUpdate: (id: string, field: 'verbs' | 'description', value: any) => void;
    onRemove: (id: string) => void;
}> = ({ verb, onUpdate, onRemove }) => {
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
        <div className="relative p-6 bg-muted/30 rounded-xl border border-border hover:border-purple-500/30 transition-all group">
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
                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-0 transition-all"
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
                        className="w-full flex-grow bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-0 transition-all resize-none"
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
        textAnimationType, textSpeed, imageTransitionType, imageSpeed,
        onNavigateToTrackers,
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
    const [localSuggestionsButtonText, setLocalSuggestionsButtonText] = useState(suggestionsButtonText);
    const [localInventoryButtonText, setLocalInventoryButtonText] = useState(inventoryButtonText);
    const [localDiaryButtonText, setLocalDiaryButtonText] = useState(diaryButtonText);
    const [localTrackersButtonText, setLocalTrackersButtonText] = useState(trackersButtonText);
    const [localSystemButtonText, setLocalSystemButtonText] = useState(gameSystemButtonText);
    const [localSaveMenuTitle, setLocalSaveMenuTitle] = useState(gameSaveMenuTitle);
    const [localLoadMenuTitle, setLocalLoadMenuTitle] = useState(gameLoadMenuTitle);
    const [localMainMenuButtonText, setLocalMainMenuButtonText] = useState(gameMainMenuButtonText);
    const [localViewEndingButtonText, setLocalViewEndingButtonText] = useState(gameViewEndingButtonText);
    const [activeTab, setActiveTab] = useState('abertura');

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
    const [localGameFontSize, setLocalGameFontSize] = useState(gameFontSize);
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

    const [localTextAnimationType, setLocalTextAnimationType] = useState(textAnimationType);
    const [localTextSpeed, setLocalTextSpeed] = useState(textSpeed);
    const [localImageTransitionType, setLocalImageTransitionType] = useState(imageTransitionType);
    const [localImageSpeed, setLocalImageSpeed] = useState(imageSpeed);

    const TABS = {
        abertura: 'Início',
        aparencia: 'Aparência',
        sistemas: 'Sistemas',
        textos: 'Textos',
        fim_de_jogo: 'Fim de Jogo',
        verbos: 'Verbos Fixos'
    };

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

    useEffect(() => {
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
        setLocalGameShowTrackersUI(gameShowTrackersUI ?? true);
        setLocalGameShowSystemButton(gameShowSystemButton ?? true);
        setLocalSuggestionsButtonText(suggestionsButtonText);
        setLocalInventoryButtonText(inventoryButtonText);
        setLocalDiaryButtonText(diaryButtonText);
        setLocalTrackersButtonText(trackersButtonText);
        setLocalSystemButtonText(gameSystemButtonText);
        setLocalSaveMenuTitle(gameSaveMenuTitle);
        setLocalLoadMenuTitle(gameLoadMenuTitle);
        setLocalMainMenuButtonText(gameMainMenuButtonText);
        setLocalViewEndingButtonText(gameViewEndingButtonText || 'Ver Final');
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
        if (gameFontSize === '0.85em') {
            setLocalGameFontSize('12');
        } else {
            setLocalGameFontSize(gameFontSize);
        }
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
        setLocalImageTransitionType(imageTransitionType);
        setLocalImageSpeed(imageSpeed);
    }, [
        layoutOrientation, layoutOrder, imageFrame, actionButtonText, verbInputPlaceholder, diaryPlayerName, splashButtonText, continueButtonText, restartButtonText, gameSystemEnabled, maxChances,
        textColor, titleColor, splashButtonColor, splashButtonHoverColor, splashButtonTextColor, actionButtonColor, actionButtonTextColor, focusColor,
        chanceIconColor, gameFontFamily, gameFontSize, chanceIcon, chanceLossMessage, chanceRestoreMessage, chanceReturnButtonText, gameTheme, textColorLight, titleColorLight, focusColorLight,
        frameBookColor, frameTradingCardColor,
        frameRoundedTopColor, gameSceneNameOverlayBg, gameSceneNameOverlayTextColor, gameContinueIndicatorColor,
        gameShowTrackersUI, gameShowSystemButton, suggestionsButtonText, inventoryButtonText, diaryButtonText, trackersButtonText,
        gameSystemButtonText, gameSaveMenuTitle, gameLoadMenuTitle, gameMainMenuButtonText, gameViewEndingButtonText,
        title, logo, omitSplashTitle, splashImage, splashContentAlignment, splashDescription, backgroundMusic,
        positiveEndingImage, positiveEndingContentAlignment, positiveEndingDescription, positiveEndingMusic,
        negativeEndingImage, negativeEndingContentAlignment, negativeEndingDescription, negativeEndingMusic, fixedVerbs,
        textAnimationType, textSpeed, imageTransitionType, imageSpeed, splashContentVerticalAlignment
    ]);

    useEffect(() => {
        const dirty = localLayoutOrientation !== layoutOrientation ||
            localLayoutOrder !== layoutOrder ||
            localImageFrame !== imageFrame ||
            localSplashButtonText !== splashButtonText ||
            localContinueButtonText !== continueButtonText ||
            localRestartButtonText !== restartButtonText ||
            localActionButtonText !== actionButtonText ||
            localVerbInputPlaceholder !== verbInputPlaceholder ||
            localDiaryPlayerName !== diaryPlayerName ||
            localGameSystemEnabled !== gameSystemEnabled ||
            localMaxChances !== maxChances ||
            localGameShowTrackersUI !== gameShowTrackersUI ||
            localGameShowSystemButton !== gameShowSystemButton ||
            localSuggestionsButtonText !== suggestionsButtonText ||
            localInventoryButtonText !== inventoryButtonText ||
            localDiaryButtonText !== diaryButtonText ||
            localTrackersButtonText !== trackersButtonText ||
            localSystemButtonText !== gameSystemButtonText ||
            localSaveMenuTitle !== gameSaveMenuTitle ||
            localLoadMenuTitle !== gameLoadMenuTitle ||
            localMainMenuButtonText !== gameMainMenuButtonText ||
            localViewEndingButtonText !== gameViewEndingButtonText ||
            localTextColor !== textColor ||
            localTitleColor !== titleColor ||
            localSplashButtonColor !== splashButtonColor ||
            localSplashButtonHoverColor !== splashButtonHoverColor ||
            localSplashButtonTextColor !== splashButtonTextColor ||
            localActionButtonColor !== actionButtonColor ||
            localActionButtonTextColor !== actionButtonTextColor ||
            localFocusColor !== focusColor ||
            localChanceIconColor !== chanceIconColor ||
            localFontFamily !== gameFontFamily ||
            localGameFontSize !== gameFontSize ||
            localChanceIcon !== chanceIcon ||
            localChanceLossMessage !== chanceLossMessage ||
            localChanceRestoreMessage !== chanceRestoreMessage ||
            localChanceReturnButtonText !== chanceReturnButtonText ||
            localGameTheme !== gameTheme ||
            localTextColorLight !== textColorLight ||
            localTitleColorLight !== titleColorLight ||
            localFocusColorLight !== focusColorLight ||
            localFrameBookColor !== frameBookColor ||
            localFrameTradingCardColor !== frameTradingCardColor ||
            localFrameRoundedTopColor !== frameRoundedTopColor ||
            localGameSceneNameOverlayBg !== gameSceneNameOverlayBg ||
            localGameSceneNameOverlayTextColor !== gameSceneNameOverlayTextColor ||
            localGameContinueIndicatorColor !== gameContinueIndicatorColor ||
            localTitle !== title ||
            localLogo !== logo ||
            localOmitSplashTitle !== omitSplashTitle ||
            localSplashImage !== splashImage ||
            localSplashContentAlignment !== splashContentAlignment ||
            localSplashContentVerticalAlignment !== splashContentVerticalAlignment ||
            localSplashDescription !== splashDescription ||
            localSplashDescription !== splashDescription ||
            localBackgroundMusic !== backgroundMusic ||
            localPositiveEndingImage !== positiveEndingImage ||
            localPositiveEndingContentAlignment !== positiveEndingContentAlignment ||
            localPositiveEndingDescription !== positiveEndingDescription ||
            localPositiveEndingMusic !== positiveEndingMusic ||
            localNegativeEndingImage !== negativeEndingImage ||
            localNegativeEndingContentAlignment !== negativeEndingContentAlignment ||
            localNegativeEndingDescription !== negativeEndingDescription ||
            localNegativeEndingMusic !== negativeEndingMusic ||
            JSON.stringify(localFixedVerbs) !== JSON.stringify(fixedVerbs) ||
            localTextAnimationType !== textAnimationType ||
            localTextSpeed !== textSpeed ||
            localImageTransitionType !== imageTransitionType ||
            localImageSpeed !== imageSpeed;
        onSetDirty(dirty);
    }, [
        localLayoutOrientation, localLayoutOrder, localImageFrame, localActionButtonText, localVerbInputPlaceholder, localDiaryPlayerName, localSplashButtonText, localContinueButtonText, localRestartButtonText, localGameSystemEnabled, localMaxChances, localGameShowTrackersUI, localGameShowSystemButton, localSuggestionsButtonText, localInventoryButtonText, localDiaryButtonText, localTrackersButtonText,
        localSystemButtonText, localSaveMenuTitle, localLoadMenuTitle, localMainMenuButtonText, localViewEndingButtonText,
        localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor, localSplashButtonTextColor, localActionButtonColor, localActionButtonTextColor, localFocusColor, localChanceIconColor, localFontFamily, localGameFontSize, localChanceIcon, localChanceLossMessage, localChanceRestoreMessage, localChanceReturnButtonText, localGameTheme, localTextColorLight, localTitleColorLight, localFocusColorLight,
        localFrameBookColor, localFrameTradingCardColor,
        frameRoundedTopColor, localGameSceneNameOverlayBg, localGameSceneNameOverlayTextColor, localGameContinueIndicatorColor,
        localTitle, localLogo, localOmitSplashTitle, localSplashImage, localSplashContentAlignment, localSplashDescription, localBackgroundMusic,
        localPositiveEndingImage, localPositiveEndingContentAlignment, localPositiveEndingDescription, localPositiveEndingMusic,
        localNegativeEndingImage, localNegativeEndingContentAlignment, localNegativeEndingDescription, localNegativeEndingMusic, localFixedVerbs,
        localTextAnimationType, localTextSpeed, localImageTransitionType, localImageSpeed, localSplashContentVerticalAlignment,
        props, onSetDirty
    ]);

    const handleSave = () => {
        if (localLayoutOrientation !== layoutOrientation) onUpdate('gameLayoutOrientation', localLayoutOrientation);
        if (localLayoutOrder !== layoutOrder) onUpdate('gameLayoutOrder', localLayoutOrder);
        if (localImageFrame !== imageFrame) onUpdate('gameImageFrame', localImageFrame);
        if (localSplashButtonText !== splashButtonText) onUpdate('gameSplashButtonText', localSplashButtonText);
        if (localContinueButtonText !== continueButtonText) onUpdate('gameContinueButtonText', localContinueButtonText);
        if (localRestartButtonText !== restartButtonText) onUpdate('gameRestartButtonText', localRestartButtonText);
        if (localActionButtonText !== actionButtonText) onUpdate('gameActionButtonText', localActionButtonText);
        if (localVerbInputPlaceholder !== verbInputPlaceholder) onUpdate('gameVerbInputPlaceholder', localVerbInputPlaceholder);
        if (localDiaryPlayerName !== diaryPlayerName) onUpdate('gameDiaryPlayerName', localDiaryPlayerName);
        if (localGameSystemEnabled !== gameSystemEnabled) onUpdate('gameSystemEnabled', localGameSystemEnabled);
        if (localMaxChances !== maxChances) onUpdate('gameMaxChances', localMaxChances);
        if (localGameShowTrackersUI !== gameShowTrackersUI) onUpdate('gameShowTrackersUI', localGameShowTrackersUI);
        if (localGameShowSystemButton !== gameShowSystemButton) onUpdate('gameShowSystemButton', localGameShowSystemButton);
        if (localSuggestionsButtonText !== suggestionsButtonText) onUpdate('gameSuggestionsButtonText', localSuggestionsButtonText);
        if (localInventoryButtonText !== inventoryButtonText) onUpdate('gameInventoryButtonText', localInventoryButtonText);
        if (localDiaryButtonText !== diaryButtonText) onUpdate('gameDiaryButtonText', localDiaryButtonText);
        if (localTrackersButtonText !== trackersButtonText) onUpdate('gameTrackersButtonText', localTrackersButtonText);
        if (localSystemButtonText !== gameSystemButtonText) onUpdate('gameSystemButtonText', localSystemButtonText);
        if (localSaveMenuTitle !== gameSaveMenuTitle) onUpdate('gameSaveMenuTitle', localSaveMenuTitle);
        if (localLoadMenuTitle !== gameLoadMenuTitle) onUpdate('gameLoadMenuTitle', localLoadMenuTitle);
        if (localMainMenuButtonText !== gameMainMenuButtonText) onUpdate('gameMainMenuButtonText', localMainMenuButtonText);
        if (localViewEndingButtonText !== gameViewEndingButtonText) onUpdate('gameViewEndingButtonText', localViewEndingButtonText);
        if (localTextColor !== textColor) onUpdate('gameTextColor', localTextColor);
        if (localTitleColor !== titleColor) onUpdate('gameTitleColor', localTitleColor);
        if (localSplashButtonColor !== splashButtonColor) onUpdate('gameSplashButtonColor', localSplashButtonColor);
        if (localSplashButtonHoverColor !== splashButtonHoverColor) onUpdate('gameSplashButtonHoverColor', localSplashButtonHoverColor);
        if (localSplashButtonTextColor !== splashButtonTextColor) onUpdate('gameSplashButtonTextColor', localSplashButtonTextColor);
        if (localActionButtonColor !== actionButtonColor) onUpdate('gameActionButtonColor', localActionButtonColor);
        if (localActionButtonTextColor !== actionButtonTextColor) onUpdate('gameActionButtonTextColor', localActionButtonTextColor);
        if (localFocusColor !== focusColor) onUpdate('gameFocusColor', localFocusColor);
        if (localChanceIconColor !== chanceIconColor) onUpdate('gameChanceIconColor', localChanceIconColor);
        if (localFontFamily !== gameFontFamily) onUpdate('gameFontFamily', localFontFamily);
        if (localGameFontSize !== gameFontSize) onUpdate('gameFontSize', localGameFontSize);
        if (localChanceIcon !== chanceIcon) onUpdate('gameChanceIcon', localChanceIcon);
        if (localChanceLossMessage !== chanceLossMessage) onUpdate('gameChanceLossMessage', localChanceLossMessage);
        if (localChanceRestoreMessage !== chanceRestoreMessage) onUpdate('gameChanceRestoreMessage', localChanceRestoreMessage);
        if (localChanceReturnButtonText !== chanceReturnButtonText) onUpdate('gameChanceReturnButtonText', localChanceReturnButtonText);
        if (localGameTheme !== gameTheme) onUpdate('gameTheme', localGameTheme);
        if (localTextColorLight !== textColorLight) onUpdate('textColorLight', localTextColorLight);
        if (localTitleColorLight !== titleColorLight) onUpdate('titleColorLight', localTitleColorLight);
        if (localFocusColorLight !== focusColorLight) onUpdate('focusColorLight', localFocusColorLight);
        if (localFrameBookColor !== frameBookColor) onUpdate('frameBookColor', localFrameBookColor);
        if (localFrameTradingCardColor !== frameTradingCardColor) onUpdate('frameTradingCardColor', localFrameTradingCardColor);
        if (localFrameRoundedTopColor !== frameRoundedTopColor) onUpdate('frameRoundedTopColor', localFrameRoundedTopColor);
        if (localGameSceneNameOverlayBg !== gameSceneNameOverlayBg) onUpdate('gameSceneNameOverlayBg', localGameSceneNameOverlayBg);
        if (localGameSceneNameOverlayTextColor !== gameSceneNameOverlayTextColor) onUpdate('gameSceneNameOverlayTextColor', localGameSceneNameOverlayTextColor);
        if (localGameContinueIndicatorColor !== gameContinueIndicatorColor) onUpdate('gameContinueIndicatorColor', localGameContinueIndicatorColor);
        if (localTitle !== title) onUpdate('gameTitle', localTitle);
        if (localLogo !== logo) onUpdate('gameLogo', localLogo);
        if (localOmitSplashTitle !== omitSplashTitle) onUpdate('gameOmitSplashTitle', localOmitSplashTitle);
        if (localSplashImage !== splashImage) onUpdate('gameSplashImage', localSplashImage);
        if (localSplashContentAlignment !== splashContentAlignment) onUpdate('gameSplashContentAlignment', localSplashContentAlignment);
        if (localSplashContentVerticalAlignment !== splashContentVerticalAlignment) onUpdate('gameSplashContentVerticalAlignment', localSplashContentVerticalAlignment);
        if (localSplashDescription !== splashDescription) onUpdate('gameSplashDescription', localSplashDescription);
        if (localBackgroundMusic !== backgroundMusic) onUpdate('gameBackgroundMusic', localBackgroundMusic);
        if (localPositiveEndingImage !== positiveEndingImage) onUpdate('positiveEndingImage', localPositiveEndingImage);
        if (localPositiveEndingContentAlignment !== positiveEndingContentAlignment) onUpdate('positiveEndingContentAlignment', localPositiveEndingContentAlignment);
        if (localPositiveEndingDescription !== positiveEndingDescription) onUpdate('positiveEndingDescription', localPositiveEndingDescription);
        if (localPositiveEndingMusic !== positiveEndingMusic) onUpdate('positiveEndingMusic', localPositiveEndingMusic);
        if (localNegativeEndingImage !== negativeEndingImage) onUpdate('negativeEndingImage', localNegativeEndingImage);
        if (localNegativeEndingContentAlignment !== negativeEndingContentAlignment) onUpdate('negativeEndingContentAlignment', localNegativeEndingContentAlignment);
        if (localNegativeEndingDescription !== negativeEndingDescription) onUpdate('negativeEndingDescription', localNegativeEndingDescription);
        if (localNegativeEndingMusic !== negativeEndingMusic) onUpdate('negativeEndingMusic', localNegativeEndingMusic);
        if (JSON.stringify(localFixedVerbs) !== JSON.stringify(fixedVerbs)) onUpdate('fixedVerbs', localFixedVerbs);
        if (localTextAnimationType !== textAnimationType) onUpdate('gameTextAnimationType', localTextAnimationType);
        if (localTextSpeed !== textSpeed) onUpdate('gameTextSpeed', localTextSpeed);
        if (localImageTransitionType !== imageTransitionType) onUpdate('gameImageTransitionType', localImageTransitionType);
        if (localImageSpeed !== imageSpeed) onUpdate('gameImageSpeed', localImageSpeed);
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
        setLocalGameFontSize(gameFontSize);
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
        setLocalSplashContentVerticalAlignment(splashContentVerticalAlignment as any);
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
        setLocalImageTransitionType(imageTransitionType);
        setLocalImageSpeed(imageSpeed);
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
            case 'cross': return <X color={color} className={className} />;
            case 'square': return <Square fill={color} stroke="none" className={className} />;
            case 'diamond': return <Diamond fill={color} stroke="none" className={className} />;
            default: return <Heart fill={color} stroke="none" className={className} />;
        }
    };

    const getFramePreviewStyles = (frame: GameData['gameImageFrame']) => {
        const panelStyles: React.CSSProperties = { boxSizing: 'border-box' };
        const containerStyles: React.CSSProperties = {
            backgroundColor: localGameTheme === 'dark' ? '#1a202c' : '#e2e8f0',
            color: localGameTheme === 'dark' ? '#a0aec0' : '#4a5568',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
        };
        let panelClass = '';
        let containerClass = '';

        switch (frame) {
            case 'rounded-top':
                panelStyles.padding = '5px';
                panelStyles.backgroundColor = localFrameRoundedTopColor;
                panelStyles.border = 'none';
                panelStyles.borderRadius = '40px 40px 4px 4px';
                containerStyles.borderRadius = '35px 35px 0 0';
                panelClass = 'frame-preview-portal';
                containerClass = 'frame-preview-portal-container';
                break;
            case 'book-cover':
                panelStyles.padding = '5px';
                panelStyles.backgroundColor = localFrameBookColor;
                panelStyles.border = 'none';
                panelClass = 'frame-preview-book';
                break;
            case 'trading-card':
                panelStyles.backgroundColor = localFrameTradingCardColor;
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
        <div className="space-y-6 pb-24">
            <div>
                <div className="border-b border-border flex items-center justify-between pr-4">
                    <div className="flex space-x-1 overflow-x-auto">
                        {Object.entries(TABS).map(([key, name]) => {
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key as any)}
                                    className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeTab === key
                                        ? 'border-purple-500 text-foreground bg-purple-500/5'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                        }`}
                                >
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                    {isDirty && (
                        <div className="flex items-center gap-2 text-purple-400 text-[10px] font-bold uppercase tracking-widest animate-pulse bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                            <span>Alterações não salvas</span>
                        </div>
                    )}
                </div>

                <div className={`bg-muted/10 -mt-px py-8 grid grid-cols-1 ${activeTab === 'cores' ? 'xl:grid-cols-[1fr_450px]' : ''} gap-8 items-start px-6`}>
                    {activeTab === 'layout' && (
                        <div className="space-y-6">
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                                    <div className="space-y-8 col-span-1">
                                        <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">Tela de Abertura</h3>
                                        <div className="space-y-8">
                                            <div>
                                                <label htmlFor="splashContentAlignment" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Posicionamento do Conteúdo</label>
                                                <select
                                                    id="splashContentAlignment"
                                                    value={localSplashContentAlignment}
                                                    onChange={(e) => setLocalSplashContentAlignment(e.target.value as 'left' | 'right')}
                                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-input shadow-lg"
                                                >
                                                    <option value="right">Direita</option>
                                                    <option value="left">Esquerda</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center group cursor-pointer" onClick={() => setLocalOmitSplashTitle(!localOmitSplashTitle)}>
                                                <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${localOmitSplashTitle ? 'bg-purple-500 border-purple-500' : 'bg-input border-input group-hover:border-primary/50'}`}>
                                                    {localOmitSplashTitle && <Circle className="w-2 h-2 fill-white stroke-none" />}
                                                </div>
                                                <label htmlFor="omitSplashTitle" className="ml-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground cursor-pointer select-none transition-colors">Ocultar título e descrição</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 col-span-1 md:mt-0">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">Pré-visualização</p>
                                        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center shadow-inner h-fit aspect-video">
                                            <div
                                                className="relative w-full max-w-full aspect-video bg-muted border border-border/50 rounded-xl flex shadow-2xl overflow-hidden"
                                                style={{
                                                    justifyContent: localSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end',
                                                    alignItems: 'flex-end'
                                                }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center -translate-y-4">
                                                    <div className="text-secondary-foreground font-black text-[8px] uppercase tracking-[0.2em] border-2 border-secondary-foreground/20 px-3 py-1 rounded">Imagem de Fundo</div>
                                                </div>
                                                {!localOmitSplashTitle && (
                                                    <div
                                                        className="w-2/3 h-1/3 m-6 bg-purple-500/5 backdrop-blur-sm border border-purple-500/20 rounded-lg flex items-center justify-center text-center text-[8px] p-2 text-purple-400 font-bold uppercase tracking-widest shadow-xl"
                                                    >
                                                        Título e Descrição
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
                                        <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">Layout do Jogo</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="orientation-select" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Orientação</label>
                                                <select
                                                    id="orientation-select"
                                                    value={localLayoutOrientation}
                                                    onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-input"
                                                >
                                                    <option value="vertical">Vertical</option>
                                                    <option value="horizontal">Horizontal</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="order-select" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Posição da Imagem</label>
                                                <select
                                                    id="order-select"
                                                    value={localLayoutOrder}
                                                    onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-input"
                                                >
                                                    <option value="image-first">{localLayoutOrientation === 'vertical' ? 'Esquerda' : 'Acima'}</option>
                                                    <option value="image-last">{localLayoutOrientation === 'vertical' ? 'Direita' : 'Abaixo'}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="frame-select" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Tipo de Moldura</label>
                                                <select
                                                    id="frame-select"
                                                    value={localImageFrame}
                                                    onChange={(e) => setLocalImageFrame(e.target.value as GameData['gameImageFrame'])}
                                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-input"
                                                >
                                                    <option value="none">Sem moldura</option>
                                                    <option value="rounded-top">Portal</option>
                                                    <option value="book-cover">Quadrada</option>
                                                    <option value="trading-card">Arredondada</option>
                                                </select>
                                            </div>
                                            <div>
                                                {localImageFrame === 'rounded-top' && (
                                                    <ColorInput label="Cor da Moldura" id="frameRoundedTopColor" value={localFrameRoundedTopColor} onChange={setLocalFrameRoundedTopColor} placeholder="#FFFFFF" />
                                                )}
                                                {localImageFrame === 'book-cover' && (
                                                    <ColorInput label="Cor da Moldura" id="frameBookColor" value={localFrameBookColor} onChange={setLocalFrameBookColor} placeholder="#FFFFFF" />
                                                )}
                                                {localImageFrame === 'trading-card' && (
                                                    <ColorInput label="Cor da Moldura" id="frameTradingCardColor" value={localFrameTradingCardColor} onChange={setLocalFrameTradingCardColor} placeholder="#FFFFFF" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col col-span-1 md:mt-0">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">Pré-visualização do Layout</p>
                                        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center h-fit aspect-video shadow-inner">
                                            <div
                                                className="w-full max-w-[400px] aspect-video border border-border/30 bg-muted rounded-xl flex p-3 gap-3 transition-all shadow-2xl overflow-hidden"
                                                style={{ flexDirection: localLayoutOrientation === 'horizontal' ? 'column' : 'row' }}
                                            >
                                                <div
                                                    className={`flex items-center justify-center ${localLayoutOrder === 'image-first' ? 'order-1' : 'order-2'} transition-all duration-300 ${localLayoutOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full'}`}
                                                    style={getFramePreviewStyles(localImageFrame).panelStyles}
                                                >
                                                    <div
                                                        className={`flex-1 w-full h-full rounded-lg flex items-center justify-center text-center text-[7px] p-2 font-black uppercase tracking-[0.2em] text-muted-foreground border border-border/30 bg-card shadow-inner`}
                                                        style={{
                                                            ...getFramePreviewStyles(localImageFrame).containerStyles,
                                                            backgroundColor: undefined
                                                        }}
                                                    >
                                                        FOTO
                                                    </div>
                                                </div>
                                                <div className={`flex-1 bg-purple-500/5 border border-purple-500/20 rounded-lg flex items-center justify-center text-center text-[7px] p-2 text-purple-400 font-black uppercase tracking-[0.2em] shadow-lg ${localLayoutOrder === 'image-first' ? 'order-2' : 'order-1'} ${localLayoutOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full'}`}>
                                                    TEXTO
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sistemas' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">Configuração de Sistemas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="system-select" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Habilitar sistemas</label>
                                            <select
                                                id="system-select"
                                                value={localGameSystemEnabled}
                                                onChange={(e) => setLocalGameSystemEnabled(e.target.value as 'none' | 'chances' | 'trackers')}
                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-input shadow-lg"
                                            >
                                                <option value="none">Nenhum</option>
                                                <option value="chances">Chances (Vidas)</option>
                                                <option value="trackers">Rastreadores (Variáveis)</option>
                                            </select>
                                        </div>

                                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs text-muted-foreground leading-relaxed">
                                            {localGameSystemEnabled === 'none' && "Nenhum sistema de jogo adicional habilitado. O jogo será puramente baseado em navegação e interações simples."}
                                            {localGameSystemEnabled === 'chances' && (
                                                <div className="flex gap-3">
                                                    <Heart className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                                    <p>Gerencie a 'vida' do jogador. Defina um número máximo de tentativas antes que o jogo termine automaticamente.</p>
                                                </div>
                                            )}
                                            {localGameSystemEnabled === 'trackers' && (
                                                <div className="flex gap-3">
                                                    <SlidersHorizontal className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                                    <p>Crie variáveis customizadas (Ex: Sanidade, Dinheiro, Força). O progresso pode ser condicionado a esses valores.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {localGameSystemEnabled === 'chances' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <label htmlFor="maxChances" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Máximo de Chances</label>
                                                        <input
                                                            type="number"
                                                            id="maxChances"
                                                            value={localMaxChances}
                                                            onChange={(e) => setLocalMaxChances(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                                                            min="1"
                                                            max="10"
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all shadow-lg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="chanceIcon" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Ícone</label>
                                                        <div className="flex gap-2">
                                                            <select
                                                                id="chanceIcon"
                                                                value={localChanceIcon}
                                                                onChange={(e) => setLocalChanceIcon(e.target.value as any)}
                                                                className="flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg"
                                                            >
                                                                <option value="heart">Corações</option>
                                                                <option value="circle">Círculos</option>
                                                                <option value="square">Quadrados</option>
                                                                <option value="diamond">Losangos</option>
                                                            </select>
                                                            <div className="flex-shrink-0 flex items-center justify-center w-12 bg-input border border-input rounded-lg shadow-lg">
                                                                <ChanceIcon type={localChanceIcon} color={localChanceIconColor} className="w-5 h-5 shadow-[0_0_10px_rgba(168,85,247,0.2)]" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <ColorInput label="Cor dos Ícones" id="chanceIconColor" value={localChanceIconColor} onChange={setLocalChanceIconColor} placeholder="#ff4d4d" />

                                                <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                                                    <div>
                                                        <label htmlFor="chanceLossMessage" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Mensagem de Perda</label>
                                                        <input
                                                            type="text"
                                                            id="chanceLossMessage"
                                                            value={localChanceLossMessage}
                                                            onChange={(e) => setLocalChanceLossMessage(e.target.value)}
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-0 focus:border-purple-500/50 transition-all shadow-lg"
                                                            placeholder="Suas chances acabaram."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="chanceRestoreMessage" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Mensagem de Recuperação</label>
                                                        <input
                                                            type="text"
                                                            id="chanceRestoreMessage"
                                                            value={localChanceRestoreMessage}
                                                            onChange={(e) => setLocalChanceRestoreMessage(e.target.value)}
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-0 focus:border-purple-500/50 transition-all shadow-lg"
                                                            placeholder="Suas chances foram restauradas."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {localGameSystemEnabled === 'trackers' && (
                                            <div className="flex flex-col items-center justify-center h-full p-8 bg-card border border-border border-dashed rounded-2xl text-center space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <SlidersHorizontal className="w-10 h-10 text-muted-foreground/50 mb-2" />
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">Rastreadores Habilitados</p>
                                                    <p className="text-xs text-muted-foreground mt-2 max-w-[240px]">Para criar e editar as variáveis específicas do jogo, utilize a guia "Rastreadores" no menu superior.</p>
                                                </div>
                                                <button
                                                    onClick={() => props.onNavigateToTrackers?.()}
                                                    className="px-6 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all active:scale-95"
                                                >
                                                    Gerenciar Rastreadores
                                                </button>
                                            </div>
                                        )}

                                        {localGameSystemEnabled === 'none' && (
                                            <div className="h-full border border-border/30 rounded-2xl bg-muted/20 flex items-center justify-center p-12 text-center text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">
                                                Nenhum sistema selecionado
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'abertura' && (
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
                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-0 focus:border-purple-500/50 transition-all font-bold placeholder:text-muted-foreground"
                                        placeholder="Ex: A Masmorra Esquecida"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 flex-1 h-full">
                                    <label htmlFor="splashDescription" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Descrição do Jogo</label>
                                    <textarea
                                        id="splashDescription"
                                        value={localSplashDescription}
                                        onChange={(e) => setLocalSplashDescription(e.target.value)}
                                        className="w-full flex-1 bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-0 focus:border-purple-500/50 transition-all resize-none leading-relaxed placeholder:text-muted-foreground h-full"
                                        placeholder="Uma breve descrição da sua aventura..."
                                    />
                                </div>
                            </div>




                            {/* RIGHT COLUMN: Preview & Image Settings */}
                            <div className="flex flex-col h-full gap-2">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Imagem de Fundo</label>
                                <div className="relative w-full aspect-video bg-black/50 border border-border rounded-xl overflow-hidden shadow-2xl group flex-shrink-0">
                                    {/* Background Image Layer */}
                                    {localSplashImage ? (
                                        <div className="absolute inset-0 w-full h-full">
                                            <img src={localSplashImage} alt="Fundo" className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10">
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
                                        <label className="flex-grow flex items-center justify-center px-4 py-3 bg-muted border border-border text-foreground font-bold rounded-lg hover:bg-muted/80 hover:text-foreground transition-all cursor-pointer text-[10px] uppercase tracking-widest shadow-lg group">
                                            <Upload className="w-4 h-4 mr-2 text-purple-400 group-hover:scale-110 transition-transform" /> {localBackgroundMusic ? 'Alterar Música' : 'Carregar Música (.mp3)'}
                                            <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={(e) => handleAudioUpload(e, setLocalBackgroundMusic)} className="hidden" />
                                        </label>
                                        {localBackgroundMusic && (
                                            <button
                                                onClick={() => setLocalBackgroundMusic('')}
                                                className="p-3 bg-red-500/5 text-muted-foreground rounded-lg border border-border hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-lg"
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
                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-input shadow-lg"
                                            >
                                                <option value="right">Direita</option>
                                                <option value="left">Esquerda</option>
                                            </select>
                                            <select
                                                id="splashContentVerticalAlignment"
                                                value={localSplashContentVerticalAlignment}
                                                onChange={(e) => setLocalSplashContentVerticalAlignment(e.target.value as 'top' | 'bottom')}
                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-input shadow-lg"
                                            >
                                                <option value="bottom">Inferior</option>
                                                <option value="top">Superior</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${localOmitSplashTitle ? 'bg-purple-500 border-purple-500' : 'bg-transparent border-input group-hover:border-purple-500/50'}`}>
                                                {localOmitSplashTitle && <Check size={12} className="text-white bg-transparent" />}
                                            </div>
                                            <input type="checkbox" checked={localOmitSplashTitle} onChange={() => setLocalOmitSplashTitle(!localOmitSplashTitle)} className="hidden" />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">Ocultar título e descrição</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    )}

                    {
                        activeTab === 'fim_de_jogo' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">Final Positivo</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                                        <div className="space-y-8 flex flex-col h-full col-span-1">
                                            <div className="space-y-2">
                                                <label htmlFor="posEndingContent" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Posicionamento do Conteúdo</label>
                                                <select
                                                    id="posEndingContent"
                                                    value={localPositiveEndingContentAlignment}
                                                    onChange={(e) => setLocalPositiveEndingContentAlignment(e.target.value as 'left' | 'right')}
                                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all [&>option]:bg-input shadow-lg"
                                                >
                                                    <option value="right">Direita</option>
                                                    <option value="left">Esquerda</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2 flex flex-col flex-grow">
                                                <label htmlFor="positiveEndingDescription" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Mensagem de Vitória</label>
                                                <textarea
                                                    id="positiveEndingDescription"
                                                    value={localPositiveEndingDescription}
                                                    onChange={(e) => setLocalPositiveEndingDescription(e.target.value)}
                                                    className="w-full flex-grow bg-input border border-input rounded-lg px-4 py-3 text-xs text-foreground focus:ring-0 focus:border-purple-500/50 transition-all min-h-[160px] resize-none leading-relaxed placeholder:text-muted-foreground"
                                                    placeholder="Parabéns! Você venceu."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-8 col-span-2">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Imagem de Vitória</h4>
                                                <div className="relative w-full h-[225px]">
                                                    {localPositiveEndingImage ? (
                                                        <div className="absolute inset-0 w-full h-full border border-border rounded-xl overflow-hidden bg-card group shadow-2xl">
                                                            <img src={localPositiveEndingImage} alt="Final Positivo" className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-3 bg-black/40 backdrop-blur-sm">
                                                                <label className="p-3 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-all shadow-xl">
                                                                    <Upload className="w-5 h-5" />
                                                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalPositiveEndingImage)} className="hidden" />
                                                                </label>
                                                                <button onClick={() => setLocalPositiveEndingImage('')} className="p-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl">
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <label className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-border bg-muted/30 rounded-xl cursor-pointer hover:bg-muted/50 transition-all group overflow-hidden">
                                                            <Upload className="w-10 h-10 text-muted-foreground mb-4 transition-colors group-hover:text-purple-400" />
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground">Carregar Imagem</span>
                                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalPositiveEndingImage)} className="hidden" />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-4 pt-6 border-t border-zinc-800/50">
                                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trilha de Vitória</h4>
                                                <div className="flex items-center gap-3">
                                                    <label className="flex-grow flex items-center justify-center px-4 py-3 bg-muted border border-border text-foreground font-bold rounded-lg hover:bg-muted/80 hover:text-foreground transition-all cursor-pointer text-[10px] uppercase tracking-widest shadow-lg">
                                                        <Upload className="w-4 h-4 mr-2 text-purple-400" /> {localPositiveEndingMusic ? 'Alterar Música' : 'Carregar Música (.mp3)'}
                                                        <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={(e) => handleAudioUpload(e, setLocalPositiveEndingMusic)} className="hidden" />
                                                    </label>
                                                    {localPositiveEndingMusic && (
                                                        <button onClick={() => setLocalPositiveEndingMusic('')} className="p-3 bg-red-500/5 text-muted-foreground rounded-lg border border-border hover:bg-red-500 hover:text-white transition-all shadow-lg">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-800/50">
                                    <h3 className="text-xs font-bold text-zinc-100 mb-4 uppercase tracking-widest">Final Negativo</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                                        <div className="space-y-8 flex flex-col h-full col-span-1">
                                            <div className="space-y-2">
                                                <label htmlFor="negEndingContent" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Posicionamento do Conteúdo</label>
                                                <select
                                                    id="negEndingContent"
                                                    value={localNegativeEndingContentAlignment}
                                                    onChange={(e) => setLocalNegativeEndingContentAlignment(e.target.value as 'left' | 'right')}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all [&>option]:bg-zinc-950 shadow-lg"
                                                >
                                                    <option value="right">Direita</option>
                                                    <option value="left">Esquerda</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2 flex flex-col flex-grow">
                                                <label htmlFor="negativeEndingDescription" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Mensagem de Derrota</label>
                                                <textarea
                                                    id="negativeEndingDescription"
                                                    value={localNegativeEndingDescription}
                                                    onChange={(e) => setLocalNegativeEndingDescription(e.target.value)}
                                                    className="w-full flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-zinc-300 focus:ring-0 focus:border-purple-500/50 transition-all min-h-[160px] resize-none leading-relaxed placeholder:text-zinc-800"
                                                    placeholder="Fim de jogo."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-8 col-span-2">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Imagem de Derrota</h4>
                                                <div className="relative w-full h-[225px]">
                                                    {localNegativeEndingImage ? (
                                                        <div className="absolute inset-0 w-full h-full border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 group shadow-2xl">
                                                            <img src={localNegativeEndingImage} alt="Final Negativo" className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-3 bg-zinc-950/40 backdrop-blur-sm">
                                                                <label className="p-3 bg-white text-zinc-950 rounded-lg cursor-pointer hover:bg-zinc-200 transition-all shadow-xl">
                                                                    <Upload className="w-5 h-5" />
                                                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalNegativeEndingImage)} className="hidden" />
                                                                </label>
                                                                <button onClick={() => setLocalNegativeEndingImage('')} className="p-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl">
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <label className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-900/30 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-all group overflow-hidden">
                                                            <Upload className="w-10 h-10 text-muted-foreground mb-4 transition-colors group-hover:text-purple-400" />
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground">Carregar Imagem</span>
                                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalNegativeEndingImage)} className="hidden" />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-4 pt-6 border-t border-zinc-800/50">
                                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trilha de Derrota</h4>
                                                <div className="flex items-center gap-3">
                                                    <label className="flex-grow flex items-center justify-center px-4 py-3 bg-muted border border-border text-foreground font-bold rounded-lg hover:bg-muted/80 hover:text-foreground transition-all cursor-pointer text-[10px] uppercase tracking-widest shadow-lg">
                                                        <Upload className="w-4 h-4 mr-2 text-purple-400" /> {localNegativeEndingMusic ? 'Alterar Música' : 'Carregar Música (.mp3)'}
                                                        <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={(e) => handleAudioUpload(e, setLocalNegativeEndingMusic)} className="hidden" />
                                                    </label>
                                                    {localNegativeEndingMusic && (
                                                        <button onClick={() => setLocalNegativeEndingMusic('')} className="p-3 bg-red-500/5 text-muted-foreground rounded-lg border border-border hover:bg-red-500 hover:text-white transition-all shadow-lg">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        activeTab === 'textos' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">Textos da Interface</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="actionButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Texto do Botão de Ação</label>
                                            <input type="text" id="actionButtonText" value={localActionButtonText} onChange={(e) => setLocalActionButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="verbInputPlaceholder" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Texto do Campo de Comando</label>
                                            <input type="text" id="verbInputPlaceholder" value={localVerbInputPlaceholder} onChange={(e) => setLocalVerbInputPlaceholder(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="viewEndingButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Texto do Botão "Ver Final"</label>
                                            <input type="text" id="viewEndingButtonText" value={localViewEndingButtonText} onChange={(e) => setLocalViewEndingButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg placeholder:text-muted-foreground" placeholder="Ver Final" />
                                            <p className="text-[10px] text-muted-foreground mt-2 italic">Aparece quando o jogo termina, para levar às telas de final.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="diaryPlayerName" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Nome do Jogador no Diário</label>
                                            <input type="text" id="diaryPlayerName" value={localDiaryPlayerName} onChange={(e) => setLocalDiaryPlayerName(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="splashButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Texto do Botão de Início</label>
                                            <input type="text" id="splashButtonText" value={localSplashButtonText} onChange={(e) => setLocalSplashButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="INICIAR" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="continueButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Texto do Botão de Continuar</label>
                                            <input type="text" id="continueButtonText" value={localContinueButtonText} onChange={(e) => setLocalContinueButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Continuar Aventura" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="restartButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Texto do Botão de Reiniciar</label>
                                            <input type="text" id="restartButtonText" value={localRestartButtonText} onChange={(e) => setLocalRestartButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Reiniciar Aventura" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border/50">
                                    <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">Botões de Navegação</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="suggestionsButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Botão Sugestões</label>
                                            <input type="text" id="suggestionsButtonText" value={localSuggestionsButtonText} onChange={e => setLocalSuggestionsButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="inventoryButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Botão Inventário</label>
                                            <input type="text" id="inventoryButtonText" value={localInventoryButtonText} onChange={e => setLocalInventoryButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="diaryButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Botão Diário</label>
                                            <input type="text" id="diaryButtonText" value={localDiaryButtonText} onChange={e => setLocalDiaryButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="trackersButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Botão Rastreadores</label>
                                            <input type="text" id="trackersButtonText" value={localTrackersButtonText} onChange={e => setLocalTrackersButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed" placeholder="Rastreadores" disabled={localGameSystemEnabled !== 'trackers'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="systemButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Botão Menu Sistema</label>
                                            <input type="text" id="systemButtonText" value={localSystemButtonText} onChange={e => setLocalSystemButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Sistema" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="mainMenuButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Botão Menu Principal</label>
                                            <input type="text" id="mainMenuButtonText" value={localMainMenuButtonText} onChange={e => setLocalMainMenuButtonText(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Menu Principal" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Menu de Sistema</h3>
                                        <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-xl group cursor-pointer" onClick={() => setLocalGameShowSystemButton(!localGameShowSystemButton)}>
                                            <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${localGameShowSystemButton ? 'bg-purple-500 border-purple-500' : 'bg-input border-input group-hover:border-primary/50'}`}>
                                                {localGameShowSystemButton && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground select-none">Mostrar Menu de Sistema</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="saveMenuTitle" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Título Tela Salvar</label>
                                            <input type="text" id="saveMenuTitle" value={localSaveMenuTitle} onChange={e => setLocalSaveMenuTitle(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Salvar Jogo" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="loadMenuTitle" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Título Tela Carregar</label>
                                            <input type="text" id="loadMenuTitle" value={localLoadMenuTitle} onChange={e => setLocalLoadMenuTitle(e.target.value)} className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Carregar Jogo" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-bold text-foreground mb-4 uppercase tracking-widest">Efeitos de Texto</h3>
                                    {/* Unsaved Changes Notification - Matching SceneEditor */}
                                    {isDirty && (
                                        <div className="flex items-center gap-2 text-purple-400 text-[10px] font-bold animate-pulse bg-purple-500/5 px-2 py-1 rounded-md border border-purple-500/10">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                            <span>ALTERAÇÕES NÃO SALVAS</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="textAnimationType" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Estilo de Animação</label>
                                        <select
                                            id="textAnimationType"
                                            value={localTextAnimationType}
                                            onChange={(e) => setLocalTextAnimationType(e.target.value as 'fade' | 'typewriter')}
                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg"
                                        >
                                            <option value="fade">Esmaecer (Fade In)</option>
                                            <option value="typewriter">Máquina de Escrever (Letra a letra)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="textSpeed" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Velocidade da Animação</label>
                                        <div className="flex items-center gap-6 px-2">
                                            <input
                                                type="range"
                                                id="textSpeed"
                                                min="1"
                                                max="5"
                                                value={localTextSpeed}
                                                onChange={(e) => setLocalTextSpeed(parseInt(e.target.value, 10))}
                                                className="flex-grow h-1.5 bg-input rounded-lg appearance-none cursor-pointer accent-purple-500"
                                            />
                                            <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center font-mono text-xs font-bold text-purple-400 shadow-inner">
                                                {localTextSpeed}
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-[9px] text-muted-foreground font-bold uppercase tracking-tighter px-2">
                                            <span>Lento</span>
                                            <span>Rápido</span>
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
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => toggleSection('estrutura')}
                                            className="flex items-center justify-between w-full text-left group hover:opacity-80 transition-opacity"
                                        >
                                            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                                <LayoutTemplate className="w-4 h-4 text-purple-400" /> ESTRUTURA
                                            </h3>
                                            {activeSections.estrutura ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                        </button>

                                        {activeSections.estrutura && (
                                            <div className="space-y-6 pl-2 border-l-2 border-border/50 ml-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Orientação</label>
                                                    <div className="relative">
                                                        <select
                                                            value={localLayoutOrientation}
                                                            onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="vertical">Vertical</option>
                                                            <option value="horizontal">Horizontal</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Posição da Imagem</label>
                                                    <div className="relative">
                                                        <select
                                                            value={localLayoutOrder}
                                                            onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                                        >
                                                            {localLayoutOrientation === 'vertical' ? (
                                                                <>
                                                                    <option value="image-first">Esquerda</option>
                                                                    <option value="image-last">Direita</option>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <option value="image-first">Acima do Texto</option>
                                                                    <option value="image-last">Abaixo do Texto</option>
                                                                </>
                                                            )}
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Tipo de Moldura</label>
                                                    <div className="relative">
                                                        <select
                                                            value={localImageFrame}
                                                            onChange={(e) => setLocalImageFrame(e.target.value as any)}
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="none">Sem moldura</option>
                                                            <option value="rounded-top">Portal</option>
                                                            <option value="book-cover">Quadrada</option>
                                                            <option value="trading-card">Arredondada</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION: ESTILO & TEMA */}
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => toggleSection('estilo')}
                                            className="flex items-center justify-between w-full text-left group hover:opacity-80 transition-opacity"
                                        >
                                            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Palette className="w-4 h-4 text-purple-400" /> ESTILO & TEMA
                                            </h3>
                                            {activeSections.estilo ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                        </button>

                                        {activeSections.estilo && (
                                            <div className="space-y-6 pl-2 border-l-2 border-border/50 ml-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Cor da Interface</label>
                                                    <div className="flex bg-input rounded-lg p-1 border border-input">
                                                        <button
                                                            onClick={() => handleThemeChange('dark')}
                                                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${localGameTheme === 'dark' ? 'bg-purple-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                                        >
                                                            Escuro
                                                        </button>
                                                        <button
                                                            onClick={() => handleThemeChange('light')}
                                                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${localGameTheme === 'light' ? 'bg-purple-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                                        >
                                                            Claro
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Temas Predefinidos</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {PREDEFINED_THEMES.map((theme) => (
                                                            <button
                                                                key={theme.name}
                                                                onClick={() => applyTheme(theme)}
                                                                className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-input hover:border-purple-500/50 hover:bg-input/80 transition-all gap-2 group"
                                                            >
                                                                <div className="flex -space-x-1">
                                                                    <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: theme.textColorLight }}></div>
                                                                    <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: theme.titleColor }}></div>
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
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cores do Sistema (Avançado)</span>
                                                        {activeSections.cores ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                                                    </button>
                                                    {activeSections.cores && (
                                                        <div className="mt-3 space-y-6 animate-in fade-in slide-in-from-top-1 px-1">
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-bold text-foreground border-b border-border/50 pb-1">Cores (Tema {localGameTheme === 'dark' ? 'Escuro' : 'Claro'})</h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                                    <ColorInput label="Texto Padrão" id="textColor" value={localTextColor} onChange={setLocalTextColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label="Título / Destaque" id="titleColor" value={localTitleColor} onChange={setLocalTitleColor} placeholder="#58A6FF" />
                                                                    <ColorInput label="Destaque (Foco)" id="focusColor" value={localFocusColor} onChange={setLocalFocusColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label="Seta Indicação" id="gameContinueIndicatorColor" value={localGameContinueIndicatorColor} onChange={setLocalGameContinueIndicatorColor} placeholder="#FFFFFF" />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-bold text-foreground border-b border-border/50 pb-1">Botões (Geral)</h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                                    <ColorInput label="Botão de Início" id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label="Texto Botão de Início" id="splashButtonTextColor" value={localSplashButtonTextColor} onChange={setLocalSplashButtonTextColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label="Botão Início (Hover)" id="splashButtonHoverColor" value={localSplashButtonHoverColor} onChange={setLocalSplashButtonHoverColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label="Botão de Ação" id="actionButtonColor" value={localActionButtonColor} onChange={setLocalActionButtonColor} placeholder="#FFFFFF" />
                                                                    <ColorInput label="Texto Botão de Ação" id="actionButtonTextColor" value={localActionButtonTextColor} onChange={setLocalActionButtonTextColor} placeholder="#FFFFFF" />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-bold text-foreground border-b border-border/50 pb-1">Box de Nome da Cena</h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                                    <ColorInput label="Fundo do Box" id="scenaNameBg" value={localGameSceneNameOverlayBg} onChange={setLocalGameSceneNameOverlayBg} placeholder="#000000" />
                                                                    <ColorInput label="Texto do Box" id="sceneNameText" value={localGameSceneNameOverlayTextColor} onChange={setLocalGameSceneNameOverlayTextColor} placeholder="#FFFFFF" />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-bold text-foreground border-b border-border/50 pb-1">Outros</h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                                    <ColorInput label="Fundo Principal" id="frameRoundedTopColor" value={localFrameRoundedTopColor} onChange={setLocalFrameRoundedTopColor} placeholder="#000000" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION: UI TEXT */}
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => toggleSection('texto')}
                                            className="flex items-center justify-between w-full text-left group hover:opacity-80 transition-opacity"
                                        >
                                            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Type className="w-4 h-4 text-purple-400" /> UI TEXT
                                            </h3>
                                            {activeSections.texto ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                        </button>

                                        {activeSections.texto && (
                                            <div className="space-y-6 pl-2 border-l-2 border-border/50 ml-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Botão de Ação (Principal)</label>
                                                    <input
                                                        type="text"
                                                        value={localActionButtonText}
                                                        onChange={(e) => setLocalActionButtonText(e.target.value)}
                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Placeholder do Input</label>
                                                    <input
                                                        type="text"
                                                        value={localVerbInputPlaceholder}
                                                        onChange={(e) => setLocalVerbInputPlaceholder(e.target.value)}
                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Fonte</label>
                                                        <div className="relative">
                                                            <select
                                                                value={localFontFamily}
                                                                onChange={(e) => setLocalFontFamily(e.target.value)}
                                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                                            >
                                                                {FONTS.map(font => (
                                                                    <option key={font.name} value={font.family}>{font.name}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Tamanho</label>
                                                        <div className="relative">
                                                            <select
                                                                value={localGameFontSize}
                                                                onChange={(e) => setLocalGameFontSize(e.target.value)}
                                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                                            >
                                                                <option value="12">Pequeno</option>
                                                                <option value="14">Médio</option>
                                                                <option value="16">Grande</option>
                                                            </select>
                                                            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* Right Column: Preview (Expanded width) */}
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
                                                            <div style={adaptedPanelStyles} className={panelClass}>
                                                                <div style={{ ...containerStyles, width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }} className={containerClass}>
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
                        )}

                </div >
            </div >

            {/* Fixed Action Footer to match SceneEditor */}
            < div className="fixed bottom-6 right-10 z-50 flex gap-2" >
                <button
                    onClick={handleUndo}
                    disabled={!isDirty}
                    className="px-4 py-2 bg-muted border border-border text-muted-foreground font-semibold rounded-lg hover:bg-muted/80 transition-all text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Desfazer
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                    Salvar
                </button>
            </div >
        </div >
    );
};

export default UIEditor;
