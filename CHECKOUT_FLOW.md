# 🎫 Fluxo de Checkout - ArenaTicket

**Versão:** 1.1.0  
**Data:** 15/11/2025  
**Ambiente:** Frontend Público (Área de Vendas)

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Idempotência](#idempotência)
3. [Fluxo Completo de Checkout](#fluxo-completo-de-checkout)
4. [Estados do Pedido](#estados-do-pedido)
5. [Métodos de Pagamento](#métodos-de-pagamento)
6. [Confirmação e Geração de Bilhetes](#confirmação-e-geração-de-bilhetes)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Exemplos de Integração](#exemplos-de-integração)

---

## 🌐 Visão Geral

O fluxo de checkout do ArenaTicket garante:
- **Idempotência**: Múltiplas requisições com mesma chave não criam pedidos duplicados
- **Reserva de Bilhetes**: Bilhetes são reservados durante a criação do pedido
- **Integração com AppyPay**: Suporte a GPO (carteira digital) e Referência (ATM/Banking)
- **Confirmação via Webhook**: Sistema recebe notificações automáticas de pagamento
- **Geração Automática de Bilhetes**: Bilhetes são criados após confirmação de pagamento
- **Notificações SMS**: Cliente recebe referência de pagamento e confirmação com códigos dos bilhetes

---

## 🔑 Idempotência

### Como Funciona

O sistema implementa idempotência através do header `Idempotency-Key` ou geração automática de `clientRequestId`.

**Header (Recomendado):**
```http
POST /api/v1/public/checkout
Idempotency-Key: CHECKOUT-20251115-ABC123-USER456
Content-Type: application/json
```

**Geração Automática:**
Se o header não for enviado, o sistema gera automaticamente:
```
ARENATICKET-YYYYMMDD-NNNNN
Exemplo: ARENATICKET-20251115-00001
```

### Comportamento Idempotente

1. **Primeira Requisição**: Cria pedido e retorna resposta com status 201
2. **Requisições Subsequentes** (mesma chave): Retorna o pedido existente sem criar duplicatas

### Formato do clientRequestId

- **Máximo**: 15 caracteres alfanuméricos (limitação AppyPay)
- **Padrão Recomendado**: `{PREFIX}-{DATE}-{ID}`
- **Exemplo**: `ART-20251115-001`

### Validação no Backend

```java
// Se já existe pedido com esse clientRequestId, retornar o existente
Optional<Pedido> existenteOpt = pedidoRepository.findByClientRequestId(clientRequestId);
if (existenteOpt.isPresent()) {
    Pedido existente = existenteOpt.get();
    log.info("Requisição idempotente. Retornando pedido existente id={}", existente.getId());
    return existente;
}
```

**Importante**: A idempotência previne:
- Cobranças duplicadas
- Reservas múltiplas de bilhetes
- Conflitos de estoque
- Notificações SMS duplicadas

---

## 🔄 Fluxo Completo de Checkout

### Diagrama de Sequência

```
┌─────────┐         ┌──────────┐         ┌──────────┐         ┌─────────┐
│Frontend │         │ Backend  │         │ AppyPay  │         │Webhook  │
└────┬────┘         └────┬─────┘         └────┬─────┘         └────┬────┘
     │                   │                     │                    │
     │ 1. POST /checkout │                     │                    │
     │  (Idempotency-Key)│                     │                    │
     ├──────────────────>│                     │                    │
     │                   │                     │                    │
     │                   │ 2. Validar Idempotência                  │
     │                   │    (Check clientRequestId)               │
     │                   │                     │                    │
     │                   │ 3. Criar Pedido     │                    │
     │                   │    (PENDING)        │                    │
     │                   │                     │                    │
     │                   │ 4. Reservar Bilhetes│                    │
     │                   │    (Controle Estoque)                    │
     │                   │                     │                    │
     │                   │ 5. POST /charges    │                    │
     │                   ├────────────────────>│                    │
     │                   │    (OAuth2 + Payload)                    │
     │                   │                     │                    │
     │                   │ 6. Payment Response │                    │
     │                   │<────────────────────┤                    │
     │                   │ (referencia, entidade)                   │
     │                   │                     │                    │
     │                   │ 7. Salvar Pagamento │                    │
     │                   │    (PENDING)        │                    │
     │                   │                     │                    │
     │                   │ 8. SMS Confirmação  │                    │
     │                   │    (REFERENCIA only)│                    │
     │                   │                     │                    │
     │ 9. Response 201   │                     │                    │
     │<──────────────────┤                     │                    │
     │ (pedido + referencia)                   │                    │
     │                   │                     │                    │
     │ 10. Polling       │                     │                    │
     │  GET /pagamentos/{id}/status            │                    │
     ├──────────────────>│                     │                    │
     │<──────────────────┤                     │                    │
     │  (status: PENDING)│                     │                    │
     │                   │                     │                    │
     │                   │                     │ 11. Cliente Paga   │
     │                   │                     │    (GPO ou ATM)    │
     │                   │                     │                    │
     │                   │                     │ 12. POST /webhook  │
     │                   │<────────────────────┼────────────────────┤
     │                   │    (referencia)     │                    │
     │                   │                     │                    │
     │                   │ 13. Validar Pagamento                    │
     │                   │     (Buscar por referencia)              │
     │                   │                     │                    │
     │                   │ 14. Atualizar Status│                    │
     │                   │     (PAID)          │                    │
     │                   │                     │                    │
     │                   │ 15. Gerar Bilhetes  │                    │
     │                   │     (códigos QR)    │                    │
     │                   │                     │                    │
     │                   │ 16. SMS Bilhetes    │                    │
     │                   │     (códigos)       │                    │
     │                   │                     │                    │
     │ 17. Polling       │                     │                    │
     │  GET /pagamentos/{id}/status            │                    │
     ├──────────────────>│                     │                    │
     │<──────────────────┤                     │                    │
     │  (status: PAID)   │                     │                    │
     │                   │                     │                    │
     │ 18. GET /pedidos/{id}/bilhetes          │                    │
     ├──────────────────>│                     │                    │
     │<──────────────────┤                     │                    │
     │  (lista bilhetes) │                     │                    │
     │                   │                     │                    │
```

---

## 📝 Estados do Pedido

### StatusPedido

| Status | Descrição | Transições Permitidas |
|--------|-----------|----------------------|
| **PENDING** | Pedido criado, aguardando pagamento | → PAID, CANCELLED, EXPIRED |
| **PAID** | Pagamento confirmado, bilhetes gerados | → (final) |
| **CANCELLED** | Pedido cancelado manualmente | → (final) |
| **EXPIRED** | Pedido expirou (15 min sem pagamento) | → (final) |

### StatusPagamento

| Status | Descrição |
|--------|-----------|
| **PENDING** | Pagamento iniciado, aguardando confirmação |
| **PAID** | Pagamento confirmado pelo provedor |
| **FAILED** | Pagamento falhou |
| **CANCELLED** | Pagamento cancelado |

### Flags de Controle

```java
pedido.ticketsGenerated = false; // Controla geração de bilhetes
pedido.smsConfirmacaoEnviado = false; // Controla SMS de confirmação
```

**Importante**: Essas flags garantem que bilhetes e SMS não sejam duplicados em webhooks repetidos.

---

## 💳 Métodos de Pagamento

### GPO (Multicaixa Express)

**Características:**
- Pagamento instantâneo via aplicativo Multicaixa
- Cliente precisa ter app instalado
- Confirmação geralmente em segundos
- Deep link para redirecionar ao app

**Fluxo:**
1. Frontend cria pedido com `metodoPagamento: "GPO"`
2. Backend retorna resposta com `paymentId` (referência)
3. Frontend redireciona para app Multicaixa (via deep link ou QR code)
4. Cliente confirma pagamento no app
5. Webhook recebe notificação
6. Bilhetes são gerados automaticamente

**Response:**
```json
{
  "id": "pedido-uuid",
  "clientRequestId": "ART-20251115-001",
  "referenciaPagamento": "REF-123456789",
  "entidade": null,
  "metodoPagamento": "GPO",
  "mensagem": "Pagamento via Multicaixa Express iniciado. Aguarde confirmação no aplicativo.",
  "status": "PENDING"
}
```

### REFERENCIA (ATM/Internet Banking)

**Características:**
- Pagamento assíncrono
- Cliente vai ao ATM ou Internet Banking
- Confirmação pode demorar minutos/horas
- Fornece referência + entidade

**Fluxo:**
1. Frontend cria pedido com `metodoPagamento: "REFERENCIA"`
2. Backend retorna resposta com `referenciaPagamento` e `entidade`
3. Sistema envia SMS com instruções de pagamento
4. Cliente efetua pagamento no ATM/Banking
5. Webhook recebe notificação (pode demorar)
6. Bilhetes são gerados após confirmação

**Response:**
```json
{
  "id": "pedido-uuid",
  "clientRequestId": "ART-20251115-001",
  "referenciaPagamento": "REF-987654321",
  "entidade": "12345",
  "metodoPagamento": "REFERENCIA",
  "mensagem": "Utilize a referência REF-987654321 para efetuar o pagamento em qualquer ATM Multicaixa ou Internet Banking",
  "status": "PENDING"
}
```

**SMS Enviado:**
```
João Silva, recebemos o seu pedido para a compra de 2 bilhetes para:
GDSE vs Kabuscorp
Dia 2025-11-30 16:00

Entidade: 12345
Ref: REF-987654321
Valor: 20.00 Kz

Efetue o pagamento e aguarde confirmacao.
Apoio: 925 813 939
GDSE - Juntos Pela Vitoria
```

---

## ✅ Confirmação e Geração de Bilhetes

### Webhook de Confirmação

**Endpoint:** `POST /api/v1/webhooks/payment/appy` (e compat: `/api/payments/appypay/webhook`)

**Payload Recebido:**
```json
{
  "referencia": "REF-123456789",
  "status": "Success",
  "amount": 20.00,
  "timestamp": "2025-11-15T14:30:00Z"
}
```

### Processamento do Webhook

```java
@PostMapping("/api/v1/webhooks/payment/appy")
public ResponseEntity<String> receberWebhook(@RequestBody Map<String, Object> payload) {
    String referencia = (String) payload.get("referencia");
    
    // 1. Buscar pedido pela referência
    Pedido pedido = pedidoService.findByPaymentId(referencia);
    
    // 2. Verificar idempotência (ticketsGenerated)
    if (pedido.getTicketsGenerated()) {
        return ResponseEntity.ok("Bilhetes já gerados");
    }
    
    // 3. Confirmar pagamento e gerar bilhetes
    pedidoService.confirmarPagamentoEGerarBilhetes(referencia);
    
    return ResponseEntity.ok("Pagamento confirmado");
}
```

### Geração de Bilhetes

Após confirmação, o sistema:

1. **Atualiza Status do Pedido**: `PENDING → PAID`
2. **Atualiza Status do Pagamento**: `PENDING → PAID`
3. **Libera Reserva**: Converte reserva em venda efetiva
4. **Gera Bilhetes**: Um para cada quantidade comprada

**Estrutura do Bilhete:**
```java
Bilhete {
    id: UUID
    codigoTicket: "GDSE-12345678" // Formato legível (13 chars)
    codigoTicketCompact: "GDSE12345678" // Formato compacto para QR (12 chars)
    codigoQR: "data:image/png;base64,..." // QR Code em base64
    status: VALID
    compradorNome: "João Silva"
    compradorTelefone: "923456789"
    evento: Evento
    lote: LoteBilhete
    pedido: Pedido
    vendidoEm: OffsetDateTime
}
```

### SMS de Confirmação

Após geração dos bilhetes, SMS é enviado:

```
João Silva, pagamento confirmado.

Evento: GDSE vs Kabuscorp
2025-11-30 16:00

Bilhetes:
GDSE-1234 5678 9012
GDSE-9876 5432 1098

Mostre o codigo na entrada.
Apoio: 925 813 939
Obrigado por apoiar o Sagrada Esperanca
```

**Flags Atualizadas:**
```java
pedido.setTicketsGenerated(true); // Previne duplicação
pedido.setSmsConfirmacaoEnviado(true); // Previne SMS duplicado
```

---

## ⚠️ Tratamento de Erros

### Erros Comuns no Checkout

| Erro | HTTP | Causa | Solução |
|------|------|-------|---------|
| `Evento não está aberto para vendas` | 400 | Evento fechado | Verificar campo `abertoParaVenda` |
| `Venda deste lote ainda não iniciou` | 400 | Antes de `inicioVenda` | Aguardar data de início |
| `Venda deste lote já encerrou` | 400 | Depois de `fimVenda` | Lote expirado |
| `Lote não possui bilhetes disponíveis` | 409 | Esgotado | Escolher outro lote |
| `Erro ao reservar bilhetes` | 400 | Conflito de estoque | Sistema tentou reservar mais que disponível |
| `Erro ao iniciar pagamento` | 500 | Falha AppyPay | Verificar credenciais/conectividade |
| `Método de pagamento inválido` | 400 | Valor diferente de GPO/REFERENCIA | Corrigir campo |

### Exemplo de Erro

```json
{
  "timestamp": "2025-11-15T14:30:00+01:00",
  "status": 409,
  "error": "Conflict",
  "message": "Lote não possui bilhetes disponíveis",
  "path": "/api/v1/public/checkout"
}
```

### Rollback Automático

Em caso de falha no pagamento, o sistema:
1. Cancela reserva de bilhetes
2. Libera estoque
3. Registra auditoria de falha
4. Não envia SMS

```java
if (!paymentResponse.isSuccess()) {
    // Cancelar reserva em caso de falha
    loteBilheteService.cancelarReserva(loteId, quantidade);
    reservaBilhetesService.cancelarReserva(pedido.getReservaId());
    throw new PaymentException("Erro ao iniciar pagamento");
}
```

---

## 💻 Exemplos de Integração

### 1. Criar Pedido com Idempotência

```javascript
// React/Next.js
async function criarPedido(dadosCheckout) {
  // Gerar chave idempotente única por tentativa
  const idempotencyKey = `CHECKOUT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const response = await fetch('/api/v1/public/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({
        loteId: dadosCheckout.loteId,
        quantidade: dadosCheckout.quantidade,
        compradorNome: dadosCheckout.nome,
        compradorTelefone: dadosCheckout.telefone,
        compradorEmail: dadosCheckout.email,
        metodoPagamento: dadosCheckout.metodo // "GPO" ou "REFERENCIA"
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const pedido = await response.json();
    return pedido;
    
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
}

// Uso
const pedido = await criarPedido({
  loteId: 'lote-uuid-123',
  quantidade: 2,
  nome: 'João Silva',
  telefone: '923456789',
  email: 'joao@email.com',
  metodo: 'REFERENCIA'
});

console.log('Pedido criado:', pedido.id);
console.log('Referência:', pedido.referenciaPagamento);
console.log('Entidade:', pedido.entidade);
```

### 2. Polling de Status do Pagamento

```javascript
// React/Next.js
function usePaymentStatus(pedidoId) {
  const [status, setStatus] = useState('PENDING');
  const [bilhetes, setBilhetes] = useState([]);
  
  useEffect(() => {
    if (!pedidoId) return;
    
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/v1/public/pagamentos/${pedidoId}/status`);
        const data = await response.json();
        
        setStatus(data.status);
        
        if (data.status === 'PAID') {
          // Buscar bilhetes
          const bilhetesResponse = await fetch(`/api/v1/public/pedidos/${pedidoId}/bilhetes`);
          const bilhetesData = await bilhetesResponse.json();
          setBilhetes(bilhetesData);
          
          // Parar polling
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    };
    
    // Verificar a cada 5 segundos
    const interval = setInterval(checkStatus, 5000);
    
    // Verificar imediatamente
    checkStatus();
    
    // Timeout após 10 minutos
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.log('Timeout: pagamento não confirmado em 10 minutos');
    }, 600000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pedidoId]);
  
  return { status, bilhetes };
}

// Componente
function PagamentoStatus({ pedidoId }) {
  const { status, bilhetes } = usePaymentStatus(pedidoId);
  
  if (status === 'PENDING') {
    return <div>Aguardando confirmação do pagamento...</div>;
  }
  
  if (status === 'PAID') {
    return (
      <div>
        <h2>Pagamento Confirmado!</h2>
        <h3>Seus Bilhetes:</h3>
        {bilhetes.map(bilhete => (
          <div key={bilhete.id}>
            <p>Código: {bilhete.codigoTicket}</p>
            <img src={bilhete.codigoQR} alt="QR Code" />
          </div>
        ))}
      </div>
    );
  }
  
  return <div>Status: {status}</div>;
}
```

### 3. Retry com Idempotência

```javascript
// React/Next.js
async function criarPedidoComRetry(dadosCheckout, maxRetries = 3) {
  // Gerar chave idempotente ÚNICA para toda a operação
  const idempotencyKey = `CHECKOUT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  let lastError;
  
  for (let tentativa = 1; tentativa <= maxRetries; tentativa++) {
    try {
      console.log(`Tentativa ${tentativa} de ${maxRetries}`);
      
      const response = await fetch('/api/v1/public/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey // MESMA chave em todas as tentativas
        },
        body: JSON.stringify(dadosCheckout)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      const pedido = await response.json();
      console.log('Pedido criado com sucesso na tentativa', tentativa);
      return pedido;
      
    } catch (error) {
      lastError = error;
      console.error(`Tentativa ${tentativa} falhou:`, error.message);
      
      // Aguardar antes de tentar novamente (exponential backoff)
      if (tentativa < maxRetries) {
        const delay = Math.pow(2, tentativa) * 1000; // 2s, 4s, 8s...
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Falha após ${maxRetries} tentativas: ${lastError.message}`);
}
```

### 4. Fluxo Completo de Checkout

```javascript
// React/Next.js
async function fluxoCheckoutCompleto(dadosCheckout) {
  try {
    // 1. Criar pedido
    console.log('Criando pedido...');
    const pedido = await criarPedidoComRetry(dadosCheckout);
    
    console.log('Pedido criado:', pedido.id);
    console.log('Referência:', pedido.referenciaPagamento);
    
    // 2. Mostrar instruções de pagamento
    if (pedido.metodoPagamento === 'REFERENCIA') {
      alert(`Efetue o pagamento usando:
        Entidade: ${pedido.entidade}
        Referência: ${pedido.referenciaPagamento}
        Valor: ${pedido.total} Kz
      `);
    } else {
      alert('Complete o pagamento no aplicativo Multicaixa Express');
    }
    
    // 3. Iniciar polling de status
    console.log('Aguardando confirmação de pagamento...');
    const bilhetes = await aguardarConfirmacao(pedido.id);
    
    // 4. Exibir bilhetes
    console.log('Bilhetes gerados:', bilhetes);
    exibirBilhetes(bilhetes);
    
    return { pedido, bilhetes };
    
  } catch (error) {
    console.error('Erro no checkout:', error);
    throw error;
  }
}

async function aguardarConfirmacao(pedidoId, timeout = 600000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const response = await fetch(`/api/v1/public/pagamentos/${pedidoId}/status`);
    const data = await response.json();
    
    if (data.status === 'PAID') {
      // Buscar bilhetes
      const bilhetesResponse = await fetch(`/api/v1/public/pedidos/${pedidoId}/bilhetes`);
      return await bilhetesResponse.json();
    }
    
    if (data.status === 'FAILED' || data.status === 'CANCELLED') {
      throw new Error(`Pagamento ${data.status.toLowerCase()}`);
    }
    
    // Aguardar 5 segundos
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  throw new Error('Timeout: pagamento não confirmado');
}

function exibirBilhetes(bilhetes) {
  bilhetes.forEach(bilhete => {
    console.log(`Bilhete: ${bilhete.codigoTicket}`);
    console.log(`Evento: ${bilhete.eventoTitulo}`);
    console.log(`Lote: ${bilhete.loteNome}`);
    console.log(`QR Code: ${bilhete.codigoQR}`);
  });
}
```

---

## 🔐 Segurança

### Headers de Segurança

O sistema valida:
- `Content-Type: application/json`
- `Idempotency-Key` (opcional mas recomendado)
- CORS configurado para permitir domínios autorizados

### Webhooks

Webhooks são endpoints públicos (`permitAll()`) mas devem ser validados:
- Verificar assinatura/token (se AppyPay implementar)
- Validar referência existe no sistema
- Registrar auditoria de todas as chamadas

### Dados Sensíveis

- Telefones são armazenados sem formatação especial
- Emails são opcionais
- Não armazenamos dados de cartão (feito pelo AppyPay)
- Auditoria registra todas as operações

---

## 📊 Monitoramento e Auditoria

### Eventos Auditados

| Evento | Descrição |
|--------|-----------|
| `PEDIDO.CREATE` | Pedido criado |
| `PAGAMENTO.PAYMENT_INITIATED` | Pagamento iniciado |
| `PAGAMENTO.PAYMENT_CONFIRMED` | Pagamento confirmado |
| `BILHETE.GENERATED` | Bilhete gerado |
| `WEBHOOK.RECEIVED` | Webhook recebido |

### Logs Importantes

```java
log.info("Criando pedido: evento={}, lote={}, quantidade={}", eventoId, loteId, quantidade);
log.info("Requisição idempotente. Retornando pedido existente id={}", existente.getId());
log.info("Pedido criado com sucesso: {}, Referência: {}", pedido.getId(), paymentResponse.getReferencia());
log.info("Confirmando pagamento: referencia={}", referencia);
log.info("Bilhetes gerados com sucesso para pedido={}", pedido.getId());
```

---

## 📞 Suporte

- **Email Técnico:** dev@arenaticket.gdse.ao
- **WhatsApp Apoio:** +244 925 813 939
- **Documentação Completa:** [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

---

**Desenvolvido para:** GDSE - Grémio Desportivo Sagrada Esperança  
**Versão:** 1.1.0  
**Última Atualização:** 15/11/2025
