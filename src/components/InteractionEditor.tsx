import React, { useState, useMemo, useEffect } from 'react';
import { Interaction, Scene, GameObject, ConsequenceTracker, TrackerEffect, Vignette } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Plus, Trash2, Upload, Search, MousePointer2, ArrowRight, MessageSquare, Play, Volume2, Target, CheckCircle2, Activity, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon } from 'lucide-react';
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
];

const INTERACTION_ICONS = [
    { name: 'mouse', component: MousePointer2 },
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
    vignettes
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(interactions.length > 0 ? 0 : null);
    const [searchTerm, setSearchTerm] = useState('');
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
        if (window.confirm(t('interactionEditor.deleteConfirm', 'Tem certeza que deseja remover esta interação?'))) {
            const newInteractions = interactions.filter((_, i) => i !== index);
            onUpdateInteractions(newInteractions);
            if (selectedIndex === index) {
                setSelectedIndex(null);
            } else if (selectedIndex !== null && selectedIndex > index) {
                setSelectedIndex(selectedIndex - 1);
            }
        }
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
                {/* Header */}
                <div className="px-6 py-4 border-b border-muted-foreground/10 flex justify-between items-center bg-zinc-900/30 shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                            {(() => {
                                const Icon = INTERACTION_ICONS.find(i => i.name === selectedInteraction.icon)?.component || MousePointer2;
                                return <Icon className="w-4 h-4 text-green-500" />;
                            })()}
                            {t('interactionEditor.editingInteraction', 'Editando Interação #{{index}}', { index: selectedIndex + 1 })}
                        </h3>
                    </div>
                    <div>
                        <button
                            onClick={() => handleRemove(selectedIndex)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-md transition-all"
                            title={t('interactionEditor.removeInteraction', 'Remover Interação')}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* GATILHOS (Triggers) */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Target className="w-3 h-3" /> {t('interactionEditor.triggersConditions', 'Gatilhos & Condições')}
                        </h4>
                        <div className="bg-zinc-950/30 p-4 rounded-lg border border-muted-foreground/10 space-y-6">

                            {/* Row 1: Icon, Verbs, Target */}
                            <div className="flex gap-4 items-start">
                                {/* Icon Picker */}
                                <div className="space-y-1.5 shrink-0 relative">
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.iconLabel', 'Ícone')}</label>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsIconPickerOpen(!isIconPickerOpen);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-green-500/50 transition-all"
                                    >
                                        {(() => {
                                            const Icon = INTERACTION_ICONS.find(i => i.name === selectedInteraction.icon)?.component || MousePointer2;
                                            return <Icon className="w-5 h-5" />;
                                        })()}
                                    </button>

                                    {isIconPickerOpen && (
                                        <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => { handleInteractionChange('icon', undefined); setIsIconPickerOpen(false); }}
                                                className={`p-2 rounded hover:bg-zinc-800 flex items-center justify-center transition-colors ${!selectedInteraction.icon ? 'bg-green-500/20 text-green-400' : 'text-zinc-500'}`}
                                                title={t('interactionEditor.defaultIcon', 'Padrão')}
                                            >
                                                <MousePointer2 className="w-4 h-4" />
                                            </button>
                                            {TRACKER_ICONS.map(icon => (
                                                <button
                                                    key={icon.name}
                                                    onClick={() => { handleInteractionChange('icon', icon.name); setIsIconPickerOpen(false); }}
                                                    className={`p-2 rounded hover:bg-zinc-800 flex items-center justify-center transition-colors ${selectedInteraction.icon === icon.name ? 'bg-green-500/20 text-green-400' : 'text-zinc-500'}`}
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
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-100 focus:ring-1 focus:ring-green-500/50 placeholder:text-zinc-600"
                                        placeholder={t('interactionEditor.verbsPlaceholder', 'ex: pegar, usar, abrir')}
                                    />
                                    <p className="text-[10px] text-zinc-600">{t('interactionEditor.verbsDesc', 'O jogador deve digitar um destes para iniciar a ação.')}</p>
                                </div>

                                {/* Target */}
                                <div className="w-[30%] space-y-1.5">
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.targetLabel', 'Alvo da Ação (Opcional)')}</label>
                                    <select
                                        value={selectedInteraction.target}
                                        onChange={e => handleInteractionChange('target', e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-300"
                                    >
                                        <option value="">{t('interactionEditor.noTarget', 'Nenhum (Ação no ambiente)')}</option>
                                        {sceneObjects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Requirements & Consequences Checkboxes */}
                            <div className="flex gap-4 items-start pt-2 border-t border-zinc-800/50">
                                {/* Require Item */}
                                <div className="w-[45%] space-y-1.5">
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.requiresItemLabel', 'Requer Item (Inventário)')}</label>
                                    <select
                                        value={selectedInteraction.requiresInInventory || ''}
                                        onChange={e => handleInteractionChange('requiresInInventory', e.target.value || undefined)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-300"
                                    >
                                        <option value="">{t('interactionEditor.noItemRequired', 'Não requer item')}</option>
                                        {allTakableObjects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                                    </select>
                                </div>

                                {/* Checkboxes */}
                                <div className="flex-1 flex flex-row items-center gap-4 pt-6 flex-wrap">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={!!selectedInteraction.removesTargetFromScene}
                                                onChange={e => handleInteractionChange('removesTargetFromScene', e.target.checked)}
                                                className="custom-checkbox"
                                            />
                                        </div>
                                        <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.removesTarget', 'Remove Alvo da Cena')}</span>
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
                                        <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.addsToInventory', 'Adiciona ao Inventário')}</span>
                                    </label>

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
                                        <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.consumesItem', 'Consome Item Usado')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONSEQUÊNCIAS (Outcomes) */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> {t('interactionEditor.outcomeTitle', 'Resultado')}
                        </h4>
                        <div className="bg-zinc-950/30 p-4 rounded-lg border border-muted-foreground/10 space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">{t('interactionEditor.goToSceneLabel', 'Ir para Cena')}</label>
                                    <select value={selectedInteraction.goToScene || ''} onChange={e => handleInteractionChange('goToScene', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-300">
                                        <option value="">{t('interactionEditor.stayInScene', '(Permanecer na cena)')}</option>
                                        {allScenes.filter(s => s.id !== currentSceneId).map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                                    </select>
                                </div>

                                {/* Success Message aka Update Description */}
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">{t('interactionEditor.updateSceneDescLabel', 'Atualizar descrição da cena')}</label>
                                    <textarea
                                        value={selectedInteraction.successMessage || ''} // Using legacy field for backward compatibility, UI says "Description"
                                        onChange={e => handleInteractionChange('successMessage', e.target.value)}
                                        rows={2}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-300 resize-none"
                                        placeholder={t('interactionEditor.updateSceneDescPlaceholder', 'Descreve o que acontece...')}
                                    />
                                </div>

                                {/* Sound Effect - Moved Next to Description */}
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">{t('interactionEditor.soundEffectLabel', 'Efeito Sonoro (.mp3)')}</label>
                                    <div className="flex items-center gap-2 h-[50px]">
                                        <label className="flex-1 h-full flex items-center justify-center px-3 py-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 cursor-pointer text-xs font-medium transition-colors">
                                            <Upload className="w-3 h-3 mr-2 text-zinc-500" /> {selectedInteraction.soundEffect ? t('interactionEditor.changeBtn', 'Alterar') : t('interactionEditor.uploadBtn', 'Upload')}
                                            <input type="file" accept="audio/*" onChange={handleSoundUpload} className="hidden" />
                                        </label>
                                        {selectedInteraction.soundEffect && (
                                            <button onClick={() => handleInteractionChange('soundEffect', undefined)} className="h-full px-3 bg-red-500/10 text-red-500 rounded border border-red-500/20 hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                                        )}
                                    </div>
                                </div>

                                {/* Trackers - Full Width */}
                                <div className="col-span-2 pt-2 border-t border-zinc-800/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.trackersLabel', 'Rastreadores')}</label>
                                        <button onClick={handleAddTrackerEffect} className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold hover:bg-green-500/20 hover:text-green-400 transition-colors uppercase">
                                            <Plus className="w-3 h-3" /> {t('interactionEditor.addBtn', 'Adicionar')}
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(selectedInteraction.trackerEffects || []).map((effect, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-zinc-900 p-2 rounded border border-zinc-800">
                                                <Activity className="w-3 h-3 text-zinc-600" />
                                                <select value={effect.trackerId} onChange={e => handleTrackerEffectChange(i, 'trackerId', e.target.value)} className="flex-1 bg-transparent border-none text-xs text-zinc-200 focus:ring-0 p-0">
                                                    <option value="">{t('interactionEditor.selectTracker', 'Selecione um rastreador...')}</option>
                                                    {consequenceTrackers.map(tOption => <option key={tOption.id} value={tOption.id}>{tOption.name}</option>)}
                                                </select>
                                                <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                                                    <span className="text-[10px] text-zinc-500">{t('interactionEditor.valueLabel', 'Valor:')}</span>
                                                    <input type="number" value={effect.valueChange} onChange={e => handleTrackerEffectChange(i, 'valueChange', parseInt(e.target.value))} className="w-12 bg-transparent border-none text-xs h-auto p-0 text-right text-zinc-300 font-mono focus:ring-0" />
                                                </div>
                                                <button onClick={() => handleRemoveTrackerEffect(i)} className="p-1 text-zinc-500 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        ))}
                                        {(selectedInteraction.trackerEffects || []).length === 0 && (
                                            <div className="text-center py-4 border border-dashed border-zinc-800 rounded bg-zinc-900/30">
                                                <p className="text-[10px] text-zinc-600 italic">{t('interactionEditor.noTrackerEffects', 'Nenhum efeito em rastreadores configurado.')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-[600px] border border-muted-foreground/20 rounded-xl overflow-hidden bg-card shadow-sm">
            {/* LEFT SIDEBAR - List */}
            <div className="w-1/3 min-w-[250px] border-r border-muted-foreground/20 flex flex-col bg-zinc-950/30">
                {/* Header/Search */}
                <div className="p-4 border-b border-muted-foreground/10 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('interactionEditor.interactionsCount', 'Interações ({{count}})', { count: filteredInteractions.length })}</span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={t('interactionEditor.searchPlaceholder', 'Buscar verbos...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-green-500/50 placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredInteractions.length > 0 && (
                        filteredInteractions.map(({ inter, index }) => (
                            <button
                                key={inter.id}
                                onClick={() => setSelectedIndex(index)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left group ${selectedIndex === index ? 'bg-green-500/10 border-green-500/40' : 'bg-transparent border-transparent hover:bg-zinc-900 hover:border-zinc-800'}`}
                            >
                                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${selectedIndex === index ? 'bg-green-500/20 text-green-400' : 'bg-zinc-900 text-zinc-600'}`}>
                                    {(() => {
                                        const Icon = INTERACTION_ICONS.find(i => i.name === inter.icon)?.component || MousePointer2;
                                        return <Icon className="w-4 h-4" />;
                                    })()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className={`text-xs font-bold truncate ${selectedIndex === index ? 'text-green-400' : 'text-zinc-300'}`}>
                                        {inter.verbs.join(', ')}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 truncate flex items-center gap-1">
                                        {inter.target ? `${t('interactionEditor.targetPrefix', 'Alvo: ')}${sceneObjects.find(o => o.id === inter.target)?.name || '?'}` : t('interactionEditor.generalTarget', 'Geral')}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                    <button
                        onClick={handleAdd}
                        className="w-full py-2.5 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        {t('interactionEditor.newInteractionBtn', 'Nova Interação')}
                    </button>
                </div>
            </div>

            {/* RIGHT MAIN PANEL - Editor */}
            <div className="flex-1 flex flex-col bg-zinc-950/10 min-w-0">
                {selectedIndex !== null ? (
                    renderEditor()
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <MousePointer2 className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-sm font-bold text-zinc-400 mb-1">{t('interactionEditor.noInteractionSelected', 'Nenhuma interação selecionada')}</h4>
                        <p className="text-xs max-w-xs opacity-60">{t('interactionEditor.noInteractionDesc', 'Selecione uma interação da lista para editar ou crie uma nova.')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractionEditor;
