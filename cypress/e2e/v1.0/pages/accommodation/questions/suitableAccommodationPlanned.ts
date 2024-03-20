export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam have future accommodation planned?'

  describe(question, () => {
    const options = ['Yes', 'No']

    it('displays and validates the question', () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they have future accommodation planned')
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

    const conditionalOptions = [
      'Awaiting assessment',
      'Awaiting placement',
      'Buy a house',
      'Living with friends or family',
      'Rent privately',
      'Rent from social, local authority or other',
      'Residential healthcare',
      'Supported accommodation',
      'Other',
    ]

    it('displays the conditional options for "Yes"', () => {
      cy.getQuestion(question).getRadio('Yes').clickLabel()

      cy.getQuestion(question).getRadio('Yes').getConditionalQuestion().hasRadios(conditionalOptions)
    })

    conditionalOptions.forEach(conditionalOption => {
      it(`summary page displays "Yes - ${conditionalOption}"`, () => {
        cy.getQuestion(question).getRadio('Yes').clickLabel()

        cy.getQuestion(question).getRadio('Yes').getConditionalQuestion().getRadio(conditionalOption).clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Yes').hasSecondaryAnswer(conditionalOption)
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    Array.of(
      ['Awaiting assessment', null],
      ['Awaiting placement', null],
      ['Other', 'Include where and who with.'],
    ).forEach(([conditionalOption, hint]) => {
      it(`details field is displayed and validated for "Yes - ${conditionalOption}"`, () => {
        cy.getQuestion(question).getRadio('Yes').clickLabel()

        cy.getQuestion(question)
          .getRadio('Yes')
          .getConditionalQuestion()
          .getRadio(conditionalOption)
          .hasConditionalQuestion(false)

        cy.getQuestion(question).getRadio('Yes').getConditionalQuestion().getRadio(conditionalOption).clickLabel()

        cy.saveAndContinue()

        cy.getQuestion(question)
          .getRadio('Yes')
          .getConditionalQuestion()
          .getRadio(conditionalOption)
          .getConditionalQuestion()
          .hasValidationError('Enter details')

        cy.getQuestion(question)
          .getRadio('Yes')
          .getConditionalQuestion()
          .getRadio(conditionalOption)
          .getConditionalQuestion()
          .hasTitle('Give details')
          .hasHint(hint)
          .enterText('Some details')

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Yes').hasSecondaryAnswer(conditionalOption, 'Some details')
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
  })
}
