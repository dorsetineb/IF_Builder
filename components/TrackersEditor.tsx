import React, { useState, useEffect, useMemo } from 'react';
import { ConsequenceTracker, Scene, Interaction, TrackerEffect } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TrackersEditorProps {
  trackers: ConsequenceTracker[];
  onUpdateTrackers: (trackers: ConsequenceTracker[]) => void;
  allScenes: Scene[];
  allTrackerIds: string[];
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
  onSelectScene: (sceneId: string) => void;
}

const generateUniqueId = (prefix: 'trk', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`;
    } while (existingIds.includes(id));
    return id;
};

const whiteChevron = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke-width='1.5' stroke='white'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='m5.25 7.5 4.5 4.5 4.5-4.5' /%3e%3c/svg%3e";
const selectBaseClasses = "w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text appearance-none bg-no-repeat pr-8 focus:ring-0";
const selectStyle = { backgroundImage: `url("${whiteChevron}")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' };
const optionBaseClasses = "bg-brand-surface text-brand-text";
const optionDimClasses = "bg-brand-surface text-brand-text-dim";

const TrackersEditor: React.FC<TrackersEditorProps> = ({ trackers, onUpdateTrackers, allScenes, allTrackerIds, isDirty, onSetDirty, onSelectScene }) => {
  const [localTrackers, setLocalTrackers] = useState(trackers);

  const allTrackerUsages = useMemo(() => {
    const usageMap = new Map<string, { scene: Scene; interaction: Interaction; effect: TrackerEffect }[]>();

    trackers.forEach(tracker => usageMap.set(tracker.id, []));

    allScenes.forEach(scene => {
        scene.interactions?.forEach(interaction => {
            interaction.trackerEffects?.forEach(effect => {
                if (usageMap.has(effect.trackerId)) {
                    usageMap.get(effect.trackerId)!.push({ scene, interaction, effect });
                }
            });
        });
    });
    return usageMap;
  }, [allScenes, trackers]);


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

  const handleTrackerChange = (id: string, field: keyof ConsequenceTracker, value: string | number | boolean) => {
    setLocalTrackers(localTrackers.map(t => {
        if (t.id === id) {
            if (field === 'barColor' && value === '') {
                const newTracker = { ...t };
                delete newTracker.barColor;
                return newTracker;
            }
            return { ...t, [field]: value };
        }
        return t;
    }));
  };
  
  const handleSave = () => {
    onUpdateTrackers(localTrackers);
  };

  const handleUndo = () => {
    setLocalTrackers(trackers);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-start">
        <div>
            <p className="text-brand-text-dim mt-1 text-sm">
              Crie e gerencie variáveis que mudam com as ações do jogador.
            </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 mt-1">
            {isDirty && (
                <div className="flex items-center gap-2 text-yellow-400 text-xs font-medium animate-pulse">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Alterações não salvas</span>
                </div>
            )}
            <button
                onClick={handleAddTracker}
                className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Novo Rastreador
            </button>
        </div>
      </div>

      <div className="bg-brand-surface p-6 space-y-4 rounded-md">
        {localTrackers.length > 0 ? (
            localTrackers.map((tracker) => {
            const usages = allTrackerUsages.get(tracker.id) || [];
            return (
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
                             {/* Name and ID */}
                            <div>
                                <label className="block text-sm font-medium text-brand-text-dim mb-1">Nome do Rastreador</label>
                                <input
                                    type="text"
                                    value={tracker.name}
                                    onChange={e => handleTrackerChange(tracker.id, 'name', e.target.value)}
                                    className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text focus:ring-0"
                                    placeholder="Nome do Rastreador"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-brand-text-dim mb-1">ID do Rastreador</label>
                                <p className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-dim font-mono select-all">
                                    {tracker.id}
                                </p>
                            </div>
                            {/* Values */}
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
                        </div>
                        <div className="space-y-4">
                             {/* Consequence Scene */}
                            <div>
                                <label className="block text-sm font-medium text-brand-text-dim mb-1">Cena de Consequência</label>
                                <select
                                    value={tracker.consequenceSceneId}
                                    onChange={e => handleTrackerChange(tracker.id, 'consequenceSceneId', e.target.value)}
                                    className={selectBaseClasses}
                                    style={selectStyle}
                                >
                                    <option value="" className={optionDimClasses}>Selecione uma cena...</option>
                                    {allScenes.map(scene => (
                                        <option key={scene.id} value={scene.id} className={optionBaseClasses}>
                                            {scene.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-brand-text-dim mt-1">
                                    O jogador irá para esta cena quando o valor máximo for atingido.
                                </p>
                            </div>
                            
                             {/* Visual Settings */}
                             <div>
                                <label className="block text-sm font-medium text-brand-text-dim mb-1">Cor da Barra (Opcional)</label>
                                <p className="text-xs text-brand-text-dim mt-1 mb-2">Deixe em branco para usar a cor global.</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={tracker.barColor || ''}
                                        onChange={e => handleTrackerChange(tracker.id, 'barColor', e.target.value)}
                                        placeholder="Use cor global"
                                        className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                                    />
                                    <input
                                        type="color"
                                        value={tracker.barColor || '#58a6ff'}
                                        onChange={e => handleTrackerChange(tracker.id, 'barColor', e.target.value)}
                                        className="w-10 h-10 p-1 bg-transparent border-none rounded-md cursor-pointer"
                                        style={{backgroundColor: 'transparent'}}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2 pt-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`invertBar-${tracker.id}`}
                                        checked={!!tracker.invertBar}
                                        onChange={e => handleTrackerChange(tracker.id, 'invertBar', e.target.checked)}
                                        className="custom-checkbox"
                                    />
                                    <label htmlFor={`invertBar-${tracker.id}`} className="ml-2 block text-sm text-brand-text-dim">
                                        Inverter preenchimento da barra
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`hideValue-${tracker.id}`}
                                        checked={!!tracker.hideValue}
                                        onChange={e => handleTrackerChange(tracker.id, 'hideValue', e.target.checked)}
                                        className="custom-checkbox"
                                    />
                                    <label htmlFor={`hideValue-${tracker.id}`} className="ml-2 block text-sm text-brand-text-dim">
                                        Ocultar valores numéricos no jogo
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-brand-border/50">
                        <h4 className="text-sm font-semibold text-brand-text mb-3">Onde este Rastreador é Usado?</h4>
                        {usages.length > 0 ? (
                            <ul className="space-y-2">
                            {usages.map(({ scene, interaction, effect }, index) => {
                                const targetObject = scene.objects.find(o => o.id === interaction.target);
                                const interactionDesc = `${interaction.verbs[0] || 'Ação'} em ${targetObject?.name || '...'}`;
                                return (
                                <li key={`${interaction.id}-${index}`}>
                                    <button 
                                    onClick={() => onSelectScene(scene.id)}
                                    className="w-full flex justify-between items-center text-left p-3 bg-brand-surface rounded-md border border-brand-border/50 hover:bg-brand-border/30 transition-colors"
                                    title={`Ir para a cena: ${scene.name}`}
                                    >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-brand-text truncate" title={scene.name}>{scene.name}</p>
                                        <p className="text-xs text-brand-text-dim truncate" title={interactionDesc}>{interactionDesc}</p>
                                    </div>
                                    <div className="flex-shrink-0 ml-4 text-center">
                                        <span className={`font-bold text-lg ${effect.valueChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {effect.valueChange >= 0 ? '+' : ''}{effect.valueChange}
                                        </span>
                                    </div>
                                    </button>
                                </li>
                                );
                            })}
                            </ul>
                        ) : (
                            <div className="text-center p-4 bg-brand-surface border-2 border-dashed border-brand-border rounded-md">
                                <p className="text-brand-text-dim text-sm">Este rastreador ainda não é modificado por nenhuma interação.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        })
        ) : (
            <p className="text-center text-brand-text-dim py-4">Nenhum rastreador criado.</p>
        )}
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
                title="Salvar"
            >
                Salvar
            </button>
        </div>
    </div>
  );
};

export default TrackersEditor;