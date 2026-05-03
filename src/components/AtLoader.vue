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
  width: 48px;
  height: 48px;
  border: 5px solid rgba(0, 27, 51, 0.1);
  border-top: 5px solid var(--color-primary);
  border-right: 5px solid var(--color-secondary);
  border-radius: 50%;
  animation: spin 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  box-shadow: 0 2px 10px rgba(0, 27, 51, 0.1);
}
@keyframes spin {
  0% { 
    transform: rotate(0deg);
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% { 
    transform: rotate(360deg);
    opacity: 1;
  }
}
.at-loader__label {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--color-primary-dark);
  margin-top: var(--space-sm);
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
