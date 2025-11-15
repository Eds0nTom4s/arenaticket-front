/**
 * Checkout Feature - Exports
 * Facilita importações dos recursos do checkout
 */

// Components
export { default as PaymentMethodSelector } from './components/PaymentMethodSelector.vue';
export { default as PaymentInstructions } from './components/PaymentInstructions.vue';
export { default as PaymentStatusPolling } from './components/PaymentStatusPolling.vue';
export { default as TicketDisplay } from './components/TicketDisplay.vue';

// Hooks
export { useIdempotency } from './hooks/useIdempotency';
export { usePaymentStatus, PAYMENT_TIMEOUTS } from './hooks/usePaymentStatus';
export { useCheckout } from './hooks/useCheckout';

// Services
export { createCheckout, validateCheckoutData } from './services/checkoutService';
export { 
  getPaymentStatus, 
  getPedidoBilhetes, 
  cancelarPedido 
} from './services/paymentService';

// Utils
export { retryWithBackoff, isRetryableError } from './utils/retryWithBackoff';
export {
  isValidAngolaTelefone,
  isValidEmail,
  isValidNome,
  isValidQuantidade,
  formatTelefone,
  formatCodigoBilhete,
  formatKwanza,
  formatDataEvento,
  cleanTelefone,
  isLoteDisponivel,
  getFriendlyErrorMessage,
} from './utils/validators';

// Types
export type {
  MetodoPagamento,
  StatusPedido,
  StatusPagamento,
  StatusBilhete,
  CheckoutRequest,
  PagamentoInfo,
  Pedido,
  CheckoutResponse,
  EventoInfo,
  LoteInfo,
  Bilhete,
  PaymentStatusResponse,
  RetryOptions,
  CheckoutError,
  BuyerInfo,
  OrderSummary,
  Lote,
  Evento,
} from './types/checkout.types';
