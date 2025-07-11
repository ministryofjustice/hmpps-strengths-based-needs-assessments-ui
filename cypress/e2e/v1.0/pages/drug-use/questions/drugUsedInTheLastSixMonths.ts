import config from '../../../../../support/config'
import { drugName } from '../common/drugs'

export default (drug: string, injectable: boolean, stepUrl: string, summaryPage: string) => {
  const frequencyQuestion = 'How often is Sam using this drug?'
  const detailsQuestion = 'Give details (optional)'
  const drugCardSection = 'Used in the last 6 months'
  const expectedDrugCardItems = injectable ? 4 : 3

  describe(`${drug} - ${frequencyQuestion}`, () => {
    const frequencies = ['Daily', 'Weekly', 'Monthly', 'Occasionally']

    it(`displays and validates the question`, () => {
      cy.getDrugQuestion(drugName(drug), frequencyQuestion).hasHint(null).hasRadios(frequencies)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getDrugQuestion(drugName(drug), frequencyQuestion).hasValidationError(
        "Select how often they're using this drug",
      )
      cy.checkAccessibility()
    })

    frequencies.forEach(frequency => {
      it(`summary page displays "${drug}" used "${frequency}"`, () => {
        cy.getDrugQuestion(drugName(drug), frequencyQuestion)
          .getRadio(frequency)
          .hasConditionalQuestion(false)
          .clickLabel()

        cy.getDrugQuestion(drugName(drug), frequencyQuestion).getRadio(frequency).hasConditionalQuestion(false)

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.checkAccessibility()

        cy.getDrugSummaryCard(drugName(drug), drugCardSection)
          .hasCardItems(expectedDrugCardItems)
          .getCardItem('How often')
          .hasCardItemAnswers(frequency)
          .clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertDrugQuestionUrl(drugName(drug), frequencyQuestion)
        cy.getDrugQuestion(drugName(drug), frequencyQuestion).getRadio(frequency).isChecked()
      })
    })
  })

  describe(`${drug} - ${detailsQuestion}`, () => {
    it(`optional details field is displayed for "${drug}"`, () => {
      cy.getDrugQuestion(drugName(drug), frequencyQuestion).getRadio('Daily').clickLabel()
      cy.getDrugQuestion(drugName(drug), detailsQuestion).hasHint(null).hasLimit(config.characterLimit.default)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getDrugQuestion(drugName(drug), detailsQuestion).hasNoValidationError().enterText('Some text')
      cy.checkAccessibility()
      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.checkAccessibility()
      cy.getDrugSummaryCard(drugName(drug), drugCardSection)
        .hasCardItems(expectedDrugCardItems)
        .getCardItem(detailsQuestion)
        .hasCardItemAnswers('Some text')
        .clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertDrugQuestionUrl(drugName(drug), detailsQuestion)
      cy.getDrugQuestion(drugName(drug), detailsQuestion).hasText('Some text')
    })
  })
}
