import suitableAccommodation from './questions/suitableAccommodation'
import suitableAccommodationLocation from './questions/suitableAccommodationLocation'
import suitableAccommodationPlanned from './questions/suitableAccommodationPlanned'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/temporary-accommodation-cas-ap', () => {
  const stepUrl = '/temporary-accommodation-cas-ap'
  const summaryPage = '/accommodation-summary'
  const questions = [
    suitableAccommodationLocation,
    suitableAccommodation,
    suitableAccommodationPlanned,
    wantToMakeChanges,
  ]

  before(() => {
    cy.createAssessment().enterAssessment().completePrivacyDeclaration()
    cy.assertSectionIs('Accommodation')

    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Temporary').clickLabel()

    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('Temporary')
      .getConditionalQuestion()
      .getRadio('Approved premises')
      .clickLabel()

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Accommodation', stepUrl)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment().completePrivacyDeclaration()
    cy.visitStep(stepUrl)
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
