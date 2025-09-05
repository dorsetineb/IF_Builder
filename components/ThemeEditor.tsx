
import React, { useState, useEffect } from 'react';
import { GameData } from '../types';

interface ThemeEditorProps {
  textColor: string;
  titleColor: string;
  splashButtonColor: string;
  splashButtonHoverColor: string;
  actionButtonColor: string;
  focusColor: string;
  chanceIconColor: string;
  gameFontFamily: string;
  onUpdate: (field: keyof GameData, value: string) => void;
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
        actionButtonColor, focusColor, chanceIconColor, gameFontFamily, onUpdate 
    } = props;

    const [localTextColor, setLocalTextColor] = useState(textColor);
    const [localTitleColor, setLocalTitleColor] = useState(titleColor);
    const [localSplashButtonColor, setLocalSplashButtonColor] = useState(splashButtonColor);
    const [localSplashButtonHoverColor, setLocalSplashButtonHoverColor] = useState(splashButtonHoverColor);
    const [localActionButtonColor, setLocalActionButtonColor] = useState(actionButtonColor);
    const [localFocusColor, setLocalFocusColor] = useState(focusColor);
    const [localChanceIconColor, setLocalChanceIconColor] = useState(chanceIconColor);
    const [localFontFamily, setLocalFontFamily] = useState(gameFontFamily);
    const [isDirty, setIsDirty] = useState(false);
    const [focusPreview, setFocusPreview] = useState(false);

    useEffect(() => {
        setLocalTextColor(props.textColor);
        setLocalTitleColor(props.titleColor);
        setLocalSplashButtonColor(props.splashButtonColor);
        setLocalSplashButtonHoverColor(props.splashButtonHoverColor);
        setLocalActionButtonColor(props.actionButtonColor);
        setLocalFocusColor(props.focusColor);
        setLocalChanceIconColor(props.chanceIconColor);
        setLocalFontFamily(props.gameFontFamily);
        setIsDirty(false);
    }, [props]);

    useEffect(() => {
        const dirty = localTextColor !== textColor ||
                      localTitleColor !== titleColor ||
                      localSplashButtonColor !== splashButtonColor ||
                      localSplashButtonHoverColor !== splashButtonHoverColor ||
                      localActionButtonColor !== actionButtonColor ||
                      localFocusColor !== focusColor ||
                      localChanceIconColor !== chanceIconColor ||
                      localFontFamily !== gameFontFamily;
        setIsDirty(dirty);
    }, [localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor, localActionButtonColor, localFocusColor, localChanceIconColor, localFontFamily, props]);

    const handleSave = () => {
        if (localTextColor !== textColor) onUpdate('gameTextColor', localTextColor);
        if (localTitleColor !== titleColor) onUpdate('gameTitleColor', localTitleColor);
        if (localSplashButtonColor !== splashButtonColor) onUpdate('gameSplashButtonColor', localSplashButtonColor);
        if (localSplashButtonHoverColor !== splashButtonHoverColor) onUpdate('gameSplashButtonHoverColor', localSplashButtonHoverColor);
        if (localActionButtonColor !== actionButtonColor) onUpdate('gameActionButtonColor', localActionButtonColor);
        if (localFocusColor !== focusColor) onUpdate('gameFocusColor', localFocusColor);
        if (localChanceIconColor !== chanceIconColor) onUpdate('gameChanceIconColor', localChanceIconColor);
        if (localFontFamily !== gameFontFamily) onUpdate('gameFontFamily', localFontFamily);
    };
    
    const handleUndo = () => {
        setLocalTextColor(textColor);
        setLocalTitleColor(titleColor);
        setLocalSplashButtonColor(splashButtonColor);
        setLocalSplashButtonHoverColor(splashButtonHoverColor);
        setLocalActionButtonColor(actionButtonColor);
        setLocalFocusColor(focusColor);
        setLocalChanceIconColor(chanceIconColor);
        setLocalFontFamily(gameFontFamily);
    };
    
    const HeartIcon: React.FC<{ color: string }> = ({ color }) => (
        <svg fill={color} viewBox="0 0 24 24" className="w-7 h-7">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    );

    return (
        <div className="space-y-6 pb-24">
            <div>
                <h2 className="text-3xl font-bold text-brand-text">Tema do Jogo</h2>
                <p className="text-brand-text-dim mt-1">
                    Gerencie a paleta de cores e a fonte do seu jogo. As alterações são refletidas na pré-visualização ao vivo.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-brand-surface rounded-lg border border-brand-border p-6 space-y-6">
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
                     <div className="pt-6 border-t border-brand-border/50">
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Cores Gerais</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ColorInput label="Cor do Texto Padrão" id="textColor" value={localTextColor} onChange={setLocalTextColor} placeholder="#c9d1d9" />
                            <ColorInput label="Cor do Título / Destaque" id="titleColor" value={localTitleColor} onChange={setLocalTitleColor} placeholder="#58a6ff" />
                        </div>
                    </div>
                    <div className="pt-6 border-t border-brand-border/50">
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Tela de Abertura</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ColorInput label="Cor do Botão de Início" id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#2ea043" />
                            <ColorInput label="Cor do Botão de Início (Hover)" id="splashButtonHoverColor" value={localSplashButtonHoverColor} onChange={setLocalSplashButtonHoverColor} placeholder="#238636" />
                        </div>
                    </div>
                     <div className="pt-6 border-t border-brand-border/50">
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Interface do Jogo</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ColorInput label="Cor do Botão de Ação" id="actionButtonColor" value={localActionButtonColor} onChange={setLocalActionButtonColor} placeholder="#ffffff" />
                            <ColorInput label="Cor de Destaque (Foco)" id="focusColor" value={localFocusColor} onChange={setLocalFocusColor} placeholder="#58a6ff" />
                            <ColorInput label="Cor dos Ícones de Vidas" id="chanceIconColor" value={localChanceIconColor} onChange={setLocalChanceIconColor} placeholder="#ff4d4d" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-brand-text-dim mb-2 text-center">Pré-visualização ao vivo</p>
                    <div className="flex-1 bg-[#0d1117] rounded-lg border-2 border-brand-border p-6 flex flex-col justify-between" style={{ fontFamily: localFontFamily }}>
                        <div className="flex justify-between items-start">
                             <h1 className="text-xl" style={{ color: localTitleColor }}>Título do Jogo</h1>
                             <div className="flex gap-1">
                                <HeartIcon color={localChanceIconColor} />
                                <HeartIcon color={localChanceIconColor} />
                                <HeartIcon color={localChanceIconColor} />
                             </div>
                        </div>
                        <div className="my-4">
                            <p className="text-sm" style={{ color: localTextColor }}>Esta é uma descrição de exemplo para a cena. Ela usa a cor de texto padrão que você definir.</p>
                            <p className="mt-2 text-sm italic" style={{ color: '#8b949e' }}>&gt; comando de exemplo</p>
                        </div>
                        <div className="space-y-4">
                             <div className="flex items-center gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Campo de comando"
                                    className="flex-1 bg-[#010409] border-2 rounded p-2 text-sm"
                                    style={{
                                        color: localTextColor,
                                        borderColor: focusPreview ? localFocusColor : '#30363d',
                                        fontFamily: localFontFamily,
                                    }}
                                    onFocus={() => setFocusPreview(true)}
                                    onBlur={() => setFocusPreview(false)}
                                />
                                <button className="font-bold py-2 px-4 rounded" style={{ backgroundColor: localActionButtonColor, color: '#0d1117', fontFamily: localFontFamily }}>Ação</button>
                             </div>
                              <button
                                    className="w-full font-bold text-white transition-all duration-200 ease-in-out text-lg py-3"
                                    style={{
                                        backgroundColor: localSplashButtonColor,
                                        fontFamily: localFontFamily,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = localSplashButtonHoverColor}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = localSplashButtonColor}
                                >
                                    Botão de Início
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