import attitudeTowardsSelf from './questions/attitudeTowardsSelf'
import copeWithDayToDayLife from './questions/copeWithDayToDayLife'
import headInjuryOrBrainIllness from './questions/headInjuryOrBrainIllness'
import learningDifficulties from './questions/learningDifficulties'
import neurodiverseCondition from './questions/neurodiverseCondition'
import optimisticAboutFuture from './questions/optimisticAboutFuture'
import positiveAspects from './questions/positiveAspects'
import selfHarmed from './questions/selfHarmed'
import suicide from './questions/suicide'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/health-wellbeing', () => {
  const stepUrl = '/no-physical-mental-health'
  const summaryPage = '/health-wellbeing-summary'
  const questions = [
    headInjuryOrBrainIllness,
    neurodiverseCondition,
    learningDifficulties,
    copeWithDayToDayLife,
    attitudeTowardsSelf,
    selfHarmed,
    suicide,
    optimisticAboutFuture,
    positiveAspects,
    wantToMakeChanges,
  ]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Health and wellbeing').enterBackgroundSubsection()

    cy.getQuestion('Does Sam have any physical health conditions?').getRadio('No').clickLabel()

    cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?').getRadio('No').clickLabel()

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Health and wellbeing', 'Assessment', stepUrl)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitSection('Health and wellbeing').enterBackgroundSubsection()
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
