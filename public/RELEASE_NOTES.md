🚀 Atualizações e Melhorias da Versão v0.10.11

• Correção Definitiva no Áudio das Demonstrações e Pacotes Instaláveis (.AppImage / Linux / Tauri):
  - Remuxing para MP3 Puro (MPEG ADTS Layer III): Limpeza e remuxing de todos os arquivos de trilha sonora das demos (`scene_bgm_scn_bh0.mpeg` e `positive_ending_bgm.mpeg` em PT, EN e ES) via FFmpeg, removendo contêineres de sistema MPEG-1 multiplexados e capas MJPEG residuais, garantindo início estrito a partir de 0:00 sem atrasos ou saltos na reprodução.
  - Preservação do Sink de Som do Sistema: Remoção de chamadas destrutivas a `AudioContext.close()` na tela inicial (`Auth.tsx`) e na finalização da BIOS (`Editor.tsx`), impedindo o encerramento involuntário do sink de áudio do PulseAudio/PipeWire no WebKitGTK do Linux.
  - Estabilidade do Pipeline do Player (`gameJS.ts`): Eliminação de operações concorrentes de busca forçada (`currentTime = 0`) durante o carregamento de mídia e remoção do acionamento duplo de `playBgm` na transição da vinheta de abertura para a cena narrativa.
  - MIME Type e Permissões de Autoplay: Criação de Blob explicitamente tipado como `audio/mpeg` no runtime e adição de `allow="autoplay"` no iframe de visualização.
  - Reconstrução e Sincronização das Demos: Atualização do runtime e regeração completa de todos os pacotes `.zip` de demonstração (`fuja_da_masmorra`, `escape_the_dungeon` e `escapa_la_mazmorra`).

• Responsividade e Dimensionamento da Arte ASCII na BIOS:
  - Ajuste dinâmico de escala vetorial baseado em ResizeObserver no componente `IFBuilderBiosAscii`, adaptando perfeitamente a arte ASCII à largura da janela sem cortes e eliminando barras de rolagem horizontais em qualquer resolução de tela.

• Qualidade, Compatibilidade e Empacotamento:
  - 100% de conformidade nos testes estáticos do TypeScript (`tsc --noEmit`).
  - 100% de aprovação na suíte automatizada do Vitest (33/33 testes).
  - Totalmente testado e compatível com as versões web e desktop instaláveis (Tauri Windows e Linux).
