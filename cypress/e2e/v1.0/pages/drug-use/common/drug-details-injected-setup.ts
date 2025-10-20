import { Fixture } from '../../../../../support/commands/fixture'
import { drugName, drugs } from './drugs'
import whichDrugsInjected from '../questions/whichDrugsInjected'
import receivingTreatment from '../questions/receivingTreatment'

export const stepUrl = '/drug-details-injected'
export const summaryPage = '/drug-use-summary'
export const questions = [whichDrugsInjected(true), receivingTreatment(true)]

export const drugDetailsInjectedBefore = () => () => {
  cy.loadFixture(Fixture.DrugUser).enterAssessment()
  cy.visitSection('Drug use').enterBackgroundSubsection()

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
  cy.assertResumeUrlIs('Drug use', 'Assessment', stepUrl)

  cy.hasSubheading('Not used in the last 6 months', false)
  cy.hasSubheading('Used in the last 6 months', true)

  cy.captureAssessment()
}

export const drugDetailsInjectedBeforeEach = () => () => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitSection('Drug use').enterBackgroundSubsection()
  cy.assertStepUrlIs(stepUrl)
}
