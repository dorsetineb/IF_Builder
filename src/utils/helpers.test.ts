
import { describe, it, expect } from 'vitest';
import { generateUniqueId, getFontUrl, getFrameClass, getMimeTypeFromFileName } from './helpers';

describe('Helpers', () => {
    describe('generateUniqueId', () => {
        it('should generate a unique id with correct prefix', () => {
            const id = generateUniqueId('scn', []);
            expect(id).toMatch(/^scn_/);
            expect(id.length).toBeGreaterThan(4);
        });

        it('should not generate duplicates', () => {
            const existing = ['scn_123', 'scn_456'];
            // Mock random to potentially collide? No, tricky.
            // Just check it doesn't return one of the existing.
            const id = generateUniqueId('scn', existing);
            expect(existing).not.toContain(id);
        });
    });

    describe('getFontUrl', () => {
        it('should return correct Google Fonts URL', () => {
            const url = getFontUrl('Roboto');
            expect(url).toBe('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        });

        it('should handle spaces in font name', () => {
            const url = getFontUrl('Open Sans');
            expect(url).toBe('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
        });

        it('should handle quoted font names', () => {
            const url = getFontUrl("'Press Start 2P', cursive");
            expect(url).toBe('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        });

        it('should return empty string for empty input', () => {
            expect(getFontUrl('')).toBe('');
        });
    });

    describe('getFrameClass', () => {
        it('should return correct class for known frames', () => {
            expect(getFrameClass('rounded-top')).toBe('frame-rounded-top');
            expect(getFrameClass('book-cover')).toBe('frame-book-cover');
            expect(getFrameClass('trading-card')).toBe('frame-trading-card');
        });

        it('should return default class for unknown or undefined', () => {
            expect(getFrameClass(undefined)).toBe('frame-none');
            // @ts-ignore
            expect(getFrameClass('unknown')).toBe('frame-none');
        });
    });

    describe('getMimeTypeFromFileName', () => {
        it('should identify images', () => {
            expect(getMimeTypeFromFileName('test.png')).toBe('image/png');
            expect(getMimeTypeFromFileName('photo.jpg')).toBe('image/jpeg');
            expect(getMimeTypeFromFileName('icon.svg')).toBe('image/svg+xml');
        });

        it('should identify audio', () => {
            expect(getMimeTypeFromFileName('song.mp3')).toBe('audio/mpeg');
            expect(getMimeTypeFromFileName('sound.wav')).toBe('audio/wav');
        });

        it('should fallback to octet-stream', () => {
            expect(getMimeTypeFromFileName('file.xyz')).toBe('application/octet-stream');
        });
    });
});
