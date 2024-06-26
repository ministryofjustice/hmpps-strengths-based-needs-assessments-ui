import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/alcohol-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Alcohol use')
  cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('No').clickLabel()
  cy.saveAndContinue()

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/alcohol-analysis-complete', 'alcohol use')
