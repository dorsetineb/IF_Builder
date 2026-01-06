import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { PostCard } from '../components/PostCard';
import { Plus, Search, Filter, TrendingUp, LayoutGrid, List, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';

type Post = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
};

type Category = Database['public']['Tables']['categories']['Row'];

const Community: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default list
    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [user, setUser] = useState<any>(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 10;

    useEffect(() => {
        fetchCategories();
        checkUser();
    }, []);

    useEffect(() => {
        // Reset posts when filters change
        setPosts([]);
        setPage(0);
        setHasMore(true);
        fetchPosts(0, true);
    }, [selectedCategory, sortBy, searchTerm]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            fetchFavorites(user.id);
        }
    };

    const fetchFavorites = async (userId: string) => {
        const { data } = await supabase.from('post_favorites').select('post_id').eq('user_id', userId);
        if (data) {
            setFavorites(new Set(data.map(f => f.post_id)));
        }
    };

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
    };

    const fetchPosts = async (pageIndex: number, isReset: boolean = false) => {
        setLoading(true);
        try {
            let query = supabase
                .from('posts')
                .select(`
                    *,
                    profiles:author_id (*),
                    categories:category_id (*),
                    comments:comments(count)
                `)
                .eq('status', 'published');

            if (selectedCategory) {
                query = query.eq('category_id', selectedCategory);
            }

            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`);
            }

            if (sortBy === 'latest') {
                query = query.order('created_at', { ascending: false });
            } else {
                // For popular, we'd ideally sort by reaction count or View count if available.
                query = query.order('created_at', { ascending: false });
            }

            const from = pageIndex * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            const { data, error } = await query.range(from, to);

            if (error) throw error;

            if (data) {
                if (data.length < PAGE_SIZE) {
                    setHasMore(false);
                }

                if (isReset) {
                    setPosts(data as any);
                } else {
                    setPosts(prev => [...prev, ...data as any]);
                }
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (isReset) setPosts([]); // Clear posts on error if it was a reset
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage, false);
        }
    };

    const toggleFavorite = async (e: React.MouseEvent, postId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast('Login necessário', 'Faça login para favoritar postagens.', 'error');
            return;
        }

        if (favorites.has(postId)) {
            const { error } = await supabase.from('post_favorites').delete().eq('user_id', user.id).eq('post_id', postId);
            if (!error) {
                const newFavs = new Set(favorites);
                newFavs.delete(postId);
                setFavorites(newFavs);
                toast('Removido', 'Removido dos favoritos.', 'success');
            }
        } else {
            const { error } = await supabase.from('post_favorites').insert({ user_id: user.id, post_id: postId });
            if (!error) {
                const newFavs = new Set(favorites);
                newFavs.add(postId);
                setFavorites(newFavs);
                toast('Favoritado', 'Adicionado aos favoritos.', 'success');
            }
        }
    };

    const deletePost = async (e: React.MouseEvent, postId: string) => {
        e.preventDefault();
        if (!confirm('Tem certeza que deseja apagar esta postagem?')) return;

        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (!error) {
            setPosts(posts.filter(p => p.id !== postId));
            toast('Postagem removida', 'A postagem foi excluída com sucesso.', 'success');
        } else {
            toast('Erro', 'Erro ao apagar postagem.', 'error');
        }
    };

    return (
        <div className="min-h-full font-sans text-xs bg-background">
            {/* Standard Header */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                <h1 className="text-xl font-bold text-foreground">Fórum da Comunidade</h1>

                <div className="flex items-center gap-3">
                    <div className="relative w-64 hidden md:block">
                        <input
                            type="text"
                            placeholder="Pesquisar tópicos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-input border border-input rounded-lg py-1.5 pl-9 pr-3 text-xs text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground"
                        />
                        <Search className="absolute left-3 top-2 text-muted-foreground" size={14} />
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-muted rounded-lg p-0.5 border border-border">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Lista"
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Grade"
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/community/create')}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20 text-xs"
                    >
                        <Plus size={16} />
                        Novo Tópico
                    </button>
                </div>
            </div>

            <div className="p-8 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <div className="space-y-6">
                        {/* Adjust sticky top to account for header (61px) + padding */}
                        <div className="bg-card border border-border rounded-lg p-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
                                <Filter size={14} /> Filtros
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">Ordenar por</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
                                        className="w-full bg-input border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 appearance-none cursor-pointer hover:bg-muted/50 transition-colors"
                                    >
                                        <option value="latest">Mais Recentes</option>
                                        <option value="popular">Populares</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">Categorias</label>
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex justify-between items-center ${!selectedCategory ? 'bg-purple-500/10 text-purple-500 font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                        >
                                            Todas as Categorias
                                        </button>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex justify-between items-center ${selectedCategory === cat.id ? 'bg-purple-500/10 text-purple-500 font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="md:col-span-3 space-y-4">
                        {loading && page === 0 ? (
                            <div className="text-center p-8">
                                <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-muted-foreground mt-4 text-xs">Carregando discussões...</p>
                            </div>
                        ) : (
                            posts.length > 0 ? (
                                <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
                                    {posts.map(post => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            isFavorite={favorites.has(post.id)}
                                            currentUserId={user?.id}
                                            onToggleFavorite={toggleFavorite}
                                            onDeletePost={deletePost}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                                    <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                                    <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Nenhum tópico encontrado</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Load More Button */}
                    {!loading && hasMore && searchTerm === '' && posts.length > 0 && (
                        <div className="flex justify-center mb-12 md:col-start-2 md:col-span-3">
                            <button
                                onClick={loadMore}
                                className="px-6 py-3 bg-card border border-border rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-2"
                            >
                                <TrendingUp size={16} />
                                Carregar Mais
                            </button>
                        </div>
                    )}

                    {/* Loading Indicator for Pagination */}
                    {loading && posts.length > 0 && (
                        <div className="text-center mb-12 md:col-start-2 md:col-span-3">
                            <div className="inline-block w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;
