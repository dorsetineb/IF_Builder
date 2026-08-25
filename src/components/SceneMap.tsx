import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Scene, GameData, Vignette } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Plus, Minus, LayoutGrid, Maximize2, AlertTriangle, ArrowRight, Split, BarChart3, List, Columns3, Trash2, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EditorStatsModal from './EditorStatsModal';
import { useTheme } from './ThemeProvider';

interface SceneMapProps {
  allScenesMap: GameData['scenes'];
  globalObjects: GameData['globalObjects'];
  startSceneId: string;
  vignettes: Vignette[];
  onSelectScene: (sceneId: string | null) => void;
  onUpdateScenePosition: (sceneId: string, x: number, y: number) => void;
  onUpdateVignettePosition: (vignetteId: string, x: number, y: number) => void;
  onReorganizeScenes: () => void;
  gameInteractionType?: 'parser' | 'choice';
  onAddNode?: (type: 'scene' | 'vignette' | 'hypercard_stack') => void;
  hasOpeningVignette?: boolean;
  gameTitle?: string;
  isSidebarOpen?: boolean;
  isNarrativeMenuOpen?: boolean;
  onToggleNarrative?: () => void;
  selectedSceneId?: string | null;
  onDeleteScene: (id: string) => void;
}

const NODE_WIDTH = 250;
const NODE_HEADER_HEIGHT = 70;
const THUMBNAIL_HEIGHT = 140;
const SCENARIO_THUMBNAIL_HEIGHT = 94; // 1/3 smaller than 140px (140 * 2/3 ≈ 94)
const INTERACTION_ITEM_HEIGHT = 40;
const X_GAP = 150;
const Y_GAP = 50;

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
  isBackward?: boolean;
};

const SceneMap: React.FC<SceneMapProps> = ({
  allScenesMap,
  globalObjects,
  startSceneId,
  vignettes,
  onSelectScene,
  onUpdateScenePosition,
  onUpdateVignettePosition,
  onReorganizeScenes,
  onAddNode,
  hasOpeningVignette = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isSidebarOpen = false,
  gameInteractionType = 'parser',
  gameTitle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isNarrativeMenuOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onToggleNarrative,
  selectedSceneId,
  onDeleteScene,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const hoverTextClass = theme === 'terminal' ? 'hover:text-zinc-950' : 'hover:text-white';
  const containerRef = useRef<HTMLDivElement>(null);
  const mapTransformRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rafRef = useRef<number | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragInfo, setDragInfo] = useState<{ id: string; offsetX: number; offsetY: number } | null>(
    null
  );
  const dragStartPos = useRef({ x: 0, y: 0 });
  const lastFocusedId = useRef<string | null>(null);

  // Helper to extract linking items from a Node (Scene or Vignette)
  const getLinkingItems = useCallback(
    (node: MapNodeData) => {
      if (node.type === 'scene') {
        const scene = node.data as Scene;
        const items: {
          id: string;
          targetId: string;
          label: string;
          type: MapNodeType;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          original?: any;
        }[] = [];

        // 1. Opening Vignette (as Scene) links to Start Scene
        if (scene.vignetteType === 'opening' && startSceneId && scene.id !== startSceneId) {
          items.push({
            id: `link-opening-${scene.id}`,
            targetId: startSceneId,
            label:
              scene.vignetteButtonText || t('UIEditor.textos.splashButtonPlaceholder', 'START'),
            type: 'scene',
          });
        }

        // 2. Transition Vignette Links - Applies to BOTH modes
        if (scene.vignetteNextSceneId) {
          if (scene.vignetteNextSceneId === 'END_GAME') {
            const victoryVig = vignettes.find((v) => v.id === 'VNT_VICTORY');
            if (victoryVig) {
              items.push({
                id: `link-endgame-${scene.id}`,
                targetId: 'VNT_VICTORY',
                label: scene.vignetteButtonText || t('branchingPreview.endGame', 'Fim'),
                type: 'vignette',
              });
            }
          } else {
            items.push({
              id: `link-vignette-${scene.id}`,
              targetId: scene.vignetteNextSceneId,
              label:
                scene.vignetteButtonText ||
                t('UIEditor.textos.continueButtonPlaceholder', 'Continue'),
              type: 'scene',
            });
          }
        }

        // 2. System Links (Defeat, link to victory from ending scene)
        if (scene.isEndingScene) {
          const victoryVig = vignettes.find((v) => v.id === 'VNT_VICTORY');
          if (victoryVig) {
            items.push({
              id: `link-ending-${scene.id}`,
              targetId: 'VNT_VICTORY',
              label: t('sceneMap.victory', 'Vitória'),
              type: 'vignette',
            });
          }
        }

        // 3. Defeat Links - Check allScenesMap first (new system), then legacy vignettes
        if (scene.removesChanceOnEntry) {
          const defeatScene = Object.values(allScenesMap).find(
            (s) => (s as Scene).isDefeatOutcome
          ) as Scene | undefined;
          const defeatVig = vignettes.find((v) => v.id === 'VNT_DEFEAT');
          const defeatTargetId = defeatScene?.id || defeatVig?.id;

          if (defeatTargetId) {
            items.push({
              id: `link-defeat-${scene.id}`,
              targetId: defeatTargetId,
              label: t('sceneMap.minusOneLife', '(-1 Vida)'),
              type: defeatScene ? 'scene' : 'vignette',
            });
          }
        }

        // 3. Mode Specific Links
        if (gameInteractionType === 'choice') {
          if (scene.choices) {
            scene.choices
              .filter((c) => c.targetSceneId)
              .forEach((c) => {
                items.push({
                  id: c.id,
                  targetId: c.targetSceneId,
                  label: c.label,
                  type: 'scene' as MapNodeType,
                });
              });
          }
        } else {
          // Parser Mode Interactions
          scene.interactions?.forEach((i) => {
            if (i.vignetteId) {
              items.push({
                id: i.id,
                targetId: i.vignetteId,
                label: i.title || i.verbs?.[0] || t('sceneMap.vignette', 'Capítulo'),
                type: 'vignette',
                original: i,
              });
            } else if (i.goToScene) {
              items.push({
                id: i.id,
                targetId: i.goToScene,
                label: i.title || i.verbs?.[0] || t('branchingPreview.thisScene', 'Ir para'),
                type: 'scene',
                original: i,
              });
            }
          });
        }

        // 4. HyperCard Stack External Links
        if (scene.sceneType === 'hypercard_stack' && scene.stackCards) {
          scene.stackCards.forEach((card) => {
            card.hotspots?.forEach((h) => {
              if (h.targetSceneId && h.targetSceneId !== scene.id) {
                items.push({
                  id: `link-hotspot-${card.id}-${h.id}`,
                  targetId: h.targetSceneId,
                  label: h.title || t('sceneMap.hotspotExit', 'Saída'),
                  type: 'scene',
                  original: h,
                  cardId: card.id,
                  isHotspot: true,
                });
              }
            });
          });
        }

        return items;
      } else {
        // Vignette
        const vig = node.data as Vignette;
        // Opening vignette should link to Start Scene if it's the opening
        if (vig.id === 'VNT_OPENING' && startSceneId) {
          return [
            {
              id: `link-${vig.id}-start`,
              targetId: startSceneId,
              label: t('UIEditor.textos.splashButtonPlaceholder', 'START'),
              type: 'scene' as MapNodeType,
            },
          ];
        }

        if (vig.nextSceneId && !vig.isConclusion) {
          return [
            {
              id: `link-${vig.id}`,
              targetId: vig.nextSceneId,
              label: t('UIEditor.textos.continueButtonPlaceholder', 'Continue'),
              type: 'scene' as MapNodeType,
            },
          ];
        }
        return [];
      }
    },
    [gameInteractionType, startSceneId, t]
  );

  const { initialNodes, edges, bounds, activeAnchors, orphanIds } = useMemo(() => {
    // 1. Prepare Data Maps
    const allNodesMap = new Map<string, MapNodeData>();

    // Add Scenes
    Object.values(allScenesMap).forEach((scene: Scene) => {
      const isStack = scene.sceneType === 'hypercard_stack';
      const thumbnailImage = (isStack && scene.stackCards?.[0]?.image) ? scene.stackCards[0].image : scene.image;
      allNodesMap.set(scene.id, {
        id: scene.id,
        type: 'scene',
        name: scene.name,
        image: thumbnailImage,
        data: scene,
        isStart: scene.id === startSceneId,
        isEnding: scene.isEndingScene,
      });
    });

    // Add Vignettes
    vignettes.forEach((vig) => {
      allNodesMap.set(vig.id, {
        id: vig.id,
        type: 'vignette',
        name: vig.name || t('sceneMap.noName', '(Sem nome)'),
        title: vig.title || '',
        image: vig.image,
        data: vig,
      });
    });

    // 2. Calculate Heights
    const nodeHeights = new Map<string, number>();
    allNodesMap.forEach((node) => {
      const headerH = NODE_HEADER_HEIGHT;
      const linkingItems = getLinkingItems(node);

      if (node.type === 'scene') {
        const scene = node.data as Scene;
        if (scene.sceneType === 'hypercard_stack' && scene.stackCards && scene.stackCards.length > 0) {
          let stackHeight = headerH;
          scene.stackCards.forEach((card) => {
            const cardImageH = card.image ? SCENARIO_THUMBNAIL_HEIGHT : 0;
            const cardLinks = linkingItems.filter((it: any) => it.cardId === card.id);
            const cardInteractionsH = cardLinks.length * INTERACTION_ITEM_HEIGHT;
            stackHeight += cardImageH + cardInteractionsH;
          });
          nodeHeights.set(node.id, stackHeight + 4);
          return;
        }
      }

      const interactionsHeight = linkingItems.length * INTERACTION_ITEM_HEIGHT;
      const imagePadding = node.image ? THUMBNAIL_HEIGHT : 0;
      nodeHeights.set(node.id, headerH + imagePadding + interactionsHeight + 4);
    });

    // 3. Right-Bifurcation Layout Algorithm
    const levels = new Map<string, number>();
    const nodeLevels = new Map<number, string[]>();
    const dependents = new Map<string, string[]>();
    const reverseDeps = new Map<string, string[]>();

    allNodesMap.forEach((node) => {
      const links = getLinkingItems(node);
      links.forEach((link) => {
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
    const openingNode = vignettes.find((v) => v.id === 'VNT_OPENING');
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
      children.forEach((v) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const current_v_level = levels.get(v) ?? -1;
        const new_v_level = u_level + 1;

        // Use SHORTEST PATH logic (First Visit wins) to avoid cycles pushing parents to the right.
        // If the node already has a level, it means we found a shorter path to it previously.
        // This keeps "Hub" scenes (like Cela Escura) on the left, and branched interactions on the right.
        if (!levels.has(v) && new_v_level < 20) {
          levels.set(v, new_v_level);
          if (!queue.includes(v)) queue.push(v);
        }
      });
    }

    // Handle Unreachable/Unlinked scenes
    const unvisited = Array.from(allNodesMap.keys()).filter((id) => !levels.has(id));
    unvisited.forEach((id) => {
      if (!levels.has(id)) {
        const subQueue = [id];
        levels.set(id, 0);
        while (subQueue.length > 0) {
          const u = subQueue.shift()!;
          const u_level = levels.get(u)!;
          const children = dependents.get(u) || [];
          children.forEach((v) => {
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
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    const sortedLevels = Array.from(nodeLevels.keys()).sort((a, b) => a - b);

    sortedLevels.forEach((l, index) => {
      const nodesInLevel = nodeLevels.get(l) || [];

      // Sort nodes within level to minimize crossing edges
      if (index > 0) {
        const prevLevelIndex = sortedLevels[index - 1];
        const prevLevelNodes = nodeLevels.get(prevLevelIndex) || [];
        nodesInLevel.sort((a, b) => {
          const parentsA = reverseDeps.get(a) || [];
          const parentsB = reverseDeps.get(b) || [];
          const avgIdxA =
            parentsA.reduce((sum, pId) => sum + prevLevelNodes.indexOf(pId), 0) /
            (parentsA.length || 1);
          const avgIdxB =
            parentsB.reduce((sum, pId) => sum + prevLevelNodes.indexOf(pId), 0) /
            (parentsB.length || 1);
          return avgIdxA - avgIdxB;
        });
      }

      // Use INDEX for X position, ensuring no visual gaps between sparse levels
      const calculatedX = index * (NODE_WIDTH + X_GAP);
      const levelHeight =
        nodesInLevel.reduce((sum, id) => sum + (nodeHeights.get(id) || 0) + Y_GAP, 0) - Y_GAP;
      let currentY = -levelHeight / 2;

      nodesInLevel.forEach((id) => {
        const rawNode = allNodesMap.get(id);
        if (!rawNode) return;
        const h = nodeHeights.get(id)!;

        // Get saved position from either scene or vignette data
        let savedX: number | undefined;
        let savedY: number | undefined;

        if (rawNode.type === 'scene') {
          const sceneData = rawNode.data as Scene;
          savedX = sceneData.mapX;
          savedY = sceneData.mapY;
        } else {
          const vigData = rawNode.data as Vignette;
          savedX = vigData.mapX;
          savedY = vigData.mapY;
        }

        const x = savedX ?? calculatedX;
        const y = savedY ?? currentY;

        positionedNodes.push({
          ...rawNode,
          x,
          y,
          level: l,
          height: h,
        });

        // Always increment currentY used for auto-stacking, 
        // even if node has a saved position, to maintain layout stability.
        currentY += h + Y_GAP;

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x + NODE_WIDTH);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y + h);
      });
    });

    // Note: Conclusion vignettes are no longer forced to a specific position.
    // They follow the same layout rules as other nodes. Users can manually
    // position them, and clicking "Reorganizar" will auto-arrange everything.

    // 5. Edges
    const createdEdges: Edge[] = [];
    const activeAnchorsSet = new Set<string>();

    positionedNodes.forEach((sourceNode) => {
      const linkingItems = getLinkingItems(sourceNode);
      const isStack =
        sourceNode.type === 'scene' &&
        (sourceNode.data as Scene).sceneType === 'hypercard_stack';
      const sceneData = isStack ? (sourceNode.data as Scene) : null;
      const cards = sceneData?.stackCards || [];

      linkingItems.forEach((item: any, index) => {
        const targetNode = positionedNodes.find((n) => n.id === item.targetId);
        if (!targetNode) return;

        const sBorder = 4;
        const tBorder = 4;

        let y1_offset: number;

        if (isStack && item.cardId && cards.length > 0) {
          let accumulatedY = sBorder + NODE_HEADER_HEIGHT;
          for (const card of cards) {
            const cardImageH = card.image ? SCENARIO_THUMBNAIL_HEIGHT : 0;
            const cardLinks = linkingItems.filter((it: any) => it.cardId === card.id);

            if (card.id === item.cardId) {
              const itemIdxInCard = cardLinks.findIndex((it: any) => it.id === item.id);
              accumulatedY +=
                cardImageH +
                itemIdxInCard * INTERACTION_ITEM_HEIGHT +
                INTERACTION_ITEM_HEIGHT / 2;
              break;
            } else {
              const cardInteractionsH = cardLinks.length * INTERACTION_ITEM_HEIGHT;
              accumulatedY += cardImageH + cardInteractionsH;
            }
          }
          y1_offset = accumulatedY;
        } else {
          const imagePadding = sourceNode.image ? THUMBNAIL_HEIGHT : 0;
          y1_offset =
            sBorder +
            NODE_HEADER_HEIGHT +
            imagePadding +
            index * INTERACTION_ITEM_HEIGHT +
            INTERACTION_ITEM_HEIGHT / 2;
        }

        const y2_offset = tBorder + NODE_HEADER_HEIGHT / 2;

        const sL = { x: sourceNode.x, y: sourceNode.y + y1_offset };
        const sR = { x: sourceNode.x + NODE_WIDTH, y: sourceNode.y + y1_offset };
        const tL = { x: targetNode.x, y: targetNode.y + y2_offset };
        const tR = { x: targetNode.x + NODE_WIDTH, y: targetNode.y + y2_offset };

        const combinations = [
          { s: sR, t: tL, sSide: 'R' as const, tSide: 'L' as const, sDir: 1, tDir: -1 },
          { s: sL, t: tR, sSide: 'L' as const, tSide: 'R' as const, sDir: -1, tDir: 1 },
          { s: sR, t: tR, sSide: 'R' as const, tSide: 'R' as const, sDir: 1, tDir: 1 },
          { s: sL, t: tL, sSide: 'L' as const, tSide: 'L' as const, sDir: -1, tDir: -1 },
        ];

        // Determine if this is a backward connection
        const isBackward = sourceNode.level >= targetNode.level;

        const preferred = isBackward
          ? combinations[1] // L -> R for backward
          : combinations[0]; // R -> L for forward

        createdEdges.push({
          source: sourceNode.id,
          target: targetNode.id,
          sourceItemId: item.id,
          sSide: preferred.sSide,
          tSide: preferred.tSide,
          sDir: preferred.sDir,
          tDir: preferred.tDir,
          isBackward,
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
        maxY: maxY === -Infinity ? NODE_HEADER_HEIGHT : maxY,
      },
      activeAnchors: activeAnchorsSet,
      // Compute orphan IDs: nodes that have no incoming or outgoing connections (excluding Opening/Victory/Defeat)
      orphanIds: new Set(
        positionedNodes
          .filter((n) => {
            // Skip special vignettes
            if (n.id === 'VNT_OPENING' || n.id === 'VNT_VICTORY' || n.id === 'VNT_DEFEAT')
              return false;
            // Check if node has any edges
            const hasOutgoing = createdEdges.some((e) => e.source === n.id);
            const hasIncoming = createdEdges.some((e) => e.target === n.id);
            return !hasOutgoing && !hasIncoming;
          })
          .map((n) => n.id)
      ),
    };
  }, [allScenesMap, vignettes, startSceneId, getLinkingItems]);

  const handleViewAll = useCallback(() => {
    if (!containerRef.current || initialNodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const paddingX = Math.min(100, rect.width * 0.1);
    const paddingY = Math.min(100, rect.height * 0.1);

    // Calculate content bounds
    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;

    // Calculate scale to fit
    // Check if width or height is valid to avoid division by zero
    if (contentWidth <= 0 || contentHeight <= 0) return;

    const scaleX = (rect.width - paddingX * 2) / contentWidth;
    const scaleY = (rect.height - paddingY * 2) / contentHeight;
    const newScale = Math.min(scaleX, scaleY, 1); // Cap at 1x

    // Calculate position to center
    const newX = rect.width / 2 - (bounds.minX + contentWidth / 2) * newScale;
    const newY = rect.height / 2 - (bounds.minY + contentHeight / 2) * newScale;

    setView({ x: newX, y: newY, scale: newScale });
  }, [initialNodes, bounds]);

  const centerNode = useCallback((targetNode: Node, targetScale?: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    setView(v => {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const newScale = targetScale || v.scale;
      
      const nodeCenterScaledX = (targetNode.x + NODE_WIDTH / 2) * newScale;
      const nodeCenterScaledY = (targetNode.y + targetNode.height / 2) * newScale;
      
      return { 
        ...v, 
        scale: newScale,
        x: centerX - nodeCenterScaledX,
        y: centerY - nodeCenterScaledY 
      };
    });
  }, []);

  const [nodes, setNodes] = useState(initialNodes);
  const [highlightOrphans, setHighlightOrphans] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  useEffect(() => {
    if (!dragInfo) setNodes(initialNodes);
  }, [initialNodes, dragInfo]);

  // Center and Zoom on selection change
  useEffect(() => {
    if (selectedSceneId && selectedSceneId !== lastFocusedId.current) {
      const node = nodes.find(n => n.id === selectedSceneId);
      if (node) {
        // Small delay to ensure the map is ready if coming from a different view
        const timer = setTimeout(() => {
          centerNode(node, 1.0);
          lastFocusedId.current = selectedSceneId;
        }, 50);
        return () => clearTimeout(timer);
      }
    } else if (!selectedSceneId) {
      lastFocusedId.current = null;
    }
  }, [selectedSceneId, nodes, centerNode]);

  const hasInitialFitted = useRef(false);

  useEffect(() => {
    if (hasInitialFitted.current) return;
    
    // Small timeout to ensure container has bounds before measuring
    const timer = setTimeout(() => {
      if (containerRef.current && initialNodes.length > 0) {
        handleViewAll();
        hasInitialFitted.current = true;
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [handleViewAll, initialNodes.length]);

  const handleZoom = useCallback(
    (direction: 'in' | 'out') => {
      if (!containerRef.current) return;
      const newScale = Math.max(
        0.2,
        Math.min(2, direction === 'in' ? view.scale * 1.2 : view.scale / 1.2)
      );
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const newX = centerX - (centerX - view.x) * (newScale / view.scale);
      const newY = centerY - (centerY - view.y) * (newScale / view.scale);
      setView({ x: newX, y: newY, scale: newScale });
    },
    [view]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      handleZoom(e.deltaY < 0 ? 'in' : 'out');
    },
    [handleZoom]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      setIsPanning(true);
      setPanStart({ x: e.clientX - view.x, y: e.clientY - view.y });
    },
    [view.x, view.y]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragInfo) {
        const newX = (e.clientX - view.x) / view.scale - dragInfo.offsetX;
        const newY = (e.clientY - view.y) / view.scale - dragInfo.offsetY;
        setNodes((currentNodes) =>
          currentNodes.map((n) => (n.id === dragInfo.id ? { ...n, x: newX, y: newY } : n))
        );
      } else if (isPanning) {
        if (mapTransformRef.current) {
          const newX = e.clientX - panStart.x;
          const newY = e.clientY - panStart.y;
          mapTransformRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) scale(${view.scale})`;
        }
      }
    },
    [isPanning, panStart, dragInfo, view.x, view.y, view.scale]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (dragInfo) {
        // Calculate total distance moved to differentiate between click and drag
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only save position if moved more than 5 pixels (standard drag threshold)
        if (distance > 5) {
          const finalNode = nodes.find((n) => n.id === dragInfo.id);
          if (finalNode) {
            if (finalNode.type === 'scene') {
              onUpdateScenePosition(finalNode.id, finalNode.x, finalNode.y);
            } else {
              onUpdateVignettePosition(finalNode.id, finalNode.x, finalNode.y);
            }
          }
        }
        setDragInfo(null);
      }
      if (isPanning) {
        setView((v) => ({ ...v, x: e.clientX - panStart.x, y: e.clientY - panStart.y }));
      }
      setIsPanning(false);
    },
    [dragInfo, isPanning, panStart.x, panStart.y, nodes, onUpdateScenePosition, onUpdateVignettePosition]
  );

  const handleToggleOrphans = useCallback(() => {
    setHighlightOrphans((prev) => {
      const next = !prev;
      if (next) {
        handleViewAll();
      }
      return next;
    });
  }, [handleViewAll]);

  useEffect(() => {
    if (!isPanning && !dragInfo) return;

    const onGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e as unknown as React.MouseEvent);
    };

    const onGlobalMouseUp = (e: MouseEvent) => {
      handleMouseUp(e as unknown as React.MouseEvent);
    };

    window.addEventListener('mousemove', onGlobalMouseMove);
    window.addEventListener('mouseup', onGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove);
      window.removeEventListener('mouseup', onGlobalMouseUp);
    };
  }, [isPanning, dragInfo, handleMouseMove, handleMouseUp]);

  return (
    <div className="h-full flex flex-col relative w-full">
      <div
        ref={containerRef}
        className={`w-full h-full bg-background overflow-hidden ${isPanning || dragInfo ? 'cursor-grabbing' : 'cursor-grab'} shadow-inner relative select-none`}
        onWheel={handleWheel}
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={handleCanvasMouseDown}
      >


        {/* CONTROLS OVERLAY - Top Left Creation Buttons */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 w-[160px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddNode?.('vignette');
            }}
            className={`w-full flex items-center justify-start px-3 h-[42px] font-bold rounded-lg transition-all active:scale-95 text-xs bg-white text-zinc-950 hover:bg-zinc-200 hover:text-zinc-950 border border-transparent whitespace-nowrap shadow-sm`}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            {t('sceneList.nodeSelection.vignette.title', 'Criar Capítulo')}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hasOpeningVignette) onAddNode?.('scene');
            }}
            disabled={!hasOpeningVignette}
            className={`w-full flex items-center justify-start px-3 h-[42px] font-bold rounded-lg transition-all active:scale-95 text-xs border border-transparent whitespace-nowrap shadow-sm ${
              !hasOpeningVignette 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed grayscale' 
                : `bg-white text-zinc-950 hover:bg-zinc-200 hover:text-zinc-950`
            }`}
            title={!hasOpeningVignette ? t('sceneList.nodeSelection.scene.lockedDesc', 'Crie um capítulo de abertura para habilitar ramificações.') : ''}
          >
            <Split className="w-4 h-4 mr-2 rotate-90" />
            {t('sceneList.nodeSelection.scene.title', 'Criar Ramificação')}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hasOpeningVignette) onAddNode?.('hypercard_stack');
            }}
            disabled={!hasOpeningVignette}
            className={`w-full flex items-center justify-start px-3 h-[42px] font-bold rounded-lg transition-all active:scale-95 text-xs border border-transparent whitespace-nowrap shadow-sm ${
              !hasOpeningVignette 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed grayscale' 
                : `bg-white text-zinc-950 hover:bg-zinc-200 hover:text-zinc-950`
            }`}
            title={!hasOpeningVignette ? t('sceneList.nodeSelection.scene.lockedDesc', 'Crie um capítulo de abertura para habilitar cenários.') : ''}
          >
            <Layers className="w-4 h-4 mr-2" />
            {t('sceneList.nodeSelection.hypercard.title', 'Criar Cenário')}
          </button>
        </div>

        <div
          ref={mapTransformRef}
          className=""
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
            transformOrigin: '0 0',
          }}
        >
            <div
            className="absolute pointer-events-none text-primary opacity-50"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1px)',
              backgroundSize: '25px 25px',
              top: -250000,
              left: -250000,
              width: 500000,
              height: 500000,
              zIndex: -1
            }}
          />
          <svg
            className="absolute"
            width={Math.max(1000, bounds.maxX + 1000)}
            height={Math.max(1000, bounds.maxY + 1000)}
            style={{ transform: `translate(0px, 0px)`, zIndex: 0, overflow: 'visible' }}
          >
            <defs>
              <marker
                id="arrow-white"
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" fillOpacity="1" />
              </marker>
            </defs>
            {edges.map((edge, i) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const linkingItems = getLinkingItems(sourceNode);
              const itemIndex = linkingItems.findIndex((item) => item.id === edge.sourceItemId);
              const sBorder = 4;
              const tBorder = 4;

              const isStack =
                sourceNode.type === 'scene' &&
                (sourceNode.data as Scene).sceneType === 'hypercard_stack';
              const sceneData = isStack ? (sourceNode.data as Scene) : null;
              const cards = sceneData?.stackCards || [];

              let y1_offset: number;
              if (isStack && edge.sourceItemId && cards.length > 0) {
                const item = linkingItems.find((it) => it.id === edge.sourceItemId);
                if (item && (item as any).cardId) {
                  let accumulatedY = sBorder + NODE_HEADER_HEIGHT;
                  for (const card of cards) {
                    const cardImageH = card.image ? SCENARIO_THUMBNAIL_HEIGHT : 0;
                    const cardLinks = linkingItems.filter((it: any) => it.cardId === card.id);

                    if (card.id === (item as any).cardId) {
                      const itemIdxInCard = cardLinks.findIndex((it: any) => it.id === item.id);
                      accumulatedY +=
                        cardImageH +
                        (itemIdxInCard >= 0 ? itemIdxInCard : 0) * INTERACTION_ITEM_HEIGHT +
                        INTERACTION_ITEM_HEIGHT / 2;
                      break;
                    } else {
                      const cardInteractionsH = cardLinks.length * INTERACTION_ITEM_HEIGHT;
                      accumulatedY += cardImageH + cardInteractionsH;
                    }
                  }
                  y1_offset = accumulatedY;
                } else {
                  const imagePadding = sourceNode.image ? THUMBNAIL_HEIGHT : 0;
                  y1_offset =
                    sBorder +
                    NODE_HEADER_HEIGHT +
                    imagePadding +
                    (itemIndex >= 0 ? itemIndex : 0) * INTERACTION_ITEM_HEIGHT +
                    INTERACTION_ITEM_HEIGHT / 2;
                }
              } else {
                const imagePadding = sourceNode.image ? THUMBNAIL_HEIGHT : 0;
                y1_offset =
                  sBorder +
                  NODE_HEADER_HEIGHT +
                  imagePadding +
                  (itemIndex >= 0 ? itemIndex : 0) * INTERACTION_ITEM_HEIGHT +
                  INTERACTION_ITEM_HEIGHT / 2;
              }
              const y2_offset = tBorder + NODE_HEADER_HEIGHT / 2;

              const realX1 = sourceNode.x + (edge.sSide === 'L' ? 0 : NODE_WIDTH);
              const realY1 = sourceNode.y + y1_offset;
              const realX2 = targetNode.x + (edge.tSide === 'L' ? 0 : NODE_WIDTH);
              const realY2 = targetNode.y + y2_offset;

              const dx = Math.abs(realX2 - realX1);
              const dy = Math.abs(realY2 - realY1);
              const offset = Math.max(50, Math.min(150, dx * 0.5 + dy * 0.2));

              const cx1 = realX1 + offset * edge.sDir;
              const cx2 = realX2 + offset * edge.tDir;

              return (
                <path
                  key={`${edge.source}-${edge.target}-${i}`}
                  d={`M ${realX1} ${realY1} C ${cx1} ${realY1}, ${cx2} ${realY2}, ${realX2} ${realY2}`}
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeOpacity="1"
                  strokeDasharray={edge.isBackward ? '6 4' : undefined}
                  fill="none"
                  markerEnd="url(#arrow-white)"
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const linkingItems = getLinkingItems(node);

            // --- VIGNETTE NODE STYLE (Legacy Vignettes in vignettes array) ---
            if (node.type === 'vignette') {
              const vig = node.data as Vignette;
              const isOpening = vig.id === 'VNT_OPENING';
              const isConclusion = vig.isConclusion;

              // Color Logic: Blue (Opening), Red (Chapter / Vignette)
              let colorBase = 'red';
              if (isOpening) colorBase = 'blue';

              const borderClass = `border-${colorBase}-500 border-4`;
              const shadowClass = `hover:shadow-${colorBase}-500/10 hover:border-${colorBase}-400`;


              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    const nodeRef = nodes.find((n) => n.id === node.id);
                    if (!nodeRef) return;
                    dragStartPos.current = { x: e.clientX, y: e.clientY };
                    setDragInfo({
                      id: node.id,
                      offsetX: (e.clientX - view.x) / view.scale - nodeRef.x,
                      offsetY: (e.clientY - view.y) / view.scale - nodeRef.y,
                    });
                  }}
                  onClick={(e) => {
                    const dx = e.clientX - dragStartPos.current.x;
                    const dy = e.clientY - dragStartPos.current.y;
                    if (Math.sqrt(dx * dx + dy * dy) < 5) {
                      const isAlreadySelected = selectedSceneId === node.id;
                      onSelectScene(isAlreadySelected ? null : node.id);
                    }
                  }}
                  className={`absolute z-${selectedSceneId === node.id ? '50' : '0'}`}
                  style={{
                    transform: `translate(${node.x}px, ${node.y}px)`,
                    userSelect: 'none',
                  }}
                >
                  {/* Delete Button - Attached on top right */}
                  {selectedSceneId === node.id && !isOpening && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteScene(node.id);
                      }}
                      className="absolute bottom-full right-0 w-10 h-8 bg-red-600 hover:bg-red-500 text-white flex items-center justify-center z-[60] transition-colors shadow-lg rounded-t-lg rounded-b-none border-t-2 border-x-2 border-white/20"
                      title={t('sceneList.deleteScene', 'Deletar ramificação')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div 
                    className={`bg-zinc-900 rounded-xl flex flex-col ${dragInfo?.id === node.id ? '' : 'transition-all duration-300'} ${borderClass} cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${shadowClass} overflow-hidden group`}
                    style={{
                      width: NODE_WIDTH,
                      height: node.height,
                    }}
                  >
                  <div
                    className="p-3 relative flex-shrink-0 text-center bg-zinc-900/50"
                    style={{ height: NODE_HEADER_HEIGHT }}
                  >
                    {/* Anchors */}
                    {!isOpening && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-3.5 h-3.5 rounded-[2px] z-20 bg-white"
                      />
                    )}
                    {!isOpening && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-3.5 h-3.5 rounded-[2px] z-20 bg-white"
                      />
                    )}

                    <h3 className="font-bold text-zinc-100 truncate text-sm">
                      {node.title || t('sceneMap.noTitle', '(Sem Título)')}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider truncate">
                      (ID: {node.id})
                    </p>
                    {isOpening && (
                      <p className="text-[10px] font-bold text-sky-400 mt-1 uppercase tracking-widest">
                        {t('sceneMap.opening', 'Abertura')}
                      </p>
                    )}
                    {isConclusion && (
                      <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                        {t('sceneMap.conclusion', 'Conclusão')}
                      </p>
                    )}
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

                  {/* Outgoing Links (Next Scene) */}
                  {linkingItems.length > 0 && (
                    <div className="flex flex-col border-t border-muted-foreground/50">
                      {linkingItems.map((item) => (
                        <div
                          key={item.id}
                          className={`relative font-bold flex items-center justify-center w-full flex-shrink-0 border-t border-muted-foreground/30 first:border-t-0 ${isConclusion ? 'text-zinc-400 bg-zinc-100/5' : isOpening ? 'text-sky-500 bg-sky-500/5' : 'text-amber-500 bg-amber-500/5'}`}
                          style={{ height: INTERACTION_ITEM_HEIGHT }}
                        >
                          <div
                            className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-3.5 h-3.5 rounded-[2px] z-20 bg-white"
                          />
                          <span className="truncate px-4 text-center w-full text-[10px] uppercase tracking-wider font-bold">
                            {item.label}
                          </span>
                          <div
                            className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-3.5 h-3.5 rounded-[2px] z-20 bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
            }

            // --- STANDARD SCENE NODE STYLE ---
            const scene = node.data as Scene;

            // Color Rules: Opening = Blue, Chapter/Vignette = Red, Stack = Emerald, Ending = White, Normal Branch = Amber
            const isVignetteOpening = scene.vignetteType === 'opening';
            const isVignetteTransition = scene.vignetteType === 'transition';
            const isVignetteConclusion = scene.vignetteType === 'conclusion';
            const isChapter = isVignetteTransition || isVignetteConclusion || (scene.sceneType === 'vignette' && !isVignetteOpening);
            const isStack = scene.sceneType === 'hypercard_stack';
            const isEnding = scene.isEndingScene;
            const isOrphan = highlightOrphans && orphanIds.has(node.id);

            // Determine color base
            let colorBase = 'amber';
            if (isOrphan) colorBase = 'red';
            else if (isStack) colorBase = 'emerald';
            else if (isEnding) colorBase = 'white';
            else if (isVignetteOpening) colorBase = 'blue';
            else if (isChapter) colorBase = 'red';

            const borderColorClass = isOrphan
              ? 'border-red-500 animate-pulse'
              : isStack
                ? 'border-emerald-500 border-4'
                : isEnding
                  ? 'border-white border-4'
                  : isVignetteOpening
                    ? 'border-blue-500 border-4'
                    : isChapter
                      ? 'border-red-500 border-4'
                      : 'border-amber-500 border-4';

            const isSelected = selectedSceneId === node.id;
            
            return (
              <div
                key={node.id}
                data-node-id={node.id}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const nodeRef = nodes.find((n) => n.id === node.id);
                  if (!nodeRef) return;
                  dragStartPos.current = { x: e.clientX, y: e.clientY };
                  setDragInfo({
                    id: node.id,
                    offsetX: (e.clientX - view.x) / view.scale - nodeRef.x,
                    offsetY: (e.clientY - view.y) / view.scale - nodeRef.y,
                  });
                }}
                onClick={(e) => {
                  const dx = e.clientX - dragStartPos.current.x;
                  const dy = e.clientY - dragStartPos.current.y;
                  if (Math.sqrt(dx * dx + dy * dy) < 5) {
                    const isAlreadySelected = selectedSceneId === node.id;
                    onSelectScene(isAlreadySelected ? null : node.id);
                  }
                }}
                className={`absolute z-${isSelected ? '50' : '0'}`}
                style={{
                  transform: `translate(${node.x}px, ${node.y}px)`,
                  userSelect: 'none',
                }}
              >
                {/* Delete Button - Attached on top right */}
                {isSelected && !node.isStart && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteScene(node.id);
                    }}
                    className="absolute bottom-full right-0 w-10 h-8 bg-red-600 hover:bg-red-500 text-white flex items-center justify-center z-[60] transition-colors shadow-lg rounded-t-lg rounded-b-none border-t-2 border-x-2 border-white/20"
                    title={t('sceneList.deleteScene', 'Deletar ramificação')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div 
                  className={`bg-zinc-900 rounded-xl flex flex-col ${dragInfo?.id === node.id ? '' : 'transition-all duration-300'} border-2 ${borderColorClass} cursor-pointer hover:border-${colorBase}-400 overflow-hidden group ${isSelected ? 'shadow-[0_0_50px_rgba(255,255,255,0.7)]' : 'shadow-[0_10px_30px_rgba(0,0,0,0.3)]'}`}
                  style={{
                    width: NODE_WIDTH,
                    height: node.height,
                  }}
                >
                <div
                  className="p-2.5 relative flex-shrink-0 text-center bg-zinc-900/50 flex flex-col justify-center items-center"
                  style={{ height: NODE_HEADER_HEIGHT }}
                >
                  {/* Anchor Points Visualization */}
                  {!node.isStart && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-3.5 h-3.5 rounded-[2px] z-20 bg-white"
                    />
                  )}
                  {/* Although anchors are strictly computed, we show right anchor visually if there are inputs from right? No, inputs always Left. Outputs always Right. */}

                  <div className="flex items-center justify-center gap-1.5 px-1 max-w-full">
                    {isStack && <Layers className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                    <h3 className="font-bold text-zinc-100 truncate text-sm">{node.name}</h3>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    (ID: {node.id})
                  </p>
                  {isVignetteOpening && (
                    <p className="text-[10px] font-bold text-sky-400 mt-1 uppercase tracking-widest">
                      {t('sceneMap.opening', 'Abertura')}
                    </p>
                  )}
                  {isEnding && !isChapter && (
                    <p className="text-[10px] font-bold text-white mt-1 uppercase tracking-widest">
                      {t('sceneMap.ending', 'Final')}
                    </p>
                  )}
                </div>

                {isStack && scene.stackCards && scene.stackCards.length > 0 ? (
                  <div className="flex flex-col">
                    {scene.stackCards.map((card) => {
                      const cardLinks = linkingItems.filter((it: any) => it.cardId === card.id);
                      return (
                        <div key={card.id} className="flex flex-col border-t border-muted-foreground/40 first:border-t-0">
                          {/* Imagem da Vista (reduzida em 1/3 = 94px) */}
                          {card.image && (
                            <div
                              className="w-full bg-black relative flex-shrink-0"
                              style={{ height: SCENARIO_THUMBNAIL_HEIGHT }}
                            >
                              <img
                                src={card.image}
                                alt={card.name}
                                className="w-full h-full object-cover opacity-85"
                                style={{ pointerEvents: 'none' }}
                              />
                            </div>
                          )}

                          {/* Áreas Interativas da Vista coladas diretamente */}
                          {cardLinks.length > 0 && (
                            <div className="flex flex-col border-t border-muted-foreground/40">
                              {cardLinks.map((item) => {
                                const displayLabel = item.label;
                                const linkColor = `text-emerald-400 bg-emerald-500/10`;
                                const isLeftActive = activeAnchors.has(`${item.id}-L`);
                                const isRightActive = activeAnchors.has(`${item.id}-R`);

                                return (
                                  <div
                                    key={item.id}
                                    className={`relative ${linkColor} font-bold flex items-center justify-center w-full flex-shrink-0 border-t border-muted-foreground/20 first:border-t-0`}
                                    style={{ height: INTERACTION_ITEM_HEIGHT }}
                                  >
                                    {isLeftActive && (
                                      <div
                                        className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-3.5 h-3.5 rounded-[2px] z-20 bg-white"
                                      />
                                    )}
                                    <span
                                      className="truncate px-4 text-center w-full text-[10px] uppercase tracking-wider font-bold"
                                      title={displayLabel}
                                    >
                                      {displayLabel}
                                    </span>
                                    {isRightActive && (
                                      <div
                                        className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-3.5 h-3.5 rounded-[2px] z-20 bg-white"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
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
                      <div className="flex flex-col border-t border-muted-foreground/50">
                        {linkingItems.map((item) => {
                          let displayLabel = item.label;
                          // Logic for detailed label recovery if needed for Parser
                          if (gameInteractionType === 'parser' && item.original && !(item as any).isHotspot) {
                            const inter = item.original;
                            const actionText = inter.verbs?.[0] || t('sceneMap.action', 'Ação');
                            const reqObj = inter.requiresInInventory
                              ? globalObjects[inter.requiresInInventory]
                              : null;
                            const targetObj = inter.target ? globalObjects[inter.target] : null;
                            displayLabel = `${actionText}${reqObj ? ' ' + reqObj.name : ''}${targetObj ? ' ' + targetObj.name : ''}`;
                          }

                          const isVignetteLink = item.type === 'vignette';
                          const linkColor = isVignetteLink
                            ? 'text-amber-500 bg-amber-500/5'
                            : `text-${colorBase}-400 bg-${colorBase}-500/5`;

                          const isLeftActive = activeAnchors.has(`${item.id}-L`);
                          const isRightActive = activeAnchors.has(`${item.id}-R`);

                          return (
                            <div
                              key={item.id}
                              className={`relative ${linkColor} font-bold flex items-center justify-center w-full flex-shrink-0 border-t border-muted-foreground/30 first:border-t-0`}
                              style={{ height: INTERACTION_ITEM_HEIGHT }}
                            >
                              {isLeftActive && (
                                <div
                                  className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-3.5 h-3.5 rounded-[2px] z-20 bg-white"
                                />
                              )}
                              <span
                                className="truncate px-4 text-center w-full text-[10px] uppercase tracking-wider font-bold"
                                title={displayLabel}
                              >
                                {displayLabel}
                              </span>
                              {isRightActive && (
                                <div
                                  className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-3.5 h-3.5 rounded-[2px] z-20 bg-white"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-10 flex flex-col items-start gap-2 transition-all duration-300">
        
        <div className={`w-fit min-w-[150px] backdrop-blur-md px-4 py-3.5 rounded-xl shadow-xl pointer-events-auto border bg-zinc-950/80 border-muted-foreground/50`}>
          <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-3 text-zinc-500`}>
            {t('sceneMap.legend', 'Legenda')}
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-[2px] border-2 border-blue-500 bg-blue-500/20 shrink-0"></div>
              <span className={`text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap`}>
                {t('sceneMap.opening', 'Abertura')}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-[2px] border-2 border-amber-500 bg-amber-500/20 shrink-0"></div>
              <span className={`text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap`}>
                {t('sceneMap.branch', 'Ramificação')}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-[2px] border-2 border-red-500 bg-red-500/20 shrink-0"></div>
              <span className={`text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap`}>
                {t('sceneMap.vignette', 'Capítulo')}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-[2px] border-2 border-emerald-500 bg-emerald-500/20 shrink-0"></div>
              <span className={`text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap`}>
                {t('sceneMap.scenario', 'Cenário')}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-[2px] border-2 border-white bg-white/20 shrink-0"></div>
              <span className={`text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap`}>
                {t('sceneMap.ending', 'Final')}
              </span>
            </li>
          </ul>
        </div>

        {/* Map Actions Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReorganizeScenes}
            className={`flex items-center justify-center px-4 h-[42px] font-bold rounded-lg transition-all shadow-xl active:scale-95 text-xs border bg-zinc-800 text-zinc-200 border-muted-foreground/50 hover:bg-primary ${hoverTextClass} hover:border-primary`}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            {t('sceneMap.reorganize', 'Reorganizar')}
          </button>
          <button
            onClick={handleViewAll}
            className={`flex items-center justify-center px-4 h-[42px] font-bold rounded-lg transition-all shadow-xl active:scale-95 text-xs border bg-zinc-800 text-zinc-200 border-muted-foreground/50 hover:bg-primary ${hoverTextClass} hover:border-primary`}
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            {t('sceneMap.viewAll', 'Ver Tudo')}
          </button>
          <button
            onClick={handleToggleOrphans}
            className={`flex items-center justify-center px-4 h-[42px] font-bold rounded-lg transition-all shadow-xl active:scale-95 text-xs border ${
              highlightOrphans
                ? 'bg-red-600 text-white border-red-500 hover:bg-red-700'
                : `bg-zinc-800 text-zinc-200 border-muted-foreground/50 hover:bg-primary ${hoverTextClass} hover:border-primary`
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {t('sceneMap.orphans', 'Órfãs')} {orphanIds.size > 0 && `(${orphanIds.size})`}
          </button>
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className={`flex items-center justify-center px-4 h-[42px] font-bold rounded-lg transition-all shadow-xl active:scale-95 text-xs border bg-zinc-800 text-zinc-200 border-muted-foreground/50 hover:bg-primary hover:text-white hover:border-primary`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {t('sceneMap.statistics', 'Estatísticas')}
          </button>
        </div>
      </div>

      {/* Zoom Container */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center gap-2 transition-all duration-300">
        <button
          onClick={() => handleZoom('out')}
          className={`flex items-center justify-center px-4 h-[42px] font-bold rounded-lg transition-all shadow-xl active:scale-95 text-xs border bg-zinc-800 text-zinc-200 border-muted-foreground/50 hover:bg-primary ${hoverTextClass} hover:border-primary w-full`}
        >
          <ZoomOut className="w-4 h-4 mr-2" />
          Zoom Out
        </button>
        <button
          onClick={() => handleZoom('in')}
          className={`flex items-center justify-center px-4 h-[42px] font-bold rounded-lg transition-all shadow-xl active:scale-95 text-xs border bg-zinc-800 text-zinc-200 border-muted-foreground/50 hover:bg-primary ${hoverTextClass} hover:border-primary w-full`}
        >
          <ZoomIn className="w-4 h-4 mr-2" />
          Zoom In
        </button>
      </div>

      <EditorStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        onSceneClick={onSelectScene}
        gameData={{
          scenes: allScenesMap,
          globalObjects: globalObjects,
          vignettes: vignettes,
          // Outros campos podem ser repassados se necessário, 
          // mas o statsCalculator foca nestes.
          gameTitle: gameTitle || '' 
        } as GameData}
      />
    </div>
  );
};

export default SceneMap;
