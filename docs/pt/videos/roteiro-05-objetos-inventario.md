# Roteiro de Vídeo #05 — Objetos e Inventário

**Título:** Criando Objetos e Gerenciando o Inventário  
**Duração estimada:** 3–4 minutos  
**Série:** IF Builder Tutoriais

---

## 🎬 Estrutura do Vídeo

```
[00:00 – 00:25]  O que são objetos no IF Builder
[00:25 – 01:30]  Criar um objeto na Biblioteca
[01:30 – 02:15]  Vincular ao ramo
[02:15 – 02:50]  Como aparece no jogo (inventário, examinar)
[02:50 – 03:15]  Dica: objetos reutilizáveis
[03:15 – 03:30]  CTA
```

---

## 🎙️ Narração

---

### [00:00 – 00:25] O QUE SÃO OBJETOS

> *[Tela: Painel de inventário no jogo com alguns itens]*

**Narrador:**
"Objetos são os itens do seu mundo — coisas que o jogador pode examinar, coletar, usar, dar. A chave que abre uma porta, a lanterna que ilumina o caminho, a carta que revela um segredo."

---

### [00:25 – 01:30] CRIAR OBJETO

> *[Ação: clicar em "Objetos" na sidebar → Criar Objeto]*

**Narrador:**
"Na sidebar, clico em 'Objetos'. Aqui fica a Biblioteca de Objetos — global ao projeto inteiro."

"Clico em Criar Objeto. No campo de nome: 'Chave Enferrujada'."

> *[Ação: digitar nome e descrição de examinar]*

"Na Descrição de Examinar, escrevo o que o jogador vê ao inspecionar a chave. 'Uma chave velha, coberta de ferrugem. O cabo tem a forma de um farol em miniatura.'"

> *[Ação: ativar toggle "Coletável"]*

"E aqui está o detalhe mais importante: ativo a opção 'Coletável'. Isso significa que o jogador pode adicionar esse objeto ao inventário quando configurarmos a interação certa."

---

### [01:30 – 02:15] VINCULAR AO RAMO

> *[Ação: ir ao ramo "Entrada do Farol" → aba Objetos → Vincular]*

**Narrador:**
"O objeto existe na biblioteca, mas ele precisa aparecer em algum lugar da história. Vou ao ramo 'Entrada do Farol', clico na aba Objetos, e vinculo a Chave Enferrujada."

> *[Tela: objeto aparece na lista de objetos do ramo]*

"Pronto — a chave agora existe nesse ramo. Faço o mesmo para a Escada de Ferro, que não é coletável — é parte do cenário, só pode ser examinada."

---

### [02:15 – 02:50] COMO APARECE NO JOGO

> *[Tela: Preview do ramo — painel "Coisas aqui" com os objetos listados]*

**Narrador:**
"No jogo, os objetos aparecem na lista 'Coisas aqui'. O jogador pode clicar para examinar, ou digitar verbos diretamente."

"Quando ele digita 'examinar chave', o sistema exibe a descrição que escrevemos — sem precisar configurar uma interação específica para isso. Os verbos examinar, olhar e ler funcionam automaticamente."

> *[Tela: Inventário com a chave coletada]*

"E quando ele pegar a chave — via interação que configuramos antes — ela aparece no inventário."

---

### [02:50 – 03:15] DICA: OBJETOS REUTILIZÁVEIS

**Narrador:**
"Uma coisa legal: como os objetos são globais, você pode usar o mesmo objeto em múltiplos ramos. Uma tocha que o jogador carrega, por exemplo, pode aparecer em vários cenários sem você precisar recriá-la."

"E editar o objeto na biblioteca atualiza automaticamente em todos os ramos onde ele aparece."

---

### [03:15 – 03:30] CTA

**Narrador:**
"Objetos criados e vinculados. No próximo vídeo, vamos configurar os Trackers — como criar um sistema de Saúde para o nosso farol."

"Até lá."

---

## 🎥 Orientações de Gravação

| Momento | Instrução |
|---------|-----------|
| Toggle Coletável | Fechar zoom no toggle sendo ativado |
| Vinculação ao ramo | Mostrar claramente a lista antes e depois |
| Preview com inventário | Demonstrar ao vivo — coletar e abrir inventário |
