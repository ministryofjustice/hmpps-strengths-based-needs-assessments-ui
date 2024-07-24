import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/drug-use-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Drug use')
  cy.getQuestion('Has Sam ever used drugs?').getRadio('No').clickLabel()
  cy.saveAndContinue()
  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Drug use', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/drug-use-analysis-complete', 'drug use')
