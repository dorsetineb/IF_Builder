import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Save, Send, AlertCircle, ChevronDown, Image as ImageIcon, Link as LinkIcon, LogOut, Upload, X, Trash2 } from 'lucide-react';
import { Database } from '../types/supabase';
import { useToast } from '../components/ToastContext';
import RichEditor from '../components/RichEditor';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryGroup = Database['public']['Tables']['category_groups']['Row'] & {
    categories: Category[];
};

// Local Confirmation Modal
const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    confirmColor = "bg-green-600 hover:bg-green-500"
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmColor?: string;
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-foreground">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-lg font-bold">{title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{message}</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-lg text-sm font-bold text-white shadow-sm transition-colors ${confirmColor}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [postStatus, setPostStatus] = useState<'draft' | 'published' | null>(null);
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);

    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchPostData(id);
        }
    }, [id]);

    const fetchCategories = async () => {
        const { data } = await supabase
            .from('category_groups')
            .select(`
                *,
                categories (*)
            `)
            .order('order_index');

        if (data) {
            const sortedGroups = data.map((group: any) => ({
                ...group,
                categories: group.categories.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
            }));
            setCategoryGroups(sortedGroups);
            setCategories(sortedGroups.flatMap(g => g.categories));
        }
    };

    const fetchPostData = async (postId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) {
            toast('Erro', 'Não foi possível carregar o rascunho.', 'error');
            navigate('/community');
            return;
        }

        if (data.author_id !== user.id) {
            toast('Acesso negado', 'Você não tem permissão para editar este post.', 'error');
            navigate('/community');
            return;
        }

        setTitle(data.title);
        setContent(data.content);
        setCategoryId(data.category_id || '');
        if (data.tags) {
            setTags(data.tags);
        }
        setPostStatus(data.status);
    };



    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const confirmPublish = () => {
        const strippedContent = content.replace(/<[^>]*>/g, '').trim();
        if (!title.trim() || !strippedContent) {
            toast('Campos obrigatórios', 'Por favor, preencha o título e o conteúdo.', 'error');
            return;
        }

        if (!categoryId) {
            const defaultCat = categories.find(c => c.slug === 'general')?.id || categories[0]?.id;
            if (defaultCat) setCategoryId(defaultCat);
            else {
                toast('Categoria necessária', 'Selecione uma categoria para publicar.', 'error');
                return;
            }
        }
        setShowPublishModal(true);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const performDelete = async () => {
        if (!id) return;

        setLoading(true);
        // Manual Cascade Delete due to lack of DB constraints on some setups, just to be safe
        await supabase.from('comments').delete().eq('post_id', id);
        await supabase.from('post_reactions').delete().eq('post_id', id);
        await supabase.from('post_favorites').delete().eq('post_id', id);

        const { error } = await supabase.from('posts').delete().eq('id', id);

        if (error) {
            console.error('Error deleting draft:', error);
            toast('Erro', 'Erro ao excluir rascunho.', 'error');
            setLoading(false);
        } else {
            toast('Sucesso', 'Rascunho excluído.', 'success');
            navigate('/community/my-posts');
        }
        setShowDeleteModal(false);
    };

    const handleSave = async (status: 'draft' | 'published') => {
        if (loading || savingDraft) return;

        const strippedContent = content.replace(/<[^>]*>/g, '').trim();
        if (!title.trim() || (!strippedContent && status === 'published')) {
            toast('Campos obrigatórios', 'Por favor, preencha o título e o conteúdo.', 'error');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            toast('Erro de autenticação', 'Você precisa estar logado.', 'error');
            return;
        }

        let validCategoryId = categoryId;
        if (!validCategoryId) {
            const defaultCat = categories.find(c => c.slug === 'general')?.id || categories[0]?.id;
            validCategoryId = defaultCat || '';
        }

        if (status === 'published' && !validCategoryId) {
            toast('Erro de configuração', 'Nenhuma categoria disponível.', 'error');
            return;
        }

        if (status === 'draft') setSavingDraft(true);
        else setLoading(true);

        // DUPLICATE CHECK
        if (status === 'published' && !id) {
            const { count, error: countError } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('author_id', user.id)
                .eq('title', title)
                .eq('content', content) // Supabase text comp
                .gt('created_at', new Date(Date.now() - 60000).toISOString()); // Last 60s

            if (count && count > 0) {
                toast('Duplicidade', 'Você já publicou um tópico idêntico recentemente.', 'error');
                setLoading(false);
                setShowPublishModal(false);
                return;
            }
        }

        const postData = {
            title,
            content,
            author_id: user.id,
            category_id: validCategoryId,
            status: status,
            image_url: null, // Force null
            updated_at: new Date().toISOString(),
            tags: tags
        };

        let error;

        if (id) {
            const { error: updateError } = await supabase
                .from('posts')
                .update(postData)
                .eq('id', id);
            error = updateError;
        } else {
            // Check submit state again just in case (race condition mostly UI handled but safe here)
            const { error: insertError } = await supabase
                .from('posts')
                .insert(postData);
            error = insertError;
        }

        if (error) {
            console.error('Error saving post:', error);
            toast('Erro ao salvar', error.message || 'Ocorreu um erro inesperado.', 'error');
        } else {
            if (id) {
                // If editing, go back to the post detail
                toast('Sucesso', 'Alterações salvas com sucesso.', 'success');
                navigate(`/community/post/${id}`);
            } else if (status === 'published') {
                toast('Sucesso!', 'Tópico publicado com sucesso.', 'success');
                navigate('/community');
            } else {
                toast('Rascunho salvo', 'Seu trabalho foi salvo com sucesso.', 'success');
                navigate('/community/my-posts');
            }
        }

        setShowPublishModal(false);
        setLoading(false);
        setSavingDraft(false);
    };

    if (initError) {
        return (
            <div className="p-8 text-center">
                <div className="text-red-500 mb-2 font-bold">Erro ao carregar editor</div>
                <div className="text-muted-foreground">{initError}</div>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-white rounded">Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background font-sans overflow-hidden">
            {/* Header */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-20 shrink-0">
                <div className="flex flex-col justify-center h-full">
                    <h1 className="text-xl font-bold text-foreground">{id ? 'Editar Tópico' : 'Criar Novo Tópico'}</h1>
                    <p className="text-[10px] text-muted-foreground hidden md:block">Compartilhe conhecimento, tire dúvidas ou mostre seu trabalho.</p>
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

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-[1200px] mx-auto space-y-6 pb-20">

                    {/* Top Section: Inputs */}
                    <div className="flex flex-col gap-4">
                        {/* Title (Full Width) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Um título curto e descritivo..."
                                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-foreground text-sm font-medium placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:bg-card transition-all"
                            />
                        </div>

                        {/* Category - Full Width */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Categoria</label>
                            <div className="relative">
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:bg-card transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Selecionar...</option>
                                    {categoryGroups.map(group => (
                                        <optgroup key={group.id} label={group.name} className="text-foreground bg-card font-bold">
                                            {group.categories.map(cat => (
                                                <option key={cat.id} value={cat.id} className="text-foreground bg-card py-1">
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-0 h-full flex items-center justify-center pointer-events-none text-muted-foreground">
                                    <ChevronDown size={14} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="space-y-2 flex-1 flex flex-col">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Conteúdo</label>
                        <div className="flex-1">
                            <RichEditor
                                value={content}
                                onChange={setContent}
                                placeholder="Escreva seu tópico aqui..."
                                minHeight="200px"
                            />
                        </div>
                    </div>

                    {/* Bottom Section: Tags */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1 flex items-center gap-2">
                            Tags <span className="text-[9px] opacity-50 font-normal normal-case">(Pressione Enter para adicionar)</span>
                        </label>
                        <div className="bg-muted/30 border border-border rounded-lg p-2 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all min-h-[42px] flex flex-wrap gap-2 items-center">
                            {tags.map(tag => (
                                <span key={tag} className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide flex items-center gap-1 animate-in zoom-in-50 duration-200">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-purple-300 ml-1">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={addTag}
                                placeholder={tags.length === 0 ? "Adicione tags relacionadas ao seu tópico... (Ex: RPG, Sci-Fi, Dúvida)" : ""}
                                className="bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground/50 flex-1 min-w-[200px]"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="border-t border-border p-4 bg-background/95 backdrop-blur z-20 shrink-0">
                <div className="max-w-[1200px] mx-auto flex items-center justify-end gap-3">
                    {!id && (
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={savingDraft || loading}
                            className="px-5 py-2 rounded-lg border border-border text-foreground font-bold hover:bg-muted transition-all disabled:opacity-50 text-xs uppercase tracking-wide flex items-center gap-2"
                        >
                            <Save size={14} />
                            {savingDraft ? 'Salvando...' : 'Salvar Rascunho'}
                        </button>
                    )}

                    {id && postStatus === 'draft' && (
                        <button
                            onClick={handleDeleteClick}
                            disabled={loading}
                            className="px-5 py-2 rounded-lg border border-red-500/20 text-red-500 font-bold hover:bg-red-500/10 transition-all disabled:opacity-50 text-xs uppercase tracking-wide flex items-center gap-2"
                        >
                            <Trash2 size={14} />
                            Excluir Rascunho
                        </button>
                    )}

                    <button
                        onClick={confirmPublish}
                        disabled={loading || savingDraft}
                        className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold hover:shadow-lg hover:shadow-purple-600/20 transition-all disabled:opacity-50 text-xs uppercase tracking-wide flex items-center gap-2"
                    >
                        {loading ? 'Publicando...' : 'Publicar Tópico'}
                        <Send size={14} />
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                onConfirm={() => handleSave('published')}
                title="Publicar Tópico"
                message="Tem certeza que deseja publicar este tópico? Ele ficará visível para toda a comunidade imediatamente."
                confirmText="Publicar Agora"
                confirmColor="bg-purple-600 hover:bg-purple-500"
            />

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={performDelete}
                title="Excluir Rascunho"
                message="Tem certeza que deseja excluir este rascunho permanentemente? Esta ação não pode ser desfeita."
                confirmText="Sim, Excluir"
                confirmColor="bg-red-600 hover:bg-red-500"
            />
        </div>
    );
};

export default CreatePost;
