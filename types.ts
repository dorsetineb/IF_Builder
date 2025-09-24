

export interface GameObject {
  id: string;
  name: string;
  examineDescription: string;
  isTakable: boolean;
}

export interface Interaction {
  id: string;
  verbs: string[]; // e.g., ['usar', 'abrir']
  target: string; // name of object in scene, e.g., 'porta'
  requiresInInventory?: string; // name of object in inventory, e.g., 'chave'
  successMessage?: string;
  soundEffect?: string; // base64 data URL for interaction sound
  transitionType?: 'fade' | 'slide-left' | 'slide-right' | 'wipe-down';
  // --- Outcomes ---
  consumesItem?: boolean; // if requiresInInventory is used, is it consumed?
  removesTargetFromScene?: boolean; // remove the target object from the scene
  goToScene?: string; // ID of the scene to move to
  newSceneDescription?: string;
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
  objects: GameObject[];
  interactions: Interaction[];
  exits?: Exits;
  isEndingScene?: boolean;
  removesChanceOnEntry?: boolean;
  restoresChanceOnEntry?: boolean;
  // FIX: Add optional mapX and mapY properties for SceneMap positioning.
  mapX?: number;
  mapY?: number;
}

export interface FixedVerb {
  id: string;
  verbs: string[];
  description: string;
}

export interface GameData {
  startScene: string;
  scenes: {
    [id: string]: Scene;
  };
  defaultFailureMessage: string;
  sceneOrder: string[];
  gameHTML: string;
  gameCSS: string;
  gameTitle?: string;
  gameFontFamily?: string;
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
  gameImageFrame?: 'none' | 'book-cover' | 'trading-card' | 'chamfered' | 'rounded-top';
  gameActionButtonColor?: string;
  gameActionButtonTextColor?: string;
  gameActionButtonText?: string;
  gameVerbInputPlaceholder?: string;
  gameDiaryPlayerName?: string;
  gameFocusColor?: string;
  gameEnableChances?: boolean;
  gameMaxChances?: number;
  gameChanceIcon?: 'circle' | 'cross' | 'heart';
  gameChanceIconColor?: string;
  gameChanceLossMessage?: string;
  gameChanceRestoreMessage?: string;
  gameChanceReturnButtonText?: string;
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
  frameChamferedColor?: string;
  frameRoundedTopColor?: string;
  fixedVerbs?: FixedVerb[];
}

export type View = 'scenes' | 'interface' | 'game_info' | 'map';