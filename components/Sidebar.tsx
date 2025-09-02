
import React, { useState, useEffect } from 'react';
import SceneList from './SceneList';
import { Scene, View } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { NodeIcon } from './icons/NodeIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface SidebarProps {
  scenes: Scene[];
  startSceneId: string;
  selectedSceneId: string | null;
  currentView: View;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onSetStartScene: (id: string) => void;
  onReorderScenes: (newOrder: string[]) => void;
  onSetView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { currentView, onSetView, scenes, ...sceneListProps } = props;
  const [isSceneListOpen, setIsSceneListOpen] = useState(true);

  useEffect(() => {
    if (currentView !== 'scenes') {
      setIsSceneListOpen(false);
    }
  }, [currentView]);

  const getButtonClass = (view: View) => 
    `w-full flex items-center p-2 rounded-md transition-colors text-left ${
      currentView === view 
        ? 'bg-brand-primary/20 text-brand-primary' 
        : 'hover:bg-brand-border/50'
    }`;

  return (
    <aside className="w-1/4 xl:w-1/5 bg-brand-surface p-4 overflow-y-auto border-r border-brand-border">
      <nav className="flex flex-col gap-2">
        <button className={getButtonClass('game_info')} onClick={() => onSetView('game_info')}>
          <InformationCircleIcon className="w-5 h-5 mr-3" />
          <span className="font-semibold">Informações do Jogo</span>
        </button>
        <button className={getButtonClass('interface')} onClick={() => onSetView('interface')}>
          <CodeIcon className="w-5 h-5 mr-3" />
          <span className="font-semibold">Interface</span>
        </button>
      
        <button
            onClick={() => setIsSceneListOpen(!isSceneListOpen)}
            className="w-full flex justify-between items-center text-left p-2 rounded-md hover:bg-brand-border/50"
            aria-expanded={isSceneListOpen}
        >
            <div className="flex items-center">
                <BookOpenIcon className="w-5 h-5 mr-3" />
                <span className="font-semibold">Editor de Cenas</span>
                <span className="ml-2 bg-brand-border text-brand-text-dim text-xs font-bold px-2 py-0.5 rounded-full">
                    {scenes.length}
                </span>
            </div>
            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isSceneListOpen ? 'rotate-180' : ''}`} />
        </button>

        {isSceneListOpen && (
          <SceneList scenes={scenes} {...sceneListProps} />
        )}
        
        <button className={getButtonClass('scene_map')} onClick={() => onSetView('scene_map')}>
          <NodeIcon className="w-5 h-5 mr-3" />
          <span className="font-semibold">Mapa de Cenas</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
