// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useMemo, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { X, Layout, Type, Palette, Play, Upload, Image as ImageIcon, Trash2, ChevronDown, ChevronUp, LayoutTemplate, BookOpen, ArrowRight, Terminal, MousePointerClick, Package, BookText, Heart, SlidersHorizontal, Monitor, MousePointer2, PenTool, AlignLeft, Paintbrush, Split } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GameData, Vignette, Scene } from '../types';
import { initialGameData } from '../lib/gameDefaults';
import { FONTS, PREDEFINED_THEMES } from '../constants';
import { useTranslation } from 'react-i18next';
import { getFramePreviewStyles } from '../utils/frameStyles';
import { useTheme } from './ThemeProvider';
import { DitherShader } from './ui/dither-shader';
import { getDitherColors } from '../utils/themeStyles';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: Partial<GameData>) => void;
}

type Tab = 'info' | 'appearance' | 'system';

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

    const [tab, setTab] = useState<Tab>('info');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isColorsExpanded, setIsColorsExpanded] = useState(false);
    const [previewType, setPreviewType] = useState<'scene' | 'vignette'>('vignette');

    // Info State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startButtonText, setStartButtonText] = useState('');
    const [splashImage, setSplashImage] = useState('');

    // System State
    const [interactionType, setInteractionType] = useState<'parser' | 'choice'>('parser');
    const [enableInventory, setEnableInventory] = useState(true);
    const [enableDiary, setEnableDiary] = useState(true);
    const [enableChances, setEnableChances] = useState(false);
    const [enableTrackers, setEnableTrackers] = useState(true);
    
    // Vignette Layout State
    const [splashContentAlignment, setSplashContentAlignment] = useState<'left' | 'right'>('right');
    const [omitSplashTitle, setOmitSplashTitle] = useState(false);
    const [omitSplashDescription, setOmitSplashDescription] = useState(false);

    // Effect to disable inventory if Interaction Type is Choice (IF)
    React.useEffect(() => {
        if (interactionType === 'choice') {
            setEnableInventory(false);
        } else {
            setEnableInventory(true); // Build default expectation, parser usually has inventory
        }
    }, [interactionType]);
    
    // Auto-switch preview type based on tab
    React.useEffect(() => {
        if (tab === 'info') setPreviewType('vignette');
        else setPreviewType('scene');
    }, [tab]);


    // Appearance State - Structure
    const [layoutOrientation, setLayoutOrientation] = useState<'vertical' | 'horizontal'>('vertical');
    const [layoutOrder, setLayoutOrder] = useState<'image-first' | 'image-last'>('image-first');
    const [imageFrame, setImageFrame] = useState<'none' | 'rounded-top' | 'trading-card' | 'book-cover'>('none');

    // Appearance State - Theme & Colors
    const [gameBackgroundColor, setGameBackgroundColor] = useState('#000000');
    const [colors, setColors] = useState({
        textColor: '#e4e4e7', titleColor: '#58a6ff', focusColor: '#58a6ff',
        splashButtonColor: '#2ea043', splashButtonHoverColor: '#238636', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#ffffff', actionButtonTextColor: '#0d1117',
        actionButtonHoverColor: '#f4f4f5',
        systemButtonColor: 'transparent',
        systemButtonTextColor: '#e4e4e7',
        systemButtonBorderColor: 'rgba(228, 228, 231, 0.25)', // textColor + '40' approx
        systemButtonHoverColor: '#58a6ff',
        chanceIconColor: '#ff4d4d',
        frameBookColor: '#FFFFFF',
        frameTradingCardColor: '#FFFFFF',
        frameRoundedTopColor: '#facc15',
        gameSceneNameOverlayBg: '#0d1117',
        gameSceneNameOverlayTextColor: '#c9d1d9',
        gameContinueIndicatorColor: '#58a6ff'
    });

    // Appearance State - Fonts & Text
    const [fontFamily, setFontFamily] = useState(FONTS[0].family);
    const [fontSize, setFontSize] = useState('12');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [actionButtonText, setActionButtonText] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [verbInputPlaceholder, setVerbInputPlaceholder] = useState('');

    const getScaledFontSize = (factor = 1.0) => {
        const baseSize = /^\d+$/.test(fontSize) ? parseInt(fontSize) : 14;
        const fontInfo = FONTS.find(f => f.family === fontFamily);
        const multiplier = fontInfo?.sizeAdjust || 1.0;
        return `${baseSize * multiplier * factor}px`;
    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setSplashImage(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        if (e.target) e.target.value = '';
    };

    const handleApplyTheme = (preset: any) => {
        setGameBackgroundColor(preset.gameBackgroundColor || '#000000');
        setColors(prev => ({
            ...prev,
            textColor: preset.textColor,
            titleColor: preset.titleColor,
            focusColor: preset.focusColor,
            splashButtonColor: preset.splashButtonColor,
            splashButtonHoverColor: preset.splashButtonHoverColor,
            splashButtonTextColor: preset.splashButtonTextColor,
            actionButtonColor: preset.actionButtonColor,
            actionButtonTextColor: preset.actionButtonTextColor,
            actionButtonHoverColor: preset.actionButtonHoverColor || preset.actionButtonColor,
            systemButtonColor: preset.systemButtonColor || 'transparent',
            systemButtonTextColor: preset.systemButtonTextColor || preset.textColor,
            systemButtonBorderColor: preset.systemButtonBorderColor || (preset.textColor + '40'),
            systemButtonHoverColor: preset.systemButtonHoverColor || preset.focusColor,
            chanceIconColor: preset.chanceIconColor,
            gameContinueIndicatorColor: preset.focusColor
        }));

        const newFrameColor = '#FFFFFF';
        setColors(prev => ({
            ...prev,
            frameBookColor: newFrameColor,
            frameTradingCardColor: newFrameColor,
            frameRoundedTopColor: newFrameColor
        }));
    };

    // Helper for preview scene (Standard Scene)
    const previewStandardScene: Scene = useMemo(() => ({
        id: 'preview_scene',
        name: t('newProject.previewOverlay.sceneName', 'Nome da Ramificação'),
        image: splashImage || '', // Use splash image if available for context
        description: t('newProject.previewOverlay.exampleDesc', 'This is an example description for the scene. The text flows according to the') + ' ' + t('newProject.previewOverlay.exampleDescBold', 'SETTINGS') + ' ' + t('newProject.previewOverlay.exampleDesc2', 'chosen.'),
        interactions: [],
        choices: [
            { id: 'c1', label: t('newProject.previewOverlay.option1', 'Example Option 1'), targetSceneId: 'preview_scene' },
            { id: 'c2', label: t('newProject.previewOverlay.option2', 'Example Option 2'), targetSceneId: 'preview_scene' }
        ],
        objectIds: [],
        exits: {}
    }), [splashImage, t]);

    // Helper for preview vignette (Splash Screen)
    const previewVignetteScene: Scene = useMemo(() => ({
        id: 'VNT_OPENING',
        name: title || t('newProject.info.defaultTitle', 'My New Adventure'), // Map title here
        image: splashImage || '',
        description: description,
        interactions: [],
        objectIds: [],
        // Explicitly set vignetteType for the engine to render it as a vignette
        vignetteType: 'opening',
        vignetteButtonText: startButtonText || t('editor.defaultStartButton', 'COMEÇAR'),
        vignetteNextSceneId: 'preview_scene',
        // Layout settings
        vignetteAlignment: splashContentAlignment,
        vignetteShowTitle: !omitSplashTitle,
        vignetteShowDescription: !omitSplashDescription
    }), [splashImage, description, startButtonText, title, t, splashContentAlignment, omitSplashTitle, omitSplashDescription]);

    const previewGameData: GameData = useMemo(() => ({
        ...initialGameData,
        gameTitle: title,
        gameSplashDescription: description,
        gameSplashButtonText: startButtonText,
        gameSplashImage: splashImage,
        gameInteractionType: interactionType,

        // System Settings
        enableInventory,
        enableDiary,
        enableChances,
        enableTrackers,
        // Since we are toggling them, we also need to make sure the UI reflect it
        gameShowSystemButton: false, // User requested REMOVAL of system button
        gameShowTrackersUI: true, // Always show trackers UI if enabled

        // Appearance
        gameLayoutOrientation: layoutOrientation,
        gameLayoutOrder: layoutOrder,
        gameImageFrame: imageFrame,
        gameBackgroundColor: gameBackgroundColor,
        gameFontFamily: fontFamily,
        gameFontSize: fontSize,
        gameActionButtonText: actionButtonText,
        gameVerbInputPlaceholder: verbInputPlaceholder,
        gameTextSpeed: 3,

        // Vignette Layout
        gameSplashContentAlignment: splashContentAlignment,
        gameOmitSplashTitle: omitSplashTitle,
        gameOmitSplashDescription: omitSplashDescription,

        // Map Colors properly
        gameTextColor: colors.textColor,
        gameTitleColor: colors.titleColor,
        gameFocusColor: colors.focusColor,
        gameSplashButtonColor: colors.splashButtonColor,
        gameSplashButtonHoverColor: colors.splashButtonHoverColor,
        gameSplashButtonTextColor: colors.splashButtonTextColor,
        gameActionButtonColor: colors.actionButtonColor,
        gameActionButtonTextColor: colors.actionButtonTextColor,
        gameChanceIconColor: colors.chanceIconColor,
        frameBookColor: colors.frameBookColor,
        frameTradingCardColor: colors.frameTradingCardColor,
        frameRoundedTopColor: colors.frameRoundedTopColor,
        gameSceneNameOverlayBg: colors.gameSceneNameOverlayBg,
        gameSceneNameOverlayTextColor: colors.gameSceneNameOverlayTextColor,
        gameContinueIndicatorColor: colors.gameContinueIndicatorColor,

        // Inject Preview Scene
        scenes: {
            ...initialGameData.scenes,
            [previewStandardScene.id]: previewStandardScene,
            [previewVignetteScene.id]: previewVignetteScene
        },
        // Force start scene to be the vignette if we want to preview the splash
        startScene: tab === 'info' ? previewVignetteScene.id : previewStandardScene.id,

        vignettes: [{
            id: 'VNT_OPENING',
            name: t('editor.newOpeningVignetteName', 'Abertura'),
            title: title || t('editor.newOpeningVignetteName', 'Abertura'),
            description: description || t('editor.newVignetteDescription', 'Descrição do novo capítulo.'),
            buttonText: startButtonText,
            showTitle: !omitSplashTitle,
            showDescription: !omitSplashDescription,
            alignment: splashContentAlignment,
            textAnimationType: 'fade',
            textSpeed: 3
        }]
    }), [title, description, startButtonText, splashImage, interactionType, layoutOrientation, layoutOrder, imageFrame, gameBackgroundColor, fontFamily, fontSize, actionButtonText, verbInputPlaceholder, colors, previewStandardScene, previewVignetteScene, tab, enableInventory, enableDiary, enableChances, enableTrackers, splashContentAlignment, omitSplashTitle, omitSplashDescription]);

    const handleCreate = () => {
        const startSceneId = 'SCN_OPENING';

        const defaultTitle = t('editor.newOpeningVignetteName', 'Abertura');
        const defaultDescription = t('editor.newVignetteDescription', 'Descrição do novo capítulo.');
        const finalTitle = title || defaultTitle;
        const finalDescription = description || defaultDescription;

        // Create the Opening Vignette as a Scene
        const openingScene: Scene = {
            id: startSceneId,
            name: finalTitle,
            description: finalDescription,
            image: splashImage, // Use the splash image for the scene background if desired, or keep generic/empty
            interactions: [],
            objectIds: [],
            vignetteType: 'opening',
            vignetteButtonText: startButtonText || t('editor.defaultStartButton', 'COMEÇAR'),
            vignetteAlignment: splashContentAlignment,
            vignetteShowTitle: !omitSplashTitle,
            vignetteShowDescription: !omitSplashDescription,
            mapX: 0,
            mapY: 0
        };

        const newGameData: Partial<GameData> = {
            ...previewGameData,
            gameTitle: finalTitle, // Ensure title is synced
            gameSplashDescription: finalDescription,
            gameSplashButtonText: startButtonText,
            gameSplashImage: splashImage,
            startScene: startSceneId,
            scenes: {
                [startSceneId]: openingScene
            },
            sceneOrder: [startSceneId],
            vignettes: [] // Clear legacy vignettes to prevent confusion
        };

        onCreate(newGameData);
    };

    const handleNext = () => {
        if (tab === 'info') setTab('appearance'); // Info -> Appearance
        else if (tab === 'appearance') setTab('system'); // Appearance -> System
    };

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
                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar pb-12">

                            {tab === 'system' && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            onClick={() => setInteractionType('parser')}
                                            className={`flex items-start gap-4 p-6 rounded-xl border transition-all text-left group ${interactionType === 'parser' ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:border-muted-foreground/50 hover:bg-zinc-900'}`}
                                        >
                                            <div className={`p-4 rounded-xl transition-colors ${interactionType === 'parser' ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                                <Terminal className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 ${interactionType === 'parser' ? 'text-white' : 'text-zinc-300'}`}>{t('newProject.system.parserTitle', 'Parser (Descreva comandos)')}</h3>
                                                <p className="text-xs text-zinc-400 leading-relaxed">
                                                    {t('newProject.system.parserDesc', 'O jogador digita ações como "pegar chave" ou "olhar mesa".')}
                                                </p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setInteractionType('choice')}
                                            className={`flex items-start gap-4 p-6 rounded-xl border transition-all text-left group ${interactionType === 'choice' ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:border-muted-foreground/50 hover:bg-zinc-900'}`}
                                        >
                                            <div className={`p-4 rounded-xl transition-colors ${interactionType === 'choice' ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                                <MousePointerClick className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 ${interactionType === 'choice' ? 'text-white' : 'text-zinc-300'}`}>
                                                    {t('newProject.system.choiceTitle', 'IF (Escolha uma opção)')}
                                                </h3>
                                                <p className="text-xs text-zinc-400 leading-relaxed">
                                                    {t('newProject.system.choiceDesc', 'O jogador escolhe entre opções pré-definidas para avançar na história.')}
                                                </p>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${enableInventory ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/50'}`}>
                                            <button
                                                onClick={() => interactionType !== 'choice' && setEnableInventory(!enableInventory)}
                                                disabled={interactionType === 'choice'}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableInventory ? 'bg-primary' : 'bg-zinc-700'} ${interactionType === 'choice' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm`} style={{ transform: enableInventory ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableInventory ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableInventory ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('newProject.features.inventory', 'Inventário')}</h4>
                                                    <p className="text-xs text-zinc-500">{t('newProject.features.inventoryDesc', 'Gestão de itens pegos pelo jogador')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${enableDiary ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/50'}`}>
                                            <button
                                                onClick={() => setEnableDiary(!enableDiary)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableDiary ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm`} style={{ transform: enableDiary ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableDiary ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <BookText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableDiary ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('newProject.features.diary', 'Diário de Bordo')}</h4>
                                                    <p className="text-xs text-zinc-500">{t('newProject.features.diaryDesc', 'Registro automático de eventos')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${enableChances ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/50'}`}>
                                            <button
                                                onClick={() => setEnableChances(!enableChances)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableChances ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm`} style={{ transform: enableChances ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableChances ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <Heart className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableChances ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('newProject.features.chances', 'Sistema de Vidas')}</h4>
                                                    <p className="text-xs text-zinc-500">{t('newProject.features.chancesDesc', 'Limitar tentativas e chances')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${enableTrackers ? 'bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md' : 'bg-black/30 border-muted-foreground/50 hover:bg-zinc-900/50'}`}>
                                            <button
                                                onClick={() => setEnableTrackers(!enableTrackers)}
                                                className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${enableTrackers ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm`} style={{ transform: enableTrackers ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableTrackers ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <SlidersHorizontal className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${enableTrackers ? 'text-zinc-100' : 'text-zinc-500'}`}>{t('newProject.features.trackers', 'Rastreadores')}</h4>
                                                    <p className="text-xs text-zinc-500">{t('newProject.features.trackersDesc', 'Variáveis numéricas (saúde, dinheiro, sanidade)')}</p>
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
                                                return (
                                                    <div
                                                        className={`
                                                            rounded-xl border shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300 w-full h-full max-h-[500px]
                                                            border-muted-foreground/50
                                                            ${layoutOrientation === 'horizontal' ? 'aspect-[9/16]' : 'aspect-video'}
                                                        `}
                                                        style={{ fontFamily: fontFamily, backgroundColor: gameBackgroundColor }}
                                                    >
                                                        <div className={`flex-1 p-[30px] flex gap-[30px] overflow-hidden relative ${layoutOrientation === 'vertical' ? 'flex-row' : 'flex-col'}`}>
                                                            {/* Image Area */}
                                                            <div
                                                                className={`
                                                                    relative flex items-center justify-center flex-shrink-0 transition-all duration-300
                                                                    ${layoutOrientation === 'vertical' ? 'w-2/5 h-full' : 'w-full h-1/2 min-h-[50%]'}
                                                                    ${layoutOrder === 'image-first' ? 'order-first' : 'order-last'}
                                                                `}
                                                            >
                                                                {(() => {
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
                                                                                <div className="absolute top-4 left-4 z-20">
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
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>

                                                            {/* Text Area */}
                                                            <div className="flex-1 flex flex-col overflow-hidden">
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

                                                        {enableChances && (
                                                            <div className="absolute top-6 right-6 flex gap-1 z-20">
                                                                {[1, 2, 3].map(i => (
                                                                    <Heart key={i} className="w-4 h-4 fill-current shadow-none drop-shadow-none" style={{ color: colors.chanceIconColor }} />
                                                                ))}
                                                            </div>
                                                        )}
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
