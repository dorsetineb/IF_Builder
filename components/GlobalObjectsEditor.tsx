

import React, { useState, useEffect, useMemo } from 'react';
import { GameData, GameObject, Scene } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';
import { PlusIcon } from './icons/PlusIcon';

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
  // Convert dict to array and sort
  const sortedObjects = useMemo(() => {
      return Object.values(globalObjects).sort((a: GameObject, b: GameObject) => a.name.localeCompare(b.name));
  }, [globalObjects]);

  const [localObjects, setLocalObjects] = useState<GameObject[]>(sortedObjects);

  useEffect(() => {
    setLocalObjects(sortedObjects);
  }, [sortedObjects]);

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

  const handleImageUpload = (objectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  handleObjectChange(objectId, 'image', event.target.result);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
      if (e.target) {
        (e.target as HTMLInputElement).value = '';
      }
  };

  const handleSave = () => {
    localObjects.forEach(localObj => {
      const originalObj = globalObjects[localObj.id];
      if (originalObj && JSON.stringify(localObj) !== JSON.stringify(originalObj)) {
        onUpdateObject(localObj.id, {
          name: localObj.name,
          examineDescription: localObj.examineDescription,
          image: localObj.image,
          isTakable: localObj.isTakable
        });
      }
    });
  };

  const handleUndo = () => {
    setLocalObjects(sortedObjects);
  };
  
  const handleCreate = () => {
      const allIds = Object.keys(globalObjects);
      const newObject: GameObject = {
          id: generateUniqueId('obj', allIds),
          name: 'Novo Objeto',
          examineDescription: 'Descrição do novo objeto.',
          isTakable: false,
      };
      onCreateObject(newObject);
  };
  
  // Helper to find usages of an object
  const getObjectUsages = (objectId: string) => {
      const usages: {id: string, name: string}[] = [];
      Object.values(scenes).forEach((scene: Scene) => {
          if (scene.objectIds.includes(objectId)) {
              usages.push({ id: scene.id, name: scene.name });
          }
      });
      return usages;
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-start">
        <div>
            <div className="flex items-center gap-2">
                {isDirty && (
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Alterações não salvas"></div>
                )}
            </div>
            <p className="text-brand-text-dim mt-1 text-lg">
                Aqui você gerencia todos os objetos do jogo. Vincule-os às cenas através do Editor de Cenas.
            </p>
        </div>
        <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Objeto
        </button>
      </div>
      
      <div className="bg-brand-surface p-6 space-y-4">
        {localObjects.length > 0 ? (
          localObjects.map(obj => {
            const usages = getObjectUsages(obj.id);
            return (
                <div key={obj.id} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
                <button
                    onClick={() => onDeleteObject(obj.id)}
                    className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors"
                    title="Excluir objeto do jogo"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor={`obj-name-${obj.id}`} className="block text-sm font-medium text-brand-text-dim mb-1">Nome do Objeto</label>
                            <input
                                id={`obj-name-${obj.id}`}
                                type="text"
                                value={obj.name}
                                onChange={e => handleObjectChange(obj.id, 'name', e.target.value)}
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
                        <div className="flex flex-col flex-grow">
                            <label htmlFor={`obj-desc-${obj.id}`} className="block text-sm font-medium text-brand-text-dim mb-1">Descrição ao olhar/examinar</label>
                            <textarea
                                id={`obj-desc-${obj.id}`}
                                value={obj.examineDescription}
                                onChange={e => handleObjectChange(obj.id, 'examineDescription', e.target.value)}
                                rows={4}
                                className="w-full h-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                            />
                        </div>
                        <div className="flex items-center pt-1">
                            <input
                                type="checkbox"
                                id={`isTakable-${obj.id}`}
                                checked={obj.isTakable}
                                onChange={e => handleObjectChange(obj.id, 'isTakable', e.target.checked)}
                                className="custom-checkbox"
                            />
                            <label htmlFor={`isTakable-${obj.id}`} className="ml-2 block text-sm text-brand-text-dim">
                                Pode ser pego (Item de Inventário)
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-text-dim mb-1">Usado em:</label>
                            {usages.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {usages.map(usage => (
                                        <button
                                            key={usage.id}
                                            onClick={() => onSelectScene(usage.id)}
                                            className="px-2 py-1 bg-brand-border/30 border border-brand-border rounded text-xs hover:bg-brand-border/50 transition-colors"
                                            title={`Ir para cena ${usage.name}`}
                                        >
                                            {usage.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-brand-text-dim italic">Não vinculado a nenhuma cena.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <label className="block text-sm font-medium text-brand-text-dim mb-1">Imagem do Objeto</label>
                        <div className="flex-grow relative bg-brand-border/30 border border-brand-border rounded-md min-h-[200px] flex items-center justify-center overflow-hidden">
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
                                        onClick={() => handleObjectChange(obj.id, 'image', '')}
                                        className="p-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors"
                                        title="Remover Imagem"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                        </div>
                        <p className="text-xs text-brand-text-dim text-center">Imagem que aparece ao inspecionar o item.<br/>Recomendado: 1:1 (quadrado), ex: 512x512 pixels.</p>
                    </div>
                </div>
                </div>
            )
          })
        ) : (
          <p className="text-center text-brand-text-dim py-4">Nenhum objeto na biblioteca.</p>
        )}
      </div>

      <div className="fixed bottom-6 right-10 z-10 flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!isDirty}
            className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text-dim font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Desfazer
          </button>
          <button
              onClick={handleSave}
              disabled={!isDirty}
              className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
              Salvar Alterações
          </button>
      </div>
    </div>
  );
};

export default GlobalObjectsEditor;