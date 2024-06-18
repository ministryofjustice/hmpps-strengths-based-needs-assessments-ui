import alcoholUse from './questions/alcohol-use'
import alcoholFrequency from './questions/alcohol-frequency'
import alcoholUnits from './questions/alcohol-units'
// import alcohol binge drinking - add question once approved
import evidenceOfBingeDrinking from './questions/alcohol-evidence-binge-drinking'
import impactOfAlcohol from './questions/alcohol-impact-of-use'
import pastAlcoholIssues from './questions/alcohol-past-issues'
import reasonsForUse from './questions/alcohol-reasons-for-use'
import stoppedOrReducedAlcohol from './questions/alcohol-stopped-or-reduced'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/alcohol-use', () => {
  const stepUrl = '/alcohol-use'
  const summaryPage = '/alcohol-analysis'
  const questions = [
    alcoholUse,
    alcoholFrequency,
    alcoholUnits,
    evidenceOfBingeDrinking,
    impactOfAlcohol,
    pastAlcoholIssues,
    reasonsForUse,
    stoppedOrReducedAlcohol,
    wantToMakeChanges,
  ]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Alcohol use')
    cy.getQuestion("Has Sam ever drunk alcohol?").getRadio('Yes, but not in the last 3 months').clickLabel()
    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
