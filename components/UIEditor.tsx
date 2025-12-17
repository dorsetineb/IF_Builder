import React, { useState, useEffect } from 'react';
import { GameData, FixedVerb } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { AdjustmentsHorizontalIcon } from './icons/AdjustmentsHorizontalIcon';

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
  
  // Game Info Props
  title: string;
  logo: string;
  omitSplashTitle: boolean;
  splashImage: string;
  splashContentAlignment: 'left' | 'right';
  splashDescription: string;
  backgroundMusic: string; // Global BGM
  positiveEndingImage: string;
  positiveEndingContentAlignment: 'left' | 'right';
  positiveEndingDescription: string;
  negativeEndingImage: string;
  negativeEndingContentAlignment: 'left' | 'right';
  negativeEndingDescription: string;
  fixedVerbs: FixedVerb[];

  // Transition Props
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
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-dim mb-1">{label}</label>
        <div className="flex items-center gap-2 p-1 bg-brand-bg border border-brand-border rounded-md focus-within:ring-0">
            <input
                type="color"
                id={`${id}-picker`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                aria-label={`Seletor de cor para ${label}`}
            />
            <input
                type="text"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent font-mono text-sm focus:outline-none focus:ring-0"
                placeholder={placeholder}
            />
        </div>
    </div>
);

// Sub-component to manage local state for the verbs input field
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
    <div className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
      <button
        onClick={() => onRemove(verb.id)}
        className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors"
        title="Remover verbo"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label htmlFor={inputId} className="block text-sm font-medium text-brand-text-dim mb-1">Verbos (separados por vírgula)</label>
          <input
            id={inputId}
            type="text"
            value={localVerbs}
            onChange={e => setLocalVerbs(e.target.value)}
            onBlur={handleVerbsBlur}
            placeholder="ex: ajuda, help, ?"
            className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
          />
        </div>
        <div className="flex flex-col h-full">
          <label htmlFor={`verb-desc-${verb.id}`} className="block text-sm font-medium text-brand-text-dim mb-1">Descrição / Resposta</label>
          <textarea
            id={`verb-desc-${verb.id}`}
            value={verb.description}
            onChange={e => onUpdate(verb.id, 'description', e.target.value)}
            placeholder="Texto que será exibido para o jogador."
            rows={3}
            className="w-full flex-grow bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
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
      gameTheme, textColorLight, titleColorLight, focusColorLight,
      frameBookColor, frameTradingCardColor,
      frameRoundedTopColor,
      gameSceneNameOverlayBg,
      gameSceneNameOverlayTextColor,
      gameShowTrackersUI, gameShowSystemButton, suggestionsButtonText, inventoryButtonText, diaryButtonText, trackersButtonText,
      gameSystemButtonText, gameSaveMenuTitle, gameLoadMenuTitle, gameMainMenuButtonText,
      gameContinueIndicatorColor,
      
      // Game Info Props
      title, logo, omitSplashTitle, 
      splashImage, splashContentAlignment, splashDescription,
      backgroundMusic,
      positiveEndingImage, positiveEndingContentAlignment, positiveEndingDescription,
      negativeEndingImage, negativeEndingContentAlignment, negativeEndingDescription,
      fixedVerbs,
      // Transition Props
      textAnimationType, textSpeed, imageTransitionType, imageSpeed,
      onNavigateToTrackers
  } = props;

  // State from UIEditor
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
  const [activeTab, setActiveTab] = useState('abertura');

  // State from ThemeEditor
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

  // State from GameInfoEditor
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
  const [localNegativeEndingImage, setLocalNegativeEndingImage] = useState(negativeEndingImage);
  const [localNegativeEndingContentAlignment, setLocalNegativeEndingContentAlignment] = useState(negativeEndingContentAlignment);
  const [localNegativeEndingDescription, setLocalNegativeEndingDescription] = useState(negativeEndingDescription);
  const [localFixedVerbs, setLocalFixedVerbs] = useState(fixedVerbs);

  // State from Transitions
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
    transicoes: 'Transições',
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
    // Sync all local states with props
    setLocalLayoutOrientation(layoutOrientation);
    setLocalLayoutOrder(layoutOrder);
    setLocalImageFrame(imageFrame);
    setLocalActionButtonText(actionButtonText);
    setLocalVerbInputPlaceholder(verbInputPlaceholder);
    setLocalDiaryPlayerName(diaryPlayerName);
    setLocalSplashButtonText(splashButtonText);
    setLocalContinueButtonText(continueButtonText);
    setLocalRestartButtonText(restartButtonText);
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
    // Game Info Sync
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
    setLocalNegativeEndingImage(negativeEndingImage);
    setLocalNegativeEndingContentAlignment(negativeEndingContentAlignment);
    setLocalNegativeEndingDescription(negativeEndingDescription);
    setLocalFixedVerbs(fixedVerbs);
    // Transitions Sync
    setLocalTextAnimationType(textAnimationType);
    setLocalTextSpeed(textSpeed);
    setLocalImageTransitionType(imageTransitionType);
    setLocalImageSpeed(imageSpeed);
  }, [
    layoutOrientation, layoutOrder, imageFrame, actionButtonText, verbInputPlaceholder, diaryPlayerName, splashButtonText, continueButtonText, restartButtonText, gameSystemEnabled, maxChances,
    textColor, titleColor, splashButtonColor, splashButtonHoverColor, splashButtonTextColor, actionButtonColor, actionButtonTextColor, focusColor,
    chanceIconColor, gameFontFamily, gameFontSize, chanceIcon, chanceReturnButtonText, gameTheme, textColorLight, titleColorLight, focusColorLight,
    frameBookColor, frameTradingCardColor,
    frameRoundedTopColor, gameSceneNameOverlayBg, gameSceneNameOverlayTextColor, gameContinueIndicatorColor,
    gameShowTrackersUI, gameShowSystemButton, suggestionsButtonText, inventoryButtonText, diaryButtonText, trackersButtonText,
    gameSystemButtonText, gameSaveMenuTitle, gameLoadMenuTitle, gameMainMenuButtonText,
    title, logo, omitSplashTitle, splashImage, splashContentAlignment, splashDescription, backgroundMusic,
    positiveEndingImage, positiveEndingContentAlignment, positiveEndingDescription,
    negativeEndingImage, negativeEndingContentAlignment, negativeEndingDescription, fixedVerbs,
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
                  localNegativeEndingImage !== negativeEndingImage ||
                  localNegativeEndingContentAlignment !== negativeEndingContentAlignment ||
                  localNegativeEndingDescription !== negativeEndingDescription ||
                  JSON.stringify(localFixedVerbs) !== JSON.stringify(fixedVerbs) ||
                  localTextAnimationType !== textAnimationType ||
                  localTextSpeed !== textSpeed ||
                  localImageTransitionType !== imageTransitionType ||
                  localImageSpeed !== imageSpeed;
    onSetDirty(dirty);
  }, [
    localLayoutOrientation, localLayoutOrder, localImageFrame, localActionButtonText, localVerbInputPlaceholder, localDiaryPlayerName, localSplashButtonText, localContinueButtonText, localRestartButtonText, localGameSystemEnabled, localMaxChances, localGameShowTrackersUI, localGameShowSystemButton, localSuggestionsButtonText, localInventoryButtonText, localDiaryButtonText, localTrackersButtonText,
    localSystemButtonText, localSaveMenuTitle, localLoadMenuTitle, localMainMenuButtonText,
    localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor, localSplashButtonTextColor, localActionButtonColor, localActionButtonTextColor, localFocusColor, localChanceIconColor, localFontFamily, localGameFontSize, localChanceIcon, localChanceReturnButtonText, localGameTheme, localTextColorLight, localTitleColorLight, localFocusColorLight,
    localFrameBookColor, localFrameTradingCardColor,
    frameRoundedTopColor, localGameSceneNameOverlayBg, localGameSceneNameOverlayTextColor, localGameContinueIndicatorColor,
    localTitle, localLogo, localOmitSplashTitle, localSplashImage, localSplashContentAlignment, localSplashDescription, localBackgroundMusic,
    localPositiveEndingImage, localPositiveEndingContentAlignment, localPositiveEndingDescription,
    localNegativeEndingImage, localNegativeEndingContentAlignment, localNegativeEndingDescription, localFixedVerbs,
    localTextAnimationType, localTextSpeed, localImageTransitionType, localImageSpeed,
    props, onSetDirty
  ]);

  const handleSave = () => {
    // UIEditor fields
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
    // ThemeEditor fields
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
    if (localChanceReturnButtonText !== chanceReturnButtonText) onUpdate('gameChanceReturnButtonText', localChanceReturnButtonText);
    if (localGameTheme !== gameTheme) onUpdate('gameTheme', localGameTheme);
    if (localTextColorLight !== textColorLight) onUpdate('gameTextColorLight', localTextColorLight);
    if (localTitleColorLight !== titleColorLight) onUpdate('gameTitleColorLight', localTitleColorLight);
    if (localFocusColorLight !== focusColorLight) onUpdate('gameFocusColorLight', localFocusColorLight);
    if (localFrameBookColor !== frameBookColor) onUpdate('frameBookColor', localFrameBookColor);
    if (localFrameTradingCardColor !== frameTradingCardColor) onUpdate('frameTradingCardColor', localFrameTradingCardColor);
    if (localFrameRoundedTopColor !== frameRoundedTopColor) onUpdate('frameRoundedTopColor', localFrameRoundedTopColor);
    if (localGameSceneNameOverlayBg !== gameSceneNameOverlayBg) onUpdate('gameSceneNameOverlayBg', localGameSceneNameOverlayBg);
    if (localGameSceneNameOverlayTextColor !== gameSceneNameOverlayTextColor) onUpdate('gameSceneNameOverlayTextColor', localGameSceneNameOverlayTextColor);
    if (localGameContinueIndicatorColor !== gameContinueIndicatorColor) onUpdate('gameContinueIndicatorColor', localGameContinueIndicatorColor);
    // Game Info Fields
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
    if (localNegativeEndingImage !== negativeEndingImage) onUpdate('negativeEndingImage', localNegativeEndingImage);
    if (localNegativeEndingContentAlignment !== negativeEndingContentAlignment) onUpdate('negativeEndingContentAlignment', localNegativeEndingContentAlignment);
    if (localNegativeEndingDescription !== negativeEndingDescription) onUpdate('negativeEndingDescription', localNegativeEndingDescription);
    if (JSON.stringify(localFixedVerbs) !== JSON.stringify(fixedVerbs)) onUpdate('fixedVerbs', localFixedVerbs);
    // Transitions Fields
    if (localTextAnimationType !== textAnimationType) onUpdate('gameTextAnimationType', localTextAnimationType);
    if (localTextSpeed !== textSpeed) onUpdate('gameTextSpeed', localTextSpeed);
    if (localImageTransitionType !== imageTransitionType) onUpdate('gameImageTransitionType', localImageTransitionType);
    if (localImageSpeed !== imageSpeed) onUpdate('gameImageSpeed', localImageSpeed);
  };
  
  const handleUndo = () => {
    // UIEditor fields
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
    // ThemeEditor fields
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
    // Game Info Fields
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
    setLocalNegativeEndingImage(negativeEndingImage);
    setLocalNegativeEndingContentAlignment(negativeEndingContentAlignment);
    setLocalNegativeEndingDescription(negativeEndingDescription);
    setLocalFixedVerbs(fixedVerbs);
    // Transitions Fields
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

  // ... (Icons and other helper functions remain same) ...
  const HeartIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
      <svg fill={color} viewBox="0 0 24 24" className={className}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
  );

  const CircleIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
    <svg fill={color} viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );

  const CrossIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
    <svg stroke={color} strokeWidth="8" strokeLinecap="round" viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 5 V19 M5 12 H19"/>
    </svg>
  );

  const SquareIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
    <svg fill={color} viewBox="0 0 24 24" className={className}>
      <rect x="5" y="5" width="14" height="14" rx="1" />
    </svg>
  );

  const DiamondIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
    <svg fill={color} viewBox="0 0 24 24" className={className}>
      <path d="M12 2l10 10-10 10L2 12z" />
    </svg>
  );

  const ChanceIcon: React.FC<{ type: any, color: string, className?: string }> = ({ type, color, className }) => {
    switch (type) {
        case 'heart': return <HeartIcon color={color} className={className} />;
        case 'circle': return <CircleIcon color={color} className={className} />;
        case 'cross': return <CrossIcon color={color} className={className} />;
        case 'square': return <SquareIcon color={color} className={className} />;
        case 'diamond': return <DiamondIcon color={color} className={className} />;
        default: return <HeartIcon color={color} className={className} />;
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
          default: // 'none' frame
              panelStyles.border = 'none';
              panelStyles.padding = '0';
      }
      return { panelStyles, containerStyles };
  };

  const { panelStyles, containerStyles } = getFramePreviewStyles(localImageFrame);


  return (
    <div className="space-y-6 pb-24">
      {/* ... Header and Tabs ... */}
      <div className="flex justify-between items-start">
        <div>
            <p className="text-brand-text-dim mt-1 text-sm">
                Configure o título, a interface, as cores e as telas de vitória/derrota do seu jogo.
            </p>
        </div>
        {isDirty && (
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-medium animate-pulse">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Alterações não salvas</span>
            </div>
        )}
      </div>
      
      <div>
        <div className="border-b border-brand-border flex space-x-1 overflow-x-auto">
          {Object.entries(TABS).map(([key, name]) => {
              return (
                  <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`px-4 py-2 font-semibold text-sm rounded-t-md transition-colors whitespace-nowrap ${
                          activeTab === key
                              ? 'bg-brand-surface text-brand-primary'
                              : 'text-brand-text-dim hover:text-brand-text'
                      }`}
                  >
                      {name}
                  </button>
              );
          })}
        </div>

        <div className="bg-brand-surface -mt-px p-6">
          {activeTab === 'layout' && (
              <div className="space-y-12">
                  {/* Tela de Abertura Section */}
                  <div>
                      <h3 className="text-lg font-semibold text-brand-text mb-4">Tela de Abertura</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="splashContentAlignment" className="text-sm font-medium text-brand-text-dim mb-1 block">Posicionamento do Conteúdo</label>
                                <select
                                    id="splashContentAlignment"
                                    value={localSplashContentAlignment}
                                    onChange={(e) => setLocalSplashContentAlignment(e.target.value as 'left' | 'right')}
                                    className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                                >
                                    <option value="right">Direita</option>
                                    <option value="left">Esquerda</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="omitSplashTitle"
                                  checked={localOmitSplashTitle}
                                  onChange={(e) => setLocalOmitSplashTitle(e.target.checked)}
                                  className="custom-checkbox"
                                />
                                <label htmlFor="omitSplashTitle" className="ml-2 text-sm text-brand-text-dim">Ocultar título do jogo e descrição da tela de abertura</label>
                            </div>
                        </div>

                        <div className="space-y-2">
                           <p className="text-sm text-brand-text-dim mb-1 text-center">Pré-visualização da Abertura</p>
                           <div className="bg-brand-bg border border-brand-border rounded-lg p-4 flex items-center justify-center">
                                <div
                                    className="relative w-full max-w-[400px] aspect-video bg-brand-bg border border-brand-border rounded-md flex"
                                    style={{
                                        justifyContent: localSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end',
                                        alignItems: 'flex-end'
                                    }}
                                >
                                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-text-dim font-semibold text-xs">
                                        Imagem de Fundo
                                    </div>
                                    {!localOmitSplashTitle && (
                                        <div
                                            className="w-2/3 h-1/3 m-8 bg-brand-primary/10 border border-brand-primary rounded-md flex items-center justify-center text-center text-xs p-2 text-brand-primary font-semibold"
                                        >
                                            Título e Descrição
                                        </div>
                                    )}
                                </div>
                           </div>
                        </div>
                      </div>
                  </div>
                  
                  {/* Layout do Jogo Section */}
                  <div className="pt-8 border-t border-brand-border/50">
                      <h3 className="text-lg font-semibold text-brand-text mb-4">Layout do Jogo</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="orientation-select" className="block text-sm font-medium text-brand-text-dim mb-1">Orientação</label>
                                    <select
                                        id="orientation-select"
                                        value={localLayoutOrientation}
                                        onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                                    >
                                        <option value="vertical">Vertical</option>
                                        <option value="horizontal">Horizontal</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="order-select" className="block text-sm font-medium text-brand-text-dim mb-1">Posição da Imagem</label>
                                    <select
                                        id="order-select"
                                        value={localLayoutOrder}
                                        onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                                    >
                                        <option value="image-first">{localLayoutOrientation === 'vertical' ? 'Esquerda' : 'Acima'}</option>
                                        <option value="image-last">{localLayoutOrientation === 'vertical' ? 'Direita' : 'Abaixo'}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="frame-select" className="block text-sm font-medium text-brand-text-dim mb-1">Tipo de Moldura</label>
                                    <select
                                        id="frame-select"
                                        value={localImageFrame}
                                        onChange={(e) => setLocalImageFrame(e.target.value as GameData['gameImageFrame'])}
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
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
                          
                          <div className="flex flex-col">
                              <p className="text-sm text-brand-text-dim mb-1 text-center">Pré-visualização do Layout</p>
                              <div className="bg-brand-bg border border-brand-border rounded-lg p-4 flex items-center justify-center h-full min-h-[200px]">
                                <div 
                                    className="w-full max-w-[400px] aspect-video border-2 border-brand-border/50 rounded-lg flex p-2 gap-2 transition-all"
                                    style={{ flexDirection: localLayoutOrientation === 'horizontal' ? 'column' : 'row' }}
                                >
                                    <div 
                                        className={`flex items-center justify-center ${localLayoutOrder === 'image-first' ? 'order-1' : 'order-2'} transition-all duration-300 ${localLayoutOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full'}`}
                                        style={getFramePreviewStyles(localImageFrame).panelStyles}
                                    >
                                        <div 
                                            className={`flex-1 w-full h-full rounded flex items-center justify-center text-center text-xs p-2 font-semibold text-brand-text-dim border border-brand-border bg-brand-bg`}
                                            style={{
                                                ...getFramePreviewStyles(localImageFrame).containerStyles,
                                                backgroundColor: undefined
                                            }}
                                        >
                                            Imagem da Cena
                                        </div>
                                    </div>
                                    <div className={`flex-1 bg-brand-primary/10 border border-brand-primary rounded flex items-center justify-center text-center text-xs p-2 text-brand-primary font-semibold ${localLayoutOrder === 'image-first' ? 'order-2' : 'order-1'} ${localLayoutOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full'}`}>
                                        Descrição da Cena
                                    </div>
                                </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'sistemas' && (
              <div className="space-y-8">
                   <h3 className="text-lg font-semibold text-brand-text mb-4">Configuração de Sistemas</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div>
                            <label htmlFor="system-select" className="block text-sm font-medium text-brand-text-dim mb-1">Habilitar sistemas</label>
                            <select
                                id="system-select"
                                value={localGameSystemEnabled}
                                onChange={(e) => setLocalGameSystemEnabled(e.target.value as 'none' | 'chances' | 'trackers')}
                                className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                            >
                                <option value="none">Nenhum</option>
                                <option value="chances">Chances</option>
                                <option value="trackers">Rastreadores</option>
                            </select>
                            
                            <div className="mt-4 p-4 rounded-md bg-brand-bg/50 border border-brand-border text-sm text-brand-text-dim">
                                {localGameSystemEnabled === 'none' && "Nenhum sistema de jogo adicional habilitado."}
                                {localGameSystemEnabled === 'chances' && (
                                    <>
                                        Gerencie a 'vida' do jogador. Defina um máximo de tentativas.
                                        <br />
                                        Se acabarem, o jogo exibe a tela de Final Negativo.
                                    </>
                                )}
                                {localGameSystemEnabled === 'trackers' && (
                                    <>
                                        Crie variáveis (Ex: Vida, Dinheiro, Sanidade). Defina valores iniciais e máximos.
                                        <br />
                                        Ações podem alterar esses valores e levar a cenas específicas.
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                             {localGameSystemEnabled === 'chances' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="maxChances" className="block text-sm font-medium text-brand-text-dim mb-1">Número de Chances</label>
                                            <input
                                                type="number"
                                                id="maxChances"
                                                value={localMaxChances}
                                                onChange={(e) => setLocalMaxChances(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                                                min="1"
                                                max="10"
                                                className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="chanceIcon" className="block text-sm font-medium text-brand-text-dim mb-1">Formato do Ícone</label>
                                            <div className="flex gap-2">
                                                <select
                                                    id="chanceIcon"
                                                    value={localChanceIcon}
                                                    onChange={(e) => setLocalChanceIcon(e.target.value as any)}
                                                    className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                                                >
                                                    <option value="heart">Corações</option>
                                                    <option value="circle">Círculos</option>
                                                    <option value="square">Quadrados</option>
                                                    <option value="diamond">Losangos</option>
                                                </select>
                                                <div className="flex-shrink-0 flex items-center justify-center w-10 bg-brand-bg border border-brand-border rounded-md">
                                                    <ChanceIcon type={localChanceIcon} color={chanceIconColor} className="w-5 h-5"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ColorInput label="Cor do Ícone" id="chanceIconColor" value={chanceIconColor} onChange={(val) => onUpdate('gameChanceIconColor', val)} placeholder="#ff4d4d" />
                                    <div>
                                        <label htmlFor="chanceReturnButton" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Retorno</label>
                                        <input
                                            type="text"
                                            id="chanceReturnButton"
                                            value={chanceReturnButtonText}
                                            onChange={(e) => onUpdate('gameChanceReturnButtonText', e.target.value)}
                                            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                                        />
                                        <p className="text-xs text-brand-text-dim mt-1">Aparece após perder uma chance.</p>
                                    </div>
                                </>
                             )}

                             {localGameSystemEnabled === 'trackers' && (
                                <div className="flex flex-col gap-4">
                                     <div className="flex items-center">
                                          <input
                                              type="checkbox"
                                              id="showTrackersUI"
                                              checked={!!localGameShowTrackersUI}
                                              onChange={e => setLocalGameShowTrackersUI(e.target.checked)}
                                              className="custom-checkbox"
                                          />
                                          <label htmlFor="showTrackersUI" className="ml-2 block text-sm text-brand-text-dim font-bold text-brand-primary">
                                              Mostrar botão de visualização dos rastreadores no jogo
                                          </label>
                                      </div>
                                      
                                      <div className="pt-2">
                                          <button
                                              onClick={onNavigateToTrackers}
                                              className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors text-sm"
                                          >
                                              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                                              Gerenciar Rastreadores
                                          </button>
                                          <p className="text-xs text-brand-text-dim mt-2">Clique acima para configurar as variáveis do jogo (vida, dinheiro, etc.).</p>
                                      </div>
                                </div>
                             )}
                        </div>
                   </div>
              </div>
          )}

          {activeTab === 'abertura' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6 flex flex-col h-full">
                       <div className="space-y-2">
                          <label htmlFor="gameTitle" className="text-lg font-semibold text-brand-text mb-2 block">Título do Jogo</label>
                          <input
                            type="text"
                            id="gameTitle"
                            value={localTitle}
                            onChange={(e) => setLocalTitle(e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                            placeholder="Ex: A Masmorra Esquecida"
                          />
                      </div>
                      <div className="space-y-2 flex flex-col flex-grow">
                          <label htmlFor="splashDescription" className="text-lg font-semibold text-brand-text mb-2 block">Descrição do Jogo</label>
                          <textarea
                            id="splashDescription"
                            value={localSplashDescription}
                            onChange={(e) => setLocalSplashDescription(e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 flex-grow text-sm min-h-[150px]"
                            placeholder="Uma breve descrição da sua aventura..."
                          />
                      </div>
                  </div>

                  <div className="space-y-6 flex flex-col h-full">
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-brand-text">Imagem de Fundo</h4>
                            <div className="relative w-full h-[200px]">
                                {localSplashImage ? (
                                    <div className="absolute inset-0 w-full h-full border border-brand-border rounded-md overflow-hidden bg-brand-bg group">
                                         <img src={localSplashImage} alt="Fundo" className="w-full h-full object-cover" />
                                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                              <label className="p-2 bg-brand-primary text-brand-bg rounded-md cursor-pointer hover:bg-brand-primary-hover">
                                                 <UploadIcon className="w-5 h-5" />
                                                 <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalSplashImage)} className="hidden" />
                                              </label>
                                              <button onClick={() => setLocalSplashImage('')} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                                  <TrashIcon className="w-5 h-5" />
                                              </button>
                                         </div>
                                    </div>
                                ) : (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-brand-border bg-brand-bg/50 rounded-md cursor-pointer hover:bg-brand-border/30 transition-colors">
                                        <UploadIcon className="w-8 h-8 text-brand-text-dim mb-2" />
                                        <span className="text-sm font-semibold text-brand-text">Clique para Enviar</span>
                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalSplashImage)} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-brand-border/30">
                            <h4 className="text-lg font-semibold text-brand-text">Trilha Sonora Inicial</h4>
                            <div className="flex items-center gap-2">
                                <label className="flex-grow flex items-center justify-center px-3 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors cursor-pointer text-sm">
                                    <UploadIcon className="w-4 h-4 mr-2" /> {localBackgroundMusic ? 'Alterar Música' : 'Carregar Música (.mp3)'}
                                    <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={(e) => handleAudioUpload(e, setLocalBackgroundMusic)} className="hidden" />
                                </label>
                                {localBackgroundMusic && (
                                    <button
                                        onClick={() => setLocalBackgroundMusic('')}
                                        className="p-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors"
                                        title="Remover Música"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-brand-text-dim italic">Esta trilha começará a tocar assim que o jogo for iniciado.</p>
                        </div>
                  </div>
              </div>
          )}

          {activeTab === 'fim_de_jogo' && (
              <div className="space-y-10">
                  <div className="space-y-6">
                      <h3 className="text-lg font-bold text-brand-text border-b border-brand-border pb-2">Final Positivo</h3>
                      <p className="text-sm text-brand-text-dim -mt-4">Esta tela aparece quando o jogador alcança uma cena marcada como "final".</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* FIX: Implemented UI for Positive Ending Image and Alignment */}
                          <div className="space-y-4">
                              <div className="space-y-2">
                                  <h4 className="text-sm font-semibold text-brand-text-dim">Posicionamento do Conteúdo</h4>
                                  <select
                                      value={localPositiveEndingContentAlignment}
                                      onChange={(e) => setLocalPositiveEndingContentAlignment(e.target.value as 'left' | 'right')}
                                      className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                                  >
                                      <option value="right">Direita</option>
                                      <option value="left">Esquerda</option>
                                  </select>
                              </div>
                              <div className="space-y-2 h-48 md:h-64 flex flex-col">
                                  <h4 className="text-sm font-semibold text-brand-text-dim">Imagem de Fundo</h4>
                                  <div className="relative flex-grow w-full min-h-[200px]">
                                      {localPositiveEndingImage ? (
                                        <div className="absolute inset-0 w-full h-full border border-brand-border rounded-md overflow-hidden bg-brand-bg group">
                                            <img src={localPositiveEndingImage} alt="Final Positivo" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                                  <label className="p-2 bg-brand-primary text-brand-bg rounded-md cursor-pointer hover:bg-brand-primary-hover">
                                                    <UploadIcon className="w-5 h-5" />
                                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalPositiveEndingImage)} className="hidden" />
                                                  </label>
                                                  <button onClick={() => setLocalPositiveEndingImage('')} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                                      <TrashIcon className="w-5 h-5" />
                                                  </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-brand-border bg-brand-bg/50 rounded-md cursor-pointer hover:bg-brand-border/30 transition-colors">
                                            <UploadIcon className="w-6 h-6 text-brand-text-dim mb-2" />
                                            <span className="text-xs font-semibold text-brand-text">Clique para Enviar</span>
                                            <span className="text-[10px] text-brand-text-dim mt-1">ou arraste e solte</span>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalPositiveEndingImage)} className="hidden" />
                                        </label>
                                    )}
                                  </div>
                              </div>
                          </div>
                          <div className="space-y-2 flex flex-col h-full">
                              <h4 className="text-sm font-semibold text-brand-text-dim">Mensagem de Vitória</h4>
                              <textarea
                                  id="positiveEndingDescription"
                                  value={localPositiveEndingDescription}
                                  onChange={(e) => setLocalPositiveEndingDescription(e.target.value)}
                                  className="w-full flex-grow bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm resize-none min-h-[200px]"
                                  placeholder="Parabéns! Você venceu."
                              />
                          </div>
                      </div>
                  </div>
                  <div className="space-y-6 pt-6 border-t border-brand-border/50">
                      <h3 className="text-lg font-bold text-brand-text border-b border-brand-border pb-2">Final Negativo</h3>
                      <p className="text-sm text-brand-text-dim -mt-4">Esta tela aparece quando o jogador fica sem chances.</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* FIX: Implemented UI for Negative Ending Image and Alignment */}
                          <div className="space-y-4">
                              <div className="space-y-2">
                                  <h4 className="text-sm font-semibold text-brand-text-dim">Posicionamento do Conteúdo</h4>
                                  <select
                                      value={localNegativeEndingContentAlignment}
                                      onChange={(e) => setLocalNegativeEndingContentAlignment(e.target.value as 'left' | 'right')}
                                      className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"
                                  >
                                      <option value="right">Direita</option>
                                      <option value="left">Esquerda</option>
                                  </select>
                              </div>
                              <div className="space-y-2 h-48 md:h-64 flex flex-col">
                                  <h4 className="text-sm font-semibold text-brand-text-dim">Imagem de Fundo</h4>
                                  <div className="relative flex-grow w-full min-h-[200px]">
                                       {localNegativeEndingImage ? (
                                        <div className="absolute inset-0 w-full h-full border border-brand-border rounded-md overflow-hidden bg-brand-bg group">
                                             <img src={localNegativeEndingImage} alt="Final Negativo" className="w-full h-full object-cover" />
                                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                                  <label className="p-2 bg-brand-primary text-brand-bg rounded-md cursor-pointer hover:bg-brand-primary-hover">
                                                     <UploadIcon className="w-5 h-5" />
                                                     <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalNegativeEndingImage)} className="hidden" />
                                                  </label>
                                                  <button onClick={() => setLocalNegativeEndingImage('')} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                                      <TrashIcon className="w-5 h-5" />
                                                  </button>
                                             </div>
                                        </div>
                                    ) : (
                                        <label className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-brand-border bg-brand-bg/50 rounded-md cursor-pointer hover:bg-brand-border/30 transition-colors">
                                            <UploadIcon className="w-6 h-6 text-brand-text-dim mb-2" />
                                            <span className="text-xs font-semibold text-brand-text">Clique para Enviar</span>
                                            <span className="text-[10px] text-brand-text-dim mt-1">ou arraste e solte</span>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalNegativeEndingImage)} className="hidden" />
                                        </label>
                                    )}
                                  </div>
                              </div>
                          </div>
                          <div className="space-y-2 flex flex-col h-full">
                              <h4 className="text-sm font-semibold text-brand-text-dim">Mensagem de Derrota</h4>
                              <textarea
                                  id="negativeEndingDescription"
                                  value={localNegativeEndingDescription}
                                  onChange={(e) => setLocalNegativeEndingDescription(e.target.value)}
                                  className="w-full flex-grow bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm resize-none min-h-[200px]"
                                  placeholder="Fim de jogo."
                              />
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'textos' && (
              <div className="space-y-8">
                  <div>
                      <h3 className="text-lg font-semibold text-brand-text mb-4">Textos da Interface</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          <div>
                              <label htmlFor="actionButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Ação</label>
                              <input type="text" id="actionButtonText" value={localActionButtonText} onChange={(e) => setLocalActionButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" />
                          </div>
                          <div>
                              <label htmlFor="verbInputPlaceholder" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Campo de Verbo</label>
                              <input type="text" id="verbInputPlaceholder" value={localVerbInputPlaceholder} onChange={(e) => setLocalVerbInputPlaceholder(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" />
                          </div>
                          <div>
                              <label htmlFor="diaryPlayerName" className="block text-sm font-medium text-brand-text-dim mb-1">Nome do Jogador no Diário</label>
                              <input type="text" id="diaryPlayerName" value={localDiaryPlayerName} onChange={(e) => setLocalDiaryPlayerName(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" />
                          </div>
                          <div>
                              <label htmlFor="splashButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Início</label>
                              <input type="text" id="splashButtonText" value={localSplashButtonText} onChange={(e) => setLocalSplashButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" placeholder="INICIAR" />
                          </div>
                          <div>
                              <label htmlFor="continueButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Continuar</label>
                              <input type="text" id="continueButtonText" value={localContinueButtonText} onChange={(e) => setLocalContinueButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" placeholder="Continuar Aventura" />
                          </div>
                          <div>
                              <label htmlFor="restartButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Reiniciar (Fim de Jogo)</label>
                              <input type="text" id="restartButtonText" value={localRestartButtonText} onChange={(e) => setLocalRestartButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" placeholder="Reiniciar Aventura" />
                          </div>
                          <div className="pt-4 border-t border-brand-border/50 col-span-full">
                            <h4 className="text-md font-semibold text-brand-text mb-4">Textos dos Botões de Ação</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <div>
                                    <label htmlFor="suggestionsButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão Sugestões</label>
                                    <input type="text" id="suggestionsButtonText" value={localSuggestionsButtonText} onChange={e => setLocalSuggestionsButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="inventoryButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão Inventário</label>
                                    <input type="text" id="inventoryButtonText" value={localInventoryButtonText} onChange={e => setLocalInventoryButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="diaryButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão Diário</label>
                                    <input type="text" id="diaryButtonText" value={localDiaryButtonText} onChange={e => setLocalDiaryButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="trackersButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão Rastreadores</label>
                                        <input type="text" id="trackersButtonText" value={localTrackersButtonText} onChange={e => setLocalTrackersButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" disabled={localGameSystemEnabled !== 'trackers'} />
                                    </div>
                                </div>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-brand-border/50 col-span-full">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-md font-semibold text-brand-text">Textos do menu de Salvar/Carregar</h4>
                                <div className="flex items-center bg-brand-bg px-3 py-1.5 rounded-md border border-brand-border/30">
                                    <input
                                        type="checkbox"
                                        id="gameShowSystemButton"
                                        checked={localGameShowSystemButton}
                                        onChange={e => setLocalGameShowSystemButton(e.target.checked)}
                                        className="custom-checkbox"
                                    />
                                    <label htmlFor="gameShowSystemButton" className="ml-2 block text-sm text-brand-text-dim cursor-pointer">
                                        Mostrar botão de Menu de Salvar/Carregar
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <div>
                                    <label htmlFor="systemButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Título Botão Sistema</label>
                                    <input type="text" id="systemButtonText" value={localSystemButtonText} onChange={e => setLocalSystemButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" placeholder="Sistema" />
                                </div>
                                <div>
                                    <label htmlFor="mainMenuButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão Menu Principal</label>
                                    <input type="text" id="mainMenuButtonText" value={localMainMenuButtonText} onChange={e => setLocalMainMenuButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" placeholder="Menu Principal" />
                                </div>
                                <div>
                                    <label htmlFor="saveMenuTitle" className="block text-sm font-medium text-brand-text-dim mb-1">Título Menu Salvar</label>
                                    <input type="text" id="saveMenuTitle" value={localSaveMenuTitle} onChange={e => setLocalSaveMenuTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" placeholder="Salvar Jogo" />
                                </div>
                                <div>
                                    <label htmlFor="loadMenuTitle" className="block text-sm font-medium text-brand-text-dim mb-1">Título Menu Carregar</label>
                                    <input type="text" id="loadMenuTitle" value={localLoadMenuTitle} onChange={e => setLocalLoadMenuTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" placeholder="Carregar Jogo" />
                                </div>
                            </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'cores' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-brand-surface space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-brand-text">Cor da Interface</h3>
                        <div className="flex gap-2 rounded-md bg-brand-bg p-1">
                            <button onClick={() => handleThemeChange('dark')} className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${localGameTheme === 'dark' ? 'bg-brand-primary text-brand-bg' : 'hover:bg-brand-border/30'}`}>Escuro</button>
                            <button onClick={() => handleThemeChange('light')} className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${localGameTheme === 'light' ? 'bg-brand-primary text-brand-bg' : 'hover:bg-brand-border/30'}`}>Claro</button>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Fonte</h3>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="font-select" className="block text-sm font-medium text-brand-text-dim mb-1">Fonte</label>
                                <select id="font-select" value={localFontFamily} onChange={(e) => setLocalFontFamily(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" style={{fontFamily: localFontFamily}}>
                                    {FONTS.map(font => <option key={font.family} value={font.family} style={{fontFamily: font.family}}>{font.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="font-size-select" className="block text-sm font-medium text-brand-text-dim mb-1">Tamanho</label>
                                <select id="font-size-select" value={localGameFontSize} onChange={(e) => setLocalGameFontSize(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm">
                                    <option value="0.85em">Pequeno (Padrão)</option>
                                    <option value="1em">Médio</option>
                                    <option value="1.1em">Grande</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-brand-border/50">
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Temas</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {PREDEFINED_THEMES.map(theme => <button key={theme.name} onClick={() => applyTheme(theme)} className="text-left p-2 rounded-md border-2 border-brand-border hover:border-brand-primary transition-colors focus:outline-none focus:border-brand-primary bg-brand-bg"><span className="font-semibold text-sm text-brand-text">{theme.name}</span><div className="flex mt-2 gap-1"><div className="w-1/3 h-4 rounded" style={{ backgroundColor: theme.titleColor }}></div><div className="w-1/3 h-4 rounded" style={{ backgroundColor: theme.textColor }}></div><div className="w-1/3 h-4 rounded" style={{ backgroundColor: theme.splashButtonColor }}></div></div></button>)}
                        </div>
                    </div>
                    {!isCustomizing && <div className="pt-6 border-t border-brand-border/50"><button onClick={() => setIsCustomizing(true)} className="w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30">Customizar Cores de Tema e Botões</button></div>}
                    {isCustomizing && (
                      <>
                        {localGameTheme === 'dark' ? (
                            <div className="pt-6 border-t border-brand-border/50">
                                <h3 className="text-lg font-semibold text-brand-text mb-4">Cores (Tema Escuro)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <ColorInput label="Cor do Texto Padrão" id="textColor" value={localTextColor} onChange={setLocalTextColor} placeholder="#c9d1d9" />
                                    <ColorInput label="Cor do Título / Destaque" id="titleColor" value={localTitleColor} onChange={setLocalTitleColor} placeholder="#58a6ff" />
                                    <ColorInput label="Cor de Destaque (Foco)" id="focusColor" value={localFocusColor} onChange={setLocalFocusColor} placeholder="#58a6ff" />
                                </div>
                            </div>
                        ) : (
                            <div className="pt-6 border-t border-brand-border/50">
                                <h3 className="text-lg font-semibold text-brand-text mb-4">Cores (Tema Claro)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <ColorInput label="Cor do Texto Padrão" id="textColorLight" value={localTextColorLight} onChange={setLocalTextColorLight} placeholder="#24292f" />
                                    <ColorInput label="Cor do Título / Destaque" id="titleColorLight" value={localTitleColorLight} onChange={setLocalTitleColorLight} placeholder="#0969da" />
                                    <ColorInput label="Cor de Destaque (Foco)" id="focusColorLight" value={localFocusColorLight} onChange={setLocalFocusColorLight} placeholder="#0969da" />
                                </div>
                            </div>
                        )}
                        <div className="pt-6 border-t border-brand-border/50">
                            <h3 className="text-lg font-semibold text-brand-text mb-4">Botões (Geral)</h3>
                            <p className="text-xs text-brand-text-dim mb-4 -mt-3">Estas cores são applied a ambos os temas.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor do Botão de Início" id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#2ea043" />
                                <ColorInput label="Cor do Texto do Botão de Início" id="splashButtonTextColor" value={localSplashButtonTextColor} onChange={setLocalSplashButtonTextColor} placeholder="#ffffff" />
                                <ColorInput label="Cor do Botão de Início (Hover)" id="splashButtonHoverColor" value={localSplashButtonHoverColor} onChange={setLocalSplashButtonHoverColor} placeholder="#238636" />
                                <ColorInput label="Cor do Botão de Ação" id="actionButtonColor" value={localActionButtonColor} onChange={setLocalActionButtonColor} placeholder="#ffffff" />
                                <ColorInput label="Cor do Texto do Botão de Ação" id="actionButtonTextColor" value={localActionButtonTextColor} onChange={setLocalActionButtonTextColor} placeholder="#0d1117" />
                            </div>
                        </div>
                        <div className="pt-6 border-t border-brand-border/50">
                            <h3 className="text-lg font-semibold text-brand-text mb-4">Box de Nome da Cena</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor de Fundo do Box" id="sceneNameOverlayBg" value={localGameSceneNameOverlayBg} onChange={setLocalGameSceneNameOverlayBg} placeholder="#0d1117" />
                                <ColorInput label="Cor do Texto do Box" id="sceneNameOverlayTextColor" value={localGameSceneNameOverlayTextColor} onChange={setLocalGameSceneNameOverlayTextColor} placeholder="#c9d1d9" />
                            </div>
                        </div>
                        <div className="pt-6 border-t border-brand-border/50">
                            <h3 className="text-lg font-semibold text-brand-text mb-4">Outros</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor da Seta de Continuar" id="gameContinueIndicatorColor" value={localGameContinueIndicatorColor} onChange={setLocalGameContinueIndicatorColor} placeholder="#58a6ff" />
                            </div>
                        </div>
                      </>
                    )}
                </div>
                <div className="flex flex-col sticky top-6 self-start">
                    <p className="text-sm text-brand-text-dim mb-2 text-center">Pré-visualização ao vivo</p>
                    <div className={`border-2 flex flex-col transition-colors ${localGameTheme === 'dark' ? 'bg-[#0d1117] border-brand-border' : 'bg-[#ffffff] border-[#d0d7de]'}`} style={{ fontFamily: localFontFamily, fontSize: localGameFontSize }}>
                        <div className="flex p-4 gap-4">
                            <div className="w-2/5 aspect-[9/16] flex items-center justify-center relative" style={getFramePreviewStyles(localImageFrame).panelStyles}>
                                <div className="font-semibold" style={getFramePreviewStyles(localImageFrame).containerStyles}>Imagem</div>
                                <div className="absolute bottom-4 text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: localGameSceneNameOverlayBg, color: localGameSceneNameOverlayTextColor, border: `1px solid ${localGameTheme === 'dark' ? '#30363d' : '#d0d7de'}`, fontSize: '0.8em' }}>Nome da Cena</div>
                            </div>
                            <div className="w-3/5 flex flex-col justify-between">
                                <div>
                                    <h1 style={{ color: localGameTheme === 'dark' ? localTitleColor : localTitleColorLight, fontSize: '1.5em' }}>Título do Jogo</h1>
                                    <p className="mt-2" style={{ color: localGameTheme === 'dark' ? localTextColor : localTextColorLight, fontSize: '1em' }}>Esta é uma descrição de exemplo para a cena.</p>
                                    <p className="mt-2 italic" style={{ color: localGameTheme === 'dark' ? '#8b949e' : '#57606a', fontSize: '0.9em' }}>&gt; comando de exemplo</p>
                                </div>
                                {gameSystemEnabled === 'chances' && (
                                <div className="flex gap-1">
                                    <ChanceIcon type={chanceIcon} color={chanceIconColor} />
                                    <ChanceIcon type={chanceIcon} color={chanceIconColor} />
                                    <ChanceIcon type={chanceIcon} color={chanceIconColor} />
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 space-y-4 border-t" style={{borderColor: localGameTheme === 'dark' ? '#30363d' : '#d0d7de'}}>
                             <div className="flex items-center gap-4">
                                <input type="text" placeholder="Campo de comando" className="flex-1 border-2 rounded p-2 transition-colors focus:ring-0" style={{ backgroundColor: localGameTheme === 'dark' ? '#010409' : '#f6f8fa', color: localGameTheme === 'dark' ? localTextColor : localTextColorLight, borderColor: focusPreview ? (localGameTheme === 'dark' ? localFocusColor : localFocusColorLight) : (localGameTheme === 'dark' ? '#30363d' : '#d0d7de'), fontFamily: localFontFamily, fontSize: '1em' }} onFocus={() => setFocusPreview(true)} onBlur={() => setFocusPreview(false)} />
                                <button className="font-bold py-2 px-4 rounded" style={{ backgroundColor: localActionButtonColor, color: localActionButtonTextColor, fontFamily: localFontFamily, fontSize: '1em' }}>Ação</button>
                             </div>
                              <button className="w-full font-bold transition-all duration-200 ease-in-out py-3" style={{ backgroundColor: localSplashButtonColor, color: localSplashButtonTextColor, fontFamily: localFontFamily, fontSize: '1.2em' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = localSplashButtonHoverColor} onMouseLeave={e => e.currentTarget.style.backgroundColor = localSplashButtonColor}>Botão de Início</button>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'transicoes' && (
              <div className="space-y-8">
                  <div>
                      <h3 className="text-lg font-semibold text-brand-text mb-4">Transição de Textos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          <div>
                              <label htmlFor="textAnimationType" className="block text-sm font-medium text-brand-text-dim mb-1">Efeito de Animação</label>
                              <select id="textAnimationType" value={localTextAnimationType} onChange={(e) => setLocalTextAnimationType(e.target.value as 'fade' | 'typewriter')} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm">
                                  <option value="fade">Esmaecer (Fade In)</option>
                                  <option value="typewriter">Máquina de Escrever (Letra a letra)</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="textSpeed" className="block text-sm font-medium text-brand-text-dim mb-1">Velocidade da Animação</label>
                              <div className="flex items-center gap-4">
                                  <div className="flex-grow relative">
                                      <input type="range" id="textSpeed" min="1" max="5" value={localTextSpeed} onChange={(e) => setLocalTextSpeed(parseInt(e.target.value, 10))} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer border border-brand-border accent-brand-primary" />
                                      <div className="flex justify-between text-xs text-brand-text-dim mt-1"><span>Lento</span><span>Rápido</span></div>
                                  </div>
                                  <span className="font-mono font-bold text-brand-primary w-6 text-center">{localTextSpeed}</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="pt-6 border-t border-brand-border/50">
                      <h3 className="text-lg font-semibold text-brand-text mb-4">Transição de Imagens</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          <div>
                              <label htmlFor="imageTransitionType" className="block text-sm font-medium text-brand-text-dim mb-1">Efeito de Transição Global</label>
                              <select id="imageTransitionType" value={localImageTransitionType} onChange={(e) => setLocalImageTransitionType(e.target.value as any)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm">
                                  <option value="fade">Esmaecer (Fade)</option>
                                  <option value="slide-left">Deslizar para Esquerda</option>
                                  <option value="slide-right">Deslizar para Direita</option>
                                  <option value="slide-up">Deslizar para Cima</option>
                                  <option value="slide-down">Deslizar para Baixo</option>
                                  <option value="zoom">Aproximação (Zoom)</option>
                                  <option value="blur">Desfoque (Blur)</option>
                                  <option value="none">Nenhuma</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="imageSpeed" className="block text-sm font-medium text-brand-text-dim mb-1">Velocidade da Transição</label>
                              <div className="flex items-center gap-4">
                                  <div className="flex-grow relative">
                                      <input type="range" id="imageSpeed" min="1" max="5" value={localImageSpeed} onChange={(e) => setLocalImageSpeed(parseInt(e.target.value, 10))} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer border border-brand-border accent-brand-primary" />
                                      <div className="flex justify-between text-xs text-brand-text-dim mt-1"><span>Lento</span><span>Rápido</span></div>
                                  </div>
                                  <span className="font-mono font-bold text-brand-primary w-6 text-center">{localImageSpeed}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'verbos' && (
              <div className="space-y-4">
                  <p className="text-brand-text-dim text-sm">Defina verbos fixos que o jogador pode usar a qualquer momento. Estes verbos têm prioridade sobre as interações de cena.</p>
                  <div className="bg-yellow-500/10 p-4 rounded-md border border-yellow-500/50 flex items-start gap-3">
                      <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                      <p className="text-yellow-200/90 text-sm">Os verbos <strong className="text-yellow-100">olhar</strong> e <strong className="text-yellow-100">examinar</strong> são ações padrão do jogo para inspecionar objetos na cena ou no inventário. Eles já funcionam por padrão e não precisam ser adicionados aqui.</p>
                  </div>
                  {localFixedVerbs.map((verb) => <FixedVerbItem key={verb.id} verb={verb} onUpdate={handleFixedVerbChange} onRemove={handleRemoveFixedVerb} />)}
                  {localFixedVerbs.length === 0 && <p className="text-center text-brand-text-dim py-4">Nenhum verbo fixo definido.</p>}
                  <div className="flex justify-end mt-4"><button onClick={handleAddFixedVerb} className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors duration-200"><PlusIcon className="w-5 h-5 mr-2" />Adicionar Verbo Fixo</button></div>
              </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-6 right-10 z-10 flex gap-2">
          <button onClick={handleUndo} disabled={!isDirty} className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text-dim font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" title={isDirty ? "Desfazer alterações" : "Nenhuma alteração para desfazer"}>Desfazer</button>
          <button onClick={handleSave} disabled={!isDirty} className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed" title={isDirty ? "Salvar alterações" : "Nenhuma alteração para salvar"}>Salvar</button>
      </div>
    </div>
  );
};

// Helper for UIEditor Preview
const HeartIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
    <svg fill={color} viewBox="0 0 24 24" className={className}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
);
const CircleIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
  <svg fill={color} viewBox="0 0 24 24" className={className}><circle cx="12" cy="12" r="10"/></svg>
);
const CrossIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
  <svg stroke={color} strokeWidth="8" strokeLinecap="round" viewBox="0 0 24 24" className={className} fill="none"><path d="M12 5 V19 M5 12 H19"/></svg>
);
const SquareIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
  <svg fill={color} viewBox="0 0 24 24" className={className}><rect x="5" y="5" width="14" height="14" rx="1" /></svg>
);
const DiamondIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
  <svg fill={color} viewBox="0 0 24 24" className={className}><path d="M12 2l10 10-10 10L2 12z" /></svg>
);
const ChanceIcon: React.FC<{ type: any, color: string, className?: string }> = ({ type, color, className }) => {
    switch (type) {
        case 'heart': return <HeartIcon color={color} className={className} />;
        case 'circle': return <CircleIcon color={color} className={className} />;
        case 'cross': return <CrossIcon color={color} className={className} />;
        case 'square': return <SquareIcon color={color} className={className} />;
        case 'diamond': return <DiamondIcon color={color} className={className} />;
        default: return <HeartIcon color={color} className={className} />;
    }
};
const getFramePreviewStyles = (frame: any) => {
    const panelStyles: React.CSSProperties = { boxSizing: 'border-box' };
    const containerStyles: React.CSSProperties = { backgroundColor: '#1a202c', color: '#a0aec0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' };
    switch (frame) {
        case 'rounded-top': panelStyles.padding = '5px'; panelStyles.backgroundColor = '#facc15'; panelStyles.borderRadius = '40px 40px 4px 4px'; containerStyles.borderRadius = '35px 35px 0 0'; break;
        case 'book-cover': panelStyles.padding = '10px'; panelStyles.backgroundColor = '#FFFFFF'; panelStyles.border = 'none'; break;
        case 'trading-card': panelStyles.backgroundColor = '#1c1917'; panelStyles.borderRadius = '12px'; panelStyles.padding = '4px'; containerStyles.borderRadius = '8px'; break;
    }
    return { panelStyles, containerStyles };
};

export default UIEditor;