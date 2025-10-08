import { Fixture } from '../../../../support/commands/fixture'
import receivingTreatment from './questions/receivingTreatment'
import detailsAboutUseOfTheseDrugs from './questions/detailsAboutUseOfTheseDrugs'

describe('/drug-details-more-than-six-months', () => {
  const stepUrl = '/drug-details-more-than-six-months'
  const usedDrug = ['Cannabis']
  const questions = [detailsAboutUseOfTheseDrugs, receivingTreatment(false)]

  before(() => {
    cy.loadFixture(Fixture.DrugUser).enterAssessment()
    cy.visitSection('Drug use').enterBackgroundSubsection()
    usedDrug.forEach(drug => {
      cy.getQuestion('Which drugs has Sam misused?').getCheckbox(drug).clickLabel()
      if (drug === 'Other') {
        cy.getQuestion('Which drugs has Sam misused?').getCheckbox(drug).getNthConditionalQuestion(0).enterText('Cake')
        cy.getQuestion('Which drugs has Sam misused?')
          .getCheckbox(drug)
          .getNthConditionalQuestion(1)
          .getRadio('Used more than 6 months ago')
          .clickLabel()
      } else {
        cy.getQuestion('Which drugs has Sam misused?')
          .getCheckbox(drug)
          .getConditionalQuestion()
          .getRadio('Used more than 6 months ago')
          .clickLabel()
      }
    })
    cy.saveAndContinue()

    cy.assertStepUrlIs(stepUrl)
    cy.hasDrugQuestionGroups(0)
    cy.assertQuestionCount(questions.length)

    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
    cy.assertResumeUrlIs('Drug use', 'Drug use background', stepUrl)

    cy.hasSubheading('Not used in the last 6 months', true)
    cy.hasSubheading('Used in the last 6 months', false)
    cy.get('label.not_used_in_last_six_months_details').contains('cannabis use')

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitSection('Drug use').enterBackgroundSubsection()
    cy.assertStepUrlIs(stepUrl)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
