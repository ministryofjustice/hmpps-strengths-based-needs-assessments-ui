import config from '../../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam have any skills that could help them in a job or to get a job?'
  describe(question, () => {
    const options = ['Yes', 'Some skills', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('This includes any skills gained in custody.')
        .hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        'Select if they have any skills that could help them in a job or to get a job',
      )
      cy.checkAccessibility()
    })
    Array.of(
      ['Yes', 'This includes any completed training, qualifications, work experience or transferable skills.'],
      [
        'Some skills',
        'This includes partially completed training or qualifications, limited on the job experience or skills that are not directly transferable.',
      ],
    ).forEach(([option, hint]) => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
          .hasHint(hint)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(null)
          .hasLimit(config.characterLimit.default)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getRadio(option)
          .getConditionalQuestion()
          .hasNoValidationError()
          .enterText('details')

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('details')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getRadio(option).isChecked().getConditionalQuestion().hasText('details')
      })
    })

    it(`no conditional field is displayed for "No"`, () => {
      cy.getQuestion(question)
        .getRadio('No')
        .hasHint(
          'This includes having no other qualifications, incomplete apprenticeships or no history of working in the same industry.',
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
      cy.getQuestion(question).getRadio('No').isChecked()
    })
  })
}
