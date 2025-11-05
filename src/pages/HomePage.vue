<template>
  <BaseLayout>
    <h1 class="at-home-title">Bilhetes Disponíveis</h1>
    <div class="at-home-grid">
      <TicketCard
        v-for="evento in eventos"
        :key="evento.id"
        :evento="evento"
        @comprar="abrirCheckout(evento)"
      />
    </div>
    <CheckoutWizard
      v-if="modalOpen"
      :evento="eventoSelecionado"
      @close="modalOpen = false"
      @confirm="simularCompra"
    />
    <AtToast v-if="toast.show" :type="toast.type">
      <template #icon>
        <AtIcon :size="'md'">
          <span v-if="toast.type === 'success'">✔️</span>
          <span v-else-if="toast.type === 'error'">❌</span>
        </AtIcon>
      </template>
      {{ toast.message }}
    </AtToast>
    <AtLoader v-if="loading" label="Processando pagamento..." />
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import TicketCard from '../components/TicketCard.vue';
import CheckoutWizard from '../components/CheckoutWizard.vue';
import AtToast from '../components/AtToast.vue';
import AtLoader from '../components/AtLoader.vue';
import AtIcon from '../components/AtIcon.vue';
import { fetchEventos } from '../services/api';

const eventos = ref([]);
const modalOpen = ref(false);
const eventoSelecionado = ref(null);
const loading = ref(true); // Inicia como true para mostrar o loader
const toast = ref({ show: false, type: 'success', message: '' });

function abrirCheckout(evento) {
  eventoSelecionado.value = evento;
  modalOpen.value = true;
}

function simularCompra() {
  // Esta função será refatorada quando integrarmos o checkout
  modalOpen.value = false;
}

onMounted(async () => {
  try {
    const data = await fetchEventos();
    eventos.value = data.map(evento => ({
      id: evento.id,
      nome: evento.titulo,
      data: evento.dataInicio,
      bannerUrl: evento.bannerUrl || `https://placehold.co/600x300/001B33/FFFFFF?text=${encodeURIComponent(evento.titulo)}`,
      status: evento.abertoParaVenda ? 'disponivel' : 'esgotado',
    }));
  } catch (error) {
    toast.value = { show: true, type: 'error', message: 'Não foi possível carregar os eventos.' };
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.at-home-title {
  font-family: 'Poppins', sans-serif;
  font-size: var(--font-size-xxl);
  color: var(--color-primary-dark);
  margin-bottom: var(--space-lg);
  text-align: center;
}
.at-home-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .at-home-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .at-home-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
