export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is Sam able to manage their temper?'
  const options = [
    'Yes, is able to manage their temper well',
    'Sometimes has outbreaks of uncontrolled anger',
    'No, easily loses their temper',
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they are able to manage their temper')
      cy.checkAccessibility()
    })

    Array.of(
      ['Yes, is able to manage their temper well', null],
      ['Sometimes has outbreaks of uncontrolled anger', null],
      [
        'No, easily loses their temper',
        'This may result in a loss of control or inability to stay calm until they have expressed their anger.',
      ],
    ).forEach(([option, hint]) => {
      it(`summary page displays "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).clickLabel()

        cy.getQuestion(question).getRadio(option).hasHint(hint)

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
