<template>
  <div class="step-payment">
    <AtInput
      id="nome"
      label="Nome completo"
      :model-value="modelValue.nome"
      @update:modelValue="update('nome', $event)"
      placeholder="Seu nome completo"
      required
    />
    
    <AtInput
      id="telefone"
      label="Telefone"
      :model-value="modelValue.telefone"
      @update:modelValue="update('telefone', $event)"
      placeholder="9XXXXXXXX"
      type="tel"
      required
    />
    
    <AtInput
      id="email"
      label="Email (opcional)"
      :model-value="modelValue.email"
      @update:modelValue="update('email', $event)"
      placeholder="seu@email.com"
      type="email"
    />
    
    <!-- Novo componente de seleção de método de pagamento -->
    <PaymentMethodSelector
      :model-value="modelValue.metodo"
      @update:modelValue="update('metodo', $event)"
    />
    
    <!-- Validação de telefone -->
    <div v-if="telefoneError" class="sp-error">
      <AtIcon name="alert-circle" />
      <span>{{ telefoneError }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtInput from '../AtInput.vue';
import AtIcon from '../AtIcon.vue';
import PaymentMethodSelector from '../../features/checkout/components/PaymentMethodSelector.vue';
import { isValidAngolaTelefone } from '../../features/checkout/utils/validators';

import type { MetodoPagamento } from '../../features/checkout/types/checkout.types';

interface StepPaymentModel {
  nome: string;
  telefone: string;
  email?: string;
  metodo: MetodoPagamento;
}

const props = defineProps<{
  modelValue: StepPaymentModel;
}>();

const emit = defineEmits(['update:modelValue']);

function update(field: keyof StepPaymentModel, value: string) {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
}

// Validação de telefone
const telefoneError = computed(() => {
  if (!props.modelValue.telefone) return null;
  if (!isValidAngolaTelefone(props.modelValue.telefone)) {
    return 'Telefone inválido. Use formato: 9XXXXXXXX';
  }
  return null;
});
</script>

<style scoped>
.step-payment {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4, 1.5rem);
}

.sp-error {
  display: flex;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-2, 0.5rem) var(--spacing-3, 1rem);
  background: var(--color-error-light, #fee2e2);
  border-radius: var(--radius-md, 8px);
  border-left: 3px solid var(--color-error, #dc2626);
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-error-dark, #991b1b);
}

.sp-error svg {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}
</style>
