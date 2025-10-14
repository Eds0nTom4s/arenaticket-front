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
    <CheckoutModal
      v-if="modalOpen"
      :evento="eventoSelecionado"
      @close="modalOpen = false"
      @confirmar="simularCompra"
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
import { ref } from 'vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import TicketCard from '../components/TicketCard.vue';
import CheckoutModal from '../components/CheckoutModal.vue';
import AtToast from '../components/AtToast.vue';
import AtLoader from '../components/AtLoader.vue';
import AtIcon from '../components/AtIcon.vue';

const eventos = ref([
  {
    id: 'evt-001',
    nome: 'GDSE vs Kabuscorp',
    data: '2025-10-18T16:00:00+01:00',
    bannerUrl: 'https://placehold.co/600x300/0066FF/FFFFFF?text=Evento+1',
    preco: 1500.0,
    status: 'disponivel',
  },
  {
    id: 'evt-002',
    nome: 'GDSE vs Petro de Luanda',
    data: '2025-10-28T16:00:00+01:00',
    bannerUrl: 'https://placehold.co/600x300/001B33/FFFFFF?text=Evento+2',
    preco: 3000.0,
    status: 'esgotado',
  },
  {
    id: 'evt-003',
    nome: 'GDSE vs 1º de Agosto',
    data: '2025-11-15T16:00:00+01:00',
    bannerUrl: 'https://placehold.co/600x300/2DD4BF/001B33?text=Evento+3',
    preco: 7000.0,
    status: 'ultimos',
  },
]);

const modalOpen = ref(false);
const eventoSelecionado = ref(null);
const loading = ref(false);
const toast = ref({ show: false, type: 'success', message: '' });

function abrirCheckout(evento) {
  eventoSelecionado.value = evento;
  modalOpen.value = true;
}
function simularCompra() {
  modalOpen.value = false;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    toast.value = { show: true, type: 'success', message: 'Compra simulada com sucesso' };
    setTimeout(() => (toast.value.show = false), 3500);
  }, 1800);
}
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
