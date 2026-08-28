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
            color: string = '';

            constructor(initial: boolean = false) {
                this.reset(initial);
            }

            reset(initial: boolean = false) {
                if (!canvas) return;
                this.r = randomFrom(0.8, 1.8);
                this.l = this.r * 220;
                this.x = randomFrom((canvas.width * -0.25), (canvas.width * 1.125));
                this.y = initial ? randomFrom(0, canvas.height) : randomFrom((canvas.height * -0.2), (canvas.height * -0.8));
                this.dx = randomFrom((wind_speed - 3), (wind_speed + 3));
                this.dy = (this.r * (100 * fall_speed));
                this.offset = (this.l * (this.dx / this.dy));
                this.opacity = randomFrom(0.15, 0.55);
                this.color = 'rgba(' + rain_color + ', ' + this.opacity + ')';
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.r;
                ctx.lineCap = 'round';
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.offset, this.y + this.l);
                ctx.stroke();
            }

            fall() {
                this.x += this.dx;
                this.y += this.dy;

                if (canvas && this.y > (canvas.height * 1.25)) {
                    this.reset(false);
                }
            }
        }

        function randomFrom(min: number, max: number) {
            return (Math.random() * (max - min) + min);
        }

        const resizer = () => {
            if (!container || !canvas) return;
            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;

            canvas.width = width;
            canvas.height = height;

            const drop_count = Math.min(150, Math.max(30, Math.floor(width * rain_weight * 0.75)));

            drops = [];
            for (let i = 0; i < drop_count; i++) {
                drops[i] = new Drop(true);
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
