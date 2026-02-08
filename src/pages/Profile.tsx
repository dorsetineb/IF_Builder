import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { User, MapPin, Calendar, Link as LinkIcon, MessageSquare, BookOpen, Heart, MoreHorizontal, Mail, CheckCircle, Search, Bell } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { LoadingOverlay } from '../components/LoadingOverlay';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Post = Database['public']['Tables']['posts']['Row'] & { category_id?: string | null };

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

    if (!loading && !profile) return <div className="text-foreground p-8">Perfil não encontrado.</div>;

    return (
        <div className="font-sans text-foreground min-h-screen bg-background text-xs text-left relative">
            {loading && <LoadingOverlay message="Carregando perfil..." />}
            {/* Top Navigation Bar Helper (Ideally global) */}
            <div className="border-b border-border bg-card/50 px-4 py-2 flex justify-between items-center mb-0">
                <h1 className="text-sm font-bold text-foreground">Perfil</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input type="text" placeholder="Buscar histórias, autores..." className="bg-background border border-border rounded-full py-1 pl-8 pr-3 text-xs w-56 focus:border-primary focus:outline-none text-foreground" />
                        <Search size={12} className="absolute left-3 top-2 text-muted-foreground" />
                    </div>
                    <button className="p-1.5 bg-muted rounded-full hover:bg-muted/80 text-foreground"><Bell size={14} /></button>
                    <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                        {profile.avatar_url && <img src={profile.avatar_url} className="w-full h-full object-cover" />}
                    </div>
                </div>
            </div>

            {/* Banner */}
            <div className="h-40 sticky top-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>

            </div>

            <div className="max-w-5xl mx-auto px-4 relative z-10 -mt-16 text-left">
                <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-4 border-background bg-card overflow-hidden">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username || ''} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                    <User size={32} className="text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 pb-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-xl font-bold text-foreground">{profile.full_name || profile.username}</h1>
                            <CheckCircle size={16} className="text-blue-500 fill-blue-500/10" />
                        </div>
                        <p className="text-muted-foreground font-medium mb-1.5 text-xs">@{profile.username} • Membro desde {new Date(profile.created_at).getFullYear()}</p>
                        <p className="text-card-foreground/80 max-w-2xl leading-relaxed text-xs">
                            {profile.bio || "Sem biografia."}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pb-2">
                        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all flex items-center gap-1.5 text-xs">
                            <User size={14} /> Seguir
                        </button>
                        <button className="p-1.5 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors text-foreground">
                            <Mail size={14} />
                        </button>
                        <button className="p-1.5 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors text-foreground">
                            <MoreHorizontal size={14} />
                        </button>
                    </div>
                </div>

                {/* Stats & Meta */}
                <div className="flex items-center gap-6 text-xs text-muted-foreground mb-6 border-b border-border pb-4 text-left">
                    <div className="flex items-center gap-1.5">
                        <strong className="text-foreground text-sm">1.2k</strong> Seguidores
                    </div>
                    <div className="flex items-center gap-1.5">
                        <strong className="text-foreground text-sm">{posts.length}</strong> Obras
                    </div>
                    <div className="flex items-center gap-1.5">
                        <strong className="text-foreground text-sm">450</strong> Seguindo
                    </div>
                    {profile.website && (
                        <div className="flex items-center gap-1.5 ml-auto text-blue-400 hover:text-blue-300 cursor-pointer">
                            <LinkIcon size={12} /> {profile.website.replace('https://', '')}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-border mb-6 text-left">
                    {['Postagens', 'Obras', 'Listas', 'Sobre'].map((tab) => (
                        <button
                            key={tab}
                            className={`pb-3 text-xs font-bold tracking-wide transition-colors relative ${activeTab === 'posts' && tab === 'Postagens' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {tab}
                            {activeTab === 'posts' && tab === 'Postagens' && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 text-left">
                    {/* Create New Prompt Card */}
                    <div className="bg-card/50 border border-border rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer group h-full min-h-[160px]">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-foreground mb-1">Novo Projeto</h3>
                        <p className="text-muted-foreground text-[10px]">Comece uma nova história do zero</p>
                    </div>

                    {posts.map(post => (
                        <div key={post.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group">
                            <div className="h-28 bg-muted relative overflow-hidden">
                                {post.category_id && <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">DEVLOG</div>}
                                {/* Placeholder Gradient for thumbnail */}

                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-sm text-card-foreground mb-1 line-clamp-1">{post.title}</h3>
                                <p className="text-muted-foreground text-[10px] line-clamp-2 mb-2 h-8">{post.content}</p>
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                    <div className="flex gap-2">
                                        <span className="flex items-center gap-1"><Heart size={12} /> 342</span>
                                        <span className="flex items-center gap-1"><MessageSquare size={12} /> 45</span>
                                    </div>
                                    <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Desenvolvimento</span>
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
