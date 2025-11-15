<template>
  <div class="payment-method-selector">
    <h3 class="pms-title">Método de Pagamento</h3>
    <p class="pms-subtitle">Escolha como deseja efetuar o pagamento</p>

    <div class="pms-options">
      <!-- GPO - Multicaixa Express -->
      <button
        type="button"
        class="pms-option"
        :class="{ 'pms-option--selected': modelValue === 'GPO' }"
        @click="selectMethod('GPO')"
      >
        <div class="pms-option-icon">
          <AtIcon name="mobile" />
        </div>
        <div class="pms-option-content">
          <h4>Multicaixa Express</h4>
          <p>Pagamento instantâneo via app</p>
          <span class="pms-badge">Recomendado</span>
        </div>
        <div class="pms-option-check">
          <AtIcon v-if="modelValue === 'GPO'" name="check-circle" />
        </div>
      </button>

      <!-- REFERENCIA - ATM/Banking -->
      <button
        type="button"
        class="pms-option"
        :class="{ 'pms-option--selected': modelValue === 'REFERENCIA' }"
        @click="selectMethod('REFERENCIA')"
      >
        <div class="pms-option-icon">
          <AtIcon name="bank" />
        </div>
        <div class="pms-option-content">
          <h4>Referência ATM</h4>
          <p>Pagamento em ATM ou Internet Banking</p>
        </div>
        <div class="pms-option-check">
          <AtIcon v-if="modelValue === 'REFERENCIA'" name="check-circle" />
        </div>
      </button>
    </div>

    <!-- Informações do método selecionado -->
    <div v-if="modelValue" class="pms-info">
      <AtIcon name="info" />
      <p v-if="modelValue === 'GPO'">
        Você será redirecionado para o aplicativo Multicaixa Express para confirmar o pagamento.
        A confirmação é instantânea.
      </p>
      <p v-else>
        Você receberá uma referência de pagamento via SMS. Use-a em qualquer ATM Multicaixa
        ou Internet Banking. A confirmação pode levar alguns minutos.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AtIcon from '../../../components/AtIcon.vue';
import type { MetodoPagamento } from '../types/checkout.types';

const props = defineProps<{
  modelValue: MetodoPagamento;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: MetodoPagamento];
}>();

const selectMethod = (method: MetodoPagamento) => {
  emit('update:modelValue', method);
};
</script>

<style scoped>
.payment-method-selector {
  padding: var(--spacing-4, 1.5rem);
}

.pms-title {
  font-size: var(--font-size-lg, 1.25rem);
  font-weight: 600;
  margin-bottom: var(--spacing-1, 0.25rem);
  color: var(--color-text-primary, #1a1a1a);
}

.pms-subtitle {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--spacing-4, 1.5rem);
}

.pms-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3, 1rem);
  margin-bottom: var(--spacing-4, 1.5rem);
}

.pms-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-3, 1rem);
  padding: var(--spacing-4, 1.5rem);
  border: 2px solid var(--color-border, #e5e5e5);
  border-radius: var(--radius-md, 8px);
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.pms-option:hover {
  border-color: var(--color-primary, #1e40af);
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.1);
}

.pms-option--selected {
  border-color: var(--color-primary, #1e40af);
  background: var(--color-primary-light, #eff6ff);
}

.pms-option-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background, #f9fafb);
  border-radius: var(--radius-md, 8px);
  color: var(--color-primary, #1e40af);
}

.pms-option--selected .pms-option-icon {
  background: var(--color-primary, #1e40af);
  color: white;
}

.pms-option-content {
  flex: 1;
}

.pms-option-content h4 {
  font-size: var(--font-size-base, 1rem);
  font-weight: 600;
  margin-bottom: var(--spacing-1, 0.25rem);
  color: var(--color-text-primary, #1a1a1a);
}

.pms-option-content p {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
  margin: 0;
}

.pms-badge {
  display: inline-block;
  margin-top: var(--spacing-2, 0.5rem);
  padding: 2px 8px;
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: 500;
  background: var(--color-success-light, #dcfce7);
  color: var(--color-success-dark, #166534);
  border-radius: var(--radius-sm, 4px);
}

.pms-option-check {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: var(--color-primary, #1e40af);
}

.pms-info {
  display: flex;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-3, 1rem);
  background: var(--color-info-light, #dbeafe);
  border-radius: var(--radius-md, 8px);
  border-left: 3px solid var(--color-info, #3b82f6);
}

.pms-info p {
  margin: 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-primary, #1a1a1a);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .payment-method-selector {
    padding: var(--spacing-3, 1rem);
  }

  .pms-option {
    padding: var(--spacing-3, 1rem);
  }

  .pms-option-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
