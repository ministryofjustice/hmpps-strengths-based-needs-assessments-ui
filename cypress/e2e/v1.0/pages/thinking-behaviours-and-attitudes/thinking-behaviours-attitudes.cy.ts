import consequences from './questions/consequences'
import manipulativePredatoryBehaviour from './questions/manipulative-predatory-behaviour'
import offendingActivities from './questions/offending-activities'
import peerPressure from './questions/peer-pressure'
import peoplesViews from './questions/peoples-views'
import problemSolving from './questions/problem-solving'
import riskOfSexualHarm from './questions/risk-of-sexual-harm'
import stableBehaviour from './questions/stable-behaviour'


describe('/thinking-behaviours-attitudes', () => {
  const stepUrl = '/thinking-behaviours-attitudes'
  const summaryPage = '/thinking-behaviours-attitudes-analysis'
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

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Thinking, behaviours and attitudes')
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
