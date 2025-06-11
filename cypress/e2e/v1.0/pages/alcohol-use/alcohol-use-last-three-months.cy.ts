import alcoholFrequency from './questions/alcohol-frequency'
import alcoholUnits from './questions/alcohol-units'
import alcoholBingeDrinking from './questions/alcohol-binge-drinking'
import evidenceOfBingeDrinking from './questions/alcohol-evidence-binge-drinking'
import impactOfAlcohol from './questions/alcohol-impact-of-use'
import pastAlcoholIssues from './questions/alcohol-past-issues'
import reasonsForUse from './questions/alcohol-reasons-for-use'
import stoppedOrReducedAlcohol from './questions/alcohol-stopped-or-reduced'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/alcohol-use-last-three-months', () => {
  const stepUrl = '/alcohol-use-last-three-months'
  const summaryPage = '/alcohol-use-summary'
  const questions = [
    alcoholFrequency,
    alcoholUnits,
    alcoholBingeDrinking,
    evidenceOfBingeDrinking,
    pastAlcoholIssues,
    reasonsForUse,
    impactOfAlcohol,
    stoppedOrReducedAlcohol,
    wantToMakeChanges,
  ]

  before(() => {
    cy.createAssessment().enterAssessment().completePrivacyDeclaration()
    cy.visitSection('Alcohol use')
    cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('Yes, including the last 3 months').clickLabel()
    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Alcohol use', stepUrl)
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment().completePrivacyDeclaration()
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
