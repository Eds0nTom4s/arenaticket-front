# Tratamento Inteligente de Falhas de Pagamento

## 📋 Visão Geral

Sistema implementa estratégias diferenciadas para tratar falhas de pagamento conforme o **método de pagamento** utilizado:

- **GPO (Multicaixa Express)**: Resposta **síncrona** → Tratamento imediato
- **REFERENCIA (Pagamento por ATM)**: Resposta **assíncrona** → Tratamento via webhook

---

## 🎯 Estratégia por Método de Pagamento

### 1. **GPO (Multicaixa Express) - Resposta Imediata**

#### ✅ **Cenário: Pagamento Aprovado**
```
Cliente → AppyPay → PAID (imediato)
└─ Sistema gera bilhetes na mesma requisição
└─ SMS enviado com códigos dos bilhetes
└─ Status: PAID
```

#### ❌ **Cenário: Pagamento Recusado**
```
Cliente → AppyPay → FAILED (imediato)
└─ Sistema marca pedido como FAILED
└─ Libera estoque imediatamente
└─ SMS enviado com motivo da recusa
└─ Status: FAILED
```

**Vantagens:**
- ⚡ Feedback instantâneo ao cliente
- 🔄 Estoque liberado imediatamente para outros compradores
- 📱 Cliente já sabe se pode tentar novamente
- 🚫 Não espera webhook (mais eficiente)

**Implementação:**
```java
// PedidoService.criarPedidoComPagamento()
if (isGPO && isFailed) {
    // Marca pagamento e pedido como FAILED
    // Libera estoque
    // Envia SMS de falha
    // Registra auditoria
}
```

---

### 2. **REFERENCIA (ATM/Banking) - Resposta Assíncrona**

#### ⏳ **Cenário: Pagamento Pendente**
```
Cliente → AppyPay → PENDING
└─ Reserva criada (expira em 15min)
└─ SMS enviado com referência/entidade
└─ Status: PENDING
└─ Cliente paga no ATM
└─ Webhook recebido com status
```

#### ✅ **Cenário: Webhook PAID**
```
AppyPay → Webhook (status=PAID)
└─ Sistema gera bilhetes
└─ Confirma reserva
└─ SMS enviado com códigos
└─ Status: PAID
```

#### ❌ **Cenário: Webhook FAILED**
```
AppyPay → Webhook (status=FAILED)
└─ Sistema marca pedido como FAILED
└─ Libera estoque imediatamente
└─ SMS enviado com motivo da falha
└─ Status: FAILED
```

**Implementação:**
```java
// WebhookController.receberPagamentoAppy()
if (isFailed) {
    pedidoService.processarFalhaPagamento(
        referencia, 
        statusWebhook, 
        motivo
    );
}
```

---

## 📊 Estados do Pedido

```
PENDING  → Aguardando pagamento (reserva ativa)
PAID     → Pago e bilhetes gerados
FAILED   → Pagamento recusado/falhou (estoque liberado)
CANCELLED → Cancelado manualmente
```

---

## 🔄 Liberação de Estoque

### **Automática (Falha Imediata)**
- GPO recusado: **imediato**
- Webhook FAILED: **imediato**

### **Automática (Expiração)**
- Reserva não confirmada: **15 minutos** (scheduler)

### **Manual**
- Admin pode cancelar pedido via painel

---

## 📱 Notificações SMS

### **Pagamento Recusado (GPO ou Webhook)**
```
{comprador}, o pagamento para {evento} não foi processado.

Ref: {referencia}
Motivo: {motivoFalha}

Tente novamente ou contacte 925 813 939.
GDSE - Juntos Pela Vitoria
```

### **Referência (ATM/Banking)**
```
{comprador}, recebemos o seu pedido para {evento}.

Entidade: {entidade}
Ref: {referencia}
Valor: {valor} Kz

Efetue o pagamento e aguarde confirmação.
GDSE - Juntos Pela Vitoria
```

### **Pagamento Confirmado**
```
{comprador}, pagamento confirmado.

Evento: {evento}
{data} {hora}

Bilhetes:
{codigo1}
{codigo2}

Mostre o código na entrada.
GDSE - Juntos Pela Vitoria
```

---

## 🔍 Auditoria

Todos os eventos são registrados na tabela `audit_logs`:

```sql
-- Falha imediata (GPO)
PAGAMENTO | PAYMENT_FAILED_IMMEDIATE | {pedidoId, motivo, metodoPagamento}

-- Falha assíncrona (Webhook)
PAGAMENTO | PAYMENT_FAILED | {pedidoId, referencia, statusWebhook, motivoFalha}
PAGAMENTO | WEBHOOK_PAYMENT_FAILED | {referencia, status}

-- Sucesso
PAGAMENTO | PAYMENT_INITIATED | {pedidoId, referencia, metodo}
PAGAMENTO | WEBHOOK_PAYMENT_RECEIVED | {referencia, status}
PEDIDO | PAYMENT_CONFIRMED | {referencia, ticketsGenerated, deltaGenerated}
```

---

## 🧪 Testes Recomendados

### **GPO - Falha Imediata**
1. Fazer checkout com método GPO
2. Simular recusa no AppyPay (saldo insuficiente)
3. Verificar:
   - [ ] Pedido marcado como FAILED
   - [ ] Estoque liberado
   - [ ] SMS de falha recebido
   - [ ] Cliente pode fazer novo pedido

### **REFERENCIA - Falha Via Webhook**
1. Fazer checkout com método REFERENCIA
2. Receber referência de pagamento
3. Simular webhook com `status=FAILED`
4. Verificar:
   - [ ] Pedido marcado como FAILED
   - [ ] Estoque liberado
   - [ ] SMS de falha recebido
   - [ ] Auditoria registrada

### **REFERENCIA - Expiração**
1. Fazer checkout com método REFERENCIA
2. Não pagar (aguardar 15min)
3. Scheduler executa expiração
4. Verificar:
   - [ ] Reserva cancelada
   - [ ] Estoque liberado
   - [ ] Pedido ainda PENDING (não FAILED)

---

## 🚀 Próximas Melhorias

### **Prioridade Alta**
- [ ] Dashboard admin: listar pedidos FAILED para análise
- [ ] Endpoint para cliente tentar novamente (mesmo pedido)
- [ ] Retry automático para falhas temporárias de rede

### **Prioridade Média**
- [ ] Template de email de falha (além de SMS)
- [ ] Estatísticas de taxa de aprovação por método
- [ ] Alertas para admin se taxa de falha > 20%

### **Prioridade Baixa**
- [ ] Análise de motivos de falha mais comuns
- [ ] Sugestões automáticas ao cliente (ex: "Tente outro método")
- [ ] Link direto para suporte via WhatsApp

---

## 📖 Referências Técnicas

### **Arquivos Modificados**
- `StatusPedido.java` - Adicionado estado FAILED
- `PedidoService.java` - Lógica de tratamento de falhas GPO
- `WebhookController.java` - Tratamento de webhook FAILED
- `PedidoService.processarFalhaPagamento()` - Método auxiliar para falhas

### **Endpoints Afetados**
- `POST /api/v1/public/checkout` - Tratamento síncrono GPO
- `POST /api/v1/webhooks/payment/appy` - Tratamento assíncrono REFERENCIA

### **Logs Importantes**
```
[PAYMENT] GPO recusado imediatamente (FAILED)
[PAYMENT_FAILURE] Processando falha de pagamento
[NOTIFY] SMS de falha enviado
```

---

## 💡 Decisões de Design

### **Por que não esperar webhook para GPO?**
- GPO retorna resposta imediata (síncrona)
- Esperar webhook seria ineficiente
- Cliente tem feedback instantâneo
- Estoque é liberado mais rapidamente

### **Por que não cancelar reserva ao criar pedido FAILED?**
- Reserva já é cancelada no `processarFalhaPagamento()`
- Evita duplicação de lógica
- Mantém consistência com fluxo REFERENCIA

### **Por que FAILED e não CANCELLED?**
- FAILED: Sistema detectou falha automaticamente
- CANCELLED: Admin/Cliente cancelou manualmente
- Facilita análise e estatísticas

---

## ✅ Checklist de Implementação

- [x] Adicionar estado FAILED ao StatusPedido
- [x] Tratar falha síncrona GPO em criarPedidoComPagamento()
- [x] Tratar falha assíncrona via webhook
- [x] Liberar estoque imediatamente em falhas
- [x] Enviar SMS de notificação de falha
- [x] Registrar auditoria de falhas
- [x] Compilação bem-sucedida
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Validação em produção

---

**Última atualização:** 17 de novembro de 2025
**Responsável:** Backend Team
**Status:** ✅ Implementado e compilado
