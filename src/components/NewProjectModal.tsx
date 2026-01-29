import React, { useState, useMemo, useRef } from 'react';
import { X, Layout, Type, Palette, Play, Upload, Image as ImageIcon, Trash2, ChevronDown, ChevronUp, LayoutTemplate, BookOpen, ArrowRight, Terminal, MousePointerClick } from 'lucide-react';
import { GameData, Vignette, Scene } from '../types';
import { initialGameData } from '../lib/gameDefaults';
import { FONTS, PREDEFINED_THEMES } from '../constants';
import Preview from './Preview';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: Partial<GameData>) => void;
}

type Tab = 'system' | 'info' | 'appearance';

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
    const [tab, setTab] = useState<Tab>('info');

    // Info State
    const [title, setTitle] = useState('Minha Nova Aventura');
    const [description, setDescription] = useState('Uma breve descrição da sua história...');
    const [startButtonText, setStartButtonText] = useState('Iniciar Aventura');
    const [splashImage, setSplashImage] = useState('');

    // System State
    const [interactionType, setInteractionType] = useState<'parser' | 'choice'>('parser');

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
    const [actionButtonText, setActionButtonText] = useState('Ação');
    const [verbInputPlaceholder, setVerbInputPlaceholder] = useState('O que você faz?');

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

    // Helper for preview scene
    const previewScene: Scene = useMemo(() => ({
        id: 'preview_scene',
        name: 'Exemplo de Visualização',
        image: splashImage || '', // Use splash image if available for context
        description: 'Esta é uma visualização da interface principal do jogo. Todas as suas escolhas de aparência (cores, fontes, molduras, layout) são aplicadas aqui em tempo real para que você possa ver o resultado final.',
        interactions: [],
        choices: [
            { id: 'c1', label: 'Opção de Exemplo 1', targetSceneId: 'preview_scene' },
            { id: 'c2', label: 'Opção de Exemplo 2', targetSceneId: 'preview_scene' }
        ],
        objectIds: [],
        exits: {}
    }), [splashImage]); // Re-create if splash image changes to show something

    const previewGameData: GameData = useMemo(() => ({
        ...initialGameData,
        gameTitle: title,
        gameSplashDescription: description,
        gameSplashButtonText: startButtonText,
        gameSplashImage: splashImage,
        gameInteractionType: interactionType,

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
            [previewScene.id]: previewScene
        }
    }), [title, description, startButtonText, splashImage, interactionType, layoutOrientation, layoutOrder, imageFrame, theme, fontFamily, fontSize, actionButtonText, verbInputPlaceholder, colors, previewScene]);

    const handleCreate = () => {
        const initialVignette: Vignette = {
            id: 'vignette_opening',
            name: 'Abertura',
            title: title || 'Abertura',
            description: description,
            buttonText: startButtonText,
            showTitle: true,
            showDescription: true,
            textAnimationType: 'fade',
            textSpeed: 3
        };

        const newGameData: Partial<GameData> = {
            ...previewGameData,
            vignettes: [initialVignette],
            // id is not in GameData type, managed externally or implicitly
        };

        onCreate(newGameData);
    };

    const handleNext = () => {
        if (tab === 'info') setTab('appearance');
        else if (tab === 'appearance') setTab('system');
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
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Nova Ficção</h2>
                            <p className="text-xs text-zinc-400 font-medium">Configure os detalhes iniciais da sua aventura</p>
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
                                Informações
                            </button>
                            <button
                                onClick={() => setTab('appearance')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${tab === 'appearance' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                            >
                                Aparência
                            </button>
                            <button
                                onClick={() => setTab('system')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${tab === 'system' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                            >
                                Sistema
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
                                                <h3 className={`text-sm font-bold uppercase tracking-wide mb-1 ${interactionType === 'parser' ? 'text-white' : 'text-zinc-300'}`}>Parser (Texto)</h3>
                                                <p className="text-xs text-zinc-400 leading-relaxed">
                                                    Jogabilidade clássica baseada em comandos de texto (ex: "pegar chave", "ir norte"). Maior liberdade de interação e quebra-cabeças complexos.
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
                                                <h3 className={`text-sm font-bold uppercase tracking-wide mb-1 ${interactionType === 'choice' ? 'text-white' : 'text-zinc-300'}`}>Interactive Fiction (IF)</h3>
                                                <p className="text-xs text-zinc-400 leading-relaxed">
                                                    Jogabilidade baseada em escolhas e cliques. Ideal para narrativas ramificadas, visual novels e aventuras "Choose Your Own Adventure".
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {tab === 'info' && (
                                <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Título do Jogo</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700 font-bold"
                                            placeholder="Ex: A Caverna dos Dragões"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sinopse / Descrição</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full h-32 bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 focus:ring-1 focus:ring-primary/50 transition-all resize-none placeholder:text-zinc-700 leading-relaxed"
                                            placeholder="Uma breve descrição da sua história..."
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
                                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Capa / Imagem de Fundo</label>
                                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                                                Esta imagem será usada como fundo da tela inicial e da cena de abertura caso não seja definida outra.
                                            </p>
                                            <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Recomendado: 1920x1080</p>
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
                                                <LayoutTemplate className="w-4 h-4 text-zinc-500" /> ESTRUTURA
                                            </h3>
                                            {activeSections.estrutura ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                        </button>

                                        {activeSections.estrutura && (
                                            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Orientação</label>
                                                    <select
                                                        value={layoutOrientation}
                                                        onChange={(e) => setLayoutOrientation(e.target.value as any)}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                    >
                                                        <option value="vertical">Vertical</option>
                                                        <option value="horizontal">Horizontal</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Posição da Imagem</label>
                                                    <select
                                                        value={layoutOrder}
                                                        onChange={(e) => setLayoutOrder(e.target.value as any)}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                    >
                                                        {layoutOrientation === 'vertical' ? (
                                                            <>
                                                                <option value="image-first">Esquerda</option>
                                                                <option value="image-last">Direita</option>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <option value="image-first">Acima</option>
                                                                <option value="image-last">Abaixo</option>
                                                            </>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Moldura</label>
                                                    <select
                                                        value={imageFrame}
                                                        onChange={(e) => setImageFrame(e.target.value as any)}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                    >
                                                        <option value="none">Sem moldura</option>
                                                        <option value="rounded-top">Portal</option>
                                                        <option value="book-cover">Quadrada</option>
                                                        <option value="trading-card">Arredondada</option>
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
                                                <Palette className="w-4 h-4 text-zinc-500" /> ESTILO & TEMA
                                            </h3>
                                            {activeSections.estilo ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                        </button>

                                        {activeSections.estilo && (
                                            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Cor da Interface</label>
                                                    <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                                                        <button
                                                            onClick={() => setTheme('dark')}
                                                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                        >
                                                            Escuro
                                                        </button>
                                                        <button
                                                            onClick={() => setTheme('light')}
                                                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                        >
                                                            Claro
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Temas Predefinidos</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {PREDEFINED_THEMES.map((t) => (
                                                            <button
                                                                key={t.name}
                                                                onClick={() => handleApplyTheme(t)}
                                                                className="flex flex-col items-center gap-1 p-2 rounded border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 transition-all text-center group"
                                                            >
                                                                <div className="flex gap-1 justify-center">
                                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.focusColor }}></div>
                                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.titleColor }}></div>
                                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.chanceIconColor }}></div>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300">{t.name}</span>
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
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Cores Personalizadas</span>
                                                        {activeSections.cores ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
                                                    </button>

                                                    {activeSections.cores && (
                                                        <div className="space-y-4 pt-4 px-2">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <ColorInput label="Texto" id="textColor" value={colors.textColor} onChange={(v) => setColors({ ...colors, textColor: v })} />
                                                                <ColorInput label="Título" id="titleColor" value={colors.titleColor} onChange={(v) => setColors({ ...colors, titleColor: v })} />
                                                                <ColorInput label="Foco" id="focusColor" value={colors.focusColor} onChange={(v) => setColors({ ...colors, focusColor: v })} />
                                                                <ColorInput label="Botões Ação" id="actionBtnColor" value={colors.actionButtonColor} onChange={(v) => setColors({ ...colors, actionButtonColor: v })} />
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
                                                <Type className="w-4 h-4 text-zinc-500" /> FONTES & TEXTO
                                            </h3>
                                            {activeSections.texto ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                        </button>

                                        {activeSections.texto && (
                                            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Família da Fonte</label>
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
                                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Tamanho</label>
                                                    <select
                                                        value={fontSize}
                                                        onChange={(e) => setFontSize(e.target.value)}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30"
                                                    >
                                                        <option value="12">Pequeno</option>
                                                        <option value="14">Médio</option>
                                                        <option value="16">Grande</option>
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
                                <h3>Pré-visualização</h3>
                            </div>
                        </div>
                        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 bg-black/50">
                            {/* Custom Preview Logic from UIEditor */}
                            {(() => {
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

                                if (tab !== 'appearance') {
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
                                                                        Nome da Cena
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* Text Area */}
                                            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                                                <p className="leading-relaxed" style={{ color: colors.textColor, fontSize: /^\d+$/.test(fontSize) ? `${fontSize}px` : fontSize }}>
                                                    Esta é uma descrição de exemplo para a cena. O texto flui conforme as <span style={{ color: colors.titleColor, fontWeight: 'bold' }}>CONFIGURAÇÕES</span> escolhidas.
                                                </p>
                                                <p className="mt-4 opacity-70" style={{ color: colors.textColor, fontFamily: fontFamily, fontSize: '0.85em' }}>
                                                    {'>'} COMANDO DE EXEMPLO
                                                </p>
                                            </div>
                                        </div>

                                        {/* Preview Footer (Input) */}
                                        <div className={`p-3 border-t backdrop-blur-sm flex-shrink-0 space-y-2 ${theme === 'dark' ? 'border-zinc-900 bg-zinc-950/80' : 'border-zinc-200 bg-white/80'}`}>
                                            <div className="flex gap-2">
                                                <div className={`flex-1 rounded-md h-8 flex items-center px-2 border ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                                                    <span className="font-mono truncate" style={{ fontSize: /^\d+$/.test(fontSize) ? `${fontSize}px` : fontSize, fontFamily: fontFamily, color: theme === 'dark' ? '#52525b' : '#a1a1aa' }}>{verbInputPlaceholder}</span>
                                                </div>
                                                <button
                                                    className="px-3 h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center truncate"
                                                    style={{ backgroundColor: colors.actionButtonColor, color: colors.actionButtonTextColor, fontSize: /^\d+$/.test(fontSize) ? `${fontSize}px` : fontSize, fontFamily: fontFamily }}
                                                >
                                                    {actionButtonText || 'AÇÃO'}
                                                </button>
                                            </div>
                                            <button
                                                className="w-full h-8 rounded-md font-bold uppercase tracking-widest shadow-lg flex items-center justify-center transition-colors hover:opacity-90 truncate"
                                                style={{ backgroundColor: colors.splashButtonColor, color: colors.splashButtonTextColor, fontSize: /^\d+$/.test(fontSize) ? `${fontSize}px` : fontSize, fontFamily: fontFamily }}
                                            >
                                                {startButtonText || 'BOTÃO DE INÍCIO'}
                                            </button>
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
                                Cancelar
                            </button>

                            {tab === 'system' ? (
                                <button
                                    onClick={handleCreate}
                                    disabled={!title}
                                    className="px-8 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center gap-2"
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                    Criar Projeto
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="px-8 py-2.5 bg-zinc-100 text-zinc-900 font-bold rounded-xl hover:bg-white transition-all text-xs shadow-lg flex items-center gap-2"
                                >
                                    Avançar
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
