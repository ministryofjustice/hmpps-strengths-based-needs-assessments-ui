import { Fixture } from '../../../../support/commands/fixture'
import wantToMakeChanges from './questions/wantToMakeChanges'
import helpedToStopOrReduce from './questions/helpedToStopOrReduce'
import whyUseDrugs from './questions/whyUseDrugs'
import howDrugsAffectedTheirLife from './questions/howDrugsAffectedTheirLife'
import whyUseDrugsDetails from './questions/whyUseDrugsDetails'
import howDrugsAffectedTheirLifeDetails from './questions/howDrugsAffectedTheirLifeDetails'
import whatCouldHelp from './questions/whatCouldHelp'

describe('/drug-use-history-more-than-six-months', () => {
  const stepUrl = '/drug-use-history-more-than-six-months'
  const summaryPage = '/drug-use-summary'
  const questions = [
    whyUseDrugs(false),
    whyUseDrugsDetails(false),
    howDrugsAffectedTheirLife,
    howDrugsAffectedTheirLifeDetails,
    helpedToStopOrReduce,
    whatCouldHelp,
    wantToMakeChanges,
  ]

  before(() => {
    cy.loadFixture(Fixture.DrugUser).enterAssessment()

    cy.visitSection('Drug use').enterBackgroundSubsection()
    cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cannabis').clickLabel()
    cy.getQuestion('Which drugs has Sam misused?')
      .getCheckbox('Cannabis')
      .getConditionalQuestion()
      .getRadio('Used more than 6 months ago')
      .clickLabel()
    cy.saveAndContinue()

    cy.getQuestion(`Give details about Sam's cannabis use`).enterText('Test')
    cy.getQuestion('Has Sam ever received treatment for their drug use?').getRadio('No').clickLabel()
    cy.saveAndContinue()

    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Drug use', 'Drug use background', stepUrl)
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
