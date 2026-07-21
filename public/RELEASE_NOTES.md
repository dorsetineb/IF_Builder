# IF Builder v0.5.0

## Atualização Automática & Downloads Diretos da Web

Esta versão traz grandes melhorias na experiência de distribuição e atualização do IF Builder, integrando verificações automáticas no desktop, downloads diretos pela versão web e aprimoramentos visuais.

### 📌 Novidades & Recursos
- 🖥️ **Sistema de Atualização Automática (Desktop)**: Notificação automática ao iniciar o aplicativo quando uma nova versão estiver disponível no GitHub, exibindo o resumo das notas de versão e solicitando confirmação explícita do usuário para atualizar.
- 📥 **Download Direto pela Versão Web**: Modal dedicado para baixar os instaladores oficiais do Windows (.exe / .msi) e Linux (.AppImage / .deb) diretamente da página do aplicativo, sem precisar navegar pela interface do GitHub.
- 📜 **Log de Desenvolvimento Integrado**: Acesso ao log de lançamentos e notas de versão diretamente na aba "Sobre o Projeto", com carregamento dinâmico dos dados oficiais do repositório.

### 🎨 Interface & UX
- 🏷️ **Indicadores de Versão**: Exibição elegante e alinhada do número da versão (v0.5.0) na tela inicial (abaixo do logo IF) e na tela de boot do editor.
- 🌐 **Internacionalização (i18n)**: Suporte completo em Português, Inglês e Espanhol para as telas de atualização, modais de download e logs de desenvolvimento.

### ⚙️ Infraestrutura & Segurança
- 🔐 **Serverless Endpoints (Vercel)**: Rotas seguras via Vercel Serverless Functions (/api/update e /api/download) com suporte transparente a repositórios públicos e privados.
- 🔄 **Sincronização de Versões**: Scripts de release mantêm package.json, tauri.conf.json e src/version.ts perfeitamente alinhados a cada atualização.
