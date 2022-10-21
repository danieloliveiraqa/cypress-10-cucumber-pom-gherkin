import LoginPage from "../pages/LoginPage";


class LoginUtils{
    
    typeUsername(username){
        LoginPage.usernameInput().type(username);
    }
    typePassword(password){
        LoginPage.passwordInput().type(password);
    }
    typeButton(){
        LoginPage.loginButton().click();
    }
}

export default new LoginUtils();

