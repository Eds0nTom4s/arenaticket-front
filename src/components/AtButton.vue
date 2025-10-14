<template>
  <button
    :class="[
      'at-btn',
      `at-btn--${variant}`,
      `at-btn--${size}`,
      { 'is-loading': loading }
    ]"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    v-bind="$attrs"
  >
    <span v-if="loading" class="at-btn__loader"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, ghost
  size: { type: String, default: 'md' }, // sm, md, lg
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' }
});
</script>

<style scoped>
.at-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-button);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  cursor: pointer;
  min-height: 44px;
  min-width: 44px;
  padding: 0 var(--space-lg);
  font-size: var(--font-size-md);
  transition: var(--transition);
  outline: none;
  position: relative;
}
.at-btn:focus {
  box-shadow: 0 0 0 2px var(--color-primary-dark);
}
.at-btn--primary {
  background: var(--color-primary);
  color: var(--color-neutral-100);
  box-shadow: var(--shadow-card);
}
.at-btn--primary:hover:not(:disabled),
.at-btn--primary:focus-visible:not(:disabled) {
  box-shadow: var(--animation-glow);
  background: #338cff;
}
.at-btn--secondary {
  background: var(--color-secondary);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}
.at-btn--secondary:hover:not(:disabled),
.at-btn--secondary:focus-visible:not(:disabled) {
  background: var(--color-neutral-100);
  box-shadow: var(--animation-glow);
}
.at-btn--ghost {
  background: none;
  color: var(--color-primary);
  text-decoration: underline transparent;
  border: none;
}
.at-btn--ghost:hover:not(:disabled),
.at-btn--ghost:focus-visible:not(:disabled) {
  text-decoration: underline var(--color-primary);
  background: var(--color-neutral-100);
}
.at-btn--sm {
  font-size: var(--font-size-sm);
  padding: 0 var(--space-md);
  min-height: 36px;
}
.at-btn--md {
  font-size: var(--font-size-md);
  padding: 0 var(--space-lg);
  min-height: 44px;
}
.at-btn--lg {
  font-size: var(--font-size-lg);
  padding: 0 var(--space-xl);
  min-height: 56px;
}
.at-btn:disabled,
.at-btn.is-loading {
  opacity: 0.6;
  cursor: not-allowed;
}
.at-btn__loader {
  border: 2px solid var(--color-neutral-100);
  border-top: 2px solid var(--color-primary-dark);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: var(--space-sm);
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
