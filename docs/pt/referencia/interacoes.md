# Referência — Interações

As **Interações** são o coração do sistema de jogo do IF Builder. Elas definem o que acontece quando o jogador usa um verbo — seja digitando (Parser) ou clicando (Escolha).

---

## Acesso

Sidebar → **Narrativa** → Selecionar um ramo → Aba **"Interações"**

---

## Anatomia de uma Interação

```
GATILHOS E CONDIÇÕES
  Verbos: [pegar, tomar, coletar]
  Alvo:   [Chave Enferrujada]
  Req.:   [nenhum]

RESULTADO
  → Adicionar ao Inventário: ✅
  → Remover do Ramo: ✅
  → Destino: (ficar no ramo)
  → Mensagem: "Você pega a chave enferrujada..."
```

---

## Campos de Gatilho

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Verbos** | Lista (vírgula) | Palavras que ativam a interação |
| **Alvo** | Objeto do ramo | Objeto sobre o qual o verbo é usado |
| **Requisito** | Objeto do inventário | Item que o jogador precisa ter para a interação funcionar |
| **Ícone** | Seletor Lucide | Ícone exibido no botão de ação (modo Escolha) |

### Variações de Verbo

O parser aceita variações naturais. Se você registrar `pegar`, o sistema também reconhece:

```
pegar chave
tomar a chave enferrujada
chave pegar
```

Registre múltiplos verbos separados por vírgula para aumentar a tolerância:

```
pegar, tomar, coletar, apanhar, pegar chave
```

---

## Campos de Resultado

### Flags de Comportamento

| Flag | Descrição |
|------|-----------|
| **Adicionar ao Inventário** | O objeto-alvo vai para o inventário do jogador |
| **Remover Objeto do Ramo** | O objeto-alvo desaparece do ramo após a ação |
| **Consumir Item do Requisito** | O item exigido é removido do inventário após uso |
| **Mostrar Imagem do Objeto** | Exibe a imagem do objeto em pop-up |

### Destino

| Opção | Comportamento |
|-------|-------------|
| *(Ficar no ramo)* | O jogador permanece no ramo atual |
| Qualquer ramo | O jogador é movido para o ramo selecionado |

### Mensagem de Sucesso

Texto exibido quando a interação é executada com sucesso. Pode ser:
- Uma frase simples de ação
- Uma descrição narrativa do evento
- Diálogo ou revelação de informação

Aceita HTML básico: `<strong>`, `<em>`, `<span>`

### Efeito Sonoro

Upload de um arquivo MP3 reproduzido ao executar a interação.

---

## Efeitos em Trackers

Cada interação pode modificar **um ou mais Trackers**:

| Campo | Valor |
|-------|-------|
| **Tracker** | Selecionar o tracker a ser afetado |
| **Valor** | Número positivo (soma) ou negativo (subtrai) |

Exemplo: `Saúde: -10` reduz a Saúde em 10 pontos ao executar a interação.

---

## Configurações de Transição

Controla a animação de transição ao **mudar de ramo**:

| Campo | Opções |
|-------|--------|
| **Tipo de Transição** | `fade`, `slide-left`, `slide-right`, `slide-up`, `slide-down`, `zoom`, `blur`, `none` |
| **Velocidade** | 1 (lento) a 10 (rápido) |

---

## Prioridade de Interações

Quando múltiplas interações correspondem ao mesmo verbo+alvo, o sistema usa esta ordem de prioridade:

1. **Interação com requisito atendido** (jogador possui o item)
2. **Interação sem requisito** (fallback)

Isso permite criar comportamentos condicionais intuitivos:

```
Interação A: subir + escada  (sem requisito) → mensagem "trancado"
Interação B: subir + escada  (requer chave)  → vai para sala do topo
```

---

## Como o Parser Interpreta Comandos

O parser do IF Builder tenta identificar **verbo** e **alvo** em qualquer ordem:

| Input do Jogador | Verbo detectado | Alvo detectado |
|-----------------|-----------------|----------------|
| `pegar chave` | pegar | chave |
| `chave pegar` | pegar | chave |
| `use key on door` | use | key / door |
| `abrir a porta com a chave` | abrir | porta + chave |
| `examinar` | examinar | *(objeto em foco)* |

Quando um objeto está **destacado** com `<nome>` no texto, clicar nele equivale a digitar o nome.

---

## Boas Práticas

- **Verbos no plural e infinitivo:** `usar, use, using` — cubra variações comuns
- **Interação de fallback:** Sempre crie uma interação sem requisito para evitar silêncio quando o jogador tenta algo esperado mas não tem o item
- **Mensagens de feedback ricas:** Use a mensagem de sucesso para enriquecer a narrativa, não apenas confirmar a ação
- **Teste todas as combinações:** Use "Testar Ramo" para verificar se os verbos funcionam como esperado
