// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link } from 'react-router-dom';
import SceneList from './SceneList';
import { Scene, View, GameData } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Code, BookOpen, Map, Box, SlidersHorizontal, Settings, Info, CircleHelp, ChevronLeft, ChevronRight, MessageSquare, Gamepad2, ChevronDown, MonitorPlay, Zap, Command } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onExit, onNavigate, currentView, onSetView, scenes, gameData, isCollapsed, onToggleCollapse, isDirty, theme = 'dark', ...sceneListProps } = props;
  const [isScenesExpanded, setIsScenesExpanded] = useState(false);


  // Sync accordion state with current view
  // Sync accordion state with current view
  useEffect(() => {
    // Only force collapse if we leave scenes/map view.
    // We do NOT force expand anymore, as the user wants it to start closed.
    if (currentView !== 'scenes' && currentView !== 'map') {
      setIsScenesExpanded(false);
    }
  }, [currentView]); // Removed scenes.length dependency

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
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-card border-r border-muted-foreground/50 flex flex-col transition-all duration-300 relative flex-shrink-0 h-full`}>


      <nav className={`flex flex-col gap-1 flex-grow px-3 py-4 ${isScenesExpanded ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
        {/* Community Button - REMOVED AS REQUESTED */}







        {/* Scene Editor - Accordion */}
        <div className={`flex flex-col ${(isScenesExpanded && !isCollapsed) ? 'flex-grow min-h-0' : ''}`}>
          <button
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-xs font-medium group relative overflow-hidden flex-shrink-0 ${isScenesExpanded
              ? `bg-primary text-primary-foreground font-bold shadow-sm`
              : 'text-muted-foreground hover:bg-zinc-800 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0 py-3' : ''}`}
            onClick={handleToggleScenes}
            title={isCollapsed ? t('sidebar.sceneEditor', 'Narrativa') : undefined}
          >
            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${isScenesExpanded ? 'translate-x-0' : ''}`} />

            <BookOpen className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
            {!isCollapsed && (
              <>
                <span className="truncate relative z-10 flex-1 text-left">{t('sidebar.sceneEditor', 'Narrativa')}</span>
                {/* Counter */}
                <span className="bg-black/30 text-white text-[10px] font-bold rounded-md px-1.5 py-0.5 border border-white/20 shadow-sm relative z-10">
                  {scenes.length}
                </span>
                {/* Arrow removed as requested */}
              </>
            )}

            {/* Show tiny counter badge if collapsed */}
            {isCollapsed && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-black/30 text-white rounded-md flex items-center justify-center text-[8px] font-bold border border-white/20 z-20 shadow-sm">
                {scenes.length}
              </div>
            )}
          </button>

          {/* Expanded Content */}
          {(!isCollapsed && isScenesExpanded) && (
            <div className="pl-4 mt-1 mb-2 animate-in slide-in-from-top-2 duration-200 flex-grow min-h-0 flex flex-col">
              <div className="pl-3 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[image:repeating-linear-gradient(to_bottom,var(--primary)_0,var(--primary)_2px,transparent_2px,transparent_10px)] before:opacity-60 flex flex-col gap-1 flex-grow min-h-0">
                <SceneList scenes={scenes} isDirty={isDirty} theme={theme} {...sceneListProps} />

                {/* Map Button inside accordion */}
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs font-medium text-left mt-1 flex-shrink-0 ${currentView === 'map'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:bg-zinc-800 hover:text-white border border-transparent'}`}
                  onClick={() => onSetView('map')}
                >
                  <Map size={14} />
                  <span>{t('sidebar.sceneMap', 'Mapa de Cenas')}</span>
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
            title={isCollapsed ? t('sidebar.objects', 'Objetos') : undefined}
          >
            <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'global_objects' ? 'translate-x-0' : ''}`} />
            <Box className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span className="truncate relative z-10">{t('sidebar.objects', 'Objetos')}</span>}
          </button>
        )}
        <button
          className={getButtonClass('trackers')}
          onClick={() => handleSetView('trackers')}
          title={isCollapsed ? t('sidebar.trackers', 'Rastreadores') : undefined}
        >
          <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'trackers' ? 'translate-x-0' : ''}`} />
          <SlidersHorizontal className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="truncate relative z-10">{t('sidebar.trackers', 'Rastreadores')}</span>}
        </button>

        {(gameData.gameInteractionType || 'parser') !== 'choice' && (
          <button
            className={getButtonClass('global_commands')}
            onClick={() => handleSetView('global_commands')}
            title={isCollapsed ? t('sidebar.globalCommands', 'Comandos Globais') : undefined}
          >
            <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'global_commands' ? 'translate-x-0' : ''}`} />
            <Command className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span className="truncate relative z-10">{t('sidebar.globalCommands', 'Comandos Globais')}</span>}
          </button>
        )}

        {/* Configurações (anteriormente Interface) */}
        <button
          className={getButtonClass('interface')}
          onClick={() => handleSetView('interface')}
          title={isCollapsed ? t('sidebar.settings', 'Configurações') : undefined}
        >
          <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'interface' ? 'translate-x-0' : ''}`} />
          <Settings className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="truncate relative z-10">{t('sidebar.settings', 'Configurações')}</span>}
        </button>



      </nav>

      {/* Bottom Menu Items - Pinned to Bottom */}
      <div className="mt-auto pt-2 pb-4 px-3 flex flex-col gap-1 relative border-t border-muted-foreground/50 bg-card z-20 flex-shrink-0">

        <button
          onClick={() => onSetView('guide')}
          className={getButtonClass('guide')}
          title={isCollapsed ? t('sidebar.quickGuide', 'Guia Rápido') : undefined}
        >
          <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'guide' ? 'translate-x-0' : ''}`} />
          <CircleHelp className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="truncate relative z-10">{t('sidebar.quickGuide', 'Guia Rápido')}</span>}
        </button>

        <button
          onClick={() => handleSetView('about')}
          className={getButtonClass('about')}
          title={isCollapsed ? t('sidebar.aboutProject', 'Sobre o Projeto') : undefined}
        >
          <div className={`absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${currentView === 'about' ? 'translate-x-0' : ''}`} />
          <Zap className={`flex-shrink-0 relative z-10`} size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="truncate relative z-10">{t('sidebar.aboutProject', 'Sobre o Projeto')}</span>}
        </button>


      </div>


    </aside >
  );
};

export default Sidebar;
