export default (summaryPage: string, analysisCompletePage: string, positionNumber: number, sectionName: string) => {
  const question = `Is Sam's ${sectionName} linked to risk of serious harm?`
  const summaryQuestion = 'Linked to risk of serious harm'

  describe(question, () => {
    const options = ['Yes', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.markAsComplete()
      cy.assertStepUrlIs(summaryPage)
      cy.getQuestion(question).hasValidationError('Select if linked to risk of serious harm')
      cy.checkAccessibility()
    })

    it('"Give details" is optional when selecting "No"', () => {
      cy.getQuestion(question).getRadio('No').hasConditionalQuestion(false).clickLabel()
      cy.markAsComplete()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('No')
        .getConditionalQuestion()
        .hasTitle('Give details (optional)')
        .hasNoValidationError()
      cy.visitStep(analysisCompletePage)
      cy.get('#tab_practitioner-analysis').click()
      cy.getAnalysisSummary(summaryQuestion).getAnalysisAnswer('No').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getAnalysisSummary(summaryQuestion).clickChangeAnalysis()
      cy.assertStepUrlIs(summaryPage)
      cy.getQuestion(question)
    })

    it('"Give details" is required when selecting "Yes"', () => {
      cy.getQuestion(question).getRadio('Yes').hasConditionalQuestion(false).clickLabel()
      cy.markAsComplete()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasValidationError('Enter details')
        .enterText('some  details\nnew line<script>')
      cy.checkAccessibility()
      cy.markAsComplete()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasNoValidationError()
      cy.visitStep(analysisCompletePage)
      cy.get('#tab_practitioner-analysis').click()
      cy.getAnalysisSummary(summaryQuestion)
        .getAnalysisAnswer('Yes')
        .hasSecondaryAnalysisAnswer('some  details', 'new line<script>')
      cy.checkAccessibility()
      cy.getAnalysisSummary(summaryQuestion).clickChangeAnalysis()
      cy.assertStepUrlIs(summaryPage)
      cy.getQuestion(question)
        .getRadio('Yes')
        .isChecked()
        .getConditionalQuestion()
        .hasText('some  details\nnew line<script>')
    })
  })
}
