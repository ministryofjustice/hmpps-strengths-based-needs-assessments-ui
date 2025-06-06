import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'What could help Sam not use drugs in the future? (optional)'

  describe(question, () => {
    it(`displays the optional question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasLimit(config.characterLimit.default)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasNoValidationError().enterText('Some text')
      cy.checkAccessibility()
      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Some text').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).hasText('Some text')
    })
  })
}
