# Plano de Integração API — ArenaTicket

## Endpoints e Mapeamento

### 1. Listagem de eventos
- **Endpoint:** `GET /api/v1/public/eventos`
- **Uso:** Listar eventos disponíveis na Home
- **Referência:** FRONTEND_INTEGRATION

### 2. Detalhe do evento (com lotes)
- **Endpoint:** `GET /api/v1/public/eventos/{id}`
- **Uso:** Obter detalhes e lotes ao abrir modal de checkout
- **Referência:** FRONTEND_INTEGRATION

### 3. Criar pedido (checkout)
- **Endpoint:** `POST /api/v1/public/checkout`
- **Payload:**
  - eventoId
  - loteId
  - quantidade
  - compradorNome
  - compradorTelefone
  - metodoPagamento
  - (opcional) compradorEmail, numeroSocio
- **Uso:** Submeter compra rápida
- **Referência:** FRONTEND_INTEGRATION

### 4. Polling de status do pedido
- **Endpoint:** `GET /api/v1/public/pedidos/{pedidoId}`
- **Uso:** Verificar status do pagamento após checkout
- **Referência:** FRONTEND_INTEGRATION

### 5. Validação de bilhete
- **Endpoint:** `POST /api/v1/public/validar`
- **Payload:**
  - codigoTicket
- **Uso:** Validação de bilhete/QR
- **Referência:** FRONTEND_INTEGRATION

## Observações
- Usar apenas campos e formatos declarados na documentação.
- Se houver dúvida sobre formato (ex: deepLink, qrCode, tempo de expiração), PARAR e solicitar esclarecimento ao PO.