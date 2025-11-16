<template>
  <div class="ticket-display">
    <div class="td-header">
      <div class="td-success-icon">
        <AtIcon><span>✔️</span></AtIcon>
      </div>
      <h2>✅ Pagamento Confirmado!</h2>
      <p>Seus bilhetes foram gerados com sucesso</p>
    </div>

    <div v-if="bilhetes.length > 1" class="td-carousel">
      <div class="td-carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div
          v-for="(bilhete, index) in bilhetes"
          :key="bilhete.id"
          class="td-ticket-card td-slide"
        >
          <div class="td-ticket-header">
            <div>
              <h3>{{ displayTitulo(bilhete) }}</h3>
              <span class="td-lote">{{ bilhete.lote?.nome || 'Lote' }}</span>
            </div>
            <AtBadge variant="success">Bilhete #{{ index + 1 }}</AtBadge>
          </div>

          <div class="td-ticket-qr">
            <template v-if="bilhete.codigoQR">
              <img :src="bilhete.codigoQR" :alt="`QR Code - ${bilhete.codigoTicket}`" />
            </template>
            <template v-else>
              <div class="td-qr-skeleton">QR não disponível</div>
            </template>
          </div>

          <div class="td-ticket-code">
            <label>Código do Bilhete:</label>
            <div class="td-code-value">
              <strong>{{ formatCodigoBilhete(bilhete.codigoTicket) }}</strong>
              <button
                type="button"
                class="td-copy-btn"
                @click="copyCode(bilhete.codigoTicket)"
                :title="copiedCodes[bilhete.id] ? 'Copiado!' : 'Copiar'"
              >
                <AtIcon><span>{{ copiedCodes[bilhete.id] ? '✔️' : '📋' }}</span></AtIcon>
              </button>
            </div>
          </div>

          <div class="td-ticket-details">
            <div class="td-detail-row">
              <AtIcon><span>👤</span></AtIcon>
              <span>{{ bilhete.compradorNome }}</span>
            </div>
            <div class="td-detail-row">
              <AtIcon><span>📅</span></AtIcon>
              <span>{{ displayData(bilhete) }}</span>
            </div>
            <div class="td-detail-row">
              <AtIcon><span>📍</span></AtIcon>
              <span>{{ displayLocal(bilhete) }}</span>
            </div>
            <div class="td-detail-row">
              <AtIcon><span>🎟️</span></AtIcon>
              <span>{{ bilhete.lote?.nome || 'Lote' }}</span>
            </div>
          </div>

          <div class="td-ticket-actions">
            <AtButton
              variant="secondary"
              size="sm"
              @click="downloadTicket(bilhete)"
            >
              <AtIcon><span>⬇️</span></AtIcon>
              Baixar
            </AtButton>
            <AtButton
              variant="primary"
              size="sm"
              @click="shareWhatsApp(bilhete)"
            >
              <AtIcon><span>📤</span></AtIcon>
              WhatsApp
            </AtButton>
          </div>
        </div>
      </div>
      <div class="td-carousel-controls" aria-hidden="false">
        <button class="td-carousel-btn prev" @click="prev" aria-label="Bilhete anterior">‹</button>
        <button class="td-carousel-btn next" @click="next" aria-label="Próximo bilhete">›</button>
      </div>
    </div>

    <div v-else class="td-tickets-grid">
      <div
        v-for="(bilhete, index) in bilhetes"
        :key="bilhete.id"
        class="td-ticket-card"
      >
        <div class="td-ticket-header">
          <div>
            <h3>{{ displayTitulo(bilhete) }}</h3>
            <span class="td-lote">{{ bilhete.lote?.nome || 'Lote' }}</span>
          </div>
          <AtBadge variant="success">Bilhete #{{ index + 1 }}</AtBadge>
        </div>

        <div class="td-ticket-qr">
          <template v-if="bilhete.codigoQR">
            <img :src="bilhete.codigoQR" :alt="`QR Code - ${bilhete.codigoTicket}`" />
          </template>
          <template v-else>
            <div class="td-qr-skeleton">QR não disponível</div>
          </template>
        </div>

        <div class="td-ticket-code">
          <label>Código do Bilhete:</label>
          <div class="td-code-value">
            <strong>{{ formatCodigoBilhete(bilhete.codigoTicket) }}</strong>
            <button
              type="button"
              class="td-copy-btn"
              @click="copyCode(bilhete.codigoTicket)"
              :title="copiedCodes[bilhete.id] ? 'Copiado!' : 'Copiar'"
            >
              <AtIcon><span>{{ copiedCodes[bilhete.id] ? '✔️' : '📋' }}</span></AtIcon>
            </button>
          </div>
        </div>

        <div class="td-ticket-details">
          <div class="td-detail-row">
            <AtIcon><span>👤</span></AtIcon>
            <span>{{ bilhete.compradorNome }}</span>
          </div>
          <div class="td-detail-row">
            <AtIcon><span>📅</span></AtIcon>
            <span>{{ displayData(bilhete) }}</span>
          </div>
          <div class="td-detail-row">
            <AtIcon><span>📍</span></AtIcon>
            <span>{{ displayLocal(bilhete) }}</span>
          </div>
          <div class="td-detail-row">
            <AtIcon><span>🎟️</span></AtIcon>
            <span>{{ bilhete.lote?.nome || 'Lote' }}</span>
          </div>
        </div>

        <div class="td-ticket-actions">
          <AtButton
            variant="secondary"
            size="sm"
            @click="downloadTicket(bilhete)"
          >
            <AtIcon><span>⬇️</span></AtIcon>
            Baixar
          </AtButton>
          <AtButton
            variant="primary"
            size="sm"
            @click="shareWhatsApp(bilhete)"
          >
            <AtIcon><span>📤</span></AtIcon>
            WhatsApp
          </AtButton>
        </div>
      </div>
    </div>

    <div class="td-sms-confirmation">
  <AtIcon><span>💬</span></AtIcon>
      <p>
        📱 Os códigos dos bilhetes também foram enviados via SMS para o número registrado.
        Mostre os códigos ou QR codes na entrada do evento.
      </p>
    </div>

    <div class="td-footer">
      <div class="td-important">
  <AtIcon><span>ℹ️</span></AtIcon>
        <div>
          <h4>Informações Importantes:</h4>
          <ul>
            <li>Guarde bem os códigos dos seus bilhetes</li>
            <li>Apresente o QR code ou código na entrada do evento</li>
            <li>Cada bilhete é válido para uma única pessoa</li>
            <li>Chegue com antecedência para evitar filas</li>
          </ul>
        </div>
      </div>

      <div class="td-support">
        <p>
          Precisa de ajuda? Entre em contato: <strong>925 813 939</strong>
        </p>
        <p class="td-thank-you">
          Obrigado por apoiar o <strong>Grémio Desportivo Sagrada Esperança</strong>!
        </p>
      </div>

      <AtButton variant="primary" @click="$emit('close')" fullWidth>
        Fechar
      </AtButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import AtIcon from '../../../components/AtIcon.vue';
import AtButton from '../../../components/AtButton.vue';
import AtBadge from '../../../components/AtBadge.vue';
import type { Bilhete } from '../types/checkout.types';
import {
  formatCodigoBilhete,
  formatDataEvento,
} from '../utils/validators';
import { fetchEventoDetalhes } from '../../../services/api';
// Removido TicketSlider; carrossel nativo inline

const props = defineProps<{
  bilhetes: Bilhete[];
}>();

const emit = defineEmits<{
  close: [];
}>();

const copiedCodes = reactive<Record<string, boolean>>({});
const eventDetails = reactive<Record<string, any>>({});

const ensureEventDetails = async () => {
  const missingIds = Array.from(new Set(
    props.bilhetes
      .map(b => b.evento?.id)
      .filter((id): id is string => !!id)
      .filter(id => !eventDetails[id])
  ));
  if (missingIds.length === 0) return;

  await Promise.all(missingIds.map(async (id) => {
    try {
      const data = await fetchEventoDetalhes(id);
      eventDetails[id] = data;
    } catch (e) {
      console.warn('Falha ao obter detalhes do evento', id, e);
    }
  }));
};

onMounted(ensureEventDetails);
watch(() => props.bilhetes, ensureEventDetails, { deep: true });

const displayTitulo = (b: Bilhete) => b.evento?.titulo || (b.evento?.id && eventDetails[b.evento.id]?.titulo) || 'Evento';
const displayLocal = (b: Bilhete) => b.evento?.local || (b.evento?.id && eventDetails[b.evento.id]?.local) || '';
const rawEventDate = (b: Bilhete) => b.evento?.dataEvento || (b.evento?.id && eventDetails[b.evento.id]?.dataEvento) || '';
const displayData = (b: Bilhete) => formatDataEvento(rawEventDate(b));

// Controle do carrossel inline
const currentIndex = ref(0);
const next = () => {
  if (props.bilhetes.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % props.bilhetes.length;
};
const prev = () => {
  if (props.bilhetes.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + props.bilhetes.length) % props.bilhetes.length;
};
watch(() => props.bilhetes.length, () => { currentIndex.value = 0; });

const copyCode = async (codigo: string) => {
  try {
    await navigator.clipboard.writeText(codigo);
    
    // Encontrar bilhete pelo código
    const bilhete = props.bilhetes.find(b => b.codigoTicket === codigo);
    if (bilhete) {
      copiedCodes[bilhete.id] = true;
      setTimeout(() => {
        copiedCodes[bilhete.id] = false;
      }, 2000);
    }
  } catch (err) {
    console.error('Erro ao copiar código:', err);
  }
};

const downloadTicket = (bilhete: Bilhete) => {
  // Criar canvas para gerar imagem do bilhete
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;

  // Configurar tamanho (formato A6 landscape)
  canvas.width = 800;
  canvas.height = 600;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Borda
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Título
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GDSE - Bilhete de Entrada', canvas.width / 2, 60);

  // Evento
  ctx.font = '24px Arial';
  ctx.fillText(bilhete.evento?.titulo || 'Evento', canvas.width / 2, 100);

  // Detalhes
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Local: ${bilhete.evento?.local || ''}`, 50, 150);
  ctx.fillText(`Data: ${formatDataEvento(bilhete.evento?.dataEvento || '')}`, 50, 180);
  ctx.fillText(`Lote: ${bilhete.lote?.nome || ''}`, 50, 210);
  ctx.fillText(`Comprador: ${bilhete.compradorNome}`, 50, 240);

  // Código
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Código: ${bilhete.codigoTicket}`, canvas.width / 2, 300);

  // Função para finalizar e baixar
  const finalizar = () => {
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Juntos Pela Vitória', canvas.width / 2, canvas.height - 30);
    downloadCanvas(canvas, `bilhete-${bilhete.codigoTicket}.png`);
  };

  if (bilhete.codigoQR) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, canvas.width / 2 - 100, 330, 200, 200);
      finalizar();
    };
    img.onerror = () => {
      console.warn('Falha ao carregar QR; baixando sem imagem.');
      finalizar();
    };
    img.src = bilhete.codigoQR;
  } else {
    finalizar();
  }
};

const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
  canvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  });
};

const shareWhatsApp = (bilhete: Bilhete) => {
  const eventoTitulo = bilhete.evento?.titulo || 'Evento';
  const msg = `Bilhete confirmado!\nEvento: ${eventoTitulo}\nCódigo: ${bilhete.codigoTicket}\nApresente o QR na entrada.`;
  const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};
</script>

<style scoped>
.ticket-display {
  padding: var(--spacing-4, 1.5rem);
  max-width: 1200px;
  margin: 0 auto;
}

.td-header {
  text-align: center;
  margin-bottom: var(--spacing-6, 2rem);
  padding-bottom: var(--spacing-4, 1.5rem);
  border-bottom: 2px solid var(--color-border, #e5e5e5);
}

.td-success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-3, 1rem);
  color: var(--color-success, #16a34a);
}

.td-header h2 {
  font-size: var(--font-size-2xl, 2rem);
  font-weight: 700;
  margin: 0 0 var(--spacing-2, 0.5rem) 0;
  color: var(--color-text-primary, #1a1a1a);
}

.td-header p {
  font-size: var(--font-size-base, 1rem);
  color: var(--color-text-secondary, #666);
  margin: 0;
}

.td-tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-4, 1.5rem);
  margin-bottom: var(--spacing-6, 2rem);
}

/* Carrossel inline */
.td-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: var(--spacing-6, 2rem);
}
.td-carousel-track {
  display: flex;
  transition: transform 0.3s ease-in-out;
  width: 100%;
}
.td-slide {
  flex: 0 0 100%;
  width: 100%;
}
.td-carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none;
}
.td-carousel-btn {
  pointer-events: auto;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
}

.td-ticket-card {
  background: white;
  border: 2px solid var(--color-border, #e5e5e5);
  border-radius: var(--radius-lg, 12px);
  padding: var(--spacing-4, 1.5rem);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.td-ticket-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.td-ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4, 1.5rem);
  padding-bottom: var(--spacing-3, 1rem);
  border-bottom: 1px solid var(--color-border, #e5e5e5);
}

.td-ticket-header h3 {
  font-size: var(--font-size-lg, 1.25rem);
  font-weight: 600;
  margin: 0 0 var(--spacing-1, 0.25rem) 0;
  color: var(--color-text-primary, #1a1a1a);
}

.td-lote {
  display: inline-block;
  padding: 2px 8px;
  font-size: var(--font-size-xs, 0.75rem);
  background: var(--color-primary-light, #eff6ff);
  color: var(--color-primary, #1e40af);
  border-radius: var(--radius-sm, 4px);
  font-weight: 500;
}

.td-ticket-qr {
  display: flex;
  justify-content: center;
  padding: var(--spacing-4, 1.5rem);
  background: var(--color-background, #f9fafb);
  border-radius: var(--radius-md, 8px);
  margin-bottom: var(--spacing-4, 1.5rem);
}

.td-ticket-qr img {
  width: 200px;
  height: 200px;
  border: 2px solid var(--color-border, #e5e5e5);
  border-radius: var(--radius-sm, 4px);
}

.td-ticket-code {
  margin-bottom: var(--spacing-4, 1.5rem);
}

.td-ticket-code label {
  display: block;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--spacing-1, 0.25rem);
}

.td-code-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3, 1rem);
  background: var(--color-background, #f9fafb);
  border: 1px solid var(--color-border, #e5e5e5);
  border-radius: var(--radius-md, 8px);
}

.td-code-value strong {
  font-size: var(--font-size-lg, 1.25rem);
  font-family: monospace;
  color: var(--color-text-primary, #1a1a1a);
}

.td-copy-btn {
  padding: var(--spacing-2, 0.5rem);
  background: white;
  border: 1px solid var(--color-border, #e5e5e5);
  border-radius: var(--radius-sm, 4px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.td-copy-btn:hover {
  background: var(--color-primary-light, #eff6ff);
  border-color: var(--color-primary, #1e40af);
}

.td-ticket-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2, 0.5rem);
  margin-bottom: var(--spacing-4, 1.5rem);
}

.td-ticket-actions {
  display: flex;
  gap: var(--spacing-2, 0.5rem);
  justify-content: flex-end;
  margin-top: var(--spacing-2, 0.5rem);
}

.td-ticket-actions > * {
  flex: 0 0 auto;
}

.td-qr-skeleton {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6 10px,#e5e7eb 10px,#e5e7eb 20px);
  border: 2px dashed var(--color-border, #e5e5e5);
  border-radius: var(--radius-sm, 4px);
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
}

.td-detail-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
}

.td-detail-row svg {
  width: 16px;
  height: 16px;
  color: var(--color-primary, #1e40af);
}

.td-sms-confirmation {
  display: flex;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-4, 1.5rem);
  background: var(--color-success-light, #dcfce7);
  border-radius: var(--radius-md, 8px);
  border-left: 3px solid var(--color-success, #16a34a);
  margin-bottom: var(--spacing-4, 1.5rem);
}

.td-sms-confirmation p {
  margin: 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-primary, #1a1a1a);
  line-height: 1.5;
}

.td-footer {
  margin-top: var(--spacing-6, 2rem);
}

.td-important {
  display: flex;
  gap: var(--spacing-3, 1rem);
  padding: var(--spacing-4, 1.5rem);
  background: var(--color-info-light, #dbeafe);
  border-radius: var(--radius-md, 8px);
  border-left: 3px solid var(--color-info, #3b82f6);
  margin-bottom: var(--spacing-4, 1.5rem);
}

.td-important h4 {
  font-size: var(--font-size-base, 1rem);
  font-weight: 600;
  margin: 0 0 var(--spacing-2, 0.5rem) 0;
  color: var(--color-text-primary, #1a1a1a);
}

.td-important ul {
  margin: 0;
  padding-left: var(--spacing-4, 1.5rem);
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
}

.td-important li {
  margin-bottom: var(--spacing-1, 0.25rem);
}

.td-support {
  text-align: center;
  margin-bottom: var(--spacing-4, 1.5rem);
}

.td-support p {
  margin: 0 0 var(--spacing-2, 0.5rem) 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
}

.td-thank-you {
  font-size: var(--font-size-base, 1rem);
  color: var(--color-primary, #1e40af);
  font-weight: 500;
}

@media (max-width: 768px) {
  .ticket-display {
    padding: var(--spacing-3, 1rem);
  }

  .td-tickets-grid {
    grid-template-columns: 1fr;
  }

  .td-header h2 {
    font-size: var(--font-size-xl, 1.5rem);
  }

  .td-ticket-qr img {
    width: 150px;
    height: 150px;
  }
}
</style>
