# Componentes Atômicos — ArenaTicket UI

## 1. AtButton
- **Variantes:**
  - Primary: fundo azul (--color-primary), texto branco, sombra leve, hover com glow
  - Secondary: fundo claro, borda azul, texto azul
  - Ghost: sem fundo, apenas texto, sublinhado ao hover
- **Estados:** normal, hover, focus, disabled, loading
- **Tamanhos:** sm, md, lg
- **Acessibilidade:** foco visível, aria-label obrigatório se ícone puro
- **Transição:** suave, usar token de animação

## 2. AtInput
- **Variantes:** padrão, com ícone à esquerda, erro, sucesso
- **Estados:** normal, focus (borda azul), erro (borda vermelha)
- **Placeholder:** cor neutra clara
- **Label:** sempre visível acima do campo

## 3. AtBadge
- **Usos:** “Disponível”, “Esgotado”, “Últimos lugares”
- **Cores:**
  - Disponível: --color-success
  - Esgotado: --color-error
  - Últimos lugares: --color-warning
- **Formato:** pílula, bordas arredondadas, fonte pequena

## 4. AtCard
- **Estrutura:**
  - Imagem/banner superior (16:9)
  - Título, subtítulo, preço, botão/CTA
- **Visual:**
  - Fundo branco ou bege claro
  - Borda azul neon (--animation-glow no hover)
  - Sombra sutil (--shadow-card)
  - Transição suave em hover (elevação + brilho)

## 5. AtModal
- **Estrutura:**
  - Overlay semitransparente
  - Container centralizado com raio e sombra
  - Header com título e botão fechar
  - Área de conteúdo e rodapé (botões)
- **Comportamento:**
  - Abrir/fechar com animação --animation-fade
  - Fechar com ESC ou clique fora
  - Trap focus

## 6. AtToast
- **Tipos:** sucesso, erro, aviso, info
- **Ícone:** correspondente ao tipo
- **Duração:** 3 a 5 segundos
- **Animação:** entrada com slide + fade

## 7. AtIcon
- **Suporte:** ícones SVG centralizados
- **Tamanhos:** sm, md, lg
- **Cores:** herdam do contexto

## Observações
- Nenhum dado real nesta etapa.
- Todos os componentes devem ser minimalistas, acessíveis e neutros.