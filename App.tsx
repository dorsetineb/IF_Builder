

import React, { useState, useCallback, useMemo } from 'react';
import { GameData, Scene, Choice, View } from './types';
import Sidebar from './components/Sidebar';
import SceneEditor from './components/SceneEditor';
import Header from './components/Header';
import { WelcomePlaceholder } from './components/WelcomePlaceholder';
import UIEditor from './components/UIEditor';
import GameInfoEditor from './components/GameInfoEditor';
import SceneMap from './components/SceneMap';
import Preview from './components/Preview';
import ThemeEditor from './components/ThemeEditor';

const gameHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__GAME_TITLE__</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    __FONT_STYLESHEET__
    <link rel="stylesheet" href="style.css">
</head>
<body class="__THEME_CLASS__">
    <audio id="scene-sound-effect" preload="auto"></audio>
    <div class="main-wrapper">
        <div id="splash-screen" class="splash-screen" __SPLASH_BG_STYLE__>
          <div class="splash-content" __SPLASH_TEXT_STYLE__>
            <div class="splash-text">
                __SPLASH_LOGO_IMG_TAG__
                __SPLASH_TITLE_H1_TAG__
                <p>__SPLASH_DESCRIPTION__</p>
            </div>
            <button id="splash-start-button">__SPLASH_BUTTON_TEXT__</button>
          </div>
        </div>

        <div id="positive-ending-screen" class="ending-screen" __POSITIVE_ENDING_BG_STYLE__>
            <div class="ending-content">
                <div class="ending-text">
                    __POSITIVE_ENDING_LOGO_IMG_TAG__
                    __POSITIVE_ENDING_TITLE_H1_TAG__
                    <p id="positive-ending-description">__POSITIVE_ENDING_DESCRIPTION__</p>
                </div>
                <button id="positive-ending-button">__POSITIVE_ENDING_BUTTON_TEXT__</button>
            </div>
        </div>

        <div id="negative-ending-screen" class="ending-screen" __NEGATIVE_ENDING_BG_STYLE__>
            <div class="ending-content">
                <div class="ending-text">
                    __NEGATIVE_ENDING_LOGO_IMG_TAG__
                    __NEGATIVE_ENDING_TITLE_H1_TAG__
                    <p id="negative-ending-description">__NEGATIVE_ENDING_DESCRIPTION__</p>
                </div>
                <button id="negative-ending-button">__NEGATIVE_ENDING_BUTTON_TEXT__</button>
            </div>
        </div>

        <header class="game-header">
            <div class="game-title-container">
                __LOGO_IMG_TAG__
                __HEADER_TITLE_H1_TAG__
            </div>
            <div class="header-buttons">__HEADER_BUTTONS__</div>
        </header>
        <div class="game-container">
            <div class="image-panel">
                <div id="transition-overlay" class="transition-overlay"></div>
                <div id="image-container" class="image-container">
                  <img id="scene-image" src="" alt="Ilustração da cena">
                </div>
            </div>
            <div class="text-panel">
                <div id="scene-description" class="scene-description"></div>
                <div id="choices-container" class="choices-container"></div>
            </div>
        </div>
    </div>
</body>
</html>
`;

const gameCSS = `
body.dark-theme {
    --bg-color: #0d1117;
    --panel-bg: #161b22;
    --border-color: #30363d;
    --text-color: __GAME_TEXT_COLOR__;
    --text-dim-color: #8b949e;
    --accent-color: __GAME_TITLE_COLOR__;
    --focus-color: __GAME_FOCUS_COLOR__;
    --danger-color: #f85149;
    --danger-hover-bg: #da3633;
    --highlight-color: #eab308;
    --input-bg: #010409;
    --button-bg: #21262d;
    --button-hover-bg: #30363d;
}

body.light-theme {
    --bg-color: #ffffff;
    --panel-bg: #f6f8fa;
    --border-color: #d0d7de;
    --text-color: __GAME_TEXT_COLOR_LIGHT__;
    --text-dim-color: #57606a;
    --accent-color: __GAME_TITLE_COLOR_LIGHT__;
    --focus-color: __GAME_FOCUS_COLOR_LIGHT__;
    --danger-color: #cf222e;
    --danger-hover-bg: #a40e26;
    --highlight-color: #9a6700;
    --input-bg: #ffffff;
    --button-bg: #f6f8fa;
    --button-hover-bg: #e5e7eb;
}

:root {
    --font-family: __FONT_FAMILY__;
    --splash-button-bg: __SPLASH_BUTTON_COLOR__;
    --splash-button-hover-bg: __SPLASH_BUTTON_HOVER_COLOR__;
    --splash-button-text-color: __SPLASH_BUTTON_TEXT_COLOR__;
    --splash-align-items: flex-end;
    --splash-justify-content: flex-end;
    --splash-text-align: right;
    --splash-content-align-items: flex-end;
}

/* Reset and base styles */
* { box-sizing: border-box; }
body {
    font-family: var(--font-family);
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
}

.main-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 30px rgba(0,0,0,0.7);
    overflow: hidden;
    position: relative;
}


/* Splash Screen */
.splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    background-size: cover;
    background-position: center;
    z-index: 2000;
    padding: 5vw;
    display: flex;
    align-items: var(--splash-align-items);
    justify-content: var(--splash-justify-content);
}
.splash-content {
    text-align: var(--splash-text-align);
    display: flex;
    flex-direction: column;
    align-items: var(--splash-content-align-items);
    gap: 20px;
}
.splash-logo {
    max-height: 150px;
    width: auto;
    margin-bottom: 20px;
}
.splash-text h1 {
    font-size: 2.5em;
    color: var(--accent-color);
    margin: 0;
    text-shadow: none;
}
.splash-text p {
    font-size: 1.1em;
    margin-top: 10px;
    color: var(--text-color);
    max-width: 60ch;
}
#splash-start-button {
    font-family: var(--font-family);
    padding: 12px 24px;
    font-size: 1.2em;
    font-weight: bold;
    border: none;
    cursor: pointer;
    background-color: var(--splash-button-bg);
    color: var(--splash-button-text-color);
    transition: all 0.2s ease-in-out;
}
#splash-start-button:hover {
    background-color: var(--splash-button-hover-bg);
    transform: translateY(-3px);
    box-shadow: 0 3px 0px rgba(0, 0, 0, 0.4);
}

/* Ending Screens */
.ending-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    background-size: cover;
    background-position: center;
    z-index: 1900;
    padding: 5vw;
    display: none; /* Hidden by default */
    align-items: center;
    justify-content: center;
    text-align: center;
}
.ending-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background-color: rgba(0,0,0,0.6);
    padding: 40px;
    border-radius: 10px;
}
.ending-logo {
    max-height: 150px;
    width: auto;
    margin-bottom: 20px;
}
.ending-text h1 {
    font-size: 2.5em;
    color: var(--accent-color);
    margin: 0;
}
.ending-text p {
    font-size: 1.1em;
    margin-top: 10px;
    color: var(--text-color);
    max-width: 60ch;
}
.ending-content button {
    font-family: var(--font-family);
    padding: 12px 24px;
    font-size: 1.2em;
    font-weight: bold;
    border: none;
    cursor: pointer;
    background-color: var(--splash-button-bg);
    color: var(--splash-button-text-color);
    transition: all 0.2s ease-in-out;
}
.ending-content button:hover {
    background-color: var(--splash-button-hover-bg);
    transform: translateY(-3px);
    box-shadow: 0 3px 0px rgba(0, 0, 0, 0.4);
}


/* Header */
.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: var(--panel-bg);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
}
.game-title-container {
    display: flex;
    align-items: center;
    gap: 15px;
}
.game-logo {
    height: 40px;
    width: auto;
}
.game-header h1 {
    margin: 0;
    font-size: 1.5em;
    color: var(--accent-color);
    text-shadow: none;
}
.header-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
}
.header-buttons button {
    font-family: var(--font-family);
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    background-color: var(--button-bg);
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.2s;
}
.header-buttons button:hover { background-color: var(--button-hover-bg); }
.header-buttons button.btn-danger { background-color: var(--danger-color); border-color: var(--danger-color); color: white; }
.header-buttons button.btn-danger:hover { background-color: var(--danger-hover-bg); }

/* Main Layout */
.game-container {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
}
.image-panel {
    flex: 0 0 45%;
    max-width: 650px;
    border-right: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--input-bg);
    position: relative;
}
.image-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-size: cover;
    background-position: center;
}
#scene-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.text-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 30px;
    position: relative;
}
.scene-description {
    flex-grow: 1;
    overflow-y: auto;
    white-space: pre-wrap;
    line-height: 1.8;
    padding-bottom: 20px;
}
.highlight-item {
    font-weight: bold;
    color: var(--highlight-color);
}

.click-to-continue {
    font-weight: bold;
    color: var(--accent-color);
    cursor: pointer;
    margin-top: 15px;
    display: inline-block;
}
.click-to-continue:hover {
    text-decoration: underline;
}

/* Choices Container */
.choices-container {
    margin-top: auto;
    padding-top: 20px;
    border-top: 2px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 40%;
    overflow-y: auto;
}
.choice-button {
    font-family: var(--font-family);
    width: 100%;
    padding: 15px 20px;
    font-size: 1em;
    text-align: left;
    border: 2px solid var(--border-color);
    background-color: var(--button-bg);
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease;
}
.choice-button:hover, .choice-button:focus {
    background-color: var(--button-hover-bg);
    border-color: var(--focus-color);
    color: var(--accent-color);
    outline: none;
}


/* Focus styles for accessibility */
.choice-button:focus-visible, 
#splash-start-button:focus-visible, 
.header-buttons button:focus-visible {
    outline: 2px solid var(--focus-color);
    outline-offset: 2px;
    -moz-outline-radius: 4px; /* For Firefox */
}

/* Transition Overlay */
.transition-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease-in-out;
    z-index: 500;
}
.transition-overlay.active {
    opacity: 1;
    pointer-events: auto;
}
`;

const initialScenes: { [id: string]: Omit<Scene, 'id'> } = {
    "scn_cela_inicial": {
      name: "Cela Inicial",
      image: "https://images.unsplash.com/photo-1593345479634-f626a2f13765?w=1080&h=1920&fit=crop&q=80",
      description: "Sua cabeça dói. Você não sabe seu nome, nem onde está.\nVocê está em uma cela pequena e escura. O chão é de pedra fria e úmida. O ar cheira a mofo e terra. Há uma porta de madeira reforçada na sua frente e uma pedra solta na parede.",
      choices: [
        { id: 'chc_1', text: 'Tentar forçar a porta.', goToScene: 'scn_porta_trancada', costsChance: true },
        { id: 'chc_2', text: 'Examinar a pedra solta.', goToScene: 'scn_pedra_solta' },
      ],
    },
    "scn_porta_trancada": {
        name: "Porta Trancada",
        image: "https://images.unsplash.com/photo-1593345479634-f626a2f13765?w=1080&h=1920&fit=crop&q=80",
        description: "Você empurra a porta com toda a sua força, mas ela não se move. Está firmemente trancada. O som do seu esforço ecoa pela cela silenciosa.",
        choices: [
            { id: 'chc_3', text: 'Voltar.', goToScene: 'scn_cela_inicial' },
        ],
    },
    "scn_pedra_solta": {
        name: "Passagem Secreta",
        image: "https://images.unsplash.com/photo-1615418167098-917321553c07?w=1080&h=1920&fit=crop&q=80",
        description: "Você força a pedra solta e, com um rangido, ela se move, revelando uma passagem escura e úmida.",
        choices: [
            { id: 'chc_4', text: 'Entrar na passagem.', goToScene: 'scn_corredor' },
            { id: 'chc_5', text: 'Empurrar a pedra de volta para o lugar.', goToScene: 'scn_cela_inicial' },
        ],
    },
    "scn_corredor": {
      name: "Corredor",
      image: "https://images.unsplash.com/photo-1615418167098-917321553c07?w=1080&h=1920&fit=crop&q=80",
      description: "Você está em um corredor escuro e úmido. O ar é pesado e cheira a mofo. A única luz vem da cela atrás de você. Você alcançou o final do jogo!",
      isEndingScene: true,
      choices: []
    }
};

const generateUniqueId = (prefix: 'scn' | 'chc', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`;
    } while (existingIds.includes(id));
    return id;
};

const initializeGameData = (): GameData => {
    const sceneIdMap: { [oldId: string]: string } = {};
    const newScenes: { [id: string]: Scene } = {};
    const existingScnIds: string[] = [];
    const initialSceneOrder = Object.keys(initialScenes);

    // First pass: generate new IDs for scenes and create a map.
    initialSceneOrder.forEach(oldSceneId => {
        const newSceneId = generateUniqueId('scn', existingScnIds);
        existingScnIds.push(newSceneId);
        sceneIdMap[oldSceneId] = newSceneId;
    });
    
    // Second pass: build the new scenes object using the new IDs and updating all references.
    initialSceneOrder.forEach(oldSceneId => {
        const oldScene = initialScenes[oldSceneId];
        const newSceneId = sceneIdMap[oldSceneId];

        const newChoices: Choice[] = oldScene.choices.map(choice => ({
            ...choice,
            id: generateUniqueId('chc', []), // Choice IDs are local to the scene
            goToScene: choice.goToScene ? sceneIdMap[choice.goToScene] : '',
        }));

        newScenes[newSceneId] = {
            ...(oldScene as Scene),
            id: newSceneId,
            choices: newChoices,
        };
    });

    const newSceneOrder = initialSceneOrder.map(oldId => sceneIdMap[oldId]);
    const oldStartScene = "scn_cela_inicial";
    const newStartScene = sceneIdMap[oldStartScene];
    
    return {
        startScene: newStartScene,
        scenes: newScenes,
        sceneOrder: newSceneOrder,
        gameHTML: gameHTML,
        gameCSS: gameCSS,
        gameTitle: "Fuja da Masmorra",
        gameFontFamily: "'Silkscreen', sans-serif",
        gameLogo: "", // base64 string
        gameSplashImage: "", // base64 string
        gameSplashContentAlignment: 'right',
        gameSplashDescription: "Uma breve descrição da sua aventura começa aqui. O que o jogador deve saber antes de iniciar?",
        gameTextColor: "#c9d1d9",
        gameTitleColor: "#58a6ff",
        gameHideTitle: false,
        gameOmitSplashTitle: false,
        gameSplashButtonText: "INICIAR AVENTURA",
        gameSplashButtonColor: "#2ea043",
        gameSplashButtonHoverColor: "#238636",
        gameSplashButtonTextColor: "#ffffff",
        gameLayoutOrientation: 'vertical',
        gameLayoutOrder: 'image-first',
        gameFocusColor: '#58a6ff',
        gameEnableChances: true,
        gameMaxChances: 3,
        gameChanceIcon: 'heart',
        gameChanceIconColor: '#ff4d4d',
        gameTheme: 'dark',
        gameTextColorLight: '#24292f',
        gameTitleColorLight: '#0969da',
        gameFocusColorLight: '#0969da',
        gameChanceLossMessage: "Você perdeu uma chance. Restam {chances} chance(s).",
        gameChanceReturnButtonText: "Tentar Novamente",
        gamePositiveEndingImage: "",
        gamePositiveEndingOmitTitle: false,
        gamePositiveEndingDescription: "Parabéns! Você concluiu a aventura com sucesso.",
        gamePositiveEndingButtonText: "Jogar Novamente",
        gameNegativeEndingImage: "",
        gameNegativeEndingOmitTitle: false,
        gameNegativeEndingDescription: "Você não tem mais chances. Fim de jogo.",
        gameNegativeEndingButtonText: "Tentar Novamente",
    };
};


const App: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>(() => initializeGameData());
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(gameData.startScene);
  const [currentView, setCurrentView] = useState<View>('scenes');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [gameDataForPreview, setGameDataForPreview] = useState<GameData | null>(null);
  const [dirtySceneIds, setDirtySceneIds] = useState(new Set<string>());

  const handleDirtyStateChange = useCallback((sceneId: string, isDirty: boolean) => {
    setDirtySceneIds(prev => {
        const newSet = new Set(prev);
        if (isDirty) {
            newSet.add(sceneId);
        } else {
            newSet.delete(sceneId);
        }
        return newSet;
    });
  }, []);

  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode(prev => {
        const isOpening = !prev;
        if (isOpening) {
            setGameDataForPreview(null);
        }
        return isOpening;
    });
  }, []);
  
  const handlePreviewSingleScene = useCallback((sceneWithUnsavedChanges: Scene) => {
    const tempGameData = JSON.parse(JSON.stringify(gameData));
    tempGameData.scenes[sceneWithUnsavedChanges.id] = sceneWithUnsavedChanges;
    tempGameData.startScene = sceneWithUnsavedChanges.id;
    
    setGameDataForPreview(tempGameData);
    setIsPreviewMode(true);
  }, [gameData]);

  const handleSelectSceneAndSwitchView = useCallback((id: string) => {
    setSelectedSceneId(id);
    setCurrentView('scenes');
    setIsPreviewMode(false);
  }, []);

  const handleImportGame = useCallback((dataToImport: any) => {
    const importedData = { ...dataToImport };

    // Migration logic for old formats can be added here if needed
    // For now, assuming new format
    setGameData(prev => ({...prev, ...importedData}));
    setSelectedSceneId(importedData.startScene || Object.keys(importedData.scenes)[0]);
    setCurrentView('scenes');
    setIsPreviewMode(false);
  }, []);

  const handleAddScene = useCallback(() => {
    const newSceneId = generateUniqueId('scn', Object.keys(gameData.scenes));

    const newScene: Scene = {
      id: newSceneId,
      name: "Nova Cena",
      description: "Descreva esta nova cena...",
      image: `https://picsum.photos/seed/${newSceneId}/1080/1920`,
      choices: []
    };
    setGameData(prev => ({
      ...prev,
      scenes: { ...prev.scenes, [newSceneId]: newScene },
      sceneOrder: [...prev.sceneOrder, newSceneId],
    }));
    setSelectedSceneId(newSceneId);
    setCurrentView('scenes');
  }, [gameData.scenes]);

  const handleUpdateScene = useCallback((updatedScene: Scene) => {
    setGameData(prev => ({
      ...prev,
      scenes: { ...prev.scenes, [updatedScene.id]: updatedScene },
    }));
  }, []);

  const handleDeleteScene = useCallback((idToDelete: string) => {
    if (Object.keys(gameData.scenes).length <= 1) {
        alert("Você não pode deletar a última cena.");
        return;
    }
    if (gameData.startScene === idToDelete) {
        alert("Você não pode deletar a cena inicial.");
        return;
    }
    if (confirm(`Tem certeza que quer deletar a cena "${gameData.scenes[idToDelete].name}"?`)) {
        setGameData(prev => {
            const newScenes = { ...prev.scenes };
            delete newScenes[idToDelete];

            // Remove links to the deleted scene
            Object.values(newScenes).forEach(scene => {
                scene.choices = scene.choices.filter(choice => choice.goToScene !== idToDelete);
            });

            const newSceneOrder = prev.sceneOrder.filter(id => id !== idToDelete);
            
            return {
                ...prev,
                scenes: newScenes,
                sceneOrder: newSceneOrder,
            };
        });
        if (selectedSceneId === idToDelete) {
            setSelectedSceneId(gameData.sceneOrder.filter(id => id !== idToDelete)[0] || null);
        }
    }
  }, [gameData.scenes, gameData.startScene, gameData.sceneOrder, selectedSceneId]);
  
  const handleSetStartScene = useCallback((id: string) => {
      setGameData(prev => ({ ...prev, startScene: id }));
  }, []);

  const handleReorderScenes = useCallback((newOrder: string[]) => {
      setGameData(prev => ({ ...prev, sceneOrder: newOrder }));
  }, []);
  
  const handleUpdateGameData = useCallback((field: keyof GameData, value: any) => {
    setGameData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUpdateScenePosition = useCallback((sceneId: string, x: number, y: number) => {
    setGameData(prev => {
      const newScenes = { ...prev.scenes };
      if (newScenes[sceneId]) {
        newScenes[sceneId] = {
          ...newScenes[sceneId],
          mapX: x,
          mapY: y,
        };
      }
      return {
        ...prev,
        scenes: newScenes,
      };
    });
  }, []);

  const scenesInOrder = useMemo(() => gameData.sceneOrder.map(id => gameData.scenes[id]).filter(Boolean), [gameData.sceneOrder, gameData.scenes]);
  const selectedScene = selectedSceneId ? gameData.scenes[selectedSceneId] : null;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'scenes':
        return selectedScene ? (
          <SceneEditor
            scene={selectedScene}
            allScenes={scenesInOrder}
            onUpdateScene={handleUpdateScene}
            onPreviewScene={handlePreviewSingleScene}
            sceneOrder={gameData.sceneOrder}
            onSelectScene={handleSelectSceneAndSwitchView}
            onDirtyStateChange={handleDirtyStateChange}
            layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
          />
        ) : (
          <WelcomePlaceholder />
        );
      case 'interface':
        return (
          <UIEditor
            html={gameData.gameHTML}
            css={gameData.gameCSS}
            layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
            layoutOrder={gameData.gameLayoutOrder || 'image-first'}
            onUpdate={handleUpdateGameData}
          />
        );
      case 'game_info':
        return (
          <GameInfoEditor
            title={gameData.gameTitle || 'Fuja da Masmorra'}
            logo={gameData.gameLogo || ''}
            hideTitle={gameData.gameHideTitle || false}
            omitSplashTitle={gameData.gameOmitSplashTitle || false}
            splashImage={gameData.gameSplashImage || ''}
            splashContentAlignment={gameData.gameSplashContentAlignment || 'right'}
            splashDescription={gameData.gameSplashDescription || ''}
            splashButtonText={gameData.gameSplashButtonText || 'INICIAR AVENTURA'}
            enableChances={gameData.gameEnableChances || false}
            positiveEndingImage={gameData.gamePositiveEndingImage || ''}
            positiveEndingOmitTitle={gameData.gamePositiveEndingOmitTitle || false}
            positiveEndingDescription={gameData.gamePositiveEndingDescription || ''}
            positiveEndingButtonText={gameData.gamePositiveEndingButtonText || ''}
            negativeEndingImage={gameData.gameNegativeEndingImage || ''}
            negativeEndingOmitTitle={gameData.gameNegativeEndingOmitTitle || false}
            negativeEndingDescription={gameData.gameNegativeEndingDescription || ''}
            negativeEndingButtonText={gameData.gameNegativeEndingButtonText || ''}
            onUpdate={handleUpdateGameData}
          />
        );
      case 'theme':
        return (
          <ThemeEditor
            textColor={gameData.gameTextColor || '#c9d1d9'}
            titleColor={gameData.gameTitleColor || '#58a6ff'}
            splashButtonColor={gameData.gameSplashButtonColor || '#2ea043'}
            splashButtonHoverColor={gameData.gameSplashButtonHoverColor || '#238636'}
            splashButtonTextColor={gameData.gameSplashButtonTextColor || '#ffffff'}
            focusColor={gameData.gameFocusColor || '#58a6ff'}
            chanceIconColor={gameData.gameChanceIconColor || '#ff4d4d'}
            gameFontFamily={gameData.gameFontFamily || "'Silkscreen', sans-serif"}
            enableChances={gameData.gameEnableChances || false}
            maxChances={gameData.gameMaxChances || 3}
            chanceIcon={gameData.gameChanceIcon || 'heart'}
            gameTheme={gameData.gameTheme || 'dark'}
            textColorLight={gameData.gameTextColorLight || '#24292f'}
            titleColorLight={gameData.gameTitleColorLight || '#0969da'}
            focusColorLight={gameData.gameFocusColorLight || '#0969da'}
            gameChanceLossMessage={gameData.gameChanceLossMessage || "Você perdeu uma chance. Restam {chances} chance(s)."}
            gameChanceReturnButtonText={gameData.gameChanceReturnButtonText || "Tentar Novamente"}
            onUpdate={handleUpdateGameData}
          />
        );
      case 'scene_map':
        return (
          <SceneMap
            allScenesMap={gameData.scenes}
            startSceneId={gameData.startScene}
            onSelectScene={handleSelectSceneAndSwitchView}
            onUpdateScenePosition={handleUpdateScenePosition}
            onAddScene={handleAddScene}
          />
        );
      default:
        return <WelcomePlaceholder />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-brand-text font-sans">
      <Header
        gameData={gameData}
        onImportGame={handleImportGame}
        isPreviewing={isPreviewMode}
        onTogglePreview={handleTogglePreview}
      />
      {isPreviewMode ? (
        <Preview gameData={gameDataForPreview || gameData} />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            scenes={scenesInOrder}
            startSceneId={gameData.startScene}
            selectedSceneId={selectedSceneId}
            currentView={currentView}
            onSelectScene={handleSelectSceneAndSwitchView}
            onAddScene={handleAddScene}
            onDeleteScene={handleDeleteScene}
            onSetStartScene={handleSetStartScene}
            onReorderScenes={handleReorderScenes}
            onSetView={setCurrentView}
            dirtySceneIds={dirtySceneIds}
          />
          <main className="flex-1 p-6 overflow-y-auto">
            {renderCurrentView()}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;