import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Full IFBUILDER Logo: Pixel Computer Icon + IFBUILDER Text (Spaceship Font)
 * Uses viewBox="0 0 73 11" and fill="currentColor" to dynamically inherit theme colors.
 */
export const IFBuilderLogo: React.FC<LogoProps> = ({ className = "w-auto h-8", style }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 73 11"
            fill="currentColor"
            shapeRendering="crispEdges"
            className={className}
            style={style}
            aria-label="IFBUILDER"
            role="img"
        >
            <g fill="currentColor">
                <rect x="2" y="0" width="6" height="1" />
                <rect x="1" y="1" width="1" height="1" />
                <rect x="8" y="1" width="1" height="1" />
                <rect x="1" y="2" width="1" height="1" />
                <rect x="3" y="2" width="1" height="1" />
                <rect x="6" y="2" width="1" height="1" />
                <rect x="8" y="2" width="1" height="1" />
                <rect x="1" y="3" width="1" height="1" />
                <rect x="8" y="3" width="1" height="1" />
                <rect x="15" y="3" width="1" height="1" />
                <rect x="18" y="3" width="6" height="1" />
                <rect x="25" y="3" width="6" height="1" />
                <rect x="33" y="3" width="1" height="1" />
                <rect x="39" y="3" width="1" height="1" />
                <rect x="41" y="3" width="1" height="1" />
                <rect x="43" y="3" width="1" height="1" />
                <rect x="50" y="3" width="6" height="1" />
                <rect x="59" y="3" width="6" height="1" />
                <rect x="66" y="3" width="6" height="1" />
                <rect x="1" y="4" width="1" height="1" />
                <rect x="3" y="4" width="4" height="1" />
                <rect x="8" y="4" width="1" height="1" />
                <rect x="15" y="4" width="1" height="1" />
                <rect x="17" y="4" width="1" height="1" />
                <rect x="25" y="4" width="1" height="1" />
                <rect x="31" y="4" width="1" height="1" />
                <rect x="33" y="4" width="1" height="1" />
                <rect x="39" y="4" width="1" height="1" />
                <rect x="41" y="4" width="1" height="1" />
                <rect x="43" y="4" width="1" height="1" />
                <rect x="50" y="4" width="1" height="1" />
                <rect x="56" y="4" width="1" height="1" />
                <rect x="58" y="4" width="1" height="1" />
                <rect x="72" y="4" width="1" height="1" />
                <rect x="1" y="5" width="1" height="1" />
                <rect x="8" y="5" width="1" height="1" />
                <rect x="15" y="5" width="1" height="1" />
                <rect x="18" y="5" width="5" height="1" />
                <rect x="25" y="5" width="6" height="1" />
                <rect x="33" y="5" width="1" height="1" />
                <rect x="39" y="5" width="1" height="1" />
                <rect x="41" y="5" width="1" height="1" />
                <rect x="43" y="5" width="1" height="1" />
                <rect x="50" y="5" width="1" height="1" />
                <rect x="56" y="5" width="1" height="1" />
                <rect x="59" y="5" width="5" height="1" />
                <rect x="67" y="5" width="5" height="1" />
                <rect x="1" y="6" width="8" height="1" />
                <rect x="15" y="6" width="1" height="1" />
                <rect x="17" y="6" width="1" height="1" />
                <rect x="25" y="6" width="1" height="1" />
                <rect x="31" y="6" width="1" height="1" />
                <rect x="33" y="6" width="1" height="1" />
                <rect x="39" y="6" width="1" height="1" />
                <rect x="41" y="6" width="1" height="1" />
                <rect x="43" y="6" width="1" height="1" />
                <rect x="50" y="6" width="1" height="1" />
                <rect x="56" y="6" width="1" height="1" />
                <rect x="58" y="6" width="1" height="1" />
                <rect x="66" y="6" width="1" height="1" />
                <rect x="72" y="6" width="1" height="1" />
                <rect x="4" y="7" width="2" height="1" />
                <rect x="15" y="7" width="1" height="1" />
                <rect x="17" y="7" width="1" height="1" />
                <rect x="25" y="7" width="6" height="1" />
                <rect x="34" y="7" width="5" height="1" />
                <rect x="41" y="7" width="1" height="1" />
                <rect x="44" y="7" width="5" height="1" />
                <rect x="50" y="7" width="6" height="1" />
                <rect x="59" y="7" width="6" height="1" />
                <rect x="66" y="7" width="1" height="1" />
                <rect x="72" y="7" width="1" height="1" />
                <rect x="0" y="8" width="10" height="1" />
                <rect x="0" y="9" width="4" height="1" />
                <rect x="5" y="9" width="1" height="1" />
                <rect x="7" y="9" width="1" height="1" />
                <rect x="9" y="9" width="1" height="1" />
                <rect x="0" y="10" width="10" height="1" />
            </g>
        </svg>
    );
};

/**
 * Text-only IFBUILDER Logo in Spaceship Font
 * Uses viewBox="0 0 58 5" and fill="currentColor".
 */
export const IFBuilderText: React.FC<LogoProps> = ({ className = "w-auto h-5", style }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 58 5"
            fill="currentColor"
            shapeRendering="crispEdges"
            className={className}
            style={style}
            aria-label="IFBUILDER"
            role="img"
        >
            <g fill="currentColor">
                <rect x="0" y="0" width="1" height="1" />
                <rect x="3" y="0" width="6" height="1" />
                <rect x="10" y="0" width="6" height="1" />
                <rect x="18" y="0" width="1" height="1" />
                <rect x="24" y="0" width="1" height="1" />
                <rect x="26" y="0" width="1" height="1" />
                <rect x="28" y="0" width="1" height="1" />
                <rect x="35" y="0" width="6" height="1" />
                <rect x="44" y="0" width="6" height="1" />
                <rect x="51" y="0" width="6" height="1" />
                <rect x="0" y="1" width="1" height="1" />
                <rect x="2" y="1" width="1" height="1" />
                <rect x="10" y="1" width="1" height="1" />
                <rect x="16" y="1" width="1" height="1" />
                <rect x="18" y="1" width="1" height="1" />
                <rect x="24" y="1" width="1" height="1" />
                <rect x="26" y="1" width="1" height="1" />
                <rect x="28" y="1" width="1" height="1" />
                <rect x="35" y="1" width="1" height="1" />
                <rect x="41" y="1" width="1" height="1" />
                <rect x="43" y="1" width="1" height="1" />
                <rect x="57" y="1" width="1" height="1" />
                <rect x="0" y="2" width="1" height="1" />
                <rect x="3" y="2" width="5" height="1" />
                <rect x="10" y="2" width="6" height="1" />
                <rect x="18" y="2" width="1" height="1" />
                <rect x="24" y="2" width="1" height="1" />
                <rect x="26" y="2" width="1" height="1" />
                <rect x="28" y="2" width="1" height="1" />
                <rect x="35" y="2" width="1" height="1" />
                <rect x="41" y="2" width="1" height="1" />
                <rect x="44" y="2" width="5" height="1" />
                <rect x="52" y="2" width="5" height="1" />
                <rect x="0" y="3" width="1" height="1" />
                <rect x="2" y="3" width="1" height="1" />
                <rect x="10" y="3" width="1" height="1" />
                <rect x="16" y="3" width="1" height="1" />
                <rect x="18" y="3" width="1" height="1" />
                <rect x="24" y="3" width="1" height="1" />
                <rect x="26" y="3" width="1" height="1" />
                <rect x="28" y="3" width="1" height="1" />
                <rect x="35" y="3" width="1" height="1" />
                <rect x="41" y="3" width="1" height="1" />
                <rect x="43" y="3" width="1" height="1" />
                <rect x="51" y="3" width="1" height="1" />
                <rect x="57" y="3" width="1" height="1" />
                <rect x="0" y="4" width="1" height="1" />
                <rect x="2" y="4" width="1" height="1" />
                <rect x="10" y="4" width="6" height="1" />
                <rect x="19" y="4" width="5" height="1" />
                <rect x="26" y="4" width="1" height="1" />
                <rect x="29" y="4" width="5" height="1" />
                <rect x="35" y="4" width="6" height="1" />
                <rect x="44" y="4" width="6" height="1" />
                <rect x="51" y="4" width="1" height="1" />
                <rect x="57" y="4" width="1" height="1" />
            </g>
        </svg>
    );
};

/**
 * Pixel Computer Icon
 * Uses viewBox="0 0 10 11" and fill="currentColor".
 */
export const IFBuilderIcon: React.FC<LogoProps> = ({ className = "w-6 h-6", style }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 10 11"
            fill="currentColor"
            shapeRendering="crispEdges"
            className={className}
            style={style}
            aria-label="IFBuilder Icon"
            role="img"
        >
            <g fill="currentColor">
                <rect x="2" y="0" width="6" height="1" />
                <rect x="1" y="1" width="1" height="1" />
                <rect x="8" y="1" width="1" height="1" />
                <rect x="1" y="2" width="1" height="1" />
                <rect x="3" y="2" width="1" height="1" />
                <rect x="6" y="2" width="1" height="1" />
                <rect x="8" y="2" width="1" height="1" />
                <rect x="1" y="3" width="1" height="1" />
                <rect x="8" y="3" width="1" height="1" />
                <rect x="1" y="4" width="1" height="1" />
                <rect x="3" y="4" width="4" height="1" />
                <rect x="8" y="4" width="1" height="1" />
                <rect x="1" y="5" width="1" height="1" />
                <rect x="8" y="5" width="1" height="1" />
                <rect x="1" y="6" width="8" height="1" />
                <rect x="4" y="7" width="2" height="1" />
                <rect x="0" y="8" width="10" height="1" />
                <rect x="0" y="9" width="4" height="1" />
                <rect x="5" y="9" width="1" height="1" />
                <rect x="7" y="9" width="1" height="1" />
                <rect x="9" y="9" width="1" height="1" />
                <rect x="0" y="10" width="10" height="1" />
            </g>
        </svg>
    );
};

/**
 * Short "IF" Logo in Spaceship Font
 * Uses viewBox="0 0 9 5" and fill="currentColor".
 */
export const IFBuilderShort: React.FC<LogoProps> = ({ className = "w-auto h-5", style }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 9 5"
            fill="currentColor"
            shapeRendering="crispEdges"
            className={className}
            style={style}
            aria-label="IF"
            role="img"
        >
            <g fill="currentColor">
                <rect x="0" y="0" width="1" height="1" />
                <rect x="3" y="0" width="6" height="1" />
                <rect x="0" y="1" width="1" height="1" />
                <rect x="2" y="1" width="1" height="1" />
                <rect x="0" y="2" width="1" height="1" />
                <rect x="3" y="2" width="5" height="1" />
                <rect x="0" y="3" width="1" height="1" />
                <rect x="2" y="3" width="1" height="1" />
                <rect x="0" y="4" width="1" height="1" />
                <rect x="2" y="4" width="1" height="1" />
            </g>
        </svg>
    );
};

/**
 * Modern IFBuilder Text Logo in Space Mono Italic (Regular 400, lowercase, reduced letter spacing)
 */
export const IFBuilderMonoText: React.FC<LogoProps> = ({ className, style }) => {
    return (
        <span
            className={cn(
                "font-space-mono italic font-normal tracking-[-0.06em] select-none leading-none inline-block notranslate text-current",
                className
            )}
            style={{ fontFamily: "'Space Mono', monospace", ...style }}
            aria-label="ifbuilder"
            role="img"
        >
            ifbuilder
        </span>
    );
};

/**
 * Modern IFBuilder Collapsed Monogram in Space Mono Italic (Bold 700, lowercase, reduced letter spacing)
 */
export const IFBuilderMonoShort: React.FC<LogoProps> = ({ className, style }) => {
    return (
        <span
            className={cn(
                "font-space-mono italic font-bold tracking-[-0.05em] select-none leading-none inline-block notranslate text-current",
                className
            )}
            style={{ fontFamily: "'Space Mono', monospace", ...style }}
            aria-label="if"
            role="img"
        >
            if
        </span>
    );
};

const PixelTextPaths = () => (
    <g fill="currentColor">
        <path d="M6220,3451.8v216h-36v180l-34.3,3.7-1.7,140.3-29.5.5-6,6-.5,209.5-29.5.5-6,6-.5,101.5c-2.5,2.5-31-5.2-36,6v174h72l3.7-34.3,32.3-1.8v36s36,0,36,0v72l-32.3,1.7-3.7,34.3-34.3,3.7-1.7,32.3h-144v-36s-36,0-36,0v-36s-36,0-36,0v-72l-32.3,1.7-3.7,34.3-32.3,1.7-3.7,34.3-34.3,3.7-1.7,32.3h-102l-8.3,36.1h-173.7c-2.5-2.6,5.2-31-6-36.1h-66l-1.7-32.3-34.3-3.7-1.7-32.3-34.3-3.7-3.7-34.3-32.3-1.7v-396h36s0-36,0-36h36s0-72,0-72h36v-72h36s0-36,0-36h72v-36s36,0,36,0v-36s140,0,140,0c1.1-12.1-4.5-27.5,6-36h102v36h108v36s36,0,36,0v72h72v-138c5-11.2,33.5-3.5,36-6l.5-173.5,6-6,29.4-.6v-138l6-6h102ZM5860,3919.8h-210c-11.2,5-3.5,33.5-6,36h-32s0,36,0,36h-72v36s-36,0-36,0v72h-36v108h-36v144c12.1,1.1,27.5-4.5,36,6v102l32.3,1.7,3.7,34.3h66c11.2,5,3.5,33.5,6,36h137.7s8.3-36,8.3-36h66l1.7-32.3,34.3-3.7,1.7-32.3,34.3-3.7,3.7-34.3,32.3-1.7,3.7-34.3,32.3-1.7v-102c8.5-10.5,23.9-4.9,36-6v-216h-36s0-36,0-36h-36s0-36,0-36h-36s0-36,0-36Z"/>
        <path d="M2376,3451.8v72h-36v144h-36v180h-36v108h36s0-36,0-36h36s0-36,0-36h36s0-36,0-36h36s0-36,0-36h108v-36h108v36h108v36s36,0,36,0v36s36,0,36,0v36s36,0,36,0v108h36v216h-36v108h-36v72h-36v72h-36s0,36,0,36h-36s0,36,0,36h-72v36h-108v36h-180v-36h-108v-36s-36,0-36,0v-36s-72,0-72,0v72h-36s0,36,0,36h-72v-216h36v-144h36v-180h36v-180h36v-144h36v-216h36v-108h144ZM2628,3919.8h-216v36s-36,0-36,0v36s-72,0-72,0v36s-36,0-36,0v72h-36v72h-36v216h36v72h36s0,36,0,36h72v36h144v-36h72v-36s36,0,36,0v-36s36,0,36,0v-36s36,0,36,0v-36s36,0,36,0v-72h36v-252h-36v-72h-72v-36Z"/>
        <path d="M2016,3487.8v108h-318c-11.2,5-3.5,33.5-6,36-12.1,1.1-27.5-4.5-36,6v174h252v36s36.1,2.3,36.1,2.3v33.7s-36.1,0-36.1,0v36s-282,0-282,0l-6,6v66l-29.4.6-6,6-.5,209.5-29.5.5-6,6-.5,173.5-29.5.5-6,6-.5,137.5-29.5.5-6,6-.5,173.5-29.5.5-6,6-.5,137.5c-2.5,2.5-31-5.2-36,6v66l-32.3,1.7-3.7,34.3h-176l-1.7-32.3-34.3-3.7-3.7-34.3-32.3-1.7v-66c-8.5-10.5-23.9-4.9-36-6v-72h72v-36c12,1.1,27.5-4.4,36,6v66l32.3,1.7,3.7,34.3h72v-108h36v-144h32v-174c5-11.2,33.5-3.5,36-6l.5-137.5,6-6,29.5-.5,1.7-140.3,34.3-3.7v-180h-248v-108h284l1.7-32.3,34.3-3.7v-210c5-11.2,33.5-3.5,36-6l1.7-32.3,34.3-3.7c2.5-2.5-5.2-31,6-36h390Z"/>
        <path d="M6868,3775.8v36h108v36s36,0,36,0v36s36,0,36,0v36s36,0,36,0v72h36v216h-36s0,36,0,36h-648v144h36v72h36s0,36,0,36h72v36h144v-36h108v-36s36,0,36,0v-36s36,0,36,0v-72h72v36h72v36s-36,0-36,0v72h-36s0,36,0,36h-36s0,36,0,36h-72v36h-108v36h-216v-36h-108v-36s-36,0-36,0v-36s-36,0-36,0v-36s-36,0-36,0v-108h-36s0-33.7,0-33.7l36.1-4.6v-33.7s-36.1,0-36.1,0v-36s36,0,36,0v-180h36v-72h36s0-36,0-36h36s0-72,0-72h72v-36s36,0,36,0v-36s72,0,72,0v-36h108v-36h144ZM6904,3919.8h-252v36h-72v36s-36,0-36,0v36s-36,0-36,0v36s-36,0-36,0v36h36s0,36,0,36h468v-36s36,0,36,0v-72h-36s0-36,0-36h-36s0-36,0-36h-36s0-36,0-36Z"/>
        <path d="M7516,3811.8h66l6,6v66h72v-36h72v-36h68c1.1-12.1-4.5-27.5,6-36h102v36h108v36s36,0,36,0v36s36,0,36,0v108h36v108l-32.3,1.7-3.7,34.3h-108v-144h-36s0-36,0-36h-36s0-36,0-36h-176v36h-72v36s-36,0-36,0v72h-36v108h-36v180h-36v144h138c10.5,8.5,4.9,23.9,6,36,2.5,2.5,31-5.2,36,6v66h-36s0,36,0,36h-468v-36s-36,0-36,0v-72h36s0-36,0-36h180v-108h36v-144h36v-180h36v-138l-6-6h-66v36s-36,0-36,0v36s-108,0-108,0l-3.7-34.3-32.3-1.7v-36s36,0,36,0v-36s36,0,36,0v-36s72,0,72,0v-36h72v-36h66c10.7,3.9,4.1,36,6,36Z"/>
        <path d="M3240,3955.8h-36v144h-36v144h-36v216l34.3,3.7,1.7,32.3h66c10.5,8.5,4.9,23.9,6,36h144v-36h72v-36s36,0,36,0v-36s32,0,32,0l1.7-32.3,34.3-3.7v-66c8.5-10.5,23.9-4.9,36-6,4.7-4.7-3.7-114.2,0-134,.8-4.6,1.4-8.1,6.6-9.4l29.5-.5.5-137.5,6-6,29.5-.5.5-173.5,6-6,29.5-.5c2.5-2.5-5.2-31,6-36h102v144l-29.4.6-6,6-.5,173.5-29.5.5-6,6-.5,137.5-29.5.5c-5.2,1.3-5.7,4.9-6.6,9.4-3.7,19.9,4.8,129.3,0,134-12.1,1.1-27.5-4.5-36,6v66h108l3.7-34.3,32.3-1.8v36s36,0,36,0v72l-34.3,3.7-1.7,32.3h-66c-10.5,8.5-4.9,23.9-6,36h-144v-36s-36,0-36,0v-108h-68v72h-72v36h-72v36h-180c-1.1-12.1,4.5-27.5-6-36h-66l-1.7-32.3-34.3-3.7-3.7-34.3-32.3-1.7v-102c-8.5-10.5-23.9-4.9-36-6v-72h36v-180h36v-144h36v-180h36s0-36,0-36h102l6,6v138Z"/>
        <polygon points="4964 3451.8 4964 3487.8 5036 3487.8 5036 3739.8 5000 3739.8 5000 3919.8 4964 3919.8 4964 4027.8 4928 4027.8 4928 4207.8 4892 4207.8 4892 4351.8 4856 4351.8 4856 4531.8 4892 4531.9 4892 4495.8 4964 4495.8 4964 4459.8 5000 4459.9 5000 4423.8 5036 4423.9 5036 4387.8 5102 4387.8 5108 4393.8 5108 4459.8 5142.3 4463.6 5144 4495.9 5108 4495.8 5108 4531.8 5036 4531.8 5036 4567.9 5000 4567.8 5000 4603.8 4928 4603.8 4928 4639.8 4784 4639.8 4784 4603.8 4748 4603.9 4748 4567.8 4712 4567.8 4712 4387.8 4748 4387.8 4748 4243.8 4784 4243.8 4784 4099.8 4820 4099.8 4820 3955.8 4856 3955.8 4856 3811.8 4892 3811.8 4892 3667.8 4928 3667.8 4928 3595.8 4820 3595.8 4820 3631.9 4784 3631.8 4784 3667.8 4712 3667.8 4712 3703.8 4640 3703.8 4640 3667.8 4604 3667.9 4604 3631.8 4640 3631.9 4640 3595.8 4676 3595.9 4676 3559.8 4712 3559.9 4712 3523.8 4784 3523.8 4784 3487.8 4856 3487.8 4856 3451.8 4964 3451.8"/>
        <path d="M4208,3811.8v-36s33.7,0,33.7,0l2.3,36.1h72v36s36,0,36,0v252h-36v108h-36v144h-36v180h36s0-36,0-36h72v-36s36,0,36,0v-36s36,0,36,0v-36s72,0,72,0v72h36s0,33.7,0,33.7l-36.1,2.3v36s-72,0-72,0v36s-36,0-36,0v36s-72,0-72,0v36h-144v-36s-36,0-36,0v-36s-36,0-36,0v-144h36v-144h36v-144h36v-144h36v-72h-72v36h-72v36s-36,0-36,0v36s-108,0-108,0v-36s-36,0-36,0l.6-29.5,6-6,29.5-.5,3.7-34.3,32.3-1.7c2.5-2.5-5.2-31,6-36h66v-36s36,0,36,0v-36s108,0,108,0Z"/>
        <path d="M850,3775.8v36s32.3,1.7,32.3,1.7l3.7,34.3c2.5,2.5,31-5.2,36,6v246h-36v144h-36v144h-36v144h36s0-36,0-36h72v-36s36,0,36,0v-36s72,0,72,0v-36c9.3,1.2,31.8-4.6,35.4,6.6l.5,29.5c2.5,2.5,31-5.2,36,6v66h-36s0,36,0,36h-36s0,36,0,36h-72v36h-72v36h-144v-36s-36,0-36,0v-72h-36v-72h36v-144h36v-144h36v-144h36v-108h-72v36h-72v36s-36,0-36,0v36s-108,0-108,0v-36s-36,0-36,0v-36s36,0,36,0v-36s36,0,36,0v-36s72,0,72,0v-36s36,0,36,0v-36s108,0,108,0v-36h72Z"/>
        <polygon points="4424 3451.8 4424 3487.9 4460 3487.8 4460 3523.9 4496 3523.8 4496 3631.8 4460 3631.8 4460 3667.9 4424 3667.8 4424 3703.8 4352 3703.8 4352 3667.8 4280 3667.8 4280 3595.8 4243.9 3593.5 4244 3559.8 4280 3559.8 4280 3487.8 4316 3487.9 4316 3451.8 4424 3451.8"/>
        <path d="M988,3451.8c9.5,2.9,5.3,27.4,6,36l34.3,3.7,1.7,32.3c2.5,2.5,31-5.2,36,6v102h-36s0,36,0,36h-36s0,36,0,36h-72c-1.1-12.1,4.5-27.5-6-36h-66v-72l-36.1-2.3v-33.7s36.1,0,36.1,0v-72h72v-36h66Z"/>
    </g>
);

const PixelBullPaths = () => (
    <g fill="currentColor">
        <path d="M5968.2,832.2v227.9l-23.3.4-4.7,4.7-.4,108.8c-2,2-24.5-4.1-28.5,4.7v52.2l-25.5,1.4-2.9,27.1-25.5,1.4-2.9,27.1-25.5,1.4-2.9,27.1-25.5,1.4-2.9,27.1-25.5,1.4-2.9,27.1c-2,2-24.5-4.1-28.5,4.7v52.2l-27.1,3-1.4,25.5h-82.3v57h196.2l3-27.1,54-1.4,2.9-27.1,54-1.4c2-2-4.1-24.5,4.7-28.5h52.2l1.4-25.5,27.1-2.9c2-2-4.1-24.5,4.7-28.5h52.2v-57h28.5s0-28.5,0-28.5h28.5s0-57,0-57h28.5s0-28.5,0-28.5h28.5s0-85.4,0-85.4h28.5v-57h28.5s0-28.5,0-28.5h57v57h-28.5v85.5h-28.5v57h-28.5v57h57v-28.5s28.5,0,28.5,0v-28.5s28.5,0,28.5,0v-28.5s28.5,0,28.5,0v-28.5s28.5,0,28.5,0v-28.5s28.5,0,28.5,0v-85.5h57v85.5h-28.5v57h-28.5s0,28.5,0,28.5h-28.5s0,28.5,0,28.5h-28.5s0,28.5,0,28.5h-28.5s0,28.5,0,28.5h-57v28.5h-113.9v28.5s-28.5,0-28.5,0v28.5s-28.5,0-28.5,0v28.5s-28.5,0-28.5,0v28.5s-52.2,0-52.2,0c-8.9,4-2.7,26.5-4.7,28.5l-27.1,2.9-1.4,25.5h-52.2c-8.9,4-2.7,26.5-4.7,28.5l-80.3.4-4.7,4.7-.4,23.3h-109.2l-4.7,4.7v194.7h28.5v341.8l-25.5,1.4-3,27.1h-85.5v-28.5h-53.8l-1.4-25.5-27.1-2.9-1.4-25.5-27.1-2.9-1.4-25.5-27.1-2.9-2.9-27.1-54-1.4-.4-23.3-4.7-4.7-51.8-.4c-2-2,4.1-24.5-4.7-28.5h-80.7v57h-28.5v113.9h-28.5v57h-28.5v199.4l23.3.4,4.7,4.7.4,137.3,23.3.4,4.7,4.7.4,80.3,27.1,2.9,1.4,54c2,2,24.5-4.1,28.5,4.7v80.7l25.5,1.4,2.9,27.1c2,2,24.5-4.1,28.5,4.7v52.2l25.5,1.4,2.9,27.1,25.5,1.4,2.9,27.1,25.5,1.4,2.9,27.1c2,2,24.5-4.1,28.5,4.7v52.2h-142.4l-3-27.1-25.5-1.4v-109.2c-4-8.9-26.5-2.7-28.5-4.7l-.4-51.8-4.7-4.7-23.3-.4-1.4-54-27.1-2.9-2.9-27.1-25.5-1.4-2.9-27.1-25.5-1.4v-57h-28.5v-57h-28.5s0-28.5,0-28.5h-85.5v28.5s-28.5,0-28.5,0v57h-28.5v113.9h28.5v85.5h28.5v57h28.5v57h28.5s0,28.5,0,28.5h28.5s0,57,0,57h28.5v57h-142.4v-85.5h-28.5v-57h-28.5v-142.4h-28.5v-57h-28.5v-57h-28.5s0-28.5,0-28.5h-28.5s0-28.5,0-28.5h-28.5s0-28.5,0-28.5h-28.5s0-28.5,0-28.5h-28.5s0-57,0-57h-28.5s0-28.5,0-28.5h-28.5s0-28.5,0-28.5h-57v-28.5h-57v-28.5h-85.5v-28.5h-422.6c-8.9,4-2.7,26.5-4.7,28.5l-80.3.4-4.7,4.7-.4,23.3h-82.3v28.5s-28.5,0-28.5,0v28.5s-28.5,0-28.5,0v28.5s-28.5,0-28.5,0v28.5s-28.5,0-28.5,0v85.5h-28.5v85.5l23.3.4,4.7,4.7.4,80.3c2,2,24.5-4.1,28.5,4.7v80.7l25.5,1.4,2.9,27.1,25.5,1.4,2.9,27.1c2,2,24.5-4.1,28.5,4.7v52.2h-57v28.5s-28.5,0-28.5,0l-1.4-25.5-27.1-2.9-2.9-27.1-25.5-1.4v-109.2c-6.8-8.3-18.9-3.8-28.5-4.7-3.7-3.8,2.9-90.3,0-106.1-.7-3.6-1.1-6.4-5.2-7.5l-23.3-.4-.4-108.8-4.7-4.7-23.3-.4-.4-108.8-4.7-4.7-23.3-.4-2.9-55.6-25.5-1.4v28.5s-57,0-57,0v28.5s-28.5,0-28.5,0v57h-28.5s0,28.5,0,28.5h-28.5s0,85.4,0,85.4h-28.5v142.4h28.5v57h28.5v57c9.5.9,21.7-3.5,28.5,4.7v52.2h-113.9v-28.5s-28.5,0-28.5,0v-284.9h-28.5v-170.9h28.5v-57h28.5s0-28.5,0-28.5h28.5s0-199.4,0-199.4h-28.5v-57h-28.5s0-28.5,0-28.5h-28.5s0-57,0-57h-28.5v-57h-28.5v-142.4h-28.5v-142.4h-57v57h-28.5s0,28.5,0,28.5h-28.5s0,57,0,57h-28.5v57h-28.5v113.9h-28.5v113.9h-28.5s0,28.5,0,28.5h-28.5s0,57,0,57h-57v28.5h-57v28.5h-113.9v-28.5s-28.5,0-28.5,0v-28.5s-28.5,0-28.5,0v-28.5s-28.5,0-28.5,0v-57h28.5s0-28.5,0-28.5h57v28.5s28.5,0,28.5,0v28.5s28.5,0,28.5,0v57h57v-28.5h57v-57h28.5s0-28.5,0-28.5h28.5s0-85.4,0-85.4h28.5v-142.4h28.5v-57h28.5v-57h28.5v-57h28.5s0-28.5,0-28.5h28.5s0-28.5,0-28.5h28.5s0-28.5,0-28.5h28.5s0-28.5,0-28.5h28.5s0-28.5,0-28.5h28.5s0-28.5,0-28.5h28.5s0-28.5,0-28.5h28.5s0-28.5,0-28.5h85.5v-28.5h199.4v-28.5h137.7c8.3,6.7,3.9,18.9,4.7,28.5h224.7v28.5h256.4l.4-23.3,4.7-4.7,80.3-.4c2-2-4.1-24.5,4.7-28.5h52.2v-28.5s28.5,0,28.5,0v-28.5s85.4,0,85.4,0v-28.5s28.5,0,28.5,0v-28.5s28.5,0,28.5,0v-28.5s85.4,0,85.4,0v-28.5h170.9v-28.5h113.9v28.5h85.5v28.5h57v28.5h57v28.5s28.5,0,28.5,0v28.5s52.2,0,52.2,0c8.9,4,2.7,26.5,4.7,28.5l27.1,2.9,1.4,25.5h52.2c8.3,6.7,3.9,18.9,4.7,28.5h142.4v-28.5h57v-28.5h57v-28.5h53.8c.9-9.5-3.5-21.7,4.7-28.5h52.2l1.4-25.5,27.1-2.9,1.4-25.5,27.1-2.9,2.9-27.1,25.5-1.4,2.9-27.1,25.5-1.4v-52.2c4-8.9,26.5-2.7,28.5-4.7l1.4-54,27.1-2.9,1.4-54,27.1-3v-223.1l4.7-4.7h52.2ZM4945.8,1344.9h-284.9v28.5s-28.5,0-28.5,0v28.5s-28.5,0-28.5,0v28.5s-57,0-57,0v28.5h-85.5v28.5h-57v28.5h-52.2c-8.9,4-2.7,26.5-4.7,28.5l-54,1.4-3,27.1h-85.5v-28.5h-170.9v-28.5h-139.3c-.9-9.5,3.5-21.7-4.7-28.5h-137.7v28.5h-170.9v28.5h-57v28.5s-28.5,0-28.5,0v28.5s-28.5,0-28.5,0v28.5s-28.5,0-28.5,0v57h-28.5v227.9h28.5v85.5h28.5s0,28.5,0,28.5h28.5s0,57,0,57h28.5s0,28.5,0,28.5l25.5,1.4,3,27.1h52.2c8.9,4,2.7,26.5,4.7,28.5l54,1.4,2.9,27.1,27.1,2.9,1.4,25.5,27.1,2.9,1.4,25.5h52.2c8.3,6.8,3.8,18.9,4.7,28.5,3.8,3.7,90.3-2.9,106.1,0,3.6.7,6.4,1.1,7.5,5.2l.4,23.3h80.5s2.3-23.3,2.3-23.3l4.7-4.7,108.8-.4c2-2-4.1-24.5,4.7-28.5h451v28.5h85.5v28.5h57v28.5h57v28.5s28.5,0,28.5,0v28.5s57,0,57,0v28.5h170.9v-28.5s28.5,0,28.5,0v-28.5s28.5,0,28.5,0v-57h28.5v-256.4h-28.5v-57h-28.5v-57h-28.5s0-28.5,0-28.5h-28.5s0-85.4,0-85.4h-28.5v-85.5h-28.5v-113.9h28.5v-57h28.5s0-28.5,0-28.5h28.5s0-170.9,0-170.9h-57v-28.5Z"/>
        <polygon points="3752.5 1829.2 3804.8 1829.2 3809.5 1834 3809.5 1886.2 3695.6 1886.2 3692.6 1859.1 3667.1 1857.7 3667.1 1829.2 3724 1829.2 3724 1800.7 3749.6 1802.1 3752.5 1829.2"/>
        <polygon points="4005.8 1601.3 4005.7 1629.8 4034.3 1629.8 4034.2 1658.3 3895 1658.3 3892 1631.2 3866.5 1629.8 3866.5 1601.3 4005.8 1601.3"/>
        <polygon points="4803.4 1487.4 4803.4 1515.9 4831.9 1515.8 4831.9 1544.3 4661 1544.3 4661 1515.8 4717.9 1515.8 4717.9 1487.4 4803.4 1487.4"/>
        <polygon points="4062.7 1800.7 4065.7 1773.6 4119.7 1772.2 4120.1 1748.9 4124.9 1744.2 4148.2 1743.7 4148.2 1772.2 4205.2 1772.2 4205.2 1829.2 4119.7 1829.2 4119.7 1800.7 4062.7 1800.7"/>
        <polygon points="4604 1800.7 4632.5 1800.7 4632.5 1829.2 4774.9 1829.2 4774.9 1857.7 4661 1857.7 4661 1886.2 4634.3 1886.2 4632.5 1857.7 4604 1857.7 4604 1800.7"/>
        <path d="M3719.3,1658.3c7.4,2.3,4.3,21.7,4.8,28.5h-28.5s0,28.5,0,28.5h-57c-.9-9.5,3.5-21.7-4.7-28.5h-52.2v-28.5h137.7Z"/>
        <path d="M4490,1658.3v28.5h-199.4c.9-9.5-3.5-21.7,4.7-28.5h194.7Z"/>
    </g>
);

/**
 * Pixelated "ifbuilder" text logo (without bull mascot)
 * Authentic 1-bit PC aesthetic from vector reference.
 */
export const IFBuilderPixelText: React.FC<LogoProps> = ({ className = "w-auto h-8", style }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="450 3400 7720 1600"
            fill="currentColor"
            shapeRendering="crispEdges"
            className={cn("select-none text-current inline-block", className)}
            style={style}
            aria-label="ifbuilder"
            role="img"
        >
            <PixelTextPaths />
        </svg>
    );
};

/**
 * Pixelated Bull mascot icon
 * Authentic 1-bit PC aesthetic from vector reference.
 */
export const IFBuilderPixelBull: React.FC<LogoProps> = ({ className = "w-auto h-8", style }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="2680 800 3850 2300"
            fill="currentColor"
            shapeRendering="crispEdges"
            className={cn("select-none text-current inline-block", className)}
            style={style}
            aria-label="ifbuilder bull"
            role="img"
        >
            <PixelBullPaths />
        </svg>
    );
};

export interface PixelLogoProps extends LogoProps {
    hideIcon?: boolean;
    layout?: 'horizontal' | 'vertical';
}

/**
 * Authentic Pixelated IFBuilder Logo (Pixel Bull + Pixelated "ifbuilder" text)
 * Supports horizontal (bull on left of title) or vertical (stacked) layouts.
 */
export const IFBuilderPixelLogo: React.FC<PixelLogoProps> = ({
    className = "w-full max-w-[280px] sm:max-w-[340px] h-auto",
    style,
    hideIcon = false,
    layout = 'horizontal',
}) => {
    if (hideIcon) {
        return <IFBuilderPixelText className={className} style={style} />;
    }

    if (layout === 'horizontal') {
        return (
            <div className={cn("inline-flex items-center gap-1.5 sm:gap-2 select-none text-current", className)} style={style}>
                <IFBuilderPixelBull className="w-[170px] sm:w-[230px] h-auto flex-shrink-0" />
                <IFBuilderPixelText className="w-[264px] sm:w-[336px] h-auto flex-shrink-0" />
            </div>
        );
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 8588 5796"
            fill="currentColor"
            shapeRendering="crispEdges"
            className={cn("select-none text-current", className)}
            style={style}
            aria-label="ifbuilder"
            role="img"
        >
            <PixelTextPaths />
            <PixelBullPaths />
        </svg>
    );
};

/**
 * Authentic BIOS ASCII Art Logo
 */
export const IF_BUILDER_ASCII_LOGO = [
    "______________/\\\\\\\\\\__/\\\\\\_____________________________/\\\\\\\\\\\\____________/\\\\\\_______________________________        ",
    " ____________/\\\\\\///__\\/\\\\\\____________________________\\////\\\\\\___________\\/\\\\\\_______________________________       ",
    "  __/\\\\\\_____/\\\\\\______\\/\\\\\\_______________________/\\\\\\____\\/\\\\\\___________\\/\\\\\\_______________________________      ",
    "   _\\///___/\\\\\\\\\\\\\\\\\\___\\/\\\\\\_________/\\\\\\____/\\\\\\_\\///_____\\/\\\\\\___________\\/\\\\\\______/\\\\\\\\\\\\\\\\___/\\\\/\\\\\\\\\\\\\\__     ",
    "    __/\\\\\\_\\////\\\\\\//____\\/\\\\\\\\\\\\\\\\\\__\\/\\\\\\___\\/\\\\\\__/\\\\\\____\\/\\\\\\______/\\\\\\\\\\\\\\\\\\____/\\\\\\/////\\\\\\_\\/\\\\\\/////\\\\\\_    ",
    "     _\\/\\\\\\____\\/\\\\\\______\\/\\\\\\////\\\\\\_\\/\\\\\\___\\/\\\\\\_\\/\\\\\\____\\/\\\\\\_____/\\\\\\////\\\\\\___/\\\\\\\\\\\\\\\\\\\\\\__\\/\\\\\\___\\///__   ",
    "      _\\/\\\\\\____\\/\\\\\\______\\/\\\\\\__\\/\\\\\\_\\/\\\\\\___\\/\\\\\\_\\/\\\\\\____\\/\\\\\\____\\/\\\\\\__\\/\\\\\\__\\//\\\\///////___\\/\\\\\\_________  ",
    "       _\\/\\\\\\____\\/\\\\\\______\\/\\\\\\\\\\\\\\\\\\__\\//\\\\\\\\\\\\\\\\\\__\\/\\\\\\__/\\\\\\\\\\\\\\\\\\_\\//\\\\\\\\\\\\\\/\\\\__\\//\\\\\\\\\\\\\\\\\\\\_\\/\\\\\\_________ ",
    "        _\\///_____\\///_______\\/////////____\\/////////___\\///__\\/////////___\\///////\\//____\\//////////__\\///__________"
].join('\n');

export const IFBuilderBiosAscii: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "", style }) => {
    return (
        <pre
            className={cn("font-mono text-[8px] sm:text-[10px] md:text-[12px] lg:text-[13px] leading-[1.15] select-none whitespace-pre overflow-x-auto notranslate", className)}
            style={{
                fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'Courier New', monospace",
                ...style
            }}
            translate="no"
            aria-label="ifbuilder ASCII logo"
            role="img"
        >
            {IF_BUILDER_ASCII_LOGO}
        </pre>
    );
};


