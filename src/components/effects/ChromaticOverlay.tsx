import React from 'react';

const ChromaticOverlay: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
            <style>{`
                /* Chromatic Aberration Effect */
                .chromatic-overlay-container {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    z-index: 1;
                }
                
                /* RGB Channel Layers */
                .chromatic-layer {
                    position: absolute;
                    inset: 0;
                    mix-blend-mode: screen;
                    pointer-events: none;
                }
                
                .chromatic-red {
                    background: rgba(255, 0, 0, 0.12);
                    animation: chromaticJerkRed 1s infinite;
                }
                
                .chromatic-green {
                    background: rgba(0, 255, 0, 0.12);
                    animation: chromaticJerkGreen 1s infinite;
                }
                
                .chromatic-blue {
                    background: rgba(0, 100, 255, 0.12);
                    animation: chromaticJerkBlue 1s infinite;
                }
                
                .chromatic-flicker {
                    position: absolute;
                    inset: 0;
                    background: transparent;
                    animation: chromaticFlicker 30ms infinite;
                    pointer-events: none;
                }

                /* Scanlines */
                .chromatic-scanlines {
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.2) 0px,
                        rgba(0, 0, 0, 0.2) 2px,
                        transparent 2px,
                        transparent 4px
                    );
                    pointer-events: none;
                    z-index: 5;
                }
                
                /* Jerk/Glitch whole container */
                .chromatic-jerk-wrapper {
                    position: absolute;
                    inset: 0;
                    animation: chromaticJerkWhole 3s infinite;
                }

                @keyframes chromaticJerkRed {
                    0%, 30%, 32%, 98% { transform: translateX(0); }
                    31% { transform: translateX(-4px); }
                    100% { transform: translateX(-4px); }
                }
                
                @keyframes chromaticJerkGreen {
                    0%, 30%, 32%, 98% { transform: translateX(0); }
                    31% { transform: translateX(4px); }
                    100% { transform: translateX(4px); }
                }
                
                @keyframes chromaticJerkBlue {
                    0%, 30%, 32%, 98% { transform: translateY(0); }
                    31% { transform: translateY(3px); }
                    100% { transform: translateY(3px); }
                }

                @keyframes chromaticFlicker {
                    0% { opacity: 0.92; }
                    50% { opacity: 1; }
                    100% { opacity: 0.92; }
                }
                
                @keyframes chromaticJerkWhole {
                    0%, 39%, 44%, 100% { 
                        transform: translate(0, 0) scale(1) skew(0deg, 0deg);
                        opacity: 1;
                    }
                    40% { 
                        transform: translate(-3px, 0) scale(1, 1.02) skew(2deg, 0deg);
                        opacity: 0.9;
                    }
                    41% { 
                        transform: translate(3px, 0) scale(1, 1.02) skew(-2deg, 0deg);
                        opacity: 0.9;
                    }
                    42% { 
                        transform: translate(-2px, 0) scale(1, 1.01) skew(1deg, 0deg);
                        opacity: 0.95;
                    }
                    43% { 
                        transform: translate(0, 0) scale(1) skew(0deg, 0deg);
                        opacity: 1;
                    }
                }
            `}</style>

            <div className="chromatic-overlay-container">
                <div className="chromatic-jerk-wrapper">
                    {/* RGB Channel Separation Layers */}
                    <div className="chromatic-layer chromatic-red"></div>
                    <div className="chromatic-layer chromatic-green"></div>
                    <div className="chromatic-layer chromatic-blue"></div>

                    {/* Flicker Layer */}
                    <div className="chromatic-flicker"></div>
                </div>

                {/* Scanlines */}
                <div className="chromatic-scanlines"></div>
            </div>
        </div>
    );
};

export default ChromaticOverlay;
