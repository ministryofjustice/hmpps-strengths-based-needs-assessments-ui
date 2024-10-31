export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "Are there any children in Sam's life?"

  describe(question, () => {
    const options = [
      'Yes, children that live with them',
      'Yes, children that do not live with them',
      'Yes, children that visit them regularly',
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

    it(`conditional field is displayed for "Yes, children that live with them"`, () => {
      cy.getQuestion(question)
        .getCheckbox('Yes, children that live with them')
        .hasConditionalQuestion(false)
        .clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Yes, children that live with them')
        .getConditionalQuestion()
        .hasTitle(detailsOptionsHeading)
        .hasHint(null)
        .hasLimit(400)

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getCheckbox('Yes, children that live with them')
        .getConditionalQuestion()
        .hasValidationError('Enter details of any children that live them')
        .enterText('Some text')

      cy.checkAccessibility()

      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes, children that live with them').hasSecondaryAnswer('Some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question)
        .getCheckbox('Yes, children that live with them')
        .isChecked()
        .getConditionalQuestion()
        .hasText('Some text')
    })
    ;['Yes, children that do not live with them'].forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle(detailsOptionsHeading)
          .hasHint(null)
          .hasLimit(400)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasValidationError('Enter details of any children that do not live with them')
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
    ;['Yes, children that visit them regularly'].forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle(detailsOptionsHeading)
          .hasHint(null)
          .hasLimit(400)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasValidationError('Enter details of any children that visit them regularly')
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
    ;["No, there are no children in Sam's life"].forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()
        cy.getQuestion(question).hasNoValidationError()
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
  })
}
