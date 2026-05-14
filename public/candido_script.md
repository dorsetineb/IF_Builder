# CÂNDIDO E O SOL DO DIABO
### Roteiro de Ficção Interativa — IF Builder (Estilo Parser)

---

## ⚙️ 1. SISTEMA DE RASTREADORES

Quatro rastreadores funcionam em paralelo e criam tensões cruzadas. O jogador que evita violência (preservando LUCIDEZ) passará por cenas de introspecção que aumentam VOZ DO DIABO. As escolhas que diminuem FOME BRUTA tendem a aumentar RASTRO DE SANGUE.

| Rastreador | Escala | Dispara | Representa |
|---|---|---|---|
| **FOME BRUTA** | 0 → 100 | RT1: O Colapso | O instinto animal (Corporal) |
| **LUCIDEZ** | 100 → 0 | RT2: O Silêncio Branco | A identidade humana restante (Mental) |
| **VOZ DO DIABO** | 0 → 100 | RT3: A Chama do Inferno | A influência sobrenatural crescendo (Espiritual) |
| **RASTRO DE SANGUE** | 0 → 100 | RT4: O Cerco | A visibilidade pública do monstro (Social) |

### Mapa de Modificações por Cena

| Cena / Ação | FOME BRUTA | LUCIDEZ | VOZ DO DIABO | RASTRO |
|---|---|---|---|---|
| R3: `beber cervejas` | +20 | — | — | — |
| R4: `examinar cadáver` | — | — | +10 | — |
| R4: `vasculhar cadáver` | — | -20 | +15 | — |
| R5B: `enfrentar multidão` | — | -30 | — | +40 |
| R5C: `examinar espelho` | — | — | +20 | — |
| R5C: `pedir café` | — | +10 | — | — |
| R6: `pedir cardápio` (1x) | +30 | — | — | — |
| R6: `pedir cardápio` (2x) | +30 | — | — | — |
| R6: `atacar chapeiro` | — | -30 | — | +40 |
| R7: `seguir escuridão` | — | -20 | +15 | — |
| R7.1: `seguir escuridão` | — | -20 | +20 | — |
| R8: `assassinar chapeiro` | — | -30 | — | +20 |
| R9: *(qualquer ação)* | — | -30 | +30 | +50 |
| R10: `pular janela` | — | — | +20 | +20 |
| R11: `examinar cicatriz` | — | — | +30 | — |

---

## 📦 2. OBJETOS GLOBAIS

| Objeto | Descrição | Função no Jogo |
|---|---|---|
| **Jaqueta** | "Jaqueta de basquete velha. Esconde o pescoço rasgado." | Requisito para acessar R5A |
| **Carteira** | "Notas manchadas. Cheiram a metal." | Requisito para pedir comida em R6 |
| **Faca Enferrujada** | "Lâmina dobrada encontrada no lodo." | Requisito para assassinato furtivo em R8 |
| **Pedaço de Cano** | "Ferro pesado. Pode abrir qualquer porta." | Requisito para forçar saída em R10 |
| **Boné de Aba** | "Esquecido num banco da praça. Complementa o disfarce." | Requisito para acessar R5C |

---

## 🎬 3. CAPÍTULOS (Telas Cinematográficas)

| Tipo | Nome | Acionado em |
|---|---|---|
| Abertura | **Cândido e o Sol do Diabo** | Início do jogo |
| Transição | **O Corte** | R1 → R2 |
| Transição | **O Rasgo da Ilusão** | R3 → R4 |
| Transição | **O Demônio Sangrento** | Entrada em R9 |
| **Gatilho** | **RT1: O Colapso** | FOME BRUTA = 100 |
| **Gatilho** | **RT2: O Silêncio Branco** | LUCIDEZ = 0 |
| **Gatilho** | **RT3: A Chama do Inferno** | VOZ DO DIABO = 100 |
| **Gatilho** | **RT4: O Cerco** | RASTRO DE SANGUE = 100 |
| Fim (Game Over) | **Estátua de Celulose** | R3 |
| Fim (Game Over) | **Linchamento** | R5B |
| Fim (Game Over) | **Chumbo e Asfalto** | R10 / RT4 |
| Fim (Game Over) | **Devorado de Dentro** | RT1 |
| Fim (Alternativo) | **Fantasma de Vidro** | RT2 |
| Fim (Alternativo) | **O Rei Rato** | R7.1 |
| Fim (Alternativo) | **Açougueiro Corporativo** | R8 ou R9 |
| Fim (Canônico) | **O Caco de Vidro** | R11 |

---

## 🗺️ 4. CENAS NARRATIVAS (13 cenas)

---

### R1: O Bar
> *"A cidade é bruta com quem vem de fora sem malícia. O barulho do bar é ensurdecedor. Sete cachaças acabaram com as poucas ideias que você tinha. O `<chão>` é pegajoso. Um `<espelho>` trincado reflete o salão. A `<cachaça>` está no balcão. A `<porta>` é a saída."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `chão` | — | *Muda Texto:* "Marcas de botas pesadas e restos de cigarro grudados no linóleo." | Permanece em R1 |
| `examinar` | `espelho` | — | -10 LUCIDEZ / *Muda Texto:* "Você vê um rosto cansado e triste, instantes antes do caos começar." | Permanece em R1 |
| `beber` | `cachaça` | — | — | Capítulo: O Corte → R2 |
| `abrir` | `porta` | — | — | Capítulo: O Corte → R2 |

---

### R2: Ladrilhos
> *"A faca de serra abriu seu pescoço num esbarrão. O chão pisca em preto e vermelho. Você enfiou a cara na calçada. Os `<ladrilhos>` têm o cheiro da cidade inteira. As pernas das pessoas se agitam horrorizadas ao redor, protegendo as calças do sangue derramado."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `ladrilhos` | — | — | → R3 |
| `pedir ajuda` | `pernas` | — | *Muda Texto:* "As pernas se agitam horrorizadas. Ninguém para." | → R3 |

---

### R3: A Praia (Alucinação)
> *"Uma toalha estendida, uma `<loira>` e `<cervejas>` geladas numa praia de águas cristalinas. O sol não atordoa. A fome está saciada. A `<areia>` é quente. Tudo parece estático demais."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `beber` | `cervejas` | — | +20 FOME BRUTA / *Muda Texto:* "A cerveja não tem gosto. A fome dói." | Permanece em R3 |
| `dormir` | `areia` | — | — | **Fim: Estátua de Celulose** |
| `tocar` | `loira` | — | — | Capítulo: O Rasgo da Ilusão → R4 |

---

### R4: O Beco
> *"O cheiro ferroso acordou algo. Um `<cadáver>` ensanguentado está no chão de um beco estreito. Uma `<poça>` de sangue escorre para um ralo e há um `<pôster>` rasgado na parede. A `<rua>` iluminada parece a única saída."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `cadáver` | — | +10 VOZ DO DIABO / *Muda Texto:* "O rosto está irreconhecível. Alguém passou aqui antes." | Permanece em R4 |
| `vasculhar` | `cadáver` | — | -20 LUCIDEZ / +15 VOZ DO DIABO / Adiciona: Jaqueta, Carteira | Permanece em R4 |
| `examinar` | `poça` | — | +15 VOZ DO DIABO / *Muda Texto:* "O sangue escuro reflete algo com chifres tortos. Não é você." | Permanece em R4 |
| `ler` | `pôster` | — | +10 LUCIDEZ / *Muda Texto:* "Um circo que passou na cidade há anos. Coisas normais do mundo passado." | Permanece em R4 |
| `ir` | `rua` | **Jaqueta** | — | → R5A |
| `ir` | `rua` | *(sem Jaqueta)* | — | → R5B |

---

### R5A: Praça Camuflado
> *"A jaqueta esconde o horror. Você se mistura na multidão. A `<estátua>` central vigia o caos silencioso. O artista `<Zé São>` joga facas enquanto a plateia aplaude. Há uma `<lanchonete>` brilhando na esquina. Um `<boné>` esquecido num banco."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `estátua` | — | *Muda Texto:* "Um herói de guerra sem rosto. Pombos defecam no bronze inútil." | Permanece em R5A |
| `pegar` | `boné` | — | Adiciona: Boné de Aba | Permanece em R5A |
| `assistir` | `Zé São` | — | *Muda Texto:* "Ele joga facas com precisão cirúrgica." | Permanece em R5A |
| `falar` | `Zé São` | — | — | → R5A.1 |
| `ir` | `lanchonete` | — | — | → R6 |

---

### R5A.1: Conversa com Zé São *(Cena de Diálogo)*
> *"Você se aproxima ao final da apresentação. A plateia se dispersa. Zé São guarda as lâminas e encara você. Os olhos dele são escuros e afundados. 'Você não tem pulso, irmão', ele sussurra rápido, não querendo chamar atenção. 'O que você quer?'"*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `perguntar` | `cidade` | — | +10 LUCIDEZ / *Muda Texto:* "'A cidade mastiga os fracos', diz ele. 'E vomita os monstros'." | Permanece em R5A.1 |
| `mostrar` | `cicatriz` | — | +20 VOZ DO DIABO / *Muda Texto:* "Ele recua um passo apavorado. 'O diabo te marcou. Sai de perto de mim.'" | → R5A |
| `despedir` | `Zé São` | — | — | → R5A |

---

### R5B: Praça Pânico
> *"Você sai com o pescoço aberto e jorrando. A `<multidão>` recua em pânico, saca pedras e garrafas. Há um `<bueiro>` aberto na calçada."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `enfrentar` | `multidão` | — | -30 LUCIDEZ / +40 RASTRO | **Fim: Linchamento** |
| `entrar` | `bueiro` | — | — | → R7 |

---

### R5C: A Cafeteria Quieta *(Acesso: Jaqueta + Boné)*
> *"Com a jaqueta e o boné, você parece quase humano. Uma `<cafeteria>` pequena está aberta. Há um `<jornal>` abandonado na mesa. O `<espelho>` atrás do balcão reflete alguém que você não reconhece."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `espelho` | — | +20 VOZ DO DIABO / *Muda Texto:* "A cicatriz pulsa. Você não tem batimentos. Mas continua de pé." | Permanece em R5C |
| `ler` | `jornal` | — | *Muda Texto:* "A manchete: 'Série de mortes inexplicáveis no centro'." | Permanece em R5C |
| `pedir` | `café` | Carteira | +10 LUCIDEZ / *Muda Texto:* "O café queima a boca. Você sente algo. Talvez ainda haja um fio." | Permanece em R5C |
| `sair` | `rua` | — | — | → R6 |

---

### R6: Lanchonete Frente
> *"O `<chapeiro>` está de costas fritando hambúrgueres. A gordura crepita. A artéria do pescoço dele salta num movimento hipnótico. Você pode pedir o `<cardápio>` ou chamar a atenção dele."*

**Nota:** Pedir o cardápio duas vezes eleva FOME BRUTA a 100, disparando RT1 automaticamente.

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `falar` | `chapeiro` | — | — | → R6.1 |
| `pedir` | `cardápio` | **Carteira** | +30 FOME BRUTA / *Muda Texto:* "A carne tem gosto de papel." | Permanece em R6 |
| `atacar` | `chapeiro` | — | -30 LUCIDEZ / +40 RASTRO | → R9 |
| `ir` | `cozinha` | — | — | → R8 |

---

### R6.1: O Balcão da Lanchonete *(Cena de Diálogo)*
> *"O chapeiro vira de frente. O avental está imundo de mostarda e sangue. Ele apoia as mãos no balcão e repara na sua jaqueta suja. 'Noite difícil, parceiro?', ele pergunta coçando o próprio pescoço suado. 'Vai querer o quê?'"*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `pedir` | `comida` | **Carteira** | +30 FOME BRUTA / *Muda Texto:* "Você mastiga com raiva, mas a fome verdadeira rasga as paredes do seu estômago por dentro." | → R6 |
| `perguntar` | `sangue` | — | +15 VOZ DO DIABO / *Muda Texto:* "Ele ri alto. 'Sangue de boi, amigão. Fresquinho do abatedouro municipal.' Sua boca enche d'água." | Permanece em R6.1 |
| `ignorar` | `chapeiro` | — | — | → R6 |

---

### R7: Esgotos
> *"Escuridão e ecos. O lixo da cidade escorre por tubulações acima. Há uma `<inscrição>` apagada na parede de cimento. Há uma `<grade>` que dá para a rua de trás da lanchonete. Um caminho pela `<escuridão>` profunda."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `ler` | `inscrição` | — | +10 VOZ DO DIABO / *Muda Texto:* "'O rato engoliu o sol', diz a pichação torta em tinta vermelha." | Permanece em R7 |
| `vasculhar` | `lixo` | — | Adiciona: Faca Enferrujada / *Muda Texto:* "Uma lâmina velha achada no lodo." | Permanece em R7 |
| `seguir` | `escuridão` | — | -20 LUCIDEZ / +15 VOZ DO DIABO | → R7.1 |
| `abrir` | `grade` | — | — | → R8 |

---

### R7.1: A Galeria dos Ratos
> *"Centenas de ratos observam. Um `<cano>` de ferro enferrujado flutua na água suja. Mais fundo, a `<escuridão>` engole qualquer sinal de saída."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `pegar` | `cano` | — | Adiciona: Pedaço de Cano | Permanece em R7.1 |
| `seguir` | `escuridão` | — | -20 LUCIDEZ / +20 VOZ DO DIABO | **Fim: O Rei Rato** |
| `voltar` | `grade` | — | — | → R8 |

---

### R8: Lanchonete Fundos
> *"Você emergiu dos esgotos direto na despensa. Cheira a gordura rançosa. O `<chapeiro>` trabalha distraído na sala à frente. Uma `<prateleira>` tem potes e garrafas."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `prateleira` | — | *Muda Texto:* "Sal grosso, vinagre, caixas de isopor. Nada útil." | Permanece em R8 |
| `assassinar` | `chapeiro` | **Faca Enferrujada** | -30 LUCIDEZ / +20 RASTRO | **Fim: Açougueiro Corporativo** |
| `ir` | `frente` | — | — | → R9 |

---

### R9: O Massacre
> *"O sangue está nas paredes. Capítulo: O Demônio Sangrento. A confusão em volta vai explodir em pouco tempo. Um `<rádio>` de pilha toca uma música alegre que contrasta de forma bizarra com a morte. Ao longe, três homens de `<ternos>` observam o caos com calma suspeita, como se esperassem por isso. Um `<prédio>` comercial abre seu saguão na esquina."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `desligar` | `rádio` | — | +10 LUCIDEZ / *Muda Texto:* "O silêncio é pior que a música. O som abafado do massacre agora é mais real." | Permanece em R9 |
| `atacar` | `ternos` | — | -30 LUCIDEZ / +30 VOZ DO DIABO / +50 RASTRO | **Fim: Açougueiro Corporativo** |
| `fugir` | `prédio` | — | — | → R10 |

---

### R10: As Escadas do Prédio
> *"Você sobe tropeçando, deixando um rastro vermelho nos degraus. As sirenes explodem lá fora. A `<porta>` do telhado está trancada. Uma `<janela>` lateral está aberta sobre o vazio."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `quebrar` | `porta` | **Pedaço de Cano** | — | → R11 |
| `pular` | `janela` | — | +20 VOZ DO DIABO / +20 RASTRO / *Muda Texto:* "Você cai sobre uma marquise. Os ossos estalam. Você levanta." | → R11 |
| `esperar` | `polícia` | — | — | **Fim: Chumbo e Asfalto** |

---

### R11: O Telhado
> *"O vento sopra frio. O sol amarelo queima a nuca. Uma voz sem origem diz: 'Todos vocês são bichos. Você já está morto, Cândido. Escolhi você justamente pela forma que você morreu.' O `<asfalto>` clama por você lá embaixo."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `cicatriz` | — | +30 VOZ DO DIABO / *Muda Texto:* "O corte é profundo demais. Ninguém sobrevive a isso. E ainda assim." | Permanece em R11 |
| `pular` | `asfalto` | — | — | **Fim Canônico: O Caco de Vidro** |
| `aceitar` | `voz` | — | *Muda Texto:* "O sol engole tudo. Você sorri pela primeira vez desde que desceu do ônibus." | **Fim Canônico: O Caco de Vidro** *(variante com epílogo diferente)* |

---

## ⚡ 5. CENAS DE GATILHO (6 cenas — todas genéricas)

> **Regra de ouro:** Nenhuma cena de gatilho menciona local, personagem nomeado ou objeto específico. Elas descrevem exclusivamente o estado interno de Cândido ou uma situação abstrata, garantindo coerência narrativa independente de onde o gatilho for disparado.

---

### RT1: O Colapso *(FOME BRUTA = 100)*
> *"Não houve aviso. A fome não pediu licença. O vermelho que estava nas bordas da visão engoliu tudo de uma vez. Não há memória do que aconteceu nos segundos que se seguiram. Só o gosto de ferro na língua e o silêncio depois. Você está de pé. Não sabe quanto tempo passou. As mãos estão quentes."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `examinar` | `mãos` | *Muda Texto:* "Você prefere não pensar no que está nelas." | → R9 |
| `recusar` | `tudo` | — | **Fim: Devorado de Dentro** |

---

### RT2: O Silêncio Branco *(LUCIDEZ = 0)*
> *"Em algum momento você parou de tentar entender. Não há nome. Não há dor. Não há fome. Há apenas o próximo passo e a próxima porta. O corpo sabe o caminho. A mente foi embora sem se despedir. Você não sabe se isso é paz ou se é o fim."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `continuar` | `caminho` | — | → R9 *(o corpo segue sozinho)* |
| `parar` | `tudo` | — | **Fim: Fantasma de Vidro** |

---

### RT3: A Chama do Inferno *(VOZ DO DIABO = 100)*
> *"A voz não vem de fora. Não há boca, não há direção. Ela simplesmente está dentro, como se sempre tivesse estado lá esperando você parar de fazer barulho o suficiente para ouvi-la.*
>
> *'Você põe medo nas pessoas. Lá, de onde você veio, você era grão de areia. Aqui, você é um caco de vidro perdido na praia.'*
>
> *A voz não pergunta. Ela apenas constata. E espera."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `aceitar` | `voz` | +30 FOME BRUTA | → R11 *(atalho direto ao clímax)* |
| `recusar` | `voz` | +30 LUCIDEZ | → RT3.1: O Debate |
| `ignorar` | `tudo` | — | Retorna à cena anterior |

---

### RT3.1: O Debate *(Cena filha de RT3)*
> *"'Por que eu?' A pergunta sai antes de você poder segurar. A voz considera, como se tivesse tempo infinito para responder.*
>
> *'Porque você morreu da maneira certa. Com raiva. Com fome. Sem ninguém para lamentar. Isso é raro.'*
>
> *Você sente a cicatriz no pescoço latejar. Ela sempre lateja quando a voz fala. Como se o corte fosse uma boca que ela usa para te lembrar do que aconteceu."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `aceitar` | `destino` | — | → R11 *(atalho direto ao clímax)* |
| `desafiar` | `voz` | +20 LUCIDEZ / -20 VOZ DO DIABO | Retorna à cena anterior |

---

### RT4: O Cerco *(RASTRO DE SANGUE = 100)*
> *"Você não ouviu chegarem. De repente estavam lá. Muitos. De todos os lados. Alguns com uniformes, outros com roupas comuns, outros com expressões que não têm nome. Eles te viram. Você não sabe há quanto tempo te seguiam, mas sabe que estava deixando rastros que qualquer um conseguiria seguir.*
>
> *Há uma saída. Sempre há uma saída. Mas ela vai custar algo."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `fugir` | `saída` | -40 LUCIDEZ | → R10 *(atalho para as escadas)* |
| `enfrentar` | `cerco` | — | → RT4.1: O Espetáculo |
| `render` | `tudo` | — | **Fim: Chumbo e Asfalto** |

---

### RT4.1: O Espetáculo *(Cena filha de RT4)*
> *"Você avança. Eles recuam. Um por um ou todos de vez, não importa — o monstro atravessa o cerco deixando um corredor de horror atrás de si. Quando para, está sozinho novamente. Sempre sozinho.*
>
> *A cidade inteira sabe que você existe agora. Não tem mais volta para o anonimato. Mas tem volta para algum lugar."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `seguir` | `caminho` | — | → R9 *(se ainda não passou)* / → R10 *(se já passou por R9)* |
| `sentar` | `chão` | +20 LUCIDEZ / *Muda Texto:* "Você para. O silêncio depois do caos dói de um jeito diferente." | → R11 *(atalho direto)* |

---

## 🏁 6. FINAIS

| # | Nome | Tipo | Descrição |
|---|---|---|---|
| 1 | **Estátua de Celulose** | Game Over | Cândido adormece na alucinação da praia e nunca mais volta. |
| 2 | **Linchamento** | Game Over | Morto pela multidão em pânico na praça. |
| 3 | **Chumbo e Asfalto** | Game Over | Rendido ou baleado pela polícia nas escadas. |
| 4 | **Devorado de Dentro** | Game Over | Recusa o colapso e se autodestrói por não aceitar o que é. |
| 5 | **Fantasma de Vidro** | Alternativo | LUCIDEZ zerando sem violência — Cândido para no meio da rua e se dissolve. |
| 6 | **O Rei Rato** | Alternativo | Foge pela escuridão dos esgotos e desaparece nas entranhas da cidade. |
| 7 | **Açougueiro Corporativo** | Alternativo | Aceita a proposta dos homens de terno ou elimina o chapeiro furtivamente. |
| 8 | **O Caco de Vidro** | Canônico | Pula do telhado. O sol amarelo engole tudo. O diabo cumprimenta seu novo servo. |

---

## 📊 7. RESUMO ESTRUTURAL

| Categoria | Quantidade |
|---|---|
| Cenas Narrativas | 13 (R1–R11 + R5C + R7.1) |
| Cenas de Gatilho (Raiz) | 4 (RT1, RT2, RT3, RT4) |
| Cenas Filhas de Gatilho | 2 (RT3.1, RT4.1) |
| **Total de Cenas** | **19** |
| Rastreadores | 4 |
| Objetos Globais | 5 |
| Finais | 8 |

---

## 🗺️ 8. MAPA DE FLUXO (Texto)

```
R1 → R2 → R3 ──[dormir areia]──────────────────────► FIM: Estátua de Celulose
              │
              └──[tocar loira]──► R4
                                   │
                              [sem Jaqueta]──► R5B ──[enfrentar]──► FIM: Linchamento
                                   │                 └──[bueiro]──► R7 → R7.1 → FIM: Rei Rato
                              [com Jaqueta]──► R5A ──[pegar boné]──► R5C
                                                      │               │
                                                      └───────────────┴──► R6
                                                                           │
                                                                     [ir cozinha]──► R8 ──[assassinar+faca]──► FIM: Açougueiro
                                                                           │              └──[ir frente]──► R9
                                                                     [atacar]──► R9
                                                                                  │
                                                                            [atacar ternos]──► FIM: Açougueiro
                                                                                  │
                                                                            [fugir prédio]──► R10
                                                                                              │
                                                                                        [esperar]──► FIM: Chumbo e Asfalto
                                                                                              │
                                                                                        [subir]──► R11
                                                                                                    │
                                                                                              [pular/aceitar]──► FIM: O Caco de Vidro

RASTREADORES (disparam em qualquer momento):
  FOME BRUTA = 100   ──► RT1 ──► R9 ou FIM: Devorado de Dentro
  LUCIDEZ = 0        ──► RT2 ──► R9 ou FIM: Fantasma de Vidro
  VOZ DO DIABO = 100 ──► RT3 → RT3.1 ──► R11 (atalho) ou volta à cena
  RASTRO = 100       ──► RT4 → RT4.1 ──► R9/R10 (atalho) ou FIM: Chumbo
```

---

*Documento gerado para uso no IF Builder — Parser Mode.*
*Versão 1.0 | Maio 2026*
