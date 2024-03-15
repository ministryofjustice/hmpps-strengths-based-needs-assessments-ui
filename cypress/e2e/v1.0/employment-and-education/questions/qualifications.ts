export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Does Paul have any professional or vocational qualifications?'
  describe(question, () => {
    const options = ['Yes', 'No', null, 'Not sure']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if they have any professional or vocational qualifications')
    })

    it(`conditional field is displayed for "Yes"`, () => {
      cy.getQuestion(question).getRadio('Yes').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details (optional)')
        .hasHint(null)
        .hasLimit(400)

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasNoValidationError()
        .enterText('some text')

      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes').hasSecondaryAnswer('some text')
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })
    ;['No', 'Not sure'].forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false)

        cy.saveAndContinue()
        cy.getQuestion(question).hasNoValidationError()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
  })
}
