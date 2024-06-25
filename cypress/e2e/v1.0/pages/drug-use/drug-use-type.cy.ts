import drugUsageAndDetails from './questions/drugUsageAndDetails'

describe('/drug-use-type', () => {
  const stepUrl = '/drug-use-type'
  const summaryPage = '/drug-use-analysis'
  const questions = [drugUsageAndDetails]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Drug use')
    cy.getQuestion('Has Sam ever used drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
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
