# Layout Base e Página Principal — ArenaTicket

## Layout Base
- **Cabeçalho minimalista:**
  - Logo ArenaTicket (neutro, sem referência a clubes)
  - Botão de menu (hamburger)
- **Área principal:**
  - Grid responsivo de cards de eventos
    - 1 coluna (mobile)
    - 2 colunas (tablet)
    - 3 colunas (desktop)
- **Footer:**
  - Simples, com nome do produto e versão

## Página Home (Funcional)
- Ao abrir, lista automaticamente os eventos disponíveis (GET `/public/eventos`)
- Cada evento é apresentado por um TicketCard minimalista:
  - Banner do evento (placeholder se não houver)
  - Título
  - Data
  - Preço do lote principal (ou "ver lotes")
- **Comportamento:**
  - Clicar no card abre um modal de checkout rápido (não navega para nova rota)

## Placeholders de Conteúdo
- Banners: usar imagem neutra se não houver
- Textos de ajuda: "Selecione um evento para comprar seu bilhete rapidamente."

## Observações
- Não implementar código até aprovação deste documento.
- Todos os ativos visuais devem ser neutros.