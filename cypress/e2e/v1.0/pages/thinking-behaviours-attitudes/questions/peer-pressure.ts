export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is Sam resilient towards peer pressure or influence by criminal associates?'
  const options = [
    'Yes, resilient towards peer pressure or influence by criminal associates',
    'Has been peer pressured or influenced by criminal associates in the past but recognises the link to their offending',
    'No, constantly peer pressured or influenced by criminal associates which is linked to their offending',
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        "Select if they're resilient towards peer pressure or influence by criminal associates",
      )
      cy.checkAccessibility()
    })

    options.forEach(option => {
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
