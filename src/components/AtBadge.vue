<template>
  <span :class="['at-badge', `at-badge--${status}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  status: {
    type: String,
    default: 'disponivel', // disponivel, esgotado, ultimos
    validator: (v: string) => ['disponivel', 'esgotado', 'ultimos'].includes(v)
  }
});
</script>

<style scoped>
.at-badge {
  display: inline-block;
  padding: 0 var(--space-md);
  height: 28px;
  min-width: 60px;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  line-height: 28px;
  text-align: center;
  margin-bottom: var(--space-sm);
  box-shadow: var(--shadow-card);
  user-select: none;
}
.at-badge--disponivel {
  background: var(--color-success);
  color: var(--color-neutral-100);
}
.at-badge--esgotado {
  background: var(--color-error);
  color: var(--color-neutral-100);
}
.at-badge--ultimos {
  background: var(--color-warning);
  color: var(--color-primary-dark);
}
</style>
