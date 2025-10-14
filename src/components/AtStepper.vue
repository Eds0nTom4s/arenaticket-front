<template>
  <div class="at-stepper" role="navigation" aria-label="Progresso da compra">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="at-stepper__step"
      :class="{
        'at-stepper__step--active': index === currentStep,
        'at-stepper__step--completed': index < currentStep
      }"
      :aria-current="index === currentStep ? 'step' : false"
    >
      <div class="at-stepper__indicator">
        <span v-if="index >= currentStep">{{ index + 1 }}</span>
        <span v-else>✔</span>
      </div>
      <div class="at-stepper__label">{{ step }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  steps: {
    type: Array as () => string[],
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
.at-stepper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-sm);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-neutral-200);
  margin-bottom: var(--space-lg);
}

.at-stepper__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  position: relative;
}

.at-stepper__step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 16px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: var(--color-neutral-200);
  transform: translateX(calc(var(--space-sm) / 2));
  z-index: -1;
}

.at-stepper__indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  background-color: var(--color-neutral-200);
  color: var(--color-primary-dark);
  border: 2px solid var(--color-neutral-200);
  transition: all var(--transition);
  z-index: 1;
}

.at-stepper__label {
  font-size: var(--font-size-xs);
  color: var(--color-primary-dark);
  margin-top: var(--space-xs);
  font-weight: 500;
}

/* Active State */
.at-stepper__step--active .at-stepper__indicator {
  background-color: var(--color-neutral-100);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.at-stepper__step--active .at-stepper__label {
  color: var(--color-primary);
  font-weight: 700;
}

/* Completed State */
.at-stepper__step--completed .at-stepper__indicator {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-neutral-100);
}

.at-stepper__step--completed:not(:last-child)::after {
  background-color: var(--color-primary);
}
</style>
