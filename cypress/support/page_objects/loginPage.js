

export class loginPage {

    getErrors(errorBox) {
        return cy.get(errorBox)
   }
}

export const onLoginPage = new loginPage()