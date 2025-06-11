describe('Accessibility statement', () => {
  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment().completePrivacyDeclaration()
  })

  it('is accessible', () => {
    cy.visit('/accessibility-statement')
    cy.get('h1').should('exist').and('contain.text', 'Accessibility statement for Strengths Based Needs Assessments')
  })
})
