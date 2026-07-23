# IF Builder v0.8.3

🚀 Atualizações e Melhorias da Versão v0.8.3

- **Correção de Download Desktop (Erro 503)**: A rota de download `/api/download` agora realiza um redirecionamento HTTP 302 direto para a URL oficial no GitHub Releases, evitando o limite de memória serverless do Vercel.
- **Correção do Aplicativo Desktop no Linux**: Adicionadas as permissões dos plugins `updater` e `process` em `capabilities/default.json` e configurada a chave do Tauri 2, resolvendo a falha na inicialização do app no Linux.
