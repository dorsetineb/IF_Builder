import React, { useState, DragEvent, useMemo, useEffect } from 'react';
import { GameObject } from '../types';
import { Plus, Trash2, Upload, Search, Link as LinkIcon, Unlink, Box, Activity, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
];

interface ObjectEditorProps {
    sceneId: string;
    objects: GameObject[]; // The objects currently linked to this scene
    allGlobalObjects: GameObject[]; // All available objects
    onCreateGlobalObject: (obj: GameObject, linkToSceneId: string) => void;
    onLinkObject: (sceneId: string, objectId: string) => void;
    onUnlinkObject: (sceneId: string, objectId: string) => void;
    onUpdateGlobalObject: (objectId: string, updatedData: Partial<GameObject>) => void;
}

const generateUniqueId = (prefix: 'obj', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 5)}`;
    } while (existingIds.includes(id));
    return id;
};

const ObjectEditor: React.FC<ObjectEditorProps> = ({
    sceneId,
    objects,
    allGlobalObjects,
    onCreateGlobalObject,
    onLinkObject,
    onUnlinkObject,
    onUpdateGlobalObject
}) => {
    const { t } = useTranslation();
    const [selectedObjectId, setSelectedObjectId] = useState<string | null>(objects.length > 0 ? objects[0].id : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLinkMode, setIsLinkMode] = useState(false); // Toggle between "My Objects" and "Link Existing"
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    useEffect(() => {
        setIsIconPickerOpen(false);
    }, [selectedObjectId]);

    const handleCreateNewObject = () => {
        const allIds = allGlobalObjects.map(o => o.id);
        const newObject: GameObject = {
            id: generateUniqueId('obj', allIds),
            name: t('objectEditor.newObject'),
            examineDescription: t('objectEditor.newObjectDesc'),
        };
        onCreateGlobalObject(newObject, sceneId);
        setSelectedObjectId(newObject.id);
        setIsLinkMode(false);
    };

    const handleLinkExistingObject = (objectId: string) => {
        onLinkObject(sceneId, objectId);
        setSelectedObjectId(objectId);
        setIsLinkMode(false);
    };

    // Filtered lists
    const filteredSceneObjects = useMemo(() => {
        return objects.filter(obj =>
            obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obj.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [objects, searchTerm]);

    const availableObjectsToLink = useMemo(() => {
        return allGlobalObjects.filter(gObj =>
            !objects.some(linked => linked.id === gObj.id) &&
            (gObj.name.toLowerCase().includes(searchTerm.toLowerCase()) || gObj.id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [allGlobalObjects, objects, searchTerm]);

    const selectedObject = useMemo(() =>
        objects.find(o => o.id === selectedObjectId) || allGlobalObjects.find(o => o.id === selectedObjectId),
        [objects, allGlobalObjects, selectedObjectId]);

    // Check if selected object is actually linked to current scene
    const isSelectedObjectLinked = useMemo(() =>
        selectedObjectId && objects.some(o => o.id === selectedObjectId),
        [objects, selectedObjectId]);


    // Image Upload Logic for Selected Object
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && selectedObjectId) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    onUpdateGlobalObject(selectedObjectId, { image: event.target.result });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="flex h-[600px] border border-muted-foreground/20 rounded-xl overflow-hidden bg-card shadow-sm" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* LEFT SIDEBAR */}
            <div className="w-1/3 min-w-[250px] border-r border-muted-foreground/20 flex flex-col bg-zinc-950/30">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-muted-foreground/10 space-y-4">
                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <button
                            onClick={() => setIsLinkMode(false)}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${!isLinkMode ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {t('objectEditor.currentScene', { count: objects.length })}
                        </button>
                        <button
                            onClick={() => setIsLinkMode(true)}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${isLinkMode ? 'bg-purple-900/40 text-purple-300 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {t('objectEditor.link', { count: availableObjectsToLink.length })}
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={t('objectEditor.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* Object List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {!isLinkMode ? (
                        /* CURRENT SCENE OBJECTS */
                        filteredSceneObjects.length > 0 ? (
                            filteredSceneObjects.map(obj => {
                                const IconComponent = TRACKER_ICONS.find(i => i.name === obj.icon)?.component || Box;
                                return (
                                    <button
                                        key={obj.id}
                                        onClick={() => setSelectedObjectId(obj.id)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all text-left ${selectedObjectId === obj.id ? 'bg-purple-500/10 border-purple-500/40' : 'bg-transparent border-transparent hover:bg-zinc-900 hover:border-zinc-800'}`}
                                    >
                                        <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                                            {obj.image ? (
                                                <img src={obj.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <IconComponent className="w-4 h-4 text-zinc-600" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className={`text-xs font-bold truncate ${selectedObjectId === obj.id ? 'text-purple-300' : 'text-zinc-300'}`}>{obj.name}</div>
                                            <div className="text-[10px] text-zinc-500 font-mono truncate">#{obj.id}</div>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-xs italic">{t('objectEditor.noObjects')}</p>
                            </div>
                        )
                    ) : (
                        /* AVAILABLE TO LINK OBJECTS */
                        availableObjectsToLink.length > 0 ? (
                            availableObjectsToLink.map(obj => {
                                const IconComponent = TRACKER_ICONS.find(i => i.name === obj.icon)?.component || Box;
                                return (
                                    <div
                                        key={obj.id}
                                        className="w-full flex items-center justify-between gap-2 p-2 rounded-lg border border-dashed border-zinc-800 hover:bg-zinc-900 transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-3 min-w-0" onClick={() => setSelectedObjectId(obj.id)}>
                                            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 opacity-50">
                                                {obj.image ? (
                                                    <img src={obj.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <IconComponent className="w-3 h-3 text-zinc-600" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-medium text-zinc-400 truncate">{obj.name}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleLinkExistingObject(obj.id)}
                                            className="p-1.5 bg-purple-900/30 text-purple-400 rounded hover:bg-purple-600 hover:text-white transition-colors"
                                            title={t('objectEditor.linkNow')}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-xs italic">{t('objectEditor.allLinked')}</p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer Actions */}
                {!isLinkMode && (
                    <div className="p-3 border-t border-muted-foreground/10 bg-zinc-900/50">
                        <button
                            onClick={handleCreateNewObject}
                            className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-lg text-xs flex items-center justify-center transition-colors shadow"
                        >
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            {t('objectEditor.create')}
                        </button>
                    </div>
                )}
            </div>

            {/* RIGHT MAIN PANEL */}
            <div className="flex-1 flex flex-col bg-zinc-950/10 min-w-0">
                {selectedObject ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-muted-foreground/10 flex justify-between items-center bg-zinc-900/30">
                            <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-purple-500" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{t('objectEditor.properties')}</span>
                            </div>

                            {/* Context Actions */}
                            <div className="flex items-center gap-2">
                                {isSelectedObjectLinked ? (
                                    <button
                                        onClick={() => {
                                            if (window.confirm(t('objectEditor.confirmUnlink'))) {
                                                onUnlinkObject(sceneId, selectedObject.id);
                                                setSelectedObjectId(null);
                                            }
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-md text-[10px] font-bold uppercase transition-all"
                                    >
                                        <Unlink className="w-3.5 h-3.5" />
                                        {t('objectEditor.unlink')}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleLinkExistingObject(selectedObject.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white hover:bg-purple-700 rounded-md text-[10px] font-bold uppercase transition-all shadow-lg shadow-purple-900/20"
                                    >
                                        <LinkIcon className="w-3.5 h-3.5" />
                                        {t('objectEditor.linkNow')}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-2xl mx-auto space-y-10">
                                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                                    {/* Basic Info */}
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.name')}</label>
                                        <div className="flex gap-2">
                                            {/* Icon Picker */}
                                            <div className="relative group shrink-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsIconPickerOpen(!isIconPickerOpen);
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-purple-500/50 transition-all"
                                                >
                                                    {(() => {
                                                        const Icon = TRACKER_ICONS.find(i => i.name === selectedObject.icon)?.component || Box;
                                                        return <Icon className="w-5 h-5" />;
                                                    })()}
                                                </button>
                                                {isIconPickerOpen && (
                                                    <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                        {TRACKER_ICONS.map(icon => (
                                                            <button
                                                                key={icon.name}
                                                                onClick={() => { onUpdateGlobalObject(selectedObject.id, { icon: icon.name }); setIsIconPickerOpen(false); }}
                                                                className={`p-2 rounded hover:bg-zinc-800 flex items-center justify-center transition-colors ${selectedObject.icon === icon.name ? 'bg-purple-500/20 text-purple-400' : 'text-zinc-500'}`}
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
                                                onChange={(e) => onUpdateGlobalObject(selectedObject.id, { name: e.target.value })}
                                                className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500/50"
                                            />
                                        </div>
                                    </div>                                    <div className="col-span-1 space-y-1.5">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.id')}</label>
                                        <input
                                            type="text"
                                            value={selectedObject.id}
                                            readOnly
                                            className="w-full bg-zinc-950/50 border border-muted-foreground/20 rounded-lg px-3 py-2 text-xs text-zinc-500 font-mono cursor-not-allowed h-[38px]"
                                            title={t('objectEditor.idHelp')}
                                        />
                                    </div>

                                    {/* Description field */}
                                    <div className="col-span-2 space-y-1.5 flex flex-col">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.description')}</label>
                                        <textarea
                                            rows={6}
                                            value={selectedObject.examineDescription}
                                            onChange={(e) => onUpdateGlobalObject(selectedObject.id, { examineDescription: e.target.value })}
                                            className="w-full bg-zinc-950 border border-muted-foreground/30 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:ring-1 focus:ring-purple-500/50 resize-none flex-1 min-h-[150px]"
                                            placeholder={t('objectEditor.descriptionPlaceholder')}
                                        />
                                    </div>

                                    {/* Image Preview & Upload */}
                                    <div className="col-span-1 space-y-1.5">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.image')}</label>
                                        <div className="relative w-full aspect-square bg-zinc-950 rounded-lg overflow-hidden border border-muted-foreground/30 group">
                                            {selectedObject.image ? (
                                                <>
                                                    <img src={selectedObject.image} alt={selectedObject.name} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-2">
                                                        <label className="p-2 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 text-white transition-all">
                                                            <Upload className="w-4 h-4" />
                                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                        </label>
                                                        <button onClick={() => onUpdateGlobalObject(selectedObject.id, { image: '' })} className="p-2 bg-red-500/20 rounded-full cursor-pointer hover:bg-red-500/40 text-red-400 transition-all">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900 transition-colors">
                                                    <Upload className="w-6 h-6 text-zinc-700 mb-2" />
                                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{t('objectEditor.upload')}</span>
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-600 text-center mt-6 italic">{t('objectEditor.footer')}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <Box className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-sm font-bold text-zinc-400 mb-1">{t('objectEditor.noSelection')}</h4>
                        <p className="text-xs max-w-xs opacity-60">{t('objectEditor.noSelectionHelp')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObjectEditor;
