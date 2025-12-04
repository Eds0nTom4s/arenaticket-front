/**
 * Serviço de API para checkout
 * Implementa idempotência e retry automático
 */

import type { CheckoutRequest } from '../types/checkout.types';
import type { PedidoBackendResponse } from '../types/pedido.types';
import { retryWithBackoff, isRetryableError } from '../utils/retryWithBackoff';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.arenaticket.gdse.ao/api/v1/public';

/**
 * Cria um pedido (checkout) com idempotência e retry
 * 
 * @param data Dados do checkout
 * @param idempotencyKey Chave idempotente única
 * @returns Promise com dados do pedido criado
 */
export async function createCheckout(
  data: CheckoutRequest,
  idempotencyKey: string
): Promise<PedidoBackendResponse> {
  console.log('[CheckoutService] Criando pedido com chave:', idempotencyKey);
  
  return retryWithBackoff(
    async () => {
      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: any = new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
        error.response = {
          status: response.status,
          data: errorData,
        };
        // Classificar erro retryable inicialmente
        error.isRetryable = isRetryableError(error);

        // Não devemos fazer retry em falhas de autenticação do provedor de pagamento
        const msgLower = (errorData.message || '').toLowerCase();
        if (
          msgLower.includes('autenticação appypay') ||
          msgLower.includes('appypay') && msgLower.includes('autentica') ||
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          error.isRetryable = false;
        }
        
        console.error('[CheckoutService] Erro na requisição:', error);
        throw error;
      }

      const result = await response.json();
      console.log('[CheckoutService] Pedido criado com sucesso:', result);
      
      // Backend v1.2.0 retorna dados diretos (não em wrapper)
      return result as PedidoBackendResponse;
    },
    {
      maxRetries: 3,
      initialDelay: 2000, // 2 segundos
      maxDelay: 8000, // 8 segundos
      shouldRetry: (error) => {
        // Respeitar flag calculada em createCheckout
        if (error.isRetryable === false) return false;
        return isRetryableError(error);
      },
    }
  );
}

/**
 * Valida se dados do checkout estão completos
 */
export function validateCheckoutData(data: CheckoutRequest): string | null {
  if (!data.loteId) {
    return 'Lote não selecionado';
  }

  if (!data.quantidade || data.quantidade <= 0) {
    return 'Quantidade inválida';
  }

  if (!data.compradorNome || data.compradorNome.trim().length < 3) {
    return 'Nome deve ter pelo menos 3 caracteres';
  }

  if (!data.compradorTelefone) {
    return 'Telefone é obrigatório';
  }

  // Validar formato de telefone angolano
  const telefoneLimpo = data.compradorTelefone.replace(/[\s\-\(\)]/g, '');
  if (!/^9[1-9]\d{7}$/.test(telefoneLimpo)) {
    return 'Telefone inválido. Use formato: 9XXXXXXXX';
  }

  if (!data.metodoPagamento) {
    return 'Método de pagamento não selecionado';
  }

  if (!['GPO', 'REFERENCIA'].includes(data.metodoPagamento)) {
    return 'Método de pagamento inválido';
  }

  return null; // Tudo válido
}
