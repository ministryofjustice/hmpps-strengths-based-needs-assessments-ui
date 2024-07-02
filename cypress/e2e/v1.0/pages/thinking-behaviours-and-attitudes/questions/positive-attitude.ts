export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam have a positive attitude towards any criminal justice staff they have come into contact with?'
  const options = 
  [
    'Yes, has a positive attitude', 
    'Has a negative attitude or does not fully engage but there are no safety concerns', 
    'No, has a negative attitude and there are safety concerns'
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they have a positive attitude towards any criminal justice staff they have come into contact with')
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
