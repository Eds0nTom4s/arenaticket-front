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
        <img src="/multicaixa_express.jpeg" alt="Multicaixa Express" class="pms-option-img" />
        <div class="pms-option-content">
          <h4>Multicaixa Express</h4>
        </div>
      </button>

      <!-- REFERENCIA - ATM/Banking -->
      <button
        type="button"
        class="pms-option"
        :class="{ 'pms-option--selected': modelValue === 'REFERENCIA' }"
        @click="selectMethod('REFERENCIA')"
      >
        <img src="/Referencia_atm.jpeg" alt="Referência ATM" class="pms-option-img" />
        <div class="pms-option-content">
          <h4>Referência ATM</h4>
        </div>
      </button>
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
  padding: 0;
}

.pms-title {
  font-size: var(--font-size-base, 1rem);
  font-weight: 600;
  margin-bottom: var(--spacing-1, 0.25rem);
  color: var(--color-text-primary, #1a1a1a);
}

.pms-subtitle {
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--spacing-2, 0.5rem);
}

.pms-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3, 1rem);
}

@media (max-width: 768px) {
  .pms-options {
    gap: var(--spacing-2, 0.5rem);
  }
}

.pms-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-3, 1rem);
  border: 2px solid var(--color-border, #e5e5e5);
  border-radius: var(--radius-md, 8px);
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  min-height: 110px;
}

@media (max-width: 768px) {
  .pms-option {
    min-height: 85px;
    padding: var(--spacing-2, 0.5rem);
    gap: var(--spacing-1, 0.25rem);
  }
}

.pms-option:hover {
  border-color: var(--color-primary, #1e40af);
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.1);
}

.pms-option--selected {
  border-color: var(--color-primary, #1e40af);
  background: var(--color-primary-light, #eff6ff);
}

.pms-option-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: var(--radius-md, 8px);
  margin-bottom: var(--spacing-1, 0.25rem);
}

@media (max-width: 768px) {
  .pms-option-img {
    width: 40px;
    height: 40px;
    margin-bottom: 0;
  }
}

.pms-option-content {
  flex: 1;
  width: 100%;
}

.pms-option-content h4 {
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary, #1a1a1a);
  line-height: 1.2;
}

@media (max-width: 768px) {
  .pms-option-content h4 {
    font-size: var(--font-size-xs, 0.75rem);
  }
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

.pms-badge--instant {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #fbbf24;
  font-weight: 600;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(251, 191, 36, 0);
  }
}

.pms-option-check {
  display: none;
}

@media (max-width: 768px) {
  .pms-options {
    gap: var(--spacing-2, 0.5rem);
  }
  
  .pms-option {
    min-height: 100px;
    padding: var(--spacing-2, 0.5rem);
  }
  
  .pms-option-img {
    width: 45px;
    height: 45px;
  }
  
  .pms-option-content h4 {
    font-size: 0.8rem;
  }
}
</style>
