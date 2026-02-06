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
                    <feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="R" result="distorted" />
                </filter>
            </defs>
        </svg>
    );
};

export default TVFilter;
