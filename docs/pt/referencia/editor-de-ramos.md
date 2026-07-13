# Referência — Editor de Ramos

O **Editor de Ramos** é o módulo central do IF Builder. É onde você escreve e configura cada cena da sua ficção interativa.

---

## Acesso

Sidebar → **Narrativa** → Selecionar um ramo na lista

---

## Abas do Editor

O editor está dividido em quatro abas:

| Aba | Conteúdo |
|-----|---------|
| **Propriedades** | Título, descrição, tipo, configurações gerais, multimídia |
| **Objetos** | Objetos presentes neste ramo |
| **Interações** | Regras de verbos para este ramo |
| **Escolhas** | Botões de opção (modo IF/Escolha) |

---

## Aba: Propriedades

### Identificação

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Título** | Texto | Nome do ramo exibido na lista e no mapa |
| **ID Único** | Texto (auto) | Gerado automaticamente; não editável |

### Descrição

O texto que o jogador lê ao entrar no ramo.

**Texto Interativo:** Use `<palavra>` para destacar termos clicáveis:

```
Há uma <porta de madeira> ao fundo.
```

Palavras entre `< >` ficam em destaque no jogo e podem ser usadas como alvos de verbos.

### Configurações do Ramo

| Opção | Descrição |
|-------|-----------|
| **Ramo Inicial** | Define este como ponto de partida da ficção |
| **Ramo de Encerramento** | Marca como final da história |
| **Capítulo de Conclusão** | Vinheta exibida ao encerrar neste ramo |

### Sugestões

Lista de palavras separadas por vírgula exibidas como dicas para o jogador no modo Parser:

```
examinar, pegar, abrir, norte
```

### Feedback Negativo

Mensagem exibida quando o jogador digita algo não reconhecido **neste ramo específico**. Se vazio, usa a mensagem global.

### Conexões (leitura rápida)

Painel de visualização das conexões diretas do ramo (leitura apenas — edite pelo Mapa ou pelas Interações).

---

## Aba: Multimídia

### Imagem de Fundo

| Atributo | Detalhes |
|----------|----------|
| **Formato** | JPG, PNG, WebP |
| **Resolução sugerida (horizontal)** | 1280×720 px |
| **Resolução sugerida (vertical)** | 720×1280 px |
| **Armazenamento** | Embutida no .zip (base64) |

**Efeito Visual (Overlay):**

| Efeito | Código |
|--------|--------|
| Nenhum | `none` |
| Grão de filme | `grain` |
| Chuva | `rain` |
| Vintage | `blur` |
| Fósforo verde | `chromatic` |
| CRT TV | `tv` |
| Confete | `confetti` |
| Glitch | `glitch` |

### Música de Fundo

| Atributo | Detalhes |
|----------|----------|
| **Formato** | MP3 |
| **Comportamento** | Toca em loop ao entrar no ramo |
| **Herança** | Se não configurada, mantém a música anterior |

---

## Tipos de Ramo (vignetteType)

Um ramo pode ser configurado como **Capítulo (Vinheta)**:

| Tipo | Descrição |
|------|-----------|
| `none` | Ramo normal (padrão) |
| `opening` | Tela de abertura do jogo |
| `transition` | Tela cinematográfica de transição |
| `conclusion` | Tela de encerramento (vitória/derrota) |

Ramos do tipo Capítulo têm campos adicionais:
- **Título do Capítulo** (exibido na tela)
- **Texto do Capítulo**
- **Alinhamento do conteúdo** (esquerda/direita)
- **Alinhamento vertical** (centro/baixo)
- **Animação do texto** (fade/typewriter)
- **Velocidade da animação** (1–5)
- **Mostrar Título** / **Mostrar Descrição**

---

## Aba: Objetos

Lista os objetos vinculados a este ramo. Veja a referência completa em [Biblioteca de Objetos](./biblioteca-de-objetos.md).

---

## Aba: Interações

Lista as interações configuradas para este ramo. Veja a referência completa em [Interações](./interacoes.md).

---

## Aba: Escolhas

Disponível no modo **IF (Escolha)**. Permite criar botões clicáveis que levam o jogador a outros ramos.

| Campo | Descrição |
|-------|-----------|
| **Rótulo** | Texto exibido no botão |
| **Destino** | Ramo para onde o jogador é enviado |

---

## Ações do Editor de Ramos

| Botão | Função |
|-------|--------|
| 💾 Salvar | Salva as alterações do ramo atual |
| ↩ Desfazer | Desfaz as alterações não salvas |
| 📋 Copiar | Duplica o ramo com todas as suas configurações |
| 🗑️ Deletar | Remove o ramo e todas as referências a ele |
| ▶ Testar | Abre o preview deste ramo isoladamente |
