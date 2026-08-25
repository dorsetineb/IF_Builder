import React, { useState, useMemo, useEffect } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { Interaction, Scene, GameObject, ConsequenceTracker, TrackerEffect, Vignette, DiceType, DiceOutcomeRange, DiceRollConfig } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Plus, Trash2, Upload, Search, MousePointer2, Box, ArrowRight, MessageSquare, Play, Volume2, Target, CheckCircle2, Activity, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon, Sword, Key, Map as MapIcon, Eye, FlaskConical, X, Dices } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

const INTERACTION_ICONS = [
    { name: 'mouse', component: MousePointer2 },
    { name: 'box', component: Box },
    ...TRACKER_ICONS
];

interface InteractionEditorProps {
    interactions: Interaction[];
    onUpdateInteractions: (interactions: Interaction[]) => void;
    allScenes: Scene[];
    currentSceneId: string;
    sceneObjects: GameObject[];
    allTakableObjects: GameObject[];
    consequenceTrackers: ConsequenceTracker[];
    vignettes: Vignette[];
    isSidePanel?: boolean;
    enableDiceRoll?: boolean;
    diceType?: DiceType;
    diceRollConfig?: DiceRollConfig;
}

const generateUniqueId = (prefix: 'inter', existingIds: string[]): string => {
    let id;
    do { id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`; } while (existingIds.includes(id));
    return id;
};

const InteractionEditor: React.FC<InteractionEditorProps> = ({
    interactions = [],
    onUpdateInteractions,
    allScenes,
    currentSceneId,
    sceneObjects = [],
    allTakableObjects = [],
    consequenceTrackers = [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vignettes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSidePanel,
    enableDiceRoll = false,
    diceType = 'd20',
    diceRollConfig,
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>((interactions && interactions.length > 0) ? 0 : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; index: number | null }>({ isOpen: false, index: null });
    const { t } = useTranslation();

    const safeDiceType = (diceType || 'd20').toLowerCase() as DiceType;
    const diceMaxVal = safeDiceType === 'd6' ? 6 : 20;

    const validateOutcomeRanges = (ranges: DiceOutcomeRange[] = []) => {
        if (!ranges || !Array.isArray(ranges) || ranges.length === 0) {
            return { isValid: false, message: `Nenhuma faixa cadastrada. O intervalo de 1 a ${diceMaxVal} precisa ser coberto.` };
        }
        const counts = new Array(diceMaxVal + 1).fill(0);
        let hasInvalidRange = false;
        for (const r of ranges) {
            if (!r || r.min === undefined || r.max === undefined || r.min === null || r.max === null) {
                hasInvalidRange = true;
                continue;
            }
            const min = Number(r.min);
            const max = Number(r.max);
            if (isNaN(min) || isNaN(max) || min < 1 || max > diceMaxVal || min > max) {
                hasInvalidRange = true;
                continue;
            }
            for (let i = min; i <= max; i++) {
                counts[i]++;
            }
        }
        if (hasInvalidRange) {
            return { isValid: false, message: `Existem faixas com valores fora do limite (1 a ${diceMaxVal}).` };
        }
        const missing: number[] = [];
        const overlaps: number[] = [];
        for (let i = 1; i <= diceMaxVal; i++) {
            if (counts[i] === 0) missing.push(i);
            if (counts[i] > 1) overlaps.push(i);
        }
        if (missing.length === 0 && overlaps.length === 0) {
            return { isValid: true, message: `Excelente! Todo o intervalo de 1 a ${diceMaxVal} está coberto sem lacunas.` };
        }
        const parts: string[] = [];
        if (missing.length > 0) parts.push(`Números ausentes: ${missing.join(', ')}`);
        if (overlaps.length > 0) parts.push(`Números repetidos/sobrepostos: ${Array.from(new Set(overlaps)).join(', ')}`);
        return { isValid: false, message: parts.join(' | ') };
    };

    const handleAdd = () => {
        const newInteraction: Interaction = {
            id: generateUniqueId('inter', interactions.map(i => i.id)),
            verbs: ['usar'],
            target: ''
        };
        const newInteractions = [...interactions, newInteraction];
        onUpdateInteractions(newInteractions);
        setSelectedIndex(newInteractions.length - 1);
    };

    const handleRemove = (index: number) => {
        setDeleteModal({ isOpen: true, index });
    };

    const confirmRemove = () => {
        if (deleteModal.index === null) return;
        const index = deleteModal.index;
        const newInteractions = interactions.filter((_, i) => i !== index);
        onUpdateInteractions(newInteractions);
        if (selectedIndex === index) {
            setSelectedIndex(null);
        } else if (selectedIndex !== null && selectedIndex > index) {
            setSelectedIndex(selectedIndex - 1);
        }
        setDeleteModal({ isOpen: false, index: null });
    };

    const handleUpdate = (index: number, updatedInteraction: Interaction) => {
        const newInteractions = [...interactions];
        newInteractions[index] = updatedInteraction;
        onUpdateInteractions(newInteractions);
    };

    // Filter logic
    const filteredInteractions = useMemo(() => {
        return (interactions || []).map((inter, index) => ({ inter, index })).filter(({ inter }) => {
            if (!inter) return false;
            const searchLower = (searchTerm || '').toLowerCase();
            const titleMatch = inter.title && inter.title.toLowerCase().includes(searchLower);
            const verbsMatch = (inter.verbs || []).join(' ').toLowerCase().includes(searchLower);
            const targetMatch = inter.target && sceneObjects.find(o => o?.id === inter.target)?.name?.toLowerCase().includes(searchLower);
            return titleMatch || verbsMatch || targetMatch;
        });
    }, [interactions, searchTerm, sceneObjects]);

    const selectedInteraction = selectedIndex !== null ? interactions[selectedIndex] : null;

    const [verbsInput, setVerbsInput] = useState('');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    // Sync local input state when selection changes
    useEffect(() => {
        setVerbsInput('');
        setIsIconPickerOpen(false);
    }, [selectedInteraction]);

    // Helper to render interaction editor (reused logic from previous component, adapted)
    const renderEditor = () => {
        if (!selectedInteraction || selectedIndex === null) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleInteractionChange = (field: keyof Interaction, value: any) => {
            handleUpdate(selectedIndex, { ...selectedInteraction, [field]: value });
        };

        const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target && typeof event.target.result === 'string') {
                        handleUpdate(selectedIndex, {
                            ...selectedInteraction,
                            soundEffect: event.target.result,
                            soundEffectName: file.name
                        });
                    }
                };
                reader.readAsDataURL(file);
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleTrackerEffectChange = (effectIndex: number, field: keyof TrackerEffect, value: any) => {
            const newEffects = [...(selectedInteraction.trackerEffects || [])];
            newEffects[effectIndex] = { ...newEffects[effectIndex], [field]: value };
            handleInteractionChange('trackerEffects', newEffects);
        };

        const handleAddTrackerEffect = () => {
            const newEffect: TrackerEffect = { trackerId: '', valueChange: 10 };
            handleInteractionChange('trackerEffects', [...(selectedInteraction.trackerEffects || []), newEffect]);
        };

        const handleRemoveTrackerEffect = (effectIndex: number) => {
            handleInteractionChange('trackerEffects', (selectedInteraction.trackerEffects || []).filter((_, i) => i !== effectIndex));
        };

        const handleAddDiceRange = () => {
            if (selectedIndex === null || !selectedInteraction) return;
            const currentRanges = selectedInteraction.diceOutcomeRanges || [];
            const maxOccupied = currentRanges.reduce((acc, r) => Math.max(acc, r.max), 0);
            const nextMin = Math.min(diceMaxVal, maxOccupied + 1);
            const newRange: DiceOutcomeRange = {
                id: `range_${Math.random().toString(36).substring(2, 7)}`,
                min: nextMin,
                max: diceMaxVal,
                label: `Faixa ${currentRanges.length + 1}`,
                successMessage: ''
            };
            handleInteractionChange('diceOutcomeRanges', [...currentRanges, newRange]);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleUpdateDiceRange = (rangeIndex: number, field: keyof DiceOutcomeRange, value: any) => {
            if (selectedIndex === null || !selectedInteraction) return;
            const currentRanges = [...(selectedInteraction.diceOutcomeRanges || [])];
            if (!currentRanges[rangeIndex]) return;
            currentRanges[rangeIndex] = { ...currentRanges[rangeIndex], [field]: value };
            handleInteractionChange('diceOutcomeRanges', currentRanges);
        };

        const handleRemoveDiceRange = (rangeIndex: number) => {
            if (selectedIndex === null || !selectedInteraction) return;
            const currentRanges = (selectedInteraction.diceOutcomeRanges || []).filter((_, i) => i !== rangeIndex);
            handleInteractionChange('diceOutcomeRanges', currentRanges);
        };


        return (
            <div className="flex flex-col h-full" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pt-0 pb-6 px-6 relative">
                    {/* Soft top gradient */}
                    <div className="sticky top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent pointer-events-none z-10 -ml-6 -mr-6" />
                    <div className="max-w-xl mx-auto flex flex-col gap-6">
                        {/* Row 1: Verbs (as encapsulated tags) */}
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.verbsLabel', 'Verbos (separados por vírgula)')}</label>
                            <div className="min-h-[42px] w-full bg-input border border-input rounded-lg p-1.5 flex flex-wrap items-center gap-1.5 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                {(selectedInteraction.verbs || []).map((verb, idx) => {
                                    const sVerb = enableDiceRoll && diceRollConfig?.successVerb ? diceRollConfig.successVerb.trim().toLowerCase() : '';
                                    const fVerb = enableDiceRoll && diceRollConfig?.failureVerb ? diceRollConfig.failureVerb.trim().toLowerCase() : '';
                                    const normVerb = (verb || '').trim().toLowerCase();

                                    const isSuccess = !!sVerb && normVerb === sVerb;
                                    const isFailure = !!fVerb && normVerb === fVerb;

                                    let tagStyle = "bg-primary/20 text-primary border-primary/30 font-semibold";
                                    if (isSuccess) {
                                        tagStyle = "bg-green-500/20 text-green-400 border-green-500/30 font-mono font-bold";
                                    } else if (isFailure) {
                                        tagStyle = "bg-red-500/20 text-red-400 border-red-500/30 font-mono font-bold";
                                    }

                                    return (
                                        <span
                                            key={idx}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs select-none group/tag animate-in fade-in zoom-in-95 duration-100 ${tagStyle}`}
                                        >
                                            {(isSuccess || isFailure) && <Dices className="w-3.5 h-3.5 shrink-0" />}
                                            <span>{verb}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newVerbs = (selectedInteraction.verbs || []).filter((_, i) => i !== idx);
                                                    handleInteractionChange('verbs', newVerbs);
                                                }}
                                                className="text-muted-foreground hover:text-red-400 p-0.5 rounded transition-colors"
                                                title={t('common.delete', 'Remover')}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    );
                                })}
                                <input
                                    type="text"
                                    value={verbsInput}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val.includes(',')) {
                                            const parts = val.split(',');
                                            const added = parts.map(p => p.trim()).filter(Boolean);
                                            if (added.length > 0) {
                                                const updatedVerbs = Array.from(new Set([...(selectedInteraction.verbs || []), ...added]));
                                                handleInteractionChange('verbs', updatedVerbs);
                                            }
                                            setVerbsInput(parts[parts.length - 1].trim());
                                        } else {
                                            setVerbsInput(val);
                                        }
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' || e.key === ',') {
                                            e.preventDefault();
                                            const added = verbsInput.split(',').map(p => p.trim()).filter(Boolean);
                                            if (added.length > 0) {
                                                const updatedVerbs = Array.from(new Set([...(selectedInteraction.verbs || []), ...added]));
                                                handleInteractionChange('verbs', updatedVerbs);
                                                setVerbsInput('');
                                            }
                                        } else if (e.key === 'Backspace' && verbsInput === '' && (selectedInteraction.verbs || []).length > 0) {
                                            const newVerbs = (selectedInteraction.verbs || []).slice(0, -1);
                                            handleInteractionChange('verbs', newVerbs);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (verbsInput.trim()) {
                                            const added = verbsInput.split(',').map(p => p.trim()).filter(Boolean);
                                            if (added.length > 0) {
                                                const updatedVerbs = Array.from(new Set([...(selectedInteraction.verbs || []), ...added]));
                                                handleInteractionChange('verbs', updatedVerbs);
                                            }
                                            setVerbsInput('');
                                        }
                                    }}
                                    className="flex-1 min-w-[120px] bg-transparent border-none p-1 text-xs text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
                                    placeholder={(selectedInteraction.verbs || []).length === 0 ? t('interactionEditor.verbsPlaceholder', 'Digite um verbo e pressione Enter ou vírgula...') : ''}
                                />
                            </div>
                            <p className="text-[10px] text-zinc-600">{t('interactionEditor.verbsDesc', 'O jogador deve digitar um destes para iniciar a ação.')}</p>

                            {/* Dice Verbs Quick Chips */}
                            {enableDiceRoll && diceRollConfig && (() => {
                                const usedVerbsSet = new Set<string>();
                                (interactions || []).forEach(inter => {
                                    (inter?.verbs || []).forEach(v => {
                                        if (v) usedVerbsSet.add(v.trim().toLowerCase());
                                    });
                                });

                                const sVerb = diceRollConfig.successVerb ? diceRollConfig.successVerb.trim().toLowerCase() : '';
                                const fVerb = diceRollConfig.failureVerb ? diceRollConfig.failureVerb.trim().toLowerCase() : '';

                                const showSuccessChip = !!sVerb && !usedVerbsSet.has(sVerb);
                                const showFailureChip = !!fVerb && !usedVerbsSet.has(fVerb);

                                if (!showSuccessChip && !showFailureChip) return null;

                                return (
                                    <div className="flex items-center gap-2 pt-2 animate-in fade-in duration-200">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            Verbos dos dados
                                        </span>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {showSuccessChip && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (sVerb && !(selectedInteraction.verbs || []).includes(sVerb)) {
                                                            handleInteractionChange('verbs', [...(selectedInteraction.verbs || []), sVerb]);
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-mono font-bold hover:bg-green-500/30 transition-all active:scale-95 cursor-pointer"
                                                    title={`Adicionar verbo de sucesso (${diceRollConfig.successLabel || 'Sucesso'})`}
                                                >
                                                    <span>{diceRollConfig.successVerb}</span>
                                                </button>
                                            )}
                                            {showFailureChip && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (fVerb && !(selectedInteraction.verbs || []).includes(fVerb)) {
                                                            handleInteractionChange('verbs', [...(selectedInteraction.verbs || []), fVerb]);
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold hover:bg-red-500/30 transition-all active:scale-95 cursor-pointer"
                                                    title={`Adicionar verbo de falha (${diceRollConfig.failureLabel || 'Falha'})`}
                                                >
                                                    <span>{diceRollConfig.failureVerb}</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Row 2: Icon & Title */}
                        <div className="flex gap-4 items-start">
                            {/* Icon Picker */}
                            <div className="space-y-1.5 shrink-0 relative">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.iconLabel', 'Ícone')}</label>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsIconPickerOpen(!isIconPickerOpen);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center bg-input border border-input rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                                >
                                    {(() => {
                                        const Icon = INTERACTION_ICONS.find(i => i.name === selectedInteraction.icon)?.component || MousePointer2;
                                        return <Icon className="w-5 h-5" />;
                                    })()}
                                </button>

                                {isIconPickerOpen && (
                                    <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-popover border border-muted-foreground/50 rounded-lg z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                        {INTERACTION_ICONS.map(icon => (
                                            <button
                                                key={icon.name}
                                                type="button"
                                                onClick={() => { handleInteractionChange('icon', icon.name); setIsIconPickerOpen(false); }}
                                                className={`p-2 rounded hover:bg-accent flex items-center justify-center transition-colors ${selectedInteraction.icon === icon.name || (!selectedInteraction.icon && icon.name === 'mouse') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                                                title={icon.name}
                                            >
                                                <icon.component className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Title (Optional) */}
                            <div className="flex-1 space-y-1.5">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.titleLabel', 'Título (Opcional)')}</label>
                                <input
                                    type="text"
                                    value={selectedInteraction.title || ''}
                                    onChange={e => handleInteractionChange('title', e.target.value)}
                                    className="w-full bg-input border border-input rounded-lg p-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground h-10"
                                    placeholder={t('interactionEditor.titlePlaceholder', 'ex: Abrir baú trancado')}
                                />
                            </div>
                        </div>

                        {/* Row 3: Target & Remove Target */}
                        <div className="space-y-3">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-1.5">
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.targetLabel', 'Alvo da ação (opcional)')}</label>
                                    <select
                                        value={selectedInteraction.target || ''}
                                        onChange={e => handleInteractionChange('target', e.target.value)}
                                        className="w-full bg-input border border-input rounded-lg p-2.5 text-xs text-foreground"
                                    >
                                        <option value="">{t('interactionEditor.noTarget', 'Nenhum (Ação no ambiente)')}</option>
                                        {(sceneObjects || []).map(obj => obj && <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                                    </select>
                                </div>

                                <div className="pb-2.5 pr-2">
                                    <label className={`flex items-center gap-2 cursor-pointer group ${!selectedInteraction.target && 'opacity-30 pointer-events-none'}`}>
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={!!selectedInteraction.removesTargetFromScene}
                                                onChange={e => handleInteractionChange('removesTargetFromScene', e.target.checked)}
                                                disabled={!selectedInteraction.target}
                                                className="custom-checkbox"
                                            />
                                        </div>
                                        <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.removesTarget', 'Remove Alvo')}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Target Checkboxes */}
                            <div className="flex flex-row items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedInteraction.addsToInventory}
                                            onChange={e => handleInteractionChange('addsToInventory', e.target.checked)}
                                            className="custom-checkbox"
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.addsToInventory', 'Adiciona ao inventário')}</span>
                                </label>

                                <label className={`flex items-center gap-2 cursor-pointer group ${!selectedInteraction.addsToInventory && 'opacity-30 pointer-events-none'}`}>
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedInteraction.showObjectImage}
                                            onChange={e => handleInteractionChange('showObjectImage', e.target.checked)}
                                            disabled={!selectedInteraction.addsToInventory}
                                            className="custom-checkbox"
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.showObjectImage', 'Exibir imagem do objeto')}</span>
                                </label>
                            </div>
                        </div>

                        {/* Row 4: Requirement & Consumes Item */}
                        <div className="flex gap-4 items-end">
                            <div className="flex-1 space-y-1.5">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.requiresItemLabel', 'Requer item do inventário')}</label>
                                <select
                                    value={selectedInteraction.requiresInInventory || ''}
                                    onChange={e => handleInteractionChange('requiresInInventory', e.target.value || undefined)}
                                    className="w-full bg-input border border-input rounded-lg p-2.5 text-xs text-foreground"
                                >
                                    <option value="">{t('interactionEditor.noItemRequired', 'Não requer item')}</option>
                                    {(allTakableObjects || []).map(obj => obj && <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                                </select>
                            </div>

                            <div className="pb-2.5 pr-2">
                                <label className={`flex items-center gap-2 cursor-pointer group ${!selectedInteraction.requiresInInventory && 'opacity-30 pointer-events-none'}`}>
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedInteraction.consumesItem}
                                            onChange={e => handleInteractionChange('consumesItem', e.target.checked)}
                                            disabled={!selectedInteraction.requiresInInventory}
                                            className="custom-checkbox"
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 uppercase font-bold tracking-wide transition-colors">{t('interactionEditor.consumesItem', 'Consome item')}</span>
                                </label>
                            </div>
                        </div>

                        {/* Row 5: Go To Scene & Sound Effect */}
                        <div className="flex gap-4 items-start">
                            <div className="w-2/3 space-y-1.5">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.goToSceneLabel', 'Ir para Ramificação')}</label>
                                <select value={selectedInteraction.goToScene || ''} onChange={e => handleInteractionChange('goToScene', e.target.value)} className="w-full bg-input border border-input rounded p-2.5 text-xs text-foreground h-[42px]">
                                    <option value="">{t('interactionEditor.stayInScene', '(Permanecer na ramificação)')}</option>
                                    {(allScenes || []).filter(s => s && s.id !== currentSceneId).map(s => <option key={s.id} value={s.id}>{s.name || s.id} ({s.id})</option>)}
                                </select>
                            </div>
                            <div className="w-1/3 space-y-1.5">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.soundEffectLabel', 'Efeito Sonoro (.mp3)')}</label>
                                {selectedInteraction.soundEffect ? (
                                    <div className="flex items-center gap-2.5 p-2 bg-muted/30 border border-dashed border-input rounded-lg hover:border-primary/50 transition-colors h-[42px]">
                                        <div className="w-7 h-7 rounded-full bg-background border border-muted-foreground/50 flex items-center justify-center flex-shrink-0">
                                            <Volume2 className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-semibold text-foreground truncate leading-tight" title={selectedInteraction.soundEffectName || t('interactionEditor.customAudioSet', 'Efeito Sonoro')}>
                                                    {selectedInteraction.soundEffectName || t('interactionEditor.customAudioSet', 'Efeito Sonoro')}
                                                </span>
                                                <span className="text-[9px] text-green-500 truncate leading-none">{t('interactionEditor.audioLoaded', 'Áudio carregado')}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleUpdate(selectedIndex, {
                                                    ...selectedInteraction,
                                                    soundEffect: undefined,
                                                    soundEffectName: undefined
                                                });
                                            }}
                                            className="p-1.5 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded transition-all flex-shrink-0"
                                            title={t('common.delete', 'Excluir')}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 h-[42px]">
                                        <label className="flex-1 h-full flex items-center justify-center px-3 py-2 bg-input border border-input rounded hover:bg-muted cursor-pointer text-xs font-medium transition-colors">
                                            <Upload className="w-3.5 h-3.5 mr-2 text-muted-foreground" /> {t('interactionEditor.addAudioBtn', 'Adicionar')}
                                            <input type="file" accept="audio/*,.mpeg,.mpg,.mp3,.wav,.ogg,.m4a,.aac,.flac" onChange={handleSoundUpload} className="hidden" />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Row 6: Update Scene Description */}
                        <div className="space-y-1.5">
                            <label className={`block text-[10px] font-bold uppercase tracking-widest ${selectedInteraction.goToScene ? 'text-zinc-600' : 'text-zinc-400'}`}>{t('interactionEditor.updateSceneDescLabel', 'Atualizar descrição da ramificação')}</label>
                            <textarea
                                value={selectedInteraction.successMessage || ''} // Using legacy field for backward compatibility, UI says "Description"
                                onChange={e => handleInteractionChange('successMessage', e.target.value)}
                                disabled={!!selectedInteraction.goToScene}
                                rows={2}
                                className={`w-full border border-input rounded p-2.5 text-xs text-foreground resize-y min-h-[40px] max-h-[250px] transition-all ${
                                    selectedInteraction.goToScene
                                        ? 'bg-muted/50 text-muted-foreground opacity-50 cursor-not-allowed border-dashed'
                                        : 'bg-input'
                                }`}
                                placeholder={t('interactionEditor.updateSceneDescPlaceholder', 'Descreve o que acontece...')}
                            />
                        </div>

                        {/* Row 7: Trackers */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('interactionEditor.trackersLabel', 'Rastreadores')}</label>
                                <button 
                                    onClick={handleAddTrackerEffect} 
                                    disabled={(consequenceTrackers || []).length === 0}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                                        (consequenceTrackers || []).length === 0
                                            ? 'bg-zinc-500/10 text-zinc-500 cursor-not-allowed opacity-50'
                                            : 'bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-400'
                                    }`}
                                >
                                    <Plus className="w-3 h-3" /> {t('interactionEditor.addBtn', 'Adicionar')}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(selectedInteraction.trackerEffects || []).map((effect, i) => {
                                    const tracker = (consequenceTrackers || []).find(t => t && t.id === effect.trackerId);
                                    const TrackerIcon = TRACKER_ICONS.find(icon => icon.name === tracker?.icon)?.component || Activity;
                                    
                                    return (
                                        <div key={i} className="flex items-center gap-2 bg-input p-2 rounded border border-input">
                                            <TrackerIcon className="w-3 h-3 text-muted-foreground" />
                                            <select 
                                                value={effect.trackerId || ''} 
                                                onChange={e => handleTrackerEffectChange(i, 'trackerId', e.target.value)} 
                                                className="flex-1 bg-transparent border-none text-xs text-foreground focus:ring-0 p-0"
                                            >
                                                <option value="" className="bg-card text-foreground">{t('interactionEditor.selectTracker', 'Selecione um rastreador...')}</option>
                                                {(consequenceTrackers || []).map(tOption => tOption && (
                                                    <option key={tOption.id} value={tOption.id} className="bg-card text-foreground">
                                                        {tOption.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded border border-muted-foreground/50">
                                                <span className="text-[10px] text-zinc-500">{t('interactionEditor.valueLabel', 'Valor:')}</span>
                                                <input type="number" value={effect.valueChange} onChange={e => handleTrackerEffectChange(i, 'valueChange', e.target.value === '' ? '' : Number(e.target.value))} className="w-12 bg-transparent border-none text-xs h-auto p-0 text-right text-foreground font-mono focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]" />
                                            </div>
                                            <button onClick={() => handleRemoveTrackerEffect(i)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    );
                                })}
                                {(selectedInteraction.trackerEffects || []).length === 0 && (
                                    <div className="text-center py-4 border border-dashed border-muted-foreground/50 rounded bg-muted/20">
                                        <p className="text-[10px] text-zinc-600 italic">{t('interactionEditor.noTrackerEffects', 'Em Rastreadores, crie um rastreador que verifique esta interação')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Row 8: Dice Roll Verb Tip */}
                        {enableDiceRoll && (
                            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3 text-xs text-primary">
                                <Dices className="w-5 h-5 shrink-0" />
                                <div>
                                    <p className="font-bold">🎲 Rolagem de Dados Habilitada ({safeDiceType.toUpperCase()})</p>
                                    <p className="text-[11px] opacity-80">
                                        O resultado do dado age como o verbo de disparo desta ação. Adicione verbos como <code className="bg-background/50 px-1 py-0.5 rounded font-mono font-bold">dice:20</code>, <code className="bg-background/50 px-1 py-0.5 rounded font-mono font-bold">dice:6</code> ou faixas como <code className="bg-background/50 px-1 py-0.5 rounded font-mono font-bold">dice:1-5</code> na lista de verbos acima.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-1 h-full overflow-hidden">
            {/* LEFT SIDEBAR - List */}
            <div className="w-1/3 min-w-[250px] flex flex-col bg-muted-foreground/20 border-r border-primary/20">
                {/* Header/Search */}
                <div className="px-3 pt-3 pb-3 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70 pointer-events-none" />
                        <input
                            type="text"
                            placeholder={t('interactionEditor.searchPlaceholder', 'Buscar verbos...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-[42px] bg-background/50 text-foreground placeholder-muted-foreground border border-primary/60 hover:border-primary/90 focus:border-primary focus:bg-background shadow-sm transition-colors"
                        />
                    </div>

                    {/* Create Interaction Button (Fixed) */}
                    <button
                        onClick={handleAdd}
                        className="w-full flex items-center justify-start px-3 h-[42px] bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-bold transition-all active:scale-[0.98] shadow-sm flex-shrink-0"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('interactionEditor.newInteractionBtn', 'Criar Interação')}
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto min-h-0 pt-0 pb-8 pr-0 flex flex-col items-stretch relative">
                    {filteredInteractions.length > 0 && (
                        filteredInteractions.map(({ inter, index }) => (
                            <button
                                key={inter.id}
                                onClick={() => setSelectedIndex(index)}
                                className={`relative overflow-hidden flex items-center gap-3 h-[42px] px-3 border-transparent transition-all text-left group flex-shrink-0 ${selectedIndex === index ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'text-foreground hover:bg-primary/10 hover:shadow-sm'}`}
                            >
                                <div className={`flex items-center justify-center shrink-0 ${selectedIndex === index ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                    {(() => {
                                        const Icon = INTERACTION_ICONS.find(i => i.name === inter.icon)?.component || MousePointer2;
                                        return <Icon className="w-4 h-4" />;
                                    })()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className={`text-xs font-bold truncate ${selectedIndex === index ? 'text-primary-foreground' : 'text-foreground'}`}>
                                        {inter.title && inter.title.trim() !== '' ? inter.title : ((inter.verbs || []).length > 0 ? (inter.verbs || []).join(', ') : t('interactionEditor.noVerbs', '(Sem verbos)'))}
                                    </div>
                                    {inter.target && sceneObjects.find(o => o.id === inter.target)?.name && (
                                        <div className={`text-[10px] truncate ${selectedIndex === index ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                            {sceneObjects.find(o => o.id === inter.target)?.name}
                                        </div>
                                    )}
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(index);
                                    }}
                                    className="absolute top-0 right-0 h-full w-12 flex items-center justify-center text-white transform translate-x-[calc(100%+2px)] group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20 cursor-pointer bg-red-500"
                                    title={t('interactionEditor.removeInteraction', 'Remover Interação')}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT MAIN PANEL - Editor */}
            <div className="flex-1 flex flex-col min-w-0">
                {selectedIndex !== null ? (
                    renderEditor()
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <MousePointer2 className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-sm font-bold text-muted-foreground mb-1">{t('interactionEditor.noInteractionSelected', 'Nenhuma interação selecionada')}</h4>
                        <p className="text-xs max-w-xs opacity-60">{t('interactionEditor.noInteractionDesc', 'Selecione uma interação da lista para editar ou crie uma nova.')}</p>
                    </div>
                )}
            </div>
            
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                title={t('interactionEditor.removeInteraction', 'Remover Interação')}
                message={`${t('common.deleteConfirm', 'Tem certeza?')}\n\n${t('interactionEditor.deleteDesc', 'Isso excluirá permanentemente esta interação.')}`}
                confirmText={t('common.delete', 'Excluir')}
                cancelText={t('common.cancel', 'Cancelar')}
                isDanger={true}
                onConfirm={confirmRemove}
                onCancel={() => setDeleteModal({ isOpen: false, index: null })}
            />
        </div>
    );
};

export default InteractionEditor;
