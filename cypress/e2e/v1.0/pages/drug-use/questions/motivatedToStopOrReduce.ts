export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is Sam motivated to stop or reduce their drug use?'

  describe(question, () => {
    const options = [
      'Motivated to stop or reduce',
      'Shows some motivation to stop or reduce',
      'Does not show motivation to stop or reduce',
      'Unknown',
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they are motivated to stop or reduce their drug use')

      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(option).hasHint(null).clickLabel()
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false)

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getRadio(option).isChecked()
      })
    })
  })
}
