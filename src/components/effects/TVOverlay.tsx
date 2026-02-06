import React, { useEffect, useRef } from 'react';
import TVFilter from './TVFilter';

const TVOverlay: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Encontra o container pai (wrapper da imagem/cena) e aplica a classe de distorção
        // SceneEditor: o pai direto ou avô geralmente é o wrapper com overflow-hidden
        const container = containerRef.current?.closest('.relative.overflow-hidden') || containerRef.current?.parentElement;

        if (container) {
            container.classList.add('tv-distortion-active');
        }

        return () => {
            if (container) {
                container.classList.remove('tv-distortion-active');
            }
        };
    }, []);

    return (
        <>
            <TVFilter />
            <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
                <style>{`
                    /* TV Effect Container Styling */
                    .tv-distortion-active {
                        /* Force hardware acceleration */
                        transform: translateZ(0); 
                    }

                    /* Content underneath needs to be slightly scaled to fill the curved corners if we were masking, 
                       but here we just apply the filter and let the overlay handle the bezel look. */
                    .tv-distortion-active img, 
                    .tv-distortion-active .scene-image {
                        filter: url(#tv-distortion-filter) !important;
                        transform: scale(1.02); /* Slight zoom to avoid edge artifacts from distortion */
                    }

                    /* TV Overlay Effect Container */
                    .tv-overlay-container {
                        position: absolute;
                        inset: 0;
                        overflow: hidden;
                        z-index: 10;
                        /* Responsive curvature */
                        border-radius: clamp(10px, 2vmin, 20px); 
                        /* Deep inset shadow relative to viewport size for consistent look */
                        box-shadow: inset 0 0 10vmin rgba(0,0,0,0.7); 
                    }

                    /* Bezel/Glass Curvature Simulation */
                    .tv-screen-wrapper {
                        position: absolute;
                        inset: 0;
                        overflow: hidden;
                        border-radius: clamp(10px, 2vmin, 20px);
                        /* Inner shadow to simulate curved glass edges */
                        box-shadow: inset 0 0 5vmin rgba(0,0,0,0.8), inset 0 0 1vmin rgba(0,0,0,0.8);
                        z-index: 20;
                    }
                    
                    /* Stronger Scanlines */
                    .tv-scanlines {
                        position: absolute;
                        inset: 0;
                        background: repeating-linear-gradient(
                            0deg,
                            rgba(0, 0, 0, 0.2) 0px,
                            rgba(0, 0, 0, 0.2) 1px,
                            transparent 1px,
                            transparent 3px
                        );
                        pointer-events: none;
                        z-index: 3;
                        opacity: 0.6;
                    }

                    /* RGB Pixel Grid - More visible */
                    .tv-rgb-grid {
                        position: absolute;
                        inset: 0;
                        background-image: repeating-linear-gradient(
                            90deg,
                            rgba(255, 0, 0, 0.06) 0px,
                            rgba(255, 0, 0, 0.06) 1px,
                            rgba(0, 255, 0, 0.06) 1px,
                            rgba(0, 255, 0, 0.06) 2px,
                            rgba(0, 0, 255, 0.06) 2px,
                            rgba(0, 0, 255, 0.06) 3px
                        );
                        pointer-events: none;
                        z-index: 2;
                        opacity: 0.5;
                        mix-blend-mode: overlay;
                    }

                    /* TV Vignette - Stronger */
                    .tv-vignette {
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(
                            circle at center,
                            transparent 55%,
                            rgba(0, 0, 0, 0.3) 80%,
                            rgba(0, 0, 0, 0.95) 100%
                        );
                        pointer-events: none;
                        z-index: 4;
                    }

                    /* Screen Glow / Reflection */
                    .tv-glow {
                        position: absolute;
                        top: -50%; left: -50%; right: -50%; bottom: -50%;
                        background: radial-gradient(
                            ellipse at center,
                            rgba(255, 255, 255, 0.05) 0%,
                            transparent 60%
                        );
                        pointer-events: none;
                        z-index: 5;
                        animation: tvGlowPulse 5s ease-in-out infinite alternate;
                        opacity: 0.5;
                    }

                    /* Flicker */
                    .tv-flicker {
                        position: absolute;
                        inset: 0;
                        background: rgba(255, 255, 255, 0.02);
                        mix-blend-mode: overlay;
                        animation: tvFlicker 0.1s infinite;
                        pointer-events: none;
                        z-index: 6;
                    }

                    /* Interference Line */
                    .tv-interference {
                        position: absolute;
                        left: 0;
                        right: 0;
                        height: 2px;
                        background: rgba(255, 255, 255, 0.15);
                        pointer-events: none;
                        z-index: 7;
                        animation: tvInterference 6s linear infinite;
                        opacity: 0;
                        box-shadow: 0 0 10px rgba(255,255,255,0.5);
                    }

                    @keyframes tvFlicker {
                        0% { opacity: 0.9; }
                        50% { opacity: 1.0; }
                        100% { opacity: 0.9; }
                    }

                    @keyframes tvGlowPulse {
                        0% { transform: scale(1); opacity: 0.4; }
                        100% { transform: scale(1.05); opacity: 0.5; }
                    }

                    @keyframes tvInterference {
                        0% { top: -10%; opacity: 0; }
                        10% { opacity: 0.5; }
                        11% { opacity: 0; }
                        50% { top: 110%; opacity: 0; }
                        100% { top: 110%; opacity: 0; }
                    }
                `}</style>

                <div className="tv-overlay-container">
                    <div className="tv-screen-wrapper">
                        {/* Layers */}
                        <div className="tv-rgb-grid"></div>
                        <div className="tv-scanlines"></div>
                        <div className="tv-vignette"></div>
                        <div className="tv-glow"></div>
                        <div className="tv-flicker"></div>
                        <div className="tv-interference"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TVOverlay;
