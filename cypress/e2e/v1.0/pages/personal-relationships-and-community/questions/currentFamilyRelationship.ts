export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What is Sam's current relationship like with their family?"

  describe(question, () => {
    const options = [
      'Stable, supportive, positive and rewarding relationship',
      'Both positive and negative relationship',
      'Unstable and unsupportive relationship',
      'Unknown',
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Consider any relationships that may act like family support.')
        .hasRadios(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select what their current relationship is like with their family')

      cy.checkAccessibility()
    })

    const optionalDetailsOptions = [
      ['Stable, supportive, positive and rewarding relationship', null],
      ['Both positive and negative relationship', null],
      [
        'Unstable and unsupportive relationship',
        'This includes those who have little or no contact with their family.',
      ],
    ]

    optionalDetailsOptions.forEach(([option, hint]) => {
      it(`optional details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(hint).hasConditionalQuestion(false).clickLabel()

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
