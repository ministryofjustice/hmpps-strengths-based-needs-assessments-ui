import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/accommodation-summary'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Accommodation')
  cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()
  cy.getQuestion('What type of accommodation does Sam currently have?')
    .getRadio('Settled')
    .getConditionalQuestion()
    .getRadio('Homeowner')
    .clickLabel()
  cy.saveAndContinue()

  cy.getQuestion('Who is Sam living with?').getCheckbox('Alone').clickLabel()
  cy.getQuestion("Is the location of Sam's accommodation suitable?").getRadio('Yes').clickLabel()
  cy.getQuestion("Is Sam's accommodation suitable?").getRadio('Yes').clickLabel()
  cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()
  cy.saveAndContinue()

  cy.assertResumeUrlIs('Accommodation', summaryPage)
  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/accommodation-analysis', 'accommodation')
