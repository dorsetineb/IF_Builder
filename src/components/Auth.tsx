import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Minus, Square, X, Play } from 'lucide-react';
import { DitherShader } from '@/components/ui/dither-shader';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';

type LandingView = 'landing' | 'about' | 'play';

export function Auth() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = useState(false);

    // Landing page view state
    const [currentView, setCurrentView] = useState<LandingView>('landing');

    const { theme } = useTheme();

    const getDitherColors = () => {
        switch (theme) {
            case 'cream':
                return { primary: '#5c4033', secondary: '#fdfbf7' };
            case 'terminal':
                return { primary: '#0d1117', secondary: '#4af626' };
            case 'light':
                return { primary: '#000000', secondary: '#ffffff' };
            case 'windows':
                return { primary: '#0f0f0f', secondary: '#008080' };
            default: // dark
                return { primary: '#000000', secondary: '#9d4edd' };
        }
    };

    const ditherColors = getDitherColors();

    const resetToLanding = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (currentView === 'landing' || isClosing) return;

        setIsClosing(true);
        setTimeout(() => {
            setCurrentView('landing');
            setIsClosing(false);
        }, 300);
    };

    // Sidebar Component (Left)
    const renderSidebar = () => (
        <div className="w-96 flex flex-col h-full relative z-20 transition-all duration-300">
            <div className="flex-1 flex flex-col justify-center w-full pl-12 pr-6 space-y-12">
                {/* Tagline */}
                <div className="text-sm text-primary-foreground/80 leading-relaxed text-left space-y-1 drop-shadow-md">
                    <p>{t('auth.sidebar.line1', 'Em uma caverna escura.')}</p>
                    <p>{t('auth.sidebar.line2', 'Monitores CRT iluminam o mofo.')}</p>
                    <p className={`${(theme === 'cream' || theme === 'light') ? 'text-white' : 'text-primary'} font-bold mt-2 drop-shadow-md`}>&gt; {t('auth.sidebar.action', 'O QUE VOCÊ FAZ?')}</p>
                </div>

                {/* Navigation Buttons */}
                <div className="space-y-4 w-full">
                    <button
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                        }}
                        onClick={() => navigate('/editor')}
                        className={`w-full flex items-center justify-start gap-3 px-6 py-4 rounded-xl font-bold text-sm transition-all group border relative overflow-hidden shadow-xl hover:scale-[1.02] ${
                            (theme === 'cream' || theme === 'light') 
                            ? 'bg-white border-primary text-primary' 
                            : 'bg-primary border-primary text-primary-foreground'
                        }`}
                    >
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            style={{
                                background: `radial-gradient(circle 60px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.2) 0%, transparent 100%)`
                            }}
                        />
                        <Play size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
                        <span className="uppercase tracking-wider relative z-10">{t('auth.sidebar.startProgram', 'Iniciar Programa')}</span>
                    </button>

                    {/* Secret Hint Text */}
                    <div className="text-sm text-primary-foreground/80 leading-relaxed text-left space-y-1 pt-8 opacity-50 drop-shadow-md">
                        <p>{t('auth.sidebar.hint1', 'Algo pode acontecer,')}</p>
                        <p>{t('auth.sidebar.hint2', 'Se você clicar nos computadores.')}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAboutPanel = () => (
        <div
            className={`w-full max-w-2xl bg-card/80 border border-border backdrop-blur-xl overflow-hidden rounded-2xl shadow-2xl text-card-foreground ${isClosing
                ? 'animate-out fade-out zoom-out-95 duration-300'
                : 'animate-in fade-in zoom-in-95 duration-300'
                }`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-50" />
            <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                    <div className="space-y-1 text-center">
                        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
                            <Activity className="w-5 h-5 text-primary" /> {t('auth.about.title', 'Sobre o IF Builder')}
                        </h2>
                    </div>
                </div>

                <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                    <p>
                        {t('auth.about.p1', 'Crie cenas, objetos e defina as interações que avançam a sua ficção interativa.')}
                    </p>
                    <p>
                        {t('auth.about.p2', 'Todas as ficções interativas criadas aqui são exportadas em um arquivo .zip. Ele não precisa de internet nem do editor para funcionar - apenas um navegador. Pense nesse arquivo como um pendrive: você pode guardá-lo em uma gaveta, ou entregá-lo a alguém.')}
                    </p>

                </div>
            </div>
        </div>
    );

    // Game Popup Component (Fake Browser) - 4:3 aspect ratio popup
    const renderGamePopup = () => (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${isClosing
                ? 'animate-out fade-out duration-300'
                : 'animate-in fade-in duration-300'
                }`}
            onClick={resetToLanding}
        >
            {/* 4:3 Container - scales proportionally with viewport */}
            <div
                className={`bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isClosing
                    ? 'animate-out zoom-out-95 duration-300'
                    : 'animate-in zoom-in-95 duration-300'
                    }`}
                style={{
                    // Wide popup - fills most of viewport
                    width: '90vw',
                    height: '90vh',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fake Browser Header */}
                <div className={`px-4 py-3 border-b flex items-center justify-between flex-shrink-0 ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-primary border-primary'}`}>
                    <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs uppercase tracking-widest ${theme === 'light' ? 'text-zinc-500' : 'text-primary-foreground opacity-90'}`}>
                            {i18n.language.startsWith('pt')
                                ? "FUJA_DA_MASMORRA.EXE"
                                : i18n.language.startsWith('es')
                                ? "ESCAPA_LA_MAZMORRA.EXE"
                                : "ESCAPE_THE_DUNGEON.EXE"}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <button className="h-6 w-8 flex items-center justify-center hover:bg-black/10 transition-colors rounded-sm">
                            <Minus className={`w-3 h-3 ${theme === 'light' ? 'text-zinc-500' : 'text-primary-foreground/70'}`} />
                        </button>
                        <button className="h-6 w-8 flex items-center justify-center hover:bg-black/10 transition-colors rounded-sm">
                            <Square className={`w-2.5 h-2.5 ${theme === 'light' ? 'text-zinc-500' : 'text-primary-foreground/70'}`} />
                        </button>
                        <button
                            className="h-6 w-8 flex items-center justify-center hover:bg-red-500 transition-colors group rounded-sm"
                            onClick={resetToLanding}
                        >
                            <X className={`w-3.5 h-3.5 group-hover:text-white ${theme === 'light' ? 'text-zinc-500' : 'text-primary-foreground/70'}`} />
                        </button>
                    </div>
                </div>

                {/* Game iframe */}
                <div className="flex-1 min-h-0">
                    <iframe
                        src={
                            i18n.language.startsWith('pt')
                                ? "/fuja_da_masmorra/index.html"
                                : i18n.language.startsWith('es')
                                ? "/escapa_la_mazmorra/index.html"
                                : "/escape_the_dungeon/index.html"
                        }
                        className="w-full h-full border-0"
                        title="Demo"
                    />
                </div>
            </div>
        </div>
    );

    // Main landing layout with sidebar
    return (
        <div className="h-screen w-screen flex bg-background font-sans relative overflow-hidden">
            {/* Global Dither Background */}
            <div className="absolute inset-0 z-0 bg-background overflow-hidden pointer-events-none">
                <DitherShader
                    src="/background.png"
                    gridSize={2}
                    ditherMode="bayer"
                    colorMode="duotone"
                    primaryColor={ditherColors.primary}
                    secondaryColor={ditherColors.secondary}
                    invert={false}
                    animated={true}
                    animationSpeed={0.005}
                    className="w-full h-full"
                    objectFit="cover"
                    enableHover={true}
                    hoverRadius={433}
                />
            </div>

            {/* Secret "Jogar" Trigger - Invisible area over computers */}
            {currentView === 'landing' && (
                <div
                    className="absolute top-1/2 right-[5%] w-[35vw] h-[60vh] -translate-y-1/2 z-30 cursor-pointer hidden md:block" // Expanded trigger area
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentView('play');
                    }}
                />
            )}

            {/* Left Sidebar */}
            {renderSidebar()}

            {/* Main Content Area - Click to reset/close forms */}
            <div className={`flex-1 flex items-center justify-center p-8 pr-32 relative z-10 ${currentView !== 'landing' ? 'cursor-pointer' : ''}`} onClick={resetToLanding}>

                <div className="relative z-10 w-full max-w-sm cursor-default">
                    {currentView === 'about' && renderAboutPanel()}
                    {currentView === 'landing' && (
                        <div className="text-center animate-in fade-in duration-500">
                            {/* Content empty - nice clean look */}
                        </div>
                    )}
                </div>
            </div>

            {/* Game Popup (overlay) */}
            {currentView === 'play' && renderGamePopup()}

            {/* IF Logo & Status - Bottom Right Group */}
            <div className="fixed bottom-12 right-12 z-10 flex flex-col gap-0 select-none pointer-events-none opacity-20 items-end">
                <h1 className="text-[120px] font-black text-foreground tracking-tighter italic leading-[0.8] notranslate" translate="no" style={{ fontFamily: 'Inter, sans-serif' }}>
                    IF
                </h1>
                <div className="font-mono text-[10px] text-muted-foreground tracking-wider pr-2 mt-2 border-r-2 border-border text-right">
                    <p>SYS.STATUS: ONLINE</p>
                    <p>NODE: ALPHA-7</p>
                </div>
            </div>
        </div>
    );
} 
