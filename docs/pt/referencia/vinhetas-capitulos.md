# Referência — Vinhetas e Capítulos

**Vinhetas** (também chamadas de **Capítulos**) são telas cinematográficas que aparecem fora do loop de interação principal. Elas enriquecem a narrativa com momentos dramáticos de abertura, transição e conclusão.

---

## Acesso

Sidebar → **Narrativa** → Criar Capítulo ou Ramo → **"Criar Capítulo"**

Ou: qualquer ramo pode ser convertido em vinheta via aba Propriedades → **"Este ramo é um capítulo?"**

---

## Tipos de Vinheta

| Tipo | Quando aparece | Uso típico |
|------|---------------|-----------|
| **Abertura** | Antes do primeiro ramo | Tela de título, prólogo, introdução |
| **Transição** | Durante uma interação (acionada como resultado) | Passagem de tempo, flashback, momento dramático |
| **Conclusão** | Ao encerrar num ramo final | Epílogo, créditos, tela de vitória/derrota |

---

## Propriedades da Vinheta

### Identificação

| Campo | Descrição |
|-------|-----------|
| **Nome Interno** | Referência no editor (não exibido no jogo) |
| **Título** | Título exibido na tela (pode ser ocultado) |
| **Texto** | Corpo do texto narrativo |

### Multimídia

| Campo | Detalhes |
|-------|----------|
| **Imagem de Fundo** | JPG/PNG/WebP — preenche toda a tela |
| **Música** | MP3 — toca durante a vinheta |
| **Efeito Visual** | `none`, `grain`, `rain`, `blur`, `chromatic`, `tv`, `confetti`, `glitch` |

### Layout

| Campo | Opções |
|-------|--------|
| **Alinhamento Horizontal** | Esquerda / Direita |
| **Alinhamento Vertical** | Centro / Baixo |
| **Mostrar Título** | Sim / Não |
| **Mostrar Descrição** | Sim / Não |

### Animação de Texto

| Campo | Opções |
|-------|--------|
| **Tipo** | `fade` (aparece gradualmente) / `typewriter` (digitação) |
| **Velocidade** | 1 (muito lento) a 5 (rápido) |

### Navegação

| Campo | Descrição |
|-------|-----------|
| **Texto do Botão** | Texto do botão de avanço (ex: "Continuar", "Começar") |
| **Próxima Cena** | Ramo para o qual o botão navega |

---

## Conectando Vinhetas ao Fluxo

### Vinheta de Abertura

A vinheta de Abertura é a **primeira coisa que o jogador vê**. Configure o campo **"Próxima Cena"** para o ramo inicial da ficção.

### Vinheta de Transição

Vinhetas de Transição são acionadas a partir de **Interações**:
- No Editor de Interações, campo **"Capítulo"** (em vez de "Destino")
- Quando o jogador executa a interação, a vinheta é exibida antes de ir ao ramo destino

### Vinheta de Conclusão

Conectada a um ramo final:
- Editor de Ramos → aba Propriedades → **"Capítulo de Conclusão"**
- Quando o jogo encerra naquele ramo, a vinheta é exibida automaticamente

---

## Configurações Avançadas

### Escala de Texto

| Opção | Tamanho |
|-------|---------|
| `sm` | Pequeno |
| `md` | Médio (padrão) |
| `lg` | Grande |

### Botão Personalizado

Cada vinheta pode ter seu próprio texto de botão, substituindo o padrão global configurado nas Configurações do Jogo.

---

## Boas Práticas

- **Aberturas curtas:** 2–4 frases impactantes valem mais que um parágrafo longo
- **Typewriter para horror/mistério:** A animação de digitação aumenta a tensão
- **Imagem de tela inteira:** Use imagens sem texto incorporado — o texto da vinheta sobrepõe
- **Música de transição:** Mude a música nas vinhetas de conclusão para criar contraste emocional
- **Alinhamento à esquerda:** Texto longo fica mais legível alinhado à esquerda
