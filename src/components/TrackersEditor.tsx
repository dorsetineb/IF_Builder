import React, { useState, useEffect, useMemo } from 'react';
import { ConsequenceTracker, Scene, Interaction, TrackerEffect, GameObject } from '../types';
import { Plus, Trash2, Search, Activity, ArrowLeft, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon, ExternalLink, SlidersHorizontal, Box, Sword, Key, Map as MapIcon, Eye, FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ColorInput } from './UIEditor/ColorInput';

const TRACKER_ICONS = [
    { name: 'activity', component: Activity },
    { name: 'heart', component: Heart },
    { name: 'zap', component: Zap },
    { name: 'shield', component: Shield },
    { name: 'coins', component: Coins },
    { name: 'clock', component: Clock },
    { name: 'skull', component: Skull },
    { name: 'star', component: Star },
    { name: 'user', component: User },
    { name: 'trophy', component: Trophy },
    { name: 'alert', component: AlertTriangle },
    { name: 'book', component: Book },
    { name: 'crown', component: Crown },
    { name: 'flame', component: Flame },
    { name: 'droplet', component: Droplet },
    { name: 'sun', component: Sun },
    { name: 'moon', component: Moon },
    { name: 'sword', component: Sword },
    { name: 'key', component: Key },
    { name: 'map', component: MapIcon },
    { name: 'eye', component: Eye },
    { name: 'flask', component: FlaskConical },
];

interface TrackersEditorProps {
    trackers: ConsequenceTracker[];
    onUpdateTrackers: (trackers: ConsequenceTracker[]) => void;
    allScenes: Scene[];
    allTrackerIds: string[];
    isDirty: boolean;
    onSetDirty: (isDirty: boolean) => void;
    onSelectScene: (sceneId: string, tab?: string) => void;
    allObjects: Record<string, GameObject>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setConfirmationModal: (modal: any) => void;
    closeConfirmationModal: () => void;
}

const generateUniqueId = (prefix: 'trk', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`;
    } while (existingIds.includes(id));
    return id;
};

const TrackersEditor: React.FC<TrackersEditorProps> = ({ 
    trackers, 
    onUpdateTrackers, 
    allScenes, 
    allTrackerIds, 
    isDirty, 
    onSetDirty, 
    onSelectScene, 
    allObjects,
    setConfirmationModal,
    closeConfirmationModal
}) => {
    const sortedTrackers = useMemo(() => {
        return [...trackers].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [trackers]);

    const [localTrackers, setLocalTrackers] = useState<ConsequenceTracker[]>(sortedTrackers);
    const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(sortedTrackers.length > 0 ? sortedTrackers[0].id : null);
    const [searchTerm, setSearchTerm] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [verbsInput, setVerbsInput] = useState(''); // Unused here, skip
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setLocalTrackers(sortedTrackers);
    }, [sortedTrackers]);

    useEffect(() => {
        // If selected tracker was deleted or doesn't exist, select first or null
        if (selectedTrackerId && !localTrackers.find(t => t.id === selectedTrackerId)) {
            setSelectedTrackerId(localTrackers.length > 0 ? localTrackers[0].id : null);
        } else if (!selectedTrackerId && localTrackers.length > 0) {
            setSelectedTrackerId(localTrackers[0].id);
        }
    }, [localTrackers, selectedTrackerId]);

    useEffect(() => {
        setIsIconPickerOpen(false);
    }, [selectedTrackerId]);

    useEffect(() => {
        onSetDirty(JSON.stringify(localTrackers) !== JSON.stringify(trackers));
    }, [localTrackers, trackers, onSetDirty]);

    const handleAddTracker = () => {
        // Prevent ID collision with existing trackers and potentially unsaved local ones
        const allIds = [...allTrackerIds, ...localTrackers.map(t => t.id)];
        const trackerCount = allIds.length + 1;
        const newTracker: ConsequenceTracker = {
            id: generateUniqueId('trk', allIds),
            name: `${t('trackersEditor.newTracker', 'Novo Rastreador ')}#${trackerCount}`,
            initialValue: 0,
            maxValue: 100,
            consequenceSceneId: '',
        };
        const updatedTrackers = [...localTrackers, newTracker];
        setLocalTrackers(updatedTrackers);
        setSelectedTrackerId(newTracker.id);
    };

    const handleDelete = (id: string) => {
        const tracker = localTrackers.find(t => t.id === id);
        if (!tracker) return;

        setConfirmationModal({
            isOpen: true,
            title: t('trackersEditor.deleteTitle', 'Excluir Rastreador'),
            message: `${t('common.deleteConfirm', 'Tem certeza?')}\n\n${t('trackersEditor.deleteDesc', 'Isso excluirá o rastreador. Interações que o usam podem quebrar.')}`,
            confirmText: t('common.delete', 'Excluir'),
            cancelText: t('common.cancel', 'Cancelar'),
            onConfirm: () => {
                const updatedTrackers = localTrackers.filter(t => t.id !== id);
                setLocalTrackers(updatedTrackers);
                if (selectedTrackerId === id) {
                    setSelectedTrackerId(updatedTrackers.length > 0 ? updatedTrackers[0].id : null);
                }
                closeConfirmationModal();
            },
            isDanger: true,
            onCancel: closeConfirmationModal
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const filteredTrackers = useMemo(() => {
        return localTrackers.filter(t =>
            (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [localTrackers, searchTerm]);

    const selectedTracker = useMemo(() =>
        localTrackers.find(t => t.id === selectedTrackerId),
        [localTrackers, selectedTrackerId]);

    const allTrackerUsages = useMemo(() => {
        const usageMap = new Map<string, { scene: Scene; interaction: Interaction; effect: TrackerEffect }[]>();
        localTrackers.forEach(tracker => usageMap.set(tracker.id, []));
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
    }, [allScenes, localTrackers]);

    const usages = selectedTracker ? (allTrackerUsages.get(selectedTracker.id) || []) : [];

    const usageGroups = useMemo(() => {
        const groups: { scene: Scene; items: { interaction: Interaction; effect: TrackerEffect }[] }[] = [];
        usages.forEach(usage => {
            let group = groups.find(g => g.scene.id === usage.scene.id);
            if (!group) {
                group = { scene: usage.scene, items: [] };
                groups.push(group);
            }
            group.items.push({ interaction: usage.interaction, effect: usage.effect });
        });
        // Sort groups by scene name
        return groups.sort((a, b) => (a.scene.name || '').localeCompare(b.scene.name || ''));
    }, [usages]);

    return (
        <div className="flex w-full h-full overflow-hidden bg-background" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* LEFT SIDEBAR (Standardized Layout) */}
            <div className="w-72 flex-shrink-0 bg-muted-foreground/20 flex flex-col pt-4 pl-2 pr-0 pb-2 transition-all z-10 shadow-lg border-r border-primary/20">
                {/* Search Header */}
                <div className="relative mb-3 mt-0 pr-2 flex-shrink-0">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={t('trackersEditor.searchPlaceholder', 'Buscar rastreadores...')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-[42px] bg-background/50 text-foreground placeholder-muted-foreground border border-primary/50 focus:border-primary focus:bg-background"
                    />
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-3 mb-2">
                    <span>{t('trackersEditor.trackerList', 'Lista de Rastreadores')}</span>
                </div>

                {/* Tracker List */}
                <div className="flex-1 overflow-y-auto p-0 space-y-0 relative">
                    {filteredTrackers.length > 0 && (
                        filteredTrackers.map(tracker => {
                            const IconComponent = TRACKER_ICONS.find(i => i.name === tracker.icon)?.component || Activity;

                            return (
                                <div key={tracker.id} className="w-full mb-1">
                                    <div
                                        onClick={() => setSelectedTrackerId(tracker.id)}
                                        className={`group relative flex items-center transition-all overflow-hidden cursor-pointer w-full ${
                                            selectedTrackerId === tracker.id
                                                ? 'bg-primary text-primary-foreground shadow-md rounded-l-lg rounded-r-none'
                                                : 'text-foreground hover:bg-primary/10 hover:shadow-sm rounded-lg mr-2'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 p-3 w-full relative">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${selectedTrackerId === tracker.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-card border border-muted-foreground/50 text-muted-foreground group-hover:border-border/80'}`}>
                                                <IconComponent className="w-4 h-4 shadow-sm" style={{ color: selectedTrackerId === tracker.id ? 'currentColor' : (tracker.barColor || '#a855f7') }} />
                                            </div>
                                            <div className="flex-1 min-w-0 pr-8">
                                                <p className={`text-xs font-bold truncate text-left ${selectedTrackerId === tracker.id ? 'text-primary-foreground' : 'text-foreground'}`} style={{ textShadow: selectedTrackerId === tracker.id ? 'none' : `0 0 10px ${tracker.barColor}40` }}>{tracker.name || t('trackersEditor.noName', 'Sem nome')}</p>
                                                {!tracker.hideValue && (
                                                    <p className={`text-[10px] truncate mt-0.5 text-left ${selectedTrackerId === tracker.id ? 'text-primary-foreground/80' : 'text-zinc-500'}`}>{tracker.initialValue}/{tracker.maxValue || 100}</p>
                                                )}
                                            </div>
                                            {tracker.invertBar && (
                                                <div className={`absolute top-2 right-2 p-1 rounded-full border shadow-sm z-10 ${selectedTrackerId === tracker.id ? 'bg-primary-foreground/10 border-primary-foreground/30' : 'bg-background border-muted-foreground/30'}`} title={t('trackersEditor.invertedBar', "Barra Invertida")}>
                                                    <ArrowLeft className={`w-2.5 h-2.5 ${selectedTrackerId === tracker.id ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(tracker.id);
                                            }}
                                            className={`absolute top-0 right-0 h-full w-12 flex items-center justify-center text-white transform translate-x-full group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20 cursor-pointer ${
                                                selectedTrackerId === tracker.id
                                                    ? 'bg-red-500 rounded-none' // flush with right edge
                                                    : 'bg-red-500 rounded-r-lg' // match the rounded-lg of container
                                            }`}
                                            title={t('trackersEditor.deleteBtn', 'Excluir')}
                                        >
                                            <Trash2 className="w-5 h-5 pointer-events-none" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div className="pr-2 mt-2 pb-4">
                        <button
                            onClick={handleAddTracker}
                            className="w-full flex items-center justify-start px-2 h-[42px] font-bold rounded-lg transition-all active:scale-95 text-xs bg-white text-zinc-950 hover:bg-zinc-200 mt-2 flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('trackersEditor.createBtn', 'Criar Rastreador')}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN PANEL */}
            <div className="flex-1 overflow-y-auto relative bg-background px-4 pb-4">
                {/* Header with Save/Undo actions */}
                <div className="sticky top-0 z-40 bg-background flex flex-col pt-4 pb-4 gap-3 -mx-4 px-4 shadow-sm border-b border-muted-foreground/50">
                    {/* Solid background shield to perfectly hide scrolled content */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-background pointer-events-none" />
                    
                    <div className="flex justify-between items-center p-4 bg-card rounded-xl border border-muted-foreground/50 shadow-sm relative z-10">
                        <p className="text-muted-foreground text-xs font-medium">
                            {t('trackersEditor.headerDesc', 'Rastreadores permitem medir valores como vida, afeto ou dinheiro.')}
                        </p>
                        <div className="flex items-center gap-3">
                            {isDirty && (
                                <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mr-2">
                                    {t('globalObjectsEditor.unsavedChanges', 'Alterações não salvas')}
                                </div>
                            )}
                            <button
                                onClick={handleUndo}
                                disabled={!isDirty}
                                className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                            >
                                {t('globalObjectsEditor.undoBtn', 'Desfazer')}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!isDirty}
                                className="px-4 py-1.5 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed shadow-sm"
                            >
                                {t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}
                            </button>
                        </div>
                    </div>
                    {/* Soft gradient transition */}
                    <div className="absolute left-0 right-0 -bottom-2 h-2 bg-gradient-to-b from-background to-transparent pointer-events-none" />
                </div>

                <div className="mt-4">
                    <div key={selectedTracker?.id || 'empty'} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {selectedTracker ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Details & Usages */}
                                <div className="space-y-6">
                                    <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                                <SlidersHorizontal className="w-4 h-4" />
                                                {t('trackersEditor.propertiesTitle', 'Propriedades do Rastreador')}
                                            </h3>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-4 gap-4">
                                                {/* Name field */}
                                                <div className="col-span-3 space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('trackersEditor.trackerNameLabel', 'Nome do Rastreador')}</label>
                                                    <div className="flex gap-2">
                                                        {/* Icon Picker */}
                                                        <div className="relative group shrink-0">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIsIconPickerOpen(!isIconPickerOpen);
                                                                }}
                                                                className="w-10 h-10 flex items-center justify-center bg-input border border-input rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                                                            >
                                                                {(() => {
                                                                    const Icon = TRACKER_ICONS.find(i => i.name === selectedTracker.icon)?.component || Activity;
                                                                    return <Icon className="w-5 h-5" />;
                                                                })()}
                                                            </button>
                                                            {isIconPickerOpen && (
                                                                <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-popover border border-muted-foreground/50 rounded-lg z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                                    {TRACKER_ICONS.map(icon => (
                                                                        <button
                                                                            key={icon.name}
                                                                            onClick={() => { handleTrackerChange(selectedTracker.id, 'icon', icon.name); setIsIconPickerOpen(false); }}
                                                                            className={`p-2 rounded hover:bg-accent flex items-center justify-center transition-colors ${selectedTracker.icon === icon.name || (!selectedTracker.icon && icon.name === 'activity') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                                                                            title={icon.name}
                                                                        >
                                                                            <icon.component className="w-4 h-4" />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={selectedTracker.name}
                                                            onChange={(e) => handleTrackerChange(selectedTracker.id, 'name', e.target.value)}
                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
                                                            placeholder={t('trackersEditor.noName', 'Sem nome')}
                                                        />
                                                    </div>
                                                </div>

                                                {/* ID field */}
                                                <div className="col-span-1 space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.uniqueIdLabel', 'ID Único')}</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={selectedTracker.id}
                                                            readOnly
                                                            className="w-full bg-muted/50 border border-input rounded-lg px-3 py-2.5 text-xs text-muted-foreground font-mono cursor-not-allowed"
                                                            title={t('objectEditor.idTooltip', 'O ID é gerado automaticamente e não pode ser alterado.')}
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 text-[10px]">#</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Value 1 (Initial or Inverted Max) */}
                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        {selectedTracker.invertBar 
                                                            ? t('trackersEditor.maxValueLabel', 'Valor Máximo') 
                                                            : t('trackersEditor.initialValueLabel', 'Valor Inicial')}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={selectedTracker.invertBar ? selectedTracker.maxValue : selectedTracker.initialValue}
                                                        onChange={e => handleTrackerChange(selectedTracker.id, selectedTracker.invertBar ? 'maxValue' : 'initialValue', e.target.value === '' ? '' : Number(e.target.value))}
                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
                                                    />
                                                </div>

                                                {/* Value 2 (Max or Inverted Minimum (which writes to initialValue)) */}
                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        {selectedTracker.invertBar 
                                                            ? t('trackersEditor.minValueLabel', 'Valor Mínimo') 
                                                            : t('trackersEditor.maxValueLabel', 'Valor Máximo')}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={selectedTracker.invertBar ? selectedTracker.initialValue : selectedTracker.maxValue}
                                                        onChange={e => handleTrackerChange(selectedTracker.id, selectedTracker.invertBar ? 'initialValue' : 'maxValue', e.target.value === '' ? '' : Number(e.target.value))}
                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Consequence Scene */}
                                            <div className="w-full space-y-1.5 pt-4 border-t border-border/50">
                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('trackersEditor.consequenceLabel', 'Consequência ao atingir máximo')}</label>
                                                <div className="flex gap-2">
                                                    <select
                                                        value={selectedTracker.consequenceSceneId || ''}
                                                        onChange={e => handleTrackerChange(selectedTracker.id, 'consequenceSceneId', e.target.value)}
                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all [&>option]:bg-card"
                                                    >
                                                        <option value="" className="bg-card text-muted-foreground">{t('trackersEditor.noConsequence', 'Nenhuma (Nada acontece)')}</option>
                                                        {allScenes.map(scene => (
                                                            <option key={scene.id} value={scene.id} className="bg-card text-foreground">
                                                                {scene.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {selectedTracker.consequenceSceneId && (
                                                        <button
                                                            onClick={() => onSelectScene(selectedTracker.consequenceSceneId)}
                                                            className="h-[38px] aspect-square flex items-center justify-center bg-card border border-muted-foreground/50 rounded-lg hover:bg-accent hover:border-primary/50 hover:text-primary text-muted-foreground transition-all shrink-0"
                                                            title={t('trackersEditor.goToSceneTooltip', 'Ir para a ramificação de consequência')}
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground italic">
                                                    {t('trackersEditor.consequenceDesc', 'O jogador será enviado para esta ramificação quando o valor do rastreador for maior ou igual ao máximo.')}
                                                </p>
                                            </div>

                                            {/* VISUAL & COLORS (Refined Layout) */}
                                            <div className="w-full space-y-6">
                                                <div className="grid grid-cols-3 gap-6">
                                                    {/* Bar Color (1/3) */}
                                                    <div className="col-span-1">
                                                        <ColorInput
                                                            label={t('trackersEditor.barColorLabel', 'Cor da Barra')}
                                                            id="tracker-bar-color"
                                                            value={selectedTracker.barColor || '#a855f7'}
                                                            onChange={val => handleTrackerChange(selectedTracker.id, 'barColor', val)}
                                                            placeholder="#a855f7"
                                                        />
                                                    </div>

                                                    {/* LIVE PREVIEW SECTION (2/3) */}
                                                    <div className="col-span-2 space-y-1.5">
                                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                            {t('trackersEditor.previewLabel', 'Pré-visualização')}
                                                        </label>
                                                        <div className="flex items-center h-[38px]">
                                                            <div className="w-full h-4 rounded-full overflow-hidden border shadow-sm bg-muted border-muted-foreground/30">
                                                                <div
                                                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                                                    style={{
                                                                        width: `33.33%`,
                                                                        backgroundColor: selectedTracker.barColor || '#a855f7',
                                                                        float: selectedTracker.invertBar ? 'right' : 'none',
                                                                        boxShadow: `inset 0 0 10px rgba(0,0,0,0.1), 0 0 8px ${(selectedTracker.barColor || '#a855f7')}40`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Invert/Hide Flags (Side-by-Side) */}
                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    <label className="flex items-start p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedTracker.invertBar}
                                                                onChange={e => handleTrackerChange(selectedTracker.id, 'invertBar', e.target.checked)}
                                                                className="custom-checkbox"
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{t('trackersEditor.invertFillLabel', 'Inverter Preenchimento')}</span>
                                                            <span className="block text-[9px] text-muted-foreground mt-0.5 leading-tight">{t('trackersEditor.invertFillDesc', 'Barra da direita p/ esquerda.')}</span>
                                                        </div>
                                                    </label>

                                                    <label className="flex items-start p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedTracker.hideValue}
                                                                onChange={e => handleTrackerChange(selectedTracker.id, 'hideValue', e.target.checked)}
                                                                className="custom-checkbox"
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{t('trackersEditor.hideValuesLabel', 'Ocultar Valores')}</span>
                                                            <span className="block text-[9px] text-muted-foreground mt-0.5 leading-tight">{t('trackersEditor.hideValuesDesc', 'Remove números (X/Y).')}</span>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Action buttons (Delete) */}
                                            <div className="pt-6 flex justify-end">
                                                <button
                                                    onClick={() => handleDelete(selectedTracker.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    {t('common.delete', 'Excluir')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column: Linked Interactions */}
                                <div className="space-y-6">
                                    <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '150ms' }}>
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Box className="w-4 h-4" />
                                                {t('trackersEditor.interactionsLabel', 'Interações Vinculadas')}
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            {usageGroups.length > 0 ? (
                                                <div className="flex flex-col">
                                                    {usageGroups.map((group, groupIdx) => (
                                                        <div key={group.scene.id} className={`${groupIdx > 0 ? 'mt-8 pt-8 border-t border-muted-foreground/50 -mx-6 px-6' : ''} space-y-3`}>
                                                            <div className="flex items-center px-1">
                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                                                                    {group.scene.name}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-2">
                                                                {group.items.map((item, idx) => {
                                                                    const { interaction, effect } = item;
                                                                    const targetName = interaction.target ? (allObjects[interaction.target]?.name || interaction.target) : '';
                                                                    const interactionDesc = `${interaction.verbs[0] || t('trackersEditor.actionAction', 'Ação')}${targetName ? ' ' + targetName : ''}`;

                                                                    return (
                                                                        <button
                                                                            key={`${interaction.id}-${idx}`}
                                                                            onClick={() => onSelectScene(group.scene.id, 'interactions')}
                                                                            className="flex items-center justify-between p-2.5 bg-muted/10 border border-muted-foreground/40 rounded-lg hover:border-primary/50 hover:bg-muted/20 transition-all text-left group/item"
                                                                        >
                                                                            <div className="flex flex-col min-w-0 pr-4">
                                                                                <span className="text-xs font-semibold text-foreground group-hover/item:text-primary transition-colors truncate">
                                                                                    {interactionDesc}
                                                                                </span>
                                                                            </div>
                                                                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shrink-0 ${effect.valueChange >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                                                {effect.valueChange >= 0 ? '+' : ''}{effect.valueChange}
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-8 bg-muted/10 border border-dashed border-muted-foreground/30 rounded-lg text-center">
                                                    <p className="text-muted-foreground text-xs italic">
                                                        {t('trackersEditor.noInteractions', 'Nenhuma interação altera este rastreador ainda.')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center mt-20">
                                <Activity className="w-12 h-12 mb-4 opacity-20" />
                                <h4 className="text-sm font-bold text-muted-foreground mb-1">{t('trackersEditor.noTrackerSelected', 'Nenhum rastreador selecionado')}</h4>
                                <p className="text-xs text-muted-foreground max-w-xs">{t('trackersEditor.noTrackerDesc', 'Selecione um rastreador da lista ao lado para editar suas propriedades.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackersEditor;
