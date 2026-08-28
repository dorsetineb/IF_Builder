import React from 'react';

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
