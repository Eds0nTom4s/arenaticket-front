<template>
  <div class="step-quantity-selection">
    <h4 class="step-title">Quantidade de Bilhetes</h4>
    <div class="quantity-selector-wrapper">
      <AtQuantitySelector
        :model-value="modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
        :min="1"
        :max="maxQuantity"
      />
      <p v-if="maxQuantity < 5" class="quantity-info">
        Máximo de {{ maxQuantity }} bilhetes por compra.
      </p>
    </div>
    <div class="subtotal-wrapper">
      <span class="subtotal-label">Subtotal:</span>
      <span class="subtotal-value">{{ formatPrice(subtotal) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtQuantitySelector from '../AtQuantitySelector.vue';

const props = defineProps({
  modelValue: { type: Number, required: true },
  lote: { type: Object, required: true }
});

const emit = defineEmits(['update:modelValue']);

const maxQuantity = computed(() => {
  return Math.min(5, props.lote?.quantidadeDisponivel || 5);
});

const subtotal = computed(() => {
  return (props.lote?.preco || 0) * props.modelValue;
});

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(price).replace('AOA', 'Kz');
}
</script>

<style scoped>
.step-quantity-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
  padding: var(--space-lg) 0;
}

.step-title {
  margin: 0 0 var(--space-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary-dark);
  text-align: center;
  width: 100%;
}

.quantity-selector-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}
.quantity-info {
  font-size: var(--font-size-sm);
  color: var(--color-primary-dark);
  opacity: 0.8;
}
.subtotal-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}
.subtotal-label {
  font-size: var(--font-size-md);
  color: var(--color-primary-dark);
}
.subtotal-value {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
}
</style>
