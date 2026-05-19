# CÂNDIDO E O SOL DO DIABO

### Roteiro de Ficção Interativa — IF Builder (Estilo Parser)

---

## ⚙️ 1. SISTEMA DE RASTREADORES

Quatro rastreadores funcionam em paralelo e criam tensões cruzadas. O jogador que evita violência (preservando LUCIDEZ) passará por cenas de introspecção que aumentam VOZ DO DIABO. As escolhas que diminuem FOME BRUTA tendem a aumentar RASTRO DE SANGUE.

| Rastreador           | Escala  | Dispara                 | Representa                                       |
| -------------------- | ------- | ----------------------- | ------------------------------------------------ |
| **FOME BRUTA**       | 0 → 100 | RT1: O Colapso          | O instinto animal (Corporal)                     |
| **LUCIDEZ**          | 100 → 0 | RT2: O Silêncio Branco  | A identidade humana restante (Mental)            |
| **VOZ DO DIABO**     | 0 → 100 | RT3: A Chama do Inferno | A influência sobrenatural crescendo (Espiritual) |
| **RASTRO DE SANGUE** | 0 → 100 | RT4: O Cerco            | A visibilidade pública do monstro (Social)       |

### Mapa de Modificações por Cena

| Cena / Ação                  | FOME BRUTA | LUCIDEZ | VOZ DO DIABO | RASTRO |
| ---------------------------- | ---------- | ------- | ------------ | ------ |
| R3: `beber cervejas`         | +20        | —       | —            | —      |
| R3.5: `examinar luz amarela` | —          | -10     | —            | —      |
| R3.5: `tocar cicatriz`       | —          | —       | +10          | —      |
| R3.5: `berrar alguém`        | —          | —       | +15          | —      |
| R4: `examinar cadáver`       | —          | —       | +10          | —      |
| R4: `vasculhar cadáver`      | —          | -20     | +15          | —      |
| R5B: `enfrentar multidão`    | —          | -30     | —            | +40    |
| R5C: `examinar espelho`      | —          | —       | +20          | —      |
| R5C: `pedir café`            | —          | +10     | —            | —      |
| R6: `pedir cardápio` (1x)    | +30        | —       | —            | —      |
| R6: `pedir cardápio` (2x)    | +30        | —       | —            | —      |
| R6: `atacar chapeiro`        | —          | -30     | —            | +40    |
| R7: `seguir escuridão`       | —          | -20     | +15          | —      |
| R7.1: `seguir escuridão`     | —          | -20     | +20          | —      |
| R8: `assassinar chapeiro`    | —          | -30     | —            | +20    |
| R9: _(qualquer ação)_        | —          | -30     | +30          | +50    |
| R10: `pular janela`          | —          | —       | +20          | +20    |
| R11: `examinar cicatriz`     | —          | —       | +30          | —      |

---

## 📦 2. OBJETOS GLOBAIS (COLETÁVEIS 🎒)

> Todos os objetos abaixo são **coletáveis**: o jogador pode pegá-los e guardá-los no inventário para uso posterior. Eles são requisitos para desbloquear caminhos alternativos.

| ID     | Objeto               | 🎒  | Descrição                                                                          | Função no Jogo                                  | Obtido em                |
| ------ | -------------------- | --- | ---------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------ |
| **O1** | **Jaqueta**          | 🎒  | "A `<jaqueta>` de basquete velha cheira a suor antigo. Esconde o pescoço rasgado." | Requisito para acessar R5A                      | R4 (`vasculhar cadáver`) |
| **O2** | **Carteira**         | 🎒  | "A `<carteira>` tem notas manchadas que cheiram a metal."                          | Requisito para pedir comida em R6 e café em R5C | R4 (`vasculhar cadáver`) |
| **O3** | **Faca Enferrujada** | 🎒  | "A `<faca>` tem uma lâmina dobrada achada no lodo."                                | Requisito para assassinato furtivo em R8        | R7 (`vasculhar lixo`)    |
| **O4** | **Pedaço de Cano**   | 🎒  | "O `<cano>` é um ferro pesado que pode abrir qualquer coisa."                      | Requisito para forçar saída em R10              | R7.1 (`pegar cano`)      |
| **O5** | **Boné de Aba**      | 🎒  | "O `<boné>` esquecido complementa a ilusão de que você é gente."                   | Requisito para acessar R5C (com O1)             | R5A (`pegar boné`)       |

---

## 🎬 3. ÍNDICE DE CAPÍTULOS E RAMIFICAÇÕES

> **Legenda de IDs:** `C` = Capítulo (cutscene), `R` = Ramificação (cena interativa), `O` = Objeto (coletável)

### Capítulos (Cutscenes)

| ID      | Tipo              | Nome                         | Acionado em            |
| ------- | ----------------- | ---------------------------- | ---------------------- |
| **C1**  | Abertura          | **Cândido e o Sol do Diabo** | Início do jogo         |
| **C2**  | Transição         | **O Corte**                  | R1 → R2                |
| **C3**  | Transição         | **O Rasgo da Ilusão**        | R3 → R3.5              |
| **C4**  | Transição         | **O Demônio Sangrento**      | Entrada em R9          |
| **C5**  | Gatilho           | **O Colapso**                | FOME BRUTA = 100       |
| **C6**  | Gatilho           | **O Silêncio Branco**        | LUCIDEZ = 0            |
| **C7**  | Gatilho           | **A Chama do Inferno**       | VOZ DO DIABO = 100     |
| **C8**  | Gatilho           | **O Cerco**                  | RASTRO DE SANGUE = 100 |
| **C9**  | Fim (Game Over)   | **Estátua de Celulose**      | R3                     |
| **C10** | Fim (Game Over)   | **Linchamento**              | R5B                    |
| **C11** | Fim (Game Over)   | **Chumbo e Asfalto**         | R10 / RT4              |
| **C12** | Fim (Game Over)   | **Devorado de Dentro**       | C5 (RT1)               |
| **C13** | Fim (Alternativo) | **Fantasma de Vidro**        | C6 (RT2)               |
| **C14** | Fim (Alternativo) | **O Rei Rato**               | R7.1                   |
| **C15** | Fim (Alternativo) | **Açougueiro Corporativo**   | R8 ou R9               |
| **C16** | Fim (Canônico)    | **O Caco de Vidro**          | R11                    |

### Ramificações (Cenas Interativas)

| ID        | Nome                      | Acesso              |
| --------- | ------------------------- | ------------------- |
| **R1**    | O Bar                     | C1 → R1             |
| **R2**    | Ladrilhos                 | C2 → R2             |
| **R3**    | A Praia — Alucinação      | R2 → R3             |
| **R3.5**  | O Sol do Diabo            | C3 → R3.5           |
| **R4**    | O Beco                    | R3.5 → R4           |
| **R5A**   | Praça Camuflado           | R4 (com O1)         |
| **R5A.1** | Conversa com Zé São       | R5A → R5A.1         |
| **R5B**   | Praça Pânico              | R4 (sem O1)         |
| **R5C**   | A Cafeteria Quieta        | R5A (com O1 + O5)   |
| **R6**    | Lanchonete Frente         | R5A / R5C → R6      |
| **R6.1**  | O Balcão da Lanchonete    | R6 → R6.1           |
| **R7**    | Esgotos                   | R5B → R7            |
| **R7.1**  | A Galeria dos Ratos       | R7 → R7.1           |
| **R8**    | Lanchonete Fundos         | R6 / R7 / R7.1 → R8 |
| **R9**    | O Massacre                | C4 → R9             |
| **R10**   | As Escadas do Prédio      | R9 → R10            |
| **R11**   | O Telhado                 | R10 → R11           |
| **RT1**   | O Colapso (Cena)          | C5 → RT1            |
| **RT2**   | O Silêncio Branco (Cena)  | C6 → RT2            |
| **RT3**   | A Chama do Inferno (Cena) | C7 → RT3            |
| **RT3.1** | O Debate                  | RT3 → RT3.1         |
| **RT4**   | O Cerco (Cena)            | C8 → RT4            |
| **RT4.1** | O Espetáculo              | RT4 → RT4.1         |

---

## 🗺️ 4. FLUXO NARRATIVO DETALHADO

> Capítulos (`C`) e ramificações (`R`) estão dispostos na ordem de acionamento da narrativa principal. Capítulos são **cutscenes** (sem interação) e ramificações são **cenas interativas** (com parser).

---

### C1: Cândido e o Sol do Diabo (Abertura)

> **Tipo:** Cutscene (Tela Cinematográfica) — Início do jogo

> 🖼️ _Imagem: Um homem magro e careca sentado num banco de bar sujo, olhando pro nada. Luz amarela de lâmpada fraca. Fumaça e copos vazios._

> _"Cândido é bem magro e careca. De olhos opacos e pele seca como a de um lagarto. Veio de algum lugar quente, com uns trocados e uma mochila castigada. A cidade grande o mastigou e cuspiu num boteco de esquina. Agora é sexta-feira, e sete cachaças derretem sua cabeça."_

→ **Segue para: R1**

---

### R1: O Bar (Ramificação)

> _"A cidade bate primeiro e pergunta depois. O barulho do bar é um soco contínuo. Sete cachaças derreteram as suas ideias. O `<chão>` gruda na bota. O `<espelho>` na parede tá trincado, dividindo sua cara em duas. A `<cachaça>` no balcão te encara de volta. A `<porta>` é a saída. Se você conseguir levantar."_

| Verbo      | Alvo      | Requisito | Efeito                                                                                                                                                    | Resultado        |
| ---------- | --------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `examinar` | `chão`    | —         | _Muda Texto:_ "Chiclete preto, cigarro amassado e cuspe. O mosaico da sexta-feira."                                                                       | Permanece em R1  |
| `examinar` | `espelho` | —         | -10 LUCIDEZ / _Muda Texto:_ "Você vê um rosto cansado de ser seu. Daqui a pouco ele nem será."                                                            | Permanece em R1  |
| `examinar` | `cachaça` | —         | _Muda Texto:_ "Líquido âmbar turvo num copo gordo. Cheira a combustível barato. Uma dose a mais e o corpo vai decidir por você."                          | Permanece em R1  |
| `examinar` | `porta`   | —         | _Muda Texto:_ "Madeira inchada com marcas de unhas. A rua escura espera do outro lado. Parece que sair daqui não vai ser por bem — mas ficar também não." | Permanece em R1  |
| `beber`    | `cachaça` | —         | —                                                                                                                                                         | C2: O Corte → R2 |
| `abrir`    | `porta`   | —         | —                                                                                                                                                         | C2: O Corte → R2 |

---

### C2: O Corte (Transição)

> **Tipo:** Cutscene (Tela Cinematográfica) — R1 → R2

> 🖼️ _Imagem: Lâmina de serra brilhando num arco de luz de neon. Sangue espirrando nos ladrilhos preto-e-branco da calçada. Pés recuando._

> _"A oitava cachaça tomou conta e arranjou problema com um cabra. Num esbarrão torto, a faca de serra abriu seu próprio pescoço. O chão piscou em preto e vermelho. O sangue jorra grosso e quente. A cidade nem piscou."_

→ **Segue para: R2**

---

### R2: Ladrilhos (Ramificação)

> _"Você enfiou a cara na calçada. O chão pisca, preto, vermelho, preto, vermelho. Os `<ladrilhos>` têm o cheiro da cidade toda misturado com urina velha. As `<pernas>` das pessoas se agitam horrorizadas ao redor, como baratas gigantes, tentando proteger as calças do sangue derramado. Sua faca de serra abriu seu próprio pescoço num esbarrão torto."_

| Verbo         | Alvo        | Requisito | Efeito                                                                                                                                     | Resultado       |
| ------------- | ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| `examinar`    | `ladrilhos` | —         | _Muda Texto:_ "Preto e branco, iguais aos de corredor de hospital. Rachados e sujos. Um deles tem uma marca de mão arrastada em vermelho." | → R3            |
| `examinar`    | `pernas`    | —         | _Muda Texto:_ "Sapatos caros. Calças engomadas. Gente que nunca viu sangue de perto. Nenhuma dessas baratas vai te ajudar."                | Permanece em R2 |
| `pedir ajuda` | `pernas`    | —         | _Muda Texto:_ "As baratas vestem sapatos caros. Elas correm, desviando da poça que é você."                                                | → R3            |

---

### R3: A Praia - Alucinação (Ramificação)

> _"Tudo vira branco. Depois, azul. Uma toalha fina, uma `<loira>` de comercial e `<cervejas>` suando frio numa praia perfeitamente cristalina. O sol aqui não morde. A fome sumiu. A `<areia>` aquece as costas como um cobertor. A paz é tão artificial que dá enjoo."_

| Verbo      | Alvo       | Requisito | Efeito                                                                                                                                                                         | Resultado                    |
| ---------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `examinar` | `cervejas` | —         | _Muda Texto:_ "Garrafas suadas numa fileira perfeita demais. Rótulos sem marca. A espuma borbulha devagar como coisa viva. Beber pode matar a sede, mas aqui nada é de graça." | Permanece em R3              |
| `examinar` | `loira`    | —         | _Muda Texto:_ "Sorriso de plástico. Pele lisa demais. Ela não pisca. Parece uma boneca esperando alguém tocar a corda. Tem algo errado debaixo da superfície."                 | Permanece em R3              |
| `examinar` | `areia`    | —         | _Muda Texto:_ "Quente e macia. Parece que você pode deitar e nunca mais levantar. O tipo de conforto que mata devagar. ⚠️ Cuidado: descansar aqui pode custar tudo."           | Permanece em R3              |
| `beber`    | `cervejas` | —         | +20 FOME BRUTA / _Muda Texto:_ "A garrafa tá gelada, mas o líquido tem gosto de isopor. A fome rasga de novo."                                                                 | Permanece em R3              |
| `dormir`   | `areia`    | —         | —                                                                                                                                                                              | **C9: Estátua de Celulose**  |
| `tocar`    | `loira`    | —         | —                                                                                                                                                                              | C3: O Rasgo da Ilusão → R3.5 |

---

### C3: O Rasgo da Ilusão (Transição)

> **Tipo:** Cutscene (Tela Cinematográfica) — R3 → R3.5

> 🖼️ _Imagem: Uma praia de areia branca se dissolvendo como açúcar em água fervente. Por trás, uma luz amarela brutal comendo tudo._

> _"Os dedos tocaram a loira e ela derreteu. A praia inteira se desfez como cenário de papelão rasgado. O paraíso de isopor rachou e por trás apareceu uma luz amarela bruta — o sol do diabo, queimando tudo que era mentira. Cândido acordou no inferno de volta."_

→ **Segue para: R3.5**

---

### R3.5: O Sol do Diabo (Ramificação)

> _"O sol te achou. A `<luz amarela>` engoliu tudo — parede, chão, você. A mala sumiu. A pele arde como plástico derretendo. Passou a mão no pescoço e a `<cicatriz>` respondeu. Grossa. Viva. Tentou gritar mas a boca só abriu. Nem som, nem cheiro. Só calor. E um fôlego na nuca que não é seu. Tem `<alguém>` ali. Na luz. Parado como poste. Sorrindo sem ter boca."_

| Verbo      | Alvo          | Requisito | Efeito                                                                                                                                                                  | Resultado         |
| ---------- | ------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `examinar` | `luz amarela` | —         | -10 LUCIDEZ / _Muda Texto:_ "A luz cega e queima as memórias da sua infância."                                                                                          | Permanece em R3.5 |
| `examinar` | `cicatriz`    | —         | _Muda Texto:_ "Um talho grosso de orelha a orelha. As bordas não cicatrizam — tremem, como lábios tentando falar. Pulsa no ritmo de algo que não é o seu coração."      | Permanece em R3.5 |
| `examinar` | `alguém`      | —         | _Muda Texto:_ "Uma silhueta parada na luz. Sem rosto, sem forma. Mas tem peso. Tem vontade. Parece te conhecer de antes de você nascer. Correr pode ser a única opção." | Permanece em R3.5 |
| `tocar`    | `cicatriz`    | —         | +10 VOZ DO DIABO / _Muda Texto:_ "Ela pulsa grossa. O ritmo bate igual ao fôlego na sua nuca."                                                                          | Permanece em R3.5 |
| `berrar`   | `alguém`      | —         | +15 VOZ DO DIABO / _Muda Texto:_ "Nenhum som sai. Mas a presença na luz parece sorrir mais largo."                                                                      | Permanece em R3.5 |
| `correr`   | `luz amarela` | —         | —                                                                                                                                                                       | → R4              |

---

### R4: O Beco (Ramificação)

> _"O cheiro de ferro enferrujado acordou alguma coisa nas suas tripas. O `<cadáver>` ensanguentado esparramado no chão do beco parece obra de um açougueiro amador. Uma `<poça>` grossa escorre mole pro ralo. Um `<pôster>` rasgado chora na parede de tijolo sujo. A `<rua>` iluminada grita buzinas lá na frente."_

| Verbo       | Alvo      | Requisito       | Efeito                                                                                                                                                                             | Resultado       |
| ----------- | --------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `examinar`  | `cadáver` | —               | +10 VOZ DO DIABO / _Muda Texto:_ "O rosto tá uma pasta. Alguém chegou primeiro. E esse alguém tava com raiva. As roupas parecem intactas — talvez valha a pena revirar os bolsos." | Permanece em R4 |
| `vasculhar` | `cadáver` | —               | -20 LUCIDEZ / +15 VOZ DO DIABO / 🎒 Adiciona: **Jaqueta**, **Carteira**                                                                                                            | Permanece em R4 |
| `examinar`  | `poça`    | —               | +15 VOZ DO DIABO / _Muda Texto:_ "O sangue escuro reflete algo com chifres tortos. Não é a sua cara."                                                                              | Permanece em R4 |
| `ler`       | `pôster`  | —               | +10 LUCIDEZ / _Muda Texto:_ "Um circo que passou na cidade há anos. Coisas normais. Mundo velho."                                                                                  | Permanece em R4 |
| `examinar`  | `rua`     | —               | _Muda Texto:_ "Luz de poste amarelada e gente passando rápido. Se sair assim, com o pescoço aberto, vai virar atração de circo. Precisa de algo pra esconder o estrago."           | Permanece em R4 |
| `ir`        | `rua`     | **Jaqueta** 🎒  | —                                                                                                                                                                                  | → R5A           |
| `ir`        | `rua`     | _(sem Jaqueta)_ | —                                                                                                                                                                                  | → R5B           |

---

### R5A: Praça Camuflado (Ramificação)

> _"A jaqueta esconde o desastre no seu pescoço. Você é só mais um fantasma na multidão. A `<estátua>` caga bronze e vigia o caos surdo. O artista `<Zé São>` joga facas com uma tranquilidade irritante. O povo aplaude como macacos amestrados. A `<lanchonete>` brilha letreiros de neon. Tem um `<boné>` jogado no banco."_

| Verbo      | Alvo         | Requisito | Efeito                                                                                                                                                                                             | Resultado        |
| ---------- | ------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `examinar` | `estátua`    | —         | _Muda Texto:_ "Um herói sem rosto. Pombos defecam no ombro de quem já morreu."                                                                                                                     | Permanece em R5A |
| `examinar` | `boné`       | —         | _Muda Texto:_ "Boné de aba curva, encardido e esquecido num banco. Parece do tipo que faz um rosto sumir na multidão. Junto com a jaqueta, daria pra entrar em qualquer lugar sem chamar atenção." | Permanece em R5A |
| `examinar` | `lanchonete` | —         | _Muda Texto:_ "Letreiros de neon piscam vermelho e amarelo. O cheiro de gordura queimada chega daqui. Um chapeiro gordo se mexe lá dentro. Sua barriga ronca."                                     | Permanece em R5A |
| `pegar`    | `boné`       | —         | 🎒 Adiciona: **Boné de Aba**                                                                                                                                                                       | Permanece em R5A |
| `assistir` | `Zé São`     | —         | _Muda Texto:_ "A lâmina corta o ar. Ele não erra. Parece ter pacto com o vento."                                                                                                                   | Permanece em R5A |
| `falar`    | `Zé São`     | —         | —                                                                                                                                                                                                  | → R5A.1          |
| `ir`       | `lanchonete` | —         | —                                                                                                                                                                                                  | → R6             |

---

### R5A.1: Conversa com Zé São (Ramificação de Diálogo)

> _"Você chega perto quando os macacos amestrados vão embora. Zé São guarda as lâminas. Encara sua alma furada. 'Você não tem pulso, irmão', ele murmura de lado, com cara de quem cheirou pólvora. 'O que você quer da minha vida?'"_

| Verbo       | Alvo       | Requisito | Efeito                                                                                                   | Resultado          |
| ----------- | ---------- | --------- | -------------------------------------------------------------------------------------------------------- | ------------------ |
| `perguntar` | `cidade`   | —         | +10 LUCIDEZ / _Muda Texto:_ "'A cidade mastiga os fracos', diz ele. 'E vomita bicho ruim igual a você'." | Permanece em R5A.1 |
| `mostrar`   | `cicatriz` | —         | +20 VOZ DO DIABO / _Muda Texto:_ "Ele recua, pálido. 'O diabo te assinou. Tira o pé daqui.'"             | → R5A              |
| `despedir`  | `Zé São`   | —         | —                                                                                                        | → R5A              |

---

### R5B: Praça Pânico (Ramificação)

> _"Você sai na luz com o pescoço pingando miúdos. Como num desenho animado mal desenhado, a `<multidão>` congela, solta gritos esganiçados e recua. Logo começam a puxar tijolos e garrafas quebradas. Um `<bueiro>` te olha da calçada, aberto e faminto."_

| Verbo       | Alvo       | Requisito | Efeito                                                                                                                                                 | Resultado            |
| ----------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| `examinar`  | `multidão` | —         | _Muda Texto:_ "Olhos arregalados. Mandíbulas caídas. Uns trinta rostos que já viraram juízes. Tijolos e garrafas nas mãos. Enfrentar isso é suicídio." | Permanece em R5B     |
| `examinar`  | `bueiro`   | —         | _Muda Texto:_ "A tampa tá arreganhada. O fedor sobe podre. Mas a escuridão lá embaixo não julga, não aponta, não grita. É uma saída."                  | Permanece em R5B     |
| `enfrentar` | `multidão` | —         | -30 LUCIDEZ / +40 RASTRO                                                                                                                               | **C10: Linchamento** |
| `entrar`    | `bueiro`   | —         | —                                                                                                                                                      | → R7                 |

---

### R5C: A Cafeteria Quieta (Ramificação)

_(Acesso: Jaqueta + Boné)_

> _"A jaqueta e o boné enganam os trouxas. Você parece gente. Uma `<cafeteria>` de merda tá aberta. O `<jornal>` tá largo na mesa cheirando a café velho. O `<espelho>` atrás da máquina de espresso reflete um manequim morto. Você."_

| Verbo      | Alvo        | Requisito       | Efeito                                                                                                                                                          | Resultado        |
| ---------- | ----------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `examinar` | `cafeteria` | —               | _Muda Texto:_ "Mesas de fórmica descascada e uma máquina de espresso que range. Cheiro de café velho e pão amanhecido. Um abrigo temporário de normalidade."    | Permanece em R5C |
| `examinar` | `espelho`   | —               | +20 VOZ DO DIABO / _Muda Texto:_ "A cicatriz pula. O coração não bate, mas o pescoço respira."                                                                  | Permanece em R5C |
| `examinar` | `jornal`    | —               | _Muda Texto:_ "Páginas amareladas. Manchete sobre mortes no centro. Uma foto borrada de um beco que você reconhece. O mundo registra o horror e vira a página." | Permanece em R5C |
| `ler`      | `jornal`    | —               | _Muda Texto:_ "A manchete chia miúdo: 'Série de mortes no centro'. Ninguém liga de verdade."                                                                    | Permanece em R5C |
| `pedir`    | `café`      | **Carteira** 🎒 | +10 LUCIDEZ / _Muda Texto:_ "O preto quente queima a língua mole. Parece que ainda tem um fiozinho de vida aí dentro."                                          | Permanece em R5C |
| `sair`     | `rua`       | —               | —                                                                                                                                                               | → R6             |

---

### R6: Lanchonete Frente (Ramificação)

> _"O `<chapeiro>` frita hambúrgueres de costas. A gordura chia igual rádio fora do ar. A artéria no pescoço do homem pula grossa. Tum, tum, tum. Hipnótico. Você pode pedir o `<cardápio>` ou chamar a porra da atenção dele."_

**Nota:** Pedir o cardápio duas vezes eleva FOME BRUTA a 100, disparando RT1.

| Verbo      | Alvo       | Requisito       | Efeito                                                                                                                                                                           | Resultado       |
| ---------- | ---------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `examinar` | `chapeiro` | —               | _Muda Texto:_ "Ombros largos, avental sujo. A artéria no pescoço do homem pulsa grossa — hipnótica. Ele não te viu. De costas assim, vulnerável, qualquer coisa pode acontecer." | Permanece em R6 |
| `examinar` | `cardápio` | —               | _Muda Texto:_ "Cartolina encardida com letras apagadas. Hambúrguer, X-tudo, batata. Tudo custa dinheiro que talvez você nem tenha mais."                                         | Permanece em R6 |
| `examinar` | `cozinha`  | —               | _Muda Texto:_ "Uma portinha de vai-e-vem entreaberta. Dá pra ver prateleiras e lixo enlatado. Se entrar por ali, chega nos fundos sem que ninguém veja."                         | Permanece em R6 |
| `falar`    | `chapeiro` | —               | —                                                                                                                                                                                | → R6.1          |
| `pedir`    | `cardápio` | **Carteira** 🎒 | +30 FOME BRUTA / _Muda Texto:_ "A carne do lanche tem gosto de papelão. Você mastiga isopor."                                                                                    | Permanece em R6 |
| `atacar`   | `chapeiro` | —               | -30 LUCIDEZ / +40 RASTRO                                                                                                                                                         | → R9            |
| `ir`       | `cozinha`  | —               | —                                                                                                                                                                                | → R8            |

---

### R6.1: O Balcão da Lanchonete (Ramificação de Diálogo)

> _"O chapeiro vira. A cara gorda pingando óleo e suor. O avental de lona tá sujo com uma mancha esquisita. Ele encosta as patas no balcão e olha torto pra sua jaqueta fudida. 'Noite longa, parceiro?', ele raspa a garganta. 'Vai querer ração de quê?'"_

| Verbo       | Alvo       | Requisito    | Efeito                                                                                                                | Resultado         |
| ----------- | ---------- | ------------ | --------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `pedir`     | `comida`   | **Carteira** | +30 FOME BRUTA / _Muda Texto:_ "Mastigar não adianta. A fome verdadeira tá comendo o estômago de dentro pra fora."    | → R6              |
| `perguntar` | `sangue`   | —            | +15 VOZ DO DIABO / _Muda Texto:_ "Ele arrota uma risada. 'É de boi, amigão. Fresco. Do abatedouro.' Sua boca saliva." | Permanece em R6.1 |
| `ignorar`   | `chapeiro` | —            | —                                                                                                                     | → R6              |

---

### R7: Esgotos (Ramificação)

> _"Um túnel de concreto podre. O vômito da cidade inteira escorre pelas paredes. Uma `<inscrição>` de tinta velha grita na parede torta. A `<grade>` nos fundos aponta pra rua de cima. Mais pra baixo, a `<escuridão>` te convida pra entrar num buraco sem fundo. Esgoto é o intestino do mundo."_

| Verbo       | Alvo        | Requisito | Efeito                                                                                                                                              | Resultado       |
| ----------- | ----------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `examinar`  | `inscrição` | —         | _Muda Texto:_ "Letras tortas de spray vermelho. Alguém escreveu isso com pressa e medo. Tem um desenho tosco de um sol com dentes ao lado."         | Permanece em R7 |
| `examinar`  | `lixo`      | —         | _Muda Texto:_ "Pilha de lodo, plástico e merda. Algo brilha metálico no meio da podridão. Pode valer a pena enfiar a mão."                          | Permanece em R7 |
| `examinar`  | `grade`     | —         | _Muda Texto:_ "Grade de ferro enferrujada. Dá pra ver luz de rua do outro lado. Leva pra superfície — provavelmente pros fundos de algum comércio." | Permanece em R7 |
| `examinar`  | `escuridão` | —         | _Muda Texto:_ "Um buraco sem fundo que chupa a luz. O ar que vem de lá é mais frio e cheira a bicho molhado. Ir mais fundo é arriscar não voltar."  | Permanece em R7 |
| `ler`       | `inscrição` | —         | +10 VOZ DO DIABO / _Muda Texto:_ "'O rato engoliu o sol'. Pichação de profeta bêbado."                                                              | Permanece em R7 |
| `vasculhar` | `lixo`      | —         | 🎒 Adiciona: **Faca Enferrujada** / _Muda Texto:_ "Uma lâmina torta escondida na merda."                                                            | Permanece em R7 |
| `seguir`    | `escuridão` | —         | -20 LUCIDEZ / +15 VOZ DO DIABO                                                                                                                      | → R7.1          |
| `abrir`     | `grade`     | —         | —                                                                                                                                                   | → R8            |

---

### R7.1: A Galeria dos Ratos (Ramificação)

> _"O chão mexe. São ratos. Centenas de ratinhos espertos vigiando os seus tornozelos de defunto. Um `<cano>` de chumbo boia na bosta líquida. O fundo do cano é uma `<escuridão>` grossa, que chupa toda a luz da cidade lá em cima."_

| Verbo      | Alvo        | Requisito | Efeito                                                                                                                                                  | Resultado           |
| ---------- | ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `examinar` | `cano`      | —         | _Muda Texto:_ "Um pedaço de cano de chumbo, grosso como braço. Boia na bosta líquida. Pesado o suficiente pra arrebentar uma fechadura — ou um crânio." | Permanece em R7.1   |
| `examinar` | `escuridão` | —         | _Muda Texto:_ "O túnel se afunila até virar boca. Os ratos se amontoam na beirada como plateia de circo. Ninguém que entrou ali voltou pra contar."     | Permanece em R7.1   |
| `pegar`    | `cano`      | —         | 🎒 Adiciona: **Pedaço de Cano** / _Muda Texto:_ "Pesado. Frio. Um argumento forte."                                                                     | Permanece em R7.1   |
| `seguir`   | `escuridão` | —         | -20 LUCIDEZ / +20 VOZ DO DIABO                                                                                                                          | **C14: O Rei Rato** |
| `voltar`   | `grade`     | —         | —                                                                                                                                                       | → R8                |

---

### R8: Lanchonete Fundos (Ramificação)

> _"A tampa do bueiro te cospe na despensa. Gordura velha. O `<chapeiro>` tá lá na frente de costas, alheio à podridão. Uma `<prateleira>` capenga exibe lixo enlatado. Um pote de picles. Nada demais."_

| Verbo        | Alvo         | Requisito               | Efeito                                                                                                                                          | Resultado                       |
| ------------ | ------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `examinar`   | `chapeiro`   | —                       | _Muda Texto:_ "De costas. Alheio. A nuca gorda brilha de suor. O avental sobe e desce com a respiração. Se tiver uma lâmina, é agora ou nunca." | Permanece em R8                 |
| `examinar`   | `prateleira` | —                       | _Muda Texto:_ "Sal. Vinagre. Uma barata passeando de férias. Tudo inútil."                                                                      | Permanece em R8                 |
| `assassinar` | `chapeiro`   | **Faca Enferrujada** 🎒 | -30 LUCIDEZ / +20 RASTRO                                                                                                                        | **C15: Açougueiro Corporativo** |
| `ir`         | `frente`     | —                       | —                                                                                                                                               | C4 → R9                         |

---

### C4: O Demônio Sangrento (Transição)

> **Tipo:** Cutscene (Tela Cinematográfica) — Entrada em R9

> 🖼️ _Imagem: Uma silhueta ensanguentada sob luz de neon vermelha. Paredes pintadas de sangue. Sombras retorcidas no chão molhado._

> _"O bicho saiu. A fome, a raiva, a voz — tudo virou uma coisa só. Cândido não está mais no volante. O demônio sangrento pinta a cidade de vermelho. O que sobrou de humano assiste de dentro, preso, enquanto o corpo opera no automático. O sangue virou tinta e a parede virou tela."_

→ **Segue para: R9**

---

### R9: O Massacre (Ramificação)

> _"O ar cheira a cobre quente. Um `<rádio>` toca uma musiquinha imbecil, sorrindo de tudo. Longe dali, três homens de `<ternos>` te observam fumando. Eles não estão nem aí pro caos. Um `<prédio>` aponta pro céu, com a porta de vidro arreganhada."_

| Verbo      | Alvo     | Requisito | Efeito                                                                                                                                                                     | Resultado                       |
| ---------- | -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `examinar` | `rádio`  | —         | _Muda Texto:_ "Caixa de plástico rachada, sintonizada numa FM qualquer. A musiquinha imbecil ricocheteia nas paredes sujas. Desligá-lo talvez devolva um fio de sanídade." | Permanece em R9                 |
| `examinar` | `ternos` | —         | _Muda Texto:_ "Três sombras de gravata e sapato lustrado. Fumam charuto e observam você como se assistissem a um programa de auditório. Não têm medo. Têm interesse."      | Permanece em R9                 |
| `examinar` | `prédio` | —         | _Muda Texto:_ "Torre cinza de concreto cru. A porta de vidro tá arreganhada como boca de morto. Escadas lá dentro. Se subir rápido, talvez escape antes do cerco fechar."  | Permanece em R9                 |
| `desligar` | `rádio`  | —         | +10 LUCIDEZ / _Muda Texto:_ "O silêncio é pior. Agora os gemidos mortos aparecem mais vivos."                                                                              | Permanece em R9                 |
| `atacar`   | `ternos` | —         | -30 LUCIDEZ / +30 VOZ DO DIABO / +50 RASTRO                                                                                                                                | **C15: Açougueiro Corporativo** |
| `fugir`    | `prédio` | —         | —                                                                                                                                                                          | → R10                           |

---

### R10: As Escadas do Prédio (Ramificação)

> _"O pé bate no degrau. Respira. Sangra. Bate no degrau. As sirenes cantam pneu lá fora, latindo fino. A `<porta>` pro telhado não quer abrir. Trancada pra burro. Uma `<janela>` lateral te mostra o asfalto. Vazio. Sem rede de segurança."_

| Verbo      | Alvo      | Requisito             | Efeito                                                                                                                                                  | Resultado                 |
| ---------- | --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `examinar` | `porta`   | —                     | _Muda Texto:_ "Ferro pesado com três fechaduras. Trancada por fora. Nem chute adianta. Só algo de peso bruto arrebentaria essa merda. Um cano, talvez." | Permanece em R10          |
| `examinar` | `janela`  | —                     | _Muda Texto:_ "Vidro sujo mostrando o asfalto lá embaixo. Uns três andares. Tem uma marquise no caminho. Dá pra pular, mas o preço vai ser alto."       | Permanece em R10          |
| `quebrar`  | `porta`   | **Pedaço de Cano** 🎒 | —                                                                                                                                                       | → R11                     |
| `pular`    | `janela`  | —                     | +20 VOZ DO DIABO / +20 RASTRO / _Muda Texto:_ "O corpo tomba mole na marquise. Quebrou algo, mas e daí? Você levanta."                                  | → R11                     |
| `esperar`  | `polícia` | —                     | —                                                                                                                                                       | **C11: Chumbo e Asfalto** |

---

### R11: O Telhado (Ramificação)

> _"O ar corta o rosto. O sol é uma gema de ovo podre. Uma voz que não vem de lugar nenhum assobia na orelha: 'Todo mundo é bicho de abatedouro. Você morreu, Cândido. E só por isso eu te escolhi.' O `<asfalto>` lá embaixo chama teu nome."_

| Verbo      | Alvo       | Requisito | Efeito                                                                                                                                                                      | Resultado                             |
| ---------- | ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `examinar` | `asfalto`  | —         | _Muda Texto:_ "Lá embaixo, o chão espera de braços abertos. Sem rede. Sem colão. Só o fim. O vento empurra você pra beirada como convite."                                  | Permanece em R11                      |
| `examinar` | `voz`      | —         | _Muda Texto:_ "Não vem de fora. Vibra na costela, no osso do crânio, na ferida do pescoço. É você — ou o que sobrou de você — falando com o bicho que se mudou pra dentro." | Permanece em R11                      |
| `examinar` | `cicatriz` | —         | +30 VOZ DO DIABO / _Muda Texto:_ "Um corte de ponta a ponta. Um sorriso no gogó. Ninguém vive com isso."                                                                    | Permanece em R11                      |
| `pular`    | `asfalto`  | —         | —                                                                                                                                                                           | **C16: O Caco de Vidro**              |
| `aceitar`  | `voz`      | —         | _Muda Texto:_ "O amarelo engole o prédio. Você ri pro chão lá embaixo."                                                                                                     | **C16: O Caco de Vidro** _(variante)_ |

---

## ⚡ 5. CENAS DE GATILHO (6 cenas — todas genéricas)

> **Regra de ouro:** Nenhuma cena de gatilho menciona local, personagem nomeado ou objeto específico. Elas descrevem exclusivamente o estado interno de Cândido ou uma situação abstrata, garantindo coerência narrativa independente de onde o gatilho for disparado.

---

### C5 / RT1: O Colapso (Capítulo Gatilho — FOME BRUTA = 100)

> **Tipo:** Cutscene + Cena Interativa — Dispara quando FOME BRUTA atinge 100

> 🖼️ _Imagem: Tela vermelha sangrenta. Mãos tremendo cobertas de algo escuro e quente. Visão embaçada._

> _"A fome estourou a barragem. O vermelho tomou conta da visão. O corpo assumiu o controle enquanto a mente apagou. Quando Cândido voltou a si, as mãos estavam quentes e sujas de algo que ele preferiu não saber."_

> _"Ninguém bate na porta. A fome arrebenta a dobradiça e invade a sala. O vermelho come as beiradas da tua visão. O corpo assume o volante. O branco apaga o rastro. Não sobrou nada na memória. Só gosto de cobre nos dentes. Você volta a si. De pé. Não sabe que dia é, não sabe quem é. Suas `<mãos>` estão quentes pra caralho."_

| Verbo      | Alvo   | Efeito                                                                                    | Resultado                   |
| ---------- | ------ | ----------------------------------------------------------------------------------------- | --------------------------- |
| `examinar` | `mãos` | _Muda Texto:_ "O cheiro sobe. Você decide que é melhor não investigar de quem é o resto." | → R9                        |
| `recusar`  | `tudo` | —                                                                                         | **C12: Devorado de Dentro** |

---

### C6 / RT2: O Silêncio Branco (Capítulo Gatilho — LUCIDEZ = 0)

> **Tipo:** Cutscene + Cena Interativa — Dispara quando LUCIDEZ atinge 0

> 🖼️ _Imagem: Tela branca estática. Silhueta translucida caminhando sem direção numa rua vazia._

> _"O cérebro desligou. Sem nome, sem memória, sem vontade. O corpo virou autômato — as pernas se movendo por inércia, arrastando o fantasma que já foi Cândido por ruas sem sentido."_

> _"O cérebro desligou o disjuntor. Chega. Não tem nome. Não tem calçada. Não tem dor. O corpo balança as pernas por inércia, como um zumbi de corda rumo a lugar nenhum. A mente evaporou como mijo quente no asfalto. Um `<caminho>` qualquer estica os dedos pro seu pé."_

| Verbo       | Alvo      | Efeito                                                                                                                                                             | Resultado                      |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| `examinar`  | `caminho` | _Muda Texto:_ "Uma linha reta de asfalto e lixo. Não tem destino, não tem placa. Os pés se arrastam sozinhos. O corpo sabe o caminho, a cabeça já não manda nada." | Permanece em RT2               |
| `continuar` | `caminho` | —                                                                                                                                                                  | → R9 _(o corpo segue sozinho)_ |
| `parar`     | `tudo`    | —                                                                                                                                                                  | **C13: Fantasma de Vidro**     |

---

### C7 / RT3: A Chama do Inferno (Capítulo Gatilho — VOZ DO DIABO = 100)

> **Tipo:** Cutscene + Cena Interativa — Dispara quando VOZ DO DIABO atinge 100

> 🖼️ _Imagem: Chamas alaranjadas subindo por dentro de um corpo. Olhos brilhando amarelo. Sombra com chifres projetada na parede._

> _"A voz do diabo não fala mais de fora. Ela é Cândido. Ocupou cada canto da cabeça, cada nervo, cada pensamento. O pacto está feito — falta só a assinatura."_
> _"A `<voz>` não sussurra de fora. Ela nasce nas entranhas. Ocupa o lugar que a alma largou na calçada._
>
> _'Você mete medo neles. Larga a mão. Na tua terra tu era farelo de terra seca. Aqui, tu é caco de vidro cortando pé de bacana.'_
>
> _A voz não faz pergunta. Ela bate o carimbo. E espera você assinar."_

| Verbo      | Alvo   | Efeito                                                                                                                                                                        | Resultado                         |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `examinar` | `voz`  | _Muda Texto:_ "Não é som. É pressão. Como se alguém apertasse o cérebro por dentro. Fala em português de sertão, com sotâco de enxofre. Conhece seu nome. Conhece sua raiva." | Permanece em RT3                  |
| `aceitar`  | `voz`  | +30 FOME BRUTA                                                                                                                                                                | → R11 _(atalho direto ao clímax)_ |
| `recusar`  | `voz`  | +30 LUCIDEZ                                                                                                                                                                   | → RT3.1: O Debate                 |
| `ignorar`  | `tudo` | —                                                                                                                                                                             | Retorna à cena anterior           |

---

### RT3.1: O Debate (Ramificação - Filha de RT3)

> _"'Por que eu?' escapa do buraco do teu pescoço. A voz mastiga as palavras antes de responder._
>
> _'Por causa da raiva na tua morte. Porque não tem ninguém pra rezar por você. É assim que o capeta escolhe os apóstolos.'_
>
> _A ferida lateja apertado. Cada vez que o bicho fala de dentro de ti, a tua carne acende."_

| Verbo      | Alvo      | Efeito                         | Resultado                         |
| ---------- | --------- | ------------------------------ | --------------------------------- |
| `aceitar`  | `destino` | —                              | → R11 _(atalho direto ao clímax)_ |
| `desafiar` | `voz`     | +20 LUCIDEZ / -20 VOZ DO DIABO | Retorna à cena anterior           |

---

### C8 / RT4: O Cerco (Capítulo Gatilho — RASTRO DE SANGUE = 100)

> **Tipo:** Cutscene + Cena Interativa — Dispara quando RASTRO DE SANGUE atinge 100

> 🖼️ _Imagem: Sirenes vermelhas e azuis refletindo no asfalto molhado. Sombras de policiais armados cercando um beco._

> _"O sangue deixou trilha grossa demais. A polícia, os vigias, os cidadãos de bem — todos cercaram o monstro. A cidade inteira sabe o nome do bicho. A caça acabou."_
> _"Mágica urbana. O vazio vira um inferno num segundo. O `<cerco>` tá armado. De farda, à paisana, revólver e cacete. Não importa. O seu sangue desenhou um rastro grosso pra qualquer idiota seguir. A caça acabou._
>
> _Sempre tem uma `<saída>`. Mas a porta tem dente."_

| Verbo       | Alvo    | Efeito                                                                                                                                            | Resultado                        |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `examinar`  | `cerco` | _Muda Texto:_ "Fardas, revólveres, cacetes. Uns vinte, talvez trinta. Alguns tremem. Outros querem sangue. O medo deles é tão real quanto o seu." | Permanece em RT4                 |
| `examinar`  | `saída` | _Muda Texto:_ "Um beco, uma brecha na barricada. Estreito. Se correr agora, talvez passe antes de fecharem. Mas vai custar lucidez."              | Permanece em RT4                 |
| `fugir`     | `saída` | -40 LUCIDEZ                                                                                                                                       | → R10 _(atalho para as escadas)_ |
| `enfrentar` | `cerco` | —                                                                                                                                                 | → RT4.1: O Espetáculo            |
| `render`    | `tudo`  | —                                                                                                                                                 | **C11: Chumbo e Asfalto**        |

---

### RT4.1: O Espetáculo (Ramificação - Filha de RT4)

> _"O monstro levanta o pelo. Eles recuam de nojo. Você rasga o cerco, e a cada passo a cidade aprende seu nome em código Morse de bala e osso quebrado. E aí... o silêncio. Sozinho de novo. O `<caminho>` tá livre. E o `<chão>` é teu trono."_

| Verbo      | Alvo      | Efeito                                                                                                                                                     | Resultado                                                    |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `examinar` | `caminho` | _Muda Texto:_ "Rua vazia. Vidro quebrado. O silêncio pesa como chumbo. Pra frente, as luzes da cidade continuam piscando como se nada tivesse acontecido." | Permanece em RT4.1                                           |
| `examinar` | `chão`    | _Muda Texto:_ "Concreto frio, rachado e sujo de tudo. Mas é sólido. Firme. O único lugar onde o corpo pode descansar sem cair."                            | Permanece em RT4.1                                           |
| `seguir`   | `caminho` | —                                                                                                                                                          | → R9 _(se ainda não passou)_ / → R10 _(se já passou por R9)_ |
| `sentar`   | `chão`    | +20 LUCIDEZ / _Muda Texto:_ "Você deita a bunda no frio de concreto. O silêncio bate no tímpano."                                                          | → R11 _(atalho direto)_                                      |

---

## 🏁 6. FINAIS (Cutscenes de Encerramento)

| ID      | Nome                       | Tipo              | Descrição da Cutscene                                                                                                                                                                                                                                                                                      |
| ------- | -------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C9**  | **Estátua de Celulose**    | Fim (Game Over)   | 🖼️ _Homem deitado numa praia branca, olhos fechados, sorrindo pro nada. Ondas de isopor lambem os pés._ — Cândido adormeceu na areia quente da alucinação. O corpo relaxou. A mente apagou. E nunca mais voltou. Ficou ali, estátua de celulose numa praia que não existe, sorrindo pro nada.              |
| **C10** | **Linchamento**            | Fim (Game Over)   | 🖼️ _Multidão furiosa com tijolos e garrafas. Corpo caído no asfalto._ — A multidão não perdoa o que não entende. Tijolos e garrafas choveram. O monstro de pescoço aberto tombou no asfalto, coberto pelo ódio de gente comum.                                                                             |
| **C11** | **Chumbo e Asfalto**       | Fim (Game Over)   | 🖼️ _Luzes de sirene. Corpo nas escadas de concreto. Furos de bala no peito._ — As sirenes cantaram mais alto que qualquer oração. Chumbo perfurou o que já estava morto. Cândido caiu nas escadas do prédio, olhando pro teto como se fosse o céu. Não era.                                                |
| **C12** | **Devorado de Dentro**     | Fim (Game Over)   | 🖼️ _Silhueta escura se contorcendo, consumida por sombras internas. Vermelho pulsante._ — A fome ganhou. O corpo se virou contra si mesmo, roendo de dentro pra fora. Cândido recusou o que se tornara, mas a recusa não apaga o monstro — só o deixa com mais fome.                                       |
| **C13** | **Fantasma de Vidro**      | Fim (Alternativo) | 🖼️ _Figura translucida parada no meio da rua. Carros passam através dela._ — Sem lucidez, sem identidade, sem dor. Cândido parou no meio da rua e deixou de existir. Não morreu — evaporou. Um fantasma de vidro que a cidade atravessa sem perceber.                                                      |
| **C14** | **O Rei Rato**             | Fim (Alternativo) | 🖼️ _Silhueta desaparecendo nos esgotos escuros. Ratos abrindo caminho._ — A escuridão dos esgotos engoliu Cândido como se o estivesse esperando. Os ratos abriram caminho. Lá embaixo, no intestino da cidade, ele encontrou seu trono de merda e concreto.                                                |
| **C15** | **Açougueiro Corporativo** | Fim (Alternativo) | 🖼️ _Homens de terno apertando a mão de uma figura ensanguentada. Neon frio._ — O sangue virou moeda de troca. Os homens de terno viram potencial no monstro. Cândido ganhou emprego. Açougueiro corporativo. A violência agora tem CNPJ e recibo.                                                          |
| **C16** | **O Caco de Vidro**        | Fim (Canônico)    | 🖼️ _Corpo caindo do telhado contra um sol amarelo brutal. Sombra girando no ar._ — O telhado. O sol amarelo. O vento. Cândido olhou pra baixo e viu o asfalto sorrindo. Pulou. O corpo girou no ar como um caco de vidro refletindo o sol do diabo. Lá embaixo, o impacto. Lá em cima, a voz: "Bem-vindo." |

---

## 📊 7. RESUMO ESTRUTURAL

| Categoria                        | Quantidade                                                        |
| -------------------------------- | ----------------------------------------------------------------- |
| Capítulos (Cutscenes)            | 16 (C1–C16)                                                       |
| Ramificações (Cenas Interativas) | 20 (R1–R11 + R5A.1 + R5C + R6.1 + R7.1 + RT1–RT4 + RT3.1 + RT4.1) |
| Objetos Coletáveis               | 5 (O1–O5)                                                         |
| Rastreadores                     | 4                                                                 |
| Finais                           | 8 (C9–C16)                                                        |

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
