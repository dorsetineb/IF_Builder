import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, Share2, Send, ThumbsDown, CornerDownRight, User, Star, Trash2, AlertCircle, List, X, Pencil, MessageSquare, Heart, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { useToast } from '../components/ToastContext';
import ImageModal from '../components/ImageModal';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import RichEditor from '../components/RichEditor';

type PostWithDetails = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    tags?: string[] | null;
};

type CommentWithAuthor = Database['public']['Tables']['comments']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    children?: CommentWithAuthor[];
    reactions?: Record<ReactionType, number>;
    user_reaction?: ReactionType;
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

    // Gallery State
    const [galleryState, setGalleryState] = useState<{ images: string[], index: number, isOpen: boolean }>({
        images: [],
        index: 0,
        isOpen: false
    });

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
            const container = target.closest('.prose'); // Find the prose container
            if (container) {
                // Find all images in this container to build the gallery
                const allImages = Array.from(container.querySelectorAll('img')).map(img => img.src);
                const clickedIndex = allImages.indexOf((target as HTMLImageElement).src);

                if (clickedIndex !== -1) {
                    setGalleryState({
                        images: allImages,
                        index: clickedIndex,
                        isOpen: true
                    });
                }
            }
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

        await Promise.all([fetchPostDetails(), fetchComments(), fetchReactions(user), fetchFavoritedUsers(user)]);
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
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-1 items-center mr-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleCommentReaction(comment.id, 'like'); }}
                                className={`p-1 transition-colors ${comment.user_reaction === 'like' ? 'text-blue-500 bg-blue-500/10 rounded' : 'text-muted-foreground hover:text-blue-500'}`}
                                title={`${comment.reactions?.like || 0} curtidas`}
                            >
                                <ThumbsUp size={14} className={comment.user_reaction === 'like' ? 'fill-current' : ''} />
                                {(comment.reactions?.like || 0) > 0 && <span className="ml-1 text-[9px] font-bold">{comment.reactions?.like}</span>}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleCommentReaction(comment.id, 'super_like'); }}
                                className={`p-1 transition-colors ${comment.user_reaction === 'super_like' ? 'text-pink-500 bg-pink-500/10 rounded' : 'text-muted-foreground hover:text-pink-500'}`}
                                title={`${comment.reactions?.super_like || 0} amei`}
                            >
                                <Heart size={14} className={comment.user_reaction === 'super_like' ? 'fill-current' : ''} />
                                {(comment.reactions?.super_like || 0) > 0 && <span className="ml-1 text-[9px] font-bold">{comment.reactions?.super_like}</span>}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleCommentReaction(comment.id, 'dislike'); }}
                                className={`p-1 transition-colors ${comment.user_reaction === 'dislike' ? 'text-red-500 bg-red-500/10 rounded' : 'text-muted-foreground hover:text-red-500'}`}
                                title={`${comment.reactions?.dislike || 0} não curti`}
                            >
                                <ThumbsDown size={14} className={comment.user_reaction === 'dislike' ? 'fill-current' : ''} />
                                {(comment.reactions?.dislike || 0) > 0 && <span className="ml-1 text-[9px] font-bold">{comment.reactions?.dislike}</span>}
                            </button>
                        </div>

                        {isAuthor && !isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-muted-foreground hover:bg-muted hover:text-purple-400 transition-all p-1.5 rounded"
                                    title="Editar resposta"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => confirmDelete('comment', comment.id)}
                                    className="text-muted-foreground hover:bg-red-500 hover:text-white transition-all p-1.5 rounded"
                                    title="Excluir resposta"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

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
                        className="text-muted-foreground text-xs mb-2 pl-1 leading-relaxed prose prose-invert max-w-none [&_img]:max-w-full [&_img]:max-h-[400px] [&_img]:w-auto [&_img]:object-contain [&_img]:rounded-lg [&_img]:mt-2 [&_img]:cursor-pointer [&_img]:hover:brightness-90 transition-all"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                        onClick={onImageClick}
                    />
                )}

                <div className="flex items-center gap-3 pl-1 mt-1 h-6">
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
                            onCancel={() => setReplyingTo(null)}
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
                                handleUpdateComment={handleUpdateComment}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center text-zinc-500 text-xs">Carregando discussão...</div>;
    if (!post) return <div className="p-8 text-center text-zinc-500 text-xs">Post não encontrado.</div>;



    return (
        <div className="min-h-full bg-background font-sans pb-32">
            {/* Standard Header with Breadcrumbs */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-20 shrink-0">
                <div className="flex flex-col justify-center h-full">
                    <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Link to="/community" className="hover:text-purple-400 transition-colors">Fórum</Link>
                        <span className="text-muted-foreground/50">/</span>
                        <span className="text-sm font-medium text-muted-foreground">{post.categories?.name || 'Tópico'}</span>
                    </h1>
                </div>
                <div>
                    <button
                        onClick={() => navigate('/community')}
                        className="flex items-center justify-center p-2 text-muted-foreground hover:text-destructive transition-colors"
                        title="Sair"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
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

                            <div className="p-6 relative">
                                {/* Header Info */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            {post.categories && (
                                                <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                    {post.categories.name}
                                                </span>
                                            )}
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex items-center gap-1.5 ml-1">
                                                    {post.tags.map((tag, i) => (
                                                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
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
                                                {post.updated_at && post.updated_at !== post.created_at && (
                                                    <p className="text-muted-foreground text-[9px] italic">(editado)</p>
                                                )}
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
                                        {currentUser && currentUser.id === post.author_id && (
                                            <>
                                                <button
                                                    onClick={() => setIsEditingPost(true)}
                                                    className="text-muted-foreground hover:text-purple-400 p-2 rounded-lg hover:bg-muted transition-colors"
                                                    title="Editar Tópico"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete('post', post.id)}
                                                    className="text-muted-foreground hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Post Content */}
                                {isEditingPost ? (
                                    <div className="mt-4">
                                        <RichEditor
                                            value={post.content}
                                            onChange={(val) => setPost(prev => prev ? { ...prev, content: val } : null)}
                                            placeholder="Edite seu tópico..."
                                            minHeight="200px"
                                            onSubmit={() => handleUpdatePost(post.content)}
                                            submitting={false}
                                            submitLabel="Salvar Edição"
                                            onCancel={() => setIsEditingPost(false)}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="prose prose-invert prose-purple max-w-none text-sm text-foreground/90 leading-relaxed font-normal [&_img]:max-w-full [&_img]:max-h-[500px] [&_img]:w-auto [&_img]:object-contain [&_img]:rounded-lg [&_img]:mt-2 [&_img]:cursor-pointer [&_img]:hover:brightness-90 transition-all"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                        onClick={handleImageClick}
                                    />
                                )}

                                {/* Reactions Footer */}
                                <div className="flex items-center gap-4 pt-8 mt-8 border-t border-border">
                                    <button
                                        onClick={() => handleReaction('like')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${userReaction === 'like' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <ThumbsUp size={14} className={userReaction === 'like' ? 'fill-current' : ''} />
                                        <span className="text-[10px] font-bold">{reactionCounts.like}</span>
                                    </button>

                                    <button
                                        onClick={() => handleReaction('super_like')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${userReaction === 'super_like' ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <Heart size={14} className={userReaction === 'super_like' ? 'fill-current' : ''} />
                                        <span className="text-[10px] font-bold">{reactionCounts.super_like}</span>
                                    </button>

                                    <button
                                        onClick={() => handleReaction('dislike')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${userReaction === 'dislike' ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <ThumbsDown size={14} className={userReaction === 'dislike' ? 'fill-current' : ''} />
                                        <span className="text-[10px] font-bold">{reactionCounts.dislike}</span>
                                    </button>

                                    <span className="text-xs text-muted-foreground ml-auto pr-4">{post.comments ? post.comments.length : 0} visualizações</span>

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-all"
                                        title="Copiar Link"
                                    >
                                        <Share2 size={14} />
                                        <span className="text-[10px] font-bold">Compartilhar</span>
                                    </button>
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isFavorite ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/20' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                        title="Favoritar"
                                    >
                                        <Star size={14} className={isFavorite ? 'fill-current' : ''} />
                                        <span className="text-[10px] font-bold">Favorito</span>
                                    </button>
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
                                        handleUpdateComment={handleUpdateComment}
                                        handleCommentReaction={handleCommentReaction}
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
                                                onSubmit={() => handleSubmitComment()}
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
            {/* Floating Editor Removed */} {/* Space Holder */}

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

            {
                galleryState.isOpen && (
                    <ImageModal
                        images={galleryState.images}
                        initialIndex={galleryState.index}
                        onClose={() => setGalleryState(prev => ({ ...prev, isOpen: false }))}
                    />
                )
            }
        </div >
    );
};

export default PostDetail;

