import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam have any conditions or disabilities that impact their ability to learn? (optional)'
  describe(question, () => {
    const options = [
      'Yes, their ability to learn is significantly impacted',
      'Yes, their ability to learn is slightly impacted',
      'No, they do not have any conditions or disabilities that impact their ability to learn',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasRadios(options)
        .hasHint(
          'This refers to both learning disabilities (reduced intellectual ability) and learning difficulties (such as dyslexia or ADHD).',
        )
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasNoValidationError()
      cy.checkAccessibility()
    })

    Array.of(
      'Yes, their ability to learn is significantly impacted',
      'Yes, their ability to learn is slightly impacted',
    ).forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
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
          .enterText('some text')

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getRadio(option).isChecked().getConditionalQuestion().hasText('some text')
      })
    })

    Array.of('No, they do not have any conditions or disabilities that impact their ability to learn').forEach(
      option => {
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
      },
    )
  })
}
