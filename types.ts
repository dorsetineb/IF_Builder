

export interface Choice {
  id: string;
  text: string;
  goToScene: string; // ID of the scene to move to
  soundEffect?: string; // base64 data URL for interaction sound
  refillsChances?: boolean;
  costsChance?: boolean;
}

export interface Scene {
  id: string;
  name: string;
  image: string; // URL or base64 string
  description: string;
  choices: Choice[];
  isEndingScene?: boolean;
  mapX?: number;
  mapY?: number;
}

export interface GameData {
  startScene: string;
  scenes: {
    [id: string]: Scene;
  };
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
  gameSplashButtonColor?: string;
  gameSplashButtonHoverColor?: string;
  gameSplashButtonTextColor?: string;
  gameLayoutOrientation?: 'vertical' | 'horizontal';
  gameLayoutOrder?: 'image-first' | 'image-last';
  gameFocusColor?: string;
  gameEnableChances?: boolean;
  gameMaxChances?: number;
  gameChanceIcon?: 'circle' | 'cross' | 'heart';
  gameChanceIconColor?: string;
  gameTheme?: 'dark' | 'light';
  gameTextColorLight?: string;
  gameTitleColorLight?: string;
  gameFocusColorLight?: string;
  gameChanceLossMessage?: string;
  gameChanceReturnButtonText?: string;
  gamePositiveEndingImage?: string;
  gamePositiveEndingOmitTitle?: boolean;
  gamePositiveEndingDescription?: string;
  gamePositiveEndingButtonText?: string;
  gameNegativeEndingImage?: string;
  gameNegativeEndingOmitTitle?: boolean;
  gameNegativeEndingDescription?: string;
  gameNegativeEndingButtonText?: string;
}

export type View = 'scenes' | 'interface' | 'game_info' | 'scene_map' | 'theme';