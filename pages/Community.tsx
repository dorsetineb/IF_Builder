
import React from 'react';

const Community: React.FC = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Comunidade</h1>
                    <p className="text-zinc-400">Discuta, aprenda e compartilhe seus jogos com outros criadores.</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                    Novo Tópico
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Categories Sidebar */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Fóruns</h3>
                        <ul className="space-y-1">
                            {['Geral', 'Dúvidas Técnicas', 'Showcase', 'Tutoriais', 'Off-topic'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="block px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 text-sm font-medium transition-colors">
                                        # {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Topics List */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Topic Item */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer group">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0"></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-semibold text-lg group-hover:text-purple-400 transition-colors">Título do tópico de discussão interessante {i}</h3>
                                        <span className="text-xs text-zinc-500 whitespace-nowrap">2h atrás</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm mt-1 mb-3 line-clamp-2">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1">💬 14 respostas</span>
                                        <span className="flex items-center gap-1">🔥 124 views</span>
                                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">Dúvida</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Community;
