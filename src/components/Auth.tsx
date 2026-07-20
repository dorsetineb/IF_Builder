import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Minus, Square, X, Play, Loader2 } from 'lucide-react';
import { DitherShader } from '@/components/ui/dither-shader';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';
import { useTypography, fontScales } from './TypographyProvider';
import { GameData } from '../types';
import Preview from './Preview';
import { getDitherColors } from '../utils/themeStyles';

type LandingView = 'landing' | 'about' | 'play';

const BACKGROUNDS = [
    {
        src: '/background.webp',
        line1Key: 'auth.sidebar.line1',
        defaultLine1: 'Em uma caverna escura.',
        line2Key: 'auth.sidebar.line2',
        defaultLine2: 'Monitores CRT iluminam o mofo.'
    },
    {
        src: '/bgs/bg3.jpg',
        line1Key: 'auth.sidebar.bgs.cell.line1',
        defaultLine1: 'Na masmorra do castelo.',
        line2Key: 'auth.sidebar.bgs.cell.line2',
        defaultLine2: 'Monitores CRT iluminam as paredes úmidas.'
    }
];

export function Auth() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = useState(false);

    // Landing page view state
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const [currentView, setCurrentView] = useState<LandingView>('landing');
    const [currentBgIndex, setCurrentBgIndex] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('if-builder-bg-index');
            if (saved !== null) {
                const index = parseInt(saved, 10);
                if (!isNaN(index) && index >= 0 && index < BACKGROUNDS.length) {
                    return index;
                }
            }
            const randomIndex = Math.floor(Math.random() * BACKGROUNDS.length);
            sessionStorage.setItem('if-builder-bg-index', randomIndex.toString());
            return randomIndex;
        }
        return Math.floor(Math.random() * BACKGROUNDS.length);
    });
    const activeBg = isMobile ? BACKGROUNDS[0] : BACKGROUNDS[currentBgIndex];
    const [demoData, setDemoData] = useState<GameData | null>(null);
    const [isLoadingDemo, setIsLoadingDemo] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    React.useEffect(() => {
        localStorage.setItem('if-builder-bg-src', activeBg.src);
    }, [activeBg.src]);

    const { theme } = useTheme();
    const { fontFamily } = useTypography();

    const ditherColors = getDitherColors(theme);

    const resetToLanding = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (currentView === 'landing' || isClosing) return;

        setIsClosing(true);
        setTimeout(() => {
            setCurrentView('landing');
            setIsClosing(false);
            // Optionally clear demo data or keep it for next time
        }, 300);
    };

    React.useEffect(() => {
        if (currentView === 'play' && !demoData) {
            const fetchDemoData = async () => {
                setIsLoadingDemo(true);
                try {
                    const demoFolderName = i18n.language.startsWith('pt')
                        ? "fuja_da_masmorra"
                        : i18n.language.startsWith('es')
                        ? "escapa_la_mazmorra"
                        : "escape_the_dungeon";

                    const response = await fetch(`/${demoFolderName}/editor_data.json`);
                    if (!response.ok) throw new Error('Failed to fetch demo data');
                    const data = await response.json();
                    setDemoData(data);
                } catch (error) {
                    console.error("Error loading demo data:", error);
                } finally {
                    setIsLoadingDemo(false);
                }
            };
            fetchDemoData();
        }
    }, [currentView, demoData, i18n.language]);

    // Sidebar Component (Left)
    const renderSidebar = () => (
        <div className={`${isMobile ? 'w-full pointer-events-none' : 'w-96'} flex flex-col h-full relative z-20 transition-all duration-300`}>
            <div className={`flex-1 flex flex-col justify-center w-full pl-12 pr-6 space-y-8 ${isMobile ? '' : ''}`}>
                {/* Tagline */}
                <div className={`${isMobile ? 'absolute top-0 left-0 p-12' : 'text-base text-white/80 leading-relaxed text-left space-y-1 drop-shadow-md'}`}>
                    {isMobile ? (
                        <div className="text-base text-white/80 leading-relaxed text-left space-y-1 drop-shadow-md">
                            <p>{t('auth.sidebar.mobile.line1', 'Por uma fresta, você enxerga uma caverna escura.')}</p>
                            <p className="text-primary font-bold mt-2">
                                &gt; {t('auth.sidebar.mobile.line2', 'ACESSO NEGADO DEVIDO A SMARTPHONE.')}
                            </p>
                            <p className="mt-2 opacity-50">{t('auth.sidebar.mobile.line3', 'Ache um computador com uma tela maior, e tente novamente.')}</p>
                        </div>
                    ) : (
                        <>
                            <p>{t(activeBg.line1Key, activeBg.defaultLine1)}</p>
                            <p>{t(activeBg.line2Key, activeBg.defaultLine2)}</p>
                            <p className={`text-primary font-bold mt-2 drop-shadow-md`}>&gt; {t('auth.sidebar.action', 'O QUE VOCÊ FAZ?')}</p>
                        </>
                    )}
                </div>

                {/* Navigation Buttons */}
                {!isMobile && (
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
                            className={`w-fit flex items-center justify-start gap-3 px-5 py-3 rounded-xl font-bold text-base transition-all group border relative overflow-hidden shadow-xl bg-primary border-primary text-primary-foreground hover:bg-white hover:text-zinc-950 hover:border-white`}
                        >
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle 60px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.2) 0%, transparent 100%)`
                                }}
                            />
                            <Play size={20} className="relative z-10 group-hover:translate-x-1 transition-transform shrink-0" />
                            <span className="uppercase tracking-wider relative z-10">{t('auth.sidebar.startProgram', 'Iniciar Programa')}</span>
                        </button>

                        {/* Secret Hint Text */}
                        <div className="text-base text-white/80 leading-relaxed text-left space-y-1 pt-4 opacity-50 drop-shadow-md">
                            <p>{t('auth.sidebar.hint1', 'Algo pode acontecer,')}</p>
                            <p>{t('auth.sidebar.hint2', 'Se você clicar nos computadores.')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderAboutPanel = () => (
        <div
            className={`w-full max-w-2xl bg-card/80 border border-muted-foreground/50 backdrop-blur-xl overflow-hidden rounded-2xl shadow-2xl text-card-foreground ${isClosing
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

                <div className="space-y-4 text-muted-foreground leading-relaxed text-[16px]">
                    <p>
                        {t('auth.about.p1', 'Crie ramificações, objetos e defina as interações que avançam a sua ficção interativa.')}
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
                className={`bg-card border border-muted-foreground/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isClosing
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
                <div className={`px-4 py-3 border-b flex items-center justify-between flex-shrink-0 bg-primary border-primary`}>
                    <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs uppercase tracking-widest text-primary-foreground opacity-90`}>
                            {i18n.language.startsWith('pt')
                                ? "FUJA_DA_MASMORRA.EXE"
                                : i18n.language.startsWith('es')
                                ? "ESCAPA_LA_MAZMORRA.EXE"
                                : "ESCAPE_THE_DUNGEON.EXE"}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <button title="Minimize" className="h-6 w-8 flex items-center justify-center hover:bg-black/10 transition-colors rounded-sm">
                            <Minus className={`w-3 h-3 text-primary-foreground/70`} />
                        </button>
                        <button title="Maximize" className="h-6 w-8 flex items-center justify-center hover:bg-black/10 transition-colors rounded-sm">
                            <Square className={`w-2.5 h-2.5 text-primary-foreground/70`} />
                        </button>
                        <button
                            title="Close"
                            className="h-6 w-8 flex items-center justify-center hover:bg-red-500 transition-colors group rounded-sm"
                            onClick={resetToLanding}
                        >
                            <X className={`w-3.5 h-3.5 group-hover:text-white text-primary-foreground/70`} />
                        </button>
                    </div>
                </div>

                {/* Game Preview */}
                <div className="flex-1 min-h-0 bg-black relative">
                    {isLoadingDemo ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary bg-black/40">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p className="animate-pulse font-mono text-xs uppercase tracking-widest">{t('common.loading', 'Carregando...')}</p>
                        </div>
                    ) : demoData ? (
                        <Preview
                            gameData={demoData}
                            basePath={i18n.language.startsWith('pt')
                                ? "/fuja_da_masmorra"
                                : i18n.language.startsWith('es')
                                ? "/escapa_la_mazmorra"
                                : "/escape_the_dungeon"
                            }
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-xs uppercase tracking-widest">
                            ERROR: FAILED_TO_LOAD_DATA
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const currentScale = fontScales[fontFamily] || fontScales["Silkscreen"];
    const mediumOffset = 2; // Fix this screen to always use the "Medium" offset

    // Main landing layout with sidebar
    return (
        <div 
            className="h-screen w-screen flex bg-background font-sans relative overflow-hidden"
            style={{
                "--text-xs": `${Math.max(6, currentScale.xs + mediumOffset)}px`,
                "--text-sm": `${Math.max(6, currentScale.sm + mediumOffset)}px`,
                "--text-base": `${Math.max(6, currentScale.base + mediumOffset)}px`,
                "--text-lg": `${Math.max(6, currentScale.lg + mediumOffset)}px`,
                "--text-xl": `${Math.max(6, currentScale.xl + mediumOffset)}px`,
                "--text-2xl": `${Math.max(6, currentScale['2xl'] + mediumOffset)}px`,
                "--text-3xl": `${Math.max(6, currentScale['3xl'] + mediumOffset)}px`,
                "--text-10px": `${Math.max(6, currentScale['10px'] + mediumOffset)}px`,
            } as React.CSSProperties}
        >
            {/* Global Dither Background */}
            <div className="absolute inset-0 z-0 bg-background overflow-hidden pointer-events-none">
                <DitherShader
                    src={activeBg.src}
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
                    enableHover={!isMobile}
                    isScanMode={isMobile}
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

            {/* IF Logo - Bottom Right Group */}
            <div className="fixed bottom-12 right-12 z-10 select-none pointer-events-none opacity-20">
                <pre className="font-mono leading-none text-foreground text-[10px] sm:text-[14px] tracking-normal notranslate" translate="no">
{`           ██████   █████████
          ░░████   ░█████████
         ░████   ░██         
        ░████   ░█████████   
       ░████   ░█████████   
      ░████   ░██           
     ██████  ░██            
    ░░░░░░   ░░             `}
                </pre>
            </div>
        </div>
    );
} 
