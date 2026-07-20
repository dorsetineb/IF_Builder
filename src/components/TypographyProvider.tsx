import React, { createContext, useContext, useEffect, useState } from "react"

export type FontSizeScale = "small" | "medium" | "large"

type TypographyProviderProps = {
    children: React.ReactNode
}

type TypographyProviderState = {
    fontFamily: string
    setFontFamily: (font: string) => void
    fontSizeScale: FontSizeScale
    setFontSizeScale: (scale: FontSizeScale) => void
}

const initialState: TypographyProviderState = {
    fontFamily: "Space Grotesk",
    setFontFamily: () => null,
    fontSizeScale: "medium",
    setFontSizeScale: () => null,
}

const TypographyContext = createContext<TypographyProviderState>(initialState)

// Escalas customizadas para parear perfeitamente o volume visual de cada fonte
// em relação à Silkscreen, que tem cap-height enorme e se comporta de forma peculiar.
export const fontScales: Record<string, Record<string, number>> = {
    "Silkscreen": {
        xs: 9, sm: 9, base: 11, lg: 11, xl: 13, "2xl": 15, "3xl": 17, "10px": 9
    },
    "Space Grotesk": {
        xs: 11, sm: 11, base: 13, lg: 13, xl: 15, "2xl": 17, "3xl": 19, "10px": 10
    },
    "EB Garamond": {
        xs: 13, sm: 13, base: 15, lg: 15, xl: 17, "2xl": 19, "3xl": 21, "10px": 12
    }
}

export function TypographyProvider({ children }: TypographyProviderProps) {
    const [fontFamily, setFontFamily] = useState<string>(
        () => localStorage.getItem("if-builder-font-family") || "Space Grotesk"
    )
    const [fontSizeScale, setFontSizeScale] = useState<FontSizeScale>(
        () => (localStorage.getItem("if-builder-font-size") as FontSizeScale) || "medium"
    )

    useEffect(() => {
        const root = window.document.documentElement

        let scaleOffset = 0
        if (fontSizeScale === "medium") scaleOffset = 2
        if (fontSizeScale === "large") scaleOffset = 4

        const currentScale = fontScales[fontFamily] || fontScales["Silkscreen"]

        root.style.setProperty("--app-font-family", `"${fontFamily}"`)
        
        Object.entries(currentScale).forEach(([key, value]) => {
            // Apply scale size (small, medium, large offset) on top of the custom base map
            const finalSize = Math.max(6, value + scaleOffset)
            root.style.setProperty(`--app-text-${key}`, `${finalSize}px`)
        })

    }, [fontFamily, fontSizeScale])

    const value = {
        fontFamily,
        setFontFamily: (font: string) => {
            localStorage.setItem("if-builder-font-family", font)
            setFontFamily(font)
        },
        fontSizeScale,
        setFontSizeScale: (scale: FontSizeScale) => {
            localStorage.setItem("if-builder-font-size", scale)
            setFontSizeScale(scale)
        },
    }

    return (
        <TypographyContext.Provider value={value}>
            {children}
        </TypographyContext.Provider>
    )
}

export const useTypography = () => {
    const context = useContext(TypographyContext)
    if (context === undefined)
        throw new Error("useTypography must be used within a TypographyProvider")
    return context
}
