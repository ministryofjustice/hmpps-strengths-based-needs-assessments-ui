import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/thinking-behaviours-attitudes-summary-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Thinking, behaviours and attitudes')
  cy.getQuestion('Are there any concerns that Sam is a risk of sexual harm?').getRadio('No').clickLabel()
  cy.saveAndContinue()

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(
  summaryPage,
  '/thinking-behaviours-attitudes-analysis-complete',
  'thinking, behaviours and attitudes',
)
