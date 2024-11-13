import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What was Sam's experience of their childhood?"

  describe(question, () => {
    const options = [
      ['Positive experience', null],
      ['Both positive and negative experience', null],
      [
        'Negative experience',
        'This includes things like permanent or long-term separation from their parents or guardians, inconsistent care, neglect or abuse.',
      ],
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint(null)
        .hasRadios(options.map(([option, _]) => option))

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select their experience of childhood')

      cy.checkAccessibility()
    })

    options.forEach(([option, hint]) => {
      it(`optional details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(hint).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(null)
          .hasLimit(config.characterLimit.default)

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
