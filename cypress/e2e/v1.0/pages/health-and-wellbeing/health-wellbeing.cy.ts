import mentalHealthCondition from './questions/mentalHealthCondition'
import physicalHealthCondition from './questions/physicalHealthCondition'

describe('/health-wellbeing', () => {
  const stepUrl = '/health-wellbeing'
  const summaryPage = '/health-wellbeing-analysis'
  const questions = [physicalHealthCondition, mentalHealthCondition]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Health and wellbeing')
    cy.assertStepUrlIs(stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
