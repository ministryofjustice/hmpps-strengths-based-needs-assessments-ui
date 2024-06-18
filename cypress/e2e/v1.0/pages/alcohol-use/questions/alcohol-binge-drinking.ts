export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Has Sam had 6 or more units within a single day of drinking in the last 3 months?'

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint(null)
        .hasRadios([
          'Yes',
          'No',
        ])
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they had 6 or more units within a single day of drinking in the last 3 months')
      cy.checkAccessibility()
    })

    const alcoholFrequency = ['Less than a month', 'Monthly', 'Weekly', 'Daily or almost daily']

    it('displays and validates conditional options for Yes', () => {
      cy.getQuestion(question).getRadio('Yes').hasConditionalQuestion(false).clickLabel()
      cy.getQuestion(question)
      .getRadio('Yes')
      .getConditionalQuestion()
      .hasTitle('Select how often')
      .hasRadios(alcoholFrequency)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).getRadio('Yes').getConditionalQuestion().hasValidationError('Select how often')
      cy.checkAccessibility()
    })

    alcoholFrequency.forEach(alcoholFrequencies => {
      it(`summary page displays "Yes" - ${alcoholFrequencies}"`, () => {
        cy.getQuestion(question).getRadio('Yes').hasConditionalQuestion(false).clickLabel()
        cy.getQuestion(question)
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Select how often')
        .getRadio(alcoholFrequencies).clickLabel()
        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Yes').hasSecondaryAnswer(alcoholFrequencies)
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question)
          .getRadio('Yes')
          .isChecked()
          .getConditionalQuestion()
          .getRadio(alcoholFrequencies)
          .isChecked()
      })
    })
    ;['No'].forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()
        cy.getQuestion(question).getRadio(option).isChecked().hasConditionalQuestion(false)
        cy.saveAndContinue()
        cy.assertStepUrlIsNot(stepUrl)
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
  