const fs = require('fs');
const path = require('path');
const admZipPath = path.join(__dirname, '..', 'public', 'candido.zip');

if (fs.existsSync(admZipPath)) {
  console.log('candido.zip exists!');
  // Let's see if we can read it.
  // We can write a quick script or list the files.
} else {
  console.log('candido.zip does not exist at:', admZipPath);
}

const fujaZipPath = path.join(__dirname, '..', 'public', 'fuja_da_masmorra.zip');
console.log('fuja_da_masmorra.zip size:', fs.statSync(fujaZipPath).size);
