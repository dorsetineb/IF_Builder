// FIX: Corrected React import to properly include 'useRef'. The previous syntax 'import React, a from ...' was invalid.
import React, { useRef } from 'react';
import { GameData } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { EyeIcon } from './icons/EyeIcon';
import { DocumentArrowUpIcon } from './icons/DocumentArrowUpIcon';
import { gameJS, prepareGameDataForEngine } from './game-engine';

// Fix: Declare JSZip to inform TypeScript about the global variable.
declare var JSZip: any;

const Header: React.FC<{ 
  gameData: GameData; 
  onImportGame: (data: GameData) => void;
  isPreviewing: boolean;
  onTogglePreview: () => void;
}> = ({ gameData, onImportGame, isPreviewing, onTogglePreview }) => {
  // FIX: Changed 'a.useRef' to 'useRef' to match the corrected import.
  const importInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = async () => {
    if (typeof JSZip === 'undefined') {
        alert('A biblioteca JSZip não foi carregada. Não é possível exportar.');
        return;
    }
    const zip = new JSZip();
    const assetsFolder = zip.folder("assets");

    const exportData = JSON.parse(JSON.stringify(gameData));

    const assetPromises = [];
    const assetMap = new Map<string, string>();

    const processAsset = (base64String: string | undefined, baseName: string): string | undefined => {
        if (!base64String || !base64String.startsWith('data:')) {
            return base64String;
        }
        if (assetMap.has(base64String)) {
            return assetMap.get(base64String);
        }
        const match = base64String.match(/^data:(.+);base64,(.+)$/);
        if (!match) return base64String;
        
        const mimeType = match[1];
        const data = match[2];
        const extension = mimeType.split('/')[1] || 'bin';
        const filename = `assets/${baseName}.${extension}`;
        assetMap.set(base64String, filename);
        
        const promise = fetch(base64String).then(res => res.blob()).then(blob => {
             assetsFolder.file(`${baseName}.${extension}`, blob);
        });
        assetPromises.push(promise);
        
        return filename;
    };

    exportData.gameLogo = processAsset(exportData.gameLogo, 'logo');
    exportData.gameSplashImage = processAsset(exportData.gameSplashImage, 'splash_image');
    for (const sceneId in exportData.scenes) {
        const scene = exportData.scenes[sceneId];
        scene.image = processAsset(scene.image, `scene_image_${sceneId}`);
        if (scene.interactions) {
            scene.interactions.forEach((inter: any, index: number) => {
                inter.soundEffect = processAsset(inter.soundEffect, `sfx_${sceneId}_${index}`);
            });
        }
    }

    await Promise.all(assetPromises);

    const headerContent = exportData.gameEnableChances 
        ? '<div id="chances-container" class="chances-container"></div>' 
        : '<button id="restart-button" class="btn-danger">Reiniciar Aventura</button>';

    const finalHtml = exportData.gameHTML
        .replace('<title>__GAME_TITLE__</title>', `<title>${exportData.gameTitle || 'Game'}</title>\n    <link rel="stylesheet" href="style.css">`)
        .replace('<link rel="stylesheet" href="style.css">', '')
        .replace('__LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="game-logo">` : '')
        .replace('__HEADER_TITLE_H1_TAG__', !exportData.gameHideTitle ? `<h1>${exportData.gameTitle}</h1>` : '')
        .replace('<button id="restart-button" class="btn-danger">Reiniciar Aventura</button>', headerContent)
        .replace('__SPLASH_BG_STYLE__', exportData.gameSplashImage ? `style="background-image: url('${exportData.gameSplashImage}')"` : '')
        .replace('__SPLASH_LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="splash-logo">` : '')
        .replace('__SPLASH_TITLE_H1_TAG__', !exportData.gameOmitSplashTitle ? `<h1>${exportData.gameTitle}</h1>` : '')
        .replace('__SPLASH_DESCRIPTION__', exportData.gameSplashDescription || '')
        .replace('__SPLASH_BUTTON_TEXT__', exportData.gameSplashButtonText || 'Start')
        .replace('__ACTION_BUTTON_TEXT__', exportData.gameActionButtonText || 'Action')
        .replace('__COMMAND_INPUT_PLACEHOLDER__', exportData.gameCommandInputPlaceholder || 'What do you do?')
        .replace('</body>', `<script src="game.js"></script>\n</body>`);

    const chancesCSS = `\n.chances-container { display: flex; align-items: center; gap: 8px; }\n.chance-icon { width: 28px; height: 28px; transition: all 0.3s ease; }\n.chance-icon.lost { opacity: 0.5; }`;
    let finalCss = exportData.gameCSS
        .replace(/:root {/, `:root {\n    --text-color: ${exportData.gameTextColor || '#c9d1d9'};` + `\n    --accent-color: ${exportData.gameTitleColor || '#58a6ff'};` + `\n    --splash-button-bg: ${exportData.gameSplashButtonColor || '#2ea043'};` + `\n    --splash-button-hover-bg: ${exportData.gameSplashButtonHoverColor || '#238636'};`+ `\n    --focus-color: ${exportData.gameFocusColor || '#58a6ff'};`) + (exportData.gameEnableChances ? chancesCSS : '');

    const engineData = prepareGameDataForEngine(exportData);
    const finalDataScript = `document.addEventListener('DOMContentLoaded', () => { window.embeddedGameData = ${JSON.stringify(engineData)}; });`;

    zip.file("index.html", finalHtml);
    zip.file("style.css", finalCss);
    zip.file("game.js", `\n${finalDataScript}\n\n${gameJS}\n`);
    
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${(gameData.gameTitle || 'meu-jogo').toLowerCase().replace(/\s+/g, '-')}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const zip = await JSZip.loadAsync(file);

        const dataScriptFile = zip.file("game.js");
        const htmlFile = zip.file("index.html");
        const cssFile = zip.file("style.css");

        if (!dataScriptFile || !htmlFile || !cssFile) {
            throw new Error("Arquivo .zip inválido. Faltam game.js, index.html ou style.css.");
        }

        const dataScriptContent = await dataScriptFile.async("string");
        const match = dataScriptContent.match(/window\.embeddedGameData\s*=\s*(\{.*?\});/);
        if (!match) throw new Error("Não foi possível encontrar os dados do jogo dentro de game.js");
        
        const importedEngineData = JSON.parse(match[1]);
        let reconstructedData: Partial<GameData> = { ...gameData };

        reconstructedData.gameHTML = await htmlFile.async("string");
        reconstructedData.gameCSS = await cssFile.async("string");
        reconstructedData.startScene = importedEngineData.cena_inicial;
        reconstructedData.defaultFailureMessage = importedEngineData.mensagem_falha_padrao;
        reconstructedData.gameDiaryPlayerName = importedEngineData.nome_jogador_diario;
        reconstructedData.gameEnableChances = importedEngineData.gameEnableChances;
        reconstructedData.gameMaxChances = importedEngineData.gameMaxChances;
        reconstructedData.gameChanceIcon = importedEngineData.gameChanceIcon;
        reconstructedData.gameChanceIconColor = importedEngineData.gameChanceIconColor;

        const editorScenes: { [id: string]: any } = {};
        if (importedEngineData.cenas) {
            for (const sceneId in importedEngineData.cenas) {
                const scene = importedEngineData.cenas[sceneId];
                editorScenes[sceneId] = {
                    ...scene,
                    objects: scene.objetos || [],
                };
                delete editorScenes[sceneId].objetos;
            }
        }
        reconstructedData.scenes = editorScenes;

        const processAssetPath = async (path: string | undefined): Promise<string | undefined> => {
            if (!path || !path.startsWith('assets/')) return path;
            const assetFile = zip.file(path);
            if (!assetFile) return undefined;
            const blob = await assetFile.async("blob");
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        };

        const promises = [];
        if (reconstructedData.gameLogo && typeof reconstructedData.gameLogo === 'string') {
            promises.push(processAssetPath(reconstructedData.gameLogo).then(b64 => reconstructedData.gameLogo = b64));
        }
        if (reconstructedData.gameSplashImage && typeof reconstructedData.gameSplashImage === 'string') {
            promises.push(processAssetPath(reconstructedData.gameSplashImage).then(b64 => reconstructedData.gameSplashImage = b64));
        }
        for (const sceneId in reconstructedData.scenes) {
            const scene = reconstructedData.scenes[sceneId];
            if (scene.image && typeof scene.image === 'string') {
                 promises.push(processAssetPath(scene.image).then(b64 => { scene.image = b64 as string; }));
            }
            if (scene.interactions) {
                scene.interactions.forEach((inter: any) => {
                    if (inter.soundEffect && typeof inter.soundEffect === 'string') {
                         promises.push(processAssetPath(inter.soundEffect).then(b64 => { inter.soundEffect = b64 as string; }));
                    }
                });
            }
        }
        
        await Promise.all(promises);
        
        onImportGame(reconstructedData as GameData);
        alert('Jogo importado com sucesso!');

    } catch (error) {
        console.error("Erro ao importar .zip:", error);
        alert(`Erro ao importar o arquivo .zip: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  };

  return (
    <header className="flex items-center justify-between p-3 bg-brand-surface border-b border-brand-border flex-shrink-0 z-20">
      <div className="flex flex-col items-start min-w-0">
        <h1 className="text-xl font-bold text-brand-text whitespace-nowrap">IF Builder</h1>
        {gameData.gameTitle && (
            <code
                className="mt-1 bg-brand-bg px-2 py-1 rounded text-brand-primary-hover text-sm truncate max-w-full"
                title={gameData.gameTitle}
            >
                {gameData.gameTitle}
            </code>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input type="file" ref={importInputRef} onChange={handleFileImport} className="hidden" accept=".zip" />
        <button onClick={handleImportClick} className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors">
          <DocumentArrowUpIcon className="w-5 h-5 mr-2" /> Importar Jogo (.zip)
        </button>
        <button onClick={handleExport} className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors">
          <DownloadIcon className="w-5 h-5 mr-2" /> Exportar Jogo (.zip)
        </button>
        <button onClick={onTogglePreview} className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors">
          <EyeIcon className="w-5 h-5 mr-2" />
          {isPreviewing ? 'Fechar Pré-visualização' : 'Pré-visualizar Jogo'}
        </button>
      </div>
    </header>
  );
};

export default Header;