import theImportantPeople from './questions/theImportantPeople'

describe('/personal-relationships', () => {
  const stepUrl = '/personal-relationships'
  const summaryPage = '/personal-relationships-community-summary'
  const questions = [theImportantPeople]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Personal relationships and community')
    cy.assertStepUrlIs(stepUrl)
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
