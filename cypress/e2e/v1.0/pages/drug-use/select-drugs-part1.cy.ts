import { Fixture } from '../../../../support/commands/fixture'
import testDrugUsageDetails from './common/testDrugUsageDetails'
import { drugs, drugsPart1 } from './common/drugs'

describe('/select-drugs - Part 1', () => {
  const stepUrl = '/select-drugs'
  const question = 'Which drugs has Sam used?'

  describe(question, () => {
    it('displays and validates the question', () => {
      cy.loadFixture(Fixture.DrugUser).enterAssessment()
      cy.visitSection('Drug use')
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionCount(1)
      cy.hasAutosaveEnabled()
      cy.hasFeedbackLink()

      cy.getQuestion(question)
        .isQuestionNumber(1)
        .hasHint('Include current and previous drugs.', 'Select all that apply.')
        .hasCheckboxes(drugs.map(({ name }) => name))
      cy.saveAndContinue()

      cy.getQuestion(question).hasValidationError('Select which drugs they have used')

      cy.checkAccessibility()
    })
  })

  drugsPart1.forEach(testDrugUsageDetails)
})
