import drugUsageAndDetails from './questions/drugUsageAndDetails'

describe('/drug-use-type', () => {
  const stepUrl = '/drug-use-type'
  const summaryPage = '/drug-use-analysis'
  const questions = [drugUsageAndDetails]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Drug use')
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
