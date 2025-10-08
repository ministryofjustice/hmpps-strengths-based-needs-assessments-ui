import { Fixture } from '../../../../support/commands/fixture'
import { drugName, drugs } from './common/drugs'
import receivingTreatment from './questions/receivingTreatment'
import drugUsedInTheLastSixMonths from './questions/drugUsedInTheLastSixMonths'

describe('/drug-details', () => {
  const stepUrl = '/drug-details'
  const summaryPage = '/drug-use-summary'
  const usedDrugs = drugs.filter(drug => !drug.injectable).map(drug => drug.name)
  const questions = [receivingTreatment(true)]

  before(() => {
    cy.loadFixture(Fixture.DrugUser).enterAssessment()
    cy.visitSection('Drug use').enterBackgroundSubsection()
    usedDrugs.forEach(drug => {
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
    cy.hasDrugQuestionGroups(usedDrugs.length)
    usedDrugs.forEach(drug => {
      cy.hasQuestionsForDrug(drugName(drug), 2)
    })
    cy.assertQuestionCount(questions.length)

    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
    cy.assertResumeUrlIs('Drug use', 'Drug use background', stepUrl)

    cy.hasSubheading('Not used in the last 6 months', false)
    cy.hasSubheading('Used in the last 6 months', true)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitSection('Drug use')
    cy.assertStepUrlIs(stepUrl)
  })

  usedDrugs.forEach(drug => {
    drugUsedInTheLastSixMonths(drug, false, stepUrl, summaryPage)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
