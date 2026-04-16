import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    LayoutTemplate, 
    Palette, 
    Type, 
    ArrowRight, 
    ChevronDown, 
    Heart, 
    Minus
} from 'lucide-react';
import { FONTS, PREDEFINED_THEMES } from '../../constants';
import { GameData } from '../../types';
import { ColorInput } from './ColorInput';
import { DitherShader } from '@/components/ui/dither-shader';
import { getFramePreviewStyles } from '../../utils/frameStyles';

interface AppearanceTabProps {
    // Layout
    localLayoutOrientation: 'vertical' | 'horizontal';
    setLocalLayoutOrientation: (val: 'vertical' | 'horizontal') => void;
    localLayoutOrder: 'image-first' | 'image-last';
    setLocalLayoutOrder: (val: 'image-first' | 'image-last') => void;
    localImageFrame: GameData['gameImageFrame'];
    setLocalImageFrame: (val: GameData['gameImageFrame']) => void;
    
    // Colors
    localGameTheme: 'dark' | 'light';
    localGameFrameColor: string;
    setLocalGameFrameColor: (val: string) => void;
    localTextColor: string;
    setLocalTextColor: (val: string) => void;
    localTextColorLight: string;
    setLocalTextColorLight: (val: string) => void;
    
    localTitleColor: string;
    setLocalTitleColor: (val: string) => void;
    localTitleColorLight: string;
    setLocalTitleColorLight: (val: string) => void;
    
    localFocusColor: string;
    setLocalFocusColor: (val: string) => void;
    localFocusColorLight: string;
    setLocalFocusColorLight: (val: string) => void;
    localGameContinueIndicatorColor: string;
    setLocalGameContinueIndicatorColor: (val: string) => void;
    localSplashButtonColor: string;
    setLocalSplashButtonColor: (val: string) => void;
    localSplashButtonTextColor: string;
    setLocalSplashButtonTextColor: (val: string) => void;
    localSplashButtonHoverColor: string;
    setLocalSplashButtonHoverColor: (val: string) => void;
    localActionButtonColor: string;
    setLocalActionButtonColor: (val: string) => void;
    localActionButtonTextColor: string;
    setLocalActionButtonTextColor: (val: string) => void;
    localGameSceneNameOverlayBg: string;
    setLocalGameSceneNameOverlayBg: (val: string) => void;
    localGameSceneNameOverlayTextColor: string;
    setLocalGameSceneNameOverlayTextColor: (val: string) => void;
    
    // Typography
    localFontFamily: string;
    setLocalFontFamily: (val: string) => void;
    localGameFontSize: string;
    setLocalGameFontSize: (val: string) => void;
    
    // Vignettes
    localSplashContentAlignment: 'left' | 'right';
    setLocalSplashContentAlignment: (val: 'left' | 'right') => void;
    localOmitSplashTitle: boolean;
    setLocalOmitSplashTitle: (val: boolean) => void;
    localOmitSplashDescription: boolean;
    setLocalOmitSplashDescription: (val: boolean) => void;
    localSplashButtonText: string;
    
    // System Helpers
    localEnableInventory: boolean;
    localEnableDiary: boolean;
    localEnableTrackers: boolean;
    localGameShowSystemButton: boolean;
    
    // Theme Handlers
    handleThemeChange: (theme: 'dark' | 'light') => void;
    applyTheme: (theme: any) => void;
    
    // Preview Management
    previewType: 'scene' | 'vignette';
    setPreviewType: (type: 'scene' | 'vignette') => void;
    isColorsExpanded: boolean;
    setIsColorsExpanded: (expanded: boolean) => void;
    ditherColors: { primary: string; secondary: string };
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({
    localLayoutOrientation,
    setLocalLayoutOrientation,
    localLayoutOrder,
    setLocalLayoutOrder,
    localImageFrame,
    setLocalImageFrame,
    localGameTheme,
    localGameFrameColor,
    setLocalGameFrameColor,
    localTextColor,
    setLocalTextColor,
    localTextColorLight,
    setLocalTextColorLight,
    localTitleColor,
    setLocalTitleColor,
    localTitleColorLight,
    setLocalTitleColorLight,
    localFocusColor,
    setLocalFocusColor,
    localFocusColorLight,
    setLocalFocusColorLight,
    localGameContinueIndicatorColor,
    setLocalGameContinueIndicatorColor,
    localSplashButtonColor,
    setLocalSplashButtonColor,
    localSplashButtonTextColor,
    setLocalSplashButtonTextColor,
    localSplashButtonHoverColor,
    setLocalSplashButtonHoverColor,
    localActionButtonColor,
    setLocalActionButtonColor,
    localActionButtonTextColor,
    setLocalActionButtonTextColor,
    localGameSceneNameOverlayBg,
    setLocalGameSceneNameOverlayBg,
    localGameSceneNameOverlayTextColor,
    setLocalGameSceneNameOverlayTextColor,
    localFontFamily,
    setLocalFontFamily,
    localGameFontSize,
    setLocalGameFontSize,
    localSplashContentAlignment,
    setLocalSplashContentAlignment,
    localOmitSplashTitle,
    setLocalOmitSplashTitle,
    localOmitSplashDescription,
    setLocalOmitSplashDescription,
    localSplashButtonText,
    localEnableInventory,
    localEnableDiary,
    localEnableTrackers,
    localGameShowSystemButton,
    handleThemeChange,
    applyTheme,
    previewType,
    setPreviewType,
    isColorsExpanded,
    setIsColorsExpanded,
    ditherColors
}) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Controls */}
            <div className="col-span-1 lg:col-span-5 space-y-8 h-[calc(100vh-280px)] overflow-y-auto pr-4 custom-scrollbar">
                {/* SECTION: ESTRUTURA */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '50ms' }}>
                    <div className="flex items-center w-full text-left">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <LayoutTemplate className="w-4 h-4" /> {t('UIEditor.aparencia.estrutura', 'Estrutura')}
                        </h3>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('UIEditor.layout.orientation')}</label>
                            <div className="relative">
                                <select
                                    value={localLayoutOrientation}
                                    onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                                    className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="vertical">{t('UIEditor.layout.vertical')}</option>
                                    <option value="horizontal">{t('UIEditor.layout.horizontal')}</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('UIEditor.layout.imagePosition')}</label>
                            <div className="relative">
                                <select
                                    value={localLayoutOrder}
                                    onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                                    className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                >
                                    {localLayoutOrientation === 'vertical' ? (
                                        <>
                                            <option value="image-first">{t('UIEditor.layout.posLeft')}</option>
                                            <option value="image-last">{t('UIEditor.layout.posRight')}</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="image-first">{t('UIEditor.layout.posAbove')}</option>
                                            <option value="image-last">{t('UIEditor.layout.posBelow')}</option>
                                        </>
                                    )}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('UIEditor.layout.frameType')}</label>
                                <div className="relative">
                                    <select
                                        value={localImageFrame}
                                        onChange={(e) => setLocalImageFrame(e.target.value as any)}
                                        className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="none">{t('UIEditor.layout.frameNone')}</option>
                                        <option value="rounded-top">{t('UIEditor.layout.framePortal')}</option>
                                        <option value="book-cover">{t('UIEditor.layout.frameSquare')}</option>
                                        <option value="trading-card">{t('UIEditor.layout.frameRounded')}</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                            {localImageFrame && localImageFrame !== 'none' && (
                                <div className="space-y-2">
                                    <ColorInput 
                                        label={t('UIEditor.aparencia.frameColor', 'Cor')} 
                                        id={`frameColor-${localImageFrame}`} 
                                        value={localGameFrameColor} 
                                        onChange={setLocalGameFrameColor} 
                                        placeholder="#FFFFFF" 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECTION: VINHETAS */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center w-full text-left">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" /> {t('UIEditor.aparencia.vinhetas', 'Layout das Vinhetas')}
                        </h3>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('UIEditor.layout.contentAlignment')}</label>
                            <div className="relative">
                                <select
                                    value={localSplashContentAlignment}
                                    onChange={(e) => setLocalSplashContentAlignment(e.target.value as 'left' | 'right')}
                                    className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="right">{t('UIEditor.layout.alignRight')}</option>
                                    <option value="left">{t('UIEditor.layout.alignLeft')}</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="flex items-center group cursor-pointer" onClick={() => setLocalOmitSplashTitle(!localOmitSplashTitle)}>
                                <input
                                    type="checkbox"
                                    id="omitSplashTitle"
                                    checked={localOmitSplashTitle}
                                    onChange={(e) => setLocalOmitSplashTitle(e.target.checked)}
                                    className="custom-checkbox"
                                />
                                <label htmlFor="omitSplashTitle" className="ml-2 text-[11px] text-muted-foreground group-hover:text-foreground cursor-pointer select-none transition-colors">{t('UIEditor.layout.hideTitle')}</label>
                            </div>
                            <div className="flex items-center group cursor-pointer" onClick={() => setLocalOmitSplashDescription(!localOmitSplashDescription)}>
                                <input
                                    type="checkbox"
                                    id="omitSplashDescription"
                                    checked={localOmitSplashDescription}
                                    onChange={(e) => setLocalOmitSplashDescription(e.target.checked)}
                                    className="custom-checkbox"
                                />
                                <label htmlFor="omitSplashDescription" className="ml-2 text-[11px] text-muted-foreground group-hover:text-foreground cursor-pointer select-none transition-colors">{t('UIEditor.layout.hideDescription')}</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: UI TEXT */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '150ms' }}>
                    <div className="flex items-center w-full text-left">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Type className="w-4 h-4" /> {t('UIEditor.aparencia.fontsText')}
                        </h3>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('UIEditor.aparencia.font')}</label>
                                <div className="relative">
                                    <select
                                        value={localFontFamily}
                                        onChange={(e) => setLocalFontFamily(e.target.value)}
                                        className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                                    >
                                        {FONTS.map(font => (
                                            <option key={font.name} value={font.family}>
                                                {t(`fonts.${font.name.replace(/[^a-zA-Z]/g, '')}`, { defaultValue: font.name })} · {t(`fonts.categories.${font.category}`, { defaultValue: font.category })}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('UIEditor.aparencia.size')}</label>
                                <div className="relative">
                                    <select
                                        value={localGameFontSize}
                                        onChange={(e) => setLocalGameFontSize(e.target.value)}
                                        className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="12">{t('UIEditor.aparencia.sizeSmall')}</option>
                                        <option value="14">{t('UIEditor.aparencia.sizeMedium')}</option>
                                        <option value="16">{t('UIEditor.aparencia.sizeLarge')}</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: ESTILO & TEMA */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center w-full text-left">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Palette className="w-4 h-4" /> {t('UIEditor.aparencia.styleTheme')}
                        </h3>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('ThemeEditor.uiTheme', 'Cor da Interface')}</label>
                            <div className="flex bg-background rounded-lg p-1 border border-muted-foreground/50">
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${localGameTheme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {t('ThemeEditor.dark', 'Noite')}
                                </button>
                                <button
                                    onClick={() => handleThemeChange('light')}
                                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${localGameTheme === 'light' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {t('ThemeEditor.light', 'Dia')}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('UIEditor.aparencia.predefinedThemes')}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {PREDEFINED_THEMES.map((theme) => (
                                    <button
                                        key={theme.nameKey}
                                        onClick={() => applyTheme(theme)}
                                        className="flex flex-col items-center justify-center p-3 rounded-lg border border-muted-foreground/50 bg-background hover:border-primary/50 hover:bg-muted/80 transition-all gap-2 group"
                                    >
                                        <div className="flex -space-x-1">
                                            <div className="w-3 h-3 rounded-full border border-muted-foreground/50" style={{ backgroundColor: theme.textColorLight }}></div>
                                            <div className="w-3 h-3 rounded-full border border-muted-foreground/50" style={{ backgroundColor: theme.titleColor }}></div>
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground">{t(`ThemeEditor.themes.${theme.nameKey}`, { defaultValue: theme.name })}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="pt-2">
                                <div
                                    className="flex items-center justify-between w-full text-left bg-muted/10 p-3 rounded-lg cursor-pointer hover:bg-muted/20 transition-colors"
                                    onClick={() => setIsColorsExpanded(!isColorsExpanded)}
                                >
                                    <div className="flex items-center gap-2">
                                        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isColorsExpanded ? 'rotate-180' : ''}`} />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.aparencia.colorCustom')}</span>
                                    </div>
                                </div>
                                {isColorsExpanded && (
                                    <div className="mt-3 space-y-6 animate-in fade-in slide-in-from-top-1 px-1">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-foreground border-b border-muted-foreground/50 pb-1">{t('UIEditor.aparencia.sceneDesc')}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <ColorInput 
                                                    label={t('UIEditor.aparencia.defaultText')} 
                                                    id="textColor" 
                                                    value={localGameTheme === 'dark' ? localTextColor : localTextColorLight} 
                                                    onChange={localGameTheme === 'dark' ? setLocalTextColor : setLocalTextColorLight} 
                                                    placeholder="#FFFFFF" 
                                                />
                                                <ColorInput 
                                                    label={t('UIEditor.aparencia.titleHighlight')} 
                                                    id="titleColor" 
                                                    value={localGameTheme === 'dark' ? localTitleColor : localTitleColorLight} 
                                                    onChange={localGameTheme === 'dark' ? setLocalTitleColor : setLocalTitleColorLight} 
                                                    placeholder="#58A6FF" 
                                                />
                                                <ColorInput 
                                                    label={t('UIEditor.aparencia.focusHighlight')} 
                                                    id="focusColor" 
                                                    value={localGameTheme === 'dark' ? localFocusColor : localFocusColorLight} 
                                                    onChange={localGameTheme === 'dark' ? setLocalFocusColor : setLocalFocusColorLight} 
                                                    placeholder="#FFFFFF" 
                                                />
                                                <ColorInput label={t('UIEditor.aparencia.indicatorArrow')} id="gameContinueIndicatorColor" value={localGameContinueIndicatorColor} onChange={setLocalGameContinueIndicatorColor} placeholder="#FFFFFF" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-foreground border-b border-muted-foreground/50 pb-1">{t('UIEditor.aparencia.uiButtons')}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <ColorInput label={t('UIEditor.aparencia.splashButton')} id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.splashButtonTextColor')} id="splashButtonTextColor" value={localSplashButtonTextColor} onChange={setLocalSplashButtonTextColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.splashButtonHover')} id="splashButtonHoverColor" value={localSplashButtonHoverColor} onChange={setLocalSplashButtonHoverColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.actionButton')} id="actionButtonColor" value={localActionButtonColor} onChange={setLocalActionButtonColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.actionButtonTextColor')} id="actionButtonTextColor" value={localActionButtonTextColor} onChange={setLocalActionButtonTextColor} placeholder="#FFFFFF" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-foreground border-b border-muted-foreground/50 pb-1">{t('UIEditor.aparencia.sceneNameBox')}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <ColorInput label={t('UIEditor.aparencia.bgColor')} id="scenaNameBg" value={localGameSceneNameOverlayBg} onChange={setLocalGameSceneNameOverlayBg} placeholder="#000000" />
                                                <ColorInput label={t('UIEditor.aparencia.text')} id="sceneNameText" value={localGameSceneNameOverlayTextColor} onChange={setLocalGameSceneNameOverlayTextColor} placeholder="#FFFFFF" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-foreground border-b border-muted-foreground/50 pb-1">{t('UIEditor.aparencia.others')}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <ColorInput label={t('UIEditor.aparencia.mainBg')} id="gameFrameColor" value={localGameFrameColor} onChange={setLocalGameFrameColor} placeholder="#000000" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Preview */}
            <div className="col-span-1 lg:col-span-7 relative sticky top-0 self-start">
                <div className="space-y-6 flex flex-col">
                    <div className="flex items-center justify-start gap-3 mb-2 w-full">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap text-zinc-400">{t('UIEditor.aparencia.previewLabel', 'Exemplo de')}</span>
                        <div className="flex bg-background rounded-lg p-1 border border-muted-foreground/50 w-full max-w-[340px]">
                            <button
                                onClick={() => setPreviewType('scene')}
                                className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${previewType === 'scene' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t('UIEditor.aparencia.scenes', 'Layout das Cenas')}
                            </button>
                            <button
                                onClick={() => setPreviewType('vignette')}
                                className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${previewType === 'vignette' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t('UIEditor.aparencia.vinhetas', 'Layout das Vinhetas')}
                            </button>
                        </div>
                    </div>

                    {previewType === 'scene' ? (
                        <div
                            className={`
                                rounded-xl border shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300 flex-1 w-full
                                ${localGameTheme === 'dark' ? 'bg-background border-muted-foreground/50' : 'bg-zinc-100 border-muted-foreground/50'}
                                ${localLayoutOrientation === 'horizontal' ? 'aspect-[9/16]' : 'aspect-video'}
                            `}
                            style={{ fontFamily: localFontFamily, maxHeight: '500px' }}
                        >
                            <div className={`flex-1 p-6 flex gap-6 overflow-hidden relative ${localLayoutOrientation === 'vertical' ? 'flex-row' : 'flex-col'}`}>
                                {/* Image Area */}
                                <div
                                    className={`
                                        relative flex items-center justify-center flex-shrink-0 transition-all duration-300
                                        ${localLayoutOrientation === 'vertical' ? 'w-2/5 h-full' : 'w-full h-1/2 min-h-[50%]'}
                                        ${localLayoutOrder === 'image-first' ? 'order-first' : 'order-last'}
                                    `}
                                >
                                    {(() => {
                                        const { panelStyles, containerStyles, panelClass, containerClass } = getFramePreviewStyles(localImageFrame as any, localGameTheme, localGameFrameColor);

                                        return (
                                            <div
                                                className={`game-preview-safe-zone ${panelClass}`}
                                                style={{
                                                    ...panelStyles,
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <div
                                                    style={{ ...containerStyles, width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
                                                    className={containerClass}
                                                >
                                                    <div className="absolute inset-0 opacity-60">
                                                        <DitherShader
                                                            src="https://images.unsplash.com/photo-1574169208507-84376144848b?w=500&auto=format&fit=crop&q=60"
                                                            gridSize={2}
                                                            ditherMode="bayer"
                                                            colorMode="duotone"
                                                            primaryColor={ditherColors.primary}
                                                            secondaryColor={ditherColors.secondary}
                                                            className="w-full h-full"
                                                            objectFit="cover"
                                                        />
                                                    </div>
                                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                                                        <div
                                                            className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest"
                                                            style={{ backgroundColor: localGameSceneNameOverlayBg, color: localGameSceneNameOverlayTextColor }}
                                                        >
                                                            {t('UIEditor.aparencia.sceneName')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Text Area */}
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                                        <p className="leading-relaxed" style={{ color: localTextColor, fontSize: (() => {
                                            const baseSize = /^\d+$/.test(localGameFontSize) ? parseInt(localGameFontSize) : 14;
                                            const fontInfo = FONTS.find(f => f.family === localFontFamily);
                                            const multiplier = fontInfo?.sizeAdjust || 1.0;
                                            return `${baseSize * multiplier}px`;
                                        })() }}>
                                            {t('UIEditor.aparencia.sampleDesc1')}
                                            <span style={{ color: localTitleColor }}>{t('UIEditor.aparencia.sampleDescHighlight')}</span>
                                            {t('UIEditor.aparencia.sampleDesc2')}
                                        </p>
                                        <p className="mt-4 opacity-70" style={{ color: localTextColor, fontFamily: localFontFamily, fontSize: (() => {
                                            const baseSize = /^\d+$/.test(localGameFontSize) ? parseInt(localGameFontSize) : 14;
                                            const fontInfo = FONTS.find(f => f.family === localFontFamily);
                                            const multiplier = fontInfo?.sizeAdjust || 1.0;
                                            return `${baseSize * multiplier}px`;
                                        })() }}>
                                            {'>'} {t('UIEditor.aparencia.sampleCommand')}
                                        </p>
                                    </div>

                                    {/* Nav + Input Column */}
                                    <div className="flex-shrink-0 space-y-2 pt-2">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {localEnableInventory && (
                                                <button className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border" style={{ borderColor: localTextColor + '40', color: localTextColor, backgroundColor: 'transparent' }}>
                                                    {t('UIEditor.textos.inventoryPlaceholder')}
                                                </button>
                                            )}
                                            {localEnableDiary && (
                                                <button className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border" style={{ borderColor: localTextColor + '40', color: localTextColor, backgroundColor: 'transparent' }}>
                                                    {t('UIEditor.textos.diaryPlaceholder')}
                                                </button>
                                            )}
                                            {localEnableTrackers && (
                                                <button className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border" style={{ borderColor: localTextColor + '40', color: localTextColor, backgroundColor: 'transparent' }}>
                                                    {t('UIEditor.textos.trackersPlaceholder')}
                                                </button>
                                            )}
                                            {localGameShowSystemButton && (
                                                <button className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border" style={{ borderColor: localTextColor + '40', color: localTextColor, backgroundColor: 'transparent' }}>
                                                    {t('UIEditor.textos.systemPlaceholder')}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex gap-1.5 pt-1.5">
                                            <div className={`flex-1 rounded-md h-8 flex items-center px-2 border ${localGameTheme === 'dark' ? 'bg-muted/50 border-muted-foreground/50' : 'bg-white border-muted-foreground/50'}`}>
                                                <span className="font-mono truncate" style={{ fontSize: '11px', fontFamily: localFontFamily, color: localGameTheme === 'dark' ? '#52525b' : '#a1a1aa' }}>{t('UIEditor.textos.commandInputValue')}</span>
                                            </div>
                                            <button
                                                className="px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate text-[11px]"
                                                style={{ backgroundColor: localActionButtonColor, color: localActionButtonTextColor, fontFamily: localFontFamily }}
                                            >
                                                {t('UIEditor.aparencia.action')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full flex-1">
                            <div
                                className="relative w-full aspect-video bg-muted border border-muted-foreground/50 rounded-xl flex flex-col justify-end overflow-hidden p-6 box-border shadow-2xl"
                                style={{
                                    alignItems: localSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end',
                                    textAlign: localSplashContentAlignment === 'left' ? 'left' : 'right',
                                    maxHeight: '500px'
                                }}
                            >
                                <div className="absolute inset-0 opacity-60">
                                    <DitherShader
                                        src="https://images.unsplash.com/photo-1574169208507-84376144848b?w=500&auto=format&fit=crop&q=60"
                                        gridSize={2}
                                        ditherMode="bayer"
                                        colorMode="duotone"
                                        primaryColor={ditherColors.primary}
                                        secondaryColor={ditherColors.secondary}
                                        className="w-full h-full"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className={`relative z-10 w-full flex flex-col gap-2 ${localSplashContentAlignment === 'left' ? 'items-start' : 'items-end'}`}>
                                    {!localOmitSplashTitle && (
                                        <div className="font-bold uppercase tracking-widest drop-shadow-md" style={{ color: localTitleColor, fontSize: (() => {
                                            const baseSize = /^\d+$/.test(localGameFontSize) ? parseInt(localGameFontSize) : 14;
                                            const fontInfo = FONTS.find(f => f.family === localFontFamily);
                                            const multiplier = fontInfo?.sizeAdjust || 1.0;
                                            return `${baseSize * multiplier}px`;
                                        })(), fontFamily: localFontFamily }}>{t('UIEditor.aparencia.sceneName', 'Título da vinheta')}</div>
                                    )}
                                    {!localOmitSplashDescription && (
                                        <p className="leading-relaxed drop-shadow-sm" style={{ color: localTextColor, fontSize: (() => {
                                            const baseSize = /^\d+$/.test(localGameFontSize) ? parseInt(localGameFontSize) : 14;
                                            const fontInfo = FONTS.find(f => f.family === localFontFamily);
                                            const multiplier = fontInfo?.sizeAdjust || 1.0;
                                            return `${baseSize * multiplier}px`;
                                        })(), fontFamily: localFontFamily }}>{t('UIEditor.aparencia.sampleVignetteDesc', 'Esta é uma descrição de exemplo para a vinheta.')}</p>
                                    )}
                                    <button
                                        className="px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate text-[11px] mt-1"
                                        style={{ backgroundColor: localSplashButtonColor, color: localSplashButtonTextColor, fontFamily: localFontFamily }}
                                    >
                                        {localSplashButtonText || t('UIEditor.aparencia.homeButton', 'Começar')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
