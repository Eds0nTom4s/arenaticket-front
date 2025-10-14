<template>
  <AtCard :banner="evento.bannerUrl" :aria-label="`Comprar bilhete para ${evento.nome}`" @click="$emit('comprar')">
    <template #banner>
      <AtBadge :status="evento.status">
        <span v-if="evento.status === 'disponivel'">Disponível</span>
        <span v-else-if="evento.status === 'esgotado'">Esgotado</span>
        <span v-else-if="evento.status === 'ultimos'">Últimos lugares</span>
      </AtBadge>
    </template>
    <div class="tc-title">{{ evento.nome }}</div>
    <div class="tc-date">{{ formatDate(evento.data) }}</div>
    <AtButton variant="primary" size="md" :disabled="evento.status === 'esgotado'">
      Ver Lotes / Comprar
    </AtButton>
  </AtCard>
</template>

<script setup lang="ts">
import AtCard from './AtCard.vue';
import AtBadge from './AtBadge.vue';
import AtButton from './AtButton.vue';
const props = defineProps({
  evento: { type: Object, required: true }
});
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.tc-title {
  font-family: 'Poppins', sans-serif;
  font-size: var(--font-size-lg);
  color: var(--color-primary-dark);
  margin-bottom: var(--space-xs);
}
.tc-date {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  margin-bottom: var(--space-xs);
}
.tc-price {
  font-size: var(--font-size-md);
  color: var(--color-primary-dark);
  font-weight: 600;
  margin-bottom: var(--space-md);
}
</style>
