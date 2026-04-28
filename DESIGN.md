---
design:
  tokens:
    color:
      light:
        background: "oklch(1 0 0)"
        foreground: "oklch(0.145 0 0)"
        card: "oklch(1 0 0)"
        card-foreground: "oklch(0.145 0 0)"
        primary: "#2563eb"
        primary-foreground: "#ffffff"
        secondary: "oklch(0.97 0 0)"
        secondary-foreground: "oklch(0.205 0 0)"
        muted: "oklch(0.97 0 0)"
        muted-foreground: "oklch(0.556 0 0)"
        accent: "oklch(0.97 0 0)"
        destructive: "oklch(0.577 0.245 27.325)"
        border: "oklch(0.922 0 0)"
        input: "oklch(0.922 0 0)"
        ring: "#2563eb"
      dark:
        background: "#0F0F0F"
        foreground: "#FFFFFF"
        card: "#1A1A1A"
        card-foreground: "#FFFFFF"
        primary: "#9D4EDD"
        primary-foreground: "#FFFFFF"
        secondary: "#2A2A2A"
        secondary-foreground: "#FFFFFF"
        muted: "#2A2A2A"
        muted-foreground: "#A1A1AA"
        border: "#2A2A2A"
        input: "#2A2A2A"
        ring: "#9D4EDD"
      cream:
        background: "oklch(0.98 0.02 95)"
        foreground: "oklch(0.20 0.02 30)"
        card: "oklch(0.95 0.03 95)"
        card-foreground: "oklch(0.20 0.02 30)"
        primary: "oklch(0.40 0.08 30)"
        primary-foreground: "oklch(0.98 0.02 95)"
        border: "oklch(0.85 0.05 95)"
      terminal:
        background: "#0D1117"
        foreground: "#4AF626"
        card: "#0D1117"
        primary: "#4AF626"
        primary-foreground: "#000000"
        border: "#30363d"
      windows:
        background: "#0F0F0F"
        foreground: "#FFFFFF"
        card: "#1A1A1A"
        primary: "#008080"
        primary-foreground: "#FFFFFF"
        border: "#2A2A2A"
    typography:
      families:
        sans: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
        display: "Silkscreen, DotGothic16, monospace"
        body: "Space Mono, IBM Plex Mono, monospace"
      weights:
        normal: 400
        bold: 700
    spacing:
      base: 4px
      scale:
        xs: 4px
        sm: 8px
        md: 16px
        lg: 24px
        xl: 32px
    borders:
      radius:
        base: 0px
        special-previews:
          portal: "40px"
          trading: "12px"
          book: "0px"
---

# IF Builder Design System

Welcome to the design specifications of IF Builder, a highly customizable environment for crafting interactive fiction.

## Core Aesthetic: Square Minimalist & Bento Box

The interface relies strongly on sharp corners (`border-radius: 0px !important` globally reset) to give it an old-school, rigid, yet clean framing. Information and controls are structured cleanly into cohesive panels resembling modern Bento Box layouts. 

## Theming & Moods

IF Builder ships with five distinct theme archetypes out-of-the-box:

- **Light Theme**: A crisp white layout relying on deep blues for primary actions.
- **Dark Theme**: The developer standard. Charcoal surface colors blended with electric purples.
- **Cream Theme**: A soft reading-oriented aesthetic mirroring traditional book paper. 
- **Terminal Theme**: A stark hacker-vibe interface using pitch blacks and luminous matrix green.
- **Windows Theme**: A vintage desktop operational flavor leveraging retro teals.

## Micro-Interactions & Special FX

Unique weather effects (Rain, Snow, Fog, Ash, Dust) as well as ambient textures (e.g., Film Grain) breathe localized depth across story scene overlays. These rely heavily on dynamic animations seamlessly playing in the background.
