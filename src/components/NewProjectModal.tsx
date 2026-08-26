import React, { useMemo } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { X, Layout, Type, Palette, Play, Upload, Image as ImageIcon, Trash2, ChevronDown, ChevronUp, LayoutTemplate, BookOpen, ArrowRight, Terminal, MousePointerClick, Package, BookText, Heart, Activity, Monitor, MousePointer2, PenTool, AlignLeft, Paintbrush, Split, History as HistoryIcon, List, Lightbulb, Shuffle, FileText } from 'lucide-react';
import { GameData } from '../types';
import { FONTS, PREDEFINED_THEMES } from '../constants';
import { useTranslation } from 'react-i18next';
import { getFramePreviewStyles } from '../utils/frameStyles';
import { useTheme } from './ThemeProvider';
import { DitherShader } from './ui/dither-shader';
import { getDitherColors } from '../utils/themeStyles';
import { ChanceIcon } from './UIEditor/SystemsTab';
import { useNewProjectForm } from '../hooks/useNewProjectForm';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: Partial<GameData>) => void;
}

// Local helper component for Color Input
const ColorInput: React.FC<{ label: string, id: string, value: string, onChange: (val: string) => void, placeholder?: string }> = ({ label, id, value, onChange, placeholder }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
        <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-muted-foreground/50 rounded-lg focus-within:border-primary/50 transition-all h-9 w-full">
            <input
                type="color"
                id={`${id}-picker`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-full p-0 border-none rounded cursor-pointer bg-transparent shrink-0"
            />
            <input
                type="text"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent font-mono text-xs text-zinc-300 focus:outline-none focus:ring-0 uppercase truncate"
                placeholder={placeholder}
            />
        </div>
    </div>
);

// Define App Theme Primary Colors based on index.css
const APP_THEME_COLORS = {
    dark: '#9D4EDD',      // Vibrant Purple
    light: '#18181b',     // Zinc-950 (Dark Grey/Black for Light theme as per :root --primary)
    cream: '#5c4033',     // Approx for warm brown oklch(0.40 0.08 30)
    terminal: '#7EE0A1',   // Vibrant Mint
    windows: '#008080',    // Teal (W95 theme accent)
    ether: '#98bb6c',      // Sage Green (Ether theme accent)
    ristretto: '#fbbf24',  // Amber Yellow (Ristretto theme accent)
    abismo: '#ffffff',     // Pure White (Abismo theme accent)
    system: '#9D4EDD'     // Default fallback
};

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const currentSliderColor = APP_THEME_COLORS[theme as keyof typeof APP_THEME_COLORS] || APP_THEME_COLORS.dark;
    
    const ditherColors = useMemo(() => {
        return getDitherColors(theme, currentSliderColor);
    }, [theme, currentSliderColor]);

    const {
        tab, setTab,
        isInputFocused, setIsInputFocused,
        isColorsExpanded, setIsColorsExpanded,
        previewType, setPreviewType,
        previewStandardScene,
        title, setTitle,
        description, setDescription,
        startButtonText, setStartButtonText,
        splashImage, setSplashImage,
        interactionType, setInteractionType,
        enableInventory, setEnableInventory,
        enableDiary, setEnableDiary,
        enableNotes, setEnableNotes,
        enableChances, setEnableChances,
        enableTrackers, setEnableTrackers,
        enableTextControl, setEnableTextControl,
        textReadingFlow, setTextReadingFlow,
        textAnimationType, setTextAnimationType,
        textSpeed, setTextSpeed,
        enableImages, setEnableImages,
        imageTransitionType, setImageTransitionType,
        imageSpeed, setImageSpeed,
        enableSystemMenu, setEnableSystemMenu,
        startScreenTitle, setStartScreenTitle,
        showStartScreenTitle, setShowStartScreenTitle,
        startScreenBgImage, setStartScreenBgImage,
        menuTransitionType, setMenuTransitionType,
        menuTransitionSpeed, setMenuTransitionSpeed,
        maxChances, setMaxChances,
        chanceIcon, setChanceIcon,
        chanceIconColor, setChanceIconColor,
        diaryShowPlayerAction, setDiaryShowPlayerAction,
        diaryAllowExport, setDiaryAllowExport,
        enableRetrospective, setEnableRetrospective,
        enableSuggestions, setEnableSuggestions,
        splashContentAlignment, setSplashContentAlignment,
        omitSplashTitle, setOmitSplashTitle,
        omitSplashDescription, setOmitSplashDescription,
        layoutOrientation, setLayoutOrientation,
        layoutOrder, setLayoutOrder,
        imageFrame, setImageFrame,
        gameBackgroundColor, setGameBackgroundColor,
        colors, setColors,
        fontFamily, setFontFamily,
        fontSize, setFontSize,
        getScaledFontSize,
        handleImageUpload,
        handleApplyTheme,
        handleCreate,
        handleNext
    } = useNewProjectForm({ onCreate });

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-zinc-950 w-full max-w-[1400px] h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border-2 border-primary"
            >

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-muted-foreground/50 bg-zinc-950/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                            <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">{t('newProject.title', 'Nova Ficção')}</h2>
                            <p className="text-xs text-zinc-400 font-medium">{t('newProject.subtitle', 'Configure os detalhes iniciais da sua aventura')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Tabs Navigation - Full Width */}
                <div className="flex border-b border-muted-foreground/50 bg-zinc-950/50">
                    <button
                        onClick={() => setTab('info')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'info' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-500 hover:text-white hover:bg-primary/25'}`}
                    >
                        {t('newProject.tabs.info', 'Capítulo de abertura')}
                    </button>
                    <button
                        onClick={() => setTab('appearance')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'appearance' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-500 hover:text-white hover:bg-primary/25'}`}
                    >
                        {t('newProject.tabs.appearance', 'Estilo Visual')}
                    </button>
                    <button
                        onClick={() => setTab('system')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'system' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-500 hover:text-white hover:bg-primary/25'}`}
                    >
                        {t('newProject.tabs.system', 'Mecânicas')}
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden grid grid-cols-12">
                    <div className="col-span-12 lg:col-span-5 xl:col-span-5 flex flex-col border-r border-muted-foreground/50 bg-zinc-900/30 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar pb-12">
                            {tab === 'system' && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                                    {/* SECTION: ESTILO DE DECISÃO */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <Shuffle className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{t('UIEditor.sistemas.gameStyle', 'Estilo de Decisão')}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setInteractionType('parser')}
                                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left group ${interactionType === 'parser' ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:border-muted-foreground/50 hover:bg-zinc-900'}`}
                                            >
                                                <div className={`p-3 rounded-lg transition-colors ${interactionType === 'parser' ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                                    <Terminal className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 ${interactionType === 'parser' ? 'text-white' : 'text-zinc-300'}`}>{t('newProject.system.parserTitle', 'Parser (Descreva comandos)')}</h3>
                                                    <p className="text-[11px] text-zinc-400 leading-normal">
                                                        {t('newProject.system.parserDesc', 'O jogador digita ações como "pegar chave" ou "olhar mesa".')}
                                                    </p>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setInteractionType('choice')}
                                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left group ${interactionType === 'choice' ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:border-muted-foreground/50 hover:bg-zinc-900'}`}
                                            >
                                                <div className={`p-3 rounded-lg transition-colors ${interactionType === 'choice' ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                                    <MousePointerClick className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 ${interactionType === 'choice' ? 'text-white' : 'text-zinc-300'}`}>
                                                        {t('newProject.system.choiceTitle', 'IF (Escolha uma opção)')}
                                                    </h3>
                                                    <p className="text-[11px] text-zinc-400 leading-normal">
                                                        {t('newProject.system.choiceDesc', 'O jogador escolhe entre opções pré-definidas para avançar na história.')}
                                                    </p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* SECTION: CONTROLE DE TEXTO */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableTextControl ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => setEnableTextControl(!enableTextControl)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableTextControl ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableTextControl ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableTextControl ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <Type className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableTextControl ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.textControl', 'Controle de Texto')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.textControlDesc', 'Animação e fluxo da descrição de ramificação')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {enableTextControl && (
                                            <div className="mt-4 pt-4 border-t border-muted-foreground/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label htmlFor="modalTextReadingFlow" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.sistemas.readingFlow', 'Fluxo de Leitura')}</label>
                                                        <select
                                                            id="modalTextReadingFlow"
                                                            value={textReadingFlow}
                                                            onChange={(e) => setTextReadingFlow(e.target.value as 'continuous' | 'paused')}
                                                            className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                        >
                                                            <option value="paused">{t('UIEditor.sistemas.flowPaused', 'Pausado (Por Parágrafo)')}</option>
                                                            <option value="continuous">{t('UIEditor.sistemas.flowContinuous', 'Contínuo (Texto Completo)')}</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label htmlFor="modalTextAnimationType" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.sistemas.animationStyle', 'Estilo de Animação')}</label>
                                                        <select
                                                            id="modalTextAnimationType"
                                                            value={textAnimationType}
                                                            onChange={(e) => setTextAnimationType(e.target.value as 'fade' | 'typewriter')}
                                                            className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                        >
                                                            <option value="fade">{t('UIEditor.sistemas.animFade', 'Esmaecer')}</option>
                                                            <option value="typewriter">{t('UIEditor.sistemas.animTypewriter', 'Máquina de Escrever')}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.sistemas.speed', 'Velocidade')}</label>
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="4"
                                                            step="1"
                                                            value={textSpeed}
                                                            onChange={(e) => setTextSpeed(parseInt(e.target.value))}
                                                            style={{
                                                                background: `linear-gradient(to right, ${currentSliderColor} ${((textSpeed - 1) / 3) * 100}%, ${currentSliderColor}33 ${((textSpeed - 1) / 3) * 100}%)`
                                                            }}
                                                            className="flex-1 h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm transition-all"
                                                        />
                                                        <span className="text-xs font-bold text-zinc-400 w-24 shrink-0">
                                                            {textSpeed === 1 ? "Muito Lento" : (textSpeed === 2 ? "Lento" : (textSpeed === 3 ? "Normal" : "Rápido"))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION: IMAGENS NAS RAMIFICAÇÕES */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableImages ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => setEnableImages(!enableImages)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableImages ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableImages ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableImages ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableImages ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.imagesInScenes', 'Imagens nas Ramificações')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.imagesInScenesDesc', 'Ramificações ilustradas por imagens')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {enableImages && (
                                            <div className="mt-4 pt-4 border-t border-muted-foreground/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label htmlFor="modalImageTransitionType" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.sistemas.imageTransition', 'Transição de Imagem')}</label>
                                                        <select
                                                            id="modalImageTransitionType"
                                                            value={imageTransitionType}
                                                            onChange={(e) => setImageTransitionType(e.target.value as 'fade' | 'slide' | 'none')}
                                                            className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                        >
                                                            <option value="fade">{t('UIEditor.sistemas.transFade', 'Esmaecer (Fade)')}</option>
                                                            <option value="slide">{t('UIEditor.sistemas.transSlide', 'Deslizar (Slide)')}</option>
                                                            <option value="none">{t('UIEditor.sistemas.transNone', 'Nenhuma')}</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.sistemas.speed', 'Velocidade')}</label>
                                                        <div className="flex items-center gap-4 h-[34px] pt-1">
                                                            <input
                                                                type="range"
                                                                min="1"
                                                                max="4"
                                                                step="1"
                                                                value={imageSpeed}
                                                                onChange={(e) => setImageSpeed(parseInt(e.target.value))}
                                                                style={{
                                                                    background: `linear-gradient(to right, ${currentSliderColor} ${((imageSpeed - 1) / 3) * 100}%, ${currentSliderColor}33 ${((imageSpeed - 1) / 3) * 100}%)`
                                                                }}
                                                                className="flex-1 h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm transition-all"
                                                            />
                                                            <span className="text-xs font-bold text-zinc-400 w-24 shrink-0">
                                                                {imageSpeed === 1 ? "Muito Lento" : (imageSpeed === 2 ? "Lento" : (imageSpeed === 3 ? "Normal" : "Rápido"))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION: MENU PRINCIPAL E SAVES */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableSystemMenu ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => setEnableSystemMenu(!enableSystemMenu)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableSystemMenu ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableSystemMenu ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableSystemMenu ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <List className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableSystemMenu ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.startMenuTitle', 'Menu Principal')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.systemMenuDesc', 'Habilita o Menu Principal, salvamento manual e o botão/tecla ESC de sistema.')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {enableSystemMenu && (
                                            <div className="mt-4 pt-4 border-t border-muted-foreground/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                                    <div className="space-y-2">
                                                        <label htmlFor="modalStartScreenTitle" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.startScreen.titleText', 'Título da Ficção')}</label>
                                                        <input
                                                            type="text"
                                                            id="modalStartScreenTitle"
                                                            value={startScreenTitle}
                                                            onChange={(e) => setStartScreenTitle(e.target.value)}
                                                            disabled={!showStartScreenTitle}
                                                            className={`w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 transition-all ${!showStartScreenTitle ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                            placeholder={title || 'Digite o título...'}
                                                        />
                                                    </div>
                                                    <label className="flex items-center gap-2 cursor-pointer pb-2 group select-none">
                                                        <div className="relative w-4 h-4 border border-muted-foreground/50 rounded flex items-center justify-center bg-black/50 group-hover:border-primary/50 transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                checked={showStartScreenTitle}
                                                                onChange={(e) => setShowStartScreenTitle(e.target.checked)}
                                                            />
                                                            {showStartScreenTitle && <div className="w-2 h-2 bg-primary rounded-sm" />}
                                                        </div>
                                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide group-hover:text-zinc-300 transition-colors">{t('UIEditor.startScreen.showTitle', 'Exibir Título')}</span>
                                                    </label>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                                    <div className="space-y-2">
                                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.startScreen.bgImage', 'Imagem de Fundo')}</label>
                                                        <div className="flex gap-4 items-start">
                                                            <div className="relative w-20 h-20 bg-zinc-950 border border-muted-foreground/50 rounded-lg overflow-hidden shrink-0 group hover:border-primary/50 transition-colors">
                                                                {startScreenBgImage ? (
                                                                    <>
                                                                        <img src={startScreenBgImage} alt="" className="w-full h-full object-cover" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setStartScreenBgImage('')}
                                                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                                        >
                                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <ImageIcon className="w-6 h-6 text-zinc-700" />
                                                                    </div>
                                                                )}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        if (e.target.files && e.target.files[0]) {
                                                                            const file = e.target.files[0];
                                                                            import('../utils/imageOptimizer').then(({ compressImageToWebP }) => {
                                                                                compressImageToWebP(file).then(setStartScreenBgImage);
                                                                            });
                                                                        }
                                                                    }}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                />
                                                            </div>
                                                            <span className="text-[9px] text-zinc-500 leading-normal">{t('UIEditor.startScreen.suggestedRes', '1920x1080 sugerido')}</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="space-y-1">
                                                            <label htmlFor="modalMenuTransitionType" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.startScreen.transition', 'Transição')}</label>
                                                            <select
                                                                id="modalMenuTransitionType"
                                                                value={menuTransitionType}
                                                                onChange={(e) => setMenuTransitionType(e.target.value as 'fade' | 'slide' | 'none')}
                                                                className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                            >
                                                                <option value="fade">{t('UIEditor.sistemas.transFade', 'Esmaecer')}</option>
                                                                <option value="slide">{t('UIEditor.sistemas.transSlide', 'Deslizar')}</option>
                                                                <option value="none">{t('UIEditor.sistemas.transNone', 'Nenhuma')}</option>
                                                            </select>
                                                        </div>

                                                        {menuTransitionType !== 'none' && (
                                                            <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.sistemas.speed', 'Velocidade')}</label>
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="range"
                                                                        min="1"
                                                                        max="4"
                                                                        step="1"
                                                                        value={menuTransitionSpeed === 200 ? 4 : (menuTransitionSpeed === 500 ? 3 : (menuTransitionSpeed === 1000 ? 2 : (menuTransitionSpeed === 2000 ? 1 : 3)))}
                                                                        onChange={(e) => {
                                                                            const step = parseInt(e.target.value);
                                                                            let speed = 500;
                                                                            if (step === 4) speed = 200;
                                                                            else if (step === 3) speed = 500;
                                                                            else if (step === 2) speed = 1000;
                                                                            else if (step === 1) speed = 2000;
                                                                            setMenuTransitionSpeed(speed);
                                                                        }}
                                                                        style={{
                                                                            background: `linear-gradient(to right, ${currentSliderColor} ${((menuTransitionSpeed === 200 ? 4 : (menuTransitionSpeed === 500 ? 3 : (menuTransitionSpeed === 1000 ? 2 : 1))) - 1) / 3 * 100}%, ${currentSliderColor}33 ${((menuTransitionSpeed === 200 ? 4 : (menuTransitionSpeed === 500 ? 3 : (menuTransitionSpeed === 1000 ? 2 : 1))) - 1) / 3 * 100}%)`
                                                                        }}
                                                                        className="flex-1 h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm transition-all"
                                                                    />
                                                                    <span className="text-xs font-bold text-zinc-400 w-24 shrink-0">
                                                                        {menuTransitionSpeed === 200 ? "Rápido" : (menuTransitionSpeed === 500 ? "Normal" : (menuTransitionSpeed === 1000 ? "Lento" : "Muito Lento"))}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION: SISTEMA DE VIDAS */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableChances ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => setEnableChances(!enableChances)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableChances ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableChances ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableChances ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <Heart className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableChances ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.lifeSystem', 'Sistema de Vidas')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.lifeSystemDesc', 'Limitar tentativas e chances')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {enableChances && (
                                            <div className="mt-4 pt-4 border-t border-muted-foreground/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-end gap-4 w-full">
                                                    <div className="space-y-1 w-20 shrink-0">
                                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.sistemas.lives', 'Vidas')}</label>
                                                        <input
                                                            type="number"
                                                            value={maxChances}
                                                            onChange={(e) => setMaxChances(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                                                            min="1"
                                                            max="10"
                                                            className="w-full h-9 bg-zinc-950 border border-muted-foreground/50 rounded-lg px-2 text-xs font-bold text-center text-zinc-300 focus:ring-1 focus:ring-primary/50 transition-all"
                                                        />
                                                    </div>

                                                    <div className="space-y-1 flex-1 min-w-0">
                                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.sistemas.icon', 'Ícone')}</label>
                                                        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-muted-foreground/50 h-9 w-full">
                                                            {['heart', 'circle', 'square', 'diamond', 'cross'].map((icon) => (
                                                                <button
                                                                    key={icon}
                                                                    type="button"
                                                                    onClick={() => setChanceIcon(icon as 'circle' | 'cross' | 'heart' | 'square' | 'diamond')}
                                                                    className={`flex-1 h-full flex items-center justify-center rounded-md transition-all ${chanceIcon === icon ? 'bg-primary/10 shadow-sm opacity-100 ring-1 ring-primary/20' : 'opacity-30 grayscale-[50%] hover:opacity-100 hover:grayscale-0 hover:bg-zinc-900/50'}`}
                                                                    title={icon}
                                                                >
                                                                    <ChanceIcon type={icon} color={chanceIconColor} className="w-4 h-4" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1 w-32 shrink-0">
                                                        <label htmlFor="modalChanceColor" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('UIEditor.sistemas.color', 'Cor')}</label>
                                                        <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-muted-foreground/50 rounded-lg focus-within:border-primary/50 transition-all h-9 w-full">
                                                            <input
                                                                type="color"
                                                                id="modalChanceColor-picker"
                                                                value={chanceIconColor}
                                                                onChange={(e) => setChanceIconColor(e.target.value)}
                                                                className="w-8 h-full p-0 border-none rounded cursor-pointer bg-transparent shrink-0"
                                                                aria-label="Seletor de cor"
                                                            />
                                                            <input
                                                                type="text"
                                                                id="modalChanceColor"
                                                                value={chanceIconColor}
                                                                onChange={(e) => setChanceIconColor(e.target.value)}
                                                                className="w-full bg-transparent font-mono text-[10px] text-zinc-300 focus:outline-none focus:ring-0 uppercase truncate"
                                                                placeholder="#FF0000"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION: DIÁRIO DE BORDO */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableDiary ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => setEnableDiary(!enableDiary)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableDiary ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableDiary ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableDiary ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableDiary ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.diary', 'Diário de Bordo')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.diaryDesc', 'Registro automático dos eventos da narrativa')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {enableDiary && (
                                            <div className="mt-4 pt-4 border-t border-muted-foreground/20 flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label className="flex items-center gap-2 cursor-pointer group select-none">
                                                    <div className="relative w-4 h-4 border border-muted-foreground/50 rounded flex items-center justify-center bg-black/50 group-hover:border-primary/50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            checked={diaryShowPlayerAction}
                                                            onChange={(e) => setDiaryShowPlayerAction(e.target.checked)}
                                                        />
                                                        {diaryShowPlayerAction && <div className="w-2 h-2 bg-primary rounded-sm" />}
                                                    </div>
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide group-hover:text-zinc-300 transition-colors">{t('UIEditor.sistemas.showPlayerAction', 'Mostrar Ação do Jogador')}</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer group select-none">
                                                    <div className="relative w-4 h-4 border border-muted-foreground/50 rounded flex items-center justify-center bg-black/50 group-hover:border-primary/50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            checked={diaryAllowExport}
                                                            onChange={(e) => setDiaryAllowExport(e.target.checked)}
                                                        />
                                                        {diaryAllowExport && <div className="w-2 h-2 bg-primary rounded-sm" />}
                                                    </div>
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide group-hover:text-zinc-300 transition-colors">{t('UIEditor.sistemas.allowExport', 'Permitir Exportação')}</span>
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION: ANOTAÇÕES */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableNotes ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => setEnableNotes(!enableNotes)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableNotes ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableNotes ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableNotes ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableNotes ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.notes', 'Bloco de Notas')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.notesDesc', 'Permite ao jogador escrever e salvar suas próprias anotações')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: RASTREADORES */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableTrackers ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => setEnableTrackers(!enableTrackers)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableTrackers ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableTrackers ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableTrackers ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableTrackers ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.trackers', 'Rastreadores')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.trackersDesc', 'Barras de progressão que podem impactar a história')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: INVENTÁRIO */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableInventory ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => interactionType !== 'choice' && setEnableInventory(!enableInventory)}
                                                disabled={interactionType === 'choice'}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableInventory ? 'bg-primary' : 'bg-zinc-700'} ${interactionType === 'choice' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableInventory ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableInventory ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableInventory ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.inventory', 'Inventário')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.inventoryDesc', 'Gestão de itens pegos pelo jogador')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: SUGESTÕES */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableSuggestions ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => interactionType !== 'choice' && setEnableSuggestions(!enableSuggestions)}
                                                disabled={interactionType === 'choice'}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableSuggestions ? 'bg-primary' : 'bg-zinc-700'} ${interactionType === 'choice' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableSuggestions ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableSuggestions ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <Lightbulb className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableSuggestions ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.suggestions', 'Sugestões')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.suggestionsDesc', 'Ativa o botão de sugestões de ações.')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: RETROSPECTIVA */}
                                    <div className={`p-5 border rounded-xl transition-all ${enableRetrospective ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/30'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <button
                                                type="button"
                                                onClick={() => setEnableRetrospective(!enableRetrospective)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableRetrospective ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm" style={{ transform: enableRetrospective ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableRetrospective ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <HistoryIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableRetrospective ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('UIEditor.sistemas.retrospective', 'Retrospectiva')}</h4>
                                                    <p className="text-[11px] text-zinc-500 leading-tight">{t('UIEditor.sistemas.retrospectiveDesc', 'Permite ao jogador ver as cenas passadas')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tab === 'info' && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <PenTool className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.info.gameTitleLabel', 'Título')}</h3>
                                        </div>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-black/50 border border-muted-foreground/50 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700 font-bold"
                                            placeholder={t('newProject.info.gameTitlePlaceholder', 'A Caverna dos Dragões')}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <AlignLeft className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.info.descriptionLabel', 'Descrição')}</h3>
                                        </div>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full h-32 bg-black/50 border border-muted-foreground/50 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-1 focus:ring-primary/50 transition-all resize-none placeholder:text-zinc-700 leading-relaxed"
                                            placeholder={t('newProject.info.descriptionPlaceholder', 'Uma breve descrição da sua história...')}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <MousePointer2 className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.info.startButtonLabel', 'Texto do Botão')}</h3>
                                        </div>
                                        <input
                                            type="text"
                                            value={startButtonText}
                                            onChange={(e) => setStartButtonText(e.target.value)}
                                            className="w-full bg-black/50 border border-muted-foreground/50 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700 font-bold"
                                            placeholder={t('newProject.info.startButtonPlaceholder', 'Iniciar Aventura')}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <ImageIcon className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.info.coverImageLabel', 'Imagem de Fundo')}</h3>
                                        </div>
                                        <div className="flex gap-6 items-start">
                                            <div className="relative w-24 h-24 bg-black/50 border border-muted-foreground/50 rounded-lg overflow-hidden shrink-0 group hover:border-muted-foreground/50 transition-colors shadow-inner">
                                                {splashImage ? (
                                                    <>
                                                        <img src={splashImage} alt="Capa" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => setSplashImage('')}
                                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                        >
                                                            <Trash2 className="w-5 h-5 text-red-500" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="w-8 h-8 text-zinc-700" />
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                            <div className="flex-1 space-y-2 pt-1">
                                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                                    {t('newProject.info.coverImageDesc', 'Esta imagem será usada como fundo da tela inicial e do capítulo de abertura caso não seja definida outra.')}
                                                </p>
                                                <p className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold">{t('newProject.info.recommendedDimensions', 'Recomendado: 1920x1080')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 animate-in fade-in duration-500">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <ArrowRight className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.info.vignetteLayoutTitle', 'Layout dos Capítulos')}</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 items-end">
                                            <div className="space-y-2">
                                                <select
                                                    value={splashContentAlignment}
                                                    onChange={(e) => setSplashContentAlignment(e.target.value as 'left' | 'right')}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                >
                                                    <option value="right">{t('UIEditor.layout.alignRight', 'Direita')}</option>
                                                    <option value="left">{t('UIEditor.layout.alignLeft', 'Esquerda')}</option>
                                                </select>
                                            </div>

                                            <div className="flex gap-4 pb-2">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <div className="relative w-4 h-4 border border-muted-foreground/50 rounded flex items-center justify-center bg-black/50 group-hover:border-primary/50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            checked={omitSplashTitle}
                                                            onChange={(e) => setOmitSplashTitle(e.target.checked)}
                                                        />
                                                        {omitSplashTitle && <div className="w-2 h-2 bg-primary rounded-sm" />}
                                                    </div>
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide group-hover:text-zinc-300 transition-colors">{t('UIEditor.layout.hideTitle', 'Ocultar título')}</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <div className="relative w-4 h-4 border border-muted-foreground/50 rounded flex items-center justify-center bg-black/50 group-hover:border-primary/50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            checked={omitSplashDescription}
                                                            onChange={(e) => setOmitSplashDescription(e.target.checked)}
                                                        />
                                                        {omitSplashDescription && <div className="w-2 h-2 bg-primary rounded-sm" />}
                                                    </div>
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide group-hover:text-zinc-300 transition-colors">{t('newProject.info.hideDescription', 'Ocultar descrição')}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tab === 'appearance' && (
                                <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">

                                    {/* SECTION: FONTES & TEXTO */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <Type className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.appearance.fontsTextTitle', 'Fontes e Texto')}</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.fontFamily', 'Família da Fonte')}</label>
                                                <select
                                                    value={fontFamily}
                                                    onChange={(e) => setFontFamily(e.target.value)}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                >
                                                    {FONTS.map(f => (
                                                        <option key={f.family} value={f.family}>{f.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.fontSize', 'Tamanho da Fonte')}</label>
                                                <select
                                                    value={fontSize}
                                                    onChange={(e) => setFontSize(e.target.value)}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                >
                                                    <option value="12">{t('newProject.appearance.sizeSmall', 'Pequeno')} (12px)</option>
                                                    <option value="14">{t('newProject.appearance.sizeMedium', 'Médio')} (14px)</option>
                                                    <option value="16">{t('newProject.appearance.sizeLarge', 'Grande')} (16px)</option>
                                                    <option value="18">{t('newProject.appearance.sizeExtraLarge', 'Extra Grande')} (18px)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: ESTILO & TEMA */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <Paintbrush className="w-4 h-4" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.appearance.styleTheme', 'Estilo & Tema')}</h3>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.predefinedThemesTitle', 'Temas Predefinidos')}</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {PREDEFINED_THEMES.map((theme) => (
                                                    <button
                                                        key={theme.nameKey}
                                                        onClick={() => handleApplyTheme(theme)}
                                                        className="flex flex-col items-center justify-center p-2 rounded-lg border border-muted-foreground/30 bg-zinc-950/50 hover:border-primary/50 hover:bg-zinc-900 transition-all gap-2 group"
                                                    >
                                                        <div className="flex -space-x-1">
                                                            <div className="w-3 h-3 rounded-full border border-muted-foreground/50" style={{ backgroundColor: theme.textColor }}></div>
                                                            <div className="w-3 h-3 rounded-full border border-muted-foreground/50" style={{ backgroundColor: theme.titleColor }}></div>
                                                        </div>
                                                        <span className="text-[8px] font-bold uppercase tracking-tight text-zinc-500 group-hover:text-zinc-100">
                                                {t(`newProject.appearance.predefinedThemes.${theme.nameKey}`, theme.name)}
                                            </span>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="pt-2">
                                                <div
                                                    className="flex items-center justify-start w-full text-left py-2 px-0 cursor-pointer hover:opacity-70 transition-opacity group"
                                                    onClick={() => setIsColorsExpanded(!isColorsExpanded)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest transition-colors group-hover:text-zinc-100">{t('newProject.appearance.customColors', 'Personalização de Cores')}</span>
                                                    <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${isColorsExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>

                                                {isColorsExpanded && (
                                                    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-1">
                                                        {/* Cores de Texto e Fundo */}
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-zinc-300 pb-2">
                                                                <Palette className="w-4 h-4" />
                                                                <h3 className="text-xs font-bold uppercase tracking-widest">{t('UIEditor.aparencia.textAndBg', 'Cores de Texto e Fundo')}</h3>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-4">
                                                                <ColorInput label={t('newProject.appearance.background', 'Fundo do Jogo')} id="bgColor" value={gameBackgroundColor} onChange={(val) => setGameBackgroundColor(val)} />
                                                                <ColorInput label={t('newProject.appearance.text', 'Texto Principal')} id="textColor" value={colors.textColor} onChange={(val) => setColors({ ...colors, textColor: val })} />
                                                                <ColorInput label={t('newProject.appearance.title', 'Títulos e Destaque')} id="titleColor" value={colors.titleColor} onChange={(val) => setColors({ ...colors, titleColor: val })} />
                                                            </div>
                                                        </div>

                                                        {/* Cenas e Interfaces */}
                                                        <div className="space-y-3 pt-4">
                                                            <div className="flex items-center gap-2 text-zinc-300 pb-2">
                                                                <Monitor className="w-4 h-4" />
                                                                <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.appearance.scenesAndInterfaces', 'Ramificações e Interfaces')}</h3>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-4">
                                                                <ColorInput label={t('newProject.appearance.focus', 'Cor de Foco/Interação')} id="focusColor" value={colors.focusColor} onChange={(val) => setColors({ ...colors, focusColor: val })} />
                                                                <ColorInput label={t('newProject.appearance.sceneOverlayBg', 'Nome da Ramificação (Fundo)')} id="overlayBg" value={colors.gameSceneNameOverlayBg} onChange={(val) => setColors({ ...colors, gameSceneNameOverlayBg: val })} />
                                                                <ColorInput label={t('newProject.appearance.sceneOverlayText', 'Nome da Ramificação (Texto)')} id="overlayText" value={colors.gameSceneNameOverlayTextColor} onChange={(val) => setColors({ ...colors, gameSceneNameOverlayTextColor: val })} />
                                                                <ColorInput label={t('newProject.appearance.hearts', 'Cor dos Corações')} id="heartsColor" value={colors.chanceIconColor} onChange={(val) => setColors({ ...colors, chanceIconColor: val })} />
                                                            </div>
                                                        </div>

                                                        {/* Botões da Interface */}
                                                        <div className="space-y-3 pt-4">
                                                            <div className="flex items-center gap-2 text-zinc-300 pb-2">
                                                                <MousePointer2 className="w-4 h-4" />
                                                                <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.appearance.interfaceButtons', 'Botões da Interface')}</h3>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div className="space-y-3">
                                                                    <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-widest">{t('newProject.appearance.actionButton', 'Botão de Ação')}</h4>
                                                                    <ColorInput label={t('newProject.appearance.buttonBg', 'Fundo')} id="actionBtnBg" value={colors.actionButtonColor} onChange={(val) => setColors({ ...colors, actionButtonColor: val })} />
                                                                    <ColorInput label={t('newProject.appearance.buttonText', 'Texto')} id="actionBtnText" value={colors.actionButtonTextColor} onChange={(val) => setColors({ ...colors, actionButtonTextColor: val })} />
                                                                    <ColorInput label={t('newProject.appearance.buttonHover', 'Hover')} id="actionBtnHover" value={colors.actionButtonHoverColor} onChange={(val) => setColors({ ...colors, actionButtonHoverColor: val })} />
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-widest">{t('newProject.appearance.splashButton', 'Botão de Início')}</h4>
                                                                    <ColorInput label={t('newProject.appearance.buttonBg', 'Fundo')} id="splashBtnBg" value={colors.splashButtonColor} onChange={(val) => setColors({ ...colors, splashButtonColor: val })} />
                                                                    <ColorInput label={t('newProject.appearance.buttonText', 'Texto')} id="splashBtnText" value={colors.splashButtonTextColor} onChange={(val) => setColors({ ...colors, splashButtonTextColor: val })} />
                                                                    <ColorInput label={t('newProject.appearance.buttonHover', 'Hover')} id="splashBtnHover" value={colors.splashButtonHoverColor} onChange={(val) => setColors({ ...colors, splashButtonHoverColor: val })} />
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-widest">{t('newProject.appearance.systemButtons', 'Botões de Ferramenta')}</h4>
                                                                    <ColorInput label={t('newProject.appearance.buttonBorder', 'Borda')} id="sysBtnBorder" value={colors.systemButtonBorderColor} onChange={(val) => setColors({ ...colors, systemButtonBorderColor: val })} />
                                                                    <ColorInput label={t('newProject.appearance.buttonHover', 'Hover')} id="sysBtnHover" value={colors.systemButtonHoverColor} onChange={(val) => setColors({ ...colors, systemButtonHoverColor: val })} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: LAYOUT DAS CENAS */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <Split className="w-4 h-4 rotate-90" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest">{t('newProject.appearance.layoutScenes', 'Layout das Ramificações')}</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.orientation', 'Orientação')}</label>
                                                <select
                                                    value={layoutOrientation}
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    onChange={(e) => setLayoutOrientation(e.target.value as any)}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                >
                                                    <option value="vertical">{t('newProject.appearance.vertical', 'Vertical')}</option>
                                                    <option value="horizontal">{t('newProject.appearance.horizontal', 'Horizontal')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.imagePosition', 'Posição da Imagem')}</label>
                                                <select
                                                    value={layoutOrder}
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    onChange={(e) => setLayoutOrder(e.target.value as any)}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                >
                                                    {layoutOrientation === 'vertical' ? (
                                                        <>
                                                            <option value="image-first">{t('newProject.appearance.left', 'Esquerda')}</option>
                                                            <option value="image-last">{t('newProject.appearance.right', 'Direita')}</option>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <option value="image-first">{t('newProject.appearance.above', 'Acima')}</option>
                                                            <option value="image-last">{t('newProject.appearance.below', 'Abaixo')}</option>
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.frameTitle', 'Moldura')}</label>
                                            <select
                                                value={imageFrame}
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                onChange={(e) => setImageFrame(e.target.value as any)}
                                                className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                            >
                                                <option value="none">{t('newProject.appearance.frameNone', 'Sem moldura')}</option>
                                                <option value="rounded-top">{t('newProject.appearance.framePortal', 'Portal')}</option>
                                                <option value="book-cover">{t('newProject.appearance.frameSquare', 'Quadrada')}</option>
                                                <option value="trading-card">{t('newProject.appearance.frameRounded', 'Arredondada')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="col-span-12 lg:col-span-7 xl:col-span-7 bg-black flex flex-col overflow-hidden relative">
                        <style>
                            {`
                                .preview-btn-action { transition: all 0.2s ease; }
                                .preview-btn-action:hover { 
                                    background-color: ${colors.actionButtonHoverColor} !important;
                                    transform: translateY(-1px);
                                }
                                
                                .preview-btn-system { transition: all 0.2s ease; }
                                .preview-btn-system:hover { 
                                    background-color: ${colors.systemButtonHoverColor} !important;
                                    transform: translateY(-1px);
                                }
                                
                                .preview-btn-splash { transition: all 0.2s ease; }
                                .preview-btn-splash:hover { 
                                    background-color: ${colors.splashButtonHoverColor} !important;
                                    transform: translateY(-1px);
                                }

.preview-interactive-text { transition: color 0.2s ease; }
                                .preview-interactive-text:hover {
                                    color: ${colors.focusColor} !important;
                                    cursor: pointer;
                                }
                            `}
                        </style>
                        <div className="flex-1 flex flex-col overflow-hidden p-8 bg-black/50">
                            {/* Standardized Preview Toggle - Same as AppearanceTab */}
                            <div className="flex items-center justify-center gap-3 mb-1 w-full shrink-0 animate-in fade-in slide-in-from-top-2 duration-500">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase whitespace-nowrap">{t('UIEditor.aparencia.previewLabel', 'Example of')}</span>
                                <div className="flex bg-zinc-950 p-1 rounded-lg border border-muted-foreground/50 w-full max-w-[340px] shadow-lg">
                                    <button
                                        onClick={() => setPreviewType('vignette')}
                                        className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${previewType === 'vignette' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        {t('newProject.info.vignetteLayout', 'Layout dos Capítulos')}
                                    </button>
                                    <button
                                        onClick={() => setPreviewType('scene')}
                                        className={`flex-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${previewType === 'scene' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        {t('newProject.appearance.layoutScenes', 'Layout das Ramificações')}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
                                <div className="flex flex-col w-full h-full max-h-[500px] max-w-[889px]">
                                    <div className="flex-1 flex flex-col items-center justify-start overflow-hidden">
                                        {/* Custom Preview Logic from UIEditor */}
                                        {(() => {
                                            if (previewType === 'vignette') {
                                                return (
                                                    <div
                                                        className={`
                                                            relative w-full h-full border border-muted-foreground/50 rounded-xl flex flex-col justify-end overflow-hidden p-8 box-border shadow-2xl transition-all duration-300 max-h-[500px]
                                                            ${layoutOrientation === 'horizontal' ? 'aspect-[9/16]' : 'aspect-video'}
                                                        `}
                                                        style={{
                                                            backgroundColor: gameBackgroundColor,
                                                            alignItems: splashContentAlignment === 'left' ? 'flex-start' : 'flex-end',
                                                            textAlign: splashContentAlignment === 'left' ? 'left' : 'right',
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 opacity-60">
                                                            {splashImage ? (
                                                                <img src={splashImage} alt="" className="w-full h-full object-cover" />
                                                            ) : (
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
                                                            )}
                                                        </div>
                                                        <div className={`relative z-10 w-full flex flex-col gap-3 max-w-[80%] ${splashContentAlignment === 'left' ? 'items-start' : 'items-end'}`}>
                                                            {!omitSplashTitle && (
                                                                <div className="font-bold uppercase tracking-widest leading-tight" style={{ color: colors.titleColor, fontSize: getScaledFontSize(1.4), fontFamily: fontFamily }}>
                                                                    {title || t('newProject.info.gameTitlePlaceholder', 'Título do Jogo')}
                                                                </div>
                                                            )}
                                                            {!omitSplashDescription && (
                                                                <p className="leading-relaxed line-clamp-3" style={{ color: colors.textColor, fontSize: getScaledFontSize(1.0), fontFamily: fontFamily }}>
                                                                    {description || t('newProject.info.descriptionPlaceholder', 'Uma breve descrição da sua história...')}
                                                                </p>
                                                            )}
                                                            <button
                                                                className="preview-btn-splash px-5 h-10 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate mt-2"
                                                                style={{ fontSize: getScaledFontSize(1.0), backgroundColor: colors.splashButtonColor, color: colors.splashButtonTextColor, fontFamily: fontFamily }}
                                                            >
                                                                {startButtonText || t('newProject.info.startButtonPlaceholder', 'Começar')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                const isFrameless = !imageFrame || imageFrame === 'none';
                                                return (
                                                    <div
                                                        className={`
                                                            rounded-xl border shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300 w-full h-full max-h-[500px]
                                                            border-muted-foreground/50
                                                            ${layoutOrientation === 'horizontal' ? 'aspect-[9/16]' : 'aspect-video'}
                                                        `}
                                                        style={{ fontFamily: fontFamily, backgroundColor: gameBackgroundColor }}
                                                    >
                                                        <div className={`flex-1 flex overflow-hidden relative ${
                                                            isFrameless 
                                                                ? (layoutOrientation === 'vertical' ? 'flex-row' : 'flex-col')
                                                                : `p-[30px] gap-[30px] ${layoutOrientation === 'vertical' ? 'flex-row' : 'flex-col'}`
                                                        }`}>
                                                            {/* Image Area */}
                                                            <div
                                                                className={`
                                                                    relative flex items-center justify-center flex-shrink-0 transition-all duration-300
                                                                    ${layoutOrientation === 'vertical' 
                                                                        ? (isFrameless ? 'w-1/2 h-full' : 'w-2/5 h-full') 
                                                                        : 'w-full h-1/2 min-h-[50%]'}
                                                                    ${layoutOrder === 'image-first' ? 'order-first' : 'order-last'}
                                                                `}
                                                            >
                                                                {(() => {
                                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                    const { panelStyles, containerStyles, panelClass, containerClass } = getFramePreviewStyles(imageFrame as any, gameBackgroundColor, '#FFFFFF');

                                                                    return (
                                                                        <div
                                                                            className={panelClass}
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
                                                                                {splashImage ? (
                                                                                    <img src={splashImage} alt="" className="w-full h-full object-cover" />
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
                                                                                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
                                                                                    <div
                                                                                        className="px-2 py-0.5 border uppercase leading-none"
                                                                                        style={{ 
                                                                                            backgroundColor: colors.gameSceneNameOverlayBg, 
                                                                                            color: colors.gameSceneNameOverlayTextColor,
                                                                                            borderColor: `color-mix(in srgb, ${gameBackgroundColor} 80%, ${colors.textColor} 20%)`,
                                                                                            borderWidth: '2px',
                                                                                            fontSize: getScaledFontSize(1.0)
                                                                                        }}
                                                                                    >
                                                                                        {t('UIEditor.aparencia.sceneName', 'Nome da Ramificação')}
                                                                                    </div>
                                                                                    {enableChances && (
                                                                                        <div className="flex gap-1">
                                                                                            {[1, 2].map(i => (
                                                                                                <ChanceIcon key={i} type={chanceIcon} color={chanceIconColor} className="w-4 h-4 shadow-none drop-shadow-none" />
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>

                                                            {/* Text Area */}
                                                            <div className={`flex-1 flex flex-col overflow-hidden ${
                                                                isFrameless
                                                                    ? (layoutOrientation === 'vertical'
                                                                        ? (layoutOrder === 'image-first' ? 'py-[30px] pr-[30px] pl-[24px]' : 'py-[30px] pl-[30px] pr-[24px]')
                                                                        : (layoutOrder === 'image-first' ? 'pb-[30px] px-[30px] pt-[20px]' : 'pt-[30px] px-[30px] pb-[20px]'))
                                                                    : ''
                                                            }`}>
                                                                <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                                                                    <p className="leading-relaxed" style={{ color: colors.textColor, fontSize: getScaledFontSize(1.0) }}>
                                                                        {t('UIEditor.aparencia.sampleDesc1', 'Esta é uma descrição de exemplo para a ramificação. O texto flui conforme as')}
                                                                        <span className="preview-interactive-text" style={{ color: colors.titleColor, fontWeight: 'bold', marginLeft: '4px', marginRight: '4px' }}>{t('UIEditor.aparencia.sampleDescHighlight', 'CONFIGURAÇÕES')}</span>
                                                                        {t('UIEditor.aparencia.sampleDesc2', 'escolhidas.')}
                                                                    </p>
                                                                    <p className="mt-4 opacity-70" style={{ color: colors.textColor, fontFamily: fontFamily, fontSize: getScaledFontSize(1.0) }}>
                                                                        {'>'} {t('UIEditor.aparencia.sampleCommand', 'VERBO DE EXEMPLO')}
                                                                    </p>
                                                                </div>

                                                                {/* Nav + Input Column */}
                                                                <div className="flex-shrink-0 space-y-2 pt-2">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        {enableInventory && (
                                                                            <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: colors.systemButtonBorderColor, color: colors.systemButtonTextColor, backgroundColor: colors.systemButtonColor }}>
                                                                                {t('newProject.features.inventory', 'Inventário')}
                                                                            </button>
                                                                        )}
                                                                        {enableDiary && (
                                                                            <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: colors.systemButtonBorderColor, color: colors.systemButtonTextColor, backgroundColor: colors.systemButtonColor }}>
                                                                                {t('newProject.features.diary', 'Diário')}
                                                                            </button>
                                                                        )}
                                                                        {enableTrackers && (
                                                                            <button className="preview-btn-system px-2.5 py-1 rounded font-bold uppercase tracking-wider border-2" style={{ fontSize: getScaledFontSize(1.0), borderColor: colors.systemButtonBorderColor, color: colors.systemButtonTextColor, backgroundColor: colors.systemButtonColor }}>
                                                                                {t('newProject.features.trackers', 'Status')}
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    {interactionType === 'parser' ? (
                                                                        <div className="flex gap-1.5 pt-1.5">
                                                                            <div 
                                                                                className="flex-1 rounded-md h-8 flex items-center px-2 border-2 transition-all duration-200 outline-none cursor-text" 
                                                                                style={{ 
                                                                                    backgroundColor: `color-mix(in srgb, ${gameBackgroundColor} 98%, #000 2%)`,
                                                                                    borderColor: isInputFocused ? colors.focusColor : colors.systemButtonBorderColor,
                                                                                    boxShadow: isInputFocused ? `0 0 0 1px ${colors.focusColor}40` : 'none'
                                                                                }}
                                                                                onClick={() => setIsInputFocused(!isInputFocused)}
                                                                            >
                                                                                <span className="font-mono truncate" style={{ fontSize: getScaledFontSize(1.0), fontFamily: fontFamily, color: `color-mix(in srgb, ${colors.textColor} 70%, ${gameBackgroundColor} 30%)` }}>{t('UIEditor.textos.commandInputValue', 'o que você faz?')}</span>
                                                                            </div>
                                                                            <button
                                                                                className="preview-btn-action px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate"
                                                                                style={{ fontSize: getScaledFontSize(1.0), backgroundColor: colors.actionButtonColor, color: colors.actionButtonTextColor, fontFamily: fontFamily }}
                                                                            >
                                                                                {t('UIEditor.aparencia.action', 'AÇÃO')}
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="grid grid-cols-2 gap-2 pt-1.5 animate-in fade-in slide-in-from-bottom-1">
                                                                            {previewStandardScene.choices.map((choice) => (
                                                                                <button
                                                                                    key={choice.id}
                                                                                    className="preview-btn-action px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-md flex items-center justify-center truncate"
                                                                                    style={{ 
                                                                                        backgroundColor: colors.actionButtonColor, 
                                                                                        color: colors.actionButtonTextColor, 
                                                                                        fontFamily: fontFamily,
                                                                                        fontSize: getScaledFontSize(1.0),
                                                                                        border: `1px solid ${colors.systemButtonBorderColor}40`
                                                                                    }}
                                                                                >
                                                                                    {choice.label}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>

                                    {/* Footer buttons moved to right column - Aligned to bottom-right of preview */}
                                    <div className="w-full flex justify-end gap-3 pt-6 pb-2">
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {t('common.cancel', 'Cancelar')}
                                        </button>

                                        {tab === 'system' ? (
                                            <button
                                                onClick={handleCreate}
                                                disabled={!title}
                                                className="px-8 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center gap-2"
                                            >
                                                <Play className="w-3 h-3 fill-current" />
                                                {t('newProject.createBtn', 'Criar Projeto')}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleNext}
                                                className="px-8 py-2.5 bg-zinc-100 text-zinc-900 font-bold rounded-xl hover:bg-white transition-all text-xs shadow-lg flex items-center gap-2"
                                            >
                                                {t('newProject.nextBtn', 'Avançar')}
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
