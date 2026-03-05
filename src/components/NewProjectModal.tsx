// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useMemo, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { X, Layout, Type, Palette, Play, Upload, Image as ImageIcon, Trash2, ChevronDown, ChevronUp, LayoutTemplate, BookOpen, ArrowRight, Terminal, MousePointerClick, Package, BookText, Heart, SlidersHorizontal } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GameData, Vignette, Scene } from '../types';
import { initialGameData } from '../lib/gameDefaults';
import { FONTS, PREDEFINED_THEMES } from '../constants';
import Preview from './Preview';
import { useTranslation } from 'react-i18next';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: Partial<GameData>) => void;
}

type Tab = 'info' | 'system' | 'appearance';

// Local helper component for Color Input
const ColorInput: React.FC<{ label: string, id: string, value: string, onChange: (val: string) => void, placeholder?: string }> = ({ label, id, value, onChange, placeholder }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
        <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-lg focus-within:border-primary/50 transition-all h-9 w-full">
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

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
    const { t } = useTranslation();
    const [tab, setTab] = useState<Tab>('info');

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

    // Effect to disable inventory if Interaction Type is Choice (IF)
    React.useEffect(() => {
        if (interactionType === 'choice') {
            setEnableInventory(false);
        } else {
            setEnableInventory(true); // Build default expectation, parser usually has inventory
        }
    }, [interactionType]);

    // Appearance State - Structure
    const [layoutOrientation, setLayoutOrientation] = useState<'vertical' | 'horizontal'>('vertical');
    const [layoutOrder, setLayoutOrder] = useState<'image-first' | 'image-last'>('image-first');
    const [imageFrame, setImageFrame] = useState<'none' | 'rounded-top' | 'trading-card' | 'book-cover'>('none');

    // Appearance State - Theme & Colors
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [colors, setColors] = useState({
        textColor: '#e4e4e7', titleColor: '#58a6ff', focusColor: '#58a6ff',
        textColorLight: '#18181b', titleColorLight: '#0969da', focusColorLight: '#0969da',
        splashButtonColor: '#2ea043', splashButtonHoverColor: '#238636', splashButtonTextColor: '#ffffff',
        actionButtonColor: '#ffffff', actionButtonTextColor: '#0d1117',
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

    // Collapsible sections state
    const [activeSections, setActiveSections] = useState({
        estrutura: true,
        estilo: true,
        texto: false,
        cores: false
    });

    const toggleSection = (section: keyof typeof activeSections) => {
        setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
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

    const handleApplyTheme = (preset: typeof PREDEFINED_THEMES[0]) => {
        setTheme(preset.mode as 'dark' | 'light');
        setColors(prev => ({
            ...prev,
            textColor: preset.textColor,
            titleColor: preset.titleColor,
            focusColor: preset.focusColor,
            textColorLight: preset.textColorLight,
            titleColorLight: preset.titleColorLight,
            focusColorLight: preset.focusColorLight,
            splashButtonColor: preset.splashButtonColor,
            splashButtonHoverColor: preset.splashButtonHoverColor,
            splashButtonTextColor: preset.splashButtonTextColor,
            actionButtonColor: preset.actionButtonColor,
            actionButtonTextColor: preset.actionButtonTextColor,
            chanceIconColor: preset.chanceIconColor,
            gameContinueIndicatorColor: preset.focusColor
        }));

        const newFrameColor = (preset.mode as 'dark' | 'light') === 'dark' ? '#FFFFFF' : '#1a202c';
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
        name: t('newProject.previewOverlay.sceneName', 'Scene Name'),
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
        vignetteButtonText: startButtonText,
        vignetteNextSceneId: 'preview_scene'
    }), [splashImage, description, startButtonText, title]);

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
        gameTheme: theme,
        gameFontFamily: fontFamily,
        gameFontSize: fontSize,
        gameActionButtonText: actionButtonText,
        gameVerbInputPlaceholder: verbInputPlaceholder,
        gameTextSpeed: 3,

        // Map Colors properly
        gameTextColor: colors.textColor,
        gameTitleColor: colors.titleColor,
        gameFocusColor: colors.focusColor,
        textColorLight: colors.textColorLight,
        titleColorLight: colors.titleColorLight,
        focusColorLight: colors.focusColorLight,
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
            name: t('editor.newVignetteName', 'Nova Vinheta'),
            title: title || t('editor.newVignetteName', 'Nova Vinheta'),
            description: description || t('editor.newVignetteDescription', 'Descrição da nova vinheta.'),
            buttonText: startButtonText,
            showTitle: true,
            showDescription: true,
            textAnimationType: 'fade',
            textSpeed: 3
        }]
    }), [title, description, startButtonText, splashImage, interactionType, layoutOrientation, layoutOrder, imageFrame, theme, fontFamily, fontSize, actionButtonText, verbInputPlaceholder, colors, previewStandardScene, previewVignetteScene, tab, enableInventory, enableDiary, enableChances, enableTrackers]);

    const handleCreate = () => {
        const startSceneId = 'SCN_OPENING';

        const defaultTitle = t('editor.newVignetteName', 'Nova Vinheta');
        const defaultDescription = t('editor.newVignetteDescription', 'Descrição da nova vinheta.');
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
            vignetteButtonText: startButtonText,
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
        if (tab === 'info') setTab('system'); // Info -> System
        else if (tab === 'system') setTab('appearance'); // System -> Appearance
    };

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div onClick={(e) => e.stopPropagation()} className="bg-zinc-950 border border-zinc-500 w-full max-w-6xl h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/50">
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

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                    {/* Left Column: FormTabs */}
                    <div className="w-full lg:w-1/2 flex flex-col border-r border-zinc-800 bg-zinc-900/30">
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-zinc-800">
                            <button
                                onClick={() => setTab('info')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${tab === 'info' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                            >
                                {t('newProject.tabs.info', 'Informações')}
                            </button>
                            <button
                                onClick={() => setTab('system')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${tab === 'system' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                            >
                                {t('newProject.tabs.system', 'Sistema')}
                            </button>
                            <button
                                onClick={() => setTab('appearance')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${tab === 'appearance' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                            >
                                {t('newProject.tabs.appearance', 'Aparência')}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                            {tab === 'system' && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            onClick={() => setInteractionType('parser')}
                                            className={`flex items-start gap-4 p-6 rounded-xl border transition-all text-left group ${interactionType === 'parser' ? 'bg-primary/10 border-primary ring-1 ring-primary/50' : 'bg-black/30 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'}`}
                                        >
                                            <div className={`p-4 rounded-xl ${interactionType === 'parser' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                                <Terminal className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className={`text-sm font-bold uppercase tracking-wide mb-1 ${interactionType === 'parser' ? 'text-white' : 'text-zinc-300'}`}>{t('newProject.system.parserTitle', 'Parser (Descreva comandos)')}</h3>
                                                <p className="text-xs text-zinc-400 leading-relaxed">
                                                    {t('newProject.system.parserDesc', 'O jogador digita ações como "pegar chave" ou "olhar mesa".')}
                                                </p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setInteractionType('choice')}
                                            className={`flex items-start gap-4 p-6 rounded-xl border transition-all text-left group ${interactionType === 'choice' ? 'bg-primary/10 border-primary ring-1 ring-primary/50' : 'bg-black/30 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'}`}
                                        >
                                            <div className={`p-4 rounded-xl ${interactionType === 'choice' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                                <MousePointerClick className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className={`text-sm font-bold uppercase tracking-wide mb-1 ${interactionType === 'choice' ? 'text-white' : 'text-zinc-300'}`}>{t('newProject.system.choiceTitle', 'IF (Escolha uma opção)')}</h3>
                                                <p className="text-xs text-zinc-400 leading-relaxed">
                                                    {t('newProject.system.choiceDesc', 'O jogador escolhe entre opções pré-definidas para avançar na história.')}
                                                </p>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="w-full h-px bg-zinc-800 my-2"></div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center justify-between p-4 bg-black/30 border border-zinc-800 rounded-xl hover:bg-zinc-900/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableInventory ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-sm font-bold uppercase tracking-wide mb-1 ${enableInventory ? 'text-white' : 'text-zinc-400'}`}>{t('newProject.features.inventory', 'Inventário')}</h4>
                                                    <p className="text-xs text-zinc-500">{t('newProject.features.inventoryDesc', 'Gestão de itens pegos pelo jogador')}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => interactionType !== 'choice' && setEnableInventory(!enableInventory)}
                                                disabled={interactionType === 'choice'}
                                                className={`w-12 h-6 rounded-full relative transition-all ${enableInventory ? 'bg-primary' : 'bg-zinc-700'} ${interactionType === 'choice' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm`} style={{ transform: enableInventory ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-black/30 border border-zinc-800 rounded-xl hover:bg-zinc-900/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableDiary ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <BookText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-sm font-bold uppercase tracking-wide mb-1 ${enableDiary ? 'text-white' : 'text-zinc-400'}`}>{t('newProject.features.diary', 'Diário de Bordo')}</h4>
                                                    <p className="text-xs text-zinc-500">{t('newProject.features.diaryDesc', 'Registro automático de eventos')}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setEnableDiary(!enableDiary)}
                                                className={`w-12 h-6 rounded-full relative transition-all ${enableDiary ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm`} style={{ transform: enableDiary ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-black/30 border border-zinc-800 rounded-xl hover:bg-zinc-900/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableChances ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <Heart className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-sm font-bold uppercase tracking-wide mb-1 ${enableChances ? 'text-white' : 'text-zinc-400'}`}>{t('newProject.features.chances', 'Sistema de Vidas')}</h4>
                                                    <p className="text-xs text-zinc-500">{t('newProject.features.chancesDesc', 'Limitar tentativas e chances')}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setEnableChances(!enableChances)}
                                                className={`w-12 h-6 rounded-full relative transition-all ${enableChances ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm`} style={{ transform: enableChances ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-black/30 border border-zinc-800 rounded-xl hover:bg-zinc-900/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${enableTrackers ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    <SlidersHorizontal className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`text-sm font-bold uppercase tracking-wide mb-1 ${enableTrackers ? 'text-white' : 'text-zinc-400'}`}>{t('newProject.features.trackers', 'Rastreadores')}</h4>
                                                    <p className="text-xs text-zinc-500">{t('newProject.features.trackersDesc', 'Variáveis numéricas (saúde, dinheiro, sanidade)')}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setEnableTrackers(!enableTrackers)}
                                                className={`w-12 h-6 rounded-full relative transition-all ${enableTrackers ? 'bg-primary' : 'bg-zinc-700'}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm`} style={{ transform: enableTrackers ? 'translateX(24px)' : 'translateX(0)' }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tab === 'info' && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('newProject.info.gameTitleLabel', 'Título do Jogo')}</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700 font-bold"
                                            placeholder={t('newProject.info.gameTitlePlaceholder', 'Ex: A Caverna dos Dragões')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('newProject.info.descriptionLabel', 'Sinopse / Descrição')}</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full h-32 bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-1 focus:ring-primary/50 transition-all resize-none placeholder:text-zinc-700 leading-relaxed"
                                            placeholder={t('newProject.info.descriptionPlaceholder', 'Uma breve descrição da sua história...')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('newProject.info.startButtonLabel', 'Texto do Botão de Início')}</label>
                                        <input
                                            type="text"
                                            value={startButtonText}
                                            onChange={(e) => setStartButtonText(e.target.value)}
                                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700 font-bold"
                                            placeholder={t('newProject.info.startButtonPlaceholder', 'Ex: Iniciar Aventura')}
                                        />
                                    </div>

                                    <div className="flex gap-4 items-start bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                                        <div className="relative w-24 h-24 bg-black/50 border border-zinc-800 rounded-lg overflow-hidden shrink-0 group hover:border-zinc-600 transition-colors">
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
                                        <div className="flex-1 space-y-2">
                                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('newProject.info.coverImageLabel', 'Capa / Imagem de Fundo')}</label>
                                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                                                {t('newProject.info.coverImageDesc', 'Esta imagem será usada como fundo da tela inicial e da cena de abertura caso não seja definida outra.')}
                                            </p>
                                            <p className="text-[9px] text-zinc-600 uppercase tracking-wider">{t('newProject.info.recommendedDimensions', 'Recomendado: 1920x1080')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tab === 'appearance' && (
                                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">

                                    {/* SECTION: ESTRUTURA */}
                                    <div className="bg-black/30 border border-zinc-800 rounded-xl p-4">
                                        <button
                                            onClick={() => toggleSection('estrutura')}
                                            className="flex items-center justify-between w-full text-left group hover:opacity-80 transition-opacity"
                                        >
                                            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                                                <LayoutTemplate className="w-4 h-4 text-zinc-500" /> {t('newProject.appearance.structureTitle', 'ESTRUTURA')}
                                            </h3>
                                            {activeSections.estrutura ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                        </button>

                                        {activeSections.estrutura && (
                                            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.orientation', 'Orientação')}</label>
                                                    <select
                                                        value={layoutOrientation}
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        onChange={(e) => setLayoutOrientation(e.target.value as any)}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
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
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
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
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.frameTitle', 'Moldura')}</label>
                                                    <select
                                                        value={imageFrame}
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        onChange={(e) => setImageFrame(e.target.value as any)}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                    >
                                                        <option value="none">{t('newProject.appearance.frameNone', 'Sem moldura')}</option>
                                                        <option value="rounded-top">{t('newProject.appearance.framePortal', 'Portal')}</option>
                                                        <option value="book-cover">{t('newProject.appearance.frameSquare', 'Quadrada')}</option>
                                                        <option value="trading-card">{t('newProject.appearance.frameRounded', 'Arredondada')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION: ESTILO & TEMA */}
                                    <div className="bg-black/30 border border-zinc-800 rounded-xl p-4">
                                        <button
                                            onClick={() => toggleSection('estilo')}
                                            className="flex items-center justify-between w-full text-left group hover:opacity-80 transition-opacity"
                                        >
                                            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                                                <Palette className="w-4 h-4 text-zinc-500" /> {t('newProject.appearance.styleTheme', 'ESTILO & TEMA')}
                                            </h3>
                                            {activeSections.estilo ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                        </button>

                                        {activeSections.estilo && (
                                            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('ThemeEditor.uiTheme', 'Cor da Interface')}</label>
                                                    <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                                                        <button
                                                            onClick={() => setTheme('dark')}
                                                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                        >
                                                            {t('ThemeEditor.dark', 'Noite')}
                                                        </button>
                                                        <button
                                                            onClick={() => setTheme('light')}
                                                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                        >
                                                            {t('ThemeEditor.light', 'Dia')}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.predefinedThemes', 'Temas Predefinidos')}</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {PREDEFINED_THEMES.map((theme) => (
                                                            <button
                                                                key={theme.nameKey}
                                                                onClick={() => handleApplyTheme(theme)}
                                                                className="flex flex-col items-center gap-1 p-2 rounded border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 transition-all text-center group"
                                                            >
                                                                <div className="flex gap-1 justify-center">
                                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.focusColor }}></div>
                                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.titleColor }}></div>
                                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.chanceIconColor }}></div>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300">{t(`ThemeEditor.themes.${theme.nameKey}`, { defaultValue: theme.name })}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Expandable Color Controls (Optional) */}
                                                <div className="pt-2 border-t border-zinc-800/50">
                                                    <button
                                                        onClick={() => toggleSection('cores')}
                                                        className="flex items-center justify-between w-full text-left py-2 hover:bg-zinc-800/50 px-2 rounded transition-colors"
                                                    >
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">{t('newProject.appearance.customColors', 'Cores Personalizadas')}</span>
                                                        {activeSections.cores ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
                                                    </button>

                                                    {activeSections.cores && (
                                                        <div className="space-y-4 pt-4 px-2">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <ColorInput label={t('newProject.appearance.colorText', 'Texto')} id="textColor" value={colors.textColor} onChange={(v) => setColors({ ...colors, textColor: v })} />
                                                                <ColorInput label={t('newProject.appearance.colorTitle', 'Título')} id="titleColor" value={colors.titleColor} onChange={(v) => setColors({ ...colors, titleColor: v })} />
                                                                <ColorInput label={t('newProject.appearance.colorFocus', 'Foco')} id="focusColor" value={colors.focusColor} onChange={(v) => setColors({ ...colors, focusColor: v })} />
                                                                <ColorInput label={t('newProject.appearance.colorActionBtn', 'Botões Ação')} id="actionBtnColor" value={colors.actionButtonColor} onChange={(v) => setColors({ ...colors, actionButtonColor: v })} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECTION: FONTES & TEXTO */}
                                    <div className="bg-black/30 border border-zinc-800 rounded-xl p-4">
                                        <button
                                            onClick={() => toggleSection('texto')}
                                            className="flex items-center justify-between w-full text-left group hover:opacity-80 transition-opacity"
                                        >
                                            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                                                <Type className="w-4 h-4 text-zinc-500" /> {t('newProject.appearance.fontsTextTitle', 'FONTES & TEXTO')}
                                            </h3>
                                            {activeSections.texto ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                        </button>

                                        {activeSections.texto && (
                                            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.fontFamily', 'Família da Fonte')}</label>
                                                    <select
                                                        value={fontFamily}
                                                        onChange={(e) => setFontFamily(e.target.value)}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                    >
                                                        {FONTS.map(font => (
                                                            <option key={font.name} value={font.family}>{font.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('newProject.appearance.fontSize', 'Tamanho')}</label>
                                                    <select
                                                        value={fontSize}
                                                        onChange={(e) => setFontSize(e.target.value)}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                    >
                                                        <option value="12">{t('newProject.appearance.sizeSmall', 'Pequeno')}</option>
                                                        <option value="14">{t('newProject.appearance.sizeMedium', 'Médico')}</option>
                                                        <option value="16">{t('newProject.appearance.sizeLarge', 'Grande')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="w-full lg:w-1/2 bg-black border-l border-zinc-800 flex flex-col">
                        <div className="flex border-b border-zinc-800 bg-zinc-950/50">
                            <div className="flex-1 py-4 px-6 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent text-zinc-500 flex items-center justify-between">
                                <h3>{t('newProject.preview', 'Pré-visualização')}</h3>
                            </div>
                        </div>
                        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 bg-black/50">
                            {/* Custom Preview Logic from UIEditor */}
                            {(() => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const getFramePreviewStyles = (frame: any) => {
                                    const panelStyles: React.CSSProperties = { boxSizing: 'border-box', overflow: 'hidden' };
                                    const containerStyles: React.CSSProperties = {
                                        backgroundColor: theme === 'dark' ? '#1a202c' : '#e2e8f0',
                                        color: theme === 'dark' ? '#a0aec0' : '#4a5568',
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxSizing: 'border-box',
                                        overflow: 'hidden'
                                    };
                                    let panelClass = '';
                                    let containerClass = '';

                                    switch (frame) {
                                        case 'rounded-top':
                                            panelStyles.padding = '5px';
                                            panelStyles.backgroundColor = colors.frameRoundedTopColor || '#FFFFFF';
                                            panelStyles.border = 'none';
                                            panelStyles.borderRadius = '40px 40px 4px 4px';
                                            containerStyles.borderRadius = '35px 35px 0 0';
                                            panelClass = 'frame-preview-portal';
                                            containerClass = 'frame-preview-portal-container';
                                            break;
                                        case 'book-cover':
                                            panelStyles.padding = '5px';
                                            panelStyles.backgroundColor = colors.frameBookColor || '#FFFFFF';
                                            panelStyles.border = 'none';
                                            panelClass = 'frame-preview-book';
                                            break;
                                        case 'trading-card':
                                            panelStyles.backgroundColor = colors.frameTradingCardColor || '#FFFFFF';
                                            panelStyles.borderRadius = '12px';
                                            panelStyles.padding = '4px';
                                            containerStyles.border = 'none';
                                            containerStyles.borderRadius = '8px';
                                            panelClass = 'frame-preview-trading';
                                            containerClass = 'frame-preview-trading-container';
                                            break;
                                        default:
                                            panelStyles.border = 'none';
                                            panelStyles.padding = '0';
                                    }
                                    return { panelStyles, containerStyles, panelClass, containerClass };
                                };

                                if (tab === 'info') {
                                    return (
                                        <div className="absolute inset-0 transform scale-[0.85] origin-center pointer-events-none select-none">
                                            <Preview gameData={previewGameData} testSceneId={null} />
                                        </div>
                                    )
                                }

                                return (
                                    <div
                                        className={`
                                        rounded-xl border shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300
                                        ${theme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'}
                                        w-full h-full
                                    `}
                                        style={{ fontFamily: fontFamily }}
                                    >
                                        {/* Preview Content Area */}
                                        <div className={`flex-1 p-6 flex gap-6 overflow-hidden relative ${layoutOrientation === 'vertical' ? 'flex-row' : 'flex-col'}`}>

                                            {/* Image Area */}
                                            <div
                                                className={`
                                                relative flex items-center justify-center flex-shrink-0 transition-all duration-300
                                                ${layoutOrientation === 'vertical' ? 'w-1/2 h-full' : 'w-full h-1/2 min-h-[50%]'}
                                                ${layoutOrder === 'image-first' ? 'order-first' : 'order-last'}
                                            `}
                                            >
                                                {(() => {
                                                    const { panelStyles, containerStyles, panelClass, containerClass } = getFramePreviewStyles(imageFrame);

                                                    const adaptedPanelStyles = {
                                                        ...panelStyles,
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    };

                                                    return (
                                                        <div
                                                            ref={el => {
                                                                if (el) {
                                                                    if (panelStyles.borderRadius) el.style.setProperty('border-radius', panelStyles.borderRadius as string, 'important');
                                                                    if (panelStyles.overflow) el.style.setProperty('overflow', panelStyles.overflow as string, 'important');
                                                                }
                                                            }}
                                                            style={adaptedPanelStyles}
                                                            className={panelClass}
                                                        >
                                                            <div
                                                                ref={el => {
                                                                    if (el) {
                                                                        if (containerStyles.borderRadius) el.style.setProperty('border-radius', containerStyles.borderRadius as string, 'important');
                                                                        if (containerStyles.overflow) el.style.setProperty('overflow', containerStyles.overflow as string, 'important');
                                                                    }
                                                                }}
                                                                style={{ ...containerStyles, width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
                                                                className={containerClass}
                                                            >
                                                                <ImageIcon className="w-12 h-12 text-zinc-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50" />
                                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                                                                    <div
                                                                        className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest"
                                                                        style={{ backgroundColor: colors.gameSceneNameOverlayBg, color: colors.gameSceneNameOverlayTextColor }}
                                                                    >
                                                                        {t('newProject.previewOverlay.sceneName', 'Nome da Cena')}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* Right Column: Text & Chances */}
                                            <div className="flex-1 flex flex-col overflow-hidden relative">
                                                <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                                                    <p className="leading-relaxed" style={{ color: colors.textColor, fontSize: /^\d+$/.test(fontSize) ? `${fontSize}px` : fontSize }}>
                                                        {t('newProject.previewOverlay.exampleDesc', 'Esta é uma descrição de exemplo para a cena. O texto flui conforme as')} <span style={{ color: colors.titleColor, fontWeight: 'bold' }}>{t('newProject.previewOverlay.exampleDescBold', 'CONFIGURAÇÕES')}</span> {t('newProject.previewOverlay.exampleDesc2', 'escolhidas.')}
                                                    </p>
                                                    <p className="mt-4 opacity-70" style={{ color: colors.textColor, fontFamily: fontFamily, fontSize: '0.85em' }}>
                                                        {'>'} {t('newProject.previewOverlay.exampleCommand', 'COMANDO DE EXEMPLO')}
                                                    </p>
                                                </div>

                                                {/* Chances Footer (Anchored Bottom Right) */}
                                                {enableChances && (
                                                    <div className="flex-shrink-0 flex justify-end pt-2 z-10">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3].map(i => (
                                                                <Heart key={i} className="w-4 h-4 fill-current" style={{ color: colors.chanceIconColor || '#ff4d4d' }} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Preview Footer (Input OR Choices) */}
                                        <div className={`p-3 border-t backdrop-blur-sm flex-shrink-0 space-y-2 ${theme === 'dark' ? 'border-zinc-900 bg-zinc-950/80' : 'border-zinc-200 bg-white/80'}`}>

                                            {/* System Buttons Row */}
                                            <div className="flex gap-2 pb-1">
                                                {/* Suggestions Button - Only show in Parser mode */}
                                                {interactionType === 'parser' && (
                                                    <button className={`h-6 px-3 border rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center bg-transparent ${theme === 'dark' ? 'border-zinc-700 text-zinc-400' : 'border-zinc-300 text-zinc-500'}`} style={{ fontFamily: fontFamily }}>
                                                        {t('newProject.previewOverlay.suggestions', 'Sugestões')}
                                                    </button>
                                                )}

                                                {enableInventory && (
                                                    <button className={`h-6 px-3 border rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center bg-transparent ${theme === 'dark' ? 'border-zinc-700 text-zinc-400' : 'border-zinc-300 text-zinc-500'}`} style={{ fontFamily: fontFamily }}>
                                                        {t('newProject.features.inventory', 'Inventário')}
                                                    </button>
                                                )}
                                                {enableDiary && (
                                                    <button className={`h-6 px-3 border rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center bg-transparent ${theme === 'dark' ? 'border-zinc-700 text-zinc-400' : 'border-zinc-300 text-zinc-500'}`} style={{ fontFamily: fontFamily }}>
                                                        {t('newProject.features.diary', 'Diário de Bordo')}
                                                    </button>
                                                )}
                                                {enableTrackers && (
                                                    <button className={`h-6 px-3 border rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center bg-transparent ${theme === 'dark' ? 'border-zinc-700 text-zinc-400' : 'border-zinc-300 text-zinc-500'}`} style={{ fontFamily: fontFamily }}>
                                                        {t('newProject.features.trackers', 'Rastreadores')}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Input Area */}
                                            {interactionType === 'parser' ? (
                                                <div className="flex gap-2">
                                                    <div className={`flex-1 rounded-md h-8 flex items-center px-2 border ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                                                        <span className="font-mono truncate" style={{ fontSize: /^\d+$/.test(fontSize) ? `${fontSize}px` : fontSize, fontFamily: fontFamily, color: theme === 'dark' ? '#52525b' : '#a1a1aa' }}>{verbInputPlaceholder}</span>
                                                    </div>
                                                    <button
                                                        className="px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate"
                                                        style={{ backgroundColor: colors.actionButtonColor, color: colors.actionButtonTextColor, fontSize: /^\d+$/.test(fontSize) ? `${fontSize}px` : fontSize, fontFamily: fontFamily }}
                                                    >
                                                        {actionButtonText || t('newProject.previewOverlay.actionPlaceholder', 'AÇÃO')}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <button
                                                        className="w-full h-8 border-2 font-bold uppercase tracking-widest transition-all truncate"
                                                        style={{
                                                            borderColor: colors.actionButtonColor || 'rgba(255,255,255,0.2)',
                                                            backgroundColor: colors.actionButtonColor || '#ffffff',
                                                            color: colors.actionButtonTextColor || '#000000',
                                                            fontFamily: fontFamily,
                                                            fontSize: /^\d+$/.test(fontSize) ? `${fontSize}px` : fontSize,
                                                            borderRadius: '0px' // Square
                                                        }}
                                                    >
                                                        {t('newProject.previewOverlay.option1', 'Opção de Exemplo 1')}
                                                    </button>
                                                    <button
                                                        className="w-full h-8 border-2 font-bold uppercase tracking-widest transition-all truncate"
                                                        style={{
                                                            borderColor: colors.actionButtonColor || 'rgba(255,255,255,0.2)',
                                                            backgroundColor: colors.actionButtonColor || '#ffffff',
                                                            color: colors.actionButtonTextColor || '#000000',
                                                            fontFamily: fontFamily,
                                                            fontSize: /^\d+$/.test(fontSize) ? `${fontSize}px` : fontSize,
                                                            borderRadius: '0px' // Square
                                                        }}
                                                    >
                                                        {t('newProject.previewOverlay.option2', 'Opção de Exemplo 2')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 flex justify-between items-center z-10">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                            >
                                {t('common.cancel', 'Cancelar')}
                            </button>

                            {tab === 'appearance' ? (
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
    );
};
