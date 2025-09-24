import config from '../../../../../support/config'

export default (analysisPage: string, analysisCompletePage: string, positionNumber: number, sectionName: string) => {
  const question = `Are there any strengths or protective factors related to Sam's ${sectionName}?`
  const summaryQuestion = question

  describe(question, () => {
    const options = ['Yes', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Include any strategies, people or support networks that helped.')
        .hasRadios(options)
      cy.markAsComplete()
      cy.assertStepUrlIs(analysisPage)
      cy.getQuestion(question).hasValidationError('Select if there are any strengths or protective factors')
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
        .hasLimit(config.characterLimit.c1425)
        .hasNoValidationError()
      cy.visitStep(analysisCompletePage)
      cy.getAnalysisSummary(summaryQuestion).getAnalysisAnswer('No').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getAnalysisSummary(summaryQuestion).clickChangeAnalysis()
      cy.assertStepUrlIs(analysisPage)
    })

    it('"Give details" is required when selecting "Yes"', () => {
      cy.getQuestion(question).getRadio('Yes').hasConditionalQuestion(false).clickLabel()
      cy.markAsComplete()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasLimit(config.characterLimit.c1425)
        .hasValidationError(`Give details on strengths or protective factors related to their ${sectionName}`)
        .enterText('some  details\n  new line<script>')
      cy.checkAccessibility()
      cy.markAsComplete()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getRadio('Yes')
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasNoValidationError()
      cy.visitStep(analysisCompletePage)
      cy.getAnalysisSummary(summaryQuestion)
        .getAnalysisAnswer('Yes')
        .hasSecondaryAnalysisAnswer('some  details', '  new line<script>')
      cy.checkAccessibility()
      cy.getAnalysisSummary(summaryQuestion).clickChangeAnalysis()
      cy.assertStepUrlIs(analysisPage)
      cy.getQuestion(question)
        .getRadio('Yes')
        .isChecked()
        .getConditionalQuestion()
        .hasText('some  details\n  new line<script>')
    })
  })
}
