import React, { useState, useCallback, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from './ToastContext';
import { useGameData, getLocalizedInitialGameData } from '../hooks/useGameData';
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
import SceneList from './SceneList';
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
import { Info, Settings as SettingsIcon, CircleHelp, X, Save, FileArchive, FileCode, Columns3, List } from 'lucide-react';
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
  const [isNarrativeMenuOpen, setIsNarrativeMenuOpen] = useState(true);

  // Save Project States
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveFilename, setSaveFilename] = useState('');
  const [saveFormat, setSaveFormat] = useState<'zip' | 'html'>('zip');

  // Load Modal States
  const importFileRef = useRef<HTMLInputElement>(null);
  const handleImportClick = () => {
    importFileRef.current?.click();
  };

  // BIOS Animation State
  const [biosStep, setBiosStep] = useState(0); // 0: Info, 1: Prompt Wait, 2: Typing
  const [typedCommand, setTypedCommand] = useState('');
  const [isBiosFinished, setIsBiosFinished] = useState(false);
  const [isBiosFading, setIsBiosFading] = useState(false);

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
    // Play startup sound
    const startupSound = new Audio('/787576__nazarhk__pc-startup-sound.mp3');
    startupSound.volume = 0.5;
    startupSound.play().catch((e) => console.warn('BIOS sound autoplay blocked or failed:', e));

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

    // Step 3: Start fading out at 4s
    const timer3 = setTimeout(() => {
      setIsBiosFading(true);
    }, 4000);

    // Finish: End animation after 5s (1s fade duration)
    const timer4 = setTimeout(() => {
      setIsBiosFinished(true);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
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
    setShowSaveModal(false);
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(path);
    }, 3000); // 3s duration (was 2s)
  };

  type PendingNavigation = 
    | { type: 'scene'; id: string | null; tab?: string } 
    | { type: 'view'; view: View } 
    | { type: 'navigate'; path: string } 
    | { type: 'exit' }
    | { type: 'action'; action: () => void };

  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigation | null>(null);
  const [hasUnsavedTabChanges, setHasUnsavedTabChanges] = useState(false);

  const executeNavigation = (navData: PendingNavigation) => {
    setHasUnsavedTabChanges(false); // Clear draft state
    setPendingNavigation(null);
    if (navData.type === 'scene') {
      setCurrentView('three_panels');
      setSelectedSceneId(navData.id);
      setIsNarrativeMenuOpen(false);
      if (navData.tab) {
        setSidePanelTab(navData.tab);
      }
    } else if (navData.type === 'view') {
      const targetView = (navData.view as string) === 'scenes' || (navData.view as string) === 'map' 
        ? 'three_panels' 
        : navData.view;
      setCurrentView(targetView);
      if (targetView === 'three_panels' && !selectedSceneId && scenesList.length > 0) {
        setSelectedSceneId(scenesList[0].id);
      }
    } else if (navData.type === 'navigate') {
      handleNavigate(navData.path);
    } else if (navData.type === 'exit') {
      handleNavigate('/dashboard'); // Original handleExit logic
    } else if (navData.type === 'action') {
      navData.action();
    }
  };

  const attemptNavigation = (navData: PendingNavigation) => {
    if (hasUnsavedTabChanges) {
      setPendingNavigation(navData);
    } else {
      executeNavigation(navData);
    }
  };

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

  // Warn user about unsaved changes when trying to close or reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Remove: const [gameData, setGameData] = useState<GameData>(initialGameData);
  // Remove: detectedActiveSystems useMemo
  // Remove local isDirty state definition (handled by hook)

  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [previewSceneId, setPreviewSceneId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [sidePanelTab, setSidePanelTab] = useState<string>('properties');
  const mainRef = useRef<HTMLElement>(null);

  const isSidePanelExpanded = sidePanelTab === 'objects' || sidePanelTab === 'interactions';

  // Scroll to top when view or scene changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [currentView, selectedSceneId]);

  // Update page title based on current view
  useEffect(() => {
    if (currentView === 'guide') {
      document.title = t('app.guideTitle', 'IF Builder / Guia Rápido');
    } else if (currentView === 'about') {
      document.title = t('app.aboutTitle', 'IF Builder / Sobre o Projeto');
    } else {
      document.title = t('app.editorTitle', 'IF Builder / Editor de Narrativa');
    }
  }, [currentView, t]);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
    isDanger: false,
    confirmText: t('common.confirm', 'Confirmar'),
    cancelText: t('common.cancel', 'Cancelar'),
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
    setIsNarrativeMenuOpen(true);
    handleAddScene(type);
  };

  const { handleExport, handleExportHTML, handleImportFile, handleImportGame, handleDownloadExample, isImporting } =
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

  const hasOpeningVignette = useMemo(() => {
    return scenesList.some((s) => s.vignetteType === 'opening');
  }, [scenesList]);

  // handleUpdateGameData coming from hook

  // Scene handlers and Reorder handlers moved to useSceneManagement

  const handleSelectScene = (id: string | null, tab?: string) => {
    attemptNavigation({ type: 'scene', id, tab });
  };

  const handleSetView = (view: View) => {
    attemptNavigation({ type: 'view', view });
  };

  const handleNewGame = () => {
    const hasScenes = Object.keys(gameData.scenes).length > 0;

    if (hasScenes) {
      setConfirmationModal({
        isOpen: true,
        title: t('newProject.title', 'Nova Ficção'),
        message: `${t('common.warning', 'Aviso')}\n\n${t('newProject.warningMessage', 'O novo projeto irá substituir o atual. Deseja prosseguir?')}`,
        isDanger: true,
        onConfirm: () => {
          closeConfirmationModal();
          setIsNewProjectModalOpen(true);
        },
        onCancel: closeConfirmationModal,
        confirmText: t('common.continue', 'Continuar'),
        cancelText: t('common.cancel', 'Cancelar'),
      });
    } else {
      setIsNewProjectModalOpen(true);
    }
  };

  const handleProjectCreated = (newGameData: Partial<GameData>) => {
    setIsNewProjectModalOpen(false);
    setGameData({
      ...getLocalizedInitialGameData(t),
      ...newGameData,
    });
    setIsDirty(false);
    setImportKey((prev) => prev + 1);
    setCurrentView('three_panels');
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
        ...getLocalizedInitialGameData(t),
        ...overrideData,
        // Ensure unique ID for start scene if not provided (though initialData serves base)
        // But we usually want fresh state.
      });
      setIsDirty(false);
      setImportKey((prev) => prev + 1);
      setCurrentView('three_panels');
    };

    if (hasScenes) {
      setConfirmationModal({
        isOpen: true,
        title: t('newProject.title', 'Nova Ficção'),
        message: `${t('common.warning', 'Aviso')}\n\n${t('newProject.warningMessage', 'O novo projeto irá substituir o atual. Deseja prosseguir?')}`,
        isDanger: true,
        onConfirm: () => {
          closeConfirmationModal();
          createProject();
        },
        onCancel: closeConfirmationModal,
        confirmText: t('common.continue', 'Continuar'),
        cancelText: t('common.cancel', 'Cancelar'),
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
      if (saveFormat === 'html') {
        await handleExportHTML(saveFilename);
      } else {
        await handleExport(saveFilename);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Show BIOS animation first

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
      <TransitionScreen isVisible={isTransitioning} />

      {/* Show BIOS animation as an overlay that fades out */}
      {!isBiosFinished && (
        <div className={`fixed inset-0 z-[10000] bg-black text-white font-['Silkscreen'] text-sm p-4 sm:p-8 flex flex-col justify-start overflow-hidden selection:bg-white selection:text-black cursor-none transition-opacity duration-1000 ${isBiosFading ? 'opacity-0' : 'opacity-100'}`}>
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
            {/* Logo ASCII - Denser Version */}
            <pre className="text-primary mb-10 font-mono leading-none opacity-90 scale-[0.65] origin-left sm:scale-90">
{`
           ██████   █████████      ████████   ██      ██  ██  ██      ██████    ████████  ███████ 
          ░░████   ░█████████     ░█████████ ░██     ░██ ░██ ░██     ░███████  ░████████ ░███████
         ░████   ░██           ░██    ░██ ░██     ░██ ░██ ░██     ░██    ░██░██       ░██    ░██
        ░████   ░█████████    ░████████  ░██     ░██ ░██ ░██     ░██    ░██░████████ ░███████ 
       ░████   ░█████████    ░████████  ░██     ░██ ░██ ░██     ░██    ░██░████████ ░███████ 
      ░████   ░██           ░██    ░██ ░██     ░██ ░██ ░██     ░██    ░██░██       ░██  ░██ 
     ██████  ░██           ░█████████ ░██████████ ░██ ░████████░███████  ░████████ ░██   ░██
    ░░░░░░   ░░            ░░░░░░░░   ░░░░░░░░░░  ░░  ░░░░░░░░ ░░░░░░    ░░░░░░░░  ░░     ░░ 
`}
            </pre>
            <p>IF-BUILDER BIOS V.1.0.0</p>
            <p className="mb-4">Copyright (C) 2026 @DORSETINEB</p>

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
      )}

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
          <div className="bg-zinc-900 border border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center gap-6 animate-[pulse-glow_2s_ease-in-out_infinite] min-w-[300px]">
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
            onHome={() => attemptNavigation({ type: 'action', action: () => {
              setCurrentView('three_panels');
              setSelectedSceneId(null);
            }})}
            onExport={() => setShowSaveModal(true)}
            onImport={handleImportClick}
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
            onImport={handleImportClick}
            onHome={() => attemptNavigation({ type: 'action', action: () => {
              setCurrentView('welcome');
              setSelectedSceneId(null);
              setIsNarrativeMenuOpen(false);
            }})}
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
              onExit={() => attemptNavigation({ type: 'exit' })}
              onNavigate={(path) => attemptNavigation({ type: 'navigate', path })}
              onImportGame={handleImportGame}
              onTogglePreview={() => {
                setPreviewSceneId(null);
                setIsPreviewing(true);
              }}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              isNarrativeMenuOpen={isNarrativeMenuOpen}
              onToggleNarrative={() => setIsNarrativeMenuOpen(!isNarrativeMenuOpen)}
              isDirty={isDirty}
              theme={appTheme}
            />
            <main
              ref={mainRef}
              className={`flex-1 relative bg-background p-0 ${currentView === 'interface' ? 'overflow-hidden' : 'overflow-y-auto'}`}
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
                    isDirty={hasUnsavedTabChanges}
                    onSetDirty={setHasUnsavedTabChanges}
                    setConfirmationModal={setConfirmationModal}
                    closeConfirmationModal={closeConfirmationModal}
                    title={gameData.gameTitle || ''}
                    logo={gameData.gameLogo || ''}
                    omitSplashTitle={!!gameData.gameOmitSplashTitle}
                    omitSplashDescription={!!gameData.gameOmitSplashDescription}
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
                    gameBackgroundColor={gameData.gameBackgroundColor || '#0d1117'}
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
                    gameSuggestionsEmptyFeedback={gameData.gameSuggestionsEmptyFeedback}
                    gameInventoryEmptyFeedback={gameData.gameInventoryEmptyFeedback}
                    textAnimationType={gameData.gameTextAnimationType || 'fade'}
                    textSpeed={gameData.gameTextSpeed || 5}
                    textReadingFlow={gameData.gameTextReadingFlow || 'paused'}
                    imageTransitionType={gameData.gameImageTransitionType || 'fade'}
                    imageSpeed={gameData.gameImageSpeed || 5}
                    onNavigateToTrackers={() => handleSetView('trackers')}
                  />
                </Suspense>
              )}
              {currentView === 'welcome' ? (
                  <WelcomePlaceholder
                    onCreateScene={handleCreateNewProject}
                    onDownloadExample={handleDownloadExample}
                    onMeetProject={() => setCurrentView('about')}
                    onGuidePage={() => setCurrentView('guide')}
                    theme={appTheme}
                  />
              ) : currentView === 'guide' ? (
                <Suspense fallback={<LoadingOverlay message="Carregando Guia..." />}>
                  <GuideView />
                </Suspense>
              ) : null}

              {currentView === 'global_objects' && (
                <Suspense fallback={<LoadingOverlay message="Carregando Objetos..." />}>
                  <GlobalObjectsEditor
                    scenes={gameData.scenes}
                    globalObjects={gameData.globalObjects}
                    onUpdateObject={handleUpdateGlobalObject}
                    onDeleteObject={handleDeleteGlobalObject}
                    onCreateObject={handleCreateGlobalObject}
                    onSelectScene={handleSelectScene}
                    isDirty={hasUnsavedTabChanges}
                    onSetDirty={setHasUnsavedTabChanges}
                  />
                </Suspense>
              )}

              {currentView === 'three_panels' && (
                <div className="flex h-full w-full overflow-hidden relative">
                  {/* Painel Esquerdo: Mapa Narrativo (Área de trabalho visível) */}
                  <div className="flex-1 h-full min-w-0 overflow-hidden relative transition-all duration-300">
                    <Suspense fallback={<LoadingOverlay message="Carregando Mapa..." />}>
                      <SceneMap
                        key="three-panels-map"
                        allScenesMap={gameData.scenes || {}}
                        globalObjects={gameData.globalObjects || {}}
                        startSceneId={gameData.startScene || ''}
                        vignettes={gameData.vignettes || []}
                        onSelectScene={handleSelectScene}
                        onUpdateScenePosition={handleUpdateScenePosition}
                        onUpdateVignettePosition={handleUpdateVignettePosition}
                        onReorganizeScenes={handleReorganizeScenes}
                        gameInteractionType={gameData.gameInteractionType || 'parser'}
                        onAddNode={handleAddNodeType}
                        hasOpeningVignette={hasOpeningVignette}
                        isSidebarOpen={isNarrativeMenuOpen}
                        gameTitle={gameData.gameTitle}
                        isNarrativeMenuOpen={isNarrativeMenuOpen}
                        onToggleNarrative={() => setIsNarrativeMenuOpen(!isNarrativeMenuOpen)}
                        selectedSceneId={selectedSceneId}
                      />
                    </Suspense>
                  </div>

                  {/* Painel Direito: Navegador de Narrativas / Editor de Cena Contextual */}
                  <div 
                    className={`h-full bg-background border-l border-muted-foreground/50 shadow-[-10px_0_30px_rgba(0,0,0,0.3)] z-50 transition-all duration-300 overflow-hidden flex flex-col ${
                      isNarrativeMenuOpen 
                        ? 'w-1/3'
                        : selectedScene
                          ? isSidePanelExpanded ? 'w-[55.55%]' : 'w-1/3'
                          : 'w-0 border-l-0'
                    }`}
                  >
                    {(isNarrativeMenuOpen || selectedScene) && (
                       <div className="sticky top-0 z-[60] bg-background border-b border-muted-foreground/50 shadow-md px-4 py-4 flex justify-between items-center">
                           <div className="flex items-center gap-2">
                             <button
                               type="button"
                               onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 if (isNarrativeMenuOpen) {
                                   setIsNarrativeMenuOpen(false);
                                 } else {
                                   setIsNarrativeMenuOpen(true);
                                 }
                               }}
                               className={`flex items-center gap-2 px-1 py-1 transition-colors group relative z-50 ${isNarrativeMenuOpen ? 'text-primary' : 'text-zinc-400 hover:text-white'}`}
                               title={isNarrativeMenuOpen ? t('sidebar.hideNarrative', 'Ocultar lista de narrativas') : t('sidebar.showNarrative', 'Ver lista de narrativas')}
                             >
                               <List className={`w-4 h-4 transition-transform group-hover:scale-110 ${isNarrativeMenuOpen ? 'text-primary' : ''}`} />
                               <span className={`text-[10px] uppercase font-bold tracking-widest border-b border-transparent group-hover:border-current/30`}>
                                 {isNarrativeMenuOpen ? t('sidebar.hideNarrative', 'Ocultar lista de narrativas') : t('sidebar.showNarrative', 'Ver lista de narrativas')}
                               </span>
                             </button>
                           </div>
                           
                           <div className="flex items-center gap-2">
                               <button 
                                 onClick={() => {
                                   setIsNarrativeMenuOpen(false);
                                   setSelectedSceneId(null);
                                 }}
                                 className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground group"
                               >
                                 <X className="w-4 h-4 transition-transform group-hover:scale-110" />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">{t('common.close', 'Fechar')}</span>
                               </button>
                           </div>
                       </div>
                     )}

                    <div className="flex-1 overflow-y-auto">
                      {isNarrativeMenuOpen ? (
                        <div className="h-full flex flex-col pt-4 pb-2 transition-all">
                          <SceneList
                          scenes={scenesList}
                          startSceneId={gameData.startScene}
                          selectedSceneId={selectedSceneId}
                          onSelectScene={(id) => {
                            handleSelectScene(id);
                            setIsNarrativeMenuOpen(false);
                          }}
                          onAddScene={() => setIsNodeTypeModalOpen(true)}
                          onDeleteScene={handleDeleteScene}
                          onReorderScenes={handleReorderScenes}
                          isDirty={hasUnsavedTabChanges}
                          theme={appTheme}
                          currentView={currentView}
                          isLateralMenu={true}
                          onAddNode={handleAddNodeType}
                          hasOpeningVignette={hasOpeningVignette}
                          onViewMap={() => attemptNavigation({ type: 'view', view: 'map' })}
                          isNarrativeMenuOpen={isNarrativeMenuOpen}
                          onToggleNarrative={() => setIsNarrativeMenuOpen(!isNarrativeMenuOpen)}
                        />
                      </div>
                    ) : selectedScene ? (
                      <Suspense fallback={<LoadingOverlay message="Carregando Editor..." />}>
                        <SceneEditor
                          key={`side-editor-${selectedScene.id}`}
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
                          isDirty={hasUnsavedTabChanges}
                          onSetDirty={setHasUnsavedTabChanges}
                          layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
                          consequenceTrackers={consequenceTrackers}
                          isStartScene={selectedScene.id === gameData.startScene}
                          gameInteractionType={gameData.gameInteractionType || 'parser'}
                          vignettes={gameData.vignettes || []}
                          onViewMap={() => {}} // Redundant in three_panels
                          globalSplashButtonText={gameData.gameSplashButtonText || ''}
                          onUpdateGlobalSplashButtonText={(text) =>
                            handleUpdateGameData('gameSplashButtonText', text)
                          }
                          isSidePanel={true}
                          onClose={() => setSelectedSceneId(null)}
                          onTabChange={setSidePanelTab}
                          isNarrativeMenuOpen={isNarrativeMenuOpen}
                          onToggleNarrative={() => {
                            setIsNarrativeMenuOpen(true);
                          }}
                        />
                      </Suspense>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'trackers' && (
              <Suspense fallback={<LoadingOverlay message="Carregando Rastreadores..." />}>
                <TrackersEditor
                  trackers={consequenceTrackers}
                  onUpdateTrackers={handleUpdateTrackers}
                  allScenes={scenesList}
                  allTrackerIds={(gameData.consequenceTrackers || []).map((t) => t.id)}
                  isDirty={hasUnsavedTabChanges}
                  onSetDirty={setHasUnsavedTabChanges}
                  onSelectScene={handleSelectScene}
                  allObjects={gameData.globalObjects || {}}
                  setConfirmationModal={setConfirmationModal}
                  closeConfirmationModal={closeConfirmationModal}
                />
              </Suspense>
            )}

            {currentView === 'global_commands' && (
              <Suspense fallback={<LoadingOverlay message="Carregando Verbos..." />}>
                <GlobalCommandsEditor
                  fixedVerbs={gameData.fixedVerbs || []}
                  onUpdate={handleUpdateGameData}
                  isDirty={hasUnsavedTabChanges}
                  onSetDirty={setHasUnsavedTabChanges}
                  setConfirmationModal={setConfirmationModal}
                  closeConfirmationModal={closeConfirmationModal}
                />
              </Suspense>
            )}

            {currentView === 'settings' && <Settings hideHeader />}
            {currentView === 'about' && <AboutProject hideHeader />}
          </main>
        </div>
      </div>
    )}

            {showSaveModal && (
              <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-background border border-muted-foreground/50 rounded-lg shadow-xl w-[440px] max-w-[90vw] overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b border-muted-foreground/50 bg-muted/30">
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
                    <div className="relative">
                      <input
                        type="text"
                        value={saveFilename}
                        onChange={(e) => setSaveFilename(e.target.value)}
                        placeholder={t('editor.project_filename_placeholder', 'meu_jogo')}
                        className="w-full bg-input border border-input-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && saveFilename.trim()) {
                            handleConfirmSave();
                          }
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <button
                        type="button"
                        onClick={() => setSaveFormat('zip')}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                          saveFormat === 'zip'
                            ? 'border-primary bg-primary/10'
                            : 'border-muted-foreground/30 hover:border-muted-foreground/50'
                        }`}
                      >
                        <FileArchive className={`w-6 h-6 ${saveFormat === 'zip' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-bold ${saveFormat === 'zip' ? 'text-primary' : 'text-foreground'}`}>
                          {t('editor.exportFormatZip', 'Pacote ZIP')}
                        </span>
                        <span className="text-[10px] text-muted-foreground text-center leading-tight whitespace-pre-line">
                          {t('editor.exportFormatZipDesc', 'Arquivo mais leve,\nLoad mais demorado.')}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaveFormat('html')}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                          saveFormat === 'html'
                            ? 'border-primary bg-primary/10'
                            : 'border-muted-foreground/30 hover:border-muted-foreground/50'
                        }`}
                      >
                        <FileCode className={`w-6 h-6 ${saveFormat === 'html' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-bold ${saveFormat === 'html' ? 'text-primary' : 'text-foreground'}`}>
                          {t('editor.exportFormatHtml', 'HTML Único')}
                        </span>
                        <span className="text-[10px] text-muted-foreground text-center leading-tight whitespace-pre-line">
                          {t('editor.exportFormatHtmlDesc', 'Arquivo mais pesado,\nLoad mais rápido.')}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 p-4 border-t border-muted-foreground/50 bg-muted/30">
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

            {/* Hidden Single Import Input */}
            <input
              type="file"
              ref={importFileRef}
              className="hidden"
              accept=".json,.zip,.html,.htm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
                // Clear input so same file can be uploaded again if needed
                if (e.target) e.target.value = '';
              }}
            />

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
                <div className="bg-zinc-900 border border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center gap-6 animate-[pulse-glow-save_2s_ease-in-out_infinite] min-w-[300px]">
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
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={confirmationModal.onCancel}
        isDanger={confirmationModal.isDanger}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
      />

      <ConfirmationModal
        isOpen={pendingNavigation !== null}
        title={t('editor.unsavedChanges', 'Alterações não salvas')}
        message={t('editor.unsavedChangesMessage', 'Você tem alterações não salvas. Se sair agora, elas serão perdidas.\n\nDeseja continuar?')}
        onConfirm={() => {
          if (pendingNavigation) executeNavigation(pendingNavigation);
        }}
        onCancel={() => setPendingNavigation(null)}
        isDanger={true}
        confirmText={t('editor.confirmLeave', 'Sair sem salvar')}
        cancelText={t('editor.cancelLeave', 'Cancelar')}
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
        hasOpeningVignette={hasOpeningVignette}
      />
      <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </div>
  );
};

export default Editor;
