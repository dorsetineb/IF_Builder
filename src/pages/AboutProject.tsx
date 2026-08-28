import React, { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Check, Heart, ExternalLink, Zap, BadgeDollarSign, ShieldCheck, Target, X, Globe, Copy, Workflow, Crop, Key, Download, Sparkles, Monitor, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { APP_VERSION } from '../version';
import { isDesktopApp, openExternalUrl } from '../utils/platform';
import { DownloadInstallerModal } from '../components/DownloadInstallerModal';

const DEVLOG_RELEASE_NOTES = `🚀 Atualizações e Melhorias da Versão v0.10.3

• Reorganização do Menu Lateral e Novas Páginas Dedicadas:
  - As seções "Mecânicas", "Estilo Visual" e "Rótulos" agora são páginas independentes acessadas diretamente no menu lateral esquerdo.
  - Nova ordem de navegação otimizada: Narrativa ➔ Mecânicas ➔ Estilo Visual ➔ Rótulos ➔ Objetos ➔ Rastreadores ➔ Verbos.
  - Renomeação de "Verbos Globais" para "Verbos" (com ícone de balão de fala) e "Textos Padrão" para "Rótulos" (com ícone de tipografia).
  - Remoção da página legada de Configurações para simplificar e modernizar a interface.

• Otimização de Performance e Correção no Runtime:
  - Otimização do efeito de chuva no Canvas para Linux e outros navegadores, eliminando gargalos de renderização.
  - Correção de travamento ao clicar no botão "Start" da vinheta/abertura quando efeitos atmosféricos de tela estavam ativos.

• Atualização do Instalador Linux:
  - Atualização do link de download da versão Linux para o formato portátil .AppImage (com hash SHA-256 verificado), substituindo o pacote .deb.

• Documentação e Tutoriais Completamente Atualizados:
  - Reestruturação completa dos tutoriais em docs/pt/tutorial (14 módulos de 00 a 13) acompanhando a nova ordem do menu lateral.
  - Novo guia detalhado de Cenários e Vistas (Point-and-Click com ferramentas de Retângulo, Círculo, Polígono Livre, Zoom/Pan, Ações e Condições de Bloqueio).
  - Novos tutoriais para Mecânicas, Estilo Visual, Rótulos, Verbos Globais e Mapa de Ramificações.
  - Nova documentação de referência para Cenários e Vistas em docs/pt/referencia/cenarios-e-vistas.md.

• Roteiros de Vídeo Sincronizados:
  - Criação da série completa de 14 roteiros de vídeo para gravação (de #00 a #13), com blocos de tempo, ações de tela e falas formatadas.`;

const AboutProject: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
    const { t, i18n } = useTranslation();
    const [showPixModal, setShowPixModal] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isDevLogModalOpen, setIsDevLogModalOpen] = useState(false);
    const [supportMethod, setSupportMethod] = useState<'pix' | 'kofi'>(i18n.language.startsWith('pt') ? 'pix' : 'kofi');

    // Automatically update the default selected tab if the user switches languages
    useEffect(() => {
        setSupportMethod(i18n.language.startsWith('pt') ? 'pix' : 'kofi');
    }, [i18n.language]);

    const handleCopyPix = () => {
        navigator.clipboard.writeText("rodbertes@gmail.com");
    };

    const handleOpenWebsite = async (targetUrl?: string) => {
        const url = (typeof targetUrl === 'string' && targetUrl) ? targetUrl : 'https://www.ifbuildr.com';
        await openExternalUrl(url);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const DonationButton = ({ onClick, href, icon: Icon, label, variant = 'primary' }: { onClick?: () => void, href?: string, icon?: any, label: string, variant?: 'primary' | 'secondary' }) => {
        const handleClick = () => {
            if (href) handleOpenWebsite(href);
            if (onClick) onClick();
        };

        return (
            <button
                onClick={handleClick}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${variant === 'primary'
                    ? 'bg-primary hover:bg-primary/90 shadow-primary/40 text-xs'
                    : 'bg-zinc-800 hover:bg-zinc-700 border border-muted-foreground/50 text-xs'
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
                <div className="h-[61px] border-b border-muted-foreground/50 flex items-center justify-between px-8 sticky top-0 bg-background/95 backdrop-blur z-20 shrink-0">
                    <div className="flex flex-col justify-center h-full">
                        <h1 className="text-xl font-bold text-white">{t('about.title', 'Sobre o IF Builder')}</h1>
                        <p className="text-[10px] text-white/70 hidden md:block">{t('about.subtitle', 'Saiba mais sobre o If Builder.')}</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-8 pt-6 pb-24 w-full">


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-7 xl:col-span-8 transition-all duration-300">
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
                            <div>
                                <div className="space-y-6 text-white leading-relaxed font-light text-sm mb-8">
                                    <p>{t('about.project.p1', 'O IF Builder é um editor de ficções interativas - narrativas textuais onde quem joga decide o que acontecerá em seguida.')}</p>
                                    <p>{t('about.project.p2', 'Aqui, as ficções interativas são escritas em ramificações. É fácil visualizar para onde cada escolha leva o jogador e como os caminhos se cruzam. Se você quer que algo aconteça apenas se o jogador tiver um item específico ou tiver feito uma escolha anterior, o editor resolve isso.')}</p>
                                    <p>{t('about.project.p3', 'Ao terminar, o editor exporta um arquivo .zip que funciona em qualquer navegador. Sua história sai do editor e vai direto para quem quiser jogar. E se essa pessoa utilizar o IF Builder, ela pode importar o arquivo .zip no editor e ver como você criou sua história. Quem sabe até fazer um remix?')}</p>
                                </div>

                                {/* Desktop Installer Banner (Web vs Desktop App) */}
                                {!isDesktopApp() ? (
                                    <div className="bg-zinc-900 border-2 border-primary/40 rounded-xl p-6 space-y-4 shadow-xl relative overflow-hidden">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                    <Monitor className="w-5 h-5 text-primary" />
                                                    {t('about.versions.desktopBannerTitle', 'Baixe o IFBuilder para Desktop')}
                                                </h3>
                                                <div className="text-xs text-white/70 leading-relaxed max-w-xl">
                                                    <p>{t('about.versions.desktopBannerDesc', 'Use o editor sem precisar de conexão com a internet. Disponível para Windows e Linux.')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex items-center flex-wrap gap-4">
                                            <button
                                                onClick={() => setIsDownloadModalOpen(true)}
                                                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>{t('about.versions.downloadBtn', 'Baixar Aplicativo Desktop (v{{version}})', { version: APP_VERSION })}</span>
                                            </button>

                                            <button
                                                onClick={() => setIsDevLogModalOpen(true)}
                                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 cursor-pointer py-1"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span>{t('about.versions.viewLogLink', 'ver log de desenvolvimento')}</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-zinc-900 border-2 border-primary/40 rounded-xl p-6 space-y-4 shadow-xl relative overflow-hidden">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                    <Globe className="w-5 h-5 text-primary" />
                                                    {t('about.versions.desktopAppTitle', 'Acesse o IFBuilder na web')}
                                                </h3>
                                                <div className="text-xs text-white/70 leading-relaxed max-w-none">
                                                    <p className="whitespace-normal xl:whitespace-nowrap">{t('about.versions.desktopAppDesc', 'Esta é a versão v{{version}} do aplicativo. Para baixar a última versão, procure o link na página Sobre o Projeto.', { version: APP_VERSION })}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex items-center flex-wrap gap-4">
                                            <button
                                                onClick={() => handleOpenWebsite('https://www.ifbuildr.com')}
                                                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5"
                                            >
                                                <span>www.ifbuildr.com</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => setIsDevLogModalOpen(true)}
                                                className="px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white/90 font-medium text-xs flex items-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
                                            >
                                                <FileText className="w-4 h-4 text-primary" />
                                                <span>{t('about.versions.changelogTitle', 'Log de Desenvolvimento')}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Fixa/Sticky */}
                    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 space-y-6 transition-all duration-300">
                        <div className="bg-gradient-to-b from-primary/10 to-transparent border-2 border-primary/50 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-4 h-4 text-primary fill-current" />
                                <h3 className="font-bold text-sm text-white">{t('about.support.sidebar.title', 'Apoie o Projeto')}</h3>
                            </div>

                            <div className="text-[12px] text-white/80 leading-relaxed mb-4 space-y-3">
                                <p>{t('about.support.p1', 'IF Builder é um projeto gratuito, sem fins lucrativos, e seu funcionamento é custeado pelo desenvolvedor.')}</p>
                                <p>{t('about.support.p2', 'Se esta ferramenta é útil para você, considere fazer uma doação de qualquer valor. Todo o recurso arrecadado é destinado exclusivamente ao pagamento dos custos de infraestrutura do site, incluindo a manutenção e as futuras melhorias.')}</p>
                            </div>

                            <div className="flex bg-zinc-900/50 p-1 rounded-lg mb-6 border border-muted-foreground/50">
                                <button
                                    onClick={() => setSupportMethod('pix')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${supportMethod === 'pix' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    PIX
                                </button>
                                <button
                                    onClick={() => setSupportMethod('kofi')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${supportMethod === 'kofi' ? 'bg-[#29abe0] text-primary-foreground shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    Ko-fi
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
                                <>
                                    <div className="bg-white p-2 rounded-lg flex justify-center mb-6 animate-in fade-in duration-300">
                                        <img
                                            src="/qrcode-kofi.png"
                                            alt="QR Code Ko-fi"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>

                                    <a
                                        href="https://ko-fi.com/ifbuildr"
                                        onClick={(e) => { e.preventDefault(); handleOpenWebsite('https://ko-fi.com/ifbuildr'); }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2 bg-[#29abe0] hover:bg-[#228cb8] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#29abe0]/20 hover:-translate-y-0.5"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {t('about.support.sidebar.kofiBtn', 'Acessar Ko-fi')}
                                    </a>
                                </>
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
                            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2 text-white">{t('about.support.modal.title', 'Chave PIX')}</h3>
                            <p className="text-xs text-white/70 mb-6">
                                {t('about.support.modal.desc', 'Chave aleatória se preferir não escanear o QR Code.')}
                            </p>

                            <div className="p-4 bg-zinc-900 border border-muted-foreground/50 rounded-xl mb-6 relative group cursor-pointer" onClick={handleCopyPix}>
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
                                className="text-xs text-white/60 hover:text-white underline"
                            >
                                {t('about.support.modal.close', 'Fechar')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Download Installer Modal */}
            <DownloadInstallerModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
            />

            {/* Dev Log Modal */}
            {isDevLogModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-card border border-muted-foreground/50 rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-muted-foreground/50 flex items-center justify-between">
                            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                {t('about.versions.changelogTitle', 'Log de Desenvolvimento')}
                            </h2>
                            <button
                                onClick={() => setIsDevLogModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col gap-5 max-h-[65vh] overflow-y-auto">
                            {/* Version Header with Tag to the Right */}
                            <div className="flex items-center gap-3 pb-3 border-b border-muted-foreground/20">
                                <span className="font-bold text-foreground text-lg">
                                    v{APP_VERSION}
                                </span>
                                <span className="text-[10px] font-mono bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30 font-semibold uppercase tracking-wider shrink-0">
                                    {t('about.versions.latestTag', 'Última Versão')}
                                </span>
                            </div>

                            {/* Release Notes Content */}
                            <div className="space-y-3 text-xs text-foreground/90 leading-relaxed font-sans whitespace-pre-wrap bg-muted/20 p-4 rounded-lg border border-muted-foreground/20 max-h-[50vh] overflow-y-auto">
                                {t('about.versions.devlogContent', DEVLOG_RELEASE_NOTES)}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end p-4 border-t border-muted-foreground/50 bg-muted/30">
                            <button
                                onClick={() => setIsDevLogModalOpen(false)}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded transition-colors"
                            >
                                {t('common.close', 'Fechar')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutProject;
