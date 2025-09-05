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

const InteractionEditor: React.FC<InteractionEditorProps> = ({ interactions = [], onUpdateInteractions, allScenes, currentSceneId, sceneObjects = [] }) => {
  const handleAddInteraction = () => {
    const newInteraction: Interaction = {
      id: `interacao_${Date.now()}`,
      verbs: [],
      target: '',
      successMessage: 'Você fez algo!',
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

    const handleConsequenceToggle = (index: number, field: 'goToScene' | 'newSceneDescription', isChecked: boolean) => {
        const newInteractions = [...interactions];
        const interaction = newInteractions[index];

        // Reset other mutually exclusive options when one is checked
        if (isChecked) {
            interaction.goToScene = field === 'goToScene' ? '' : undefined;
            interaction.newSceneDescription = field === 'newSceneDescription' ? (interaction.successMessage || 'A cena mudou...') : undefined;
            
            if (field !== 'newSceneDescription') {
                interaction.successMessage = interaction.newSceneDescription || interaction.successMessage || 'Ação bem sucedida.';
            } else {
                interaction.successMessage = undefined;
            }

        } else { // When unchecking
            if (field === 'goToScene') interaction.goToScene = undefined;
            if (field === 'newSceneDescription') {
                 interaction.successMessage = interaction.newSceneDescription || 'A ação foi bem sucedida.';
                 interaction.newSceneDescription = undefined;
            }
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
  const selectBaseClasses = "w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary text-brand-text appearance-none bg-no-repeat pr-8";
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
        {interactions.map((inter, index) => (
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
                    <input type="text" value={inter.verbs.join(', ')} onChange={e => handleVerbsChange(index, e.target.value)} placeholder="ex: usar, ir, mover" className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-brand-text-dim mb-1">Alvo</label>
                    <input type="text" value={inter.target} onChange={e => handleInteractionChange(index, 'target', e.target.value)} placeholder="ex: porta, norte, chave" className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"/>
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
                </div>
              </div>
              {/* Right Column - Feedback message */}
              <div className="flex flex-col h-full">
                {inter.goToScene !== undefined || inter.newSceneDescription !== undefined ? (
                    <>
                    {inter.goToScene !== undefined && (
                        <div className="flex flex-col items-center justify-center h-full bg-brand-bg border-2 border-dashed border-brand-border/50 rounded-md p-4">
                            <p className="text-center text-sm text-brand-text-dim">O feedback para o jogador será a descrição da nova cena.</p>
                            <p className="text-center text-xs text-brand-text-dim mt-2">(Nenhuma mensagem separada é necessária)</p>
                        </div>
                    )}
                    {inter.newSceneDescription !== undefined && (
                        <>
                            <label className="block text-sm font-medium text-brand-text-dim mb-1">Nova Descrição da Cena</label>
                            <textarea value={inter.newSceneDescription || ''} onChange={e => handleInteractionChange(index, 'newSceneDescription', e.target.value)} rows={5} className="w-full flex-grow bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary" placeholder="Descreva como a cena mudou..."/>
                        </>
                    )}
                    </>
                ) : (
                    <>
                        <label className="block text-sm font-medium text-brand-text-dim mb-1">Mensagem de Sucesso</label>
                        <textarea value={inter.successMessage || ''} onChange={e => handleInteractionChange(index, 'successMessage', e.target.value)} rows={5} className="w-full flex-grow bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary" placeholder="A ação foi bem sucedida."/>
                    </>
                )}
              </div>
            </div>


            {/* --- Consequências --- */}
            <div className="mt-4 pt-4 border-t border-brand-border/50">
                <h4 className="text-lg font-semibold mb-3 text-brand-text">Resultado da Ação</h4>
                <div className="space-y-3">
                    <div className="flex items-start">
                        <input type="checkbox" id={`newDesc-${index}`} checked={inter.newSceneDescription !== undefined} onChange={e => handleConsequenceToggle(index, 'newSceneDescription', e.target.checked )} className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"/>
                        <label htmlFor={`newDesc-${index}`} className="ml-2 block text-sm text-brand-text-dim">Alterar a descrição da cena</label>
                    </div>

                    <div className="flex items-start">
                        <input type="checkbox" id={`goToScene-${index}`} checked={inter.goToScene !== undefined} onChange={e => handleConsequenceToggle(index, 'goToScene', e.target.checked )} className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"/>
                        <div className="ml-2 flex-1">
                             <label htmlFor={`goToScene-${index}`} className="block text-sm text-brand-text-dim">Ir para outra cena</label>
                             {inter.goToScene !== undefined && (
                                <div className="mt-2">
                                    <select value={inter.goToScene} onChange={e => handleInteractionChange(index, 'goToScene', e.target.value)} className={selectBaseClasses} style={selectStyle}>
                                        <option className={optionDimClasses} value="">Selecione a cena de destino...</option>
                                        {otherScenes.map(scene => <option className={optionBaseClasses} key={scene.id} value={scene.id}>{scene.name} ({scene.id}) {scene.isEndingScene ? '(Fim de Jogo)' : ''}</option>)}
                                    </select>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-brand-border/50">
                <h4 className="text-lg font-semibold mb-3 text-brand-text">Efeitos Adicionais</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input type="checkbox" id={`removesTarget-${index}`} checked={!!inter.removesTargetFromScene} onChange={e => handleInteractionChange(index, 'removesTargetFromScene', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"/>
                            <label htmlFor={`removesTarget-${index}`} className="ml-2 block text-sm text-brand-text-dim">Remover o alvo da cena</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id={`consumesItem-${index}`} checked={!!inter.consumesItem} onChange={e => handleInteractionChange(index, 'consumesItem', e.target.checked)} disabled={!inter.requiresInInventory} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary disabled:opacity-50"/>
                            <label htmlFor={`consumesItem-${index}`} className={`ml-2 block text-sm text-brand-text-dim ${!inter.requiresInInventory ? 'opacity-50' : ''}`}>Consumir o item do inventário</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id={`refillsChances-${index}`} checked={!!inter.refillsChances} onChange={e => handleInteractionChange(index, 'refillsChances', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"/>
                            <label htmlFor={`refillsChances-${index}`} className="ml-2 block text-sm text-brand-text-dim">Recarregar chances (vidas)</label>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-brand-text-dim mb-2">Efeito Sonoro (opcional)</label>
                        {inter.soundEffect ? (
                          <div className="flex items-center gap-2">
                            <audio controls src={inter.soundEffect} className="w-full"></audio>
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
            </div>
          </div>
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