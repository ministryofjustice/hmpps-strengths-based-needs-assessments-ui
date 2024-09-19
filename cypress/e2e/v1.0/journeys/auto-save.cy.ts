describe('Auto save', () => {
  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  it('automatically saves form data when navigating between sections', () => {
    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/current-accommodation')

    cy.hasAutosaveEnabled()

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()

    cy.visitSection('Employment and education')
    cy.assertStepUrlIs('/employment-education')

    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/current-accommodation')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').isChecked()
  })

  it('automatically saves form data after a period of inactivity', () => {
    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/current-accommodation')

    cy.hasAutosaveEnabled()

    cy.intercept('POST', '/form/1/0/current-accommodation?jsonResponse=true').as('post')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()

    cy.wait('@post', { timeout: 6000 })
      .its('response')
      .then(res => expect(res.statusCode).to.equal(200, 'should save successfully'))
  })

  it('automatically saves when reloading the page', () => {
    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/current-accommodation')

    cy.hasAutosaveEnabled()

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()
    cy.reload()

    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/current-accommodation')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').isChecked()
  })

  it('does not remove orphaned answers', () => {
    cy.visitStep('/drug-use')
    cy.getQuestion('Has Sam ever used drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()
    cy.getQuestion('Why did Sam start using drugs?').getCheckbox('Enhance performance').clickLabel()
    cy.saveAndContinue()
    cy.getQuestion('Why did Sam start using drugs?').getCheckbox('Enhance performance').isChecked()

    cy.visitStep('/drug-use')
    cy.getQuestion('Has Sam ever used drugs?').getRadio('No').clickLabel()

    cy.visitSection('Accommodation')
    cy.assertStepUrlIs('/current-accommodation')

    cy.visitSection('Drug use')
    cy.getQuestion('Has Sam ever used drugs?').getRadio('No').isChecked()
    cy.getQuestion('Has Sam ever used drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()

    cy.getQuestion('Why did Sam start using drugs?').getCheckbox('Enhance performance').isChecked()
  })
})
