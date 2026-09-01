import React, { useState, useEffect, DragEvent, useRef, useMemo, memo } from 'react';
import {
  Scene,
  Interaction,
  Vignette,
  GameObject,
  ConsequenceTracker,
  Choice,
  DiceType,
} from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { initialGameData, OVERLAY_CSS } from '../lib/gameDefaults';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { generateUniqueId } from '../utils/helpers';
import { MAX_IMAGE_SIZE, MAX_AUDIO_SIZE } from '../constants';
import { useToast } from './ToastContext';
import ObjectEditor from './ObjectEditor';
import InteractionEditor from './InteractionEditor';
import { ErrorBoundary } from './ErrorBoundary';
import BranchingPreview from './BranchingPreview';
import ImageUploadField from './ui/ImageUploadField';
import SceneSelectOptions from './common/SceneSelectOptions';
import {
  Upload,
  Trash2,
  Plus,
  ArrowRight,
  Music,
  Image as ImageIcon,
  Flag,
  FileText,
  GitBranch,
  Copy,
  RotateCcw,
  Save,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Search,
  List,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  X,
  Hammer,
  ChevronDown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Columns3,
  Heart,
  SlidersHorizontal,
  Package,
  Hand,
  Dices,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTranslation, Trans } from 'react-i18next';
import RainOverlay from './effects/RainOverlay';
import BlurOverlay from './effects/BlurOverlay';
import ChromaticOverlay from './effects/ChromaticOverlay';
import TVOverlay from './effects/TVOverlay';
import ConfettiOverlay from './effects/ConfettiOverlay';
import GlitchOverlay from './effects/GlitchOverlay';
import NosferatuOverlay from './effects/NosferatuOverlay';
import WiggleOverlay from './effects/WiggleOverlay';
import FogOverlay from './effects/FogOverlay';

interface SceneEditorProps {
  scene: Scene;
  allScenes: Scene[];
  globalObjects: { [id: string]: GameObject };
  onUpdateScene: (scene: Scene) => void;
  onCopyScene: (scene: Scene) => void;
  onCreateGlobalObject: (obj: GameObject, linkToSceneId: string) => void;
  onLinkObjectToScene: (sceneId: string, objectId: string) => void;
  onUnlinkObjectFromScene: (sceneId: string, objectId: string) => void;
  onUpdateGlobalObject: (objectId: string, updatedData: Partial<GameObject>) => void;
  onPreviewScene: (scene: Scene) => void;
  onSelectScene: (id: string) => void;
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
  layoutOrientation: 'vertical' | 'horizontal';
  consequenceTrackers: ConsequenceTracker[];
  isStartScene: boolean;
  gameInteractionType: 'parser' | 'choice';
  vignettes: Vignette[];
  onViewMap?: () => void;
  enableChances: boolean;
  gameSystemEnabled?: 'none' | 'chances' | 'trackers';
  enableDiceRoll?: boolean;
  diceType?: DiceType;
  globalSplashButtonText?: string;
  onUpdateGlobalSplashButtonText?: (text: string) => void;
  isSidePanel?: boolean;
  onClose?: () => void;
  onTabChange?: (tab: 'properties' | 'objects' | 'dice' | 'interactions' | 'choices') => void;
  isNarrativeMenuOpen?: boolean;
  onToggleNarrative?: () => void;
}

const getCleanSceneState = (s: Scene): Scene => {
  return {
    ...s,
    isEndingScene: !!s.isEndingScene,
    removesChanceOnEntry: !!s.removesChanceOnEntry,
    restoresChanceOnEntry: !!s.restoresChanceOnEntry,
    allowDiceRollInScene: !!s.allowDiceRollInScene,
    diceRollConfig: s.diceRollConfig || {
      cutoffValue: 10,
      successVerb: 'sucesso_dado',
      successLabel: 'Sucesso',
      failureVerb: 'falha_dado',
      failureLabel: 'Falha',
    },
    objectIds: s.objectIds || [],
    interactions: s.interactions || [],
    choices: s.choices || [],
    isDefeatOutcome: !!s.isDefeatOutcome,
  };
};

export interface ConnectionDetail {
  scene: Scene;
  interactions: Interaction[];
}

const SceneEditor: React.FC<SceneEditorProps> = memo(
  ({
    scene,
    allScenes,
    globalObjects,
    onUpdateScene,
    onCopyScene,
    onCreateGlobalObject,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onLinkObjectToScene,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onUnlinkObjectFromScene,
    onUpdateGlobalObject,
    onPreviewScene,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSelectScene,
    isDirty,
    onSetDirty,
    layoutOrientation,
    consequenceTrackers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isStartScene,
    gameInteractionType,
    vignettes,
    onViewMap,
    enableChances,
    gameSystemEnabled,
    enableDiceRoll = false,
    diceType = 'd20',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    globalSplashButtonText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onUpdateGlobalSplashButtonText,
    isSidePanel,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onClose,
    onTabChange,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isNarrativeMenuOpen,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onToggleNarrative,
  }) => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const [localScene, setLocalScene] = useState<Scene>(() => getCleanSceneState(scene));
    const [pendingObjectUpdates, setPendingObjectUpdates] = useState<{
      [id: string]: Partial<GameObject>;
    }>({});
    const [activeTab, setActiveTab] = useState<
      'properties' | 'objects' | 'dice' | 'interactions' | 'choices'
    >('properties');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [choicesSearchQuery, setChoicesSearchQuery] = useState('');
    const [suggestionsInput, setSuggestionsInput] = useState('');
    const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});

    const toggleSection = (sectionKey: string) => {
      setCollapsedSections((prev) => ({
        ...prev,
        [sectionKey]: !prev[sectionKey],
      }));
    };

    const initialSceneJson = useRef(JSON.stringify(getCleanSceneState(scene)));

    // Reset local state when scene ID changes (switching scenes)
    useEffect(() => {
      const cleanScene = getCleanSceneState(scene);
      setLocalScene(cleanScene);
      setPendingObjectUpdates({});
      initialSceneJson.current = JSON.stringify(cleanScene);
      setActiveTab('properties');
      setSuggestionsInput(cleanScene.suggestions ? cleanScene.suggestions.join(', ') : '');
    }, [scene.id]);

    // Sync active tab with parent
    useEffect(() => {
      onTabChange?.(activeTab);
    }, [activeTab, onTabChange]);

    // Check for dirty state
    useEffect(() => {
      const isSceneDirty = JSON.stringify(localScene) !== initialSceneJson.current;
      const areObjectsDirty = Object.keys(pendingObjectUpdates).length > 0;
      onSetDirty(isSceneDirty || areObjectsDirty);
    }, [localScene, pendingObjectUpdates, onSetDirty]);

    // Sync initial state when scene prop updates content (e.g. after a save)
    useEffect(() => {
      const cleanSceneProp = getCleanSceneState(scene);
      // If the prop matches our current local state and no pending object updates, we are in sync
      if (
        JSON.stringify(cleanSceneProp) === JSON.stringify(localScene) &&
        Object.keys(pendingObjectUpdates).length === 0
      ) {
        initialSceneJson.current = JSON.stringify(cleanSceneProp);
        if (isDirty) {
          onSetDirty(false);
        }
      }
    }, [scene, localScene, pendingObjectUpdates, isDirty, onSetDirty]);

    // Merge global objects with pending updates
    const mergedGlobalObjects = useMemo(() => {
      const merged = { ...globalObjects };
      Object.keys(pendingObjectUpdates).forEach((id) => {
        if (merged[id]) {
          merged[id] = { ...merged[id], ...pendingObjectUpdates[id] };
        }
      });
      return merged;
    }, [globalObjects, pendingObjectUpdates]);

    // Construct the list of objects currently in this scene by ID lookup
    const currentSceneObjects = useMemo(() => {
      return (localScene.objectIds || []).map((id) => mergedGlobalObjects[id]).filter(Boolean);
    }, [localScene.objectIds, mergedGlobalObjects]);

    // MODIFICADO: Agora todos os objetos globais podem ser usados como requerimento de inventário
    const allAvailableInventoryObjects = useMemo(() => {
      return Object.values(mergedGlobalObjects);
    }, [mergedGlobalObjects]);

    // Connections logic removed as simpler preview is used in BranchingPreview component

    const updateLocalScene = <K extends keyof Scene>(key: K, value: Scene[K]) => {
      setLocalScene((prev) => ({ ...prev, [key]: value }));
    };

    const handleUpdateGlobalObjectLocal = (objectId: string, updatedData: Partial<GameObject>) => {
      setPendingObjectUpdates((prev) => ({
        ...prev,
        [objectId]: { ...(prev[objectId] || {}), ...updatedData },
      }));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCreateGlobalObjectWrapper = (obj: GameObject, linkToSceneId: string) => {
      onCreateGlobalObject(obj, '');
      setLocalScene((prev) => ({
        ...prev,
        objectIds: [...(prev.objectIds || []), obj.id],
      }));
    };

    const handleLinkObjectWrapper = (sceneId: string, objectId: string) => {
      setLocalScene((prev) => {
        if (prev.objectIds.includes(objectId)) return prev;
        return {
          ...prev,
          objectIds: [...prev.objectIds, objectId],
        };
      });
    };

    const handleUnlinkObjectWrapper = (sceneId: string, objectId: string) => {
      setLocalScene((prev) => ({
        ...prev,
        objectIds: prev.objectIds.filter((id) => id !== objectId),
      }));
    };

    const handleToggle = (
      key: 'isEndingScene' | 'removesChanceOnEntry' | 'restoresChanceOnEntry',
      value: boolean
    ) => {
      setLocalScene((prev) => {
        const newSceneState = { ...prev };
        if (value) {
          newSceneState.isEndingScene = false;
          newSceneState.removesChanceOnEntry = false;
          newSceneState.restoresChanceOnEntry = false;
        }
        newSceneState[key] = value;
        if (key === 'isEndingScene' && value) {
          newSceneState.objectIds = [];
          newSceneState.interactions = [];
        }
        return newSceneState;
      });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLocalScene('name', e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateLocalScene('description', e.target.value);
    };

    const handleSuggestionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setSuggestionsInput(e.target.value);
    };

    const handleSuggestionsBlur = () => {
      const suggestionsArray = suggestionsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '');
      updateLocalScene('suggestions', suggestionsArray);
      setSuggestionsInput(suggestionsArray.join(', '));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.size > MAX_IMAGE_SIZE) {
          toast(
            t('editor.imageLimitExceeded', {
              limit: MAX_IMAGE_SIZE / 1024 / 1024,
              defaultValue: `A imagem excede o limite de ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`,
            }),
            'error'
          );
          if (e.target) (e.target as HTMLInputElement).value = '';
          return;
        }

        import('../utils/imageOptimizer').then(({ compressImageToWebP }) => {
          compressImageToWebP(file)
            .then((optimizedBase64) => {
              updateLocalScene('image', optimizedBase64);
            })
            .catch((err) => {
              console.error('Failed to compress image:', err);
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                  updateLocalScene('image', event.target.result);
                }
              };
              reader.readAsDataURL(file);
            });
        });
      }
      if (e.target) {
        (e.target as HTMLInputElement).value = '';
      }
    };

    const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.size > MAX_AUDIO_SIZE) {
          toast(
            t('editor.audioLimitExceeded', {
              limit: MAX_AUDIO_SIZE / 1024 / 1024,
              defaultValue: `O áudio excede o limite de ${MAX_AUDIO_SIZE / 1024 / 1024} MB.`,
            }),
            'error'
          );
          if (e.target) (e.target as HTMLInputElement).value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            setLocalScene((prev) => ({
              ...prev,
              backgroundMusic: event.target?.result as string,
              backgroundMusicName: file.name,
            }));
          }
        };
        reader.readAsDataURL(file);
      }
      if (e.target) {
        (e.target as HTMLInputElement).value = '';
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.size > MAX_IMAGE_SIZE) {
          toast(
            t('editor.imageLimitExceeded', {
              limit: MAX_IMAGE_SIZE / 1024 / 1024,
              defaultValue: `A imagem excede o limite de ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`,
            }),
            'error'
          );
          return;
        }
        const event = {
          target: { files: e.dataTransfer.files },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleImageUpload(event);
      }
    };

    const handleSave = () => {
      Object.keys(pendingObjectUpdates).forEach((id) => {
        onUpdateGlobalObject(id, pendingObjectUpdates[id]);
      });
      setPendingObjectUpdates({});

      const finalScene: Scene = { ...localScene };
      finalScene.interactions = finalScene.interactions.map((interaction) => ({
        ...interaction,
        verbs: interaction.verbs.map((v) => v.trim().toLowerCase()).filter(Boolean),
      }));

      if (finalScene.isEndingScene) {
        finalScene.objectIds = [];
        finalScene.interactions = [];
      }
      onUpdateScene(finalScene);
    };

    const handleUndo = () => {
      const restoredScene = JSON.parse(initialSceneJson.current) as Scene;
      setLocalScene(restoredScene);
      setPendingObjectUpdates({});
    };

    const handlePreview = () => {
      onPreviewScene(localScene);
    };

    const TABS = useMemo(() => {
      if (gameInteractionType === 'choice') {
        return {
          properties: t('sceneEditor.tabs.properties'),
          choices: t('sceneEditor.tabs.choices'),
        };
      }
      const tabsObj: Record<string, string> = {
        properties: t('sceneEditor.tabs.properties'),
        objects: t('sceneEditor.tabs.objects'),
      };

      if (enableDiceRoll && localScene.allowDiceRollInScene) {
        tabsObj.dice = 'Dados';
      }

      tabsObj.interactions = t('sceneEditor.tabs.interactions');
      return tabsObj;
    }, [gameInteractionType, enableDiceRoll, localScene.allowDiceRollInScene, t]);

    const isAnyCheckboxChecked =
      !!localScene.isEndingScene ||
      !!localScene.removesChanceOnEntry ||
      !!localScene.restoresChanceOnEntry;

    const isVignetteMode = localScene.vignetteType && localScene.vignetteType !== 'none';
    const showTabs = !isVignetteMode;
    const copyLabel = t('sceneEditor.copyBtn', 'Copiar');

    return (
      <div className={`flex flex-col ${isSidePanel ? 'h-full overflow-hidden' : 'pb-8 px-4'}`}>
        <div className={`sticky top-0 z-40 bg-background flex flex-col ${
          isSidePanel && isVignetteMode
            ? 'h-0 overflow-hidden pt-0 pb-0 gap-0 border-b-0 shadow-none pointer-events-none'
            : isSidePanel
              ? `pt-4 pb-0 gap-3 px-4 shadow-md ${!showTabs ? 'border-b border-muted-foreground/30' : ''}`
              : `pt-4 pb-4 gap-3 -mx-4 px-4 shadow-sm ${!showTabs ? 'border-b border-muted-foreground/50' : ''}`
        }`}>
          {/* Solid background shield to perfectly hide scrolled content */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-background pointer-events-none" />
          
          {!isSidePanel && (
            <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-muted-foreground/50 shadow-sm relative z-10">
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <p className="text-muted-foreground text-xs font-medium truncate max-w-[150px] lg:max-w-none">
                  {t('sceneEditor.headerDesc')}
                </p>
                
                <div className="flex items-center gap-2 flex-1 max-w-[320px] animate-in fade-in slide-in-from-left-2 duration-300">
                  <button
                    onClick={handlePreview}
                    className="flex-1 max-w-[160px] min-w-[40px] flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-primary border border-muted-foreground/50 hover:border-primary rounded-lg whitespace-nowrap"
                    title={t('sceneEditor.testTooltip')}
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline-block">{t('sceneEditor.testBtn')}</span>
                  </button>

                  <button
                    onClick={() => onCopyScene(localScene)}
                    className="flex-1 max-w-[160px] min-w-[40px] flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-primary border border-muted-foreground/50 hover:border-primary rounded-lg whitespace-nowrap"
                    title={t('sceneEditor.copyTooltip')}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline-block">{copyLabel}</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-1 max-w-[300px] justify-end ml-4">
                {isDirty && (
                  <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mr-1 whitespace-nowrap overflow-hidden">
                    <span className="hidden lg:inline">{t('sceneEditor.unsavedChanges')}</span>
                  </div>
                )}

                <button
                  onClick={handleUndo}
                  disabled={!isDirty}
                  className="flex-1 max-w-[140px] min-w-[40px] flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors bg-zinc-800/50 hover:bg-zinc-800 border border-muted-foreground/50 rounded-lg whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline-block truncate">{t('sceneEditor.undoBtn')}</span>
                </button>

                <button
                  onClick={handleSave}
                  disabled={!isDirty}
                  className="flex-1 max-w-[140px] min-w-[40px] flex items-center justify-center gap-1.5 px-2 py-1.5 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline-block truncate">{t('globalObjectsEditor.saveBtn', 'Salvar')}</span>
                </button>
              </div>
            </div>

          )}

          {!isVignetteMode && (
            <div className="border-b border-muted-foreground/50 flex items-center justify-between -mx-4 px-4">
              <div className="flex space-x-1 overflow-x-auto">
                {Object.entries(TABS).map(([key, name]) => {
                  const isVignette = localScene.vignetteType && localScene.vignetteType !== 'none';
                  const isTabDisabled =
                    (localScene.isEndingScene || isVignette) &&
                    (key === 'objects' || key === 'interactions');

                  const getTabIcon = (tabKey: string) => {
                    switch (tabKey) {
                      case 'properties':
                        return <SlidersHorizontal className="w-3.5 h-3.5" />;
                      case 'objects':
                        return <Package className="w-3.5 h-3.5" />;
                      case 'dice':
                        return <Dices className="w-3.5 h-3.5" />;
                      case 'interactions':
                        return <Hand className="w-3.5 h-3.5" />;
                      case 'choices':
                        return <GitBranch className="w-3.5 h-3.5" />;
                      default:
                        return null;
                    }
                  };

                  return (
                    <button
                      key={key}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onClick={() => !isTabDisabled && setActiveTab(key as any)}
                      disabled={isTabDisabled}
                      className={`py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 justify-center ${
                        isSidePanel ? 'px-4' : 'px-6'
                      } ${activeTab === key
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'text-muted-foreground hover:bg-primary/25 hover:text-white'
                        } ${isTabDisabled ? 'opacity-30 cursor-not-allowed' : ''} `}
                    >
                      {getTabIcon(key)}
                      <span>{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className={`relative flex-1 flex flex-col h-full min-h-0 ${isSidePanel && !['objects', 'interactions', 'choices'].includes(activeTab) ? 'overflow-y-auto pt-6 px-4 pb-28' : isSidePanel ? 'pt-0' : 'pt-4'}`}>
          <div className="bg-background flex flex-col flex-1 h-full min-h-0">
            {activeTab === 'properties' && (
              <div key={localScene.id} className={`grid grid-cols-1 ${isSidePanel ? 'gap-6' : 'md:grid-cols-2 gap-8'}`}>
                {/* Left Column: Details & Rules */}
                <div className="flex flex-col">
                  {/* Scene Details Card */}
                  <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
                    <div
                      className={`flex items-center justify-between cursor-pointer select-none group ${
                        collapsedSections.details ? 'mb-0' : 'mb-4'
                      }`}
                      onClick={() => toggleSection('details')}
                    >
                      <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                        <FileText className="w-4 h-4" />
                        {isVignetteMode
                          ? t('sceneEditor.vignetteNarrativeTitle', 'Detalhes do Capítulo')
                          : t('sceneEditor.narrativeTitle')}
                      </h3>
                      <div className="p-1 rounded hover:bg-muted/50 transition-colors">
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                            collapsedSections.details ? '-rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {!collapsedSections.details && (
                      <div className="space-y-4 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                        {isVignetteMode && localScene.vignetteType !== 'opening' && (
                          <div className="mb-6">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                              {t('sceneEditor.roleLabel', 'NATUREZA DO CAPÍTULO')}
                            </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              {
                                id: 'transition',
                                label: t('sceneEditor.vignetteTypes.transition'),
                                icon: ArrowRight,
                              },
                              {
                                id: 'conclusion',
                                label: t('sceneEditor.vignetteTypes.conclusion'),
                                icon: Flag,
                              },
                            ].map((type) => {
                              return (
                                <button
                                  key={type.id}
                                  onClick={() => {
                                    if (localScene.vignetteType !== type.id) {
                                      const updates: Partial<Scene> = {
                                        vignetteType: type.id as 'opening' | 'transition' | 'conclusion'
                                      };

                                      if (type.id === 'conclusion' && localScene.name.startsWith(t('editor.newVignetteNamePrefix', 'Capítulo #'))) {
                                        updates.name = t('editor.newConclusionVignetteName', 'Conclusão');
                                      }

                                      setLocalScene((prev) => ({ ...prev, ...updates }));
                                    }
                                  }}
                                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${localScene.vignetteType === type.id
                                      ? 'bg-primary/20 border-primary text-primary'
                                      : 'bg-muted/30 border-muted-foreground/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                  <type.icon className="w-4 h-4" />
                                  <span className="text-[10px] font-bold uppercase">
                                    {type.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label
                            htmlFor="sceneName"
                            className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5"
                          >
                            {t('sceneEditor.titleLabel')}
                          </label>
                          <input
                            type="text"
                            id="sceneName"
                            value={localScene.name}
                            onChange={handleNameChange}
                            className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
                            placeholder={t('sceneEditor.titlePlaceholder')}
                          />
                        </div>
                        <div className="col-span-1">
                          <label
                            htmlFor="sceneId"
                            className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5"
                          >
                            {t('sceneEditor.uniqueIdLabel')}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={localScene.id}
                              disabled
                              className="w-full bg-muted/50 border border-input rounded-lg px-3 py-2.5 text-xs text-muted-foreground font-mono"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 text-[10px]">
                              #
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col">
                        <div className="flex justify-between items-center mb-1.5">
                          <label
                            htmlFor="sceneDescription"
                            className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                          >
                            {localScene.isEndingScene
                              ? t('sceneEditor.endingMessage')
                              : t('sceneEditor.description')}
                          </label>
                          {!isVignetteMode && (
                            <span className="text-[9px] text-muted-foreground font-medium tracking-wider">
                              {t('sceneEditor.highlightTip')}
                            </span>
                          )}
                        </div>
                        <div className="relative flex flex-col">
                          <textarea
                            id="sceneDescription"
                            value={localScene.description}
                            onChange={handleDescriptionChange}
                            className="w-full min-h-[192px] bg-input border border-input rounded-lg px-4 py-3 text-xs text-foreground resize-y focus:ring-1 focus:ring-primary focus:border-primary transition-all leading-relaxed placeholder:text-muted-foreground"
                            placeholder={t('sceneEditor.descPlaceholder')}
                          />

                          {gameInteractionType !== 'choice' && !isVignetteMode && (
                            <div className="pt-4 mt-4">
                              <div className="flex justify-between items-center mb-1.5">
                                <label
                                  htmlFor="sceneSuggestions"
                                  className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                                >
                                  {t('sceneEditor.suggestionsLabel', 'SUGESTÕES')}
                                </label>
                                <span className="text-[9px] text-muted-foreground font-medium tracking-wider">
                                  {t('sceneEditor.suggestionsHint', 'Use vírgula para separar')}
                                </span>
                              </div>
                              <textarea
                                id="sceneSuggestions"
                                value={suggestionsInput}
                                onChange={handleSuggestionsChange}
                                onBlur={handleSuggestionsBlur}
                                className="w-full h-16 bg-input border border-input rounded-lg px-4 py-3 text-xs text-foreground resize-y focus:ring-1 focus:ring-primary focus:border-primary transition-all leading-relaxed placeholder:text-muted-foreground"
                                placeholder={t(
                                  'sceneEditor.suggestionsPlaceholder',
                                  'Ex: examinar, pegar, usar, falar'
                                )}
                              />
                            </div>
                          )}

                          {gameInteractionType !== 'choice' && !isVignetteMode && (
                            <div className="pt-4 mt-4">
                              <div className="flex justify-between items-center mb-1.5">
                                <label
                                  htmlFor="sceneNegativeFeedback"
                                  className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                                >
                                  {t('sceneEditor.negativeFeedbackLabel', 'FEEDBACK NEGATIVO')}
                                </label>
                                <span className="text-[9px] text-muted-foreground font-medium tracking-wider">
                                  {t('sceneEditor.negativeFeedbackHint', 'Deixe em branco para o padrão global')}
                                </span>
                              </div>
                              <textarea
                                id="sceneNegativeFeedback"
                                value={localScene.negativeFeedback || ''}
                                onChange={(e) => updateLocalScene('negativeFeedback', e.target.value)}
                                className="w-full h-16 bg-input border border-input rounded-lg px-4 py-3 text-xs text-foreground resize-y focus:ring-1 focus:ring-primary focus:border-primary transition-all leading-relaxed placeholder:text-muted-foreground"
                                placeholder={t(
                                  'sceneEditor.negativeFeedbackPlaceholder',
                                  'Isso não parece ter nenhum efeito.'
                                )}
                              />
                            </div>
                          )}

                          {enableDiceRoll && !isVignetteMode && (
                            <div className="mt-4">
                              <label className="flex items-center gap-3 cursor-pointer select-none group p-3 bg-muted/20 hover:bg-muted/40 border border-border rounded-lg transition-colors">
                                <input
                                  type="checkbox"
                                  checked={localScene.allowDiceRollInScene || false}
                                  onChange={(e) => updateLocalScene('allowDiceRollInScene', e.target.checked)}
                                  className="custom-checkbox shrink-0"
                                />
                                <div>
                                  <span className="block text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Dices className="w-3.5 h-3.5 text-primary" />
                                    Permitir rolagem de dados nesta ramificação
                                  </span>
                                  <span className="block text-[9px] text-muted-foreground mt-0.5">
                                    Habilita a aba "Dados" para definir nota de corte e verbos de resultado nesta cena.
                                  </span>
                                </div>
                              </label>
                            </div>
                          )}

                          {isVignetteMode && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 flex flex-col gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                  {t('sceneEditor.buttonTextLabel')}
                                </label>
                                <input
                                  type="text"
                                  value={localScene.vignetteButtonText || ''}
                                  onChange={(e) =>
                                    updateLocalScene('vignetteButtonText', e.target.value)
                                  }
                                  placeholder={
                                    localScene.vignetteType === 'conclusion'
                                      ? t('sceneEditor.restart', 'Reiniciar')
                                      : t('UIEditor.textos.splashButtonPlaceholder', 'Iniciar')
                                  }
                                  className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                                />
                              </div>

                              {localScene.vignetteType === 'conclusion' && (
                                <label className="flex items-center gap-2 cursor-pointer p-2 rounded border border-muted-foreground/50 bg-muted/30 hover:bg-muted/50 transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={!!localScene.isDefeatOutcome}
                                    onChange={(e) =>
                                      updateLocalScene('isDefeatOutcome', e.target.checked)
                                    }
                                    className="custom-checkbox"
                                  />
                                  <div>
                                    <span className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                                      {t('sceneEditor.negativeOutcome')}
                                    </span>
                                    <span className="block text-[9px] text-muted-foreground">
                                      {t('sceneEditor.negativeOutcomeDesc')}
                                    </span>
                                  </div>
                                </label>
                              )}

                              {localScene.vignetteType !== 'conclusion' && (
                                <div>
                                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                    {t('sceneEditor.goToLabel')}
                                  </label>
                                  <select
                                    value={localScene.vignetteNextSceneId || ''}
                                    onChange={(e) =>
                                      updateLocalScene('vignetteNextSceneId', e.target.value)
                                    }
                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary transition-all [&>option]:bg-card [&>optgroup]:bg-card [&>optgroup]:font-bold [&>optgroup]:text-muted-foreground"
                                  >
                                    <option value="">{t('sceneEditor.justClose')}</option>
                                    <option value="END_GAME">{t('sceneEditor.endGame')}</option>
                                    <SceneSelectOptions
                                      allScenes={allScenes}
                                      excludeSceneId={localScene.id}
                                      showId={true}
                                    />
                                  </select>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  </div>

                  {/* Multimedia Card (Only when side panel - moved here to be below details) */}
                  {isSidePanel && (
                    <div className="pt-4 border-t border-muted-foreground/50 mt-4 -mx-4 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                      <div
                        className={`flex justify-between items-center cursor-pointer select-none group ${
                          collapsedSections.multimedia ? 'mb-0' : 'mb-4'
                        }`}
                        onClick={() => toggleSection('multimedia')}
                      >
                        <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                          <ImageIcon className="w-4 h-4" />
                          {t('sceneEditor.multimediaTitle')}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground">
                            {layoutOrientation === 'vertical'
                              ? t('sceneEditor.suggestedResVertical')
                              : t('sceneEditor.suggestedResHorizontal')}
                          </span>
                          <div className="p-1 rounded hover:bg-muted/50 transition-colors">
                            <ChevronDown
                              className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                                collapsedSections.multimedia ? '-rotate-90' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {!collapsedSections.multimedia && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden border border-muted-foreground/50 group mb-6">
                            <style>{OVERLAY_CSS}</style>
                            <ImageUploadField
                              value={localScene.image}
                              onChange={(img) => updateLocalScene('image', img)}
                              id="image-upload-input-side"
                            >
                              <div
                                className={`scene-overlay ${localScene.overlayEffect ? 'overlay-' + localScene.overlayEffect : ''}`}
                                style={{ zIndex: 10 }}
                              ></div>
                              {localScene.overlayEffect === 'rain' && <RainOverlay />}
                              {localScene.overlayEffect === 'blur' && <BlurOverlay />}
                              {localScene.overlayEffect === 'chromatic' && <ChromaticOverlay />}
                              {localScene.overlayEffect === 'tv' && <TVOverlay />}
                              {localScene.overlayEffect === 'confetti' && <ConfettiOverlay />}
                              {localScene.overlayEffect === 'glitch' && <GlitchOverlay />}
                              {localScene.overlayEffect === 'nosferatu' && <NosferatuOverlay />}
                              {localScene.overlayEffect === 'wiggle' && <WiggleOverlay />}
                              {localScene.overlayEffect === 'fog' && (
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none' }}>
                                  <FogOverlay />
                                </div>
                              )}
                            </ImageUploadField>
                          </div>

                          <div className="space-y-2 mb-4">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{t('sceneEditor.overlayLabel')}</label>
                            <select
                              value={localScene.overlayEffect || ''}
                              onChange={(e) => updateLocalScene('overlayEffect', e.target.value)}
                              className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary transition-all [&>option]:bg-card"
                            >
                              <option value="">{t('sceneEditor.effects.none')}</option>
                              <option value="grain">{t('sceneEditor.effects.grain')}</option>
                              <option value="rain">{t('sceneEditor.effects.rain')}</option>
                              <option value="blur">{t('sceneEditor.effects.blur')}</option>
                              <option value="chromatic">{t('sceneEditor.effects.chromatic')}</option>
                              <option value="tv">{t('sceneEditor.effects.tv')}</option>
                              <option value="confetti">{t('sceneEditor.effects.confetti')}</option>
                              <option value="glitch">{t('sceneEditor.effects.glitch')}</option>
                              <option value="nosferatu">{t('sceneEditor.effects.nosferatu')}</option>
                              <option value="wiggle">{t('sceneEditor.effects.wiggle')}</option>
                              <option value="fog">{t('sceneEditor.effects.fog')}</option>
                            </select>
                          </div>

                          {localScene.vignetteType !== 'opening' && (
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('sceneEditor.audioLabel')}</label>
                              <div className="flex items-center gap-3 p-3 bg-muted/30 border border-dashed border-input rounded-lg hover:border-primary/50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-background border border-muted-foreground/50 flex items-center justify-center flex-shrink-0">
                                  <Music className={`w-4 h-4 ${localScene.backgroundMusic ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                                <div className="flex-grow min-w-0">
                                  {localScene.backgroundMusic ? (
                                    <div className="flex flex-col">
                                      <span className="text-xs text-foreground truncate">{t('sceneEditor.customAudioSet')}</span>
                                      <span className="text-[10px] text-green-500 truncate">{localScene.backgroundMusicName || t('sceneEditor.audioLoaded')}</span>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col">
                                      <span className="text-xs text-muted-foreground italic">{t('sceneEditor.noAudio')}</span>
                                      <span className="text-[9px] text-muted-foreground/60">{t('sceneEditor.leaveEmptyAudio')}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-shrink-0">
                                  {localScene.backgroundMusic ? (
                                    <button onClick={() => setLocalScene(prev => ({ ...prev, backgroundMusic: undefined, backgroundMusicName: undefined }))} className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded transition-all">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <label htmlFor="music-upload-side" className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer transition-colors border border-primary">
                                      {t('sceneEditor.loadBtn')}
                                      <input id="music-upload-side" type="file" accept="audio/*,.mpeg,.mpg,.mp3,.wav,.ogg,.m4a,.aac,.flac" onChange={handleMusicUpload} className="hidden" />
                                    </label>
                                  )}
                                </div>
                              </div>
                              {/* Checkbox to stop background music on entry */}
                              <label className="flex items-center gap-2.5 mt-3 cursor-pointer group select-none">
                                <input
                                  type="checkbox"
                                  className="custom-checkbox"
                                  checked={!!localScene.stopBackgroundMusic}
                                  onChange={(e) =>
                                    setLocalScene((prev) => ({
                                      ...prev,
                                      stopBackgroundMusic: e.target.checked,
                                    }))
                                  }
                                />
                                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                                  {t('sceneEditor.stopBackgroundMusicLabel', 'Interromper trilha em andamento')}
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Narrative Rules Card */}
                  {(enableChances || gameSystemEnabled === 'chances') && localScene.vignetteType !== 'conclusion' && (
                    <div className="pt-4 border-t border-muted-foreground/50 mt-4 -mx-4 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '300ms' }}>
                      <div
                        className={`flex justify-between items-center cursor-pointer select-none group ${
                          collapsedSections.chances ? 'mb-0' : 'mb-4'
                        }`}
                        onClick={() => toggleSection('chances')}
                      >
                        <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                          <Heart className="w-4 h-4" />
                          {t('sceneEditor.chancesTitle')}
                        </h3>
                        <div className="p-1 rounded hover:bg-muted/50 transition-colors">
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                              collapsedSections.chances ? '-rotate-90' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {!collapsedSections.chances && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                          {/* Chance Removal */}
                          <label
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${localScene.removesChanceOnEntry ? 'bg-red-500/5 border-red-500/30' : 'bg-transparent border-muted-foreground/50 hover:bg-muted/10'} `}
                          >
                            <div className="relative flex items-center mt-0.5">
                              <input
                                type="checkbox"
                                checked={!!localScene.removesChanceOnEntry}
                                onChange={(e) =>
                                  handleToggle('removesChanceOnEntry', e.target.checked)
                                }
                                className="custom-checkbox"
                                disabled={isAnyCheckboxChecked && !localScene.removesChanceOnEntry}
                              />
                            </div>
                            <div>
                              <span
                                className={`block text-xs font-bold ${localScene.removesChanceOnEntry ? 'text-red-500' : 'text-muted-foreground group-hover:text-foreground'} `}
                              >
                                {t('sceneEditor.removesChance')}
                              </span>
                              <span className="block text-[10px] text-muted-foreground mt-0.5">
                                {t('sceneEditor.removesChanceDesc')}
                              </span>
                            </div>
                          </label>

                          {/* Chance Restoration */}
                          <label
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${localScene.restoresChanceOnEntry ? 'bg-green-500/5 border-green-500/30' : 'bg-transparent border-muted-foreground/50 hover:bg-muted/10'} `}
                          >
                            <div className="relative flex items-center mt-0.5">
                              <input
                                type="checkbox"
                                checked={!!localScene.restoresChanceOnEntry}
                                onChange={(e) =>
                                  handleToggle('restoresChanceOnEntry', e.target.checked)
                                }
                                className="custom-checkbox"
                                disabled={isAnyCheckboxChecked && !localScene.restoresChanceOnEntry}
                              />
                            </div>
                            <div>
                              <span
                                className={`block text-xs font-bold ${localScene.restoresChanceOnEntry ? 'text-green-500' : 'text-muted-foreground group-hover:text-foreground'} `}
                              >
                                {t('sceneEditor.restoresChance')}
                              </span>
                              <span className="block text-[10px] text-muted-foreground mt-0.5">
                                {t('sceneEditor.restoresChanceDesc')}
                              </span>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Credits Card - Only for Conclusion Vignettes */}
                  {localScene.vignetteType === 'conclusion' && (
                    <div className="pt-4 border-t border-muted-foreground/50 mt-4 -mx-4 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '300ms' }}>
                      <div
                        className={`flex justify-between items-center cursor-pointer select-none group ${
                          collapsedSections.credits ? 'mb-0' : 'mb-4'
                        }`}
                        onClick={() => toggleSection('credits')}
                      >
                        <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                          <List className="w-4 h-4" />
                          {t('sceneEditor.creditsTitle', 'Créditos')}
                        </h3>
                        <div className="p-1 rounded hover:bg-muted/50 transition-colors">
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                              collapsedSections.credits ? '-rotate-90' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {!collapsedSections.credits && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div>
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                              {t('sceneEditor.creditsTitle', 'Créditos')}
                            </label>
                            <textarea
                              value={localScene.creditsText || ''}
                              onChange={(e) => updateLocalScene('creditsText', e.target.value)}
                              className="w-full min-h-[120px] bg-input border border-input rounded-lg px-4 py-3 text-xs text-foreground resize-y focus:ring-1 focus:ring-primary focus:border-primary transition-all leading-relaxed placeholder:text-muted-foreground"
                              placeholder={t('sceneEditor.creditsPlaceholder', 'Texto dos créditos...')}
                            />
                          </div>
                          <label className="flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group bg-transparent border-muted-foreground/50 hover:bg-muted/10">
                            <div className="relative flex items-center mt-0.5">
                              <input
                                type="checkbox"
                                checked={!!localScene.creditsScrollEnabled}
                                onChange={(e) => updateLocalScene('creditsScrollEnabled', e.target.checked)}
                                className="custom-checkbox"
                              />
                            </div>
                            <div>
                              <span className={`block text-xs font-bold ${localScene.creditsScrollEnabled ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                {t('sceneEditor.creditsScrollLabel', 'Animação de rolagem')}
                              </span>
                              <span className="block text-[10px] text-muted-foreground mt-0.5">
                                {t('sceneEditor.creditsScrollDesc', 'Habilita a subida automática do texto.')}
                              </span>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Multimedia & Connections */}
                <div className="space-y-6">
                  {/* Multimedia Card (Only when NOT side panel) */}
                  {!isSidePanel && (
                    <div className="pt-4 border-t border-muted-foreground/50 mt-4 -mx-4 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                      <div
                        className="flex justify-between items-center mb-4 cursor-pointer select-none group"
                        onClick={() => toggleSection('multimedia')}
                      >
                        <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                          <ImageIcon className="w-4 h-4" />
                          {t('sceneEditor.multimediaTitle')}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground">
                            {layoutOrientation === 'vertical'
                              ? t('sceneEditor.suggestedResVertical')
                              : t('sceneEditor.suggestedResHorizontal')}
                          </span>
                          <div className="p-1 rounded hover:bg-muted/50 transition-colors">
                            <ChevronDown
                              className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                                collapsedSections.connections ? '-rotate-90' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {!collapsedSections.connections && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                          <BranchingPreview currentScene={localScene} allScenes={allScenes} />

                          <p className="text-[10px] text-zinc-500 text-center mt-3">
                            {t('sceneEditor.connectionsDesc')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'objects' && (
              <div key={localScene.id} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ObjectEditor
                  sceneId={localScene.id}
                  objects={currentSceneObjects}
                  allGlobalObjects={Object.values(mergedGlobalObjects)}
                  onCreateGlobalObject={handleCreateGlobalObjectWrapper}
                  onLinkObject={handleLinkObjectWrapper}
                  onUnlinkObject={handleUnlinkObjectWrapper}
                  onUpdateGlobalObject={handleUpdateGlobalObjectLocal}
                  isSidePanel={isSidePanel}
                />
              </div>
            )}

            {activeTab === 'dice' && (() => {
              const maxDiceVal = diceType === 'd6' ? 6 : 20;
              const currentCutoff = localScene.diceRollConfig?.cutoffValue || (diceType === 'd6' ? 4 : 10);
              const cutoffPercent = ((currentCutoff - 1) / (maxDiceVal - 1)) * 100;

              return (
                <div key={localScene.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Texto descritivo limpo */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Configure os valores e verbos para a rolagem de dados.
                  </p>

                  {/* Seção 1: Corte dos resultados */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                      <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                      CORTE DOS RESULTADOS
                    </h3>

                    <div className="pt-2 pb-6">
                      <div className="relative flex items-center gap-3">
                        <span className="text-xs font-bold text-foreground font-mono w-4 text-right shrink-0">1</span>
                        <div className="relative flex-1 flex items-center">
                          <input
                            type="range"
                            min={1}
                            max={maxDiceVal}
                            step={1}
                            value={currentCutoff}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateLocalScene('diceRollConfig', {
                                ...(localScene.diceRollConfig || {
                                  cutoffValue: 10,
                                  successVerb: 'sucesso_dado',
                                  successLabel: 'Sucesso',
                                  failureVerb: 'falha_dado',
                                  failureLabel: 'Falha',
                                }),
                                cutoffValue: val,
                              });
                            }}
                            style={{
                              background: `linear-gradient(to right, var(--primary) ${cutoffPercent}%, rgba(255,255,255,0.1) ${cutoffPercent}%)`
                            }}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md transition-all"
                          />
                          {/* Número do valor de corte posicionado logo abaixo do círculo do slider */}
                          <div
                            style={{
                              left: `calc(${cutoffPercent}% + ${8 - cutoffPercent * 0.16}px)`,
                              fontWeight: 900,
                              fontSize: '1.25rem'
                            }}
                            className="absolute top-full -translate-x-1/2 pt-1 text-primary pointer-events-none tracking-tight"
                          >
                            {currentCutoff}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-foreground font-mono w-6 shrink-0">{maxDiceVal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seção 2: Resultado de Sucesso (Empilhado) */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Sucesso (valores maiores que {currentCutoff - 1})
                    </h3>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        VERBO ASSOCIADO
                      </label>
                      <input
                        type="text"
                        value={localScene.diceRollConfig?.successVerb || 'sucesso_dado'}
                        onChange={(e) =>
                          updateLocalScene('diceRollConfig', {
                            ...(localScene.diceRollConfig || {
                              cutoffValue: 10,
                              successVerb: 'sucesso_dado',
                              successLabel: 'Sucesso',
                              failureVerb: 'falha_dado',
                              failureLabel: 'Falha',
                            }),
                            successVerb: e.target.value.trim().toLowerCase(),
                          })
                        }
                        placeholder="Ex: sucesso_dado"
                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground font-mono font-bold focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        TEXTO DE SUCESSO
                      </label>
                      <input
                        type="text"
                        value={localScene.diceRollConfig?.successText ?? 'Sucesso!'}
                        onChange={(e) =>
                          updateLocalScene('diceRollConfig', {
                            ...(localScene.diceRollConfig || {
                              cutoffValue: 10,
                              successVerb: 'sucesso_dado',
                              successLabel: 'Sucesso',
                              failureVerb: 'falha_dado',
                              failureLabel: 'Falha',
                            }),
                            successText: e.target.value,
                          })
                        }
                        placeholder="Ex: Sucesso!"
                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground font-bold focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Seção 3: Resultado de Falha (Empilhado) */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                      <XCircle className="w-4 h-4 text-red-400" />
                      Falha (valores menores que {currentCutoff})
                    </h3>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        VERBO ASSOCIADO
                      </label>
                      <input
                        type="text"
                        value={localScene.diceRollConfig?.failureVerb || 'falha_dado'}
                        onChange={(e) =>
                          updateLocalScene('diceRollConfig', {
                            ...(localScene.diceRollConfig || {
                              cutoffValue: 10,
                              successVerb: 'sucesso_dado',
                              successLabel: 'Sucesso',
                              failureVerb: 'falha_dado',
                              failureLabel: 'Falha',
                            }),
                            failureVerb: e.target.value.trim().toLowerCase(),
                          })
                        }
                        placeholder="Ex: falha_dado"
                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground font-mono font-bold focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        TEXTO DE FALHA
                      </label>
                      <input
                        type="text"
                        value={localScene.diceRollConfig?.failureText ?? 'Falha!'}
                        onChange={(e) =>
                          updateLocalScene('diceRollConfig', {
                            ...(localScene.diceRollConfig || {
                              cutoffValue: 10,
                              successVerb: 'sucesso_dado',
                              successLabel: 'Sucesso',
                              failureVerb: 'falha_dado',
                              failureLabel: 'Falha',
                            }),
                            failureText: e.target.value,
                          })
                        }
                        placeholder="Ex: Falha!"
                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground font-bold focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTab === 'interactions' && (
              <div key={localScene?.id || 'interactions-panel'} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ErrorBoundary fallbackTitle="Erro ao carregar o Editor de Interações">
                  <InteractionEditor
                    interactions={localScene?.interactions || []}
                    onUpdateInteractions={(interactions) =>
                      updateLocalScene('interactions', interactions)
                    }
                    allScenes={allScenes || []}
                    currentSceneId={localScene?.id || ''}
                    sceneObjects={currentSceneObjects || []}
                    allTakableObjects={allAvailableInventoryObjects || []}
                    consequenceTrackers={consequenceTrackers || []}
                    vignettes={vignettes || []}
                    isSidePanel={isSidePanel}
                    enableDiceRoll={enableDiceRoll}
                    diceType={diceType}
                    diceRollConfig={localScene.allowDiceRollInScene ? localScene.diceRollConfig : undefined}
                  />
                </ErrorBoundary>
              </div>
            )}

            {activeTab === 'choices' && (
              <div key={localScene.id} className="flex-1 overflow-y-auto pt-4 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="max-w-4xl mx-auto space-y-6">
                  <button
                    onClick={() => {
                      const newId = `choice_${Date.now()}`;
                      const newChoice: Choice = {
                        id: newId,
                        label: t('sceneEditor.newChoice'),
                        targetSceneId: '',
                      };
                      updateLocalScene('choices', [...(localScene.choices || []), newChoice]);
                    }}
                    className="w-full flex items-center justify-start px-3 h-[42px] bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-bold transition-all active:scale-[0.98] shadow-sm flex-shrink-0 mb-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('sceneEditor.createChoiceBtn', 'Criar Decisão')}
                  </button>

                  <div className="grid grid-cols-1 gap-4">
                    {(localScene.choices || []).map((choice, index) => (
                      <div key={choice.id} className="relative bg-card border border-muted-foreground/30 rounded-xl p-4 hover:border-primary/50 transition-all shadow-sm group">
                        <button
                          onClick={() => {
                            if (window.confirm(t('sceneEditor.removeChoiceConfirm'))) {
                              const newChoices = localScene.choices!.filter(c => c.id !== choice.id);
                              updateLocalScene('choices', newChoices);
                            }
                          }}
                          className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-tr-xl rounded-bl-xl hover:bg-red-600 transition-all z-10"
                          title={t('sceneEditor.removeBtn')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="space-y-4 pr-12">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {t('sceneEditor.buttonTextChoiceLabel', 'Texto do Botão')}
                            </label>
                            <input
                              type="text"
                              value={choice.label}
                              onChange={(e) => {
                                const newChoices = [...localScene.choices!];
                                newChoices[index] = { ...choice, label: e.target.value };
                                updateLocalScene('choices', newChoices);
                              }}
                              className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary"
                              placeholder={t('sceneEditor.buttonTextChoicePlaceholder')}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {t('sceneEditor.targetSceneChoiceLabel', 'Ramificação de Destino')}
                            </label>
                            <div className="relative">
                              <select
                                value={choice.targetSceneId}
                                onChange={(e) => {
                                  const newChoices = [...localScene.choices!];
                                  newChoices[index] = { ...choice, targetSceneId: e.target.value };
                                  updateLocalScene('choices', newChoices);
                                }}
                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground pr-8 appearance-none focus:ring-1 focus:ring-primary [&>option]:bg-card [&>optgroup]:bg-card [&>optgroup]:font-bold [&>optgroup]:text-muted-foreground"
                              >
                                <option value="">{t('sceneEditor.selectPlaceholder')}</option>
                                <SceneSelectOptions
                                  allScenes={allScenes}
                                  excludeSceneId={localScene.id}
                                  showId={true}
                                />
                              </select>
                              <ArrowRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {(localScene.choices || []).length === 0 && (
                      <div className="col-span-full py-12 flex flex-col items-center justify-center bg-muted/20 border-2 border-dashed border-muted-foreground/20 rounded-2xl text-muted-foreground">
                        <ArrowRight className="w-12 h-12 mb-4 opacity-10" />
                        <p className="text-sm">{t('sceneEditor.noChoicesAdded', 'Nenhuma decisão adicionada a esta ramificação.')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isSidePanel && (
          <div className="sticky bottom-0 left-0 right-0 bg-background px-4 pb-4 pt-2 flex flex-col gap-3 z-50">
            {/* Gradient transition below footer */}
            <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />


            <div className={`flex w-full items-center ${activeTab === 'properties' || activeTab === 'choices' ? 'justify-between' : 'justify-between'}`}>
              <div className={`flex items-center ${activeTab === 'properties' || activeTab === 'choices' ? 'gap-2 w-full justify-between' : 'gap-2'}`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreview}
                    className="flex items-center justify-center gap-1.5 px-3.5 h-[56px] text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-primary border border-muted-foreground/50 hover:border-primary rounded-lg whitespace-nowrap flex-none shrink-0"
                    title={t('sceneEditor.testTooltip')}
                  >
                    <Hammer className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                    <span className="hidden sm:inline-block">
                      {t('sceneEditor.testBtn', 'Testar')}
                    </span>
                  </button>

                  <button
                    onClick={() => onCopyScene(localScene)}
                    className="flex items-center justify-center gap-1.5 px-3.5 h-[56px] text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-primary border border-muted-foreground/50 hover:border-primary rounded-lg whitespace-nowrap flex-none shrink-0"
                    title={t('sceneEditor.copyTooltip')}
                  >
                    <Copy className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                    <span className="hidden sm:inline-block">
                      {copyLabel}
                    </span>
                  </button>
                </div>

                <div className={`${activeTab === 'properties' || activeTab === 'choices' ? 'flex items-center gap-2' : 'hidden'}`}>
                  <button
                    onClick={handleUndo}
                    disabled={!isDirty}
                    className="flex items-center justify-center gap-1.5 px-3.5 h-[56px] text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors bg-zinc-800/50 hover:bg-zinc-800 border border-muted-foreground/50 rounded-lg whitespace-nowrap flex-none shrink-0"
                    title={t('sceneEditor.undoBtn')}
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                    <span className="hidden sm:inline-block">{t('sceneEditor.undoBtn')}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="flex items-center justify-center gap-1.5 px-4 h-[56px] bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed whitespace-nowrap flex-none shrink-0 shadow-lg"
                    title={t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}
                  >
                    <Save className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                    <span className="hidden sm:inline-block">{t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}</span>
                  </button>
                </div>
              </div>

              {activeTab !== 'properties' && activeTab !== 'choices' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUndo}
                    disabled={!isDirty}
                    className="flex items-center justify-center gap-1.5 px-3.5 h-[56px] text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors bg-zinc-800/50 hover:bg-zinc-800 border border-muted-foreground/50 rounded-lg whitespace-nowrap flex-none shrink-0"
                    title={t('sceneEditor.undoBtn')}
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                    <span className="hidden sm:inline-block">{t('sceneEditor.undoBtn')}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="flex items-center justify-center gap-1.5 px-4 h-[56px] bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed whitespace-nowrap flex-none shrink-0 shadow-lg"
                    title={t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}
                  >
                    <Save className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                    <span className="hidden sm:inline-block">{t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SceneEditor.displayName = 'SceneEditor';

export default SceneEditor;
