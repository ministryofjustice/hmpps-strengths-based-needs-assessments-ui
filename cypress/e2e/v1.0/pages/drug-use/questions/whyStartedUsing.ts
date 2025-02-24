import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Why did Sam start using drugs?'

  describe(question, () => {
    const options = [
      'Cultural or religious practices',
      'Curiosity or experimentation',
      'Enhance performance',
      'Escapism or avoidance',
      'Manage stress or emotional issues',
      'Peer pressure or social influence',
      'Recreation or pleasure',
      'Self-medication for pain',
      'Other',
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Consider their history and any triggers of drug use.', 'Select all that apply.')
        .hasCheckboxes(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select why they started using drugs')

      cy.checkAccessibility()
    })

    options
      .filter(option => option !== 'Other')
      .forEach(option => {
        it(`summary page displays "${option}"`, () => {
          cy.visitStep(stepUrl)
          cy.getQuestion(question).getCheckbox(option).hasHint(null).clickLabel()
          cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false)

          cy.saveAndContinue()

          cy.visitStep(summaryPage)
          cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
          cy.checkAccessibility()
          cy.getSummary(question).clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
          cy.getQuestion(question).getCheckbox(option).isChecked()
        })
      })

    it(`details field is displayed for "Other"`, () => {
      cy.visitStep(stepUrl)

      cy.getQuestion(question).getCheckbox('Other').hasHint(null).hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Other')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasLimit(config.characterLimit.default)
        .hasNoValidationError()

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getCheckbox('Other')
        .getConditionalQuestion()
        .hasValidationError('Enter details')

      cy.getQuestion(question).getCheckbox('Other').getConditionalQuestion().enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Other').hasSecondaryAnswer('Some details')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getCheckbox('Other').isChecked()
      cy.getQuestion(question).getCheckbox('Other').getConditionalQuestion().hasText('Some details')
    })
  })
}
