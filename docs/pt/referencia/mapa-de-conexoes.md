# Referência — Mapa de Conexões

O **Mapa de Conexões** oferece uma visão gráfica de toda a estrutura da sua ficção interativa — ramos, capítulos, conexões e estatísticas.

---

## Acesso

Sidebar → **Mapa de Ramos**

---

## Visão Geral do Mapa

O mapa exibe todos os ramos e capítulos como nós conectados por linhas:

```
[Abertura] ──→ [Entrada do Farol] ──→ [Corredor Escuro] ──→ [Sala da Lanterna]
                                                │
                                                └──→ [Derrota]
```

### Legenda de Nós

| Cor/Estilo | Tipo |
|-----------|------|
| 🟦 Azul | Ramo inicial |
| ⬜ Cinza | Ramo comum |
| 🟩 Verde | Ramo final (conclusão positiva) |
| 🟥 Vermelho | Ramo final (derrota/negativo) |
| 🎬 Película | Capítulo/Vinheta |
| ⚠️ Laranja | Ramo órfão (sem entrada) |

---

## Navegação no Mapa

| Ação | Como fazer |
|------|-----------|
| **Mover o mapa** | Clicar e arrastar no fundo |
| **Zoom** | Scroll do mouse |
| **Selecionar nó** | Clicar no ramo/capítulo |
| **Ir ao editor** | Clicar duas vezes ou botão "Editar" |
| **Mover nó** | Arrastar o card do ramo |
| **Reorganizar** | Botão "Reorganizar" — layout automático |

---

## Ferramentas do Mapa

| Botão | Função |
|-------|--------|
| **Ver Tudo** | Centraliza o mapa para exibir todos os nós |
| **Reorganizar** | Aplica layout automático baseado em hierarquia |
| **Órfãos** | Destaca ramos sem nenhuma entrada |
| **Estatísticas** | Abre o painel de estatísticas do projeto |
| **Legenda** | Exibe a legenda de cores e tipos |

---

## Painel de Estatísticas

O mapa inclui um **modal de estatísticas completo** com:

### Métricas Narrativas

| Métrica | Descrição |
|---------|-----------|
| Total de Ramos | Número de ramos no projeto |
| Total de Capítulos | Número de vinhetas |
| Palavras totais | Contagem de palavras em todas as descrições |
| Tempo de leitura | Estimativa baseada em 200 palavras/min |

### Auditoria QA

| Alerta | Descrição |
|--------|-----------|
| **Ramos Órfãos** | Ramos sem nenhuma entrada — podem ser inacessíveis |
| **Becos sem saída** | Ramos sem saída que não são marcados como finais |
| **Objetos Inúteis** | Objetos não vinculados a nenhum ramo ou interação |
| **Ações Ocas** | Interações sem resultado configurado |

### Alertas de Performance

| Alerta | Trigger |
|--------|---------|
| Imagem pesada | Arquivo de imagem acima de ~0.5MB |
| Descrição muito longa | Descrição acima de 2000 caracteres |
| Muitas interações | Mais de 15 interações em um único ramo |

---

## Posicionamento Manual

Arraste os nós do mapa para organizar visualmente sua estrutura narrativa.

> 💡 O posicionamento é salvo no projeto. Use o espaço para representar a geografia da ficção — por exemplo, coloque ramos de exploração horizontalmente e ramos de consequência abaixo.

---

## Quick Navigation

Clicar em qualquer nó no mapa:
- **Clique simples**: Seleciona e exibe resumo do ramo
- **Clique duplo** (ou botão "Ir ao Editor"): Abre o Editor de Ramos daquele nó
