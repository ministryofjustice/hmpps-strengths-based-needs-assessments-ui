export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam want to make changes to their employment and education?'
  const options = [
    'I have already made positive changes and want to maintain them',
    'I am actively making changes',
    'I want to make changes and know how to',
    'I want to make changes but need help',
    'I am thinking about making changes',
    'I do not want to make changes',
    'I do not want to answer',
    null,
    'Sam is not present',
    'Not applicable',
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('This question must be directly answered by Sam.')
        .hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        'Select if they want to make changes to their employment and education',
      )
      cy.checkAccessibility()
    })
    ;[
      'I have already made positive changes and want to maintain them',
      'I am actively making changes',
      'I want to make changes and know how to',
      'I want to make changes but need help',
      'I am thinking about making changes',
      'I do not want to make changes',
    ].forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(null).hasConditionalQuestion(false).clickLabel()

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
    ;['I do not want to answer', 'Sam is not present', 'Not applicable'].forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(null).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false)

        cy.saveAndContinue()
        cy.getQuestion(question).hasNoValidationError()

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
