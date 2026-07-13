# Roteiro de Vídeo #06 — Trackers

**Título:** Criando um Sistema de Consequências com Trackers  
**Duração estimada:** 4–5 minutos  
**Série:** IF Builder Tutoriais

---

## 🎬 Estrutura do Vídeo

```
[00:00 – 00:30]  O que são Trackers e exemplos de uso
[00:30 – 01:30]  Criar o Tracker de Saúde
[01:30 – 02:15]  Configurar barra invertida e consequência
[02:15 – 03:00]  Vincular o Tracker a uma Interação
[03:00 – 03:45]  Testar no Preview — ver a barra diminuir
[03:45 – 04:10]  CTA
```

---

## 🎙️ Narração

---

### [00:00 – 00:30] O QUE SÃO TRACKERS

> *[Tela: Interface do jogo com barra de Saúde visível]*

**Narrador:**
"Trackers são variáveis numéricas que mudam conforme o jogador age. Saúde, dinheiro, sanidade, reputação — qualquer coisa que precise de um medidor."

"Quando o Tracker atinge um valor limite, o jogo envia o jogador para um ramo específico — pode ser derrota, vitória ou qualquer consequência narrativa."

---

### [00:30 – 01:30] CRIAR TRACKER

> *[Ação: clicar em "Trackers" na sidebar → Novo Tracker]*

**Narrador:**
"Na sidebar, clico em Trackers. Crio um novo."

> *[Ação: preencher Nome = "Saúde"]*

"Nome: Saúde."

> *[Ação: definir Valor Inicial = 0, Máximo = 3]*

"Valor Inicial: 0. Valor Máximo: 3."

> *[Ação: escolher cor vermelha e ícone de coração]*

"Cor vermelha, ícone de coração."

---

### [01:30 – 02:15] BARRA INVERTIDA E CONSEQUÊNCIA

> *[Ação: ativar "Barra Invertida"]*

**Narrador:**
"Aqui tem uma lógica importante. No IF Builder, a consequência dispara quando o Tracker atinge o Valor Máximo."

"Para simular Saúde que cai, ativo a Barra Invertida. Visualmente, a barra começa cheia — mas matematicamente o valor é zero. Cada dano soma 1, e quando chega a 3, o jogador perde."

> *[Tela: preview da barra — aparece cheia com barra invertida ativa]*

"Veja: a barra aparece cheia mesmo com valor 0. Perfeito para saúde."

> *[Ação: selecionar Ramo de Consequência = "Derrota"]*

"No campo Consequência, seleciono o ramo Derrota — o jogador vai para lá quando a Saúde chegar ao máximo."

---

### [02:15 – 03:00] VINCULAR A INTERAÇÃO

> *[Ação: ir ao ramo Corredor Escuro → Interação "Continuar" → seção Trackers → Adicionar]*

**Narrador:**
"Agora preciso conectar o Tracker a uma ação. Vou ao ramo Corredor Escuro, na interação 'Continuar'."

> *[Ação: clicar em Adicionar Tracker → selecionar Saúde → valor +1]*

"Na seção Trackers, adiciono um efeito: Saúde +1. Toda vez que o jogador avançar pelo corredor, a Saúde aumenta em 1 — que no nosso modelo invertido representa perda de vida."

---

### [03:00 – 03:45] TESTAR

> *[Ação: abrir Preview do ramo Corredor Escuro]*

**Narrador:**
"Vou testar. Digito 'continuar'."

> *[Tela: barra de saúde diminui visivelmente]*

"A barra diminui. Mais uma vez..."

> *[Tela: barra diminui novamente]*

"Mais uma..."

> *[Tela: barra zerada → transição automática para ramo Derrota]*

"E quando chegou ao limite — o jogo me mandou automaticamente para o ramo Derrota. Sem configuração adicional."

---

### [03:45 – 04:10] CTA

**Narrador:**
"Trackers são simples de configurar mas muito poderosos. Com eles, você cria consequências reais para as escolhas do jogador."

"No próximo vídeo, vamos fazer as telas cinematográficas — as Vinhetas de Abertura e Conclusão."

"Até lá."

---

## 🎥 Orientações de Gravação

| Momento | Instrução |
|---------|-----------|
| Barra invertida | Mostrar o preview da barra mudando com/sem barra invertida |
| Teste no preview | Capturar a barra diminuindo em tempo real |
| Transição para Derrota | Capturar a animação de mudança de ramo |
