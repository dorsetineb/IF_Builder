import React from 'react';
import './Dither.css';

// Replaced unstable Three.js implementation with a CSS-based alternative
// to ensure stability and compatibility across all devices.
export default function Dither() {
    return (
        <div className="dither-container">
            <div className="dither-noise"></div>
            <div className="dither-overlay"></div>
        </div>
    );
}

// Keep props interface for compatibility but ignore them
export interface DitherProps {
    waveSpeed?: number;
    waveFrequency?: number;
    waveAmplitude?: number;
    waveColor?: number[];
    colorNum?: number;
    pixelSize?: number;
    disableAnimation?: boolean;
    enableMouseInteraction?: boolean;
    mouseRadius?: number;
}
