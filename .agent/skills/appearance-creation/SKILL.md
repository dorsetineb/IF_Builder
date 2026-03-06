---
name: appearance-creation
description: Guia e protocolo para criar novas Aparências (Temas) no IF Builder, cobrindo tanto os temas da interface (App Themes) quanto os temas dos jogos gerados (Game Themes).
---

# Appearance Creation Skill (appearance-creation)

Este documento dita as regras e o passo-a-passo obrigatório para **adicionar novos temas e aparências** ao projeto IF Builder. 

> **Atenção:** O IF Builder trabalha com **dois tipos** distintos de temas. Sempre esclareça com o usuário qual dos dois ele quer criar antes de iniciar o código.

1. **App Themes (Aparência da Interface):** Os temas que mudam a cor do próprio editor (Área de Trabalho > Aparência). Ex: *Dia, Noite, Terminal, W95, Creme*.
2. **Game Themes (Aparência do Jogo):** Os temas predefinidos que os criadores podem escolher para os jogos que estão construindo (Aba Aparência > Estilo & Tema). Ex: *Meia-Noite, Floresta, Vampiro, Neon*.

---

## 🛠️ 1. Como criar um App Theme (Interface do Editor)

Para adicionar um novo tema à interface do próprio IF Builder, siga **exatamente** os passos abaixo na ordem listada:

### Passo 1.1: Definir as variáveis CSS (`src/index.css`)
Abra o arquivo `src/index.css` e encontre o bloco de temas no `.root` ou logo abaixo dele. 
Crie uma nova classe CSS com o nome do tema em inglês (ex: `.cyberpunk`, `.ocean`).
Você **deve** definir _todas_ as variáveis abaixo em formato Hexadecimal, OKLCH ou cor base.

```css
.nomedoseutema {
  --background: #...;
  --foreground: #...;
  --card: #...;
  --card-foreground: #...;
  --popover: #...;
  --popover-foreground: #...;
  
  /* Brand / Primary */
  --primary: #...;
  --primary-foreground: #...;
  
  /* Secondary & Muted /*
  --secondary: #...;
  --secondary-foreground: #...;
  --muted: #...;
  --muted-foreground: #...;
  
  /* Outros */
  --accent: #...;
  --accent-foreground: #...;
  --destructive: #...;
  --destructive-foreground: #...;
  
  /* Borders & Inputs */
  --border: #...;
  --input: #...;
  --ring: #...;

  /* Sidebar */
  --sidebar: #...;
  --sidebar-foreground: #...;
  --sidebar-primary: #...;
  --sidebar-primary-foreground: #...;
  --sidebar-accent: #...;
  --sidebar-accent-foreground: #...;
  --sidebar-border: #...;
  --sidebar-ring: #...;

  /* Dither Colors (Efeitos 1-Bit/Pixel) */
  --dither-bg-1: #...;
  --dither-bg-2: #...;
  --dither-bg-3: #...;
  --dither-overlay: #...;
}
```

### Passo 1.2: Adicionar o tema aos arquivos de tradução (`src/locales/`)
Abra os três arquivos de idioma principais (`pt`, `en`, `es`) em `src/locales/{lang}/translation.json`.
Procure pela chave `"settings.themes"` e adicione seu novo tema lá.

Exemplo no `pt/translation.json`:
```json
"themes": {
  "dark": "Noite",
  "light": "Dia",
  "cream": "Creme",
  "terminal": "Terminal",
  "windows": "W95",
  "nomedoseutema": "Nome Visível"
}
```

### Passo 1.3: Adicionar o botão na UI (`src/components/UIEditor.tsx`)
1. No arquivo `src/components/UIEditor.tsx`, encontre a aba do editor (procurando por `activeTab === 'config'` e pela seção de renderização `t('settings.appearance', 'Aparência')`).
2. Encontre a grade de botões `grid-cols-2 lg:grid-cols-3`.
3. Adicione o novo botão do tema importando um ícone do `lucide-react` que faça sentido para a temática.

```tsx
<button
    onClick={() => handleAppThemeChange('nomedoseutema')}
    className={`flex flex-col justify-center items-center gap-2 p-4 rounded-lg border transition-all ${theme === 'nomedoseutema' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted'}`}
>
    <IconeEscolhido size={16} className="text-muted-foreground" />
    <span className={`font-medium text-[10px] uppercase tracking-wider ${theme === 'nomedoseutema' ? 'text-foreground' : 'text-muted-foreground'}`}>
        {t('settings.themes.nomedoseutema')}
    </span>
</button>
```

---

## 🎨 2. Como criar um Game Theme (Temas Predefinidos do Jogo)

Para adicionar um tema que o usuário pode selecionar para colocar **no jogo que ele está construindo**, o processo é muito mais simples. 

Estes temas não dependem do CSS Global do painel. Eles fornecem um array de objetos para uso pelo motor de jogo do Editor.

### Único Passo: Atualizar a constante `PREDEFINED_THEMES` (`src/constants.ts`)

1. Navegue até o final da constante `PREDEFINED_THEMES` no arquivo `src/constants.ts`.
2. Adicione um novo objeto seguindo rigidamente a arquitetura de temas do projeto:

```typescript
{
    name: 'Nome Bonito em PT',      // Ex: Estrela Cadente
    nameKey: 'NomeInterno',         // Ex: EstrelaCadente (Sem espaços, sem caracteres especiais)
    mode: 'dark' | 'light',         // Se é um tema focado em claro ou escuro
    textColor: '#hex',              // Cor principal do texto normal
    titleColor: '#hex',             // Cor principal de cabeçalhos e destaques
    focusColor: '#hex',             // Cor de hover, bordas focadas e links focados
    textColorLight: '#hex',         // Variantes Light (usado internamente em contrastes)
    titleColorLight: '#hex',        
    focusColorLight: '#hex',
    splashButtonColor: '#hex',      // Cor de fundo do botão Iniciar no Menu
    splashButtonHoverColor: '#hex', // Cor do Hover do botão Iniciar no menu
    splashButtonTextColor: '#hex',  // Texto do botão iniciar no menu
    actionButtonColor: '#hex',      // Cor principal dos botões de escolhas na UI de jogo
    actionButtonTextColor: '#hex',  // Texto dos botões de escolhas
    chanceIconColor: '#hex',        // Cor dos ícones vermelhos (corações, HP da UI Tracker)
}
```

> **Atenção as Variantes Light/Dark:** Independente se o tema é escuro (`mode: 'dark'`) ou claro (`mode: 'light'`), **sempre forneça** variáveis de cores tanto para a configuração base quanto as sub-variáveis `Light`. O engine pode usá-las para gerar popovers na cor oposta em modais de jogo.
