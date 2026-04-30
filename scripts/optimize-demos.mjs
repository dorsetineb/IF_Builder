/**
 * optimize-demos.mjs
 *
 * Optimizes the existing demo games in public/:
 *   1. Extracts Base64 assets from editor_data.json to separate files
 *   2. Rebuilds game.js with: (a) clean embeddedGameData from the fixed JSON,
 *      and (b) minified engine code
 *
 * Run: node scripts/optimize-demos.mjs
 */

/* eslint-env node */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { transform } from 'esbuild';
import { Buffer } from 'buffer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DEMOS = [
  'escape_the_dungeon',
  'fuja_da_masmorra',
  'escapa_la_mazmorra',
];

// ─── STEP 1: Extract & minify the game engine ────────────────────────────────

async function getMinifiedEngine() {
  const engineFile = readFileSync(join(ROOT, 'src/components/game-engine.ts'), 'utf-8');

  const MARKER = 'export const gameJS = `';
  const startIndex = engineFile.indexOf(MARKER);
  if (startIndex === -1) throw new Error('Could not find gameJS export in game-engine.ts');

  const contentStart = startIndex + MARKER.length;
  const contentEnd = engineFile.lastIndexOf('`;\n') !== -1
    ? engineFile.lastIndexOf('`;\n')
    : engineFile.lastIndexOf('`;');

  if (contentEnd <= contentStart) throw new Error('Could not find end of gameJS template string');

  const engineCode = engineFile.substring(contentStart, contentEnd);
  console.log(`📦 Original engine: ${(engineCode.length / 1024).toFixed(1)} KB`);

  const result = await transform(engineCode, {
    minify: true,
    loader: 'js',
    target: 'es2019',
    drop: ['console', 'debugger'],
  });

  const minified = result.code.trim();
  console.log(`✅ Minified engine: ${(minified.length / 1024).toFixed(1)} KB`);
  console.log(`   Reduction: ${((1 - minified.length / engineCode.length) * 100).toFixed(1)}%\n`);
  return minified;
}

// ─── STEP 2: Fix editor_data.json (extract Base64 to files) ──────────────────

function extractBase64Asset(value, baseName, assetsDir) {
  if (!value || typeof value !== 'string' || !value.startsWith('data:')) return value;

  const commaIndex = value.indexOf(',');
  if (commaIndex === -1) return value;

  const header = value.substring(0, commaIndex);
  const data = value.substring(commaIndex + 1);

  const mimeMatch = header.match(/data:([^;]+)/);
  if (!mimeMatch) return value;

  const mimeType = mimeMatch[1];
  const extension = mimeType.split('/')[1]?.split('+')[0] || 'bin';
  const filename = `${baseName}.${extension}`;
  const fullPath = join(assetsDir, filename);

  if (!existsSync(fullPath)) {
    writeFileSync(fullPath, Buffer.from(data, 'base64'));
    console.log(`    Extracted: assets/${filename} (${(data.length * 0.75 / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.log(`    Exists: assets/${filename} (skipped)`);
  }

  return `assets/${filename}`;
}

/**
 * Processes the editor_data.json — extracts base64 assets to separate files.
 * Returns the cleaned data object.
 */
function fixEditorData(demo) {
  const jsonPath = join(ROOT, 'public', demo, 'editor_data.json');
  if (!existsSync(jsonPath)) {
    console.warn(`  ⚠️  editor_data.json not found for ${demo}, skipping.`);
    return null;
  }

  const raw = readFileSync(jsonPath, 'utf-8');
  const beforeKB = (raw.length / 1024).toFixed(1);
  const data = JSON.parse(raw);
  const assetsDir = join(ROOT, 'public', demo, 'assets');

  const topLevelAssets = [
    ['gameLogo', 'logo'],
    ['gameSplashImage', 'splash_image'],
    ['gameBackgroundMusic', 'project_bgm'],
    ['positiveEndingImage', 'positive_ending'],
    ['positiveEndingMusic', 'positive_ending_bgm'],
    ['negativeEndingImage', 'negative_ending'],
    ['negativeEndingMusic', 'negative_ending_bgm'],
  ];

  for (const [key, name] of topLevelAssets) {
    if (data[key]?.startsWith?.('data:')) {
      data[key] = extractBase64Asset(data[key], name, assetsDir);
    }
  }

  for (const sceneId in data.scenes) {
    const scene = data.scenes[sceneId];
    if (scene.image?.startsWith?.('data:'))
      scene.image = extractBase64Asset(scene.image, `scene_image_${sceneId}`, assetsDir);
    if (scene.backgroundMusic?.startsWith?.('data:'))
      scene.backgroundMusic = extractBase64Asset(scene.backgroundMusic, `scene_bgm_${sceneId}`, assetsDir);
    if (scene.interactions) {
      scene.interactions.forEach((inter, idx) => {
        if (inter.soundEffect?.startsWith?.('data:'))
          inter.soundEffect = extractBase64Asset(inter.soundEffect, `sfx_${sceneId}_${idx}`, assetsDir);
      });
    }
  }

  const newJson = JSON.stringify(data);
  writeFileSync(jsonPath, newJson, 'utf-8');
  const afterKB = (newJson.length / 1024).toFixed(1);
  console.log(`  editor_data.json: ${beforeKB} KB → ${afterKB} KB`);

  return data;
}

// ─── STEP 3: Rebuild game.js from clean editor_data ──────────────────────────

/**
 * Minimal reimplementation of prepareGameDataForEngine() from game-engine.ts
 * Only includes fields that the engine actually reads at runtime.
 */
function prepareEngineData(data) {
  const cenas = {};
  for (const sceneId in data.scenes) {
    const s = data.scenes[sceneId];
    let finalVignetteButtonText = s.vignetteButtonText;
    if (s.vignetteType === 'opening' && ['COMEÇAR', 'START', 'INICIAR'].includes(finalVignetteButtonText || ''))
      finalVignetteButtonText = data.gameSplashButtonText || finalVignetteButtonText;
    else if ((s.vignetteType === 'conclusion' || s.isDefeatOutcome) && ['REINICIAR', 'RESTART'].includes(finalVignetteButtonText || ''))
      finalVignetteButtonText = data.gameRestartButtonText || finalVignetteButtonText;
    else if (s.vignetteType === 'transition' && ['CONTINUAR', 'CONTINUE'].includes(finalVignetteButtonText || ''))
      finalVignetteButtonText = data.gameContinueButtonText || finalVignetteButtonText;

    cenas[sceneId] = {
      id: s.id, name: s.name, image: s.image, description: s.description,
      backgroundMusic: s.backgroundMusic, interactions: s.interactions,
      exits: s.exits, isEndingScene: s.isEndingScene,
      removesChanceOnEntry: s.removesChanceOnEntry,
      restoresChanceOnEntry: s.restoresChanceOnEntry,
      objectIds: s.objectIds || [], choices: s.choices || [],
      vignetteType: s.vignetteType, vignetteButtonText: finalVignetteButtonText,
      vignetteNextSceneId: s.vignetteNextSceneId, overlayEffect: s.overlayEffect,
      isDefeatOutcome: s.isDefeatOutcome, omitSplashTitle: s.omitSplashTitle,
      omitSplashDescription: s.omitSplashDescription,
      suggestions: s.suggestions || [], negativeFeedback: s.negativeFeedback,
      creditsText: s.creditsText, creditsScrollEnabled: s.creditsScrollEnabled,
    };
  }

  return {
    gameTitle: data.gameTitle,
    cena_inicial: data.startScene,
    cenas,
    globalObjects: data.globalObjects,
    mensagem_falha_padrao: data.defaultFailureMessage,
    nome_jogador_diario: data.gameDiaryPlayerName,
    gameSystemEnabled: data.gameSystemEnabled,
    gameMaxChances: data.gameMaxChances,
    gameChanceIcon: data.gameChanceIcon,
    gameChanceIconColor: data.gameChanceIconColor,
    gameChanceReturnButtonText: data.gameChanceReturnButtonText,
    gameTextColor: data.gameTextColor,
    gameTitleColor: data.gameTitleColor,
    gameFocusColor: data.gameFocusColor,
    gameTextReadingFlow: data.gameTextReadingFlow,
    gameBackgroundMusic: data.gameBackgroundMusic,
    positiveEndingImage: data.positiveEndingImage,
    positiveEndingContentAlignment: data.positiveEndingContentAlignment,
    positiveEndingDescription: data.positiveEndingDescription,
    positiveEndingMusic: data.positiveEndingMusic,
    negativeEndingImage: data.negativeEndingImage,
    negativeEndingContentAlignment: data.negativeEndingContentAlignment,
    negativeEndingDescription: data.negativeEndingDescription,
    negativeEndingMusic: data.negativeEndingMusic,
    gameRestartButtonText: data.gameRestartButtonText,
    gameContinueButtonText: data.gameContinueButtonText,
    gameSystemButtonText: data.gameSystemButtonText,
    gameSaveMenuTitle: data.gameSaveMenuTitle,
    gameLoadMenuTitle: data.gameLoadMenuTitle,
    gameMainMenuButtonText: data.gameMainMenuButtonText,
    gameViewEndingButtonText: data.gameViewEndingButtonText,
    fixedVerbs: data.fixedVerbs || [],
    consequenceTrackers: data.consequenceTrackers || [],
    gameShowTrackersUI: data.gameShowTrackersUI,
    gameShowSystemButton: data.gameShowSystemButton,
    gameTextAnimationType: data.gameTextAnimationType,
    gameTextSpeed: data.gameTextSpeed,
    gameImageTransitionType: data.gameImageTransitionType,
    gameImageSpeed: data.gameImageSpeed,
    enableInventory: data.enableInventory ?? true,
    enableSuggestions: data.enableSuggestions ?? true,
    enableChances: typeof data.enableChances === 'boolean'
      ? data.enableChances
      : (data.gameSystemEnabled === 'chances' || Object.values(data.scenes || {}).some(s => s.removesChanceOnEntry || s.restoresChanceOnEntry)),
    enableTrackers: typeof data.enableTrackers === 'boolean'
      ? data.enableTrackers : (data.gameSystemEnabled === 'trackers'),
    enableDiary: data.enableDiary ?? true,
    enableFixedVerbs: data.enableFixedVerbs,
    enableImages: data.enableImages ?? true,
    enableTextControl: data.enableTextControl ?? true,
    enableRetrospective: data.enableRetrospective ?? true,
    gameInteractionType: data.gameInteractionType || 'parser',
    gameSuggestionsEmptyFeedback: data.gameSuggestionsEmptyFeedback,
    gameInventoryEmptyFeedback: data.gameInventoryEmptyFeedback,
    gameTranslations: data.gameTranslations || {
      view_diary_btn: "Ver Diário",
      stats_visited: "Você visitou",
      stats_time: "Tempo decorrido",
      of_scenes: "cenas",
    },
  };
}

function rebuildGameJs(demo, minifiedEngine, cleanData) {
  const filePath = join(ROOT, 'public', demo, 'game.js');
  const engineData = prepareEngineData(cleanData);
  const safeJson = JSON.stringify(engineData).replace(/<\/script/g, '<\\/script>');
  const newContent = `window.embeddedGameData = ${safeJson};\n\n${minifiedEngine}\n`;

  writeFileSync(filePath, newContent, 'utf-8');
  console.log(`  game.js rebuilt: ${(newContent.length / 1024).toFixed(1)} KB`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 IF Builder — Demo Optimizer\n');

  const minifiedEngine = await getMinifiedEngine();

  for (const demo of DEMOS) {
    console.log(`📁 ${demo}/`);
    const cleanData = fixEditorData(demo);
    if (cleanData) {
      rebuildGameJs(demo, minifiedEngine, cleanData);
    }
    console.log('');
  }

  console.log('✅ Done!');
  console.log('   • Demos in public/ are now optimized.');
  console.log('   • Run `npm run build` to bake minification into future user exports.');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
