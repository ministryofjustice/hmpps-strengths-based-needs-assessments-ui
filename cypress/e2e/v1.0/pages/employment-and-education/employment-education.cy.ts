import employmentStatus from './questions/employmentStatus'

describe('/employment-education', () => {
  const stepUrl = '/employment-education'
  const summaryPage = '/employment-education-analysis'
  const questions = [employmentStatus]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Employment and education')
    cy.assertQuestionCount(questions.length)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
