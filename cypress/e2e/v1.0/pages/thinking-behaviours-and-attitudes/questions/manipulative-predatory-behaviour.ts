export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam show manipulative behaviour or a predatory lifestyle?'
  const options = 
  [
    'Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle', 
    'Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals', 
    'Shows a pattern of manipulative behaviour or a predatory lifestyle'
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they show manipulative behaviour or a predatory lifestyle')
      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(option).clickLabel()
        
        cy.checkAccessibility()

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
