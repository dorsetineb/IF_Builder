import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, Share2, Send, ThumbsDown, CornerDownRight, User, Star, Trash2, AlertCircle, List } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { useToast } from '../components/ToastContext';

type PostWithDetails = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
};

type CommentWithAuthor = Database['public']['Tables']['comments']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    children?: CommentWithAuthor[];
};

type ReactionType = 'like' | 'super_like' | 'dislike';

// Custom Modal Component
const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-red-500">
                        <div className="bg-red-500/10 p-2 rounded-full">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{message}</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PostDetail: React.FC = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const [post, setPost] = useState<PostWithDetails | null>(null);
    const [comments, setComments] = useState<CommentWithAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
    const [reactionCounts, setReactionCounts] = useState<Record<ReactionType, number>>({ like: 0, super_like: 0, dislike: 0 });
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentProfile, setCurrentProfile] = useState<any>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'post' | 'comment', id: string } | null>(null);

    useEffect(() => {
        if (id) {
            init();
        }
    }, [id]);

    const init = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setCurrentProfile(profile);
        }

        await Promise.all([fetchPostDetails(), fetchComments(), fetchReactions(user), fetchFavoriteStatus(user)]);
        setLoading(false);
    };

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
        if (data) {
            const commentMap: Record<string, CommentWithAuthor> = {};
            const roots: CommentWithAuthor[] = [];
            data.forEach((c: any) => {
                c.children = [];
                commentMap[c.id] = c;
            });
            data.forEach((c: any) => {
                if (c.parent_id && commentMap[c.parent_id]) {
                    commentMap[c.parent_id].children?.push(c);
                } else {
                    roots.push(c);
                }
            });
            setComments(roots);
        }
    };

    const fetchReactions = async (user: any) => {
        const { data: counts } = await supabase.from('post_reactions').select('type').eq('post_id', id);
        if (counts) {
            const newCounts = { like: 0, super_like: 0, dislike: 0 };
            counts.forEach((r: any) => {
                if (r.type in newCounts) newCounts[r.type as ReactionType]++;
            });
            setReactionCounts(newCounts);
        }

        if (user) {
            const { data: myReaction } = await supabase
                .from('post_reactions')
                .select('type')
                .eq('post_id', id)
                .eq('user_id', user.id)
                .maybeSingle();
            if (myReaction) setUserReaction(myReaction.type as ReactionType);
            else setUserReaction(null);
        }
    };

    const fetchFavoriteStatus = async (user: any) => {
        if (!user || !id) return;
        const { data } = await supabase.from('post_favorites').select('id').eq('post_id', id).eq('user_id', user.id).maybeSingle();
        setIsFavorite(!!data);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast('Link Copiado!', 'O link da postagem foi copiado para a área de transferência.', 'success');
        } catch (err) {
            toast('Erro', 'Não foi possível copiar o link.', 'error');
        }
    };

    const handleToggleFavorite = async () => {
        if (!currentUser || !id) return;
        if (isFavorite) {
            await supabase.from('post_favorites').delete().eq('post_id', id).eq('user_id', currentUser.id);
            setIsFavorite(false);
            toast('Removido', 'Postagem removida dos favoritos.', 'info');
        } else {
            await supabase.from('post_favorites').insert({ post_id: id, user_id: currentUser.id });
            setIsFavorite(true);
            toast('Salvo', 'Postagem adicionada aos favoritos!', 'success');
        }
    };

    const handleReaction = async (type: ReactionType) => {
        if (!currentUser) {
            toast('Login necessário', 'Você precisa estar logado para reagir.', 'error');
            return;
        }
        const oldReaction = userReaction;
        if (oldReaction === type) {
            setUserReaction(null);
            setReactionCounts(prev => ({ ...prev, [type]: prev[type] - 1 }));
            await supabase.from('post_reactions').delete().eq('post_id', id).eq('user_id', currentUser.id);
        } else {
            setUserReaction(type);
            setReactionCounts(prev => ({
                ...prev,
                [type]: prev[type] + 1,
                ...(oldReaction ? { [oldReaction]: prev[oldReaction] - 1 } : {})
            }));
            await supabase.from('post_reactions').upsert({
                post_id: id!,
                user_id: currentUser.id,
                type: type
            }, { onConflict: 'post_id,user_id' });
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !id) return;
        setSubmitting(true);
        if (!currentUser) {
            toast('Login necessário', "Você precisa estar logado para responder.", 'error');
            setSubmitting(false);
            return;
        }

        const { error } = await supabase.from('comments').insert({
            content: newComment,
            post_id: id,
            author_id: currentUser.id,
            parent_id: replyingTo
        });

        if (error) {
            toast('Erro', 'Não foi possível enviar a resposta.', 'error');
        } else {
            setNewComment('');
            setReplyingTo(null);
            fetchComments();
            toast('Sucesso', 'Resposta enviada!', 'success');
        }
        setSubmitting(false);
    };

    const confirmDelete = (type: 'post' | 'comment', itemId: string) => {
        setItemToDelete({ type, id: itemId });
        setShowDeleteModal(true);
    };

    const executeDelete = async () => {
        if (!itemToDelete) return;

        setShowDeleteModal(false);
        const { type, id: itemId } = itemToDelete;

        if (type === 'post') {
            const { error } = await supabase.from('posts').delete().eq('id', itemId);
            if (!error) {
                toast('Sucesso', 'Tópico excluído.', 'success');
                window.location.href = '/community';
            } else {
                toast('Erro', 'Erro ao excluir o tópico.', 'error');
            }
        } else {
            const { error } = await supabase.from('comments').delete().eq('id', itemId);
            if (!error) {
                fetchComments();
                toast('Sucesso', 'Resposta excluída.', 'success');
            } else {
                toast('Erro', 'Erro ao excluir resposta.', 'error');
            }
        }
        setItemToDelete(null);
    };

    const handlePublish = async () => {
        if (!confirm('Deseja publicar este tópico agora? Ele ficará visível para toda a comunidade.')) return;

        const { error } = await supabase
            .from('posts')
            .update({ status: 'published' })
            .eq('id', id);

        if (!error) {
            setPost(prev => prev ? { ...prev, status: 'published' } : null);
            toast('Sucesso', 'Tópico publicado com sucesso!', 'success');
        } else {
            toast('Erro', 'Erro ao publicar tópico.', 'error');
        }
    };

    const CommentItem: React.FC<{ comment: CommentWithAuthor, depth?: number }> = ({ comment, depth = 0 }) => (
        <div className={`group relative ${depth > 0 ? 'ml-0 mt-2 pl-4 border-l border-border/40 hover:border-purple-500/50 transition-colors' : 'bg-card/30 border border-border/50 p-3 rounded-lg hover:border-purple-500/50 transition-colors'}`}>
            <div className="flex justify-between items-start mb-1.5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted border border-border overflow-hidden flex-shrink-0">
                        {comment.profiles?.avatar_url ? (
                            <img src={comment.profiles.avatar_url} alt={comment.profiles.username || ''} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <User size={12} />
                            </div>
                        )}
                    </div>
                    <div>
                        <span className="font-bold text-card-foreground text-[11px] block">{comment.profiles?.username}</span>
                        <span className="text-muted-foreground text-[9px]">{new Date(comment.created_at).toLocaleDateString()} às {new Date(comment.created_at).toLocaleTimeString().slice(0, 5)}</span>
                    </div>
                </div>
                {currentUser && currentUser.id === comment.author_id && (
                    <button
                        onClick={() => confirmDelete('comment', comment.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-red-500 hover:text-white transition-all p-1 rounded"
                        title="Excluir resposta"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>

            <p className="text-muted-foreground text-xs mb-2 pl-1 leading-relaxed">{comment.content}</p>

            <div className="flex items-center gap-3 pl-1">
                {post?.status === 'published' ? (
                    <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className={`text-muted-foreground hover:text-purple-400 text-[10px] font-medium flex items-center gap-1 transition-all ${replyingTo === comment.id ? 'text-purple-400 opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                    >
                        <CornerDownRight size={10} /> {replyingTo === comment.id ? 'Cancel' : 'Responder'}
                    </button>
                ) : (
                    <span className="text-[10px] text-muted-foreground/50 cursor-not-allowed" title="Tópico não publicado">Responder</span>
                )}
            </div>

            {comment.children && comment.children.length > 0 && (
                <div className="mt-1 space-y-1">
                    {comment.children.map(child => <CommentItem key={child.id} comment={child} depth={depth + 1} />)}
                </div>
            )}
        </div>
    );

    if (loading) return <div className="p-8 text-center text-zinc-500 text-xs">Carregando discussão...</div>;
    if (!post) return <div className="p-8 text-center text-zinc-500 text-xs">Post não encontrado.</div>;

    // Extract First Image for Hero
    const firstImage = post?.content.match(/<img[^>]+src="([^">]+)"/) ? post?.content.match(/<img[^>]+src="([^">]+)"/)?.[1] : null;

    if (loading) return <div className="p-8 text-center text-zinc-500 text-xs">Carregando discussão...</div>;
    if (!post) return <div className="p-8 text-center text-zinc-500 text-xs">Post não encontrado.</div>;

    return (
        <div className="p-6 max-w-[1600px] mx-auto font-sans pb-32">
            <Link to="/community" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors text-[10px] uppercase font-bold tracking-wider">
                <ChevronLeft size={12} className="mr-1" /> Voltar ao Fórum
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Thread Content */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:border-purple-500/20 transition-all group/post relative">
                        {/* Draft Badge in Header if Draft */}
                        {post.status === 'draft' && (
                            <div className="absolute top-0 left-0 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-3 py-1 rounded-br-lg border-r border-b border-yellow-500/20 z-10">
                                RASCUNHO - NÃO PUBLICADO
                            </div>
                        )}

                        {/* Hero Image Section */}
                        {firstImage && (
                            <div className="w-full aspect-video md:aspect-[3/1] bg-muted relative">
                                <img src={firstImage} alt="Cover" className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />
                            </div>
                        )}

                        <div className="p-8 relative">
                            {/* Header Info */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="space-y-4">
                                    {post.categories && (
                                        <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                            {post.categories.name}
                                        </span>
                                    )}
                                    <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">{post.title}</h1>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                                            {post.profiles?.avatar_url ? (
                                                <img src={post.profiles.avatar_url} alt={post.profiles.username || ''} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={20} className="text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-foreground text-sm font-bold">{post.profiles?.username || 'Anônimo'}</p>
                                            <p className="text-muted-foreground text-[10px]">{new Date(post.created_at).toLocaleDateString()} às {new Date(post.created_at).toLocaleTimeString().slice(0, 5)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {/* Publish Button for Author */}
                                    {post.status === 'draft' && currentUser && currentUser.id === post.author_id && (
                                        <button
                                            onClick={handlePublish}
                                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-green-900/20 flex items-center gap-2"
                                        >
                                            <Send size={12} /> Publicar
                                        </button>
                                    )}
                                    <button
                                        onClick={handleShare}
                                        className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
                                        title="Copiar Link"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`p-2 rounded-lg transition-colors hover:bg-muted ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`}
                                        title="Favoritar"
                                    >
                                        <Star size={18} className={isFavorite ? 'fill-current' : ''} />
                                    </button>
                                    {currentUser && currentUser.id === post.author_id && (
                                        <button
                                            onClick={() => confirmDelete('post', post.id)}
                                            className="text-muted-foreground hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="prose prose-invert prose-purple max-w-none text-sm text-foreground/90 leading-relaxed font-normal">
                                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/<img[^>]*>/g, '') }} />
                            </div>

                            {/* Reactions Footer */}
                            <div className="flex items-center gap-4 pt-8 mt-8 border-t border-border">
                                <button
                                    onClick={() => handleReaction('like')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${userReaction === 'like' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                >
                                    <ThumbsUp size={16} className={userReaction === 'like' ? 'fill-current' : ''} />
                                    <span className="text-xs font-bold">{reactionCounts.like}</span>
                                </button>

                                <button
                                    onClick={() => handleReaction('super_like')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${userReaction === 'super_like' ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                >
                                    <div className="flex relative mr-1">
                                        <ThumbsUp size={16} className={userReaction === 'super_like' ? 'fill-current' : ''} />
                                        <ThumbsUp size={16} className={`absolute top-[-2px] -right-1.5 rotate-12 ${userReaction === 'super_like' ? 'fill-current' : ''}`} />
                                    </div>
                                    <span className="text-xs font-bold ml-1">{reactionCounts.super_like}</span>
                                </button>

                                <span className="text-xs text-muted-foreground ml-auto">{post.comments ? post.comments.length : 0} visualizações</span>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                            Respostas <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">{comments.length}</span>
                        </h3>

                        <div className="space-y-4">
                            {comments.map(comment => (
                                <CommentItem key={comment.id} comment={comment} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* Top Creators Widget */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold text-foreground mb-6 text-xs uppercase tracking-wider flex items-center gap-2">
                            <div className="bg-yellow-500/10 p-1.5 rounded-md text-yellow-500"><Star size={14} /></div>
                            Top Criadores
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: "PW54", points: 1240, rank: 1 },
                                { name: "AdamJohn", points: 980, rank: 2 },
                                { name: "Karolien", points: 850, rank: 3 }
                            ].map((author, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-bold w-4 ${i === 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>{author.rank}</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-yellow-500 text-yellow-950' : 'bg-muted text-muted-foreground'}`}>
                                            {author.name[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground group-hover:text-purple-400 transition-colors">{author.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{author.points} pts</span>
                                        </div>
                                    </div>
                                    {i === 0 && <Star size={12} className="text-yellow-500 fill-current" />}
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 text-center text-[10px] font-bold text-purple-500 hover:text-purple-400 uppercase tracking-wider transition-colors">
                            Ver ranking completo →
                        </button>
                    </div>

                    {/* Changelog Widget */}
                    <div className="bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 rounded-xl p-6">
                        <h3 className="font-bold text-foreground mb-6 text-xs uppercase tracking-wider flex items-center gap-2">
                            <div className="bg-purple-500/10 p-1.5 rounded-md text-purple-500"><CornerDownRight size={14} /></div>
                            Changelog
                        </h3>
                        <div className="space-y-6 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                            {[
                                { ver: "v2.4.0", date: "Ontem", desc: "Novo sistema de variáveis globais e correção de bugs no player." },
                                { ver: "v2.3.5", date: "10 Jan", desc: "Integração nativa com Google Sheets." }
                            ].map((log, i) => (
                                <div key={i} className="pl-6 relative">
                                    <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-background border-2 border-purple-500 z-10" />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-muted-foreground">{log.ver}</span>
                                            <span className="text-[10px] font-bold text-foreground">• {log.date}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                            {log.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Inline Reply Editor */}
            {post.status === 'published' && (
                <div className="fixed bottom-0 left-[80px] md:left-64 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border z-30 transition-all duration-300">
                    <div className="max-w-3xl mx-auto w-full">
                        {replyingTo && (
                            <div className="flex justify-between items-center text-[10px] text-purple-400 mb-2 px-1 font-bold uppercase tracking-wider">
                                <span>Respondendo a um comentário...</span>
                                <button onClick={() => setReplyingTo(null)} className="hover:text-foreground transition-colors">Cancelar</button>
                            </div>
                        )}

                        <div className="relative group bg-card border border-border focus-within:border-purple-500/50 rounded-2xl shadow-2xl focus-within:shadow-purple-900/20 transition-all overflow-hidden flex flex-col">
                            {/* Toolbar (Visual Only for now) */}
                            <div className="flex items-center gap-1 p-2 border-b border-border/50 bg-muted/30 text-muted-foreground">
                                <button className="p-1.5 hover:bg-muted hover:text-foreground rounded transition-colors" title="Negrito"><span className="font-bold text-xs">B</span></button>
                                <button className="p-1.5 hover:bg-muted hover:text-foreground rounded transition-colors" title="Itálico"><span className="italic text-xs">I</span></button>
                                <button className="p-1.5 hover:bg-muted hover:text-foreground rounded transition-colors" title="Link"><Share2 size={12} /></button>
                                <div className="w-px h-4 bg-border mx-1" />
                                <button className="p-1.5 hover:bg-muted hover:text-foreground rounded transition-colors" title="Código"><span className="font-mono text-xs">{'<>'}</span></button>
                                <button className="p-1.5 hover:bg-muted hover:text-foreground rounded transition-colors" title="Lista"><List size={12} /></button>
                            </div>

                            <div className="flex items-end p-2 gap-2">
                                <textarea
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder-muted-foreground resize-none h-12 min-h-[48px] max-h-32 py-3 px-3 text-sm"
                                    placeholder={replyingTo ? "Escreva sua resposta..." : "Escreva uma resposta para este tópico..."}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                ></textarea>

                                <button
                                    onClick={handleSubmitComment}
                                    disabled={submitting || !newComment.trim()}
                                    className="mb-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white p-2.5 rounded-xl transition-all shadow-lg hover:shadow-purple-900/40 hover:-translate-y-0.5"
                                >
                                    <Send size={16} className={submitting ? "animate-pulse" : ""} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal and others... */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={executeDelete}
                title={itemToDelete?.type === 'post' ? 'Excluir Tópico' : 'Excluir Resposta'}
                message={itemToDelete?.type === 'post'
                    ? 'Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita.'
                    : 'Tem certeza que deseja excluir esta resposta? Esta ação não pode ser desfeita.'}
            />
        </div>
    );
};

export default PostDetail;
