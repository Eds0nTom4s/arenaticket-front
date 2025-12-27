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
 * Conforme documento ATUALIZACOES_TRATAMENTO_ERROS_FRONTEND.txt
 * 
 * REGRA: Mensagens técnicas ficam apenas no console.error()
 * Usuário vê mensagem limpa e amigável
 */
export function getFriendlyErrorMessage(error: any): string {
  const status = error.response?.status;
  const backendMessage = error.response?.data?.message || error.message || '';
  
  // 🔴 HTTP 402 Payment Required - Novo comportamento do backend
  // Backend já retorna mensagem limpa e legível da AppyPay
  if (status === 402) {
    // Se backend enviou mensagem limpa, usar diretamente
    if (backendMessage && backendMessage.length > 0) {
      return backendMessage;
    }
    // Fallback genérico
    return 'Erro ao processar o pagamento. Tente novamente ou contacte o apoio ao cliente.';
  }
  
  // 🔴 HTTP 400 Bad Request - Dados inválidos
  if (status === 400) {
    // Usar mensagem do backend se disponível
    if (backendMessage && backendMessage.length > 0) {
      return backendMessage;
    }
    return 'Dados inválidos. Por favor, verifique as informações fornecidas.';
  }
  
  // 🔴 HTTP 409 Conflict - Bilhetes não disponíveis
  if (status === 409) {
    return 'Bilhetes não disponíveis. Por favor, escolha outro lote ou quantidade.';
  }
  
  // 🔴 HTTP 500 Internal Server Error
  if (status === 500) {
    // Usar mensagem do backend se disponível
    if (backendMessage && backendMessage.length > 0) {
      return backendMessage;
    }
    return 'Erro no servidor. Por favor, tente novamente em alguns instantes.';
  }
  
  // 🔴 HTTP 503 Service Unavailable
  if (status === 503) {
    return 'Serviço temporariamente indisponível. Por favor, tente novamente.';
  }
  
  // 🔴 Erros de rede (sem resposta do servidor)
  if (!error.response) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  // 🔴 Fallback: usar mensagem do backend ou genérica
  if (backendMessage && backendMessage.length > 0) {
    return backendMessage;
  }
  
  // Mensagem genérica final
  return 'Erro ao processar o pagamento. Tente novamente ou contacte o apoio ao cliente.';
}
