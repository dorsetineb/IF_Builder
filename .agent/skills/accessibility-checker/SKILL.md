---
name: accessibility-checker
description: Padrões e auditoria de acessibilidade baseados no WCAG 2.2. Use para revisar interfaces, apontar desvios e garantir que o site seja acessível para todos os usuários.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Auditoria de Acessibilidade (WCAG 2.2)

> **Filosofia:** Acessibilidade não é um recurso extra, é um requisito fundamental. A web é para todos.
> **Princípio Central:** Pense na diversidade de usuários (visuais, motores, auditivos, cognitivos) em cada decisão de UI/UX.

---

## 🎯 Lista de Verificação Obrigatória (WCAG 2.2 AA)

Ao analisar ou construir código frontend, SEMPRE verifique os seguintes critérios:

### 1. Perceptível (Perceivable)
- **Contrastes Reforçados:** O contraste do texto com o fundo deve ser no mínimo `4.5:1` para texto normal e `3:1` para texto grande (18pt+ ou 14pt negrito).
- **Contraste Não-Textual:** Ícones e bordas de inputs precisam ter `3:1` de contraste contra cores adjacentes.
- **Textos Alternativos (`alt`):** Todas as imagens significativas DEVEM ter `alt` textual. Imagens decorativas DEVEM ter `alt=""` ou `role="presentation"`.
- **Uso de Cor:** A cor NUNCA deve ser o único meio de transmitir uma informação (ex: "os campos em vermelho são obrigatórios"). Use ícones, padrões ou sublinhados em conjunto com a cor.

### 2. Operável (Operable)
- **Navegação por Teclado:** Tudo deve ser operável via teclado (`Tab`, `Enter`, `Space`, `Esc`, setas). Sem "armadilhas de teclado".
- **Foco Visível (WCAG 2.2):** O indicador de foco (`:focus`, `:focus-visible`) DEVE ser altamente visível (contraste de pelo menos `3:1` ou outline espesso).
- **Foco Não Obscurecido (Novo WCAG 2.2):** Quando um item recebe o foco pelo teclado, ele não pode ser totalmente escondido por banners, modais, headers ou menus fixos.
- **Tamanho do Alvo (Novo WCAG 2.2):** Botões e links touch/mouse devem ter no mínimo `24x24 px` de área interativa para garantir que não haja erros de clique.
- **Movimentos de Arraste (Novo WCAG 2.2):** Qualquer funcionalidade de drag & drop (arrastar) deve ter uma alternativa baseada em cliques únicos (ex: setas de mover para cima/baixo).
- **Atalhos de Teclado:** Se inseridos atalhos em letras/numerais, eles devem poder ser desligados ou remapeados para evitar conflitos com leitores de tela.

### 3. Compreensível (Understandable)
- **Identificação de Erros Claras:** A validação de formulários deve explicar em texto O QUE está errado e COMO consertar. Contornos vermelhos não são suficientes.
- **Entrada Redundante (Novo WCAG 2.2):** Não peça dados que o usuário já preencheu na mesma funcionalidade/sessão (ex: usar o mesmo endereço para faturamento e entrega com um clique).
- **Ajuda Consistente (Novo WCAG 2.2):** Links de suporte, FAQ, contato ou chat devem estar dispostos de maneira consistente na mesma ordem nas páginas onde existirem.
- **Autenticação Acessível (Novo WCAG 2.2):** Logins ou recuperações de pass não devem exigir testes de memória (ex: "Qual a 3ª letra da sua senha?") ou transcrição complexa sem a opção de uso de gerenciadores de senha ou copiar/colar.

### 4. Robusto (Robust)
- **Semântica HTML:** Use tags semânticas apropriadas (`<nav>`, `<header>`, `<main>`, `<button>`, `<dialog>`). Se é para clicar e realizar uma ação de UI, use `<button>` em vez de `<div>` com manipulador de clique.
- **Estados ARIA Apropriados:** Utilize propriedades `aria-*` rigorosamente, como `aria-expanded` para dropdowns/menus e `aria-describedby` para mensagens de erro atreladas a campos.

---

## ⚠️ PROCESSO CRÍTICO: COMO APONTAR E CORRIGIR DESVIOS
Quando a IA for encarregada de revisar uma página, componente ou fluxo, aplique um formato claro de relatório de não-conformidade:

**Passo a passo para Auditoria e Correção:**
1. **Identifique a violação na Interface/Código:** "O botão de "Salvar" só tem diferenciação visual por alteração de tom de cinza quando em hover."
2. **Cite a regra correspondente do WCAG 2.2:** "Violação do critério 1.4.1 (Uso da cor) e 1.4.3 (Contraste Mínimo), pois o estado não está claro o suficiente ou tem baixo contraste."
3. **Sugira a Correção (Código e Estrutura):** Forneça o snippet atualizado (ex: aplicar `border`, `outline` ou ícone complementar; aplicar CSS com `aria-labels`).

## ⛔ Padrões Antimodelos (Anti-Patterns) a EXCLUIR do Projeto:
- **Outline `none` arbitrário:** Remover o `outline` natural do navegador com `outline: none;` sem repor uma estilização própria de foco via `:focus-visible`.
- **Modais / Dialogs inseguros:** Criar painéis sobrepostos (modais/menus laterais) que NÃO "prendem" o foco (focus trap); que permitem ao usuário usar o Tab pela página por trás escurecida; ou que não podem ser fechados apertando `Escape`.
- **Elementos customizados inacessíveis:** Checkboxes ou toggles totalmente baseados em divs não clicáveis com teclado ou sem associação com o `<label>`.

---

## 🧰 Scripts de Auto-Verificação (Se aplicável)
*O arquivo `accessibility_checker.py` (caso exista na pasta script da skill) será encarregado de rodar bibliotecas em CLI como `pa11y` ou embutir verificações no Lighthouse para barrar builds sem acessibilidade WCAG 2.2.*
