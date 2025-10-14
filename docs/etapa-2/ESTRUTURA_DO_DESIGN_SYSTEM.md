# Estrutura do Design System — ArenaTicket UI

## Nome do Design System
ArenaTicket UI

## Princípios Visuais
- Clareza
- Foco
- Fluidez
- Confiança

## Hierarquia de Camadas
1. **Tokens globais**
   - Cores
   - Tipografia
   - Espaçamentos
   - Sombras
   - Animações
2. **Componentes atômicos**
   - Botões (AtButton)
   - Campos de texto (AtInput)
   - Ícones (AtIcon)
3. **Componentes moleculares**
   - Cards (AtCard)
   - Modais (AtModal)
   - Badges (AtBadge)
   - Toasts/Notificações (AtToast)

## Política de Nomes
- Todos os componentes devem ser prefixados com `At` (ex: AtButton, AtCard).
- Tokens e variáveis seguem padrão kebab-case com prefixo `--` para CSS (ex: --color-primary).

## Observações
- Consistência visual e acessibilidade são obrigatórias.
- Nenhum componente será implementado antes da validação desta documentação.