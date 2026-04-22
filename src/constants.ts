export interface Font {
    name: string;
    family: string;
    category: 'pixel' | 'mono' | 'sans-serif' | 'serifada' | 'manuscrita' | 'futurista' | 'display' | 'decorativa';
    sizeAdjust: number;
}

export const FONTS: Font[] = [
    // Pixel
    { name: 'Silkscreen', family: "'Silkscreen', sans-serif", category: 'pixel', sizeAdjust: 1.0 },
    { name: 'DotGothic16', family: "'DotGothic16', sans-serif", category: 'pixel', sizeAdjust: 1.25 },
    { name: 'Pixelify Sans', family: "'Pixelify Sans', sans-serif", category: 'pixel', sizeAdjust: 1.3 },
    // Mono
    { name: 'Space Mono', family: "'Space Mono', monospace", category: 'mono', sizeAdjust: 1.2 },
    // Sans-serif / Futurista
    { name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", category: 'sans-serif', sizeAdjust: 1.3 },
    { name: 'Urbanist', family: "'Urbanist', sans-serif", category: 'sans-serif', sizeAdjust: 1.1 },
    { name: 'Chakra Petch', family: "'Chakra Petch', sans-serif", category: 'sans-serif', sizeAdjust: 1.1 },
    { name: 'Archivo', family: "'Archivo', sans-serif", category: 'sans-serif', sizeAdjust: 1.1 },
    { name: 'Asimovian', family: "'Asimovian', sans-serif", category: 'futurista', sizeAdjust: 1.1 },
    { name: 'Offside', family: "'Offside', sans-serif", category: 'futurista', sizeAdjust: 1.1 },
    { name: 'Tomorrow', family: "'Tomorrow', sans-serif", category: 'futurista', sizeAdjust: 1.1 },
    { name: 'Funnel Display', family: "'Funnel Display', sans-serif", category: 'display', sizeAdjust: 1.05 },
    { name: 'Geo', family: "'Geo', sans-serif", category: 'futurista', sizeAdjust: 1.55 },
    // Serifada / Slab
    { name: 'Zilla Slab', family: "'Zilla Slab', serif", category: 'serifada', sizeAdjust: 1.3 },
    { name: 'Arvo', family: "'Arvo', serif", category: 'serifada', sizeAdjust: 1.05 },
    { name: 'Cardo', family: "'Cardo', serif", category: 'serifada', sizeAdjust: 1.3 },
    { name: 'Texturina', family: "'Texturina', serif", category: 'serifada', sizeAdjust: 1.25 },
    { name: 'IM Fell English', family: "'IM Fell English', serif", category: 'serifada', sizeAdjust: 1.3 },
];

export const PREDEFINED_THEMES = [
    {
        name: 'Meia-Noite', nameKey: 'MeiaNoite',
        gameBackgroundColor: '#0d1117',
        textColor: '#c9d1d9', titleColor: '#58a6ff', focusColor: '#58a6ff',
        splashButtonColor: '#2ea043', splashButtonHoverColor: '#238636', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#ffffff', actionButtonTextColor: '#0d1117',
        chanceIconColor: '#ff4d4d',
    },
    {
        name: 'Floresta', nameKey: 'Floresta',
        gameBackgroundColor: '#052e16',
        textColor: '#d4d4d2', titleColor: '#a3e635', focusColor: '#a3e635',
        splashButtonColor: '#4d7c0f', splashButtonHoverColor: '#365314', splashButtonTextColor: '#f0fdf4',
        actionButtonColor: '#22c55e', actionButtonTextColor: '#ffffff',
        chanceIconColor: '#dc2626',
    },
    {
        name: 'Sépia', nameKey: 'Spia',
        gameBackgroundColor: '#292524',
        textColor: '#e7e5e4', titleColor: '#f59e0b', focusColor: '#f59e0b',
        splashButtonColor: '#a16207', splashButtonHoverColor: '#713f12', splashButtonTextColor: '#fefce8',
        actionButtonColor: '#ca8a04', actionButtonTextColor: '#ffffff',
        chanceIconColor: '#b91c1c',
    },
    {
        name: 'Terminal', nameKey: 'Terminal',
        gameBackgroundColor: '#022c22',
        textColor: '#34d399', titleColor: '#6ee7b7', focusColor: '#a7f3d0',
        splashButtonColor: '#10b981', splashButtonHoverColor: '#059669', splashButtonTextColor: '#000000',
        actionButtonColor: '#34d399', actionButtonTextColor: '#000000',
        chanceIconColor: '#6ee7b7',
    },
    {
        name: 'Oceano', nameKey: 'Oceano',
        gameBackgroundColor: '#0f172a',
        textColor: '#cbd5e1', titleColor: '#60a5fa', focusColor: '#93c5fd',
        splashButtonColor: '#3b82f6', splashButtonHoverColor: '#2563eb', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#60a5fa', actionButtonTextColor: '#0f172a',
        chanceIconColor: '#3b82f6',
    },
    {
        name: 'Vampiro', nameKey: 'Vampiro',
        gameBackgroundColor: '#450a0a',
        textColor: '#fecaca', titleColor: '#fca5a5', focusColor: '#f87171',
        splashButtonColor: '#dc2626', splashButtonHoverColor: '#b91c1c', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#ef4444', actionButtonTextColor: '#ffffff',
        chanceIconColor: '#fca5a5',
    },
    // NEW THEMES
    {
        name: 'Cyberpunk', nameKey: 'Cyberpunk',
        gameBackgroundColor: '#170a1c',
        textColor: '#e0e7ff', titleColor: '#f0abfc', focusColor: '#22d3ee',
        splashButtonColor: '#d946ef', splashButtonHoverColor: '#a21caf', splashButtonTextColor: '#000000',
        actionButtonColor: '#22d3ee', actionButtonTextColor: '#000000',
        chanceIconColor: '#f0abfc',
    },
    {
        name: 'Noir', nameKey: 'Noir',
        gameBackgroundColor: '#18181b',
        textColor: '#a1a1aa', titleColor: '#d4af37', focusColor: '#fbbf24',
        splashButtonColor: '#d4af37', splashButtonHoverColor: '#a16207', splashButtonTextColor: '#000000',
        actionButtonColor: '#fbbf24', actionButtonTextColor: '#18181b',
        chanceIconColor: '#d4af37',
    },
    {
        name: 'Fantasma', nameKey: 'Fantasma',
        gameBackgroundColor: '#1e1b4b',
        textColor: '#e4e4e7', titleColor: '#a78bfa', focusColor: '#c4b5fd',
        splashButtonColor: '#7c3aed', splashButtonHoverColor: '#6d28d9', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#a78bfa', actionButtonTextColor: '#1e1b4b',
        chanceIconColor: '#c4b5fd',
    },
    {
        name: 'Pergaminho', nameKey: 'Pergaminho',
        gameBackgroundColor: '#fef3c7',
        textColor: '#44403c', titleColor: '#78350f', focusColor: '#92400e',
        splashButtonColor: '#78350f', splashButtonHoverColor: '#5c4033', splashButtonTextColor: '#fef3c7',
        actionButtonColor: '#a16207', actionButtonTextColor: '#fef3c7',
        chanceIconColor: '#dc2626',
    },
    {
        name: 'Neon', nameKey: 'Neon',
        gameBackgroundColor: '#09090b',
        textColor: '#d4d4d8', titleColor: '#39ff14', focusColor: '#84cc16',
        splashButtonColor: '#39ff14', splashButtonHoverColor: '#22c55e', splashButtonTextColor: '#000000',
        actionButtonColor: '#84cc16', actionButtonTextColor: '#000000',
        chanceIconColor: '#39ff14',
    },
    {
        name: 'Lavanda', nameKey: 'Lavanda',
        gameBackgroundColor: '#f3e8ff',
        textColor: '#3f3f46', titleColor: '#7c3aed', focusColor: '#8b5cf6',
        splashButtonColor: '#8b5cf6', splashButtonHoverColor: '#7c3aed', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#a78bfa', actionButtonTextColor: '#1e1b4b',
        chanceIconColor: '#ec4899',
    },
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
