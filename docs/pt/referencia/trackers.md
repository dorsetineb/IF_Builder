# Referência — Trackers

**Trackers** são variáveis numéricas que mudam em resposta às ações do jogador. Use-os para criar sistemas de saúde, moeda, sanidade, progresso de missão, reputação e muito mais.

---

## Acesso

Sidebar → **Trackers**

---

## Propriedades do Tracker

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Nome** | Texto | Exibido na interface do jogo |
| **Valor Inicial** | Número | Valor ao iniciar o jogo |
| **Valor Máximo** | Número | Valor que dispara a consequência |
| **Cor da Barra** | Color picker | Cor visual da barra de progresso |
| **Ícone** | Seletor | Ícone da barra (coração, moeda, etc.) |
| **Barra Invertida** | Toggle | Inverte o sentido de preenchimento |
| **Ocultar Valores** | Toggle | Oculta os números X/Y da interface |
| **Ramo de Consequência** | Seletor de ramo | Para onde o jogador vai ao atingir o máximo |

---

## Barra Normal vs. Invertida

| Configuração | Barra visual | Uso típico |
|-------------|-------------|-----------|
| **Normal** | Começa cheia, diminui | Saúde que cai, munição |
| **Invertida** | Começa vazia, sobe | Cansaço que acumula, progresso |

### Exemplo: Saúde (barra normal)

```
Valor Inicial: 100
Valor Máximo: 0   ← consequência ao chegar em 0
Barra Invertida: Não
Dano: -10 por interação
```

> ⚠️ No IF Builder, a consequência é disparada quando o tracker atinge o **Valor Máximo**. Para simular "saúde que acaba", use a configuração invertida ou reconfigure os valores.

### Exemplo: Saúde (barra invertida — recomendado)

```
Valor Inicial: 0
Valor Máximo: 3   ← quando Dano = 3, consequência
Barra Invertida: Sim  ← visualmente parece "cheia" no início
Dano: +1 por interação
```

---

## Vinculando Trackers a Interações

Para que um Tracker mude de valor, vincule-o a uma **Interação**:

1. Editor de Ramos → aba Interações
2. Selecione ou crie uma interação
3. Seção **"Trackers"** → **"Adicionar"**
4. Selecione o Tracker e defina o valor de mudança

| Valor | Efeito |
|-------|--------|
| `+10` | Aumenta o Tracker em 10 |
| `-10` | Diminui o Tracker em 10 |
| `+1` | Aumenta em 1 (no modelo invertido = 1 de dano) |

Uma interação pode afetar **múltiplos Trackers** ao mesmo tempo.

---

## Consequência

Quando o Tracker atinge o **Valor Máximo**, o jogador é automaticamente enviado para o **Ramo de Consequência**.

Usos comuns:
- Derrota por esgotamento de saúde → ramo "Game Over"
- Missão completa → ramo "Vitória"
- Sanidade zero → ramo de enlouquecimento
- Dívida máxima → ramo de prisão

---

## Visibilidade na Interface

Para exibir os Trackers durante o jogo:

Configurações do Jogo → Sistemas → **"Mostrar Trackers na Interface"** → ✅ Ativar

Os Trackers aparecem como barras com ícone e valores (ex: ❤️ 2/3).

---

## Painel de Interações do Tracker

Dentro do Editor de Trackers, a seção **"Interações que Modificam Este Tracker"** lista todas as interações vinculadas, com link direto para edição.

Útil para auditar o sistema e garantir que os valores batem.

---

## Exemplos de Uso

| Sistema | Tracker | Valor Inicial | Máximo | Consequência |
|---------|---------|--------------|--------|-------------|
| Saúde básica | Saúde | 0 | 3 | Ramo Derrota |
| Economia | Moedas | 0 | 100 | Ramo Vitória (rico) |
| Sanidade | Sanidade | 100 | — | *(sem consequência — apenas visual)* |
| Progresso | Pistas encontradas | 0 | 5 | Ramo Revelação |
| Reputação | Confiança do NPC | 0 | 10 | Ramo de aliança |
