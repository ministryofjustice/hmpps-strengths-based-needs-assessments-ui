import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is there evidence that Sam has ever been a victim of domestic abuse?'

  describe(question, () => {
    it('displays and validates the question', () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(['Yes', 'No'])

      cy.markAsComplete()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        'Select if there is evidence that they have ever been victim of domestic abuse',
      )
      cy.checkAccessibility()
    })

    it(`summary page displays "No"`, () => {
      cy.visitStep(stepUrl)
      cy.getQuestion(question).getRadio('No').clickLabel()
      cy.getQuestion(question).getRadio('No').hasConditionalQuestion(false)

      cy.markAsComplete()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('No')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getRadio('No').isChecked()
    })

    const committedAgainst = ['Family member', 'Intimate partner', 'Family member and intimate partner']

    it('displays the conditional options for "Yes"', () => {
      cy.getQuestion(question).getRadio('Yes').clickLabel()

      cy.getQuestion(question)
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Who was this committed by?')
        .hasHint(null)
        .hasRadios(committedAgainst)
      cy.checkAccessibility()

      cy.markAsComplete()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).getRadio('Yes').getConditionalQuestion().hasValidationError('Select an option')
      cy.checkAccessibility()
    })

    committedAgainst.forEach(victim => {
      it(`summary page displays "Yes - ${victim}"`, () => {
        cy.getQuestion(question).getRadio('Yes').clickLabel()

        cy.getQuestion(question)
          .getRadio('Yes')
          .getConditionalQuestion()
          .getRadio(victim)
          .hasConditionalQuestion(false)
          .clickLabel()

        cy.getQuestion(question)
          .getRadio('Yes')
          .getConditionalQuestion()
          .getRadio(victim)
          .getConditionalQuestion()
          .hasTitle('Give details')
          .hasHint(null)
          .hasLimit(config.characterLimit.default)

        cy.markAsComplete()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getRadio('Yes')
          .getConditionalQuestion()
          .hasNoValidationError()
          .getRadio(victim)
          .getConditionalQuestion()
          .hasValidationError('Enter details')
          .enterText('Some text')

        cy.checkAccessibility()

        cy.markAsComplete()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Yes').hasSecondaryAnswer(victim, 'Some text')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question)
          .getRadio('Yes')
          .isChecked()
          .getConditionalQuestion()
          .getRadio(victim)
          .isChecked()
          .getConditionalQuestion()
          .hasText('Some text')
      })
    })
  })
}
