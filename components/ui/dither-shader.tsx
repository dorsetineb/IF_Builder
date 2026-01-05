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

function getLuminance(r: number, g: number, b: number): number {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export const DitherShader: React.FC<DitherShaderProps> = ({
    src,
    gridSize = 4,
    ditherMode = "bayer",
    colorMode = "original",
    invert = false,
    primaryColor = "#000000",
    secondaryColor = "#ffffff",
    customPalette = ["#000000", "#ffffff"],
    brightness = 0,
    contrast = 1,
    backgroundColor = "transparent",
    objectFit = "cover",
    threshold = 0.5,
    animated = false,
    animationSpeed = 0.02,
    enableHover = false,
    hoverRadius = 100,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const timeRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number } | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const sourceDataRef = useRef<ImageData | null>(null);

    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });

    const parsedPrimaryColor = parseColor(primaryColor);
    const parsedSecondaryColor = parseColor(secondaryColor);
    const parsedCustomPalette = customPalette.map(parseColor);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const handleMouseLeave = useCallback(() => {
        mouseRef.current = null;
    }, []);

    const renderLoop = useCallback(
        (
            ctx: CanvasRenderingContext2D,
            width: number,
            height: number,
            time: number
        ) => {
            if (!sourceDataRef.current) return;

            const outputImage = ctx.createImageData(width, height);
            const outputData = outputImage.data;
            const sourceData = sourceDataRef.current.data;
            const sourceW = sourceDataRef.current.width;
            const sourceH = sourceDataRef.current.height;

            const internalHoverRadius = hoverRadius / Math.max(1, gridSize);
            const hoverRadiusSq = internalHoverRadius * internalHoverRadius;

            const mousePos = mouseRef.current;
            let internalMouseX = -9999;
            let internalMouseY = -9999;

            if (mousePos) {
                internalMouseX = mousePos.x / Math.max(1, gridSize);
                internalMouseY = mousePos.y / Math.max(1, gridSize);
            }

            const matrixSize = gridSize <= 4 ? 4 : 8;
            const bayerMatrix = gridSize <= 4 ? BAYER_MATRIX_4x4 : BAYER_MATRIX_8x8;
            const matrixScale = matrixSize === 4 ? 16 : 64;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4;

                    const srcX = Math.floor((x / width) * sourceW);
                    const srcY = Math.floor((y / height) * sourceH);
                    const srcIdx = (srcY * sourceW + srcX) * 4;

                    let r = sourceData[srcIdx];
                    let g = sourceData[srcIdx + 1];
                    let b = sourceData[srcIdx + 2];

                    if (sourceData[srcIdx + 3] < 10) {
                        outputData[idx] = 0;
                        outputData[idx + 1] = 0;
                        outputData[idx + 2] = 0;
                        outputData[idx + 3] = 0;
                        continue;
                    }

                    if (contrast !== 1 || brightness !== 0) {
                        r = clamp((r - 128) * contrast + 128 + brightness * 255, 0, 255);
                        g = clamp((g - 128) * contrast + 128 + brightness * 255, 0, 255);
                        b = clamp((b - 128) * contrast + 128 + brightness * 255, 0, 255);
                    }

                    let luminance = getLuminance(r, g, b) / 255;

                    // --- SPOTLIGHT REVEAL LOGIC ---
                    if (enableHover) {
                        let mask = 0.0;
                        if (internalMouseX !== -9999) {
                            const dx = x - internalMouseX;
                            const dy = y - internalMouseY;
                            const distSq = dx * dx + dy * dy;
                            if (distSq < hoverRadiusSq) {
                                const dist = Math.sqrt(distSq);
                                // Linear falloff: 1.0 at center, 0.0 at radius
                                mask = 1.0 - (dist / internalHoverRadius);
                                if (mask < 0) mask = 0;
                            }
                        }
                        // Apply mask: Area outside spotlight is black (luminance 0)
                        luminance = luminance * mask;
                    }
                    // -----------------------------

                    let ditherThreshold = 0;
                    const matrixX = x % matrixSize;
                    const matrixY = y % matrixSize;

                    switch (ditherMode) {
                        case "bayer":
                            ditherThreshold = bayerMatrix[matrixY][matrixX] / matrixScale;
                            break;
                        case "noise": {
                            const noiseVal = Math.sin(x * 12.9898 + y * 78.233 + time * 100) * 43758.5453;
                            ditherThreshold = noiseVal - Math.floor(noiseVal);
                            break;
                        }
                        default:
                            ditherThreshold = 0.5;
                    }

                    ditherThreshold = ditherThreshold * (1 - threshold) + threshold * 0.5;

                    let outR = 0, outG = 0, outB = 0;

                    if (colorMode === "duotone") {
                        const dark = luminance < ditherThreshold;
                        if (dark) {
                            outR = parsedPrimaryColor[0];
                            outG = parsedPrimaryColor[1];
                            outB = parsedPrimaryColor[2];
                        } else {
                            outR = parsedSecondaryColor[0];
                            outG = parsedSecondaryColor[1];
                            outB = parsedSecondaryColor[2];
                        }
                    } else {
                        const dark = luminance < ditherThreshold;
                        const c = dark ? 0 : 255;
                        outR = c; outG = c; outB = c;
                    }

                    if (invert) {
                        outR = 255 - outR;
                        outG = 255 - outG;
                        outB = 255 - outB;
                    }

                    outputData[idx] = outR;
                    outputData[idx + 1] = outG;
                    outputData[idx + 2] = outB;
                    outputData[idx + 3] = 255;
                }
            }

            ctx.putImageData(outputImage, 0, 0);
        },
        [
            gridSize, ditherMode, colorMode, invert,
            parsedPrimaryColor, parsedSecondaryColor,
            brightness, contrast, threshold,
            enableHover, hoverRadius
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

        const internalWidth = Math.floor(dimensions.width / Math.max(1, gridSize));
        const internalHeight = Math.floor(dimensions.height / Math.max(1, gridSize));

        canvas.width = internalWidth;
        canvas.height = internalHeight;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const prepareSource = () => {
            if (!imageRef.current) return;
            const img = imageRef.current;
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

        const startLoop = () => {
            let cancel = false;
            const loop = () => {
                if (cancel) return;
                timeRef.current += animationSpeed;
                renderLoop(ctx, internalWidth, internalHeight, timeRef.current);
                if (animated || enableHover) {
                    animationRef.current = requestAnimationFrame(loop);
                }
            };
            prepareSource();
            loop();
            return () => { cancel = true; if (animationRef.current) cancelAnimationFrame(animationRef.current); };
        };

        if (imageRef.current && imageRef.current.complete) {
            return startLoop();
        } else {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => {
                imageRef.current = img;
                prepareSource();
            };
            imageRef.current = img;
            return startLoop();
        }

    }, [src, dimensions, gridSize, renderLoop, animated, animationSpeed, enableHover, objectFit]);

    return (
        <div
            ref={containerRef}
            className={cn("relative h-full w-full overflow-hidden", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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
