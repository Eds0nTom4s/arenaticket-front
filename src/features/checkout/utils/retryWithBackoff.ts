/**
 * Implementa retry com exponential backoff
 * Usado para operações que podem falhar temporariamente
 */

import type { RetryOptions } from '../types/checkout.types';

/**
 * Executa uma função com retry automático usando exponential backoff
 * 
 * @param fn Função a ser executada
 * @param options Opções de retry
 * @returns Promise com resultado da função
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxRetries,
    initialDelay,
    maxDelay,
    shouldRetry = () => true,
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[RetryBackoff] Tentativa ${attempt} de ${maxRetries}`);
      const result = await fn();
      
      if (attempt > 1) {
        console.log(`[RetryBackoff] Sucesso na tentativa ${attempt}`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      console.error(`[RetryBackoff] Tentativa ${attempt} falhou:`, error);

      // Verificar se deve fazer retry
      if (attempt < maxRetries && shouldRetry(error)) {
        console.log(`[RetryBackoff] Aguardando ${delay}ms antes de tentar novamente...`);
        await sleep(delay);
        
        // Exponential backoff: dobrar o delay a cada tentativa
        delay = Math.min(delay * 2, maxDelay);
      } else {
        break;
      }
    }
  }

  console.error(`[RetryBackoff] Falha após ${maxRetries} tentativas`);
  throw lastError;
}

/**
 * Helper para aguardar um tempo em ms
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Determina se um erro HTTP é retryable
 * Erros 5xx e timeouts são retryable
 * Erros 4xx (validação) não são retryable
 */
export function isRetryableError(error: any): boolean {
  // Erros de rede sempre são retryable
  if (!error.response) {
    return true;
  }

  const status = error.response?.status;

  // 5xx: Server errors - retry
  if (status >= 500) {
    return true;
  }

  // 408: Request Timeout - retry
  if (status === 408) {
    return true;
  }

  // 429: Too Many Requests - retry
  if (status === 429) {
    return true;
  }

  // 4xx: Client errors (exceto os acima) - não retry
  if (status >= 400 && status < 500) {
    return false;
  }

  // Default: retry
  return true;
}
