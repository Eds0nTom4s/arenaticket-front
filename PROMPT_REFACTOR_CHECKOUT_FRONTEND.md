# 🎯 Prompt Profissional: Refatoração do Fluxo de Checkout Frontend

**Data:** 15/11/2025  
**Versão da API:** 1.2.0  
**Documentação de Referência:** `CHECKOUT_FLOW.md` e `FRONTEND_INTEGRATION.md`
**Novidade v1.2.0:** Finalização imediata de pagamentos GPO (síncrono)

---

## 📋 Contexto da Tarefa

Você é um agente de IA especializado em desenvolvimento frontend, responsável por refatorar completamente o fluxo de checkout da aplicação **ArenaTicket** (sistema de venda de bilhetes para eventos esportivos do clube GDSE - Grémio Desportivo Sagrada Esperança).

O backend foi atualizado para a **versão 1.2.0** com melhorias significativas em:
- ✅ **Idempotência** (prevenção de pedidos duplicados)
- ✅ **Reserva otimista de bilhetes** (controle de estoque)
- ✅ **Integração aprimorada com AppyPay** (GPO e REFERENCIA)
- ✅ **Webhooks para confirmação automática** de pagamento
- ✅ **Geração automática de bilhetes** com QR codes
- ✅ **Notificações SMS** (referência de pagamento e confirmação)
- ✅ **Novo formato de código de bilhete** (simplificado: 8 dígitos)
- ✨ **NOVO v1.2.0: Finalização IMEDIATA de pagamentos GPO** (síncrono)

**Objetivo:** Implementar um fluxo de checkout robusto, idempotente e resiliente que aproveite todos os recursos do backend atualizado, com **tratamento diferenciado para GPO (síncrono) e REFERENCIA (assíncrono)**.

---

## 🎯 Objetivos da Refatoração

### 1. Implementar Idempotência Completa
- Gerar chave `Idempotency-Key` única por **tentativa de checkout**
- Formato recomendado: `CHECKOUT-{timestamp}-{random}` (max 15 chars para compatibilidade AppyPay)
- Mesma chave deve ser usada em **todas as tentativas de retry** da mesma operação
- Prevenir criação de pedidos duplicados em caso de falhas de rede

### 2. Sistema de Retry Inteligente
- Implementar **exponential backoff** (2s, 4s, 8s...)
- Máximo de **3 tentativas** por operação
- Reutilizar mesma `Idempotency-Key` em todos os retries
- Tratamento gracioso de erros temporários vs permanentes

### 3. Polling de Status Otimizado
- Verificar status do pagamento a cada **5 segundos**
- Timeout de **10 minutos** para pagamentos via REFERENCIA
- **✨ NOVO: Pular polling para GPO** (já finalizado na resposta)
- Parar polling automaticamente quando status = `PAID`, `FAILED` ou `CANCELLED`

### 4. UX Aprimorada
- Loading states claros durante operações assíncronas
- Feedback visual para cada etapa do checkout
- Instruções claras de pagamento (especialmente REFERENCIA)
- **✨ NOVO: Exibição IMEDIATA de bilhetes para GPO**
- Tratamento de erros user-friendly

### 5. Suporte aos Dois Métodos de Pagamento

#### GPO (Multicaixa Express) - ✨ ATUALIZADO v1.2.0
- **Fluxo SÍNCRONO** - finalização imediata
- Response já inclui bilhetes completos
- **Sem necessidade de polling**
- Timeout N/A (resposta instantânea)
- Mensagem: "Pagamento confirmado! Seus bilhetes:"

#### REFERENCIA (ATM/Internet Banking)
- Fluxo assíncrono (mantido)
- Exibir claramente: **Entidade** + **Referência** + **Valor**
- Instruções: "Efetue o pagamento em qualquer ATM Multicaixa ou Internet Banking"
- Polling com timeout de 10 min
- Opção de "copiar referência"

---

## 📐 Arquitetura Recomendada

### Estrutura de Diretórios
```
src/
├── features/
│   └── checkout/
│       ├── components/
│       │   ├── CheckoutForm.tsx           # Formulário de checkout
│       │   ├── PaymentMethodSelector.tsx  # Seletor GPO/REFERENCIA
│       │   ├── PaymentInstructions.tsx    # Instruções de pagamento
│       │   ├── PaymentStatusPolling.tsx   # Componente de polling
│       │   ├── TicketDisplay.tsx          # Exibição de bilhetes
│       │   └── ErrorBoundary.tsx          # Tratamento de erros
│       ├── hooks/
│       │   ├── useCheckout.ts             # Hook principal de checkout
│       │   ├── usePaymentStatus.ts        # Hook de polling
│       │   └── useIdempotency.ts          # Geração de chaves
│       ├── services/
│       │   ├── checkoutService.ts         # API de checkout
│       │   └── paymentService.ts          # API de pagamentos
│       ├── types/
│       │   └── checkout.types.ts          # TypeScript types
│       └── utils/
│           ├── retryWithBackoff.ts        # Lógica de retry
│           └── validators.ts              # Validações
└── lib/
    └── api.ts                              # Axios/Fetch configurado
```

### Stack Tecnológica Recomendada
- **Framework:** React 18+ / Next.js 14+
- **State Management:** React Query / SWR (para caching e polling)
- **Forms:** React Hook Form + Zod (validação)
- **HTTP Client:** Axios (interceptors para retry)
- **UI:** Tailwind CSS / shadcn/ui / MUI

---

## 🔧 Implementações Requeridas

### 1. Hook de Idempotência

```typescript
// hooks/useIdempotency.ts
import { useRef } from 'react';

export function useIdempotency() {
  const keyRef = useRef<string | null>(null);
  
  const generateKey = () => {
    if (!keyRef.current) {
      // Formato: ART-YYYYMMDD-RND (max 15 chars)
      const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      keyRef.current = `ART-${date}-${random}`;
    }
    return keyRef.current;
  };
  
  const resetKey = () => {
    keyRef.current = null;
  };
  
  return { generateKey, resetKey };
}
```

**Requisitos:**
- ✅ Gerar chave única por tentativa de checkout
- ✅ Manter mesma chave durante retries
- ✅ Resetar chave após sucesso ou cancelamento
- ✅ Máximo de 15 caracteres alfanuméricos

---

### 2. Serviço de Checkout com Retry

```typescript
// services/checkoutService.ts
import axios from 'axios';
import { retryWithBackoff } from '../utils/retryWithBackoff';

export interface CheckoutRequest {
  loteId: string;
  quantidade: number;
  compradorNome: string;
  compradorTelefone: string;
  compradorEmail?: string;
  metodoPagamento: 'GPO' | 'REFERENCIA';
}

export interface CheckoutResponse {
  id: string;
  clientRequestId: string;
  referenciaPagamento: string;
  entidade?: string;
  metodoPagamento: 'GPO' | 'REFERENCIA';
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  valorTotal: number;
  mensagem: string;
}

export async function createCheckout(
  data: CheckoutRequest,
  idempotencyKey: string
): Promise<CheckoutResponse> {
  return retryWithBackoff(
    async () => {
      const response = await axios.post<CheckoutResponse>(
        '/api/v1/public/checkout',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey,
          },
        }
      );
      return response.data;
    },
    {
      maxRetries: 3,
      initialDelay: 2000,
      maxDelay: 8000,
      shouldRetry: (error) => {
        // Retry apenas em erros de rede/timeout
        return axios.isAxiosError(error) && (!error.response || error.response.status >= 500);
      },
    }
  );
}
```

**Requisitos:**
- ✅ Retry automático com exponential backoff
- ✅ Distinção entre erros temporários (retry) e permanentes (falha imediata)
- ✅ Header `Idempotency-Key` obrigatório
- ✅ Tratamento de erros 400/409 (sem retry)
- ✅ Tratamento de erros 500/timeout (com retry)

---

### 3. Hook de Polling de Status

```typescript
// hooks/usePaymentStatus.ts
import { useState, useEffect } from 'react';
import { getPaymentStatus, getPedidoBilhetes } from '../services/paymentService';

export interface PaymentStatusResult {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  bilhetes: Bilhete[];
  isLoading: boolean;
  error: Error | null;
}

export function usePaymentStatus(
  pedidoId: string | null,
  timeoutMs: number = 600000 // 10 min padrão
): PaymentStatusResult {
  const [status, setStatus] = useState<PaymentStatusResult['status']>('PENDING');
  const [bilhetes, setBilhetes] = useState<Bilhete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!pedidoId) {
      setIsLoading(false);
      return;
    }
    
    const startTime = Date.now();
    let intervalId: NodeJS.Timeout;
    
    const checkStatus = async () => {
      try {
        // Verificar timeout
        if (Date.now() - startTime > timeoutMs) {
          clearInterval(intervalId);
          setError(new Error('Timeout: pagamento não confirmado'));
          setIsLoading(false);
          return;
        }
        
        // Consultar status
        const statusData = await getPaymentStatus(pedidoId);
        setStatus(statusData.status);
        
        // Status final?
        if (['PAID', 'FAILED', 'CANCELLED'].includes(statusData.status)) {
          clearInterval(intervalId);
          setIsLoading(false);
          
          // Se PAID, buscar bilhetes
          if (statusData.status === 'PAID') {
            const bilhetesData = await getPedidoBilhetes(pedidoId);
            setBilhetes(bilhetesData);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
        setError(err as Error);
      }
    };
    
    // Verificar imediatamente
    checkStatus();
    
    // Polling a cada 5 segundos
    intervalId = setInterval(checkStatus, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [pedidoId, timeoutMs]);
  
  return { status, bilhetes, isLoading, error };
}
```

**Requisitos:**
- ✅ Polling a cada 5 segundos
- ✅ Timeout configurável (padrão 10 min)
- ✅ Parar automaticamente em estados finais
- ✅ Buscar bilhetes automaticamente quando PAID
- ✅ Cleanup ao desmontar componente

---

### 4. Componente Principal de Checkout

```typescript
// components/CheckoutForm.tsx
import { useState } from 'react';
import { useCheckout } from '../hooks/useCheckout';
import { useIdempotency } from '../hooks/useIdempotency';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentInstructions } from './PaymentInstructions';
import { PaymentStatusPolling } from './PaymentStatusPolling';
import { TicketDisplay } from './TicketDisplay';

export function CheckoutForm({ lote, evento }) {
  const { generateKey, resetKey } = useIdempotency();
  const { createOrder, isCreating, error } = useCheckout();
  const [pedido, setPedido] = useState(null);
  const [formData, setFormData] = useState({
    quantidade: 1,
    nome: '',
    telefone: '',
    email: '',
    metodoPagamento: 'REFERENCIA'
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Gerar chave idempotente
      const idempotencyKey = generateKey();
      
      // Criar pedido
      const novoPedido = await createOrder({
        loteId: lote.id,
        quantidade: formData.quantidade,
        compradorNome: formData.nome,
        compradorTelefone: formData.telefone,
        compradorEmail: formData.email,
        metodoPagamento: formData.metodoPagamento
      }, idempotencyKey);
      
      setPedido(novoPedido);
      
    } catch (err) {
      console.error('Erro no checkout:', err);
      // Resetar chave em caso de erro permanente
      if (!err.isRetryable) {
        resetKey();
      }
    }
  };
  
  // Exibir formulário
  if (!pedido) {
    return (
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário */}
        <PaymentMethodSelector 
          value={formData.metodoPagamento}
          onChange={(method) => setFormData({ ...formData, metodoPagamento: method })}
        />
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Processando...' : 'Finalizar Pedido'}
        </button>
        {error && <ErrorMessage error={error} />}
      </form>
    );
  }
  
  // Exibir instruções de pagamento e polling
  return (
    <div>
      <PaymentInstructions pedido={pedido} />
      <PaymentStatusPolling 
        pedidoId={pedido.id}
        metodoPagamento={pedido.metodoPagamento}
        onComplete={(bilhetes) => {
          // Limpar estado e resetar chave
          resetKey();
        }}
      />
    </div>
  );
}
```

**Requisitos:**
- ✅ Validação de campos obrigatórios
- ✅ Geração de chave idempotente antes do submit
- ✅ Loading states claros
- ✅ Tratamento de erros user-friendly
- ✅ Transição automática para tela de pagamento
- ✅ Reset de chave após sucesso

---

### 5. Componente de Instruções de Pagamento

```typescript
// components/PaymentInstructions.tsx
export function PaymentInstructions({ pedido }) {
  if (pedido.metodoPagamento === 'GPO') {
    return (
      <div className="payment-instructions gpo">
        <h3>Pagamento via Multicaixa Express</h3>
        <p>Complete o pagamento no aplicativo Multicaixa</p>
        <div className="qr-code">
          {/* QR Code ou Deep Link */}
        </div>
        <p className="status">Aguardando confirmação...</p>
      </div>
    );
  }
  
  // REFERENCIA
  return (
    <div className="payment-instructions referencia">
      <h3>Instruções de Pagamento</h3>
      <div className="payment-details">
        <div className="detail">
          <label>Entidade:</label>
          <strong>{pedido.entidade}</strong>
        </div>
        <div className="detail">
          <label>Referência:</label>
          <strong>{pedido.referenciaPagamento}</strong>
          <button onClick={() => copyToClipboard(pedido.referenciaPagamento)}>
            Copiar
          </button>
        </div>
        <div className="detail">
          <label>Valor:</label>
          <strong>{pedido.valorTotal} Kz</strong>
        </div>
      </div>
      <p className="instructions">
        Efetue o pagamento em qualquer ATM Multicaixa ou Internet Banking 
        usando a entidade e referência acima.
      </p>
      <p className="sms-note">
        📱 Um SMS foi enviado para {pedido.compradorTelefone} com estas informações.
      </p>
    </div>
  );
}
```

**Requisitos:**
- ✅ Exibição clara de entidade + referência + valor (REFERENCIA)
- ✅ Botão "copiar referência"
- ✅ Deep link ou QR code para app Multicaixa (GPO)
- ✅ Mensagem sobre SMS enviado
- ✅ Instruções claras de pagamento

---

### 6. Componente de Exibição de Bilhetes

```typescript
// components/TicketDisplay.tsx
export function TicketDisplay({ bilhetes }) {
  return (
    <div className="tickets-container">
      <h2>✅ Pagamento Confirmado!</h2>
      <p>Seus bilhetes foram gerados com sucesso:</p>
      
      <div className="tickets-grid">
        {bilhetes.map((bilhete) => (
          <div key={bilhete.id} className="ticket-card">
            <div className="ticket-header">
              <h3>{bilhete.evento.titulo}</h3>
              <span className="lote">{bilhete.lote.nome}</span>
            </div>
            
            <div className="ticket-code">
              <label>Código do Bilhete:</label>
              <strong>{bilhete.codigoTicket}</strong>
              {/* Formato: GDSE-12345678 */}
            </div>
            
            <div className="qr-code">
              <img src={bilhete.codigoQR} alt="QR Code" />
            </div>
            
            <div className="ticket-details">
              <p>Comprador: {bilhete.compradorNome}</p>
              <p>Data: {formatDate(bilhete.evento.dataEvento)}</p>
              <p>Local: {bilhete.evento.local}</p>
            </div>
            
            <button onClick={() => downloadTicket(bilhete)}>
              Baixar Bilhete
            </button>
          </div>
        ))}
      </div>
      
      <div className="sms-confirmation">
        <p>📱 Os códigos dos bilhetes também foram enviados via SMS</p>
      </div>
    </div>
  );
}
```

**Requisitos:**
- ✅ Exibir todos os bilhetes do pedido
- ✅ Código do bilhete: formato `GDSE-12345678` (8 dígitos)
- ✅ QR Code renderizado (base64 image)
- ✅ Informações do evento
- ✅ Opção de download/impressão
- ✅ Nota sobre SMS enviado

---

## 📊 Especificações da API

### Endpoint: Criar Pedido

**POST** `/api/v1/public/checkout`

**Headers:**
```
Content-Type: application/json
Idempotency-Key: CHECKOUT-{timestamp}-{random}
```

**Request Body:**
```json
{
  "loteId": "uuid",
  "quantidade": 2,
  "compradorNome": "João Silva",
  "compradorTelefone": "923456789",
  "compradorEmail": "joao@email.com",
  "metodoPagamento": "REFERENCIA"
}
```

**Response (201):**
```json
{
  "mensagem": "Pedido criado com sucesso",
  "pedido": {
    "id": "uuid",
    "clientRequestId": "ART-20251115-001",
    "referencia": "REF123456",
    "status": "PENDING",
    "valorTotal": 110,
    "pagamento": {
      "referencia": "REF123456",
      "entidade": "12345",
      "metodoPagamento": "REFERENCIA",
      "statusPagamento": "PENDING"
    }
  }
}
```

### Endpoint: Consultar Status

**GET** `/api/v1/public/pagamentos/{pedidoId}/status`

**Response (200):**
```json
{
  "pedidoId": "uuid",
  "status": "PAID",
  "referencia": "REF123456",
  "updatedAt": "2025-11-15T14:30:00Z"
}
```

### Endpoint: Buscar Bilhetes

**GET** `/api/v1/public/pedidos/{pedidoId}/bilhetes`

**Response (200):**
```json
[
  {
    "id": "uuid",
    "codigoTicket": "GDSE-12345678",
    "codigoTicketCompact": "GDSE12345678",
    "codigoQR": "data:image/png;base64,...",
    "status": "VALID",
    "compradorNome": "João Silva",
    "compradorTelefone": "923456789",
    "evento": {
      "titulo": "GDSE vs Kabuscorp",
      "local": "Estádio dos Diamantes",
      "dataEvento": "2025-11-30T16:00:00+01:00"
    },
    "lote": {
      "nome": "Arquibancada",
      "preco": 10.00
    }
  }
]
```

---

## ⚠️ Tratamento de Erros

### Erros Esperados

| Status | Erro | Ação Frontend |
|--------|------|---------------|
| 400 | `Evento não está aberto para vendas` | Exibir mensagem, desabilitar checkout |
| 400 | `Venda deste lote ainda não iniciou` | Exibir countdown até início |
| 400 | `Venda deste lote já encerrou` | Exibir mensagem de esgotado |
| 409 | `Lote não possui bilhetes disponíveis` | Sugerir outros lotes |
| 500 | `Erro ao iniciar pagamento` | Retry automático com backoff |
| Timeout | Falha de rede | Retry automático com backoff |

### Exemplo de Tratamento

```typescript
try {
  const pedido = await createCheckout(data, idempotencyKey);
  setPedido(pedido);
} catch (error) {
  if (error.response?.status === 409) {
    // Erro de estoque - não fazer retry
    showError('Bilhetes esgotados. Por favor, escolha outro lote.');
    resetKey();
  } else if (error.response?.status === 400) {
    // Erro de validação - não fazer retry
    showError(error.response.data.message);
    resetKey();
  } else {
    // Erro temporário - retry já foi feito automaticamente
    showError('Erro ao processar pedido. Por favor, tente novamente.');
  }
}
```

---

## ✅ Checklist de Validação

Antes de considerar a refatoração completa, valide:

### Funcionalidades Core
- [ ] Formulário de checkout com validação completa
- [ ] Geração de chave `Idempotency-Key` única por tentativa
- [ ] Retry automático com exponential backoff (3 tentativas)
- [ ] Mesma chave usada em todos os retries
- [ ] Suporte a GPO e REFERENCIA
- [ ] Instruções claras para cada método de pagamento

### Polling e Status
- [ ] Polling a cada 5 segundos
- [ ] Timeout de 10 min (REFERENCIA) e 3 min (GPO)
- [ ] Parar polling em estados finais (PAID/FAILED/CANCELLED)
- [ ] Buscar bilhetes automaticamente quando PAID

### UX e Feedback
- [ ] Loading states em todas as operações assíncronas
- [ ] Mensagens de erro user-friendly
- [ ] Exibição de entidade + referência (REFERENCIA)
- [ ] Botão "copiar referência"
- [ ] Nota sobre SMS enviado
- [ ] Exibição automática de bilhetes após confirmação

### Bilhetes
- [ ] Código exibido no formato: `GDSE-12345678` (8 dígitos)
- [ ] QR Code renderizado corretamente
- [ ] Informações do evento visíveis
- [ ] Opção de download/impressão
- [ ] Múltiplos bilhetes exibidos em grid

### Qualidade de Código
- [ ] TypeScript com tipos corretos
- [ ] Componentes reutilizáveis
- [ ] Hooks customizados para lógica complexa
- [ ] Tratamento de erros robusto
- [ ] Cleanup de timers/intervals
- [ ] Testes unitários (opcional mas recomendado)

---

## 📚 Documentação de Referência

Para implementação completa, consulte:

1. **CHECKOUT_FLOW.md** - Fluxo completo de checkout com diagramas
2. **FRONTEND_INTEGRATION.md** - Especificação completa da API v1.1.0
3. **Postman/Insomnia Collection** - `ArenaTicket_Insomnia_Collection.json`

---

## 🚀 Próximos Passos

Após refatoração:

1. **Testes de Integração**
   - Testar fluxo completo com GPO
   - Testar fluxo completo com REFERENCIA
   - Testar cenários de erro (estoque, validação, timeout)
   - Testar retry e idempotência

2. **Testes de Performance**
   - Verificar comportamento com múltiplos usuários simultâneos
   - Validar polling não sobrecarrega servidor
   - Otimizar re-renders desnecessários

3. **Acessibilidade**
   - Navegação por teclado
   - Screen readers
   - Contraste de cores
   - Mensagens de erro acessíveis

4. **Analytics**
   - Rastrear conversão do checkout
   - Monitorar erros
   - Tempo médio de checkout
   - Taxa de abandono

---

## 📞 Suporte Técnico

- **Documentação:** `/docs` no repositório
- **Email:** dev@arenaticket.gdse.ao
- **WhatsApp:** +244 925 813 939

---

**Desenvolvido para:** GDSE - Grémio Desportivo Sagrada Esperança  
**Backend API:** v1.1.0  
**Última Atualização:** 15/11/2025
