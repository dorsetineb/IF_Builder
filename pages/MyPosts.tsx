import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { MessageSquare, Search, FileText, List, LayoutGrid, Plus } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { useToast } from '../components/ToastContext';
import { useNavigate } from 'react-router-dom';

type Post = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
};

const MyPosts: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [user, setUser] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                await fetchFavorites(user.id);
                await fetchMyPosts(user.id);
            } else {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchFavorites = async (userId: string) => {
        const { data } = await supabase.from('post_favorites').select('post_id').eq('user_id', userId);
        if (data) {
            setFavorites(new Set(data.map(f => f.post_id)));
        }
    };

    const fetchMyPosts = async (userId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles:author_id (*),
                categories:category_id (*),
                comments:comments(count)
            `)
            .eq('author_id', userId)
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching my posts:', error);
        if (data) setPosts(data as any);
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
            }
        } else {
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
        <div className="min-h-full font-sans text-xs bg-background">
            {/* Standard Header */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                <div className="flex flex-col justify-center h-full">
                    <h1 className="text-xl font-bold text-foreground">Minhas Postagens</h1>
                    <p className="text-[10px] text-muted-foreground hidden md:block">Gerencie os tópicos que você iniciou.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-80">
                        <input
                            type="text"
                            placeholder="Pesquisar..."
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
                </div>
            </div>

            <div className="p-8 max-w-[1600px] mx-auto">

                {loading ? (
                    <div className="p-8 text-center text-muted-foreground text-xs">Carregando...</div>
                ) : filteredPosts.length > 0 ? (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-3'}>
                        {filteredPosts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isFavorite={favorites.has(post.id)}
                                currentUserId={user?.id}
                                onToggleFavorite={toggleFavorite}
                                // Deletion removed
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
                        <FileText size={24} className="opacity-50" />
                        <p>Você ainda não publicou nenhuma postagem.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPosts;
