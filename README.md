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
