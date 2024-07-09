export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is Sam part of any groups or communities that gives them a sense of belonging? (optional)'

  describe(question, () => {
    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('For example, online social media or community groups.')
        .hasLimit(400)
      cy.saveAndContinue()
      cy.getQuestion(question).hasNoValidationError().enterText('some text')
      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('some text').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).hasText('some text')
    })
  })
}
