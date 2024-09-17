const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('groups', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:9990/admin');
    // await driver.get('http://150.165.75.99:9990/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  // Remove .only and implement others test cases!
  it('update the name of Wholesale group', async () => {
    // Click in groups in side menu
    await driver.findElement(By.linkText('Groups')).click();

    // Type in value input to search for specify group
    await driver.findElement(By.id('criteria_search_value')).sendKeys('wholesale');

    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    // Click in edit of the last group
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();

    // Edit group name
    const inputName = await driver.findElement(By.id('sylius_customer_group_name'));
    inputName.click();
    inputName.clear();
    inputName.sendKeys('Wholesale 100');

    // Click on Save changes button
    await driver.findElement(By.id('sylius_save_changes_button')).click();

    // Assert that group has been updated
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Customer group has been successfully updated.'));
  });

  it('Should attempt to delete a customer group in use and verify error message', async () => {
    // 1. Clicar em "Groups" no menu lateral
    await driver.findElement(By.linkText('Groups')).click();
  
    // 2. Digitar o nome do grupo "Wholesale 100" no campo de busca para filtrar os grupos de clientes
    await driver.findElement(By.id('criteria_search_value')).sendKeys('Wholesale 100');
  
    // 3. Clicar no botão "Filter" para aplicar o filtro
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
  
    // 4. Clicar no botão "Delete" do grupo listado
    const deleteButtons = await driver.findElements(By.css('*[class^="ui red labeled icon button"]'));
    await deleteButtons[deleteButtons.length - 1].click();
  
    // 5. Confirmar a exclusão do grupo clicando no botão "Yes"
    await driver.findElement(By.id('confirmation-button')).click(); // Seleciona o botão com ID confirmation-button
  
    // Assert: Verificar se a mensagem de erro correta aparece
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Cannot delete, the Customer group is in use'));
  });

  it('Should select two customer groups, click delete and confirm the deletion', async () => {
    // 1. Clicar em "Groups" no menu lateral
    await driver.findElement(By.linkText('Groups')).click();
  
    // 2. Selecionar as checkboxes dos grupos "retail" e "wholesale"
    const checkboxes = await driver.findElements(By.css('input[type="checkbox"]'));
    await checkboxes[0].click(); // Seleciona a checkbox do grupo "retail"
  
    // 3. Clicar no botão "Delete" com o atributo `data-bulk-action-requires-confirmation`
    await driver.findElement(By.css('button[data-bulk-action-requires-confirmation]')).click();
  
    // // 4. Confirmar a exclusão clicando no botão "Yes" com o ID "confirmation-button"
    await driver.findElement(By.id('confirmation-button')).click();
  
    // // 5. Verificar se a mensagem de erro correta aparece
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Cannot delete, the Customer group is in use'));
  
    // // 6. Verificar se os grupos ainda estão presentes na tabela após a tentativa de deleção
    const tableText = await driver.findElement(By.tagName('table')).getText();
    assert(tableText.includes('retail'));
    assert(tableText.includes('Wholesale 100'));
  });

  // Implement the remaining test cases in a similar manner
});
