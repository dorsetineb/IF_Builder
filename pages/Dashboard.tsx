
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

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
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
        <div className="p-4 max-w-7xl mx-auto font-sans text-xs">
            {/* Top Row: Welcome (2/3) + Create Game (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Welcome Widget */}
                <div className="lg:col-span-2 bg-gradient-to-br from-card to-background p-4 rounded-lg border border-border relative overflow-hidden flex flex-col justify-center min-h-[120px]">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>

                    <h1 className="text-lg font-bold text-foreground mb-1 relative z-10">Bem-vindo de volta, Autor!</h1>
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
                                    <div className="flex gap-3 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1"><i className="w-1 h-1 rounded-full bg-green-500"></i> {post.comments[0]?.count || 0} respostas</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="bg-muted/30 border border-border p-4 rounded-lg text-center">
                                <p className="text-muted-foreground mb-2">Você ainda não tem postagens.</p>
                                <Link to="/community/create" className="text-purple-500 hover:text-purple-400 text-xs font-medium">Criar primeira postagem</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Widget (Moved here) */}
                <div className="bg-card border border-border p-4 rounded-lg flex flex-col justify-center relative overflow-hidden min-h-[120px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none"></div>
                    <div className="flex items-center gap-2 mb-1 text-purple-400">
                        <Eye size={14} />
                        <h2 className="font-semibold text-[10px] uppercase tracking-wider">Leituras Totais</h2>
                    </div>
                    <span className="text-2xl font-bold text-foreground mb-1 tracking-tight">24.5k</span>
                    <div className="inline-flex items-center text-[10px] text-green-400 bg-green-400/10 self-start px-1.5 py-0.5 rounded backdrop-blur-sm">
                        <span className="mr-1">↗</span> +12% este mês
                    </div>
                </div>
            </div>

            {/* Bottom Row: Favorite Posts (2/3) + Favorite Authors (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-end mb-2">
                        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                            Postagens favoritas
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {loadingPosts ? (
                            <div className="col-span-2 text-center p-4 text-muted-foreground text-xs">Carregando favoritos...</div>
                        ) : favoritePosts.length > 0 ? (
                            favoritePosts.map((post) => (
                                <Link key={post.id} to={`/community/post/${post.id}`} className="bg-card border border-border p-3 rounded-lg hover:border-primary/50 transition-colors cursor-pointer group block">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 rounded border border-border capitalize">{post.category_id || 'Geral'}</span>
                                    </div>
                                    <h4 className="text-foreground font-medium text-xs mb-0.5 group-hover:text-purple-500 transition-colors line-clamp-1">
                                        {post.title}
                                    </h4>
                                    <p className="text-muted-foreground text-[10px] line-clamp-2 mb-2">
                                        {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <div className="w-3 h-3 rounded-full bg-muted-foreground/30 overflow-hidden">
                                            {/* @ts-ignore */}
                                            {post.author?.avatar_url && <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        {/* @ts-ignore */}
                                        <span>{post.author?.username || 'Autor'}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-2 bg-muted/30 border border-border p-4 rounded-lg text-center">
                                <p className="text-muted-foreground mb-1 text-xs">Você não tem favoritos.</p>
                                <Link to="/community" className="text-purple-500 hover:text-purple-400 text-[10px] font-medium">Explorar comunidade</Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="flex justify-between items-end mb-2">
                        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                            Autores favoritos
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card border border-border p-2 rounded-lg flex items-center gap-2 hover:border-primary/50 cursor-pointer transition-colors group">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-purple-500/20 group-hover:text-purple-500 transition-colors">
                                    <User size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-foreground font-medium text-xs truncate">{i === 1 ? "neoguy" : i === 2 ? "silenthill" : "pixel_art"}</h4>
                                    <p className="text-muted-foreground text-[10px] truncate">{i === 1 ? "12 jogos" : i === 2 ? "5 jogos" : "8 jogos"}</p>
                                </div>
                                <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
                                    <Star size={14} className="fill-current" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
