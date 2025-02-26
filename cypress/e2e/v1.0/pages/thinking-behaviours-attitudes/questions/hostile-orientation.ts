export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam have hostile orientation to others or to general rules?'
  const options = [
    "They're able to have constructive conversations when they disagree with others and can forgive past wrongs",
    'Some evidence of suspicious, angry or vengeful thinking and behaviour',
    'There is evidence of suspicious, angry and vengeful thinking and behaviour',
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        'Select if they have hostile orientation to others or to general rules',
      )
      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(option).clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
  })
}
