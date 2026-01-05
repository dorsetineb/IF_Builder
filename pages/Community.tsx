import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { MessageSquare, CircleHelp, Gamepad2, BookOpen, Coffee } from 'lucide-react';
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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
                comments:comments (count)
            `)
            .order('created_at', { ascending: false });

        if (selectedCategory) {
            query = query.eq('category_id', selectedCategory);
        }

        const { data, error } = await query;
        if (error) console.error('Error fetching posts:', error);
        if (data) setPosts(data as any);
        setLoading(false);
    };

    const getIcon = (iconName: string | null) => {
        switch (iconName) {
            case 'MessageSquare': return <MessageSquare size={16} />;
            case 'CircleHelp': return <CircleHelp size={16} />;
            case 'Gamepad2': return <Gamepad2 size={16} />;
            case 'BookOpen': return <BookOpen size={16} />;
            case 'Coffee': return <Coffee size={16} />;
            default: return <MessageSquare size={16} />;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Comunidade</h1>
                    <p className="text-zinc-400">Discuta, aprenda e compartilhe seus jogos com outros criadores.</p>
                </div>
                <Link to="/community/create" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-purple-900/20">
                    Novo Tópico
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Categories Sidebar */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Fóruns</h3>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === null ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                                        }`}
                                >
                                    # Todos os Tópicos
                                </button>
                            </li>
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedCategory === category.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                                            }`}
                                    >
                                        {getIcon(category.icon_name)}
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Topics List */}
                <div className="lg:col-span-3 space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-zinc-500">Carregando discussões...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
                            <p className="text-zinc-400 mb-4">Nenhum tópico encontrado nesta categoria.</p>
                            <button className="text-purple-400 hover:text-purple-300">Seja o primeiro a postar!</button>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <Link to={`/community/post/${post.id}`} key={post.id} className="block bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer group">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        {post.profiles?.avatar_url ? (
                                            <img src={post.profiles.avatar_url} alt={post.profiles.username || ''} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-zinc-500 font-bold">{post.profiles?.username?.[0]?.toUpperCase() || '?'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-semibold text-lg group-hover:text-purple-400 transition-colors">{post.title}</h3>
                                            <span className="text-xs text-zinc-500 whitespace-nowrap">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-zinc-400 text-sm mt-1 mb-3 line-clamp-2">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1">
                                                <MessageSquare size={14} /> {post.comments?.[0]?.count || 0} respostas
                                            </span>
                                            {post.categories && (
                                                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                    {post.categories.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;
