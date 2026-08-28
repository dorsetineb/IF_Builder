# IF Builder — Introdução e Guia Geral

Bem-vindo ao **IF Builder**, uma plataforma visual completa para criar e publicar **Ficções Interativas** — narrativas ricas onde o leitor toma decisões, explora cenários visuais, investiga objetos, resolve enigmas e dita os rumos da história.

---

## 🧭 O que você pode criar no IF Builder?

O IF Builder une a profundidade das clássicas aventuras de texto (*Text Adventures / Z-Machine*) com a imersão de jogos de apontar e clicar (*Point-and-Click / HyperCard*):

| Formato | Experiência de Jogo |
|---------|---------------------|
| **Narrativa Textual (Parser)** | O jogador digita comandos livres como `pegar chave`, `examinar quadro`, `abrir porta`. |
| **Narrativa de Escolhas (CYOA)** | O jogador clica em links e opções de decisão dinâmicas que ramificam a história. |
| **Cenários Visuais (Point-and-Click)** | O jogador navega por ilustrações com **Vistas** e **Áreas Interativas (Hotspots)** clicáveis. |
| **Experiências Híbridas** | Mistura de exploração visual, descrições literárias, testes de sorte com dados e trilha sonora. |

---

## 🗂️ Estrutura do Editor e Menu Lateral

O IF Builder organiza seu fluxo de trabalho através do **menu lateral esquerdo**. Os capítulos deste tutorial seguem exatamente essa ordem para facilitar seu aprendizado:

```
┌─────────────────────────────────────────────────────────────┐
│  Cabeçalho Superior (Novo / Salvar / Carregar / Preview)   │
├───────────────────┬─────────────────────────────────────────┤
│ Menu Lateral      │ Área de Edição e Criação                │
│                   │                                         │
│ 📖 Narrativa      │ • Editor de Ramificações e Capítulos    │
│ 🎛️ Mecânicas      │ • Editor de Cenários e Vistas           │
│ 🎨 Estilo Visual  │ • Ajustes de Sistemas, Inventário, etc. │
│ 🔤 Rótulos        │                                         │
│ 📦 Objetos        │                                         │
│ 📈 Rastreadores   │                                         │
│ 💬 Verbos         │                                         │
│ ───────────────── │                                         │
│ 🗺️ Mapa de Ramos  │                                         │
│ 🚀 Exportação     │                                         │
└───────────────────┴─────────────────────────────────────────┘
```

---

## 📚 Índice dos Módulos do Tutorial

| Módulo | Tema Principal | Descrição |
|--------|----------------|-----------|
| [**01 — Criando seu Projeto**](./01-criando-projeto.md) | Configuração Inicial | Criação de nova ficção, metadados e primeiro capítulo. |
| [**02 — Narrativa: Capítulos e Ramos**](./02-narrativa-capitulos-e-ramos.md) | Escrita e Ramificação | Capítulos cinematográficos, ramos de texto e marcação `<palavra>`. |
| [**03 — Cenários e Vistas**](./03-cenarios-e-vistas.md) | Point-and-Click Visual | Criação de Cenários, Vistas, desenho de Hotspots e transições. |
| [**04 — Mecânicas e Sistemas**](./04-mecanicas-e-sistemas.md) | Regras de Jogo | Modos de interação, inventário, rolagem de dados e diário. |
| [**05 — Estilo Visual**](./05-estilo-visual.md) | Personalização de UI | Temas visuais, paletas de cores, tipografia e efeitos de tela (chuva/neve). |
| [**06 — Rótulos**](./06-rotulos.md) | Textos e Mensagens | Customização de botões do sistema, avisos e mensagens do parser. |
| [**07 — Objetos e Inventário**](./07-objetos-e-inventario.md) | Gestão de Itens | Biblioteca de itens, propriedades, sinônimos e coletabilidade. |
| [**08 — Interações e Gatilhos**](./08-interacoes-e-parser.md) | Lógica e Respostas | Criação de regras, comandos aceitos, condições e consequências. |
| [**09 — Rastreadores (Trackers)**](./09-trackers.md) | Variáveis Numéricas | Saúde, sanidade, tempo, moedas e telas de derrota/vitória. |
| [**10 — Verbos Globais**](./10-verbos.md) | Comandos Universais | Comandos que funcionam em qualquer ponto do jogo (`ajuda`, `olhar`, etc.). |
| [**11 — Mapa de Ramificações**](./11-mapa-de-ramificacoes.md) | Visualização em Grafo | Organização visual de nós, conexões e caminhos narrativos. |
| [**12 — Exportação e Publicação**](./12-exportacao-e-publicacao.md) | Compartilhamento | Geração de pacote Web `.zip` autônomo e instaladores Desktop. |
| [**13 — Projeto Exemplo Completo**](./13-projeto-completo-exemplo.md) | Guia Prático Integrado | Passo a passo criando a ficção completa *"A Chave do Farol"*. |

---

## 🚀 Próximo Passo

Comece criando o seu primeiro projeto no IF Builder:

→ [**Módulo 01 — Criando seu Projeto**](./01-criando-projeto.md)
