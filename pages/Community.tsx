import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { MessageSquare, Search, Plus, Filter, User, Clock, MessageCircle, Pin, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

type Category = Database['public']['Tables']['categories']['Row'];
type Post = Database['public']['Tables']['posts']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
    categories: Database['public']['Tables']['categories']['Row'];
    comments: { count: number }[];
};

const Community: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, [selectedCategory]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
    };

    const fetchPosts = async () => {
        setLoading(true);
        let query = supabase
            .from('posts')
            .select(`
                *,
                profiles:author_id (*),
                categories:category_id (*),
                comments:comments(count)
            `)
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (selectedCategory !== 'all') {
            query = query.eq('category_id', selectedCategory);
        }

        const { data, error } = await query;
        if (error) console.error('Error fetching posts:', error);
        if (data) setPosts(data as any);
        setLoading(false);
    };

    const getCategoryColor = (slug: string) => {
        const colors: Record<string, string> = {
            'technical': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'showcase': 'bg-green-500/10 text-green-400 border-green-500/20',
            'help': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            'general': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            'off-topic': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
        };
        return colors[slug] || colors['general'];
    };

    const getCategoryLabel = (slug: string) => {
        const labels: Record<string, string> = {
            'technical': 'TÉCNICO',
            'showcase': 'SHOWCASE',
            'help': 'AJUDA',
            'general': 'GERAL',
            'off-topic': 'OFF-TOPIC'
        };
        return labels[slug] || 'GERAL';
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-[1600px] mx-auto font-sans h-[calc(100vh-61px)] overflow-y-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Fórum da Comunidade</h1>
                        <p className="text-zinc-400">Discuta, aprenda e compartilhe seus projetos de ficção interativa.</p>
                    </div>

                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Pesquisar tópicos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder-zinc-600"
                        />
                        <Search className="absolute left-3 top-2.5 text-zinc-600" size={18} />
                    </div>
                </div>

                {/* Hero Box */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex justify-between items-center bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Discussões Recentes</h2>
                        <p className="text-zinc-400 text-sm">Participe das conversas sobre narrativa, código e design.</p>
                    </div>
                    <Link to="/community/create" className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-5 rounded-lg transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2 text-sm">
                        <Plus size={18} />
                        Criar Novo Tópico
                    </Link>
                </div>

                {/* Filters & Controls */}
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
                        >
                            Todos
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <span className="uppercase text-[10px] font-bold tracking-wider text-zinc-500">ORDERNAR POR:</span>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                            <span className="font-medium text-white">Mais Recentes</span>
                            <ChevronLeft className="-rotate-90" size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Topics List - Table Layout */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-900/50 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <div className="col-span-12 lg:col-span-7">Tópico</div>
                    <div className="col-span-2 hidden lg:block">Criador</div>
                    <div className="col-span-1 hidden lg:block text-center">Respostas</div>
                    <div className="col-span-2 hidden lg:block text-right">Última Interação</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-zinc-800/50">
                    {loading ? (
                        <div className="p-12 text-center text-zinc-500">Carregando discussões...</div>
                    ) : (
                        filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <div key={post.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-zinc-900/30 transition-colors group items-center">
                                    <div className="col-span-12 lg:col-span-7 flex gap-4 min-w-0">
                                        <div className="flex-shrink-0 mt-1">
                                            <MessageSquare size={20} className="text-zinc-600 group-hover:text-purple-400 transition-colors" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                {post.categories && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(post.categories.slug)}`}>
                                                        {getCategoryLabel(post.categories.slug)}
                                                    </span>
                                                )}
                                                <Link to={`/community/post/${post.id}`} className="font-semibold text-zinc-200 hover:text-white truncate transition-colors">
                                                    {post.title}
                                                </Link>
                                            </div>
                                            <p className="text-sm text-zinc-500 truncate pr-4 group-hover:text-zinc-400 transition-colors">
                                                {post.content.replace(/[#*`]/g, '').slice(0, 120)}...
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 hidden lg:flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700/50">
                                            {post.profiles?.avatar_url ? (
                                                <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={14} className="text-zinc-500" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-zinc-300">{post.profiles?.username || 'Anon'}</span>
                                    </div>

                                    <div className="col-span-1 hidden lg:flex items-center justify-center">
                                        <span className="text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full">
                                            {post.comments && post.comments[0] ? post.comments[0].count : 0}
                                        </span>
                                    </div>

                                    <div className="col-span-2 hidden lg:flex flex-col items-end justify-center text-right">
                                        <span className="text-sm font-medium text-zinc-300">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-zinc-600">
                                            por {post.profiles?.username || 'Anon'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-zinc-500">Nenhum tópico encontrado.</div>
                        )
                    )}
                </div>
            </div>

            {/* Pagination (Visual only for now) */}
            <div className="flex justify-center mt-8 cursor-not-allowed opacity-50">
                <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-zinc-800 text-zinc-400 text-xs hover:bg-zinc-700"><ChevronLeft size={14} /></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-purple-600 text-white text-xs font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs hover:bg-zinc-800">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs hover:bg-zinc-800">3</button>
                    <span className="w-8 h-8 flex items-center justify-center text-zinc-600 text-xs">...</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs hover:bg-zinc-800">12</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-zinc-800 text-zinc-400 text-xs hover:bg-zinc-700"><ChevronRight size={14} /></button>
                </div>
            </div>
        </div>
    );
};

export default Community;
