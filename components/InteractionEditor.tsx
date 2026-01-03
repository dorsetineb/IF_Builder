
import React, { useState, useEffect, useMemo } from 'react';
import { Interaction, Scene, GameObject, ConsequenceTracker, TrackerEffect } from '../types';
import { Plus, Trash2, Upload, ChevronDown } from 'lucide-react';

interface InteractionEditorProps {
    interactions: Interaction[];
    onUpdateInteractions: (interactions: Interaction[]) => void;
    allScenes: Scene[];
    currentSceneId: string;
    sceneObjects: GameObject[];
    allTakableObjects: GameObject[];
    consequenceTrackers: ConsequenceTracker[];
}

const getOutcomeType = (inter: Interaction): 'goToScene' | 'newSceneDescription' => {
    if (inter.newSceneDescription !== undefined) return 'newSceneDescription';
    return 'goToScene';
};

const InteractionItem: React.FC<{
    interaction: Interaction;
    index: number;
    onUpdate: (index: number, interaction: Interaction) => void;
    onRemove: (index: number) => void;
    allScenes: Scene[];
    currentSceneId: string;
    sceneObjects: GameObject[];
    allTakableObjects: GameObject[];
    consequenceTrackers: ConsequenceTracker[];
}> = ({ interaction, index, onUpdate, onRemove, allScenes, currentSceneId, sceneObjects, allTakableObjects, consequenceTrackers }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [localVerbs, setLocalVerbs] = useState(interaction.verbs.join(', '));
    const [localTrackerValues, setLocalTrackerValues] = useState(() =>
        (interaction.trackerEffects || []).map(e => e.valueChange.toString())
    );
    const verbInputId = `verbs-input-${interaction.id}`;

    useEffect(() => {
        if (document.activeElement?.id !== verbInputId) {
            setLocalVerbs(interaction.verbs.join(', '));
        }
    }, [interaction.verbs, verbInputId]);

    useEffect(() => {
        setLocalTrackerValues((interaction.trackerEffects || []).map(e => e.valueChange.toString()));
    }, [interaction.trackerEffects]);

    const handleInteractionChange = (field: keyof Interaction, value: any) => {
        onUpdate(index, { ...interaction, [field]: value });
    };

    const handleTrackerEffectChange = (effectIndex: number, field: keyof TrackerEffect, value: any) => {
        const newEffects = [...(interaction.trackerEffects || [])];
        newEffects[effectIndex] = { ...newEffects[effectIndex], [field]: value };
        handleInteractionChange('trackerEffects', newEffects);
    };

    const handleLocalTrackerValueChange = (effectIndex: number, stringValue: string) => {
        const newValues = [...localTrackerValues];
        newValues[effectIndex] = stringValue;
        setLocalTrackerValues(newValues);
    };

    const handleLocalTrackerValueBlur = (effectIndex: number) => {
        const stringValue = localTrackerValues[effectIndex];
        const numericValue = parseInt(stringValue, 10);
        const originalValue = (interaction.trackerEffects || [])[effectIndex]?.valueChange;

        if (!isNaN(numericValue) && numericValue !== originalValue) {
            handleTrackerEffectChange(effectIndex, 'valueChange', numericValue);
        } else {
            const newValues = [...localTrackerValues];
            newValues[effectIndex] = (originalValue ?? 0).toString();
            setLocalTrackerValues(newValues);
        }
    };

    const handleAddTrackerEffect = () => {
        const newEffect: TrackerEffect = { trackerId: '', valueChange: 10 };
        handleInteractionChange('trackerEffects', [...(interaction.trackerEffects || []), newEffect]);
    };

    const handleRemoveTrackerEffect = (effectIndex: number) => {
        handleInteractionChange('trackerEffects', (interaction.trackerEffects || []).filter((_, i) => i !== effectIndex));
    };

    const handleVerbsBlur = () => {
        const cleanedVerbs = localVerbs.split(',').map(v => v.trim()).filter(Boolean);
        if (JSON.stringify(cleanedVerbs) !== JSON.stringify(interaction.verbs)) {
            handleInteractionChange('verbs', cleanedVerbs);
        }
    };

    const handleOutcomeChange = (outcome: 'goToScene' | 'newSceneDescription') => {
        const newInteraction = { ...interaction };
        const currentNewDescription = newInteraction.newSceneDescription || '';
        delete newInteraction.goToScene;
        delete newInteraction.newSceneDescription;
        if (outcome === 'goToScene') {
            newInteraction.goToScene = '';
            newInteraction.transitionType = 'fade';
            newInteraction.transitionSpeed = 3;
        } else {
            newInteraction.newSceneDescription = currentNewDescription || 'A cena mudou...';
            delete newInteraction.transitionType;
            delete newInteraction.transitionSpeed;
        }
        onUpdate(index, newInteraction);
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

    const otherScenes = allScenes.filter(s => s.id !== currentSceneId);
    const selectBaseClasses = "w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 [&>option]:bg-zinc-950 [&>option]:text-zinc-300";
    const outcomeType = getOutcomeType(interaction);

    const requiredItemName = useMemo(() => {
        if (!interaction.requiresInInventory) return '';
        return allTakableObjects.find(o => o.id === interaction.requiresInInventory)?.name || '';
    }, [interaction.requiresInInventory, allTakableObjects]);

    const targetName = useMemo(() => {
        if (!interaction.target) return '';
        return sceneObjects.find(o => o.id === interaction.target)?.name || '';
    }, [interaction.target, sceneObjects]);

    return (
        <div className={`bg-zinc-900/30 rounded-lg border ${isOpen ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.05)]' : 'border-zinc-800/80'} overflow-hidden transition-all duration-300 relative`}>
            {/* Header - Always visible summary */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center p-4 cursor-pointer hover:bg-zinc-800/50 transition-all overflow-hidden group ${isOpen ? 'bg-purple-500/5 border-b border-purple-500/10' : ''}`}
            >
                {/* Sliding Trash Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                    className="absolute top-0 right-0 h-full w-12 flex items-center justify-center bg-red-500 text-white transform translate-x-full group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20"
                    title="Remover interação"
                >
                    <Trash2 className="w-5 h-5" />
                </button>

                {/* Expansion Arrow on the Left */}
                <ChevronDown
                    className={`w-4 h-4 text-zinc-600 transition-transform duration-300 mr-4 shrink-0 ${isOpen ? '-rotate-90' : 'rotate-0'}`}
                />

                <div className="flex flex-1 items-center overflow-hidden h-6">
                    {/* Verbos */}
                    <div className="flex items-center gap-2 min-w-0 pr-6 border-r border-zinc-800 h-full">
                        <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider shrink-0">Verbos:</span>
                        <span className="text-xs font-bold text-purple-400 truncate">{localVerbs || '(Vazio)'}</span>
                    </div>

                    {/* Item */}
                    <div className="flex items-center gap-2 min-w-0 px-6 border-r border-zinc-800 h-full">
                        <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider shrink-0">Item:</span>
                        <span className="text-xs font-bold text-purple-400 truncate">{requiredItemName || '(Não requer item)'}</span>
                    </div>

                    {/* Alvo */}
                    <div className="flex items-center gap-2 min-w-0 px-6 h-full">
                        <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider shrink-0">Alvo:</span>
                        <span className="text-xs font-bold text-purple-400 truncate">{targetName || '(Nenhum)'}</span>
                    </div>
                </div>
            </div>

            {/* Collapsible Content - Full Editor */}
            {isOpen && (
                <div className="p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Top Row: 3 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Verbos (separados por vírgula)</label>
                            <input id={verbInputId} type="text" value={localVerbs} onChange={e => setLocalVerbs(e.target.value)} onBlur={handleVerbsBlur} placeholder="ex: usar, mover, abrir" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:ring-0 text-zinc-300" />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Requer Item (opcional)</label>
                            <select value={interaction.requiresInInventory || ''} onChange={e => handleInteractionChange('requiresInInventory', e.target.value || undefined)} className={selectBaseClasses}>
                                <option value="">Não requer item</option>
                                {allTakableObjects.map(obj => <option key={obj.id} value={obj.id}>{obj.name} ({obj.id})</option>)}
                            </select>
                            <div className="flex items-center mt-3">
                                <input type="checkbox" id={`consumesItem-${index}`} checked={!!interaction.consumesItem} onChange={e => handleInteractionChange('consumesItem', e.target.checked)} disabled={!interaction.requiresInInventory} className="custom-checkbox" />
                                <label htmlFor={`consumesItem-${index}`} className={`ml-2 block text-[10px] text-zinc-500 font-medium ${!interaction.requiresInInventory ? 'opacity-30' : ''}`}>Consome item após uso</label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Alvo da Interação</label>
                            <select value={interaction.target} onChange={e => handleInteractionChange('target', e.target.value)} className={selectBaseClasses}>
                                <option value="">Nenhum / Ação Geral</option>
                                {sceneObjects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                            </select>
                            {interaction.target && (
                                <div className="space-y-3 mt-3">
                                    <div className="flex items-center">
                                        <input type="checkbox" id={`removesTarget-${index}`} checked={!!interaction.removesTargetFromScene} onChange={e => handleInteractionChange('removesTargetFromScene', e.target.checked)} className="custom-checkbox" />
                                        <label htmlFor={`removesTarget-${index}`} className="ml-2 block text-[10px] text-zinc-500 font-medium">Remove objeto da cena</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id={`addsToInventory-${index}`} checked={!!interaction.addsToInventory} onChange={e => handleInteractionChange('addsToInventory', e.target.checked)} className="custom-checkbox" />
                                        <label htmlFor={`addsToInventory-${index}`} className="ml-2 block text-[10px] font-bold text-purple-400 uppercase tracking-wide">Adiciona ao Inventário</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Row: 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6 pt-6 border-t border-brand-border/20">
                        {/* Left Column: Outcome, Transition, Success Message */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Resultado da Ação</label>
                                <div className="flex gap-2 mb-3 p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
                                    <button onClick={() => handleOutcomeChange('goToScene')} className={`flex-1 py-1.5 px-2 text-[10px] uppercase font-bold tracking-widest rounded transition-all ${outcomeType === 'goToScene' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Mudar de Cena</button>
                                    <button onClick={() => handleOutcomeChange('newSceneDescription')} className={`flex-1 py-1.5 px-2 text-[10px] uppercase font-bold tracking-widest rounded transition-all ${outcomeType === 'newSceneDescription' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Atualizar Texto</button>
                                </div>
                                {outcomeType === 'goToScene' ? (
                                    <select value={interaction.goToScene || ''} onChange={e => handleInteractionChange('goToScene', e.target.value)} className={selectBaseClasses}>
                                        <option value="">Selecione uma cena...</option>
                                        {otherScenes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                ) : (
                                    <textarea value={interaction.newSceneDescription || ''} onChange={e => handleInteractionChange('newSceneDescription', e.target.value)} rows={3} placeholder="Nova descrição para esta cena..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:ring-0 text-zinc-300" />
                                )}
                            </div>

                            {/* Transition */}
                            {outcomeType === 'goToScene' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Transição</label>
                                        <select
                                            value={interaction.transitionType || 'fade'}
                                            onChange={e => handleInteractionChange('transitionType', e.target.value)}
                                            className={selectBaseClasses}
                                        >
                                            <option value="fade">Esmaecer</option>
                                            <option value="slide-left">Deslizar Esq.</option>
                                            <option value="slide-right">Deslizar Dir.</option>
                                            <option value="slide-up">Deslizar Cima</option>
                                            <option value="slide-down">Deslizar Baixo</option>
                                            <option value="zoom">Zoom</option>
                                            <option value="blur">Desfoque</option>
                                            <option value="none">Nenhuma</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Velocidade</label>
                                        <div className="flex items-center gap-3 h-[34px]">
                                            <input
                                                type="range" min="1" max="5"
                                                value={interaction.transitionSpeed || 3}
                                                onChange={e => handleInteractionChange('transitionSpeed', parseInt(e.target.value, 10))}
                                                className="flex-grow h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer border border-zinc-800 accent-purple-500"
                                            />
                                            <span className="font-mono font-bold text-purple-400 w-6 text-center text-xs shrink-0">
                                                {interaction.transitionSpeed || 3}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Mensagem de Sucesso (Opcional)</label>
                                <input type="text" value={interaction.successMessage || ''} onChange={e => handleInteractionChange('successMessage', e.target.value)} placeholder="Ex: Você abriu a porta." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:ring-0 text-zinc-300" />
                            </div>
                        </div>

                        {/* Right Column: Sound Effect, Trackers */}
                        <div className="space-y-6">
                            <div className="flex flex-col space-y-2">
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Efeito Sonoro (Opcional)</label>
                                <div className="flex items-center gap-2">
                                    <label className="flex-grow flex items-center justify-center px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-lg hover:bg-zinc-800 transition-all cursor-pointer text-xs">
                                        <Upload className="w-4 h-4 mr-2 text-purple-400" /> {interaction.soundEffect ? 'Alterar Som' : 'Carregar Som'}
                                        <input type="file" accept="audio/*" onChange={handleSoundUpload} className="hidden" />
                                    </label>
                                    {interaction.soundEffect && <button onClick={() => handleInteractionChange('soundEffect', undefined)} className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all" title="Remover Som"><Trash2 className="w-3 h-3" /></button>}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Rastreadores</label>
                                    <button onClick={handleAddTrackerEffect} className="text-[10px] text-purple-400 font-bold uppercase tracking-widest hover:text-purple-300 transition-all flex items-center"><Plus className="w-3 h-3 mr-1" /> Adicionar</button>
                                </div>
                                <div className="space-y-2">
                                    {interaction.trackerEffects && interaction.trackerEffects.length > 0 ? interaction.trackerEffects.map((effect, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <select value={effect.trackerId} onChange={e => handleTrackerEffectChange(i, 'trackerId', e.target.value)} className="flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:ring-0">
                                                <option value="">Selecione...</option>
                                                {consequenceTrackers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                            <input type="number" value={localTrackerValues[i]} onChange={e => handleLocalTrackerValueChange(i, e.target.value)} onBlur={() => handleLocalTrackerValueBlur(i)} className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs focus:ring-0 text-zinc-300 font-mono" />
                                            <button onClick={() => handleRemoveTrackerEffect(i)} className="text-zinc-600 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    )) : <p className="text-[10px] text-zinc-600 italic py-2">Nenhum efeito definido.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const generateUniqueId = (prefix: 'inter', existingIds: string[]): string => {
    let id;
    do { id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`; } while (existingIds.includes(id));
    return id;
};

const InteractionEditor: React.FC<InteractionEditorProps> = ({ interactions, onUpdateInteractions, allScenes, currentSceneId, sceneObjects, allTakableObjects, consequenceTrackers }) => {
    const handleUpdate = (index: number, updatedInteraction: Interaction) => {
        const newInteractions = [...interactions];
        newInteractions[index] = updatedInteraction;
        onUpdateInteractions(newInteractions);
    };
    const handleRemove = (index: number) => onUpdateInteractions(interactions.filter((_, i) => i !== index));
    const handleAdd = () => {
        const newInteraction: Interaction = { id: generateUniqueId('inter', interactions.map(i => i.id)), verbs: [], target: '' };
        onUpdateInteractions([...interactions, newInteraction]);
    };
    return (
        <div className="space-y-3">
            {interactions.length > 0 ? interactions.map((interaction, index) => (
                <InteractionItem key={interaction.id} index={index} interaction={interaction} onUpdate={handleUpdate} onRemove={handleRemove} allScenes={allScenes} currentSceneId={currentSceneId} sceneObjects={sceneObjects} allTakableObjects={allTakableObjects} consequenceTrackers={consequenceTrackers} />
            )) : <p className="text-center text-zinc-500 py-16 border-2 border-dashed border-zinc-800/50 rounded-xl text-xs italic bg-zinc-950/20">Nenhuma interação definida para esta cena.</p>}

            {/* Floating Add Button - Adjusted to match sidebar constraints */}
            <div className="fixed bottom-6 left-[calc(25%+2.5rem)] xl:left-[calc(20%+2.5rem)] z-10 flex gap-2">
                <button
                    onClick={handleAdd}
                    className="flex items-center px-4 py-2 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-xl active:scale-95 text-xs"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Interação
                </button>
            </div>
        </div>
    );
};

export default InteractionEditor;
