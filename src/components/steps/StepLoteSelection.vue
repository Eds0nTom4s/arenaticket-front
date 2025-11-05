<template>
  <div class="step-lote-selection">
    <AtLoader v-if="loading" label="A carregar lotes..." />
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <AtButton @click="fetchLotes">Tentar Novamente</AtButton>
    </div>
    <div v-else-if="lotes.length === 0" class="no-lotes">
      <p>Nenhum lote disponível para este evento no momento.</p>
    </div>
    <div v-else class="lote-list">
      <div
        v-for="lote in lotes"
        :key="lote.id"
        class="lote-item"
        :class="{ 'lote-item--selected': lote.id === selectedLoteId }"
        @click="selectLote(lote.id)"
        role="radio"
        :aria-checked="lote.id === selectedLoteId"
        tabindex="0"
        @keydown.space.prevent="selectLote(lote.id)"
      >
        <div class="lote-info">
          <span class="lote-name">{{ lote.nome }}</span>
          <span class="lote-price">{{ formatPrice(lote.preco) }}</span>
        </div>
        <div class="lote-details">
          <span>Disponíveis: {{ lote.quantidadeDisponivel }}</span>
          <span>Vendas até: {{ formatDate(lote.fimVenda) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import AtLoader from '../AtLoader.vue';
import AtButton from '../AtButton.vue';
import { fetchEventoDetalhes } from '../../services/api';

const props = defineProps({
  eventoId: { type: String, required: true },
  modelValue: { type: String, default: null }
});

const emit = defineEmits(['update:modelValue', 'lotes-loaded']);

const lotes = ref([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedLoteId = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  selectedLoteId.value = newValue;
});

async function fetchLotes() {
  loading.value = true;
  error.value = null;
  try {
    const evento = await fetchEventoDetalhes(props.eventoId);
    const now = new Date();
    lotes.value = evento.lotes.filter(lote => {
      const inicioVenda = new Date(lote.inicioVenda);
      const fimVenda = new Date(lote.fimVenda);
      return lote.quantidadeDisponivel > 0 && inicioVenda <= now && fimVenda >= now;
    });
    emit('lotes-loaded', lotes.value);
  } catch (e) {
    error.value = 'Não foi possível carregar os lotes. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
}

function selectLote(loteId: string) {
  selectedLoteId.value = loteId;
  emit('update:modelValue', loteId);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(price).replace('AOA', 'Kz');
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

onMounted(fetchLotes);
</script>

<style scoped>
.lote-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.lote-item {
  padding: var(--space-md);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: all var(--transition);
}
.lote-item:hover {
  border-color: var(--color-primary-light);
}
.lote-item--selected {
  border-color: var(--color-primary);
  box-shadow: var(--animation-glow);
}
.lote-info {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}
.lote-price {
  color: var(--color-primary);
}
.lote-details {
  font-size: var(--font-size-sm);
  color: var(--color-primary-dark);
  opacity: 0.8;
  margin-top: var(--space-xs);
}
.error-message, .no-lotes {
  text-align: center;
  padding: var(--space-lg);
}
</style>
