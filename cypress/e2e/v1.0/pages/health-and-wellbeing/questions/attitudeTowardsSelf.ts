export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What is Sam's attitude towards themselves?"

  describe(question, () => {
    const options = [
      ['Positive and reasonably happy', null],
      ['There are some aspects they would like to change or do not like', null],
      [
        'Negative self-image and unhappy',
        'This includes if they have an overly positive or unrealistic self-image which in reality is not true.',
      ],
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasRadios(options.map(([option]) => option))
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select their attitude towards themselves')
      cy.checkAccessibility()
    })

    options.forEach(([option, hint]) => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(hint).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false)

        cy.saveAndContinue()
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
