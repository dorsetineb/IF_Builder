import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { User, Lock, Link as LinkIcon, AlertCircle, LogOut, Sun, Moon, Coffee, Sparkles, Terminal, Mail } from 'lucide-react';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useTheme } from '../components/ThemeProvider';
import { useToast } from '../components/ToastContext';
import { useNavigate } from 'react-router-dom';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Settings: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    // Form States
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');



    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        setPageLoading(true);

        const fetchProfilePromise = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setEmail(user.email || '');
                    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

                    if (error && error.code !== 'PGRST116') {
                        console.error('Error fetching profile:', error);
                    }

                    if (data) {
                        setDisplayName(data.full_name || '');
                        setUsername(data.username || '');
                        setWebsite(data.website || '');
                        setBio(data.bio || '');
                        setAvatarUrl(data.avatar_url || '');

                    } else {
                        // Pre-fill from auth metadata if profile doesn't exist
                        const meta = user.user_metadata || {};
                        console.log('No profile found, using metadata:', meta);
                        setDisplayName(meta.full_name || meta.name || '');
                        setUsername(meta.username || '');
                        setAvatarUrl(meta.avatar_url || meta.picture || '');
                    }
                }
            } catch (error) {
                console.error('Critical error in Settings:', error);
                toast("Erro", "Falha ao carregar perfil. Verifique sua conexão.", "error");
            }
        };

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Profile load timeout')), 5000);
        });

        try {
            await Promise.race([fetchProfilePromise(), timeoutPromise]);
        } catch (err) {
            console.error('Profile loading timed out:', err);
            toast("Alerta", "O carregamento demorou mais que o esperado.", "warning");
        } finally {
            setPageLoading(false);
        }
    };

    const [draftTheme, setDraftTheme] = useState(theme);

    // Sync draft theme if external theme changes (rare, but good practice)
    useEffect(() => {
        setDraftTheme(theme);
    }, [theme]);

    const handleSave = async () => {
        setLoading(true);

        // 1. Apply Theme
        if (draftTheme !== theme) {
            setTheme(draftTheme);
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const updates = {
            id: user.id,
            full_name: displayName,
            username,
            website,
            bio,
            avatar_url: avatarUrl,

            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            toast("Erro ao salvar perfil", error.message, "error");
        } else {
            toast("Sucesso!", "Configurações atualizadas.", "success");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            window.location.href = '/';
        } catch (error: any) {
            console.error('Error logging out:', error);
            window.location.href = '/';
        }
    };



    return (
        <div className="min-h-full font-sans text-xs bg-background flex flex-col relative">

            {/* Standard Header */}
            {!hideHeader && (
                <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                    <div className="flex flex-col justify-center h-full">
                        <h1 className="text-xl font-bold text-foreground">Configurações</h1>
                        <p className="text-[10px] text-muted-foreground hidden md:block">Gerencie suas preferências e perfil.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white border border-red-500/20 text-xs font-bold transition-all shadow-sm"
                    >
                        <LogOut size={14} /> Sair da Conta
                    </button>
                </div>
            )}

            <div className="p-8 max-w-4xl mx-0">

                {/* Theme Section */}
                <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-primary">
                        <Sun size={16} />
                        <h2 className="text-sm font-bold text-card-foreground">Aparência</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button
                            onClick={() => setDraftTheme('dark')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${draftTheme === 'dark' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Moon size={16} className={draftTheme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${draftTheme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}>Escuro</span>
                        </button>

                        <button
                            onClick={() => setDraftTheme('light')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${draftTheme === 'light' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Sun size={16} className={draftTheme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${draftTheme === 'light' ? 'text-foreground' : 'text-muted-foreground'}`}>Claro</span>
                        </button>

                        <button
                            onClick={() => setDraftTheme('cream')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${draftTheme === 'cream' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Coffee size={16} className={draftTheme === 'cream' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${draftTheme === 'cream' ? 'text-foreground' : 'text-muted-foreground'}`}>Creme</span>
                        </button>

                        <button
                            onClick={() => setDraftTheme('terminal')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${draftTheme === 'terminal' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Terminal size={16} className={draftTheme === 'terminal' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${draftTheme === 'terminal' ? 'text-foreground' : 'text-muted-foreground'}`}>Terminal</span>
                        </button>
                    </div>
                </div>

                {/* Public Info Section */}
                <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <User size={16} />
                        <h2 className="text-sm font-bold text-card-foreground">Informações Públicas</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar Actions */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-24 h-24 rounded-lg bg-muted border-2 border-card shadow-lg overflow-hidden flex items-center justify-center">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} className="text-muted-foreground" />
                                )}
                            </div>
                            <button
                                className="text-primary hover:text-primary/80 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                                onClick={() => {
                                    const url = prompt("Insira a URL da imagem:");
                                    if (url) setAvatarUrl(url);
                                }}
                            >
                                Alterar Foto
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nome de Exibição</label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-input border border-input rounded px-3 py-1.5 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                                        placeholder="Como você quer ser chamado"
                                    />
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Website (Opcional)</label>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1.5 text-muted-foreground"><LinkIcon size={12} /></span>
                                        <input
                                            type="text"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            className="w-full bg-input border border-input rounded pl-7 pr-3 py-1.5 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                                            placeholder="https://"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sobre mim</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-input border border-input rounded px-3 py-2 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-20"
                                    placeholder="Conte um pouco sobre você..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section (Visual Only for now) */}
                <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Lock size={16} />
                        <h2 className="text-sm font-bold text-card-foreground">Segurança</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <div className="space-y-1 text-left">
                            <label className="text-xs font-medium text-muted-foreground">Endereço de E-mail</label>
                            <div className="flex gap-2 relative mt-1">
                                <Mail className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="flex-1 bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-muted-foreground cursor-not-allowed w-full"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-2 h-full">
                            <AlertCircle className="text-accent flex-shrink-0 mt-0.5" size={16} />
                            <div>
                                <h4 className="font-medium text-foreground text-xs">Alteração de Senha</h4>
                                <p className="text-muted-foreground text-[10px] mt-0.5">Para alterar sua senha, receba um link via email.</p>
                                <button className="mt-1 text-xs font-medium text-primary hover:underline">Enviar Redefinição</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
