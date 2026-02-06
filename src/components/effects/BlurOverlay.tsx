import React from 'react';

const BlurOverlay: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
            <style>{`
                /* Blur/Vintage Film Effect */
                .blur-overlay-container {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    z-index: 1;
                }
                .blur-flicker-layer {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.25);
                    z-index: 2;
                    animation: blurIntroOverlay 5s infinite;
                    pointer-events: none;
                }
                .blur-grain-layer {
                    position: absolute;
                    top: -100%;
                    left: -100%;
                    width: 300%;
                    height: 300%;
                    background: url(https://cl.ly/image/2m2R0A3m1b3x/noise.png);
                    z-index: 3;
                    animation: blurGrainOverlay 5s steps(10) infinite;
                    pointer-events: none;
                    opacity: 0.4;
                }
                .blur-rumble-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    animation: blurRumble 5s steps(3) infinite;
                    pointer-events: none;
                }
                .blur-vignette-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 4;
                    background: radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);
                    pointer-events: none;
                }
                @keyframes blurIntroOverlay {
                    0% { opacity: 1; }
                    7% { opacity: .7; }
                    9% { opacity: .9; }
                    15% { opacity: .7; }
                    19% { opacity: .8; }
                    25% { opacity: .6; }
                    30% { opacity: .5; }
                    35% { opacity: .9; }
                    38% { opacity: 1; }
                    43% { opacity: .5; }
                    50% { opacity: .8; }
                    55% { opacity: .5; }
                    59% { opacity: .9; }
                    60% { opacity: .6; }
                    66% { opacity: .7; }
                    75% { opacity: .9; }
                    80% { opacity: 1; }
                    85% { opacity: .5; }
                    90% { opacity: .8; }
                    95% { opacity: .7; }
                    98% { opacity: .5; }
                    100% { opacity: .9; }
                }
                @keyframes blurGrainOverlay {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -10%); }
                    20% { transform: translate(-15%, 5%); }
                    30% { transform: translate(7%, -25%); }
                    40% { transform: translate(-5%, 25%); }
                    50% { transform: translate(-15%, 10%); }
                    60% { transform: translate(15%, 0%); }
                    70% { transform: translate(0%, 15%); }
                    80% { transform: translate(3%, 35%); }
                    90% { transform: translate(-10%, 10%); }
                }
                @keyframes blurRumble {
                    0%, 100% { transform: translate(0, 0); opacity: .9; }
                    10% { transform: translate(-3px, -5px); opacity: .7; }
                    20% { transform: translate(-2px, 6px); opacity: 1; }
                    30% { transform: translate(-3px, -2px); opacity: .9; }
                    40% { transform: translate(-4px, 0px); }
                    50% { transform: translate(-7px, 4px); }
                    60% { transform: translate(-5px, 2px); }
                    70% { transform: translate(-1px, 3px); }
                    80% { transform: translate(3px, 6px); }
                    90% { transform: translate(0px, 7px); }
                }
            `}</style>

            <div className="blur-overlay-container">
                {/* Rumble/Shake Layer */}
                <div className="blur-rumble-layer"></div>

                {/* Flicker Layer */}
                <div className="blur-flicker-layer"></div>

                {/* Grain Layer */}
                <div className="blur-grain-layer"></div>

                {/* Vignette Layer */}
                <div className="blur-vignette-layer"></div>
            </div>
        </div>
    );
};

export default BlurOverlay;
