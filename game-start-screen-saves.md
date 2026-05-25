# Plano de Tarefas: Tela Inicial & Gestão de Saves (IF Builder)

Este plano descreve as tarefas de implementação ordenada para adicionar a Tela Inicial e controle de saves ao IF Builder.

---

## 📅 Lista de Tarefas

### [ ] Fase 1: Atualização dos Modelos de Dados e Definições Padrão
- `[ ]` Adicionar `enableSystemMenu` e `startScreenBgImage` na interface `GameData` de `src/types.ts`.
- `[ ]` Adicionar valores padrão equivalentes em `initialGameData` em `src/lib/gameDefaults.ts`.
- `[ ]` Adicionar suporte no `NewProjectModal.tsx` para inicializar novos projetos com `enableSystemMenu: false`.

### [ ] Fase 2: Reordenação de Abas e Ajustes no Editor de UI
- `[ ]` Alterar a ordem das abas na barra de navegação de `src/components/UIEditor.tsx` (Mecânicas em 1º, Estilo em 2º, Tela de opções em 3º).
- `[ ]` Adicionar o controle de toggle para "Sistema" na aba `SystemsTab.tsx` associado a `localEnableSystemMenu`.
- `[ ]` Criar o componente `StartScreenTab.tsx` para gerenciar a customização de imagem de fundo da tela inicial.
- `[ ]` Integrar a aba `StartScreenTab.tsx` em `UIEditor.tsx` na aba `tela_opcoes`.

### [ ] Fase 3: Layout e Folhas de Estilo (HTML/CSS)
- `[ ]` Adicionar a estrutura `#start-screen` na variável `gameHTML` em `src/lib/gameDefaults.ts`.
- `[ ]` Adicionar o botão do topo direito `#gear-system-button` na variável `gameHTML`.
- `[ ]` Implementar o CSS para `#start-screen` e `#gear-system-button` na variável `gameCSS` em `src/lib/gameDefaults.ts`.

### [ ] Fase 4: Integração da Engine de Jogo (game-engine.ts)
- `[ ]` Configurar a inicialização do jogo para carregar a Tela Inicial se `enableSystemMenu` for verdadeiro (bypassando em `isSceneTest`).
- `[ ]` Adicionar listener de teclado para a tecla `ESC` para abrir o menu do sistema.
- `[ ]` Ajustar o menu de slots para dividir a visualização em 1 Autosave e 2 Slots Manuais, com suporte à exclusão dos slots manuais.

### [ ] Fase 5: Compilador e Exportação de Recursos
- `[ ]` Atualizar `useExportImport.ts` para processar a imagem `startScreenBgImage` nas exportações de ZIP e Single HTML.

### [ ] Fase 6: Verificação de Qualidade e Compilação
- `[ ]` Executar type-checking (`npx tsc --noEmit`).
- `[ ]` Executar build de produção (`npm run build`).

---

## 🏁 Critérios de Sucesso
- A aba de Mecânicas é a primeira disponível.
- A aba "Tela de opções" permite customizar a imagem de fundo do menu inicial.
- Se o recurso "Sistema" for ativado, o jogo compilado exibe o botão engrenagem no topo direito, responde ao `ESC` e exibe o menu inicial ao carregar.
- A tela de gerenciamento exibe 1 autosave fixo e 2 slots de salvamento manuais deletáveis.
- Se desativado, o jogo é gerado sem alterações em relação ao comportamento padrão original.
