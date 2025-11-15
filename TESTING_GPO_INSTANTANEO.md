# 🧪 Guia de Testes: Pagamento GPO Instantâneo

**Versão:** v1.2.0  
**Data:** 15/11/2025  
**Tipo:** Testes Funcionais e de Integração

---

## 📋 Pré-requisitos

### Backend
- ✅ Backend API v1.2.0 rodando
- ✅ AppyPay configurado para GPO instantâneo
- ✅ Banco de dados com eventos e lotes ativos

### Frontend
- ✅ Node.js 18+ instalado
- ✅ Dependências instaladas (`npm install`)
- ✅ Variáveis de ambiente configuradas

### Ambiente
```bash
# .env.local
VITE_API_URL=http://localhost:8080/api/v1
```

---

## 🎯 Casos de Teste

### Caso 1: GPO Instantâneo - Fluxo Completo ✅

**Objetivo:** Validar pagamento GPO com confirmação instantânea

**Passos:**
1. Acessar homepage e selecionar um evento
2. Clicar em "Comprar Bilhete"
3. Selecionar lote disponível → Avançar
4. Escolher quantidade (ex: 2) → Avançar
5. Preencher dados:
   - Nome: João Silva
   - Telefone: 923456789
   - Email: joao@test.com (opcional)
   - Método: **Multicaixa Express** (GPO)
6. Avançar para resumo
7. Confirmar pedido

**Resultado Esperado:**
- ✅ Modal não fecha
- ✅ Loading spinner aparece brevemente
- ✅ Mensagem "🎉 Pagamento Confirmado Instantaneamente!" exibida
- ✅ Animação de bounce no ícone check-circle
- ✅ Background verde gradiente
- ✅ Bilhetes exibidos imediatamente (sem aguardar)
- ✅ QR codes renderizados
- ✅ Códigos de bilhete no formato GDSE-12345678
- ✅ Botão "Baixar Bilhete" funcional
- ✅ Nota sobre SMS enviado

**Console Expected:**
```
[useCheckout] Iniciando criação de pedido
[useCheckout] Método de pagamento: GPO
[useCheckout] Pedido criado com sucesso
[useCheckout] Status do pedido: PAID
[useCheckout] 🎉 Pagamento GPO confirmado instantaneamente!
[useCheckout] ✅ Bilhetes obtidos: 2
[PaymentStatusPolling] 🎉 Pagamento GPO instantâneo - pulando polling
```

---

### Caso 2: GPO Fallback - Polling Ativado ⏳

**Objetivo:** Validar fallback quando GPO retorna PENDING

**Mock Backend Response:**
```json
{
  "pedido": {
    "status": "PENDING",
    "pagamento": {
      "metodoPagamento": "GPO",
      "status": "PENDING"
    }
  }
}
```

**Passos:**
1. Simular resposta PENDING (mock ou feature flag)
2. Seguir fluxo de checkout GPO

**Resultado Esperado:**
- ✅ Instruções de pagamento GPO exibidas
- ✅ Polling iniciado a cada 5 segundos
- ✅ Timeout de 3 minutos
- ✅ Mensagem "Aguardando confirmação no aplicativo..."
- ✅ Loader animado visível

**Console Expected:**
```
[PaymentStatusPolling] Iniciando polling para pedido: xxx
[PaymentStatus] Iniciando polling para pedido: xxx
[PaymentStatus] Verificando status...
[PaymentStatus] Status atual: PENDING
```

---

### Caso 3: REFERENCIA - Fluxo Assíncrono 🏦

**Objetivo:** Validar que REFERENCIA continua funcionando normalmente

**Passos:**
1. Selecionar método **Referência ATM**
2. Completar checkout

**Resultado Esperado:**
- ✅ Instruções de pagamento REFERENCIA exibidas
- ✅ Entidade exibida (ex: 12345)
- ✅ Referência exibida (ex: REF123456)
- ✅ Valor formatado (ex: 2.000,00 Kz)
- ✅ Botões "Copiar" funcionais
- ✅ Nota sobre SMS enviado
- ✅ Polling iniciado com timeout de 10 minutos
- ✅ Mensagem "Aguardando confirmação do pagamento..."

**Console Expected:**
```
[PaymentStatusPolling] Iniciando polling para pedido: xxx
[PaymentStatus] Verificando status...
```

---

### Caso 4: Erro ao Buscar Bilhetes ❌

**Objetivo:** Validar tratamento de erro na busca de bilhetes

**Mock Backend:**
- POST `/checkout` retorna status PAID
- GET `/pedidos/{id}/bilhetes` retorna 500

**Resultado Esperado:**
- ✅ Aviso no console: "Erro ao buscar bilhetes (tentará novamente)"
- ✅ Polling continua funcionando
- ✅ Bilhetes buscados no próximo ciclo de polling
- ✅ Sem crash da aplicação

---

### Caso 5: Validação de UI - Badge "Instantâneo" 💎

**Objetivo:** Validar elementos visuais do seletor de pagamento

**Passos:**
1. Abrir modal de checkout
2. Chegar na etapa de pagamento
3. Observar seletor de métodos

**Resultado Esperado - GPO:**
- ✅ Badge "⚡ Instantâneo" visível
- ✅ Badge com gradiente amarelo
- ✅ Animação de pulse-glow (2s loop)
- ✅ Texto: "✨ Confirmação instantânea via app"
- ✅ Ícone mobile (📱) azul

**Resultado Esperado - REFERENCIA:**
- ✅ Sem badge especial
- ✅ Texto: "Pagamento em ATM ou Internet Banking"
- ✅ Ícone bank (🏦)

---

### Caso 6: Idempotência - Requests Duplicados 🔒

**Objetivo:** Validar que pagamento instantâneo não quebra idempotência

**Passos:**
1. Interceptar request de checkout no DevTools
2. Copiar cURL com mesmo `Idempotency-Key`
3. Executar request novamente

**Resultado Esperado:**
- ✅ Backend retorna mesmo pedido (409 ou 200 com mesmo ID)
- ✅ Frontend exibe bilhetes normalmente
- ✅ Sem duplicação de pedidos

---

### Caso 7: Performance - Tempo de Resposta ⚡

**Objetivo:** Medir melhoria de performance vs v1.1.0

**Métricas:**

| Métrica | v1.1.0 (Polling) | v1.2.0 (Instantâneo) | Melhoria |
|---------|------------------|----------------------|----------|
| Tempo total | 5-30s | < 2s | ~90% |
| Requisições HTTP | 3-10 | 2 | ~75% |
| Time to Interactive | 15s | 2s | ~87% |

**Como medir:**
1. Abrir DevTools > Network
2. Limpar cache
3. Executar checkout GPO
4. Anotar tempo desde POST `/checkout` até exibição de bilhetes

---

### Caso 8: Mobile - Responsividade 📱

**Objetivo:** Validar UX em dispositivos móveis

**Dispositivos de Teste:**
- iPhone 12 (390x844)
- Samsung Galaxy S21 (360x800)
- iPad (768x1024)

**Resultado Esperado:**
- ✅ Modal ocupa 95% da tela em mobile
- ✅ Badge "Instantâneo" visível e legível
- ✅ Botões de ação acessíveis (min 44px)
- ✅ QR codes renderizados corretamente
- ✅ Scroll suave no conteúdo
- ✅ Animações não causam lag

---

### Caso 9: Acessibilidade - Screen Readers ♿

**Objetivo:** Validar compatibilidade com leitores de tela

**Ferramentas:** NVDA, JAWS, VoiceOver

**Resultado Esperado:**
- ✅ Mensagem "Pagamento confirmado" anunciada
- ✅ Status do pedido acessível via aria-live
- ✅ Botões com labels descritivos
- ✅ Navegação por teclado funcional
- ✅ Contrast ratio >= 4.5:1

---

### Caso 10: Edge Cases - Timeout e Erros 🚨

#### 10.1: Timeout de Rede
**Mock:** Delay de 30s no POST `/checkout`

**Resultado Esperado:**
- ✅ Retry automático (max 3 tentativas)
- ✅ Exponential backoff (2s, 4s, 8s)
- ✅ Mensagem de erro amigável
- ✅ Opção de tentar novamente

#### 10.2: Erro 409 - Estoque Esgotado
**Mock:** Response 409 "Lote não possui bilhetes disponíveis"

**Resultado Esperado:**
- ✅ Sem retry (erro permanente)
- ✅ Mensagem: "Bilhetes esgotados. Escolha outro lote."
- ✅ Botão para voltar à seleção de lotes

#### 10.3: Erro 400 - Validação
**Mock:** Response 400 "Telefone inválido"

**Resultado Esperado:**
- ✅ Sem retry
- ✅ Mensagem de erro específica exibida
- ✅ Campo de telefone destacado em vermelho

---

## 🔍 Checklist de Validação

### Funcionalidades Core
- [ ] Pagamento GPO instantâneo funciona
- [ ] Bilhetes exibidos sem polling
- [ ] Animação de sucesso renderizada
- [ ] Badge "Instantâneo" exibido
- [ ] REFERENCIA continua funcionando
- [ ] Fallback para polling se necessário

### Performance
- [ ] Tempo de resposta < 2s (GPO)
- [ ] Sem requisições desnecessárias
- [ ] Animações suaves (60fps)

### UX/UI
- [ ] Modal estável (sem resize)
- [ ] Loading states claros
- [ ] Mensagens de erro amigáveis
- [ ] Responsivo em mobile

### Robustez
- [ ] Idempotência funcionando
- [ ] Retry em erros temporários
- [ ] Tratamento de erros permanentes
- [ ] Cleanup de timers/intervals

### Acessibilidade
- [ ] Navegação por teclado
- [ ] Screen readers compatíveis
- [ ] Contraste adequado
- [ ] Labels descritivos

---

## 🐛 Bugs Conhecidos

### Issue #1: Bilhetes não carregam em Safari iOS 14
**Status:** Investigando  
**Workaround:** Atualizar para iOS 15+

---

## 📊 Relatório de Testes

**Executar após testes:**

```markdown
# Relatório de Testes v1.2.0

**Data:** ___/___/_____  
**Testador:** _____________  
**Ambiente:** Staging / Produção

## Resultados

| Caso de Teste | Status | Observações |
|---------------|--------|-------------|
| 1. GPO Instantâneo | ✅ / ❌ | |
| 2. GPO Fallback | ✅ / ❌ | |
| 3. REFERENCIA | ✅ / ❌ | |
| 4. Erro Bilhetes | ✅ / ❌ | |
| 5. Badge UI | ✅ / ❌ | |
| 6. Idempotência | ✅ / ❌ | |
| 7. Performance | ✅ / ❌ | Tempo: ___s |
| 8. Mobile | ✅ / ❌ | |
| 9. Acessibilidade | ✅ / ❌ | |
| 10. Edge Cases | ✅ / ❌ | |

## Bugs Encontrados
1. ___________________________
2. ___________________________

## Aprovação
- [ ] Funcionalidades core OK
- [ ] Performance satisfatória
- [ ] UX profissional
- [ ] Sem bugs bloqueantes

**Aprovado por:** _____________  
**Data:** ___/___/_____
```

---

## 📞 Suporte

**Bugs ou dúvidas:**
- Email: dev@arenaticket.gdse.ao
- WhatsApp: +244 925 813 939
- GitHub Issues: [repo]/issues

---

**Desenvolvido para:** GDSE - Grémio Desportivo Sagrada Esperança  
**Versão:** v1.2.0  
**Data:** 15/11/2025
