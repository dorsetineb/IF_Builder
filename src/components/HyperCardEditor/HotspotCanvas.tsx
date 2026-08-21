import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CardHotspot, HotspotShape, HyperCard } from '../../types';
import { generateUniqueId } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { HOTSPOT_ICONS } from './HotspotInspector';
import {
  MousePointer,
  Square,
  Circle,
  Shapes,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Edit3,
  Trash2,
  Copy,
  Eye,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

interface HotspotCanvasProps {
  card: HyperCard;
  onUpdateCard: (updatedCard: HyperCard) => void;
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspotId: string | null) => void;
  onUploadImage: (file: File) => void;
  onTestNavigateCard?: (cardId: string) => void;
  onTestNavigateScene?: (sceneId: string) => void;
  onTestExamine?: (title?: string, text?: string, image?: string) => void;
  onTestSound?: (soundUrl?: string) => void;
}

type DrawTool = 'select' | 'rect' | 'circle' | 'polygon';

export const HotspotCanvas: React.FC<HotspotCanvasProps> = ({
  card,
  onUpdateCard,
  selectedHotspotId,
  onSelectHotspot,
  onUploadImage,
  onTestNavigateCard,
  onTestNavigateScene,
  onTestExamine,
  onTestSound,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [tool, setTool] = useState<DrawTool>('select');
  const [isTestMode, setIsTestMode] = useState(false);
  const [revealedInTest, setRevealedInTest] = useState(false);

  // Zoom & Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentDrawBox, setCurrentDrawBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  // Polygon creation points & dynamic cursor tracking
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isNearPolygonStart, setIsNearPolygonStart] = useState(false);

  // Dragging / Resizing Hotspot
  const [dragAction, setDragAction] = useState<{
    type: 'move' | 'resize';
    handle?: string;
    hotspotId: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialW: number;
    initialH: number;
  } | null>(null);

  // Hovered Hotspot in test mode
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);

  // Convert client coordinates to percentage (0-100) relative to image element
  const getRelativeCoords = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    const rect = imageRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedHotspotId && !isTestMode) {
          const updated = card.hotspots.filter(h => h.id !== selectedHotspotId);
          onUpdateCard({ ...card, hotspots: updated });
          onSelectHotspot(null);
        }
      } else if (e.key === 'Escape') {
        if (tool === 'polygon') {
          setPolygonPoints([]);
          setTool('select');
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        if (isTestMode) {
          setRevealedInTest(prev => !prev);
        }
      } else if (e.key.toLowerCase() === 'r') {
        setTool('rect');
        setIsTestMode(false);
      } else if (e.key.toLowerCase() === 'c') {
        setTool('circle');
        setIsTestMode(false);
      } else if (e.key.toLowerCase() === 'p') {
        setTool('polygon');
        setIsTestMode(false);
      } else if (e.key.toLowerCase() === 'v') {
        setTool('select');
        setIsTestMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, selectedHotspotId, isTestMode, onUpdateCard, onSelectHotspot, tool]);

  // Finish polygon drawing
  const finishPolygon = useCallback((pointsToFinish?: { x: number; y: number }[]) => {
    const pts = pointsToFinish || polygonPoints;
    if (pts.length < 3) {
      setPolygonPoints([]);
      return;
    }

    // Compute bounding box
    const xs = pts.map(p => p.x);
    const ys = pts.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const newHotspot: CardHotspot = {
      id: generateUniqueId('hot', card.hotspots.map(h => h.id)),
      title: `${t('hypercard.hotspotDefault', 'Área')} ${card.hotspots.length + 1}`,
      shape: 'polygon',
      x: minX,
      y: minY,
      width: Math.max(1, maxX - minX),
      height: Math.max(1, maxY - minY),
      points: pts,
      highlightStyle: 'hover-glow',
      cursor: 'pointer',
      actionType: 'examine',
      examineTitle: t('hypercard.examineTitleDefault', 'Examinar'),
      examineText: t('hypercard.examineTextDefault', 'Você observa atentamente este detalhe.')
    };

    onUpdateCard({ ...card, hotspots: [...card.hotspots, newHotspot] });
    onSelectHotspot(newHotspot.id);
    setPolygonPoints([]);
    setIsNearPolygonStart(false);
    setTool('select');
  }, [card, onUpdateCard, onSelectHotspot, polygonPoints, t]);

  // Handle Mouse Down on Canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    // Space or Middle Click or Alt+Click to Pan
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      return;
    }

    if (isTestMode) return;

    const coords = getRelativeCoords(e);

    if (tool === 'select') {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-hotspot-id]') && !target.closest('[data-resize-handle]')) {
        onSelectHotspot(null);
      }
      return;
    }

    if (tool === 'rect' || tool === 'circle') {
      setIsDrawing(true);
      setDrawStart(coords);
      setCurrentDrawBox({ x: coords.x, y: coords.y, width: 0, height: 0 });
    } else if (tool === 'polygon') {
      // If clicking near first point, close polygon
      if (polygonPoints.length >= 3) {
        const first = polygonPoints[0];
        const dist = Math.hypot(coords.x - first.x, coords.y - first.y);
        if (dist < 4) {
          finishPolygon();
          return;
        }
      }
      setPolygonPoints(prev => [...prev, coords]);
    }
  };

  // Handle Double Click for Polygon to finish
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (tool === 'polygon' && polygonPoints.length >= 3) {
      e.stopPropagation();
      finishPolygon();
    }
  };

  // Handle Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
      return;
    }

    const coords = getRelativeCoords(e);

    if (tool === 'polygon' && polygonPoints.length > 0) {
      setCurrentMousePos(coords);
      if (polygonPoints.length >= 3) {
        const first = polygonPoints[0];
        const dist = Math.hypot(coords.x - first.x, coords.y - first.y);
        setIsNearPolygonStart(dist < 4);
      } else {
        setIsNearPolygonStart(false);
      }
    }

    if (dragAction) {
      const dx = coords.x - dragAction.startX;
      const dy = coords.y - dragAction.startY;

      const hotspot = card.hotspots.find(h => h.id === dragAction.hotspotId);
      if (!hotspot) return;

      if (dragAction.type === 'move') {
        const newX = Math.max(0, Math.min(100 - hotspot.width, dragAction.initialX + dx));
        const newY = Math.max(0, Math.min(100 - hotspot.height, dragAction.initialY + dy));
        
        let newPoints = hotspot.points;
        if (hotspot.shape === 'polygon' && hotspot.points) {
          const shiftX = newX - hotspot.x;
          const shiftY = newY - hotspot.y;
          newPoints = hotspot.points.map(p => ({ x: p.x + shiftX, y: p.y + shiftY }));
        }

        const updatedHotspots = card.hotspots.map(h =>
          h.id === hotspot.id ? { ...h, x: newX, y: newY, points: newPoints } : h
        );
        onUpdateCard({ ...card, hotspots: updatedHotspots });
      } else if (dragAction.type === 'resize' && dragAction.handle) {
        let newX = dragAction.initialX;
        let newY = dragAction.initialY;
        let newW = dragAction.initialW;
        let newH = dragAction.initialH;

        if (dragAction.handle.includes('e')) {
          newW = Math.max(2, Math.min(100 - dragAction.initialX, dragAction.initialW + dx));
        }
        if (dragAction.handle.includes('s')) {
          newH = Math.max(2, Math.min(100 - dragAction.initialY, dragAction.initialH + dy));
        }
        if (dragAction.handle.includes('w')) {
          const possibleW = dragAction.initialW - dx;
          if (possibleW >= 2) {
            newX = Math.max(0, dragAction.initialX + dx);
            newW = possibleW;
          }
        }
        if (dragAction.handle.includes('n')) {
          const possibleH = dragAction.initialH - dy;
          if (possibleH >= 2) {
            newY = Math.max(0, dragAction.initialY + dy);
            newH = possibleH;
          }
        }

        const updatedHotspots = card.hotspots.map(h =>
          h.id === hotspot.id ? { ...h, x: newX, y: newY, width: newW, height: newH } : h
        );
        onUpdateCard({ ...card, hotspots: updatedHotspots });
      }
      return;
    }

    if (isDrawing && drawStart) {
      const minX = Math.min(drawStart.x, coords.x);
      const minY = Math.min(drawStart.y, coords.y);
      const width = Math.abs(coords.x - drawStart.x);
      const height = Math.abs(coords.y - drawStart.y);

      setCurrentDrawBox({ x: minX, y: minY, width, height });
    }
  };

  // Handle Mouse Up
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (dragAction) {
      setDragAction(null);
      return;
    }

    if (isDrawing && currentDrawBox && (tool === 'rect' || tool === 'circle')) {
      if (currentDrawBox.width > 2 && currentDrawBox.height > 2) {
        const newHotspot: CardHotspot = {
          id: generateUniqueId('hot', card.hotspots.map(h => h.id)),
          title: `${t('hypercard.hotspotDefault', 'Área')} ${card.hotspots.length + 1}`,
          shape: tool as HotspotShape,
          x: currentDrawBox.x,
          y: currentDrawBox.y,
          width: currentDrawBox.width,
          height: currentDrawBox.height,
          highlightStyle: 'hover-glow',
          cursor: 'pointer',
          actionType: 'examine',
          examineTitle: t('hypercard.examineTitleDefault', 'Examinar'),
          examineText: t('hypercard.examineTextDefault', 'Você observa atentamente este detalhe.')
        };

        onUpdateCard({ ...card, hotspots: [...card.hotspots, newHotspot] });
        onSelectHotspot(newHotspot.id);
      }
      setIsDrawing(false);
      setDrawStart(null);
      setCurrentDrawBox(null);
      setTool('select');
    }
  };

  // Handle Hotspot Click in Test Mode
  const handleHotspotTestClick = (hotspot: CardHotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTestMode) return;

    if (hotspot.soundEffect && onTestSound) {
      onTestSound(hotspot.soundEffect);
    }

    if (hotspot.actionType === 'navigate_card' && hotspot.targetCardId && onTestNavigateCard) {
      onTestNavigateCard(hotspot.targetCardId);
    } else if (hotspot.actionType === 'navigate_scene' && hotspot.targetSceneId && onTestNavigateScene) {
      onTestNavigateScene(hotspot.targetSceneId);
    } else if (hotspot.actionType === 'examine' && onTestExamine) {
      onTestExamine(hotspot.examineTitle, hotspot.examineText, hotspot.examineImage);
    }
  };

  const selectedHotspot = card.hotspots.find(h => h.id === selectedHotspotId);

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden select-none">
      {/* ========================================================================= */}
      {/* FLOATING TOP-LEFT TOOLBAR: DRAWING TOOLS                                  */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-1 p-1 rounded-2xl bg-card/90 backdrop-blur-md border border-muted-foreground/30 shadow-xl pointer-events-auto">
        <button
          onClick={() => { setTool('select'); setIsTestMode(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            tool === 'select' && !isTestMode
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          title="Mover e Selecionar (V)"
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('hypercard.tools.select', 'Mover')}</span>
        </button>

        <button
          onClick={() => { setTool('rect'); setIsTestMode(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            tool === 'rect' && !isTestMode
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          title="Retângulo (R)"
        >
          <Square className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('hypercard.tools.rect', 'Retângulo')}</span>
        </button>

        <button
          onClick={() => { setTool('circle'); setIsTestMode(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            tool === 'circle' && !isTestMode
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          title="Círculo (C)"
        >
          <Circle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('hypercard.tools.circle', 'Círculo')}</span>
        </button>

        <button
          onClick={() => { setTool('polygon'); setIsTestMode(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            tool === 'polygon' && !isTestMode
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          title="Polígono Livre (P)"
        >
          <Shapes className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('hypercard.tools.polygon', 'Polígono')}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING TOP-RIGHT TOOLBAR: ZOOM & TEST MODE TOGGLE                       */}
      {/* ========================================================================= */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2 pointer-events-auto">
        {/* Zoom controls */}
        <div className="flex items-center gap-0.5 bg-card/90 backdrop-blur-md p-1 rounded-2xl border border-muted-foreground/30 shadow-xl">
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-muted-foreground px-1.5">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(3, z + 0.2))}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Resetar Posição"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Test Hotspots Toggle Button */}
        <button
          onClick={() => {
            setIsTestMode(prev => !prev);
            onSelectHotspot(null);
            setPolygonPoints([]);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-xl backdrop-blur-md ${
            isTestMode
              ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20'
              : 'bg-card/90 hover:bg-card text-foreground border border-muted-foreground/30'
          }`}
        >
          {isTestMode ? <Edit3 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isTestMode ? t('hypercard.editMode', 'Modo Edição') : t('hypercard.testMode', 'Testar Hotspots')}</span>
        </button>
      </div>

      {/* Polygon Instruction Floating Pill */}
      {tool === 'polygon' && (
        <div className="absolute top-16 left-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/95 border border-primary/40 text-[11px] font-semibold text-primary shadow-xl pointer-events-none animate-in fade-in">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>
            {polygonPoints.length === 0
              ? 'Clique na imagem para iniciar os pontos do polígono'
              : isNearPolygonStart
              ? '🎯 Clique no ponto inicial para FECHAR a área'
              : `${polygonPoints.length} pontos adicionados. Dê duplo clique ou clique no início para fechar`}
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CANVAS DRAWING AREA (FULL-SCREEN FLUID VIEWPORT)                     */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className={`flex-1 overflow-hidden relative flex items-center justify-center p-4 bg-[radial-gradient(#27272a_1.5px,transparent_1.5px)] [background-size:20px_20px] ${
          isPanning ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        {card.image ? (
          <div
            className="relative transition-transform duration-75 shadow-2xl rounded-xl inline-block line-none leading-none overflow-visible"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Background Card Image - EXACT CONTAINER WRAPPER WITH 0px LETTERBOX */}
            <img
              ref={imageRef}
              src={card.image}
              alt={card.name}
              className="max-w-[85vw] max-h-[82vh] w-auto h-auto object-contain rounded-xl select-none pointer-events-none block m-0 p-0"
              draggable={false}
            />

            {/* SVG Overlay Layer - 100% Locked with viewBox 0 0 1000 1000 */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-auto rounded-xl"
              viewBox="0 0 1000 1000"
              preserveAspectRatio="none"
              style={{ overflow: 'visible' }}
            >
              {/* Render Existing Hotspots */}
              {card.hotspots.map((hotspot) => {
                const isSelected = hotspot.id === selectedHotspotId;
                const isHovered = hotspot.id === hoveredHotspotId;

                let strokeColor = 'rgba(16, 185, 129, 0.8)'; // Emerald
                let fillColor = 'rgba(16, 185, 129, 0.18)';
                let strokeDash = '4 3';
                let strokeWidth = 2;
                let isPulsing = false;

                if (isTestMode) {
                  strokeColor = 'transparent';
                  fillColor = 'transparent';
                  strokeDash = 'none';
                } else if (isSelected) {
                  strokeColor = '#3b82f6'; // Blue
                  fillColor = 'rgba(59, 130, 246, 0.35)';
                  strokeWidth = 2;
                  strokeDash = 'none';
                }

                const sx = hotspot.x * 10;
                const sy = hotspot.y * 10;
                const sw = hotspot.width * 10;
                const sh = hotspot.height * 10;

                return (
                  <g
                    key={hotspot.id}
                    data-hotspot-id={hotspot.id}
                    onClick={(e) => {
                      if (isTestMode) {
                        handleHotspotTestClick(hotspot, e);
                      } else {
                        e.stopPropagation();
                        onSelectHotspot(hotspot.id);
                      }
                    }}
                    onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
                    onMouseLeave={() => setHoveredHotspotId(null)}
                    onMouseDown={(e) => {
                      if (isTestMode || tool !== 'select') return;
                      e.stopPropagation();
                      onSelectHotspot(hotspot.id);
                      const coords = getRelativeCoords(e);
                      setDragAction({
                        type: 'move',
                        hotspotId: hotspot.id,
                        startX: coords.x,
                        startY: coords.y,
                        initialX: hotspot.x,
                        initialY: hotspot.y,
                        initialW: hotspot.width,
                        initialH: hotspot.height,
                      });
                    }}
                    className={`cursor-pointer transition-colors ${
                      isPulsing ? 'animate-pulse' : ''
                    }`}
                  >
                    {hotspot.shape === 'rect' && (
                      <rect
                        x={sx}
                        y={sy}
                        width={sw}
                        height={sh}
                        rx="4"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        vectorEffect="non-scaling-stroke"
                      />
                    )}

                    {hotspot.shape === 'circle' && (
                      <ellipse
                        cx={sx + sw / 2}
                        cy={sy + sh / 2}
                        rx={sw / 2}
                        ry={sh / 2}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        vectorEffect="non-scaling-stroke"
                      />
                    )}

                    {hotspot.shape === 'polygon' && hotspot.points && (
                      <polygon
                        points={hotspot.points.map(p => `${p.x * 10},${p.y * 10}`).join(' ')}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                  </g>
                );
              })}

              {/* In-progress drawing preview (Rect / Circle) */}
              {isDrawing && currentDrawBox && (
                <>
                  {tool === 'rect' && (
                    <rect
                      x={currentDrawBox.x * 10}
                      y={currentDrawBox.y * 10}
                      width={currentDrawBox.width * 10}
                      height={currentDrawBox.height * 10}
                      rx="4"
                      fill="rgba(16, 185, 129, 0.3)"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  {tool === 'circle' && (
                    <ellipse
                      cx={(currentDrawBox.x + currentDrawBox.width / 2) * 10}
                      cy={(currentDrawBox.y + currentDrawBox.height / 2) * 10}
                      rx={(currentDrawBox.width / 2) * 10}
                      ry={(currentDrawBox.height / 2) * 10}
                      fill="rgba(16, 185, 129, 0.3)"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </>
              )}

              {/* Polygon creation line preview inside SVG */}
              {tool === 'polygon' && polygonPoints.length > 0 && (
                <g>
                  {/* Filled in-progress polygon preview */}
                  <polygon
                    points={polygonPoints.map(p => `${p.x * 10},${p.y * 10}`).join(' ')}
                    fill="rgba(16, 185, 129, 0.2)"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Connecting lines between placed points */}
                  <polyline
                    points={polygonPoints.map(p => `${p.x * 10},${p.y * 10}`).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Dynamic tracking line to current mouse position */}
                  {currentMousePos && polygonPoints.length > 0 && (
                    <line
                      x1={polygonPoints[polygonPoints.length - 1].x * 10}
                      y1={polygonPoints[polygonPoints.length - 1].y * 10}
                      x2={currentMousePos.x * 10}
                      y2={currentMousePos.y * 10}
                      stroke={isNearPolygonStart ? '#ef4444' : '#10b981'}
                      strokeWidth="2"
                      strokeDasharray="3 2"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </g>
              )}
            </svg>

            {/* Polygon vertex dots rendered as crisp HTML circles (0% distortion) */}
            {tool === 'polygon' && polygonPoints.map((p, idx) => (
              <div
                key={`vertex-${idx}`}
                className={`absolute rounded-full border border-white shadow-md pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-transform ${
                  idx === 0
                    ? isNearPolygonStart
                      ? 'w-4 h-4 bg-amber-400 animate-pulse ring-2 ring-amber-300 z-30 cursor-pointer scale-125'
                      : 'w-3 h-3 bg-red-500 z-20'
                    : 'w-2.5 h-2.5 bg-emerald-500 z-10'
                }`}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                }}
              />
            ))}

            {/* Centered Hotspot Icon Badges (Crisp HTML, 0% Distortion) */}
            {card.hotspots.map((hotspot) => {
              const isSelected = hotspot.id === selectedHotspotId;
              const isHovered = hotspot.id === hoveredHotspotId;
              const isAlwaysVisible =
                hotspot.highlightStyle === 'icons-visible' ||
                hotspot.highlightStyle === 'always-visible' ||
                hotspot.highlightStyle === 'pulsing-pin';
              const isHidden = hotspot.highlightStyle === 'hidden';

              const shouldShow =
                !isTestMode ||
                isAlwaysVisible ||
                (revealedInTest && !isHidden) ||
                (!isHidden && isHovered);

              if (!shouldShow && isTestMode) return null;

              const iconName = hotspot.icon || 'eye';
              const IconComp = HOTSPOT_ICONS.find((i) => i.name === iconName)?.component || Eye;
              const centerX = hotspot.x + hotspot.width / 2;
              const centerY = hotspot.y + hotspot.height / 2;

              return (
                <div
                  key={`center-icon-${hotspot.id}`}
                  className={`absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 rounded-none flex items-center justify-center transition-all duration-150 z-20 ${
                    isTestMode
                      ? 'w-9 h-9'
                      : isSelected
                      ? 'w-8 h-8 ring-2 ring-blue-500 shadow-lg'
                      : 'w-7 h-7 shadow'
                  }`}
                  style={{
                    left: `${centerX}%`,
                    top: `${centerY}%`,
                    backgroundColor: hotspot.hideIconBg ? 'transparent' : (hotspot.iconBgColor || 'rgba(0, 0, 0, 0.75)'),
                    border: hotspot.hideIconBg ? 'none' : `1.5px solid ${hotspot.iconBorderColor || 'rgba(255, 255, 255, 0.3)'}`,
                    color: hotspot.iconColor || (isSelected ? '#ffffff' : '#10b981'),
                    boxShadow: hotspot.hideIconBg ? 'none' : '0 4px 14px rgba(0, 0, 0, 0.5)',
                    opacity: isTestMode && !isAlwaysVisible && !revealedInTest && !isHovered ? 0 : 1,
                  }}
                >
                  <IconComp className={isTestMode ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
                </div>
              );
            })}

            {/* Crisp HTML Label Badges for Hotspots (Never distorted) */}
            {!isTestMode && card.hotspots.map((hotspot) => (
              <div
                key={`badge-${hotspot.id}`}
                className="absolute pointer-events-none z-20 transition-all"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translateY(-100%) translateY(-3px)',
                }}
              >
                <span className="inline-block bg-black/85 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-white/15 whitespace-nowrap">
                  {hotspot.title}
                </span>
              </div>
            ))}

            {/* Resize Handles for Selected Hotspot (in edit mode) */}
            {!isTestMode && selectedHotspot && selectedHotspot.shape !== 'polygon' && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${selectedHotspot.x}%`,
                  top: `${selectedHotspot.y}%`,
                  width: `${selectedHotspot.width}%`,
                  height: `${selectedHotspot.height}%`,
                }}
              >
                {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((handle) => {
                  const isTop = handle.includes('n');
                  const isBottom = handle.includes('s');
                  const isLeft = handle.includes('w');
                  const isRight = handle.includes('e');

                  let left = '50%';
                  let top = '50%';
                  if (isLeft) left = '0%';
                  if (isRight) left = '100%';
                  if (isTop) top = '0%';
                  if (isBottom) top = '100%';

                  return (
                    <div
                      key={handle}
                      data-resize-handle={handle}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const coords = getRelativeCoords(e);
                        setDragAction({
                          type: 'resize',
                          handle,
                          hotspotId: selectedHotspot.id,
                          startX: coords.x,
                          startY: coords.y,
                          initialX: selectedHotspot.x,
                          initialY: selectedHotspot.y,
                          initialW: selectedHotspot.width,
                          initialH: selectedHotspot.height,
                        });
                      }}
                      className="absolute w-2.5 h-2.5 bg-blue-500 border border-white rounded-full pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 shadow-md hover:scale-125 transition-transform"
                      style={{
                        left,
                        top,
                        cursor: `${handle}-resize`,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Empty Card State: Upload Image */
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-muted-foreground/40 rounded-3xl max-w-lg bg-card/40 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 text-primary">
              <ImageIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {t('hypercard.emptyImageTitle', 'Adicione a Imagem deste Cenário')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {t('hypercard.emptyImageDesc', 'Faça upload do cenário visual para desenhar as áreas clicáveis e criar a cena interativa.')}
            </p>
            <label className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer transition-all shadow-lg shadow-primary/20">
              <Upload className="w-4 h-4" />
              <span>{t('hypercard.uploadImageBtn', 'Escolher Imagem')}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onUploadImage(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        )}

        {/* Test Mode Floating Reveal Button */}
        {isTestMode && (
          <button
            onClick={() => setRevealedInTest(prev => !prev)}
            className={`absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-xl backdrop-blur-md transition-all z-30 ${
              revealedInTest
                ? 'bg-primary text-primary-foreground shadow-primary/30'
                : 'bg-black/70 hover:bg-black/90 text-zinc-300 border border-white/20'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{revealedInTest ? t('hypercard.hideZones', 'Ocultar Zonas') : t('hypercard.revealZones', 'Revelar Zonas (Espaço)')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
