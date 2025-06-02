import config from '../../../../../support/config'

export default (summaryPage: string, analysisCompletePage: string, positionNumber: number, sectionName: string) => {
  const subjectPrefix = sectionName.endsWith('s') ? 'Are' : 'Is'
  const question = `${subjectPrefix} Sam's ${sectionName} linked to risk of serious harm?`
  const summaryQuestion = `${subjectPrefix} Sam's ${sectionName} linked to risk of serious harm?`

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
        .hasLimit(config.characterLimit.c1425)
        .hasNoValidationError()
      cy.visitStep(analysisCompletePage)
      cy.get('#tab_practitioner-analysis').click()
      cy.getAnalysisSummary(summaryQuestion).getAnalysisAnswer('No').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getAnalysisSummary(summaryQuestion).clickChangeAnalysis()
      cy.assertStepUrlIs(summaryPage)
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
        .hasValidationError('Enter details')
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
      cy.get('#tab_practitioner-analysis').click()
      cy.getAnalysisSummary(summaryQuestion)
        .getAnalysisAnswer('Yes')
        .hasSecondaryAnalysisAnswer('some  details', '  new line<script>')
      cy.checkAccessibility()
      cy.getAnalysisSummary(summaryQuestion).clickChangeAnalysis()
      cy.assertStepUrlIs(summaryPage)
      cy.getQuestion(question)
        .getRadio('Yes')
        .isChecked()
        .getConditionalQuestion()
        .hasText('some  details\n  new line<script>')
    })
  })
}
