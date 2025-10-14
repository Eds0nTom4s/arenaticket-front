<template>
  <div class="at-qty">
    <button
      class="at-qty__btn"
      :disabled="modelValue <= min"
      aria-label="Diminuir quantidade"
      @click="$emit('update:modelValue', Math.max(modelValue - 1, min))"
    >–</button>
    <span class="at-qty__value">{{ modelValue }}</span>
    <button
      class="at-qty__btn"
      :disabled="modelValue >= max"
      aria-label="Aumentar quantidade"
      @click="$emit('update:modelValue', Math.min(modelValue + 1, max))"
    >+</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Number, default: 1 },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 10 }
});
</script>

<style scoped>
.at-qty {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}
.at-qty__btn {
  background: var(--color-primary);
  color: var(--color-neutral-100);
  border: none;
  border-radius: var(--radius-button);
  width: 44px;
  height: 44px;
  font-size: var(--font-size-lg);
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-card);
}
.at-qty__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.at-qty__value {
  font-size: var(--font-size-lg);
  font-family: 'Inter', sans-serif;
  min-width: 32px;
  text-align: center;
}
</style>
