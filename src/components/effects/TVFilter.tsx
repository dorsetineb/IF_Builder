import React from 'react';

// SVG Filter for TV Distortion (Chromatic Aberration + Noise + Jitter)
// We export this as a string for use in gameDefaults.ts as well
export const TV_FILTER_SVG_STRING = `
<svg style="display: none;" id="tv-svg-filters">
  <defs>
    <filter id="tv-distortion-filter" x="-20%" y="-20%" width="140%" height="140%">
      <!-- 1. Chromatic Aberration (RGB Shift) -->
      <feOffset in="SourceGraphic" dx="-4" dy="0" result="r_offset" />
      <feOffset in="SourceGraphic" dx="4" dy="0" result="b_offset" />
      <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />
      
      <!-- Split channels & merge with Screen blend mode (Fixes Blue Tint) -->
      <feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
      <feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
      <feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
      
      <feBlend in="red" in2="green" mode="screen" result="rg"/>
      <feBlend in="rg" in2="blue" mode="screen" result="rgb"/>
      
      <!-- 2. Horizontal Glitch/Jitter Distortion -->
      <!-- High frequency Y noise for scanline jitter -->
      <feTurbulence type="fractalNoise" baseFrequency="0.001 0.75" numOctaves="1" result="noise" seed="0" />
      <feDisplacementMap in="rgb" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="R" result="distorted"/>
    </filter>
  </defs>
</svg>
`;

const TVFilter: React.FC = () => {
    return (
        <>
            <style>{`
                /* TV Effect Container Styling */
                .tv-distortion-active {
                    /* Force hardware acceleration */
                    transform: translateZ(0); 
                }
                .tv-distortion-active-lg {
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
                
                /* Large screen variant (Vignette) - Uses stronger filter */
                .tv-distortion-active-lg img, 
                .tv-distortion-active-lg .scene-image,
                .tv-distortion-active-lg video {
                    filter: url(#tv-distortion-filter-lg) !important;
                    transform: scale(1.02);
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

            <svg style={{ display: 'none' }} id="tv-svg-filters-component">
                <defs>
                    <filter id="tv-distortion-filter" x="-20%" y="-20%" width="140%" height="140%">
                        <feOffset in="SourceGraphic" dx="-4" dy="0" result="r_offset">
                            <animate attributeName="dx" values="-4;-3;-5;-4" dur="0.2s" repeatCount="indefinite" />
                        </feOffset>
                        <feOffset in="SourceGraphic" dx="4" dy="0" result="b_offset">
                            <animate attributeName="dx" values="4;3;5;4" dur="0.3s" repeatCount="indefinite" />
                        </feOffset>
                        <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />

                        <feColorMatrix in="r_offset" type="matrix" result="red"
                            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
                        <feColorMatrix in="g_offset" type="matrix" result="green"
                            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
                        <feColorMatrix in="b_offset" type="matrix" result="blue"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />

                        <feBlend in="red" in2="green" mode="screen" result="rg" />
                        <feBlend in="rg" in2="blue" mode="screen" result="rgb" />

                        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.75" numOctaves="1" result="noise" seed="0">
                            <animate attributeName="baseFrequency" values="0.001 0.75; 0.001 0.76; 0.001 0.75" dur="0.15s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="rgb" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="R" result="distorted" />
                    </filter>

                    <filter id="tv-distortion-filter-lg" x="-20%" y="-20%" width="140%" height="140%">
                        <feOffset in="SourceGraphic" dx="-4" dy="0" result="r_offset">
                            <animate attributeName="dx" values="-4;-3;-5;-4" dur="0.2s" repeatCount="indefinite" />
                        </feOffset>
                        <feOffset in="SourceGraphic" dx="4" dy="0" result="b_offset">
                            <animate attributeName="dx" values="4;3;5;4" dur="0.3s" repeatCount="indefinite" />
                        </feOffset>
                        <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />

                        <feColorMatrix in="r_offset" type="matrix" result="red"
                            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
                        <feColorMatrix in="g_offset" type="matrix" result="green"
                            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
                        <feColorMatrix in="b_offset" type="matrix" result="blue"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />

                        <feBlend in="red" in2="green" mode="screen" result="rg" />
                        <feBlend in="rg" in2="blue" mode="screen" result="rgb" />

                        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.75" numOctaves="1" result="noise" seed="0">
                            <animate attributeName="baseFrequency" values="0.001 0.75; 0.001 0.76; 0.001 0.75" dur="0.15s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="R" result="distorted" />
                    </filter>
                </defs>
            </svg>
        </>
    );
};

export default TVFilter;
