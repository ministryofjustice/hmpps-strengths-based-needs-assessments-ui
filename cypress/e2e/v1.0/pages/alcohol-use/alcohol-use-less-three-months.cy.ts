import evidenceOfBingeDrinking from './questions/alcohol-evidence-binge-drinking'
import impactOfAlcohol from './questions/alcohol-impact-of-use'
import pastAlcoholIssues from './questions/alcohol-past-issues'
import reasonsForUse from './questions/alcohol-reasons-for-use'
import stoppedOrReducedAlcohol from './questions/alcohol-stopped-or-reduced'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/alcohol-use-less-three-months', () => {
  const stepUrl = '/alcohol-use-less-three-months'
  const summaryPage = '/alcohol-use-summary'
  const questions = [
    evidenceOfBingeDrinking,
    pastAlcoholIssues,
    reasonsForUse,
    impactOfAlcohol,
    stoppedOrReducedAlcohol,
    wantToMakeChanges,
  ]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Alcohol use')
    cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('Yes, but not in the last 3 months').clickLabel()
    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Alcohol use', stepUrl)
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
