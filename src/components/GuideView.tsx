
import React from 'react';
import { BookOpen, Map, Box, Gamepad2, Play, Command, Scroll, Activity, SlidersHorizontal, Download, Lightbulb, ChevronDown } from 'lucide-react';

export const GuideView: React.FC = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500 pb-20">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Guia Rápido</h2>
                <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed mb-6">
                    O IF Builder permite criar ficções interativas, narrativas textuais onde o jogador interage com a história por meio de escolhas ou comandos (verbos). A ficção é composta por <strong>Cenas</strong>, onde o usuário lê descrições, observa imagens e toma decisões para interagir com <strong>objetos</strong> e <strong>navegar pelo mundo</strong>.
                </p>

                {/* Table of Contents Listbox */}
                <div className="p-4 bg-muted/30 rounded-lg border border-muted-foreground/10">
                    <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Índice do Guia</label>
                    <div className="relative">
                        <select
                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm appearance-none focus:ring-1 focus:ring-primary outline-none text-foreground cursor-pointer shadow-sm"
                            onChange={(e) => {
                                scrollToSection(e.target.value);
                                e.target.value = ""; // Reset selection nicely
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Selecione um capítulo para navegar...</option>
                            <option value="section-scenes">1. Editor de Cenas</option>
                            <option value="section-objects">2. Biblioteca de Objetos</option>
                            <option value="section-interactions">3. Interações</option>
                            <option value="section-globals">4. Comandos Globais</option>
                            <option value="section-vignettes">5. Vinhetas</option>
                            <option value="section-trackers">6. Rastreadores de Consequência</option>
                            <option value="section-map">7. Mapa de Conexões</option>
                            <option value="section-settings">8. Configurações do Jogo</option>
                            <option value="section-preview">9. Pré-visualização e Teste</option>
                            <option value="section-export">10. Finalização e Exportação</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                {/* 1. Editor de Cenas */}
                <div id="section-scenes" className="space-y-3 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">1. Editor de Cenas</h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-3 pl-12">
                        <p>Cada cena é um local ou momento no seu jogo.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Nome e Descrição:</strong> Defina o título e o texto que o jogador verá ao entrar na cena.</li>
                            <li><strong>Texto Interativo:</strong> Utilize <code className="bg-muted px-1 rounded">&lt; &gt;</code> em uma palavra para torná-la clicável (ex: <code className="bg-muted px-1 rounded">&lt;porta&gt;</code>).</li>
                            <li><strong>Imagem e Música:</strong> Cada cena pode ter uma imagem de fundo e trilha sonora próprias.</li>
                            <li><strong>Cena Inicial:</strong> Defina qual cena será o ponto de partida no menu lateral.</li>
                            <li><strong>Cena de Encerramento:</strong> Marque uma cena como final para encerrar a narrativa.</li>
                        </ul>
                    </div>
                </div>

                {/* 2. Biblioteca de Objetos */}
                <div id="section-objects" className="space-y-3 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Box className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">2. Biblioteca de Objetos</h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-3 pl-12">
                        <p>Os objetos são <strong>globais</strong> e podem ser reutilizados em múltiplas cenas.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Nome:</strong> Identificador do objeto (ex: "Chave de Ouro").</li>
                            <li><strong>Exame:</strong> Descrição detalhada que o jogador vê ao usar "examinar" ou "olhar".</li>
                            <li><strong>Imagem:</strong> Adicione uma imagem opcional para representar o objeto.</li>
                            <li><strong>Coletável:</strong> Marque se o objeto pode ser adicionado ao inventário.</li>
                        </ul>
                    </div>
                </div>

                {/* 3. Interações */}
                <div id="section-interactions" className="space-y-3 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                            <Gamepad2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">3. Interações (O coração do jogo)</h3>
                    </div>
                    <div className="text-sm text-muted-foreground pl-12">
                        <p className="mb-4">Definem o que acontece quando o jogador digita um comando.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <ul className="space-y-1.5 text-xs">
                                    <li><strong className="text-foreground">Verbos:</strong> Palavras que ativam a ação (ex: abrir, usar, pegar).</li>
                                    <li><strong className="text-foreground">Alvo:</strong> Objeto da cena afetado (ex: Porta).</li>
                                    <li><strong className="text-foreground">Requisito:</strong> Item necessário no inventário (ex: Chave).</li>
                                    <li><strong className="text-foreground">Resultado:</strong> Ir para cena, mudar texto, ou tocar vinheta.</li>
                                </ul>
                                <div className="text-xs space-y-1 pt-2 border-t border-muted-foreground/10">
                                    <p className="font-medium text-foreground">Opções Avançadas:</p>
                                    <ul className="space-y-0.5 opacity-80">
                                        <li>• Adicionar ao Inventário</li>
                                        <li>• Consumir Item / Remover da Cena</li>
                                        <li>• Efeitos em Rastreadores</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-green-500/5 p-5 rounded-xl text-xs border border-green-500/10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Gamepad2 className="w-16 h-16 text-green-500 blur-sm" />
                                </div>
                                <p className="font-bold mb-3 text-green-600 dark:text-green-400 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Exemplo Prático:
                                </p>
                                <div className="space-y-3 relative z-10">
                                    <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 font-mono text-foreground/90 shadow-sm">
                                        <span className="text-muted-foreground select-none me-2">&gt;</span>
                                        "Destrancar porta com a chave"
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-background/50 rounded p-2 border border-border/50">
                                            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Verbo</span>
                                            <span className="font-medium text-green-600 dark:text-green-400">Destrancar</span>
                                        </div>
                                        <div className="bg-background/50 rounded p-2 border border-border/50">
                                            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Alvo</span>
                                            <span className="font-medium text-foreground">Porta</span>
                                        </div>
                                        <div className="bg-background/50 rounded p-2 border border-border/50">
                                            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Requisito</span>
                                            <span className="font-medium text-amber-600 dark:text-amber-400">Chave</span>
                                        </div>
                                    </div>
                                    <p className="flex items-start gap-2 text-[11px] text-muted-foreground pt-1">
                                        <Lightbulb className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                                        <span>O sistema entende ordens variadas (ex: "Usar chave na porta").</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Comandos Globais */}
                <div id="section-globals" className="space-y-3 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                            <Command className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">4. Comandos Globais</h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2 pl-12">
                        <p>Comandos que funcionam em <strong>qualquer cena</strong> do jogo.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Verbos Fixos:</strong> Palavras-chave universais (ex: "ajuda", "inventário").</li>
                            <li><strong>Descrição:</strong> Resposta padrão para cada comando global.</li>
                        </ul>
                    </div>
                </div>

                {/* 5. Vinhetas */}
                <div id="section-vignettes" className="space-y-3 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <Scroll className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">5. Vinhetas <span className="text-xs font-normal text-amber-500 ml-2">✨ NOVO</span></h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2 pl-12">
                        <p>Telas cinematográficas que enriquecem a narrativa.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Abertura:</strong> Exibida antes do início do jogo (tela de título).</li>
                            <li><strong>Transição:</strong> Tocada durante interações para momentos dramáticos.</li>
                            <li><strong>Conclusão:</strong> Mostrada ao final do jogo (vitória/derrota).</li>
                        </ul>
                        <p className="text-xs opacity-70 pt-1">Personalize imagem, música, alinhamento de texto e animações.</p>
                    </div>
                </div>

                {/* 6. Rastreadores */}
                <div id="section-trackers" className="space-y-3 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">6. Rastreadores de Consequência</h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2 pl-12">
                        <p>Crie sistemas numéricos como <strong>Vida</strong>, <strong>Dinheiro</strong> ou <strong>Estresse</strong>.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Valor Inicial e Máximo:</strong> Definem a escala (ex: 0/100).</li>
                            <li><strong>Cena de Consequência:</strong> Para onde o jogador vai ao atingir o limite.</li>
                            <li><strong>Personalização:</strong> Escolha cor, ícone e modo da barra (normal ou invertida).</li>
                            <li>Interações podem <strong>aumentar</strong> ou <strong>diminuir</strong> valores.</li>
                        </ul>
                    </div>
                </div>

                {/* 7. Mapa de Conexões */}
                <div id="section-map" className="space-y-3 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                            <Map className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">7. Mapa de Conexões <span className="text-xs font-normal text-indigo-500 ml-2">✨ NOVO</span></h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2 pl-12">
                        <p>Visualize a estrutura do seu jogo de forma gráfica.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Visão Panorâmica:</strong> Veja todas as cenas e como elas se conectam.</li>
                            <li><strong>Navegação Rápida:</strong> Clique em uma cena no mapa para editá-la.</li>
                            <li><strong>Posicionamento:</strong> Arraste cenas para organizar o layout visual.</li>
                        </ul>
                    </div>
                </div>

                {/* 8. Configurações do Jogo */}
                <div id="section-settings" className="space-y-3 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-500/10 rounded-lg text-slate-500">
                            <SlidersHorizontal className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">8. Configurações do Jogo</h3>
                    </div>
                    <div className="text-sm text-muted-foreground pl-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="bg-card border border-border p-4 rounded-xl shadow-sm hover:border-slate-400/30 transition-colors group">
                                <div className="flex items-center gap-2 mb-3 text-slate-500 group-hover:text-slate-400 transition-colors">
                                    <Box className="w-4 h-4" />
                                    <p className="font-bold text-foreground">Layout</p>
                                </div>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Temas predefinidos</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Orientação e molduras</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Fontes e cores</li>
                                </ul>
                            </div>
                            <div className="bg-card border border-border p-4 rounded-xl shadow-sm hover:border-slate-400/30 transition-colors group">
                                <div className="flex items-center gap-2 mb-3 text-slate-500 group-hover:text-slate-400 transition-colors">
                                    <Activity className="w-4 h-4" />
                                    <p className="font-bold text-foreground">Sistemas</p>
                                </div>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Inventário</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Diário de jogo</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Verbos fixos</li>
                                </ul>
                            </div>
                            <div className="bg-card border border-border p-4 rounded-xl shadow-sm hover:border-slate-400/30 transition-colors group">
                                <div className="flex items-center gap-2 mb-3 text-slate-500 group-hover:text-slate-400 transition-colors">
                                    <Play className="w-4 h-4" />
                                    <p className="font-bold text-foreground">Animações</p>
                                </div>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Texto: fade ou digitação</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Imagens: slide, zoom...</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Velocidade ajustável</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 9. Pré-visualização */}
                <div id="section-preview" className="space-y-3 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Play className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">9. Pré-visualização e Teste</h3>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2 pl-12">
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Use o botão <strong>Pré-visualizar</strong> para testar toda a experiência.</li>
                            <li>Teste a partir de qualquer cena que está editando.</li>
                            <li>Verifique se os comandos e interações funcionam como esperado.</li>
                        </ul>
                    </div>
                </div>

                {/* 10. Exportação */}
                <div id="section-export" className="space-y-3 pt-6 border-t border-muted-foreground/10 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-500/10 rounded-lg text-zinc-500">
                            <Download className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">10. Finalização e Exportação</h3>
                    </div>
                    <div className="text-sm text-muted-foreground pl-12 space-y-3">
                        <p>Quando seu jogo estiver pronto:</p>
                        <ol className="list-decimal pl-4 space-y-1">
                            <li>Salve seu progresso (<code className="bg-muted px-1 rounded">Ctrl+S</code>).</li>
                            <li>Teste completamente todas as cenas e finais.</li>
                            <li>Clique em <strong>Exportar Jogo</strong> para baixar um arquivo .zip.</li>
                            <li>Extraia o zip e abra <strong>index.html</strong> para jogar ou compartilhar!</li>
                        </ol>
                    </div>
                </div>

            </div>
        </div>
    );
};
