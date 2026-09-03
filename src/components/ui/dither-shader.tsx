"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type DitheringMode = "bayer" | "halftone" | "noise" | "crosshatch";
type ColorMode = "original" | "grayscale" | "duotone" | "custom";

interface DitherShaderProps {
    /** Source image URL */
    src: string;
    /** Size of the dithering grid cells (controls 'resolution' look) */
    gridSize?: number;
    /** Type of dithering pattern */
    ditherMode?: DitheringMode;
    /** Color processing mode */
    colorMode?: ColorMode;
    /** Invert the dithered output colors */
    invert?: boolean;
    /** Primary color for duotone mode */
    primaryColor?: string;
    /** Secondary color for duotone mode */
    secondaryColor?: string;
    /** Custom color palette array for custom mode */
    customPalette?: string[];
    /** Brightness adjustment (-1 to 1) */
    brightness?: number;
    /** Contrast adjustment (0 to 2, 1 = normal) */
    contrast?: number;
    /** Background color behind the dithered image */
    backgroundColor?: string;
    /** Object fit behavior */
    objectFit?: "cover" | "contain" | "fill" | "none";
    /** Threshold bias for dithering (0 to 1) */
    threshold?: number;
    /** Enable animation effect */
    animated?: boolean;
    /** Animation speed (lower = slower) */
    animationSpeed?: number;
    /** Enable mouse hover interaction */
    enableHover?: boolean;
    /** Radius of the hover effect in pixels */
    hoverRadius?: number;
    /** Additional CSS classes for the container */
    className?: string;
    /** Enable automatic horizontal scan mode (replaces circular mask or blends with hover) */
    isScanMode?: boolean;
    /** Duration in seconds for one full scan wave cycle (default: 6.0s) */
    scanDuration?: number;
    /** Multiplier for scan wave thickness relative to height (default: 0.85) */
    scanThickness?: number;
}

// 4x4 Bayer matrix
const BAYER_MATRIX_4x4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
];

// 8x8 Bayer matrix
const BAYER_MATRIX_8x8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
];

function parseColor(color: string): [number, number, number] {
    if (color.startsWith("#")) {
        const hex = color.slice(1);
        const r = hex.length === 3 ? parseInt(hex[0] + hex[0], 16) : parseInt(hex.slice(0, 2), 16);
        const g = hex.length === 3 ? parseInt(hex[1] + hex[1], 16) : parseInt(hex.slice(2, 4), 16);
        const b = hex.length === 3 ? parseInt(hex[2] + hex[2], 16) : parseInt(hex.slice(4, 6), 16);
        return [r, g, b];
    }
    const match = color.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i);
    if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return [0, 0, 0];
}

// Packs RGBA into 32-bit uint (Little-Endian standard for canvas ImageData: [R, G, B, A])
function packColor32(r: number, g: number, b: number, a = 255): number {
    return ((a & 0xff) << 24) | ((b & 0xff) << 16) | ((g & 0xff) << 8) | (r & 0xff);
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

const TARGET_FPS = 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export const DitherShader: React.FC<DitherShaderProps> = ({
    src,
    gridSize = 4,
    ditherMode = "bayer",
    colorMode = "original",
    invert = false,
    primaryColor = "#000000",
    secondaryColor = "#ffffff",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    customPalette = ["#000000", "#ffffff"],
    brightness = 0,
    contrast = 1,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    backgroundColor = "transparent",
    objectFit = "cover",
    threshold = 0.5,
    animated = false,
    animationSpeed = 0.02,
    enableHover = false,
    hoverRadius = 100,
    className,
    isScanMode = false,
    scanDuration = 6.0,
    scanThickness = 0.85,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const timeRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number } | null>(null);
    const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
    const hoverScaleRef = useRef<number>(0);
    const targetScaleRef = useRef<number>(0);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const sourceDataRef = useRef<ImageData | null>(null);

    // Persistent reusable buffer to eliminate GC pressure
    const outputImageRef = useRef<ImageData | null>(null);
    const outputBuf32Ref = useRef<Uint32Array | null>(null);

    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });

    const parsedPrimaryColor = parseColor(primaryColor);
    const parsedSecondaryColor = parseColor(secondaryColor);

    useEffect(() => {
        if (!enableHover) return;

        const updateMousePosition = (clientX: number, clientY: number) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const pos = {
                x: clientX - rect.left,
                y: clientY - rect.top,
            };
            mouseRef.current = pos;
            lastMousePosRef.current = pos;
        };

        const handlePointer = (e: PointerEvent) => {
            const isTouch = e.pointerType === 'touch';
            if (isTouch) {
                const isDown = e.type === 'pointerdown' || e.type === 'pointermove';
                const hasButtons = (e.buttons & 1) === 1;
                if (isDown && (e.type === 'pointerdown' || hasButtons)) {
                    updateMousePosition(e.clientX, e.clientY);
                    targetScaleRef.current = 1.0;
                } else if (e.type === 'pointerup' || e.type === 'pointercancel') {
                    targetScaleRef.current = 0.0;
                }
            } else {
                updateMousePosition(e.clientX, e.clientY);
                targetScaleRef.current = 1.0;
            }
        };

        const handlePointerLeave = () => {
            targetScaleRef.current = 0.0;
        };

        window.addEventListener("pointermove", handlePointer, { passive: true });
        window.addEventListener("pointerdown", handlePointer, { passive: true });
        window.addEventListener("pointerup", handlePointer, { passive: true });
        window.addEventListener("pointercancel", handlePointer, { passive: true });
        window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

        return () => {
            window.removeEventListener("pointermove", handlePointer);
            window.removeEventListener("pointerdown", handlePointer);
            window.removeEventListener("pointerup", handlePointer);
            window.removeEventListener("pointercancel", handlePointer);
            window.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, [enableHover]);

    // Precomputed Bayer threshold matrix
    const thresholdMatrix = React.useMemo(() => {
        const bayerMatrix = gridSize <= 4 ? BAYER_MATRIX_4x4 : BAYER_MATRIX_8x8;
        const matrixSize = bayerMatrix.length;
        const matrixScale = matrixSize * matrixSize;
        const matrix: number[][] = [];

        for (let my = 0; my < matrixSize; my++) {
            matrix[my] = [];
            for (let mx = 0; mx < matrixSize; mx++) {
                const base = bayerMatrix[my][mx] / matrixScale;
                matrix[my][mx] = base * (1 - threshold) + threshold * 0.5;
            }
        }
        return { matrix, size: matrixSize };
    }, [gridSize, threshold]);

    // Precomputed 32-bit colors
    const { darkColor32, lightColor32 } = React.useMemo(() => {
        let dark: number;
        let light: number;

        if (colorMode === "duotone") {
            dark = packColor32(parsedPrimaryColor[0], parsedPrimaryColor[1], parsedPrimaryColor[2]);
            light = packColor32(parsedSecondaryColor[0], parsedSecondaryColor[1], parsedSecondaryColor[2]);
        } else {
            dark = packColor32(0, 0, 0);
            light = packColor32(255, 255, 255);
        }

        return {
            darkColor32: invert ? light : dark,
            lightColor32: invert ? dark : light,
        };
    }, [colorMode, parsedPrimaryColor, parsedSecondaryColor, invert]);

    const renderLoop = useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, elapsedSeconds: number) => {
            if (!sourceDataRef.current || !outputImageRef.current || !outputBuf32Ref.current) return;

            const sourceData = sourceDataRef.current.data;
            const srcWidth = sourceDataRef.current.width;
            const srcHeight = sourceDataRef.current.height;
            const outputBuf32 = outputBuf32Ref.current;

            const mouse = mouseRef.current;
            if (mouse) {
                targetScaleRef.current = 1.0;
                lastMousePosRef.current = { ...mouse };
            } else {
                targetScaleRef.current = 0.0;
            }

            hoverScaleRef.current += (targetScaleRef.current - hoverScaleRef.current) * 0.15;

            const currentPos = mouse || lastMousePosRef.current;
            const effectiveGridSize = Math.max(1, gridSize);
            const internalMouseX = currentPos ? Math.floor(currentPos.x / effectiveGridSize) : -9999;
            const internalMouseY = currentPos ? Math.floor(currentPos.y / effectiveGridSize) : -9999;
            const internalHoverRadius = (hoverRadius / effectiveGridSize) * hoverScaleRef.current;
            const hoverRadiusSq = internalHoverRadius * internalHoverRadius;
            const invHoverRadius = internalHoverRadius > 0 ? 1.0 / internalHoverRadius : 0;
            const hasHover = enableHover && internalMouseX !== -9999 && hoverScaleRef.current > 0.01;

            // Precalculate scan parameters outside the loops (Zero per-pixel allocation)
            const cycleDuration = scanDuration || 6.0;
            const cycleProgress = (elapsedSeconds % cycleDuration) / cycleDuration;
            const slantFactor = 0.2;
            const thickness = height * (scanThickness ?? 0.85);
            const invThickness = thickness > 0 ? 1.0 / thickness : 0;
            const startScanY = -thickness;
            const endScanY = height + width * slantFactor + thickness;
            const totalTravel = endScanY - startScanY;
            const currentScanY = startScanY + cycleProgress * totalTravel;

            const bayerMatrix = thresholdMatrix.matrix;
            const matrixSize = thresholdMatrix.size;
            const isBayer = ditherMode === "bayer";

            const hasColorAdjust = contrast !== 1 || brightness !== 0;
            const brightnessOffset = 128 + brightness * 255;

            let pixelIdx = 0;

            for (let y = 0; y < height; y++) {
                const srcY = Math.floor((y / height) * srcHeight);
                const srcRowOffset = srcY * srcWidth;
                const scanBaseY = y - currentScanY;
                const matrixY = y % matrixSize;
                const bayerRow = bayerMatrix[matrixY];

                for (let x = 0; x < width; x++, pixelIdx++) {
                    const srcX = Math.floor((x / width) * srcWidth);
                    const srcIdx = (srcRowOffset + srcX) << 2;

                    const a = sourceData[srcIdx + 3];
                    if (a === 0) {
                        outputBuf32[pixelIdx] = 0;
                        continue;
                    }

                    let r = sourceData[srcIdx];
                    let g = sourceData[srcIdx + 1];
                    let b = sourceData[srcIdx + 2];

                    if (hasColorAdjust) {
                        r = clamp((r - 128) * contrast + brightnessOffset, 0, 255);
                        g = clamp((g - 128) * contrast + brightnessOffset, 0, 255);
                        b = clamp((b - 128) * contrast + brightnessOffset, 0, 255);
                    }

                    let luminance = (0.299 * r + 0.587 * g + 0.114 * b) * 0.0039215686; // 1 / 255

                    if (isScanMode || hasHover) {
                        let scanMask = 0.0;
                        if (isScanMode) {
                            const dist = Math.abs(scanBaseY + x * slantFactor);
                            scanMask = Math.max(0.0, 1.0 - dist * invThickness);
                        }

                        let hoverMask = 0.0;
                        if (hasHover) {
                            const dx = x - internalMouseX;
                            const dy = y - internalMouseY;
                            const distSq = dx * dx + dy * dy;
                            if (distSq < hoverRadiusSq) {
                                hoverMask = Math.max(0.0, 1.0 - Math.sqrt(distSq) * invHoverRadius);
                            }
                        }

                        const combinedMask = Math.min(1.0, Math.max(scanMask, hoverMask));
                        luminance *= combinedMask;
                    }

                    let ditherThreshold: number;
                    if (isBayer) {
                        ditherThreshold = bayerRow[x % matrixSize];
                    } else if (ditherMode === "noise") {
                        const noiseVal = Math.sin(x * 12.9898 + y * 78.233 + time * 100) * 43758.5453;
                        const fract = noiseVal - Math.floor(noiseVal);
                        ditherThreshold = fract * (1 - threshold) + threshold * 0.5;
                    } else {
                        ditherThreshold = 0.5;
                    }

                    // Single 32-bit integer write per pixel
                    outputBuf32[pixelIdx] = luminance < ditherThreshold ? darkColor32 : lightColor32;
                }
            }

            ctx.putImageData(outputImageRef.current, 0, 0);
        },
        [
            gridSize, ditherMode, darkColor32, lightColor32,
            brightness, contrast, threshold, thresholdMatrix,
            enableHover, hoverRadius, isScanMode, scanDuration, scanThickness
        ]
    );

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setDimensions({ width, height });
                }
            }
        });
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

        const effectiveGridSize = Math.max(1, gridSize);
        const internalWidth = Math.floor(dimensions.width / effectiveGridSize);
        const internalHeight = Math.floor(dimensions.height / effectiveGridSize);

        canvas.width = internalWidth;
        canvas.height = internalHeight;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        // Pre-allocate persistent ImageData and Uint32 view (Zero GC pressure)
        outputImageRef.current = ctx.createImageData(internalWidth, internalHeight);
        outputBuf32Ref.current = new Uint32Array(outputImageRef.current.data.buffer);

        const prepareSource = () => {
            if (!imageRef.current) return;
            const img = imageRef.current;
            if (img.naturalWidth === 0 || img.naturalHeight === 0) return;

            const offscreen = document.createElement("canvas");
            let dw = internalWidth;
            let dh = internalHeight;
            const iw = img.naturalWidth || internalWidth;
            const ih = img.naturalHeight || internalHeight;

            if (objectFit === "cover") {
                const scale = Math.max(internalWidth / iw, internalHeight / ih);
                dw = iw * scale;
                dh = ih * scale;
            }

            offscreen.width = internalWidth;
            offscreen.height = internalHeight;
            const offCtx = offscreen.getContext("2d");
            if (offCtx) {
                const dx = (internalWidth - dw) / 2;
                const dy = (internalHeight - dh) / 2;
                offCtx.drawImage(img, dx, dy, dw, dh);
                sourceDataRef.current = offCtx.getImageData(0, 0, internalWidth, internalHeight);
            }
        };

        const renderSingleFrame = () => {
            if (sourceDataRef.current) {
                renderLoop(ctx, internalWidth, internalHeight, timeRef.current, performance.now() / 1000);
            }
        };

        const startLoop = () => {
            let cancel = false;
            let lastFrameTime = 0;

            const loop = (timestamp: number) => {
                if (cancel) return;

                // Automatically pause loop when tab is in background to save CPU and battery
                if (document.hidden) {
                    animationRef.current = requestAnimationFrame(loop);
                    return;
                }

                const now = timestamp || performance.now();
                const delta = now - lastFrameTime;

                if (delta >= FRAME_INTERVAL) {
                    lastFrameTime = now - (delta % FRAME_INTERVAL);
                    timeRef.current += animationSpeed;
                    const elapsedSeconds = now / 1000;
                    if (sourceDataRef.current) {
                        renderLoop(ctx, internalWidth, internalHeight, timeRef.current, elapsedSeconds);
                    }
                }

                if (animated || enableHover || isScanMode) {
                    animationRef.current = requestAnimationFrame(loop);
                }
            };

            prepareSource();
            renderSingleFrame();
            if (animated || enableHover || isScanMode) {
                animationRef.current = requestAnimationFrame(loop);
            }
            return () => {
                cancel = true;
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
            };
        };

        const currentSrc = imageRef.current?.getAttribute('src') || imageRef.current?.src || '';
        const isSameImage = currentSrc.endsWith(src) || currentSrc === src;

        if (imageRef.current && imageRef.current.complete && isSameImage) {
            return startLoop();
        } else {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => {
                imageRef.current = img;
                prepareSource();
                renderSingleFrame();
            };
            img.onerror = () => {
                console.error(`Failed to load dither image: ${src}`);
            };

            return startLoop();
        }
    }, [src, dimensions, gridSize, renderLoop, animated, animationSpeed, enableHover, objectFit, isScanMode]);

    return (
        <div
            ref={containerRef}
            className={cn("relative h-full w-full overflow-hidden", className)}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full pointer-events-none"
                style={{
                    imageRendering: "pixelated",
                    width: "100%",
                    height: "100%"
                }}
            />
        </div>
    );
};
