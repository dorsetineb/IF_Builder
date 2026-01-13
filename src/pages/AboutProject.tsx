import React, { useState } from 'react';
import { Check, Heart, ExternalLink, Activity, BadgeDollarSign, ShieldCheck, Target, X, Globe, Copy, User, Workflow, Crop } from 'lucide-react';
import { useUser } from '../components/UserContext';

const AboutProject: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
    const [showPixModal, setShowPixModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'what_is' | 'about_project' | 'support' | 'dev'>('what_is');

    const handleCopyPix = () => {
        navigator.clipboard.writeText("rodbertes@gmail.com");
        // Simple alert or toast could happen here, but keeping it simple as per original
    };



    const DonationButton = ({ onClick, href, icon: Icon, label, variant = 'primary' }: { onClick?: () => void, href?: string, icon?: any, label: string, variant?: 'primary' | 'secondary' }) => {
        const handleClick = () => {
            if (href) window.open(href, '_blank', 'noopener,noreferrer');
            if (onClick) onClick();
        };

        return (
            <button
                onClick={handleClick}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${variant === 'primary'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/40 text-xs'
                    : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs'
                    }`}
            >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
            </button>
        );
    };

    return (
        <div className="min-h-full font-sans text-xs bg-background flex flex-col">
            {/* Header matches Platform Header style */}
            {!hideHeader && (
                <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-20 shrink-0">
                    <div className="flex flex-col justify-center h-full">
                        <h1 className="text-xl font-bold text-foreground">Sobre o Projeto</h1>
                        <p className="text-[10px] text-muted-foreground hidden md:block">Conheça a missão e os valores por trás do IF Builder.</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-8 pt-6 pb-24 w-full animate-in fade-in duration-500">


                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative">
                    {/* Main Content - 3 Columns */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-muted-foreground/50 mb-6">
                            <div className="flex space-x-6">
                                <button
                                    onClick={() => setActiveTab('what_is')}
                                    className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'what_is'
                                        ? 'text-purple-400 border-b-4 border-purple-500'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    O que é
                                </button>
                                <button
                                    onClick={() => setActiveTab('about_project')}
                                    className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'about_project'
                                        ? 'text-purple-400 border-b-4 border-purple-500'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    Sobre o Projeto
                                </button>
                                <button
                                    onClick={() => setActiveTab('dev')}
                                    className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'dev'
                                        ? 'text-purple-400 border-b-4 border-purple-500'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    Sobre o Desenvolvedor
                                </button>
                                <button
                                    onClick={() => setActiveTab('support')}
                                    className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'support'
                                        ? 'text-purple-400 border-b-4 border-purple-500'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    Apoiar
                                </button>
                            </div>
                        </div>

                        {/* TAB: O QUE É */}
                        {activeTab === 'what_is' && (
                            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                                {/* O que é Ficção Interativa */}
                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-blue-500/10 rounded-lg">
                                            <Workflow className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <h2 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                            O que é uma ficção interativa?
                                        </h2>
                                    </div>
                                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light text-sm">
                                        <p>
                                            Ficções interativas (IF) são narrativas onde o leitor toma decisões que alteram o rumo da história. Elas funcionam como um meio termo entre a literatura tradicional e o design de jogos, sendo utilizadas em diversos contextos além do entretenimento.
                                        </p>
                                    </div>
                                </div>

                                {/* Contextos de Uso */}
                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-indigo-500/10 rounded-lg">
                                            <Crop className="w-6 h-6 text-indigo-500" />
                                        </div>
                                        <h2 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                            Em que contexto ficções interativas podem ser utilizadas?
                                        </h2>
                                    </div>
                                    <div className="space-y-8 text-zinc-300 leading-relaxed font-light text-sm">
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-white text-base">1. Educação e Treinamento</h3>
                                            <p>Utilizadas para colocar estudantes ou profissionais diante de dilemas éticos, históricos ou técnicos. Em vez de apenas ler sobre um conceito, o usuário precisa aplicar o conhecimento para avançar. Ajuda no desenvolvimento da lógica de causa e efeito, onde cada escolha gera uma consequência clara no sistema.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-white text-base">2. Prototipagem Narrativa</h3>
                                            <p>Escritores e desenvolvedores utilizam ficções interativas para testar estrutura de diálogos e árvores de decisão antes de investir em produções complexas (como jogos 3D ou filmes interativos). É uma forma rápida de verificar se um enredo complexo possui furos de roteiro ou becos sem saída.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-white text-base">3. Entretenimento</h3>
                                            <p>Artistas e autores podem experimentar uma formato narrativo diferente para contar suas histórias, e desenvolvedores podem criar pequenos jogos. Fanfics, simuladores de relacionamento, dramas de um apocalipse zumbi (ou robótico). Diversão é sempre um bom contexto.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-white text-base">4. Terapia e Saúde</h3>
                                            <p>Profissionais da saúde podem criar situações interativas para auxílio no tratamento de fobias e ansiedade por meio de exposição controlada a cenários desafiadores em um ambiente virtual e seguro.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* TAB: SOBRE O PROJETO (NOVO) */}
                        {activeTab === 'about_project' && (
                            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                                            <Activity className="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <h2 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                            Sobre o IF Builder
                                        </h2>
                                    </div>
                                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light text-sm text-justify">
                                        <p>
                                            O IF Builder é uma ferramenta gratuita de criação de histórias interativas e não-lineares por meio de cenas que se conectam através de interações. Todas as ficções interativas criadas aqui são exportadas em um arquivo .zip autossuficiente. Ele não precisa de internet nem do editor para funcionar, apenas um navegador. Pense nele como um disquete: você pode guardá-lo em uma gaveta, ou entregá-lo a alguém. Quem receber o seu arquivo .zip pode rodar a ficção, e também pode importá-lo no IF Builder para ver exatamente como foi encaixada cada peça da narrativa.
                                        </p>
                                        <p>
                                            Este é um projeto independente, que utiliza Inteligência Artificial Generativa em sua estrutura e desenvolvimento. No entanto, ele não foi criado para a automação narrativa. O objetivo desta ferramenta é exatamente o oposto: Incentivar nas pessoas o pensamento, planejamento, criatividade e o manuseio de dados com uma tecnologia low-tech.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: APOIAR (ANTIGO SOBRE O PROJETO) */}
                        {activeTab === 'support' && (
                            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-purple-500/10 rounded-lg">
                                            <Heart className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <h2 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                            Por que apoiar o IF Builder?
                                        </h2>
                                    </div>

                                    <div className="space-y-6 text-zinc-300 leading-relaxed font-light text-sm">
                                        <p>
                                            <strong className="text-white font-medium">Não temos anúncios, e não vendemos dados.</strong> Por ser um projeto gratuito e sem fins lucrativos, os custos são arcados inteiramente pelo desenvolvedor. Se esta ferramenta é útil para você, considere fazer uma doação de qualquer valor. Todo o recurso arrecadado é destinado exclusivamente ao pagamento dos custos de infraestrutura do site, incluindo a manutenção e as futuras melhorias.
                                        </p>
                                        <p>
                                            Esta plataforma foi criada com o auxílio de inteligência artificial generativa — seria hipocrisia esconder isso. Mas o IF Builder não foi feito para gerar histórias automáticas. Ele é uma ferramenta mecânica, que exige atenção, e foi desenhada para que você possa fazer o trabalho humano de contar uma história que pareça real. Sua intenção controla a máquina.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* TAB: SOBRE O DESENVOLVEDOR (Renamed & Reordered) */}
                        {activeTab === 'dev' && (
                            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Avatar Refined */}
                                        <div className="flex-shrink-0 flex flex-col items-center">
                                            <div className="w-32 h-32 rounded-full border-4 border-zinc-700 overflow-hidden flex items-center justify-center">
                                                <img
                                                    src="/rodrigo-profile.png"
                                                    alt="Rodrigo Benites"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="mt-4 text-center">
                                                <h3 className="text-lg font-bold text-white">@dorsetineb</h3>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6 text-zinc-300 leading-relaxed font-light text-sm text-left">
                                            <p>
                                                Formado em Artes Visuais e atuando há mais de uma década em projetos de design, inovação educacional e recursos tecnológicos. Entrei no Senac São Paulo como ilustrador, e conforme os projetos aumentavam em complexidade, trabalhei como diretor de arte, articulador de demandas audiovisuais, analista de novas tecnologias aplicadas à educação (foco em Realidade Estendida e IA Generativa) e hoje me dedico ao monitoramento estratégico de projetos de tecnologia da informação.
                                            </p>
                                            <p>
                                                Para mim, a tecnologia é uma ferramenta de expressão humana, seja ilustrando um cenário, diagramando um livro, documentando procedimentos ou desenvolvendo jogos.
                                            </p>
                                            <p className="pt-4 text-zinc-400">
                                                Tento escrever com alguma regularidade no Substack - <a href="https://substack.com/@dorsetineb" target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline">https://substack.com/@dorsetineb</a>. Seria legal conversar com voce por lá.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Fixa/Sticky */}
                    <div className="lg:col-span-1 lg:sticky lg:top-0 space-y-6">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center gap-2 mb-4">
                                <Heart className="w-4 h-4 text-purple-500 fill-current" />
                                <h3 className="font-bold text-sm text-white">Apoie o Projeto</h3>
                            </div>

                            <div className="bg-white p-2 rounded-lg flex justify-center mb-6">
                                <img
                                    src="/qrcode-pix.png"
                                    alt="QR Code PIX"
                                    className="w-full h-auto object-contain"
                                />
                            </div>

                            <div className="space-y-3 mb-6">
                                {/* Key Points */}
                                <div className="flex items-start gap-2 text-xs text-zinc-400">
                                    <Check className="w-3 h-3 text-purple-500 mt-0.5 shrink-0" />
                                    <span>100% para infraestrutura</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-zinc-400">
                                    <Check className="w-3 h-3 text-purple-500 mt-0.5 shrink-0" />
                                    <span>Plataforma livre de ads</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-zinc-400">
                                    <Check className="w-3 h-3 text-purple-500 mt-0.5 shrink-0" />
                                    <span>Recursos experimentais</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowPixModal(true)}
                                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
                            >
                                <BadgeDollarSign className="w-4 h-4" />
                                Contribuir via PIX
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PIX Modal (Optional details) */}
            {showPixModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowPixModal(false)}
                    />
                    <div className="bg-zinc-950 border border-border rounded-2xl p-8 shadow-2xl relative z-10 w-full max-w-sm animate-in zoom-in duration-300">
                        <button
                            onClick={() => setShowPixModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2 text-white">Chave PIX</h3>
                            <p className="text-xs text-zinc-400 mb-6">
                                Chave aleatória se preferir não escanear o QR Code.
                            </p>

                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl mb-6 relative group cursor-pointer" onClick={handleCopyPix}>
                                <p className="text-xs font-mono break-all text-purple-300">
                                    4f489a50-c458-4adf-b211-62075adebf13
                                </p>
                                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                    <span className="text-xs font-bold text-white flex items-center gap-1">
                                        <Copy size={12} /> Copiar
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowPixModal(false)}
                                className="text-xs text-zinc-500 hover:text-zinc-300 underline"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutProject;
