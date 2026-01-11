import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Heart, ExternalLink, Activity, BadgeDollarSign, ShieldCheck, Target, X, Globe } from 'lucide-react';
import { useUser } from '../components/UserContext';

const AboutProject: React.FC = () => {
    const [showPixModal, setShowPixModal] = useState(false);

    const DonationButton = ({ onClick, href, icon: Icon, label, variant = 'primary' }: { onClick?: () => void, href?: string, icon?: any, label: string, variant?: 'primary' | 'secondary' }) => {
        const handleClick = () => {
            if (href) window.open(href, '_blank', 'noopener,noreferrer');
            if (onClick) onClick();
        };

        return (
            <button
                onClick={handleClick}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${variant === 'primary'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/40'
                    : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700'
                    }`}
            >
                {Icon && <Icon className="w-5 h-5" />}
                {label}
            </button>
        );
    };

    return (
        <div className="min-h-full font-sans text-xs bg-background flex flex-col">
            {/* Header matches Platform Header style */}
            <div className="h-[61px] border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-10 shrink-0">
                <div className="flex flex-col justify-center h-full">
                    <h1 className="text-xl font-bold text-foreground">Sobre o Projeto</h1>
                    <p className="text-[10px] text-muted-foreground hidden md:block">Conheça a missão e os valores por trás do IF Builder.</p>
                </div>
            </div>

            {/* Adjusted padding to perfectly align with the top "Abrir Editor" button offset (16px) */}
            <div className="max-w-7xl mx-auto px-8 py-4 w-full animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content - 2 Columns */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Objectives Section */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <Target className="w-6 h-6 text-purple-500" />
                                </div>
                                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                    Objetivo
                                </h2>
                            </div>

                            {/* Reduced font size to text-xs and leading-relaxed */}
                            <div className="space-y-6 text-zinc-300 leading-relaxed font-light text-xs">
                                <p>
                                    O <strong className="text-white font-medium">IF Builder</strong> nasceu do desejo de criar uma ferramenta de escrita eficiente e acessível para autores de narrativas não-lineares. Este é um projeto mantido por apenas uma pessoa, sem intenção de lucro, focado puramente em oferecer uma experiência de qualidade para a comunidade de escritores.
                                </p>
                                <p>
                                    Acreditamos que a tecnologia deve ser um facilitador, não uma barreira. Por isso, desenvolvemos um ecossistema focado na comunidade, onde o compartilhamento de conhecimento e templates é o motor principal da nossa evolução.
                                </p>
                            </div>
                        </div>

                        {/* Sustainability Section */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-lg">
                                    <Activity className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                    Manutenção e Sustentabilidade
                                </h2>
                            </div>

                            {/* Reduced font size to text-xs */}
                            <div className="space-y-6 text-zinc-300 leading-relaxed font-light text-xs">
                                <p>
                                    Para manter o IF Builder online e funcional, existem custos fixos de servidor, banco de dados e manutenção de domínio. Por ser um projeto gratuito e sem fins lucrativos, os custos são arcados inteiramente pelo desenvolvedor.
                                </p>
                                <p>
                                    Se a ferramenta é útil para você, considere fazer uma doação de qualquer valor. Todo o recurso arrecadado é destinado exclusivamente ao pagamento dos custos de infraestrutura do site, garantindo que suas histórias permaneçam seguras e acessíveis.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar - Donation Card */}
                    <div className="space-y-6 lg:mt-0">
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm relative overflow-hidden group">
                            {/* Gradient Glow */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full group-hover:bg-purple-600/20 transition-all duration-700" />

                            <div className="relative z-10 flex flex-col items-start text-left">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-pink-500/10 rounded-lg">
                                        <Heart className="w-6 h-6 text-pink-500 animate-pulse" fill="currentColor" />
                                    </div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                        Apoie o IF Builder
                                    </h2>
                                </div>

                                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                                    Ajude-nos a manter os servidores ativos e a desenvolver novas funcionalidades para todos!
                                </p>

                                <div className="space-y-3 w-full">
                                    <DonationButton
                                        onClick={() => setShowPixModal(true)}
                                        label="Pix"
                                    />
                                    <DonationButton
                                        label="Apoia.se"
                                        variant="secondary"
                                        href="https://apoia.se/ifbuilder"
                                    />
                                    <DonationButton
                                        label="Patreon"
                                        variant="secondary"
                                        href="https://www.patreon.com/ifbuilder"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Impact Card */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h4 className="font-bold text-sm mb-4">Impacto da sua doação</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-xs text-zinc-400">
                                    <div className="mt-0.5 bg-green-500/20 p-1 rounded-full">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span>100% destinado à infraestrutura.</span>
                                </li>
                                <li className="flex items-start gap-3 text-xs text-zinc-400">
                                    <div className="mt-0.5 bg-green-500/20 p-1 rounded-full">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span>Mantém a plataforma livre de ads.</span>
                                </li>
                                <li className="flex items-start gap-3 text-xs text-zinc-400">
                                    <div className="mt-0.5 bg-green-500/20 p-1 rounded-full">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span>Suporta novos recursos experimentais.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* PIX Modal */}
            {showPixModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowPixModal(false)}
                    />
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl relative z-10 w-full max-w-sm animate-in zoom-in duration-300">
                        <button
                            onClick={() => setShowPixModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-purple-500/10 rounded-full">
                                    <BadgeDollarSign className="w-10 h-10 text-purple-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Contribuição via PIX</h3>
                            <p className="text-xs text-muted-foreground mb-8">
                                Escaneie o QR Code abaixo ou utilize a chave PIX para contribuir.
                            </p>

                            <div className="bg-white p-6 rounded-2xl shadow-inner flex justify-center mb-8">
                                <QRCodeSVG
                                    value="00020126330014BR.GOV.BCB.PIX0111000000000005204000053039865802BR5913Rodbertes8020063041234"
                                    size={200}
                                    level="H"
                                />
                            </div>

                            <div className="p-4 bg-muted/50 border border-border rounded-xl">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">Chave Aleatória</p>
                                <p className="text-xs font-mono break-all text-foreground">
                                    rodbertes@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutProject;
