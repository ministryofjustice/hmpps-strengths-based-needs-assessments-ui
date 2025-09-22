import config from '../../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Where does Sam get their money from in custody?'
  describe(question, () => {
    const options = [
      'Employment',
      'Family or friends',
      'Private pension',
      'Unemployment pay',
      'Other',
      'Unknown',
      null,
      'No money',
    ]

    const knownSources = ['Employment', 'Family or friends', 'Private pension', 'Unemployment pay']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        "Select where they currently get their money from, or select 'No money'",
      )
      cy.checkAccessibility()
    })

    Array.of('Other', 'No money').forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(null)
          .hasLimit(config.characterLimit.default)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
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
        cy.getQuestion(question).getCheckbox(option).isChecked().getConditionalQuestion().hasText('some text')
      })
    })

    knownSources.forEach(option => {
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

    Array.of('Unknown', 'No money').forEach(option => {
      it(`selecting "${option}" deselects other options`, () => {
        knownSources.forEach(knownSource => {
          cy.getQuestion(question).getCheckbox(knownSource).clickLabel()

          cy.getQuestion(question).getCheckbox(knownSource).isChecked()
        })

        cy.getQuestion(question).getCheckbox(option).clickLabel()

        knownSources.forEach(knownSource => {
          cy.getQuestion(question).getCheckbox(knownSource).isNotChecked()
        })

        cy.checkAccessibility()
      })

      it(`selecting "${option}" then selecting other options deselects "${option}"`, () => {
        knownSources.forEach(knownSource => {
          cy.getQuestion(question).getCheckbox(option).clickLabel()

          cy.getQuestion(question).getCheckbox(option).isChecked()

          cy.getQuestion(question).getCheckbox(knownSource).clickLabel()

          cy.getQuestion(question).getCheckbox(knownSource).isChecked()

          cy.getQuestion(question).getCheckbox(option).isNotChecked()
        })
        cy.checkAccessibility()
      })
    })
  })
}
