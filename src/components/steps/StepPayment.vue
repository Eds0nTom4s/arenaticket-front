<template>
  <div class="step-payment">
    <AtInput
      id="nome"
      label="Nome completo"
      :model-value="modelValue.nome"
      @update:modelValue="update('nome', $event)"
      placeholder="Seu nome completo"
      required
    />
    <AtInput
      id="telefone"
      label="Telefone"
      :model-value="modelValue.telefone"
      @update:modelValue="update('telefone', $event)"
      placeholder="9XXXXXXXX"
      type="tel"
      required
    />
    <div class="payment-methods">
      <span>Método de pagamento:</span>
      <div class="payment-buttons">
        <AtButton
          variant="secondary"
          size="sm"
          :class="{ selected: modelValue.metodo === 'GPO' }"
          @click="update('metodo', 'GPO')"
        >
          Multicaixa Express
        </AtButton>
        <AtButton
          variant="secondary"
          size="sm"
          :class="{ selected: modelValue.metodo === 'REFERENCIA' }"
          @click="update('metodo', 'REFERENCIA')"
        >
          Referência ATM
        </AtButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AtInput from '../AtInput.vue';
import AtButton from '../AtButton.vue';

const props = defineProps({
  modelValue: {
    type: Object as () => { nome: string; telefone: string; metodo: string },
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

function update(field: string, value: string) {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
}
</script>

<style scoped>
.step-payment {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.payment-buttons {
  display: flex;
  gap: var(--space-md);
}
.selected {
  box-shadow: var(--animation-glow);
  border: 2px solid var(--color-primary);
}
</style>
