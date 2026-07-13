# Módulo 03 — Objetos e Inventário

**Tutorial: A Chave do Farol**  
Tempo estimado: 6–8 minutos

---

## Objetivo deste módulo

Neste módulo você vai:
- Entender como os objetos funcionam no IF Builder
- Criar a **Chave Enferrujada** na Biblioteca de Objetos
- Vincular o objeto ao ramo "Entrada do Farol"
- Configurar o objeto como coletável (inventário)

---

## Como os objetos funcionam

No IF Builder, os objetos são **globais**: você os cria uma vez e pode usá-los em múltiplos ramos. Isso evita duplicação e facilita a manutenção.

Um objeto pode ter:
- **Nome**: como é chamado no jogo
- **Descrição de Examinar**: o que o jogador vê ao inspecioná-lo
- **Imagem**: foto ou ilustração do item
- **Coletável**: se pode ser adicionado ao inventário

---

## Passo 1 — Acessar a Biblioteca de Objetos

Na sidebar, clique em **"Objetos"**.

A tela da Biblioteca de Objetos tem dois painéis:
- **Esquerda**: lista de todos os objetos do projeto
- **Direita**: editor de propriedades do objeto selecionado

---

## Passo 2 — Criar a Chave Enferrujada

Clique no botão **"Criar Objeto"** (ícone `+`).

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Nome do Objeto** | Chave Enferrujada |
| **Descrição de Examinar** | *Veja o texto abaixo* |
| **Coletável** | ✅ Ativado |

**Descrição de Examinar:**

```
Uma chave velha, coberta de ferrugem e limo. Estranhamente, ela parece resistente. O cabo tem a forma de um farol em miniatura.
```

> 💡 Esta descrição aparece quando o jogador digita `examinar chave`, `olhar chave` ou `ler chave` — esses verbos são reservados e funcionam automaticamente.

**Imagem (opcional):**  
Clique em "Carregar" na seção de imagem do objeto para adicionar uma foto ou ilustração. Esta imagem aparece no pop-up de detalhes durante o jogo.

---

## Passo 3 — Criar a Escada de Ferro

Repita o processo para o segundo objeto:

| Campo | Valor |
|-------|-------|
| **Nome do Objeto** | Escada de Ferro |
| **Descrição de Examinar** | Degraus de ferro enferrujados sobem em espiral. A estrutura parece sólida o suficiente para suportar seu peso. Rangidos, mas firme. |
| **Coletável** | ❌ Não (não pode ser coletada) |

---

## Passo 4 — Vincular Objetos ao Ramo

Os objetos existem na biblioteca global, mas precisam ser **vinculados** ao ramo onde aparecem.

1. Na sidebar, volte para **"Narrativa"** e selecione o ramo **"Entrada do Farol"**
2. No Editor de Ramos, clique na aba **"Objetos"**
3. Clique em **"Vincular objeto ao ramo"**
4. Busque e selecione **"Chave Enferrujada"** → clique em "Vincular Agora"
5. Repita para **"Escada de Ferro"**

Os objetos vinculados ao ramo aparecem automaticamente na lista "Coisas aqui" para o jogador.

---

## Passo 5 — Verificar no Preview

Clique no botão **"Testar"** (ícone de play) no editor do ramo "Entrada do Farol".

No preview, teste:
- `examinar chave` → deve mostrar a descrição da Chave Enferrujada
- `olhar escada` → deve mostrar a descrição da Escada de Ferro
- `inventário` → ainda vazio (a chave ainda não foi coletada)

---

## Como o inventário funciona no jogo

Quando o jogador **coleta** um objeto (via interação — veremos no Módulo 04):
- O objeto aparece no **painel de inventário** do jogo
- O jogador pode consultar o inventário com o verbo `inventário`
- O objeto pode ser **exigido como requisito** em outras interações

---

## ✅ Checklist do Módulo 03

- [ ] Objeto "Chave Enferrujada" criado e marcado como coletável
- [ ] Objeto "Escada de Ferro" criado (não coletável)
- [ ] Ambos vinculados ao ramo "Entrada do Farol"
- [ ] Preview testado: `examinar chave` e `olhar escada` funcionam

---

## Próximo passo

→ [Módulo 04 — Interações e Parser](./04-interacoes-e-parser.md)
