import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { useToast } from './ToastContext';
import { Image, Hash, Type, Code, Eye, Edit3, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Category = Database['public']['Tables']['categories']['Row'];

interface CreateTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateTopicModal: React.FC<CreateTopicModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*').order('name');
        if (data) setCategories(data);
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = currentTag.trim();
            if (tag && !tags.includes(tag) && tags.length < 5) {
                setTags([...tags, tag]);
                setCurrentTag('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Simple Markdown to HTML parser for preview
    const parseMarkdown = (text: string) => {
        let html = text
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-purple-400">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-purple-400 border-b border-purple-500/20 pb-1">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-purple-400 border-b border-purple-500/20 pb-2">$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' class='rounded-lg max-h-96 mx-auto my-4 border border-zinc-700 shadow-lg' />")
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' class='text-purple-400 hover:underline'>$1</a>")
            .replace(/`([^`]+)`/gim, '<code class="bg-zinc-800 text-purple-300 px-1.5 py-0.5 rounded font-mono text-sm border border-zinc-700">$1</code>')
            .replace(/\n/gim, '<br />');

        // Code blocks
        html = html.replace(/```([^`]+)```/gim, '<pre class="bg-[#151515] p-4 rounded-lg my-4 overflow-x-auto border border-zinc-800 font-mono text-sm text-zinc-300">$1</pre>');

        return html;
    };

    const handleSubmit = async () => {
        if (!selectedCategory || !title.trim() || !content.trim()) {
            toast('Campos obrigatórios', 'Preencha todos os campos obrigatórios.', 'error');
            return;
        }

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast('Erro', 'Usuário não autenticado.', 'error');
            setLoading(false);
            return;
        }

        // Convert Markdown to basic HTML for storage if needed, or store as is.
        // Assuming the app expects HTML content as used in PostDetail.
        const htmlContent = parseMarkdown(content);

        const { data, error } = await supabase.from('posts').insert({
            title: title.trim(),
            content: htmlContent, // Storing HTML for compatibility with existing views
            category_id: selectedCategory,
            author_id: user.id,
            status: 'published', // Or 'draft'
            // tags: tags // If tags are supported in DB, handle here. Assuming not in schema for now based on types.
        }).select().single();

        if (error) {
            console.error(error);
            toast('Erro', 'Falha ao criar tópico.', 'error');
        } else {
            toast('Sucesso', 'Tópico criado com sucesso!', 'success');
            onClose();
            // Reset form
            setTitle('');
            setContent('');
            setTags([]);
            setSelectedCategory(null);
            navigate(`/community/topic/${data.id}`);
        }
        setLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Novo Tópico" size="lg">
            <div className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Hash size={14} /> Categoria
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map(cat => (
                            <div
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`cursor-pointer border rounded-xl p-4 transition-all hover:-translate-y-1 hover:shadow-lg ${selectedCategory === cat.id
                                        ? 'bg-purple-900/20 border-purple-500 ring-1 ring-purple-500/50'
                                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                                    }`}
                            >
                                <span className={`block font-bold text-center ${selectedCategory === cat.id ? 'text-purple-400' : 'text-zinc-400'}`}>
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Title Input */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Type size={14} /> Título
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Um título curto e descritivo..."
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all font-bold"
                    />
                </div>

                {/* Content Editor */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <Code size={14} /> Conteúdo (Markdown)
                        </label>
                        <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
                            <button
                                onClick={() => setPreviewMode(false)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!previewMode ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Edit3 size={12} /> Editor
                            </button>
                            <button
                                onClick={() => setPreviewMode(true)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${previewMode ? 'bg-purple-900/20 text-purple-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Eye size={12} /> Preview
                            </button>
                        </div>
                    </div>

                    <div className="relative min-h-[300px]">
                        {!previewMode ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Escreva seu tópico aqui... Use Markdown para formatar."
                                className="w-full h-[300px] bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all font-mono text-sm resize-none custom-scrollbar"
                            />
                        ) : (
                            <div
                                className="w-full h-[300px] bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 overflow-y-auto prose prose-invert max-w-none custom-scrollbar"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(content) || '<p class="text-zinc-600 italic">Nada para visualizar...</p>' }}
                            />
                        )}

                        {!previewMode && (
                            <div className="absolute bottom-4 right-4 text-xs text-zinc-600 font-mono bg-zinc-900/80 px-2 py-1 rounded border border-zinc-800">
                                Markdown Suportado
                            </div>
                        )}
                    </div>
                </div>

                {/* Tags Input */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Hash size={14} /> Tags (Opcional)
                    </label>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2 flex flex-wrap items-center gap-2 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
                        {tags.map(tag => (
                            <span key={tag} className="bg-purple-500/10 text-purple-400 text-xs font-bold px-2 py-1 rounded-lg border border-purple-500/20 flex items-center gap-1 group">
                                #{tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-purple-200"><X size={10} /></button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder={tags.length === 0 ? "Adicione tags..." : ""}
                            className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder-zinc-600 min-w-[120px] flex-1"
                            disabled={tags.length >= 5}
                        />
                    </div>
                    <p className="text-[10px] text-zinc-600">Pressione Enter ou vírgula para adicionar tags.</p>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end pt-4 border-t border-zinc-800">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors mr-4"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Criar Tópico'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
