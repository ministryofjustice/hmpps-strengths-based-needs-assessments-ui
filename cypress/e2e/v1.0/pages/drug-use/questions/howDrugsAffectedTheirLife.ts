export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = `How has Sam's drug use affected their life?`

  describe(question, () => {
    const options = [
      ['Behaviour', 'Includes unemployment, disruption on education or lack of productivity.'],
      ['Community', 'Includes limited opportunities or judgement from others.'],
      ['Finances', 'Includes having no money.'],
      ['Links to offending', null],
      ['Physical or mental health', 'Includes overdose.'],
      ['Relationships', 'Includes isolation or neglecting responsibilities.'],
      ['Other', null],
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Select all that apply.')
        .hasCheckboxes(options.map(it => it[0]))

      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select how their drug use has affected their life')
      cy.checkAccessibility()
    })

    options.forEach(([option, hint]) => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasHint(hint).hasConditionalQuestion(false).clickLabel()

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
