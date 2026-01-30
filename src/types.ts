
export interface GameObject {
  id: string;
  name: string;
  examineDescription: string;
  image?: string; // Base64 string for the object's image
  // FIX: Added isTakable property to resolve type error in SceneEditor.tsx
  isTakable?: boolean;
  icon?: string;
}

export interface TrackerEffect {
  trackerId: string;
  valueChange: number;
}

export interface Interaction {
  id: string;
  verbs: string[]; // e.g., ['usar', 'abrir']
  target: string; // ID of object in scene, e.g., 'obj_porta'
  requiresInInventory?: string; // ID of object in inventory, e.g., 'obj_chave_de_ferro'
  successMessage?: string;
  soundEffect?: string; // base64 data URL for interaction sound
  // --- Outcomes ---
  addsToInventory?: boolean;
  consumesItem?: boolean; // if requiresInInventory is used, is it consumed?
  removesTargetFromScene?: boolean; // remove the target object from the scene
  goToScene?: string; // ID of the scene to move to
  vignetteId?: string; // ID of the vignette to play
  newSceneDescription?: string;
  trackerEffects?: TrackerEffect[];
  transitionType?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom' | 'blur' | 'none';
  transitionSpeed?: number;
  icon?: string; // Icon name from Lucide
}

export interface Choice {
  id: string;
  label: string;
  targetSceneId: string;
}

export interface Exits {
  norte?: string;
  sul?: string;
  leste?: string;
  oeste?: string;
  acima?: string;
  abaixo?: string;
}

export interface Scene {
  id: string;
  name: string;
  image: string; // URL or base64 string
  description: string;
  backgroundMusic?: string; // Base64 data URL for BGM
  objectIds: string[]; // References to GameData.globalObjects
  objects?: GameObject[]; // Deprecated: Kept for migration types
  interactions: Interaction[];
  choices?: Choice[];
  exits?: Exits;
  isEndingScene?: boolean;
  conclusionVignetteId?: string;
  removesChanceOnEntry?: boolean;
  restoresChanceOnEntry?: boolean;
  mapX?: number;
  mapY?: number;
  vignetteType?: 'opening' | 'transition' | 'conclusion' | 'none';
  vignetteButtonText?: string;
  vignetteNextSceneId?: string;
}

export interface FixedVerb {
  id: string;
  verbs: string[];
  description: string;
  icon?: string;
}

export interface ConsequenceTracker {
  id: string;
  name: string;
  initialValue: number;
  maxValue: number;
  consequenceSceneId: string;
  barColor?: string;
  invertBar?: boolean;
  hideValue?: boolean;
  icon?: string;
}

export interface Vignette {
  id: string;
  name: string; // Internal name
  title: string; // Displayed title
  description: string;
  image?: string; // Base64 string
  backgroundMusic?: string; // Base64 Audio
  contentAlignment?: 'left' | 'right';
  verticalAlignment?: 'top' | 'bottom';
  omitTitle?: boolean; // Deprecated in favor of showTitle/showDescription
  showTitle?: boolean; // Controls visibility of the title
  showDescription?: boolean; // Controls visibility of the description
  buttonText?: string; // Custom button text for this vignette
  textScale?: string; // Controls size of title and description
  textAnimationType?: 'fade' | 'typewriter'; // Animation style for this vignette
  textSpeed?: number; // Animation speed (1-5) for this vignette
  nextSceneId?: string;

  isConclusion?: boolean;
  isSystemDefeat?: boolean; // If true, shown when chances run out

  // Map positioning
  mapX?: number;
  mapY?: number;
}


export interface GameData {
  startScene: string;
  scenes: {
    [id: string]: Scene;
  };
  globalObjects: {
    [id: string]: GameObject;
  };
  defaultFailureMessage: string;
  sceneOrder: string[];
  gameHTML: string;
  gameCSS: string;
  gameTitle?: string;
  gameFontFamily?: string;
  gameFontSize?: string;
  gameLogo?: string; // base64 string
  gameSplashImage?: string; // base64 string
  gameBackgroundMusic?: string; // Global starting music
  gameTextColor?: string;
  gameTitleColor?: string;
  gameHideTitle?: boolean;
  gameOmitSplashTitle?: boolean;
  gameInteractionType?: 'parser' | 'choice';
  gameSplashContentAlignment?: 'left' | 'right';
  gameSplashContentVerticalAlignment?: 'top' | 'bottom';
  gameSplashDescription?: string;
  gameSplashButtonText?: string;
  // Added missing properties to support splash button customization
  gameSplashButtonColor?: string;
  gameSplashButtonHoverColor?: string;
  gameSplashButtonTextColor?: string;
  gameContinueButtonText?: string;
  gameRestartButtonText?: string;
  gameLayoutOrientation?: 'vertical' | 'horizontal';
  gameLayoutOrder?: 'image-first' | 'image-last';
  gameImageFrame?: 'none' | 'book-cover' | 'trading-card' | 'rounded-top';
  gameMobileLayoutBehavior?: 'standard' | 'immersive';
  gameActionButtonColor?: string;
  gameActionButtonTextColor?: string;
  gameActionButtonText?: string;
  gameVerbInputPlaceholder?: string;
  gameDiaryPlayerName?: string;
  gameFocusColor?: string;
  gameSystemEnabled?: 'none' | 'chances' | 'trackers'; // Legacy, keep for migration
  enableTrackers?: boolean;
  enableInventory?: boolean;
  enableDiary?: boolean;
  enableFixedVerbs?: boolean;
  enableChances?: boolean; // Legacy/Basic system

  // Inventory Config
  inventoryCapacity?: number;
  inventoryMaxWeight?: number;

  // Diary Config
  diaryAutoScroll?: boolean;
  diaryAllowExport?: boolean;
  diaryMaxMessages?: number;
  diaryShowSceneImage?: boolean;
  diaryShowPlayerAction?: boolean;
  enableImages?: boolean;
  enableTextControl?: boolean;

  gameMaxChances?: number;
  gameChanceIcon?: 'circle' | 'cross' | 'heart' | 'square' | 'diamond';
  gameChanceIconColor?: string;
  gameChanceReturnButtonText?: string;
  gameChanceLossMessage?: string;
  gameChanceRestoreMessage?: string;
  gameTheme?: 'dark' | 'light';
  textColorLight?: string;
  titleColorLight?: string;
  focusColorLight?: string;
  positiveEndingImage?: string;
  positiveEndingContentAlignment?: 'left' | 'right';
  positiveEndingDescription?: string;
  positiveEndingMusic?: string;
  negativeEndingImage?: string;
  negativeEndingContentAlignment?: 'left' | 'right';
  negativeEndingDescription?: string;
  negativeEndingMusic?: string;
  frameBookColor?: string;
  frameTradingCardColor?: string;
  frameRoundedTopColor?: string;
  gameSceneNameOverlayBg?: string;
  gameSceneNameOverlayTextColor?: string;
  fixedVerbs?: FixedVerb[];
  consequenceTrackers?: ConsequenceTracker[];
  vignettes?: Vignette[]; // All vignettes, including opening (first one)
  gameShowTrackersUI?: boolean;
  gameShowSystemButton?: boolean;
  gameSuggestionsButtonText?: string;
  gameInventoryButtonText?: string;
  gameDiaryButtonText?: string;
  gameTrackersButtonText?: string;
  gameSystemButtonText?: string;
  gameSaveMenuTitle?: string;
  gameLoadMenuTitle?: string;
  gameMainMenuButtonText?: string;
  gameContinueIndicatorColor?: string;
  gameViewEndingButtonText?: string;

  // Transitions
  gameTextAnimationType?: 'fade' | 'typewriter';
  gameTextSpeed?: number; // 1 (slow) to 10 (fast)
  gameImageTransitionType?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom' | 'blur' | 'none';
  gameImageSpeed?: number; // 1 (slow) to 10 (fast)
  gameTextReadingFlow?: 'continuous' | 'paused';
}

export type View = 'scenes' | 'interface' | 'vignettes' | 'map' | 'global_objects' | 'global_commands' | 'trackers' | 'settings' | 'about' | 'guide';
