import React from 'react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-zinc-950 border border-muted-foreground/50 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl">
        {/* Header */}
        <div className="p-8 border-b border-muted-foreground/50 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{t('manualModal.title', 'Manual de Uso')}</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('manualModal.subtitle', 'Aprenda a criar sua aventura interativa')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-all transform hover:scale-110"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-10 overflow-y-auto space-y-12 text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">

          <section className="bg-zinc-900/30 p-6 rounded-xl border border-muted-foreground/50">
            <p className="text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.intro', 'O <strong className="text-white">IF Builder</strong> permite criar jogos de ficção interativa (Interactive Fiction). O jogo é composto por <strong>Ramificações</strong>, onde o jogador lê descrições, observa imagens e digita comandos (verbos) para interagir com <strong>Objetos</strong> e navegar pelo mundo.')) }}></p>
          </section>

          <section>
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">{t('manualModal.section1Title', '1. Editor de Ramificações')}</h3>
            <div className="space-y-4 text-sm">
              <p>{t('manualModal.section1Intro', 'Cada ramificação é um local ou momento no seu jogo. Configure:')}</p>
              <ul className="list-disc ml-6 space-y-3 marker:text-primary">
                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section1Item1', '<strong className="text-zinc-200">Texto Interativo:</strong> Use a sintaxe <code>&lt;palavra&gt;</code> na descrição. Isso tornará a palavra clicável no jogo, facilitando a digitação de comandos para o jogador.')) }}></li>
                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section1Item2', '<strong className="text-zinc-200">Imagem e Música:</strong> Cada ramificação pode tener uma imagem de fundo única e uma trilha sonora que começa a tocar assim que o jogador entra nela.')) }}></li>
                <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section1Item3', '<strong className="text-zinc-200">Ramificação Inicial:</strong> Defina qual ramificação será o ponto de partida do seu jogo no menu lateral.')) }}></li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">{t('manualModal.section2Title', '2. Biblioteca de Objetos')}</h3>
            <p className="text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section2Intro', 'Os objetos são itens que podem estar em uma ramificação. Eles são <strong className="text-white">globais</strong>: você cria um objeto uma vez (ex: "Chave de Ouro") e pode vinculá-lo a múltiplas ramificações ou usá-lo em interações em qualquer lugar do jogo.')) }}></p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-sm marker:text-primary">
              <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section2Item1', '<strong className="text-zinc-200">Exame:</strong> Defina uma descrição detalhada que o jogador verá ao usar o comando "olhar" ou "examinar" o objeto.')) }}></li>
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">{t('manualModal.section3Title', '3. Interações')}</h3>
            <p className="text-sm">{t('manualModal.section3Intro', 'As interações definem o que acontece quando o jogador digita um comando.')}</p>
            <div className="bg-zinc-900/50 p-8 rounded-xl border border-muted-foreground/50 mt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-zinc-950 rounded-lg border border-muted-foreground/50">
                  <p className="font-bold text-zinc-500 uppercase tracking-widest mb-2">{t('manualModal.verbsTitle', 'Verbos')}</p>
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.verbsDesc', 'Lista de palavras que ativam a ação (ex: <code>abrir, destrancar, usar</code>).')) }}></p>
                </div>
                <div className="p-4 bg-zinc-950 rounded-lg border border-muted-foreground/50">
                  <p className="font-bold text-zinc-500 uppercase tracking-widest mb-2">{t('manualModal.targetTitle', 'Alvo')}</p>
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.targetDesc', 'O objeto da ramificação com o qual o jogador quer interagir (ex: <code>Porta</code>).')) }}></p>
                </div>
                <div className="p-4 bg-zinc-950 rounded-lg border border-muted-foreground/50">
                  <p className="font-bold text-zinc-500 uppercase tracking-widest mb-2">{t('manualModal.reqTitle', 'Requisito')}</p>
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.reqDesc', 'O item que o jogador PRECISA ter no inventário (ex: <code>Chave</code>).')) }}></p>
                </div>
                <div className="p-4 bg-zinc-950 rounded-lg border border-muted-foreground/50">
                  <p className="font-bold text-zinc-500 uppercase tracking-widest mb-2">{t('manualModal.resTitle', 'Resultado')}</p>
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.resDesc', 'O que acontece após o comando (ex: ir para outra ramificação).')) }}></p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-muted-foreground/50">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">{t('manualModal.exampleCommandTitle', 'Player verb example:')}</p>
                <div className="text-lg bg-zinc-950 p-6 rounded-xl border border-muted-foreground/50 shadow-inner italic text-white flex items-center gap-3">
                  <span className="text-zinc-600 font-mono">&gt;</span> {t('manualModal.exampleCommand', '"Destrancar porta com a chave"')}
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] font-bold uppercase tracking-tighter">
                  <div className="p-3 bg-zinc-900 rounded-lg border border-muted-foreground/50 flex flex-col gap-1"><span className="text-zinc-600">{t('manualModal.verbsTitle', 'Verbo')}</span><span className="text-white">{t('manualModal.verbVal', 'Destrancar')}</span></div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-muted-foreground/50 flex flex-col gap-1"><span className="text-zinc-600">{t('manualModal.targetTitle', 'Alvo')}</span><span className="text-white">{t('manualModal.targetVal', 'Porta')}</span></div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-muted-foreground/50 flex flex-col gap-1"><span className="text-zinc-600">{t('manualModal.reqTitle', 'Requisito')}</span><span className="text-white">{t('manualModal.reqVal', 'Chave')}</span></div>
                </div>
                <p className="mt-6 text-xs text-zinc-500 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.tip', '💡 <strong>Dica:</strong> O jogador pode digitar em <strong>qualquer ordem</strong> (ex: <em>"Usar chave na porta"</em> ou <em>"Porta abrir chave"</em>). O sistema identificará automaticamente as palavras-chave para validar a interação.')) }}></p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">{t('manualModal.section4Title', '4. Rastreadores')}</h3>
            <p className="text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section4Intro', 'Use rastreadores para criar sistemas complexos como <strong className="text-white">Vida, Dinheiro ou Estresse</strong>.')) }}></p>
            <ul className="list-disc ml-6 mt-4 space-y-3 text-sm marker:text-primary">
              <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section4Item1', 'Interações podem aumentar ou diminuir o valor de um rastreador.')) }}></li>
              <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section4Item2', 'Quando um rastreador atinge seu <strong>valor máximo</strong>, o jogador é automaticamente transportado para uma <strong>Ramificação de Consequência</strong>.')) }}></li>
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">{t('manualModal.section5Title', '5. Finalização')}</h3>
            <p className="text-sm">{t('manualModal.section5Intro', 'Quando seu jogo estiver pronto:')}</p>
            <ol className="list-decimal ml-6 space-y-3 mt-4 text-sm marker:text-white font-medium">
              <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section5Item1', 'Use o botão <strong className="text-white px-2 py-0.5 bg-zinc-900 rounded border border-muted-foreground/50">Pré-visualizar</strong> para testar toda a experiênca.')) }}></li>
              <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section5Item2', 'Clique em <strong className="text-white px-2 py-0.5 bg-zinc-900 rounded border border-muted-foreground/50">Exportar Jogo</strong> para baixar um arquivo <code>.zip</code>.')) }}></li>
              <li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('manualModal.section5Item3', 'Extraia o zip e abra o arquivo <code>index.html</code> em qualquer navegador para jogar ou compartilhar!')) }}></li>
            </ol>
          </section>

        </div>

        {/* Footer */}
        <div className="p-8 border-t border-muted-foreground/50 bg-zinc-900/50 flex justify-center">
          <button
            onClick={onClose}
            className="px-10 py-4 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest"
          >
            {t('manualModal.understoodBtn', 'Entendi, vamos criar!')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManualModal;
