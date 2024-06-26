import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/accommodation-analysis'

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

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/accommodation-analysis-complete', 'accommodation')
