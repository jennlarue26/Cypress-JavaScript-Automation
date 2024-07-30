/// <reference types="cypress" />

import { onLoginPage } from "../support/page_objects/loginPage"

const errorBoxLocator = '[data-test="error"]';
const userNameLocator = '#user-name';
const loginButtonLocator = '#login-button';
const passwordLocator = '#password';

describe('Testing login', () => {

    beforeEach(() => {
        //login
        cy.openLoginPage();
        cy.contains('Swag Labs').should('exist');
        
        cy.fixture('testData').as('testData')
    });

    //Happy Path
    it('should log user in', () => {
        cy.get('@testData').then( testData => {
            cy.get(userNameLocator).type(testData.users.standardUser)
            cy.get(passwordLocator).type(testData.passwords.password);
            cy.get(loginButtonLocator).click()

            //Verify URL Path after login
            cy.location(testData.url.pathName)
                .should('eq', testData.url.urlPath)
        });

        cy.logout();
    });

    //Negative test scenarios
    it('should not allow a user to login without a username', () => {
        cy.get('@testData').then( testData => {
            cy.get(passwordLocator).type(testData.passwords.password);
            cy.get(loginButtonLocator).click()

            onLoginPage.getErrors(errorBoxLocator)
                .invoke('text').should('contain', testData.errors.usernameRequiredErrorMessage);
        });
    });

    it('should not allow a user to login without a password', () => {
        cy.get('@testData').then( testData => {
            cy.get(userNameLocator).type(testData.users.standardUser);
            cy.get(loginButtonLocator).click()

            onLoginPage.getErrors(errorBoxLocator)
                .invoke('text').should('contain', testData.errors.passwordRequiredErrorMessage);
            });
    });

    it('should not allow a user to login without a username & password', () => {
        cy.get('@testData').then( testData => {
            cy.get(loginButtonLocator).click()

            onLoginPage.getErrors(errorBoxLocator)
                .invoke('text').should('contain', testData.errors.usernameRequiredErrorMessage);
        });
    });

    it('should not allow a user who is locked out to login', () => {
        cy.get('@testData').then( testData => {
            cy.get(userNameLocator).type(testData.users.lockedOutUser);
            cy.get(passwordLocator).type(testData.passwords.password);
            cy.get(loginButtonLocator).click();

            onLoginPage.getErrors(errorBoxLocator)
                .invoke('text').should('contain', testData.errors.lockedOutUserErrorMessage);
        });
    });
});