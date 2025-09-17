import React from 'react';
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


const InteractionEditor: React.FC<InteractionEditorProps> = ({ interactions = [], onUpdateInteractions, allScenes, currentSceneId, sceneObjects = [] }) => {
  const handleAddInteraction = () => {
    const newInteraction: Interaction = {
      id: `interacao_${Date.now()}`,
      verbs: [],
      target: '',
      goToScene: '',
    };
    onUpdateInteractions([...interactions, newInteraction]);
  };

  const handleRemoveInteraction = (index: number) => {
    onUpdateInteractions(interactions.filter((_, i) => i !== index));
  };

  const handleInteractionChange = (index: number, field: keyof Interaction, value: any) => {
    const newInteractions = interactions.map((interaction, i) => {
      if (i === index) {
        return { ...interaction, [field]: value };
      }
      return interaction;
    });
    onUpdateInteractions(newInteractions);
  };
  
  const handleVerbsChange = (index: number, value: string) => {
      const verbs = value.split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
      handleInteractionChange(index, 'verbs', verbs);
  }

    const handleOutcomeChange = (index: number, outcome: 'goToScene' | 'newSceneDescription') => {
        const newInteractions = [...interactions];
        const interaction = newInteractions[index];

        const currentNewDescription = interaction.newSceneDescription || '';

        // Reset all outcome-specific fields
        interaction.goToScene = undefined;
        interaction.newSceneDescription = undefined;
        interaction.successMessage = undefined; // Also clear this deprecated field

        switch (outcome) {
            case 'goToScene':
                interaction.goToScene = ''; // Set to empty string to show the dropdown
                break;
            case 'newSceneDescription':
                interaction.newSceneDescription = currentNewDescription || 'A cena mudou...';
                break;
        }

        onUpdateInteractions(newInteractions);
    };

    const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    handleInteractionChange(index, 'soundEffect', event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

  const otherScenes = allScenes.filter(s => s.id !== currentSceneId);
  const takableObjectsInScene = sceneObjects.filter(obj => obj.isTakable);

  const whiteChevron = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke-width='1.5' stroke='white'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='m5.25 7.5 4.5 4.5 4.5-4.5' /%3e%3c/svg%3e";
  const selectBaseClasses = "w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text appearance-none bg-no-repeat pr-8 focus:ring-0";
  const selectStyle = {
    backgroundImage: `url("${whiteChevron}")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundSize: '1.25em'
  };
  const optionBaseClasses = "bg-brand-surface text-brand-text";
  const optionDimClasses = "bg-brand-surface text-brand-text-dim";


  return (
    <>
      <div className="space-y-4">
        {interactions.map((inter, index) => {
          const outcomeType = getOutcomeType(inter);
          return (
          <div key={inter.id} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
            <button
                onClick={() => handleRemoveInteraction(index)}
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
                    <input type="text" value={inter.verbs.join(', ')} onChange={e => handleVerbsChange(index, e.target.value)} placeholder="ex: usar, ir, mover" className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-brand-text-dim mb-1">Alvo</label>
                    <input type="text" value={inter.target} onChange={e => handleInteractionChange(index, 'target', e.target.value.toLowerCase())} placeholder="ex: porta, norte, chave" className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"/>
                    <div className="flex items-center mt-2">
                        <input type="checkbox" id={`removesTarget-${index}`} checked={!!inter.removesTargetFromScene} onChange={e => handleInteractionChange(index, 'removesTargetFromScene', e.target.checked)} className="custom-checkbox"/>
                        <label htmlFor={`removesTarget-${index}`} className="ml-2 block text-sm text-brand-text-dim">Remover o alvo da cena</label>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-brand-text-dim mb-1">Requer Item no Inventário (opcional)</label>
                    <select 
                      value={inter.requiresInInventory || ''} 
                      onChange={e => handleInteractionChange(index, 'requiresInInventory', e.target.value || undefined)} 
                      className={selectBaseClasses}
                      style={selectStyle}
                    >
                        <option className={optionDimClasses} value="">Não requer item</option>
                        {takableObjectsInScene.map(obj => (
                            <option className={optionBaseClasses} key={obj.id} value={obj.id}>{obj.name} ({obj.id})</option>
                        ))}
                    </select>
                    <div className="flex items-center mt-2">
                        <input type="checkbox" id={`consumesItem-${index}`} checked={!!inter.consumesItem} onChange={e => handleInteractionChange(index, 'consumesItem', e.target.checked)} disabled={!inter.requiresInInventory} className="custom-checkbox"/>
                        <label htmlFor={`consumesItem-${index}`} className={`ml-2 block text-sm text-brand-text-dim ${!inter.requiresInInventory ? 'opacity-50' : ''}`}>Consumir o item do inventário</label>
                    </div>
                </div>
              </div>
              {/* Right Column - Outcome */}
              <div className="flex flex-col h-full space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-brand-text-dim mb-1">Resultado da Ação</label>
                      <select 
                          value={outcomeType} 
                          onChange={e => handleOutcomeChange(index, e.target.value as any)} 
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
                              <label className="block text-sm font-medium text-brand-text-dim mb-1">Cena de Destino</label>
                              <select 
                                  value={inter.goToScene || ''} 
                                  onChange={e => handleInteractionChange(index, 'goToScene', e.target.value)} 
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
                              <div className="flex-grow flex items-center justify-center bg-brand-bg border-2 border-dashed border-brand-border/50 rounded-md p-4">
                                  <p className="text-center text-sm text-brand-text-dim">O feedback para o jogador será a nova cena.</p>
                              </div>
                          </>
                      )}

                      {outcomeType === 'newSceneDescription' && (
                          <>
                              <label className="block text-sm font-medium text-brand-text-dim mb-1">Nova Descrição da Cena</label>
                              <textarea 
                                  value={inter.newSceneDescription || ''} 
                                  onChange={e => handleInteractionChange(index, 'newSceneDescription', e.target.value)} 
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
                {inter.soundEffect ? (
                  <div className="flex items-center gap-2">
                    <audio controls src={inter.soundEffect} className="w-full max-w-sm"></audio>
                    <button onClick={() => handleInteractionChange(index, 'soundEffect', undefined)} className="p-2 text-brand-text-dim hover:text-red-500" title="Remover som">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                <label className="inline-flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors cursor-pointer">
                    <UploadIcon className="w-5 h-5 mr-2" /> Carregar Áudio
                    <input type="file" accept="audio/*" onChange={(e) => handleSoundUpload(e, index)} className="hidden" />
                </label>
                )}
            </div>
          </div>
          )
        })}
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