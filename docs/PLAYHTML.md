# 🧠 Brainstorm: Espaços Comunitários no IF Builder com playhtml

### Contexto

O IF Builder precisa de mecanismos de interação entre autores que sejam:
- **Perenes** — persistem entre sessões, acumulam rastros de visitantes anteriores
- **Não-textuais** — sem chat, sem digitação livre; interação gestual/por clique
- **Com espírito de "traço humano"** — como marcas em Dark Souls ou um contador de presença

O [playhtml](https://github.com/dorsetineb/playhtml) fornece elementos HTML colaborativos com persistência e sincronização em tempo real, sem backend próprio. Recursos-chave disponíveis:

| Recurso playhtml | O que faz |
|---|---|
| **`can-move`** | Arrastar elementos, posição persiste para todos |
| **`can-toggle`** | Clicar alterna estado (on/off), persiste |
| **`can-grow`** | Cada clique aumenta a escala do elemento |
| **`can-spin`** | Arrastar gira o elemento |
| **`can-duplicate`** | Clicar duplica o elemento no DOM |
| **`can-mirror`** | Espelha um elemento externo (embed colaborativo) |
| **Page-level data** | Dados persistentes por página (contadores, listas, votos) via `createPageData` / `usePageData` |
| **Presence & Cursors** | Mostra quem está online na mesma página em tempo real |
| **Events** | Broadcasts efêmeros (fire-and-forget) — confetes, pings visuais |
| **Shared elements** | Estado compartilhado *entre páginas e domínios diferentes* |

---

## Opção A: 🕯️ Santuário de Velas — "Acenda uma vela pelo seu jogo favorito"

**Conceito:** Uma seção da página onde cada autor pode "acender" uma vela-emoji clicando. Cada vela acesa persiste, cresce levemente com cada clique adicional de outros visitantes (`can-grow`), e pode ser arrastada para posicioná-la no "altar" (`can-move`). O resultado é um altar vivo que vai se enchendo de velas ao longo do tempo — visitantes antigos deixaram velas grandes e bem posicionadas, novatos acabaram de chegar e adicionaram as suas.

**Como funciona tecnicamente:**
- Cada vela é um emoji 🕯️ com `can-grow` + `can-move` + `can-duplicate`
- O visitante clica numa vela-template para criar a sua (duplicate), depois a posiciona (move)
- Outros visitantes podem "alimentar" a chama clicando na vela de outro (grow)
- `Page-level data` para contar total de velas acesas

✅ **Pros:**
- Visual poético e imediatamente compreensível
- Incentiva retorno — "minha vela ainda está lá?"
- Zero barreira de entrada — é só clicar
- Acumulativo: quanto mais autores passam, mais bonito fica

❌ **Cons:**
- Pode ficar visualmente caótico com muitas velas
- Sem identificação do autor por trás de cada vela (anônimo)
- `can-duplicate` cria elementos em runtime que precisam de IDs estáveis via `selector-id`

📊 **Effort:** Low

---

## Opção B: 🧭 Bússola de Gêneros — "Para onde aponta sua criatividade?"

**Conceito:** Uma rosa dos ventos visual onde cada ponto cardeal representa um gênero/tema de ficção interativa (Norte=Terror, Sul=Romance, Leste=Sci-Fi, Oeste=Fantasia, e intermediários). Os visitantes arrastam uma peça-marcador (`can-move`) para o gênero que estão explorando. O acúmulo de marcadores em certas regiões revela *organicamente* o que a comunidade está criando — sem pesquisas, sem formulários. É um mapa de calor gestual.

**Como funciona tecnicamente:**
- Rosa dos ventos renderizada como SVG/imagem de fundo
- N marcadores-emoji (🔮, ⚔️, 🚀, 🌹) com `can-move` confinados a um container
- `Page-level data` armazena contadores por região para analytics
- Cursor `Presence` mostra quem está arrastando em tempo real

✅ **Pros:**
- Produz dados úteis sobre a comunidade (tendências de gênero)
- Fortemente temático — perfeito para IF Builder
- Visualmente rico e interativo
- Cada visita contribui com informação real

❌ **Cons:**
- Requer design cuidadoso para manter legível com muitos marcadores
- Marcadores podem ser movidos por trolls (shift-click reseta, mas é parcial)
- Precisa definir número fixo de marcadores vs. criação dinâmica

📊 **Effort:** Medium

---

## Opção C: 🌱 Jardim de Sementes — "Plante uma ideia, regue a de outro"

**Conceito:** Um canteiro visual onde cada autor "planta" uma semente clicando (uma nova flor-emoji aparece via `can-duplicate`). Outros autores podem "regar" qualquer flor clicando nela (`can-grow`), fazendo-a crescer em escala. As flores mais regadas ficam visivelmente maiores — um indicador orgânico de popularidade/afinidade. Periodicamente (ou via link), o dono do IF Builder pode ver quais "regiões" do jardim têm mais atividade.

**Como funciona tecnicamente:**
- Grid de canteiros com flores-emoji (🌱→🌿→🌻→🌳) usando `can-grow` + `can-duplicate`
- Escala do `can-grow` mapeia para estágios visuais (CSS classes por threshold)
- `Page-level data` com array de sementes + contadores de rega
- `Events` para broadcast de confete quando uma flor atinge tamanho máximo 🎉

✅ **Pros:**
- Metáfora linda e intuitiva — "regar ideias"
- Feedback visual progressivo (flor cresce = mais interação)
- Incentiva visitas recorrentes para "cuidar" do jardim
- Events + confete cria momentos de celebração compartilhada

❌ **Cons:**
- Mais complexo de implementar (estágios visuais condicionais)
- Sem vínculo direto com jogos/projetos do IF Builder — é mais atmosférico
- Crescimento ilimitado pode distorcer o layout

📊 **Effort:** Medium-High

---

## Opção D: 🎲 Totem de Dados — "Empilhe seu dado no totem"

**Conceito:** Uma torre vertical (como um totem inuit ou um cairn de pedras) onde cada visitante adiciona um "bloco" representando sua passagem. Cada bloco é um dado/poliedro-emoji (🎲) que pode ser girado (`can-spin`) para mostrar uma face/atitude. A torre cresce para cima com cada novo visitante. É uma versão silenciosa e visual de "X pessoas estiveram aqui" — mas em vez de um número, é uma escultura colaborativa.

**Como funciona tecnicamente:**
- Bloco-template com `can-spin` + `can-duplicate` empilhado verticalmente (CSS flex column-reverse)
- `can-spin` permite que cada pessoa gire seu dado para uma rotação que a represente
- `Page-level data` conta total de blocos + histórico de timestamps
- Container com scroll para quando a torre ficar alta
- Presence mostra quem está girando dados em tempo real

✅ **Pros:**
- Extremamente tematizado para jogos/RPG
- Cada bloco é único pela rotação que o visitante escolheu
- Visual marcante — uma torre que cresce sozinha
- Baixa barreira: um clique para adicionar, um arraste para girar

❌ **Cons:**
- Layout vertical pode competir com o design da página
- Sem informação funcional — é puramente presença/atmosfera
- Precisa limitar altura ou paginar

📊 **Effort:** Low-Medium

---

## Opção E: ⭐ Constelação de Autores — "Deixe sua estrela no céu"

**Conceito:** Um canvas escuro simulando um céu noturno onde cada visitante pode posicionar uma estrela-emoji (`can-move`). As estrelas brilham (`can-toggle` para alternar brilho) e acumulam-se ao longo do tempo. Quando duas estrelas ficam próximas, uma "linha de constelação" é desenhada entre elas via CSS/SVG — criando constelações emergentes que ninguém planejou. O efeito é que a comunidade literalmente "desenha padrões no céu" juntos sem coordenação verbal.

**Como funciona tecnicamente:**
- Div com background escuro, overflow hidden, posição relativa
- Cada estrela ✨ com `can-move` + `can-toggle` (toggle = brilho/pulsar)
- `can-duplicate` para cada visitante criar sua estrela
- `Page-level data` registra coordenadas das estrelas
- Script de proximidade (CSS ou JS) desenha linhas SVG entre estrelas vizinhas
- `Shared elements` potencial para mostrar a mesma constelação em múltiplas páginas

✅ **Pros:**
- O mais visualmente deslumbrante — estrelas num céu escuro
- Padrões emergentes geram surpresa e encantamento
- Perfeito para autores criativos — é criar arte juntos
- Shared elements permite constelação global cruzando páginas

❌ **Cons:**
- Complexidade técnica mais alta (cálculo de proximidade, SVG dinâmico)
- Pode ficar saturado com muitos pontos
- Requer mais polish para ficar bonito de verdade

📊 **Effort:** High

---

## Opção F: 🪨 Cairn Trail — "Empilhe uma pedra, marque o caminho"

**Conceito:** Inspirado nos cairns de trilha (pilhas de pedra que marcam caminhos em montanhas), os autores empilham pedras-emoji ao longo de uma "trilha" horizontal na página. Cada pedra pode ser posicionada (`can-move`) ao longo do caminho. Quando alguém clica numa pedra existente, ela cresce (`can-grow`), indicando que "mais alguém passou por aqui e confirmou o caminho". É uma metáfora de *wayfinding* — autores marcando caminhos para outros autores.

**Como funciona tecnicamente:**
- Container horizontal com background de trilha
- Pedras 🪨 com `can-move` + `can-grow` + `can-duplicate`
- Movimento restrito ao eixo horizontal (constraint do can-move)
- `Page-level data` com contador "pedras empilhadas"
- Integração com `Presence` para mostrar quem está empilhando agora

✅ **Pros:**
- Metáfora de "marcar caminho" alinha perfeitamente com IF (ficção interativa = caminhos)
- Simples e elegante — sem overengineering
- O crescimento das pedras cria hierarquia visual natural
- Funciona bem em mobile (arraste horizontal)

❌ **Cons:**
- Menos "wow factor" que opções visuais mais elaboradas
- Metáfora pode não ser óbvia para quem não conhece cairns
- Eixo horizontal pode conflitar com layouts responsivos

📊 **Effort:** Low-Medium

---

## 🔒 Considerações de Segurança (via Vulnerability Scanner)

| Vetor | Risco | Mitigação |
|---|---|---|
| **Dados no PartyKit** | Não criptografados, acessíveis por room name | Usar room names não-guessable; aceitar dados como "decorativos" sem PII |
| **XSS via can-duplicate** | Elementos duplicados podem herdar atributos | Sanitizar templates; nunca duplicar conteúdo com HTML livre do usuário |
| **Spam/DoS** | Visitante pode criar milhares de duplicatas | Implementar rate-limit no cliente e max-count no Page-level data |
| **Email harvesting** | Se coletar emails (sua sugestão original) | ⚠️ EVITAR coletar emails via playhtml — dados não são criptografados. Usar form separado com backend seguro se necessário |
| **State manipulation** | Qualquer visitante pode alterar qualquer estado | Aceitar como característica (é "playground"), não como bug. Reset periódico se necessário |

> [!WARNING]
> O playhtml armazena dados no PartyKit **sem criptografia**, e qualquer pessoa com o room name pode acessá-los. **Nunca armazene PII** (emails, nomes reais) via playhtml. Para coletar contatos, use um formulário backend separado.

---

## 💡 Recomendação

**Opção D (Totem de Dados) + Opção A (Santuário de Velas)** como combo.

### Por quê?

1. **Totem de Dados** é tematicamente perfeito para o IF Builder (RPG, jogos, poliedros) e tem esforço baixo-médio com alto impacto visual. É a peça central.

2. **Santuário de Velas** funciona como complemento atmosférico em uma segunda seção — é trivial de implementar e tem uma qualidade emocional que engaja autores criativos.

3. Juntos, oferecem dois "gestos" diferentes: **empilhar** (contribuição) e **acender/regar** (validação dos outros), cobrindo os dois lados da interação comunitária.

4. Ambos têm esforço combinado **Medium** e usam apenas capabilities built-in (`can-grow`, `can-spin`, `can-move`, `can-duplicate`) sem custom elements.

### Alternativa premium

Se houver mais tempo e ambição, a **Opção E (Constelação)** é a que mais encantaria visualmente — mas requer investimento técnico significativamente maior.
