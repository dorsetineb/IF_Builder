# Módulo 07 — Exportação

**Tutorial: A Chave do Farol**  
Tempo estimado: 5 minutos

---

## Objetivo deste módulo

Neste módulo você vai:
- Fazer um **teste completo** da ficção antes de exportar
- Salvar o projeto como arquivo **`.zip`**
- Entender o que está dentro do `.zip`
- Saber como compartilhar e como retomar a edição

---

## Passo 1 — Testar o Projeto Completo

Antes de exportar, faça um teste completo do início ao fim:

1. No cabeçalho, clique em **"Preview"** (ícone de triângulo/play)
2. O jogo abrirá com a **Vinheta de Abertura**
3. Percorra todos os caminhos:
   - ✅ Caminho vitória: pegar chave → subir → corredor → lanterna → conclusão
   - ✅ Caminho derrota: atravessar o corredor 3 vezes → tracker máximo → derrota
   - ✅ Caminho bloqueado: tentar subir sem a chave → mensagem de erro

> 💡 Você pode testar ramos individuais clicando em **"Testar Ramo"** dentro de cada Editor de Ramos — útil para testar partes isoladas.

---

## Passo 2 — Salvar o Projeto (.zip)

Quando estiver satisfeito com o teste:

1. No cabeçalho, clique no botão **"Salvar"** (ícone de disquete 💾)
2. Uma caixa de diálogo pedirá o nome do arquivo
3. Digite: `a-chave-do-farol`
4. Clique em **"Salvar"**

O navegador fará o download de um arquivo **`a-chave-do-farol.zip`**.

> ⚠️ **Importante:** O editor **não salva automaticamente**. Se você fechar a aba sem salvar, **perderá todo o progresso**. Salve com frequência!

---

## O que está dentro do .zip?

```
a-chave-do-farol.zip
├── index.html        ← O jogo completo (abre direto no navegador)
├── game.json         ← Todos os dados do projeto (para reimportar no editor)
├── assets/
│   ├── imagem-farol.jpg
│   ├── trilha-abertura.mp3
│   └── chave.png
└── engine/
    └── game-engine.js
```

| Arquivo | Uso |
|---------|-----|
| `index.html` | Abra para **jogar** offline |
| `game.json` | Importe no editor para **retomar a edição** |
| `assets/` | Imagens e sons do projeto |
| `engine/` | Motor do jogo (não edite manualmente) |

---

## Passo 3 — Jogar Offline

1. Extraia o conteúdo do `.zip` em qualquer pasta
2. Abra o arquivo `index.html` em qualquer navegador
3. O jogo funciona **sem internet** e **sem o editor**

> 💡 Você pode enviar o `.zip` para qualquer pessoa — ela extrai e abre o `index.html`. Simples assim.

---

## Passo 4 — Retomar a Edição

Se quiser continuar editando o projeto depois:

1. Abra o IF Builder em [ifbuildr.com](http://www.ifbuildr.com)
2. No cabeçalho, clique em **"Carregar"** (ícone de pasta/upload)
3. Selecione o arquivo `.zip` que você salvou
4. O editor restaura **todo o projeto** — ramos, objetos, interações, tudo

> 💡 Você também pode compartilhar o `.zip` com outra pessoa que use o IF Builder — ela pode importar, ver como você criou a ficção, e até remixar!

---

## Backup JSON (Opcional)

Para um backup mais leve (sem imagens e áudios embutidos):

- Vá em **Configurações** na sidebar
- Seção **"Gerenciamento de Dados"**
- Clique em **"Exportar Backup"** — gera um arquivo `.json`

Este arquivo pode ser restaurado em Configurações → **"Restaurar de Backup"**.

> ⚠️ O backup `.json` não inclui imagens e áudios — use o `.zip` para preservar tudo.

---

## ✅ Checklist do Módulo 07

- [ ] Preview completo testado (todos os caminhos)
- [ ] Projeto salvo como `a-chave-do-farol.zip`
- [ ] `.zip` extraído e `index.html` aberto offline com sucesso
- [ ] Jogo reimportado no editor a partir do `.zip` (teste de round-trip)

---

## Próximo passo

→ [Módulo 08 — Projeto Completo: Visão Geral](./08-projeto-completo-exemplo.md)
