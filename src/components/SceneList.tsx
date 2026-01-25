
import React, { useRef } from 'react';
import { Scene } from '../types';
import { Plus, Trash2, Menu, Play, ArrowRight, Flag } from 'lucide-react';

interface SceneListProps {
  scenes: Scene[];
  startSceneId: string;
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onReorderScenes: (newOrder: string[]) => void;
  isDirty?: boolean;
}

const SceneList: React.FC<SceneListProps> = ({
  scenes,
  startSceneId,
  selectedSceneId,
  onSelectScene,
  onAddScene,
  onDeleteScene,
  onReorderScenes,
  isDirty,
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

  const getVignetteIcon = (scene: Scene) => {
    if (!scene.vignetteType || scene.vignetteType === 'none') return null;
    switch (scene.vignetteType) {
      case 'opening': return <Play className="w-3 h-3 text-purple-400" />;
      case 'transition': return <ArrowRight className="w-3 h-3 text-blue-400" />;
      case 'conclusion': return <Flag className="w-3 h-3 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {scenes.map((scene, index) => (
          <li
            key={scene.id}
            className={`${scene.id !== startSceneId ? 'group' : ''} relative flex items-center rounded-lg transition-all overflow-hidden ${selectedSceneId === scene.id
              ? isDirty
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold'
                : 'bg-primary/20 text-primary border border-primary/30'
              : 'hover:bg-muted/50'
              } ${scene.id === startSceneId ? 'cursor-default' : ''}`}
            onDragStart={(e) => scene.id !== startSceneId && handleDragStart(e, index)}
            onDragEnter={(e) => scene.id !== startSceneId && handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            draggable={scene.id !== startSceneId}
          >
            <div className={`flex items-center flex-grow p-2`}>
              {scene.id !== startSceneId ? (
                <Menu className={`w-4 h-4 mr-2 cursor-move flex-shrink-0 ${selectedSceneId === scene.id ? (isDirty ? 'text-yellow-500' : 'text-primary') : 'text-muted-foreground'}`} />
              ) : null}

              <div className="flex items-center justify-between w-full min-w-0">
                <span className="truncate font-medium text-xs">{scene.name}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {getVignetteIcon(scene)}
                  {startSceneId === scene.id && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${selectedSceneId === scene.id
                      ? isDirty
                        ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                        : 'bg-primary text-primary-foreground border-primary/50' // Active Selected Start
                      : 'bg-primary text-primary-foreground border-primary/50' // Inactive Start
                      }`}>
                      Início
                    </span>
                  )}
                </div>
              </div>
            </div>

            {startSceneId !== scene.id && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteScene(scene.id); }}
                className="absolute top-0 right-0 h-full w-12 flex items-center justify-center bg-red-500 text-white transform translate-x-full group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20 cursor-pointer"
                title="Deletar cena"
              >
                <Trash2 className="w-5 h-5 pointer-events-none" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={onAddScene}
        className="w-full flex items-center justify-center px-4 py-2 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-md active:scale-95 text-xs"
      >
        <Plus className="w-4 h-4 mr-2 text-zinc-950" />
        Adicionar Cena
      </button>
    </div>
  );
};

export default SceneList;
