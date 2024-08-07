import accommodationStatus from './questions/accommodationStatus'

describe('/accommodation', () => {
  const stepUrl = '/accommodation'
  const summaryPage = '/accommodation-analysis'
  const questions = [accommodationStatus]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Accommodation', stepUrl)
    cy.assertSectionIs('Accommodation')
    cy.assertQuestionCount(1)
    cy.hasAutosaveEnabled()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
