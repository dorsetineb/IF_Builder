🚀 Atualizações e Melhorias da Versão v0.10.9

• Padronização Visual e Reposicionamento de Ações:
  - Reposicionamento dos botões "Desfazer" e "Salvar Alterações" nas páginas Mecânicas, Estilo Visual, Rótulos, Objetos, Rastreadores e Verbos para o canto inferior direito com rodapé fixo (sticky footer), unificando o padrão visual de todo o editor.
  - Transferência das descrições das páginas para a barra superior (Header) ao lado do botão de recolher a barra lateral, com remoção das caixas de destaque superiores para maximizar a área útil de trabalho.
  - Remoção do degradê inferior sobre a base da coluna de parâmetros em Mecânicas, Estilo Visual e Rótulos.

• Otimizações na Página de Narrativa e Mapa de Nós:
  - Adicionados título e descrição contextual de Narrativa na barra superior.
  - Remoção completa do painel estático de "Lista de Narrativas" da coluna direita e da faixa superior vazia, liberando 100% da visualização do mapa interativo quando nenhum nó estiver selecionado.
  - A coluna de edição abre diretamente com o editor contextual do nó selecionado, perfeitamente nivelado ao topo.

• Gestão de Objetos ("Ativos" e "Estoque"):
  - Na aba Objetos (tanto em Ramificações quanto em Cenários), os botões de alternância foram renomeados de "Nesta Ramificação" e "Vincular" para "Ativos" e "Estoque".
  - A quantidade de itens agora é posicionada em uma linha dedicada abaixo do rótulo do botão, garantindo clareza e legibilidade mesmo em telas compactas.

• Correções para Executáveis Instaláveis (.exe e .AppImage):
  - Inclusão local da fonte Silkscreen (WOFF2) e correção no carregamento offline, impedindo a substituição por fontes genéricas na inicialização de BIOS.
  - Geração sintética do bipe de inicialização da BIOS com Web Audio API, evitando bloqueios de áudio local em pacotes desktop.
  - Correção na inicialização da trilha sonora da demo para reiniciar do início (tempo zero).

• Ajustes Visuais no Dither Shader:
  - Expansão da área diagonal de revelação (scanThickness de 0.65 para 0.85) na tela de entrada e no editor, preservando o efeito interativo de lanterna com o mouse.
  - Refinamentos tipográficos na página de abertura.

• Qualidade e Testes:
  - 100% de conformidade e aprovação nos testes automatizados da suíte do Vitest (33/33 testes aprovados).
  - Build de produção validado e compatível com empacotamento web e Tauri desktop.
