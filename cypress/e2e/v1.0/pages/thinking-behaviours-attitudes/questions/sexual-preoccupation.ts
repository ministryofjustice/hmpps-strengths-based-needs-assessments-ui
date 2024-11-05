export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is there evidence Sam shows sexual preoccupation?'
  const options = [
    'Yes, the amount of time they spend engaging in sexual activity or thinking about sex is unhealthy and is impacting their day-to-day life',
    'Shows some evidence of improving their day-to-day life but still spends a significant amount of time preoccupied with sex',
    'No, the amount of time they spend engaging in sexual activity or thinking about sex is healthy and is balanced alongside all other important areas of their life',
    'No, there is no evidence',
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError("Select if there's evidence of sexual preoccupation")
      cy.checkAccessibility()
    })

    Array.of(
      [
        'Yes, the amount of time they spend engaging in sexual activity or thinking about sex is unhealthy and is impacting their day-to-day life',
        null,
      ],
      [
        'Shows some evidence of improving their day-to-day life but still spends a significant amount of time preoccupied with sex',
        null,
      ],
      [
        'No, the amount of time they spend engaging in sexual activity or thinking about sex is healthy and is balanced alongside all other important areas of their life',
        'This includes behaviours like masturbating regularly, having casual sex or using pornography to meet their needs in a healthy way.',
      ],
      ['Unknown', null],
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
