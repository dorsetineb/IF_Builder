import React from 'react';
import { useTranslation } from 'react-i18next';
import { Split, ArrowRight } from 'lucide-react';

interface NodeTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: 'scene' | 'vignette') => void;
    hasOpeningVignette: boolean;
}

const NodeTypeModal: React.FC<NodeTypeModalProps> = ({ isOpen, onClose, onSelect, hasOpeningVignette }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 md:p-12 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vignette Option - NOW FIRST */}
                        <button
                            onClick={() => onSelect('vignette')}
                            className="bg-card hover:bg-muted border border-muted-foreground/50 rounded-3xl group flex flex-col items-center justify-center p-12 text-center transition-all duration-300 relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 via-purple-500/0 to-purple-500/5 group-hover:to-purple-500/10 transition-colors" />

                            <div className="w-16 h-16 rounded-2xl bg-background border border-muted-foreground/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-purple-500/30 transition-all duration-300">
                                <ArrowRight size={32} className="text-muted-foreground group-hover:text-purple-400 transition-colors" />
                            </div>

                            <h3 className="text-2xl font-bold text-foreground mb-3">
                                {t('sceneList.nodeSelection.vignette.title', 'Capítulo')}
                            </h3>

                            <p className="whitespace-pre-line text-muted-foreground text-sm max-w-xs mb-8 group-hover:text-foreground transition-colors">
                                {!hasOpeningVignette
                                    ? t('sceneList.nodeSelection.vignette.openingRequired', 'Comece sua história aqui.\nO primeiro capítulo de abertura.')
                                    : t('sceneList.nodeSelection.vignette.description', 'Uma ponte narrativa.\nConecte pontos da história.')}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-2 mt-auto">
                                {!hasOpeningVignette ? (
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded">
                                        {t('sceneList.nodeSelection.vignette.tags.opening', 'ABERTURA')}
                                    </span>
                                ) : (
                                    (t('sceneList.nodeSelection.vignette.tags', { returnObjects: true, defaultValue: ['LINEAR', 'FIXO', 'ATMOSFERA'] }) as string[]).map((tag: string, index: number) => (
                                        <span key={index} className="text-[10px] uppercase font-bold tracking-wider text-purple-500 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))
                                )}
                            </div>
                        </button>

                        {/* Scene Option - NOW SECOND */}
                        <button
                            onClick={() => hasOpeningVignette && onSelect('scene')}
                            disabled={!hasOpeningVignette}
                            className={`bg-card border border-muted-foreground/50 rounded-3xl group flex flex-col items-center justify-center p-12 text-center transition-all duration-300 relative overflow-hidden shadow-2xl ${!hasOpeningVignette ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-muted'
                                }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/0 to-blue-500/5 group-hover:to-blue-500/10 transition-colors" />

                            <div className="w-16 h-16 rounded-2xl bg-background border border-muted-foreground/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-300">
                                <Split size={32} className="text-muted-foreground group-hover:text-blue-400 transition-colors" />
                            </div>

                            <h3 className="text-2xl font-bold text-foreground mb-3">
                                {t('sceneList.nodeSelection.scene.title', 'Ramificação')}
                            </h3>

                            <p className="whitespace-pre-line text-muted-foreground text-sm max-w-xs mb-8 group-hover:text-foreground transition-colors">
                                {!hasOpeningVignette
                                    ? t('sceneList.nodeSelection.scene.lockedDesc', 'Crie um capítulo de abertura\npara habilitar ramificações.')
                                    : t('sceneList.nodeSelection.scene.description', 'Momentos de divergência.\nFaça escolhas e mude o destino.')}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-2 mt-auto">
                                {(t('sceneList.nodeSelection.scene.tags', { returnObjects: true, defaultValue: ['DECISÃO', 'RAMIFICAÇÃO', 'COMPLEXIDADE'] }) as string[]).map((tag: string, index: number) => (
                                    <span key={index} className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${!hasOpeningVignette ? 'text-zinc-500 bg-zinc-500/10 border-muted-foreground/50/20' : 'text-blue-500 bg-blue-500/10 border-blue-500/20'
                                        }`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeTypeModal;
