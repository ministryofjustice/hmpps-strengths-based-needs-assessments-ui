export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What is Sam's overall experience of employment?"
  const options = ['Positive', 'Mostly positive', 'Positive and negative', 'Mostly negative', 'Negative', 'Unknown']

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select their overall experience of employment')
      cy.checkAccessibility()
    })
    ;['Positive', 'Mostly positive', 'Positive and negative', 'Mostly negative', 'Negative'].forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(null).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(null)
          .hasLimit(400)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getRadio(option)
          .getConditionalQuestion()
          .hasNoValidationError()
          .enterText('some text')

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    it(`no conditional field is displayed for "Unknown"`, () => {
      cy.getQuestion(question).getRadio('Unknown').hasHint(null).hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question).getRadio('Unknown').hasConditionalQuestion(false)

      cy.saveAndContinue()
      cy.getQuestion(question).hasNoValidationError()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Unknown').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })
  })
}
