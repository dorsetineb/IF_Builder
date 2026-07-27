# 🎲 Especificação e Plano de Implementação: Sistema de Rolagem de Dados (Dice Rolling)

## 📌 Contexto e Objetivos

O sistema de **Rolagem de Dados** no IF Builder é uma funcionalidade adicional para interações em cenas. Ela permite adicionar mecânicas de sorte/azar (RPG) em situações onde o jogador não sabe exatamente como agir, ou deseja arriscar uma ação que pode levar a consequências variadas (falhas críticas, sucessos, desastres ou acertos críticos).

---

## 🎯 Requisitos da Funcionalidade

1. **Configuração por Interação**:
   - Cada interação na cena pode ter o recurso de rolagem ativado via toggle (`enableDiceRoll`).
   - O autor do jogo pode escolher o tipo de dado: **D4, D6, D8, D10, D12, D20 ou D100**.

2. **Faixas de Consequência (Outcome Ranges)**:
   - Suporte a $N$ faixas de valores (ex: `1-3` = Desastre, `4-11` = Falha, `12-19` = Sucesso, `20` = Acerto Crítico).
   - Validação no editor garantindo cobertura contínua dos valores de 1 até o máximo do dado (sem lacunas).

3. **Consequências Configuráveis por Faixa**:
   - Cada faixa de resultado suporta o mesmo conjunto de outcomes de uma interação padrão:
     - Mensagem de atualização da cena (`successMessage`)
     - Mudança de ramificação/cena (`goToScene`)
     - Alteração em rastreadores (`trackerEffects`)
     - Adição/remoção de itens do inventário (`addsToInventory`, `removesTargetFromScene`)
     - Efeitos sonoros por faixa (`soundEffect`)

4. **Experiência Visual no Runtime (Player UX)**:
   - Modal/overlay com animação visual do dado girando.
   - Destaque claro do número sorteado e da faixa alcançada.
   - Suporte duplo:
     - **Modo Escolha (Choice Mode)**: Exibe ícone/badge de dado no botão da escolha.
     - **Modo Texto (Parser Mode)**: Abre o modal animado ao interpretar a palavra-chave/verbo do jogador.

---

## 🏗️ Alterações na Arquitetura e Estrutura de Arquivos

### 1. Tipos Globais (`src/types.ts`)
- Adição dos tipos `DiceType` e `DiceOutcomeRange`.
- Extensão da interface `Interaction`.

### 2. Editor de Interações (`src/components/InteractionEditor.tsx`)
- Seção expansível "🎲 Rolagem de Dados".
- Form de inclusão/edição de faixas com validação visual de intervalos contínuos (1 a Max).

### 3. Prepara Dados para a Engine (`src/components/game-engine.ts`)
- Inclusão dos campos de dados na sanitização e empacotamento do `embeddedGameData`.

### 4. Runtime / Game Engine (`src/components/gameJS.ts`)
- Criação das funções de renderização do modal de dados (`renderDiceModal`, `rollDice`).
- Atualização do dispatcher de comandos e escolhas (`processCommand`, `executeInteraction`, `choice click`).

### 5. Estilização (`src/index.css`)
- Estilos CSS para o modal de dados, animação de giro (keyframes/flip), badge nos botões do modo escolha e feedback de crítico.

---

## 🔍 Plano de Verificação e Testes

1. **Testes Unitários/Build**:
   - `npm run build` para garantir ausência de erros de TypeScript e compilação limpa.
2. **Verificação no Editor**:
   - Criar uma nova cena com interação com D20.
   - Adicionar 3 faixas (`1-5`, `6-14`, `15-20`).
   - Verificar aviso de validação caso haja lacunas no intervalo.
3. **Verificação no Runtime do Jogo**:
   - Testar rolagem no Modo Texto e no Modo Escolha.
   - Confirmar animação do dado e aplicação correta das consequências de cada faixa.
