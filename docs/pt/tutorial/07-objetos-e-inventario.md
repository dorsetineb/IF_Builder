# Módulo 07 — Objetos e Inventário

**Tutorial: A Chave do Farol**  
Tempo estimado: 8–10 minutos

---

## Objetivo deste módulo

Neste módulo você vai aprender a gerenciar a biblioteca de itens do jogo:
- Entender como funciona a **Biblioteca Global de Objetos**
- Criar a **Chave Enferrujada**, a **Escada de Ferro** e o **Frasco de Óleo**
- Configurar sinônimos, descrições de exame e imagens
- Definir propriedades de coletabilidade e peso
- Vincular objetos a Ramificações e Cenários

---

## Como os Objetos funcionam no IF Builder

No IF Builder, os objetos são **globais**: você cria o item uma única vez na biblioteca e pode vinculá-lo a qualquer ramificação ou usá-lo em hotspots de cenários.

Um objeto possui:
- **Nome Principal**: Como o item é chamado na interface.
- **Sinônimos / Aliases**: Variações aceitas pelo parser (ex: `chave`, `chave velha`, `chave enferrujada`, `key`).
- **Descrição de Examinar**: O texto revelado quando o jogador inspeciona o item (`examinar chave`).
- **Imagem Ilustrativa**: Foto ou arte que aparece no pop-up de exame e no menu de inventário.
- **Coletável (Sim/Não)**: Se o jogador pode pegar e carregar o item.
- **Peso / Carga**: Valor numérico caso o limite de inventário esteja ativo.

---

## Passo 1 — Acessar a Página de Objetos

No menu lateral esquerdo, clique no quinto item: 📦 **Objetos**.

A tela exibe:
- **Coluna da Esquerda**: Lista de todos os objetos cadastrados no projeto e barra de busca.
- **Painel da Direita**: Formulário detalhado de edição do objeto selecionado.

---

## Passo 2 — Criar a "Chave Enferrujada"

Clique no botão **"Novo Objeto"** (ícone `+`):

| Campo | Valor |
|-------|-------|
| **Nome do Objeto** | Chave Enferrujada |
| **Sinônimos** | `chave`, `chave velha`, `chave de ferro`, `chave enferrujada` |
| **Descrição de Examinar** | Uma chave pesada e antiga, coberta por limo e ferrugem avermelhada. O cabo tem o relevo em formato de farol. |
| **Coletável** | ✅ **Ativado** |
| **Peso** | `1` |

> 💡 Faça upload de uma ilustração da chave para enriquecer o visual do inventário.

---

## Passo 3 — Criar a "Escada de Ferro" (Item de Cenário)

Clique em **"Novo Objeto"**:

| Campo | Valor |
|-------|-------|
| **Nome do Objeto** | Escada de Ferro |
| **Sinônimos** | `escada`, `degraus`, `escadaria` |
| **Descrição de Examinar** | Degraus de ferro fundido sobem em espiral até o alto da torre. A estrutura está firme, apesar de ranger com o vento. |
| **Coletável** | ❌ **Desativado** (não pode ser colocada na mochila) |

---

## Passo 4 — Criar o "Frasco de Óleo"

Clique em **"Novo Objeto"**:

| Campo | Valor |
|-------|-------|
| **Nome do Objeto** | Frasco de Óleo |
| **Sinônimos** | `oleo`, `frasco`, `lubrificante`, `vidro de oleo` |
| **Descrição de Examinar** | Um pequeno frasco de vidro escuro contendo óleo lubrificante espesso. Ideal para desengripar engrenagens velhas. |
| **Coletável** | ✅ **Ativado** |

---

## Passo 5 — Vincular Objetos às Cenas

Os objetos criados na biblioteca precisam ser posicionados no mundo:

### Vinculando em uma Ramificação de Texto:
1. No menu lateral, clique em **"Narrativa"** e selecione o ramo **"Entrada do Farol"**.
2. Na aba **"Objetos"**, clique em **"Vincular Objeto ao Ramo"**.
3. Selecione `Chave Enferrujada` e clique em **Vincular**.
4. Repita para vincular `Escada de Ferro`.

### Vinculando em um Cenário (Point-and-Click):
1. Selecione o Cenário **"Oficina do Faroleiro"**.
2. Ao configurar um hotspot de **Coleta de Objeto**, selecione `Frasco de Óleo`. O objeto será automaticamente associado ao cenário!

---

## Passo 6 — Testar no Preview

1. No ramo **Entrada do Farol**, clique em **Testar Ramo**.
2. Digite:
   - `olhar` → exibe os objetos presentes na sala.
   - `examinar chave` → exibe a descrição detalhada da chave.
   - `examinar escada` → exibe a descrição da escadaria.
   - `pegar chave` → (será configurado no Módulo 08 via Interações).

---

## ✅ Checklist do Módulo 07

- [ ] Objetos "Chave Enferrujada", "Escada de Ferro" e "Frasco de Óleo" criados
- [ ] Sinônimos e descrições de exame cadastrados
- [ ] Itens vinculados aos seus respectivos locais na narrativa e cenários
- [ ] Teste de exame executado no preview

---

## Próximo passo

Aprenda a criar a lógica de comandos, condições e consequências:

→ [**Módulo 08 — Interações e Gatilhos**](./08-interacoes-e-parser.md)
