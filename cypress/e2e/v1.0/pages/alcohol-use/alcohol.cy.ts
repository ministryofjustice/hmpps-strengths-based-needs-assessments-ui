import alcoholUse from './questions/alcohol-use'
import sections from '../../../../../app/form/v1_0/config/sections'

describe('/alcohol', () => {
  const stepUrl = '/alcohol'
  const summaryPage = `/${sections.alcohol.subsections.background.stepUrls.backgroundSummary}`
  const questions = [alcoholUse]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Alcohol use').enterBackgroundSubsection()
    cy.assertSectionIs('Alcohol use')
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
    cy.assertResumeUrlIs('Alcohol use', 'Alcohol use background', stepUrl)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
