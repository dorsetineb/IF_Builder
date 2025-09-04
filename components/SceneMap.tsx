import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Scene, GameData } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

interface SceneMapProps {
  scenes: Scene[];
  allScenesMap: GameData['scenes'];
  startSceneId: string;
  onSelectScene: (sceneId: string) => void;
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
type Edge = { source: string; target: string; sourceInteractionId: string };

const SceneMap: React.FC<SceneMapProps> = ({ allScenesMap, startSceneId, onSelectScene }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const { nodes, edges, bounds, nodeLevels, nodesWithForwardIncomingEdges, nodesWithBackwardIncomingEdges, interactionsWithForwardOutgoingEdges, interactionsWithBackwardOutgoingEdges } = useMemo(() => {
    // 1. Calculate the actual height of each node first
    const nodeData = new Map<string, { height: number }>();
    Object.values(allScenesMap).forEach(scene => {
        const linkingInteractions = scene.interactions?.filter(inter => inter.goToScene) || [];
        const interactionsHeight = linkingInteractions.length > 0
            // The height is the sum of all interaction items, the gaps between them, and the vertical padding of the container
            ? (linkingInteractions.length * INTERACTION_ITEM_HEIGHT) + ((linkingInteractions.length - 1) * INTERACTION_ITEM_MARGIN_Y) + PADDING
            : 0;
        nodeData.set(scene.id, { height: NODE_HEADER_HEIGHT + interactionsHeight });
    });
    
    // 2. Build edge list
    const createdEdges: Edge[] = [];
    Object.values(allScenesMap).forEach(scene => {
        scene.interactions?.forEach(inter => {
            if (inter.goToScene && allScenesMap[inter.goToScene]) {
                createdEdges.push({ source: scene.id, target: inter.goToScene, sourceInteractionId: inter.id });
            }
        });
    });

    // 3. Determine levels using BFS and create nodeLevels map
    const levels = new Map<number, string[]>();
    const visited = new Set<string>();
    const nodeLevels = new Map<string, number>();
    
    if (startSceneId && allScenesMap[startSceneId]) {
      const queue: { id: string; level: number }[] = [{ id: startSceneId, level: 0 }];
      visited.add(startSceneId);

      while (queue.length > 0) {
        const { id, level } = queue.shift()!;
        const scene = allScenesMap[id];
        if (!scene) continue;
        
        nodeLevels.set(id, level);

        if (!levels.has(level)) levels.set(level, []);
        levels.get(level)!.push(id);

        scene.interactions?.forEach(inter => {
          if (inter.goToScene && allScenesMap[inter.goToScene]) {
            if (!visited.has(inter.goToScene)) {
              visited.add(inter.goToScene);
              queue.push({ id: inter.goToScene, level: level + 1 });
            }
          }
        });
      }
    }
    
    const unlinkedScenes = Object.keys(allScenesMap).filter(id => !visited.has(id));
    if(unlinkedScenes.length > 0) {
        let unlinkedLevel = levels.size > 0 ? levels.size : 0;
        unlinkedScenes.forEach(id => {
            if (!levels.has(unlinkedLevel)) levels.set(unlinkedLevel, []);
            if(!levels.get(unlinkedLevel)!.includes(id)) {
                levels.get(unlinkedLevel)!.push(id);
            }
            nodeLevels.set(id, unlinkedLevel);
        });
    }
    
    // 4. Position nodes based on levels and actual heights
    const positionedNodes: Node[] = [];
    let minX = 0, maxX = 0, minY = 0, maxY = 0;

    levels.forEach((levelScenes, level) => {
      const x = level * (NODE_WIDTH + X_GAP);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + NODE_WIDTH);

      const levelHeight = levelScenes.reduce((sum, id) => sum + (nodeData.get(id)?.height || 0) + Y_GAP, 0) - Y_GAP;
      let currentY = -levelHeight / 2;
      
      levelScenes.forEach((id) => {
        const scene = allScenesMap[id];
        if (!scene) return;
        const { height } = nodeData.get(id)!;
        const y = currentY;
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y + height);
        positionedNodes.push({ ...scene, x, y, level: nodeLevels.get(id)!, height });
        currentY += height + Y_GAP;
      });
    });

    // 5. Determine incoming and outgoing edge types for connector styling
    const nodesWithForwardIncomingEdges = new Set<string>(); // Receives on left connector
    const nodesWithBackwardIncomingEdges = new Set<string>(); // Receives on right connector
    const interactionsWithForwardOutgoingEdges = new Set<string>(); // Sends from right connector
    const interactionsWithBackwardOutgoingEdges = new Set<string>(); // Sends from left connector

    createdEdges.forEach(edge => {
        const sourceLevel = nodeLevels.get(edge.source);
        const targetLevel = nodeLevels.get(edge.target);

        if (sourceLevel !== undefined && targetLevel !== undefined) {
            if (targetLevel < sourceLevel) {
                // Backward connection: Source Left -> Target Right
                nodesWithBackwardIncomingEdges.add(edge.target);
                interactionsWithBackwardOutgoingEdges.add(edge.sourceInteractionId);
            } else {
                // Forward connection: Source Right -> Target Left
                nodesWithForwardIncomingEdges.add(edge.target);
                interactionsWithForwardOutgoingEdges.add(edge.sourceInteractionId);
            }
        } else {
            // Default to forward if levels are undefined for some reason
            nodesWithForwardIncomingEdges.add(edge.target);
            interactionsWithForwardOutgoingEdges.add(edge.sourceInteractionId);
        }
    });

    return { 
        nodes: positionedNodes, 
        edges: createdEdges, 
        bounds: { minX, minY, maxX, maxY }, 
        nodeLevels, 
        nodesWithForwardIncomingEdges, 
        nodesWithBackwardIncomingEdges,
        interactionsWithForwardOutgoingEdges,
        interactionsWithBackwardOutgoingEdges
    };
  }, [allScenesMap, startSceneId]);

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setView(v => ({...v, x: (width - bounds.maxX) / 2 , y: Y_GAP * 2}));
    }
  }, [bounds.maxX]);

    const handleZoom = useCallback((direction: 'in' | 'out') => {
        if (!containerRef.current) return;
        const scaleFactor = 1.2;
        const newScale = direction === 'in' ? view.scale * scaleFactor : view.scale / scaleFactor;
        const clampedScale = Math.max(0.2, Math.min(2, newScale));

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const newX = centerX - (centerX - view.x) * (clampedScale / view.scale);
        const newY = centerY - (centerY - view.y) * (clampedScale / view.scale);

        setView({ x: newX, y: newY, scale: clampedScale });
    }, [view]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const { deltaY } = e;
    const direction = deltaY < 0 ? 'in' : 'out';
    handleZoom(direction);
  }, [handleZoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-clickable-node]')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - view.x, y: e.clientY - view.y });
  }, [view.x, view.y]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setView(v => ({ ...v, x: e.clientX - panStart.x, y: e.clientY - panStart.y}));
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  return (
    <div className="h-full flex flex-col relative">
      <h2 className="text-2xl font-bold text-brand-primary mb-4 flex-shrink-0">Mapa de Cenas</h2>
      <div 
        ref={containerRef}
        className="w-full h-full bg-brand-bg rounded-lg border border-brand-border overflow-hidden cursor-grab"
        style={{backgroundImage: 'radial-gradient(#4a5568 1px, transparent 1px)', backgroundSize: '20px 20px'}}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
            className="transition-transform duration-100"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        >
          <svg className="absolute" width={bounds.maxX - bounds.minX + NODE_WIDTH + X_GAP} height={bounds.maxY - bounds.minY + Y_GAP * 4} style={{ transform: `translate(${bounds.minX}px, ${bounds.minY}px)`, zIndex: 0 }}>
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
              if (interactionIndex === -1) return null;
              
              const y1_offset = NODE_HEADER_HEIGHT + (interactionIndex * (INTERACTION_ITEM_HEIGHT + INTERACTION_ITEM_MARGIN_Y)) + (INTERACTION_ITEM_HEIGHT / 2);
              
              const sourceLevel = nodeLevels.get(edge.source);
              const targetLevel = nodeLevels.get(edge.target);
              const isBackwardConnection = sourceLevel !== undefined && targetLevel !== undefined && targetLevel < sourceLevel;

              let x1, y1, x2, y2, d;

              y1 = sourceNode.y + y1_offset - bounds.minY;
              y2 = targetNode.y + (NODE_HEADER_HEIGHT / 2) - bounds.minY;

              if (isBackwardConnection) {
                  // From Source Left to Target Right
                  x1 = sourceNode.x - bounds.minX;
                  x2 = targetNode.x + NODE_WIDTH + CONNECTOR_RADIUS - bounds.minX;
                  const controlOffset = Math.max(75, Math.abs(x1 - x2) * 0.3);
                  const cx1 = x1 - controlOffset;
                  const cx2 = x2 + controlOffset;
                  d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
              } else {
                  // From Source Right to Target Left
                  x1 = sourceNode.x + NODE_WIDTH - bounds.minX;
                  x2 = targetNode.x - CONNECTOR_RADIUS - bounds.minX;
                  const controlOffset = Math.abs(x2 - x1) * 0.5;
                  const cx1 = x1 + controlOffset;
                  const cx2 = x2 - controlOffset;
                  d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
              }

              return (
                <path
                  key={`${edge.source}-${edge.target}-${i}`}
                  d={d}
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
            
            return (
              <div
                key={node.id}
                data-clickable-node
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectScene(node.id);
                }}
                className={`absolute bg-brand-surface rounded-xl shadow-lg flex flex-col transition-all duration-300 border ${
                  node.id === startSceneId
                    ? 'border-yellow-400'
                    : node.isEndingScene
                    ? 'border-red-500'
                    : 'border-brand-border'
                } cursor-pointer hover:border-yellow-400 hover:shadow-xl`}
                style={{ width: NODE_WIDTH, transform: `translate(${node.x}px, ${node.y}px)`, height: node.height }}
              >
                  <div className="p-3 relative flex-shrink-0 text-center" style={{height: NODE_HEADER_HEIGHT}}>
                      {/* Left Header Connector: filled if it receives a forward connection */}
                      <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors ${nodesWithForwardIncomingEdges.has(node.id) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                      {/* Right Header Connector: filled if it receives a backward connection */}
                      <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors ${nodesWithBackwardIncomingEdges.has(node.id) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                      
                      <h3 className="font-bold text-brand-text truncate">{node.name}</h3>
                      <p className="text-xs text-brand-text-dim">(ID: {node.id})</p>
                      {node.id === startSceneId && <p className="text-xs font-bold text-yellow-400 mt-1">(Início)</p>}
                      {node.isEndingScene && <p className="text-xs font-bold text-red-500 mt-1">(Fim de Jogo)</p>}
                  </div>
                  
                  {linkingInteractions.length > 0 && (
                    <div className="flex flex-col gap-1 pb-2">
                        {linkingInteractions.map(inter => (
                                <div key={inter.id} className="relative bg-brand-primary/10 text-brand-primary-hover font-medium py-1 flex items-center rounded-md" style={{height: INTERACTION_ITEM_HEIGHT}}>
                                    {/* Left Interaction Connector: filled if it sends a backward connection */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-10 transition-colors ${interactionsWithBackwardOutgoingEdges.has(inter.id) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                                    <span className="truncate px-4 text-center w-full text-sm">{inter.target}</span>
                                    {/* Right Interaction Connector: filled if it sends a forward connection */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10 right-0 translate-x-1/2 transition-colors ${interactionsWithForwardOutgoingEdges.has(inter.id) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                                </div>
                          ))
                        }
                    </div>
                  )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
          <button onClick={() => handleZoom('in')} className="w-10 h-10 flex items-center justify-center bg-brand-surface border border-brand-border rounded-md hover:bg-brand-border/50">
              <PlusIcon className="w-6 h-6" />
          </button>
          <button onClick={() => handleZoom('out')} className="w-10 h-10 flex items-center justify-center bg-brand-surface border border-brand-border rounded-md hover:bg-brand-border/50">
              <MinusIcon className="w-6 h-6" />
          </button>
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