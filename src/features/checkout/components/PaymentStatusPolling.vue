<template>
  <div class="payment-status-polling">
    <PaymentInstructions
      v-if="!isPaid"
      :pedido="pedido"
      :telefone="telefone"
    />

    <TicketDisplay
      v-if="isPaid && bilhetes.length > 0"
      :bilhetes="bilhetes"
      @close="$emit('close')"
    />

    <!-- Erro -->
    <div v-if="error" class="psp-error">
      <AtIcon name="alert-circle" />
      <div>
        <h4>Erro ao verificar pagamento</h4>
        <p>{{ error.message }}</p>
        <AtButton variant="secondary" size="sm" @click="retry">
          Tentar Novamente
        </AtButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AtIcon from '../../../components/AtIcon.vue';
import AtButton from '../../../components/AtButton.vue';
import PaymentInstructions from './PaymentInstructions.vue';
import TicketDisplay from './TicketDisplay.vue';
import { usePaymentStatus, PAYMENT_TIMEOUTS } from '../hooks/usePaymentStatus';
import type { CheckoutResponse, MetodoPagamento } from '../types/checkout.types';

const props = defineProps<{
  pedido: CheckoutResponse;
  telefone: string;
  metodoPagamento: MetodoPagamento;
}>();

const emit = defineEmits<{
  complete: [bilhetes: any[]];
  error: [error: Error];
  close: [];
}>();

// Determinar timeout baseado no método de pagamento
const timeout = props.metodoPagamento === 'GPO' 
  ? PAYMENT_TIMEOUTS.GPO 
  : PAYMENT_TIMEOUTS.REFERENCIA;

// Hook de polling
const {
  status,
  bilhetes,
  isLoading,
  error,
  startPolling,
  stopPolling,
} = usePaymentStatus({
  timeoutMs: timeout,
  onPaid: (bilhetesRecebidos) => {
    console.log('[PaymentStatusPolling] Pagamento confirmado!');
    emit('complete', bilhetesRecebidos);
  },
  onError: (err) => {
    console.error('[PaymentStatusPolling] Erro:', err);
    emit('error', err);
  },
  onTimeout: () => {
    console.warn('[PaymentStatusPolling] Timeout atingido');
    emit('error', new Error('Tempo esgotado. O pagamento ainda não foi confirmado.'));
  },
});

const isPaid = computed(() => status.value === 'PAID');

const retry = () => {
  startPolling(props.pedido.pedido.id);
};

// Iniciar polling ao montar
onMounted(() => {
  console.log('[PaymentStatusPolling] Iniciando polling para pedido:', props.pedido.pedido.id);
  startPolling(props.pedido.pedido.id);
});
</script>

<style scoped>
.payment-status-polling {
  width: 100%;
}

.psp-error {
  display: flex;
  gap: var(--spacing-3, 1rem);
  padding: var(--spacing-4, 1.5rem);
  background: var(--color-error-light, #fee2e2);
  border-radius: var(--radius-md, 8px);
  border-left: 4px solid var(--color-error, #dc2626);
  margin-top: var(--spacing-4, 1.5rem);
}

.psp-error svg {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: var(--color-error, #dc2626);
}

.psp-error h4 {
  font-size: var(--font-size-base, 1rem);
  font-weight: 600;
  margin: 0 0 var(--spacing-1, 0.25rem) 0;
  color: var(--color-error-dark, #991b1b);
}

.psp-error p {
  margin: 0 0 var(--spacing-3, 1rem) 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-primary, #1a1a1a);
}
</style>
