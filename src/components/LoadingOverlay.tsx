import React from 'react';

interface LoadingOverlayProps {
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Carregando..." }) => {
    return (
        <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="cube-container">
                    <div className="cube">
                        <div className="cube-face face-front"></div>
                        <div className="cube-face face-back"></div>
                        <div className="cube-face face-right"></div>
                        <div className="cube-face face-left"></div>
                        <div className="cube-face face-top"></div>
                        <div className="cube-face face-bottom"></div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary animate-pulse">
                        {message}
                    </p>
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                </div>
            </div>
        </div>
    );
};
