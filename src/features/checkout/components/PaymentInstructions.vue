<template>
  <div class="payment-instructions">
    <!-- ✨ NOVO v1.2.0: Verificar se pagamento foi instantâneo (GPO PAID) -->
    <div v-if="isPaid" class="pi-instant-success">
      <div class="pi-success-animation">
        <AtIcon name="check-circle" class="pi-success-icon" />
      </div>
      <h3>🎉 Pagamento Confirmado Instantaneamente!</h3>
      <p>Seus bilhetes estão prontos abaixo.</p>
    </div>

    <!-- GPO - Multicaixa Express (PENDING) -->
    <div v-else-if="isGPO" class="pi-gpo">
      <div class="pi-header">
        <AtIcon name="mobile" class="pi-header-icon" />
        <h3>Pagamento via Multicaixa Express</h3>
      </div>

      <div class="pi-content">
        <p class="pi-message">
          Complete o pagamento no aplicativo Multicaixa Express
        </p>

        <div class="pi-qr-section">
          <div class="pi-qr-placeholder">
            <!-- QR Code seria gerado aqui -->
            <AtIcon name="qr-code" />
            <p>Escaneie no app Multicaixa</p>
          </div>
        </div>

        <div class="pi-reference">
          <label>ID do Pedido:</label>
          <div class="pi-reference-value">
            <strong>{{ pedido.clientRequestId }}</strong>
            <button
              type="button"
              class="pi-copy-btn"
              @click="copyToClipboard(pedido.clientRequestId)"
              :title="copied ? 'Copiado!' : 'Copiar'"
            >
              <AtIcon :name="copied ? 'check' : 'copy'" />
            </button>
          </div>
        </div>

        <div class="pi-amount">
          <label>Valor:</label>
          <strong>{{ formatKwanza(pedido.total) }}</strong>
        </div>
      </div>

      <div class="pi-status">
        <AtLoader size="sm" />
        <span>Aguardando confirmação no aplicativo...</span>
      </div>
    </div>

    <!-- REFERENCIA - ATM/Internet Banking -->
    <div v-else class="pi-referencia">
      <div class="pi-header">
        <AtIcon name="bank" class="pi-header-icon" />
        <h3>Pagamento por Referência Multicaixa</h3>
      </div>

      <div class="pi-content">
        <p class="pi-message">
          Efetue o pagamento em qualquer ATM Multicaixa ou Internet Banking
          usando os dados abaixo:
        </p>

        <div class="pi-details">
          <div class="pi-detail-item">
            <label>Entidade:</label>
            <div class="pi-detail-value">
              <strong class="pi-entity-value">{{ entidade }}</strong>
              <button
                type="button"
                class="pi-copy-btn"
                @click="copyToClipboard(entidade)"
                :title="copied ? 'Copiado!' : 'Copiar'"
              >
                <AtIcon :name="copied ? 'check' : 'copy'" />
              </button>
            </div>
          </div>

          <div class="pi-detail-item">
            <label>Referência:</label>
            <div class="pi-detail-value">
              <strong class="pi-ref-value">{{ referencia }}</strong>
              <button
                type="button"
                class="pi-copy-btn"
                @click="copyToClipboard(referencia)"
                :title="copied ? 'Copiado!' : 'Copiar'"
              >
                <AtIcon :name="copied ? 'check' : 'copy'" />
              </button>
            </div>
          </div>

          <div class="pi-detail-item">
            <label>Valor:</label>
            <strong class="pi-amount-value">
              {{ formatKwanza(pedido.total) }}
            </strong>
          </div>
        </div>

        <div class="pi-sms-note">
          <AtIcon name="message" />
          <p>
            Um SMS foi enviado para <strong>{{ formatTelefone(telefone) }}</strong>
            com estas informações.
          </p>
        </div>
      </div>

      <div class="pi-status">
        <AtLoader size="sm" />
        <span>Aguardando confirmação do pagamento...</span>
      </div>
    </div>

    <!-- Informações adicionais -->
    <div class="pi-footer">
      <AtIcon name="info" />
      <div>
        <p>
          <strong>Importante:</strong> Não feche esta página. Você será notificado
          automaticamente quando o pagamento for confirmado.
        </p>
        <p class="pi-support">
          Precisa de ajuda? Entre em contato: <strong>925 813 939</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AtIcon from '../../../components/AtIcon.vue';
import AtLoader from '../../../components/AtLoader.vue';
import { formatKwanza, formatTelefone } from '../utils/validators';
import type { PedidoBackendResponse } from '../types/pedido.types';

const props = defineProps<{
  pedido: PedidoBackendResponse;
  telefone: string;
  metodoPagamento?: 'GPO' | 'REFERENCIA';
  referenciaOverride?: string;
  entidadeOverride?: string;
}>();

const copied = ref(false);

// Computed para verificar status e método
const isPaid = computed(() => props.pedido.status === 'PAID');
const isGPO = computed(() => props.metodoPagamento === 'GPO');

// Dados de entidade e referência (com fallbacks)
const referencia = computed(() => {
  const r = props.referenciaOverride
    || (props.pedido as any)?.pagamento?.referencia
    || (props.pedido as any)?.referencia
    || '';
  return String(r || '');
});

const entidade = computed(() => {
  const e = props.entidadeOverride
    || (props.pedido as any)?.pagamento?.entidade
    || (props.pedido as any)?.entidade
    || '';
  return String(e);
});

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Erro ao copiar:', err);
  }
};
</script>

<style scoped>
.payment-instructions {
  padding: var(--spacing-4, 1.5rem);
}

.pi-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
  margin-bottom: var(--spacing-4, 1.5rem);
  padding-bottom: var(--spacing-3, 1rem);
  border-bottom: 2px solid var(--color-border, #e5e5e5);
}

.pi-header-icon {
  width: 32px;
  height: 32px;
  color: var(--color-primary, #1e40af);
}

.pi-header h3 {
  font-size: var(--font-size-lg, 1.25rem);
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary, #1a1a1a);
}

.pi-content {
  margin-bottom: var(--spacing-4, 1.5rem);
}

.pi-message {
  font-size: var(--font-size-base, 1rem);
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--spacing-4, 1.5rem);
  line-height: 1.5;
}

/* GPO específico */
.pi-instant-success {
  text-align: center;
  padding: var(--spacing-6, 2rem) var(--spacing-4, 1.5rem);
  background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%);
  border-radius: var(--radius-lg, 12px);
  border: 2px solid var(--color-success, #16a34a);
}

.pi-success-animation {
  margin-bottom: var(--spacing-3, 1rem);
}

.pi-success-icon {
  width: 80px;
  height: 80px;
  color: var(--color-success, #16a34a);
  animation: success-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes success-bounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pi-instant-success h3 {
  font-size: var(--font-size-xl, 1.5rem);
  font-weight: 700;
  color: var(--color-success-dark, #15803d);
  margin: 0 0 var(--spacing-2, 0.5rem) 0;
}

.pi-instant-success p {
  font-size: var(--font-size-base, 1rem);
  color: var(--color-text-secondary, #666);
  margin: 0;
}

.pi-qr-section {
  display: flex;
  justify-content: center;
  margin: var(--spacing-6, 2rem) 0;
}

.pi-qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-6, 2rem);
  border: 2px dashed var(--color-border, #e5e5e5);
  border-radius: var(--radius-md, 8px);
  background: var(--color-background, #f9fafb);
}

.pi-qr-placeholder svg {
  width: 150px;
  height: 150px;
  color: var(--color-text-tertiary, #999);
}

.pi-qr-placeholder p {
  margin: 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
}

.pi-reference,
.pi-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3, 1rem);
  background: var(--color-background, #f9fafb);
  border-radius: var(--radius-md, 8px);
  margin-bottom: var(--spacing-2, 0.5rem);
}

.pi-reference label,
.pi-amount label {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
}

.pi-reference-value {
  display: flex;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
}

.pi-reference strong,
.pi-amount strong {
  font-size: var(--font-size-lg, 1.25rem);
  color: var(--color-text-primary, #1a1a1a);
}

/* REFERENCIA específico */
.pi-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3, 1rem);
  margin-bottom: var(--spacing-4, 1.5rem);
}

.pi-detail-item {
  padding: var(--spacing-4, 1.5rem);
  background: var(--color-background, #f9fafb);
  border-radius: var(--radius-md, 8px);
  border-left: 4px solid var(--color-primary, #1e40af);
}

.pi-detail-item label {
  display: block;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--spacing-1, 0.25rem);
}

.pi-detail-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pi-detail-value strong {
  font-size: var(--font-size-xl, 1.5rem);
  color: var(--color-text-primary, #1a1a1a);
  font-family: monospace;
}

.pi-entity-value {
  font-size: var(--font-size-2xl, 2rem);
}

.pi-ref-value {
  font-size: var(--font-size-2xl, 2rem);
}

.pi-amount-value {
  font-size: var(--font-size-2xl, 2rem);
  color: var(--color-primary, #1e40af);
  font-weight: 700;
}

.pi-copy-btn {
  padding: var(--spacing-2, 0.5rem);
  background: white;
  border: 1px solid var(--color-border, #e5e5e5);
  border-radius: var(--radius-sm, 4px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pi-copy-btn:hover {
  background: var(--color-primary-light, #eff6ff);
  border-color: var(--color-primary, #1e40af);
}

.pi-sms-note {
  display: flex;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-3, 1rem);
  background: var(--color-success-light, #dcfce7);
  border-radius: var(--radius-md, 8px);
  border-left: 3px solid var(--color-success, #16a34a);
}

.pi-sms-note p {
  margin: 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-primary, #1a1a1a);
  line-height: 1.5;
}

.pi-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-3, 1rem);
  background: var(--color-info-light, #dbeafe);
  border-radius: var(--radius-md, 8px);
  margin-bottom: var(--spacing-4, 1.5rem);
}

.pi-status span {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-info-dark, #1e40af);
  font-weight: 500;
}

.pi-footer {
  display: flex;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-3, 1rem);
  background: var(--color-warning-light, #fef3c7);
  border-radius: var(--radius-md, 8px);
  border-left: 3px solid var(--color-warning, #f59e0b);
}

.pi-footer p {
  margin: 0 0 var(--spacing-2, 0.5rem) 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-primary, #1a1a1a);
  line-height: 1.5;
}

.pi-support {
  margin-top: var(--spacing-2, 0.5rem);
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
}

@media (max-width: 768px) {
  .payment-instructions {
    padding: var(--spacing-3, 1rem);
  }

  .pi-detail-value strong {
    font-size: var(--font-size-lg, 1.25rem);
  }

  .pi-amount-value {
    font-size: var(--font-size-xl, 1.5rem);
  }
}
</style>
