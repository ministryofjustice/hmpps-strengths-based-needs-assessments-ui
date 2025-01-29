import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What's helped Sam during periods of good health and wellbeing? (optional)"
  describe(question, () => {
    const options = [
      'Accommodation',
      'Employment',
      'Faith or religion',
      'Feeling part of a community or giving back',
      'Medication and treatment',
      'Money',
      'Relationships',
      'Other',
    ]

    it(`displays and the question is optional`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint("Consider what's helped them feel more hopeful.", 'Select all that apply.')
        .hasCheckboxes(options)

      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasNoValidationError()
      cy.checkAccessibility()
    })

    Array.of('Other').forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

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
    })

    Array.of(
      'Accommodation',
      'Employment',
      'Faith or religion',
      'Feeling part of a community or giving back',
      'Medication and treatment',
      'Money',
      'Relationships',
    ).forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
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
  })
}
