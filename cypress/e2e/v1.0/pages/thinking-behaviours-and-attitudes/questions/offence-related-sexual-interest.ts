export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is there evidence Sam has offence-related sexual interests?'
  const options = 
  [
    'Yes, there are recurrent and persistent patterns of a preference for sexual activity that is illegal or harmful and no evidence of healthy sexual interests',
    'Shows some evidence of healthy sexual activity including consensual sex but shows behaviour that is recurrent and persistent or an interest in sexual activity that is illegal or harmful',
    'No, they have healthy sexual interests rather than a preference for sexual activity that is illegal or harmful',
    'Unknown'
  ]

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they show evidence of offence-related sexual interests')
      cy.checkAccessibility()
    })

    Array.of(
      [
        'Yes, there are recurrent and persistent patterns of a preference for sexual activity that is illegal or harmful and no evidence of healthy sexual interests',
        'They are strongly aroused by illegal harmful sexual acts with little or no interest in consensual sex.'
      ],
      ['Shows some evidence of healthy sexual activity including consensual sex but shows behaviour that is recurrent and persistent or an interest in sexual activity that is illegal or harmful', null],
      [
        'No, they have healthy sexual interests rather than a preference for sexual activity that is illegal or harmful',
        'While offending, they may have engaged in sexual activity that is illegal but their preferred route to meeting their sexual needs is both legal and consensual.'
      ],
      ['Unknown', null],
    ).forEach(([option, hint ])=> {
      it(`summary page displays "${option}"`, () => {
       cy.getQuestion(question).getRadio(option).clickLabel()

        cy.getQuestion(question)
        .getRadio(option)
        .hasHint(hint)

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
