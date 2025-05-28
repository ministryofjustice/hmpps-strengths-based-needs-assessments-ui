import employmentStatus from './questions/employmentStatus'

describe('/current-employment', () => {
  const stepUrl = '/current-employment'
  const summaryPage = '/employment-education-summary'
  const questions = [employmentStatus]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.assertResumeUrlIs('Employment and education', stepUrl)
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Employment and education')
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
