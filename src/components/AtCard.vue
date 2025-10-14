<template>
  <div
    class="at-card"
    tabindex="0"
    role="button"
    :aria-label="ariaLabel"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div class="at-card__banner" :style="bannerStyle">
      <slot name="banner" />
    </div>
    <div class="at-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  banner: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Ver detalhes do evento' }
});
const bannerStyle = props.banner
  ? `background-image: url('${props.banner}');`
  : 'background: linear-gradient(135deg, #0066FF 60%, #001B33 100%);';
</script>

<style scoped>
.at-card {
  background: var(--color-neutral-100);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: var(--transition), box-shadow 0.25s;
  outline: none;
  min-width: 260px;
  max-width: 340px;
  margin: var(--space-md);
}
.at-card:focus,
.at-card:hover {
  box-shadow: var(--animation-glow);
  border: 2px solid var(--color-primary);
}
.at-card__banner {
  width: 100%;
  aspect-ratio: 16/9;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}
.at-card__body {
  padding: var(--space-lg) var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
</style>
