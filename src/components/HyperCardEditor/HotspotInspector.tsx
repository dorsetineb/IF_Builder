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
import {
  Sliders,
  MousePointer,
  Trash2,
  Volume2,
  Lock,
  ArrowRight,
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
} from 'lucide-react';

export const HOTSPOT_ICONS = [
  { name: 'eye', component: Eye, label: 'Olho (Observar)' },
  { name: 'mouse', component: MousePointer2, label: 'Ponteiro / Clique' },
  { name: 'hand', component: Hand, label: 'Mão (Interagir)' },
  { name: 'search', component: Search, label: 'Lupa (Investigar)' },
  { name: 'box', component: Box, label: 'Caixa / Objeto' },
  { name: 'key', component: Key, label: 'Chave' },
  { name: 'sword', component: Sword, label: 'Espada / Combate' },
  { name: 'flask', component: FlaskConical, label: 'Poção / Frasco' },
  { name: 'book', component: Book, label: 'Livro / Texto' },
  { name: 'map', component: MapIcon, label: 'Mapa / Navegação' },
  { name: 'crown', component: Crown, label: 'Coroa / Recompensa' },
  { name: 'star', component: Star, label: 'Estrela' },
  { name: 'heart', component: Heart, label: 'Coração / Vida' },
  { name: 'zap', component: Zap, label: 'Raio / Energia' },
  { name: 'shield', component: Shield, label: 'Escudo / Proteção' },
  { name: 'coins', component: Coins, label: 'Moedas / Valor' },
  { name: 'clock', component: Clock, label: 'Relógio / Tempo' },
  { name: 'skull', component: Skull, label: 'Caveira / Perigo' },
  { name: 'user', component: User, label: 'Personagem' },
  { name: 'trophy', component: Trophy, label: 'Troféu' },
  { name: 'alert', component: AlertTriangle, label: 'Alerta' },
  { name: 'flame', component: Flame, label: 'Fogo' },
  { name: 'droplet', component: Droplet, label: 'Gota / Água' },
  { name: 'sun', component: Sun, label: 'Sol / Luz' },
  { name: 'moon', component: Moon, label: 'Lua / Noite' },
  { name: 'activity', component: Activity, label: 'Atividade' },
];

interface HotspotInspectorProps {
  hotspot: CardHotspot | null;
  card: HyperCard;
  allCards: HyperCard[];
  allScenes: Scene[];
  globalObjects: { [id: string]: GameObject };
  consequenceTrackers: ConsequenceTracker[];
  onUpdateHotspot: (updatedHotspot: CardHotspot) => void;
  onDeleteHotspot: (hotspotId: string) => void;
  onUploadSound?: (file: File) => void;
}

export const HotspotInspector: React.FC<HotspotInspectorProps> = ({
  hotspot,
  card,
  allCards,
  allScenes,
  globalObjects,
  consequenceTrackers,
  onUpdateHotspot,
  onDeleteHotspot,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'visual' | 'action' | 'conditions'>('visual');
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  if (!hotspot) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground select-none bg-card">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
          <MousePointer className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-foreground mb-1 text-sm">
          {t('hypercard.noHotspotSelected', 'Nenhuma Área Selecionada')}
        </h4>
        <p className="text-xs max-w-[220px] text-muted-foreground leading-relaxed">
          {t('hypercard.selectHotspotHint', 'Clique em uma área na imagem ou desenhe uma nova para configurar suas ações e propriedades.')}
        </p>
      </div>
    );
  }

  const handleFieldChange = <K extends keyof CardHotspot>(field: K, value: CardHotspot[K]) => {
    onUpdateHotspot({ ...hotspot, [field]: value });
  };

  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const activeIconName = hotspot.icon || 'eye';
  const CurrentIconComponent = HOTSPOT_ICONS.find(i => i.name === activeIconName)?.component || Eye;
  const currentIconLabel = HOTSPOT_ICONS.find(i => i.name === activeIconName)?.label || 'Olho (Observar)';

  const normalizedHighlightStyle = 
    hotspot.highlightStyle === 'always-visible' || hotspot.highlightStyle === 'icons-visible' || hotspot.highlightStyle === 'pulsing-pin'
      ? 'icons-visible'
      : hotspot.highlightStyle === 'hidden'
      ? 'hidden'
      : 'icons-hover';

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden bg-card select-none"
      onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}
    >
      {/* Header with Direct Inline Title Edit */}
      <div className="p-3.5 border-b border-muted-foreground/30 flex flex-col gap-1 flex-shrink-0 bg-card">
        <input
          type="text"
          value={hotspot.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder={t('hypercard.hotspotDefault', 'Nome da Área Interativa')}
          className="w-full bg-transparent hover:bg-background/50 focus:bg-background border border-transparent hover:border-muted-foreground/30 focus:border-primary rounded-lg px-2 py-1 font-bold text-sm text-foreground focus:outline-none transition-all"
        />
        <span className="text-[10px] text-muted-foreground font-mono uppercase px-2">
          ID: {hotspot.id}
        </span>
      </div>

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

            {/* Icon Picker */}
            {normalizedHighlightStyle !== 'hidden' && (
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    {t('hypercard.fields.hotspotIcon', 'Ícone de Realce')}
                  </label>
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
                        <span className="truncate">{currentIconLabel}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-normal">Alterar</span>
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
                              title={item.label}
                            >
                              <ItemIcon className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Colors & Background Customization */}
                <div className="space-y-3 p-3 bg-background/50 rounded-xl border border-muted-foreground/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {t('hypercard.fields.iconColors', 'Cores do Ícone')}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!hotspot.hideIconBg}
                        onChange={(e) => handleFieldChange('hideIconBg', e.target.checked)}
                        className="rounded border-muted-foreground text-primary focus:ring-primary w-4 h-4"
                      />
                      <span className="text-xs text-muted-foreground font-medium">
                        {t('hypercard.fields.removeBg', 'Remover fundo')}
                      </span>
                    </label>
                  </div>

                  <div className="space-y-2.5">
                    <ColorInput
                      label="Cor do Ícone"
                      id={`hotspot-icon-color-${hotspot.id}`}
                      value={hotspot.iconColor || '#ffffff'}
                      onChange={(val) => handleFieldChange('iconColor', val)}
                      placeholder="#ffffff"
                    />

                    {!hotspot.hideIconBg && (
                      <>
                        <ColorInput
                          label="Cor do Fundo (Quadrado)"
                          id={`hotspot-bg-color-${hotspot.id}`}
                          value={hotspot.iconBgColor || '#000000'}
                          onChange={(val) => handleFieldChange('iconBgColor', val)}
                          placeholder="#000000"
                        />

                        <ColorInput
                          label="Cor da Borda"
                          id={`hotspot-border-color-${hotspot.id}`}
                          value={hotspot.iconBorderColor || '#30363d'}
                          onChange={(val) => handleFieldChange('iconBorderColor', val)}
                          placeholder="#30363d"
                        />
                      </>
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
                <option value="collect_item">{t('hypercard.actions.collectItem', 'Coletar Item para Inventário')}</option>
                <option value="toggle_tracker">{t('hypercard.actions.toggleTracker', 'Alterar Contador / Tracker')}</option>
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
              <div className="space-y-3 p-3 bg-background/60 rounded-xl border border-muted-foreground/30">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t('hypercard.fields.examineTitle', 'Título do Diálogo')}
                  </label>
                  <input
                    type="text"
                    value={hotspot.examineTitle || ''}
                    onChange={(e) => handleFieldChange('examineTitle', e.target.value)}
                    placeholder="Ex: Inscrição Antiga"
                    className="w-full bg-background border border-muted-foreground/30 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t('hypercard.fields.examineText', 'Texto da Mensagem')}
                  </label>
                  <textarea
                    rows={3}
                    value={hotspot.examineText || ''}
                    onChange={(e) => handleFieldChange('examineText', e.target.value)}
                    placeholder="Descreva o que o jogador lê, sente ou observa..."
                    className="w-full bg-background border border-muted-foreground/30 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}

            {/* ACTION: COLLECT ITEM */}
            {hotspot.actionType === 'collect_item' && (
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {t('hypercard.fields.collectItem', 'Item a Coletar')}
                </label>
                <select
                  value={hotspot.addsToInventory || ''}
                  onChange={(e) => handleFieldChange('addsToInventory', e.target.value)}
                  className="w-full bg-background border border-muted-foreground/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">{t('hypercard.selectItemPlaceholder', '-- Selecione o Item --')}</option>
                  {Object.values(globalObjects).map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  ))}
                </select>
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

            {/* Tracker Effects */}
            {consequenceTrackers.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {t('hypercard.fields.trackers', 'Efeito em Contadores')}
                </label>
                <div className="space-y-2">
                  {consequenceTrackers.map((tracker) => {
                    const existing = hotspot.trackerEffects?.find(t => t.trackerId === tracker.id);
                    const val = existing ? existing.valueChange : 0;
                    return (
                      <div key={tracker.id} className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-muted-foreground/30 text-sm">
                        <span className="font-semibold text-foreground truncate max-w-[130px]">
                          {tracker.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newVal = val - 1;
                              const filtered = (hotspot.trackerEffects || []).filter(t => t.trackerId !== tracker.id);
                              if (newVal !== 0) filtered.push({ trackerId: tracker.id, valueChange: newVal });
                              handleFieldChange('trackerEffects', filtered);
                            }}
                            className="w-7 h-7 rounded-lg bg-muted hover:bg-muted-foreground/20 font-bold flex items-center justify-center text-foreground transition-colors"
                          >
                            -
                          </button>
                          <span className={`w-7 text-center font-mono font-bold ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                            {val > 0 ? `+${val}` : val}
                          </span>
                          <button
                            onClick={() => {
                              const newVal = val + 1;
                              const filtered = (hotspot.trackerEffects || []).filter(t => t.trackerId !== tracker.id);
                              if (newVal !== 0) filtered.push({ trackerId: tracker.id, valueChange: newVal });
                              handleFieldChange('trackerEffects', filtered);
                            }}
                            className="w-7 h-7 rounded-lg bg-muted hover:bg-muted-foreground/20 font-bold flex items-center justify-center text-foreground transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer: Prominent Delete Hotspot Button */}
      <div className="p-3 border-t border-muted-foreground/30 bg-background/50 flex-shrink-0">
        <button
          onClick={() => onDeleteHotspot(hotspot.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-sm font-bold text-red-400 hover:text-red-300 transition-all shadow-sm active:scale-98"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('hypercard.deleteHotspotBtn', 'Excluir Área Interativa')}</span>
        </button>
      </div>
    </div>
  );
};
