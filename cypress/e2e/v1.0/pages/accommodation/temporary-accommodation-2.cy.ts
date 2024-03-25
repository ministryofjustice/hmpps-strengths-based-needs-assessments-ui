import suitableAccommodation from './questions/suitableAccommodation'
import suitableAccommodationPlanned from './questions/suitableAccommodationPlanned'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/temporary-accommodation-2', () => {
  const stepUrl = '/temporary-accommodation-2'
  const summaryPage = '/accommodation-analysis'
  const questions = [suitableAccommodation, suitableAccommodationPlanned, wantToMakeChanges]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Accommodation')

    cy.getQuestion("What is Sam's current accommodation?").getRadio('Temporary').clickLabel()

    cy.getQuestion("What is Sam's current accommodation?")
      .getRadio('Temporary')
      .getConditionalQuestion()
      .getRadio('Approved premises')
      .clickLabel()

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertQuestionCount(questions.length)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })
})
