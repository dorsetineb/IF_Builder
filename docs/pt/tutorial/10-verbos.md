# Módulo 10 — Verbos Globais

**Tutorial: A Chave do Farol**  
Tempo estimado: 6–8 minutos

---

## Objetivo deste módulo

Neste módulo você vai aprender a cadastrar comandos universais através da página **"Verbos"** no menu lateral esquerdo:
- Compreender o que são **Verbos Globais** e como eles auxiliam o jogador
- Cadastrar o comando universal de **Ajuda / Tutorial**
- Cadastrar o comando de **Olhar / Descrição Geral**
- Definir sinônimos, ícones e respostas informativas

---

## O que são Verbos Globais?

Enquanto as *Interações* funcionam apenas dentro de uma cena específica (ex: `abrir porta` no corredor), os **Verbos Globais** funcionam em **qualquer momento da aventura**, independente de onde o jogador estiver.

Eles são usados para utilidades, tutoriais de ajuda, lore do universo ou comandos de inspeção geral:

| Comando | Sinônimos Aceitos | Resposta Exibida |
|---------|-------------------|------------------|
| **Ajuda** | `ajuda`, `help`, `socorro`, `?`, `comandos` | Lista de dicas de como jogar e interagir com o mundo. |
| **Sobre** | `sobre`, `creditos`, `autor`, `info` | Informações sobre a autoria da história e versão. |
| **Olhar** | `olhar`, `ver`, `l`, `observar` | Redescreve o ambiente atual e lista os objetos visíveis. |

---

## Passo 1 — Acessar a Página de Verbos

No menu lateral esquerdo, clique no sétimo item: 💬 **Verbos**.

A tela exibe:
- **Coluna da Esquerda**: Lista de verbos globais e botão de criação (`+ Novo Verbo`).
- **Painel da Direita**: Editor de sinônimos, ícone e texto de resposta.

---

## Passo 2 — Criar o Comando de Ajuda

Clique em **"Criar Verbo"** e configure:

| Campo | Valor |
|-------|-------|
| **Verbos (Sinônimos)** | `ajuda, help, ?, tutorial, instrucoes` |
| **Ícone** | 💡 (Lâmpada / Help Circle) |
| **Descrição / Resposta do Verbo** | *Veja o texto abaixo* |

**Texto de Resposta:**
```
DICAS DE COMANDOS:
• Digite o que deseja fazer: "olhar", "pegar chave", "subir escada", "abrir porta".
• Clique nas palavras destacadas em <verde> para interagir rapidamente.
• Abra sua mochila digitando "inventario" para checar seus itens.
• Mantenha os olhos abertos: pistas sutis revelam caminhos ocultos!
```

---

## Passo 3 — Criar o Comando de Créditos

Clique em **"Criar Verbo"**:

| Campo | Valor |
|-------|-------|
| **Verbos (Sinônimos)** | `sobre, creditos, autor, versao` |
| **Ícone** | ℹ️ (Info) |
| **Descrição / Resposta** | `A Chave do Farol — Uma narrativa interativa de mistério criada com o IF Builder.` |

---

## Passo 4 — Testar no Jogo

1. Abra qualquer ramo narrativo no modo de teste.
2. Digite `?` ou `ajuda`.
3. Veja o painel de ajuda se abrir com a formatação e dicas cadastradas!

---

## ✅ Checklist do Módulo 10

- [ ] Verbo global "Ajuda" cadastrado com sinônimos e dicas
- [ ] Verbo "Sobre" configurado
- [ ] Teste de digitação em cena validado com sucesso

---

## Próximo passo

Visualize a arquitetura e o fluxo de toda a sua história em um grafo interativo:

→ [**Módulo 11 — Mapa de Ramificações**](./11-mapa-de-ramificacoes.md)
