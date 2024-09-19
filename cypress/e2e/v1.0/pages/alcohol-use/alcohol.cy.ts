import alcoholUse from './questions/alcohol-use'

describe('/alcohol', () => {
  const stepUrl = '/alcohol'
  const summaryPage = '/alcohol-use-summary'
  const questions = [alcoholUse]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Alcohol use')
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
    cy.assertResumeUrlIs('Alcohol use', stepUrl)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
