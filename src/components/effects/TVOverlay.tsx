import React from 'react';

const TVOverlay: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
            <style>{`
                /* TV Effect Container */
                .tv-overlay-container {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    z-index: 1;
                }

                /* Subtle Barrel Distortion via border-radius and scale */
                .tv-screen-wrapper {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    /* Subtle curvature - not too intense */
                    border-radius: 8px;
                }

                /* Scanlines Layer */
                .tv-scanlines {
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.15) 0px,
                        rgba(0, 0, 0, 0.15) 1px,
                        transparent 1px,
                        transparent 3px
                    );
                    pointer-events: none;
                    z-index: 3;
                }

                /* RGB Pixel Grid Effect */
                .tv-rgb-grid {
                    position: absolute;
                    inset: 0;
                    background-image: repeating-linear-gradient(
                        90deg,
                        rgba(255, 0, 0, 0.03) 0px,
                        rgba(255, 0, 0, 0.03) 1px,
                        rgba(0, 255, 0, 0.03) 1px,
                        rgba(0, 255, 0, 0.03) 2px,
                        rgba(0, 0, 255, 0.03) 2px,
                        rgba(0, 0, 255, 0.03) 3px
                    );
                    pointer-events: none;
                    z-index: 2;
                    opacity: 0.6;
                }

                /* TV Vignette - Subtle edge darkening */
                .tv-vignette {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(
                        ellipse at center,
                        transparent 50%,
                        rgba(0, 0, 0, 0.15) 80%,
                        rgba(0, 0, 0, 0.4) 100%
                    );
                    pointer-events: none;
                    z-index: 4;
                }

                /* Screen Glow Effect */
                .tv-glow {
                    position: absolute;
                    inset: -2px;
                    background: radial-gradient(
                        ellipse at center,
                        rgba(255, 255, 255, 0.03) 0%,
                        transparent 70%
                    );
                    pointer-events: none;
                    z-index: 1;
                    animation: tvGlowPulse 4s ease-in-out infinite;
                }

                /* Subtle Flicker */
                .tv-flicker {
                    position: absolute;
                    inset: 0;
                    background: transparent;
                    animation: tvFlicker 50ms infinite;
                    pointer-events: none;
                    z-index: 5;
                }

                /* Occasional Horizontal Interference Line */
                .tv-interference {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.1) 50%,
                        transparent 100%
                    );
                    pointer-events: none;
                    z-index: 6;
                    animation: tvInterference 8s linear infinite;
                    opacity: 0;
                }

                /* Chromatic Aberration Layers - Subtle */
                .tv-aberration-r {
                    position: absolute;
                    inset: 0;
                    background: rgba(255, 0, 0, 0.02);
                    mix-blend-mode: screen;
                    transform: translateX(-1px);
                    pointer-events: none;
                }

                .tv-aberration-b {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 255, 0.02);
                    mix-blend-mode: screen;
                    transform: translateX(1px);
                    pointer-events: none;
                }

                @keyframes tvFlicker {
                    0% { opacity: 0.97; }
                    50% { opacity: 1; }
                    100% { opacity: 0.97; }
                }

                @keyframes tvGlowPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }

                @keyframes tvInterference {
                    0% { 
                        top: -3px; 
                        opacity: 0; 
                    }
                    2% { 
                        opacity: 0.8; 
                    }
                    4% { 
                        opacity: 0; 
                    }
                    20% { 
                        top: 100%; 
                        opacity: 0; 
                    }
                    100% { 
                        top: 100%; 
                        opacity: 0; 
                    }
                }
            `}</style>

            <div className="tv-overlay-container">
                <div className="tv-screen-wrapper">
                    {/* Chromatic Aberration */}
                    <div className="tv-aberration-r"></div>
                    <div className="tv-aberration-b"></div>

                    {/* Screen Glow */}
                    <div className="tv-glow"></div>

                    {/* RGB Pixel Grid */}
                    <div className="tv-rgb-grid"></div>

                    {/* Scanlines */}
                    <div className="tv-scanlines"></div>

                    {/* Vignette */}
                    <div className="tv-vignette"></div>

                    {/* Flicker */}
                    <div className="tv-flicker"></div>

                    {/* Interference Line */}
                    <div className="tv-interference"></div>
                </div>
            </div>
        </div>
    );
};

export default TVOverlay;
