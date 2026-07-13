# Módulo 04 — Interações e Parser

**Tutorial: A Chave do Farol**  
Tempo estimado: 10–15 minutos

---

## Objetivo deste módulo

Neste módulo você vai:
- Entender como as Interações funcionam no modo Parser
- Criar as interações da "Entrada do Farol":
  - Pegar a Chave Enferrujada
  - Tentar subir sem a chave (feedback negativo)
  - Subir com a chave (ir para o Corredor Escuro)
- Criar a interação do "Corredor Escuro":
  - Continuar (ir para a Sala da Lanterna, com efeito no Tracker)
- Entender Verbos Globais como fallback

---

## Como as Interações funcionam

Uma **Interação** é uma regra que diz ao jogo:

> "Se o jogador usar o verbo **[X]** no alvo **[Y]**, e tiver **[requisito Z]** no inventário, então **[faça isso]**."

Cada interação tem:
| Campo | O que define |
|-------|-------------|
| **Verbos** | Palavras que ativam a ação (ex: `pegar, tomar, coletar`) |
| **Alvo** | Objeto do ramo afetado (ex: Chave Enferrujada) |
| **Requisito** | Item que precisa estar no inventário (opcional) |
| **Resultado** | O que acontece: ir a outro ramo, mudar texto, adicionar ao inventário... |

---

## Acessando o Editor de Interações

1. Na sidebar, clique em **"Narrativa"**
2. Selecione o ramo **"Entrada do Farol"**
3. No Editor de Ramos, clique na aba **"Interações"**
4. Clique em **"Criar Interação"**

---

## Interação 1 — Pegar a Chave

**Cenário:** O jogador digita `pegar chave` → a chave vai para o inventário.

Configure assim:

| Campo | Valor |
|-------|-------|
| **Verbos** | `pegar, tomar, coletar, apanhar` |
| **Alvo** | Chave Enferrujada |
| **Requisito** | *(nenhum)* |
| **Adicionar ao Inventário** | ✅ Ativado |
| **Remover objeto do ramo** | ✅ Ativado |
| **Destino** | *(ficar no ramo)* |
| **Mensagem de sucesso** | Você pega a chave enferrujada. Ela é pesada e fria. |

> 💡 **"Remover objeto do ramo"**: depois de coletada, a chave desaparece do cenário — ela não aparece mais na lista "Coisas aqui".

---

## Interação 2 — Tentar Subir SEM a Chave

**Cenário:** O jogador digita `subir escada` sem ter a chave → recebe uma mensagem de bloqueio.

Configure assim:

| Campo | Valor |
|-------|-------|
| **Verbos** | `subir, escalar, ir para cima, usar escada` |
| **Alvo** | Escada de Ferro |
| **Requisito** | *(nenhum)* |
| **Destino** | *(ficar no ramo)* |
| **Mensagem de sucesso** | Você tenta subir, mas a porta no topo está trancada. Você precisa de algo para abri-la. |

> 💡 Esta interação não tem requisito — funciona sempre. Mas a próxima interação (com requisito) vai tomar prioridade quando o jogador tiver a chave.

---

## Interação 3 — Subir COM a Chave

**Cenário:** O jogador digita `subir escada` tendo a chave no inventário → vai para o Corredor Escuro.

Crie uma **nova interação**:

| Campo | Valor |
|-------|-------|
| **Verbos** | `subir, escalar, ir para cima, usar escada` |
| **Alvo** | Escada de Ferro |
| **Requisito** | Chave Enferrujada (no inventário) |
| **Consumir item** | ❌ Não (a chave fica no inventário) |
| **Destino** | Corredor Escuro |
| **Mensagem de sucesso** | Você usa a chave para destrancar a porta e sobe a escada rangendo. |

> 💡 O IF Builder dá prioridade à interação **com requisito** quando o jogador possui o item. A interação sem requisito é usada como fallback.

---

## Como o sistema de Parser entende os comandos

O parser do IF Builder é flexível. Ele aceita variações naturais:

| O jogador digita | O sistema entende |
|-----------------|-------------------|
| `pegar chave` | verbo: pegar · alvo: chave |
| `use key on door` | verbo: use · alvo: key (+ door) |
| `tomar a chave enferrujada` | verbo: tomar · alvo: chave |
| `chave pegar` | verbo: pegar · alvo: chave |

O sistema também reconhece cliques nas palavras destacadas (`<chave enferrujada>`) como equivalentes a digitar o nome do objeto.

---

## Criando Interações no "Corredor Escuro"

1. Selecione o ramo **"Corredor Escuro"**
2. Aba **Interações** → **Criar Interação**

### Interação — Continuar pelo corredor

| Campo | Valor |
|-------|-------|
| **Verbos** | `continuar, avançar, ir, seguir, porta` |
| **Alvo** | *(nenhum — ação de ambiente)* |
| **Requisito** | *(nenhum)* |
| **Destino** | Sala da Lanterna |
| **Efeito em Tracker** | Saúde: -1 |
| **Mensagem de sucesso** | Você avança pelo corredor. O frio penetra seus ossos. |

> ⚠️ O efeito no Tracker de Saúde será configurado no **Módulo 05** — por ora, deixe este campo em branco e retorne para preenchê-lo depois.

---

## Feedback Negativo Global

Quando o jogador digita algo que nenhuma interação reconhece, o jogo exibe uma **mensagem de erro padrão**.

Você pode personalizar essa mensagem por ramo:

No Editor de Ramos → aba Propriedades → campo **"Feedback Negativo"**:

```
Isso não parece ter efeito algum. O silêncio do farol é sua única resposta.
```

Se deixar em branco, o jogo usa a mensagem global configurada nas Configurações.

---

## Interações no Modo Escolha (IF)

Se você estiver no modo **Escolha** em vez de Parser:
- Na aba **"Escolhas"**, adicione opções clicáveis
- Cada escolha leva a um ramo destino
- Não há verbos — o jogador apenas clica nos botões

Para este tutorial, usamos o modo Parser.

---

## ✅ Checklist do Módulo 04

- [ ] Interação "Pegar Chave" criada (adiciona ao inventário, remove do ramo)
- [ ] Interação "Subir sem chave" criada (mensagem de bloqueio)
- [ ] Interação "Subir com chave" criada (requer Chave no inventário → vai para Corredor Escuro)
- [ ] Interação "Continuar" no Corredor Escuro → vai para Sala da Lanterna
- [ ] Feedback negativo personalizado no ramo "Entrada do Farol"
- [ ] Preview testado: fluxo completo funciona

---

## Próximo passo

→ [Módulo 05 — Trackers](./05-trackers.md)
