import React, { useEffect, useRef } from 'react';

const RainOverlay: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let drops: Drop[] = [];

        // Configuration
        const fall_speed = 0.7;
        const wind_speed = 5;
        const rain_weight = 0.11;
        const rain_color = '255,255,255';

        class Drop {
            r: number = 0;
            l: number = 0;
            x: number = 0;
            y: number = 0;
            dx: number = 0;
            dy: number = 0;
            offset: number = 0;
            opacity: number = 0;
            drip: HTMLCanvasElement | null = null;

            constructor() {
                this.reset();
            }

            reset() {
                this.r = randomFrom(0.8, 1.6);
                this.l = (this.r * 250);
                this.x = randomFrom((canvas!.width * -0.25), (canvas!.width * 1.125));
                this.y = randomFrom((canvas!.height * -0.25), (canvas!.height * -1));
                this.dx = randomFrom((wind_speed - 3), (wind_speed + 3));
                this.dy = (this.r * (100 * fall_speed));
                this.offset = (this.l * (this.dx / this.dy));
                this.opacity = (this.r * randomFrom(0.2, 0.6));
                this.drip = this.render();
            }

            render() {
                const canv = document.createElement('canvas');
                const ctx = canv.getContext('2d');
                if (!ctx) return null;

                const width = Math.abs(this.offset) + this.r;
                // Ensure valid dimensions
                if (width <= 0 || this.l <= 0) return null;

                canv.setAttribute('width', width.toString());
                canv.setAttribute('height', this.l.toString());

                ctx.beginPath();

                const drip = ctx.createLinearGradient(0, 0, 0, this.l);
                drip.addColorStop(0, 'rgba(' + rain_color + ', 0)');
                drip.addColorStop(1, 'rgba(' + rain_color + ', ' + this.opacity + ')');
                ctx.fillStyle = drip;

                const startX = (this.offset >= 0) ? 0 : Math.abs(this.offset);
                ctx.moveTo(startX, 0);
                ctx.lineTo(startX + this.r, 0);
                ctx.lineTo(startX + this.r + this.offset, this.l);
                ctx.lineTo(startX + this.offset, this.l);

                ctx.closePath();
                ctx.fill();

                return canv;
            }

            draw() {
                if (this.drip && ctx) {
                    ctx.drawImage(this.drip, this.x, this.y);
                }
            }

            fall() {
                this.x += this.dx;
                this.y += this.dy;

                if (this.y > (canvas!.height * 1.25)) {
                    this.reset();
                }
            }
        }

        function randomFrom(min: number, max: number) {
            return (Math.random() * (max - min) + min);
        }

        const resizer = () => {
            if (!container || !canvas) return;
            // Use container dimensions, but scale up slightly for wind effect logic if needed
            // The original code used window.innerWidth * 1.5. 
            // We'll trust the container size but maybe apply the logical scaling for the simulation

            const width = container.clientWidth;
            const height = container.clientHeight;

            // Initial canvas sizing
            canvas.width = width;
            canvas.height = height;

            // Recalculate drop count based on area/width
            const drop_count = Math.floor(width * rain_weight * 1.5); // 1.5 factor to match density roughly

            drops = [];
            for (let i = 0; i < drop_count; i++) {
                drops[i] = new Drop();
            }
        };

        function rain() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const drops_length = drops.length;

            for (let i = 0; i < drops_length; i++) {
                const drop = drops[i];
                drop.fall();
                drop.draw();
            }

            animationFrameId = requestAnimationFrame(rain);
        }

        // Initialize
        resizer();

        // Handle resize
        const resizeObserver = new ResizeObserver(() => {
            resizer();
        });
        resizeObserver.observe(container);

        // Start loop
        rain();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
            <style>{`
                @keyframes lightning-flash {
                    0%, 90%, 100% { opacity: 0; }
                    92%, 96% { opacity: 0.8; background-color: white; } 
                    94%, 98% { opacity: 0.2; }
                }
                .lightning-layer {
                    position: absolute;
                    inset: 0;
                    mix-blend-mode: screen;
                    animation: lightning-flash 11s infinite linear alternate;
                    pointer-events: none;
                }
            `}</style>

            {/* Lightning Layer */}
            <div className="lightning-layer"></div>

            {/* Rain Canvas */}
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export default RainOverlay;
