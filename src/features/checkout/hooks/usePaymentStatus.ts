/**
 * Hook para polling do status de pagamento
 * Verifica periodicamente se o pagamento foi confirmado
 */

import { ref, onUnmounted, readonly } from 'vue';
import type { StatusPagamento, Bilhete } from '../types/checkout.types';
import { getPaymentStatus, getPedidoBilhetes } from '../services/paymentService';
import type { PaymentStatusResponse } from '../types/checkout.types';

export interface UsePaymentStatusOptions {
  /**
   * Timeout em milissegundos (padrão: 10 minutos para REFERENCIA)
   */
  timeoutMs?: number;
  
  /**
   * Intervalo de polling em milissegundos (padrão: 5 segundos)
   */
  intervalMs?: number;
  
  /**
   * Callback quando pagamento for confirmado
   */
  onPaid?: (bilhetes: Bilhete[]) => void;
  
  /**
   * Callback quando houver erro
   */
  onError?: (error: Error) => void;
  
  /**
   * Callback quando timeout for atingido
   */
  onTimeout?: () => void;
}

export function usePaymentStatus(options: UsePaymentStatusOptions = {}) {
  const {
    timeoutMs = 600000, // 10 minutos padrão
    intervalMs = 5000, // 5 segundos padrão
    onPaid,
    onError,
    onTimeout,
  } = options;

  const status = ref<StatusPagamento>('PENDING');
  const bilhetes = ref<Bilhete[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const isPolling = ref(false);
  const lastResponse = ref<PaymentStatusResponse | null>(null);

  let intervalId: number | null = null;
  let timeoutId: number | null = null;
  let startTime: number = 0;

  /**
   * Inicia o polling de status
   */
  const startPolling = async (
    identity:
      | string
      | { pedidoId?: string; clientRequestId?: string; reservaId?: string; referencia?: string }
  ): Promise<void> => {
    const hasAnyId = typeof identity === 'string' ? !!identity : !!(identity.pedidoId || identity.clientRequestId || identity.reservaId || identity.referencia);
    if (!hasAnyId) {
      console.error('[PaymentStatus] Identificador do pagamento não fornecido');
      return;
    }

    if (isPolling.value) {
      console.warn('[PaymentStatus] Polling já está em andamento');
      return;
    }

  console.log('[PaymentStatus] Iniciando polling com identidade:', identity);
    
    isLoading.value = true;
    isPolling.value = true;
    error.value = null;
    startTime = Date.now();

    // Verificar status imediatamente
  await checkStatus(identity);

    // Configurar polling periódico
    intervalId = window.setInterval(() => {
      checkStatus(identity);
    }, intervalMs);

    // Configurar timeout
    timeoutId = window.setTimeout(() => {
      console.warn('[PaymentStatus] Timeout atingido');
      stopPolling();
      error.value = new Error('Timeout: pagamento não confirmado');
      
      if (onTimeout) {
        onTimeout();
      }
    }, timeoutMs);
  };

  /**
   * Verifica o status do pagamento
   */
  const checkStatus = async (
    identity:
      | string
      | { pedidoId?: string; clientRequestId?: string; reservaId?: string; referencia?: string }
  ): Promise<void> => {
    try {
      // Verificar se já passou do timeout
      if (Date.now() - startTime > timeoutMs) {
        stopPolling();
        return;
      }

  console.log('[PaymentStatus] Verificando status...');
      
  const statusData = await getPaymentStatus(identity);
  lastResponse.value = statusData;
      status.value = statusData.status;

      console.log('[PaymentStatus] Status atual:', statusData.status);

      // Verificar se chegou em estado final
      if (statusData.status === 'PAID') {
        console.log('[PaymentStatus] Pagamento confirmado! Buscando bilhetes...');
        
        // Buscar bilhetes
  const pedidoId = typeof identity === 'string' ? identity : identity.pedidoId || '';
  const bilhetesData = await getPedidoBilhetes(pedidoId);
        bilhetes.value = bilhetesData;
        
        stopPolling();
        isLoading.value = false;

        if (onPaid) {
          onPaid(bilhetesData);
        }
      } else if (['FAILED', 'CANCELLED'].includes(statusData.status)) {
        console.error('[PaymentStatus] Pagamento falhou ou foi cancelado');
        
        stopPolling();
        isLoading.value = false;
        error.value = new Error(`Pagamento ${statusData.status.toLowerCase()}`);

        if (onError) {
          onError(error.value);
        }
      }
    } catch (err) {
      console.error('[PaymentStatus] Erro ao verificar status:', err);
      error.value = err as Error;

      if (onError) {
        onError(error.value);
      }
    }
  };

  /**
   * Para o polling
   */
  const stopPolling = (): void => {
    console.log('[PaymentStatus] Parando polling');
    
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    isPolling.value = false;
  };

  /**
   * Reseta o estado
   */
  const reset = (): void => {
    stopPolling();
    status.value = 'PENDING';
    bilhetes.value = [];
    isLoading.value = false;
    error.value = null;
    startTime = 0;
  };

  // Cleanup ao desmontar componente
  onUnmounted(() => {
    stopPolling();
  });

  return {
    status: readonly(status),
    bilhetes: readonly(bilhetes),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isPolling: readonly(isPolling),
    lastResponse: readonly(lastResponse),
    startPolling,
    stopPolling,
    reset,
  };
}

/**
 * Timeout recomendado por método de pagamento
 * 
 * v1.2.0: GPO não precisa mais de polling (confirmação instantânea)
 * mas timeout mantido para casos de fallback
 */
export const PAYMENT_TIMEOUTS = {
  GPO: 180000, // 3 minutos (apenas fallback - pagamento é instantâneo)
  REFERENCIA: 600000, // 10 minutos (pagamento assíncrono)
} as const;
