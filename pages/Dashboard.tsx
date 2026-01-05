
import React from 'react';
import { Plus, BookOpen, Eye, MessageSquare, Star, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto font-sans text-sm">
            {/* Top Row: Welcome (2/3) + Create Game (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Welcome Widget */}
                <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-xl border border-zinc-800 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <h1 className="text-2xl font-bold text-white mb-2 relative z-10">Bem-vindo de volta, Autor!</h1>
                    <p className="text-zinc-400 mb-6 max-w-md relative z-10 text-sm leading-relaxed">
                        Você tem 3 rascunhos pendentes e sua última história "Fuja da Masmorra" recebeu 12 novos comentários.
                    </p>
                    <div className="flex gap-3 relative z-10">
                        <Link to="/editor" className="bg-zinc-100 hover:bg-white text-zinc-900 font-semibold py-2 px-4 rounded-md transition-colors text-xs">
                            Continuar Editando
                        </Link>
                    </div>
                    <BookOpen className="absolute bottom-4 right-8 text-zinc-800 w-24 h-24 opacity-30 rotate-12" />
                </div>

                {/* Create Game Button (Replaces Stats) */}
                <Link to="/editor" className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all group cursor-pointer lg:col-span-1 h-full min-h-[160px]">
                    <div className="w-12 h-12 rounded-full bg-purple-600/10 text-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <Plus size={24} />
                    </div>
                    <h2 className="text-white font-bold text-lg">Criar Jogo</h2>
                    <p className="text-zinc-500 text-xs mt-1">Inicie uma nova jornada interativa</p>
                </Link>
            </div>

            {/* Middle Row: My Posts (2/3) + Stats (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            Minhas postagens
                        </h2>
                        <Link to="/community" className="text-purple-400 hover:text-purple-300 text-xs font-medium">Ver tudo</Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Post Item 1 */}
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer group flex gap-4 items-center">
                            <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-500 flex-shrink-0">
                                <MessageSquare size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-zinc-200 font-medium truncate group-hover:text-purple-400 transition-colors">Dúvida sobre variáveis globais</h3>
                                <p className="text-zinc-500 text-xs truncate">Publicado em Dúvidas Técnicas • há 2 horas</p>
                            </div>
                            <div className="flex gap-4 text-xs text-zinc-500">
                                <span className="flex items-center gap-1"><i className="w-1.5 h-1.5 rounded-full bg-green-500"></i> 3 respostas</span>
                            </div>
                        </div>

                        {/* Post Item 2 */}
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer group flex gap-4 items-center">
                            <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-500 flex-shrink-0">
                                <MessageSquare size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-zinc-200 font-medium truncate group-hover:text-purple-400 transition-colors">Showcase: Fuja da Masmorra v0.1</h3>
                                <p className="text-zinc-500 text-xs truncate">Publicado em Showcase • ontem</p>
                            </div>
                            <div className="flex gap-4 text-xs text-zinc-500">
                                <span className="flex items-center gap-1">12 likes</span>
                                <span className="flex items-center gap-1">5 coments</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Widget (Moved here) */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col justify-center relative overflow-hidden min-h-[160px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                    <div className="flex items-center gap-2 mb-2 text-purple-400">
                        <Eye size={18} />
                        <h2 className="font-semibold text-xs uppercase tracking-wider">Leituras Totais</h2>
                    </div>
                    <span className="text-4xl font-bold text-white mb-2 tracking-tight">24.5k</span>
                    <div className="inline-flex items-center text-xs text-green-400 bg-green-400/10 self-start px-2 py-1 rounded backdrop-blur-sm">
                        <span className="mr-1">↗</span> +12% este mês
                    </div>
                </div>
            </div>

            {/* Bottom Row: Favorite Posts (2/3) + Favorite Authors (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            Postagens favoritas
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-zinc-800 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded border border-zinc-700">Tutorial</span>
                                    <Heart size={14} className="text-red-500 fill-red-500" />
                                </div>
                                <h4 className="text-zinc-200 font-medium text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
                                    {i === 1 ? "Como criar sistemas de combate complexos" : "Guia de narrativa não-linear"}
                                </h4>
                                <p className="text-zinc-500 text-xs line-clamp-2 mb-3">
                                    {i === 1 ? "Um tutorial passo a passo sobre como gerenciar estados de inimigos e turnos..." : "Dicas para garantir que todas as ramificações da história façam sentido..."}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-zinc-600">
                                    <div className="w-4 h-4 rounded-full bg-zinc-700"></div>
                                    <span>{i === 1 ? "DevMaster" : "StoryWeaver"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            Autores favoritos
                        </h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex items-center gap-3 hover:border-zinc-700 cursor-pointer transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-purple-900/20 group-hover:text-purple-400 transition-colors">
                                    <User size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-zinc-200 font-medium text-sm truncate">{i === 1 ? "neoguy" : i === 2 ? "silenthill" : "pixel_art"}</h4>
                                    <p className="text-zinc-500 text-xs truncate">{i === 1 ? "12 jogos" : i === 2 ? "5 jogos" : "8 jogos"}</p>
                                </div>
                                <button className="text-zinc-600 hover:text-yellow-500 transition-colors">
                                    <Star size={16} className="fill-current" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
