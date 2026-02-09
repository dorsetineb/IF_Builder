
import React, { useCallback } from 'react';
import { GameData, Scene, Vignette, View } from '../types';
import { generateUniqueId } from '../utils/helpers';

interface UseSceneManagementProps {
    gameData: GameData;
    setGameData: React.Dispatch<React.SetStateAction<GameData>>;
    setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
    toast: (title: string, description: string, variant?: "default" | "destructive" | "success" | "error") => void;
    setCurrentView: (view: View) => void;
    setSelectedSceneId: (id: string | null) => void;
    selectedSceneId: string | null;
    closeConfirmationModal: () => void;
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

    const handleAddScene = useCallback(() => {
        const newId = generateUniqueId('scn', Object.keys(gameData.scenes));

        // Calculate position to the right of existing scenes
        const NODE_WIDTH = 250;
        const X_GAP = 150;
        const existingSceneCount = gameData.sceneOrder.length;
        const initialMapX = existingSceneCount * (NODE_WIDTH + X_GAP);

        const newScene: Scene = {
            id: newId,
            name: 'Nova Cena',
            image: '',
            description: 'Descrição da nova cena.',
            objectIds: [],
            interactions: [],
            vignetteType: existingSceneCount === 0 ? 'opening' : 'none',
            mapX: initialMapX,
            mapY: 0
        };

        setGameData(prev => {
            const newScenes = { ...prev.scenes, [newId]: newScene };
            const updatedOrder = [...prev.sceneOrder, newId];
            const isFirst = updatedOrder.length === 1;

            // Auto-link: If there's an opening vignette without vignetteNextSceneId, link it to this new scene
            if (existingSceneCount === 1) {
                const firstSceneId = prev.sceneOrder[0];
                const firstScene = prev.scenes[firstSceneId];
                if (firstScene && firstScene.vignetteType === 'opening' && !firstScene.vignetteNextSceneId) {
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
                startScene: isFirst ? newId : prev.startScene
            };
        });
        setCurrentView('scenes');
        setSelectedSceneId(newId);
        setIsDirty(true);
    }, [gameData.scenes, gameData.sceneOrder, setGameData, setCurrentView, setSelectedSceneId, setIsDirty]);

    const handleDeleteScene = useCallback((id: string) => {
        if (id === gameData.startScene && Object.keys(gameData.scenes).length > 1) {
            toast("Ação não permitida", "Você não pode deletar a cena inicial. Defina outra cena como inicial antes de excluir esta.", "error");
            return;
        }

        const proceedWithDelete = () => {
            setGameData(prev => {
                const newScenes = { ...prev.scenes };
                delete newScenes[id];
                const updatedOrder = prev.sceneOrder.filter(sid => sid !== id);
                let newStart = prev.startScene;
                if (newStart === id) {
                    newStart = updatedOrder.length > 0 ? updatedOrder[0] : '';
                }

                Object.values(newScenes).forEach((scene: Scene) => {
                    if (scene.interactions) {
                        scene.interactions = scene.interactions.filter(i => i.goToScene !== id);
                    }
                    if (scene.exits) {
                        const exits = scene.exits as any;
                        Object.keys(exits).forEach(key => {
                            if (exits[key] === id) delete exits[key];
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

            if (id === selectedSceneId) {
                const newSceneId = gameData.sceneOrder.find(sid => sid !== id) || '';
                setSelectedSceneId(newSceneId);
            }
            setIsDirty(true);
            toast("Cena deletada", "A cena foi removida com sucesso.", "success");
            closeConfirmationModal();
        };

        setConfirmationModal({
            isOpen: true,
            title: "Deletar Cena",
            message: "Tem certeza que deseja deletar esta cena? Esta ação não pode ser desfeita e removerá todas as referências a ela.",
            isDanger: true,
            onConfirm: proceedWithDelete,
            onCancel: closeConfirmationModal
        });
    }, [gameData.startScene, gameData.scenes, gameData.sceneOrder, selectedSceneId, toast, closeConfirmationModal, setConfirmationModal, setGameData, setIsDirty, setSelectedSceneId]);

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
        setCurrentView('scenes');
        setSelectedSceneId(newId);
        setIsDirty(true);
    }, [gameData.scenes, gameData.sceneOrder, setGameData, setCurrentView, setSelectedSceneId, setIsDirty]);

    const handleAddVignette = useCallback(() => {
        const newId = `VNT_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const newVignette: Vignette = {
            id: newId,
            name: 'Nova Vinheta',
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
        toast("Vinheta Criada", "Nova vinheta criada com sucesso.", "success");
    }, [setGameData, setIsDirty, toast]);

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
