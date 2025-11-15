/**
 * Hook para gerenciar idempotência no checkout
 * Gera e mantém chave única durante todo o fluxo de retry
 */

import { ref, readonly } from 'vue';

export function useIdempotency() {
  const idempotencyKey = ref<string | null>(null);

  /**
   * Gera uma nova chave idempotente se ainda não existe
   * Formato: ART-YYYYMMDD-RND (máximo 15 caracteres para compatibilidade AppyPay)
   * 
   * Importante: A mesma chave deve ser usada em todas as tentativas de retry
   * da mesma operação para garantir idempotência
   */
  const generateKey = (): string => {
    if (!idempotencyKey.value) {
      // Data no formato YYYYMMDD
      const date = new Date()
        .toISOString()
        .slice(2, 10)
        .replace(/-/g, '');
      
      // Random alfanumérico (3 caracteres)
      const random = Math.random()
        .toString(36)
        .substring(2, 5)
        .toUpperCase();
      
      // Formato: ART-YYMMDD-RND (total: 14-15 chars)
      idempotencyKey.value = `ART-${date}-${random}`;
      
      console.log('[Idempotency] Nova chave gerada:', idempotencyKey.value);
    }
    
    return idempotencyKey.value;
  };

  /**
   * Reseta a chave idempotente
   * Deve ser chamado após sucesso ou cancelamento do checkout
   */
  const resetKey = (): void => {
    console.log('[Idempotency] Resetando chave:', idempotencyKey.value);
    idempotencyKey.value = null;
  };

  /**
   * Retorna a chave atual (read-only)
   */
  const getCurrentKey = (): string | null => {
    return idempotencyKey.value;
  };

  return {
    generateKey,
    resetKey,
    currentKey: readonly(idempotencyKey),
    getCurrentKey,
  };
}
