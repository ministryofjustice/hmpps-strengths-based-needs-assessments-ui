import config from '../../../../../support/config'

export default (currentUse: boolean) => (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const mainQuestion = currentUse ? 'Why does Sam use drugs?' : 'Why did Sam use drugs?'
  const question = 'Give details (optional)'
  const summaryQuestion = currentUse ? 'Details on why Sam uses drugs' : 'Details on why Sam used drugs'

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
