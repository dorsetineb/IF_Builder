# Módulo 02 — Ramos e Descrições

**Tutorial: A Chave do Farol**  
Tempo estimado: 8–12 minutos

---

## Objetivo deste módulo

Neste módulo você vai:
- Entender o que é um Ramo e um Capítulo
- Criar os 5 ramos da nossa ficção
- Escrever as descrições de cada cena
- Usar texto interativo com `<palavra>`
- Configurar imagem, música e o ramo inicial

---

## Conceito: Ramos vs. Capítulos

O IF Builder tem dois tipos de nós narrativos:

| Tipo | Ícone | Uso |
|------|-------|-----|
| **Ramo** | Quadrado | Cena/localização onde o jogador interage |
| **Capítulo** (Vinheta) | Película | Tela cinematográfica (abertura, transição, conclusão) |

Neste módulo criaremos os **Ramos**. Os Capítulos serão criados no Módulo 06.

---

## Estrutura da nossa ficção

```
[Entrada do Farol]  ← Ramo Inicial
       ↓
[Corredor Escuro]
       ↓
[Sala da Lanterna]  ← Ramo Final (positivo)
       ↓
[Derrota]           ← Ramo Final (negativo — via Tracker)
```

---

## Passo 1 — Abrir o Editor de Ramos

Na sidebar, clique em **"Narrativa"**. Você verá a lista de ramos do projeto.

Um ramo inicial já existe (criado automaticamente). Clique nele para editá-lo.

---

## Passo 2 — Criar a "Entrada do Farol"

No Editor de Ramos, configure:

**Aba Propriedades:**

| Campo | Valor |
|-------|-------|
| **Título** | Entrada do Farol |
| **Descrição** | *Veja o texto abaixo* |

**Descrição completa:**

```
A tempestade de fora faz as janelas vibrarem. Você entrou para se abrigar.

O interior do farol é úmido e abandonado. Uma <escada de ferro> sobe em espiral até o topo. No chão, próximo à porta, há uma <chave enferrujada>.

O vento uiva pelas frestas das paredes.
```

> 💡 As palavras entre `< >` se tornam **clicáveis** no jogo — o jogador pode digitar `examinar chave` ou `examinar escada` e o sistema reconhece o alvo.

**Definir como Ramo Inicial:**

Na aba Propriedades, localize a seção de configurações e marque este ramo como **Início da história**. Um ícone de casa aparecerá ao lado do nome.

---

## Passo 3 — Criar o "Corredor Escuro"

Na lista de narrativa, clique em **"Criar Capítulo ou Ramo"** e escolha **Ramo**.

| Campo | Valor |
|-------|-------|
| **Título** | Corredor Escuro |
| **Descrição** | *Veja o texto abaixo* |

**Descrição:**

```
Você sobe a escada e chega a um corredor estreito. A escuridão é quase total.

Seus olhos levam alguns segundos para se adaptar. Do outro lado, você vê uma <porta de madeira> entreabert.

O cheiro de mofo é forte. Algo rangeu no teto.
```

---

## Passo 4 — Criar a "Sala da Lanterna"

Crie um novo Ramo:

| Campo | Valor |
|-------|-------|
| **Título** | Sala da Lanterna |
| **Descrição** | *Veja o texto abaixo* |

**Descrição:**

```
A sala do topo. A grande lanterna do farol ainda funciona — ela gira lentamente, projetando feixes de luz pela janela.

Do alto, você vê o oceano revolto lá embaixo.

Você encontrou o que procurava.
```

**Marcar como Ramo Final:**
- Na aba Propriedades, ative a opção **"Ramo de Encerramento"**
- Selecione um **Capítulo de Conclusão** (criaremos no Módulo 06 — deixe em branco por ora)

---

## Passo 5 — Criar o Ramo "Derrota"

Crie um novo Ramo:

| Campo | Valor |
|-------|-------|
| **Título** | Derrota |
| **Descrição** | Você não resistiu ao frio e ao cansaço. A escuridão ganhou. |

**Marcar como Ramo Final negativo:**
- Ative a opção **"Ramo de Encerramento"**

> Este ramo será ativado pelo Tracker de Saúde (configuraremos no Módulo 05).

---

## Passo 6 — Texto Interativo com `<palavra>`

O IF Builder permite destacar palavras na descrição para torná-las clicáveis:

**Sintaxe:** `<objeto>` no texto da descrição

**Exemplo:**
```
No chão há uma <chave enferrujada>.
```

No jogo, "chave enferrujada" ficará em destaque. O jogador pode:
- Clicar nela para preencher o campo de comando automaticamente
- Digitar `examinar chave` ou `pegar chave`

> 💡 O sistema reconhece variações da palavra — você não precisa digitar o nome exato do objeto.

---

## Passo 7 — Adicionar Imagem e Música (opcional)

No Editor de Ramos, localize a seção **Multimídia**:

- **Imagem de fundo**: Clique em "Carregar Imagem de Fundo"
  - Recomendado: **1280×720px** (horizontal) ou **720×1280px** (vertical)
  - Formatos: JPG, PNG, WebP
- **Música de fundo**: Clique em "Carregar Áudio"
  - Formato: MP3

> 💡 Imagens e áudios são salvos **dentro do arquivo .zip** do projeto — nada fica em servidores externos.

---

## Passo 8 — Ver o Mapa de Conexões

Na sidebar, clique em **"Mapa de Ramos"** para visualizar a estrutura da sua ficção graficamente.

Por enquanto os ramos estão **desconectados** — as conexões serão criadas quando configurarmos as **Interações** no Módulo 04.

---

## ✅ Checklist do Módulo 02

- [ ] Ramo "Entrada do Farol" criado e definido como inicial
- [ ] Ramo "Corredor Escuro" criado
- [ ] Ramo "Sala da Lanterna" criado e marcado como final
- [ ] Ramo "Derrota" criado e marcado como final
- [ ] Texto interativo com `<chave enferrujada>` e `<escada de ferro>` adicionado

---

## Próximo passo

→ [Módulo 03 — Objetos e Inventário](./03-objetos-e-inventario.md)
