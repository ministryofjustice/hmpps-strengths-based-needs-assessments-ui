import everUsedDrugs from './questions/everUsedDrugs'

describe('/drugs', () => {
  const stepUrl = '/drugs'
  const summaryPage = '/drug-use-summary'
  const questions = [everUsedDrugs]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Drug use')
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Drug use', stepUrl)
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