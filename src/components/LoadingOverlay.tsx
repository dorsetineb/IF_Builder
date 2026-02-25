import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingOverlayProps {
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    const { t } = useTranslation();

    return (
        <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="pixel-loader">
                    <div className="pixel-stone"></div>
                    <div className="pixel-ripple"></div>
                    <div className="pixel-ripple"></div>
                    <div className="pixel-ripple"></div>
                </div>
                <p className="text-xs text-muted-foreground font-sans animate-pulse">
                    {message || t('common.loading', 'Carregando...')}
                </p>
            </div>
        </div>
    );
};
