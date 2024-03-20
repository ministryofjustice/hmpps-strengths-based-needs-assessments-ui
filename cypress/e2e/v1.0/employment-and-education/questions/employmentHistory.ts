export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What is Sam's employment history?"

  describe(question, () => {
    const options = [
      'Continuous employment history',
      'Generally in employment but changes jobs often',
      'Unstable employment history with regular periods of unemployment',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Include their current employment.')
        .hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select their employment history')
      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint("Include what type of work they've done before.")
          .hasLimit(400)

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getRadio(option)
          .getConditionalQuestion()
          .hasNoValidationError()
          .enterText('some text')

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')

        cy.checkAccessibility()

        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
  })
}
