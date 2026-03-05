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
        const newId = generateUniqueId('verb', existingIds);
        const newVerb: FixedVerb = {
            id: newId,
            verbs: [],
            description: '',
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
        <div className="flex flex-col h-full space-y-6" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* Header with Save/Undo actions */}
            <div className="sticky top-0 z-40 backdrop-blur-md bg-background/95 flex justify-between items-center p-4 rounded-xl border border-border">
                <div className="text-muted-foreground text-xs font-medium w-full space-y-1">
                    <p>{t('globalCommandsEditor.headerDesc1', 'Configure verbos e comandos que estarão sempre disponíveis para o jogador (ex: ajuda, tutorial).')}</p>
                    <p>
                        <Trans i18nKey="globalCommandsEditor.headerDesc2">
                            Os verbos <strong>&quot;olhar&quot;, &quot;examinar&quot;, &quot;ver&quot;</strong> e <strong>&quot;ler&quot;</strong> sempre estarão disponíveis para o usuário acionar a descrição de um objeto.
                        </Trans>
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {isDirty && (
                        <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mr-2">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                            {t('globalObjectsEditor.unsavedChanges', 'Alterações não salvas')}
                        </div>
                    )}
                    <button
                        onClick={handleUndo}
                        disabled={!isDirty}
                        className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
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

            <div className="flex flex-1 min-h-0 border border-muted-foreground/20 rounded-xl overflow-hidden bg-card shadow-sm">
                {/* LEFT SIDEBAR - Command List */}
                <div className="w-1/3 min-w-[250px] border-r border-border flex flex-col bg-muted/30">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-muted-foreground/10 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={t('globalCommandsEditor.searchPlaceholder', 'Buscar comandos...')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-input border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground"
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1">
                            <span>{t('globalCommandsEditor.commandList', 'Lista de Comandos')}</span>
                            <span>{filteredVerbs.length}</span>
                        </div>
                    </div>

                    {/* Command List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredVerbs.length > 0 && (
                            filteredVerbs.map(verb => {
                                const IconComponent = COMMAND_ICONS.find(i => i.name === verb.icon)?.component || MessageSquare;
                                return (
                                    <button
                                        key={verb.id}
                                        onClick={() => setSelectedVerbId(verb.id)}
                                        className={`relative w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left group ${selectedVerbId === verb.id ? 'bg-primary/10 border-primary/40' : 'bg-transparent border-transparent hover:bg-muted hover:border-border'}`}
                                    >
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${selectedVerbId === verb.id ? 'bg-primary/20 text-primary' : 'bg-card border border-border text-muted-foreground'}`}>
                                            <IconComponent className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold truncate ${selectedVerbId === verb.id ? 'text-primary' : 'text-foreground'}`}>
                                                {verb.verbs.length > 0 ? verb.verbs.join(', ') : t('globalCommandsEditor.noVerbs', '(sem verbos)')}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                                {verb.description || t('globalCommandsEditor.noDescription', '(sem descrição)')}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                        <button
                            onClick={handleCreate}
                            className="w-full py-2.5 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm transform hover:-translate-y-0.5 mt-2"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            {t('globalCommandsEditor.newCommand', 'Novo Comando')}
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL - Command Editor */}
                <div className="flex-1 flex flex-col bg-background/50 min-w-0">
                    {selectedVerb ? (
                        <>
                            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50 shrink-0">
                                <h3 className="text-sm font-bold text-foreground">{t('globalCommandsEditor.editCommandTitle', 'Editar Comando')}</h3>
                                <button
                                    onClick={() => handleDelete(selectedVerb.id)}
                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
                                    title={t('globalCommandsEditor.deleteCommandTooltip', 'Excluir comando')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                                                <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-popover border border-border rounded-lg shadow-xl z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
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
                                            className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary/30 transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        {t('globalCommandsEditor.verbsDesc', 'Palavras que ativam este comando. Ex: "ajuda" ou "help".')}
                                    </p>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        {t('globalCommandsEditor.descriptionLabel', 'Descrição / Resposta')}
                                    </label>
                                    <textarea
                                        value={selectedVerb.description}
                                        onChange={(e) => handleVerbChange(selectedVerb.id, 'description', e.target.value)}
                                        placeholder={t('globalCommandsEditor.descriptionPlaceholder', 'Texto que será exibido para o jogador quando usar este comando.')}
                                        rows={8}
                                        className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center mb-4">
                                <Command className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm text-foreground font-medium">{t('globalCommandsEditor.noCommandSelected', 'Selecione um comando para editar')}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{t('globalCommandsEditor.emptyDesc', 'Adicione comandos como &quot;olhar&quot;, &quot;pegar&quot; ou &quot;inventário&quot; e o texto que será respondido ao jogador.')}</p>
                            <button
                                onClick={handleCreate}
                                className="mt-4 px-4 py-2 bg-white text-zinc-950 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-all"
                            >
                                <Plus className="w-4 h-4 inline-block mr-1" />
                                {t('globalCommandsEditor.createCommandBtn', 'Criar Comando')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalCommandsEditor;
