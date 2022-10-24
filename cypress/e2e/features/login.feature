Feature: Logando no site
    Feature Login page will work depending on the user credentials.

@CT-01
  Scenario: Verificar sucesso ao logar no site
    Given que um usuario abre o demoQA
    When usuario digitar seu nome de usuario "daniels"
    When usuario digitar sua senha "@OkOkOK123"
    Then ele clica no botao login

@CT-02
  Scenario: Verificar sucesso ao logar no site
    Given que um usuario abre o demoQA
    When usuario digitar seu nome de usuario "daniels"
    When usuario digitar sua senha "@OkOkOK123"
    Then ele clica no botao login    
