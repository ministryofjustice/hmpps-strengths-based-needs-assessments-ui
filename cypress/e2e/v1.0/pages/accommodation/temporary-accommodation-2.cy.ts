import suitableAccommodation from './questions/suitableAccommodation'
import suitableAccommodationPlanned from './questions/suitableAccommodationPlanned'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/temporary-accommodation-2', () => {
  const stepUrl = '/temporary-accommodation-2'
  const summaryPage = '/accommodation-analysis'
  const questions = [suitableAccommodation, suitableAccommodationPlanned, wantToMakeChanges]

  before(() => {
    cy.createAssessment()
    cy.visitStep('/accommodation')
    cy.assertSectionIs('Accommodation')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Temporary').clickLabel()

    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('Temporary')
      .getConditionalQuestion()
      .getRadio('Approved premises')
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

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
