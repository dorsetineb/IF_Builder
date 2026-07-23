---
name: release-versioning
description: Automatiza a geração de Release Notes, tradução multilíngue do DevLog (pt/en/es), sincronização do public/releases/latest.json, commit das alterações e incremento de versão via scripts npm (release, release:minor, release:major). Use quando o usuário solicitar atualização de versão ou devlog.
---

# 🚀 Release Versioning & Devlog Manager Skill

> **Objetivo:** Automatizar o processo completo de atualização de versão da aplicação (IF Builder), incluindo a geração de Release Notes traduzidas (em Português, Inglês e Espanhol), atualização do modal de DevLog da interface, atualização do arquivo `public/releases/latest.json`, criação do commit de release e execução dos scripts de versionamento (`npm run release`, `release:minor`, `release:major`).

---

## 🎯 Quando esta Skill é Ativada

Esta skill é acionada sempre que o usuário solicitar uma atualização de versão ou atualização do devlog/release notes (ex: *"atualize para a versão v0.8.1"*, *"faça a release v0.7.0"*, *"update de versão e devlog"*).

---

## 📋 Protocolo de Execução Passo a Passo

Sempre que a skill for ativada com uma versão de destino (ex: `v0.8.1`), o assistente DEVE seguir rigorosamente esta sequência de 4 etapas:

### 1. 📝 Gerar Release Notes, Traduzir i18n e Atualizar Devlog & `latest.json`

1. **Analisar Alterações:** Consultar `git log` recente (ou `git status`/`git diff`) para identificar todas as novidades, correções e melhorias introduzidas desde o último release.
2. **Formatar as Notas de Versão:** Criar uma estrutura limpa e bem organizada com emojis e tópicos claros.
3. **Atualizar `public/RELEASE_NOTES.md`:** Sobrescrever/atualizar o arquivo `public/RELEASE_NOTES.md` com as novas notas formatadas.
4. **Atualizar `DEVLOG_RELEASE_NOTES` no Modal (`src/pages/AboutProject.tsx`):** Atualizar a constante de fallback `DEVLOG_RELEASE_NOTES` no arquivo `src/pages/AboutProject.tsx`.
5. **Atualizar Traduções i18n (`src/locales/pt/translation.json`, `en/translation.json`, `es/translation.json`):** Atualizar a chave `about.versions.devlogContent` nos três arquivos de tradução (Português, Inglês e Espanhol) para garantir que ao trocar o idioma na interface o modal do Devlog seja dinamicamente traduzido.
6. **Atualizar `public/releases/latest.json`:** Atualizar o arquivo `public/releases/latest.json` com a nova versão (`version`, `releaseName`, `releaseNotes`, e caminhos dos instaladores em `downloads`).

---

### 2. 📌 Fazer Commit das Alterações do Devlog, Traduções e `latest.json`

Antes de rodar o comando de versionamento do `npm`, execute o staging e commit das alterações da documentação, devlog, i18n e `latest.json`:

```bash
git add public/RELEASE_NOTES.md src/pages/AboutProject.tsx src/locales/ public/releases/latest.json scripts/update-tauri-version.js .agent/skills/release-versioning/SKILL.md
git commit -m "chore(release): atualiza release notes, i18n, latest.json e modal de devlog para vX.X.X"
```

---

### 3. 🚀 Executar o Script de Versionamento (NPM Release)

Identificar a diferença entre a versão atual no `package.json` e a nova versão solicitada pelo usuário para selecionar o comando adequado:

| Tipo de Mudança | Exemplo de Transição | Comando NPM |
| :--- | :--- | :--- |
| **Patch** (correções/ajustes menores) | `v0.8.0` ➔ `v0.8.1` | `npm run release` |
| **Minor** (novas funcionalidades) | `v0.7.0` ➔ `v0.8.0` | `npm run release:minor` |
| **Major** (mudança estrutural/quebra) | `v0.8.0` ➔ `v1.0.0` | `npm run release:major` |
| **Versão Específica** | Ex: `v0.8.5` | `npm version 0.8.5` |

> ℹ️ **Nota:** O script `scripts/update-tauri-version.js` preserva o campo `releaseNotes` previamente preenchido no `latest.json`.
> A execução dos comandos `npm run release*` dispara automaticamente os scripts em cadeia definidos no `package.json`:
> 1. Atualização do `package.json`
> 2. `node scripts/update-tauri-version.js` (atualiza `tauri.conf.json` e `src/version.ts`)
> 3. Git add e commit automático de versão (`git push && git push --tags` se postversion for acionado)

---

### 4. ✅ Confirmação e Relatório

Apresentar ao usuário um resumo executivo claro com:
1. A nova versão configurada (`vX.X.X`).
2. O Release Note aplicado no modal, arquivos i18n (`pt/en/es`), `latest.json` e no arquivo de release.
3. O status dos commits e das tags git geradas.
