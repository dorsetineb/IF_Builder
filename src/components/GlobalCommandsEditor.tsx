import React, { useState, useEffect, useMemo } from 'react';
import { FixedVerb } from '../types';
import { Plus, Trash2, Search, Command, MessageSquare } from 'lucide-react';

interface GlobalCommandsEditorProps {
    fixedVerbs: FixedVerb[];
    onUpdate: (field: string, value: any, skipDirty?: boolean) => void;
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

    // Sync from props
    useEffect(() => {
        setLocalVerbs(fixedVerbs);
        if (selectedVerbId && !fixedVerbs.find(v => v.id === selectedVerbId)) {
            setSelectedVerbId(fixedVerbs.length > 0 ? fixedVerbs[0].id : null);
        } else if (!selectedVerbId && fixedVerbs.length > 0) {
            setSelectedVerbId(fixedVerbs[0].id);
        }
    }, [fixedVerbs]);

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
            description: ''
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
        <div className="space-y-4">
            {/* Header with Save/Undo actions */}
            <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-muted-foreground/10">
                <p className="text-zinc-500 text-xs font-medium max-w-lg">
                    Configure verbos e comandos que estarão sempre disponíveis para o jogador (ex: ajuda, tutorial).
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
                        className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                    >
                        Desfazer
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="px-4 py-1.5 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed shadow-lg shadow-yellow-900/10"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>

            <div className="flex h-[550px] border border-muted-foreground/20 rounded-xl overflow-hidden bg-card shadow-sm">
                {/* LEFT SIDEBAR - Command List */}
                <div className="w-1/3 min-w-[250px] border-r border-muted-foreground/20 flex flex-col bg-zinc-950/30">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-muted-foreground/10 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar comandos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 placeholder:text-zinc-600"
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-1">
                            <span>Lista de Comandos</span>
                            <span>{filteredVerbs.length}</span>
                        </div>
                    </div>

                    {/* Command List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredVerbs.length > 0 ? (
                            filteredVerbs.map(verb => (
                                <button
                                    key={verb.id}
                                    onClick={() => setSelectedVerbId(verb.id)}
                                    className={`relative w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left group ${selectedVerbId === verb.id ? 'bg-primary/10 border-primary/40' : 'bg-transparent border-transparent hover:bg-zinc-900 hover:border-zinc-800'}`}
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${selectedVerbId === verb.id ? 'bg-primary/20 text-primary' : 'bg-zinc-900 text-zinc-500'}`}>
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-bold truncate ${selectedVerbId === verb.id ? 'text-primary' : 'text-zinc-300'}`}>
                                            {verb.verbs.length > 0 ? verb.verbs.join(', ') : '(sem verbos)'}
                                        </p>
                                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                                            {verb.description || '(sem descrição)'}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                <Command className="w-8 h-8 text-zinc-700 mb-2" />
                                <p className="text-xs text-zinc-600">Nenhum comando encontrado</p>
                                <p className="text-[10px] text-zinc-700 mt-1">Clique em "Novo Comando" para criar</p>
                            </div>
                        )}
                    </div>

                    {/* Add button */}
                    <div className="p-3 border-t border-muted-foreground/10">
                        <button
                            onClick={handleCreate}
                            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4" />
                            Novo Comando
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL - Command Editor */}
                <div className="flex-1 flex flex-col bg-background/50">
                    {selectedVerb ? (
                        <>
                            <div className="p-4 border-b border-muted-foreground/10 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-foreground">Editar Comando</h3>
                                <button
                                    onClick={() => handleDelete(selectedVerb.id)}
                                    className="p-2 text-muted-foreground hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                                    title="Excluir comando"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        Verbos (separados por vírgula)
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedVerb.verbs.join(', ')}
                                        onChange={(e) => {
                                            const cleanedVerbs = e.target.value.split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
                                            handleVerbChange(selectedVerb.id, 'verbs', cleanedVerbs);
                                        }}
                                        placeholder="ex: ajuda, help, ?"
                                        className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary/30 transition-all"
                                    />
                                    <p className="text-[10px] text-muted-foreground">
                                        Palavras que ativam este comando. Ex: "ajuda" ou "help".
                                    </p>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        Descrição / Resposta
                                    </label>
                                    <textarea
                                        value={selectedVerb.description}
                                        onChange={(e) => handleVerbChange(selectedVerb.id, 'description', e.target.value)}
                                        placeholder="Texto que será exibido para o jogador quando usar este comando."
                                        rows={8}
                                        className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
                                <Command className="w-8 h-8 text-zinc-700" />
                            </div>
                            <p className="text-sm text-zinc-500 font-medium">Selecione um comando para editar</p>
                            <p className="text-xs text-zinc-600 mt-1">ou crie um novo clicando no botão abaixo</p>
                            <button
                                onClick={handleCreate}
                                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-all"
                            >
                                <Plus className="w-4 h-4 inline-block mr-1" />
                                Criar Comando
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalCommandsEditor;
