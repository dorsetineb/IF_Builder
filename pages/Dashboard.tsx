import React, { useEffect, useState } from 'react';
import { Plus, BookOpen, Eye, MessageSquare, Star, Heart, User, Loader2, Sparkles, Trophy, FileText, Hash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { PostCard } from '../components/PostCard';

type Post = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
};

type Profile = Database['public']['Tables']['profiles']['Row'];

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [myPostsCount, setMyPostsCount] = useState(0);
    const [myCommentsCount, setMyCommentsCount] = useState(0);
    const [myLikesReceivedCount, setMyLikesReceivedCount] = useState(0); // Mocked or fetched
    const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [recommendedAuthors, setRecommendedAuthors] = useState<Profile[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Fetch Profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileData) setProfile(profileData);

                // Stats: Posts Created
                const { count: postsCount } = await supabase
                    .from('posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('author_id', user.id);
                setMyPostsCount(postsCount || 0);

                // Stats: Comments (Replies)
                const { count: commentsCount } = await supabase
                    .from('comments')
                    .select('*', { count: 'exact', head: true })
                    .eq('author_id', user.id);
                setMyCommentsCount(commentsCount || 0);

                // Stats: Likes Received (Mocked for now as we don't have a direct easy query without efficient approach)
                // We'll simulate it for now or query a few recent posts and sum reactions? 
                // Let's just put a placeholder or small logic
                setMyLikesReceivedCount(0); // Placeholder

                // Fetch Favorites
                const { data: favData } = await supabase.from('post_favorites').select('post_id').eq('user_id', user.id).limit(5);

                if (favData && favData.length > 0) {
                    const postIds = favData.map(f => f.post_id);
                    const { data: posts } = await supabase
                        .from('posts')
                        .select(`
                            *,
                            profiles:author_id(*),
                            categories:category_id(*),
                            comments(count)
                        `)
                        .in('id', postIds)
                        .eq('status', 'published') // Ensure published
                        .limit(5);

                    if (posts) setFavoritePosts(posts as any);
                }

                // Fetch Recommended Authors (Random 3, excluding self)
                const { data: authors } = await supabase
                    .from('profiles')
                    .select('*')
                    .neq('id', user.id)
                    .limit(3);
                if (authors) setRecommendedAuthors(authors);
            }
            setLoadingPosts(false);
        };

        fetchUserData();
    }, []);

    const onToggleFavorite = async (e: React.MouseEvent, postId: string) => {
        // Simple toggle logic for dashboard view (similar to PostCard usage)
        e.preventDefault();
        e.stopPropagation();
        // Since we are listing favorites, toggling off should remove it from view technically, 
        // but for UX maybe just update state.
        console.log("Toggle favorite on dashboard");
    };

    return (
        <div className="min-h-full font-sans text-xs bg-background overflow-y-auto">
            {/* Header */}
            <div className="pt-8 px-8 pb-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        Bem-vindo de volta, {profile?.full_name?.split(' ')[0] || profile?.username || 'Usuário'}! <span className="text-2xl">👋</span>
                    </h1>
                    <Link to="/community/create" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20 text-xs">
                        <Plus size={16} /> Novo Post
                    </Link>
                </div>
                <p className="text-muted-foreground text-sm">
                    Aqui está o resumo da sua atividade e tópicos recomendados.
                </p>
            </div>

            <div className="px-8 pb-8 max-w-[1600px] mx-auto">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Posts Created */}
                    <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <FileText size={20} />
                            </div>
                            <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded-full">+2 hoje</span>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider mb-1">Posts Criados</p>
                            <h3 className="text-2xl font-bold text-foreground">{myPostsCount}</h3>
                        </div>
                    </div>

                    {/* Replies */}
                    <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <MessageSquare size={20} />
                            </div>
                            <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded-full">+12 sem.</span>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider mb-1">Respostas</p>
                            <h3 className="text-2xl font-bold text-foreground">{myCommentsCount}</h3>
                        </div>
                    </div>

                    {/* Likes/Hearts Received */}
                    <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                                <Heart size={20} />
                            </div>
                            <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded-full">+45</span>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider mb-1">Likes Recebidos</p>
                            <h3 className="text-2xl font-bold text-foreground">{myLikesReceivedCount}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Favorite Posts */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                Postagens Favoritas
                            </h2>
                            <Link to="/community/favorites" className="text-purple-400 hover:text-purple-300 text-xs font-bold">Ver tudo</Link>
                        </div>

                        <div className="flex flex-col gap-3">
                            {favoritePosts.length > 0 ? (
                                favoritePosts.map(post => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        isFavorite={true} // In this list, they are favs
                                        currentUserId={user?.id}
                                        onToggleFavorite={onToggleFavorite}
                                        viewMode="list"
                                    />
                                ))
                            ) : (
                                <div className="p-8 text-center bg-card border border-border rounded-xl">
                                    <p className="text-muted-foreground">Você ainda não favoritou nenhuma postagem.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Topics & Authors */}
                    <div className="space-y-6">
                        {/* Topics */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            <h3 className="text-sm font-bold text-foreground mb-4">Tópicos de Interesse</h3>
                            <p className="text-[10px] text-muted-foreground mb-4">Baseado na sua atividade recente.</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {profile?.interests && profile.interests.length > 0 ? (
                                    profile.interests.map((tag, i) => (
                                        <span key={i} className="px-2.5 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-secondary-foreground text-[10px] font-medium transition-colors cursor-pointer border border-border/50 hover:border-purple-500/30">
                                            # {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-muted-foreground italic">Nenhum tópico selecionado.</span>
                                )}
                            </div>

                            <Link to="/settings" className="block text-center text-purple-400 hover:text-purple-300 text-[10px] font-bold mt-2">
                                Gerenciar Tópicos
                            </Link>
                        </div>

                        {/* Followed Authors (Mocked/Recommended) */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-foreground">Autores Sugeridos</h3>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <div className="flex gap-0.5">
                                        <div className="w-1 h-1 rounded-full bg-current"></div>
                                        <div className="w-1 h-1 rounded-full bg-current"></div>
                                        <div className="w-1 h-1 rounded-full bg-current"></div>
                                    </div>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recommendedAuthors.map(author => (
                                    <div key={author.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate(`/community/author/${author.id}`)}>
                                        <div className="w-9 h-9 rounded-full bg-muted border border-border overflow-hidden relative">
                                            {author.avatar_url ? (
                                                <img src={author.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
                                                    <User size={14} />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-foreground truncate group-hover:text-purple-400 transition-colors">{author.full_name || author.username}</h4>
                                            {/* Mock role/title */}
                                            <p className="text-[10px] text-muted-foreground truncate">{author.username ? '@' + author.username : 'User'}</p>
                                        </div>
                                        <button className="text-muted-foreground hover:text-purple-400 transition-colors">
                                            <MessageSquare size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
