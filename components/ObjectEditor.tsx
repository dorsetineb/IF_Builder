import React, { useState } from 'react';
import { GameObject } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';

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
  
  const handleImageUpload = (objectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  onUpdateGlobalObject(objectId, { image: event.target.result });
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
      if (e.target) {
        (e.target as HTMLInputElement).value = '';
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
                        <div>
                            <label className="block text-sm font-medium text-brand-text-dim mb-1">ID do Objeto</label>
                            <p 
                                className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-dim font-mono select-all"
                                title="Use este ID para referência interna."
                            >
                                {obj.id}
                            </p>
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
                        <div className="flex items-center pt-1">
                            <input 
                                type="checkbox" 
                                checked={obj.isTakable} 
                                onChange={(e) => onUpdateGlobalObject(obj.id, { isTakable: e.target.checked })}
                                className="custom-checkbox" 
                            />
                            <label className="ml-2 block text-sm text-brand-text-dim">Pode ser pego (Item de Inventário)</label>
                        </div>
                    </div>
                    {/* Image Upload Column */}
                    <div className="flex flex-col space-y-3">
                        <label className="block text-sm font-medium text-brand-text-dim mb-1">Imagem do Objeto</label>
                        <div className="flex-grow relative bg-brand-border/30 border border-brand-border rounded-md min-h-[150px] flex items-center justify-center overflow-hidden">
                            {obj.image ? (
                                <img src={obj.image} alt={obj.name} className="w-full h-full object-contain" />
                            ) : (
                                <label 
                                    htmlFor={`image-upload-${obj.id}`} 
                                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-brand-border/50 transition-colors"
                                >
                                    <UploadIcon className="w-8 h-8 text-brand-text-dim mb-2" />
                                    <span className="text-xs text-brand-text-dim">Carregar Imagem</span>
                                </label>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor={`image-upload-${obj.id}`} className="flex-grow flex items-center justify-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors cursor-pointer text-sm">
                                    <UploadIcon className="w-4 h-4 mr-2" /> {obj.image ? 'Alterar' : 'Carregar'}
                                    <input id={`image-upload-${obj.id}`} type="file" accept="image/*" onChange={(e) => handleImageUpload(obj.id, e)} className="hidden" />
                            </label>
                                {obj.image && (
                                    <button
                                        onClick={() => onUpdateGlobalObject(obj.id, { image: '' })}
                                        className="p-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors"
                                        title="Remover Imagem"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-xs text-brand-text-dim italic">Alterações feitas aqui afetam o objeto em todo o jogo.</p>
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
            <div className="space-y-2 md:border-l md:border-brand-border/30 md:pl-6">
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