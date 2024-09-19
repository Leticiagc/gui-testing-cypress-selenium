describe('exchange rates', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('create a new exchange rate between USD and EUR', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');
    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').type('8');
    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has been created
    cy.get('body').should('contain', 'Exchange rate has been successfully created.');
  });

  //filter 
  it('should filter exchange rates by Euro', () => {
    // Clicar em "Exchange rates"
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Selecionar "Euro" no campo de moeda
    cy.get('select[name="criteria[currency]"]').select('Euro');
    // Clicar no botão "Filter"
    cy.get('button[type="submit"]').contains('Filter').click();
    // Verificar se o resultado contém apenas "Euro"
    cy.get('.item td').should('any.contain', 'Euro');
  });

  //Clear Filter
  it('should clear the filter for exchange rates', () => {
    // Clicar em "Exchange rates"
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Selecionar "Euro" no campo de moeda
    cy.get('select[name="criteria[currency]"]').select('Euro');
    // Clicar no botão "Filter"
    cy.get('button[type="submit"]').contains('Filter').click();
    // Clicar no botão "Clear filters"
    cy.get('a').contains('Clear filters').click();
    // Verificar se o corpo da página contém "All"
    cy.get('body').should('contain', 'All');
  });

  //Voltar para dashboard
  it('should return to the dashboard when clicking on administration', () => {
    // Clicar em "Exchange rates"
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Clicar no botão "Create"
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Selecionar "US Dollar" no campo "Source currency"
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');
    // Preencher o campo "Ratio" com um valor positivo (exemplo: 10)
    cy.get('#sylius_exchange_rate_ratio').type('10');
    // Clicar no botão para retornar à seção (Dashboard)
    cy.get('.section').eq(0).click();
    // Verificar se o redirecionamento ocorreu
    cy.url().should('include', '/admin');
    // Verificar se o corpo da página contém o texto "Dashboard"
    cy.get('body').should('contain', 'Dashboard');

  });

  //Ratio Negativo
  it('should not allow negative ratio', () => {
    // Clicar em "Exchange rates"
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Clicar no botão "Create"
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Selecionar "US Dollar" no campo "Source currency"
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');
    // Preencher o campo "Ratio" com um valor negativo (exemplo: -5)
    cy.get('#sylius_exchange_rate_ratio').type('-5');
    // Clicar no botão "Create"
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();
    // Verificar se o erro foi mostrado
    cy.get('body').should('contain', 'The ratio must be greater than 0.');
  });

  //Ratio Vazio
  it('should not allow empty ratio', () => {
    // Clicar em "Exchange rates"
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Clicar no botão "Create"
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Selecionar "US Dollar" no campo "Source currency"
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');
    // Clicar no botão "Create"
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();
    // Verificar se o erro foi mostrado
    cy.get('body').should('contain', 'Please enter exchange rate ratio.');
  });

  // Source Currency moedas iguais
  it('should not allow equal currency', () => {
    // Clicar em "Exchange rates"
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Clicar no botão "Create"
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Preencher o campo "Ratio" com 5
    cy.get('#sylius_exchange_rate_ratio').type('5');
    // Clicar no botão "Create"
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();
    // Verificar se o erro foi mostrado
    cy.get('body').should('contain', 'The source and target currencies must differ.');
  });

  //Tentar criar e depois cancelar
  it('cancel creating a new exchange rate after filling fields', () => {
    // Clicar em "Exchange rates"
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Clicar no botão "Create"
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Selecionar "US Dollar" no campo "Source currency"
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');
    // Preencher o campo "Ratio"
    cy.get('#sylius_exchange_rate_ratio').type('5');

    // Localiza e clica no botão de cancelar
    cy.get('.ui.button').contains('Cancel').click();

    // Verifica se voltou para a lista de taxas de câmbio
    cy.get('a').contains('Exchange rates').should('exist');

    // Verifica se a nova taxa de câmbio não está presente na lista
    cy.get('body').should('not.contain', 'US Dollar to Euro');

  });

  //Editar Ratio
  it('should edit the ratio of an exchange rate', () => {
    // Clicar em "Exchange rates"
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Clicar no botão "Edit" de uma taxa de câmbio
    cy.get('tbody tr').first().find('a').contains('Edit').click();
    // Editar o campo "Ratio" com um novo valor
    cy.get('#sylius_exchange_rate_ratio').clear().type('8');
    // Clicar no botão "Save"
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();
    // Verificar se a alteração foi salva com sucesso
    cy.get('body').should('contain', 'Exchange rate has been successfully updated.');
  });

  // Editar Ratio inválido
  it('should not edit negative ratio', () => {
    // Clicar em "Exchange rates"
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Clicar no botão "Edit" de uma taxa de câmbio
    cy.get('tbody tr').first().find('a').contains('Edit').click();
   // Limpar o campo de razão e inserir um valor inválido
   cy.get('#sylius_exchange_rate_ratio').clear().type('-5');

   // Clicar no botão "Salvar"
   cy.get('.ui.labeled.icon.primary.button').click();

   // Verificar se a página contém a mensagem de erro
   cy.get('body').should('contain', 'The ratio must be greater than 0.');
  });
});
