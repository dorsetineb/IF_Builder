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
  // --- Outcomes ---
  consumesItem?: boolean; // if requiresInInventory is used, is it consumed?
  removesTargetFromScene?: boolean; // remove the target object from the scene
  goToScene?: string; // ID of the scene to move to
  newSceneDescription?: string;
  refillsChances?: boolean;
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
  gameLogo?: string; // base64 string
  gameSplashImage?: string; // base64 string
  gameSplashTextWidth?: string;
  gameSplashTextHeight?: string;
  gameTextColor?: string;
  gameTitleColor?: string;
  gameHideTitle?: boolean;
  gameOmitSplashTitle?: boolean;
  gameSplashContentAlignment?: 'left' | 'right';
  gameSplashDescription?: string;
  gameSplashButtonText?: string;
  gameSplashButtonColor?: string;
  gameSplashButtonHoverColor?: string;
  gameLayoutOrientation?: 'vertical' | 'horizontal';
  gameLayoutOrder?: 'image-first' | 'image-last';
  gameActionButtonColor?: string;
  gameActionButtonText?: string;
  gameCommandInputPlaceholder?: string;
  gameDiaryPlayerName?: string;
  gameFocusColor?: string;
  gameEnableChances?: boolean;
  gameMaxChances?: number;
  gameChanceIcon?: 'circle' | 'cross' | 'heart';
  gameChanceIconColor?: string;
}

export type View = 'scenes' | 'interface' | 'game_info' | 'scene_map';