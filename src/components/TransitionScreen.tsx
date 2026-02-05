import React from 'react';
import { DitherShader } from '@/components/ui/dither-shader';

interface TransitionScreenProps {
    isVisible: boolean;
}

export const TransitionScreen: React.FC<TransitionScreenProps> = ({ isVisible }) => {
    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950 transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
        >
            {/* Background Dither */}
            <div className="absolute inset-0 z-0 bg-neutral-950">
                <DitherShader
                    src="/background.png"
                    gridSize={2}
                    ditherMode="bayer"
                    colorMode="duotone"
                    primaryColor="#000000"
                    secondaryColor="#9d4edd"
                    invert={false}
                    animated={true}
                    animationSpeed={0.005}
                    className="w-full h-full"
                    objectFit="cover"
                    enableHover={false}
                    hoverRadius={433}
                />
            </div>

            {/* Static IF Logo - Bottom Right */}
            <div className="fixed bottom-10 right-24 hidden lg:block select-none pointer-events-none z-10 opacity-20">
                <h1 className="text-9xl font-black text-white tracking-tighter italic" style={{ fontFamily: 'Inter, sans-serif' }}>IF</h1>
            </div>
        </div>
    );
};
