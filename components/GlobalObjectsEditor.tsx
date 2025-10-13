import React, { useState, useEffect, useMemo } from 'react';
import { GameData, GameObject } from '../types';
import { TrashIcon } from './icons/TrashIcon';

// Interface for the flattened object structure
interface GlobalObject extends GameObject {
  sceneId: string;
  sceneName: string;
}

interface GlobalObjectsEditorProps {
  scenes: GameData['scenes'];
  onUpdateObject: (sceneId: string, objectId: string, updatedData: Partial<GameObject>) => void;
  onDeleteObject: (sceneId: string, objectId: string) => void;
  onSelectScene: (sceneId: string) => void;
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
}

const GlobalObjectsEditor: React.FC<GlobalObjectsEditorProps> = ({
  scenes,
  onUpdateObject,
  onDeleteObject,
  onSelectScene,
  isDirty,
  onSetDirty,
}) => {
  // Memoize the flattened list of takable objects. This will be our "original" state.
  const originalObjects = useMemo((): GlobalObject[] => {
    const takableObjects: GlobalObject[] = [];
    for (const sceneId in scenes) {
      const scene = scenes[sceneId];
      if (scene.objects) {
        for (const obj of scene.objects) {
          if (obj.isTakable) {
            takableObjects.push({
              ...obj,
              sceneId: scene.id,
              sceneName: scene.name,
            });
          }
        }
      }
    }
    // Sort alphabetically by name for a consistent view
    return takableObjects.sort((a, b) => a.name.localeCompare(b.name));
  }, [scenes]);

  const [localObjects, setLocalObjects] = useState<GlobalObject[]>(originalObjects);

  // When the original objects change (e.g., from an import), reset our local state.
  useEffect(() => {
    setLocalObjects(originalObjects);
  }, [originalObjects]);

  // Check for dirtiness
  useEffect(() => {
    // A simple JSON comparison is sufficient here.
    onSetDirty(JSON.stringify(localObjects) !== JSON.stringify(originalObjects));
  }, [localObjects, originalObjects, onSetDirty]);

  const handleObjectChange = (objectId: string, field: 'name' | 'examineDescription', value: string) => {
    setLocalObjects(prev =>
      prev.map(obj =>
        obj.id === objectId ? { ...obj, [field]: value } : obj
      )
    );
  };

  const handleSave = () => {
    // Compare local state to original state and call onUpdateObject for each change.
    localObjects.forEach(localObj => {
      const originalObj = originalObjects.find(o => o.id === localObj.id);
      if (originalObj && JSON.stringify(localObj) !== JSON.stringify(originalObj)) {
        onUpdateObject(localObj.sceneId, localObj.id, {
          name: localObj.name,
          examineDescription: localObj.examineDescription,
        });
      }
    });
    // For deletions, we need to compare the original list with the current one.
    originalObjects.forEach(originalObj => {
        if (!localObjects.some(localObj => localObj.id === originalObj.id)) {
            onDeleteObject(originalObj.sceneId, originalObj.id);
        }
    });
  };

  const handleUndo = () => {
    setLocalObjects(originalObjects);
  };
  
  const handleDelete = (objectId: string) => {
    setLocalObjects(prev => prev.filter(obj => obj.id !== objectId));
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-text">Painel Global de Objetos</h2>
            {isDirty && (
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Alterações não salvas"></div>
            )}
        </div>
        <p className="text-brand-text-dim mt-1">
          Edite todos os objetos coletáveis do seu jogo em um só lugar.
        </p>
      </div>
      
      <div className="bg-brand-surface p-6 space-y-4">
        {localObjects.length > 0 ? (
          localObjects.map(obj => (
            <div key={obj.id} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
              <button
                  onClick={() => handleDelete(obj.id)}
                  className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors"
                  title="Remover objeto"
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
                          <label className="block text-sm font-medium text-brand-text-dim mb-1">Cena de Origem</label>
                          <button
                            onClick={() => onSelectScene(obj.sceneId)}
                            className="w-full text-left bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text hover:bg-brand-border/50 transition-colors"
                          >
                              {obj.sceneName} <span className="text-brand-text-dim">({obj.sceneId})</span>
                          </button>
                      </div>
                  </div>
                  <div className="flex flex-col h-full">
                      <label htmlFor={`obj-desc-${obj.id}`} className="block text-sm font-medium text-brand-text-dim mb-1">Descrição ao olhar/examinar</label>
                      <textarea
                        id={`obj-desc-${obj.id}`}
                        value={obj.examineDescription}
                        onChange={e => handleObjectChange(obj.id, 'examineDescription', e.target.value)}
                        rows={4}
                        className="w-full flex-grow bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                      />
                  </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-brand-text-dim py-4">Nenhum objeto coletável encontrado no jogo.</p>
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
