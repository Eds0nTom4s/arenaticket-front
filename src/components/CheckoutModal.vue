<template>
  <AtModal :open="true" @close="$emit('close')">
    <template #title>
      {{ evento?.nome || 'Evento' }}
    </template>
    <div class="cm-content">
      <AtQuantitySelector v-model="quantidade" :min="1" :max="10" />
      <AtInput id="nome" label="Nome completo" v-model="nome" placeholder="Seu nome" />
      <AtInput id="telefone" label="Telefone" v-model="telefone" placeholder="9XXXXXXXX" />
      <div class="cm-pay">
        <span>Método de pagamento:</span>
        <AtButton variant="secondary" size="sm" :aria-label="'Selecionar Multicaixa Express'" :class="{selected: metodo==='gpo'}" @click="metodo='gpo'">Multicaixa Express</AtButton>
        <AtButton variant="secondary" size="sm" :aria-label="'Selecionar Referência'" :class="{selected: metodo==='ref'}" @click="metodo='ref'">Referência</AtButton>
      </div>
    </div>
    <template #footer>
      <AtButton variant="primary" size="md" @click="confirmar" :disabled="!nome || !telefone">Confirmar Compra</AtButton>
    </template>
  </AtModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AtModal from './AtModal.vue';
import AtButton from './AtButton.vue';
import AtInput from './AtInput.vue';
import AtQuantitySelector from './AtQuantitySelector.vue';
const props = defineProps({ evento: { type: Object, required: true } });
const emit = defineEmits(['close', 'confirmar']);
const quantidade = ref(1);
const nome = ref('');
const telefone = ref('');
const metodo = ref('gpo');
function confirmar() {
  emit('confirmar', { quantidade: quantidade.value, nome: nome.value, telefone: telefone.value, metodo: metodo.value });
}
</script>

<style scoped>
.cm-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}
.cm-pay {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-top: var(--space-md);
}
.selected {
  box-shadow: var(--animation-glow);
  border: 2px solid var(--color-primary);
}
</style>
