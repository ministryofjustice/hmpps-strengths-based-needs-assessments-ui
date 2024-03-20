export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'What has helped Sam stay in accommodation in the past? (optional)'

  describe(question, () => {
    it(`displays and does not validate the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasLimit(400)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasNoValidationError().enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Some details').hasNoSecondaryAnswer()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })
  })
}
