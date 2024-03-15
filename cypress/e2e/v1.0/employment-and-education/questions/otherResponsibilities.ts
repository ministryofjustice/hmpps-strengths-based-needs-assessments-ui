export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Paul have any other responsibilities?'
  describe(question, () => {
    const options = ['Carer', 'Volunteer', 'Student', 'Other', null, 'None']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError("Select if they have any other responsibilities, or select 'None'")
    })
    ;['Carer', 'Volunteer', 'Other'].forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(null)
          .hasLimit(400)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasNoValidationError()
          .enterText('some text')

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
    ;['Student', 'None'].forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false)

        cy.saveAndContinue()
        cy.getQuestion(question).hasNoValidationError()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
  })
}
