import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image, Quote, ChevronLeft, Save, Send, Maximize2 } from 'lucide-react';
import { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];

const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<string>(''); // Default to be selected
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);

    React.useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
    };

    const handleSave = async (status: 'draft' | 'published') => {
        if (!title.trim() || !content.trim()) {
            alert('Por favor, preencha o título e o conteúdo.');
            return;
        }

        if (status === 'published' && !categoryId) {
            // If publishing, maybe require a category? For now let's be flexible or pick the first one default
            const defaultCat = categories.find(c => c.slug === 'general')?.id || categories[0]?.id;
            if (defaultCat) setCategoryId(defaultCat);
            else {
                alert("Selecione uma categoria para publicar.");
                return;
            }
        }

        if (status === 'draft') setSavingDraft(true);
        else setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('Você precisa estar logado.');
            setLoading(false);
            setSavingDraft(false);
            return;
        }

        const postData = {
            title,
            content,
            author_id: user.id,
            category_id: categoryId || categories.find(c => c.slug === 'general')?.id,
            status: status
        };

        const { error } = await supabase.from('posts').insert(postData);

        if (error) {
            console.error('Error creating post:', error);
            alert('Erro ao salvar.');
        } else {
            if (status === 'published') {
                navigate('/community');
            } else {
                alert('Rascunho salvo com sucesso!');
            }
        }

        setLoading(false);
        setSavingDraft(false);
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto p-6 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/community')} className="text-zinc-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                            <span>Minhas Histórias</span>
                            <span>›</span>
                            <span>Nova Postagem</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Nova História</h1>
                        <p className="text-zinc-500 text-sm">Crie e compartilhe sua próxima aventura interativa.</p>
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-6 flex-1 flex flex-col">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300 ml-1">Título da Aventura</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Digite um título cativante..."
                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-5 py-4 text-white text-lg placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                    />
                </div>

                <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl flex flex-col flex-1 overflow-hidden focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-3 border-b border-zinc-800 bg-zinc-900/30">
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"><Bold size={18} /></button>
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"><Italic size={18} /></button>
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"><Underline size={18} /></button>
                        <div className="w-px h-6 bg-zinc-800 mx-2"></div>
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"><List size={18} /></button>
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"><ListOrdered size={18} /></button>
                        <div className="w-px h-6 bg-zinc-800 mx-2"></div>
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"><LinkIcon size={18} /></button>
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"><Image size={18} /></button>
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"><Quote size={18} /></button>
                        <div className="flex-1"></div>
                        <button className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-zinc-800 rounded transition-colors flex items-center gap-2 text-xs font-medium">
                            <Maximize2 size={16} /> Modo Foco
                        </button>
                    </div>

                    {/* Editor Area */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Comece a escrever sua história aqui...&#10;&#10;O vento uivava através das árvores antigas..."
                        className="flex-1 w-full bg-transparent border-none p-6 text-zinc-300 placeholder-zinc-600 resize-none focus:ring-0 leading-relaxed text-base"
                    ></textarea>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    {/* Optional: Add category selector here if needed, or simple Draft status */}
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-purple-500"
                    >
                        <option value="">Selecionar Categoria</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <span className="text-zinc-600">|</span>
                    <span>Salvo como rascunho às 14:05</span>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={savingDraft || loading}
                        className="px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50 text-sm flex items-center gap-2"
                    >
                        <Save size={16} />
                        {savingDraft ? 'Salvando...' : 'Salvar Rascunho'}
                    </button>
                    <button
                        onClick={() => handleSave('published')}
                        disabled={loading || savingDraft}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold hover:shadow-lg hover:shadow-blue-600/20 transition-all disabled:opacity-50 text-sm flex items-center gap-2"
                    >
                        {loading ? 'Publicando...' : 'Publicar História'}
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
