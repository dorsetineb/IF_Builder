
import React, { useState, useEffect } from 'react';
import { Interaction, Scene, GameObject, ConsequenceTracker, TrackerEffect } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';

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
    // MODIFICADO: Reforço das cores escuras para garantir legibilidade conforme anexo
    const selectBaseClasses = "w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text focus:ring-0 [&>option]:bg-brand-bg [&>option]:text-brand-text";
    const outcomeType = getOutcomeType(interaction);

    return (
      <div key={interaction.id} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
        <button onClick={() => onRemove(index)} className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors" title="Remover interação">
            <TrashIcon className="w-5 h-5" />
        </button>

        {/* Top Row: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-dim mb-1">Verbos (separados por vírgula)</label>
            <input id={verbInputId} type="text" value={localVerbs} onChange={e => setLocalVerbs(e.target.value)} onBlur={handleVerbsBlur} placeholder="ex: usar, mover, abrir" className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0 text-brand-text" />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-dim mb-1">Requer Item no Inventário (opcional)</label>
            <select value={interaction.requiresInInventory || ''} onChange={e => handleInteractionChange('requiresInInventory', e.target.value || undefined)} className={selectBaseClasses}>
                <option value="" className="bg-brand-bg">Não requer item</option>
                {allTakableObjects.map(obj => <option key={obj.id} value={obj.id} className="bg-brand-bg">{obj.name} ({obj.id})</option>)}
            </select>
            <div className="flex items-center mt-2">
                <input type="checkbox" id={`consumesItem-${index}`} checked={!!interaction.consumesItem} onChange={e => handleInteractionChange('consumesItem', e.target.checked)} disabled={!interaction.requiresInInventory} className="custom-checkbox" />
                <label htmlFor={`consumesItem-${index}`} className={`ml-2 block text-sm text-brand-text-dim ${!interaction.requiresInInventory ? 'opacity-50' : ''}`}>Consome item após uso</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-dim mb-1">Alvo da Interação (Objeto na Cena)</label>
            <select value={interaction.target} onChange={e => handleInteractionChange('target', e.target.value)} className={selectBaseClasses}>
                <option value="" className="bg-brand-bg">Nenhum / Ação Geral</option>
                {sceneObjects.map(obj => <option key={obj.id} value={obj.id} className="bg-brand-bg">{obj.name}</option>)}
            </select>
            {interaction.target && (
                 <div className="space-y-2 mt-2">
                    <div className="flex items-center">
                        <input type="checkbox" id={`removesTarget-${index}`} checked={!!interaction.removesTargetFromScene} onChange={e => handleInteractionChange('removesTargetFromScene', e.target.checked)} className="custom-checkbox" />
                        <label htmlFor={`removesTarget-${index}`} className="ml-2 block text-sm text-brand-text-dim">Remove objeto da cena</label>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id={`addsToInventory-${index}`} checked={!!interaction.addsToInventory} onChange={e => handleInteractionChange('addsToInventory', e.target.checked)} className="custom-checkbox" />
                        <label htmlFor={`addsToInventory-${index}`} className="ml-2 block text-sm text-brand-text-dim font-bold text-brand-primary">Adiciona ao Inventário</label>
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
                <label className="block text-sm font-medium text-brand-text-dim mb-1">Resultado da Ação</label>
                <div className="flex gap-2 mb-2 p-1 bg-brand-border/30 rounded-md">
                     <button onClick={() => handleOutcomeChange('goToScene')} className={`flex-1 py-1 px-2 text-xs rounded transition-colors ${outcomeType === 'goToScene' ? 'bg-brand-primary text-brand-bg font-bold' : 'text-brand-text-dim hover:text-brand-text'}`}>Mudar de Cena</button>
                     <button onClick={() => handleOutcomeChange('newSceneDescription')} className={`flex-1 py-1 px-2 text-xs rounded transition-colors ${outcomeType === 'newSceneDescription' ? 'bg-brand-primary text-brand-bg font-bold' : 'text-brand-text-dim hover:text-brand-text'}`}>Atualizar Texto</button>
                </div>
                {outcomeType === 'goToScene' ? (
                    <select value={interaction.goToScene || ''} onChange={e => handleInteractionChange('goToScene', e.target.value)} className={selectBaseClasses}>
                        <option value="" className="bg-brand-bg">Selecione uma cena...</option>
                        {otherScenes.map(s => <option key={s.id} value={s.id} className="bg-brand-bg">{s.name}</option>)}
                    </select>
                ) : (
                    <textarea value={interaction.newSceneDescription || ''} onChange={e => handleInteractionChange('newSceneDescription', e.target.value)} rows={3} placeholder="Nova descrição para esta cena..." className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0 text-brand-text" />
                )}
            </div>

            {/* Transition: Aligned horizontally, inner labels removed */}
            {outcomeType === 'goToScene' && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-brand-text-dim mb-1">Transição de Imagem</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <select 
                            value={interaction.transitionType || 'fade'} 
                            onChange={e => handleInteractionChange('transitionType', e.target.value)}
                            className={selectBaseClasses}
                        >
                            <option value="fade" className="bg-brand-bg">Esmaecer</option>
                            <option value="slide-left" className="bg-brand-bg">Deslizar Esq.</option>
                            <option value="slide-right" className="bg-brand-bg">Deslizar Dir.</option>
                            <option value="slide-up" className="bg-brand-bg">Deslizar Cima</option>
                            <option value="slide-down" className="bg-brand-bg">Deslizar Baixo</option>
                            <option value="zoom" className="bg-brand-bg">Zoom</option>
                            <option value="blur" className="bg-brand-bg">Desfoque</option>
                            <option value="none" className="bg-brand-bg">Nenhuma</option>
                        </select>
                        <div className="flex items-center gap-3">
                            <label className="text-xs text-brand-text-dim font-medium whitespace-nowrap">Velocidade</label>
                            <div className="flex-grow flex items-center gap-3">
                                <input 
                                    type="range" min="1" max="5" 
                                    value={interaction.transitionSpeed || 3} 
                                    onChange={e => handleInteractionChange('transitionSpeed', parseInt(e.target.value, 10))}
                                    className="flex-grow h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer border border-brand-border accent-brand-primary" 
                                />
                                <span className="font-mono font-bold text-brand-primary w-6 text-center text-lg shrink-0">
                                    {interaction.transitionSpeed || 3}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-brand-text-dim mb-1">Mensagem de Sucesso (Opcional)</label>
                <input type="text" value={interaction.successMessage || ''} onChange={e => handleInteractionChange('successMessage', e.target.value)} placeholder="Ex: Você abriu a porta." className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0 text-brand-text" />
            </div>
          </div>

          {/* Right Column: Sound Effect, Trackers */}
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-brand-text-dim mb-1">Efeito Sonoro (Opcional)</label>
                <div className="flex items-center gap-2">
                    <label className="flex-grow flex items-center justify-center px-3 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors cursor-pointer text-xs">
                        <UploadIcon className="w-4 h-4 mr-2" /> {interaction.soundEffect ? 'Alterar Som' : 'Carregar Som'}
                        <input type="file" accept="audio/*" onChange={handleSoundUpload} className="hidden" />
                    </label>
                    {interaction.soundEffect && <button onClick={() => handleInteractionChange('soundEffect', undefined)} className="p-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors" title="Remover Som"><TrashIcon className="w-4 h-4" /></button>}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-brand-text-dim">Efeitos em Rastreadores</label>
                    <button onClick={handleAddTrackerEffect} className="text-xs text-brand-primary hover:underline flex items-center"><PlusIcon className="w-3 h-3 mr-1" /> Adicionar</button>
                </div>
                <div className="space-y-2">
                    {interaction.trackerEffects && interaction.trackerEffects.length > 0 ? interaction.trackerEffects.map((effect, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <select value={effect.trackerId} onChange={e => handleTrackerEffectChange(i, 'trackerId', e.target.value)} className="flex-grow bg-brand-bg border border-brand-border rounded-md px-2 py-1 text-xs text-brand-text focus:ring-0 [&>option]:bg-brand-bg">
                                <option value="" className="bg-brand-bg">Selecione...</option>
                                {consequenceTrackers.map(t => <option key={t.id} value={t.id} className="bg-brand-bg">{t.name}</option>)}
                            </select>
                            <input type="number" value={localTrackerValues[i]} onChange={e => handleLocalTrackerValueChange(i, e.target.value)} onBlur={() => handleLocalTrackerValueBlur(i)} className="w-20 bg-brand-border/30 border border-brand-border rounded-md px-2 py-1 text-xs focus:ring-0 text-brand-text" />
                            <button onClick={() => handleRemoveTrackerEffect(i)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    )) : <p className="text-xs text-brand-text-dim italic">Nenhum efeito.</p>}
                </div>
            </div>
          </div>
        </div>
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
    <div className="space-y-6">
      {interactions.length > 0 ? interactions.map((interaction, index) => (
            // FIX: Use currentSceneId instead of localScene.id which is not defined in this scope
            <InteractionItem key={interaction.id} index={index} interaction={interaction} onUpdate={handleUpdate} onRemove={handleRemove} allScenes={allScenes} currentSceneId={currentSceneId} sceneObjects={sceneObjects} allTakableObjects={allTakableObjects} consequenceTrackers={consequenceTrackers} />
          )) : <p className="text-center text-brand-text-dim py-8">Nenhuma interação definida para esta cena.</p>}
      <div className="flex justify-center pt-4">
        <button onClick={handleAdd} className="flex items-center px-6 py-3 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors"><PlusIcon className="w-5 h-5 mr-2" /> Adicionar Interação</button>
      </div>
    </div>
  );
};

export default InteractionEditor;
