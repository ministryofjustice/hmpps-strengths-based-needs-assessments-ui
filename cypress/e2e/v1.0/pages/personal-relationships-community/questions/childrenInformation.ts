import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "Are there any children in Sam's life?"

  describe(question, () => {
    const options = [
      'Yes, children that live with them',
      'Yes, children that do not live with them',
      'Yes, children that visit them regularly',
      null,
      "No, there are no children in Sam's life",
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint(
          'This refers to any children (under 18 years) Sam has regular contact with, even if they do not have parental responsibility.',
          'Select all that apply.',
        )
        .hasCheckboxes(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select at least one option')

      cy.checkAccessibility()
    })

    const detailsOptionsHeading = 'Include the name, age and sex of any children, and their relationship to Sam.'

    const conditionalOptions = [
      ['Yes, children that live with them', 'Enter details of any children that live with them'],
      ['Yes, children that do not live with them', 'Enter details of any children that do not live with them'],
      ['Yes, children that visit them regularly', 'Enter details of any children that visit them regularly'],
    ]

    conditionalOptions.forEach(([option, errorMessage]) => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle(detailsOptionsHeading)
          .hasHint(null)
          .hasLimit(config.characterLimit.default)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasValidationError(errorMessage)
          .enterText('Some text')

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('Some text')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getCheckbox(option).isChecked().getConditionalQuestion().hasText('Some text')
      })
    })

    it(`no conditional field is displayed for "No, there are no children in Sam's life"`, () => {
      cy.getQuestion(question)
        .getCheckbox("No, there are no children in Sam's life")
        .hasConditionalQuestion(false)
        .clickLabel()
      cy.getQuestion(question).hasNoValidationError()
      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer("No, there are no children in Sam's life").hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getCheckbox("No, there are no children in Sam's life").isChecked()
    })

    it('selecting "No" deselects other options', () => {
      conditionalOptions.forEach(([option, _]) => {
        cy.getQuestion(question).getCheckbox(option).clickLabel()
        cy.getQuestion(question).getCheckbox(option).isChecked()
      })

      cy.getQuestion(question).getCheckbox(options.at(-1)).clickLabel()

      conditionalOptions.forEach(([option, _]) => {
        cy.getQuestion(question).getCheckbox(option).isNotChecked()
      })

      cy.checkAccessibility()
    })

    it('selecting "No" then selecting other options deselects "No"', () => {
      conditionalOptions.forEach(([option, _]) => {
        cy.getQuestion(question).getCheckbox(options.at(-1)).clickLabel()

        cy.getQuestion(question).getCheckbox(options.at(-1)).isChecked()

        cy.getQuestion(question).getCheckbox(option).clickLabel()

        cy.getQuestion(question).getCheckbox(option).isChecked()

        cy.getQuestion(question).getCheckbox(options.at(-1)).isNotChecked()
      })
      cy.checkAccessibility()
    })
  })
}
