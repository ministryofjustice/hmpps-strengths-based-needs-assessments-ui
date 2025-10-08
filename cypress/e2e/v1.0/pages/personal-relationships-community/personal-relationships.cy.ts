import theImportantPeople from './questions/theImportantPeople'

describe('/personal-relationships', () => {
  const stepUrl = '/personal-relationships'
  const summaryPage = '/personal-relationships-community-summary'
  const questions = [theImportantPeople]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Personal relationships and community').enterBackgroundSubsection()
    cy.getQuestion("Are there any children in Sam's life?")
      .getCheckbox("No, there are no children in Sam's life")
      .clickLabel()
    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Personal relationships and community', 'Personal relationships and community background', stepUrl)
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
