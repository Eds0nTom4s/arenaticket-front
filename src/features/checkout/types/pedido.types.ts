/**
 * Tipos para resposta do backend v1.2.0
 * O backend retorna os dados diretamente, não em um objeto "pedido"
 */

export interface PedidoBackendResponse {
  id: string;
  clientRequestId: string;
  compradorNome: string;
  compradorTelefone: string;
  compradorEmail: string | null;
  total: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED' | 'FAILED';
  paymentProvider: string;
  paymentId: string | null;
  reservaId: string;
  referencia?: string;
  entidade?: string;
  mensagem?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}
