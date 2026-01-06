import React from 'react';
import { DitherShader } from '@/components/ui/dither-shader';

interface TransitionScreenProps {
    isVisible: boolean;
}

export const TransitionScreen: React.FC<TransitionScreenProps> = ({ isVisible }) => {
    // If not visible, do not render anything (instant cut)
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950">
            {/* Background Dither - No animations */}
            <div className="absolute inset-0 z-0 bg-neutral-950">
                <DitherShader
                    src="/background.png"
                    gridSize={2}
                    ditherMode="bayer"
                    colorMode="duotone"
                    primaryColor="#000000"
                    secondaryColor="#581c87"
                    invert={false}
                    animated={true} // Shader internal animation (noise) is acceptable/requested ("dither effect")
                    animationSpeed={0.005}
                    className="w-full h-full"
                    objectFit="cover"
                    enableHover={false}
                    hoverRadius={433}
                />
            </div>

            {/* Static Nargnar Logo - Bottom Right */}
            <div className="fixed bottom-10 right-10 hidden lg:block select-none pointer-events-none z-10">
                <img src="/nargnar_logo.png" alt="Nargnar" className="h-64 w-auto object-contain" />
            </div>
        </div>
    );
};
