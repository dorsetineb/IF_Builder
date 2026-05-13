/**
 * Utility to provide consistent dither colors across the application themes.
 * Centralizing this ensures that all components (Auth, Transition, Editor) 
 * stay in sync when new themes are added.
 */

export const getDitherColors = (theme: string, customSecondary?: string) => {
    switch (theme) {
        case 'terminal':
            return { primary: '#001D2D', secondary: '#7EE0A1' };
        case 'windows':
            return { primary: '#0f0f0f', secondary: '#008080' };
        case 'ether':
            return { primary: '#1f1f28', secondary: '#98bb6c' };
        case 'ristretto':
            return { primary: '#120d0a', secondary: '#fbbf24' };
        case 'abismo':
            return { primary: '#000000', secondary: '#ffffff' };
        case 'dark':
        default:
            return { 
                primary: '#000000', 
                secondary: customSecondary || '#9d4edd' 
            };
    }
};
