import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/alcohol-use-summary'

before(() => {
  cy.createAssessment().enterAssessment().completePrivacyDeclaration()

  cy.visitSection('Alcohol use')
  cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('No').clickLabel()
  cy.saveAndContinue()
  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Alcohol use', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment().completePrivacyDeclaration()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(summaryPage, '/alcohol-use-analysis', 'alcohol use')
