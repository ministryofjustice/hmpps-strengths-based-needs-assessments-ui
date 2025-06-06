import everMisusedDrugs from './questions/everMisusedDrugs'

describe('/drug-use', () => {
  const stepUrl = '/drug-use'
  const summaryPage = '/drug-use-summary'
  const questions = [everMisusedDrugs]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Drug use')
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Drug use', stepUrl)
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
