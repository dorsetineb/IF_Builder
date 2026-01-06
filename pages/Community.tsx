import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { PostCard } from '../components/PostCard';
import { Search, Plus, MessageSquare, FileText, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import { CreateTopicModal } from '../components/CreateTopicModal';

type PostWithAuthor = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
    post_reactions: { type: string }[];
};

type Category = Database['public']['Tables']['categories']['Row'];

const Community = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // State
    const [posts, setPosts] = useState<PostWithAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [user, setUser] = useState<any>(null);
    const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        await Promise.all([fetchCategories(), fetchPosts(), fetchFavorites(user)]);
        setLoading(false);
    };

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*').order('name');
        if (data) setCategories(data);
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
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching posts:', error);
        if (data) setPosts(data as any);
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
            await supabase.from('post_favorites').delete().eq('post_id', postId).eq('user_id', user.id);
            setFavorites(prev => {
                const newFavs = new Set(prev);
                newFavs.delete(postId);
                return newFavs;
            });
            toast('Removido', 'Removido dos favoritos.', 'info');
        } else {
            await supabase.from('post_favorites').insert({ post_id: postId, user_id: user.id });
            setFavorites(prev => new Set(prev).add(postId));
            toast('Adicionado', 'Adicionado aos favoritos!', 'success');
        }
    };

    const deletePost = async (postId: string) => {
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (!error) {
            setPosts(prev => prev.filter(p => p.id !== postId));
            toast('Sucesso', 'Tópico excluído.', 'success');
        } else {
            toast('Erro', 'Erro ao excluir tópico.', 'error');
        }
    };

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? post.category_id === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortBy === 'popular') {
            const reactionsA = a.post_reactions?.length || 0;
            const reactionsB = b.post_reactions?.length || 0;
            return reactionsB - reactionsA;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const showFeatured = !searchTerm && !selectedCategory;
    const featuredPosts = showFeatured ? sortedPosts.slice(0, 3) : [];
    const listPosts = showFeatured ? sortedPosts.slice(3) : sortedPosts;

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
                    <h1 className="text-xl font-bold text-foreground tracking-tight">Comunidade</h1>
                    <p className="text-[10px] text-muted-foreground hidden md:block">Discuta, compartilhe e aprenda com outros criadores.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64 hidden md:block">
                        <input
                            type="text"
                            placeholder="Pesquisar tópicos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-muted/50 border border-input rounded-lg py-1.5 pl-9 pr-3 text-xs text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground transition-all"
                        />
                        <Search className="absolute left-3 top-2 text-muted-foreground" size={14} />
                    </div>



                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20 text-xs hover:-translate-y-0.5"
                    >
                        <Plus size={16} />
                        Novo Tópico
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Filters */}
                <div className="w-52 border-r border-border bg-card/30 p-4 hidden lg:flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                    <div>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${!selectedCategory ? 'bg-purple-500/10 text-purple-400 font-bold border-l-2 border-purple-500' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            >
                                <span>Tudo</span>
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${selectedCategory === cat.id ? 'bg-purple-500/10 text-purple-400 font-bold border-l-2 border-purple-500' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                >
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Feed */}
                <div className="flex-1 overflow-y-auto bg-background/50 p-4 md:p-8 custom-scrollbar">
                    {/* Featured Topics Section */}
                    {showFeatured && featuredPosts.length > 0 && (
                        <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                Tópicos em Destaque
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {featuredPosts.map(post => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        isFavorite={favorites.has(post.id)}
                                        currentUserId={user?.id}
                                        onToggleFavorite={toggleFavorite}
                                        onDeletePost={deletePost}
                                        viewMode="grid"
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Recent Discussions List */}
                    <div className="max-w-4xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                {sortBy === 'recent' ? 'Discussões Recentes' : 'Discussões Populares'}
                            </h2>
                            <div className="flex bg-muted rounded-lg p-0.5 border border-border">
                                <button
                                    onClick={() => setSortBy('recent')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${sortBy === 'recent' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Recentes
                                </button>
                                <button
                                    onClick={() => setSortBy('popular')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${sortBy === 'popular' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Populares
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {listPosts.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card/20">
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
                                        onDeletePost={deletePost}
                                        viewMode="list"
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>


            </div>

            {/* Create Topic Modal */}
            <CreateTopicModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default Community;
