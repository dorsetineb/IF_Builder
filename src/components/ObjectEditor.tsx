import React, { useState, useMemo, useEffect } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
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
        const newObject: GameObject = {
            id: generateUniqueId('obj', allIds),
            name: t('objectEditor.newObject', 'Novo Objeto'),
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
        <div className="flex h-[calc(100vh-260px)] min-h-[450px] border border-muted-foreground/50 rounded-xl overflow-hidden bg-card shadow-sm" onClick={() => isIconPickerOpen && setIsIconPickerOpen(false)}>
            {/* LEFT SIDEBAR */}
            <div className="w-1/3 min-w-[250px] border-r border-muted-foreground/50 flex flex-col bg-muted/30">
                {/* Sidebar Header */}
                <div className="px-2 py-4 border-b border-muted-foreground/50 space-y-4">
                    <div className="flex bg-muted rounded-lg p-1 border border-muted-foreground/50">
                        <button
                            onClick={() => setIsLinkMode(false)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${!isLinkMode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t('objectEditor.inThisScene', 'Nesta Cena ({{count}})', { count: objects.length })}
                        </button>
                        <button
                            onClick={() => setIsLinkMode(true)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${isLinkMode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t('objectEditor.linkOptions', 'Vincular ({{count}})', { count: availableObjectsToLink.length })}
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={t('objectEditor.searchPlaceholder', 'Buscar objetos...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-[42px] bg-background/50 text-foreground placeholder-muted-foreground border border-primary/50 focus:border-primary focus:bg-background"
                        />
                    </div>
                </div>

                {/* Object List */}
                <div className="flex-1 overflow-y-auto pl-2 py-4 pr-0 space-y-0 flex flex-col items-stretch">
                    {!isLinkMode ? (
                        /* CURRENT SCENE OBJECTS */
                        <>
                            {filteredSceneObjects.length > 0 && (
                                filteredSceneObjects.map(obj => {
                                    const IconComponent = TRACKER_ICONS.find(i => i.name === obj.icon)?.component || Box;
                                    return (
                                        <button
                                            key={obj.id}
                                            onClick={() => setSelectedObjectId(obj.id)}
                                            className={`relative overflow-hidden flex items-center gap-3 h-[42px] px-2 rounded-lg border-transparent transition-all text-left group flex-shrink-0 ${selectedObjectId === obj.id ? 'bg-primary text-primary-foreground font-bold shadow-md rounded-r-none mr-0' : 'text-foreground hover:bg-primary/10 hover:shadow-sm mr-2'}`}
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
                                                className={`absolute top-0 right-0 h-full w-12 flex items-center justify-center text-white transform translate-x-[calc(100%+2px)] group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20 cursor-pointer ${
                                                    selectedObjectId === obj.id ? 'bg-red-500 rounded-none' : 'bg-red-500 rounded-r-lg'
                                                }`}
                                                title={t('objectEditor.unlinkBtn', 'Desvincular')}
                                            >
                                                <Unlink className="w-5 h-5 pointer-events-none" />
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                            <div className="pr-2 mt-2">
                                <button
                                    onClick={handleCreateNewObject}
                                    className="w-full h-[42px] bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm flex-shrink-0"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    {t('objectEditor.createNewBtn', 'Criar Novo Objeto')}
                                </button>
                            </div>
                        </>
                    ) : (
                        /* AVAILABLE TO LINK OBJECTS */
                        <>
                            {availableObjectsToLink.length > 0 && (
                                availableObjectsToLink.map(obj => {
                                    const IconComponent = TRACKER_ICONS.find(i => i.name === obj.icon)?.component || Box;
                                    return (
                                        <div
                                            key={obj.id}
                                            className="flex items-center justify-between gap-2 h-[42px] px-2 mr-2 rounded-lg border border-dashed border-muted-foreground/50 hover:bg-accent transition-all text-left group flex-shrink-0"
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
                                                title={t('objectEditor.linkToSceneTooltip', 'Vincular à cena')}
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
            <div className="flex-1 flex flex-col bg-background/50 min-w-0">
                {selectedObject ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-muted-foreground/50 flex justify-between items-center bg-muted/50 shrink-0">
                            <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{t('objectEditor.propertiesTitle', 'Propriedades do Objeto')}</span>
                            </div>

                            {/* Context Actions */}
                            <div className="flex items-center gap-2">
                                {!isSelectedObjectLinked && (
                                    <button
                                        onClick={() => handleLinkExistingObject(selectedObject.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-[10px] font-bold uppercase transition-all shadow-sm"
                                    >
                                        <LinkIcon className="w-3.5 h-3.5" />
                                        {t('objectEditor.linkNowBtn', 'Vincular Agora')}
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
                                                    <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-card border border-muted-foreground/50 rounded-lg shadow-xl z-20 grid grid-cols-6 gap-1 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                        {TRACKER_ICONS.map(icon => (
                                                            <button
                                                                key={icon.name}
                                                                onClick={() => { onUpdateGlobalObject(selectedObject.id, { icon: icon.name }); setIsIconPickerOpen(false); }}
                                                                className={`p-2 rounded hover:bg-accent flex items-center justify-center transition-colors ${selectedObject.icon === icon.name ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
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
                                    </div>                                    <div className="col-span-1 space-y-1.5">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.uniqueIdLabel', 'ID Único')}</label>
                                        <input
                                            type="text"
                                            value={selectedObject.id}
                                            readOnly
                                            className="w-full bg-muted/50 border border-input rounded-lg px-3 py-2 text-xs text-muted-foreground font-mono cursor-not-allowed h-[38px]"
                                            title={t('objectEditor.idTooltip', 'O ID é gerado automaticamente e não pode ser alterado.')}
                                        />
                                    </div>

                                    {/* Description field */}
                                    <div className="col-span-2 space-y-1.5 flex flex-col">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.examineDescriptionLabel', 'Descrição ao Examinar')}</label>
                                        <textarea
                                            rows={6}
                                            value={selectedObject.examineDescription}
                                            onChange={(e) => onUpdateGlobalObject(selectedObject.id, { examineDescription: e.target.value })}
                                            className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary resize-none flex-1 min-h-[150px]"
                                            placeholder={t('objectEditor.examinePlaceholder', 'O que o jogador vê ao examinar este objeto?')}
                                        />
                                    </div>

                                    {/* Image Preview & Upload */}
                                    <div className="col-span-1 space-y-1.5">
                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('objectEditor.objectImageLabel', 'Imagem do Objeto')}</label>
                                        <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden border border-input group">
                                            {selectedObject.image ? (
                                                <>
                                                    <img src={selectedObject.image} alt={selectedObject.name} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-2">
                                                        <label className="p-2 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 text-white transition-all">
                                                            <Upload className="w-4 h-4" />
                                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                        </label>
                                                        <button onClick={() => onUpdateGlobalObject(selectedObject.id, { image: '' })} className="p-2 bg-red-500/20 rounded-full cursor-pointer hover:bg-red-500/40 text-red-500 transition-all">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors">
                                                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t('objectEditor.uploadBtn', 'Carregar')}</span>
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground text-center mt-6 italic">{t('objectEditor.objectsHint', 'Objetos aparecem no inventário ou na lista de \'coisas aqui\'.')}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <Box className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-sm font-bold text-muted-foreground mb-1">{t('objectEditor.noObjectSelected', 'Nenhum objeto selecionado')}</h4>
                        <p className="text-xs max-w-xs opacity-60">{t('objectEditor.noObjectDesc', 'Selecione um objeto da lista ao lado para editar suas propriedades ou vincule um novo objeto à cena.')}</p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={unlinkModal.isOpen}
                title={t('objectEditor.unlinkTitle', 'Desvincular Objeto')}
                message={t('objectEditor.unlinkConfirm', 'Tem certeza? Isso removerá o objeto desta cena, mas ele ainda existirá no projeto.')}
                confirmText={t('common.confirm', 'Confirmar')}
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
