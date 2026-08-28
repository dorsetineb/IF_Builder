
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
        const newState = updateFn({ ...initialGameData, scenes: {}, sceneOrder: [] });
        expect(Object.keys(newState.scenes).length).toBe(1);
        expect(newState.sceneOrder.length).toBe(1);

        expect(mockSetCurrentView).toHaveBeenCalledWith('three_panels');
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
            title: "sceneEditor.deleteTitle"
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

        expect(mockToast).toHaveBeenCalledWith(expect.stringContaining("inicial"), "error");
        expect(mockSetConfirmationModal).not.toHaveBeenCalled();
    });

    it('should add a new hypercard_stack scene with default card and startCardId', () => {
        const { result } = renderHook(() => useSceneManagement({
            ...defaultProps,
            gameData: {
                ...initialGameData,
                scenes: {
                    'scn_opening': {
                        id: 'scn_opening',
                        name: 'Abertura',
                        image: '',
                        description: 'Abertura',
                        vignetteType: 'opening',
                        objectIds: [],
                        interactions: []
                    }
                },
                sceneOrder: ['scn_opening'],
                startScene: 'scn_opening'
            }
        }));

        act(() => {
            result.current.handleAddScene('hypercard_stack');
        });

        expect(mockSetGameData).toHaveBeenCalled();
        const updateFn = mockSetGameData.mock.calls[0][0];

        const newState = updateFn({
            ...initialGameData,
            scenes: {
                'scn_opening': {
                    id: 'scn_opening',
                    name: 'Abertura',
                    image: '',
                    description: 'Abertura',
                    vignetteType: 'opening',
                    objectIds: [],
                    interactions: []
                }
            },
            sceneOrder: ['scn_opening']
        });

        const createdSceneId = newState.sceneOrder.find((id: string) => id !== 'scn_opening');
        expect(createdSceneId).toBeDefined();
        const createdScene = newState.scenes[createdSceneId];
        expect(createdScene.sceneType).toBe('hypercard_stack');
        expect(createdScene.stackCards).toBeDefined();
        expect(createdScene.stackCards?.length).toBe(1);
        expect(createdScene.startCardId).toBe(createdScene.stackCards?.[0].id);
        expect(createdScene.enableRevealZonesButton).toBe(true);
    });
});
