import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, MessageSquare, Share2, MoreVertical, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type PostWithDetails = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
};

type CommentWithAuthor = Database['public']['Tables']['comments']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
};

const PostDetail: React.FC = () => {
    const { id } = useParams();
    const [post, setPost] = useState<PostWithDetails | null>(null);
    const [comments, setComments] = useState<CommentWithAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPostDetails();
            fetchComments();
        }
    }, [id]);

    const fetchPostDetails = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles:author_id (*),
                categories:category_id (*)
            `)
            .eq('id', id)
            .single();

        if (error) console.error('Error fetching post:', error);
        if (data) setPost(data as any);
        setLoading(false);
    };

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                profiles:author_id (*)
            `)
            .eq('post_id', id)
            .order('created_at', { ascending: true });

        if (error) console.error('Error fetching comments:', error);
        if (data) setComments(data as any);
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !id) return;
        setSubmitting(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Você precisa estar logado para comentar.");
            setSubmitting(false);
            return;
        }

        const { error } = await supabase.from('comments').insert({
            content: newComment,
            post_id: id,
            author_id: user.id
        });

        if (error) {
            console.error('Error posting comment:', error);
            alert('Erro ao enviar comentário.');
        } else {
            setNewComment('');
            fetchComments(); // Refresh comments
        }
        setSubmitting(false);
    };

    if (loading) return <div className="p-8 text-center text-zinc-500">Carregando discussão...</div>;
    if (!post) return <div className="p-8 text-center text-zinc-500">Post não encontrado.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans">
            <Link to="/community" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors text-sm">
                <ChevronLeft size={16} className="mr-1" /> Voltar para a Comunidade
            </Link>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2 mb-2">
                            {post.categories && (
                                <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/20 font-medium">
                                    {post.categories.name}
                                </span>
                            )}
                        </div>
                        <button className="text-zinc-500 hover:text-white">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-3">{post.title}</h1>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                            {post.profiles?.avatar_url ? (
                                <img src={post.profiles.avatar_url} alt={post.profiles.username || ''} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-zinc-500 font-bold">{post.profiles?.username?.[0]?.toUpperCase() || '?'}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-zinc-200 text-sm font-medium">{post.profiles?.username || 'Anônimo'}</p>
                            <p className="text-zinc-500 text-xs">{new Date(post.created_at).toLocaleDateString()} às {new Date(post.created_at).toLocaleTimeString().slice(0, 5)}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-zinc-950/30 border-t border-zinc-800 flex gap-4">
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-green-400 px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                        <ThumbsUp size={18} /> <span className="text-sm">0</span>
                    </button>
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                        <MessageSquare size={18} /> <span className="text-sm">{comments.length} comentários</span>
                    </button>
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors ml-auto">
                        <Share2 size={18} /> <span className="text-sm">Compartilhar</span>
                    </button>
                </div>
            </div>

            {/* Comments Area */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Respostas ({comments.length})</h3>
                <div className="space-y-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-500 font-bold text-xs bg-zinc-800 w-6 h-6 flex items-center justify-center rounded-full">
                                        {comment.profiles?.username?.[0]?.toUpperCase()}
                                    </span>
                                    <span className="font-bold text-zinc-200 text-sm">{comment.profiles?.username}</span>
                                </div>
                                <span className="text-zinc-600 text-xs">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">{comment.content}</p>
                            <div className="flex items-center gap-4">
                                <button className="text-zinc-500 hover:text-zinc-300 text-xs font-medium flex items-center gap-1">
                                    <ThumbsUp size={12} /> Útil
                                </button>
                                <button className="text-zinc-500 hover:text-zinc-300 text-xs font-medium">
                                    Responder
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-3 sticky bottom-6 shadow-2xl">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0"></div>
                <div className="flex-1">
                    <textarea
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-zinc-600 resize-none h-20"
                        placeholder="Escreva uma resposta..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end pt-2 border-t border-zinc-800 mt-2">
                        <button
                            onClick={handleSubmitComment}
                            disabled={submitting || !newComment.trim()}
                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-1.5 px-4 rounded transition-colors flex items-center gap-2"
                        >
                            <Send size={14} />
                            {submitting ? 'Enviando...' : 'Responder'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
