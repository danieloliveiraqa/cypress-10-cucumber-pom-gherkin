class Login{

    usernameInput() {
        return cy.get('#userName')
    }  
    passwordInput() {
        return cy.get('#password')
    }  
    loginButton() {
        return cy.get('#login')
    }  
}

export default new Login();