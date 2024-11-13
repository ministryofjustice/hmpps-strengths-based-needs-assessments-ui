import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam have any professional or vocational qualifications?'
  describe(question, () => {
    const options = ['Yes', 'No', null, 'Unknown']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they have any professional or vocational qualifications')
      cy.checkAccessibility()
    })

    it(`conditional field is displayed for "Yes"`, () => {
      cy.getQuestion(question).getRadio('Yes').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasHint(null)
        .hasLimit(config.characterLimit.c4000)

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasValidationError('Enter details')
        .enterText('Some text')

      cy.checkAccessibility()

      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes').hasSecondaryAnswer('Some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getRadio('Yes').isChecked().getConditionalQuestion().hasText('Some text')
    })
    Array.of('No', 'Unknown').forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

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
