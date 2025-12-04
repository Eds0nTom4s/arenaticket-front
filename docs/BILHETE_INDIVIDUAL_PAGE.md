# Página de Bilhete Individual (/bilhete/:codigoTicket)

Implementada conforme especificações dos arquivos `INSTRUCOES_FRONTEND_BILHETES.md` e `SMS_FORMATO_FINAL.md`.

## Funcionalidades
- Busca bilhete via endpoint público `GET /api/v1/public/bilhete/{codigoTicket}`.
- Normalização de resposta heterogénea com `normalizeBilhete`.
- Exibição de:
  - Título do evento
  - Data/Hora formatada (`formatDataEvento`)
  - Local
  - Lote/Setor
  - Titular
  - Status com cores (VALID, USED, CANCELLED, EXPIRED)
  - QR Code em destaque
  - Código do bilhete formatado e botão copiar
- Ações:
  - Download da imagem do bilhete (canvas 600x900 térmico)
  - Compartilhar (Web Share API com arquivo PNG; fallback para WhatsApp + download)
  - Voltar para home
- Estados:
  - Loading (spinner)
  - Erro 404 / genérico
- Responsividade (mobile: QR menor + ações empilhadas).

## Técnicas
- Renderização de canvas replica formato térmico unificado.
- Fallback de compartilhamento para cópia de link + abertura de WhatsApp.
- Código do bilhete aceita forma compacta ou com hífens.
- Status mapeado para variantes de badge existentes.

## Próximos Passos (opcional)
- PDF (jsPDF + html2canvas).
- Add to Wallet.
- Polling / WebSocket para check-in em tempo real.
- Cache offline (PWA) para QR.

## Segurança
- Página não expõe outros bilhetes do pedido; um link = um bilhete.
- QR Code tratado localmente; sem persistência adicional no cliente.

Documento gerado automaticamente em 20/11/2025.
