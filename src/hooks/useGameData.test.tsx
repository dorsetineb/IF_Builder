
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameData } from './useGameData';
import { initialGameData } from '../lib/gameDefaults';

// Mock dependências externas se necessário, mas useGameData é principalmente estado
// Mock toast
const mockToast = vi.fn();

describe('useGameData Hook', () => {
    it('should initialize with default game data', () => {
        const { result } = renderHook(() => useGameData());

        expect(result.current.gameData).toEqual(initialGameData);
        expect(result.current.isDirty).toBe(false);
    });

    it('should update game data and set dirty flag', () => {
        const { result } = renderHook(() => useGameData());

        act(() => {
            result.current.handleUpdateGameData({ gameTitle: 'New Title' });
        });

        expect(result.current.gameData.gameTitle).toBe('New Title');
        expect(result.current.isDirty).toBe(true);
    });

    it('should add global object', () => {
        const { result } = renderHook(() => useGameData());
        const newObj = { id: 'obj_1', name: 'Novo Objeto', description: '', initialDescription: '', examineDescription: '', location: 'held', isContainer: false, isLocked: false, isOpen: false };

        act(() => {
            result.current.handleCreateGlobalObject(newObj);
        });

        const objKeys = Object.keys(result.current.gameData.globalObjects);
        expect(objKeys.length).toBe(1);
        expect(result.current.gameData.globalObjects[objKeys[0]].name).toBe('Novo Objeto');
        expect(result.current.isDirty).toBe(true);
    });

    it('should add tracker', () => {
        const { result } = renderHook(() => useGameData());
        const newTracker = { id: 'trk_1', name: 'Tracker 1', type: 'boolean', value: false, visible: true };

        act(() => {
            // @ts-ignore
            result.current.handleCreateTracker(newTracker);
        });

        expect(Object.keys(result.current.gameData.consequenceTrackers || []).length).toBe(1);
    });
});
