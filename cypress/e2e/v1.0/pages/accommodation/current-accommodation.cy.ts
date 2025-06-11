import accommodationStatus from './questions/accommodationStatus'

describe('/current-accommodation', () => {
  const stepUrl = '/current-accommodation'
  const summaryPage = '/accommodation-summary'
  const questions = [accommodationStatus]

  beforeEach(() => {
    cy.createAssessment().enterAssessment().completePrivacyDeclaration()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Accommodation', stepUrl)
    cy.assertSectionIs('Accommodation')
    cy.assertQuestionCount(1)
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
