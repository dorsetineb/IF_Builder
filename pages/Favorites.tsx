import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { Search, Star } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { useToast } from '../components/ToastContext';

type Post = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
};

const Favorites: React.FC = () => {
    const { toast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                await fetchFavorites(user.id);
            } else {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchFavorites = async (userId: string) => {
        setLoading(true);
        // First get favorite IDs
        const { data: favData } = await supabase.from('post_favorites').select('post_id').eq('user_id', userId);

        if (favData && favData.length > 0) {
            const favIds = favData.map(f => f.post_id);
            setFavorites(new Set(favIds));

            // Then fetch posts
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    profiles:author_id (*),
                    categories:category_id (*),
                    comments:comments(count)
                `)
                .in('id', favIds)
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching favorites:', error);
            if (data) setPosts(data as any);
        } else {
            setFavorites(new Set());
            setPosts([]);
        }
        setLoading(false);
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
                // Remove from list immediately
                setPosts(posts.filter(p => p.id !== postId));
            }
        } else {
            // Should not happen in favorites view (adding)
            const { error } = await supabase.from('post_favorites').insert({ user_id: user.id, post_id: postId });
            if (!error) {
                const newFavs = new Set(favorites);
                newFavs.add(postId);
                setFavorites(newFavs);
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

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 max-w-[1600px] mx-auto font-sans h-[calc(100vh-48px)] overflow-y-auto text-xs">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-xl font-bold text-foreground mb-1">Meus Favoritos</h1>
                        <p className="text-muted-foreground text-xs">Acesse rapidamente as discussões que você salvou.</p>
                    </div>

                    <div className="relative w-80">
                        <input
                            type="text"
                            placeholder="Pesquisar nos favoritos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-input border border-input rounded-lg py-2 pl-9 pr-3 text-xs text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground"
                        />
                        <Search className="absolute left-3 top-2 text-muted-foreground" size={14} />
                    </div>
                </div>
                <div className="h-px bg-border w-full"></div>
            </div>

            {/* List */}
            <div className="border border-border rounded-lg overflow-hidden bg-card/50">
                <div className="grid grid-cols-12 gap-3 px-4 py-2 bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-12 lg:col-span-7">Tópico</div>
                    <div className="col-span-2 hidden lg:block">Criador</div>
                    <div className="col-span-1 hidden lg:block text-center">Respostas</div>
                    <div className="col-span-2 hidden lg:block text-right">Ações</div>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground text-xs">Carregando seus favoritos...</div>
                    ) : filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isFavorite={favorites.has(post.id)}
                                currentUserId={user?.id}
                                onToggleFavorite={toggleFavorite}
                                onDeletePost={deletePost}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
                            <Star size={24} className="opacity-50" />
                            <p>Você ainda não favoritou nenhuma postagem.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Favorites;
