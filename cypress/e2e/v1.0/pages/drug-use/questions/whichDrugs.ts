import { drugName, drugs } from '../common/drugs'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Which drugs has Sam misused?'

  describe(question, () => {
    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Select all that apply.')
        .hasCheckboxes(drugs.map(drug => drug.name))

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(`Select which drugs they've misused`)

      cy.checkAccessibility()
    })

    const lastUsedOptions = ['Used in the last 6 months', 'Used more than 6 months ago']

    drugs.forEach(({ name: drug, injectable }) => {
      if (drug === 'Other') {
        it('displays and validates the conditional questions', () => {
          cy.getQuestion(question)
            .getCheckbox(drug)
            .hasHint(null)
            .isNotChecked()
            .hasConditionalQuestion(false)
            .clickLabel()
          cy.getQuestion(question)
            .getCheckbox(drug)
            .getNthConditionalQuestion(0)
            .hasHint('Add drug name')
            .hasNoValidationError()
            .hasText('')
          cy.getQuestion(question)
            .getCheckbox(drug)
            .getNthConditionalQuestion(1)
            .hasHint(null)
            .hasNoValidationError()
            .hasRadios(lastUsedOptions)
          cy.saveAndContinue()

          cy.assertStepUrlIs(stepUrl)
          cy.getQuestion(question)
            .getCheckbox(drug)
            .getNthConditionalQuestion(0)
            .hasValidationError(`Enter which other drug they've misused`)
          cy.getQuestion(question)
            .getCheckbox(drug)
            .getNthConditionalQuestion(1)
            .hasValidationError(`Select when they last used this drug`)

          cy.checkAccessibility()
        })
      } else {
        it('displays and validates the conditional question', () => {
          cy.getQuestion(question)
            .getCheckbox(drug)
            .hasHint(null)
            .isNotChecked()
            .hasConditionalQuestion(false)
            .clickLabel()
          cy.getQuestion(question)
            .getCheckbox(drug)
            .getConditionalQuestion()
            .hasHint(null)
            .hasNoValidationError()
            .hasRadios(lastUsedOptions)
          cy.saveAndContinue()

          cy.assertStepUrlIs(stepUrl)
          cy.getQuestion(question)
            .getCheckbox(drug)
            .getConditionalQuestion()
            .hasValidationError(`Select when they last used this drug`)

          cy.checkAccessibility()
        })
      }

      lastUsedOptions.forEach(lastUsed => {
        it(`summary page displays "${drug} - ${lastUsed}"`, () => {
          cy.visitStep(stepUrl)
          cy.getQuestion(question).getCheckbox(drug).clickLabel()

          if (drug === 'Other') {
            cy.getQuestion(question).getCheckbox(drug).getNthConditionalQuestion(0).enterText('Cake')
            cy.getQuestion(question).getCheckbox(drug).getNthConditionalQuestion(1).getRadio(lastUsed).clickLabel()
          } else {
            cy.getQuestion(question).getCheckbox(drug).getConditionalQuestion().getRadio(lastUsed).clickLabel()
          }

          cy.saveAndContinue()

          let drugCardSection = 'Not used in the last 6 months'
          let lastUsedSummaryText = 'More than 6 months ago'
          const expectedCardItems = ['Last used']
          if (lastUsed === 'Used in the last 6 months') {
            drugCardSection = lastUsed
            lastUsedSummaryText = 'In the last 6 months'
            expectedCardItems.push('How often', 'Give details (optional)')
          }
          if (injectable) {
            expectedCardItems.push('Injected')
          }

          cy.visitStep(summaryPage)
          cy.checkAccessibility()
          cy.getDrugSummaryCard(drugName(drug), drugCardSection).hasCardItems(expectedCardItems.length).changeDrug()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
          cy.getQuestion(question).getCheckbox(drug).isChecked()

          cy.visitStep(summaryPage)
          cy.getDrugSummaryCard(drugName(drug), drugCardSection)
            .getCardItem('Last used')
            .hasCardItemAnswers(lastUsedSummaryText)
            .clickChange()
          cy.assertStepUrlIs(stepUrl)
          if (drug === 'Other') {
            cy.getQuestion(question).getCheckbox(drug).isChecked().getNthConditionalQuestion(0).hasText('Cake')
            cy.getQuestion(question)
              .getCheckbox(drug)
              .isChecked()
              .getNthConditionalQuestion(1)
              .getRadio(lastUsed)
              .isChecked()
          } else {
            cy.getQuestion(question)
              .getCheckbox(drug)
              .isChecked()
              .getConditionalQuestion()
              .getRadio(lastUsed)
              .isChecked()
          }
        })
      })
    })
  })
}
