import type { Bilhete } from '../types/checkout.types';

/**
 * Normaliza um objeto bilhete vindo do backend, seja plano ou parcialmente estruturado.
 */
export function normalizeBilhete(raw: any): Bilhete {
  const evento = raw.evento && typeof raw.evento === 'object' ? raw.evento : {
    titulo: raw.eventoTitulo || raw.eventoNome || raw.titulo || raw.evento || '',
    local: raw.eventoLocal || raw.local || '',
    dataEvento: raw.eventoData || raw.dataEvento || raw.data || '',
  };
  const lote = raw.lote && typeof raw.lote === 'object' ? raw.lote : {
    nome: raw.loteNome || raw.nomeLote || raw.lote || '',
    preco: Number(raw.preco ?? raw.valor ?? raw.precoUnitario ?? 0),
  };
  const codigoTicket: string = raw.codigoTicket || raw.codigo || raw.code || '';
  const codigoTicketCompact: string = (codigoTicket || '').replace(/[^A-Za-z0-9]/g, '');
  let codigoQR: string = raw.codigoQR || raw.qrCode || raw.qrcode || '';
  if (codigoQR && !/^data:image\//.test(codigoQR)) {
    codigoQR = `data:image/png;base64,${codigoQR}`;
  }
  return {
    id: String(raw.id || raw.bilheteId || raw.ticketId || codigoTicket || Math.random().toString(36).slice(2)),
    codigoTicket,
    codigoTicketCompact,
    codigoQR,
    status: (raw.status || 'VALID'),
    compradorNome: raw.compradorNome || raw.nomeComprador || '',
    compradorTelefone: raw.compradorTelefone || raw.telefoneComprador || '',
    evento,
    lote,
    vendidoEm: raw.vendidoEm || raw.dataVenda || raw.createdAt || undefined,
  };
}

export function normalizeBilhetes(list: any[]): Bilhete[] {
  return list.map(normalizeBilhete);
}