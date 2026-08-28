
import React, { useCallback } from 'react';
import { GameData, Scene, Vignette, View } from '../types';
import { generateUniqueId } from '../utils/helpers';
import { useTranslation } from 'react-i18next';

interface UseSceneManagementProps {
    gameData: GameData;
    setGameData: React.Dispatch<React.SetStateAction<GameData>>;
    setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
    toast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
    setCurrentView: (view: View) => void;
    setSelectedSceneId: (id: string | null) => void;
    selectedSceneId: string | null;
    closeConfirmationModal: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setConfirmationModal: (modal: any) => void;
}

export const useSceneManagement = ({
    gameData,
    setGameData,
    setIsDirty,
    toast,
    setCurrentView,
    setSelectedSceneId,
    selectedSceneId,
    closeConfirmationModal,
    setConfirmationModal
}: UseSceneManagementProps) => {
    const { t } = useTranslation();

    const handleAddScene = useCallback((type: 'scene' | 'vignette' | 'hypercard_stack' = 'scene') => {
        const newId = generateUniqueId('scn', Object.keys(gameData.scenes));

        // Calculate position to the right of existing scenes
        const NODE_WIDTH = 250;
        const X_GAP = 150;
        const existingSceneCount = gameData.sceneOrder.length;
        const initialMapX = existingSceneCount * (NODE_WIDTH + X_GAP);

        const sceneValues = Object.values(gameData.scenes);
        const hasOpeningVignette = sceneValues.some(s => s.vignetteType === 'opening');
        const isVignette = type === 'vignette' || !hasOpeningVignette;
        const isStack = type === 'hypercard_stack' && hasOpeningVignette;

        const vignetteCount = sceneValues.filter(s => s.vignetteType && s.vignetteType !== 'none').length + 1;
        const sceneCount = sceneValues.filter(s => (!s.vignetteType || s.vignetteType === 'none') && s.sceneType !== 'hypercard_stack').length + 1;
        const stackCount = sceneValues.filter(s => s.sceneType === 'hypercard_stack').length + 1;

        let defaultName = '';
        if (isVignette) {
            if (!hasOpeningVignette) {
                defaultName = t('editor.newOpeningVignetteName', 'Abertura');
            } else {
                defaultName = `${t('editor.newVignetteNamePrefix', 'Cena #')}${vignetteCount}`;
            }
        } else if (isStack) {
            defaultName = `${t('editor.newStackNamePrefix', 'Cenário #')}${stackCount}`;
        } else {
            defaultName = `${t('editor.newSceneNamePrefix', 'Ramificação #')}${sceneCount}`;
        }

        const firstCardId = generateUniqueId('crd', []);
        const initialCard = isStack ? {
            id: firstCardId,
            name: t('hypercard.defaultCardName', 'Vista 1'),
            image: '',
            description: '',
            hotspots: [],
            transition: 'dissolve' as const,
            transitionSpeed: 300
        } : undefined;

        const newScene: Scene = {
            id: newId,
            name: defaultName,
            image: '',
            description: isStack
                ? t('editor.newStackDescription', 'Pilha de cartões interativos com hotspots.')
                : (isVignette ? t('editor.newVignetteDescription', 'Descrição da nova cena.') : t('editor.newSceneDescription', 'Descrição da nova ramificação.')),
            objectIds: [],
            interactions: [],
            vignetteType: !hasOpeningVignette ? 'opening' : (type === 'vignette' ? 'transition' : 'none'),
            sceneType: isStack ? 'hypercard_stack' : (isVignette ? 'vignette' : 'branch'),
            stackCards: initialCard ? [initialCard] : undefined,
            startCardId: initialCard ? firstCardId : undefined,
            enableRevealZonesButton: isStack ? true : undefined,
            mapX: initialMapX,
            mapY: 0
        };

        setGameData(prev => {
            const newScenes = { ...prev.scenes, [newId]: newScene };
            const updatedOrder = [...prev.sceneOrder, newId];

            // Auto-link: If there's an opening vignette without vignetteNextSceneId, link it to this new scene
            if (existingSceneCount === 1) {
                const firstSceneId = prev.sceneOrder[0];
                const firstScene = prev.scenes[firstSceneId];
                // Auto-link if no link exists OR if the current link sequence points to a non-existent scene
                const currentNextId = firstScene?.vignetteNextSceneId;
                const isLinkMissingOrInvalid = !currentNextId || !prev.scenes[currentNextId];

                if (firstScene && firstScene.vignetteType === 'opening' && isLinkMissingOrInvalid) {
                    newScenes[firstSceneId] = {
                        ...firstScene,
                        vignetteNextSceneId: newId
                    };
                }
            }

            return {
                ...prev,
                scenes: newScenes,
                sceneOrder: updatedOrder,
                startScene: !hasOpeningVignette ? newId : prev.startScene
            };
        });
        setCurrentView('three_panels');
        setSelectedSceneId(newId);
        setIsDirty(true);
    }, [gameData.scenes, gameData.sceneOrder, setGameData, setCurrentView, setSelectedSceneId, setIsDirty, t]);

    const handleDeleteScene = useCallback((sceneId: string) => {
        if (sceneId === gameData.startScene && Object.keys(gameData.scenes).length > 1) {
            toast(
                t('editor.deleteStartSceneError', 'Você não pode deletar a ramificação inicial. Defina outra ramificação como inicial antes de excluir esta.'),
                "error"
            );
            return;
        }

        const executeDelete = () => {
            setGameData(prev => {
                const newScenes = { ...prev.scenes };
                delete newScenes[sceneId];
                const updatedOrder = prev.sceneOrder.filter(sid => sid !== sceneId);
                let newStart = prev.startScene;
                if (newStart === sceneId) {
                    newStart = updatedOrder.length > 0 ? updatedOrder[0] : '';
                }

                Object.values(newScenes).forEach((scene: Scene) => {
                    if (scene.interactions) {
                        scene.interactions = scene.interactions.filter(i => i.goToScene !== sceneId);
                    }
                    if (scene.exits) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const exits = scene.exits as any;
                        Object.keys(exits).forEach(key => {
                            if (exits[key] === sceneId) delete exits[key];
                        });
                    }
                    // Clean up dangling vignette links
                    if (scene.vignetteNextSceneId === sceneId) {
                        scene.vignetteNextSceneId = '';
                    }
                    // Clean up dangling stack hotspot links
                    if (scene.stackCards) {
                        scene.stackCards.forEach(card => {
                            if (card.hotspots) {
                                card.hotspots.forEach(h => {
                                    if (h.targetSceneId === sceneId) {
                                        h.targetSceneId = '';
                                    }
                                });
                            }
                        });
                    }
                });

                return {
                    ...prev,
                    scenes: newScenes,
                    sceneOrder: updatedOrder,
                    startScene: newStart
                };
            });

            if (sceneId === selectedSceneId) {
                const newSceneId = gameData.sceneOrder.find(sid => sid !== sceneId) || '';
                setSelectedSceneId(newSceneId);
            }
            setIsDirty(true);
            const scene = gameData.scenes[sceneId];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const type = (scene as any).vignetteType && (scene as any).vignetteType !== 'none' ? 'vignette' : 'scene';
            toast(
                t(`editor.${type}DeletedDesc`, type === 'vignette' ? 'O capítulo foi removido com sucesso.' : 'A ramificação foi removida com sucesso.'),
                "success"
            );
            closeConfirmationModal();
        };

        const scene = gameData.scenes[sceneId];
        if (!scene) return;
        const type = scene.vignetteType && scene.vignetteType !== 'none' ? 'vignette' : 'scene';

        setConfirmationModal({
            isOpen: true,
            title: type === 'vignette' ? t('sceneEditor.deleteTitleVignette') : t('sceneEditor.deleteTitle'),
            message: type === 'vignette' ? t('sceneEditor.deleteConfirmVignette') : t('sceneEditor.deleteConfirm'),
            confirmText: t('common.delete', 'Excluir'),
            cancelText: t('common.cancel', 'Cancelar'),
            isDanger: true,
            onConfirm: () => executeDelete(),
            onCancel: closeConfirmationModal,
        });
    }, [gameData.startScene, gameData.scenes, gameData.sceneOrder, selectedSceneId, toast, closeConfirmationModal, setConfirmationModal, setGameData, setIsDirty, setSelectedSceneId, t]);

    const handleUpdateScene = useCallback((updatedScene: Scene) => {
        setGameData(prev => ({
            ...prev,
            scenes: { ...prev.scenes, [updatedScene.id]: updatedScene }
        }));
        setIsDirty(true);
    }, [setGameData, setIsDirty]);

    const handleCopyScene = useCallback((sceneToCopy: Scene) => {
        const newId = generateUniqueId('scn', Object.keys(gameData.scenes));
        const newScene: Scene = {
            ...JSON.parse(JSON.stringify(sceneToCopy)),
            id: newId,
            name: `${sceneToCopy.name} (Cópia)`,
            // Clear narrative connections
            vignetteNextSceneId: undefined,
            exits: undefined,
            choices: [],
            interactions: (sceneToCopy.interactions || []).map(inter => ({
                ...inter,
                goToScene: undefined,
                vignetteId: undefined
            })),
            // Map offset to avoid overlap
            mapX: (sceneToCopy.mapX || 0) + 40,
            mapY: (sceneToCopy.mapY || 0) + 40,
        };

        setGameData(prev => {
            const newScenes = { ...prev.scenes, [newId]: newScene };
            const orderWithNew = [...prev.sceneOrder, newId];
            return {
                ...prev,
                scenes: newScenes,
                sceneOrder: orderWithNew
            };
        });
        setCurrentView('three_panels');
        setSelectedSceneId(newId);
        setIsDirty(true);
    }, [gameData.scenes, gameData.sceneOrder, setGameData, setCurrentView, setSelectedSceneId, setIsDirty]);

    const handleAddVignette = useCallback(() => {
        const newId = `VNT_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const newVignette: Vignette = {
            id: newId,
            name: 'Nova Cena',
            title: '',
            description: '',
            contentAlignment: 'left',
            verticalAlignment: 'bottom'
        };
        setGameData(prev => ({
            ...prev,
            vignettes: [...(prev.vignettes || []), newVignette]
        }));
        setIsDirty(true);
        toast(
            t('editor.vignetteCreatedDesc', 'Novo capítulo criado com sucesso.'),
            "success"
        );
    }, [setGameData, setIsDirty, toast, t]);

    const handleReorderScenes = useCallback((newSceneIds: string[]) => {
        setGameData(prev => ({ ...prev, sceneOrder: newSceneIds }));
        setIsDirty(true);
    }, [setGameData, setIsDirty]);

    return {
        handleAddScene,
        handleDeleteScene,
        handleUpdateScene,
        handleCopyScene,
        handleAddVignette,
        handleReorderScenes
    };
};
