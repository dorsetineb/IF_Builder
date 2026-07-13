# IF Builder — Introdução

Bem-vindo ao **IF Builder**, um editor visual para criar **ficções interativas** — narrativas textuais onde o leitor decide o que acontece em seguida.

---

## O que é uma Ficção Interativa?

Uma ficção interativa (IF) é uma história onde o jogador participa ativamente. Em vez de ler passivamente, ele toma decisões, explora ambientes, coleta objetos e interage com o mundo criado pelo autor.

Existem dois estilos clássicos de IF:

| Estilo | Como funciona |
|--------|---------------|
| **Parser** | O jogador digita verbos como `pegar chave`, `abrir porta`, `examinar mesa` |
| **Escolha (IF)** | O jogador clica em opções pré-definidas para avançar |

O IF Builder suporta **ambos os estilos**, e você pode misturá-los no mesmo projeto.

---

## O que você pode criar com o IF Builder

- Histórias ramificadas com múltiplos finais
- Aventuras de texto com inventário e objetos coletáveis
- Narrativas com sistemas de consequência (saúde, dinheiro, sanidade...)
- Experiências visuais com imagens, música e efeitos de tela
- Jogos completos exportáveis que rodam em qualquer navegador

---

## Como o editor está organizado

O IF Builder é dividido em **painéis e abas**:

```
┌──────────────────────────────────────────────────┐
│  Cabeçalho (Salvar / Carregar / Preview)         │
├──────────┬───────────────────────────────────────┤
│ Sidebar  │  Área principal de edição             │
│          │                                       │
│ • Narrat.│  (Editor de Ramos / Objetos /         │
│ • Mapa   │   Interações / Configurações...)      │
│ • Objetos│                                       │
│ • ...    │                                       │
└──────────┴───────────────────────────────────────┘
```

| Elemento | Função |
|----------|--------|
| **Sidebar** | Navegação entre módulos do editor |
| **Lista de Narrativa** | Todos os ramos e capítulos da sua ficção |
| **Editor de Ramos** | Onde você escreve e configura cada cena |
| **Cabeçalho** | Ações globais: salvar, carregar, preview |

---

## Conceitos fundamentais

Antes de começar, familiarize-se com estes termos que aparecem em todo o editor:

| Termo | Descrição |
|-------|-----------|
| **Ramo** (Branch) | Uma cena ou localização da sua história |
| **Capítulo** (Vinheta) | Tela cinematográfica (abertura, transição, conclusão) |
| **Objeto** | Item do cenário com o qual o jogador pode interagir |
| **Interação** | Regra que define o que acontece quando um verbo é usado |
| **Tracker** | Variável numérica (Saúde, Dinheiro, Sanidade...) |
| **Verbo Global** | Comando que funciona em qualquer ramo |

---

## O que vamos construir neste tutorial

Ao longo deste tutorial, você vai criar **"A Chave do Farol"** — uma ficção interativa completa com:

- ✅ Modo Parser (verbos digitados)
- ✅ 5 ramos navegáveis
- ✅ 1 objeto coletável (Chave Enferrujada)
- ✅ 1 Tracker de Saúde
- ✅ Vinheta de abertura e de conclusão
- ✅ Exportação em `.zip` pronta para compartilhar

**Duração estimada**: 30–45 minutos para completar todos os módulos.

---

## Próximo passo

→ [Módulo 01 — Criando seu Projeto](./01-criando-projeto.md)
