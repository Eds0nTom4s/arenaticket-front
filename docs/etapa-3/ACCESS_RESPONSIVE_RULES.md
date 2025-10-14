# Diretrizes de Acessibilidade e Responsividade — ArenaTicket UI

## Acessibilidade
- Todos os elementos interativos com foco navegável (tabIndex, aria-labels)
- Tamanho mínimo dos botões: 44px de altura
- Foco visível e diferenciado de hover
- Mensagens de erro sempre textuais
- Toasts e loaders com aria-live para leitores de tela
- Labels sempre visíveis em campos

## Responsividade
- Layout testado em 320px, 768px, 1366px
- Grid de cards:
  - Mobile: 1 por linha
  - Tablet: 2 por linha
  - Desktop: 3 por linha
- Containers e modais centralizados
- Espaçamentos e tamanhos adaptativos conforme tokens

## Observações
- Nenhum componente pode ser aprovado sem atender a estes critérios
- Testes manuais em diferentes tamanhos de tela são obrigatórios