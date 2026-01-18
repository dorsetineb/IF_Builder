
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Scene, GameData, Vignette } from '../types';
import { Plus, Minus, FileImage, Film, MonitorPlay } from 'lucide-react';

interface SceneMapProps {
  allScenesMap: GameData['scenes'];
  globalObjects: GameData['globalObjects'];
  startSceneId: string;
  vignettes: Vignette[];
  onSelectScene: (sceneId: string) => void;
  onUpdateScenePosition: (sceneId: string, x: number, y: number) => void;
  onAddScene: () => void;
  onAddVignette: () => void;
  gameInteractionType?: 'parser' | 'choice';
}

const NODE_WIDTH = 250;
const NODE_HEADER_HEIGHT = 70;
const THUMBNAIL_HEIGHT = 140;
const INTERACTION_ITEM_HEIGHT = 36;
const X_GAP = 150;
const Y_GAP = 50;
const INTERACTION_ITEM_MARGIN_Y = 4;
const PADDING_BOTTOM = 8;
const PADDING_TOP = 4;

type MapNodeType = 'scene' | 'vignette';

interface MapNodeData {
  id: string;
  type: MapNodeType;
  name: string;
  title?: string;
  image?: string;
  data: Scene | Vignette;
  isStart?: boolean;
  isEnding?: boolean;
}

type Node = MapNodeData & { x: number; y: number; level: number; height: number };
type Edge = {
  source: string;
  target: string;
  sourceItemId: string;
  sSide: 'L' | 'R';
  tSide: 'L' | 'R';
  sDir: number;
  tDir: number;
};

const SceneMap: React.FC<SceneMapProps> = ({
  allScenesMap,
  globalObjects,
  startSceneId,
  vignettes,
  onSelectScene,
  onUpdateScenePosition,
  onAddScene,
  onAddVignette,
  gameInteractionType = 'parser'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragInfo, setDragInfo] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Helper to extract linking items from a Node (Scene or Vignette)
  const getLinkingItems = useCallback((node: MapNodeData) => {
    if (node.type === 'scene') {
      const scene = node.data as Scene;
      if (gameInteractionType === 'choice') {
        return scene.choices?.filter(c => c.targetSceneId).map(c => ({
          id: c.id,
          targetId: c.targetSceneId,
          label: c.label,
          type: 'scene' as MapNodeType
        })) || [];
      } else {
        const items: { id: string, targetId: string, label: string, type: MapNodeType, original?: any }[] = [];
        scene.interactions?.forEach(i => {
          if (i.vignetteId) {
            items.push({
              id: i.id,
              targetId: i.vignetteId,
              label: i.verbs?.[0] || 'Vinheta',
              type: 'vignette',
              original: i
            });
          } else if (i.goToScene) {
            items.push({
              id: i.id,
              targetId: i.goToScene,
              label: i.verbs?.[0] || 'Ir para',
              type: 'scene',
              original: i
            });
          }
        });

        // Link Ending Scenes to Victory Vignette
        if (scene.isEndingScene) {
          const victoryVig = vignettes.find(v => v.id === 'VNT_VICTORY');
          if (victoryVig) {
            items.push({
              id: `link-ending-${scene.id}`,
              targetId: 'VNT_VICTORY',
              label: 'Vitória',
              type: 'vignette'
            });
          }
        }

        // Link Lose-Chance Scenes to Defeat Vignette (Visual Aid)
        if (scene.removesChanceOnEntry) {
          const defeatVig = vignettes.find(v => v.id === 'VNT_DEFEAT');
          if (defeatVig) {
            items.push({
              id: `link-defeat-${scene.id}`,
              targetId: 'VNT_DEFEAT',
              label: '(-1 Vida)',
              type: 'vignette'
            });
          }
        }

        return items;
      }
    } else { // Vignette
      const vig = node.data as Vignette;
      // Opening vignette should link to Start Scene if it's the opening
      if (vig.id === 'VNT_OPENING' && startSceneId) {
        return [{
          id: `link-${vig.id}-start`,
          targetId: startSceneId,
          label: 'INICIAR',
          type: 'scene' as MapNodeType
        }];
      }

      if (vig.nextSceneId && !vig.isConclusion) {
        return [{
          id: `link-${vig.id}`,
          targetId: vig.nextSceneId,
          label: 'Continuar',
          type: 'scene' as MapNodeType
        }];
      }
      return [];
    }
  }, [gameInteractionType, startSceneId]);

  const { initialNodes, edges, bounds, activeAnchors } = useMemo(() => {
    // 1. Prepare Data Maps
    const allNodesMap = new Map<string, MapNodeData>();

    // Add Scenes
    Object.values(allScenesMap).forEach((scene: Scene) => {
      allNodesMap.set(scene.id, {
        id: scene.id,
        type: 'scene',
        name: scene.name,
        image: scene.image,
        data: scene,
        isStart: scene.id === startSceneId,
        isEnding: scene.isEndingScene
      });
    });

    // Add Vignettes
    vignettes.forEach(vig => {
      allNodesMap.set(vig.id, {
        id: vig.id,
        type: 'vignette',
        name: vig.name || '(Sem nome)',
        title: vig.title || '',
        image: vig.image,
        data: vig
      });
    });

    // 2. Calculate Heights
    const nodeHeights = new Map<string, number>();
    allNodesMap.forEach(node => {
      const linkingItems = getLinkingItems(node);
      const interactionsHeight = linkingItems.length > 0
        ? (linkingItems.length * INTERACTION_ITEM_HEIGHT) + ((linkingItems.length - 1) * INTERACTION_ITEM_MARGIN_Y) + PADDING_BOTTOM + PADDING_TOP
        : 0;
      const imagePadding = node.image ? THUMBNAIL_HEIGHT : 0;
      nodeHeights.set(node.id, NODE_HEADER_HEIGHT + imagePadding + interactionsHeight);
    });

    // 3. Right-Bifurcation Layout Algorithm
    const levels = new Map<string, number>();
    const nodeLevels = new Map<number, string[]>();
    const dependents = new Map<string, string[]>();
    const reverseDeps = new Map<string, string[]>();

    allNodesMap.forEach(node => {
      const links = getLinkingItems(node);
      links.forEach(link => {
        if (allNodesMap.has(link.targetId)) {
          if (!dependents.has(node.id)) dependents.set(node.id, []);
          dependents.get(node.id)!.push(link.targetId);

          if (!reverseDeps.has(link.targetId)) reverseDeps.set(link.targetId, []);
          reverseDeps.get(link.targetId)!.push(node.id);
        }
      });
    });

    // Logic: Identify Opening Vignette and force it to be Level 0 (if exists)
    // Then Start Scene becomes Level 1.
    const openingNode = vignettes.find(v => v.id === 'VNT_OPENING');
    const startNode = startSceneId ? allNodesMap.get(startSceneId) : null;

    // Initial Queue
    const queue: string[] = [];

    if (openingNode) {
      levels.set(openingNode.id, 0);
      queue.push(openingNode.id);
    } else if (startNode) {
      levels.set(startNode.id, 0);
      queue.push(startNode.id);
    }

    // Also add unconnected roots? No, standard flow first.

    let safety = 0;
    while (queue.length > 0 && safety < 10000) {
      safety++;
      const u = queue.shift()!;
      const u_level = levels.get(u)!;

      const children = dependents.get(u) || [];
      children.forEach(v => {
        const current_v_level = levels.get(v) ?? -1;
        const new_v_level = u_level + 1;

        if (new_v_level > current_v_level) {
          // KEY FIX: Prevent Start Scene from being pushed to higher levels by cycles!
          if (v === startSceneId && levels.has(v)) {
            return; // Skip updating start scene
          }

          if (new_v_level < 20) {
            levels.set(v, new_v_level);
            if (!queue.includes(v)) queue.push(v);
          }
        }
      });
    }

    // Handle Unreachable/Unlinked scenes
    const unvisited = Array.from(allNodesMap.keys()).filter(id => !levels.has(id));
    unvisited.forEach(id => {
      if (!levels.has(id)) {
        const subQueue = [id];
        levels.set(id, 0);
        while (subQueue.length > 0) {
          const u = subQueue.shift()!;
          const u_level = levels.get(u)!;
          const children = dependents.get(u) || [];
          children.forEach(v => {
            const new_v_level = u_level + 1;
            const current_v_level = levels.get(v) ?? -1;
            if (new_v_level > current_v_level && new_v_level < 20) {
              levels.set(v, new_v_level);
              if (!subQueue.includes(v)) subQueue.push(v);
            }
          });
        }
      }
    });

    // Populate nodeLevels
    levels.forEach((lvl, id) => {
      if (!nodeLevels.has(lvl)) nodeLevels.set(lvl, []);
      nodeLevels.get(lvl)!.push(id);
    });

    // 4. Position Calculation (Y coordinates)
    const positionedNodes: Node[] = [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    const maxLvl = Math.max(...Array.from(nodeLevels.keys()), 0);

    for (let l = 0; l <= maxLvl; l++) {
      const nodesInLevel = nodeLevels.get(l) || [];

      if (l > 0) {
        const prevLevelNodes = nodeLevels.get(l - 1) || [];
        nodesInLevel.sort((a, b) => {
          const parentsA = reverseDeps.get(a) || [];
          const parentsB = reverseDeps.get(b) || [];
          const avgIdxA = parentsA.reduce((sum, pId) => sum + prevLevelNodes.indexOf(pId), 0) / (parentsA.length || 1);
          const avgIdxB = parentsB.reduce((sum, pId) => sum + prevLevelNodes.indexOf(pId), 0) / (parentsB.length || 1);
          return avgIdxA - avgIdxB;
        });
      }

      const calculatedX = l * (NODE_WIDTH + X_GAP);
      const levelHeight = nodesInLevel.reduce((sum, id) => sum + (nodeHeights.get(id) || 0) + Y_GAP, 0) - Y_GAP;
      let currentY = -levelHeight / 2;

      nodesInLevel.forEach(id => {
        const rawNode = allNodesMap.get(id);
        if (!rawNode) return;
        const h = nodeHeights.get(id)!;
        const sceneData = rawNode.type === 'scene' ? (rawNode.data as Scene) : null;

        const x = sceneData?.mapX ?? calculatedX;
        const y = sceneData?.mapY ?? currentY;

        positionedNodes.push({
          ...rawNode,
          x,
          y,
          level: l,
          height: h
        });

        if (sceneData?.mapY === undefined) currentY += h + Y_GAP;

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x + NODE_WIDTH);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y + h);
      });
    }

    // Force "Conclusion" Vignettes to be at the Far Right (Max Level + 1)
    // Defensive coding: Explicitly include global victory/defeat IDs in case isConclusion is missing
    const conclusionNodes = positionedNodes.filter(n => {
      const vig = n.data as Vignette;
      return n.type === 'vignette' && (vig.isConclusion || vig.id === 'VNT_VICTORY' || vig.id === 'VNT_DEFEAT');
    });
    if (conclusionNodes.length > 0) {
      const farRightX = maxX + X_GAP;
      let cY = minY;

      // Remove from current position stats to re-add? No, just overwrite X.
      // But we need to ensure they align nicely vertically.

      conclusionNodes.forEach((node, idx) => {
        node.x = farRightX;
        node.y = minY + (idx * (node.height + Y_GAP));
        node.level = maxLvl + 1; // Artificially set level high

        maxX = Math.max(maxX, node.x + NODE_WIDTH);
        maxY = Math.max(maxY, node.y + node.height);
      });
    }

    // 5. Edges
    const createdEdges: Edge[] = [];
    const activeAnchorsSet = new Set<string>();

    positionedNodes.forEach(sourceNode => {
      const linkingItems = getLinkingItems(sourceNode);
      linkingItems.forEach((item, index) => {
        const targetNode = positionedNodes.find(n => n.id === item.targetId);
        if (!targetNode) return;

        const imagePadding = sourceNode.image ? THUMBNAIL_HEIGHT : 0;
        const y1_offset = NODE_HEADER_HEIGHT + imagePadding + PADDING_TOP + (index * (INTERACTION_ITEM_HEIGHT + INTERACTION_ITEM_MARGIN_Y)) + (INTERACTION_ITEM_HEIGHT / 2);
        const y2_offset = NODE_HEADER_HEIGHT / 2;

        const sL = { x: sourceNode.x, y: sourceNode.y + y1_offset };
        const sR = { x: sourceNode.x + NODE_WIDTH, y: sourceNode.y + y1_offset };
        const tL = { x: targetNode.x, y: targetNode.y + y2_offset };
        const tR = { x: targetNode.x + NODE_WIDTH, y: targetNode.y + y2_offset };

        const combinations = [
          { s: sR, t: tL, sSide: 'R' as const, tSide: 'L' as const, sDir: 1, tDir: -1 },
          { s: sL, t: tR, sSide: 'L' as const, tSide: 'R' as const, sDir: -1, tDir: 1 },
          { s: sR, t: tR, sSide: 'R' as const, tSide: 'R' as const, sDir: 1, tDir: 1 },
          { s: sL, t: tL, sSide: 'L' as const, tSide: 'L' as const, sDir: -1, tDir: -1 }
        ];

        const preferred = sourceNode.level < targetNode.level
          ? combinations[0]
          : combinations.reduce((prev, curr) => {
            const dist = Math.sqrt(Math.pow(curr.t.x - curr.s.x, 2) + Math.pow(curr.t.y - curr.s.y, 2));
            const prevDist = Math.sqrt(Math.pow(prev.t.x - prev.s.x, 2) + Math.pow(prev.t.y - prev.s.y, 2));
            return dist < prevDist ? curr : prev;
          });

        createdEdges.push({
          source: sourceNode.id,
          target: targetNode.id,
          sourceItemId: item.id,
          sSide: preferred.sSide,
          tSide: preferred.tSide,
          sDir: preferred.sDir,
          tDir: preferred.tDir
        });

        activeAnchorsSet.add(`${item.id}-${preferred.sSide}`);
        activeAnchorsSet.add(`${targetNode.id}-${preferred.tSide}`);
      });
    });

    return {
      initialNodes: positionedNodes,
      edges: createdEdges,
      bounds: {
        minX: minX === Infinity ? 0 : minX,
        minY: minY === Infinity ? 0 : minY,
        maxX: maxX === -Infinity ? NODE_WIDTH : maxX,
        maxY: maxY === -Infinity ? NODE_HEADER_HEIGHT : maxY
      },
      activeAnchors: activeAnchorsSet
    };
  }, [allScenesMap, vignettes, startSceneId, getLinkingItems]);

  const [nodes, setNodes] = useState(initialNodes);

  useEffect(() => {
    if (!dragInfo) setNodes(initialNodes);
  }, [initialNodes, dragInfo]);

  useEffect(() => {
    if (containerRef.current && initialNodes.length > 0) {
      // Logic: Center on Opening if exists, else Start Scene
      const opening = initialNodes.find(n => n.id === 'VNT_OPENING');
      const startNode = initialNodes.find(n => n.id === startSceneId);
      const target = opening || startNode;

      if (target) {
        setView(v => ({ ...v, x: 50, y: (containerRef.current!.offsetHeight / 2) - target.height / 2 }));
      } else {
        setView(v => ({ ...v, x: 50, y: 50 }));
      }
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
      if (finalNode && finalNode.type === 'scene') {
        onUpdateScenePosition(finalNode.id, finalNode.x, finalNode.y);
      }
      setDragInfo(null);
    }
    setIsPanning(false);
  }, [dragInfo, nodes, onUpdateScenePosition]);

  return (
    <div className="h-full flex flex-col relative">
      <div className="mb-4 flex-shrink-0">
        <p className="text-zinc-500 mt-1 text-xs font-medium">
          Visualize e organize a estrutura do seu jogo.
        </p>
      </div>
      <div
        ref={containerRef}
        className={`w-full h-full bg-zinc-950 rounded-2xl border border-zinc-700 overflow-hidden ${isPanning || dragInfo ? 'cursor-grabbing' : 'cursor-grab'} shadow-inner`}
        style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
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
          <svg className="absolute" width={Math.max(1000, bounds.maxX + 1000)} height={Math.max(1000, bounds.maxY + 1000)} style={{ transform: `translate(0px, 0px)`, zIndex: 0, overflow: 'visible' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" fillOpacity="0.8" />
              </marker>
              <marker id="arrow-vignette" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f4f4f5" fillOpacity="0.8" />
              </marker>
              <marker id="arrow-opening" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" fillOpacity="0.8" />
              </marker>
            </defs>
            {edges.map((edge, i) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const linkingItems = getLinkingItems(sourceNode);
              const itemIndex = linkingItems.findIndex(item => item.id === edge.sourceItemId);
              const imagePadding = sourceNode.image ? THUMBNAIL_HEIGHT : 0;
              const y1_offset = NODE_HEADER_HEIGHT + imagePadding + PADDING_TOP + (itemIndex * (INTERACTION_ITEM_HEIGHT + INTERACTION_ITEM_MARGIN_Y)) + (INTERACTION_ITEM_HEIGHT / 2);
              const y2_offset = NODE_HEADER_HEIGHT / 2;

              const realX1 = sourceNode.x + (edge.sSide === 'L' ? 0 : NODE_WIDTH);
              const realY1 = sourceNode.y + y1_offset;
              const realX2 = targetNode.x + (edge.tSide === 'L' ? 0 : NODE_WIDTH);
              const realY2 = targetNode.y + y2_offset;

              const dx = Math.abs(realX2 - realX1);
              const dy = Math.abs(realY2 - realY1);
              const offset = Math.max(50, Math.min(150, dx * 0.5 + dy * 0.2));

              const cx1 = realX1 + (offset * edge.sDir);
              const cx2 = realX2 + (offset * edge.tDir);

              const isVignetteLink = targetNode.type === 'vignette';
              const isOpeningLink = sourceNode.id === 'VNT_OPENING';

              const strokeColor = isOpeningLink ? '#0ea5e9' : isVignetteLink ? '#f4f4f5' : '#a855f7';
              const markerEnd = isOpeningLink ? "url(#arrow-opening)" : isVignetteLink ? "url(#arrow-vignette)" : "url(#arrow)";

              return (
                <path
                  key={`${edge.source}-${edge.target}-${i}`}
                  d={`M ${realX1} ${realY1} C ${cx1} ${realY1}, ${cx2} ${realY2}, ${realX2} ${realY2}`}
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeOpacity="0.4"
                  fill="none"
                  markerEnd={markerEnd}
                />
              );
            })}
          </svg>

          {nodes.map(node => {
            const linkingItems = getLinkingItems(node);

            // --- VIGNETTE NODE STYLE ---
            if (node.type === 'vignette') {
              const vig = node.data as Vignette;
              const isOpening = vig.id === 'VNT_OPENING';
              const isConclusion = vig.isConclusion;

              const borderClass = isOpening
                ? 'border-sky-500 border-4' // Opening: Thick Sky border
                : 'border-zinc-100 border-2'; // All Vignettes: White border, standard thickness

              const shadowClass = isOpening
                ? 'hover:shadow-sky-500/10 hover:border-sky-400'
                : 'hover:shadow-zinc-500/10 hover:border-zinc-300';

              // Anchor colors still differentiate for helpfulness, or should they be unified?
              // User said "All vignettes should have white border". I'll keep anchor cues subtle or matching.
              // Let's keep specific cues for anchor fills to help distinguishing types when dragging.

              const anchorColorClass = isOpening
                ? 'bg-sky-500 border-sky-400'
                : 'bg-zinc-100 border-zinc-300';

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
                  className={`absolute bg-zinc-900 rounded-xl flex flex-col transition-all duration-300 ${borderClass} cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${shadowClass} overflow-hidden group`}
                  style={{ width: NODE_WIDTH, transform: `translate(${node.x}px, ${node.y}px)`, height: node.height, userSelect: 'none' }}
                >
                  <div className="p-3 relative flex-shrink-0 text-center bg-zinc-900/50" style={{ height: NODE_HEADER_HEIGHT }}>
                    {/* Anchors */}
                    {!isOpening && (
                      <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${node.id}-L`) ? anchorColorClass : 'bg-zinc-950 border-zinc-700'}`} />
                    )}
                    {!isOpening && (
                      <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${node.id}-R`) ? anchorColorClass : 'bg-zinc-950 border-zinc-700'}`} />
                    )}

                    <h3 className="font-bold text-zinc-100 truncate text-sm">{node.title || '(Sem Título)'}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider truncate">(ID: {node.id})</p>
                    {isOpening && <p className="text-[10px] font-bold text-sky-400 mt-1 uppercase tracking-widest">Abertura</p>}
                    {isConclusion && <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Conclusão</p>}
                  </div>

                  {node.image && (
                    <div className="w-full bg-black flex-shrink-0" style={{ height: THUMBNAIL_HEIGHT }}>
                      <img src={node.image} alt={node.name} className="w-full h-full object-cover opacity-80" style={{ pointerEvents: 'none' }} />
                    </div>
                  )}

                  {/* Outgoing Links (Next Scene) */}
                  {linkingItems.length > 0 && (
                    <div className="flex flex-col gap-1 pt-1 pb-2 border-t border-zinc-800/50">
                      {linkingItems.map(item => (
                        <div key={item.id} className={`relative font-bold py-1 flex items-center w-full ${isConclusion ? 'text-zinc-400 bg-zinc-100/5' : isOpening ? 'text-sky-500 bg-sky-500/5' : 'text-amber-500 bg-amber-500/5'}`} style={{ height: INTERACTION_ITEM_HEIGHT }}>
                          <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${item.id}-L`) ? anchorColorClass : 'bg-zinc-950 border-zinc-700'}`} />
                          <span className="truncate px-4 text-center w-full text-[10px] uppercase tracking-wider">{item.label}</span>
                          <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${item.id}-R`) ? anchorColorClass : 'bg-zinc-950 border-zinc-700'}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // --- STANDARD SCENE NODE STYLE ---
            const scene = node.data as Scene;
            const borderColorClass = node.isStart ? 'border-purple-500' : node.isEnding ? 'border-zinc-100' : scene.removesChanceOnEntry ? 'border-red-500' : scene.restoresChanceOnEntry ? 'border-green-500' : 'border-zinc-800/80';

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
                  {/* Anchor Points Visualization */}
                  {!node.isStart && (
                    <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${node.id}-L`) ? 'bg-purple-500 border-purple-400' : 'bg-zinc-950 border-zinc-700'}`} />
                  )}
                  {/* Although anchors are strictly computed, we show right anchor visually if there are inputs from right? No, inputs always Left. Outputs always Right. */}

                  <h3 className="font-bold text-zinc-100 truncate text-sm">{node.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">(ID: {node.id})</p>
                  {node.isStart && <p className="text-[10px] font-bold text-purple-400 mt-1 uppercase tracking-widest">Início</p>}
                  {node.isEnding && <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Fim de Jogo</p>}
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

                {linkingItems.length > 0 && (
                  <div className="flex flex-col gap-1 pt-1 pb-2 border-t border-zinc-800/50">
                    {linkingItems.map(item => {
                      let displayLabel = item.label;
                      // Logic for detailed label recovery if needed for Parser
                      if (gameInteractionType === 'parser' && item.original) {
                        const inter = item.original;
                        const actionText = inter.verbs?.[0] || 'Ação';
                        const reqObj = inter.requiresInInventory ? globalObjects[inter.requiresInInventory] : null;
                        const targetObj = inter.target ? globalObjects[inter.target] : null;
                        displayLabel = `${actionText}${reqObj ? ' ' + reqObj.name : ''}${targetObj ? ' ' + targetObj.name : ''}`;
                      }

                      const isVignetteLink = item.type === 'vignette';
                      const linkColor = isVignetteLink ? 'text-amber-500 bg-amber-500/5' : 'text-purple-400 bg-purple-500/5';
                      const anchorColor = isVignetteLink ? 'bg-amber-500 border-amber-400' : 'bg-purple-500 border-purple-400';

                      return (
                        <div key={item.id} className={`relative ${linkColor} font-bold py-1 flex items-center w-full`} style={{ height: INTERACTION_ITEM_HEIGHT }}>
                          <span className="truncate px-4 text-center w-full text-[10px] uppercase tracking-wider" title={displayLabel}>{displayLabel}</span>
                          <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors border-2 ${activeAnchors.has(`${item.id}-R`) ? anchorColor : 'bg-zinc-950 border-zinc-700'}`} />
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
        <button onClick={onAddScene} className="flex items-center px-4 py-2 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-xl active:scale-95 text-xs"><Plus className="w-4 h-4 mr-2" />Nova Cena</button>
        <button onClick={onAddVignette} className="flex items-center px-4 py-2 bg-zinc-800 text-zinc-200 font-bold rounded-lg hover:bg-zinc-700 transition-all shadow-xl active:scale-95 text-xs border border-zinc-600"><MonitorPlay className="w-4 h-4 mr-2" />Nova Vinheta</button>
      </div>
      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-4 pointer-events-none">
        <div className="bg-zinc-950/80 backdrop-blur-md p-4 rounded-xl border border-zinc-800 shadow-xl pointer-events-auto">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Legenda</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border-2 border-purple-500 bg-purple-500/20"></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Cena Inicial</span></li>
            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border-2 border-zinc-100 bg-zinc-100/20"></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Vinheta</span></li>
            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border-2 border-sky-500 bg-sky-500/20"></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Abertura</span></li>
            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 bg-green-500/20"></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Restaura Chance</span></li>
            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-red-500/20"></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Remove Chance</span></li>
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

export default SceneMap;
