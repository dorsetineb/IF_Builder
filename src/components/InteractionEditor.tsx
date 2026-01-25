import React, { useState, useEffect, useMemo } from 'react';
import { Interaction, Scene, GameObject, ConsequenceTracker, TrackerEffect, Vignette } from '../types';
import { Plus, Trash2, Upload, Search, MousePointer2, ArrowRight, MessageSquare, Play, Volume2, Target, CheckCircle2 } from 'lucide-react';

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

const getOutcomeType = (inter: Interaction): 'goToScene' | 'newSceneDescription' | 'playVignette' => {
    if (inter.vignetteId !== undefined) return 'playVignette';
    if (inter.newSceneDescription !== undefined) return 'newSceneDescription';
    return 'goToScene';
};

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
    vignettes
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(interactions.length > 0 ? 0 : null);
    const [searchTerm, setSearchTerm] = useState('');

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
        if (window.confirm('Tem certeza que deseja remover esta interação?')) {
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

    // Helper to render interaction editor (reused logic from previous component, adapted)
    const renderEditor = () => {
        if (!selectedInteraction || selectedIndex === null) return null;

        const outcomeType = getOutcomeType(selectedInteraction);

        const handleInteractionChange = (field: keyof Interaction, value: any) => {
            handleUpdate(selectedIndex, { ...selectedInteraction, [field]: value });
        };

        const handleOutcomeChange = (type: 'goToScene' | 'newSceneDescription' | 'playVignette') => {
            const newInteraction = { ...selectedInteraction };
            const currentNewDescription = newInteraction.newSceneDescription || '';

            // Reset outcome fields
            delete newInteraction.goToScene;
            delete newInteraction.newSceneDescription;
            delete newInteraction.vignetteId;

            if (type === 'goToScene') {
                newInteraction.goToScene = '';
                newInteraction.transitionType = 'fade';
                newInteraction.transitionSpeed = 5;
            } else if (type === 'playVignette') {
                newInteraction.vignetteId = '';
                newInteraction.transitionType = 'fade';
                newInteraction.transitionSpeed = 5;
            } else {
                newInteraction.newSceneDescription = currentNewDescription || 'A cena mudou...';
                delete newInteraction.transitionType;
                delete newInteraction.transitionSpeed;
            }
            handleUpdate(selectedIndex, newInteraction);
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
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-muted-foreground/10 flex justify-between items-center bg-zinc-900/30 shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                            <MousePointer2 className="w-4 h-4 text-green-500" />
                            Editando Interação #{selectedIndex + 1}
                        </h3>
                    </div>
                    <div>
                        <button
                            onClick={() => handleRemove(selectedIndex)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-md transition-all"
                            title="Remover Interação"
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
                            <Target className="w-3 h-3" /> Gatilhos & Condições
                        </h4>
                        <div className="bg-zinc-950/30 p-4 rounded-lg border border-muted-foreground/10 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Verbos (separados por vírgula)</label>
                                <input
                                    type="text"
                                    value={selectedInteraction.verbs.join(', ')}
                                    onChange={e => handleInteractionChange('verbs', e.target.value.split(',').map(v => v.trim()).filter(Boolean))}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-100 focus:ring-1 focus:ring-green-500/50"
                                    placeholder="ex: pegar, usar, abrir"
                                />
                                <p className="text-[10px] text-zinc-600 mt-1">O jogador deve digitar um destes para iniciar a ação.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Alvo da Ação (Opcional)</label>
                                    <select
                                        value={selectedInteraction.target}
                                        onChange={e => handleInteractionChange('target', e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-300"
                                    >
                                        <option value="">Nenhum (Ação no ambiente)</option>
                                        {sceneObjects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Requer Item (Inventário)</label>
                                    <select
                                        value={selectedInteraction.requiresInInventory || ''}
                                        onChange={e => handleInteractionChange('requiresInInventory', e.target.value || undefined)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-300"
                                    >
                                        <option value="">Não requer item</option>
                                        {allTakableObjects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={!!selectedInteraction.removesTargetFromScene} onChange={e => handleInteractionChange('removesTargetFromScene', e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-green-500 focus:ring-green-500/20" />
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Remove Alvo da Cena</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={!!selectedInteraction.addsToInventory} onChange={e => handleInteractionChange('addsToInventory', e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500/20" />
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Adiciona ao Inventário</span>
                                </label>
                                <label className={`flex items-center gap-2 cursor-pointer ${!selectedInteraction.requiresInInventory && 'opacity-30'}`}>
                                    <input type="checkbox" checked={!!selectedInteraction.consumesItem} onChange={e => handleInteractionChange('consumesItem', e.target.checked)} disabled={!selectedInteraction.requiresInInventory} className="rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500/20" />
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide">Consome Item Usado</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* CONSEQUÊNCIAS (Outcomes) */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> Resultado
                        </h4>
                        <div className="bg-zinc-950/30 p-4 rounded-lg border border-muted-foreground/10 space-y-4">

                            {/* Outcome Type Selector */}
                            <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                <button onClick={() => handleOutcomeChange('newSceneDescription')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${outcomeType === 'newSceneDescription' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
                                    <MessageSquare className="w-3 h-3" /> Atualizar Texto
                                </button>
                                <button onClick={() => handleOutcomeChange('goToScene')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${outcomeType === 'goToScene' ? 'bg-blue-900/40 text-blue-200 border border-blue-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
                                    <ArrowRight className="w-3 h-3" /> Mudar Cena
                                </button>
                                <button onClick={() => handleOutcomeChange('playVignette')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${outcomeType === 'playVignette' ? 'bg-purple-900/40 text-purple-200 border border-purple-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
                                    <Play className="w-3 h-3" /> Vinheta
                                </button>
                            </div>

                            {/* Dynamic Fields based on Type */}
                            <div className="pt-2 animate-in fade-in slide-in-from-top-1">
                                {outcomeType === 'newSceneDescription' && (
                                    <textarea
                                        value={selectedInteraction.newSceneDescription || ''}
                                        onChange={e => handleInteractionChange('newSceneDescription', e.target.value)}
                                        rows={3}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-xs text-zinc-300"
                                        placeholder="Digite o novo texto que descreve a cena após esta ação..."
                                    />
                                )}
                                {outcomeType === 'goToScene' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Ir para Cena</label>
                                            <select value={selectedInteraction.goToScene || ''} onChange={e => handleInteractionChange('goToScene', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-300">
                                                <option value="">Selecione...</option>
                                                {allScenes.filter(s => s.id !== currentSceneId).map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                {outcomeType === 'playVignette' && (
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Tocar Vinheta</label>
                                        <select value={selectedInteraction.vignetteId || ''} onChange={e => handleInteractionChange('vignetteId', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-300">
                                            <option value="">Selecione...</option>
                                            {vignettes.map(v => <option key={v.id} value={v.id}>{v.title || v.name || v.id}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Common Feedbacks */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Mensagem de Sucesso (Opcional)</label>
                                    <input type="text" value={selectedInteraction.successMessage || ''} onChange={e => handleInteractionChange('successMessage', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-300" placeholder="Ex: Você destrancou a porta." />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Efeito Sonoro (.mp3)</label>
                                    <div className="flex items-center gap-2">
                                        <label className="flex-1 flex items-center justify-center px-3 py-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 cursor-pointer text-xs font-medium transition-colors">
                                            <Upload className="w-3 h-3 mr-2 text-zinc-500" /> {selectedInteraction.soundEffect ? 'Alterar' : 'Upload'}
                                            <input type="file" accept="audio/*" onChange={handleSoundUpload} className="hidden" />
                                        </label>
                                        {selectedInteraction.soundEffect && (
                                            <button onClick={() => handleInteractionChange('soundEffect', undefined)} className="p-2 bg-red-500/10 text-red-500 rounded border border-red-500/20"><Trash2 className="w-3 h-3" /></button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rastreadores</label>
                                        <button onClick={handleAddTrackerEffect} className="text-[10px] text-green-500 font-bold hover:text-green-400"><Plus className="w-3 h-3 inline" /> ADD</button>
                                    </div>
                                    <div className="space-y-1">
                                        {(selectedInteraction.trackerEffects || []).map((effect, i) => (
                                            <div key={i} className="flex items-center gap-1">
                                                <select value={effect.trackerId} onChange={e => handleTrackerEffectChange(i, 'trackerId', e.target.value)} className="flex-1 bg-zinc-900 border-none text-[10px] h-6 rounded px-1 text-zinc-300">
                                                    <option value="">Rastreador...</option>
                                                    {consequenceTrackers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                </select>
                                                <input type="number" value={effect.valueChange} onChange={e => handleTrackerEffectChange(i, 'valueChange', parseInt(e.target.value))} className="w-10 bg-zinc-900 border-none text-[10px] h-6 rounded px-1 text-right text-zinc-300 font-mono" />
                                                <button onClick={() => handleRemoveTrackerEffect(i)} className="text-zinc-600 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        ))}
                                        {(selectedInteraction.trackerEffects || []).length === 0 && <p className="text-[10px] text-zinc-600 italic">Sem efeitos.</p>}
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
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Interações ({filteredInteractions.length})</span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar verbos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-green-500/50 placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredInteractions.length > 0 ? (
                        filteredInteractions.map(({ inter, index }) => (
                            <button
                                key={inter.id}
                                onClick={() => setSelectedIndex(index)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left group ${selectedIndex === index ? 'bg-green-500/10 border-green-500/40' : 'bg-transparent border-transparent hover:bg-zinc-900 hover:border-zinc-800'}`}
                            >
                                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${selectedIndex === index ? 'bg-green-500/20 text-green-400' : 'bg-zinc-900 text-zinc-600'}`}>
                                    {getOutcomeType(inter) === 'goToScene' && <ArrowRight className="w-4 h-4" />}
                                    {getOutcomeType(inter) === 'newSceneDescription' && <MessageSquare className="w-4 h-4" />}
                                    {getOutcomeType(inter) === 'playVignette' && <Play className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className={`text-xs font-bold truncate ${selectedIndex === index ? 'text-green-400' : 'text-zinc-300'}`}>
                                        {inter.verbs[0] ? inter.verbs[0].toUpperCase() : 'NOVO'} {inter.verbs.length > 1 && `+${inter.verbs.length - 1}`}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 truncate flex items-center gap-1">
                                        {inter.target ? `Alvo: ${sceneObjects.find(o => o.id === inter.target)?.name || '?'}` : 'Geral'}
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-xs italic">Nenhuma interação.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-muted-foreground/10 bg-zinc-900/50">
                    <button
                        onClick={handleAdd}
                        className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-lg text-xs flex items-center justify-center transition-colors shadow"
                    >
                        <Plus className="w-3.5 h-3.5 mr-2" />
                        Nova Interação
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
                        <h4 className="text-sm font-bold text-zinc-400 mb-1">Nenhuma interação selecionada</h4>
                        <p className="text-xs max-w-xs opacity-60">Selecione uma interação da lista para editar ou crie uma nova.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractionEditor;
