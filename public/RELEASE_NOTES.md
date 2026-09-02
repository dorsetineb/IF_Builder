🚀 Atualizações e Melhorias da Versão v0.10.8

• Renderização Imediata no Estilo Visual:
  - Correção na inicialização estática do DitherShader: a imagem de exemplo nos painéis de Ramificações, Capítulos e Menu Principal agora é desenhada imediatamente no término do download (img.onload), eliminando a necessidade de recolher a barra lateral para visualizá-la.

• Estabilidade e Navegação no Editor:
  - Implementação de carregamento assíncrono com Suspense para as páginas "Sobre o Projeto" (AboutProject) e "Interface" (EditorInterface) dentro do Editor, prevenindo falhas de renderização e garantindo transições suaves.

• Nova Tipografia Serifada para a Interface (Habibi):
  - Substituição da fonte EB Garamond pela fonte Habibi, oferecendo serifas elegantes, altura de linha uniforme e proporção equilibrada (alinhada à Space Grotesk) para leitura confortável sem textos desproporcionais.
  - Migração automática das configurações locais de tipografia.

• Qualidade e Testes:
  - 100% de conformidade e aprovação nos testes automatizados da suíte do Vitest (33/33 testes aprovados).
