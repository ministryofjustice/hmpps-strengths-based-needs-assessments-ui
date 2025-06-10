import { Fixture } from '../../../../../support/commands/fixture'
import { drugName, drugs } from './drugs'

export const summaryPage = '/drug-use-summary'

export const drugDetailsInjectedBefore = (stepUrl, questions) => () => {
  cy.loadFixture(Fixture.DrugUser).enterAssessment()
  cy.visitSection('Drug use')

  drugs.forEach(({ name: drug }) => {
    cy.getQuestion('Which drugs has Sam misused?').getCheckbox(drug).clickLabel()
    if (drug === 'Other') {
      cy.getQuestion('Which drugs has Sam misused?').getCheckbox(drug).getNthConditionalQuestion(0).enterText('Cake')
      cy.getQuestion('Which drugs has Sam misused?')
        .getCheckbox(drug)
        .getNthConditionalQuestion(1)
        .getRadio('Used in the last 6 months')
        .clickLabel()
    } else {
      cy.getQuestion('Which drugs has Sam misused?')
        .getCheckbox(drug)
        .getConditionalQuestion()
        .getRadio('Used in the last 6 months')
        .clickLabel()
    }
  })
  cy.saveAndContinue()

  cy.assertStepUrlIs(stepUrl)
  cy.hasDrugQuestionGroups(drugs.length)
  drugs.forEach(({ name: drug }) => {
    cy.hasQuestionsForDrug(drugName(drug), 2)
  })
  cy.assertQuestionCount(questions.length)

  cy.hasAutosaveEnabled()
  cy.hasFeedbackLink()
  cy.assertResumeUrlIs('Drug use', stepUrl)

  cy.hasSubheading('Not used in the last 6 months', false)
  cy.hasSubheading('Used in the last 6 months', true)

  cy.captureAssessment()
}

export const drugDetailsInjectedBeforeEach = (stepUrl) => () => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitSection('Drug use')
  cy.assertStepUrlIs(stepUrl)
}

