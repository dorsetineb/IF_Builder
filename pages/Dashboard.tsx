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

                // Fetch Favorites (Bookmarks)
                const { data: favoritesData } = await supabase
                    .from('post_favorites')
                    .select('post:posts(*, author:profiles(*), comments(count))')
                    .eq('user_id', user.id)
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
                            Você tem {myPosts.filter(p => p.status === 'draft').length} rascunhos pendentes e continue criando suas histórias incríveis.
                        </p>
                        <BookOpen className="absolute bottom-2 right-4 text-foreground/5 w-16 h-16 opacity-30 rotate-12" />
                    </div>

                    {/* Create Game Button */}
                    <Link to="/editor" className="bg-purple-600 hover:bg-purple-500 border border-purple-500 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all group cursor-pointer lg:col-span-1 h-full min-h-[120px] shadow-lg shadow-purple-900/20">
                        <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-white group-hover:text-purple-600 transition-all">
                            <Plus size={16} />
                        </div>
                        <h2 className="text-white font-bold text-sm">Criar Jogo</h2>
                        <p className="text-purple-200 text-[10px] mt-0.5">Inicie uma nova ficção interativa</p>
                    </Link>
                </div>

                {/* Middle Row: My Posts (2/3) + Favorites (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-end mb-2">
                            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                                Minhas postagens
                            </h2>
                            <Link to="/community/my-posts" className="text-purple-400 hover:text-purple-300 text-[10px] font-medium">Ver tudo</Link>
                        </div>

                        <div className="flex flex-col gap-2">
                            {loadingPosts ? (
                                <div className="text-center p-4 text-muted-foreground text-xs">Carregando...</div>
                            ) : myPosts.length > 0 ? (
                                myPosts.map(post => (
                                    <Link key={post.id} to={`/community/post/${post.id}`} className="bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group flex overflow-hidden h-24">
                                        {/* Cover Image or Fallback */}
                                        <div className="w-24 h-full bg-muted flex-shrink-0 relative">
                                            {post.image_url ? (
                                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                                                    <BookOpen size={24} className="opacity-20" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                                            <div>
                                                <h3 className="text-foreground font-medium truncate group-hover:text-purple-500 transition-colors text-sm">{post.title}</h3>
                                                <p className="text-muted-foreground text-[10px] truncate mt-0.5">Publicado em {new Date(post.created_at).toLocaleDateString()}</p>
                                            </div>

                                            <div className="flex items-center gap-3 text-muted-foreground text-[10px]">
                                                <span className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded"><MessageSquare size={10} /> {post.comments?.[0]?.count || 0}</span>
                                                <span className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded"><Eye size={10} /> {post.views || 0}</span>
                                                {post.status === 'draft' && <span className="text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded ml-auto">Rascunho</span>}
                                            </div>
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
                                Favoritos recentes
                            </h2>
                            <Link to="/community/favorites" className="text-purple-400 hover:text-purple-300 text-[10px] font-medium">Ver todos</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            {favoritePosts.length > 0 ? (
                                favoritePosts.map(post => (
                                    <Link key={post.id} to={`/community/post/${post.id}`} className="bg-card border border-border p-2 rounded-lg hover:border-primary/50 transition-all flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0 relative">
                                            {post.image_url ? (
                                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-purple-500 bg-purple-500/10">
                                                    <Heart size={16} className="fill-purple-500/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-foreground text-xs font-medium truncate group-hover:text-purple-400 transition-colors">{post.title}</h4>
                                            <p className="text-[10px] text-muted-foreground truncate">de {
                                                // @ts-ignore
                                                post.author?.username || 'Desconhecido'
                                            }</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-[10px] bg-card border border-border rounded-lg flex flex-col items-center gap-2">
                                    <Heart className="w-6 h-6 opacity-20" />
                                    <p>Suas histórias favoritas aparecerão aqui.</p>
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
