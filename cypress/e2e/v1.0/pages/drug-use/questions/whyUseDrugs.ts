export default (currentUse: boolean) => (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = currentUse ? 'Why does Sam use drugs?' : 'Why did Sam use drugs?'

  describe(question, () => {
    const options = [
      'Cultural or religious practice',
      'Curiosity or experimentation',
      'Enhance performance',
      'Escapism or avoidance',
      'Manage stress or emotional issues',
      'Peer pressure or social influence',
      'Recreation or pleasure',
      'Self-medication',
      'Other',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Consider why they started using, their history, and any triggers.', 'Select all that apply.')
        .hasCheckboxes(options)

      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        currentUse ? 'Select why they use drugs' : 'Select why they used drugs',
      )
      cy.checkAccessibility()
    })

    options.forEach(option => {
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
  })
}
