import React, { useState, useMemo, useEffect } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { Interaction, Scene, GameObject, ConsequenceTracker, TrackerEffect, Vignette } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Plus, Trash2, Upload, Search, MousePointer2, Box, ArrowRight, MessageSquare, Play, Volume2, Target, CheckCircle2, Activity, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon, Sword, Key, Map as MapIcon, Eye, FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

const INTERACTION_ICONS = [
    { name: 'mouse', component: MousePointer2 },
    { name: 'box', component: Box },
    ...TRACKER_ICONS
];

interface InteractionEditorProps {
    interactions: Interaction[];
    onUpdateInteractions: (interactions: Interaction[]) => void;
    allScenes: Scene[];
    currentSceneId: string;
    sceneObjects: GameObject[];
    allTakableObjects: GameObject[];
    consequenceTrackers: ConsequenceTracker[];
    vignettes: Vignette[];
    isSidePanel?: boolean;
}

const generateUniqueId = (prefix: 'inter', existingIds: string[]): string => {
    let id;
    do { id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`; } while (existingIds.includes(id));
    return id;
};

const InteractionEditor: React.FC<InteractionEditorProps> = ({
    interactions,
    onUpdateInteractions,
    allScenes,
    currentSceneId,
    sceneObjects,
    allTakableObjects,
    consequenceTrackers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vignettes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSidePanel
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(interactions.length > 0 ? 0 : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; index: number | null }>({ isOpen: false, index: null });
    const { t } = useTranslation();

    const handleAdd = () => {
        const newInteraction: Interaction = {
            id: generateUniqueId('inter', interactions.map(i => i.id)),
            verbs: ['usar'],
            target: ''
        };
        const newInteractions = [...interactions, newInteraction];
        onUpdateInteractions(newInteractions);
        setSelectedIndex(newInteractions.length - 1);
    };

    const handleRemove = (index: number) => {
        setDeleteModal({ isOpen: true, index });
    };

    const confirmRemove = () => {
        if (deleteModal.index === null) return;
        const index = deleteModal.index;
        const newInteractions = interactions.filter((_, i) => i !== index);
        onUpdateInteractions(newInteractions);
        if (selectedIndex === index) {
            setSelectedIndex(null);
        } else if (selectedIndex !== null && selectedIndex > index) {
            setSelectedIndex(selectedIndex - 1);
        }
        setDeleteModal({ isOpen: false, index: null });
    };

    const handleUpdate = (index: number, updatedInteraction: Interaction) => {
        const newInteractions = [...interactions];
        newInteractions[index] = updatedInteraction;
        onUpdateInteractions(newInteractions);
    };

    // Filter logic
    const filteredInteractions = useMemo(() => {
        return interactions.map((inter, index) => ({ inter, index })).filter(({ inter }) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                inter.verbs.join(' ').toLowerCase().includes(searchLower) ||
                (inter.target && sceneObjects.find(o => o.id === inter.target)?.name.toLowerCase().includes(searchLower))
            );
        });
    }, [interactions, searchTerm, sceneObjects]);

    const selectedInteraction = selectedIndex !== null ? interactions[selectedIndex] : null;

    const [verbsInput, setVerbsInput] = useState('');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    // Sync local input state when selection changes
    useEffect(() => {
        if (selectedInteraction) {
            setVerbsInput(selectedInteraction.verbs.join(', '));
        }
        setIsIconPickerOpen(false);
    }, [selectedInteraction]);

    // Helper to render interaction editor (reused logic from previous component, adapted)
    const renderEditor = () => {
        if (!selectedInteraction || selectedIndex === null) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleInteractionChange = (field: keyof Interaction, value: any) => {
            handleUpdate(selectedIndex, { ...selectedInteraction, [field]: value });
        };

        const handleVerbsBlur = () => {
            const newVerbs = verbsInput.split(',').map(v => v.trim()).filter(Boolean);
            // Only update if different to avoid cycles if we were doing this in effect
            if (JSON.stringify(newVerbs) !== JSON.stringify(selectedInteraction.verbs)) {
                handleInteractionChange('verbs', newVerbs);
            }
            // Optional: Re-format input formatting on blur
            setVerbsInput(newVerbs.join(', '));
        };

        const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target && typeof event.target.result === 'string') {
                        handleInteractionChange('soundEffect', event.target.result);
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleTrackerEffectChange = (effectIndex: number, field: keyof TrackerEffect, value: any) => {
            const newEffects = [...(selectedInteraction.trackerEffects || [])];
            newEffects[effectIndex] = { ...newEffects[effectIndex], [field]: value };
            handleInteractionChange('trackerEffects', newEffects);
        };

        const handleAddTrackerEffect = () => {
            const newEffect: TrackerEffect = { trackerId: '', valueChange: 10 };
            handleInteractionChange('trackerEffects', [...(selectedInteraction.trackerEffects || []), newEffect]);
        };

        const handleRemoveTrackerEffect = (effectIndex: number) => {
            handleInteractionChange('trackerEffects', (selectedInteraction.trackerEffects || []).filter((_, i) => i !== effectIndex));
        };


        return (
            <div className="flex flex-col h-full" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pt-0 pb-6 px-6 relative">
                    {/* Soft top gradient */}
                    <div className="sticky top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent pointer-events-none z-10 -ml-6 -mr-6" />
                    <div className="max-w-xl mx-auto flex flex-col gap-6">
                        {/* Row 1: Icon & Verbs */}
                        <div className="flex gap-4 items-start">
                            {/* Icon Picker */}
                            <div className="space-y-1.5 shrink-0 relative">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.iconLabel', 'Ícone')}</label>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsIconPickerOpen(!isIconPickerOpen);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center bg-input border border-input rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                                >
                                    {(() => {
                                        const Icon = INTERACTION_ICONS.find(i => i.name === selectedInteraction.icon)?.component || MousePointer2;
                                        return <Icon className="w-5 h-5" />;
                                    })()}
                                </button>

                                {isIconPickerOpen && (
                                    <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-popover border border-muted-foreground/50 rounded-lg z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                        {INTERACTION_ICONS.map(icon => (
                                            <button
                                                key={icon.name}
                                                onClick={() => { handleInteractionChange('icon', icon.name); setIsIconPickerOpen(false); }}
                                                className={`p-2 rounded hover:bg-accent flex items-center justify-center transition-colors ${selectedInteraction.icon === icon.name || (!selectedInteraction.icon && icon.name === 'mouse') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                                                title={icon.name}
                                            >
                                                <icon.component className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Verbs */}
                            <div className="flex-1 space-y-1.5">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.verbsLabel', 'Verbos (separados por vírgula)')}</label>
                                <input
                                    type="text"
                                    value={verbsInput}
                                    onChange={e => setVerbsInput(e.target.value)}
                                    onBlur={handleVerbsBlur}
                                    className="w-full bg-input border border-input rounded-lg p-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
                                    placeholder={t('interactionEditor.verbsPlaceholder', 'ex: pegar, usar, abrir')}
                                />
                                <p className="text-[10px] text-zinc-600">{t('interactionEditor.verbsDesc', 'O jogador deve digitar um destes para iniciar a ação.')}</p>
                            </div>
                        </div>

                        {/* Row 2: Requirement & Checkboxes */}
                        <div className="flex gap-4 items-end">
                            <div className="flex-1 space-y-1.5">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.requiresItemLabel', 'Requer Item (Inventário)')}</label>
                                <select
                                    value={selectedInteraction.requiresInInventory || ''}
                                    onChange={e => handleInteractionChange('requiresInInventory', e.target.value || undefined)}
                                    className="w-full bg-input border border-input rounded-lg p-2.5 text-xs text-foreground"
                                >
                                    <option value="">{t('interactionEditor.noItemRequired', 'Não requer item')}</option>
                                    {allTakableObjects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                                </select>
                            </div>

                            <div className="pb-2.5 pr-2">
                                <label className={`flex items-center gap-2 cursor-pointer group ${!selectedInteraction.requiresInInventory && 'opacity-30 pointer-events-none'}`}>
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedInteraction.consumesItem}
                                            onChange={e => handleInteractionChange('consumesItem', e.target.checked)}
                                            disabled={!selectedInteraction.requiresInInventory}
                                            className="custom-checkbox"
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.consumesItem', 'Consome item')}</span>
                                </label>
                            </div>
                        </div>

                        {/* Row 3: Target */}
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.targetLabel', 'Objeto alvo da Ação (Opcional)')}</label>
                                <select
                                    value={selectedInteraction.target}
                                    onChange={e => handleInteractionChange('target', e.target.value)}
                                    className="w-full bg-input border border-input rounded-lg p-2.5 text-xs text-foreground"
                                >
                                    <option value="">{t('interactionEditor.noTarget', 'Nenhum (Ação no ambiente)')}</option>
                                    {sceneObjects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                                </select>
                            </div>

                            {/* Target Checkboxes */}
                            <div className="flex flex-row items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedInteraction.removesTargetFromScene}
                                            onChange={e => handleInteractionChange('removesTargetFromScene', e.target.checked)}
                                            className="custom-checkbox"
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.removesTarget', 'Remove objeto')}</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedInteraction.addsToInventory}
                                            onChange={e => handleInteractionChange('addsToInventory', e.target.checked)}
                                            className="custom-checkbox"
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.addsToInventory', 'Adiciona ao inventário')}</span>
                                </label>

                                <label className={`flex items-center gap-2 cursor-pointer group ${!selectedInteraction.addsToInventory && 'opacity-30 pointer-events-none'}`}>
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedInteraction.showObjectImage}
                                            onChange={e => handleInteractionChange('showObjectImage', e.target.checked)}
                                            disabled={!selectedInteraction.addsToInventory}
                                            className="custom-checkbox"
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.showObjectImage', 'Exibir imagem do objeto')}</span>
                                </label>
                            </div>
                        </div>

                        {/* Row 5: Go To Scene & Sound Effect */}
                        <div className="flex gap-4 items-start">
                            <div className="w-2/3 space-y-1.5">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.goToSceneLabel', 'Ir para Ramificação')}</label>
                                <select value={selectedInteraction.goToScene || ''} onChange={e => handleInteractionChange('goToScene', e.target.value)} className="w-full bg-input border border-input rounded p-2.5 text-xs text-foreground h-[42px]">
                                    <option value="">{t('interactionEditor.stayInScene', '(Permanecer na ramificação)')}</option>
                                    {allScenes.filter(s => s.id !== currentSceneId).map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                                </select>
                            </div>
                            <div className="w-1/3 space-y-1.5">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.soundEffectLabel', 'Efeito Sonoro (.mp3)')}</label>
                                <div className="flex items-center gap-2 h-[42px]">
                                    <label className="flex-1 h-full flex items-center justify-center px-3 py-2 bg-input border border-input rounded hover:bg-muted cursor-pointer text-xs font-medium transition-colors">
                                        <Upload className="w-3 h-3 mr-2 text-muted-foreground" /> {selectedInteraction.soundEffect ? t('interactionEditor.changeBtn', 'Alterar') : t('interactionEditor.uploadBtn', 'Upload')}
                                        <input type="file" accept="audio/*" onChange={handleSoundUpload} className="hidden" />
                                    </label>
                                    {selectedInteraction.soundEffect && (
                                        <button onClick={() => handleInteractionChange('soundEffect', undefined)} className="h-full px-3 bg-red-600 hover:bg-red-700 text-white rounded transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 6: Update Scene Description */}
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.updateSceneDescLabel', 'Atualizar descrição da ramificação')}</label>
                            <textarea
                                value={selectedInteraction.successMessage || ''} // Using legacy field for backward compatibility, UI says "Description"
                                onChange={e => handleInteractionChange('successMessage', e.target.value)}
                                rows={2}
                                className="w-full bg-input border border-input rounded p-2.5 text-xs text-foreground resize-y min-h-[40px] max-h-[250px]"
                                placeholder={t('interactionEditor.updateSceneDescPlaceholder', 'Descreve o que acontece...')}
                            />
                        </div>

                        {/* Row 7: Trackers */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.trackersLabel', 'Rastreadores')}</label>
                                <button 
                                    onClick={handleAddTrackerEffect} 
                                    disabled={consequenceTrackers.length === 0}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                                        consequenceTrackers.length === 0
                                            ? 'bg-zinc-500/10 text-zinc-500 cursor-not-allowed opacity-50'
                                            : 'bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-400'
                                    }`}
                                >
                                    <Plus className="w-3 h-3" /> {t('interactionEditor.addBtn', 'Adicionar')}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(selectedInteraction.trackerEffects || []).map((effect, i) => {
                                    const tracker = consequenceTrackers.find(t => t.id === effect.trackerId);
                                    const TrackerIcon = TRACKER_ICONS.find(icon => icon.name === tracker?.icon)?.component || Activity;
                                    
                                    return (
                                        <div key={i} className="flex items-center gap-2 bg-input p-2 rounded border border-input">
                                            <TrackerIcon className="w-3 h-3 text-muted-foreground" />
                                            <select 
                                                value={effect.trackerId} 
                                                onChange={e => handleTrackerEffectChange(i, 'trackerId', e.target.value)} 
                                                className="flex-1 bg-transparent border-none text-xs text-foreground focus:ring-0 p-0"
                                            >
                                                <option value="" className="bg-card text-foreground">{t('interactionEditor.selectTracker', 'Selecione um rastreador...')}</option>
                                                {consequenceTrackers.map(tOption => (
                                                    <option key={tOption.id} value={tOption.id} className="bg-card text-foreground">
                                                        {tOption.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded border border-muted-foreground/50">
                                                <span className="text-[10px] text-zinc-500">{t('interactionEditor.valueLabel', 'Valor:')}</span>
                                                <input type="number" value={effect.valueChange} onChange={e => handleTrackerEffectChange(i, 'valueChange', e.target.value === '' ? '' : Number(e.target.value))} className="w-12 bg-transparent border-none text-xs h-auto p-0 text-right text-foreground font-mono focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]" />
                                            </div>
                                            <button onClick={() => handleRemoveTrackerEffect(i)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    );
                                })}
                                {(selectedInteraction.trackerEffects || []).length === 0 && (
                                    <div className="text-center py-4 border border-dashed border-muted-foreground/50 rounded bg-muted/20">
                                        <p className="text-[10px] text-zinc-600 italic">{t('interactionEditor.noTrackerEffects', 'Em Rastreadores, crie um rastreador que verifique esta interação')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-1 h-full overflow-hidden">
            {/* LEFT SIDEBAR - List */}
            <div className="w-1/3 min-w-[250px] flex flex-col bg-muted-foreground/20 border-r border-primary/20">
                {/* Header/Search */}
                <div className="px-3 pt-4 pb-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={t('interactionEditor.searchPlaceholder', 'Buscar verbos...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-[42px] bg-background/50 text-foreground placeholder-muted-foreground border border-muted-foreground/30 focus:border-primary focus:bg-background"
                        />
                    </div>

                    {/* Create Interaction Button (Fixed) */}
                    <button
                        onClick={handleAdd}
                        className="w-full flex items-center justify-start px-3 h-[42px] bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-bold transition-all active:scale-[0.98] shadow-sm flex-shrink-0"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('interactionEditor.newInteractionBtn', 'Criar Interação')}
                    </button>
                </div>



                {/* List */}
                <div className="flex-1 overflow-y-auto min-h-0 pt-0 pb-8 pr-0 flex flex-col items-stretch relative">
                    {/* Soft top gradient */}
                    <div className="sticky top-0 left-0 right-0 h-4 bg-gradient-to-b from-[hsl(var(--muted-foreground)/0.2)] to-transparent pointer-events-none z-10" />

                    {filteredInteractions.length > 0 && (
                        filteredInteractions.map(({ inter, index }) => (
                            <button
                                key={inter.id}
                                onClick={() => setSelectedIndex(index)}
                                className={`relative overflow-hidden flex items-center gap-3 h-[42px] px-3 border-transparent transition-all text-left group flex-shrink-0 ${selectedIndex === index ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'text-foreground hover:bg-primary/10 hover:shadow-sm'}`}
                            >
                                <div className={`flex items-center justify-center shrink-0 ${selectedIndex === index ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                    {(() => {
                                        const Icon = INTERACTION_ICONS.find(i => i.name === inter.icon)?.component || MousePointer2;
                                        return <Icon className="w-4 h-4" />;
                                    })()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className={`text-xs font-bold truncate ${selectedIndex === index ? 'text-primary-foreground' : 'text-foreground'}`}>
                                        {inter.verbs.join(', ')}
                                    </div>
                                    <div className={`text-[10px] truncate flex items-center gap-1 ${selectedIndex === index ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                        {inter.target ? `${t('interactionEditor.targetPrefix', 'Alvo: ')}${sceneObjects.find(o => o.id === inter.target)?.name || '?'}` : t('interactionEditor.generalTarget', 'Geral')}
                                    </div>
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(index);
                                    }}
                                    className="absolute top-0 right-0 h-full w-12 flex items-center justify-center text-white transform translate-x-[calc(100%+2px)] group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20 cursor-pointer bg-red-500"
                                    title={t('interactionEditor.removeInteraction', 'Remover Interação')}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT MAIN PANEL - Editor */}
            <div className="flex-1 flex flex-col min-w-0">
                {selectedIndex !== null ? (
                    renderEditor()
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <MousePointer2 className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-sm font-bold text-muted-foreground mb-1">{t('interactionEditor.noInteractionSelected', 'Nenhuma interação selecionada')}</h4>
                        <p className="text-xs max-w-xs opacity-60">{t('interactionEditor.noInteractionDesc', 'Selecione uma interação da lista para editar ou crie uma nova.')}</p>
                    </div>
                )}
            </div>
            
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                title={t('interactionEditor.removeInteraction', 'Remover Interação')}
                message={`${t('common.deleteConfirm', 'Tem certeza?')}\n\n${t('interactionEditor.deleteDesc', 'Isso excluirá permanentemente esta interação.')}`}
                confirmText={t('common.delete', 'Excluir')}
                cancelText={t('common.cancel', 'Cancelar')}
                isDanger={true}
                onConfirm={confirmRemove}
                onCancel={() => setDeleteModal({ isOpen: false, index: null })}
            />
        </div>
    );
};

export default InteractionEditor;
