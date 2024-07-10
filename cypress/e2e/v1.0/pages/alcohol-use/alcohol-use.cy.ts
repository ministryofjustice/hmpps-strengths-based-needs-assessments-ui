import alcoholUse from './questions/alcohol-use'

describe('/alcohol-use', () => {
  const stepUrl = '/alcohol-use'
  const summaryPage = '/alcohol-use-analysis'
  const questions = [alcoholUse]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Alcohol use')
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
