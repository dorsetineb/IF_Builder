# IF Builder v0.6.1

## Release v0.6.1 - Melhorias na Aba Interações & Personalização Visual

Nesta versão, trazemos uma reformulação completa da experiência de edição na aba **Interações** do Editor de Cenas, além de refinamentos visuais na tela inicial do aplicativo.

### ✨ Novidades e Melhorias

#### 🎭 Editor de Interações (Cenas e Capítulos)
- **Campo Título Opcional**: Adicionada a possibilidade de dar um título personalizado para a interação (ex: *"Abrir baú trancado"*). Quando informado, o título passa a identificar a interação na lista lateral e nos mapas de conexão.
- **Verbos Encapsulados em Tags (Chips)**: O campo de verbos agora fica posicionado no topo e transforma palavras separadas por vírgula ou Enter em tags visuais dinâmicas com remoção individual.
- **Identificação Limpa na Lista**: A lista lateral exibe diretamente o alvo vinculado (ex: `Porta`) sem o prefixo "Alvo:", e oculta a linha secundária caso não haja nenhum alvo selecionado.
- **Reordenação e Simetria dos Campos**:
  - *Alvo da ação (opcional)* + checkbox *Remove Alvo* alinhados na linha de cima.
  - *Requer item do inventário* + checkbox *Consome item* alinhados na linha de baixo.
- **Bloqueio Inteligente de Descrição**: O campo *"Atualizar descrição da ramificação"* é automaticamente desabilitado quando uma ramificação de destino (*Ir para Ramificação*) é configurada.
- **Card de Efeito Sonoro Refatorado**: Botão *"Adicionar"* quando sem áudio e layout em card com nome do arquivo (`.mp3`/`.wav`) e botão de remoção rápida (lixeira) quando carregado.

#### 🎨 Identidade Visual & Infraestrutura
- **Logotipo IF com a Cor do Tema**: O logotipo ASCII `IF` exibido na tela inicial do aplicativo agora adota dinamicamente a cor da aparência selecionada (Tema), alinhando-se ao visual do logo da tela de BIOS.
- **Proxy Direto de Downloads e Atualizações**: Integração com API autenticada para download de instaladores desktop e logs de desenvolvimento em repositórios privados.
