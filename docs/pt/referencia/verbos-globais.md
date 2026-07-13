# Referência — Verbos Globais

**Verbos Globais** são comandos que funcionam em **qualquer ramo** da ficção, independente do contexto. Use-os para criar comandos sempre disponíveis como `ajuda`, `inventário` ou `status`.

---

## Acesso

Sidebar → **Verbos Globais**

---

## Diferença: Verbos Globais vs. Interações

| | Verbos Globais | Interações |
|-|---------------|-----------|
| **Escopo** | Qualquer ramo | Apenas o ramo configurado |
| **Alvo** | Nenhum | Objeto do ramo |
| **Requisito** | Não suporta | Suporta |
| **Destino** | Não navega | Pode navegar |
| **Uso típico** | Comandos de sistema | Ações narrativas |

---

## Verbos Reservados do Sistema

Os seguintes verbos já estão ativos por padrão e **não precisam ser configurados**:

| Verbo(s) | Comportamento |
|----------|--------------|
| `examinar`, `olhar`, `ver`, `ler` | Exibe a descrição do objeto mencionado |
| `inventário`, `bolso`, `bag` | Abre o painel de inventário |
| `ajuda`, `help`, `?` | Exibe a mensagem de ajuda padrão |

---

## Criando um Verbo Global

1. Acesse o módulo **Verbos Globais**
2. Clique em **"Criar Verbo"**
3. Preencha os campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Verbos** | Lista (vírgula) | Palavras que ativam o comando |
| **Ícone** | Seletor Lucide | Ícone exibido (modo Escolha) |
| **Descrição / Resposta** | Textarea | Texto exibido ao jogador |

### Exemplo: Verbo de Status

```
Verbos: status, stats, sobre
Resposta: Você é um explorador solitário. Seu objetivo: chegar ao topo do farol.
```

### Exemplo: Verbo de Ajuda Personalizado

```
Verbos: ajuda, help, ?
Resposta: Use verbos como EXAMINAR, PEGAR, ABRIR, USAR, NORTE, SUL...
```

---

## Boas Práticas

- **Crie um verbo `ajuda`** com instruções de como jogar — especialmente em modo Parser, onde o jogador pode se perder
- **Seja conciso** nas respostas — o jogador consulta verbos globais rapidamente
- **Inclua variações:** `norte, n, ir para o norte` cobrem mais formas de digitar
- **Não abuse:** Verbos globais não carregam contexto de ramo — use para comandos de sistema, não narrativa

---

## Integração com o Modo Escolha

No modo **IF (Escolha)**, verbos globais aparecem como **botões de ação fixos** na interface do jogo (se o sistema de verbos fixos estiver habilitado nas configurações).

Configure em: Configurações do Jogo → Sistemas → **"Verbos Fixos"**
