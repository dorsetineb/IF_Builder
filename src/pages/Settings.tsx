import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { User, Lock, Link as LinkIcon, AlertCircle, LogOut, Sun, Moon, Coffee, Sparkles, Terminal, Mail, Check, Languages } from 'lucide-react';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useTheme } from '../components/ThemeProvider';
import { useToast } from '../components/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useTranslation } from 'react-i18next';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Settings: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const { t, i18n } = useTranslation();

    // Form States
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    // Initial State for Dirty Checking
    const [initialProfile, setInitialProfile] = useState<Partial<Profile> | null>(null);

    // Theme Logic
    const [originalTheme, setOriginalTheme] = useState(theme); // Capture theme on mount
    const savedRef = useRef(false);

    const [pageLoading, setPageLoading] = useState(true);

    const { user, profile, refreshProfile } = useUser();

    // Revert theme on unmount if not saved
    useEffect(() => {
        return () => {
            if (!savedRef.current) {
                setTheme(originalTheme);
            }
        };
    }, []);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.full_name || '');
            setUsername(profile.username || '');
            setWebsite(profile.website || '');
            setBio(profile.bio || '');

            setInitialProfile({
                full_name: profile.full_name,
                username: profile.username,
                website: profile.website,
                bio: profile.bio,
                location: profile.location
            });
            setLocation(profile.location || '');
            if (user) setEmail(user.email || '');
            setPageLoading(false);
        } else if (user) {
            // Fallback if profile row is missing but user exists
            const meta = user.user_metadata || {};
            setDisplayName(meta.full_name || meta.name || '');
            setUsername(meta.username || '');
            setLocation(meta.location || '');
            setEmail(user.email || '');
            setInitialProfile({});
            setPageLoading(false);
        }
    }, [profile, user]);

    const handleThemeChange = (newTheme: typeof theme) => {
        setTheme(newTheme);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    // Calculate isDirty
    const isDirty = (
        theme !== originalTheme ||
        displayName !== (initialProfile?.full_name || '') ||
        username !== (initialProfile?.username || '') ||
        website !== (initialProfile?.website || '') ||
        bio !== (initialProfile?.bio || '') ||
        location !== (initialProfile?.location || '')
    );

    const handleSave = async () => {
        setLoading(true);
        try {
            savedRef.current = true; // Mark as saved so we don't revert theme

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return;
            }

            const updates = {
                id: user.id,
                full_name: displayName,
                bio,
                website,
                location,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                toast(t('settings.saveError'), error.message, "error");
                savedRef.current = false; // Reset if failed
            } else {
                toast(t('common.success'), t('settings.saveSuccess'), "success");
                setInitialProfile({
                    full_name: displayName,
                    username,
                    website,
                    bio,
                    location
                });
                await refreshProfile(); // Update global context
                setOriginalTheme(theme); // Update original theme to current to plain dirty state
            }
        } catch (err) {
            console.error("Unexpected error saving profile:", err);
            toast(t('common.error'), t('common.unexpectedError'), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            // 1. Sign out from Supabase
            // This will trigger onAuthStateChange in App.tsx -> setSession(null) -> Shows Auth
            const { error } = await supabase.auth.signOut({ scope: 'global' });
            if (error) throw error;

        } catch (error) {
            console.error('Error during sign out attempt:', error);
        } finally {
            // 2. Clear local storage to be absolutely sure
            localStorage.clear();
            sessionStorage.clear();

            // 3. Clear cookies
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            // Do NOT force reload. Let React state handle the view switch.
        }
    };

    return (
        <div className="min-h-full font-sans text-xs bg-background flex flex-col relative">

            {/* Standard Header */}
            {!hideHeader && (
                <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                    <div className="flex flex-col justify-center h-full">
                        <h1 className="text-xl font-bold text-foreground">{t('settings.title')}</h1>
                        <p className="text-[10px] text-muted-foreground hidden md:block">{t('settings.subtitle')}</p>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => handleLogout(e)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white border border-red-500/20 text-xs font-bold transition-all shadow-sm"
                    >
                        <LogOut size={14} /> {t('settings.logout')}
                    </button>
                </div>
            )}

            <div className="px-8 pt-4 pb-8 max-w-4xl mx-0">
                <div className="flex justify-end mb-6 -mt-2">
                    <button
                        onClick={handleSave}
                        disabled={loading || !isDirty}
                        className="bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-xs shadow-md"
                    >
                        {loading ? t('common.saving') : t('common.save')}
                    </button>
                </div>

                {/* Theme Section */}
                <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-primary">
                        <Sun size={16} />
                        <h2 className="text-sm font-bold text-card-foreground">{t('settings.sectionAppearance')}</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Moon size={16} className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themeDark')}</span>
                        </button>

                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Sun size={16} className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'light' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themeLight')}</span>
                        </button>

                        <button
                            onClick={() => handleThemeChange('cream')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'cream' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Coffee size={16} className={theme === 'cream' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'cream' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themeCream')}</span>
                        </button>

                        <button
                            onClick={() => handleThemeChange('terminal')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'terminal' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Terminal size={16} className={theme === 'terminal' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'terminal' ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.themeTerminal')}</span>
                        </button>
                    </div>
                </div>

                {/* Account Data Section - Matches Signup */}
                <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <User size={16} />
                        <h2 className="text-sm font-bold text-card-foreground">{t('settings.sectionAccount')}</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2 text-left">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t('settings.labelName')}</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-input border border-input rounded px-3 py-2 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium placeholder:text-muted-foreground/50"
                                placeholder={t('settings.placeholderName')}
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t('settings.labelEmail')}</label>
                            <div className="flex gap-2 items-center">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full bg-muted/50 border border-border rounded pl-9 pr-4 py-2 text-xs text-muted-foreground cursor-not-allowed font-medium"
                                    />
                                </div>
                                <button
                                    className="px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded text-xs font-bold transition-all whitespace-nowrap"
                                    onClick={async () => {
                                        if (!email) return;
                                        setLoading(true);
                                        const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                            redirectTo: window.location.origin + '/settings',
                                        });
                                        if (error) toast(t('common.error'), error.message, "error");
                                        else toast(t('common.success'), t('settings.resetSent'), "success");
                                        setLoading(false);
                                    }}
                                    disabled={loading}
                                >
                                    {t('settings.resetPassword')}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t('settings.labelLocation')}</label>
                            <div className="relative">
                                <span className="absolute left-2.5 top-1.5 text-muted-foreground text-[10px] font-bold"><User size={12} className="opacity-0" /></span> {/* Spacer if needed or icon */}
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-input border border-input rounded px-3 py-2 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium placeholder:text-muted-foreground/50"
                                    placeholder={t('settings.placeholderLocation')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Language Section */}
                <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-primary">
                        <Languages size={16} />
                        <h2 className="text-sm font-bold text-card-foreground">{t('settings.sectionLanguage')}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-w-md">
                        <button
                            onClick={() => changeLanguage('pt')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${i18n.language.startsWith('pt') ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <span className={`font-medium text-xs ${i18n.language.startsWith('pt') ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.languagePt')}</span>
                            {i18n.language.startsWith('pt') && <Check size={14} className="text-primary" />}
                        </button>

                        <button
                            onClick={() => changeLanguage('en')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${i18n.language.startsWith('en') ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <span className={`font-medium text-xs ${i18n.language.startsWith('en') ? 'text-foreground' : 'text-muted-foreground'}`}>{t('settings.languageEn')}</span>
                            {i18n.language.startsWith('en') && <Check size={14} className="text-primary" />}
                        </button>
                    </div>
                </div>




            </div>
        </div>
    );
};

export default Settings;
