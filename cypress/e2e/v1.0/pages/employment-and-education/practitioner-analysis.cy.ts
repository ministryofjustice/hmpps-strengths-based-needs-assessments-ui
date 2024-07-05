import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/employment-education-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Employment and education')
  cy.getQuestion("What is Sam's current employment status?").getRadio('Retired').clickLabel()
  cy.saveAndContinue()

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/employment-education-analysis-complete', 'employment and education')
