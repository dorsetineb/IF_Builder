


import React, { useState, useCallback, useMemo } from 'react';
// FIX: Added 'View' to the import from './types' to resolve the 'Cannot find name 'View'' error.
import { GameData, Scene, GameObject, Interaction, View } from './types';
import Sidebar from './components/Sidebar';
import SceneEditor from './components/SceneEditor';
import Header from './components/Header';
import { WelcomePlaceholder } from './components/WelcomePlaceholder';
import UIEditor from './components/UIEditor';
import GameInfoEditor from './components/GameInfoEditor';
import SceneMap from './components/SceneMap';
import Preview from './components/Preview';

const gameHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__GAME_TITLE__</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
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

        <header class="game-header">
            <div class="game-title-container">
                __LOGO_IMG_TAG__
                __HEADER_TITLE_H1_TAG__
            </div>
            <div class="header-buttons">
                <button id="restart-button" class="btn-danger">Reiniciar Aventura</button>
            </div>
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
                <div id="action-popup" class="action-popup hidden"></div>
                <div class="action-bar">
                    <div class="action-buttons">
                        <button id="suggestions-button">Sugestões</button>
                        <button id="inventory-button">Inventário</button>
                        <button id="diary-button">Diário</button>
                    </div>
                    <div class="input-area">
                        <input type="text" id="command-input" placeholder="__COMMAND_INPUT_PLACEHOLDER__">
                        <button id="submit-command">__ACTION_BUTTON_TEXT__</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Diary Modal -->
    <div id="diary-modal" class="modal-overlay hidden">
        <div class="modal-content diary-modal-content">
            <button class="modal-close-button">&times;</button>
            <h2>Diário</h2>
            <div id="diary-log" class="diary-log"></div>
        </div>
    </div>
</body>
</html>
`;

const gameCSS = `
:root {
    --bg-color: #0d1117;
    --panel-bg: #161b22;
    --border-color: #30363d;
    --text-color: #c9d1d9;
    --text-dim-color: #8b949e;
    --accent-color: #58a6ff;
    --focus-color: #58a6ff;
    --danger-color: #f85149;
    --danger-hover-bg: #da3633;
    --font-family: 'Silkscreen', sans-serif;
    --splash-button-bg: #2ea043;
    --splash-button-hover-bg: #238636;
    --splash-align-items: flex-end;
    --splash-justify-content: flex-end;
    --splash-text-align: right;
    --splash-content-align-items: flex-end;
    --highlight-color: #eab308;
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
    color: white;
    transition: all 0.2s ease-in-out;
}
#splash-start-button:hover {
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
.header-buttons button {
    font-family: var(--font-family);
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    background-color: #21262d;
    color: var(--text-color);
    cursor: pointer;
    margin-left: 10px;
    transition: background-color 0.2s;
}
.header-buttons button:hover { background-color: #30363d; }
.header-buttons button.btn-danger { background-color: #a12d2d; border-color: #c74a4a; }
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
    background-color: #010409;
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
.command-echo { color: var(--text-dim-color); font-style: italic; }
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

/* Action Bar & Popups */
.action-bar {
    border-top: 2px solid var(--border-color);
    padding-top: 20px;
    margin-top: auto;
    flex-shrink: 0;
}
.action-popup {
    margin-bottom: 20px;
    background-color: var(--panel-bg);
    border: 1px solid var(--border-color);
    padding: 15px;
}
.action-popup.hidden { display: none; }
.action-popup-list button, .action-popup-list p {
    display: inline-block;
    padding: 8px 12px;
    margin: 0 8px 8px 0;
    text-align: left;
    background-color: #21262d;
    border: 1px solid var(--border-color);
    color: var(--text-color);
    font-family: var(--font-family);
    font-size: 0.9em;
}
.action-popup-list button {
    cursor: pointer;
}
.action-popup-list button:hover {
    background-color: var(--border-color);
}
.action-popup-list p {
    cursor: default;
    color: var(--text-dim-color);
}
.action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}
.action-buttons button {
    font-family: var(--font-family);
    padding: 10px 15px;
    border: 2px solid var(--border-color);
    background-color: var(--panel-bg);
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
    font-size: 0.9em;
}
.action-buttons button:hover {
    background-color: var(--border-color);
    border-color: var(--text-dim-color);
}
.input-area { 
    display: flex;
    gap: 10px;
}
#command-input {
    flex-grow: 1;
    padding: 15px 12px;
    border: 2px solid var(--border-color);
    background-color: #010409;
    color: var(--text-color);
    font-family: var(--font-family);
    font-size: 1em;
}
#command-input:focus {
    outline: none;
    border-color: var(--focus-color);
}
#command-input:disabled {
    background-color: #21262d;
    cursor: not-allowed;
}
#submit-command {
    padding: 10px 20px;
    border: 2px solid var(--border-color);
    background-color: #ffffff;
    color: var(--bg-color);
    font-family: var(--font-family);
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
}
#submit-command:hover { background-color: #e0e0e0; }

#submit-command:disabled {
    background-color: #30363d;
    color: var(--text-dim-color);
    cursor: not-allowed;
}
#submit-command:disabled:hover {
    background-color: #30363d;
}

/* Focus styles for accessibility */
.action-buttons button:focus-visible, 
#submit-command:focus-visible,
#splash-start-button:focus-visible, 
.header-buttons button:focus-visible,
.action-popup-list button:focus-visible,
.modal-close-button:focus-visible {
    outline: 2px solid var(--focus-color);
    outline-offset: 2px;
    -moz-outline-radius: 4px; /* For Firefox */
}

/* Diary Modal */
.hidden { display: none !important; }
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    background-color: var(--panel-bg);
    padding: 30px;
    border: 2px solid var(--border-color);
    position: relative;
    max-width: 600px;
    width: 90%;
}
.modal-content h2 {
    margin-top: 0;
    font-size: 1.5em;
    color: var(--accent-color);
}
.modal-close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    color: var(--text-dim-color);
    font-size: 2em;
    cursor: pointer;
    line-height: 1;
}
.diary-modal-content {
    max-width: 80vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
}
.diary-log { flex-grow: 1; overflow-y: auto; text-align: left; }
.diary-entry {
    display: flex;
    gap: 15px;
    align-items: flex-start;
    padding: 15px;
    border-bottom: 1px solid var(--border-color);
}
.diary-entry:last-child { border-bottom: none; }
.diary-entry .image-container {
    flex: 0 0 150px;
}
.diary-entry .image-container img {
    max-width: 150px;
    width: 100%;
    border: 1px solid var(--border-color);
}
.diary-entry .text-container {
    flex: 1;
}
.diary-entry .scene-name {
    font-weight: bold;
    color: var(--accent-color);
    margin-bottom: 8px;
    display: block;
}
.diary-entry .text-container p {
    margin: 0;
    white-space: pre-wrap;
}
.diary-entry .text-container .command-echo {
    display: block;
    margin-top: 10px;
    color: var(--text-dim-color);
    font-style: italic;
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

const initialScenes: { [id: string]: Scene } = {
    "scn_cela_inicial": {
      id: "scn_cela_inicial",
      name: "Cela Inicial",
      image: "https://images.unsplash.com/photo-1593345479634-f626a2f13765?w=1080&h=1920&fit=crop&q=80",
      description: "Sua cabeça dói. Você não sabe seu nome, nem onde está.\nVocê está em uma cela pequena e escura. O chão é de pedra fria e úmida. O ar cheira a mofo e terra. Há uma porta de madeira reforçada na sua frente.",
      objects: [
        { id: "obj_chave_de_ferro", name: "chave de ferro", examineDescription: "Uma chave de ferro pesada e enferrujada. Parece antiga.", isTakable: true },
        { id: "obj_pedra_solta", name: "pedra", examineDescription: "Uma das pedras da parede parece estar solta. Talvez você consiga movê-la.", isTakable: false },
        { id: "obj_porta_da_cela", name: "porta", examineDescription: "Uma porta de madeira reforçada com ferro. Parece trancada.", isTakable: false }
      ],
      interactions: [
          {
              id: 'inter_1',
              verbs: ['mover', 'forçar', 'empurrar'],
              target: 'pedra',
              successMessage: 'Com um rangido, você move a pedra, revelando uma passagem escura.',
              removesTargetFromScene: true,
              goToScene: 'scn_corredor'
          },
          {
              id: 'inter_door_key',
              verbs: ['usar', 'abrir', 'destrancar'],
              target: 'porta',
              requiresInInventory: 'obj_chave_de_ferro',
              successMessage: 'Você usa a chave de ferro na fechadura. Com um clique alto, a porta se destranca e se abre, revelando um corredor escuro.',
              removesTargetFromScene: true,
              goToScene: 'scn_corredor'
          }
      ]
    },
    "scn_corredor": {
      id: "scn_corredor",
      name: "Corredor",
      image: "https://images.unsplash.com/photo-1615418167098-917321553c07?w=1080&h=1920&fit=crop&q=80",
      description: "Você está em um corredor escuro e úmido. O ar é pesado e cheira a mofo. A única luz vem da cela atrás de você.",
      objects: [],
      interactions: [
          {
              id: 'inter_2',
              verbs: ['ir', 'voltar', 'mover'],
              target: 'cela',
              successMessage: 'Você volta para a cela.',
              goToScene: 'scn_cela_inicial'
          }
      ]
    }
};

const generateUniqueId = (prefix: 'scn' | 'obj' | 'inter', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
    } while (existingIds.includes(id));
    return id;
};

const initializeGameData = (): GameData => {
    const sceneIdMap: { [oldId: string]: string } = {};
    const objIdMap: { [oldId: string]: string } = {};
    
    const newScenes: { [id: string]: Scene } = {};
    const existingScnIds: string[] = [];
    const existingObjIds: string[] = [];

    const initialSceneOrder = Object.keys(initialScenes);

    // First pass: generate new IDs for scenes and objects and create a map.
    initialSceneOrder.forEach(oldSceneId => {
        const newSceneId = generateUniqueId('scn', existingScnIds);
        existingScnIds.push(newSceneId);
        sceneIdMap[oldSceneId] = newSceneId;

        const scene = initialScenes[oldSceneId];
        scene.objects.forEach(obj => {
            const newObjId = generateUniqueId('obj', existingObjIds);
            existingObjIds.push(newObjId);
            objIdMap[obj.id] = newObjId;
        });
    });
    
    // Second pass: build the new scenes object using the new IDs and updating all references.
    initialSceneOrder.forEach(oldSceneId => {
        const oldScene = initialScenes[oldSceneId];
        const newSceneId = sceneIdMap[oldSceneId];

        const newObjects: GameObject[] = oldScene.objects.map(obj => ({
            ...obj,
            id: objIdMap[obj.id],
        }));

        const newInteractions: Interaction[] = oldScene.interactions.map(inter => ({
            ...inter,
            id: generateUniqueId('inter', []), // Interaction IDs are local to the scene, no need for a global check
            goToScene: inter.goToScene ? sceneIdMap[inter.goToScene] : undefined,
            requiresInInventory: inter.requiresInInventory ? objIdMap[inter.requiresInInventory] : undefined,
        }));

        newScenes[newSceneId] = {
            ...oldScene,
            id: newSceneId,
            objects: newObjects,
            interactions: newInteractions,
        };
    });

    const newSceneOrder = initialSceneOrder.map(oldId => sceneIdMap[oldId]);
    const oldStartScene = "scn_cela_inicial";
    const newStartScene = sceneIdMap[oldStartScene];
    
    return {
        startScene: newStartScene,
        scenes: newScenes,
        sceneOrder: newSceneOrder,
        defaultFailureMessage: "Isso não parece ter nenhum efeito.",
        gameHTML: gameHTML,
        gameCSS: gameCSS,
        gameTitle: "Fuja da Masmorra",
        gameLogo: "", // base64 string
        gameSplashImage: "", // base64 string
        gameSplashTextWidth: "600px",
        gameSplashTextHeight: "auto",
        gameSplashContentAlignment: 'right',
        gameSplashDescription: "Uma breve descrição da sua aventura começa aqui. O que o jogador deve saber antes de iniciar?",
        gameTextColor: "#c9d1d9",
        gameTitleColor: "#58a6ff",
        gameHideTitle: false,
        gameOmitSplashTitle: false,
        gameSplashButtonText: "INICIAR AVENTURA",
        gameSplashButtonColor: "#2ea043",
        gameSplashButtonHoverColor: "#238636",
        gameLayoutOrientation: 'vertical',
        gameLayoutOrder: 'image-first',
        gameActionButtonColor: '#ffffff',
        gameActionButtonText: 'AÇÃO',
        gameCommandInputPlaceholder: 'O QUE VOCÊ FAZ?',
        gameDiaryPlayerName: 'VOCÊ',
        gameFocusColor: '#58a6ff',
        gameEnableChances: false,
        gameMaxChances: 3,
        gameChanceIcon: 'heart',
        gameChanceIconColor: '#ff4d4d',
    };
};


const App: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>(() => initializeGameData());
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(gameData.startScene);
  const [currentView, setCurrentView] = useState<View>('scenes');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  const handleSelectSceneAndSwitchView = useCallback((id: string) => {
    setSelectedSceneId(id);
    setCurrentView('scenes');
    setIsPreviewMode(false); // Always exit preview mode when a scene is selected
  }, []);

  const handleImportGame = useCallback((dataToImport: any) => {
    // This function now handles migration from the Portuguese-keyed format
    // to the editor's internal English-keyed format.
    const importedData = { ...dataToImport }; // Create a mutable copy

    if (importedData.cenas && !importedData.scenes) {
      importedData.scenes = importedData.cenas;
      delete importedData.cenas;
    }
    if (importedData.cena_inicial && !importedData.startScene) {
        importedData.startScene = importedData.cena_inicial;
        delete importedData.cena_inicial;
    }
    if (importedData.mensagem_falha_padrao && !importedData.defaultFailureMessage) {
        importedData.defaultFailureMessage = importedData.mensagem_falha_padrao;
        delete importedData.mensagem_falha_padrao;
    }
    if (importedData.scenes) {
        Object.values(importedData.scenes).forEach((scene: any) => {
            if (scene.objetos && !scene.objects) {
                scene.objects = scene.objetos;
                delete scene.objetos;
            }
        });
    }

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
      objects: [],
      interactions: []
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
    setGameData(prev => {
      // With immutable IDs, we don't need the complex logic to handle renaming.
      // We just update the scene data for the given ID.
      const newScenes = { 
          ...prev.scenes,
          [updatedScene.id]: updatedScene 
      };
      
      return {
        ...prev,
        scenes: newScenes,
      };
    });
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
                scene.interactions = scene.interactions.filter(inter => inter.goToScene !== idToDelete);
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

  const scenesInOrder = gameData.sceneOrder.map(id => gameData.scenes[id]).filter(Boolean);
  const selectedScene = selectedSceneId ? gameData.scenes[selectedSceneId] : null;

  const allObjectIds = useMemo(() => {
    return Object.values(gameData.scenes).flatMap(s => s.objects.map(o => o.id));
  }, [gameData.scenes]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'scenes':
        return selectedScene ? (
          <SceneEditor 
            scene={selectedScene}
            allScenes={scenesInOrder}
            onUpdateScene={handleUpdateScene}
            allObjectIds={allObjectIds}
          />
        ) : <WelcomePlaceholder />;
      case 'interface':
        return <UIEditor 
                    html={gameData.gameHTML} 
                    css={gameData.gameCSS}
                    layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                    layoutOrder={gameData.gameLayoutOrder || 'image-first'}
                    actionButtonColor={gameData.gameActionButtonColor || '#ffffff'}
                    actionButtonText={gameData.gameActionButtonText || 'AÇÃO'}
                    commandInputPlaceholder={gameData.gameCommandInputPlaceholder || 'O QUE VOCÊ FAZ?'}
                    diaryPlayerName={gameData.gameDiaryPlayerName || 'VOCÊ'}
                    focusColor={gameData.gameFocusColor || '#58a6ff'}
                    onUpdate={handleUpdateGameData}
                />;
      case 'game_info':
        return <GameInfoEditor 
                    title={gameData.gameTitle || ''}
                    logo={gameData.gameLogo || ''}
                    hideTitle={!!gameData.gameHideTitle}
                    omitSplashTitle={!!gameData.gameOmitSplashTitle}
                    textColor={gameData.gameTextColor || ''}
                    titleColor={gameData.gameTitleColor || ''}
                    splashImage={gameData.gameSplashImage || ''}
                    splashTextWidth={gameData.gameSplashTextWidth || '600px'}
                    splashTextHeight={gameData.gameSplashTextHeight || 'auto'}
                    splashContentAlignment={gameData.gameSplashContentAlignment || 'right'}
                    splashDescription={gameData.gameSplashDescription || ''}
                    splashButtonText={gameData.gameSplashButtonText || ''}
                    splashButtonColor={gameData.gameSplashButtonColor || ''}
                    splashButtonHoverColor={gameData.gameSplashButtonHoverColor || ''}
                    enableChances={!!gameData.gameEnableChances}
                    maxChances={gameData.gameMaxChances || 3}
                    chanceIcon={gameData.gameChanceIcon || 'heart'}
                    chanceIconColor={gameData.gameChanceIconColor || '#ff4d4d'}
                    onUpdate={handleUpdateGameData}
                />;
      case 'scene_map':
        return <SceneMap 
                  scenes={scenesInOrder}
                  allScenesMap={gameData.scenes}
                  startSceneId={gameData.startScene}
                  onSelectScene={handleSelectSceneAndSwitchView}
                />;
      default:
        return <WelcomePlaceholder />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header 
        gameData={gameData} 
        onImportGame={handleImportGame}
        isPreviewing={isPreviewMode}
        onTogglePreview={handleTogglePreview} 
      />
      <div className="flex flex-grow min-h-0">
        {isPreviewMode ? (
          <Preview gameData={gameData} />
        ) : (
          <>
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
            />
            <main className="flex-1 p-6 overflow-y-auto">
              {renderCurrentView()}
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default App;