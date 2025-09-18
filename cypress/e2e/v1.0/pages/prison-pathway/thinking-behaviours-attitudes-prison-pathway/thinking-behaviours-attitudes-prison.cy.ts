import consequences from '../../thinking-behaviours-attitudes/questions/consequences'
import criminalBehaviour from '../../thinking-behaviours-attitudes/questions/criminal-behaviour'
import hostileOrientation from '../../thinking-behaviours-attitudes/questions/hostile-orientation'
import impulsiveBehaviour from '../../thinking-behaviours-attitudes/questions/impulsive-behaviour'
import managingTemper from '../../thinking-behaviours-attitudes/questions/managing-temper'
import manipulativePredatoryBehaviour from '../../thinking-behaviours-attitudes/questions/manipulative-predatory-behaviour'
import offendingActivities from '../../thinking-behaviours-attitudes/questions/offending-activities'
import peerPressure from '../../thinking-behaviours-attitudes/questions/peer-pressure'
import peoplesViews from '../../thinking-behaviours-attitudes/questions/peoples-views'
import positiveAttitude from './questions/positive-attitude'
import problemSolving from '../../thinking-behaviours-attitudes/questions/problem-solving'
import stableBehaviour from '../../thinking-behaviours-attitudes/questions/stable-behaviour'
import prisonSentence from './questions/prison-sentence'
import violenceControllingBehaviour from '../../thinking-behaviours-attitudes/questions/violence-controlling-behaviour'
import wantToMakeChanges from '../../thinking-behaviours-attitudes/questions/wantToMakeChanges'
import { Fixture } from '../../../../../support/commands/fixture'

describe('/thinking-behaviours-attitudes-prison', () => {
  const stepUrl = '/thinking-behaviours-attitudes-prison'
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
    prisonSentence,
    criminalBehaviour,
    wantToMakeChanges,
  ]

  beforeEach(() => {
    cy.loadFixture(Fixture.PrisonPathway).enterAssessment()
    cy.visitSection('Thinking, behaviours and attitudes')
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Thinking, behaviours and attitudes', stepUrl)
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
