import React, { useState, useEffect, useMemo, DragEvent } from 'react';
import { GameData, Vignette, Scene } from '../types';
import { FONTS } from '../constants';
import { Upload, Trash2, ImageIcon, MonitorPlay, Save, RotateCcw, Plus, ChevronDown, GripVertical } from 'lucide-react';


interface VignettesEditorProps {
    gameData: GameData;
    onUpdate: (data: Partial<GameData>) => void;
    onSetDirty: (isDirty: boolean) => void;
    allScenes: Scene[];
}

const VignetteItem: React.FC<{
    vignette: Vignette;
    gameData: GameData;
    onUpdate: (id: string, field: keyof Vignette, value: any) => void;
    onDelete: (id: string) => void;
    isOpening?: boolean;
    canDelete?: boolean;
    allScenes: Scene[];
    enableDrag?: boolean;
    onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
    onDragOver?: (e: DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: DragEvent<HTMLDivElement>) => void;
}> = ({ vignette, gameData, onUpdate, onDelete, isOpening, canDelete = true, allScenes, enableDrag, onDragStart, onDragOver, onDrop }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const isDark = (gameData.gameTheme || 'dark') === 'dark';
    const titleColor = isDark ? (gameData.gameTitleColor || '#58a6ff') : (gameData.titleColorLight || '#0969da');
    const textColor = isDark ? (gameData.gameTextColor || '#c9d1d9') : (gameData.textColorLight || '#24292f');
    const fontFamily = gameData.gameFontFamily || "'Silkscreen', sans-serif";
    const previewBg = isDark ? '#0d1117' : '#ffffff';
    const splashButtonBg = gameData.gameSplashButtonColor || '#2ea043';
    const splashButtonText = gameData.gameSplashButtonTextColor || '#ffffff';

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate(vignette.id, 'image', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate(vignette.id, 'backgroundMusic', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const event = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleImageUpload(event);
        }
    };

    return (
        <div className={`bg-zinc-900/30 rounded-lg border ${isOpen ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.05)]' : 'border-muted-foreground/50'} overflow-hidden transition-all duration-300 relative`}>

            {/* Header */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center h-16 cursor-pointers transition-all overflow-hidden group ${isOpen ? 'bg-purple-500/5 border-b border-purple-500/10' : ''}`}
                draggable={enableDrag}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                {/* Drag Handle */}
                {enableDrag && (
                    <div className="w-12 h-full cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 flex items-center justify-center shrink-0 border-r border-zinc-800/50 bg-black/20">
                        <GripVertical className="w-4 h-4" />
                    </div>
                )}

                {/* Sliding Trash Button (Only if can delete) */}
                {canDelete && !isOpening && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(vignette.id); }}
                        className="absolute top-0 right-0 h-full w-12 flex items-center justify-center bg-red-500 text-white transform translate-x-full group-hover:translate-x-0 focus:translate-x-0 transition-transform duration-200 ease-in-out z-20"
                        title="Excluir vinheta"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
                {vignette.image ? (
                    <div className="w-16 h-16 shrink-0 bg-zinc-950 border-r border-muted-foreground/50 overflow-hidden flex items-center justify-center">
                        <img src={vignette.image} alt="" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-16 h-16 shrink-0 bg-zinc-950/50 border-r border-muted-foreground/50 flex items-center justify-center">
                        <MonitorPlay className="w-6 h-6 text-zinc-700" />
                    </div>
                )}

                <div className="flex flex-1 items-center px-6 overflow-hidden">
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-zinc-200 truncate flex items-center gap-2">
                            {vignette.title || '(Sem título)'}
                            {isOpening && <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] uppercase tracking-widest border border-primary/30">Abertura</span>}
                            {vignette.isConclusion && <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[9px] uppercase tracking-widest border border-purple-500/30">Conclusão</span>}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0 uppercase tracking-tighter truncate">{vignette.id} {vignette.name ? `• ${vignette.name}` : ''}</span>
                    </div>
                </div>
            </div>

            {/* Collapsible Content */}
            {isOpen && (
                <div className="p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300 bg-zinc-950/30">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT COLUMN: Inputs */}
                        <div className="flex flex-col h-full gap-6">
                            {(isOpening) || (
                                <div className="grid grid-cols-[1fr_120px] gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Nome Interno</label>
                                        <input
                                            type="text"
                                            value={vignette.name}
                                            onChange={(e) => onUpdate(vignette.id, 'name', e.target.value)}
                                            className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0"
                                            placeholder="Ex: vinheta_final_ruim"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">ID</label>
                                        <input
                                            type="text"
                                            value={vignette.id}
                                            readOnly
                                            className="w-full bg-zinc-900/50 border border-muted-foreground/30 rounded-lg px-3 py-2 text-xs text-zinc-500 font-mono select-all truncate"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* SECTION: Title and Visibility Options */}
                                <div className="space-y-4">
                                    {/* Exibir na vinheta (Moved Up) */}
                                    <div className="flex items-center gap-6">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">Exibir na vinheta</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer group select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={vignette.showTitle ?? !vignette.omitTitle}
                                                    onChange={(e) => {
                                                        onUpdate(vignette.id, 'showTitle', e.target.checked);
                                                        if (e.target.checked) onUpdate(vignette.id, 'omitTitle', false);
                                                    }}
                                                    className="custom-checkbox"
                                                />
                                                <span className="text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors font-normal">Título</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={vignette.showDescription ?? !vignette.omitTitle}
                                                    onChange={(e) => {
                                                        onUpdate(vignette.id, 'showDescription', e.target.checked);
                                                        if (e.target.checked) onUpdate(vignette.id, 'omitTitle', false);
                                                    }}
                                                    className="custom-checkbox"
                                                />
                                                <span className="text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors font-normal">Descrição</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Separator */}
                                    <div className="border-t border-muted-foreground/10"></div>

                                    {/* Título Exibido */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Título Exibido</label>
                                        <input
                                            type="text"
                                            value={vignette.title}
                                            onChange={(e) => onUpdate(vignette.id, 'title', e.target.value)}
                                            className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 font-bold placeholder:text-muted-foreground/30"
                                            placeholder="Título da Vinheta"
                                        />
                                    </div>
                                </div>


                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Descrição / Texto</label>
                                        <textarea
                                            value={vignette.description}
                                            onChange={(e) => onUpdate(vignette.id, 'description', e.target.value)}
                                            className="custom-scrollbar w-full h-38 bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 resize-none leading-relaxed placeholder:text-muted-foreground/30"
                                            placeholder="O texto descritivo da vinheta..."
                                        />
                                    </div>

                                    {/* Separator */}
                                    <div className="border-t border-muted-foreground/10"></div>

                                    {/* Opções de Exibição (Moved Below Description) */}
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-2">Opções de Exibição</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Alinhamento Horizontal</label>
                                            <select
                                                value={vignette.contentAlignment || 'left'}
                                                onChange={(e) => onUpdate(vignette.id, 'contentAlignment', e.target.value)}
                                                className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 transition-all"
                                            >
                                                <option value="right">Direita</option>
                                                <option value="left">Esquerda</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Alinhamento Vertical</label>
                                            <select
                                                value={vignette.verticalAlignment || 'bottom'}
                                                onChange={(e) => onUpdate(vignette.id, 'verticalAlignment', e.target.value)}
                                                className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 transition-all"
                                            >
                                                <option value="bottom">Inferior</option>
                                                <option value="top">Superior</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Separator */}
                                    <div className="border-t border-muted-foreground/10"></div>

                                    {/* Text Scale and Button Text Row */}
                                    <div className="pt-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Text Scale (Left) */}
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Tamanho do Texto</label>
                                                <div className="relative">
                                                    <select
                                                        value={vignette.textScale || 'base'}
                                                        onChange={(e) => onUpdate(vignette.id, 'textScale', e.target.value)}
                                                        className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="sm">Pequeno</option>
                                                        <option value="base">Normal</option>
                                                        <option value="lg">Grande</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* Button Text (Right) */}
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Texto do Botão</label>
                                                <input
                                                    type="text"
                                                    value={vignette.buttonText || (isOpening ? (gameData.gameSplashButtonText || 'INICIAR') : '')}
                                                    onChange={(e) => onUpdate(vignette.id, 'buttonText', e.target.value)}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 font-bold placeholder:text-muted-foreground/30"
                                                    placeholder={isOpening ? "INICIAR" : "Texto do botão"}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Separator */}
                                    <div className="border-t border-muted-foreground/10"></div>

                                    {/* Animation Controls Row */}
                                    <div className="pt-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Animation Style (Left) */}
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Estilo de Animação</label>
                                                <div className="relative">
                                                    <select
                                                        value={vignette.textAnimationType || 'fade'}
                                                        onChange={(e) => onUpdate(vignette.id, 'textAnimationType', e.target.value)}
                                                        className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="fade">Fade (Surgir)</option>
                                                        <option value="typewriter">Máquina de Escrever</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* Animation Speed (Right) */}
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                                    Velocidade: {vignette.textSpeed || 3}
                                                </label>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="5"
                                                    value={vignette.textSpeed || 3}
                                                    onChange={(e) => onUpdate(vignette.id, 'textSpeed', parseInt(e.target.value))}
                                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Sections moved to Right Column */}
                        </div>

                        {/* RIGHT COLUMN: Preview */}
                        <div className="flex flex-col h-full gap-4">

                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preview</label>
                            <div
                                className="relative w-full aspect-video border border-muted-foreground/20 rounded-xl overflow-hidden shadow-2xl group flex-shrink-0"
                                style={{ backgroundColor: previewBg, fontFamily: fontFamily }}
                            >
                                {vignette.image ? (
                                    <div className="absolute inset-0 w-full h-full">
                                        <img src={vignette.image} alt="Fundo" className="w-full h-full object-cover opacity-60" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-30">
                                        <ImageIcon className="w-12 h-12 mb-2" style={{ color: titleColor }} />
                                        <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: titleColor }}>Sem imagem de fundo</p>
                                    </div>
                                )}

                                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all gap-3 backdrop-blur-sm">
                                    <label className="p-3 bg-white text-black rounded-lg cursor-pointer hover:bg-zinc-200 transition-all shadow-xl active:scale-95 transform hover:-translate-y-1">
                                        <Upload className="w-5 h-5" />
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                    {vignette.image && (
                                        <button onClick={() => onUpdate(vignette.id, 'image', '')} className="p-3 bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95 transform hover:-translate-y-1">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <div
                                    className={`absolute inset-0 z-20 p-8 flex flex-col pointer-events-none transition-all duration-300
                                        ${vignette.verticalAlignment === 'top' ? 'justify-start' : 'justify-end'}
                                        ${vignette.contentAlignment === 'right' ? 'items-end text-right' : 'items-start text-left'}
                                    `}
                                >
                                    <div className={`max-w-[70%] space-y-3 flex flex-col ${vignette.contentAlignment === 'right' ? 'items-end' : 'items-start'}`}>
                                        {(vignette.showTitle ?? !vignette.omitTitle) && (
                                            <h1
                                                className="font-black uppercase tracking-tight drop-shadow-lg leading-none transition-all duration-300"
                                                style={{
                                                    color: titleColor,
                                                    fontFamily: fontFamily,
                                                    fontSize: vignette.textScale === 'sm' ? '12px' :
                                                        vignette.textScale === 'lg' ? '18px' : '14px' // base
                                                }}
                                            >
                                                {vignette.title || gameData.gameTitle || "Título da Vinheta"}
                                            </h1>
                                        )}
                                        {(vignette.showDescription ?? !vignette.omitTitle) && (
                                            <p
                                                className="leading-relaxed line-clamp-4 drop-shadow-md font-medium transition-all duration-300"
                                                style={{
                                                    color: textColor,
                                                    fontFamily: fontFamily,
                                                    fontSize: vignette.textScale === 'sm' ? '8px' :
                                                        vignette.textScale === 'lg' ? '11px' : '9px' // base
                                                }}
                                            >
                                                {vignette.description || "Texto descritivo da vinheta..."}
                                            </p>
                                        )}
                                        {isOpening && (
                                            <div className="pt-3">
                                                <span className="px-5 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded shadow-lg block hover:scale-105 transition-transform"
                                                    style={{
                                                        backgroundColor: splashButtonBg,
                                                        color: splashButtonText,
                                                        fontFamily: fontFamily
                                                    }}>
                                                    {vignette.buttonText || gameData.gameSplashButtonText || "INICIAR"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Próxima Cena</h4>
                                {isOpening ? (
                                    <div className="p-3 bg-zinc-900 border border-muted-foreground/20 rounded-lg">
                                        <p className="text-xs text-zinc-400">Esta é a vinheta de abertura. Ao terminar, o jogo iniciará automaticamente na <strong>Cena Inicial</strong>.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex bg-zinc-950 rounded-lg p-1 border border-muted-foreground/20">
                                            <button
                                                onClick={() => onUpdate(vignette.id, 'isConclusion', false)}
                                                className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-wider rounded-md transition-all ${!vignette.isConclusion ? 'bg-primary/20 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                            >
                                                Mudar de Cena
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onUpdate(vignette.id, 'isConclusion', true);
                                                    onUpdate(vignette.id, 'nextSceneId', ''); // Clear next scene
                                                }}
                                                className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-wider rounded-md transition-all ${vignette.isConclusion ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                            >
                                                Vinheta de Conclusão
                                            </button>
                                        </div>

                                        {vignette.isConclusion ? (
                                            <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg text-center space-y-3">
                                                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">O jogo termina aqui</p>

                                                {/* System Defeat Toggle */}
                                                {(gameData.gameSystemEnabled === 'chances') && (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <label className="flex items-center gap-2 cursor-pointer group select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={vignette.isSystemDefeat || false}
                                                                onChange={(e) => {
                                                                    // Only allow enabling via checkbox. Disabling is done by unchecking or enabling another.
                                                                    // Actually standard checkbox behavior is fine, but we enforce "only one" in parent.
                                                                    onUpdate(vignette.id, 'isSystemDefeat', e.target.checked);
                                                                }}
                                                                className="custom-checkbox accent-purple-500"
                                                            />
                                                            <span className="text-[9px] text-zinc-400 group-hover:text-zinc-300 transition-colors font-medium text-left">
                                                                Será mostrada ao perder todas as chances
                                                            </span>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Ir para cena (após a vinheta)</label>
                                                <select
                                                    value={vignette.nextSceneId || ''}
                                                    onChange={(e) => onUpdate(vignette.id, 'nextSceneId', e.target.value)}
                                                    className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-1 focus:ring-primary/30 transition-all"
                                                >
                                                    <option value="">(Nenhuma - Apenas fecha a vinheta)</option>
                                                    {allScenes.map(scene => (
                                                        <option key={scene.id} value={scene.id}>
                                                            {scene.name} ({scene.id})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-muted-foreground/10">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trilha Sonora</h4>
                                <div className="flex items-center gap-3">
                                    <label className="flex-grow flex items-center justify-center px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-lg hover:bg-zinc-800 hover:text-white transition-all cursor-pointer text-[10px] uppercase tracking-widest shadow-sm group">
                                        <Upload className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" /> {vignette.backgroundMusic ? 'Alterar Música' : 'Carregar Música (.mp3)'}
                                        <input type="file" accept="audio/mpeg,audio/wav,audio/ogg" onChange={handleAudioUpload} className="hidden" />
                                    </label>
                                    {vignette.backgroundMusic && (
                                        <button
                                            onClick={() => onUpdate(vignette.id, 'backgroundMusic', '')}
                                            className="p-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            title="Remover Música"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const VignettesEditor: React.FC<VignettesEditorProps> = ({ gameData, onUpdate, onSetDirty, allScenes }) => {
    // 1. Initialize logic to sync old root properties to the first vignette if no vignettes exist
    const [vignettes, setVignettes] = useState<Vignette[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        // Required for Firefox
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();

        // Don't do anything if we dropped on the same item or if drag source is invalid
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        // Logic: Opening (index 0) is pinned. Cannot drag it, cannot drop above it/on it.
        // Actually, we disable drag for index 0 in the render loop.
        // But we must also ensure we don't displace index 0.
        // If targetIndex is 0, we should probably correcting to 1?
        // Let's just block dropping on index 0 effectively by checking.

        if (targetIndex === 0) return; // Cannot drop into slot 0

        const newVignettes = [...vignettes];
        const [movedItem] = newVignettes.splice(draggedIndex, 1);
        newVignettes.splice(targetIndex, 0, movedItem);

        setVignettes(newVignettes);
        setDraggedIndex(null);
    };

    useEffect(() => {
        if (!gameData.vignettes || gameData.vignettes.length === 0) {
            // Create initial "Opening" vignette from legacy data
            const openingVignette: Vignette = {
                id: 'VNT_OPENING',
                name: 'Abertura',
                title: gameData.gameTitle || '',
                description: gameData.gameSplashDescription || '',
                image: gameData.gameSplashImage || '',
                backgroundMusic: gameData.gameBackgroundMusic || '',
                contentAlignment: gameData.gameSplashContentAlignment || 'left',
                verticalAlignment: gameData.gameSplashContentVerticalAlignment || 'bottom',
                omitTitle: gameData.gameOmitSplashTitle || false
            };
            const initialVignettes = [openingVignette];

            // Migrate Endings
            if (gameData.positiveEndingDescription || gameData.positiveEndingImage) {
                initialVignettes.push({
                    id: 'VNT_VICTORY',
                    name: 'Vitória',
                    title: 'Vitória',
                    description: gameData.positiveEndingDescription || '',
                    image: gameData.positiveEndingImage || '',
                    backgroundMusic: gameData.positiveEndingMusic,
                    contentAlignment: gameData.positiveEndingContentAlignment || 'left',
                    verticalAlignment: 'bottom',
                    isConclusion: true
                });
            }

            if (gameData.negativeEndingDescription || gameData.negativeEndingImage) {
                initialVignettes.push({
                    id: 'VNT_DEFEAT',
                    name: 'Derrota',
                    title: 'Derrota',
                    description: gameData.negativeEndingDescription || '',
                    image: gameData.negativeEndingImage || '',
                    backgroundMusic: gameData.negativeEndingMusic,
                    contentAlignment: gameData.negativeEndingContentAlignment || 'left',
                    verticalAlignment: 'bottom',
                    isConclusion: true
                });
            }

            setVignettes(initialVignettes);
        } else {
            setVignettes(gameData.vignettes);
        }
    }, [gameData.vignettes, gameData.gameTitle]); // trigger if legacy props load first?

    // 2. Dirty Checking
    useEffect(() => {
        const isModified = JSON.stringify(vignettes) !== JSON.stringify(gameData.vignettes || []);
        onSetDirty(isModified);
        // Also check if legacy opening vignette matches legacy root props - complicated, assume migrate on save is okay.
        // If we save, we should ideally write back the first vignette properties to the root props too for backward compat?
        // Or we decide to stop using root props. The engine likely uses root props.
        // For now, let's keep syncing back to root props on save.
    }, [vignettes, gameData.vignettes, onSetDirty]);


    const handleUpdateVignette = (id: string, field: keyof Vignette, value: any) => {
        if (field === 'isSystemDefeat' && value === true) {
            // Enforce only one System Defeat vignette
            setVignettes(prev => prev.map(v => ({
                ...v,
                isSystemDefeat: v.id === id ? true : false
            })));
        } else {
            setVignettes(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
        }
    };

    const handleDeleteVignette = (id: string) => {
        const vignetteToDelete = vignettes.find(v => v.id === id);
        if (vignetteToDelete?.isConclusion) {
            const conclusionCount = vignettes.filter(v => v.isConclusion).length;
            if (conclusionCount <= 1) {
                alert("É obrigatório ter sempre pelo menos uma vinheta de conclusão.");
                return;
            }
        }
        setVignettes(prev => prev.filter(v => v.id !== id));
    };

    const handleCreateVignette = () => {
        const newId = `VNT_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const newVignette: Vignette = {
            id: newId,
            name: 'Nova Vinheta',
            title: '',
            description: '',
            contentAlignment: 'left',
            verticalAlignment: 'bottom'
        };
        setVignettes(prev => [...prev, newVignette]);
    };

    const handleSave = () => {
        const opening = vignettes.find(v => v.id === 'VNT_OPENING') || vignettes[0];

        // Prepare update object
        const updates: Partial<GameData> = {
            vignettes: vignettes
        };

        // If we have an opening/first vignette, sync to root properties for backward compatibility / engine compatibility
        if (opening) {
            updates.gameTitle = opening.title;
            updates.gameSplashDescription = opening.description;
            updates.gameSplashImage = opening.image;
            updates.gameBackgroundMusic = opening.backgroundMusic;
            updates.gameSplashContentAlignment = opening.contentAlignment;
            updates.gameSplashContentVerticalAlignment = opening.verticalAlignment;
            updates.gameOmitSplashTitle = opening.omitTitle;
            updates.gameSplashButtonText = opening.buttonText ?? gameData.gameSplashButtonText; // Sync button text
        }

        onUpdate(updates);
        onSetDirty(false);
    };

    const handleUndo = () => {
        if (gameData.vignettes && gameData.vignettes.length > 0) {
            setVignettes(gameData.vignettes);
        } else {
            const openingVignette: Vignette = {
                id: 'VNT_OPENING',
                name: 'Abertura',
                title: gameData.gameTitle || '',
                description: gameData.gameSplashDescription || '',
                image: gameData.gameSplashImage || '',
                backgroundMusic: gameData.gameBackgroundMusic || '',
                contentAlignment: gameData.gameSplashContentAlignment || 'left',
                verticalAlignment: gameData.gameSplashContentVerticalAlignment || 'bottom',
                omitTitle: gameData.gameOmitSplashTitle || false
            };
            setVignettes([openingVignette]);
        }
    };

    // Sort logic? Unnecessary if just a list, but user might want order.
    // Assuming array order is render order if we ever render them all.
    // Opening should always be first.

    return (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-zinc-500 mt-1 text-xs font-medium">
                        Gerencie a abertura e vinhetas cinematográficas do seu jogo.
                    </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 mt-1">
                    {/* Reuse local isDirty since it is synced */}
                    {(JSON.stringify(vignettes) !== JSON.stringify(gameData.vignettes || [])) && (
                        <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest animate-pulse bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                            <span>Alterações não salvas</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {vignettes.map((v, index) => {
                    const isOpening = index === 0;
                    const conclusionCount = vignettes.filter(vg => vg.isConclusion).length;
                    const isLastConclusion = v.isConclusion && conclusionCount <= 1;
                    const canDelete = !isOpening && !isLastConclusion;

                    return (
                        <VignetteItem
                            key={v.id}
                            vignette={v}
                            gameData={gameData}
                            onUpdate={handleUpdateVignette}
                            onDelete={handleDeleteVignette}
                            isOpening={isOpening}
                            canDelete={canDelete}
                            allScenes={allScenes}
                            enableDrag={!isOpening} // Disable drag for the first item (Opening)
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                        />
                    );
                })}

                <div className="flex justify-start pt-4">
                    <button
                        onClick={handleCreateVignette}
                        className="flex items-center px-4 py-2 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-xl active:scale-95 text-xs"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Vinheta
                    </button>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="fixed bottom-6 right-10 z-10 flex gap-2">
                <button
                    onClick={handleUndo}
                    // disabled={!isDirty} // Logic for dirty is complex here due to sync, keep enabled or improve check
                    className={`px-4 py-2 font-bold rounded-lg transition-all text-xs border flex items-center gap-2 ${(JSON.stringify(vignettes) !== JSON.stringify(gameData.vignettes || []))
                        ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500 shadow-lg shadow-purple-900/20'
                        : 'bg-zinc-900 border-muted-foreground/50 text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                >
                    <RotateCcw className="w-3 h-3" /> Desfazer
                </button>
                <button
                    onClick={handleSave}
                    disabled={JSON.stringify(vignettes) === JSON.stringify(gameData.vignettes || [])}
                    className="px-4 py-2 bg-yellow-500 text-zinc-950 font-bold rounded-lg hover:bg-yellow-600 transition-all text-xs disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Save className="w-3 h-3" /> Salvar Alterações
                </button>
            </div>
        </div>
    );
}

export default VignettesEditor;
