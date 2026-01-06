import React, { useEffect, useState } from 'react';
import { Plus, BookOpen, Eye, MessageSquare, Star, Heart, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Post = Database['public']['Tables']['posts']['Row'] & {
    comments: { count: number }[];
};

const Dashboard: React.FC = () => {
    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [displayName, setDisplayName] = useState<string>('Autor');

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Fetch Profile for Display Name
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username, full_name')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setDisplayName(profile.full_name || profile.username || 'Autor');
                }

                const { data } = await supabase
                    .from('posts')
                    .select('*, comments(count)')
                    .eq('author_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (data) setMyPosts(data as any);

                // Fetch Favorites (Reactions)
                const { data: favoritesData } = await supabase
                    .from('post_reactions')
                    .select('post:posts(*, author:profiles(*), comments(count))')
                    .eq('user_id', user.id)
                    .in('type', ['like', 'super_like'])
                    .limit(4);

                if (favoritesData) {
                    const posts = favoritesData.map((f: any) => f.post).filter(Boolean);
                    setFavoritePosts(posts);
                }
            }

            setLoadingPosts(false);
        };

        fetchUserData();
    }, []);

    return (
        <div className="min-h-full font-sans text-xs bg-background">
            {/* Standard Header */}
            <div className="h-[61px] border-b border-border flex items-center px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                {/* Top Row: Welcome (2/3) + Create Game (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    {/* Welcome Widget */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-card to-background p-4 rounded-lg border border-border relative overflow-hidden flex flex-col justify-center min-h-[120px]">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>

                        <h1 className="text-lg font-bold text-foreground mb-1 relative z-10">Bem-vindo de volta, {displayName}!</h1>
                        <p className="text-muted-foreground max-w-md relative z-10 text-xs leading-relaxed">
                            Você tem 3 rascunhos pendentes e sua última história "Fuja da Masmorra" recebeu 12 novos comentários.
                        </p>
                        <BookOpen className="absolute bottom-2 right-4 text-foreground/5 w-16 h-16 opacity-30 rotate-12" />
                    </div>

                    {/* Create Game Button (Replaces Stats) */}
                    <Link to="/editor" className="bg-purple-600 hover:bg-purple-500 border border-purple-500 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all group cursor-pointer lg:col-span-1 h-full min-h-[120px] shadow-lg shadow-purple-900/20">
                        <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-white group-hover:text-purple-600 transition-all">
                            <Plus size={16} />
                        </div>
                        <h2 className="text-white font-bold text-sm">Criar Jogo</h2>
                        <p className="text-purple-200 text-[10px] mt-0.5">Inicie uma nova ficção interativa</p>
                    </Link>
                </div>

                {/* Middle Row: My Posts (2/3) + Stats (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-end mb-2">
                            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                                Minhas postagens
                            </h2>
                            <Link to="/community" className="text-purple-400 hover:text-purple-300 text-[10px] font-medium">Ver tudo</Link>
                        </div>

                        <div className="flex flex-col gap-2">
                            {loadingPosts ? (
                                <div className="text-center p-4 text-muted-foreground text-xs">Carregando...</div>
                            ) : myPosts.length > 0 ? (
                                myPosts.map(post => (
                                    <Link key={post.id} to={`/community/post/${post.id}`} className="bg-card border border-border p-3 rounded-lg hover:border-primary/50 transition-colors cursor-pointer group flex gap-3 items-center">
                                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-muted-foreground flex-shrink-0">
                                            <MessageSquare size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-foreground font-medium truncate group-hover:text-purple-500 transition-colors text-xs">{post.title}</h3>
                                            <p className="text-muted-foreground text-[10px] truncate">Publicado em {new Date(post.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] whitespace-nowrap">
                                            <span className="flex items-center gap-0.5"><MessageSquare size={10} /> {post.comments?.length || 0}</span>
                                            <span className="flex items-center gap-0.5"><Eye size={10} /> 120</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center p-8 bg-card border border-border rounded-lg text-muted-foreground text-xs">Ainda não há postagens.</div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Favorites/Reactions */}
                    <div className="lg:col-span-1">
                        <div className="flex justify-between items-end mb-2">
                            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                                Favoritos
                            </h2>
                            <Link to="/community/favorites" className="text-purple-400 hover:text-purple-300 text-[10px] font-medium">Ver todos</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            {favoritePosts.length > 0 ? (
                                favoritePosts.map(post => (
                                    <Link key={post.id} to={`/community/post/${post.id}`} className="bg-card border border-border p-2 rounded-lg hover:border-primary/50 transition-all flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                                            <Heart size={14} className="fill-purple-500/20" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-foreground text-xs font-medium truncate">{post.title}</h4>
                                            <p className="text-[10px] text-muted-foreground truncate">de {
                                                // @ts-ignore
                                                post.author?.username || 'Autor'
                                            }</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-4 text-center text-muted-foreground text-[10px] bg-card border border-border rounded-lg">
                                    Nada favoritado ainda.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
