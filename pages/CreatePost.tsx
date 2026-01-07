import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Save, Send, AlertCircle, ChevronDown, Image as ImageIcon, Link as LinkIcon, LogOut, Upload, X } from 'lucide-react';
import { Database } from '../types/supabase';
import { useToast } from '../components/ToastContext';
import RichEditor from '../components/RichEditor';

type Category = Database['public']['Tables']['categories']['Row'];

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
    const [imageUrl, setImageUrl] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [showPublishModal, setShowPublishModal] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchPostData(id);
        }
    }, [id]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
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
        if (data.image_url) {
            setImageUrl(data.image_url);
        } else {
            // Fallback for legacy posts or if image was embedded
            // We prioritize content image if no explicit image_url
            const doc = new DOMParser().parseFromString(data.content, 'text/html');
            const firstImage = doc.querySelector('img')?.src || '';
            if (firstImage && !data.image_url) setImageUrl(firstImage);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast('Arquivo inválido', 'Por favor, selecione uma imagem.', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast('Arquivo muito grande', 'A imagem deve ter no máximo 5MB.', 'error');
            return;
        }

        setUploadingImage(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setUploadingImage(false);
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('forum-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('forum-images')
                .getPublicUrl(fileName);

            setImageUrl(publicUrl);
            toast('Sucesso', 'Imagem de capa enviada com sucesso.', 'success');
        } catch (error: any) {
            console.error('Upload Error:', error);
            toast('Erro no upload', 'Não foi possível enviar a imagem. Verifique se o bucket "forum-images" existe e é público.', 'error');
        } finally {
            setUploadingImage(false);
        }
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

    const handleSave = async (status: 'draft' | 'published') => {
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

        const postData = {
            title,
            content,
            author_id: user.id,
            category_id: validCategoryId,
            status: status,
            image_url: imageUrl || null,
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
            const { error: insertError } = await supabase
                .from('posts')
                .insert(postData);
            error = insertError;
        }

        if (error) {
            console.error('Error saving post:', error);
            toast('Erro ao salvar', error.message || 'Ocorreu um erro inesperado.', 'error');
        } else {
            if (status === 'published') {
                toast('Sucesso!', 'Tópico publicado com sucesso.', 'success');
                navigate('/community');
            } else {
                toast('Rascunho salvo', 'Seu trabalho foi salvo com sucesso.', 'success');
                if (!id) navigate('/community/my-posts');
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

                    {/* Top Section: Cover Image (Left) + Inputs (Right) */}
                    <div className="flex flex-col md:flex-row gap-6 items-stretch">

                        {/* Left Column: Cover Image Upload */}
                        <div className="w-full md:w-[250px] shrink-0 flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1 flex items-center gap-2">
                                <ImageIcon size={14} /> Capa
                            </label>
                            <div className="flex-1 min-h-[140px] bg-muted/10 rounded-lg border border-dashed border-border hover:border-purple-500/50 transition-all relative overflow-hidden group">
                                {!imageUrl ? (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-purple-400 p-4 text-center"
                                        disabled={uploadingImage}
                                    >
                                        {uploadingImage ? (
                                            <span className="text-xs animate-pulse">Enviando...</span>
                                        ) : (
                                            <>
                                                <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
                                                <span className="text-xs font-bold">Enviar Imagem</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <>
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                                title="Trocar Imagem"
                                            >
                                                <Upload size={14} />
                                            </button>
                                            <button
                                                onClick={() => setImageUrl('')}
                                                className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                                title="Remover"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>

                        {/* Right Column: Title, Category, Tags */}
                        <div className="flex-1 flex flex-col gap-4">
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

                            {/* Row: Category + Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Categoria</label>
                                    <div className="relative">
                                        <select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:bg-card transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Selecionar...</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-0 h-full flex items-center justify-center pointer-events-none text-muted-foreground">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Tags</label>
                                    <div className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 min-h-[38px] flex flex-wrap gap-2 items-center focus-within:ring-1 focus-within:ring-purple-500/50 focus-within:bg-card transition-all">
                                        {tags.map((tag, i) => (
                                            <span key={i} className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 group whitespace-nowrap">
                                                {tag}
                                                <button onClick={() => removeTag(tag)} className="hover:text-purple-300">
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={addTag}
                                            className="bg-transparent text-xs focus:outline-none flex-1 min-w-[60px] h-full"
                                            placeholder={tags.length === 0 ? "Ex: Dúvida, Tutorial..." : ""}
                                        />
                                    </div>
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
                                minHeight="300px"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={savingDraft || loading}
                            className="px-5 py-2 rounded-lg border border-border text-foreground font-bold hover:bg-muted transition-all disabled:opacity-50 text-xs uppercase tracking-wide flex items-center gap-2"
                        >
                            <Save size={14} />
                            {savingDraft ? 'Salvando...' : 'Salvar Rascunho'}
                        </button>
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
        </div>
    );
};

export default CreatePost;
