export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "Does Sam understand other people's views?"
  const options = 
  [
    "Yes, understands other people's views and is able to distinguish between their own feelings and those of other", 
    "Assumes all views are the same as theirs at first but does consider other people's views to an extent", 
    "No, unable to understand other people's views and distinguish between their own feelings and those of others"
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError("Select if they understand other people’s views")
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
