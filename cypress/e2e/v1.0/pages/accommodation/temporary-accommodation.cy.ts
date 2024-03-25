import livingWith from './questions/livingWith'
import suitableAccommodation from './questions/suitableAccommodation'
import suitableAccommodationLocation from './questions/suitableAccommodationLocation'
import suitableAccommodationPlanned from './questions/suitableAccommodationPlanned'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/temporary-accommodation', () => {
  const stepUrl = '/temporary-accommodation'
  const summaryPage = '/accommodation-analysis'
  const questions = [
    livingWith,
    suitableAccommodationLocation,
    suitableAccommodation,
    suitableAccommodationPlanned,
    wantToMakeChanges,
  ]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Accommodation')

    cy.getQuestion("What is Sam's current accommodation?").getRadio('Temporary').clickLabel()

    cy.getQuestion("What is Sam's current accommodation?")
      .getRadio('Temporary')
      .getConditionalQuestion()
      .getRadio('Short term accommodation')
      .clickLabel()

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertQuestionCount(questions.length)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })
})
