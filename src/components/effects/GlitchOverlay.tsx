import React, { useEffect, useRef } from 'react';

const GlitchOverlay: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    useEffect(() => {
        // Apply glitch filter to parent image
        const parent = containerRef.current?.closest('.group');
        const img = parent?.querySelector('img');
        if (img) {
            img.style.filter = 'url(#glitch-filter-preview)';
        }

        // Canvas for additional artifacts
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

        const resize = () => {
            width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };
        window.addEventListener('resize', resize);

        const loop = () => {
            ctx.clearRect(0, 0, width, height);

            // Occasional horizontal slice artifacts
            if (Math.random() > 0.9) {
                const sliceHeight = Math.random() * 20 + 3;
                const sliceY = Math.random() * height;
                ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 0.2 + 0.05})`;
                ctx.fillRect(0, sliceY, width, sliceHeight);
            }

            // Occasional RGB block artifacts
            if (Math.random() > 0.92) {
                const blockW = Math.random() * 80 + 20;
                const blockH = Math.random() * 15 + 3;
                const blockX = Math.random() * width;
                const blockY = Math.random() * height;

                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                ctx.fillRect(blockX - 2, blockY, blockW, blockH);
                ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
                ctx.fillRect(blockX + 2, blockY, blockW, blockH);
                ctx.globalCompositeOperation = 'source-over';
            }

            requestRef.current = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener('resize', resize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (img) {
                img.style.filter = '';
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
            {/* Inline SVG Filter for Editor Preview - Subtle intensity */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="glitch-filter-preview" x="-10%" y="-10%" width="120%" height="120%">
                        {/* Sporadic Chromatic Aberration - Normal when static */}
                        <feOffset in="SourceGraphic" dx="0" dy="0" result="r_offset">
                            <animate attributeName="dx" values="0;0;0;0;-4;0;0;0;0;-3;0;0" dur="3s" repeatCount="indefinite" />
                        </feOffset>
                        <feOffset in="SourceGraphic" dx="0" dy="0" result="b_offset">
                            <animate attributeName="dx" values="0;0;0;0;4;0;0;0;0;3;0;0" dur="3s" repeatCount="indefinite" />
                        </feOffset>
                        <feOffset in="SourceGraphic" dx="0" dy="0" result="g_offset" />

                        <feColorMatrix in="r_offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
                        <feColorMatrix in="g_offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
                        <feColorMatrix in="b_offset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />

                        <feBlend in="red" in2="green" mode="screen" result="rg" />
                        <feBlend in="rg" in2="blue" mode="screen" result="rgb" />

                        {/* Sporadic Horizontal Displacement */}
                        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.5" numOctaves="1" result="noise" seed="3">
                            <animate attributeName="seed" values="3;3;3;3;6;3;3;3;3;5;3;3" dur="4s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="rgb" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            {/* Subtle scanlines */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `repeating-linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.05) 0px,
                        rgba(0, 0, 0, 0.05) 1px,
                        transparent 1px,
                        transparent 3px
                    )`,
                    zIndex: 1
                }}
            />

            {/* Canvas for additional artifacts */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 2, mixBlendMode: 'screen', opacity: 0.5 }}
            />
        </div>
    );
};

export default GlitchOverlay;
