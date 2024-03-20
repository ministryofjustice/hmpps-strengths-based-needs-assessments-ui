export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam have skills that could help them in a job or at work?'
  describe(question, () => {
    const options = ['Yes', 'Yes, some skills', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they have skills that could help them in a job or at work')
      cy.checkAccessibility()
    })
    ;[
      ['Yes', 'This includes vocational qualifications, academic qualifications or transferable skills.'],
      [
        'Yes, some skills',
        'This includes skills that are not directly transferable, partially completed training or limited on the job experience.',
      ],
    ].forEach(([option, hint]) => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
          .hasHint(hint)
          .getConditionalQuestion()
          .hasTitle('Give details')
          .hasHint(null)
          .hasLimit(400)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getRadio(option)
          .getConditionalQuestion()
          .hasValidationError('Enter details')
          .enterText('details')

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('details')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    it(`no conditional field is displayed for "No"`, () => {
      cy.getQuestion(question)
        .getRadio('No')
        .hasHint(
          'This includes having no history of working in the same industry, no completed apprenticeships or no vocational qualifications.',
        )
        .hasConditionalQuestion(false)
        .clickLabel()

      cy.getQuestion(question).getRadio('No').hasConditionalQuestion(false)

      cy.saveAndContinue()
      cy.getQuestion(question).hasNoValidationError()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('No').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })
  })
}
