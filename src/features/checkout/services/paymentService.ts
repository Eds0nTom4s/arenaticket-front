/**
 * Serviço de API para pagamentos
 * Consulta status e bilhetes
 */

import type {
  PaymentStatusResponse,
  Bilhete,
} from '../types/checkout.types';

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
  const normalized: Bilhete[] = list.map((b: any) => {
    const evento = b.evento && typeof b.evento === 'object' ? b.evento : {
      titulo: b.eventoTitulo || b.eventoNome || b.titulo || b.evento || '',
      local: b.eventoLocal || b.local || '',
      dataEvento: b.eventoData || b.dataEvento || b.data || '',
    };
    const lote = b.lote && typeof b.lote === 'object' ? b.lote : {
      nome: b.loteNome || b.nomeLote || b.lote || '',
      preco: Number(b.preco ?? b.valor ?? b.precoUnitario ?? 0),
    };
    const codigoTicket: string = b.codigoTicket || b.codigo || b.code || '';
    const codigoTicketCompact: string = (codigoTicket || '').replace(/[^A-Za-z0-9]/g, '');
    let codigoQR: string = b.codigoQR || b.qrCode || b.qrcode || '';
    if (codigoQR && !/^data:image\//.test(codigoQR)) {
      // Assumir PNG por padrão se não vier com prefixo data URL
      codigoQR = `data:image/png;base64,${codigoQR}`;
    }

    const bilhete: Bilhete = {
      id: String(b.id || b.bilheteId || b.ticketId || codigoTicket || Math.random().toString(36).slice(2)),
      codigoTicket,
      codigoTicketCompact,
      codigoQR,
      status: (b.status || 'VALID') as Bilhete['status'],
      compradorNome: b.compradorNome || b.nomeComprador || '',
      compradorTelefone: b.compradorTelefone || b.telefoneComprador || '',
      evento,
      lote,
      vendidoEm: b.vendidoEm || b.dataVenda || b.createdAt || undefined,
    };
    return bilhete;
  });

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
