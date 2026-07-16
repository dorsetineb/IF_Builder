# 🚀 Guia de Automação de Releases do IF Builder

Este documento descreve como o sistema de atualização e lançamento de versões (releases) funciona no projeto. Toda a compilação e publicação de executáveis (Windows/Linux) foi automatizada via GitHub Actions.

## Como lançar uma nova versão?

Sempre que você quiser compilar novos executáveis e publicá-los no GitHub, você só precisa rodar **UM comando** no seu terminal (na branch `main`). Escolha o comando baseado no tamanho da sua atualização:

### 1. Pequena Correção (Patch)
Geralmente usado para corrigir bugs pequenos.
*Exemplo: de `v0.1.0` para `v0.1.1`*
```bash
npm run release
```

### 2. Novos Recursos (Minor)
Usado quando você adiciona funcionalidades novas, mas não quebra o que já existia.
*Exemplo: de `v0.1.0` para `v0.2.0`*
```bash
npm run release:minor
```

### 3. Grande Atualização (Major)
Usado para reformulações completas ou mudanças estruturais que mudam a base do app.
*Exemplo: de `v0.1.0` para `v1.0.0`*
```bash
npm run release:major
```

## O que acontece por baixo dos panos?

Ao rodar um dos comandos acima, o seguinte fluxo automático ocorre em questão de segundos na sua máquina:
1. O NPM atualiza a versão no arquivo `package.json`.
2. Um script (`scripts/update-tauri-version.js`) atualiza a versão do Tauri no arquivo `src-tauri/tauri.conf.json`.
3. O Git faz um `commit` automático das modificações.
4. O Git cria uma `Tag` automática com o nome da versão (ex: `v0.2.0`).
5. O script faz o envio (`git push`) do código e da Tag para o repositório no GitHub.

Quando a Tag chega no GitHub:
1. O GitHub Actions (`publish.yml`) detecta a tag.
2. Inicia os servidores (Windows e Linux) e baixa as dependências.
3. Compila os instaladores `.exe` e `.msi` (processo que leva cerca de 10-15 minutos).
4. Cria uma Release oficial na página do GitHub.
5. **Gera os Release Notes automaticamente** (lendo todos os commits desde a última versão).
6. Publica a versão para que os usuários possam baixar.

## Onde encontrar os arquivos gerados?
Você e os usuários podem encontrar os executáveis acessando a seção **Releases** na barra lateral direita do seu repositório no GitHub, ou através da URL: `https://github.com/SEU_USUARIO/SEU_REPOSITORIO/releases`
