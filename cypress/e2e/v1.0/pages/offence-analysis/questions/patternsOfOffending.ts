import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'What are the patterns of offending?'

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint(
          'Analyse whether the current index offence(s) are part of a wider pattern of offending and identify any established or emerging themes. It is not necessary to list all previous convictions here.',
        )
        .hasLimit(config.characterLimit.c2000)
      cy.markAsComplete()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Enter details').enterText('some text')
      cy.checkAccessibility()
      cy.markAsComplete()
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
