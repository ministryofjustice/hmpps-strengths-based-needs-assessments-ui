import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/no-accommodation-2', () => {
  const stepUrl = '/no-accommodation-2'
  const summaryPage = '/accommodation-analysis'
  const questions = [wantToMakeChanges]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Accommodation')

    cy.getQuestion("What is Sam's current accommodation?").getRadio('No accommodation').clickLabel()

    cy.getQuestion("What is Sam's current accommodation?")
      .getRadio('No accommodation')
      .getConditionalQuestion()
      .getRadio('Awaiting assessment')
      .clickLabel()

    cy.getQuestion("What is Sam's current accommodation?")
      .getRadio('No accommodation')
      .getConditionalQuestion()
      .getRadio('Awaiting assessment')
      .getConditionalQuestion()
      .enterText('Some details')

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertQuestionCount(questions.length)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })
})
