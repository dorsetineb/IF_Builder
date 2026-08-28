# Módulo 12 — Exportação e Publicação

**Tutorial: A Chave do Farol**  
Tempo estimado: 8–10 minutos

---

## Objetivo deste módulo

Neste módulo você vai aprender a empacotar, salvar e publicar a sua ficção para que qualquer pessoa possa jogar no computador ou celular:
- Exportar a ficção como **Jogo Web Autônomo (`.zip`)**
- Criar e restaurar cópias de segurança do projeto em **Arquivo de Projeto (`.json`)**
- Publicar seu jogo em plataformas como **itch.io**, **GitHub Pages** ou **Vercel**
- Conhecer os instaladores Desktop (**Windows .exe** e **Linux .AppImage**)

---

## Formatos de Exportação do IF Builder

O IF Builder disponibiliza dois tipos principais de saída no cabeçalho superior do editor:

```
┌─────────────────────────────────────────────────────────────┐
│ 💾 Salvar Projeto (.json)   │   📦 Exportar Jogo (.zip)     │
├─────────────────────────────┼───────────────────────────────┤
│ Backup do código-fonte para │ Jogo compilado e pronto para  │
│ reabrir e editar no editor. │ jogar no navegador / itch.io. │
└─────────────────────────────┴───────────────────────────────┘
```

---

## 1. Exportando o Jogo Web (.zip)

No cabeçalho do editor, clique em **"Exportar Jogo"** (ou ícone de caixa/zip):

1. O IF Builder compilará todos os nós narrativos, imagens, áudios, estilos visuais e lógica de parser em um único arquivo compactado: `a-chave-do-farol.zip`.
2. O arquivo `.zip` contém:
   - `index.html` — A aplicação web completa e autônoma do jogo.
   - `game.js` — Motor de jogo otimizado com toda a lógica da sua história.
   - `assets/` — Pasta com todas as imagens e áudios que você utilizou.

> 🌟 **100% Autônomo e Offline:** O jogo exportado não faz nenhuma requisição externa. Ele pode ser jogado offline com duplo clique no `index.html` em qualquer navegador moderno (Chrome, Firefox, Safari, Edge).

---

## 2. Como Publicar no itch.io

O [itch.io](https://itch.io) é a maior plataforma para jogos independentes e narrativas interativas:

1. Crie uma conta no itch.io e clique em **"Create new project"**.
2. Em **"Kind of project"**, selecione **"HTML"** (Playable in browser).
3. Na seção **"Uploads"**, faça o upload direto do arquivo `a-chave-do-farol.zip`.
4. Marque a opção: **"This file will be played in the browser"**.
5. Na seção **"Embed options"**, configure:
   - *Viewport dimensions*: `1280 × 720` (ou marque `Auto-detect size`).
   - *Mobile friendly*: Ativado.
6. Salve e publique a página. Pronto! Seu jogo agora tem um link público com suporte a tela cheia.

---

## 3. Salvando Cópias de Segurança (.json)

Para garantir que você nunca perca seu trabalho ou para trocar de computador:

- **Para Salvar**: No cabeçalho, clique em **"Salvar"** → Baixa o arquivo `projeto.json`.
- **Para Restaurar**: Clique em **"Carregar"** → Selecione seu arquivo `projeto.json`. O editor recarrega todo o projeto exatamente como estava.

---

## 4. Versão Desktop Instalável

Se você prefere criar ou jogar no desktop sem depender de navegadores:
- **Windows**: Instalador `.exe` de 64 bits.
- **Linux**: Pacote `.AppImage` portátil de 64 bits.

Disponíveis diretamente no menu **"Sobre o Projeto"** ou na página oficial do repositório.

---

## ✅ Checklist do Módulo 12

- [ ] Arquivo de backup `.json` baixado e guardado
- [ ] Jogo empacotado em `.zip` exportado com sucesso
- [ ] Arquivo `index.html` testado localmente no navegador
- [ ] Compreensão do processo de publicação no itch.io

---

## Próximo passo

Revise o projeto completo e veja o passo a passo integrado da criação de ponta a ponta:

→ [**Módulo 13 — Projeto Exemplo Completo**](./13-projeto-completo-exemplo.md)
