import React, { useState } from 'react';
import { DitherShader } from '@/components/ui/dither-shader';
import { Plus, Download, Heart } from 'lucide-react';

interface WelcomePlaceholderProps {
    onCreateScene: () => void;
    onDownloadExample: () => void;
    onMeetProject: () => void;
}

export const WelcomePlaceholder: React.FC<WelcomePlaceholderProps> = ({ onCreateScene, onDownloadExample, onMeetProject }) => {
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

            <div className="relative z-10 flex flex-col items-center justify-center text-center text-brand-text-dim p-8">
                <h2 className="text-3xl font-bold text-brand-text mb-4">Bem-vindo ao IF Builder</h2>
                <p className="max-w-md text-zinc-400 mb-12">
                    Selecione uma cena no menu à esquerda para começar a editar, ou adicione uma nova cena para expandir seu mundo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    {/* Botão 1: Começar a Criar */}
                    <button
                        onClick={onCreateScene}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/50 hover:bg-purple-900/20 hover:border-white hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-purple-900/10"
                    >
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-white transition-colors">
                            <Plus className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <span className="font-bold text-purple-200 text-lg group-hover:text-purple-100 transition-colors">Começar a Criar</span>
                    </button>

                    {/* Botão 2: Baixar Exemplo */}
                    <button
                        onClick={handleDownloadClick}
                        className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-xl border hover:scale-[1.02] transition-all duration-300 ${isFlashing
                            ? 'bg-white border-white scale-[1.02]'
                            : 'bg-black/40 backdrop-blur-sm border-purple-500/50 hover:bg-purple-900/20 hover:border-white'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isFlashing ? 'bg-purple-600' : 'bg-purple-500/10 group-hover:bg-white'}`}>
                            <Download className={`w-6 h-6 transition-colors ${isFlashing ? 'text-white' : 'text-purple-400 group-hover:text-purple-600'}`} />
                        </div>
                        <span className={`font-bold text-lg transition-colors ${isFlashing ? 'text-purple-900' : 'text-purple-200 group-hover:text-purple-100'}`}>Baixar exemplo</span>
                    </button>

                    {/* Botão 3: Conheça o projeto */}
                    <button
                        onClick={onMeetProject}
                        className="group flex flex-col items-center justify-center gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/50 hover:bg-purple-900/20 hover:border-white hover:scale-[1.02] transition-all duration-300"
                    >
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-white transition-colors">
                            <Heart className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <span className="font-bold text-purple-200 text-lg group-hover:text-purple-100 transition-colors">Conheça o projeto</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
