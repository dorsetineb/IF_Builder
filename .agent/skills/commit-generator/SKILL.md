---
name: commit-generator
description: Gera e formata mensagens de commit padronizadas baseadas nas últimas alterações (git diff).
---

# 📝 Commit Generator Skill

> **Objetivo:** Esta skill é acionada para analisar as mudanças recentes no código e formatar uma mensagem de commit clara, concisa e aderente às boas práticas (Conventional Commits), pronta para ser utilizada pelo usuário.

## 🚀 Como Funciona

Sempre que o usuário solicitar um commit (ex: _"Gere a mensagem de commit"_ ou acionando a skill diretamente), o assistente deve:

### 1. Analisar as Mudanças (Git Diff)
O assistente deve utilizar comandos de terminal como `git status` e `git diff --cached` (ou `git diff` caso não haja nada no stage ainda) para compreender exatamente quais arquivos foram modificados e que tipo de alteração ocorreu.

### 2. Formatar a Mensagem (Conventional Commits)
A mensagem deve obrigatoriamente seguir o padrão **Conventional Commits**:

`<tipo>[escopo opcional]: <descrição concisa no imperativo>`

**Tipos permitidos:**
- `feat`: Uma nova funcionalidade
- `fix`: Correção de um bug
- `docs`: Alterações apenas na documentação
- `style`: Alterações de formatação (espaçamento, vírgulas, etc) que não afetam o código
- `refactor`: Refatoração de código (não adiciona feature nem corrige bug)
- `perf`: Mudança focada em melhorar a performance
- `test`: Adição ou correção de testes
- `chore`: Atualizações de tarefas de build, pacotes, etc.

*Exemplo:* `feat(ui): adiciona lazy loading na tela inicial para otimizar carregamento`

### 3. Exibir o Resumo ao Usuário
A resposta deve ser direta. Apresente **Apenas a frase resumida** ou uma lista com as alterações mais impactantes caso o commit envolva muitas coisas.

**Estrutura de Resposta Esperada:**
```markdown
Aqui está a sugestão para o seu commit:

\`\`\`bash
git commit -m "tipo(escopo): descrição resumida e clara"
\`\`\`

**Resumo das alterações:**
- Alteração 1 (ex: Adicionou lazy loading no App.tsx)
- Alteração 2 (ex: Ajuste no timer da BIOS)
```

## ⚠️ Regras Essenciais
- **Seja Conciso:** A primeira linha do commit não deve passar de 72 caracteres.
- **Idioma:** A mensagem de commit deve ser gerada preferencialmente em **Português** (ou seguir o padrão de histórico do repositório, caso todos os commits anteriores sejam em Inglês).
- **Sem suposições:** Baseie-se apenas nas verificações do `git diff`. Se não conseguir executar o diff, peça ao usuário para colar o diff no chat.
