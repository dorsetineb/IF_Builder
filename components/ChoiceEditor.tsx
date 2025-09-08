
import React from 'react';
import { Choice, Scene } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';

interface ChoiceEditorProps {
  choices: Choice[];
  onUpdateChoices: (choices: Choice[]) => void;
  allScenes: Scene[];
  currentSceneId: string;
}

const ChoiceEditor: React.FC<ChoiceEditorProps> = ({ choices = [], onUpdateChoices, allScenes, currentSceneId }) => {
  const handleAddChoice = () => {
    const newChoice: Choice = {
      id: `chc_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      text: 'Nova opção...',
      goToScene: '',
    };
    onUpdateChoices([...choices, newChoice]);
  };

  const handleRemoveChoice = (index: number) => {
    onUpdateChoices(choices.filter((_, i) => i !== index));
  };

  const handleChoiceChange = (index: number, field: keyof Choice, value: any) => {
    const newChoices = choices.map((choice, i) => {
      if (i === index) {
        return { ...choice, [field]: value };
      }
      return choice;
    });
    onUpdateChoices(newChoices);
  };

  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  handleChoiceChange(index, 'soundEffect', event.target.result);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const otherScenes = allScenes.filter(s => s.id !== currentSceneId);
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
        {choices.map((choice, index) => (
          <div key={choice.id} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
            <button
                onClick={() => handleRemoveChoice(index)}
                className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors"
                title="Remover opção"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-brand-text-dim mb-1">Texto da Opção</label>
                    <textarea value={choice.text} onChange={e => handleChoiceChange(index, 'text', e.target.value)} rows={3} className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary" placeholder="Texto que aparecerá para o jogador..."/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-text-dim mb-1">Leva Para a Cena</label>
                    <select value={choice.goToScene} onChange={e => handleChoiceChange(index, 'goToScene', e.target.value)} className={selectBaseClasses} style={selectStyle}>
                        <option className={optionDimClasses} value="">Selecione a cena de destino...</option>
                        {otherScenes.map(scene => <option className={optionBaseClasses} key={scene.id} value={scene.id}>{scene.name} ({scene.id}) {scene.isEndingScene ? '(Fim de Jogo)' : ''}</option>)}
                    </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-brand-text-dim mb-2">Efeito Sonoro (opcional)</label>
                    {choice.soundEffect ? (
                      <div className="flex items-center gap-2">
                        <audio controls src={choice.soundEffect} className="w-full"></audio>
                        <button onClick={() => handleChoiceChange(index, 'soundEffect', undefined)} className="p-2 text-brand-text-dim hover:text-red-500" title="Remover som">
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
                 <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center">
                        <input type="checkbox" id={`costsChance-${index}`} checked={!!choice.costsChance} onChange={e => handleChoiceChange(index, 'costsChance', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"/>
                        <label htmlFor={`costsChance-${index}`} className="ml-2 block text-sm text-brand-text-dim">Custa uma chance (vida)</label>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id={`refillsChances-${index}`} checked={!!choice.refillsChances} onChange={e => handleChoiceChange(index, 'refillsChances', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"/>
                        <label htmlFor={`refillsChances-${index}`} className="ml-2 block text-sm text-brand-text-dim">Recarregar chances (vidas)</label>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
         {choices.length === 0 && <p className="text-center text-brand-text-dim">Nenhuma opção nesta cena. Adicione uma para que o jogador possa progredir.</p>}
      </div>
       <div className="flex justify-end mt-4">
        <button 
            onClick={handleAddChoice} 
            className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors duration-200"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Adicionar Opção
        </button>
      </div>
    </>
  );
};

export default ChoiceEditor;