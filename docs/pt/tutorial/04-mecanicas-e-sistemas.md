# Módulo 04 — Mecânicas e Sistemas

**Tutorial: A Chave do Farol**  
Tempo estimado: 8–12 minutos

---

## Objetivo deste módulo

Neste módulo você vai aprender a configurar os sistemas centrais da sua ficção através da página **"Mecânicas"** no menu lateral esquerdo:
- Alternar entre modos de interação (**Parser**, **Escolhas** ou **Híbrido**)
- Configurar o sistema de **Inventário** e limites de carga
- Configurar o sistema de **Rolagem de Dados e Chances**
- Configurar o **Diário de Bordo** para registro das ações do jogador
- Ajustar animações de texto, transições de menus e efeitos sonoros
- Utilizar o painel de **Pré-visualização em Tempo Real**

---

## Acesso à Página de Mecânicas

No menu lateral esquerdo do IF Builder, clique no segundo item: 🎛️ **Mecânicas**.

A tela é dividida em duas áreas principais:
1. **Painel de Configuração (Esquerda):** Controles, seletores e interruptores de sistemas.
2. **Painel de Pré-visualização (Direita):** Uma maquete viva e interativa que reflete instantaneamente todas as alterações feitas.

---

## 1. Modo de Interação e Decisão

O IF Builder permite escolher como o jogador expressa suas vontades no jogo:

| Modo de Interação | Como Funciona | Quando Usar |
|-------------------|---------------|-------------|
| **Parser (Linha de Comando)** | O jogador digita ações livremente no campo de texto (ex: `examinar chave`, `abrir porta com chave`). | Aventuras de investigação, mistério e clássicos de texto interativo. |
| **Decisões / Escolhas (CYOA)** | Opções em botões ou links que avançam para caminhos específicos. | Histórias rápidas, romances visuais e jogos focados em escolhas narrativas. |
| **Ambos (Híbrido)** | Combina a digitação livre com botões de atalho e sugestões de ação. | Acessibilidade máxima para diferentes perfis de jogadores. |

---

## 2. Sistema de Inventário

O Inventário permite que o jogador carregue itens coletados pelo mundo:

- **Habilitar Inventário**: Ativa o ícone de mochila/bolsa no topo da interface.
- **Capacidade Máxima (Peso / Slots)**:
  - Deixe em `0` ou desativado para capacidade infinita.
  - Defina um valor numérico (ex: `5 kg` ou `6 itens`) para exigir que o jogador gerencie o espaço.
- **Mensagem de Inventário Vazio**: Texto amigável exibido quando o jogador abre o inventário sem carregar itens (ex: `Suas mãos e bolsos estão vazios no momento.`).
- **Exibição Visual**: Os itens aparecem com título, quantidade, peso e miniatura da ilustração (caso o objeto possua imagem cadastrada).

---

## 3. Sistema de Rolagem de Dados e Chances

Ideal para ficções com elementos de RPG, combates ou testes de sorte/habilidade:

- **Tipo de Dado**: Suporte a dados clássicos (`1d6`, `1d20`, `1d100`).
- **Botão de Rolagem**:
  - *Texto do Botão*: ex: `Rolar Dados de Destino`
  - *Cores Customizadas*: Cor de fundo, cor do texto e cor ao passar o mouse.
- **Modificadores e Regras de Sucesso**:
  - O resultado da rolagem pode ser usado em condições de interações para ramificar sucessos ou falhas críticas.

---

## 4. Sistema de Diário de Bordo (Log de Ações)

O Diário funciona como um histórico dinâmico de tudo o que foi lido e executado:

| Opção | Efeito |
|-------|--------|
| **Auto-rolagem (Auto-Scroll)** | Rola a tela automaticamente para a mensagem mais recente. |
| **Permitir Exportação** | Exibe um botão que permite ao jogador baixar o histórico completo em `.txt`. |
| **Limite de Mensagens** | Define quantas entradas ficam salvas na memória (ex: 50 mensagens). |
| **Exibir Imagem da Cena** | Inclui miniaturas ilustrativas no histórico do diário. |
| **Exibir Ação do Jogador** | Registra exatamente o comando que o jogador digitou antes da resposta. |

---

## 5. Animações e Ritmo de Leitura

Controle a fluidez com que os textos e telas se revelam:

- **Efeito de Texto**:
  - `Typewriter` (Máquina de Escrever): As letras surgem uma a uma com som sutil opcional.
  - `Fade` (Esmaecimento): O bloco de texto surge suavemente.
  - `Instantâneo`: O texto aparece de imediato sem transição.
- **Velocidade de Escrita**: Ajuste em milissegundos para encontrar o ritmo perfeito entre dramaticidade e conforto de leitura.
- **Transição de Menus**: Escolha entre `Fade`, `Slide` ou `Nenhum` para abertura de modais e janelas secundárias.
- **Áudio de Transição**: Adicione um efeito sonoro que toca sempre que um menu ou diálogo é aberto.

---

## Salvando as Alterações

No topo da página de Mecânicas, uma barra de ações dedicada exibe:
- ⚠️ **Aviso de Alterações Não Salvas** (quando houver modificações pendentes).
- ↩️ **Desfazer**: Restaura as configurações originais antes da edição.
- 💾 **Salvar Alterações**: Grava os novos ajustes permanentemente no projeto.

---

## ✅ Checklist do Módulo 04

- [ ] Modo de interação verificado (Parser)
- [ ] Sistema de Inventário ativado com feedback customizado
- [ ] Pré-visualização testada no painel direito
- [ ] Alterações salvas com o botão "Salvar Alterações"

---

## Próximo passo

Aprenda como customizar cores, fontes, molduras e efeitos climáticos na sua ficção:

→ [**Módulo 05 — Estilo Visual**](./05-estilo-visual.md)
