export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Sam have difficulties with reading, writing or numeracy?'
  describe(question, () => {
    const options = ['Yes, with reading', 'Yes, with writing', 'Yes, with numeracy', null, 'No difficulties']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        "Select if they have difficulties with reading, writing or numeracy, or select 'No difficulties'",
      )
      cy.checkAccessibility()
    })

    const levelsOfDifficulty = ['Significant difficulties', 'Some difficulties']

    ;['Yes, with reading', 'Yes, with writing', 'Yes, with numeracy'].forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .hasHint(null)
          .getConditionalQuestion()
          .hasTitle('Select level of difficulty')
          .hasHint(null)
          .hasRadios(levelsOfDifficulty)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasValidationError('Select level of difficulty')

        cy.checkAccessibility()
      })

      levelsOfDifficulty.forEach(levelOfDifficulty => {
        it(`summary page displays "${option} - ${levelOfDifficulty}"`, () => {
          cy.getQuestion(question).getCheckbox(option).clickLabel()
          cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().getRadio(levelOfDifficulty).clickLabel()
          cy.saveAndContinue()
          cy.visitStep(summaryPage)
          cy.getSummary(question).getAnswer(option).hasSecondaryAnswer(levelOfDifficulty)
          cy.checkAccessibility()
          cy.getSummary(question).clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
        })
      })
    })

    it(`no conditional field is displayed for "No difficulties"`, () => {
      cy.getQuestion(question).getCheckbox('No difficulties').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question).getCheckbox('No difficulties').hasConditionalQuestion(false)

      cy.saveAndContinue()
      cy.getQuestion(question).hasNoValidationError()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('No difficulties').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })
  })
}
