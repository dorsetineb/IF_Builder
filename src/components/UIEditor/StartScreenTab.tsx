import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Trash2, Settings, Type } from 'lucide-react';

interface StartScreenTabProps {
    localStartScreenBgImage: string;
    setLocalStartScreenBgImage: (val: string) => void;
    localShowStartScreenTitle: boolean;
    setLocalShowStartScreenTitle: (val: boolean) => void;
    localStartScreenTitle: string;
    setLocalStartScreenTitle: (val: string) => void;
    localTitle: string;
    localTitleColor: string;
    localSystemButtonColor: string;
    localSystemButtonTextColor: string;
    localSystemButtonBorderColor: string;
    localSystemButtonHoverColor: string;
    localSystemButtonHoverTextColor: string;
    localTextColor: string;
    localGameBackgroundColor: string;
    localFontFamily: string;
}

export const StartScreenTab: React.FC<StartScreenTabProps> = memo(({
    localStartScreenBgImage,
    setLocalStartScreenBgImage,
    localShowStartScreenTitle,
    setLocalShowStartScreenTitle,
    localStartScreenTitle,
    setLocalStartScreenTitle,
    localTitle,
    localTitleColor,
    localSystemButtonColor,
    localSystemButtonTextColor,
    localSystemButtonBorderColor,
    localSystemButtonHoverColor,
    localSystemButtonHoverTextColor,
    localTextColor,
    localGameBackgroundColor,
    localFontFamily
}) => {
    const { t } = useTranslation();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setLocalStartScreenBgImage(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        if (e.target) e.target.value = '';
    };

    const handleRemoveImage = () => {
        setLocalStartScreenBgImage('');
    };

    const displayTitle = localStartScreenTitle.trim() || localTitle || 'Título do Jogo';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* --- CONFIGURATION PANEL (LEFT) --- */}
                <div className="flex-1 w-full space-y-6">
                    <div className="p-6 bg-card border-2 border-muted-foreground/30 rounded-2xl transition-all flex flex-col gap-6 shadow-sm">
                        
                        {/* Section Title */}
                        <div className="flex items-center gap-3 border-b border-muted-foreground/10 pb-4">
                            <Settings className="w-5 h-5 text-primary" />
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                                    {t('UIEditor.startScreen.configTitle', 'Configuração do Menu Principal')}
                                </h4>
                                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                                    {t('UIEditor.startScreen.configDesc', 'Ajuste a imagem de fundo e exibição do título do Menu Principal.')}
                                </p>
                            </div>
                        </div>

                        {/* Background Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {t('UIEditor.startScreen.bgImage', 'Imagem de Fundo')}
                            </label>
                            
                            <div className="flex gap-4 items-start">
                                <div className="relative w-28 h-28 bg-zinc-950/40 rounded-xl border border-muted-foreground/30 flex items-center justify-center overflow-hidden shrink-0 group hover:border-primary/50 transition-colors">
                                    {localStartScreenBgImage ? (
                                        <>
                                            <img src={localStartScreenBgImage} alt="Background Preview" className="w-full h-full object-cover" />
                                            <button 
                                                onClick={handleRemoveImage}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                title="Remover imagem"
                                            >
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                                            <ImageIcon className="w-8 h-8 mb-1" />
                                            <span className="text-[8px] font-bold uppercase tracking-widest">Upload</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                                <div className="flex-1 space-y-2 pt-1">
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        {t('UIEditor.startScreen.bgImageDesc', 'Faça upload de uma imagem personalizada para servir de fundo para a tela do Menu Principal do jogo.')}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider font-bold">
                                        {t('UIEditor.startScreen.recommendedDimensions', 'Recomendado: 1920x1080')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Title Settings */}
                        <div className="space-y-4 pt-2 border-t border-muted-foreground/10">
                            
                            {/* Toggle Title */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {t('UIEditor.startScreen.showTitle', 'Exibir Título')}
                                    </label>
                                    <p className="text-[10px] text-muted-foreground">
                                        {t('UIEditor.startScreen.showTitleDesc', 'Desative caso sua imagem de fundo já possua o título gravado.')}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input 
                                        type="checkbox" 
                                        checked={localShowStartScreenTitle} 
                                        onChange={(e) => setLocalShowStartScreenTitle(e.target.checked)} 
                                        className="sr-only peer" 
                                    />
                                    <div className="w-10 h-6 bg-muted border-2 border-muted-foreground/50 rounded-md peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                                        <div 
                                            className={`absolute top-1 left-1 w-3 h-3 rounded-[2px] shadow-sm transition-all ${localShowStartScreenTitle ? 'bg-primary-foreground' : 'bg-muted-foreground/50'}`}
                                            style={{ transform: localShowStartScreenTitle ? 'translateX(16px)' : 'translateX(0)' }}
                                        ></div>
                                    </div>
                                </label>
                            </div>

                            {/* Title Text Input */}
                            {localShowStartScreenTitle && (
                                <div className="space-y-2 animate-in fade-in duration-300">
                                    <label htmlFor="startScreenTitle" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {t('UIEditor.startScreen.titleText', 'Título Personalizado')}
                                    </label>
                                    <div className="flex items-center gap-2 bg-background border border-muted-foreground/50 rounded-lg focus-within:border-primary/50 transition-all px-3 py-1">
                                        <Type className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                                        <input
                                            type="text"
                                            id="startScreenTitle"
                                            value={localStartScreenTitle}
                                            onChange={(e) => setLocalStartScreenTitle(e.target.value)}
                                            className="w-full bg-transparent text-xs p-1 focus:outline-none focus:ring-0 text-foreground"
                                            placeholder={localTitle || 'Digite o título...'}
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                </div>

                {/* --- PREVIEW PANEL (RIGHT) --- */}
                <div className="flex-1 w-full space-y-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                        {t('UIEditor.startScreen.previewTitle', 'Visualização do Menu Principal')}
                    </h5>

                    {/* Frame container */}
                    <div 
                        className="w-full aspect-video rounded-2xl border-2 border-muted-foreground/30 relative flex flex-col items-center justify-center p-6 select-none overflow-hidden"
                        style={{ backgroundColor: localGameBackgroundColor }}
                    >
                        {/* Background image in mockup */}
                        {localStartScreenBgImage && (
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-all"
                                style={{ backgroundImage: `url(${localStartScreenBgImage})` }}
                            />
                        )}

                        {/* Vignette Overlay (Darkening background to allow reading text) */}
                        <div className="absolute inset-0 bg-black/40 z-0" />

                        {/* Title of mock screen */}
                        <div className="z-10 text-center max-w-[80%] mb-6">
                            {localShowStartScreenTitle && (
                                <h1 
                                    className="text-xl font-bold tracking-wider uppercase drop-shadow-md text-center transition-all"
                                    style={{ color: localTitleColor, fontFamily: localFontFamily }}
                                >
                                    {displayTitle}
                                </h1>
                            )}
                        </div>

                        {/* Mock Buttons Container */}
                        <div className="z-10 flex flex-col gap-2.5 w-44">
                            <button 
                                disabled
                                className="w-full px-4 py-2 border-2 rounded font-bold uppercase tracking-widest transition-all cursor-not-allowed"
                                style={{ 
                                    fontFamily: localFontFamily, 
                                    fontSize: '9px',
                                    borderColor: localSystemButtonBorderColor, 
                                    color: localSystemButtonTextColor, 
                                    backgroundColor: localSystemButtonColor 
                                }}
                            >
                                {t('UIEditor.startScreen.newGame', 'Novo Jogo')}
                            </button>
                            <button 
                                disabled
                                className="w-full px-4 py-2 border-2 rounded font-bold uppercase tracking-widest transition-all cursor-not-allowed"
                                style={{ 
                                    fontFamily: localFontFamily, 
                                    fontSize: '9px',
                                    borderColor: localSystemButtonBorderColor, 
                                    color: localSystemButtonTextColor, 
                                    backgroundColor: localSystemButtonColor 
                                }}
                            >
                                {t('UIEditor.startScreen.continueGame', 'Continuar')}
                            </button>
                            <button 
                                disabled
                                className="w-full px-4 py-2 border-2 rounded font-bold uppercase tracking-widest transition-all cursor-not-allowed"
                                style={{ 
                                    fontFamily: localFontFamily, 
                                    fontSize: '9px',
                                    borderColor: localSystemButtonBorderColor, 
                                    color: localSystemButtonTextColor, 
                                    backgroundColor: localSystemButtonColor 
                                }}
                            >
                                {t('UIEditor.startScreen.savesAndOptions', 'Saves & Opções')}
                            </button>
                        </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground/80 leading-relaxed text-center px-4">
                        💡 {t('UIEditor.startScreen.styleInheritance', 'Os botões e tipografia do Menu Principal herdam perfeitamente as cores e fontes que você configurar na aba Estilo Visual.')}
                    </p>
                </div>

            </div>
        </div>
    );
});

StartScreenTab.displayName = 'StartScreenTab';
