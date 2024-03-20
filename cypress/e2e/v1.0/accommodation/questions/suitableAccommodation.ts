export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "Is Sam's overall accommodation suitable?"

  describe(question, () => {
    const options = ['Yes', 'Yes, with concerns', 'No']

    it('displays and validates the question', () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if the overall accommodation is suitable')
    })

    options.forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(option).clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option)
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    const concerns = [
      'Inappropriate amenities or facilities',
      'Overcrowding',
      'Risk of accommodation exploited - for example, cuckooing',
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
        .hasHint('Select all that apply (optional)')
        .hasCheckboxes(concerns)
    })

    concerns.forEach(concern => {
      it(`summary page displays "No - ${concern}"`, () => {
        cy.getQuestion(question).getRadio('No').clickLabel()

        cy.getQuestion(question).getRadio('No').getConditionalQuestion().getCheckbox(concern).clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('No').hasSecondaryAnswer(concern)
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
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
        .enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('No').hasSecondaryAnswer('Other', 'Some details')
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })

    it('displays the conditional options for "Yes, with concerns"', () => {
      cy.getQuestion(question).getRadio('Yes, with concerns').clickLabel()

      cy.getQuestion(question)
        .getRadio('Yes, with concerns')
        .getConditionalQuestion()
        .hasHint('Select all that apply (optional)')
        .hasCheckboxes(concerns)
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
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
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
        .enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes, with concerns').hasSecondaryAnswer('Other', 'Some details')
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })
  })
}
