# Roteiro de Vídeo #04 — Parser e Verbos

**Título:** Como funcionam os Verbos e o Parser  
**Duração estimada:** 4–5 minutos  
**Série:** IF Builder Tutoriais

---

## 🎬 Estrutura do Vídeo

```
[00:00 – 00:30]  O que é o Parser e como funciona
[00:30 – 01:30]  Criar a primeira Interação (pegar chave)
[01:30 – 02:30]  Criar Interação com Requisito (subir com chave)
[02:30 – 03:15]  Feedback Negativo — o que acontece sem item
[03:15 – 03:50]  Testar no Preview
[03:50 – 04:10]  CTA
```

---

## 🎙️ Narração

---

### [00:00 – 00:30] O QUE É O PARSER

> *[Tela: Preview do jogo com campo de texto em destaque]*

**Narrador:**
"O Parser é o sistema que interpreta o que o jogador digita. Quando ele escreve 'pegar chave', o IF Builder identifica o verbo — pegar — e o alvo — chave — e executa a ação correspondente."

"Você, como autor, define quais verbos fazem o quê. Isso é feito nas Interações."

---

### [00:30 – 01:30] CRIAR INTERAÇÃO — PEGAR CHAVE

> *[Ação: abrir Editor de Ramos "Entrada do Farol" → aba Interações → Criar Interação]*

**Narrador:**
"Vou ao ramo 'Entrada do Farol', clico na aba Interações, e crio uma nova."

> *[Ação: preencher campos — Verbos: pegar, tomar, coletar]*

"No campo de Verbos, escrevo todas as palavras que o jogador pode usar: 'pegar, tomar, coletar, apanhar'."

> *[Ação: selecionar Alvo = Chave Enferrujada]*

"O Alvo é a Chave Enferrujada. Ativo a opção 'Adicionar ao Inventário' — assim a chave vai para o inventário do jogador ao ser coletada."

> *[Ação: ativar "Remover objeto do ramo"]*

"E ativo 'Remover do Ramo' para que a chave desapareça do cenário depois de coletada. Parece um detalhe, mas faz o jogo muito mais coerente."

---

### [01:30 – 02:30] INTERAÇÃO COM REQUISITO

> *[Ação: criar nova interação — Subir escada com chave]*

**Narrador:**
"Agora a parte interessante. Quero que o jogador só consiga subir a escada se tiver a chave."

"Crio uma nova interação. Verbos: 'subir, escalar'. Alvo: Escada de Ferro."

> *[Ação: selecionar Requisito = Chave Enferrujada]*

"No campo Requisito, seleciono a Chave Enferrujada. Isso diz ao jogo: essa interação só funciona se o jogador tiver esse item no inventário."

> *[Ação: definir Destino = Corredor Escuro]*

"O Destino é o Corredor Escuro — é para lá que o jogador vai ao subir."

---

### [02:30 – 03:15] FEEDBACK NEGATIVO

> *[Ação: criar outra interação de "subir" sem requisito]*

**Narrador:**
"Mas o que acontece se o jogador tentar subir sem a chave? Sem uma interação de fallback, o sistema apenas não responde — o que é frustrante."

"Por isso, crio uma segunda interação de 'subir escada' sem nenhum requisito, que mantém o jogador no ramo e exibe uma mensagem explicando a situação."

> *[Ação: digitar mensagem: "Você tenta subir, mas a porta no topo está trancada."]*

"Assim, o jogador recebe um feedback claro. O IF Builder dá prioridade à interação com requisito quando o item está no inventário — e usa essa como fallback quando não está."

---

### [03:15 – 03:50] TESTAR NO PREVIEW

> *[Ação: clicar em "Testar Ramo"]*

**Narrador:**
"Vou testar. Primeiro sem a chave: digito 'subir' — e recebo a mensagem de bloqueio. Agora digito 'pegar chave' — ela vai ao inventário. Digito 'subir' de novo..."

> *[Tela: Transição para o ramo Corredor Escuro]*

"E funcionou. O sistema reconheceu que eu tinha a chave e me mandou para o próximo ramo."

---

### [03:50 – 04:10] CTA

**Narrador:**
"É assim que o coração do IF Builder funciona — verbos, alvos, requisitos, resultados. No próximo vídeo, vamos ver os Trackers: como criar um sistema de Saúde e consequências para o jogador."

"Até lá."

---

## 🎥 Orientações de Gravação

| Momento | Instrução |
|---------|-----------|
| Campos de interação | Zoom nos campos ao preencher |
| Preview do teste | Mostrar o campo de texto e a resposta claramente |
| Transição de ramo | Capturar a animação de mudança de cena |
| Diagrama mental | Opcional: sobreposição mostrando "verbo + alvo + req. = resultado" |
