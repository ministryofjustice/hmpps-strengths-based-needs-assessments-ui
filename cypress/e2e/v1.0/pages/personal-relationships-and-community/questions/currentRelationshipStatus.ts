export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is Sam happy with their current relationship status?'

  describe(question, () => {
    const options = [
      'Happy and positive about their relationship status or their relationship is likely to act as a protective factor',
      'Has some concerns about their relationship status but is overall happy',
      'Unhappy about their relationship status or their relationship is unhealthy and directly linked to offending',
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they are happy with their current relationship status')

      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`optional details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(null)
          .hasLimit(400)

        cy.saveAndContinue()

        cy.getQuestion(question).getRadio(option).getConditionalQuestion().hasNoValidationError().enterText('some text')

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
  })
}
