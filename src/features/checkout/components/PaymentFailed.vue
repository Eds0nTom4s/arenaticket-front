<template>
  <div class="payment-failed">
    <div class="pf-icon">
      <AtIcon name="x-circle" />
    </div>
    <h3>Erro ao processar o pagamento</h3>
    <p class="pf-message">{{ mensagemExibida }}</p>

    <div class="pf-actions">
      <AtButton :disabled="loading" variant="primary" @click="$emit('retry')">
        <AtLoader v-if="loading" size="sm" />
        <span v-else>Tentar Novamente</span>
      </AtButton>
      <AtButton v-if="showSwitchOption" :disabled="loading" variant="secondary" @click="$emit('switch')">
        Usar Referência ATM
      </AtButton>
    </div>

    <!-- 📞 Informações de contato do suporte -->
    <div class="pf-support">
      <p class="pf-support-text">Precisa de ajuda?</p>
      <a href="tel:+244925813939" class="pf-support-link">
        <AtIcon name="phone" />
        <span>925 813 939</span>
      </a>
    </div>

    <p v-if="referencia" class="pf-ref">Ref.: <strong>{{ referencia }}</strong></p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AtIcon from '../../../components/AtIcon.vue';
import AtButton from '../../../components/AtButton.vue';
import AtLoader from '../../../components/AtLoader.vue';

const props = defineProps<{
  mensagem?: string;
  referencia?: string;
  loading?: boolean;
  showSwitchOption?: boolean; // Mostrar opção de trocar para REFERENCIA
}>();

const mensagemExibida = computed(() => {
  // Mensagem padrão conforme INSTRUCOES_FRONTEND_TRATAMENTO_ERROS.txt
  // SEMPRE exibir mensagem padronizada, não a mensagem técnica do backend
  return 'Erro ao processar o pagamento. Tente novamente.';
});
</script>

<style scoped>
.payment-failed {
  text-align: center;
  padding: var(--spacing-6, 2rem);
  background: var(--color-error-light, #fee2e2);
  border-radius: var(--radius-lg, 12px);
  border: 2px solid var(--color-error, #dc2626);
}

.pf-icon svg {
  width: 72px;
  height: 72px;
  color: var(--color-error, #dc2626);
}

h3 {
  margin: 0.5rem 0 0.25rem;
}

.pf-message {
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.pf-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.pf-support {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border, #e5e5e5);
  text-align: center;
}

.pf-support-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.pf-support-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s;
}

.pf-support-link:hover {
  color: var(--color-primary-dark, #2563eb);
  text-decoration: underline;
}

.pf-support-link svg {
  width: 18px;
  height: 18px;
}

.pf-ref {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
