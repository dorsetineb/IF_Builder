import React, { useState, useMemo, useEffect } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import ImageUploadField from './ui/ImageUploadField';
import { GameObject } from '../types';
import { Plus, Trash2, Upload, Search, Link as LinkIcon, Unlink, Box, MousePointer2, Activity, Heart, Zap, Shield, Coins, Clock, Skull, Star, User, Trophy, AlertTriangle, Book, Crown, Flame, Droplet, Sun, Moon, ImageIcon, Sword, Key, Map as MapIcon, Eye, FlaskConical } from 'lucide-react';
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
    { name: 'sword', component: Sword },
    { name: 'key', component: Key },
    { name: 'map', component: MapIcon },
    { name: 'eye', component: Eye },
    { name: 'flask', component: FlaskConical },
];

const OBJECT_ICONS = [
    { name: 'box', component: Box },
    { name: 'mouse', component: MousePointer2 },
    ...TRACKER_ICONS
];

interface ObjectEditorProps {
    sceneId: string;
    objects: GameObject[]; // The objects currently linked to this scene
    allGlobalObjects: GameObject[]; // All available objects
    onCreateGlobalObject: (obj: GameObject, linkToSceneId: string) => void;
    onLinkObject: (sceneId: string, objectId: string) => void;
    onUnlinkObject: (sceneId: string, objectId: string) => void;
    onUpdateGlobalObject: (objectId: string, updatedData: Partial<GameObject>) => void;
    isSidePanel?: boolean;
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
    onUpdateGlobalObject,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSidePanel
}) => {
    const [selectedObjectId, setSelectedObjectId] = useState<string | null>(objects.length > 0 ? objects[0].id : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLinkMode, setIsLinkMode] = useState(false); // Toggle between "My Objects" and "Link Existing"
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [unlinkModal, setUnlinkModal] = useState<{ isOpen: boolean; objectId: string | null }>({ isOpen: false, objectId: null });
    const { t } = useTranslation();

    useEffect(() => {
        setIsIconPickerOpen(false);
    }, [selectedObjectId]);

    const handleCreateNewObject = () => {
        const allIds = allGlobalObjects.map(o => o.id);
        const objectCount = allIds.length + 1;
        const newObject: GameObject = {
            id: generateUniqueId('obj', allIds),
            name: `${t('objectEditor.newObject', 'Novo Objeto ')}#${objectCount}`,
            examineDescription: t('objectEditor.newObjectDesc', 'Descrição do novo objeto.'),
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

    return (
        <div className="flex flex-1 h-full overflow-hidden" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* LEFT SIDEBAR */}
            <div className="w-1/3 min-w-[250px] flex flex-col bg-muted-foreground/20 border-r border-primary/20">
                {/* Sidebar Header */}
                <div className="px-3 pt-3 pb-3 space-y-3">
                    {/* Warning */}
                    <p className="text-[9px] text-yellow-500/80 italic leading-tight">
                        * {t('sceneEditor.objectWarning')}
                    </p>
                    <div className="flex bg-muted rounded-lg p-1 border border-muted-foreground/50">
                        <button
                            onClick={() => setIsLinkMode(false)}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${!isLinkMode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t('objectEditor.inThisScene', 'Nesta Ramificação ({{count}})', { count: objects.length })}
                        </button>
                        <button
                            onClick={() => setIsLinkMode(true)}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${isLinkMode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t('objectEditor.linkOptions', 'Vincular ({{count}})', { count: availableObjectsToLink.length })}
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70 pointer-events-none" />
                        <input
                            type="text"
                            placeholder={t('objectEditor.searchPlaceholder', 'Buscar objetos...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-[42px] bg-background/50 text-foreground placeholder-muted-foreground border border-primary/60 hover:border-primary/90 focus:border-primary focus:bg-background shadow-sm transition-colors"
                        />
                    </div>

                    {/* Create Object Button (Fixed at top) */}
                    {!isLinkMode && (
                        <button
                            onClick={handleCreateNewObject}
                            className="w-full flex items-center justify-start px-3 h-[42px] bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-bold transition-all active:scale-[0.98] shadow-sm flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('objectEditor.createNewBtn', 'Criar Objeto')}
                        </button>
                    )}
                </div>

                {/* Object List */}
                <div className="flex-1 overflow-y-auto min-h-0 pt-0 pb-8 pr-0 flex flex-col items-stretch relative">
                    {!isLinkMode ? (
                        /* CURRENT SCENE OBJECTS */
                        <>
                            {filteredSceneObjects.length > 0 && (
                                filteredSceneObjects.map(obj => {
                                    const IconComponent = OBJECT_ICONS.find(i => i.name === obj.icon)?.component || Box;
                                    return (
                                        <button
                                            key={obj.id}
                                            onClick={() => setSelectedObjectId(obj.id)}
                                            className={`relative overflow-hidden flex items-center gap-3 h-[42px] px-3 border-transparent transition-all text-left group flex-shrink-0 ${selectedObjectId === obj.id ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'text-foreground hover:bg-primary/10 hover:shadow-sm'}`}
                                        >
                                            <div className={`w-7 h-7 rounded border flex items-center justify-center overflow-hidden shrink-0 ${selectedObjectId === obj.id ? 'bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground' : 'bg-muted border-muted-foreground/50 text-muted-foreground'}`}>
                                                {obj.image ? (
                                                    <img src={obj.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <IconComponent className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className={`text-xs font-bold truncate ${selectedObjectId === obj.id ? 'text-primary-foreground' : 'text-foreground'}`}>{obj.name}</div>
                                                <div className={`text-[10px] font-mono truncate ${selectedObjectId === obj.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>#{obj.id}</div>
                                            </div>
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUnlinkModal({ isOpen: true, objectId: obj.id });
                                                }}
                                                className={`absolute top-0 right-0 h-full w-12 flex items-center justify-center text-white transform translate-x-[calc(100%+2px)] group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20 cursor-pointer bg-red-500`}
                                                title={t('objectEditor.unlinkBtn', 'Desvincular')}
                                            >
                                                <Unlink className="w-5 h-5 pointer-events-none" />
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </>
                    ) : (
                        /* AVAILABLE TO LINK OBJECTS */
                        <>
                            {availableObjectsToLink.length > 0 && (
                                availableObjectsToLink.map(obj => {
                                    const IconComponent = OBJECT_ICONS.find(i => i.name === obj.icon)?.component || Box;
                                    return (
                                        <div
                                            key={obj.id}
                                            className="flex items-center justify-between gap-2 h-[42px] px-3 border-b border-dashed border-muted-foreground/30 hover:bg-accent transition-all text-left group flex-shrink-0"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => setSelectedObjectId(obj.id)}>
                                                <div className="w-7 h-7 rounded bg-muted border border-muted-foreground/50 flex items-center justify-center overflow-hidden shrink-0 opacity-50">
                                                    {obj.image ? (
                                                        <img src={obj.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-medium text-muted-foreground truncate">{obj.name}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleLinkExistingObject(obj.id)}
                                                className="p-1.5 bg-primary/10 text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                                                title={t('objectEditor.linkToSceneTooltip', 'Vincular à ramificação')}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* RIGHT MAIN PANEL */}
            <div className="flex-1 flex flex-col min-w-0">
                {selectedObject ? (
                    <div className="flex flex-col h-full">
                        {/* Link Action at Top (Optional) */}
                        {!isSelectedObjectLinked && (
                            <div className="px-6 pt-0 pb-0 flex justify-end shrink-0">
                                <button
                                    onClick={() => handleLinkExistingObject(selectedObject.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-[10px] font-bold uppercase transition-all shadow-sm"
                                >
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    {t('objectEditor.linkNowBtn', 'Vincular Agora')}
                                </button>
                            </div>
                        )}

                        {/* Edit Form */}
                        <div className="flex-1 overflow-y-auto pt-0 pb-6 px-6 relative">
                            {/* Soft top gradient */}
                            <div className="sticky top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent pointer-events-none z-10 -ml-6 -mr-6" />
                            <div className="max-w-xl mx-auto flex flex-col gap-6">
                                
                                {/* Basic Info Row */}
                                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                                    <div className="col-span-2 space-y-1.5">
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
                                                        const Icon = OBJECT_ICONS.find(i => i.name === selectedObject.icon)?.component || Box;
                                                        return <Icon className="w-5 h-5" />;
                                                    })()}
                                                </button>
                                                {isIconPickerOpen && (
                                                    <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-popover border border-muted-foreground/50 rounded-lg z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                        {OBJECT_ICONS.map(icon => (
                                                            <button
                                                                key={icon.name}
                                                                onClick={() => { onUpdateGlobalObject(selectedObject.id, { icon: icon.name }); setIsIconPickerOpen(false); }}
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
                                                onChange={(e) => onUpdateGlobalObject(selectedObject.id, { name: e.target.value })}
                                                className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 space-y-1.5">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.uniqueIdLabel', 'ID Único')}</label>
                                        <input
                                            type="text"
                                            value={selectedObject.id}
                                            readOnly
                                            className="w-full bg-muted/50 border border-input rounded-lg px-3 py-2 text-xs text-muted-foreground font-mono cursor-not-allowed h-[38px]"
                                            title={t('objectEditor.idTooltip', 'O ID é gerado automaticamente e não pode ser alterado.')}
                                        />
                                    </div>
                                </div>

                                {/* Description field */}
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.examineDescriptionLabel', 'Descrição ao Examinar')}</label>
                                    <textarea
                                        rows={6}
                                        value={selectedObject.examineDescription}
                                        onChange={(e) => onUpdateGlobalObject(selectedObject.id, { examineDescription: e.target.value })}
                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary resize-y min-h-[120px]"
                                        placeholder={t('objectEditor.examinePlaceholder', 'O que o jogador vê ao examinar este objeto?')}
                                    />
                                </div>

                                {/* Image Preview & Upload */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.objectImageLabel', 'Imagem do Objeto')}</label>
                                        <span className="text-[10px] text-muted-foreground">
                                            {t('globalObjectsEditor.suggestedRes', '300x300 sugerido')}
                                        </span>
                                    </div>
                                    
                                    <ImageUploadField
                                      value={selectedObject.image}
                                      onChange={(img) => onUpdateGlobalObject(selectedObject.id, { image: img })}
                                      className="relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden border border-muted-foreground/50 group"
                                      id="object-image-upload-input"
                                    />
                                    <p className="text-[10px] text-muted-foreground text-center mt-2 italic">
                                        {t('objectEditor.objectsHint', 'Esta imagem será exibida quando o usuário clicar no objeto a partir do Inventário.')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <Box className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-sm font-bold text-muted-foreground mb-1">{t('objectEditor.noObjectSelected', 'Nenhum objeto selecionado')}</h4>
                        <p className="text-xs max-w-xs opacity-60">{t('objectEditor.noObjectDesc', 'Selecione um objeto da lista ao lado para editar suas propriedades ou vincule um novo objeto à ramificação.')}</p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={unlinkModal.isOpen}
                title={t('objectEditor.unlinkTitle', 'Desvincular Objeto')}
                message={`${t('common.deleteConfirm', 'Tem certeza?')}\n\n${t('objectEditor.unlinkDesc', 'Isso removerá o objeto desta ramificação, mas ele ainda existirá no projeto.')}`}
                confirmText={t('objectEditor.unlinkBtn', 'Desvincular')}
                cancelText={t('common.cancel', 'Cancelar')}
                isDanger={true}
                onConfirm={() => {
                    if (unlinkModal.objectId) {
                        onUnlinkObject(sceneId, unlinkModal.objectId);
                        if (selectedObjectId === unlinkModal.objectId) setSelectedObjectId(null);
                    }
                    setUnlinkModal({ isOpen: false, objectId: null });
                }}
                onCancel={() => setUnlinkModal({ isOpen: false, objectId: null })}
            />
        </div>
    );
};

export default ObjectEditor;
