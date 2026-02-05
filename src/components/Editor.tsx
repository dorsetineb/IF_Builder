
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

    // BIOS Animation State
    const [biosStep, setBiosStep] = useState(0); // 0: Info, 1: Prompt Wait, 2: Typing
    const [typedCommand, setTypedCommand] = useState('');
    const [isBiosFinished, setIsBiosFinished] = useState(false);

    useEffect(() => {
        document.title = "IF Builder / Ficções Interativas";
        return () => {
            document.title = "IF Builder / Ficções Interativas";
        };
    }, []);

    const [importKey, setImportKey] = useState(0);

    // BIOS Animation Sequence (runs once on mount)
    useEffect(() => {
        const fullCommand = "RUN IF-BUILDER.EXE";

        // Step 1: Show prompt A:\> fast (0.5s)
        const timer1 = setTimeout(() => {
            setBiosStep(1);
        }, 500);

        // Step 2: Start typing command after 1.5s
        let typingInterval: ReturnType<typeof setInterval>;
        const timer2 = setTimeout(() => {
            setBiosStep(2);
            let charIndex = 0;
            typingInterval = setInterval(() => {
                if (charIndex < fullCommand.length) {
                    setTypedCommand(fullCommand.slice(0, charIndex + 1));
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 50); // Speed of typing: 50ms per char
        }, 1500);

        // Finish: End animation after typing completes
        // 1.5s (start) + ~1s (typing) + 0.5s (pause) = 3s
        const timer3 = setTimeout(() => {
            setIsBiosFinished(true);
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            if (typingInterval) clearInterval(typingInterval);
        };
    }, []);

    // Transition timer: starts AFTER BIOS is finished, now 3s instead of 2s
    useEffect(() => {
        if (!isBiosFinished) return;
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 3000); // 3s duration (was 2s)
        return () => clearTimeout(timer);
    }, [isBiosFinished]);

    const handleNavigate = (path: string) => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate(path);
        }, 3000); // 3s duration (was 2s)
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
        handleDownloadExample,
        isImporting
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
        return (
            <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
                {/* Simple loader while checking auth - NOT TransitionScreen */}
            </div>
        );
    }

    if (!user) {
        return <Auth />;
    }

    // Show BIOS animation first (after authentication)
    if (!isBiosFinished) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black text-white font-['Silkscreen'] text-sm p-4 sm:p-8 flex flex-col justify-start overflow-hidden selection:bg-white selection:text-black cursor-none">
                <style>{`
                    @keyframes hard-blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }
                    .animate-hard-blink {
                        animation: hard-blink 0.5s step-end infinite;
                    }
                `}</style>
                <div className="space-y-1 max-w-3xl">
                    <p>IF-BUILDER BIOS v1.0.24</p>
                    <p className="mb-4">Copyright (C) 2026 Deepmind Systems Inc.</p>

                    <p>System Memory: 640KB OK</p>
                    <p>Extended Memory: 32MB OK</p>
                    <p>Shadow RAM: Cached</p>
                    <br />
                    <p>Detecting Primary Master ... IF_BUILDER_CORE</p>
                    <p>Detecting Primary Slave ... USER_DATA</p>
                    <br />
                    <p>Booting from Hard Disk...</p>
                    <p>Loading interactive_fiction_engine.sys ... OK</p>
                    <p>Mounting file system ... OK</p>
                    <br />

                    {/* Prompt appears in Step 1 */}
                    <div className={`flex items-center ${biosStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="mr-2">A:\&gt;</span>
                        {/* Command Typed Character by Character */}
                        {biosStep >= 2 && <span>{typedCommand}</span>}
                        {/* Blinking Cursor */}
                        <span className="w-2.5 h-5 bg-white animate-hard-blink"></span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30" >
            <TransitionScreen isVisible={isTransitioning} />

            {/* Import Loading Popup */}
            {isImporting && (
                <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <style>{`
                        @keyframes sequential-fade {
                            0%, 100% { opacity: 0.2; background-color: #4c1d95; }
                            20% { opacity: 1; background-color: #9d4edd; box-shadow: 0 0 10px #9d4edd; }
                            40% { opacity: 0.2; background-color: #4c1d95; }
                        }
                    `}</style>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-8 flex flex-col items-center gap-6 shadow-2xl min-w-[300px]">
                        <div className="flex gap-3">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-4 h-4 rounded-sm bg-purple-900"
                                    style={{
                                        animation: `sequential-fade 1.5s infinite ease-in-out`,
                                        animationDelay: `${i * 0.3}s`
                                    }}
                                />
                            ))}
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-white text-lg font-medium font-['Silkscreen'] tracking-wide">IMPORTANDO SISTEMA</p>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest">Processando Dados</p>
                        </div>
                    </div>
                </div>
            )}

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
