# Referência — Exportação e Compartilhamento

O IF Builder exporta ficções como arquivos **auto-suficientes** que funcionam em qualquer navegador, sem necessidade de internet, servidor ou instalação.

---

## Formatos de Exportação

| Formato | Conteúdo | Uso |
|---------|----------|-----|
| **`.zip`** | Jogo completo + dados + assets | Jogar, compartilhar, reimportar |
| **`.json`** | Dados do projeto (sem imagens/áudio) | Backup leve, controle de versão |

---

## Salvar Projeto (.zip)

### Como salvar

1. Cabeçalho → ícone **💾 Salvar** (ou botão "Salvar")
2. Digite o nome do arquivo na caixa de diálogo
3. O navegador baixa o `.zip` automaticamente

> ⚠️ **O editor não salva automaticamente.** Salve com frequência para não perder progresso.

### Conteúdo do .zip

```
meu-projeto.zip
├── index.html        ← Abre o jogo no navegador
├── game.json         ← Dados do projeto (para reimportar)
├── assets/           ← Imagens e áudios
│   ├── img_scene_1.jpg
│   └── bgm_opening.mp3
└── engine/
    └── game-engine.js ← Motor do jogo (não editar)
```

---

## Carregar Projeto (.zip)

Para retomar a edição de um projeto salvo:

1. Cabeçalho → ícone **📂 Carregar**
2. Selecione o arquivo `.zip`
3. O editor restaura **todos os dados**: ramos, objetos, interações, configurações, assets

> 💡 Carregar um `.zip` **substitui** o projeto atual. Salve antes se necessário.

---

## Jogar Offline

1. Extraia o conteúdo do `.zip` em qualquer pasta
2. Abra `index.html` em qualquer navegador moderno
3. O jogo funciona 100% offline, sem instalação

**Compatibilidade:** Chrome, Firefox, Edge, Safari (desktop e mobile)

---

## Compartilhar com Jogadores

### Via .zip (recomendado)
Envie o arquivo `.zip` por e-mail, Google Drive, WhatsApp, etc.  
O destinatário extrai e abre `index.html`.

### Via plataformas de IF
O `.zip` pode ser publicado em plataformas como:
- [itch.io](https://itch.io) — hospeda jogos HTML gratuitos
- [IfDB](https://ifdb.org) — diretório de ficção interativa

### Via importação no editor
Qualquer usuário do IF Builder pode importar seu `.zip` e ver/editar a ficção internamente — ótimo para colaboração e remixes.

---

## Backup e Restauração (.json)

### Exportar Backup

Sidebar → **Configurações** → Gerenciamento de Dados → **"Exportar Backup"**

Gera um arquivo `.json` com todos os dados do projeto, **sem** imagens e áudios embutidos.

### Restaurar de Backup

Sidebar → **Configurações** → Gerenciamento de Dados → **"Importar Arquivo (.json)"**

> ⚠️ A restauração **substitui** todos os dados atuais do projeto.

---

## Limpar Projeto

Sidebar → **Configurações** → **"Excluir Projeto Inteiro"**

Apaga todos os ramos, objetos e interações, retornando ao estado inicial vazio.

> ⚠️ **Esta ação não pode ser desfeita.** Exporte um backup antes.

---

## Dicas de Otimização do .zip

Para manter o arquivo leve e o jogo rápido:

| Dica | Impacto |
|------|---------|
| Comprima imagens antes de importar (TinyPNG, Squoosh) | Alto |
| Use WebP em vez de PNG para imagens | Alto |
| Prefira arquivos de áudio MP3 abaixo de 2MB | Médio |
| Evite imagens acima de 1280×720px | Médio |
| Verifique alertas de performance no Mapa de Conexões | Informativo |
