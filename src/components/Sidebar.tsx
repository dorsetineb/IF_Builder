import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SceneList from './SceneList';
import { Scene, View, GameData } from '../types';
import { Code, BookOpen, Map, Box, SlidersHorizontal, Settings, Info, CircleHelp, ChevronLeft, ChevronRight, MessageSquare, Gamepad2 } from 'lucide-react';

interface SidebarProps {
  scenes: Scene[];
  startSceneId: string;
  selectedSceneId: string | null;
  currentView: View;
  gameData: GameData;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onReorderScenes: (newOrder: string[]) => void;
  onSetView: (view: View) => void;
  onExit?: () => void;
  onImportGame: (data: GameData) => void;
  onTogglePreview: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenManual: () => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { onExit, currentView, onSetView, scenes, gameData, isCollapsed, onToggleCollapse, onOpenManual, ...sceneListProps } = props;
  const [isScenesExpanded, setIsScenesExpanded] = useState(currentView === 'scenes');

  useEffect(() => {
    if (currentView === 'scenes') {
      setIsScenesExpanded(true);
    }
  }, [currentView]);

  const getButtonClass = (view: View) =>
    `w-full flex items-center p-2 rounded-lg transition-all text-left ${currentView === view
      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
    }`;

  const handleToggleScenes = () => {
    if (currentView !== 'scenes') {
      onSetView('scenes');
      setIsScenesExpanded(true);
      if (isCollapsed) onToggleCollapse(); // Auto-expand sidebar when opening scenes
    } else {
      setIsScenesExpanded(!isScenesExpanded);
    }
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-card p-4 border-r border-border flex flex-col transition-all duration-300 relative flex-shrink-0`}>


      <nav className="flex flex-col gap-2 flex-grow overflow-y-auto overflow-x-hidden">
        {/* Manual Button - Styled like "Abrir Editor" */}
        <button
          onClick={onOpenManual}
          className={`flex items-center gap-3 w-full bg-secondary hover:bg-white hover:text-zinc-900 text-secondary-foreground font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-sm group border border-purple-500/50 mb-4 relative overflow-hidden flex-shrink-0 ${isCollapsed ? 'justify-center px-0' : 'pl-4 justify-start'}`}
          title={isCollapsed ? "Manual" : undefined}
        >
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-purple-500/20 to-transparent pointer-events-none" />
          <CircleHelp size={20} className="group-hover:scale-110 transition-transform text-primary relative z-10" />
          {!isCollapsed && <span className="truncate relative z-10">Guia Rápido</span>}
        </button>

        <button
          className={getButtonClass('interface')}
          onClick={() => onSetView('interface')}
          title={isCollapsed ? "Informações e Interface" : undefined}
        >
          <Code className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="font-semibold text-xs ml-3 truncate">Informações e Interface</span>}
        </button>

        <div>
          <button
            className={getButtonClass('scenes')}
            onClick={handleToggleScenes}
            title={isCollapsed ? "Editor de Cenas" : undefined}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="font-semibold text-xs ml-3 truncate">Editor de Cenas</span>
                <span className="ml-auto bg-muted text-muted-foreground text-[10px] font-bold rounded-md px-1.5 py-0.5 border border-border">
                  {scenes.length}
                </span>
              </>
            )}
          </button>
          {!isCollapsed && isScenesExpanded && (
            <div className="pl-4 mt-2 ml-2 border-l border-border">
              <SceneList scenes={scenes} {...sceneListProps} />
            </div>
          )}
        </div>

        <button
          className={getButtonClass('map')}
          onClick={() => onSetView('map')}
          title={isCollapsed ? "Mapa de Cenas" : undefined}
        >
          <Map className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="font-semibold text-xs ml-3 truncate">Mapa de Cenas</span>}
        </button>

        {(gameData.gameInteractionType || 'parser') !== 'choice' && (
          <button
            className={getButtonClass('global_objects')}
            onClick={() => onSetView('global_objects')}
            title={isCollapsed ? "Objetos" : undefined}
          >
            <Box className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="font-semibold text-xs ml-3 truncate">Objetos</span>}
          </button>
        )}
        <button
          className={getButtonClass('trackers')}
          onClick={() => onSetView('trackers')}
          title={isCollapsed ? "Rastreadores" : undefined}
        >
          <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="font-semibold text-xs ml-3 truncate">Rastreadores</span>}
        </button>

        {/* Bottom Menu Items */}
        <div className="mt-auto pt-4 flex flex-col gap-1">
          <div className="h-px bg-border my-2 mx-2"></div>

          <button
            className="flex w-full items-center px-2 py-1.5 rounded-lg mb-1 transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            onClick={onExit}
            title={isCollapsed ? "Comunidade" : undefined}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="font-semibold text-xs ml-3 truncate">Comunidade</span>}
          </button>

          <Link
            to="/about"
            className="flex w-full items-center px-2 py-1.5 rounded-lg mb-1 transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            title={isCollapsed ? "Sobre o Projeto" : undefined}
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="font-semibold text-xs ml-3 truncate">Sobre o Projeto</span>}
          </Link>

          <Link
            to="/settings"
            className="flex w-full items-center px-2 py-1.5 rounded-lg mb-1 transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            title={isCollapsed ? "Configurações" : undefined}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="font-semibold text-xs ml-3 truncate">Configurações</span>}
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
