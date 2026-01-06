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

    if (viewMode === 'list') {
        return (
            <div
                onClick={handleCardClick}
                className="group flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
                {/* Draft Badge Overlay */}
                {post.status === 'draft' && (
                    <div className="absolute top-2 right-2 z-10">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    </div>
                )}

                {/* Icon */}
                <div className="flex-shrink-0">
                    {getCategoryIcon(post.categories?.slug || 'general')}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto] gap-4 items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white truncate">
                                {post.title}
                            </h3>
                            {post.categories && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(post.categories.slug)}`}>
                                    {getCategoryLabel(post.categories.slug)}
                                </span>
                            )}
                        </div>
                        <div
                            className="text-[10px] text-muted-foreground line-clamp-1 [&>p]:inline [&>p]:m-0"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-zinc-800">
                                {post.profiles?.avatar_url ? (
                                    <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={10} className="text-muted-foreground" />
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[80px]">
                                {post.profiles?.username || 'Anon'}
                            </span>
                        </div>

                        <span className="text-[10px] text-zinc-600 w-16 text-right">
                            {timeAgo(post.created_at)}
                        </span>

                        {/* Comments Count */}
                        <div className="flex items-center gap-1.5 text-zinc-500 w-8 justify-end">
                            <MessageSquare size={14} />
                            <span className="text-[10px] font-bold">
                                {post.comments && post.comments[0] ? post.comments[0].count : 0}
                            </span>
                        </div>

                        {/* Actions */}
                        {currentUserId && post.author_id === currentUserId && (
                            <button
                                onClick={(e) => onDeletePost(e, post.id)}
                                className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                title="Excluir"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Default Grid View
    return (
        <div
            onClick={handleCardClick}
            className="group flex flex-col bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all duration-300 cursor-pointer h-full relative overflow-hidden"
        >
            {/* Draft Badge Overlay - Moved to avoid collision with delete button */}
            {post.status === 'draft' && (
                <div className="absolute top-4 right-12 z-10">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 uppercase tracking-wider">
                        Rascunho
                    </span>
                </div>
            )}

            {/* Delete Button (Only visible on hover if owner) - Moved to top right */}
            {currentUserId && post.author_id === currentUserId && (
                <button
                    onClick={(e) => onDeletePost(e, post.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 z-20"
                    title="Excluir"
                >
                    <Trash2 size={16} />
                </button>
            )}

            <div className="flex items-start gap-4 mb-3">
                {/* Big Category Icon */}
                <div className="flex-shrink-0">
                    {getCategoryIcon(post.categories?.slug || 'general')}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Category Badge */}
                    <div className="mb-2">
                        {post.categories && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(post.categories.slug)}`}>
                                {getCategoryLabel(post.categories.slug)}
                            </span>
                        )}
                    </div>
                    {/* Title */}
                    <h3 className="font-bold text-base text-zinc-100 group-hover:text-white leading-tight mb-1 line-clamp-2">
                        {post.title}
                    </h3>
                </div>
            </div>

            {/* Description */}
            <div
                className="text-xs text-muted-foreground line-clamp-3 leading-relaxed [&>p]:m-0 [&>p]:inline"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Footer: Author & Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50 mt-auto">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-zinc-800">
                        {post.profiles?.avatar_url ? (
                            <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <User size={12} className="text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[100px]">
                            {post.profiles?.username || 'Anon'}
                        </span>
                        <span className="text-[10px] text-zinc-600">
                            {timeAgo(post.created_at)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {post.status === 'published' && (
                        <div className="flex items-center gap-1.5 text-zinc-500">
                            <MessageSquare size={14} />
                            <span className="text-[10px] font-bold">
                                {post.comments && post.comments[0] ? post.comments[0].count : 0}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
