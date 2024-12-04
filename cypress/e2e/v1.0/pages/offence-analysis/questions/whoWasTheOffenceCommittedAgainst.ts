import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Who was the offence committed against?'
  describe(question, () => {
    const options = ['One or more people', 'Other']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)

      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select who the offence was committed against')
      cy.checkAccessibility()
    })

    it(`conditional field is displayed for "Other"`, () => {
      const option = 'Other'

      cy.getQuestion(question)
        .getCheckbox(option)
        .hasHint('For example, a business or the wider community.')
        .hasConditionalQuestion(false)
        .clickLabel()

      cy.getQuestion(question)
        .getCheckbox(option)
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasHint(null)
        .hasLimit(config.characterLimit.default)

      cy.saveAndContinue()

      cy.getQuestion(question)
        .hasNoValidationError()
        .getCheckbox(option)
        .getConditionalQuestion()
        .hasValidationError('Enter details')

      cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().enterText('some text')

      cy.checkAccessibility()

      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getCheckbox(option).isChecked().getConditionalQuestion().hasText('some text')
    })

    it(`no conditional field is displayed for "One or more people"`, () => {
      const option = 'One or more people'

      cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false)

      cy.saveAndContinue()
      cy.getQuestion(question).hasNoValidationError()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getCheckbox(option).isChecked()
    })
  })
}
