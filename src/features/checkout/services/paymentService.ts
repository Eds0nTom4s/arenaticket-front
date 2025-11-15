/**
 * Serviço de API para pagamentos
 * Consulta status e bilhetes
 */

import type { PaymentStatusResponse, Bilhete } from '../types/checkout.types';
import { normalizeBilhetes } from '../utils/normalizeBilhete';

const API_BASE_URL = 'http://localhost:8080/api/v1/public';

/**
 * Consulta o status de um pagamento
 * 
 * @param pedidoId ID do pedido
 * @returns Promise com status do pagamento
 */
export async function getPaymentStatus(
  pedidoId: string
): Promise<PaymentStatusResponse> {
  console.log('[PaymentService] Consultando status do pedido:', pedidoId);

  const response = await fetch(`${API_BASE_URL}/pagamentos/${pedidoId}/status`);

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    console.error('[PaymentService] Erro ao consultar status:', error);
    throw error;
  }

  const data = await response.json();
  console.log('[PaymentService] Status obtido:', data);

  return data;
}

/**
 * Busca os bilhetes de um pedido
 * Deve ser chamado apenas quando status = PAID
 * 
 * @param pedidoId ID do pedido
 * @returns Promise com lista de bilhetes
 */
export async function getPedidoBilhetes(pedidoId: string): Promise<Bilhete[]> {
  console.log('[PaymentService] Buscando bilhetes do pedido:', pedidoId);

  const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}/bilhetes`);

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    console.error('[PaymentService] Erro ao buscar bilhetes:', error);
    throw error;
  }

  const raw = await response.json();
  const list = Array.isArray(raw) ? raw : [raw];
  const normalized = normalizeBilhetes(list);
  console.log('[PaymentService] Bilhetes obtidos (normalizados):', normalized.length);
  return normalized;
}

/**
 * Cancela um pedido (se possível)
 * 
 * @param pedidoId ID do pedido
 */
export async function cancelarPedido(pedidoId: string): Promise<void> {
  console.log('[PaymentService] Cancelando pedido:', pedidoId);

  const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}/cancelar`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    console.error('[PaymentService] Erro ao cancelar pedido:', error);
    throw error;
  }

  console.log('[PaymentService] Pedido cancelado com sucesso');
}
