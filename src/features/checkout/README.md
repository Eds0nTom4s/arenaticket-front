# 🎫 Feature: Checkout

Sistema completo de checkout para venda de bilhetes do ArenaTicket, implementado seguindo as especificações da API v1.1.0 do backend.

## 📋 Estrutura

```
checkout/
├── components/          # Componentes Vue reutilizáveis
│   ├── PaymentMethodSelector.vue      # Seletor de método (GPO/REFERENCIA)
│   ├── PaymentInstructions.vue        # Instruções de pagamento
│   ├── PaymentStatusPolling.vue       # Polling de status
│   └── TicketDisplay.vue              # Exibição de bilhetes
├── hooks/              # Hooks customizados (Composition API)
│   ├── useIdempotency.ts              # Gerenciamento de chave idempotente
│   ├── usePaymentStatus.ts            # Polling de status de pagamento
│   └── useCheckout.ts                 # Hook principal de checkout
├── services/           # Serviços de API
│   ├── checkoutService.ts             # API de checkout
│   └── paymentService.ts              # API de pagamentos
├── types/              # Tipos TypeScript
│   └── checkout.types.ts              # Interfaces e tipos
└── utils/              # Utilitários
    ├── retryWithBackoff.ts            # Retry com exponential backoff
    └── validators.ts                  # Validações e formatação
```

## 🚀 Recursos Implementados

### ✅ Idempotência
- Geração de chave única por tentativa: `ART-YYYYMMDD-RND`
- Mesma chave usada em todos os retries da mesma operação
- Previne pedidos duplicados

### ✅ Retry Inteligente
- Exponential backoff: 2s, 4s, 8s
- Máximo de 3 tentativas
- Distinção entre erros temporários (retry) e permanentes (falha)

### ✅ Polling de Status
- Verificação a cada 5 segundos
- Timeout configurável:
  - GPO: 3 minutos (pagamento instantâneo)
  - REFERENCIA: 10 minutos (pagamento assíncrono)
- Para automaticamente em estados finais (PAID/FAILED/CANCELLED)

### ✅ Suporte a Métodos de Pagamento

#### GPO (Multicaixa Express)
- Pagamento instantâneo
- Deep link/QR code para app
- Timeout: 3 minutos

#### REFERENCIA (ATM/Internet Banking)
- Pagamento assíncrono
- Exibição de Entidade + Referência + Valor
- Botão "copiar referência"
- Timeout: 10 minutos

### ✅ Validações
- Telefone angolano: `9XXXXXXXX`
- Nome: mínimo 3 caracteres
- Email: opcional mas validado
- Quantidade: positivo

## 📝 Como Usar

### 1. Importar no componente

```vue
<template>
  <CheckoutWizard
    v-if="showCheckout"
    :evento="eventoSelecionado"
    @close="showCheckout = false"
    @confirm="handleCheckoutConfirm"
  />
</template>

<script setup>
import CheckoutWizard from '@/components/CheckoutWizard.vue';
import { ref } from 'vue';

const showCheckout = ref(false);
const eventoSelecionado = ref(null);

function handleCheckoutConfirm(bilhetes) {
  console.log('Bilhetes gerados:', bilhetes);
  showCheckout.value = false;
}
</script>
```

### 2. Fluxo de Checkout

1. **Seleção de Lote** - Escolher lote disponível
2. **Quantidade** - Definir quantidade de bilhetes
3. **Dados do Comprador** - Nome, telefone, email, método de pagamento
4. **Confirmação** - Revisar dados e confirmar
5. **Pagamento** - Instruções e polling de status
6. **Bilhetes** - Exibição dos bilhetes gerados

## 🔧 Hooks Disponíveis

### useIdempotency
```typescript
const { generateKey, resetKey, currentKey } = useIdempotency();

// Gerar chave
const key = generateKey(); // "ART-241115-ABC"

// Resetar após sucesso
resetKey();
```

### useCheckout
```typescript
const { isCreating, error, createOrder } = useCheckout();

// Criar pedido
const pedido = await createOrder(checkoutData, idempotencyKey);
```

### usePaymentStatus
```typescript
const { 
  status, 
  bilhetes, 
  isLoading, 
  startPolling 
} = usePaymentStatus({
  timeoutMs: 600000,
  onPaid: (bilhetes) => console.log('Pago!', bilhetes),
  onError: (error) => console.error(error),
});

// Iniciar polling
startPolling(pedidoId);
```

## 🌐 Endpoints Utilizados

### Criar Pedido
```
POST /api/v1/public/checkout
Headers:
  Content-Type: application/json
  Idempotency-Key: ART-241115-ABC

Body:
{
  "loteId": "uuid",
  "quantidade": 2,
  "compradorNome": "João Silva",
  "compradorTelefone": "923456789",
  "compradorEmail": "joao@email.com",
  "metodoPagamento": "REFERENCIA"
}
```

### Consultar Status
```
GET /api/v1/public/pagamentos/{pedidoId}/status
```

### Buscar Bilhetes
```
GET /api/v1/public/pedidos/{pedidoId}/bilhetes
```

## 🎨 Componentes

### PaymentMethodSelector
Seletor visual de método de pagamento (GPO/REFERENCIA)

```vue
<PaymentMethodSelector
  v-model="metodoPagamento"
/>
```

### PaymentInstructions
Instruções específicas por método de pagamento

```vue
<PaymentInstructions
  :pedido="pedidoCriado"
  :telefone="telefoneComprador"
/>
```

### PaymentStatusPolling
Polling automático com exibição de status

```vue
<PaymentStatusPolling
  :pedido="pedidoCriado"
  :telefone="telefoneComprador"
  :metodo-pagamento="metodoPagamento"
  @complete="handleComplete"
  @error="handleError"
/>
```

### TicketDisplay
Exibição dos bilhetes com QR codes

```vue
<TicketDisplay
  :bilhetes="bilhetesGerados"
  @close="fecharModal"
/>
```

## 🛠️ Utilitários

### Validações
```typescript
import { 
  isValidAngolaTelefone,
  isValidEmail,
  isValidNome,
  formatTelefone,
  formatKwanza,
  formatDataEvento,
} from '@/features/checkout/utils/validators';

// Validar telefone
isValidAngolaTelefone('923456789'); // true

// Formatar
formatTelefone('923456789'); // "923 456 789"
formatKwanza(1000); // "1.000,00 Kz"
```

### Retry com Backoff
```typescript
import { retryWithBackoff } from '@/features/checkout/utils/retryWithBackoff';

const result = await retryWithBackoff(
  async () => {
    return await fetch('/api/endpoint');
  },
  {
    maxRetries: 3,
    initialDelay: 2000,
    maxDelay: 8000,
  }
);
```

## 📊 Estados do Pedido

- **PENDING** - Aguardando pagamento
- **PAID** - Pagamento confirmado, bilhetes gerados
- **CANCELLED** - Pedido cancelado
- **EXPIRED** - Pedido expirou (15 min)

## 📊 Estados do Pagamento

- **PENDING** - Pagamento iniciado
- **PAID** - Pagamento confirmado
- **FAILED** - Pagamento falhou
- **CANCELLED** - Pagamento cancelado

## 🔐 Segurança

- Validação de dados no frontend e backend
- Chave idempotente previne duplicação
- Telefone sem formatação especial
- Auditoria de todas as operações

## 📱 Responsividade

Todos os componentes são totalmente responsivos:
- Desktop: Layout em grid/flex otimizado
- Tablet: Ajustes de padding e espaçamento
- Mobile: Layout em coluna única

## 🎯 Boas Práticas

1. ✅ **Sempre gerar chave idempotente** antes de criar pedido
2. ✅ **Resetar chave** após sucesso ou cancelamento
3. ✅ **Usar mesma chave** em todos os retries
4. ✅ **Limpar telefone** antes de enviar ao backend
5. ✅ **Validar dados** antes de submeter
6. ✅ **Tratar erros** de forma user-friendly
7. ✅ **Cleanup de timers** ao desmontar componentes

## 📞 Suporte

- **Email:** dev@arenaticket.gdse.ao
- **WhatsApp:** +244 925 813 939
- **Documentação Backend:** `CHECKOUT_FLOW.md`

---

**Versão:** 1.0.0  
**Data:** 15/11/2025  
**Autor:** ArenaTicket Development Team
