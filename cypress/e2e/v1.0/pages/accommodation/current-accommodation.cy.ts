import accommodationStatus from './questions/accommodationStatus'
import sections from '../../../../../app/form/v1_0/config/sections'

describe('/current-accommodation', () => {
  const stepUrl = '/current-accommodation'
  const summaryPage = `/${sections.accommodation.subsections.background.stepUrls.backgroundSummary}`
  const questions = [accommodationStatus]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Accommodation', stepUrl)
    cy.assertSectionIs('Accommodation')
    cy.assertQuestionCount(1)
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
