<template>
  <BaseLayout>
    <div class="bilhete-page">
      <!-- Loading -->
      <div v-if="loading" class="bp-loading">
        <AtLoader label="Carregando bilhete..." />
      </div>

      <!-- Erro -->
      <div v-else-if="error" class="bp-error">
        <div class="bp-error-icon">
          <AtIcon><span>⚠️</span></AtIcon>
        </div>
        <h2>Bilhete não encontrado</h2>
        <p>{{ error }}</p>
        <AtButton variant="primary" @click="voltarHome">
          Voltar à página inicial
        </AtButton>
      </div>

      <!-- Bilhete encontrado -->
      <div v-else-if="bilhete" class="bp-content">
        <div class="bp-header">
          <div class="bp-success-icon">
            <AtIcon><span>✅</span></AtIcon>
          </div>
          <h1>Seu Bilhete</h1>
          <p class="bp-subtitle">Apresente este bilhete na entrada do evento</p>
        </div>

        <div class="bp-ticket-card">
          <!-- Cabeçalho do bilhete -->
          <div class="bp-ticket-header">
            <h2>{{ displayTitulo(bilhete) }}</h2>
            <AtBadge :variant="getBadgeVariant(bilhete.status)">
              {{ getStatusLabel(bilhete.status) }}
            </AtBadge>
          </div>

          <!-- QR Code -->
          <div v-if="bilhete.codigoQR" class="bp-qr-section">
            <img :src="bilhete.codigoQR" :alt="`QR Code - ${bilhete.codigoTicket}`" class="bp-qr-image" />
            <p class="bp-qr-label">Escaneie este código na entrada</p>
          </div>
          <div v-else class="bp-qr-placeholder">
            <div class="bp-qr-skeleton">QR Code não disponível</div>
          </div>

          <!-- Código do bilhete -->
          <div class="bp-ticket-code">
            <label>Código do Bilhete:</label>
            <div class="bp-code-value">
              <strong>{{ formatCodigoBilhete(bilhete.codigoTicket) }}</strong>
              <button
                type="button"
                class="bp-copy-btn"
                @click="copyCode"
                :title="copied ? 'Copiado!' : 'Copiar'"
              >
                <AtIcon><span>{{ copied ? '✔️' : '📋' }}</span></AtIcon>
              </button>
            </div>
          </div>

          <!-- Detalhes do evento -->
          <div class="bp-details">
            <div class="bp-detail-row">
              <AtIcon><span>👤</span></AtIcon>
              <div>
                <span class="bp-detail-label">Titular</span>
                <span class="bp-detail-value">{{ bilhete.compradorNome }}</span>
              </div>
            </div>

            <div v-if="displayData(bilhete)" class="bp-detail-row">
              <AtIcon><span>📅</span></AtIcon>
              <div>
                <span class="bp-detail-label">Data/Hora</span>
                <span class="bp-detail-value">{{ displayData(bilhete) }}</span>
              </div>
            </div>

            <div v-if="displayLocal(bilhete)" class="bp-detail-row">
              <AtIcon><span>📍</span></AtIcon>
              <div>
                <span class="bp-detail-label">Local</span>
                <span class="bp-detail-value">{{ displayLocal(bilhete) }}</span>
              </div>
            </div>

            <div v-if="bilhete.lote?.nome" class="bp-detail-row">
              <AtIcon><span>🎟️</span></AtIcon>
              <div>
                <span class="bp-detail-label">Lote/Setor</span>
                <span class="bp-detail-value">{{ bilhete.lote.nome }}</span>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="bp-actions">
            <AtButton
              variant="secondary"
              size="lg"
              @click="downloadTicket"
              :disabled="downloading"
            >
              <AtIcon><span>⬇️</span></AtIcon>
              {{ downloading ? 'Gerando...' : 'Baixar Bilhete' }}
            </AtButton>
            <AtButton
              variant="primary"
              size="lg"
              @click="shareWhatsApp"
            >
              <AtIcon><span>📤</span></AtIcon>
              Compartilhar
            </AtButton>
          </div>

          <!-- Aviso importante -->
          <div class="bp-warning">
            <AtIcon><span>ℹ️</span></AtIcon>
            <p>
              <strong>Importante:</strong> Guarde este link com segurança. 
              Você precisará dele para acessar seu bilhete a qualquer momento.
            </p>
          </div>
        </div>

        <!-- Link para voltar -->
        <div class="bp-footer">
          <AtButton variant="ghost" @click="voltarHome">
            ← Voltar à página inicial
          </AtButton>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseLayout from '../layouts/BaseLayout.vue';
import AtLoader from '../components/AtLoader.vue';
import AtButton from '../components/AtButton.vue';
import AtBadge from '../components/AtBadge.vue';
import AtIcon from '../components/AtIcon.vue';
import type { Bilhete } from '../features/checkout/types/checkout.types';
import { getPedidoBilhetes } from '../features/checkout/services/paymentService';
import { formatDataEvento } from '../features/checkout/utils/validators';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref<string | null>(null);
const bilhete = ref<Bilhete | null>(null);
const copied = ref(false);
const downloading = ref(false);

// Buscar bilhete pelo ID na URL
const fetchBilhete = async () => {
  const bilheteId = route.params.id as string;
  
  if (!bilheteId) {
    error.value = 'ID do bilhete não fornecido';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    // Buscar bilhetes do pedido (pode retornar array)
    const bilhetes = await getPedidoBilhetes(bilheteId);
    
    if (!bilhetes || bilhetes.length === 0) {
      error.value = 'Bilhete não encontrado ou ainda não disponível';
      return;
    }

    // Pegar o primeiro bilhete (ou buscar pelo ID específico se necessário)
    bilhete.value = bilhetes[0];
    
  } catch (err: any) {
    console.error('Erro ao buscar bilhete:', err);
    error.value = err.message || 'Erro ao carregar bilhete. Verifique o link e tente novamente.';
  } finally {
    loading.value = false;
  }
};

// Funções auxiliares de display
const displayTitulo = (b: Bilhete): string => {
  return b.evento?.titulo || 'Evento';
};

const displayData = (b: Bilhete): string => {
  if (!b.evento?.dataHoraInicio) return '';
  try {
    return formatDataEvento(b.evento.dataHoraInicio);
  } catch {
    return '';
  }
};

const displayLocal = (b: Bilhete): string => {
  return b.evento?.local || '';
};

const formatCodigoBilhete = (codigo: string): string => {
  // Formatar código com hífens para melhor legibilidade
  // Ex: ABC123DEF456 -> ABC1-23DE-F456
  if (!codigo) return '';
  if (codigo.length <= 4) return codigo;
  
  const parts: string[] = [];
  for (let i = 0; i < codigo.length; i += 4) {
    parts.push(codigo.slice(i, i + 4));
  }
  return parts.join('-');
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'ATIVO': 'Ativo',
    'USADO': 'Usado',
    'CANCELADO': 'Cancelado',
    'EXPIRADO': 'Expirado'
  };
  return labels[status] || status;
};

const getBadgeVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'ATIVO': 'success',
    'USADO': 'info',
    'CANCELADO': 'danger',
    'EXPIRADO': 'warning'
  };
  return variants[status] || 'info';
};

// Copiar código
const copyCode = async () => {
  if (!bilhete.value) return;
  
  try {
    await navigator.clipboard.writeText(bilhete.value.codigoTicket);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Erro ao copiar código:', err);
  }
};

// Download do bilhete
const downloadTicket = () => {
  if (!bilhete.value) return;
  
  downloading.value = true;
  
  // Reutilizar a mesma lógica de geração do TicketDisplay
  generateTicketCanvas(bilhete.value, (canvas) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        downloading.value = false;
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bilhete-${bilhete.value!.codigoTicket}.png`;
      link.click();
      
      URL.revokeObjectURL(url);
      downloading.value = false;
    });
  });
};

// Compartilhar via WhatsApp
const shareWhatsApp = () => {
  if (!bilhete.value) return;
  
  generateTicketCanvas(bilhete.value, (canvas) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Falha ao gerar imagem do bilhete');
        return;
      }

      const file = new File([blob], `bilhete-${bilhete.value!.codigoTicket}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        const eventoTitulo = bilhete.value!.evento?.titulo || 'Evento';
        
        navigator.share({
          title: 'Meu Bilhete ArenaTicket',
          text: `🎟️ Bilhete confirmado!\n\nEvento: ${eventoTitulo}\nCódigo: ${bilhete.value!.codigoTicket}\n\nApresente este bilhete na entrada.`,
          files: [file]
        })
        .then(() => console.log('Bilhete compartilhado com sucesso'))
        .catch((err) => {
          console.error('Erro ao compartilhar:', err);
          downloadTicket();
        });
      } else {
        // Fallback
        downloadTicket();
        
        const eventoTitulo = bilhete.value!.evento?.titulo || 'Evento';
        const bilheteUrl = window.location.href;
        const msg = `🎟️ Bilhete confirmado!\n\nEvento: ${eventoTitulo}\nCódigo: ${bilhete.value!.codigoTicket}\n\nAcesse seu bilhete: ${bilheteUrl}\n\n⬇️ Imagem do bilhete baixada. Anexe manualmente no WhatsApp.`;
        const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
        
        setTimeout(() => {
          window.open(url, '_blank');
        }, 500);
      }
    }, 'image/png');
  });
};

// Gerar canvas do bilhete (mesma lógica do TicketDisplay)
const generateTicketCanvas = (b: Bilhete, callback: (canvas: HTMLCanvasElement) => void) => {
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
  
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 80);
  ctx.lineTo(canvas.width - 40, 80);
  ctx.stroke();

  ctx.font = '600 20px Arial';
  ctx.fillText('INGRESSO / BILHETE', canvas.width / 2, 110);

  let y = 150;
  
  const tituloEvento = displayTitulo(b);
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
  
  const dataStr = displayData(b);
  if (dataStr) {
    ctx.font = 'bold 16px Arial';
    ctx.fillText('DATA/HORA:', 40, y);
    ctx.font = '18px Arial';
    ctx.fillText(dataStr, 40, y + 25);
    y += 55;
  }

  const localStr = displayLocal(b);
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

  if (b.lote?.nome) {
    ctx.font = 'bold 16px Arial';
    ctx.fillText('LOTE/SETOR:', 40, y);
    ctx.font = '18px Arial';
    ctx.fillText(b.lote.nome, 40, y + 25);
    y += 55;
  }

  ctx.font = 'bold 16px Arial';
  ctx.fillText('TITULAR:', 40, y);
  ctx.font = '18px Arial';
  ctx.fillText(b.compradorNome.toUpperCase(), 40, y + 25);
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
    let finalY = qrY + qrSize + 20;

    ctx.textAlign = 'center';
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#000000';
    ctx.fillText(formatCodigoBilhete(b.codigoTicket), canvas.width / 2, finalY);
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
    ctx.fillText('www.arenaticket.gdse.ao', canvas.width / 2, finalY);

    callback(canvas);
  };

  if (b.codigoQR) {
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
    img.src = b.codigoQR;
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

const voltarHome = () => {
  router.push('/');
};

onMounted(() => {
  fetchBilhete();
});
</script>

<style scoped>
.bilhete-page {
  min-height: calc(100vh - 120px);
  padding: var(--spacing-4, 1.5rem);
}

.bp-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.bp-error {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  padding: var(--spacing-6, 2rem);
}

.bp-error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-4, 1.5rem);
  color: var(--color-danger, #dc2626);
  font-size: 4rem;
}

.bp-error h2 {
  font-size: var(--font-size-2xl, 2rem);
  margin-bottom: var(--spacing-3, 1rem);
  color: var(--color-text-primary, #1a1a1a);
}

.bp-error p {
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--spacing-4, 1.5rem);
}

.bp-content {
  max-width: 600px;
  margin: 0 auto;
}

.bp-header {
  text-align: center;
  margin-bottom: var(--spacing-6, 2rem);
}

.bp-success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-3, 1rem);
  font-size: 3rem;
}

.bp-header h1 {
  font-size: var(--font-size-3xl, 2.5rem);
  font-weight: 700;
  margin: 0 0 var(--spacing-2, 0.5rem) 0;
  color: var(--color-text-primary, #1a1a1a);
}

.bp-subtitle {
  font-size: var(--font-size-base, 1rem);
  color: var(--color-text-secondary, #666);
  margin: 0;
}

.bp-ticket-card {
  background: white;
  border-radius: var(--radius-lg, 12px);
  padding: var(--spacing-6, 2rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bp-ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: var(--spacing-3, 1rem);
  margin-bottom: var(--spacing-5, 1.75rem);
  padding-bottom: var(--spacing-4, 1.5rem);
  border-bottom: 2px solid var(--color-border, #e5e5e5);
}

.bp-ticket-header h2 {
  font-size: var(--font-size-xl, 1.5rem);
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
  margin: 0;
  flex: 1;
}

.bp-qr-section {
  text-align: center;
  margin: var(--spacing-5, 1.75rem) 0;
}

.bp-qr-image {
  width: 220px;
  height: 220px;
  border: 2px solid var(--color-border, #e5e5e5);
  border-radius: var(--radius-md, 8px);
  padding: var(--spacing-2, 0.5rem);
  background: white;
}

.bp-qr-label {
  margin-top: var(--spacing-2, 0.5rem);
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
}

.bp-qr-placeholder {
  text-align: center;
  margin: var(--spacing-5, 1.75rem) 0;
}

.bp-qr-skeleton {
  width: 220px;
  height: 220px;
  margin: 0 auto;
  background: var(--color-bg-secondary, #f5f5f5);
  border: 2px dashed var(--color-border, #e5e5e5);
  border-radius: var(--radius-md, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary, #999);
  font-size: var(--font-size-sm, 0.875rem);
}

.bp-ticket-code {
  margin: var(--spacing-5, 1.75rem) 0;
  padding: var(--spacing-4, 1.5rem);
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: var(--radius-md, 8px);
}

.bp-ticket-code label {
  display: block;
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 600;
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--spacing-2, 0.5rem);
}

.bp-code-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2, 0.5rem);
}

.bp-code-value strong {
  font-size: var(--font-size-lg, 1.25rem);
  font-family: monospace;
  color: var(--color-text-primary, #1a1a1a);
  letter-spacing: 0.05em;
}

.bp-copy-btn {
  background: var(--color-primary, #1e40af);
  color: white;
  border: none;
  padding: var(--spacing-2, 0.5rem);
  border-radius: var(--radius-sm, 4px);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.25rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bp-copy-btn:hover {
  background: var(--color-primary-dark, #1e3a8a);
  transform: scale(1.05);
}

.bp-details {
  margin: var(--spacing-5, 1.75rem) 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4, 1.5rem);
}

.bp-detail-row {
  display: flex;
  align-items: start;
  gap: var(--spacing-3, 1rem);
}

.bp-detail-row > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1, 0.25rem);
}

.bp-detail-label {
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 600;
  color: var(--color-text-secondary, #666);
}

.bp-detail-value {
  font-size: var(--font-size-base, 1rem);
  color: var(--color-text-primary, #1a1a1a);
}

.bp-actions {
  display: flex;
  gap: var(--spacing-3, 1rem);
  margin: var(--spacing-6, 2rem) 0;
}

.bp-actions button {
  flex: 1;
}

.bp-warning {
  display: flex;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-3, 1rem);
  background: var(--color-warning-light, #fef3c7);
  border: 1px solid var(--color-warning, #f59e0b);
  border-radius: var(--radius-md, 8px);
  margin-top: var(--spacing-5, 1.75rem);
}

.bp-warning p {
  margin: 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-primary, #1a1a1a);
  line-height: 1.5;
}

.bp-footer {
  text-align: center;
  margin-top: var(--spacing-6, 2rem);
}

@media (max-width: 768px) {
  .bp-ticket-card {
    padding: var(--spacing-4, 1.5rem);
  }

  .bp-ticket-header {
    flex-direction: column;
    gap: var(--spacing-2, 0.5rem);
  }

  .bp-ticket-header h2 {
    font-size: var(--font-size-lg, 1.25rem);
  }

  .bp-actions {
    flex-direction: column;
  }

  .bp-qr-image {
    width: 180px;
    height: 180px;
  }
}
</style>
