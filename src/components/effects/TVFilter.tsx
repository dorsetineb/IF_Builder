import React from 'react';

// SVG Filter for TV Distortion (Chromatic Aberration + Noise)
// We export this as a string for use in gameDefaults.ts as well
export const TV_FILTER_SVG_STRING = `
<svg style="display: none;" id="tv-svg-filters">
  <defs>
    <filter id="tv-distortion-filter" x="-20%" y="-20%" width="140%" height="140%">
      <!-- 1. Chromatic Aberration (RGB Shift) -->
      <feOffset in="SourceGraphic" dx="-2" dy="0" result="r_offset" />
      <feOffset in="SourceGraphic" dx="2" dy="0" result="b_offset" />
      <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />
      
      <!-- Split channels (Simulated via ColorMatrix for cleaner separate channels if needed, but simple merge works for additive) -->
      <!-- Actually, standard simple pseudo-aberration: -->
      <!-- Red Channel -->
      <feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
      <!-- Green Channel -->
      <feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
      <!-- Blue Channel -->
      <feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
      
      <feMerge>
        <feMergeNode in="red" />
        <feMergeNode in="green" />
        <feMergeNode in="blue" />
      </feMerge>
      
      <!-- 2. Noise/Grain -->
      <!-- <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" stitchTiles="stitch" result="noise"/> -->
      <!-- <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5" in="noise" result="alphaNoise"/> -->
      <!-- <feComposite operator="in" in="alphaNoise" in2="SourceGraphic" result="grainy"/> -->
      
      <!-- Note: We skip heavy displacement for performance, relying on CSS for curvature -->
    </filter>
  </defs>
</svg>
`;

const TVFilter: React.FC = () => {
    return (
        <svg style={{ display: 'none' }} id="tv-svg-filters-component">
            <defs>
                <filter id="tv-distortion-filter" x="-20%" y="-20%" width="140%" height="140%">
                    <feOffset in="SourceGraphic" dx="-3" dy="0" result="r_offset">
                        <animate attributeName="dx" values="-3;-2;-4;-3" dur="0.5s" repeatCount="indefinite" />
                    </feOffset>
                    <feOffset in="SourceGraphic" dx="3" dy="0" result="b_offset">
                        <animate attributeName="dx" values="3;2;4;3" dur="0.7s" repeatCount="indefinite" />
                    </feOffset>
                    <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />

                    <feColorMatrix in="r_offset" type="matrix" result="red"
                        values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
                    <feColorMatrix in="g_offset" type="matrix" result="green"
                        values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
                    <feColorMatrix in="b_offset" type="matrix" result="blue"
                        values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />

                    <feMerge>
                        <feMergeNode in="red" />
                        <feMergeNode in="green" />
                        <feMergeNode in="blue" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    );
};

export default TVFilter;
