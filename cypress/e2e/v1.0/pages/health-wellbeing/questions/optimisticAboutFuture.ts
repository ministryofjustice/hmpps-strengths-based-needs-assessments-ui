export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'How does Sam feel about their future?'
  describe(question, () => {
    const options = [
      'Optimistic and has a positive outlook about their future',
      'Not sure and thinks their future could get better or worse',
      'Not optimistic and thinks their future will not get better or may get worse',
      null,
      'Sam does not want to answer',
      'Sam is not present',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options).hasHint('This question must be directly answered by Sam.')
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select how optimistic they are about their future')
      cy.checkAccessibility()
    })

    options
      .filter(it => it !== null)
      .forEach(option => {
        it(`no conditional field is displayed for "${option}"`, () => {
          cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

          cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false)

          cy.saveAndContinue()
          cy.getQuestion(question).hasNoValidationError()

          cy.visitStep(summaryPage)
          cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
          cy.checkAccessibility()
          cy.getSummary(question).clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
          cy.getQuestion(question).getRadio(option).isChecked()
        })
      })
  })
}
