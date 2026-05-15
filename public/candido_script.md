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
| R3.5: `examinar luz amarela` | — | -10 | — | — |
| R3.5: `tocar cicatriz` | — | — | +10 | — |
| R3.5: `berrar alguém` | — | — | +15 | — |
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
| **Jaqueta** | "A `<jaqueta>` de basquete velha cheira a suor antigo. Esconde o pescoço rasgado." | Requisito para acessar R5A |
| **Carteira** | "A `<carteira>` tem notas manchadas que cheiram a metal." | Requisito para pedir comida em R6 |
| **Faca Enferrujada** | "A `<faca>` tem uma lâmina dobrada achada no lodo." | Requisito para assassinato furtivo em R8 |
| **Pedaço de Cano** | "O `<cano>` é um ferro pesado que pode abrir qualquer coisa." | Requisito para forçar saída em R10 |
| **Boné de Aba** | "O `<boné>` esquecido complementa a ilusão de que você é gente." | Requisito para acessar R5C |

---

## 🎬 3. CAPÍTULOS E RAMIFICAÇÕES (Telas Cinematográficas)

| Tipo | Nome | Acionado em |
|---|---|---|
| Capítulo (Abertura) | **Cândido e o Sol do Diabo** | Início do jogo |
| Capítulo (Transição) | **O Corte** | R1 → R2 |
| Capítulo (Transição) | **O Rasgo da Ilusão** | R3 → R3.5 |
| Capítulo (Transição) | **O Demônio Sangrento** | Entrada em R9 |
| **Capítulo (Gatilho)** | **RT1: O Colapso** | FOME BRUTA = 100 |
| **Capítulo (Gatilho)** | **RT2: O Silêncio Branco** | LUCIDEZ = 0 |
| **Capítulo (Gatilho)** | **RT3: A Chama do Inferno** | VOZ DO DIABO = 100 |
| **Capítulo (Gatilho)** | **RT4: O Cerco** | RASTRO DE SANGUE = 100 |
| Capítulo (Fim / Game Over) | **Estátua de Celulose** | R3 |
| Capítulo (Fim / Game Over) | **Linchamento** | R5B |
| Capítulo (Fim / Game Over) | **Chumbo e Asfalto** | R10 / RT4 |
| Capítulo (Fim / Game Over) | **Devorado de Dentro** | RT1 |
| Capítulo (Fim Alternativo) | **Fantasma de Vidro** | RT2 |
| Capítulo (Fim Alternativo) | **O Rei Rato** | R7.1 |
| Capítulo (Fim Alternativo) | **Açougueiro Corporativo** | R8 ou R9 |
| Capítulo (Fim Canônico) | **O Caco de Vidro** | R11 |

---

## 🗺️ 4. CENAS NARRATIVAS (14 cenas)

---

### R1: O Bar (Ramificação)
> *"A cidade bate primeiro e pergunta depois. O barulho do bar é um soco contínuo. Sete cachaças derreteram as suas ideias. O `<chão>` gruda na bota. O `<espelho>` na parede tá trincado, dividindo sua cara em duas. A `<cachaça>` no balcão te encara de volta. A `<porta>` é a saída. Se você conseguir levantar."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `chão` | — | *Muda Texto:* "Chiclete preto, cigarro amassado e cuspe. O mosaico da sexta-feira." | Permanece em R1 |
| `examinar` | `espelho` | — | -10 LUCIDEZ / *Muda Texto:* "Você vê um rosto cansado de ser seu. Daqui a pouco ele nem será." | Permanece em R1 |
| `beber` | `cachaça` | — | — | Capítulo: O Corte → R2 |
| `abrir` | `porta` | — | — | Capítulo: O Corte → R2 |

---

### R2: Ladrilhos (Ramificação)
> *"Você enfiou a cara na calçada. O chão pisca, preto, vermelho, preto, vermelho. Os `<ladrilhos>` têm o cheiro da cidade toda misturado com urina velha. As `<pernas>` das pessoas se agitam horrorizadas ao redor, como baratas gigantes, tentando proteger as calças do sangue derramado. Sua faca de serra abriu seu próprio pescoço num esbarrão torto."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `ladrilhos` | — | — | → R3 |
| `pedir ajuda` | `pernas` | — | *Muda Texto:* "As baratas vestem sapatos caros. Elas correm, desviando da poça que é você." | → R3 |

---

### R3: A Praia - Alucinação (Ramificação)
> *"Tudo vira branco. Depois, azul. Uma toalha fina, uma `<loira>` de comercial e `<cervejas>` suando frio numa praia perfeitamente cristalina. O sol aqui não morde. A fome sumiu. A `<areia>` aquece as costas como um cobertor. A paz é tão artificial que dá enjoo."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `beber` | `cervejas` | — | +20 FOME BRUTA / *Muda Texto:* "A garrafa tá gelada, mas o líquido tem gosto de isopor. A fome rasga de novo." | Permanece em R3 |
| `dormir` | `areia` | — | — | **Fim: Estátua de Celulose** |
| `tocar` | `loira` | — | — | Capítulo: O Rasgo da Ilusão → R3.5 |

---

### R3.5: O Sol do Diabo (Ramificação)
> *"O sol te achou. A `<luz amarela>` engoliu tudo — parede, chão, você. A mala sumiu. A pele arde como plástico derretendo. Passou a mão no pescoço e a `<cicatriz>` respondeu. Grossa. Viva. Tentou gritar mas a boca só abriu. Nem som, nem cheiro. Só calor. E um fôlego na nuca que não é seu. Tem `<alguém>` ali. Na luz. Parado como poste. Sorrindo sem ter boca."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `luz amarela` | — | -10 LUCIDEZ / *Muda Texto:* "A luz cega e queima as memórias da sua infância." | Permanece em R3.5 |
| `tocar` | `cicatriz` | — | +10 VOZ DO DIABO / *Muda Texto:* "Ela pulsa grossa. O ritmo bate igual ao fôlego na sua nuca." | Permanece em R3.5 |
| `berrar` | `alguém` | — | +15 VOZ DO DIABO / *Muda Texto:* "Nenhum som sai. Mas a presença na luz parece sorrir mais largo." | Permanece em R3.5 |
| `correr` | `luz amarela` | — | — | → R4 |

---

### R4: O Beco (Ramificação)
> *"O cheiro de ferro enferrujado acordou alguma coisa nas suas tripas. O `<cadáver>` ensanguentado esparramado no chão do beco parece obra de um açougueiro amador. Uma `<poça>` grossa escorre mole pro ralo. Um `<pôster>` rasgado chora na parede de tijolo sujo. A `<rua>` iluminada grita buzinas lá na frente."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `cadáver` | — | +10 VOZ DO DIABO / *Muda Texto:* "O rosto tá uma pasta. Alguém chegou primeiro. E esse alguém tava com raiva." | Permanece em R4 |
| `vasculhar` | `cadáver` | — | -20 LUCIDEZ / +15 VOZ DO DIABO / Adiciona: Jaqueta, Carteira | Permanece em R4 |
| `examinar` | `poça` | — | +15 VOZ DO DIABO / *Muda Texto:* "O sangue escuro reflete algo com chifres tortos. Não é a sua cara." | Permanece em R4 |
| `ler` | `pôster` | — | +10 LUCIDEZ / *Muda Texto:* "Um circo que passou na cidade há anos. Coisas normais. Mundo velho." | Permanece em R4 |
| `ir` | `rua` | **Jaqueta** | — | → R5A |
| `ir` | `rua` | *(sem Jaqueta)* | — | → R5B |

---

### R5A: Praça Camuflado (Ramificação)
> *"A jaqueta esconde o desastre no seu pescoço. Você é só mais um fantasma na multidão. A `<estátua>` caga bronze e vigia o caos surdo. O artista `<Zé São>` joga facas com uma tranquilidade irritante. O povo aplaude como macacos amestrados. A `<lanchonete>` brilha letreiros de neon. Tem um `<boné>` jogado no banco."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `estátua` | — | *Muda Texto:* "Um herói sem rosto. Pombos defecam no ombro de quem já morreu." | Permanece em R5A |
| `pegar` | `boné` | — | Adiciona: Boné de Aba | Permanece em R5A |
| `assistir` | `Zé São` | — | *Muda Texto:* "A lâmina corta o ar. Ele não erra. Parece ter pacto com o vento." | Permanece em R5A |
| `falar` | `Zé São` | — | — | → R5A.1 |
| `ir` | `lanchonete` | — | — | → R6 |

---

### R5A.1: Conversa com Zé São (Ramificação de Diálogo)
> *"Você chega perto quando os macacos amestrados vão embora. Zé São guarda as lâminas. Encara sua alma furada. 'Você não tem pulso, irmão', ele murmura de lado, com cara de quem cheirou pólvora. 'O que você quer da minha vida?'"*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `perguntar` | `cidade` | — | +10 LUCIDEZ / *Muda Texto:* "'A cidade mastiga os fracos', diz ele. 'E vomita bicho ruim igual a você'." | Permanece em R5A.1 |
| `mostrar` | `cicatriz` | — | +20 VOZ DO DIABO / *Muda Texto:* "Ele recua, pálido. 'O diabo te assinou. Tira o pé daqui.'" | → R5A |
| `despedir` | `Zé São` | — | — | → R5A |

---

### R5B: Praça Pânico (Ramificação)
> *"Você sai na luz com o pescoço pingando miúdos. Como num desenho animado mal desenhado, a `<multidão>` congela, solta gritos esganiçados e recua. Logo começam a puxar tijolos e garrafas quebradas. Um `<bueiro>` te olha da calçada, aberto e faminto."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `enfrentar` | `multidão` | — | -30 LUCIDEZ / +40 RASTRO | **Fim: Linchamento** |
| `entrar` | `bueiro` | — | — | → R7 |

---

### R5C: A Cafeteria Quieta (Ramificação)
*(Acesso: Jaqueta + Boné)*
> *"A jaqueta e o boné enganam os trouxas. Você parece gente. Uma `<cafeteria>` de merda tá aberta. O `<jornal>` tá largo na mesa cheirando a café velho. O `<espelho>` atrás da máquina de espresso reflete um manequim morto. Você."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `espelho` | — | +20 VOZ DO DIABO / *Muda Texto:* "A cicatriz pula. O coração não bate, mas o pescoço respira." | Permanece em R5C |
| `ler` | `jornal` | — | *Muda Texto:* "A manchete chia miúdo: 'Série de mortes no centro'. Ninguém liga de verdade." | Permanece em R5C |
| `pedir` | `café` | Carteira | +10 LUCIDEZ / *Muda Texto:* "O preto quente queima a língua mole. Parece que ainda tem um fiozinho de vida aí dentro." | Permanece em R5C |
| `sair` | `rua` | — | — | → R6 |

---

### R6: Lanchonete Frente (Ramificação)
> *"O `<chapeiro>` frita hambúrgueres de costas. A gordura chia igual rádio fora do ar. A artéria no pescoço do homem pula grossa. Tum, tum, tum. Hipnótico. Você pode pedir o `<cardápio>` ou chamar a porra da atenção dele."*

**Nota:** Pedir o cardápio duas vezes eleva FOME BRUTA a 100, disparando RT1.

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `falar` | `chapeiro` | — | — | → R6.1 |
| `pedir` | `cardápio` | **Carteira** | +30 FOME BRUTA / *Muda Texto:* "A carne do lanche tem gosto de papelão. Você mastiga isopor." | Permanece em R6 |
| `atacar` | `chapeiro` | — | -30 LUCIDEZ / +40 RASTRO | → R9 |
| `ir` | `cozinha` | — | — | → R8 |

---

### R6.1: O Balcão da Lanchonete (Ramificação de Diálogo)
> *"O chapeiro vira. A cara gorda pingando óleo e suor. O avental de lona tá sujo com uma mancha esquisita. Ele encosta as patas no balcão e olha torto pra sua jaqueta fudida. 'Noite longa, parceiro?', ele raspa a garganta. 'Vai querer ração de quê?'"*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `pedir` | `comida` | **Carteira** | +30 FOME BRUTA / *Muda Texto:* "Mastigar não adianta. A fome verdadeira tá comendo o estômago de dentro pra fora." | → R6 |
| `perguntar` | `sangue` | — | +15 VOZ DO DIABO / *Muda Texto:* "Ele arrota uma risada. 'É de boi, amigão. Fresco. Do abatedouro.' Sua boca saliva." | Permanece em R6.1 |
| `ignorar` | `chapeiro` | — | — | → R6 |

---

### R7: Esgotos (Ramificação)
> *"Um túnel de concreto podre. O vômito da cidade inteira escorre pelas paredes. Uma `<inscrição>` de tinta velha grita na parede torta. A `<grade>` nos fundos aponta pra rua de cima. Mais pra baixo, a `<escuridão>` te convida pra entrar num buraco sem fundo. Esgoto é o intestino do mundo."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `ler` | `inscrição` | — | +10 VOZ DO DIABO / *Muda Texto:* "'O rato engoliu o sol'. Pichação de profeta bêbado." | Permanece em R7 |
| `vasculhar` | `lixo` | — | Adiciona: Faca Enferrujada / *Muda Texto:* "Uma lâmina torta escondida na merda." | Permanece em R7 |
| `seguir` | `escuridão` | — | -20 LUCIDEZ / +15 VOZ DO DIABO | → R7.1 |
| `abrir` | `grade` | — | — | → R8 |

---

### R7.1: A Galeria dos Ratos (Ramificação)
> *"O chão mexe. São ratos. Centenas de ratinhos espertos vigiando os seus tornozelos de defunto. Um `<cano>` de chumbo boia na bosta líquida. O fundo do cano é uma `<escuridão>` grossa, que chupa toda a luz da cidade lá em cima."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `pegar` | `cano` | — | Adiciona: Pedaço de Cano / *Muda Texto:* "Pesado. Frio. Um argumento forte." | Permanece em R7.1 |
| `seguir` | `escuridão` | — | -20 LUCIDEZ / +20 VOZ DO DIABO | **Fim: O Rei Rato** |
| `voltar` | `grade` | — | — | → R8 |

---

### R8: Lanchonete Fundos (Ramificação)
> *"A tampa do bueiro te cospe na despensa. Gordura velha. O `<chapeiro>` tá lá na frente de costas, alheio à podridão. Uma `<prateleira>` capenga exibe lixo enlatado. Um pote de picles. Nada demais."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `prateleira` | — | *Muda Texto:* "Sal. Vinagre. Uma barata passeando de férias. Tudo inútil." | Permanece em R8 |
| `assassinar` | `chapeiro` | **Faca Enferrujada** | -30 LUCIDEZ / +20 RASTRO | **Fim: Açougueiro Corporativo** |
| `ir` | `frente` | — | — | → R9 |

---

### R9: O Massacre (Ramificação)
> *"O sangue virou tinta e a parede virou tela. Capítulo: O Demônio Sangrento. O ar cheira a cobre quente. Um `<rádio>` toca uma musiquinha imbecil, sorrindo de tudo. Longe dali, três homens de `<ternos>` te observam fumando. Eles não estão nem aí pro caos. Um `<prédio>` aponta pro céu, com a porta de vidro arreganhada."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `desligar` | `rádio` | — | +10 LUCIDEZ / *Muda Texto:* "O silêncio é pior. Agora os gemidos mortos aparecem mais vivos." | Permanece em R9 |
| `atacar` | `ternos` | — | -30 LUCIDEZ / +30 VOZ DO DIABO / +50 RASTRO | **Fim: Açougueiro Corporativo** |
| `fugir` | `prédio` | — | — | → R10 |

---

### R10: As Escadas do Prédio (Ramificação)
> *"O pé bate no degrau. Respira. Sangra. Bate no degrau. As sirenes cantam pneu lá fora, latindo fino. A `<porta>` pro telhado não quer abrir. Trancada pra burro. Uma `<janela>` lateral te mostra o asfalto. Vazio. Sem rede de segurança."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `quebrar` | `porta` | **Pedaço de Cano** | — | → R11 |
| `pular` | `janela` | — | +20 VOZ DO DIABO / +20 RASTRO / *Muda Texto:* "O corpo tomba mole na marquise. Quebrou algo, mas e daí? Você levanta." | → R11 |
| `esperar` | `polícia` | — | — | **Fim: Chumbo e Asfalto** |

---

### R11: O Telhado (Ramificação)
> *"O ar corta o rosto. O sol é uma gema de ovo podre. Uma voz que não vem de lugar nenhum assobia na orelha: 'Todo mundo é bicho de abatedouro. Você morreu, Cândido. E só por isso eu te escolhi.' O `<asfalto>` lá embaixo chama teu nome."*

| Verbo | Alvo | Requisito | Efeito | Resultado |
|---|---|---|---|---|
| `examinar` | `cicatriz` | — | +30 VOZ DO DIABO / *Muda Texto:* "Um corte de ponta a ponta. Um sorriso no gogó. Ninguém vive com isso." | Permanece em R11 |
| `pular` | `asfalto` | — | — | **Fim Canônico: O Caco de Vidro** |
| `aceitar` | `voz` | — | *Muda Texto:* "O amarelo engole o prédio. Você ri pro chão lá embaixo." | **Fim Canônico: O Caco de Vidro** *(variante)* |

---

## ⚡ 5. CENAS DE GATILHO (6 cenas — todas genéricas)

> **Regra de ouro:** Nenhuma cena de gatilho menciona local, personagem nomeado ou objeto específico. Elas descrevem exclusivamente o estado interno de Cândido ou uma situação abstrata, garantindo coerência narrativa independente de onde o gatilho for disparado.

---

### RT1: O Colapso (Capítulo Gatilho - FOME BRUTA = 100)
> *"Ninguém bate na porta. A fome arrebenta a dobradiça e invade a sala. O vermelho come as beiradas da tua visão. O corpo assume o volante. O branco apaga o rastro. Não sobrou nada na memória. Só gosto de cobre nos dentes. Você volta a si. De pé. Não sabe que dia é, não sabe quem é. Suas `<mãos>` estão quentes pra caralho."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `examinar` | `mãos` | *Muda Texto:* "O cheiro sobe. Você decide que é melhor não investigar de quem é o resto." | → R9 |
| `recusar` | `tudo` | — | **Fim: Devorado de Dentro** |

---

### RT2: O Silêncio Branco (Capítulo Gatilho - LUCIDEZ = 0)
> *"O cérebro desligou o disjuntor. Chega. Não tem nome. Não tem calçada. Não tem dor. O corpo balança as pernas por inércia, como um zumbi de corda rumo a lugar nenhum. A mente evaporou como mijo quente no asfalto. Um `<caminho>` qualquer estica os dedos pro seu pé."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `continuar` | `caminho` | — | → R9 *(o corpo segue sozinho)* |
| `parar` | `tudo` | — | **Fim: Fantasma de Vidro** |

---

### RT3: A Chama do Inferno (Capítulo Gatilho - VOZ DO DIABO = 100)
> *"A `<voz>` não sussurra de fora. Ela nasce nas entranhas. Ocupa o lugar que a alma largou na calçada.*
>
> *'Você mete medo neles. Larga a mão. Na tua terra tu era farelo de terra seca. Aqui, tu é caco de vidro cortando pé de bacana.'*
>
> *A voz não faz pergunta. Ela bate o carimbo. E espera você assinar."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `aceitar` | `voz` | +30 FOME BRUTA | → R11 *(atalho direto ao clímax)* |
| `recusar` | `voz` | +30 LUCIDEZ | → RT3.1: O Debate |
| `ignorar` | `tudo` | — | Retorna à cena anterior |

---

### RT3.1: O Debate (Ramificação - Filha de RT3)
> *"'Por que eu?' escapa do buraco do teu pescoço. A voz mastiga as palavras antes de responder.*
>
> *'Por causa da raiva na tua morte. Porque não tem ninguém pra rezar por você. É assim que o capeta escolhe os apóstolos.'*
>
> *A ferida lateja apertado. Cada vez que o bicho fala de dentro de ti, a tua carne acende."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `aceitar` | `destino` | — | → R11 *(atalho direto ao clímax)* |
| `desafiar` | `voz` | +20 LUCIDEZ / -20 VOZ DO DIABO | Retorna à cena anterior |

---

### RT4: O Cerco (Capítulo Gatilho - RASTRO DE SANGUE = 100)
> *"Mágica urbana. O vazio vira um inferno num segundo. O `<cerco>` tá armado. De farda, à paisana, revólver e cacete. Não importa. O seu sangue desenhou um rastro grosso pra qualquer idiota seguir. A caça acabou.*
>
> *Sempre tem uma `<saída>`. Mas a porta tem dente."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `fugir` | `saída` | -40 LUCIDEZ | → R10 *(atalho para as escadas)* |
| `enfrentar` | `cerco` | — | → RT4.1: O Espetáculo |
| `render` | `tudo` | — | **Fim: Chumbo e Asfalto** |

---

### RT4.1: O Espetáculo (Ramificação - Filha de RT4)
> *"O monstro levanta o pelo. Eles recuam de nojo. Você rasga o cerco, e a cada passo a cidade aprende seu nome em código Morse de bala e osso quebrado. E aí... o silêncio. Sozinho de novo. O `<caminho>` tá livre. E o `<chão>` é teu trono."*

| Verbo | Alvo | Efeito | Resultado |
|---|---|---|---|
| `seguir` | `caminho` | — | → R9 *(se ainda não passou)* / → R10 *(se já passou por R9)* |
| `sentar` | `chão` | +20 LUCIDEZ / *Muda Texto:* "Você deita a bunda no frio de concreto. O silêncio bate no tímpano." | → R11 *(atalho direto)* |

---

## 🏁 6. FINAIS

| # | Nome | Tipo | Descrição |
|---|---|---|---|
| 1 | **Estátua de Celulose** | Capítulo Final (Game Over) | Cândido adormece na alucinação da praia e nunca mais volta. |
| 2 | **Linchamento** | Capítulo Final (Game Over) | Morto pela multidão em pânico na praça. |
| 3 | **Chumbo e Asfalto** | Capítulo Final (Game Over) | Rendido ou baleado pela polícia nas escadas. |
| 4 | **Devorado de Dentro** | Capítulo Final (Game Over) | Recusa o colapso e se autodestrói por não aceitar o que é. |
| 5 | **Fantasma de Vidro** | Capítulo Final (Alternativo) | LUCIDEZ zerando sem violência — Cândido para no meio da rua e se dissolve. |
| 6 | **O Rei Rato** | Capítulo Final (Alternativo) | Foge pela escuridão dos esgotos e desaparece nas entranhas da cidade. |
| 7 | **Açougueiro Corporativo** | Capítulo Final (Alternativo) | Aceita a proposta dos homens de terno ou elimina o chapeiro furtivamente. |
| 8 | **O Caco de Vidro** | Capítulo Final (Canônico) | Pula do telhado. O sol amarelo engole tudo. O diabo cumprimenta seu novo servo. |

---

## 📊 7. RESUMO ESTRUTURAL

| Categoria | Quantidade |
|---|---|
| Cenas Narrativas | 14 (R1–R11 + R5C + R7.1 + R3.5) |
| Cenas de Gatilho (Raiz) | 4 (RT1, RT2, RT3, RT4) |
| Cenas Filhas de Gatilho | 2 (RT3.1, RT4.1) |
| **Total de Cenas** | **20** |
| Rastreadores | 4 |
| Objetos Globais | 5 |
| Finais | 8 |

---

## 🗺️ 8. MAPA DE FLUXO (Texto)

```
R1 → R2 → R3 ──[dormir areia]──────────────────────► FIM: Estátua de Celulose
              │
              └──[tocar loira]──► R3.5 ──[correr luz amarela]──► R4
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
                                                                       [fugir]──► R10 ──[esperar]──► FIM: Chumbo e Asfalto
                                                                                   │
                                                                        [quebrar / pular]──► R11 ──[pular]──► FIM CANÔNICO: O Caco de Vidro
```
