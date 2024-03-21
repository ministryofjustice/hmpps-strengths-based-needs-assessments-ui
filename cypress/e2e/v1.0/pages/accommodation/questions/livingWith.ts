export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Who is Sam living with?'

  describe(question, () => {
    const options = ['Family', 'Friends', 'Partner', 'Person under 18 years old', 'Other', null, 'Alone']

    it('displays and validates the question', () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError("Select who they are living with, or select 'Alone'")
    })

    const isNotDivider = (option: string) => option !== null
    const isNotAloneOrDivider = (option: string) => option !== 'Alone' && isNotDivider(option)

    options.filter(isNotDivider).forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getCheckbox(option).clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option)
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    it('selecting "Alone" deselects other options', () => {
      options.filter(isNotAloneOrDivider).forEach(option => {
        cy.getQuestion(question).getCheckbox(option).clickLabel()

        cy.getQuestion(question).getCheckbox(option).isChecked()
      })

      cy.getQuestion(question).getCheckbox('Alone').clickLabel()

      options.filter(isNotAloneOrDivider).forEach(option => {
        cy.getQuestion(question).getCheckbox(option).isNotChecked()
      })
    })

    it('selecting "Alone" then selecting other options deselects "Alone"', () => {
      options.filter(isNotAloneOrDivider).forEach(option => {
        cy.getQuestion(question).getCheckbox('Alone').clickLabel()

        cy.getQuestion(question).getCheckbox('Alone').isChecked()

        cy.getQuestion(question).getCheckbox(option).clickLabel()

        cy.getQuestion(question).getCheckbox(option).isChecked()

        cy.getQuestion(question).getCheckbox('Alone').isNotChecked()
      })
    })
    ;[
      ['Partner', 'Include name, age and gender.'],
      ['Person under 18 years old', 'Include name, date of birth or age, gender and their relationship to Sam'],
      ['Other', null],
    ].forEach(([option, hint]) => {
      it(`details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(hint)
          .hasLimit(400)
          .enterText('Some details')

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('Some details')
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
  })
}
