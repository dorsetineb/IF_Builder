import React, { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Coffee, Terminal, Globe, Monitor } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useToast } from '../components/ToastContext';
import { useTranslation } from 'react-i18next';

const Settings: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState(i18n.language || 'pt');

    // Theme Logic
    const [originalTheme, setOriginalTheme] = useState(theme); // Capture theme on mount
    const savedRef = useRef(false);

    // Revert theme on unmount if not saved
    useEffect(() => {
        return () => {
            if (!savedRef.current) {
                setTheme(originalTheme);
            }
        };
    }, []);

    const handleThemeChange = (newTheme: typeof theme) => {
        setTheme(newTheme);
    };

    const isDirty = (
        theme !== originalTheme ||
        language !== (i18n.language || 'pt')
    );

    const handleSave = async () => {
        setLoading(true);
        try {
            savedRef.current = true; // Mark as saved so we don't revert theme

            if (language !== (i18n.language || 'pt')) {
                i18n.changeLanguage(language);
            }

            toast(t('settings.success.title', 'Sucesso!'), t('settings.success.updated', 'Configurações atualizadas.'), "success");
            setOriginalTheme(theme);
        } catch (err) {
            console.error("Unexpected error saving settings:", err);
            toast(t('settings.errors.title', 'Erro'), t('settings.errors.unexpected', 'Ocorreu um erro inesperado.'), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full font-sans text-xs bg-background flex flex-col relative">

            {/* Standard Header */}
            {!hideHeader && (
                <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                    <div className="flex flex-col justify-center h-full">
                        <h1 className="text-xl font-bold text-foreground">{t('settings.title', 'Configurações')}</h1>
                        <p className="text-[10px] text-muted-foreground hidden md:block">{t('settings.subtitle', 'Gerencie suas preferências.')}</p>
                    </div>
                </div>
            )}

            <div className="px-8 pt-4 pb-8 max-w-4xl mx-0">
                <div className="flex justify-end mb-6 -mt-2">
                    <button
                        onClick={handleSave}
                        disabled={loading || !isDirty}
                        className="bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-xs"
                    >
                        {loading ? t('settings.buttons.saving', 'Salvando...') : t('settings.buttons.save', 'Salvar Alterações')}
                    </button>
                </div>

                {/* Theme Section */}
                <div className="bg-card border border-border rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Sun size={16} />
                            <h2 className="text-sm font-bold text-card-foreground">{t('settings.appearance', 'Aparência e Idioma')}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <button
                            onClick={() => handleThemeChange('windows')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'windows' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Monitor size={16} className={theme === 'windows' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'windows' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.windows', 'W95')}</span>
                        </button>

                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Moon size={16} className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.dark', 'Noite')}</span>
                        </button>

                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Sun size={16} className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'light' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.light', 'Dia')}</span>
                        </button>

                        <button
                            onClick={() => handleThemeChange('cream')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'cream' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Coffee size={16} className={theme === 'cream' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'cream' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.cream', 'Creme')}</span>
                        </button>

                        <button
                            onClick={() => handleThemeChange('terminal')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'terminal' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Terminal size={16} className={theme === 'terminal' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'terminal' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themes.terminal', 'Terminal')}</span>
                        </button>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border mt-4">
                        <div className="space-y-2 text-left">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                                <Globe size={12} />
                                {t('settings.language.label', 'Idioma da Interface')}
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-input border border-input rounded px-3 py-2 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                            >
                                <option value="pt">{t('common.languages.pt', 'Português')}</option>
                                <option value="en">{t('common.languages.en', 'English')}</option>
                                <option value="es">{t('common.languages.es', 'Español')}</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
