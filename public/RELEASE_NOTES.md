🚀 Atualizações e Melhorias da Versão v0.10.10

• Correção Crítica no Playback de Áudio da Demo:
  - Resolução do atraso de início da trilha sonora ao clicar em "COMEÇAR" na vinheta de abertura da demo ("Fuja da Masmorra"), tanto na tela inicial quanto no botão do editor ("Acesse a demo").
  - Implementação de pré-carregamento inteligente de áudio em segundo plano (cache de Blob) durante a exibição da tela de vinheta, garantindo início de reprodução em menos de 20ms a partir de 0:00 absoluto.
  - Acionamento síncrono imediato de áudio diretamente no evento de clique do usuário, preservando a autorização de mídia do WebView2 / Chromium em versões instaladas.
  - Eliminação de operações repetidas de busca (seeking) desnecessárias no elemento de áudio, removendo engasgos e pausas do pipeline de decodificação.
  - Pré-carregamento antecipado de `editor_data.json` na tela de login/inicial e no editor, abrindo o modal de jogo instantaneamente sem tela de carregamento.
  - Reconstrução e sincronização total dos pacotes e arquivos `.zip` de demonstração (`fuja_da_masmorra`, `escape_the_dungeon`, `escapa_la_mazmorra`).

• Novo Logotipo ASCII na BIOS e Identidade Visual Retrô:
  - Substituição do logotipo na inicialização da BIOS por arte ASCII personalizada em estilo software de computador clássico.
  - Ajustes de velocidade de digitação do comando `A:\> RUN IF-BUILDER.EXE` e espaçamento aprimorado para uma experiência nostálgica e limpa.
  - Padronização do novo logotipo pixelado em todas as telas de introdução, cabeçalho e transição.
  - Refinamentos no alinhamento e espaçamento do número de versão na tela inicial e controle de rotação de wallpapers por sessão.

• Qualidade, Compatibilidade e Empacotamento:
  - 100% de conformidade nos testes estáticos do TypeScript (`tsc --noEmit`).
  - Totalmente testado e compatível com as versões web e desktop instaláveis (Tauri Windows e Linux).
