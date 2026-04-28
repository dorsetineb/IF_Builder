import React, { useEffect, useRef } from 'react';

const FogOverlay: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const img1 = new Image();
        const img2 = new Image();
        
        img1.src = "https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-1.png";
        img2.src = "https://raw.githubusercontent.com/WebDevSHORTS/Fog-Overlay-Animation/master/img/fog-2.png";

        const updateSizes = () => {
            const rect = container.getBoundingClientRect();
            const W = rect.width;
            const H = rect.height;
            if (W === 0 || H === 0) return;

            if (img1.complete && img1.naturalWidth && img1.naturalHeight) {
                const R1 = img1.naturalWidth / img1.naturalHeight;
                let visible_width, visible_height;
                if (W / H > R1) {
                    visible_width = W;
                    visible_height = W / R1;
                } else {
                    visible_height = H;
                    visible_width = H * R1;
                }
                container.style.setProperty('--fog-width-1', `${visible_width}px`);
                container.style.setProperty('--fog-height-1', `${visible_height}px`);
            }

            if (img2.complete && img2.naturalWidth && img2.naturalHeight) {
                const R2 = img2.naturalWidth / img2.naturalHeight;
                let visible_width, visible_height;
                if (W / H > R2) {
                    visible_width = W;
                    visible_height = W / R2;
                } else {
                    visible_height = H;
                    visible_width = H * R2;
                }
                container.style.setProperty('--fog-width-2', `${visible_width}px`);
                container.style.setProperty('--fog-height-2', `${visible_height}px`);
            }
        };

        img1.onload = updateSizes;
        img2.onload = updateSizes;

        const resizeObserver = new ResizeObserver(updateSizes);
        resizeObserver.observe(container);

        // Fallback in case images are cached and onload doesn't trigger
        updateSizes();

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className="fog-container" ref={containerRef}>
            <div className="fog-img fog-img-first"></div>
            <div className="fog-img fog-img-second"></div>
        </div>
    );
};

export default FogOverlay;
