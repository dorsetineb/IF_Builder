import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Scene, GameData, GameObject } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

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
const INTERACTION_ITEM_HEIGHT = 36;
const X_GAP = 150;
const Y_GAP = 50;
const INTERACTION_ITEM_MARGIN_Y = 4; // Corresponds to gap-1
const PADDING = 8; // Corresponds to p-2 or py-2
const CONNECTOR_RADIUS = 8; // Half of connector width (w-4)

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
            ? (linkingInteractions.length * INTERACTION_ITEM_HEIGHT) + ((linkingInteractions.length - 1) * INTERACTION_ITEM_MARGIN_Y) + PADDING
            : 0;
        nodeData.set(scene.id, { height: NODE_HEADER_HEIGHT + interactionsHeight });
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
    if(unlinkedScenes.length > 0) {
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
        const autoPlacedScenes = levelScenes.filter(id => allScenesMap[id]?.mapY === undefined);
        const levelHeight = autoPlacedScenes.reduce((sum, id) => sum + (nodeData.get(id)?.height || 0) + Y_GAP, 0) - Y_GAP;
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

    // Edge Calculation with closest anchor selection
    const createdEdges: Edge[] = [];
    const activeAnchors = new Set<string>(); // Format: "id-L" or "id-R"

    Object.values(allScenesMap).forEach((scene: Scene) => {
        const sourcePos = positionedNodes.find(n => n.id === scene.id);
        if (!sourcePos) return;

        const linkingInteractions = scene.interactions?.filter(inter => inter.goToScene && allScenesMap[inter.goToScene]) || [];
        
        linkingInteractions.forEach((inter) => {
            const targetPos = positionedNodes.find(n => n.id === inter.goToScene);
            if (!targetPos) return;

            const interactionIndex = linkingInteractions.findIndex(i => i.id === inter.id);
            const y1_offset = NODE_HEADER_HEIGHT + (interactionIndex * (INTERACTION_ITEM_HEIGHT + INTERACTION_ITEM_MARGIN_Y)) + (INTERACTION_ITEM_HEIGHT / 2);
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
      setView(v => ({...v, x: (width - bounds.maxX) / 2 , y: Y_GAP * 2}));
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
      setView(v => ({ ...v, x: e.clientX - panStart.x, y: e.clientY - panStart.y}));
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
        <p className="text-brand-text-dim mt-1 text-sm">
          Visualize e organize a estrutura do seu jogo. Arraste as cenas para reposicioná-las e clique para editá-las.
        </p>
      </div>
      <div 
        ref={containerRef}
        className={`w-full h-full bg-brand-bg rounded-lg border border-brand-border overflow-hidden ${isPanning || dragInfo ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{backgroundImage: 'radial-gradient(#4a5568 1px, transparent 1px)', backgroundSize: '20px 20px'}}
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
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4fd1c5" />
              </marker>
            </defs>
            {edges.map((edge, i) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const linkingInteractions = sourceNode.interactions.filter(inter => inter.goToScene);
              const interactionIndex = linkingInteractions.findIndex(inter => inter.id === edge.sourceInteractionId);
              const y1_offset = NODE_HEADER_HEIGHT + (interactionIndex * (INTERACTION_ITEM_HEIGHT + INTERACTION_ITEM_MARGIN_Y)) + (INTERACTION_ITEM_HEIGHT / 2);
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
                  stroke="#4fd1c5"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrow)"
                />
              );
            })}
          </svg>
          
          {nodes.map(node => {
            const linkingInteractions = node.interactions.filter(inter => inter.goToScene && allScenesMap[inter.goToScene]);
            const borderColorClass = node.id === startSceneId ? 'border-yellow-400' : node.isEndingScene ? 'border-brand-primary' : node.removesChanceOnEntry ? 'border-red-500' : node.restoresChanceOnEntry ? 'border-white' : 'border-brand-border';

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
                className={`absolute bg-brand-surface rounded-xl shadow-lg flex flex-col transition-all duration-300 border-2 ${borderColorClass} cursor-pointer hover:border-yellow-400 hover:shadow-xl`}
                style={{ width: NODE_WIDTH, transform: `translate(${node.x}px, ${node.y}px)`, height: node.height, userSelect: 'none' }}
              >
                  <div className="p-3 relative flex-shrink-0 text-center" style={{height: NODE_HEADER_HEIGHT}}>
                      <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors ${activeAnchors.has(`${node.id}-L`) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                      <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors ${activeAnchors.has(`${node.id}-R`) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                      <h3 className="font-bold text-brand-text truncate">{node.name}</h3>
                      <p className="text-xs text-brand-text-dim">(ID: {node.id})</p>
                      {node.id === startSceneId && <p className="text-xs font-bold text-yellow-400 mt-1">(Início)</p>}
                      {node.isEndingScene && <p className="text-xs font-bold text-brand-primary mt-1">(Fim de Jogo)</p>}
                  </div>
                  
                  {linkingInteractions.length > 0 && (
                    <div className="flex flex-col gap-1 pb-2">
                        {linkingInteractions.map(inter => {
                            const actionText = inter.verbs?.[0] || '';
                            const targetObj = inter.target ? globalObjects[inter.target] : null;
                            const displayLabel = targetObj ? `${actionText} ${targetObj.name}` : actionText;

                            return (
                                <div key={inter.id} className="relative bg-brand-primary/10 text-brand-primary-hover font-bold py-1 flex items-center rounded-md mx-2" style={{height: INTERACTION_ITEM_HEIGHT}}>
                                    <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-10 transition-colors ${activeAnchors.has(`${inter.id}-L`) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                                    <span className="truncate px-4 text-center w-full text-sm" title={displayLabel}>{displayLabel}</span>
                                    <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-4 rounded-full z-10 transition-colors ${activeAnchors.has(`${inter.id}-R`) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
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
      <div className="absolute bottom-4 left-4 z-10 bg-brand-surface/80 backdrop-blur-sm p-3 rounded-lg border border-brand-border text-xs text-brand-text-dim">
          <h4 className="font-bold text-sm text-brand-text mb-2">Legenda</h4>
          <ul className="space-y-1.5">
              <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border-2 border-yellow-400"></div><span>Cena Inicial</span></li>
              <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border-2 border-brand-primary"></div><span>Fim de Jogo</span></li>
              <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border-2 border-red-500"></div><span>Remove Chance</span></li>
              <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border-2 border-white"></div><span>Restaura Chance</span></li>
          </ul>
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex items-end gap-2">
          <button onClick={onAddScene} className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors"><PlusIcon className="w-5 h-5 mr-2" />Adicionar Cena</button>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleZoom('in')} className="w-10 h-10 flex items-center justify-center bg-brand-surface border border-brand-border rounded-md hover:bg-brand-border/50"><PlusIcon className="w-6 h-6" /></button>
            <button onClick={() => handleZoom('out')} className="w-10 h-10 flex items-center justify-center bg-brand-surface border border-brand-border rounded-md hover:bg-brand-border/50"><MinusIcon className="w-6 h-6" /></button>
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