import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

import loginUtils from "../../utils/loginUtils";

Given("que um usuario abre o demoQA", () => {
  cy.visit("https://demoqa.com/login")
})

When("usuario digitar seu nome de usuario {string}", (username) => {
  loginUtils.typeUsername(username);
});

When("usuario digitar sua senha {string}", (password) => {
  loginUtils.typePassword(password);
});

Then("ele clica no botao login", () => {
  loginUtils.typeButton();
});

