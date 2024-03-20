export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "Is the location of Sam's accommodation suitable?"

  describe(question, () => {
    const options = ['Yes', 'No']

    it('displays and validates the question', () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if the location of the accommodation is suitable')
    })

    options.forEach(option => {
      it(`summary page displays "${option}"`, () => {
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
      'Close to criminal associates',
      'Close to someone who has victimised them',
      'Close to victim or possible victims',
      'Difficulty with neighbours',
      'Honour-based perpetrator or victim',
      'Safety of the area',
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
  })
}
