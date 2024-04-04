export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
    const question = 'Does Sam have a personal bank account?'
    const options = ['Yes', 'No', 'Unknown']
    
    describe(question, () => {
        it(`displays and validates the question`, () => {
            cy.getQuestion(question)
              .isQuestionNumber(positionNumber)
              .hasHint('This does not include solely having a joint account.')
              .hasRadios(options)
            cy.saveAndContinue()
            cy.assertStepUrlIs(stepUrl)
            cy.getQuestion(question).hasValidationError(
              'Select if they have a personal bank account',
            )
            cy.checkAccessibility()
         })
    })
}