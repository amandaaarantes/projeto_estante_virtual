// Importa as ferramentas de teste "globais" do Vitest
import { describe, it, expect, beforeAll, afterAll } from '@vitest/globals';

// Importa as ferramentas do Selenium
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

// Importa o driver do Chrome (necessário para o 'selenium-webdriver' encontrá-lo)
import 'chromedriver';

// --- Início do Bloco de Teste ---
describe('Test CRUD Usuário', () => {

    let driver: WebDriver;
    
    // ❗️ MUDE AQUI para a URL do seu site (o que aparece no 'npm run dev')
    const baseUrl = 'http://localhost:5173'; 
    const testUserEmail = 'teste.selenium@evento.com';

    // 1. "setUp" (Configuração)
    beforeAll(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options()) 
            .build();
            
        await driver.manage().timeouts().implicitlyWait(10000); 
        await driver.manage().window().maximize();
    }, 30000); 

    // 2. "tearDown" (Limpeza)
    afterAll(async () => {
        await driver.quit(); // Fecha o navegador
    }, 30000);

    // 3. O Método de Teste
    it('deve realizar o CRUD completo do usuário', async () => {
        
        // 1. Login como Administrador
        await driver.get(baseUrl + "/login"); // ❗️ Altere a rota se necessário
        
        // ❗️❗️ SELETORES REAIS DO SEU SITE DEVEM ENTRAR AQUI ❗️❗️
        await driver.findElement(By.id('email')).sendKeys('admin@evento.com');
        await driver.findElement(By.id('senha')).sendKeys('Senha123');
        await driver.findElement(By.id('btn-login')).click(); 

        await driver.wait(until.urlContains('/dashboard'), 10000); // ❗️ Altere a rota

        // ----------------------------------------------------------------------
        // C - CREATE (Inserir Usuário)
        console.log('-> Testando CREATE (Inserir Usuário)');
        await driver.get(baseUrl + "/usuarios/novo"); // ❗️ Altere a rota

        // ❗️❗️ Substitua TODOS os IDs pelos IDs REAIS do seu formulário
        await driver.findElement(By.id('nomeCompleto')).sendKeys('Usuário Teste Selenium');
        await driver.findElement(By.id('email')).sendKeys(testUserEmail);
        await driver.findElement(By.id('senha')).sendKeys('Teste@123');
        await driver.findElement(By.id('cpfCnpj')).sendKeys('11122233344');
        
        await driver.findElement(By.xpath("//select[@id='perfil']/option[text()='Participante']")).click();
        
        await driver.findElement(By.id('btn-salvar-usuario')).click(); // ❗️ Altere o ID

        // Verifica o sucesso
        await driver.wait(until.urlContains('/usuarios'), 10000); // ❗️ Altere a rota
        const pageSourceCreate = await driver.getPageSource();
        
        expect(pageSourceCreate).toContain('Usuário cadastrado com sucesso'); // ❗️ Altere a mensagem

        // ----------------------------------------------------------------------
        // R - READ (Consultar Usuário)
        console.log('-> Testando READ (Consultar Usuário)');
        await driver.get(baseUrl + "/usuarios"); // ❗️ Altere a rota
        
        await driver.findElement(By.id('filtro-email')).sendKeys(testUserEmail); // ❗️ Altere o ID
        await driver.findElement(By.id('btn-filtrar')).click(); // ❗️ Altere o ID

        // CORREÇÃO AQUI: (f"..." removido, não havia variável)
        const userInTable = await driver.wait(
            until.elementLocated(By.xpath("//td[contains(text(), 'Usuário Teste Selenium')]")),
            10000
        );
        expect(userInTable).toBeDefined(); 

        // ----------------------------------------------------------------------
        // U - UPDATE (Editar Usuário)
        console.log('-> Testando UPDATE (Editar Usuário)');
        
        // CORREÇÃO AQUI: (f"..." trocado por crases `...${}...`)
        const editButton = await driver.findElement(By.xpath(`//td[contains(text(), '${testUserEmail}')]/../td/a[contains(text(), 'Editar')]`));
        await editButton.click();

        await driver.wait(until.urlContains('/usuarios/editar/'), 10000); // ❗️ Altere a rota

        const novoNome = 'Usuário Teste Editado';
        const nomeField = await driver.findElement(By.id('nomeCompleto')); // ❗️ Altere o ID
        await nomeField.clear();
        await nomeField.sendKeys(novoNome);

        await driver.findElement(By.id('btn-salvar-usuario')).click(); // ❗️ Altere o ID
        
        await driver.wait(until.urlContains('/usuarios'), 10000); // ❗️ Altere a rota
        const pageSourceUpdate = await driver.getPageSource();
        expect(pageSourceUpdate).toContain('Usuário alterado com sucesso'); // ❗️ Altere a mensagem

        // ----------------------------------------------------------------------
        // D - DELETE (Remover Usuário)
        console.log('-> Testando DELETE (Remover Usuário)');
        
        // CORREÇÃO AQUI: (f"..." trocado por crases `...${}...`)
        const deleteButton = await driver.findElement(By.xpath(`//td[contains(text(), '${testUserEmail}')]/../td/button[contains(text(), 'Remover')]`));
        await deleteButton.click();
        
        // Se houver pop-up de confirmação (alert)
        // await driver.switchTo().alert().accept();

        await driver.wait(
            until.stalenessOf(userInTable) // Espera o elemento 'userInTable' sumir
        );
        
        const pageSourceDelete = await driver.getPageSource();
        expect(pageSourceDelete).not.toContain(novoNome);
        
        console.log('-> CRUD Usuário Completo: SUCESSO');

    }, 60000); // Timeout total para este teste: 60 segundos
});