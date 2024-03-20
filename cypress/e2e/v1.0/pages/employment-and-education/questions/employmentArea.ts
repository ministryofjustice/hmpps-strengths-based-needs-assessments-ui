export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'What area does Sam work in? (optional)'

  describe(question, () => {
    it(`displays and does not validate the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasLimit(400)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasNoValidationError().enterText('some text')
      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('some text').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })
  })
}
