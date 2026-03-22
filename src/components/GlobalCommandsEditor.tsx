import React, { useState, useEffect, useMemo } from 'react';
import { FixedVerb, GameData } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Plus, Trash2, Search, Command, MessageSquare, Box, Activity, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

const COMMAND_ICONS = [
    { name: 'message', component: MessageSquare },
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

interface GlobalCommandsEditorProps {
    fixedVerbs: FixedVerb[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (field: keyof GameData | Partial<GameData>, value?: any, skipDirty?: boolean) => void;
    isDirty: boolean;
    onSetDirty: (isDirty: boolean) => void;
}

const generateUniqueId = (prefix: string, existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
    } while (existingIds.includes(id));
    return id;
};

const GlobalCommandsEditor: React.FC<GlobalCommandsEditorProps> = ({
    fixedVerbs,
    onUpdate,
    isDirty,
    onSetDirty,
}) => {
    const [localVerbs, setLocalVerbs] = useState<FixedVerb[]>(fixedVerbs);
    const [selectedVerbId, setSelectedVerbId] = useState<string | null>(fixedVerbs.length > 0 ? fixedVerbs[0].id : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const { t } = useTranslation();

    // Sync from props
    useEffect(() => {
        setLocalVerbs(fixedVerbs);
        if (selectedVerbId && !fixedVerbs.find(v => v.id === selectedVerbId)) {
            setSelectedVerbId(fixedVerbs.length > 0 ? fixedVerbs[0].id : null);
        } else if (!selectedVerbId && fixedVerbs.length > 0) {
            setSelectedVerbId(fixedVerbs[0].id);
        }

        // Initialize default "Ajuda" command if list is completely empty

    }, [fixedVerbs]);
    // ^ Dependency is only fixedVerbs. If fixedVerbs is empty, we handle it.

    // Dirty check
    useEffect(() => {
        const isDifferent = JSON.stringify(localVerbs) !== JSON.stringify(fixedVerbs);
        onSetDirty(isDifferent);
    }, [localVerbs, fixedVerbs, onSetDirty]);

    const filteredVerbs = useMemo(() => {
        if (!searchTerm) return localVerbs;
        const term = searchTerm.toLowerCase();
        return localVerbs.filter(v =>
            v.verbs.some(verb => verb.toLowerCase().includes(term)) ||
            v.description.toLowerCase().includes(term)
        );
    }, [localVerbs, searchTerm]);

    const selectedVerb = useMemo(() => {
        return localVerbs.find(v => v.id === selectedVerbId) || null;
    }, [localVerbs, selectedVerbId]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleVerbChange = (verbId: string, field: keyof FixedVerb, value: any) => {
        setLocalVerbs(prev =>
            prev.map(v => v.id === verbId ? { ...v, [field]: value } : v)
        );
    };

    const handleCreate = () => {
        const existingIds = localVerbs.map(v => v.id);
        const verbCount = existingIds.length + 1;
        const newId = generateUniqueId('verb', existingIds);
        const newVerb: FixedVerb = {
            id: newId,
            verbs: [],
            description: `${t('globalCommandsEditor.newCommand', 'Novo Verbo ')}#${verbCount}`,
            icon: 'message'
        };
        setLocalVerbs(prev => [...prev, newVerb]);
        setSelectedVerbId(newId);
    };

    const handleDelete = (verbId: string) => {
        setLocalVerbs(prev => prev.filter(v => v.id !== verbId));
        if (selectedVerbId === verbId) {
            const remaining = localVerbs.filter(v => v.id !== verbId);
            setSelectedVerbId(remaining.length > 0 ? remaining[0].id : null);
        }
    };

    const handleSave = () => {
        onUpdate('fixedVerbs', localVerbs, true);
        // Enable fixed verbs automatically if there are commands
        onUpdate('enableFixedVerbs', localVerbs.length > 0, true);
        onSetDirty(false);
    };

    const handleUndo = () => {
        setLocalVerbs(fixedVerbs);
    };


    return (
        <div className="flex w-full h-full overflow-hidden bg-background" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* LEFT SIDEBAR (Standardized Layout) */}
            <div className="w-72 flex-shrink-0 bg-muted-foreground/20 flex flex-col pt-4 pl-2 pr-0 pb-2 transition-all z-10 shadow-lg border-r border-primary/20">
                {/* Search Header */}
                <div className="relative mb-3 mt-2 pr-2 flex-shrink-0">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={t('globalCommandsEditor.searchPlaceholder', 'Buscar verbo...')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-[42px] bg-background/50 text-foreground placeholder-muted-foreground border border-primary/50 focus:border-primary focus:bg-background"
                    />
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-3 mb-2">
                    <span>{t('globalCommandsEditor.commandList', 'Lista de Verbos')}</span>
                </div>

                {/* Command List */}
                <div className="flex-1 overflow-y-auto p-0 space-y-0 relative">
                    {filteredVerbs.length > 0 && (
                        filteredVerbs.map(verb => {
                            const IconComponent = COMMAND_ICONS.find(i => i.name === verb.icon)?.component || MessageSquare;
                            return (
                                <div key={verb.id} className="w-full mb-1">
                                    <div
                                        onClick={() => setSelectedVerbId(verb.id)}
                                        className={`group relative flex items-center transition-all overflow-hidden cursor-pointer w-full ${
                                            selectedVerbId === verb.id
                                                ? 'bg-primary text-primary-foreground shadow-md rounded-l-lg rounded-r-none'
                                                : 'text-foreground hover:bg-primary/10 hover:shadow-sm rounded-lg mr-2'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 p-3 w-full">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${selectedVerbId === verb.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-card border border-muted-foreground/50 text-muted-foreground group-hover:border-border/80'}`}>
                                                <IconComponent className="w-4 h-4 shadow-sm" />
                                            </div>
                                            <div className="flex-1 min-w-0 pr-8">
                                                <p className={`text-xs text-left font-bold truncate ${selectedVerbId === verb.id ? 'text-primary-foreground' : 'text-foreground'}`}>
                                                    {verb.verbs.length > 0 ? verb.verbs.join(', ') : t('globalCommandsEditor.noVerbs', '(sem verbos)')}
                                                </p>
                                                <p className={`text-[10px] text-left truncate mt-0.5 ${selectedVerbId === verb.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                                    {verb.description || t('globalCommandsEditor.noDescription', '(sem descrição)')}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(verb.id);
                                            }}
                                            className={`absolute top-0 right-0 h-full w-12 flex items-center justify-center text-white transform translate-x-full group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20 cursor-pointer ${
                                                selectedVerbId === verb.id
                                                    ? 'bg-red-500 rounded-none' // flush with right edge
                                                    : 'bg-red-500 rounded-r-lg' // match the rounded-lg of container
                                            }`}
                                            title={t('globalCommandsEditor.deleteCommandTooltip', 'Excluir comando')}
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
                            onClick={handleCreate}
                            className="w-full flex items-center justify-start px-2 h-[42px] font-bold rounded-lg transition-all active:scale-95 text-xs bg-white text-zinc-950 hover:bg-zinc-200 mt-2 flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('globalCommandsEditor.createCommandBtn', 'Criar Verbo')}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN PANEL */}
            <div className="flex-1 overflow-y-auto relative bg-background p-6 space-y-6">
                {/* Header with Save/Undo actions */}
                <div className="sticky top-0 z-40 backdrop-blur-md bg-background/95 flex justify-between items-center p-4 rounded-xl border border-muted-foreground/50 shadow-sm">
                    <div className="text-muted-foreground text-xs font-medium space-y-1">
                        <p>{t('globalCommandsEditor.headerDesc1', 'Configure os verbos que estarão sempre disponíveis para o jogador (ex: ajuda, tutorial).')}</p>
                        <p>
                            <Trans i18nKey="globalCommandsEditor.headerDesc2">
                                Os verbos <strong>&quot;olhar&quot;, &quot;examinar&quot;, &quot;ver&quot;</strong> e <strong>&quot;ler&quot;</strong> sempre estarão disponíveis para o usuário acionar a descrição de um objeto.
                            </Trans>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 pl-4">
                        {isDirty && (
                            <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mr-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
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

                <div className="pt-6 pb-8 w-full">
                    {selectedVerb ? (
                        <div className="space-y-6">
                            <div className="bg-card border border-muted-foreground/50 rounded-xl p-6">
                                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide mb-6">
                                    <MessageSquare className="w-4 h-4" />
                                    {t('globalCommandsEditor.editCommandTitle', 'Propriedades do Verbo')}
                                </h3>
                                <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        {t('globalCommandsEditor.verbsLabel', 'Verbos (separados por vírgula)')}
                                    </label>
                                    <div className="flex gap-2">
                                        {/* Icon Picker */}
                                        <div className="relative group shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsIconPickerOpen(!isIconPickerOpen);
                                                }}
                                                className="w-10 h-10 flex items-center justify-center bg-input border border-input rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                                                title={t('globalCommandsEditor.chooseIconTooltip', 'Escolher ícone')}
                                            >
                                                {(() => {
                                                    const Icon = COMMAND_ICONS.find(i => i.name === selectedVerb.icon)?.component || MessageSquare;
                                                    return <Icon className="w-5 h-5" />;
                                                })()}
                                            </button>
                                            {isIconPickerOpen && (
                                                <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-popover border border-muted-foreground/50 rounded-lg shadow-xl z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                    {COMMAND_ICONS.map(icon => (
                                                        <button
                                                            key={icon.name}
                                                            onClick={() => { handleVerbChange(selectedVerb.id, 'icon', icon.name); setIsIconPickerOpen(false); }}
                                                            className={`p-2 rounded hover:bg-accent flex items-center justify-center transition-colors ${selectedVerb.icon === icon.name ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
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
                                            value={selectedVerb.verbs.join(', ')}
                                            onChange={(e) => {
                                                const cleanedVerbs = e.target.value.split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
                                                handleVerbChange(selectedVerb.id, 'verbs', cleanedVerbs);
                                            }}
                                            placeholder={t('globalCommandsEditor.verbsPlaceholder', 'ex: ajuda, help, ?')}
                                            className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        {t('globalCommandsEditor.verbsDesc', 'Palavras que ativam este verbo. Ex: "ajuda" ou "help".')}
                                    </p>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        {t('globalCommandsEditor.descriptionLabel', 'Descrição / Resposta')}
                                    </label>
                                    <textarea
                                        value={selectedVerb.description}
                                        onChange={(e) => handleVerbChange(selectedVerb.id, 'description', e.target.value)}
                                        placeholder={t('globalCommandsEditor.descriptionPlaceholder', 'Texto que será exibido para o jogador quando usar este verbo.')}
                                        rows={8}
                                        className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                                    />
                                </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center mt-20">
                            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                            <h4 className="text-sm font-bold text-muted-foreground mb-1">{t('globalCommandsEditor.noCommandSelected', 'Selecione um verbo para editar')}</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalCommandsEditor;
