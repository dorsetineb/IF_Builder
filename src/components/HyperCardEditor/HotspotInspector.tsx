import React, { useState } from 'react';
import {
  CardHotspot,
  HotspotHighlightStyle,
  HotspotActionType,
  HyperCard,
  Scene,
  GameObject,
  ConsequenceTracker,
} from '../../types';
import { useTranslation } from 'react-i18next';
import { ColorInput } from '../UIEditor/ColorInput';
import ImageUploadField from '../ui/ImageUploadField';
import {
  Sliders,
  MousePointerClick,
  Trash2,
  Volume2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Layers,
  X,
  Activity,
  Heart,
  Zap,
  Shield,
  Coins,
  Clock,
  Skull,
  Star,
  User,
  Trophy,
  AlertTriangle,
  Book,
  Crown,
  Flame,
  Droplet,
  Sun,
  Moon,
  Sword,
  Key,
  Map as MapIcon,
  Eye,
  FlaskConical,
  Box,
  MousePointer2,
  Hand,
  Search,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Save,
  Plus,
  Settings,
} from 'lucide-react';

const TRACKER_ICONS = [
  { name: 'activity', component: Activity },
  { name: 'heart', component: Heart },
  { name: 'zap', component: Zap },
  { name: 'shield', component: Shield },
  { name: 'coins', component: Coins },
  { name: 'clock', component: Clock },
  { name: 'skull', component: Skull },
  { name: 'star', component: Star },
  { name: 'user', component: User },
  { name: 'trophy', component: Trophy },
  { name: 'alert', component: AlertTriangle },
  { name: 'book', component: Book },
  { name: 'crown', component: Crown },
  { name: 'flame', component: Flame },
  { name: 'droplet', component: Droplet },
  { name: 'sun', component: Sun },
  { name: 'moon', component: Moon },
  { name: 'sword', component: Sword },
  { name: 'key', component: Key },
  { name: 'map', component: MapIcon },
  { name: 'eye', component: Eye },
  { name: 'flask', component: FlaskConical },
];

export const HOTSPOT_ICONS = [
  { name: 'eye', component: Eye, labelKey: 'hypercard.icons.eye', defaultLabel: 'Olho (Observar)' },
  { name: 'mouse', component: MousePointer2, labelKey: 'hypercard.icons.mouse', defaultLabel: 'Ponteiro / Clique' },
  { name: 'hand', component: Hand, labelKey: 'hypercard.icons.hand', defaultLabel: 'Mão (Interagir)' },
  { name: 'search', component: Search, labelKey: 'hypercard.icons.search', defaultLabel: 'Lupa (Investigar)' },
  { name: 'arrow-up', component: ArrowUp, labelKey: 'hypercard.icons.arrowUp', defaultLabel: 'Seta Cima' },
  { name: 'arrow-down', component: ArrowDown, labelKey: 'hypercard.icons.arrowDown', defaultLabel: 'Seta Baixo' },
  { name: 'arrow-left', component: ArrowLeft, labelKey: 'hypercard.icons.arrowLeft', defaultLabel: 'Seta Esquerda' },
  { name: 'arrow-right', component: ArrowRight, labelKey: 'hypercard.icons.arrowRight', defaultLabel: 'Seta Direita' },
  { name: 'box', component: Box, labelKey: 'hypercard.icons.box', defaultLabel: 'Caixa / Objeto' },
  { name: 'key', component: Key, labelKey: 'hypercard.icons.key', defaultLabel: 'Chave' },
  { name: 'sword', component: Sword, labelKey: 'hypercard.icons.sword', defaultLabel: 'Espada / Combate' },
  { name: 'flask', component: FlaskConical, labelKey: 'hypercard.icons.flask', defaultLabel: 'Poção / Frasco' },
  { name: 'book', component: Book, labelKey: 'hypercard.icons.book', defaultLabel: 'Livro / Texto' },
  { name: 'map', component: MapIcon, labelKey: 'hypercard.icons.map', defaultLabel: 'Mapa / Navegação' },
  { name: 'crown', component: Crown, labelKey: 'hypercard.icons.crown', defaultLabel: 'Coroa / Recompensa' },
  { name: 'star', component: Star, labelKey: 'hypercard.icons.star', defaultLabel: 'Estrela' },
  { name: 'heart', component: Heart, labelKey: 'hypercard.icons.heart', defaultLabel: 'Coração / Vida' },
  { name: 'zap', component: Zap, labelKey: 'hypercard.icons.zap', defaultLabel: 'Raio / Energia' },
  { name: 'shield', component: Shield, labelKey: 'hypercard.icons.shield', defaultLabel: 'Escudo / Proteção' },
  { name: 'coins', component: Coins, labelKey: 'hypercard.icons.coins', defaultLabel: 'Moedas / Valor' },
  { name: 'clock', component: Clock, labelKey: 'hypercard.icons.clock', defaultLabel: 'Relógio / Tempo' },
  { name: 'skull', component: Skull, labelKey: 'hypercard.icons.skull', defaultLabel: 'Caveira / Perigo' },
  { name: 'user', component: User, labelKey: 'hypercard.icons.user', defaultLabel: 'Personagem' },
  { name: 'trophy', component: Trophy, labelKey: 'hypercard.icons.trophy', defaultLabel: 'Troféu' },
  { name: 'alert', component: AlertTriangle, labelKey: 'hypercard.icons.alert', defaultLabel: 'Alerta' },
  { name: 'flame', component: Flame, labelKey: 'hypercard.icons.flame', defaultLabel: 'Fogo' },
  { name: 'droplet', component: Droplet, labelKey: 'hypercard.icons.droplet', defaultLabel: 'Gota / Água' },
  { name: 'sun', component: Sun, labelKey: 'hypercard.icons.sun', defaultLabel: 'Sol / Luz' },
  { name: 'moon', component: Moon, labelKey: 'hypercard.icons.moon', defaultLabel: 'Lua / Noite' },
  { name: 'activity', component: Activity, labelKey: 'hypercard.icons.activity', defaultLabel: 'Atividade' },
];

interface HotspotInspectorProps {
  hotspot: CardHotspot | null;
  card: HyperCard;
  scene?: Scene;
  onUpdateCard?: (updatedCard: HyperCard) => void;
  allCards: HyperCard[];
  allScenes: Scene[];
  globalObjects: { [id: string]: GameObject };
  consequenceTrackers: ConsequenceTracker[];
  onNavigateToTrackers?: () => void;
  onUpdateHotspot: (updatedHotspot: CardHotspot) => void;
  onDeleteHotspot: (hotspotId: string) => void;
  onUploadSound?: (file: File) => void;
  onSave?: () => void;
  onUndo?: () => void;
  isDirty?: boolean;
  onBack?: () => void;
}

export const HotspotInspector: React.FC<HotspotInspectorProps> = ({
  hotspot,
  card,
  scene,
  onUpdateCard,
  allCards,
  allScenes,
  globalObjects,
  consequenceTrackers,
  onNavigateToTrackers,
  onUpdateHotspot,
  onDeleteHotspot,
  onSave,
  onUndo,
  isDirty = false,
  onBack,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'visual' | 'action' | 'conditions'>('visual');
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const sceneObjects = React.useMemo(() => {
    if (!scene?.objectIds) return [];
    return scene.objectIds.map(id => globalObjects[id]).filter(Boolean);
  }, [scene?.objectIds, globalObjects]);

  const otherObjects = React.useMemo(() => {
    const sceneIdSet = new Set(scene?.objectIds || []);
    return Object.values(globalObjects).filter(obj => !sceneIdSet.has(obj.id));
  }, [scene?.objectIds, globalObjects]);

  const handleFieldChange = <K extends keyof CardHotspot>(field: K, value: CardHotspot[K]) => {
    if (!hotspot) return;
    onUpdateHotspot({ ...hotspot, [field]: value });
  };

  const handleAddTrackerEffect = () => {
    if (!hotspot) return;
    const defaultTrackerId = consequenceTrackers[0]?.id || '';
    const currentEffects = hotspot.trackerEffects || [];
    handleFieldChange('trackerEffects', [...currentEffects, { trackerId: defaultTrackerId, valueChange: 1 }]);
  };

  const handleRemoveTrackerEffect = (index: number) => {
    if (!hotspot) return;
    const currentEffects = [...(hotspot.trackerEffects || [])];
    currentEffects.splice(index, 1);
    handleFieldChange('trackerEffects', currentEffects);
  };

  const handleTrackerEffectChange = (index: number, field: 'trackerId' | 'valueChange', value: any) => {
    if (!hotspot) return;
    const currentEffects = [...(hotspot.trackerEffects || [])];
    if (!currentEffects[index]) return;
    currentEffects[index] = { ...currentEffects[index], [field]: value };
    handleFieldChange('trackerEffects', currentEffects);
  };

  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hotspot) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        handleFieldChange('soundEffect', base64);
        handleFieldChange('soundEffectName', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeIconName = hotspot?.icon || 'eye';
  const currentIconObj = HOTSPOT_ICONS.find(i => i.name === activeIconName);
  const CurrentIconComponent = currentIconObj?.component || Eye;
  const currentIconLabel = currentIconObj ? t(currentIconObj.labelKey, currentIconObj.defaultLabel) : t('hypercard.icons.eye', 'Olho (Observar)');

  const normalizedHighlightStyle = 
    hotspot?.highlightStyle === 'always-visible' || hotspot?.highlightStyle === 'icons-visible' || hotspot?.highlightStyle === 'pulsing-pin'
      ? 'icons-visible'
      : hotspot?.highlightStyle === 'hidden'
      ? 'hidden'
      : 'icons-hover';

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden bg-card select-none"
      onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}
    >
      {/* SECTION 1: DETALHES DA VISTA (SEMPRE NO TOPO) */}
      <div className="p-4 space-y-4 flex flex-col flex-shrink-0 border-b border-muted-foreground/30 bg-card">
        {onBack && (
          <>
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 py-0.5 text-zinc-400 hover:text-white transition-colors group"
                title={t('hypercard.backToViewsList', 'Voltar à lista de vistas')}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-widest border-b border-transparent group-hover:border-current/30">
                  {t('hypercard.backToViewsList', 'Voltar à lista de vistas')}
                </span>
              </button>
            </div>
            <div className="h-px bg-muted-foreground/30 -mx-4" />
          </>
        )}

        <h3 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
          <Layers className="w-4 h-4" />
          {t('hypercard.viewDetails', 'Detalhes da Vista')}
        </h3>

        <div className="space-y-3">
          {/* NOME DA VISTA */}
          <div>
            <label
              htmlFor="hypercardViewName"
              className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5"
            >
              {t('hypercard.viewName', 'NOME DA VISTA')}
            </label>
            <input
              type="text"
              id="hypercardViewName"
              value={card.name}
              onChange={(e) => onUpdateCard?.({ ...card, name: e.target.value })}
              placeholder={t('hypercard.defaultCardName', 'Vista 1')}
              className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* TROCAR IMAGEM DA VISTA */}
          <div>
            <label
              htmlFor="hypercardViewImageUpload"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-muted hover:bg-muted-foreground/20 text-foreground text-xs font-semibold border border-muted-foreground/30 cursor-pointer transition-colors"
              title={t('hypercard.changeViewImage', 'Trocar imagem da vista')}
            >
              <Upload className="w-3.5 h-3.5 text-primary" />
              <span>{t('hypercard.changeViewImage', 'Trocar imagem da vista')}</span>
              <input
                id="hypercardViewImageUpload"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const { compressImageToWebP } = await import('../../utils/imageOptimizer');
                      const compressed = await compressImageToWebP(file);
                      onUpdateCard?.({ ...card, image: compressed });
                    } catch {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (typeof ev.target?.result === 'string') {
                          onUpdateCard?.({ ...card, image: ev.target.result });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                  if (e.target) e.target.value = '';
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {!hotspot ? (
        /* Empty State when no Hotspot is selected */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground select-none bg-card">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4 text-primary">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-foreground mb-1 text-sm">
            {t('hypercard.noHotspotSelected', 'Nenhuma Área Selecionada')}
          </h4>
          <p className="text-xs max-w-[220px] text-muted-foreground leading-relaxed">
            {t('hypercard.selectHotspotHint', 'Clique em uma área na imagem ou desenhe uma nova para configurar suas ações e propriedades.')}
          </p>
        </div>
      ) : (
        /* Hotspot Configuration when selected */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-3 border-b border-muted-foreground/30 p-1.5 bg-background/50 flex-shrink-0 gap-1">
            <button
              onClick={() => setActiveTab('visual')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'visual'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sliders className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('hypercard.tabs.visual', 'Visual')}</span>
            </button>

            <button
              onClick={() => setActiveTab('action')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'action'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('hypercard.tabs.action', 'Ação')}</span>
            </button>

            <button
              onClick={() => setActiveTab('conditions')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'conditions'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('hypercard.tabs.conditions', 'Condições')}</span>
            </button>
          </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: VISUAL & APPEARANCE */}
        {activeTab === 'visual' && (
          <div className="space-y-4">
            {/* NOME DA ÁREA INTERATIVA */}
            <div>
              <label
                htmlFor="hypercardHotspotTitle"
                className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"
              >
                {t('hypercard.hotspotName', 'NOME DA ÁREA INTERATIVA')}
              </label>
              <input
                type="text"
                id="hypercardHotspotTitle"
                value={hotspot.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder={t('hypercard.hotspotDefault', 'Área Interativa')}
                className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
              />
            </div>

            {/* Transição da vista */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                {t('hypercard.fields.transition', 'Transição da vista')}
              </label>
              <select
                value={hotspot.transition || 'fade'}
                onChange={(e) => handleFieldChange('transition', e.target.value as any)}
                className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors font-medium"
              >
                <option value="fade">{t('hypercard.transitions.fade', 'Fade (Esmaecer)')}</option>
                <option value="slide-left">{t('hypercard.transitions.slideLeft', 'Deslizar para Esquerda')}</option>
                <option value="slide-right">{t('hypercard.transitions.slideRight', 'Deslizar para Direita')}</option>
                <option value="slide-up">{t('hypercard.transitions.slideUp', 'Deslizar para Cima')}</option>
                <option value="slide-down">{t('hypercard.transitions.slideDown', 'Deslizar para Baixo')}</option>
                <option value="zoom">{t('hypercard.transitions.zoom', 'Zoom In / Out')}</option>
                <option value="blur">{t('hypercard.transitions.blur', 'Desfoque (Blur)')}</option>
                <option value="none">{t('hypercard.transitions.none', 'Nenhuma (Corte Seco)')}</option>
              </select>
            </div>

            {/* Highlight Style */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                {t('hypercard.fields.highlightStyle', 'Estilo de Realce')}
              </label>
              <select
                value={normalizedHighlightStyle}
                onChange={(e) => handleFieldChange('highlightStyle', e.target.value as HotspotHighlightStyle)}
                className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="icons-visible">{t('hypercard.styles.iconsVisible', 'Ícones visíveis')}</option>
                <option value="icons-hover">{t('hypercard.styles.iconsHover', 'Ícones ao passar o mouse')}</option>
                <option value="hidden">{t('hypercard.styles.hidden', 'Invisível')}</option>
              </select>
            </div>

            {/* Icon Picker & Customization - Single Box */}
            {normalizedHighlightStyle !== 'hidden' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t('hypercard.fields.hotspotIcon', 'Ícone de Realce')}
                </label>

                {/* Caixa única que contém todos os componentes editáveis do ícone */}
                <div className="space-y-3 p-3 bg-background/50 rounded-xl border border-muted-foreground/30">
                  {/* Seletor de Ícone */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsIconPickerOpen(prev => !prev);
                      }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-background border border-muted-foreground/30 hover:border-primary rounded-xl text-sm font-semibold text-foreground transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-none flex items-center justify-center flex-shrink-0 transition-colors border"
                          style={{
                            backgroundColor: hotspot.hideIconBg ? 'transparent' : (hotspot.iconBgColor || 'rgba(0,0,0,0.75)'),
                            borderColor: hotspot.hideIconBg ? 'transparent' : (hotspot.iconBorderColor || 'rgba(255,255,255,0.3)'),
                            color: hotspot.iconColor || 'var(--primary, #10b981)',
                          }}
                        >
                          <CurrentIconComponent className="w-4 h-4" />
                        </div>
                        <span className="truncate text-xs">{currentIconLabel}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-normal">{t('common.change', 'Alterar')}</span>
                    </button>

                    {/* Icon Picker Popover Grid */}
                    {isIconPickerOpen && (
                      <div
                        className="absolute left-0 top-full mt-2 w-full p-2.5 bg-popover border border-muted-foreground/40 rounded-2xl z-30 grid grid-cols-6 gap-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100 backdrop-blur-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {HOTSPOT_ICONS.map(item => {
                          const ItemIcon = item.component;
                          const isSelected = activeIconName === item.name;
                          return (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => {
                                handleFieldChange('icon', item.name);
                                setIsIconPickerOpen(false);
                              }}
                              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                              title={t(item.labelKey, item.defaultLabel)}
                            >
                              <ItemIcon className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Configurações de Cores */}
                  <div className="space-y-2.5">
                    <ColorInput
                      label={t('hypercard.fields.iconColor', 'Cor do Ícone')}
                      id={`hotspot-icon-color-${hotspot.id}`}
                      value={hotspot.iconColor || '#ffffff'}
                      onChange={(val) => handleFieldChange('iconColor', val)}
                      placeholder="#ffffff"
                      headerRight={
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={!!hotspot.hideIconBg}
                            onChange={(e) => handleFieldChange('hideIconBg', e.target.checked)}
                            className="rounded border-muted-foreground text-primary focus:ring-primary w-3.5 h-3.5"
                          />
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                            {t('hypercard.fields.removeBg', 'Remover fundo')}
                          </span>
                        </label>
                      }
                    />

                    {!hotspot.hideIconBg && (
                      <div className="grid grid-cols-2 gap-2.5">
                        <ColorInput
                          label={t('hypercard.fields.iconBg', 'Fundo')}
                          id={`hotspot-bg-color-${hotspot.id}`}
                          value={hotspot.iconBgColor || '#000000'}
                          onChange={(val) => handleFieldChange('iconBgColor', val)}
                          placeholder="#000000"
                        />

                        <ColorInput
                          label={t('hypercard.fields.iconBorder', 'Borda')}
                          id={`hotspot-border-color-${hotspot.id}`}
                          value={hotspot.iconBorderColor || '#30363d'}
                          onChange={(val) => handleFieldChange('iconBorderColor', val)}
                          placeholder="#30363d"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sound Effect */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                {t('hypercard.fields.soundEffect', 'Efeito Sonoro ao Clicar')}
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-background border border-muted-foreground/30 hover:border-primary cursor-pointer text-sm font-semibold text-foreground transition-colors truncate">
                  <Volume2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">
                    {hotspot.soundEffectName || t('hypercard.uploadSound', 'Adicionar Som (.mp3, .wav)')}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleSoundUpload}
                  />
                </label>
                {hotspot.soundEffect && (
                  <button
                    onClick={() => {
                      handleFieldChange('soundEffect', undefined);
                      handleFieldChange('soundEffectName', undefined);
                    }}
                    className="p-2.5 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 flex-shrink-0 transition-colors"
                    title="Remover som"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTION & DESTINATION */}
        {activeTab === 'action' && (
          <div className="space-y-4">
            {/* Action Type */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                {t('hypercard.fields.actionType', 'Tipo de Ação')}
              </label>
              <select
                value={hotspot.actionType}
                onChange={(e) => handleFieldChange('actionType', e.target.value as HotspotActionType)}
                className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground font-semibold focus:outline-none focus:border-primary transition-colors"
              >
                <option value="examine">{t('hypercard.actions.examine', 'Examinar (Diálogo flutuante)')}</option>
                <option value="navigate_card">{t('hypercard.actions.navigateCard', 'Navegar para outro Cartão da Pilha')}</option>
                <option value="navigate_scene">{t('hypercard.actions.navigateScene', 'Sair para outra Cena/Ramificação do Mapa')}</option>
                <option value="collect_item">{t('hypercard.actions.collectItem', 'Coletar objeto para inventário')}</option>
                <option value="toggle_tracker">{t('hypercard.actions.toggleTracker', 'Alterar Rastreador')}</option>
              </select>
            </div>

            {/* ACTION: NAVIGATE CARD (Internal) */}
            {hotspot.actionType === 'navigate_card' && (
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {t('hypercard.fields.targetCard', 'Cenário de Destino')}
                </label>
                <select
                  value={hotspot.targetCardId || ''}
                  onChange={(e) => handleFieldChange('targetCardId', e.target.value)}
                  className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">{t('hypercard.selectCardPlaceholder', '-- Selecione o Cenário --')}</option>
                  {allCards.map((c) => (
                    <option key={c.id} value={c.id} disabled={c.id === card.id}>
                      {c.name} {c.id === card.id ? '(Atual)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ACTION: NAVIGATE SCENE (External) */}
            {hotspot.actionType === 'navigate_scene' && (
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {t('hypercard.fields.targetScene', 'Ramificação / Capítulo de Destino')}
                </label>
                <select
                  value={hotspot.targetSceneId || ''}
                  onChange={(e) => handleFieldChange('targetSceneId', e.target.value)}
                  className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">{t('hypercard.selectScenePlaceholder', '-- Selecione a Cena no Mapa --')}</option>
                  {allScenes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.vignetteType && s.vignetteType !== 'none' ? 'Capítulo' : s.sceneType === 'hypercard_stack' ? 'Cenário' : 'Ramificação'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ACTION: EXAMINE MODAL */}
            {hotspot.actionType === 'examine' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t('hypercard.fields.examineText', 'Texto da Mensagem')}
                  </label>
                  <textarea
                    rows={4}
                    value={hotspot.examineText || ''}
                    onChange={(e) => handleFieldChange('examineText', e.target.value)}
                    placeholder={t('hypercard.fields.examineTextPlaceholder', 'Descreva o que o jogador lê, sente ou observa...')}
                    className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* EXAMINE IMAGE UPLOAD */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t('hypercard.fields.examineImage', 'Imagem do Diálogo (Opcional)')}
                  </label>
                  <ImageUploadField
                    value={hotspot.examineImage}
                    onChange={(img) => handleFieldChange('examineImage', img)}
                    className="relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden border border-muted-foreground/50 group"
                  />
                  <p className="text-[10px] text-muted-foreground text-center mt-1.5 italic">
                    {t('hypercard.examineImageHint', 'Esta imagem será exibida ao examinar a área interativa, ao lado do texto descritivo.')}
                  </p>
                </div>
              </div>
            )}

            {/* ACTION: COLLECT OBJECT */}
            {hotspot.actionType === 'collect_item' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    {t('hypercard.fields.collectItem', 'Objeto a coletar')}
                  </label>
                  <select
                    value={hotspot.addsToInventory || ''}
                    onChange={(e) => handleFieldChange('addsToInventory', e.target.value)}
                    className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors [&>optgroup]:font-bold [&>optgroup]:text-muted-foreground"
                  >
                    <option value="">{t('hypercard.selectItemPlaceholder', '-- Selecione o Objeto --')}</option>
                    {sceneObjects.length > 0 && (
                      <optgroup label={t('hypercard.sceneObjectsGroup', 'Objetos do Cenário')}>
                        {sceneObjects.map((obj) => (
                          <option key={obj.id} value={obj.id}>
                            {obj.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {otherObjects.length > 0 && (
                      <optgroup label={t('hypercard.otherObjectsGroup', 'Outros Objetos do Projeto')}>
                        {otherObjects.map((obj) => (
                          <option key={obj.id} value={obj.id}>
                            {obj.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t('hypercard.fields.actionText', 'Texto da ação')}
                  </label>
                  <textarea
                    rows={3}
                    value={hotspot.examineText || ''}
                    onChange={(e) => handleFieldChange('examineText', e.target.value)}
                    placeholder={t('hypercard.fields.actionTextPlaceholder', 'Descreva o feedback da coleta (ex: Você pegou a chave e guardou no inventário...)')}
                    className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5 italic">
                    {t('hypercard.fields.actionTextHint', 'Mensagem exibida no modal pop-up ao coletar o objeto. Caso o objeto tenha imagem cadastrada, ela será exibida no modal.')}
                  </p>
                </div>
              </div>
            )}

            {/* ACTION: TOGGLE TRACKER */}
            {hotspot.actionType === 'toggle_tracker' && (
              <div className="space-y-4">
                {consequenceTrackers.length === 0 ? (
                  <div className="p-4 border border-dashed border-muted-foreground/40 rounded-2xl bg-muted/20 text-center space-y-3">
                    <p className="text-xs text-muted-foreground">
                      {t('hypercard.noTrackersConfigured', 'Nenhum rastreador configurado no projeto.')}
                    </p>
                    {onNavigateToTrackers && (
                      <button
                        type="button"
                        onClick={onNavigateToTrackers}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        {t('hypercard.configureTrackers', 'Configurar Rastreadores')}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {t('hypercard.fields.trackers', 'Rastreadores')}
                      </label>
                      <button
                        type="button"
                        onClick={handleAddTrackerEffect}
                        disabled={(consequenceTrackers || []).length === 0}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold uppercase transition-colors ${
                          (consequenceTrackers || []).length === 0
                            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                            : 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> {t('interactionEditor.linkBtn', 'Vincular')}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(hotspot.trackerEffects || []).map((effect, i) => {
                        const tracker = (consequenceTrackers || []).find(t => t && t.id === effect.trackerId);
                        const TrackerIcon = TRACKER_ICONS.find(icon => icon.name === tracker?.icon)?.component || Activity;

                        return (
                          <div key={i} className="flex items-center gap-2 bg-background p-2.5 rounded-xl border border-muted-foreground/30">
                            <TrackerIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <select
                              value={effect.trackerId || ''}
                              onChange={(e) => handleTrackerEffectChange(i, 'trackerId', e.target.value)}
                              className="flex-1 bg-transparent border-none text-xs font-semibold text-foreground focus:ring-0 p-0"
                            >
                              <option value="" className="bg-popover text-foreground">
                                {t('interactionEditor.selectTracker', 'Selecione um rastreador...')}
                              </option>
                              {(consequenceTrackers || []).map((tOption) => tOption && (
                                <option key={tOption.id} value={tOption.id} className="bg-popover text-foreground">
                                  {tOption.name}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg border border-muted-foreground/30">
                              <span className="text-[10px] text-muted-foreground font-bold">{t('interactionEditor.valueLabel', 'Valor:')}</span>
                              <input
                                type="number"
                                value={effect.valueChange}
                                onChange={(e) => handleTrackerEffectChange(i, 'valueChange', e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-12 bg-transparent border-none text-xs h-auto p-0 text-right text-foreground font-mono font-bold focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTrackerEffect(i)}
                              className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}

                      {(hotspot.trackerEffects || []).length === 0 && (
                        <div className="text-center py-4 border border-dashed border-muted-foreground/40 rounded-xl bg-muted/10">
                          <p className="text-xs text-muted-foreground italic">
                            {t('hypercard.noLinkedTrackers', 'Clique em "+ Vincular" para associar um rastreador a esta ação.')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Feedback Text */}
                    <div className="mt-3">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        {t('hypercard.fields.actionText', 'Texto da ação')}
                      </label>
                      <textarea
                        rows={3}
                        value={hotspot.examineText || ''}
                        onChange={(e) => handleFieldChange('examineText', e.target.value)}
                        placeholder={t('hypercard.fields.actionTextPlaceholder', 'Descreva o feedback ao alterar o rastreador...')}
                        className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1.5 italic">
                        {t('hypercard.fields.actionTextHint', 'Mensagem exibida no modal pop-up ao executar a ação.')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONDITIONS & INVENTORY */}
        {activeTab === 'conditions' && (
          <div className="space-y-4">
            {/* Requires in Inventory */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                {t('hypercard.fields.requiresInInventory', 'Requer Item no Inventário')}
              </label>
              <select
                value={hotspot.requiresInInventory || ''}
                onChange={(e) => handleFieldChange('requiresInInventory', e.target.value || undefined)}
                className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">{t('hypercard.noRequirement', 'Nenhum requisito')}</option>
                {Object.values(globalObjects).map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Consumes Item */}
            {hotspot.requiresInInventory && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="consumesItemCheck"
                  checked={!!hotspot.consumesItem}
                  onChange={(e) => handleFieldChange('consumesItem', e.target.checked)}
                  className="rounded border-muted-foreground text-primary focus:ring-primary w-4 h-4"
                />
                <label htmlFor="consumesItemCheck" className="text-sm text-foreground font-medium cursor-pointer">
                  {t('hypercard.fields.consumesItem', 'Consumir/remover item ao usar')}
                </label>
              </div>
            )}

            {/* Locked Message */}
            {hotspot.requiresInInventory && (
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {t('hypercard.fields.lockedMessage', 'Mensagem de Bloqueio')}
                </label>
                <input
                  type="text"
                  value={hotspot.lockedMessage || ''}
                  onChange={(e) => handleFieldChange('lockedMessage', e.target.value)}
                  placeholder="Ex: A porta está trancada. Você precisa de uma chave."
                  className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )}

      {/* Sticky Footer: Action Bar (Desfazer + Salvar Alterações + Excluir Área on left) */}
      <div className="@container sticky bottom-0 left-0 right-0 bg-background px-4 pb-4 pt-2 flex flex-col gap-3 z-50">
        {/* Gradient transition below footer */}
        <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        <div className="flex w-full items-center justify-between gap-2">
          {/* Left Side: Excluir Área (if hotspot is selected, aligned to left) */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hotspot && (
              <button
                type="button"
                onClick={() => onDeleteHotspot(hotspot.id)}
                className="flex items-center justify-center gap-1.5 px-3 h-[56px] text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 rounded-lg whitespace-nowrap transition-colors flex-initial min-w-0 shrink-0"
                title={t('hypercard.deleteHotspotBtn', 'Excluir Área')}
              >
                <Trash2 className="w-4 h-4 shrink-0" />
                <span className="hidden @[340px]:inline-block truncate">{t('hypercard.deleteHotspotBtn', 'Excluir Área')}</span>
              </button>
            )}
          </div>

          {/* Right Side: Desfazer + Salvar Alterações */}
          <div className="flex items-center gap-2 flex-none">
            <button
              type="button"
              onClick={onUndo}
              disabled={!isDirty}
              className="flex items-center justify-center gap-1.5 px-3 h-[56px] text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors bg-zinc-800/50 hover:bg-zinc-800 border border-muted-foreground/50 rounded-lg whitespace-nowrap flex-none shrink-0"
              title={t('sceneEditor.undoBtn', 'Desfazer')}
            >
              <RotateCcw className="w-4 h-4 shrink-0" strokeWidth={2.5} />
              <span className="hidden @[340px]:inline-block truncate">{t('sceneEditor.undoBtn', 'Desfazer')}</span>
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={!isDirty}
              className="flex items-center justify-center gap-1.5 px-3.5 h-[56px] bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed whitespace-nowrap flex-none shrink-0 shadow-lg"
              title={t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}
            >
              <Save className="w-4 h-4 shrink-0" strokeWidth={2.5} />
              <span className="hidden @[260px]:inline-block truncate">{t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
