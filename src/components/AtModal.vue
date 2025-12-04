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
  background: rgba(0, 27, 51, 0.75); /* Backdrop mais profissional */
  backdrop-filter: blur(4px); /* Efeito de desfoque no fundo */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4, 1.5rem);
  animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.at-modal {
  background: white;
  border-radius: var(--radius-lg, 12px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 700px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  outline: none;
  animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.at-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3, 1rem) var(--spacing-4, 1.5rem);
  background: linear-gradient(to bottom, white, var(--color-background, #f9fafb));
  border-bottom: 2px solid var(--color-border, #e5e5e5);
  flex-shrink: 0;
}

.at-modal__title {
  font-family: 'Poppins', sans-serif;
  font-size: var(--font-size-xl, 1.5rem);
  font-weight: 700;
  color: var(--color-primary, #1e40af);
  margin: 0;
  letter-spacing: -0.02em;
}

.at-modal__close {
  background: var(--color-background, #f9fafb);
  border: 1px solid var(--color-border, #e5e5e5);
  font-size: var(--font-size-2xl, 2rem);
  color: var(--color-text-secondary, #666);
  cursor: pointer;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full, 50%);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
}

.at-modal__close:hover {
  background: var(--color-error-light, #fee2e2);
  border-color: var(--color-error, #dc2626);
  color: var(--color-error, #dc2626);
  transform: scale(1.05);
}

.at-modal__close:active {
  transform: scale(0.95);
}

.at-modal__close:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light, #eff6ff);
}

.at-modal__content {
  flex: 1;
  overflow: hidden; /* Scroll controlado pelos filhos */
  display: flex;
  flex-direction: column;
  background: white;
}

.at-modal__footer {
  padding: 0; /* Padding controlado pelo CheckoutWizard */
  flex-shrink: 0; /* Nunca encolhe */
  background: white;
}

/* Transições suaves */
.at-modal-fade-enter-active,
.at-modal-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.at-modal-fade-enter-active .at-modal,
.at-modal-fade-leave-active .at-modal {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.at-modal-fade-enter-from,
.at-modal-fade-leave-to {
  opacity: 0;
}

.at-modal-fade-enter-from .at-modal {
  transform: translateY(20px) scale(0.95);
}

.at-modal-fade-leave-to .at-modal {
  transform: translateY(20px) scale(0.95);
}

/* Responsividade */
@media (max-width: 768px) {
  .at-modal-overlay {
    padding: 0;
    align-items: stretch;
  }

  .at-modal {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .at-modal__header {
    padding: var(--spacing-2, 0.5rem) var(--spacing-3, 1rem);
  }

  .at-modal__title {
    font-size: var(--font-size-base, 1rem);
    line-height: 1.2;
  }

  .at-modal__close {
    width: 36px;
    height: 36px;
    font-size: var(--font-size-lg, 1.25rem);
  }
}
</style>
