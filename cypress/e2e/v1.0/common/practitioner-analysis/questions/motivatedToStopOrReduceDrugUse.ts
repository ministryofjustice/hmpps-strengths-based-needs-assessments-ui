export default (summaryPage: string, analysisCompletePage: string, positionNumber: number) => {
  const question = `Does Sam seem motivated to stop or reduce their drug use?`
  const summaryQuestion = question

  describe(question, () => {
    const options = [
      'Does not show motivation to stop or reduce',
      'Shows some motivation to stop or reduce',
      'Motivated to stop or reduce',
      'Unknown',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.markAsComplete()
      cy.assertStepUrlIs(summaryPage)
      cy.getQuestion(question).hasValidationError('Select if they seem motivated to stop or reduce their drug use')
      cy.checkAccessibility()
    })

    options.forEach(option => {
      it(`analysis summary page displays "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()
        cy.markAsComplete()
        cy.getQuestion(question).hasNoValidationError().getRadio(option).hasConditionalQuestion(false)
        cy.visitStep(analysisCompletePage)
        cy.get('#tab_practitioner-analysis').click()
        cy.getAnalysisSummary(summaryQuestion).getAnalysisAnswer(option).hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getAnalysisSummary(summaryQuestion).clickChangeAnalysis()
        cy.assertStepUrlIs(summaryPage)
      })
    })
  })
}
