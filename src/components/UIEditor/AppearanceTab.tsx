import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    LayoutTemplate, 
    Palette, 
    Paintbrush,
    Type, 
    ArrowRight, 
    ChevronDown, 
    Heart, 
    Minus,
    Sun,
    Image as ImageIcon,
    Command,
    Package,
    Split
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
    localGameBackgroundColor: string;
    setLocalGameBackgroundColor: (val: string) => void;
    localGameFrameColor: string;
    setLocalGameFrameColor: (val: string) => void;
    localTextColor: string;
    setLocalTextColor: (val: string) => void;
    
    localTitleColor: string;
    setLocalTitleColor: (val: string) => void;
    
    localFocusColor: string;
    setLocalFocusColor: (val: string) => void;
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
    localActionButtonHoverColor: string;
    setLocalActionButtonHoverColor: (val: string) => void;
    
    localSystemButtonColor: string;
    setLocalSystemButtonColor: (val: string) => void;
    localSystemButtonTextColor: string;
    setLocalSystemButtonTextColor: (val: string) => void;
    localSystemButtonBorderColor: string;
    setLocalSystemButtonBorderColor: (val: string) => void;
    localSystemButtonHoverColor: string;
    setLocalSystemButtonHoverColor: (val: string) => void;
    localSystemButtonHoverTextColor: string;
    setLocalSystemButtonHoverTextColor: (val: string) => void;
    
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
    applyTheme: (theme: any) => void;
    
    // Preview Management
    previewType: 'scene' | 'vignette' | 'menu';
    setPreviewType: (type: 'scene' | 'vignette' | 'menu') => void;
    isColorsExpanded: boolean;
    setIsColorsExpanded: (expanded: boolean) => void;
    ditherColors: { primary: string; secondary: string };

    // Start Screen / Menu Preview Props
    localStartScreenBgImage?: string;
    localShowStartScreenTitle?: boolean;
    localStartScreenTitle?: string;
    localStartScreenButtonAlignment?: 'left' | 'center' | 'right';
    localTitle?: string;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({
    localLayoutOrientation,
    setLocalLayoutOrientation,
    localLayoutOrder,
    setLocalLayoutOrder,
    localImageFrame,
    setLocalImageFrame,
    localGameBackgroundColor,
    setLocalGameBackgroundColor,
    localGameFrameColor,
    setLocalGameFrameColor,
    localTextColor,
    setLocalTextColor,
    localTitleColor,
    setLocalTitleColor,
    localFocusColor,
    setLocalFocusColor,
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
    localActionButtonHoverColor,
    setLocalActionButtonHoverColor,
    localSystemButtonColor,
    setLocalSystemButtonColor,
    localSystemButtonTextColor,
    setLocalSystemButtonTextColor,
    localSystemButtonBorderColor,
    setLocalSystemButtonBorderColor,
    localSystemButtonHoverColor,
    setLocalSystemButtonHoverColor,
    localSystemButtonHoverTextColor,
    setLocalSystemButtonHoverTextColor,
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
    applyTheme,
    previewType,
    setPreviewType,
    isColorsExpanded,
    setIsColorsExpanded,
    ditherColors,
    localStartScreenBgImage = '',
    localShowStartScreenTitle = true,
    localStartScreenTitle = '',
    localStartScreenButtonAlignment = 'center',
    localTitle = ''
}) => {
    const { t } = useTranslation();
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    const getScaledFontSize = (factor = 1.0) => {
        const baseSize = /^\d+$/.test(localGameFontSize) ? parseInt(localGameFontSize) : 14;
        const fontInfo = FONTS.find(f => f.family === localFontFamily);
        const multiplier = fontInfo?.sizeAdjust || 1.0;
        return `${baseSize * multiplier * factor}px`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-32">
            {/* Left Column: Controls */}
            <div className="col-span-1 lg:col-span-5 space-y-8">
                {/* SECTION: ESTRUTURA */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '50ms' }}>
                    <div className="flex items-center w-full text-left">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Split className="w-4 h-4 rotate-90" />
                            {t('UIEditor.aparencia.estrutura', 'Layout das Ramificações')}
                        </h3>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4">
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
                            <ArrowRight className="w-4 h-4" /> {t('UIEditor.aparencia.vinhetas', 'Layout dos Capítulos')}
                        </h3>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('UIEditor.layout.contentAlignment')}</label>
                            <div /> {/* Empty label area for the second column */}
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
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
                            <div className="flex flex-row gap-4 py-1">
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
                </div>

                {/* SECTION: UI TEXT */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '150ms' }}>
                    <div className="flex items-center w-full text-left">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Type className="w-4 h-4" /> {t('UIEditor.aparencia.fontsText', 'Fontes e Textos')}
                        </h3>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="grid grid-cols-3 gap-4">
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
                            <ColorInput
                                label={t('UIEditor.aparencia.defaultText', 'Cor')}
                                id="textColor"
                                value={localTextColor}
                                onChange={setLocalTextColor}
                                placeholder="#FFFFFF"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION: ESTILO & TEMA */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center w-full text-left">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Paintbrush className="w-4 h-4" />
                            {t('UIEditor.aparencia.styleTheme')}
                        </h3>
                    </div>

                    <div className="mt-6 space-y-6">
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
                                            <div className="w-3 h-3 rounded-full border border-muted-foreground/50" style={{ backgroundColor: theme.textColor }}></div>
                                            <div className="w-3 h-3 rounded-full border border-muted-foreground/50" style={{ backgroundColor: theme.titleColor }}></div>
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground">{t(`ThemeEditor.themes.${theme.nameKey}`, { defaultValue: theme.name })}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="pt-2">
                                <div
                                    className="flex items-center justify-start w-full text-left py-2 px-0 cursor-pointer hover:opacity-70 transition-opacity group"
                                    onClick={() => setIsColorsExpanded(!isColorsExpanded)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-colors group-hover:text-foreground">{t('UIEditor.aparencia.colorCustom')}</span>
                                        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isColorsExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                {isColorsExpanded && (
                                    <div className="mt-3 space-y-8 animate-in fade-in slide-in-from-top-1 px-1">
                                        {/* GRUPO 3: INTERFACE DAS VINHETAS */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 border-b border-muted-foreground/30 pb-1">
                                                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">{t('UIEditor.aparencia.groups.vignetteControls', 'Interface dos Capítulos')}</h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <ColorInput label={t('UIEditor.aparencia.vignetteTitle', 'Título do Capítulo')} id="vignetteTitleColor" value={localTitleColor} onChange={setLocalTitleColor} placeholder="#58A6FF" />
                                                <ColorInput label={t('UIEditor.aparencia.splashButton', 'Botão do capítulo')} id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.splashButtonTextColor', 'Texto do botão do capítulo')} id="splashButtonTextColor" value={localSplashButtonTextColor} onChange={setLocalSplashButtonTextColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.splashButtonHover', 'Hover do botão do capítulo')} id="splashButtonHoverColor" value={localSplashButtonHoverColor} onChange={setLocalSplashButtonHoverColor} placeholder="#FFFFFF" />
                                            </div>
                                        </div>

                                        {/* GRUPO 5: INTERFACE DAS CENAS */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 border-b border-muted-foreground/30 pb-1">
                                                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">{t('UIEditor.aparencia.groups.systemInterface', 'Interface das Ramificações')}</h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <ColorInput label={t('UIEditor.aparencia.gameBgColor', 'Cor de fundo')} id="gameBackgroundColor" value={localGameBackgroundColor} onChange={setLocalGameBackgroundColor} placeholder="#000000" />
                                                <ColorInput label={t('UIEditor.aparencia.focusHighlight', 'Destaques (Palavras e Input do usuário)')} id="focusColor" value={localFocusColor} onChange={setLocalFocusColor} placeholder="#58A6FF" />
                                                <ColorInput label={t('UIEditor.aparencia.actionButton', 'Fundo do Botão')} id="actionButtonColor" value={localActionButtonColor} onChange={setLocalActionButtonColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.actionButtonTextColor', 'Texto do botão de Ação')} id="actionButtonTextColor" value={localActionButtonTextColor} onChange={setLocalActionButtonTextColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.actionButtonHover', 'Hover do botão de Ação')} id="actionButtonHoverColor" value={localActionButtonHoverColor} onChange={setLocalActionButtonHoverColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.systemButton', 'Botões de ferramentas')} id="systemButtonColor" value={localSystemButtonColor} onChange={setLocalSystemButtonColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.systemButtonTextColor', 'Texto dos botões de ferramentas')} id="systemButtonTextColor" value={localSystemButtonTextColor} onChange={setLocalSystemButtonTextColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.systemButtonBorder', 'Contorno dos botões e input')} id="systemButtonBorderColor" value={localSystemButtonBorderColor} onChange={setLocalSystemButtonBorderColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.systemButtonHover', 'Hover dos botões de ferramentas')} id="systemButtonHoverColor" value={localSystemButtonHoverColor} onChange={setLocalSystemButtonHoverColor} placeholder="#FFFFFF" />
                                                <ColorInput label={t('UIEditor.aparencia.systemButtonHoverTextColor', 'Hover do texto dos botões')} id="systemButtonHoverTextColor" value={localSystemButtonHoverTextColor} onChange={setLocalSystemButtonHoverTextColor} placeholder="#FFFFFF" />
                                            </div>
                                        </div>

                                        {/* GRUPO 2: NOME DA CENA */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 border-b border-muted-foreground/30 pb-1">
                                                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">{t('UIEditor.aparencia.groups.sceneIdentity', 'Nome da Ramificação')}</h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <ColorInput label={t('UIEditor.aparencia.sceneNameBg', 'Cor de fundo da caixa')} id="scenaNameBg" value={localGameSceneNameOverlayBg} onChange={setLocalGameSceneNameOverlayBg} placeholder="#000000" />
                                                <ColorInput label={t('UIEditor.aparencia.sceneNameText', 'Texto (Nome da Ramificação)')} id="sceneNameText" value={localGameSceneNameOverlayTextColor} onChange={setLocalGameSceneNameOverlayTextColor} placeholder="#FFFFFF" />
                                                <ColorInput 
                                                    label={t('UIEditor.aparencia.frameColor', 'Moldura da Imagem')} 
                                                    id="gameFrameColor" 
                                                    value={localGameFrameColor} 
                                                    onChange={setLocalGameFrameColor} 
                                                    placeholder="#000000" 
                                                />
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
            <div className="col-span-1 lg:col-span-7 relative sticky top-0 self-start z-10">
                <div className="space-y-6 flex flex-col">
                    <div className="flex items-center justify-start gap-3 mb-4 w-full">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap text-zinc-400">{t('UIEditor.aparencia.previewLabel', 'Example of')}</span>
                        <div className="flex bg-background rounded-lg p-1 border border-muted-foreground/50 w-full max-w-[480px]">
                            <button
                                onClick={() => setPreviewType('scene')}
                                className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${previewType === 'scene' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t('newProject.appearance.layoutScenes', 'Layout das Ramificações')}
                            </button>
                            <button
                                onClick={() => setPreviewType('vignette')}
                                className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${previewType === 'vignette' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t('newProject.info.vignetteLayout', 'Layout dos Capítulos')}
                            </button>
                            <button
                                onClick={() => setPreviewType('menu')}
                                className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${previewType === 'menu' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t('UIEditor.tabs.menu_principal', 'Menu Principal')}
                            </button>
                        </div>
                    </div>
                    
                    {/* Estilos dinâmicos para o Hover do Preview */}
                    <style>
                        {`
                            .preview-btn-action { transition: all 0.2s ease; }
                            .preview-btn-action:hover { 
                                background-color: ${localActionButtonHoverColor} !important;
                                transform: translateY(-1px);
                                shadow: 0 4px 12px rgba(0,0,0,0.3);
                            }
                            
                            .preview-btn-system { transition: all 0.2s ease; }
                            .preview-btn-system:hover { 
                                background-color: ${localSystemButtonHoverColor} !important;
                                color: ${localSystemButtonHoverTextColor} !important;
                                transform: translateY(-1px);
                            }
                            
                            .preview-btn-splash { transition: all 0.2s ease; }
                            .preview-btn-splash:hover { 
                                background-color: ${localSplashButtonHoverColor} !important;
                                transform: translateY(-1px);
                            }

                            .preview-interactive-text { transition: color 0.2s ease; }
                            .preview-interactive-text:hover {
                                color: ${localFocusColor} !important;
                                cursor: pointer;
                            }
                        `}
                    </style>

                    {previewType === 'scene' && (
                            <div
                                className={`
                                    rounded-xl border shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300 flex-1 w-full
                                    border-muted-foreground/50
                                    ${localLayoutOrientation === 'horizontal' ? 'aspect-[9/16]' : 'aspect-video'}
                                `}
                                style={{ fontFamily: localFontFamily, maxHeight: '500px', backgroundColor: localGameBackgroundColor }}
                            >
                            <div className={`flex-1 p-[30px] flex gap-[30px] overflow-hidden relative ${localLayoutOrientation === 'vertical' ? 'flex-row' : 'flex-col'}`}>
                                {/* Image Area */}
                                <div
                                    className={`
                                        relative flex items-center justify-center flex-shrink-0 transition-all duration-300
                                        ${localLayoutOrientation === 'vertical' ? 'w-2/5 h-full' : 'w-full h-1/2 min-h-[50%]'}
                                        ${localLayoutOrder === 'image-first' ? 'order-first' : 'order-last'}
                                    `}
                                >
                                    {(() => {
                                        const { panelStyles, containerStyles, panelClass, containerClass } = getFramePreviewStyles(localImageFrame as any, localGameBackgroundColor, localGameFrameColor);

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
                                                    <div className="absolute top-4 left-4 z-20">
                                                        <div
                                                            className="px-2 py-0.5 border uppercase leading-none"
                                                            style={{ 
                                                                backgroundColor: localGameSceneNameOverlayBg, 
                                                                color: localGameSceneNameOverlayTextColor,
                                                                borderColor: `color-mix(in srgb, ${localGameBackgroundColor} 80%, ${localTextColor} 20%)`,
                                                                borderWidth: '2px',
                                                                fontSize: getScaledFontSize(1.0)
                                                            }}
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
                                        <p className="leading-relaxed" style={{ color: localTextColor, fontSize: getScaledFontSize(1.0) }}>
                                            {t('UIEditor.aparencia.sampleDesc1')}
                                            <span className="preview-interactive-text" style={{ color: localFocusColor }}>{t('UIEditor.aparencia.sampleDescHighlight')}</span>
                                            {t('UIEditor.aparencia.sampleDesc2')}
                                        </p>
                                        <p className="mt-4 opacity-70" style={{ color: localTextColor, fontFamily: localFontFamily, fontSize: getScaledFontSize(1.0) }}>
                                            {'>'} {t('UIEditor.aparencia.sampleCommand')}
                                        </p>
                                    </div>

                                    {/* Nav + Input Column */}
                                    <div className="flex-shrink-0 space-y-2 pt-2">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {localEnableInventory && (
                                                <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: localSystemButtonBorderColor, color: localSystemButtonTextColor, backgroundColor: localSystemButtonColor }}>
                                                    {t('UIEditor.textos.inventoryPlaceholder')}
                                                </button>
                                            )}
                                            {localEnableDiary && (
                                                <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: localSystemButtonBorderColor, color: localSystemButtonTextColor, backgroundColor: localSystemButtonColor }}>
                                                    {t('UIEditor.textos.diaryPlaceholder')}
                                                </button>
                                            )}
                                            {localEnableTrackers && (
                                                <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: localSystemButtonBorderColor, color: localSystemButtonTextColor, backgroundColor: localSystemButtonColor }}>
                                                    {t('UIEditor.textos.trackersPlaceholder')}
                                                </button>
                                            )}
                                            {localGameShowSystemButton && (
                                                <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: localSystemButtonBorderColor, color: localSystemButtonTextColor, backgroundColor: localSystemButtonColor }}>
                                                    {t('UIEditor.textos.systemPlaceholder')}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex gap-1.5 pt-1.5">
                                            <div 
                                                className="flex-1 rounded-md h-8 flex items-center px-2 border-2 transition-all duration-200 outline-none cursor-text" 
                                                style={{ 
                                                    backgroundColor: `color-mix(in srgb, ${localGameBackgroundColor} 98%, #000 2%)`,
                                                    borderColor: isInputFocused ? localFocusColor : localSystemButtonBorderColor,
                                                    boxShadow: isInputFocused ? `0 0 0 1px ${localFocusColor}40` : 'none'
                                                }}
                                                onClick={() => setIsInputFocused(!isInputFocused)}
                                            >
                                                <span className="font-mono truncate" style={{ fontSize: getScaledFontSize(1.0), fontFamily: localFontFamily, color: `color-mix(in srgb, ${localTextColor} 70%, ${localGameBackgroundColor} 30%)` }}>{t('UIEditor.textos.commandInputValue')}</span>
                                            </div>
                                            <button
                                                className="preview-btn-action px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate"
                                                style={{ fontSize: getScaledFontSize(1.0), backgroundColor: localActionButtonColor, color: localActionButtonTextColor, fontFamily: localFontFamily }}
                                            >
                                                {t('UIEditor.aparencia.action')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {previewType === 'vignette' && (
                        <div className="flex items-center justify-center w-full flex-1 animate-in fade-in duration-300">
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
                                        <div className="font-bold uppercase tracking-widest leading-tight" style={{ color: localTitleColor, fontSize: getScaledFontSize(1.2), fontFamily: localFontFamily }}>{t('UIEditor.aparencia.sceneName', 'Título do Capítulo')}</div>
                                    )}
                                    {!localOmitSplashDescription && (
                                        <p className="leading-relaxed" style={{ color: localTextColor, fontSize: getScaledFontSize(1.0), fontFamily: localFontFamily }}>{t('UIEditor.aparencia.sampleVignetteDesc', 'Esta é uma descrição de exemplo para o capítulo.')}</p>
                                    )}
                                    <button
                                        className="preview-btn-splash px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate mt-1"
                                        style={{ fontSize: getScaledFontSize(1.0), backgroundColor: localSplashButtonColor, color: localSplashButtonTextColor, fontFamily: localFontFamily }}
                                    >
                                        {localSplashButtonText || t('UIEditor.aparencia.homeButton', 'Começar')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {previewType === 'menu' && (
                        <div className="flex items-center justify-center w-full flex-1 animate-in fade-in duration-300">
                            <div 
                                className={`w-full aspect-video rounded-2xl border-2 border-muted-foreground/30 relative flex flex-col select-none overflow-hidden justify-center p-8 lg:p-12 ${localStartScreenButtonAlignment === 'left' ? 'items-start text-left' : localStartScreenButtonAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'}`}
                                style={{ backgroundColor: localGameBackgroundColor, maxHeight: '500px' }}
                            >
                                {/* Background image in mockup */}
                                {localStartScreenBgImage && (
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                                        style={{ backgroundImage: `url(${localStartScreenBgImage})` }}
                                    />
                                )}

                                {/* Vignette Overlay (Darkening background to allow reading text) */}
                                <div className="absolute inset-0 bg-black/40 z-0" />

                                {/* Title of mock screen */}
                                <div className={`relative z-10 max-w-[80%] mb-6 flex flex-col ${localStartScreenButtonAlignment === 'left' ? 'items-start' : localStartScreenButtonAlignment === 'right' ? 'items-end' : 'items-center'}`}>
                                    {localShowStartScreenTitle && (
                                        <h1 
                                            className="text-xl font-bold tracking-wider uppercase drop-shadow-md transition-all"
                                            style={{ color: localTitleColor, fontFamily: localFontFamily }}
                                        >
                                            {localStartScreenTitle.trim() || localTitle || 'Título do Jogo'}
                                        </h1>
                                    )}
                                </div>

                                {/* Mock Buttons Container */}
                                <div className={`relative z-10 flex flex-col gap-2 w-44 ${localStartScreenButtonAlignment === 'left' ? 'items-start' : localStartScreenButtonAlignment === 'right' ? 'items-end' : 'items-center'}`}>
                                    <button 
                                        className="preview-btn-system w-full px-4 py-1.5 border-2 rounded font-bold uppercase tracking-widest transition-all cursor-default"
                                        style={{ 
                                            fontFamily: localFontFamily, 
                                            fontSize: '9px',
                                            borderColor: localSystemButtonBorderColor, 
                                            color: localSystemButtonTextColor, 
                                            backgroundColor: localSystemButtonColor 
                                        }}
                                    >
                                        {t('UIEditor.startScreen.newGame', 'Começar de novo')}
                                    </button>
                                    <button 
                                        className="preview-btn-system w-full px-4 py-1.5 border-2 rounded font-bold uppercase tracking-widest transition-all cursor-default"
                                        style={{ 
                                            fontFamily: localFontFamily, 
                                            fontSize: '9px',
                                            borderColor: localSystemButtonBorderColor, 
                                            color: localSystemButtonTextColor, 
                                            backgroundColor: localSystemButtonColor 
                                        }}
                                    >
                                        {t('UIEditor.startScreen.continueGame', 'Continuar')}
                                    </button>
                                    <button 
                                        className="preview-btn-system w-full px-4 py-1.5 border-2 rounded font-bold uppercase tracking-widest transition-all cursor-default"
                                        style={{ 
                                            fontFamily: localFontFamily, 
                                            fontSize: '9px',
                                            borderColor: localSystemButtonBorderColor, 
                                            color: localSystemButtonTextColor, 
                                            backgroundColor: localSystemButtonColor 
                                        }}
                                    >
                                        {t('UIEditor.startScreen.saves', 'Caminhos salvos')}
                                    </button>
                                    <button 
                                        className="preview-btn-system w-full px-4 py-1.5 border-2 rounded font-bold uppercase tracking-widest transition-all cursor-default"
                                        style={{ 
                                            fontFamily: localFontFamily, 
                                            fontSize: '9px',
                                            borderColor: localSystemButtonBorderColor, 
                                            color: localSystemButtonTextColor, 
                                            backgroundColor: localSystemButtonColor 
                                        }}
                                    >
                                        {t('UIEditor.startScreen.options', 'Opções')}
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
