import everMisusedDrugs from './questions/everMisusedDrugs'
import sections from '../../../../../app/form/v1_0/config/sections'

describe('/drug-use', () => {
  const stepUrl = '/drug-use'
  const summaryPage = `/${sections.drugsUse.subsections.background.stepUrls.backgroundSummary}`
  const questions = [everMisusedDrugs]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Drug use').enterBackgroundSubsection()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Drug use', 'Drug use background', stepUrl)
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
