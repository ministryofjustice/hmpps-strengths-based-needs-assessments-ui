export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam use violence, aggressive or controlling behaviour to get their own way?'
  const options = 
  [
    'Does not use violence, aggressive or controlling behaviour to get their own way', 
    'Some evidence of using violence, aggressive or controlling behaviour to get their own way', 
    'Patterns of using violence, aggressive or controlling behaviour to get their own way'
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they use violence, aggressive or controlling behaviour to get their own way')
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
