import React, { useState, useEffect } from 'react';
import { DitherShader } from '@/components/ui/dither-shader';
import { X, Monitor, Cloud, CircleHelp, Zap, Loader2 } from 'lucide-react';
import { NewProjectModal } from './NewProjectModal';
import { GameData } from '../types';
import { useTranslation } from 'react-i18next';
import Preview from './Preview';

interface WelcomePlaceholderProps {
    onCreateScene: (data?: Partial<GameData>) => void;
    onDownloadExample: () => void;
    onMeetProject: () => void;
    onGuidePage: () => void;
    theme?: string;
}

export const WelcomePlaceholder: React.FC<WelcomePlaceholderProps> = ({ onCreateScene, onDownloadExample, onMeetProject, onGuidePage, theme = 'dark' }) => {
    const { t, i18n } = useTranslation();
    const [isFlashing, setIsFlashing] = useState(false);
    const [showDownloadHelp, setShowDownloadHelp] = useState(false);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isGamePopupOpen, setIsGamePopupOpen] = useState(false);
    const [demoData, setDemoData] = useState<GameData | null>(null);
    const [isLoadingDemo, setIsLoadingDemo] = useState(false);
    const [bgSrc, setBgSrc] = useState('/background.webp');

    useEffect(() => {
        if (window.innerWidth < 768) {
            setBgSrc('/background.webp');
            return;
        }
        const savedBg = localStorage.getItem('if-builder-bg-src');
        if (savedBg) setBgSrc(savedBg);
    }, []);

    const handleDownloadClick = () => {
        setIsFlashing(true);
        onDownloadExample();
        setTimeout(() => setIsFlashing(false), 200);
        setShowDownloadHelp(true);
    };

    const getDitherColors = () => {
        switch (theme) {
            case 'terminal':
                return { primary: '#001D2D', secondary: '#7EE0A1' };
            case 'windows':
                return { primary: '#0f0f0f', secondary: '#008080' };
            default: // dark
                return { primary: '#000000', secondary: '#9d4edd' };
        }
    };

    const ditherColors = getDitherColors();

    const handleCreateProject = (data: Partial<GameData>) => {
        setIsNewProjectModalOpen(false);
        onCreateScene(data);
    };

    useEffect(() => {
        if (isGamePopupOpen && !demoData) {
            const fetchDemoData = async () => {
                setIsLoadingDemo(true);
                try {
                    const demoFolderName = i18n.language.startsWith('pt')
                        ? "fuja_da_masmorra"
                        : i18n.language.startsWith('es')
                        ? "escapa_la_mazmorra"
                        : "escape_the_dungeon";
                    
                    const response = await fetch(`/${demoFolderName}/editor_data.json`);
                    if (!response.ok) throw new Error("Failed to load demo data");
                    const data = await response.json();
                    setDemoData(data);
                } catch (error) {
                    console.error("Error loading demo data:", error);
                } finally {
                    setIsLoadingDemo(false);
                }
            };
            fetchDemoData();
        }
    }, [isGamePopupOpen, i18n.language, demoData]);

    // Reset demo data when language changes to ensure correct one is loaded
    useEffect(() => {
        setDemoData(null);
    }, [i18n.language]);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
            <div className="absolute inset-0 z-0">
                <DitherShader
                    src={bgSrc}
                    gridSize={2}
                    ditherMode="bayer"
                    colorMode="duotone"
                    primaryColor={ditherColors.primary}
                    secondaryColor={ditherColors.secondary}
                    invert={false}
                    animated={true}
                    animationSpeed={0.005}
                    className="w-full h-full"
                    objectFit="cover"
                    enableHover={true}
                    hoverRadius={433}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-3xl font-bold text-white mb-4">{t('welcome.title', 'Bem-vindo ao IF Builder')}</h2>
                <p className="max-w-md text-zinc-300 mb-12"><b>{t('welcome.subtitle', 'O que você quer fazer?')}</b></p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    {/* Botão 1: Começar a Criar */}
                    <button
                        onClick={() => setIsNewProjectModalOpen(true)}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-primary/50 hover:border-transparent hover:ring-2 hover:ring-white hover:bg-black/50 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-black/20"
                    >
                        <div className="w-10 h-10 bg-primary group-hover:bg-white transition-colors" style={{ maskImage: 'url(/icons/criar.svg)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskImage: 'url(/icons/criar.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                        <span className="font-bold text-zinc-200 text-lg group-hover:text-white transition-colors">{t('welcome.createNew', 'Crie uma ficção')}</span>
                    </button>

                    {/* Botão 2: Jogar a Demo */}
                    <button
                        onClick={() => setIsGamePopupOpen(true)}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-primary/50 hover:border-transparent hover:ring-2 hover:ring-white hover:bg-black/50 hover:scale-[1.02] transition-all duration-300"
                    >
                        <div className="w-10 h-10 bg-primary group-hover:bg-white transition-colors" style={{ maskImage: 'url(/icons/demo.svg)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskImage: 'url(/icons/demo.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                        <span className="font-bold text-zinc-200 text-lg group-hover:text-white transition-colors">{t('welcome.playDemo', 'Acesse a demo')}</span>
                    </button>

                    {/* Botão 3: Baixar Exemplo */}
                    <button
                        onClick={handleDownloadClick}
                        className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-xl border hover:scale-[1.02] transition-all duration-300 ${isFlashing
                            ? 'bg-white border-white scale-[1.02]'
                            : 'bg-black/40 backdrop-blur-sm border-primary/50 hover:border-transparent hover:ring-2 hover:ring-white hover:bg-black/50'
                            }`}
                    >
                        <div className={`w-10 h-10 transition-colors ${isFlashing ? 'bg-white' : 'bg-primary group-hover:bg-white'}`} style={{ maskImage: 'url(/icons/exemplo.svg)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskImage: 'url(/icons/exemplo.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                        <span className={`font-bold text-lg transition-colors ${isFlashing ? (theme === 'terminal' || theme === 'dark' ? 'text-primary-foreground' : 'text-black') : 'text-zinc-200 group-hover:text-white'}`}>{t('welcome.downloadExample', 'Baixe um exemplo')}</span>
                    </button>

                </div>

                {/* Secondary Actions Block (Guide & About) */}
                <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-5xl mt-6">
                    {/* Botão: Guia Rápido */}
                    <button
                        onClick={onGuidePage}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-primary/50 hover:border-transparent hover:ring-2 hover:ring-white hover:bg-black/50 hover:scale-[1.02] transition-all duration-300 w-full md:w-[calc(33.333%-16px)]"
                    >
                        <CircleHelp className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                        <span className="font-bold text-zinc-200 text-lg group-hover:text-white transition-colors">{t('sidebar.quickGuide', 'Guia Rápido')}</span>
                    </button>

                    {/* Botão: Sobre o Projeto */}
                    <button
                        onClick={onMeetProject}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-primary/50 hover:border-transparent hover:ring-2 hover:ring-white hover:bg-black/50 hover:scale-[1.02] transition-all duration-300 w-full md:w-[calc(33.333%-16px)]"
                    >
                        <Zap className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                        <span className="font-bold text-zinc-200 text-lg group-hover:text-white transition-colors">{t('sidebar.aboutProject', 'Sobre o Projeto')}</span>
                    </button>
                </div>
            </div>

            {/* Modal de Ajuda do Download */}
            {showDownloadHelp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="relative bg-zinc-900 border border-muted-foreground/50 rounded-xl p-8 max-w-3xl w-full shadow-2xl">
                        <button
                            onClick={() => setShowDownloadHelp(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-2xl font-bold text-white mb-8 text-center">{t('welcome.helpTItle', 'Como usar o exemplo baixado')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group relative flex flex-col items-center text-center p-8 bg-zinc-950/50 rounded-2xl border border-primary/50 overflow-hidden shadow-lg transition-all duration-300 hover:bg-zinc-950">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#008080]/0 to-[#008080]/20 group-hover:to-[#008080]/40 transition-colors" />
                                <Monitor className="w-12 h-12 text-[#008080] mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                <h4 className="text-xl font-bold text-white mb-4 relative z-10">{t('welcome.helpPlayTitle', 'Offline')}</h4>
                                <p className="text-left text-zinc-400 text-sm relative z-10" dangerouslySetInnerHTML={{ __html: t('welcome.helpPlayDesc', 'Extraia o conteúdo do <strong>arquivo.zip</strong> e abra o arquivo <strong>index.html</strong> para acessar a ficção interativa de modo offline.') }} />
                            </div>

                            <div className="group relative flex flex-col items-center text-center p-8 bg-zinc-950/50 rounded-2xl border border-primary/50 overflow-hidden shadow-lg transition-all duration-300 hover:bg-zinc-950">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 to-blue-500/20 group-hover:to-blue-500/40 transition-colors" />
                                <Cloud className="w-12 h-12 text-blue-500 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                <h4 className="text-xl font-bold text-white mb-4 relative z-10">{t('welcome.helpEditTitle', 'Online')}</h4>
                                <p className="text-left text-zinc-400 text-sm relative z-10" dangerouslySetInnerHTML={{ __html: t('welcome.helpEditDesc', 'Clique no botão <strong>CARREGAR</strong> no canto esquerdo do cabeçalho para acessar e editar o projeto no IF Builder.') }} />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => setShowDownloadHelp(false)}
                                className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                            >
                                {t('common.confirm', 'Entendi')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW PROJECT MODAL */}
            <NewProjectModal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
                onCreate={handleCreateProject}
            />

            {/* Game Popup */}
            {isGamePopupOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsGamePopupOpen(false)}
                >
                    <div
                        className="bg-zinc-900 border border-muted-foreground/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
                        style={{ width: '90vw', height: '90vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`px-4 py-3 border-b flex items-center justify-between flex-shrink-0 bg-primary border-primary`}>
                            <div className="flex items-center gap-3">
                                <span className={`font-mono text-xs uppercase tracking-widest text-primary-foreground opacity-90`}>
                                    {i18n.language.startsWith('pt')
                                        ? "FUJA_DA_MASMORRA.EXE"
                                        : i18n.language.startsWith('es')
                                        ? "ESCAPA_LA_MAZMORRA.EXE"
                                        : "ESCAPE_THE_DUNGEON.EXE"}
                                </span>
                            </div>
                            <button
                                className="h-6 w-8 flex items-center justify-center hover:bg-red-500 transition-colors group rounded-sm"
                                onClick={() => setIsGamePopupOpen(false)}
                            >
                                <X className={`w-3.5 h-3.5 group-hover:text-white text-primary-foreground/70`} />
                            </button>
                        </div>
                        <div className="flex-1 min-h-0 bg-black flex items-center justify-center">
                            {isLoadingDemo ? (
                                <div className="flex flex-col items-center gap-4 text-white">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                    <span className="font-mono text-sm uppercase tracking-widest animate-pulse">Loading data...</span>
                                </div>
                            ) : demoData ? (
                                <Preview 
                                    gameData={demoData} 
                                    basePath={i18n.language.startsWith('pt') 
                                        ? "/fuja_da_masmorra" 
                                        : i18n.language.startsWith('es') 
                                        ? "/escapa_la_mazmorra" 
                                        : "/escape_the_dungeon"} 
                                />
                            ) : (
                                <div className="text-white font-mono text-sm uppercase">Error loading demo.</div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
