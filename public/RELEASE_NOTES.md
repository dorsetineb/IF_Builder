🚀 Atualizações e Melhorias da Versão v0.10.6

• Correção Multimídia e Estabilidade do AppImage no Linux:
  - Habilitação da flag nativa bundleMediaFramework no Tauri, garantindo que o plugin de áudio autoaudiosink (gst-plugins-good) e todas as dependências multimídia sejam empacotadas no .AppImage.
  - Varredura dinâmica de diretórios e scanner de plugins do GStreamer no inicializador Rust, prevenindo travamentos (SIGABRT no MediaPlayerPrivateGStreamer) ao abrir o aplicativo ou iniciar demos.
  - Atualização do CI no GitHub Actions com suporte completo a headers e plugins de áudio (incluindo pipewire e plugins-good-dev).

• Camada de Efeitos Visuais (Overlays) nos Capítulos e Abertura:
  - Reestruturação do empilhamento de camadas (z-index) para que efeitos como chuva, névoa, granulação, glitch, tv e outros ocorram estritamente sobre o painel de imagem/fundo.
  - Textos narrativos, títulos e botões de interação (incluindo o botão "COMEÇAR" da vinheta de abertura) permanecem sempre em primeiro plano, garantindo máxima legibilidade.

• Transições por Interação e Controles Visuais:
  - Suporte a transições personalizadas por interação (Fade, Slide, Zoom, etc.) com controle dedicado de tempo e velocidade.
  - Ajuste de cores e contraste nos estados inativos do tema "Menta", comunicando com clareza botões desabilitados (como o botão de Pré-visualizar sem projeto).
  - Ajustes de layout e espaçamento na barra lateral (Sidebar) para exibição sem truncamento.

• Testes e Confiabilidade:
  - Cobertura de testes unitários expandida com 100% de sucesso na suíte do Vitest (33/33 testes aprovados).
