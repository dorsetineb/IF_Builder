# Módulo 09 — Rastreadores (Trackers)

**Tutorial: A Chave do Farol**  
Tempo estimado: 8–10 minutos

---

## Objetivo deste módulo

Neste módulo você vai aprender a usar o sistema de variáveis e contadores dinâmicos através da página **"Rastreadores"** no menu lateral esquerdo:
- Compreender o que são **Rastreadores (Trackers)** e seus tipos de exibição
- Criar um **Tracker de Saúde** (valor 3/3)
- Configurar a consequência de derrota automática
- Vincular alterações no contador em **Interações** e em **Hotspots de Cenários**
- Testar o comportamento das barras de status no jogo

---

## O que são Rastreadores?

**Rastreadores (Trackers)** são variáveis numéricas visíveis na interface do jogo que mudam conforme o jogador toma decisões ou sofre consequências:

| Rastreador | Tipo de Comportamento | Exemplo de Uso |
|------------|-----------------------|----------------|
| ❤️ **Saúde** | Começa em 3, diminui com dano. Ao chegar em 0 → Derrota. | Sobrevivência, combates e perigos ambientais. |
| 🧠 **Sanidade** | Diminui ao presenciar horrores. Ao esgotar → Loucura. | Terror cósmico e suspense psicológico. |
| 💰 **Moedas / Ouro** | Aumenta ao encontrar baús, diminui ao comprar itens. | Comércio e economia. |
| ⏳ **Tempo / Turnos** | Avança a cada ação até o amanhecer ou explosão. | Missões com contagem regressiva. |

---

## Passo 1 — Acessar a Página de Rastreadores

No menu lateral esquerdo, clique no sexto item: 📈 **Rastreadores**.

---

## Passo 2 — Criar o Tracker de Saúde

Clique em **"Novo Rastreador"** (ícone `+`) e preencha:

| Campo | Valor |
|-------|-------|
| **Nome** | Saúde |
| **Valor Inicial** | `3` |
| **Valor Mínimo** | `0` |
| **Valor Máximo** | `3` |
| **Cor da Barra** | Vermelho Carmim (`#e74c3c` ou similar) |
| **Ícone** | ❤️ (Coração / Heart) |
| **Exibir Valores** | ✅ **Ativado** (exibe `3/3` sobre a barra) |
| **Barra Invertida** | ❌ **Desativado** (começa cheia e esvazia ao sofrer dano) |

---

## Passo 3 — Configurar a Consequência

Na seção **"Consequência ao atingir o limite"**:
- **Gatilho de Consequência**: Ao atingir o valor mínimo (`0`).
- **Ramo de Destino**: Selecione o ramo **"Derrota"**.

> 💡 Quando a Saúde do jogador zerar, o IF Builder interrompe o jogo imediatamente e realiza a transição dramática para a tela de Derrota.

---

## Passo 4 — Vincular o Dano às Ações

Agora vamos fazer com que certas ações custem vida do jogador:

### 1. Em uma Ramificação de Texto:
1. No menu lateral, abra **"Narrativa"** e selecione o ramo **"Corredor Escuro"**.
2. Na aba **Interações**, abra a interação **"Continuar"**.
3. Na seção **Efeitos em Rastreadores**, clique em **"+ Vincular"**:
   - Selecione: `Saúde`
   - Modificador: `-1`
4. Salve a interação.

### 2. Em um Hotspot de Cenário:
1. No Cenário **"Oficina do Faroleiro"**, ao desenhar um hotspot sobre uma armadilha ou fio elétrico:
   - *Ação*: **Alterar Rastreador**
   - *Rastreador*: `Saúde`
   - *Modificador*: `-1`
   - *Mensagem*: `Você tocou em um cabo energizado e sofreu um choque elétrico doloroso!`

---

## Passo 5 — Testar no Preview

1. Abra o ramo **"Corredor Escuro"** e clique em **Testar**.
2. Observe o indicador de ❤️ `Saúde: 3/3` na barra superior.
3. Digite `continuar` três vezes consecutivas.
4. Veja a barra esvaziar gradualmente até disparar a transição automática para a tela de **"Derrota"**.

---

## ✅ Checklist do Módulo 09

- [ ] Tracker "Saúde" criado com valor 3/3 e ícone de coração
- [ ] Consequência de redirecionamento para o ramo "Derrota" configurada
- [ ] Dano de -1 vinculado na interação do Corredor Escuro
- [ ] Redirecionamento de fim de jogo verificado no teste

---

## Próximo passo

Aprenda a cadastrar comandos globais válidos em qualquer ponto do jogo:

→ [**Módulo 10 — Verbos Globais**](./10-verbos.md)
