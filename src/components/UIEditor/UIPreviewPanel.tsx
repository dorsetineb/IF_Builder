import React from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChevronDown, Split, Heart, Circle, Square, Star } from 'lucide-react';
import { FONTS } from '../../constants';
import { getFramePreviewStyles } from '../../utils/frameStyles';
import { DitherShader } from '@/components/ui/dither-shader';

// Helper component for the life icons in preview
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChanceIcon: React.FC<{ type: any, color: string, className?: string }> = ({ type, color, className }) => {
    switch (type) {
        case 'heart': return <Heart className={className} style={{ fill: color, color }} />;
        case 'circle': return <Circle className={className} style={{ fill: color, color }} />;
        case 'square': return <Square className={className} style={{ fill: color, color }} />;
        case 'star': return <Star className={className} style={{ fill: color, color }} />;
        case 'diamond': return (
            <svg className={className} style={{ fill: color, color }} viewBox="0 0 24 24" width="16" height="16">
                <path d="M12 2L2 12l10 10 10-10L12 2z" />
            </svg>
        );
        case 'cross': return (
            <div className={`relative ${className} flex items-center justify-center`} style={{ width: '16px', height: '16px' }}>
                <div className="absolute w-full h-[20%]" style={{ backgroundColor: color }} />
                <div className="absolute h-full w-[20%]" style={{ backgroundColor: color }} />
            </div>
        );
        default: return <Heart className={className} style={{ fill: color, color }} />;
    }
};

interface UIPreviewPanelProps {
    localFontFamily: string;
    localGameFontSize: string;
    localGameBackgroundColor: string;
    localGameFrameColor: string;
    localTextColor: string;
    localTitleColor: string;
    localFocusColor: string;
    localGameContinueIndicatorColor: string;
    localSplashButtonColor: string;
    localSplashButtonTextColor: string;
    localSplashButtonHoverColor: string;
    localActionButtonColor: string;
    localActionButtonTextColor: string;
    localActionButtonHoverColor: string;
    localSystemButtonColor: string;
    localSystemButtonTextColor: string;
    localSystemButtonBorderColor: string;
    localSystemButtonHoverColor: string;
    localSystemButtonHoverTextColor: string;
    localGameSceneNameOverlayBg: string;
    localGameSceneNameOverlayTextColor: string;
    localLayoutOrientation: 'vertical' | 'horizontal';
    localLayoutOrder: 'image-first' | 'image-last';
    localImageFrame: string;
    ditherColors: { primary: string; secondary: string };
    localEnableInventory: boolean;
    localEnableDiary: boolean;
    localEnableNotes: boolean;
    localEnableTrackers: boolean;
    localGameShowSystemButton: boolean;
    localEnableImages: boolean;
    localEnableSuggestions: boolean;
    previewType: 'scene' | 'vignette' | 'menu';
    setPreviewType: (type: 'scene' | 'vignette' | 'menu') => void;
    localSplashContentAlignment: 'left' | 'right';
    localSplashContentVerticalAlignment?: 'center' | 'bottom';
    localOmitSplashTitle: boolean;
    localOmitSplashDescription: boolean;
    localSplashButtonText: string;
    localStartScreenBgImage?: string;
    localShowStartScreenTitle?: boolean;
    localStartScreenTitle?: string;
    localStartScreenButtonAlignment?: 'left' | 'center' | 'right';
    localStartScreenVerticalAlignment?: 'center' | 'bottom';
    localTitle?: string;
    
    // Chances and Interaction variables
    localEnableChances?: boolean;
    localChanceIcon?: 'circle' | 'cross' | 'heart' | 'square' | 'diamond' | 'star';
    localChanceIconColor?: string;
    localMaxChances?: number;
    localGameInteractionType?: 'parser' | 'choice';
    localEnableSystemMenu?: boolean;

    // Custom Text variables
    localSuggestionsButtonText?: string;
    localInventoryButtonText?: string;
    localDiaryButtonText?: string;
    localNotesButtonText?: string;
    localNotesPlaceholderText?: string;
    localTrackersButtonText?: string;
    localActionButtonText?: string;
    localVerbInputPlaceholder?: string;
}

export const UIPreviewPanel: React.FC<UIPreviewPanelProps> = ({
    localFontFamily,
    localGameFontSize,
    localGameBackgroundColor,
    localGameFrameColor,
    localTextColor,
    localTitleColor,
    localFocusColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameContinueIndicatorColor,
    localSplashButtonColor,
    localSplashButtonTextColor,
    localSplashButtonHoverColor,
    localActionButtonColor,
    localActionButtonTextColor,
    localActionButtonHoverColor,
    localSystemButtonColor,
    localSystemButtonTextColor,
    localSystemButtonBorderColor,
    localSystemButtonHoverColor,
    localSystemButtonHoverTextColor,
    localGameSceneNameOverlayBg,
    localGameSceneNameOverlayTextColor,
    localLayoutOrientation,
    localLayoutOrder,
    localImageFrame,
    ditherColors,
    localEnableInventory,
    localEnableDiary,
    localEnableNotes,
    localEnableTrackers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameShowSystemButton,
    localEnableImages,
    localEnableSuggestions,
    localEnableSystemMenu,
    previewType,
    setPreviewType,
    localSplashContentAlignment,
    localSplashContentVerticalAlignment = 'bottom',
    localOmitSplashTitle,
    localOmitSplashDescription,
    localSplashButtonText,
    localStartScreenBgImage = '',
    localShowStartScreenTitle = true,
    localStartScreenTitle = '',
    localStartScreenButtonAlignment = 'center',
    localStartScreenVerticalAlignment = 'center',
    localTitle = '',
    
    localEnableChances = false,
    localChanceIcon = 'heart',
    localChanceIconColor = '#ff4d4d',
    localMaxChances = 3,
    localGameInteractionType = 'parser',
    localSuggestionsButtonText = '',
    localInventoryButtonText = '',
    localDiaryButtonText = '',
    localNotesButtonText = '',
    localTrackersButtonText = '',
    localActionButtonText = '',
    localVerbInputPlaceholder = ''
}) => {
    const { t } = useTranslation();
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    // Typing animation loop for narrative preview text
    const part1 = t('UIEditor.aparencia.sampleDesc1', 'Você se encontra diante de um portal de pedra antiga. As runas gravadas na rocha parecem ');
    const highlight = t('UIEditor.aparencia.sampleDescHighlight', 'brilhar com uma luz pulsante.');
    const part2 = t('UIEditor.aparencia.sampleDesc2', ' O vento frio sussurra segredos através das frestas, incitando-o a dar o próximo passo.');
    const fullText = part1 + highlight + part2;

    const [visibleChars, setVisibleChars] = React.useState(0);

    React.useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let timer: any;
        if (visibleChars < fullText.length) {
            timer = setTimeout(() => {
                setVisibleChars(prev => prev + 1);
            }, 30); // 30ms per character typing speed
        } else {
            // Stay completed for 3 seconds, then restart the animation loop
            timer = setTimeout(() => {
                setVisibleChars(0);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [visibleChars, fullText.length]);

    const renderAnimatedText = () => {
        const p1Len = part1.length;
        const hLen = highlight.length;

        if (visibleChars <= p1Len) {
            return (
                <span>
                    {part1.slice(0, visibleChars)}
                </span>
            );
        } else if (visibleChars <= p1Len + hLen) {
            return (
                <span>
                    {part1}
                    <span className="preview-interactive-text font-bold" style={{ color: localFocusColor }}>
                        {highlight.slice(0, visibleChars - p1Len)}
                    </span>
                </span>
            );
        } else {
            return (
                <span>
                    {part1}
                    <span className="preview-interactive-text font-bold" style={{ color: localFocusColor }}>
                        {highlight}
                    </span>
                    {part2.slice(0, visibleChars - p1Len - hLen)}
                </span>
            );
        }
    };

    const getScaledFontSize = (factor = 1.0) => {
        const baseSize = /^\d+$/.test(localGameFontSize) ? parseInt(localGameFontSize) : 14;
        const fontInfo = FONTS.find(f => f.family === localFontFamily);
        const multiplier = fontInfo?.sizeAdjust || 1.0;
        return `${baseSize * multiplier * factor}px`;
    };

    return (
        <div className="relative h-full flex flex-col">
            <div className="space-y-6 flex flex-col">
                <div className="flex items-center justify-start gap-3 mb-4 w-full">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap text-zinc-400">
                        {t('UIEditor.aparencia.previewLabel', 'Example of')}
                    </span>
                    <div className="flex bg-background rounded-lg p-1 border border-muted-foreground/50 w-full max-w-[480px]">
                        <button
                            onClick={() => setPreviewType('scene')}
                            className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                previewType === 'scene'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {t('UIEditor.tabs.scenes', 'Ramificações')}
                        </button>
                        <button
                            onClick={() => setPreviewType('vignette')}
                            className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                previewType === 'vignette'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {t('UIEditor.tabs.chapters', 'Capítulos')}
                        </button>
                        <button
                            onClick={() => localEnableSystemMenu && setPreviewType('menu')}
                            className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                previewType === 'menu'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : !localEnableSystemMenu
                                        ? 'text-muted-foreground/30 cursor-not-allowed opacity-50'
                                        : 'text-muted-foreground hover:text-foreground'
                            }`}
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
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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
                        <div className={`flex-1 p-[30px] flex gap-[30px] overflow-hidden relative ${localLayoutOrientation === 'vertical' && localEnableImages ? 'flex-row' : 'flex-col'}`}>
                            {/* Image Area */}
                            {localEnableImages && (
                                <div
                                    className={`
                                        relative flex items-center justify-center flex-shrink-0 transition-all duration-300
                                        ${localLayoutOrientation === 'vertical' ? 'w-2/5 h-full' : 'w-full h-1/2 min-h-[50%]'}
                                        ${localLayoutOrder === 'image-first' ? 'order-first' : 'order-last'}
                                    `}
                                >
                                    {(() => {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                                    {localEnableChances && (
                                                        <div className="absolute top-4 right-4 z-20 flex gap-1">
                                                            {Array.from({ length: localMaxChances }).map((_, i) => (
                                                                <ChanceIcon 
                                                                    key={i} 
                                                                    type={localChanceIcon} 
                                                                    color={localChanceIconColor} 
                                                                    className="w-4 h-4 animate-pulse" 
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Text Area */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                                    {!localEnableImages && (
                                         <div className="flex justify-between items-center mb-4 pb-2 border-b-2" style={{ borderColor: `color-mix(in srgb, ${localGameBackgroundColor} 80%, ${localTextColor} 20%)` }}>
                                             <div
                                                 className="px-2 py-0.5 border uppercase leading-none"
                                                 style={{ 
                                                     backgroundColor: localGameSceneNameOverlayBg, 
                                                     color: localGameSceneNameOverlayTextColor,
                                                     borderColor: `color-mix(in srgb, ${localGameBackgroundColor} 80%, ${localTextColor} 20%)`,
                                                     borderWidth: '2px',
                                                     fontSize: getScaledFontSize(0.85)
                                                 }}
                                             >
                                                 {t('UIEditor.aparencia.sceneName')}
                                             </div>
                                             {localEnableChances && (
                                                 <div className="flex gap-1">
                                                     {Array.from({ length: localMaxChances }).map((_, i) => (
                                                         <ChanceIcon 
                                                             key={i} 
                                                             type={localChanceIcon} 
                                                             color={localChanceIconColor} 
                                                             className="w-3.5 h-3.5" 
                                                         />
                                                     ))}
                                                 </div>
                                             )}
                                         </div>
                                     )}
                                    <p className="leading-relaxed" style={{ color: localTextColor, fontSize: getScaledFontSize(1.0) }}>
                                        {renderAnimatedText()}
                                    </p>
                                    <p className="mt-4 opacity-70" style={{ color: localTextColor, fontFamily: localFontFamily, fontSize: getScaledFontSize(1.0) }}>
                                        {'>'} {t('UIEditor.aparencia.sampleCommand')}
                                    </p>
                                </div>

                                {/* Nav + Input Column */}
                                <div className="flex-shrink-0 space-y-2 pt-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        {localEnableSuggestions && (
                                            <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: localSystemButtonBorderColor, color: localSystemButtonTextColor, backgroundColor: localSystemButtonColor }}>
                                                {localSuggestionsButtonText || t('UIEditor.textos.suggestionsPlaceholder', 'Sugestões')}
                                            </button>
                                        )}
                                        {localEnableInventory && (
                                            <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: localSystemButtonBorderColor, color: localSystemButtonTextColor, backgroundColor: localSystemButtonColor }}>
                                                {localInventoryButtonText || t('UIEditor.textos.inventoryPlaceholder', 'Inventário')}
                                            </button>
                                        )}
                                        {localEnableDiary && (
                                            <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: localSystemButtonBorderColor, color: localSystemButtonTextColor, backgroundColor: localSystemButtonColor }}>
                                                {localDiaryButtonText || t('UIEditor.textos.diaryPlaceholder', 'Diário')}
                                            </button>
                                        )}
                                        {localEnableNotes && (
                                            <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: localSystemButtonBorderColor, color: localSystemButtonTextColor, backgroundColor: localSystemButtonColor }}>
                                                {localNotesButtonText || t('UIEditor.textos.notesPlaceholder', 'Anotações')}
                                            </button>
                                        )}
                                        {localEnableTrackers && (
                                            <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: localSystemButtonBorderColor, color: localSystemButtonTextColor, backgroundColor: localSystemButtonColor }}>
                                                {localTrackersButtonText || t('UIEditor.textos.trackersPlaceholder', 'Rastreadores')}
                                            </button>
                                        )}
                                    </div>

                                    {localGameInteractionType === 'choice' ? (
                                         <div className="flex flex-col gap-2 pt-1.5">
                                             <button 
                                                 className="w-full text-left px-3 py-1.5 border rounded-md transition-all font-semibold"
                                                 style={{ 
                                                     fontSize: getScaledFontSize(0.9), 
                                                     color: localTextColor, 
                                                     borderColor: localSystemButtonBorderColor, 
                                                     backgroundColor: `color-mix(in srgb, ${localGameBackgroundColor} 95%, #fff 5%)`
                                                 }}
                                                 onMouseEnter={(e) => {
                                                     e.currentTarget.style.color = localFocusColor;
                                                     e.currentTarget.style.borderColor = localFocusColor;
                                                 }}
                                                 onMouseLeave={(e) => {
                                                     e.currentTarget.style.color = localTextColor;
                                                     e.currentTarget.style.borderColor = localSystemButtonBorderColor;
                                                 }}
                                             >
                                                 1. {t('UIEditor.aparencia.choiceSample1', 'Avançar silenciosamente em direção ao portal')}
                                             </button>
                                             <button 
                                                 className="w-full text-left px-3 py-1.5 border rounded-md transition-all font-semibold"
                                                 style={{ 
                                                     fontSize: getScaledFontSize(0.9), 
                                                     color: localTextColor, 
                                                     borderColor: localSystemButtonBorderColor, 
                                                     backgroundColor: `color-mix(in srgb, ${localGameBackgroundColor} 95%, #fff 5%)`
                                                 }}
                                                 onMouseEnter={(e) => {
                                                     e.currentTarget.style.color = localFocusColor;
                                                     e.currentTarget.style.borderColor = localFocusColor;
                                                 }}
                                                 onMouseLeave={(e) => {
                                                     e.currentTarget.style.color = localTextColor;
                                                     e.currentTarget.style.borderColor = localSystemButtonBorderColor;
                                                 }}
                                             >
                                                 2. {t('UIEditor.aparencia.choiceSample2', 'Examinar as runas antigas gravadas nas laterais')}
                                             </button>
                                         </div>
                                     ) : (
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
                                                 <span className="font-mono truncate" style={{ fontSize: getScaledFontSize(1.0), fontFamily: localFontFamily, color: `color-mix(in srgb, ${localTextColor} 70%, ${localGameBackgroundColor} 30%)` }}>
                                                     {localVerbInputPlaceholder || t('UIEditor.textos.commandInputValue', 'o que deseja fazer?')}
                                                 </span>
                                             </div>
                                             <button
                                                 className="preview-btn-action px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate"
                                                 style={{ fontSize: getScaledFontSize(1.0), backgroundColor: localActionButtonColor, color: localActionButtonTextColor, fontFamily: localFontFamily }}
                                             >
                                                 {localActionButtonText || t('UIEditor.aparencia.action', 'Ação')}
                                             </button>
                                         </div>
                                     )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {previewType === 'vignette' && (
                    <div className="flex items-center justify-center w-full flex-1 animate-in fade-in duration-300">
                        <div
                            className={`relative w-full aspect-video bg-muted border border-muted-foreground/50 rounded-xl flex flex-col ${localSplashContentVerticalAlignment === 'center' ? 'justify-center' : 'justify-end'} overflow-hidden p-8 lg:p-12 box-border shadow-2xl`}
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
                                    <div className="font-bold uppercase tracking-widest leading-tight" style={{ color: localTitleColor, fontSize: getScaledFontSize(1.2), fontFamily: localFontFamily }}>
                                        {t('UIEditor.aparencia.sceneName', 'Título do Capítulo')}
                                    </div>
                                )}
                                {!localOmitSplashDescription && (
                                    <p className="leading-relaxed" style={{ color: localTextColor, fontSize: getScaledFontSize(1.0), fontFamily: localFontFamily }}>
                                        {t('UIEditor.aparencia.sampleVignetteDesc', 'Esta é uma descrição de exemplo para o capítulo.')}
                                    </p>
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
                            className={`w-full aspect-video rounded-2xl border-2 border-muted-foreground/30 relative flex flex-col select-none overflow-hidden p-8 lg:p-12 ${localStartScreenVerticalAlignment === 'bottom' ? 'justify-end' : 'justify-center'} ${localStartScreenButtonAlignment === 'left' ? 'items-start text-left' : localStartScreenButtonAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'}`}
                            style={{ backgroundColor: localGameBackgroundColor, maxHeight: '500px' }}
                        >
                            {localStartScreenBgImage ? (
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                                    style={{ backgroundImage: `url(${localStartScreenBgImage})` }}
                                />
                            ) : (
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
                            )}

                            {/* Vignette Overlay (Darkening background) */}
                            <div className="absolute inset-0 bg-black/40 z-0" />

                            {/* Title */}
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
    );
};
