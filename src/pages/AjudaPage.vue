<template>
  <BaseLayout>
    <div class="ajuda-page">
      <div class="ajuda-header">
        <h1 class="ajuda-title">Central de Ajuda</h1>
        <p class="ajuda-subtitle">Encontre respostas para as suas dúvidas sobre a compra e uso de bilhetes</p>
      </div>

      <div class="ajuda-content">
        <!-- Como Comprar Bilhete -->
        <section class="ajuda-section">
          <div class="ajuda-section-icon">🎫</div>
          <h2 class="ajuda-section-title">Como Comprar Bilhete</h2>
          <div class="ajuda-section-content">
            <ol class="ajuda-list">
              <li>
                <strong>Escolha o Evento:</strong> Na página inicial, navegue pelos eventos disponíveis e clique no botão "Comprar Bilhete" do evento desejado.
              </li>
              <li>
                <strong>Selecione o Lote/Setor:</strong> Escolha o lote ou setor que preferir (VIP, Geral, Arquibancada, etc.). Cada lote tem seu próprio preço e disponibilidade.
              </li>
              <li>
                <strong>Defina a Quantidade:</strong> Selecione quantos bilhetes deseja comprar (respeitando o limite disponível).
              </li>
              <li>
                <strong>Preencha seus Dados:</strong> Informe seu nome completo e número de telefone. Opcionalmente, você pode adicionar seu e-mail.
              </li>
              <li>
                <strong>Escolha o Método de Pagamento:</strong>
                <ul>
                  <li><strong>Multicaixa Express:</strong> Pagamento instantâneo via GPO. Você receberá os bilhetes imediatamente após a confirmação.</li>
                  <li><strong>Referência ATM:</strong> Gere uma referência para pagar em qualquer caixa Multicaixa. Os bilhetes serão liberados após a confirmação do pagamento (pode levar alguns minutos).</li>
                </ul>
              </li>
              <li>
                <strong>Confirme o Pedido:</strong> Revise todas as informações e clique em "Confirmar Pedido".
              </li>
            </ol>
          </div>
        </section>

        <!-- O que Fazer Depois de Comprar -->
        <section class="ajuda-section">
          <div class="ajuda-section-icon">✅</div>
          <h2 class="ajuda-section-title">O que Fazer Depois de Comprar</h2>
          <div class="ajuda-section-content">
            <h3>Pagamento por Multicaixa Express (GPO)</h3>
            <ul class="ajuda-list">
              <li>Após confirmar o pagamento no aplicativo Multicaixa, seus bilhetes serão gerados <strong>automaticamente</strong>.</li>
              <li>Você verá seus bilhetes na tela com o QR Code e código único.</li>
              <li>Baixe ou compartilhe seus bilhetes diretamente.</li>
            </ul>

            <h3>Pagamento por Referência ATM</h3>
            <ul class="ajuda-list">
              <li>Anote a <strong>Entidade</strong> e <strong>Referência</strong> fornecidas.</li>
              <li>Vá até qualquer caixa Multicaixa ou use o aplicativo Multicaixa.</li>
              <li>Selecione "Pagamento de Serviços" e insira a Entidade e Referência.</li>
              <li>Confirme o pagamento.</li>
              <li>Após a confirmação (geralmente alguns minutos), seus bilhetes serão enviados por SMS para o número cadastrado.</li>
            </ul>
          </div>
        </section>

        <!-- Como Usar o Bilhete -->
        <section class="ajuda-section">
          <div class="ajuda-section-icon">📱</div>
          <h2 class="ajuda-section-title">Como Usar o Bilhete</h2>
          <div class="ajuda-section-content">
            <ul class="ajuda-list">
              <li>
                <strong>Salve o Bilhete:</strong> Baixe o bilhete como imagem ou tire um print da tela para ter acesso offline.
              </li>
              <li>
                <strong>No Dia do Evento:</strong> Apresente o <strong>QR Code</strong> na entrada do evento para ser escaneado pela equipe de segurança.
              </li>
              <li>
                <strong>Código de Backup:</strong> Se houver problemas com o QR Code, você pode informar o código único do bilhete (ex: GDSE-00017374) para verificação manual.
              </li>
              <li>
                <strong>Importante:</strong> Cada bilhete é único e válido para uma única entrada. Não compartilhe o QR Code ou código com outras pessoas.
              </li>
            </ul>
          </div>
        </section>

        <!-- Perguntas Frequentes -->
        <section class="ajuda-section">
          <div class="ajuda-section-icon">❓</div>
          <h2 class="ajuda-section-title">Perguntas Frequentes</h2>
          <div class="ajuda-section-content">
            <div class="ajuda-faq">
              <h4>Posso transferir meu bilhete para outra pessoa?</h4>
              <p>Não. Os bilhetes são nominais e não transferíveis. O nome cadastrado no momento da compra deve corresponder ao portador na entrada.</p>
            </div>

            <div class="ajuda-faq">
              <h4>E se eu perder meu bilhete?</h4>
              <p>Se você perdeu o SMS ou o arquivo do bilhete, entre em contato conosco pelo telefone <strong>+244 925 813 939</strong> ou acesse o link enviado por SMS com seu código de pedido.</p>
            </div>

            <div class="ajuda-faq">
              <h4>Posso cancelar minha compra?</h4>
              <p>Cancelamentos devem ser solicitados com até 48 horas de antecedência do evento. Entre em contato com nosso suporte para solicitar o cancelamento.</p>
            </div>

            <div class="ajuda-faq">
              <h4>Quanto tempo leva para receber o bilhete após o pagamento?</h4>
              <p>
                <strong>Multicaixa Express:</strong> Imediato (segundos)<br>
                <strong>Referência ATM:</strong> 2 a 15 minutos após a confirmação do pagamento
              </p>
            </div>

            <div class="ajuda-faq">
              <h4>O que fazer se o pagamento foi feito mas não recebi o bilhete?</h4>
              <p>Aguarde até 15 minutos. Se ainda não receber, entre em contato pelo <strong>+244 925 813 939</strong> com o comprovante de pagamento.</p>
            </div>

            <div class="ajuda-faq">
              <h4>Posso comprar múltiplos bilhetes com nomes diferentes?</h4>
              <p>No momento, todos os bilhetes de um pedido são cadastrados no nome do comprador. Para bilhetes com nomes diferentes, é necessário fazer pedidos separados.</p>
            </div>
          </div>
        </section>

        <!-- Contato -->
        <section class="ajuda-section ajuda-section-contact">
          <div class="ajuda-section-icon">📞</div>
          <h2 class="ajuda-section-title">Precisa de Mais Ajuda?</h2>
          <div class="ajuda-section-content">
            <p>Nossa equipe de suporte está disponível para ajudá-lo:</p>
            <div class="ajuda-contact-info">
              <div class="ajuda-contact-item">
                <span class="ajuda-contact-label">Telefone/WhatsApp:</span>
                <a href="tel:+244925813939" class="ajuda-contact-value">+244 925 813 939</a>
              </div>
              <div class="ajuda-contact-item">
                <span class="ajuda-contact-label">Website:</span>
                <a href="https://www.arenaticket.ao" target="_blank" class="ajuda-contact-value">www.arenaticket.ao</a>
              </div>
              <div class="ajuda-contact-item">
                <span class="ajuda-contact-label">Horário de Atendimento:</span>
                <span class="ajuda-contact-value">Segunda a Sábado, 8h - 18h</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Botão Voltar -->
      <div class="ajuda-footer">
        <router-link to="/" class="ajuda-back-btn">
          ← Voltar à Página Inicial
        </router-link>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '../layouts/BaseLayout.vue';
</script>

<style scoped>
.ajuda-page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-6, 2rem) var(--spacing-4, 1.5rem);
}

.ajuda-header {
  text-align: center;
  margin-bottom: var(--spacing-8, 3rem);
  padding-bottom: var(--spacing-6, 2rem);
  border-bottom: 3px solid var(--color-primary, #1e40af);
}

.ajuda-title {
  font-family: 'Poppins', sans-serif;
  font-size: var(--font-size-4xl, 3rem);
  font-weight: 800;
  color: var(--color-primary, #1e40af);
  margin: 0 0 var(--spacing-3, 1rem) 0;
  letter-spacing: -0.02em;
}

.ajuda-subtitle {
  font-size: var(--font-size-lg, 1.25rem);
  color: var(--color-text-secondary, #666);
  margin: 0;
  line-height: 1.6;
}

.ajuda-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8, 3rem);
}

.ajuda-section {
  background: white;
  border-radius: var(--radius-lg, 12px);
  padding: var(--spacing-6, 2rem);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid var(--color-border, #e5e5e5);
  transition: all 0.3s ease;
}

.ajuda-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.ajuda-section-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-3, 1rem);
}

.ajuda-section-title {
  font-family: 'Poppins', sans-serif;
  font-size: var(--font-size-2xl, 2rem);
  font-weight: 700;
  color: var(--color-text-primary, #1a1a1a);
  margin: 0 0 var(--spacing-4, 1.5rem) 0;
}

.ajuda-section-content {
  color: var(--color-text-primary, #1a1a1a);
  line-height: 1.8;
}

.ajuda-section-content h3 {
  font-size: var(--font-size-lg, 1.25rem);
  font-weight: 600;
  color: var(--color-primary, #1e40af);
  margin: var(--spacing-4, 1.5rem) 0 var(--spacing-2, 0.5rem) 0;
}

.ajuda-section-content h4 {
  font-size: var(--font-size-base, 1rem);
  font-weight: 600;
  margin: var(--spacing-3, 1rem) 0 var(--spacing-2, 0.5rem) 0;
}

.ajuda-list {
  margin: var(--spacing-3, 1rem) 0;
  padding-left: var(--spacing-5, 2rem);
}

.ajuda-list li {
  margin-bottom: var(--spacing-3, 1rem);
}

.ajuda-list li strong {
  color: var(--color-primary, #1e40af);
  font-weight: 600;
}

.ajuda-list ul {
  margin-top: var(--spacing-2, 0.5rem);
  padding-left: var(--spacing-4, 1.5rem);
  list-style-type: circle;
}

.ajuda-faq {
  margin-bottom: var(--spacing-5, 2rem);
  padding-bottom: var(--spacing-4, 1.5rem);
  border-bottom: 1px solid var(--color-border, #e5e5e5);
}

.ajuda-faq:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.ajuda-faq h4 {
  color: var(--color-primary, #1e40af);
  font-size: var(--font-size-lg, 1.25rem);
  font-weight: 600;
  margin: 0 0 var(--spacing-2, 0.5rem) 0;
}

.ajuda-faq p {
  margin: 0;
  color: var(--color-text-primary, #1a1a1a);
  line-height: 1.8;
}

.ajuda-section-contact {
  background: linear-gradient(135deg, var(--color-primary-light, #eff6ff) 0%, white 100%);
  border-color: var(--color-primary, #1e40af);
}

.ajuda-contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3, 1rem);
  margin-top: var(--spacing-4, 1.5rem);
}

.ajuda-contact-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1, 0.25rem);
}

.ajuda-contact-label {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #666);
  font-weight: 500;
}

.ajuda-contact-value {
  font-size: var(--font-size-lg, 1.25rem);
  color: var(--color-primary, #1e40af);
  font-weight: 600;
  text-decoration: none;
}

.ajuda-contact-value:hover {
  text-decoration: underline;
}

.ajuda-footer {
  margin-top: var(--spacing-8, 3rem);
  text-align: center;
}

.ajuda-back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-3, 1rem) var(--spacing-5, 2rem);
  background: var(--color-primary, #1e40af);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-full, 9999px);
  font-weight: 600;
  font-size: var(--font-size-base, 1rem);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
}

.ajuda-back-btn:hover {
  background: var(--color-primary-dark, #1e3a8a);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
}

/* Responsividade */
@media (max-width: 768px) {
  .ajuda-page {
    padding: var(--spacing-4, 1.5rem) var(--spacing-3, 1rem);
  }

  .ajuda-header {
    margin-bottom: var(--spacing-6, 2rem);
    padding-bottom: var(--spacing-4, 1.5rem);
  }

  .ajuda-title {
    font-size: var(--font-size-2xl, 2rem);
  }

  .ajuda-subtitle {
    font-size: var(--font-size-base, 1rem);
  }

  .ajuda-section {
    padding: var(--spacing-4, 1.5rem);
  }

  .ajuda-section-icon {
    font-size: 2.5rem;
  }

  .ajuda-section-title {
    font-size: var(--font-size-xl, 1.5rem);
  }

  .ajuda-list {
    padding-left: var(--spacing-4, 1.5rem);
  }

  .ajuda-contact-value {
    font-size: var(--font-size-base, 1rem);
  }

  .ajuda-back-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .ajuda-title {
    font-size: var(--font-size-xl, 1.5rem);
  }

  .ajuda-section-icon {
    font-size: 2rem;
  }

  .ajuda-section {
    padding: var(--spacing-3, 1rem);
  }
}
</style>
