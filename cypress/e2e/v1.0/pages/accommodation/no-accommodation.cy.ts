import noAccommodationReason from './questions/noAccommodationReason'
import pastAccommodationDetails from './questions/pastAccommodationDetails'
import suitableAccommodationPlanned from './questions/suitableAccommodationPlanned'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/no-accommodation', () => {
  const stepUrl = '/no-accommodation'
  const summaryPage = '/accommodation-analysis'
  const questions = [noAccommodationReason, pastAccommodationDetails, suitableAccommodationPlanned, wantToMakeChanges]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Accommodation')

    cy.getQuestion("What is Sam's current accommodation?").getRadio('No accommodation').clickLabel()

    cy.getQuestion("What is Sam's current accommodation?")
      .getRadio('No accommodation')
      .getConditionalQuestion()
      .getRadio('Campsite')
      .clickLabel()

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertQuestionCount(questions.length)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })
})
