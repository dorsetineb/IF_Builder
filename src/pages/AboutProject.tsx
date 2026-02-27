import React, { useState, useEffect } from 'react';
import { Check, Heart, ExternalLink, Zap, BadgeDollarSign, ShieldCheck, Target, X, Globe, Copy, User, Workflow, Crop, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutProject: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
    const { t, i18n } = useTranslation();
    const [showPixModal, setShowPixModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'about_project' | 'support' | 'dev'>('about_project');
    const [supportMethod, setSupportMethod] = useState<'pix' | 'kofi'>(i18n.language.startsWith('pt') ? 'pix' : 'kofi');

    // Automatically update the default selected tab if the user switches languages
    useEffect(() => {
        setSupportMethod(i18n.language.startsWith('pt') ? 'pix' : 'kofi');
    }, [i18n.language]);

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
                    ? 'bg-primary hover:bg-primary/90 shadow-primary/40 text-xs'
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
                        <h1 className="text-xl font-bold text-foreground">{t('about.title', 'Sobre o IF Builder')}</h1>
                        <p className="text-[10px] text-muted-foreground hidden md:block">{t('about.subtitle', 'Conheça a missão e os valores por trás do IF Builder.')}</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-8 pt-6 pb-24 w-full animate-in fade-in duration-500">


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-7 xl:col-span-8 transition-all duration-300">
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-muted-foreground/50 mb-6">
                            <div className="flex space-x-6">

                                <button
                                    onClick={() => setActiveTab('about_project')}
                                    className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'about_project'
                                        ? 'text-primary border-b-4 border-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {t('about.tabs.aboutProject', 'Sobre o Projeto')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('dev')}
                                    className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'dev'
                                        ? 'text-primary border-b-4 border-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {t('about.tabs.developer', 'Sobre o Desenvolvedor')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('support')}
                                    className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'support'
                                        ? 'text-primary border-b-4 border-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {t('about.tabs.support', 'Apoie o IF Builder')}
                                </button>
                            </div>
                        </div>




                        {/* TAB: SOBRE O PROJETO (NOVO) */}
                        {activeTab === 'about_project' && (
                            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-purple-500/10 rounded-lg">
                                            <Zap className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <h2 className="text-lg font-bold text-foreground">
                                            {t('about.title', 'Sobre o IF Builder')}
                                        </h2>
                                    </div>
                                    <div className="space-y-6 text-muted-foreground leading-relaxed font-light text-sm">
                                        <p>{t('about.project.p1', 'O IF Builder é um editor que desenvolvi para criar ficções interativas - narrativas textuais onde quem joga decide o que acontecerá em seguida.')}</p>
                                        <p>{t('about.project.p2', 'Aqui, as ficções interativas são escritas em cenas. É fácil visualizar para onde cada escolha leva o jogador e como os caminhos se cruzam. Se você quer que algo aconteça apenas se o jogador tiver um item específico ou tiver feito uma escolha anterior, o editor resolve isso.')}</p>
                                        <p>{t('about.project.p3', 'Ao terminar, o editor exporta um arquivo .zip que funciona em qualquer navegador. Sua história sai do editor e vai direto para quem quiser jogar. E se essa pessoa utilizar o IF Builder, ela pode importar o arquivo .zip no editor e ver como você criou sua história. Quem sabe até fazer um remix?')}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: APOIAR (ANTIGO SOBRE O PROJETO) */}
                        {activeTab === 'support' && (
                            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <Heart className="w-6 h-6 text-primary" />
                                        </div>
                                        <h2 className="text-lg font-bold text-foreground">
                                            {t('about.support.title', 'Por que apoiar?')}
                                        </h2>
                                    </div>

                                    <div className="space-y-6 text-muted-foreground leading-relaxed font-light text-sm">
                                        <p>{t('about.support.p1', 'IF Builder é um projeto gratuito, sem fins lucrativos, e seu funcionamento é custeado pelo desenvolvedor.')}</p>
                                        <p>{t('about.support.p2', 'Se esta ferramenta é útil para você, considere fazer uma doação de qualquer valor. Todo o recurso arrecadado é destinado exclusivamente ao pagamento dos custos de infraestrutura do site, incluindo a manutenção e as futuras melhorias.')}</p>
                                        <p>
                                            {t('about.support.p3', 'Se tiver sugestões, críticas ou quiser compartilhar suas histórias, mande um e-mail para: ')}
                                            <strong><a className="text-primary hover:underline hover:text-primary/80" href="mailto:ola@ifbuildr.com">ola@ifbuildr.com</a></strong>
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
                                                <h3 className="text-lg font-bold text-foreground">@dorsetineb</h3>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6 text-muted-foreground leading-relaxed font-light text-sm text-left">
                                            <p>{t('about.dev.p1', 'Sou bacharel em Artes Visuais, pós-graduado em Gestão da Inovação, e atuo há mais de uma década em projetos que envolvem design, educação e tecnologia.')}</p>
                                            <p>{t('about.dev.p2', 'Tive a sorte de trabalhar com desenho e com computadores, e adoro histórias que são contadas de um jeito diferente.')}</p>
                                            <p>
                                                {t('about.dev.p3', 'Escrevo com alguma regularidade no ')}
                                                <a href="https://substack.com/@dorsetineb" target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 hover:underline">Substack</a>
                                                {t('about.dev.p4', ', e seria muito legal conversar com você por lá também!')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Fixa/Sticky */}
                    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-0 space-y-6 transition-all duration-300">
                        <div className="bg-gradient-to-b from-primary/20 to-transparent border border-primary/20 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-4 h-4 text-primary fill-current" />
                                <h3 className="font-bold text-sm text-white">{t('about.support.sidebar.title', 'Apoie o Projeto')}</h3>
                            </div>

                            <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">
                                {t('about.support.sidebar.desc', 'Este projeto é mantido com amor e doações. Se ele é útil pra você, considere contribuir com um PIX ou doar um Ko-fi!')}
                            </p>

                            <div className="flex bg-zinc-900/50 p-1 rounded-lg mb-6 border border-zinc-800">
                                <button
                                    onClick={() => setSupportMethod('pix')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${supportMethod === 'pix' ? 'bg-primary text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    PIX
                                </button>
                                <button
                                    onClick={() => setSupportMethod('kofi')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${supportMethod === 'kofi' ? 'bg-[#29abe0] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    Ko-Fi
                                </button>
                            </div>

                            {supportMethod === 'pix' ? (
                                <>
                                    <div className="bg-white p-2 rounded-lg flex justify-center mb-6">
                                        <img
                                            src="/qrcode-pix.png"
                                            alt="QR Code PIX"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>

                                    <button
                                        onClick={() => setShowPixModal(true)}
                                        className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                                    >
                                        <Key className="w-4 h-4" />
                                        {t('about.support.sidebar.btn', 'Ver Chave PIX')}
                                    </button>
                                </>
                            ) : (
                                <div className="w-full flex justify-center rounded-lg overflow-hidden border border-zinc-800 bg-transparent h-[450px]">
                                    <iframe
                                        id='kofiframe'
                                        src='https://ko-fi.com/ifbuildr/?hidefeed=true&widget=true&embed=true&preview=true'
                                        style={{ border: 'none', padding: '4px' }}
                                        height='450'
                                        title='ifbuildr'
                                    />
                                </div>
                            )}
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
                    <div className="bg-zinc-950 border-2 border-primary rounded-2xl p-8 shadow-2xl relative z-10 w-full max-w-sm animate-in zoom-in duration-300">
                        <button
                            onClick={() => setShowPixModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2 text-white">{t('about.support.modal.title', 'Chave PIX')}</h3>
                            <p className="text-xs text-zinc-400 mb-6">
                                {t('about.support.modal.desc', 'Chave aleatória se preferir não escanear o QR Code.')}
                            </p>

                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl mb-6 relative group cursor-pointer" onClick={handleCopyPix}>
                                <p className="text-xs font-mono break-all text-primary/80">
                                    4f489a50-c458-4adf-b211-62075adebf13
                                </p>
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                    <span className="text-xs font-bold text-white flex items-center gap-1">
                                        <Copy size={12} /> {t('about.support.modal.copy', 'Copiar')}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowPixModal(false)}
                                className="text-xs text-zinc-500 hover:text-zinc-300 underline"
                            >
                                {t('about.support.modal.close', 'Fechar')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutProject;
