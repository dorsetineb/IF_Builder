import React, { useCallback, useState } from 'react';
import { GameData, Scene, View } from '../types';
import { getFontUrl, getFrameClass, getMimeTypeFromFileName } from '../utils/helpers';
import { prepareGameDataForEngine, gameJS } from '../components/game-engine';
import {
  gameHTML,
  gameCSS,
  initialGameData,
  OVERLAY_CSS,
  sanitizeLegacyI18n,
} from '../lib/gameDefaults';
import { FONTS } from '../constants';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { processAsset } from '../services/exportService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let JSZip: any;

interface UseExportImportProps {
  gameData: GameData;
  setGameData: React.Dispatch<React.SetStateAction<GameData>>;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  setImportKey: React.Dispatch<React.SetStateAction<number>>;
  setCurrentView: (view: View) => void;
  toast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any; // User profile
}

export const useExportImport = ({
  gameData,
  setGameData,
  setIsDirty,
  setImportKey,
  setCurrentView,
  toast,
  profile,
}: UseExportImportProps) => {
  const { t, i18n } = useTranslation();

  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async (customFilename?: string) => {
    if (typeof JSZip === 'undefined') {
      alert('A biblioteca JSZip não foi carregada. Não é possível exportar.');
      return;
    }

    const zip = new JSZip();
    // Check if we are using cloud assets or local base64?
    // IF Builder stores everything in JSON as base64 or URL.
    // We need to bundle assets.

    // Deep clone gameData (JSON parse/stringify for max compatibility)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportData = JSON.parse(JSON.stringify(gameData)) as any;
    const assetsFolder = zip.folder('assets');
    const assetMap = new Map<string, string>(); // base64 -> filename

    exportData.gameLogo = processAsset(exportData.gameLogo, 'logo', assetsFolder, assetMap);
    exportData.gameSplashImage = processAsset(exportData.gameSplashImage, 'splash_image', assetsFolder, assetMap);
    exportData.gameBackgroundMusic = processAsset(exportData.gameBackgroundMusic, 'project_bgm', assetsFolder, assetMap);
    exportData.positiveEndingImage = processAsset(
      exportData.positiveEndingImage,
      'positive_ending',
      assetsFolder,
      assetMap
    );
    exportData.negativeEndingImage = processAsset(
      exportData.negativeEndingImage,
      'negative_ending',
      assetsFolder,
      assetMap
    );

    for (const sceneId in exportData.scenes) {
      const scene = exportData.scenes[sceneId];
      scene.image = processAsset(scene.image, `scene_image_${sceneId}`, assetsFolder, assetMap);
      scene.backgroundMusic = processAsset(scene.backgroundMusic, `scene_bgm_${sceneId}`, assetsFolder, assetMap);
      if (scene.interactions) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scene.interactions.forEach((inter: any, index: number) => {
          inter.soundEffect = processAsset(inter.soundEffect, `sfx_${sceneId}_${index}`, assetsFolder, assetMap);
        });
      }
    }

    for (const objId in exportData.globalObjects) {
      const obj = exportData.globalObjects[objId];
      obj.image = processAsset(obj.image, `obj_image_${objId}`, assetsFolder, assetMap);
    }

    // Add Metadata
    const exportDate = new Date();
    const userName = profile?.username?.replace(/[^a-zA-Z0-9 _-]/g, '') || 'IF Builder User';

    exportData.metadata = {
      exportedBy: userName,
      exportDate: exportDate.toISOString(),
      platform: 'IF Builder',
      version: '1.0',
    };

    const readmeContent = `
================================================================
                    GAME INFORMATION
================================================================

TITLE:       ${exportData.gameTitle || 'Untitled Game'}
PLATFORM:    IF Builder
EXPORTED BY: ${userName}
DATE:        ${exportDate.toLocaleString()}

================================================================
        THANK YOU FOR CREATING WITH IF BUILDER
================================================================
`.trim();

    zip.file('README.txt', readmeContent);
    zip.file('editor_data.json', JSON.stringify(exportData));
    const fontFamily = exportData.gameFontFamily || "'Silkscreen', sans-serif";
    const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
    let fontStylesheet = '';
    let finalCss = exportData.gameCSS;

    // Sanitize legacy CSS: fix broken frame selectors (missing spaces in descendant selectors)
    const frameCssFixes: [string, string][] = [
      ['body.frame-rounded-top.game-container.image-panel', 'body.frame-rounded-top .game-container .image-panel'],
      ['body.frame-rounded-top.game-container.image-container', 'body.frame-rounded-top .game-container .image-container'],
      ['body.frame-book-cover.game-container.image-panel', 'body.frame-book-cover .game-container .image-panel'],
      ['body.frame-book-cover.game-container.image-container', 'body.frame-book-cover .game-container .image-container'],
      ['body.frame-trading-card.image-panel', 'body.frame-trading-card .image-panel'],
      ['body.frame-trading-card.game-container:not(.layout-image-last).image-panel', 'body.frame-trading-card .game-container:not(.layout-image-last) .image-panel'],
      ['body.frame-trading-card.game-container.layout-image-last.image-panel', 'body.frame-trading-card .game-container.layout-image-last .image-panel'],
      ['body.frame-trading-card.image-container', 'body.frame-trading-card .image-container'],
      ['body.frame-none.main-wrapper', 'body.frame-none .main-wrapper'],
      ['body.frame-none.game-container {', 'body.frame-none .game-container {'],
      ['body.frame-none.image-panel', 'body.frame-none .image-panel'],
      ['body.frame-none.game-container.layout-horizontal.image-panel', 'body.frame-none .game-container.layout-horizontal .image-panel'],
      ['body.frame-none.game-container.layout-image-last.image-panel', 'body.frame-none .game-container.layout-image-last .image-panel'],
    ];
    for (const [from, to] of frameCssFixes) {
      finalCss = finalCss.replaceAll(from, to);
    }

    if (fontName) {
      const googleFontName = fontName.replace(/ /g, '+');
      const fontCssUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;700&display=swap`;
      try {
        const cssResponse = await fetch(fontCssUrl);
        if (cssResponse.ok) {
          let fontCssText = await cssResponse.text();
          const fontUrlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
          const fontFolder = zip.folder('fonts');
          const fontUrlsToDownload = new Set<string>();
          let match;
          while ((match = fontUrlRegex.exec(fontCssText)) !== null)
            fontUrlsToDownload.add(match[1]);

          for (const originalUrl of fontUrlsToDownload) {
            const fontFileName = originalUrl.substring(originalUrl.lastIndexOf('/') + 1);
            fontCssText = fontCssText.replace(
              new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
              `fonts/${fontFileName}`
            );
            const fontRes = await fetch(originalUrl);
            if (fontRes.ok) fontFolder.file(fontFileName, await fontRes.blob());
          }
          finalCss = fontCssText + '\n\n' + finalCss;
        } else {
          const fontUrl = getFontUrl(fontFamily);
          fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
        }
      } catch {
        const fontUrl = getFontUrl(fontFamily);
        fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
      }
    }

    // Inject translated defaults for empty text fields before export
    const textDefaults: Record<string, string> = {
      gameSplashButtonText: t('UIEditor.textos.splashButtonPlaceholder'),
      gameContinueButtonText: t('UIEditor.textos.continueButtonPlaceholder'),
      gameRestartButtonText: t('UIEditor.textos.restartButtonPlaceholder'),
      gameActionButtonText: t('UIEditor.textos.actionButtonPlaceholder'),
      gameVerbInputPlaceholder: t('UIEditor.textos.commandInputValue'),
      gameSuggestionsButtonText: t('UIEditor.textos.suggestionsPlaceholder'),
      gameInventoryButtonText: t('UIEditor.textos.inventoryPlaceholder'),
      gameDiaryButtonText: t('UIEditor.textos.diaryPlaceholder'),
      gameTrackersButtonText: t('UIEditor.textos.trackersPlaceholder'),
      gameSystemButtonText: t('UIEditor.textos.systemPlaceholder'),
      gameMainMenuButtonText: t('UIEditor.textos.mainMenuPlaceholder'),
      gameSaveMenuTitle: t('UIEditor.textos.saveMenuPlaceholder', 'Save Game'),
      gameLoadMenuTitle: t('UIEditor.textos.loadMenuPlaceholder', 'Load Game'),
      gameViewEndingButtonText: t('UIEditor.textos.viewEndingPlaceholder'),
      gameDiaryPlayerName: t('UIEditor.textos.diaryPlayerNamePlaceholder'),
      gameSuggestionsEmptyFeedback: t('UIEditor.textos.suggestionsEmptyFeedbackDefault'),
      gameInventoryEmptyFeedback: t('UIEditor.textos.inventoryEmptyFeedbackDefault'),
    };
    // Fill empty text fields with translated defaults so exported data is self-contained
    Object.keys(textDefaults).forEach((key) => {
      if (!exportData[key]) exportData[key] = textDefaults[key];
    });

    const engineData = prepareGameDataForEngine(exportData);
    const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');
    const finalGameScript = `window.embeddedGameData = ${safeJson};\n\n${gameJS}`;

    const trackersButtonHTML =
      exportData.enableTrackers && (exportData.gameShowTrackersUI ?? true)
        ? '<button id="trackers-button">__TRACKERS_BUTTON_TEXT__</button>'
        : '';
    const systemButtonHTML =
      (exportData.gameShowSystemButton ?? true)
        ? '<button id="system-button">__SYSTEM_BUTTON_TEXT__</button>'
        : '';

    const suggestionsButtonHTML =
      (exportData.enableSuggestions ?? true)
        ? `<button id="suggestions-button">${exportData.gameSuggestionsButtonText || t('UIEditor.textos.suggestionsPlaceholder')}</button>`
        : '';

    const inventoryButtonHTML =
      (exportData.enableInventory ?? true)
        ? `<button id="inventory-button">${exportData.gameInventoryButtonText || t('UIEditor.textos.inventoryPlaceholder')}</button>`
        : '';

    const diaryButtonHTML =
      (exportData.enableDiary ?? true)
        ? `<button id="diary-button">${exportData.gameDiaryButtonText || t('UIEditor.textos.diaryPlaceholder')}</button>`
        : '';

    let htmlContent = gameData.gameHTML
      .replace('__GAME_TITLE__', exportData.gameTitle || 'IF Builder Game')
      .replace('__THEME_CLASS__', `${exportData.gameTheme || 'dark'}-theme with-spacing`)
      .replace(
        '__LAYOUT_ORIENTATION_CLASS__',
        exportData.gameLayoutOrientation === 'horizontal' ? 'layout-horizontal' : ''
      )
      .replace(
        '__LAYOUT_ORDER_CLASS__',
        exportData.gameLayoutOrder === 'image-last' ? 'layout-image-last' : ''
      )
      .replace('__FRAME_CLASS__', getFrameClass(exportData.gameImageFrame))
      .replace('__MOBILE_BEHAVIOR_CLASS__', 'behavior-immersive')
      .replace('__FONT_STYLESHEET__', fontStylesheet)
      .replace(
        '__CHANCES_CONTAINER__',
        exportData.enableChances
          ? '<div id="chances-container" class="chances-container"></div>'
          : ''
      )
      .replace('__TRACKERS_BUTTON__', trackersButtonHTML)
      .replace('__SYSTEM_BUTTON__', systemButtonHTML)
      .replace('__SUGGESTIONS_BUTTON__', suggestionsButtonHTML)
      .replace('__INVENTORY_BUTTON__', inventoryButtonHTML)
      .replace('__DIARY_BUTTON__', diaryButtonHTML)
      .replace(
        /__INVENTORY_BUTTON_TEXT__/g,
        exportData.gameInventoryButtonText || t('UIEditor.textos.inventoryPlaceholder')
      )
      .replace(
        /__SUGGESTIONS_BUTTON_TEXT__/g,
        exportData.gameSuggestionsButtonText || t('UIEditor.textos.suggestionsPlaceholder')
      )
      .replace(
        /__TRACKERS_BUTTON_TEXT__/g,
        exportData.gameTrackersButtonText || t('UIEditor.textos.trackersPlaceholder')
      )
      .replace(
        /__SYSTEM_BUTTON_TEXT__/g,
        exportData.gameSystemButtonText || t('UIEditor.textos.systemPlaceholder')
      )
      .replace(
        '__SAVE_MENU_TITLE__',
        exportData.gameSaveMenuTitle || t('UIEditor.textos.saveMenuPlaceholder', 'Save Game')
      )
      .replace(
        '__LOAD_MENU_TITLE__',
        exportData.gameLoadMenuTitle || t('UIEditor.textos.loadMenuPlaceholder', 'Load Game')
      )
      .replace(
        '__MAIN_MENU_BUTTON_TEXT__',
        exportData.gameMainMenuButtonText || t('UIEditor.textos.mainMenuPlaceholder')
      )
      .replace(
        /(<button(?:(?!\bid="vignette-continue-button")[^>])*class="[^"]*ending-restart-button[^"]*"[^>]*>)(.*?)(<\/button>)/g,
        `$1${exportData.gameRestartButtonText || t('UIEditor.textos.restartButtonPlaceholder')}$3`
      )
      .replace(
        /<button id="continue-button"([^>]*)>.*?<\/button>/g,
        `<button id="continue-button"$1>${exportData.gameContinueButtonText || t('UIEditor.textos.continueButtonPlaceholder')}</button>`
      )
      .replace(
        /<button id="system-button"([^>]*)>.*?<\/button>/g,
        `<button id="system-button"$1>${exportData.gameSystemButtonText || t('UIEditor.textos.systemPlaceholder')}</button>`
      )
      .replace(
        '__CONTINUE_BUTTON_TEXT__',
        exportData.gameContinueButtonText || t('UIEditor.textos.continueButtonPlaceholder')
      )
      .replace(
        /__RESTART_BUTTON_TEXT__/g,
        exportData.gameRestartButtonText || t('UIEditor.textos.restartButtonPlaceholder')
      )
      .replace(
        '__ACTION_BUTTON_TEXT__',
        exportData.gameActionButtonText || t('UIEditor.textos.actionButtonPlaceholder')
      )
      .replace(
        '__VERB_INPUT_PLACEHOLDER__',
        exportData.gameVerbInputPlaceholder || t('UIEditor.textos.commandInputValue')
      )
      .replace(
        '__VIEW_ENDING_BUTTON_TEXT__',
        exportData.gameViewEndingButtonText || t('UIEditor.textos.viewEndingPlaceholder')
      )
      .replace(
        '__POSITIVE_ENDING_BG_STYLE__',
        exportData.positiveEndingImage
          ? `style="background-image: url('${exportData.positiveEndingImage}')"`
          : ''
      )
      .replace(
        '__POSITIVE_ENDING_ALIGN_CLASS__',
        exportData.positiveEndingContentAlignment === 'left' ? 'align-left' : ''
      )
      .replace('__POSITIVE_ENDING_DESCRIPTION__', exportData.positiveEndingDescription || '')
      .replace(
        '__NEGATIVE_ENDING_BG_STYLE__',
        exportData.negativeEndingImage
          ? `style="background-image: url('${exportData.negativeEndingImage}')"`
          : ''
      )
      .replace(
        '__NEGATIVE_ENDING_ALIGN_CLASS__',
        exportData.negativeEndingContentAlignment === 'left' ? 'align-left' : ''
      )
      .replace('__NEGATIVE_ENDING_DESCRIPTION__', exportData.negativeEndingDescription || '');

    htmlContent = htmlContent.replace('</body>', '<script src="game.js"></script></body>');

    const css =
      finalCss
        .replace(/__FONT_FAMILY__/g, fontFamily)
        .replace(/__GAME_FONT_SIZE__/g, (() => {
          const size = exportData.gameFontSize || '14';
          const isNumeric = /^\\d+$/.test(size);
          if (!isNumeric) return size;
          const fontInfo = FONTS.find(f => f.family === fontFamily);
          const multiplier = fontInfo?.sizeAdjust || 1.0;
          return `${Math.round(parseInt(size) * multiplier)}px`;
        })())
        .replace(/__GAME_TEXT_COLOR__/g, exportData.gameTextColor || '#c9d1d9')
        .replace(/__GAME_TITLE_COLOR__/g, exportData.gameTitleColor || '#58a6ff')
        .replace(/__GAME_FOCUS_COLOR__/g, exportData.gameFocusColor || '#58a6ff')
        .replace(/__GAME_TEXT_COLOR_LIGHT__/g, exportData.textColorLight || '#24292f')
        .replace(/__GAME_TITLE_COLOR_LIGHT__/g, exportData.titleColorLight || '#0969da')
        .replace(/__GAME_FOCUS_COLOR_LIGHT__/g, exportData.focusColorLight || '#0969da')
        .replace(/__SPLASH_BUTTON_COLOR__/g, exportData.gameSplashButtonColor || '#2ea043')
        .replace(
          /__SPLASH_BUTTON_HOVER_COLOR__/g,
          exportData.gameSplashButtonHoverColor || '#238636'
        )
        .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
        .replace(/__ACTION_BUTTON_COLOR__/g, exportData.gameActionButtonColor || '#ffffff')
        .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
        .replace(/__ACTION_BUTTON_TEXT_COLOR__/g, exportData.gameActionButtonTextColor || '#0d1117')
        .replace(/__FRAME_BOOK_COLOR__/g, exportData.frameBookColor || exportData.gameFrameColor || '#FFFFFF')
        .replace(/__FRAME_TRADING_CARD_COLOR__/g, exportData.frameTradingCardColor || exportData.gameFrameColor || '#FFFFFF')
        .replace(/__FRAME_ROUNDED_TOP_COLOR__/g, exportData.frameRoundedTopColor || exportData.gameFrameColor || '#FFFFFF')
        .replace(/__SCENE_NAME_OVERLAY_BG__/g, exportData.gameSceneNameOverlayBg || '#0d1117')
        .replace(
          /__SCENE_NAME_OVERLAY_TEXT_COLOR__/g,
          exportData.gameSceneNameOverlayTextColor || '#c9d1d9'
        )
        .replace(
          /__SCENE_NAME_OVERLAY_TEXT_COLOR__/g,
          exportData.gameSceneNameOverlayTextColor || '#c9d1d9'
        )
        .replace(
          /__CONTINUE_INDICATOR_COLOR__/g,
          exportData.gameContinueIndicatorColor || exportData.gameTitleColor || '#58a6ff'
        ) + OVERLAY_CSS;

    zip.file('index.html', htmlContent);
    zip.file('style.css', css);
    zip.file('game.js', finalGameScript);

    // Use lower compression level for speed
    const zipContent = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 1 },
    });
    const finalBlob = new Blob([zipContent], { type: 'application/zip' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);

    let finalFilename =
      customFilename || exportData.gameTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'game';
    if (!finalFilename.toLowerCase().endsWith('.zip')) {
      finalFilename += '.zip';
    }
    link.download = finalFilename;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    }, 100);
  };

  const handleExportHTML = async (customFilename?: string) => {
    // Deep clone gameData — keep Base64 data URIs inline (no extraction)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportData = JSON.parse(JSON.stringify(gameData)) as any;

    // Add Metadata
    const exportDate = new Date();
    const userName = profile?.username?.replace(/[^a-zA-Z0-9 _-]/g, '') || 'IF Builder User';

    exportData.metadata = {
      exportedBy: userName,
      exportDate: exportDate.toISOString(),
      platform: 'IF Builder',
      version: '1.0',
      format: 'single-html',
    };

    const fontFamily = exportData.gameFontFamily || "'Silkscreen', sans-serif";
    const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
    let fontStylesheet = '';
    let finalCss = exportData.gameCSS;

    // Sanitize legacy CSS (same fixes as ZIP export)
    const frameCssFixes: [string, string][] = [
      ['body.frame-rounded-top.game-container.image-panel', 'body.frame-rounded-top .game-container .image-panel'],
      ['body.frame-rounded-top.game-container.image-container', 'body.frame-rounded-top .game-container .image-container'],
      ['body.frame-book-cover.game-container.image-panel', 'body.frame-book-cover .game-container .image-panel'],
      ['body.frame-book-cover.game-container.image-container', 'body.frame-book-cover .game-container .image-container'],
      ['body.frame-trading-card.image-panel', 'body.frame-trading-card .image-panel'],
      ['body.frame-trading-card.game-container:not(.layout-image-last).image-panel', 'body.frame-trading-card .game-container:not(.layout-image-last) .image-panel'],
      ['body.frame-trading-card.game-container.layout-image-last.image-panel', 'body.frame-trading-card .game-container.layout-image-last .image-panel'],
      ['body.frame-trading-card.image-container', 'body.frame-trading-card .image-container'],
      ['body.frame-none.main-wrapper', 'body.frame-none .main-wrapper'],
      ['body.frame-none.game-container {', 'body.frame-none .game-container {'],
      ['body.frame-none.image-panel', 'body.frame-none .image-panel'],
      ['body.frame-none.game-container.layout-horizontal.image-panel', 'body.frame-none .game-container.layout-horizontal .image-panel'],
      ['body.frame-none.game-container.layout-image-last.image-panel', 'body.frame-none .game-container.layout-image-last .image-panel'],
    ];
    for (const [from, to] of frameCssFixes) {
      finalCss = finalCss.replaceAll(from, to);
    }

    // Embed fonts as Base64 inline in CSS
    if (fontName) {
      const googleFontName = fontName.replace(/ /g, '+');
      const fontCssUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;700&display=swap`;
      try {
        const cssResponse = await fetch(fontCssUrl);
        if (cssResponse.ok) {
          let fontCssText = await cssResponse.text();
          const fontUrlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
          const fontUrlsToDownload = new Set<string>();
          let match;
          while ((match = fontUrlRegex.exec(fontCssText)) !== null)
            fontUrlsToDownload.add(match[1]);

          for (const originalUrl of fontUrlsToDownload) {
            try {
              const fontRes = await fetch(originalUrl);
              if (fontRes.ok) {
                const fontBlob = await fontRes.blob();
                const fontBase64 = await new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(fontBlob);
                });
                fontCssText = fontCssText.replace(
                  new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                  fontBase64
                );
              }
            } catch { /* skip font if fetch fails */ }
          }
          finalCss = fontCssText + '\n\n' + finalCss;
        } else {
          const fontUrl = getFontUrl(fontFamily);
          fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
        }
      } catch {
        const fontUrl = getFontUrl(fontFamily);
        fontStylesheet = fontUrl ? `<link href="${fontUrl}" rel="stylesheet">` : '';
      }
    }

    // Inject translated defaults for empty text fields
    const textDefaults: Record<string, string> = {
      gameSplashButtonText: t('UIEditor.textos.splashButtonPlaceholder'),
      gameContinueButtonText: t('UIEditor.textos.continueButtonPlaceholder'),
      gameRestartButtonText: t('UIEditor.textos.restartButtonPlaceholder'),
      gameActionButtonText: t('UIEditor.textos.actionButtonPlaceholder'),
      gameVerbInputPlaceholder: t('UIEditor.textos.commandInputValue'),
      gameSuggestionsButtonText: t('UIEditor.textos.suggestionsPlaceholder'),
      gameInventoryButtonText: t('UIEditor.textos.inventoryPlaceholder'),
      gameDiaryButtonText: t('UIEditor.textos.diaryPlaceholder'),
      gameTrackersButtonText: t('UIEditor.textos.trackersPlaceholder'),
      gameSystemButtonText: t('UIEditor.textos.systemPlaceholder'),
      gameMainMenuButtonText: t('UIEditor.textos.mainMenuPlaceholder'),
      gameSaveMenuTitle: t('UIEditor.textos.saveMenuPlaceholder', 'Save Game'),
      gameLoadMenuTitle: t('UIEditor.textos.loadMenuPlaceholder', 'Load Game'),
      gameViewEndingButtonText: t('UIEditor.textos.viewEndingPlaceholder'),
      gameDiaryPlayerName: t('UIEditor.textos.diaryPlayerNamePlaceholder'),
      gameSuggestionsEmptyFeedback: t('UIEditor.textos.suggestionsEmptyFeedbackDefault'),
      gameInventoryEmptyFeedback: t('UIEditor.textos.inventoryEmptyFeedbackDefault'),
    };
    Object.keys(textDefaults).forEach((key) => {
      if (!exportData[key]) exportData[key] = textDefaults[key];
    });

    const engineData = prepareGameDataForEngine(exportData);
    const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');
    const finalGameScript = `window.embeddedGameData = ${safeJson};\n\n${gameJS}`;

    const trackersButtonHTML =
      exportData.enableTrackers && (exportData.gameShowTrackersUI ?? true)
        ? '<button id="trackers-button">__TRACKERS_BUTTON_TEXT__</button>'
        : '';
    const systemButtonHTML =
      (exportData.gameShowSystemButton ?? true)
        ? '<button id="system-button">__SYSTEM_BUTTON_TEXT__</button>'
        : '';

    const suggestionsButtonHTML =
      (exportData.enableSuggestions ?? true)
        ? `<button id="suggestions-button">${exportData.gameSuggestionsButtonText || t('UIEditor.textos.suggestionsPlaceholder')}</button>`
        : '';

    const inventoryButtonHTML =
      (exportData.enableInventory ?? true)
        ? `<button id="inventory-button">${exportData.gameInventoryButtonText || t('UIEditor.textos.inventoryPlaceholder')}</button>`
        : '';

    const diaryButtonHTML =
      (exportData.enableDiary ?? true)
        ? `<button id="diary-button">${exportData.gameDiaryButtonText || t('UIEditor.textos.diaryPlaceholder')}</button>`
        : '';

    let htmlContent = gameData.gameHTML
      .replace('__GAME_TITLE__', exportData.gameTitle || 'IF Builder Game')
      .replace('__THEME_CLASS__', `${exportData.gameTheme || 'dark'}-theme with-spacing`)
      .replace(
        '__LAYOUT_ORIENTATION_CLASS__',
        exportData.gameLayoutOrientation === 'horizontal' ? 'layout-horizontal' : ''
      )
      .replace(
        '__LAYOUT_ORDER_CLASS__',
        exportData.gameLayoutOrder === 'image-last' ? 'layout-image-last' : ''
      )
      .replace('__FRAME_CLASS__', getFrameClass(exportData.gameImageFrame))
      .replace('__MOBILE_BEHAVIOR_CLASS__', 'behavior-immersive')
      .replace('__FONT_STYLESHEET__', fontStylesheet)
      .replace(
        '__CHANCES_CONTAINER__',
        exportData.enableChances
          ? '<div id="chances-container" class="chances-container"></div>'
          : ''
      )
      .replace('__TRACKERS_BUTTON__', trackersButtonHTML)
      .replace('__SYSTEM_BUTTON__', systemButtonHTML)
      .replace('__SUGGESTIONS_BUTTON__', suggestionsButtonHTML)
      .replace('__INVENTORY_BUTTON__', inventoryButtonHTML)
      .replace('__DIARY_BUTTON__', diaryButtonHTML)
      .replace(
        /__INVENTORY_BUTTON_TEXT__/g,
        exportData.gameInventoryButtonText || t('UIEditor.textos.inventoryPlaceholder')
      )
      .replace(
        /__SUGGESTIONS_BUTTON_TEXT__/g,
        exportData.gameSuggestionsButtonText || t('UIEditor.textos.suggestionsPlaceholder')
      )
      .replace(
        /__TRACKERS_BUTTON_TEXT__/g,
        exportData.gameTrackersButtonText || t('UIEditor.textos.trackersPlaceholder')
      )
      .replace(
        /__SYSTEM_BUTTON_TEXT__/g,
        exportData.gameSystemButtonText || t('UIEditor.textos.systemPlaceholder')
      )
      .replace(
        '__SAVE_MENU_TITLE__',
        exportData.gameSaveMenuTitle || t('UIEditor.textos.saveMenuPlaceholder', 'Save Game')
      )
      .replace(
        '__LOAD_MENU_TITLE__',
        exportData.gameLoadMenuTitle || t('UIEditor.textos.loadMenuPlaceholder', 'Load Game')
      )
      .replace(
        '__MAIN_MENU_BUTTON_TEXT__',
        exportData.gameMainMenuButtonText || t('UIEditor.textos.mainMenuPlaceholder')
      )
      .replace(
        /(<button(?:(?!\bid="vignette-continue-button")[^>])*class="[^"]*ending-restart-button[^"]*"[^>]*>)(.*?)(<\/button>)/g,
        `$1${exportData.gameRestartButtonText || t('UIEditor.textos.restartButtonPlaceholder')}$3`
      )
      .replace(
        /<button id="continue-button"([^>]*)>.*?<\/button>/g,
        `<button id="continue-button"$1>${exportData.gameContinueButtonText || t('UIEditor.textos.continueButtonPlaceholder')}</button>`
      )
      .replace(
        /<button id="system-button"([^>]*)>.*?<\/button>/g,
        `<button id="system-button"$1>${exportData.gameSystemButtonText || t('UIEditor.textos.systemPlaceholder')}</button>`
      )
      .replace(
        '__CONTINUE_BUTTON_TEXT__',
        exportData.gameContinueButtonText || t('UIEditor.textos.continueButtonPlaceholder')
      )
      .replace(
        /__RESTART_BUTTON_TEXT__/g,
        exportData.gameRestartButtonText || t('UIEditor.textos.restartButtonPlaceholder')
      )
      .replace(
        '__ACTION_BUTTON_TEXT__',
        exportData.gameActionButtonText || t('UIEditor.textos.actionButtonPlaceholder')
      )
      .replace(
        '__VERB_INPUT_PLACEHOLDER__',
        exportData.gameVerbInputPlaceholder || t('UIEditor.textos.commandInputValue')
      )
      .replace(
        '__VIEW_ENDING_BUTTON_TEXT__',
        exportData.gameViewEndingButtonText || t('UIEditor.textos.viewEndingPlaceholder')
      )
      .replace(
        '__POSITIVE_ENDING_BG_STYLE__',
        exportData.positiveEndingImage
          ? `style="background-image: url('${exportData.positiveEndingImage}')"`
          : ''
      )
      .replace(
        '__POSITIVE_ENDING_ALIGN_CLASS__',
        exportData.positiveEndingContentAlignment === 'left' ? 'align-left' : ''
      )
      .replace('__POSITIVE_ENDING_DESCRIPTION__', exportData.positiveEndingDescription || '')
      .replace(
        '__NEGATIVE_ENDING_BG_STYLE__',
        exportData.negativeEndingImage
          ? `style="background-image: url('${exportData.negativeEndingImage}')"`
          : ''
      )
      .replace(
        '__NEGATIVE_ENDING_ALIGN_CLASS__',
        exportData.negativeEndingContentAlignment === 'left' ? 'align-left' : ''
      )
      .replace('__NEGATIVE_ENDING_DESCRIPTION__', exportData.negativeEndingDescription || '');

    // Build final CSS with replacements
    const css =
      finalCss
        .replace(/__FONT_FAMILY__/g, fontFamily)
        .replace(/__GAME_FONT_SIZE__/g, (() => {
          const size = exportData.gameFontSize || '14';
          const isNumeric = /^\\d+$/.test(size);
          if (!isNumeric) return size;
          const fontInfo = FONTS.find(f => f.family === fontFamily);
          const multiplier = fontInfo?.sizeAdjust || 1.0;
          return `${Math.round(parseInt(size) * multiplier)}px`;
        })())
        .replace(/__GAME_TEXT_COLOR__/g, exportData.gameTextColor || '#c9d1d9')
        .replace(/__GAME_TITLE_COLOR__/g, exportData.gameTitleColor || '#58a6ff')
        .replace(/__GAME_FOCUS_COLOR__/g, exportData.gameFocusColor || '#58a6ff')
        .replace(/__GAME_TEXT_COLOR_LIGHT__/g, exportData.textColorLight || '#24292f')
        .replace(/__GAME_TITLE_COLOR_LIGHT__/g, exportData.titleColorLight || '#0969da')
        .replace(/__GAME_FOCUS_COLOR_LIGHT__/g, exportData.focusColorLight || '#0969da')
        .replace(/__SPLASH_BUTTON_COLOR__/g, exportData.gameSplashButtonColor || '#2ea043')
        .replace(
          /__SPLASH_BUTTON_HOVER_COLOR__/g,
          exportData.gameSplashButtonHoverColor || '#238636'
        )
        .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
        .replace(/__ACTION_BUTTON_COLOR__/g, exportData.gameActionButtonColor || '#ffffff')
        .replace(/__SPLASH_BUTTON_TEXT_COLOR__/g, exportData.gameSplashButtonTextColor || '#ffffff')
        .replace(/__ACTION_BUTTON_TEXT_COLOR__/g, exportData.gameActionButtonTextColor || '#0d1117')
        .replace(/__FRAME_BOOK_COLOR__/g, exportData.frameBookColor || exportData.gameFrameColor || '#FFFFFF')
        .replace(/__FRAME_TRADING_CARD_COLOR__/g, exportData.frameTradingCardColor || exportData.gameFrameColor || '#FFFFFF')
        .replace(/__FRAME_ROUNDED_TOP_COLOR__/g, exportData.frameRoundedTopColor || exportData.gameFrameColor || '#FFFFFF')
        .replace(/__SCENE_NAME_OVERLAY_BG__/g, exportData.gameSceneNameOverlayBg || '#0d1117')
        .replace(
          /__SCENE_NAME_OVERLAY_TEXT_COLOR__/g,
          exportData.gameSceneNameOverlayTextColor || '#c9d1d9'
        )
        .replace(
          /__SCENE_NAME_OVERLAY_TEXT_COLOR__/g,
          exportData.gameSceneNameOverlayTextColor || '#c9d1d9'
        )
        .replace(
          /__CONTINUE_INDICATOR_COLOR__/g,
          exportData.gameContinueIndicatorColor || exportData.gameTitleColor || '#58a6ff'
        ) + OVERLAY_CSS;

    // Inline CSS into the HTML (replace <link rel="stylesheet" href="style.css"> if present)
    htmlContent = htmlContent.replace(
      /<link[^>]*href="style\.css"[^>]*>/,
      `<style>${css}</style>`
    );
    // If no external stylesheet link exists, inject <style> before </head>
    if (!htmlContent.includes('<style>')) {
      htmlContent = htmlContent.replace('</head>', `<style>${css}</style>\n</head>`);
    }

    // Inline JS + editor source data before </body>
    const safeEditorJson = JSON.stringify(exportData).replace(/<\/script/g, '<\\/script>');
    htmlContent = htmlContent.replace(
      '</body>',
      `<script>${finalGameScript}<` + `/script>\n` +
      `<script id="if-builder-source" type="application/json">${safeEditorJson}<` + `/script>\n` +
      '</body>'
    );

    // Download as single HTML file
    const finalBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(finalBlob);

    let finalFilename =
      customFilename || exportData.gameTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'game';
    if (!finalFilename.toLowerCase().endsWith('.html')) {
      finalFilename += '.html';
    }
    link.download = finalFilename;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    }, 100);
  };

  const handleImportGame = useCallback(
    (data: GameData) => {
      const cleanedScenes = { ...data.scenes };
      let newStartSceneId = data.startScene;
      const newSceneOrder = [...(data.sceneOrder || Object.keys(cleanedScenes))];

      if (data.vignettes && data.vignettes.length > 0) {
        console.log('Migrating legacy vignettes...', data.vignettes);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.vignettes.forEach((v: any) => {
          let type: 'opening' | 'transition' | 'conclusion' | 'none' = 'transition';
          if (v.isConclusion) type = 'conclusion';
          else if (v.id.toUpperCase().includes('OPENING') || v.id.toUpperCase().includes('INTRO'))
            type = 'opening';
          else if (v.id === 'VNT_DEFEAT') type = 'conclusion'; // Defeat is now a conclusion layout

          const newScene: Scene = {
            id: v.id,
            name: v.name || v.title || 'Vinheta',
            description: v.description || '',
            image: v.image,
            backgroundMusic: v.backgroundMusic,
            vignetteType: type,
            vignetteButtonText: v.buttonText,
            interactions: [],
            objectIds: [],
            mapX: 0,
            mapY: 0,
            isDefeatOutcome: v.id === 'VNT_DEFEAT' ? true : undefined,
          };

          if (type === 'opening' && data.startScene) {
            newScene.vignetteNextSceneId = data.startScene;
            newStartSceneId = v.id;
          }

          cleanedScenes[v.id] = newScene;
          if (!newSceneOrder.includes(v.id)) {
            if (type === 'opening') newSceneOrder.unshift(v.id);
            else newSceneOrder.push(v.id);
          }
        });

        Object.values(cleanedScenes).forEach((scene) => {
          if (scene.interactions) {
            scene.interactions = scene.interactions.map((interaction) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if ((interaction as any).goToVignette) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const targetVignetteId = (interaction as any).goToVignette;
                if (cleanedScenes[targetVignetteId]) {
                  return {
                    ...interaction,
                    type: 'scene',
                    goToScene: targetVignetteId,
                    goToVignette: undefined,
                  };
                }
              }
              return interaction;
            });
          }
        });
      }

      Object.keys(cleanedScenes).forEach((id) => {
        cleanedScenes[id] = {
          ...cleanedScenes[id],
          objectIds: cleanedScenes[id].objectIds || [],
          interactions: cleanedScenes[id].interactions || [],
          mapX: undefined,
          mapY: undefined,
          isEndingScene: undefined,
          conclusionVignetteId: undefined,
        };
      });

      if (newStartSceneId && cleanedScenes[newStartSceneId]) {
        const startScene = cleanedScenes[newStartSceneId];
        const isGenericName = startScene.name === 'Abertura' || startScene.name === 'Vinheta';

        if (isGenericName && data.gameTitle && data.gameTitle.trim() !== '') {
          cleanedScenes[newStartSceneId] = {
            ...startScene,
            name: data.gameTitle,
          };
        }
      }

      const anySceneHasSuggestions = Object.values(cleanedScenes).some(
        (s) => s.suggestions && s.suggestions.length > 0
      );

      if (!anySceneHasSuggestions && data.gameInteractionType !== 'choice') {
        Object.values(cleanedScenes).forEach((s) => {
          if (s.vignetteType !== 'opening' && s.vignetteType !== 'conclusion' && s.vignetteType !== 'transition') {
            s.suggestions = ['Examinar', 'Pegar', 'Usar', 'Falar', 'Abrir'];
          }
        });
      }



      // Only sanitize truly legacy projects (before metadata field was added).
      // Modern exports already have proper text values baked in.
      const isLegacyProject = !data.metadata;
      const sanitizedData = isLegacyProject ? sanitizeLegacyI18n(data) : { ...data };

      // --- MIGRATE AND PURGE LEGACY FLAGS ---
      // Map legacy system flags to modern boolean flags if modern flags are missing
      if (sanitizedData.gameSystemEnabled === 'chances') {
        if (typeof sanitizedData.enableChances !== 'boolean') sanitizedData.enableChances = true;
      } else if (sanitizedData.gameSystemEnabled === 'trackers') {
        if (typeof sanitizedData.enableTrackers !== 'boolean') sanitizedData.enableTrackers = true;
      }

      if (sanitizedData.gameHideTitle && typeof sanitizedData.gameOmitSplashTitle !== 'boolean') {
        sanitizedData.gameOmitSplashTitle = true;
      }

      // Purge legacy flags so they never bleed into active state and cause ghost behaviors
      delete sanitizedData.gameSystemEnabled;
      delete sanitizedData.gameHideTitle;
      delete sanitizedData.vignettes; // Legacy vignettes array is obsolete (now scenes with vignetteType)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setGameData((prev) => ({
        ...initialGameData, // Start fresh to avoid ghost data from previous session
        ...sanitizedData,
        scenes: cleanedScenes,
        sceneOrder: newSceneOrder,
        startScene: newStartSceneId,
        gameHTML: gameHTML,
        gameCSS: gameCSS,
        gameMobileLayoutBehavior: 'immersive',
        fixedVerbs: sanitizedData.fixedVerbs || [],
        enableFixedVerbs:
          !!sanitizedData.enableFixedVerbs ||
          (Array.isArray(sanitizedData.fixedVerbs) && sanitizedData.fixedVerbs.length > 0),
        consequenceTrackers: sanitizedData.consequenceTrackers || [],
        gameTextAnimationType: sanitizedData.gameTextAnimationType || 'fade',
        gameTextSpeed: sanitizedData.gameTextSpeed || 5,
        gameImageTransitionType: sanitizedData.gameImageTransitionType || 'fade',
        gameImageSpeed: sanitizedData.gameImageSpeed || 5,
        enableSuggestions: sanitizedData.enableSuggestions ?? true,
        gameShowTrackersUI: sanitizedData.gameShowTrackersUI ?? true,
        gameShowSystemButton: sanitizedData.gameShowSystemButton ?? true,
        gameViewEndingButtonText: sanitizedData.gameViewEndingButtonText || '',
        positiveEndingMusic: sanitizedData.positiveEndingMusic || '',
        negativeEndingMusic: sanitizedData.negativeEndingMusic || '',
        vignettes: [],
      }));

      setIsDirty(false);
      setImportKey((prev) => prev + 1);
      toast(
        t('editor.projectImportedTitle', 'Projeto Importado'),
        t('editor.projectImportedDesc', 'Projeto carregado e migrado com sucesso.'),
        'success'
      );
      setCurrentView('three_panels');
    },
    [
      gameData.scenes,
      gameData.sceneOrder,
      setGameData,
      setIsDirty,
      setImportKey,
      setCurrentView,
      toast,
      t,
    ]
  );

  const handleImportFile = async (file: File) => {
    if (typeof JSZip === 'undefined') {
      alert('A biblioteca JSZip não foi carregada. Não é possível importar.');
      return;
    }

    setIsImporting(true);

    const reader = new FileReader();
    if (file.name.endsWith('.zip')) {
      reader.onload = async (ev) => {
        try {
          const zip = await JSZip.loadAsync(ev.target?.result);
          const editorDataStr = await zip.file('editor_data.json')?.async('string');
          if (!editorDataStr) throw new Error('editor_data.json não encontrado no pacote ZIP.');
          const data = JSON.parse(editorDataStr);

          // OPTIMIZED: Read base64 directly to avoid Blob/FileReader overhead
          const restoreAsset = async (path: string | undefined): Promise<string | undefined> => {
            if (!path) return path;
            let entryPath = path;
            if (path.startsWith('assets /')) entryPath = path.replace('assets / ', 'assets/');
            else if (!path.startsWith('assets/')) return path;

            const zipFile = zip.file(entryPath);
            if (!zipFile) return path;

            const mimeType = getMimeTypeFromFileName(path);
            const base64 = await zipFile.async('base64');
            return `data:${mimeType};base64,${base64}`;
          };

          // Parallelize global assets
          const globalAssetsPromises = [
            restoreAsset(data.gameLogo).then((res) => (data.gameLogo = res)),
            restoreAsset(data.gameSplashImage).then((res) => (data.gameSplashImage = res)),
            restoreAsset(data.gameBackgroundMusic).then((res) => {
              if (
                typeof data.gameBackgroundMusic === 'string' &&
                data.gameBackgroundMusic.includes('global_bgm')
              ) {
                data.gameBackgroundMusic = '';
              } else {
                data.gameBackgroundMusic = res;
              }
            }),
            restoreAsset(data.positiveEndingImage).then((res) => (data.positiveEndingImage = res)),
            restoreAsset(data.negativeEndingImage).then((res) => (data.negativeEndingImage = res)),
          ];

          await Promise.all(globalAssetsPromises);

          // Parallelize Scenes
          if (data.scenes) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const scenePromises = Object.values(data.scenes).map(async (scene: any) => {
              scene.image = await restoreAsset(scene.image);
              scene.backgroundMusic = await restoreAsset(scene.backgroundMusic);
              if (scene.interactions) {
                // Parallelize interactions within scene
                await Promise.all(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  scene.interactions.map(async (inter: any) => {
                    inter.soundEffect = await restoreAsset(inter.soundEffect);
                  })
                );
              }
            });
            await Promise.all(scenePromises);
          }

          // Parallelize Vignettes
          if (data.vignettes && Array.isArray(data.vignettes)) {
            await Promise.all(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data.vignettes.map(async (vignette: any) => {
                vignette.image = await restoreAsset(vignette.image);
                vignette.backgroundMusic = await restoreAsset(vignette.backgroundMusic);
              })
            );
          }

          // Parallelize Global Objects
          if (data.globalObjects) {
            await Promise.all(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              Object.values(data.globalObjects).map(async (obj: any) => {
                obj.image = await restoreAsset(obj.image);
              })
            );
          }

          handleImportGame(data);
        } catch (err) {
          alert('Erro ao importar ZIP: ' + (err as Error).message);
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
      // Single HTML Bundle import — extract editor data from invisible JSON block
      reader.onload = (ev) => {
        try {
          const htmlText = ev.target?.result as string;
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, 'text/html');
          const sourceTag = doc.getElementById('if-builder-source');
          if (!sourceTag?.textContent) {
            throw new Error(
              t('editor.htmlImportError', 'Bloco de dados IF Builder não encontrado no HTML.')
            );
          }
          const data = JSON.parse(sourceTag.textContent);
          if (!data || typeof data !== 'object') throw new Error('Arquivo inválido');
          handleImportGame(data);
        } catch (error) {
          console.error('Erro ao importar HTML:', error);
          toast(
            t('editor.importErrorTitle', 'Erro na Importação'),
            t(
              'editor.htmlImportErrorDesc',
              'O arquivo HTML não contém dados do IF Builder ou está corrompido.'
            ),
            'error'
          );
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (ev) => {
        try {
          const content = ev.target?.result as string;
          const parsed = JSON.parse(content);
          if (!parsed || typeof parsed !== 'object') throw new Error('Arquivo inválido');
          handleImportGame(parsed);
        } catch (error) {
          console.error('Erro ao importar:', error);
          toast(
            t('editor.importErrorTitle', 'Erro na Importação'),
            t(
              'editor.importErrorDesc',
              'O arquivo selecionado não é um JSON válido ou está corrompido.'
            ),
            'error'
          );
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadExample = () => {
    const lang = i18n.language;
    const filename = lang.startsWith('pt')
      ? 'fuja_da_masmorra.zip'
      : lang.startsWith('es')
      ? 'escapa_la_mazmorra.zip'
      : 'escape_the_dungeon.zip';

    const element = document.createElement('a');
    element.href = `/${filename}?v=${Date.now()}`;
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return {
    handleExport,
    handleExportHTML,
    handleImportFile,
    handleImportGame,
    handleDownloadExample,
    isImporting,
  };
};
