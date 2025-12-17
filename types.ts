export interface GameObject {
  id: string;
  name: string;
  examineDescription: string;
  isTakable: boolean;
  image?: string; // Base64 string for the object's image
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
  newSceneDescription?: string;
  trackerEffects?: TrackerEffect[];
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
  objectIds: string[]; // References to GameData.globalObjects
  objects?: GameObject[]; // Deprecated: Kept for migration types
  interactions: Interaction[];
  exits?: Exits;
  isEndingScene?: boolean;
  removesChanceOnEntry?: boolean;
  restoresChanceOnEntry?: boolean;
  mapX?: number;
  mapY?: number;
}

export interface FixedVerb {
  id: string;
  verbs: string[];
  description: string;
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
  gameTextColor?: string;
  gameTitleColor?: string;
  gameHideTitle?: boolean;
  gameOmitSplashTitle?: boolean;
  gameSplashContentAlignment?: 'left' | 'right';
  gameSplashDescription?: string;
  gameSplashButtonText?: string;
  gameContinueButtonText?: string;
  gameRestartButtonText?: string;
  gameSplashButtonColor?: string;
  gameSplashButtonHoverColor?: string;
  gameSplashButtonTextColor?: string;
  gameLayoutOrientation?: 'vertical' | 'horizontal';
  gameLayoutOrder?: 'image-first' | 'image-last';
  gameImageFrame?: 'none' | 'book-cover' | 'trading-card' | 'rounded-top';
  gameActionButtonColor?: string;
  gameActionButtonTextColor?: string;
  gameActionButtonText?: string;
  gameVerbInputPlaceholder?: string;
  gameDiaryPlayerName?: string;
  gameFocusColor?: string;
  gameSystemEnabled?: 'none' | 'chances' | 'trackers';
  gameMaxChances?: number;
  gameChanceIcon?: 'circle' | 'cross' | 'heart' | 'square' | 'diamond';
  gameChanceIconColor?: string;
  gameChanceReturnButtonText?: string;
  gameChanceLossMessage?: string;
  gameChanceRestoreMessage?: string;
  gameTheme?: 'dark' | 'light';
  gameTextColorLight?: string;
  gameTitleColorLight?: string;
  gameFocusColorLight?: string;
  positiveEndingImage?: string;
  positiveEndingContentAlignment?: 'left' | 'right';
  positiveEndingDescription?: string;
  negativeEndingImage?: string;
  negativeEndingContentAlignment?: 'left' | 'right';
  negativeEndingDescription?: string;
  frameBookColor?: string;
  frameTradingCardColor?: string;
  frameRoundedTopColor?: string;
  gameSceneNameOverlayBg?: string;
  gameSceneNameOverlayTextColor?: string;
  fixedVerbs?: FixedVerb[];
  consequenceTrackers?: ConsequenceTracker[];
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
  
  // Transitions
  gameTextAnimationType?: 'fade' | 'typewriter';
  gameTextSpeed?: number; // 1 (slow) to 10 (fast)
  gameImageTransitionType?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom' | 'blur' | 'none';
  gameImageSpeed?: number; // 1 (slow) to 10 (fast)
}

export type View = 'scenes' | 'interface' | 'map' | 'global_objects' | 'trackers';