# Roteiro de Vídeo #08 — Interações e Lógica do Parser

**Título:** Interações: Criando Ações, Condições e Gatilhos Inteligentes  
**Duração estimada:** 4–5 minutos  
**Série:** IF Builder — Tutorial Completo  

---

## 🎬 Estrutura do Vídeo

```
[00:00 – 00:25]  O que são Interações?
[00:25 – 01:25]  Interação 1: "Pegar Chave" (Adicionar ao Inventário e remover da cena)
[01:25 – 02:15]  Interação 2: "Subir sem chave" (Feedback de bloqueio)
[02:15 – 03:05]  Interação 3: "Subir com chave" (Condição de inventário e avanço)
[03:05 – 03:50]  Interação no "Corredor Escuro"
[03:50 – 04:30]  Demonstração ao Vivo do Fluxo Completo
[04:30 – 04:50]  Encerramento e Próximo Passo
```

---

## 🎙️ Narração e Ações de Tela

---

### [00:00 – 00:25] INTRODUÇÃO

> *[Tela: Editor de Ramos → aba "Interações" aberta no nó "Entrada do Farol"]*

**Narrador:**
"Uma Interação diz ao jogo o que deve acontecer quando o jogador usa determinado verbo em um objeto. Hoje vamos programar as regras de ação da nossa história."

---

### [00:25 – 01:25] INTERAÇÃO 1: PEGAR CHAVE

> *[Ação: Clicar em "+ Nova Interação" e preencher verbos: pegar, coletar; Alvo: Chave Enferrujada; Ativar "Adicionar ao Inventário" e "Remover do Ramo"]*

**Narrador:**
"Criamos a interação para coletar a chave. Nos verbos: 'pegar, coletar, tomar'. O alvo é a Chave Enferrujada. Ativamos 'Adicionar ao Inventário' e 'Remover do Ramo' para que ela saia do chão assim que for pega."

---

### [01:25 – 02:15] INTERAÇÃO 2: SUBIR SEM CHAVE

> *[Ação: Criar interação com verbos: subir escada; Alvo: Escada de Ferro; Mensagem de bloqueio]*

**Narrador:**
"Agora criamos a tentativa de subir a escada sem ter a chave. O jogo responde: 'O alçapão está trancado por um cadeado pesado. Você precisa de uma chave.'"

---

### [02:15 – 03:05] INTERAÇÃO 3: SUBIR COM CHAVE (CONDIÇÃO)

> *[Ação: Criar interação com verbos: subir escada; Requisito: Chave Enferrujada; Destino: Corredor Escuro]*

**Narrador:**
"E a mágica acontece aqui: criamos outra interação para a escada, mas agora com o Requisito 'Chave Enferrujada no inventário' e Destino 'Corredor Escuro'."

"O IF Builder prioriza automaticamente a regra com requisito quando o jogador possui a chave!"

---

### [03:05 – 03:50] INTERAÇÃO NO CORREDOR ESCURO

> *[Ação: Abrir o nó "Corredor Escuro" → Criar interação "Continuar" com destino "Sala da Lanterna"]*

**Narrador:**
"No Corredor Escuro, criamos a interação para o comando 'continuar' ou 'avançar', levando o jogador para a Sala da Lanterna."

---

### [03:50 – 04:30] TESTE AO VIVO

> *[Ação: Rodar o teste: tentar subir sem chave (bloqueio) → digitar 'pegar chave' (entra na bolsa) → digitar 'subir escada' (sucesso, vai para o corredor)]*

**Narrador:**
"Testando ao vivo: tentamos subir, recebemos o aviso de tranca. Digitamos 'pegar chave', ela vai para o inventário. Digitamos 'subir escada' e avançamos para o corredor!"

---

### [04:30 – 04:50] ENCERRAMENTO

**Narrador:**
"Toda a lógica funcionou perfeitamente! No próximo vídeo, vamos para a página de Rastreadores criar o contador de vidas e saúde!"

---

## 🎥 Orientações de Gravação

| Momento | Instrução de Tela |
|---------|------------------|
| Prioridade | Mostrar a lista de interações ordenadas |
| Teste ao vivo | Gravar a sequência de comandos e transição de tela |
