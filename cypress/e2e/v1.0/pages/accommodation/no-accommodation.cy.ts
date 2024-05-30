import noAccommodationReason from './questions/noAccommodationReason'
import pastAccommodationDetails from './questions/pastAccommodationDetails'
import suitableAccommodationPlanned from './questions/suitableAccommodationPlanned'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/no-accommodation', () => {
  const stepUrl = '/no-accommodation'
  const summaryPage = '/accommodation-analysis'
  const questions = [noAccommodationReason, pastAccommodationDetails, suitableAccommodationPlanned, wantToMakeChanges]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.assertSectionIs('Accommodation')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('No accommodation').clickLabel()

    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('No accommodation')
      .getConditionalQuestion()
      .getRadio('Campsite')
      .clickLabel()

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
