describe('/accommodation', () => {
  before(() => {
    const [stepUrl] = Cypress.currentTest.titlePath
    this.stepUrl = stepUrl

    cy.createAssessment()
    cy.visitStep(this.stepUrl)
    cy.assertQuestionCount(1)
  })

  beforeEach(() => {
    cy.assertSectionIs('Accommodation')
    cy.assertStepUrlIs(this.stepUrl)
  })
})
