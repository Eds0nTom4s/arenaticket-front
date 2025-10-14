# Especificação — CheckoutModal (ArenaTicket UI)

## Descrição
Modal visual para simular o fluxo de compra de bilhete.

## Estrutura Visual
- Overlay escuro com animação suave (`--animation-fade`)
- Container centralizado com raio e sombra
- Header: título do evento e botão fechar
- Campos:
  - Quantidade (selector visual: “– 1 +”)
  - Nome completo
  - Telefone
- Seção de pagamento (mock):
  - Botões: “Multicaixa Express” e “Referência”
- Botão principal: “Confirmar Compra”

## Requisitos de Interação
- Abrir ao clicar em TicketCard
- Fechar com ESC ou clique fora
- Todos os inputs e botões acessíveis por teclado
- Foco inicial no primeiro campo
- Visual idêntico em mobile, tablet e desktop

## Layout
- Espaçamentos e alinhamento centralizados
- Tokens de cor, raio, sombra e transição

## Observações
- Nenhum endpoint real nesta etapa
- Conteúdo e ações são simulados