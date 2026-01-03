
import React from 'react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl">
        {/* Header */}
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Manual de Uso</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Aprenda a criar sua aventura interativa</p>
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

          <section className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800/50">
            <p className="text-sm">O <strong className="text-white">IF Builder</strong> permite criar jogos de ficção interativa (Interactive Fiction). O jogo é composto por <strong>Cenas</strong>, onde o jogador lê descrições, observa imagens e digita comandos (verbos) para interagir com <strong>Objetos</strong> e navegar pelo mundo.</p>
          </section>

          <section>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">1. Editor de Cenas</h3>
            <div className="space-y-4 text-sm">
              <p>Cada cena é um local ou momento no seu jogo. Configure:</p>
              <ul className="list-disc ml-6 space-y-3 marker:text-purple-500">
                <li><strong className="text-zinc-200">Texto Interativo:</strong> Use a sintaxe <code>&lt;palavra&gt;</code> na descrição. Isso tornará a palavra clicável no jogo, facilitando a digitação de comandos para o jogador.</li>
                <li><strong className="text-zinc-200">Imagem e Música:</strong> Cada cena pode ter uma imagem de fundo única e uma trilha sonora que começa a tocar assim que o jogador entra nela.</li>
                <li><strong className="text-zinc-200">Cena Inicial:</strong> Defina qual cena será o ponto de partida do seu jogo no menu lateral.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">2. Biblioteca de Objetos</h3>
            <p className="text-sm">Os objetos são itens que podem estar em uma cena. Eles são <strong className="text-white">globais</strong>: você cria um objeto uma vez (ex: "Chave de Ouro") e pode vinculá-lo a múltiplas cenas ou usá-lo em interações em qualquer lugar do jogo.</p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-sm marker:text-purple-500">
              <li><strong className="text-zinc-200">Exame:</strong> Defina uma descrição detalhada que o jogador verá ao usar o comando "olhar" ou "examinar" o objeto.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">3. Interações</h3>
            <p className="text-sm">As interações definem o que acontece quando o jogador digita um comando.</p>
            <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 mt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-900">
                  <p className="font-bold text-zinc-500 uppercase tracking-widest mb-2">Verbos</p>
                  <p>Lista de palavras que ativam a ação (ex: <code>abrir, destrancar, usar</code>).</p>
                </div>
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-900">
                  <p className="font-bold text-zinc-500 uppercase tracking-widest mb-2">Alvo</p>
                  <p>O objeto da cena com o qual o jogador quer interagir (ex: <code>Porta</code>).</p>
                </div>
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-900">
                  <p className="font-bold text-zinc-500 uppercase tracking-widest mb-2">Requisito</p>
                  <p>O item que o jogador PRECISA ter no inventário (ex: <code>Chave</code>).</p>
                </div>
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-900">
                  <p className="font-bold text-zinc-500 uppercase tracking-widest mb-2">Resultado</p>
                  <p>O que acontece após o comando (ex: ir para outra cena).</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-800">
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4">Exemplo de comando do jogador:</p>
                <div className="text-lg bg-zinc-950 p-6 rounded-xl border border-zinc-900 shadow-inner italic text-white flex items-center gap-3">
                  <span className="text-zinc-600 font-mono">&gt;</span> "Destrancar porta com a chave"
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] font-bold uppercase tracking-tighter">
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col gap-1"><span className="text-zinc-600">Verbo</span><span className="text-white">Destrancar</span></div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col gap-1"><span className="text-zinc-600">Alvo</span><span className="text-white">Porta</span></div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col gap-1"><span className="text-zinc-600">Requisito</span><span className="text-white">Chave</span></div>
                </div>
                <p className="mt-6 text-xs text-zinc-500 leading-relaxed italic">
                  💡 <strong>Dica:</strong> O jogador pode digitar em <strong>qualquer ordem</strong> (ex: <em>"Usar chave na porta"</em> ou <em>"Porta abrir chave"</em>). O sistema identificará automaticamente as palavras-chave para validar a interação.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">4. Rastreadores</h3>
            <p className="text-sm">Use rastreadores para criar sistemas complexos como <strong className="text-white">Vida, Dinheiro ou Estresse</strong>.</p>
            <ul className="list-disc ml-6 mt-4 space-y-3 text-sm marker:text-purple-500">
              <li>Interações podem aumentar ou diminuir o valor de um rastreador.</li>
              <li>Quando um rastreador atinge seu <strong>valor máximo</strong>, o jogador é automaticamente transportado para uma <strong>Cena de Consequência</strong>.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">5. Finalização</h3>
            <p className="text-sm">Quando seu jogo estiver pronto:</p>
            <ol className="list-decimal ml-6 space-y-3 mt-4 text-sm marker:text-white font-medium">
              <li>Use o botão <strong className="text-white px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800">Pré-visualizar</strong> para testar toda a experiência.</li>
              <li>Clique em <strong className="text-white px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800">Exportar Jogo</strong> para baixar um arquivo <code>.zip</code>.</li>
              <li>Extraia o zip e abra o arquivo <code>index.html</code> em qualquer navegador para jogar ou compartilhar!</li>
            </ol>
          </section>

        </div>

        {/* Footer */}
        <div className="p-8 border-t border-zinc-800 bg-zinc-900/50 flex justify-center">
          <button
            onClick={onClose}
            className="px-10 py-4 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest"
          >
            Entendi, vamos criar!
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManualModal;
