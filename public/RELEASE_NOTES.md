🚀 Atualizações e Melhorias da Versão v0.10.7

• Otimizações Profundas de Performance e Carregamento:
  - Redução de ~77% no bundle JavaScript inicial de carregamento (de 917 kB para 213 kB), acelerando drasticamente o início da aplicação.
  - Implementação de Code-Splitting e carregamento sob demanda (lazy loading) para o motor de jogos, pré-visualizador e modais pesados (Novo Projeto, Manual do Usuário e Tipos de Nós).
  - Eliminação de 16 fontes bloqueantes redundantes na inicialização do HTML, mantendo apenas as fontes da interface com carregamento swap não bloqueante.
  - Desinstalação de 10 bibliotecas não utilizadas (Three.js, XYFlow, Quill, Express, GSAP), removendo 82 pacotes do repositório.

• Eficiência de CPU e Memória no Efeito Dither:
  - Reutilização persistente de buffers de imagem em memória, eliminando por completo os picos de descarte no Garbage Collector (zero GC churn).
  - Processamento e escrita direta de pixels em 32-bit (Uint32Array), acelerando os cálculos do canvas em até 4x.
  - Resolução nativa 1:1 calibrada com o cursor, garantindo alinhamento pixel-perfect da lanterna com o mouse.
  - Pausa automática do ciclo de renderização quando a aba ou janela estiver em segundo plano (document.hidden), economizando bateria e ciclos de processamento.

• Fluidez de Edição e Memoização de Grafos:
  - Memoização do mapa de cenas (SceneMap) com comparador de topologia: a redação de textos, diálogos ou descrições no editor não recalcula mais os nós SVG nem a estrutura do grafo.

• Correções e Estabilidade do Editor:
  - Correção da tela de boot e transição do Editor, garantindo inicialização imediata e suave.
  - Correção do acionamento do modo Pré-visualizar (Preview) no cabeçalho do Editor com carregamento assíncrono resiliente.
  - 100% de conformidade e aprovação nos testes automatizados do Vitest (33/33 testes aprovados).
