# 🎲 Especificação e Plano de Implementação: Sistema de Rolagem de Dados (Dice Rolling)

## 📌 Contexto e Objetivos

O sistema de **Rolagem de Dados** no IF Builder é uma funcionalidade global que introduz mecânicas de sorte/azar (RPG). O resultado da rolagem de dados (D6 ou D20) é associado diretamente como um **verbo acionável** (ex: `dice:6`, `dice:20` ou faixas como `dice:1-5`).

Desta forma, as interações do jogo continuam funcionando normalmente segundo a arquitetura padrão do IF Builder, sem necessidade de estruturas de dados complexas ou formulários aninhados adicionais.

---

## 🎯 Requisitos da Funcionalidade

1. **Ativação e Configuração na Aba Mecânicas**:
   - A funcionalidade é ativada globalmente no projeto através da aba **Mecânicas** (`UIEditor` -> Tab Sistemas/Mecânicas).
   - O autor do jogo pode habilitar o recurso (`enableDiceRoll`) e selecionar o **Tipo de Dado** a ser utilizado em todo o jogo:
     - **D6** (Dado de 6 lados, intervalo `1-6`)
     - **D20** (Dado de 20 lados, intervalo `1-20`)

2. **Texto Padrão Customizável (Aba Textos)**:
   - Na aba **Textos** do editor, o autor pode customizar o prefixo da mensagem de resultado da rolagem (ex: `"Você tirou"`, gerando logs como `"Você tirou 6"`).

3. **Verbos de Rolagem de Dados em Interações**:
   - As interações utilizam o editor de interações padrão do IF Builder.
   - Para vincular uma interação a um resultado de rolagem, basta adicionar verbos do tipo:
     - `dice:20` (dispara quando o dado sorteia 20)
     - `dice:6` (dispara quando o dado sorteia 6)
     - `dice:1-5` ou `dice:1..5` (dispara para qualquer resultado entre 1 e 5)
   - Todas as propriedades normais da interação funcionam como sempre: mudar de ramificação (`goToScene`), atualizar descrição (`successMessage`), efeitos em rastreadores (`trackerEffects`), inventário (`addsToInventory`, `removesTargetFromScene`), áudio (`soundEffect`), etc.

4. **Execução no Runtime (Player UX & Animação)**:
   - **Disparo da Rolagem**: Ocorre quando o jogador digita um comando de rolagem (ex: `"rolar"`, `"dado"`, `"rolar dado"`), clica em uma opção de rolagem ou aciona o teste.
   - **Animação em Overlay**: É exibida uma animação de rolagem de dados em overlay por cima da área de texto.
   - **Log de Resultado**: Após revelar o número sorteado $R$, é impresso um log normal na história no formato `"{prefixo} {R}"` (ex: `"Você tirou 6"`).
   - **Execução da Interação**: Imediatamente após o log, a engine localiza a interação na ramificação atual correspondente a `dice:{R}` e a executa normalmente.

5. **Funcionamento Standalone e Offline**:
   - 100% offline, executado no runtime nativo standalone (`gameJS.ts`).
   - Zero dependências externas.

---

## 🏗️ Alterações na Arquitetura

### 1. Tipos Globais (`src/types.ts`)
- Configurações globais `enableDiceRoll`, `diceType` ('d6' | 'd20'), `diceRollTextPrefix`.

### 2. Editor de Interface (`src/components/UIEditor.tsx`)
- Configuração do toggle e tipo de dado na aba Mecânicas e do prefixo na aba Textos.

### 3. Editor de Interações (`src/components/InteractionEditor.tsx`)
- Mantém o formulário padrão e limpo de interações, apenas com dica informativa para verbos `dice:X`.

### 4. Runtime (`src/components/gameJS.ts`)
- Função `triggerDiceRoll()`: sorteia o número, toca a animação overlay, registra o log `"Você tirou X"` e executa a interação associada ao verbo `dice:X` ou `dice:min-max`.
