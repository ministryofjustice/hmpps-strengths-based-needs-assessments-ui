export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Has Sam shown evidence of binge drinking or excessive alcohol use in the last 6 months?'
  describe(question, () => {
    const options = [
      ['No evidence of binge drinking or excessive alcohol use', null],
      [
        'Some evidence of binge drinking or excessive alcohol use',
        'There is a pattern of alcohol use but has not caused any serious problems.',
      ],
      [
        'Evidence of binge drinking or excessive alcohol use',
        'There is a detrimental effect on other areas of their life and is often directly related to offending.',
      ],
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint(null)
        .hasRadios(options.map(([label]) => label))
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        "Select if there's evidence of binge drinking or excessive alcohol use in the last 6 months",
      )
      cy.checkAccessibility()
    })

    const selectableOptions = options.filter(([label]) => label !== null)

    selectableOptions.forEach(([option, hint]) => {
      it(`summary page displays "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(hint).clickLabel()
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
