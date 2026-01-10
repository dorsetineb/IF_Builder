import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { PostCard } from '../components/PostCard';
import { useFeed } from '../components/FeedContext';
import { useUser } from '../components/UserContext';
import { useToast } from '../components/ToastContext';
import { Search, Plus, MessageSquare, FileText, Star, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PostWithAuthor = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
    post_reactions: { type: string }[];
};

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryGroup = Database['public']['Tables']['category_groups']['Row'] & {
    categories: Category[];
};

// ...

const Community = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useUser();
    const { posts, setPosts, lastFetched, setLastFetched } = useFeed();

    // State
    // Removed local posts state
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedScope, setSelectedScope] = useState<{ id: string; type: 'group' | 'category' } | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

    useEffect(() => {
        init();
    }, [user]);

    const init = async () => {
        try {
            const isCacheValid = posts.length > 0 && lastFetched && (Date.now() - lastFetched < 5 * 60 * 1000); // 5 min cache

            if (isCacheValid) {
                // Background update for non-critical data or just skip
                await fetchCategories();
                if (user) await fetchFavorites(user);
                setLoading(false);
                return;
            }

            // Parallel fetch
            await Promise.all([
                fetchCategories(),
                fetchPosts()
            ]);

            if (user) {
                await fetchFavorites(user);
            }
        } catch (err: any) {
            console.error('Error initializing community:', err);
            toast('Erro', `Não foi possível carregar o fórum.`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const { data } = await supabase
            .from('category_groups')
            .select(`
                *,
                categories (*)
            `)
            .order('order_index');

        if (data) {
            // Sort categories within groups by order_index
            const sortedGroups = data.map((group: any) => ({
                ...group,
                categories: group.categories.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
            }));
            setCategoryGroups(sortedGroups);
            // Flatten for legacy support if needed, or just unused
            setCategories(sortedGroups.flatMap(g => g.categories));
        }
    };

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles:author_id (*),
                categories:category_id (*),
                comments:comments(count),
                post_reactions(type)
            `)
            .order('created_at', { ascending: false })
            .eq('status', 'published') // Show only published posts
            .range(0, 99); // Pagination limit to prevent slow leading

        if (error) console.error('Error fetching posts:', error);
        if (data) {
            setPosts(data as any);
            setLastFetched(Date.now());
        }
    };

    const fetchFavorites = async (user: any) => {
        if (!user) return;
        const { data } = await supabase.from('post_favorites').select('post_id').eq('user_id', user.id);
        if (data) {
            setFavorites(new Set(data.map(f => f.post_id)));
        }
    };

    const toggleFavorite = async (postId: string) => {
        if (!user) {
            toast('Login necessário', 'Você precisa estar logado para favoritar.', 'error');
            return;
        }

        if (favorites.has(postId)) {
            const { error } = await supabase.from('post_favorites').delete().eq('post_id', postId).eq('user_id', user.id);
            if (error) {
                console.error('Error removing favorite:', error);
                toast('Erro', 'Falha ao remover favorito.', 'error');
                return;
            }
            setFavorites(prev => {
                const newFavs = new Set(prev);
                newFavs.delete(postId);
                return newFavs;
            });
            toast('Removido', 'Removido dos favoritos.', 'info');
        } else {
            const { error } = await supabase.from('post_favorites').insert({ post_id: postId, user_id: user.id });
            if (error) {
                console.error('Error adding favorite:', error);
                toast('Erro', 'Falha ao adicionar favorito.', 'error');
                return;
            }
            setFavorites(prev => new Set(prev).add(postId));
            toast('Adicionado', 'Adicionado aos favoritos!', 'success');
        }
    };

    const deletePost = async (postId: string) => {
        // Manual Cascade Delete due to missing DB constraints
        const { error: commentsError } = await supabase.from('comments').delete().eq('post_id', postId);
        if (commentsError) console.error('Error deleting comments:', commentsError);

        const { error: reactionsError } = await supabase.from('post_reactions').delete().eq('post_id', postId);
        if (reactionsError) console.error('Error deleting reactions:', reactionsError);

        const { error: favoritesError } = await supabase.from('post_favorites').delete().eq('post_id', postId);
        if (favoritesError) console.error('Error deleting favorites:', favoritesError);

        const { error } = await supabase.from('posts').delete().eq('id', postId);

        if (!error) {
            setPosts(prev => prev.filter(p => p.id !== postId));
            toast('Sucesso', 'Tópico excluído.', 'success');
        } else {
            console.error('Delete error:', error);
            toast('Erro', 'Erro ao excluir tópico. Verifique se há dependências.', 'error');
        }
    };

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        const matchesSearch = searchTerm ? (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        ) : true;

        let matchesScope = true;
        if (selectedScope) {
            if (selectedScope.type === 'category') {
                matchesScope = post.category_id === selectedScope.id;
            } else if (selectedScope.type === 'group') {
                // Find category of post to check its group
                // Note: 'categories' is the flat list we maintain
                const postCat = categories.find(c => c.id === post.category_id);
                matchesScope = postCat?.group_id === selectedScope.id;
            }
        }

        return matchesSearch && matchesScope;
    });

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortBy === 'popular') {
            const commentsA = a.comments?.[0]?.count || 0;
            const commentsB = b.comments?.[0]?.count || 0;
            return commentsB - commentsA;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const showFeatured = !searchTerm && !selectedScope;
    const featuredPosts = showFeatured ? sortedPosts.slice(0, 3) : [];
    const listPosts = sortedPosts;

    if (loading) {
        return (
            <div className="flex-1 p-8 text-center text-zinc-500 text-xs animate-pulse">
                Carregando comunidade...
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background font-sans overflow-hidden">
            {/* Sticky Top Bar */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-foreground tracking-tight">Fórum</h1>
                    <p className="text-[10px] text-muted-foreground hidden md:block">Compartilhe e aprenda com outros autores.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/community/create')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20 text-xs hover:-translate-y-0.5"
                    >
                        <Plus size={16} />
                        Novo Tópico
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Filters */}
                <div className="w-64 border-r border-border bg-card/30 p-4 hidden lg:flex flex-col gap-6 overflow-y-auto custom-scrollbar shrink-0">
                    <div className="space-y-4">
                        {/* Global Filter */}
                        <button
                            onClick={() => setSelectedScope(null)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group border-l-2 ${!selectedScope ? 'bg-purple-500/10 text-purple-400 font-bold border-purple-500' : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        >
                            <span className="font-bold">Todos os Tópicos</span>
                        </button>

                        <div className="w-full h-px bg-border/50 my-2" />

                        {/* Hierarchical Categories */}
                        {categoryGroups.map(group => (
                            <div key={group.id} className="space-y-1">
                                {/* Group Header - Selectable */}
                                <button
                                    onClick={() => setSelectedScope({ id: group.id, type: 'group' })}
                                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between group transition-all border-l-2 ${selectedScope?.type === 'group' && selectedScope.id === group.id ? 'bg-purple-500/5 text-purple-400 border-purple-500' : 'border-transparent hover:bg-muted/50'}`}
                                >
                                    <span className={`text-xs font-bold uppercase tracking-widest ${selectedScope?.type === 'group' && selectedScope.id === group.id ? 'text-purple-400' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                        {group.name}
                                    </span>
                                </button>

                                {/* Categories - Indented */}
                                <div className="ml-2 border-l border-border/50 space-y-0.5">
                                    {group.categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedScope({ id: cat.id, type: 'category' })}
                                            className={`w-full text-left pl-4 pr-3 py-1.5 rounded-r-lg rounded-l-none -ml-[1px] transition-all group border-l-2 ${selectedScope?.type === 'category' && selectedScope.id === cat.id ? 'bg-purple-500/10 text-purple-400 border-purple-500 z-10' : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                        >
                                            <div className="text-xs font-medium truncate">
                                                {cat.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Feed */}
                <div className="flex-1 overflow-y-auto bg-background/50 p-4 md:px-8 md:py-4 custom-scrollbar">

                    {/* Search Context Bar */}
                    <div className="max-w-4xl mb-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder={`Pesquisar em ${selectedScope?.type === 'group' ? categoryGroups.find(g => g.id === selectedScope.id)?.name : (selectedScope?.type === 'category' ? categories.find(c => c.id === selectedScope.id)?.name : 'Toda a Comunidade')}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-card border border-border/50 rounded-xl py-2.5 pl-11 pr-4 text-sm text-foreground shadow-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground transition-all group-hover:border-purple-500/30"
                            />
                            <Search className="absolute left-4 top-3 text-muted-foreground group-hover:text-purple-400 transition-colors" size={18} />
                        </div>
                    </div>

                    {/* Featured Topics Section */}
                    {showFeatured && featuredPosts.length > 0 && (
                        <section className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                Destaques
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {featuredPosts.map(post => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        isFavorite={favorites.has(post.id)}
                                        currentUserId={user?.id}
                                        onToggleFavorite={toggleFavorite}
                                        // Deletion removed from feed
                                        viewMode="grid"
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Recent Discussions List */}
                    {/* Main List Tabs */}
                    {/* Main List Tabs */}
                    <div className="max-w-4xl">
                        <div className="flex items-end justify-between border-b border-border mb-6">
                            <div className="flex space-x-1 overflow-x-auto -mb-px">
                                <button
                                    onClick={() => setSortBy('recent')}
                                    className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${sortBy === 'recent'
                                        ? 'border-purple-500 text-foreground bg-purple-500/5'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                        }`}
                                >
                                    Recentes
                                </button>
                                <button
                                    onClick={() => setSortBy('popular')}
                                    className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${sortBy === 'popular'
                                        ? 'border-purple-500 text-foreground bg-purple-500/5'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                        }`}
                                >
                                    Populares
                                </button>
                            </div>

                            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/50 mb-2">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background text-purple-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    title="Lista"
                                >
                                    <List size={14} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background text-purple-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    title="Grade"
                                >
                                    <LayoutGrid size={14} />
                                </button>
                            </div>
                        </div>

                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
                            {listPosts.length === 0 ? (
                                <div className="col-span-full text-center py-12 border border-dashed border-border rounded-xl bg-card/20">
                                    <p className="text-muted-foreground text-sm">Nenhum tópico encontrado.</p>
                                </div>
                            ) : (
                                listPosts.map(post => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        isFavorite={favorites.has(post.id)}
                                        currentUserId={user?.id}
                                        onToggleFavorite={toggleFavorite}
                                        // Deletion removed from feed
                                        viewMode={viewMode}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>


            </div>


        </div>
    );
};

export default Community;
