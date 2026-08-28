# Módulo 02 — Narrativa: Capítulos e Ramos

**Tutorial: A Chave do Farol**  
Tempo estimado: 10–14 minutos

---

## Objetivo deste módulo

Neste módulo você vai:
- Entender os tipos de nós narrativos do IF Builder (**Capítulos**, **Ramificações** e **Cenários**)
- Criar os Capítulos de Abertura e Conclusão
- Criar e escrever as Ramificações textuais da história
- Usar a sintaxe `<palavra>` para criar termos interativos e clicáveis
- Definir o nó inicial da história e os nós de encerramento

---

## Os 3 Tipos de Nós Narrativos

No IF Builder, a história é composta por nós interconectados na página **"Narrativa"**:

| Tipo de Nó | Ícone | Função Principal |
|------------|-------|------------------|
| **Capítulo (Vinheta)** | 🎬 Película | Telas cinematográficas de texto limpo, sem comandos (aberturas, passagens de tempo, epílogos). |
| **Ramificação (Ramo)** | 📄 Documento | Cenas clássicas de texto onde o jogador lê descrições e digita ou clica em decisões. |
| **Cenário (Vistas)** | 🖼️ Moldura | Ambientes visuais baseados em imagens com áreas interativas (hotspots) para exploração direta. *(Veremos no Módulo 03)* |

---

## Passo 1 — Criar o Capítulo de Abertura

Na barra lateral, clique em **"Narrativa"**. No topo da lista de cenas, clique em **"Criar Capítulo ou Ramificação"** e escolha **Capítulo**.

Configure:

| Campo | Valor |
|-------|-------|
| **Nome do Capítulo** | Tempestade na Costa |
| **Texto do Capítulo** | As ondas colidem furiosamente contra as rochas pontiagudas. O vento gelado corta a escuridão enquanto a silhueta solitária do farol surge no topo do penhasco. Você precisa encontrar abrigo antes que o mar engula o caminho. |
| **Texto do Botão de Avanço** | Entrar no Farol |
| **Destino do Botão** | *Entrada do Farol* (ramo que criaremos a seguir) |

> 💡 Marque este capítulo como **"Início da História"** para que a narrativa comece por essa tela cinematográfica.

---

## Passo 2 — Criar as Ramificações de Texto

Clique em **"Criar Capítulo ou Ramificação"** → **Ramificação**.

### 1. Entrada do Farol
- **Título**: `Entrada do Farol`
- **Descrição**:
```
A tempestade do lado de fora faz as antigas janelas vibrarem.

O interior do farol é úmido, frio e silencioso. Uma <escada de ferro> sobe em espiral em direção à escuridão do topo. Próximo à soleira da porta, meio enterrada na poeira, repousa uma <chave enferrujada>.

O uivo do vento ecoa pelas frestas das paredes de pedra.
```

### 2. Corredor Escuro
- **Título**: `Corredor Escuro`
- **Descrição**:
```
Você alcança o patamar superior da escadaria. A escuridão aqui é densa.

Seus olhos levam alguns instantes para se acostumarem à penumbra. No fim do corredor, você distingue o contorno de uma pesada <porta trancada>.

O cheiro de maresia e mofo é sufocante.
```

### 3. Sala da Lanterna (Final Positivo)
- **Título**: `Sala da Lanterna`
- **Descrição**:
```
A cúpula de vidro no topo do farol se abre diante de você. O mecanismo da grande lanterna ainda funciona — feixes luminosos cortam a tempestade lá fora.

O farol está ativo novamente. As embarcações na costa estarão a salvo.
```
- **Configuração**: Na aba Propriedades, marque **"Ramo de Encerramento"**.

### 4. Derrota (Final Negativo)
- **Título**: `Derrota`
- **Descrição**:
```
O frio intenso e a exaustão foram mais fortes que sua determinação. Suas forças se esgotaram e a escuridão do farol tomou conta de tudo.
```
- **Configuração**: Marque como **"Ramo de Encerramento"**.

---

## Passo 3 — Destacando Palavras com `<palavra>`

Ao envolver nomes de objetos ou pontos de interesse entre `< >` na descrição:

1. A palavra ganha **destaque visual** personalizado com a cor de realce do seu tema.
2. No jogo, ao clicar na palavra destacada, o campo de digitação do jogador é preenchido automaticamente com o nome do termo.
3. Isso serve como pista e convite à interação, guiando o jogador sutilmente.

```
Exemplo: Uma <chave enferrujada> brilha no chão.
Resultado: "chave enferrujada" torna-se clicável e destacada.
```

---

## Passo 4 — Multimídia (Imagens e Áudio de Fundo)

Em cada nó narrativo, você pode adicionar atmosfera com multimídia:

- **Imagem de Fundo**: Faça upload de arquivos PNG, JPG ou WebP.
- **Áudio de Fundo**: Faça upload de arquivo MP3 com música ambiente ou efeitos de tempestade.

> 💾 **Privacidade e Autonomia:** Todos os arquivos de áudio e imagem enviados são salvos e compactados diretamente dentro do seu projeto. O jogo final não depende de servidores externos para carregar suas mídias!

---

## ✅ Checklist do Módulo 02

- [ ] Capítulo de Abertura "Tempestade na Costa" criado e marcado como início
- [ ] Ramos "Entrada do Farol", "Corredor Escuro", "Sala da Lanterna" e "Derrota" criados
- [ ] Destaques `<escada de ferro>`, `<chave enferrujada>` e `<porta trancada>` inseridos
- [ ] Ramos finais configurados como encerramentos

---

## Próximo passo

Aprenda como criar ambientes visuais ricos com o novo editor de Cenários:

→ [**Módulo 03 — Cenários e Vistas**](./03-cenarios-e-vistas.md)
