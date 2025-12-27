# ArenaTicket - Frontend

Este é o projeto frontend para a plataforma ArenaTicket, construído com Vue 3, Vite e TypeScript.

## Como Executar

1.  **Instalar dependências:**
    ```bash
    npm install
    ```

2.  **Executar em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor de desenvolvimento estará disponível em `http://localhost:5174`.

## Como Testar o Fluxo de Checkout Manualmente

Para garantir que o novo fluxo de checkout (wizard) está funcionando corretamente, siga estes passos:

1.  **Iniciar a Aplicação:**
    Execute `npm run dev` e abra o navegador em `http://localhost:5174`.

2.  **Abrir o Wizard de Checkout:**
    Na página inicial, clique no botão **"Ver Lotes / Comprar"** em qualquer um dos eventos disponíveis.

3.  **Etapa 1: Seleção de Lote**
    - Verifique se o loader aparece enquanto os lotes são carregados.
    - Selecione um dos lotes disponíveis. O botão "Continuar" deve ser habilitado.
    - Clique em "Continuar" ou pressione a tecla `→` para avançar.

4.  **Etapa 2: Seleção de Quantidade**
    - Altere a quantidade de bilhetes usando os botões `+` e `-`.
    - Verifique se o subtotal é atualizado dinamicamente.
    - Tente selecionar uma quantidade maior que a disponível (se aplicável) e verifique se o limite é respeitado.
    - Clique em "Continuar" ou pressione `→`.

5.  **Etapa 3: Dados e Pagamento**
    - Preencha o nome completo.
    - Insira um número de telefone válido no formato angolano (ex: 923123456). O botão "Continuar" só será habilitado com um número válido.
    - Selecione um método de pagamento.
    - Clique em "Continuar" ou pressione `→`.

6.  **Etapa 4: Confirmação**
    - Clique no botão **"Confirmar Pagamento"**.
    - Um loader de "processando" deve aparecer.
    - Após a simulação, a tela de sucesso com o QR Code e o código do bilhete deve ser exibida.

7.  **Ações Finais e Navegação**
    - Teste os botões de "Download", "WhatsApp" e "SMS" na tela de sucesso.
    - Teste o botão "Copiar" para o código do bilhete.
    - Clique em "Comprar outro bilhete" para fechar o modal e resetar o estado.
    - Em qualquer etapa, use o botão "Voltar" ou a tecla `←` para navegar para a etapa anterior.
    - Pressione a tecla `ESC` para fechar o modal a qualquer momento.

## Deploy

Este projeto é um site estático hospedado no Amazon S3 e distribuído via CloudFront. Para efetuar deploy manual, siga os passos abaixo.

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **AWS CLI** instalado e configurado com credenciais de acesso ao bucket S3 e CloudFront
- Acesso aos seguintes recursos AWS:
  - Bucket S3: `arenaticket-gdse-prod-1763422384`
  - CloudFront Distribution ID: `ER43YNOBKJ82H`

### Passos para Deploy

1.  **Configurar Variáveis de Ambiente:**
    - Edite o arquivo `.env.production` com as variáveis necessárias (ex: `VITE_API_BASE_URL=https://api.arenaticket.gdse.ao/api/v1/public`).

2.  **Instalar Dependências (se necessário):**
    ```bash
    npm install
    ```

3.  **Build para Produção:**
    ```bash
    npm run build
    ```
    Os arquivos otimizados serão gerados na pasta `dist/`.

4.  **Sincronizar com S3:**
    ```bash
    aws s3 sync dist/ s3://arenaticket-gdse-prod-1763422384 --delete
    ```
    Isso faz upload dos novos arquivos e remove os antigos.

5.  **Invalidar Cache do CloudFront:**
    ```bash
    aws cloudfront create-invalidation --distribution-id ER43YNOBKJ82H --paths "/*"
    ```
    Aguarde alguns minutos para que a invalidação seja processada e o site seja atualizado globalmente.

### Endereços e Informações

- **Site Produção:** [www.arenaticket.ao](https://www.arenaticket.ao)
- **API Base:** `https://api.arenaticket.gdse.ao/api/v1/public`
- **Bucket S3:** `arenaticket-gdse-prod-1763422384`
- **CloudFront Distribution ID:** `ER43YNOBKJ82H`
- **Região AWS:** `us-east-1` (ou conforme configurado no AWS CLI)

### Notas Adicionais

- O deploy é totalmente estático; não há instâncias EC2 ou servidores backend gerenciados aqui.
- Para deploys automáticos, considere configurar um pipeline CI/CD (ex: GitHub Actions) com as credenciais AWS.
- Sempre teste localmente (`npm run dev`) antes do deploy para evitar erros em produção.
