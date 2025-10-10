describe('Auto save', () => {
  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  it('automatically saves form data when navigating between sections', () => {
    cy.visitSection('Accommodation').enterBackgroundSubsection()
    cy.assertStepUrlIs('/current-accommodation')

    cy.hasAutosaveEnabled()

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()

    cy.visitSection('Employment and education').enterBackgroundSubsection()
    cy.assertStepUrlIs('/current-employment')

    cy.visitSection('Accommodation').enterBackgroundSubsection()
    cy.assertStepUrlIs('/current-accommodation')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').isChecked()
  })

  it('automatically saves form data after a period of inactivity', () => {
    cy.visitSection('Accommodation').enterBackgroundSubsection()
    cy.assertStepUrlIs('/current-accommodation')

    cy.hasAutosaveEnabled()

    const { assessmentId } = Cypress.env('last_assessment')
    cy.intercept('POST', `/form/edit/${assessmentId}/current-accommodation?jsonResponse=true`).as('post')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()

    cy.wait('@post', { timeout: 6000 })
      .its('response')
      .then(res => expect(res.statusCode).to.equal(200, 'should save successfully'))
  })

  it('automatically saves when reloading the page', () => {
    cy.visitSection('Accommodation').enterBackgroundSubsection()
    cy.assertStepUrlIs('/current-accommodation')

    cy.hasAutosaveEnabled()

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()
    cy.reload()

    cy.visitSection('Accommodation').enterBackgroundSubsection()
    cy.assertStepUrlIs('/current-accommodation')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').isChecked()
  })

  it('does not remove orphaned answers', () => {
    cy.visitStep('/drug-use')
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()
    cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cannabis').clickLabel()
    cy.saveAndContinue()

    cy.visitStep('/drug-use')
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('No').clickLabel()

    cy.visitSection('Accommodation').enterBackgroundSubsection()
    cy.assertStepUrlIs('/current-accommodation')

    cy.visitSection('Drug use').enterBackgroundSubsection()
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('No').isChecked()
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()

    cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cannabis').isChecked()
  })
})
