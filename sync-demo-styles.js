import fs from 'fs';
import path from 'path';

const demos = ['escape_the_dungeon', 'escapa_la_mazmorra'];
const rootDir = process.cwd();

// Load PT demo as reference
const ptPath = path.join(rootDir, 'public', 'fuja_da_masmorra', 'editor_data.json');
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

const styleKeysToCopy = [
  'gameTheme',
  'gameImageFrame',
  'gameMobileLayoutBehavior',
  'gameLayoutOrientation',
  'gameLayoutOrder',
  'gameFontSize',
  'gameFontFamily',
  'gameCSS',
  'gameHTML',
  'gameTextColor',
  'gameTitleColor',
  'gameFocusColor',
  'textColorLight',
  'titleColorLight',
  'focusColorLight',
  'gameSplashButtonColor',
  'gameSplashButtonHoverColor',
  'gameSplashButtonTextColor',
  'gameActionButtonColor',
  'gameActionButtonTextColor',
  'frameBookColor',
  'frameTradingCardColor',
  'frameRoundedTopColor',
  'gameSceneNameOverlayBg',
  'gameSceneNameOverlayTextColor',
  'gameContinueIndicatorColor',
  'enableChances',
  'maxChances',
  'currentChances',
  'enableTrackers',
  'enableSuggestions',
  'enableInventory',
  'enableDiary',
  'gameShowTrackersUI',
  'gameShowSystemButton'
];

demos.forEach(demo => {
  const demoPath = path.join(rootDir, 'public', demo);
  const jsonPath = path.join(demoPath, 'editor_data.json');
  
  if (fs.existsSync(jsonPath)) {
    let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Copy all style keys from PT to current demo
    styleKeysToCopy.forEach(key => {
      // Always overwrite even if undefined in PT (means default)
      data[key] = ptData[key];
    });

    if (data.gameSystemEnabled) delete data.gameSystemEnabled;
    
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`Updated editor_data.json for ${demo}`);
  } else {
    console.log(`Could not find ${jsonPath}`);
  }
});
