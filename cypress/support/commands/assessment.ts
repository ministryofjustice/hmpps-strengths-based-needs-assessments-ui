// commands related to the overall assessment

export const createAssessment = () => {
  cy.visit('/form/oastub/start')

  cy.get('h1').should('contain', 'OAStub')
  cy.get('a:contains("Go to strengths based needs assessment")')
    .should('have.attr', 'href', 'create-one-time-link')
    .click()

  cy.url().should('contain', '/form/sbna-poc/landing-page')
  cy.get('.splash-image').click()

  return cy.url().should('contain', '/form/sbna-poc/accommodation')
}

export const saveAndContinue = () => {
  return cy.get(`form button`).should('contain.text', 'Save and continue').click()
}
