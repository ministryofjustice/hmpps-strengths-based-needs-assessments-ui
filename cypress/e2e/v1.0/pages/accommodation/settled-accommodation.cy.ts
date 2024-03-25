import livingWith from './questions/livingWith'
import suitableAccommodation from './questions/suitableAccommodation'
import suitableAccommodationLocation from './questions/suitableAccommodationLocation'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/settled-accommodation', () => {
  const stepUrl = '/settled-accommodation'
  const summaryPage = '/accommodation-analysis'
  const questions = [livingWith, suitableAccommodationLocation, suitableAccommodation, wantToMakeChanges]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Accommodation')

    cy.getQuestion("What is Sam's current accommodation?").getRadio('Settled').clickLabel()

    cy.getQuestion("What is Sam's current accommodation?")
      .getRadio('Settled')
      .getConditionalQuestion()
      .getRadio('Homeowner')
      .clickLabel()

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertQuestionCount(questions.length)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })
})
