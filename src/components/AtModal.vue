<template>
  <transition name="at-modal-fade">
    <div v-if="open" class="at-modal-overlay" @click.self="$emit('close')">
      <div class="at-modal" role="dialog" aria-modal="true" tabindex="-1">
        <header class="at-modal__header">
          <h2 class="at-modal__title"><slot name="title" /></h2>
          <button class="at-modal__close" aria-label="Fechar" @click="$emit('close')">×</button>
        </header>
        <section class="at-modal__content">
          <slot />
        </section>
        <footer class="at-modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
const props = defineProps({
  open: { type: Boolean, default: false }
});
const emit = defineEmits(['close']);
function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}
onMounted(() => {
  window.addEventListener('keydown', handleEsc);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc);
});
</script>

<style scoped>
.at-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,27,51,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fade-in 0.25s;
}
.at-modal {
  background: var(--color-neutral-100);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  min-width: 320px;
  max-width: 96vw;
  min-height: 180px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  outline: none;
  animation: fade-in 0.25s;
}
.at-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-lg) var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-neutral-300);
}
.at-modal__title {
  font-family: 'Poppins', sans-serif;
  font-size: var(--font-size-lg);
  color: var(--color-primary-dark);
  margin: 0;
}
.at-modal__close {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  color: var(--color-primary-dark);
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radius-button);
  transition: var(--transition);
}
.at-modal__close:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
}
.at-modal__content {
  padding: var(--space-lg);
  flex: 1;
  overflow-y: auto;
}
.at-modal__footer {
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--color-neutral-300);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
}
.at-modal-fade-enter-active,
.at-modal-fade-leave-active {
  transition: opacity 0.25s;
}
.at-modal-fade-enter-from,
.at-modal-fade-leave-to {
  opacity: 0;
}
</style>
