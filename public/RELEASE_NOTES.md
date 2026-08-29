🚀 Atualizações e Melhorias da Versão v0.10.5

• Compatibilidade e Estabilidade do AppImage no Linux:
  - Correção definitiva do travamento no processo WebKitWebProcess ao clicar em "Iniciar Programa" ou abrir demos no Linux.
  - Configuração nativa no backend Rust para desativar modos instáveis de composição por hardware e DMA-BUF (WEBKIT_DISABLE_DMABUF_RENDERER, WEBKIT_DISABLE_COMPOSITING_MODE e __NV_DISABLE_EXPLICIT_SYNC).
  - Atualização do workflow de publicação no GitHub Actions com inclusão de todo o ecossistema de plugins multimídia do GStreamer (base, good, bad, ugly, libav, pulseaudio, alsa, gl), tornando o AppImage 100% autossuficiente em qualquer distribuição Linux.
  - Isolamento de runtime para direcionar o GStreamer aos plugins empacotados no AppImage ($APPDIR), prevenindo incompatibilidades de ABI em distribuições rolling-release (Arch Linux, Fedora, openSUSE).
  - Tratamento defensivo na reprodução de efeitos sonoros da BIOS e trilhas sonoras contra ausência de dispositivos de áudio.

• Aprimoramento do Seletor de Destinos ("IR PARA"):
  - Criação do seletor inteligente SceneSelectOptions com agrupamento visual estruturado por categorias: Cenários (HyperCard), Ramificações, Capítulos e Abertura.
  - Rótulos com fallback automático no formato "Nome (ID)" ou "Tipo (ID)", garantindo que cenas sem título sejam sempre legíveis e conectáveis a partir de qualquer nó (inclusive no capítulo de abertura).
  - Integração padronizada em todos os editores: Editor de Cenas Narrativas, Interações, Rastreadores/Consequências e Hotspots de Cenários.
  - Suporte completo a nós de cenários no Mapa de Conexões e visualizador de ramificações (BranchingPreview).

• Internacionalização e Qualidade:
  - Novas chaves de tradução i18n para categorias de cenas em Português, Inglês e Espanhol.
  - Cobertura de testes unitários com 100% de aprovação (30/30 testes no Vitest).
