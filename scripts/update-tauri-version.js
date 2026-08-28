import fs from 'fs';
import path from 'path';

// Lê a versão atualizada do package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const newVersion = packageJson.version;

// 1. Atualiza a versão no tauri.conf.json
const tauriConfPath = path.resolve('./src-tauri/tauri.conf.json');
if (fs.existsSync(tauriConfPath)) {
  const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
  tauriConf.version = newVersion;
  fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
}

// 2. Atualiza a versão no src/version.ts
const versionTsPath = path.resolve('./src/version.ts');
fs.writeFileSync(versionTsPath, `export const APP_VERSION = '${newVersion}';\n`);

// 3. Lê as notas de versão do public/RELEASE_NOTES.md se existir
const releaseNotesPath = path.resolve('./public/RELEASE_NOTES.md');
let releaseNotesContent = '';
if (fs.existsSync(releaseNotesPath)) {
  releaseNotesContent = fs.readFileSync(releaseNotesPath, 'utf-8').trim();
}

// 4. Atualiza a constante DEVLOG_RELEASE_NOTES no src/pages/AboutProject.tsx
const aboutProjectPath = path.resolve('./src/pages/AboutProject.tsx');
if (fs.existsSync(aboutProjectPath) && releaseNotesContent) {
  let aboutContent = fs.readFileSync(aboutProjectPath, 'utf-8');
  const escapedNotes = releaseNotesContent.replace(/`/g, '\\`').replace(/\${/g, '\\${');
  aboutContent = aboutContent.replace(
    /const DEVLOG_RELEASE_NOTES = `[\s\S]*?`;/,
    `const DEVLOG_RELEASE_NOTES = \`${escapedNotes}\`;`
  );
  fs.writeFileSync(aboutProjectPath, aboutContent);
}

// 5. Atualiza a chave devlogContent nos arquivos de tradução i18n (pt/en/es)
const localePaths = [
  path.resolve('./src/locales/pt/translation.json'),
  path.resolve('./src/locales/en/translation.json'),
  path.resolve('./src/locales/es/translation.json')
];

if (releaseNotesContent) {
  for (const localePath of localePaths) {
    if (fs.existsSync(localePath)) {
      const localeJson = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
      if (localeJson.about && localeJson.about.versions) {
        localeJson.about.versions.devlogContent = releaseNotesContent;
        fs.writeFileSync(localePath, JSON.stringify(localeJson, null, 2) + '\n');
      }
    }
  }
}

// 6. Atualiza o arquivo public/releases/latest.json
const latestJsonPath = path.resolve('./public/releases/latest.json');
if (fs.existsSync(latestJsonPath)) {
  const latestJson = JSON.parse(fs.readFileSync(latestJsonPath, 'utf-8'));
  latestJson.version = newVersion;
  latestJson.releaseName = `IF Builder v${newVersion}`;
  if (releaseNotesContent) {
    latestJson.releaseNotes = releaseNotesContent;
  }
  if (latestJson.downloads) {
    latestJson.downloads.windows = `https://github.com/dorsetineb/IF_Builder/releases/download/v${newVersion}/if-builder_${newVersion}_x64-setup.exe`;
    latestJson.downloads.linux = `https://github.com/dorsetineb/IF_Builder/releases/download/v${newVersion}/if-builder_${newVersion}_amd64.AppImage`;
  }
  fs.writeFileSync(latestJsonPath, JSON.stringify(latestJson, null, 2) + '\n');
}

console.log(`✅ [Version Script] Versão ${newVersion} sincronizada em:`);
console.log(`   - tauri.conf.json`);
console.log(`   - src/version.ts`);
console.log(`   - public/releases/latest.json`);
console.log(`   - src/pages/AboutProject.tsx (Devlog)`);
console.log(`   - src/locales/ (pt/en/es translation.json)`);
