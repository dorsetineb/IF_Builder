# Módulo 08 — Projeto Completo: A Chave do Farol

**Visão Geral e Referência Final do Tutorial**

---

## Parabéns! 🎉

Você concluiu o tutorial do IF Builder criando **"A Chave do Farol"** — uma ficção interativa completa com Parser, objetos, inventário, trackers, vinhetas e exportação.

---

## Diagrama da Ficção

```
╔══════════════════╗
║  VINHETA         ║
║  Abertura        ║
║  "A Chave do     ║
║   Farol"         ║
╚════════╤═════════╝
         │ botão "Entrar no Farol"
         ▼
╔══════════════════╗
║  RAMO INICIAL    ║
║  Entrada do      ║◄─── examinar chave → descrição
║  Farol           ║◄─── examinar escada → descrição
╚═══════╤══════════╝
        │
        ├─ "pegar chave" ──────────────────── Chave Enferrujada → Inventário ✓
        │
        ├─ "subir" (SEM chave) ─────────────► fica no ramo (mensagem de bloqueio)
        │
        └─ "subir" (COM chave no inventário) ─────────┐
                                                        ▼
                                            ╔══════════════════╗
                                            ║  RAMO            ║
                                            ║  Corredor        ║
                                            ║  Escuro          ║
                                            ╚══════╤═══════════╝
                                                   │
                                       "continuar" │ → Saúde +1
                                                   │
                                     ┌─────────────┴─────────────┐
                                     │                           │
                              Saúde < 3                    Saúde = 3 (máximo)
                                     │                           │
                                     ▼                           ▼
                         ╔══════════════════╗       ╔══════════════════╗
                         ║  RAMO FINAL      ║       ║  RAMO FINAL      ║
                         ║  Sala da         ║       ║  Derrota         ║
                         ║  Lanterna ✅     ║       ║  ❌              ║
                         ╚══════╤═══════════╝       ╚══════╤═══════════╝
                                │                          │
                                ▼                          ▼
                    ╔═════════════════════╗    ╔══════════════════════╗
                    ║  VINHETA            ║    ║  VINHETA             ║
                    ║  Conclusão Vitória  ║    ║  Conclusão Derrota   ║
                    ╚═════════════════════╝    ╚══════════════════════╝
```

---

## Resumo dos Elementos Criados

### Ramos (4)

| Nome | Tipo | Função |
|------|------|--------|
| Entrada do Farol | Ramo Inicial | Ponto de partida; coletar chave |
| Corredor Escuro | Ramo Intermediário | Drena Saúde; ponte para o topo |
| Sala da Lanterna | Ramo Final (positivo) | Desfecho da história |
| Derrota | Ramo Final (negativo) | Consequência do Tracker de Saúde |

### Capítulos/Vinhetas (3)

| Nome | Tipo | Conectado a |
|------|------|-------------|
| Abertura - O Farol | Abertura | Entrada do Farol |
| Conclusão - Vitória | Conclusão | Sala da Lanterna |
| Conclusão - Derrota | Conclusão | Ramo Derrota |

### Objetos (2)

| Nome | Coletável | Ramo |
|------|-----------|------|
| Chave Enferrujada | ✅ Sim | Entrada do Farol |
| Escada de Ferro | ❌ Não | Entrada do Farol |

### Interações (4)

| Verbos | Alvo | Requisito | Resultado |
|--------|------|-----------|-----------|
| pegar, tomar, coletar | Chave Enferrujada | — | Adiciona ao inventário |
| subir, escalar | Escada de Ferro | — | Mensagem de bloqueio |
| subir, escalar | Escada de Ferro | Chave no inventário | → Corredor Escuro |
| continuar, avançar | — (ambiente) | — | → Sala da Lanterna + Saúde +1 |

### Trackers (1)

| Nome | Inicial | Máximo | Consequência |
|------|---------|--------|-------------|
| Saúde | 0 | 3 | → Ramo Derrota |

---

## Próximos Passos: O que Explorar Além

Com a base criada, você pode ir muito além:

### 🎭 Narrativa mais rica
- Adicione mais ramos e caminhos alternativos
- Crie verbos globais como `ajuda`, `inventário`, `status`
- Use **Vinhetas de Transição** para momentos dramáticos dentro da história

### 🎨 Visual personalizado
- Vá em **Configurações do Jogo** → **Interface** para ajustar cores, fontes e layout
- Experimente os **Temas Predefinidos**: Vampiro, Cyberpunk, Pergaminho...
- Adicione **efeitos de overlay** em ramos específicos (chuva, glitch, CRT)

### 🔧 Mecânicas avançadas
- Crie **múltiplos Trackers** (Saúde + Sanidade + Moedas)
- Use **Verbos Globais** para criar um menu de ajuda
- Configure o **Diário** para registrar ações automaticamente
- Experimente o **modo Escolha** em alguns ramos (botões clicáveis)

### 📤 Compartilhar
- Envie o `.zip` para amigos jogarem
- Publique em plataformas de IF como [itch.io](https://itch.io)
- Importe o `.zip` no editor para colaborar com outra pessoa

---

## Referências do Projeto

Explore a **Referência de Funcionalidades** para detalhes técnicos de cada módulo:

- [Editor de Ramos](../referencia/editor-de-ramos.md)
- [Biblioteca de Objetos](../referencia/biblioteca-de-objetos.md)
- [Interações](../referencia/interacoes.md)
- [Verbos Globais](../referencia/verbos-globais.md)
- [Trackers](../referencia/trackers.md)
- [Mapa de Conexões](../referencia/mapa-de-conexoes.md)
- [Vinhetas e Capítulos](../referencia/vinhetas-capitulos.md)
- [Configurações do Jogo](../referencia/configuracoes-do-jogo.md)
- [Exportação e Compartilhamento](../referencia/exportacao-e-compartilhamento.md)

---

## ✅ Checklist Final do Tutorial

- [ ] Módulo 00 — Introdução: conceitos entendidos
- [ ] Módulo 01 — Projeto criado com modo Parser e sistemas ativados
- [ ] Módulo 02 — 4 ramos criados com descrições e texto interativo
- [ ] Módulo 03 — 2 objetos criados e vinculados ao ramo inicial
- [ ] Módulo 04 — 4 interações criadas (pegar, bloquear, subir, continuar)
- [ ] Módulo 05 — Tracker de Saúde criado e conectado à interação
- [ ] Módulo 06 — 3 vinhetas criadas (abertura, vitória, derrota)
- [ ] Módulo 07 — Projeto salvo como `.zip` e testado offline
- [ ] Jogo completo e funcional do início ao fim 🎉
