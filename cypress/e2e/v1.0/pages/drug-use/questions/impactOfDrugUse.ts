export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What's the impact of Sam using drugs?"

  describe(question, () => {
    const options = [
      ['Behavioural', 'Includes unemployment, disruption on education or lack of productivity.'],
      ['Community', 'Includes limited opportunities or judgement from others.'],
      ['Finances', 'Includes having no money.'],
      ['Links to offending', null],
      ['Physical or mental health', 'Includes overdose.'],
      ['Relationships', 'Includes isolation or neglecting responsibilities.'],
      ['Other', null],
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Select all that apply.')
        .hasCheckboxes(options.map(([label, _hint]) => label))

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select the impact of them using drugs')

      cy.checkAccessibility()
    })

    options
      .filter(([option, _hint]) => option !== 'Other')
      .forEach(([option, hint]) => {
        it(`summary page displays "${option}"`, () => {
          cy.visitStep(stepUrl)
          cy.getQuestion(question).getCheckbox(option).hasHint(hint).clickLabel()
          cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false)

          cy.saveAndContinue()

          cy.visitStep(summaryPage)
          cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
          cy.checkAccessibility()
          cy.getSummary(question).clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
          cy.getQuestion(question).getCheckbox(option).isChecked()
        })
      })

    it(`details field is displayed for "Other"`, () => {
      cy.visitStep(stepUrl)

      cy.getQuestion(question).getCheckbox('Other').hasHint(null).hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Other')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasHint('Consider impact on themselves or others.')
        .hasLimit(400)
        .hasNoValidationError()

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getCheckbox('Other')
        .getConditionalQuestion()
        .hasValidationError('Enter details')

      cy.getQuestion(question).getCheckbox('Other').getConditionalQuestion().enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Other').hasSecondaryAnswer('Some details')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getCheckbox('Other').isChecked()
      cy.getQuestion(question).getCheckbox('Other').getConditionalQuestion().hasText('Some details')
    })
  })
}
