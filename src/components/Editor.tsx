
import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from './UserContext';
import { Auth } from './Auth';
import { useToast } from './ToastContext';
import { useGameData } from '../hooks/useGameData';
import { useSceneManagement } from '../hooks/useSceneManagement';
import { useExportImport } from '../hooks/useExportImport';
import { generateUniqueId, getFrameClass, getMimeTypeFromFileName, getFontUrl } from '../utils/helpers';
import DOMPurify from 'dompurify';
import { GameData, Scene, GameObject, Interaction, View, ConsequenceTracker, FixedVerb, Vignette } from '../types';
import Sidebar from './Sidebar';
import SceneEditor from './SceneEditor';
import Header from './Header';
import { WelcomePlaceholder } from './WelcomePlaceholder';
// import VignettesEditor from './VignettesEditor'; // Removed as integrated into SceneEditor
import Preview from './Preview';
import { LoadingOverlay } from './LoadingOverlay';

// Lazy Load Heavy Components
const UIEditor = lazy(() => import('./UIEditor').then(module => ({ default: module.UIEditor })));
const GuideView = lazy(() => import('./GuideView').then(module => ({ default: module.GuideView })));
const SceneMap = lazy(() => import('./SceneMap'));
const GlobalObjectsEditor = lazy(() => import('./GlobalObjectsEditor'));
const TrackersEditor = lazy(() => import('./TrackersEditor'));
const GlobalCommandsEditor = lazy(() => import('./GlobalCommandsEditor'));
import { ConfirmationModal } from './ConfirmationModal';
import { NewProjectModal } from './NewProjectModal';
import { TransitionScreen } from './TransitionScreen';
import UserManualModal from './UserManualModal';
import { gameJS, prepareGameDataForEngine } from './game-engine';
import { gameHTML, gameCSS, initialGameData } from '../lib/gameDefaults';
import { Info, Settings as SettingsIcon, CircleHelp } from 'lucide-react';
import Settings from '../pages/Settings';
import AboutProject from '../pages/AboutProject';

declare var JSZip: any;

// Helpers extracted to utils/helpers.ts



import { useTheme } from './ThemeProvider';

// ... (existing imports)

const Editor: React.FC = () => {
    const { toast } = useToast();
    const { user, profile, loading: authLoading } = useUser();
    const { theme: appTheme } = useTheme();
    const navigate = useNavigate();

    const [isTransitioning, setIsTransitioning] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.title = "IF Builder / Ficções Interativas";
        return () => {
            document.title = "IF Builder / Ficções Interativas";
        };
    }, []);

    const [importKey, setImportKey] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 2000); // 2s duration
        return () => clearTimeout(timer);
    }, []);

    const handleNavigate = (path: string) => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(path);
        }, 2000); // 2s duration
    };

    const handleExit = () => handleNavigate('/dashboard');

    // Session loading handled by UserContext now.
    // If we need to block rendering until auth is ready:
    const loadingSession = authLoading;



    const handleLogout = async () => {
        try {
            // Perform actual logout
            await supabase.auth.signOut({ scope: 'global' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            // App.tsx will handle the redirect to Auth
        }
    };

    // --- Game Data Hook ---
    const {
        gameData, setGameData, isDirty, setIsDirty,
        scenesList, fixedVerbs, consequenceTrackers, detectedActiveSystems,
        handleUpdateGameData, handleUpdateGlobalObject, handleCreateGlobalObject, handleDeleteGlobalObject,
        handleUpdateTrackers, handleCreateTracker, handleUpdateGlobalCommands,
        handleLinkObjectToScene, handleUnlinkObjectFromScene, handleUpdateScenePosition, handleUpdateVignettePosition, handleReorganizeScenes
    } = useGameData();

    // Remove: const [gameData, setGameData] = useState<GameData>(initialGameData);
    // Remove: detectedActiveSystems useMemo
    // Remove local isDirty state definition (handled by hook)

    const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
    const [previewSceneId, setPreviewSceneId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>('scenes');
    const [isPreviewing, setIsPreviewing] = useState(false);

    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { },
        isDanger: false
    });

    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

    const closeConfirmationModal = useCallback(() => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    const {
        handleAddScene,
        handleDeleteScene,
        handleUpdateScene,
        handleCopyScene,
        handleAddVignette,
        handleReorderScenes
    } = useSceneManagement({
        gameData,
        setGameData,
        setIsDirty,
        toast,
        setCurrentView,
        setSelectedSceneId,
        selectedSceneId,
        closeConfirmationModal,
        setConfirmationModal
    });

    const {
        handleExport,
        handleImportFile,
        handleImportGame,
        handleDownloadExample
    } = useExportImport({
        gameData,
        setGameData,
        setIsDirty,
        setImportKey,
        setCurrentView,
        toast,
        profile
    });

    const [isManualOpen, setIsManualOpen] = useState(false);

    // Export/Import handlers moved to useExportImport hook

    // Export/Import handlers moved to useExportImport hook

    const selectedScene = useMemo(() => {
        return selectedSceneId ? gameData.scenes[selectedSceneId] : null;
    }, [gameData.scenes, selectedSceneId]);


    // handleUpdateGameData coming from hook

    // Scene handlers and Reorder handlers moved to useSceneManagement

    const handleSelectScene = (id: string) => {
        setCurrentView('scenes');
        setSelectedSceneId(id);
    };

    const handleSetView = (view: View) => {
        setCurrentView(view);
        if (view === 'scenes' && !selectedSceneId && scenesList.length > 0) {
            setSelectedSceneId(scenesList[0].id);
        }
    };

    const handleNewGame = () => {
        const hasScenes = Object.keys(gameData.scenes).length > 0;

        if (hasScenes) {
            setConfirmationModal({
                isOpen: true,
                title: "Novo Jogo",
                message: "Existem cenas criadas neste projeto. Ao criar uma nova ficção, todas as alterações não salvas serão perdidas. Deseja continuar?",
                isDanger: true,
                onConfirm: () => {
                    closeConfirmationModal();
                    setIsNewProjectModalOpen(true);
                },
                onCancel: closeConfirmationModal
            });
        } else {
            setIsNewProjectModalOpen(true);
        }
    };

    const handleProjectCreated = (newGameData: Partial<GameData>) => {
        setIsNewProjectModalOpen(false);
        setGameData({
            ...initialGameData,
            ...newGameData
        });
        setIsDirty(false);
        setImportKey(prev => prev + 1);
        setCurrentView('scenes'); // Or 'interface' if you prefer to land on settings
        toast("Nova Ficção Criada", "Projeto iniciado com sucesso!", "success");
    };

    const handleStartCreating = () => {
        handleAddScene();
        setCurrentView('interface');
    };

    const handleCreateNewProject = (overrideData?: Partial<GameData>) => {
        const hasScenes = Object.keys(gameData.scenes).length > 0;

        const createProject = () => {
            setGameData({
                ...initialGameData,
                ...overrideData,
                // Ensure unique ID for start scene if not provided (though initialData serves base)
                // But we usually want fresh state.
            });
            setIsDirty(false);
            setImportKey(prev => prev + 1);
            // If vignettes are created, switch to vignettes view? Or just interface?
            // User said: "generate at least one opening vignette".
            // So if vignettes exist, maybe show them? Or show Interface (UIEditor) as requested "decisions... reflected there".
            // Interface view allows configuring Appearance.
            setCurrentView('interface');
        };

        if (hasScenes) {
            setConfirmationModal({
                isOpen: true,
                title: "Novo Projeto",
                message: "Deseja iniciar um novo projeto? O projeto atual (não exportado) será perdido.",
                isDanger: true,
                onConfirm: () => {
                    closeConfirmationModal();
                    createProject();
                },
                onCancel: closeConfirmationModal
            });
        } else {
            createProject();
        }
    };

    // Global Object handlers coming from hook

    // Scene Link handlers coming from hook
    // handleUpdateTrackers coming from hook
    // handleUpdateScenePosition coming from hook


    const handleGoToForum = async () => {
        setIsSaving(true);
        // Clean save simulation if needed, or trigger actual save if implemented
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
        navigate('/community');
    };

    if (loadingSession) {
        return <TransitionScreen isVisible={true} />;
    }

    if (!user) {
        return <Auth />;
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30" >
            <TransitionScreen isVisible={isTransitioning} />
            {isPreviewing ? (
                <div className="flex flex-col w-full h-full">
                    <Header
                        gameData={gameData}
                        isPreviewing={isPreviewing}
                        onTogglePreview={() => setIsPreviewing(false)}
                        onNewGame={handleNewGame}
                        onLogout={handleLogout}
                        onHome={() => {
                            setCurrentView('scenes');
                            setSelectedSceneId(null);
                        }}
                    />
                    <Preview gameData={gameData} testSceneId={previewSceneId} />
                </div>
            ) : (
                <div className="flex flex-col h-full w-full">

                    <Header
                        gameData={gameData}
                        isPreviewing={isPreviewing}
                        onTogglePreview={() => {
                            setPreviewSceneId(null);
                            setIsPreviewing(true);
                        }}
                        onNewGame={handleNewGame}
                        onLogout={handleLogout}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                        onExport={handleExport}
                        onImport={handleImportFile}
                        onHome={() => {
                            setCurrentView('scenes');
                            setSelectedSceneId(null);
                        }}
                        currentView={currentView}
                    />
                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar
                            scenes={scenesList}
                            startSceneId={gameData.startScene}
                            selectedSceneId={selectedSceneId}
                            currentView={currentView}
                            gameData={gameData}
                            onSelectScene={handleSelectScene}
                            onAddScene={handleAddScene}
                            onDeleteScene={handleDeleteScene}
                            onReorderScenes={handleReorderScenes}
                            onSetView={handleSetView}
                            onExit={handleExit}
                            onNavigate={handleNavigate}
                            onImportGame={handleImportGame}
                            onTogglePreview={() => {
                                setPreviewSceneId(null);
                                setIsPreviewing(true);
                            }}
                            isCollapsed={sidebarCollapsed}
                            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                            isDirty={isDirty}
                            onOpenManual={() => setIsManualOpen(true)}
                            theme={appTheme}
                        />
                        <main className={`flex-1 overflow-y-auto relative bg-background ${currentView === 'scenes' && !selectedScene ? 'p-0' : 'p-6'}`}>
                            {/* currentView === 'vignettes' block removed */}
                            {currentView === 'interface' && (
                                <Suspense fallback={<LoadingOverlay message="Carregando Editor de Interface..." />}>
                                    <UIEditor
                                        key={importKey}
                                        {...gameData}
                                        enableInventory={gameData.enableInventory ?? detectedActiveSystems.inventory}
                                        enableChances={(gameData.enableChances ?? detectedActiveSystems.chances) || gameData.gameSystemEnabled === 'chances'}
                                        enableTrackers={(gameData.enableTrackers ?? detectedActiveSystems.trackers) || gameData.gameSystemEnabled === 'trackers'}
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
                                        backgroundMusic={gameData.gameBackgroundMusic || ''}
                                        positiveEndingImage={gameData.positiveEndingImage || ''}
                                        positiveEndingContentAlignment={gameData.positiveEndingContentAlignment || 'right'}
                                        positiveEndingDescription={gameData.positiveEndingDescription || ''}
                                        positiveEndingMusic={gameData.positiveEndingMusic || ''}
                                        negativeEndingImage={gameData.negativeEndingImage || ''}
                                        negativeEndingContentAlignment={gameData.negativeEndingContentAlignment || 'right'}
                                        negativeEndingDescription={gameData.negativeEndingDescription || ''}
                                        negativeEndingMusic={gameData.negativeEndingMusic || ''}
                                        fixedVerbs={fixedVerbs}
                                        actionButtonText={gameData.gameActionButtonText || 'Ação'}
                                        verbInputPlaceholder={gameData.gameVerbInputPlaceholder || 'O que você faz?'}
                                        diaryPlayerName={gameData.gameDiaryPlayerName || 'Jogador'}
                                        splashButtonText={gameData.gameSplashButtonText || 'INICIAR'}
                                        continueButtonText={gameData.gameContinueButtonText || 'Continuar'}
                                        restartButtonText={gameData.gameRestartButtonText || 'Reiniciar'}
                                        gameInteractionType={gameData.gameInteractionType || 'parser'}
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
                                        gameFontSize={gameData.gameFontSize || '0.75em'}
                                        chanceIcon={gameData.gameChanceIcon || 'heart'}
                                        chanceReturnButtonText={gameData.gameChanceReturnButtonText || 'Tentar Novamente'}
                                        gameTheme={gameData.gameTheme || 'dark'}
                                        textColorLight={gameData.textColorLight || '#24292f'}
                                        titleColorLight={gameData.titleColorLight || '#0969da'}
                                        focusColorLight={gameData.focusColorLight || '#0969da'}
                                        frameBookColor={gameData.frameBookColor || '#FFFFFF'}
                                        frameTradingCardColor={gameData.frameTradingCardColor || '#1c1917'}
                                        frameRoundedTopColor={gameData.frameRoundedTopColor || '#facc15'}
                                        gameFrameColor={gameData.gameFrameColor || '#FFFFFF'}
                                        gameSceneNameOverlayBg={gameData.gameSceneNameOverlayBg || '#0d1117'}
                                        gameSceneNameOverlayTextColor={gameData.gameSceneNameOverlayTextColor || '#c9d1d9'}
                                        gameShowTrackersUI={gameData.gameShowTrackersUI ?? true}
                                        gameShowSystemButton={gameData.gameShowSystemButton ?? true}
                                        imageFrame={gameData.gameImageFrame || 'none'}
                                        layoutOrder={gameData.gameLayoutOrder || 'image-first'}
                                        layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                                        suggestionsButtonText={gameData.gameSuggestionsButtonText}
                                        inventoryButtonText={gameData.gameInventoryButtonText}
                                        diaryButtonText={gameData.gameDiaryButtonText}
                                        diaryShowSceneImage={gameData.diaryShowSceneImage}
                                        diaryShowPlayerAction={gameData.diaryShowPlayerAction}
                                        trackersButtonText={gameData.gameTrackersButtonText}
                                        gameSystemButtonText={gameData.gameSystemButtonText}
                                        gameSaveMenuTitle={gameData.gameSaveMenuTitle}
                                        gameLoadMenuTitle={gameData.gameLoadMenuTitle}
                                        gameMainMenuButtonText={gameData.gameMainMenuButtonText}
                                        gameContinueIndicatorColor={gameData.gameContinueIndicatorColor || '#58a6ff'}
                                        gameViewEndingButtonText={gameData.gameViewEndingButtonText || 'Ver Final'}
                                        textAnimationType={gameData.gameTextAnimationType || 'fade'}
                                        textSpeed={gameData.gameTextSpeed || 5}
                                        imageTransitionType={gameData.gameImageTransitionType || 'fade'}
                                        imageSpeed={gameData.gameImageSpeed || 5}
                                        onNavigateToTrackers={() => handleSetView('trackers')}
                                    />
                                </Suspense>
                            )}
                            {currentView === 'scenes' && selectedScene ? (
                                <SceneEditor
                                    scene={selectedScene}
                                    allScenes={scenesList}
                                    globalObjects={gameData.globalObjects}
                                    onUpdateScene={handleUpdateScene}
                                    onCopyScene={handleCopyScene}
                                    onCreateGlobalObject={handleCreateGlobalObject}
                                    onLinkObjectToScene={handleLinkObjectToScene}
                                    onUnlinkObjectFromScene={handleUnlinkObjectFromScene}
                                    onUpdateGlobalObject={handleUpdateGlobalObject}
                                    enableChances={(gameData.enableChances ?? detectedActiveSystems.chances) || gameData.gameSystemEnabled === 'chances'}
                                    gameSystemEnabled={gameData.gameSystemEnabled}
                                    onPreviewScene={(scene) => {
                                        setPreviewSceneId(scene.id);
                                        setIsPreviewing(true);
                                    }}
                                    onSelectScene={handleSelectScene}
                                    isDirty={isDirty}
                                    onSetDirty={setIsDirty}
                                    layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                                    consequenceTrackers={consequenceTrackers}
                                    isStartScene={selectedScene.id === gameData.startScene}
                                    gameInteractionType={gameData.gameInteractionType || 'parser'}
                                    vignettes={gameData.vignettes || []}
                                    onViewMap={() => handleSetView('map')}
                                />
                            ) : currentView === 'scenes' ? (
                                <WelcomePlaceholder
                                    onCreateScene={handleCreateNewProject}
                                    onDownloadExample={handleDownloadExample}
                                    onMeetProject={() => setCurrentView('about')}
                                    theme={appTheme}
                                />
                            ) : currentView === 'guide' ? (
                                <Suspense fallback={<LoadingOverlay message="Carregando Guia..." />}>
                                    <GuideView />
                                </Suspense>
                            ) : null}

                            {currentView === 'map' && (
                                <Suspense fallback={<LoadingOverlay message="Carregando Mapa..." />}>
                                    <SceneMap
                                        allScenesMap={gameData.scenes}
                                        globalObjects={gameData.globalObjects}
                                        startSceneId={gameData.startScene}
                                        vignettes={gameData.vignettes || []}
                                        onSelectScene={handleSelectScene}
                                        onUpdateScenePosition={handleUpdateScenePosition}
                                        onUpdateVignettePosition={handleUpdateVignettePosition}
                                        onReorganizeScenes={handleReorganizeScenes}
                                        gameInteractionType={gameData.gameInteractionType || 'parser'}
                                    />
                                </Suspense>
                            )}

                            {currentView === 'global_objects' && (
                                <Suspense fallback={<LoadingOverlay message="Carregando Objetos..." />}>
                                    <GlobalObjectsEditor
                                        scenes={gameData.scenes}
                                        globalObjects={gameData.globalObjects}
                                        onUpdateObject={handleUpdateGlobalObject}
                                        onDeleteObject={handleDeleteGlobalObject}
                                        onCreateObject={handleCreateGlobalObject}
                                        onSelectScene={handleSelectScene}
                                        isDirty={isDirty}
                                        onSetDirty={setIsDirty}
                                    />
                                </Suspense>
                            )}

                            {currentView === 'trackers' && (
                                <Suspense fallback={<LoadingOverlay message="Carregando Rastreadores..." />}>
                                    <TrackersEditor
                                        trackers={consequenceTrackers}
                                        onUpdateTrackers={handleUpdateTrackers}
                                        allScenes={scenesList}
                                        allTrackerIds={(gameData.consequenceTrackers || []).map(t => t.id)}
                                        isDirty={isDirty}
                                        onSetDirty={setIsDirty}
                                        onSelectScene={handleSelectScene}
                                    />
                                </Suspense>
                            )}

                            {currentView === 'global_commands' && (
                                <Suspense fallback={<LoadingOverlay message="Carregando Comandos..." />}>
                                    <GlobalCommandsEditor
                                        fixedVerbs={gameData.fixedVerbs || []}
                                        onUpdate={handleUpdateGameData}
                                        isDirty={isDirty}
                                        onSetDirty={setIsDirty}
                                    />
                                </Suspense>
                            )}

                            {currentView === 'settings' && <Settings hideHeader />}
                            {currentView === 'about' && <AboutProject hideHeader />}
                        </main>
                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                title={confirmationModal.title}
                message={confirmationModal.message}
                onConfirm={confirmationModal.onConfirm}
                onCancel={confirmationModal.onCancel}
                isDanger={confirmationModal.isDanger}
            />
            <NewProjectModal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
                onCreate={handleProjectCreated}
            />
            <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
        </div >
    );
};

export default Editor;
