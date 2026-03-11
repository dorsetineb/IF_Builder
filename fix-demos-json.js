import fs from 'fs';
import path from 'path';

const demos = ['fuja_da_masmorra', 'escape_the_dungeon', 'escapa_la_mazmorra'];
const rootDir = process.cwd();

// Load PT demo as reference
const ptPath = path.join(rootDir, 'public', 'fuja_da_masmorra', 'editor_data.json');
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

const refFontFamily = ptData.gameFontFamily;
const refFontSize = ptData.gameFontSize;

function fixChances(data) {
  if (data.gameSystemEnabled === 'chances') {
    data.enableChances = true;
  }
  delete data.gameSystemEnabled;
  return data;
}

demos.forEach(demo => {
  const demoPath = path.join(rootDir, 'public', demo);
  const jsonPath = path.join(demoPath, 'editor_data.json');
  const gameJsPath = path.join(demoPath, 'game.js');
  
  if (fs.existsSync(jsonPath)) {
    let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Standardize fonts
    data.gameFontFamily = refFontFamily;
    data.gameFontSize = refFontSize;
    
    // Fix chances and legacy system flags
    data = fixChances(data);
    
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`Updated editor_data.json for ${demo}`);
    
    // Update game.js embeddedGameData
    if (fs.existsSync(gameJsPath)) {
      const currentJs = fs.readFileSync(gameJsPath, 'utf-8');
      const dataMatch = currentJs.match(/window\.embeddedGameData = ({[\s\S]*?});/);
      if (dataMatch) {
         let embeddedDataObj;
         try {
           embeddedDataObj = JSON.parse(dataMatch[1]);
           embeddedDataObj.gameFontFamily = refFontFamily;
           embeddedDataObj.gameFontSize = refFontSize;
           embeddedDataObj = fixChances(embeddedDataObj);
           
           const newEmbeddedStr = JSON.stringify(embeddedDataObj);
           const newJs = currentJs.replace(dataMatch[0], `window.embeddedGameData = ${newEmbeddedStr};`);
           fs.writeFileSync(gameJsPath, newJs);
           console.log(`Updated game.js for ${demo}`);
         } catch(e) {
           console.error(`Failed to parse game.js json for ${demo}`, e);
         }
      }
    }
  }
});
