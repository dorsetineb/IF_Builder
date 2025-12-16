import React, { useState } from 'react';
import { GameObject } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ImageUploader } from './ImageUploader';

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
  const [selectedGlobalObjectId, setSelectedGlobalObjectId] = useState<string>('');
  
  const handleCreateNewObject = () => {
    const allIds = allGlobalObjects.map(o => o.id);
    const newObject: GameObject = {
      id: generateUniqueId('obj', allIds),
      name: 'Novo Objeto',
      examineDescription: 'Descrição do novo objeto.',
      isTakable: false,
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
            objects.map((obj, index) => (
            <div key={obj.id} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
                <button
                    onClick={() => onUnlinkObject(sceneId, obj.id)}
                    className="absolute top-0 right-0 p-2 bg-brand-border text-brand-text-dim rounded-bl-lg hover:bg-red-500 hover:text-white transition-colors"
                    title="Desvincular objeto desta cena (não apaga do jogo)"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Editable fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-text-dim mb-1">Nome do Objeto</label>
                            <input 
                                type="text" 
                                value={obj.name} 
                                onChange={(e) => onUpdateGlobalObject(obj.id, { name: e.target.value })}
                                className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0" 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-text-dim mb-1">ID do Objeto</label>
                                <p 
                                    className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-dim font-mono select-all"
                                    title="Use este ID para referência interna."
                                >
                                    {obj.id}
                                </p>
                            </div>
                            <div className="flex items-center mt-6">
                                <input 
                                    type="checkbox"
                                    id={`isTakable-${obj.id}`}
                                    checked={obj.isTakable} 
                                    onChange={(e) => onUpdateGlobalObject(obj.id, { isTakable: e.target.checked })}
                                    className="custom-checkbox" 
                                />
                                <label htmlFor={`isTakable-${obj.id}`} className="ml-2 block text-sm text-brand-text-dim cursor-pointer">
                                    Pode ser pego
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-brand-text-dim mb-1">Descrição ao olhar/examinar</label>
                            <textarea 
                                value={obj.examineDescription} 
                                onChange={(e) => onUpdateGlobalObject(obj.id, { examineDescription: e.target.value })}
                                rows={4} 
                                className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0" 
                            />
                        </div>
                    </div>
                    {/* Image Upload Column */}
                    <div className="flex flex-col h-full">
                        <label className="block text-sm font-medium text-brand-text-dim mb-1">Imagem do Objeto</label>
                        <ImageUploader
                            id={`image-upload-${obj.id}`}
                            image={obj.image}
                            onImageUpload={(data) => onUpdateGlobalObject(obj.id, { image: data })}
                            onRemove={() => onUpdateGlobalObject(obj.id, { image: '' })}
                            className="flex-grow"
                            height="min-h-[200px]"
                        />
                         <p className="text-xs text-brand-text-dim text-center mt-2">Imagem que aparece ao clicar no item em Inventário.</p>
                    </div>
                </div>
            </div>
            ))
        ) : (
             <p className="text-center text-brand-text-dim">Nenhum objeto vinculado a esta cena.</p>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-brand-border bg-brand-surface rounded-md p-4">
        <h4 className="text-sm font-bold text-brand-text mb-4">Adicionar Objeto à Cena</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                 <p className="text-sm text-brand-text-dim">Crie um novo objeto:</p>
                 <button 
                    onClick={handleCreateNewObject} 
                    className="w-full flex items-center justify-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors duration-200"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Criar Novo Objeto
                </button>
            </div>
            <div className="space-y-2">
                <p className="text-sm text-brand-text-dim">Ou vincule um existente:</p>
                <div className="flex gap-2">
                    <select
                        value={selectedGlobalObjectId}
                        onChange={(e) => setSelectedGlobalObjectId(e.target.value)}
                        className="flex-grow bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                    >
                        <option value="">Selecione um objeto...</option>
                        {availableObjects.map(obj => (
                            <option key={obj.id} value={obj.id}>{obj.name} ({obj.id})</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleLinkExistingObject}
                        disabled={!selectedGlobalObjectId}
                        className="px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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