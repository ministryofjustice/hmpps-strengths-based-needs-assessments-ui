import accommodationStatus from './questions/accommodationStatus'
import sections from '../../../../../app/form/v1_0/config/sections'
import { backgroundSubsectionName } from '../../journeys/common'

describe('/current-accommodation', () => {
  const stepUrl = '/current-accommodation'
  const summaryPage = `/${sections.accommodation.subsections.background.stepUrls.backgroundSummary}`
  const questions = [accommodationStatus]

  beforeEach(() => {
    cy.createAssessment().enterAssessment().enterBackgroundSubsection()
    cy.assertStepUrlIs(stepUrl)
  })

  it('Should set the resume URL correctly', () => {
    cy.assertResumeUrlIs('Accommodation', backgroundSubsectionName, stepUrl)
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
