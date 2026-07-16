import fs from 'fs';
import path from 'path';

// Lê a versão atualizada do package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const newVersion = packageJson.version;

// Caminho para o tauri.conf.json
const tauriConfPath = path.resolve('./src-tauri/tauri.conf.json');

// Atualiza a versão no tauri.conf.json
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
tauriConf.version = newVersion;

// Salva o arquivo modificado
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');

console.log(`✅ tauri.conf.json atualizado para a versão ${newVersion}`);
