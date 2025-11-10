import React, { useState, useEffect } from 'react';
import { ConsequenceTracker, Scene } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TrackersEditorProps {
  trackers: ConsequenceTracker[];
  onUpdateTrackers: (trackers: ConsequenceTracker[]) => void;
  allScenes: Scene[];
  allTrackerIds: string[];
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
}

const generateUniqueId = (prefix: 'trk', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`;
    } while (existingIds.includes(id));
    return id;
};

const TrackersEditor: React.FC<TrackersEditorProps> = ({ trackers, onUpdateTrackers, allScenes, allTrackerIds, isDirty, onSetDirty }) => {
  const [localTrackers, setLocalTrackers] = useState(trackers);

  useEffect(() => {
    setLocalTrackers(trackers);
  }, [trackers]);

  useEffect(() => {
    onSetDirty(JSON.stringify(localTrackers) !== JSON.stringify(trackers));
  }, [localTrackers, trackers, onSetDirty]);

  const handleAddTracker = () => {
    const newTracker: ConsequenceTracker = {
      id: generateUniqueId('trk', allTrackerIds),
      name: 'Novo Rastreador',
      initialValue: 0,
      maxValue: 100,
      consequenceSceneId: '',
    };
    setLocalTrackers([...localTrackers, newTracker]);
  };

  const handleRemoveTracker = (id: string) => {
    setLocalTrackers(localTrackers.filter(t => t.id !== id));
  };

  const handleTrackerChange = (id: string, field: keyof ConsequenceTracker, value: string | number) => {
    setLocalTrackers(localTrackers.map(t => (t.id === id ? { ...t, [field]: value } : t)));
  };
  
  const handleSave = () => {
    onUpdateTrackers(localTrackers);
  };

  const handleUndo = () => {
    setLocalTrackers(trackers);
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-text">Rastreadores de Consequência</h2>
            {isDirty && (
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Alterações não salvas"></div>
            )}
        </div>
        <p className="text-brand-text-dim mt-1">
          Crie e gerencie variáveis que mudam com as ações do jogador.
        </p>
      </div>

      <div className="bg-brand-surface p-6 space-y-4">
        {localTrackers.map((tracker) => (
          <div key={tracker.id} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
            <button
                onClick={() => handleRemoveTracker(tracker.id)}
                className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors"
                title="Remover rastreador"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-text-dim mb-1">Nome do Rastreador</label>
                        <input
                            type="text"
                            value={tracker.name}
                            onChange={e => handleTrackerChange(tracker.id, 'name', e.target.value)}
                            className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-dim mb-1">ID do Rastreador</label>
                        <p className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-dim font-mono select-all">
                            {tracker.id}
                        </p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-text-dim mb-1">Valor Inicial</label>
                            <input
                                type="number"
                                value={tracker.initialValue}
                                onChange={e => handleTrackerChange(tracker.id, 'initialValue', parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-text-dim mb-1">Valor Máximo</label>
                            <input
                                type="number"
                                value={tracker.maxValue}
                                onChange={e => handleTrackerChange(tracker.id, 'maxValue', parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-brand-text-dim mb-1">Cena de Consequência</label>
                        <select
                            value={tracker.consequenceSceneId}
                            onChange={e => handleTrackerChange(tracker.id, 'consequenceSceneId', e.target.value)}
                            className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                        >
                            <option value="">Selecione uma cena...</option>
                            {allScenes.map(scene => (
                                <option key={scene.id} value={scene.id}>
                                    {scene.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-brand-text-dim mt-1">
                            O jogador será enviado para esta cena quando o valor máximo for atingido.
                        </p>
                    </div>
                 </div>
            </div>
          </div>
        ))}
         {localTrackers.length === 0 && <p className="text-center text-brand-text-dim">Nenhum rastreador criado.</p>}
      </div>
      <div className="flex justify-end mt-4">
        <button 
            onClick={handleAddTracker} 
            className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors duration-200"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Adicionar Rastreador
        </button>
      </div>

       <div className="fixed bottom-6 right-10 z-10 flex gap-2">
            <button
              onClick={handleUndo}
              disabled={!isDirty}
              className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text-dim font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Desfazer
            </button>
            <button
                onClick={handleSave}
                disabled={!isDirty}
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                Salvar
            </button>
        </div>
    </div>
  );
};

export default TrackersEditor;
