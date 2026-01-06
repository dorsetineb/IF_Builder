import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { User, Lock, Save, Camera, Link as LinkIcon, Mail } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Settings: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [email, setEmail] = useState('');

    // Form States
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setEmail(user.email || '');
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) {
                setProfile(data);
                setDisplayName(data.full_name || '');
                setUsername(data.username || '');
                setWebsite(data.website || '');
                setBio(data.bio || '');
                setAvatarUrl(data.avatar_url || '');
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
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            alert(error.message);
        } else {
            alert('Perfil atualizado com sucesso!');
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto font-sans text-zinc-200">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Configurações de Perfil</h1>
                    <p className="text-zinc-400">Gerencie suas informações pessoais e preferências de conta.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 text-sm font-medium transition-colors">
                    <User size={16} /> Manual de Uso
                </button>
            </div>

            {/* Public Info Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6 text-purple-400">
                    <User size={20} />
                    <h2 className="text-lg font-bold text-white">Informações Públicas</h2>
                </div>

                <div className="flex gap-8">
                    {/* Avatar Actions */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-900 shadow-xl overflow-hidden flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-zinc-600" />
                            )}
                        </div>
                        <button
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1.5"
                            onClick={() => {
                                const url = prompt("Insira a URL da imagem:");
                                if (url) setAvatarUrl(url);
                            }}
                        >
                            Alterar Foto
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 space-y-5">
                        <div className="space-y-1.5 text-left">
                            <label className="text-sm font-medium text-zinc-400">Nome de Exibição</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                                placeholder="Como você quer ser chamado"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5 text-left">
                                <label className="text-sm font-medium text-zinc-400">Nome de Usuário</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-zinc-500">@</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 text-left">
                                <label className="text-sm font-medium text-zinc-400">Website (Opcional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-zinc-500"><LinkIcon size={14} /></span>
                                    <input
                                        type="text"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                                        placeholder="https://"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 text-left">
                            <label className="text-sm font-medium text-zinc-400">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none h-24"
                                placeholder="Conte um pouco sobre você..."
                            ></textarea>
                            <p className="text-right text-xs text-zinc-600">{bio.length}/160 caracteres</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section (Visual Only for now) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6 text-purple-400">
                    <Lock size={20} />
                    <h2 className="text-lg font-bold text-white">Segurança e Contato</h2>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1.5 text-left">
                        <label className="text-sm font-medium text-zinc-400">Endereço de E-mail</label>
                        <div className="bg-black/30 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-500">
                            {email}
                        </div>
                    </div>
                    <div className="space-y-1.5 text-left">
                        <label className="text-sm font-medium text-zinc-400">Telefone (Opcional)</label>
                        <div className="bg-black/30 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-500">
                            +55 (XX) XXXXX-XXXX
                        </div>
                    </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-4">Alterar Senha</h3>
                <div className="grid grid-cols-3 gap-4">
                    <input type="password" placeholder="Senha Atual" className="bg-black/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white" disabled />
                    <input type="password" placeholder="Nova Senha" className="bg-black/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white" disabled />
                    <input type="password" placeholder="Confirmar Senha" className="bg-black/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white" disabled />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-purple-900/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    <Save size={18} />
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};

export default Settings;
