<template>
  <transition name="at-toast-fade">
    <div v-if="visible" :class="['at-toast', `at-toast--${type}`]" role="alert" aria-live="assertive">
      <span class="at-toast__icon">
        <slot name="icon" />
      </span>
      <span class="at-toast__message"><slot /></span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
const props = defineProps({
  type: { type: String, default: 'success' }, // success, error, warning, info
  duration: { type: Number, default: 3500 }
});
const visible = ref(true);
onMounted(() => {
  setTimeout(() => (visible.value = false), props.duration);
});
watch(() => props.duration, (d) => {
  if (visible.value) setTimeout(() => (visible.value = false), d);
});
</script>

<style scoped>
.at-toast {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-width: 220px;
  max-width: 340px;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  font-size: var(--font-size-md);
  font-family: 'Inter', sans-serif;
  position: fixed;
  top: var(--space-lg);
  right: var(--space-lg);
  z-index: 2000;
  background: var(--color-neutral-100);
  color: var(--color-primary-dark);
  animation: fade-in 0.25s;
}
.at-toast--success {
  border-left: 6px solid var(--color-success);
}
.at-toast--error {
  border-left: 6px solid var(--color-error);
}
.at-toast--warning {
  border-left: 6px solid var(--color-warning);
}
.at-toast--info {
  border-left: 6px solid var(--color-primary);
}
.at-toast__icon {
  font-size: 1.5em;
  display: flex;
  align-items: center;
}
.at-toast-fade-enter-active,
.at-toast-fade-leave-active {
  transition: opacity 0.25s;
}
.at-toast-fade-enter-from,
.at-toast-fade-leave-to {
  opacity: 0;
}
</style>
