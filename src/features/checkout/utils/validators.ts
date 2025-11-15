/**
 * Validadores para o formulário de checkout
 */

/**
 * Valida telefone angolano
 * Formato: 9XXXXXXXX (9 dígitos começando com 9)
 */
export function isValidAngolaTelefone(telefone: string): boolean {
  // Remove espaços, traços e parênteses
  const cleaned = telefone.replace(/[\s\-\(\)]/g, '');
  
  // Deve ter 9 dígitos começando com 9
  const regex = /^9[1-9]\d{7}$/;
  
  return regex.test(cleaned);
}

/**
 * Valida email (opcional, mas se fornecido deve ser válido)
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Email é opcional
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida nome (deve ter pelo menos 3 caracteres)
 */
export function isValidNome(nome: string): boolean {
  return nome.trim().length >= 3;
}

/**
 * Valida quantidade (deve ser positivo)
 */
export function isValidQuantidade(quantidade: number): boolean {
  return quantidade > 0 && Number.isInteger(quantidade);
}

/**
 * Formata telefone angolano para exibição
 * Entrada: 923456789
 * Saída: 923 456 789
 */
export function formatTelefone(telefone: string): string {
  const cleaned = telefone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return telefone;
}

/**
 * Formata código de bilhete para exibição
 * Entrada: GDSE12345678
 * Saída: GDSE-1234 5678
 */
export function formatCodigoBilhete(codigo: string): string {
  // Se já está formatado, retornar como está
  if (codigo.includes('-') && codigo.includes(' ')) {
    return codigo;
  }
  
  // Remover espaços e traços existentes
  const cleaned = codigo.replace(/[\s\-]/g, '');
  
  // Formato: GDSE-12345678 ou GDSE-1234 5678
  if (cleaned.length >= 12) {
    const prefix = cleaned.slice(0, 4); // GDSE
    const numbers = cleaned.slice(4); // 12345678
    
    if (numbers.length === 8) {
      return `${prefix}-${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    }
  }
  
  return codigo;
}

/**
 * Formata valor em Kwanzas
 * Entrada: 1000
 * Saída: 1.000,00 Kz
 */
export function formatKwanza(valor: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2,
  }).format(valor).replace('AOA', 'Kz');
}

/**
 * Formata data para exibição
 * Entrada: 2025-11-30T16:00:00+01:00
 * Saída: 30/11/2025 16:00
 */
export function formatDataEvento(dataISO: string): string {
  if (!dataISO) {
    return 'Data não disponível';
  }
  
  try {
    const date = new Date(dataISO);
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

/**
 * Limpa telefone removendo formatação
 * Entrada: 923 456 789 ou (923) 456-789
 * Saída: 923456789
 */
export function cleanTelefone(telefone: string): string {
  return telefone.replace(/[\s\-\(\)]/g, '');
}

/**
 * Valida se um lote está disponível para venda
 */
export function isLoteDisponivel(lote: {
  quantidadeDisponivel: number;
  inicioVenda: string;
  fimVenda: string;
  ativo: boolean;
}): boolean {
  if (!lote.ativo) return false;
  if (lote.quantidadeDisponivel <= 0) return false;
  
  const now = new Date();
  const inicio = new Date(lote.inicioVenda);
  const fim = new Date(lote.fimVenda);
  
  return now >= inicio && now <= fim;
}

/**
 * Retorna mensagem de erro amigável para o usuário
 */
export function getFriendlyErrorMessage(error: any): string {
  // Erros de validação do backend
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Erros HTTP conhecidos
    const status = error.response?.status;  
    const rawMessage = error.response?.data?.message || '';
    const rawLower = (rawMessage || '').toLowerCase();
    // Detecção específica de falha de autenticação AppyPay para mensagem orientativa
    const isAppyPayAuthIssue =
      rawLower.includes('autenticação appypay') ||
      (rawLower.includes('appypay') && rawLower.includes('autentica'));

    if (isAppyPayAuthIssue) {
      return 'Falha na autenticação com o provedor de pagamento. Escolha Referência ATM ou tente novamente mais tarde.';
    }
  
  switch (status) {
    case 400:
      return 'Dados inválidos. Por favor, verifique as informações fornecidas.';
    case 409:
      return 'Bilhetes não disponíveis. Por favor, escolha outro lote ou quantidade.';
    case 500:
      return 'Erro no servidor. Por favor, tente novamente em alguns instantes.';
    case 503:
      return 'Serviço temporariamente indisponível. Por favor, tente novamente.';
    default:
      break;
  }
  
  // Erros de rede
  if (!error.response) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  // Erro genérico
  return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
}
