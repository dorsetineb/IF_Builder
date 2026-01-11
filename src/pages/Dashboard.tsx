import React, { useEffect, useState } from 'react';
import { MessageSquare, Heart, User, FileText, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { PostCard } from '../components/PostCard';
import { InviteManager } from '../components/InviteManager';
import { useUser } from '../components/UserContext';
import { LoadingOverlay } from '../components/LoadingOverlay';

type Post = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
};

type Profile = Database['public']['Tables']['profiles']['Row'];

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile } = useUser(); // Global state
    const [myPostsCount, setMyPostsCount] = useState(0);
    const [myCommentsCount, setMyCommentsCount] = useState(0);
    const [myLikesReceivedCount, setMyLikesReceivedCount] = useState(0);
    const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [recommendedAuthors, setRecommendedAuthors] = useState<Profile[]>([]);

    const [myRecentPosts, setMyRecentPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) {
                setLoadingPosts(false); // Stop loading if user.id is not available
                return;
            }

            try {
                // Execute independent queries in parallel
                const [
                    postsResult,
                    commentsResult,
                    recentPostsResult,
                    favoritesResult,
                    followsResult
                ] = await Promise.all([
                    // 1. Stats: Posts Created
                    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', user.id),
                    // 2. Stats: Comments
                    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('author_id', user.id),
                    // 3. Recent Posts
                    supabase.from('posts')
                        .select(`
                            *,
                            profiles:author_id(*),
                            categories:category_id(*),
                            comments(count)
                        `)
                        .eq('author_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(3),
                    // 4. Favorites IDs
                    supabase.from('post_favorites').select('post_id').eq('user_id', user.id).limit(5),
                    // 5. Follows IDs
                    supabase.from('user_follows').select('following_id').eq('follower_id', user.id)
                ]);

                // Update Stats
                setMyPostsCount(postsResult.count || 0);
                setMyCommentsCount(commentsResult.count || 0);
                setMyLikesReceivedCount(0); // Still mocked

                // Update Recent Posts
                if (recentPostsResult.data) {
                    setMyRecentPosts(recentPostsResult.data as any);
                }

                // Handle Dependent Queries (Favorites & Authors)
                const promises = [];

                // Fetch Favorite Posts Details
                if (favoritesResult.data && favoritesResult.data.length > 0) {
                    const postIds = favoritesResult.data.map(f => f.post_id);
                    promises.push(
                        supabase
                            .from('posts')
                            .select(`
                                *,
                                profiles:author_id(*),
                                categories:category_id(*),
                                comments(count)
                            `)
                            .in('id', postIds)
                            .eq('status', 'published')
                            .limit(5)
                            .then(({ data }) => {
                                if (data) setFavoritePosts(data as any);
                            })
                    );
                }

                // Fetch Recommended Authors (Followed) Details
                if (followsResult.data && followsResult.data.length > 0) {
                    const ids = followsResult.data.map(f => f.following_id);
                    promises.push(
                        supabase
                            .from('profiles')
                            .select('*')
                            .in('id', ids)
                            .then(({ data }) => {
                                if (data) setRecommendedAuthors(data);
                            })
                    );
                }

                if (promises.length > 0) {
                    await Promise.all(promises);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchUserData();
    }, [user?.id]);

    const onToggleFavorite = async (e: React.MouseEvent, postId: string) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Toggle favorite on dashboard");
    };

    const timeAgo = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

        if (diffInSeconds < 60) return 'agora';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
        return `${Math.floor(diffInSeconds / 86400)}d atrás`;
    };

    return (
        <div className="min-h-full font-sans text-xs bg-background overflow-y-auto relative">
            {loadingPosts && <LoadingOverlay message="Carregando atividades..." />}
            {/* Header */}
            <div className="pt-8 px-8 pb-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        Olá, {profile?.full_name?.split(' ')[0] || profile?.username || 'Usuário'}! <span className="text-2xl">👋</span>
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    Aqui está o resumo de suas atividades.
                </p>
            </div>

            <div className="px-8 pb-8 max-w-[1600px] mx-auto">
                {/* Top Section: Stats & Beta Access */}
                {/* Top Section: Stats & Beta Access */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Stats Group */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Posts Created */}
                        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                <FileText size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Tópicos</p>
                                <h3 className="text-2xl font-bold text-foreground leading-none">{myPostsCount}</h3>
                            </div>
                        </div>

                        {/* Replies */}
                        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                <MessageSquare size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Respostas</p>
                                <h3 className="text-2xl font-bold text-foreground leading-none">{myCommentsCount}</h3>
                            </div>
                        </div>

                        {/* Likes/Hearts Received */}
                        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                                <Heart size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Curtidas</p>
                                <h3 className="text-2xl font-bold text-foreground leading-none">{myLikesReceivedCount}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Beta Access */}
                    <div className="lg:col-span-1 h-full">
                        <InviteManager />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: My Topics & Favorites */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* My Topics Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Meus Tópicos
                                </h2>
                                <Link to="/community/my-posts" className="text-purple-400 hover:text-purple-300 text-xs font-bold">Ver todos</Link>
                            </div>

                            <div className="flex flex-col gap-3">
                                {myRecentPosts.length > 0 ? (
                                    myRecentPosts.map(post => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            isFavorite={false} // Owner view, maybe treat differently later
                                            currentUserId={user?.id}
                                            onToggleFavorite={onToggleFavorite}
                                            viewMode="list"
                                            showContent={true}
                                        />
                                    ))
                                ) : (
                                    <div className="p-8 text-center bg-card border border-border rounded-xl border-dashed">
                                        <p className="text-muted-foreground mb-4 text-xs">Você ainda não criou nenhum tópico.</p>
                                        <Link to="/community/create" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-xs inline-flex items-center gap-2 transition-all">
                                            <FileText size={14} /> Criar Tópico
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Favorites Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Tópicos Favoritos
                                </h2>
                                <Link to="/community/favorites" className="text-purple-400 hover:text-purple-300 text-xs font-bold">Ver todos</Link>
                            </div>

                            <div className="flex flex-col gap-3">
                                {favoritePosts.length > 0 ? (
                                    favoritePosts.slice(0, 3).map(post => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            isFavorite={true}
                                            currentUserId={user?.id}
                                            onToggleFavorite={onToggleFavorite}
                                            viewMode="list"
                                            showContent={true}
                                        />
                                    ))
                                ) : (
                                    <div className="p-8 text-center bg-card border border-border rounded-xl">
                                        <p className="text-muted-foreground">Você ainda não favoritou nenhuma postagem.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Authors */}
                    <div className="space-y-6">

                        {/* Favorite Authors (Renamed) */}
                        <div className="bg-card border border-border rounded-xl p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-foreground">Autores Favoritos</h3>
                            </div>

                            {/* Using recommendedAuthors for now as placeholder for Favorites */}
                            <div className="space-y-4">
                                {recommendedAuthors.length > 0 ? recommendedAuthors.map(author => (
                                    <div key={author.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate(`/community/author/${author.id}`)}>
                                        <div className="w-9 h-9 rounded-full bg-muted border border-border overflow-hidden relative">
                                            {author.avatar_url ? (
                                                <img src={author.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
                                                    <User size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-foreground truncate group-hover:text-purple-400 transition-colors">{author.full_name || author.username}</h4>
                                            <p className="text-[10px] text-muted-foreground truncate">{author.username ? '@' + author.username : 'User'}</p>
                                        </div>
                                        <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
                                            <Star size={14} fill="currentColor" />
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-muted-foreground text-[10px] italic">Você não favoritou nenhum autor.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
