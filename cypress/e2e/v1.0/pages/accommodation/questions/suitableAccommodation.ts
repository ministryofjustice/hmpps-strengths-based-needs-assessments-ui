import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "Is Sam's accommodation suitable?"

  describe(question, () => {
    const options = ['Yes', 'Yes, with concerns', 'No']

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('This includes things like safety or having appropriate amenities.')
        .hasRadios(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if the accommodation is suitable')
      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(option).clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option)
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getRadio(option).isChecked()
      })
    })

    const concerns = [
      'Issues with the property - for example, poor kitchen or bathroom facilities',
      'Overcrowding',
      'Risk of their accommodation being exploited by others - for example, cuckooing',
      'Safety of accommodation',
      'Victim lives with them',
      'Victimised by someone living with them',
      'Other',
    ]

    it('displays the conditional options for "No"', () => {
      cy.getQuestion(question).getRadio('No').clickLabel()

      cy.getQuestion(question)
        .getRadio('No')
        .getConditionalQuestion()
        .hasHint('Select all that apply (optional).')
        .hasCheckboxes(concerns)
      cy.checkAccessibility()
    })

    concerns.forEach(concern => {
      it(`summary page displays "No - ${concern}"`, () => {
        cy.getQuestion(question).getRadio('No').clickLabel()

        cy.getQuestion(question).getRadio('No').getConditionalQuestion().getCheckbox(concern).clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('No').hasSecondaryAnswer(concern)
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getRadio('No').isChecked().getConditionalQuestion().getCheckbox(concern).isChecked()
      })
    })

    it('details field is displayed and validated for "No - Other"', () => {
      cy.getQuestion(question).getRadio('No').clickLabel()

      cy.getQuestion(question)
        .getRadio('No')
        .getConditionalQuestion()
        .getCheckbox('Other')
        .hasConditionalQuestion(false)

      cy.getQuestion(question).getRadio('No').getConditionalQuestion().getCheckbox('Other').clickLabel()

      cy.saveAndContinue()

      cy.getQuestion(question)
        .getRadio('No')
        .getConditionalQuestion()
        .getCheckbox('Other')
        .getConditionalQuestion()
        .hasValidationError('Enter details')

      cy.getQuestion(question)
        .getRadio('No')
        .getConditionalQuestion()
        .getCheckbox('Other')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasLimit(config.characterLimit.default)
        .enterText('Some details')

      cy.checkAccessibility()

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('No').hasSecondaryAnswer('Other', 'Some details')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question)
        .getRadio('No')
        .isChecked()
        .getConditionalQuestion()
        .getCheckbox('Other')
        .isChecked()
        .getConditionalQuestion()
        .hasText('Some details')
    })

    it('displays the conditional options for "Yes, with concerns"', () => {
      cy.getQuestion(question).getRadio('Yes, with concerns').clickLabel()

      cy.getQuestion(question)
        .getRadio('Yes, with concerns')
        .getConditionalQuestion()
        .hasHint('Select all that apply (optional).')
        .hasCheckboxes(concerns)

      cy.checkAccessibility()
    })

    concerns.forEach(concern => {
      it(`summary page displays "Yes, with concerns - ${concern}"`, () => {
        cy.getQuestion(question).getRadio('Yes, with concerns').clickLabel()

        cy.getQuestion(question)
          .getRadio('Yes, with concerns')
          .getConditionalQuestion()
          .getCheckbox(concern)
          .clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Yes, with concerns').hasSecondaryAnswer(concern)
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question)
          .getRadio('Yes, with concerns')
          .isChecked()
          .getConditionalQuestion()
          .getCheckbox(concern)
          .isChecked()
      })
    })

    it('details field is displayed and validated for "Yes, with concerns - Other"', () => {
      cy.getQuestion(question).getRadio('Yes, with concerns').clickLabel()

      cy.getQuestion(question)
        .getRadio('Yes, with concerns')
        .getConditionalQuestion()
        .getCheckbox('Other')
        .hasConditionalQuestion(false)

      cy.getQuestion(question).getRadio('Yes, with concerns').getConditionalQuestion().getCheckbox('Other').clickLabel()

      cy.saveAndContinue()

      cy.getQuestion(question)
        .getRadio('Yes, with concerns')
        .getConditionalQuestion()
        .getCheckbox('Other')
        .getConditionalQuestion()
        .hasValidationError('Enter details')

      cy.getQuestion(question)
        .getRadio('Yes, with concerns')
        .getConditionalQuestion()
        .getCheckbox('Other')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasLimit(config.characterLimit.default)
        .enterText('Some details')

      cy.checkAccessibility()

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes, with concerns').hasSecondaryAnswer('Other', 'Some details')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question)
        .getRadio('Yes, with concerns')
        .isChecked()
        .getConditionalQuestion()
        .getCheckbox('Other')
        .isChecked()
        .getConditionalQuestion()
        .hasText('Some details')
    })
  })
}
