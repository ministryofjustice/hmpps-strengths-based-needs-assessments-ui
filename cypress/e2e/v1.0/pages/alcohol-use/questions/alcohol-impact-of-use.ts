export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What's the impact of Sam drinking alcohol?"
  describe(question, () => {
    const options = [
      'Behavioural',
      'Community',
      'Finances',
      'Links to offending',
      'Physical or mental health',
      'Relationships',
      'Other',
      null,
      'No impact',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError("Select the impact of them drinking alcohol, or select 'No impact'")
      cy.checkAccessibility()
    })

    const optionsWithConditionals = ['Other']

    optionsWithConditionals.forEach(option => {
      it(`details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint('Consider impact on themselves or others.')
          .hasLimit(400)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasNoValidationError()

        cy.getQuestion(question).getCheckbox(option).hasHint(null).getConditionalQuestion().enterText('Some details')

        cy.checkAccessibility()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('Some details')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getCheckbox(option).isChecked().getConditionalQuestion().hasText('Some details')
      })
    })
    Array.of(
      ['Behavioural', 'Includes unemployment, disruption on education or lack of productivity.'],
      ['Community', 'Includes limited opportunities or judgement from others.'],
      ['Finances', 'Includes having no money or difficulties.'],
      ['Links to offending', null],
      ['Physical or mental health', 'Includes overdose.'],
      ['Relationships', 'Includes isolation or neglecting responsibilities.'],
      ['No impact', null],
    ).forEach(([option, hint]) => {
      it(`no details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question).getCheckbox(option).hasHint(hint).hasConditionalQuestion(false)

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
  })
}
