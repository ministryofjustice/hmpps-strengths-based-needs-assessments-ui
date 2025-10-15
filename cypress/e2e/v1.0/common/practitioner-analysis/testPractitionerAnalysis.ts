import linkedToRiskOfSeriousHarm from './questions/linkedToRiskOfSeriousHarm'
import linkedToRiskOfReoffending from './questions/linkedToRiskOfReoffending'
import strengthsOrProtectiveFactors from './questions/strengthsOrProtectiveFactors'

export default (analysisPage: string, analysisCompletePage: string, sectionName: string) => {
  describe(`${analysisPage} - Practitioner Analysis`, () => {
    describe('questions are displayed and validated', () => {
      const questions = [strengthsOrProtectiveFactors, linkedToRiskOfSeriousHarm, linkedToRiskOfReoffending]

      beforeEach(() => {
        cy.assertQuestionCount(questions.length)
      })

      questions.forEach((questionTest, index) => {
        // skip the "Give details" questions, as they are tested within the main question tests
        questionTest(analysisPage, analysisCompletePage, index + 1, sectionName)
      })
    })
  })
}
