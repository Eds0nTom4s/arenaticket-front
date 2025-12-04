# Página de Visualização de Bilhetes

## 📋 Visão Geral

Nova página dedicada para visualização individual de bilhetes via link compartilhável. Ideal para pagamentos por **REFERENCIA** onde o usuário recebe um link após confirmação do pagamento.

## 🔗 Rota

```
/bilhete/:id
```

**Exemplo de URL**:
```
https://arenaticket.gdse.ao/bilhete/6accfd3f-1964-4f54-ad20-f9a7e04f9cd8
```

## 🎯 Casos de Uso

### 1. Pagamento por REFERENCIA (ATM)
1. Usuário compra bilhete e escolhe "Pagamento por Referência"
2. Sistema gera pedido com status `PENDING`
3. Usuário paga no ATM com a referência
4. Backend confirma pagamento e gera bilhetes
5. **Backend envia link via SMS/Email**: `https://arenaticket.gdse.ao/bilhete/{pedidoId}`
6. Usuário acessa o link e visualiza seu bilhete

### 2. Compartilhamento de Bilhete
1. Usuário compra bilhete via GPO (pagamento instantâneo)
2. Recebe bilhete imediatamente
3. Pode compartilhar link do bilhete com outras pessoas
4. Link público permite visualização e download

## ✨ Funcionalidades

### Visualização Completa
- ✅ QR Code grande e centralizado
- 📱 Código do bilhete formatado e copiável
- 📅 Detalhes do evento (data, local, lote, titular)
- 🎫 Status do bilhete (Ativo, Usado, Cancelado, Expirado)

### Ações Disponíveis
- **Baixar Bilhete**: Gera imagem PNG profissional (formato térmico)
- **Compartilhar**: Web Share API com imagem (mobile) ou download + WhatsApp (desktop)
- **Copiar Código**: Copia código do bilhete para clipboard
- **Voltar**: Retorna à página inicial

### Tratamento de Erros
- ⚠️ Bilhete não encontrado
- ⏳ Loading durante busca
- 🔒 Mensagem clara de erro com opção de voltar

## 🛠️ Integração Backend

### Endpoint Necessário

O frontend chama:
```typescript
GET /api/v1/public/pedidos/{pedidoId}/bilhetes
```

**Resposta esperada**:
```json
[
  {
    "id": "uuid",
    "codigoTicket": "ABC123DEF456",
    "codigoQR": "data:image/png;base64,...",
    "status": "ATIVO",
    "compradorNome": "João Silva",
    "evento": {
      "titulo": "Jogo Final - Campeonato",
      "dataHoraInicio": "2025-11-25T18:00:00Z",
      "local": "Estádio Nacional"
    },
    "lote": {
      "nome": "Arquibancada VIP"
    }
  }
]
```

### Notificação ao Usuário (Backend)

Quando pagamento for confirmado (status `PAID`), backend deve:

**Via SMS**:
```
✅ Pagamento confirmado!

Seu bilhete está pronto:
https://arenaticket.gdse.ao/bilhete/{pedidoId}

ArenaTicket
```

**Via Email**:
```html
<h2>🎉 Pagamento Confirmado!</h2>
<p>Seu bilhete para <strong>{eventoTitulo}</strong> está pronto.</p>
<a href="https://arenaticket.gdse.ao/bilhete/{pedidoId}">
  Ver Meu Bilhete
</a>
<p>Apresente o QR Code na entrada do evento.</p>
```

## 📱 Responsividade

### Mobile
- QR Code reduzido para 180px
- Botões empilhados verticalmente
- Layout otimizado para telas pequenas
- Touch-friendly (botões grandes)

### Desktop
- QR Code 220px
- Botões lado a lado
- Layout centralizado (max-width 600px)
- Hover states nos botões

## 🎨 Design

### Estrutura Visual
```
┌─────────────────────────────────┐
│        ✅ Seu Bilhete           │
│   Apresente na entrada          │
├─────────────────────────────────┤
│                                 │
│  Evento: Final Campeonato       │
│  [Badge Status: Ativo]          │
│                                 │
│       ┌─────────────┐           │
│       │  QR CODE    │           │
│       │   220x220   │           │
│       └─────────────┘           │
│   Escaneie na entrada           │
│                                 │
│  Código: ABC1-23DE-F456         │
│  [📋 Copiar]                    │
│                                 │
│  👤 Titular: João Silva         │
│  📅 Data: 25/11/2025 18:00      │
│  📍 Local: Estádio Nacional     │
│  🎟️ Lote: Arquibancada VIP     │
│                                 │
│  [⬇️ Baixar] [📤 Compartilhar] │
│                                 │
│  ℹ️ Guarde este link!           │
└─────────────────────────────────┘
```

### Cores de Status
- **ATIVO**: Verde (`success`)
- **USADO**: Azul (`info`)
- **CANCELADO**: Vermelho (`danger`)
- **EXPIRADO**: Amarelo (`warning`)

## 🔐 Segurança

### Considerações
- ⚠️ **Link público**: Qualquer pessoa com o link pode visualizar o bilhete
- ✅ Validação deve ser feita no **momento da entrada** via QR Code
- 🔒 Backend deve validar status do bilhete (ATIVO/USADO)
- 📱 Recomendado: Implementar rate limiting no endpoint

### Boas Práticas
1. Não incluir informações sensíveis no link
2. Usar UUIDs aleatórios (não sequenciais)
3. Invalidar links de bilhetes cancelados
4. Registrar acessos ao bilhete (audit log)

## 🚀 Deploy

Disponível em produção:
- **URL Base**: https://arenaticket.gdse.ao
- **Rota**: `/bilhete/:id`
- **Build**: `index-CYHivw2z.js` (156.68 KB)
- **CSS**: `index-KdxiuFeA.css` (46.98 KB)

## 📊 Analytics (Recomendado)

Eventos para rastrear:
- `bilhete_visualizado` - Usuário abriu link
- `bilhete_baixado` - Download da imagem
- `bilhete_compartilhado` - Compartilhamento via WhatsApp
- `codigo_copiado` - Código copiado para clipboard
- `bilhete_nao_encontrado` - Link inválido acessado

## 🐛 Troubleshooting

### Bilhete não aparece
1. Verificar se pedido existe no backend
2. Confirmar que status é `PAID`
3. Verificar se bilhetes foram gerados
4. Checar logs do backend

### QR Code não carrega
1. Verificar formato do QR (base64 data URI)
2. CORS do backend permitindo imagens
3. Tamanho da imagem (recomendado < 100KB)

### Compartilhamento não funciona
1. Web Share API requer HTTPS
2. Testar em mobile (melhor suporte)
3. Fallback funciona em todos navegadores

## 📝 TODO Futuro

- [ ] Adicionar múltiplos bilhetes por pedido (carousel)
- [ ] Opção de adicionar à Wallet (Apple/Google)
- [ ] Histórico de acessos ao bilhete
- [ ] QR Code dinâmico com refresh
- [ ] Preview do evento com countdown
- [ ] Integração com calendário (add to calendar)
