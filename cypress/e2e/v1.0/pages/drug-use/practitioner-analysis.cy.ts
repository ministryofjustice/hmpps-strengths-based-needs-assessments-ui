import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/drug-use-summary'

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
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(summaryPage, '/drug-use-analysis', 'drug use')
