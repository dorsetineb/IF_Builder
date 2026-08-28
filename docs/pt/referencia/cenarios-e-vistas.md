# Referência — Cenários e Vistas (Point-and-Click)

O módulo de **Cenários e Vistas** permite criar ambientes visuais ricos no estilo *Point-and-Click Adventure / HyperCard*, onde o jogador explora cenas desenhadas, coleta itens, examina pistas e transita entre ângulos de câmera (Vistas) ao clicar em áreas interativas (Hotspots).

---

## 1. Estrutura de Dados do Cenário

- **Cenário (`hypercard_stack`)**: Nó de primeira classe no mapa narrativo contendo uma coleção de Vistas.
- **Vista (`HyperCard`)**: Cada cartão visual que compõe o cenário. Possui imagem de fundo, título, transição e uma coleção de Hotspots.
- **Área Interativa (`CardHotspot`)**: Região desenhada sobre a imagem da vista com geometria, estilo visual, cursores e ações programadas.

---

## 2. Ferramentas do Canvas de Desenho

| Ferramenta | Tecla de Atalho | Comportamento |
|------------|-----------------|---------------|
| **Mover / Selecionar** | `V` | Seleciona hotspots existentes, permite arrasto e redimensionamento pelas 8 alças. |
| **Retângulo** | `R` | Desenha regiões retangulares clicando e arrastando. |
| **Círculo** | `C` | Desenha regiões elípticas/circulares. |
| **Polígono Livre** | `P` | Cria formas geométricas livres com múltiplos vértices. Fechamento por duplo clique ou clique no nó inicial. |
| **Pan (Mover Tela)** | `Espaço + Arrastar` | Desloca a área visível do canvas. |
| **Revelar Zonas** | `Espaço` (segurar) | Destaca todas as áreas interativas no modo de edição/teste. |

---

## 3. Tipos de Ação dos Hotspots

1. **Mudar de Vista (`navigate_card`)**:
   - Transita para outra vista dentro do mesmo cenário.
   - Suporte a transições: `fade`, `slide-left`, `slide-right`, `slide-up`, `slide-down`, `zoom`, `blur`, `none` (corte seco).
2. **Navegar para Nó do Mapa (`navigate_scene`)**:
   - Sai do cenário e leva o jogador para uma Ramificação de Texto ou Capítulo do projeto.
3. **Examinar (`examine`)**:
   - Abre um modal de exame in-place com título, texto detalhado e imagem opcional de close-up.
4. **Coletar Objeto (`collect_item`)**:
   - Adiciona o item selecionado ao inventário do jogador e exibe mensagem de feedback com miniatura.
5. **Alterar Rastreador (`toggle_tracker`)**:
   - Adiciona ou subtrai valor em contadores ativos (ex: Vida, Sanidade, Ouro).

---

## 4. Estilos de Realce Visual

- `Invisível`: Sem realce (ideal para jogos investigativos e exploração pura).
- `Brilho ao passar o mouse (Hover Glow)`: Contorno suave e luminoso ao passar o cursor.
- `Borda sutil permanente`: Delimitação discreta com linhas finas.
- `Realce visível permanente`: Área destacada constantemente.
- `Marcador Pulsante (Pin)`: Marcador animado com ícone e cores de fundo/borda personalizáveis.

---

## 5. Requisitos e Condições de Bloqueio

- **Requer Item no Inventário**: Impede a execução da ação se o jogador não possuir determinado objeto.
- **Consumir Item ao Usar**: Remove o item do inventário após o uso bem-sucedido.
- **Mensagem de Bloqueio**: Mensagem exibida caso a condição não seja atendida.
