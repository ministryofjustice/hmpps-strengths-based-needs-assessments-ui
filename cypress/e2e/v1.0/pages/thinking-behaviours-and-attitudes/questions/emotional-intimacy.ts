export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is there evidence Sam finds it easier to seek emotional intimacy with children over adults?'
  const options = [
    'Yes, they find it easier to seek emotional intimacy with children and have significant difficulty forming intimate relationships with adults',
    'Shows some evidence of having or wanting stable adult relationships but finds it easier to seek emotional intimacy with children over adults',
    'No, they have or have had a intimate relationship with an adult that they value or have the skills, ability and desire to form stable relationships',
    'Unknown',
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        'Select if they show evidence that they find it easier to seek emotional intimacy with children over adults',
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
