import childrenInformation from './questions/childrenInformation'

describe('/personal-relationships-children-information', () => {
  const stepUrl = '/personal-relationships-children-information'
  const summaryPage = '/personal-relationships-community-summary'
  const questions = [childrenInformation]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Personal relationships and community').enterBackgroundSubsection()
    cy.assertStepUrlIs(stepUrl)
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
