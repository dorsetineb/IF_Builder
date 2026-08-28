# Módulo 08 — Interações e Lógica do Parser

**Tutorial: A Chave do Farol**  
Tempo estimado: 10–14 minutos

---

## Objetivo deste módulo

Neste módulo você vai aprender a criar as regras e respostas que dão vida à narrativa interativa:
- Entender a anatomia de uma **Interação** (Verbos, Alvo, Requisitos, Efeitos)
- Criar a mecânica de coleta de itens por comando (`pegar chave`)
- Criar regras condicionais (subir a escada com ou sem a chave)
- Configurar transições de cena e feedbacks narrativos
- Compreender como o parser processa linguagem natural

---

## Como funcionam as Interações?

Uma **Interação** é uma regra lógica estruturada da seguinte forma:

> **SE** o jogador usar um dos *Verbos* no *Objeto Alvo*,  
> **E** cumprir os *Requisitos* (ter o item ou contador no valor certo),  
> **ENTÃO** execute os *Efeitos* (mudar de cena, dar item, alterar tracker, exibir feedback).

---

## Passo 1 — Interação: "Pegar a Chave"

No ramo **"Entrada do Farol"**:
1. Na aba **Interações**, clique em **"+ Nova Interação"**.
2. Configure:

| Campo | Valor |
|-------|-------|
| **Verbos** | `pegar`, `coletar`, `apanhar`, `tomar`, `guardar` |
| **Objeto Alvo** | `Chave Enferrujada` |
| **Requisito** | *(nenhum)* |
| **Adicionar ao Inventário** | ✅ **Ativado** |
| **Remover do Ramo** | ✅ **Ativado** (a chave deixa de aparecer no chão após ser pega) |
| **Destino** | *(permanecer no mesmo ramo)* |
| **Mensagem de Sucesso** | `Você se curva e recolhe a chave enferrujada da poeira. Ela é pesada, fria e emite um rangido metálico.` |

---

## Passo 2 — Interação: "Subir sem a Chave" (Bloqueio)

Queremos que o jogador que tentar subir a escada sem ter pego a chave receba uma pista:

1. Clique em **"+ Nova Interação"**.
2. Configure:

| Campo | Valor |
|-------|-------|
| **Verbos** | `subir`, `escalar`, `usar escada`, `ir para cima` |
| **Objeto Alvo** | `Escada de Ferro` |
| **Requisito** | *(nenhum)* |
| **Destino** | *(permanecer no mesmo ramo)* |
| **Mensagem de Sucesso** | `Você sobe alguns degraus de ferro em espiral, mas o alçapão no alto está trancado por um cadeado pesado. Você precisa de uma chave.` |

---

## Passo 3 — Interação: "Subir com a Chave" (Sucesso Condicional)

Quando o jogador **tiver** a chave, o comando de subir deve levá-lo ao próximo ramo:

1. Clique em **"+ Nova Interação"**.
2. Configure:

| Campo | Valor |
|-------|-------|
| **Verbos** | `subir`, `escalar`, `usar escada`, `abrir alçapão`, `usar chave na porta` |
| **Objeto Alvo** | `Escada de Ferro` |
| **Requisito no Inventário** | `Chave Enferrujada` |
| **Consumir Item** | ❌ **Desativado** (a chave permanece na mochila) |
| **Destino** | `Corredor Escuro` |
| **Mensagem de Sucesso** | `Você encaixa a chave enferrujada no cadeado. Com um estalo metálico, a tranca cede e você empurra o alçapão, adentrando o corredor superior.` |

> 💡 **Prioridade Inteligente:** O IF Builder sempre avalia primeiro as interações com requisitos atendidos. Se o jogador tiver a chave, a Interação 3 é executada. Se não tiver, o sistema recua suavemente para a Interação 2 (feedback de bloqueio).

---

## Passo 4 — Interação no "Corredor Escuro"

1. Selecione o ramo **"Corredor Escuro"**.
2. Na aba **Interações**, clique em **"+ Nova Interação"**:

| Campo | Valor |
|-------|-------|
| **Verbos** | `continuar`, `avançar`, `seguir`, `abrir porta`, `entrar` |
| **Objeto Alvo** | *(nenhum — ação direta no ambiente)* |
| **Destino** | `Sala da Lanterna` |
| **Efeito em Tracker** | `Saúde: -1` *(veremos a criação do Tracker no Módulo 09)* |
| **Mensagem de Sucesso** | `Você força a porta de madeira e avança pelo vento uivante em direção à lanterna.` |

---

## Como o Parser compreende frases

O analisador sintático (parser) do IF Builder ignora preposições e artigos comuns, permitindo variações naturais:
- `pegar a chave` = `pegar chave`
- `use a chave enferrujada na escada` = `usar chave escada`
- `abrir o cadeado com a chave` = `abrir cadeado chave`

---

## ✅ Checklist do Módulo 08

- [ ] Interação "Pegar Chave" configurada (coleta + remoção da cena)
- [ ] Interação de bloqueio "Subir sem chave" cadastrada
- [ ] Interação condicional "Subir com chave" apontando para o Corredor Escuro
- [ ] Interação de avanço criada no Corredor Escuro
- [ ] Fluxo testado no simulador de ramificações

---

## Próximo passo

Aprenda a criar contadores dinâmicos de Saúde, Sanidade e Recursos:

→ [**Módulo 09 — Rastreadores (Trackers)**](./09-trackers.md)
