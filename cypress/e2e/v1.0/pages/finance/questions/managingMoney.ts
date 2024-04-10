export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
    const question = 'How good is Sam at managing their money?'
    describe(question, () => {
    const options = [
      'Able to manage their money well and is a strength', 
      'Able to manage their money for everyday necessities',
      'Unable to manage their money well',
      'Unable to manage their money which is creating other problems',
    ] 
    
      it(`displays and validates the question`, () => {
        cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('This includes things like budgeting, prioritising bills and paying rent.').hasRadios(options)
        cy.saveAndContinue()
        cy.assertStepUrlIs(stepUrl)
        cy.getQuestion(question).hasValidationError('Select how good they are at managing their money')
        cy.checkAccessibility()
      })

      ;[
        'Able to manage their money well and is a strength', 
        'Able to manage their money for everyday necessities',
        'Unable to manage their money well',
        'Unable to manage their money which is creating other problems',
      ].forEach(option => {
      it(`conditional field is displayed for all radio "${option}`, () => {
      cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getRadio(option)
        .getConditionalQuestion()
        .hasTitle('Give details (optional)')
        .hasHint(null)
        .hasLimit(400)

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio(option)
        .getConditionalQuestion()
        .hasNoValidationError()
        .enterText('some text')

      cy.checkAccessibility()

      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })
  })
})
}
