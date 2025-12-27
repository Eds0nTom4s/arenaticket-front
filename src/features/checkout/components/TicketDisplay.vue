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
          class="td-slide"
        >
          <!-- Bilhete estilo térmico -->
          <div class="thermal-ticket">
            <div class="tt-badge-container">
              <AtBadge :variant="getBadgeVariant(bilhete.status)">{{ getStatusLabel(bilhete.status) }}</AtBadge>
            </div>

            <div class="tt-header">
              <router-link to="/" class="tt-brand-link">
                <h1 class="tt-brand">ARENATICKET</h1>
              </router-link>
              <div class="tt-divider"></div>
              <h2 class="tt-type">INGRESSO / BILHETE</h2>
            </div>

            <h3 class="tt-event-title">{{ displayTitulo(bilhete) }}</h3>

            <div class="tt-info-group">
              <div class="tt-label">DATA/HORA:</div>
              <div class="tt-value">{{ displayData(bilhete) }}</div>
            </div>

            <div class="tt-info-group" v-if="displayLocal(bilhete)">
              <div class="tt-label">LOCAL:</div>
              <div class="tt-value">{{ displayLocal(bilhete) }}</div>
            </div>

            <div class="tt-info-group" v-if="bilhete.lote?.nome">
              <div class="tt-label">LOTE/SETOR:</div>
              <div class="tt-value">{{ bilhete.lote.nome }}</div>
            </div>

            <div class="tt-info-group">
              <div class="tt-label">TITULAR:</div>
              <div class="tt-value">{{ bilhete.compradorNome }}</div>
            </div>

            <div class="tt-divider-dashed"></div>

            <div class="tt-qr-section">
              <img 
                v-if="bilhete.codigoQR" 
                :src="bilhete.codigoQR" 
                :alt="`QR Code - ${bilhete.codigoTicket}`" 
                class="tt-qr-image" 
              />
              <div v-else class="tt-qr-placeholder">QR Code não disponível</div>
              <div class="tt-qr-instruction">Apresente este código na entrada</div>
            </div>

            <div class="tt-code-section">
              <div class="tt-code">{{ formatCodigoBilhete(bilhete.codigoTicket) }}</div>
              <button
                type="button"
                class="tt-copy-btn"
                @click="copyCode(bilhete.codigoTicket)"
                :title="copiedCodes[bilhete.id] ? 'Copiado!' : 'Copiar'"
              >
                {{ copiedCodes[bilhete.id] ? '✔️ Copiado' : '📋 Copiar' }}
              </button>
            </div>

            <div class="tt-divider-dashed"></div>

            <div class="tt-footer">
              <div class="tt-footer-line">Documento válido apenas com QR Code</div>
              <div class="tt-footer-line">Não transferível | Sujeito a verificação</div>
              <div class="tt-footer-info">
                Gerado via ArenaTicket • +244 925 813 939<br>
                www.arenaticket.ao
              </div>
            </div>

            <div class="tt-actions">
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
      >
        <!-- Bilhete estilo térmico -->
          <div class="thermal-ticket">
          <div class="tt-badge-container">
            <AtBadge :variant="getBadgeVariant(bilhete.status)">{{ getStatusLabel(bilhete.status) }}</AtBadge>
          </div>

          <div class="tt-header">
            <router-link to="/" class="tt-brand-link">
              <h1 class="tt-brand">ARENATICKET</h1>
            </router-link>
            <div class="tt-divider"></div>
            <h2 class="tt-type">INGRESSO / BILHETE</h2>
          </div>

          <h3 class="tt-event-title">{{ displayTitulo(bilhete) }}</h3>

          <div class="tt-info-group">
            <div class="tt-label">DATA/HORA:</div>
            <div class="tt-value">{{ displayData(bilhete) }}</div>
          </div>

          <div class="tt-info-group" v-if="displayLocal(bilhete)">
            <div class="tt-label">LOCAL:</div>
            <div class="tt-value">{{ displayLocal(bilhete) }}</div>
          </div>

          <div class="tt-info-group" v-if="bilhete.lote?.nome">
            <div class="tt-label">LOTE/SETOR:</div>
            <div class="tt-value">{{ bilhete.lote.nome }}</div>
          </div>

          <div class="tt-info-group">
            <div class="tt-label">TITULAR:</div>
            <div class="tt-value">{{ bilhete.compradorNome }}</div>
          </div>

          <div class="tt-divider-dashed"></div>

          <div class="tt-qr-section">
            <img 
              v-if="bilhete.codigoQR" 
              :src="bilhete.codigoQR" 
              :alt="`QR Code - ${bilhete.codigoTicket}`" 
              class="tt-qr-image" 
            />
            <div v-else class="tt-qr-placeholder">QR Code não disponível</div>
            <div class="tt-qr-instruction">Apresente este código na entrada</div>
          </div>

          <div class="tt-code-section">
            <div class="tt-code">{{ formatCodigoBilhete(bilhete.codigoTicket) }}</div>
            <button
              type="button"
              class="tt-copy-btn"
              @click="copyCode(bilhete.codigoTicket)"
              :title="copiedCodes[bilhete.id] ? 'Copiado!' : 'Copiar'"
            >
              {{ copiedCodes[bilhete.id] ? '✔️ Copiado' : '📋 Copiar' }}
            </button>
          </div>

          <div class="tt-divider-dashed"></div>

          <div class="tt-footer">
            <div class="tt-footer-line">Documento válido apenas com QR Code</div>
            <div class="tt-footer-line">Não transferível | Sujeito a verificação</div>
            <div class="tt-footer-info">
              Gerado via ArenaTicket • +244 925 813 939<br>
              www.arenaticket.ao
            </div>
          </div>

          <div class="tt-actions">
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
          Obrigado por apoiar o <strong>Grupo Desportivo Sagrada Esperança</strong>!
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

// Status helpers (used by template and canvas)
const getStatusLabel = (status: string): string => {
  const s = (status || '').toString().toUpperCase();
  const map: Record<string, string> = {
    'VALID': 'Ativo',
    'USED': 'Usado',
    'CANCELLED': 'Cancelado',
    'EXPIRED': 'Expirado',
    'ATIVO': 'Ativo',
    'USADO': 'Usado',
    'CANCELADO': 'Cancelado',
    'EXPIRADO': 'Expirado'
  };
  return map[s] || status || '';
};

const getBadgeVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
  const s = (status || '').toString().toUpperCase();
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'VALID': 'success',
    'USED': 'info',
    'CANCELLED': 'danger',
    'EXPIRED': 'warning',
    'ATIVO': 'success',
    'USADO': 'info',
    'CANCELADO': 'danger',
    'EXPIRADO': 'warning'
  };
  return map[s] || 'info';
};

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
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = 600;
  canvas.height = 900;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.font = 'bold 42px Arial';
  ctx.fillText('ARENATICKET', canvas.width / 2, 60);
  // Draw status badge top-right
  const drawStatusBadge = (statusVal: string) => {
    const label = getStatusLabel(statusVal) || '';
    const variant = getBadgeVariant(statusVal);
    const colorMap: Record<string, string> = {
      success: '#16a34a',
      warning: '#f59e0b',
      danger: '#dc2626',
      info: '#3b82f6'
    };
    const color = colorMap[variant] || '#999999';

    ctx.save();
    ctx.font = 'bold 12px Arial';
    const padX = 12;
    const padY = 8;
    const textWidth = ctx.measureText(label).width;
    const badgeW = textWidth + padX * 2;
    const badgeH = 24;
    const x = canvas.width - 40 - badgeW;
    const y = 28;

    const r = 6;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + badgeW - r, y);
    ctx.quadraticCurveTo(x + badgeW, y, x + badgeW, y + r);
    ctx.lineTo(x + badgeW, y + badgeH - r);
    ctx.quadraticCurveTo(x + badgeW, y + badgeH, x + badgeW - r, y + badgeH);
    ctx.lineTo(x + r, y + badgeH);
    ctx.quadraticCurveTo(x, y + badgeH, x, y + badgeH - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + badgeW / 2, y + badgeH / 2 + 5);
    ctx.restore();
  };
  drawStatusBadge(bilhete.status);
  
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 80);
  ctx.lineTo(canvas.width - 40, 80);
  ctx.stroke();

  ctx.font = '600 20px Arial';
  ctx.fillText('INGRESSO / BILHETE', canvas.width / 2, 110);

  let y = 150;
  
  const tituloEvento = displayTitulo(bilhete);
  ctx.font = 'bold 28px Arial';
  
  const palavras = tituloEvento.split(' ');
  let linha = '';
  const linhas: string[] = [];
  const maxWidth = canvas.width - 80;
  
  palavras.forEach((palavra) => {
    const testeLinha = linha + palavra + ' ';
    const metrics = ctx.measureText(testeLinha);
    if (metrics.width > maxWidth && linha.length > 0) {
      linhas.push(linha.trim());
      linha = palavra + ' ';
    } else {
      linha = testeLinha;
    }
  });
  linhas.push(linha.trim());
  
  linhas.forEach((l) => {
    ctx.fillText(l, canvas.width / 2, y);
    y += 35;
  });

  y += 15;

  ctx.textAlign = 'left';
  ctx.font = '18px Arial';
  
  const dataStr = displayData(bilhete);
  if (dataStr) {
    ctx.font = 'bold 16px Arial';
    ctx.fillText('DATA/HORA:', 40, y);
    ctx.font = '18px Arial';
    ctx.fillText(dataStr, 40, y + 25);
    y += 55;
  }

  const localStr = displayLocal(bilhete);
  if (localStr && localStr.trim().length > 0) {
    ctx.font = 'bold 16px Arial';
    ctx.fillText('LOCAL:', 40, y);
    ctx.font = '18px Arial';
    
    const palavrasLocal = localStr.split(' ');
    let linhaLocal = '';
    const linhasLocal: string[] = [];
    
    palavrasLocal.forEach((palavra) => {
      const testeLinha = linhaLocal + palavra + ' ';
      const metrics = ctx.measureText(testeLinha);
      if (metrics.width > (canvas.width - 80) && linhaLocal.length > 0) {
        linhasLocal.push(linhaLocal.trim());
        linhaLocal = palavra + ' ';
      } else {
        linhaLocal = testeLinha;
      }
    });
    linhasLocal.push(linhaLocal.trim());
    
    linhasLocal.forEach((l, idx) => {
      ctx.fillText(l, 40, y + 25 + (idx * 22));
    });
    y += 25 + (linhasLocal.length * 22) + 30;
  }

  if (bilhete.lote?.nome) {
    ctx.font = 'bold 16px Arial';
    ctx.fillText('LOTE/SETOR:', 40, y);
    ctx.font = '18px Arial';
    ctx.fillText(bilhete.lote.nome, 40, y + 25);
    y += 55;
  }

  ctx.font = 'bold 16px Arial';
  ctx.fillText('TITULAR:', 40, y);
  ctx.font = '18px Arial';
  ctx.fillText(bilhete.compradorNome.toUpperCase(), 40, y + 25);
  y += 55;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(40, y);
  ctx.lineTo(canvas.width - 40, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += 30;

  const qrSize = 220;
  const qrX = (canvas.width - qrSize) / 2;
  const qrY = y;

  const finalizar = () => {
    let finalY = qrY + qrSize + 45;

    ctx.textAlign = 'center';
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#000000';
    ctx.fillText(formatCodigoBilhete(bilhete.codigoTicket), canvas.width / 2, finalY);
    finalY += 30;

    ctx.font = '14px Arial';
    ctx.fillStyle = '#333333';
    ctx.fillText('Apresente este código na entrada', canvas.width / 2, finalY);
    finalY += 40;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(40, finalY);
    ctx.lineTo(canvas.width - 40, finalY);
    ctx.stroke();
    ctx.setLineDash([]);
    finalY += 25;

    ctx.font = '12px Arial';
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'center';
    ctx.fillText('Documento válido apenas com QR Code', canvas.width / 2, finalY);
    finalY += 18;
    ctx.fillText('Não transferível | Sujeito a verificação', canvas.width / 2, finalY);
    finalY += 25;

    ctx.font = '11px Arial';
    ctx.fillStyle = '#999999';
    ctx.fillText('Gerado via ArenaTicket • +244 925 813 939', canvas.width / 2, finalY);
    finalY += 15;
    ctx.fillText('www.arenaticket.ao', canvas.width / 2, finalY);

    downloadCanvas(canvas, `bilhete-${bilhete.codigoTicket}.png`);
  };

  if (bilhete.codigoQR) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
      finalizar();
    };
    img.onerror = () => {
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(qrX + 2, qrY + 2, qrSize - 4, qrSize - 4);
      ctx.fillStyle = '#999999';
      ctx.textAlign = 'center';
      ctx.font = '16px Arial';
      ctx.fillText('QR Code', canvas.width / 2, qrY + qrSize / 2);
      ctx.fillText('não disponível', canvas.width / 2, qrY + qrSize / 2 + 20);
      finalizar();
    };
    img.src = bilhete.codigoQR;
  } else {
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(qrX + 2, qrY + 2, qrSize - 4, qrSize - 4);
    ctx.fillStyle = '#999999';
    ctx.textAlign = 'center';
    ctx.font = '16px Arial';
    ctx.fillText('QR Code', canvas.width / 2, qrY + qrSize / 2);
    ctx.fillText('não disponível', canvas.width / 2, qrY + qrSize / 2 + 20);
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
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-6, 2rem);
  margin-bottom: var(--spacing-6, 2rem);
}

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
  display: flex;
  justify-content: center;
  padding: 0 var(--spacing-2, 0.5rem);
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
  padding: 0 var(--spacing-2, 0.5rem);
}

.td-carousel-btn {
  pointer-events: auto;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.td-carousel-btn:hover {
  background: rgba(0,0,0,0.7);
}

/* Modelo térmico */
.thermal-ticket {
  max-width: 450px;
  margin: 0 auto;
  background: white;
  padding: 24px 20px;
  border: 2px solid #000;
  font-family: 'Courier New', Courier, monospace;
  color: #000;
  position: relative;
}

.tt-badge-container {
  position: absolute;
  top: 16px;
  right: 16px;
}

.tt-header {
  text-align: center;
  margin-bottom: 20px;
}

.tt-brand-link {
  text-decoration: none;
  color: inherit;
  display: inline-block;
  transition: opacity 0.2s;
  cursor: pointer;
}

.tt-brand-link:hover {
  opacity: 0.7;
}

.tt-brand-link:active {
  opacity: 0.5;
}

.tt-brand {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
  margin: 0 0 8px 0;
}

.tt-divider {
  width: 100%;
  height: 2px;
  background: #000;
  margin: 8px 0;
}

.tt-divider-dashed {
  width: 100%;
  height: 1px;
  border-top: 2px dashed #666;
  margin: 20px 0;
}

.tt-type {
  font-size: 14px;
  font-weight: 600;
  margin: 8px 0 0 0;
  letter-spacing: 1px;
}

.tt-event-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0;
  line-height: 1.4;
}

.tt-info-group {
  margin-bottom: 16px;
}

.tt-label {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
}

.tt-value {
  font-size: 14px;
  line-height: 1.4;
}

.tt-qr-section {
  text-align: center;
  margin: 24px 0;
}

.tt-qr-image {
  width: 200px;
  height: 200px;
  border: 2px solid #000;
  padding: 8px;
  background: white;
  display: block;
  margin: 0 auto 12px auto;
}

.tt-qr-placeholder {
  width: 200px;
  height: 200px;
  border: 2px dashed #999;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  color: #999;
  font-size: 12px;
}

.tt-qr-instruction {
  font-size: 11px;
  text-align: center;
}

.tt-code-section {
  text-align: center;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.tt-code {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  font-family: 'Courier New', Courier, monospace;
}

.tt-copy-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #000;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-family: Arial, sans-serif;
  transition: all 0.2s;
}

.tt-copy-btn:hover {
  background: #f0f0f0;
}

.tt-footer {
  text-align: center;
  margin-top: 20px;
}

.tt-footer-line {
  font-size: 10px;
  line-height: 1.6;
  margin-bottom: 4px;
}

.tt-footer-info {
  margin-top: 12px;
  font-size: 9px;
  line-height: 1.5;
  color: #666;
}

.tt-actions {
  display: flex;
  gap: var(--spacing-2, 0.5rem);
  justify-content: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
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

  .thermal-ticket {
    max-width: 100%;
    padding: 20px 16px;
  }

  .tt-brand {
    font-size: 24px;
  }

  .tt-event-title {
    font-size: 16px;
  }

  .tt-qr-image {
    width: 180px;
    height: 180px;
  }

  .tt-qr-placeholder {
    width: 180px;
    height: 180px;
  }
}
</style>
