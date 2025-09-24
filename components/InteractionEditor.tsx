import React, { useState, useEffect } from 'react';
import { Interaction, Scene, GameObject } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';

interface InteractionEditorProps {
  interactions: Interaction[];
  onUpdateInteractions: (interactions: Interaction[]) => void;
  allScenes: Scene[];
  currentSceneId: string;
  sceneObjects: GameObject[];
}

// Helper to determine the current outcome type for the UI
const getOutcomeType = (inter: Interaction): 'goToScene' | 'newSceneDescription' => {
    if (inter.newSceneDescription !== undefined) return 'newSceneDescription';
    return 'goToScene';
};


// Sub-component to manage local state for each interaction item, especially for the verbs input.
const InteractionItem: React.FC<{
  interaction: Interaction;
  index: number;
  onUpdate: (index: number, interaction: Interaction) => void;
  onRemove: (index: number) => void;
  allScenes: Scene[];
  currentSceneId: string;
  sceneObjects: GameObject[];
}> = ({ interaction, index, onUpdate, onRemove, allScenes, currentSceneId, sceneObjects }) => {
    
    const [localVerbs, setLocalVerbs] = useState(interaction.verbs.join(', '));
    const verbInputId = `verbs-input-${interaction.id}`;

    useEffect(() => {
        // Sync local state with prop, but only if the user is not currently typing in the input.
        // This prevents the cursor from jumping.
        if (document.activeElement?.id !== verbInputId) {
             setLocalVerbs(interaction.verbs.join(', '));
        }
    }, [interaction.verbs, verbInputId]);
    
    const handleInteractionChange = (field: keyof Interaction, value: any) => {
        onUpdate(index, { ...interaction, [field]: value });
    };

    const handleVerbsBlur = () => {
        const cleanedVerbs = localVerbs.split(',').map(v => v.trim()).filter(Boolean);
        // Only call update if the cleaned array is different from the source
        if (JSON.stringify(cleanedVerbs) !== JSON.stringify(interaction.verbs)) {
            handleInteractionChange('verbs', cleanedVerbs);
        }
    };

    const handleOutcomeChange = (outcome: 'goToScene' | 'newSceneDescription') => {
        const newInteraction = { ...interaction };

        const currentNewDescription = newInteraction.newSceneDescription || '';

        // Reset all outcome-specific fields
        delete newInteraction.goToScene;
        delete newInteraction.newSceneDescription;
        delete newInteraction.successMessage;

        switch (outcome) {
            case 'goToScene':
                newInteraction.goToScene = ''; // Set to empty string to show the dropdown
                break;
            case 'newSceneDescription':
                newInteraction.newSceneDescription = currentNewDescription || 'A cena mudou...';
                break;
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
    const takableObjectsInScene = sceneObjects.filter(obj => obj.isTakable);

    const whiteChevron = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke-width='1.5' stroke='white'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='m5.25 7.5 4.5 4.5 4.5-4.5' /%3e%3c/svg%3e";
    const selectBaseClasses = "w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text appearance-none bg-no-repeat pr-8 focus:ring-0";
    const selectStyle = { backgroundImage: `url("${whiteChevron}")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' };
    const optionBaseClasses = "bg-brand-surface text-brand-text";
    const optionDimClasses = "bg-brand-surface text-brand-text-dim";
    
    const outcomeType = getOutcomeType(interaction);

    return (
      <div key={interaction.id} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
        <button
            onClick={() => onRemove(index)}
            className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors"
            title="Remover interação"
        >
            <TrashIcon className="w-5 h-5" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-brand-text-dim mb-1">Verbos (separados por vírgula)</label>
                <input
                    id={verbInputId}
                    type="text"
                    value={localVerbs}
                    onChange={e => setLocalVerbs(e.target.value)}
                    onBlur={handleVerbsBlur}
                    placeholder="ex: usar, mover, abrir"
                    className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-brand-text-dim mb-1">Alvo</label>
                <input type="text" value={interaction.target} onChange={e => handleInteractionChange('target', e.target.value.toLowerCase())} placeholder="ex: porta, norte, chave" className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"/>
                <div className="flex items-center mt-2">
                    <input type="checkbox" id={`removesTarget-${index}`} checked={!!interaction.removesTargetFromScene} onChange={e => handleInteractionChange('removesTargetFromScene', e.target.checked)} className="custom-checkbox"/>
                    <label htmlFor={`removesTarget-${index}`} className="ml-2 block text-sm text-brand-text-dim">Remover o alvo da cena</label>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-brand-text-dim mb-1">Requer Item no Inventário (opcional)</label>
                <select 
                  value={interaction.requiresInInventory || ''} 
                  onChange={e => handleInteractionChange('requiresInInventory', e.target.value || undefined)} 
                  className={selectBaseClasses}
                  style={selectStyle}
                >
                    <option className={optionDimClasses} value="">Não requer item</option>
                    {takableObjectsInScene.map(obj => (
                        <option className={optionBaseClasses} key={obj.id} value={obj.id}>{obj.name} ({obj.id})</option>
                    ))}
                </select>
                <div className="flex items-center mt-2">
                    <input type="checkbox" id={`consumesItem-${index}`} checked={!!interaction.consumesItem} onChange={e => handleInteractionChange('consumesItem', e.target.checked)} disabled={!interaction.requiresInInventory} className="custom-checkbox"/>
                    <label htmlFor={`consumesItem-${index}`} className={`ml-2 block text-sm text-brand-text-dim ${!interaction.requiresInInventory ? 'opacity-50' : ''}`}>Consumir o item do inventário</label>
                </div>
            </div>
          </div>
          {/* Right Column - Outcome */}
          <div className="flex flex-col h-full space-y-4">
              <div>
                  <label className="block text-sm font-medium text-brand-text-dim mb-1">Resultado da Ação</label>
                  <select 
                      value={outcomeType} 
                      onChange={e => handleOutcomeChange(e.target.value as any)} 
                      className={selectBaseClasses}
                      style={selectStyle}
                  >
                      <option className={optionBaseClasses} value="goToScene">Ir para outra cena</option>
                      <option className={optionBaseClasses} value="newSceneDescription">Alterar a descrição da cena</option>
                  </select>
              </div>

              <div className="flex flex-col flex-grow h-full">
                  {outcomeType === 'goToScene' && (
                      <>
                          <div>
                              <label className="block text-sm font-medium text-brand-text-dim mb-1">Cena de Destino</label>
                              <select 
                                  value={interaction.goToScene || ''} 
                                  onChange={e => handleInteractionChange('goToScene', e.target.value)} 
                                  className={`${selectBaseClasses} mb-2`}
                                  style={selectStyle}
                              >
                                  <option className={optionDimClasses} value="">Selecione a cena...</option>
                                  {otherScenes.map(scene => (
                                      <option 
                                          className={optionBaseClasses} 
                                          key={scene.id} 
                                          value={scene.id}
                                      >
                                          {scene.name} ({scene.id}) {scene.isEndingScene ? '(Fim de Jogo)' : ''}
                                      </option>
                                  ))}
                              </select>
                          </div>
                          <div>
                            <label htmlFor={`transition-type-${index}`} className="block text-sm font-medium text-brand-text-dim mb-1 mt-2">Transição Visual</label>
                            <select 
                                id={`transition-type-${index}`}
                                value={interaction.transitionType || 'fade'} 
                                onChange={e => handleInteractionChange('transitionType', e.target.value)} 
                                className={`${selectBaseClasses} mb-2`}
                                style={selectStyle}
                            >
                                <option className={optionBaseClasses} value="fade">Fade (Padrão)</option>
                                <option className={optionBaseClasses} value="slide-left">Deslizar da Direita</option>
                                <option className={optionBaseClasses} value="slide-right">Deslizar da Esquerda</option>
                                <option className={optionBaseClasses} value="wipe-down">Cortina (de Cima)</option>
                            </select>
                          </div>
                          <div className="flex-grow flex items-center justify-center bg-brand-bg border-2 border-dashed border-brand-border/50 rounded-md p-4 mt-2">
                              <p className="text-center text-sm text-brand-text-dim">O feedback para o jogador será a nova cena.</p>
                          </div>
                      </>
                  )}

                  {outcomeType === 'newSceneDescription' && (
                      <>
                          <label className="block text-sm font-medium text-brand-text-dim mb-1">Nova Descrição da Cena</label>
                          <textarea 
                              value={interaction.newSceneDescription || ''} 
                              onChange={e => handleInteractionChange('newSceneDescription', e.target.value)} 
                              rows={5} 
                              className="w-full flex-grow bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0" 
                              placeholder="Descreva como a cena mudou..."
                          />
                      </>
                  )}
              </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-brand-border/50">
            <label className="block text-sm font-medium text-brand-text-dim">Efeito Sonoro (opcional)</label>
            <p className="text-xs text-brand-text-dim mb-2">será tocado no término da interação</p>
            {interaction.soundEffect ? (
              <div className="flex items-center gap-2">
                <audio controls src={interaction.soundEffect} className="w-full max-w-sm"></audio>
                <button onClick={() => handleInteractionChange('soundEffect', undefined)} className="p-2 text-brand-text-dim hover:text-red-500" title="Remover som">
                    <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
            <label className="inline-flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors cursor-pointer">
                <UploadIcon className="w-5 h-5 mr-2" /> Carregar Áudio
                <input type="file" accept="audio/*" onChange={(e) => handleSoundUpload(e)} className="hidden" />
            </label>
            )}
        </div>
      </div>
    );
};


const InteractionEditor: React.FC<InteractionEditorProps> = ({ interactions = [], onUpdateInteractions, allScenes, currentSceneId, sceneObjects = [] }) => {
  const handleAddInteraction = () => {
    const newInteraction: Interaction = {
      id: `inter_${Math.random().toString(36).substring(2, 9)}`,
      verbs: [],
      target: '',
    };
    onUpdateInteractions([...interactions, newInteraction]);
  };

  const handleRemoveInteraction = (index: number) => {
    onUpdateInteractions(interactions.filter((_, i) => i !== index));
  };
  
  const handleUpdateInteraction = (index: number, updatedInteraction: Interaction) => {
    const newInteractions = [...interactions];
    newInteractions[index] = updatedInteraction;
    onUpdateInteractions(newInteractions);
  };

  return (
    <>
      <div className="space-y-4">
        {interactions.map((inter, index) => (
            <InteractionItem
                key={inter.id}
                interaction={inter}
                index={index}
                onUpdate={handleUpdateInteraction}
                onRemove={handleRemoveInteraction}
                allScenes={allScenes}
                currentSceneId={currentSceneId}
                sceneObjects={sceneObjects}
            />
        ))}
         {interactions.length === 0 && <p className="text-center text-brand-text-dim">Nenhuma interação customizada nesta cena.</p>}
      </div>
       <div className="flex justify-end mt-4">
        <button 
            onClick={handleAddInteraction} 
            className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors duration-200"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Adicionar Interação
        </button>
      </div>
    </>
  );
};

export default InteractionEditor;