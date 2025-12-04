<template>
  <AtModal :open="true" @close="handleClose">
    <template #title>
      {{ evento?.nome || 'Comprar Bilhete' }}
    </template>

    <AtStepper 
      v-if="!pedidoCriado"
      :steps="wizardSteps" 
      :current-step="currentStep" 
    />

    <div class="cw-content">
      <!-- Etapa 1: Seleção de Lote -->
      <StepLoteSelection
        v-if="currentStep === 0"
        :evento-id="evento.id"
        v-model="selectedLoteId"
        @lotes-loaded="handleLotesLoaded"
      />

      <!-- Etapa 2: Quantidade -->
      <StepQuantitySelection
        v-if="currentStep === 1 && selectedLote"
        v-model="quantity"
        :lote="selectedLote"
      />

      <!-- Etapa 3: Pagamento e Dados -->
      <StepPayment
        v-if="currentStep === 2"
        v-model="buyerInfo"
      />

      <!-- Etapa 4: Confirmação e Pagamento -->
      <div v-if="currentStep === 3">
        <!-- Resumo antes de criar pedido -->
        <div v-if="!pedidoCriado" class="cw-summary">
          <h4 class="cw-summary-title">Resumo do Pedido</h4>
          <div class="cw-summary-details">
            <div class="cw-summary-item">
              <span>Evento:</span>
              <strong>{{ orderSummary.eventoNome }}</strong>
            </div>
            <div class="cw-summary-item">
              <span>Data:</span>
              <strong>{{ formatData(orderSummary.eventoData) }}</strong>
            </div>
            <div class="cw-summary-item">
              <span>Lote:</span>
              <strong>{{ orderSummary.loteNome }}</strong>
            </div>
            <div class="cw-summary-item">
              <span>Quantidade:</span>
              <strong>{{ orderSummary.quantidade }} bilhete(s)</strong>
            </div>
            <div class="cw-summary-item cw-summary-total">
              <span>Total:</span>
              <strong>{{ formatKwanza(orderSummary.total || 0) }}</strong>
            </div>
            <hr class="cw-divider" />
            <div class="cw-summary-item">
              <span>Nome:</span>
              <strong>{{ orderSummary.compradorNome }}</strong>
            </div>
            <div class="cw-summary-item">
              <span>Telefone:</span>
              <strong>{{ formatTelefone(orderSummary.compradorTelefone || '') }}</strong>
            </div>
            <div class="cw-summary-item">
              <span>Pagamento:</span>
              <strong>{{ orderSummary.metodoPagamento }}</strong>
            </div>
          </div>
        </div>

        <!-- Após criar pedido: render direto baseado no status -->
        <div v-else-if="checkoutResult">
          <!-- Sucesso imediato (GPO) com bilhetes -->
          <TicketDisplay
            v-if="checkoutResult.status === 'PAID' && bilhetesInstantaneos.length > 0"
            :bilhetes="[...bilhetesInstantaneos]"
            @close="handleClose"
          />

          <!-- Falha imediata (GPO) -->
          <PaymentFailed
            v-else-if="checkoutResult.status === 'FAILED'"
            :mensagem="(checkoutResult as any).mensagem"
            :referencia="(checkoutResult as any).referencia"
            :loading="checkoutLoading"
            @retry="retryCheckout"
            @switch="switchToReferencia"
          />

          <!-- Pendente (REFERENCIA) - exibir dados para pagar no ATM -->
          <PaymentInstructions
            v-else
            :pedido="checkoutResult"
            :telefone="buyerInfo.telefone"
            :metodo-pagamento="buyerInfo.metodo"
            :referencia-override="(checkoutResult as any).referencia"
            :entidade-override="(checkoutResult as any).entidade"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <!-- Rodapé apenas se não tiver pedido criado -->
      <div v-if="!pedidoCriado" class="cw-footer">
        <!-- Erro de checkout -->
        <div v-if="checkoutError" class="cw-error">
          <div class="cw-error-main">
            <AtIcon name="alert-circle" />
            <span>{{ checkoutError }}</span>
          </div>
          <div class="cw-error-actions" v-if="canSwitchToReferencia">
            <AtButton size="sm" variant="secondary" @click="switchToReferencia">
              Usar Referência ATM
            </AtButton>
          </div>
        </div>

        <!-- Botões de navegação -->
        <div class="cw-buttons">
          <AtButton
            v-if="currentStep > 0"
            variant="secondary"
            @click="prevStep"
            :disabled="checkoutLoading"
          >
            Voltar
          </AtButton>
          
          <AtButton
            v-if="currentStep < wizardSteps.length - 1"
            variant="primary"
            @click="nextStep"
            :disabled="!isStepValid"
          >
            Continuar
          </AtButton>
          
          <AtButton
            v-if="currentStep === wizardSteps.length - 1"
            variant="primary"
            @click="confirmPurchase"
            :disabled="checkoutLoading"
          >
            <AtLoader v-if="checkoutLoading" size="sm" />
            <span v-else>Confirmar Pedido</span>
          </AtButton>
        </div>
      </div>
    </template>
  </AtModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AtModal from './AtModal.vue';
import AtButton from './AtButton.vue';
import AtStepper from './AtStepper.vue';
import AtIcon from './AtIcon.vue';
import AtLoader from './AtLoader.vue';
import StepLoteSelection from './steps/StepLoteSelection.vue';
import StepQuantitySelection from './steps/StepQuantitySelection.vue';
import StepPayment from './steps/StepPayment.vue';
import PaymentInstructions from '../features/checkout/components/PaymentInstructions.vue';
import TicketDisplay from '../features/checkout/components/TicketDisplay.vue';
import PaymentFailed from '../features/checkout/components/PaymentFailed.vue';

// Hooks
import { useIdempotency } from '../features/checkout/hooks/useIdempotency';
import { useCheckout } from '../features/checkout/hooks/useCheckout';

// Utils
import { 
  formatKwanza, 
  formatTelefone, 
  formatDataEvento,
  cleanTelefone,
} from '../features/checkout/utils/validators';

import type { CheckoutRequest, Lote } from '../features/checkout/types/checkout.types';
import type { PedidoBackendResponse } from '../features/checkout/types/pedido.types';

const props = defineProps({
  evento: { type: Object, required: true }
});

const emit = defineEmits(['close', 'confirm']);

// State
const wizardSteps = ['Lote', 'Quantidade', 'Pagamento', 'Confirmar'];
const currentStep = ref(0);
const selectedLoteId = ref<string | undefined>(undefined);
const quantity = ref(1);
const buyerInfo = ref({
  nome: '',
  telefone: '',
  email: '',
  metodo: 'REFERENCIA' as 'GPO' | 'REFERENCIA'
});
const availableLotes = ref<Lote[]>([]);
const pedidoCriado = ref(false);

// Hooks
const { generateKey, resetKey } = useIdempotency();
const { 
  isCreating: checkoutLoading, 
  error: checkoutError, 
  createOrder,
  bilhetes: bilhetesInstantaneos, // ✨ NOVO v1.2.0: Bilhetes de GPO instantâneo
  isPaidInstantly, // ✨ NOVO v1.2.0: Flag de pagamento instantâneo
  reset: resetCheckout
} = useCheckout();
const checkoutResult = ref<PedidoBackendResponse | null>(null);

function handleLotesLoaded(lotes: Lote[]) {
  availableLotes.value = lotes;
}

const selectedLote = computed(() => {
  return availableLotes.value.find(lote => lote.id === selectedLoteId.value);
});

const orderSummary = computed(() => {
  const lote = selectedLote.value;
  if (!lote) return {};
  
  return {
    eventoNome: props.evento.nome,
    eventoData: props.evento.data,
    loteNome: lote.nome,
    quantidade: quantity.value,
    precoUnitario: lote.preco,
    total: lote.preco * quantity.value,
    compradorNome: buyerInfo.value.nome,
    compradorTelefone: buyerInfo.value.telefone,
    metodoPagamento: buyerInfo.value.metodo === 'GPO' ? 'Multicaixa Express' : 'Referência ATM'
  };
});

// Validação da etapa
const isStepValid = computed(() => {
  switch (currentStep.value) {
    case 0:
      return !!selectedLoteId.value;
    case 1:
      return quantity.value > 0;
    case 2: {
      const info = buyerInfo.value;
      const telefoneClean = cleanTelefone(info.telefone);
      return (
        info.nome.trim().length >= 3 &&
        /^9[1-9]\d{7}$/.test(telefoneClean) &&
        !!info.metodo
      );
    }
    default:
      return true;
  }
});

function nextStep() {
  if (currentStep.value < wizardSteps.length - 1) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

const canSwitchToReferencia = computed(() => {
  return (
    buyerInfo.value.metodo === 'GPO' &&
    !!checkoutError.value &&
    /appypay|provedor|autentica/i.test(checkoutError.value)
  );
});

function switchToReferencia() {
  buyerInfo.value.metodo = 'REFERENCIA';
  resetCheckout();
  // Voltar para etapa de pagamento para confirmar novamente
  currentStep.value = 2;
}

async function confirmPurchase() {
  if (checkoutLoading.value) return;

  try {
    // Gerar chave idempotente
    const idempotencyKey = generateKey();
    
    console.log('[CheckoutWizard] Criando pedido com chave:', idempotencyKey);

    // Preparar dados do checkout
    const checkoutData: CheckoutRequest = {
      loteId: selectedLoteId.value!,
      quantidade: quantity.value,
      compradorNome: buyerInfo.value.nome,
      compradorTelefone: cleanTelefone(buyerInfo.value.telefone),
      compradorEmail: buyerInfo.value.email || undefined,
      metodoPagamento: buyerInfo.value.metodo as 'GPO' | 'REFERENCIA',
    };

    // Criar pedido com retry automático
    const result = await createOrder(checkoutData, idempotencyKey);
    
    checkoutResult.value = result;
    pedidoCriado.value = true;

    console.log('[CheckoutWizard] Pedido criado com sucesso:', result);

  } catch (error: any) {
    console.error('[CheckoutWizard] Erro ao criar pedido:', error);
    
    // Resetar chave apenas se não for erro retryable
    if (!error.isRetryable) {
      resetKey();
    }
  }
}

// Polling removido — status tratado diretamente na resposta do checkout

function handleClose() {
  // Reseta o estado antes de fechar
  currentStep.value = 0;
  selectedLoteId.value = undefined;
  quantity.value = 1;
  buyerInfo.value = { nome: '', telefone: '', email: '', metodo: 'REFERENCIA' };
  pedidoCriado.value = false;
  checkoutResult.value = null;
  resetKey();
  emit('close');
}

function formatData(dataISO: string): string {
  return formatDataEvento(dataISO);
}

// Navegação por teclado
function handleKeyDown(e: KeyboardEvent) {
  if (pedidoCriado.value) return; // Desabilitar durante polling

  if (e.key === 'ArrowRight' && currentStep.value < wizardSteps.length - 1 && isStepValid.value) {
    nextStep();
  } else if (e.key === 'ArrowLeft' && currentStep.value > 0) {
    prevStep();
  } else if (e.key === 'Escape') {
    handleClose();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function retryCheckout() {
  // Recria o pedido imediatamente com uma NOVA chave idempotente, mantendo os dados
  pedidoCriado.value = false;
  checkoutResult.value = null;
  // Permanecemos no step 3 e reusamos confirmPurchase para gerar um novo pedido
  confirmPurchase();
}
</script>

<style scoped>
.cw-content {
  min-height: 300px;
  max-height: none;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-2, 0.5rem) var(--spacing-3, 1rem);
  margin-bottom: 20px;
  overflow-y: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scroll estilizado */
.cw-content::-webkit-scrollbar {
  width: 8px;
}

.cw-content::-webkit-scrollbar-track {
  background: var(--color-background, #f9fafb);
  border-radius: 4px;
}

.cw-content::-webkit-scrollbar-thumb {
  background: var(--color-border, #e5e5e5);
  border-radius: 4px;
}

.cw-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary, #999);
}

.cw-footer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2, 0.5rem);
  width: 100%;
  padding: var(--spacing-3, 1rem);
  background: var(--color-background, #f9fafb);
  border-top: 1px solid var(--color-border, #e5e5e5);
  flex-shrink: 0;
}

.cw-error {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-3, 1rem);
  background: var(--color-error-light, #fee2e2);
  border-radius: var(--radius-md, 8px);
  border-left: 3px solid var(--color-error, #dc2626);
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-error-dark, #991b1b);
  animation: slideIn 0.3s ease-out;
}

.cw-error-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
}

.cw-error-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-2, 0.5rem);
}

.cw-error-actions button {
  font-size: 0.75rem;
  padding: 4px 8px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cw-error svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.cw-buttons {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-3, 1rem);
}

.cw-buttons > * {
  flex: 1;
  min-width: 0; /* Permite que os botões encolham igualmente */
}

.cw-summary {
  padding: var(--spacing-4, 1.5rem);
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cw-summary-title {
  font-size: var(--font-size-xl, 1.5rem);
  font-weight: 700;
  margin-bottom: var(--spacing-4, 1.5rem);
  text-align: center;
  color: var(--color-primary, #1e40af);
  padding-bottom: var(--spacing-3, 1rem);
  border-bottom: 2px solid var(--color-primary-light, #eff6ff);
}

.cw-summary-details {
  background: white;
  padding: var(--spacing-5, 2rem);
  border-radius: var(--radius-lg, 12px);
  border: 2px solid var(--color-border, #e5e5e5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.cw-summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3, 1rem) 0;
  font-size: var(--font-size-base, 1rem);
  border-bottom: 1px solid var(--color-background, #f9fafb);
}

.cw-summary-item:last-child {
  border-bottom: none;
}

.cw-summary-item span {
  color: var(--color-text-secondary, #666);
  font-weight: 500;
}

.cw-summary-item strong {
  color: var(--color-text-primary, #1a1a1a);
  font-weight: 600;
  text-align: right;
}

.cw-summary-total {
  background: var(--color-primary-light, #eff6ff);
  margin: var(--spacing-3, 1rem) -var(--spacing-5, 2rem) 0;
  padding: var(--spacing-4, 1.5rem) var(--spacing-5, 2rem);
  border-radius: 0 0 var(--radius-lg, 12px) var(--radius-lg, 12px);
}

.cw-summary-total span {
  color: var(--color-primary-dark, #1e3a8a);
  font-size: var(--font-size-lg, 1.25rem);
  font-weight: 600;
}

.cw-summary-total strong {
  color: var(--color-primary, #1e40af);
  font-weight: 700;
  font-size: var(--font-size-2xl, 2rem);
}

.cw-divider {
  border: none;
  border-top: 2px solid var(--color-border, #e5e5e5);
  margin: var(--spacing-3, 1rem) 0;
}

/* Animações de entrada para steps */
.cw-content > * {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estados de loading nos botões */
.cw-buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsividade melhorada */
@media (max-width: 768px) {
  .cw-content {
    min-height: 400px;
    max-height: 500px;
    padding: var(--spacing-3, 1rem);
  }

  .cw-footer {
    padding: var(--spacing-3, 1rem);
    min-height: 80px;
  }

  .cw-buttons {
    flex-direction: column;
  }

  .cw-summary {
    padding: var(--spacing-3, 1rem);
  }

  .cw-summary-title {
    font-size: var(--font-size-lg, 1.25rem);
  }

  .cw-summary-details {
    padding: var(--spacing-3, 1rem);
  }

  .cw-summary-total {
    margin: var(--spacing-2, 0.5rem) -var(--spacing-3, 1rem) 0;
    padding: var(--spacing-3, 1rem);
  }

  .cw-summary-total strong {
    font-size: var(--font-size-xl, 1.5rem);
  }
}

/* Loading spinner nos botões */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
