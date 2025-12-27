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
        <p class="bp-error-hint">
          ℹ️ <strong>Dica:</strong> Verifique se o código do bilhete está correto na URL.<br>
          Formato esperado: <code>/bilhete/GDSE-XXXX-XXXX</code>
        </p>
        <AtButton variant="primary" @click="voltarHome">
          Voltar à página inicial
        </AtButton>
      </div>

      <!-- Bilhete encontrado -->
      <div v-else-if="bilhete" class="bp-content">
        <!-- Bilhete estilo térmica -->
        <div class="thermal-ticket">
          <!-- Logo/Título -->
          <div class="tt-header">
            <div class="tt-badge-container">
              <AtBadge :variant="getBadgeVariant(bilhete.status)">{{ getStatusLabel(bilhete.status) }}</AtBadge>
            </div>
            <router-link to="/" class="tt-brand-link">
              <h1 class="tt-brand">ARENATICKET</h1>
            </router-link>
            <div class="tt-divider"></div>
            <h2 class="tt-type">INGRESSO / BILHETE</h2>
          </div>

          <!-- Título do Evento -->
          <h3 class="tt-event-title">{{ displayTitulo(bilhete) }}</h3>

          <!-- Data/Hora -->
          <div class="tt-info-group">
            <div class="tt-label">DATA/HORA:</div>
            <div class="tt-value">{{ displayData(bilhete) }}</div>
          </div>

          <!-- Local -->
          <div class="tt-info-group" v-if="displayLocal(bilhete)">
            <div class="tt-label">LOCAL:</div>
            <div class="tt-value">{{ displayLocal(bilhete) }}</div>
          </div>

          <!-- Lote/Setor -->
          <div class="tt-info-group" v-if="bilhete.lote?.nome">
            <div class="tt-label">LOTE/SETOR:</div>
            <div class="tt-value">{{ bilhete.lote.nome }}</div>
          </div>

          <!-- Titular -->
          <div class="tt-info-group">
            <div class="tt-label">TITULAR:</div>
            <div class="tt-value">{{ bilhete.compradorNome }}</div>
          </div>

          <div class="tt-divider-dashed"></div>

          <!-- QR Code -->
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

          <!-- Código do bilhete -->
          <div class="tt-code-section">
            <div class="tt-code">{{ formatCodigoBilhete(bilhete.codigoTicket) }}</div>
          </div>

          <div class="tt-divider-dashed"></div>

          <!-- Rodapé -->
          <div class="tt-footer">
            <div class="tt-footer-line">Documento válido apenas com QR Code</div>
            <div class="tt-footer-line">Não transferível | Sujeito a verificação</div>
            <div class="tt-footer-info">
              <div>Gerado via ArenaTicket • +244 925 813 939</div>
              <div>www.arenaticket.ao</div>
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
import { getBilheteByCodigo } from '../features/checkout/services/paymentService';
import { fetchEventoDetalhes } from '../services/api';
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
  const codigoBilhete = route.params.codigo as string;
  
  if (!codigoBilhete) {
    error.value = 'Código do bilhete não fornecido';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    // Buscar bilhete pelo código
    const bilheteData = await getBilheteByCodigo(codigoBilhete);
    
    if (!bilheteData) {
      error.value = 'Bilhete não encontrado ou ainda não disponível';
      return;
    }

    bilhete.value = bilheteData;
    
    // Se o evento não tem data completa, buscar detalhes do evento
    if (bilhete.value.evento?.id && !bilhete.value.evento.dataEvento) {
      try {
        const eventoDetalhes = await fetchEventoDetalhes(bilhete.value.evento.id);
        if (eventoDetalhes) {
          // Atualizar informações do evento com os detalhes completos
          bilhete.value.evento = {
            ...bilhete.value.evento,
            dataEvento: eventoDetalhes.dataHoraInicio || eventoDetalhes.dataEvento,
            local: eventoDetalhes.local || bilhete.value.evento.local,
            titulo: eventoDetalhes.titulo || eventoDetalhes.nome || bilhete.value.evento.titulo
          };
        }
      } catch (eventoErr) {
        console.warn('Não foi possível carregar detalhes do evento:', eventoErr);
        // Não falhar se não conseguir carregar detalhes do evento
      }
    }
    
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
  if (!b.evento?.dataEvento) return '';
  try {
    return formatDataEvento(b.evento.dataEvento);
  } catch {
    return '';
  }
};

const displayLocal = (b: Bilhete): string => {
  return b.evento?.local || '';
};

const formatCodigoBilhete = (codigo: string): string => {
  // Formatar código: GDSE-01329879 -> GDSE - 0132 9879
  if (!codigo) return '';
  
  // Separar prefixo (GDSE) e número
  const match = codigo.match(/^([A-Z]+)-?(.+)$/);
  if (!match) return codigo;
  
  const prefixo = match[1]; // GDSE
  const numero = match[2].replace(/\D/g, ''); // Remove não-dígitos: 01329879
  
  if (numero.length < 4) {
    return `${prefixo} - ${numero}`;
  }
  
  // Dividir número em grupos de 4: 0132 9879
  const grupos: string[] = [];
  for (let i = 0; i < numero.length; i += 4) {
    grupos.push(numero.slice(i, i + 4));
  }
  
  return `${prefixo} - ${grupos.join(' ')}`;
};

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
  // Desenhar badge de status no topo direito
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

    // rounded rect
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
  drawStatusBadge(b.status);
  
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
    let finalY = qrY + qrSize + 45;

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
    ctx.fillText('www.arenaticket.ao', canvas.width / 2, finalY);

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

.bp-error-hint {
  margin-top: var(--spacing-4, 1.5rem);
  padding: var(--spacing-3, 1rem);
  background: #f9fafb;
  border-left: 3px solid #3b82f6;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.6;
  text-align: left;
}

.bp-error-hint code {
  background: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  color: #1a1a1a;
  font-weight: 600;
}

/* Layout de impressora térmica */
.thermal-ticket {
  max-width: 400px;
  margin: 0 auto 2rem auto;
  background: white;
  padding: 24px 20px;
  border: 2px solid #000;
  font-family: 'Courier New', Courier, monospace;
  color: #000;
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

.tt-badge-container {
  position: absolute;
  top: 12px;
  right: 12px;
}

.tt-code-section {
  text-align: center;
  margin: 20px 0;
}

.tt-code {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  font-family: 'Courier New', Courier, monospace;
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

.bp-actions {
  display: flex;
  gap: var(--spacing-3, 1rem);
  margin: var(--spacing-6, 2rem) auto;
  max-width: 400px;
}

.bp-actions button {
  flex: 1;
}

.bp-footer {
  text-align: center;
  margin-top: var(--spacing-6, 2rem);
}

@media (max-width: 768px) {
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

  .bp-actions {
    flex-direction: column;
  }
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
</style>
