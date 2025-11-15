/**
 * Hook principal para gerenciar o fluxo de checkout
 * Integra idempotência, retry e validação
 */

import { ref, readonly } from 'vue';
import type { CheckoutRequest, CheckoutResponse } from '../types/checkout.types';
import { createCheckout, validateCheckoutData } from '../services/checkoutService';
import { getFriendlyErrorMessage } from '../utils/validators';

export function useCheckout() {
  const isCreating = ref(false);
  const error = ref<string | null>(null);
  const pedido = ref<CheckoutResponse | null>(null);

  /**
   * Cria um pedido de checkout
   * 
   * @param data Dados do checkout
   * @param idempotencyKey Chave idempotente
   * @returns Promise com dados do pedido
   */
  const createOrder = async (
    data: CheckoutRequest,
    idempotencyKey: string
  ): Promise<CheckoutResponse> => {
    console.log('[useCheckout] Iniciando criação de pedido');
    
    isCreating.value = true;
    error.value = null;

    try {
      // Validar dados antes de enviar
      const validationError = validateCheckoutData(data);
      if (validationError) {
        throw new Error(validationError);
      }

      // Criar pedido com retry e idempotência
      const result = await createCheckout(data, idempotencyKey);
      
      pedido.value = result;
      console.log('[useCheckout] Pedido criado com sucesso');
      
      return result;
    } catch (err: any) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      error.value = friendlyMessage;
      
      console.error('[useCheckout] Erro ao criar pedido:', err);
      
      // Re-throw com informação se é retryable
      err.isRetryable = err.isRetryable ?? false;
      throw err;
    } finally {
      isCreating.value = false;
    }
  };

  /**
   * Reseta o estado do checkout
   */
  const reset = (): void => {
    isCreating.value = false;
    error.value = null;
    pedido.value = null;
  };

  return {
    isCreating: readonly(isCreating),
    error: readonly(error),
    pedido: readonly(pedido),
    createOrder,
    reset,
  };
}
