import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { User, Lock, Save, Link as LinkIcon, AlertCircle, LogOut, Sun, Moon, Coffee, Sparkles, X } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useToast } from '../components/ToastContext';
import { useNavigate } from 'react-router-dom';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Settings: React.FC = () => {
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
    const [interests, setInterests] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setEmail(user.email || '');
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) {
                setDisplayName(data.full_name || '');
                setUsername(data.username || '');
                setWebsite(data.website || '');
                setBio(data.bio || '');
                setAvatarUrl(data.avatar_url || '');
                setInterests(data.interests || []);
            } else {
                // Pre-fill from auth metadata if profile doesn't exist
                const meta = user.user_metadata;
                console.log('No profile found, using metadata:', meta);
                setDisplayName(meta.full_name || '');
                setUsername(meta.username || '');
                setAvatarUrl(meta.avatar_url || '');
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const updates = {
            id: user.id,
            full_name: displayName,
            username,
            website,
            bio,
            avatar_url: avatarUrl,
            interests,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            toast("Erro ao salvar perfil", error.message, "error");
        } else {
            toast("Sucesso!", "Perfil atualizado com sucesso.", "success");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
            toast("Erro ao sair", "Não foi possível encerrar a sessão.", "error");
        } else {
            navigate('/');
        }
    };

    const addInterest = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!interests.includes(tagInput.trim())) {
                setInterests([...interests, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeInterest = (tag: string) => {
        setInterests(interests.filter(i => i !== tag));
    };

    return (
        <div className="min-h-full font-sans text-xs bg-background">
            {/* Standard Header */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                <h1 className="text-xl font-bold text-foreground">Configurações</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 border border-destructive/20 text-xs font-medium transition-colors"
                >
                    <LogOut size={14} /> Sair da Conta
                </button>
            </div>

            <div className="p-8 max-w-4xl mx-auto">
                <div className="mb-6">
                    <p className="text-muted-foreground text-xs">Gerencie suas preferências e perfil.</p>
                </div>

                {/* Theme Section */}
                <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-primary">
                        <Sun size={16} />
                        <h2 className="text-sm font-bold text-card-foreground">Aparência</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Moon size={16} className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}>Dark</span>
                        </button>

                        <button
                            onClick={() => setTheme('light')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Sun size={16} className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'light' ? 'text-foreground' : 'text-muted-foreground'}`}>Light</span>
                        </button>

                        <button
                            onClick={() => setTheme('cream')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'cream' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'}`}
                        >
                            <Coffee size={16} className={theme === 'cream' ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-medium text-xs ${theme === 'cream' ? 'text-foreground' : 'text-muted-foreground'}`}>Cream</span>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nome de Usuário</label>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1.5 text-muted-foreground text-xs">@</span>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-input border border-input rounded pl-7 pr-3 py-1.5 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                                        />
                                    </div>
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
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-input border border-input rounded px-3 py-2 text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-20"
                                    placeholder="Conte um pouco sobre você..."
                                ></textarea>
                                <p className="text-right text-[10px] text-muted-foreground">{bio.length}/160 caracteres</p>
                            </div>

                            {/* Interests Section */}
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    <Sparkles size={12} />
                                    Interesses
                                </label>
                                <div className="w-full bg-input border border-input rounded px-3 py-2 min-h-[40px] flex flex-wrap gap-2 items-center">
                                    {interests.map((tag, i) => (
                                        <span key={i} className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 group">
                                            {tag}
                                            <button onClick={() => removeInterest(tag)} className="hover:text-purple-300">
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={addInterest}
                                        className="bg-transparent text-xs focus:outline-none flex-1 min-w-[80px]"
                                        placeholder={interests.length === 0 ? "Ex: Ficção, Terror, Romance..." : ""}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">Pressione Enter para adicionar tags</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1 text-left">
                            <label className="text-xs font-medium text-muted-foreground">Endereço de E-mail</label>
                            <div className="bg-muted border border-border rounded px-3 py-1.5 text-muted-foreground text-sm">
                                {email}
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="text-accent flex-shrink-0 mt-0.5" size={16} />
                        <div>
                            <h4 className="font-medium text-foreground text-xs">Alteração de Senha</h4>
                            <p className="text-muted-foreground text-[10px] mt-0.5">Para alterar sua senha, enviaremos um link para seu email.</p>
                            <button className="mt-1 text-xs font-medium text-primary hover:underline">Enviar link de redefinição</button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 text-xs"
                    >
                        <Save size={14} />
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
