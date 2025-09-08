

import React, { useState, useEffect } from 'react';
import { GameData } from '../types';

interface ThemeEditorProps {
  textColor: string;
  titleColor: string;
  splashButtonColor: string;
  splashButtonHoverColor: string;
  splashButtonTextColor: string;
  focusColor: string;
  chanceIconColor: string;
  gameFontFamily: string;
  enableChances: boolean;
  maxChances: number;
  chanceIcon: 'circle' | 'cross' | 'heart';
  gameTheme: 'dark' | 'light';
  textColorLight: string;
  titleColorLight: string;
  focusColorLight: string;
  gameChanceLossMessage: string;
  gameChanceReturnButtonText: string;
  onUpdate: (field: keyof GameData, value: any) => void;
}

const FONTS = [
    { name: 'Pixel (Padrão)', family: "'Silkscreen', sans-serif" },
    { name: 'Pixel (Arcade)', family: "'Press Start 2P', cursive" },
    { name: 'Pixel (Terminal)', family: "'VT323', monospace" },
    { name: 'Pixel (Gótico)', family: "'DotGothic16', sans-serif" },
    { name: 'Máquina de Escrever', family: "'Special Elite', cursive" },
    { name: 'Mono (Arredondada)', family: "'Cutive Mono', monospace" },
    { name: 'Mono (Técnica)', family: "'Share Tech Mono', monospace" },
    { name: 'Mono (Console)', family: "'Inconsolata', monospace" },
    { name: 'Mono (Moderna)', family: "'Roboto Mono', monospace" },
    { name: 'Mono (Clássica)', family: "'Anonymous Pro', monospace" },
];

const ColorInput: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}> = ({ label, id, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-dim mb-1">{label}</label>
        <div className="flex items-center gap-2 p-1 bg-brand-bg border border-brand-border rounded-md">
            <input
                type="color"
                id={`${id}-picker`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                aria-label={`Seletor de cor para ${label}`}
            />
            <input
                type="text"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent font-mono text-sm focus:outline-none"
                placeholder={placeholder}
            />
        </div>
    </div>
);


const ThemeEditor: React.FC<ThemeEditorProps> = (props) => {
    const { 
        textColor, titleColor, splashButtonColor, splashButtonHoverColor,
        splashButtonTextColor, focusColor, chanceIconColor, gameFontFamily, 
        enableChances, maxChances, chanceIcon, onUpdate,
        gameTheme, textColorLight, titleColorLight, focusColorLight,
        gameChanceLossMessage, gameChanceReturnButtonText
    } = props;

    const [localTextColor, setLocalTextColor] = useState(textColor);
    const [localTitleColor, setLocalTitleColor] = useState(titleColor);
    const [localSplashButtonColor, setLocalSplashButtonColor] = useState(splashButtonColor);
    const [localSplashButtonHoverColor, setLocalSplashButtonHoverColor] = useState(splashButtonHoverColor);
    const [localSplashButtonTextColor, setLocalSplashButtonTextColor] = useState(splashButtonTextColor);
    const [localFocusColor, setLocalFocusColor] = useState(focusColor);
    const [localChanceIconColor, setLocalChanceIconColor] = useState(chanceIconColor);
    const [localFontFamily, setLocalFontFamily] = useState(gameFontFamily);
    const [localMaxChances, setLocalMaxChances] = useState(maxChances);
    const [localChanceIcon, setLocalChanceIcon] = useState(chanceIcon);
    const [localGameTheme, setLocalGameTheme] = useState(gameTheme);
    const [localTextColorLight, setLocalTextColorLight] = useState(textColorLight);
    const [localTitleColorLight, setLocalTitleColorLight] = useState(titleColorLight);
    const [localFocusColorLight, setLocalFocusColorLight] = useState(focusColorLight);
    const [localGameChanceLossMessage, setLocalGameChanceLossMessage] = useState(gameChanceLossMessage);
    const [localGameChanceReturnButtonText, setLocalGameChanceReturnButtonText] = useState(gameChanceReturnButtonText);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setLocalTextColor(props.textColor);
        setLocalTitleColor(props.titleColor);
        setLocalSplashButtonColor(props.splashButtonColor);
        setLocalSplashButtonHoverColor(props.splashButtonHoverColor);
        setLocalSplashButtonTextColor(props.splashButtonTextColor);
        setLocalFocusColor(props.focusColor);
        setLocalChanceIconColor(props.chanceIconColor);
        setLocalFontFamily(props.gameFontFamily);
        setLocalMaxChances(props.maxChances);
        setLocalChanceIcon(props.chanceIcon);
        setLocalGameTheme(props.gameTheme);
        setLocalTextColorLight(props.textColorLight);
        setLocalTitleColorLight(props.titleColorLight);
        setLocalFocusColorLight(props.focusColorLight);
        setLocalGameChanceLossMessage(props.gameChanceLossMessage);
        setLocalGameChanceReturnButtonText(props.gameChanceReturnButtonText);
        setIsDirty(false);
    }, [props]);

    useEffect(() => {
        const dirty = localTextColor !== textColor ||
                      localTitleColor !== titleColor ||
                      localSplashButtonColor !== splashButtonColor ||
                      localSplashButtonHoverColor !== splashButtonHoverColor ||
                      localSplashButtonTextColor !== splashButtonTextColor ||
                      localFocusColor !== focusColor ||
                      localChanceIconColor !== chanceIconColor ||
                      localFontFamily !== gameFontFamily ||
                      localMaxChances !== maxChances ||
                      localChanceIcon !== chanceIcon ||
                      localGameTheme !== gameTheme ||
                      localTextColorLight !== textColorLight ||
                      localTitleColorLight !== titleColorLight ||
                      localFocusColorLight !== focusColorLight ||
                      localGameChanceLossMessage !== gameChanceLossMessage ||
                      localGameChanceReturnButtonText !== gameChanceReturnButtonText;
        setIsDirty(dirty);
    }, [localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor, localSplashButtonTextColor, localFocusColor, localChanceIconColor, localFontFamily, localMaxChances, localChanceIcon, localGameTheme, localTextColorLight, localTitleColorLight, localFocusColorLight, localGameChanceLossMessage, localGameChanceReturnButtonText, props]);

    const handleSave = () => {
        if (localTextColor !== textColor) onUpdate('gameTextColor', localTextColor);
        if (localTitleColor !== titleColor) onUpdate('gameTitleColor', localTitleColor);
        if (localSplashButtonColor !== splashButtonColor) onUpdate('gameSplashButtonColor', localSplashButtonColor);
        if (localSplashButtonHoverColor !== splashButtonHoverColor) onUpdate('gameSplashButtonHoverColor', localSplashButtonHoverColor);
        if (localSplashButtonTextColor !== splashButtonTextColor) onUpdate('gameSplashButtonTextColor', localSplashButtonTextColor);
        if (localFocusColor !== focusColor) onUpdate('gameFocusColor', localFocusColor);
        if (localChanceIconColor !== chanceIconColor) onUpdate('gameChanceIconColor', localChanceIconColor);
        if (localFontFamily !== gameFontFamily) onUpdate('gameFontFamily', localFontFamily);
        if (localMaxChances !== maxChances) onUpdate('gameMaxChances', localMaxChances);
        if (localChanceIcon !== chanceIcon) onUpdate('gameChanceIcon', localChanceIcon);
        if (localGameTheme !== gameTheme) onUpdate('gameTheme', localGameTheme);
        if (localTextColorLight !== textColorLight) onUpdate('gameTextColorLight', localTextColorLight);
        if (localTitleColorLight !== titleColorLight) onUpdate('gameTitleColorLight', localTitleColorLight);
        if (localFocusColorLight !== focusColorLight) onUpdate('gameFocusColorLight', localFocusColorLight);
        if (localGameChanceLossMessage !== gameChanceLossMessage) onUpdate('gameChanceLossMessage', localGameChanceLossMessage);
        if (localGameChanceReturnButtonText !== gameChanceReturnButtonText) onUpdate('gameChanceReturnButtonText', localGameChanceReturnButtonText);
    };
    
    const handleUndo = () => {
        setLocalTextColor(textColor);
        setLocalTitleColor(titleColor);
        setLocalSplashButtonColor(splashButtonColor);
        setLocalSplashButtonHoverColor(splashButtonHoverColor);
        setLocalSplashButtonTextColor(splashButtonTextColor);
        setLocalFocusColor(focusColor);
        setLocalChanceIconColor(chanceIconColor);
        setLocalFontFamily(gameFontFamily);
        setLocalMaxChances(maxChances);
        setLocalChanceIcon(chanceIcon);
        setLocalGameTheme(gameTheme);
        setLocalTextColorLight(textColorLight);
        setLocalTitleColorLight(titleColorLight);
        setLocalFocusColorLight(focusColorLight);
        setLocalGameChanceLossMessage(gameChanceLossMessage);
        setLocalGameChanceReturnButtonText(gameChanceReturnButtonText);
    };
    
    const HeartIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
        <svg fill={color} viewBox="0 0 24 24" className={className}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    );

    const CircleIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
      <svg fill={color} viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    );

    const CrossIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
      <svg stroke={color} strokeWidth="3" strokeLinecap="round" viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 5 V19 M5 12 H19"/>
      </svg>
    );

    const ChanceIcon: React.FC<{ type: 'heart' | 'circle' | 'cross', color: string, className?: string }> = ({ type, color, className }) => {
        switch (type) {
            case 'heart': return <HeartIcon color={color} className={className} />;
            case 'circle': return <CircleIcon color={color} className={className} />;
            case 'cross': return <CrossIcon color={color} className={className} />;
            default: return <HeartIcon color={color} className={className} />;
        }
    };


    return (
        <div className="space-y-6 pb-24">
            <div>
                <h2 className="text-3xl font-bold text-brand-text">Tema do Jogo</h2>
                <p className="text-brand-text-dim mt-1">
                    Gerencie a paleta de cores, fonte e outros elementos visuais do seu jogo.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-brand-surface rounded-lg border border-brand-border p-6 space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-brand-text">Tema da Interface</h3>
                        <div className="flex gap-2 rounded-md bg-brand-bg p-1">
                            <button
                                onClick={() => setLocalGameTheme('dark')}
                                className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                                    localGameTheme === 'dark' ? 'bg-brand-primary text-brand-bg' : 'hover:bg-brand-border/30'
                                }`}
                            >
                                Escuro
                            </button>
                            <button
                                onClick={() => setLocalGameTheme('light')}
                                className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                                    localGameTheme === 'light' ? 'bg-brand-primary text-brand-bg' : 'hover:bg-brand-border/30'
                                }`}
                            >
                                Claro
                            </button>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Fonte do Jogo</h3>
                         <div>
                            <label htmlFor="font-select" className="block text-sm font-medium text-brand-text-dim mb-1">Fonte do Jogo</label>
                            <select
                                id="font-select"
                                value={localFontFamily}
                                onChange={(e) => setLocalFontFamily(e.target.value)}
                                className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
                                style={{fontFamily: localFontFamily}}
                            >
                                {FONTS.map(font => (
                                    <option key={font.family} value={font.family} style={{fontFamily: font.family}}>
                                        {font.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {localGameTheme === 'dark' && (
                        <div className="pt-6 border-t border-brand-border/50">
                            <h3 className="text-lg font-semibold text-brand-text mb-4">Cores (Tema Escuro)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor do Texto Padrão" id="textColor" value={localTextColor} onChange={setLocalTextColor} placeholder="#c9d1d9" />
                                <ColorInput label="Cor do Título / Destaque" id="titleColor" value={localTitleColor} onChange={setLocalTitleColor} placeholder="#58a6ff" />
                                <ColorInput label="Cor de Destaque (Foco)" id="focusColor" value={localFocusColor} onChange={setLocalFocusColor} placeholder="#58a6ff" />
                            </div>
                        </div>
                    )}

                    {localGameTheme === 'light' && (
                        <div className="pt-6 border-t border-brand-border/50">
                            <h3 className="text-lg font-semibold text-brand-text mb-4">Cores (Tema Claro)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor do Texto Padrão" id="textColorLight" value={localTextColorLight} onChange={setLocalTextColorLight} placeholder="#24292f" />
                                <ColorInput label="Cor do Título / Destaque" id="titleColorLight" value={localTitleColorLight} onChange={setLocalTitleColorLight} placeholder="#0969da" />
                                <ColorInput label="Cor de Destaque (Foco)" id="focusColorLight" value={localFocusColorLight} onChange={setLocalFocusColorLight} placeholder="#0969da" />
                            </div>
                        </div>
                    )}


                    <div className="pt-6 border-t border-brand-border/50">
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Botão de Início</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ColorInput label="Cor do Botão de Início" id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#2ea043" />
                            <ColorInput label="Cor do Texto do Botão de Início" id="splashButtonTextColor" value={localSplashButtonTextColor} onChange={setLocalSplashButtonTextColor} placeholder="#ffffff" />
                            <ColorInput label="Cor do Botão de Início (Hover)" id="splashButtonHoverColor" value={localSplashButtonHoverColor} onChange={setLocalSplashButtonHoverColor} placeholder="#238636" />
                        </div>
                    </div>
                     {enableChances && (
                        <div className="pt-6 border-t border-brand-border/50">
                            <h3 className="text-lg font-semibold text-brand-text mb-4">Sistema de Chances (Vidas)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor dos Ícones de Vidas" id="chanceIconColor" value={localChanceIconColor} onChange={setLocalChanceIconColor} placeholder="#ff4d4d" />
                                <div>
                                    <label htmlFor="maxChances" className="block text-sm font-medium text-brand-text-dim mb-1">Número de Chances</label>
                                    <input
                                        type="number"
                                        id="maxChances"
                                        value={localMaxChances}
                                        onChange={(e) => setLocalMaxChances(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                                        min="1"
                                        max="10"
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="chanceIcon" className="block text-sm font-medium text-brand-text-dim mb-1">Formato do Ícone</label>
                                    <select
                                        id="chanceIcon"
                                        value={localChanceIcon}
                                        onChange={(e) => setLocalChanceIcon(e.target.value as any)}
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
                                    >
                                        <option value="heart">Corações</option>
                                        <option value="circle">Círculos</option>
                                        <option value="cross">Cruzes</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2 space-y-4 pt-4 mt-4 border-t border-brand-border/30">
                                    <div>
                                        <label htmlFor="chanceLossMessage" className="block text-sm font-medium text-brand-text-dim mb-1">
                                            Mensagem de Perda de Chance
                                            <span className="text-xs ml-1">(use {"{chances}"})</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="chanceLossMessage"
                                            value={localGameChanceLossMessage}
                                            onChange={(e) => setLocalGameChanceLossMessage(e.target.value)}
                                            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
                                            placeholder="Você perdeu uma chance."
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="chanceReturnButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Retorno</label>
                                        <input
                                            type="text"
                                            id="chanceReturnButtonText"
                                            value={localGameChanceReturnButtonText}
                                            onChange={(e) => setLocalGameChanceReturnButtonText(e.target.value)}
                                            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2"
                                            placeholder="Tentar Novamente"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-brand-text-dim mb-2 text-center">Pré-visualização ao vivo</p>
                    <div 
                        className={`flex-1 rounded-lg border-2 p-6 flex flex-col justify-between transition-colors ${localGameTheme === 'dark' ? 'bg-[#0d1117] border-brand-border' : 'bg-[#ffffff] border-[#d0d7de]'}`}
                        style={{ fontFamily: localFontFamily }}
                    >
                        <div className="flex justify-between items-start">
                             <h1 className="text-xl" style={{ color: localGameTheme === 'dark' ? localTitleColor : localTitleColorLight }}>Título do Jogo</h1>
                             {enableChances && (
                                <div className="flex gap-1">
                                    {Array.from({ length: localMaxChances }).map((_, i) => (
                                        <ChanceIcon key={i} type={localChanceIcon} color={localChanceIconColor} />
                                    ))}
                                </div>
                             )}
                        </div>
                        <div className="my-4">
                            <p className="text-sm" style={{ color: localGameTheme === 'dark' ? localTextColor : localTextColorLight }}>Esta é uma descrição de exemplo para a cena. Ela usa a cor de texto padrão que você definir.</p>
                        </div>
                        <div className="space-y-3">
                            <button
                                className="w-full font-bold transition-all duration-200 ease-in-out py-3 px-4 text-left border-2"
                                style={{
                                    backgroundColor: localGameTheme === 'dark' ? '#21262d' : '#f6f8fa',
                                    color: localGameTheme === 'dark' ? localTextColor : localTextColorLight,
                                    borderColor: localGameTheme === 'dark' ? '#30363d' : '#d0d7de',
                                    fontFamily: localFontFamily,
                                }}
                            >
                                Opção de Exemplo 1
                            </button>
                             <button
                                className="w-full font-bold transition-all duration-200 ease-in-out py-3 px-4 text-left border-2"
                                style={{
                                    backgroundColor: localGameTheme === 'dark' ? '#21262d' : '#f6f8fa',
                                    color: localGameTheme === 'dark' ? localTextColor : localTextColorLight,
                                    borderColor: localGameTheme === 'dark' ? localFocusColor : localFocusColorLight,
                                    fontFamily: localFontFamily,
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = localGameTheme === 'dark' ? '#30363d' : '#e5e7eb'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = localGameTheme === 'dark' ? '#21262d' : '#f6f8fa'}
                            >
                                Opção de Exemplo 2 (Hover)
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="fixed bottom-6 right-10 z-10 flex gap-2">
                <button
                    onClick={handleUndo}
                    disabled={!isDirty}
                    className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text-dim font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isDirty ? "Desfazer alterações" : "Nenhuma alteração para desfazer"}
                >
                    Desfazer
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    title={isDirty ? "Salvar alterações no tema" : "Nenhuma alteração para salvar"}
                >
                    Salvar
                </button>
            </div>
        </div>
    );
};

export default ThemeEditor;