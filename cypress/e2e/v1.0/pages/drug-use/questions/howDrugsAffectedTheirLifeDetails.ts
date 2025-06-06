import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const mainQuestion = `How has Sam's drug use affected their life?`
  const question = 'Give details (optional)'
  const summaryQuestion = `Details on how Sam's drug use has affected their life`

  describe(question, () => {
    it(`displays the optional question`, () => {
      cy.getQuestion(mainQuestion)
        .getNextQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint(null)
        .hasLimit(config.characterLimit.default)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(mainQuestion).getNextQuestion(question).hasNoValidationError().enterText('Some text')
      cy.checkAccessibility()
      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(summaryQuestion).getAnswer('Some text').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(summaryQuestion).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(mainQuestion).getNextQuestion(question).hasText('Some text')
    })
  })
}
