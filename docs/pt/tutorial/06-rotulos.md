# Módulo 06 — Rótulos e Textos do Sistema

**Tutorial: A Chave do Farol**  
Tempo estimado: 6–10 minutos

---

## Objetivo deste módulo

Neste módulo você vai aprender a personalizar todos os textos que o jogo exibe ao jogador através da página **"Rótulos"** no menu lateral esquerdo:
- Entender a importância dos rótulos para a **ambientação**, **tom de voz** e **localização** da sua ficção
- Personalizar os botões do sistema (Salvar, Carregar, Reiniciar, Retrospectiva, Iniciar)
- Customizar os placeholders e botões do campo de comandos (Parser)
- Definir mensagens padrão de erro e feedback (comando desconhecido, inventário vazio, rolagem de dados)
- Testar os textos no painel de pré-visualização ao vivo

---

## Acesso à Página de Rótulos

No menu lateral esquerdo, clique no quarto item: 🔤 **Rótulos**.

A interface exibe todos os campos de texto que compõem os menus e mensagens do jogo final, com uma prévia interativa à direita.

---

## Por que personalizar os Rótulos?

Ajustar os rótulos transforma a experiência de jogo. Em vez de botões genéricos, você pode usar termos que combinam com o universo da sua história:

| Elemento Padrão | Exemplo Sci-Fi / Cyberpunk | Exemplo Terror Cósmico | Exemplo Fantasia Medieval |
|-----------------|----------------------------|------------------------|---------------------------|
| **Salvar** | Gravar no Disco Neural | Registrar no Grimório | Salvar na Memória |
| **Carregar** | Restaurar Backup | Ler Registro Antigo | Carregar Jornada |
| **Reiniciar** | Reinicializar Sistema | Despertar do Pesadelo | Recomeçar a Saga |
| **Inventário** | Módulo de Carga | Bolsa de Viagem | Mochila de Couro |
| **Comando Desconhecido** | Erro de Sintaxe 404. | A mente não compreende tal ato. | Você não sabe como fazer isso. |

---

## 1. Botões dos Menus e Telas Iniciais

Configure os textos dos botões principais:

| Campo | Texto Padrão | Sugestão para *A Chave do Farol* |
|-------|--------------|----------------------------------|
| **Título do Menu de Salvar** | Salvar Jogo | Gravar Progresso |
| **Título do Menu de Carregar** | Carregar Jogo | Restaurar Memória |
| **Botão de Retrospectiva** | Retrospectiva | Relembrar Jornada |
| **Botão de Ver Finais** | Ver Finais | Galeria de Destinos |
| **Botão de Voltar ao Menu** | Menu Principal | Voltar ao Início |
| **Botão de Abertura** | Iniciar | Entrar no Farol |

---

## 2. Campo de Entrada do Parser

Quando o jogador joga no modo Parser, o campo de digitação precisa de instruções claras:

- **Placeholder do Campo**: O texto fantasma dentro da barra de digitação.
  - *Exemplo*: `O que você deseja fazer agora?` ou `Digite uma ação (ex: olhar, pegar chave)...`
- **Texto / Ícone do Botão de Ação**: O botão que confirma o envio do comando.
  - *Exemplo*: `Executar`, `Enviar` ou ícone de seta/enter.

---

## 3. Mensagens de Feedback do Sistema

Quando o jogador tenta interagir de formas imprevistas, o jogo responde com mensagens padrão:

### 1. Comando Desconhecido
Exibido quando o verbo digitado não existe ou não foi configurado para a cena atual:
- *Texto*: `O vento uiva tão forte que você não consegue entender o que tentou fazer.` ou `Você tenta, mas nada acontece.`

### 2. Inventário Vazio
Exibido quando o jogador digita `inventario` ou abre a mochila sem possuir itens:
- *Texto*: `Seus bolsos estão vazios. Você não carrega nenhum objeto no momento.`

### 3. Rolagem de Dados
Textos exibidos no modal de dados:
- *Título*: `Teste de Habilidade`
- *Mensagem de Sucesso*: `Sucesso! O destino esteve ao seu favor.`
- *Mensagem de Falha*: `Falha! A sorte lhe deu as costas desta vez.`

---

## 4. Testando e Salvando os Rótulos

1. Digite os novos textos nos campos desejados.
2. Acompanhe a mudança visual em tempo real no painel direito de **Pré-visualização**.
3. Clique em **"Salvar Alterações"** no topo da página.

---

## ✅ Checklist do Módulo 06

- [ ] Textos de Salvar, Carregar e Reiniciar adaptados ao tom da história
- [ ] Placeholder do campo de comando configurado
- [ ] Mensagens de comando desconhecido e inventário vazio personalizadas
- [ ] Alterações salvas com sucesso

---

## Próximo passo

Aprenda a criar e configurar itens e colecionáveis para o inventário:

→ [**Módulo 07 — Objetos e Inventário**](./07-objetos-e-inventario.md)
