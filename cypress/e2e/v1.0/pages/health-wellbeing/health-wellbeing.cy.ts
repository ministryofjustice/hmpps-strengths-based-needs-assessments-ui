import mentalHealthCondition from './questions/mentalHealthCondition'
import physicalHealthCondition from './questions/physicalHealthCondition'

describe('/health-wellbeing', () => {
  const stepUrl = '/health-wellbeing'
  const summaryPage = '/health-wellbeing-summary'
  const questions = [physicalHealthCondition, mentalHealthCondition]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Health and wellbeing').enterBackgroundSubsection()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Health and wellbeing', 'Health and wellbeing background', stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
