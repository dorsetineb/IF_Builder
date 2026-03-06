
import React, { useState, useEffect, DragEvent, useRef, useMemo, memo } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Scene, FixedVerb, Interaction, Vignette, GameObject, ConsequenceTracker, Choice } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { initialGameData, OVERLAY_CSS } from '../lib/gameDefaults';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { generateUniqueId } from '../utils/helpers';
import { MAX_IMAGE_SIZE, MAX_AUDIO_SIZE } from '../constants';
import { useToast } from './ToastContext';
import ObjectEditor from './ObjectEditor';
import InteractionEditor from './InteractionEditor';
import BranchingPreview from './BranchingPreview';
import { Upload, Eye, Trash2, Plus, ArrowRight, Music, Image as ImageIcon, Flag, FileText, Scroll, GitBranch, Play, Copy, RotateCcw, Save } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTranslation, Trans } from 'react-i18next';
import RainOverlay from './effects/RainOverlay';
import BlurOverlay from './effects/BlurOverlay';
import ChromaticOverlay from './effects/ChromaticOverlay';
import TVOverlay from './effects/TVOverlay';
import ConfettiOverlay from './effects/ConfettiOverlay';
import GlitchOverlay from './effects/GlitchOverlay';
import NosferatuOverlay from './effects/NosferatuOverlay';
import WiggleOverlay from './effects/WiggleOverlay';
import FogOverlay from './effects/FogOverlay';

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
    globalSplashButtonText?: string;
    onUpdateGlobalSplashButtonText?: (text: string) => void;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onLinkObjectToScene,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onUnlinkObjectFromScene,
    onUpdateGlobalObject,
    onPreviewScene,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSelectScene,
    isDirty,
    onSetDirty,
    layoutOrientation,
    consequenceTrackers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isStartScene,
    gameInteractionType,
    vignettes,
    onViewMap,
    enableChances,
    gameSystemEnabled,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    globalSplashButtonText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onUpdateGlobalSplashButtonText,
}) => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const [localScene, setLocalScene] = useState<Scene>(() => getCleanSceneState(scene));
    const [pendingObjectUpdates, setPendingObjectUpdates] = useState<{ [id: string]: Partial<GameObject> }>({});
    const [activeTab, setActiveTab] = useState<'properties' | 'objects' | 'interactions' | 'choices'>('properties');
    const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
    const [suggestionsInput, setSuggestionsInput] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const initialSceneJson = useRef(JSON.stringify(getCleanSceneState(scene)));

    // Reset local state when scene ID changes (switching scenes)
    useEffect(() => {
        const cleanScene = getCleanSceneState(scene);
        setLocalScene(cleanScene);
        setPendingObjectUpdates({});
        initialSceneJson.current = JSON.stringify(cleanScene);
        setActiveTab('properties');
        setSuggestionsInput(cleanScene.suggestions ? cleanScene.suggestions.join(', ') : '');
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    const handleSuggestionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSuggestionsInput(e.target.value);
    };

    const handleSuggestionsBlur = () => {
        const suggestionsArray = suggestionsInput.split(',').map(s => s.trim()).filter(s => s !== '');
        updateLocalScene('suggestions', suggestionsArray);
        setSuggestionsInput(suggestionsArray.join(', '));
    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > MAX_IMAGE_SIZE) {
                toast(
                    t('editor.uploadErrorTitle', 'Erro no Upload'),
                    t('editor.imageLimitExceeded', { limit: MAX_IMAGE_SIZE / 1024 / 1024, defaultValue: `A imagem excede o limite de ${MAX_IMAGE_SIZE / 1024 / 1024} MB.` }),
                    "error"
                );
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
                toast(
                    t('editor.uploadErrorTitle', 'Erro no Upload'),
                    t('editor.audioLimitExceeded', { limit: MAX_AUDIO_SIZE / 1024 / 1024, defaultValue: `O áudio excede o limite de ${MAX_AUDIO_SIZE / 1024 / 1024} MB.` }),
                    "error"
                );
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.size > MAX_IMAGE_SIZE) {
                toast(
                    t('editor.uploadErrorTitle', 'Erro no Upload'),
                    t('editor.imageLimitExceeded', { limit: MAX_IMAGE_SIZE / 1024 / 1024, defaultValue: `A imagem excede o limite de ${MAX_IMAGE_SIZE / 1024 / 1024} MB.` }),
                    "error"
                );
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
                properties: t('sceneEditor.tabs.properties'),
                choices: t('sceneEditor.tabs.choices'),
            };
        }
        return {
            properties: t('sceneEditor.tabs.properties'),
            objects: t('sceneEditor.tabs.objects'),
            interactions: t('sceneEditor.tabs.interactions'),
        };
    }, [gameInteractionType, t]);

    const isAnyCheckboxChecked = !!localScene.isEndingScene || !!localScene.removesChanceOnEntry || !!localScene.restoresChanceOnEntry;

    const isVignetteMode = localScene.vignetteType && localScene.vignetteType !== 'none';

    return (
        <div className="space-y-6">
            <div className="sticky top-0 z-40 flex justify-between items-center bg-background/95 backdrop-blur-md p-4 rounded-xl border border-border">
                <p className="text-muted-foreground text-xs font-medium max-w-lg">
                    {t('sceneEditor.headerDesc')}
                </p>
                <div className="flex items-center gap-2">
                    {isDirty && (
                        <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mr-1">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                            <span className="hidden sm:inline">{t('sceneEditor.unsavedChanges')}</span>
                        </div>
                    )}

                    <button
                        onClick={handlePreview}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg"
                        title={t('sceneEditor.testTooltip')}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('sceneEditor.testBtn')}</span>
                    </button>

                    <button
                        onClick={() => onCopyScene(localScene)}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors hover:bg-zinc-800 rounded-lg"
                        title={t('sceneEditor.copyTooltip')}
                    >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('sceneEditor.copyBtn')}</span>
                    </button>

                    <button
                        onClick={handleUndo}
                        disabled={!isDirty}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors hover:bg-zinc-800 rounded-lg"
                        title={t('sceneEditor.undoTooltip')}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('sceneEditor.undoBtn')}</span>
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>{t('sceneEditor.saveBtn')}</span>
                    </button>
                </div>
            </div>

            <div>
                {!isVignetteMode && (
                    <div className="border-b border-muted-foreground/50 flex items-center justify-between pr-4">
                        <div className="flex space-x-1 overflow-x-auto">
                            {Object.entries(TABS).map(([key, name]) => {
                                const isVignette = localScene.vignetteType && localScene.vignetteType !== 'none';
                                const isTabDisabled = (localScene.isEndingScene || isVignette) && (key === 'objects' || key === 'interactions');
                                return (
                                    <button
                                        key={key}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        onClick={() => !isTabDisabled && setActiveTab(key as any)}
                                        disabled={isTabDisabled}
                                        className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-4 ${activeTab === key
                                            ? 'border-primary text-primary bg-primary/5'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                            } ${isTabDisabled ? 'opacity-30 cursor-not-allowed' : ''} `}
                                    >
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                        {activeTab === 'objects' && (
                            <span className="text-xs text-yellow-400 mb-2 italic">
                                {t('sceneEditor.objectWarning')}
                            </span>
                        )}
                    </div>
                )}

                <div className="bg-background pt-6">
                    {activeTab === 'properties' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Details & Rules */}
                            <div className="space-y-6">
                                {/* Scene Details Card */}
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        {isVignetteMode ? t('sceneEditor.vignetteNarrativeTitle', 'Detalhes da Vinheta') : t('sceneEditor.narrativeTitle')}
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-2">
                                                <label htmlFor="sceneName" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{isVignetteMode ? t('sceneEditor.vignetteTitleLabel', 'NOME DA VINHETA') : t('sceneEditor.titleLabel')}</label>
                                                <input type="text" id="sceneName" value={localScene.name} onChange={handleNameChange} className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground" placeholder={t('sceneEditor.titlePlaceholder')} />
                                            </div>
                                            <div className="col-span-1">
                                                <label htmlFor="sceneId" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{t('sceneEditor.uniqueIdLabel')}</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={localScene.id}
                                                        disabled
                                                        className="w-full bg-muted/50 border border-input rounded-lg px-3 py-2.5 text-xs text-muted-foreground font-mono"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 text-[10px]">#</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label htmlFor="sceneDescription" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {localScene.isEndingScene ? t('sceneEditor.endingMessage') : (isVignetteMode ? t('sceneEditor.vignetteDescription', 'TEXTO DA VINHETA') : t('sceneEditor.description'))}
                                                </label>
                                                <span className="text-[9px] text-muted-foreground font-medium tracking-wider">{t('sceneEditor.highlightTip')}</span>
                                            </div>
                                            <div className="relative">
                                                <textarea
                                                    id="sceneDescription"
                                                    value={localScene.description}
                                                    onChange={handleDescriptionChange}
                                                    className="w-full h-32 md:h-40 bg-input border border-input rounded-lg px-4 py-3 text-sm text-foreground resize-y focus:ring-1 focus:ring-primary focus:border-primary transition-all leading-relaxed placeholder:text-muted-foreground"
                                                    placeholder={t('sceneEditor.descPlaceholder')}
                                                />

                                                {gameInteractionType !== 'choice' && !isVignetteMode && (
                                                    <div className="pt-4 mt-4">
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <label htmlFor="sceneSuggestions" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                {t('sceneEditor.suggestionsLabel', 'SUGESTÕES')}
                                                            </label>
                                                            <span className="text-[9px] text-muted-foreground font-medium tracking-wider">{t('sceneEditor.suggestionsHint', 'Use vírgula para separar')}</span>
                                                        </div>
                                                        <textarea
                                                            id="sceneSuggestions"
                                                            value={suggestionsInput}
                                                            onChange={handleSuggestionsChange}
                                                            onBlur={handleSuggestionsBlur}
                                                            className="w-full h-16 bg-input border border-input rounded-lg px-4 py-3 text-sm text-foreground resize-y focus:ring-1 focus:ring-primary focus:border-primary transition-all leading-relaxed placeholder:text-muted-foreground"
                                                            placeholder={t('sceneEditor.suggestionsPlaceholder', 'Ex: examinar, pegar, usar, falar')}
                                                        />

                                                    </div>
                                                )}

                                                {isVignetteMode && (
                                                    <div className="pt-4 border-t border-muted-foreground/10 mt-4">
                                                        <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {[
                                                                    { id: 'opening', label: t('sceneEditor.vignetteTypes.opening'), icon: Play },
                                                                    { id: 'transition', label: t('sceneEditor.vignetteTypes.transition'), icon: ArrowRight },
                                                                    { id: 'conclusion', label: t('sceneEditor.vignetteTypes.conclusion'), icon: Flag }
                                                                ].map((type) => {
                                                                    const isOpeningDisabled = type.id === 'opening' && allScenes.some(s => s.vignetteType === 'opening' && s.id !== localScene.id);

                                                                    return (
                                                                        <button
                                                                            key={type.id}
                                                                            disabled={isOpeningDisabled}
                                                                            onClick={() => {
                                                                                if (localScene.vignetteType !== type.id) {
                                                                                    updateLocalScene('vignetteType', type.id as 'opening' | 'transition' | 'conclusion');
                                                                                }
                                                                            }}
                                                                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${localScene.vignetteType === type.id
                                                                                ? 'bg-primary/20 border-primary text-primary'
                                                                                : isOpeningDisabled
                                                                                    ? 'bg-muted/10 border-border/50 text-muted-foreground/30 cursor-not-allowed opacity-50'
                                                                                    : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                                                                                }`}
                                                                            title={isOpeningDisabled ? t('sceneEditor.alreadyHasOpening', 'Já existe uma vinheta de abertura.') : undefined}
                                                                        >
                                                                            <type.icon className="w-4 h-4" />
                                                                            <span className="text-[10px] font-bold uppercase">{type.label}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                                                        {t('sceneEditor.buttonTextLabel')}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={localScene.vignetteButtonText || ''}
                                                                        onChange={(e) => updateLocalScene('vignetteButtonText', e.target.value)}
                                                                        placeholder={localScene.vignetteType === 'conclusion' ? t('sceneEditor.restart', 'Reiniciar') : t('UIEditor.textos.splashButtonPlaceholder', 'Iniciar')}
                                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                                                                    />
                                                                </div>

                                                                {localScene.vignetteType === 'conclusion' && (
                                                                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded border border-border bg-muted/30 hover:bg-muted/50 transition-colors self-end">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!!localScene.isDefeatOutcome}
                                                                            onChange={(e) => updateLocalScene('isDefeatOutcome', e.target.checked)}
                                                                            className="custom-checkbox"
                                                                        />
                                                                        <div>
                                                                            <span className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{t('sceneEditor.negativeOutcome')}</span>
                                                                            <span className="block text-[9px] text-muted-foreground">{t('sceneEditor.negativeOutcomeDesc')}</span>
                                                                        </div>
                                                                    </label>
                                                                )}

                                                                {localScene.vignetteType !== 'conclusion' && (
                                                                    <div>
                                                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                                                            {t('sceneEditor.goToLabel')}
                                                                        </label>
                                                                        <select
                                                                            value={localScene.vignetteNextSceneId || ''}
                                                                            onChange={(e) => updateLocalScene('vignetteNextSceneId', e.target.value)}
                                                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary transition-all [&>option]:bg-card"
                                                                        >
                                                                            <option value="">{t('sceneEditor.justClose')}</option>
                                                                            <option value="END_GAME">{t('sceneEditor.endGame')}</option>
                                                                            <optgroup label={t('sceneEditor.scenesGroup')}>
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
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Branching Preview Card */}
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <GitBranch className="w-4 h-4 text-muted-foreground" />
                                            {t('sceneEditor.connectionsTitle')}
                                        </h3>
                                        {/* Optional: Link to full map if needed, but simplistic for now */}
                                        <button onClick={() => onViewMap?.()} className="text-[10px] text-primary hover:text-primary/80 font-bold uppercase tracking-widest transition-colors flex items-center gap-1" title={t('sceneEditor.viewFullMapTooltip')}>
                                            {t('sceneEditor.viewFullMap')}
                                        </button>
                                    </div>

                                    <BranchingPreview currentScene={localScene} allScenes={allScenes} />

                                    <p className="text-[10px] text-zinc-500 text-center mt-3">
                                        {t('sceneEditor.connectionsDesc')}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Rules & Preview */}
                            <div className="space-y-6">

                                {/* Multimedia Card */}
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                            {t('sceneEditor.multimediaTitle')}
                                        </h3>
                                        <span className="text-[10px] text-muted-foreground">
                                            {layoutOrientation === 'vertical' ? t('sceneEditor.suggestedResVertical') : t('sceneEditor.suggestedResHorizontal')}
                                        </span>
                                    </div>

                                    {/* Image Preview Area */}
                                    <div className="relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden border border-border group mb-6">
                                        <style>{OVERLAY_CSS}</style>

                                        {localScene.image ? (
                                            <>
                                                <img src={localScene.image} alt={localScene.name} className="w-full h-full object-cover" />

                                                {/* Overlay Layer - Rendered AFTER image for correct layering */}
                                                <div className={`scene-overlay ${localScene.overlayEffect ? 'overlay-' + localScene.overlayEffect : ''}`} style={{ zIndex: 10 }}></div>
                                                {localScene.overlayEffect === 'rain' && <RainOverlay />}
                                                {localScene.overlayEffect === 'blur' && <BlurOverlay />}
                                                {localScene.overlayEffect === 'chromatic' && <ChromaticOverlay />}
                                                {localScene.overlayEffect === 'tv' && <TVOverlay />}
                                                {localScene.overlayEffect === 'confetti' && <ConfettiOverlay />}
                                                {localScene.overlayEffect === 'glitch' && <GlitchOverlay />}
                                                {localScene.overlayEffect === 'nosferatu' && <NosferatuOverlay />}
                                                {localScene.overlayEffect === 'wiggle' && <WiggleOverlay />}
                                                {localScene.overlayEffect === 'fog' && (
                                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none' }}>
                                                        <FogOverlay />
                                                    </div>
                                                )}

                                                {/* Hover buttons - highest z-index */}
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 gap-4 backdrop-blur-sm" style={{ zIndex: 20 }}>
                                                    <label htmlFor="image-upload-input" className="flex flex-col items-center gap-2 cursor-pointer text-white hover:text-primary transition-colors">
                                                        <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                                                            <Upload className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">{t('sceneEditor.changeBtn')}</span>
                                                        <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                    </label>
                                                    <button onClick={() => updateLocalScene('image', '')} className="flex flex-col items-center gap-2 text-white hover:text-red-400 transition-colors">
                                                        <div className="p-2 bg-white/10 rounded-full hover:bg-red-500/20 transition-all">
                                                            <Trash2 className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">{t('sceneEditor.removeBtn')}</span>
                                                    </button>
                                                </div>

                                            </>
                                        ) : (
                                            <label htmlFor="image-upload-input" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/5 transition-colors group">
                                                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-primary/50 transition-all">
                                                    <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                                </div>
                                                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{t('sceneEditor.loadImage')}</span>
                                                <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                        )}
                                    </div>

                                    {/* Overlay Effect Section */}
                                    <div className="space-y-2 mb-4">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                            {t('sceneEditor.overlayLabel')}
                                        </label>
                                        <select
                                            value={localScene.overlayEffect || ''}
                                            onChange={(e) => updateLocalScene('overlayEffect', e.target.value)}
                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary transition-all [&>option]:bg-card"
                                        >
                                            <option value="">{t('sceneEditor.effects.none')}</option>
                                            <option value="grain">{t('sceneEditor.effects.grain')}</option>
                                            <option value="rain">{t('sceneEditor.effects.rain')}</option>
                                            <option value="blur">{t('sceneEditor.effects.blur')}</option>
                                            <option value="chromatic">{t('sceneEditor.effects.chromatic')}</option>
                                            <option value="tv">{t('sceneEditor.effects.tv')}</option>
                                            <option value="confetti">{t('sceneEditor.effects.confetti')}</option>
                                            <option value="glitch">{t('sceneEditor.effects.glitch')}</option>
                                            <option value="nosferatu">{t('sceneEditor.effects.nosferatu')}</option>
                                            <option value="wiggle">{t('sceneEditor.effects.wiggle')}</option>
                                            <option value="fog">{t('sceneEditor.effects.fog')}</option>
                                        </select>
                                    </div>

                                    {/* Audio Section */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('sceneEditor.audioLabel')}</label>
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 border border-dashed border-input rounded-lg hover:border-primary/50 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                                                <Music className={`w-4 h-4 ${localScene.backgroundMusic ? 'text-primary' : 'text-muted-foreground'} `} />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                {localScene.backgroundMusic ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-foreground truncate">{t('sceneEditor.customAudioSet')}</span>
                                                        <span className="text-[10px] text-green-500">{t('sceneEditor.audioLoaded')}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-muted-foreground italic">{t('sceneEditor.noAudio')}</span>
                                                        <span className="text-[9px] text-muted-foreground/60">{t('sceneEditor.leaveEmptyAudio')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0">
                                                {localScene.backgroundMusic ? (
                                                    <button onClick={() => updateLocalScene('backgroundMusic', undefined)} className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded transition-all" title={t('sceneEditor.removeBtn')}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <label htmlFor="music-upload" className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer transition-colors border border-primary">
                                                        {t('sceneEditor.loadBtn')}
                                                        <input id="music-upload" type="file" accept="audio/*" onChange={handleMusicUpload} className="hidden" />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Narrative Rules Card - Renamed to Chance Rules */}
                                {(enableChances || gameSystemEnabled === 'chances') && (
                                    <div className="bg-card border border-border rounded-xl p-6">
                                        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                                            <Scroll className="w-4 h-4 text-muted-foreground" />
                                            {t('sceneEditor.chancesTitle')}
                                        </h3>
                                        <div className="space-y-3">
                                            {/* Chance Removal */}
                                            <label className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${localScene.removesChanceOnEntry ? 'bg-red-500/5 border-red-500/30' : 'bg-transparent border-muted-foreground/20 hover:bg-muted/10'} `}>
                                                <div className="relative flex items-center mt-0.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!localScene.removesChanceOnEntry}
                                                        onChange={e => handleToggle('removesChanceOnEntry', e.target.checked)}
                                                        className="custom-checkbox"
                                                        disabled={isAnyCheckboxChecked && !localScene.removesChanceOnEntry}
                                                    />
                                                </div>
                                                <div>
                                                    <span className={`block text-xs font-bold ${localScene.removesChanceOnEntry ? 'text-red-500' : 'text-muted-foreground group-hover:text-foreground'} `}>{t('sceneEditor.removesChance')}</span>
                                                    <span className="block text-[10px] text-muted-foreground mt-0.5">{t('sceneEditor.removesChanceDesc')}</span>
                                                </div>
                                            </label>

                                            {/* Chance Restoration */}
                                            <label className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${localScene.restoresChanceOnEntry ? 'bg-green-500/5 border-green-500/30' : 'bg-transparent border-muted-foreground/20 hover:bg-muted/10'} `}>
                                                <div className="relative flex items-center mt-0.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!localScene.restoresChanceOnEntry}
                                                        onChange={e => handleToggle('restoresChanceOnEntry', e.target.checked)}
                                                        className="custom-checkbox"
                                                        disabled={isAnyCheckboxChecked && !localScene.restoresChanceOnEntry}
                                                    />
                                                </div>
                                                <div>
                                                    <span className={`block text-xs font-bold ${localScene.restoresChanceOnEntry ? 'text-green-500' : 'text-muted-foreground group-hover:text-foreground'} `}>{t('sceneEditor.restoresChance')}</span>
                                                    <span className="block text-[10px] text-muted-foreground mt-0.5">{t('sceneEditor.restoresChanceDesc')}</span>
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
                        <div className="flex h-[600px] border border-border rounded-xl overflow-hidden bg-card">
                            {/* LEFT LIST PANEL */}
                            <div className="w-1/3 min-w-[250px] border-r border-border flex flex-col bg-muted/10">
                                <div className="p-4 border-b border-muted-foreground/10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                                            {t('sceneEditor.choicesCount', { count: localScene.choices?.length || 0 })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                    {(localScene.choices || []).length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p className="text-xs italic">{t('sceneEditor.noChoices')}</p>
                                        </div>
                                    ) : (
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        (localScene.choices || []).map((choice, index) => (
                                            <button
                                                key={choice.id}
                                                onClick={() => setSelectedChoiceId(choice.id)}
                                                className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all text-left ${selectedChoiceId === choice.id ? 'bg-primary/10 border-primary/40' : 'bg-transparent border-transparent hover:bg-accent hover:border-accent'} `}
                                            >
                                                <div className="w-8 h-8 rounded bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                                                    <ArrowRight className={`w-4 h-4 ${selectedChoiceId === choice.id ? 'text-primary' : 'text-muted-foreground'} `} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className={`text-xs font-bold truncate ${selectedChoiceId === choice.id ? 'text-primary' : 'text-foreground'} `}>
                                                        {choice.label || t('sceneEditor.newChoice')}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-mono truncate">
                                                        {choice.targetSceneId ? `-> ${allScenes.find(s => s.id === choice.targetSceneId)?.name || choice.targetSceneId} ` : t('sceneEditor.noDestination')}
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div className="p-3 border-t border-border bg-muted/30">
                                    <button
                                        onClick={() => {
                                            const newId = `choice_${Date.now()} `;
                                            const newChoice: Choice = {
                                                id: newId,
                                                label: t('sceneEditor.newChoice'),
                                                targetSceneId: ''
                                            };
                                            updateLocalScene('choices', [...(localScene.choices || []), newChoice]);
                                            setSelectedChoiceId(newId);
                                        }}
                                        className="w-full py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg text-xs flex items-center justify-center transition-colors shadow-none"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-2" />
                                        {t('sceneEditor.createChoiceBtn')}
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT DETAIL PANEL */}
                            <div className="flex-1 flex flex-col bg-background/50 min-w-0">
                                {selectedChoiceId && localScene.choices?.find(c => c.id === selectedChoiceId) ? (
                                    (() => {
                                        const choiceIndex = localScene.choices!.findIndex(c => c.id === selectedChoiceId);
                                        const choice = localScene.choices![choiceIndex];
                                        return (
                                            <div className="flex flex-col h-full">
                                                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/50">
                                                    <div className="flex items-center gap-2">
                                                        <ArrowRight className="w-4 h-4 text-purple-500" />
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{t('sceneEditor.choiceDetails')}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(t('sceneEditor.removeChoiceConfirm'))) {
                                                                const newChoices = localScene.choices!.filter(c => c.id !== selectedChoiceId);
                                                                updateLocalScene('choices', newChoices);
                                                                setSelectedChoiceId(null);
                                                            }
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-md text-[10px] font-bold uppercase transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        {t('sceneEditor.removeBtn')}
                                                    </button>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-6">
                                                    <div className="max-w-2xl mx-auto space-y-6">
                                                        <div className="space-y-1.5">
                                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('sceneEditor.buttonTextChoiceLabel')}</label>
                                                            <input
                                                                type="text"
                                                                value={choice.label}
                                                                onChange={(e) => {
                                                                    const newChoices = [...localScene.choices!];
                                                                    newChoices[choiceIndex] = { ...choice, label: e.target.value };
                                                                    updateLocalScene('choices', newChoices);
                                                                }}
                                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary"
                                                                placeholder={t('sceneEditor.buttonTextChoicePlaceholder')}
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('sceneEditor.targetSceneChoiceLabel')}</label>
                                                            <div className="relative">
                                                                <select
                                                                    value={choice.targetSceneId}
                                                                    onChange={(e) => {
                                                                        const newChoices = [...localScene.choices!];
                                                                        newChoices[choiceIndex] = { ...choice, targetSceneId: e.target.value };
                                                                        updateLocalScene('choices', newChoices);
                                                                    }}
                                                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground pr-8 appearance-none focus:ring-1 focus:ring-primary [&>option]:bg-card"
                                                                >
                                                                    <option value="">{t('sceneEditor.selectPlaceholder')}</option>
                                                                    {allScenes.map(s => (
                                                                        <option key={s.id} value={s.id}>
                                                                            {s.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <ArrowRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                            </div>
                                                            <p className="text-[10px] text-muted-foreground mt-1">{t('sceneEditor.targetSceneChoiceDesc')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                                        <ArrowRight className="w-12 h-12 mb-4 opacity-20" />
                                        <h4 className="text-sm font-bold text-muted-foreground mb-1">{t('sceneEditor.noChoiceSelected')}</h4>
                                        <p className="text-xs max-w-xs opacity-60">{t('sceneEditor.noChoiceSelectedDesc')}</p>
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

SceneEditor.displayName = 'SceneEditor';

export default SceneEditor;
