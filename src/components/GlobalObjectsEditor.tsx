import React, { useState, useEffect, useMemo } from 'react';
import { GameData, GameObject, Scene } from '../types';
import { Plus, Trash2, Upload, Search, Box, Unlink, Activity, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon } from 'lucide-react';

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

interface GlobalObjectsEditorProps {
    scenes: GameData['scenes'];
    globalObjects: { [id: string]: GameObject };
    onUpdateObject: (objectId: string, updatedData: Partial<GameObject>) => void;
    onDeleteObject: (objectId: string) => void;
    onCreateObject: (obj: GameObject) => void;
    onSelectScene: (sceneId: string) => void;
    isDirty: boolean;
    onSetDirty: (isDirty: boolean) => void;
}

const generateUniqueId = (prefix: 'obj', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`;
    } while (existingIds.includes(id));
    return id;
};

const GlobalObjectsEditor: React.FC<GlobalObjectsEditorProps> = ({
    scenes,
    globalObjects,
    onUpdateObject,
    onDeleteObject,
    onCreateObject,
    onSelectScene,
    isDirty,
    onSetDirty,
}) => {
    const sortedObjects = useMemo(() => {
        return Object.values(globalObjects).sort((a: GameObject, b: GameObject) => a.name.localeCompare(b.name));
    }, [globalObjects]);

    const [localObjects, setLocalObjects] = useState<GameObject[]>(sortedObjects);
    const [selectedObjectId, setSelectedObjectId] = useState<string | null>(sortedObjects.length > 0 ? sortedObjects[0].id : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    useEffect(() => {
        // Deep compare to avoid unnecessary updates and infinite loops
        const areObjectsDifferent = JSON.stringify(localObjects) !== JSON.stringify(sortedObjects);

        if (areObjectsDifferent) {
            setLocalObjects(sortedObjects);

            // If selected object was deleted or doesn't exist, select first or null
            if (selectedObjectId && !sortedObjects.find(o => o.id === selectedObjectId)) {
                setSelectedObjectId(sortedObjects.length > 0 ? sortedObjects[0].id : null);
            } else if (!selectedObjectId && sortedObjects.length > 0) {
                setSelectedObjectId(sortedObjects[0].id);
            }
        }
    }, [sortedObjects]); // localObjects dependency removed to avoid cyclic dependency in effect logic, though strictly it's used in comparison

    useEffect(() => {
        setIsIconPickerOpen(false);
    }, [selectedObjectId]);

    // Comparison for dirty state
    useEffect(() => {
        const isDifferent = JSON.stringify(localObjects) !== JSON.stringify(sortedObjects);
        onSetDirty(isDifferent);
    }, [localObjects, sortedObjects, onSetDirty]);

    const handleObjectChange = (objectId: string, field: keyof GameObject, value: any) => {
        setLocalObjects(prev =>
            prev.map(obj =>
                obj.id === objectId ? { ...obj, [field]: value } : obj
            )
        );
    };

    const handleSave = () => {
        localObjects.forEach(localObj => {
            const originalObj = globalObjects[localObj.id];
            // Update if changed or if it's new (not in original)
            if (!originalObj || JSON.stringify(localObj) !== JSON.stringify(originalObj)) {
                onUpdateObject(localObj.id, {
                    name: localObj.name,
                    examineDescription: localObj.examineDescription,
                    image: localObj.image,
                    icon: localObj.icon,
                });
            }
        });
    };

    const handleUndo = () => {
        setLocalObjects(sortedObjects);
    };

    const handleCreate = () => {
        const allIds = Object.keys(globalObjects);
        const allLocalIds = localObjects.map(o => o.id);
        const combinedIds = Array.from(new Set([...allIds, ...allLocalIds]));

        const newId = generateUniqueId('obj', combinedIds);
        const newObject: GameObject = {
            id: newId,
            name: 'Novo Objeto',
            examineDescription: 'Descrição do novo objeto.',
        };

        onCreateObject(newObject);
        setSelectedObjectId(newId);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza? Isso excluirá o objeto de todo o jogo.')) {
            onDeleteObject(id);
            if (selectedObjectId === id) {
                setSelectedObjectId(null);
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && selectedObjectId) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    handleObjectChange(selectedObjectId, 'image', event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const filteredObjects = useMemo(() => {
        return localObjects.filter(obj =>
            obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obj.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [localObjects, searchTerm]);

    const selectedObject = useMemo(() =>
        localObjects.find(o => o.id === selectedObjectId),
        [localObjects, selectedObjectId]);

    const usages = useMemo(() => {
        if (!selectedObject) return [];
        const result: { id: string, name: string }[] = [];
        Object.values(scenes).forEach((scene: Scene) => {
            if (scene.objectIds && scene.objectIds.includes(selectedObject.id)) {
                result.push({ id: scene.id, name: scene.name });
            }
        });
        return result;
    }, [scenes, selectedObject]);

    return (
        <div className="space-y-6 pb-8" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* Header with Save/Undo actions */}
            <div className="sticky top-0 z-40 flex justify-between items-center bg-background/95 backdrop-blur-md p-4 rounded-xl border border-border">
                <p className="text-muted-foreground text-xs font-medium max-w-lg">
                    Gerenciador Global: Objetos criados aqui podem ser usados em qualquer cena.
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
                        className="px-4 py-1.5 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>

            <div className="flex h-[600px] border border-border rounded-xl overflow-hidden bg-card">
                {/* LEFT SIDEBAR */}
                <div className="w-1/3 min-w-[250px] border-r border-border flex flex-col bg-muted/10">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-border space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar objetos globais..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-input border border-input rounded-lg pl-8 pr-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1">
                            <span>Lista de Objetos</span>
                            <span>{filteredObjects.length}</span>
                        </div>
                    </div>

                    {/* Object List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredObjects.length > 0 ? (
                            filteredObjects.map(obj => {
                                const IconComponent = TRACKER_ICONS.find(i => i.name === obj.icon)?.component || Box;
                                return (
                                    <button
                                        key={obj.id}
                                        onClick={() => setSelectedObjectId(obj.id)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all text-left ${selectedObjectId === obj.id ? 'bg-primary/10 border-primary/40' : 'bg-transparent border-transparent hover:bg-accent hover:border-accent'}`}
                                    >
                                        <div className="w-10 h-10 rounded bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                                            {obj.image ? (
                                                <img src={obj.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <IconComponent className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className={`text-xs font-bold truncate ${selectedObjectId === obj.id ? 'text-primary' : 'text-foreground'}`}>{obj.name}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono truncate">#{obj.id}</div>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Box className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-xs italic">Nenhum objeto encontrado.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 border-t border-border bg-muted/30">
                        <button
                            onClick={handleCreate}
                            className="w-full py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg text-xs flex items-center justify-center transition-colors shadow-none"
                        >
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            Criar Novo Objeto
                        </button>
                    </div>
                </div>

                {/* RIGHT MAIN PANEL */}
                <div className="flex-1 flex flex-col bg-muted/5 min-w-0">
                    {selectedObject ? (
                        <div className="flex flex-col h-full">
                            {/* Header - Minimalist */}
                            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <Box className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Propriedades do Objeto</span>
                                </div>

                                {/* Context Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDelete(selectedObject.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-md text-[10px] font-bold uppercase transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Excluir Objeto
                                    </button>
                                </div>
                            </div>

                            {/* Edit Form */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="max-w-4xl mx-auto space-y-10">
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                                        {/* Name field */}
                                        <div className="col-span-2 space-y-1.5">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nome do Objeto</label>
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
                                                            const Icon = TRACKER_ICONS.find(i => i.name === selectedObject.icon)?.component || Box;
                                                            return <Icon className="w-5 h-5" />;
                                                        })()}
                                                    </button>
                                                    {isIconPickerOpen && (
                                                        <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-card border border-border rounded-lg shadow-xl z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                            {TRACKER_ICONS.map(icon => (
                                                                <button
                                                                    key={icon.name}
                                                                    onClick={() => { handleObjectChange(selectedObject.id, 'icon', icon.name); setIsIconPickerOpen(false); }}
                                                                    className={`p-2 rounded hover:bg-accent flex items-center justify-center transition-colors ${selectedObject.icon === icon.name ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
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
                                                    value={selectedObject.name}
                                                    onChange={(e) => handleObjectChange(selectedObject.id, 'name', e.target.value)}
                                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                        </div>

                                        {/* ID field */}
                                        <div className="col-span-1 space-y-1.5">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID Único</label>
                                            <input
                                                type="text"
                                                value={selectedObject.id}
                                                readOnly
                                                className="w-full bg-muted/50 border border-input rounded-lg px-3 py-2 text-xs text-muted-foreground font-mono cursor-not-allowed h-[38px]"
                                                title="O ID é gerado automaticamente e não pode ser alterado."
                                            />
                                        </div>

                                        {/* Description field */}
                                        <div className="col-span-2 space-y-1.5 flex flex-col">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Descrição ao Examinar</label>
                                            <textarea
                                                rows={10}
                                                value={selectedObject.examineDescription}
                                                onChange={(e) => handleObjectChange(selectedObject.id, 'examineDescription', e.target.value)}
                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary resize-none flex-1 min-h-[250px]"
                                                placeholder="O que o jogador vê ao examinar este objeto?"
                                            />
                                        </div>

                                        {/* Image field */}
                                        <div className="col-span-1 space-y-1.5">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Imagem do Objeto</label>
                                            <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden border border-input group">
                                                {selectedObject.image ? (
                                                    <>
                                                        <img src={selectedObject.image} alt={selectedObject.name} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-2">
                                                            <label className="p-2 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 text-white transition-all">
                                                                <Upload className="w-4 h-4" />
                                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                            </label>
                                                            <button
                                                                onClick={() => handleObjectChange(selectedObject.id, 'image', '')}
                                                                className="p-2 bg-red-500/20 rounded-full cursor-pointer hover:bg-red-500/40 text-red-500 transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors">
                                                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Carregar</span>
                                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                    </label>
                                                )}
                                            </div>
                                            <p className="text-[9px] text-muted-foreground italic leading-tight">Esta imagem aparece no pop-up de detalhes do objeto durante o jogo.</p>
                                        </div>
                                    </div>


                                    {/* Usage Info */}
                                    <div className="pt-4 border-t border-border">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Usado nas cenas</label>
                                        <div className="flex flex-wrap gap-2">
                                            {usages.length > 0 ? (
                                                usages.map(u => (
                                                    <button
                                                        key={u.id}
                                                        onClick={() => onSelectScene(u.id)}
                                                        className="px-3 py-1.5 bg-input border border-input rounded-md text-[10px] text-muted-foreground font-bold uppercase hover:bg-accent hover:text-primary hover:border-primary/30 transition-all flex items-center gap-1.5"
                                                    >
                                                        <Unlink className="w-3 h-3 opacity-50" /> {/* Just an icon for visual context */}
                                                        {u.name}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-[10px] text-muted-foreground italic">Este objeto ainda não foi adicionado a nenhuma cena.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                            <Box className="w-12 h-12 mb-4 opacity-20" />
                            <h4 className="text-sm font-bold text-muted-foreground mb-1">Nenhum objeto selecionado</h4>
                            <p className="text-xs max-w-xs opacity-60">Selecione um objeto da lista ao lado para editar suas propriedades globais.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalObjectsEditor;
