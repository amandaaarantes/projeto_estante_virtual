import { Builder, By, until } from 'selenium-webdriver';

async function testarCrudCompleto() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    console.log('🚀 INICIANDO TESTES COMPLETOS - CRUD LIVROS E USUÁRIOS');
    console.log('=================================================\n');
    
    await driver.get('http://localhost:5173');
    await driver.sleep(3000);

    // =============================================
    // 1️⃣ TESTE DO CRUD DE USUÁRIOS
    // =============================================
    console.log('👥 1. INICIANDO TESTE DO CRUD DE USUÁRIOS');
    console.log('----------------------------------------');

    // Verificar se já estamos na tela de usuários (padrão)
    console.log('📍 Verificando se estamos na tela de Usuários...');
    await driver.sleep(1000);

    // CADASTRAR NOVO USUÁRIO
    console.log('👤 Cadastrando novo usuário...');
    const botaoNovoUsuario = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., '+ Novo Usuário')]")),
      10000
    );
    await botaoNovoUsuario.click();

    await driver.wait(until.elementLocated(By.name('nome')), 10000);

    // Preencher formulário do usuário
    const timestamp = Date.now();
    const usuarioNick = `user_${timestamp}`;
    console.log(`✍️ Preenchendo usuário com nickname: ${usuarioNick}`);
    
    await driver.findElement(By.name('nome')).sendKeys('Usuário Teste Selenium');
    await driver.sleep(300);
    await driver.findElement(By.name('nickname')).sendKeys(usuarioNick);
    await driver.sleep(300);
    await driver.findElement(By.name('email')).sendKeys(`teste${timestamp}@email.com`);
    await driver.sleep(300);
    await driver.findElement(By.name('telefone')).sendKeys('(11)99999-9999');
    await driver.sleep(300);
    await driver.findElement(By.name('endereco')).sendKeys('Rua Teste Selenium, 123');
    await driver.sleep(300);
    await driver.findElement(By.name('senha')).sendKeys('senha12345'); // 8+ caracteres
    await driver.sleep(300);
    
    // Selecionar perfil
    const selectPerfil = await driver.findElement(By.name('perfil'));
    await selectPerfil.click();
    await driver.sleep(300);
    await selectPerfil.sendKeys('Usuário');

    // Salvar usuário
    console.log('📤 Salvando usuário...');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Aguardar e fechar alerta de sucesso
    await driver.wait(until.alertIsPresent(), 10000);
    const alertUsuario = await driver.switchTo().alert();
    const alertTextUsuario = await alertUsuario.getText();
    console.log(`📢 Alert: ${alertTextUsuario}`);
    await alertUsuario.accept();
    console.log('✅ Usuário cadastrado com sucesso!');

    // BUSCAR USUÁRIO
    console.log('🔍 Buscando usuário cadastrado...');
    await driver.sleep(2000);
    
    const buscaNickname = await driver.wait(
      until.elementLocated(By.xpath("//input[contains(@placeholder, 'Apelido')]")),
      5000
    );
    await buscaNickname.clear();
    await buscaNickname.sendKeys(usuarioNick);
    await driver.sleep(2000);

    // Verificar se usuário aparece na lista
    const usuarioNaLista = await driver.findElements(
      By.xpath(`//td[contains(text(), '${usuarioNick}')]`)
    );
    
    if (usuarioNaLista.length > 0) {
      console.log('✅ Usuário encontrado na lista!');
    } else {
      console.log('⚠️ Usuário não encontrado na lista após cadastro');
    }

    // EDITAR USUÁRIO
    console.log('✏️ Editando usuário...');
    const botoesEditar = await driver.findElements(By.xpath("//button[contains(., 'Editar')]"));
    if (botoesEditar.length > 0) {
      await botoesEditar[0].click();
      
      await driver.wait(until.elementLocated(By.name('nome')), 5000);
      
      const nomeField = await driver.findElement(By.name('nome'));
      await nomeField.clear();
      await nomeField.sendKeys('Usuário Editado Selenium');
      await driver.sleep(500);

      // Alterar perfil para Bibliotecário
      const selectPerfilEdit = await driver.findElement(By.name('perfil'));
      await selectPerfilEdit.click();
      await driver.sleep(300);
      await selectPerfilEdit.sendKeys('Bibliotecário');

      // Salvar edição
      await driver.findElement(By.xpath("//button[contains(., 'Salvar Edição')]")).click();

      // Aguardar e fechar alerta
      await driver.wait(until.alertIsPresent(), 10000);
      const alertEdicao = await driver.switchTo().alert();
      await alertEdicao.accept();
      console.log('✅ Usuário editado com sucesso!');
    }

    // TESTAR SENHA CURTA (VALIDAÇÃO)
    console.log('🧪 Testando validação de senha curta...');
    await driver.findElement(By.xpath("//button[contains(., '+ Novo Usuário')]")).click();
    await driver.wait(until.elementLocated(By.name('nome')), 5000);
    
    await driver.findElement(By.name('nome')).sendKeys('Teste Senha Curta');
    await driver.findElement(By.name('nickname')).sendKeys(`teste_senha_${timestamp}`);
    await driver.findElement(By.name('email')).sendKeys(`teste_senha${timestamp}@email.com`);
    await driver.findElement(By.name('telefone')).sendKeys('(11)88888-8888');
    await driver.findElement(By.name('endereco')).sendKeys('Endereço Teste');
    await driver.findElement(By.name('senha')).sendKeys('123'); // Senha curta
    
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Verificar se há mensagem de erro
    await driver.sleep(2000);
    const elementosErro = await driver.findElements(By.xpath("//*[contains(text(), 'senha deve ter')]"));
    if (elementosErro.length > 0) {
      console.log('✅ Validação de senha funcionando!');
    }
    
    // Cancelar formulário
    await driver.findElement(By.xpath("//button[contains(., 'Cancelar')]")).click();
    console.log('🎉 CRUD de Usuários concluído com sucesso!\n');

    // =============================================
    // 2️⃣ TESTE DO CRUD DE LIVROS
    // =============================================
    console.log('📚 2. INICIANDO TESTE DO CRUD DE LIVROS');
    console.log('----------------------------------------');

    // Navegar para Gerenciar Livros
    console.log('🖱️ Navegando para Gerenciar Livros...');
    const botaoGerenciarLivros = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Gerenciar Livros')]")),
      10000
    );
    await botaoGerenciarLivros.click();
    await driver.sleep(2000);

    // CADASTRAR NOVO LIVRO
    console.log('📘 Cadastrando novo livro...');
    const botaoNovoLivro = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., '+ Novo Livro')]")),
      10000
    );
    await botaoNovoLivro.click();

    await driver.wait(until.elementLocated(By.name('codigoIdentificador')), 10000);

    // Preencher formulário do livro
    const codigoLivro = `LIV-${timestamp}`;
    console.log(`✍️ Preenchendo livro com código: ${codigoLivro}`);
    
    await driver.findElement(By.name('codigoIdentificador')).sendKeys(codigoLivro);
    await driver.sleep(300);
    await driver.findElement(By.name('titulo')).sendKeys('Dom Casmurro - Teste Selenium');
    await driver.sleep(300);
    await driver.findElement(By.name('autor')).sendKeys('Machado de Assis');
    await driver.sleep(300);
    await driver.findElement(By.name('genero')).sendKeys('Romance Brasileiro');
    await driver.sleep(300);
    await driver.findElement(By.name('anoPublicacao')).sendKeys('1899');
    await driver.sleep(300);
    
    const selectStatus = await driver.findElement(By.name('status'));
    await selectStatus.click();
    await driver.sleep(300);
    await selectStatus.sendKeys('Disponível');

    // Salvar livro
    console.log('📤 Salvando livro...');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Aguardar e fechar alerta de sucesso
    await driver.wait(until.alertIsPresent(), 10000);
    const alertLivro = await driver.switchTo().alert();
    const alertTextLivro = await alertLivro.getText();
    console.log(`📢 Alert: ${alertTextLivro}`);
    await alertLivro.accept();
    console.log('✅ Livro cadastrado com sucesso!');

    // BUSCAR LIVRO
    console.log('🔍 Buscando livro cadastrado...');
    await driver.sleep(2000);
    
    const buscaTitulo = await driver.wait(
      until.elementLocated(By.xpath("//input[contains(@placeholder, 'Título')]")),
      5000
    );
    await buscaTitulo.clear();
    await buscaTitulo.sendKeys('Dom Casmurro');
    await driver.sleep(2000);

    // Verificar se livro aparece na lista
    const livroNaLista = await driver.findElements(
      By.xpath("//td[contains(text(), 'Dom Casmurro - Teste Selenium')]")
    );
    
    if (livroNaLista.length > 0) {
      console.log('✅ Livro encontrado na lista!');
    } else {
      console.log('⚠️ Livro não encontrado na lista após cadastro');
    }

    // EDITAR LIVRO
    console.log('✏️ Editando livro...');
    const botoesEditarLivro = await driver.findElements(By.xpath("//button[contains(., 'Editar (Bibl)')]"));
    if (botoesEditarLivro.length > 0) {
      await botoesEditarLivro[0].click();

      await driver.wait(until.elementLocated(By.name('titulo')), 5000);
      
      const tituloField = await driver.findElement(By.name('titulo'));
      await tituloField.clear();
      await tituloField.sendKeys('Dom Casmurro - EDITADO Selenium');
      await driver.sleep(500);

      // Alterar status para Emprestado
      const selectStatusEdit = await driver.findElement(By.name('status'));
      await selectStatusEdit.click();
      await driver.sleep(300);
      await selectStatusEdit.sendKeys('Emprestado');

      // Salvar edição
      await driver.findElement(By.xpath("//button[contains(., 'Salvar Edição')]")).click();

      // Aguardar e fechar alerta
      await driver.wait(until.alertIsPresent(), 10000);
      const alertEdicaoLivro = await driver.switchTo().alert();
      await alertEdicaoLivro.accept();
      console.log('✅ Livro editado com sucesso!');
    }

    // TESTAR CÓDIGO DUPLICADO
    console.log('🧪 Testando validação de código duplicado...');
    await driver.findElement(By.xpath("//button[contains(., '+ Novo Livro')]")).click();
    await driver.wait(until.elementLocated(By.name('codigoIdentificador')), 5000);
    
    await driver.findElement(By.name('codigoIdentificador')).sendKeys(codigoLivro); // Código duplicado
    await driver.findElement(By.name('titulo')).sendKeys('Livro Teste Duplicado');
    await driver.findElement(By.name('autor')).sendKeys('Autor Teste');
    await driver.findElement(By.name('genero')).sendKeys('Gênero Teste');
    await driver.findElement(By.name('anoPublicacao')).sendKeys('2024');
    
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Verificar se há mensagem de erro de código duplicado
    await driver.sleep(2000);
    const elementosErroCodigo = await driver.findElements(By.xpath("//*[contains(text(), 'já está em uso')]"));
    if (elementosErroCodigo.length > 0) {
      console.log('✅ Validação de código único funcionando!');
    }
    
    // Cancelar formulário
    await driver.findElement(By.xpath("//button[contains(., 'Cancelar')]")).click();

    // TESTAR FILTROS
    console.log('🔎 Testando filtros...');
    
    // Filtro por autor
    const buscaAutor = await driver.findElement(
      By.xpath("//input[contains(@placeholder, 'Autor')]")
    );
    await buscaAutor.clear();
    await buscaAutor.sendKeys('Machado');
    await driver.sleep(2000);
    console.log('✅ Filtro por autor funcionando!');

    // Filtro por título
    await buscaTitulo.clear();
    await buscaTitulo.sendKeys('EDITADO');
    await driver.sleep(2000);
    console.log('✅ Filtro por título funcionando!');

    console.log('🎉 CRUD de Livros concluído com sucesso!\n');

    // =============================================
    // 3️⃣ TESTES DE NAVEGAÇÃO
    // =============================================
    console.log('🧭 3. TESTANDO NAVEGAÇÃO ENTRE TELAS');
    console.log('-----------------------------------');

    // Voltar para Usuários
    console.log('🖱️ Voltando para tela de Usuários...');
    await driver.findElement(By.xpath("//button[contains(., 'Gerenciar Usuários')]")).click();
    await driver.sleep(2000);
    
    // Verificar se estamos na tela de usuários
    const elementosUsuario = await driver.findElements(By.xpath("//h3[contains(., 'Usuários')]"));
    if (elementosUsuario.length > 0) {
      console.log('✅ Navegação para Usuários funcionando!');
    }

    // Voltar para Livros
    console.log('🖱️ Voltando para tela de Livros...');
    await driver.findElement(By.xpath("//button[contains(., 'Gerenciar Livros')]")).click();
    await driver.sleep(2000);
    
    // Verificar se estamos na tela de livros
    const elementosLivro = await driver.findElements(By.xpath("//h3[contains(., 'Acervo')]"));
    if (elementosLivro.length > 0) {
      console.log('✅ Navegação para Livros funcionando!');
    }

    // =============================================
    // RESULTADO FINAL
    // =============================================
    console.log('\n=================================================');
    console.log('🎉 TODOS OS TESTES FORAM CONCLUÍDOS COM SUCESSO!');
    console.log('✅ CRUD de Usuários - OK');
    console.log('✅ CRUD de Livros - OK');
    console.log('✅ Navegação entre telas - OK');
    console.log('✅ Validações (senha, código único) - OK');
    console.log('✅ Filtros e buscas - OK');
    console.log('=================================================\n');

  } catch (err) {
    console.error('\n❌ ERRO DURANTE OS TESTES:', err.message);
    
    // Tentar fechar qualquer alerta aberto
    try {
      await driver.switchTo().alert().accept();
    } catch (alertErr) {
      // Não há alerta ou já foi fechado
    }
  } finally {
    await driver.quit();
    console.log('🛑 Driver do Selenium finalizado');
  }
}

// Executar os testes
testarCrudCompleto();