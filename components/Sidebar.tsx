
import React from 'react';
import SceneList from './SceneList';
import { Scene, View } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { NodeIcon } from './icons/NodeIcon';

interface SidebarProps {
  scenes: Scene[];
  startSceneId: string;
  selectedSceneId: string | null;
  currentView: View;
  dirtySceneIds: Set<string>;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onSetStartScene: (id: string) => void;
  onReorderScenes: (newOrder: string[]) => void;
  onSetView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { currentView, onSetView, scenes, dirtySceneIds, ...sceneListProps } = props;

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
      
        {/* Scene Editor Section */}
        <div>
            <button className={getButtonClass('scenes')} onClick={() => onSetView('scenes')}>
                <BookOpenIcon className="w-5 h-5 mr-3" />
                <span className="font-semibold">Editor de Cenas</span>
                <span className="ml-2 bg-brand-border text-brand-text-dim text-xs font-bold px-2 py-0.5 rounded-full">
                    {scenes.length}
                </span>
            </button>
            {currentView === 'scenes' && (
              <div className="pl-4 pt-2 mt-2 border-l-2 border-brand-border/50 ml-2">
                <SceneList scenes={scenes} dirtySceneIds={dirtySceneIds} {...sceneListProps} />
              </div>
            )}
        </div>
        
        <button className={getButtonClass('scene_map')} onClick={() => onSetView('scene_map')}>
          <NodeIcon className="w-5 h-5 mr-3" />
          <span className="font-semibold">Mapa de Cenas</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
