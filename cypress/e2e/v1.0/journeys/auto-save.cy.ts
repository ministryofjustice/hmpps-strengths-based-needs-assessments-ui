describe('Auto save', () => {
  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  it('automatically saves form data when navigating between sections', () => {
    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/accommodation')

    cy.hasAutosaveEnabled()

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()
    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('Settled')
      .getConditionalQuestion()
      .getRadio('Homeowner')
      .clickLabel()

    cy.visitSection('Employment and education')
    cy.assertStepUrlIs('/employment-education')

    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/accommodation')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').isChecked()
    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('Settled')
      .getConditionalQuestion()
      .getRadio('Homeowner')
      .isChecked()
  })

  it('automatically saves form data after a period of inactivity', () => {
    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/accommodation')

    cy.hasAutosaveEnabled()

    cy.intercept('POST', '/form/1/0/accommodation?jsonResponse=true').as('post')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()
    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('Settled')
      .getConditionalQuestion()
      .getRadio('Homeowner')
      .clickLabel()

    cy.wait('@post', { timeout: 6000 })
      .its('response')
      .then(res => expect(res.statusCode).to.equal(200, 'should save successfully'))
  })

  it('automatically saves when reloading the page', () => {
    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/accommodation')

    cy.hasAutosaveEnabled()

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()
    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('Settled')
      .getConditionalQuestion()
      .getRadio('Homeowner')
      .clickLabel()

    cy.reload()

    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/accommodation')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').isChecked()
    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('Settled')
      .getConditionalQuestion()
      .getRadio('Homeowner')
      .isChecked()
  })
})
