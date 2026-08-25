import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Scene,
  HyperCard,
  CardHotspot,
  GameObject,
  ConsequenceTracker,
} from '../../types';
import { generateUniqueId } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { useToast } from '../ToastContext';
import { HotspotCanvas } from './HotspotCanvas';
import { HotspotInspector } from './HotspotInspector';
import ObjectEditor from '../ObjectEditor';
import {
  Layers,
  Plus,
  Trash2,
  Copy,
  Star,
  Upload,
  Image as ImageIcon,
  MousePointerClick,
  ArrowLeft,
  Edit3,
  Hammer,
  RotateCcw,
  Save,
  Music,
  Eye,
  ChevronDown,
  Sliders,
  SlidersHorizontal,
  Search,
  X,
  Package,
} from 'lucide-react';

interface HyperCardStackEditorProps {
  scene: Scene;
  allScenes: Scene[];
  globalObjects: { [id: string]: GameObject };
  consequenceTrackers: ConsequenceTracker[];
  onUpdateScene: (updatedScene: Scene) => void;
  onCopyScene?: (scene: Scene) => void;
  onPreviewScene?: (scene: Scene) => void;
  onCreateGlobalObject?: (obj: GameObject, linkToSceneId?: string) => void;
  onLinkObjectToScene?: (sceneId: string, objectId: string) => void;
  onUnlinkObjectFromScene?: (sceneId: string, objectId: string) => void;
  onUpdateGlobalObject?: (objectId: string, data: Partial<GameObject>) => void;
  onTabChange?: (tab: string) => void;
  isDirty?: boolean;
  onSetDirty?: (isDirty: boolean) => void;
  onClose?: () => void;
  onViewMap?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
}

export const HyperCardStackEditor: React.FC<HyperCardStackEditorProps> = ({
  scene,
  allScenes,
  globalObjects,
  consequenceTrackers,
  onUpdateScene,
  onCopyScene,
  onPreviewScene,
  onCreateGlobalObject,
  onLinkObjectToScene,
  onUnlinkObjectFromScene,
  onUpdateGlobalObject,
  onTabChange,
  isDirty: parentIsDirty,
  onSetDirty,
  onClose,
  isExpanded = false,
  onToggleExpand,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local scene state (independent from parent until saved)
  const [localScene, setLocalScene] = useState<Scene>(scene);
  const initialSceneJson = useRef(JSON.stringify(scene));

  // Reset when switching to a different scene id
  useEffect(() => {
    setLocalScene(scene);
    setPendingObjectUpdates({});
    initialSceneJson.current = JSON.stringify(scene);
    setActiveTab('properties');
  }, [scene.id]);

  // Compute local dirty state and notify parent
  const isSceneDirty = JSON.stringify(localScene) !== initialSceneJson.current;

  useEffect(() => {
    onSetDirty?.(isSceneDirty);
  }, [isSceneDirty, onSetDirty]);

  // Sync initial state when scene prop updates content (e.g. after a save)
  useEffect(() => {
    if (JSON.stringify(scene) === JSON.stringify(localScene)) {
      initialSceneJson.current = JSON.stringify(scene);
      if (parentIsDirty) {
        onSetDirty?.(false);
      }
    }
  }, [scene, localScene, parentIsDirty, onSetDirty]);

  // Ensure stackCards has at least 1 card
  const cards: HyperCard[] = localScene.stackCards && localScene.stackCards.length > 0
    ? localScene.stackCards
    : [{
        id: generateUniqueId('crd', []),
        name: t('hypercard.defaultCardName', 'Vista 1'),
        image: localScene.image || '',
        hotspots: [],
        transition: 'fade',
      }];

  const [selectedCardId, setSelectedCardId] = useState<string>(
    localScene.startCardId && cards.some(c => c.id === localScene.startCardId)
      ? localScene.startCardId
      : cards[0].id
  );

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'properties' | 'views' | 'objects'>('properties');
  const [viewsSearchQuery, setViewsSearchQuery] = useState('');

  // Sync active tab with parent (controls side panel expansion)
  useEffect(() => {
    onTabChange?.(activeTab);
  }, [activeTab, onTabChange]);

  // Object updates pending save
  const [pendingObjectUpdates, setPendingObjectUpdates] = useState<{
    [id: string]: Partial<GameObject>;
  }>({});

  const mergedGlobalObjects = useMemo(() => {
    const merged = { ...globalObjects };
    Object.entries(pendingObjectUpdates).forEach(([id, updates]) => {
      if (merged[id]) {
        merged[id] = { ...merged[id], ...updates };
      }
    });
    return merged;
  }, [globalObjects, pendingObjectUpdates]);

  const currentSceneObjects = useMemo(() => {
    return (localScene.objectIds || [])
      .map((id) => mergedGlobalObjects[id])
      .filter(Boolean);
  }, [localScene.objectIds, mergedGlobalObjects]);

  const handleUpdateGlobalObjectLocal = (objectId: string, updatedData: Partial<GameObject>) => {
    setPendingObjectUpdates((prev) => ({
      ...prev,
      [objectId]: { ...(prev[objectId] || {}), ...updatedData },
    }));
  };

  const handleCreateGlobalObjectWrapper = (obj: GameObject, linkToSceneId?: string) => {
    onCreateGlobalObject?.(obj, '');
    setLocalScene((prev) => ({
      ...prev,
      objectIds: [...(prev.objectIds || []), obj.id],
    }));
  };

  const handleLinkObjectWrapper = (sceneId: string, objectId: string) => {
    setLocalScene((prev) => {
      const currentIds = prev.objectIds || [];
      if (currentIds.includes(objectId)) return prev;
      return {
        ...prev,
        objectIds: [...currentIds, objectId],
      };
    });
  };

  const handleUnlinkObjectWrapper = (sceneId: string, objectId: string) => {
    setLocalScene((prev) => ({
      ...prev,
      objectIds: (prev.objectIds || []).filter((id) => id !== objectId),
    }));
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const filteredCards = useMemo(() => {
    if (!viewsSearchQuery.trim()) return cards;
    const q = viewsSearchQuery.toLowerCase();
    return cards.filter(card => (card.name || '').toLowerCase().includes(q));
  }, [cards, viewsSearchQuery]);

  // Floating Examine Test Dialogue
  const [testExamineModal, setTestExamineModal] = useState<{
    isOpen: boolean;
    title?: string;
    text?: string;
    image?: string;
  }>({ isOpen: false });

  // Current Card
  const currentCard = cards.find(c => c.id === selectedCardId) || cards[0];

  // Update Stack Cards in Local Scene
  const updateCards = (newCards: HyperCard[], newStartId?: string) => {
    setLocalScene(prev => ({
      ...prev,
      stackCards: newCards,
      startCardId: newStartId !== undefined ? newStartId : (prev.startCardId || newCards[0]?.id),
      image: newCards[0]?.image || prev.image,
    }));
  };

  // Add Card / Slide
  const handleAddCard = () => {
    const newCardId = generateUniqueId('crd', cards.map(c => c.id));
    const newCard: HyperCard = {
      id: newCardId,
      name: `${t('hypercard.cardPrefix', 'Vista')} ${cards.length + 1}`,
      image: '',
      hotspots: [],
      transition: 'fade',
    };
    const newCards = [...cards, newCard];
    updateCards(newCards);
    setSelectedCardId(newCardId);
    setSelectedHotspotId(null);
  };

  // Duplicate Card / Slide
  const handleDuplicateCard = (cardToCopy: HyperCard, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newCardId = generateUniqueId('crd', cards.map(c => c.id));
    const duplicatedCard: HyperCard = {
      ...JSON.parse(JSON.stringify(cardToCopy)),
      id: newCardId,
      name: `${cardToCopy.name} (${t('common.copy', 'Cópia')})`,
      hotspots: (cardToCopy.hotspots || []).map(h => ({
        ...h,
        id: generateUniqueId('hot', []),
      })),
    };
    const newCards = [...cards, duplicatedCard];
    updateCards(newCards);
    setSelectedCardId(newCardId);
    setSelectedHotspotId(null);
  };

  // Delete Card / Slide
  const handleDeleteCard = (cardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (cards.length <= 1) return;
    const newCards = cards.filter(c => c.id !== cardId);
    const newStart = localScene.startCardId === cardId ? newCards[0].id : localScene.startCardId;
    updateCards(newCards, newStart);
    if (selectedCardId === cardId) {
      setSelectedCardId(newCards[0].id);
      setSelectedHotspotId(null);
    }
  };

  // Update Current Card
  const handleUpdateCard = (updatedCard: HyperCard) => {
    const newCards = cards.map(c => c.id === updatedCard.id ? updatedCard : c);
    updateCards(newCards);
  };

  // Upload Image for Current Card
  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      handleUpdateCard({ ...currentCard, image: base64 });
    };
    reader.readAsDataURL(file);
  };

  // Upload Soundtrack for Scenario
  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Audio = uploadEvent.target?.result as string;
        setLocalScene((prev) => ({
          ...prev,
          backgroundMusic: base64Audio,
          backgroundMusicName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Action Handlers for Bottom Bar (Save, Undo, Test, Copy)
  const handleSave = () => {
    if (onUpdateGlobalObject && Object.keys(pendingObjectUpdates).length > 0) {
      Object.entries(pendingObjectUpdates).forEach(([id, updates]) => {
        onUpdateGlobalObject(id, updates);
      });
      setPendingObjectUpdates({});
    }
    onUpdateScene(localScene);
    initialSceneJson.current = JSON.stringify(localScene);
    onSetDirty?.(false);
    toast(t('editor.sceneSaved', 'Cenário salvo com sucesso!'), 'success');
  };

  const handleUndo = () => {
    const restored = JSON.parse(initialSceneJson.current) as Scene;
    setLocalScene(restored);
    setPendingObjectUpdates({});
    if (!restored.stackCards?.some(c => c.id === selectedCardId)) {
      setSelectedCardId(restored.stackCards?.[0]?.id || '');
    }
    setSelectedHotspotId(null);
  };

  const handlePreview = () => {
    onPreviewScene?.(localScene);
  };

  // Test Mode Action Handlers
  const handleTestNavigateCard = (cardId: string) => {
    if (cards.some(c => c.id === cardId)) {
      setSelectedCardId(cardId);
      setSelectedHotspotId(null);
    }
  };

  const handleTestSound = (soundUrl?: string) => {
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.play().catch(() => {});
    }
  };

  const handleTestExamine = (title?: string, text?: string, image?: string) => {
    setTestExamineModal({
      isOpen: true,
      title: title || t('hypercard.examineTitleDefault', 'Examinar'),
      text: text || t('hypercard.examineTextDefault', 'Você observa atentamente este detalhe.'),
      image,
    });
  };

  // Hotspot Update Handlers
  const selectedHotspot = currentCard.hotspots.find(h => h.id === selectedHotspotId) || null;

  const handleUpdateHotspot = (updatedHotspot: CardHotspot) => {
    const updatedHotspots = currentCard.hotspots.map(h =>
      h.id === updatedHotspot.id ? updatedHotspot : h
    );
    handleUpdateCard({ ...currentCard, hotspots: updatedHotspots });
  };

  const handleDeleteHotspot = (hotspotId: string) => {
    const updatedHotspots = currentCard.hotspots.filter(h => h.id !== hotspotId);
    handleUpdateCard({ ...currentCard, hotspots: updatedHotspots });
    if (selectedHotspotId === hotspotId) {
      setSelectedHotspotId(null);
    }
  };

  // Click on "Editar" button inside a card item
  const handleStartEditCard = (cardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCardId(cardId);
    setSelectedHotspotId(null);
    if (onToggleExpand) {
      onToggleExpand(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative select-none">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUploadImage(file);
        }}
        accept="image/*"
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* CASE 1: UNEXPANDED COMPACT SIDE PANEL (VERTICAL SLIDES / LAYERS LIST)     */}
      {/* ========================================================================= */}
      {!isExpanded && (
        <div className="flex flex-col h-full overflow-hidden relative">
          {/* STICKY TOP HEADER WITH TABS (Exact match with SceneEditor.tsx) */}
          <div className="sticky top-0 z-40 bg-background flex flex-col pt-4 pb-0 gap-3 px-4 shadow-md">
            {/* Solid background shield to perfectly hide scrolled content */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-background pointer-events-none" />

            {/* Top Tabs */}
            <div className="border-b border-muted-foreground/50 flex items-center justify-between -mx-4 px-4">
              <div className="flex space-x-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 justify-center px-4 ${
                    activeTab === 'properties'
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'text-muted-foreground hover:bg-primary/25 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{t('sceneEditor.propertiesTab', 'PROPRIEDADES')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('views')}
                  className={`py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 justify-center px-4 ${
                    activeTab === 'views'
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'text-muted-foreground hover:bg-primary/25 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('hypercard.viewsTab', 'VISTAS')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('objects')}
                  className={`py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 justify-center px-4 ${
                    activeTab === 'objects'
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'text-muted-foreground hover:bg-primary/25 hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{t('sceneEditor.tabs.objects', 'OBJETOS')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SCROLLABLE SIDEBAR CONTAINER (Scroll starts below top tabs) */}
          <div className={`relative flex-1 flex flex-col h-full min-h-0 ${activeTab !== 'objects' ? 'overflow-y-auto pt-6 px-4 pb-28' : 'pt-0'}`}>
            {activeTab === 'properties' && (
              <div className="flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                {/* SEÇÃO 1: DETALHES DO CENÁRIO */}
                <div>
                  <div
                    className={`flex items-center justify-between cursor-pointer select-none group ${
                      collapsedSections.details ? 'mb-0' : 'mb-4'
                    }`}
                    onClick={() => toggleSection('details')}
                  >
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-foreground" />
                      <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                        {t('hypercard.scenarioDetails', 'DETALHES DO CENÁRIO')}
                      </h3>
                    </div>
                    <div className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                          collapsedSections.details ? '-rotate-90' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {!collapsedSections.details && (
                    <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="col-span-2">
                        <label
                          htmlFor="scenarioSceneName"
                          className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5"
                        >
                          {t('sceneEditor.titleLabel', 'TÍTULO')}
                        </label>
                        <input
                          type="text"
                          id="scenarioSceneName"
                          value={localScene.name}
                          onChange={(e) => setLocalScene(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
                          placeholder={t('sceneEditor.titlePlaceholder', 'Título do Cenário')}
                        />
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="scenarioSceneId"
                          className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5"
                        >
                          {t('sceneEditor.uniqueIdLabel', 'ID ÚNICO')}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="scenarioSceneId"
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
                  )}
                </div>

                {/* SEÇÃO 2: MULTIMÍDIA */}
                <div className="pt-4 border-t border-muted-foreground/30 mt-4 -mx-4 px-4">
                  <div
                    className={`flex items-center justify-between cursor-pointer select-none group ${
                      collapsedSections.multimedia ? 'mb-0' : 'mb-4'
                    }`}
                    onClick={() => toggleSection('multimedia')}
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-foreground" />
                      <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                        {t('sceneEditor.multimediaTitle', 'MULTIMÍDIA')}
                      </h3>
                    </div>
                    <div className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                          collapsedSections.multimedia ? '-rotate-90' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {!collapsedSections.multimedia && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* OVERLAY VISUAL EFFECT (Applies to all views in scenario) */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {t('sceneEditor.overlayLabel', 'Efeito Visual (Overlay)')}
                        </label>
                        <select
                          value={localScene.overlayEffect || ''}
                          onChange={(e) =>
                            setLocalScene(prev => ({ ...prev, overlayEffect: e.target.value }))
                          }
                          className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary transition-all [&>option]:bg-card"
                        >
                          <option value="">{t('sceneEditor.effects.none', 'Nenhum')}</option>
                          <option value="grain">{t('sceneEditor.effects.grain', 'Granulado')}</option>
                          <option value="rain">{t('sceneEditor.effects.rain', 'Chuva')}</option>
                          <option value="blur">{t('sceneEditor.effects.blur', 'Vintage')}</option>
                          <option value="chromatic">{t('sceneEditor.effects.chromatic', 'Fósforo verde')}</option>
                          <option value="tv">{t('sceneEditor.effects.tv', 'Televisor CRT')}</option>
                          <option value="confetti">{t('sceneEditor.effects.confetti', 'Confetes')}</option>
                          <option value="glitch">{t('sceneEditor.effects.glitch', 'Glitch')}</option>
                          <option value="nosferatu">{t('sceneEditor.effects.nosferatu', 'Nosferatu')}</option>
                          <option value="wiggle">{t('sceneEditor.effects.wiggle', 'Tremido')}</option>
                          <option value="fog">{t('sceneEditor.effects.fog', 'Neblina')}</option>
                        </select>
                      </div>

                      {/* SOUNDTRACK SECTION */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {t('sceneEditor.audioLabel', 'Trilha Sonora (.mp3)')}
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 border border-dashed border-input rounded-lg hover:border-primary/50 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-background border border-muted-foreground/50 flex items-center justify-center flex-shrink-0">
                            <Music className={`w-4 h-4 ${localScene.backgroundMusic ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-grow min-w-0">
                            {localScene.backgroundMusic ? (
                              <div className="flex flex-col">
                                <span className="text-xs text-foreground truncate">{t('sceneEditor.customAudioSet', 'Áudio personalizado definido')}</span>
                                <span className="text-[10px] text-green-500 truncate">{localScene.backgroundMusicName || t('sceneEditor.audioLoaded', 'Áudio carregado')}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground italic">{t('sceneEditor.noAudio', 'Nenhuma trilha selecionada')}</span>
                                <span className="text-[9px] text-muted-foreground/60">{t('sceneEditor.leaveEmptyAudio', 'Deixe vazio para continuar a música anterior')}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            {localScene.backgroundMusic ? (
                              <button
                                onClick={() => setLocalScene(prev => ({ ...prev, backgroundMusic: undefined, backgroundMusicName: undefined }))}
                                className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded transition-all"
                                title={t('sceneEditor.removeBtn', 'Remover')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <label htmlFor="music-upload-scenario" className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer transition-colors border border-primary">
                                {t('sceneEditor.loadBtn', 'Carregar')}
                                <input id="music-upload-scenario" type="file" accept="audio/*,.mpeg,.mpg,.mp3,.wav,.ogg,.m4a,.aac,.flac" onChange={handleMusicUpload} className="hidden" />
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
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'views' && (
              <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* LISTA DE VISTAS HEADER + SEARCH INLINE */}
                <div className="flex items-center justify-between gap-3 min-h-[36px]">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Eye className="w-4 h-4 text-foreground" />
                    <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                      {t('hypercard.viewsListTitle', 'LISTA DE VISTAS')}
                    </h3>
                  </div>

                  {/* BUSCA DE VISTAS (À direita do título) */}
                  <div className="relative flex-1 max-w-[330px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary/70 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={t('hypercard.searchViewsPlaceholder', 'Buscar vista...')}
                      value={viewsSearchQuery}
                      onChange={(e) => setViewsSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-[34px] bg-background/50 text-foreground placeholder-muted-foreground border border-primary/60 hover:border-primary/90 focus:border-primary focus:bg-background shadow-sm transition-colors"
                    />
                    {viewsSearchQuery && (
                      <button
                        onClick={() => setViewsSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                        title={t('common.clear', 'Limpar')}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* BOTÃO CRIAR VISTA */}
                <button
                  onClick={handleAddCard}
                  className="w-full flex items-center justify-start px-3 h-[42px] font-bold rounded-lg transition-all active:scale-95 text-xs bg-white text-zinc-950 hover:bg-zinc-200 flex-shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>{t('hypercard.addCard', 'Criar Vista')}</span>
                </button>

                {/* LISTA DE VISTAS FILTRADAS */}
                <div className="space-y-3 pt-1">
                  {filteredCards.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs italic bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
                      {viewsSearchQuery ? t('hypercard.noViewsFound', 'Nenhuma vista encontrada') : t('hypercard.noViews', 'Nenhuma vista criada')}
                    </div>
                  ) : (
                    filteredCards.map((card, idx) => {
                      const isSelected = card.id === selectedCardId;
                      const isStart = card.id === localScene.startCardId || (!localScene.startCardId && idx === 0);

                      return (
                        <div
                          key={card.id}
                          onClick={() => setSelectedCardId(card.id)}
                          className={`group relative rounded-xl border overflow-hidden transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-card border-primary shadow-md shadow-primary/10 ring-1 ring-primary'
                              : 'bg-card/70 hover:bg-card border-muted-foreground/30 hover:border-muted-foreground/60'
                          }`}
                        >
                          {/* Thumbnail Box */}
                          <div className="relative w-full h-[94px] bg-black/50 overflow-hidden flex items-center justify-center">
                            {card.image ? (
                              <img
                                src={card.image}
                                alt={card.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-muted-foreground/40 gap-1">
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-[10px]">{t('hypercard.noImage', 'Sem imagem')}</span>
                              </div>
                            )}

                            {/* View Name Badge Top Left */}
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white leading-none shadow flex items-center gap-1 max-w-[70%] z-10">
                              <span className="truncate">{card.name || `${t('hypercard.cardPrefix', 'Vista')} ${idx + 1}`}</span>
                            </div>

                            {/* Start Badge Top Right */}
                            {isStart && (
                              <div
                                className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 font-bold text-[9px] flex items-center gap-0.5 shadow z-10"
                                title={t('hypercard.initialView', 'Vista Inicial')}
                              >
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>{t('hypercard.startCard', 'Início')}</span>
                              </div>
                            )}

                            {/* HOVER OVERLAY: EDIT BUTTON AT EXACT CENTER */}
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-20">
                              <button
                                onClick={(e) => handleStartEditCard(card.id, e)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md shadow-primary/30 active:scale-95 transition-all transform translate-y-1 group-hover:translate-y-0"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{t('hypercard.edit', 'Editar')}</span>
                              </button>
                            </div>
                          </div>

                          {/* Card Footer: Hotspot Count + Quick Actions */}
                          <div className="py-2 px-2.5 flex items-center justify-between border-t border-muted-foreground/10 bg-card">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MousePointerClick className="w-3.5 h-3.5 text-primary" />
                              <span className="font-medium text-[11px]">{card.hotspots?.length || 0} {card.hotspots?.length === 1 ? t('hypercard.interactiveArea', 'área interativa') : t('hypercard.interactiveAreas', 'áreas interativas')}</span>
                            </div>

                            {/* Quick Action Icons */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!isStart && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLocalScene(prev => ({ ...prev, startCardId: card.id }));
                                  }}
                                  className="p-1 rounded text-muted-foreground hover:text-amber-400 hover:bg-muted transition-colors"
                                  title={t('hypercard.setAsStart', 'Tornar Vista Inicial')}
                                >
                                  <Star className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDuplicateCard(card, e)}
                                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                title={t('hypercard.duplicateView', 'Duplicar Vista')}
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              {cards.length > 1 && (
                                <button
                                  onClick={(e) => handleDeleteCard(card.id, e)}
                                  className="p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-muted transition-colors"
                                  title={t('hypercard.deleteView', 'Excluir Vista')}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
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
                  isSidePanel={true}
                />
              </div>
            )}
          </div>

          {/* STICKY FOOTER ACTION BUTTONS (Exact match with SceneEditor.tsx) */}
          <div className="sticky bottom-0 left-0 right-0 bg-background px-4 pb-4 pt-2 flex flex-col gap-3 z-30">
            {/* Gradient transition above footer */}
            <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />

            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreview}
                  className="flex items-center justify-center gap-1.5 px-4 h-[56px] text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-primary border border-muted-foreground/50 hover:border-primary rounded-lg whitespace-nowrap flex-none"
                  title={t('sceneEditor.testTooltip', 'Testar este cenário')}
                >
                  <Hammer className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  <span className="hidden min-[450px]:inline-block">
                    {t('sceneEditor.testBtn', 'Testar')}
                  </span>
                </button>

                <button
                  onClick={() => onCopyScene?.(localScene)}
                  className="flex items-center justify-center gap-1.5 px-4 h-[56px] text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-primary border border-muted-foreground/50 hover:border-primary rounded-lg whitespace-nowrap flex-none"
                  title={t('sceneEditor.copyTooltip', 'Copiar Cenário')}
                >
                  <Copy className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  <span className="hidden min-[450px]:inline-block">
                    {t('sceneEditor.copyBranch', 'Copiar')}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  disabled={!isSceneDirty}
                  className="flex items-center justify-center gap-1.5 px-4 h-[56px] text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors bg-zinc-800/50 hover:bg-zinc-800 border border-muted-foreground/50 rounded-lg whitespace-nowrap flex-none"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  <span className="hidden min-[450px]:inline-block">{t('sceneEditor.undoBtn', 'Desfazer')}</span>
                </button>

                <button
                  onClick={handleSave}
                  disabled={!isSceneDirty}
                  className="flex items-center justify-center gap-1.5 px-4 h-[56px] bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed whitespace-nowrap flex-none shadow-lg"
                >
                  <Save className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  <span className="hidden min-[450px]:inline-block">{t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 2: EXPANDED FULL-SCREEN WORKSPACE (CANVAS + INSPECTOR)              */}
      {/* ========================================================================= */}
      {isExpanded && (
        <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-150">
          {/* Expanded Top Bar: Clean left side with only Back button */}
          <div className="h-14 bg-card border-b border-muted-foreground/30 px-4 flex items-center justify-between flex-shrink-0 z-30">
            <div className="flex items-center">
              <button
                onClick={() => onToggleExpand?.(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted-foreground/20 text-foreground text-xs font-bold border border-muted-foreground/30 transition-colors"
                title={t('hypercard.backToViewsList', 'Voltar à lista de vistas')}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('hypercard.back', 'Voltar')}</span>
              </button>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted-foreground/20 text-foreground text-xs font-semibold border border-muted-foreground/30 transition-colors"
                title={t('hypercard.uploadImageBtn', 'Escolher Imagem')}
              >
                <Upload className="w-3.5 h-3.5 text-primary" />
                <span>{currentCard.image ? t('hypercard.changeImage', 'Trocar Imagem') : t('hypercard.uploadImageBtn', 'Escolher Imagem')}</span>
              </button>

              <button
                onClick={handleSave}
                disabled={!isSceneDirty}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-zinc-950 text-xs font-bold shadow-md shadow-yellow-500/20 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all active:scale-95"
                title={t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}
              >
                <Save className="w-3.5 h-3.5 shrink-0" />
                <span>{t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}</span>
              </button>
            </div>
          </div>

          {/* Expanded 2-Panel Layout: Canvas (Full) + Inspector (Clean Single Right Border) */}
          <div className="flex-1 flex overflow-hidden bg-background">
            {/* Left/Center: Large Hotspot Canvas with floating toolbars */}
            <div className="flex-1 h-full overflow-hidden relative">
              <HotspotCanvas
                card={currentCard}
                allCards={cards}
                overlayEffect={localScene.overlayEffect}
                onUpdateCard={handleUpdateCard}
                selectedHotspotId={selectedHotspotId}
                onSelectHotspot={setSelectedHotspotId}
                onUploadImage={handleUploadImage}
                onTestNavigateCard={handleTestNavigateCard}
                onTestExamine={handleTestExamine}
                onTestSound={handleTestSound}
              />
            </div>

            {/* Right: Hotspot Properties Inspector with clean single border */}
            <div className="w-[320px] md:w-[360px] flex flex-col h-full overflow-hidden flex-shrink-0 border-l border-muted-foreground/30 bg-card">
              <HotspotInspector
                hotspot={selectedHotspot}
                card={currentCard}
                scene={localScene}
                onUpdateCard={handleUpdateCard}
                allCards={cards}
                allScenes={allScenes}
                globalObjects={mergedGlobalObjects}
                consequenceTrackers={consequenceTrackers}
                onUpdateHotspot={handleUpdateHotspot}
                onDeleteHotspot={handleDeleteHotspot}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Examine Test Modal */}
      {testExamineModal.isOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setTestExamineModal({ isOpen: false })}
        >
          <div
            className="w-full max-w-lg bg-card border-2 border-muted-foreground/50 rounded-none p-6 shadow-none space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-muted-foreground/30 pb-3">
              <h3 className="font-bold text-base text-foreground">
                {testExamineModal.title || t('hypercard.examineTitleDefault', 'Examinar')}
              </h3>
              <button
                onClick={() => setTestExamineModal({ isOpen: false })}
                className="text-muted-foreground hover:text-foreground text-2xl leading-none font-bold"
              >
                &times;
              </button>
            </div>

            {testExamineModal.image && (
              <div className="w-full max-h-56 border-2 border-muted-foreground/40 overflow-hidden">
                <img
                  src={testExamineModal.image}
                  alt=""
                  className="w-full h-auto max-h-56 object-cover"
                />
              </div>
            )}

            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {testExamineModal.text}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTestExamineModal({ isOpen: false })}
                className="px-5 py-2 rounded-none border-2 border-muted-foreground/40 bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
              >
                {t('common.continue', 'Continuar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
