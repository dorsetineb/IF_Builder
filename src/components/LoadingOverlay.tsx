import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingOverlayProps {
    message?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            </div>
        </div>
    );
};
