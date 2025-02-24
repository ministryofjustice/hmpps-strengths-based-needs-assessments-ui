import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Was Sam the leader in regard to committing the current index offence(s)?'

  describe(question, () => {
    const options = ['Yes', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)
      cy.markAsComplete()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they were the leader')
      cy.checkAccessibility()
    })

    it(`mandatory conditional field is displayed for "Yes"`, () => {
      cy.getQuestion(question).getRadio('Yes').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasHint(null)
        .hasLimit(config.characterLimit.c4000)

      cy.markAsComplete()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasValidationError('Enter details')
        .enterText('Some text')

      cy.checkAccessibility()

      cy.markAsComplete()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes').hasSecondaryAnswer('Some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getRadio('Yes').isChecked().getConditionalQuestion().hasText('Some text')
    })

    it(`optional conditional field is displayed for "No"`, () => {
      cy.getQuestion(question).getRadio('No').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getRadio('No')
        .getConditionalQuestion()
        .hasTitle('Give details (optional)')
        .hasHint(null)
        .hasLimit(config.characterLimit.c4000)

      cy.markAsComplete()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('No')
        .getConditionalQuestion()
        .hasNoValidationError()
        .enterText('Some text')

      cy.checkAccessibility()

      cy.markAsComplete()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('No').hasSecondaryAnswer('Some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getRadio('No').isChecked().getConditionalQuestion().hasText('Some text')
    })
  })
}
