import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronLeft, Save, Send, AlertCircle } from 'lucide-react';
import { Database } from '../types/supabase';
import { useToast } from '../components/ToastContext';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

type Category = Database['public']['Tables']['categories']['Row'];

// Confirmation Modal Component
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

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);

    const [showPublishModal, setShowPublishModal] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchPostData(id);
        }
    }, [id]);

    // Initialize Quill
    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            try {
                const quill = new Quill(editorRef.current, {
                    theme: 'snow',
                    placeholder: 'Comece a escrever seu tópico aqui...',
                    modules: {
                        toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link', 'image', 'code-block'],
                            ['clean']
                        ]
                    }
                });

                quill.on('text-change', () => {
                    // Get HTML content
                    const html = quill.root.innerHTML || '';
                    // If editor is empty (just <p><br></p>), set content to empty string
                    if (html === '<p><br></p>') {
                        setContent('');
                    } else {
                        setContent(html);
                    }
                });

                quillRef.current = quill;
            } catch (err: any) {
                console.error("Quill initialization error:", err);
                setInitError(err.message || 'Erro ao carregar editor');
            }
        }
    }, []);

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
        setCategoryId(data.category_id);

        // Update Quill content safely
        if (quillRef.current && data.content) {
            // Direct innerHTML assignment is safe and supported for initial load
            quillRef.current.root.innerHTML = data.content;
        }
    };

    const confirmPublish = () => {
        const strippedContent = content.replace(/<[^>]*>/g, '').trim();
        if (!title.trim() || !strippedContent) {
            toast('Campos obrigatórios', 'Por favor, preencha o título e o conteúdo.', 'error');
            return;
        }

        let validCategory = categoryId;
        if (!validCategory) {
            const defaultCat = categories.find(c => c.slug === 'general')?.id || categories[0]?.id;
            if (defaultCat) {
                validCategory = defaultCat;
                setCategoryId(defaultCat);
            } else {
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
            content, // HTML content from Quill
            author_id: user.id,
            category_id: validCategoryId,
            status: status,
            updated_at: new Date().toISOString()
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
        <div className="flex flex-col h-full max-w-5xl mx-auto p-4 font-sans">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/community')} className="text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{id ? 'Editar Tópico' : 'Novo Tópico'}</h1>
                            <p className="text-muted-foreground text-xs">{id ? 'Continue escrevendo sua discussão.' : 'Crie e compartilhe sua discussão com a comunidade.'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground ml-1">Título do Tópico</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Digite um título cativante..."
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                    />
                </div>

                <div className="bg-card border border-border rounded-lg flex flex-col flex-1 overflow-hidden">
                    {/* Quill Editor Container */}
                    <div ref={editorRef} className="quill-editor h-full text-foreground bg-background"></div>

                    {/* Styles override for dark mode adaptation */}
                    <style>{`
                        /* Base Toolbar & Container */
                        .ql-toolbar.ql-snow {
                            background-color: var(--muted) !important;
                            border-color: var(--border) !important;
                            border-top-left-radius: 0.5rem;
                            border-top-right-radius: 0.5rem;
                        }
                        .ql-container.ql-snow {
                            border-color: var(--border) !important;
                            border-bottom-left-radius: 0.5rem;
                            border-bottom-right-radius: 0.5rem;
                            background-color: var(--card) !important;
                            color: var(--foreground) !important;
                            font-family: inherit;
                            font-size: 0.875rem; 
                        }
                        
                        /* Editor Area */
                        .ql-editor {
                            min-height: 200px;
                        }
                        
                        /* --- ICONS VISIBILITY FIX --- */
                        /* Force all strokes to be white (or foreground variable) */
                        .ql-snow .ql-stroke,
                        .ql-toolbar .ql-stroke {
                            stroke: var(--foreground) !important;
                        }
                        
                        /* Force all fills to be white */
                        .ql-snow .ql-fill,
                        .ql-toolbar .ql-fill {
                            fill: var(--foreground) !important;
                        }
                        
                        /* Dropdown Pickers (Header, etc) */
                        .ql-snow .ql-picker {
                            color: var(--foreground) !important;
                        }
                        .ql-snow .ql-picker-label {
                            color: var(--foreground) !important;
                        }
                        .ql-snow .ql-picker-label::before {
                            color: var(--foreground) !important;
                        }
                        .ql-snow .ql-picker .ql-picker-label .ql-stroke {
                            stroke: var(--foreground) !important;
                        }

                        /* Hover States - Primary Color */
                        .ql-snow.ql-toolbar button:hover .ql-stroke,
                        .ql-snow.ql-toolbar button.ql-active .ql-stroke,
                        .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
                        .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke {
                            stroke: var(--primary) !important;
                        }
                        
                        .ql-snow.ql-toolbar button:hover .ql-fill,
                        .ql-snow.ql-toolbar button.ql-active .ql-fill,
                        .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
                        .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill {
                            fill: var(--primary) !important;
                        }
                        
                        .ql-snow.ql-toolbar button:hover,
                        .ql-snow.ql-toolbar button.ql-active,
                        .ql-snow.ql-toolbar .ql-picker-label:hover,
                        .ql-snow.ql-toolbar .ql-picker-item:hover {
                            color: var(--primary) !important;
                        }

                        /* Dropdown Options Background */
                        .ql-snow .ql-picker-options {
                            background-color: var(--card) !important;
                            border-color: var(--border) !important;
                        }
                        .ql-snow .ql-picker-item {
                            color: var(--foreground) !important;
                        }
                        
                        /* Placeholder */
                        .ql-editor.ql-blank::before {
                            color: var(--muted-foreground) !important;
                            font-style: normal;
                        }
                    `}</style>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="bg-card border border-border text-foreground text-[10px] rounded px-2 py-1 focus:outline-none focus:border-primary"
                    >
                        <option value="">Selecionar Categoria</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <span className="text-muted-foreground/50">|</span>
                    <span className="text-[10px]">{id ? 'Edição de rascunho' : 'Novo rascunho'}</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={savingDraft || loading}
                        className="px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-all disabled:opacity-50 text-xs flex items-center gap-1.5"
                    >
                        <Save size={14} />
                        {savingDraft ? 'Salvando...' : 'Salvar Rascunho'}
                    </button>
                    <button
                        onClick={confirmPublish}
                        disabled={loading || savingDraft}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold hover:shadow-lg hover:shadow-blue-600/20 transition-all disabled:opacity-50 text-xs flex items-center gap-1.5"
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
                confirmColor="bg-blue-600 hover:bg-blue-500"
            />
        </div>
    );
};

export default CreatePost;
