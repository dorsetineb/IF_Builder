

import React, { useState } from 'react';
import { GameObject } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ObjectEditorProps {
  sceneId: string;
  objects: GameObject[]; // The objects currently linked to this scene
  allGlobalObjects: GameObject[]; // All available objects
  onCreateGlobalObject: (obj: GameObject, linkToSceneId: string) => void;
  onLinkObject: (sceneId: string, objectId: string) => void;
  onUnlinkObject: (sceneId: string, objectId: string) => void;
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
    onUnlinkObject 
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 opacity-75 pointer-events-none">
                    {/* Read-only view of the object */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-text-dim mb-1">Nome do Objeto</label>
                            <input type="text" value={obj.name} readOnly className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0 cursor-default" />
                        </div>
                        <div className="flex items-center pt-2">
                        <input type="checkbox" checked={obj.isTakable} readOnly className="custom-checkbox cursor-default" />
                        <label className="ml-2 block text-sm text-brand-text-dim">Pode ser pego pelo jogador</label>
                        </div>
                    </div>
                    <div className="flex flex-col h-full">
                        <label className="block text-sm font-medium text-brand-text-dim mb-1">Descrição</label>
                        <textarea value={obj.examineDescription} readOnly rows={3} className="w-full flex-grow bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0 cursor-default" />
                    </div>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-xs text-brand-text-dim italic">Para editar as propriedades deste objeto, use a aba "Objetos" no menu lateral.</p>
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
                <p className="text-sm text-brand-text-dim">Vincular um objeto existente:</p>
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
            <div className="space-y-2 border-l border-brand-border/30 pl-6 md:border-l-0 md:pl-0 md:border-l border-brand-border/30 md:pl-6">
                 <p className="text-sm text-brand-text-dim">Ou crie um novo:</p>
                 <button 
                    onClick={handleCreateNewObject} 
                    className="w-full flex items-center justify-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors duration-200"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Criar Novo Objeto
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default ObjectEditor;