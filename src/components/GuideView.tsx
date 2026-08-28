import React from 'react';
import {
    BookOpen,
    Map,
    Box,
    Play,
    Activity,
    Download,
    Lightbulb,
    ChevronDown,
    Palette,
    Type,
    SquareDashedMousePointer,
    MessageSquare,
    Layers,
    Sparkles,
    Eye,
    ArrowRight,
    TextCursorInput,
    CopyCheck,
    CheckCircle2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

export const GuideView: React.FC = () => {
    const { t } = useTranslation();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 md:px-8 pb-28 animate-in fade-in duration-500">
            {/* Sticky Header: Intro + TOC */}
            <div className="sticky top-0 z-40 bg-background pt-8 pb-4 -mx-6 md:-mx-8 px-6 md:px-8 shadow-sm">
                <p
                    className="text-white max-w-3xl text-sm leading-relaxed mb-5 opacity-90"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                            t(
                                'guide.intro',
                                'O IF Builder permite criar ficções interativas com facilidade. Uma história é construída através de <strong>Ramificações</strong>, <strong>Cenários e Vistas</strong> e <strong>Capítulos</strong>, onde quem joga lê descrições, observa ilustrações, explora detalhes interativos e toma decisões usando escolhas na tela ou comandos em linguagem natural.'
                            )
                        )
                    }}
                />

                {/* Table of Contents Dropdown */}
                <div className="p-3.5 bg-muted/30 rounded-lg border border-muted-foreground/40 mb-2">
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                        {t('guide.toc', 'Índice do Guia')}
                    </label>
                    <div className="relative">
                        <select
                            className="w-full bg-background border border-muted-foreground/40 rounded-md px-3 py-2 text-sm appearance-none focus:ring-1 focus:ring-primary outline-none text-white cursor-pointer shadow-sm"
                            onChange={(e) => {
                                if (e.target.value) {
                                    scrollToSection(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" className="bg-zinc-900 text-white">
                                {t('guide.tocSelect', 'Selecione um capítulo...')}
                            </option>
                            <option value="section-scenes" className="bg-zinc-900 text-white">
                                {t('guide.sections.scenes.title', '1. Ramificações')}
                            </option>
                            <option value="section-scenarios" className="bg-zinc-900 text-white">
                                {t('guide.sections.scenarios.title', '2. Cenários e Vistas')}
                            </option>
                            <option value="section-chapters" className="bg-zinc-900 text-white">
                                {t('guide.sections.chapters.title', '3. Capítulos')}
                            </option>
                            <option value="section-objects" className="bg-zinc-900 text-white">
                                {t('guide.sections.objects.title', '4. Biblioteca de Objetos')}
                            </option>
                            <option value="section-interactions" className="bg-zinc-900 text-white">
                                {t('guide.sections.interactions.title', '5. Interações e Comandos')}
                            </option>
                            <option value="section-globals" className="bg-zinc-900 text-white">
                                {t('guide.sections.globals.title', '6. Verbos Globais')}
                            </option>
                            <option value="section-mechanics" className="bg-zinc-900 text-white">
                                {t('guide.sections.mechanics.title', '7. Mecânicas')}
                            </option>
                            <option value="section-trackers" className="bg-zinc-900 text-white">
                                {t('guide.sections.trackers.title', '8. Rastreadores de Consequência')}
                            </option>
                            <option value="section-appearance" className="bg-zinc-900 text-white">
                                {t('guide.sections.appearance.title', '9. Estilo Visual e Temas')}
                            </option>
                            <option value="section-labels" className="bg-zinc-900 text-white">
                                {t('guide.sections.labels.title', '10. Rótulos e Textos do Sistema')}
                            </option>
                            <option value="section-map" className="bg-zinc-900 text-white">
                                {t('guide.sections.map.title', '11. Mapa de Conexões')}
                            </option>
                            <option value="section-preview" className="bg-zinc-900 text-white">
                                {t('guide.sections.preview.title', '12. Pré-visualização e Testes')}
                            </option>
                            <option value="section-export" className="bg-zinc-900 text-white">
                                {t('guide.sections.export.title', '13. Salvar, Carregar e Exportar')}
                            </option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                {/* Subtle bottom shadow */}
                <div className="absolute left-0 right-0 -bottom-4 h-4 bg-gradient-to-b from-background to-transparent pointer-events-none" />
            </div>

            <div className="space-y-14 mt-10">
                {/* 1. Ramificações */}
                <div id="section-scenes" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            {t('guide.sections.scenes.title', '1. Ramificações')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.scenes.desc',
                                            'As ramificações são os nós narrativos de texto onde a história se desenvolve e os caminhos divergem com base nas decisões de quem joga.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.scenes.item1', '<strong>Título e Descrição:</strong> O texto principal e a narrativa que o jogador lê ao chegar neste momento da história.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.scenes.item2', '<strong>Texto Interativo:</strong> Envolva palavras entre <code className="bg-muted px-1 rounded">&lt; &gt;</code> para torná-las clicáveis (ex: <code className="bg-muted px-1 rounded">&lt;porta&gt;</code> ou <code className="bg-muted px-1 rounded">&lt;baú&gt;</code>). Ao clicar, o jogo executa a ação automaticamente.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.scenes.item3', '<strong>Ilustração e Trilha Sonora:</strong> Cada ramificação pode ter uma imagem de cena e música de fundo exclusivas.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.scenes.item4', '<strong>Ponto de Partida e Finais:</strong> Defina qual nó inicia a história e marque ramificações conclusivas como finais narrativos.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-4 space-y-3 h-fit shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{t('guide.sections.scenes.exampleTitle', 'Exemplo de Texto Clicável:')}</span>
                            </div>
                            <div className="bg-background/80 border border-muted-foreground/40 rounded-lg p-3 font-mono text-xs text-foreground/90 leading-relaxed">
                                Você se aproxima de um <span className="text-indigo-400 font-bold bg-indigo-500/10 px-1 py-0.5 rounded cursor-pointer">&lt;baú&gt;</span> de ferro trancado.
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground leading-snug">
                                <Lightbulb className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                                <span>{t('guide.sections.scenes.exampleTip', 'Clicar na palavra em destaque envia o comando diretamente ao jogo.')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Cenários e Vistas */}
                <div id="section-scenarios" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-lg font-bold text-white">
                                {t('guide.sections.scenarios.title', '2. Cenários e Vistas')}
                            </h3>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                {t('guide.sections.scenarios.new', 'NOVO')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.scenarios.desc',
                                            'Ambientes visuais ricos compostos por múltiplas vistas (ângulos de câmera) onde quem joga explora a ilustração e clica diretamente em Áreas Interativas desenhadas sobre a cena.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.scenarios.item1', '<strong>Vistas da Cena:</strong> Ângulos de visão e perspectivas diferentes do mesmo ambiente com imagens próprias.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.scenarios.item2', '<strong>Áreas Interativas:</strong> Zonas desenhadas sobre a ilustração que reagem ao clique com feedback sonoro e visual.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.scenarios.item3', '<strong>Ações de Clique:</strong> Cada área pode mudar de vista, levar para outra cena, abrir diálogo de exame, coletar um item ou alterar medidores.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.scenarios.item4', '<strong>Chaves e Requisitos:</strong> Bloqueie passagens ou gavetas exigindo que o jogador possua itens no inventário para interagir.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-4 space-y-3 h-fit shadow-sm">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
                                {t('guide.sections.scenarios.actionsTitle', 'Ações de Clique:')}
                            </span>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2.5 bg-background/60 p-2 rounded-lg border border-muted-foreground/20">
                                    <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="font-semibold text-foreground">{t('guide.sections.scenarios.action1', 'Mudar de Vista')}</span>
                                </div>
                                <div className="flex items-center gap-2.5 bg-background/60 p-2 rounded-lg border border-muted-foreground/20">
                                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="font-semibold text-foreground">{t('guide.sections.scenarios.action2', 'Ir para Cena')}</span>
                                </div>
                                <div className="flex items-center gap-2.5 bg-background/60 p-2 rounded-lg border border-muted-foreground/20">
                                    <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="font-semibold text-foreground">{t('guide.sections.scenarios.action3', 'Examinar Detalhe')}</span>
                                </div>
                                <div className="flex items-center gap-2.5 bg-background/60 p-2 rounded-lg border border-muted-foreground/20">
                                    <Box className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="font-semibold text-foreground">{t('guide.sections.scenarios.action4', 'Coletar Item')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Capítulos */}
                <div id="section-chapters" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-lg font-bold text-white">
                                {t('guide.sections.chapters.title', '3. Capítulos')}
                            </h3>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                                {t('guide.sections.chapters.new', 'NOVO')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.chapters.desc',
                                            'Telas cinematográficas em tela cheia que marcam transições dramáticas, passagens de tempo, aberturas e desfechos importantes da história.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.chapters.item1', '<strong>Capítulo de Abertura:</strong> Tela de título com apresentação e botão de início (ex: \'Iniciar Aventura\').')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.chapters.item2', '<strong>Capítulos de Transição:</strong> Pontes narrativas lineares para viagens, passagens de ato ou revelações dramáticas com botão de prosseguir.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.chapters.item3', '<strong>Capítulos de Conclusão:</strong> Finais da narrativa para celebrar uma Vitória ou apresentar um desfecho de Derrota.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-4 space-y-2.5 h-fit shadow-sm">
                            <div className="p-2.5 bg-background/60 rounded-lg border border-purple-500/20">
                                <span className="text-xs font-bold text-purple-400 block mb-0.5">
                                    {t('guide.sections.chapters.cardOpening', 'Abertura')}
                                </span>
                                <span className="text-xs text-muted-foreground leading-snug block">
                                    {t('guide.sections.chapters.cardOpeningDesc', 'Apresentação e tela de título antes do jogo começar.')}
                                </span>
                            </div>
                            <div className="p-2.5 bg-background/60 rounded-lg border border-muted-foreground/20">
                                <span className="text-xs font-bold text-foreground/90 block mb-0.5">
                                    {t('guide.sections.chapters.cardTransition', 'Transição')}
                                </span>
                                <span className="text-xs text-muted-foreground leading-snug block">
                                    {t('guide.sections.chapters.cardTransitionDesc', 'Passagem entre atos, viagens e momentos de transição.')}
                                </span>
                            </div>
                            <div className="p-2.5 bg-background/60 rounded-lg border border-muted-foreground/20">
                                <span className="text-xs font-bold text-foreground/90 block mb-0.5">
                                    {t('guide.sections.chapters.cardConclusion', 'Conclusão')}
                                </span>
                                <span className="text-xs text-muted-foreground leading-snug block">
                                    {t('guide.sections.chapters.cardConclusionDesc', 'Telas de vitória, derrota e desfechos da narrativa.')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Biblioteca de Objetos (Clean full-width layout) */}
                <div id="section-objects" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                            <Box className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            {t('guide.sections.objects.title', '4. Biblioteca de Objetos')}
                        </h3>
                    </div>

                    <div className="pl-0 md:pl-11 text-sm text-white space-y-3 max-w-3xl">
                        <p
                            className="opacity-90 leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    t(
                                        'guide.sections.objects.desc',
                                        'Itens e elementos do cenário que podem ser examinados em detalhe, guardados no inventário e usados para resolver desafios.'
                                    )
                                )
                            }}
                        />
                        <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                            <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.objects.item1', '<strong>Nome e Identificação:</strong> Nome do objeto reconhecido tanto por cliques quanto pelo leitor de comandos (ex: \'Chave de Bronze\').')) }} />
                            <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.objects.item2', '<strong>Descrição de Exame:</strong> Texto detalhado que descreve o objeto ao ser observado de perto.')) }} />
                            <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.objects.item3', '<strong>Ilustração Opcional:</strong> Imagem exibida ao inspecionar o item a partir da mochila.')) }} />
                            <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.objects.item4', '<strong>Coletável:</strong> Define se o objeto pode ser guardado no inventário do jogador.')) }} />
                        </ul>
                    </div>
                </div>

                {/* 5. Interações e Comandos */}
                <div id="section-interactions" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            {t('guide.sections.interactions.title', '5. Interações e Comandos')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.interactions.desc',
                                            'Definem o que acontece quando o jogador digita um comando em linguagem natural ou clica em uma ação.'
                                        )
                                    )
                                }}
                            />
                            <div className="space-y-1.5 opacity-90 leading-relaxed">
                                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.interactions.item1', '<strong>Verbos:</strong> Palavras que ativam a ação (ex: abrir, usar, destrancar, empurrar).')) }} />
                                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.interactions.item2', '<strong>Alvo:</strong> Objeto afetado pela ação na cena atual (ex: Porta).')) }} />
                                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.interactions.item3', '<strong>Requisito:</strong> Item obrigatório no inventário para o sucesso da ação (ex: Chave).')) }} />
                                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.interactions.item4', '<strong>Resultado:</strong> Mudar de ramificação, exibir texto de sucesso, tocar efeito sonoro ou abrir capítulo.')) }} />
                            </div>

                            <hr className="border-muted-foreground/30 my-3" />

                            <div className="space-y-1 text-xs opacity-90">
                                <span className="font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                                    {t('guide.sections.interactions.advancedOptions', 'Opções Avançadas:')}
                                </span>
                                <p className="text-muted-foreground">{t('guide.sections.interactions.advanced1', '• Adicionar ao Inventário')}</p>
                                <p className="text-muted-foreground">{t('guide.sections.interactions.advanced2', '• Consumir Item / Remover da Ramificação')}</p>
                                <p className="text-muted-foreground">{t('guide.sections.interactions.advanced3', '• Alterar Rastreadores')}</p>
                            </div>
                        </div>

                        {/* Practical Example Card without quotes */}
                        <div className="lg:col-span-5 border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 space-y-3.5 h-fit shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-sm bg-emerald-400 inline-block" />
                                <span>{t('guide.sections.interactions.practicalExample', 'Exemplo Prático:')}</span>
                            </div>

                            <div className="bg-background/90 border border-muted-foreground/40 rounded-lg p-2.5 font-mono text-xs text-foreground/90">
                                &gt; {t('guide.sections.interactions.exampleCommand', 'Destrancar porta com a chave')}
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                                        {t('guide.sections.interactions.verb', 'VERBO')}
                                    </span>
                                    <span className="font-bold text-emerald-400">
                                        {t('guide.sections.interactions.verbValue', 'Destrancar')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                                        {t('guide.sections.interactions.target', 'ALVO')}
                                    </span>
                                    <span className="font-bold text-foreground">
                                        {t('guide.sections.interactions.targetValue', 'Porta')}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                                        {t('guide.sections.interactions.requirement', 'REQUISITO')}
                                    </span>
                                    <span className="font-bold text-amber-400">
                                        {t('guide.sections.interactions.requirementValue', 'Chave')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-xs text-muted-foreground leading-snug border-t border-emerald-500/20 pt-2.5">
                                <Lightbulb className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                                <span>{t('guide.sections.interactions.tip', 'O sistema entende ordens variadas (ex: "Usar chave na porta").')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Verbos Globais */}
                <div id="section-globals" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            {t('guide.sections.globals.title', '6. Verbos Globais')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.globals.desc',
                                            'Comandos universais de utilidade que respondem em qualquer ponto da narrativa.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.globals.item1', '<strong>Comandos Universais:</strong> Palavras como <code className="bg-muted px-1 rounded">ajuda</code>, <code className="bg-muted px-1 rounded">olhar</code> e <code className="bg-muted px-1 rounded">inventario</code>.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.globals.item2', '<strong>Respostas Padronizadas:</strong> Mensagens informativas que orientam o jogador sem alterar a cena atual.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-3.5 space-y-2 h-fit shadow-sm text-xs">
                            <span className="font-semibold uppercase tracking-wider text-blue-400 block mb-2">
                                {t('guide.sections.globals.tableTitle', 'Comandos Universais Padrão:')}
                            </span>
                            <div className="space-y-1.5">
                                <div className="p-2 bg-background/60 rounded border border-muted-foreground/20 flex flex-col gap-0.5">
                                    <span className="font-mono font-bold text-blue-400">{t('guide.sections.globals.cmdHelp', 'ajuda / comandos')}</span>
                                    <span className="text-muted-foreground text-[11px]">{t('guide.sections.globals.descHelp', 'Exibe instruções gerais e dicas')}</span>
                                </div>
                                <div className="p-2 bg-background/60 rounded border border-muted-foreground/20 flex flex-col gap-0.5">
                                    <span className="font-mono font-bold text-blue-400">{t('guide.sections.globals.cmdInventory', 'inventario / mochila')}</span>
                                    <span className="text-muted-foreground text-[11px]">{t('guide.sections.globals.descInventory', 'Abre a lista de itens carregados')}</span>
                                </div>
                                <div className="p-2 bg-background/60 rounded border border-muted-foreground/20 flex flex-col gap-0.5">
                                    <span className="font-mono font-bold text-blue-400">{t('guide.sections.globals.cmdLook', 'olhar / examinar')}</span>
                                    <span className="text-muted-foreground text-[11px]">{t('guide.sections.globals.descLook', 'Reapresenta a descrição do ambiente')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. Mecânicas */}
                <div id="section-mechanics" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                            <SquareDashedMousePointer className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-lg font-bold text-white">
                                {t('guide.sections.mechanics.title', '7. Mecânicas')}
                            </h3>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                {t('guide.sections.mechanics.new', 'NOVO')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.mechanics.desc',
                                            'Regras e sistemas interativos opcionais que enriquecem a experiência e a estrutura da narrativa.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.mechanics.item1', '<strong>Modo de Entrada:</strong> Escolha entre Leitor de Comandos (digitação livre) ou Modo Escolhas (botões de navegação).')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.mechanics.item2', '<strong>Sistema de Vidas / Chances:</strong> Limite de erros que leva automaticamente ao desfecho de derrota quando esgotado.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.mechanics.item3', '<strong>Diário de Aventura:</strong> Registro automático de pistas, diálogos e descobertas da história.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.mechanics.item4', '<strong>Rolagens de Dados (D6 / D20):</strong> Testes de sorte ou perícia com feedback de Sucesso e Falha.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.mechanics.item5', '<strong>Áudio e Música:</strong> Trilha sonora contínua e efeitos sonoros sincronizados às ações.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-4 space-y-3.5 h-fit shadow-sm text-xs">
                            <span className="font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                                {t('guide.sections.mechanics.modesTitle', 'Modos de Interação:')}
                            </span>
                            <div className="space-y-2">
                                <div className="p-2.5 bg-background/60 rounded-lg border border-muted-foreground/20 flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-amber-500/10 text-amber-400 shrink-0">
                                        <TextCursorInput className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-foreground block">{t('guide.sections.mechanics.modeParser', 'Parser')}</span>
                                        <span className="text-muted-foreground text-[11px] leading-tight block">{t('guide.sections.mechanics.modeParserDesc', 'Descreva verbos e ações em linguagem natural')}</span>
                                    </div>
                                </div>
                                <div className="p-2.5 bg-background/60 rounded-lg border border-muted-foreground/20 flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-amber-500/10 text-amber-400 shrink-0">
                                        <CopyCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-foreground block">{t('guide.sections.mechanics.modeChoice', 'IF (Interactive Fiction)')}</span>
                                        <span className="text-muted-foreground text-[11px] leading-tight block">{t('guide.sections.mechanics.modeChoiceDesc', 'Escolha uma opção clicável na tela')}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-[11px] leading-relaxed border-t border-muted-foreground/30 pt-2.5">
                                {t('guide.sections.mechanics.systemsSummary', 'Sistemas: Vidas (Chances), Diário, Dados D6/D20 e Música')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 8. Rastreadores de Consequência */}
                <div id="section-trackers" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            {t('guide.sections.trackers.title', '8. Rastreadores de Consequência')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.trackers.desc',
                                            'Medidores numéricos para acompanhar valores como Vida, Sanidade, Dinheiro, Energia ou Tempo.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.trackers.item1', '<strong>Escala Numérica:</strong> Defina o valor inicial e o valor máximo (ex: 100/100).')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.trackers.item2', '<strong>Limite e Consequência:</strong> Direciona o jogador para um Capítulo específico quando o valor atinge o limite.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.trackers.item3', '<strong>Impacto nas Ações:</strong> Interações, escolhas e áreas interativas podem somar ou subtrair pontos do medidor.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-4 space-y-3 h-fit shadow-sm text-xs">
                            <span className="font-semibold uppercase tracking-wider text-rose-400 block">
                                {t('guide.sections.trackers.exampleTitle', 'Exemplo de Rastreador:')}
                            </span>
                            <div className="bg-background/80 border border-muted-foreground/40 rounded-lg p-3 space-y-2">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-foreground">{t('guide.sections.trackers.trackerName', 'Sanidade')}</span>
                                    <span className="text-rose-400 font-mono">{t('guide.sections.trackers.trackerScale', '75 / 100')}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '75%' }} />
                                </div>
                                <span className="text-[11px] text-muted-foreground block pt-1">
                                    {t('guide.sections.trackers.trackerLimit', 'Ao atingir 0 ➔ Desencadeia Consequência Dramática')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 9. Estilo Visual e Temas */}
                <div id="section-appearance" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                            <Palette className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-lg font-bold text-white">
                                {t('guide.sections.appearance.title', '9. Estilo Visual e Temas')}
                            </h3>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded">
                                {t('guide.sections.appearance.new', 'NOVO')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.appearance.desc',
                                            'Personalize a atmosfera estética da sua história com paletas de cores, tipografia, molduras e efeitos visuais de tela em tempo real.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.appearance.item1', '<strong>Temas Predefinidos:</strong> Paletas completas de um clique: Meia-Noite, Pergaminho, Terminal Retrô, Âmbar, Windows 95, Noir, Vampiro e Cyberpunk.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.appearance.item2', '<strong>Cores e Tipografia:</strong> Ajuste cores de fundo, texto, títulos, destaques e fontes serifadas, modernas ou monoespaçadas.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.appearance.item3', '<strong>Layout e Molduras:</strong> Orientação Vertical ou Horizontal e molduras de imagem (Limpo, Arredondado, Vinheta suave e Vidro translúcido).')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.appearance.item4', '<strong>Efeitos de Tela:</strong> Camadas dinâmicas como Chuva, Neve, Poeira/Partículas, Linhas CRT Scanlines, Ruído de película e Dither Retrô.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-4 space-y-3.5 h-fit shadow-sm text-xs">
                            <div>
                                <span className="font-semibold uppercase tracking-wider text-pink-400 block mb-2">
                                    {t('guide.sections.appearance.themesTitle', 'Temas')}
                                </span>
                                <div className="space-y-1.5">
                                    {/* Theme 1: Meia-Noite */}
                                    <div className="flex items-center justify-between p-2 bg-background/60 rounded-lg border border-muted-foreground/20">
                                        <span className="font-medium text-foreground">Meia-Noite</span>
                                        <div className="flex items-center gap-1">
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#0d1117' }} />
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#c9d1d9' }} />
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#58a6ff' }} />
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#2ea043' }} />
                                        </div>
                                    </div>
                                    {/* Theme 2: Sépia */}
                                    <div className="flex items-center justify-between p-2 bg-background/60 rounded-lg border border-muted-foreground/20">
                                        <span className="font-medium text-foreground">Sépia</span>
                                        <div className="flex items-center gap-1">
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#292524' }} />
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#e7e5e4' }} />
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#f59e0b' }} />
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#a16207' }} />
                                        </div>
                                    </div>
                                    {/* Theme 3: Vampiro */}
                                    <div className="flex items-center justify-between p-2 bg-background/60 rounded-lg border border-muted-foreground/20">
                                        <span className="font-medium text-foreground">Vampiro</span>
                                        <div className="flex items-center gap-1">
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#450a0a' }} />
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#fecaca' }} />
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#fca5a5' }} />
                                            <span className="w-3.5 h-3.5 rounded-sm border border-white/20" style={{ backgroundColor: '#dc2626' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-muted-foreground/30 pt-3">
                                <span className="font-semibold uppercase tracking-wider text-pink-400 block mb-2">
                                    {t('guide.sections.appearance.effectsTitle', 'Efeitos')}
                                </span>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <span className="px-2.5 py-1.5 bg-background/60 rounded border border-muted-foreground/20 font-medium text-foreground/90 text-center">🌧️ Chuva</span>
                                    <span className="px-2.5 py-1.5 bg-background/60 rounded border border-muted-foreground/20 font-medium text-foreground/90 text-center">❄️ Neve</span>
                                    <span className="px-2.5 py-1.5 bg-background/60 rounded border border-muted-foreground/20 font-medium text-foreground/90 text-center">📺 CRT Scanlines</span>
                                    <span className="px-2.5 py-1.5 bg-background/60 rounded border border-muted-foreground/20 font-medium text-foreground/90 text-center">🎬 Ruído</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 10. Rótulos e Textos do Sistema */}
                <div id="section-labels" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                            <Type className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-lg font-bold text-white">
                                {t('guide.sections.labels.title', '10. Rótulos e Textos do Sistema')}
                            </h3>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                                {t('guide.sections.labels.new', 'NOVO')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.labels.desc',
                                            'Adapte cada mensagem, botão e instrução do sistema ao tom de voz e ambientação da sua narrativa.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.labels.item1', '<strong>Botões de Navegação:</strong> Títulos de Salvar, Carregar, Reiniciar, Retrospectiva, Menu e Iniciar.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.labels.item2', '<strong>Barra de Comandos:</strong> Texto de instrução no campo de digitação (ex: \'O que você faz agora?\').')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.labels.item3', '<strong>Mensagens de Retorno:</strong> Respostas atmosféricas para comandos desconhecidos, mochila vazia e resultados de rolagens de dados.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-3.5 space-y-2 h-fit shadow-sm text-xs">
                            <span className="font-semibold uppercase tracking-wider text-cyan-400 block mb-1">
                                {t('guide.sections.labels.tableTitle', 'Personalização de Tom de Voz:')}
                            </span>
                            <div className="space-y-1.5">
                                <div className="p-2 bg-background/60 rounded border border-muted-foreground/20">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">{t('guide.sections.labels.row1Field', 'Campo de Entrada')}</span>
                                    <span className="text-cyan-400 font-mono text-[11px] block">"{t('guide.sections.labels.row1Custom', 'Digite sua ação, detetive...')}"</span>
                                </div>
                                <div className="p-2 bg-background/60 rounded border border-muted-foreground/20">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">{t('guide.sections.labels.row2Field', 'Comando Desconhecido')}</span>
                                    <span className="text-cyan-400 font-mono text-[11px] block">"{t('guide.sections.labels.row2Custom', 'O silêncio do castelo não responde.')}"</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 11. Mapa de Conexões (com Fluxograma Ilustrado) */}
                <div id="section-map" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                            <Map className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-lg font-bold text-white">
                                {t('guide.sections.map.title', '11. Mapa de Conexões')}
                            </h3>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
                                {t('guide.sections.map.new', 'NOVO')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.map.desc',
                                            'Visão panorâmica e gráfica de toda a estrutura da história, exibindo conexões entre ramificações, cenários e capítulos.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.map.item1', '<strong>Visão Geral da História:</strong> Veja o fluxo narrativo, decisões e bifurcações em um único painel gráfico.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.map.item2', '<strong>Navegação Instantânea:</strong> Dê um duplo clique em qualquer nó para abrir sua edição imediata.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.map.item3', '<strong>Organização Espacial:</strong> Arraste e posicione os nós para organizar atos, capítulos e linhas do tempo.')) }} />
                            </ul>
                        </div>

                        {/* Visual mini flowchart illustrating branching narrative with 2 conclusions */}
                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-4 space-y-3 h-fit shadow-sm text-xs">
                            <span className="font-semibold uppercase tracking-wider text-teal-400 block text-center mb-1">
                                Estrutura da Narrativa
                            </span>
                            <div className="flex flex-col items-center gap-1.5 py-1">
                                <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-md text-purple-300 font-bold text-center text-[11px] shadow-sm">
                                    Abertura
                                </div>
                                <div className="w-0.5 h-3 bg-teal-500/40" />
                                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-md text-indigo-300 font-bold text-center text-[11px] shadow-sm">
                                    Ramificação
                                </div>
                                <div className="w-40 h-3 border-t-2 border-l-2 border-r-2 border-teal-500/40 rounded-t-sm mt-0.5" />
                                <div className="flex items-center justify-between w-48">
                                    <div className="px-2.5 py-1 bg-background border border-teal-500/30 rounded text-foreground text-[10px] font-semibold text-center w-20">
                                        Escolha A
                                    </div>
                                    <div className="px-2.5 py-1 bg-background border border-teal-500/30 rounded text-foreground text-[10px] font-semibold text-center w-20">
                                        Escolha B
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-48 px-9">
                                    <div className="w-0.5 h-3 bg-teal-500/40" />
                                    <div className="w-0.5 h-3 bg-teal-500/40" />
                                </div>
                                <div className="flex items-center justify-between w-48">
                                    <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 text-[10px] font-bold text-center w-20 shadow-sm">
                                        Conclusão X
                                    </div>
                                    <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 text-[10px] font-bold text-center w-20 shadow-sm">
                                        Conclusão Y
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 12. Pré-visualização e Testes */}
                <div id="section-preview" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                            <Play className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            {t('guide.sections.preview.title', '12. Pré-visualização e Testes')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.preview.desc',
                                            'Simulador embutido para testar toda a história interativamente como um jogador real.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.preview.item1', '<strong>Teste Imediato:</strong> Abra a pré-visualização a qualquer momento sem precisar exportar arquivos.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.preview.item2', '<strong>Ponto de Início Flexível:</strong> Inicie o teste a partir do começo ou diretamente da cena em que estiver trabalhando.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.preview.item3', '<strong>Validação de Desafios:</strong> Verifique comandos, áreas de clique, inventário e rastreadores antes de compartilhar.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-4 space-y-2.5 h-fit shadow-sm text-xs">
                            <span className="font-semibold uppercase tracking-wider text-yellow-400 block mb-1">
                                {t('guide.sections.preview.checklistTitle', 'Checklist de Testes:')}
                            </span>
                            <div className="space-y-2 text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                                    <span>{t('guide.sections.preview.check1', 'Testar todas as escolhas e caminhos')}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                                    <span>{t('guide.sections.preview.check2', 'Verificar se todas as chaves e quebra-cabeças funcionam')}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                                    <span>{t('guide.sections.preview.check3', 'Conferir finais de vitória e derrota')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 13. Salvar, Carregar e Exportar */}
                <div id="section-export" className="space-y-4 scroll-mt-72">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <Download className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            {t('guide.sections.export.title', '13. Salvar, Carregar e Exportar')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pl-0 md:pl-11 text-sm text-white">
                        <div className="lg:col-span-7 space-y-3">
                            <p
                                className="opacity-90 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        t(
                                            'guide.sections.export.desc',
                                            'Gere o pacote final da sua ficção pronto para jogar no navegador ou publicar na web.'
                                        )
                                    )
                                }}
                            />
                            <ul className="list-disc pl-4 space-y-1.5 opacity-90 leading-relaxed">
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.export.item1', '<strong>Exportar .ZIP:</strong> Baixa um pacote completo com imagens otimizadas, áudios e arquivo <code className="bg-muted px-1 rounded">index.html</code> pronto para jogar ou publicar em plataformas como o itch.io.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.export.item2', '<strong>Exportar HTML Único:</strong> Arquivo único com todos os recursos embutidos para envio rápido.')) }} />
                                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('guide.sections.export.item3', '<strong>Carregar Projeto:</strong> Use o botão Carregar selecionando o arquivo <code className="bg-muted px-1 rounded">.zip</code> para retomar a edição exatamente de onde parou.')) }} />
                            </ul>
                        </div>

                        <div className="lg:col-span-5 bg-card/60 border border-muted-foreground/30 rounded-xl p-4 space-y-3 h-fit shadow-sm text-xs">
                            <div className="p-2.5 bg-background/60 rounded-lg border border-emerald-500/30">
                                <span className="font-bold text-emerald-400 block mb-0.5">{t('guide.sections.export.cardZip', 'Pacote .ZIP (Recomendado)')}</span>
                                <span className="text-muted-foreground text-[11px] leading-tight block">{t('guide.sections.export.cardZipDesc', 'Pasta completa com index.html e assets para jogar e continuar editando.')}</span>
                            </div>
                            <div className="p-2.5 bg-background/60 rounded-lg border border-muted-foreground/20">
                                <span className="font-bold text-foreground block mb-0.5">{t('guide.sections.export.cardHtml', 'HTML Único')}</span>
                                <span className="text-muted-foreground text-[11px] leading-tight block">{t('guide.sections.export.cardHtmlDesc', 'Arquivo único autocontido para envio direto.')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Standalone Bottom Disclaimer Banner */}
            <div className="mt-14 p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3.5 shadow-sm">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-foreground/90 leading-relaxed space-y-1">
                    <span className="font-bold text-amber-400 uppercase tracking-wider block">
                        IMPORTANTE
                    </span>
                    <p className="opacity-90">
                        {t('guide.disclaimer', 'O IF Builder roda no seu navegador e não armazena dados em nuvem. Salve sempre seu arquivo .zip para guardar seu trabalho com segurança!')}
                    </p>
                </div>
            </div>
        </div>
    );
};
