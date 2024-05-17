export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is Sam affected by debt?'
  describe(question, () => {
    const options = ['Yes, their own debt', "Yes, someone else's debt", null, 'No', 'Unknown']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they are affected by debt')
      cy.checkAccessibility()
    })

    const yesOptions = ['Yes, their own debt', "Yes, someone else's debt"]

    yesOptions.forEach(option => {
      const debtOptions = [
        ['Debt to others', 'Includes things like owing money to family, friends, other prisoners or loan sharks.'],
        ['Formal debt', 'Includes things like credit cards, phone bills or rent arrears.'],
      ]

      it(`displays and validates the conditional options for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasHint().hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasHint('Select all that apply')
          .hasCheckboxes(debtOptions.map(([debtOption, _]) => debtOption))
          .hasNoValidationError()

        cy.saveAndContinue()

        cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().hasValidationError('Select type of debt')
      })

      debtOptions.forEach(([debtOption, hint]) => {
        it(`summary page displays "${option} - ${debtOption}"`, () => {
          cy.getQuestion(question).getCheckbox(option).clickLabel()

          cy.getQuestion(question)
            .getCheckbox(option)
            .getConditionalQuestion()
            .getCheckbox(debtOption)
            .hasConditionalQuestion(false)
            .clickLabel()

          cy.saveAndContinue()

          cy.getQuestion(question)
            .getCheckbox(option)
            .getConditionalQuestion()
            .getCheckbox(debtOption)
            .getConditionalQuestion()
            .hasTitle('Give details (optional')
            .hasHint(hint)
            .hasNoValidationError()
            .enterText('Some details')

          cy.checkAccessibility()

          cy.saveAndContinue()

          cy.visitStep(summaryPage)
          cy.getSummary(question).getAnswer(option).hasSecondaryAnswer(debtOption, 'Some details')
          cy.checkAccessibility()
          cy.getSummary(question).clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
          cy.getQuestion(question)
            .getCheckbox(option)
            .isChecked()
            .getConditionalQuestion()
            .getCheckbox(debtOption)
            .isChecked()
            .getConditionalQuestion()
            .hasText('Some details')
        })
      })
    })
  })
}
