import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from './ToastContext';
import { useGameData } from '../hooks/useGameData';
import { useSceneManagement } from '../hooks/useSceneManagement';
import { useExportImport } from '../hooks/useExportImport';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateUniqueId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFrameClass,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMimeTypeFromFileName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFontUrl,
} from '../utils/helpers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DOMPurify from 'dompurify';
import {
  GameData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Scene,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GameObject,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Interaction,
  View,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ConsequenceTracker,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FixedVerb,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Vignette,
} from '../types';
import Sidebar from './Sidebar';
import SceneEditor from './SceneEditor';
import Header from './Header';
import { WelcomePlaceholder } from './WelcomePlaceholder';
// import VignettesEditor from './VignettesEditor'; // Removed as integrated into SceneEditor
import Preview from './Preview';
import { LoadingOverlay } from './LoadingOverlay';

// Lazy Load Heavy Components
const UIEditor = lazy(() => import('./UIEditor').then((module) => ({ default: module.UIEditor })));
const GuideView = lazy(() =>
  import('./GuideView').then((module) => ({ default: module.GuideView }))
);
const SceneMap = lazy(() => import('./SceneMap'));
const GlobalObjectsEditor = lazy(() => import('./GlobalObjectsEditor'));
const TrackersEditor = lazy(() => import('./TrackersEditor'));
const GlobalCommandsEditor = lazy(() => import('./GlobalCommandsEditor'));
import { ConfirmationModal } from './ConfirmationModal';
import { NewProjectModal } from './NewProjectModal';
import { TransitionScreen } from './TransitionScreen';
import UserManualModal from './UserManualModal';
import NodeTypeModal from './NodeTypeModal';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { gameJS, prepareGameDataForEngine } from './game-engine';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { gameHTML, gameCSS, initialGameData } from '../lib/gameDefaults';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Info, Settings as SettingsIcon, CircleHelp, X, Save } from 'lucide-react';
import Settings from '../pages/Settings';
import AboutProject from '../pages/AboutProject';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
declare let JSZip: any;

import { useTheme } from './ThemeProvider';
import { useTranslation } from 'react-i18next';

// ... (existing imports)

// Pixel Art Patterns for Import Animation
const PATTERN_BULL = [
  // Row 1 (Horns tips)
  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // Row 2 (Horns curve)
  0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  // Row 3 (Head top)
  0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,
  // Row 4 (Head/Neck)
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
  // Row 5
  0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
  // Row 6 (Body)
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  // Row 7
  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
  // Row 8
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
  // Row 9 (Legs)
  0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
  // Row 10
  0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
  // Row 11
  0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
  // Row 12 (Hooves)
  0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
];

const PATTERN_MAN = [
  // Centered Stick Figure
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Head top
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  0,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Head sides
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Head bottom
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Neck
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  1,
  1,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0, // Shoulders
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  1,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0, // Arms
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0, // Hands
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Torso
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Hips
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Legs top
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0, // Legs low
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0, // Feet
];

const PATTERN_COMPUTER = [
  // Centered Computer
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Top border
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0, // Sides top
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  0,
  0,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0, // Screen content
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0, // Screen content
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  1,
  1,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0, // Screen content
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0, // Screen bottom
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0, // Bottom bezel
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Stand neck
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0, // Keyboard Row 1
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  1,
  1,
  0,
  0,
  0,
  0,
  0, // Keyboard keys
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0, // Keyboard bottom
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0, // Space
];

const PATTERN_FLOPPY_DISK = [
  // Floppy Disk Top
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0, // Top border
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  0,
  0,
  0, // Upper with dog ear
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0, // Metal slider notch
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0, // Metal slider slot
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0, // Metal slider notch bg
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0, // Mid gap
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  1,
  0,
  0,
  0,
  0, // Label top
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  1,
  0,
  0,
  0,
  0, // Label text line
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  1,
  0,
  0,
  0,
  0, // Label text line
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  1,
  0,
  0,
  0,
  0, // Label text line
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  1,
  1,
  0,
  0,
  0,
  0, // Label bottom
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0, // Bottom border
];

const IMPORT_PATTERNS = [PATTERN_BULL, PATTERN_MAN, PATTERN_COMPUTER];
const SAVE_PATTERNS = [PATTERN_BULL, PATTERN_MAN, PATTERN_FLOPPY_DISK];

const Editor: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const profile = null;
  const { theme: appTheme } = useTheme();
  const navigate = useNavigate();

  const [isTransitioning, setIsTransitioning] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Save Project States
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveFilename, setSaveFilename] = useState('');

  // BIOS Animation State
  const [biosStep, setBiosStep] = useState(0); // 0: Info, 1: Prompt Wait, 2: Typing
  const [typedCommand, setTypedCommand] = useState('');
  const [isBiosFinished, setIsBiosFinished] = useState(false);



  const [importKey, setImportKey] = useState(0);

  // Import Animation Rotation
  const [currentPixelPatternIndex, setCurrentPixelPatternIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPixelPatternIndex((prev) => (prev + 1) % 3);
    }, 2000); // Rotate every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // BIOS Animation Sequence (runs once on mount)
  useEffect(() => {
    const fullCommand = 'RUN IF-BUILDER.EXE';

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

  // --- Game Data Hook ---
  const {
    gameData,
    setGameData,
    isDirty,
    setIsDirty,
    scenesList,
    fixedVerbs,
    consequenceTrackers,
    detectedActiveSystems,
    handleUpdateGameData,
    handleUpdateGlobalObject,
    handleCreateGlobalObject,
    handleDeleteGlobalObject,
    handleUpdateTrackers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleCreateTracker,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleUpdateGlobalCommands,
    handleLinkObjectToScene,
    handleUnlinkObjectFromScene,
    handleUpdateScenePosition,
    handleUpdateVignettePosition,
    handleReorganizeScenes,
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
    isDanger: false,
  });

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNodeTypeModalOpen, setIsNodeTypeModalOpen] = useState(false);

  const closeConfirmationModal = useCallback(() => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const {
    handleAddScene,
    handleDeleteScene,
    handleUpdateScene,
    handleCopyScene,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleAddVignette,
    handleReorderScenes,
  } = useSceneManagement({
    gameData,
    setGameData,
    setIsDirty,
    toast,
    setCurrentView,
    setSelectedSceneId,
    selectedSceneId,
    closeConfirmationModal,
    setConfirmationModal,
  });

  const handleAddNodeType = (type: 'scene' | 'vignette') => {
    setIsNodeTypeModalOpen(false);

    // We get the new scene ID from handleAddScene (which returns it)
    // Wait for the state to update, then modify if it was a vignette
    // handleAddScene automatically sets it as the selected scene
    handleAddScene();

    // Give handleAddScene a tiny moment to run before updating the new scene
    setTimeout(() => {
      setGameData((prev) => {
        const newScenes = { ...prev.scenes };
        // The newly added scene's ID is the last one in the sceneOrder
        const newSceneId = prev.sceneOrder[prev.sceneOrder.length - 1];
        const newScene = newScenes[newSceneId];

        if (newScene) {
          if (type === 'vignette') {
            newScene.name = 'Nova vinheta';
            const hasOpeningVignette = Object.values(prev.scenes).some(s => s.vignetteType === 'opening' && s.id !== newSceneId);
            newScene.vignetteType = hasOpeningVignette ? 'transition' : 'opening';
          } else {
            newScene.name = 'Nova cena';
            newScene.vignetteType = 'none';
          }
          setIsDirty(true);
        }
        return { ...prev, scenes: newScenes };
      });
    }, 0);
  };

  const { handleExport, handleImportFile, handleImportGame, handleDownloadExample, isImporting } =
    useExportImport({
      gameData,
      setGameData,
      setIsDirty,
      setImportKey,
      setCurrentView,
      toast,
      profile,
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
        title: 'Novo Jogo',
        message:
          'Existem cenas criadas neste projeto. Ao criar uma nova ficção, todas as alterações não salvas serão perdidas. Deseja continuar?',
        isDanger: true,
        onConfirm: () => {
          closeConfirmationModal();
          setIsNewProjectModalOpen(true);
        },
        onCancel: closeConfirmationModal,
      });
    } else {
      setIsNewProjectModalOpen(true);
    }
  };

  const handleProjectCreated = (newGameData: Partial<GameData>) => {
    setIsNewProjectModalOpen(false);
    setGameData({
      ...initialGameData,
      ...newGameData,
    });
    setIsDirty(false);
    setImportKey((prev) => prev + 1);
    setCurrentView('scenes'); // Or 'interface' if you prefer to land on settings
    toast(
      t('editor.newProjectSuccessTitle', 'Nova Ficção Criada'),
      t('editor.newProjectSuccessDesc', 'Projeto iniciado com sucesso!'),
      'success'
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      setImportKey((prev) => prev + 1);
      // If vignettes are created, switch to vignettes view? Or just interface?
      // User said: "generate at least one opening vignette".
      // So if vignettes exist, maybe show them? Or show Interface (UIEditor) as requested "decisions... reflected there".
      // Interface view allows configuring Appearance.
      setCurrentView('interface');
    };

    if (hasScenes) {
      setConfirmationModal({
        isOpen: true,
        title: 'Novo Projeto',
        message: 'Deseja iniciar um novo projeto? O projeto atual (não exportado) será perdido.',
        isDanger: true,
        onConfirm: () => {
          closeConfirmationModal();
          createProject();
        },
        onCancel: closeConfirmationModal,
      });
    } else {
      createProject();
    }
  };

  // Global Object handlers coming from hook

  // Scene Link handlers coming from hook
  // handleUpdateTrackers coming from hook
  // handleUpdateScenePosition coming from hook

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleGoToForum = async () => {
    setIsSaving(true);
    // Clean save simulation if needed, or trigger actual save if implemented
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    navigate('/community');
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    setShowSaveModal(false);
    try {
      await handleExport(saveFilename);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Show BIOS animation first

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
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
      <TransitionScreen isVisible={isTransitioning} />

      {isImporting && (
        <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <style>{`
                        @keyframes pixel-blink {
                            0%, 100% { opacity: 0; }
                            50% { opacity: 1; }
                        }
                        @keyframes pulse-glow {
                            0%, 100% { box-shadow: 0 0 15px -5px #ffffff; }
                            50% { box-shadow: 0 0 40px 0px #ffffff; }
                        }
                    `}</style>
          <div className="bg-zinc-900 border border-zinc-500 rounded-lg p-8 flex flex-col items-center gap-6 animate-[pulse-glow_2s_ease-in-out_infinite] min-w-[300px]">
            {/* Pixel Animation (Rotates: Bull -> Man -> Computer) */}
            <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-0.5 w-40 h-24 p-2 rounded-sm">
              {Array.from({ length: 240 }).map((_, i) => {
                const pattern = IMPORT_PATTERNS[currentPixelPatternIndex];
                const isPixel = pattern[i] === 1;
                return (
                  <div
                    key={i}
                    className={`w-full h-full ${isPixel ? 'bg-white' : 'bg-transparent'}`}
                    style={{
                      opacity: isPixel ? 1 : 0.05,
                      animation: isPixel
                        ? `pixel-blink ${1.5 + Math.random()}s infinite ${Math.random()}s`
                        : 'none',
                      boxShadow: isPixel ? '0 0 2px #ffffff' : 'none',
                      transition: 'background-color 0.5s, opacity 0.5s',
                    }}
                  />
                );
              })}
            </div>

            <div className="text-center">
              <p className="text-white text-lg font-medium font-sans tracking-wide uppercase">
                {t('editor.importing_fiction', 'IMPORTANDO FICÇÃO')}
              </p>
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
            onHome={() => {
              setCurrentView('scenes');
              setSelectedSceneId(null);
            }}
            onExport={() => setShowSaveModal(true)}
            onImport={handleImportFile}
            currentView={currentView}
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
            sidebarCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onExport={() => setShowSaveModal(true)}
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
              onAddScene={() => setIsNodeTypeModalOpen(true)}
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
              theme={appTheme}
            />
            <main
              className={`flex-1 overflow-y-auto relative bg-background ${currentView === 'scenes' && !selectedScene ? 'p-0' : 'p-6'}`}
            >
              {/* currentView === 'vignettes' block removed */}
              {currentView === 'interface' && (
                <Suspense fallback={<LoadingOverlay message="Carregando Editor de Interface..." />}>
                  <UIEditor
                    key={importKey}
                    {...gameData}
                    enableInventory={gameData.enableInventory ?? detectedActiveSystems.inventory}
                    enableChances={
                      (gameData.enableChances ?? detectedActiveSystems.chances) ||
                      gameData.gameSystemEnabled === 'chances'
                    }
                    enableTrackers={
                      (gameData.enableTrackers ?? detectedActiveSystems.trackers) ||
                      gameData.gameSystemEnabled === 'trackers'
                    }
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
                    positiveEndingContentAlignment={
                      gameData.positiveEndingContentAlignment || 'right'
                    }
                    positiveEndingDescription={gameData.positiveEndingDescription || ''}
                    positiveEndingMusic={gameData.positiveEndingMusic || ''}
                    negativeEndingImage={gameData.negativeEndingImage || ''}
                    negativeEndingContentAlignment={
                      gameData.negativeEndingContentAlignment || 'right'
                    }
                    negativeEndingDescription={gameData.negativeEndingDescription || ''}
                    negativeEndingMusic={gameData.negativeEndingMusic || ''}
                    fixedVerbs={fixedVerbs}
                    actionButtonText={gameData.gameActionButtonText || ''}
                    verbInputPlaceholder={gameData.gameVerbInputPlaceholder || ''}
                    diaryPlayerName={gameData.gameDiaryPlayerName || ''}
                    splashButtonText={gameData.gameSplashButtonText || ''}
                    continueButtonText={gameData.gameContinueButtonText || ''}
                    restartButtonText={gameData.gameRestartButtonText || ''}
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
                    chanceReturnButtonText={gameData.gameChanceReturnButtonText || ''}
                    gameTheme={gameData.gameTheme || 'dark'}
                    textColorLight={gameData.textColorLight || '#24292f'}
                    titleColorLight={gameData.titleColorLight || '#0969da'}
                    focusColorLight={gameData.focusColorLight || '#0969da'}
                    frameBookColor={gameData.frameBookColor || '#FFFFFF'}
                    frameTradingCardColor={gameData.frameTradingCardColor || '#1c1917'}
                    frameRoundedTopColor={gameData.frameRoundedTopColor || '#facc15'}
                    gameFrameColor={gameData.gameFrameColor || '#FFFFFF'}
                    gameSceneNameOverlayBg={gameData.gameSceneNameOverlayBg || '#0d1117'}
                    gameSceneNameOverlayTextColor={
                      gameData.gameSceneNameOverlayTextColor || '#c9d1d9'
                    }
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
                    gameViewEndingButtonText={gameData.gameViewEndingButtonText}
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
                  enableChances={
                    (gameData.enableChances ?? detectedActiveSystems.chances) ||
                    gameData.gameSystemEnabled === 'chances'
                  }
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
                  globalSplashButtonText={gameData.gameSplashButtonText || ''}
                  onUpdateGlobalSplashButtonText={(text) =>
                    handleUpdateGameData('gameSplashButtonText', text)
                  }
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
                    allTrackerIds={(gameData.consequenceTrackers || []).map((t) => t.id)}
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

            {showSaveModal && (
              <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-background border border-border rounded-lg shadow-xl w-[400px] max-w-[90vw] overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
                    <h3 className="font-semibold text-lg">
                      {t('editor.save_project', 'Salvar Projeto')}
                    </h3>
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                      {t('editor.save_project_desc', 'Dê um nome ao seu projeto para exportá-lo.')}
                    </p>
                    <label className="text-sm font-medium">
                      {t('editor.project_filename', 'Nome do Arquivo')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={saveFilename}
                        onChange={(e) => setSaveFilename(e.target.value)}
                        placeholder={t('editor.project_filename_placeholder', 'meu_jogo')}
                        className="w-full bg-input border border-input-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && saveFilename.trim()) {
                            handleConfirmSave();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 p-4 border-t border-border bg-muted/30">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('common.cancel', 'Cancelar')}
                    </button>
                    <button
                      onClick={handleConfirmSave}
                      disabled={!saveFilename.trim()}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {t('common.save', 'Salvar')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isSaving && (
              <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <style>{`
                                    @keyframes pixel-blink-save {
                                        0%, 100% { opacity: 0; }
                                        50% { opacity: 1; }
                                    }
                                    @keyframes pulse-glow-save {
                                        0%, 100% { box-shadow: 0 0 15px -5px #ffffff; }
                                        50% { box-shadow: 0 0 40px 0px #ffffff; }
                                    }
                                `}</style>
                <div className="bg-zinc-900 border border-zinc-500 rounded-lg p-8 flex flex-col items-center gap-6 animate-[pulse-glow-save_2s_ease-in-out_infinite] min-w-[300px]">
                  {/* Pixel Animation (Rotates: Bull -> Man -> Floppy) */}
                  <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-0.5 w-40 h-24 p-2 rounded-sm">
                    {Array.from({ length: 240 }).map((_, i) => {
                      const pattern = SAVE_PATTERNS[currentPixelPatternIndex];
                      const isPixel = pattern[i] === 1;
                      return (
                        <div
                          key={i}
                          className={`w-full h-full ${isPixel ? 'bg-white' : 'bg-transparent'}`}
                          style={{
                            opacity: isPixel ? 1 : 0.05,
                            animation: isPixel
                              ? `pixel-blink-save ${1.5 + Math.random()}s infinite ${Math.random()}s`
                              : 'none',
                            boxShadow: isPixel ? '0 0 2px #ffffff' : 'none',
                            transition: 'background-color 0.5s, opacity 0.5s',
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <p className="text-white text-lg font-medium font-sans tracking-wide uppercase">
                      {t('editor.saving_fiction', 'SALVANDO FICÇÃO')}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
      <NodeTypeModal
        isOpen={isNodeTypeModalOpen}
        onClose={() => setIsNodeTypeModalOpen(false)}
        onSelect={handleAddNodeType}
      />
      <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </div>
  );
};

export default Editor;
