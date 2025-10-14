<template>
  <div class="at-input-group">
    <label :for="id" class="at-input-label">{{ label }}</label>
    <div class="at-input-wrapper" :class="statusClass">
      <span v-if="icon" class="at-input-icon">
        <slot name="icon" />
      </span>
      <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :aria-invalid="status === 'error' ? 'true' : 'false'"
        :aria-describedby="status === 'error' ? id + '-error' : null"
        :disabled="disabled"
        class="at-input"
        v-bind="$attrs"
      />
    </div>
    <span v-if="status === 'error' && errorMessage" :id="id + '-error'" class="at-input-error">{{ errorMessage }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  icon: { type: Boolean, default: false },
  status: { type: String, default: '' }, // '', 'error', 'success'
  errorMessage: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
});
const statusClass = props.status ? `at-input--${props.status}` : '';
</script>

<style scoped>
.at-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}
.at-input-label {
  font-family: 'Inter', sans-serif;
  font-size: var(--font-size-sm);
  color: var(--color-primary-dark);
  margin-bottom: var(--space-xs);
}
.at-input-wrapper {
  display: flex;
  align-items: center;
  background: var(--color-neutral-100);
  border: 2px solid var(--color-neutral-300);
  border-radius: var(--radius-button);
  transition: var(--transition);
  padding: 0 var(--space-sm);
}
.at-input-wrapper:focus-within {
  border-color: var(--color-primary);
  box-shadow: var(--animation-glow);
}
.at-input-icon {
  margin-right: var(--space-xs);
  color: var(--color-primary);
  display: flex;
  align-items: center;
}
.at-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-md);
  padding: var(--space-sm) 0;
  flex: 1;
  color: var(--color-primary-dark);
}
.at-input:disabled {
  background: var(--color-neutral-300);
  color: #888;
}
.at-input--error {
  border-color: var(--color-error);
}
.at-input--success {
  border-color: var(--color-success);
}
.at-input-error {
  color: var(--color-error);
  font-size: var(--font-size-xs);
  margin-top: var(--space-xs);
}
</style>
