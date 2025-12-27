/**
 * Hook principal para gerenciar o fluxo de checkout
 * Integra idempotência, retry e validação
 * 
 * v1.2.0: Suporte a pagamento GPO instantâneo
 */

import { ref, readonly } from 'vue';
import type { CheckoutRequest, Bilhete } from '../types/checkout.types';
import type { PedidoBackendResponse } from '../types/pedido.types';
import { createCheckout, validateCheckoutData } from '../services/checkoutService';
import { normalizeBilhetes } from '../utils/normalizeBilhete';
import { getFriendlyErrorMessage } from '../utils/validators';
import { getPedidoBilhetes } from '../services/paymentService';

/**
 * Mascara telefone para logging (exibe apenas primeiros 3 dígitos)
 * Exemplo: 923456789 -> 923******
 */
function maskTelefone(telefone: string): string {
  if (!telefone || telefone.length < 3) return '***';
  return telefone.slice(0, 3) + '******';
}

export function useCheckout() {
  const isCreating = ref(false);
  const error = ref<string | null>(null);
  const pedido = ref<PedidoBackendResponse | null>(null);
  const bilhetes = ref<Bilhete[]>([]);
  const isPaidInstantly = ref(false);

  /**
   * Cria um pedido de checkout
   * 
   * v1.2.0: Detecta se pagamento GPO foi confirmado instantaneamente
   * e busca bilhetes automaticamente
   * 
   * @param data Dados do checkout
   * @param idempotencyKey Chave idempotente
   * @returns Promise com dados do pedido
   */
  const createOrder = async (
    data: CheckoutRequest,
    idempotencyKey: string
  ): Promise<PedidoBackendResponse> => {
    console.log('[useCheckout] Iniciando criação de pedido');
    console.log('[useCheckout] Método de pagamento:', data.metodoPagamento);
    
    isCreating.value = true;
    error.value = null;
    isPaidInstantly.value = false;
    bilhetes.value = [];

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
      console.log('[useCheckout] Status do pedido:', result.status);

      // Se backend já retornou bilhetes (caso pagamento instantâneo), usar diretamente
      const bilhetesDiretos: any[] | undefined = (result as any).bilhetes;
      if (bilhetesDiretos && Array.isArray(bilhetesDiretos) && bilhetesDiretos.length > 0) {
        try {
          bilhetes.value = normalizeBilhetes(bilhetesDiretos);
          console.log('[useCheckout] Bilhetes presentes na resposta do checkout:', bilhetesDiretos.length);
        } catch (e) {
          console.warn('[useCheckout] Falha ao normalizar bilhetes diretos, continuará fluxo padrão.', e);
        }
      }
      
      // ✨ NOVO v1.2.0: Verificar se pagamento GPO foi confirmado instantaneamente
      if (data.metodoPagamento === 'GPO' && result.status === 'PAID') {
        console.log('[useCheckout] 🎉 Pagamento GPO confirmado instantaneamente!');
        isPaidInstantly.value = true;
        
        // Se não vieram bilhetes diretos, buscar via serviço
        if (bilhetes.value.length === 0) {
          try {
            const bilhetesData = await getPedidoBilhetes(result.id);
            bilhetes.value = bilhetesData;
            console.log('[useCheckout] ✅ Bilhetes obtidos via serviço:', bilhetesData.length);
          } catch (bilhetesErr) {
            console.warn('[useCheckout] Erro ao buscar bilhetes (tentará novamente):', bilhetesErr);
            // Não bloqueia o fluxo - polling pode tentar novamente
          }
        }
      }
      
      return result;
    } catch (err: any) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      error.value = friendlyMessage;
      
      // 📄 Log técnico detalhado (apenas console - nunca exibir ao usuário)
      console.error('[useCheckout] Erro ao criar pedido:', {
        timestamp: new Date().toISOString(),
        httpStatus: err.response?.status,
        backendMessage: err.response?.data?.message,
        friendlyMessage: friendlyMessage,
        isRetryable: err.isRetryable ?? false,
        requestData: {
          loteId: data.loteId,
          quantidade: data.quantidade,
          compradorNome: data.compradorNome,
          compradorTelefone: maskTelefone(data.compradorTelefone), // Mascarar telefone
          compradorEmail: data.compradorEmail ? '***@***' : null,    // Mascarar email
          metodoPagamento: data.metodoPagamento,
        },
        idempotencyKey,
      });
      
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
    bilhetes.value = [];
    isPaidInstantly.value = false;
  };

  return {
    isCreating: readonly(isCreating),
    error: readonly(error),
    pedido: readonly(pedido),
    bilhetes: readonly(bilhetes),
    isPaidInstantly: readonly(isPaidInstantly),
    createOrder,
    reset,
  };
}
