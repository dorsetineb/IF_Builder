import React, { useEffect, useRef } from 'react';

const NosferatuOverlay: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Apply sepia filter to parent image
        const parent = containerRef.current?.closest('.group');
        const img = parent?.querySelector('img');
        if (img) {
            img.style.filter = 'sepia(0.8) contrast(1.1) brightness(0.9)';
        }

        return () => {
            if (img) {
                img.style.filter = '';
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 15 }}>
            {/* Cinema effect layer */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    filter: 'blur(0.45px)',
                }}
            />

            {/* Scratch lines */}
            <div
                className="absolute"
                style={{
                    width: '120%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    opacity: 0.4,
                    background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 2px, transparent 120px)',
                    animation: 'nosferatuScratch 0.45s steps(1) infinite',
                }}
            />

            {/* Effect scratch */}
            <div
                className="absolute"
                style={{
                    width: '120%',
                    height: '100%',
                    top: 0,
                    left: '30%',
                    opacity: 0.3,
                    background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 2px, transparent 80px)',
                    animation: 'nosferatuEffectScratch 2s infinite',
                }}
            />

            {/* Film grain */}
            <div
                className="absolute"
                style={{
                    width: '110%',
                    height: '110%',
                    top: '-5%',
                    left: '-5%',
                    opacity: 0.2,
                    backgroundImage: `
                        repeating-conic-gradient(rgba(255,255,255,0.5) 0%, transparent 0.0003%, transparent 0.0075%, transparent 0.0085%),
                        repeating-conic-gradient(#FFF 0%, transparent 0.0005%, transparent 0.0015%, transparent 0.065%)
                    `,
                    animation: 'nosferatuGrain 0.5s steps(1) infinite',
                }}
            />

            {/* Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Inline styles for animations */}
            <style>{`
                @keyframes nosferatuScratch {
                    0%, 100% { transform: translateX(0); opacity: 0.4; }
                    10% { transform: translateX(-1%); }
                    20% { transform: translateX(1%); }
                    30% { transform: translateX(-2%); opacity: 0.6; }
                    40% { transform: translateX(3%); }
                    50% { transform: translateX(-3%); opacity: 0.4; }
                    60% { transform: translateX(8%); }
                    70% { transform: translateX(-3%); }
                    80% { transform: translateX(10%); opacity: 0.2; }
                    90% { transform: translateX(-2%); }
                }
                @keyframes nosferatuEffectScratch {
                    0% { transform: translateX(0); opacity: 0.5; }
                    10% { transform: translateX(-1%); }
                    20% { transform: translateX(1%); }
                    30% { transform: translateX(-2%); }
                    40% { transform: translateX(3%); }
                    50% { transform: translateX(-3%); opacity: 0.35; }
                    60% { transform: translateX(8%); }
                    70% { transform: translateX(-3%); }
                    80% { transform: translateX(10%); opacity: 0.2; }
                    90% { transform: translateX(20%); }
                    100% { transform: translateX(30%); opacity: 0; }
                }
                @keyframes nosferatuGrain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-1%, -1%); }
                    20% { transform: translate(1%, 1%); }
                    30% { transform: translate(-2%, -2%); }
                    40% { transform: translate(3%, 3%); }
                    50% { transform: translate(-3%, -3%); }
                    60% { transform: translate(4%, 4%); }
                    70% { transform: translate(-4%, -4%); }
                    80% { transform: translate(2%, 2%); }
                    90% { transform: translate(-3%, -3%); }
                }
            `}</style>
        </div>
    );
};

export default NosferatuOverlay;
