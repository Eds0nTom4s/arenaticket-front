<template>
  <AtModal :open="true" @close="$emit('close')">
    <template #title>
      Confirmação de Bilhete
    </template>
    <div class="qr-modal-content">
      <div class="qr-code">
        <img :src="qrCodeUrl" alt="QR Code" />
      </div>
      <div class="ticket-code">
        <span>Código do Bilhete:</span>
        <strong>{{ ticketCode }}</strong>
        <button @click="copyCode">Copiar</button>
      </div>
      <div class="share-options">
        <button @click="downloadQrCode">Baixar QR Code</button>
        <button @click="shareViaWhatsApp">Partilhar no WhatsApp</button>
        <button @click="shareViaSms">Partilhar por SMS</button>
      </div>
    </div>
  </AtModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AtModal from './AtModal.vue';

const props = defineProps({
  qrCodeUrl: { type: String, required: true },
  ticketCode: { type: String, required: true }
});
const emit = defineEmits(['close']);

function copyCode() {
  navigator.clipboard.writeText(props.ticketCode);
  alert('Código copiado!');
}

function downloadQrCode() {
  const link = document.createElement('a');
  link.href = props.qrCodeUrl;
  link.download = 'qrcode.png';
  link.click();
}

function shareViaWhatsApp() {
  const url = `https://wa.me/?text=Seu%20código%20de%20bilhete%20é%20${props.ticketCode}`;
  window.open(url, '_blank');
}

function shareViaSms() {
  const url = `sms:?body=Seu%20código%20de%20bilhete%20é%20${props.ticketCode}`;
  window.open(url, '_blank');
}
</script>

<style scoped>
.qr-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}
.qr-code img {
  max-width: 200px;
  max-height: 200px;
}
.ticket-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}
.share-options {
  display: flex;
  gap: var(--space-md);
}
</style>
