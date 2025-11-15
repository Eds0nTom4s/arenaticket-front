/**
 * Helpers para trabalhar com resposta do checkout
 * Normaliza diferenças entre formato esperado e formato real do backend
 */

import type { CheckoutResponse, Pedido, PagamentoInfo } from '../types/checkout.types';

/**
 * Extrai dados do pedido da resposta do checkout
 * Lida com formato normalizado (result.pedido) e formato direto do backend
 */
export function getPedidoData(response: CheckoutResponse): Pedido {
  // Se já tem pedido normalizado, retornar
  if (response.pedido) {
    return response.pedido;
  }

  // Caso contrário, os dados estão diretamente na response
  return {
    id: response.id!,
    clientRequestId: response.clientRequestId!,
    status: response.status!,
    total: response.total,
    valorTotal: response.total,
    compradorNome: response.compradorNome!,
    compradorTelefone: response.compradorTelefone!,
    compradorEmail: response.compradorEmail,
    paymentProvider: response.paymentProvider,
    paymentId: response.paymentId,
    reservaId: response.reservaId,
  } as Pedido;
}

/**
 * Extrai informações de pagamento
 */
export function getPagamentoInfo(response: CheckoutResponse): PagamentoInfo | null {
  const pedido = getPedidoData(response);
  return pedido.pagamento || null;
}

/**
 * Obtém ID do pedido de forma segura
 */
export function getPedidoId(response: CheckoutResponse): string {
  const pedido = getPedidoData(response);
  return pedido.id;
}

/**
 * Obtém status do pedido de forma segura
 */
export function getPedidoStatus(response: CheckoutResponse): string {
  const pedido = getPedidoData(response);
  return pedido.status;
}

/**
 * Obtém valor total do pedido
 */
export function getValorTotal(response: CheckoutResponse): number {
  const pedido = getPedidoData(response);
  return pedido.total || pedido.valorTotal || 0;
}

/**
 * Obtém método de pagamento
 */
export function getMetodoPagamento(response: CheckoutResponse): string {
  const pagamento = getPagamentoInfo(response);
  return pagamento?.metodoPagamento || 'REFERENCIA';
}

/**
 * Obtém referência de pagamento
 */
export function getReferenciaPagamento(response: CheckoutResponse): string {
  const pedido = getPedidoData(response);
  const pagamento = getPagamentoInfo(response);
  return pagamento?.referencia || pedido.referencia || '';
}

/**
 * Obtém entidade de pagamento (para REFERENCIA)
 */
export function getEntidadePagamento(response: CheckoutResponse): string {
  const pagamento = getPagamentoInfo(response);
  return pagamento?.entidade || '';
}

