
import React from 'react';
import { overlaysCSS } from '../lib/overlaysCSS';

interface SceneImageProps {
    src: string;
    alt: string;
    effect?: string;
    className?: string;
}

export const SceneImage: React.FC<SceneImageProps> = ({ src, alt, effect, className = '' }) => {
    return (
        <div className={`relative ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
            <style>{overlaysCSS}</style>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                style={effect === 'pixel-jitter' ? { animation: 'jitter-shake 0.2s infinite' } : undefined}
            />
            {effect && effect !== 'none' && effect !== 'pixel-jitter' && (
                <div
                    className={`scene-overlay overlay-${effect}`}
                />
            )}
        </div>
    );
};
