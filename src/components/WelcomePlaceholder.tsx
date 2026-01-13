import React, { useState } from 'react';
import { DitherShader } from '@/components/ui/dither-shader';
import { Plus, Download, Heart } from 'lucide-react';

interface WelcomePlaceholderProps {
    onCreateScene: () => void;
    onDownloadExample: () => void;
    onMeetProject: () => void;
    theme?: string;
}

export const WelcomePlaceholder: React.FC<WelcomePlaceholderProps> = ({ onCreateScene, onDownloadExample, onMeetProject, theme = 'dark' }) => {
    const [isFlashing, setIsFlashing] = useState(false);

    const handleDownloadClick = () => {
        setIsFlashing(true);
        onDownloadExample();
        setTimeout(() => setIsFlashing(false), 200);
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
            <div className="absolute inset-0 z-0">
                <DitherShader
                    src="/background.png"
                    gridSize={2}
                    ditherMode="bayer"
                    colorMode="duotone"
                    primaryColor="#000000"
                    secondaryColor="#581c87"
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
                <h2 className="text-3xl font-bold text-white mb-4">Bem-vindo ao IF Builder</h2>
                <p className="max-w-md text-zinc-300 mb-12">
                    Selecione uma cena no menu à esquerda para começar a editar, ou adicione uma nova cena para expandir seu mundo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    {/* Botão 1: Começar a Criar */}
                    <button
                        onClick={onCreateScene}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-zinc-600 hover:border-white hover:bg-black/50 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-black/20"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'bg-primary/10 group-hover:bg-primary' : 'bg-white/10 group-hover:bg-white'}`}>
                            <Plus className={`w-6 h-6 transition-colors ${theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'text-primary group-hover:text-primary-foreground' : 'text-white group-hover:text-black'}`} />
                        </div>
                        <span className="font-bold text-zinc-200 text-lg group-hover:text-white transition-colors">Começar a Criar</span>
                    </button>

                    {/* Botão 2: Baixar Exemplo */}
                    <button
                        onClick={handleDownloadClick}
                        className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-xl border hover:scale-[1.02] transition-all duration-300 ${isFlashing
                            ? 'bg-white border-white scale-[1.02]'
                            : 'bg-black/40 backdrop-blur-sm border-zinc-600 hover:border-white hover:bg-black/50'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isFlashing
                            ? (theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'bg-primary-foreground' : 'bg-black')
                            : (theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'bg-primary/10 group-hover:bg-primary' : 'bg-white/10 group-hover:bg-white')
                            }`}>
                            <Download className={`w-6 h-6 transition-colors ${isFlashing
                                ? (theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'text-primary' : 'text-white')
                                : (theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'text-primary group-hover:text-primary-foreground' : 'text-white group-hover:text-black')
                                }`} />
                        </div>
                        <span className={`font-bold text-lg transition-colors ${isFlashing ? (theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'text-primary-foreground' : 'text-black') : 'text-zinc-200 group-hover:text-white'}`}>Baixar exemplo</span>
                    </button>

                    {/* Botão 3: Conheça o projeto */}
                    <button
                        onClick={onMeetProject}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-zinc-600 hover:border-white hover:bg-black/50 hover:scale-[1.02] transition-all duration-300"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'bg-primary/10 group-hover:bg-primary' : 'bg-white/10 group-hover:bg-white'}`}>
                            <Heart className={`w-6 h-6 transition-colors ${theme === 'cream' || theme === 'terminal' || theme === 'dark' ? 'text-primary group-hover:text-primary-foreground' : 'text-white group-hover:text-black'}`} />
                        </div>
                        <span className="font-bold text-zinc-200 text-lg group-hover:text-white transition-colors">Conheça o projeto</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
