import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { User, MapPin, Calendar, Link as LinkIcon, MessageSquare, BookOpen, Heart, MoreHorizontal, Mail, CheckCircle, Search, Bell } from 'lucide-react';
import { useParams } from 'react-router-dom';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];

const Profile: React.FC = () => {
    const { username } = useParams(); // For future public view by username
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'posts' | 'works' | 'lists' | 'about'>('posts');

    useEffect(() => {
        getProfileData();
    }, []);

    const getProfileData = async () => {
        // For now, always fetch current user or passed username
        const { data: { user } } = await supabase.auth.getUser();

        let query = supabase.from('profiles').select('*');

        // If username param exists, use it? For now let's just use current user 
        // Logic for viewing others would be: if (username) query.eq('username', username) else eq('id', user.id)
        if (user) {
            query = query.eq('id', user.id);
        }

        const { data, error } = await query.single();

        if (data) {
            setProfile(data);
            fetchUserPosts(data.id);
        }
        setLoading(false);
    };

    const fetchUserPosts = async (userId: string) => {
        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('author_id', userId)
            .order('created_at', { ascending: false });
        if (data) setPosts(data);
    };

    if (loading) return <div className="text-white p-8">Carregando perfil...</div>;
    if (!profile) return <div className="text-white p-8">Perfil não encontrado.</div>;

    return (
        <div className="font-sans text-zinc-100 min-h-screen bg-zinc-950">
            {/* Top Navigation Bar Helper (Ideally global) */}
            <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-3 flex justify-between items-center mb-0">
                <h1 className="text-lg font-bold">Perfil</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input type="text" placeholder="Buscar histórias, autores..." className="bg-zinc-950 border border-zinc-800 rounded-full py-1.5 pl-9 pr-4 text-sm w-64 focus:border-zinc-600 focus:outline-none" />
                        <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                    </div>
                    <button className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700"><Bell size={16} /></button>
                    <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden">
                        {profile.avatar_url && <img src={profile.avatar_url} className="w-full h-full object-cover" />}
                    </div>
                </div>
            </div>

            {/* Banner */}
            <div className="h-64 sticky top-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 -mt-20">
                <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full border-4 border-zinc-950 bg-zinc-900 overflow-hidden shadow-2xl">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username || ''} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                    <User size={64} className="text-zinc-600" />
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 border-4 border-zinc-950 rounded-full"></div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-white shadow-sm">{profile.full_name || profile.username}</h1>
                            <CheckCircle size={20} className="text-blue-500 fill-blue-500/10" />
                        </div>
                        <p className="text-zinc-400 font-medium mb-3">@{profile.username} • Membro desde {new Date(profile.created_at).getFullYear()}</p>
                        <p className="text-zinc-300 max-w-2xl leading-relaxed text-sm">
                            {profile.bio || "Sem biografia."}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pb-4">
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2">
                            <User size={18} /> Seguir
                        </button>
                        <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors">
                            <Mail size={18} />
                        </button>
                        <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Stats & Meta */}
                <div className="flex items-center gap-8 text-sm text-zinc-400 mb-8 border-b border-zinc-800 pb-8">
                    <div className="flex items-center gap-1.5">
                        <strong className="text-white text-base">1.2k</strong> Seguidores
                    </div>
                    <div className="flex items-center gap-1.5">
                        <strong className="text-white text-base">{posts.length}</strong> Obras
                    </div>
                    <div className="flex items-center gap-1.5">
                        <strong className="text-white text-base">450</strong> Seguindo
                    </div>
                    {profile.website && (
                        <div className="flex items-center gap-1.5 ml-auto text-blue-400 hover:text-blue-300 cursor-pointer">
                            <LinkIcon size={14} /> {profile.website.replace('https://', '')}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-zinc-800 mb-8">
                    {['Postagens', 'Obras', 'Listas', 'Sobre'].map((tab) => (
                        <button
                            key={tab}
                            className={`pb-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'posts' && tab === 'Postagens' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {tab}
                            {activeTab === 'posts' && tab === 'Postagens' && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {/* Create New Prompt Card */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors cursor-pointer group h-full min-h-[220px]">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-purple-600/20 group-hover:text-purple-400 transition-colors">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Novo Projeto</h3>
                        <p className="text-zinc-500 text-sm">Comece uma nova história do zero</p>
                    </div>

                    {posts.map(post => (
                        <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-purple-900/10 transition-all group">
                            <div className="h-32 bg-zinc-800 relative overflow-hidden">
                                {categories[0] && <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">DEVLOG</div>}
                                {/* Placeholder Gradient for thumbnail */}
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-105 transition-transform duration-500"></div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">{post.title}</h3>
                                <p className="text-zinc-400 text-sm line-clamp-2 mb-4 h-10">{post.content}</p>
                                <div className="flex items-center justify-between text-xs text-zinc-500">
                                    <div className="flex gap-3">
                                        <span className="flex items-center gap-1"><Heart size={14} /> 342</span>
                                        <span className="flex items-center gap-1"><MessageSquare size={14} /> 45</span>
                                    </div>
                                    <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-400">Desenvolvimento</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
