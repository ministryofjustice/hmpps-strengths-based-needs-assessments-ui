export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Select the highest level of academic qualification Sam has completed'
  describe(question, () => {
    const options = [
      ['Entry level', 'For example, entry level diploma'],
      ['Level 1', 'For example, GCSE grades 3, 2, 1 or grades D, E, F, G'],
      ['Level 2', 'For example, GCSE grades 9, 8, 7, 6, 5, 4 or grades A*, A, B, C'],
      ['Level 3', 'For example, A level'],
      ['Level 4', 'For example, higher apprenticeship'],
      ['Level 5', 'For example, foundation degree'],
      ['Level 6', 'For example, degree with honours'],
      ['Level 7', "For example, master's degree"],
      ['Level 8', 'For example, doctorate'],
      [null, null],
      ['None of these', null],
      ['Not sure', null],
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint(null)
        .hasRadios(options.map(([label]) => label))
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select the highest level of academic qualification completed')
      cy.checkAccessibility()
    })

    const selectableOptions = options.filter(([label]) => label !== null)

    selectableOptions.forEach(([option, hint]) => {
      it(`summary page displays "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(hint).clickLabel()
        cy.saveAndContinue()
        cy.getQuestion(question).hasNoValidationError()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
  })
}
