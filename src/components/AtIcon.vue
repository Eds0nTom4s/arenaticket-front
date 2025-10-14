<template>
  <span :class="['at-icon', `at-icon--${size}`]" :aria-hidden="ariaHidden">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  size: { type: String, default: 'md' }, // sm, md, lg
  ariaHidden: { type: Boolean, default: true }
});
</script>

<style scoped>
.at-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}
.at-icon--sm {
  font-size: 1em;
  width: 20px;
  height: 20px;
}
.at-icon--md {
  font-size: 1.5em;
  width: 28px;
  height: 28px;
}
.at-icon--lg {
  font-size: 2em;
  width: 40px;
  height: 40px;
}
</style>
