
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Scene, GameData, GameObject } from '../types';
import { Plus, Minus } from 'lucide-react';


interface SceneMapProps {
  allScenesMap: GameData['scenes'];
  globalObjects: GameData['globalObjects'];
  startSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onUpdateScenePosition: (sceneId: string, x: number, y: number) => void;
  onAddScene: () => void;
}

const NODE_WIDTH = 250;
const NODE_HEADER_HEIGHT = 70;
const THUMBNAIL_HEIGHT = 140; // 16:9 for 250px width is ~140px
const INTERACTION_ITEM_HEIGHT = 36;
const X_GAP = 150;
const Y_GAP = 50;
const INTERACTION_ITEM_MARGIN_Y = 4; // Corresponds to gap-1
const PADDING_BOTTOM = 8; // Corresponds to pb-2
const PADDING_TOP = 4; // Corresponds to gap-1 (4px)
const BORDER_OFFSET = 2; // Compensate for border-2 on nodes

type Node = Scene & { x: number; y: number; level: number; height: number };
type Edge = {
  source: string;
  target: string;
  sourceInteractionId: string;
  sSide: 'L' | 'R';
  tSide: 'L' | 'R';
  sDir: number;
  tDir: number;
};

const SceneMap: React.FC<SceneMapProps> = ({ allScenesMap, globalObjects, startSceneId, onSelectScene, onUpdateScenePosition, onAddScene }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragInfo, setDragInfo] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const { initialNodes, edges, bounds, activeAnchors } = useMemo(() => {
    const nodeData = new Map<string, { height: number }>();
    Object.values(allScenesMap).forEach((scene: Scene) => {
      const linkingInteractions = scene.interactions?.filter(inter => inter.goToScene) || [];
      const interactionsHeight = linkingInteractions.length > 0
        ? (linkingInteractions.length * INTERACTION_ITEM_HEIGHT) + ((linkingInteractions.length - 1) * INTERACTION_ITEM_MARGIN_Y) + PADDING_BOTTOM + PADDING_TOP
        : 0;

      const imagePadding = scene.image ? THUMBNAIL_HEIGHT : 0;
      nodeData.set(scene.id, { height: NODE_HEADER_HEIGHT + imagePadding + interactionsHeight });
    });

    // Position Nodes logic
    const levels = new Map<number, string[]>();
    const visited = new Set<string>();
    const nodeLevels = new Map<string, number>();

    if (startSceneId && allScenesMap[startSceneId]) {
      const queue: { id: string; level: number }[] = [{ id: startSceneId, level: 0 }];
      visited.add(startSceneId);
      while (queue.length > 0) {
        const { id, level } = queue.shift()!;
        nodeLevels.set(id, level);
        if (!levels.has(level)) levels.set(level, []);
        levels.get(level)!.push(id);
        allScenesMap[id].interactions?.forEach(inter => {
          if (inter.goToScene && allScenesMap[inter.goToScene] && !visited.has(inter.goToScene)) {
            visited.add(inter.goToScene);
            queue.push({ id: inter.goToScene, level: level + 1 });
          }
        });
      }
    }

    const unlinkedScenes = Object.keys(allScenesMap).filter(id => !visited.has(id));
    if (unlinkedScenes.length > 0) {
      let unlinkedLevel = levels.size > 0 ? levels.size : 0;
      unlinkedScenes.forEach(id => {
        if (!levels.has(unlinkedLevel)) levels.set(unlinkedLevel, []);
        levels.get(unlinkedLevel)!.push(id);
        nodeLevels.set(id, unlinkedLevel);
      });
    }

    const positionedNodes: Node[] = [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    levels.forEach((levelScenes, level) => {
      const calculatedX = level * (NODE_WIDTH + X_GAP);
      const levelHeight = levelScenes.reduce((sum, id) => sum + (nodeData.get(id)?.height || 0) + Y_GAP, 0) - Y_GAP;
      let currentY = -levelHeight / 2;

      levelScenes.forEach((id) => {
        const scene = allScenesMap[id];
        const { height } = nodeData.get(id)!;
        const x = scene.mapX ?? calculatedX;
        const y = scene.mapY ?? currentY;
        positionedNodes.push({ ...scene, x, y, level: nodeLevels.get(id)!, height });
        if (scene.mapY === undefined) currentY += height + Y_GAP;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x + NODE_WIDTH);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y + height);
      });
    });

    const createdEdges: Edge[] = [];
    const activeAnchors = new Set<string>();

    Object.values(allScenesMap).forEach((scene: Scene) => {
      const sourcePos = positionedNodes.find(n => n.id === scene.id);
      if (!sourcePos) return;

      const linkingInteractions = scene.interactions?.filter(inter => inter.goToScene && allScenesMap[inter.goToScene]) || [];

      linkingInteractions.forEach((inter) => {
        const targetPos = positionedNodes.find(n => n.id === inter.goToScene);
        if (!targetPos) return;

        const interactionIndex = linkingInteractions.findIndex(i => i.id === inter.id);
        const imagePadding = scene.image ? THUMBNAIL_HEIGHT : 0;

        // Calculate center of the interaction output circle
        const y1_offset = NODE_HEADER_HEIGHT + imagePadding + PADDING_TOP + (interactionIndex * (INTERACTION_ITEM_HEIGHT + INTERACTION_ITEM_MARGIN_Y)) + (INTERACTION_ITEM_HEIGHT / 2);
        // Calculate center of the target node input circle (header center)
        const y2_offset = NODE_HEADER_HEIGHT / 2;

        const sL = { x: sourcePos.x, y: sourcePos.y + y1_offset };
        const sR = { x: sourcePos.x + NODE_WIDTH, y: sourcePos.y + y1_offset };
        const tL = { x: targetPos.x, y: targetPos.y + y2_offset };
        const tR = { x: targetPos.x + NODE_WIDTH, y: targetPos.y + y2_offset };

        const combinations = [
          { s: sR, t: tL, sSide: 'R' as const, tSide: 'L' as const, sDir: 1, tDir: -1 },
          { s: sL, t: tR, sSide: 'L' as const, tSide: 'R' as const, sDir: -1, tDir: 1 },
          { s: sR, t: tR, sSide: 'R' as const, tSide: 'R' as const, sDir: 1, tDir: 1 },
          { s: sL, t: tL, sSide: 'L' as const, tSide: 'L' as const, sDir: -1, tDir: -1 }
        ];

        const best = combinations.reduce((prev, curr) => {
          const dist = Math.sqrt(Math.pow(curr.t.x - curr.s.x, 2) + Math.pow(curr.t.y - curr.s.y, 2));
          const prevDist = Math.sqrt(Math.pow(prev.t.x - prev.s.x, 2) + Math.pow(prev.t.y - prev.s.y, 2));
          return dist < prevDist ? curr : prev;
        });

        createdEdges.push({
          source: scene.id,
          target: inter.goToScene!,
          sourceInteractionId: inter.id,
          sSide: best.sSide,
          tSide: best.tSide,
          sDir: best.sDir,
          tDir: best.tDir
        });

        activeAnchors.add(`${inter.id}-${best.sSide}`);
        activeAnchors.add(`${inter.goToScene}-${best.tSide}`);
      });
    });

    return {
      initialNodes: positionedNodes,
      edges: createdEdges,
      bounds: { minX: minX === Infinity ? 0 : minX, minY: minY === Infinity ? 0 : minY, maxX: maxX === -Infinity ? NODE_WIDTH : maxX, maxY: maxY === -Infinity ? NODE_HEADER_HEIGHT : maxY },
      activeAnchors
    };
  }, [allScenesMap, startSceneId]);

  const [nodes, setNodes] = useState(initialNodes);

  useEffect(() => {
    if (!dragInfo) setNodes(initialNodes);
  }, [initialNodes, dragInfo]);

  useEffect(() => {
    if (containerRef.current && initialNodes.length > 0) {
      const { width } = containerRef.current.getBoundingClientRect();
      setView(v => ({ ...v, x: (width - bounds.maxX) / 2, y: Y_GAP * 2 }));
    }
  }, []);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    if (!containerRef.current) return;
    const newScale = Math.max(0.2, Math.min(2, direction === 'in' ? view.scale * 1.2 : view.scale / 1.2));
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newX = centerX - (centerX - view.x) * (newScale / view.scale);
    const newY = centerY - (centerY - view.y) * (newScale / view.scale);
    setView({ x: newX, y: newY, scale: newScale });
  }, [view]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY < 0 ? 'in' : 'out');
  }, [handleZoom]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - view.x, y: e.clientY - view.y });
  }, [view.x, view.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragInfo) {
      const newX = (e.clientX - view.x) / view.scale - dragInfo.offsetX;
      const newY = (e.clientY - view.y) / view.scale - dragInfo.offsetY;
      setNodes(currentNodes => currentNodes.map(n => n.id === dragInfo.id ? { ...n, x: newX, y: newY } : n));
    } else if (isPanning) {
      setView(v => ({ ...v, x: e.clientX - panStart.x, y: e.clientY - panStart.y }));
    }
  }, [isPanning, panStart, dragInfo, view.x, view.y, view.scale]);

  const handleMouseUp = useCallback(() => {
    if (dragInfo) {
      const finalNode = nodes.find(n => n.id === dragInfo.id);
      if (finalNode) onUpdateScenePosition(finalNode.id, finalNode.x, finalNode.y);
      setDragInfo(null);
    }
    setIsPanning(false);
  }, [dragInfo, nodes, onUpdateScenePosition]);

  return (
    <div className="h-full flex flex-col relative">
      <div className="mb-4 flex-shrink-0">
        <p className="text-zinc-500 mt-1 text-sm font-medium">
          Visualize e organize a estrutura do seu jogo. Arraste as cenas para reposicioná-las e clique para editá-las.
        </p>
      </div>
      <div
        ref={containerRef}
        className={`w-full h-full bg-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden ${isPanning || dragInfo ? 'cursor-grabbing' : 'cursor-grab'} shadow-inner`}
        style={{ backgroundImage: 'radial-gradient(rgba(168,85,247,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="transition-transform duration-100"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        >
          <svg className="absolute" width={bounds.maxX - bounds.minX + NODE_WIDTH + X_GAP * 4} height={bounds.maxY - bounds.minY + Y_GAP * 4} style={{ transform: `translate(${bounds.minX}px, ${bounds.minY}px)`, zIndex: 0 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" fillOpacity="0.8" />
              </marker>
            </defs>
            {edges.map((edge, i) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const linkingInteractions = sourceNode.interactions.filter(inter => inter.goToScene);
              const interactionIndex = linkingInteractions.findIndex(inter => inter.id === edge.sourceInteractionId);
              const imagePadding = sourceNode.image ? THUMBNAIL_HEIGHT : 0;

              const y1_offset = NODE_HEADER_HEIGHT + imagePadding + PADDING_TOP + (interactionIndex * (INTERACTION_ITEM_HEIGHT + INTERACTION_ITEM_MARGIN_Y)) + (INTERACTION_ITEM_HEIGHT / 2);
              const y2_offset = NODE_HEADER_HEIGHT / 2;

              const x1 = (edge.sSide === 'L' ? sourceNode.x : sourceNode.x + NODE_WIDTH) - bounds.minX;
              const y1 = sourceNode.y + y1_offset - bounds.minY;

              const x2 = (edge.tSide === 'L' ? targetNode.x : targetNode.x + NODE_WIDTH) - bounds.minX;
              const y2 = targetNode.y + y2_offset - bounds.minY;

              const dx = Math.abs(x2 - x1);
              const dy = Math.abs(y2 - y1);
              const offset = Math.max(50, Math.min(150, dx * 0.5 + dy * 0.2));
              const cx1 = x1 + (offset * edge.sDir);
              const cx2 = x2 + (offset * edge.tDir);

              return (
                <path
                  key={`${edge.source}-${edge.target}-${i}`}
                  d={`M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`}
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeOpacity="0.4"
                  fill="none"
                  markerEnd="url(#arrow)"
                />
              );
            })}
          </svg>

          {nodes.map(node => {
            const linkingInteractions = node.interactions.filter(inter => inter.goToScene && allScenesMap[inter.goToScene]);
            const borderColorClass = node.id === startSceneId ? 'border-purple-500' : node.isEndingScene ? 'border-zinc-100' : node.removesChanceOnEntry ? 'border-red-500' : node.restoresChanceOnEntry ? 'border-green-500' : 'border-zinc-800/80';

            return (
              <div
                key={node.id}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const nodeRef = nodes.find(n => n.id === node.id);
                  if (!nodeRef) return;
                  dragStartPos.current = { x: e.clientX, y: e.clientY };
                  setDragInfo({ id: node.id, offsetX: (e.clientX - view.x) / view.scale - nodeRef.x, offsetY: (e.clientY - view.y) / view.scale - nodeRef.y });
                }}
                onClick={(e) => {
                  if (Math.sqrt(Math.pow(e.clientX - dragStartPos.current.x, 2) + Math.pow(e.clientY - dragStartPos.current.y, 2)) < 5) onSelectScene(node.id);
                }}
                className={`absolute bg-zinc-900 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-300 border-2 ${borderColorClass} cursor-pointer hover:border-purple-400 hover:shadow-purple-500/10 overflow-hidden group`}
                style={{ width: NODE_WIDTH, transform: `translate(${node.x}px, ${node.y}px)`, height: node.height, userSelect: 'none' }}
              >
                <div className="p-3 relative flex-shrink-0 text-center bg-zinc-900/50" style={{ height: NODE_HEADER_HEIGHT }}>
                  {/* Removido o node no canto superior esquerdo da cena inicial conforme solicitado */}
                  {node.id !== startSceneId && (
                    <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${node.id}-L`) ? 'bg-purple-500 border-purple-400' : 'bg-zinc-950 border-zinc-700'}`} />
                  )}
                  <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${node.id}-R`) ? 'bg-purple-500 border-purple-400' : 'bg-zinc-950 border-zinc-700'}`} />
                  <h3 className="font-bold text-zinc-100 truncate text-sm">{node.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">(ID: {node.id})</p>
                  {node.id === startSceneId && <p className="text-[10px] font-bold text-purple-400 mt-1 uppercase tracking-widest">Início</p>}
                  {node.isEndingScene && <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Fim de Jogo</p>}
                </div>

                {node.image && (
                  <div
                    className="w-full bg-black flex-shrink-0"
                    style={{ height: THUMBNAIL_HEIGHT }}
                  >
                    <img
                      src={node.image}
                      alt={node.name}
                      className="w-full h-full object-cover opacity-80"
                      style={{ pointerEvents: 'none' }}
                    />
                  </div>
                )}

                {linkingInteractions.length > 0 && (
                  <div className="flex flex-col gap-1 pt-1 pb-2 border-t border-zinc-800/50">
                    {linkingInteractions.map(inter => {
                      const actionText = inter.verbs?.[0] || 'Ação';
                      const reqObj = inter.requiresInInventory ? globalObjects[inter.requiresInInventory] : null;
                      const targetObj = inter.target ? globalObjects[inter.target] : null;

                      const displayLabel = `${actionText}${reqObj ? ' ' + reqObj.name : ''}${targetObj ? ' ' + targetObj.name : ''}`;

                      return (
                        <div key={inter.id} className="relative bg-purple-500/5 text-purple-400 font-bold py-1 flex items-center w-full" style={{ height: INTERACTION_ITEM_HEIGHT }}>
                          <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${inter.id}-L`) ? 'bg-purple-500 border-purple-400' : 'bg-zinc-950 border-zinc-700'}`} />
                          <span className="truncate px-4 text-center w-full text-[10px] uppercase tracking-wider" title={displayLabel}>{displayLabel}</span>
                          <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${inter.id}-R`) ? 'bg-purple-500 border-purple-400' : 'bg-zinc-950 border-zinc-700'}`} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3">
        <button onClick={onAddScene} className="flex items-center px-4 py-2 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest"><Plus className="w-4 h-4 mr-2" />Nova Cena</button>
      </div>
      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-4 pointer-events-none">
        <div className="bg-zinc-950/80 backdrop-blur-md p-4 rounded-xl border border-zinc-800 shadow-xl pointer-events-auto">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Legenda</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border-2 border-purple-500 bg-purple-500/20"></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Cena Inicial</span></li>
            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border-2 border-zinc-100 bg-zinc-100/20"></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Fim de Jogo</span></li>
            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-red-500/20"></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Remove Chance</span></li>
            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 bg-green-500/20"></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Restaura Chance</span></li>
          </ul>
        </div>
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-xl pointer-events-auto">
          <button onClick={() => handleZoom('in')} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all border-r border-zinc-800"><Plus className="w-4 h-4" /></button>
          <button onClick={() => handleZoom('out')} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"><Minus className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

export default SceneMap;
