import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/drug-use-type', () => {
  const stepUrl = '/drug-use-changes'
  const summaryPage = '/drug-use-analysis'
  const questions = [wantToMakeChanges]

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
