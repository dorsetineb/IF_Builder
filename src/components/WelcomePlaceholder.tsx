import React, { useState } from 'react';
import { DitherShader } from '@/components/ui/dither-shader';
import { Download, X, Gamepad2 } from 'lucide-react';
import { NewProjectModal } from './NewProjectModal';
import { GameData } from '../types';
import { useTranslation } from 'react-i18next';

interface WelcomePlaceholderProps {
    onCreateScene: (data?: Partial<GameData>) => void;
    onDownloadExample: () => void;
    onMeetProject: () => void;
    theme?: string;
}

export const WelcomePlaceholder: React.FC<WelcomePlaceholderProps> = ({ onCreateScene, onDownloadExample, onMeetProject, theme = 'dark' }) => {
    const { t, i18n } = useTranslation();
    const [isFlashing, setIsFlashing] = useState(false);
    const [showDownloadHelp, setShowDownloadHelp] = useState(false);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isGamePopupOpen, setIsGamePopupOpen] = useState(false);

    const handleDownloadClick = () => {
        setIsFlashing(true);
        onDownloadExample();
        setTimeout(() => setIsFlashing(false), 200);
        setShowDownloadHelp(true);
    };

    const getDitherColors = () => {
        switch (theme) {
            case 'cream':
                return { primary: '#5c4033', secondary: '#fdfbf7' };
            case 'terminal':
                return { primary: '#0d1117', secondary: '#4af626' };
            case 'light':
                return { primary: '#000000', secondary: '#ffffff' };
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

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
            <div className="absolute inset-0 z-0">
                <DitherShader
                    src="/background.png"
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl">
                    {/* Botão 1: Começar a Criar */}
                    <button
                        onClick={() => setIsNewProjectModalOpen(true)}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-zinc-600 hover:border-white hover:bg-black/50 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-black/20"
                    >
                        <img src="/icons/criar.svg" alt="" className="w-10 h-10 invert opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="font-bold text-zinc-200 text-lg group-hover:text-white transition-colors">{t('welcome.createNew', 'Crie uma ficção')}</span>
                    </button>

                    {/* Botão 2: Jogar a Demo */}
                    <button
                        onClick={() => setIsGamePopupOpen(true)}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-zinc-600 hover:border-white hover:bg-black/50 hover:scale-[1.02] transition-all duration-300"
                    >
                        <img src="/icons/demo.svg" alt="" className="w-10 h-10 invert opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="font-bold text-zinc-200 text-lg group-hover:text-white transition-colors">{t('welcome.playDemo', 'Acesse a demo')}</span>
                    </button>

                    {/* Botão 3: Baixar Exemplo */}
                    <button
                        onClick={handleDownloadClick}
                        className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-xl border hover:scale-[1.02] transition-all duration-300 ${isFlashing
                            ? 'bg-white border-white scale-[1.02]'
                            : 'bg-black/40 backdrop-blur-sm border-zinc-600 hover:border-white hover:bg-black/50'
                            }`}
                    >
                        <img src="/icons/exemplo.svg" alt="" className={`w-10 h-10 transition-all ${isFlashing ? 'opacity-100' : 'invert opacity-60 group-hover:opacity-100'}`} />
                        <span className={`font-bold text-lg transition-colors ${isFlashing ? (theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'text-primary-foreground' : 'text-black') : 'text-zinc-200 group-hover:text-white'}`}>{t('welcome.downloadExample', 'Baixe um exemplo')}</span>
                    </button>

                    {/* Botão 4: Conheça o projeto */}
                    <button
                        onClick={onMeetProject}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-zinc-600 hover:border-white hover:bg-black/50 hover:scale-[1.02] transition-all duration-300"
                    >
                        <img src="/icons/apoie.svg" alt="" className="w-10 h-10 invert opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="font-bold text-zinc-200 text-lg group-hover:text-white transition-colors">{t('welcome.meetProject', 'Conheça o projeto')}</span>
                    </button>
                </div>
            </div>

            {/* Modal de Ajuda do Download */}
            {showDownloadHelp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-8 max-w-3xl w-full shadow-2xl">
                        <button
                            onClick={() => setShowDownloadHelp(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-2xl font-bold text-white mb-8 text-center">{t('welcome.helpTItle', 'Como usar o exemplo baixado')}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col items-center text-center p-6 bg-zinc-950/50 rounded-lg border border-zinc-800">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                                    <Gamepad2 className="w-6 h-6 text-blue-500" />
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-2">{t('welcome.helpPlayTitle', 'Para Jogar')}</h4>
                                <p className="text-left text-zinc-400 text-sm" dangerouslySetInnerHTML={{ __html: t('welcome.helpPlayDesc', `Extraia o conteúdo do arquivo <strong>${i18n.language.startsWith('en') ? 'escape_the_dungeon.zip' : 'fuja_da_masmorra.zip'}</strong> no seu computador, e abra o arquivo <strong>index.html</strong> para acessar a ficção de modo offline.`) }} />
                            </div>

                            <div className="flex flex-col items-center text-center p-6 bg-zinc-950/50 rounded-lg border border-zinc-800">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                                    <Download className="w-6 h-6 text-purple-500" />
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-2">{t('welcome.helpEditTitle', 'Para Editar')}</h4>
                                <p className="text-left text-zinc-400 text-sm" dangerouslySetInnerHTML={{ __html: t('welcome.helpEditDesc', 'Clique no botão <strong>IMPORTAR</strong> no canto superior direito do editor para acessar o projeto aqui na interface.') }} />
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
                        className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
                        style={{ width: '80vw', height: '70vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-zinc-800 border-b border-zinc-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                                    TERM.V2.EXE - REMOTE CONNECTION
                                </span>
                            </div>
                            <button
                                className="h-6 w-8 flex items-center justify-center hover:bg-red-500 transition-colors group rounded-sm"
                                onClick={() => setIsGamePopupOpen(false)}
                            >
                                <X className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                            </button>
                        </div>
                        <div className="flex-1 min-h-0">
                            <iframe
                                src={i18n.language.startsWith('en') ? "/escape_the_dungeon/index.html" : "/fuja_da_masmorra/index.html"}
                                className="w-full h-full border-0"
                                title="Demo"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
