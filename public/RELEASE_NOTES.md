# IF Builder v0.8.4

🚀 Atualizações e Melhorias da Versão v0.8.4

- **Download Desktop via Streaming Direto**: A API `/api/download` agora realiza streaming direto do instalador binário sem carregar todo o arquivo em memória, eliminando definitivamente o erro 503 no Vercel.
- **Seleção Estrita de Formato**: Windows baixa exclusivamente `.exe` e Linux baixa exclusivamente `.deb`, sem fallbacks para formatos indesejados (.msi, .AppImage).
- **Compatibilidade com ifbuildr.com**: O link de download agora aponta diretamente para o endpoint do Vercel (`if-builder.vercel.app`), garantindo que o download funcione tanto no domínio principal quanto no deployment do Vercel.
- **Melhoria de Layout (Desktop)**: O link "ver log de desenvolvimento" foi movido para baixo do texto da versão instalada, melhorando a organização visual da página Sobre o Projeto.
