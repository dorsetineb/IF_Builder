---
name: release-versioning
description: Automatiza a geração de Release Notes, atualização do modal de DevLog no aplicativo/site, commit das alterações e incremento de versão via scripts npm (release, release:minor, release:major). Use quando o usuário solicitar atualização de versão ou devlog.
---

# 🚀 Release Versioning & Devlog Manager Skill

> **Objetivo:** Automatizar o processo completo de atualização de versão da aplicação (IF Builder), incluindo a geração de Release Notes, atualização do modal de DevLog da interface, criação do commit de release e execução dos scripts de versionamento (`npm run release`, `release:minor`, `release:major`).

---

## 🎯 Quando esta Skill é Ativada

Esta skill é acionada sempre que o usuário solicitar uma atualização de versão ou atualização do devlog/release notes (ex: *"atualize para a versão v0.7.0"*, *"faça a release v0.6.3"*, *"update de versão e devlog"*).

---

## 📋 Protocolo de Execução Passo a Passo

Sempre que a skill for ativada com uma versão de destino (ex: `v0.7.0`), o assistente DEVE seguir rigorosamente esta sequência de 4 etapas:

### 1. 📝 Gerar Release Notes e Atualizar o Devlog Modal

1. **Analisar Alterações:** Consultar `git log` recente (ou `git status`/`git diff`) para identificar todas as novidades, correções e melhorias introduzidas desde o último release.
2. **Formatar as Notas de Versão:** Criar uma estrutura limpa e bem organizada com emojis e tópicos claros.
3. **Atualizar `public/RELEASE_NOTES.md`:** Sobrescrever/atualizar o arquivo `public/RELEASE_NOTES.md` com as novas notas formatadas.
4. **Atualizar a constante no Modal (`src/pages/AboutProject.tsx`):** Atualizar a constante `DEVLOG_RELEASE_NOTES` no arquivo `src/pages/AboutProject.tsx` com o texto das novas notas, garantindo que o modal de DevLog da interface exiba o conteúdo atualizado.

---

### 2. 📌 Fazer Commit das Alterações do Devlog

Antes de rodar o comando de versionamento do `npm`, execute o staging e commit das alterações da documentação e devlog:

```bash
git add public/RELEASE_NOTES.md src/pages/AboutProject.tsx
git commit -m "chore(release): atualiza release notes e modal de devlog para vX.X.X"
```

---

### 3. 🚀 Executar o Script de Versionamento (NPM Release)

Identificar a diferença entre a versão atual no `package.json` e a nova versão solicitada pelo usuário para selecionar o comando adequado:

| Tipo de Mudança | Exemplo de Transição | Comando NPM |
| :--- | :--- | :--- |
| **Patch** (correções/ajustes menores) | `v0.6.1` ➔ `v0.6.2` | `npm run release` |
| **Minor** (novas funcionalidades) | `v0.6.1` ➔ `v0.7.0` | `npm run release:minor` |
| **Major** (mudança estrutural/quebra) | `v0.6.1` ➔ `v1.0.0` | `npm run release:major` |
| **Versão Específica** | Ex: `v0.7.5` | `npm version 0.7.5` |

> ℹ️ **Nota:** A execução dos comandos `npm run release*` dispara automaticamente os scripts em cadeia definidos no `package.json`:
> 1. Atualização do `package.json`
> 2. `node scripts/update-tauri-version.js` (atualiza `tauri.conf.json`, `src/version.ts` e `public/releases/latest.json`)
> 3. Git add e commit automático de versão (`git push && git push --tags` se postversion for acionado)

---

### 4. ✅ Confirmação e Relatório

Apresentar ao usuário um resumo executivo claro com:
1. A nova versão configurada (`vX.X.X`).
2. O Release Note aplicado no modal e no arquivo de release.
3. O status dos commits e das tags git geradas.
