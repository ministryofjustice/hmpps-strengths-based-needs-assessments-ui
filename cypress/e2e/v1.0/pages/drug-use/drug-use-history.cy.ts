import { Fixture } from '../../../../support/commands/fixture'
import wantToMakeChanges from './questions/wantToMakeChanges'
import helpedToStopOrReduce from './questions/helpedToStopOrReduce'
import whyUseDrugs from './questions/whyUseDrugs'
import howDrugsAffectedTheirLife from './questions/howDrugsAffectedTheirLife'
import whyUseDrugsDetails from './questions/whyUseDrugsDetails'
import howDrugsAffectedTheirLifeDetails from './questions/howDrugsAffectedTheirLifeDetails'
import { backgroundSubsectionName } from '../../journeys/common'

describe('/drug-use-history', () => {
  const stepUrl = '/drug-use-history'
  const summaryPage = '/drug-use-summary'
  const questions = [
    whyUseDrugs(true),
    whyUseDrugsDetails(true),
    howDrugsAffectedTheirLife,
    howDrugsAffectedTheirLifeDetails,
    helpedToStopOrReduce,
    wantToMakeChanges,
  ]

  before(() => {
    cy.loadFixture(Fixture.DrugUser).enterAssessment()

    cy.visitSection('Drug use').enterBackgroundSubsection()
    cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cannabis').clickLabel()
    cy.getQuestion('Which drugs has Sam misused?')
      .getCheckbox('Cannabis')
      .getConditionalQuestion()
      .getRadio('Used in the last 6 months')
      .clickLabel()
    cy.saveAndContinue()

    cy.getDrugQuestion('Cannabis', 'How often is Sam using this drug?').getRadio('Daily').clickLabel()
    cy.getQuestion('Is Sam receiving treatment for their drug use?').getRadio('No').clickLabel()
    cy.saveAndContinue()

    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Drug use', backgroundSubsectionName, stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitSection('Drug use').enterBackgroundSubsection()
    cy.assertStepUrlIs(stepUrl)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
