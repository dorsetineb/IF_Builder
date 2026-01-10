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

    showContent?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, isFavorite, currentUserId, onToggleFavorite, viewMode = 'grid', showContent = true }) => {
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



    // List View
    if (viewMode === 'list') {
        return (
            <div
                onClick={handleCardClick}
                className="group flex flex-row items-stretch bg-card hover:bg-zinc-900 border border-border hover:border-purple-500 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md min-h-[90px]"
            >
                {/* Draft Badge Overlay */}
                {post.status === 'draft' && (
                    <div className="absolute top-2 right-2 z-10">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 uppercase tracking-wider backdrop-blur-md">
                            Rascunho
                        </span>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5 p-3 justify-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1 overflow-hidden">
                            {post.categories && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(post.categories.slug)}`}>
                                    {post.categories.name}
                                </span>
                            )}
                        </div>

                        <h3 className="font-bold text-sm text-foreground group-hover:text-purple-400 transition-colors truncate mb-1">
                            {post.title}
                        </h3>
                        {showContent && (
                            <div
                                className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '') }}
                            />
                        )}
                    </div>

                    {/* Meta Info - Middle Row */}
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground truncate">
                        {/* Avatar & User */}
                        <div
                            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (post.profiles?.id) navigate(`/community/author/${post.profiles.id}`);
                            }}
                        >
                            <div className="w-3.5 h-3.5 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                                {post.profiles?.avatar_url ? (
                                    <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={8} className="text-muted-foreground" />
                                )}
                            </div>
                            <span className="font-bold text-zinc-400 hover:text-purple-400 transition-colors">{post.profiles?.username || 'Anon'}</span>
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
            </div>
        );
    }

    // Default Grid View (Text Only)
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

            {/* Content Body */}
            <div className="p-4 flex flex-col flex-1">

                {/* Category & Tags Header */}
                <div className="flex items-center gap-2 mb-2 overflow-hidden flex-wrap">
                    {post.categories && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(post.categories.slug)}`}>
                            {post.categories.name}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <div
                    className="text-[10px] text-muted-foreground line-clamp-4 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{
                        __html: post.content.replace(/<[^>]*>/g, '')
                    }}
                />

                {/* Footer: User • Time • Comments */}
                <div className="mt-auto flex items-center gap-2 text-[10px] text-muted-foreground border-t border-border/50 pt-3">
                    {/* Author */}
                    <div
                        className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (post.profiles?.id) navigate(`/community/author/${post.profiles.id}`);
                        }}
                    >
                        <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                            {post.profiles?.avatar_url ? (
                                <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User size={10} className="text-muted-foreground" />
                            )}
                        </div>
                        <span className="font-bold text-muted-foreground/80 hover:text-purple-400 transition-colors max-w-[80px] truncate">
                            {post.profiles?.username || 'Anon'}
                        </span>
                    </div>

                    <span>•</span>
                    <span>{timeAgo(post.created_at)}</span>
                    <span>•</span>

                    <div className="flex items-center gap-1.5">
                        <MessageSquare size={12} className="text-zinc-500" />
                        <span className="font-medium">{post.comments && post.comments[0] ? post.comments[0].count : 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
