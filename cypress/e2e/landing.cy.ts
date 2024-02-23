before(() => {
  cy.visit('/form/oastub/start')
})

describe('Landing page', () => {
  it('is displayed correctly', () => {
    cy.get('h1').should('contain', 'OAStub')
  })

  it('links to the Assessments MVP', () => {
    cy.get('a:contains("Go to strengths based needs assessment")')
      .should('have.attr', 'href', 'create-one-time-link')
      .click()
    cy.url().should('contain', '/form/sbna-poc/landing-page')
    cy.get('.splash-image').click()
    cy.url().should('contain', '/form/sbna-poc/accommodation')
    cy.get('h1').should('contain', 'Strengths and needs')
    cy.get('h2').should('contain', 'Accommodation')
  })
})
