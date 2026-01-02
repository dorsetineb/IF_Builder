
import React from 'react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-bg border-2 border-brand-border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl rounded-lg">
        {/* Header */}
        <div className="p-6 border-b border-brand-border flex justify-between items-center bg-brand-sidebar">
          <div>
            <h2 className="text-2xl font-bold text-brand-primary">Manual de Uso - IF Builder</h2>
            <p className="text-sm text-brand-text-dim">Aprenda a criar sua aventura interativa passo a passo.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-brand-text-dim hover:text-white text-3xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-10 text-brand-text leading-relaxed">
          
          <section>
            <p>O <strong>IF Builder</strong> permite criar jogos de ficção interativa (Interactive Fiction). O jogo é composto por <strong>Cenas</strong>, onde o jogador lê descrições, observa imagens e digita comandos (verbos) para interagir com <strong>Objetos</strong> e navegar pelo mundo.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-primary mb-3">1. Editor de Cenas</h3>
            <div className="space-y-4">
              <p>Cada cena é um local ou momento no seu jogo. Configure:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Texto Interativo:</strong> Use a sintaxe <code>&lt;palavra&gt;</code> na descrição. Isso tornará a palavra clicável no jogo, facilitando a digitação de comandos para o jogador.</li>
                <li><strong>Imagem e Música:</strong> Cada cena pode ter uma imagem de fundo única e uma trilha sonora que começa a tocar assim que o jogador entra nela.</li>
                <li><strong>Cena Inicial:</strong> Defina qual cena será o ponto de partida do seu jogo no menu lateral.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-primary mb-3">2. Biblioteca de Objetos</h3>
            <p>Os objetos são itens que podem estar em uma cena. Eles são <strong>globais</strong>: você cria um objeto uma vez (ex: "Chave de Ouro") e pode vinculá-lo a múltiplas cenas ou usá-lo em interações em qualquer lugar do jogo.</p>
            <ul className="list-disc ml-6 mt-3">
              <li><strong>Exame:</strong> Defina uma descrição detalhada que o jogador verá ao usar o comando "olhar" ou "examinar" o objeto.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-primary mb-3">3. Interações (O coração do jogo)</h3>
            <p>As interações definem o que acontece quando o jogador digita um comando.</p>
            <div className="bg-brand-surface/30 p-8 rounded border border-brand-border mt-3 space-y-6">
              <div>
                <p><strong>Verbos:</strong> Lista de palavras que ativam a ação (ex: <code>abrir, destrancar, usar</code>).</p>
              </div>
              <div>
                <p><strong>Alvo:</strong> O objeto da cena com o qual o jogador quer interagir (ex: <code>Porta</code>).</p>
              </div>
              <div>
                <p><strong>Requisito:</strong> O item que o jogador PRECISA ter no inventário para a ação funcionar (ex: <code>Chave</code>).</p>
              </div>
              <div>
                <p><strong>Resultado:</strong> O que acontece após o comando (ex: ir para outra cena ou mudar um texto).</p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-brand-border/50">
                <p className="text-xs font-bold text-brand-primary uppercase mb-3">Exemplo de comando do jogador:</p>
                <div className="text-base bg-brand-bg/50 p-4 rounded border border-brand-border/30 italic text-brand-primary">
                  "Destrancar porta com a chave"
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-brand-surface rounded"><span className="text-brand-text-dim">Verbo:</span> Destrancar</div>
                    <div className="p-2 bg-brand-surface rounded"><span className="text-brand-text-dim">Alvo:</span> Porta</div>
                    <div className="p-2 bg-brand-surface rounded"><span className="text-brand-text-dim">Requisito:</span> Chave</div>
                </div>
                <p className="mt-4 text-sm text-brand-text-dim">
                  💡 <strong>Dica:</strong> O jogador pode digitar em <strong>qualquer ordem</strong> (ex: <em>"Usar chave na porta"</em> ou <em>"Porta abrir chave"</em>). O sistema identificará automaticamente as palavras-chave para validar a interação.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-primary mb-3">4. Rastreadores de Consequência</h3>
            <p>Use rastreadores para criar sistemas complexos como <strong>Vida, Dinheiro ou Estresse</strong>.</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Interações podem aumentar ou diminuir o valor de um rastreador.</li>
              <li>Quando um rastreador atinge seu <strong>valor máximo</strong>, o jogador é automaticamente transportado para uma <strong>Cena de Consequência</strong> (ex: cena de Game Over ao zerar a vida).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-brand-primary mb-3">5. Finalização e Exportação</h3>
            <p>Quando seu jogo estiver pronto:</p>
            <ol className="list-decimal ml-6 space-y-2 mt-2">
              <li>Use o botão <strong>Pré-visualizar</strong> para testar toda a experiência.</li>
              <li>Clique em <strong>Exportar Jogo</strong> para baixar um arquivo <code>.zip</code>.</li>
              <li>Extraia o zip e abra o arquivo <code>index.html</code> em qualquer navegador para jogar ou compartilhar!</li>
            </ol>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-border bg-brand-sidebar flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-brand-primary text-brand-bg font-bold rounded-md hover:bg-brand-primary-hover transition-colors"
          >
            Entendi, vamos criar!
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManualModal;
