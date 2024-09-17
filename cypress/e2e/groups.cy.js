describe('groups', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('update the name of Wholesale group', () => {
    // Click in groups in side menu
    cy.clickInFirst('a[href="/admin/customer-groups/"]');
    // Type in value input to search for specify group
    cy.get('[id="criteria_search_value"]').type('wholesale');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last group
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit group name
    cy.get('[id="sylius_customer_group_name"]').scrollIntoView().clear().type('Wholesale 100');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that group has been updated
    cy.get('body').should('contain', 'Customer group has been successfully updated.');
  });


  it('Should attempt to delete a customer group in use and verify error message', () => {
    // 1. Clicar em "Groups" no menu lateral
    cy.clickInFirst('a[href="/admin/customer-groups/"]');

    // 2. Digitar o nome do grupo "Wholesale 100" no campo de busca para filtrar os grupos de clientes
    cy.get('[id="criteria_search_value"]').type('Wholesale 100');
    
    // 3. Clicar no botão "Filter" para aplicar o filtro
    cy.get('*[class^="ui blue labeled icon button"]').click();
    
    // 4. Clicar no botão "Delete" do grupo listado
    cy.get('*[class^="ui red labeled icon button"]').last().click();
    
    // 5. Confirmar a exclusão do grupo ao clicar no botão "Yes" usando o seletor correto
    cy.get('#confirmation-button').click(); // Seleciona o botão com ID confirmation-button

    // Assert: Verificar se a mensagem de erro correta aparece
    cy.get('body').should('contain', 'Cannot delete, the Customer group is in use');
  });

  it('Should select two customer groups, click delete and confirm the deletion', () => {
    // 1. Clicar em "Groups" no menu lateral
    cy.clickInFirst('a[href="/admin/customer-groups/"]');
  
    // 2. Selecionar as checkboxes dos grupos "retail" e "wholesale"
    cy.get('input[type="checkbox"]').eq(0).check(); // Seleciona a checkbox do grupo "retail"
  
    // 3. Clicar no botão "Delete" com o atributo `data-bulk-action-requires-confirmation`
    cy.get('button[data-bulk-action-requires-confirmation]').first().click();

    cy.get('#confirmation-button').click();
  
    // 4. Verificar a mensagem de erro (se relevante)
    cy.get('body').should('contain', 'Cannot delete, the Customer group is in use');
    
    // Assert: Verificar que os grupos ainda existem na tabela após não confirmar a exclusão
    cy.get('table').should('contain', 'retail');
    cy.get('table').should('contain', 'Wholesale 100');
  });

  
  it('Should create a new customer group called Group 1 with error code', () => {
    // 1. Clicar em "Groups" no menu lateral
    cy.clickInFirst('a[href="/admin/customer-groups/"]');
    
    // 2. Clicar no botão "Create" para adicionar um novo grupo de clientes
    cy.get('a[href="/admin/customer-groups/new"]').click();
    
    // 3. Preencher os inputs "Code" e "Name" com "Group 1"
    cy.get('[id="sylius_customer_group_code"]').clear().type('Group 1');
    cy.get('[id="sylius_customer_group_name"]').clear().type('Group 1');

    cy.get('button.ui.labeled.icon.primary.button').click();

    cy.get('body').should('contain', 'This form contains errors.');
    cy.get('body').should('contain', 'Customer group code can only be comprised of letters, numbers, dashes and underscores.');
  });


  it('Should create a new customer group called Group 1 duplicated code', () => {
    // 1. Clicar em "Groups" no menu lateral
    cy.clickInFirst('a[href="/admin/customer-groups/"]');
    
    // 2. Clicar no botão "Create" para adicionar um novo grupo de clientes
    cy.get('a[href="/admin/customer-groups/new"]').click();
    
    // 3. Preencher os inputs "Code" e "Name" com "Group 1"
    cy.get('[id="sylius_customer_group_code"]').clear().type('retail');
    cy.get('[id="sylius_customer_group_name"]').clear().type('Group 1');

    cy.get('button.ui.labeled.icon.primary.button').click();

    cy.get('body').should('contain', 'This form contains errors.');
    cy.get('body').should('contain', 'Customer group code has to be unique.');
  });

});
