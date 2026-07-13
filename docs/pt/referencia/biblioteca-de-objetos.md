# Referência — Biblioteca de Objetos

A **Biblioteca de Objetos** é onde você cria e gerencia todos os objetos da sua ficção interativa. Os objetos são **globais**: criados uma vez e reutilizáveis em múltiplos ramos.

---

## Acesso

Sidebar → **Objetos**

---

## Painel Principal

| Painel | Conteúdo |
|--------|---------|
| **Esquerda** | Lista de todos os objetos do projeto com busca |
| **Direita** | Editor de propriedades do objeto selecionado |

---

## Propriedades do Objeto

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Nome do Objeto** | Texto | Identificador usado pelo jogador e pelo parser |
| **ID Único** | Texto (auto) | Gerado automaticamente; não editável |
| **Descrição de Examinar** | Textarea | Exibida quando o jogador usa `examinar`, `olhar` ou `ler` |
| **Imagem** | Upload | Foto/ilustração do objeto (aparece no pop-up de detalhes) |
| **Coletável** | Toggle | Se pode ser adicionado ao inventário |
| **Ícone** | Seletor | Ícone Lucide exibido na lista de objetos no jogo |

---

## Verbos Reservados para Objetos

Os seguintes verbos funcionam **automaticamente** em qualquer objeto sem configuração adicional:

| Verbo(s) | Resultado |
|----------|-----------|
| `examinar`, `olhar`, `ver` | Exibe a "Descrição de Examinar" do objeto |
| `ler` | Exibe a "Descrição de Examinar" (útil para documentos/placas) |

Esses verbos **não precisam ser criados como Interações** — o sistema os reconhece nativamente.

---

## Vincular Objetos a Ramos

Um objeto precisa ser **vinculado** ao ramo onde aparece:

1. Selecione um ramo na narrativa
2. Aba **"Objetos"** no Editor de Ramos
3. Clique em **"Vincular Objeto"**
4. Busque e selecione o objeto desejado

**Desvincular:** O botão "Desvincular" remove o objeto do ramo, mas **não o apaga** da biblioteca global.

---

## Objetos por Ramo vs. Objetos Globais

| Aspecto | Detalhes |
|---------|----------|
| **Criação** | Sempre na Biblioteca Global |
| **Uso** | Vinculado a um ou mais ramos |
| **Edição** | Editar na biblioteca atualiza em todos os ramos |
| **Remoção do ramo** | "Desvincular" — objeto permanece na biblioteca |
| **Remoção global** | "Excluir Objeto" — remove de todos os ramos e interações |

---

## Objetos no Jogo

Dependendo da configuração, objetos aparecem ao jogador de formas diferentes:

| Situação | Como aparece |
|----------|-------------|
| **No ramo** | Na lista "Coisas aqui" (se habilitada) |
| **No inventário** | Na aba de inventário (após ser coletado) |
| **Examinado** | Pop-up com nome, descrição e imagem |
| **Como alvo de interação** | Referenciado no texto interativo `<nome>` |

---

## Boas Práticas

- **Nomeie objetos claramente:** Use nomes que o jogador naturalmente digitaria (`chave`, `espada`, `carta`)
- **Descreva bem:** A descrição de examinar enriquece a narrativa — aproveite para dar detalhes e pistas
- **Imagens pequenas:** Objetos embutidos aumentam o tamanho do `.zip` — prefira imagens abaixo de 200KB
- **Objetos reutilizáveis:** Um mesmo objeto pode aparecer em múltiplos ramos (ex: uma tocha que o jogador carrega)

---

## Gerenciamento Avançado

| Funcionalidade | Localização |
|---------------|-------------|
| **Ver em quais ramos está** | Editor de Objeto → seção "Usado em Ramos" |
| **Verificar objetos órfãos** | Mapa de Conexões → Estatísticas → "Objetos Inúteis" |
| **Filtrar por nome** | Campo de busca no topo da lista |
