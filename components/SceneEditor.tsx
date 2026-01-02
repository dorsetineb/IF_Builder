
import React, { useState, useEffect, DragEvent, useRef, useMemo } from 'react';
import { Scene, Interaction, GameObject, ConsequenceTracker } from '../types';
import ObjectEditor from './ObjectEditor';
import InteractionEditor from './InteractionEditor';
import ConnectionsView from './ConnectionsView';
<<<<<<< HEAD
import { Upload, Eye, Trash2 } from 'lucide-react';

interface SceneEditorProps {
    scene: Scene;
    allScenes: Scene[];
    globalObjects: { [id: string]: GameObject };
    onUpdateScene: (scene: Scene) => void;
    onCopyScene: (scene: Scene) => void;
    onCreateGlobalObject: (obj: GameObject, linkToSceneId: string) => void;
    onLinkObjectToScene: (sceneId: string, objectId: string) => void;
    onUnlinkObjectFromScene: (sceneId: string, objectId: string) => void;
    onUpdateGlobalObject: (objectId: string, updatedData: Partial<GameObject>) => void;
    onPreviewScene: (scene: Scene) => void;
    onSelectScene: (id: string) => void;
    isDirty: boolean;
    onSetDirty: (isDirty: boolean) => void;
    layoutOrientation: 'vertical' | 'horizontal';
    consequenceTrackers: ConsequenceTracker[];
    isStartScene: boolean;
}

const getCleanSceneState = (s: Scene): Scene => {
    return {
        ...s,
        isEndingScene: !!s.isEndingScene,
        removesChanceOnEntry: !!s.removesChanceOnEntry,
        restoresChanceOnEntry: !!s.restoresChanceOnEntry,
        objectIds: s.objectIds || [],
        interactions: s.interactions || [],
    };
};

export interface ConnectionDetail {
    scene: Scene;
    interactions: Interaction[];
}

const SceneEditor: React.FC<SceneEditorProps> = ({
    scene,
    allScenes,
    globalObjects,
    onUpdateScene,
=======
import { UploadIcon } from './icons/UploadIcon';
import { EyeIcon } from './icons/EyeIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SceneEditorProps {
  scene: Scene;
  allScenes: Scene[];
  globalObjects: { [id: string]: GameObject };
  onUpdateScene: (scene: Scene) => void;
  onCopyScene: (scene: Scene) => void;
  onCreateGlobalObject: (obj: GameObject, linkToSceneId: string) => void;
  onLinkObjectToScene: (sceneId: string, objectId: string) => void;
  onUnlinkObjectFromScene: (sceneId: string, objectId: string) => void;
  onUpdateGlobalObject: (objectId: string, updatedData: Partial<GameObject>) => void;
  onPreviewScene: (scene: Scene) => void;
  onSelectScene: (id: string) => void;
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
  layoutOrientation: 'vertical' | 'horizontal';
  consequenceTrackers: ConsequenceTracker[];
  isStartScene: boolean;
}

const getCleanSceneState = (s: Scene): Scene => {
  return {
    ...s,
    isEndingScene: !!s.isEndingScene,
    removesChanceOnEntry: !!s.removesChanceOnEntry,
    restoresChanceOnEntry: !!s.restoresChanceOnEntry,
    objectIds: s.objectIds || [],
    interactions: s.interactions || [],
  };
};

export interface ConnectionDetail {
  scene: Scene;
  interactions: Interaction[];
}

const SceneEditor: React.FC<SceneEditorProps> = ({ 
    scene, 
    allScenes, 
    globalObjects,
    onUpdateScene, 
>>>>>>> 3773e8d5433b183fb55694c9010f416f8ebcafd7
    onCopyScene,
    onCreateGlobalObject,
    onLinkObjectToScene,
    onUnlinkObjectFromScene,
    onUpdateGlobalObject,
    onPreviewScene,
    onSelectScene,
    isDirty,
    onSetDirty,
    layoutOrientation,
    consequenceTrackers,
    isStartScene
}) => {
<<<<<<< HEAD
    const [localScene, setLocalScene] = useState<Scene>(() => getCleanSceneState(scene));
    const [pendingObjectUpdates, setPendingObjectUpdates] = useState<{ [id: string]: Partial<GameObject> }>({});
    const [activeTab, setActiveTab] = useState<'properties' | 'objects' | 'interactions' | 'connections'>('properties');
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const initialSceneJson = useRef(JSON.stringify(getCleanSceneState(scene)));

    // Reset local state when scene ID changes (switching scenes)
    useEffect(() => {
        const cleanScene = getCleanSceneState(scene);
        setLocalScene(cleanScene);
        setPendingObjectUpdates({});
        initialSceneJson.current = JSON.stringify(cleanScene);
        setActiveTab('properties');
    }, [scene.id]);

    // Check for dirty state
    useEffect(() => {
        const isSceneDirty = JSON.stringify(localScene) !== initialSceneJson.current;
        const areObjectsDirty = Object.keys(pendingObjectUpdates).length > 0;
        onSetDirty(isSceneDirty || areObjectsDirty);
    }, [localScene, pendingObjectUpdates, onSetDirty]);

    // Sync initial state when scene prop updates content (e.g. after a save)
    useEffect(() => {
        const cleanSceneProp = getCleanSceneState(scene);
        // If the prop matches our current local state and no pending object updates, we are in sync
        if (JSON.stringify(cleanSceneProp) === JSON.stringify(localScene) && Object.keys(pendingObjectUpdates).length === 0) {
            initialSceneJson.current = JSON.stringify(cleanSceneProp);
            if (isDirty) {
                onSetDirty(false);
            }
        }
    }, [scene, localScene, pendingObjectUpdates, isDirty, onSetDirty]);

    // Merge global objects with pending updates
    const mergedGlobalObjects = useMemo(() => {
        const merged = { ...globalObjects };
        Object.keys(pendingObjectUpdates).forEach(id => {
            if (merged[id]) {
                merged[id] = { ...merged[id], ...pendingObjectUpdates[id] };
            }
        });
        return merged;
    }, [globalObjects, pendingObjectUpdates]);

    // Construct the list of objects currently in this scene by ID lookup
    const currentSceneObjects = useMemo(() => {
        return (localScene.objectIds || []).map(id => mergedGlobalObjects[id]).filter(Boolean);
    }, [localScene.objectIds, mergedGlobalObjects]);

    // MODIFICADO: Agora todos os objetos globais podem ser usados como requerimento de inventário
    const allAvailableInventoryObjects = useMemo(() => {
        return Object.values(mergedGlobalObjects);
    }, [mergedGlobalObjects]);

    const allObjectsMap = useMemo(() => {
        return new Map(Object.entries(mergedGlobalObjects));
    }, [mergedGlobalObjects]);

    const connections = useMemo(() => {
        const sceneMap = new Map(allScenes.map(s => [s.id, s]));

        const inputConnectionsMap = new Map<string, Interaction[]>();
        for (const otherScene of allScenes) {
            if (otherScene.id === localScene.id) continue;
            for (const interaction of otherScene.interactions) {
                if (interaction.goToScene === localScene.id) {
                    if (!inputConnectionsMap.has(otherScene.id)) {
                        inputConnectionsMap.set(otherScene.id, []);
                    }
                    inputConnectionsMap.get(otherScene.id)!.push(interaction);
                }
            }
        }

        const outputConnectionsMap = new Map<string, Interaction[]>();
        for (const interaction of localScene.interactions) {
            if (interaction.goToScene && sceneMap.has(interaction.goToScene)) {
                if (!outputConnectionsMap.has(interaction.goToScene)) {
                    outputConnectionsMap.set(interaction.goToScene, []);
                }
                outputConnectionsMap.get(interaction.goToScene)!.push(interaction);
            }
        }

        const inputConnections: ConnectionDetail[] = Array.from(inputConnectionsMap.entries()).map(([sceneId, interactions]) => {
            const scene = sceneMap.get(sceneId);
            if (scene) {
                return { scene, interactions };
            }
            return null;
        }).filter((connection): connection is ConnectionDetail => connection !== null);


        const outputConnections: ConnectionDetail[] = Array.from(outputConnectionsMap.entries()).map(([sceneId, interactions]) => {
            const scene = sceneMap.get(sceneId);
            if (scene) {
                return { scene, interactions };
            }
            return null;
        }).filter((connection): connection is ConnectionDetail => connection !== null);


        return { inputConnections, outputConnections };
    }, [allScenes, localScene.id, localScene.interactions]);


    const updateLocalScene = <K extends keyof Scene,>(key: K, value: Scene[K]) => {
        setLocalScene(prev => ({ ...prev, [key]: value }));
    };

    const handleUpdateGlobalObjectLocal = (objectId: string, updatedData: Partial<GameObject>) => {
        setPendingObjectUpdates(prev => ({
            ...prev,
            [objectId]: { ...(prev[objectId] || {}), ...updatedData }
        }));
    };

    const handleCreateGlobalObjectWrapper = (obj: GameObject, linkToSceneId: string) => {
        onCreateGlobalObject(obj, '');
        setLocalScene(prev => ({
            ...prev,
            objectIds: [...(prev.objectIds || []), obj.id]
        }));
    };

    const handleLinkObjectWrapper = (sceneId: string, objectId: string) => {
        setLocalScene(prev => {
            if (prev.objectIds.includes(objectId)) return prev;
            return {
                ...prev,
                objectIds: [...prev.objectIds, objectId]
            };
        });
    };

    const handleUnlinkObjectWrapper = (sceneId: string, objectId: string) => {
        setLocalScene(prev => ({
            ...prev,
            objectIds: prev.objectIds.filter(id => id !== objectId)
        }));
    };

    const handleToggle = (key: 'isEndingScene' | 'removesChanceOnEntry' | 'restoresChanceOnEntry', value: boolean) => {
        setLocalScene(prev => {
            const newSceneState = { ...prev };
            if (value) {
                newSceneState.isEndingScene = false;
                newSceneState.removesChanceOnEntry = false;
                newSceneState.restoresChanceOnEntry = false;
            }
            newSceneState[key] = value;
            if (key === 'isEndingScene' && value) {
                newSceneState.objectIds = [];
                newSceneState.interactions = [];
            }
            return newSceneState;
        });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateLocalScene('name', e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateLocalScene('description', e.target.value);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    updateLocalScene('image', event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        if (e.target) {
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    updateLocalScene('backgroundMusic', event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        if (e.target) {
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const event = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleImageUpload(event);
        }
    };

    const handleSave = () => {
        Object.keys(pendingObjectUpdates).forEach(id => {
            onUpdateGlobalObject(id, pendingObjectUpdates[id]);
        });
        setPendingObjectUpdates({});

        const finalScene: Scene = { ...localScene };
        finalScene.interactions = finalScene.interactions.map(interaction => ({
            ...interaction,
            verbs: interaction.verbs.map(v => v.trim().toLowerCase()).filter(Boolean)
        }));

        if (finalScene.isEndingScene) {
            finalScene.objectIds = [];
            finalScene.interactions = [];
        }
        onUpdateScene(finalScene);
    }

    const handleUndo = () => {
        const restoredScene = JSON.parse(initialSceneJson.current) as Scene;
        setLocalScene(restoredScene);
        setPendingObjectUpdates({});
    };

    const handlePreview = () => {
        onPreviewScene(localScene);
    };

    const TABS = {
        properties: 'Propriedades',
        objects: 'Objetos',
        interactions: 'Interações',
        connections: 'Conexões',
    };

    const isAnyCheckboxChecked = !!localScene.isEndingScene || !!localScene.removesChanceOnEntry || !!localScene.restoresChanceOnEntry;

    return (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-brand-text-dim mt-1 text-sm">
                        Defina a imagem, descrição, objetos e interações para esta cena.
                    </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 mt-1">
                    {isDirty && (
                        <div className="flex items-center gap-2 text-yellow-400 text-xs font-medium animate-pulse">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span>Alterações não salvas</span>
                        </div>
                    )}
                    <button
                        onClick={() => onCopyScene(localScene)}
                        className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors"
                        title="Copiar Cena"
                    >
                        Copiar Cena
                    </button>
                </div>
            </div>

            <div>
                <div className="border-b border-brand-border flex justify-between items-end">
                    <div className="flex space-x-1">
                        {Object.entries(TABS).map(([key, name]) => {
                            const isTabDisabled = localScene.isEndingScene && (key === 'objects' || key === 'interactions');
                            return (
                                <button
                                    key={key}
                                    onClick={() => !isTabDisabled && setActiveTab(key as any)}
                                    disabled={isTabDisabled}
                                    className={`px-4 py-2 font-semibold text-sm rounded-t-md transition-colors ${activeTab === key
                                        ? 'bg-brand-surface text-brand-primary'
                                        : 'text-brand-text-dim hover:text-brand-text'
                                        } ${isTabDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                    {activeTab === 'objects' && (
                        <span className="text-xs text-yellow-400 mb-2 italic">
                            Alterações feitas aqui afetam o objeto em todo o jogo.
                        </span>
                    )}
                </div>

                <div className="bg-brand-surface -mt-px p-6">
                    {activeTab === 'properties' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div className="space-y-4 flex flex-col order-2 md:order-1">
                                {/* Name and ID Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="sceneName" className="block text-sm font-medium text-brand-text-dim mb-1">Nome da Cena</label>
                                        <input type="text" id="sceneName" value={localScene.name} onChange={handleNameChange} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="sceneId" className="block text-sm font-medium text-brand-text-dim mb-1">ID da Cena</label>
                                        <p
                                            id="sceneId"
                                            className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-dim font-mono select-all"
                                            title="O ID da cena é único e não pode ser alterado."
                                        >
                                            {localScene.id}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 min-h-0 pt-2">
                                    <label htmlFor="sceneDescription" className="block text-sm font-medium text-brand-text-dim mb-1">
                                        {localScene.isEndingScene ? 'Mensagem de Fim de Jogo' : 'Descrição'}
                                    </label>
                                    <p className="text-xs text-brand-text-dim -mt-1 mb-2">Use <code>&lt;palavra&gt;</code> para destacar texto clicável.</p>
                                    <div className="relative flex-1">
                                        <textarea id="sceneDescription" value={localScene.description} onChange={handleDescriptionChange} className="w-full h-full min-h-[200px] bg-brand-bg border border-brand-border rounded-md px-3 py-2 resize-y focus:ring-0 text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4 order-1 md:order-2">
                                <div className="flex flex-col flex-grow min-h-[300px]">
                                    <label className="block text-sm font-medium text-brand-text-dim mb-1">Imagem da Cena</label>
                                    <div className="relative flex-grow w-full">
                                        {localScene.image ? (
                                            <div className="absolute inset-0 w-full h-full border border-brand-border rounded-md overflow-hidden bg-brand-bg group">
                                                <img src={localScene.image} alt={localScene.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                                    <label htmlFor="image-upload-input" className="p-2 bg-brand-primary text-brand-bg rounded-md cursor-pointer hover:bg-brand-primary-hover flex items-center gap-2 font-semibold text-sm">
                                                        <Upload className="w-5 h-5" />
                                                        <span className="hidden sm:inline">Alterar</span>
                                                        <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                    </label>
                                                    <button
                                                        onClick={() => updateLocalScene('image', '')}
                                                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                        title="Remover Imagem"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="image-upload-input"
                                                className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full border-2 border-dashed bg-brand-bg/50 rounded-md cursor-pointer hover:bg-brand-border/30 transition-colors ${isDraggingOver ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-border'}`}
                                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                                                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(false); }}
                                                onDrop={handleDrop}
                                            >
                                                <Upload className="w-8 h-8 text-brand-text-dim mb-2" />
                                                <span className="text-sm font-semibold text-brand-text">Clique para Enviar</span>
                                                <span className="text-xs text-brand-text-dim mt-1">ou arraste e solte</span>
                                                <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                    {/* MODIFICADO: Recomendação contextual incluindo tamanho em pixels */}
                                    <p className="text-xs text-brand-text-dim text-center mt-3">
                                        {layoutOrientation === 'vertical'
                                            ? "Recomendado imagens em pé (ex: 9:16). Sugestão: 720x1280 pixels."
                                            : "Recomendado imagens deitadas (ex: 16:9). Sugestão: 1280x720 pixels."}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-brand-border/30">
                                    <label className="block text-sm font-medium text-brand-text-dim mb-2">Trilha sonora da cena</label>
                                    <div className="flex items-center gap-2">
                                        <label className="flex-grow flex items-center justify-center px-3 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors cursor-pointer text-xs">
                                            <Upload className="w-4 h-4 mr-2" /> {localScene.backgroundMusic ? 'Alterar Trilha' : 'Carregar Trilha (.mp3)'}
                                            <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={handleMusicUpload} className="hidden" />
                                        </label>
                                        {localScene.backgroundMusic && (
                                            <button
                                                onClick={() => updateLocalScene('backgroundMusic', undefined)}
                                                className="p-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors"
                                                title="Remover Troca de Música"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-brand-text-dim mt-1 italic">Deixe vazio para continuar tocando a música da cena anterior.</p>
                                </div>

                                {!isStartScene && (
                                    <div className="space-y-4 pt-4 border-t border-brand-border/30">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="isEndingScene"
                                                checked={!!localScene.isEndingScene}
                                                onChange={e => handleToggle('isEndingScene', e.target.checked)}
                                                className="custom-checkbox"
                                                disabled={isAnyCheckboxChecked && !localScene.isEndingScene}
                                            />
                                            <label htmlFor="isEndingScene" className={`ml-2 block text-sm text-brand-text-dim ${isAnyCheckboxChecked && !localScene.isEndingScene ? 'opacity-50' : ''}`}>
                                                Esta cena vence o jogo.
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="removesChance"
                                                checked={!!localScene.removesChanceOnEntry}
                                                onChange={e => handleToggle('removesChanceOnEntry', e.target.checked)}
                                                className="custom-checkbox"
                                                disabled={isAnyCheckboxChecked && !localScene.removesChanceOnEntry}
                                            />
                                            <label htmlFor="removesChance" className={`ml-2 block text-sm text-brand-text-dim ${isAnyCheckboxChecked && !localScene.removesChanceOnEntry ? 'opacity-50' : ''}`}>
                                                Esta cena remove uma chance.
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="restoresChance"
                                                checked={!!localScene.restoresChanceOnEntry}
                                                onChange={e => handleToggle('restoresChanceOnEntry', e.target.checked)}
                                                className="custom-checkbox"
                                                disabled={isAnyCheckboxChecked && !localScene.restoresChanceOnEntry}
                                            />
                                            <label htmlFor="restoresChance" className={`ml-2 block text-sm text-brand-text-dim ${isAnyCheckboxChecked && !localScene.restoresChanceOnEntry ? 'opacity-50' : ''}`}>
                                                Esta cena restaura uma chance.
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'objects' && (
                        <ObjectEditor
                            sceneId={localScene.id}
                            objects={currentSceneObjects}
                            allGlobalObjects={Object.values(mergedGlobalObjects)}
                            onCreateGlobalObject={handleCreateGlobalObjectWrapper}
                            onLinkObject={handleLinkObjectWrapper}
                            onUnlinkObject={handleUnlinkObjectWrapper}
                            onUpdateGlobalObject={handleUpdateGlobalObjectLocal}
                        />
                    )}

                    {activeTab === 'interactions' && (
                        <InteractionEditor
                            interactions={localScene.interactions}
                            onUpdateInteractions={(interactions) => updateLocalScene('interactions', interactions)}
                            allScenes={allScenes}
                            currentSceneId={localScene.id}
                            sceneObjects={currentSceneObjects}
                            allTakableObjects={allAvailableInventoryObjects}
                            consequenceTrackers={consequenceTrackers}
                        />
                    )}

                    {activeTab === 'connections' && (
                        <ConnectionsView
                            currentScene={localScene}
                            inputConnections={connections.inputConnections}
                            outputConnections={connections.outputConnections}
                            allObjectsMap={allObjectsMap}
                            onSelectScene={onSelectScene}
                        />
                    )}
                </div>
            </div>
            <div className="fixed bottom-6 right-10 z-10 flex gap-2">
                <button
                    onClick={handlePreview}
                    className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200"
                >
                    <Eye className="w-5 h-5 inline-block mr-2" />
                    Testar Cena
                </button>
                <button
                    onClick={handleUndo}
                    disabled={!isDirty}
                    className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text-dim font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Desfazer
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Salvar
                </button>
            </div>
        </div>
    );
=======
  const [localScene, setLocalScene] = useState<Scene>(() => getCleanSceneState(scene));
  const [pendingObjectUpdates, setPendingObjectUpdates] = useState<{ [id: string]: Partial<GameObject> }>({});
  const [activeTab, setActiveTab] = useState<'properties' | 'objects' | 'interactions' | 'connections'>('properties');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const initialSceneJson = useRef(JSON.stringify(getCleanSceneState(scene)));
  
  // Reset local state when scene ID changes (switching scenes)
  useEffect(() => {
    const cleanScene = getCleanSceneState(scene);
    setLocalScene(cleanScene);
    setPendingObjectUpdates({});
    initialSceneJson.current = JSON.stringify(cleanScene);
    setActiveTab('properties');
  }, [scene.id]);

  // Check for dirty state
  useEffect(() => {
    const isSceneDirty = JSON.stringify(localScene) !== initialSceneJson.current;
    const areObjectsDirty = Object.keys(pendingObjectUpdates).length > 0;
    onSetDirty(isSceneDirty || areObjectsDirty);
  }, [localScene, pendingObjectUpdates, onSetDirty]);

  // Sync initial state when scene prop updates content (e.g. after a save)
  useEffect(() => {
      const cleanSceneProp = getCleanSceneState(scene);
      // If the prop matches our current local state and no pending object updates, we are in sync
      if (JSON.stringify(cleanSceneProp) === JSON.stringify(localScene) && Object.keys(pendingObjectUpdates).length === 0) {
          initialSceneJson.current = JSON.stringify(cleanSceneProp);
          if (isDirty) {
             onSetDirty(false);
          }
      }
  }, [scene, localScene, pendingObjectUpdates, isDirty, onSetDirty]);

  // Merge global objects with pending updates
  const mergedGlobalObjects = useMemo(() => {
    const merged = { ...globalObjects };
    Object.keys(pendingObjectUpdates).forEach(id => {
        if (merged[id]) {
            merged[id] = { ...merged[id], ...pendingObjectUpdates[id] };
        }
    });
    return merged;
  }, [globalObjects, pendingObjectUpdates]);

  // Construct the list of objects currently in this scene by ID lookup
  const currentSceneObjects = useMemo(() => {
      return (localScene.objectIds || []).map(id => mergedGlobalObjects[id]).filter(Boolean);
  }, [localScene.objectIds, mergedGlobalObjects]);

  // MODIFICADO: Agora todos os objetos globais podem ser usados como requerimento de inventário
  const allAvailableInventoryObjects = useMemo(() => {
     return Object.values(mergedGlobalObjects);
  }, [mergedGlobalObjects]);

  const allObjectsMap = useMemo(() => {
      return new Map(Object.entries(mergedGlobalObjects));
  }, [mergedGlobalObjects]);

  const connections = useMemo(() => {
    const sceneMap = new Map(allScenes.map(s => [s.id, s]));

    const inputConnectionsMap = new Map<string, Interaction[]>();
    for (const otherScene of allScenes) {
        if (otherScene.id === localScene.id) continue;
        for (const interaction of otherScene.interactions) {
            if (interaction.goToScene === localScene.id) {
                if (!inputConnectionsMap.has(otherScene.id)) {
                    inputConnectionsMap.set(otherScene.id, []);
                }
                inputConnectionsMap.get(otherScene.id)!.push(interaction);
            }
        }
    }

    const outputConnectionsMap = new Map<string, Interaction[]>();
    for (const interaction of localScene.interactions) {
        if (interaction.goToScene && sceneMap.has(interaction.goToScene)) {
            if (!outputConnectionsMap.has(interaction.goToScene)) {
                outputConnectionsMap.set(interaction.goToScene, []);
            }
            outputConnectionsMap.get(interaction.goToScene)!.push(interaction);
        }
    }

    const inputConnections: ConnectionDetail[] = Array.from(inputConnectionsMap.entries()).map(([sceneId, interactions]) => {
        const scene = sceneMap.get(sceneId);
        if (scene) {
            return { scene, interactions };
        }
        return null;
    }).filter((connection): connection is ConnectionDetail => connection !== null);


    const outputConnections: ConnectionDetail[] = Array.from(outputConnectionsMap.entries()).map(([sceneId, interactions]) => {
        const scene = sceneMap.get(sceneId);
        if (scene) {
            return { scene, interactions };
        }
        return null;
    }).filter((connection): connection is ConnectionDetail => connection !== null);


    return { inputConnections, outputConnections };
  }, [allScenes, localScene.id, localScene.interactions]);


  const updateLocalScene = <K extends keyof Scene,>(key: K, value: Scene[K]) => {
    setLocalScene(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateGlobalObjectLocal = (objectId: string, updatedData: Partial<GameObject>) => {
      setPendingObjectUpdates(prev => ({
          ...prev,
          [objectId]: { ...(prev[objectId] || {}), ...updatedData }
      }));
  };

  const handleCreateGlobalObjectWrapper = (obj: GameObject, linkToSceneId: string) => {
      onCreateGlobalObject(obj, ''); 
      setLocalScene(prev => ({
          ...prev,
          objectIds: [...(prev.objectIds || []), obj.id]
      }));
  };

  const handleLinkObjectWrapper = (sceneId: string, objectId: string) => {
      setLocalScene(prev => {
          if (prev.objectIds.includes(objectId)) return prev;
          return {
              ...prev,
              objectIds: [...prev.objectIds, objectId]
          };
      });
  };

  const handleUnlinkObjectWrapper = (sceneId: string, objectId: string) => {
      setLocalScene(prev => ({
          ...prev,
          objectIds: prev.objectIds.filter(id => id !== objectId)
      }));
  };

  const handleToggle = (key: 'isEndingScene' | 'removesChanceOnEntry' | 'restoresChanceOnEntry', value: boolean) => {
    setLocalScene(prev => {
        const newSceneState = { ...prev };
        if (value) {
            newSceneState.isEndingScene = false;
            newSceneState.removesChanceOnEntry = false;
            newSceneState.restoresChanceOnEntry = false;
        }
        newSceneState[key] = value;
        if (key === 'isEndingScene' && value) {
            newSceneState.objectIds = [];
            newSceneState.interactions = [];
        }
        return newSceneState;
    });
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLocalScene('name', e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateLocalScene('description', e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  updateLocalScene('image', event.target.result);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
      if (e.target) {
        (e.target as HTMLInputElement).value = '';
      }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  updateLocalScene('backgroundMusic', event.target.result);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
      if (e.target) {
        (e.target as HTMLInputElement).value = '';
      }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const event = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleImageUpload(event);
    }
  };
  
  const handleSave = () => {
    Object.keys(pendingObjectUpdates).forEach(id => {
        onUpdateGlobalObject(id, pendingObjectUpdates[id]);
    });
    setPendingObjectUpdates({});

    const finalScene: Scene = { ...localScene };
    finalScene.interactions = finalScene.interactions.map(interaction => ({
        ...interaction,
        verbs: interaction.verbs.map(v => v.trim().toLowerCase()).filter(Boolean)
    }));

    if (finalScene.isEndingScene) {
        finalScene.objectIds = [];
        finalScene.interactions = [];
    }
    onUpdateScene(finalScene);
  }
  
  const handleUndo = () => {
    const restoredScene = JSON.parse(initialSceneJson.current) as Scene;
    setLocalScene(restoredScene);
    setPendingObjectUpdates({});
  };

  const handlePreview = () => {
    onPreviewScene(localScene);
  };

  const TABS = {
    properties: 'Propriedades',
    objects: 'Objetos',
    interactions: 'Interações',
    connections: 'Conexões',
  };

  const isAnyCheckboxChecked = !!localScene.isEndingScene || !!localScene.removesChanceOnEntry || !!localScene.restoresChanceOnEntry;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-start">
        <div>
            <p className="text-brand-text-dim mt-1 text-sm">
            Defina a imagem, descrição, objetos e interações para esta cena.
            </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 mt-1">
            {isDirty && (
                <div className="flex items-center gap-2 text-yellow-400 text-xs font-medium animate-pulse">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Alterações não salvas</span>
                </div>
            )}
            <button
                onClick={() => onCopyScene(localScene)}
                className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors"
                title="Copiar Cena"
            >
                Copiar Cena
            </button>
        </div>
      </div>

      <div>
          <div className="border-b border-brand-border flex justify-between items-end">
            <div className="flex space-x-1">
                {Object.entries(TABS).map(([key, name]) => {
                    const isTabDisabled = localScene.isEndingScene && (key === 'objects' || key === 'interactions');
                    return (
                        <button
                            key={key}
                            onClick={() => !isTabDisabled && setActiveTab(key as any)}
                            disabled={isTabDisabled}
                            className={`px-4 py-2 font-semibold text-sm rounded-t-md transition-colors ${
                                activeTab === key
                                    ? 'bg-brand-surface text-brand-primary'
                                    : 'text-brand-text-dim hover:text-brand-text'
                            } ${isTabDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {name}
                        </button>
                    );
                })}
            </div>
            {activeTab === 'objects' && (
                <span className="text-xs text-yellow-400 mb-2 italic">
                    Alterações feitas aqui afetam o objeto em todo o jogo.
                </span>
            )}
          </div>

          <div className="bg-brand-surface -mt-px p-6">
          {activeTab === 'properties' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-4 flex flex-col order-2 md:order-1">
                      {/* Name and ID Column */}
                      <div className="space-y-4">
                          <div>
                            <label htmlFor="sceneName" className="block text-sm font-medium text-brand-text-dim mb-1">Nome da Cena</label>
                            <input type="text" id="sceneName" value={localScene.name} onChange={handleNameChange} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 text-sm"/>
                          </div>
                           <div>
                              <label htmlFor="sceneId" className="block text-sm font-medium text-brand-text-dim mb-1">ID da Cena</label>
                              <p 
                                id="sceneId" 
                                className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-dim font-mono select-all"
                                title="O ID da cena é único e não pode ser alterado."
                              >
                                {localScene.id}
                              </p>
                          </div>
                       </div>

                      <div className="flex flex-col flex-1 min-h-0 pt-2">
                          <label htmlFor="sceneDescription" className="block text-sm font-medium text-brand-text-dim mb-1">
                              {localScene.isEndingScene ? 'Mensagem de Fim de Jogo' : 'Descrição'}
                          </label>
                           <p className="text-xs text-brand-text-dim -mt-1 mb-2">Use <code>&lt;palavra&gt;</code> para destacar texto clicável.</p>
                          <div className="relative flex-1">
                              <textarea id="sceneDescription" value={localScene.description} onChange={handleDescriptionChange} className="w-full h-full min-h-[200px] bg-brand-bg border border-brand-border rounded-md px-3 py-2 resize-y focus:ring-0 text-sm"/>
                          </div>
                      </div>
                  </div>

                  <div className="flex flex-col space-y-4 order-1 md:order-2">
                      <div className="flex flex-col flex-grow min-h-[300px]">
                          <label className="block text-sm font-medium text-brand-text-dim mb-1">Imagem da Cena</label>
                          <div className="relative flex-grow w-full">
                            {localScene.image ? (
                                <div className="absolute inset-0 w-full h-full border border-brand-border rounded-md overflow-hidden bg-brand-bg group">
                                    <img src={localScene.image} alt={localScene.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                        <label htmlFor="image-upload-input" className="p-2 bg-brand-primary text-brand-bg rounded-md cursor-pointer hover:bg-brand-primary-hover flex items-center gap-2 font-semibold text-sm">
                                            <UploadIcon className="w-5 h-5" />
                                            <span className="hidden sm:inline">Alterar</span>
                                            <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                        <button 
                                            onClick={() => updateLocalScene('image', '')}
                                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                            title="Remover Imagem"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label 
                                    htmlFor="image-upload-input" 
                                    className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full border-2 border-dashed bg-brand-bg/50 rounded-md cursor-pointer hover:bg-brand-border/30 transition-colors ${isDraggingOver ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-border'}`}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(false); }}
                                    onDrop={handleDrop}
                                >
                                    <UploadIcon className="w-8 h-8 text-brand-text-dim mb-2" />
                                    <span className="text-sm font-semibold text-brand-text">Clique para Enviar</span>
                                    <span className="text-xs text-brand-text-dim mt-1">ou arraste e solte</span>
                                    <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                          </div>
                          {/* MODIFICADO: Recomendação contextual incluindo tamanho em pixels */}
                          <p className="text-xs text-brand-text-dim text-center mt-3">
                              {layoutOrientation === 'vertical' 
                                  ? "Recomendado imagens em pé (ex: 9:16). Sugestão: 720x1280 pixels." 
                                  : "Recomendado imagens deitadas (ex: 16:9). Sugestão: 1280x720 pixels."}
                          </p>
                      </div>

                      <div className="pt-4 border-t border-brand-border/30">
                          <label className="block text-sm font-medium text-brand-text-dim mb-2">Trilha Sonora (Mudar música ao entrar)</label>
                          <div className="flex items-center gap-2">
                                <label className="flex-grow flex items-center justify-center px-3 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors cursor-pointer text-xs">
                                    <UploadIcon className="w-4 h-4 mr-2" /> {localScene.backgroundMusic ? 'Alterar Trilha' : 'Carregar Trilha (.mp3)'}
                                    <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={handleMusicUpload} className="hidden" />
                                </label>
                                {localScene.backgroundMusic && (
                                    <button
                                        onClick={() => updateLocalScene('backgroundMusic', undefined)}
                                        className="p-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors"
                                        title="Remover Troca de Música"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                          </div>
                          <p className="text-[10px] text-brand-text-dim mt-1 italic">Deixe vazio para continuar tocando a música da cena anterior.</p>
                      </div>

                      {!isStartScene && (
                        <div className="space-y-4 pt-4 border-t border-brand-border/30">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isEndingScene"
                                    checked={!!localScene.isEndingScene}
                                    onChange={e => handleToggle('isEndingScene', e.target.checked)}
                                    className="custom-checkbox"
                                    disabled={isAnyCheckboxChecked && !localScene.isEndingScene}
                                />
                                <label htmlFor="isEndingScene" className={`ml-2 block text-sm text-brand-text-dim ${isAnyCheckboxChecked && !localScene.isEndingScene ? 'opacity-50' : ''}`}>
                                    Esta cena vence o jogo.
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="removesChance"
                                    checked={!!localScene.removesChanceOnEntry}
                                    onChange={e => handleToggle('removesChanceOnEntry', e.target.checked)}
                                    className="custom-checkbox"
                                    disabled={isAnyCheckboxChecked && !localScene.removesChanceOnEntry}
                                />
                                <label htmlFor="removesChance" className={`ml-2 block text-sm text-brand-text-dim ${isAnyCheckboxChecked && !localScene.removesChanceOnEntry ? 'opacity-50' : ''}`}>
                                    Esta cena remove uma chance.
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="restoresChance"
                                    checked={!!localScene.restoresChanceOnEntry}
                                    onChange={e => handleToggle('restoresChanceOnEntry', e.target.checked)}
                                    className="custom-checkbox"
                                    disabled={isAnyCheckboxChecked && !localScene.restoresChanceOnEntry}
                                />
                                <label htmlFor="restoresChance" className={`ml-2 block text-sm text-brand-text-dim ${isAnyCheckboxChecked && !localScene.restoresChanceOnEntry ? 'opacity-50' : ''}`}>
                                    Esta cena restaura uma chance.
                                </label>
                            </div>
                        </div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === 'objects' && (
              <ObjectEditor
                sceneId={localScene.id}
                objects={currentSceneObjects}
                allGlobalObjects={Object.values(mergedGlobalObjects)}
                onCreateGlobalObject={handleCreateGlobalObjectWrapper}
                onLinkObject={handleLinkObjectWrapper}
                onUnlinkObject={handleUnlinkObjectWrapper}
                onUpdateGlobalObject={handleUpdateGlobalObjectLocal}
              />
          )}

          {activeTab === 'interactions' && (
              <InteractionEditor
                interactions={localScene.interactions}
                onUpdateInteractions={(interactions) => updateLocalScene('interactions', interactions)}
                allScenes={allScenes}
                currentSceneId={localScene.id}
                sceneObjects={currentSceneObjects}
                allTakableObjects={allAvailableInventoryObjects}
                consequenceTrackers={consequenceTrackers}
              />
          )}
          
          {activeTab === 'connections' && (
              <ConnectionsView
                currentScene={localScene}
                inputConnections={connections.inputConnections}
                outputConnections={connections.outputConnections}
                allObjectsMap={allObjectsMap}
                onSelectScene={onSelectScene}
              />
          )}
          </div>
      </div>
      <div className="fixed bottom-6 right-10 z-10 flex gap-2">
        <button
            onClick={handlePreview}
            className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200"
        >
            <EyeIcon className="w-5 h-5 inline-block mr-2" />
            Testar Cena
        </button>
        <button
            onClick={handleUndo}
            disabled={!isDirty}
            className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text-dim font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Desfazer
        </button>
        <button
            onClick={handleSave}
            disabled={!isDirty}
            className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            Salvar
        </button>
      </div>
    </div>
  );
>>>>>>> 3773e8d5433b183fb55694c9010f416f8ebcafd7
};

export default SceneEditor;
