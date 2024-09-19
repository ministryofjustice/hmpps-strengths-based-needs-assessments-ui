export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question =
    'Give details if Sam is on prescribed medication or treatment for physical health conditions (optional)'

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasNoValidationError()
      cy.checkAccessibility()
    })

    it(`summary page displays "${question}"`, () => {
      cy.visitStep(stepUrl)
      cy.getQuestion(question).enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Some details')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).hasText('Some details')
    })
  })
}
