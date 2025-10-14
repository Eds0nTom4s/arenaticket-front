# 🎫 ArenaTicket - Documentação de Integração Frontend

**Versão da API:** v1  
**Base URL:** `http://localhost:8080/api/v1`  
**Ambiente de Produção:** `https://api.arenaticket.gdse.ao/api/v1`  
**Data:** 13/10/2025

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints Públicos](#endpoints-públicos)
4. [Endpoints Protegidos](#endpoints-protegidos)
5. [Modelos de Dados](#modelos-de-dados)
6. [Fluxos de Integração](#fluxos-de-integração)
7. [Códigos de Erro](#códigos-de-erro)
8. [Exemplos de Integração](#exemplos-de-integração)

---

## 🌐 Visão Geral

### Arquitetura da API
- **Protocolo:** REST/HTTP
- **Formato:** JSON
- **Charset:** UTF-8
- **Timezone:** Africa/Luanda (WAT - UTC+1)

### Headers Obrigatórios
```http
Content-Type: application/json
Accept: application/json
```

### Headers para Endpoints Protegidos
```http
Authorization: Bearer {token}
```

---

## 🔐 Autenticação

### Login (Administradores/Operadores)

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "uuid-do-usuario",
    "username": "admin",
    "nome": "Administrador",
    "role": "ADMIN"
  }
}
```

### Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request:**
```json
{
  "refreshToken": "refresh-token-uuid"
}
```

---

## 🌍 Endpoints Públicos

### 1. Listar Eventos Disponíveis

**Endpoint:** `GET /public/eventos`

**Query Parameters:**
- `abertoParaVenda` (optional, boolean): Filtrar apenas eventos abertos
- `page` (optional, int, default=0): Número da página
- `size` (optional, int, default=20): Tamanho da página

**Request:**
```http
GET /api/v1/public/eventos?abertoParaVenda=true&page=0&size=10
```

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "titulo": "GDSE vs Kabuscorp",
    "descricao": "Jogo da 5ª jornada do Girabola 2025",
    "local": "Estádio dos Diamantes",
    "dataInicio": "2025-10-18T16:00:00+01:00",
    "dataFim": "2025-10-18T18:00:00+01:00",
    "bannerUrl": "https://cdn.arenaticket.ao/banners/gdse-vs-kabuscorp.jpg",
    "abertoParaVenda": true,
    "createdAt": "2025-10-13T10:30:00+01:00"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "titulo": "GDSE vs Petro de Luanda",
    "descricao": "Clássico da Zona Norte",
    "local": "Estádio dos Diamantes",
    "dataInicio": "2025-10-28T16:00:00+01:00",
    "dataFim": "2025-10-28T18:00:00+01:00",
    "bannerUrl": "https://cdn.arenaticket.ao/banners/gdse-vs-petro.jpg",
    "abertoParaVenda": true,
    "createdAt": "2025-10-13T10:30:00+01:00"
  }
]
```

---

### 2. Detalhes de um Evento

**Endpoint:** `GET /public/eventos/{eventoId}`

**Request:**
```http
GET /api/v1/public/eventos/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "GDSE vs Kabuscorp",
  "descricao": "Jogo da 5ª jornada do Girabola 2025",
  "local": "Estádio dos Diamantes",
  "dataInicio": "2025-10-18T16:00:00+01:00",
  "dataFim": "2025-10-18T18:00:00+01:00",
  "bannerUrl": "https://cdn.arenaticket.ao/banners/gdse-vs-kabuscorp.jpg",
  "abertoParaVenda": true,
  "lotes": [
    {
      "id": "lote-uuid-1",
      "nome": "Arquibancada",
      "preco": 1500.00,
      "quantidadeTotal": 300,
      "quantidadeDisponivel": 285,
      "inicioVenda": "2025-10-13T00:00:00+01:00",
      "fimVenda": "2025-10-18T14:00:00+01:00"
    },
    {
      "id": "lote-uuid-2",
      "nome": "Central",
      "preco": 3000.00,
      "quantidadeTotal": 150,
      "quantidadeDisponivel": 142,
      "inicioVenda": "2025-10-13T00:00:00+01:00",
      "fimVenda": "2025-10-18T14:00:00+01:00"
    },
    {
      "id": "lote-uuid-3",
      "nome": "Camarote VIP",
      "preco": 7000.00,
      "quantidadeTotal": 50,
      "quantidadeDisponivel": 48,
      "inicioVenda": "2025-10-13T00:00:00+01:00",
      "fimVenda": "2025-10-18T14:00:00+01:00"
    }
  ],
  "createdAt": "2025-10-13T10:30:00+01:00"
}
```

---

### 3. Verificar Disponibilidade de Lote

**Endpoint:** `GET /public/lotes/{loteId}/disponibilidade`

**Request:**
```http
GET /api/v1/public/lotes/lote-uuid-1/disponibilidade?quantidade=5
```

**Response (200 OK):**
```json
{
  "loteId": "lote-uuid-1",
  "disponivel": true,
  "quantidadeDisponivel": 285,
  "quantidadeSolicitada": 5,
  "preco": 1500.00,
  "total": 7500.00
}
```

**Response (200 OK) - Indisponível:**
```json
{
  "loteId": "lote-uuid-1",
  "disponivel": false,
  "quantidadeDisponivel": 2,
  "quantidadeSolicitada": 5,
  "mensagem": "Quantidade solicitada excede a disponibilidade"
}
```

---

### 4. Iniciar Checkout (Criar Pedido)

**Endpoint:** `POST /public/checkout`

**Request:**
```json
{
  "eventoId": "550e8400-e29b-41d4-a716-446655440000",
  "loteId": "lote-uuid-1",
  "quantidade": 2,
  "compradorNome": "João Manuel Silva",
  "compradorTelefone": "923456789",
  "compradorEmail": "joao.silva@email.com",
  "metodoPagamento": "GPO",
  "numeroSocio": "GDSE-20250001"
}
```

**Validações:**
- `compradorNome`: 3-100 caracteres
- `compradorTelefone`: formato `9XXXXXXXX` (9 dígitos começando com 9)
- `compradorEmail`: opcional, formato válido
- `metodoPagamento`: `GPO` ou `REFERENCIA`
- `quantidade`: mínimo 1, máximo depende da disponibilidade
- `numeroSocio`: opcional, formato `GDSE-XXXXXXXX`

**Response (201 Created):**
```json
{
  "pedidoId": "pedido-uuid-123",
  "clientRequestId": "ARENATICKET-20251013-001",
  "status": "PENDING",
  "total": 3000.00,
  "pagamento": {
    "provider": "APPYPAY",
    "paymentId": "APPY-20251013-001",
    "metodoPagamento": "GPO",
    "referencia": "REF-123456789",
    "entidade": "12345",
    "status": "PENDING",
    "deepLink": "gpo://payment?ref=REF-123456789&amount=3000.00",
    "qrCode": "data:image/png;base64,iVBORw0KG..."
  },
  "expiresAt": "2025-10-13T15:45:00+01:00",
  "createdAt": "2025-10-13T15:30:00+01:00"
}
```

**Códigos de Status:**
- `201 Created` - Pedido criado com sucesso
- `400 Bad Request` - Dados inválidos
- `409 Conflict` - Lote sem disponibilidade

---

### 5. Consultar Status do Pedido

**Endpoint:** `GET /public/pedidos/{pedidoId}`

**Request:**
```http
GET /api/v1/public/pedidos/pedido-uuid-123
```

**Response (200 OK) - Pedido Pendente:**
```json
{
  "pedidoId": "pedido-uuid-123",
  "status": "PENDING",
  "total": 3000.00,
  "pagamento": {
    "status": "PENDING",
    "metodoPagamento": "GPO",
    "referencia": "REF-123456789",
    "deepLink": "gpo://payment?ref=REF-123456789&amount=3000.00"
  },
  "expiresAt": "2025-10-13T15:45:00+01:00",
  "createdAt": "2025-10-13T15:30:00+01:00"
}
```

**Response (200 OK) - Pedido Pago:**
```json
{
  "pedidoId": "pedido-uuid-123",
  "status": "PAID",
  "total": 3000.00,
  "pagamento": {
    "status": "PAID",
    "metodoPagamento": "GPO",
    "referencia": "REF-123456789",
    "paidAt": "2025-10-13T15:35:00+01:00"
  },
  "bilhetes": [
    {
      "id": "bilhete-uuid-1",
      "codigoTicket": "GDSE-1234 5678 9012",
      "codigoQR": "data:image/png;base64,iVBORw0KG...",
      "evento": "GDSE vs Kabuscorp",
      "lote": "Arquibancada",
      "status": "VALID"
    },
    {
      "id": "bilhete-uuid-2",
      "codigoTicket": "GDSE-9876 5432 1098",
      "codigoQR": "data:image/png;base64,iVBORw0KG...",
      "evento": "GDSE vs Kabuscorp",
      "lote": "Arquibancada",
      "status": "VALID"
    }
  ],
  "createdAt": "2025-10-13T15:30:00+01:00",
  "paidAt": "2025-10-13T15:35:00+01:00"
}
```

---

### 6. Validar Bilhete (QR Code)

**Endpoint:** `POST /public/validar`

**Request:**
```json
{
  "codigoTicket": "GDSE-1234 5678 9012"
}
```

**Response (200 OK) - Bilhete Válido:**
```json
{
  "valido": true,
  "bilhete": {
    "id": "bilhete-uuid-1",
    "codigoTicket": "GDSE-1234 5678 9012",
    "status": "VALID",
    "evento": {
      "titulo": "GDSE vs Kabuscorp",
      "local": "Estádio dos Diamantes",
      "dataInicio": "2025-10-18T16:00:00+01:00"
    },
    "lote": "Arquibancada",
    "compradorNome": "João Manuel Silva",
    "vendidoEm": "2025-10-13T15:35:00+01:00"
  },
  "mensagem": "Bilhete válido e ativo"
}
```

**Response (200 OK) - Bilhete Já Usado:**
```json
{
  "valido": false,
  "bilhete": {
    "id": "bilhete-uuid-1",
    "codigoTicket": "GDSE-1234 5678 9012",
    "status": "USED",
    "utilizadoEm": "2025-10-18T15:30:00+01:00"
  },
  "mensagem": "Bilhete já foi utilizado"
}
```

**Response (404 Not Found):**
```json
{
  "timestamp": "2025-10-13T15:40:00+01:00",
  "status": 404,
  "error": "Not Found",
  "message": "Bilhete não encontrado",
  "path": "/api/v1/public/validar"
}
```

---

### 7. Health Check

**Endpoint:** `GET /public/health`

**Request:**
```http
GET /api/v1/public/health
```

**Response (200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2025-10-13T15:40:00+01:00",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## 🔒 Endpoints Protegidos (Administração)

### 1. Criar Evento

**Endpoint:** `POST /admin/eventos`  
**Autenticação:** Bearer Token (ADMIN)

**Request:**
```json
{
  "titulo": "GDSE vs 1º de Agosto",
  "descricao": "Final do Campeonato Nacional",
  "local": "Estádio 11 de Novembro",
  "dataInicio": "2025-11-15T16:00:00+01:00",
  "dataFim": "2025-11-15T18:00:00+01:00",
  "bannerUrl": "https://cdn.arenaticket.ao/banners/final.jpg",
  "abertoParaVenda": true
}
```

**Response (201 Created):**
```json
{
  "id": "novo-evento-uuid",
  "titulo": "GDSE vs 1º de Agosto",
  "descricao": "Final do Campeonato Nacional",
  "local": "Estádio 11 de Novembro",
  "dataInicio": "2025-11-15T16:00:00+01:00",
  "dataFim": "2025-11-15T18:00:00+01:00",
  "bannerUrl": "https://cdn.arenaticket.ao/banners/final.jpg",
  "abertoParaVenda": true,
  "createdAt": "2025-10-13T15:45:00+01:00"
}
```

---

### 2. Criar Lote de Bilhetes

**Endpoint:** `POST /admin/eventos/{eventoId}/lotes`  
**Autenticação:** Bearer Token (ADMIN)

**Request:**
```json
{
  "nome": "Tribuna Especial",
  "preco": 5000.00,
  "quantidadeTotal": 200,
  "inicioVenda": "2025-10-15T00:00:00+01:00",
  "fimVenda": "2025-11-15T14:00:00+01:00"
}
```

**Response (201 Created):**
```json
{
  "id": "novo-lote-uuid",
  "eventoId": "novo-evento-uuid",
  "nome": "Tribuna Especial",
  "preco": 5000.00,
  "quantidadeTotal": 200,
  "quantidadeReservada": 0,
  "quantidadeVendida": 0,
  "quantidadeDisponivel": 200,
  "inicioVenda": "2025-10-15T00:00:00+01:00",
  "fimVenda": "2025-11-15T14:00:00+01:00",
  "createdAt": "2025-10-13T15:50:00+01:00"
}
```

---

### 3. Listar Todos os Pedidos

**Endpoint:** `GET /admin/pedidos`  
**Autenticação:** Bearer Token (ADMIN, OPERATOR)

**Query Parameters:**
- `status` (optional): PENDING, PAID, CANCELLED, EXPIRED
- `dataInicio` (optional): ISO 8601 date
- `dataFim` (optional): ISO 8601 date
- `page` (optional, default=0)
- `size` (optional, default=20)

**Request:**
```http
GET /api/v1/admin/pedidos?status=PAID&page=0&size=10
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "pedidoId": "pedido-uuid-123",
      "clientRequestId": "ARENATICKET-20251013-001",
      "status": "PAID",
      "total": 3000.00,
      "compradorNome": "João Manuel Silva",
      "compradorTelefone": "923456789",
      "evento": "GDSE vs Kabuscorp",
      "quantidade": 2,
      "createdAt": "2025-10-13T15:30:00+01:00",
      "paidAt": "2025-10-13T15:35:00+01:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 1,
  "totalPages": 1
}
```

---

### 4. Relatório de Vendas

**Endpoint:** `GET /admin/relatorios/vendas`  
**Autenticação:** Bearer Token (ADMIN)

**Query Parameters:**
- `eventoId` (optional): UUID do evento
- `dataInicio` (required): ISO 8601 date
- `dataFim` (required): ISO 8601 date

**Request:**
```http
GET /api/v1/admin/relatorios/vendas?eventoId=550e8400-e29b-41d4-a716-446655440000&dataInicio=2025-10-01&dataFim=2025-10-31
```

**Response (200 OK):**
```json
{
  "periodo": {
    "inicio": "2025-10-01T00:00:00+01:00",
    "fim": "2025-10-31T23:59:59+01:00"
  },
  "evento": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "titulo": "GDSE vs Kabuscorp"
  },
  "resumo": {
    "totalPedidos": 145,
    "pedidosPagos": 138,
    "pedidosPendentes": 5,
    "pedidosCancelados": 2,
    "totalBilhetes": 276,
    "receitaTotal": 414000.00,
    "receitaPorMetodo": {
      "GPO": 372600.00,
      "REFERENCIA": 41400.00
    }
  },
  "porLote": [
    {
      "loteId": "lote-uuid-1",
      "nome": "Arquibancada",
      "quantidadeVendida": 180,
      "receita": 270000.00
    },
    {
      "loteId": "lote-uuid-2",
      "nome": "Central",
      "quantidadeVendida": 76,
      "receita": 228000.00
    },
    {
      "loteId": "lote-uuid-3",
      "nome": "Camarote VIP",
      "quantidadeVendida": 20,
      "receita": 140000.00
    }
  ],
  "geradoEm": "2025-10-13T16:00:00+01:00"
}
```

---

### 5. Marcar Bilhete como Usado (Validação na Porta)

**Endpoint:** `POST /admin/bilhetes/{bilheteId}/usar`  
**Autenticação:** Bearer Token (OPERATOR)

**Request:**
```json
{
  "operadorId": "operador-uuid-1",
  "localizacao": "Portão A"
}
```

**Response (200 OK):**
```json
{
  "bilheteId": "bilhete-uuid-1",
  "codigoTicket": "GDSE-1234 5678 9012",
  "status": "USED",
  "utilizadoEm": "2025-10-18T15:30:00+01:00",
  "operador": "João Operador",
  "localizacao": "Portão A"
}
```

---

## 📊 Modelos de Dados

### Evento
```typescript
interface Evento {
  id: string; // UUID
  titulo: string;
  descricao: string;
  local: string;
  dataInicio: string; // ISO 8601
  dataFim: string; // ISO 8601
  bannerUrl?: string;
  abertoParaVenda: boolean;
  createdAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}
```

### Lote de Bilhete
```typescript
interface LoteBilhete {
  id: string; // UUID
  eventoId: string; // UUID
  nome: string;
  preco: number; // Kwanzas (Kz)
  quantidadeTotal: number;
  quantidadeReservada: number;
  quantidadeVendida: number;
  quantidadeDisponivel: number; // calculado
  inicioVenda: string; // ISO 8601
  fimVenda: string; // ISO 8601
  createdAt: string; // ISO 8601
}
```

### Pedido
```typescript
interface Pedido {
  id: string; // UUID
  clientRequestId: string; // Identificador único do cliente
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  total: number; // Kwanzas (Kz)
  compradorNome: string;
  compradorTelefone: string;
  compradorEmail?: string;
  numeroSocio?: string; // GDSE-XXXXXXXX
  createdAt: string; // ISO 8601
  paidAt?: string; // ISO 8601
  expiresAt: string; // ISO 8601
}
```

### Pagamento
```typescript
interface Pagamento {
  id: string; // UUID
  pedidoId: string; // UUID
  provider: 'APPYPAY';
  paymentId: string;
  metodoPagamento: 'GPO' | 'REFERENCIA';
  referencia: string;
  entidade?: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  deepLink?: string;
  qrCode?: string; // Base64
  createdAt: string; // ISO 8601
  paidAt?: string; // ISO 8601
}
```

### Bilhete
```typescript
interface Bilhete {
  id: string; // UUID
  pedidoId: string; // UUID
  eventoId: string; // UUID
  loteId: string; // UUID
  codigoTicket: string; // GDSE-XXXX XXXX XXXX
  codigoTicketCompact: string; // GDSEXXXXXXXXXXXX
  codigoQR: string; // Base64 image
  compradorNome: string;
  compradorTelefone: string;
  status: 'VALID' | 'USED' | 'CANCELLED' | 'EXPIRED';
  vendidoEm: string; // ISO 8601
  utilizadoEm?: string; // ISO 8601
  createdAt: string; // ISO 8601
}
```

---

## 🔄 Fluxos de Integração

### Fluxo 1: Compra de Bilhetes (Frontend Web/Mobile)

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. GET /public/eventos
       ▼
┌─────────────┐
│  Lista de   │
│   Eventos   │
└──────┬──────┘
       │
       │ 2. GET /public/eventos/{id}
       ▼
┌─────────────┐
│  Detalhes   │
│  + Lotes    │
└──────┬──────┘
       │
       │ 3. POST /public/checkout
       ▼
┌─────────────┐
│   Pedido    │
│  PENDING    │
└──────┬──────┘
       │
       │ 4. Redirecionar para GPO/Referência
       ▼
┌─────────────┐
│ Pagamento   │
│  Externo    │
└──────┬──────┘
       │
       │ 5. Webhook (backend recebe notificação)
       ▼
┌─────────────┐
│   Pedido    │
│    PAID     │
└──────┬──────┘
       │
       │ 6. GET /public/pedidos/{id}
       ▼
┌─────────────┐
│  Bilhetes   │
│  Gerados    │
└─────────────┘
```

### Fluxo 2: Polling de Status (Alternativa ao Webhook)

```javascript
// Frontend: Verificar status do pedido a cada 5 segundos
const checkPaymentStatus = async (pedidoId) => {
  const maxAttempts = 60; // 5 minutos
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;
    
    const response = await fetch(`/api/v1/public/pedidos/${pedidoId}`);
    const pedido = await response.json();

    if (pedido.status === 'PAID') {
      clearInterval(interval);
      // Mostrar bilhetes ao usuário
      showTickets(pedido.bilhetes);
    } else if (pedido.status === 'CANCELLED' || pedido.status === 'EXPIRED') {
      clearInterval(interval);
      // Informar falha
      showError('Pagamento não completado');
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      showError('Timeout ao verificar pagamento');
    }
  }, 5000);
};
```

### Fluxo 3: Validação de Bilhete (Portaria)

```
┌─────────────┐
│  Operador   │
└──────┬──────┘
       │
       │ 1. Escanear QR Code do bilhete
       ▼
┌─────────────┐
│  Extrair    │
│   Código    │
└──────┬──────┘
       │
       │ 2. POST /public/validar
       ▼
┌─────────────┐
│  Verificar  │
│   Status    │
└──────┬──────┘
       │
       ├─── VALID ───▶ ┌─────────────┐
       │               │   Permitir  │
       │               │   Entrada   │
       │               └─────────────┘
       │
       ├─── USED ────▶ ┌─────────────┐
       │               │   Rejeitar  │
       │               │  (Já usado) │
       │               └─────────────┘
       │
       └─── NOT FOUND ▶ ┌─────────────┐
                        │   Rejeitar  │
                        │ (Inválido)  │
                        └─────────────┘
```

---

## ⚠️ Códigos de Erro

### Erros Comuns

| Código | Mensagem | Descrição |
|--------|----------|-----------|
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Token de autenticação ausente ou inválido |
| 403 | Forbidden | Sem permissão para acessar o recurso |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: lote sem disponibilidade) |
| 422 | Unprocessable Entity | Erro de validação de negócio |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Erro interno do servidor |

### Formato de Resposta de Erro

```json
{
  "timestamp": "2025-10-13T16:00:00+01:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Dados inválidos",
  "errors": {
    "compradorNome": "O nome deve ter entre 3 e 100 caracteres",
    "compradorTelefone": "Formato de telefone inválido",
    "quantidade": "A quantidade mínima é 1"
  },
  "path": "/api/v1/public/checkout"
}
```

---

## 💻 Exemplos de Integração

### React/Next.js

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = {
  // Listar eventos
  async getEventos() {
    const response = await fetch(`${API_BASE_URL}/public/eventos?abertoParaVenda=true`);
    if (!response.ok) throw new Error('Erro ao buscar eventos');
    return response.json();
  },

  // Detalhes do evento
  async getEvento(eventoId: string) {
    const response = await fetch(`${API_BASE_URL}/public/eventos/${eventoId}`);
    if (!response.ok) throw new Error('Erro ao buscar evento');
    return response.json();
  },

  // Criar pedido
  async criarPedido(data: CheckoutData) {
    const response = await fetch(`${API_BASE_URL}/public/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  },

  // Consultar pedido
  async getPedido(pedidoId: string) {
    const response = await fetch(`${API_BASE_URL}/public/pedidos/${pedidoId}`);
    if (!response.ok) throw new Error('Erro ao buscar pedido');
    return response.json();
  },

  // Validar bilhete
  async validarBilhete(codigoTicket: string) {
    const response = await fetch(`${API_BASE_URL}/public/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigoTicket }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  },
};

// Exemplo de componente
export function CheckoutForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pedido = await api.criarPedido({
        eventoId: '550e8400-e29b-41d4-a716-446655440000',
        loteId: 'lote-uuid-1',
        quantidade: 2,
        compradorNome: 'João Manuel Silva',
        compradorTelefone: '923456789',
        metodoPagamento: 'GPO',
      });

      // Redirecionar para página de pagamento
      window.location.href = pedido.pagamento.deepLink;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      <button type="submit" disabled={loading}>
        {loading ? 'Processando...' : 'Finalizar Compra'}
      </button>
    </form>
  );
}
```

### Angular

```typescript
// services/arena-ticket.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArenaTicketService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/public/eventos?abertoParaVenda=true`);
  }

  getEvento(eventoId: string): Observable<EventoDetalhes> {
    return this.http.get<EventoDetalhes>(`${this.apiUrl}/public/eventos/${eventoId}`);
  }

  criarPedido(data: CheckoutData): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/public/checkout`, data);
  }

  getPedido(pedidoId: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/public/pedidos/${pedidoId}`);
  }

  validarBilhete(codigoTicket: string): Observable<ValidacaoResponse> {
    return this.http.post<ValidacaoResponse>(`${this.apiUrl}/public/validar`, { codigoTicket });
  }
}

// component.ts
export class CheckoutComponent implements OnInit {
  constructor(private arenaTicketService: ArenaTicketService) {}

  finalizarCompra(dados: CheckoutData) {
    this.arenaTicketService.criarPedido(dados).subscribe({
      next: (pedido) => {
        // Redirecionar para pagamento
        window.location.href = pedido.pagamento.deepLink;
      },
      error: (error) => {
        console.error('Erro ao criar pedido:', error);
      }
    });
  }
}
```

### Vue.js/Nuxt

```typescript
// composables/useArenaTicket.ts
export const useArenaTicket = () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;

  const getEventos = async () => {
    const { data } = await useFetch(`${apiUrl}/public/eventos`, {
      query: { abertoParaVenda: true }
    });
    return data.value;
  };

  const getEvento = async (eventoId: string) => {
    const { data } = await useFetch(`${apiUrl}/public/eventos/${eventoId}`);
    return data.value;
  };

  const criarPedido = async (dados: CheckoutData) => {
    const { data, error } = await useFetch(`${apiUrl}/public/checkout`, {
      method: 'POST',
      body: dados
    });

    if (error.value) {
      throw new Error(error.value.message);
    }

    return data.value;
  };

  const getPedido = async (pedidoId: string) => {
    const { data } = await useFetch(`${apiUrl}/public/pedidos/${pedidoId}`);
    return data.value;
  };

  return {
    getEventos,
    getEvento,
    criarPedido,
    getPedido
  };
};

// pages/checkout.vue
<script setup>
const { criarPedido } = useArenaTicket();
const loading = ref(false);

const finalizarCompra = async () => {
  loading.value = true;
  try {
    const pedido = await criarPedido({
      eventoId: '550e8400-e29b-41d4-a716-446655440000',
      loteId: 'lote-uuid-1',
      quantidade: 2,
      compradorNome: 'João Manuel Silva',
      compradorTelefone: '923456789',
      metodoPagamento: 'GPO',
    });

    // Redirecionar para pagamento
    window.location.href = pedido.pagamento.deepLink;
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    loading.value = false;
  }
};
</script>
```

### React Native (Mobile)

```typescript
// services/ArenaTicketAPI.ts
import axios from 'axios';

const API_BASE_URL = 'https://api.arenaticket.gdse.ao/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ArenaTicketAPI = {
  async getEventos() {
    const response = await api.get('/public/eventos', {
      params: { abertoParaVenda: true }
    });
    return response.data;
  },

  async getEvento(eventoId: string) {
    const response = await api.get(`/public/eventos/${eventoId}`);
    return response.data;
  },

  async criarPedido(data: CheckoutData) {
    const response = await api.post('/public/checkout', data);
    return response.data;
  },

  async getPedido(pedidoId: string) {
    const response = await api.get(`/public/pedidos/${pedidoId}`);
    return response.data;
  },

  async validarBilhete(codigoTicket: string) {
    const response = await api.post('/public/validar', { codigoTicket });
    return response.data;
  },
};

// screens/CheckoutScreen.tsx
import React, { useState } from 'react';
import { View, Button, Alert, Linking } from 'react-native';
import { ArenaTicketAPI } from '../services/ArenaTicketAPI';

export const CheckoutScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const pedido = await ArenaTicketAPI.criarPedido({
        eventoId: '550e8400-e29b-41d4-a716-446655440000',
        loteId: 'lote-uuid-1',
        quantidade: 2,
        compradorNome: 'João Manuel Silva',
        compradorTelefone: '923456789',
        metodoPagamento: 'GPO',
      });

      // Abrir deeplink do GPO
      await Linking.openURL(pedido.pagamento.deepLink);

      // Navegar para tela de acompanhamento
      navigation.navigate('OrderTracking', { pedidoId: pedido.pedidoId });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar o pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Button 
        title={loading ? 'Processando...' : 'Finalizar Compra'} 
        onPress={handleCheckout}
        disabled={loading}
      />
    </View>
  );
};
```

---

## 🔗 Recursos Adicionais

### Swagger/OpenAPI
- **Documentação Interativa:** `http://localhost:8080/swagger-ui/index.html`
- **Especificação OpenAPI:** `http://localhost:8080/v3/api-docs`

### Postman Collection
Importe a collection do Postman com todos os endpoints configurados:
```
https://api.arenaticket.gdse.ao/postman/collection.json
```

### Webhooks (Para Integrações Backend)
Se você precisar receber notificações de pagamento no seu backend:

**Endpoint:** Configurável no painel admin  
**Método:** POST  
**Headers:** `X-Webhook-Signature` (para validação)

**Payload:**
```json
{
  "event": "payment.completed",
  "pedidoId": "pedido-uuid-123",
  "status": "PAID",
  "timestamp": "2025-10-13T15:35:00+01:00"
}
```

---

## 📞 Suporte

- **Email:** dev@arenaticket.gdse.ao
- **Documentação:** https://docs.arenaticket.gdse.ao
- **Status da API:** https://status.arenaticket.gdse.ao

---

**Desenvolvido para:** GDSE - Grémio Desportivo Sagrada Esperança  
**Versão:** 1.0.0  
**Última Atualização:** 13/10/2025
