
import React, { useState, DragEvent } from 'react';
import { GameObject } from '../types';
import { Plus, Trash2, Upload } from 'lucide-react';

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

// Sub-component for individual Scene Object Item to handle Drag state properly
const SceneObjectItem: React.FC<{
    obj: GameObject;
    sceneId: string;
    onUnlinkObject: (sceneId: string, objectId: string) => void;
    onUpdateGlobalObject: (objectId: string, updatedData: Partial<GameObject>) => void;
}> = ({ obj, sceneId, onUnlinkObject, onUpdateGlobalObject }) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    onUpdateGlobalObject(obj.id, { image: event.target.result });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        if (e.target) {
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const event = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleImageUpload(event);
        }
    };

    return (
        <div className="relative pt-6 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
            <button
                onClick={() => onUnlinkObject(sceneId, obj.id)}
                className="absolute top-0 right-0 p-2 bg-zinc-800 text-zinc-500 rounded-bl-lg hover:bg-red-500/80 hover:text-white transition-all"
                title="Desvincular objeto desta cena (não apaga do jogo)"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Editable fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 px-1">Nome do Objeto</label>
                        <input
                            type="text"
                            value={obj.name}
                            onChange={(e) => onUpdateGlobalObject(obj.id, { name: e.target.value })}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-md px-3 py-2 text-xs focus:ring-0"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 px-1">ID do Objeto</label>
                        <p
                            className="w-full bg-zinc-900/30 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-500 font-mono select-all"
                            title="Use este ID para referência interna."
                        >
                            {obj.id}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 px-1">Descrição ao olhar/examinar</label>
                        <textarea
                            value={obj.examineDescription}
                            onChange={(e) => onUpdateGlobalObject(obj.id, { examineDescription: e.target.value })}
                            rows={4}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-md px-3 py-2 text-xs focus:ring-0"
                        />
                    </div>
                </div>
                {/* Image Upload Column */}
                <div className="flex flex-col space-y-3 h-full">
                    <label className="block text-[10px] font-bold text-brand-text-dim mb-1">Imagem do Objeto</label>
                    <div className="relative flex-grow w-full min-h-[150px]">
                        {obj.image ? (
                            <div className="absolute inset-0 w-full h-full border border-brand-border rounded-md overflow-hidden bg-brand-bg group">
                                <img src={obj.image} alt={obj.name} className="w-full h-full object-cover bg-brand-bg" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                    <label htmlFor={`image-upload-${obj.id}`} className="p-2 bg-white text-zinc-950 rounded-lg cursor-pointer hover:bg-zinc-200 flex items-center gap-2 font-bold text-xs transition-all">
                                        <Upload className="w-4 h-4" />
                                        <span className="hidden sm:inline">Alterar</span>
                                        <input id={`image-upload-${obj.id}`} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                    <button
                                        onClick={() => onUpdateGlobalObject(obj.id, { image: '' })}
                                        className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-all"
                                        title="Remover Imagem"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor={`image-upload-${obj.id}`}
                                className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full border-2 border-dashed bg-zinc-950/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-all ${isDraggingOver ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-800'}`}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(false); }}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-6 h-6 text-zinc-600 mb-2" />
                                <span className="text-xs text-zinc-500 font-medium">Carregar Imagem</span>
                                <input id={`image-upload-${obj.id}`} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
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
    const [selectedGlobalObjectId, setSelectedGlobalObjectId] = useState<string>('');

    const handleCreateNewObject = () => {
        const allIds = allGlobalObjects.map(o => o.id);
        const newObject: GameObject = {
            id: generateUniqueId('obj', allIds),
            name: 'Novo Objeto',
            examineDescription: 'Descrição do novo objeto.',
        };
        onCreateGlobalObject(newObject, sceneId);
    };

    const handleLinkExistingObject = () => {
        if (selectedGlobalObjectId) {
            onLinkObject(sceneId, selectedGlobalObjectId);
            setSelectedGlobalObjectId('');
        }
    };

    const availableObjects = allGlobalObjects.filter(gObj => !objects.some(linked => linked.id === gObj.id));

    return (
        <>
            <div className="space-y-4">
                {objects.length > 0 ? (
                    objects.map((obj) => (
                        <SceneObjectItem
                            key={obj.id}
                            obj={obj}
                            sceneId={sceneId}
                            onUnlinkObject={onUnlinkObject}
                            onUpdateGlobalObject={onUpdateGlobalObject}
                        />
                    ))
                ) : (
                    <p className="text-center text-zinc-500 py-12 text-xs italic">Nenhum objeto vinculado a esta cena.</p>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-brand-border bg-brand-surface rounded-md p-4">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Adicionar Objeto à Cena</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p className="text-xs text-zinc-500">Crie um novo objeto:</p>
                        <button
                            onClick={handleCreateNewObject}
                            className="w-full flex items-center justify-center px-4 py-2 bg-zinc-950 border border-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-900 transition-all text-xs"
                        >
                            <Plus className="w-4 h-4 mr-2 text-purple-400" />
                            Criar Novo Objeto
                        </button>
                    </div>
                    <div className="space-y-4 md:border-l md:border-zinc-800 md:pl-6">
                        <p className="text-xs text-zinc-500">Ou vincule um existente:</p>
                        <div className="flex gap-2">
                            <select
                                value={selectedGlobalObjectId}
                                onChange={(e) => setSelectedGlobalObjectId(e.target.value)}
                                className="flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:ring-0 [&>option]:bg-zinc-950"
                            >
                                <option value="">Selecione um objeto...</option>
                                {availableObjects.map(obj => (
                                    <option key={obj.id} value={obj.id}>{obj.name} ({obj.id})</option>
                                ))}
                            </select>
                            <button
                                onClick={handleLinkExistingObject}
                                disabled={!selectedGlobalObjectId}
                                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-lg hover:bg-zinc-800 transition-all text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Vincular
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ObjectEditor;
