# Tokens e Estilos Iniciais — ArenaTicket

## Implementação dos Tokens

Os tokens de design serão implementados como variáveis CSS customizadas.

- **Arquivo:** `src/styles/tokens.css`
- **Exportação:** As variáveis serão exportadas globalmente e importadas nos arquivos de estilos principais.

## Tokens Definidos
- Cores principais e de acento
- Espaçamentos (xs, sm, md, lg)
- Border radius (`--radius-card`)
- Sombra card (`--shadow-card`)
- Transição padrão (`--transition`)

## Exemplo de declaração (não implementar ainda)
```css
:root {
  --color-primary: #0066FF;
  --color-primary-dark: #001B33;
  --color-secondary: #F9F7F4;
  --color-white: #FFFFFF;
  --color-gray: #DFE3E6;
  --color-accent: #2DD4BF;
  --radius-card: 16px;
  --shadow-card: 0 2px 16px 0 rgba(0,102,255,0.12);
  --transition: 0.22s ease;
  /* Espaçamentos */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;
}
```

## Observações
- O arquivo `tokens.css` será importado em `src/styles/`.
- Não implementar código até aprovação do PO.