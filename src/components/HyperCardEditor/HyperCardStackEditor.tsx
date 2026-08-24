import React, { useState, useRef } from 'react';
import {
  Scene,
  HyperCard,
  CardHotspot,
  GameObject,
  ConsequenceTracker,
} from '../../types';
import { generateUniqueId } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { HotspotCanvas } from './HotspotCanvas';
import { HotspotInspector } from './HotspotInspector';
import {
  Layers,
  Sparkles,
  X,
  Plus,
  Trash2,
  Copy,
  Star,
  Upload,
  Image as ImageIcon,
  MousePointerClick,
  ArrowLeft,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

interface HyperCardStackEditorProps {
  scene: Scene;
  allScenes: Scene[];
  globalObjects: { [id: string]: GameObject };
  consequenceTrackers: ConsequenceTracker[];
  onUpdateScene: (updatedScene: Scene) => void;
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
  onClose,
  isExpanded = false,
  onToggleExpand,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ensure stackCards has at least 1 card
  const cards: HyperCard[] = scene.stackCards && scene.stackCards.length > 0
    ? scene.stackCards
    : [{
        id: generateUniqueId('crd', []),
        name: t('hypercard.defaultCardName', 'Vista 1'),
        image: scene.image || '',
        hotspots: [],
        transition: 'dissolve',
      }];

  const [selectedCardId, setSelectedCardId] = useState<string>(
    scene.startCardId && cards.some(c => c.id === scene.startCardId)
      ? scene.startCardId
      : cards[0].id
  );

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  // Floating Examine Test Dialogue
  const [testExamineModal, setTestExamineModal] = useState<{
    isOpen: boolean;
    title?: string;
    text?: string;
    image?: string;
  }>({ isOpen: false });

  // Current Card
  const currentCard = cards.find(c => c.id === selectedCardId) || cards[0];

  // Update Stack Cards in Scene
  const updateCards = (newCards: HyperCard[], newStartId?: string) => {
    onUpdateScene({
      ...scene,
      stackCards: newCards,
      startCardId: newStartId !== undefined ? newStartId : (scene.startCardId || newCards[0]?.id),
      image: newCards[0]?.image || scene.image,
    });
  };

  // Add Card / Slide
  const handleAddCard = () => {
    const newCardId = generateUniqueId('crd', cards.map(c => c.id));
    const newCard: HyperCard = {
      id: newCardId,
      name: `${t('hypercard.cardPrefix', 'Vista')} ${cards.length + 1}`,
      image: '',
      hotspots: [],
      transition: 'dissolve',
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
    const newStart = scene.startCardId === cardId ? newCards[0].id : scene.startCardId;
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
        <div className="flex flex-col h-full overflow-hidden">
          {/* FIXED TOP SECTION (From base of create button up) */}
          <div className="p-4 pb-3 space-y-4 flex-shrink-0 border-b border-muted-foreground/30 bg-background z-10">
            {/* DETALHES DO CENÁRIO */}
            <div className="space-y-4 flex flex-col">
              <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                <Layers className="w-4 h-4" />
                {t('hypercard.scenarioDetails', 'Detalhes do Cenário')}
              </h3>

              <div className="grid grid-cols-3 gap-4">
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
                    value={scene.name}
                    onChange={(e) => onUpdateScene({ ...scene, name: e.target.value })}
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
                      value={scene.id}
                      disabled
                      className="w-full bg-muted/50 border border-input rounded-lg px-3 py-2.5 text-xs text-muted-foreground font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 text-[10px]">
                      #
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LISTA DE VISTAS HEADER & CREATE BUTTON */}
            <div className="space-y-3 pt-3 border-t border-muted-foreground/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t('hypercard.viewsListTitle', 'Lista de Vistas')} ({cards.length})
                </span>
              </div>

              {/* Standard Creation Button Pattern - Fixed above the list */}
              <button
                onClick={handleAddCard}
                className="w-full flex items-center justify-start px-3 h-[42px] font-bold rounded-lg transition-all active:scale-95 text-xs bg-white text-zinc-950 hover:bg-zinc-200 flex-shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>{t('hypercard.addCard', 'Criar Vista')}</span>
              </button>
            </div>
          </div>

          {/* SCROLLABLE VIEWS LIST (ONLY CARDS SCROLL) */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4 pt-3 pb-8 space-y-3">
            {cards.map((card, idx) => {
              const isSelected = card.id === selectedCardId;
              const isStart = card.id === scene.startCardId || (!scene.startCardId && idx === 0);

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
                  {/* Thumbnail Box - Height adjusted by +1/4 */}
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
                        <span className="text-[10px]">Sem imagem</span>
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
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Footer: Hotspot Count + Quick Actions */}
                  <div className="py-2 px-2.5 flex items-center justify-between border-t border-muted-foreground/10 bg-card">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MousePointerClick className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium text-[11px]">{card.hotspots?.length || 0} {card.hotspots?.length === 1 ? t('hypercard.zone', 'área') : t('hypercard.zones', 'áreas')}</span>
                    </div>

                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!isStart && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateScene({ ...scene, startCardId: card.id });
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
            })}
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
                <span>Voltar</span>
              </button>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted-foreground/20 text-foreground text-xs font-semibold border border-muted-foreground/30 transition-colors"
                title="Enviar ou trocar imagem de fundo deste cenário"
              >
                <Upload className="w-3.5 h-3.5 text-primary" />
                <span>{currentCard.image ? 'Trocar Imagem' : 'Enviar Imagem'}</span>
              </button>

              <button
                onClick={() => onToggleExpand?.(false)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Concluir Edição</span>
              </button>
            </div>
          </div>

          {/* Expanded 2-Panel Layout: Canvas (Full) + Inspector (Clean Single Right Border) */}
          <div className="flex-1 flex overflow-hidden bg-background">
            {/* Left/Center: Large Hotspot Canvas with floating toolbars */}
            <div className="flex-1 h-full overflow-hidden relative">
              <HotspotCanvas
                card={currentCard}
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
                onUpdateCard={handleUpdateCard}
                allCards={cards}
                allScenes={allScenes}
                globalObjects={globalObjects}
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
