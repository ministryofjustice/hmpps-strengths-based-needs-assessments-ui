import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam recognise the impact or consequences on the victims or others and the wider community?'

  describe(question, () => {
    const options = ['Yes', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)
      cy.markAsComplete()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        'Select if they recognise the impact on the victim or consequences for others and the wider community',
      )
      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`optional conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(null)
          .hasLimit(config.characterLimit.default)

        cy.markAsComplete()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getRadio(option)
          .getConditionalQuestion()
          .hasNoValidationError()
          .enterText('Some text')

        cy.checkAccessibility()

        cy.markAsComplete()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('Some text')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getRadio(option).isChecked().getConditionalQuestion().hasText('Some text')
      })
    })
  })
}
