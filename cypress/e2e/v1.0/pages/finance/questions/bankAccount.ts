export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
    const question = 'Does Sam have their own bank account?'
    const options = ['Yes', 'No', 'Unknown']
    
    describe(question, () => {
        it(`displays and validates the question`, () => {
            cy.getQuestion(question)
              .isQuestionNumber(positionNumber)
              .hasHint(null)
              .hasRadios(options)
            cy.saveAndContinue()
            cy.assertStepUrlIs(stepUrl)
            cy.getQuestion(question).hasValidationError(
              'Select if they have their own personal bank account',
            )
            cy.checkAccessibility()
         })
    })
}