import livingWith from './questions/livingWith'
import suitableAccommodation from './questions/suitableAccommodation'
import suitableAccommodationLocation from './questions/suitableAccommodationLocation'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/settled-accommodation', () => {
  const stepUrl = '/settled-accommodation'
  const summaryPage = '/accommodation-analysis'
  const questions = [livingWith, suitableAccommodationLocation, suitableAccommodation, wantToMakeChanges]

  before(() => {
    cy.createAssessment()
    cy.assertSectionIs('Accommodation')

    cy.getQuestion("What is Sam's current accommodation?").getRadio('Settled').clickLabel()

    cy.getQuestion("What is Sam's current accommodation?")
      .getRadio('Settled')
      .getConditionalQuestion()
      .getRadio('Homeowner')
      .clickLabel()

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment()
    cy.visitStep(stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })
})
