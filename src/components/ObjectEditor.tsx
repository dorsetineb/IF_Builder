import React, { useState, DragEvent, useMemo } from 'react';
import { GameObject } from '../types';
import { Plus, Trash2, Upload, Search, Package, Link as LinkIcon, Unlink, Box } from 'lucide-react';

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
        <div className="flex h-[600px] border border-muted-foreground/20 rounded-xl overflow-hidden bg-card shadow-sm">
            {/* LEFT SIDEBAR */}
            <div className="w-1/3 min-w-[250px] border-r border-muted-foreground/20 flex flex-col bg-zinc-950/30">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-muted-foreground/10 space-y-4">
                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <button
                            onClick={() => setIsLinkMode(false)}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${!isLinkMode ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Nesta Cena ({objects.length})
                        </button>
                        <button
                            onClick={() => setIsLinkMode(true)}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${isLinkMode ? 'bg-purple-900/40 text-purple-300 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
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
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* Object List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {!isLinkMode ? (
                        /* CURRENT SCENE OBJECTS */
                        filteredSceneObjects.length > 0 ? (
                            filteredSceneObjects.map(obj => (
                                <button
                                    key={obj.id}
                                    onClick={() => setSelectedObjectId(obj.id)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all text-left ${selectedObjectId === obj.id ? 'bg-purple-500/10 border-purple-500/40' : 'bg-transparent border-transparent hover:bg-zinc-900 hover:border-zinc-800'}`}
                                >
                                    <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                                        {obj.image ? (
                                            <img src={obj.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Box className="w-4 h-4 text-zinc-600" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`text-xs font-bold truncate ${selectedObjectId === obj.id ? 'text-purple-300' : 'text-zinc-300'}`}>{obj.name}</div>
                                        <div className="text-[10px] text-zinc-500 font-mono truncate">#{obj.id}</div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-xs italic">Nenhum objeto encontrado.</p>
                            </div>
                        )
                    ) : (
                        /* AVAILABLE TO LINK OBJECTS */
                        availableObjectsToLink.length > 0 ? (
                            availableObjectsToLink.map(obj => (
                                <div
                                    key={obj.id}
                                    className="w-full flex items-center justify-between gap-2 p-2 rounded-lg border border-dashed border-zinc-800 hover:bg-zinc-900 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3 min-w-0" onClick={() => setSelectedObjectId(obj.id)}>
                                        <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 opacity-50">
                                            {obj.image ? <img src={obj.image} alt="" className="w-full h-full object-cover" /> : <Box className="w-3 h-3 text-zinc-600" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-medium text-zinc-400 truncate">{obj.name}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleLinkExistingObject(obj.id)}
                                        className="p-1.5 bg-purple-900/30 text-purple-400 rounded hover:bg-purple-600 hover:text-white transition-colors"
                                        title="Vincular à cena"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-xs italic">Todos os objetos já estão vinculados ou nenhum encontrado.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer Actions */}
                {!isLinkMode && (
                    <div className="p-3 border-t border-muted-foreground/10 bg-zinc-900/50">
                        <button
                            onClick={handleCreateNewObject}
                            className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-lg text-xs flex items-center justify-center transition-colors shadow"
                        >
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            Criar Novo Objeto
                        </button>
                    </div>
                )}
            </div>

            {/* RIGHT MAIN PANEL */}
            <div className="flex-1 flex flex-col bg-zinc-950/10 min-w-0">
                {selectedObject ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-muted-foreground/10 flex justify-between items-center bg-zinc-900/30">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-purple-500" />
                                    {selectedObject.name}
                                </h3>
                                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {selectedObject.id}</p>
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
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white hover:bg-purple-700 rounded-md text-[10px] font-bold uppercase transition-all shadow-lg shadow-purple-900/20"
                                    >
                                        <LinkIcon className="w-3.5 h-3.5" />
                                        Vincular Agora
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-xl mx-auto space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Nome do Objeto</label>
                                        <input
                                            type="text"
                                            value={selectedObject.name}
                                            onChange={(e) => onUpdateGlobalObject(selectedObject.id, { name: e.target.value })}
                                            className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500/50"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Descrição (Examinar)</label>
                                        <textarea
                                            rows={4}
                                            value={selectedObject.examineDescription}
                                            onChange={(e) => onUpdateGlobalObject(selectedObject.id, { examineDescription: e.target.value })}
                                            className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/50 resize-y"
                                            placeholder="O que o jogador vê ao examinar este objeto?"
                                        />
                                    </div>
                                </div>

                                {/* Image Preview & Upload */}
                                <div>
                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Imagem de Referência</label>
                                    <div className="relative w-full aspect-square max-w-[200px] mx-auto bg-zinc-950 rounded-lg overflow-hidden border border-muted-foreground/30 group">
                                        {selectedObject.image ? (
                                            <>
                                                <img src={selectedObject.image} alt={selectedObject.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-2">
                                                    <label className="p-2 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 text-white transition-all">
                                                        <Upload className="w-4 h-4" />
                                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                    </label>
                                                    <button onClick={() => onUpdateGlobalObject(selectedObject.id, { image: '' })} className="p-2 bg-red-500/20 rounded-full cursor-pointer hover:bg-red-500/40 text-red-400 transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900 transition-colors">
                                                <Upload className="w-6 h-6 text-zinc-700 mb-2" />
                                                <span className="text-[10px] text-zinc-600">Carregar</span>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-600 text-center mt-2 italic">Objetos aparecem no inventário ou na lista de 'coisas aqui'.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <Box className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-sm font-bold text-zinc-400 mb-1">Nenhum objeto selecionado</h4>
                        <p className="text-xs max-w-xs opacity-60">Selecione um objeto da lista ao lado para editar suas propriedades ou vincule um novo objeto à cena.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObjectEditor;
