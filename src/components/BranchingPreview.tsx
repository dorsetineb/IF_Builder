import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Scene, Interaction } from '../types';

interface BranchingPreviewProps {
    currentScene: Scene;
    allScenes: Scene[];
}

const BranchingPreview: React.FC<BranchingPreviewProps> = ({ currentScene, allScenes }) => {
    const { t } = useTranslation();

    const getNodeColor = (scene: Scene | { vignetteType?: string, isEndingScene?: boolean }) => {
        if (scene.isEndingScene || scene.vignetteType === 'conclusion') return 'green';
        if (scene.vignetteType === 'opening' || scene.vignetteType === 'transition') return 'blue';
        return 'amber';
    };

    // Calculate Inputs (Scenes that link TO this scene)
    const incomingConnections = useMemo(() => {
        const sources = new Map<string, { name: string, color: string }>();
        allScenes.forEach(scene => {
            if (scene.id === currentScene.id) return;
            let linked = false;
            // Check interactions
            scene.interactions.forEach(inter => {
                if (inter.goToScene === currentScene.id) linked = true;
            });
            // Check choices
            if (scene.choices) {
                scene.choices.forEach(choice => {
                    if (choice.targetSceneId === currentScene.id) linked = true;
                });
            }
            // Check vignette
            if (scene.vignetteNextSceneId === currentScene.id) {
                linked = true;
            }

            if (linked) {
                sources.set(scene.id, {
                    name: scene.name,
                    color: getNodeColor(scene)
                });
            }
        });
        return Array.from(sources.values()).slice(0, 5); // Limit to 5 for display
    }, [allScenes, currentScene.id]);

    // Calculate Outputs (Scenes linked FROM this scene)
    const outgoingConnections = useMemo(() => {
        const targets = new Map<string, { name: string, color: string }>();
        // Interactions
        currentScene.interactions.forEach(inter => {
            if (inter.goToScene) {
                const targetScene = allScenes.find(s => s.id === inter.goToScene);
                if (targetScene) targets.set(targetScene.id, { name: targetScene.name, color: getNodeColor(targetScene) });
            }
        });
        // Choices
        if (currentScene.choices) {
            currentScene.choices.forEach(choice => {
                if (choice.targetSceneId) {
                    const targetScene = allScenes.find(s => s.id === choice.targetSceneId);
                    if (targetScene) targets.set(targetScene.id, { name: targetScene.name, color: getNodeColor(targetScene) });
                }
            });
        }
        // Vignette
        if (currentScene.vignetteNextSceneId) {
            if (currentScene.vignetteNextSceneId === 'END_GAME') {
                targets.set('END_GAME', {
                    name: t('branchingPreview.endGame', 'Fim de Jogo'),
                    color: 'green'
                });
            } else {
                const targetScene = allScenes.find(s => s.id === currentScene.vignetteNextSceneId);
                if (targetScene) targets.set(targetScene.id, { name: targetScene.name, color: getNodeColor(targetScene) });
            }
        }
        return Array.from(targets.values()).slice(0, 5); // Limit to 5 for display
    }, [currentScene, allScenes]);

    const currentColor = getNodeColor(currentScene);
    const currentColorClasses = {
        border: currentColor === 'amber' ? 'border-amber-500/50' : currentColor === 'blue' ? 'border-blue-500/50' : 'border-green-500/50',
        text: currentColor === 'amber' ? 'text-amber-400' : currentColor === 'blue' ? 'text-blue-400' : 'text-green-400',
        shadow: currentColor === 'amber' ? 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' : currentColor === 'blue' ? 'shadow-[0_0_15_rgba(59,130,246,0.15)]' : 'shadow-[0_0_15_rgba(34,197,94,0.15)]',
    };

    return (
        <div className="relative w-full min-h-[240px] bg-zinc-950/50 rounded-lg border border-zinc-800 flex items-center justify-center overflow-hidden py-4">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                opacity: 0.2
            }}></div>

            <div className="relative z-10 flex items-center justify-between w-full px-8 max-w-2xl">

                {/* Inputs Node */}
                <div className="flex flex-col gap-2 items-end w-1/4">
                    {incomingConnections.length > 0 ? (
                        incomingConnections.map((node, i) => (
                            <div key={i} className={`px-3 py-2 border rounded text-[10px] truncate max-w-full text-center shadow-lg w-full
                                ${node.color === 'amber' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200/70' :
                                    node.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30 text-blue-200/70' :
                                        'bg-green-500/10 border-green-500/30 text-green-200/70'}`}>
                                {node.name}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 bg-zinc-900/50 border border-zinc-800 border-dashed rounded text-[10px] text-zinc-600 italic w-full text-center">
                            {t('branchingPreview.noOrigin', 'Sem origem')}
                        </div>
                    )}
                    {incomingConnections.length >= 5 && <div className="text-[9px] text-zinc-600 text-center">...</div>}
                </div>

                {/* Connection Lines (Simplified SVG) */}
                <div className="flex-grow mx-4 relative h-10">
                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                        {/* Left to Center */}
                        <path d="M 0,20 L 100%,20" vectorEffect="non-scaling-stroke" stroke="#52525b" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                        <circle cx="50%" cy="20" r="3" fill="#52525b" />
                    </svg>
                </div>

                {/* Current Scene Node - Center Stage */}
                <div className="w-1/4 flex-shrink-0 z-20">
                    <div className={`px-4 py-3 bg-zinc-900 border-2 rounded-lg flex flex-col items-center ${currentColorClasses.border} ${currentColorClasses.shadow}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${currentColorClasses.text}`}>
                            {currentScene.vignetteType && currentScene.vignetteType !== 'none'
                                ? t('branchingPreview.thisVignette', 'Esta Vinheta')
                                : t('branchingPreview.thisScene', 'Esta Cena')}
                        </span>
                    </div>
                </div>

                {/* Connection Lines Right */}
                <div className="flex-grow mx-4 relative h-10">
                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                        <path d="M 0,20 L 100%,20" vectorEffect="non-scaling-stroke" stroke="#52525b" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                        <circle cx="50%" cy="20" r="3" fill="#52525b" />
                    </svg>
                </div>

                {/* Outputs Node */}
                <div className="flex flex-col gap-2 items-start w-1/4">
                    {outgoingConnections.length > 0 ? (
                        outgoingConnections.map((node, i) => (
                            <div key={i} className={`px-3 py-2 border rounded text-[10px] truncate max-w-full text-center shadow-lg w-full
                                ${node.color === 'amber' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200/70' :
                                    node.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30 text-blue-200/70' :
                                        'bg-green-500/10 border-green-500/30 text-green-200/70'}`}>
                                {node.name}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 bg-zinc-900/50 border border-zinc-800 border-dashed rounded text-[10px] text-zinc-600 italic w-full text-center">
                            {t('branchingPreview.noDestination', 'Sem destino')}
                        </div>
                    )}
                    {outgoingConnections.length >= 5 && <div className="text-[9px] text-zinc-600 text-center">...</div>}
                </div>
            </div>
        </div>
    );
};

export default BranchingPreview;
