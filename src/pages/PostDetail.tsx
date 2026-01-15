import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ChevronLeft, ThumbsUp, Share2, Send, ThumbsDown, CornerDownRight, User, Bookmark, Trash2, AlertCircle, List, X, Pencil, MessageSquare, Heart, LogOut } from 'lucide-react';

// ... (skip down to usages)

// In the sidebar widget (approx line 1050 based on context search, I'll use multi_replace to be precise or search first)

// Actually, I should use Search/Replace effectively.
// Let's do a replace for the Import first, then the usages.

import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { useToast } from '../components/ToastContext';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import RichEditor from '../components/RichEditor';

type PostWithDetails = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'] & {
        group?: Database['public']['Tables']['category_groups']['Row'];
    };
    tags?: string[] | null;
};

type CommentWithAuthor = Database['public']['Tables']['comments']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    children?: CommentWithAuthor[];
    reactions?: Record<ReactionType, number>;
    user_reaction?: ReactionType;
};

type ReactionType = 'like' | 'super_like' | 'dislike';

const getCategoryColor = (slug: string) => {
    switch (slug) {
        case 'anuncios': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'geral': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'duvidas': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        case 'sugestoes': return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'problemas': return 'bg-red-500/10 text-red-500 border-red-500/20';
        case 'off-topic': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        default: return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    }
};

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
            <div className="bg-card border border-primary rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
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
    const navigate = useNavigate();
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

    // Edit State for Post
    const [isEditingPost, setIsEditingPost] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'post' | 'comment', id: string } | null>(null);

    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

    const toggleFontSize = (size: 'sm' | 'base' | 'lg') => {
        setFontSize(size);
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

        await Promise.all([fetchPostDetails(), fetchComments(), fetchReactions(user), fetchFavoritedUsers(user)]);
        setLoading(false);
    };

    const fetchPostDetails = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles:author_id (*),
                categories:category_id (
                    *,
                    group:category_groups (*)
                )
            `)
            .eq('id', id)
            .single();

        if (error) console.error('Error fetching post:', error);
        if (data) setPost(data as any);
    };

    const fetchComments = async () => {
        const { data: commentsData, error } = await supabase
            .from('comments')
            .select(`
                *,
                profiles:author_id (*)
            `)
            .eq('post_id', id)
            .order('created_at', { ascending: true });

        if (error) console.error('Error fetching comments:', error);

        if (commentsData) {
            // Fetch Reactions for these comments
            const commentIds = commentsData.map((c: any) => c.id);
            const { data: reactionsData } = await supabase
                .from('comment_reactions')
                .select('*')
                .in('comment_id', commentIds);

            // Map Reactions
            const reactionsMap: Record<string, { counts: Record<ReactionType, number>, userReaction?: ReactionType }> = {};

            const currentUserId = (await supabase.auth.getUser()).data.user?.id;

            reactionsData?.forEach((r: any) => {
                if (!reactionsMap[r.comment_id]) {
                    reactionsMap[r.comment_id] = { counts: { like: 0, super_like: 0, dislike: 0 } };
                }

                const rType = r.type as ReactionType;
                if (rType in reactionsMap[r.comment_id].counts) {
                    reactionsMap[r.comment_id].counts[rType]++;
                }

                if (currentUserId && r.user_id === currentUserId) {
                    reactionsMap[r.comment_id].userReaction = rType;
                }
            });

            // Build Tree with Reactions
            const commentMap: Record<string, CommentWithAuthor> = {};
            const roots: CommentWithAuthor[] = [];

            commentsData.forEach((c: any) => {
                c.children = [];
                // Attach reactions
                const r = reactionsMap[c.id];
                c.reactions = r?.counts || { like: 0, super_like: 0, dislike: 0 };
                c.user_reaction = r?.userReaction;

                commentMap[c.id] = c;
            });

            commentsData.forEach((c: any) => {
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



    const fetchFavoritedUsers = async (user: any) => {
        if (!id) return;
        const { data, error } = await supabase.rpc('get_post_favorites', { target_post_id: id });

        if (error) {
            console.error('Error fetching favorites:', error);
            return;
        }

        if (data) {
            const users = data.map((u: any) => ({
                id: u.user_id,
                username: u.username,
                avatar_url: u.avatar_url
            }));
            setFavoritedBy(users);

            // Sync isFavorite state from this authoritative list
            // Now using the passed 'user' object which is guaranteed to be present from init()
            if (user) {
                // Ensure IDs are compared as strings to avoid any type mismatch issues
                const isMeInList = users.some((u: any) => String(u.id) === String(user.id));
                if (isMeInList) {
                    setIsFavorite(true);
                }
            }
        }
    };

    // ... (rest of code) ...

    // Extract First Image for Hero (Priority: post.image_url > content image)
    const firstImage = post?.image_url || (post?.content.match(/<img[^>]+src="([^">]+)"/) ? post?.content.match(/<img[^>]+src="([^">]+)"/)?.[1] : null);

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            toast('Link Copiado!', 'O link da postagem foi copiado para a área de transferência.', 'success');
        } catch (err) {
            console.error('Clipboard API failed', err);
            // Fallback method
            try {
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (successful) {
                    toast('Link Copiado!', 'O link da postagem foi copiado para a área de transferência.', 'success');
                } else {
                    throw new Error('Fallback failed');
                }
            } catch (fallbackErr) {
                toast('Erro', 'Não foi possível copiar o link.', 'error');
            }
        }
    };

    const handleToggleFavorite = async () => {
        if (!currentUser || !id) return;

        // Optimistic Update
        const oldIsFavorite = isFavorite;
        const newIsFavorite = !oldIsFavorite;

        setIsFavorite(newIsFavorite);

        if (newIsFavorite) {
            // Adding favorite: Prevent Duplicates
            if (currentProfile) {
                setFavoritedBy(prev => {
                    if (prev.some(p => p.id === currentUser.id)) return prev;
                    return [...prev, currentProfile];
                });
            }
        } else {
            // Removing favorite
            setFavoritedBy(prev => prev.filter(p => p.id !== currentUser.id));
        }

        const { data: newStatus, error } = await supabase.rpc('toggle_favorite', { target_post_id: id });

        if (error) {
            console.error('Error toggling favorite:', error);
            // Revert
            setIsFavorite(oldIsFavorite);
            if (oldIsFavorite) {
                // Was favorite, now stays favorite -> Add back if missing
                if (currentProfile) {
                    setFavoritedBy(prev => {
                        if (prev.some(p => p.id === currentUser.id)) return prev;
                        return [...prev, currentProfile];
                    });
                }
            } else {
                // Was not favorite, stays not favorite -> Remove
                setFavoritedBy(prev => prev.filter(p => p.id !== currentUser.id));
            }
            toast('Erro', `Falha ao favoritar: ${error.message}`, 'error');
        } else {
            // Ensure state matches server
            setIsFavorite(newStatus as boolean);

            // Sync List again based on final status?
            if (newStatus === true) {
                if (currentProfile) {
                    setFavoritedBy(prev => {
                        if (prev.some(p => p.id === currentUser.id)) return prev;
                        return [...prev, currentProfile];
                    });
                }
            } else {
                setFavoritedBy(prev => prev.filter(p => p.id !== currentUser.id));
            }

            toast(newStatus ? 'Salvo' : 'Removido', newStatus ? 'Postagem adicionada aos favoritos!' : 'Postagem removida dos favoritos.', newStatus ? 'success' : 'info');
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
        if (!content || !content.trim() || content === '<p><br></p>') {
            toast('Atenção', 'Por favor, escreva algo ou insira uma imagem.', 'info');
            return;
        }
        if (!id) return;
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
            const { error } = await supabase.rpc('delete_topic_fully', { target_post_id: itemId });

            if (!error) {
                toast('Sucesso', 'Tópico excluído.', 'success');
                window.location.href = '/community';
            } else {
                console.error('Delete error:', error);
                toast('Erro', `Erro ao excluir: ${error.message}`, 'error');
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

    const handleUpdatePost = async (content: string) => {
        if (!post) return;

        try {
            const { error } = await supabase
                .from('posts')
                .update({
                    content,
                    updated_at: new Date().toISOString()
                })
                .eq('id', post.id);

            if (error) throw error;

            setPost(prev => prev ? { ...prev, content, updated_at: new Date().toISOString() } : null);
            setIsEditingPost(false);
            toast('Sucesso', 'Tópico atualizado com sucesso!', 'success');
        } catch (error) {
            console.error('Error updating post:', error);
            toast('Erro', 'Erro ao atualizar tópico.', 'error');
        }
    };

    const handleUpdateComment = async (commentId: string, content: string) => {
        try {
            const { error } = await supabase
                .from('comments')
                .update({ content }) // Note: updated_at might not exist on comments yet
                .eq('id', commentId);

            if (error) throw error;

            // Update local state
            const updateCommentsRecursive = (list: CommentWithAuthor[]): CommentWithAuthor[] => {
                return list.map(c => {
                    if (c.id === commentId) {
                        return { ...c, content }; // We don't have updated_at in type, so just content
                    }
                    if (c.children && c.children.length > 0) {
                        return { ...c, children: updateCommentsRecursive(c.children) };
                    }
                    return c;
                });
            };

            setComments(prev => updateCommentsRecursive(prev));
            toast('Sucesso', 'Resposta atualizada com sucesso!', 'success');
        } catch (error) {
            console.error('Error updating comment:', error);
            toast('Erro', 'Erro ao atualizar resposta.', 'error');
        }
    };

    const handleCommentReaction = async (commentId: string, type: ReactionType) => {
        if (!currentUser) {
            toast('Login necessário', 'Você precisa estar logado para reagir.', 'error');
            return;
        }

        // Optimistic Update Helper
        const updateReactionsRecursive = (list: CommentWithAuthor[]): CommentWithAuthor[] => {
            return list.map(c => {
                if (c.id === commentId) {
                    const currentType = c.user_reaction;
                    const newReactions = { ...c.reactions };

                    // Helper to safe decrement
                    const dec = (t: ReactionType) => { newReactions[t] = Math.max(0, (newReactions[t] || 0) - 1); };
                    // Helper to increment
                    const inc = (t: ReactionType) => { newReactions[t] = (newReactions[t] || 0) + 1; };

                    if (currentType === type) {
                        // Toggle OFF
                        dec(type);
                        return { ...c, user_reaction: undefined, reactions: newReactions };
                    } else {
                        // Toggle ON (Switch if exists)
                        if (currentType) dec(currentType);
                        inc(type);
                        return { ...c, user_reaction: type, reactions: newReactions };
                    }
                }
                if (c.children && c.children.length > 0) {
                    return { ...c, children: updateReactionsRecursive(c.children) };
                }
                return c;
            });
        };

        setComments(prev => updateReactionsRecursive(prev));

        // DB Update
        // Check current state (we can match logic or check DB, matching logic is faster for UI)
        // We actually need to know if we are deleting or upserting.
        // Let's rely on what we just calculated? Or double check?
        // Simpler: Just try to delete first. If row count > 0, we were untoggling. If 0, we insert.
        // BUT if switching types, we need delete old + insert new.
        // The safest single-command approach for Toggle is tricky in standard SQL without sproc.
        // We'll use the check-then-act pattern for now or just upsert and see.

        // Actually best way:
        // 1. Check if ANY reaction exists for this user/comment.
        const { data: existing } = await supabase.from('comment_reactions').select('type').eq('comment_id', commentId).eq('user_id', currentUser.id).maybeSingle();

        if (existing && existing.type === type) {
            // Remove
            await supabase.from('comment_reactions').delete().eq('comment_id', commentId).eq('user_id', currentUser.id);
        } else {
            // Upsert (handles switch automatically if we had unique constraint, BUT we made (comment_id, user_id) unique so Upsert works perfectly for switch)
            const { error } = await supabase.from('comment_reactions').upsert({
                comment_id: commentId,
                user_id: currentUser.id,
                type: type
            }, { onConflict: 'comment_id, user_id' });

            if (error) console.error('Reaction Error', error);
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
        handleUpdateComment: (id: string, content: string) => Promise<void>;
        handleCommentReaction: (id: string, type: ReactionType) => Promise<void>;
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
        onImageClick,
        handleUpdateComment,
        handleCommentReaction
    }) => {
        const [localComment, setLocalComment] = useState('');
        const [isEditing, setIsEditing] = useState(false);
        const [editContent, setEditContent] = useState(comment.content);
        const [isUpdating, setIsUpdating] = useState(false);

        const onUpdate = async () => {
            if (!editContent.trim() || editContent === '<p><br></p>') return;
            setIsUpdating(true);
            await handleUpdateComment(comment.id, editContent);
            setIsUpdating(false);
            setIsEditing(false);
        };

        const isAuthor = currentUser?.id === comment.author_id;

        // Reset local comment when closing/opening
        useEffect(() => {
            if (replyingTo !== comment.id) setLocalComment('');
        }, [replyingTo, comment.id]);

        return (
            <div className="relative">
                {/* Self Content - Isolated group for hover targeting to prevent parent activation when hovering children */}
                <div className="group relative py-3 pl-3 pr-2 transition-colors hover:bg-muted/5 rounded-lg -ml-3">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted border border-border overflow-hidden flex-shrink-0 z-10">
                                {comment.profiles?.avatar_url ? (
                                    <img src={comment.profiles.avatar_url} alt={comment.profiles.username || ''} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <User size={14} />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-between h-8 py-0.5">
                                <span className="font-bold text-card-foreground text-xs leading-none block">{comment.profiles?.username}</span>
                                <span className="text-muted-foreground text-[10px] leading-none">{new Date(comment.created_at).toLocaleDateString()} às {new Date(comment.created_at).toLocaleTimeString().slice(0, 5)}</span>
                            </div>
                        </div>

                        {/* Top Right Actions (Edit/Delete) - Only on Hover */}
                        <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {isAuthor && !isEditing && (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-muted-foreground hover:bg-muted hover:text-purple-400 transition-all p-2 rounded"
                                        title="Editar resposta"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete('comment', comment.id)}
                                        className="text-muted-foreground hover:bg-red-500 hover:text-white transition-all p-2 rounded"
                                        title="Excluir resposta"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Vertical Line for Thread Continuity - ONLY if has children */}
                    {comment.children && comment.children.length > 0 && (
                        <div className="absolute left-[27px] top-11 bottom-0 w-[2px] bg-border/60" />
                        /* left calculation: pl-3 (12px) + w-8/2 (16px) = 28px center. Adjusted to 27px for 2px width centering. */
                        /* Wait, my previous calculation was 16px from parent.
                           Container has `pl-3`. Avatar is first element.
                           So Avatar starts at 12px inside this container.
                           Avatar Center is 12 + 16 = 28px.
                           So line should be at left-[27px] or left-[28px]. */
                    )}

                    {/* Content */}
                    <div className="pl-11">
                        {isEditing ? (
                            <div className="mb-2">
                                <RichEditor
                                    value={editContent}
                                    onChange={setEditContent}
                                    placeholder="Edite sua resposta..."
                                    minHeight="100px"
                                    onSubmit={onUpdate}
                                    submitting={isUpdating}
                                    submitLabel="Salvar Edição"
                                    onCancel={() => setIsEditing(false)}
                                />
                            </div>
                        ) : (
                            <div
                                className="text-muted-foreground text-xs mb-3 leading-relaxed prose prose-invert max-w-none [&_img]:max-w-full [&_img]:max-h-[400px] [&_img]:w-auto [&_img]:object-contain [&_img]:rounded-lg [&_img]:mt-2 [&_img]:cursor-pointer [&_img]:hover:brightness-90 transition-all"
                                dangerouslySetInnerHTML={{ __html: comment.content }}
                                onClick={onImageClick}
                            />
                        )}

                        {/* Footer: Reactions & Reply Button */}
                        <div className="flex items-center gap-4 h-6 mb-2">
                            {/* Reactions: Always Visible */}
                            <div className="flex gap-1.5 items-center">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleCommentReaction(comment.id, 'like'); }}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all ${comment.user_reaction === 'like' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'border-border/50 text-muted-foreground hover:bg-muted'}`}
                                    title={`${comment.reactions?.like || 0} curtidas`}
                                >
                                    <ThumbsUp size={12} className={comment.user_reaction === 'like' ? 'fill-current' : ''} />
                                    <span className="text-[9px] font-bold">{comment.reactions?.like || 0}</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleCommentReaction(comment.id, 'super_like'); }}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all ${comment.user_reaction === 'super_like' ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'border-border/50 text-muted-foreground hover:bg-muted'}`}
                                    title={`${comment.reactions?.super_like || 0} amei`}
                                >
                                    <Heart size={12} className={comment.user_reaction === 'super_like' ? 'fill-current' : ''} />
                                    <span className="text-[9px] font-bold">{comment.reactions?.super_like || 0}</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleCommentReaction(comment.id, 'dislike'); }}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all ${comment.user_reaction === 'dislike' ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-border/50 text-muted-foreground hover:bg-muted'}`}
                                    title={`${comment.reactions?.dislike || 0} não curti`}
                                >
                                    <ThumbsDown size={12} className={comment.user_reaction === 'dislike' ? 'fill-current' : ''} />
                                    <span className="text-[9px] font-bold">{comment.reactions?.dislike || 0}</span>
                                </button>
                            </div>

                            {/* Reply Button - Visible on Hover */}
                            {postStatus === 'published' ? (
                                <>
                                    {replyingTo !== comment.id && (
                                        <button
                                            onClick={() => setReplyingTo(comment.id)}
                                            className="font-medium flex items-center gap-1.5 transition-all text-xs text-muted-foreground hover:text-purple-400 opacity-0 group-hover:opacity-100"
                                        >
                                            <CornerDownRight size={14} />
                                            Responder
                                        </button>
                                    )}
                                </>
                            ) : (
                                <span className="text-[10px] text-muted-foreground/50 cursor-not-allowed opacity-0 group-hover:opacity-100" title="Tópico não publicado">Responder</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Inline Editor for Replies - Separate Block */}
                {replyingTo === comment.id && (
                    <div className="ml-11 mb-4 p-1 shadow-2xl shadow-black/40 rounded-xl bg-card border border-border animate-in slide-in-from-top-2 duration-200 relative z-20">
                        <RichEditor
                            value={localComment}
                            onChange={setLocalComment}
                            placeholder={`Respondendo a ${comment.profiles?.username || 'usuário'}...`}
                            minHeight="80px"
                            autoFocus
                            onSubmit={() => handleSubmitComment(localComment, comment.id)}
                            submitting={submitting}
                            onCancel={() => setReplyingTo(null)}
                        />
                    </div>
                )}

                {/* Nested Comments with continuous line (Outside group div) */}
                {comment.children && comment.children.length > 0 && (
                    <div className="ml-4 pl-4 border-l-2 border-border/60 -mt-2 pt-2 space-y-0 relative z-0">
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
                                handleUpdateComment={handleUpdateComment}
                                handleCommentReaction={handleCommentReaction}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (!loading && !post) return <div className="p-8 text-center text-zinc-500 text-xs">Tópico não encontrado.</div>;

    return (
        <div className="min-h-screen bg-background pb-20 relative">
            {loading && <LoadingOverlay message="Carregando tópico..." />}
            {/* Header / Breadcrumbs */}
            <div className="bg-card border-b border-border sticky top-0 z-30 shadow-sm backdrop-blur-md bg-card/80">
                <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">


                        <div className="flex items-center gap-1.5 text-xs truncate">
                            <Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                                Fórum
                            </Link>
                            {post.categories?.group && (
                                <>
                                    <span className="text-muted-foreground/50">/</span>
                                    <Link
                                        to={`/community?group=${post.categories.group.id}`}
                                        className="font-medium text-muted-foreground hover:text-purple-400 transition-colors"
                                    >
                                        {post.categories.group.name}
                                    </Link>
                                </>
                            )}
                            <span className="text-muted-foreground/50">/</span>
                            <span className={`font-bold uppercase tracking-wider ${post.categories ? getCategoryColor(post.categories.slug) : 'text-foreground'}`}>
                                {post.categories?.name || 'Geral'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Font Size Controls */}
                        <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border mr-2">
                            <button
                                onClick={() => toggleFontSize('sm')}
                                className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-all ${fontSize === 'sm' ? 'bg-card text-purple-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                A-
                            </button>
                            <button
                                onClick={() => toggleFontSize('base')}
                                className={`w-7 h-7 flex items-center justify-center rounded text-sm font-bold transition-all ${fontSize === 'base' ? 'bg-card text-purple-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                A
                            </button>
                            <button
                                onClick={() => toggleFontSize('lg')}
                                className={`w-7 h-7 flex items-center justify-center rounded text-base font-bold transition-all ${fontSize === 'lg' ? 'bg-card text-purple-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                A+
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* LEFT COLUMN: Main Content (75%) */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Post Container */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm relative p-6 lg:p-10">

                            {/* Draft Warning */}
                            {post.status === 'draft' && (
                                <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-4 py-2 rounded-bl-xl border-l border-b border-yellow-500/20">
                                    RASCUNHO
                                </div>
                            )}

                            {/* Header: Title & Meta */}
                            <div className="mb-8 pb-8 border-b border-border/50">

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.categories && (
                                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(post.categories.slug)} bg-opacity-10 border-opacity-20`}>
                                            {post.categories.name}
                                        </span>
                                    )}
                                    {post.tags && post.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="text-2xl lg:text-3xl font-black text-foreground leading-tight tracking-tight mb-6">
                                    {post.title}
                                </h1>

                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            onClick={() => post.profiles?.id && navigate(`/community/author/${post.profiles.id}`)}
                                            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border cursor-pointer hover:border-purple-500 transition-colors"
                                        >
                                            {post.profiles?.avatar_url ? (
                                                <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={18} className="text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p
                                                onClick={() => post.profiles?.id && navigate(`/community/author/${post.profiles.id}`)}
                                                className="text-sm font-bold text-foreground hover:text-purple-400 cursor-pointer transition-colors"
                                            >
                                                {post.profiles?.username || 'Anônimo'}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{new Date(post.created_at).toLocaleTimeString().slice(0, 5)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Author Actions - Absolute Position Top Right */}
                                {currentUser && currentUser.id === post.author_id && (
                                    <div className="absolute top-6 right-6 flex items-center gap-2">
                                        {post.status === 'draft' && (
                                            <button
                                                onClick={handlePublish}
                                                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                                            >
                                                <Send size={12} /> Publicar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate(`/community/edit/${post.id}`)}
                                            className="p-2 text-muted-foreground hover:text-purple-400 hover:bg-muted rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete('post', post.id)}
                                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Main Content Body */}
                            <div className={`
                                prose prose-invert prose-purple max-w-none 
                                ${fontSize === 'sm' ? 'prose-sm' : fontSize === 'lg' ? 'prose-lg' : 'prose-sm'}
                                prose-p:text-foreground/90 prose-headings:text-foreground prose-strong:text-foreground prose-blockquote:border-purple-500
                            `}>
                                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/<img[^>]*>/g, '') }} />
                            </div>

                            {/* Footer / Reactions */}
                            <div className="border-t border-border mt-6 pt-4 flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleReaction('like')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${userReaction === 'like' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <ThumbsUp size={16} className={userReaction === 'like' ? 'fill-current' : ''} />
                                        <span className="text-xs font-bold">{reactionCounts.like}</span>
                                    </button>
                                    <button
                                        onClick={() => handleReaction('super_like')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${userReaction === 'super_like' ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <Heart size={16} className={userReaction === 'super_like' ? 'fill-current' : ''} />
                                        <span className="text-xs font-bold">{reactionCounts.super_like}</span>
                                    </button>
                                    <button
                                        onClick={() => handleReaction('dislike')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${userReaction === 'dislike' ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <ThumbsDown size={16} className={userReaction === 'dislike' ? 'fill-current' : ''} />
                                        <span className="text-xs font-bold">{reactionCounts.dislike}</span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`p-2 rounded-full border transition-all ${isFavorite ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                        title="Favoritar"
                                    >
                                        <Bookmark size={18} className={isFavorite ? 'fill-current' : ''} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-full border border-border text-muted-foreground hover:bg-muted transition-all"
                                        title="Compartilhar"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div id="comments" className="bg-transparent pt-6 lg:pt-8">
                            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
                                Respostas <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md border border-border">{comments.length}</span>
                            </h3>

                            <div className="space-y-6">
                                {comments.length === 0 ? (
                                    <div className="text-center py-10 opacity-50">
                                        <MessageSquare size={48} className="mx-auto mb-4 text-border" />
                                        <p>Seja o primeiro a responder!</p>
                                    </div>
                                ) : (
                                    comments.map(comment => (
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
                                            onImageClick={() => { }} // Disabled
                                            handleUpdateComment={handleUpdateComment}
                                            handleCommentReaction={handleCommentReaction}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Comment Editor */}
                            {post.status === 'published' && !replyingTo && (
                                <div className="mt-10 pt-6 border-t border-border">
                                    <h3 className="text-xl font-bold text-foreground mb-6">Responder o tópico</h3>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted border border-border flex-shrink-0 overflow-hidden">
                                            {currentUser?.user_metadata?.avatar_url || currentProfile?.avatar_url ? (
                                                <img src={currentUser?.user_metadata?.avatar_url || currentProfile?.avatar_url} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={20} className="text-muted-foreground m-auto mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <RichEditor
                                                value={newComment}
                                                onChange={setNewComment}
                                                placeholder="Escreva sua resposta..."
                                                minHeight="120px"
                                                onSubmit={() => handleSubmitComment()}
                                                submitting={submitting}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar (25%) */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Who Favorited Card */}
                        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Bookmark size={12} className="text-yellow-500 fill-current" /> Quem Favoritou
                            </h3>
                            {favoritedBy.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {favoritedBy.map((profile, i) => (
                                        <div key={i}
                                            onClick={() => navigate(`/community/author/${profile.id}`)}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-muted overflow-hidden border border-border">
                                                {profile.avatar_url ? (
                                                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={14} className="text-muted-foreground m-auto mt-1.5" />
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-foreground truncate">{profile.username}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground text-xs bg-muted/20 rounded-lg border border-dashed border-border">
                                    Ninguém favoritou ainda.
                                </div>
                            )}
                        </div>

                        {/* Stats Card */}
                        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Estatísticas
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                                    <span className="text-xs font-medium text-muted-foreground">Respostas</span>
                                    <span className="text-sm font-bold text-foreground">{comments.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                                    <span className="text-xs font-medium text-muted-foreground">Reações</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-green-500 flex items-center gap-0.5"><ThumbsUp size={10} /> {reactionCounts.like}</span>
                                        <span className="text-xs font-bold text-pink-500 flex items-center gap-0.5"><Heart size={10} /> {reactionCounts.super_like}</span>
                                        <span className="text-xs font-bold text-red-500 flex items-center gap-0.5"><ThumbsDown size={10} /> {reactionCounts.dislike}</span>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={executeDelete}
                title={itemToDelete?.type === 'post' ? 'Excluir Tópico' : 'Excluir Resposta'}
                message={itemToDelete?.type === 'post'
                    ? 'Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita.'
                    : 'Tem certeza que deseja excluir esta resposta? Esta ação não pode ser desfeita.'}
            />
        </div >
    );
};

export default PostDetail;

