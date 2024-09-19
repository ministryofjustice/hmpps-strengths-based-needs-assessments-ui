export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Has Sam ever self-harmed?'
  describe(question, () => {
    const options = ['Yes', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .hasHint("Consider what factors or circumstances are associated and if it's recurring.")
        .isQuestionNumber(positionNumber)
        .hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they have ever self-harmed')
      cy.checkAccessibility()
    })

    Array.of('Yes').forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
          .getConditionalQuestion()
          .hasTitle('Give details')
          .hasHint(null)
          .hasLimit(400)

        cy.saveAndContinue()

        cy.getQuestion(question)
          .hasNoValidationError()
          .getRadio(option)
          .getConditionalQuestion()
          .hasValidationError('Enter details')

        cy.getQuestion(question).getRadio(option).getConditionalQuestion().enterText('some text')

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

    Array.of('No').forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false)

        cy.saveAndContinue()
        cy.getQuestion(question).hasNoValidationError()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getRadio(option).isChecked()
      })
    })
  })
}
