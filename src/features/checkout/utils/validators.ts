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
 * Entrada: GDSE-12345678 ou GDSE12345678
 * Saída: GDSE - 1234 5678
 */
export function formatCodigoBilhete(codigo: string): string {
  if (!codigo) return '';
  
  // Separar prefixo (GDSE) e número
  const match = codigo.match(/^([A-Z]+)-?(.+)$/);
  if (!match) return codigo;
  
  const prefixo = match[1]; // GDSE
  const numero = match[2].replace(/\D/g, ''); // Remove não-dígitos
  
  if (numero.length < 4) {
    return `${prefixo} - ${numero}`;
  }
  
  // Dividir número em grupos de 4
  const grupos: string[] = [];
  for (let i = 0; i < numero.length; i += 4) {
    grupos.push(numero.slice(i, i + 4));
  }
  
  return `${prefixo} - ${grupos.join(' ')}`;
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
 * Conforme documento INSTRUCOES_FRONTEND_TRATAMENTO_ERROS.txt
 * 
 * REGRA IMPORTANTE:
 * - Mensagens técnicas do backend são para logging APENAS
 * - Usuário SEMPRE vê mensagem padronizada amigável
 * - Detalhes técnicos ficam no console.error()
 */
export function getFriendlyErrorMessage(error: any): string {
  // 🎯 MENSAGEM PADRONIZADA para TODOS os erros de pagamento
  // Conforme INSTRUCOES_FRONTEND_TRATAMENTO_ERROS.txt
  return 'Erro ao processar o pagamento. Tente novamente.';
}
