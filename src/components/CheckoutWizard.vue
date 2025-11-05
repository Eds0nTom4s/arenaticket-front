<template>
  <AtModal :open="true" @close="handleClose">
    <template #title>
      {{ evento?.nome || 'Comprar Bilhete' }}
    </template>

    <AtStepper :steps="wizardSteps" :current-step="currentStep" />

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
        v-if="currentStep === 1"
        v-model="quantity"
        :lote="selectedLote"
      />

      <!-- Etapa 3: Pagamento e Dados -->
      <StepPayment
        v-if="currentStep === 2"
        v-model="buyerInfo"
      />

      <!-- Etapa 4: Confirmação -->
      <StepConfirmation
        v-if="currentStep === 3"
        :loading="checkoutLoading"
        :error="checkoutError"
        :bilhetes="checkoutResult || []"
        :summary="orderSummary"
        @retry="confirmPurchase"
        @close="handleClose"
      />
    </div>

    <template #footer>
      <div v-if="!checkoutResult" class="cw-footer">
        <AtButton
          v-if="currentStep > 0"
          variant="secondary"
          @click="prevStep"
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
          :disabled="!isStepValid"
        >
          Confirmar Pagamento
        </AtButton>
      </div>
    </template>
  </AtModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AtModal from './AtModal.vue';
import AtButton from './AtButton.vue';
import AtStepper from './AtStepper.vue';
import StepLoteSelection from './steps/StepLoteSelection.vue';
import StepQuantitySelection from './steps/StepQuantitySelection.vue';
import StepPayment from './steps/StepPayment.vue';
import StepConfirmation from './steps/StepConfirmation.vue';

const props = defineProps({
  evento: { type: Object, required: true }
});

const emit = defineEmits(['close', 'confirm']);

const wizardSteps = ['Lote', 'Quantidade', 'Pagamento', 'Confirmar'];
const currentStep = ref(0);
const selectedLoteId = ref<string | null>(null);
const quantity = ref(1);
const buyerInfo = ref({
  nome: '',
  telefone: '',
  metodo: 'GPO'
});
const checkoutLoading = ref(false);
const checkoutError = ref<string | null>(null);
const checkoutResult = ref(null);
const availableLotes = ref([]);

function handleLotesLoaded(lotes) {
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
    total: lote.preco * quantity.value,
    nome: buyerInfo.value.nome,
    telefone: buyerInfo.value.telefone,
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
    case 2:
      return (
        !!buyerInfo.value.nome &&
        /^[9][1-9]\d{7}$/.test(buyerInfo.value.telefone) && // Validates Angolan phone numbers
        !!buyerInfo.value.metodo
      );
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

async function confirmPurchase() {
  checkoutLoading.value = true;
  checkoutError.value = null;
  try {
    // Simulação de chamada API de checkout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock de sucesso para múltiplos bilhetes
    const bilhetes = [];
    for (let i = 0; i < quantity.value; i++) {
      const codigoBilhete = `GDSE-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      bilhetes.push({
        ...orderSummary.value,
        codigo: codigoBilhete,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${codigoBilhete}`
      });
    }
    checkoutResult.value = bilhetes;

  } catch (e) {
    checkoutError.value = 'Ocorreu um erro ao processar o seu pagamento. Por favor, tente novamente.';
  } finally {
    checkoutLoading.value = false;
  }
}

function handleClose() {
  // Reseta o estado antes de fechar
  currentStep.value = 0;
  selectedLoteId.value = null;
  quantity.value = 1;
  buyerInfo.value = { nome: '', telefone: '', metodo: 'GPO' };
  checkoutLoading.value = false;
  checkoutError.value = null;
  checkoutResult.value = null;
  emit('close');
}

// Navegação por teclado
function handleKeyDown(e: KeyboardEvent) {
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
</script>

<style scoped>
.cw-content {
  min-height: 200px; /* Para evitar que o modal mude de tamanho drasticamente */
  display: flex;
  flex-direction: column;
}

.cw-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
