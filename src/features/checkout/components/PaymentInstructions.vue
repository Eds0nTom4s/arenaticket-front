<template>
  <div class="payment-instructions">
    <!-- GPO - Multicaixa Express -->
    <div v-if="pedido.pedido.pagamento.metodoPagamento === 'GPO'" class="pi-gpo">
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
          <label>Referência:</label>
          <div class="pi-reference-value">
            <strong>{{ pedido.pedido.pagamento.referencia }}</strong>
            <button
              type="button"
              class="pi-copy-btn"
              @click="copyToClipboard(pedido.pedido.pagamento.referencia)"
              :title="copied ? 'Copiado!' : 'Copiar'"
            >
              <AtIcon :name="copied ? 'check' : 'copy'" />
            </button>
          </div>
        </div>

        <div class="pi-amount">
          <label>Valor:</label>
          <strong>{{ formatKwanza(pedido.pedido.valorTotal) }}</strong>
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
        <h3>Instruções de Pagamento</h3>
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
              <strong>{{ pedido.pedido.pagamento.entidade }}</strong>
              <button
                type="button"
                class="pi-copy-btn"
                @click="copyToClipboard(pedido.pedido.pagamento.entidade || '')"
                :title="copiedEntity ? 'Copiado!' : 'Copiar'"
              >
                <AtIcon :name="copiedEntity ? 'check' : 'copy'" />
              </button>
            </div>
          </div>

          <div class="pi-detail-item">
            <label>Referência:</label>
            <div class="pi-detail-value">
              <strong>{{ pedido.pedido.pagamento.referencia }}</strong>
              <button
                type="button"
                class="pi-copy-btn"
                @click="copyToClipboard(pedido.pedido.pagamento.referencia)"
                :title="copied ? 'Copiado!' : 'Copiar'"
              >
                <AtIcon :name="copied ? 'check' : 'copy'" />
              </button>
            </div>
          </div>

          <div class="pi-detail-item">
            <label>Valor:</label>
            <strong class="pi-amount-value">
              {{ formatKwanza(pedido.pedido.valorTotal) }}
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
import { ref } from 'vue';
import AtIcon from '../../../components/AtIcon.vue';
import AtLoader from '../../../components/AtLoader.vue';
import type { CheckoutResponse } from '../types/checkout.types';
import { formatKwanza, formatTelefone } from '../utils/validators';

const props = defineProps<{
  pedido: CheckoutResponse;
  telefone: string;
}>();

const copied = ref(false);
const copiedEntity = ref(false);

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    
    if (text === props.pedido.pedido.pagamento.entidade) {
      copiedEntity.value = true;
      setTimeout(() => {
        copiedEntity.value = false;
      }, 2000);
    } else {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    }
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
