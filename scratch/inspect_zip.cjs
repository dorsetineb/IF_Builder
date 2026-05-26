const fs = require('fs');
const path = require('path');

const fujaZipPath = path.join(__dirname, '..', 'public', 'fuja_da_masmorra.zip');
if (fs.existsSync(fujaZipPath)) {
  console.log('fuja_da_masmorra.zip size:', fs.statSync(fujaZipPath).size);
} else {
  console.log('fuja_da_masmorra.zip not found');
}
