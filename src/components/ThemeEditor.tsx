import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameData } from '../types';
import { FONTS, PREDEFINED_THEMES } from '../constants';

interface ThemeEditorProps {
    textColor: string;
    titleColor: string;
    splashButtonColor: string;
    splashButtonHoverColor: string;
    splashButtonTextColor: string;
    actionButtonColor: string;
    actionButtonTextColor: string;
    focusColor: string;
    chanceIconColor: string;
    gameFontFamily: string;
    enableChances: boolean;
    chanceIcon: 'circle' | 'cross' | 'heart' | 'square' | 'diamond';
    chanceLossMessage: string;
    chanceRestoreMessage: string;
    chanceReturnButtonText: string;
    gameBackgroundColor: string;
    gameFrameColor: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (field: keyof GameData, value: any) => void;
    isDirty: boolean;
    onSetDirty: (isDirty: boolean) => void;
}



const ColorInput: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}> = ({ label, id, value, onChange, placeholder }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t } = useTranslation();
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{label}</label>
            <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-muted-foreground/50 rounded-lg focus-within:border-muted-foreground/50 transition-all">
                <input
                    type="color"
                    id={`${id}-picker`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent overflow-hidden"
                    aria-label={`Seletor de cor para ${label}`}
                />
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-zinc-300 focus:outline-none focus:ring-0"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};


const ThemeEditor: React.FC<ThemeEditorProps> = (props) => {
    const { t } = useTranslation();
    const {
        textColor, titleColor, splashButtonColor, splashButtonHoverColor,
        splashButtonTextColor, actionButtonColor, actionButtonTextColor,
        focusColor, chanceIconColor, gameFontFamily,
        enableChances, chanceIcon, onUpdate, isDirty, onSetDirty,
        chanceLossMessage, chanceRestoreMessage, chanceReturnButtonText,
        gameBackgroundColor, gameFrameColor
    } = props;

    const [localTextColor, setLocalTextColor] = useState(textColor);
    const [localTitleColor, setLocalTitleColor] = useState(titleColor);
    const [localSplashButtonColor, setLocalSplashButtonColor] = useState(splashButtonColor);
    const [localSplashButtonHoverColor, setLocalSplashButtonHoverColor] = useState(splashButtonHoverColor);
    const [localSplashButtonTextColor, setLocalSplashButtonTextColor] = useState(splashButtonTextColor);
    const [localActionButtonColor, setLocalActionButtonColor] = useState(actionButtonColor);
    const [localActionButtonTextColor, setLocalActionButtonTextColor] = useState(actionButtonTextColor);
    const [localFocusColor, setLocalFocusColor] = useState(focusColor);
    const [localChanceIconColor, setLocalChanceIconColor] = useState(chanceIconColor);
    const [localFontFamily, setLocalFontFamily] = useState(gameFontFamily);
    const [localChanceIcon, setLocalChanceIcon] = useState(chanceIcon);
    const [localChanceLossMessage, setLocalChanceLossMessage] = useState(chanceLossMessage);
    const [localChanceRestoreMessage, setLocalChanceRestoreMessage] = useState(chanceRestoreMessage);
    const [localChanceReturnButtonText, setLocalChanceReturnButtonText] = useState(chanceReturnButtonText);
    const [localGameBackgroundColor, setLocalGameBackgroundColor] = useState(gameBackgroundColor);
    const [localGameFrameColor, setLocalGameFrameColor] = useState(gameFrameColor);
    const [focusPreview, setFocusPreview] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);

    useEffect(() => {
        const dirty = localTextColor !== textColor ||
            localTitleColor !== titleColor ||
            localSplashButtonColor !== splashButtonColor ||
            localSplashButtonHoverColor !== splashButtonHoverColor ||
            localSplashButtonTextColor !== splashButtonTextColor ||
            localActionButtonColor !== actionButtonColor ||
            localActionButtonTextColor !== actionButtonTextColor ||
            localFocusColor !== focusColor ||
            localChanceIconColor !== chanceIconColor ||
            localFontFamily !== gameFontFamily ||
            localChanceIcon !== chanceIcon ||
            localChanceLossMessage !== chanceLossMessage ||
            localChanceRestoreMessage !== chanceRestoreMessage ||
            localChanceReturnButtonText !== chanceReturnButtonText ||
            localGameBackgroundColor !== gameBackgroundColor ||
            localGameFrameColor !== gameFrameColor;
        onSetDirty(dirty);
    }, [localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor, localSplashButtonTextColor, localActionButtonColor, localActionButtonTextColor, localFocusColor, localChanceIconColor, localFontFamily, localChanceIcon, localChanceLossMessage, localChanceRestoreMessage, localChanceReturnButtonText, localGameBackgroundColor, localGameFrameColor, props, onSetDirty]);

    // FIX: Using correct property names from types.ts (removed 'game' prefix for light theme colors)
    const handleSave = () => {
        if (localTextColor !== textColor) onUpdate('gameTextColor', localTextColor);
        if (localTitleColor !== titleColor) onUpdate('gameTitleColor', localTitleColor);
        if (localSplashButtonColor !== splashButtonColor) onUpdate('gameSplashButtonColor', localSplashButtonColor);
        if (localSplashButtonHoverColor !== splashButtonHoverColor) onUpdate('gameSplashButtonHoverColor', localSplashButtonHoverColor);
        if (localSplashButtonTextColor !== splashButtonTextColor) onUpdate('gameSplashButtonTextColor', localSplashButtonTextColor);
        if (localActionButtonColor !== actionButtonColor) onUpdate('gameActionButtonColor', localActionButtonColor);
        if (localActionButtonTextColor !== actionButtonTextColor) onUpdate('gameActionButtonTextColor', localActionButtonTextColor);
        if (localFocusColor !== focusColor) onUpdate('gameFocusColor', localFocusColor);
        if (localChanceIconColor !== chanceIconColor) onUpdate('gameChanceIconColor', localChanceIconColor);
        if (localFontFamily !== gameFontFamily) onUpdate('gameFontFamily', localFontFamily);
        if (localChanceIcon !== chanceIcon) onUpdate('gameChanceIcon', localChanceIcon);
        if (localChanceLossMessage !== chanceLossMessage) onUpdate('gameChanceLossMessage', localChanceLossMessage);
        if (localChanceRestoreMessage !== chanceRestoreMessage) onUpdate('gameChanceRestoreMessage', localChanceRestoreMessage);
        if (localChanceReturnButtonText !== chanceReturnButtonText) onUpdate('gameChanceReturnButtonText', localChanceReturnButtonText);
        if (localGameBackgroundColor !== gameBackgroundColor) onUpdate('gameBackgroundColor', localGameBackgroundColor);
        if (localGameFrameColor !== gameFrameColor) onUpdate('gameFrameColor', localGameFrameColor);
    };

    const handleUndo = () => {
        setLocalTextColor(textColor);
        setLocalTitleColor(titleColor);
        setLocalSplashButtonColor(splashButtonColor);
        setLocalSplashButtonHoverColor(splashButtonHoverColor);
        setLocalSplashButtonTextColor(splashButtonTextColor);
        setLocalActionButtonColor(actionButtonColor);
        setLocalActionButtonTextColor(actionButtonTextColor);
        setLocalFocusColor(focusColor);
        setLocalChanceIconColor(chanceIconColor);
        setLocalFontFamily(gameFontFamily);
        setLocalChanceIcon(chanceIcon);
        setLocalChanceLossMessage(chanceLossMessage);
        setLocalChanceRestoreMessage(chanceRestoreMessage);
        setLocalChanceReturnButtonText(chanceReturnButtonText);
        setLocalGameBackgroundColor(gameBackgroundColor);
        setLocalGameFrameColor(gameFrameColor);
    };

    const applyTheme = (theme: typeof PREDEFINED_THEMES[0]) => {
        setLocalTextColor(theme.textColor);
        setLocalTitleColor(theme.titleColor);
        setLocalFocusColor(theme.focusColor);
        setLocalSplashButtonColor(theme.splashButtonColor);
        setLocalSplashButtonHoverColor(theme.splashButtonHoverColor);
        setLocalSplashButtonTextColor(theme.splashButtonTextColor);
        setLocalActionButtonColor(theme.actionButtonColor);
        setLocalActionButtonTextColor(theme.actionButtonTextColor);
        setLocalChanceIconColor(theme.chanceIconColor);
        if (theme.gameBackgroundColor) setLocalGameBackgroundColor(theme.gameBackgroundColor);
        // Default frame color to white for all themes
        setLocalGameFrameColor('#FFFFFF');
    };

    const HeartIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
        <svg fill={color} viewBox="0 0 24 24" className={className}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    const CircleIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
        <svg fill={color} viewBox="0 0 24 24" className={className}>
            <circle cx="12" cy="12" r="10" />
        </svg>
    );

    const CrossIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
        <svg stroke={color} strokeWidth="8" strokeLinecap="round" viewBox="0 0 24 24" className={className} fill="none">
            <path d="M12 5 V19 M5 12 H19" />
        </svg>
    );

    const SquareIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
        <svg fill={color} viewBox="0 0 24 24" className={className}>
            <rect x="5" y="5" width="14" height="14" rx="1" />
        </svg>
    );

    const DiamondIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
        <svg fill={color} viewBox="0 0 24 24" className={className}>
            <path d="M12 2l10 10-10 10L2 12z" />
        </svg>
    );

    const ChanceIcon: React.FC<{ type: 'heart' | 'circle' | 'cross' | 'square' | 'diamond', color: string, className?: string }> = ({ type, color, className }) => {
        switch (type) {
            case 'heart': return <HeartIcon color={color} className={className} />;
            case 'circle': return <CircleIcon color={color} className={className} />;
            case 'cross': return <CrossIcon color={color} className={className} />;
            case 'square': return <SquareIcon color={color} className={className} />;
            case 'diamond': return <DiamondIcon color={color} className={className} />;
            default: return <HeartIcon color={color} className={className} />;
        }
    };


    return (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-zinc-500 mt-1 text-sm font-medium">
                        {t('ThemeEditor.headerDescription')}
                    </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 mt-1">
                    {isDirty && (
                        <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                            <span>{t('ThemeEditor.unsavedChanges')}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900/40 border border-muted-foreground/50 rounded-xl p-6 space-y-8">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">{t('ThemeEditor.gameFont')}</h3>
                        <div>
                            <select
                                id="font-select"
                                value={localFontFamily}
                                onChange={(e) => setLocalFontFamily(e.target.value)}
                                className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 [&>option]:bg-zinc-950"
                                style={{ fontFamily: localFontFamily }}
                            >
                                {FONTS.map(font => (
                                    <option key={font.name} value={font.family} style={{ fontFamily: font.family }}>
                                        {t(`fonts.${font.name.replace(/[^a-zA-Z]/g, '')}`, { defaultValue: font.name })} · {t(`fonts.categories.${font.category}`, { defaultValue: font.category })}
                                    </option>
                                ))}
                            </select>
                        </div>

                    <div className="pt-6 border-t border-muted-foreground/50">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">{t('ThemeEditor.predefinedThemes')}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {PREDEFINED_THEMES.map(theme => (
                                <button
                                    key={theme.name}
                                    onClick={() => applyTheme(theme)}
                                    className="text-left p-3 rounded-lg border border-muted-foreground/50 hover:border-purple-500/50 hover:bg-zinc-800/50 transition-all bg-zinc-950/50 group"
                                    title={t('ThemeEditor.applyTheme', { theme: t(`ThemeEditor.themes.${theme.name.replace(/[^a-zA-Z]/g, '')}`, { defaultValue: theme.name }) })}
                                >
                                    <span className="font-bold text-[10px] uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                        {t(`ThemeEditor.themes.${theme.name.replace(/[^a-zA-Z]/g, '')}`, { defaultValue: theme.name })}
                                    </span>
                                    <div className="flex mt-2 gap-1.5">
                                        <div className="w-1/3 h-5 rounded-sm border border-white/5" style={{ backgroundColor: theme.titleColor }}></div>
                                        <div className="w-1/3 h-5 rounded-sm border border-white/5" style={{ backgroundColor: theme.textColor }}></div>
                                        <div className="w-1/3 h-5 rounded-sm border border-white/5" style={{ backgroundColor: theme.splashButtonColor }}></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {!isCustomizing && (
                        <div className="pt-6 border-t border-muted-foreground/50">
                            <button
                                onClick={() => setIsCustomizing(true)}
                                className="w-full py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20"
                            >
                                {t('ThemeEditor.customizeColors')}
                            </button>
                        </div>
                    )}

                    {isCustomizing && (
                        <>
                            <div className="pt-6 border-t border-muted-foreground/50">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">{t('ThemeEditor.colorsGeneral', 'Cores Principais')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <ColorInput label={t('ThemeEditor.backgroundColor', 'Cor de Fundo')} id="gameBackgroundColor" value={localGameBackgroundColor} onChange={setLocalGameBackgroundColor} placeholder="#0d1117" />
                                    <ColorInput label={t('ThemeEditor.defaultText')} id="textColor" value={localTextColor} onChange={setLocalTextColor} placeholder="#c9d1d9" />
                                    <ColorInput label={t('ThemeEditor.titleHighlight')} id="titleColor" value={localTitleColor} onChange={setLocalTitleColor} placeholder="#58a6ff" />
                                    <ColorInput label={t('ThemeEditor.focusHighlight')} id="focusColor" value={localFocusColor} onChange={setLocalFocusColor} placeholder="#58a6ff" />
                                </div>
                            </div>


                            <div className="pt-6 border-t border-muted-foreground/50">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{t('ThemeEditor.buttonsGeneral')}</h3>
                                <p className="text-[10px] text-zinc-600 mb-6 italic">{t('ThemeEditor.buttonsInfo')}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <ColorInput label={t('ThemeEditor.splashButton')} id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#2ea043" />
                                    <ColorInput label={t('ThemeEditor.splashButtonText')} id="splashButtonTextColor" value={localSplashButtonTextColor} onChange={setLocalSplashButtonTextColor} placeholder="#ffffff" />
                                    <ColorInput label={t('ThemeEditor.splashButtonHover')} id="splashButtonHoverColor" value={localSplashButtonHoverColor} onChange={setLocalSplashButtonHoverColor} placeholder="#238636" />
                                    <ColorInput label={t('ThemeEditor.actionButton')} id="actionButtonColor" value={localActionButtonColor} onChange={setLocalActionButtonColor} placeholder="#ffffff" />
                                    <ColorInput label={t('ThemeEditor.actionButtonText')} id="actionButtonTextColor" value={localActionButtonTextColor} onChange={setLocalActionButtonTextColor} placeholder="#0d1117" />
                                    <ColorInput label={t('ThemeEditor.imageFrame')} id="gameFrameColor" value={localGameFrameColor} onChange={setLocalGameFrameColor} placeholder="#FFFFFF" />
                                </div>
                            </div>
                        </>
                    )}
                    {enableChances && (
                        <div className="pt-6 border-t border-muted-foreground/50">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">{t('ThemeEditor.chanceSystem')}</h3>
                            <div className="space-y-6 mt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {isCustomizing && (
                                        <ColorInput label={t('ThemeEditor.iconColor')} id="chanceIconColor" value={localChanceIconColor} onChange={setLocalChanceIconColor} placeholder="#ff4d4d" />
                                    )}
                                    <div>
                                        <label htmlFor="chanceIcon" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('ThemeEditor.iconShape')}</label>
                                        <select
                                            id="chanceIcon"
                                            value={localChanceIcon}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onChange={(e) => setLocalChanceIcon(e.target.value as any)}
                                            className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 [&>option]:bg-zinc-950"
                                        >
                                            <option value="heart">{t('ThemeEditor.hearts')}</option>
                                            <option value="circle">{t('ThemeEditor.circles')}</option>
                                            <option value="square">{t('ThemeEditor.squares')}</option>
                                            <option value="diamond">{t('ThemeEditor.diamonds')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="chanceLossMessage" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('ThemeEditor.lossMessage')}</label>
                                    <input
                                        type="text"
                                        id="chanceLossMessage"
                                        value={localChanceLossMessage}
                                        onChange={(e) => setLocalChanceLossMessage(e.target.value)}
                                        className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0"
                                    />
                                    <p className="text-[10px] text-zinc-600 mt-2 italic">{t('ThemeEditor.chancesInfo')}</p>
                                </div>
                                <div>
                                    <label htmlFor="chanceRestoreMessage" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('ThemeEditor.restoreMessage')}</label>
                                    <input
                                        type="text"
                                        id="chanceRestoreMessage"
                                        value={localChanceRestoreMessage}
                                        onChange={(e) => setLocalChanceRestoreMessage(e.target.value)}
                                        className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="chanceReturnButton" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{t('ThemeEditor.returnButtonText')}</label>
                                    <input
                                        type="text"
                                        id="chanceReturnButton"
                                        value={localChanceReturnButtonText}
                                        onChange={(e) => setLocalChanceReturnButtonText(e.target.value)}
                                        className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <p className="text-[10px] text-zinc-600 mb-4 text-center font-bold uppercase tracking-widest">{t('ThemeEditor.livePreview')}</p>
                    <div
                        className="flex-1 border p-6 flex flex-col justify-between transition-colors shadow-2xl rounded-xl border-muted-foreground/50"
                        style={{ fontFamily: localFontFamily, backgroundColor: localGameBackgroundColor }}
                    >
                        <div className="flex justify-between items-start">
                            <h1 className="text-xl" style={{ color: localTitleColor }}>{t('ThemeEditor.previewTitle')}</h1>
                            {enableChances && (
                                <div className="flex gap-1">
                                    <ChanceIcon type={localChanceIcon} color={localChanceIconColor} />
                                    <ChanceIcon type={localChanceIcon} color={localChanceIconColor} />
                                    <ChanceIcon type={localChanceIcon} color={localChanceIconColor} />
                                </div>
                            )}
                        </div>
                        <div className="my-4">
                            <p className="text-sm" style={{ color: localTextColor }}>{t('ThemeEditor.previewDesc')}</p>
                            <p className="mt-2 text-sm italic" style={{ color: `color-mix(in srgb, ${localTextColor} 70%, ${localGameBackgroundColor} 30%)` }}>&gt; {t('ThemeEditor.previewCommand')}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder={t('ThemeEditor.commandField')}
                                    className="flex-1 border-2 rounded p-2 text-xs transition-colors focus:ring-0"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${localGameBackgroundColor} 98%, #000 2%)`,
                                        color: localTextColor,
                                        borderColor: focusPreview
                                            ? localFocusColor
                                            : `color-mix(in srgb, ${localGameBackgroundColor} 85%, ${localTextColor} 15%)`,
                                        fontFamily: localFontFamily,
                                    }}
                                    onFocus={() => setFocusPreview(true)}
                                    onBlur={() => setFocusPreview(false)}
                                />
                                <button className="font-bold py-2 px-4 rounded" style={{ backgroundColor: localActionButtonColor, color: localActionButtonTextColor, fontFamily: localFontFamily }}>{t('ThemeEditor.action')}</button>
                            </div>
                            <button
                                className="w-full font-bold transition-all duration-200 ease-in-out text-lg py-3"
                                style={{
                                    backgroundColor: localSplashButtonColor,
                                    color: localSplashButtonTextColor,
                                    fontFamily: localFontFamily,
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = localSplashButtonHoverColor}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = localSplashButtonColor}
                            >
                                {t('ThemeEditor.startButton')}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="fixed bottom-6 right-10 z-10 flex gap-2">
                <button
                    onClick={handleUndo}
                    disabled={!isDirty}
                    className={`px-4 py-2 font-bold rounded-lg transition-all text-xs border ${isDirty
                        ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500 shadow-lg shadow-purple-900/20'
                        : 'bg-zinc-900 border-muted-foreground/50 text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                    title={isDirty ? t('ThemeEditor.undoChanges') : t('ThemeEditor.noChangesToUndo')}
                >
                    {t('ThemeEditor.undo')}
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="px-6 py-2 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-sm disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed"
                    title={isDirty ? t('ThemeEditor.saveThemeChanges') : t('ThemeEditor.noChangesToSave')}
                >
                    {t('ThemeEditor.save')}
                </button>
            </div>
        </div>
    );
};

export default ThemeEditor;
