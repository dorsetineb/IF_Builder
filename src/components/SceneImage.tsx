
import React from 'react';

interface SceneImageProps {
    src: string;
    alt: string;
    effect?: string;
    className?: string;
}

export const SceneImage: React.FC<SceneImageProps> = ({ src, alt, effect, className = '' }) => {
    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover ${effect === 'pixel-jitter' ? 'overlay-pixel-jitter' : ''}`}
            />
            {effect && effect !== 'none' && effect !== 'pixel-jitter' && (
                <div className={`scene-overlay overlay-${effect}`}></div>
            )}
        </div>
    );
};
