<template>
  <div class="ticket-slider">
    <div class="slider-container" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(ticket, index) in tickets" :key="index" class="ticket-slide">
        <div class="ticket-details">
          <div class="ticket-header">
            <h5 class="ticket-event-name">{{ ticket.eventoNome }}</h5>
            <p class="ticket-event-date">{{ formatDate(ticket.eventoData) }}</p>
          </div>
          <img :src="ticket.qrCode" alt="QR Code do bilhete" class="st-qr-image" />
          <div class="ticket-info">
            <div class="info-col">
              <span class="info-label">Lote</span>
              <span class="info-value">{{ ticket.loteNome }}</span>
            </div>
            <div class="info-col">
              <span class="info-label">Nome</span>
              <span class="info-value">{{ ticket.nome }}</span>
            </div>
          </div>
          <div class="st-code">
            <span class="st-code-label">Código do Bilhete ({{ index + 1 }}/{{ tickets.length }}):</span>
            <div class="st-code-value">
              {{ ticket.codigo }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tickets.length > 1" class="slider-controls">
      <button @click="prev" class="slider-btn prev-btn" aria-label="Bilhete anterior">‹</button>
      <button @click="next" class="slider-btn next-btn" aria-label="Próximo bilhete">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AtIcon from './AtIcon.vue';

const props = defineProps({
  tickets: { type: Array, required: true }
});

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const currentIndex = ref(0);

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.tickets.length;
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.tickets.length) % props.tickets.length;
}
</script>

<style scoped>
.ticket-slider {
  position: relative;
  width: 100%;
  max-width: 320px;
  overflow: hidden;
}
.slider-container {
  display: flex;
  transition: transform 0.3s ease-in-out;
}
.ticket-slide {
  flex: 0 0 100%;
  width: 100%;
  padding: 0 var(--space-sm);
}
.ticket-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-card);
  background: var(--color-neutral-100);
  width: 100%;
}
.ticket-header {
  text-align: center;
  width: 100%;
  border-bottom: 1px dashed var(--color-neutral-300);
  padding-bottom: var(--space-sm);
  margin-bottom: var(--space-sm);
}
.ticket-event-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
}
.ticket-event-date {
  font-size: var(--font-size-sm);
  color: var(--color-primary-dark);
}
.ticket-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-sm) 0;
}
.info-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-xxs);
}
.info-label {
  font-size: var(--font-size-xs);
  color: var(--color-primary-dark);
  opacity: 0.7;
}
.info-value {
  font-weight: 600;
}
.st-qr-image {
  width: 180px;
  height: 180px;
  border-radius: var(--radius-button);
}
.st-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}
.st-code-label {
  font-size: var(--font-size-sm);
  color: var(--color-primary-dark);
  opacity: 0.7;
}
.st-code-value {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: monospace;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
}
.slider-controls {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.slider-btn {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}
</style>
