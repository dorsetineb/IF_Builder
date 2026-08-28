# Módulo 03 — Cenários e Vistas (Point-and-Click)

**Tutorial: A Chave do Farol**  
Tempo estimado: 12–16 minutos

---

## Objetivo deste módulo

Neste módulo você vai aprender a usar o sistema de **Cenários e Vistas**:
- Compreender o conceito de Cenários e Vistas (estilo *Point-and-Click / HyperCard*)
- Criar um nó do tipo **Cenário** no seu projeto
- Adicionar múltiplas **Vistas** (ângulos e perspectivas visuais)
- Desenhar **Áreas Interativas (Hotspots)** com formas retangulares, circulares e poligonais
- Configurar ações ricas: navegação entre vistas, exame de pistas, coleta de itens e alteração de rastreadores
- Aplicar estilos de realce, cursores temáticos, sons e condições de bloqueio com chave

---

## O que são Cenários e Vistas?

Um **Cenário** é um nó narrativo de exploração visual. Em vez de depender apenas de comandos digitados, o jogador interage diretamente com o ambiente clicando em elementos da imagem.

```
┌──────────────────────────────────────────────────────────────┐
│ CENÁRIO: Sala das Máquinas                                   │
│                                                              │
│ ┌──────────────────────┐   Clique no Painel   ┌────────────┐ │
│ │ Vista 1: Visão Geral ├─────────────────────>│ Vista 2:   │ │
│ │                      │                      │ Painel de  │ │
│ │ • [Porta] -> Sai     │                      │ Controle   │ │
│ │ • [Engrenagens]      │                      │ • [Alavanca│ │
│ └──────────────────────┘                      └────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

- **Cenário**: O contêiner do local ou ambiente.
- **Vistas**: As diferentes imagens/ângulos daquele ambiente (ex: visão geral, close-up da mesa, detalhe do cofre).
- **Hotspots (Áreas Interativas)**: Regiões desenhadas sobre a imagem que disparam ações ao serem clicadas.

---

## Passo 1 — Criar um Novo Cenário

1. Na barra lateral, clique em **"Narrativa"**.
2. No topo da lista de cenas, clique em **"Criar Capítulo ou Ramificação"** → **Cenário**.
3. Dê o nome de **"Oficina do Faroleiro"**.

O editor abrirá a interface especializada do **HyperCard Stack Editor**.

---

## Passo 2 — Adicionar e Gerenciar Vistas

No painel esquerdo do editor de cenários, você encontra a **Lista de Vistas**:

1. A primeira vista é criada automaticamente (**Vista 1**). Clique em **"Trocar Imagem"** e faça upload de uma ilustração da oficina.
2. Renomeie a vista para **"Visão Geral da Oficina"**.
3. Clique no botão **"+ Criar Vista"** para adicionar uma segunda vista:
   - Nome: **"Bancada de Ferramentas"**
   - Imagem: Ilustração aproximada da mesa com ferramentas e gavetas.
4. Você pode definir qual vista é a **"Vista Inicial"** clicando no ícone de estrela/início.

---

## Passo 3 — A Barra de Ferramentas do Canvas

No topo da imagem de edição, você tem acesso às ferramentas de desenho:

| Ferramenta | Atalho | Como Usar |
|------------|--------|-----------|
| **Mover / Selecionar** | `V` | Clica em hotspots existentes para selecioná-los, movê-los ou redimensioná-los pelas alças. |
| **Retângulo** | `R` | Clique e arraste sobre a imagem para criar uma área retangular. |
| **Círculo** | `C` | Clique e arraste para desenhar uma área circular ou elíptica. |
| **Polígono Livre** | `P` | Clique em pontos sucessivos para contornar objetos irregulares. Dê **duplo clique** ou clique no ponto inicial para fechar a forma. |
| **Zoom In / Zoom Out** | Botões | Amplia ou reduz a imagem para posicionar detalhes com precisão cirúrgica. |
| **Testar Áreas** | Botão | Ativa a simulação em tempo real para clicar e testar sem sair do editor. |
| **Revelar Zonas** | `Espaço` | Mantendo pressionado, destaca todas as áreas desenhadas para conferência visual. |

---

## Passo 4 — Configurar as Propriedades do Hotspot

Ao selecionar qualquer hotspot no canvas, o **Painel do Inspetor** à direita exibe três abas de configuração:

### 1. Aba Visual
- **Rótulo / Tooltip**: Texto que aparece ao passar o cursor (ex: `Gaveta de Madeira`).
- **Estilo de Realce**:
  - *Invisível*: O hotspot fica oculto na tela (ideal para exploração e puzzles investigativos).
  - *Brilho ao passar o mouse*: Efeito suave de luz ao posicionar o cursor sobre o item.
  - *Borda sutil permanente*: Delimitação visual discreta.
  - *Marcador Pulsante (Pin)*: Exibe um ícone animado com cor personalizada (ex: ícone de lupa, olho, engrenagem ou mão).
- **Cursor do Mouse**: Escolha cursores temáticos (*Olho para observar*, *Lupa para investigar*, *Mão para interagir*, *Setas direcionais*, etc.).
- **Efeito Sonoro**: Carregue um áudio curto de clique ou rangido mecânico.

### 2. Aba Ação
Escolha o que acontece quando o jogador clica:

| Tipo de Ação | Configuração | Uso Comum |
|--------------|--------------|-----------|
| **Mudar de Vista** | Selecione a vista de destino e a transição (*Fade, Slide, Zoom, Blur*). | Entrar em close-ups de gavetas, mesas ou outros cantos da sala. |
| **Navegar para Outro Nó** | Selecione uma Ramificação ou Capítulo do projeto. | Portas de saída, escadarias e passagens entre cômodos. |
| **Examinar** | Digite Título, Texto descritivo e imagem opcional de close-up. | Ler cartas, diários, examinar quadros e mecanismos sem sair da cena. |
| **Coletar Objeto** | Escolha o objeto da biblioteca e digite a mensagem de feedback. | Pegar chaves, ferramentas ou relíquias e guardá-las no inventário. |
| **Alterar Rastreador** | Escolha o Tracker (ex: Saúde) e o valor (+1 ou -1). | Armadilhas, poções de cura ou ganho de moedas. |

### 3. Aba Condições
- **Requer Item no Inventário**: O jogador só conseguirá executar a ação se possuir determinado item (ex: requer `Chave de Bronze`).
- **Consumir Item ao Usar**: Remove a chave do inventário após o destrancamento (opcional).
- **Mensagem de Bloqueio**: Texto exibido caso o jogador tente interagir sem o item necessário (ex: `A gaveta está trancada por um cadeado enferrujado.`).

---

## Passo 5 — Exemplo Prático de Configuração

Na nossa cena **"Oficina do Faroleiro"**:

1. Na **Visão Geral da Oficina**, selecione a ferramenta Retângulo (`R`) e desenhe uma área sobre a mesa.
   - *Ação*: **Mudar de Vista** → Destino: `Bancada de Ferramentas` (Transição: `Zoom`).
2. Na **Bancada de Ferramentas**, desenhe um polígono (`P`) sobre um frasco de óleo:
   - *Ação*: **Coletar Objeto** → Selecionar `Frasco de Óleo`.
   - *Texto da Ação*: `Você recolhe o frasco de óleo lubrificante. Será útil para destravar mecanismos emperrados.`
3. Desenhe um retângulo na borda inferior da tela:
   - *Rótulo*: `Voltar` (Cursor: `Seta para Baixo`).
   - *Ação*: **Mudar de Vista** → Destino: `Visão Geral da Oficina`.

---

## Barra de Ações Integrada

Ao jogar em um Cenário, os controles globais do jogo permanecem disponíveis no topo da tela:
- 🎒 **Inventário**: Abertura rápida do menu de itens coletados.
- 📜 **Diário**: Histórico de ações e leituras.
- 📊 **Rastreadores**: Status atualizado de vidas/recursos.
- ⚙️ **Sistema**: Salvar, carregar e opções de volume.

---

## ✅ Checklist do Módulo 03

- [ ] Cenário "Oficina do Faroleiro" criado
- [ ] Vistas "Visão Geral" e "Bancada de Ferramentas" cadastradas com imagens
- [ ] Hotspots de navegação entre as vistas desenhados e testados
- [ ] Hotspot de coleta do "Frasco de Óleo" configurado com feedback
- [ ] Modo de Teste utilizado para validar as transições e cliques

---

## Próximo passo

Descubra como personalizar os sistemas de jogo e modos de decisão:

→ [**Módulo 04 — Mecânicas e Sistemas**](./04-mecanicas-e-sistemas.md)
