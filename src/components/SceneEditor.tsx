import React, { useState, useEffect, DragEvent, useRef, useMemo, memo } from 'react';
import { Scene, Interaction, GameObject, ConsequenceTracker, Choice, Vignette } from '../types';
import { MAX_IMAGE_SIZE, MAX_AUDIO_SIZE } from '../constants';
import { useToast } from './ToastContext';
import ObjectEditor from './ObjectEditor';
import InteractionEditor from './InteractionEditor';
import BranchingPreview from './BranchingPreview';
import { Upload, Eye, Trash2, Plus, ArrowRight, Music, Image as ImageIcon, Flag, FileText, Scroll, GitBranch, Play } from 'lucide-react';

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
    gameInteractionType: 'parser' | 'choice';
    vignettes: Vignette[];
    onViewMap?: () => void;
    enableChances: boolean;
    gameSystemEnabled?: 'none' | 'chances' | 'trackers';
}

const getCleanSceneState = (s: Scene): Scene => {
    return {
        ...s,
        isEndingScene: !!s.isEndingScene,
        removesChanceOnEntry: !!s.removesChanceOnEntry,
        restoresChanceOnEntry: !!s.restoresChanceOnEntry,
        objectIds: s.objectIds || [],
        interactions: s.interactions || [],
        choices: s.choices || [],
        isDefeatOutcome: !!s.isDefeatOutcome,
    };
};

export interface ConnectionDetail {
    scene: Scene;
    interactions: Interaction[];
}

const SceneEditor: React.FC<SceneEditorProps> = memo(({
    scene,
    allScenes,
    globalObjects,
    onUpdateScene,
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
    isStartScene,
    gameInteractionType,
    vignettes,
    onViewMap,
    enableChances,
    gameSystemEnabled,
}) => {
    const { toast } = useToast();
    const [localScene, setLocalScene] = useState<Scene>(() => getCleanSceneState(scene));
    const [pendingObjectUpdates, setPendingObjectUpdates] = useState<{ [id: string]: Partial<GameObject> }>({});
    const [activeTab, setActiveTab] = useState<'properties' | 'objects' | 'interactions' | 'choices'>('properties');
    const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
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

    // Connections logic removed as simpler preview is used in BranchingPreview component


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
            const file = e.target.files[0];
            if (file.size > MAX_IMAGE_SIZE) {
                toast("Erro no Upload", `A imagem excede o limite de ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`, "error");
                if (e.target) (e.target as HTMLInputElement).value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    updateLocalScene('image', event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
        if (e.target) {
            (e.target as HTMLInputElement).value = '';
        }
    };

    const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > MAX_AUDIO_SIZE) {
                toast("Erro no Upload", `O áudio excede o limite de ${MAX_AUDIO_SIZE / 1024 / 1024}MB.`, "error");
                if (e.target) (e.target as HTMLInputElement).value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    updateLocalScene('backgroundMusic', event.target.result);
                }
            };
            reader.readAsDataURL(file);
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
            const file = e.dataTransfer.files[0];
            if (file.size > MAX_IMAGE_SIZE) {
                toast("Erro no Upload", `A imagem excede o limite de ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`, "error");
                return;
            }
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

    const TABS = useMemo(() => {
        if (gameInteractionType === 'choice') {
            return {
                properties: 'Propriedades',
                choices: 'Decisões',
            };
        }
        return {
            properties: 'Propriedades',
            objects: 'Objetos',
            interactions: 'Interações',
        };
    }, [gameInteractionType]);

    const isAnyCheckboxChecked = !!localScene.isEndingScene || !!localScene.removesChanceOnEntry || !!localScene.restoresChanceOnEntry;

    return (
        <div className="space-y-6">
            <div className="sticky top-0 z-40 flex justify-between items-center bg-zinc-900/95 backdrop-blur-md p-4 rounded-xl border border-muted-foreground/10 shadow-lg mb-6">
                <p className="text-zinc-500 text-xs font-medium max-w-lg">
                    Defina a imagem, descrição, objetos e interações para esta cena.
                </p>
                <div className="flex items-center gap-3">
                    {isDirty && (
                        <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mr-2">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                            Alterações não salvas
                        </div>
                    )}

                    <button
                        onClick={handlePreview}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg"
                        title="Testar apenas esta cena"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Testar
                    </button>

                    <button
                        onClick={() => onCopyScene(localScene)}
                        className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                        title="Copiar Cena"
                    >
                        Copiar
                    </button>

                    <button
                        onClick={handleUndo}
                        disabled={!isDirty}
                        className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                    >
                        Desfazer
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="px-4 py-1.5 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed shadow-lg shadow-yellow-900/10"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>

            <div>
                <div className="border-b border-muted-foreground/50 flex items-center justify-between pr-4">
                    <div className="flex space-x-1 overflow-x-auto">
                        {Object.entries(TABS).map(([key, name]) => {
                            const isTabDisabled = localScene.isEndingScene && (key === 'objects' || key === 'interactions');
                            return (
                                <button
                                    key={key}
                                    onClick={() => !isTabDisabled && setActiveTab(key as any)}
                                    disabled={isTabDisabled}
                                    className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-4 ${activeTab === key
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                        } ${isTabDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                                >
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                    {activeTab === 'objects' && (
                        <span className="text-xs text-yellow-400 mb-2 italic">
                            Alterações feitas aqui afetam o mesmo objeto caso utilizado em outras cenas.
                        </span>
                    )}
                </div>

                <div className="bg-background pt-6">
                    {activeTab === 'properties' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Details & Rules */}
                            <div className="space-y-6">
                                {/* Scene Details Card */}
                                <div className="bg-card border border-muted-foreground/20 rounded-xl p-6 shadow-sm">
                                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        DETALHES DA CENA
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-2">
                                                <label htmlFor="sceneName" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Nome da Cena</label>
                                                <input type="text" id="sceneName" value={localScene.name} onChange={handleNameChange} className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-zinc-700" placeholder="Ex: Entrada da Caverna" />
                                            </div>
                                            <div className="col-span-1">
                                                <label htmlFor="sceneId" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">ID Único</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={localScene.id}
                                                        disabled
                                                        className="w-full bg-zinc-950/50 border border-muted-foreground/20 rounded-lg px-3 py-2.5 text-xs text-zinc-500 font-mono"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 text-[10px]">#</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label htmlFor="sceneDescription" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {localScene.isEndingScene ? 'Mensagem de Fim de Jogo' : 'Descrição Narrativa'}
                                                </label>
                                                <span className="text-[9px] text-muted-foreground font-medium tracking-wider">Use &lt;palavra&gt; para destacar</span>
                                            </div>
                                            <div className="relative">
                                                <textarea
                                                    id="sceneDescription"
                                                    value={localScene.description}
                                                    onChange={handleDescriptionChange}
                                                    className="w-full h-32 md:h-40 bg-zinc-950 border border-muted-foreground/30 rounded-lg px-4 py-3 text-sm text-zinc-300 resize-y focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all leading-relaxed placeholder:text-zinc-700"
                                                    placeholder="Descreva o que o jogador vê e sente nesta cena..."
                                                />

                                                <div className="pt-4 border-t border-muted-foreground/10 mt-4">
                                                    <label className="flex items-center gap-2 cursor-pointer mb-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={localScene.vignetteType && localScene.vignetteType !== 'none'}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    updateLocalScene('vignetteType', 'opening');
                                                                } else {
                                                                    updateLocalScene('vignetteType', 'none');
                                                                }
                                                            }}
                                                            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground accent-purple-500"
                                                        />
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Esta cena é uma vinheta?</span>
                                                    </label>

                                                    {localScene.vignetteType && localScene.vignetteType !== 'none' && (
                                                        <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {[
                                                                    { id: 'opening', label: 'Abertura', icon: Play },
                                                                    { id: 'transition', label: 'Transição', icon: ArrowRight },
                                                                    { id: 'conclusion', label: 'Conclusão', icon: Flag }
                                                                ].map((type) => (
                                                                    <button
                                                                        key={type.id}
                                                                        onClick={() => {
                                                                            const newType = localScene.vignetteType === type.id ? undefined : (type.id as 'opening' | 'transition' | 'conclusion');
                                                                            updateLocalScene('vignetteType', newType);
                                                                        }}
                                                                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${localScene.vignetteType === type.id
                                                                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                                                            : 'bg-zinc-900/50 border-muted-foreground/20 text-muted-foreground hover:bg-muted/10 hover:text-zinc-300'
                                                                            }`}
                                                                    >
                                                                        <type.icon className="w-4 h-4" />
                                                                        <span className="text-[10px] font-bold uppercase">{type.label}</span>
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                                                        Texto do Botão
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={localScene.vignetteButtonText || ''}
                                                                        onChange={(e) => updateLocalScene('vignetteButtonText', e.target.value)}
                                                                        placeholder={localScene.vignetteType === 'conclusion' ? 'Reiniciar' : 'Continuar'}
                                                                        className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-700"
                                                                    />
                                                                </div>

                                                                {localScene.vignetteType === 'conclusion' && (
                                                                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded border border-muted-foreground/10 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors self-end">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!!localScene.isDefeatOutcome}
                                                                            onChange={(e) => updateLocalScene('isDefeatOutcome', e.target.checked)}
                                                                            className="peer h-3.5 w-3.5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground accent-red-500"
                                                                        />
                                                                        <div>
                                                                            <span className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Resultado negativo</span>
                                                                            <span className="block text-[9px] text-muted-foreground">Exibir quando as chances acabam.</span>
                                                                        </div>
                                                                    </label>
                                                                )}

                                                                {localScene.vignetteType !== 'conclusion' && (
                                                                    <div>
                                                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                                                            Ir Para
                                                                        </label>
                                                                        <select
                                                                            value={localScene.vignetteNextSceneId || ''}
                                                                            onChange={(e) => updateLocalScene('vignetteNextSceneId', e.target.value)}
                                                                            className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/50 transition-all [&>option]:bg-zinc-950"
                                                                        >
                                                                            <option value="">(Basta fechar)</option>
                                                                            <option value="END_GAME">Encerramento (Fim de Jogo)</option>
                                                                            <optgroup label="Cenas">
                                                                                {allScenes.filter(s => s.id !== localScene.id).map(s => (
                                                                                    <option key={s.id} value={s.id}>
                                                                                        {s.name}
                                                                                    </option>
                                                                                ))}
                                                                            </optgroup>
                                                                        </select>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Branching Preview Card */}
                                <div className="bg-card border border-muted-foreground/20 rounded-xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <GitBranch className="w-4 h-4 text-muted-foreground" />
                                            CONEXÕES
                                        </h3>
                                        {/* Optional: Link to full map if needed, but simplistic for now */}
                                        <button onClick={() => onViewMap?.()} className="text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-widest transition-colors flex items-center gap-1" title="Volte ao mapa para ver completo">
                                            Ver Mapa Completo
                                        </button>
                                    </div>

                                    <BranchingPreview currentScene={localScene} allScenes={allScenes} />

                                    <p className="text-[10px] text-zinc-500 text-center mt-3">
                                        Visualização rápida das conexões diretas.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Rules & Preview */}
                            <div className="space-y-6">

                                {/* Multimedia Card */}
                                <div className="bg-card border border-muted-foreground/20 rounded-xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                            MULTIMÍDIA
                                        </h3>
                                        <span className="text-[10px] text-muted-foreground">
                                            {layoutOrientation === 'vertical' ? '720x1280 sugerido' : '1280x720 sugerido'}
                                        </span>
                                    </div>

                                    {/* Image Preview Area */}
                                    <div className="relative w-full aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-muted-foreground/20 group mb-6">
                                        {localScene.image ? (
                                            <>
                                                <img src={localScene.image} alt={localScene.name} className="w-full h-full object-cover" />

                                                {/* Editor Overlay Preview */}
                                                {localScene.overlayEffect === 'grain' && (
                                                    <div className="overlay-film-grain" />
                                                )}

                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 gap-4 backdrop-blur-sm z-20">
                                                    <label htmlFor="image-upload-input" className="flex flex-col items-center gap-2 cursor-pointer text-white hover:text-purple-300 transition-colors">
                                                        <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                                                            <Upload className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Trocar</span>
                                                        <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                    </label>
                                                    <button onClick={() => updateLocalScene('image', '')} className="flex flex-col items-center gap-2 text-white hover:text-red-400 transition-colors">
                                                        <div className="p-2 bg-white/10 rounded-full hover:bg-red-500/20 transition-all">
                                                            <Trash2 className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Remover</span>
                                                    </button>
                                                </div>

                                            </>
                                        ) : (
                                            <label htmlFor="image-upload-input" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900 transition-colors group">
                                                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-purple-500/50 transition-all">
                                                    <ImageIcon className="w-5 h-5 text-zinc-600 group-hover:text-purple-400" />
                                                </div>
                                                <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300">Carregar Imagem de Fundo</span>
                                                <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                        )}
                                    </div>

                                    {/* Overlay Effect Selector */}
                                    <div className="space-y-2 mb-6">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efeito de Overlay</label>
                                        <select
                                            value={localScene.overlayEffect || ''}
                                            onChange={(e) => updateLocalScene('overlayEffect', e.target.value)}
                                            className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                        >
                                            <option value="">Nenhum</option>
                                            <option value="grain">Granulação (Old Film)</option>
                                        </select>
                                    </div>

                                    {/* Audio Section */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trilha Sonora (.mp3)</label>
                                        <div className="flex items-center gap-3 p-3 bg-zinc-950/50 border border-dashed border-muted-foreground/30 rounded-lg hover:border-purple-500/30 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center flex-shrink-0">
                                                <Music className={`w-4 h-4 ${localScene.backgroundMusic ? 'text-purple-400' : 'text-zinc-600'}`} />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                {localScene.backgroundMusic ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-zinc-200 truncate">Trilha Personalizada Definida</span>
                                                        <span className="text-[10px] text-green-500">Áudio carregado com sucesso</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-zinc-400 italic">Nenhuma trilha selecionada</span>
                                                        <span className="text-[9px] text-zinc-600">Deixe vazio para continuar a música anterior.</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0">
                                                {localScene.backgroundMusic ? (
                                                    <button onClick={() => updateLocalScene('backgroundMusic', undefined)} className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded transition-all" title="Remover">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <label htmlFor="music-upload" className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer transition-colors border border-zinc-700">
                                                        Carregar
                                                        <input id="music-upload" type="file" accept="audio/*" onChange={handleMusicUpload} className="hidden" />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Narrative Rules Card - Renamed to Chance Rules */}
                                {(enableChances || gameSystemEnabled === 'chances') && (
                                    <div className="bg-card border border-muted-foreground/20 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                                            <Scroll className="w-4 h-4 text-muted-foreground" />
                                            REGRAS DE CHANCES
                                        </h3>
                                        <div className="space-y-3">
                                            {/* Chance Removal */}
                                            <label className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${localScene.removesChanceOnEntry ? 'bg-zinc-900/80 border-red-500/30' : 'bg-transparent border-muted-foreground/20 hover:bg-muted/10'}`}>
                                                <div className="relative flex items-center mt-0.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!localScene.removesChanceOnEntry}
                                                        onChange={e => handleToggle('removesChanceOnEntry', e.target.checked)}
                                                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground accent-red-500"
                                                        disabled={isAnyCheckboxChecked && !localScene.removesChanceOnEntry}
                                                    />
                                                </div>
                                                <div>
                                                    <span className={`block text-xs font-bold ${localScene.removesChanceOnEntry ? 'text-red-400' : 'text-zinc-400 group-hover:text-zinc-300'}`}>Esta cena remove uma chance</span>
                                                    <span className="block text-[10px] text-muted-foreground mt-0.5">O jogador perde uma vida/tentativa ao entrar aqui.</span>
                                                </div>
                                            </label>

                                            {/* Chance Restoration */}
                                            <label className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${localScene.restoresChanceOnEntry ? 'bg-zinc-900/80 border-green-500/30' : 'bg-transparent border-muted-foreground/20 hover:bg-muted/10'}`}>
                                                <div className="relative flex items-center mt-0.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!localScene.restoresChanceOnEntry}
                                                        onChange={e => handleToggle('restoresChanceOnEntry', e.target.checked)}
                                                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground accent-green-500"
                                                        disabled={isAnyCheckboxChecked && !localScene.restoresChanceOnEntry}
                                                    />
                                                </div>
                                                <div>
                                                    <span className={`block text-xs font-bold ${localScene.restoresChanceOnEntry ? 'text-green-400' : 'text-zinc-400 group-hover:text-zinc-300'}`}>Esta cena restaura uma chance</span>
                                                    <span className="block text-[10px] text-muted-foreground mt-0.5">O jogador ganha uma vida extra ou cura.</span>
                                                </div>
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
                            vignettes={vignettes}
                        />
                    )}

                    {activeTab === 'choices' && (
                        <div className="flex h-[600px] border border-muted-foreground/20 rounded-xl overflow-hidden bg-card shadow-sm">
                            {/* LEFT LIST PANEL */}
                            <div className="w-1/3 min-w-[250px] border-r border-muted-foreground/20 flex flex-col bg-zinc-950/30">
                                <div className="p-4 border-b border-muted-foreground/10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                                            Escolhas ({localScene.choices?.length || 0})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                    {(localScene.choices || []).length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p className="text-xs italic">Nenhuma escolha definida.</p>
                                        </div>
                                    ) : (
                                        (localScene.choices || []).map((choice, index) => (
                                            <button
                                                key={choice.id}
                                                onClick={() => setSelectedChoiceId(choice.id)}
                                                className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all text-left ${selectedChoiceId === choice.id ? 'bg-purple-500/10 border-purple-500/40' : 'bg-transparent border-transparent hover:bg-zinc-900 hover:border-zinc-800'}`}
                                            >
                                                <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                                                    <ArrowRight className={`w-4 h-4 ${selectedChoiceId === choice.id ? 'text-purple-400' : 'text-zinc-600'}`} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className={`text-xs font-bold truncate ${selectedChoiceId === choice.id ? 'text-purple-300' : 'text-zinc-300'}`}>
                                                        {choice.label || 'Nova Escolha'}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-mono truncate">
                                                        {choice.targetSceneId ? `-> ${allScenes.find(s => s.id === choice.targetSceneId)?.name || choice.targetSceneId}` : '(Sem destino)'}
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div className="p-3 border-t border-muted-foreground/10 bg-zinc-900/50">
                                    <button
                                        onClick={() => {
                                            const newId = `choice_${Date.now()}`;
                                            const newChoice: Choice = {
                                                id: newId,
                                                label: 'Nova Escolha',
                                                targetSceneId: ''
                                            };
                                            updateLocalScene('choices', [...(localScene.choices || []), newChoice]);
                                            setSelectedChoiceId(newId);
                                        }}
                                        className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-lg text-xs flex items-center justify-center transition-colors shadow"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-2" />
                                        Criar Nova Escolha
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT DETAIL PANEL */}
                            <div className="flex-1 flex flex-col bg-zinc-950/10 min-w-0">
                                {selectedChoiceId && localScene.choices?.find(c => c.id === selectedChoiceId) ? (
                                    (() => {
                                        const choiceIndex = localScene.choices!.findIndex(c => c.id === selectedChoiceId);
                                        const choice = localScene.choices![choiceIndex];
                                        return (
                                            <div className="flex flex-col h-full">
                                                <div className="px-6 py-4 border-b border-muted-foreground/10 flex justify-between items-center bg-zinc-900/30">
                                                    <div className="flex items-center gap-2">
                                                        <ArrowRight className="w-4 h-4 text-purple-500" />
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Detalhes da Escolha</span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Tem certeza que deseja remover esta escolha?')) {
                                                                const newChoices = localScene.choices!.filter(c => c.id !== selectedChoiceId);
                                                                updateLocalScene('choices', newChoices);
                                                                setSelectedChoiceId(null);
                                                            }
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-md text-[10px] font-bold uppercase transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Remover
                                                    </button>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-6">
                                                    <div className="max-w-2xl mx-auto space-y-6">
                                                        <div className="space-y-1.5">
                                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Texto do Botão</label>
                                                            <input
                                                                type="text"
                                                                value={choice.label}
                                                                onChange={(e) => {
                                                                    const newChoices = [...localScene.choices!];
                                                                    newChoices[choiceIndex] = { ...choice, label: e.target.value };
                                                                    updateLocalScene('choices', newChoices);
                                                                }}
                                                                className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500/50"
                                                                placeholder="Ex: Tentar abrir a porta..."
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cena de Destino</label>
                                                            <div className="relative">
                                                                <select
                                                                    value={choice.targetSceneId}
                                                                    onChange={(e) => {
                                                                        const newChoices = [...localScene.choices!];
                                                                        newChoices[choiceIndex] = { ...choice, targetSceneId: e.target.value };
                                                                        updateLocalScene('choices', newChoices);
                                                                    }}
                                                                    className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2 text-sm text-zinc-300 pr-8 appearance-none focus:ring-1 focus:ring-purple-500/50 [&>option]:bg-zinc-950"
                                                                >
                                                                    <option value="">Selecione...</option>
                                                                    {allScenes.map(s => (
                                                                        <option key={s.id} value={s.id}>
                                                                            {s.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <ArrowRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                            </div>
                                                            <p className="text-[10px] text-muted-foreground mt-1">Para onde o jogador irá ao clicar neste botão.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                                        <ArrowRight className="w-12 h-12 mb-4 opacity-20" />
                                        <h4 className="text-sm font-bold text-zinc-400 mb-1">Nenhuma escolha selecionada</h4>
                                        <p className="text-xs max-w-xs opacity-60">Selecione uma escolha da lista para editar seus detalhes ou crie uma nova.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
});

export default SceneEditor;
