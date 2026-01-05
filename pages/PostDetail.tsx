
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, MessageSquare, Share2, MoreVertical } from 'lucide-react';

const PostDetail: React.FC = () => {
    const { id } = useParams();

    // Mock data based on ID (simplificado para demo)
    const post = {
        title: "Dúvida sobre variáveis globais persistentes",
        author: "@rodbe",
        date: "2 horas atrás",
        category: "Dúvidas Técnicas",
        content: `Olá pessoal!
        
Estou criando um RPG onde o jogador pode guardar itens em um baú em uma cena e recuperá-los em outra cena muito à frente. 

Tentei usar as variáveis padrão, mas parece que quando troco de cena algumas coisas resetam se eu não salvar. Alguém tem um exemplo de como usar o sistema de GlobalObjects para criar um contêiner persistente?

Obrigado!`,
        comments: [
            { id: 1, author: "@CodeMaster", content: "Você precisa garantir que o objeto esteja na lista de 'Global Objects' e não apenas instanciado na cena. Dê uma olhada na documentação sobre 'Persistência de Estado'.", votes: 5 },
            { id: 2, author: "@NovatoDev", content: "Também estou com essa dúvida! +1", votes: 1 }
        ]
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans">
            <Link to="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors text-sm">
                <ChevronLeft size={16} className="mr-1" /> Voltar para o Dashboard
            </Link>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2 mb-2">
                            <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/20 font-medium">{post.category}</span>
                        </div>
                        <button className="text-zinc-500 hover:text-white">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-3">{post.title}</h1>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 font-bold border border-purple-500/30">
                            RD
                        </div>
                        <div>
                            <p className="text-zinc-200 text-sm font-medium">{post.author}</p>
                            <p className="text-zinc-500 text-xs">{post.date}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-zinc-950/30 border-t border-zinc-800 flex gap-4">
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-green-400 px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                        <ThumbsUp size={18} /> <span className="text-sm">12</span>
                    </button>
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                        <MessageSquare size={18} /> <span className="text-sm">2 comentários</span>
                    </button>
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors ml-auto">
                        <Share2 size={18} /> <span className="text-sm">Compartilhar</span>
                    </button>
                </div>
            </div>

            {/* Comments Area */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Respostas (2)</h3>
                <div className="space-y-4">
                    {post.comments.map(comment => (
                        <div key={comment.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                                <span className="font-bold text-zinc-200 text-sm">{comment.author}</span>
                                <span className="text-zinc-600 text-xs">há 1 hora</span>
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">{comment.content}</p>
                            <div className="flex items-center gap-4">
                                <button className="text-zinc-500 hover:text-zinc-300 text-xs font-medium flex items-center gap-1">
                                    <ThumbsUp size={12} /> {comment.votes} Útil
                                </button>
                                <button className="text-zinc-500 hover:text-zinc-300 text-xs font-medium">
                                    Responder
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0"></div>
                <div className="flex-1">
                    <textarea
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-zinc-600 resize-none h-20"
                        placeholder="Escreva uma resposta..."
                    ></textarea>
                    <div className="flex justify-end pt-2 border-t border-zinc-800 mt-2">
                        <button className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold py-1.5 px-4 rounded transition-colors">
                            Responder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
