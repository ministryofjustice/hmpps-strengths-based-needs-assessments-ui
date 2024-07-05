export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is Sam able to resolve any challenges in their intimate relationships?'

  describe(question, () => {
    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Consider any healthy and appropriate skills or strengths they may have.')
        .hasLimit(400)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Enter details')

      cy.checkAccessibility()

      cy.getQuestion(question).enterText('some text')
      cy.saveAndContinue()
      cy.getQuestion(question).hasNoValidationError()

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
