
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { MessageSquare, Search, Plus, Filter, User, Clock, MessageCircle, Pin, ChevronLeft, ChevronRight, MoreHorizontal, Star, Trash2, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import { PostCard } from '../components/PostCard';

type Category = Database['public']['Tables']['categories']['Row'];
type Post = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
};

const Community: React.FC = () => {
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState<any>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Pagination State
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            await fetchCategories();
            if (user) await fetchFavorites(user.id);
            // Reset pagination on init/filter change
            setPage(0);
            setHasMore(true);
            await fetchPosts(0, true);
        };
        init();
    }, [selectedCategory]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
    };

    const fetchFavorites = async (userId: string) => {
        const { data } = await supabase.from('post_favorites').select('post_id').eq('user_id', userId);
        if (data) {
            setFavorites(new Set(data.map(f => f.post_id)));
        }
    };

    const fetchPosts = async (pageNumber = 0, reset = false) => {
        if (pageNumber === 0) setLoading(true); // Only show full loader on initial fetch

        let query = supabase
            .from('posts')
            .select(`
                id, title, content, created_at, status, author_id, category_id,
                profiles:author_id (id, username, avatar_url),
                categories:category_id (id, name, slug),
                comments:comments(count),
                post_favorites:post_favorites(count)
            `)
            .order('created_at', { ascending: false })
            .range(pageNumber * ITEMS_PER_PAGE, (pageNumber + 1) * ITEMS_PER_PAGE - 1);

        if (user) {
            query = query.or(`status.eq.published,and(status.eq.draft,author_id.eq.${user.id})`);
        } else {
            query = query.eq('status', 'published');
        }

        if (selectedCategory !== 'all') {
            query = query.eq('category_id', selectedCategory);
        }

        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
            return;
        }

        const fetchedPosts = data as any[];

        if (fetchedPosts.length < ITEMS_PER_PAGE) {
            setHasMore(false);
        } else {
            setHasMore(true);
        }

        if (reset) {
            setPosts(fetchedPosts);
        } else {
            setPosts(prev => [...prev, ...fetchedPosts]);
        }

        setLoading(false);
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, false);
    };

    const toggleFavorite = async (e: React.MouseEvent, postId: string) => {
        e.preventDefault();
        if (!user) return;

        if (favorites.has(postId)) {
            const { error } = await supabase.from('post_favorites').delete().eq('user_id', user.id).eq('post_id', postId);
            if (!error) {
                const newFavs = new Set(favorites);
                newFavs.delete(postId);
                setFavorites(newFavs);
                toast('Removido', 'Postagem removida dos favoritos.', 'info');
            }
        } else {
            const { error } = await supabase.from('post_favorites').insert({ user_id: user.id, post_id: postId });
            if (!error) {
                const newFavs = new Set(favorites);
                newFavs.add(postId);
                setFavorites(newFavs);
                toast('Salvo', 'Postagem adicionada aos favoritos!', 'success');
            }
        }
    };

    const deletePost = async (e: React.MouseEvent, postId: string) => {
        e.preventDefault();
        // Custom confirmation would be better, but sticking to logic given in previous step:
        if (!confirm('Tem certeza que deseja apagar esta postagem?')) return;

        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (!error) {
            setPosts(posts.filter(p => p.id !== postId));
            toast('Postagem removida', 'A postagem foi excluída com sucesso.', 'success');
        } else {
            toast('Erro', 'Erro ao apagar postagem.', 'error');
        }
    };

    // ... helper functions ...

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0);
            fetchPosts(0, true);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const filteredPosts = posts; // Server-side filtered now

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Scrollable Content Container */}
            <div className="h-full overflow-y-auto w-full">
                <div className="p-4 max-w-[1600px] mx-auto font-sans text-xs pb-20">
                    {/* Header Section */}
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-xl font-bold text-foreground mb-1">Fórum da Comunidade</h1>
                                <p className="text-muted-foreground text-xs">Discuta, aprenda e compartilhe seus projetos de ficção interativa.</p>
                            </div>
                        </div>

                        {/* Filters & Controls */}
                        <div className="flex flex-col space-y-4">
                            {/* Category Tabs */}
                            <div className="border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex space-x-1 overflow-x-auto no-scrollbar">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${selectedCategory === 'all'
                                            ? 'border-purple-500 text-foreground bg-purple-500/5'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-zinc-800/30'
                                            }`}
                                    >
                                        Todos
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${selectedCategory === cat.id
                                                ? 'border-purple-500 text-foreground bg-purple-500/5'
                                                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-zinc-800/30'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Search Box - Relocated to Logic Position (Left, Below Tabs) */}
                            <div className="relative w-full md:w-80">
                                <input
                                    type="text"
                                    placeholder={selectedCategory === 'all' ? "Pesquisar em todos os tópicos..." : "Pesquisar nesta categoria..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground transition-all"
                                />
                                <Search className="absolute left-3 top-2 text-muted-foreground" size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Topics Grid Layout */}
                    <div className="mb-20">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="inline-block w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Carregando discussões...</p>
                            </div>
                        ) : (
                            filteredPosts.length > 0 ? (
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                                    {filteredPosts.map((post) => (
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
                    {!loading && hasMore && searchTerm === '' && (
                        <div className="flex justify-center mb-12">
                            <button
                                onClick={loadMore}
                                className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>
                                Carregar Mais
                            </button>
                        </div>
                    )}

                    {/* Loading Indicator for Pagination */}
                    {loading && posts.length > 0 && (
                        <div className="text-center mb-12">
                            <div className="inline-block w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Standardized Create Post Button - Aligned with Sidebar Button Logic ('Abrir Editor') */}
            {/* Sidebar button is in a p-4 container. To match, we position this at left-4 bottom-4 inside the relative container.
                We increase padding to py-4 to match the heigh of the sidebar button. */}
            <div className="absolute bottom-4 left-4 z-50">
                <Link
                    to="/community/create"
                    className="flex items-center gap-3 px-6 py-4 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-xl active:scale-95 text-sm shadow-white/10"
                >
                    <Plus className="w-4 h-4" />
                    Novo Tópico
                </Link>
            </div>

            {/* View Toggle - Bottom Right */}
            <div className="absolute bottom-4 right-4 z-50 bg-zinc-900 border border-zinc-800 p-1 rounded-lg flex items-center shadow-xl">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-md transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Grade"
                >
                    <LayoutGrid size={18} />
                </button>

                <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Lista"
                >
                    <List size={18} />
                </button>
            </div>
        </div>
    );
};

export default Community;
