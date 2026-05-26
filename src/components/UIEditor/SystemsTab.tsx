import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Shuffle, Type, List, Image as ImageIcon, Heart, 
    Lightbulb, Package, Book, History as HistoryIcon,
    Star, Square, Circle, X, Activity, Settings, Upload, Trash2
} from 'lucide-react';
import { GameData } from '../../types';

// Helper component for the life icons
export const ChanceIcon: React.FC<{ type: any, color: string, className?: string }> = ({ type, color, className }) => {
    switch (type) {
        case 'heart': return <Heart className={className} style={{ fill: color, color }} />;
        case 'circle': return <Circle className={className} style={{ fill: color, color }} />;
        case 'square': return <Square className={className} style={{ fill: color, color }} />;
        case 'star': return <Star className={className} style={{ fill: color, color }} />;
        case 'cross': return <div className={`relative ${className} flex items-center justify-center`}><div className="absolute w-full h-[20%] bg-current" style={{ backgroundColor: color }} /><div className="absolute h-full w-[20%] bg-current" style={{ backgroundColor: color }} /></div>;
        default: return <Heart className={className} style={{ fill: color, color }} />;
    }
};

interface SystemsTabProps {
    localGameInteractionType: 'parser' | 'choice' | undefined;
    setLocalGameInteractionType: (val: 'parser' | 'choice') => void;
    localEnableImages: boolean;
    setLocalEnableImages: (val: boolean) => void;
    localImageTransitionType: GameData['gameImageTransitionType'];
    setLocalImageTransitionType: (val: GameData['gameImageTransitionType']) => void;
    localImageSpeed: number;
    setLocalImageSpeed: (val: number) => void;
    currentSliderColor: string;
    localEnableTextControl: boolean;
    setLocalEnableTextControl: (val: boolean) => void;
    localTextAnimationType: 'fade' | 'typewriter';
    setLocalTextAnimationType: (val: 'fade' | 'typewriter') => void;
    localTextReadingFlow: 'continuous' | 'paused';
    setLocalTextReadingFlow: (val: 'continuous' | 'paused') => void;
    localTextSpeed: number;
    setLocalTextSpeed: (val: number) => void;
    localEnableChances: boolean;
    setLocalEnableChances: (val: boolean) => void;
    localChanceIcon: any;
    setLocalChanceIcon: (val: any) => void;
    localChanceIconColor: string;
    setLocalChanceIconColor: (val: string) => void;
    localMaxChances: number;
    setLocalMaxChances: (val: number) => void;
    localEnableSuggestions: boolean;
    setLocalEnableSuggestions: (val: boolean) => void;
    localEnableInventory: boolean;
    setLocalEnableInventory: (val: boolean) => void;
    localEnableDiary: boolean;
    setLocalEnableDiary: (val: boolean) => void;
    localDiaryShowSceneImage: boolean;
    setLocalDiaryShowSceneImage: (val: boolean) => void;
    localDiaryShowPlayerAction: boolean;
    setLocalDiaryShowPlayerAction: (val: boolean) => void;
    localDiaryAllowExport: boolean;
    setLocalDiaryAllowExport: (val: boolean) => void;
    localEnableTrackers: boolean;
    setLocalEnableTrackers: (val: boolean) => void;
    localEnableRetrospective: boolean;
    setLocalEnableRetrospective: (val: boolean) => void;
    localEnableSystemMenu: boolean;
    setLocalEnableSystemMenu: (val: boolean) => void;
    localStartScreenBgImage: string;
    setLocalStartScreenBgImage: (val: string) => void;
    localShowStartScreenTitle: boolean;
    setLocalShowStartScreenTitle: (val: boolean) => void;
    localStartScreenTitle: string;
    setLocalStartScreenTitle: (val: string) => void;
    localMenuTransitionType: 'fade' | 'slide' | 'none';
    setLocalMenuTransitionType: (val: 'fade' | 'slide' | 'none') => void;
    localMenuTransitionSpeed: number;
    setLocalMenuTransitionSpeed: (val: number) => void;
    localMenuTransitionSound?: string;
    setLocalMenuTransitionSound?: (val: string | undefined) => void;
    localTitle: string;
    onNavigateToTrackers?: () => void;
}

export const SystemsTab: React.FC<SystemsTabProps> = ({
    localGameInteractionType,
    setLocalGameInteractionType,
    localEnableImages,
    setLocalEnableImages,
    localImageTransitionType,
    setLocalImageTransitionType,
    localImageSpeed,
    setLocalImageSpeed,
    currentSliderColor,
    localEnableTextControl,
    setLocalEnableTextControl,
    localTextAnimationType,
    setLocalTextAnimationType,
    localTextReadingFlow,
    setLocalTextReadingFlow,
    localTextSpeed,
    setLocalTextSpeed,
    localEnableChances,
    setLocalEnableChances,
    localChanceIcon,
    setLocalChanceIcon,
    localChanceIconColor,
    setLocalChanceIconColor,
    localMaxChances,
    setLocalMaxChances,
    localEnableSuggestions,
    setLocalEnableSuggestions,
    localEnableInventory,
    setLocalEnableInventory,
    localEnableDiary,
    setLocalEnableDiary,
    localDiaryShowSceneImage,
    setLocalDiaryShowSceneImage,
    localDiaryShowPlayerAction,
    setLocalDiaryShowPlayerAction,
    localDiaryAllowExport,
    setLocalDiaryAllowExport,
    localEnableTrackers,
    setLocalEnableTrackers,
    localEnableRetrospective,
    setLocalEnableRetrospective,
    localEnableSystemMenu,
    setLocalEnableSystemMenu,
    localStartScreenBgImage,
    setLocalStartScreenBgImage,
    localShowStartScreenTitle,
    setLocalShowStartScreenTitle,
    localStartScreenTitle,
    setLocalStartScreenTitle,
    localMenuTransitionType,
    setLocalMenuTransitionType,
    localMenuTransitionSpeed,
    setLocalMenuTransitionSpeed,
    localMenuTransitionSound,
    setLocalMenuTransitionSound,
    localTitle,
    onNavigateToTrackers
}) => {
    const { t } = useTranslation();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            import('../../utils/imageOptimizer').then(({ compressImageToWebP }) => {
                compressImageToWebP(file)
                    .then((optimizedBase64) => {
                        setLocalStartScreenBgImage(optimizedBase64);
                    })
                    .catch((err) => {
                        console.error('Failed to compress image:', err);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            if (event.target && typeof event.target.result === 'string') {
                                setLocalStartScreenBgImage(event.target.result);
                            }
                        };
                        reader.readAsDataURL(file);
                    });
            });
        }
        if (e.target) e.target.value = '';
    };

    const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setLocalMenuTransitionSound?.(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        if (e.target) e.target.value = '';
    };

    const handleRemoveImage = () => {
        setLocalStartScreenBgImage('');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* --- LEFT COLUMN --- */}
                    <div className="flex-1 w-full space-y-6">
                        {/* --- GAME STYLE --- */}
                        <div className={`w-full p-6 bg-card border-2 ${localGameInteractionType ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '0ms' }}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <Shuffle className="w-5 h-5" />
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.sistemas.gameStyle')}</h4>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.gameStyleDesc')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setLocalGameInteractionType('parser')}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${localGameInteractionType === 'parser' ? 'border-primary bg-primary/20 shadow-md opacity-100' : 'border-muted-foreground/50 bg-muted/30 hover:border-primary/30 opacity-50'}`}
                                >
                                    <div className={`p-3 rounded-lg transition-colors ${localGameInteractionType === 'parser' ? 'bg-primary text-white' : 'bg-background/40 text-muted-foreground'}`}>
                                        <Type className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className={`text-xs font-bold uppercase block transition-colors ${localGameInteractionType === 'parser' ? 'text-white' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.parser')}</span>
                                        <span className="text-[10px] text-muted-foreground mt-0.5 block">{t('UIEditor.sistemas.parserDesc')}</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        setLocalGameInteractionType('choice');
                                        setLocalEnableInventory(false);
                                    }}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${localGameInteractionType === 'choice' ? 'border-primary bg-primary/20 shadow-md opacity-100' : 'border-muted-foreground/50 bg-muted/30 hover:border-primary/30 opacity-50'}`}
                                >
                                    <div className={`p-3 rounded-lg transition-colors ${localGameInteractionType === 'choice' ? 'bg-primary text-white' : 'bg-background/40 text-muted-foreground'}`}>
                                        <List className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className={`text-xs font-bold uppercase block transition-colors ${localGameInteractionType === 'choice' ? 'text-white' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.choice')}</span>
                                        <span className="text-[10px] text-muted-foreground mt-0.5 block">{t('UIEditor.sistemas.choiceDesc')}</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* MENU PRINCIPAL E SAVES */}
                        <div className="w-full">
                            <div className={`w-full p-6 bg-card border-2 ${localEnableSystemMenu ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '100ms' }}>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <List className="w-5 h-5 animate-in fade-in zoom-in duration-300" />
                                        <div>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${localEnableSystemMenu ? 'text-foreground' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.startMenuTitle', 'Menu principal')}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.systemMenuDesc', 'Habilita o Menu Principal, salvamento manual e o botão/tecla ESC de sistema.')}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" checked={localEnableSystemMenu} onChange={(e) => setLocalEnableSystemMenu(e.target.checked)} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localEnableSystemMenu ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                                style={{ transform: localEnableSystemMenu ? 'translateX(16px)' : 'translateX(0)' }}
                                            ></div>
                                        </div>
                                    </label>
                                </div>

                                {localEnableSystemMenu && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {/* Linha 1: Título da ficção e o checkbox Exibir título */}
                                        <div className="flex flex-col sm:flex-row gap-6 items-end w-full">
                                            {/* Left Column: Título da ficção */}
                                            <div className="flex-1 w-full min-w-[200px] space-y-2">
                                                <label htmlFor="startScreenTitle" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {t('UIEditor.startScreen.titleText', 'Título da ficção')}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="startScreenTitle"
                                                    value={localStartScreenTitle}
                                                    onChange={(e) => setLocalStartScreenTitle(e.target.value)}
                                                    disabled={!localShowStartScreenTitle}
                                                    className={`w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all ${!localShowStartScreenTitle ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                    placeholder={localTitle || 'Digite o título...'}
                                                />
                                            </div>

                                            {/* Right Column: Checkbox: Exibir Título */}
                                            <div 
                                                className="flex items-center gap-2 shrink-0 sm:pb-2.5 cursor-pointer select-none" 
                                                onClick={() => setLocalShowStartScreenTitle(!localShowStartScreenTitle)}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    id="showStartScreenTitle"
                                                    checked={localShowStartScreenTitle} 
                                                    onChange={(e) => setLocalShowStartScreenTitle(e.target.checked)} 
                                                    className="custom-checkbox shrink-0" 
                                                />
                                                <span className="text-[11px] text-muted-foreground cursor-pointer select-none">
                                                    {t('UIEditor.startScreen.showTitle', 'Exibir Título')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Linha 2: Imagem de Fundo (esquerda) e Posição dos botões (direita) */}
                                        <div className="flex flex-col sm:flex-row gap-6 items-start w-full">
                                            {/* Left Column: Receptor de imagem de fundo */}
                                            <div className="space-y-2 flex-1 w-full">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-bold font-bold">
                                                        {t('UIEditor.startScreen.bgImage', 'Imagem de Fundo')}
                                                    </label>
                                                    <span className="text-[10px] text-muted-foreground font-semibold">
                                                        {t('UIEditor.startScreen.suggestedRes', '1920x1080 sugerido')}
                                                    </span>
                                                </div>
                                                
                                                <div className="relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden border border-muted-foreground/50 group">
                                                    {localStartScreenBgImage ? (
                                                        <>
                                                            <img 
                                                                src={localStartScreenBgImage} 
                                                                alt="Background Preview" 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 gap-4 backdrop-blur-sm" style={{ zIndex: 20 }}>
                                                                <label htmlFor="start-screen-bg-upload" className="flex flex-col items-center gap-2 cursor-pointer text-white hover:text-primary transition-colors">
                                                                    <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                                                                        <Upload className="w-5 h-5" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                                                        {t('sceneEditor.changeBtn', 'Alterar')}
                                                                    </span>
                                                                    <input id="start-screen-bg-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                                </label>
                                                                <button 
                                                                    type="button"
                                                                    onClick={handleRemoveImage} 
                                                                    className="flex flex-col items-center gap-2 text-white hover:text-red-400 transition-colors"
                                                                >
                                                                    <div className="p-2 bg-white/10 rounded-full hover:bg-red-500/20 transition-all">
                                                                        <Trash2 className="w-5 h-5" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                                                        {t('sceneEditor.removeBtn', 'Remover')}
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <label htmlFor="start-screen-bg-upload" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/5 transition-colors group">
                                                            <div className="w-12 h-12 rounded-full bg-background border border-muted-foreground/50 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-primary/50 transition-all">
                                                                <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                                            </div>
                                                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                                                                {t('sceneEditor.loadImage', 'Carregar Imagem de Fundo')}
                                                            </span>
                                                            <input id="start-screen-bg-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Column: Transição & Som */}
                                            <div className="space-y-3 w-72 shrink-0 sm:pt-[22px]">
                                                <div className="space-y-1.5">
                                                    <label htmlFor="menuTransitionType" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        {t('UIEditor.startScreen.transition', 'Transição')}
                                                    </label>
                                                    <select
                                                        id="menuTransitionType"
                                                        value={localMenuTransitionType}
                                                        onChange={(e) => setLocalMenuTransitionType(e.target.value as any)}
                                                        className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 font-bold"
                                                    >
                                                        <option value="fade">{t('UIEditor.sistemas.transFade', 'Esmaecer')}</option>
                                                        <option value="slide">{t('UIEditor.sistemas.transSlide', 'Deslizar')}</option>
                                                        <option value="none">{t('UIEditor.sistemas.transNone', 'Nenhuma')}</option>
                                                    </select>
                                                </div>

                                                {localMenuTransitionType !== 'none' && (
                                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                            {t('UIEditor.sistemas.speed', 'Velocidade')}
                                                        </label>
                                                        <div className="flex items-center gap-4">
                                                            <input
                                                                type="range"
                                                                min="1"
                                                                max="4"
                                                                step="1"
                                                                value={localMenuTransitionSpeed === 200 ? 4 : (localMenuTransitionSpeed === 500 ? 3 : (localMenuTransitionSpeed === 1000 ? 2 : (localMenuTransitionSpeed === 2000 ? 1 : 3)))}
                                                                onChange={(e) => {
                                                                    const step = parseInt(e.target.value);
                                                                    let speed = 500;
                                                                    if (step === 4) speed = 200;
                                                                    else if (step === 3) speed = 500;
                                                                    else if (step === 2) speed = 1000;
                                                                    else if (step === 1) speed = 2000;
                                                                    setLocalMenuTransitionSpeed(speed);
                                                                }}
                                                                style={{
                                                                    background: (() => {
                                                                        const step = localMenuTransitionSpeed === 200 ? 4 : (localMenuTransitionSpeed === 500 ? 3 : (localMenuTransitionSpeed === 1000 ? 2 : (localMenuTransitionSpeed === 2000 ? 1 : 3)));
                                                                        return `linear-gradient(to right, ${currentSliderColor} ${((step - 1) / 3) * 100}%, ${currentSliderColor}33 ${((step - 1) / 3) * 100}%)`;
                                                                    })()
                                                                }}
                                                                className="flex-grow h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm transition-all"
                                                            />
                                                            <span className="text-xs font-mono font-bold w-28 text-right">
                                                                {localMenuTransitionSpeed === 200 ? "Rápido" : (localMenuTransitionSpeed === 500 ? "Normal" : (localMenuTransitionSpeed === 1000 ? "Lento" : (localMenuTransitionSpeed === 2000 ? "Muito Lento" : "Normal")))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        {t('interactionEditor.soundEffectLabel', 'Efeito Sonoro (.mp3)')}
                                                    </label>
                                                    <div className="flex items-center gap-2 h-[38px] w-full">
                                                        <label className="flex-1 h-full flex items-center justify-center px-3 py-2 bg-background border border-muted-foreground/50 rounded-lg hover:bg-muted cursor-pointer text-xs font-bold transition-colors">
                                                            <Upload className="w-3.5 h-3.5 mr-2 text-muted-foreground" /> {localMenuTransitionSound ? t('interactionEditor.changeBtn', 'Alterar') : t('interactionEditor.uploadBtn', 'Upload')}
                                                            <input type="file" accept="audio/*" onChange={handleSoundUpload} className="hidden" />
                                                        </label>
                                                        {localMenuTransitionSound && (
                                                            <button onClick={() => setLocalMenuTransitionSound?.(undefined)} className="h-full px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* IMAGES */}
                        <div className="w-full">
                            <div className={`w-full p-6 bg-card border-2 ${localEnableImages ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '200ms' }}>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <ImageIcon className="w-5 h-5" />
                                        <div>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${localEnableImages ? 'text-foreground' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.imagesInScenes')}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.imagesInScenesDesc')}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" checked={localEnableImages} onChange={(e) => setLocalEnableImages(e.target.checked)} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localEnableImages ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                                style={{ transform: localEnableImages ? 'translateX(16px)' : 'translateX(0)' }}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                                {localEnableImages && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex gap-4 items-start">
                                            <div className="space-y-2 flex-1">
                                                <label htmlFor="imageTransitionType" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('UIEditor.sistemas.imageTransition')}</label>
                                                <select
                                                    id="imageTransitionType"
                                                    value={localImageTransitionType}
                                                    onChange={(e) => setLocalImageTransitionType(e.target.value as any)}
                                                    className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30"
                                                >
                                                    <option value="fade">{t('UIEditor.sistemas.transFade')}</option>
                                                    <option value="slide">{t('UIEditor.sistemas.transSlide')}</option>
                                                    <option value="none">{t('UIEditor.sistemas.transNone')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('UIEditor.sistemas.speed', 'Velocidade')}</label>
                                                 <div className="flex items-center gap-4">
                                                     <input
                                                         type="range"
                                                         min="1"
                                                         max="4"
                                                         step="1"
                                                         value={localImageSpeed === 0.2 ? 4 : (localImageSpeed === 0.5 ? 3 : (localImageSpeed === 1.0 ? 2 : (localImageSpeed === 2.0 ? 1 : 3)))}
                                                         onChange={(e) => {
                                                             const step = parseInt(e.target.value);
                                                             let speed = 0.5;
                                                             if (step === 4) speed = 0.2;
                                                             else if (step === 3) speed = 0.5;
                                                             else if (step === 2) speed = 1.0;
                                                             else if (step === 1) speed = 2.0;
                                                             setLocalImageSpeed(speed);
                                                         }}
                                                         style={{
                                                             background: (() => {
                                                                 const step = localImageSpeed === 0.2 ? 4 : (localImageSpeed === 0.5 ? 3 : (localImageSpeed === 1.0 ? 2 : (localImageSpeed === 2.0 ? 1 : 3)));
                                                                 return `linear-gradient(to right, ${currentSliderColor} ${((step - 1) / 3) * 100}%, ${currentSliderColor}33 ${((step - 1) / 3) * 100}%)`;
                                                             })()
                                                         }}
                                                         className="flex-grow h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm transition-all"
                                                     />
                                                     <span className="text-xs font-mono font-bold w-28 text-right">
                                                         {localImageSpeed === 0.2 ? "Rápido" : (localImageSpeed === 0.5 ? "Normal" : (localImageSpeed === 1.0 ? "Lento" : (localImageSpeed === 2.0 ? "Muito Lento" : "Normal")))}
                                                     </span>
                                                 </div>
                                             </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TEXT CONTROL */}
                        <div className="w-full">
                            <div className={`w-full p-6 bg-card border-2 ${localEnableTextControl ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '300ms' }}>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <Type className="w-5 h-5" />
                                        <div>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${localEnableTextControl ? 'text-foreground' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.textControl')}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.textControlDesc')}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" checked={localEnableTextControl} onChange={(e) => setLocalEnableTextControl(e.target.checked)} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localEnableTextControl ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                                style={{ transform: localEnableTextControl ? 'translateX(16px)' : 'translateX(0)' }}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                                {localEnableTextControl && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2 w-[calc(50%-0.5rem)]">
                                            <label htmlFor="textAnimationType" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('UIEditor.sistemas.animationStyle')}</label>
                                            <select
                                                id="textAnimationType"
                                                value={localTextAnimationType}
                                                onChange={(e) => setLocalTextAnimationType(e.target.value as 'fade' | 'typewriter')}
                                                className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30"
                                            >
                                                <option value="fade">{t('UIEditor.sistemas.animFade')}</option>
                                                <option value="typewriter">{t('UIEditor.sistemas.animTypewriter')}</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="space-y-2 flex-1">
                                                <label htmlFor="textReadingFlow" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('UIEditor.sistemas.readingFlow')}</label>
                                                <select
                                                    id="textReadingFlow"
                                                    value={localTextReadingFlow}
                                                    onChange={(e) => setLocalTextReadingFlow(e.target.value as 'continuous' | 'paused')}
                                                    className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30"
                                                >
                                                    <option value="paused">{t('UIEditor.sistemas.flowPaused')}</option>
                                                    <option value="continuous">{t('UIEditor.sistemas.flowContinuous')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('UIEditor.sistemas.speed', 'Velocidade')}</label>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="4"
                                                        step="1"
                                                        value={localTextSpeed <= 1 ? 1 : (localTextSpeed === 2 ? 2 : (localTextSpeed === 3 ? 3 : 4))}
                                                        onChange={(e) => {
                                                            const step = parseInt(e.target.value);
                                                            setLocalTextSpeed(step);
                                                        }}
                                                        style={{
                                                            background: (() => {
                                                                const step = localTextSpeed <= 1 ? 1 : (localTextSpeed === 2 ? 2 : (localTextSpeed === 3 ? 3 : 4));
                                                                return `linear-gradient(to right, ${currentSliderColor} ${((step - 1) / 3) * 100}%, ${currentSliderColor}33 ${((step - 1) / 3) * 100}%)`;
                                                            })()
                                                        }}
                                                        className="flex-grow h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm transition-all"
                                                    />
                                                    <span className="text-xs font-mono font-bold w-28 text-right">
                                                         {localTextSpeed <= 1 ? "Muito Lento" : (localTextSpeed === 2 ? "Lento" : (localTextSpeed === 3 ? "Normal" : "Rápido"))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="flex-1 w-full space-y-6">

                        {/* SUGGESTIONS */}
                        <div className="w-full">
                            <div className={`w-full p-6 bg-card border-2 ${localEnableSuggestions ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '400ms' }}>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <Lightbulb className="w-5 h-5" />
                                        <div>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${localEnableSuggestions ? 'text-foreground' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.suggestions', 'Sugestões')}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.suggestionsDesc', 'Ativa o botão de sugestões de ações.')}</p>
                                        </div>
                                    </div>
                                    <label className={`relative inline-flex items-center shrink-0 ${localGameInteractionType === 'choice' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                        <input
                                            type="checkbox"
                                            checked={localEnableSuggestions}
                                            onChange={(e) => setLocalEnableSuggestions(e.target.checked)}
                                            disabled={localGameInteractionType === 'choice'}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localEnableSuggestions ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                                style={{ transform: localEnableSuggestions ? 'translateX(16px)' : 'translateX(0)' }}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* CHANCES/VIDAS */}
                        <div className="w-full">
                            <div className={`w-full p-6 bg-card border-2 ${localEnableChances ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '500ms' }}>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <Heart className="w-5 h-5" />
                                        <div>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${localEnableChances ? 'text-foreground' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.lifeSystem')}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.lifeSystemDesc')}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" checked={localEnableChances} onChange={(e) => setLocalEnableChances(e.target.checked)} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localEnableChances ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                                style={{ transform: localEnableChances ? 'translateX(16px)' : 'translateX(0)' }}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                                {localEnableChances && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-end gap-3 w-full">
                                            <div className="space-y-1 w-20 shrink-0">
                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.sistemas.lives')}</label>
                                                <input
                                                    type="number"
                                                    value={localMaxChances}
                                                    onChange={(e) => setLocalMaxChances(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                                                    min="1"
                                                    max="10"
                                                    className="w-full h-9 bg-zinc-950 border border-muted-foreground/50 rounded-lg px-2 text-xs font-bold text-center text-zinc-300 focus:ring-1 focus:ring-primary/50 transition-all"
                                                />
                                            </div>

                                            <div className="space-y-1 flex-1 min-w-0">
                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.sistemas.icon')}</label>
                                                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-muted-foreground/50 h-9 w-full">
                                                    {['heart', 'circle', 'square', 'star', 'cross'].map((icon) => (
                                                        <button
                                                            key={icon}
                                                            onClick={() => setLocalChanceIcon(icon as any)}
                                                            className={`flex-1 h-full flex items-center justify-center rounded-md transition-all ${localChanceIcon === icon ? 'bg-primary/10 shadow-sm opacity-100 ring-1 ring-primary/20' : 'opacity-30 grayscale-[50%] hover:opacity-100 hover:grayscale-0 hover:bg-muted/50'}`}
                                                            title={icon}
                                                        >
                                                            <ChanceIcon type={icon as any} color={localChanceIconColor} className="w-4 h-4" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-1 w-32 shrink-0">
                                                <label htmlFor="chanceColor" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.sistemas.color')}</label>
                                                <div className="flex items-center gap-2 p-1 bg-background border border-muted-foreground/50 rounded-lg focus-within:border-primary/50 transition-all h-9 w-full">
                                                    <input
                                                        type="color"
                                                        id="chanceColor-picker"
                                                        value={localChanceIconColor}
                                                        onChange={(e) => setLocalChanceIconColor(e.target.value)}
                                                        className="w-8 h-full p-0 border-none rounded cursor-pointer bg-transparent shrink-0"
                                                        aria-label="Seletor de cor"
                                                    />
                                                    <input
                                                        type="text"
                                                        id="chanceColor"
                                                        value={localChanceIconColor}
                                                        onChange={(e) => setLocalChanceIconColor(e.target.value)}
                                                        className="w-full bg-transparent font-mono text-[10px] text-foreground focus:outline-none focus:ring-0 uppercase truncate"
                                                        placeholder="#FF0000"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* INVENTORY */}
                        <div className="w-full">
                            <div className={`w-full p-6 bg-card border-2 ${localEnableInventory ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '600ms' }}>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5" />
                                        <div>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${localEnableInventory ? 'text-foreground' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.inventory')}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.inventoryDesc')}</p>
                                        </div>
                                    </div>
                                    <label className={`relative inline-flex items-center shrink-0 ${localGameInteractionType === 'choice' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                        <input
                                            type="checkbox"
                                            checked={localEnableInventory}
                                            onChange={(e) => setLocalEnableInventory(e.target.checked)}
                                            disabled={localGameInteractionType === 'choice'}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localEnableInventory ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                                style={{ transform: localEnableInventory ? 'translateX(16px)' : 'translateX(0)' }}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* DIARY */}
                        <div className="w-full">
                            <div className={`w-full p-6 bg-card border-2 ${localEnableDiary ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '700ms' }}>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <Book className="w-5 h-5" />
                                        <div>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${localEnableDiary ? 'text-foreground' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.diary')}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.diaryDesc')}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" checked={localEnableDiary} onChange={(e) => setLocalEnableDiary(e.target.checked)} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localEnableDiary ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                                style={{ transform: localEnableDiary ? 'translateX(16px)' : 'translateX(0)' }}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                                {localEnableDiary && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex flex-row items-center gap-6">
                                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocalDiaryShowSceneImage(!localDiaryShowSceneImage)}>
                                                <input type="checkbox" checked={localDiaryShowSceneImage} onChange={(e) => setLocalDiaryShowSceneImage(e.target.checked)} className="custom-checkbox" />
                                                <span className="text-[11px] text-muted-foreground">{t('UIEditor.sistemas.showSceneImage')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocalDiaryShowPlayerAction(!localDiaryShowPlayerAction)}>
                                                <input type="checkbox" checked={localDiaryShowPlayerAction} onChange={(e) => setLocalDiaryShowPlayerAction(e.target.checked)} className="custom-checkbox" />
                                                <span className="text-[11px] text-muted-foreground">{t('UIEditor.sistemas.showPlayerAction')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocalDiaryAllowExport(!localDiaryAllowExport)}>
                                                <input type="checkbox" checked={localDiaryAllowExport} onChange={(e) => setLocalDiaryAllowExport(e.target.checked)} className="custom-checkbox" />
                                                <span className="text-[11px] text-muted-foreground">{t('UIEditor.sistemas.allowExport')}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TRACKERS */}
                        <div className="w-full">
                            <div className={`w-full p-6 bg-card border-2 ${localEnableTrackers ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '800ms' }}>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-5 h-5" />
                                        <div>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${localEnableTrackers ? 'text-foreground' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.trackers')}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.trackersDesc')}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" checked={localEnableTrackers} onChange={(e) => setLocalEnableTrackers(e.target.checked)} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localEnableTrackers ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                                style={{ transform: localEnableTrackers ? 'translateX(16px)' : 'translateX(0)' }}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                                {localEnableTrackers && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {t('UIEditor.sistemas.trackersInfo')}
                                        </p>
                                        <button
                                            onClick={() => onNavigateToTrackers?.()}
                                            className="w-full py-3 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <Activity className="w-4 h-4" /> {t('UIEditor.sistemas.configureTrackers')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RETROSPECTIVE */}
                        <div className="w-full">
                            <div className={`w-full p-6 bg-card border-2 ${localEnableRetrospective ? 'border-primary shadow-md opacity-100' : 'border-muted-foreground/50 opacity-50'} rounded-2xl transition-all hover:shadow-lg group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '900ms' }}>
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <HistoryIcon className="w-5 h-5" />
                                        <div>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${localEnableRetrospective ? 'text-foreground' : 'text-muted-foreground'}`}>{t('UIEditor.sistemas.retrospective')}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t('UIEditor.sistemas.retrospectiveDesc')}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" checked={localEnableRetrospective} onChange={(e) => setLocalEnableRetrospective(e.target.checked)} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                            <div 
                                                className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localEnableRetrospective ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                                style={{ transform: localEnableRetrospective ? 'translateX(16px)' : 'translateX(0)' }}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
