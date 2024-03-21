export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Why does Sam have no accommodation?'
  describe(question, () => {
    const options = [
      'Alcohol related problems',
      'Drug related problems',
      'Financial difficulties',
      'Left previous accommodation due to risk to others',
      'Left previous accommodation for their own safety',
      'No accommodation when released from prison',
      'Other',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Consider current and past homelessness issues', 'Select all that apply.')
        .hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select why they have no accommodation')
    })

    const optionsWithConditionals = ['Other']

    optionsWithConditionals.forEach(option => {
      it(`details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .hasHint(null)
          .getConditionalQuestion()
          .hasTitle('Give details')
          .hasLimit(400)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasValidationError('Enter details')

        cy.getQuestion(question).getCheckbox(option).hasHint(null).getConditionalQuestion().enterText('Some details')

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('Some details')
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    options
      .filter(it => !optionsWithConditionals.includes(it))
      .forEach(option => {
        it(`no details field is displayed for "${option}"`, () => {
          cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

          cy.getQuestion(question).getCheckbox(option).hasHint(null).hasConditionalQuestion(false)
        })
      })
  })
}
