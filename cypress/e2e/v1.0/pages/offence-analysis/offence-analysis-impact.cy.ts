import whoWasTheLeader from './questions/whoWasTheLeader'
import recogniseImpactOnVictims from './questions/recogniseImpactOnVictims'
import acceptResponsibility from './questions/acceptResponsibility'
import patternsOfOffending from './questions/patternsOfOffending'
import escalationInSeriousness from './questions/escalationInSeriousness'
import linkedToRiskOfSeriousHarm from './questions/linkedToRiskOfSeriousHarm'
import perpetratorOfDomesticAbuse from './questions/perpetratorOfDomesticAbuse'
import victimOfDomesticAbuse from './questions/victimOfDomesticAbuse'

describe('/offence-analysis-impact', () => {
  const stepUrl = '/offence-analysis-impact'
  const summaryPage = '/offence-analysis-summary'
  const questions = [
    whoWasTheLeader,
    recogniseImpactOnVictims,
    acceptResponsibility,
    patternsOfOffending,
    escalationInSeriousness,
    linkedToRiskOfSeriousHarm,
    perpetratorOfDomesticAbuse,
    victimOfDomesticAbuse,
  ]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Offence analysis')

    cy.getQuestion('Enter a brief description of the current index offence(s)').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) have any of the following elements?')
      .getCheckbox('Arson')
      .clickLabel()
    cy.getQuestion('Why did the current index offence(s) happen?').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) involve any of the following motivations?')
      .getCheckbox('Thrill seeking')
      .clickLabel()
    cy.getQuestion('Who was the victim?').getCheckbox('Other').clickLabel()
    cy.getQuestion('Who was the victim?').getCheckbox('Other').getConditionalQuestion().enterText('¯\\_(ツ)_/¯')
    cy.saveAndContinue()

    cy.getQuestion('How many other people were involved with committing the current index offence(s)?')
      .getRadio('There was no one else involved')
      .clickLabel()
    cy.saveAndContinue()

    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Offence analysis', stepUrl)

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
