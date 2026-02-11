import React, { useState, DragEvent, useMemo, useEffect } from 'react';
import { GameObject } from '../types';
import { Plus, Trash2, Upload, Search, Link as LinkIcon, Unlink, Box, Activity, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon } from 'lucide-react';

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

interface ObjectEditorProps {
    sceneId: string;
    objects: GameObject[]; // The objects currently linked to this scene
    allGlobalObjects: GameObject[]; // All available objects
    onCreateGlobalObject: (obj: GameObject, linkToSceneId: string) => void;
    onLinkObject: (sceneId: string, objectId: string) => void;
    onUnlinkObject: (sceneId: string, objectId: string) => void;
    onUpdateGlobalObject: (objectId: string, updatedData: Partial<GameObject>) => void;
}

const generateUniqueId = (prefix: 'obj', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`;
    } while (existingIds.includes(id));
    return id;
};

const ObjectEditor: React.FC<ObjectEditorProps> = ({
    sceneId,
    objects,
    allGlobalObjects,
    onCreateGlobalObject,
    onLinkObject,
    onUnlinkObject,
    onUpdateGlobalObject
}) => {
    const [selectedObjectId, setSelectedObjectId] = useState<string | null>(objects.length > 0 ? objects[0].id : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLinkMode, setIsLinkMode] = useState(false); // Toggle between "My Objects" and "Link Existing"
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    useEffect(() => {
        setIsIconPickerOpen(false);
    }, [selectedObjectId]);

    const handleCreateNewObject = () => {
        const allIds = allGlobalObjects.map(o => o.id);
        const newObject: GameObject = {
            id: generateUniqueId('obj', allIds),
            name: 'Novo Objeto',
            examineDescription: 'Descrição do novo objeto.',
        };
        onCreateGlobalObject(newObject, sceneId);
        setSelectedObjectId(newObject.id);
        setIsLinkMode(false);
    };

    const handleLinkExistingObject = (objectId: string) => {
        onLinkObject(sceneId, objectId);
        setSelectedObjectId(objectId);
        setIsLinkMode(false);
    };

    // Filtered lists
    const filteredSceneObjects = useMemo(() => {
        return objects.filter(obj =>
            obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obj.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [objects, searchTerm]);

    const availableObjectsToLink = useMemo(() => {
        return allGlobalObjects.filter(gObj =>
            !objects.some(linked => linked.id === gObj.id) &&
            (gObj.name.toLowerCase().includes(searchTerm.toLowerCase()) || gObj.id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [allGlobalObjects, objects, searchTerm]);

    const selectedObject = useMemo(() =>
        objects.find(o => o.id === selectedObjectId) || allGlobalObjects.find(o => o.id === selectedObjectId),
        [objects, allGlobalObjects, selectedObjectId]);

    // Check if selected object is actually linked to current scene
    const isSelectedObjectLinked = useMemo(() =>
        selectedObjectId && objects.some(o => o.id === selectedObjectId),
        [objects, selectedObjectId]);


    // Image Upload Logic for Selected Object
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && selectedObjectId) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    onUpdateGlobalObject(selectedObjectId, { image: event.target.result });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="flex h-[600px] border border-border rounded-xl overflow-hidden bg-card shadow-sm" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* LEFT SIDEBAR */}
            <div className="w-1/3 min-w-[250px] border-r border-border flex flex-col bg-muted/10">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-border space-y-4">
                    <div className="flex bg-muted rounded-lg p-1 border border-border">
                        <button
                            onClick={() => setIsLinkMode(false)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${!isLinkMode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Nesta Cena ({objects.length})
                        </button>
                        <button
                            onClick={() => setIsLinkMode(true)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${isLinkMode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Vincular ({availableObjectsToLink.length})
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar objetos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-input border border-input rounded-lg pl-8 pr-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                {/* Object List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {!isLinkMode ? (
                        /* CURRENT SCENE OBJECTS */
                        filteredSceneObjects.length > 0 ? (
                            filteredSceneObjects.map(obj => {
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
                                        <div className="min-w-0">
                                            <div className={`text-xs font-bold truncate ${selectedObjectId === obj.id ? 'text-primary' : 'text-foreground'}`}>{obj.name}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono truncate">#{obj.id}</div>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-xs italic">Nenhum objeto encontrado.</p>
                            </div>
                        )
                    ) : (
                        /* AVAILABLE TO LINK OBJECTS */
                        availableObjectsToLink.length > 0 ? (
                            availableObjectsToLink.map(obj => {
                                const IconComponent = TRACKER_ICONS.find(i => i.name === obj.icon)?.component || Box;
                                return (
                                    <div
                                        key={obj.id}
                                        className="w-full flex items-center justify-between gap-2 p-2 rounded-lg border border-dashed border-border hover:bg-accent transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-3 min-w-0" onClick={() => setSelectedObjectId(obj.id)}>
                                            <div className="w-8 h-8 rounded bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 opacity-50">
                                                {obj.image ? (
                                                    <img src={obj.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <IconComponent className="w-3 h-3 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-medium text-muted-foreground truncate">{obj.name}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleLinkExistingObject(obj.id)}
                                            className="p-1.5 bg-primary/10 text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                                            title="Vincular à cena"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-xs italic">Todos os objetos já estão vinculados ou nenhum encontrado.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer Actions */}
                {!isLinkMode && (
                    <div className="p-3 border-t border-border bg-muted/30">
                        <button
                            onClick={handleCreateNewObject}
                            className="w-full py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg text-xs flex items-center justify-center transition-colors shadow-none"
                        >
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            Criar Novo Objeto
                        </button>
                    </div>
                )}
            </div>

            {/* RIGHT MAIN PANEL */}
            <div className="flex-1 flex flex-col bg-muted/5 min-w-0">
                {selectedObject ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                            <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Propriedades do Objeto</span>
                            </div>

                            {/* Context Actions */}
                            <div className="flex items-center gap-2">
                                {isSelectedObjectLinked ? (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Tem certeza? Isso removerá o objeto desta cena, mas ele ainda existirá no projeto.')) {
                                                onUnlinkObject(sceneId, selectedObject.id);
                                                setSelectedObjectId(null);
                                            }
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-md text-[10px] font-bold uppercase transition-all"
                                    >
                                        <Unlink className="w-3.5 h-3.5" />
                                        Desvincular
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleLinkExistingObject(selectedObject.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-[10px] font-bold uppercase transition-all shadow-sm"
                                    >
                                        <LinkIcon className="w-3.5 h-3.5" />
                                        Vincular Agora
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-2xl mx-auto space-y-10">
                                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                                    {/* Basic Info */}
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
                                                                onClick={() => { onUpdateGlobalObject(selectedObject.id, { icon: icon.name }); setIsIconPickerOpen(false); }}
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
                                                onChange={(e) => onUpdateGlobalObject(selectedObject.id, { name: e.target.value })}
                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>                                    <div className="col-span-1 space-y-1.5">
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
                                            rows={6}
                                            value={selectedObject.examineDescription}
                                            onChange={(e) => onUpdateGlobalObject(selectedObject.id, { examineDescription: e.target.value })}
                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary resize-none flex-1 min-h-[150px]"
                                            placeholder="O que o jogador vê ao examinar este objeto?"
                                        />
                                    </div>

                                    {/* Image Preview & Upload */}
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
                                                        <button onClick={() => onUpdateGlobalObject(selectedObject.id, { image: '' })} className="p-2 bg-red-500/20 rounded-full cursor-pointer hover:bg-red-500/40 text-red-500 transition-all">
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
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground text-center mt-6 italic">Objetos aparecem no inventário ou na lista de &apos;coisas aqui&apos;.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <Box className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-sm font-bold text-muted-foreground mb-1">Nenhum objeto selecionado</h4>
                        <p className="text-xs max-w-xs opacity-60">Selecione um objeto da lista ao lado para editar suas propriedades ou vincule um novo objeto à cena.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObjectEditor;
