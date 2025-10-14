<template>
  <div class="at-loader" :aria-label="label" role="status">
    <span class="at-loader__circle"></span>
    <span v-if="label" class="at-loader__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: { type: String, default: '' }
});
</script>

<style scoped>
.at-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  min-height: 60px;
}
.at-loader__circle {
  width: 36px;
  height: 36px;
  border: 4px solid var(--color-primary);
  border-top: 4px solid var(--color-neutral-300);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.at-loader__label {
  font-size: var(--font-size-sm);
  color: var(--color-primary-dark);
  margin-top: var(--space-xs);
}
</style>
