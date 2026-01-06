import React from 'react';
import { Database } from '../types/supabase';
import { MessageSquare, User, Star, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Post = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
};

interface PostCardProps {
    post: Post;
    isFavorite: boolean;
    currentUserId?: string;
    onToggleFavorite: (e: React.MouseEvent, postId: string) => void;
    onDeletePost: (e: React.MouseEvent, postId: string) => void;
    viewMode?: 'grid' | 'list';
}

export const PostCard: React.FC<PostCardProps> = ({ post, isFavorite, currentUserId, onToggleFavorite, onDeletePost, viewMode = 'grid' }) => {
    const navigate = useNavigate();

    const getCategoryColor = (slug: string) => {
        const colors: Record<string, string> = {
            'technical': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'showcase': 'bg-green-500/10 text-green-500 border-green-500/20',
            'help': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            'general': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
            'off-topic': 'bg-muted text-muted-foreground border-border'
        };
        return colors[slug] || colors['general'];
    };

    const getCategoryLabel = (slug: string) => {
        const labels: Record<string, string> = {
            'technical': 'TÉCNICO',
            'showcase': 'SHOWCASE',
            'help': 'AJUDA',
            'general': 'GERAL',
            'off-topic': 'OFF-TOPIC'
        };
        return labels[slug] || 'GERAL';
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;

        if (post.status === 'draft' && currentUserId === post.author_id) {
            navigate(`/community/edit/${post.id}`);
        } else {
            navigate(`/community/post/${post.id}`);
        }
    };

    const getCategoryIcon = (slug: string) => {
        switch (slug) {
            case 'technical': return <div className={`rounded-full bg-blue-500/10 text-blue-500 ${viewMode === 'list' ? 'p-2' : 'p-3'}`}><MessageSquare size={viewMode === 'list' ? 18 : 24} /></div>;
            case 'showcase': return <div className={`rounded-full bg-green-500/10 text-green-500 ${viewMode === 'list' ? 'p-2' : 'p-3'}`}><Star size={viewMode === 'list' ? 18 : 24} /></div>;
            case 'help': return <div className={`rounded-full bg-orange-500/10 text-orange-500 ${viewMode === 'list' ? 'p-2' : 'p-3'}`}><MessageSquare size={viewMode === 'list' ? 18 : 24} /></div>;
            case 'off-topic': return <div className={`rounded-full bg-zinc-500/10 text-zinc-500 ${viewMode === 'list' ? 'p-2' : 'p-3'}`}><MessageSquare size={viewMode === 'list' ? 18 : 24} /></div>;
            default: return <div className={`rounded-full bg-purple-500/10 text-purple-500 ${viewMode === 'list' ? 'p-2' : 'p-3'}`}><MessageSquare size={viewMode === 'list' ? 18 : 24} /></div>;
        }
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

    // Helper to extract first image from content
    const getFirstImage = (htmlContent: string) => {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        const img = div.querySelector('img');
        return img ? img.src : null;
    };

    const firstImage = getFirstImage(post.content);

    // List View
    if (viewMode === 'list') {
        return (
            <div
                onClick={handleCardClick}
                className="group flex flex-row items-stretch bg-card hover:bg-zinc-900 border border-border hover:border-purple-500 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md min-h-[120px]"
            >
                {/* Draft Badge Overlay */}
                {post.status === 'draft' && (
                    <div className="absolute top-2 right-2 z-10">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    </div>
                )}

                {/* Left Side: Image Only (Full Bleed) */}
                {firstImage && (
                    <div className="w-32 bg-muted relative flex-shrink-0 overflow-hidden">
                        <img src={firstImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-2 p-4">
                    <div>
                        <h3 className="font-bold text-base text-foreground group-hover:text-purple-400 transition-colors truncate mb-1">
                            {post.title}
                        </h3>
                        <div
                            className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content.replace(/<img[^>]*>/g, '') }}
                        />
                    </div>

                    {/* Meta Info - Bottom Row */}
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1 truncate">
                        {post.categories && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(post.categories.slug)}`}>
                                {getCategoryLabel(post.categories.slug)}
                            </span>
                        )}

                        {/* Avatar & User */}
                        <div className="flex items-center gap-1.5 ml-1">
                            <div className="w-3.5 h-3.5 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                                {post.profiles?.avatar_url ? (
                                    <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={8} className="text-muted-foreground" />
                                )}
                            </div>
                            <span className="font-bold text-zinc-400">{post.profiles?.username || 'Anon'}</span>
                        </div>

                        <span>•</span>
                        <span>{timeAgo(post.created_at)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <MessageSquare size={12} />
                            <span>{post.comments && post.comments[0] ? post.comments[0].count : 0}</span>
                        </div>
                    </div>
                </div>

                {/* Delete Action (Owner) - Tab Style Top Right */}
                {currentUserId && post.author_id === currentUserId && (
                    <button
                        onClick={(e) => onDeletePost(e, post.id)}
                        className="absolute top-0 right-0 z-30 p-2 bg-red-500 text-white hover:bg-red-600 transition-all shadow-md rounded-bl-xl opacity-0 group-hover:opacity-100 flex items-center justify-center"
                        title="Excluir"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        );
    }

    // Default Grid View (News Style)
    return (
        <div
            onClick={handleCardClick}
            className="group flex flex-col bg-card hover:bg-zinc-900 border border-border hover:border-purple-500 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer relative shadow-sm hover:shadow-md h-full"
        >
            {/* Draft Badge */}
            {post.status === 'draft' && (
                <div className="absolute top-3 left-3 z-20">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 uppercase tracking-wider backdrop-blur-md">
                        Rascunho
                    </span>
                </div>
            )}

            {/* Delete Action (Owner) - Tab Style Top Right */}
            {currentUserId && post.author_id === currentUserId && (
                <button
                    onClick={(e) => onDeletePost(e, post.id)}
                    className="absolute top-0 right-0 z-30 p-2.5 bg-red-500 text-white hover:bg-red-600 transition-all shadow-md rounded-bl-xl opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    title="Excluir"
                >
                    <Trash2 size={16} />
                </button>
            )}

            {/* Hero Image (Top & Full Bleed) */}
            {firstImage ? (
                <div className="w-full h-36 bg-muted flex-shrink-0 relative overflow-hidden">
                    <img src={firstImage} alt="Post cover" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            ) : (
                // Fallback gradient if no image, to maintain "card" feel if desired, or just empty? 
                // User said "occupy space", implying if there IS an image. If not, standard layout.
                // But for consistency let's keep it simple or maybe a small color strip? 
                // For now, no image means content starts higher.
                null
            )}

            {/* Content Body */}
            <div className="p-4 flex flex-col flex-1">

                {/* Author & Category Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                            {post.profiles?.avatar_url ? (
                                <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User size={10} className="text-muted-foreground" />
                            )}
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground/80 truncate max-w-[100px]">
                            {post.profiles?.username || 'Anon'}
                        </span>
                    </div>
                    {post.categories && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(post.categories.slug)}`}>
                            {getCategoryLabel(post.categories.slug)}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <div
                    className="text-[10px] text-muted-foreground line-clamp-3 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{
                        __html: post.content.replace(/<img[^>]*>/g, '')
                    }}
                />

                {/* Footer */}
                <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <span className="text-[10px]">{timeAgo(post.created_at)}</span>

                    <div className="flex items-center gap-1.5 ml-auto">
                        <MessageSquare size={14} className="text-zinc-500" />
                        <span className="text-[10px] font-medium">{post.comments && post.comments[0] ? post.comments[0].count : 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
