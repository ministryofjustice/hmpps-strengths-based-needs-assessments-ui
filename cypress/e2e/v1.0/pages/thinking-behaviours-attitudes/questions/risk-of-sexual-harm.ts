export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Are there any concerns that Sam poses a risk of sexual harm to others?'
  const options = ['Yes', 'No']

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if there are any concerns they are a risk of sexual harm')
      cy.checkAccessibility()
    })

    Array.of(
      [
        'Yes',
        'Information suggests that there is evidence of sexual behaviour that could pose a risk of sexual harm to others',
      ],
      ['No', null],
    ).forEach(([option, hint]) => {
      it(`summary page displays "${option}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(option).clickLabel().hasHint(hint)

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
