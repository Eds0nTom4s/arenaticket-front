# Lista Mínima de Componentes — ArenaTicket

## 1. TicketCard
- **Props:** evento (id, título, banner, data, preço/lote principal)
- **Estados visuais:** normal, sold-out, em destaque
- **Comportamento:** abre modal de checkout ao clicar

## 2. CheckoutModal
- **Props:** evento, lotes disponíveis
- **Estados visuais:** aberto, carregando, erro, sucesso
- **Comportamento:** fluxo rápido (quantidade, nome, telefone, método de pagamento, submeter)

## 3. QuantitySelector
- **Props:** valor atual, mínimo, máximo
- **Estados visuais:** enabled, disabled
- **Comportamento:** selecionar quantidade de bilhetes

## 4. PaymentSelector
- **Props:** métodos disponíveis, selecionado
- **Estados visuais:** enabled, disabled
- **Comportamento:** escolher método de pagamento

## 5. NotificationToast
- **Props:** mensagem, tipo (erro, sucesso, info)
- **Estados visuais:** visível, oculto
- **Comportamento:** exibir feedback ao usuário

## 6. TicketBadge
- **Props:** status (sold-out, limited, on-sale)
- **Estados visuais:** cor e texto conforme status
- **Comportamento:** exibir estado do lote

## Observações
- Não implementar código nesta etapa.
- Todos os componentes devem ser minimalistas e neutros.