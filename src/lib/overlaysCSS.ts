export const overlaysCSS = `
/* Common Overlay Base */
.scene-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  opacity: 0.8;
  mix-blend-mode: overlay;
  overflow: hidden;
}

/* --- CLIMATIC EFFECTS --- */

/* Rain */
.overlay-rain {
  background: 
    linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%),
    repeating-linear-gradient(105deg, transparent, transparent 18px, rgba(255,255,255,0.1) 19px, transparent 20px),
    repeating-linear-gradient(95deg, transparent, transparent 48px, rgba(255,255,255,0.1) 49px, transparent 50px);
  background-size: 100% 100%, 200% 100%, 200% 100%;
  animation: rain-fall 0.8s linear infinite;
  mix-blend-mode: screen;
  opacity: 0.6;
}

@keyframes rain-fall {
  0% { background-position: 0 0, 0 0, 0 0; }
  100% { background-position: 0 0, -20px 200px, -40px 300px; }
}

/* Rain on Glass */
.overlay-rain-on-glass {
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.6), rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40% 70%, rgba(255,255,255,0.6), rgba(0,0,0,0)),
    radial-gradient(2px 2px at 60% 20%, rgba(255,255,255,0.6), rgba(0,0,0,0)),
    radial-gradient(2px 2px at 80% 80%, rgba(255,255,255,0.6), rgba(0,0,0,0));
  background-size: 100px 100px;
  filter: blur(0.5px);
  opacity: 0.5;
  animation: rain-glass 10s linear infinite;
}

@keyframes rain-glass {
  from { background-position: 0 0; }
  to { background-position: 0 200px; }
}

/* Snow */
.overlay-snow {
  background-image: 
    radial-gradient(3px 3px at 20% 30%, rgba(255,255,255,0.9) 50%, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40% 70%, rgba(255,255,255,1) 50%, rgba(0,0,0,0)),
    radial-gradient(4px 4px at 50% 10%, rgba(255,255,255,0.8) 50%, rgba(0,0,0,0)),
    radial-gradient(3px 3px at 90% 40%, rgba(255,255,255,1) 50%, rgba(0,0,0,0));
  background-size: 200px 200px, 300px 300px, 150px 150px, 250px 250px;
  animation: snow-fall 8s linear infinite;
  mix-blend-mode: screen;
}

@keyframes snow-fall {
  0% { background-position: 0 0, 0 0, 0 0, 0 0; }
  100% { background-position: 20px 200px, -20px 300px, 40px 150px, -30px 250px; }
}

/* Fog */
.overlay-fog {
  background: 
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%),
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  background-size: 200% 200%;
  animation: fog-move 20s ease-in-out infinite alternate;
  opacity: 0.4;
  mix-blend-mode: screen;
}

@keyframes fog-move {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

/* Smoke */
.overlay-smoke {
  background: repeating-radial-gradient(circle at 50% 50%, rgba(100, 100, 100, 0.1), transparent 20%);
  background-size: 150% 150%;
  animation: smoke-rise 15s linear infinite;
  opacity: 0.5;
  mix-blend-mode: overlay;
  filter: blur(5px);
}

@keyframes smoke-rise {
  0% { background-position: 50% 100%; }
  100% { background-position: 50% -50%; }
}

/* Dust */
.overlay-dust {
  background-image: 
    radial-gradient(1px 1px at 10% 10%, rgba(200, 180, 150, 0.6), transparent),
    radial-gradient(1px 1px at 50% 50%, rgba(200, 180, 150, 0.6), transparent),
    radial-gradient(1px 1px at 90% 90%, rgba(200, 180, 150, 0.6), transparent);
  background-size: 100px 100px;
  animation: dust-float 20s linear infinite;
  mix-blend-mode: screen;
}

@keyframes dust-float {
  0% { background-position: 0 0; }
  100% { background-position: 50px -50px; }
}

/* Ash */
.overlay-ash {
  background-image: 
    radial-gradient(2px 2px at 20% 80%, rgba(50, 50, 50, 0.8), transparent),
    radial-gradient(2px 2px at 80% 20%, rgba(80, 80, 80, 0.8), transparent);
  background-size: 150px 150px;
  animation: ash-fall 12s linear infinite;
  filter: blur(0.5px);
}

@keyframes ash-fall {
  0% { background-position: 0 -20px; }
  100% { background-position: 20px 200px; }
}

/* Wind Streaks */
.overlay-wind-streaks {
  background: repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255, 255, 255, 0.05) 51px, transparent 100px);
  background-size: 200% 100%;
  animation: wind-blow 2s linear infinite;
  mix-blend-mode: screen;
}

@keyframes wind-blow {
  0% { background-position: 200% 0; }
  100% { background-position: 0 0; }
}

/* --- NOISE & TEXTURE EFFECTS --- */

/* Film Grain */
.overlay-film-grain {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opactiy='0.5'/%3E%3C/svg%3E");
  opacity: 0.15;
  mix-blend-mode: overlay;
  animation: grain-shift 0.5s steps(5) infinite;
}

@keyframes grain-shift {
  0% { transform: translate(0,0); }
  20% { transform: translate(-2%,-2%); }
  40% { transform: translate(2%,2%); }
  60% { transform: translate(-2%,2%); }
  80% { transform: translate(2%,-2%); }
  100% { transform: translate(0,0); }
}

/* Static Noise */
.overlay-static-noise {
  background: repeating-radial-gradient(circle, transparent 0, transparent 2px, #000 3px);
  background-size: 4px 4px;
  opacity: 0.1;
  animation: static-flicker 0.1s infinite;
}

@keyframes static-flicker {
  0% { opacity: 0.1; }
  50% { opacity: 0.15; }
  100% { opacity: 0.1; }
}

/* White Noise */
.overlay-white-noise {
   background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
   opacity: 0.15;
   animation: noise-anim 0.2s infinite;
   mix-blend-mode: screen;
}

@keyframes noise-anim {
    0% { transform: translate(0,0); }
    10% { transform: translate(-5%,-5%); }
    20% { transform: translate(-10%,5%); }
    30% { transform: translate(5%,-10%); }
    40% { transform: translate(-5%,15%); }
    50% { transform: translate(-10%,5%); }
    60% { transform: translate(15%,0); }
    70% { transform: translate(0,10%); }
    80% { transform: translate(-15%,0); }
    90% { transform: translate(10%,5%); }
    100% { transform: translate(5%,0); }
}

/* VHS */
.overlay-vhs {
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  background-size: 100% 2px, 3px 100%;
  mix-blend-mode: hard-light;
  animation: vhs-scan 0.3s linear infinite;
}

@keyframes vhs-scan {
  0% { background-position: 0 0; }
  100% { background-position: 0 4px; }
}

/* CRT Scanlines */
.overlay-crt-scanlines {
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 10;
}

/* Interference */
.overlay-interference {
  background: repeating-linear-gradient(0deg, transparent 0, transparent 4px, rgba(255, 255, 255, 0.1) 5px);
  background-size: 100% 100%;
  animation: interference-scroll 0.2s linear infinite;
  opacity: 0.3;
}

@keyframes interference-scroll {
  from { background-position: 0 0; }
  to { background-position: 0 100px; }
}

/* Compression Artifacts */
.overlay-compression {
  backdrop-filter: contrast(1.5) brightness(0.9);
  mix-blend-mode: hard-light;
  opacity: 0.6;
  filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pixelate'%3E%3CfeFlood x='4' y='4' height='2' width='2'/%3E%3CfeComposite width='4' height='4'/%3E%3CfeTile result='a'/%3E%3CfeComposite in='SourceGraphic' in2='a' operator='in'/%3E%3CfeMorphology operator='dilate' radius='2'/%3E%3C/filter%3E%3C/svg%3E#pixelate");
   /* Fallback simulation */
   background-image: radial-gradient(circle, transparent 2px, rgba(0,0,0,0.2) 3px);
   background-size: 8px 8px;
}

/* Pixel Jitter */
.overlay-pixel-jitter {
    animation: jitter-shake 0.2s infinite;
}

@keyframes jitter-shake {
    0% { transform: translate(0, 0); }
    25% { transform: translate(1px, 1px); }
    50% { transform: translate(-1px, 0); }
    75% { transform: translate(0, -1px); }
    100% { transform: translate(0, 0); }
}
`;
