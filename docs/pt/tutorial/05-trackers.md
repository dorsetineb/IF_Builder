# Módulo 05 — Trackers

**Tutorial: A Chave do Farol**  
Tempo estimado: 6–8 minutos

---

## Objetivo deste módulo

Neste módulo você vai:
- Entender o que são Trackers e como funcionam
- Criar um **Tracker de Saúde** (valor máximo: 3)
- Vincular o ramo "Derrota" como consequência
- Conectar o Tracker à interação "Continuar" do Corredor Escuro

---

## O que são Trackers?

**Trackers** são variáveis numéricas que mudam conforme o jogador interage com o mundo. Pense neles como medidores:

- 💚 **Saúde** — vai de 0 a 100; se chegar a 0, o jogador perde
- 💰 **Dinheiro** — sobe ao coletar moedas, cai ao comprar itens
- 🧠 **Sanidade** — diminui em eventos de horror

Você pode criar quantos Trackers quiser, com ícones, cores e comportamentos personalizados.

**Tipos de barra:**
| Tipo | Comportamento |
|------|--------------|
| Normal | Começa cheia; cai conforme o valor diminui |
| Invertida | Começa vazia; sobe conforme o valor aumenta (ex: "Cansaço") |

---

## Passo 1 — Acessar o Editor de Trackers

Na sidebar, clique em **"Trackers"**.

---

## Passo 2 — Criar o Tracker de Saúde

Clique em **"Novo Tracker"** (ícone `+`).

Preencha:

| Campo | Valor |
|-------|-------|
| **Nome** | Saúde |
| **Valor Inicial** | 3 |
| **Valor Máximo** | 3 |
| **Cor da Barra** | Vermelho (`#e74c3c` ou similar) |
| **Ícone** | ❤️ (coração) |
| **Barra Invertida** | ❌ Não |
| **Ocultar Valores** | ❌ Não (mostra "3/3") |

---

## Passo 3 — Definir a Consequência

Na seção **"Consequência ao atingir o máximo"**, selecione o ramo **"Derrota"**.

> ⚠️ **Atenção à lógica:** O IF Builder envia o jogador para o ramo de consequência quando o **Tracker atinge o valor máximo**. Para Saúde, queremos que o jogador vá para "Derrota" quando a saúde **chegar a 0**.
>
> Por isso, usamos a **barra invertida** ou uma lógica alternativa: configure o Tracker com `Valor Inicial = 0` e `Valor Máximo = 3`, com barra invertida ativada — assim ele começa "cheio visualmente" mas matematicamente em 0, e sobe para 3 (derrota) conforme o jogador sofre dano.
>
> **Configuração recomendada para "Saúde que diminui":**
> - Valor Inicial: `0`
> - Valor Máximo: `3`
> - Barra Invertida: ✅ Ativado
> - Consequência: Ramo "Derrota"
> - Cada dano: `+1`

---

## Passo 4 — Vincular ao Corredor Escuro

Agora que o Tracker existe, volte à interação **"Continuar"** do ramo **"Corredor Escuro"**:

1. Selecione o ramo "Corredor Escuro" na narrativa
2. Aba Interações → selecione a interação "Continuar"
3. Na seção **"Trackers"**, clique em **"Adicionar"**
4. Selecione **"Saúde"** → Valor: `+1` (adiciona 1 ao tracker, que representa -1 de vida)
5. Salve a interação

**Fluxo completo com Tracker:**

```
Jogador digita "continuar" no Corredor Escuro
   → Saúde sobe +1 (representa perda de vida)
   → Se Saúde = 3 → ramo "Derrota" ativado
   → Se Saúde < 3 → vai para "Sala da Lanterna" normalmente
```

---

## Passo 5 — Visualizar o Tracker no Preview

Teste o preview do ramo "Corredor Escuro":

1. Clique em **"Testar Ramo"**
2. Digite `continuar`
3. Observe a barra de Saúde diminuir (ou o indicador numérico mudar)

Se o valor máximo for atingido, o jogo deve redirecionar automaticamente para o ramo "Derrota".

---

## Outros usos de Trackers

Os Trackers são muito versáteis:

| Caso de uso | Configuração |
|-------------|-------------|
| HP que cai com dano | Tracker invertido; interações de dano somam +1 |
| Dinheiro que acumula | Tracker normal; interações de coleta somam valor |
| Sanidade que vai esgotando | Tracker normal, consequência = game over |
| Progresso de missão | Tracker normal; cada etapa concluída soma +1 |
| Reputação com personagens | Tracker que sobe ou cai baseado em escolhas |

---

## ✅ Checklist do Módulo 05

- [ ] Tracker "Saúde" criado com valor max 3 e barra invertida
- [ ] Ramo "Derrota" definido como consequência do Tracker
- [ ] Interação "Continuar" do Corredor Escuro configurada com efeito `Saúde +1`
- [ ] Preview testado: barra de Saúde se altera ao digitar "continuar"

---

## Próximo passo

→ [Módulo 06 — Vinhetas e Capítulos](./06-vinhetas-capitulos.md)
