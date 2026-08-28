# Roteiro de Vídeo #09 — Rastreadores (Trackers)

**Título:** Criando Rastreadores: Barras de Saúde, Vidas e Finais Automáticos  
**Duração estimada:** 3–4 minutos  
**Série:** IF Builder — Tutorial Completo  

---

## 🎬 Estrutura do Vídeo

```
[00:00 – 00:20]  Introdução aos Rastreadores
[00:20 – 01:10]  Criando o Tracker "Saúde" (3/3, Ícone, Cor Vermelha)
[01:10 – 01:50]  Configurando Consequência ao Zerar (Redirecionar para "Derrota")
[01:50 – 02:40]  Vinculando o Efeito de Dano (-1) às Interações e Hotspots
[02:40 – 03:20]  Testando o Dano e o Game Over ao Vivo
[03:20 – 03:40]  Encerramento e Próximo Passo
```

---

## 🎙️ Narração e Ações de Tela

---

### [00:00 – 00:20] INTRODUÇÃO

> *[Tela: Clicar no item 📈 "Rastreadores" no menu lateral esquerdo]*

**Narrador:**
"Variáveis como saúde, sanidade ou moedas trazem tensão e dinâmica para o jogo. Hoje vamos criar o nosso Tracker de Saúde na página Rastreadores."

---

### [00:20 – 01:10] CRIANDO O TRACKER DE SAÚDE

> *[Ação: Clicar em "+ Novo Rastreador" e preencher Nome: Saúde, Inicial: 3, Mínimo: 0, Máximo: 3, Cor Vermelha, Ícone de Coração]*

**Narrador:**
"Criamos um rastreador chamado 'Saúde'. Definimos o valor inicial em 3, o mínimo em 0 e o máximo em 3. Escolhemos a cor vermelha e o ícone de coração."

---

### [01:10 – 01:50] CONSEQUÊNCIA DE DERROTA

> *[Ação: Na seção de consequência, selecionar 'Ao atingir o valor mínimo (0)' → Destino: 'Derrota']*

**Narrador:**
"Na seção de consequência, definimos que quando a saúde chegar a zero, o jogo deve redirecionar o jogador imediatamente para o ramo de 'Derrota'."

---

### [01:50 – 02:40] VINCULANDO O DANO

> *[Ação: Abrir a interação "Continuar" do Corredor Escuro e adicionar o efeito "Saúde: -1"]*

**Narrador:**
"Para que o jogador perca vida ao avançar pelo frio congelante do Corredor Escuro, vinculamos na interação um modificador de Saúde de '-1'."

---

### [02:40 – 03:20] TESTE AO VIVO DO GAME OVER

> *[Ação: Entrar no Corredor Escuro e avançar repetidamente até zerar o coração e a tela de Derrota abrir]*

**Narrador:**
"Ao testar, o coração no topo da tela diminui de 3 para 2, de 2 para 1... e ao zerar, somos levados direto para a tela de Derrota!"

---

### [03:20 – 03:40] ENCERRAMENTO

**Narrador:**
"Nosso sistema de sobrevivência está funcionando! No próximo vídeo, vamos para a página de Verbos criar comandos universais como ajuda e tutorial!"

---

## 🎥 Orientações de Gravação

| Momento | Instrução de Tela |
|---------|------------------|
| Barra de Status | Zoom na barra superior com o coração mudando de valor |
| Game Over | Mostrar a transição suave para a tela de Derrota |
