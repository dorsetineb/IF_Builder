
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSceneManagement } from './useSceneManagement';
import { initialGameData } from '../lib/gameDefaults';

describe('useSceneManagement Hook', () => {
    const mockSetGameData = vi.fn();
    const mockSetIsDirty = vi.fn();
    const mockToast = vi.fn();
    const mockSetCurrentView = vi.fn();
    const mockSetSelectedSceneId = vi.fn();
    const mockCloseConfirmationModal = vi.fn();
    const mockSetConfirmationModal = vi.fn();

    const defaultProps = {
        gameData: initialGameData,
        setGameData: mockSetGameData,
        setIsDirty: mockSetIsDirty,
        toast: mockToast,
        setCurrentView: mockSetCurrentView,
        setSelectedSceneId: mockSetSelectedSceneId,
        selectedSceneId: null,
        closeConfirmationModal: mockCloseConfirmationModal,
        setConfirmationModal: mockSetConfirmationModal
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should add a new scene', () => {
        const { result } = renderHook(() => useSceneManagement(defaultProps));

        act(() => {
            result.current.handleAddScene();
        });

        // We check if setGameData was called with a function (updater)
        expect(mockSetGameData).toHaveBeenCalled();
        const updateFn = mockSetGameData.mock.calls[0][0];

        // Simulate state update
        const newState = updateFn(initialGameData);
        expect(Object.keys(newState.scenes).length).toBe(1);
        expect(newState.sceneOrder.length).toBe(1);

        expect(mockSetCurrentView).toHaveBeenCalledWith('scenes');
        expect(mockSetSelectedSceneId).toHaveBeenCalled();
        expect(mockSetIsDirty).toHaveBeenCalledWith(true);
    });

    it('should update a scene', () => {
        const { result } = renderHook(() => useSceneManagement(defaultProps));
        const scene = { id: 'scn_1', name: 'Original', image: '', description: 'Desc', interactions: [], objectIds: [], mapX: 0, mapY: 0 };

        act(() => {
            result.current.handleUpdateScene({ ...scene, name: 'Updated' });
        });

        expect(mockSetGameData).toHaveBeenCalled();
        expect(mockSetIsDirty).toHaveBeenCalledWith(true);
    });

    it('should show confirmation when deleting a scene', () => {
        const { result } = renderHook(() => useSceneManagement({
            ...defaultProps,
            gameData: {
                ...initialGameData,
                scenes: {
                    'scn_1': { id: 'scn_1', name: 'Start', mapX: 0, mapY: 0, image: '', description: '', objectIds: [], interactions: [] },
                    'scn_2': { id: 'scn_2', name: 'Other', mapX: 0, mapY: 0, image: '', description: '', objectIds: [], interactions: [] }
                },
                sceneOrder: ['scn_1', 'scn_2'],
                startScene: 'scn_1'
            }
        }));

        act(() => {
            result.current.handleDeleteScene('scn_2');
        });

        expect(mockSetConfirmationModal).toHaveBeenCalledWith(expect.objectContaining({
            isOpen: true,
            title: "Deletar Cena"
        }));
    });

    it('should prevent deleting start scene if it is the only one (or similar logic)', () => {
        // Logic says: if id === startScene AND scenes > 1 -> Toast error
        const { result } = renderHook(() => useSceneManagement({
            ...defaultProps,
            gameData: {
                ...initialGameData,
                scenes: {
                    'scn_1': { id: 'scn_1', name: 'Start', mapX: 0, mapY: 0, image: '', description: '', objectIds: [], interactions: [] },
                    'scn_2': { id: 'scn_2', name: 'Other', mapX: 0, mapY: 0, image: '', description: '', objectIds: [], interactions: [] }
                },
                sceneOrder: ['scn_1', 'scn_2'],
                startScene: 'scn_1'
            }
        }));

        act(() => {
            result.current.handleDeleteScene('scn_1');
        });

        expect(mockToast).toHaveBeenCalledWith("Ação não permitida", expect.stringContaining("cena inicial"), "error");
        expect(mockSetConfirmationModal).not.toHaveBeenCalled();
    });
});
