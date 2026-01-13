
import React from 'react';
import { BookOpen, Map, Box, Gamepad2, Play } from 'lucide-react';

export const GuideView: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500 pb-20">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-4">Guia Rápido</h2>
                <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
                    O IF Builder permite criar jogos de ficção interativa (Interactive Fiction). O jogo é composto por <strong>Cenas</strong>, onde o jogador lê descrições, observa imagens e digita comandos (verbos) para interagir com <strong>Objetos</strong> e navegar pelo mundo.
                </p>
            </div>

            <div className="space-y-12">
                {/* 1. Editor de Cenas */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">1. Editor de Cenas</h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-3 pl-12">
                        <p>Cada cena é um local ou momento no seu jogo.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Texto Interativo:</strong> Use a sintaxe <code className="bg-muted px-1 rounded">&lt;palavra&gt;</code> na descrição. Isso tornará a palavra clicável, facilitando comandos.</li>
                            <li><strong>Imagem e Música:</strong> Cada cena pode ter uma imagem de fundo e trilha sonora próprias.</li>
                            <li><strong>Cena Inicial:</strong> Defina qual cena será o ponto de partida no menu lateral.</li>
                        </ul>
                    </div>
                </div>

                {/* 2. Biblioteca de Objetos */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Box className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">2. Biblioteca de Objetos</h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-3 pl-12">
                        <p>Os objetos são globais (ex: "Chave de Ouro"). Crie uma vez e vincule a múltiplas cenas ou use no inventário.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Exame:</strong> Defina uma descrição detalhada que o jogador verá ao usar o comando "olhar" ou "examinar".</li>
                        </ul>
                    </div>
                </div>

                {/* 3. Interações */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                            <Gamepad2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">3. Interações (O coração do jogo)</h3>
                    </div>
                    <div className="text-sm text-muted-foreground pl-12">
                        <p className="mb-4">Definem o que acontece quando o jogador digita um comando.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ul className="space-y-1 text-xs">
                                <li><strong className="text-foreground">Verbos:</strong> Palavras que ativam a ação (ex: abrir, usar).</li>
                                <li><strong className="text-foreground">Alvo:</strong> Objeto da cena afetado (ex: Porta).</li>
                                <li><strong className="text-foreground">Requisito:</strong> Item necessário no inventário (ex: Chave).</li>
                                <li><strong className="text-foreground">Resultado:</strong> O que acontece (ex: ir para cena, mudar texto).</li>
                            </ul>

                            <div className="bg-muted/30 p-4 rounded-lg text-xs italic border border-muted-foreground/10">
                                <p className="font-bold not-italic mb-2 text-foreground">Exemplo:</p>
                                <p className="mb-1">"Destrancar porta com a chave"</p>
                                <div className="grid grid-cols-2 gap-2 mt-2 opacity-80">
                                    <span>Verbo: Destrancar</span>
                                    <span>Alvo: Porta</span>
                                    <span>Requisito: Chave</span>
                                </div>
                                <p className="mt-3 not-italic text-[10px] opacity-70">💡 Dica: O sistema entende ordens variadas (ex: "Usar chave na porta").</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Rastreadores */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                            <Map className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">4. Rastreadores de Consequência</h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2 pl-12">
                        <p>Use para criar sistemas como <strong>Vida</strong>, <strong>Dinheiro</strong> ou <strong>Estresse</strong>.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Interações podem aumentar ou diminuir o valor.</li>
                            <li>Quando atinge o máximo, transporta o jogador para uma Cena de Consequência (ex: Game Over).</li>
                        </ul>
                    </div>
                </div>

                {/* 5. Finalização */}
                <div className="space-y-3 pt-6 border-t border-muted-foreground/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-500/10 rounded-lg text-zinc-500">
                            <Play className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">5. Finalização e Exportação</h3>
                    </div>

                    <div className="text-sm text-muted-foreground pl-12 space-y-3">
                        <p>Quando seu jogo estiver pronto:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Use o botão <strong>Pré-visualizar</strong> para testar toda a experiência.</li>
                            <li>Clique em <strong>Exportar Jogo</strong> para baixar um arquivo .zip.</li>
                            <li>Extraia o zip e abra o arquivo <strong>index.html</strong> para jogar ou compartilhar!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
