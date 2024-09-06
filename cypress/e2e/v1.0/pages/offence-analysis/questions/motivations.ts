export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Did the current index offence(s) involve any of the following motivations?'
  describe(question, () => {
    const options = [
      'Addictions or perceived needs',
      'Being pressurised or led into offending by others',
      'Financial motivation',
      'Hatred of identifiable groups',
      'Seeking or exerting power',
      'Sexual motivation',
      'Thrill seeking',
      'Other',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)

      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if the offence(s) involved any of the following motivations')
      cy.checkAccessibility()
    })

    Array.of('Other').forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle('Give details')
          .hasHint(null)
          .hasLimit(400)

        cy.saveAndContinue()

        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasValidationError('Enter details')

        cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().enterText('some text')

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getCheckbox(option).isChecked().getConditionalQuestion().hasText('some text')
      })
    })

    Array.of(
      'Addictions or perceived needs',
      'Being pressurised or led into offending by others',
      'Financial motivation',
      'Hatred of identifiable groups',
      'Seeking or exerting power',
      'Sexual motivation',
      'Thrill seeking',
    ).forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false)

        cy.saveAndContinue()
        cy.getQuestion(question).hasNoValidationError()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getCheckbox(option).isChecked()
      })
    })
  })
}
