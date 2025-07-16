/// <reference types="cypress" />

describe('Test log out', () => {
    beforeEach('Login to application', () => {
        cy.loginToApp()
    })

    it('verify use can log out successfully', {retries: 2}, () => {
        cy.contains('Settings').click()
        cy.contains('Or click here to logout.').click()
        cy.get('.navbar-nav').should('contain', 'Sign up')
    })

    it('Find an element and click on it', {browser: 'chrome'}, () => {  // Test will only run in Chrome Browser!
        cy.contains('Home').click()
    })
    it('Find another element and click on it', {browser: '!firefox'}, () => {  // Test will NOT run in Firefox Browser!
        cy.contains('Settings').click()
    })
})
