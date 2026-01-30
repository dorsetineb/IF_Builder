import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Scene, Interaction } from '../types';

interface BranchingPreviewProps {
    currentScene: Scene;
    allScenes: Scene[];
}

const BranchingPreview: React.FC<BranchingPreviewProps> = ({ currentScene, allScenes }) => {
    const { t } = useTranslation();
    // Calculate Inputs (Scenes that link TO this scene)
    const incomingConnections = useMemo(() => {
        const sources = new Set<string>();
        allScenes.forEach(scene => {
            if (scene.id === currentScene.id) return;
            // Check interactions
            scene.interactions.forEach(inter => {
                if (inter.goToScene === currentScene.id) sources.add(scene.name);
            });
            // Check choices
            if (scene.choices) {
                scene.choices.forEach(choice => {
                    if (choice.targetSceneId === currentScene.id) sources.add(scene.name);
                });
            }
            // Check vignette
            if (scene.vignetteNextSceneId === currentScene.id) {
                sources.add(scene.name);
            }
        });
        return Array.from(sources).slice(0, 5); // Limit to 5 for display
    }, [allScenes, currentScene.id]);

    // Calculate Outputs (Scenes linked FROM this scene)
    const outgoingConnections = useMemo(() => {
        const targets = new Set<string>();
        // Interactions
        currentScene.interactions.forEach(inter => {
            if (inter.goToScene) {
                const targetScene = allScenes.find(s => s.id === inter.goToScene);
                if (targetScene) targets.add(targetScene.name);
            }
        });
        // Choices
        if (currentScene.choices) {
            currentScene.choices.forEach(choice => {
                if (choice.targetSceneId) {
                    const targetScene = allScenes.find(s => s.id === choice.targetSceneId);
                    if (targetScene) targets.add(targetScene.name);
                }
            });
        }
        // Vignette
        if (currentScene.vignetteNextSceneId) {
            if (currentScene.vignetteNextSceneId === 'END_GAME') {
                targets.add(t('branching.endGame'));
            } else {
                const targetScene = allScenes.find(s => s.id === currentScene.vignetteNextSceneId);
                if (targetScene) targets.add(targetScene.name);
            }
        }
        return Array.from(targets).slice(0, 5); // Limit to 5 for display
    }, [currentScene, allScenes]);

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
                        incomingConnections.map((name, i) => (
                            <div key={i} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-400 truncate max-w-full text-center shadow-lg w-full">
                                {name}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 bg-zinc-900/50 border border-zinc-800 border-dashed rounded text-[10px] text-zinc-600 italic w-full text-center">
                            {t('branching.noIncoming')}
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
                    <div className="px-4 py-3 bg-zinc-900 border-2 border-purple-500/50 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.15)] flex flex-col items-center">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest whitespace-nowrap">{t('branching.thisScene')}</span>
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
                        outgoingConnections.map((name, i) => (
                            <div key={i} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-400 truncate max-w-full text-center shadow-lg w-full">
                                {name}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 bg-zinc-900/50 border border-zinc-800 border-dashed rounded text-[10px] text-zinc-600 italic w-full text-center">
                            {t('branching.noOutgoing')}
                        </div>
                    )}
                    {outgoingConnections.length >= 5 && <div className="text-[9px] text-zinc-600 text-center">...</div>}
                </div>
            </div>
        </div>
    );
};

export default BranchingPreview;
