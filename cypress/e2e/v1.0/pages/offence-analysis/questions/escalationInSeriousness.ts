export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is the current index offence(s) an escalation in seriousness from previous offending?'

  describe(question, () => {
    const options = ['Yes', 'No', 'Not applicable']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.markAsComplete()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        'Select if the current offence(s) are an escalation in seriousness from previous offending',
      )
      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(null).clickLabel()
        cy.markAsComplete()
        cy.getQuestion(question).hasNoValidationError()
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
