import React, { useState, useEffect, useMemo } from 'react';
import { GameData, GameObject, Scene } from '../types';
import { Plus, Trash2, Upload, Search, Box, Link, Activity, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon, Image as ImageIcon, Sword, Key, Map as MapIcon, Eye, FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ConfirmationModal } from './ConfirmationModal';

const TRACKER_ICONS = [
    { name: 'activity', component: Activity },
    { name: 'heart', component: Heart },
    { name: 'zap', component: Zap },
    { name: 'shield', component: Shield },
    { name: 'coins', component: Coins },
    { name: 'clock', component: Clock },
    { name: 'skull', component: Skull },
    { name: 'star', component: Star },
    { name: 'user', component: User },
    { name: 'trophy', component: Trophy },
    { name: 'alert', component: AlertTriangle },
    { name: 'book', component: Book },
    { name: 'crown', component: Crown },
    { name: 'flame', component: Flame },
    { name: 'droplet', component: Droplet },
    { name: 'sun', component: Sun },
    { name: 'moon', component: Moon },
    { name: 'sword', component: Sword },
    { name: 'key', component: Key },
    { name: 'map', component: MapIcon },
    { name: 'eye', component: Eye },
    { name: 'flask', component: FlaskConical },
];

interface GlobalObjectsEditorProps {
    scenes: GameData['scenes'];
    globalObjects: { [id: string]: GameObject };
    onUpdateObject: (objectId: string, updatedData: Partial<GameObject>) => void;
    onDeleteObject: (objectId: string) => void;
    onCreateObject: (obj: GameObject) => void;
    onSelectScene: (sceneId: string) => void;
    isDirty: boolean;
    onSetDirty: (isDirty: boolean) => void;
}

const generateUniqueId = (prefix: 'obj', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`;
    } while (existingIds.includes(id));
    return id;
};

const GlobalObjectsEditor: React.FC<GlobalObjectsEditorProps> = ({
    scenes,
    globalObjects,
    onUpdateObject,
    onDeleteObject,
    onCreateObject,
    onSelectScene,
    isDirty,
    onSetDirty,
}) => {
    const sortedObjects = useMemo(() => {
        return Object.values(globalObjects).sort((a: GameObject, b: GameObject) => a.name.localeCompare(b.name));
    }, [globalObjects]);

    const [localObjects, setLocalObjects] = useState<GameObject[]>(sortedObjects);
    const [selectedObjectId, setSelectedObjectId] = useState<string | null>(sortedObjects.length > 0 ? sortedObjects[0].id : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{ run: () => void } | null>(null);
    const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, objectId: string | null}>({isOpen: false, objectId: null});
    const { t } = useTranslation();

    const attemptAction = (action: () => void) => {
        if (isDirty) {
            setPendingAction({ run: action });
        } else {
            action();
        }
    };

    useEffect(() => {
        // Comparison to avoid unnecessary updates and infinite loops
        const areObjectsDifferent = localObjects.length !== sortedObjects.length || 
                                   localObjects.some((obj, index) => obj.id !== sortedObjects[index]?.id);

        if (areObjectsDifferent) {
            setLocalObjects(sortedObjects);

            // If selected object was deleted or doesn't exist, select first or null
            if (selectedObjectId && !sortedObjects.find(o => o.id === selectedObjectId)) {
                setSelectedObjectId(sortedObjects.length > 0 ? sortedObjects[0].id : null);
            } else if (!selectedObjectId && sortedObjects.length > 0) {
                setSelectedObjectId(sortedObjects[0].id);
            }
        }
    }, [sortedObjects]); // localObjects dependency removed to avoid cyclic dependency in effect logic, though strictly it's used in comparison

    useEffect(() => {
        setIsIconPickerOpen(false);
    }, [selectedObjectId]);

    // Comparison for dirty state - Optimized to avoid expensive JSON.stringify on large assets
    useEffect(() => {
        if (localObjects.length !== sortedObjects.length) {
            onSetDirty(true);
            return;
        }

        const isDifferent = localObjects.some((obj, index) => {
            const sorted = sortedObjects[index];
            return !sorted || 
                   obj.id !== sorted.id || 
                   obj.name !== sorted.name || 
                   obj.examineDescription !== sorted.examineDescription ||
                   obj.image !== sorted.image ||
                   obj.icon !== sorted.icon;
        });

        onSetDirty(isDifferent);
    }, [localObjects, sortedObjects, onSetDirty]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleObjectChange = (objectId: string, field: keyof GameObject, value: any) => {
        setLocalObjects(prev =>
            prev.map(obj =>
                obj.id === objectId ? { ...obj, [field]: value } : obj
            )
        );
    };

    const handleSave = () => {
        localObjects.forEach(localObj => {
            const originalObj = globalObjects[localObj.id];
            
            // Check if object is new or has changed
            const hasChanged = !originalObj || 
                localObj.name !== originalObj.name ||
                localObj.examineDescription !== originalObj.examineDescription ||
                localObj.image !== originalObj.image ||
                localObj.icon !== originalObj.icon;

            if (hasChanged) {
                onUpdateObject(localObj.id, {
                    name: localObj.name,
                    examineDescription: localObj.examineDescription,
                    image: localObj.image,
                    icon: localObj.icon,
                });
            }
        });
    };

    const handleUndo = () => {
        setLocalObjects(sortedObjects);
    };

    const handleCreate = () => {
        const allIds = Object.keys(globalObjects);
        const allLocalIds = localObjects.map(o => o.id);
        const combinedIds = Array.from(new Set([...allIds, ...allLocalIds]));

        const objectCount = combinedIds.length + 1;
        const newId = generateUniqueId('obj', combinedIds);
        const newObject: GameObject = {
            id: newId,
            name: `${t('objectEditor.newObject', 'Novo Objeto ')}#${objectCount}`,
            examineDescription: t('objectEditor.newObjectDesc', 'Descrição do novo objeto.'),
        };

        onCreateObject(newObject);
        setSelectedObjectId(newId);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteModal({ isOpen: true, objectId: id });
    };

    const confirmDelete = () => {
        if (deleteModal.objectId) {
            onDeleteObject(deleteModal.objectId);
            if (selectedObjectId === deleteModal.objectId) {
                setSelectedObjectId(null);
            }
        }
        setDeleteModal({ isOpen: false, objectId: null });
    };

    // Standardized deletion handler for Global Objects
    const handleDeleteObject = (id: string) => {
        const obj = globalObjects[id];
        if (!obj) return;

        setDeleteModal({ isOpen: true, objectId: id });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && selectedObjectId) {
            const file = e.target.files[0];
            import('../utils/imageOptimizer').then(({ compressImageToWebP }) => {
                compressImageToWebP(file)
                    .then((optimizedBase64) => {
                        handleObjectChange(selectedObjectId, 'image', optimizedBase64);
                    })
                    .catch((err) => {
                        console.error('Failed to compress image:', err);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            if (event.target && typeof event.target.result === 'string') {
                                handleObjectChange(selectedObjectId, 'image', event.target.result);
                            }
                        };
                        reader.readAsDataURL(file);
                    });
            });
        }
    };

    const filteredObjects = useMemo(() => {
        return localObjects.filter(obj =>
            obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obj.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [localObjects, searchTerm]);

    const selectedObject = useMemo(() =>
        localObjects.find(o => o.id === selectedObjectId),
        [localObjects, selectedObjectId]);

    const usages = useMemo(() => {
        if (!selectedObject) return [];
        const result: { id: string, name: string }[] = [];
        Object.values(scenes).forEach((scene: Scene) => {
            if (scene.objectIds && scene.objectIds.includes(selectedObject.id)) {
                result.push({ id: scene.id, name: scene.name });
            }
        });
        return result;
    }, [scenes, selectedObject]);

    return (
        <div className="flex w-full h-full overflow-hidden bg-background" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* LEFT SIDEBAR (Standardized Layout) */}
            <div className="w-72 flex-shrink-0 bg-muted-foreground/20 flex flex-col pt-4 pl-2 pr-0 pb-2 transition-all z-10 shadow-lg border-r border-primary/20">
                {/* Search Header */}
                <div className="relative mb-3 mt-0 pr-2 flex-shrink-0">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70 pointer-events-none" />
                    <input
                        type="text"
                        placeholder={t('globalObjectsEditor.searchPlaceholder', 'Buscar objetos globais...')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-[42px] bg-background/50 text-foreground placeholder-muted-foreground border border-primary/60 hover:border-primary/90 focus:border-primary focus:bg-background shadow-sm transition-colors"
                    />
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-3 mb-2">
                    <span>{t('globalObjectsEditor.objectList', 'Lista de Objetos')}</span>
                </div>

                {/* Object List */}
                <div className="flex-1 overflow-y-auto p-0 space-y-0 relative">
                    {filteredObjects.length > 0 && (
                        filteredObjects.map(obj => (
                            <div key={obj.id} className="w-full mb-1">
                                <div
                                    onClick={() => attemptAction(() => setSelectedObjectId(obj.id))}
                                    className={`group relative flex items-center transition-all overflow-hidden cursor-pointer w-full ${
                                        selectedObjectId === obj.id
                                            ? 'bg-primary text-primary-foreground shadow-md rounded-l-lg rounded-r-none'
                                            : 'text-foreground hover:bg-primary/10 hover:shadow-sm rounded-lg mr-2'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 p-3 w-full">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${selectedObjectId === obj.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-card border border-muted-foreground/50 text-muted-foreground group-hover:border-border/80'}`}>
                                            {obj.image ? (
                                                <img src={obj.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                (() => {
                                                    const IconComponent = TRACKER_ICONS.find(i => i.name === obj.icon)?.component || Box;
                                                    return <IconComponent className="w-4 h-4 shadow-sm" />;
                                                })()
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold truncate ${selectedObjectId === obj.id ? 'text-primary-foreground' : 'text-foreground'}`}>{obj.name}</p>
                                            <p className={`text-[10px] truncate mt-0.5 ${selectedObjectId === obj.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{obj.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            attemptAction(() => handleDeleteClick(obj.id));
                                        }}
                                        className={`absolute top-0 right-0 h-full w-12 flex items-center justify-center text-white transform translate-x-full group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20 cursor-pointer ${
                                            selectedObjectId === obj.id
                                                ? 'bg-red-500 rounded-none' // flush with right edge
                                                : 'bg-red-500 rounded-r-lg' // match the rounded-lg of container
                                        }`}
                                        title={t('globalObjectsEditor.deleteObjectTooltip', 'Excluir')}
                                    >
                                        <Trash2 className="w-5 h-5 pointer-events-none" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    <div className="pr-2 mt-2 pb-4">
                        <button
                            onClick={() => attemptAction(handleCreate)}
                            className="w-full flex items-center justify-start px-2 h-[42px] font-bold rounded-lg transition-all active:scale-95 text-xs bg-white text-zinc-950 hover:bg-zinc-200 mt-2 flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('objectEditor.createNewBtn', 'Criar Novo Objeto')}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN PANEL */}
            <div className="flex-1 overflow-y-auto relative bg-background px-4 pb-4">
                {/* Header with Save/Undo actions */}
                <div className="sticky top-0 z-40 bg-background flex flex-col pt-4 pb-4 gap-3 -mx-4 px-4 shadow-sm border-b border-muted-foreground/50">
                    {/* Solid background shield to perfectly hide scrolled content */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-background pointer-events-none" />
                    
                    <div className="flex justify-between items-center p-4 bg-card rounded-xl border border-muted-foreground/50 shadow-sm relative z-10">
                        <p className="text-muted-foreground text-xs font-medium">
                            {t('globalObjectsEditor.headerDesc', 'Gerenciador Global: Objetos criados aqui podem ser usados em qualquer ramificação.')}
                        </p>
                        <div className="flex items-center gap-3">
                            {isDirty && (
                                <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mr-2">
                                    {t('globalObjectsEditor.unsavedChanges', 'Alterações não salvas')}
                                </div>
                            )}
                            <button
                                onClick={handleUndo}
                                disabled={!isDirty}
                                className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                            >
                                {t('globalObjectsEditor.undoBtn', 'Desfazer')}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!isDirty}
                                className="px-4 py-1.5 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed shadow-sm"
                            >
                                {t('globalObjectsEditor.saveBtn', 'Salvar Alterações')}
                            </button>
                        </div>
                    </div>
                    <div className="absolute left-0 right-0 -bottom-2 h-2 bg-gradient-to-b from-background to-transparent pointer-events-none" />
                </div>

            <div className="mt-4">
                <div key={selectedObject?.id || 'empty'} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {selectedObject ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Details & Usages */}
                            <div className="space-y-6">
                                {/* Object Details Card */}
                                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                            <Box className="w-4 h-4" />
                                            {t('objectEditor.propertiesTitle', 'Propriedades do Objeto')}
                                        </h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-4 gap-4">
                                            {/* Name field */}
                                            <div className="col-span-3 space-y-1.5">
                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.objectNameLabel', 'Nome do Objeto')}</label>
                                                <div className="flex gap-2">
                                                    {/* Icon Picker */}
                                                    <div className="relative group shrink-0">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsIconPickerOpen(!isIconPickerOpen);
                                                            }}
                                                            className="w-10 h-10 flex items-center justify-center bg-input border border-input rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                                                        >
                                                            {(() => {
                                                                const Icon = TRACKER_ICONS.find(i => i.name === selectedObject.icon)?.component || Box;
                                                                return <Icon className="w-5 h-5" />;
                                                            })()}
                                                        </button>
                                                        {isIconPickerOpen && (
                                                            <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-popover border border-muted-foreground/50 rounded-lg z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                                {TRACKER_ICONS.map(icon => (
                                                                    <button
                                                                        key={icon.name}
                                                                        onClick={() => { handleObjectChange(selectedObject.id, 'icon', icon.name); setIsIconPickerOpen(false); }}
                                                                        className={`p-2 rounded hover:bg-accent flex items-center justify-center transition-colors ${selectedObject.icon === icon.name || (!selectedObject.icon && icon.name === 'box') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                                                                        title={icon.name}
                                                                    >
                                                                        <icon.component className="w-4 h-4" />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={selectedObject.name}
                                                        onChange={(e) => handleObjectChange(selectedObject.id, 'name', e.target.value)}
                                                        className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
                                                        placeholder={t('objectEditor.namePlaceholder', 'Nome do objeto')}
                                                    />
                                                </div>
                                            </div>

                                            {/* ID field */}
                                            <div className="col-span-1 space-y-1.5">
                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.uniqueIdLabel', 'ID Único')}</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={selectedObject.id}
                                                        readOnly
                                                        className="w-full bg-muted/50 border border-input rounded-lg px-3 py-2.5 text-xs text-muted-foreground font-mono cursor-not-allowed"
                                                        title={t('objectEditor.idTooltip', 'O ID é gerado automaticamente e não pode ser alterado.')}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 text-[10px]">#</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description field */}
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.examineDescriptionLabel', 'Descrição ao Examinar')}</label>
                                            <textarea
                                                rows={8}
                                                value={selectedObject.examineDescription}
                                                onChange={(e) => handleObjectChange(selectedObject.id, 'examineDescription', e.target.value)}
                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary resize-none min-h-[160px]"
                                                placeholder={t('objectEditor.examinePlaceholder', 'O que o jogador vê ao examinar este objeto?')}
                                            />
                                        </div>
                                    </div>

                                    {/* Action buttons (Delete) */}
                                    <div className="pt-6 flex justify-end">
                                        <button
                                            onClick={() => handleDeleteObject(selectedObject.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {t('globalObjectsEditor.deleteObjectTooltip', 'Excluir')}
                                        </button>
                                    </div>
                                </div>

                                {/* Usages Card */}
                                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                                    <h3 className="text-[10px] font-bold text-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                                        <Link className="w-4 h-4 opacity-70" />
                                        {t('globalObjectsEditor.usedInScenes', 'Usado nas ramificações')}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {usages.length > 0 ? (
                                            usages.map(u => (
                                                <button
                                                    key={u.id}
                                                    onClick={() => onSelectScene(u.id)}
                                                    className="px-3 py-2 bg-input border border-input rounded-md text-[10px] text-muted-foreground font-bold uppercase hover:bg-accent hover:text-primary hover:border-primary/30 transition-all flex items-center gap-1.5"
                                                >
                                                    <Box className="w-3 h-3 opacity-50" />
                                                    {u.name}
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-muted-foreground italic">{t('globalObjectsEditor.notUsedAnywhere', 'Este objeto ainda não foi adicionado a nenhuma ramificação.')}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Multimedia */}
                            <div className="space-y-6">
                                {/* Multimedia Card */}
                                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" />
                                            {t('sceneEditor.multimediaTitle')}
                                        </h3>
                                        <span className="text-[10px] text-muted-foreground">
                                            {t('globalObjectsEditor.suggestedRes', '300x300 sugerido')}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden border border-muted-foreground/50 group mb-6">
                                            {selectedObject.image ? (
                                                <>
                                                    <img src={selectedObject.image} alt={selectedObject.name} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 gap-4 backdrop-blur-sm" style={{ zIndex: 20 }}>
                                                        <label className="flex flex-col items-center gap-2 cursor-pointer text-white hover:text-primary transition-colors">
                                                            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                                                                <Upload className="w-5 h-5" />
                                                            </div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">{t('sceneEditor.changeBtn', 'Trocar')}</span>
                                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                        </label>
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); handleObjectChange(selectedObject.id, 'image', ''); }}
                                                            className="flex flex-col items-center gap-2 text-white hover:text-red-400 transition-colors"
                                                            title={t('common.delete', 'Excluir')}
                                                        >
                                                            <div className="p-2 bg-white/10 rounded-full hover:bg-red-500/20 transition-all">
                                                                <Trash2 className="w-5 h-5" />
                                                            </div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">{t('sceneEditor.removeBtn', 'Remover')}</span>
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/5 transition-colors group">
                                                    <div className="w-12 h-12 rounded-full bg-background border border-muted-foreground/50 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-primary/50 transition-all">
                                                        <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                                    </div>
                                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                                                        {t('sceneEditor.loadImage', 'Carregar Imagem')}
                                                    </span>
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic leading-relaxed text-center opacity-70 px-4 pt-2">
                                            {t('globalObjectsEditor.imageHint', 'Esta imagem aparece no pop-up de detalhes do objeto durante o jogo.')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center mt-20">
                            <Box className="w-12 h-12 mb-4 opacity-20" />
                            <h4 className="text-sm font-bold text-muted-foreground mb-1">{t('objectEditor.noObjectSelected', 'Selecione um objeto para editar')}</h4>
                        </div>
                    )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={pendingAction !== null}
                title={t('editor.unsavedChanges', 'Alterações não salvas')}
                message={t('editor.unsavedChangesMessage', 'O projeto tem alterações que não foram salvas.\nSe sair agora, elas serão perdidas.\n\nDeseja continuar?')}
                confirmText={t('editor.confirmLeave', 'Sair sem salvar')}
                cancelText={t('editor.cancelLeave', 'Cancelar')}
                isDanger={true}
                onConfirm={() => {
                    if (pendingAction) {
                        setLocalObjects(sortedObjects);
                        pendingAction.run();
                        setPendingAction(null);
                    }
                }}
                onCancel={() => setPendingAction(null)}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                title={t('globalObjectsEditor.deleteTitle', 'Excluir')}
                message={`${t('common.deleteConfirm', 'Tem certeza?')}\n\n${t('globalObjectsEditor.deleteDesc', 'Isso excluirá o objeto de todo o jogo.')}`}
                confirmText={t('common.delete', 'Excluir')}
                cancelText={t('common.cancel', 'Cancelar')}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, objectId: null })}
                isDanger={true}
            />
        </div>
    );
};

export default GlobalObjectsEditor;
