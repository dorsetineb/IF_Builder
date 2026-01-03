
import React, { useRef } from 'react';
import { Scene } from '../types';
import { Plus, Trash2, Menu } from 'lucide-react';

interface SceneListProps {
  scenes: Scene[];
  startSceneId: string;
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onReorderScenes: (newOrder: string[]) => void;
}

const SceneList: React.FC<SceneListProps> = ({
  scenes,
  startSceneId,
  selectedSceneId,
  onSelectScene,
  onAddScene,
  onDeleteScene,
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
            className={`${scene.id !== startSceneId ? 'group' : ''} relative flex items-center rounded-lg transition-all overflow-hidden ${selectedSceneId === scene.id
              ? 'bg-purple-500/20 text-purple-100 border border-purple-500/30'
              : 'hover:bg-zinc-800/50'
              } ${scene.id === startSceneId ? 'cursor-default' : ''}`}
            onDragStart={(e) => scene.id !== startSceneId && handleDragStart(e, index)}
            onDragEnter={(e) => scene.id !== startSceneId && handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            draggable={scene.id !== startSceneId}
          >
            <div className={`flex items-center flex-grow p-2`}>
              {scene.id !== startSceneId ? (
                <Menu className={`w-4 h-4 mr-2 cursor-move flex-shrink-0 ${selectedSceneId === scene.id ? 'text-purple-400' : 'text-zinc-600'}`} />
              ) : null}

              <div
                className={`flex-1 min-w-0 flex items-center justify-between ${scene.id !== startSceneId ? 'cursor-pointer' : ''}`}
                onClick={() => onSelectScene(scene.id)}
              >
                <span className="truncate font-medium text-xs">{scene.name}</span>
                {startSceneId === scene.id && (
                  <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${selectedSceneId === scene.id ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                    Início
                  </span>
                )}
              </div>
            </div>

            {startSceneId !== scene.id && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteScene(scene.id); }}
                className="absolute top-0 right-0 h-full w-12 flex items-center justify-center bg-red-500 text-white transform translate-x-full group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out"
                title="Deletar cena"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={onAddScene}
        className="w-full flex items-center justify-center px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-lg hover:bg-zinc-800 transition-all text-xs"
      >
        <Plus className="w-4 h-4 mr-2 text-purple-400" />
        Adicionar Cena
      </button>
    </div>
  );
};

export default SceneList;
