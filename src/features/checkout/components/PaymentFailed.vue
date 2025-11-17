<template>
  <div class="payment-failed">
    <div class="pf-icon">
      <AtIcon name="x-circle" />
    </div>
    <h3>Pagamento não processado</h3>
    <p class="pf-message">{{ mensagemExibida }}</p>

    <div class="pf-actions">
      <AtButton :disabled="loading" variant="primary" @click="$emit('retry')">
        <AtLoader v-if="loading" size="sm" />
        <span v-else>Tentar novamente</span>
      </AtButton>
      <AtButton :disabled="loading" variant="secondary" @click="$emit('switch')">
        Usar Referência ATM
      </AtButton>
    </div>

    <p v-if="referencia" class="pf-ref">Ref.: <strong>{{ referencia }}</strong></p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtIcon from '../../../components/AtIcon.vue';
import AtButton from '../../../components/AtButton.vue';
import AtLoader from '../../../components/AtLoader.vue';

const props = defineProps<{
  mensagem?: string;
  referencia?: string;
  loading?: boolean;
}>();

const mensagemExibida = computed(() => props.mensagem || 'Pagamento recusado. Verifique os dados ou tente novamente.');
</script>

<style scoped>
.payment-failed {
  text-align: center;
  padding: var(--spacing-6, 2rem);
  background: var(--color-error-light, #fee2e2);
  border-radius: var(--radius-lg, 12px);
  border: 2px solid var(--color-error, #dc2626);
}

.pf-icon svg {
  width: 72px;
  height: 72px;
  color: var(--color-error, #dc2626);
}

h3 {
  margin: 0.5rem 0 0.25rem;
}

.pf-message {
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.pf-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.pf-ref {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
