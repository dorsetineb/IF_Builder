
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

export type DiceType = 'd6' | 'd20';

export interface DiceOutcomeRange {
  id: string;
  min: number;
  max: number;
  label?: string;
  successMessage?: string;
  goToScene?: string;
  trackerEffects?: TrackerEffect[];
  addsToInventory?: boolean;
  removesTargetFromScene?: boolean;
  soundEffect?: string;
}

export interface Interaction {
  id: string;
  title?: string; // Optional custom display title for interaction
  verbs: string[]; // e.g., ['usar', 'abrir']
  target: string; // ID of object in scene, e.g., 'obj_porta'
  requiresInInventory?: string; // ID of object in inventory, e.g., 'obj_chave_de_ferro'
  successMessage?: string;
  soundEffect?: string; // base64 data URL for interaction sound
  soundEffectName?: string; // Filename of the uploaded sound effect
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
  showObjectImage?: boolean;
  icon?: string; // Icon name from Lucide
  // --- Dice Rolling ---
  enableDiceTest?: boolean;
  diceOutcomeRanges?: DiceOutcomeRange[];
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
  backgroundMusicName?: string; // Filename of the uploaded BGM
  stopBackgroundMusic?: boolean; // If true, stops currently playing BGM upon entering scene
  objectIds: string[]; // References to GameData.globalObjects
  objects?: GameObject[]; // Deprecated: Kept for migration types
  interactions: Interaction[];
  choices?: Choice[];
  exits?: Exits;
  isEndingScene?: boolean;
  conclusionVignetteId?: string;
  isDefeatOutcome?: boolean;
  removesChanceOnEntry?: boolean;
  restoresChanceOnEntry?: boolean;
  mapX?: number;
  mapY?: number;
  vignetteType?: 'opening' | 'transition' | 'conclusion' | 'defeat' | 'none';
  vignetteButtonText?: string;
  vignetteNextSceneId?: string;
  overlayEffect?: string;
  suggestions?: string[];
  negativeFeedback?: string;
  omitSplashTitle?: boolean;
  omitSplashDescription?: boolean;
  vignetteAlignment?: 'left' | 'right';
  vignetteShowTitle?: boolean;
  vignetteShowDescription?: boolean;
  creditsText?: string;
  creditsScrollEnabled?: boolean;
  allowDiceRollInScene?: boolean;
  diceRollConfig?: DiceRollConfig;
  // HyperCard Stacks & Hotspots
  sceneType?: 'branch' | 'vignette' | 'hypercard_stack';
  stackCards?: HyperCard[];
  startCardId?: string;
  enableRevealZonesButton?: boolean;
}

export type HotspotShape = 'rect' | 'circle' | 'polygon';

export type HotspotHighlightStyle =
  | 'icons-visible'
  | 'icons-hover'
  | 'hidden'
  | 'hover-glow'
  | 'subtle-border'
  | 'always-visible'
  | 'pulsing-pin';

export type HotspotCursor =
  | 'pointer'
  | 'magnify'
  | 'hand'
  | 'eye'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'door';

export type HotspotActionType =
  | 'navigate_card'
  | 'navigate_scene'
  | 'examine'
  | 'collect_item'
  | 'toggle_tracker';

export interface HotspotPolygonPoint {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface CardHotspot {
  id: string;
  title: string;
  shape: HotspotShape;
  // Bounding box in percentage 0-100%
  x: number;
  y: number;
  width: number;
  height: number;
  points?: HotspotPolygonPoint[];
  // Appearance & Feedback
  highlightStyle: HotspotHighlightStyle;
  cursor?: HotspotCursor;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  iconBorderColor?: string;
  hideIconBg?: boolean;
  soundEffect?: string;
  soundEffectName?: string;
  // Actions & Outcomes
  actionType: HotspotActionType;
  targetCardId?: string;
  targetSceneId?: string;
  // In-place Examine / Floating Dialogue
  examineTitle?: string;
  examineText?: string;
  examineImage?: string;
  // Inventory & Game State
  requiresInInventory?: string;
  consumesItem?: boolean;
  addsToInventory?: string;
  trackerEffects?: TrackerEffect[];
  lockedMessage?: string;
}

export interface HyperCard {
  id: string;
  name: string;
  image: string; // Base64 or URL
  description?: string;
  hotspots: CardHotspot[];
  backgroundMusic?: string;
  backgroundMusicName?: string;
  transition?: 'cut' | 'dissolve' | 'wipe-left' | 'wipe-right' | 'iris' | 'zoom';
  transitionSpeed?: number;
}

export interface DiceRollConfig {
  cutoffValue: number;
  successVerb: string;
  successLabel?: string;
  successText?: string;
  failureVerb: string;
  failureLabel?: string;
  failureText?: string;
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
  verticalAlignment?: 'center' | 'bottom';
  omitTitle?: boolean; // Deprecated in favor of showTitle/showDescription
  showTitle?: boolean; // Controls visibility of the title
  showDescription?: boolean; // Controls visibility of the description
  buttonText?: string; // Custom button text for this vignette
  textScale?: string; // Controls size of title and description
  textAnimationType?: 'fade' | 'typewriter'; // Animation style for this vignette
  textSpeed?: number; // Animation speed (1-5) for this vignette
  nextSceneId?: string;
  overlayEffect?: string;

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
  gameOmitSplashDescription?: boolean;
  gameInteractionType?: 'parser' | 'choice';
  gameSplashContentAlignment?: 'left' | 'right';
  gameSplashContentVerticalAlignment?: 'center' | 'bottom';
  gameSplashDescription?: string;
  gameSplashButtonText?: string;
  // Added missing properties to support splash button customization
  gameSplashButtonColor?: string;
  gameSplashButtonHoverColor?: string;
  gameSplashButtonTextColor?: string;
  gameContinueButtonText?: string;
  gameRestartButtonText?: string;
  gameRetrospectiveButtonText?: string;
  gameLayoutOrientation?: 'vertical' | 'horizontal';
  gameLayoutOrder?: 'image-first' | 'image-last';
  gameImageFrame?: 'none' | 'book-cover' | 'trading-card' | 'rounded-top';
  gameMobileLayoutBehavior?: 'standard' | 'immersive';
  gameActionButtonColor?: string;
  gameActionButtonTextColor?: string;
  gameActionButtonHoverColor?: string;
  gameActionButtonText?: string;
  gameVerbInputPlaceholder?: string;
  gameDiaryPlayerName?: string;
  gameFocusColor?: string;
  gameSystemButtonColor?: string;
  gameSystemButtonTextColor?: string;
  gameSystemButtonBorderColor?: string;
  gameSystemButtonHoverColor?: string;
  gameSystemButtonHoverTextColor?: string;
  gameSystemEnabled?: 'none' | 'chances' | 'trackers'; // Legacy, keep for migration
  enableTrackers?: boolean;
  enableInventory?: boolean;
  enableSuggestions?: boolean;
  enableDiary?: boolean;
  enableNotes?: boolean;
  enableSystemMenu?: boolean;
  startScreenBgImage?: string;
  showStartScreenTitle?: boolean;
  startScreenTitle?: string;
  startScreenButtonAlignment?: 'left' | 'center' | 'right';
  startScreenVerticalAlignment?: 'center' | 'bottom';
  enableFixedVerbs?: boolean;
  enableChances?: boolean; // Legacy/Basic system
  enableRetrospective?: boolean;
  enableDiceRoll?: boolean;
  diceType?: DiceType;
  diceRollTextPrefix?: string;
  gameDiceRollButtonBg?: string;
  gameDiceRollButtonTextColor?: string;
  gameDiceRollButtonHoverColor?: string;
  gameDiceRollButtonText?: string;

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
  gameBackgroundColor?: string;
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
  gameFrameColor?: string;
  fixedVerbs?: FixedVerb[];
  consequenceTrackers?: ConsequenceTracker[];
  vignettes?: Vignette[]; // All vignettes, including opening (first one)
  vignetteScaling?: 'sm' | 'md' | 'lg';
  gameShowTrackersUI?: boolean;
  gameShowSystemButton?: boolean;
  gameSuggestionsButtonText?: string;
  gameInventoryButtonText?: string;
  gameDiaryButtonText?: string;
  gameNotesButtonText?: string;
  gameNotesPlaceholderText?: string;
  gameTrackersButtonText?: string;
  gameSystemButtonText?: string;
  gameSaveMenuTitle?: string;
  gameLoadMenuTitle?: string;
  gameMainMenuButtonText?: string;
  gameContinueIndicatorColor?: string;
  gameViewEndingButtonText?: string;
  gameSuggestionsEmptyFeedback?: string;
  gameInventoryEmptyFeedback?: string;
  gameTranslations?: {
    view_diary_btn: string;
    stats_visited: string;
    stats_time: string;
    total_words_read: string;
    of_scenes: string;
  };


  // Transitions
  gameTextAnimationType?: 'fade' | 'typewriter';
  gameTextSpeed?: number; // 1 (slow) to 10 (fast)
  gameImageTransitionType?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom' | 'blur' | 'none';
  gameImageSpeed?: number; // 1 (slow) to 10 (fast)
  gameMenuTransitionType?: 'fade' | 'slide' | 'none';
  gameMenuTransitionSpeed?: number;
  gameMenuTransitionSound?: string;
  gameTextReadingFlow?: 'continuous' | 'paused';

  // Export metadata (added by modern exports)
  metadata?: {
    exportedBy?: string;
    exportDate?: string;
    platform?: string;
    version?: string;
  };
}

export type View = 'welcome' | 'scenes' | 'interface' | 'vignettes' | 'map' | 'global_objects' | 'global_commands' | 'trackers' | 'settings' | 'about' | 'guide' | 'three_panels' | 'editor_interface';
