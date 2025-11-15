/**
 * Tipos para o fluxo de checkout
 * Baseado na API v1.1.0 do ArenaTicket
 */

export type MetodoPagamento = 'GPO' | 'REFERENCIA';

export type StatusPedido = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';

export type StatusPagamento = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export type StatusBilhete = 'VALID' | 'USED' | 'CANCELLED';

/**
 * Request para criar um pedido (checkout)
 */
export interface CheckoutRequest {
  loteId: string;
  quantidade: number;
  compradorNome: string;
  compradorTelefone: string;
  compradorEmail?: string;
  metodoPagamento: MetodoPagamento;
}

/**
 * Informações do pagamento retornadas
 */
export interface PagamentoInfo {
  referencia: string;
  entidade?: string;
  metodoPagamento: MetodoPagamento;
  statusPagamento: StatusPagamento;
}

/**
 * Pedido retornado pelo backend
 */
export interface Pedido {
  id: string;
  clientRequestId: string;
  referencia?: string;
  status: StatusPedido;
  valorTotal?: number;
  total?: number; // Backend usa 'total' ao invés de 'valorTotal'
  pagamento?: PagamentoInfo;
  compradorNome: string;
  compradorTelefone: string;
  compradorEmail?: string | null;
  paymentProvider?: string;
  paymentId?: string | null;
  reservaId?: string;
}

/**
 * Response completa do checkout
 * NOTA: Backend v1.2.0 retorna dados diretamente, não em wrapper 'pedido'
 */
export interface CheckoutResponse {
  mensagem?: string;
  pedido?: Pedido;
  // Campos diretos (formato real do backend)
  id?: string;
  clientRequestId?: string;
  status?: StatusPedido;
  total?: number;
  compradorNome?: string;
  compradorTelefone?: string;
  compradorEmail?: string | null;
  paymentProvider?: string;
  paymentId?: string | null;
  reservaId?: string;
}

/**
 * Informações do evento (simplificado)
 */
export interface EventoInfo {
  titulo: string;
  local: string;
  dataEvento: string;
}

/**
 * Informações do lote (simplificado)
 */
export interface LoteInfo {
  nome: string;
  preco: number;
}

/**
 * Bilhete gerado
 */
export interface Bilhete {
  id: string;
  codigoTicket: string; // Formato: GDSE-12345678
  codigoTicketCompact: string; // Formato: GDSE12345678
  codigoQR: string; // Base64 image
  status: StatusBilhete;
  compradorNome: string;
  compradorTelefone: string;
  evento: EventoInfo;
  lote: LoteInfo;
  vendidoEm?: string;
}

/**
 * Response do status de pagamento
 */
export interface PaymentStatusResponse {
  pedidoId: string;
  status: StatusPagamento;
  referencia: string;
  updatedAt: string;
}

/**
 * Opções para retry com backoff
 */
export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  shouldRetry?: (error: any) => boolean;
}

/**
 * Erro customizado com flag de retry
 */
export interface CheckoutError extends Error {
  isRetryable?: boolean;
  statusCode?: number;
}

/**
 * Dados do comprador
 */
export interface BuyerInfo {
  nome: string;
  telefone: string;
  email?: string;
  metodoPagamento: MetodoPagamento;
}

/**
 * Resumo do pedido para exibição
 */
export interface OrderSummary {
  eventoNome: string;
  eventoData: string;
  loteNome: string;
  quantidade: number;
  precoUnitario: number;
  total: number;
  compradorNome: string;
  compradorTelefone: string;
  metodoPagamento: string;
}

/**
 * Lote disponível para compra
 */
export interface Lote {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidadeDisponivel: number;
  quantidadeTotal: number;
  inicioVenda: string;
  fimVenda: string;
  ativo: boolean;
}

/**
 * Evento completo
 */
export interface Evento {
  id: string;
  nome: string;
  titulo?: string;
  descricao?: string;
  local: string;
  data: string;
  dataEvento: string;
  imagemUrl?: string;
  abertoParaVenda: boolean;
  lotes?: Lote[];
}
