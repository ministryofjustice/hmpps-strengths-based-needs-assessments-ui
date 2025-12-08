import { Fixture } from '../../../../support/commands/fixture'
import { drugName, drugs } from './common/drugs'
import receivingTreatment from './questions/receivingTreatment'
import whichDrugsInjected from './questions/whichDrugsInjected'
import detailsAboutUseOfTheseDrugs from './questions/detailsAboutUseOfTheseDrugs'
import drugUsedInTheLastSixMonths from './questions/drugUsedInTheLastSixMonths'
import testPastUseDrugsList from './common/testPastUseDrugsList'

describe('/drug-details-more-than-six-months-injected', () => {
  const stepUrl = '/drug-details-more-than-six-months-injected'
  const summaryPage = '/drug-use-summary'
  const questions = [detailsAboutUseOfTheseDrugs, whichDrugsInjected(false), receivingTreatment(false)]

  before(() => {
    cy.loadFixture(Fixture.DrugUser).enterAssessment()
    cy.visitSection('Drug use')
    drugs.forEach(({ name: drug }) => {
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
    cy.assertResumeUrlIs('Drug use', stepUrl)

    cy.hasSubheading('Not used in the last 6 months', true)
    cy.hasSubheading('Used in the last 6 months', false)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitSection('Drug use')
    cy.assertStepUrlIs(stepUrl)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  testPastUseDrugsList(
    drugs.map(drug => drugName(drug.name)),
    stepUrl,
  )

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })

  drugs.forEach(({ name: drug, injectable }) => {
    describe(`${drug} was used in the last 6 months`, () => {
      beforeEach(() => {
        cy.visitStep('/add-drugs')
        if (drug === 'Other') {
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
        cy.saveAndContinue()

        cy.assertStepUrlIs(stepUrl)
        cy.hasSubheading('Not used in the last 6 months', true)
        cy.hasSubheading('Used in the last 6 months', true)
        cy.hasDrugQuestionGroups(1)
        cy.hasQuestionsForDrug(drugName(drug), 2)
      })

      drugUsedInTheLastSixMonths(drug, injectable, stepUrl, summaryPage)
    })
  })
})
