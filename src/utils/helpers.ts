
import { GameData } from "../types";

export const getFontUrl = (fontFamily: string) => {
    const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
    if (!fontName) return '';
    const googleFontName = fontName.replace(/ /g, '+');
    return `https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap`;
};

export const getFrameClass = (frame?: GameData['gameImageFrame']): string => {
    switch (frame) {
        case 'rounded-top': return 'frame-rounded-top';
        case 'book-cover': return 'frame-book-cover';
        case 'trading-card': return 'frame-trading-card';
        default: return 'frame-none';
    }
}

export const getMimeTypeFromFileName = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'svg': return 'image/svg+xml';
        case 'webp': return 'image/webp';
        case 'mp3':
        case 'mpeg': return 'audio/mpeg';
        case 'ogg': return 'audio/ogg';
        case 'wav': return 'audio/wav';
        case 'm4a':
        case 'mp4': return 'audio/mp4';
        default: return 'application/octet-stream';
    }
}

export const generateUniqueId = (prefix: 'scn' | 'obj' | 'inter' | 'trk' | 'verb' | 'crd' | 'hot', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
    } while (existingIds.includes(id));
    return id;
};
