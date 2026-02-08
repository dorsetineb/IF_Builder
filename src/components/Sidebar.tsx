import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SceneList from './SceneList';
import { Scene, View, GameData } from '../types';
import { Code, BookOpen, Map, Box, SlidersHorizontal, Settings, Info, CircleHelp, ChevronLeft, ChevronRight, MessageSquare, Gamepad2, ChevronDown, MonitorPlay, Zap, Command } from 'lucide-react';

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
  onNavigate?: (path: string) => void;
  onImportGame: (data: GameData) => void;
  onTogglePreview: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDirty?: boolean;
  theme?: string;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { onExit, onNavigate, currentView, onSetView, scenes, gameData, isCollapsed, onToggleCollapse, onOpenManual, isDirty, theme = 'dark', ...sceneListProps } = props;
  const [isScenesExpanded, setIsScenesExpanded] = useState(false);


  // Sync accordion state with current view
  useEffect(() => {
    if (currentView === 'scenes' || currentView === 'map') {
      setIsScenesExpanded(true);
    } else {
      setIsScenesExpanded(false);
    }
  }, [currentView]);

  // Platform Sidebar Style Button Class
  const getButtonClass = (view: View) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-xs font-medium group relative overflow-hidden flex-shrink-0 ${currentView === view
      ? `bg-primary text-primary-foreground font-bold shadow-sm`
      : 'text-muted-foreground hover:bg-zinc-800 hover:text-white'
    } ${isCollapsed ? 'justify-center px-0 py-3' : ''}`;

  const handleToggleScenes = () => {
    if (currentView !== 'scenes' && currentView !== 'map') {
      onSetView('scenes');
      setIsScenesExpanded(true);
    } else {
      setIsScenesExpanded(!isScenesExpanded);
    }
  };

  const handleSetView = (view: View) => {
    onSetView(view);
    setIsScenesExpanded(false);
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-card border-r border-muted-foreground/50 flex flex-col transition-all duration-300 relative flex-shrink-0 h-full hover:border-r-purple-500/40`}>


      <nav className="flex flex-col gap-1 flex-grow overflow-y-auto overflow-x-hidden px-3 py-4">
        {/* Community Button - REMOVED AS REQUESTED */}





        {/* Informações e Interface */}
        <button
          className={getButtonClass('interface')}
          onClick={() => handleSetView('interface')}
          title={isCollapsed ? "Informações e Interface" : undefined}
        >
          <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'interface' ? 'translate-x-0' : ''}`} />
          <Code className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="truncate relative z-10">Informações e Interface</span>}
        </button>

        {/* Scene Editor - Accordion */}
        <div className="flex flex-col">
          <button
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-xs font-medium group relative overflow-hidden flex-shrink-0 ${isScenesExpanded
              ? `bg-primary text-primary-foreground font-bold shadow-sm`
              : 'text-muted-foreground hover:bg-zinc-800 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0 py-3' : ''}`}
            onClick={handleToggleScenes}
            title={isCollapsed ? "Editor de Cenas" : undefined}
          >
            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${isScenesExpanded ? 'translate-x-0' : ''}`} />

            <BookOpen className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
            {!isCollapsed && (
              <>
                <span className="truncate relative z-10 flex-1 text-left">Editor de Cenas</span>
                {/* Counter */}
                <span className="bg-black/30 text-white text-[10px] font-bold rounded-md px-1.5 py-0.5 border border-white/20 shadow-sm relative z-10">
                  {scenes.length}
                </span>
                {/* Arrow removed as requested */}
              </>
            )}

            {/* Show tiny counter badge if collapsed */}
            {isCollapsed && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[8px] font-bold border border-white/20 z-20 shadow-sm">
                {scenes.length}
              </div>
            )}
          </button>

          {/* Expanded Content */}
          {(!isCollapsed && isScenesExpanded) && (
            <div className="pl-4 mt-1 mb-2 animate-in slide-in-from-top-2 duration-200">
              <div className="pl-3 border-l-2 border-primary/30 flex flex-col gap-1">
                <SceneList scenes={scenes} isDirty={isDirty} theme={theme} {...sceneListProps} />

                {/* Map Button inside accordion */}
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs font-medium text-left mt-1 ${currentView === 'map'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:bg-zinc-800 hover:text-white border border-transparent'}`}
                  onClick={() => onSetView('map')}
                >
                  <Map size={14} />
                  <span>Mapa de Cenas</span>
                </button>
              </div>
            </div>
          )}
        </div>


        {/* Vinhetas */}
        {/* Vignettes button removed */}

        {(gameData.gameInteractionType || 'parser') !== 'choice' && (
          <button
            className={getButtonClass('global_objects')}
            onClick={() => handleSetView('global_objects')}
            title={isCollapsed ? "Objetos" : undefined}
          >
            <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'global_objects' ? 'translate-x-0' : ''}`} />
            <Box className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span className="truncate relative z-10">Objetos</span>}
          </button>
        )}
        <button
          className={getButtonClass('trackers')}
          onClick={() => handleSetView('trackers')}
          title={isCollapsed ? "Rastreadores" : undefined}
        >
          <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'trackers' ? 'translate-x-0' : ''}`} />
          <SlidersHorizontal className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="truncate relative z-10">Rastreadores</span>}
        </button>

        {(gameData.gameInteractionType || 'parser') !== 'choice' && (
          <button
            className={getButtonClass('global_commands')}
            onClick={() => handleSetView('global_commands')}
            title={isCollapsed ? "Comandos Globais" : undefined}
          >
            <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'global_commands' ? 'translate-x-0' : ''}`} />
            <Command className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span className="truncate relative z-10">Comandos Globais</span>}
          </button>
        )}



      </nav>

      {/* Bottom Menu Items - Pinned to Bottom */}
      <div className="mt-auto pt-2 pb-4 px-3 flex flex-col gap-1 relative border-t border-muted-foreground/50 bg-card z-20 flex-shrink-0">

        <button
          onClick={() => onSetView('guide')}
          className={getButtonClass('guide')}
          title={isCollapsed ? "Guia Rápido" : undefined}
        >
          <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'guide' ? 'translate-x-0' : ''}`} />
          <CircleHelp className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="truncate relative z-10">Guia Rápido</span>}
        </button>

        <button
          onClick={() => handleSetView('about')}
          className={getButtonClass('about')}
          title={isCollapsed ? "Sobre o Projeto" : undefined}
        >
          <div className={`absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'about' ? 'translate-x-0' : ''}`} />
          <Zap className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="truncate relative z-10">Sobre o Projeto</span>}
        </button>

        <button
          onClick={() => handleSetView('settings')}
          className={getButtonClass('settings')}
          title={isCollapsed ? "Configurações" : undefined}
        >
          <div className={`absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'settings' ? 'translate-x-0' : ''}`} />
          <Settings className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="truncate relative z-10">Configurações</span>}
        </button>
      </div>


    </aside >
  );
};

export default Sidebar;
