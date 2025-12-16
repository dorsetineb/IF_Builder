
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SceneEditor from './components/SceneEditor';
import { UIEditor } from './components/UIEditor';
import SceneMap from './components/SceneMap';
import GlobalObjectsEditor from './components/GlobalObjectsEditor';
import TrackersEditor from './components/TrackersEditor';
import Preview from './components/Preview';
import { WelcomePlaceholder } from './components/WelcomePlaceholder';
import { GameData, Scene, GameObject, View, ConsequenceTracker, FixedVerb } from './types';

const INITIAL_SCENE: Scene = {
    id: 'scene_start',
    name: 'Cena Inicial',
    description: 'O jogo começa aqui.',
    image: '',
    objectIds: [],
    interactions: []
};

const INITIAL_GAME_DATA: GameData = {
    startScene: 'scene_start',
    scenes: {
        'scene_start': INITIAL_SCENE
    },
    globalObjects: {},
    defaultFailureMessage: 'Isso não funciona.',
    sceneOrder: ['scene_start'],
    gameHTML: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>__GAME_TITLE__</title>\n    __FONT_STYLESHEET__\n    <style>\n        /* Reset & Base */\n        * { box-sizing: border-box; }\n        body { margin: 0; padding: 0; height: 100vh; overflow: hidden; }\n    </style>\n</head>\n<body class="__THEME_CLASS__ __LAYOUT_ORIENTATION_CLASS__ __LAYOUT_ORDER_CLASS__">\n    <div id="game-root">\n        <!-- Game content injected by engine -->\n        <div id="main-container" class="__FRAME_CLASS__">\n             <div id="scene-image-container">__SPLASH_LOGO_IMG_TAG__</div>\n             <div id="scene-content">\n                 <div id="text-area"></div>\n                 <div id="actions-area"></div>\n             </div>\n        </div>\n        __CHANCES_CONTAINER__\n        __TRACKERS_BUTTON__\n    </div>\n</body>\n</html>',
    gameCSS: '/* CSS Base */\nbody {\n    font-family: __FONT_FAMILY__;\n    color: __GAME_TEXT_COLOR__;\n    background-color: #000;\n}\n/* Add your custom styles here */',
    gameTitle: 'Meu Jogo de Aventura',
    gameTheme: 'dark',
    gameSystemEnabled: 'none',
    gameMaxChances: 3,
    fixedVerbs: []
};

export default function App() {
    const [gameData, setGameData] = useState<GameData>(INITIAL_GAME_DATA);
    const [currentView, setCurrentView] = useState<View>('scenes');
    const [selectedSceneId, setSelectedSceneId] = useState<string | null>('scene_start');
    const [isDirty, setIsDirty] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);

    // Ensure start scene exists
    useEffect(() => {
        if (!gameData.scenes[gameData.startScene]) {
            // Recovery if start scene is missing
            const startId = Object.keys(gameData.scenes)[0];
            if (startId) {
                setGameData(prev => ({ ...prev, startScene: startId }));
            }
        }
    }, [gameData.scenes, gameData.startScene]);

    const handleUpdateGameData = useCallback((field: keyof GameData, value: any) => {
        setGameData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    }, []);

    const handleImportGame = (data: GameData) => {
        setGameData(data);
        setSelectedSceneId(data.startScene);
        setIsDirty(false);
    };

    const handleNewGame = () => {
        if (confirm('Tem certeza? Todo o progresso não salvo será perdido.')) {
            setGameData(INITIAL_GAME_DATA);
            setSelectedSceneId('scene_start');
            setIsDirty(false);
            setCurrentView('scenes');
        }
    };

    const handleSetView = (view: View) => {
        setCurrentView(view);
    };

    const getSceneList = () => {
        if (!gameData.sceneOrder || gameData.sceneOrder.length !== Object.keys(gameData.scenes).length) {
            return Object.values(gameData.scenes);
        }
        return gameData.sceneOrder.map(id => gameData.scenes[id]).filter(Boolean);
    };

    // Scene Management
    const handleSelectScene = (id: string) => {
        setSelectedSceneId(id);
        setCurrentView('scenes');
    };

    const handleAddScene = () => {
        const newId = `scene_${Math.random().toString(36).substr(2, 9)}`;
        const newScene: Scene = {
            id: newId,
            name: 'Nova Cena',
            description: '',
            image: '',
            objectIds: [],
            interactions: []
        };
        setGameData(prev => ({
            ...prev,
            scenes: { ...prev.scenes, [newId]: newScene },
            sceneOrder: [...prev.sceneOrder, newId]
        }));
        setSelectedSceneId(newId);
        setIsDirty(true);
    };

    const handleDeleteScene = (id: string) => {
        if (id === gameData.startScene) {
            alert('Não é possível deletar a cena inicial.');
            return;
        }
        if (confirm('Tem certeza que deseja excluir esta cena?')) {
            setGameData(prev => {
                const newScenes = { ...prev.scenes };
                delete newScenes[id];
                return {
                    ...prev,
                    scenes: newScenes,
                    sceneOrder: prev.sceneOrder.filter(sid => sid !== id)
                };
            });
            if (selectedSceneId === id) setSelectedSceneId(gameData.startScene);
            setIsDirty(true);
        }
    };

    const handleReorderScenes = (newOrder: string[]) => {
        setGameData(prev => ({ ...prev, sceneOrder: newOrder }));
        setIsDirty(true);
    };

    const handleUpdateScene = (updatedScene: Scene) => {
        setGameData(prev => ({
            ...prev,
            scenes: { ...prev.scenes, [updatedScene.id]: updatedScene }
        }));
        setIsDirty(true);
    };

    // Global Object Management Wrappers for SceneEditor
    const handleCreateGlobalObject = (obj: GameObject, linkToSceneId: string) => {
        setGameData(prev => {
            const newGlobalObjects = { ...prev.globalObjects, [obj.id]: obj };
            const scene = prev.scenes[linkToSceneId];
            const updatedScene = { ...scene, objectIds: [...(scene.objectIds || []), obj.id] };
            return {
                ...prev,
                globalObjects: newGlobalObjects,
                scenes: { ...prev.scenes, [linkToSceneId]: updatedScene }
            };
        });
        setIsDirty(true);
    };

    const handleLinkObjectToScene = (sceneId: string, objectId: string) => {
        setGameData(prev => {
            const scene = prev.scenes[sceneId];
            if (scene.objectIds.includes(objectId)) return prev;
            return {
                ...prev,
                scenes: {
                    ...prev.scenes,
                    [sceneId]: { ...scene, objectIds: [...scene.objectIds, objectId] }
                }
            };
        });
        setIsDirty(true);
    };

    const handleUnlinkObjectFromScene = (sceneId: string, objectId: string) => {
        setGameData(prev => {
            const scene = prev.scenes[sceneId];
            return {
                ...prev,
                scenes: {
                    ...prev.scenes,
                    [sceneId]: { ...scene, objectIds: scene.objectIds.filter(id => id !== objectId) }
                }
            };
        });
        setIsDirty(true);
    };

    const handleUpdateGlobalObject = (objectId: string, updatedData: Partial<GameObject>) => {
        setGameData(prev => ({
            ...prev,
            globalObjects: {
                ...prev.globalObjects,
                [objectId]: { ...prev.globalObjects[objectId], ...updatedData }
            }
        }));
        setIsDirty(true);
    };

    const handleDeleteGlobalObject = (objectId: string) => {
        if(confirm("Tem certeza que deseja excluir este objeto? Ele será removido de todas as cenas.")) {
             setGameData(prev => {
                const newGlobalObjects = { ...prev.globalObjects };
                delete newGlobalObjects[objectId];
                
                const newScenes = { ...prev.scenes };
                Object.keys(newScenes).forEach(sceneId => {
                    const scene = newScenes[sceneId];
                    if (scene.objectIds.includes(objectId)) {
                        newScenes[sceneId] = {
                            ...scene,
                            objectIds: scene.objectIds.filter(id => id !== objectId)
                        };
                    }
                });
                
                return {
                    ...prev,
                    globalObjects: newGlobalObjects,
                    scenes: newScenes
                };
            });
            setIsDirty(true);
        }
    };

    const handleCreateObjectOnly = (obj: GameObject) => {
        setGameData(prev => ({
            ...prev,
            globalObjects: { ...prev.globalObjects, [obj.id]: obj }
        }));
        setIsDirty(true);
    };

    // Scene Map Position Update
    const handleUpdateScenePosition = (sceneId: string, x: number, y: number) => {
        setGameData(prev => ({
            ...prev,
            scenes: {
                ...prev.scenes,
                [sceneId]: { ...prev.scenes[sceneId], mapX: x, mapY: y }
            }
        }));
        setIsDirty(true);
    };

    // Trackers
    const handleUpdateTrackers = (trackers: ConsequenceTracker[]) => {
        setGameData(prev => ({ ...prev, consequenceTrackers: trackers }));
        setIsDirty(true);
    };

    const renderContent = () => {
        if (isPreviewing) {
            return <Preview gameData={gameData} />;
        }

        switch (currentView) {
            case 'scenes':
                return selectedSceneId && gameData.scenes[selectedSceneId] ? (
                    <SceneEditor
                        scene={gameData.scenes[selectedSceneId]}
                        allScenes={Object.values(gameData.scenes)}
                        globalObjects={gameData.globalObjects}
                        onUpdateScene={handleUpdateScene}
                        onCopyScene={(scene) => {
                            const newId = `scene_${Math.random().toString(36).substr(2, 9)}`;
                            const newScene = { ...scene, id: newId, name: `${scene.name} (Cópia)` };
                            setGameData(prev => ({
                                ...prev,
                                scenes: { ...prev.scenes, [newId]: newScene },
                                sceneOrder: [...prev.sceneOrder, newId]
                            }));
                            setSelectedSceneId(newId);
                            setIsDirty(true);
                        }}
                        onCreateGlobalObject={handleCreateGlobalObject}
                        onLinkObjectToScene={handleLinkObjectToScene}
                        onUnlinkObjectFromScene={handleUnlinkObjectFromScene}
                        onUpdateGlobalObject={handleUpdateGlobalObject}
                        onPreviewScene={() => setIsPreviewing(true)}
                        onSelectScene={handleSelectScene}
                        isDirty={isDirty}
                        onSetDirty={setIsDirty}
                        layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                        consequenceTrackers={gameData.consequenceTrackers || []}
                    />
                ) : <WelcomePlaceholder />;
            
            case 'interface':
                return (
                    <UIEditor
                        {...gameData}
                        html={gameData.gameHTML}
                        css={gameData.gameCSS}
                        onUpdate={handleUpdateGameData}
                        isDirty={isDirty}
                        onSetDirty={setIsDirty}
                        title={gameData.gameTitle || ''}
                        logo={gameData.gameLogo || ''}
                        omitSplashTitle={!!gameData.gameOmitSplashTitle}
                        splashImage={gameData.gameSplashImage || ''}
                        splashContentAlignment={gameData.gameSplashContentAlignment || 'right'}
                        splashDescription={gameData.gameSplashDescription || ''}
                        positiveEndingImage={gameData.positiveEndingImage || ''}
                        positiveEndingContentAlignment={gameData.positiveEndingContentAlignment || 'right'}
                        positiveEndingDescription={gameData.positiveEndingDescription || ''}
                        negativeEndingImage={gameData.negativeEndingImage || ''}
                        negativeEndingContentAlignment={gameData.negativeEndingContentAlignment || 'right'}
                        negativeEndingDescription={gameData.negativeEndingDescription || ''}
                        fixedVerbs={gameData.fixedVerbs || []}
                        actionButtonText={gameData.gameActionButtonText || 'Ação'}
                        verbInputPlaceholder={gameData.gameVerbInputPlaceholder || 'O que você faz?'}
                        diaryPlayerName={gameData.gameDiaryPlayerName || 'Jogador'}
                        splashButtonText={gameData.gameSplashButtonText || 'INICIAR'}
                        continueButtonText={gameData.gameContinueButtonText || 'Continuar'}
                        restartButtonText={gameData.gameRestartButtonText || 'Reiniciar'}
                        gameSystemEnabled={gameData.gameSystemEnabled || 'none'}
                        maxChances={gameData.gameMaxChances || 3}
                        textColor={gameData.gameTextColor || '#c9d1d9'}
                        titleColor={gameData.gameTitleColor || '#58a6ff'}
                        splashButtonColor={gameData.gameSplashButtonColor || '#2ea043'}
                        splashButtonHoverColor={gameData.gameSplashButtonHoverColor || '#238636'}
                        splashButtonTextColor={gameData.gameSplashButtonTextColor || '#ffffff'}
                        actionButtonColor={gameData.gameActionButtonColor || '#ffffff'}
                        actionButtonTextColor={gameData.gameActionButtonTextColor || '#0d1117'}
                        focusColor={gameData.gameFocusColor || '#58a6ff'}
                        chanceIconColor={gameData.gameChanceIconColor || '#ff4d4d'}
                        gameFontFamily={gameData.gameFontFamily || "'Silkscreen', sans-serif"}
                        gameFontSize={gameData.gameFontSize || '1em'}
                        chanceIcon={gameData.gameChanceIcon || 'heart'}
                        chanceReturnButtonText={gameData.gameChanceReturnButtonText || 'Tentar Novamente'}
                        gameTheme={gameData.gameTheme || 'dark'}
                        textColorLight={gameData.gameTextColorLight || '#24292f'}
                        titleColorLight={gameData.gameTitleColorLight || '#0969da'}
                        focusColorLight={gameData.gameFocusColorLight || '#0969da'}
                        frameBookColor={gameData.frameBookColor || '#FFFFFF'}
                        frameTradingCardColor={gameData.frameTradingCardColor || '#1c1917'}
                        frameChamferedColor={gameData.frameChamferedColor || '#FFFFFF'}
                        frameRoundedTopColor={gameData.frameRoundedTopColor || '#facc15'}
                        gameSceneNameOverlayBg={gameData.gameSceneNameOverlayBg || '#0d1117'}
                        gameSceneNameOverlayTextColor={gameData.gameSceneNameOverlayTextColor || '#c9d1d9'}
                        gameShowTrackersUI={!!gameData.gameShowTrackersUI}
                        imageFrame={gameData.gameImageFrame || 'none'}
                        layoutOrder={gameData.gameLayoutOrder || 'image-first'}
                        layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                        suggestionsButtonText={gameData.gameSuggestionsButtonText}
                        inventoryButtonText={gameData.gameInventoryButtonText}
                        diaryButtonText={gameData.gameDiaryButtonText}
                        trackersButtonText={gameData.gameTrackersButtonText}
                        gameContinueIndicatorColor={gameData.gameContinueIndicatorColor || '#58a6ff'}
                        onSetView={handleSetView}
                        
                        // Transitions
                        textAnimationType={gameData.gameTextAnimationType || 'fade'}
                        textSpeed={gameData.gameTextSpeed || 5}
                        imageTransitionType={gameData.gameImageTransitionType || 'fade'}
                        imageSpeed={gameData.gameImageSpeed || 5}
                    />
                );

            case 'map':
                return (
                    <SceneMap
                        allScenesMap={gameData.scenes}
                        startSceneId={gameData.startScene}
                        onSelectScene={handleSelectScene}
                        onUpdateScenePosition={handleUpdateScenePosition}
                        onAddScene={handleAddScene}
                    />
                );

            case 'global_objects':
                return (
                    <GlobalObjectsEditor
                        scenes={gameData.scenes}
                        globalObjects={gameData.globalObjects}
                        onUpdateObject={handleUpdateGlobalObject}
                        onDeleteObject={handleDeleteGlobalObject}
                        onCreateObject={handleCreateObjectOnly}
                        onSelectScene={handleSelectScene}
                        isDirty={isDirty}
                        onSetDirty={setIsDirty}
                    />
                );

            case 'trackers':
                return (
                    <TrackersEditor
                        trackers={gameData.consequenceTrackers || []}
                        onUpdateTrackers={handleUpdateTrackers}
                        allScenes={Object.values(gameData.scenes)}
                        allTrackerIds={Object.keys(gameData.consequenceTrackers?.map(t => t.id) || {})}
                        isDirty={isDirty}
                        onSetDirty={setIsDirty}
                        onSelectScene={handleSelectScene}
                    />
                );
            
            default:
                return <WelcomePlaceholder />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-brand-bg text-brand-text font-sans overflow-hidden">
            <Header
                gameData={gameData}
                onImportGame={handleImportGame}
                isPreviewing={isPreviewing}
                onTogglePreview={() => setIsPreviewing(!isPreviewing)}
            />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    scenes={getSceneList()}
                    startSceneId={gameData.startScene}
                    selectedSceneId={selectedSceneId}
                    currentView={currentView}
                    onSelectScene={handleSelectScene}
                    onAddScene={handleAddScene}
                    onDeleteScene={handleDeleteScene}
                    onReorderScenes={handleReorderScenes}
                    onSetView={handleSetView}
                    onNewGame={handleNewGame}
                />
                <main className="flex-1 overflow-y-auto bg-brand-bg relative p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
