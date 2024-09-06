export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'How many other people were involved with committing the current index offence(s)?'
  describe(question, () => {
    const options = ['There was no one else involved', '1', '2', '3', '4', '5', '6 to 10', '11 to 15', 'More than 15']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select how many other people were involved in the offence')
      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(null).hasConditionalQuestion(false).clickLabel()

        cy.checkAccessibility()

        cy.getQuestion(question).getRadio(option).hasHint(null).hasConditionalQuestion(false)

        cy.saveAndContinue()
        cy.assertStepUrlIsNot(stepUrl)

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getRadio(option).isChecked().hasConditionalQuestion(false)
      })
    })
  })
}
