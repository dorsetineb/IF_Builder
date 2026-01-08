
import React, { useState, useEffect, useMemo } from 'react';
import { ConsequenceTracker, Scene, Interaction, TrackerEffect } from '../types';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

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
const selectBaseClasses = "w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 appearance-none bg-no-repeat pr-8 focus:ring-0 [&>option]:bg-zinc-950";
const selectStyle = { backgroundImage: `url("${whiteChevron}")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' };
const optionBaseClasses = "bg-zinc-950 text-zinc-300";
const optionDimClasses = "bg-zinc-950 text-zinc-500";

const TrackerItem: React.FC<{
    tracker: ConsequenceTracker;
    onUpdate: (id: string, field: keyof ConsequenceTracker, value: any) => void;
    onRemove: (id: string) => void;
    onSelectScene: (sceneId: string) => void;
    allScenes: Scene[];
    usages: { scene: Scene; interaction: Interaction; effect: TrackerEffect }[];
}> = ({ tracker, onUpdate, onRemove, onSelectScene, allScenes, usages }) => {
    const [isOpen, setIsOpen] = useState(false);

    const consequenceSceneName = useMemo(() => {
        if (!tracker.consequenceSceneId) return '(Nenhuma)';
        return allScenes.find(s => s.id === tracker.consequenceSceneId)?.name || tracker.consequenceSceneId;
    }, [tracker.consequenceSceneId, allScenes]);

    return (
        <div className={`bg-zinc-900/30 rounded-lg border ${isOpen ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.05)]' : 'border-zinc-800/80'} overflow-hidden transition-all duration-300 relative`}>
            {/* Header - Always visible summary */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center p-4 cursor-pointer hover:bg-zinc-800/50 transition-all overflow-hidden group ${isOpen ? 'bg-purple-500/5 border-b border-purple-500/10' : ''}`}
            >
                {/* Sliding Trash Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(tracker.id); }}
                    className="absolute top-0 right-0 h-full w-12 flex items-center justify-center bg-red-500 text-white transform translate-x-full group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20"
                    title="Excluir rastreador"
                >
                    <Trash2 className="w-5 h-5" />
                </button>

                {/* Expansion Arrow */}
                <ChevronDown
                    className={`w-4 h-4 text-zinc-600 transition-transform duration-300 mr-4 shrink-0 ${isOpen ? '-rotate-90' : 'rotate-0'}`}
                />

                <div className="flex flex-1 items-center overflow-hidden h-6">
                    {/* Nome & ID */}
                    <div className="flex items-center gap-2 min-w-0 pr-6 border-r border-zinc-800 h-full">
                        <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider shrink-0">Nome:</span>
                        <div className="flex items-center truncate">
                            <span className="text-xs font-bold text-white truncate">{tracker.name || '(Sem nome)'}</span>
                            <span className="ml-2 text-[10px] text-zinc-600 font-mono opacity-50 shrink-0">({tracker.id})</span>
                        </div>
                    </div>

                    {/* Alcance */}
                    <div className="flex items-center gap-2 min-w-0 px-6 border-r border-zinc-800 h-full">
                        <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider shrink-0">Início / Max:</span>
                        <span className="text-xs font-bold text-purple-400 truncate">{tracker.initialValue} / {tracker.maxValue}</span>
                    </div>

                    {/* Cena */}
                    <div className="flex items-center gap-2 min-w-0 px-6 h-full">
                        <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider shrink-0">Cena:</span>
                        <span className="text-xs font-bold text-purple-400 truncate">{consequenceSceneName}</span>
                    </div>

                    {/* Color Indicator */}
                    {tracker.barColor && (
                        <div className="ml-auto flex items-center gap-2 shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-[0_0_8px_rgba(255,255,255,0.1)]" style={{ backgroundColor: tracker.barColor }}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Collapsible Content */}
            {isOpen && (
                <div className="p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Nome do Rastreador</label>
                                <input
                                    type="text"
                                    value={tracker.name}
                                    onChange={e => onUpdate(tracker.id, 'name', e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0"
                                    placeholder="Nome do Rastreador"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">ID do Rastreador</label>
                                <p className="w-full bg-zinc-950/50 border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-500 font-mono select-all">
                                    {tracker.id}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Valor Inicial</label>
                                    <input
                                        type="number"
                                        value={tracker.initialValue}
                                        onChange={e => onUpdate(tracker.id, 'initialValue', parseInt(e.target.value, 10) || 0)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Valor Máximo</label>
                                    <input
                                        type="number"
                                        value={tracker.maxValue}
                                        onChange={e => onUpdate(tracker.id, 'maxValue', parseInt(e.target.value, 10) || 0)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Consequência</label>
                                <select
                                    value={tracker.consequenceSceneId}
                                    onChange={e => onUpdate(tracker.id, 'consequenceSceneId', e.target.value)}
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
                                <p className="text-[10px] text-zinc-600 mt-2 italic">
                                    O jogador irá para esta cena quando o valor máximo for atingido.
                                </p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Cor da Barra (Opcional)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={tracker.barColor || ''}
                                        onChange={e => onUpdate(tracker.id, 'barColor', e.target.value)}
                                        placeholder="Hex: #ffffff"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0"
                                    />
                                    <input
                                        type="color"
                                        value={tracker.barColor || '#a855f7'}
                                        onChange={e => onUpdate(tracker.id, 'barColor', e.target.value)}
                                        className="w-8 h-8 p-1 bg-transparent border-none rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-3 pt-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`invertBar-${tracker.id}`}
                                        checked={!!tracker.invertBar}
                                        onChange={e => onUpdate(tracker.id, 'invertBar', e.target.checked)}
                                        className="custom-checkbox"
                                    />
                                    <label htmlFor={`invertBar-${tracker.id}`} className="ml-2 block text-xs text-zinc-500 font-medium">
                                        Inverter preenchimento da barra
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`hideValue-${tracker.id}`}
                                        checked={!!tracker.hideValue}
                                        onChange={e => onUpdate(tracker.id, 'hideValue', e.target.checked)}
                                        className="custom-checkbox"
                                    />
                                    <label htmlFor={`hideValue-${tracker.id}`} className="ml-2 block text-xs text-zinc-500 font-medium">
                                        Ocultar valores numéricos no jogo
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-900">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Uso do Rastreador</h4>
                        {usages.length > 0 ? (
                            <ul className="space-y-2">
                                {usages.map(({ scene, interaction, effect }, index) => {
                                    const interactionDesc = `${interaction.verbs[0] || 'Ação'}${interaction.target ? ' em ' + interaction.target : ''}`;

                                    return (
                                        <li key={`${interaction.id}-${index}`}>
                                            <button
                                                onClick={() => onSelectScene(scene.id)}
                                                className="w-full flex justify-between items-center text-left p-3 bg-zinc-950/50 rounded-lg border border-zinc-900 hover:border-zinc-800 transition-all shadow-sm"
                                                title={`Ir para a cena: ${scene.name}`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-zinc-200 truncate" title={scene.name}>{scene.name}</p>
                                                    <p className="text-xs text-zinc-600 truncate italic" title={interactionDesc}>{interactionDesc}</p>
                                                </div>
                                                <div className="flex-shrink-0 ml-4 text-center">
                                                    <span className={`font-mono font-bold text-xs px-2 py-1 rounded-md ${effect.valueChange >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                        {effect.valueChange >= 0 ? '+' : ''}{effect.valueChange}
                                                    </span>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-center p-8 bg-zinc-950/20 border-2 border-dashed border-zinc-900/50 rounded-xl">
                                <p className="text-zinc-600 text-xs italic">Este rastreador ainda não é modificado por nenhuma interação.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

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

    const handleTrackerChange = (id: string, field: keyof ConsequenceTracker, value: any) => {
        setLocalTrackers(prev => prev.map(t => {
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
                    <p className="text-zinc-500 mt-1 text-xs font-medium">
                        Crie e gerencie variáveis que mudam com as ações do jogador (ex: Vida, Dinheiro, Sanidade).
                    </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 mt-1">
                    {isDirty && (
                        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>Alterações não salvas</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {localTrackers.length > 0 ? (
                    localTrackers.map((tracker) => (
                        <TrackerItem
                            key={tracker.id}
                            tracker={tracker}
                            onUpdate={handleTrackerChange}
                            onRemove={handleRemoveTracker}
                            onSelectScene={onSelectScene}
                            allScenes={allScenes}
                            usages={allTrackerUsages.get(tracker.id) || []}
                        />
                    ))
                ) : (
                    <p className="text-center text-zinc-500 py-16 border-2 border-dashed border-zinc-800/50 rounded-xl bg-zinc-950/20 italic text-xs">Nenhum rastreador criado.</p>
                )}
            </div>

            {/* Floating Add Button - Adjusted to match sidebar constraints */}
            <div className="fixed bottom-6 left-[calc(25%+2.5rem)] xl:left-[calc(20%+2.5rem)] z-10 flex gap-2">
                <button
                    onClick={handleAddTracker}
                    className="flex items-center px-4 py-2 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-xl active:scale-95 text-xs"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Rastreador
                </button>
            </div>

            <div className="fixed bottom-6 right-10 z-10 flex gap-2">
                <button
                    onClick={handleUndo}
                    disabled={!isDirty}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold rounded-lg hover:bg-zinc-800 transition-all text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Desfazer
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="px-4 py-2 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-all text-xs disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed shadow-xl"
                    title="Salvar"
                >
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};

export default TrackersEditor;
