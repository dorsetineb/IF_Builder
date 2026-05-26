const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const zipPath = path.join(__dirname, '..', 'public', 'fuja_da_masmorra.zip');

fs.readFile(zipPath, function(err, data) {
  if (err) throw err;
  JSZip.loadAsync(data).then(function(zip) {
    console.log('Zip file loaded successfully!');
    // List all files in the zip
    const files = Object.keys(zip.files);
    console.log('Total files in zip:', files.length);
    console.log('Files list (up to 20):');
    files.slice(0, 20).forEach(name => {
      console.log(' -', name);
    });

    const editorDataFile = zip.file('editor_data.json');
    if (editorDataFile) {
      editorDataFile.async('string').then(function(content) {
        try {
          const gameData = JSON.parse(content);
          console.log('Game Title:', gameData.gameTitle);
          console.log('Scenes count:', Object.keys(gameData.scenes || {}).length);
          console.log('Start Screen Bg:', gameData.startScreenBgImage);
          console.log('Game Logo:', gameData.gameLogo);
          // Let's print one scene's details
          const firstSceneId = Object.keys(gameData.scenes || {})[0];
          if (firstSceneId) {
            console.log('First Scene Image:', gameData.scenes[firstSceneId].image);
          }
        } catch (e) {
          console.error('Failed to parse editor_data.json:', e);
        }
      });
    } else {
      console.log('editor_data.json not found');
    }
  });
});
