// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef, CSSProperties, useState, useMemo, useCallback } from 'react';
import { Scene, View } from '../types';
import { Trash2, Menu, ArrowRight, Search, Split, Map } from 'lucide-react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useTranslation } from 'react-i18next';

interface SceneListProps {
  scenes: Scene[];
  startSceneId: string;
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onAddNode?: (type: 'scene' | 'vignette') => void;
  hasOpeningVignette?: boolean;
  onViewMap?: () => void;
  onDeleteScene: (id: string) => void;
  onReorderScenes: (newOrder: string[]) => void;
  isDirty?: boolean;
  theme?: string;
  currentView?: View;
  isLateralMenu?: boolean;
}

interface SceneRowData {
  filteredScenes: Scene[];
  searchTerm: string;
  startSceneId: string;
  selectedSceneId: string | null;
  currentView: View | undefined;
  isDirty: boolean | undefined;
  isLateralMenu: boolean | undefined;
  onSelectScene: (id: string) => void;
  onDeleteScene: (id: string) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, position: number) => void;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>, position: number) => void;
  handleDragEnd: () => void;
  t: any;
}

const SceneRow = React.memo(({ index, style, data }: ListChildComponentProps<SceneRowData>) => {
  const {
    filteredScenes, searchTerm, startSceneId, selectedSceneId, currentView,
    isDirty, isLateralMenu, onSelectScene, onDeleteScene, handleDragStart,
    handleDragEnter, handleDragEnd, t
  } = data;

  const scene = filteredScenes[index];
  if (!scene) return null;

  const isDraggable = !searchTerm && scene.id !== startSceneId;

  const getVignetteLabel = (scene: Scene) => {
    if (!scene.vignetteType || scene.vignetteType === 'none' || scene.vignetteType === 'opening') return null;
    
    const isTransition = scene.vignetteType === 'transition';
    const label = isTransition 
      ? t('sceneEditor.vignetteTypes.transition', 'Transição')
      : t('sceneEditor.vignetteTypes.conclusion', 'Conclusão');

    const isSelected = selectedSceneId === scene.id && currentView === 'scenes';

    let colorClasses = '';
    if (isLateralMenu && isSelected) {
      colorClasses = 'bg-primary-foreground text-primary border-primary-foreground/50';
    } else if (isSelected && isDirty) {
      colorClasses = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    } else {
      colorClasses = 'bg-primary text-primary-foreground border-primary/50';
    }

    return (
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${colorClasses}`}>
        {label}
      </span>
    );
  };

  return (
    <div style={style}>
      <div
        onClick={() => onSelectScene(scene.id)}
        className={`${scene.id !== startSceneId ? 'group' : ''} relative flex items-center transition-all overflow-hidden cursor-pointer h-[42px] ${
            isLateralMenu 
              ? selectedSceneId === scene.id && currentView === 'scenes'
                  ? `bg-primary text-primary-foreground font-bold shadow-md rounded-l-lg rounded-r-none` // Selected: 100% opaque primary
                  : `text-foreground hover:bg-primary/10 hover:shadow-sm rounded-lg mr-2` // Unselected: normal text, subtle primary hover
              : selectedSceneId === scene.id && currentView === 'scenes'
                  ? isDirty
                      ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold rounded-lg'
                      : 'bg-primary/20 text-primary border border-primary/30 rounded-lg'
                  : 'hover:bg-muted/50 border border-transparent rounded-lg'
        }`}
        onDragStart={(e) => !searchTerm && scene.id !== startSceneId && handleDragStart(e, index)}
        onDragEnter={(e) => !searchTerm && scene.id !== startSceneId && handleDragEnter(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => e.preventDefault()}
        draggable={!searchTerm && scene.id !== startSceneId}
      >
        <div className={`flex items-center flex-grow p-2`}>
          {/* Always reserve space for the icon to ensure alignment */}
          {scene.id !== startSceneId && (
            <Menu
              className={`w-4 h-4 mr-2 flex-shrink-0 ${isDraggable ? 'cursor-move' : 'cursor-default opacity-50'} ${
                 isLateralMenu 
                   ? selectedSceneId === scene.id && currentView === 'scenes' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                   : selectedSceneId === scene.id && currentView === 'scenes' 
                      ? (isDirty ? 'text-yellow-500' : 'text-primary') 
                      : 'text-muted-foreground'
              }`}
            />
          )}

          <div className="flex items-center justify-between w-full min-w-0">
            <span className="truncate font-medium text-xs">{scene.name}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              {getVignetteLabel(scene)}
              {startSceneId === scene.id && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                     isLateralMenu 
                       ? selectedSceneId === scene.id && currentView === 'scenes'
                          ? 'bg-primary-foreground text-primary border-primary-foreground/50' 
                          : 'bg-primary text-primary-foreground border-primary/50'                
                       : selectedSceneId === scene.id && currentView === 'scenes'
                          ? isDirty
                            ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                            : 'bg-primary text-primary-foreground border-primary/50' // Active Selected Start
                          : 'bg-primary text-primary-foreground border-primary/50' // Inactive Start
                  }`}
                >
                  {t('sceneList.start', 'Início')}
                </span>
              )}
            </div>
          </div>
        </div>

        {startSceneId !== scene.id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteScene(scene.id);
            }}
            className={`absolute top-0 right-0 h-full w-12 flex items-center justify-center text-white transform translate-x-full group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20 cursor-pointer ${
              isLateralMenu 
                ? selectedSceneId === scene.id && currentView === 'scenes'
                  ? 'bg-red-500 rounded-none' // flush with right edge
                  : 'bg-red-500 rounded-r-lg' // match the rounded-lg of container
                : 'bg-red-500 rounded-r-lg' 
            }`}
            title={t('sceneList.deleteScene', 'Deletar cena')}
          >
            <Trash2 className="w-5 h-5 pointer-events-none" />
          </button>
        )}
      </div>
    </div>
  );
});
SceneRow.displayName = 'SceneRow';

const SceneList: React.FC<SceneListProps> = ({
  scenes,
  startSceneId,
  selectedSceneId,
  onSelectScene,
  onAddScene,
  onAddNode,
  hasOpeningVignette = false,
  onViewMap,
  onDeleteScene,
  onReorderScenes,
  isDirty,
  theme = 'dark',
  currentView,
  isLateralMenu,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const listRef = useRef<List | null>(null);

  const filteredScenes = useMemo(() => {
    // First, identify all scenes matching search criteria
    let matchingScenes = scenes;
    if (searchTerm) {
      matchingScenes = scenes.filter(
        (scene) =>
          scene.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scene.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Then, separate the 'opening' vignette from the rest
    const openingIndex = matchingScenes.findIndex((s) => s.vignetteType === 'opening');
    if (openingIndex > -1) {
      const openingVignette = matchingScenes[openingIndex];
      const restScenes = [...matchingScenes];
      restScenes.splice(openingIndex, 1);
      return [openingVignette, ...restScenes];
    }

    return matchingScenes;
  }, [scenes, searchTerm]);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, position: number) => {
    // Prevent dragging the opening vignette (index 0 if it exists)
    const scene = filteredScenes[position];
    if (scene && scene.vignetteType === 'opening') return e.preventDefault();

    dragItem.current = position;
    e.dataTransfer.effectAllowed = 'move';
  }, [filteredScenes]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    const list = scenes.map((s) => s.id);
    const dragItemContent = list[dragItem.current!];
    if (dragItemContent === list[position]) return;

    // Check if the target is the opening vignette or above it
    const targetScene = filteredScenes[position];
    if (targetScene && targetScene.vignetteType === 'opening') return;

    list.splice(dragItem.current!, 1);
    list.splice(dragOverItem.current!, 0, dragItemContent);
    dragItem.current = dragOverItem.current;

    // Optimistic update
    onReorderScenes(list);
  }, [filteredScenes, scenes, onReorderScenes]);

  const handleDragEnd = useCallback(() => {
    dragItem.current = null;
    dragOverItem.current = null;
  }, []);

  const getAddButtonClass = () => {
    const baseClass =
      'w-full flex items-center justify-start px-2 h-[42px] font-bold rounded-lg transition-all active:scale-95 text-xs border border-transparent mt-2 flex-shrink-0';

    // Default / Dark
    return `${baseClass} bg-white text-zinc-950 hover:bg-zinc-200`;
  };

  const itemData = useMemo<SceneRowData>(() => ({
    filteredScenes,
    searchTerm,
    startSceneId,
    selectedSceneId,
    currentView,
    isDirty,
    isLateralMenu,
    onSelectScene,
    onDeleteScene,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    t
  }), [
    filteredScenes, searchTerm, startSceneId, selectedSceneId, currentView,
    isDirty, isLateralMenu, onSelectScene, onDeleteScene, handleDragStart,
    handleDragEnter, handleDragEnd, t
  ]);

  return (
    <div className={`flex flex-col gap-0 h-full`}>
      {/* View Map Button */}
      {isLateralMenu && (
        <div className={`relative flex-shrink-0 mb-4 mt-2 px-2`}>
          <button
            onClick={() => onViewMap?.()}
            className={`flex items-center gap-3 w-full text-xs transition-colors ${
              currentView === 'map'
                ? `text-primary font-bold`
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Map className="w-4 h-4 flex-shrink-0" />
            <span className="truncate flex-1 text-left">{t('sceneList.viewMap', 'Ver mapa de cenas')}</span>
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className={`relative flex-shrink-0 mb-3 ${isLateralMenu ? 'mr-2' : ''}`}>
        <Search className={`absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
        <input
          type="text"
          placeholder={t('sceneList.search', 'Buscar...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-8 pr-2 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-[42px] ${
            isLateralMenu 
              ? 'bg-background/50 text-foreground placeholder-muted-foreground border border-primary/50 focus:border-primary focus:bg-background' 
              : 'bg-input text-foreground border border-muted-foreground/50'
          }`}
        />
      </div>

      <div className="flex-grow min-h-0">
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => {
            const itemSize = 42; // Fixed row height
            const buttonHeight = 32; // Approx height of add button
            const margins = 32; // mt-2 (8px) + mb-6 (24px)
            const contentHeight = filteredScenes.length * itemSize;

            // Calculate maximum space available for the list
            // We reserve space for the button if the container is full
            const maxListHeight = height - buttonHeight - margins;

            // Actual list height is content height, capped at max available
            const listHeight = Math.max(0, Math.min(contentHeight, maxListHeight));

            if (height === 0 || width === 0) return null;

            return (
              <div style={{ height, width }} className="flex flex-col">
                <div style={{ height: listHeight, width: '100%' }}>
                  <List
                    height={listHeight}
                    itemCount={filteredScenes.length}
                    itemSize={42}
                    width="100%"
                    ref={listRef}
                    itemData={itemData}
                    className="scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                  >
                    {SceneRow}
                  </List>
                </div>
                
                {/* Creation Buttons */}
                <div className={`flex gap-2 mt-2 mb-6 px-1 flex-shrink-0 ${isLateralMenu ? 'mr-2' : ''}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddNode?.('vignette');
                    }}
                    className={`${getAddButtonClass()} flex-1 h-[32px] px-2 text-[11px] min-h-0 w-auto justify-center`}
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-1.5 currentColor" />
                    {t('sceneList.nodeSelection.vignette.title', 'Criar Vinheta')}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasOpeningVignette) onAddNode?.('scene');
                    }}
                    disabled={!hasOpeningVignette}
                    title={
                      !hasOpeningVignette
                        ? t(
                            'sceneList.nodeSelection.scene.lockedDesc',
                            'Crie uma vinheta de abertura para habilitar cenas.'
                          )
                        : ''
                    }
                    className={`${getAddButtonClass()} flex-1 h-[32px] px-2 text-[11px] min-h-0 w-auto justify-center ${
                      !hasOpeningVignette ? 'opacity-50 cursor-not-allowed grayscale' : ''
                    }`}
                  >
                    <Split className="w-3.5 h-3.5 mr-1.5 currentColor" />
                    {t('sceneList.nodeSelection.scene.title', 'Criar Cena')}
                  </button>
                </div>
              </div>
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
};

export default SceneList;
