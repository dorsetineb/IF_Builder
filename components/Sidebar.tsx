
import React, { useState, useEffect, useRef } from 'react';
import SceneList from './SceneList';
import { Scene, View, GameData } from '../types';
import { Code, BookOpen, Map, Box, SlidersHorizontal, Download, Eye, FileUp } from 'lucide-react';
import { gameJS, prepareGameDataForEngine } from './game-engine';

declare var JSZip: any;

interface SidebarProps {
  scenes: Scene[];
  startSceneId: string;
  selectedSceneId: string | null;
  currentView: View;
  gameData: GameData;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onReorderScenes: (newOrder: string[]) => void;
  onSetView: (view: View) => void;
  onImportGame: (data: GameData) => void;
  onTogglePreview: () => void;
}

const getFontUrl = (fontFamily: string) => {
  const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
  if (!fontName) return '';
  const googleFontName = fontName.replace(/ /g, '+');
  return `https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap`;
};

const getFrameClass = (frame?: GameData['gameImageFrame']): string => {
  switch (frame) {
    case 'rounded-top': return 'frame-rounded-top';
    case 'book-cover': return 'frame-book-cover';
    case 'trading-card': return 'frame-trading-card';
    default: return 'frame-none';
  }
}

const getMimeTypeFromFileName = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'svg': return 'image/svg+xml';
    case 'webp': return 'image/webp';
    case 'mp3':
    case 'mpeg': return 'audio/mpeg';
    case 'ogg': return 'audio/ogg';
    case 'wav': return 'audio/wav';
    case 'm4a':
    case 'mp4': return 'audio/mp4';
    default: return 'application/octet-stream';
  }
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { currentView, onSetView, scenes, gameData, onImportGame, onTogglePreview, ...sceneListProps } = props;
  const [isExpanded, setIsExpanded] = useState(currentView === 'scenes');
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentView === 'scenes') {
      setIsExpanded(true);
    }
  }, [currentView]);

  const getButtonClass = (view: View) =>
    `w-full flex items-center p-2 rounded-md transition-colors text-left ${currentView === view
      ? 'bg-brand-primary/20 text-brand-primary'
      : 'hover:bg-brand-border/50'
    }`;

  const handleToggleScenes = () => {
    if (currentView !== 'scenes') {
      onSetView('scenes');
      setIsExpanded(true);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleExport = async () => {
    if (typeof JSZip === 'undefined') {
      alert('A biblioteca JSZip não foi carregada. Não é possível exportar.');
      return;
    }
    const zip = new JSZip();
    const assetsFolder = zip.folder("assets");
    if (!assetsFolder) return;

    const exportData = JSON.parse(JSON.stringify(gameData));
    const assetMap = new Map<string, string>();

    const processAsset = (base64String: string | undefined, baseName: string): string | undefined => {
      if (!base64String || !base64String.startsWith('data:')) return base64String;
      if (assetMap.has(base64String)) return assetMap.get(base64String);

      const commaIndex = base64String.indexOf(',');
      if (commaIndex === -1) return base64String;

      const header = base64String.substring(0, commaIndex);
      const data = base64String.substring(commaIndex + 1);

      const mimeMatch = header.match(/data:([^;]+)/);
      if (!mimeMatch || !mimeMatch[1]) return base64String;

      const mimeType = mimeMatch[1];
      let extension = mimeType.split('/')[1]?.split('+')[0] || 'bin';

      const filename = `assets/${baseName}.${extension}`;
      assetsFolder.file(`${baseName}.${extension}`, data, { base64: true });
      assetMap.set(base64String, filename);
      return filename;
    };

    exportData.gameLogo = processAsset(exportData.gameLogo, 'logo');
    exportData.gameSplashImage = processAsset(exportData.gameSplashImage, 'splash_image');
    exportData.gameBackgroundMusic = processAsset(exportData.gameBackgroundMusic, 'global_bgm');
    exportData.positiveEndingImage = processAsset(exportData.positiveEndingImage, 'positive_ending');
    exportData.negativeEndingImage = processAsset(exportData.negativeEndingImage, 'negative_ending');

    for (const sceneId in exportData.scenes) {
      const scene = exportData.scenes[sceneId];
      scene.image = processAsset(scene.image, `scene_image_${sceneId}`);
      scene.backgroundMusic = processAsset(scene.backgroundMusic, `scene_bgm_${sceneId}`);
      if (scene.interactions) {
        scene.interactions.forEach((inter: any, index: number) => {
          inter.soundEffect = processAsset(inter.soundEffect, `sfx_${sceneId}_${index}`);
        });
      }
    }

    for (const objId in exportData.globalObjects) {
      const obj = exportData.globalObjects[objId];
      obj.image = processAsset(obj.image, `obj_image_${objId}`);
    }

    zip.file("editor_data.json", JSON.stringify(exportData));
    const fontFamily = exportData.gameFontFamily || "'Silkscreen', sans-serif";
    const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
    let fontStylesheet = '';
    let finalCss = exportData.gameCSS;

    if (fontName) {
      const googleFontName = fontName.replace(/ /g, '+');
      const fontCssUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;700&display=swap`;
      try {
        const cssResponse = await fetch(fontCssUrl);
        if (cssResponse.ok) {
          let fontCssText = await cssResponse.text();
          const fontUrlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
          const fontFolder = zip.folder("fonts");
          const fontUrlsToDownload = new Set<string>();
          let match;
          while ((match = fontUrlRegex.exec(fontCssText)) !== null) fontUrlsToDownload.add(match[1]);

          for (const originalUrl of fontUrlsToDownload) {
            const fontFileName = originalUrl.substring(originalUrl.lastIndexOf('/') + 1);
            fontCssText = fontCssText.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `fonts/${fontFileName}`);
            const fontRes = await fetch(originalUrl);
            if (fontRes.ok) fontFolder.file(fontFileName, await fontRes.blob());
          }
          finalCss = fontCssText + '\n\n' + finalCss;
        } else {
          const fontUrl = getFontUrl(fontFamily);
          fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
        }
      } catch (e) {
        const fontUrl = getFontUrl(fontFamily);
        fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
      }
    }

    const engineData = prepareGameDataForEngine(exportData);
    const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');
    const finalGameScript = `window.embeddedGameData = ${safeJson};\n\n${gameJS}`;

    const trackersButtonHTML = (exportData.gameSystemEnabled === 'trackers' && (exportData.gameShowTrackersUI ?? true)) ? '<button id="trackers-button">__TRACKERS_BUTTON_TEXT__</button>' : '';
    const systemButtonHTML = (exportData.gameShowSystemButton ?? true) ? '<button id="system-button">__SYSTEM_BUTTON_TEXT__</button>' : '';

    let html = exportData.gameHTML
      .replace('__GAME_TITLE__', exportData.gameTitle || 'IF Builder Game')
      .replace('__THEME_CLASS__', `${exportData.gameTheme || 'dark'}-theme with-spacing`)
      .replace('__LAYOUT_ORIENTATION_CLASS__', exportData.gameLayoutOrientation === 'horizontal' ? 'layout-horizontal' : '')
      .replace('__LAYOUT_ORDER_CLASS__', exportData.gameLayoutOrder === 'image-last' ? 'layout-image-last' : '')
      .replace('__FRAME_CLASS__', getFrameClass(exportData.gameImageFrame))
      .replace('__MOBILE_BEHAVIOR_CLASS__', 'behavior-immersive') // FIXO: COMPORTAMENTO IMERSIVO
      .replace('__FONT_STYLESHEET__', fontStylesheet)
      .replace('__CHANCES_CONTAINER__', exportData.gameSystemEnabled === 'chances' ? '<div id="chances-container" class="chances-container"></div>' : '')
      .replace('__TRACKERS_BUTTON__', trackersButtonHTML)
      .replace('__SYSTEM_BUTTON__', systemButtonHTML)
      .replace(/__SUGGESTIONS_BUTTON_TEXT__/g, exportData.gameSuggestionsButtonText || 'Sugestões')
      .replace(/__INVENTORY_BUTTON_TEXT__/g, exportData.gameInventoryButtonText || 'Inventário')
      .replace(/__DIARY_BUTTON_TEXT__/g, exportData.gameDiaryButtonText || 'Diário')
      .replace(/__TRACKERS_BUTTON_TEXT__/g, exportData.gameTrackersButtonText || 'Rastreadores')
      .replace(/__SYSTEM_BUTTON_TEXT__/g, exportData.gameSystemButtonText || 'Sistema')
      .replace('__SAVE_MENU_TITLE__', exportData.gameSaveMenuTitle || 'Salvar Jogo')
      .replace('__LOAD_MENU_TITLE__', exportData.gameLoadMenuTitle || 'Carregar Jogo')
      .replace('__MAIN_MENU_BUTTON_TEXT__', exportData.gameMainMenuButtonText || 'Menu Principal')
      .replace('__SPLASH_BG_STYLE__', exportData.gameSplashImage ? `style="background-image: url('${exportData.gameSplashImage}')"` : '')
      .replace('__SPLASH_ALIGN_CLASS__', exportData.gameSplashContentAlignment === 'left' ? 'align-left' : '')
      .replace('__SPLASH_LOGO_IMG_TAG__', exportData.gameLogo ? `<img src="${exportData.gameLogo}" alt="Logo" class="splash-logo">` : '')
      .replace('__SPLASH_TITLE_H1_TAG__', !exportData.gameOmitSplashTitle ? `<h1>${exportData.gameTitle}</h1>` : '')
      .replace('__SPLASH_DESCRIPTION__', exportData.gameSplashDescription || '')
      .replace('__SPLASH_BUTTON_TEXT__', exportData.gameSplashButtonText || 'Start')
      .replace('__CONTINUE_BUTTON_TEXT__', exportData.gameContinueButtonText || 'Continue')
      .replace(/__RESTART_BUTTON_TEXT__/g, exportData.gameRestartButtonText || 'Reiniciar Aventura')
      .replace('__ACTION_BUTTON_TEXT__', exportData.gameActionButtonText || 'Action')
      .replace('__VERB_INPUT_PLACEHOLDER__', exportData.gameVerbInputPlaceholder || 'What do you do?')
      .replace('__VIEW_ENDING_BUTTON_TEXT__', exportData.gameViewEndingButtonText || 'Ver Final')
      .replace('__POSITIVE_ENDING_BG_STYLE__', exportData.positiveEndingImage ? `style="background-image: url('${exportData.positiveEndingImage}')"` : '')
      .replace('__POSITIVE_ENDING_ALIGN_CLASS__', exportData.positiveEndingContentAlignment === 'left' ? 'align-left' : '')
      .replace('__POSITIVE_ENDING_DESCRIPTION__', exportData.positiveEndingDescription || '')
      .replace('__NEGATIVE_ENDING_BG_STYLE__', exportData.negativeEndingImage ? `style="background-image: url('${exportData.negativeEndingImage}')"` : '')
      .replace('__NEGATIVE_ENDING_ALIGN_CLASS__', exportData.negativeEndingContentAlignment === 'left' ? 'align-left' : '')
      .replace('__NEGATIVE_ENDING_DESCRIPTION__', exportData.negativeEndingDescription || '');

    html = html.replace('</body>', '<script src="game.js"></script></body>');

    const css = finalCss
      .replace(/__FONT_FAMILY__/g, fontFamily)
      .replace(/__GAME_FONT_SIZE__/g, exportData.gameFontSize || '1em')
      .replace(/__GAME_TEXT_COLOR__/g, exportData.gameTextColor || '#c9d1d9')
      .replace(/__GAME_TITLE_COLOR__/g, exportData.gameTitleColor || '#58a6ff')
      .replace(/__GAME_FOCUS_COLOR__/g, exportData.gameFocusColor || '#58a6ff')
      .replace(/__GAME_TEXT_COLOR_LIGHT__/g, exportData.textColorLight || '#24292f')
      .replace(/__GAME_TITLE_COLOR_LIGHT__/g, exportData.titleColorLight || '#0969da')
      .replace(/__GAME_FOCUS_COLOR_LIGHT__/g, exportData.focusColorLight || '#0969da')
      .replace(/__SPLASH_BUTTON_COLOR__/g, exportData.gameSplashButtonColor || '#2ea043')
      .replace(/__SPLASH_BUTTON_HOVER_COLOR__/g, exportData.gameSplashButtonHoverColor || '#238636')
      .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
      .replace(/__ACTION_BUTTON_COLOR__/g, exportData.gameActionButtonColor || '#ffffff')
      .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
      .replace(/__ACTION_BUTTON_TEXT_COLOR__/g, exportData.gameActionButtonTextColor || '#0d1117')
      .replace(/__FRAME_BOOK_COLOR__/g, exportData.frameBookColor || '#FFFFFF')
      .replace(/__FRAME_TRADING_CARD_COLOR__/g, exportData.frameTradingCardColor || '#1c1917')
      .replace(/__FRAME_ROUNDED_TOP_COLOR__/g, exportData.frameRoundedTopColor || '#facc15')
      .replace(/__SCENE_NAME_OVERLAY_BG__/g, exportData.gameSceneNameOverlayBg || '#0d1117')
      .replace(/__SCENE_NAME_OVERLAY_TEXT_COLOR__/g, exportData.gameSceneNameOverlayTextColor || '#c9d1d9')
      .replace(/__CONTINUE_INDICATOR_COLOR__/g, exportData.gameContinueIndicatorColor || exportData.gameTitleColor || '#58a6ff');

    zip.file("index.html", html);
    zip.file("style.css", css);
    zip.file("game.js", finalGameScript);

    const zipContent = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipContent);
    link.download = `${exportData.gameTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'game'}.zip`;
    link.click();
  };

  const handleImport = async (file: File) => {
    if (typeof JSZip === 'undefined') {
      alert('A biblioteca JSZip não foi carregada. Não é possível importar.');
      return;
    }

    const reader = new FileReader();
    if (file.name.endsWith('.zip')) {
      reader.onload = async (ev) => {
        try {
          const zip = await JSZip.loadAsync(ev.target?.result);
          const editorDataStr = await zip.file('editor_data.json')?.async('string');
          if (!editorDataStr) throw new Error("editor_data.json não encontrado no pacote ZIP.");

          const data = JSON.parse(editorDataStr);

          const restoreAsset = async (path: string | undefined): Promise<string | undefined> => {
            if (!path || !path.startsWith('assets/')) return path;
            const zipFile = zip.file(path);
            if (!zipFile) return path;

            const mimeType = getMimeTypeFromFileName(path);
            const buffer = await zipFile.async('arraybuffer');
            const blob = new Blob([buffer], { type: mimeType });

            return new Promise((resolve) => {
              const readerAsset = new FileReader();
              readerAsset.onloadend = () => resolve(readerAsset.result as string);
              readerAsset.readAsDataURL(blob);
            });
          };

          data.gameLogo = await restoreAsset(data.gameLogo);
          data.gameSplashImage = await restoreAsset(data.gameSplashImage);
          data.gameBackgroundMusic = await restoreAsset(data.gameBackgroundMusic);
          data.positiveEndingImage = await restoreAsset(data.positiveEndingImage);
          data.negativeEndingImage = await restoreAsset(data.negativeEndingImage);

          if (data.scenes) {
            for (const sId in data.scenes) {
              const scene = data.scenes[sId];
              scene.image = await restoreAsset(scene.image);
              scene.backgroundMusic = await restoreAsset(scene.backgroundMusic);
              if (scene.interactions) {
                for (const inter of scene.interactions) {
                  inter.soundEffect = await restoreAsset(inter.soundEffect);
                }
              }
            }
          }

          if (data.globalObjects) {
            for (const oId in data.globalObjects) {
              const obj = data.globalObjects[oId];
              obj.image = await restoreAsset(obj.image);
            }
          }

          onImportGame(data);
        } catch (err) {
          alert("Erro ao importar ZIP: " + (err as Error).message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (ev) => onImportGame(JSON.parse(ev.target?.result as string));
      reader.readAsText(file);
    }
  };

  return (
    <aside className="w-1/4 xl:w-1/5 bg-brand-sidebar p-4 border-r border-brand-border flex flex-col">
      <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
        <button className={getButtonClass('interface')} onClick={() => onSetView('interface')}>
          <Code className="w-5 h-5 mr-3" />
          <span className="font-semibold">Informações e Interface</span>
        </button>

        <div>
          <button className={getButtonClass('scenes')} onClick={handleToggleScenes}>
            <BookOpen className="w-5 h-5 mr-3" />
            <span className="font-semibold">Editor de Cenas</span>
            <span className="ml-auto bg-white text-brand-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {scenes.length}
            </span>
          </button>
          {isExpanded && (
            <div className="pl-4 mt-2 ml-2">
              <SceneList scenes={scenes} {...sceneListProps} />
            </div>
          )}
        </div>

        <button className={getButtonClass('map')} onClick={() => onSetView('map')}>
          <Map className="w-5 h-5 mr-3" />
          <span className="font-semibold">Mapa de Cenas</span>
        </button>

        <button className={getButtonClass('global_objects')} onClick={() => onSetView('global_objects')}>
          <Box className="w-5 h-5 mr-3" />
          <span className="font-semibold">Objetos</span>
        </button>
        <button className={getButtonClass('trackers')} onClick={() => onSetView('trackers')}>
          <SlidersHorizontal className="w-5 h-5 mr-3" />
          <span className="font-semibold">Rastreadores</span>
        </button>
      </nav>

      <div className="flex-shrink-0 mt-4 pt-4 border-t border-brand-border flex flex-col gap-3">
        <input
          type="file"
          ref={importInputRef}
          className="hidden"
          accept=".json,.zip"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
            e.target.value = '';
          }}
        />
        <button onClick={() => importInputRef.current?.click()} className="flex items-center w-full px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors">
          <FileUp className="w-5 h-5 mr-2" /> Importar Jogo
        </button>
        <button onClick={handleExport} className="flex items-center w-full px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors">
          <Download className="w-5 h-5 mr-2" /> Exportar Jogo
        </button>
        <button onClick={onTogglePreview} className="flex items-center w-full px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors">
          <Eye className="w-5 h-5 mr-2" /> Pré-visualizar Jogo
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
