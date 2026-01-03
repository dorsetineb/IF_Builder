
import React, { useState, useEffect } from 'react';
import { GameData, FixedVerb } from '../types';
import { Upload, Trash2, Plus, TriangleAlert, SlidersHorizontal, Heart, Circle, X, Square, Diamond, Check, Image as ImageIcon, RotateCcw, Save } from 'lucide-react';

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
        <label htmlFor={id} className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{label}</label>
        <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-lg focus-within:border-purple-500/50 transition-all">
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
                className="w-full bg-transparent font-mono text-xs text-zinc-300 focus:outline-none focus:ring-0 uppercase"
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
        <div className="relative p-6 bg-zinc-900/30 rounded-xl border border-zinc-800/80 hover:border-purple-500/30 transition-all group">
            <button
                onClick={() => onRemove(verb.id)}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                title="Remover verbo"
            >
                <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label htmlFor={inputId} className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Verbos (separados por vírgula)</label>
                    <input
                        id={inputId}
                        type="text"
                        value={localVerbs}
                        onChange={e => setLocalVerbs(e.target.value)}
                        onBlur={handleVerbsBlur}
                        placeholder="ex: ajuda, help, ?"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 transition-all"
                    />
                </div>
                <div className="flex flex-col h-full">
                    <label htmlFor={`verb-desc-${verb.id}`} className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Descrição / Resposta</label>
                    <textarea
                        id={`verb-desc-${verb.id}`}
                        value={verb.description}
                        onChange={e => onUpdate(verb.id, 'description', e.target.value)}
                        placeholder="Texto que será exibido para o jogador."
                        rows={3}
                        className="w-full flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 transition-all resize-none"
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
        onNavigateToTrackers
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
        layout: 'Layout',
        sistemas: 'Sistemas',
        textos: 'Textos',
        cores: 'Cores & Tema',
        fim_de_jogo: 'Fim de Jogo',
        verbos: 'Verbos Fixos'
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
        textAnimationType, textSpeed, imageTransitionType, imageSpeed
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
        localTextAnimationType, localTextSpeed, localImageTransitionType, localImageSpeed,
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

        switch (frame) {
            case 'rounded-top':
                panelStyles.padding = '5px';
                panelStyles.backgroundColor = localFrameRoundedTopColor;
                panelStyles.border = 'none';
                panelStyles.borderRadius = '40px 40px 4px 4px';
                containerStyles.borderRadius = '35px 35px 0 0';
                break;
            case 'book-cover':
                panelStyles.padding = '10px';
                panelStyles.backgroundColor = localFrameBookColor;
                panelStyles.border = 'none';
                break;
            case 'trading-card':
                panelStyles.backgroundColor = localFrameTradingCardColor;
                panelStyles.borderRadius = '12px';
                panelStyles.padding = '4px';
                containerStyles.border = 'none';
                containerStyles.borderRadius = '8px';
                break;
            default:
                panelStyles.border = 'none';
                panelStyles.padding = '0';
        }
        return { panelStyles, containerStyles };
    };

    return (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-zinc-500 mt-1 text-sm font-medium">
                        Configure o título, a interface, as cores e as telas de vitória/derrota do seu jogo.
                    </p>
                </div>
                {isDirty && (
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest animate-pulse bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Alterações não salvas</span>
                    </div>
                )}
            </div>

            <div>
                <div className="border-b border-zinc-800 flex space-x-1 overflow-x-auto">
                    {Object.entries(TABS).map(([key, name]) => {
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeTab === key
                                    ? 'border-purple-500 text-zinc-100 bg-purple-500/5'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                                    }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-zinc-900/10 -mt-px py-8 grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-8 items-start px-6">
                    {activeTab === 'layout' && (
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Tela de Abertura</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                                    <div className="space-y-8 col-span-1">
                                        <div className="space-y-8">
                                            <div>
                                                <label htmlFor="splashContentAlignment" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Posicionamento do Conteúdo</label>
                                                <select
                                                    id="splashContentAlignment"
                                                    value={localSplashContentAlignment}
                                                    onChange={(e) => setLocalSplashContentAlignment(e.target.value as 'left' | 'right')}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-zinc-950 shadow-lg"
                                                >
                                                    <option value="right">Direita</option>
                                                    <option value="left">Esquerda</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center group cursor-pointer" onClick={() => setLocalOmitSplashTitle(!localOmitSplashTitle)}>
                                                <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${localOmitSplashTitle ? 'bg-purple-500 border-purple-500' : 'bg-zinc-950 border-zinc-800 group-hover:border-zinc-700'}`}>
                                                    {localOmitSplashTitle && <Circle className="w-2 h-2 fill-white stroke-none" />}
                                                </div>
                                                <label htmlFor="omitSplashTitle" className="ml-3 text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 cursor-pointer select-none transition-colors">Ocultar título e descrição</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 col-span-2">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center mb-1">Pré-visualização</p>
                                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex items-center justify-center shadow-inner h-full min-h-[300px]">
                                            <div
                                                className="relative w-full max-w-full aspect-video bg-zinc-900 border border-zinc-800/50 rounded-xl flex shadow-2xl overflow-hidden"
                                                style={{
                                                    justifyContent: localSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end',
                                                    alignItems: 'flex-end'
                                                }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center -translate-y-4">
                                                    <div className="text-zinc-800 font-black text-[8px] uppercase tracking-[0.2em] border-2 border-zinc-800/20 px-3 py-1 rounded">Imagem de Fundo</div>
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

                            <div className="pt-12 border-t border-zinc-800/50">
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Layout do Jogo</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                                    <div className="space-y-8 col-span-1">
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="orientation-select" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Orientação</label>
                                                <select
                                                    id="orientation-select"
                                                    value={localLayoutOrientation}
                                                    onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-zinc-950"
                                                >
                                                    <option value="vertical">Vertical</option>
                                                    <option value="horizontal">Horizontal</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="order-select" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Posição da Imagem</label>
                                                <select
                                                    id="order-select"
                                                    value={localLayoutOrder}
                                                    onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-zinc-950"
                                                >
                                                    <option value="image-first">{localLayoutOrientation === 'vertical' ? 'Esquerda' : 'Acima'}</option>
                                                    <option value="image-last">{localLayoutOrientation === 'vertical' ? 'Direita' : 'Abaixo'}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="frame-select" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Tipo de Moldura</label>
                                                <select
                                                    id="frame-select"
                                                    value={localImageFrame}
                                                    onChange={(e) => setLocalImageFrame(e.target.value as GameData['gameImageFrame'])}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-zinc-950"
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

                                    <div className="flex flex-col col-span-2">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center mb-4">Pré-visualização do Layout</p>
                                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex items-center justify-center h-full min-h-[300px] shadow-inner">
                                            <div
                                                className="w-full max-w-[400px] aspect-video border border-zinc-800/30 bg-zinc-900 rounded-xl flex p-3 gap-3 transition-all shadow-2xl overflow-hidden"
                                                style={{ flexDirection: localLayoutOrientation === 'horizontal' ? 'column' : 'row' }}
                                            >
                                                <div
                                                    className={`flex items-center justify-center ${localLayoutOrder === 'image-first' ? 'order-1' : 'order-2'} transition-all duration-300 ${localLayoutOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full'}`}
                                                    style={getFramePreviewStyles(localImageFrame).panelStyles}
                                                >
                                                    <div
                                                        className={`flex-1 w-full h-full rounded-lg flex items-center justify-center text-center text-[7px] p-2 font-black uppercase tracking-[0.2em] text-zinc-700 border border-zinc-800/30 bg-zinc-950 shadow-inner`}
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
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Configuração de Sistemas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="system-select" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Habilitar sistemas</label>
                                            <select
                                                id="system-select"
                                                value={localGameSystemEnabled}
                                                onChange={(e) => setLocalGameSystemEnabled(e.target.value as 'none' | 'chances' | 'trackers')}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all [&>option]:bg-zinc-950 shadow-lg"
                                            >
                                                <option value="none">Nenhum</option>
                                                <option value="chances">Chances (Vidas)</option>
                                                <option value="trackers">Rastreadores (Variáveis)</option>
                                            </select>
                                        </div>

                                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs text-zinc-400 leading-relaxed">
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
                                                        <label htmlFor="maxChances" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Máximo de Chances</label>
                                                        <input
                                                            type="number"
                                                            id="maxChances"
                                                            value={localMaxChances}
                                                            onChange={(e) => setLocalMaxChances(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                                                            min="1"
                                                            max="10"
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all shadow-lg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="chanceIcon" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Ícone</label>
                                                        <div className="flex gap-2">
                                                            <select
                                                                id="chanceIcon"
                                                                value={localChanceIcon}
                                                                onChange={(e) => setLocalChanceIcon(e.target.value as any)}
                                                                className="flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg"
                                                            >
                                                                <option value="heart">Corações</option>
                                                                <option value="circle">Círculos</option>
                                                                <option value="square">Quadrados</option>
                                                                <option value="diamond">Losangos</option>
                                                            </select>
                                                            <div className="flex-shrink-0 flex items-center justify-center w-12 bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg">
                                                                <ChanceIcon type={localChanceIcon} color={localChanceIconColor} className="w-5 h-5 shadow-[0_0_10px_rgba(168,85,247,0.2)]" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <ColorInput label="Cor dos Ícones" id="chanceIconColor" value={localChanceIconColor} onChange={setLocalChanceIconColor} placeholder="#ff4d4d" />

                                                <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                                                    <div>
                                                        <label htmlFor="chanceLossMessage" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Mensagem de Perda</label>
                                                        <input
                                                            type="text"
                                                            id="chanceLossMessage"
                                                            value={localChanceLossMessage}
                                                            onChange={(e) => setLocalChanceLossMessage(e.target.value)}
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-0 focus:border-purple-500/50 transition-all shadow-lg"
                                                            placeholder="Suas chances acabaram."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="chanceRestoreMessage" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Mensagem de Recuperação</label>
                                                        <input
                                                            type="text"
                                                            id="chanceRestoreMessage"
                                                            value={localChanceRestoreMessage}
                                                            onChange={(e) => setLocalChanceRestoreMessage(e.target.value)}
                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-0 focus:border-purple-500/50 transition-all shadow-lg"
                                                            placeholder="Suas chances foram restauradas."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {localGameSystemEnabled === 'trackers' && (
                                            <div className="flex flex-col items-center justify-center h-full p-8 bg-zinc-950 border border-zinc-800 border-dashed rounded-2xl text-center space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <SlidersHorizontal className="w-12 h-12 text-zinc-800 mb-2" />
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-300">Rastreadores Habilitados</p>
                                                    <p className="text-xs text-zinc-500 mt-2 max-w-[240px]">Para criar e editar as variáveis específicas do jogo, utilize a guia "Rastreadores" no menu superior.</p>
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
                                            <div className="h-full border border-zinc-800/30 rounded-2xl bg-zinc-950/20 flex items-center justify-center p-12 text-center text-zinc-700 font-bold uppercase tracking-[0.2em] text-[10px]">
                                                Nenhum sistema selecionado
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'abertura' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8 flex flex-col h-full">
                                <div className="space-y-2">
                                    <label htmlFor="gameTitle" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Título do Jogo</label>
                                    <input
                                        type="text"
                                        id="gameTitle"
                                        value={localTitle}
                                        onChange={(e) => setLocalTitle(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:ring-0 focus:border-purple-500/50 transition-all font-bold placeholder:text-zinc-800"
                                        placeholder="Ex: A Masmorra Esquecida"
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col flex-grow">
                                    <label htmlFor="splashDescription" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Descrição do Jogo</label>
                                    <textarea
                                        id="splashDescription"
                                        value={localSplashDescription}
                                        onChange={(e) => setLocalSplashDescription(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 focus:border-purple-500/50 transition-all flex-grow min-h-[200px] resize-none leading-relaxed placeholder:text-zinc-800"
                                        placeholder="Uma breve descrição da sua aventura..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-8 flex flex-col h-full">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Imagem de Fundo</h4>
                                    <div className="relative w-full h-[250px]">
                                        {localSplashImage ? (
                                            <div className="absolute inset-0 w-full h-full border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 group shadow-2xl">
                                                <img src={localSplashImage} alt="Fundo" className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-3 bg-zinc-950/40 backdrop-blur-sm">
                                                    <label className="p-3 bg-white text-zinc-950 rounded-lg cursor-pointer hover:bg-zinc-200 transition-all shadow-xl active:scale-95">
                                                        <Upload className="w-5 h-5" />
                                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalSplashImage)} className="hidden" />
                                                    </label>
                                                    <button onClick={() => setLocalSplashImage('')} className="p-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-900/30 rounded-xl cursor-pointer hover:bg-zinc-800/50 hover:border-purple-500/50 transition-all group overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Upload className="w-10 h-10 text-zinc-700 mb-4 transition-colors group-hover:text-purple-400" />
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300">Carregar Imagem de Fundo</span>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalSplashImage)} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-600 font-medium text-center italic">Recomendado: Full HD (1920x1080), proporção 16:9.</p>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-zinc-800/50">
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trilha Sonora Inicial</h4>
                                    <div className="flex items-center gap-3">
                                        <label className="flex-grow flex items-center justify-center px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-lg hover:bg-zinc-800 hover:text-white transition-all cursor-pointer text-[10px] uppercase tracking-widest shadow-lg">
                                            <Upload className="w-4 h-4 mr-2 text-purple-400" /> {localBackgroundMusic ? 'Alterar Música' : 'Carregar Música (.mp3)'}
                                            <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={(e) => handleAudioUpload(e, setLocalBackgroundMusic)} className="hidden" />
                                        </label>
                                        {localBackgroundMusic && (
                                            <button
                                                onClick={() => setLocalBackgroundMusic('')}
                                                className="p-3 bg-red-500/5 text-zinc-600 rounded-lg border border-zinc-800 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-lg"
                                                title="Remover Música"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-600 font-medium italic">Esta trilha começará a tocar assim que a tela de início for carregada.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'fim_de_jogo' && (
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Final Positivo</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                                    <div className="space-y-8 flex flex-col h-full col-span-1">
                                        <div className="space-y-2">
                                            <label htmlFor="posEndingContent" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Posicionamento do Conteúdo</label>
                                            <select
                                                id="posEndingContent"
                                                value={localPositiveEndingContentAlignment}
                                                onChange={(e) => setLocalPositiveEndingContentAlignment(e.target.value as 'left' | 'right')}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all [&>option]:bg-zinc-950 shadow-lg"
                                            >
                                                <option value="right">Direita</option>
                                                <option value="left">Esquerda</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 flex flex-col flex-grow">
                                            <label htmlFor="positiveEndingDescription" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Mensagem de Vitória</label>
                                            <textarea
                                                id="positiveEndingDescription"
                                                value={localPositiveEndingDescription}
                                                onChange={(e) => setLocalPositiveEndingDescription(e.target.value)}
                                                className="w-full flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-zinc-300 focus:ring-0 focus:border-purple-500/50 transition-all min-h-[160px] resize-none leading-relaxed placeholder:text-zinc-800"
                                                placeholder="Parabéns! Você venceu."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-8 col-span-2">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Imagem de Vitória</h4>
                                            <div className="relative w-full h-[225px]">
                                                {localPositiveEndingImage ? (
                                                    <div className="absolute inset-0 w-full h-full border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 group shadow-2xl">
                                                        <img src={localPositiveEndingImage} alt="Final Positivo" className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-3 bg-zinc-950/40 backdrop-blur-sm">
                                                            <label className="p-3 bg-white text-zinc-950 rounded-lg cursor-pointer hover:bg-zinc-200 transition-all shadow-xl">
                                                                <Upload className="w-5 h-5" />
                                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalPositiveEndingImage)} className="hidden" />
                                                            </label>
                                                            <button onClick={() => setLocalPositiveEndingImage('')} className="p-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-900/30 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-all group overflow-hidden">
                                                        <Upload className="w-10 h-10 text-zinc-700 mb-4 transition-colors group-hover:text-purple-400" />
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300">Carregar Imagem</span>
                                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalPositiveEndingImage)} className="hidden" />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4 pt-6 border-t border-zinc-800/50">
                                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trilha de Vitória</h4>
                                            <div className="flex items-center gap-3">
                                                <label className="flex-grow flex items-center justify-center px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold rounded-lg hover:bg-zinc-800 hover:text-white transition-all cursor-pointer text-[10px] uppercase tracking-widest shadow-lg">
                                                    <Upload className="w-4 h-4 mr-2 text-purple-400" /> {localPositiveEndingMusic ? 'Alterar Música' : 'Carregar Música (.mp3)'}
                                                    <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={(e) => handleAudioUpload(e, setLocalPositiveEndingMusic)} className="hidden" />
                                                </label>
                                                {localPositiveEndingMusic && (
                                                    <button onClick={() => setLocalPositiveEndingMusic('')} className="p-3 bg-red-500/5 text-zinc-600 rounded-lg border border-zinc-800 hover:bg-red-500 hover:text-white transition-all shadow-lg">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-zinc-800/50">
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Final Negativo</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                                    <div className="space-y-8 flex flex-col h-full col-span-1">
                                        <div className="space-y-2">
                                            <label htmlFor="negEndingContent" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Posicionamento do Conteúdo</label>
                                            <select
                                                id="negEndingContent"
                                                value={localNegativeEndingContentAlignment}
                                                onChange={(e) => setLocalNegativeEndingContentAlignment(e.target.value as 'left' | 'right')}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all [&>option]:bg-zinc-950 shadow-lg"
                                            >
                                                <option value="right">Direita</option>
                                                <option value="left">Esquerda</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 flex flex-col flex-grow">
                                            <label htmlFor="negativeEndingDescription" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Mensagem de Derrota</label>
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
                                                        <Upload className="w-10 h-10 text-zinc-700 mb-4 transition-colors group-hover:text-purple-400" />
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300">Carregar Imagem</span>
                                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalNegativeEndingImage)} className="hidden" />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4 pt-6 border-t border-zinc-800/50">
                                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trilha de Derrota</h4>
                                            <div className="flex items-center gap-3">
                                                <label className="flex-grow flex items-center justify-center px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold rounded-lg hover:bg-zinc-800 hover:text-white transition-all cursor-pointer text-[10px] uppercase tracking-widest shadow-lg">
                                                    <Upload className="w-4 h-4 mr-2 text-purple-400" /> {localNegativeEndingMusic ? 'Alterar Música' : 'Carregar Música (.mp3)'}
                                                    <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={(e) => handleAudioUpload(e, setLocalNegativeEndingMusic)} className="hidden" />
                                                </label>
                                                {localNegativeEndingMusic && (
                                                    <button onClick={() => setLocalNegativeEndingMusic('')} className="p-3 bg-red-500/5 text-zinc-600 rounded-lg border border-zinc-800 hover:bg-red-500 hover:text-white transition-all shadow-lg">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'textos' && (
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Textos da Interface</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-2">
                                        <label htmlFor="actionButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Texto do Botão de Ação</label>
                                        <input type="text" id="actionButtonText" value={localActionButtonText} onChange={(e) => setLocalActionButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="verbInputPlaceholder" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Texto do Campo de Comando</label>
                                        <input type="text" id="verbInputPlaceholder" value={localVerbInputPlaceholder} onChange={(e) => setLocalVerbInputPlaceholder(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="viewEndingButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Texto do Botão "Ver Final"</label>
                                        <input type="text" id="viewEndingButtonText" value={localViewEndingButtonText} onChange={(e) => setLocalViewEndingButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg placeholder:text-zinc-800" placeholder="Ver Final" />
                                        <p className="text-[10px] text-zinc-600 mt-2 italic">Aparece quando o jogo termina, para levar às telas de final.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="diaryPlayerName" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Nome do Jogador no Diário</label>
                                        <input type="text" id="diaryPlayerName" value={localDiaryPlayerName} onChange={(e) => setLocalDiaryPlayerName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="splashButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Texto do Botão de Início</label>
                                        <input type="text" id="splashButtonText" value={localSplashButtonText} onChange={(e) => setLocalSplashButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="INICIAR" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="continueButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Texto do Botão de Continuar</label>
                                        <input type="text" id="continueButtonText" value={localContinueButtonText} onChange={(e) => setLocalContinueButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Continuar Aventura" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="restartButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Texto do Botão de Reiniciar</label>
                                        <input type="text" id="restartButtonText" value={localRestartButtonText} onChange={(e) => setLocalRestartButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Reiniciar Aventura" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-zinc-800/50">
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Botões de Navegação</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-2">
                                        <label htmlFor="suggestionsButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Botão Sugestões</label>
                                        <input type="text" id="suggestionsButtonText" value={localSuggestionsButtonText} onChange={e => setLocalSuggestionsButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="inventoryButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Botão Inventário</label>
                                        <input type="text" id="inventoryButtonText" value={localInventoryButtonText} onChange={e => setLocalInventoryButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="diaryButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Botão Diário</label>
                                        <input type="text" id="diaryButtonText" value={localDiaryButtonText} onChange={e => setLocalDiaryButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="trackersButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Botão Rastreadores</label>
                                        <input type="text" id="trackersButtonText" value={localTrackersButtonText} onChange={e => setLocalTrackersButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed" placeholder="Rastreadores" disabled={localGameSystemEnabled !== 'trackers'} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="systemButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Botão Menu Sistema</label>
                                        <input type="text" id="systemButtonText" value={localSystemButtonText} onChange={e => setLocalSystemButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Sistema" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="mainMenuButtonText" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Botão Menu Principal</label>
                                        <input type="text" id="mainMenuButtonText" value={localMainMenuButtonText} onChange={e => setLocalMainMenuButtonText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Menu Principal" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-zinc-800/50">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Menu de Sistema</h3>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl group cursor-pointer" onClick={() => setLocalGameShowSystemButton(!localGameShowSystemButton)}>
                                        <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${localGameShowSystemButton ? 'bg-purple-500 border-purple-500' : 'bg-zinc-900 border-zinc-800 group-hover:border-zinc-700'}`}>
                                            {localGameShowSystemButton && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 select-none">Mostrar Menu de Sistema</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-2">
                                        <label htmlFor="saveMenuTitle" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Título Tela Salvar</label>
                                        <input type="text" id="saveMenuTitle" value={localSaveMenuTitle} onChange={e => setLocalSaveMenuTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Salvar Jogo" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="loadMenuTitle" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Título Tela Carregar</label>
                                        <input type="text" id="loadMenuTitle" value={localLoadMenuTitle} onChange={e => setLocalLoadMenuTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg" placeholder="Carregar Jogo" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-zinc-800/50">
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Efeitos de Texto</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-2">
                                        <label htmlFor="textAnimationType" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Estilo de Animação</label>
                                        <select
                                            id="textAnimationType"
                                            value={localTextAnimationType}
                                            onChange={(e) => setLocalTextAnimationType(e.target.value as 'fade' | 'typewriter')}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/30 transition-all shadow-lg"
                                        >
                                            <option value="fade">Esmaecer (Fade In)</option>
                                            <option value="typewriter">Máquina de Escrever (Letra a letra)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="textSpeed" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Velocidade da Animação</label>
                                        <div className="flex items-center gap-6 px-2">
                                            <input
                                                type="range"
                                                id="textSpeed"
                                                min="1"
                                                max="5"
                                                value={localTextSpeed}
                                                onChange={(e) => setLocalTextSpeed(parseInt(e.target.value, 10))}
                                                className="flex-grow h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                            />
                                            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-purple-400 shadow-inner">
                                                {localTextSpeed}
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-[9px] text-zinc-600 font-bold uppercase tracking-tighter px-2">
                                            <span>Lento</span>
                                            <span>Rápido</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'cores' && (
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Temas Predefinidos</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { id: 'dark', name: 'GitHub Dark', primary: '#30363d', accent: '#58a6ff' },
                                        { id: 'light', name: 'GitHub Light', primary: '#ffffff', accent: '#0969da' },
                                        { id: 'zinc', name: 'Zinc & Purple', primary: '#09090b', accent: '#a855f7' },
                                        { id: 'slate', name: 'Slate & Blue', primary: '#0f172a', accent: '#3b82f6' }
                                    ].map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setLocalGameTheme(theme.id as 'dark' | 'light')}
                                            className={`group relative p-4 rounded-xl border-2 transition-all ${localGameTheme === theme.id ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'border-zinc-800 hover:border-zinc-700'}`}
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter group-hover:text-zinc-200">{theme.name}</span>
                                            </div>
                                            {localGameTheme === theme.id && (
                                                <div className="absolute -top-2 -right-2 bg-purple-500 text-white p-1 rounded-full shadow-lg">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-12 border-t border-zinc-800/50">
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Cores do Sistema</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                                    <ColorInput label="Título do Jogo" id="titleColor" value={localTitleColor} onChange={setLocalTitleColor} placeholder="#FFFFFF" />
                                    <ColorInput label="Texto Geral" id="textColor" value={localTextColor} onChange={setLocalTextColor} placeholder="#FFFFFF" />
                                    <ColorInput label="Destaque / Foco" id="focusColor" value={localFocusColor} onChange={setLocalFocusColor} placeholder="#FFFFFF" />
                                    <ColorInput label="Seta de Indicação" id="gameContinueIndicatorColor" value={localGameContinueIndicatorColor} onChange={setLocalGameContinueIndicatorColor} placeholder="#FFFFFF" />
                                </div>
                            </div>

                            <div className="pt-12 border-t border-zinc-800/50">
                                <h3 className="text-xs font-bold text-zinc-100 mb-8 uppercase tracking-widest">Cores dos Botões</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                                    <ColorInput label="Botão de Início" id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#FFFFFF" />
                                    <ColorInput label="Texto do Botão Início" id="splashButtonTextColor" value={localSplashButtonTextColor} onChange={setLocalSplashButtonTextColor} placeholder="#FFFFFF" />
                                    <ColorInput label="Botão de Ação" id="actionButtonColor" value={localActionButtonColor} onChange={setLocalActionButtonColor} placeholder="#FFFFFF" />
                                    <ColorInput label="Texto do Botão Ação" id="actionButtonTextColor" value={localActionButtonTextColor} onChange={setLocalActionButtonTextColor} placeholder="#FFFFFF" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'verbos' && (
                        <div className="space-y-8">
                            <div className="bg-purple-500/5 border border-purple-500/10 p-6 rounded-2xl flex items-start gap-4">
                                <TriangleAlert className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Informação de Verbos</h4>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        Os verbos <strong className="text-zinc-200">olhar</strong> e <strong className="text-zinc-200">examinar</strong> são ações fundamentais e já estão integradas por padrão. Adicione aqui apenas verbos específicos que devem estar disponíveis globalmente em toda a aventura.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {localFixedVerbs.map((verb) => (
                                    <FixedVerbItem
                                        key={verb.id}
                                        verb={verb}
                                        onUpdate={handleFixedVerbChange}
                                        onRemove={handleRemoveFixedVerb}
                                    />
                                ))}

                                {localFixedVerbs.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-zinc-900 rounded-2xl bg-zinc-950/30">
                                        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Nenhum verbo global definido</p>
                                    </div>
                                )}

                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={handleAddFixedVerb}
                                        className="flex items-center px-6 py-3 bg-zinc-100 text-zinc-950 font-bold rounded-xl hover:bg-white transition-all active:scale-95 shadow-xl text-xs uppercase tracking-widest"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Adicionar Novo Verbo Global
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Right Column: Live Preview at the correct level */}
                    <div className="hidden xl:block h-fit sticky top-8">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Prévia em Tempo Real</h3>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                </div>
                            </div>

                            <div
                                className={`w-full aspect-video rounded-2xl overflow-hidden border-4 shadow-2xl transition-all ${localGameTheme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-100'}`}
                                style={{ fontFamily: localFontFamily, fontSize: `${localGameFontSize}px` }}
                            >
                                <div className="h-full flex flex-col p-6 space-y-4">
                                    <div className="flex-grow flex gap-6">
                                        {/* Image Placeholder */}
                                        <div
                                            className="w-1/3 rounded-xl border-zinc-800 border flex items-center justify-center relative overflow-hidden bg-zinc-900/50"
                                            style={getFramePreviewStyles(localImageFrame).containerStyles}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                                <ImageIcon className="w-12 h-12" />
                                            </div>
                                            <div className="relative text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Imagem</div>
                                        </div>

                                        {/* Text Preview */}
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 w-2/3 bg-zinc-800/50 rounded-full animate-pulse" style={{ backgroundColor: localTitleColor }} />
                                            <div className="space-y-2">
                                                <div className="h-2 w-full bg-zinc-800/20 rounded-full" style={{ backgroundColor: localTextColor, opacity: 0.1 }} />
                                                <div className="h-2 w-full bg-zinc-800/20 rounded-full" style={{ backgroundColor: localTextColor, opacity: 0.1 }} />
                                                <div className="h-2 w-4/5 bg-zinc-800/20 rounded-full" style={{ backgroundColor: localTextColor, opacity: 0.1 }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input Preview */}
                                    <div className="pt-4 border-t border-zinc-900 flex gap-3">
                                        <div className="flex-1 h-10 rounded-lg border-2 border-zinc-900 bg-zinc-950/50 flex items-center px-4">
                                            <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">{localVerbInputPlaceholder || 'Comando...'}</span>
                                        </div>
                                        <div className="px-6 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center shadow-lg" style={{ backgroundColor: localActionButtonColor, color: localActionButtonTextColor }}>
                                            {localActionButtonText || 'Ação'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-zinc-600 italic text-center font-bold uppercase tracking-tighter">Esquema visual básico do estilo selecionado</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 p-6 pointer-events-none z-50 mt-auto border-t border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm -mx-6 -mb-6">
                <div className="max-w-7xl mx-auto flex justify-end gap-3 pointer-events-auto">
                    <button
                        onClick={handleUndo}
                        disabled={!isDirty}
                        className="group flex items-center px-6 py-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-zinc-400 font-bold rounded-xl hover:bg-zinc-800 hover:text-zinc-100 transition-all disabled:opacity-0 disabled:translate-y-4 shadow-2xl overflow-hidden relative"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        <span className="text-xs uppercase tracking-widest">Desfazer</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="flex items-center px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-all active:scale-95 disabled:opacity-0 disabled:translate-y-4 shadow-[0_10px_30px_rgba(147,51,234,0.3)]"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        <span className="text-xs uppercase tracking-widest">Salvar Alterações</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UIEditor;
