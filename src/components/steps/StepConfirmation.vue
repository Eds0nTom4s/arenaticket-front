<template>
  <div class="step-confirmation">
    <!-- Loading State -->
    <div v-if="loading" class="loading-confirmation">
      <AtLoader label="A processar o seu pedido..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-confirmation">
      <p>{{ error }}</p>
      <AtButton @click="$emit('retry')">Tentar Novamente</AtButton>
    </div>

    <!-- Success State (Etapa 3) -->
    <div v-else-if="bilhetes.length > 0" class="confirmation-success">
    
      <!-- Ticket slider with infinite looping -->
      <TicketSlider :tickets="bilhetes" :infinite="true" />
      <div class="st-content">
        <div class="st-actions">
          <AtButton variant="secondary" size="sm" @click="downloadBilhete">
            <AtIcon size="sm">⬇️</AtIcon> Download
          </AtButton>
          <AtButton variant="secondary" size="sm" @click="compartilharWhatsapp">
            <AtIcon size="sm">📱</AtIcon> WhatsApp
          </AtButton>
          <AtButton variant="secondary" size="sm" @click="compartilharSMS">
            <AtIcon size="sm">✉️</AtIcon> SMS
          </AtButton>
        </div>
  
      </div>
      <AtButton variant="primary" @click="$emit('close')">Comprar outro bilhete</AtButton>
    </div>

    <!-- Summary State (Etapa 4) -->
    <div v-else class="summary-view">
      <h4 class="summary-title">Resumo do Pedido</h4>
      <div class="summary-details">
        <div class="summary-item">
          <span class="summary-label">Lote:</span>
          <span class="summary-value">{{ summary.loteNome }}</span>
        </div>
        <!-- Novas informações do evento -->
        <div class="summary-item">
          <span class="summary-label">Evento:</span>
          <span class="summary-value">{{ summary.eventoNome }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Data do Evento:</span>
          <span class="summary-value">{{ formatDate(summary.dataEvento) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Quantidade:</span>
          <span class="summary-value">{{ summary.quantidade }} bilhetes</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Total:</span>
          <span class="summary-value summary-total">{{ formatPrice(summary.total) }}</span>
        </div>
        <hr class="summary-divider" />
        <div class="summary-item">
          <span class="summary-label">Nome:</span>
          <span class="summary-value">{{ summary.nome }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Telefone:</span>
          <span class="summary-value">{{ summary.telefone }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Pagamento:</span>
          <span class="summary-value">{{ summary.metodoPagamento }}</span>
        </div>
      </div>
      <p class="summary-footer">Confirme os dados antes de finalizar a compra.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AtLoader from '../AtLoader.vue';
import AtButton from '../AtButton.vue';
import AtIcon from '../AtIcon.vue';
import TicketSlider from '../TicketSlider.vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  bilhetes: { type: Array, default: () => [] },
  summary: { type: Object, required: true }
});

function formatPrice(price: number) {
  if (isNaN(price)) return 'Kz 0,00';
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(price).replace('AOA', 'Kz');
}

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

function copiarCodigo() {
  if (props.bilhetes.length === 0) return;
  navigator.clipboard.writeText(props.bilhetes[0].codigo);
  // TODO: show toast
}

function downloadBilhete() {
  // TODO: Implement download
}

function compartilharWhatsapp() {
  if (!props.bilhete?.codigo) return;
  const texto = `Meu bilhete: ${props.bilhete.codigo}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
}

function compartilharSMS() {
  if (!props.bilhete?.codigo) return;
  const texto = `Meu bilhete: ${props.bilhete.codigo}`;
  window.open(`sms:?&body=${encodeURIComponent(texto)}`, '_blank');
}

defineEmits(['retry', 'close', 'back']);
</script>

<style scoped>
.step-confirmation {
  padding: var(--space-lg) 0;
}
.loading-confirmation, .error-confirmation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: var(--space-md);
}
.confirmation-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}
.summary-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  /* Ajuste para evitar scroll vertical */
  max-height: 100%;
}
.summary-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary-dark);
  text-align: center;
}
.summary-details {
  background: var(--color-neutral-200);
  padding: var(--space-xs) var(--space-md); /* Redução do padding para caber no container */
  border-radius: var(--radius-card);
}
.summary-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-xxs) 0;
  font-size: var(--font-size-sm);
}
.summary-label {
  color: var(--color-primary-dark);
  opacity: 0.8;
}
.summary-value {
  font-weight: 500;
  color: var(--color-primary-dark);
}
.summary-total {
  font-weight: 700;
  color: var(--color-primary);
  font-size: var(--font-size-md);
}
.summary-divider {
  border: none;
  border-top: 1px solid var(--color-neutral-300);
  margin: var(--space-xs) 0; /* Redução da margem para caber melhor */
}
.summary-footer {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-primary-dark);
  opacity: 0.7;
}
.st-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-success);
  font-size: var(--font-size-lg);
  font-weight: 600;
}
.st-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}
.st-actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  justify-content: center;
}
</style>
