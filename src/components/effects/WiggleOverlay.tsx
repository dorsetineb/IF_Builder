import React, { useEffect, useRef } from 'react';

const WiggleOverlay: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Find the parent group and image
        const parent = containerRef.current?.closest('.group');
        const img = parent?.querySelector('img');

        if (img) {
            // Apply the animation defined in OVERLAY_CSS
            // The keyframes 'squigglevision' are available via <style>{OVERLAY_CSS}</style> in SceneEditor
            img.style.animation = 'squigglevision 0.3s infinite alternate';
        }

        return () => {
            if (img) {
                img.style.animation = '';
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            {/* 
                We need to render the SVG filters here because gameHTML (where they are globally defined) 
                is not rendered in the SceneEditor, only in the runtime.
            */}
            <svg style={{ display: 'none' }}>
                <defs>
                    <filter id="squiggly-0">
                        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="0" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                    </filter>
                    <filter id="squiggly-1">
                        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="1" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                    </filter>
                    <filter id="squiggly-2">
                        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="2" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                    </filter>
                    <filter id="squiggly-3">
                        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="3" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                    </filter>
                    <filter id="squiggly-4">
                        <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="4" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default WiggleOverlay;
