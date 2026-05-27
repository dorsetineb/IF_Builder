import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Moon, Monitor, Leaf, Coffee, Skull, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider';

export const EditorInterface: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();
    const [localLanguage, setLocalLanguage] = useState(i18n.language || 'pt');

    // Change language immediately when select changes
    useEffect(() => {
        if (localLanguage !== i18n.language) {
            i18n.changeLanguage(localLanguage);
        }
    }, [localLanguage, i18n]);

    const handleAppThemeChange = (newTheme: string) => {
        setTheme(newTheme);
    };

    return (
        <div className="min-h-full font-sans text-xs bg-background flex flex-col">
            {/* Header matches Platform Header style */}
            {!hideHeader && (
                <div className="h-[61px] border-b border-muted-foreground/50 flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-20 shrink-0">
                    <div className="flex flex-col justify-center h-full">
                        <h1 className="text-xl font-bold text-foreground">
                            {t('editorInterface.title', 'Interface do Editor')}
                        </h1>
                        <p className="text-[10px] text-muted-foreground hidden md:block">
                            {t('editorInterface.subtitle', 'Configure a linguagem do sistema e personalize a aparência do editor escolhendo seu tema visual preferido.')}
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-8 pt-6 pb-24 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Idioma Section */}
                    <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm transition-all duration-300 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            {t('settings.language.label', 'Idioma')}
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <select
                                    value={localLanguage}
                                    onChange={(e) => setLocalLanguage(e.target.value)}
                                    className="w-full bg-input border border-input rounded-lg px-3 py-2.5 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                                >
                                    <option value="pt">{t('common.languages.pt', 'Português')}</option>
                                    <option value="en">{t('common.languages.en', 'English')}</option>
                                    <option value="es">{t('common.languages.es', 'Español')}</option>
                                </select>
                            </div>
                            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                                {t('settings.language.description', 'Altere o idioma para que a interface do editor seja traduzida conforme sua preferência.')}
                            </p>
                        </div>
                    </div>

                    {/* Aparência Section */}
                    <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm transition-all duration-300 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            {t('settings.appearance', 'Aparência')}
                        </h3>

                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => handleAppThemeChange('dark')}
                                    className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 bg-card hover:bg-muted'} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '0ms' }}
                                >
                                    <Moon size={16} className="text-muted-foreground" />
                                    <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.dark', 'Noite')}</span>
                                </button>
                                <button
                                    onClick={() => handleAppThemeChange('windows')}
                                    className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'windows' ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 bg-card hover:bg-muted'} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '100ms' }}
                                >
                                    <Monitor size={16} className="text-muted-foreground" />
                                    <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'windows' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.windows', 'W95')}</span>
                                </button>
                                <button
                                    onClick={() => handleAppThemeChange('terminal')}
                                    className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'terminal' ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 bg-card hover:bg-muted'} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '200ms' }}
                                >
                                    <Leaf size={16} className="text-muted-foreground" />
                                    <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'terminal' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.terminal', 'Terminal')}</span>
                                </button>
                                <button
                                    onClick={() => handleAppThemeChange('ether')}
                                    className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'ether' ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 bg-card hover:bg-muted'} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '300ms' }}
                                >
                                    <Sparkles size={16} className="text-muted-foreground" />
                                    <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'ether' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.ether', 'Ether')}</span>
                                </button>
                                <button
                                    onClick={() => handleAppThemeChange('ristretto')}
                                    className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'ristretto' ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 bg-card hover:bg-muted'} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '350ms' }}
                                >
                                    <Coffee size={16} className="text-muted-foreground" />
                                    <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'ristretto' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.ristretto', 'Ristretto')}</span>
                                </button>
                                <button
                                    onClick={() => handleAppThemeChange('abismo')}
                                    className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'abismo' ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 bg-card hover:bg-muted'} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`} style={{ animationDelay: '400ms' }}
                                >
                                    <Skull size={16} className="text-muted-foreground" />
                                    <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'abismo' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.abismo', 'Abismo')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorInterface;
