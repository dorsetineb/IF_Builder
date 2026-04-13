# 🧠 PROJECT MEMORY - IF Builder

Este arquivo serve como um log persistente de implementações, decisões de arquitetura e estado atual do desenvolvimento. Ele deve ser atualizado ao final de cada tarefa significativa para garantir a continuidade entre sessões.

---

## 🚩 Status Atual
- **Última Atualização**: 2026-04-13
- **Foco Atual**: Manutenção de bugs críticos e acessibilidade.
- **Tarefa Pendente**: (Nenhuma no momento após a correção do engine).

---

## 📝 Log de Implementações

### [2026-04-13] Correção do Input de Palavras Destacadas
- **Problema**: O clique em palavras destacadas na descrição da cena não inseria o texto no campo de comando.
- **Causa**: O `verb-input` foi migrado para um `div contenteditable`, mas o código ainda usava `.value`.
- **Solução**: Atualizada a função `setupHighlights` no `game-engine.ts` para usar `.textContent` e adicionada lógica de reposicionamento de cursor no final do texto.
- **Impacto**: Correção aplicada tanto no preview interno quanto nos arquivos exportados (.zip e .html).

---

## 🏛️ Decisões de Arquitetura (ADR)

### [ADR-001] Migração do Verb Input para Contenteditable
- **Contexto**: O uso de `<input type="text">` causava problemas de visualização (clipping) com fontes personalizadas como 'Silkscreen'.
- **Decisão**: Alterar o input para um `div` com `contenteditable="true"`.
- **Consequência**: Requer tratamento especial para leitura de texto (`textContent`) e gerenciamento manual de foco/cursor (`Range`/`Selection`).

---

## 🛠️ Pendências e Dívida Técnica
- [ ] Revisar se outros elementos de UI baseados em input precisam de migração semelhante por conta das fontes.
- [ ] Validar a experiência de digitação em dispositivos móveis no modo imersivo com o novo `contenteditable`.

---

## 📊 Estatísticas Rápidas
- **Estado do Engine**: Estável (v1.0-fix)
- **i18n**: Implementado em Português e Inglês.
