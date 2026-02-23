import React, { useState, useEffect, useMemo } from 'react';
import { ConsequenceTracker, Scene, Interaction, TrackerEffect } from '../types';
import { Plus, Trash2, Search, Activity, ArrowLeft, ArrowRight, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon, ExternalLink } from 'lucide-react';

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
];

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
const selectBaseClasses = "w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 appearance-none bg-no-repeat pr-8 focus:ring-0 [&>option]:bg-zinc-950";
const selectStyle = { backgroundImage: `url("${whiteChevron}")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' };
const optionBaseClasses = "bg-zinc-950 text-zinc-300";
const optionDimClasses = "bg-zinc-950 text-zinc-500";

const TrackersEditor: React.FC<TrackersEditorProps> = ({ trackers, onUpdateTrackers, allScenes, allTrackerIds, isDirty, onSetDirty, onSelectScene }) => {
    const sortedTrackers = useMemo(() => {
        return [...trackers].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [trackers]);

    const [localTrackers, setLocalTrackers] = useState<ConsequenceTracker[]>(sortedTrackers);
    const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(sortedTrackers.length > 0 ? sortedTrackers[0].id : null);
    const [searchTerm, setSearchTerm] = useState('');

    const [verbsInput, setVerbsInput] = useState(''); // Unused here, skip
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    useEffect(() => {
        setLocalTrackers(sortedTrackers);
        // If selected tracker was deleted or doesn't exist, select first or null
        if (selectedTrackerId && !sortedTrackers.find(t => t.id === selectedTrackerId)) {
            setSelectedTrackerId(sortedTrackers.length > 0 ? sortedTrackers[0].id : null);
        } else if (!selectedTrackerId && sortedTrackers.length > 0) {
            setSelectedTrackerId(sortedTrackers[0].id);
        }
    }, [sortedTrackers]);

    useEffect(() => {
        setIsIconPickerOpen(false);
    }, [selectedTrackerId]);

    useEffect(() => {
        onSetDirty(JSON.stringify(localTrackers) !== JSON.stringify(trackers));
    }, [localTrackers, trackers, onSetDirty]);

    const handleAddTracker = () => {
        // Prevent ID collision with existing trackers and potentially unsaved local ones
        const allIds = [...allTrackerIds, ...localTrackers.map(t => t.id)];
        const newTracker: ConsequenceTracker = {
            id: generateUniqueId('trk', allIds),
            name: 'Novo Rastreador',
            initialValue: 0,
            maxValue: 100,
            consequenceSceneId: '',
        };
        const updatedTrackers = [...localTrackers, newTracker];
        setLocalTrackers(updatedTrackers);
        setSelectedTrackerId(newTracker.id);

        // Immediate save for creation to simplify ID management, or follow "Save Changes" pattern?
        // Pattern here seems to be "Save Changes" for everything.
    };

    const handleRemoveTracker = (id: string) => {
        if (window.confirm('Tem certeza? Isso excluirá o rastreador. Interações que o usam podem quebrar.')) {
            setLocalTrackers(localTrackers.filter(t => t.id !== id));
            if (selectedTrackerId === id) {
                setSelectedTrackerId(null);
            }
        }
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

    // Determine consequence scene name for display
    const consequenceSceneName = useMemo(() => {
        if (!selectedTracker?.consequenceSceneId) return null;
        return allScenes.find(s => s.id === selectedTracker.consequenceSceneId)?.name || selectedTracker.consequenceSceneId;
    }, [selectedTracker?.consequenceSceneId, allScenes]);


    return (
        <div className="space-y-6 pb-8" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* Header with Save/Undo actions */}
            <div className="sticky top-0 z-40 backdrop-blur-md bg-background/95 flex justify-between items-center p-4 rounded-xl border border-border">
                <p className="text-muted-foreground text-xs font-medium max-w-lg">
                    Crie e gerencie variáveis que mudam com as ações do jogador (ex: Vida, Dinheiro, Sanidade).
                </p>
                <div className="flex items-center gap-3">
                    {isDirty && (
                        <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mr-2">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                            Alterações não salvas
                        </div>
                    )}
                    <button
                        onClick={handleUndo}
                        disabled={!isDirty}
                        className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                    >
                        Desfazer
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="px-4 py-1.5 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed shadow-sm"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>

            <div className="flex h-[600px] border border-muted-foreground/20 rounded-xl overflow-hidden bg-card shadow-sm">
                {/* LEFT SIDEBAR */}
                <div className="w-1/3 min-w-[250px] border-r border-muted-foreground/20 flex flex-col bg-zinc-950/30">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-muted-foreground/10 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar rastreadores..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-input border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground"
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1">
                            <span>Lista de Rastreadores</span>
                            <span>{filteredTrackers.length}</span>
                        </div>
                    </div>

                    {/* Tracker List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredTrackers.length > 0 && (
                            filteredTrackers.map(tracker => {
                                const percentage = Math.min(100, Math.max(0, (tracker.initialValue / (tracker.maxValue || 100)) * 100));
                                const barWidth = `${percentage}%`;
                                const IconComponent = TRACKER_ICONS.find(i => i.name === tracker.icon)?.component || Activity;

                                return (
                                    <button
                                        key={tracker.id}
                                        onClick={() => setSelectedTrackerId(tracker.id)}
                                        className={`relative w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left group ${selectedTrackerId === tracker.id ? 'bg-primary/10 border-primary/40' : 'bg-transparent border-transparent hover:bg-muted hover:border-border'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg bg-card border flex items-center justify-center overflow-hidden shrink-0 shadow-sm ${selectedTrackerId === tracker.id ? 'border-primary/30' : 'border-border group-hover:border-border/80'}`}>
                                            <IconComponent
                                                className="w-5 h-5 shadow-sm"
                                                style={{ color: tracker.barColor || '#a855f7' }}
                                                fill={tracker.barColor ? `${tracker.barColor}30` : '#a855f730'}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1 flex flex-col gap-1.5 pt-0.5">
                                            <div className="flex justify-between items-center w-full">
                                                <div className={`text-xs font-bold truncate ${selectedTrackerId === tracker.id ? 'text-primary' : 'text-foreground'}`} style={{ textShadow: selectedTrackerId === tracker.id ? `0 0 10px ${tracker.barColor}40` : 'none' }}>
                                                    {tracker.name || 'Sem nome'}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 font-mono truncate opacity-60">
                                                    {tracker.initialValue}/{tracker.maxValue || 100}
                                                </div>
                                            </div>

                                            {/* Progress Bar Preview */}
                                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden border border-border shadow-inner">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                                    style={{
                                                        width: barWidth,
                                                        backgroundColor: tracker.barColor || '#a855f7',
                                                        boxShadow: `0 0 8px ${tracker.barColor || '#a855f7'}60`
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="absolute -top-1 -right-1 p-1 bg-background rounded-full border border-border shadow-sm z-10" title={tracker.invertBar ? "Barra Invertida" : "Barra Normal"}>
                                            {tracker.invertBar ? (
                                                <ArrowLeft className="w-2.5 h-2.5 text-muted-foreground" />
                                            ) : (
                                                <ArrowRight className="w-2.5 h-2.5 text-muted-foreground opacity-50" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                        <button
                            onClick={handleAddTracker}
                            className="w-full py-2.5 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm mt-2"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Novo Rastreador
                        </button>
                    </div>
                </div>

                {/* RIGHT MAIN PANEL */}
                <div className="flex-1 flex flex-col bg-zinc-950/10 min-w-0">
                    {selectedTracker ? (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-muted-foreground/10 flex justify-between items-center bg-zinc-900/30 shrink-0">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Propriedades do Rastreador</span>
                                </div>

                                {/* Context Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleRemoveTracker(selectedTracker.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 rounded-md text-[10px] font-bold uppercase transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Excluir
                                    </button>
                                </div>
                            </div>

                            {/* Edit Form */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="max-w-4xl mx-auto space-y-10">
                                    {/* Main Grid */}
                                    <div className="grid grid-cols-4 gap-x-4 gap-y-6">

                                        {/* Name field & Icon */}
                                        <div className="col-span-4 space-y-1.5">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nome do Rastreador</label>
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
                                                        <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-popover border border-border rounded-lg shadow-xl z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                            {TRACKER_ICONS.map(icon => (
                                                                <button
                                                                    key={icon.name}
                                                                    onClick={() => { handleTrackerChange(selectedTracker.id, 'icon', icon.name); setIsIconPickerOpen(false); }}
                                                                    className={`p-2 rounded hover:bg-accent flex items-center justify-center transition-colors ${selectedTracker.icon === icon.name ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
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
                                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary/50"
                                                />
                                            </div>
                                        </div>

                                        {/* ID field */}
                                        <div className="col-span-1 space-y-1.5">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID Único</label>
                                            <input
                                                type="text"
                                                value={selectedTracker.id}
                                                readOnly
                                                className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-xs text-muted-foreground font-mono cursor-not-allowed h-[38px]"
                                                title="O ID é gerado automaticamente e não pode ser alterado."
                                            />
                                        </div>

                                        {/* Initial Value */}
                                        <div className="col-span-1 space-y-1.5">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Valor Inicial</label>
                                            <input
                                                type="number"
                                                value={selectedTracker.initialValue}
                                                onChange={e => handleTrackerChange(selectedTracker.id, 'initialValue', parseInt(e.target.value, 10) || 0)}
                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>

                                        {/* Max Value */}
                                        <div className="col-span-1 space-y-1.5">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Valor Máximo</label>
                                            <input
                                                type="number"
                                                value={selectedTracker.maxValue}
                                                onChange={e => handleTrackerChange(selectedTracker.id, 'maxValue', parseInt(e.target.value, 10) || 0)}
                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>

                                        {/* Bar Color */}
                                        <div className="col-span-1 space-y-1.5">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cor da Barra</label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 flex items-center bg-input border border-input rounded-lg px-2 py-1.5 h-[38px]">
                                                    <input
                                                        type="color"
                                                        value={selectedTracker.barColor || '#a855f7'}
                                                        onChange={e => handleTrackerChange(selectedTracker.id, 'barColor', e.target.value)}
                                                        className="w-5 h-5 bg-transparent border-none p-0 cursor-pointer mr-2"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={selectedTracker.barColor || '#a855f7'}
                                                        onChange={e => handleTrackerChange(selectedTracker.id, 'barColor', e.target.value)}
                                                        className="flex-1 bg-transparent border-none text-xs text-foreground focus:ring-0 font-mono p-0 uppercase"
                                                        placeholder="#a855f7"
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        {/* Flags */}
                                        <div className="col-span-4 grid grid-cols-2 gap-4 pt-2">
                                            <label className="flex items-start p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!selectedTracker.invertBar}
                                                        onChange={e => handleTrackerChange(selectedTracker.id, 'invertBar', e.target.checked)}
                                                        className="w-4 h-4 rounded border-muted-foreground/30 bg-input text-primary focus:ring-primary/50 focus:ring-offset-0 transition-all"
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors">Inverter Preenchimento</span>
                                                    <span className="block text-[10px] text-muted-foreground mt-0.5">A barra diminui da direita para a esquerda.</span>
                                                </div>
                                                <ArrowLeft className={`ml-auto w-4 h-4 text-muted-foreground ${selectedTracker.invertBar ? 'text-primary' : ''}`} />
                                            </label>

                                            <label className="flex items-start p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!selectedTracker.hideValue}
                                                        onChange={e => handleTrackerChange(selectedTracker.id, 'hideValue', e.target.checked)}
                                                        className="w-4 h-4 rounded border-muted-foreground/30 bg-input text-primary focus:ring-primary/50 focus:ring-offset-0 transition-all"
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors">Ocultar Valores</span>
                                                    <span className="block text-[10px] text-muted-foreground mt-0.5">Não mostra os números (X/Y) na interface.</span>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Consequence Scene */}
                                        <div className="col-span-4 space-y-1.5 pt-4 border-t border-border/50">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Consequência ao atingir máximo</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={selectedTracker.consequenceSceneId || ''}
                                                    onChange={e => handleTrackerChange(selectedTracker.id, 'consequenceSceneId', e.target.value)}
                                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-0 [&>option]:bg-card"
                                                // style={selectStyle} // Using default arrow for simplicity in semantic refactor
                                                >
                                                    <option value="" className="bg-card text-muted-foreground">Nenhuma (Nada acontece)</option>
                                                    {allScenes.map(scene => (
                                                        <option key={scene.id} value={scene.id} className="bg-card text-foreground">
                                                            {scene.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {selectedTracker.consequenceSceneId && (
                                                    <button
                                                        onClick={() => onSelectScene(selectedTracker.consequenceSceneId)}
                                                        className="h-[38px] aspect-square flex items-center justify-center bg-card border border-border rounded-lg hover:bg-accent hover:border-primary/50 hover:text-primary text-muted-foreground transition-all shrink-0"
                                                        title="Ir para a cena de consequência"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground italic">
                                                O jogador será enviado para esta cena quando o valor do rastreador for maior ou igual ao máximo.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Usages List */}
                                    <div className="pt-6 border-t border-border/50 space-y-4">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Interações que alteram este rastreador</label>
                                        {usages.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {usages.map(({ scene, interaction, effect }, index) => {
                                                    const interactionDesc = `${interaction.verbs[0] || 'Ação'}${interaction.target ? ' em ' + interaction.target : ''}`;
                                                    return (
                                                        <button
                                                            key={`${interaction.id}-${index}`}
                                                            onClick={() => onSelectScene(scene.id)}
                                                            className="flex flex-col items-start p-3 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all text-left group"
                                                        >
                                                            <div className="w-full flex justify-between items-start mb-1">
                                                                <span className="text-xs font-bold text-foreground group-hover:text-primary truncate">{scene.name}</span>
                                                                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${effect.valueChange >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                                    {effect.valueChange >= 0 ? '+' : ''}{effect.valueChange}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground truncate w-full">{interactionDesc}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-dashed border-border rounded-lg text-center">
                                                <p className="text-muted-foreground text-xs italic">Nenhuma interação altera este rastreador ainda.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                            <Activity className="w-12 h-12 mb-4 opacity-20" />
                            <h4 className="text-sm font-bold text-foreground mb-1">Nenhum rastreador selecionado</h4>
                            <p className="text-xs max-w-xs opacity-60">Selecione um rastreador da lista ao lado para editar suas propriedades.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackersEditor;
