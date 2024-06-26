export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Has anything helped Sam to stop or reduce using drugs in the past?'

  describe(question, () => {
    const options = ['Yes', 'No']

    it('displays and validates the question', () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        'Select if anything has helped them to stop or reduce using drugs in the past',
      )

      cy.checkAccessibility()
    })

    it(`summary page displays "Yes" and optional details`, () => {
      cy.visitStep(stepUrl)
      cy.getQuestion(question).getRadio('Yes').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details (optional)')
        .hasHint(null)
        .hasLimit(400)

      cy.checkAccessibility()

      cy.saveAndContinue()

      cy.getQuestion(question)
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details (optional)')
        .hasNoValidationError()
        .enterText('some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes').hasSecondaryAnswer('some details')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getRadio('Yes').isChecked().getConditionalQuestion().hasText('some details')
    })

    it(`summary page displays "No"`, () => {
      cy.visitStep(stepUrl)
      cy.getQuestion(question).getRadio('No').hasHint(null).clickLabel()
      cy.getQuestion(question).getRadio('No').hasConditionalQuestion(false)

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('No').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getRadio('No').isChecked()
    })
  })
}
