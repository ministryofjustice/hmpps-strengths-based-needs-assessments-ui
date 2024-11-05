export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is Sam able to manage their parenting responsibilities?'

  describe(question, () => {
    const options = [
      'Yes, manages parenting responsibilities well',
      'Sometimes manages parenting responsibilities well',
      'No, is not able to manage parenting responsibilities',
      'Unknown',
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint(
          'If there are parenting concerns, it does not always mean there are child wellbeing concerns. They may just require some help or support.',
        )
        .hasRadios(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError("Select if they're able to manage their parental responsibilities")

      cy.checkAccessibility()
    })

    options
      .filter(o => o !== 'Unknown')
      .forEach(option => {
        it(`optional details field is displayed for "${option}"`, () => {
          cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

          cy.getQuestion(question)
            .getRadio(option)
            .getConditionalQuestion()
            .hasTitle('Give details (optional)')
            .hasHint(null)
            .hasLimit(400)

          cy.saveAndContinue()

          cy.getQuestion(question)
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
          cy.getQuestion(question).getRadio(option).isChecked().getConditionalQuestion().hasText('some text')
        })
      })

    it(`no details field is displayed for "Unknown"`, () => {
      const option = 'Unknown'
      cy.getQuestion(question).getRadio(option).hasHint(null).hasConditionalQuestion(false).clickLabel()
      cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false)
      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getRadio(option).isChecked()
    })
  })
}
