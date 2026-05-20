import React from 'react';
import { DitherShader } from '@/components/ui/dither-shader';
import { useTheme } from './ThemeProvider';
import { getDitherColors } from '../utils/themeStyles';

interface TransitionScreenProps {
    isVisible: boolean;
}

export const TransitionScreen: React.FC<TransitionScreenProps> = ({ isVisible }) => {
    const { theme } = useTheme();
    const [bgSrc, setBgSrc] = React.useState('/background.webp');

    React.useEffect(() => {
        if (window.innerWidth < 768) {
            setBgSrc('/background.webp');
            return;
        }
        const savedBg = localStorage.getItem('if-builder-bg-src');
        if (savedBg) setBgSrc(savedBg);
    }, []);

    const ditherColors = getDitherColors(theme);

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950 transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Background Dither */}
            <div className="absolute inset-0 z-0 bg-neutral-950">
                <DitherShader
                    src={bgSrc}
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
                    enableHover={false}
                    hoverRadius={433}
                />
            </div>

            {/* Static IF Logo - Bottom Right */}
            <div className="fixed bottom-10 right-24 hidden lg:block select-none pointer-events-none z-10 opacity-20">
                <pre className="font-mono leading-none text-white text-[10px] sm:text-[14px] tracking-normal notranslate" translate="no">
{`           ██████   █████████
          ░░████   ░█████████
         ░████   ░██         
        ░████   ░█████████   
       ░████   ░█████████   
      ░████   ░██           
     ██████  ░██            
    ░░░░░░   ░░             `}
                </pre>
            </div>
        </div>
    );
};
