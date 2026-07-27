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

// Atualiza a versão no src/version.ts
const versionTsPath = path.resolve('./src/version.ts');
fs.writeFileSync(versionTsPath, `export const APP_VERSION = '${newVersion}';\n`);

// Atualiza a versão no public/releases/latest.json se existir
const latestJsonPath = path.resolve('./public/releases/latest.json');
if (fs.existsSync(latestJsonPath)) {
  const latestJson = JSON.parse(fs.readFileSync(latestJsonPath, 'utf-8'));
  latestJson.version = newVersion;
  latestJson.releaseName = `IF Builder v${newVersion}`;
  const releaseNotesPath = path.resolve('./public/RELEASE_NOTES.md');
  if (!latestJson.releaseNotes && fs.existsSync(releaseNotesPath)) {
    latestJson.releaseNotes = fs.readFileSync(releaseNotesPath, 'utf-8');
  }
  if (latestJson.downloads) {
    latestJson.downloads.windows = `/downloads/IFBuilder_${newVersion}_x64-setup.exe`;
    latestJson.downloads.linux = `/downloads/IFBuilder_${newVersion}_amd64.deb`;
  }
  fs.writeFileSync(latestJsonPath, JSON.stringify(latestJson, null, 2) + '\n');
}

console.log(`✅ tauri.conf.json, src/version.ts e public/releases/latest.json atualizados para a versão ${newVersion}`);

