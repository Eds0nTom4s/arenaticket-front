# Especificação — TicketCard (ArenaTicket UI)

## Descrição
Componente visual que representa um bilhete de evento. Usado em listagens e na Home.

## Estrutura Visual
- Banner do evento no topo (imagem ou gradiente azul)
- Badge de status ("Disponível", "Esgotado", "Últimos lugares")
- Nome do evento (título)
- Data do evento
- Preço do lote principal
- Botão “Comprar Bilhete”

## Estados Visuais
- Disponível: badge verde
- Esgotado: badge vermelho
- Últimos lugares: badge amarelo
- Hover: borda neon azul suave (`--animation-glow`)
- Foco: outline visível

## Regras de Layout
- Card com raio `--radius-card` e sombra `--shadow-card`
- Fundo branco ou bege claro
- Texto sempre legível (contraste testado WCAG AA)
- Espaçamentos conforme tokens

## Interação
- Hover: efeito glow azul
- Click: abre CheckoutModal
- Acessível por teclado (tabIndex, aria-label)

## Observações
- Nenhum dado real nesta etapa, apenas simulação visual
- Imagem/banner pode ser placeholder se não houver