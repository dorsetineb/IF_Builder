
import React from 'react';

const Profile: React.FC = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Meu Perfil</h1>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-8">
                <div className="h-32 bg-gradient-to-r from-purple-900 to-indigo-900"></div>
                <div className="px-8 pb-8 relative">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 -mt-12 mb-4 relative z-10"></div>

                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Autor Desconhecido</h2>
                            <p className="text-zinc-400">@usuario_123</p>
                        </div>
                        <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded-lg border border-zinc-700 transition-colors">
                            Editar Perfil
                        </button>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-white">3</span>
                            <span className="text-sm text-zinc-500">Projetos</span>
                        </div>
                        <div className="text-center border-l border-zinc-800">
                            <span className="block text-2xl font-bold text-white">124</span>
                            <span className="text-sm text-zinc-500">Seguidores</span>
                        </div>
                        <div className="text-center border-l border-zinc-800">
                            <span className="block text-2xl font-bold text-white">1.2k</span>
                            <span className="text-sm text-zinc-500">Leituras</span>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Configurações da Conta</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                    <input type="email" value="usuario@email.com" readOnly className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-300 focus:outline-none focus:border-purple-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Nome de Exibição</label>
                    <input type="text" defaultValue="Autor Desconhecido" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-300 focus:outline-none focus:border-purple-500" />
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-end">
                    <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
