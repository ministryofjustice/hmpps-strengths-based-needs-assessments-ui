import consequences from './questions/consequences'
import manipulativePredatoryBehaviour from './questions/manipulative-predatory-behaviour'
import offendingActivities from './questions/offending-activities'
import peerPressure from './questions/peer-pressure'
import peoplesViews from './questions/peoples-views'
import problemSolving from './questions/problem-solving'
import riskOfSexualHarm from './questions/risk-of-sexual-harm'
import stableBehaviour from './questions/stable-behaviour'


describe('/thinking-behaviours', () => {
  const stepUrl = '/thinking-behaviours'
  const summaryPage = '/thinking-behaviours-attitudes-summary-analysis'
  const questions = 
  [
    consequences,
    stableBehaviour,
    offendingActivities,
    peerPressure,
    problemSolving,
    peoplesViews,
    manipulativePredatoryBehaviour,
    riskOfSexualHarm,
  ]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Thinking, behaviours and attitudes')
    cy.getQuestion('Is Sam aware of the consequences of their actions?').getRadio('Yes, is aware of the consequences of their actions').clickLabel()
    cy.getQuestion('Does Sam show stable behaviour?').getRadio('Yes, shows stable behaviour').clickLabel()
    cy.getQuestion('Does Sam engage in activities that could link to offending?').getRadio('Engages in pro-social activities and understands the link to offending').clickLabel()
    cy.getQuestion('Is Sam resilient towards peer pressure or influence by criminal associates?').getRadio('Yes, resilient towards peer pressure or influence by criminal associates').clickLabel()
    cy.getQuestion('Is Sam able to solve problems in a positive way?').getRadio('Yes, is able to solve problems and identify appropriate solutions').clickLabel()
    cy.getQuestion("Does Sam understand other people's views?").getRadio("Yes, understands other people's views and is able to distinguish between their own feelings and those of others").clickLabel()
    cy.getQuestion('Does Sam show manipulative behaviour or a predatory lifestyle?').getRadio('Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle').clickLabel()
    cy.getQuestion('Are there any concerns that Sam is a risk of sexual harm?').getRadio('No').clickLabel()
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