import consequences from './questions/consequences'
import criminalBehaviour from './questions/criminal-behaviour'
import hostileOrientation from './questions/hostile-orientation'
import impulsiveBehaviour from './questions/impulsive-behaviour'
import managingTemper from './questions/managing-temper'
import manipulativePredatoryBehaviour from './questions/manipulative-predatory-behaviour'
import offendingActivities from './questions/offending-activities'
import peerPressure from './questions/peer-pressure'
import peoplesViews from './questions/peoples-views'
import positiveAttitude from './questions/positive-attitude'
import problemSolving from './questions/problem-solving'
import stableBehaviour from './questions/stable-behaviour'
import supervision from './questions/supervision'
import violenceControllingBehaviour from './questions/violence-controlling-behaviour'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/thinking-behaviours-attitudes', () => {
  const stepUrl = '/thinking-behaviours-attitudes'
  const summaryPage = '/thinking-behaviours-attitudes-summary'
  const questions = [
    consequences,
    stableBehaviour,
    offendingActivities,
    peerPressure,
    problemSolving,
    peoplesViews,
    manipulativePredatoryBehaviour,
    managingTemper,
    violenceControllingBehaviour,
    impulsiveBehaviour,
    positiveAttitude,
    hostileOrientation,
    supervision,
    criminalBehaviour,
    wantToMakeChanges,
  ]

  beforeEach(() => {
    cy.createAssessment().enterAssessment().completePrivacyDeclaration()
    cy.visitSection('Thinking, behaviours and attitudes')
    cy.assertStepUrlIs(stepUrl)
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
