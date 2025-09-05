
import React, { useRef } from 'react';
import { Scene } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { Bars3Icon } from './icons/Bars3Icon';

interface SceneListProps {
  scenes: Scene[];
  startSceneId: string;
  selectedSceneId: string | null;
  dirtySceneIds: Set<string>;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onSetStartScene: (id: string) => void;
  onReorderScenes: (newOrder: string[]) => void;
}

const SceneList: React.FC<SceneListProps> = ({
  scenes,
  startSceneId,
  selectedSceneId,
  dirtySceneIds,
  onSelectScene,
  onAddScene,
  onDeleteScene,
  onSetStartScene,
  onReorderScenes,
}) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, position: number) => {
    dragItem.current = position;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, position: number) => {
    dragOverItem.current = position;
    const list = scenes.map(s => s.id);
    const dragItemContent = list[dragItem.current!];
    if (dragItemContent === list[position]) return;
    
    list.splice(dragItem.current!, 1);
    list.splice(dragOverItem.current!, 0, dragItemContent);
    dragItem.current = dragOverItem.current;
    
    // Optimistic update
    onReorderScenes(list);
  };
  
  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  };
  
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
          {scenes.map((scene, index) => (
          <li
              key={scene.id}
              className={`group relative flex items-center p-2 rounded-md cursor-pointer transition-colors overflow-hidden ${
              selectedSceneId === scene.id
                  ? 'bg-yellow-400 text-black'
                  : 'hover:bg-brand-border/50'
              }`}
              onClick={() => onSelectScene(scene.id)}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              draggable
          >
              <Bars3Icon className={`w-5 h-5 mr-2 cursor-move flex-shrink-0 ${selectedSceneId === scene.id ? 'text-black' : 'text-brand-text-dim'}`} />
              <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="truncate font-medium">{scene.name}</span>
                  {dirtySceneIds.has(scene.id) && (
                    <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" title="Alterações não salvas"></div>
                  )}
              </div>
              <div className="absolute right-0 flex items-center h-full transition-transform duration-300 ease-in-out group-hover:-translate-x-10">
                  {startSceneId === scene.id && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${selectedSceneId === scene.id ? 'bg-black/20' : 'bg-brand-primary/30 text-brand-primary'}`}>
                          início
                      </span>
                  )}
              </div>
              
              <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center bg-red-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out">
                  <button
                      onClick={(e) => { e.stopPropagation(); onDeleteScene(scene.id); }}
                      className="w-full h-full flex items-center justify-center text-white"
                      title="Deletar cena"
                      >
                      <TrashIcon className="w-5 h-5" />
                  </button>
              </div>
          </li>
          ))}
      </ul>
        <button
          onClick={onAddScene}
          className="w-full flex items-center justify-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors duration-200"
      >
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Cena
      </button>
    </div>
  );
};

export default SceneList;
