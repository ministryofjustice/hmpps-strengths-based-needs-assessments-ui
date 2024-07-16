import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/finance-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Finance')
  cy.getQuestion('Where does Sam currently get their money from?').getCheckbox('No money').clickLabel()
  cy.saveAndContinue()

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/finance-analysis-complete', 'finance')
