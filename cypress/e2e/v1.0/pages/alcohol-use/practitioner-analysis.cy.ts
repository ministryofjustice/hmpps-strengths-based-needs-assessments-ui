import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/alcohol-use-summary'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Alcohol use')
  cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('No').clickLabel()
  cy.saveAndContinue()
  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Alcohol use', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/alcohol-use-analysis', 'alcohol use')
