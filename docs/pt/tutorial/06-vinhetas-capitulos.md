# Módulo 06 — Vinhetas e Capítulos

**Tutorial: A Chave do Farol**  
Tempo estimado: 8–10 minutos

---

## Objetivo deste módulo

Neste módulo você vai:
- Entender o que são Vinhetas (Capítulos)
- Criar a **Vinheta de Abertura** da ficção
- Criar a **Vinheta de Conclusão** (final positivo)
- Conectar as vinhetas ao fluxo da história
- Configurar layout, animação e música

---

## O que são Vinhetas?

**Vinhetas** são telas cinematográficas que aparecem fora do loop principal de interação. Elas servem para:

| Tipo | Quando aparece |
|------|---------------|
| **Abertura** | Antes do primeiro ramo — tela de título do jogo |
| **Transição** | Durante uma interação — momento dramático ou passagem de tempo |
| **Conclusão** | No final — tela de vitória ou derrota com créditos |

Vinhetas têm imagem de fundo, título, texto, música, botão de ação e animações configuráveis.

---

## Passo 1 — Criar a Vinheta de Abertura

Na lista de narrativa (sidebar → Narrativa), clique em **"Criar Capítulo ou Ramo"** e escolha **"Criar Capítulo"**.

Um novo item aparece na lista com o ícone de película. Clique nele para editar.

**Tipo:** Selecione **"Abertura"**

Configure:

| Campo | Valor |
|-------|-------|
| **Nome (interno)** | Abertura - O Farol |
| **Título** | A Chave do Farol |
| **Texto** | *Veja abaixo* |
| **Imagem de fundo** | Farol na tempestade (imagem escura e dramática) |
| **Música** | Trilha ambiente — vento e oceano |
| **Texto do Botão** | Entrar no Farol |

**Texto da abertura:**

```
Em algum lugar na costa, há um farol que ninguém visita.

Dizem que quem sobe até o topo nunca volta igual.

Esta noite, você não tinha escolha.
```

---

## Passo 2 — Configurar o Layout da Abertura

Na aba de configurações da vinheta:

**Alinhamento do conteúdo:**
- **Horizontal**: Esquerda (título e texto à esquerda, deixando a imagem respirar)
- **Vertical**: Centralizado

**Animação do texto:**
- Tipo: **Typewriter** (digitação lenta, mais dramática)
- Velocidade: 3 (moderada)

**Efeito visual (Overlay):**
- Selecione **"Chuva"** — reforça o clima de tempestade

**Opções de exibição:**
- ✅ Mostrar Título
- ✅ Mostrar Descrição

---

## Passo 3 — Conectar a Abertura ao primeiro ramo

A Vinheta de Abertura precisa saber para qual ramo o jogador vai ao clicar no botão.

No editor da vinheta de Abertura, localize o campo **"Ir Para"** (ou "Próxima Cena") e selecione **"Entrada do Farol"**.

---

## Passo 4 — Criar a Vinheta de Conclusão (Final Positivo)

Crie um novo Capítulo.

**Tipo:** Selecione **"Conclusão"**

Configure:

| Campo | Valor |
|-------|-------|
| **Nome (interno)** | Conclusão - Vitória |
| **Título** | Você Chegou ao Topo |
| **Texto** | *Veja abaixo* |
| **Imagem** | Vista do oceano a partir de um farol (cena de alívio) |
| **Música** | Trilha suave e esperançosa |
| **Texto do Botão** | Ver Créditos / Recomeçar |

**Texto da conclusão:**

```
A lanterna gira sobre sua cabeça, enviando sinais para além do horizonte.

Você não sabe o que aquela chave protegia. Mas agora o farol voltou a funcionar.

Lá longe, através da tempestade, um navio muda de rota.
```

---

## Passo 5 — Conectar a Conclusão ao ramo "Sala da Lanterna"

1. Volte ao ramo **"Sala da Lanterna"**
2. Na aba Propriedades, localize **"Capítulo de Conclusão"**
3. Selecione a Vinheta de Conclusão criada

Agora quando o jogador chegar à Sala da Lanterna e o jogo encerrar, a tela de conclusão será exibida.

---

## Passo 6 — Criar a Vinheta de Derrota (opcional)

Crie um último Capítulo para o ramo Derrota:

**Tipo:** Conclusão

| Campo | Valor |
|-------|-------|
| **Título** | Perdido nas Sombras |
| **Texto** | O frio venceu. A escuridão venceu. E você nunca chegou ao topo. |
| **Imagem** | Escuridão com ponto de luz ao longe |

Conecte ao ramo **"Derrota"** da mesma forma.

---

## Tipos de Animação disponíveis

| Animação de Texto | Descrição |
|-------------------|-----------|
| **Fade** | O texto aparece gradualmente |
| **Typewriter** | Cada letra é digitada uma a uma |

| Efeito Visual (Overlay) | Descrição |
|------------------------|-----------|
| Nenhum | Sem efeito |
| Grão | Textura de película antiga |
| Chuva | Gotas caindo |
| Vintage | Desfoque suave |
| Fósforo verde | Monitor CRT |
| TV CRT | Linhas de varredura |
| Confete | Celebração |
| Glitch | Interferência digital |

---

## ✅ Checklist do Módulo 06

- [ ] Vinheta de Abertura criada com tipo "Abertura" e conectada à "Entrada do Farol"
- [ ] Animação Typewriter configurada na abertura
- [ ] Vinheta de Conclusão criada e conectada ao ramo "Sala da Lanterna"
- [ ] Vinheta de Derrota criada (opcional) e conectada ao ramo "Derrota"
- [ ] Preview do jogo completo testado do início ao fim

---

## Próximo passo

→ [Módulo 07 — Exportação](./07-exportacao.md)
