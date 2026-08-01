---
name: release-versioning
description: Automatiza a geração de Release Notes, tradução multilíngue do DevLog (pt/en/es), sincronização do public/releases/latest.json, atualização do modal de devlog no app e commit/tag de release via scripts npm. Use quando o usuário solicitar lançamento de nova versão ou atualização do devlog.
---

# 🚀 Release Versioning & Devlog Manager Skill

> **Objetivo:** Automatizar o processo completo de atualização de versão da aplicação (IF Builder), garantindo que as notas de versão, `public/releases/latest.json`, a constante do Devlog e as traduções i18n sejam sincronizadas **ANTES** de compilar e publicar a tag no GitHub.

---

## 📋 Fluxo Unificado de Lançamento de Versão

Sempre que o usuário solicitar o lançamento de uma nova versão (ex: *"lance a versão v0.9.1"*, *"release patch"*, *"faça o release v1.0.0"*):

### 1. 📝 Preparar as Notas de Versão (Release Notes)
1. **Analisar Alterações:** Consultar todo o histórico de alterações desde o último release usando `git log <ultima-tag>..HEAD` (ex: `git log v0.9.0..HEAD` ou `git log -n 20`) e conferir os arquivos modificados para consolidar **todas** as novidades, refatorações, melhorias visuais e correções de bugs feitas desde a versão anterior.
2. **Atualizar `public/RELEASE_NOTES.md`:** Escrever/atualizar o arquivo `public/RELEASE_NOTES.md` com as notas detalhadas e organizadas por tópicos com emojis.
3. **Atualizar Traduções i18n:** Se necessário, atualizar a chave `about.versions.devlogContent` em `src/locales/pt/translation.json`, `en/translation.json`, `es/translation.json`.

### 2. 🚀 Executar o Comando de Versionamento (NPM Release)
Executar o comando de versão correspondente:

| Tipo de Mudança | Exemplo | Comando NPM |
| :--- | :--- | :--- |
| **Patch** (correções/ajustes) | `v0.9.0` ➔ `v0.9.1` | `npm run release` |
| **Minor** (novas funcionalidades) | `v0.9.0` ➔ `v0.10.0` | `npm run release:minor` |
| **Major** (grandes mudanças) | `v0.9.0` ➔ `v1.0.0` | `npm run release:major` |
| **Versão Específica** | Ex: `v0.9.5` | `npm version 0.9.5` |

---

## ⚙️ O que Acontece Automaticamente ao Rodar `npm run release*`

Ao executar o `npm version` / `npm run release*`, o lifecycle script `"version"` do `package.json` aciona automaticamente o `node scripts/update-tauri-version.js`:

1. **`package.json`**: Atualiza a versão.
2. **`scripts/update-tauri-version.js`**:
   * Atualiza a versão em `src-tauri/tauri.conf.json`.
   * Atualiza a versão em `src/version.ts`.
   * Atualiza `public/releases/latest.json` com a nova versão, novo `releaseNotes` (lido do `RELEASE_NOTES.md`) e novos links em `downloads`.
   * Atualiza a constante `DEVLOG_RELEASE_NOTES` em `src/pages/AboutProject.tsx` com as novas notas de versão.
3. **`git add`**: Inclui **todos** os arquivos modificados (`package.json`, `tauri.conf.json`, `src/version.ts`, `latest.json`, `RELEASE_NOTES.md`, `AboutProject.tsx`, `src/locales/`) no **mesmo commit de release**.
4. **Git Commit & Tag**: Cria o commit e a tag de versão `vX.X.X`.
5. **`postversion`**: Executa `git push && git push --tags` para publicar no GitHub.
6. **GitHub Actions**: O GitHub Actions detecta a tag publicada, compila a release oficial no Windows/Linux e publica o conteúdo exato do `public/RELEASE_NOTES.md` na página de Releases do GitHub via `gh release edit --notes-file`, eliminando o texto genérico do "Full Changelog".
