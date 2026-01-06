import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, Share2, Send, ThumbsDown, CornerDownRight, User, Star, Trash2, AlertCircle, List, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { useToast } from '../components/ToastContext';
import ImageModal from '../components/ImageModal';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

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

// Reusable Rich Text Editor Component
const RichEditor = ({
    value,
    onChange,
    placeholder,
    minHeight = "100px",
    autoFocus = false,
    onSubmit,
    submitting
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    minHeight?: string;
    autoFocus?: boolean;
    onSubmit: () => void;
    submitting: boolean;
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            const quill = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder,
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'code-block'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image']
                    ]
                }
            });

            quill.on('text-change', () => {
                const html = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML;
                onChange(html);
            });

            quillRef.current = quill;
            if (autoFocus) quill.focus();
        }
    }, []);

    // Sync external value changes (reset)
    useEffect(() => {
        if (quillRef.current && value === '' && quillRef.current.root.innerHTML !== '<p><br></p>') {
            quillRef.current.root.innerHTML = '';
        }
    }, [value]);

    return (
        <div className="flex flex-col border border-border rounded-lg bg-card overflow-hidden focus-within:ring-1 focus-within:ring-purple-500/50 transition-all text-sm">
            <div ref={editorRef} style={{ minHeight }} className="text-foreground text-sm" />
            <div className="bg-muted/30 border-t border-border p-2 flex justify-end">
                <button
                    onClick={onSubmit}
                    disabled={submitting || !value.trim()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    <Send size={12} className={submitting ? "animate-pulse" : ""} />
                    Enviar
                </button>
            </div>
            <style>{`
                .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid var(--border); background: var(--muted); padding: 4px; }
                .ql-container.ql-snow { border: none; }
                .ql-editor { padding: 0.75rem; font-family: inherit; font-size: 0.8rem; }
                .ql-snow .ql-stroke { stroke: var(--muted-foreground); }
                .ql-snow .ql-fill { fill: var(--muted-foreground); }
                .ql-snow .ql-picker { color: var(--muted-foreground); }
                .ql-toolbar button:hover .ql-stroke { stroke: var(--foreground); }
            `}</style>
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
    const [favoritedBy, setFavoritedBy] = useState<any[]>([]); // Users who favorited

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'post' | 'comment', id: string } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
            setSelectedImage((target as HTMLImageElement).src);
        }
    };

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

        await Promise.all([fetchPostDetails(), fetchComments(), fetchReactions(user), fetchFavoriteStatus(user), fetchFavoritedUsers()]);
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

    const fetchFavoritedUsers = async () => {
        if (!id) return;
        const { data } = await supabase
            .from('post_favorites')
            .select('profiles(*)')
            .eq('post_id', id)
            .limit(5);

        if (data) {
            setFavoritedBy(data.map((f: any) => f.profiles).filter(Boolean));
        }
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
            setIsFavorite(false);
            setFavoritedBy(prev => prev.filter(p => p.id !== currentUser.id));
            toast('Removido', 'Postagem removida dos favoritos.', 'info');
        } else {
            await supabase.from('post_favorites').insert({ post_id: id, user_id: currentUser.id });
            setIsFavorite(true);
            if (currentProfile) setFavoritedBy(prev => [...prev, currentProfile]);
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

    const handleSubmitComment = async (content: string = newComment, parentId: string | null = replyingTo) => {
        if (!content.trim() || !id) return;
        setSubmitting(true);
        if (!currentUser) {
            toast('Login necessário', "Você precisa estar logado para responder.", 'error');
            setSubmitting(false);
            return;
        }

        const { error } = await supabase.from('comments').insert({
            content: content,
            post_id: id,
            author_id: currentUser.id,
            parent_id: parentId
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

    // Extracted CommentItem to prevent re-renders losing focus
    interface CommentItemProps {
        comment: CommentWithAuthor;
        depth?: number;
        currentUser: any;
        replyingTo: string | null;
        setReplyingTo: (id: string | null) => void;
        submitting: boolean;
        handleSubmitComment: (content?: string, parentId?: string | null) => void;
        confirmDelete: (type: 'post' | 'comment', id: string) => void;
        postStatus?: string;
        onImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    }

    const CommentItem: React.FC<CommentItemProps> = ({
        comment,
        depth = 0,
        currentUser,
        replyingTo,
        setReplyingTo,
        submitting,
        handleSubmitComment,
        confirmDelete,
        postStatus,
        onImageClick
    }) => {
        const [localComment, setLocalComment] = useState('');

        // Reset local comment when closing/opening
        useEffect(() => {
            if (replyingTo !== comment.id) setLocalComment('');
        }, [replyingTo, comment.id]);

        return (
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

                <div
                    className="text-muted-foreground text-xs mb-2 pl-1 leading-relaxed prose prose-invert max-w-none [&_img]:max-w-full [&_img]:rounded-lg [&_img]:mt-2 [&_img]:cursor-pointer [&_img]:hover:opacity-90 transition-opacity"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                    onClick={onImageClick}
                />

                <div className="flex items-center gap-3 pl-1">
                    {postStatus === 'published' ? (
                        <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className={`font-medium flex items-center gap-1 transition-all text-xs ${replyingTo === comment.id
                                ? 'text-muted-foreground hover:text-red-500 opacity-100'
                                : 'text-muted-foreground hover:text-purple-400 opacity-0 group-hover:opacity-100'
                                }`}
                        >
                            {replyingTo === comment.id ? <X size={14} /> : <CornerDownRight size={14} />}
                            {replyingTo === comment.id ? 'Cancelar' : 'Responder'}
                        </button>
                    ) : (
                        <span className="text-[10px] text-muted-foreground/50 cursor-not-allowed" title="Tópico não publicado">Responder</span>
                    )}
                </div>

                {/* Inline Editor for Replies */}
                {replyingTo === comment.id && (
                    <div className="mt-3 ml-1 animate-in slide-in-from-top-2 duration-200">
                        <RichEditor
                            value={localComment}
                            onChange={setLocalComment}
                            placeholder={`Respondendo a ${comment.profiles?.username || 'usuário'}...`}
                            minHeight="80px"
                            autoFocus
                            onSubmit={() => handleSubmitComment(localComment, comment.id)}
                            submitting={submitting}
                        />

                    </div>
                )}

                {/* Nested Comments */}
                {comment.children && comment.children.length > 0 && (
                    <div className="mt-1 space-y-1">
                        {comment.children.map(child => (
                            <CommentItem
                                key={child.id}
                                comment={child}
                                depth={depth + 1}
                                currentUser={currentUser}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                submitting={submitting}
                                handleSubmitComment={handleSubmitComment}
                                confirmDelete={confirmDelete}
                                postStatus={postStatus}
                                onImageClick={onImageClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center text-zinc-500 text-xs">Carregando discussão...</div>;
    if (!post) return <div className="p-8 text-center text-zinc-500 text-xs">Post não encontrado.</div>;

    // Extract First Image for Hero
    const firstImage = post?.content.match(/<img[^>]+src="([^">]+)"/) ? post?.content.match(/<img[^>]+src="([^">]+)"/)?.[1] : null;

    if (loading) return <div className="p-8 text-center text-zinc-500 text-xs">Carregando discussão...</div>;
    if (!post) return <div className="p-8 text-center text-zinc-500 text-xs">Post não encontrado.</div>;

    return (
        <div className="min-h-full bg-background font-sans pb-32">
            {/* Standard Header with Breadcrumbs */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-20 shrink-0">
                <div className="flex flex-col justify-center h-full">
                    <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                        Fórum
                        <span className="text-muted-foreground/50">/</span>
                        <span className="text-sm font-medium text-muted-foreground">{post.categories?.name || 'Tópico'}</span>
                    </h1>
                </div>
            </div>

            <div className="p-8 max-w-[1600px] mx-auto">

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
                                        <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight">{post.title}</h1>

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
                                <div
                                    className="prose prose-invert prose-purple max-w-none text-sm text-foreground/90 leading-relaxed font-normal [&_img]:max-w-full [&_img]:rounded-lg [&_img]:mt-2 [&_img]:cursor-pointer [&_img]:hover:opacity-90 transition-opacity"
                                    dangerouslySetInnerHTML={{ __html: post.content.replace(/<img[^>]*>/g, '') }}
                                    onClick={handleImageClick}
                                />

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
                                        onClick={() => handleReaction('like')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${userReaction === 'like' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <ThumbsUp size={14} className={userReaction === 'like' ? 'fill-current' : ''} />
                                        <span className="text-[10px] font-bold">{reactionCounts.like}</span>
                                    </button>

                                    <button
                                        onClick={() => handleReaction('dislike')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${userReaction === 'dislike' ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <ThumbsDown size={14} className={userReaction === 'dislike' ? 'fill-current' : ''} />
                                        <span className="text-[10px] font-bold">{reactionCounts.dislike}</span>
                                    </button>

                                    <button
                                        onClick={() => handleReaction('super_like')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${userReaction === 'super_like' ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <div className="flex relative items-center justify-center w-5 h-4">
                                            <ThumbsUp size={14} className={`absolute left-0 ${userReaction === 'super_like' ? 'fill-current' : ''}`} />
                                            <ThumbsUp size={14} className={`absolute left-1.5 -top-1 rotate-12 ${userReaction === 'super_like' ? 'fill-current' : ''} bg-background rounded-full`} />
                                        </div>
                                        <span className="text-[10px] font-bold ml-1">{reactionCounts.super_like}</span>
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
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        currentUser={currentUser}
                                        replyingTo={replyingTo}
                                        setReplyingTo={setReplyingTo}
                                        submitting={submitting}
                                        handleSubmitComment={handleSubmitComment}
                                        confirmDelete={confirmDelete}
                                        postStatus={post?.status}
                                        onImageClick={handleImageClick}
                                    />
                                ))}
                            </div>

                            {/* Main Reply Editor (Bottom of Page) */}
                            {post.status === 'published' && !replyingTo && (
                                <div className="mt-8 pt-6 border-t border-border">
                                    <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Deixe sua resposta</h3>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex-shrink-0 overflow-hidden">
                                            {currentUser?.user_metadata?.avatar_url || currentProfile?.avatar_url ? (
                                                <img src={currentUser?.user_metadata?.avatar_url || currentProfile?.avatar_url} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={16} className="text-muted-foreground m-auto mt-1" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <RichEditor
                                                value={newComment}
                                                onChange={setNewComment}
                                                placeholder="Escreva sua resposta para este tópico..."
                                                minHeight="100px"
                                                onSubmit={handleSubmitComment}
                                                submitting={submitting}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Widgets */}
                    <div className="space-y-6">
                        {/* Favorited By Widget */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-bold text-foreground mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                                <div className="bg-yellow-500/10 p-1.5 rounded-md text-yellow-500"><Star size={14} /></div>
                                Quem Favoritou
                            </h3>
                            {favoritedBy.length > 0 ? (
                                <div className="space-y-3">
                                    {favoritedBy.map((profile, i) => (
                                        <div key={i} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-muted overflow-hidden border border-border">
                                                    {profile.avatar_url ? (
                                                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={12} className="text-muted-foreground m-auto mt-1" />
                                                    )}
                                                </div>
                                                <span className="text-xs font-bold text-foreground group-hover:text-purple-400 transition-colors">{profile.username}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[10px] text-muted-foreground">Ninguém favoritou ainda.</p>
                            )}
                        </div>

                        {/* Changelog Widget */}
                        {/* Changelog Removed */}{/* Space Holder */}
                    </div>
                </div>
            </div>

            {/* Expandable Inline Reply Editor */}
            {/* Floating Editor Removed */}{/* Space Holder */}

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

            <ImageModal
                imageUrl={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </div>
    );
};

export default PostDetail;
