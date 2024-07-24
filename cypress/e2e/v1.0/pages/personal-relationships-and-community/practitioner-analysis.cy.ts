import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/personal-relationships-community-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Personal relationships and community')
  cy.getQuestion("Who are the important people in Sam's life?").getCheckbox('Friends').clickLabel()
  cy.saveAndContinue()

  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Personal relationships and community', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(
  summaryPage,
  '/personal-relationships-community-analysis-complete',
  'personal relationships and community',
)
