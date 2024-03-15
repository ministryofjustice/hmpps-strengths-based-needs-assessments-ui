import accommodationStatus from '../questions/accommodationStatus'

describe('/accommodation', () => {
  const stepUrl = '/accommodation'
  const summaryPage = '/accommodation-summary-analysis'
  const questions = [accommodationStatus]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Accommodation')
    cy.assertQuestionCount(1)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })
})
