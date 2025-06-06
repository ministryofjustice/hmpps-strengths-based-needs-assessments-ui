import config from '../../../../../support/config'

export default (recentUse: boolean) => (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = recentUse
    ? 'Is Sam receiving treatment for their drug use?'
    : 'Has Sam ever received treatment for their drug use?'

  const validationError = recentUse
    ? `Select if they're receiving treatment for their drug use`
    : `Select if they have ever received treatment`

  describe(question, () => {
    const options = ['Yes', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options).hasHint(null)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(validationError)
      cy.checkAccessibility()
    })

    it(`mandatory conditional field is displayed for "Yes"`, () => {
      cy.getQuestion(question).getRadio('Yes').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasHint(null)
        .hasLimit(config.characterLimit.default)

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasValidationError('Give details on their treatment')
        .enterText('Some text')

      cy.checkAccessibility()

      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes').hasSecondaryAnswer('Some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getRadio('Yes').isChecked().getConditionalQuestion().hasText('Some text')
    })

    it(`optional conditional field is displayed for "No"`, () => {
      cy.getQuestion(question).getRadio('No').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getRadio('No')
        .getConditionalQuestion()
        .hasTitle('Give details (optional)')
        .hasHint(null)
        .hasLimit(config.characterLimit.default)

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('No')
        .getConditionalQuestion()
        .hasNoValidationError()
        .enterText('Some text')

      cy.checkAccessibility()

      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('No').hasSecondaryAnswer('Some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getRadio('No').isChecked().getConditionalQuestion().hasText('Some text')
    })
  })
}
