import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Why does Sam drink alcohol?'
  describe(question, () => {
    const options = [
      'Cultural or religious practice',
      'Curiosity or experimentation',
      'Enjoyment',
      'Manage stress or emotional issues',
      'On special occasions',
      'Peer pressure or social influence',
      'Self-medication or mood altering',
      'Socially',
      'Other',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select why they drink alcohol')
      cy.checkAccessibility()
    })

    const optionsWithConditionals = ['Other']

    optionsWithConditionals.forEach(option => {
      it(`details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .hasHint(null)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasLimit(config.characterLimit.default)

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
    ;[['Self-medication or mood altering', 'Includes pain management or emotional regulation.']].forEach(
      ([option, hint]) => {
        it(`no details field is displayed for "${option}" containing hint text`, () => {
          cy.getQuestion(question).getCheckbox(option).hasHint(hint).hasConditionalQuestion(false).clickLabel()
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
      },
    )

    const optionsWithHint = ['Self-medication or mood altering']

    options
      .filter(it => !optionsWithHint.includes(it) && !optionsWithConditionals.includes(it))
      .forEach(option => {
        it(`no details field is displayed for "${option}"`, () => {
          cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

          cy.getQuestion(question).getCheckbox(option).hasHint(null).hasConditionalQuestion(false)
        })
      })
  })
}
