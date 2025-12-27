/**
 * Serviço de API para pagamentos
 * Consulta status e bilhetes
 */

import type { PaymentStatusResponse, Bilhete } from '../types/checkout.types';
import { normalizeBilhetes } from '../utils/normalizeBilhete';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.arenaticket.gdse.ao/api/v1/public';

/**
 * Consulta o status de um pagamento
 * 
 * @param pedidoId ID do pedido
 * @returns Promise com status do pagamento
 */
export async function getPaymentStatus(
  identity:
    | string
    | {
        pedidoId?: string;
        clientRequestId?: string;
        reservaId?: string;
        referencia?: string;
      }
): Promise<PaymentStatusResponse> {
  const ident = typeof identity === 'string' ? { pedidoId: identity } : identity;

  const candidates: string[] = [];
  if (ident.pedidoId) candidates.push(`${API_BASE_URL}/pagamentos/${ident.pedidoId}/status`);
  if (ident.clientRequestId)
    candidates.push(`${API_BASE_URL}/pagamentos/cliente/${encodeURIComponent(ident.clientRequestId)}/status`);
  if (ident.reservaId) candidates.push(`${API_BASE_URL}/pagamentos/reservas/${ident.reservaId}/status`);
  if (ident.referencia) candidates.push(`${API_BASE_URL}/pagamentos/referencias/${ident.referencia}/status`);

  console.log('[PaymentService] Consultando status. Candidatos:', candidates);

  let lastError: any = null;
  for (const url of candidates) {
    try {
      console.log('[PaymentService] Consultando:', url);
      const response = await fetch(url);
      if (!response.ok) {
        lastError = new Error(`HTTP error! status: ${response.status}`);
        // Tentar próxima URL quando 404; parar em outros erros
        if (response.status !== 404) {
          console.error('[PaymentService] Erro ao consultar status:', lastError);
          throw lastError;
        }
        console.warn('[PaymentService] Endpoint retornou 404, tentando próximo...');
        continue;
      }
      const data = (await response.json()) as PaymentStatusResponse;
      console.log('[PaymentService] Status obtido:', data);
      return data;
    } catch (e) {
      lastError = e;
      console.error('[PaymentService] Falha ao consultar', url, e);
    }
  }

  console.error('[PaymentService] Todas as tentativas de consulta falharam.');
  throw lastError || new Error('Falha ao consultar status');
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
 * Busca um bilhete específico pelo código
 * 
 * @param codigo Código do bilhete (ex: GDSE-01329879)
 * @returns Promise com o bilhete
 */
export async function getBilheteByCodigo(codigo: string): Promise<Bilhete> {
  console.log('[PaymentService] Buscando bilhete por código:', codigo);
  console.log('[PaymentService] URL da API:', `${API_BASE_URL}/bilhete/${codigo}`);

  const response = await fetch(`${API_BASE_URL}/bilhete/${codigo}`);

  if (!response.ok) {
    console.error('[PaymentService] Resposta da API:', response.status, response.statusText);
    
    if (response.status === 404) {
      const error = new Error(`Bilhete com código "${codigo}" não encontrado na base de dados`);
      console.error('[PaymentService] Erro 404:', error);
      throw error;
    }
    
    const error = new Error(`HTTP error! status: ${response.status}`);
    console.error('[PaymentService] Erro ao buscar bilhete:', error);
    throw error;
  }

  const raw = await response.json();
  const normalized = normalizeBilhetes([raw]);
  console.log('[PaymentService] Bilhete obtido:', normalized[0]);
  return normalized[0];
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
