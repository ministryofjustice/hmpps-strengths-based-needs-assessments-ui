import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/no-accommodation-2', () => {
  const stepUrl = '/no-accommodation-2'
  const summaryPage = '/accommodation-analysis'
  const questions = [wantToMakeChanges]

  before(() => {
    cy.createAssessment().enterAssessment()

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('No accommodation').clickLabel()

    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('No accommodation')
      .getConditionalQuestion()
      .getRadio('Awaiting assessment')
      .clickLabel()

    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('No accommodation')
      .getConditionalQuestion()
      .getRadio('Awaiting assessment')
      .getConditionalQuestion()
      .enterText('Some details')

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment()
    cy.visitStep(stepUrl)
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
